import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';
import { APIError } from '../utils/errors.ts';
import { sanitizeInput, validatePhoneAU, validateEmail } from '../utils/security.ts';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const insertLeadSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeInput),
  suburb: z.string().min(1).transform(sanitizeInput),
  service: z.enum([
    'Roof Restoration',
    'Roof Painting',
    'Roof Repairs',
    'Gutter Cleaning',
    'Leak Detection',
    'Valley Iron Replacement',
    'Tile Replacement',
    'Roof Repointing'
  ]),
  contact: z.string().refine(validatePhoneAU, 'Invalid Australian phone number'),
  email: z.string().email().optional().transform(val => val ? sanitizeInput(val) : undefined),
  source: z.string().optional().default('GPT Import'),
  message: z.string().optional().transform(val => val ? sanitizeInput(val) : undefined)
});

const updateLeadStatusSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(['new', 'contacted', 'quoted', 'won', 'lost', 'cold_followup']),
  notes: z.string().optional().transform(val => val ? sanitizeInput(val) : undefined)
});

const insertJobSchema = z.object({
  lead_id: z.string().uuid(),
  status: z.enum(['scheduled', 'in_progress', 'complete', 'on_hold']).default('scheduled'),
  start_date: z.string().datetime(),
  notes: z.string().optional()
});

const updateJobStatusSchema = z.object({
  jobId: z.string().uuid(),
  status: z.enum(['draft', 'completed', 'in_progress', 'on_hold']),
  notes: z.string().optional()
});

const generateQuoteSchema = z.object({
  reportId: z.string().uuid(),
  tier: z.enum(['essential', 'premium', 'prestige'])
});

const sendQuoteSchema = z.object({
  quoteId: z.string().uuid(),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().optional()
});

// ============================================
// ACTION HANDLERS
// ============================================

