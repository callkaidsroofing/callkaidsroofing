import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { images } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log(`Analyzing ${images.length} project images...`);

    // Analyze each image individually first
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
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Analyze this roofing project image in detail. Determine:
1. Is this a BEFORE or AFTER image? (Look for damage, wear, clean/new materials)
2. Type of roof (tile, metal, etc.)
3. Condition assessment (poor/fair/good/excellent)
4. Visible issues or improvements
5. Time of day/lighting
6. Any other distinguishing features

Respond in JSON format:
{
  "stage": "before" | "after",
  "roofType": string,
  "condition": string,
  "issues": string[],
  "improvements": string[],
  "lighting": string,
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
    console.log('Individual analyses complete:', analyses);

    // Group before/after pairs using AI
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
            role: 'user',
            content: `Given these analyzed roofing images, create intelligent before/after pairs:

${JSON.stringify(analyses, null, 2)}

Match before/after images based on:
- Same roof type
- Similar angle/perspective
- Logical progression from damaged to restored
- Lighting conditions

Return JSON array of pairs:
[
  {
    "before": { "url": string, "analysis": object },
    "after": { "url": string, "analysis": object },
    "location": "SE Melbourne",
    "workPerformed": string,
    "confidence": number
  }
]

If an image doesn't pair well, include it as a standalone project.`
          }
        ]
      })
    });

    const pairingData = await pairingResponse.json();
    const pairs = JSON.parse(pairingData.choices[0].message.content);

    console.log('Paired projects:', pairs);

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
    console.error('Error analyzing images:', error);
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
