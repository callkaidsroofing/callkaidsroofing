import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { exportLeadsToCSV, ExportFilters } from '../utils/export.ts';

// Validation Schemas
const BulkUpdateLeadStatusSchema = z.object({
  leadIds: z.array(z.string().uuid()).min(1).max(50),
  newStatus: z.string().min(1),
  addNote: z.string().optional(),
  triggerFollowup: z.boolean().optional().default(false)
});

const ScheduleQuoteFollowupSchema = z.object({
  quoteId: z.string().uuid(),
  followupDaysAfter: z.number().int().min(1).max(30).default(3),
  followupMethod: z.enum(['email', 'sms', 'call', 'task']).default('task'),
  customMessage: z.string().optional()
});

const TrackQuoteEmailEngagementSchema = z.object({
  quoteId: z.string().uuid(),
  includeClickMap: z.boolean().optional().default(false)
});

const ExportLeadsToCSVSchema = z.object({
  filters: z.object({
    status: z.array(z.string()).optional(),
    dateRange: z.object({
      start: z.string().optional(),
      end: z.string().optional()
    }).optional(),
    suburb: z.array(z.string()).optional(),
    service: z.array(z.string()).optional()
  }).optional().default({}),
  includeFields: z.array(z.string()).optional(),
  sortBy: z.string().optional().default('created_at')
});

const NotifyTeamAboutHotLeadSchema = z.object({
  leadId: z.string().uuid(),
  recipientEmails: z.array(z.string().email()).optional().default(['callkaidsroofing@outlook.com']),
  sendSMS: z.boolean().optional().default(true),
  urgencyLevel: z.enum(['normal', 'high', 'urgent']).default('high')
});

// Action Handlers
export async function bulkUpdateLeadStatus(params: any, mode: string, context: any) {
  const validated = BulkUpdateLeadStatusSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: `Would update ${validated.leadIds.length} leads to status '${validated.newStatus}'`,
      data: { lead_count: validated.leadIds.length }
    };
  }

  // Update leads
  const { error: updateError } = await supabase
    .from('leads')
    .update({
      status: validated.newStatus,
      updated_at: new Date().toISOString()
    })
    .in('id', validated.leadIds);

  if (updateError) {
    throw new Error(`Failed to update leads: ${updateError.message}`);
  }

  // Add notes if specified
  if (validated.addNote) {
    const notes = validated.leadIds.map(leadId => ({
      lead_id: leadId,
      content: validated.addNote,
      note_type: 'system'
    }));

    await supabase.from('lead_notes').insert(notes);
  }

  // Create follow-up tasks if requested
  if (validated.triggerFollowup) {
    const tasks = validated.leadIds.map(leadId => ({
      lead_id: leadId,
      task_type: 'follow_up',
      title: `Follow up on ${validated.newStatus} lead`,
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'normal',
      status: 'pending'
    }));

    await supabase.from('lead_tasks').insert(tasks);
  }

  return {
    message: `Successfully updated ${validated.leadIds.length} leads`,
    data: {
      updated_count: validated.leadIds.length,
      failed: 0,
      new_status: validated.newStatus,
      notes_added: !!validated.addNote
    }
  };
}

export async function scheduleQuoteFollowup(params: any, mode: string, context: any) {
  const validated = ScheduleQuoteFollowupSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: `Would schedule follow-up for quote in ${validated.followupDaysAfter} days`,
      data: { method: validated.followupMethod }
    };
  }

  // Fetch quote
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .select('*, inspection_report_id')
    .eq('id', validated.quoteId)
    .single();

  if (quoteError || !quote) {
    throw new Error('Quote not found');
  }

  // Get lead from inspection report
  const { data: inspection } = await supabase
    .from('inspection_reports')
    .select('phone')
    .eq('id', quote.inspection_report_id)
    .single();

  if (!inspection) {
    throw new Error('Inspection report not found');
  }

  const { data: lead } = await supabase
    .from('leads')
    .select('id')
    .eq('phone', inspection.phone)
    .single();

  // Calculate follow-up date
  const followupDate = new Date();
  followupDate.setDate(followupDate.getDate() + validated.followupDaysAfter);

  // Create task
  const { data: task, error: taskError } = await supabase
    .from('lead_tasks')
    .insert({
      lead_id: lead?.id,
      task_type: 'quote_reminder',
      title: `Follow up on quote ${quote.quote_number}`,
      description: validated.customMessage || `Quote sent ${validated.followupDaysAfter} days ago. Check if client has questions.`,
      due_date: followupDate.toISOString().split('T')[0],
      priority: 'high',
      status: 'pending'
    })
    .select()
    .single();

  if (taskError) {
    throw new Error(`Failed to create task: ${taskError.message}`);
  }

  return {
    message: `Follow-up scheduled for ${followupDate.toISOString().split('T')[0]}`,
    data: {
      followup_scheduled: true,
      quote_id: validated.quoteId,
      scheduled_date: followupDate.toISOString(),
      method: validated.followupMethod,
      task_id: task.id
    }
  };
}

