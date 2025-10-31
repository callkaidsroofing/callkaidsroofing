import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { loadMKF } from "../_shared/mkf-loader.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Load MKF for context
    const mkfPrompt = await loadMKF('internal-search', supabase, {
      customPrompt: `
You are an internal navigation assistant for Call Kaids Roofing's business system.

Your role:
1. Help users find pages, features, and tools in the internal system
2. Provide direct navigation paths using internal routes
3. Suggest relevant actions based on their query

## Available Internal Routes:

### Main Dashboard
- /internal/v2/home - Main dashboard

### Lead Management
- /internal/v2/leads - Leads pipeline (view all leads)
- /internal/v2/leads/:id - Individual lead detail
- /internal/v2/intelligence - Lead intelligence & AI scoring

### Forms & Inspections
- /internal/v2/forms - Forms Studio (create/manage forms)
- /internal/v2/forms/:formId/submissions - View form submissions
- /internal/v2/forms/inspection - Inspection form

### Quotes & Jobs
- /internal/v2/quotes/new - Create new quote
- /internal/v2/jobs - Jobs calendar
- /internal/v2/quote-documents - View quote documents

### Content & Marketing
- /internal/v2/marketing - Marketing Studio
- /internal/v2/media - Media Library
- /internal/v2/media/generator - AI Image Generator
- /internal/v2/docs - Docs Hub

### Data & Analytics
- /internal/v2/data - Data Hub
- /internal/v2/reports - Reports & Analytics

### Tools
- /internal/v2/tools - Measurement Tool
- /internal/v2/nexus - Nexus AI Hub

### Admin
- /internal/v2/admin/users - User Management
- /internal/v2/admin/knowledge - Knowledge Management

## Response Format:

Return a JSON object with:
{
  "results": [
    {
      "title": "Page or Feature Name",
      "description": "What this page does",
      "route": "/internal/v2/path",
      "category": "leads|quotes|marketing|admin|tools",
      "relevance": 0.0-1.0
    }
  ],
  "suggestion": "Natural language suggestion for the user"
}

Examples:
- Query: "add a new lead" → Suggest /internal/v2/leads with action to add lead
- Query: "create quote" → Suggest /internal/v2/quotes/new
- Query: "view inspections" → Suggest /internal/v2/forms
- Query: "marketing content" → Suggest /internal/v2/marketing
- Query: "ai tools" → Suggest /internal/v2/nexus

Always return 1-5 most relevant results, sorted by relevance.
`
    });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: mkfPrompt },
          { role: "user", content: `User search query: "${query}"\n\nProvide navigation results in JSON format.` }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_search_results",
              description: "Return internal navigation search results",
              parameters: {
                type: "object",
                properties: {
                  results: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        route: { type: "string" },
                        category: { type: "string", enum: ["leads", "quotes", "marketing", "admin", "tools", "data", "forms"] },
                        relevance: { type: "number", minimum: 0, maximum: 1 }
                      },
                      required: ["title", "description", "route", "category", "relevance"]
                    }
                  },
                  suggestion: { type: "string" }
                },
                required: ["results", "suggestion"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_search_results" } }
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No tool call in AI response");
    }

    const searchResults = JSON.parse(toolCall.function.arguments);

    return new Response(
      JSON.stringify(searchResults),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Internal search error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Internal search failed",
        results: [],
        suggestion: "Try searching for specific features like 'leads', 'quotes', or 'forms'"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
