import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY');
const NOTION_VERSION = '2022-06-28';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MigrationResult {
  data_source: string;
  attempted: number;
  created: number;
  skipped: number;
  failed: number;
  errors: string[];
}

interface MigrationReport {
  migration_started_at: string;
  migration_completed_at?: string;
  total_duration_seconds?: number;
  dry_run: boolean;
  results: Record<string, MigrationResult>;
  total_pages_created: number;
  notion_databases_populated: number;
}

// Hardcoded data arrays
const services = [
  { name: "Roof Restoration", category: "Restoration", description: "Complete roof restoration including cleaning, repairs, rebedding, repointing and premium coating systems", active: true, warranty: "15-Year Standard", duration: "2-3 Days", costRange: "$8,000-$15,000" },
  { name: "Roof Painting", category: "Painting", description: "Professional roof painting and coating services with premium Premcoat systems", active: true, warranty: "15-Year Standard", duration: "2-3 Days", costRange: "$6,000-$12,000" },
  { name: "Roof Repairs", category: "Repairs", description: "Emergency and scheduled roof repair services including tile replacement and leak repairs", active: true, warranty: "Workmanship Only", duration: "Same Day", costRange: "$200-$2,000" },
  { name: "Gutter Cleaning", category: "Maintenance", description: "Professional gutter cleaning and maintenance with downpipe flushing", active: true, warranty: "Workmanship Only", duration: "2-4 Hours", costRange: "$200-$400" },
  { name: "Leak Detection", category: "Repairs", description: "Expert leak detection and repair services with thermal imaging", active: true, warranty: "Workmanship Only", duration: "Half Day", costRange: "$300-$800" },
  { name: "Valley Iron Replacement", category: "Repairs", description: "Complete valley iron replacement with galvanized steel installation", active: true, warranty: "15-Year Standard", duration: "1 Day", costRange: "$1,500-$4,000" },
  { name: "Tile Replacement", category: "Repairs", description: "Broken and damaged tile replacement with matching materials", active: true, warranty: "Workmanship Only", duration: "2-4 Hours", costRange: "$50-$150 per tile" },
  { name: "Ridge Capping Repair", category: "Maintenance", description: "Ridge cap rebedding and repointing with flexible pointing systems", active: true, warranty: "15-Year Standard", duration: "1-2 Days", costRange: "$15-$25 per LM" },
  { name: "Roof Repointing", category: "Maintenance", description: "Complete roof repointing with premium flexible mortar systems", active: true, warranty: "15-Year Standard", duration: "1-2 Days", costRange: "$3,000-$6,000" },
  { name: "Emergency Roof Repairs", category: "Repairs", description: "24/7 emergency roof repair service for storm damage and urgent leaks", active: true, warranty: "Workmanship Only", duration: "Same Day", costRange: "$500-$2,000" },
  { name: "Gutter Replacement", category: "Installation", description: "Complete gutter replacement with Colorbond steel systems", active: true, warranty: "15-Year Standard", duration: "1-2 Days", costRange: "$2,000-$5,000" },
  { name: "Roof Inspection", category: "Assessment", description: "Comprehensive 25-point roof health assessment with photo documentation", active: true, warranty: "N/A", duration: "1-2 Hours", costRange: "Free" }
];

