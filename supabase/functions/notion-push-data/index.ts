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
  { name: "Roof Restoration", category: "Restoration", description: "Complete roof restoration including cleaning, repairs, and coating", active: true },
  { name: "Roof Painting", category: "Painting", description: "Professional roof painting and coating services", active: true },
  { name: "Roof Repairs", category: "Repairs", description: "Emergency and scheduled roof repair services", active: true },
  { name: "Gutter Cleaning", category: "Maintenance", description: "Professional gutter cleaning and maintenance", active: true },
  { name: "Leak Detection", category: "Repairs", description: "Expert leak detection and repair services", active: true },
  { name: "Valley Iron Replacement", category: "Repairs", description: "Valley iron replacement and installation", active: true },
  { name: "Tile Replacement", category: "Repairs", description: "Broken and damaged tile replacement", active: true },
  { name: "Roof Repointing", category: "Maintenance", description: "Ridge cap rebedding and repointing services", active: true }
];

const suburbs = [
  { name: "Clyde North", postcode: 3978, state: "VIC" },
  { name: "Berwick", postcode: 3806, state: "VIC" },
  { name: "Cranbourne", postcode: 3977, state: "VIC" },
  { name: "Pakenham", postcode: 3810, state: "VIC" },
  { name: "Officer", postcode: 3809, state: "VIC" },
  { name: "Narre Warren South", postcode: 3805, state: "VIC" },
  { name: "Rowville", postcode: 3178, state: "VIC" },
  { name: "Dandenong", postcode: 3175, state: "VIC" },
  { name: "Mount Eliza", postcode: 3930, state: "VIC" },
  { name: "Lyndhurst", postcode: 3975, state: "VIC" },
  { name: "Noble Park", postcode: 3174, state: "VIC" }
];

const blogPosts = [
  {
    id: "1",
    title: "Complete Guide to Roof Restoration in Melbourne's Climate",
    content: "Melbourne's unpredictable weather creates unique challenges for homeowners. Your roof faces everything from scorching summer heat to winter storms - often in the same day.",
    category: "Roof Maintenance",
    tags: ["Melbourne", "restoration", "climate", "maintenance"],
    author: "Kaidyn Brownlie",
    featured: true
  },
  {
    id: "2",
    title: "5 Warning Signs Your Melbourne Roof Needs Immediate Attention",
    content: "Don't wait for a leak! Learn to identify the early warning signs that indicate your Melbourne roof requires professional assessment and potential repairs.",
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
    solutionProvided: "Full restoration including high-pressure clean, replacement of 18 cracked tiles, full re-bed and re-point of all ridge capping, and application of a 3-coat Premcoat membrane.",
    keyOutcome: "Complete aesthetic transformation, restored structural integrity, and long-term protection backed by a 15-year warranty.",
    testimonial: "Could not be happier with the result. The team was professional from start to finish. Our roof looks brand new and the whole house looks better for it."
  },
  {
    id: "CS-2025-08-22-CRN-01",
    jobType: "Metal Roof Painting",
    suburb: "Cranbourne North",
    clientProblem: "Colorbond roof severely faded (chalking) with surface rust, particularly around fasteners.",
    solutionProvided: "Pressure cleaned, all rust spots mechanically ground back to bare metal and treated. All 450+ fasteners systematically replaced with new Class 4 screws. Full 3-coat system applied.",
    keyOutcome: "Full restoration of original roof color and sheen. All rust eliminated, extending the roof life for a fraction of the cost of replacement.",
    testimonial: "Professional service from start to finish. The roof looks brand new!"
  },
  {
    id: "CS-2025-07-30-PAK-01",
    jobType: "Ridge Capping Repair",
    suburb: "Pakenham",
    clientProblem: "Client noticed pieces of brittle mortar falling onto their driveway, leading to concerns about ridge capping security during high winds.",
    solutionProvided: "A full re-bed and re-point of the main ridge and two hips. All old mortar chipped away and new flexible pointing applied and tooled to a professional finish.",
    keyOutcome: "Ridge capping is now structurally sound and the primary leak point on the roof has been eliminated. Guaranteed long-term security.",
    testimonial: "Very happy with the work. They showed me photos of the problem so I could understand what was needed. The finished job looks great and I feel much safer now."
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
        'Author': {
          rich_text: [{ text: { content: post.author } }]
        },
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
          select: { name: caseStudy.jobType }
        },
        'Suburb': {
          select: { name: caseStudy.suburb }
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
          select: { name: caseStudy.suburb }
        },
        'Service Reviewed': {
          select: { name: caseStudy.jobType }
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
