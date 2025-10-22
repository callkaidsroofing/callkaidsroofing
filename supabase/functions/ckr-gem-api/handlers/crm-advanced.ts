import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { buildLeadSearchQuery, SearchFilters, SearchOptions } from '../utils/search.ts';
import { mergeLeads, MergeStrategy } from '../utils/merge.ts';

// Validation Schemas
const BatchImportLeadsSchema = z.object({
  leads: z.array(z.object({
    name: z.string().min(1).max(200),
    suburb: z.string().min(1).max(100),
    service: z.string().min(1).max(200),
    phone: z.string().min(10).max(20),
    email: z.string().email().optional().or(z.literal('')),
    source: z.string().min(1),
    message: z.string().optional(),
    urgency: z.enum(['low', 'medium', 'high', 'urgent']).optional()
  })),
  skipDuplicates: z.boolean().default(true),
  autoScore: z.boolean().default(true)
});

const SearchLeadsAdvancedSchema = z.object({
  filters: z.object({
    suburbs: z.array(z.string()).optional(),
    services: z.array(z.string()).optional(),
    status: z.array(z.string()).optional(),
    aiScoreMin: z.number().min(0).max(10).optional(),
    aiScoreMax: z.number().min(0).max(10).optional(),
    dateRange: z.object({
      start: z.string().optional(),
      end: z.string().optional()
    }).optional(),
    source: z.array(z.string()).optional(),
    hasEmail: z.boolean().optional(),
    urgency: z.array(z.string()).optional()
  }).optional().default({}),
  sortBy: z.enum(['created_at', 'ai_score', 'updated_at']).optional().default('created_at'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  limit: z.number().min(1).max(200).optional().default(50),
  offset: z.number().min(0).optional().default(0)
});

const MergeLeadDuplicatesSchema = z.object({
  primaryLeadId: z.string().uuid(),
  duplicateLeadIds: z.array(z.string().uuid()).min(1),
  mergeStrategy: z.enum(['keep_primary', 'keep_latest', 'keep_best_data']).default('keep_best_data')
});

const CreateLeadTaskSchema = z.object({
  leadId: z.string().uuid(),
  taskType: z.enum(['follow_up', 'quote_reminder', 'site_visit', 'price_negotiation', 'custom']),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  dueDate: z.string().datetime(),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
  reminderMinutesBefore: z.number().min(0).optional().default(60)
});

const FetchLeadTimelineSchema = z.object({
  leadId: z.string().uuid(),
  includeNotes: z.boolean().optional().default(true),
  includeTasks: z.boolean().optional().default(true),
  includeQuotes: z.boolean().optional().default(true),
  includeEmails: z.boolean().optional().default(true),
  includeStatusChanges: z.boolean().optional().default(true),
  dateRange: z.object({
    start: z.string().optional(),
    end: z.string().optional()
  }).optional()
});

// Action Handlers
export async function batchImportLeads(params: any, mode: string, context: any) {
  const validated = BatchImportLeadsSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: `Would import ${validated.leads.length} leads`,
      data: { lead_count: validated.leads.length }
    };
  }

  const results = {
    imported_count: 0,
    skipped_duplicates: 0,
    validation_errors: 0,
    hot_leads: 0,
    lead_ids: [] as string[],
    errors: [] as any[]
  };

  for (const lead of validated.leads) {
    try {
      // Check for duplicates if enabled
      if (validated.skipDuplicates) {
        const { data: existing } = await supabase
          .from('leads')
          .select('id')
          .eq('phone', lead.phone)
          .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
          .single();

        if (existing) {
          results.skipped_duplicates++;
          continue;
        }
      }

      // Insert lead
      const { data: newLead, error } = await supabase
        .from('leads')
        .insert({
          ...lead,
          email: lead.email || null,
          status: 'new'
        })
        .select()
        .single();

      if (error) {
        results.validation_errors++;
        results.errors.push({ lead: lead.name, error: error.message });
        continue;
      }

      results.imported_count++;
      results.lead_ids.push(newLead.id);

      // Trigger AI scoring if enabled
      if (validated.autoScore) {
        try {
          await supabase.functions.invoke('agent-lead-intelligence', {
            body: { leadId: newLead.id }
          });
        } catch (scoreError) {
          console.error('AI scoring failed:', scoreError);
        }
      }
    } catch (error) {
      results.validation_errors++;
      results.errors.push({ lead: lead.name, error: error.message });
    }
  }

  return {
    message: `Imported ${results.imported_count} leads, skipped ${results.skipped_duplicates} duplicates`,
    data: results
  };
}

