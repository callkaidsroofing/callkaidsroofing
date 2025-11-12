import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to strip markdown code fences from AI responses
function stripMarkdownCodeFence(content: string): string {
  content = content.trim();
  if (content.startsWith('```json')) {
    content = content.slice(7);
  } else if (content.startsWith('```')) {
    content = content.slice(3);
  }
  if (content.endsWith('```')) {
    content = content.slice(0, -3);
  }
  return content.trim();
}

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

    console.log(`[REANALYSIS] Starting comprehensive analysis of ${images.length} images...`);

    // STEP 1: RAG Context Retrieval
    const ragContextResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [{
          role: 'user',
          content: `As a CKR roofing expert, provide comprehensive context for analyzing roof projects:
1. Tile roof degradation signs (cracked tiles, moss, lichen, broken ridges, color fading)
2. Metal roof issues (rust, corrosion, loose fasteners, damaged flashings)
3. Quality restoration indicators (clean finish, proper repointing, protective coatings, uniform appearance)
4. CKR brand standards (professional workmanship, attention to detail, warranty compliance)
5. Authentication markers (typical SE Melbourne roofing styles, CKR work characteristics)

Be detailed and specific for image analysis.`
        }]
      })
    });

    const ragData = await ragContextResponse.json();
    const expertContext = ragData.choices[0].message.content;
    console.log('[REANALYSIS] Expert context retrieved');

    // STEP 2: Master Knowledge Search
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: 'CKR roofing restoration before after analysis tile metal quality standards authentication SE Melbourne'
      })
    });

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    const { data: knowledgeResults } = await supabase.rpc('search_master_knowledge', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 5
    });

    const relevantKnowledge = knowledgeResults?.map((r: any) => r.content).join('\n\n') || '';
    console.log(`[REANALYSIS] Retrieved ${knowledgeResults?.length || 0} knowledge chunks`);

    // STEP 3: Comprehensive Image Analysis with Tagging
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
              content: `EXPERT CONTEXT:\n${expertContext}\n\nCOMPANY KNOWLEDGE:\n${relevantKnowledge}\n\nYou are analyzing for CKR (Call Kaids Roofing). Be thorough and professional.`
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Perform COMPREHENSIVE analysis:

1. STAGE DETERMINATION (before/after)
2. DETAILED TAGGING:
   - roof_type: (tile, terracotta, concrete, colorbond, metal, etc.)
   - materials: specific materials visible
   - condition_level: (critical, poor, fair, good, excellent)
   - visible_issues: detailed list
   - work_completed: specific improvements if after
   - weather_conditions: lighting, season indicators
   - angle_perspective: (full, partial, close-up, aerial)
   - suburb_indicators: architectural style clues
   
3. AUTHENTICITY VERIFICATION:
   - CKR_quality_markers: professional finish indicators
   - SE_melbourne_typical: regional roofing characteristics
   - authenticity_confidence: 0-1 score
   - authenticity_reasoning: why genuine or suspicious
   
4. TECHNICAL ASSESSMENT:
   - specific_damages: crack locations, rust spots, etc.
   - repair_quality: workmanship assessment if after
   - material_compatibility: proper materials used
   - longevity_indicators: warranty compliance signs

