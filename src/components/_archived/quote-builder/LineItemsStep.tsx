import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical, Search, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchLatestPricing, getCachedServices } from '@/lib/pricingClient';
import type { Service } from '@/lib/kf02';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SmartPricingSuggestions } from '@/components/admin/SmartPricingSuggestions';

interface LineItem {
  id: string;
  service_code: string;
  display_name: string;
  description: string;
  quantity: number;
  unit: string;
  unit_rate: number;
  line_total: number;
  category: string;
}

interface LineItemsStepProps {
  value: LineItem[];
  onChange: (items: LineItem[]) => void;
}

export function LineItemsStep({ value, onChange }: LineItemsStepProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [tierProfile, setTierProfile] = useState<'REPAIR' | 'RESTORE' | 'PREMIUM'>('RESTORE');
  const [regionalModifier, setRegionalModifier] = useState<number>(1.0);
  const { toast } = useToast();

  useEffect(() => {
    loadPricingModel();
  }, []);

  const loadPricingModel = async () => {
    try {
      setLoading(true);
      await fetchLatestPricing();
      const kf02Services = getCachedServices();
      setServices(kf02Services);
    } catch (error: any) {
      toast({
        title: 'Failed to load pricing model',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateServiceRate = (service: Service): number => {
    // Get base or add-on rate
    const baseRate = service.baseRate ?? service.addOnRate ?? 0;
    
    // Apply tier markup (REPAIR: 1.0, RESTORE: 1.15, PREMIUM: 1.35)
    const tierMarkups = { REPAIR: 1.0, RESTORE: 1.15, PREMIUM: 1.35 };
    const tierMarkup = tierMarkups[tierProfile];
    
    // Apply regional modifier (Metro: 1.0, Outer-SE: 1.05, Rural: 1.10)
    const finalRate = baseRate * tierMarkup * regionalModifier;
    
    return parseFloat(finalRate.toFixed(2));
  };

  const addItem = (service: Service) => {
    const rate = calculateServiceRate(service);
    const lineItem: LineItem = {
      id: crypto.randomUUID(),
      service_code: service.serviceCode,
      display_name: service.displayName,
      description: `${service.category}${service.roofType ? ` - ${service.roofType.join(', ')}` : ''}`,
      quantity: 1,
      unit: service.unit,
      unit_rate: rate,
      line_total: rate,
      category: service.category,
    };
    onChange([...value, lineItem]);
    toast({ 
      title: 'Item added', 
      description: `${service.displayName} - $${rate.toFixed(2)} per ${service.unit}` 
    });
  };

  const removeItem = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    const updated = value.map((item) =>
      item.id === id
        ? { ...item, quantity, line_total: quantity * item.unit_rate }
        : item
    );
    onChange(updated);
  };

  const updateRate = (id: string, rate: number) => {
    const updated = value.map((item) =>
      item.id === id
        ? { ...item, unit_rate: rate, line_total: item.quantity * rate }
        : item
    );
    onChange(updated);
  };

  const categories = ['all', ...Array.from(new Set(services.map((s) => s.category)))];
  const filteredItems = services.filter(
    (service) =>
      (selectedCategory === 'all' || service.category === selectedCategory) &&
      (service.displayName.toLowerCase().includes(search.toLowerCase()) ||
        service.serviceCode.toLowerCase().includes(search.toLowerCase()))
  );

  const runningTotal = value.reduce((sum, item) => sum + item.line_total, 0);

  return (
    <div className="space-y-4">
      {/* AI-Powered Pricing Suggestions */}
      {search && search.length > 3 && (
        <SmartPricingSuggestions
          context={search}
          onAddItem={(pricingItem) => {
            const lineItem: LineItem = {
              id: crypto.randomUUID(),
              service_code: pricingItem.item_id,
              display_name: pricingItem.item_name,
              description: pricingItem.usage_notes || pricingItem.item_category,
              quantity: 1,
              unit: pricingItem.unit_of_measure,
              unit_rate: Number(pricingItem.base_cost),
              line_total: Number(pricingItem.base_cost),
              category: pricingItem.item_category,
            };
            onChange([...value, lineItem]);
            toast({ 
              title: 'AI suggestion added', 
              description: `${pricingItem.item_name} from database` 
            });
          }}
        />
      )}

      {/* Pricing Controls */}
      <Card className="p-4 bg-muted/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Tier Profile</Label>
            <Select value={tierProfile} onValueChange={(v: any) => setTierProfile(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REPAIR">Repair (Standard)</SelectItem>
                <SelectItem value="RESTORE">Restore (+15%)</SelectItem>
                <SelectItem value="PREMIUM">Premium (+35%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Region</Label>
            <Select 
              value={regionalModifier.toString()} 
              onValueChange={(v) => setRegionalModifier(parseFloat(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1.0">Metro (Standard)</SelectItem>
                <SelectItem value="1.05">Outer-SE (+5%)</SelectItem>
                <SelectItem value="1.10">Rural (+10%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" className="w-full">
                    <Info className="h-4 w-4 mr-2" />
                    KF_02 Pricing Active
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-xs">Using KF_02 pricing model v7.1 with dynamic tier and regional modifiers. All rates calculated from labour + materials composition.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </Card>

      {/* Service Catalog Browser */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Add from Service Catalog</h3>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading KF_02 pricing model...</div>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'All Services' : cat}
                </Badge>
              ))}
            </div>
            <div className="grid gap-2 max-h-[300px] overflow-y-auto">
              {filteredItems.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No services found. Try a different search or category.
                </div>
              ) : (
                filteredItems.map((service) => {
                  const rate = calculateServiceRate(service);
                  return (
                    <div
                      key={service.serviceCode}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-sm">{service.displayName}</div>
                        <div className="text-xs text-muted-foreground">
                          {service.serviceCode} • {service.category}
                          {service.roofType && ` • ${service.roofType.join(', ')}`}
                        </div>
                        <div className="text-xs text-primary font-semibold mt-1">
                          ${rate.toFixed(2)} per {service.unit}
                        </div>
                      </div>
                      <Button size="sm" onClick={() => addItem(service)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Selected Items */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Quote Line Items ({value.length})</h3>
          <div className="text-lg font-bold text-primary">
            ${runningTotal.toFixed(2)}
          </div>
        </div>

        {value.length === 0 ? (
          <Card className="p-8">
            <p className="text-center text-muted-foreground">
              No items added yet. Select items from the price book above.
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {value.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-move" />
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="font-medium">{item.display_name}</div>
                      <div className="text-xs text-muted-foreground">{item.description}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Quantity</Label>
                        <Input
                          type="number"
                          min="0.1"
                          step="0.1"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Rate (${item.unit})</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unit_rate}
                          onChange={(e) =>
                            updateRate(item.id, parseFloat(e.target.value) || 0)
                          }
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Total</Label>
                        <div className="h-9 flex items-center font-semibold">
                          ${item.line_total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