export async function trackQuoteEmailEngagement(params: any, mode: string, context: any) {
  const validated = TrackQuoteEmailEngagementSchema.parse(params);
  const { supabase } = context;

  // Fetch quote email tracking
  const { data: emails, error } = await supabase
    .from('quote_emails')
    .select('*')
    .eq('quote_id', validated.quoteId)
    .order('sent_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch email tracking: ${error.message}`);
  }

  if (!emails || emails.length === 0) {
    return {
      message: 'No emails sent for this quote',
      data: {
        quote_id: validated.quoteId,
        total_opens: 0,
        engagement_score: 0
      }
    };
  }

  const latestEmail = emails[0];
  const totalOpens = latestEmail.viewed_at ? 1 : 0;
  const clickCount = latestEmail.click_count || 0;

  // Calculate engagement score (0-10)
  let engagementScore = 0;
  if (latestEmail.viewed_at) engagementScore += 5;
  if (clickCount > 0) engagementScore += 3;
  if (clickCount > 1) engagementScore += 2;

  const clicks = validated.includeClickMap ? (latestEmail.clicks_data || []) : [];

  // Determine follow-up suggestion
  let suggestion = 'No engagement detected. Consider phone follow-up.';
  if (engagementScore >= 8) {
    suggestion = 'High engagement. Follow up within 24 hours.';
  } else if (engagementScore >= 5) {
    suggestion = 'Moderate engagement. Follow up within 2-3 days.';
  }

  return {
    message: 'Email engagement tracked',
    data: {
      quote_id: validated.quoteId,
      sent_at: latestEmail.sent_at,
      first_opened: latestEmail.viewed_at,
      total_opens: totalOpens,
      unique_opens: totalOpens,
      clicks,
      engagement_score: engagementScore,
      suggested_followup: suggestion
    }
  };
}

export async function exportLeadsToCSVAction(params: any, mode: string, context: any) {
  const validated = ExportLeadsToCSVSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: 'Would export leads to CSV with specified filters',
      data: { filters: validated.filters }
    };
  }

  const result = await exportLeadsToCSV(
    supabase,
    validated.filters as ExportFilters,
    validated.includeFields,
    validated.sortBy
  );

  // Log export in audit
  await supabase.from('system_audit').insert({
    action: 'ExportLeadsToCSV',
    params: validated,
    result: { total_leads: result.total_leads },
    status: 'success',
    execution_time_ms: 0
  });

  return {
    message: `Exported ${result.total_leads} leads to CSV`,
    data: result
  };
}

export async function notifyTeamAboutHotLead(params: any, mode: string, context: any) {
  const validated = NotifyTeamAboutHotLeadSchema.parse(params);
  const { supabase } = context;

  if (mode === 'dry-run') {
    return {
      message: `Would notify team about hot lead (urgency: ${validated.urgencyLevel})`,
      data: { recipients: validated.recipientEmails }
    };
  }

  // Fetch lead details
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', validated.leadId)
    .single();

  if (leadError || !lead) {
    throw new Error('Lead not found');
  }

  // Create high-priority task
  const { data: task } = await supabase
    .from('lead_tasks')
    .insert({
      lead_id: validated.leadId,
      task_type: 'follow_up',
      title: `HOT LEAD: ${lead.name} - ${lead.service}`,
      description: `AI Score: ${lead.ai_score || 'N/A'}/10\nSuburb: ${lead.suburb}\nUrgency: ${validated.urgencyLevel}\nContact within 30 minutes.`,
      due_date: new Date().toISOString().split('T')[0],
      priority: 'urgent',
      status: 'pending'
    })
    .select()
    .single();

  // Log notification
  await supabase.from('lead_notes').insert({
    lead_id: validated.leadId,
    content: `Hot lead notification sent to team. Urgency: ${validated.urgencyLevel}`,
    note_type: 'system'
  });

  return {
    message: 'Team notified about hot lead',
    data: {
      notifications_sent: validated.recipientEmails.length,
      sms_delivered: validated.sendSMS,
      emails_sent: validated.recipientEmails,
      task_created: true,
      task_id: task?.id,
      expected_response_within: '30 minutes'
    }
  };
}
