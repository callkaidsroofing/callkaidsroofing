import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { checkSchedulingConflicts, generateJobChecklist } from '../utils/scheduling.ts';

// Validation Schemas
const CompareQuoteVersionsSchema = z.object({
  quoteId: z.string().uuid(),
  versionA: z.number().int().positive().optional(),
  versionB: z.number().int().positive().optional()
});

const FetchQuotesForLeadSchema = z.object({
  leadId: z.string().uuid(),
  includeLineItems: z.boolean().optional().default(true),
  includeHistory: z.boolean().optional().default(false),
  includeEmailTracking: z.boolean().optional().default(true)
});

const CloneQuoteSchema = z.object({
  sourceQuoteId: z.string().uuid(),
  modifications: z.object({
    tier: z.enum(['essential', 'premium', 'prestige']).optional(),
    adjustLineItems: z.boolean().optional().default(false),
    newClientName: z.string().optional(),
    newSiteAddress: z.string().optional()
  }).optional()
});

const ScheduleJobSchema = z.object({
  jobId: z.string().uuid(),
  scheduledDate: z.string(),
  estimatedDurationHours: z.number().positive(),
  assignedCrew: z.array(z.string()).optional().default(['Kaidyn Brownlie']),
  requiresEquipment: z.array(z.string()).optional()
});

const GenerateChecklistSchema = z.object({
  inspectionReportId: z.string().uuid(),
  includePhotos: z.boolean().optional().default(true),
  includeMaterials: z.boolean().optional().default(true)
});

// Action Handlers
export async function compareQuoteVersions(params: any, mode: string, context: any) {
  const validated = CompareQuoteVersionsSchema.parse(params);
  const { supabase } = context;

  // Fetch quote and history
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', validated.quoteId)
    .single();

  if (quoteError || !quote) {
    throw new Error('Quote not found');
  }

  const { data: history, error: historyError } = await supabase
    .from('quote_history')
    .select('*')
    .eq('quote_id', validated.quoteId)
    .order('version_number', { ascending: false });

  if (historyError || !history || history.length < 2) {
    throw new Error('Not enough quote versions to compare');
  }

  const versionA = validated.versionA || history[1].version_number;
  const versionB = validated.versionB || history[0].version_number;

  const versionAData = history.find(h => h.version_number === versionA);
  const versionBData = history.find(h => h.version_number === versionB);

  if (!versionAData || !versionBData) {
    throw new Error('Specified versions not found');
  }

  // Calculate differences
  const totalChangeAmt = (versionBData.changes.total || quote.total) - (versionAData.changes.total || 0);
  const percentageChange = ((totalChangeAmt / (versionAData.changes.total || 1)) * 100).toFixed(2);

  return {
    message: `Compared versions ${versionA} and ${versionB}`,
    data: {
      version_a: versionAData,
      version_b: versionBData,
      differences: {
        total_change: totalChangeAmt,
        percentage_change: parseFloat(percentageChange),
        changes: versionBData.changes
      },
      summary: `Price changed by $${totalChangeAmt.toFixed(2)} (${percentageChange}%)`
    }
  };
}

export async function fetchQuotesForLead(params: any, mode: string, context: any) {
  const validated = FetchQuotesForLeadSchema.parse(params);
  const { supabase } = context;

  // Fetch lead
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', validated.leadId)
    .single();

  if (leadError || !lead) {
    throw new Error('Lead not found');
  }

  // Find inspection reports for this lead
  const { data: inspections } = await supabase
    .from('inspection_reports')
    .select('id')
    .eq('phone', lead.phone);

  if (!inspections || inspections.length === 0) {
    return {
      message: 'No quotes found for this lead',
      data: { quotes: [], statistics: { total_quotes: 0 } }
    };
  }

  const inspectionIds = inspections.map(i => i.id);

  // Fetch quotes
  let quoteQuery = supabase
    .from('quotes')
    .select('*')
    .in('inspection_report_id', inspectionIds)
    .order('created_at', { ascending: false });

  const { data: quotes, error: quotesError } = await quoteQuery;

  if (quotesError) {
    throw new Error(`Failed to fetch quotes: ${quotesError.message}`);
  }

  const quotesData = [];

  for (const quote of quotes || []) {
    const quoteData: any = { ...quote };

    if (validated.includeLineItems) {
      const { data: lineItems } = await supabase
        .from('quote_line_items')
        .select('*')
        .eq('quote_id', quote.id)
        .order('sort_order');
      quoteData.line_items = lineItems || [];
    }

    if (validated.includeEmailTracking) {
      const { data: emails } = await supabase
        .from('quote_emails')
        .select('*')
        .eq('quote_id', quote.id)
        .order('sent_at', { ascending: false })
        .limit(1);
      quoteData.email_tracking = emails?.[0] || null;
    }

    quotesData.push(quoteData);
  }

  // Calculate statistics
  const stats = {
    total_quotes: quotesData.length,
    accepted: quotesData.filter(q => q.status === 'accepted').length,
    rejected: quotesData.filter(q => q.status === 'rejected').length,
    pending: quotesData.filter(q => q.status === 'sent').length,
    total_value: quotesData.reduce((sum, q) => sum + (q.total || 0), 0),
    average_quote: quotesData.length > 0 ? quotesData.reduce((sum, q) => sum + (q.total || 0), 0) / quotesData.length : 0
  };

  return {
    message: `Found ${quotesData.length} quotes for ${lead.name}`,
    data: {
      lead_id: validated.leadId,
      client_name: lead.name,
      quotes: quotesData,
      statistics: stats
    }
  };
}

