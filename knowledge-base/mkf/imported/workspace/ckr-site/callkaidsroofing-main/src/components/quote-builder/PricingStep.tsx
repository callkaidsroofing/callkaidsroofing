import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PricingData {
  subtotal: number;
  discount_amount: number;
  discount_reason: string;
  gst: number;
  total: number;
}

interface PricingStepProps {
  lineItemsTotal: number;
  value: PricingData;
  onChange: (pricing: PricingData) => void;
}

const discountPresets = [
  { label: 'Senior (10%)', value: 10 },
  { label: 'Referral (5%)', value: 5 },
  { label: 'Repeat Client (7%)', value: 7 },
];

export function PricingStep({ lineItemsTotal, value, onChange }: PricingStepProps) {
  const calculatePricing = (subtotal: number, discountPercent: number): PricingData => {
    const discountAmount = subtotal * (discountPercent / 100);
    const afterDiscount = subtotal - discountAmount;
    const gst = afterDiscount * 0.1;
    const total = afterDiscount + gst;

    return {
      subtotal,
      discount_amount: discountAmount,
      discount_reason: value.discount_reason,
      gst,
      total,
    };
  };

  const handleDiscountChange = (percent: number, reason?: string) => {
    const updated = calculatePricing(lineItemsTotal, percent);
    if (reason) updated.discount_reason = reason;
    onChange(updated);
  };

  const handleReasonChange = (reason: string) => {
    onChange({ ...value, discount_reason: reason });
  };

  const currentDiscountPercent =
    lineItemsTotal > 0 ? (value.discount_amount / lineItemsTotal) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Price Breakdown</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-lg">
            <span className="text-muted-foreground">Line Items Subtotal:</span>
            <span className="font-semibold">${lineItemsTotal.toFixed(2)}</span>
          </div>

          <Separator />

          {/* Discount Section */}
          <div>
            <Label>Discount</Label>
            <div className="flex gap-2 mt-2 mb-3 flex-wrap">
              {discountPresets.map((preset) => (
                <Badge
                  key={preset.label}
                  variant={
                    Math.abs(currentDiscountPercent - preset.value) < 0.1
                      ? 'default'
                      : 'outline'
                  }
                  className="cursor-pointer"
                  onClick={() => handleDiscountChange(preset.value, preset.label)}
                >
                  {preset.label}
                </Badge>
              ))}
              <Badge
                variant={currentDiscountPercent === 0 ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleDiscountChange(0, '')}
              >
                No Discount
              </Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="discountPercent" className="text-xs">
                  Discount %
                </Label>
                <Input
                  id="discountPercent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={currentDiscountPercent.toFixed(1)}
                  onChange={(e) =>
                    handleDiscountChange(parseFloat(e.target.value) || 0)
                  }
                  className="h-9"
                />
              </div>
              <div>
                <Label htmlFor="discountAmount" className="text-xs">
                  Discount Amount ($)
                </Label>
                <Input
                  id="discountAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={value.discount_amount.toFixed(2)}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value) || 0;
                    const percent = lineItemsTotal > 0 ? (amount / lineItemsTotal) * 100 : 0;
                    handleDiscountChange(percent);
                  }}
                  className="h-9"
                />
              </div>
            </div>
            {currentDiscountPercent > 0 && (
              <div className="mt-3">
                <Label htmlFor="discountReason" className="text-xs">
                  Discount Reason (optional)
                </Label>
                <Textarea
                  id="discountReason"
                  value={value.discount_reason}
                  onChange={(e) => handleReasonChange(e.target.value)}
                  placeholder="e.g., Senior discount, Referral from John Smith..."
                  rows={2}
                  className="mt-1"
                />
              </div>
            )}
          </div>

          {value.discount_amount > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>After Discount:</span>
              <span>${(lineItemsTotal - value.discount_amount).toFixed(2)}</span>
            </div>
          )}

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">GST (10%):</span>
            <span className="font-medium">${value.gst.toFixed(2)}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between text-2xl">
            <span className="font-bold">Total (Inc GST):</span>
            <span className="font-bold text-primary">${value.total.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Margin Info */}
      <Card className="p-4 bg-muted/30">
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ex GST Total:</span>
            <span className="font-medium">
              ${(value.total / 1.1).toFixed(2)}
            </span>
          </div>
          {value.discount_amount > 0 && (
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Original Subtotal:</span>
              <span>${lineItemsTotal.toFixed(2)}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
