import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, currentData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompt = `You are an AI assistant for Call Kaids Roofing that extracts quote information from natural language descriptions.

KNOWLEDGE BASE:
- Pricing Model: /knowledge-base/core-knowledge/KF_02_PRICING_MODEL.json
- Service Definitions: /knowledge-base/core-knowledge/KF_03_05_SOP_ALL.txt

SERVICES (KF_03_05):
- Roof Restoration, Roof Painting, Roof Repairs
- Ridge Capping & Gable Rebedding/Repointing
- Gutter Cleaning, Leak Detection
- Valley Iron Replacement, Tile Replacement
- Re-sarking & Rebattening, Full Rebedding & Pointing

Extract the following fields from the user's input and return them as JSON:
- client_name: Full name of the client
- property_address: Complete property address
- roof_type: Type of roof (e.g., "Concrete Tile", "Terracotta Tile", "Metal")
- measured_area: Total roof area (e.g., "180 m²")
- key_lengths: Ridge, valley, and other linear measurements (e.g., "Ridge 45m, Valley 12m")
- option1_total: Price for Option 1 (repairs + wash) in format "$X,XXX"
- option2_total: Price for Option 2 (full restoration) in format "$X,XXX"
- option3_total: Price for Option 3 (premium package) in format "$X,XXX"

If a field is not mentioned, keep it as empty string. Return ONLY valid JSON with these exact field names.

Current data: ${JSON.stringify(currentData)}

Instructions:
- Merge new information with existing data
- Format prices with $ and commas (e.g., "$8,500")
- Include units for measurements (m², lm, etc.)
- Be precise and accurate
- Match service terminology to KF_02 service codes where possible`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_quote_data",
              description: "Extract quote information from natural language",
              parameters: {
                type: "object",
                properties: {
                  client_name: { type: "string" },
                  property_address: { type: "string" },
                  roof_type: { type: "string" },
                  measured_area: { type: "string" },
                  key_lengths: { type: "string" },
                  option1_total: { type: "string" },
                  option2_total: { type: "string" },
                  option3_total: { type: "string" }
                },
                required: [],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "extract_quote_data" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    console.log("AI response:", JSON.stringify(aiResponse));

    const toolCall = aiResponse.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const quoteData = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify({ quoteData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in ai-quote-helper:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
