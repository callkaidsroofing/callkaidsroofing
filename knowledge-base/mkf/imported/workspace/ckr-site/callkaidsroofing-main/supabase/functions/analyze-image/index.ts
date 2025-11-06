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
    const { conversationId, imageUrl, analysisType } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Determine analysis prompt based on type
    let analysisPrompt = '';
    switch (analysisType) {
      case 'roof_condition':
        analysisPrompt = `Analyze this roof image and identify:
- Roof type (tile, metal, etc.)
- Visible damage (cracked tiles, rust, wear)
- Ridge cap condition
- Valley iron condition
- Overall condition rating (Poor/Fair/Good/Excellent)
- Recommended actions
Return as JSON with keys: roofType, damages[], ridgeCondition, valleyCondition, rating, recommendations[]`;
        break;
      
      case 'competitor_quote':
        analysisPrompt = `Extract information from this competitor quote:
- Company name
- Total price
- Line items with descriptions and prices
- Services included
- Warranty terms
Return as JSON with keys: company, total, lineItems[], services[], warranty`;
        break;
      
      case 'damage_assessment':
        analysisPrompt = `Assess roof damage in this image:
- Type of damage (leak, storm, wear, etc.)
- Severity (Minor/Moderate/Severe)
- Affected area (approximate percentage)
- Urgency (Low/Medium/High/Emergency)
- Required repairs
Return as JSON with keys: damageType, severity, affectedArea, urgency, requiredRepairs[]`;
        break;
      
      default:
        analysisPrompt = 'Analyze this roofing-related image and provide relevant details as JSON.';
    }

    // Call Lovable AI with Gemini Vision
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
            role: 'user',
            content: [
              { type: 'text', text: analysisPrompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Error:', aiResponse.status, errorText);
      throw new Error(`AI analysis failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const analysisResult = JSON.parse(aiData.choices[0].message.content);

    // Calculate confidence score based on completeness
    const confidenceScore = Object.keys(analysisResult).length / 6;

    // Save analysis to database
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('image_analyses')
      .insert({
        conversation_id: conversationId,
        image_url: imageUrl,
        analysis_type: analysisType,
        analysis_result: analysisResult,
        confidence_score: confidenceScore,
      })
      .select()
      .single();

    if (saveError) {
      console.error('Failed to save analysis:', saveError);
    }

    // Track analytics
    await supabase
      .from('chat_analytics')
      .insert({
        conversation_id: conversationId,
        event_type: 'image_analyzed',
        event_data: { analysisType, confidenceScore },
      });

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysisResult,
        confidenceScore,
        analysisId: savedAnalysis?.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in analyze-image:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
