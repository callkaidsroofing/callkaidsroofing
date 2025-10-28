import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [priceBook, setPriceBook] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchPriceBook();
  }, []);

  const fetchPriceBook = async () => {
    const { data, error } = await supabase
      .from('price_book')
      .select('*')
      .eq('is_active', true)
      .order('category');

    if (!error && data) {
      setPriceBook(data);
    }
  };

  const addItem = (item: any) => {
    const lineItem: LineItem = {
      id: crypto.randomUUID(),
      service_code: item.service_code,
      display_name: item.display_name,
      description: item.description || '',
      quantity: 1,
      unit: item.unit,
      unit_rate: item.base_rate,
      line_total: item.base_rate,
      category: item.category,
    };
    onChange([...value, lineItem]);
    toast({ title: 'Item added', description: item.display_name });
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

  const categories = ['all', ...Array.from(new Set(priceBook.map((i) => i.category)))];
  const filteredItems = priceBook.filter(
    (item) =>
      (selectedCategory === 'all' || item.category === selectedCategory) &&
      (item.display_name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase()))
  );

  const runningTotal = value.reduce((sum, item) => sum + item.line_total, 0);

  return (
    <div className="space-y-4">
      {/* Price Book Browser */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Add from Price Book</h3>
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
                {cat === 'all' ? 'All' : cat}
              </Badge>
            ))}
          </div>
          <div className="grid gap-2 max-h-[200px] overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{item.display_name}</div>
                  <div className="text-xs text-muted-foreground">{item.description}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    ${item.base_rate} per {item.unit}
                  </div>
                </div>
                <Button size="sm" onClick={() => addItem(item)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
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
