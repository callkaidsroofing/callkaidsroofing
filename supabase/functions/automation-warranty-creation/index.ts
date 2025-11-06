/**
 * Automated Warranty Creation
 * 
 * Per MKF Requirements:
 * - On job_completed → create warranty record (7-10 years)
 * - Schedule check-in task at T+180 days
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

    const { inspectionReportId, warrantyYears } = await req.json();

    if (!inspectionReportId) {
      return new Response(
        JSON.stringify({ error: 'inspectionReportId required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const years = warrantyYears || 10; // Default 10 years
    console.log(`[Automation] Creating ${years}-year warranty for inspection ${inspectionReportId}`);

    // Fetch inspection details
    const { data: inspection, error: inspectionError } = await supabase
      .from('inspection_reports')
      .select('*, lead_id')
      .eq('id', inspectionReportId)
      .single();

    if (inspectionError || !inspection) {
      throw new Error(`Inspection not found: ${inspectionReportId}`);
    }

    const now = new Date();
    const expiryDate = new Date(now);
    expiryDate.setFullYear(expiryDate.getFullYear() + years);

    const checkInDate = new Date(now);
    checkInDate.setDate(checkInDate.getDate() + 180); // T+180 days (6 months)

    // Check if warranty already exists
    const { data: existing } = await supabase
      .from('warranties')
      .select('id')
      .eq('inspection_report_id', inspectionReportId)
      .single();

    if (existing) {
      console.log(`[Automation] Warranty already exists for inspection ${inspectionReportId}`);
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Warranty already exists',
          warranty_id: existing.id,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create warranty record
    const { data: warranty, error: warrantyError } = await supabase
      .from('warranties')
      .insert({
        inspection_report_id: inspectionReportId,
        lead_id: inspection.lead_id,
        warranty_period_years: years,
        start_date: now.toISOString(),
        expiry_date: expiryDate.toISOString(),
        status: 'active',
        terms: `${years}-Year Workmanship Warranty\n\nCall Kaids Roofing guarantees all work for ${years} years from completion date.\n\nABN: 39475055075\nPhone: 0435 900 709\nEmail: callkaidsroofing@outlook.com`,
      })
      .select()
      .single();

    if (warrantyError) {
      throw new Error(`Failed to create warranty: ${warrantyError.message}`);
    }

    // Create 6-month check-in task
    const { error: taskError } = await supabase.from('tasks').insert({
      lead_id: inspection.lead_id,
      title: 'Warranty check-in',
      description: `6-month follow-up on completed job (Warranty #${warranty.id})`,
      due_date: checkInDate.toISOString(),
      priority: 'low',
      status: 'pending',
      created_by: 'automation',
    });

    if (taskError) {
      console.error('[Automation] Failed to create check-in task:', taskError);
    }

    // Log activity
    const { error: activityError } = await supabase.from('activities').insert({
      lead_id: inspection.lead_id,
      type: 'system',
      description: `${years}-year warranty created. Expires ${expiryDate.toLocaleDateString('en-AU', { timeZone: 'Australia/Melbourne' })}`,
      metadata: {
        automation: 'warranty_creation',
        warranty_id: warranty.id,
        expiry_date: expiryDate.toISOString(),
        check_in_date: checkInDate.toISOString(),
      },
    });

    if (activityError) {
      console.error('[Automation] Failed to log activity:', activityError);
    }

    // Audit log
    await supabase.from('system_audit').insert({
      event_type: 'automation',
      action: 'warranty_created',
      resource_type: 'warranties',
      resource_id: warranty.id,
      details: {
        inspection_report_id: inspectionReportId,
        lead_id: inspection.lead_id,
        warranty_years: years,
        expiry_date: expiryDate.toISOString(),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        warranty_id: warranty.id,
        warranty_years: years,
        expiry_date: expiryDate.toISOString(),
        check_in_date: checkInDate.toISOString(),
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
