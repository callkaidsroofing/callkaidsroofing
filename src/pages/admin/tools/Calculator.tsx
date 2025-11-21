import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator as CalculatorIcon, Copy, RefreshCw, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PremiumPageHeader } from '@/components/admin/PremiumPageHeader';
import { SmartPricingSuggestions } from '@/components/admin/SmartPricingSuggestions';
import { usePricingConstants, useRefreshPricing } from '@/hooks/usePricing';

const serviceRates = {
  'roof-restoration': { base: 85, material: 45 },
  'roof-repairs': { base: 120, material: 35 },
  'gutter-replacement': { base: 95, material: 55 },
  'tile-replacement': { base: 110, material: 40 },
  're-bedding': { base: 100, material: 30 },
  'leak-repairs': { base: 150, material: 25 },
};

export default function Calculator() {
  const { toast } = useToast();
  const { data: constants } = usePricingConstants();
  const refreshMutation = useRefreshPricing();
  
  const [serviceType, setServiceType] = useState<keyof typeof serviceRates>('roof-restoration');
  const [area, setArea] = useState('');
  const [complexity, setComplexity] = useState('1');
  const [urgency, setUrgency] = useState('1');
  const [jobDescription, setJobDescription] = useState('');
  
  const calculateEstimate = () => {
    if (!area || parseFloat(area) <= 0) return 0;
    
    const rate = serviceRates[serviceType];
    const areaValue = parseFloat(area);
    const complexityMultiplier = parseFloat(complexity);
    const urgencyMultiplier = parseFloat(urgency);
    
    const baseCost = (rate.base + rate.material) * areaValue * complexityMultiplier * urgencyMultiplier;
    
    // Apply financial constants if available
    if (constants) {
      const withMarkup = baseCost * (1 + constants.material_markup);
      const withContingency = withMarkup * (1 + constants.contingency);
      const withProfit = withContingency * (1 + constants.profit_margin);
      const withGST = withProfit * (1 + constants.gst);
      return Math.round(withGST);
    }
    
    return Math.round(baseCost);
  };

  const estimate = calculateEstimate();

  const handleCopyEstimate = () => {
    navigator.clipboard.writeText(`Estimated Quote: $${estimate.toLocaleString()}`);
    toast({
      title: "Copied to clipboard",
      description: "Estimate has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      <PremiumPageHeader
        icon={CalculatorIcon}
        title="Quote Calculator"
        description="AI-powered pricing with database-backed rates"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Rates</span>
          </Button>
        }
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Card className="glass-card border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Project Details</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Enter information for AI-powered estimate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="service">Service Type</Label>
              <Select value={serviceType} onValueChange={(value: any) => setServiceType(value)}>
                <SelectTrigger id="service">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roof-restoration">Roof Restoration</SelectItem>
                  <SelectItem value="roof-repairs">Roof Repairs</SelectItem>
                  <SelectItem value="gutter-replacement">Gutter Replacement</SelectItem>
                  <SelectItem value="tile-replacement">Tile Replacement</SelectItem>
                  <SelectItem value="re-bedding">Re-bedding & Re-pointing</SelectItem>
                  <SelectItem value="leak-repairs">Leak Repairs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description (for AI suggestions)</Label>
              <Input
                id="description"
                placeholder="E.g., Full restoration with valley iron replacement"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="col-span-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Roof Area (m²)</Label>
              <Input
                id="area"
                type="number"
                placeholder="150"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Complexity Factor</Label>
              <Select value={complexity} onValueChange={setComplexity}>
                <SelectTrigger id="complexity">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.8">Simple (0.8x)</SelectItem>
                  <SelectItem value="1">Standard (1.0x)</SelectItem>
                  <SelectItem value="1.3">Complex (1.3x)</SelectItem>
                  <SelectItem value="1.6">Very Complex (1.6x)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select value={urgency} onValueChange={setUrgency}>
                <SelectTrigger id="urgency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Standard (1.0x)</SelectItem>
                  <SelectItem value="1.2">Urgent (1.2x)</SelectItem>
                  <SelectItem value="1.5">Emergency (1.5x)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="glass-card bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Smart Estimate
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                AI-enhanced pricing with database rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Total Estimate (inc GST)</div>
                <div className="text-4xl sm:text-5xl font-bold text-primary">
                  ${estimate.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  {constants && '✓ Using live database pricing with markup calculations'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                <div>
                  <div className="text-xs text-muted-foreground">Base Rate</div>
                  <div className="font-semibold">${serviceRates[serviceType].base}/m²</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Material Rate</div>
                  <div className="font-semibold">${serviceRates[serviceType].material}/m²</div>
                </div>
                {constants && (
                  <>
                    <div>
                      <div className="text-xs text-muted-foreground">Markup</div>
                      <div className="font-semibold text-blue-600 dark:text-blue-400">
                        {(constants.material_markup * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Profit</div>
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {(constants.profit_margin * 100).toFixed(0)}%
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button onClick={handleCopyEstimate} variant="outline" className="flex-1 gap-2">
                  <Copy className="h-4 w-4" />
                  <span className="hidden sm:inline">Copy Estimate</span>
                  <span className="sm:hidden">Copy</span>
                </Button>
                <Button className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground" onClick={() => window.location.href = '/admin/crm/quotes'}>
                  <span className="hidden sm:inline">Create Full Quote</span>
                  <span className="sm:hidden">Full Quote</span>
                </Button>
              </div>

              <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded-lg border border-border/50">
                <strong>Note:</strong> Preliminary estimate. Final quote may vary based on site inspection and specific requirements.
              </div>
            </CardContent>
          </Card>

          {jobDescription && (
            <SmartPricingSuggestions 
              context={jobDescription}
              onAddItem={(item) => {
                toast({
                  title: "Pricing item selected",
                  description: `${item.item_name} - Base cost: $${Number(item.base_cost).toFixed(2)}`,
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
