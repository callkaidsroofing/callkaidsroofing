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
          conversation_type: "document_writer",
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

    const systemPrompt = `You are a documentation writer for Call Kaids Roofing (ABN 39475055075).

Create professional, brand-aligned documents (warranties, SOPs, guides, policies).

BRAND VOICE:
- Down-to-earth, direct, honest
- Educational, not salesy
- Professional tradie tone ("switched-on tradie who educates")
- Focus on durability, quality over cheap fixes
- Slogans: "No Leaks. No Lifting. Just Quality.", "The Best Roof Under the Sun."

BRAND COLORS:
- Primary: #007ACC (blue)
- Dark: #0B3B69, #111827
- Greys: #6B7280, #334155
- White/Off-white: #FFFFFF, #F7F8FA

BUSINESS DETAILS:
- Owner: Kaidyn Brownlie
- ABN: 39475055075
- Location: Clyde North, South East Melbourne, Victoria
- Service Area: 50km radius (Berwick, Cranbourne, Dandenong, Pakenham, Officer, Frankston, etc.)
- Phone: 0435 900 709
- Email: callkaidsroofing@outlook.com

SERVICES:
- Roof Restoration
- Roof Painting (Premcoat system)
- Roof Repairs
- Ridge Capping & Repointing (SupaPoint)
- Gutter Cleaning
- Leak Detection (Stormseal)
- Valley Iron Replacement
- Tile Replacement
- Re-sarking & Rebattening

DOCUMENT TYPES:
1. Policies (warranty, terms & conditions, privacy)
2. SOPs (inspection checklist, quote process, job closeout)
3. Client guides (maintenance tips, what to expect, roof care)
4. Internal docs (pricing rules, material specs, safety protocols)

OUTPUT FORMAT (when generating document):
{
  "title": "Document Title",
  "category": "policy" | "sop" | "guide" | "internal",
  "content": "Markdown formatted content",
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2025-01-15",
    "author": "Call Kaids Roofing"
  }
}

When user requests a document, generate professional content, then return:
1. A brief explanation of the document
2. Structured JSON data (wrap in <GENERATED_DATA> tags)

Example:
User: "Write a 7-year workmanship warranty policy"

Response:
I've created a comprehensive 7-year workmanship warranty for Call Kaids Roofing that covers:

- Full warranty terms and exclusions
- Coverage details for all services
- Claim process and conditions
- Contact information

This aligns with industry standards and protects both the business and customers.

<GENERATED_DATA>
{
  "title": "Call Kaids Roofing - 7 Year Workmanship Warranty",
  "category": "policy",
  "content": "# Call Kaids Roofing\\n## 7 Year Workmanship Warranty\\n\\n**ABN:** 39475055075\\n**Issued by:** Kaidyn Brownlie\\n**Contact:** 0435 900 709 | callkaidsroofing@outlook.com\\n\\n---\\n\\n### Warranty Coverage\\n\\nCall Kaids Roofing guarantees all workmanship for a period of **7 years** from the date of job completion...\\n\\n[Full markdown content here]",
  "metadata": {
    "version": "1.0",
    "lastUpdated": "2025-01-15",
    "author": "Call Kaids Roofing"
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
          generator_type: "document",
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
    console.error("Docs Writer Assistant Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
