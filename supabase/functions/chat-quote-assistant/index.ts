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
    const { conversationId, message, quoteId } = await req.json();

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
      const authHeader = req.headers.get('authorization');
      let userId = null;
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '');
        const { data: { user } } = await supabase.auth.getUser(token);
        userId = user?.id;
      }

      const { data, error } = await supabase
        .from('chat_conversations')
        .insert({
          conversation_type: 'quote_assistant',
          user_id: userId,
          context_data: { quoteId },
        })
        .select()
        .single();

      if (error) throw new Error('Failed to create conversation');
      conversation = data;
    }

    // Fetch quote and related data
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select(`
        *,
        quote_line_items (*)
      `)
      .eq('id', quoteId || conversation.context_data.quoteId)
      .single();

    if (quoteError) throw new Error('Quote not found');

    // Fetch inspection report if linked
    let inspectionReport = null;
    if (quote.inspection_report_id) {
      const { data } = await supabase
        .from('inspection_reports')
        .select('*')
        .eq('id', quote.inspection_report_id)
        .single();
      inspectionReport = data;
    }

    // Fetch pricing rules
    const { data: pricingRules } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('is_active', true);

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

    // Build system prompt
    const systemPrompt = `You are a quote refinement assistant for Call Kaids Roofing.

CURRENT QUOTE:
${JSON.stringify(quote, null, 2)}

INSPECTION REPORT:
${inspectionReport ? JSON.stringify(inspectionReport, null, 2) : 'Not available'}

PRICING RULES:
${JSON.stringify(pricingRules, null, 2)}

YOUR ROLE:
- Help refine quantities, materials, pricing
- Suggest alternatives based on pricing rules
- Explain trade-offs between tiers
- Keep brand voice: down-to-earth, honest, educational

CAPABILITIES:
- Modify line item quantities
- Adjust pricing within rule ranges
- Add/remove line items
- Regenerate tier variations
- Explain material choices

When user requests changes, respond with:
{
  "response": "conversational explanation of changes",
  "action": "modify_quote" | "regenerate_tier" | "explain" | "none",
  "modifications": {
    // only if action is modify_quote
    "lineItems": [...updated line items],
    "subtotal": new subtotal,
    "gst": new gst,
    "total": new total,
    "notes": updated notes
  }
}

Be concise but thorough. Always explain WHY a change makes sense.`;

    // Build conversation history for AI
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
          action: assistantResponse.action,
          modifications: assistantResponse.modifications || null,
        },
      });

    // If modifications requested, update quote
    if (assistantResponse.action === 'modify_quote' && assistantResponse.modifications) {
      const mods = assistantResponse.modifications;
      
      // Update quote totals
      await supabase
        .from('quotes')
        .update({
          subtotal: mods.subtotal,
          gst: mods.gst,
          total: mods.total,
          notes: mods.notes,
        })
        .eq('id', quote.id);

      // Delete existing line items and insert new ones
      await supabase
        .from('quote_line_items')
        .delete()
        .eq('quote_id', quote.id);

      const lineItemsToInsert = mods.lineItems.map((item: any, index: number) => ({
        quote_id: quote.id,
        service_item: item.serviceItem,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_rate: item.unitRate,
        line_total: item.lineTotal,
        sort_order: index,
      }));

      await supabase
        .from('quote_line_items')
        .insert(lineItemsToInsert);
    }

    return new Response(
      JSON.stringify({
        conversationId: conversation.id,
        response: assistantResponse.response,
        action: assistantResponse.action,
        modifications: assistantResponse.modifications,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in chat-quote-assistant:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
