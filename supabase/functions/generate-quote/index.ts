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
    const { inspectionReportId, tier } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch inspection report
    const { data: report, error: reportError } = await supabase
      .from('inspection_reports')
      .select('*')
      .eq('id', inspectionReportId)
      .single();

    if (reportError || !report) {
      throw new Error('Inspection report not found');
    }

    // Fetch pricing rules
    const { data: pricingRules, error: pricingError } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('is_active', true);

    if (pricingError) {
      throw new Error('Failed to fetch pricing rules');
    }

    // Build context for AI
    const context = {
      client: {
        name: report.clientName,
        address: report.siteAddress,
        suburb: report.suburbPostcode,
        phone: report.phone,
        email: report.email,
      },
      roof: {
        type: report.claddingType,
        tileProfile: report.tileProfile,
        tileColour: report.tileColour,
        age: report.ageApprox,
        pitch: report.roofPitch,
        area: report.roofArea,
        condition: report.overallCondition,
      },
      findings: {
        brokenTiles: report.brokenTiles || 0,
        ridgeCaps: report.ridgeCaps || 0,
        valleyLength: report.valleyLength || 0,
        gutterPerimeter: report.gutterPerimeter || 0,
        gableLengthTiles: report.gableLengthTiles || 0,
        gableLengthLM: report.gableLengthLM || 0,
        pointing: report.pointing,
        valleyIrons: report.valleyIrons,
        guttersDownpipes: report.guttersDownpipes,
        penetrations: report.penetrations,
      },
      recommendedWorks: report.recommendedWorks || [],
    };

    // System prompt for quote suggestions (no pricing, AI calculates scope/quantities only)
    const systemPrompt = `You are a roofing scope assistant for Call Kaids Roofing, owned by Kaidyn Brownlie (ABN 39475055075) in Clyde North, Victoria.

BRAND VOICE:
- Down-to-earth, honest, direct (like a switched-on tradie)
- Educate, don't upsell
- "No Leaks. No Lifting. Just Quality."
- "Professional Roofing, Melbourne Style."

TIER PHILOSOPHY:
- Essential: Fix what's broken (stops leaks, meets minimum safety)
- Premium: Fix + protect (adds 5-7 years of life, quality materials)
- Complete: Like-new condition (10+ year warranty, full restoration)

CRITICAL SCOPE RULES:
- For ridge rebedding and repointing: ALWAYS specify "per ridge" (each ridge cap), NOT per linear meter
- Unit must be "ridge" or "ea" for ridge rebedding/repointing items
- Calculate total number of ridge caps from inspection data
- Be specific about what work is needed based on inspection findings

YOUR TASK:
Generate line item SUGGESTIONS for the "${tier}" tier based on the inspection report below.
DO NOT include pricing - leave unitRate and lineTotal as 0.
Focus on: what work is needed, accurate quantities, clear descriptions, and appropriate units.

INSPECTION DATA:
${JSON.stringify(context, null, 2)}

RETURN FORMAT (JSON):
{
  "tierName": "descriptive name for this tier (e.g., 'Essential Repair Package', 'Premium Restoration')",
  "lineItems": [
    {
      "serviceItem": "specific work item name",
      "description": "clear, detailed explanation of what's included and why it's needed",
      "quantity": calculated from inspection data (be precise),
      "unit": "ridge|ea|LM|m²|hrs as appropriate",
      "unitRate": 0,
      "lineTotal": 0,
      "materialSpec": "recommended brand/product if applicable (e.g., 'Premcoat', 'SupaPoint')"
    }
  ],
  "subtotal": 0,
  "gst": 0,
  "total": 0,
  "scopeNotes": "Brief explanation of this tier's approach, what's included vs excluded, and expected outcomes (2-4 sentences, brand voice)"
}

SCOPE GUIDANCE BY TIER:
- Essential: Address only critical issues found in inspection (leaks, safety hazards, broken tiles)
- Premium: Include essential fixes PLUS protective measures (coating, repointing, preventative work)
- Complete: Full restoration scope (everything in premium PLUS re-sarking, full rebedding, comprehensive renewal)

LINE ITEM GRANULARITY:
- CRITICAL: Create SEPARATE line items for ridge caps, tiles, gables, valleys, etc.
- DO NOT combine different work types
- Each distinct work item must be its own line with specific quantity and unit
- Example: "Ridge Cap Rebedding" (45 ridge), "Broken Tile Replacement" (8 ea), "Gable Rebedding" (12 LM) as 3 separate items

Be precise with quantities based on inspection measurements. Use professional roofing terminology.`;

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate ${tier} tier quote` }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Error:', aiResponse.status, errorText);
      throw new Error(`AI generation failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const quoteData = JSON.parse(aiData.choices[0].message.content);

    // Generate quote number
    const { data: quoteNumberData, error: quoteNumberError } = await supabase
      .rpc('generate_quote_number');

    if (quoteNumberError) {
      throw new Error('Failed to generate quote number');
    }

    const quoteNumber = quoteNumberData;

    // Calculate valid_until (30 days from now)
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    // Get user ID from auth header
    const authHeader = req.headers.get('authorization');
    let userId = null;
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id;
    }

    // Insert quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        inspection_report_id: inspectionReportId,
        quote_number: quoteNumber,
        client_name: report.clientName,
        site_address: report.siteAddress,
        suburb_postcode: report.suburbPostcode,
        email: report.email,
        phone: report.phone,
        tier_level: tier,
        subtotal: quoteData.subtotal,
        gst: quoteData.gst,
        total: quoteData.total,
        valid_until: validUntil.toISOString().split('T')[0],
        notes: quoteData.notes,
        created_by: userId,
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Quote insert error:', quoteError);
      throw new Error('Failed to save quote');
    }

    // Insert line items
    const lineItemsToInsert = quoteData.lineItems.map((item: any, index: number) => ({
      quote_id: quote.id,
      service_item: item.serviceItem,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unit_rate: item.unitRate,
      line_total: item.lineTotal,
      sort_order: index,
    }));

    const { error: lineItemsError } = await supabase
      .from('quote_line_items')
      .insert(lineItemsToInsert);

    if (lineItemsError) {
      console.error('Line items insert error:', lineItemsError);
      throw new Error('Failed to save quote line items');
    }

    return new Response(
      JSON.stringify({
        success: true,
        quote: {
          ...quote,
          tierName: quoteData.tierName,
          lineItems: quoteData.lineItems,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in generate-quote:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