const suburbs = [
  { name: "Clyde North", postcode: 3978, state: "VIC", region: "SE Melbourne", demand: "Primary - High Volume", avgJobValue: 12000 },
  { name: "Berwick", postcode: 3806, state: "VIC", region: "SE Melbourne", demand: "Primary - High Volume", avgJobValue: 14000 },
  { name: "Cranbourne", postcode: 3977, state: "VIC", region: "SE Melbourne", demand: "Primary - High Volume", avgJobValue: 11000 },
  { name: "Cranbourne North", postcode: 3977, state: "VIC", region: "SE Melbourne", demand: "Primary - High Volume", avgJobValue: 11500 },
  { name: "Cranbourne South", postcode: 3977, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 10500 },
  { name: "Cranbourne East", postcode: 3977, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 11000 },
  { name: "Pakenham", postcode: 3810, state: "VIC", region: "SE Melbourne", demand: "Primary - High Volume", avgJobValue: 10500 },
  { name: "Officer", postcode: 3809, state: "VIC", region: "SE Melbourne", demand: "Primary - High Volume", avgJobValue: 11500 },
  { name: "Narre Warren", postcode: 3805, state: "VIC", region: "SE Melbourne", demand: "Primary - High Volume", avgJobValue: 13000 },
  { name: "Narre Warren South", postcode: 3805, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 12500 },
  { name: "Rowville", postcode: 3178, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 15000 },
  { name: "Dandenong", postcode: 3175, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 9500 },
  { name: "Mount Eliza", postcode: 3930, state: "VIC", region: "Mornington Peninsula", demand: "Secondary", avgJobValue: 16000 },
  { name: "Lyndhurst", postcode: 3975, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 10000 },
  { name: "Noble Park", postcode: 3174, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 9000 },
  { name: "Hampton Park", postcode: 3976, state: "VIC", region: "SE Melbourne", demand: "Primary - High Volume", avgJobValue: 10500 },
  { name: "Hallam", postcode: 3803, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 11000 },
  { name: "Keysborough", postcode: 3173, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 12000 },
  { name: "Beaconsfield", postcode: 3807, state: "VIC", region: "SE Melbourne", demand: "Secondary", avgJobValue: 14000 }
];

const blogPosts = [
  {
    id: "1",
    title: "Complete Guide to Roof Restoration in Melbourne's Climate",
    content: `Melbourne's unpredictable weather creates unique challenges for homeowners. Your roof faces everything from scorching summer heat to winter storms - often in the same day.

## Why Melbourne Roofs Need Special Attention

Melbourne's "four seasons in one day" climate causes constant expansion and contraction of roofing materials, leading to tile movement, ridge cap displacement, mortar deterioration, and gutter system stress.

## Our Professional Restoration Process

### Step 1: 25-Point Health Assessment
We inspect ridge capping condition, tile integrity, valley iron assessment, and gutter evaluation.

### Step 2: Professional Cleaning
Using specialized equipment to remove moss, lichen, dirt, and debris accumulation.

### Step 3: Targeted Repairs
Common Melbourne issues we fix: broken tiles, ridge cap rebedding, valley iron replacement, and leak sealing.

### Step 4: Premium Coating
Premcoat systems designed for Australian conditions with UV-resistant formulation, thermal reflection properties, and 10-year warranty coverage.

## Smart Investment Choice
Restoration vs replacement costs: Restoration $8,000-$15,000 vs Full replacement $20,000-$40,000+

Ready to protect your investment? Book your free assessment today.`,
    category: "Roof Maintenance",
    tags: ["Melbourne", "restoration", "climate", "maintenance"],
    author: "Kaidyn Brownlie",
    featured: true
  },
  {
    id: "2",
    title: "5 Warning Signs Your Melbourne Roof Needs Immediate Attention",
    content: `Don't wait for a leak! Learn to identify the early warning signs that indicate your Melbourne roof requires professional assessment.

## 1. Interior Water Stains
Look for brown or yellow ceiling patches, wall water marks, peeling paint from moisture, and musty odors. Melbourne's frequent rain and temperature swings create perfect conditions for water penetration.

## 2. Ridge Cap Problems  
Visual indicators: gaps between caps and tiles, cracked pointing along ridges, displaced caps after storms, exposed fixing screws. Melbourne's strong winds cause significant ridge cap movement.

## 3. Damaged Tiles
Common problems: hair-line thermal cracks, broken tiles from hail, sliding tiles from failed fixings, lifted tiles exposing underlay.

## 4. Gutter Issues
Warning signs: overflow during rain, sagging from roofline, rust stains on walls, standing water, plant growth.

## 5. Valley Iron & Flashing Failure
Monitor valley intersections, chimney surrounds, skylight seals, and vent penetrations for rust, lifted edges, or cracked sealants.

Don't let small problems become major expenses. Contact: 0435 900 709`,
    category: "Roof Maintenance",
    tags: ["warning signs", "maintenance", "Melbourne", "prevention"],
    author: "Kaidyn Brownlie",
    featured: true
  }
];

