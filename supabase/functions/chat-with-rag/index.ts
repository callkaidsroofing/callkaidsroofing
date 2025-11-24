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
          retrievedContext = ragResponse.data.results || [];
          
          // Build context string with MKF-style citations
          let contextString = '';
          if (retrievedContext.length > 0) {
            contextString = '\n\n--- KNOWLEDGE BASE CONTEXT ---\n';
            retrievedContext.forEach((section: any, i: number) => {
              contextString += `\n${section.citation || `[Section ${i + 1}]`}\n`;
              contextString += `Path: ${section.section_path || section.title}\n`;
              contextString += `Content: ${section.content}\n`;
              if (section.keywords?.length > 0) {
                contextString += `Keywords: ${section.keywords.join(', ')}\n`;
              }
              if (section.related_sections?.length > 0) {
                contextString += `Related: ${section.related_sections.join(', ')}\n`;
              }
              contextString += '\n';
            });
          }

          console.log(`Retrieved ${retrievedContext.length} relevant sections`);

          // Enhanced system message with CKR-GEM governance
          const systemMessage: Message = {
            role: 'system',
            content: `You are the CKR Digital Engine Admin Assistant, powered by the CKR-GEM Knowledge Framework.

**CRITICAL CITATION RULES:**
1. ALWAYS cite using [MKF_XX § Section Heading] or [KF_XX § Section Heading] format
2. Use the exact citation provided in the context (e.g., [MKF_02 § Pricing Adjustments])
3. When referencing related documents, use their cross-references
4. NEVER make up citations - only use what's in the context

**Business Identity (IMMUTABLE - KF_01):**
- ABN: 39475055075 (MUST include in quotes/invoices)
- Phone: 0435 900 709 (MUST include in all communications)
- Slogan: *Proof In Every Roof* (ALWAYS italicized, asterisks mandatory)
- Colors: #007ACC (Primary Blue) - ORANGE IS STRICTLY FORBIDDEN
- Voice: Intelligent, Relaxed, Direct, Warm, Proof-Driven

**Your Role:**
${conversationType === 'customer_support' 
  ? 'Provide professional customer support. Answer questions about services, pricing, and scheduling. Always cite [KF_02 § Service Pricing] for pricing queries.'
  : conversationType === 'quote_assistant'
  ? 'Assist with quote generation using [KF_02 § Pricing Model]. Ensure all line items match pricing_items table. Apply markups per [MKF_10 § Financial Logic].'
  : 'Provide admin guidance. Reference MKF sources. Follow governance hierarchy: MKF > KF > SOP.'
}

**Knowledge Base Context:**
${contextString}

**Response Guidelines:**
- Prioritize MKF sources (governance) over KF sources (operations)
- For pricing: cite [KF_02 § relevant section] and list all assumptions
- For brand rules: cite [KF_01 § Brand Core Mandate]
- For procedures: cite [KF_03 § SOPs]
- For warranties: cite [KF_06 § Warranty Terms]
- If context lacks info, say "I don't have specific guidance on this in the current knowledge base"
- Use Australian English and date format (DD/MM/YYYY)
- Never claim "cheapest" - use "best value" or "cost-effective"`,
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
            citation: c.citation,
            doc_id: c.doc_id,
            section_path: c.section_path,
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
