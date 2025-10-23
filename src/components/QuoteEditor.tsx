import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface QuoteLineItem {
  id?: string;
  service_item: string;
  description: string;
  quantity: number;
  unit: string;
  unit_rate: number;
  line_total: number;
  sort_order: number;
}

interface Quote {
  id: string;
  quote_number: string;
  client_name: string;
  site_address: string;
  suburb_postcode: string;
  email: string;
  phone: string;
  tier_level: string;
  notes: string;
  subtotal: number;
  gst: number;
  total: number;
  valid_until: string;
}

interface QuoteEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quoteId: string;
  onSaved?: () => void;
}

export const QuoteEditor = ({ open, onOpenChange, quoteId, onSaved }: QuoteEditorProps) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [lineItems, setLineItems] = useState<QuoteLineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && quoteId) {
      fetchQuoteData();
    }
  }, [open, quoteId]);

  const fetchQuoteData = async () => {
    try {
      setLoading(true);
      
      const { data: quoteData, error: quoteError } = await supabase
        .from('quotes')
        .select('*')
        .eq('id', quoteId)
        .single();

      if (quoteError) throw quoteError;

      const { data: lineItemsData, error: lineItemsError } = await supabase
        .from('quote_line_items')
        .select('*')
        .eq('quote_id', quoteId)
        .order('sort_order');

      if (lineItemsError) throw lineItemsError;

      setQuote(quoteData);
      setLineItems(lineItemsData || []);
    } catch (error) {
      console.error('Error fetching quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to load quote data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLineItemChange = (index: number, field: keyof QuoteLineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    // Recalculate line total if quantity or unit rate changes
    if (field === 'quantity' || field === 'unit_rate') {
      const qty = field === 'quantity' ? parseFloat(value) : updated[index].quantity;
      const rate = field === 'unit_rate' ? parseFloat(value) : updated[index].unit_rate;
      updated[index].line_total = qty * rate;
    }

    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        service_item: '',
        description: '',
        quantity: 1,
        unit: 'item',
        unit_rate: 0,
        line_total: 0,
        sort_order: lineItems.length,
      },
    ]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);
    const gst = subtotal * 0.1;
    const total = subtotal + gst;
    return { subtotal, gst, total };
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { subtotal, gst, total } = calculateTotals();

      // Update quote totals
      const { error: quoteError } = await supabase
        .from('quotes')
        .update({
          subtotal,
          gst,
          total,
          notes: quote?.notes,
        })
        .eq('id', quoteId);

      if (quoteError) throw quoteError;

      // Delete existing line items  
      const { error: deleteError } = await supabase
        .from('quote_line_items')
        .delete()
        .eq('quote_id', quoteId);

      if (deleteError) throw deleteError;

      // Insert updated line items (only if there are items to insert)
      if (lineItems.length > 0) {
        const itemsToInsert = lineItems
          .filter(item => item.service_item.trim()) // Only insert items with service names
          .map((item, index) => ({
            quote_id: quoteId,
            service_item: item.service_item.trim(),
            description: item.description?.trim() || '',
            quantity: parseFloat(String(item.quantity)) || 0,
            unit: item.unit?.trim() || 'ea',
            unit_rate: parseFloat(String(item.unit_rate)) || 0,
            line_total: parseFloat(String(item.line_total)) || 0,
            sort_order: index,
          }));

        if (itemsToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('quote_line_items')
            .insert(itemsToInsert);

          if (insertError) throw insertError;
        }
      }

      toast({
        title: 'Success',
        description: 'Quote updated successfully',
      });

      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving quote:', error);
      toast({
        title: 'Error',
        description: 'Failed to save quote',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const totals = calculateTotals();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Edit Quote - {quote?.quote_number}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Client Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Client</p>
                <p className="font-medium">{quote?.client_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">
                  {quote?.site_address}, {quote?.suburb_postcode}
                </p>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-base">Quote Items</Label>
                <Button onClick={addLineItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Service</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="w-[100px]">Qty</TableHead>
                      <TableHead className="w-[100px]">Unit</TableHead>
                      <TableHead className="w-[120px]">Rate</TableHead>
                      <TableHead className="w-[120px]">Total</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Input
                            value={item.service_item}
                            onChange={(e) =>
                              handleLineItemChange(index, 'service_item', e.target.value)
                            }
                            placeholder="Service name"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              handleLineItemChange(index, 'description', e.target.value)
                            }
                            placeholder="Description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleLineItemChange(index, 'quantity', e.target.value)
                            }
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.unit}
                            onChange={(e) =>
                              handleLineItemChange(index, 'unit', e.target.value)
                            }
                            placeholder="m², LM, etc."
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.unit_rate}
                            onChange={(e) =>
                              handleLineItemChange(index, 'unit_rate', e.target.value)
                            }
                            min="0"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${item.line_total.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={quote?.notes || ''}
                onChange={(e) => setQuote({ ...quote!, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes..."
              />
            </div>

            {/* Totals */}
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (10%):</span>
                <span className="font-medium">${totals.gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};