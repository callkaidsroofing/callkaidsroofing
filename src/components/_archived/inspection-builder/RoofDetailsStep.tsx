import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RoofDetailsData {
  claddingType: string;
  tileProfile?: string;
  tileColour?: string;
  ageApprox?: string;
  roofPitch?: string;
}

interface RoofDetailsStepProps {
  value: RoofDetailsData;
  onChange: (data: RoofDetailsData) => void;
}

export function RoofDetailsStep({ value, onChange }: RoofDetailsStepProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="font-semibold mb-4">Roof Identification</h3>

        <div>
          <Label htmlFor="claddingType">Cladding Type *</Label>
          <Select
            value={value.claddingType}
            onValueChange={(val) => onChange({ ...value, claddingType: val })}
          >
            <SelectTrigger id="claddingType">
              <SelectValue placeholder="Select cladding type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Concrete Tile">Concrete Tile</SelectItem>
              <SelectItem value="Terracotta Tile">Terracotta Tile</SelectItem>
              <SelectItem value="Metal (Colorbond)">Metal (Colorbond)</SelectItem>
              <SelectItem value="Slate">Slate</SelectItem>
              <SelectItem value="Asbestos">Asbestos</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tileProfile">Tile Profile</Label>
            <Input
              id="tileProfile"
              value={value.tileProfile || ''}
              onChange={(e) => onChange({ ...value, tileProfile: e.target.value })}
              placeholder="e.g., Boral Nullarbor"
            />
          </div>
          <div>
            <Label htmlFor="tileColour">Tile Colour</Label>
            <Input
              id="tileColour"
              value={value.tileColour || ''}
              onChange={(e) => onChange({ ...value, tileColour: e.target.value })}
              placeholder="e.g., Terracotta Red"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ageApprox">Approximate Age</Label>
            <Select
              value={value.ageApprox || ''}
              onValueChange={(val) => onChange({ ...value, ageApprox: val })}
            >
              <SelectTrigger id="ageApprox">
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-5 years">0-5 years</SelectItem>
                <SelectItem value="5-10 years">5-10 years</SelectItem>
                <SelectItem value="10-20 years">10-20 years</SelectItem>
                <SelectItem value="20-30 years">20-30 years</SelectItem>
                <SelectItem value="30+ years">30+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="roofPitch">Roof Pitch</Label>
            <Select
              value={value.roofPitch || ''}
              onValueChange={(val) => onChange({ ...value, roofPitch: val })}
            >
              <SelectTrigger id="roofPitch">
                <SelectValue placeholder="Select pitch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low (0-15°)">Low (0-15°)</SelectItem>
                <SelectItem value="Medium (15-30°)">Medium (15-30°)</SelectItem>
                <SelectItem value="Steep (30-45°)">Steep (30-45°)</SelectItem>
                <SelectItem value="Very Steep (45°+)">Very Steep (45°+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}
