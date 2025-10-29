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

    // Fetch KF_02 pricing model
    console.log("[generate-quote] Fetching KF_02 pricing model...");
    const { data: pricingData, error: pricingError } = await supabase
      .from('v_pricing_latest')
      .select('json, version, hash')
      .single();

    if (pricingError || !pricingData) {
      throw new Error(`Failed to fetch pricing model: ${pricingError?.message || 'No active pricing found'}`);
    }

    const kf02 = pricingData.json.KF_02_PRICING_MODEL;
    const kf02Version = pricingData.version;
    const kf02Hash = pricingData.hash;

    console.log(`[generate-quote] Using KF_02 v${kf02Version}`);

    // Map tier to KF_02 tier profile
    const tierMapping: Record<string, string> = {
      'essential': 'REPAIR',
      'premium': 'RESTORE',
      'complete': 'PREMIUM'
    };
    const tierProfile = tierMapping[tier] || 'RESTORE';
    const tierMarkup = kf02.logic.calculationRules.tierProfiles[tierProfile].markup;

    console.log(`[generate-quote] Tier: ${tier} → Profile: ${tierProfile} (${tierMarkup}x markup)`);

    // Get regional modifier from preferences
    const region = preferences?.region || 'Metro';
    const regionalModifier = kf02.logic.calculationRules.regionalModifiers.find(
      (r: any) => r.region === region
    )?.uplift || 1.0;

    console.log(`[generate-quote] Region: ${region} → Modifier: ${regionalModifier}x`);

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

    // Enhanced system prompt with KF_02 services
    const systemPrompt = `You are an AI quote generator for Call Kaids Roofing using KF_02 v${kf02Version} pricing model.

PRICING MODEL CONSTANTS:
- GST Rate: ${kf02.constants.gstRate * 100}%
- Profit Margin Target: ${kf02.constants.profitMarginTarget * 100}%
- Contingency Buffer: ${kf02.constants.contingencyBuffer * 100}%
- Rounding: Nearest $${kf02.constants.roundTo}

TIER CONFIGURATION:
- Selected Tier: ${tier} → Profile: ${tierProfile}
- Tier Markup: ${tierMarkup}x
- Warranty: ${kf02.logic.calculationRules.tierProfiles[tierProfile].warranty}

REGIONAL MODIFIER:
- Region: ${region}
- Uplift: ${regionalModifier}x

BRAND VOICE (KF_09):
- Down-to-earth, honest, direct (like a switched-on tradie)
- Educate, don't upsell
- Slogans: "No Leaks. No Lifting. Just Quality.", "The Best Roof Under the Sun.", "Professional Roofing, Melbourne Style."
- Use real jobsite terminology, avoid corporate speak

WARRANTY & LEGAL (KF_07):
- 7-10 year workmanship warranty (tier-dependent)
- Weather-dependent scheduling
- Fully insured, ABN 39475055075
- Materials: Premcoat membrane, SupaPoint flexible compound, Stormseal
- All work meets Australian Standards

CASE STUDY EXAMPLES (KF_08):
- Reference successful projects for social proof
- Show before/after transformation value
- Highlight material durability and warranty coverage

KNOWLEDGE REFERENCES:
- Pricing Model: /knowledge-base/core-knowledge/KF_02_PRICING_MODEL.json
- Legal & Warranty: /knowledge-base/core-knowledge/KF_07_LEGAL_WARRANTY.md
- Case Studies: /knowledge-base/core-knowledge/KF_08_CASE_STUDIES.json

AVAILABLE SERVICES (select from these serviceCode values):
${kf02.services.map((s: any) => `
- ${s.serviceCode}: ${s.displayName}
  Unit: ${s.unit} | Base Rate: $${s.baseRate || s.addOnRate}${s.addOnRate ? ' (addon)' : ''}
  Composition: ${JSON.stringify(s.composition || {})}
  Warranty: ${s.defaultWarrantyYears?.join('-') || 'N/A'} years
  Time per unit: ${s.timePerUnitHr || 'N/A'} hrs
