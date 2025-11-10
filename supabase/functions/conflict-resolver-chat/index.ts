import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConflictChatRequest {
  conflictId: string;
  messages: Array<{ role: string; content: string }>;
  action?: 'chat' | 'resolve';
  resolutionStrategy?: 'keep_original' | 'accept_proposed' | 'merge';
  mergedContent?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { conflictId, messages, action, resolutionStrategy, mergedContent }: ConflictChatRequest = await req.json();

    // Get conflict details
    const { data: conflict, error: conflictError } = await supabase
      .from('conflict_resolutions')
      .select('*, knowledge_files(*)')
      .eq('id', conflictId)
      .single();

    if (conflictError) throw conflictError;

    // RESOLVE ACTION
    if (action === 'resolve') {
      let finalContent = conflict.original_content;

      if (resolutionStrategy === 'accept_proposed') {
        finalContent = conflict.proposed_content;
      } else if (resolutionStrategy === 'merge' && mergedContent) {
        finalContent = mergedContent;
      }

      // Update knowledge file
      const { error: updateError } = await supabase
        .from('knowledge_files')
        .update({
          content: finalContent,
          version: (conflict.knowledge_files.version || 1) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', conflict.file_id);

      if (updateError) throw updateError;

      // Create version entry
      await supabase
        .from('knowledge_file_versions')
        .insert({
          file_id: conflict.file_id,
          version_number: (conflict.knowledge_files.version || 1) + 1,
          content: finalContent,
          change_summary: `Conflict resolved: ${resolutionStrategy}`,
          changed_by: user.id
        });

      // Update conflict resolution
      await supabase
        .from('conflict_resolutions')
        .update({
          status: 'resolved',
          resolution_strategy: resolutionStrategy,
          merged_content: finalContent,
          resolved_by: user.id,
          resolved_at: new Date().toISOString()
        })
        .eq('id', conflictId);

      // Re-embed file
      await supabase.functions.invoke('file-manager', {
        body: {
          action: 're-embed',
          fileId: conflict.file_id
        }
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // CHAT ACTION - Stream response
    const systemPrompt = `You are a conflict resolution assistant for a knowledge base management system.

**Context:**
- File: ${conflict.knowledge_files.title} (${conflict.knowledge_files.file_key})
- Category: ${conflict.knowledge_files.category}
- Conflict Type: ${conflict.conflict_type}

**Original Content:**
${conflict.original_content}

**Proposed Content:**
${conflict.proposed_content}

**AI Analysis:**
${JSON.stringify(conflict.ai_recommendation, null, 2)}

Your job is to help the user understand the differences and decide how to resolve the conflict. Be concise and helpful. Suggest specific actions when appropriate.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        stream: true
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    // Update conversation history
    const updatedConversation = [...(conflict.ai_conversation || []), ...messages];
    await supabase
      .from('conflict_resolutions')
      .update({ ai_conversation: updatedConversation })
      .eq('id', conflictId);

    // Stream response back
    return new Response(aiResponse.body, {
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    console.error('Conflict resolver chat error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
