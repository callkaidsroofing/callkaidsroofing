import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { InspectionData, QuoteData, ScopeItem, COMPANY_CONFIG, LeadContext } from './types';
import { validateEmailSend } from './validation';
import { formatCurrency, formatDate, calculateTotalPricing } from './utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FileDown, Mail, CheckCircle } from 'lucide-react';
import { sendQuoteExportEmails } from '@/admin/services/email';

interface ExportStepProps {
  inspectionData: InspectionData;
  quoteData: QuoteData;
  scopeItems: ScopeItem[];
  inspectionId: string | null;
  quoteId: string | null;
  leadContext?: LeadContext | null;
}

export function ExportStep({
  inspectionData,
  quoteData,
  scopeItems,
  inspectionId,
  quoteId,
  leadContext,
}: ExportStepProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const totals = calculateTotalPricing(scopeItems);
  const recipientEmail = inspectionData.email || leadContext?.email || '';
  const recipientName = inspectionData.client_name || leadContext?.name || '';
  const canSendClient = Boolean(recipientEmail);

  const recordSendAttempt = async (
    recipients: string[],
    status: 'sent' | 'failed',
    error?: string
  ) => {
    if (!quoteId) return;

    try {
      const { data: existing } = await supabase
        .from('quotes')
        .select('scope')
        .eq('id', quoteId)
        .single();

      const scopeMeta = ((existing?.scope as Record<string, any>) || {}) as Record<string, any>;
      const sendLog = Array.isArray(scopeMeta.send_log) ? scopeMeta.send_log : [];

      sendLog.push({
        at: new Date().toISOString(),
        recipients,
        status,
        error,
      });

      await supabase
        .from('quotes')
        .update({ scope: { ...scopeMeta, send_log: sendLog } })
        .eq('id', quoteId);
    } catch (logError) {
      console.error('Failed to record email send attempt', logError);
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);

      // Check if html2pdf is available
      if (typeof window === 'undefined' || !(window as any).html2pdf) {
        toast({
          title: 'Error',
          description: 'PDF library not loaded. Please refresh the page.',
          variant: 'destructive',
        });
        return;
      }

      // Create PDF content
      const element = document.getElementById('pdf-content');
      if (!element) {
        toast({
          title: 'Error',
          description: 'PDF content not found',
          variant: 'destructive',
        });
        return;
      }

      const opt = {
        margin: 10,
        filename: `CKR-Quote-${inspectionData.client_name.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      await (window as any).html2pdf().set(opt).from(element).save();

      toast({
        title: 'Success',
        description: 'PDF downloaded successfully',
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: 'Error',
        description: 'Failed to export PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleSendEmail = async (sendOwnerOnly = false) => {
    const validation = sendOwnerOnly
      ? { valid: true }
      : validateEmailSend(recipientEmail, recipientName);

    if (!validation.valid) {
      toast({
        title: 'Validation Error',
        description: validation.error || 'Invalid email',
        variant: 'destructive',
      });
      return;
    }

    const recipients = sendOwnerOnly
      ? ['owner']
      : [recipientEmail].filter(Boolean) as string[];

    try {
      setIsSending(true);

      await sendQuoteExportEmails({
        quoteId,
        inspectionId,
        clientEmail: sendOwnerOnly ? null : recipientEmail,
        clientName: recipientName,
        ccOwner: true,
        leadContext: leadContext
          ? {
              leadId: leadContext.id,
              name: leadContext.name || inspectionData.client_name,
              email: recipientEmail,
              phone: leadContext.phone,
              suburb: leadContext.suburb,
              service: leadContext.service,
            }
          : undefined,
        sendOwnerOnly,
      });

      toast({
        title: 'Email Sent',
        description: sendOwnerOnly
          ? 'Internal copy sent'
          : `Quote sent successfully to ${recipientEmail}`,
      });
      await recordSendAttempt(recipients, 'sent');
    } catch (error) {
      console.error('Email send error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      });
      await recordSendAttempt(
        recipients.length ? recipients : ['owner'],
        'failed',
        (error as { message?: string })?.message
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Step 3: Export & Send</h2>
        <p className="text-muted-foreground mb-6">
          Review and export your inspection report and quote
        </p>
      </div>

      {/* Actions */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 text-lg">Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleExportPDF} disabled={isExporting}>
            <FileDown className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export as PDF'}
          </Button>
          <Button
            variant="outline"
            onClick={() => handleSendEmail(false)}
            disabled={isSending || !canSendClient}
          >
            <Mail className="w-4 h-4 mr-2" />
            {isSending
              ? 'Sending...'
              : canSendClient
              ? `Send to ${recipientEmail}`
              : 'Add client email to send'}
          </Button>
          {!canSendClient && (
            <Button
              variant="secondary"
              onClick={() => handleSendEmail(true)}
              disabled={isSending}
            >
              <Mail className="w-4 h-4 mr-2" />
              {isSending ? 'Sending...' : 'Send internal copy'}
            </Button>
          )}
        </div>
      </Card>

      {leadContext && (
        <Card className="p-4 bg-muted">
          <div className="flex flex-col gap-1 text-sm">
            <div className="font-semibold">Linked lead</div>
            <div>{leadContext.name}</div>
            <div className="text-muted-foreground">
              {leadContext.phone || 'Phone not provided'} • {leadContext.email || 'Email not provided'}
            </div>
            <div className="text-muted-foreground">
              {leadContext.suburb || 'Suburb unknown'}
              {leadContext.service ? ` • ${leadContext.service}` : ''}
            </div>
          </div>
        </Card>
      )}

      {/* Status */}
      <Card className="p-4 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">
              Inspection & Quote Saved
            </h3>
            <div className="text-sm text-green-800 space-y-1">
              {inspectionId && <p>Inspection ID: {inspectionId}</p>}
              {quoteId && <p>Quote ID: {quoteId}</p>}
              <p>All data has been saved to your database.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-lg">Document Preview</h3>
        <div
          id="pdf-content"
          className="bg-white p-8 border rounded-lg"
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          {/* Header */}
          <div
            className="border-b-4 pb-4 mb-6"
            style={{ borderColor: COMPANY_CONFIG.primary_color }}
          >
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: COMPANY_CONFIG.primary_color }}
            >
              {COMPANY_CONFIG.company_name}
            </h1>
            <p className="text-sm text-gray-600">{COMPANY_CONFIG.contact_line}</p>
          </div>

          {/* Document Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              Inspection Report & {quoteData.document_type}
            </h2>
            <p className="text-gray-600">
              Date: {formatDate(new Date())}
            </p>
          </div>

          {/* Client Details */}
          <div className="mb-6">
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: COMPANY_CONFIG.secondary_color }}
            >
              Client Details
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-semibold">Name:</span> {inspectionData.client_name}
              </div>
              <div>
                <span className="font-semibold">Phone:</span> {inspectionData.phone}
              </div>
              {inspectionData.email && (
                <div className="col-span-2">
                  <span className="font-semibold">Email:</span> {inspectionData.email}
                </div>
              )}
              <div className="col-span-2">
                <span className="font-semibold">Property:</span> {inspectionData.address},{' '}
                {inspectionData.suburb}
              </div>
            </div>
          </div>

          {/* Inspection Findings */}
          <div className="mb-6">
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: COMPANY_CONFIG.secondary_color }}
            >
              Inspection Findings
            </h3>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              <div>
                <span className="font-semibold">Roof Type:</span> {inspectionData.roof_type}
              </div>
              <div>
                <span className="font-semibold">Storeys:</span> {inspectionData.storey_count}
              </div>
              {inspectionData.roof_area_m2 && (
                <div>
                  <span className="font-semibold">Roof Area:</span> {inspectionData.roof_area_m2} m²
                </div>
              )}
              {inspectionData.ridge_length_lm && (
                <div>
                  <span className="font-semibold">Ridge Length:</span>{' '}
                  {inspectionData.ridge_length_lm} lm
                </div>
              )}
              {inspectionData.valley_length_lm && (
                <div>
                  <span className="font-semibold">Valley Length:</span>{' '}
                  {inspectionData.valley_length_lm} lm
                </div>
              )}
              {inspectionData.gutter_length_lm && (
                <div>
                  <span className="font-semibold">Gutter Length:</span>{' '}
                  {inspectionData.gutter_length_lm} lm
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div>
                <span className="font-semibold">Ridge:</span> {inspectionData.ridge_condition || 'Not assessed'}
              </div>
              <div>
                <span className="font-semibold">Valleys:</span> {inspectionData.valley_condition || 'Not assessed'}
              </div>
              <div>
                <span className="font-semibold">Tiles/Sheets:</span> {inspectionData.tile_condition || 'Not assessed'}
              </div>
              <div>
                <span className="font-semibold">Gutters:</span> {inspectionData.gutter_condition || 'Not assessed'}
              </div>
              <div>
                <span className="font-semibold">Flashing:</span> {inspectionData.flashing_condition || 'Not assessed'}
              </div>
              <div>
                <span className="font-semibold">Leaks:</span> {inspectionData.leak_status || 'Not assessed'}
              </div>
            </div>

            {inspectionData.inspector_notes && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="font-semibold text-sm mb-1">Inspector Notes:</p>
                <p className="text-sm whitespace-pre-wrap">{inspectionData.inspector_notes}</p>
              </div>
            )}
          </div>

          {/* Scope of Works */}
          {scopeItems.length > 0 && (
            <div className="mb-6">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: COMPANY_CONFIG.secondary_color }}
              >
                Scope of Works
              </h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2 text-left">Item</th>
                    <th className="border p-2 text-left">Area</th>
                    <th className="border p-2 text-right">Qty</th>
                    <th className="border p-2 text-left">Unit</th>
                    <th className="border p-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {scopeItems.map((item, index) => (
                    <tr key={index}>
                      <td className="border p-2">
                        {item.category}
                        {item.notes && (
                          <div className="text-xs text-gray-600 mt-1">{item.notes}</div>
                        )}
                      </td>
                      <td className="border p-2">{item.area}</td>
                      <td className="border p-2 text-right">{item.qty}</td>
                      <td className="border p-2">{item.unit}</td>
                      <td className="border p-2 text-right">
                        {formatCurrency(item.total_inc_gst)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="border p-2 text-right font-semibold">
                      Subtotal (ex GST):
                    </td>
                    <td className="border p-2 text-right font-semibold">
                      {formatCurrency(totals.subtotal)}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td colSpan={4} className="border p-2 text-right font-semibold">
                      GST (10%):
                    </td>
                    <td className="border p-2 text-right font-semibold">
                      {formatCurrency(totals.gst)}
                    </td>
                  </tr>
                  <tr
                    className="text-white"
                    style={{ backgroundColor: COMPANY_CONFIG.primary_color }}
                  >
                    <td colSpan={4} className="border p-2 text-right font-bold">
                      TOTAL (inc GST):
                    </td>
                    <td className="border p-2 text-right font-bold text-lg">
                      {formatCurrency(totals.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {/* Warranty */}
          {quoteData.include_warranty && (
            <div className="mb-6 p-4 bg-blue-50 rounded">
              <h3 className="font-semibold mb-2">Warranty</h3>
              <p className="text-sm">{COMPANY_CONFIG.warranty_text}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-center text-sm text-gray-600">
            <p className="mb-2">{quoteData.slogan}</p>
            <p>{COMPANY_CONFIG.contact_line}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