`).join('\n')}

TIER PHILOSOPHY:
- REPAIR (Essential): Fix what's broken (stops leaks, meets minimum safety)
- RESTORE (Premium): Fix + protect (adds 5-7 years of life, quality materials)
- PREMIUM (Complete): Like-new condition (10+ year warranty, full restoration)
${preferencesContext}

CALCULATION RULES:
1. Select services from KF_02 services array matching serviceCode
2. Apply rate adjustments:
   - adjustedRate = baseRate × tierMarkup (${tierMarkup}) × regionalModifier (${regionalModifier})
3. Calculate quantity from inspection measurements
4. lineTotal = quantity × adjustedRate
5. subtotal = sum(lineTotals)
6. Apply contingency if applicable: subtotal × (1 + ${kf02.constants.contingencyBuffer})
7. GST = subtotal × ${kf02.constants.gstRate}
8. total = subtotal + GST, rounded to nearest $${kf02.constants.roundTo}

CRITICAL INSTRUCTIONS:
- ONLY use serviceCode values from the KF_02 services list above
- ALWAYS apply both tierMarkup AND regionalModifier to baseRate
- ALWAYS round final total to nearest $${kf02.constants.roundTo}
- Include composition breakdown for transparency
- Match warranty years to tier profile expectations

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
      "serviceCode": "EXACT_MATCH_FROM_KF02_SERVICES_LIST",
      "displayName": "Human-readable name",
      "description": "clear, detailed explanation of what's included and why it's needed",
      "quantity": calculated from inspection data (be precise),
      "unit": "lm|m2|each",
      "unitRate": adjusted rate after tierMarkup × regionalModifier,
      "lineTotal": quantity × unitRate,
      "composition": { "labour": {...}, "materials": {...} },
      "materialSpec": "SupaPoint flexible compound",
      "warrantyYears": [7, 10]
    }
  ],
  "subtotal": sum of all lineTotals,
  "gst": subtotal × ${kf02.constants.gstRate},
  "total": subtotal + gst (rounded to nearest $${kf02.constants.roundTo}),
  "contingencyAmount": applicable contingency,
  "scopeNotes": "Brief explanation of this tier's approach (2-4 sentences, brand voice)"
}

LINE ITEM GRANULARITY:
- Create SEPARATE line items for ridge caps, tiles, gables, valleys, etc.
- Each distinct work item must be its own line with specific quantity and calculated pricing
- Match serviceCode names EXACTLY to KF_02 services list

Be precise with quantities based on inspection measurements.`;

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

    // Store pricing snapshot (immutable record)
    const pricingSnapshot = {
      version: kf02Version,
      hash: kf02Hash,
      tierProfile,
      regionalModifier,
      servicesUsed: quoteData.lineItems.map((item: any) => {
        const service = kf02.services.find((s: any) => s.serviceCode === item.serviceCode);
        return {
          serviceCode: item.serviceCode,
          baseRate: service?.baseRate || service?.addOnRate,
          composition: service?.composition,
          warranty: service?.defaultWarrantyYears
        };
      })
    };

    // Insert quote with KF_02 metadata
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
        tier_profile: tierProfile,
        subtotal: quoteData.subtotal,
        gst: quoteData.gst,
        total: quoteData.total,
        valid_until: validUntil.toISOString().split('T')[0],
        notes: quoteData.scopeNotes || quoteData.notes,
        pricing_version: kf02Version,
        pricing_hash: kf02Hash,
        pricing_snapshot: pricingSnapshot,
        regional_modifier: regionalModifier,
        created_by: userId,
      })
      .select()
      .single();

    console.log(`[generate-quote] Quote created with KF_02 v${kf02Version} metadata`);

    if (quoteError) {
      console.error('Quote insert error:', quoteError);
      throw new Error('Failed to save quote');
    }

    // Insert line items with KF_02 metadata
    const lineItemsToInsert = quoteData.lineItems.map((item: any, index: number) => ({
      quote_id: quote.id,
      service_item: item.displayName,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unit_rate: item.unitRate,
      line_total: item.lineTotal,
      sort_order: index,
      service_code: item.serviceCode,
      composition: item.composition,
      warranty_years: item.warrantyYears,
      material_spec: item.materialSpec,
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
