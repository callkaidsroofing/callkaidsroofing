import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface ScopeData {
  services: string[];
  roofType: string;
  roofPitch: string;
  complexity: string;
  specialRequirements: string;
}

interface ScopeStepProps {
  value: ScopeData;
  onChange: (scope: ScopeData) => void;
}

const serviceOptions = [
  { id: 'restoration', label: 'Roof Restoration', desc: 'Full restoration with coating' },
  { id: 'painting', label: 'Roof Painting', desc: '2-coat membrane system' },
  { id: 'rebedding', label: 'Re-bedding & Re-pointing', desc: 'Ridge cap maintenance' },
  { id: 'cleaning', label: 'Pressure Washing', desc: 'Deep clean with biocide' },
  { id: 'repairs', label: 'Repairs', desc: 'Tiles, valleys, gutters' },
  { id: 'waterproofing', label: 'Waterproofing', desc: 'Valley sealing' },
];

const roofTypes = ['Terracotta Tiles', 'Concrete Tiles', 'Colorbond', 'Slate', 'Other'];
const pitchOptions = ['Low Pitch (<15°)', 'Medium Pitch (15-30°)', 'Steep Pitch (>30°)'];
const complexityOptions = ['Simple', 'Moderate', 'Complex (multi-level, skylights, etc.)'];

export function ScopeStep({ value, onChange }: ScopeStepProps) {
  const toggleService = (serviceId: string) => {
    const updated = value.services.includes(serviceId)
      ? value.services.filter((s) => s !== serviceId)
      : [...value.services, serviceId];
    onChange({ ...value, services: updated });
  };

  const handleChange = (field: keyof ScopeData, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Services Required</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {serviceOptions.map((service) => (
            <Card
              key={service.id}
              className={`p-4 cursor-pointer transition-all ${
                value.services.includes(service.id)
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-muted-foreground/50'
              }`}
              onClick={() => toggleService(service.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={value.services.includes(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                />
                <div className="flex-1">
                  <div className="font-medium">{service.label}</div>
                  <div className="text-xs text-muted-foreground">{service.desc}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Roof Type</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {roofTypes.map((type) => (
              <Badge
                key={type}
                variant={value.roofType === type ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleChange('roofType', type)}
              >
                {type}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label>Roof Pitch</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {pitchOptions.map((pitch) => (
              <Badge
                key={pitch}
                variant={value.roofPitch === pitch ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => handleChange('roofPitch', pitch)}
              >
                {pitch}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label>Complexity</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {complexityOptions.map((comp) => (
            <Badge
              key={comp}
              variant={value.complexity === comp ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleChange('complexity', comp)}
            >
              {comp}
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="specialReq">Special Requirements / Notes</Label>
        <Textarea
          id="specialReq"
          value={value.specialRequirements}
          onChange={(e) => handleChange('specialRequirements', e.target.value)}
          placeholder="e.g., Solar panels, heritage tiles, specific colour requirements..."
          rows={4}
          className="mt-2"
        />
      </div>
    </div>
  );
}
