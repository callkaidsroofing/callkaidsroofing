import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY');
const NOTION_VERSION = '2022-06-28';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SyncResult {
  table_name: string;
  sync_status: 'success' | 'error' | 'skipped';
  records_synced: number;
  records_created: number;
  records_updated: number;
  errors?: string[];
  duration_seconds?: number;
}

interface NotionPage {
  id: string;
  properties: Record<string, any>;
  created_time?: string;
  last_edited_time?: string;
}

async function queryNotionDatabase(databaseId: string): Promise<NotionPage[]> {
  const pages: NotionPage[] = [];
  let hasMore = true;
  let cursor: string | undefined;

  while (hasMore) {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_API_KEY}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_cursor: cursor,
        page_size: 100,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Notion API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    pages.push(...data.results);
    hasMore = data.has_more;
    cursor = data.next_cursor;
  }

  return pages;
}

function getPropertyValue(property: any): any {
  if (!property) return null;

  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || '';
    case 'rich_text':
      return property.rich_text?.map((t: any) => t.plain_text).join('') || '';
    case 'number':
      return property.number;
    case 'select':
      return property.select?.name || null;
    case 'multi_select':
      return property.multi_select?.map((s: any) => s.name) || [];
    case 'date':
      return property.date?.start || null;
    case 'checkbox':
      return property.checkbox || false;
    case 'url':
      return property.url || null;
    case 'email':
      return property.email || null;
    case 'phone_number':
      return property.phone_number || null;
    case 'files':
      return property.files?.map((f: any) => f.url || f.file?.url) || [];
    default:
      return null;
  }
}

async function syncBlogPosts(databaseId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    table_name: 'content_blog_posts',
    sync_status: 'success',
    records_synced: 0,
    records_created: 0,
    records_updated: 0,
    errors: [],
  };

  try {
    const pages = await queryNotionDatabase(databaseId);
    console.log(`📝 Syncing ${pages.length} blog posts...`);

    for (const page of pages) {
      try {
        const props = page.properties;
        const notionId = page.id.replace(/-/g, '');

        const blogPost = {
          notion_id: notionId,
          title: getPropertyValue(props.Title || props.Name),
          slug: getPropertyValue(props.Slug),
          content: getPropertyValue(props.Content),
          excerpt: getPropertyValue(props.Excerpt),
          category: getPropertyValue(props.Category),
          tags: getPropertyValue(props.Tags) || [],
          author: getPropertyValue(props.Author) || 'Kaidyn Brownlie',
          publish_date: getPropertyValue(props['Publish Date']) || page.created_time,
          featured: getPropertyValue(props.Featured) || false,
          image_url: getPropertyValue(props['Image URL'] || props.Image)?.[0] || null,
          read_time: getPropertyValue(props['Read Time']),
          meta_description: getPropertyValue(props['Meta Description']),
          related_posts: getPropertyValue(props['Related Posts']) || [],
          last_synced_at: new Date().toISOString(),
          updated_at: page.last_edited_time || new Date().toISOString(),
        };

        const { error } = await supabase
          .from('content_blog_posts')
          .upsert(blogPost, { onConflict: 'notion_id' });

        if (error) {
          result.errors?.push(`Blog ${notionId}: ${error.message}`);
        } else {
          result.records_synced++;
        }
      } catch (err) {
        result.errors?.push(`Blog ${page.id}: ${err.message}`);
      }
    }

    result.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Blog sync complete: ${result.records_synced}/${pages.length}`);

  } catch (error) {
    result.sync_status = 'error';
    result.errors?.push(error.message);
    console.error('❌ Blog sync failed:', error);
  }

  return result;
}

async function syncServices(databaseId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    table_name: 'content_services',
    sync_status: 'success',
    records_synced: 0,
    records_created: 0,
    records_updated: 0,
    errors: [],
  };

  try {
    const pages = await queryNotionDatabase(databaseId);
    console.log(`🔧 Syncing ${pages.length} services...`);

    for (const page of pages) {
      try {
        const props = page.properties;
        const notionId = page.id.replace(/-/g, '');

        const service = {
          notion_id: notionId,
          name: getPropertyValue(props.Name || props.Title),
          slug: getPropertyValue(props.Slug),
          short_description: getPropertyValue(props['Short Description']),
          full_description: getPropertyValue(props['Full Description'] || props.Description),
          icon: getPropertyValue(props.Icon),
          image_url: getPropertyValue(props['Image URL'] || props.Image)?.[0] || null,
          service_category: getPropertyValue(props.Category),
          service_tags: getPropertyValue(props.Tags) || [],
          features: getPropertyValue(props.Features) || [],
          pricing_info: props['Pricing Info'] ? { raw: getPropertyValue(props['Pricing Info']) } : null,
          process_steps: props['Process Steps'] ? { raw: getPropertyValue(props['Process Steps']) } : [],
          featured: getPropertyValue(props.Featured) || false,
          display_order: getPropertyValue(props['Display Order']) || 0,
          meta_title: getPropertyValue(props['Meta Title']),
          meta_description: getPropertyValue(props['Meta Description']),
          last_synced_at: new Date().toISOString(),
          updated_at: page.last_edited_time || new Date().toISOString(),
        };

        const { error } = await supabase
          .from('content_services')
          .upsert(service, { onConflict: 'notion_id' });

        if (error) {
          result.errors?.push(`Service ${notionId}: ${error.message}`);
        } else {
          result.records_synced++;
        }
      } catch (err) {
        result.errors?.push(`Service ${page.id}: ${err.message}`);
      }
    }

    result.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Services sync complete: ${result.records_synced}/${pages.length}`);

  } catch (error) {
    result.sync_status = 'error';
    result.errors?.push(error.message);
    console.error('❌ Services sync failed:', error);
  }

  return result;
}

