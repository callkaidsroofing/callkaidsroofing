import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract JWT token
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

    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const action = pathParts[0]; // e.g., 'leads', 'quotes', 'invoices'
    const id = pathParts[1]; // Optional resource ID

    const body = req.method !== "GET" ? await req.json() : null;

    let result;

    // ========== LEADS MANAGEMENT ==========
    if (action === "leads") {
      if (req.method === "POST") {
        // Create new lead
        const { data, error } = await supabase
          .from("leads")
          .insert({
            name: body.name,
            phone: body.phone,
            email: body.email,
            suburb: body.suburb,
            service: body.service,
            message: body.message,
            source: body.source || "internal",
            status: "new"
          })
          .select()
          .single();

        if (error) throw error;
        result = { id: data.id, message: "Lead created successfully", data };

      } else if (req.method === "PATCH" && id) {
        // Update lead status/notes
        const { data, error } = await supabase
          .from("leads")
          .update({
            status: body.status,
            ...(body.notes && { message: body.message })
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        result = { message: "Lead updated successfully", data };

      } else if (req.method === "GET") {
        // List leads with filters
        let query = supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (url.searchParams.has("status")) {
          query = query.eq("status", url.searchParams.get("status"));
        }
        if (url.searchParams.has("service")) {
          query = query.eq("service", url.searchParams.get("service"));
        }
        
        const { data, error } = await query.limit(100);
        if (error) throw error;
        result = { data };
      }
    }

    // ========== QUOTES MANAGEMENT ==========
    else if (action === "quotes") {
      if (req.method === "POST") {
        // Create new quote
        const { data, error } = await supabase
          .from("quotes")
          .insert({
            client_name: body.clientName,
            client_email: body.clientEmail,
            client_phone: body.clientPhone,
            client_address: body.clientAddress,
            inspection_report_id: body.inspectionId,
            lead_id: body.leadId,
            tier_profile: body.tier || "RESTORE",
            regional_modifier: body.regionalModifier || 1.0,
            status: "draft"
          })
          .select()
          .single();

        if (error) throw error;
        result = { quoteId: data.id, data };

      } else if (req.method === "GET" && id) {
        // Get quote details with line items
        const { data, error } = await supabase
          .from("quotes")
          .select(`
            *,
            quote_line_items (*)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        result = { data };

      } else if (req.method === "PATCH" && id) {
        // Update quote status
        const { data, error } = await supabase
          .from("quotes")
          .update({
            status: body.status,
            ...(body.notes && { notes: body.notes })
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        result = { message: "Quote updated successfully", data };
      }
    }

    // ========== INVOICES MANAGEMENT ==========
    else if (action === "invoices") {
      if (req.method === "POST") {
        // Create invoice from quote
        const { data: quote, error: quoteError } = await supabase
          .from("quotes")
          .select("*")
          .eq("id", body.quoteId)
          .single();

        if (quoteError) throw quoteError;

        const { data, error } = await supabase
          .from("invoices")
          .insert({
            quote_id: body.quoteId,
            client_name: quote.client_name,
            client_email: quote.client_email,
            client_phone: quote.client_phone,
            subtotal: quote.subtotal,
            gst: quote.gst,
            total: quote.total,
            balance_due: quote.total,
            status: "draft",
            issue_date: new Date().toISOString().split('T')[0],
            due_date: body.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          })
          .select()
          .single();

        if (error) throw error;
        result = { invoiceId: data.id, data };

      } else if (req.method === "GET" && id) {
        // Get invoice details
        const { data, error } = await supabase
          .from("invoices")
          .select(`
            *,
            invoice_line_items (*)
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        result = { data };
      }
    }

    // ========== TASKS MANAGEMENT ==========
    else if (action === "tasks") {
      if (req.method === "POST") {
        // Create task for lead
        const { data, error } = await supabase
          .from("lead_tasks")
          .insert({
            lead_id: body.leadId,
            title: body.title,
            description: body.description,
            task_type: body.taskType,
            priority: body.priority || "normal",
            due_date: body.dueDate,
            status: "pending"
          })
          .select()
          .single();

        if (error) throw error;
        result = { taskId: data.id, data };

      } else if (req.method === "PATCH" && id) {
        // Update task status
        const { data, error } = await supabase
          .from("lead_tasks")
          .update({
            status: body.status,
            ...(body.status === "completed" && { completed_at: new Date().toISOString() })
          })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;
        result = { message: "Task updated successfully", data };
      }
    }

    // ========== PROJECTS MANAGEMENT ==========
    else if (action === "projects") {
      if (req.method === "GET") {
        const { data, error } = await supabase
          .from("inspection_reports")
          .select(`
            *,
            quotes (*)
          `)
          .order("created_at", { ascending: false })
          .limit(100);

        if (error) throw error;
        result = { data };
      }
    }

    else {
      return new Response(
        JSON.stringify({ error: "Unknown action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("CRM API Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
