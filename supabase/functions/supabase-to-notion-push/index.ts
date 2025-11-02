import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { Client } from 'https://deno.land/x/notion_sdk@v2.2.3/src/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PushResult {
  success: boolean;
  action: string;
  recordId?: string;
  notionPageId?: string;
  error?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const notionKey = Deno.env.get('NOTION_API_KEY');

    if (!notionKey) {
      throw new Error('NOTION_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const notion = new Client({ auth: notionKey });

    const { action, lead_id, quote_id, job_id, invoice_id, tables, dry_run } = await req.json();

    console.log(`[Supabase→Notion] Action: ${action}`);

    let results: PushResult[] = [];

    // Handle bulk push for existing data
    if (action === 'bulk_push') {
      const tablesToSync = tables || ['leads', 'quotes', 'inspection_reports', 'invoices'];
      
      for (const table of tablesToSync) {
        console.log(`[Bulk Push] Syncing ${table}...`);
        const result = await bulkPushTable(supabase, notion, table, dry_run);
        results.push(...result);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          results,
          summary: {
            total: results.length,
            successful: results.filter(r => r.success).length,
            failed: results.filter(r => !r.success).length
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle sync_all (scheduled cron job)
    if (action === 'sync_all') {
      const recentLeads = await syncRecentRecords(supabase, notion, 'leads');
      const recentQuotes = await syncRecentRecords(supabase, notion, 'quotes');
      const recentJobs = await syncRecentRecords(supabase, notion, 'inspection_reports');
      
      results = [...recentLeads, ...recentQuotes, ...recentJobs];

      return new Response(
        JSON.stringify({ success: true, results }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle individual record pushes
    if (action === 'push_lead' && lead_id) {
      const result = await pushLeadToNotion(supabase, notion, lead_id);
      results.push(result);
    }

    if (action === 'push_quote' && quote_id) {
      const result = await pushQuoteToNotion(supabase, notion, quote_id);
      results.push(result);
    }

    if (action === 'push_job' && job_id) {
      const result = await pushJobToNotion(supabase, notion, job_id);
      results.push(result);
    }

    if (action === 'push_invoice' && invoice_id) {
      const result = await pushInvoiceToNotion(supabase, notion, invoice_id);
      results.push(result);
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Supabase→Notion] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function pushLeadToNotion(supabase: any, notion: any, leadId: string): Promise<PushResult> {
  try {
    const leadsDbId = Deno.env.get('NOTION_LEADS_DB_ID');
    if (!leadsDbId) {
      throw new Error('NOTION_LEADS_DB_ID not configured');
    }

    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error || !lead) {
      throw new Error(`Lead not found: ${leadId}`);
    }

    // Check if should push (timestamp comparison)
    const notionSyncId = `lead-${lead.id}`;
    const existingPage = await findNotionPageBySyncId(notion, leadsDbId, notionSyncId);

    if (existingPage) {
      const shouldUpdate = new Date(lead.updated_at) > new Date(existingPage.last_edited_time);
      if (!shouldUpdate) {
        console.log(`[Lead] Skipping ${leadId} - Notion is newer`);
        return { success: true, action: 'skipped', recordId: leadId };
      }
    }

    const properties: any = {
      'Client Name': { title: [{ text: { content: lead.name || 'Unknown' } }] },
      'Client Phone': { phone_number: lead.phone || '' },
      'Client Email': { email: lead.email || null },
      'Suburb': { rich_text: [{ text: { content: lead.suburb || '' } }] },
      'Service Requested': { rich_text: [{ text: { content: lead.service || '' } }] },
      'Lead Status': { select: { name: lead.status || 'new' } },
      'Lead Source': { select: { name: lead.source || 'website' } },
      'Notion Sync ID': { rich_text: [{ text: { content: notionSyncId } }] }
    };

    if (lead.message) {
      properties['Message'] = { rich_text: [{ text: { content: lead.message } }] };
    }

    let notionPageId: string;

    if (existingPage) {
      await notion.pages.update({
        page_id: existingPage.id,
        properties
      });
      notionPageId = existingPage.id;
      console.log(`[Lead] Updated in Notion: ${leadId}`);
    } else {
      const response = await notion.pages.create({
        parent: { database_id: leadsDbId },
        properties
      });
      notionPageId = response.id;
      console.log(`[Lead] Created in Notion: ${leadId}`);

      // Update Supabase with notion_sync_id
      await supabase
        .from('leads')
        .update({ notion_sync_id: notionSyncId })
        .eq('id', leadId);
    }

    await delay(350); // Rate limit: 3 req/sec

    return { success: true, action: existingPage ? 'updated' : 'created', recordId: leadId, notionPageId };

  } catch (error) {
    console.error(`[Lead] Push failed for ${leadId}:`, error);
    return { success: false, action: 'failed', recordId: leadId, error: error.message };
  }
}

async function pushQuoteToNotion(supabase: any, notion: any, quoteId: string): Promise<PushResult> {
  try {
    const quotesDbId = Deno.env.get('NOTION_QUOTES_DB_ID');
    if (!quotesDbId) {
      throw new Error('NOTION_QUOTES_DB_ID not configured');
    }

    const { data: quote, error } = await supabase
      .from('quotes')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (error || !quote) {
      throw new Error(`Quote not found: ${quoteId}`);
    }

    const notionSyncId = `quote-${quote.id}`;
    const existingPage = await findNotionPageBySyncId(notion, quotesDbId, notionSyncId);

    if (existingPage) {
      const shouldUpdate = new Date(quote.updated_at) > new Date(existingPage.last_edited_time);
      if (!shouldUpdate) {
        return { success: true, action: 'skipped', recordId: quoteId };
      }
    }

    const properties: any = {
      'Quote Number': { title: [{ text: { content: quote.quote_number || `Q-${quote.id.substring(0, 8)}` } }] },
      'Client Name': { rich_text: [{ text: { content: quote.client_name || '' } }] },
      'Total (Inc GST)': { number: parseFloat(quote.total_inc_gst || 0) },
      'Status': { select: { name: quote.status || 'draft' } },
      'Quote Date': { date: { start: quote.created_at.split('T')[0] } },
      'Notion Sync ID': { rich_text: [{ text: { content: notionSyncId } }] }
    };

    let notionPageId: string;

    if (existingPage) {
      await notion.pages.update({ page_id: existingPage.id, properties });
      notionPageId = existingPage.id;
    } else {
      const response = await notion.pages.create({
        parent: { database_id: quotesDbId },
        properties
      });
      notionPageId = response.id;

      await supabase
        .from('quotes')
        .update({ notion_sync_id: notionSyncId })
        .eq('id', quoteId);
    }

    await delay(350);
    return { success: true, action: existingPage ? 'updated' : 'created', recordId: quoteId, notionPageId };

  } catch (error) {
    console.error(`[Quote] Push failed for ${quoteId}:`, error);
    return { success: false, action: 'failed', recordId: quoteId, error: error.message };
  }
}

async function pushJobToNotion(supabase: any, notion: any, jobId: string): Promise<PushResult> {
  try {
    const jobsDbId = Deno.env.get('NOTION_JOBS_DB_ID');
    if (!jobsDbId) {
      console.log('[Job] NOTION_JOBS_DB_ID not configured, skipping');
      return { success: true, action: 'skipped', recordId: jobId };
    }

    const { data: job, error } = await supabase
      .from('inspection_reports')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !job) {
      throw new Error(`Job not found: ${jobId}`);
    }

    const notionSyncId = `job-${job.id}`;
    const existingPage = await findNotionPageBySyncId(notion, jobsDbId, notionSyncId);

    if (existingPage) {
      const shouldUpdate = new Date(job.updated_at) > new Date(existingPage.last_edited_time);
      if (!shouldUpdate) {
        return { success: true, action: 'skipped', recordId: jobId };
      }
    }

    const properties: any = {
      'Job ID': { title: [{ text: { content: job.id.substring(0, 8) } }] },
      'Client': { rich_text: [{ text: { content: job.clientName || '' } }] },
      'Address': { rich_text: [{ text: { content: job.siteAddress || '' } }] },
      'Status': { select: { name: job.status || 'draft' } },
      'Scheduled Date': job.scheduled_date ? { date: { start: job.scheduled_date } } : { date: null },
      'Notion Sync ID': { rich_text: [{ text: { content: notionSyncId } }] }
    };

    let notionPageId: string;

    if (existingPage) {
      await notion.pages.update({ page_id: existingPage.id, properties });
      notionPageId = existingPage.id;
    } else {
      const response = await notion.pages.create({
        parent: { database_id: jobsDbId },
        properties
      });
      notionPageId = response.id;

      await supabase
        .from('inspection_reports')
        .update({ notion_sync_id: notionSyncId })
        .eq('id', jobId);
    }

    await delay(350);
    return { success: true, action: existingPage ? 'updated' : 'created', recordId: jobId, notionPageId };

  } catch (error) {
    console.error(`[Job] Push failed for ${jobId}:`, error);
    return { success: false, action: 'failed', recordId: jobId, error: error.message };
  }
}

async function pushInvoiceToNotion(supabase: any, notion: any, invoiceId: string): Promise<PushResult> {
  try {
    const invoicesDbId = Deno.env.get('NOTION_INVOICES_DB_ID');
    if (!invoicesDbId) {
      console.log('[Invoice] NOTION_INVOICES_DB_ID not configured, skipping');
      return { success: true, action: 'skipped', recordId: invoiceId };
    }

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (error || !invoice) {
      throw new Error(`Invoice not found: ${invoiceId}`);
    }

    const notionSyncId = `invoice-${invoice.id}`;
    const existingPage = await findNotionPageBySyncId(notion, invoicesDbId, notionSyncId);

    const properties: any = {
      'Invoice Number': { title: [{ text: { content: invoice.invoice_number || '' } }] },
      'Client Name': { rich_text: [{ text: { content: invoice.client_name || '' } }] },
      'Total': { number: parseFloat(invoice.total || 0) },
      'Status': { select: { name: invoice.status || 'draft' } },
      'Issue Date': { date: { start: invoice.issue_date } },
      'Notion Sync ID': { rich_text: [{ text: { content: notionSyncId } }] }
    };

    let notionPageId: string;

    if (existingPage) {
      await notion.pages.update({ page_id: existingPage.id, properties });
      notionPageId = existingPage.id;
    } else {
      const response = await notion.pages.create({
        parent: { database_id: invoicesDbId },
        properties
      });
      notionPageId = response.id;

      await supabase
        .from('invoices')
        .update({ notion_sync_id: notionSyncId })
        .eq('id', invoiceId);
    }

    await delay(350);
    return { success: true, action: existingPage ? 'updated' : 'created', recordId: invoiceId, notionPageId };

  } catch (error) {
    console.error(`[Invoice] Push failed for ${invoiceId}:`, error);
    return { success: false, action: 'failed', recordId: invoiceId, error: error.message };
  }
}

async function findNotionPageBySyncId(notion: any, databaseId: string, syncId: string): Promise<any> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Notion Sync ID',
        rich_text: {
          equals: syncId
        }
      }
    });

    return response.results.length > 0 ? response.results[0] : null;
  } catch (error) {
    console.error(`[Find] Error finding page with sync ID ${syncId}:`, error);
    return null;
  }
}

async function bulkPushTable(supabase: any, notion: any, table: string, dryRun: boolean = false): Promise<PushResult[]> {
  const results: PushResult[] = [];

  const { data: records, error } = await supabase
    .from(table)
    .select('*')
    .is('notion_sync_id', null)
    .limit(50); // Process 50 at a time

  if (error || !records) {
    console.error(`[Bulk] Error fetching ${table}:`, error);
    return results;
  }

  console.log(`[Bulk] Found ${records.length} unsynced records in ${table}`);

  if (dryRun) {
    return records.map(r => ({ success: true, action: 'dry_run', recordId: r.id }));
  }

  for (const record of records) {
    let result: PushResult;

    if (table === 'leads') {
      result = await pushLeadToNotion(supabase, notion, record.id);
    } else if (table === 'quotes') {
      result = await pushQuoteToNotion(supabase, notion, record.id);
    } else if (table === 'inspection_reports') {
      result = await pushJobToNotion(supabase, notion, record.id);
    } else if (table === 'invoices') {
      result = await pushInvoiceToNotion(supabase, notion, record.id);
    } else {
      result = { success: false, action: 'unknown_table', recordId: record.id };
    }

    results.push(result);
  }

  return results;
}

async function syncRecentRecords(supabase: any, notion: any, table: string): Promise<PushResult[]> {
  const results: PushResult[] = [];
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { data: records, error } = await supabase
    .from(table)
    .select('*')
    .gte('updated_at', thirtyMinutesAgo)
    .limit(20);

  if (error || !records) {
    return results;
  }

  for (const record of records) {
    let result: PushResult;

    if (table === 'leads') {
      result = await pushLeadToNotion(supabase, notion, record.id);
    } else if (table === 'quotes') {
      result = await pushQuoteToNotion(supabase, notion, record.id);
    } else if (table === 'inspection_reports') {
      result = await pushJobToNotion(supabase, notion, record.id);
    } else {
      result = { success: false, action: 'unknown_table', recordId: record.id };
    }

    results.push(result);
  }

  return results;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