async function syncSuburbs(databaseId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    table_name: 'content_suburbs',
    sync_status: 'success',
    records_synced: 0,
    records_created: 0,
    records_updated: 0,
    errors: [],
  };

  try {
    const pages = await queryNotionDatabase(databaseId);
    console.log(`📍 Syncing ${pages.length} suburbs...`);

    for (const page of pages) {
      try {
        const props = page.properties;
        const notionId = page.id.replace(/-/g, '');

        const suburb = {
          notion_id: notionId,
          name: getPropertyValue(props.Name || props.Title),
          slug: getPropertyValue(props.Slug),
          postcode: getPropertyValue(props.Postcode),
          region: getPropertyValue(props.Region),
          description: getPropertyValue(props.Description),
          local_seo_content: getPropertyValue(props['Local SEO Content']),
          services_available: getPropertyValue(props['Services Available']) || [],
          featured_projects: getPropertyValue(props['Featured Projects']) || [],
          projects_completed: getPropertyValue(props['Projects Completed']) || 0,
          distance_from_base: getPropertyValue(props['Distance From Base']),
          meta_title: getPropertyValue(props['Meta Title']),
          meta_description: getPropertyValue(props['Meta Description']),
          last_synced_at: new Date().toISOString(),
          updated_at: page.last_edited_time || new Date().toISOString(),
        };

        const { error } = await supabase
          .from('content_suburbs')
          .upsert(suburb, { onConflict: 'notion_id' });

        if (error) {
          result.errors?.push(`Suburb ${notionId}: ${error.message}`);
        } else {
          result.records_synced++;
        }
      } catch (err) {
        result.errors?.push(`Suburb ${page.id}: ${err.message}`);
      }
    }

    result.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Suburbs sync complete: ${result.records_synced}/${pages.length}`);

  } catch (error) {
    result.sync_status = 'error';
    result.errors?.push(error.message);
    console.error('❌ Suburbs sync failed:', error);
  }

  return result;
}

async function syncTestimonials(databaseId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    table_name: 'content_testimonials',
    sync_status: 'success',
    records_synced: 0,
    records_created: 0,
    records_updated: 0,
    errors: [],
  };

  try {
    const pages = await queryNotionDatabase(databaseId);
    console.log(`⭐ Syncing ${pages.length} testimonials...`);

    for (const page of pages) {
      try {
        const props = page.properties;
        const notionId = page.id.replace(/-/g, '');

        const testimonial = {
          notion_id: notionId,
          client_name: getPropertyValue(props['Client Name'] || props.Name),
          testimonial_text: getPropertyValue(props.Testimonial || props.Text),
          suburb: getPropertyValue(props.Suburb),
          service_type: getPropertyValue(props['Service Type'] || props.Service),
          rating: getPropertyValue(props.Rating),
          job_date: getPropertyValue(props['Job Date']),
          featured: getPropertyValue(props.Featured) || false,
          verified: getPropertyValue(props.Verified) || false,
          case_study_id: null,
          last_synced_at: new Date().toISOString(),
          updated_at: page.last_edited_time || new Date().toISOString(),
        };

        const { error } = await supabase
          .from('content_testimonials')
          .upsert(testimonial, { onConflict: 'notion_id' });

        if (error) {
          result.errors?.push(`Testimonial ${notionId}: ${error.message}`);
        } else {
          result.records_synced++;
        }
      } catch (err) {
        result.errors?.push(`Testimonial ${page.id}: ${err.message}`);
      }
    }

    result.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Testimonials sync complete: ${result.records_synced}/${pages.length}`);

  } catch (error) {
    result.sync_status = 'error';
    result.errors?.push(error.message);
    console.error('❌ Testimonials sync failed:', error);
  }

  return result;
}

