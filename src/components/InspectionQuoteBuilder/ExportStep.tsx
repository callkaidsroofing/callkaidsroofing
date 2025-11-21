import { useState, useRef } from 'react';
import { InspectionData, QuoteData, ScopeItem, COMPANY_CONFIG } from './types';
import { validateEmailSend } from './validation';
import { formatCurrency, formatDate, calculateTotalPricing, buildPricingSnapshot, PricingSnapshot } from './utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FileDown, Mail, CheckCircle, Eye, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sendInspectionQuoteEmail } from '@/services/email';

interface ExportStepProps {
  inspectionData: InspectionData;
  quoteData: QuoteData;
  scopeItems: ScopeItem[];
  inspectionId: string | null;
  quoteId: string | null;
  quoteNumber?: string;
  leadId?: string | null;
}

export function ExportStep({
  inspectionData,
  quoteData,
  scopeItems,
  inspectionId,
  quoteId,
  quoteNumber,
  leadId,
}: ExportStepProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [emailForm, setEmailForm] = useState({
    to: inspectionData.email || '',
    subject: '',
    message: '',
  });
  const pdfContentRef = useRef<HTMLDivElement>(null);

  const ownerEmail =
    import.meta.env.VITE_OWNER_EMAIL || 'callkaidsroofing@outlook.com';
  const buildEmailCopy = (recipientName: string) => ({
    subject: quoteNumber
      ? `Quote ${quoteNumber} - Call Kaids Roofing`
      : quoteId
      ? `Quote ${quoteId} - Call Kaids Roofing`
      : 'Your quote from Call Kaids Roofing',
    message: `Dear ${recipientName || 'client'},\n\nThank you for the opportunity to assist with your roof. Your quote is attached for review. If you have any questions, please reply to this email or call 0435 900 709.\n\nNo Leaks. No Lifting. Just Quality.\n\nRegards,\nKaidyn Brownlie\nCall Kaids Roofing`,
  });

  const totals = calculateTotalPricing(scopeItems);

  const generatePDFBlob = async (): Promise<Blob | null> => {
    try {
      // Check if html2pdf is available
      if (typeof window === 'undefined' || !(window as any).html2pdf) {
        toast({
          title: 'Error',
          description: 'PDF library not loaded. Please refresh the page.',
          variant: 'destructive',
        });
        return null;
      }

      const element = pdfContentRef.current;
      if (!element) {
        toast({
          title: 'Error',
          description: 'PDF content not found',
          variant: 'destructive',
        });
        return null;
      }

      const opt = {
        margin: 10,
        filename: `CKR-Quote-${inspectionData.client_name.replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      const pdf = await (window as any).html2pdf().set(opt).from(element).output('blob');
      return pdf;
    } catch (error) {
      console.error('PDF generation error:', error);
      return null;
    }
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const blob = await generatePDFBlob();
      
      if (!blob) {
        toast({
          title: 'Error',
          description: 'Failed to generate PDF',
          variant: 'destructive',
        });
        return;
      }

      // Download PDF
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CKR-Quote-${inspectionData.client_name.replace(/\s+/g, '-')}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

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

  const handlePreviewPDF = async () => {
    try {
      setIsExporting(true);
      const blob = await generatePDFBlob();
      
      if (!blob) {
        toast({
          title: 'Error',
          description: 'Failed to generate PDF preview',
          variant: 'destructive',
        });
        return;
      }

      setPdfBlob(blob);
      setShowPdfPreview(true);
    } catch (error) {
      console.error('PDF preview error:', error);
      toast({
        title: 'Error',
        description: 'Failed to preview PDF',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenEmailDialog = () => {
    const { subject, message } = buildEmailCopy(inspectionData.client_name);
    setEmailForm({
      to: inspectionData.email || '',
      subject,
      message,
    });
    setShowEmailDialog(true);
  };

  const handleSendEmailWithPDF = async () => {
    if (!quoteId) {
      toast({
        title: 'Save required',
        description: 'Please save the quote before sending email.',
        variant: 'destructive',
      });
      return;
    }

    const validation = validateEmailSend(emailForm.to, inspectionData.client_name);
    if (!validation.valid) {
      toast({
        title: 'Validation Error',
        description: validation.error || 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSending(true);

      // Generate PDF blob
      const blob = await generatePDFBlob();
      if (!blob) {
        toast({
          title: 'Error',
          description: 'Failed to generate PDF attachment',
          variant: 'destructive',
        });
        return;
      }

      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const pdfBase64 = await base64Promise;

      const pricingSnapshot: PricingSnapshot = buildPricingSnapshot({
        inspectionData,
        quoteData,
        scopeItems,
        totals,
        quoteNumber: quoteNumber || quoteId || '',
        leadId: leadId || undefined,
      });

      const { error } = await sendInspectionQuoteEmail({
        to: emailForm.to,
        subject: emailForm.subject,
        message: emailForm.message,
        pdfBase64,
        pdfFilename: `CKR-Quote-${quoteNumber || quoteId}.pdf`,
        clientName: inspectionData.client_name,
        quoteNumber: quoteNumber || quoteId,
      });

      if (error) throw error;

      await supabase
        .from('quotes')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          pricing_snapshot: pricingSnapshot,
        })
        .eq('id', quoteId);

      if (leadId) {
        await supabase.from('lead_notes').insert({
          lead_id: leadId,
          note_type: 'status_change',
          content: `Quote ${quoteNumber || quoteId} sent via builder`,
        });
      }

      toast({
        title: 'Email Sent',
        description: `Quote sent successfully to ${emailForm.to}`,
      });

      setShowEmailDialog(false);
    } catch (error) {
      console.error('Email send error:', error);
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      });
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
          <Button onClick={handlePreviewPDF} disabled={isExporting}>
            <Eye className="w-4 h-4 mr-2" />
            {isExporting ? 'Loading...' : 'Preview PDF'}
          </Button>
          <Button onClick={handleExportPDF} disabled={isExporting} variant="outline">
            <FileDown className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </Button>
          <Button
            onClick={handleOpenEmailDialog}
            disabled={isSending}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Send className="w-4 h-4 mr-2" />
            Email Quote
          </Button>
        </div>
      </Card>

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
              {quoteNumber && <p>Quote Number: {quoteNumber}</p>}
              <p>All data has been saved to your database.</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Preview */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4 text-lg">Document Preview</h3>
        <div
          ref={pdfContentRef}
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

      {/* PDF Preview Dialog */}
      <Dialog open={showPdfPreview} onOpenChange={setShowPdfPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>PDF Preview</DialogTitle>
            <DialogDescription>
              Preview of your inspection report and quote
            </DialogDescription>
          </DialogHeader>
          <div className="h-[70vh] overflow-auto">
            {pdfBlob && (
              <iframe
                src={URL.createObjectURL(pdfBlob)}
                className="w-full h-full border rounded"
                title="PDF Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Quote via Email</DialogTitle>
            <DialogDescription>
              The PDF will be attached automatically
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-to">To</Label>
              <Input
                id="email-to"
                type="email"
                value={emailForm.to}
                onChange={(e) => setEmailForm({ ...emailForm, to: e.target.value })}
                placeholder="client@example.com"
              />
            </div>
            <div>
              <Label htmlFor="email-subject">Subject</Label>
              <Input
                id="email-subject"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                placeholder="Quote from Call Kaids Roofing"
              />
            </div>
            <div>
              <Label htmlFor="email-message">Message</Label>
              <Textarea
                id="email-message"
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                placeholder="Email message to client..."
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEmailDialog(false)}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendEmailWithPDF}
                disabled={isSending}
                className="bg-gradient-to-r from-primary to-secondary"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Email'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
