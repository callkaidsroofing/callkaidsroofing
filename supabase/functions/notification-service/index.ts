import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NotificationRequest {
  type: 'lead_notification' | 'quote_sent' | 'quote_followup';
  leadId?: string;
  quoteId?: string;
  leadEmail?: string;
  leadPhone?: string;
  template?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: NotificationRequest = await req.json();
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('[Notification Service] Processing:', body.type);

    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      console.warn('[Notification Service] Resend API key not configured');
      return new Response(
        JSON.stringify({ accepted: true, message: 'Email skipped (no API key)' }),
        { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let emailData: any = null;

    // Lead notification
    if (body.type === 'lead_notification' && body.leadId) {
      const { data: lead } = await supabase
        .from('leads')
        .select('*')
        .eq('id', body.leadId)
        .single();

      if (lead) {
        emailData = {
          from: 'Call Kaids Roofing <no-reply@callkaidsroofing.com.au>',
          to: 'callkaidsroofing@outlook.com',
          subject: `🏠 New Lead: ${lead.name} - ${lead.service}`,
          html: `
            <h2>New Lead Received</h2>
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Phone:</strong> ${lead.phone}</p>
            <p><strong>Email:</strong> ${lead.email || 'Not provided'}</p>
            <p><strong>Service:</strong> ${lead.service}</p>
            <p><strong>Suburb:</strong> ${lead.suburb}</p>
            <p><strong>Message:</strong> ${lead.message || 'No message'}</p>
            <p><strong>AI Score:</strong> ${lead.ai_score || 'Not scored yet'}</p>
            <br/>
            <p><a href="https://callkaidsroofing.com.au/internal/leads">View in CRM</a></p>
          `
        };
      }
    }

    // Quote sent notification
    if (body.type === 'quote_sent' && body.quoteId) {
      const { data: quote } = await supabase
        .from('quotes')
        .select('*, leads(*)')
        .eq('id', body.quoteId)
        .single();

      if (quote && quote.leads?.email) {
        emailData = {
          from: 'Call Kaids Roofing <no-reply@callkaidsroofing.com.au>',
          to: quote.leads.email,
          subject: `Your Roofing Quote from Call Kaids Roofing`,
          html: `
            <h2>Thanks for choosing Call Kaids Roofing!</h2>
            <p>Hi ${quote.leads.name},</p>
            <p>Your quote is ready. Please find the details below:</p>
            <p><strong>Quote Number:</strong> ${quote.quote_number}</p>
            <p><strong>Total:</strong> $${quote.total}</p>
            <br/>
            <p>If you have any questions, call us at <strong>0435 900 709</strong></p>
            <p>Best regards,<br/>Kaidyn Brownlie<br/>Call Kaids Roofing</p>
          `
        };
      }
    }

    // Quote followup
    if (body.type === 'quote_followup' && body.quoteId) {
      const { data: quote } = await supabase
        .from('quotes')
        .select('*, leads(*)')
        .eq('id', body.quoteId)
        .single();

      if (quote && quote.leads?.email) {
        emailData = {
          from: 'Call Kaids Roofing <no-reply@callkaidsroofing.com.au>',
          to: quote.leads.email,
          subject: `Following up on your roofing quote`,
          html: `
            <h2>Just checking in...</h2>
            <p>Hi ${quote.leads.name},</p>
            <p>We wanted to follow up on the quote we sent you a few days ago.</p>
            <p>Do you have any questions about the work or pricing?</p>
            <p>Give us a call at <strong>0435 900 709</strong> and we'll be happy to help.</p>
            <p>Best regards,<br/>Kaidyn Brownlie<br/>Call Kaids Roofing</p>
          `
        };
      }
    }

    // Send email via Resend
    if (emailData) {
      const resendRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      const resendData = await resendRes.json();

      if (!resendRes.ok) {
        console.error('[Notification Service] Resend error:', resendData);
        throw new Error('Failed to send email');
      }

      console.log('[Notification Service] Email sent:', resendData.id);

      return new Response(
        JSON.stringify({ accepted: true, emailId: resendData.id }),
        { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ accepted: true, message: 'No email to send' }),
      { status: 202, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Notification Service] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
