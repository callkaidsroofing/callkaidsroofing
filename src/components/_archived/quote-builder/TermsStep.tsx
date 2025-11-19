import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface TermsData {
  deposit_percent: number;
  progress_percent: number;
  final_percent: number;
  payment_terms_days: number;
  warranty_years: string;
  custom_terms: string;
}

interface TermsStepProps {
  total: number;
  value: TermsData;
  onChange: (terms: TermsData) => void;
}

const paymentSchedulePresets = [
  { label: '30/40/30', deposit: 30, progress: 40, final: 30 },
  { label: '30/70 (No Progress)', deposit: 30, progress: 0, final: 70 },
  { label: '50/50', deposit: 50, progress: 0, final: 50 },
  { label: '100% Upfront', deposit: 100, progress: 0, final: 0 },
];

export function TermsStep({ total, value, onChange }: TermsStepProps) {
  const handlePreset = (preset: any) => {
    onChange({
      ...value,
      deposit_percent: preset.deposit,
      progress_percent: preset.progress,
      final_percent: preset.final,
    });
  };

  const handleChange = (field: keyof TermsData, val: any) => {
    onChange({ ...value, [field]: val });
  };

  const depositAmount = (total * value.deposit_percent) / 100;
  const progressAmount = (total * value.progress_percent) / 100;
  const finalAmount = (total * value.final_percent) / 100;
  const percentTotal = value.deposit_percent + value.progress_percent + value.final_percent;

  return (
    <div className="space-y-6">
      {/* Payment Schedule */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Payment Schedule</h3>
        
        <div className="flex gap-2 mb-4 flex-wrap">
          {paymentSchedulePresets.map((preset) => (
            <Badge
              key={preset.label}
              variant={
                value.deposit_percent === preset.deposit &&
                value.progress_percent === preset.progress
                  ? 'default'
                  : 'outline'
              }
              className="cursor-pointer"
              onClick={() => handlePreset(preset)}
            >
              {preset.label}
            </Badge>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="deposit">Deposit %</Label>
            <Input
              id="deposit"
              type="number"
              min="0"
              max="100"
              value={value.deposit_percent}
              onChange={(e) =>
                handleChange('deposit_percent', parseInt(e.target.value) || 0)
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ${depositAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <Label htmlFor="progress">Progress %</Label>
            <Input
              id="progress"
              type="number"
              min="0"
              max="100"
              value={value.progress_percent}
              onChange={(e) =>
                handleChange('progress_percent', parseInt(e.target.value) || 0)
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ${progressAmount.toFixed(2)}
            </p>
          </div>
          <div>
            <Label htmlFor="final">Final %</Label>
            <Input
              id="final"
              type="number"
              min="0"
              max="100"
              value={value.final_percent}
              onChange={(e) =>
                handleChange('final_percent', parseInt(e.target.value) || 0)
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              ${finalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        {percentTotal !== 100 && (
          <Alert variant="destructive">
            <AlertDescription>
              Payment schedule must total 100% (currently {percentTotal}%)
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Other Terms */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Terms & Warranty</h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="paymentDays">Payment Terms (Days)</Label>
            <Input
              id="paymentDays"
              type="number"
              min="0"
              value={value.payment_terms_days}
              onChange={(e) =>
                handleChange('payment_terms_days', parseInt(e.target.value) || 7)
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Net {value.payment_terms_days} days
            </p>
          </div>
          <div>
            <Label htmlFor="warranty">Workmanship Warranty</Label>
            <Input
              id="warranty"
              value={value.warranty_years}
              onChange={(e) => handleChange('warranty_years', e.target.value)}
              placeholder="e.g., 7-10 years"
              className="mt-2"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="customTerms">Custom Terms & Conditions</Label>
          <Textarea
            id="customTerms"
            value={value.custom_terms}
            onChange={(e) => handleChange('custom_terms', e.target.value)}
            placeholder="Add any custom terms, exclusions, or special conditions..."
            rows={6}
            className="mt-2"
          />
        </div>
      </Card>

      {/* Standard Terms Info */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription className="text-xs">
          Standard Call Kaids Roofing terms & conditions will automatically be included
          in the quote document. This includes weather-dependent scheduling, warranty
          details, and liability clauses.
        </AlertDescription>
      </Alert>
    </div>
  );
}
