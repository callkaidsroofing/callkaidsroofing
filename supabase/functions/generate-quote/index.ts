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
    const { inspectionReportId, tier, preferences } = await req.json();

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

    // Build preferences context
    const preferencesContext = preferences ? `

QUOTE PREFERENCES:
- Client Type: ${preferences.clientType}
- Budget Level: ${preferences.budgetLevel} (${preferences.budgetLevel === 'budget' ? 'use rate_min' : preferences.budgetLevel === 'premium' ? 'use rate_max' : 'use average of rate_min and rate_max'})
- GST Display: ${preferences.gstDisplay}
- Gutter Cleaning: ${preferences.gutterCleaningPreference} (${preferences.gutterCleaningPreference === 'free' ? '$0.00' : preferences.gutterCleaningPreference === 'auto' ? 'free for premium/complete, priced for essential' : 'priced as buffer'})
- Wash + Paint: ${preferences.washPaintPreference} (${preferences.washPaintPreference === 'combined' ? 'single line item' : 'separate wash and paint line items'})
- Ridge Measurement: ${preferences.ridgeMeasurement} (${preferences.ridgeMeasurement === 'caps' ? 'prioritize per ridge cap' : preferences.ridgeMeasurement === 'lm' ? 'use linear meters' : 'show caps primary, LM in description'})
${preferences.specialRequirements ? `- Special Requirements: ${preferences.specialRequirements}` : ''}
` : '';

    // System prompt with pricing logic
    const systemPrompt = `You are an AI quote generator for Call Kaids Roofing, owned by Kaidyn Brownlie (ABN 39475055075) in Clyde North, Victoria.

BRAND VOICE:
- Down-to-earth, honest, direct (like a switched-on tradie)
- Educate, don't upsell
- "No Leaks. No Lifting. Just Quality."
- "Professional Roofing, Melbourne Style."

TIER PHILOSOPHY:
- Essential: Fix what's broken (stops leaks, meets minimum safety)
- Premium: Fix + protect (adds 5-7 years of life, quality materials)
- Complete: Like-new condition (10+ year warranty, full restoration)
${preferencesContext}

PRICING RULES AVAILABLE:
${JSON.stringify(pricingRules, null, 2)}

CRITICAL PRICING INSTRUCTIONS:
1. Ridge work: Prioritize "ridge" unit (per cap), but you can convert from LM if needed (assume ~3 caps per LM)
2. Wash + Paint: If preferences say "combined", use "Pressure Wash + 3-Coat Paint" as ONE line item. If "separate", use "Pressure Wash" and "3-Coat Paint System" as TWO line items
3. Gutter Cleaning: 
   - If preference is "free": Include line item with $0.00 rate
   - If preference is "auto": Free for premium/complete tiers, priced for essential tier
   - If preference is "priced": Always include pricing based on rate_min/rate_max
4. Budget Level:
   - "budget": Use rate_min from pricing rules
   - "standard": Use average of (rate_min + rate_max) / 2
   - "premium": Use rate_max from pricing rules
5. Calculate lineTotal = quantity × unitRate for each item
6. Calculate subtotal = sum of all lineTotals
7. GST = subtotal × 0.1 (always calculate, display will be controlled by preferences)
8. Total = subtotal + GST

TIER-SPECIFIC COMBINATIONS:
Essential Tier:
- Broken tiles, ridge/gable critical repairs, valley stormsealing (if needed)
- Seal penetrations if leaking
- Gutter cleaning: priced if "auto" preference, otherwise follow preference
- NO painting unless critical

Premium Tier:
- All essential work PLUS
- Full ridge/gable rebedding + repointing
- Pressure wash + paint (combined or separate based on preference)
- Valley iron replacement (not just stormseal)
- Gutter cleaning: FREE if "auto" preference
- Seal all penetrations properly

Complete Tier:
- All premium work PLUS
- Re-sarking + re-battening (if inspection shows old sarking/battens)
- Valley clips installation
- Safety rails if required
- Premium materials throughout
- Gutter cleaning: FREE

YOUR TASK:
Generate a complete quote for the "${tier}" tier based on the inspection report and preferences.
Calculate ACTUAL PRICING using the pricing rules and budget level.

INSPECTION DATA:
${JSON.stringify(context, null, 2)}

RETURN FORMAT (JSON):
{
  "tierName": "descriptive name for this tier (e.g., 'Essential Repair Package', 'Premium Restoration')",
  "lineItems": [
    {
      "serviceItem": "exact service name from pricing rules",
      "description": "clear, detailed explanation of what's included and why it's needed",
      "quantity": calculated from inspection data (be precise),
      "unit": "ridge|ea|LM|m²|hrs as appropriate",
      "unitRate": calculated from pricing rules + budget level (actual dollar amount),
      "lineTotal": quantity × unitRate (actual dollar amount),
      "materialSpec": "recommended brand/product from pricing rules"
    }
  ],
  "subtotal": sum of all lineTotals,
  "gst": subtotal × 0.1,
  "total": subtotal + gst,
  "scopeNotes": "Brief explanation of this tier's approach, what's included vs excluded, and expected outcomes (2-4 sentences, brand voice)"
}

LINE ITEM GRANULARITY:
- CRITICAL: Create SEPARATE line items for ridge caps, tiles, gables, valleys, etc.
- DO NOT combine different work types unless preferences specifically say "combined" for wash+paint
- Each distinct work item must be its own line with specific quantity and calculated pricing
- Match serviceItem names EXACTLY to pricing_rules table entries

Be precise with quantities based on inspection measurements. Calculate ALL pricing based on the rules provided.`;

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
          { role: 'user', content: `Generate ${tier} tier quote with full pricing calculations based on the pricing rules and preferences provided.` }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
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
