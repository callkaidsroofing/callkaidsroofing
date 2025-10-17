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

    // System prompt for quote generation
    const systemPrompt = `You are a roofing quote assistant for Call Kaids Roofing, owned by Kaidyn Brownlie (ABN 39475055075) in Clyde North, Victoria.

BRAND VOICE:
- Down-to-earth, honest, direct (like a switched-on tradie)
- Educate, don't upsell
- "No Leaks. No Lifting. Just Quality."
- "Professional Roofing, Melbourne Style."

PRICING CONTEXT:
${JSON.stringify(pricingRules, null, 2)}

TIER PHILOSOPHY:
- Essential: Fix what's broken (stops leaks, meets minimum safety)
- Premium: Fix + protect (adds 5-7 years of life, quality materials)
- Complete: Like-new condition (10+ year warranty, full restoration)

YOUR TASK:
Generate a quote for the "${tier}" tier based on the inspection report below.

INSPECTION DATA:
${JSON.stringify(context, null, 2)}

RETURN FORMAT (JSON):
{
  "tierName": "descriptive name for this tier (e.g., 'Essential Repair Package', 'Premium Restoration')",
  "lineItems": [
    {
      "serviceItem": "matching pricing_rules.service_item",
      "description": "clear explanation of what's included",
      "quantity": calculated from inspection data,
      "unit": "matching pricing_rules.unit",
      "unitRate": selected from rate_min to rate_max based on tier,
      "lineTotal": quantity * unitRate,
      "materialSpec": "brand/product if applicable"
    }
  ],
  "subtotal": sum of all lineTotal,
  "gst": subtotal * 0.1,
  "total": subtotal + gst,
  "notes": "brief explanation of tier choice and key benefits (2-3 sentences, brand voice)"
}

CALCULATION RULES:
- Essential tier: use rate_min (basic materials, minimum scope)
- Premium tier: use mid-range rates (quality materials like Premcoat)
- Complete tier: use rate_max (premium materials, full scope)

Be precise with quantities based on inspection measurements. Round to practical units.`;

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