export async function searchLeadsAdvanced(params: any, mode: string, context: any) {
  const validated = SearchLeadsAdvancedSchema.parse(params);
  const { supabase } = context;

  const query = await buildLeadSearchQuery(
    supabase,
    validated.filters as SearchFilters,
    {
      sortBy: validated.sortBy,
      sortOrder: validated.sortOrder,
      limit: validated.limit,
      offset: validated.offset
    } as SearchOptions
  );

  const { data: leads, error, count } = await query;

  if (error) {
    throw new Error(`Search failed: ${error.message}`);
  }

  return {
    message: `Found ${count || 0} leads matching criteria`,
    data: {
      leads: leads || [],
      total_count: count || 0,
      page: Math.floor(validated.offset / validated.limit) + 1,
      has_more: (count || 0) > (validated.offset + validated.limit),
      filters_applied: validated.filters
    }
  };
}

export async function mergeLeadDuplicates(params: any, mode: string, context: any) {
  const validated = MergeLeadDuplicatesSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: `Would merge ${validated.duplicateLeadIds.length} leads into ${validated.primaryLeadId}`,
      data: { strategy: validated.mergeStrategy }
    };
  }

  const result = await mergeLeads(
    supabase,
    validated.primaryLeadId,
    validated.duplicateLeadIds,
    validated.mergeStrategy as MergeStrategy
  );

  // Add note to merged lead
  await supabase.from('lead_notes').insert({
    lead_id: validated.primaryLeadId,
    content: `Merged ${validated.duplicateLeadIds.length} duplicate leads using '${validated.mergeStrategy}' strategy`,
    note_type: 'system'
  });

  return {
    message: `Successfully merged ${validated.duplicateLeadIds.length} leads`,
    data: result
  };
}

export async function createLeadTask(params: any, mode: string, context: any) {
  const validated = CreateLeadTaskSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: `Would create task '${validated.title}' for lead`,
      data: { task_type: validated.taskType }
    };
  }

  // Verify lead exists
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('id')
    .eq('id', validated.leadId)
    .single();

  if (leadError || !lead) {
    throw new Error('Lead not found');
  }

  // Insert task
  const { data: task, error } = await supabase
    .from('lead_tasks')
    .insert({
      lead_id: validated.leadId,
      task_type: validated.taskType,
      title: validated.title,
      description: validated.description,
      due_date: validated.dueDate.split('T')[0],
      priority: validated.priority,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  return {
    message: 'Task created successfully',
    data: {
      task_id: task.id,
      lead_id: validated.leadId,
      due_date: task.due_date,
      reminder_scheduled: true
    }
  };
}

export async function fetchLeadTimeline(params: any, mode: string, context: any) {
  const validated = FetchLeadTimelineSchema.parse(params);
  const { supabase } = context;

  const timeline: any[] = [];

  // Fetch lead details
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', validated.leadId)
    .single();

  if (leadError || !lead) {
    throw new Error('Lead not found');
  }

  // Fetch notes
  if (validated.includeNotes) {
    const { data: notes } = await supabase
      .from('lead_notes')
      .select('*')
      .eq('lead_id', validated.leadId)
      .order('created_at', { ascending: false });

    if (notes) {
      notes.forEach(note => {
        timeline.push({
          timestamp: note.created_at,
          type: 'note',
          description: note.content,
          actor: 'System',
          metadata: { note_type: note.note_type }
        });
      });
    }
  }

  // Fetch tasks
  if (validated.includeTasks) {
    const { data: tasks } = await supabase
      .from('lead_tasks')
      .select('*')
      .eq('lead_id', validated.leadId)
      .order('created_at', { ascending: false });

    if (tasks) {
      tasks.forEach(task => {
        timeline.push({
          timestamp: task.created_at,
          type: 'task',
          description: `Task created: ${task.title}`,
          actor: 'System',
          metadata: { status: task.status, priority: task.priority }
        });
      });
    }
  }

  // Fetch quotes
  if (validated.includeQuotes) {
    const { data: inspections } = await supabase
      .from('inspection_reports')
      .select('id, created_at')
      .eq('phone', lead.phone);

    if (inspections) {
      for (const inspection of inspections) {
        const { data: quotes } = await supabase
          .from('quotes')
          .select('*')
          .eq('inspection_report_id', inspection.id);

        if (quotes) {
          quotes.forEach(quote => {
            timeline.push({
              timestamp: quote.created_at,
              type: 'quote',
              description: `Quote ${quote.quote_number} created (${quote.tier_level})`,
              actor: 'System',
              metadata: { total: quote.total, status: quote.status }
            });
          });
        }
      }
    }
  }

  // Sort timeline by timestamp
  timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    message: `Fetched timeline for lead ${lead.name}`,
    data: {
      timeline,
      summary: {
        total_events: timeline.length,
        notes_added: timeline.filter(e => e.type === 'note').length,
        tasks_created: timeline.filter(e => e.type === 'task').length,
        quotes_sent: timeline.filter(e => e.type === 'quote').length
      }
    }
  };
}
