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

        const serviceName = getPropertyValue(props['Service Name']) || '';
        const slug = serviceName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const service = {
          notion_id: notionId,
          name: serviceName,
          slug: slug,
          short_description: getPropertyValue(props.Description) || null,
          full_description: getPropertyValue(props.Description) || null,
          icon: null,
          image_url: null,
          service_category: getPropertyValue(props.Category) || null,
          service_tags: [],
          features: getPropertyValue(props['Materials List'])?.split(',').map((f: string) => f.trim()) || [],
          pricing_info: props['Typical Cost Range'] ? { range: getPropertyValue(props['Typical Cost Range']) } : null,
          process_steps: props['SOP Reference'] ? { reference: getPropertyValue(props['SOP Reference']) } : [],
          featured: getPropertyValue(props.Active) || false,
          display_order: 0,
          meta_title: null,
          meta_description: getPropertyValue(props.Description)?.substring(0, 160) || null,
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

        const suburbName = getPropertyValue(props['Suburb Name']) || '';
        const slug = suburbName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const suburb = {
          notion_id: notionId,
          name: suburbName,
          slug: slug,
          postcode: getPropertyValue(props.Postcode)?.toString() || null,
          region: getPropertyValue(props.State) || 'VIC',
          description: getPropertyValue(props.Notes) || null,
          local_seo_content: null,
          services_available: getPropertyValue(props['Popular Services']) || [],
          featured_projects: [],
          projects_completed: 0,
          distance_from_base: null,
          meta_title: null,
          meta_description: null,
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

async function syncCaseStudies(databaseId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    table_name: 'content_case_studies',
    sync_status: 'success',
    records_synced: 0,
    records_created: 0,
    records_updated: 0,
    errors: [],
  };

  try {
    const pages = await queryNotionDatabase(databaseId);
    console.log(`📚 Syncing ${pages.length} case studies...`);

    for (const page of pages) {
      try {
        const props = page.properties;
        const notionId = page.id.replace(/-/g, '');

        const caseStudy = {
          notion_id: notionId,
          study_id: getPropertyValue(props['Case ID']) || notionId.substring(0, 8),
          job_type: getPropertyValue(props.Service) || 'General',
          suburb: getPropertyValue(props.Suburb) || '',
          client_problem: getPropertyValue(props.Challenges) || '',
          solution_provided: getPropertyValue(props.Solutions) || '',
          key_outcome: getPropertyValue(props.Results) || '',
          before_image: getPropertyValue(props['Before Photos'])?.[0] || null,
          after_image: getPropertyValue(props['After Photos'])?.[0] || null,
          testimonial: getPropertyValue(props['Client Name']) || null,
          project_date: getPropertyValue(props['Publish Date']) || page.created_time,
          featured: getPropertyValue(props.Published) || false,
          slug: getPropertyValue(props['Website URL']) || null,
          meta_description: getPropertyValue(props['Project Summary']),
          last_synced_at: new Date().toISOString(),
          updated_at: page.last_edited_time || new Date().toISOString(),
        };

        const { error } = await supabase
          .from('content_case_studies')
          .upsert(caseStudy, { onConflict: 'notion_id' });

        if (error) {
          result.errors?.push(`Case Study ${notionId}: ${error.message}`);
        } else {
          result.records_synced++;
        }
      } catch (err) {
        result.errors?.push(`Case Study ${page.id}: ${err.message}`);
      }
    }

    result.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Case studies sync complete: ${result.records_synced}/${pages.length}`);

  } catch (error) {
    result.sync_status = 'error';
    result.errors?.push(error.message);
    console.error('❌ Case studies sync failed:', error);
  }

  return result;
}

async function syncKnowledgeBase(databaseId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    table_name: 'content_knowledge_base',
    sync_status: 'success',
    records_synced: 0,
    records_created: 0,
    records_updated: 0,
    errors: [],
  };

  try {
    const pages = await queryNotionDatabase(databaseId);
    console.log(`📖 Syncing ${pages.length} knowledge base articles...`);

    for (const page of pages) {
      try {
        const props = page.properties;
        const notionId = page.id.replace(/-/g, '');

        const article = {
          notion_id: notionId,
          question: getPropertyValue(props['Article Title']) || getPropertyValue(props.Title) || '',
          answer: getPropertyValue(props.Content) || getPropertyValue(props.Summary) || '',
          category: getPropertyValue(props.Category) || null,
          related_services: getPropertyValue(props['Related SOP']) || [],
          featured: getPropertyValue(props.Published) || false,
          display_order: 0,
          last_synced_at: new Date().toISOString(),
          updated_at: page.last_edited_time || new Date().toISOString(),
        };

        const { error } = await supabase
          .from('content_knowledge_base')
          .upsert(article, { onConflict: 'notion_id' });

        if (error) {
          result.errors?.push(`Article ${notionId}: ${error.message}`);
        } else {
          result.records_synced++;
        }
      } catch (err) {
        result.errors?.push(`Article ${page.id}: ${err.message}`);
      }
    }

    result.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Knowledge base sync complete: ${result.records_synced}/${pages.length}`);

  } catch (error) {
    result.sync_status = 'error';
    result.errors?.push(error.message);
    console.error('❌ Knowledge base sync failed:', error);
  }

  return result;
}

