import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuoteDocumentTemplate } from "@/components/QuoteDocumentTemplate";
import { AIQuoteAssistant } from "@/components/AIQuoteAssistant";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const QuoteDocumentViewer = () => {
  const navigate = useNavigate();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [quoteData, setQuoteData] = useState<QuoteData>({
    company_name: "Call Kaids Roofing",
    slogan: "Proof in Every Roof",
    client_name: "John Smith",
    property_address: "123 Main Street, Berwick VIC 3806",
    roof_type: "Concrete Tile",
    measured_area: "180 m²",
    key_lengths: "Ridge 45m, Valley 12m",
    option1_total: "$3,500",
    option2_total: "$8,500",
    option3_total: "$12,500"
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="print:hidden bg-card border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/internal/quotes')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Quotes
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Quote Document</h1>
              <p className="text-sm text-muted-foreground">
                {quoteData.client_name || "New Quote"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAIAssistant(true)}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Fill Data
            </Button>
            <Button onClick={handlePrint}>
              Print / Export PDF
            </Button>
          </div>
        </div>
      </div>

      <QuoteDocumentTemplate data={quoteData} onPrint={handlePrint} />

      <AIQuoteAssistant
        open={showAIAssistant}
        onOpenChange={setShowAIAssistant}
        onQuoteGenerated={setQuoteData}
      />
    </div>
  );
};

export default QuoteDocumentViewer;
