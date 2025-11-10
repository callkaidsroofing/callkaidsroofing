import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator as CalculatorIcon, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [serviceType, setServiceType] = useState<keyof typeof serviceRates>('roof-restoration');
  const [area, setArea] = useState('');
  const [complexity, setComplexity] = useState('1');
  const [urgency, setUrgency] = useState('1');
  
  const calculateEstimate = () => {
    if (!area || parseFloat(area) <= 0) return 0;
    
    const rate = serviceRates[serviceType];
    const areaValue = parseFloat(area);
    const complexityMultiplier = parseFloat(complexity);
    const urgencyMultiplier = parseFloat(urgency);
    
    const laborCost = rate.base * areaValue * complexityMultiplier * urgencyMultiplier;
    const materialCost = rate.material * areaValue;
    
    return Math.round(laborCost + materialCost);
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <CalculatorIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Quote Calculator</h1>
          <p className="text-muted-foreground">Quick estimation tool for roofing projects</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Enter project information for quick estimate
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

        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle>Estimated Quote</CardTitle>
            <CardDescription>
              Preliminary estimate - use Quote Builder for detailed quotes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Total Estimate</div>
              <div className="text-5xl font-bold text-primary">
                ${estimate.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Includes labor and materials
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <div className="text-xs text-muted-foreground">Base Rate</div>
                <div className="font-semibold">${serviceRates[serviceType].base}/m²</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Material Rate</div>
                <div className="font-semibold">${serviceRates[serviceType].material}/m²</div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleCopyEstimate} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy Estimate
              </Button>
              <Button className="flex-1" onClick={() => window.location.href = '/admin/crm/quotes'}>
                Create Full Quote
              </Button>
            </div>

            <div className="text-xs text-muted-foreground bg-background/50 p-3 rounded">
              <strong>Note:</strong> This is a preliminary estimate only. Final quote may vary based on site inspection, material availability, and specific requirements.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
