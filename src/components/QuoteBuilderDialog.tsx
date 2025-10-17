import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, MessageSquare, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuoteTierCard } from "./QuoteTierCard";
import { QuoteChatPanel } from "./QuoteChatPanel";

interface QuoteBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

export function QuoteBuilderDialog({ open, onOpenChange, reportId }: QuoteBuilderDialogProps) {
  const [step, setStep] = useState<"tier" | "review" | "chat">("tier");
  const [selectedTier, setSelectedTier] = useState<"essential" | "premium" | "complete" | null>(null);
  const [generatingQuote, setGeneratingQuote] = useState(false);
  const [quote, setQuote] = useState<any>(null);

  const handleGenerateQuote = async (tier: "essential" | "premium" | "complete") => {
    setGeneratingQuote(true);
    setSelectedTier(tier);

    try {
      const { data, error } = await supabase.functions.invoke("generate-quote", {
        body: { inspectionReportId: reportId, tier },
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

  const handleExportPDF = () => {
    toast("PDF export coming soon!");
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tier" disabled={generatingQuote}>
              1. Select Tier
            </TabsTrigger>
            <TabsTrigger value="review" disabled={!quote}>
              2. Review Quote
            </TabsTrigger>
            <TabsTrigger value="chat" disabled={!quote}>
              3. Refine (Chat)
            </TabsTrigger>
          </TabsList>

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