Respond in JSON:
{
  "stage": "before" | "after",
  "tags": {
    "roof_type": string,
    "materials": string[],
    "condition_level": string,
    "visible_issues": string[],
    "work_completed": string[],
    "weather_conditions": string,
    "angle_perspective": string,
    "suburb_indicators": string[]
  },
  "authenticity": {
    "score": number (0-1),
    "reasoning": string,
    "ckr_markers": string[],
    "regional_fit": string
  },
  "technical": {
    "specific_damages": string[],
    "repair_quality": string,
    "material_compatibility": string,
    "longevity_indicators": string[]
  },
  "confidence": number (0-1),
  "description": string (detailed professional assessment)
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
      const content = stripMarkdownCodeFence(data.choices[0].message.content);
      const analysis = JSON.parse(content);
      
      return {
        url: imageUrl,
        ...analysis
      };
    });

    const analyses = await Promise.all(analysisPromises);
    console.log('[REANALYSIS] Individual analyses complete with full tagging');

    // STEP 4: Intelligent Pairing with Fact-Checking
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
            content: `CONTEXT:\n${expertContext}\n\nPerform RIGOROUS pairing verification for CKR projects.`
          },
          {
            role: 'user',
            content: `FACT-CHECK and pair these images with VERIFICATION:

${JSON.stringify(analyses, null, 2)}

PAIRING RULES (STRICT):
1. Same roof_type mandatory
2. Similar angle_perspective required
3. Same suburb_indicators preferred
4. Before must show issues, after must show resolution
5. Material compatibility must match

For each pair provide:
{
  "before": { "url": string, "analysis": object },
  "after": { "url": string, "analysis": object },
  "location": string,
  "workPerformed": string (detailed),
  "pairingConfidence": number (0-1),
  "factCheck": {
    "roof_type_match": boolean,
    "angle_match": boolean,
    "logical_progression": boolean,
    "material_consistency": boolean,
    "verification_notes": string
  },
  "authenticityScore": number (average of both images),
  "tags": string[] (combined relevant tags),
  "needsReview": boolean (flag if confidence < 0.85)
}

Return JSON array. Mark standalone images if no good pair.`
          }
        ]
      })
    });

    const pairingData = await pairingResponse.json();
    const pairingContent = stripMarkdownCodeFence(pairingData.choices[0].message.content);
    const pairs = JSON.parse(pairingContent);
    console.log(`[REANALYSIS] Created ${pairs.length} verified pairs`);

    // STEP 5: Save with Complete Metadata
    if (saveToDatabase) {
      const savedProjects = [];
      
      for (const pair of pairs) {
        const verificationStatus = pair.needsReview ? 'needs_review' : 
                                   pair.authenticityScore < 0.7 ? 'needs_review' :
                                   pair.pairingConfidence < 0.8 ? 'needs_review' : 'pending';

        const { data: caseStudy, error: insertError } = await supabase
          .from('content_case_studies')
          .insert({
            study_id: `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            suburb: pair.location,
            before_image: pair.before.url,
            after_image: pair.after.url,
            testimonial: pair.workPerformed,
            featured: pair.authenticityScore > 0.85 && pair.pairingConfidence > 0.85,
            meta_title: `${pair.before.tags.roof_type} Restoration - ${pair.location}`,
            meta_description: pair.workPerformed.substring(0, 160),
            published_at: verificationStatus === 'pending' ? new Date().toISOString() : null,
            tags: pair.tags,
            ai_analysis: {
              before: pair.before.analysis,
              after: pair.after.analysis,
              fact_check: pair.factCheck,
              analysis_timestamp: new Date().toISOString()
            },
            verification_status: verificationStatus,
            authenticity_score: Math.round(pair.authenticityScore * 100) / 100,
            pairing_confidence: Math.round(pair.pairingConfidence * 100) / 100
          })
          .select()
          .single();

        if (insertError) {
          console.error('[REANALYSIS] Error saving case study:', insertError);
        } else {
          console.log(`[REANALYSIS] Saved: ${caseStudy.study_id} | Auth: ${caseStudy.authenticity_score} | Pair: ${caseStudy.pairing_confidence}`);
          savedProjects.push(caseStudy);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          analyses,
          pairs,
          savedProjects,
          summary: {
            total_analyzed: images.length,
            pairs_created: pairs.length,
            saved_to_db: savedProjects.length,
            needs_review: savedProjects.filter(p => p.verification_status === 'needs_review').length,
            high_confidence: savedProjects.filter(p => p.authenticity_score > 0.85).length
          },
          message: `Reanalysis complete: ${pairs.length} pairs, ${savedProjects.filter(p => p.verification_status === 'needs_review').length} need review`
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
        pairs
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('[REANALYSIS] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorDetails = error instanceof Error ? error.stack : String(error);
    
    console.error('[REANALYSIS] Error details:', errorDetails);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: errorMessage,
        details: errorDetails
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
