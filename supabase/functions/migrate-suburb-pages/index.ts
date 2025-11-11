import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hardcoded suburb page data extracted from existing TSX files
const SUBURB_PAGES = [
  {
    name: 'Clyde North',
    slug: 'clyde-north',
    service: 'Roof Painting',
    postcode: '3978',
    region: 'SE Melbourne',
    meta_title: 'Roof Painting Clyde North | Tile & Metal Roof Coatings',
    meta_description: 'Clyde North roof painting with premium membranes, fast turnaround and 10-year warranty. Freshen new estates or revive original builds.',
    description: 'Clyde North developments move fast, and keeping your roof sharp helps your home stand out. UV exposure, estate dust and new construction grime can dull tiles quickly. Our Clyde North roof painting service brings back that display-home finish.',
    local_seo_content: `Whether you're in Selandra Rise, Highgrove or Clydevale, we handle the colour consultation, roof prep and coating so everything looks flawless. We schedule work around school traffic and estate guidelines for a smooth experience.

Our Roof Painting System:
• Roof cleaning & sterilising to remove builder dust and grime
• Minor roof repairs to ensure a tight finish before coatings go on
• Primer tailored to modern concrete tiles used across Clyde North estates
• Two top coats with 10-year warranty in your preferred gloss level

Why Clyde North Residents Choose Us:
• Clyde North roof painting specialist who understands estate design rules
• 10-year workmanship warranty backed by ABN 39475055075 plus manufacturer guarantees
• Phone: 0435 900 709 – talk directly with Kaidyn about colour samples and scheduling
• Clean site management to keep driveways, render and landscaping spotless

Popular Colour Options:
• Monument, Night Sky and Basalt for bold contrast
• Shale Grey and Surfmist for bright architectural looks
• Woodland Grey and Dune for warm, earthy tones
• Custom tinting available to match render or garage doors`,
    services_available: ['Roof Painting', 'Roof Restoration', 'Roof Repairs']
  },
  {
    name: 'Cranbourne',
    slug: 'cranbourne',
    service: 'Roof Painting',
    postcode: '3977',
    region: 'SE Melbourne',
    meta_title: 'Roof Painting Cranbourne | Professional Roof Coating Services',
    meta_description: 'Expert roof painting in Cranbourne with premium coatings and 10-year warranty. Restore your roof\'s appearance and protection.',
    description: 'Professional roof painting services in Cranbourne delivering lasting results. Our experienced team uses premium coatings to restore and protect your roof while enhancing your home\'s curb appeal.',
    local_seo_content: `Cranbourne Roof Painting Excellence:
• Comprehensive roof cleaning and preparation
• High-quality primer and coating systems
• 10-year workmanship warranty
• Color consultation and matching services

Our Cranbourne roof painting process ensures thorough preparation, premium materials, and expert application for results that last. We understand local weather conditions and select coatings that perform in SE Melbourne's climate.

Contact us today for a free roof painting quote in Cranbourne.`,
    services_available: ['Roof Painting', 'Roof Restoration', 'Roof Cleaning']
  },
  {
    name: 'Pakenham',
    slug: 'pakenham',
    service: 'Roof Painting',
    postcode: '3810',
    region: 'SE Melbourne',
    meta_title: 'Roof Painting Pakenham | Expert Roof Coating & Restoration',
    meta_description: 'Pakenham roof painting specialists. Premium coatings, 15-year warranty, and expert service. Transform your roof today.',
    description: 'Transform your Pakenham home with professional roof painting services. We combine expert preparation, premium coatings, and meticulous application to deliver outstanding results that protect and beautify your roof for years to come.',
    local_seo_content: `Pakenham Roof Painting Services:
• Complete roof inspection and assessment
• Pressure cleaning and surface preparation
• Minor repairs and ridge cap maintenance
• Premium membrane coating systems
• 15-year warranty on workmanship

Why Choose CKR for Pakenham Roof Painting:
• Local expertise in SE Melbourne roofing
• Direct owner contact - speak with Kaidyn on 0435 900 709
• Transparent pricing and detailed quotes
• Insurance and ABN 39475055075 registered business
• Clean, professional service from start to finish

Book your free Pakenham roof painting quote today.`,
    services_available: ['Roof Painting', 'Roof Restoration', 'Roof Repairs', 'Roof Cleaning']
  },
  {
    name: 'Berwick',
    slug: 'berwick',
    service: 'Roof Restoration',
    postcode: '3806',
    region: 'SE Melbourne',
    meta_title: 'Roof Restoration Berwick | Complete Roof Renewal Services',
    meta_description: 'Berwick roof restoration specialists. Full restoration, repairs, and protection with 15-year warranty. Restore your roof\'s integrity.',
    description: 'Complete roof restoration services in Berwick. Our comprehensive approach addresses all aspects of roof deterioration, from cracked tiles to worn valleys, delivering a fully restored roof system that protects your home.',
    local_seo_content: `Berwick Roof Restoration Process:
• Comprehensive roof inspection and documentation
• High-pressure cleaning and debris removal
• All necessary repairs - tiles, valleys, flashings, ridge caps
• Re-bedding and re-pointing of ridge caps
• Protective membrane coating system
• 15-year workmanship warranty

Common Berwick Roofing Issues We Fix:
• Cracked and broken tiles from age and weather
• Deteriorated ridge caps and bedding
• Leaking valleys and flashings
• Worn roof coatings and surface degradation
• Storm damage and debris impact

Why Berwick Homeowners Trust CKR:
• Local SE Melbourne specialists since establishment
• ABN 39475055075 - fully insured and registered
• Direct owner contact - 0435 900 709
• Transparent quotes with detailed scope
• Clean, professional service with site protection`,
    services_available: ['Roof Restoration', 'Roof Repairs', 'Ridge Cap Repairs', 'Roof Cleaning']
  },
  {
    name: 'Mount Eliza',
    slug: 'mount-eliza',
    service: 'Roof Restoration',
    postcode: '3930',
    region: 'Mornington Peninsula',
    meta_title: 'Roof Restoration Mount Eliza | Coastal Roof Specialists',
    meta_description: 'Mount Eliza roof restoration experts. Combat salt spray and coastal conditions with premium restoration and 15-year warranty.',
    description: 'Coastal roof restoration specialists for Mount Eliza. We understand the unique challenges of salt spray, sea winds, and coastal weathering, delivering restoration solutions designed for Mornington Peninsula conditions.',
    local_seo_content: `Mount Eliza Coastal Roof Challenges:
• Salt spray accelerating tile and metal deterioration
• Strong sea winds causing mechanical stress
• High UV exposure from coastal reflection
• Moisture accumulation from ocean proximity

Our Mount Eliza Restoration Approach:
• Specialized cleaning to remove salt buildup
• Coastal-grade protective coatings
• Enhanced valley and flashing protection
• Marine-resistant ridge cap systems
• 15-year warranty backed by local expertise

Mount Eliza Roof Restoration Inclusions:
• Full roof inspection and condition report
• High-pressure cleaning with salt neutralization
• All repairs - tiles, valleys, flashings, penetrations
• Re-bedding and re-pointing with premium materials
• Flexible membrane coating system
• Site protection and professional cleanup

Contact Kaidyn directly on 0435 900 709 for Mount Eliza roof restoration.`,
    services_available: ['Roof Restoration', 'Coastal Roof Repairs', 'Salt Damage Treatment', 'Roof Cleaning']
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { dryRun = false } = await req.json();

    const results = {
      total: SUBURB_PAGES.length,
      migrated: 0,
      skipped: 0,
      errors: [],
      details: [] as any[]
    };

    for (const page of SUBURB_PAGES) {
      try {
        // Check if suburb already exists
        const { data: existing, error: checkError } = await supabase
          .from('content_suburbs')
          .select('id, name')
          .eq('slug', page.slug)
          .maybeSingle();

        if (checkError) {
          console.error('Check error:', checkError);
          results.errors.push({ suburb: page.name, error: checkError.message });
          continue;
        }

        if (existing) {
          results.skipped++;
          results.details.push({
            suburb: page.name,
            status: 'skipped',
            reason: 'Already exists in database'
          });
          continue;
        }

        if (!dryRun) {
          // Insert new suburb
          const { error: insertError } = await supabase
            .from('content_suburbs')
            .insert({
              name: page.name,
              slug: page.slug,
              postcode: page.postcode,
              region: page.region,
              description: page.description,
              local_seo_content: page.local_seo_content,
              meta_title: page.meta_title,
              meta_description: page.meta_description,
              services_available: page.services_available,
              featured: true
            });

          if (insertError) {
            console.error('Insert error:', insertError);
            results.errors.push({ suburb: page.name, error: insertError.message });
            continue;
          }
        }

        results.migrated++;
        results.details.push({
          suburb: page.name,
          status: dryRun ? 'would_migrate' : 'migrated',
          service: page.service
        });

      } catch (error) {
        console.error(`Error processing ${page.name}:`, error);
        results.errors.push({ 
          suburb: page.name, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      }
    }

    return new Response(JSON.stringify({
      success: true,
      dryRun,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Migration error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
