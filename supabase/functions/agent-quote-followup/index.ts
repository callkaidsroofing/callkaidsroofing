import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

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
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Agent Quote Follow-up] Starting...');

    // Find quotes needing follow-up (sent 3+ days ago, not viewed, no reminder sent)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: quoteEmails, error: emailsError } = await supabase
      .from('quote_emails')
      .select('*, quotes(*)')
      .lt('sent_at', threeDaysAgo)
      .is('viewed_at', null)
      .is('reminder_sent_at', null)
      .eq('status', 'sent');

    if (emailsError) throw emailsError;

    if (!quoteEmails || quoteEmails.length === 0) {
      console.log('[Agent Quote Follow-up] No quotes need follow-up');
      return new Response(JSON.stringify({ sent: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[Agent Quote Follow-up] Processing ${quoteEmails.length} quotes`);

    const results = [];

    for (const quoteEmail of quoteEmails) {
      try {
        const quote = quoteEmail.quotes;

        // Generate personalized follow-up email using AI
        const emailResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You are writing a follow-up email for Call Kaids Roofing (ABN 39475055075).

Tone: Professional, friendly, helpful (not pushy)
Brand voice: Down-to-earth tradie who educates
Slogan: "No Leaks. No Lifting. Just Quality."

Write a personalized follow-up email (2-3 paragraphs max) that:
- References their specific services quoted
- Offers to answer questions
- Mentions 7-10 year workmanship warranty
- Includes a soft CTA to book or discuss

Sign off: "Kaidyn Brownlie | 0435 900 709 | callkaidsroofing@outlook.com"`
              },
              {
                role: 'user',
                content: `Client: ${quote.client_name}
Services: ${quote.tier_level} tier quote
Total: $${quote.total}
Address: ${quote.site_address}, ${quote.suburb_postcode}
Quote sent: ${new Date(quoteEmail.sent_at).toLocaleDateString()}

Write a follow-up email:`
              }
            ]
          }),
        });

        const emailData = await emailResponse.json();
        const emailContent = emailData.choices[0].message.content;

        // Send email via Resend (if configured)
        if (resendApiKey && quote.email) {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Call Kaids Roofing <onboarding@resend.dev>',
              to: [quote.email],
              subject: `Following up: Your ${quote.tier_level} roofing quote`,
              html: `
                <p>Hi ${quote.client_name},</p>
                ${emailContent.replace(/\n/g, '<br>')}
                <br><br>
                <p><strong>Quote #${quote.quote_number}</strong><br>
                Total: $${quote.total} (inc GST)<br>
                Valid until: ${new Date(quote.valid_until).toLocaleDateString()}</p>
              `,
            }),
          });

          if (!resendResponse.ok) {
            console.error('Resend error:', await resendResponse.text());
          }
        }

        // Update quote_emails
        await supabase
          .from('quote_emails')
          .update({ reminder_sent_at: new Date().toISOString() })
          .eq('id', quoteEmail.id);

        // Check if quote is 7+ days old with no response -> mark lead as cold
        if (new Date(quoteEmail.sent_at) < new Date(sevenDaysAgo)) {
          const { data: lead } = await supabase
            .from('leads')
            .select('id')
            .or(`phone.eq.${quote.phone},email.eq.${quote.email}`)
            .single();

          if (lead) {
            await supabase
              .from('leads')
              .update({ status: 'cold_followup' })
              .eq('id', lead.id);
          }
        }

        results.push({
          quoteNumber: quote.quote_number,
          clientName: quote.client_name,
          sent: !!resendApiKey,
        });

        console.log(`[Agent Quote Follow-up] Sent reminder for quote ${quote.quote_number}`);

      } catch (error: any) {
        console.error(`[Agent Quote Follow-up] Error processing quote ${quoteEmail.id}:`, error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: results.length, results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('[Agent Quote Follow-up] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
