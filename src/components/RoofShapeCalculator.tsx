import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator } from 'lucide-react';

interface RoofShapeCalculatorProps {
  onCalculate: (area: number) => void;
  initialPitch?: number;
}

type RoofShape = 'gable' | 'hip' | 'skillion';

export function RoofShapeCalculator({ onCalculate, initialPitch = 30 }: RoofShapeCalculatorProps) {
  const [shape, setShape] = useState<RoofShape>('gable');
  const [length, setLength] = useState<number | ''>('');
  const [width, setWidth] = useState<number | ''>('');
  const [pitch, setPitch] = useState<number>(initialPitch);
  const [calculatedArea, setCalculatedArea] = useState<number | null>(null);

  const calculateArea = () => {
    if (!length || !width || length <= 0 || width <= 0) {
      alert('Please enter valid length and width');
      return;
    }

    const pitchRadians = (pitch * Math.PI) / 180;
    const pitchMultiplier = 1 / Math.cos(pitchRadians);
    
    let area = 0;
    
    switch (shape) {
      case 'gable':
        // Simple gable: length × width × pitch multiplier
        area = Number(length) * Number(width) * pitchMultiplier;
        break;
      case 'hip':
        // Hip roof: add ~5% for the hip cuts
        area = Number(length) * Number(width) * pitchMultiplier * 1.05;
        break;
      case 'skillion':
        // Single slope: same as gable
        area = Number(length) * Number(width) * pitchMultiplier;
        break;
    }

    setCalculatedArea(Math.round(area * 10) / 10); // Round to 1 decimal
  };

  const handleUseCalculation = () => {
    if (calculatedArea) {
      onCalculate(calculatedArea);
    }
  };

  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Calculator className="h-4 w-4" />
          Roof Area Calculator
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shape" className="text-xs">Roof Shape</Label>
            <Select value={shape} onValueChange={(value) => setShape(value as RoofShape)}>
              <SelectTrigger id="shape">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gable">Gable (2 slopes)</SelectItem>
                <SelectItem value="hip">Hip (4 slopes)</SelectItem>
                <SelectItem value="skillion">Skillion (1 slope)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pitch" className="text-xs">Pitch (degrees)</Label>
            <Select value={pitch.toString()} onValueChange={(value) => setPitch(Number(value))}>
              <SelectTrigger id="pitch">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15°</SelectItem>
                <SelectItem value="22.5">22.5°</SelectItem>
                <SelectItem value="30">30°</SelectItem>
                <SelectItem value="35">35°</SelectItem>
                <SelectItem value="40">40°</SelectItem>
                <SelectItem value="45">45°</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length" className="text-xs">Length (m)</Label>
            <Input
              id="length"
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g., 12"
              step="0.1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="width" className="text-xs">Width (m)</Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g., 10"
              step="0.1"
            />
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={calculateArea}
          disabled={!length || !width}
          className="w-full"
        >
          Calculate Area
        </Button>

        {calculatedArea && (
          <div className="p-3 bg-background rounded-lg border space-y-2">
            <div className="text-sm text-muted-foreground">Calculated Area</div>
            <div className="text-2xl font-bold text-primary">{calculatedArea} m²</div>
            <Button
              type="button"
              size="sm"
              onClick={handleUseCalculation}
              className="w-full"
            >
              Use This Calculation
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          Note: Calculations are estimates. Add 5-10% for waste and cuts.
        </p>
      </CardContent>
    </Card>
  );
}