export async function cloneQuote(params: any, mode: string, context: any) {
  const validated = CloneQuoteSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: 'Would clone quote with specified modifications',
      data: { modifications: validated.modifications }
    };
  }

  // Fetch source quote
  const { data: sourceQuote, error: quoteError } = await supabase
    .from('quotes')
    .select('*')
    .eq('id', validated.sourceQuoteId)
    .single();

  if (quoteError || !sourceQuote) {
    throw new Error('Source quote not found');
  }

  // Fetch line items
  const { data: sourceLineItems, error: itemsError } = await supabase
    .from('quote_line_items')
    .select('*')
    .eq('quote_id', validated.sourceQuoteId)
    .order('sort_order');

  if (itemsError) {
    throw new Error('Failed to fetch line items');
  }

  // Generate new quote number
  const { data: quoteNumber } = await supabase.rpc('generate_quote_number');

  // Apply modifications
  const newQuote: any = {
    ...sourceQuote,
    id: undefined,
    quote_number: quoteNumber,
    status: 'draft',
    created_at: undefined,
    updated_at: undefined
  };

  if (validated.modifications?.tier) {
    newQuote.tier_level = validated.modifications.tier;
  }

  if (validated.modifications?.newClientName) {
    newQuote.client_name = validated.modifications.newClientName;
  }

  if (validated.modifications?.newSiteAddress) {
    newQuote.site_address = validated.modifications.newSiteAddress;
  }

  // Insert new quote
  const { data: clonedQuote, error: insertError } = await supabase
    .from('quotes')
    .insert(newQuote)
    .select()
    .single();

  if (insertError) {
    throw new Error(`Failed to clone quote: ${insertError.message}`);
  }

  // Clone line items
  if (sourceLineItems && sourceLineItems.length > 0) {
    const newLineItems = sourceLineItems.map(item => ({
      ...item,
      id: undefined,
      quote_id: clonedQuote.id,
      created_at: undefined
    }));

    await supabase.from('quote_line_items').insert(newLineItems);
  }

  return {
    message: `Quote cloned successfully as ${quoteNumber}`,
    data: {
      new_quote_id: clonedQuote.id,
      quote_number: quoteNumber,
      cloned_from: sourceQuote.quote_number,
      modifications_applied: validated.modifications || {},
      total: clonedQuote.total
    }
  };
}

export async function scheduleJobWithConflictCheck(params: any, mode: string, context: any) {
  const validated = ScheduleJobSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: 'Would schedule job and check for conflicts',
      data: { scheduled_date: validated.scheduledDate }
    };
  }

  // Check conflicts
  const conflictCheck = await checkSchedulingConflicts(
    supabase,
    validated.scheduledDate,
    validated.estimatedDurationHours,
    validated.assignedCrew
  );

  if (conflictCheck.hasConflicts) {
    return {
      message: 'Scheduling conflicts detected',
      data: {
        scheduled: false,
        conflicts_found: true,
        conflicts: conflictCheck.conflicts,
        alternative_dates: conflictCheck.alternativeDates
      }
    };
  }

  // Schedule job
  const { error: updateError } = await supabase
    .from('inspection_reports')
    .update({
      scheduled_date: validated.scheduledDate,
      estimated_duration_hours: validated.estimatedDurationHours,
      assigned_crew: validated.assignedCrew,
      status: 'scheduled'
    })
    .eq('id', validated.jobId);

  if (updateError) {
    throw new Error(`Failed to schedule job: ${updateError.message}`);
  }

  return {
    message: 'Job scheduled successfully',
    data: {
      scheduled: true,
      job_id: validated.jobId,
      scheduled_date: validated.scheduledDate,
      conflicts_found: false,
      crew_assigned: validated.assignedCrew,
      alternative_dates: []
    }
  };
}

export async function generateJobChecklistFromInspection(params: any, mode: string, context: any) {
  const validated = GenerateChecklistSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: 'Would generate job checklist from inspection',
      data: { inspection_id: validated.inspectionReportId }
    };
  }

  const result = await generateJobChecklist(
    supabase,
    validated.inspectionReportId,
    validated.includePhotos,
    validated.includeMaterials
  );

  // Save checklist to inspection report
  await supabase
    .from('inspection_reports')
    .update({ job_checklist: result.checklist })
    .eq('id', validated.inspectionReportId);

  return {
    message: 'Job checklist generated successfully',
    data: {
      job_id: validated.inspectionReportId,
      ...result
    }
  };
}