const caseStudies = [
  {
    id: "CS-2025-09-15-BER-01",
    jobType: "Full Tile Roof Restoration",
    suburb: "Berwick",
    clientProblem: "20-year-old roof looked 'tired and faded' with extensive moss growth and visible cracking in the ridge capping mortar, creating a risk of leaks.",
    solutionProvided: "Full restoration including high-pressure clean (SOP-T1), replacement of 18 cracked tiles (SOP-T2), full re-bed and re-point of all ridge capping (SOP-T3), and application of a 3-coat Premcoat membrane in 'Monument' (SOP-T4).",
    keyOutcome: "Complete aesthetic transformation, restored structural integrity, and long-term protection backed by a 15-year warranty.",
    testimonial: "Could not be happier with the result. The team was professional from start to finish. Our roof looks brand new and the whole house looks better for it. The photo updates they sent were fantastic. Highly recommend.",
    projectValue: 14500
  },
  {
    id: "CS-2025-08-22-CRN-01",
    jobType: "Metal Roof Painting",
    suburb: "Cranbourne North",
    clientProblem: "Colorbond roof severely faded (chalking) with surface rust, particularly around fasteners.",
    solutionProvided: "Pressure cleaned (SOP-M1), all rust spots mechanically ground back to bare metal and treated (SOP-M2). All 450+ fasteners systematically replaced with new Class 4 screws (SOP-M4). Full 3-coat system applied in 'Woodland Grey'.",
    keyOutcome: "Full restoration of original roof color and sheen. All rust eliminated, extending the roof life for a fraction of the cost of replacement.",
    testimonial: "Professional service from start to finish. The roof looks brand new and has completely transformed the appearance of our home!",
    projectValue: 9800
  },
  {
    id: "CS-2025-07-30-PAK-01",
    jobType: "Ridge Capping Repair (Structural)",
    suburb: "Pakenham",
    clientProblem: "Client noticed pieces of brittle mortar falling onto their driveway, leading to concerns about ridge capping security during high winds.",
    solutionProvided: "A full re-bed and re-point of the main ridge and two hips as per the Master Craftsmanship SOP-T3. All old mortar chipped away and new flexible pointing applied and tooled to a professional finish.",
    keyOutcome: "Ridge capping is now structurally sound and the primary leak point on the roof has been eliminated. Guaranteed long-term security.",
    testimonial: "Very happy with the work. They showed me photos of the problem so I could understand what was needed. The finished job looks great and I feel much safer now.",
    projectValue: 3200
  },
  {
    id: "CS-2025-06-18-NAR-01",
    jobType: "Valley Iron Replacement & Leak Repair",
    suburb: "Narre Warren South",
    clientProblem: "Persistent leak causing ceiling stain. Source traced to the main valley iron which had rusted through in several places.",
    solutionProvided: "Root cause eliminated. Old, rusted valley iron cut out and replaced with new, galvanized valley iron with correct overlaps. Tiles re-cut and re-laid.",
    keyOutcome: "Permanent resolution to the persistent leak, preventing major internal water damage. Guaranteed structural integrity.",
    testimonial: "Finally, someone who could actually find and repair the leak! Professional, explained everything clearly. Worth every cent.",
    projectValue: 2800
  },
  {
    id: "CS-2025-05-20-CLY-01",
    jobType: "Gutter Cleaning & Drainage Restoration",
    suburb: "Clyde North",
    clientProblem: "Water overflowing from gutters at the front of a two-storey home during heavy rain due to blockages.",
    solutionProvided: "Full gutter and downpipe clean performed as per SOP-GR5. All solid debris manually removed, followed by a high-volume flush to restore full drainage capacity.",
    keyOutcome: "Roof drainage system restored to full capacity. Prevented potential water damage to fascia and foundation. Confirmed downpipes were flowing freely.",
    testimonial: "Efficient service, did a great job. Much safer than me trying to get up on a ladder myself.",
    projectValue: 350
  },
  {
    id: "CS-2025-03-05-ROW-02",
    jobType: "Systematic Fastener Replacement",
    suburb: "Rowville",
    clientProblem: "Widespread failure of EPDM washers on fasteners of a 10-year-old metal roof, leading to multiple micro-leaks and rust staining.",
    solutionProvided: "Systematic replacement of all 650+ exposed roof fasteners using new Buildex Class 4 screws with compliant EPDM washers (SOP-GR1). Each hole mechanically cleaned prior to installation.",
    keyOutcome: "Restored waterproofing integrity. Eliminated future risk of thermal fatigue leaks. Proof of meticulous preparation (During Photo Protocol U-3R).",
    testimonial: "The technician explained the difference between a low-cost screw and a proper one. The attention to detail was exceptional, I can feel confident in the repair.",
    projectValue: 2400
  },
  {
    id: "CS-2025-02-14-OFCR-03",
    jobType: "Dektite Replacement & Sealing",
    suburb: "Officer",
    clientProblem: "Major leak around the plumbing vent pipe. Inspection revealed the rubber boot of the Dektite was severely perished and cracked from UV exposure.",
    solutionProvided: "Full Dektite replacement (SOP-GR4). Surface prepared by removing all old silicone, then a new Dektite was installed using the 20% Rule (to ensure compression seal) and secured with a secondary silicone seal at the base.",
    keyOutcome: "Permanent resolution to a high-risk leak point. Use of Neutral Cure Silicone eliminated galvanic corrosion risk.",
    testimonial: "The team responded quickly and repaired what three other roofers couldn't seem to find. The new flashing looks very neat and tidy.",
    projectValue: 450
  },
  {
    id: "CS-2024-11-01-LYND-04",
    jobType: "Tile Roof Porosity & Coating Failure",
    suburb: "Lyndhurst",
    clientProblem: "Client reported a generalized dampness in the roof cavity during heavy rain, diagnosed as system-wide tile porosity due to failed 15-year-old surface coating.",
    solutionProvided: "Full restoration required. Tiles pressure cleaned (SOP-T1), then one coat of COAT_PRIMER_RAWTILE_20L applied to seal the porous substrate, followed by two coats of the Premcoat Plus (20-Year) top coat.",
    keyOutcome: "Transformed the roof from an absorbent sponge back into a waterproof surface. Client opted for the premium package, securing the 20-year workmanship warranty for maximum peace of mind.",
    testimonial: "We chose the top-tier warranty because we plan to stay here for a long time. The quality difference in the coating is amazing. It looks fantastic.",
    projectValue: 13800
  },
  {
    id: "CS-2024-10-15-NPK-05",
    jobType: "Apron Flashing Resealing",
    suburb: "Noble Park",
    clientProblem: "Leak where the back of an extension meets the main house roof. Failed sealant along the apron flashing seam.",
    solutionProvided: "Flashing resealing (SOP-GR3). The old sealant was 100% removed and the surface chemically cleaned with methylated spirits (SOP-GR2). A new bead of Neutral Cure Silicone was applied and professionally tooled to ensure a flexible, durable seal that accommodates thermal expansion.",
    keyOutcome: "Eliminated the high-risk leak point. The During Photo provided clear evidence that the surface preparation (Step 2 of SOP-GR2) was meticulous.",
    testimonial: "They showed me a photo of the bare metal after they cleaned off the old material. That level of transparency instantly earned my trust.",
    projectValue: 680
  }
];

