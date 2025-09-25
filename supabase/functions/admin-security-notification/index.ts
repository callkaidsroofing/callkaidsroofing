import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdminSecurityEvent {
  event_type: string;
  user_id: string;
  user_email: string;
  event_details: any;
  timestamp: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Admin security notification function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const eventData: AdminSecurityEvent = await req.json();
    console.log("Received security event:", eventData);

    // Only send notifications for critical security events
    const criticalEvents = [
      'ADMIN_CREATED',
      'ADMIN_CREATION_BLOCKED', 
      'SUSPICIOUS_LOGIN_ATTEMPT',
      'MULTIPLE_FAILED_LOGINS'
    ];

    if (!criticalEvents.includes(eventData.event_type)) {
      return new Response(
        JSON.stringify({ success: true, message: "Event logged but not critical" }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Get email subject and content based on event type
    let subject = "";
    let alertType = "";
    let alertColor = "#dc3545"; // Default red for security alerts

    switch (eventData.event_type) {
      case 'ADMIN_CREATED':
        subject = "🔐 Security Alert: New Admin Account Created";
        alertType = "Admin Account Created";
        alertColor = "#28a745"; // Green for successful creation
        break;
      case 'ADMIN_CREATION_BLOCKED':
        subject = "🚨 Security Alert: Admin Creation Attempt Blocked";
        alertType = "Unauthorized Admin Creation Attempt";
        break;
      case 'SUSPICIOUS_LOGIN_ATTEMPT':
        subject = "⚠️ Security Alert: Suspicious Login Activity";
        alertType = "Suspicious Login Activity";
        alertColor = "#ffc107"; // Yellow for warning
        break;
      case 'MULTIPLE_FAILED_LOGINS':
        subject = "🚨 Security Alert: Multiple Failed Login Attempts";
        alertType = "Multiple Failed Logins";
        break;
      default:
        subject = "🔐 Security Alert: System Event";
        alertType = "Security Event";
    }

    // Send security notification email
    const securityEmailResponse = await resend.emails.send({
      from: "Call Kaids Security <security@callkaidsroofing.com.au>",
      to: ["callkaidsroofing@outlook.com"],
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: ${alertColor}; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Security Alert</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px;">${alertType}</p>
          </div>
          
          <div style="padding: 30px 20px; background-color: #f8f9fa;">
            <h2 style="color: #0B3B69; margin-top: 0;">Event Details</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${alertColor};">
              <p><strong>Event Type:</strong> ${eventData.event_type}</p>
              <p><strong>User Email:</strong> ${eventData.user_email || 'Unknown'}</p>
              <p><strong>User ID:</strong> ${eventData.user_id || 'Unknown'}</p>
              <p><strong>Timestamp:</strong> ${new Date(eventData.timestamp).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })}</p>
              
              ${eventData.event_details ? `
                <div style="margin-top: 15px;">
                  <strong>Additional Details:</strong>
                  <pre style="background-color: #f8f9fa; padding: 10px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(eventData.event_details, null, 2)}</pre>
                </div>
              ` : ''}
            </div>

            ${eventData.event_type === 'ADMIN_CREATED' ? `
              <div style="background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #155724;">✅ Admin Account Successfully Created</h3>
                <p>A new admin account has been created for your Call Kaids Roofing system. This is normal if you or an authorized person set up the admin access.</p>
              </div>
            ` : eventData.event_type === 'ADMIN_CREATION_BLOCKED' ? `
              <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #721c24;">🚨 Unauthorized Admin Creation Blocked</h3>
                <p>Someone attempted to create an admin account but was blocked by the security system. This could indicate:</p>
                <ul style="margin: 10px 0;">
                  <li>An unauthorized person trying to gain admin access</li>
                  <li>A legitimate user trying to create a second admin account</li>
                  <li>A system error or misconfiguration</li>
                </ul>
                <p><strong>Action Required:</strong> If this was not authorized by you, please review your system security immediately.</p>
              </div>
            ` : `
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #856404;">⚠️ Security Event Detected</h3>
                <p>A security-related event has been detected in your system. Please review the details above and take appropriate action if necessary.</p>
              </div>
            `}

            <div style="background-color: #007ACC; color: white; padding: 15px; border-radius: 8px; text-align: center; margin-top: 30px;">
              <h3 style="margin: 0; margin-bottom: 10px;">Security Monitoring Active</h3>
              <p style="margin: 0; font-size: 14px;">This alert was automatically generated by your Call Kaids Roofing security system.</p>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6B7280; font-size: 14px;">
              <p><strong>Call Kaids Roofing - Security System</strong><br>
              If you have any concerns about this security alert, please contact your system administrator.<br>
              Event ID: ${eventData.user_id}-${Date.now()}</p>
            </div>
          </div>
        </div>
      `,
    });

    console.log("Security notification sent:", securityEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Security notification sent successfully",
        event_type: eventData.event_type
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
    console.error("Error in admin-security-notification function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to send security notification",
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