import { supabase } from '@/integrations/supabase/client';

interface SendInspectionQuoteEmailParams {
  to: string;
  subject: string;
  message: string;
  pdfBase64: string;
  pdfFilename: string;
  clientName: string;
  quoteNumber?: string;
}

export async function sendInspectionQuoteEmail(params: SendInspectionQuoteEmailParams) {
  const { to, subject, message, pdfBase64, pdfFilename, clientName, quoteNumber } = params;

  return supabase.functions.invoke('send-inspection-quote-email', {
    body: {
      to,
      subject,
      message,
      pdfBase64,
      pdfFilename,
      clientName,
      quoteNumber,
    },
  });
}
