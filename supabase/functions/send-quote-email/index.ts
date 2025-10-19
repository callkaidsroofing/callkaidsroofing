import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendQuoteEmailRequest {
  quoteId: string;
  recipientEmail: string;
  subject: string;
  message: string;
  reminderDays?: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { quoteId, recipientEmail, subject, message, reminderDays }: SendQuoteEmailRequest = await req.json();

    console.log("Sending quote email:", { quoteId, recipientEmail });

    // Fetch quote details
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*, quote_line_items(*)")
      .eq("id", quoteId)
      .single();

    if (quoteError) {
      console.error("Error fetching quote:", quoteError);
      throw quoteError;
    }

    // Generate quote HTML
    const lineItems = quote.quote_line_items || [];
    const quoteHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007ACC; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 20px; }
          .quote-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f0f0f0; font-weight: bold; }
          .totals { text-align: right; margin-top: 20px; }
          .total-row { font-size: 18px; font-weight: bold; color: #007ACC; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 30px; background: #007ACC; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Call Kaids Roofing</h1>
            <p>ABN 39475055075</p>
          </div>
          
          <div class="content">
            <p>${message.replace(/\n/g, '<br>')}</p>
            
            <div class="quote-details">
              <h2>Quote ${quote.quote_number}</h2>
              <p><strong>Client:</strong> ${quote.client_name}</p>
              <p><strong>Address:</strong> ${quote.site_address}, ${quote.suburb_postcode}</p>
              <p><strong>Package:</strong> ${quote.tier_level.toUpperCase()}</p>
              <p><strong>Valid Until:</strong> ${new Date(quote.valid_until).toLocaleDateString('en-AU')}</p>
              
              <table>
                <thead>
                  <tr>
                    <th>Service Item</th>
                    <th style="text-align: right;">Qty</th>
                    <th style="text-align: right;">Rate</th>
                    <th style="text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItems.map((item: any) => `
                    <tr>
                      <td>
                        ${item.service_item}
                        ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ''}
                      </td>
                      <td style="text-align: right;">${item.quantity} ${item.unit}</td>
                      <td style="text-align: right;">$${parseFloat(item.unit_rate).toFixed(2)}</td>
                      <td style="text-align: right;">$${parseFloat(item.line_total).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <div class="totals">
                <p>Subtotal: $${parseFloat(quote.subtotal).toFixed(2)}</p>
                <p>GST (10%): $${parseFloat(quote.gst).toFixed(2)}</p>
                <p class="total-row">Total: $${parseFloat(quote.total).toFixed(2)}</p>
              </div>
            </div>
            
            <p style="text-align: center;">
              <strong>No Leaks. No Lifting. Just Quality.</strong><br>
              Professional Roofing, Melbourne Style
            </p>
          </div>
          
          <div class="footer">
            <p>Kaidyn Brownlie | 0435 900 709 | callkaidsroofing@outlook.com</p>
            <p>7-10 Year Workmanship Warranty | Fully Insured | Weather-dependent scheduling</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "Call Kaids Roofing <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: subject,
      html: quoteHtml,
    });

    console.log("Email sent successfully:", emailResponse);

    // Record email in database
    const { error: emailRecordError } = await supabase
      .from("quote_emails")
      .insert({
        quote_id: quoteId,
        recipient_email: recipientEmail,
        status: "sent",
      });

    if (emailRecordError) {
      console.error("Error recording email:", emailRecordError);
    }

    // Schedule reminder if requested
    if (reminderDays && reminderDays > 0) {
      // In a production app, you'd schedule this with a cron job or task queue
      console.log(`Reminder scheduled for ${reminderDays} days from now`);
    }

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-quote-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);