async function syncLeads(databaseId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    table_name: 'leads',
    sync_status: 'success',
    records_synced: 0,
    records_created: 0,
    records_updated: 0,
    errors: [],
  };

  try {
    const pages = await queryNotionDatabase(databaseId);
    console.log(`💼 Syncing ${pages.length} leads...`);

    for (const page of pages) {
      try {
        const props = page.properties;
        const notionId = page.id.replace(/-/g, '');

        // Map Notion lead data to Supabase leads table
        const lead = {
          name: getPropertyValue(props['Client Name']) || 'Unknown',
          phone: getPropertyValue(props['Client Phone']) || '',
          email: getPropertyValue(props['Client Email']) || null,
          suburb: getPropertyValue(props.Suburb) || '',
          service: getPropertyValue(props['Service Requested']) || 'General Inquiry',
          message: getPropertyValue(props['Initial Message']) || getPropertyValue(props.Notes) || null,
          urgency: getPropertyValue(props['Conversion Probability']) || null,
          status: getPropertyValue(props['Lead Status'])?.toLowerCase() || 'new',
          source: getPropertyValue(props['Lead Source']) || 'notion',
          ai_score: getPropertyValue(props['Lead Quality']) ? parseInt(getPropertyValue(props['Lead Quality'])) : null,
          updated_at: page.last_edited_time || new Date().toISOString(),
        };

        // Only sync if we have minimum required fields
        if (lead.phone) {
          const { error } = await supabase
            .from('leads')
            .insert([lead]);

          if (error) {
            // If duplicate, try to update based on phone + name
            const { error: updateError } = await supabase
              .from('leads')
              .update(lead)
              .eq('phone', lead.phone)
              .eq('name', lead.name);

            if (updateError) {
              result.errors?.push(`Lead ${notionId}: ${updateError.message}`);
            } else {
              result.records_synced++;
            }
          } else {
            result.records_synced++;
          }
        } else {
          result.errors?.push(`Lead ${notionId}: Missing required phone number`);
        }
      } catch (err) {
        result.errors?.push(`Lead ${page.id}: ${err.message}`);
      }
    }

    result.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Leads sync complete: ${result.records_synced}/${pages.length}`);

  } catch (error) {
    result.sync_status = 'error';
    result.errors?.push(error.message);
    console.error('❌ Leads sync failed:', error);
  }

  return result;
}

async function syncQuotes(databaseId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    table_name: 'quotes',
    sync_status: 'success',
    records_synced: 0,
    records_created: 0,
    records_updated: 0,
    errors: [],
  };

  try {
    const pages = await queryNotionDatabase(databaseId);
    console.log(`💰 Syncing ${pages.length} quotes...`);

    for (const page of pages) {
      try {
        const props = page.properties;
        const notionId = page.id.replace(/-/g, '');

        const quoteValue = getPropertyValue(props['Quote Value']) || 0;

        const quote = {
          quote_number: getPropertyValue(props['Quote ID']) || `NOT-${notionId.substring(0, 6)}`,
          client_name: getPropertyValue(props['Client Name']) || 'Unknown',
          client_email: getPropertyValue(props['Client Email']) || null,
          client_phone: null,
          property_address: getPropertyValue(props['Property Address']) || '',
          suburb: getPropertyValue(props.Suburb) || '',
          service_type: getPropertyValue(props['Service Type']) || 'General Service',
          scope_details: getPropertyValue(props['Scope of Work']) || null,
          quote_date: getPropertyValue(props['Quote Date']) || page.created_time,
          valid_until: getPropertyValue(props['Valid Until']) || null,
          subtotal: quoteValue,
          gst: quoteValue * 0.1,
          total: quoteValue * 1.1,
          status: getPropertyValue(props['Quote Status'])?.toLowerCase() || 'draft',
          notes: getPropertyValue(props.Notes) || null,
          created_at: page.created_time,
          updated_at: page.last_edited_time || new Date().toISOString(),
        };

        const { error } = await supabase
          .from('quotes')
          .insert([quote]);

        if (error) {
          // Try to update if it exists
          const { error: updateError } = await supabase
            .from('quotes')
            .update(quote)
            .eq('quote_number', quote.quote_number);

          if (updateError) {
            result.errors?.push(`Quote ${notionId}: ${updateError.message}`);
          } else {
            result.records_synced++;
          }
        } else {
          result.records_synced++;
        }
      } catch (err) {
        result.errors?.push(`Quote ${page.id}: ${err.message}`);
      }
    }

    result.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    console.log(`✅ Quotes sync complete: ${result.records_synced}/${pages.length}`);

  } catch (error) {
    result.sync_status = 'error';
    result.errors?.push(error.message);
    console.error('❌ Quotes sync failed:', error);
  }

  return result;
}

async function syncTasks(databaseId: string): Promise<SyncResult> {
  const startTime = Date.now();
  const result: SyncResult = {
    table_name: 'lead_tasks',
    sync_status: 'success',
    records_synced: 0,
    records_created: 0,
    records_updated: 0,
    errors: [],
  };

  try {
    const pages = await queryNotionDatabase(databaseId);
    console.log(`✅ Syncing ${pages.length} tasks...`);

    for (const page of pages) {
      try {
        const props = page.properties;
        const notionId = page.id.replace(/-/g, '');

        // Note: We can't link to leads without matching, so tasks will be created standalone
        const task = {
          title: getPropertyValue(props['Task Title']) || 'Untitled Task',
          description: getPropertyValue(props.Notes) || null,
          task_type: getPropertyValue(props['Task Type']) || 'general',
          status: getPropertyValue(props.Status)?.toLowerCase() || 'pending',
          priority: getPropertyValue(props.Priority)?.toLowerCase() || 'normal',
          due_date: getPropertyValue(props['Due Date']) || new Date().toISOString().split('T')[0],
          completed_at: getPropertyValue(props['Completion Date']) || null,
          created_at: page.created_time,
          updated_at: page.last_edited_time || new Date().toISOString(),
        };

        // Tasks require a lead_id, so we'll skip syncing tasks for now
        // This would need a matching strategy to link Notion tasks to Supabase leads
        result.errors?.push(`Task ${notionId}: Skipped - requires lead_id mapping`);

      } catch (err) {
        result.errors?.push(`Task ${page.id}: ${err.message}`);
      }
    }

    result.duration_seconds = Math.round((Date.now() - startTime) / 1000);
    console.log(`⚠️ Tasks sync skipped: requires lead_id mapping`);

  } catch (error) {
    result.sync_status = 'error';
    result.errors?.push(error.message);
    console.error('❌ Tasks sync failed:', error);
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

    const { database_type } = await req.json().catch(() => ({}));

    // Load database IDs from environment
    const dbConfig = {
      services: Deno.env.get('NOTION_SERVICES_DB_ID'),
      knowledge_base: Deno.env.get('NOTION_KNOWLEDGE_BASE_DB_ID'),
      testimonials: Deno.env.get('NOTION_TESTIMONIALS_DB_ID'),
      suburbs: Deno.env.get('NOTION_SUBURBS_DB_ID'),
      case_studies: Deno.env.get('NOTION_CASE_STUDIES_DB_ID'),
      leads: Deno.env.get('NOTION_LEADS_DB_ID'),
      quotes: Deno.env.get('NOTION_QUOTES_DB_ID'),
      jobs: Deno.env.get('NOTION_JOBS_DB_ID'),
      tasks: Deno.env.get('NOTION_TASKS_DB_ID'),
    };

    console.log('🔄 Starting Notion sync...');
    console.log('Database config:', Object.entries(dbConfig).filter(([_, id]) => id).map(([name]) => name).join(', '));

    const results: SyncResult[] = [];

    // If database_type is specified, only sync that database
    if (database_type) {
      console.log(`🎯 Syncing single database: ${database_type}`);
      
      const dbId = dbConfig[database_type];
      if (!dbId) {
        throw new Error(`Database ID not configured for: ${database_type}`);
      }

      let result: SyncResult;
      switch (database_type) {
        case 'services':
          result = await syncServices(dbId);
          break;
        case 'knowledge_base':
          result = await syncKnowledgeBase(dbId);
          break;
        case 'testimonials':
          result = await syncTestimonials(dbId);
          break;
        case 'suburbs':
          result = await syncSuburbs(dbId);
          break;
        case 'case_studies':
          result = await syncCaseStudies(dbId);
          break;
        case 'leads':
          result = await syncLeads(dbId);
          break;
        case 'quotes':
          result = await syncQuotes(dbId);
          break;
        case 'tasks':
          result = await syncTasks(dbId);
          break;
        default:
          throw new Error(`Unknown database type: ${database_type}`);
      }

      results.push(result);
      await logSyncResult(result);

    } else {
      // Sync all configured databases
      console.log('🔄 Syncing all configured databases...');

      if (dbConfig.services) {
        const result = await syncServices(dbConfig.services);
        results.push(result);
        await logSyncResult(result);
      }

      if (dbConfig.knowledge_base) {
        const result = await syncKnowledgeBase(dbConfig.knowledge_base);
        results.push(result);
        await logSyncResult(result);
      }

      if (dbConfig.testimonials) {
        const result = await syncTestimonials(dbConfig.testimonials);
        results.push(result);
        await logSyncResult(result);
      }

      if (dbConfig.suburbs) {
        const result = await syncSuburbs(dbConfig.suburbs);
        results.push(result);
        await logSyncResult(result);
      }

      if (dbConfig.case_studies) {
        const result = await syncCaseStudies(dbConfig.case_studies);
        results.push(result);
        await logSyncResult(result);
      }

      if (dbConfig.leads) {
        const result = await syncLeads(dbConfig.leads);
        results.push(result);
        await logSyncResult(result);
      }

      if (dbConfig.quotes) {
        const result = await syncQuotes(dbConfig.quotes);
        results.push(result);
        await logSyncResult(result);
      }

      if (dbConfig.tasks) {
        const result = await syncTasks(dbConfig.tasks);
        results.push(result);
        await logSyncResult(result);
      }
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
