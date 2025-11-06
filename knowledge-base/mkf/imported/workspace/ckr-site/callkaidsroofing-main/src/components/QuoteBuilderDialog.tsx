import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, MessageSquare, Sparkles, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuoteTierCard } from "./QuoteTierCard";
import { QuoteChatPanel } from "./QuoteChatPanel";
import { QuotePreferencesForm, QuotePreferences } from "./QuotePreferencesForm";

interface QuoteBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

export function QuoteBuilderDialog({ open, onOpenChange, reportId }: QuoteBuilderDialogProps) {
  const [step, setStep] = useState<"preferences" | "tier" | "review" | "chat">("preferences");
  const [selectedTier, setSelectedTier] = useState<"essential" | "premium" | "complete" | null>(null);
  const [generatingQuote, setGeneratingQuote] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [preferences, setPreferences] = useState<QuotePreferences>({
    gstDisplay: "inclusive",
    clientType: "homeowner",
    budgetLevel: "standard",
    gutterCleaningPreference: "auto",
    washPaintPreference: "combined",
    ridgeMeasurement: "caps",
    specialRequirements: "",
  });

  const handleGenerateQuote = async (tier: "essential" | "premium" | "complete") => {
    setGeneratingQuote(true);
    setSelectedTier(tier);

    try {
      const { data, error } = await supabase.functions.invoke("generate-quote", {
        body: { 
          inspectionReportId: reportId, 
          tier,
          preferences 
        },
      });

      if (error) throw error;

      setQuote(data.quote);
      setStep("review");
      toast.success("Quote generated successfully!");
    } catch (error: any) {
      console.error("Error generating quote:", error);
      toast.error(error.message || "Failed to generate quote");
    } finally {
      setGeneratingQuote(false);
    }
  };

  const handleExportPDF = async () => {
    if (!quote) return;

    try {
      const { data: lineItems, error: lineItemsError } = await supabase
        .from('quote_line_items')
        .select('*')
        .eq('quote_id', quote.id)
        .order('sort_order');

      if (lineItemsError) throw lineItemsError;

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Please allow popups to export PDF');
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Quote ${quote.quote_number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 40px; color: #1f2937; }
            .header { border-bottom: 3px solid #007ACC; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; color: #007ACC; margin-bottom: 5px; }
            .abn { color: #6b7280; font-size: 14px; }
            .quote-title { font-size: 20px; font-weight: bold; margin: 30px 0 10px; }
            .quote-number { color: #6b7280; font-size: 14px; }
            .section { margin: 20px 0; }
            .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: #0B3B69; }
            .info-grid { display: grid; grid-template-columns: 150px 1fr; gap: 10px; }
            .info-label { font-weight: bold; color: #6b7280; }
            .line-items { margin: 30px 0; }
            table { width: 100%; border-collapse: collapse; margin: 10px 0; }
            th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #d1d5db; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .item-description { color: #6b7280; font-size: 13px; margin-top: 4px; }
            .totals { margin-top: 30px; float: right; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .totals-row.grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #007ACC; padding-top: 12px; margin-top: 8px; }
            .notes { margin-top: 40px; padding: 20px; background: #f9fafb; border-left: 4px solid #007ACC; }
            .notes-title { font-weight: bold; margin-bottom: 10px; }
            .footer { margin-top: 60px; text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px; }
            .tier-badge { display: inline-block; padding: 4px 12px; background: #007ACC; color: white; border-radius: 4px; font-size: 12px; font-weight: bold; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-name">Call Kaids Roofing</div>
            <div class="abn">ABN 39475055075</div>
            <div style="margin-top: 10px; color: #6b7280;">Kaidyn Brownlie | 0435 900 709 | callkaidsroofing@outlook.com</div>
          </div>

          <div class="quote-title">Quote</div>
          <div class="quote-number">${quote.quote_number}</div>

          <div class="section">
            <div class="section-title">Client Information</div>
            <div class="info-grid">
              <div class="info-label">Client Name:</div>
              <div>${quote.client_name}</div>
              <div class="info-label">Site Address:</div>
              <div>${quote.site_address}, ${quote.suburb_postcode}</div>
              ${quote.email ? `<div class="info-label">Email:</div><div>${quote.email}</div>` : ''}
              ${quote.phone ? `<div class="info-label">Phone:</div><div>${quote.phone}</div>` : ''}
              <div class="info-label">Quote Date:</div>
              <div>${new Date(String(quote.created_at)).toLocaleDateString('en-AU')}</div>
              <div class="info-label">Valid Until:</div>
              <div>${new Date(String(quote.valid_until)).toLocaleDateString('en-AU')}</div>
              <div class="info-label">Package:</div>
              <div><span class="tier-badge">${quote.tier_level.toUpperCase()}</span></div>
            </div>
          </div>

          <div class="line-items">
            <div class="section-title">Quote Details</div>
            <table>
              <thead>
                <tr>
                  <th>Service Item</th>
                  <th style="text-align: right;">Qty</th>
                  <th style="text-align: right;">Unit Rate</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${lineItems?.map((item: any) => `
                  <tr>
                    <td>
                      <div style="font-weight: 500;">${item.service_item}</div>
                      ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
                    </td>
                    <td style="text-align: right;">${item.quantity} ${item.unit}</td>
                    <td style="text-align: right;">$${parseFloat(String(item.unit_rate)).toFixed(2)}</td>
                    <td style="text-align: right;">$${parseFloat(String(item.line_total)).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>$${parseFloat(String(quote.subtotal)).toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>GST (10%):</span>
              <span>$${parseFloat(String(quote.gst)).toFixed(2)}</span>
            </div>
            <div class="totals-row grand-total">
              <span>Total:</span>
              <span>$${parseFloat(String(quote.total)).toFixed(2)}</span>
            </div>
          </div>

          <div style="clear: both;"></div>

          ${quote.notes ? `
            <div class="notes">
              <div class="notes-title">Notes</div>
              <div>${quote.notes}</div>
            </div>
          ` : ''}

          <div class="footer">
            <div style="margin-bottom: 10px; font-weight: bold; color: #007ACC;">No Leaks. No Lifting. Just Quality.</div>
            <div>Professional Roofing, Melbourne Style</div>
            <div style="margin-top: 10px;">7-10 Year Workmanship Warranty | Fully Insured | Weather-dependent scheduling</div>
          </div>
        </body>
        </html>
      `);

      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 250);

      toast.success('Quote opened for printing/PDF export');
    } catch (error: any) {
      console.error('Error exporting PDF:', error);
      toast.error(error.message || 'Failed to export quote');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Quote Builder
          </DialogTitle>
        </DialogHeader>

        <Tabs value={step} onValueChange={(v) => setStep(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="preferences">
              <Settings className="h-4 w-4 mr-2" />
              Preferences
            </TabsTrigger>
            <TabsTrigger value="tier" disabled={generatingQuote}>
              Select Tier
            </TabsTrigger>
            <TabsTrigger value="review" disabled={!quote}>
              Review Quote
            </TabsTrigger>
            <TabsTrigger value="chat" disabled={!quote}>
              Refine (Chat)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-4 mt-6">
            <div className="text-sm text-muted-foreground mb-4">
              Set your quote preferences before generating. These help the AI create a quote tailored to your customer.
            </div>
            <QuotePreferencesForm preferences={preferences} onChange={setPreferences} />
            <div className="flex justify-end">
              <Button onClick={() => setStep("tier")}>
                Continue to Tier Selection
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tier" className="space-y-4 mt-6">
            <div className="text-sm text-muted-foreground mb-4">
              Choose a tier to generate a quote. AI will analyze the inspection report and calculate quantities, pricing, and materials.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuoteTierCard
                tier="essential"
                title="Essential Repair"
                description="Fix what's broken. Stops leaks, meets minimum safety."
                features={[
                  "Fix immediate issues",
                  "Basic materials",
                  "5-year warranty",
                  "Minimal scope"
                ]}
                onGenerate={() => handleGenerateQuote("essential")}
                loading={generatingQuote && selectedTier === "essential"}
              />

              <QuoteTierCard
                tier="premium"
                title="Premium Restoration"
                description="Fix + protect. Adds 5-7 years of life, quality materials."
                features={[
                  "Comprehensive repairs",
                  "Premcoat coating",
                  "7-year warranty",
                  "Quality materials"
                ]}
                onGenerate={() => handleGenerateQuote("premium")}
                loading={generatingQuote && selectedTier === "premium"}
                recommended
              />

              <QuoteTierCard
                tier="complete"
                title="Complete Overhaul"
                description="Like-new condition. 10+ year warranty, full restoration."
                features={[
                  "Full restoration",
                  "Premium materials",
                  "10-year warranty",
                  "Extended scope"
                ]}
                onGenerate={() => handleGenerateQuote("complete")}
                loading={generatingQuote && selectedTier === "complete"}
              />
            </div>
          </TabsContent>

          <TabsContent value="review" className="space-y-4 mt-6">
            {quote && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{quote.tierName}</h3>
                    <p className="text-sm text-muted-foreground">Quote #{quote.quote_number}</p>
                  </div>
                  <Badge variant="outline">{quote.tier_level}</Badge>
                </div>

                <div className="border rounded-lg p-4 space-y-3">
                  <div className="font-semibold text-sm text-muted-foreground">Line Items</div>
                  {quote.lineItems?.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start py-2 border-b last:border-0">
                      <div className="flex-1">
                        <div className="font-medium">{item.serviceItem}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.quantity} {item.unit} × ${item.unitRate}
                        </div>
                      </div>
                      <div className="font-semibold">${item.lineTotal.toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${quote.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>GST (10%)</span>
                    <span>${quote.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>${quote.total.toFixed(2)}</span>
                  </div>
                </div>

                {quote.notes && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <div className="text-sm font-semibold mb-2">Notes</div>
                    <div className="text-sm text-muted-foreground">{quote.notes}</div>
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setStep("chat")}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Refine with AI
                  </Button>
                  <Button onClick={handleExportPDF}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            {quote && <QuoteChatPanel quoteId={quote.id} />}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
