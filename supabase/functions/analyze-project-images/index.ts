import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhanced helper to strip markdown code fences and normalize AI JSON responses
function stripMarkdownCodeFence(content: string): string {
  if (!content) return '{}';
  
  // Handle both \n and \r\n line endings
  content = content.replace(/\r\n/g, '\n').trim();
  
  // Strip multiple consecutive code fences
  while (content.startsWith('```json') || content.startsWith('```')) {
    if (content.startsWith('```json')) {
      content = content.slice(7);
    } else if (content.startsWith('```')) {
      content = content.slice(3);
    }
    content = content.trim();
  }
  
  while (content.endsWith('```')) {
    content = content.slice(0, -3).trim();
  }
  
  // Remove trailing commas before closing braces/brackets (common JSON error)
  content = content.replace(/,(\s*[}\]])/g, '$1');
  
  return content.trim();
}

// Helper to create fallback analysis structure when AI fails
function createFallbackAnalysis(imageUrl: string) {
  return {
    url: imageUrl,
    stage: 'unknown',
    tags: {
      roof_type: 'unknown',
      materials: [],
      condition_level: 'unknown',
      visible_issues: ['Analysis failed - manual review required'],
      work_completed: [],
      weather_conditions: 'unknown',
      angle_perspective: 'unknown',
      suburb_indicators: []
    },
    authenticity: {
      score: 0,
      reasoning: 'Analysis failed - requires manual verification',
      ckr_markers: [],
      regional_fit: 'unknown'
    },
    technical: {
      specific_damages: [],
      repair_quality: 'unknown',
      material_compatibility: 'unknown',
      longevity_indicators: []
    },
    confidence: 0,
    description: 'Automated analysis failed. Manual review required.'
  };
}

// Helper to create fallback pairing when pairing analysis fails
function createFallbackPairing(analyses: any[]) {
  return analyses.map(analysis => ({
    before: analysis.stage === 'before' ? analysis : analyses[0],
    after: analysis.stage === 'after' ? analysis : analyses[analyses.length - 1],
    location: 'Unknown',
    workPerformed: 'Analysis failed - manual pairing required',
    pairingConfidence: 0,
    factCheck: {
      roof_type_match: false,
      angle_match: false,
      logical_progression: false,
      material_consistency: false,
      verification_notes: 'Automated pairing failed - requires manual verification'
    },
    authenticityScore: 0,
    tags: ['manual-review-required'],
    needsReview: true
  }));
}

// Safe JSON parser with comprehensive error handling
function safeParseJSON(content: string, context: string): any | null {
  try {
    const normalized = stripMarkdownCodeFence(content);
    console.log(`[${context}] Normalized content length: ${normalized.length} chars`);
    
    const parsed = JSON.parse(normalized);
    
    // Validate it's actually an object or array
    if (typeof parsed !== 'object' || parsed === null) {
      console.error(`[${context}] Parsed value is not an object:`, typeof parsed);
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error(`[${context}] JSON Parse Error:`, error);
    console.error(`[${context}] Raw AI Response:`, content);
    console.error(`[${context}] Normalized Content:`, stripMarkdownCodeFence(content));
    return null;
  }
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
      
      // Safe parsing with fallback
      const rawContent = data?.choices?.[0]?.message?.content;
      if (!rawContent) {
        console.error('[REANALYSIS] No content in AI response for:', imageUrl);
        return createFallbackAnalysis(imageUrl);
      }
      
      const analysis = safeParseJSON(rawContent, 'IMAGE_ANALYSIS');
      
      if (!analysis) {
        console.error('[REANALYSIS] Failed to parse analysis for:', imageUrl);
        return createFallbackAnalysis(imageUrl);
      }
      
      // Validate expected structure exists
      if (!analysis.stage || !analysis.tags) {
        console.error('[REANALYSIS] Invalid analysis structure:', analysis);
        return createFallbackAnalysis(imageUrl);
      }
      
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
    
    // Safe parsing with fallback
    const rawPairingContent = pairingData?.choices?.[0]?.message?.content;
    if (!rawPairingContent) {
      console.error('[REANALYSIS] No content in pairing response');
      const pairs = createFallbackPairing(analyses);
      console.log(`[REANALYSIS] Using fallback pairing: ${pairs.length} pairs`);
    } else {
      var pairs = safeParseJSON(rawPairingContent, 'PAIRING');
      
      if (!pairs || !Array.isArray(pairs)) {
        console.error('[REANALYSIS] Failed to parse pairing data or not an array');
        pairs = createFallbackPairing(analyses);
        console.log(`[REANALYSIS] Using fallback pairing: ${pairs.length} pairs`);
      } else {
        console.log(`[REANALYSIS] Created ${pairs.length} verified pairs`);
      }
    }

    // STEP 5: Save with Complete Metadata
    if (saveToDatabase) {
      const savedProjects = [];
      
      for (const pair of pairs) {
        // Safe property access with defaults
        const needsReview = pair?.needsReview ?? true;
        const authenticityScore = pair?.authenticityScore ?? 0;
        const pairingConfidence = pair?.pairingConfidence ?? 0;
        const location = pair?.location ?? 'Unknown';
        const workPerformed = pair?.workPerformed ?? 'Analysis incomplete';
        const tags = pair?.tags ?? ['manual-review-required'];
        
        const verificationStatus = needsReview ? 'needs_review' : 
                                   authenticityScore < 0.7 ? 'needs_review' :
                                   pairingConfidence < 0.8 ? 'needs_review' : 'pending';

        // Safe access to nested properties
        const beforeUrl = pair?.before?.url ?? '';
        const afterUrl = pair?.after?.url ?? '';
        const roofType = pair?.before?.tags?.roof_type ?? pair?.after?.tags?.roof_type ?? 'unknown';
        const beforeAnalysis = pair?.before?.analysis ?? {};
        const afterAnalysis = pair?.after?.analysis ?? {};
        const factCheck = pair?.factCheck ?? {};

        const { data: caseStudy, error: insertError } = await supabase
          .from('content_case_studies')
          .insert({
            study_id: `AI-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            suburb: location,
            before_image: beforeUrl,
            after_image: afterUrl,
            testimonial: workPerformed,
            featured: authenticityScore > 0.85 && pairingConfidence > 0.85,
            meta_title: `${roofType} Restoration - ${location}`,
            meta_description: workPerformed.substring(0, 160),
            published_at: verificationStatus === 'pending' ? new Date().toISOString() : null,
            tags: tags,
            ai_analysis: {
              before: beforeAnalysis,
              after: afterAnalysis,
              fact_check: factCheck,
              analysis_timestamp: new Date().toISOString()
            },
            verification_status: verificationStatus,
            authenticity_score: Math.round(authenticityScore * 100) / 100,
            pairing_confidence: Math.round(pairingConfidence * 100) / 100
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
