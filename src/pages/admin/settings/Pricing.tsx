import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Plus, Edit, Trash2, TrendingUp, Info, Download, Upload, History, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PremiumPageHeader } from '@/components/admin/PremiumPageHeader';
import { PricingModel, PricingItem, PricingCategory, categoryLabels } from '@/types/pricing';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function Pricing() {
  const { toast } = useToast();
  const [pricingData, setPricingData] = useState<PricingModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PricingItem | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState<PricingItem | null>(null);

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      const response = await fetch('/pricing/KF_02_PRICING_MODEL.json');
      const data = await response.json();
      setPricingData(data);
    } catch (error) {
      toast({
        title: "Failed to load pricing data",
        description: "Could not load KF_02_PRICING_MODEL.json",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateFinalPrice = (baseCost: number) => {
    if (!pricingData) return 0;
    const { materialMarkup, contingency, profitMargin, gst } = pricingData.financialConstants;
    
    const withMarkup = baseCost * (1 + materialMarkup.value);
    const withContingency = withMarkup * (1 + contingency.value);
    const withProfit = withContingency * (1 + profitMargin.value);
    const withGST = withProfit * (1 + gst.value);
    
    return withGST;
  };

  const renderFinancialConstants = () => {
    if (!pricingData) return null;
    const { financialConstants } = pricingData;

    return (
      <Card className="glass-card border-2 border-primary/20 hover-lift">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Financial Constants</CardTitle>
                <CardDescription>Applied to all pricing calculations</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="font-mono">v{pricingData.fileInfo.version}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-muted-foreground mb-1">Material Markup</div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(financialConstants.materialMarkup.value * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {financialConstants.materialMarkup.description}
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border border-amber-200 dark:border-amber-800">
              <div className="text-xs text-muted-foreground mb-1">Contingency</div>
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {(financialConstants.contingency.value * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {financialConstants.contingency.description}
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
              <div className="text-xs text-muted-foreground mb-1">Profit Margin</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(financialConstants.profitMargin.value * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {financialConstants.profitMargin.description}
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-muted-foreground mb-1">GST</div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(financialConstants.gst.value * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                {financialConstants.gst.description}
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="h-4 w-4" />
              <span>Last updated: {new Date(financialConstants.lastUpdated).toLocaleDateString('en-AU')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPricingItems = (category: PricingCategory) => {
    if (!pricingData) return null;
    const items = pricingData[category] as PricingItem[];

    return (
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.itemId} className="glass-card border border-primary/10 hover-lift transition-all duration-300 group">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {item.itemName}
                    </h3>
                    <Badge variant="outline" className="font-mono text-xs">
                      {item.itemId}
                    </Badge>
                    <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-primary/30">
                      {item.qualityTier}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Base Cost</span>
                      <div className="text-xl font-bold text-primary">
                        ${item.baseCost.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.unitOfMeasure}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Final Price (inc GST)</span>
                      <div className="text-xl font-bold text-green-600 dark:text-green-400">
                        ${calculateFinalPrice(item.baseCost).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">{item.unitOfMeasure}</div>
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Supplier</span>
                      <div className="text-sm font-medium">{item.supplierInfo.preferredSupplier}</div>
                      {item.supplierInfo.supplierCode && (
                        <div className="text-xs text-muted-foreground font-mono">
                          {item.supplierInfo.supplierCode}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Version History</span>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-auto p-0 text-primary hover:text-primary/80">
                            <History className="h-4 w-4 mr-1" />
                            {item.versionHistory.length} versions
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{item.itemName} - Version History</DialogTitle>
                            <DialogDescription>Cost changes over time</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-2">
                            {item.versionHistory.map((version, idx) => (
                              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                <span className="text-sm">{new Date(version.date).toLocaleDateString('en-AU')}</span>
                                <span className="font-bold">${version.cost.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="text-xs text-muted-foreground mb-1">Usage Notes</div>
                    <p className="text-sm">{item.usageNotes}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" className="hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Button className="w-full gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg">
          <Plus className="h-4 w-4" />
          Add New {categoryLabels[category]} Item
        </Button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pricing model...</p>
        </div>
      </div>
    );
  }

  if (!pricingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Failed to load pricing data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PremiumPageHeader
        icon={DollarSign}
        title="Pricing Management"
        description="KF_02 Pricing Model - Central repository for all billable items"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:bg-primary/10">
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </>
        }
      />

      {renderFinancialConstants()}

      <Tabs defaultValue="labour" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 glass-card p-2 h-auto">
          {(Object.keys(categoryLabels) as PricingCategory[]).map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-3"
            >
              <div className="text-center">
                <div className="font-semibold">{categoryLabels[category]}</div>
                <div className="text-xs opacity-70">{pricingData[category]?.length || 0} items</div>
              </div>
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(categoryLabels) as PricingCategory[]).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {renderPricingItems(category)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
