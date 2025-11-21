import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  message: string;
  pdfBase64: string;
  pdfFilename: string;
  clientName: string;
  quoteNumber: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      to,
      subject,
      message,
      pdfBase64,
      pdfFilename,
      clientName,
      quoteNumber,
    }: EmailRequest = await req.json();

    console.log("Sending inspection quote email to:", to);

    // Convert message to HTML with proper formatting
    const htmlMessage = message
      .split('\n')
      .map(line => `<p>${line || '&nbsp;'}</p>`)
      .join('');

    const emailResponse = await resend.emails.send({
      from: "Call Kaids Roofing <quotes@callkaidsroofing.com.au>",
      to: [to],
      subject: subject || `Quote ${quoteNumber} - Call Kaids Roofing`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #007ACC 0%, #0B3B69 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .header p {
              margin: 10px 0 0 0;
              opacity: 0.9;
              font-size: 14px;
            }
            .content {
              background: #ffffff;
              padding: 30px 20px;
              border: 1px solid #e0e0e0;
            }
            .content p {
              margin: 0 0 15px 0;
            }
            .quote-number {
              background: #f5f5f5;
              padding: 15px;
              border-left: 4px solid #007ACC;
              margin: 20px 0;
              font-weight: bold;
              font-size: 16px;
            }
            .cta {
              text-align: center;
              margin: 30px 0;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #007ACC 0%, #0B3B69 100%);
              color: white;
              padding: 14px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
            }
            .footer {
              background: #f5f5f5;
              padding: 20px;
              text-align: center;
              border-radius: 0 0 8px 8px;
              border: 1px solid #e0e0e0;
              border-top: none;
            }
            .footer p {
              margin: 5px 0;
              font-size: 14px;
              color: #666;
            }
            .slogan {
              font-style: italic;
              color: #007ACC;
              font-weight: bold;
              margin-top: 15px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Call Kaids Roofing</h1>
            <p>SE Melbourne's Trusted Roofing Specialists</p>
          </div>
          
          <div class="content">
            <p>Dear ${clientName},</p>
            
            ${htmlMessage}
            
            <div class="quote-number">
              Quote Number: ${quoteNumber}
            </div>
            
            <p>Your detailed inspection report and quote is attached to this email as a PDF.</p>
            
            <div class="cta">
              <a href="tel:0435900709" class="button">Call Now: 0435 900 709</a>
            </div>
            
            <p>If you have any questions or would like to discuss the quote, please don't hesitate to reach out.</p>
            
            <p>Best regards,<br>
            <strong>Kaidyn Brownlie</strong><br>
            Call Kaids Roofing</p>
          </div>
          
          <div class="footer">
            <p class="slogan">Proof In Every Roof</p>
            <p>📞 0435 900 709 | 📧 info@callkaidsroofing.com.au</p>
            <p>ABN: 39475055075</p>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBase64,
        },
      ],
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        messageId: emailResponse.data?.id,
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
    console.error("Error in send-inspection-quote-email function:", error);
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
