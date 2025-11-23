import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { loadMKF, auditMKFAction } from "../_shared/mkf-loader.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { conversationId, message, sessionId } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      
      if (error) throw new Error('Conversation not found');
      conversation = data;
    } else {
      // Create new conversation
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          conversation_type: 'customer_support',
          session_id: sessionId || crypto.randomUUID(),
        })
        .select()
        .single();

      if (error) throw new Error('Failed to create conversation');
      conversation = data;
    }

    // Get conversation history
    const { data: messages, error: messagesError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true });

    if (messagesError) throw new Error('Failed to fetch messages');

    // Save user message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'user',
        content: message,
      });

    // Load MKF knowledge dynamically
    const mkfPrompt = await loadMKF('chat-customer-support', supabase, {
      customPrompt: `You are a customer service assistant helping customers with enquiries.

YOUR ROLE:
- Answer questions about services (from MKF_05)
- Provide accurate business information (from MKF_00)
- Use brand voice guidelines (from MKF_01)
- Guide customers toward booking a free roof health check
- Reference case studies and testimonials when relevant (from MKF_04)

CAPABILITIES:
- Answer service-related questions
- Provide pricing guidance (general ranges only)
- Book inspections and quotes
- Handle warranty enquiries
- Triage urgent vs. routine work`
    });

    // Log MKF usage
    await auditMKFAction(supabase, 'load_mkf', {
      function: 'chat-customer-support',
      conversation_id: conversation.id
    });

    const systemPrompt = mkfPrompt;

    // Build conversation history
    const conversationHistory = messages.map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Call Lovable AI
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
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Error:', aiResponse.status, errorText);
      throw new Error(`AI generation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const assistantResponse = JSON.parse(aiData.choices[0].message.content);

    // Save assistant message
    await supabase
      .from('chat_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: assistantResponse.response,
        metadata: {
          suggestedAction: assistantResponse.suggestedAction,
          quickReplies: assistantResponse.quickReplies,
        },
      });

    return new Response(
      JSON.stringify({
        conversationId: conversation.id,
        response: assistantResponse.response,
        suggestedAction: assistantResponse.suggestedAction,
        quickReplies: assistantResponse.quickReplies,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in chat-customer-support:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
