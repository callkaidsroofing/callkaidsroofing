import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

interface LeadNotificationRequest {
  name: string;
  phone: string;
  email?: string;
  suburb: string;
  service: string;
  message?: string;
  urgency?: string;
  source?: string;
}

// Input validation and sanitization
function validateInput(data: LeadNotificationRequest): string | null {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return 'Name is required';
  }
  
  if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
    return 'Phone is required';
  }
  
  if (!data.suburb || typeof data.suburb !== 'string' || data.suburb.trim().length === 0) {
    return 'Suburb is required';
  }
  
  if (!data.service || typeof data.service !== 'string' || data.service.trim().length === 0) {
    return 'Service is required';
  }
  
  // Validate email format if provided
  if (data.email && data.email.trim().length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return 'Invalid email format';
    }
  }
  
  return null;
}

// HTML escape function to prevent XSS
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

    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    console.log('Client IP for rate limiting:', clientIP);
    
    const now = new Date();
    const windowStart = new Date(now.getTime() - RATE_LIMIT_WINDOW);
    
    // Clean up old entries and check current rate
    await supabase.rpc('cleanup_rate_limits');
    
    const { data: existingRequests, error: rateLimitError } = await supabase
      .from('rate_limits')
      .select('request_count')
      .eq('identifier', clientIP)
      .gte('window_start', windowStart.toISOString())
      .single();
    
    if (rateLimitError && rateLimitError.code !== 'PGRST116') {
      console.error('Rate limit check error:', rateLimitError);
    }
    
    if (existingRequests && existingRequests.request_count >= RATE_LIMIT_MAX_REQUESTS) {
      console.log('Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Update or insert rate limit entry
    if (existingRequests) {
      await supabase
        .from('rate_limits')
        .update({ request_count: existingRequests.request_count + 1 })
        .eq('identifier', clientIP)
        .gte('window_start', windowStart.toISOString());
    } else {
      await supabase
        .from('rate_limits')
        .insert({
          identifier: clientIP,
          request_count: 1,
          window_start: now.toISOString()
        });
    }

    const leadData: LeadNotificationRequest = await req.json();
    console.log("Received lead data:", leadData);

    // Validate input
    const validationError = validateInput(leadData);
    if (validationError) {
      console.error("Validation error:", validationError);
      return new Response(
        JSON.stringify({ error: validationError }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Additional security checks for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:text\/html/i,
      /vbscript:/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /onload=/i,
      /onclick=/i,
      /onerror=/i
    ];

    const textToCheck = `${leadData.name} ${leadData.message || ''} ${leadData.email || ''}`;
    if (suspiciousPatterns.some(pattern => pattern.test(textToCheck))) {
      console.warn('Suspicious content detected:', { 
        ip: clientIP, 
        data: { ...leadData, message: '[REDACTED]' } 
      });
      return new Response(
        JSON.stringify({ error: 'Invalid content detected' }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders }
        }
      );
    }

    // Sanitize data for email content
    const sanitizedData = {
      name: escapeHtml(leadData.name.trim()),
      phone: escapeHtml(leadData.phone.trim()),
      email: leadData.email ? escapeHtml(leadData.email.trim()) : '',
      suburb: escapeHtml(leadData.suburb.trim()),
      service: escapeHtml(leadData.service.trim()),
      message: leadData.message ? escapeHtml(leadData.message.trim()) : '',
      urgency: leadData.urgency ? escapeHtml(leadData.urgency.trim()) : '',
      source: leadData.source || 'website'
    };

    // Generate a unique lead reference for tracking
    const leadReference = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    const submittedAt = new Date().toISOString();

    console.log("Processing lead (not storing in database):", { leadReference, name: sanitizedData.name, service: sanitizedData.service });

    // Send notification email to business owner (using sanitized data)
    const ownerEmailResponse = await resend.emails.send({
      from: "Call Kaids Roofing <onboarding@resend.dev>",
      to: ["info@callkaidsroofing.com.au"],
      subject: `🏠 New Lead: ${sanitizedData.service} - ${sanitizedData.name}${sanitizedData.urgency ? ` (${sanitizedData.urgency})` : ''}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007ACC; border-bottom: 2px solid #007ACC; padding-bottom: 10px;">
            New Lead Received
          </h2>
          
          <div style="background-color: #f7f8fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0B3B69; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${sanitizedData.name}</p>
            <p><strong>Phone:</strong> <a href="tel:${sanitizedData.phone}">${sanitizedData.phone}</a></p>
            ${sanitizedData.email ? `<p><strong>Email:</strong> <a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></p>` : ''}
            <p><strong>Suburb:</strong> ${sanitizedData.suburb}</p>
          </div>

          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0B3B69; margin-top: 0;">Service Request</h3>
            <p><strong>Service:</strong> ${sanitizedData.service}</p>
            ${sanitizedData.urgency ? `<p><strong>Urgency:</strong> <span style="color: ${sanitizedData.urgency === 'Emergency' ? '#dc3545' : '#ffc107'}; font-weight: bold;">${sanitizedData.urgency}</span></p>` : ''}
            ${sanitizedData.message ? `<p><strong>Message:</strong><br>${sanitizedData.message.replace(/\n/g, '<br>')}</p>` : ''}
          </div>

          <div style="background-color: #007ACC; color: white; padding: 15px; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-weight: bold;">
              Lead Reference: ${leadReference}<br>
              Submitted: ${new Date(submittedAt).toLocaleString('en-AU')}<br>
              Source: ${sanitizedData.source}
            </p>
          </div>

          <div style="background-color: #007ACC; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 20px;">
            <p style="margin: 0;"><strong>Follow up ASAP to secure this lead!</strong></p>
          </div>

          <p style="color: #6B7280; font-size: 14px; margin-top: 20px;">
            This lead was automatically captured from your website contact form.
          </p>
        </div>
      `,
    });

    console.log("Owner notification sent:", ownerEmailResponse);

    // Send auto-response to customer (if email provided) - using sanitized data
    if (sanitizedData.email) {
      const customerEmailResponse = await resend.emails.send({
        from: "Call Kaids Roofing <onboarding@resend.dev>",
        to: [sanitizedData.email],
        subject: "Thank you for your roofing enquiry - Call Kaids Roofing",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="text-align: center; padding: 20px; background-color: #007ACC;">
              <h1 style="color: white; margin: 0;">Call Kaids Roofing</h1>
              <p style="color: white; margin: 5px 0;">Professional Roofing, Melbourne Style</p>
            </div>

            <div style="padding: 30px 20px;">
              <h2 style="color: #0B3B69;">Thank you for your enquiry, ${sanitizedData.name}!</h2>
              
              <p>We've received your request for <strong>${sanitizedData.service}</strong> in ${sanitizedData.suburb} and will get back to you as soon as possible.</p>

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
        leadReference: leadReference,
        message: "Lead notification sent successfully" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: unknown) {
    console.error("Error in send-lead-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to process lead notification",
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