async function logSyncResult(result: SyncResult) {
  await supabase.from('content_sync_log').insert({
    sync_type: 'notion_api',
    table_name: result.table_name,
    sync_status: result.sync_status,
    records_synced: result.records_synced,
    records_created: result.records_created,
    records_updated: result.records_updated,
    duration_seconds: result.duration_seconds,
    errors: result.errors && result.errors.length > 0 ? result.errors : null,
    completed_at: new Date().toISOString(),
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!NOTION_API_KEY) {
      throw new Error('NOTION_API_KEY not configured');
    }

    const { database_ids } = await req.json().catch(() => ({}));

    const dbConfig = {
      blog_posts: Deno.env.get('NOTION_BLOG_POSTS_DB_ID'),
      services: Deno.env.get('NOTION_SERVICES_DB_ID'),
      suburbs: Deno.env.get('NOTION_SUBURBS_DB_ID'),
      testimonials: Deno.env.get('NOTION_TESTIMONIALS_DB_ID'),
      ...database_ids,
    };

    console.log('🔄 Starting Notion sync...');
    const results: SyncResult[] = [];

    if (dbConfig.blog_posts) {
      const result = await syncBlogPosts(dbConfig.blog_posts);
      results.push(result);
      await logSyncResult(result);
    }

    if (dbConfig.services) {
      const result = await syncServices(dbConfig.services);
      results.push(result);
      await logSyncResult(result);
    }

    if (dbConfig.suburbs) {
      const result = await syncSuburbs(dbConfig.suburbs);
      results.push(result);
      await logSyncResult(result);
    }

    if (dbConfig.testimonials) {
      const result = await syncTestimonials(dbConfig.testimonials);
      results.push(result);
      await logSyncResult(result);
    }

    const totalSynced = results.reduce((sum, r) => sum + r.records_synced, 0);
    const totalErrors = results.reduce((sum, r) => sum + (r.errors?.length || 0), 0);

    console.log(`✅ Sync complete: ${totalSynced} records synced, ${totalErrors} errors`);

    return new Response(JSON.stringify({
      success: true,
      total_records_synced: totalSynced,
      total_errors: totalErrors,
      results,
    }, null, 2), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('❌ Sync error:', error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }, null, 2), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
