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
    const { images, saveToDatabase = true } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!LOVABLE_API_KEY || !OPENAI_API_KEY) {
      throw new Error('Required API keys not configured');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log(`Starting intelligent analysis of ${images.length} project images...`);

    // Step 1: Use RAG to get contextual knowledge about roofing projects
    const ragContextResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'user',
            content: `Based on CKR roofing knowledge base, provide expert context for analyzing roof restoration projects including:
1. Common issues in tile and metal roofs
2. Signs of quality restoration work
3. Key improvements to highlight
4. Professional terminology for conditions
5. Typical project workflows

Keep response concise but comprehensive.`
          }
        ]
      })
    });

    const ragData = await ragContextResponse.json();
    const expertContext = ragData.choices[0].message.content;
    console.log('RAG context retrieved:', expertContext.substring(0, 200));

    // Step 2: Generate embeddings for the analysis context
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: 'roofing project analysis before after restoration tile metal'
      })
    });

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    // Step 3: Search master_knowledge for relevant roofing information
    const { data: knowledgeResults } = await supabase.rpc('search_master_knowledge', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5
    });

    const relevantKnowledge = knowledgeResults?.map((r: any) => r.content).join('\n') || '';
    console.log('Retrieved knowledge chunks:', knowledgeResults?.length || 0);

    // Step 4: Analyze each image with RAG-enhanced context
    const analysisPromises = images.map(async (imageUrl: string) => {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `You are an expert roofing analyst for Call Kaids Roofing. Use this context:

EXPERT CONTEXT:
${expertContext}

COMPANY KNOWLEDGE:
${relevantKnowledge}

Analyze images with professional terminology and CKR standards.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this roofing project image in detail. Determine:
1. Stage: BEFORE or AFTER (look for damage, wear, new materials, protective coatings)
2. Roof type (tile, metal, colorbond)
3. Condition (poor/fair/good/excellent)
4. Specific issues visible or improvements made
5. Professional assessment

Respond in JSON:
{
  "stage": "before" | "after",
  "roofType": string,
  "condition": string,
  "issues": string[],
  "improvements": string[],
  "professionalNotes": string,
  "confidence": number (0-1),
  "description": string
}`
                },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl }
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0].message.content);
      
      return {
        url: imageUrl,
        ...analysis
      };
    });

    const analyses = await Promise.all(analysisPromises);
    console.log('Individual analyses complete:', analyses.length);

    // Step 5: Intelligent pairing using AI + RAG context
    const pairingResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are pairing before/after images for Call Kaids Roofing projects.

CONTEXT:
${expertContext}

Use CKR standards and professional terminology.`
          },
          {
            role: 'user',
            content: `Create intelligent before/after pairs from these analyses:

${JSON.stringify(analyses, null, 2)}

Match based on:
- Same roof type and similar angle
- Logical progression (damaged → restored)
- Confidence scores
- Professional pairing logic

Return JSON array:
[
  {
    "before": { "url": string, "analysis": object },
    "after": { "url": string, "analysis": object },
    "location": "SE Melbourne",
    "workPerformed": string (detailed, professional),
    "confidence": number,
    "projectType": string,
    "keyOutcomes": string[]
  }
]

Use standalone projects if no good pair exists.`
          }
        ]
      })
    });

    const pairingData = await pairingResponse.json();
    const pairs = JSON.parse(pairingData.choices[0].message.content);
    console.log('Paired projects:', pairs.length);

    // Step 6: Save to database if requested
    if (saveToDatabase) {
      const savedProjects = [];
      
      for (const pair of pairs) {
        // Create a case study entry
        const { data: caseStudy, error: insertError } = await supabase
          .from('content_case_studies')
          .insert({
            study_id: `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            suburb: pair.location,
            before_image: pair.before.url,
            after_image: pair.after.url,
            testimonial: pair.workPerformed,
            featured: pair.confidence > 0.85,
            meta_title: `${pair.projectType} - ${pair.location}`,
            meta_description: pair.workPerformed.substring(0, 160),
            published_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error saving case study:', insertError);
        } else {
          console.log('Saved case study:', caseStudy.id);
          savedProjects.push(caseStudy);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          analyses,
          pairs,
          savedProjects,
          message: `Analyzed ${images.length} images, created ${pairs.length} project pairs, saved ${savedProjects.length} to database`
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        analyses,
        pairs,
        ragContext: {
          expertKnowledge: expertContext.substring(0, 300),
          knowledgeChunks: knowledgeResults?.length || 0
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in analyze-project-images:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
