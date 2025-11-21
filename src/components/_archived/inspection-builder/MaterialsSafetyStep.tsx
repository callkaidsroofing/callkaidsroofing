import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MaterialsSafetyData {
  pointingColour?: string;
  beddingCementSand?: string;
  specTileProfile?: string;
  specTileColour?: string;
  paintSystem?: string;
  paintColour?: string;
  flashings?: string;
  otherMaterials?: string;
  heightStoreys?: string;
  safetyRailNeeded?: boolean;
  accessNotes?: string;
}

interface MaterialsSafetyStepProps {
  value: MaterialsSafetyData;
  onChange: (data: MaterialsSafetyData) => void;
}

export function MaterialsSafetyStep({ value, onChange }: MaterialsSafetyStepProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Material Specifications</h3>
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pointingColour">Pointing Colour</Label>
              <Input
                id="pointingColour"
                value={value.pointingColour || ''}
                onChange={(e) => onChange({ ...value, pointingColour: e.target.value })}
                placeholder="e.g., Terracotta"
              />
            </div>
            <div>
              <Label htmlFor="beddingCementSand">Bedding (Cement:Sand)</Label>
              <Input
                id="beddingCementSand"
                value={value.beddingCementSand || ''}
                onChange={(e) => onChange({ ...value, beddingCementSand: e.target.value })}
                placeholder="e.g., 3:1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="specTileProfile">Tile Profile (if replacing)</Label>
              <Input
                id="specTileProfile"
                value={value.specTileProfile || ''}
                onChange={(e) => onChange({ ...value, specTileProfile: e.target.value })}
                placeholder="e.g., Boral Nullarbor"
              />
            </div>
            <div>
              <Label htmlFor="specTileColour">Tile Colour (if replacing)</Label>
              <Input
                id="specTileColour"
                value={value.specTileColour || ''}
                onChange={(e) => onChange({ ...value, specTileColour: e.target.value })}
                placeholder="e.g., Terracotta Red"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="paintSystem">Paint System</Label>
              <Input
                id="paintSystem"
                value={value.paintSystem || ''}
                onChange={(e) => onChange({ ...value, paintSystem: e.target.value })}
                placeholder="e.g., Dulux AcraTex"
              />
            </div>
            <div>
              <Label htmlFor="paintColour">Paint Colour</Label>
              <Input
                id="paintColour"
                value={value.paintColour || ''}
                onChange={(e) => onChange({ ...value, paintColour: e.target.value })}
                placeholder="e.g., Monument"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="flashings">Flashings/Valley Irons</Label>
            <Input
              id="flashings"
              value={value.flashings || ''}
              onChange={(e) => onChange({ ...value, flashings: e.target.value })}
              placeholder="e.g., Colorbond Surfmist 0.48mm"
            />
          </div>

          <div>
            <Label htmlFor="otherMaterials">Other Materials</Label>
            <Textarea
              id="otherMaterials"
              value={value.otherMaterials || ''}
              onChange={(e) => onChange({ ...value, otherMaterials: e.target.value })}
              placeholder="Additional material specs..."
              rows={3}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Safety & Access</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="heightStoreys">Height (Storeys)</Label>
            <Select
              value={value.heightStoreys || ''}
              onValueChange={(val) => onChange({ ...value, heightStoreys: val })}
            >
              <SelectTrigger id="heightStoreys">
                <SelectValue placeholder="Select height" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single storey">Single storey</SelectItem>
                <SelectItem value="Two storey">Two storey</SelectItem>
                <SelectItem value="Three+ storey">Three+ storey</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="safetyRail"
              checked={value.safetyRailNeeded || false}
              onCheckedChange={(checked) =>
                onChange({ ...value, safetyRailNeeded: checked as boolean })
              }
            />
            <Label htmlFor="safetyRail" className="font-normal cursor-pointer">
              Safety rail/scaffolding needed
            </Label>
          </div>

          <div>
            <Label htmlFor="accessNotes">Access Notes</Label>
            <Textarea
              id="accessNotes"
              value={value.accessNotes || ''}
              onChange={(e) => onChange({ ...value, accessNotes: e.target.value })}
              placeholder="Ladder access points, narrow driveway, power lines, etc."
              rows={3}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
