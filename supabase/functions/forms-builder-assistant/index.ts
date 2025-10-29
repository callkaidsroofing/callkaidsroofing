import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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
      const { data } = await supabase
        .from("chat_conversations")
        .select("*")
        .eq("id", conversationId)
        .single();
      conversation = data;
    } else {
      const { data } = await supabase
        .from("chat_conversations")
        .insert({
          user_id: user.id,
          context_type: "form_builder",
          context_data: context,
        })
        .select()
        .single();
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

    const systemPrompt = `You are a form builder assistant for Call Kaids Roofing CRM.

Generate JSON Schema and UI Schema from natural language descriptions.

FORM TYPES:
- Lead capture forms (name, phone, service)
- Inspection request forms (property details, photos)
- Warranty claim forms (defect description, evidence)
- Customer feedback forms (satisfaction, NPS)
- Job completion forms (photos, checklist)
- Quote request forms (service type, urgency)

FIELD TYPES:
- text (short text input)
- textarea (long text)
- email (validated email)
- phone (Australian phone format)
- select (dropdown)
- radio (radio buttons)
- checkbox (boolean or multi-select)
- date (date picker)
- file (file upload, especially photos)
- number (numeric input)

OUTPUT FORMAT (when generating form):
{
  "name": "Form Name",
  "description": "Form purpose",
  "schema": {
    "type": "object",
    "properties": {
      "fieldName": {
        "type": "string",
        "title": "Field Label",
        "description": "Help text"
      }
    },
    "required": ["requiredField1", "requiredField2"]
  },
  "uiSchema": {
    "ui:order": ["field1", "field2", "field3"],
    "fieldName": {
      "ui:widget": "textarea",
      "ui:placeholder": "Enter details...",
      "ui:help": "Additional instructions"
    }
  }
}

When user requests a form, generate both schema and UI schema, then return:
1. A conversational explanation of the form structure
2. Structured JSON data (wrap in <GENERATED_DATA> tags)

Example:
User: "Create a warranty claim form with customer details, issue description, and photo upload"

Response:
I'll create a warranty claim form with the following fields:

1. Customer Information:
   - Full name (required)
   - Phone number (required)
   - Email (optional)
   
2. Claim Details:
   - Issue description (textarea, required)
   - Date issue discovered (date picker)
   - Severity level (dropdown: Minor/Moderate/Severe)
   
3. Evidence:
   - Photo upload (accepts images)

<GENERATED_DATA>
{
  "name": "Warranty Claim Form",
  "description": "Submit warranty claims for roofing work",
  "schema": {
    "type": "object",
    "properties": {
      "fullName": { "type": "string", "title": "Full Name" },
      "phone": { "type": "string", "title": "Phone Number" },
      "email": { "type": "string", "title": "Email", "format": "email" },
      "issueDescription": { "type": "string", "title": "Issue Description" },
      "dateDiscovered": { "type": "string", "title": "Date Discovered", "format": "date" },
      "severity": { "type": "string", "title": "Severity", "enum": ["Minor", "Moderate", "Severe"] },
      "photos": { "type": "string", "title": "Photo Evidence" }
    },
    "required": ["fullName", "phone", "issueDescription", "dateDiscovered"]
  },
  "uiSchema": {
    "ui:order": ["fullName", "phone", "email", "issueDescription", "dateDiscovered", "severity", "photos"],
    "issueDescription": { "ui:widget": "textarea", "ui:placeholder": "Describe the issue in detail..." },
    "photos": { "ui:widget": "file", "ui:options": { "accept": "image/*" } }
  }
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
          generator_type: "form",
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
    console.error("Forms Builder Assistant Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
