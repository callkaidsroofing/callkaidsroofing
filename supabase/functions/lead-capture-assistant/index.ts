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
          conversation_type: "lead_capture",
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

    const systemPrompt = `You are a lead capture assistant for Call Kaids Roofing in South East Melbourne, Victoria.

Parse natural language inputs to extract lead information and apply intelligent triage.

KNOWLEDGE BASE:
- Lead Intake Workflow: /knowledge-base/gwa-workflows/GWA_01_LEAD_INTAKE.md
- Intelligent Triage: /knowledge-base/gwa-workflows/GWA_12_INTELLIGENT_TRIAGE.md
- Service Definitions: /knowledge-base/core-knowledge/KF_03_05_SOP_ALL.txt

EXTRACT:
- Name (required)
- Phone (required, Australian format: 04XX XXX XXX or 03 XXXX XXXX)
- Email (optional)
- Suburb (required, SE Melbourne)
- Service type (required, match to KF_03_05 services)
- Urgency level (use GWA_12 triage logic)
- Additional notes/context

SERVICE TYPES (KF_03_05):
- Roof Restoration (full service: wash, rebed, repoint, paint)
- Roof Painting (Premcoat membrane coating)
- Roof Repairs (broken tiles, leaks, valley iron)
- Ridge Capping & Gable Rebedding/Repointing
- Gutter Cleaning & Maintenance
- Leak Detection (diagnostic + repair)
- Valley Iron Replacement
- Tile Replacement (broken/damaged tiles)
- Re-sarking & Rebattening
- Full Rebedding & Pointing

SE MELBOURNE SUBURBS (50km radius from Clyde North):
Berwick, Clyde North, Cranbourne, Pakenham, Officer, Dandenong, Rowville, Narre Warren, Hampton Park, Frankston, Mount Eliza, Mornington, Carrum Downs, Endeavour Hills, Lyndhurst, etc.

INTELLIGENT TRIAGE (GWA_12):
- HIGH URGENCY: Active leaks, storm damage, safety hazards
- MEDIUM URGENCY: Visible wear, upcoming rain forecast, proactive maintenance
- LOW URGENCY: Cosmetic improvements, long-term planning

LEAD INTAKE WORKFLOW (GWA_01):
1. Capture complete contact details
2. Identify service type and urgency
3. Confirm suburb is within service area (50km of Clyde North)
4. Note any special requirements or access issues
5. Set initial lead score based on completeness and urgency

OUTPUT FORMAT (when capturing lead):
{
  "name": string,
  "phone": string,
  "email": string | null,
  "suburb": string,
  "service": string,
  "urgency": "low" | "medium" | "high" | "urgent",
  "message": string,
  "source": "manual_ai_capture"
}

When user provides lead information, extract it intelligently and return both:
1. A conversational confirmation
2. Structured JSON data (wrap in <GENERATED_DATA> tags)

If information is missing, ask clarifying questions naturally.

Example:
User: "Sarah called about roof painting in Cranbourne, 0412 345 678"

Response:
Great! I've captured Sarah's details:
- Service: Roof Painting
- Location: Cranbourne
- Phone: 0412 345 678

Do you have her email address or any specific requirements she mentioned?

<GENERATED_DATA>
{
  "name": "Sarah",
  "phone": "0412345678",
  "email": null,
  "suburb": "Cranbourne",
  "service": "Roof Painting",
  "urgency": "medium",
  "message": "Interested in roof painting services",
  "source": "manual_ai_capture"
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
          generator_type: "lead",
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
    console.error("Lead Capture Assistant Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
