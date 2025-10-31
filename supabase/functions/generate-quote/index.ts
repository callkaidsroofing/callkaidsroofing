import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { loadMKF } from "../_shared/mkf-loader.ts";

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

    // Load MKF knowledge for quote generation
    const mkfPrompt = await loadMKF('generate-quote', supabase, {
      customPrompt: `You are generating a quote using KF_02 v${kf02Version} pricing model.

PRICING MODEL CONSTANTS:
- GST Rate: ${kf02.constants.gstRate * 100}%
- Tier: ${tier} → Profile: ${tierProfile} (${tierMarkup}x markup)
- Regional Modifier: ${region} (${regionalModifier}x)

QUOTE CONTEXT:
${JSON.stringify(context, null, 2)}

${preferencesContext}

Generate accurate quote with line items following KF_02 service codes and rates.
Apply tier markup and regional modifier to all line items.
Include materials specifications from MKF_05.`
    });

    const systemPrompt = mkfPrompt;

    // Generate the quote using AI
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
