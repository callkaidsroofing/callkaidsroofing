import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConflictDetectRequest {
  fileId: string;
  proposedContent: string;
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

    const { fileId, proposedContent }: ConflictDetectRequest = await req.json();

    // Get current file content
    const { data: file, error: fileError } = await supabase
      .from('knowledge_files')
      .select('*')
      .eq('id', fileId)
      .single();

    if (fileError) throw fileError;

    const originalContent = file.content;

    // Check for simple equality
    if (originalContent.trim() === proposedContent.trim()) {
      return new Response(JSON.stringify({ 
        hasConflict: false, 
        message: 'No changes detected' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Use AI to analyze semantic differences
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are a conflict detection system for a knowledge base. Analyze the differences between original and proposed content. Identify:
1. Additions (new information)
2. Deletions (removed information)
3. Modifications (changed information)
4. Conflicts (contradictory information)

Return a JSON object with structure:
{
  "hasConflict": boolean,
  "conflictType": "content" | "none",
  "summary": "brief description",
  "additions": ["list of additions"],
  "deletions": ["list of deletions"],
  "modifications": ["list of modifications"],
  "recommendation": "keep_original" | "accept_proposed" | "merge" | "manual_review"
}`
          },
          {
            role: 'user',
            content: `**Original Content:**\n${originalContent}\n\n**Proposed Content:**\n${proposedContent}`
          }
        ],
        temperature: 0.3
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysis = aiData.choices[0].message.content;

    let parsedAnalysis;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysis.match(/```json\n([\s\S]*?)\n```/) || analysis.match(/```\n([\s\S]*?)\n```/);
      parsedAnalysis = JSON.parse(jsonMatch ? jsonMatch[1] : analysis);
    } catch (e) {
      parsedAnalysis = {
        hasConflict: true,
        conflictType: 'content',
        summary: 'Unable to parse AI analysis',
        recommendation: 'manual_review'
      };
    }

    // Create conflict resolution entry if conflict detected
    if (parsedAnalysis.hasConflict) {
      const { data: conflict, error: conflictError } = await supabase
        .from('conflict_resolutions')
        .insert({
          file_id: fileId,
          conflict_type: parsedAnalysis.conflictType || 'content',
          original_content: originalContent,
          proposed_content: proposedContent,
          ai_recommendation: parsedAnalysis,
          status: 'pending'
        })
        .select()
        .single();

      if (conflictError) throw conflictError;

      return new Response(JSON.stringify({
        hasConflict: true,
        conflict,
        analysis: parsedAnalysis
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      hasConflict: false,
      analysis: parsedAnalysis
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Conflict detection error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
