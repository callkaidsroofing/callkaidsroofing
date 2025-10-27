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
      {/* Header - Responsive */}
      <div className="print:hidden bg-card border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-3 md:px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/internal/v2/data')}
              className="shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Back to Data</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-base md:text-lg font-semibold truncate">Quote Document</h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {quoteData.client_name || "New Quote"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setShowAIAssistant(true)}
              className="gap-2 flex-1 sm:flex-initial"
              size="sm"
            >
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">AI Fill Data</span>
              <span className="sm:hidden">AI Fill</span>
            </Button>
            <Button onClick={handlePrint} size="sm" className="flex-1 sm:flex-initial">
              <span className="hidden sm:inline">Print / Export PDF</span>
              <span className="sm:hidden">Export</span>
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
