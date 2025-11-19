import { InspectionData } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface InspectionStepProps {
  data: InspectionData;
  onChange: (data: InspectionData) => void;
}

export function InspectionStep({ data, onChange }: InspectionStepProps) {
  const handleChange = (field: keyof InspectionData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleNumberChange = (field: keyof InspectionData, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onChange({ ...data, [field]: numValue });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Step 1: Inspection Details</h2>
        <p className="text-muted-foreground mb-6">
          Complete the roof inspection to generate your report.
        </p>
      </div>

      {/* Client Information */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 text-lg">Client Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_name">Client Name *</Label>
            <Input
              id="client_name"
              value={data.client_name}
              onChange={(e) => handleChange('client_name', e.target.value)}
              placeholder="e.g. John Smith"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={data.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="e.g. 0435 900 709"
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="e.g. john@example.com"
            />
          </div>
        </div>
      </Card>

      {/* Property Details */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 text-lg">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="address">Property Address *</Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="e.g. 123 Smith Street"
              required
            />
          </div>
          <div>
            <Label htmlFor="suburb">Suburb *</Label>
            <Input
              id="suburb"
              value={data.suburb}
              onChange={(e) => handleChange('suburb', e.target.value)}
              placeholder="e.g. Clyde North 3978"
              required
            />
          </div>
          <div>
            <Label htmlFor="roof_type">Roof Type *</Label>
            <Select
              value={data.roof_type}
              onValueChange={(value) => handleChange('roof_type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Concrete Tile">Concrete Tile</SelectItem>
                <SelectItem value="Terracotta Tile">Terracotta Tile</SelectItem>
                <SelectItem value="Metal (Colorbond)">Metal (Colorbond)</SelectItem>
                <SelectItem value="Metal (Zincalume)">Metal (Zincalume)</SelectItem>
                <SelectItem value="Slate">Slate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="storey_count">Storeys</Label>
            <Select
              value={data.storey_count}
              onValueChange={(value) => handleChange('storey_count', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Storey">Single Storey</SelectItem>
                <SelectItem value="Two Storey">Two Storey</SelectItem>
                <SelectItem value="Three+ Storey">Three+ Storey</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="access_difficulty">Access</Label>
            <Select
              value={data.access_difficulty}
              onValueChange={(value) => handleChange('access_difficulty', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy">Easy</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Difficult">Difficult</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="urgency_level">Urgency</Label>
            <Select
              value={data.urgency_level}
              onValueChange={(value) => handleChange('urgency_level', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Priority">Priority</SelectItem>
                <SelectItem value="Emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Measurements */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 text-lg">Roof Measurements</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Enter measurements to auto-populate quantities in the quote
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="roof_area_m2">Roof Area (m²)</Label>
            <Input
              id="roof_area_m2"
              type="number"
              step="0.1"
              value={data.roof_area_m2 || ''}
              onChange={(e) => handleNumberChange('roof_area_m2', e.target.value)}
              placeholder="e.g. 150"
            />
            <p className="text-xs text-muted-foreground mt-1">
              For painting, pressure washing
            </p>
          </div>
          <div>
            <Label htmlFor="ridge_length_lm">Ridge Length (lm)</Label>
            <Input
              id="ridge_length_lm"
              type="number"
              step="0.1"
              value={data.ridge_length_lm || ''}
              onChange={(e) => handleNumberChange('ridge_length_lm', e.target.value)}
              placeholder="e.g. 25"
            />
            <p className="text-xs text-muted-foreground mt-1">
              For rebedding/repointing
            </p>
          </div>
          <div>
            <Label htmlFor="valley_length_lm">Valley Length (lm)</Label>
            <Input
              id="valley_length_lm"
              type="number"
              step="0.1"
              value={data.valley_length_lm || ''}
              onChange={(e) => handleNumberChange('valley_length_lm', e.target.value)}
              placeholder="e.g. 12"
            />
            <p className="text-xs text-muted-foreground mt-1">
              For valley replacement
            </p>
          </div>
          <div>
            <Label htmlFor="gutter_length_lm">Gutter Length (lm)</Label>
            <Input
              id="gutter_length_lm"
              type="number"
              step="0.1"
              value={data.gutter_length_lm || ''}
              onChange={(e) => handleNumberChange('gutter_length_lm', e.target.value)}
              placeholder="e.g. 40"
            />
            <p className="text-xs text-muted-foreground mt-1">
              For gutter cleaning
            </p>
          </div>
          <div>
            <Label htmlFor="tile_count">Number of Tiles</Label>
            <Input
              id="tile_count"
              type="number"
              value={data.tile_count || ''}
              onChange={(e) => handleNumberChange('tile_count', e.target.value)}
              placeholder="e.g. 15"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Broken/damaged tiles
            </p>
          </div>
          <div>
            <Label htmlFor="roof_pitch">Roof Pitch</Label>
            <Select
              value={data.roof_pitch || ''}
              onValueChange={(value) => handleChange('roof_pitch', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pitch..." />
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
      </Card>

      {/* Roof Condition Assessment */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 text-lg">Roof Condition Assessment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ridge_condition">Ridge Condition</Label>
            <Select
              value={data.ridge_condition}
              onValueChange={(value) => handleChange('ridge_condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="valley_condition">Valley Condition</Label>
            <Select
              value={data.valley_condition}
              onValueChange={(value) => handleChange('valley_condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Rusted">Rusted</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="tile_condition">Tile/Sheet Condition</Label>
            <Select
              value={data.tile_condition}
              onValueChange={(value) => handleChange('tile_condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Minor Damage">Minor Damage</SelectItem>
                <SelectItem value="Multiple Broken">Multiple Broken</SelectItem>
                <SelectItem value="Needs Replacement">Needs Replacement</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="gutter_condition">Gutter Condition</Label>
            <Select
              value={data.gutter_condition}
              onValueChange={(value) => handleChange('gutter_condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Clean">Clean</SelectItem>
                <SelectItem value="Needs Cleaning">Needs Cleaning</SelectItem>
                <SelectItem value="Blocked">Blocked</SelectItem>
                <SelectItem value="Damaged">Damaged</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="flashing_condition">Flashing Condition</Label>
            <Select
              value={data.flashing_condition}
              onValueChange={(value) => handleChange('flashing_condition', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select condition..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Good">Good</SelectItem>
                <SelectItem value="Fair">Fair</SelectItem>
                <SelectItem value="Poor">Poor</SelectItem>
                <SelectItem value="Missing">Missing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="leak_status">Leak Status</Label>
            <Select
              value={data.leak_status}
              onValueChange={(value) => handleChange('leak_status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="No Leaks">No Leaks</SelectItem>
                <SelectItem value="Minor Leak">Minor Leak</SelectItem>
                <SelectItem value="Active Leak">Active Leak</SelectItem>
                <SelectItem value="Multiple Leaks">Multiple Leaks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Inspector Notes */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 text-lg">Inspector Notes</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="inspector_notes">Observations & Recommendations</Label>
            <Textarea
              id="inspector_notes"
              value={data.inspector_notes}
              onChange={(e) => handleChange('inspector_notes', e.target.value)}
              placeholder="Detailed observations, defects found, and recommended actions..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="safety_notes">Safety & Access Notes</Label>
            <Textarea
              id="safety_notes"
              value={data.safety_notes}
              onChange={(e) => handleChange('safety_notes', e.target.value)}
              placeholder="Safety concerns, access requirements, special equipment needed..."
              rows={3}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
