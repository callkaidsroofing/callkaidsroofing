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

    // JWT Authentication
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

    const { mode, ...body } = await req.json();

    // ========== MODE: GENERATE ==========
    if (mode === "generate") {
      // Fetch latest KF_02 pricing model
      const { data: pricingData, error: pricingError } = await supabase
        .from("v_pricing_latest")
        .select("*")
        .single();

      if (pricingError || !pricingData) {
        throw new Error("No active pricing model found");
      }

      const kf02 = pricingData.json;
      const pricingVersion = pricingData.version;
      const pricingHash = pricingData.hash;

      // Fetch inspection report if provided
      let inspection = null;
      if (body.inspectionId) {
        const { data: inspData, error: inspError } = await supabase
          .from("inspection_reports")
          .select("*")
          .eq("id", body.inspectionId)
          .single();

        if (inspError) throw inspError;
        inspection = inspData;
      }

      // Determine tier and regional modifier
      const tierProfile = body.tier || "RESTORE"; // REPAIR | RESTORE | PREMIUM
      const region = body.region || "Metro"; // Metro | Outer-SE | Rural

      const tierMarkup = kf02.KF_02_PRICING_MODEL.logic.calculationRules.tierProfiles[tierProfile]?.markup || 1.0;
      const regionalModifier = kf02.KF_02_PRICING_MODEL.logic.calculationRules.regionalModifiers
        .find((r: any) => r.region === region)?.uplift || 1.0;

      // Build line items from inspection
      const lines: any[] = [];
      let subtotal = 0;

      if (inspection) {
        const services = kf02.KF_02_PRICING_MODEL.services;

        // Example: Pressure wash
        if (inspection.pressurewashqty && inspection.pressurewashqty > 0) {
          const service = services.find((s: any) => s.serviceCode === "PRESSUREWASH_ROOF");
          if (service) {
            const baseRate = service.baseRate;
            const qty = inspection.roofArea || inspection.pressurewashqty;
            const adjustedRate = baseRate * tierMarkup * regionalModifier;
            const lineTotal = qty * adjustedRate;
            
            lines.push({
              service_code: "PRESSUREWASH_ROOF",
              display_name: service.name,
              description: service.description,
              quantity: qty,
              unit: service.unit,
              unit_rate: adjustedRate,
              line_total: lineTotal,
              sort_order: lines.length + 1
            });
            
            subtotal += lineTotal;
          }
        }

        // Flexible repointing
        if (inspection.flexiblerepointingqty && inspection.flexiblerepointingqty > 0) {
          const service = services.find((s: any) => s.serviceCode === "REPOINT_FLEXIBLE");
          if (service) {
            const baseRate = service.baseRate;
            const qty = inspection.gableLengthLM || inspection.flexiblerepointingqty;
            const adjustedRate = baseRate * tierMarkup * regionalModifier;
            const lineTotal = qty * adjustedRate;
            
            lines.push({
              service_code: "REPOINT_FLEXIBLE",
              display_name: service.name,
              description: service.description,
              quantity: qty,
              unit: service.unit,
              unit_rate: adjustedRate,
              line_total: lineTotal,
              sort_order: lines.length + 1
            });
            
            subtotal += lineTotal;
          }
        }

        // Ridge rebedding
        if (inspection.rebedridgeqty && inspection.rebedridgeqty > 0) {
          const service = services.find((s: any) => s.serviceCode === "REBED_RIDGE");
          if (service) {
            const baseRate = service.baseRate;
            const qty = inspection.ridgeCaps || inspection.rebedridgeqty;
            const adjustedRate = baseRate * tierMarkup * regionalModifier;
            const lineTotal = qty * adjustedRate;
            
            lines.push({
              service_code: "REBED_RIDGE",
              display_name: service.name,
              description: service.description,
              quantity: qty,
              unit: service.unit,
              unit_rate: adjustedRate,
              line_total: lineTotal,
              sort_order: lines.length + 1
            });
            
            subtotal += lineTotal;
          }
        }
      }

      // Calculate GST and total
      const gstRate = kf02.KF_02_PRICING_MODEL.constants.gstRate;
      const roundTo = kf02.KF_02_PRICING_MODEL.constants.roundTo;
      
      const gst = subtotal * gstRate;
      const total = Math.round((subtotal + gst) / roundTo) * roundTo;

      // Create quote
      const { data: quote, error: quoteError } = await supabase
        .from("quotes")
        .insert({
          client_name: body.clientName || inspection?.clientName || "Customer",
          client_email: body.clientEmail || inspection?.email,
          client_phone: body.clientPhone || inspection?.phone,
          client_address: body.clientAddress || inspection?.siteAddress,
          inspection_report_id: body.inspectionId,
          lead_id: body.leadId,
          subtotal,
          gst,
          total,
          tier_profile: tierProfile,
          regional_modifier: regionalModifier,
          pricing_version: pricingVersion,
          pricing_hash: pricingHash,
          pricing_snapshot: { services: lines.map(l => ({ serviceCode: l.service_code })) },
          status: "draft"
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Insert line items
      if (lines.length > 0) {
        const lineItems = lines.map(line => ({
          quote_id: quote.id,
          ...line
        }));

        const { error: linesError } = await supabase
          .from("quote_line_items")
          .insert(lineItems);

        if (linesError) throw linesError;
      }

      return new Response(
        JSON.stringify({
          quoteId: quote.id,
          lines,
          totals: { subtotal, gst, total },
          pricing_version: pricingVersion,
          pricing_hash: pricingHash
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========== MODE: MODIFY ==========
    else if (mode === "modify") {
      const { quoteId, ops } = body;

      for (const op of ops) {
        if (op.op === "add_line") {
          await supabase.from("quote_line_items").insert({
            quote_id: quoteId,
            ...op.payload
          });
        } else if (op.op === "update_line") {
          await supabase.from("quote_line_items")
            .update(op.payload)
            .eq("id", op.lineId);
        } else if (op.op === "delete_line") {
          await supabase.from("quote_line_items")
            .delete()
            .eq("id", op.lineId);
        }
      }

      // Recalculate totals
      const { data: lines } = await supabase
        .from("quote_line_items")
        .select("*")
        .eq("quote_id", quoteId);

      const subtotal = lines?.reduce((sum, line) => sum + parseFloat(line.line_total), 0) || 0;
      const gst = subtotal * 0.1;
      const total = Math.round((subtotal + gst) / 10) * 10;

      await supabase.from("quotes")
        .update({ subtotal, gst, total })
        .eq("id", quoteId);

      return new Response(
        JSON.stringify({ quoteId, updated: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ========== MODE: CHAT (placeholder for AI assistant) ==========
    else if (mode === "chat") {
      return new Response(
        JSON.stringify({ error: "Chat mode not yet implemented" }),
        { status: 501, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    else {
      return new Response(
        JSON.stringify({ error: "Invalid mode" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

  } catch (error) {
    console.error("Quote Engine Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
