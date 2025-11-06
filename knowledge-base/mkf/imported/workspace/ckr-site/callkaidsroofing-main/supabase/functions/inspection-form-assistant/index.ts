import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured. Please contact support." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { conversationId, message, context } = await req.json();

    let conversation;
    if (conversationId) {
      const { data, error } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("id", conversationId)
        .single();
      
      if (error || !data) {
        return new Response(
          JSON.stringify({ error: "Conversation not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      conversation = data;
    } else {
      const { data, error } = await supabase
        .from("chat_conversations")
        .insert({
          user_id: user.id,
          conversation_type: "inspection_form",
          context_data: context,
        })
        .select()
        .single();
      
      if (error || !data) {
        console.error("Failed to create conversation:", error);
        return new Response(
          JSON.stringify({ error: "Failed to create conversation" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      conversation = data;
    }

    await supabase.from("chat_messages").insert({
      conversation_id: conversation.id,
      role: "user",
      content: message,
    });

    const { data: history } = await supabase
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", conversation.id)
      .order("created_at", { ascending: true });

    const systemPrompt = `You are an expert roofing inspector assistant for Call Kaids Roofing (ABN 39475055075) in South East Melbourne, Victoria.

Parse natural language observations into structured inspection data.

CAPABILITIES:
- Extract client details (name, phone, email, address)
- Parse roof measurements and specifications
- Identify defects and damage (broken tiles, ridge caps, pointing issues, valley irons)
- Suggest quantities for repairs
- Recommend materials and services based on observations
- Classify roof condition and urgency

ROOF TYPES:
- Concrete Tile
- Terracotta Tile
- Metal (Colorbond)

SERVICES:
- Pressure washing
- Flexible repointing (gables)
- Ridge cap rebedding
- Valley iron replacement
- Broken tile replacement
- Full restoration

OUTPUT FORMAT (when generating inspection data):
{
  "clientName": string,
  "phone": string,
  "email": string | null,
  "siteAddress": string,
  "claddingType": "Concrete Tile" | "Terracotta Tile" | "Metal",
  "roofArea": number (sqm),
  "ridgeCaps": number,
  "gableLengthLM": number,
  "valleyIronsLM": number,
  "brokenTiles": number,
  "observations": {
    "brokenTilesNotes": string,
    "pointingNotes": string,
    "valleyIronsNotes": string,
    "generalCondition": string
  },
  "recommendations": string[],
  "priority": "low" | "medium" | "high" | "urgent",
  "estimatedCost": { min: number, max: number }
}

When user provides observations, parse them intelligently and return both:
1. A conversational response explaining what you understood
2. Structured JSON data (wrap in <GENERATED_DATA> tags)

Example:
User: "Inspected 3 bedroom house in Berwick, concrete tile roof, 15 broken ridge caps on north side, valley iron rusted through, no leaks inside"

Response:
I've captured the inspection details for the Berwick property. Here's what I extracted:

- Roof type: Concrete tile
- Defects: 15 broken ridge caps (north side), rusted valley iron
- Condition: No active leaks (good sign)
- Recommended work: Ridge cap rebedding (~15 caps), valley iron replacement

<GENERATED_DATA>
{
  "siteAddress": "Berwick, VIC",
  "claddingType": "Concrete Tile",
  "ridgeCaps": 15,
  "brokenTiles": 0,
  "valleyIronsLM": 0,
  "observations": {
    "brokenTilesNotes": "",
    "pointingNotes": "15 broken ridge caps on north side",
    "valleyIronsNotes": "Valley iron rusted through, requires replacement",
    "generalCondition": "No active leaks detected inside property"
  },
  "recommendations": ["Ridge cap rebedding - 15 caps", "Valley iron replacement"],
  "priority": "medium",
  "estimatedCost": { "min": 1500, "max": 3000 }
}
</GENERATED_DATA>`;

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
          ...(history || []),
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const assistantMessage = aiData.choices[0].message.content;

    await supabase.from("chat_messages").insert({
      conversation_id: conversation.id,
      role: "assistant",
      content: assistantMessage,
    });

    let generatedData = null;
    const dataMatch = assistantMessage.match(/<GENERATED_DATA>([\s\S]*?)<\/GENERATED_DATA>/);
    if (dataMatch) {
      try {
        generatedData = JSON.parse(dataMatch[1].trim());
        
        await supabase.from("ai_generation_history").insert({
          user_id: user.id,
          generator_type: "inspection",
          input_prompt: message,
          output_data: generatedData,
          applied: false,
        });
      } catch (e) {
        console.error("Failed to parse generated data:", e);
      }
    }

    return new Response(
      JSON.stringify({
        conversationId: conversation.id,
        response: assistantMessage.replace(/<GENERATED_DATA>[\s\S]*?<\/GENERATED_DATA>/, "").trim(),
        generatedData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Inspection Form Assistant Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
