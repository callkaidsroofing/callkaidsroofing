import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadData {
  name: string;
  phone: string;
  email?: string;
  suburb: string;
  service: string;
  message?: string;
  urgency?: string;
  source?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Lead notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const leadData: LeadData = await req.json();
    console.log("Received lead data:", leadData);

    // Save lead to database
    const { data: lead, error: dbError } = await supabase
      .from("leads")
      .insert([{
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email || null,
        suburb: leadData.suburb,
        service: leadData.service,
        message: leadData.message || null,
        urgency: leadData.urgency || null,
        source: leadData.source || 'website'
      }])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    console.log("Lead saved to database:", lead);

    // Send notification email to business owner
    const ownerEmailResponse = await resend.emails.send({
      from: "Call Kaids Roofing <noreply@callkaidsroofing.com.au>",
      to: ["callkaidsroofing@outlook.com"],
      subject: `🏠 New Lead: ${leadData.service} - ${leadData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007ACC; border-bottom: 2px solid #007ACC; padding-bottom: 10px;">
            New Lead Received
          </h2>
          
          <div style="background-color: #f7f8fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0B3B69; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${leadData.name}</p>
            <p><strong>Phone:</strong> <a href="tel:${leadData.phone}">${leadData.phone}</a></p>
            ${leadData.email ? `<p><strong>Email:</strong> <a href="mailto:${leadData.email}">${leadData.email}</a></p>` : ''}
            <p><strong>Suburb:</strong> ${leadData.suburb}</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0B3B69; margin-top: 0;">Service Request</h3>
            <p><strong>Service:</strong> ${leadData.service}</p>
            ${leadData.urgency ? `<p><strong>Urgency:</strong> <span style="color: #dc2626; font-weight: bold;">${leadData.urgency}</span></p>` : ''}
            ${leadData.message ? `<p><strong>Message:</strong><br>${leadData.message}</p>` : ''}
          </div>

          <div style="background-color: #007ACC; color: white; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-weight: bold;">
              Lead ID: ${lead.id}<br>
              Submitted: ${new Date(lead.created_at).toLocaleString('en-AU')}
            </p>
          </div>

          <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
            This lead was automatically captured from your website contact form.
          </p>
        </div>
      `,
    });

    console.log("Owner notification sent:", ownerEmailResponse);

    // Send auto-response to customer (if email provided)
    if (leadData.email) {
      const customerEmailResponse = await resend.emails.send({
        from: "Call Kaids Roofing <noreply@callkaidsroofing.com.au>",
        to: [leadData.email],
        subject: "Thank you for your roofing enquiry - Call Kaids Roofing",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px; background-color: #007ACC;">
              <h1 style="color: white; margin: 0;">Call Kaids Roofing</h1>
              <p style="color: white; margin: 5px 0;">Professional Roofing, Melbourne Style</p>
            </div>

            <div style="padding: 30px 20px;">
              <h2 style="color: #0B3B69;">Thank you for your enquiry, ${leadData.name}!</h2>
              
              <p>We've received your request for <strong>${leadData.service}</strong> in ${leadData.suburb} and will get back to you as soon as possible.</p>

              <div style="background-color: #f7f8fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #007ACC; margin-top: 0;">What happens next?</h3>
                <ul style="line-height: 1.6;">
                  <li>We'll review your enquiry and contact you within 24 hours</li>
                  <li>We'll discuss your specific needs and provide expert advice</li>
                  <li>If suitable, we'll arrange a free inspection and quote</li>
                  <li>All work comes with our 7-10 year workmanship warranty</li>
                </ul>
              </div>

              <div style="background-color: #dc2626; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h3 style="margin: 0; margin-bottom: 10px;">Emergency Repairs?</h3>
                <p style="margin: 0;">Call Kaidyn directly: <a href="tel:0435900709" style="color: white; font-weight: bold;">0435 900 709</a></p>
              </div>

              <p>Thanks for choosing Call Kaids Roofing - your local roofing specialists!</p>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6B7280; font-size: 14px;">
                <p><strong>Call Kaids Roofing</strong><br>
                ABN: 39475055075<br>
                Phone: <a href="tel:0435900709">0435 900 709</a><br>
                Email: <a href="mailto:callkaidsroofing@outlook.com">callkaidsroofing@outlook.com</a></p>
              </div>
            </div>
          </div>
        `,
      });

      console.log("Customer auto-response sent:", customerEmailResponse);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        leadId: lead.id,
        message: "Lead captured and notifications sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
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