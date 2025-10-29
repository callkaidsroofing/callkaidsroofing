import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface RoofPitchSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const commonPitches = [15, 22.5, 30, 35, 40, 45];

export function RoofPitchSelector({ value, onChange }: RoofPitchSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Common Pitches - Quick Select */}
      <div className="flex flex-wrap gap-2">
        {commonPitches.map((pitch) => (
          <Badge
            key={pitch}
            variant={value === pitch ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => onChange(pitch)}
          >
            {pitch}°
          </Badge>
        ))}
      </div>

      {/* Slider for Fine Control */}
      <div className="space-y-2">
        <Slider
          value={[value]}
          onValueChange={(values) => onChange(values[0])}
          min={0}
          max={60}
          step={0.5}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>0°</span>
          <span>30°</span>
          <span>60°</span>
        </div>
      </div>

      {/* Manual Input */}
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          min="0"
          max="90"
          step="0.5"
          className="w-24"
        />
        <span className="text-sm text-muted-foreground">degrees</span>
      </div>

      {/* Visual Reference */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="text-xs text-muted-foreground mb-2">Common Roof Pitches:</div>
        <div className="space-y-1 text-xs">
          <div>• Low Pitch: 10-20° (modern, flat appearance)</div>
          <div>• Standard: 20-30° (most common in Australia)</div>
          <div>• Steep: 35-45° (traditional, effective drainage)</div>
        </div>
      </div>
    </div>
  );
}
