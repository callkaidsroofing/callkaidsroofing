import { useState } from 'react';
import { InspectionData, QuoteData, ScopeItem, PRICING_PRESETS } from './types';
import { calculateScopeItemPricing, calculateTotalPricing, formatCurrency } from './utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calculator } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface QuoteStepProps {
  inspectionData: InspectionData;
  quoteData: QuoteData;
  scopeItems: ScopeItem[];
  onQuoteDataChange: (data: QuoteData) => void;
  onScopeItemsChange: (items: ScopeItem[]) => void;
}

export function QuoteStep({
  inspectionData,
  quoteData,
  scopeItems,
  onQuoteDataChange,
  onScopeItemsChange,
}: QuoteStepProps) {
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ScopeItem>>({
    category: '',
    area: '',
    qty: 0,
    unit: 'lm',
    priority: 'Must Do',
    labour: 0,
    material: 0,
    markup: 30,
    notes: '',
  });

  // Auto-fill quantity based on preset and measurements
  const handlePresetSelect = (presetKey: string) => {
    const preset = PRICING_PRESETS[presetKey];
    if (!preset) return;

    let autoQty = 0;
    let autoArea = '';

    // Auto-fill quantity from measurements
    switch (presetKey) {
      case 'RIDGE_REBED':
        autoQty = inspectionData.ridge_length_lm || 0;
        autoArea = 'Ridge';
        break;
      case 'VALLEY_REPLACE':
        autoQty = inspectionData.valley_length_lm || 0;
        autoArea = 'Valleys';
        break;
      case 'PRESSURE_WASH':
      case 'ROOF_PAINT_TILE':
      case 'ROOF_PAINT_METAL':
        autoQty = inspectionData.roof_area_m2 || 0;
        autoArea = 'Entire Roof';
        break;
      case 'GUTTER_CLEAN':
        autoQty = inspectionData.gutter_length_lm || 0;
        autoArea = 'Perimeter';
        break;
      case 'TILE_REPLACE':
        autoQty = inspectionData.tile_count || 0;
        autoArea = 'Various Locations';
        break;
      default:
        autoQty = 1;
        autoArea = '';
    }

    setNewItem({
      ...newItem,
      category: preset.label,
      area: autoArea,
      qty: autoQty,
      unit: preset.unit,
      labour: preset.labour,
      material: preset.material,
    });
  };

  const handleAddItem = () => {
    if (!newItem.category || !newItem.qty || newItem.qty <= 0) {
      return;
    }

    const pricing = calculateScopeItemPricing(newItem);
    const item: ScopeItem = {
      id: `item-${Date.now()}`,
      category: newItem.category!,
      area: newItem.area || '',
      qty: newItem.qty!,
      unit: newItem.unit || 'lm',
      priority: newItem.priority as any || 'Must Do',
      labour: newItem.labour || 0,
      material: newItem.material || 0,
      markup: newItem.markup || 30,
      notes: newItem.notes || '',
      ...pricing,
    };

    onScopeItemsChange([...scopeItems, item]);
    setNewItem({
      category: '',
      area: '',
      qty: 0,
      unit: 'lm',
      priority: 'Must Do',
      labour: 0,
      material: 0,
      markup: 30,
      notes: '',
    });
    setIsAddingItem(false);
  };

  const handleRemoveItem = (id: string) => {
    onScopeItemsChange(scopeItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: string, updates: Partial<ScopeItem>) => {
    const updatedItems = scopeItems.map((item) => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        const pricing = calculateScopeItemPricing(updated);
        return { ...updated, ...pricing };
      }
      return item;
    });
    onScopeItemsChange(updatedItems);
  };

  const totals = calculateTotalPricing(scopeItems);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Step 2: Quote Builder</h2>
        <p className="text-muted-foreground mb-6">
          Add scope items and pricing for {inspectionData.client_name || 'the client'}
        </p>
      </div>

      {/* Quote Settings */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 text-lg">Quote Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primary_service">Primary Service</Label>
            <Select
              value={quoteData.primary_service}
              onValueChange={(value) =>
                onQuoteDataChange({ ...quoteData, primary_service: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select primary service..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ridge Rebedding & Repointing">
                  Ridge Rebedding & Repointing
                </SelectItem>
                <SelectItem value="Valley Replacement">Valley Replacement</SelectItem>
                <SelectItem value="Roof Painting">Roof Painting</SelectItem>
                <SelectItem value="Roof Restoration">Roof Restoration</SelectItem>
                <SelectItem value="Leak Repair">Leak Repair</SelectItem>
                <SelectItem value="General Maintenance">General Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="document_type">Document Type</Label>
            <Select
              value={quoteData.document_type}
              onValueChange={(value: any) =>
                onQuoteDataChange({ ...quoteData, document_type: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Multi-Option Quote">Multi-Option Quote</SelectItem>
                <SelectItem value="Simple Quote">Simple Quote</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Scope Items */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Scope of Works</h3>
          <Dialog open={isAddingItem} onOpenChange={setIsAddingItem}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Scope Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Pricing Presets */}
                <div>
                  <Label>Quick Select (Auto-fills from measurements)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(PRICING_PRESETS).map(([key, preset]) => (
                      <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetSelect(key)}
                        className="justify-start"
                      >
                        <Calculator className="w-3 h-3 mr-2" />
                        {preset.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="new-category">Category *</Label>
                    <Input
                      id="new-category"
                      value={newItem.category}
                      onChange={(e) =>
                        setNewItem({ ...newItem, category: e.target.value })
                      }
                      placeholder="e.g. Ridge Rebedding & Repointing"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="new-area">Area/Location</Label>
                    <Input
                      id="new-area"
                      value={newItem.area}
                      onChange={(e) => setNewItem({ ...newItem, area: e.target.value })}
                      placeholder="e.g. Front section, Entire roof"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-qty">Quantity *</Label>
                    <Input
                      id="new-qty"
                      type="number"
                      step="0.1"
                      value={newItem.qty || ''}
                      onChange={(e) =>
                        setNewItem({ ...newItem, qty: parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-unit">Unit</Label>
                    <Select
                      value={newItem.unit}
                      onValueChange={(value) => setNewItem({ ...newItem, unit: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lm">lm (linear meters)</SelectItem>
                        <SelectItem value="m²">m² (square meters)</SelectItem>
                        <SelectItem value="item">item</SelectItem>
                        <SelectItem value="fixed">fixed price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="new-labour">Labour (per unit)</Label>
                    <Input
                      id="new-labour"
                      type="number"
                      step="0.01"
                      value={newItem.labour || ''}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          labour: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="$"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-material">Material (per unit)</Label>
                    <Input
                      id="new-material"
                      type="number"
                      step="0.01"
                      value={newItem.material || ''}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          material: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="$"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-markup">Markup %</Label>
                    <Input
                      id="new-markup"
                      type="number"
                      value={newItem.markup || ''}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          markup: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-priority">Priority</Label>
                    <Select
                      value={newItem.priority}
                      onValueChange={(value: any) =>
                        setNewItem({ ...newItem, priority: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Must Do">Must Do</SelectItem>
                        <SelectItem value="Recommended">Recommended</SelectItem>
                        <SelectItem value="Optional">Optional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="new-notes">Notes</Label>
                    <Textarea
                      id="new-notes"
                      value={newItem.notes}
                      onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                      placeholder="Additional details..."
                      rows={2}
                    />
                  </div>
                </div>

                {/* Preview Calculation */}
                {newItem.qty && newItem.qty > 0 && (
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="text-sm font-semibold mb-2">Preview:</div>
                    <div className="text-sm space-y-1">
                      {(() => {
                        const preview = calculateScopeItemPricing(newItem);
                        return (
                          <>
                            <div>Subtotal (ex GST): {formatCurrency(preview.subtotal_ex_gst)}</div>
                            <div>GST: {formatCurrency(preview.gst_amount)}</div>
                            <div className="font-semibold">
                              Total (inc GST): {formatCurrency(preview.total_inc_gst)}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem}>Add Item</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {scopeItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No scope items added yet.</p>
            <p className="text-sm">Click "Add Item" to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="text-right">GST</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scopeItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.category}</TableCell>
                    <TableCell>{item.area}</TableCell>
                    <TableCell className="text-right">{item.qty}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          item.priority === 'Must Do'
                            ? 'bg-red-100 text-red-700'
                            : item.priority === 'Recommended'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.subtotal_ex_gst)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(item.gst_amount)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(item.total_inc_gst)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Totals */}
      {scopeItems.length > 0 && (
        <Card className="p-4 bg-primary/5">
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>Subtotal (ex GST):</span>
              <span className="font-semibold">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>GST (10%):</span>
              <span className="font-semibold">{formatCurrency(totals.gst)}</span>
            </div>
            <div className="flex justify-between text-2xl font-bold text-primary border-t pt-2">
              <span>Total (inc GST):</span>
              <span>{formatCurrency(totals.total)}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
