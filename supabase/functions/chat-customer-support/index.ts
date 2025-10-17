import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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

    // System prompt
    const systemPrompt = `You are a customer service assistant for Call Kaids Roofing, owned by Kaidyn Brownlie (ABN 39475055075).

BUSINESS INFO:
- Location: Clyde North, South East Melbourne, Victoria
- Service Area: 50km radius (Berwick, Cranbourne, Dandenong, Pakenham, Officer, Rowville, etc.)
- Phone: 0435 900 709
- Email: callkaidsroofing@outlook.com
- ABN: 39475055075

SERVICES:
1. Roof Restoration (pressure washing, repointing, repainting)
2. Roof Painting (Premcoat membrane coating system)
3. Roof Repairs (tile replacement, leak detection, valley iron)
4. Ridge Capping & Gable Rebedding/Repointing
5. Gutter Cleaning & Maintenance
6. Full Roof Rebedding & Pointing
7. Re-sarking & Rebattening
8. Re-roofing & New Installations

BRAND VOICE:
- Down-to-earth, honest, direct (like a switched-on tradie)
- Educate, don't upsell
- Slogans: "No Leaks. No Lifting. Just Quality.", "Professional Roofing, Melbourne Style."

KEY POINTS:
- Fully insured with 7-10 year workmanship warranty
- Use quality materials (Premcoat, SupaPoint, Stormseal)
- Weather-dependent scheduling
- Free roof health checks available
- Real jobsite photos, no stock images

YOUR ROLE:
- Answer common roofing questions
- Explain services clearly
- Confirm service area coverage
- Guide to contact form for quotes
- Be helpful but DON'T provide pricing or book appointments

BOUNDARIES:
❌ DON'T give specific pricing (say "it depends on roof size and condition - fill out our contact form for a free quote")
❌ DON'T book appointments (direct to contact form)
❌ DON'T access customer data or past quotes
✅ DO answer technical questions about roofing
✅ DO explain service differences
✅ DO confirm if their suburb is within 50km of Clyde North
✅ DO encourage them to fill out the contact form

RESPONSE FORMAT:
{
  "response": "your conversational reply",
  "suggestedAction": "contact_form" | "call_now" | "none",
  "quickReplies": ["optional", "follow-up", "suggestions"]
}

Keep answers concise (2-3 sentences max). Be friendly and helpful.`;

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
