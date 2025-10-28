import { useState } from "react";
import { Button } from "@/components/ui/button";
import { QuoteDocumentTemplate } from "@/components/QuoteDocumentTemplate";
import { QuoteDocumentDigital } from "@/components/QuoteDocumentDigital";
import { AIQuoteAssistant } from "@/components/AIQuoteAssistant";
import { ArrowLeft, Sparkles, FileText, Monitor, Upload, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateBrandedPDF } from "@/lib/pdfGenerator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploadField } from "@/components/ImageUploadField";

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
  photos?: {
    before?: string[];
    during?: string[];
    after?: string[];
  };
}

const QuoteDocumentViewer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [activeView, setActiveView] = useState<"digital" | "print">("digital");
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
    option3_total: "$12,500",
    photos: {
      before: [],
      during: [],
      after: []
    }
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById('quote-print-view');
    if (!element) return;

    try {
      await generateBrandedPDF(element, {
        title: `Quote - ${quoteData.client_name}`,
        filename: `CKR-Quote-${quoteData.client_name.replace(/\s/g, '-')}.pdf`,
        orientation: 'portrait'
      });
      toast({
        title: "PDF Generated",
        description: "Quote PDF has been downloaded successfully."
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePhotoUpload = async (category: 'before' | 'during' | 'after', files: FileList | null) => {
    if (!files || files.length === 0) return;

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${i}.${fileExt}`;
      const filePath = `quote-photos/${category}/${fileName}`;

      try {
        const { error: uploadError, data } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }

    if (uploadedUrls.length > 0) {
      setQuoteData(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [category]: [...(prev.photos?.[category] || []), ...uploadedUrls]
        }
      }));
      
      toast({
        title: "Photos Uploaded",
        description: `${uploadedUrls.length} photo(s) added to ${category} section.`
      });
    }
  };

  const handleShareDigitalQuote = async () => {
    const url = `${window.location.origin}/quote/${Date.now()}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link Copied", description: "Digital quote link copied to clipboard." });
    } catch (error) {
      toast({ title: "Copy Failed", description: "Unable to copy link. Please try again.", variant: "destructive" });
    }
  };

  const suggestProjectedImages = async (uploadedUrls: string[]) => {
    if (!uploadedUrls.length) return;

    try {
      // Analyze the first uploaded photo to detect roof characteristics
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke('analyze-image', {
        body: {
          imageUrl: uploadedUrls[0],
          analysisType: 'roof_condition',
          conversationId: null,
        },
      });

      if (analysisError) throw analysisError;

      const analysis = analysisData?.analysis || {};
      const roofType = analysis.roofType?.toLowerCase() || '';
      const materials = analysis.materials?.toLowerCase() || '';

      // Query media_assets for matching "after" photos
      let query = supabase
        .from('media_assets' as any)
        .select('file_path, kind, tags, meta')
        .eq('kind', 'photo')
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: assets, error: assetsError } = await query;

      if (assetsError) throw assetsError;

      // Filter and score assets based on roof type/material match
      const scoredAssets = (assets || []).map((asset: any) => {
        let score = 0;
        const tags = (asset.tags || []).map((t: string) => t.toLowerCase()).join(' ');
        const metaStr = JSON.stringify(asset.meta || {}).toLowerCase();
        const searchText = `${tags} ${metaStr}`;

        // Prioritize "after", "completed", "restoration" tagged images
        if (searchText.includes('after') || searchText.includes('completed') || searchText.includes('restoration')) score += 10;
        if (searchText.includes('premium') || searchText.includes('painted')) score += 5;

        // Match roof type (concrete, terracotta, metal, etc.)
        if (roofType && searchText.includes(roofType)) score += 8;
        
        // Match materials
        if (materials && searchText.includes(materials)) score += 6;

        // Avoid "before", "damage", "defect"
        if (searchText.includes('before') || searchText.includes('damage') || searchText.includes('defect')) score -= 5;

        return { asset, score };
      });

      // Sort by score and get top 3
      const topAssets = scoredAssets
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ asset }) => supabase.storage.from('media').getPublicUrl(asset.file_path).data.publicUrl);

      if (topAssets.length > 0) {
        setQuoteData(prev => ({
          ...prev,
          photos: { ...prev.photos, after: topAssets }
        }));
        
        toast({
          title: "AI-Matched Results",
          description: `Found ${topAssets.length} projected result image(s) matching ${roofType || 'detected roof type'}.`
        });
      } else {
        // Fallback: use recent "after" tagged photos
        const fallback = (assets || [])
          .filter((a: any) => {
            const tags = (a.tags || []).join(' ').toLowerCase();
            return tags.includes('after') || tags.includes('completed');
          })
          .slice(0, 3)
          .map((a: any) => supabase.storage.from('media').getPublicUrl(a.file_path).data.publicUrl);

        if (fallback.length) {
          setQuoteData(prev => ({
            ...prev,
            photos: { ...prev.photos, after: fallback }
          }));
        }
      }
    } catch (e) {
      console.error('suggestProjectedImages error', e);
      toast({
        title: "AI Matching Failed",
        description: "Using recent photos instead.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Responsive */}
      <div className="print:hidden bg-card border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-3 md:px-6 py-3 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
                <h1 className="text-base md:text-lg font-semibold truncate">Quote Builder</h1>
                <p className="text-xs md:text-sm text-muted-foreground truncate">
                  {quoteData.client_name || "New Quote"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <Button
                variant="outline"
                onClick={() => setShowAIAssistant(true)}
                className="gap-2 flex-1 sm:flex-initial"
                size="sm"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">AI Fill</span>
                <span className="md:hidden">AI</span>
              </Button>
              
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-initial" asChild>
                  <span>
                    <Upload className="w-4 h-4" />
                    <span className="hidden md:inline">Photos</span>
                  </span>
                </Button>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  className="hidden"
                  onChange={(e) => handlePhotoUpload('before', e.target.files)}
                />
              </label>

              {activeView === "digital" && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleShareDigitalQuote}
                  className="gap-2 flex-1 sm:flex-initial"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden md:inline">Share Link</span>
                  <span className="md:hidden">Share</span>
                </Button>
              )}

              {activeView === "print" && (
                <Button 
                  onClick={handleExportPDF} 
                  size="sm" 
                  className="flex-1 sm:flex-initial gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden md:inline">Export PDF</span>
                  <span className="md:hidden">PDF</span>
                </Button>
              )}
            </div>
          </div>

          <Tabs value={activeView} onValueChange={(v) => setActiveView(v as "digital" | "print")} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="digital" className="gap-2">
                <Monitor className="w-4 h-4" />
                Digital Quote
              </TabsTrigger>
              <TabsTrigger value="print" className="gap-2">
                <FileText className="w-4 h-4" />
                Print PDF
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-6 py-6 space-y-6">
        {/* AI Summary & Inspection Photos */}
        <Card>
          <CardHeader>
            <CardTitle>AI Summary & Photos</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUploadField
              label="Upload inspection photos for AI analysis"
              name="roof_condition_photos"
              value={quoteData.photos?.before || []}
              onChange={async (_name, urls) => {
                const newUrls = urls.filter(u => !(quoteData.photos?.before || []).includes(u));
                setQuoteData(prev => ({
                  ...prev,
                  photos: { ...prev.photos, before: urls }
                }));
                if (newUrls.length > 0) {
                  await suggestProjectedImages(newUrls);
                }
              }}
              helpText="We'll analyze roof type & materials, then auto-suggest matching 'after' images."
            />
          </CardContent>
        </Card>
        {activeView === "digital" ? (
          <Card className="overflow-hidden">
            <QuoteDocumentDigital data={quoteData} />
          </Card>
        ) : (
          <div id="quote-print-view">
            <QuoteDocumentTemplate data={quoteData} onPrint={handlePrint} />
          </div>
        )}
      </div>

      <AIQuoteAssistant
        open={showAIAssistant}
        onOpenChange={setShowAIAssistant}
        onQuoteGenerated={setQuoteData}
      />
    </div>
  );
};

export default QuoteDocumentViewer;
