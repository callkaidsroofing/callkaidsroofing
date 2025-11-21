import { supabase } from '@/integrations/supabase/client';

export interface LeadNotificationPayload {
  leadId?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  suburb?: string | null;
  service?: string | null;
}

export interface QuoteEmailPayload {
  quoteId: string | null;
  inspectionId: string | null;
  clientEmail?: string | null;
  clientName?: string | null;
  ccOwner?: boolean;
  leadContext?: LeadNotificationPayload;
  sendOwnerOnly?: boolean;
}

export async function sendLeadNotification(payload: LeadNotificationPayload) {
  const { data, error } = await supabase.functions.invoke('send-lead-notification', {
    body: payload,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function sendQuoteExportEmails({
  quoteId,
  inspectionId,
  clientEmail,
  clientName,
  ccOwner = true,
  leadContext,
  sendOwnerOnly = false,
}: QuoteEmailPayload) {
  const { data, error } = await supabase.functions.invoke('send-quote-email', {
    body: {
      quoteId,
      inspectionId,
      recipientEmail: clientEmail,
      recipientName: clientName,
      includeAttachment: true,
      ccOwner,
      leadContext,
      sendOwnerOnly,
    },
  });

  if (error) {
    throw error;
  }

  return data;
}
