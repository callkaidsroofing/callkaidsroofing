import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface MeasurementsData {
  ridgeCaps?: number;
  brokenTiles?: number;
  gableLengthTiles?: number;
  gableLengthLM?: number;
  valleyLength?: number;
  gutterPerimeter?: number;
  roofArea?: number;
}

interface MeasurementsStepProps {
  value: MeasurementsData;
  onChange: (data: MeasurementsData) => void;
}

export function MeasurementsStep({ value, onChange }: MeasurementsStepProps) {
  const handleAIAssist = () => {
    // Placeholder for AI measurement tool
    alert('AI measurement assistant coming soon!');
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-primary/5 border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">AI Measurement Assistant</h4>
            <p className="text-sm text-muted-foreground">
              Use Google Maps or Nearmap to auto-calculate roof dimensions
            </p>
          </div>
          <Button onClick={handleAIAssist} className="gap-2">
            <Sparkles className="h-4 w-4" />
            AI Measure
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold mb-4">Manual Measurements</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="roofArea">Total Roof Area (m²)</Label>
              <Input
                id="roofArea"
                type="number"
                step="0.1"
                value={value.roofArea || ''}
                onChange={(e) =>
                  onChange({ ...value, roofArea: parseFloat(e.target.value) || undefined })
                }
                placeholder="150.5"
              />
            </div>
            <div>
              <Label htmlFor="ridgeCaps">Ridge Caps (count)</Label>
              <Input
                id="ridgeCaps"
                type="number"
                value={value.ridgeCaps || ''}
                onChange={(e) =>
                  onChange({ ...value, ridgeCaps: parseInt(e.target.value) || undefined })
                }
                placeholder="45"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valleyLength">Valley Length (LM)</Label>
              <Input
                id="valleyLength"
                type="number"
                step="0.1"
                value={value.valleyLength || ''}
                onChange={(e) =>
                  onChange({ ...value, valleyLength: parseFloat(e.target.value) || undefined })
                }
                placeholder="12.5"
              />
            </div>
            <div>
              <Label htmlFor="gutterPerimeter">Gutter Perimeter (LM)</Label>
              <Input
                id="gutterPerimeter"
                type="number"
                step="0.1"
                value={value.gutterPerimeter || ''}
                onChange={(e) =>
                  onChange({ ...value, gutterPerimeter: parseFloat(e.target.value) || undefined })
                }
                placeholder="48.0"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gableLengthLM">Gable Length (LM)</Label>
              <Input
                id="gableLengthLM"
                type="number"
                step="0.1"
                value={value.gableLengthLM || ''}
                onChange={(e) =>
                  onChange({ ...value, gableLengthLM: parseFloat(e.target.value) || undefined })
                }
                placeholder="8.0"
              />
            </div>
            <div>
              <Label htmlFor="brokenTiles">Broken Tiles (count)</Label>
              <Input
                id="brokenTiles"
                type="number"
                value={value.brokenTiles || ''}
                onChange={(e) =>
                  onChange({ ...value, brokenTiles: parseInt(e.target.value) || undefined })
                }
                placeholder="12"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
