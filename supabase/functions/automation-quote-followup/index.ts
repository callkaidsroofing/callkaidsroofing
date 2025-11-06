/**
 * Automated Quote Follow-up
 * 
 * Per MKF Requirements:
 * - On quote_sent → create task at T+3 days
 * - Schedule drip email at T+7 days
 * - Log all actions to activities table
 * 
 * Triggered by: Database trigger or cron job
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { quoteId } = await req.json();

    if (!quoteId) {
      return new Response(
        JSON.stringify({ error: 'quoteId required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`[Automation] Processing quote follow-up for quote ${quoteId}`);

    // Fetch quote details
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .select('*, inspection_reports(lead_id)')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      throw new Error(`Quote not found: ${quoteId}`);
    }

    const leadId = quote.inspection_reports?.lead_id;
    if (!leadId) {
      throw new Error(`No lead associated with quote ${quoteId}`);
    }

    const now = new Date();
    const followupDate = new Date(now);
    followupDate.setDate(followupDate.getDate() + 3); // T+3 days

    const dripDate = new Date(now);
    dripDate.setDate(dripDate.getDate() + 7); // T+7 days

    // Create follow-up task (T+3d)
    const { error: taskError } = await supabase.from('tasks').insert({
      lead_id: leadId,
      title: 'Follow up on quote',
      description: `Follow up with client regarding quote ${quote.quote_number}`,
      due_date: followupDate.toISOString(),
      priority: 'medium',
      status: 'pending',
      created_by: 'automation',
    });

    if (taskError) {
      console.error('[Automation] Failed to create task:', taskError);
    }

    // Schedule drip email (T+7d)
    // Note: Actual email sending would be handled by another cron job
    const { error: activityError } = await supabase.from('activities').insert({
      lead_id: leadId,
      type: 'note',
      description: `Automated drip email scheduled for ${dripDate.toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne' })}`,
      metadata: {
        automation: 'quote_followup',
        quote_id: quoteId,
        scheduled_date: dripDate.toISOString(),
        action: 'drip_email',
      },
    });

    if (activityError) {
      console.error('[Automation] Failed to log activity:', activityError);
    }

    // Log automation execution
    const { error: auditError } = await supabase.from('system_audit').insert({
      event_type: 'automation',
      action: 'quote_followup_scheduled',
      resource_type: 'quotes',
      resource_id: quoteId,
      details: {
        lead_id: leadId,
        followup_date: followupDate.toISOString(),
        drip_date: dripDate.toISOString(),
      },
    });

    if (auditError) {
      console.error('[Automation] Failed to audit:', auditError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        quote_id: quoteId,
        lead_id: leadId,
        followup_task_date: followupDate.toISOString(),
        drip_email_date: dripDate.toISOString(),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('[Automation] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