// 1. InsertLeadRecord
export async function insertLead(params: any, mode: string, context: any) {
  const validated = insertLeadSchema.parse(params);
  const { supabase } = context;
  
  if (mode === 'dry-run') {
    return {
      message: "DRY RUN: Would insert lead into system",
      data: {
        ...validated,
        next_actions: [
          "Lead would be inserted into 'leads' table",
          "agent-lead-intelligence would be triggered for AI scoring",
          "Lead status would be set to 'new'",
          "If AI score > 80: Instant SMS alert to Kaidyn",
          "If service area match: Priority flag set"
        ]
      }
    };
  }
  
  // Insert lead
  const { data: lead, error: insertError } = await supabase
    .from('leads')
    .insert({
      name: validated.name,
      suburb: validated.suburb,
      service: validated.service,
      phone: validated.contact,
      email: validated.email,
      message: validated.message,
      source: validated.source,
      status: 'new',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (insertError) {
    throw new APIError(`Failed to insert lead: ${insertError.message}`, 500, 'DATABASE_ERROR');
  }
  
  // Trigger AI scoring (existing edge function)
  const { data: scoreData, error: scoreError } = await supabase.functions.invoke(
    'agent-lead-intelligence',
    { body: { leadId: lead.id } }
  );
  
  if (scoreError) {
    console.error('Lead scoring failed:', scoreError);
    // Don't fail the whole operation
  }
  
  return {
    message: `Lead created: ${lead.name} from ${lead.suburb}`,
    data: {
      lead_id: lead.id,
      ai_score: scoreData?.score || null,
      status: 'new',
      service_area_match: scoreData?.service_area_match || null,
      priority: scoreData?.priority || 'medium'
    }
  };
}

// 2. UpdateLeadStatus
export async function updateLeadStatus(params: any, mode: string, context: any) {
  const { leadId, status, notes } = updateLeadStatusSchema.parse(params);
  const { supabase } = context;
  
  if (mode === 'dry-run') {
    return {
      message: `DRY RUN: Would update lead ${leadId} to status: ${status}`,
      data: { leadId, status, notes }
    };
  }
  
  // Update lead
  const { data: lead, error } = await supabase
    .from('leads')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', leadId)
    .select()
    .single();
  
  if (error) {
    throw new APIError(`Failed to update lead: ${error.message}`, 500, 'DATABASE_ERROR');
  }
  
  // Log note if provided
  if (notes) {
    await supabase.from('lead_notes').insert({
      lead_id: leadId,
      content: notes,
      note_type: 'status_change',
      created_at: new Date().toISOString()
    });
  }
  
  return {
    message: `Lead ${lead.name} updated to: ${status}`,
    data: { lead_id: leadId, status, name: lead.name }
  };
}

// 3. InsertJobRecord
export async function insertJob(params: any, mode: string, context: any) {
  const validated = insertJobSchema.parse(params);
  const { supabase } = context;
  
  if (mode === 'dry-run') {
    return {
      message: "DRY RUN: Would create job from accepted quote",
      data: validated
    };
  }
  
  // Get lead details
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .select('*')
    .eq('id', validated.lead_id)
    .single();
  
  if (leadError || !lead) {
    throw new APIError('Lead not found', 404, 'NOT_FOUND');
  }
  
  // Create inspection_report (job record)
  const { data: job, error: jobError } = await supabase
    .from('inspection_reports')
    .insert({
      clientName: lead.name,
      phone: lead.phone,
      email: lead.email,
      siteAddress: `${lead.suburb}, VIC`,
      suburbPostcode: lead.suburb,
      status: validated.status.toLowerCase().replace(' ', '_'),
      date: validated.start_date.split('T')[0],
      time: validated.start_date.split('T')[1].split('.')[0],
      inspector: 'Kaidyn Brownlie',
      claddingType: 'Concrete Tiles',
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (jobError) {
    throw new APIError(`Failed to create job: ${jobError.message}`, 500, 'DATABASE_ERROR');
  }
  
  // Update lead to 'won'
  await supabase
    .from('leads')
    .update({ status: 'won', updated_at: new Date().toISOString() })
    .eq('id', validated.lead_id);
  
  return {
    message: `Job created for ${lead.name}`,
    data: { 
      job_id: job.id, 
      lead_id: validated.lead_id,
      client_name: lead.name,
      start_date: validated.start_date
    }
  };
}

// 4. UpdateJobStatus
export async function updateJobStatus(params: any, mode: string, context: any) {
  const { jobId, status, notes } = updateJobStatusSchema.parse(params);
  const { supabase } = context;
  
  if (mode === 'dry-run') {
    return {
      message: `DRY RUN: Would update job ${jobId} to ${status}`,
      data: { jobId, status }
    };
  }
  
  const updateData: any = { 
    status,
    updated_at: new Date().toISOString()
  };
  
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }
  
  if (notes) {
    updateData.overallConditionNotes = notes;
  }
  
  const { data: job, error } = await supabase
    .from('inspection_reports')
    .update(updateData)
    .eq('id', jobId)
    .select()
    .single();
  
  if (error) {
    throw new APIError(`Failed to update job: ${error.message}`, 500, 'DATABASE_ERROR');
  }
  
  // If completed, trigger case study generation
  if (status === 'completed') {
    await supabase.functions.invoke('agent-content-generator', {
      body: { jobId, trigger: 'completion' }
    }).catch(err => console.error('Case study generation failed:', err));
  }
  
  return {
    message: `Job ${job.clientName} updated to: ${status}`,
    data: { job_id: jobId, status, client_name: job.clientName }
  };
}

// 5. UploadInspectionForm
export async function uploadInspection(params: any, mode: string, context: any) {
  const { jobId, formData } = params;
  const { supabase } = context;
  
  if (mode === 'dry-run') {
    return {
      message: "DRY RUN: Would upload inspection form data",
      data: { jobId, fields_count: Object.keys(formData).length }
    };
  }
  
  const { data: inspection, error } = await supabase
    .from('inspection_reports')
    .update({
      ...formData,
      status: 'completed',
      updated_at: new Date().toISOString()
    })
    .eq('id', jobId)
    .select()
    .single();
  
  if (error) {
    throw new APIError(`Failed to upload inspection: ${error.message}`, 500, 'DATABASE_ERROR');
  }
  
  return {
    message: `Inspection form uploaded for ${inspection.clientName}`,
    data: { inspection_id: inspection.id, client_name: inspection.clientName }
  };
}

// 6. FetchJobDetails
export async function fetchJob(params: any, mode: string, context: any) {
  const { jobId } = z.object({ jobId: z.string().uuid() }).parse(params);
  const { supabase } = context;
  
  // Fetch job
  const { data: job, error: jobError } = await supabase
    .from('inspection_reports')
    .select('*')
    .eq('id', jobId)
    .single();
  
  if (jobError || !job) {
    throw new APIError('Job not found', 404, 'NOT_FOUND');
  }
  
  // Fetch related quote
  const { data: quote } = await supabase
    .from('quotes')
    .select('*')
    .eq('inspection_report_id', jobId)
    .single();
  
  // Fetch notes
  const { data: notes } = await supabase
    .from('lead_notes')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);
  
  return {
    message: `Job details retrieved for ${job.clientName}`,
    data: {
      job,
      quote: quote || null,
      recent_notes: notes || []
    }
  };
}

// 7. GenerateQuoteDraft
export async function generateQuote(params: any, mode: string, context: any) {
  const { reportId, tier } = generateQuoteSchema.parse(params);
  const { supabase } = context;
  
  if (mode === 'dry-run') {
    return {
      message: `DRY RUN: Would generate ${tier} quote for inspection ${reportId}`,
      data: { reportId, tier }
    };
  }
  
  // Call existing generate-quote function
  const { data, error } = await supabase.functions.invoke('generate-quote', {
    body: { 
      inspectionReportId: reportId,
      tierLevel: tier
    }
  });
  
  if (error) {
    throw new APIError(`Quote generation failed: ${error.message}`, 500, 'GENERATION_ERROR');
  }
  
  return {
    message: `${tier.charAt(0).toUpperCase() + tier.slice(1)} quote generated`,
    data
  };
}

// 8. SendQuoteToClient
export async function sendQuote(params: any, mode: string, context: any) {
  const { quoteId, email, subject, message } = sendQuoteSchema.parse(params);
  const { supabase } = context;
  
  if (mode === 'dry-run') {
    return {
      message: `DRY RUN: Would email quote ${quoteId} to ${email}`,
      data: { quoteId, email, subject, message }
    };
  }
  
  // Call existing send-quote-email function
  const { data, error } = await supabase.functions.invoke('send-quote-email', {
    body: {
      quoteId,
      recipientEmail: email,
      subject: subject || 'Your Roof Quote from Call Kaids Roofing',
      message: message || 'Please find your detailed quote attached. We look forward to working with you.'
    }
  });
  
  if (error) {
    throw new APIError(`Failed to send quote: ${error.message}`, 500, 'EMAIL_ERROR');
  }
  
  return {
    message: `Quote emailed to ${email}`,
    data
  };
}

// 9. RecordClientResponse
export async function recordResponse(params: any, mode: string, context: any) {
  const schema = z.object({
    quoteId: z.string().uuid(),
    response: z.enum(['accepted', 'declined', 'negotiating']),
    notes: z.string().optional()
  });
  
  const { quoteId, response, notes } = schema.parse(params);
  const { supabase } = context;
  
  if (mode === 'dry-run') {
    return {
      message: `DRY RUN: Would record client ${response} for quote ${quoteId}`,
      data: { quoteId, response }
    };
  }
  
  // Map response to quote status
  const statusMap: Record<string, string> = {
    'accepted': 'accepted',
    'declined': 'rejected',
    'negotiating': 'draft'
  };
  
  const newStatus = statusMap[response];
  
  // Update quote
  const { data: quote, error } = await supabase
    .from('quotes')
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', quoteId)
    .select()
    .single();
  
  if (error) {
    throw new APIError(`Failed to update quote: ${error.message}`, 500, 'DATABASE_ERROR');
  }
  
  // Log to quote history
  await supabase.from('quote_history').insert({
    quote_id: quoteId,
    version_number: 1,
    changes: {
      type: 'client_response',
      response,
      notes,
      timestamp: new Date().toISOString()
    }
  });
  
  // If accepted, auto-create job
  if (response === 'accepted' && quote.inspection_report_id) {
    const jobDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // +7 days
    
    // We need to find the lead_id from the inspection report
    const { data: inspection } = await supabase
      .from('inspection_reports')
      .select('id')
      .eq('id', quote.inspection_report_id)
      .single();
    
    if (inspection) {
      try {
        await insertJob({
          lead_id: quote.inspection_report_id, // Using inspection report id as proxy
          status: 'scheduled',
          start_date: jobDate.toISOString(),
          notes: 'Auto-created from quote acceptance'
        }, 'live', context);
      } catch (err) {
        console.error('Auto job creation failed:', err);
      }
    }
  }
  
  return {
    message: `Client ${response} quote for ${quote.client_name}`,
    data: { quote_id: quoteId, status: newStatus, client_name: quote.client_name }
  };
}

// 10. ArchiveCompletedJob
export async function archiveJob(params: any, mode: string, context: any) {
  const schema = z.object({
    jobId: z.string().uuid(),
    finalNotes: z.string().optional()
  });
  
  const { jobId, finalNotes } = schema.parse(params);
  const { supabase } = context;
  
  if (mode === 'dry-run') {
    return {
      message: `DRY RUN: Would archive job ${jobId}`,
      data: { jobId }
    };
  }
  
  // Update job to archived (using completed status)
  const { data: job, error } = await supabase
    .from('inspection_reports')
    .update({ 
      status: 'completed',
      completed_at: new Date().toISOString(),
      overallConditionNotes: finalNotes || null,
      updated_at: new Date().toISOString()
    })
    .eq('id', jobId)
    .select()
    .single();
  
  if (error) {
    throw new APIError(`Failed to archive job: ${error.message}`, 500, 'DATABASE_ERROR');
  }
  
  // Trigger case study generation
  await supabase.functions.invoke('agent-content-generator', {
    body: { jobId, trigger: 'archive' }
  }).catch(err => console.error('Case study generation failed:', err));
  
  return {
    message: `Job archived: ${job.clientName}`,
    data: { job_id: jobId, archived_at: job.completed_at, client_name: job.clientName }
  };
}
