import { useState } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Loader2, Save, X, Plus, Trash2, ChevronDown, Map as MapIcon, Calculator } from 'lucide-react';
import { RoofShapeCalculator } from './RoofShapeCalculator';
import { RoofPitchSelector } from './RoofPitchSelector';
import { useManualRoofMeasurement } from '@/hooks/useManualRoofMeasurement';
import { ImageUploadField } from './ImageUploadField';

const libraries: ("places" | "geometry")[] = ["places", "geometry"];

interface ManualRoofMeasurementFormProps {
  address: string;
  onComplete: (data: any) => void;
  onCancel?: () => void;
}

interface RoofFeature {
  id: string;
  length: number;
}

export function ManualRoofMeasurementForm({ address, onComplete, onCancel }: ManualRoofMeasurementFormProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const { saveMeasurement, isSaving } = useManualRoofMeasurement();
  
  const [showCalculator, setShowCalculator] = useState(false);
  const [totalArea, setTotalArea] = useState<number | ''>('');
  const [pitch, setPitch] = useState<number>(30);
  const [ridges, setRidges] = useState<RoofFeature[]>([]);
  const [hips, setHips] = useState<RoofFeature[]>([]);
  const [valleys, setValleys] = useState<RoofFeature[]>([]);
  const [referencePhotos, setReferencePhotos] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral | null>(null);

  // Geocode address for map
  useState(() => {
    if (isLoaded && address && window.google) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const location = results[0].geometry.location;
          setMapCenter({ lat: location.lat(), lng: location.lng() });
        }
      });
    }
  });

  const addFeature = (type: 'ridge' | 'hip' | 'valley') => {
    const newFeature: RoofFeature = {
      id: `${type}-${Date.now()}`,
      length: 0,
    };
    
    if (type === 'ridge') setRidges([...ridges, newFeature]);
    if (type === 'hip') setHips([...hips, newFeature]);
    if (type === 'valley') setValleys([...valleys, newFeature]);
  };

  const updateFeature = (type: 'ridge' | 'hip' | 'valley', id: string, length: number) => {
    if (type === 'ridge') {
      setRidges(ridges.map(r => r.id === id ? { ...r, length } : r));
    }
    if (type === 'hip') {
      setHips(hips.map(h => h.id === id ? { ...h, length } : h));
    }
    if (type === 'valley') {
      setValleys(valleys.map(v => v.id === id ? { ...v, length } : v));
    }
  };

  const removeFeature = (type: 'ridge' | 'hip' | 'valley', id: string) => {
    if (type === 'ridge') setRidges(ridges.filter(r => r.id !== id));
    if (type === 'hip') setHips(hips.filter(h => h.id !== id));
    if (type === 'valley') setValleys(valleys.filter(v => v.id !== id));
  };

  const handleCalculatorResult = (area: number) => {
    setTotalArea(area);
    setShowCalculator(false);
  };

  const handleSave = async () => {
    if (!totalArea || totalArea <= 0) {
      alert('Please enter a valid roof area');
      return;
    }

    const measurementData = {
      address,
      total_area_m2: Number(totalArea),
      predominant_pitch: pitch,
      measurement_source: 'manual',
      ridges: ridges.filter(r => r.length > 0),
      hips: hips.filter(h => h.length > 0),
      valleys: valleys.filter(v => v.length > 0),
      reference_photos: referencePhotos,
      notes,
    };

    const result = await saveMeasurement(measurementData);
    if (result) {
      onComplete({
        totalAreaM2: Number(totalArea),
        predominantPitch: pitch,
        features: {
          ridges: ridges.filter(r => r.length > 0),
          hips: hips.filter(h => h.length > 0),
          valleys: valleys.filter(v => v.length > 0),
        },
        savedId: result.id,
        source: 'manual',
      });
    }
  };

  const mapOptions: google.maps.MapOptions = {
    mapTypeId: 'satellite',
    zoom: 19,
    tilt: 0,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left: Google Maps Satellite View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapIcon className="h-5 w-5" />
            Satellite View
          </CardTitle>
          <CardDescription>Visual reference for measurements</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoaded && mapCenter ? (
            <div className="w-full h-[500px] rounded-lg overflow-hidden border">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={mapCenter}
                zoom={19}
                options={mapOptions}
              >
                <Marker position={mapCenter} />
              </GoogleMap>
            </div>
          ) : (
            <div className="w-full h-[500px] rounded-lg bg-muted flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            Use satellite view to help estimate roof measurements
          </p>
        </CardContent>
      </Card>

      {/* Right: Measurement Input Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Manual Measurements</CardTitle>
          <CardDescription>Enter roof dimensions manually</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Calculator Toggle */}
          <div className="flex items-center justify-between">
            <Label>Basic Measurements</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCalculator(!showCalculator)}
            >
              <Calculator className="h-4 w-4 mr-2" />
              {showCalculator ? 'Hide Calculator' : 'Use Calculator'}
            </Button>
          </div>

          {/* Roof Shape Calculator */}
          {showCalculator && (
            <RoofShapeCalculator onCalculate={handleCalculatorResult} initialPitch={pitch} />
          )}

          {/* Total Area Input */}
          <div className="space-y-2">
            <Label htmlFor="total-area">Total Roof Area (m²) *</Label>
            <Input
              id="total-area"
              type="number"
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value ? Number(e.target.value) : '')}
              placeholder="e.g., 150"
              min="1"
              step="0.1"
            />
          </div>

          {/* Pitch Selector */}
          <div className="space-y-2">
            <Label>Predominant Roof Pitch (degrees) *</Label>
            <RoofPitchSelector value={pitch} onChange={setPitch} />
          </div>

          <Separator />

          {/* Roof Features - Collapsible */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <Label className="cursor-pointer">Roof Features (Optional)</Label>
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              {/* Ridges */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Ridges</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addFeature('ridge')}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                {ridges.map((ridge) => (
                  <div key={ridge.id} className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Length (m)"
                      value={ridge.length || ''}
                      onChange={(e) => updateFeature('ridge', ridge.id, Number(e.target.value))}
                      step="0.1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature('ridge', ridge.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Hips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Hips</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addFeature('hip')}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                {hips.map((hip) => (
                  <div key={hip.id} className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Length (m)"
                      value={hip.length || ''}
                      onChange={(e) => updateFeature('hip', hip.id, Number(e.target.value))}
                      step="0.1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature('hip', hip.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Valleys */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Valleys</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={() => addFeature('valley')}>
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                {valleys.map((valley) => (
                  <div key={valley.id} className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Length (m)"
                      value={valley.length || ''}
                      onChange={(e) => updateFeature('valley', valley.id, Number(e.target.value))}
                      step="0.1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFeature('valley', valley.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          {/* Reference Photos */}
          <div className="space-y-2">
            <ImageUploadField
              label="Reference Photos (Optional)"
              name="referencePhotos"
              value={referencePhotos}
              onChange={(_, urls) => setReferencePhotos(urls)}
              helpText="Upload site photos to document measurements"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes about the measurement..."
            />
          </div>

          {/* Summary Badge */}
          {totalArea && (
            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium mb-1">Measurement Summary</div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Area: {totalArea} m²</Badge>
                <Badge variant="secondary">Pitch: {pitch}°</Badge>
                {ridges.length > 0 && (
                  <Badge variant="outline">
                    {ridges.length} Ridge{ridges.length !== 1 ? 's' : ''}
                  </Badge>
                )}
                {hips.length > 0 && (
                  <Badge variant="outline">
                    {hips.length} Hip{hips.length !== 1 ? 's' : ''}
                  </Badge>
                )}
                {valleys.length > 0 && (
                  <Badge variant="outline">
                    {valleys.length} Valley{valleys.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            )}
            <Button onClick={handleSave} disabled={isSaving || !totalArea} className="flex-1">
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Measurement
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
