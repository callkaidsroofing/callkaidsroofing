import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Sparkles, Plus, Trash2, FileText, Save, Calculator, Satellite } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { QuoteTierCard } from "./QuoteTierCard";
import { RoofMeasurementSelector } from "./RoofMeasurementSelector";

interface LineItem {
  serviceItem: string;
  description: string;
  quantity: number;
  unit: string;
  unitRate: number;
  lineTotal: number;
  materialSpec?: string;
}

interface QuoteSuggestion {
  tierName: string;
  lineItems: LineItem[];
  scopeNotes: string;
}

interface ProfessionalQuoteBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

export function ProfessionalQuoteBuilder({ open, onOpenChange, reportId }: ProfessionalQuoteBuilderProps) {
  const [step, setStep] = useState<"tier" | "build">("tier");
  const [selectedTier, setSelectedTier] = useState<"essential" | "premium" | "complete" | null>(null);
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [suggestion, setSuggestion] = useState<QuoteSuggestion | null>(null);
  const [report, setReport] = useState<any>(null);
  const [roofMeasurementDialogOpen, setRoofMeasurementDialogOpen] = useState(false);
  
  // Quote builder state
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [quoteNotes, setQuoteNotes] = useState("");
  const [savingQuote, setSavingQuote] = useState(false);

  useEffect(() => {
    if (open && reportId) {
      fetchReport();
    }
  }, [open, reportId]);

  const fetchReport = async () => {
    try {
      const { data, error } = await supabase
        .from('inspection_reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (error) throw error;
      setReport(data);
    } catch (error: any) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load inspection report');
    }
  };

  const handleGetSuggestion = async (tier: "essential" | "premium" | "complete") => {
    setLoadingSuggestion(true);
    setSelectedTier(tier);

    try {
      const { data, error } = await supabase.functions.invoke("generate-quote", {
        body: { inspectionReportId: reportId, tier },
      });

      if (error) throw error;

      setSuggestion(data.quote);
      setLineItems(data.quote.lineItems || []);
      setQuoteNotes(data.quote.scopeNotes || "");
      setStep("build");
      toast.success("AI suggestions generated! Review and add pricing.");
    } catch (error: any) {
      console.error("Error generating suggestion:", error);
      toast.error(error.message || "Failed to generate suggestions");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  const handleImportRoofMeasurement = (measurement: any) => {
    const { total_area_m2, predominant_pitch, hips, ridges, valleys, perimeter_features } = measurement;
    
    // Calculate total hip length
    const totalHipLength = Array.isArray(hips) 
      ? hips.reduce((sum: number, h: any) => sum + (h.length || 0), 0) 
      : 0;
    
    // Calculate total ridge length
    const totalRidgeLength = Array.isArray(ridges) 
      ? ridges.reduce((sum: number, r: any) => sum + (r.length || 0), 0) 
      : 0;
    
    // Calculate total valley length
    const totalValleyLength = Array.isArray(valleys) 
      ? valleys.reduce((sum: number, v: any) => sum + (v.length || 0), 0) 
      : 0;

    // Auto-populate line items based on measurements
    const importedItems: LineItem[] = [];

    if (total_area_m2 > 0) {
      importedItems.push({
        serviceItem: "Roof Restoration",
        description: `Complete roof restoration including pressure wash and protective coating`,
        quantity: parseFloat(total_area_m2.toFixed(2)),
        unit: "m²",
        unitRate: 0,
        lineTotal: 0,
      });
    }

    if (totalRidgeLength > 0 || totalHipLength > 0) {
      importedItems.push({
        serviceItem: "Ridge & Hip Capping",
        description: "Rebedding and repointing of ridge and hip caps with flexible bedding compound",
        quantity: parseFloat((totalRidgeLength + totalHipLength).toFixed(2)),
        unit: "m",
        unitRate: 0,
        lineTotal: 0,
      });
    }

    if (totalValleyLength > 0) {
      importedItems.push({
        serviceItem: "Valley Iron Replacement",
        description: "Supply and install new valley iron with valley clips",
        quantity: parseFloat(totalValleyLength.toFixed(2)),
        unit: "m",
        unitRate: 0,
        lineTotal: 0,
      });
    }

    setLineItems(importedItems);
    
    // Add measurement details to quote notes
    const measurementNotes = `\n\n--- Satellite Measurements ---\nTotal Roof Area: ${total_area_m2} m²\nPredominant Pitch: ${predominant_pitch}°\nRidge/Hip Length: ${(totalRidgeLength + totalHipLength).toFixed(2)} m\nValley Length: ${totalValleyLength.toFixed(2)} m\nImagery Quality: ${measurement.imagery_quality || 'N/A'}`;
    
    setQuoteNotes(prev => prev + measurementNotes);
    
    toast.success("Roof measurements imported! Add pricing to complete the quote.");
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    
    // Recalculate line total if quantity or rate changes
    if (field === 'quantity' || field === 'unitRate') {
      const qty = field === 'quantity' ? parseFloat(value) || 0 : updated[index].quantity;
      const rate = field === 'unitRate' ? parseFloat(value) || 0 : updated[index].unitRate;
      updated[index].lineTotal = qty * rate;
    }
    
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, {
      serviceItem: "",
      description: "",
      quantity: 0,
      unit: "ea",
      unitRate: 0,
      lineTotal: 0,
    }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    const gst = subtotal * 0.1;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  const handleSaveQuote = async () => {
    if (!report) {
      toast.error("Report data not loaded");
      return;
    }

    if (lineItems.length === 0) {
      toast.error("Add at least one line item");
      return;
    }

    if (lineItems.some(item => !item.serviceItem || item.quantity <= 0)) {
      toast.error("Complete all line item details");
      return;
    }

    setSavingQuote(true);

    try {
      const { subtotal, gst, total } = calculateTotals();

      // Generate quote number
      const { data: quoteNumberData, error: quoteNumberError } = await supabase
        .rpc('generate_quote_number');

      if (quoteNumberError) throw quoteNumberError;

      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      const { data: { user } } = await supabase.auth.getUser();

      // Insert quote
      const { data: quote, error: quoteError } = await supabase
        .from('quotes')
        .insert({
          inspection_report_id: reportId,
          quote_number: quoteNumberData,
          client_name: report.clientName,
          site_address: report.siteAddress,
          suburb_postcode: report.suburbPostcode,
          email: report.email,
          phone: report.phone,
          tier_level: selectedTier,
          subtotal,
          gst,
          total,
          valid_until: validUntil.toISOString().split('T')[0],
          notes: quoteNotes,
          created_by: user?.id,
          status: 'draft',
        })
        .select()
        .single();

      if (quoteError) throw quoteError;

      // Insert line items
      const lineItemsToInsert = lineItems.map((item, index) => ({
        quote_id: quote.id,
        service_item: item.serviceItem,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        unit_rate: item.unitRate,
        line_total: item.lineTotal,
        sort_order: index,
      }));

      const { error: lineItemsError } = await supabase
        .from('quote_line_items')
        .insert(lineItemsToInsert);

      if (lineItemsError) throw lineItemsError;

      toast.success(`Quote ${quoteNumberData} saved successfully!`);
      onOpenChange(false);
      
      // Reset state
      setStep("tier");
      setSuggestion(null);
      setLineItems([]);
      setQuoteNotes("");
      setSelectedTier(null);
    } catch (error: any) {
      console.error('Error saving quote:', error);
      toast.error(error.message || 'Failed to save quote');
    } finally {
      setSavingQuote(false);
    }
  };

  const { subtotal, gst, total } = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Professional Quote Builder
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            AI-powered suggestions with manual pricing control
          </p>
        </DialogHeader>

        {step === "tier" && (
          <div className="space-y-6 mt-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-2">How it works:</h3>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Select a tier package below</li>
                <li>AI analyzes the inspection and suggests scope of work with quantities</li>
                <li>You review, adjust, and add pricing manually</li>
                <li>Save the professional quote</li>
              </ol>
            </div>

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => setRoofMeasurementDialogOpen(true)}
                className="gap-2"
              >
                <Satellite className="h-4 w-4" />
                Import from Roof Measurement
              </Button>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuoteTierCard
                tier="essential"
                title="Essential Repair"
                description="Fix what's broken. Critical repairs only."
                features={[
                  "Address immediate issues",
                  "Safety-critical repairs",
                  "Leak remediation",
                  "Minimum viable scope"
                ]}
                onGenerate={() => handleGetSuggestion("essential")}
                loading={loadingSuggestion && selectedTier === "essential"}
              />

              <QuoteTierCard
                tier="premium"
                title="Premium Restoration"
                description="Fix + protect. Quality materials and comprehensive care."
                features={[
                  "All essential repairs",
                  "Protective coatings",
                  "Quality materials",
                  "Extended life expectancy"
                ]}
                onGenerate={() => handleGetSuggestion("premium")}
                loading={loadingSuggestion && selectedTier === "premium"}
                recommended
              />

              <QuoteTierCard
                tier="complete"
                title="Complete Overhaul"
                description="Like-new condition. Full restoration and renewal."
                features={[
                  "All premium work",
                  "Full re-bedding",
                  "Premium materials",
                  "Maximum warranty coverage"
                ]}
                onGenerate={() => handleGetSuggestion("complete")}
                loading={loadingSuggestion && selectedTier === "complete"}
              />
            </div>
          </div>
        )}

        {step === "build" && suggestion && (
          <div className="space-y-6 mt-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{suggestion.tierName}</h3>
                <Badge variant="outline" className="mt-1">{selectedTier?.toUpperCase()}</Badge>
              </div>
              <Button variant="outline" size="sm" onClick={() => setStep("tier")}>
                Change Tier
              </Button>
            </div>

            {/* Scope Notes */}
            {suggestion.scopeNotes && (
              <Card className="p-4 bg-muted/50">
                <Label className="text-sm font-semibold mb-2 block">AI Scope Suggestions:</Label>
                <p className="text-sm text-muted-foreground">{suggestion.scopeNotes}</p>
              </Card>
            )}

            {/* Line Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Line Items</Label>
                <Button onClick={addLineItem} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {lineItems.map((item, index) => (
                <Card key={index} className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Service Item */}
                      <div className="md:col-span-2">
                        <Label htmlFor={`service-${index}`} className="text-sm">
                          Service Item *
                        </Label>
                        <Input
                          id={`service-${index}`}
                          value={item.serviceItem}
                          onChange={(e) => updateLineItem(index, 'serviceItem', e.target.value)}
                          placeholder="e.g., Ridge Cap Rebedding"
                          className="mt-1"
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <Label htmlFor={`desc-${index}`} className="text-sm">
                          Description
                        </Label>
                        <Textarea
                          id={`desc-${index}`}
                          value={item.description}
                          onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                          placeholder="Detailed work description..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>

                      {/* Quantity */}
                      <div>
                        <Label htmlFor={`qty-${index}`} className="text-sm">
                          Quantity *
                        </Label>
                        <Input
                          id={`qty-${index}`}
                          type="number"
                          step="0.01"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                          className="mt-1"
                        />
                      </div>

                      {/* Unit */}
                      <div>
                        <Label htmlFor={`unit-${index}`} className="text-sm">
                          Unit *
                        </Label>
                        <Select
                          value={item.unit}
                          onValueChange={(value) => updateLineItem(index, 'unit', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ea">Each (ea)</SelectItem>
                            <SelectItem value="ridge">Ridge Cap</SelectItem>
                            <SelectItem value="LM">Linear Meter (LM)</SelectItem>
                            <SelectItem value="m²">Square Meter (m²)</SelectItem>
                            <SelectItem value="hrs">Hours (hrs)</SelectItem>
                            <SelectItem value="lot">Lot</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Unit Rate */}
                      <div>
                        <Label htmlFor={`rate-${index}`} className="text-sm">
                          Unit Rate ($) *
                        </Label>
                        <Input
                          id={`rate-${index}`}
                          type="number"
                          step="0.01"
                          value={item.unitRate}
                          onChange={(e) => updateLineItem(index, 'unitRate', e.target.value)}
                          placeholder="0.00"
                          className="mt-1"
                        />
                      </div>

                      {/* Line Total */}
                      <div>
                        <Label className="text-sm">Line Total</Label>
                        <div className="mt-1 h-10 px-3 py-2 bg-muted rounded-md flex items-center font-semibold">
                          ${item.lineTotal.toFixed(2)}
                        </div>
                      </div>

                      {/* Material Spec */}
                      {item.materialSpec && (
                        <div className="md:col-span-2">
                          <Badge variant="secondary" className="text-xs">
                            Suggested: {item.materialSpec}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(index)}
                      className="ml-4 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Quote Notes */}
            <div>
              <Label htmlFor="notes" className="text-sm">
                Quote Notes
              </Label>
              <Textarea
                id="notes"
                value={quoteNotes}
                onChange={(e) => setQuoteNotes(e.target.value)}
                placeholder="Additional notes, terms, warranty information..."
                rows={3}
                className="mt-1"
              />
            </div>

            <Separator />

            {/* Totals */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Quote Summary</h4>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (10%)</span>
                <span className="font-medium">${gst.toFixed(2)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("tier");
                  setSuggestion(null);
                }}
              >
                Cancel
              </Button>
              
              <Button onClick={handleSaveQuote} disabled={savingQuote}>
                {savingQuote ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Quote
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>

      <RoofMeasurementSelector
        open={roofMeasurementDialogOpen}
        onOpenChange={setRoofMeasurementDialogOpen}
        onSelect={(measurement) => {
          handleImportRoofMeasurement(measurement);
          setStep("build");
        }}
        defaultAddress={report?.siteAddress || ''}
      />
    </Dialog>
  );
}
