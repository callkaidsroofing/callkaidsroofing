import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { suburbName, postcode, region, services } = await req.json();

    if (!suburbName) {
      throw new Error('Suburb name is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // RAG search for relevant knowledge
    const { data: ragData, error: ragError } = await supabase.functions.invoke('rag-search', {
      body: { 
        query: `${suburbName} roofing services ${region} ${services?.join(' ')}`,
        matchCount: 5
      }
    });

    if (ragError) {
      console.error('RAG search error:', ragError);
    }

    const knowledgeContext = ragData?.results?.map((r: any) => r.content).join('\n\n') || '';

    // Generate suburb content using Lovable AI
    const systemPrompt = `You are CKR-GEM, the AI content generator for Call Kaids Roofing (ABN 39475055075).

BRAND GUIDELINES:
- Slogan: "Proof In Every Roof" (always italicized)
- Colors: #007ACC (primary), #0B3B69 (secondary), NEVER orange
- Contact: 0435 900 709, info@callkaidsroofing.com.au
- Voice: Intelligent, Relaxed, Direct, Warm, Proof-Driven
- Never claim "cheapest" - use "best value" or "cost-effective"

KNOWLEDGE BASE:
${knowledgeContext}

Generate SEO-optimized content for ${suburbName} suburb page following this structure:

1. META_TITLE (50-60 chars): Include primary keyword + suburb name
2. META_DESCRIPTION (150-160 chars): Compelling description with CTA
3. DESCRIPTION (2-3 paragraphs): Engaging intro about roofing services in ${suburbName}, mention local characteristics, highlight expertise in ${region}
4. LOCAL_SEO_CONTENT (4-6 paragraphs): 
   - Specific benefits for ${suburbName} residents
   - Common roofing challenges in the area
   - Why choose CKR in ${suburbName}
   - Local projects completed (if knowledge base has info)
   - 15-year warranty emphasis
   - Direct owner contact advantage

Include natural keyword integration: "${suburbName} roofing", "roof restoration ${suburbName}", "${postcode} roofing services"

Return as JSON:
{
  "meta_title": "...",
  "meta_description": "...",
  "description": "...",
  "local_seo_content": "..."
}`;

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
          { 
            role: 'user', 
            content: `Generate SEO-optimized content for ${suburbName}, ${postcode}, ${region}. Services: ${services?.join(', ') || 'All roofing services'}`
          }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded, please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (aiResponse.status === 402) {
        return new Response(JSON.stringify({ error: 'Lovable AI credits depleted, please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Parse JSON from AI response (handle markdown code blocks)
    let parsedContent;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      parsedContent = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Failed to parse generated content');
    }

    return new Response(JSON.stringify({ 
      success: true,
      content: parsedContent,
      metadata: {
        suburb: suburbName,
        postcode,
        region,
        services,
        generated_at: new Date().toISOString(),
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-suburb-content:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
