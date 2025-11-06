import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuoteData {
  company_name: string;
  slogan: string;
  client_name: string;
  property_address: string;
  roof_type: string;
  measured_area: string;
  key_lengths: string;
  option1_total: string;
  option2_total: string;
  option3_total: string;
}

interface AIQuoteAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuoteGenerated: (data: QuoteData) => void;
}

export const AIQuoteAssistant = ({ open, onOpenChange, onQuoteGenerated }: AIQuoteAssistantProps) => {
  const [loading, setLoading] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [quoteData, setQuoteData] = useState<QuoteData>({
    company_name: "Call Kaids Roofing",
    slogan: "Proof in Every Roof",
    client_name: "",
    property_address: "",
    roof_type: "",
    measured_area: "",
    key_lengths: "",
    option1_total: "",
    option2_total: "",
    option3_total: ""
  });

  const handleAIAssist = async () => {
    if (!aiInput.trim()) {
      toast.error("Please describe the quote details");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-quote-helper', {
        body: { 
          prompt: aiInput,
          currentData: quoteData 
        }
      });

      if (error) throw error;

      if (data?.quoteData) {
        setQuoteData(prev => ({ ...prev, ...data.quoteData }));
        toast.success("Quote data generated successfully!");
        setAiInput("");
      }
    } catch (error: any) {
      console.error('AI assist error:', error);
      if (error.message?.includes('429')) {
        toast.error("Rate limit reached. Please wait a moment and try again.");
      } else if (error.message?.includes('402')) {
        toast.error("AI credits exhausted. Please add credits in Settings.");
      } else {
        toast.error("Failed to generate quote data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!quoteData.client_name || !quoteData.property_address) {
      toast.error("Please provide at least client name and property address");
      return;
    }
    onQuoteGenerated(quoteData);
    onOpenChange(false);
    toast.success("Quote document ready!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Quote Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* AI Input Section */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
            <Label className="text-sm font-semibold mb-2 block">
              Describe the quote (AI will extract details)
            </Label>
            <div className="flex gap-2">
              <Textarea
                placeholder="E.g., 'Create quote for John Smith at 123 Main St, Berwick. Concrete tile roof, 180m², ridge 45m, valley 12m. Full restoration $8500, repairs only $3500, premium $12500'"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="min-h-[100px]"
                disabled={loading}
              />
              <Button
                onClick={handleAIAssist}
                disabled={loading || !aiInput.trim()}
                size="icon"
                className="shrink-0"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              💡 Tip: Include client name, address, roof type, measurements, and pricing options
            </p>
          </div>

          {/* Manual Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name">Client Name *</Label>
              <Input
                id="client_name"
                value={quoteData.client_name}
                onChange={(e) => setQuoteData(prev => ({ ...prev, client_name: e.target.value }))}
                placeholder="John Smith"
              />
            </div>

            <div>
              <Label htmlFor="property_address">Property Address *</Label>
              <Input
                id="property_address"
                value={quoteData.property_address}
                onChange={(e) => setQuoteData(prev => ({ ...prev, property_address: e.target.value }))}
                placeholder="123 Main St, Berwick VIC 3806"
              />
            </div>

            <div>
              <Label htmlFor="roof_type">Roof Type</Label>
              <Input
                id="roof_type"
                value={quoteData.roof_type}
                onChange={(e) => setQuoteData(prev => ({ ...prev, roof_type: e.target.value }))}
                placeholder="Concrete Tile"
              />
            </div>

            <div>
              <Label htmlFor="measured_area">Measured Area</Label>
              <Input
                id="measured_area"
                value={quoteData.measured_area}
                onChange={(e) => setQuoteData(prev => ({ ...prev, measured_area: e.target.value }))}
                placeholder="180 m²"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="key_lengths">Key Lengths (Ridge, Valley, etc.)</Label>
              <Input
                id="key_lengths"
                value={quoteData.key_lengths}
                onChange={(e) => setQuoteData(prev => ({ ...prev, key_lengths: e.target.value }))}
                placeholder="Ridge 45m, Valley 12m"
              />
            </div>

            <div>
              <Label htmlFor="option1_total">Option 1 Total (inc GST)</Label>
              <Input
                id="option1_total"
                value={quoteData.option1_total}
                onChange={(e) => setQuoteData(prev => ({ ...prev, option1_total: e.target.value }))}
                placeholder="$3,500"
              />
            </div>

            <div>
              <Label htmlFor="option2_total">Option 2 Total (inc GST)</Label>
              <Input
                id="option2_total"
                value={quoteData.option2_total}
                onChange={(e) => setQuoteData(prev => ({ ...prev, option2_total: e.target.value }))}
                placeholder="$8,500"
              />
            </div>

            <div>
              <Label htmlFor="option3_total">Option 3 Total (inc GST)</Label>
              <Input
                id="option3_total"
                value={quoteData.option3_total}
                onChange={(e) => setQuoteData(prev => ({ ...prev, option3_total: e.target.value }))}
                placeholder="$12,500"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate}>
              Generate Quote Document
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