// Delay helper to avoid rate limits
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function createNotionPage(databaseId: string, properties: any, dryRun: boolean): Promise<any> {
  if (dryRun) {
    console.log(`[DRY RUN] Would create page in database ${databaseId} with properties:`, JSON.stringify(properties).substring(0, 100));
    return { success: true, dry_run: true };
  }

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Notion API error: ${response.status} - ${error}`);
    }

    // Rate limiting: 3 requests per second = ~350ms between requests
    await delay(350);

    return await response.json();
  } catch (error) {
    console.error('Failed to create Notion page:', error);
    throw error;
  }
}

async function pushServices(databaseId: string, dryRun: boolean): Promise<MigrationResult> {
  const result: MigrationResult = {
    data_source: 'services',
    attempted: 0,
    created: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  console.log(`🛎️ Pushing ${services.length} services to Notion...`);

  for (const service of services) {
    result.attempted++;
    
    try {
      const properties = {
        'Service Name': {
          title: [{ text: { content: service.name } }]
        },
        'Description': {
          rich_text: [{ text: { content: service.description } }]
        },
        'Category': {
          select: { name: service.category }
        },
        'Typical Cost Range': {
          rich_text: [{ text: { content: service.costRange || '' } }]
        },
        'Typical Duration': {
          select: { name: service.duration || '1-2 Days' }
        },
        'Warranty Offered': {
          select: { name: service.warranty || 'Workmanship Only' }
        },
        'Active': {
          checkbox: service.active
        },
        'Notion Sync ID': {
          rich_text: [{ text: { content: `service-${service.name.toLowerCase().replace(/\s+/g, '-')}` } }]
        }
      };

      await createNotionPage(databaseId, properties, dryRun);
      result.created++;
      console.log(`  ✅ Created: ${service.name}`);
      
    } catch (error) {
      result.failed++;
      result.errors.push(`${service.name}: ${error.message}`);
      console.error(`  ❌ Failed: ${service.name}`, error.message);
    }
  }

  return result;
}

async function pushSuburbs(databaseId: string, dryRun: boolean): Promise<MigrationResult> {
  const result: MigrationResult = {
    data_source: 'suburbs',
    attempted: 0,
    created: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  console.log(`📍 Pushing ${suburbs.length} suburbs to Notion...`);

  for (const suburb of suburbs) {
    result.attempted++;
    
    try {
      const properties = {
        'Suburb Name': {
          title: [{ text: { content: suburb.name } }]
        },
        'Postcode': {
          number: suburb.postcode
        },
        'State': {
          select: { name: suburb.state }
        },
        'Service Demand Level': {
          select: { name: suburb.demand || 'Secondary' }
        },
        'Average Job Value': {
          number: suburb.avgJobValue || 0
        },
        'Notion Sync ID': {
          rich_text: [{ text: { content: `suburb-${suburb.name.toLowerCase().replace(/\s+/g, '-')}` } }]
        }
      };

      await createNotionPage(databaseId, properties, dryRun);
      result.created++;
      console.log(`  ✅ Created: ${suburb.name}`);
      
    } catch (error) {
      result.failed++;
      result.errors.push(`${suburb.name}: ${error.message}`);
      console.error(`  ❌ Failed: ${suburb.name}`, error.message);
    }
  }

  return result;
}

async function pushBlogPosts(databaseId: string, dryRun: boolean): Promise<MigrationResult> {
  const result: MigrationResult = {
    data_source: 'blog_posts',
    attempted: 0,
    created: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  console.log(`📖 Pushing ${blogPosts.length} blog posts to Notion...`);

  for (const post of blogPosts) {
    result.attempted++;
    
    try {
      // Notion rich_text has 2000 char limit, truncate if needed
      const contentPreview = post.content.substring(0, 1900);
      const contentNote = post.content.length > 1900 
        ? '\n\n[Content truncated - edit full version in Notion]' 
        : '';

      const properties = {
        'Article Title': {
          title: [{ text: { content: post.title } }]
        },
        'Content': {
          rich_text: [{ text: { content: contentPreview + contentNote } }]
        },
        'Summary': {
          rich_text: [{ text: { content: post.content.substring(0, 300) + '...' } }]
        },
        'Category': {
          select: { name: post.category }
        },
        'Tags': {
          multi_select: post.tags.map(tag => ({ name: tag }))
        },
        // Author is people type in Notion, skip it for now
        'Published': {
          checkbox: post.featured
        },
        'Notion Sync ID': {
          rich_text: [{ text: { content: post.id } }]
        }
      };

      await createNotionPage(databaseId, properties, dryRun);
      result.created++;
      console.log(`  ✅ Created: ${post.title.substring(0, 50)}...`);
      
    } catch (error) {
      result.failed++;
      result.errors.push(`${post.title}: ${error.message}`);
      console.error(`  ❌ Failed: ${post.title}`, error.message);
    }
  }

  return result;
}

async function pushCaseStudies(databaseId: string, dryRun: boolean): Promise<MigrationResult> {
  const result: MigrationResult = {
    data_source: 'case_studies',
    attempted: 0,
    created: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  console.log(`📚 Pushing ${caseStudies.length} case studies to Notion...`);

  for (const caseStudy of caseStudies) {
    result.attempted++;
    
    try {
      const properties = {
        'Case ID': {
          title: [{ text: { content: caseStudy.id } }]
        },
        'Service': {
          rich_text: [{ text: { content: caseStudy.jobType } }]
        },
        'Suburb': {
          rich_text: [{ text: { content: caseStudy.suburb } }]
        },
        'Challenges': {
          rich_text: [{ text: { content: caseStudy.clientProblem.substring(0, 2000) } }]
        },
        'Solutions': {
          rich_text: [{ text: { content: caseStudy.solutionProvided.substring(0, 2000) } }]
        },
        'Results': {
          rich_text: [{ text: { content: caseStudy.keyOutcome.substring(0, 2000) } }]
        },
        'Client Name': {
          rich_text: [{ text: { content: caseStudy.suburb + ' Homeowner' } }]
        },
        'Project Value': {
          number: caseStudy.projectValue || 0
        },
        'Published': {
          checkbox: true
        },
        'Notion Sync ID': {
          rich_text: [{ text: { content: caseStudy.id } }]
        }
      };

      await createNotionPage(databaseId, properties, dryRun);
      result.created++;
      console.log(`  ✅ Created: ${caseStudy.id}`);
      
    } catch (error) {
      result.failed++;
      result.errors.push(`${caseStudy.id}: ${error.message}`);
      console.error(`  ❌ Failed: ${caseStudy.id}`, error.message);
    }
  }

  return result;
}

async function pushTestimonials(databaseId: string, dryRun: boolean): Promise<MigrationResult> {
  const result: MigrationResult = {
    data_source: 'testimonials',
    attempted: 0,
    created: 0,
    skipped: 0,
    failed: 0,
    errors: []
  };

  console.log(`⭐ Pushing testimonials from case studies to Notion...`);

  for (const caseStudy of caseStudies) {
    if (!caseStudy.testimonial || caseStudy.testimonial.includes('No testimonial')) {
      continue;
    }

    result.attempted++;
    
    try {
      const properties = {
        'Review ID': {
          title: [{ text: { content: `${caseStudy.id}-REVIEW` } }]
        },
        'Client Name': {
          rich_text: [{ text: { content: caseStudy.suburb + ' Homeowner' } }]
        },
        'Review Text': {
          rich_text: [{ text: { content: caseStudy.testimonial } }]
        },
        'Suburb': {
          rich_text: [{ text: { content: caseStudy.suburb } }]
        },
        'Service Reviewed': {
          rich_text: [{ text: { content: caseStudy.jobType } }]
        },
        'Star Rating': {
          select: { name: '5 Stars' }
        },
        'Permission Granted': {
          checkbox: true
        },
        'Published on Website': {
          checkbox: true
        },
        'Notion Sync ID': {
          rich_text: [{ text: { content: `${caseStudy.id}-testimonial` } }]
        }
      };

      await createNotionPage(databaseId, properties, dryRun);
      result.created++;
      console.log(`  ✅ Created testimonial from: ${caseStudy.suburb}`);
      
    } catch (error) {
      result.failed++;
      result.errors.push(`${caseStudy.id}: ${error.message}`);
      console.error(`  ❌ Failed testimonial: ${caseStudy.id}`, error.message);
    }
  }

  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured');
    }

    const { dry_run = false, data_sources = [] } = await req.json().catch(() => ({}));

    const dbConfig = {
      services: Deno.env.get('NOTION_SERVICES_DB_ID'),
      suburbs: Deno.env.get('NOTION_SUBURBS_DB_ID'),
      knowledge_base: Deno.env.get('NOTION_KNOWLEDGE_BASE_DB_ID'),
      case_studies: Deno.env.get('NOTION_CASE_STUDIES_DB_ID'),
      testimonials: Deno.env.get('NOTION_TESTIMONIALS_DB_ID'),
    };

    console.log(`🚀 Starting Notion data migration${dry_run ? ' (DRY RUN)' : ''}...`);
    const startTime = new Date();

    const report: MigrationReport = {
      migration_started_at: startTime.toISOString(),
      dry_run,
      results: {},
      total_pages_created: 0,
      notion_databases_populated: 0
    };

    // Determine which data sources to push
    const shouldPush = (source: string) => 
      data_sources.length === 0 || data_sources.includes(source);

    // Push Services
    if (shouldPush('services') && dbConfig.services) {
      report.results.services = await pushServices(dbConfig.services, dry_run);
      report.total_pages_created += report.results.services.created;
      if (report.results.services.created > 0) report.notion_databases_populated++;
    }

    // Push Suburbs
    if (shouldPush('suburbs') && dbConfig.suburbs) {
      report.results.suburbs = await pushSuburbs(dbConfig.suburbs, dry_run);
      report.total_pages_created += report.results.suburbs.created;
      if (report.results.suburbs.created > 0) report.notion_databases_populated++;
    }

    // Push Blog Posts
    if (shouldPush('blog_posts') && dbConfig.knowledge_base) {
      report.results.blog_posts = await pushBlogPosts(dbConfig.knowledge_base, dry_run);
      report.total_pages_created += report.results.blog_posts.created;
      if (report.results.blog_posts.created > 0) report.notion_databases_populated++;
    }

    // Push Case Studies
    if (shouldPush('case_studies') && dbConfig.case_studies) {
      report.results.case_studies = await pushCaseStudies(dbConfig.case_studies, dry_run);
      report.total_pages_created += report.results.case_studies.created;
      if (report.results.case_studies.created > 0) report.notion_databases_populated++;
    }

    // Push Testimonials
    if (shouldPush('testimonials') && dbConfig.testimonials) {
      report.results.testimonials = await pushTestimonials(dbConfig.testimonials, dry_run);
      report.total_pages_created += report.results.testimonials.created;
      if (report.results.testimonials.created > 0) report.notion_databases_populated++;
    }

    const endTime = new Date();
    report.migration_completed_at = endTime.toISOString();
    report.total_duration_seconds = Math.round((endTime.getTime() - startTime.getTime()) / 1000);

    console.log(`✅ Migration complete: ${report.total_pages_created} pages created across ${report.notion_databases_populated} databases`);

    return new Response(JSON.stringify(report, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Migration error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }, null, 2), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
