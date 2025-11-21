import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuoteRequest {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  site_address: string;
  scope: string;
  quote_amount: number;
  pdf_base64?: string; // Optional PDF attachment
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Send quote function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const quoteData: QuoteRequest = await req.json();
    console.log("Received quote data:", { ...quoteData, pdf_base64: quoteData.pdf_base64 ? '[REDACTED]' : undefined });

    // Sanitize data
    const sanitized = {
      customer_name: escapeHtml(quoteData.customer_name.trim()),
      customer_email: escapeHtml(quoteData.customer_email.trim()),
      customer_phone: escapeHtml(quoteData.customer_phone.trim()),
      site_address: escapeHtml(quoteData.site_address.trim()),
      scope: escapeHtml(quoteData.scope.trim()),
      quote_amount: quoteData.quote_amount,
    };

    // Format currency for Australian dollars
    const formattedAmount = new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(sanitized.quote_amount);

    // Prepare email attachments if PDF provided
    const attachments = quoteData.pdf_base64 ? [{
      filename: `CKR-Quote-${sanitized.customer_name.replace(/\s/g, '-')}.pdf`,
      content: quoteData.pdf_base64,
    }] : [];

    // Send quote email to customer
    const customerEmailResponse = await resend.emails.send({
      from: "Call Kaids Roofing <onboarding@resend.dev>",
      to: [sanitized.customer_email],
      subject: `Your Roofing Quote - ${formattedAmount}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; padding: 30px 20px; background: linear-gradient(135deg, #007ACC, #0B3B69);">
            <h1 style="color: white; margin: 0; font-size: 28px;">Call Kaids Roofing</h1>
            <p style="color: white; margin: 10px 0 0 0; font-style: italic;">Proof In Every Roof</p>
          </div>

          <div style="padding: 40px 30px;">
            <h2 style="color: #0B3B69; margin-top: 0;">Hi ${sanitized.customer_name},</h2>
            
            <p style="font-size: 16px; line-height: 1.6;">Thank you for your enquiry. We're pleased to provide you with the following quote for your roofing project at <strong>${sanitized.site_address}</strong>.</p>

            <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #007ACC;">
              <div style="text-align: center;">
                <div style="font-size: 14px; color: #6B7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Quote Amount</div>
                <div style="font-size: 48px; font-weight: bold; color: #007ACC; margin: 0;">${formattedAmount}</div>
                <div style="font-size: 14px; color: #6B7280; margin-top: 10px;">Including GST</div>
              </div>
            </div>

            <div style="background-color: #f7f8fa; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #0B3B69; margin-top: 0; font-size: 18px;">Scope of Work</h3>
              <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${sanitized.scope}</p>
            </div>

            <div style="background-color: #007ACC; color: white; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; font-size: 18px;">What's Included:</h3>
              <ul style="margin: 10px 0; padding-left: 20px; line-height: 1.8;">
                <li>All materials and labour</li>
                <li>Professional workmanship</li>
                <li>Site cleanup upon completion</li>
                <li>7-10 year workmanship warranty</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="font-size: 16px; margin-bottom: 15px;">Ready to proceed?</p>
              <a href="tel:0435900709" style="display: inline-block; background: linear-gradient(135deg, #007ACC, #0B3B69); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Call 0435 900 709</a>
            </div>

            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">This quote is valid for 30 days. Final pricing may vary depending on site conditions discovered during work.</p>
          </div>

          <div style="border-top: 2px solid #e5e7eb; padding: 25px 30px; background-color: #f9fafb;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #0B3B69;">Call Kaids Roofing</p>
            <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">ABN: 39475055075</p>
            <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">Phone: <a href="tel:0435900709" style="color: #007ACC;">0435 900 709</a></p>
            <p style="margin: 5px 0; color: #6B7280; font-size: 14px;">Email: <a href="mailto:info@callkaidsroofing.com.au" style="color: #007ACC;">info@callkaidsroofing.com.au</a></p>
          </div>
        </div>
      `,
      attachments,
    });

    console.log("Quote email sent to customer:", customerEmailResponse);

    // First, create or find lead in CRM
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('phone', sanitized.customer_phone)
      .single();

    let leadId = existingLead?.id;

    if (!existingLead) {
      const { data: newLead, error: leadError } = await supabase
        .from('leads')
        .insert({
          name: sanitized.customer_name,
          phone: sanitized.customer_phone,
          email: sanitized.customer_email,
          suburb: sanitized.site_address.split(',')[1]?.trim() || sanitized.site_address,
          service: 'Quote Request',
          status: 'contacted',
          source: 'quick_quote_tool',
        })
        .select()
        .single();

      if (leadError) {
        console.error("Error creating lead:", leadError);
      } else {
        leadId = newLead.id;
        console.log("Lead created in CRM with ID:", leadId);
      }
    } else {
      console.log("Using existing lead ID:", leadId);
    }

    // Create quote record in CRM
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        lead_id: leadId,
        total_amount: sanitized.quote_amount,
        status: 'sent',
        notes: sanitized.scope,
      })
      .select()
      .single();

    if (quoteError) {
      console.error("Error creating quote:", quoteError);
    } else {
      console.log("Quote saved to CRM with ID:", quote.id);
    }

    // Store in jobs table
    const { data: job, error: insertError } = await supabase
      .from('jobs')
      .insert({
        customer_name: sanitized.customer_name,
        customer_email: sanitized.customer_email,
        customer_phone: sanitized.customer_phone,
        site_address: sanitized.site_address,
        scope: sanitized.scope,
        quote_amount: sanitized.quote_amount,
        quote_sent_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting job:", insertError);
      throw insertError;
    }

    console.log("Job record created:", job.id);

    // Send notification to business owner
    await resend.emails.send({
      from: "Call Kaids Roofing <onboarding@resend.dev>",
      to: ["info@callkaidsroofing.com.au"],
      subject: `✅ Quote Sent: ${formattedAmount} - ${sanitized.customer_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007ACC;">Quote Successfully Sent</h2>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0B3B69; margin-top: 0;">Customer Details</h3>
            <p><strong>Name:</strong> ${sanitized.customer_name}</p>
            <p><strong>Email:</strong> ${sanitized.customer_email}</p>
            <p><strong>Phone:</strong> <a href="tel:${sanitized.customer_phone}">${sanitized.customer_phone}</a></p>
            <p><strong>Address:</strong> ${sanitized.site_address}</p>
          </div>

          <div style="background-color: #f7f8fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0B3B69; margin-top: 0;">Quote Details</h3>
            <p><strong>Amount:</strong> ${formattedAmount}</p>
            <p><strong>Scope:</strong><br>${sanitized.scope.replace(/\n/g, '<br>')}</p>
          </div>

          <div style="background-color: #007ACC; color: white; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0;">Job ID: ${job.id}<br>Sent: ${new Date().toLocaleString('en-AU')}</p>
          </div>
        </div>
      `,
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        job_id: job.id,
        message: "Quote sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: unknown) {
    console.error("Error in send-quote function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send quote",
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
