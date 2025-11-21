import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Edit, Trash2, Info, RefreshCw, History, Calculator, Search, Download } from 'lucide-react';
import { PremiumPageHeader } from '@/components/admin/PremiumPageHeader';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { usePricingItems, usePricingConstants, useRefreshPricing, useCalculateFinalPrice } from '@/hooks/usePricing';

const categoryLabels = {
  labour: 'Labour',
  tileMaterials: 'Tile Materials',
  metalMaterials: 'Metal Materials',
  paintAndCoatings: 'Paint & Coatings',
  overheadsAndRepairs: 'Overheads & Repairs'
};

export default function Pricing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('labour');
  
  const { data: constants, isLoading: constantsLoading } = usePricingConstants();
  const { data: items, isLoading: itemsLoading } = usePricingItems(selectedCategory);
  const refreshMutation = useRefreshPricing();
  const calculateFinalPrice = useCalculateFinalPrice();

  const filteredItems = items?.filter(item =>
    item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.usage_notes?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const renderFinancialConstants = () => {
    if (!constants) return null;

    return (
      <Card className="glass-card border-2 border-primary/20 hover-lift">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg sm:text-xl">Financial Constants</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Applied to all pricing calculations</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="font-mono self-start sm:self-center">{constants.constant_id}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border border-blue-200 dark:border-blue-800">
              <div className="text-xs text-muted-foreground mb-1">Material Markup</div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">
                {(constants.material_markup * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border border-amber-200 dark:border-amber-800">
              <div className="text-xs text-muted-foreground mb-1">Contingency</div>
              <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                {(constants.contingency * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border border-green-200 dark:border-green-800">
              <div className="text-xs text-muted-foreground mb-1">Profit Margin</div>
              <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                {(constants.profit_margin * 100).toFixed(0)}%
              </div>
            </div>
            
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border border-purple-200 dark:border-purple-800">
              <div className="text-xs text-muted-foreground mb-1">GST</div>
              <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(constants.gst * 100).toFixed(0)}%
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 sm:p-4 rounded-xl bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Info className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">Last updated: {new Date(constants.updated_at).toLocaleDateString('en-AU')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (constantsLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading pricing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PremiumPageHeader
        icon={DollarSign}
        title="Pricing Management"
        description="Database-backed pricing system with vector search"
        actions={
          <>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary/20 hover:bg-primary/10"
              onClick={handleRefresh}
              disabled={refreshMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-primary/20 hover:bg-primary/10"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </>
        }
      />

      {renderFinancialConstants()}

      <Card className="glass-card border-primary/10">
        <CardHeader className="pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search pricing items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 glass-card p-1.5 h-auto gap-1">
              {Object.entries(categoryLabels).map(([key, label]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg py-2 text-xs sm:text-sm"
                >
                  <div className="text-center">
                    <div className="font-semibold">{label}</div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(categoryLabels).map((category) => (
              <TabsContent key={category} value={category} className="space-y-3 sm:space-y-4">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No items found
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <Card key={item.id} className="glass-card border border-primary/10 hover-lift transition-all duration-300 group">
                      <CardContent className="pt-4 sm:pt-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <h3 className="font-bold text-base sm:text-lg group-hover:text-primary transition-colors truncate">
                                {item.item_name}
                              </h3>
                              <Badge variant="outline" className="font-mono text-xs flex-shrink-0">
                                {item.item_id}
                              </Badge>
                              {item.quality_tier && (
                                <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border-primary/30 flex-shrink-0">
                                  {item.quality_tier}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">Base Cost</span>
                                <div className="text-lg sm:text-xl font-bold text-primary">
                                  ${Number(item.base_cost).toFixed(2)}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">{item.unit_of_measure}</div>
                              </div>
                              
                              <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">Final Price</span>
                                <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                                  ${calculateFinalPrice(Number(item.base_cost))}
                                </div>
                                <div className="text-xs text-muted-foreground">inc GST</div>
                              </div>
                              
                              <div className="space-y-1 col-span-2 md:col-span-1">
                                <span className="text-xs text-muted-foreground">Supplier</span>
                                <div className="text-sm font-medium truncate">{item.preferred_supplier || 'N/A'}</div>
                                {item.supplier_code && (
                                  <div className="text-xs text-muted-foreground font-mono truncate">
                                    {item.supplier_code}
                                  </div>
                                )}
                              </div>
                              
                              <div className="space-y-1 col-span-2 md:col-span-1">
                                <span className="text-xs text-muted-foreground">History</span>
                                {item.version_history && Array.isArray(item.version_history) && item.version_history.length > 0 ? (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="sm" className="h-auto p-0 text-primary hover:text-primary/80">
                                        <History className="h-4 w-4 mr-1" />
                                        {item.version_history.length} versions
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                      <DialogHeader>
                                        <DialogTitle className="truncate">{item.item_name}</DialogTitle>
                                        <DialogDescription>Cost history</DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {item.version_history.map((version: any, idx: number) => (
                                          <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                                            <span className="text-sm">{new Date(version.date).toLocaleDateString('en-AU')}</span>
                                            <span className="font-bold">${version.cost.toFixed(2)}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                ) : (
                                  <span className="text-sm text-muted-foreground">No history</span>
                                )}
                              </div>
                            </div>
                            
                            {item.usage_notes && (
                              <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                                <div className="text-xs text-muted-foreground mb-1">Usage Notes</div>
                                <p className="text-sm break-words">{item.usage_notes}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex sm:flex-col gap-2 self-start">
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 flex-shrink-0">
                              <Edit className="h-4 w-4 text-primary" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-destructive/10 flex-shrink-0">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
