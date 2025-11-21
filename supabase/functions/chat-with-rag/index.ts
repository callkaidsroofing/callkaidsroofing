import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: Message[];
  conversationType?: 'customer_support' | 'quote_assistant' | 'internal';
  useRag?: boolean;
  ragOptions?: {
    matchThreshold?: number;
    matchCount?: number;
    filterCategory?: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const {
      messages,
      conversationType = 'customer_support',
      useRag = true,
      ragOptions = {},
    }: ChatRequest = await req.json();

    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let augmentedMessages = [...messages];
    let retrievedContext: any[] = [];

    // Perform RAG if enabled
    if (useRag) {
      const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
      
      if (lastUserMessage) {
        console.log('Performing RAG search for:', lastUserMessage.content);

        // Call rag-search function
        const ragResponse = await supabase.functions.invoke('rag-search', {
          body: {
            query: lastUserMessage.content,
            matchThreshold: ragOptions.matchThreshold || 0.7,
            matchCount: ragOptions.matchCount || 5,
            filterCategory: ragOptions.filterCategory,
          },
        });

        if (ragResponse.data?.success) {
          retrievedContext = ragResponse.data.chunks;
          const contextString = ragResponse.data.context;

          console.log(`Retrieved ${retrievedContext.length} relevant chunks`);

          // Enhanced system message with admin assistant prompt
          const systemMessage: Message = {
            role: 'system',
            content: `System: CKR Admin Assistant. Use RAG; cite table/file. Obey BRAND_GUIDE.md and WARRANTY_POLICY.md.

**Business Identity:**
- Name: Call Kaids Roofing
- ABN: 39475055075
- Phone: 0435 900 709
- Email: callkaidsroofing@outlook.com
- Slogan: *Proof In Every Roof* (always italicized)
- Colors: #007ACC (Primary), #0B3B69 (Dark), #111827 (Charcoal) - NO ORANGE
- Voice: Intelligent, Relaxed, Direct, Warm, Proof-Driven
- Area: SE Melbourne, Australia

**Your Role:**
${conversationType === 'customer_support' 
  ? 'Provide helpful, professional customer support. Answer questions about services, pricing, and scheduling. Always offer to book a free roof inspection.'
  : conversationType === 'quote_assistant'
  ? 'Assist inspectors with quote generation, pricing calculations, and technical specifications. Use the Master Knowledge Framework for accurate information.'
  : 'Provide internal business intelligence and process guidance to CKR team members. Reference knowledge base sources in format [MKF_00] or [BRAND_GUIDE] or [WARRANTY_POLICY].'
}

**Knowledge Base Context (from RAG search):**
${contextString}

**Instructions:**
- When using knowledge, cite sources: [MKF_00], [BRAND_GUIDE], [WARRANTY_POLICY], [GWA-XX]
- If inputs missing, ask specific questions
- For pricing: give ranges + list assumptions (never claim "cheapest", use "best value" or "cost-effective")
- Use Australian English and date format (DD MMM YYYY)
- Be professional, friendly, and solution-oriented
- If information is not in context, acknowledge limitations
- Always include contact details when suggesting next steps
- Follow brand guidelines strictly: correct colors, voice, slogan formatting`,
          };

          // Replace or prepend system message
          const hasSystemMessage = augmentedMessages[0]?.role === 'system';
          if (hasSystemMessage) {
            augmentedMessages[0] = systemMessage;
          } else {
            augmentedMessages = [systemMessage, ...augmentedMessages];
          }
        } else {
          console.warn('RAG search failed, proceeding without context');
        }
      }
    }

    // Call Gemini via Lovable AI Gateway
    console.log('Calling Gemini 2.0 Flash...');
    const geminiResponse = await fetch('https://lovable.app/api/ai-gateway', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp',
        messages: augmentedMessages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Failed to get AI response: ${errorText}`);
    }

    const geminiData = await geminiResponse.json();
    const assistantMessage = geminiData.choices[0].message.content;

    return new Response(
      JSON.stringify({
        success: true,
        message: assistantMessage,
        metadata: {
          conversationType,
          ragUsed: useRag,
          contextsRetrieved: retrievedContext.length,
          contexts: retrievedContext.map(c => ({
            title: c.title,
            category: c.category,
            similarity: c.similarity,
          })),
        },
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process chat request'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
