import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Satellite, Loader2, Ruler, TrendingUp, Calendar, MapPin, AlertTriangle, Edit3 } from 'lucide-react';
import { useRoofData } from '@/hooks/useRoofData';
import { Autocomplete, useLoadScript } from '@react-google-maps/api';
import { ManualRoofMeasurementForm } from './ManualRoofMeasurementForm';

interface InspectionRoofMeasurementProps {
  address: string;
  onMeasurementComplete?: (measurementId: string) => void;
  onDataReceived?: (data: any) => void;
}

const libraries: ("places")[] = ["places"];

export function InspectionRoofMeasurement({ address: initialAddress, onMeasurementComplete, onDataReceived }: InspectionRoofMeasurementProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  const { mutate: getRoofData, data: measurement, isPending, error } = useRoofData();
  const [hasScanned, setHasScanned] = useState(false);
  const [address, setAddress] = useState(initialAddress);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleScan = () => {
    if (!address.trim()) return;
    getRoofData(address);
    setHasScanned(true);
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.formatted_address) {
        setAddress(place.formatted_address);
      }
    }
  };

  // Trigger callbacks when measurement data is available
  useEffect(() => {
    if (measurement?.savedId && onMeasurementComplete) {
      onMeasurementComplete(measurement.savedId);
    }
    if (measurement && onDataReceived) {
      onDataReceived({
        totalAreaM2: measurement.totalPitchedArea,
        predominantPitch: measurement.predominantPitch,
        features: measurement.features,
        roofSegments: measurement.roofSegments,
      });
    }
  }, [measurement]);

  const getQualityColor = (quality: string) => {
    switch (quality?.toUpperCase()) {
      case 'HIGH': return 'default';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Satellite className="h-5 w-5 text-primary" />
          Satellite Roof Measurements
        </CardTitle>
        <CardDescription>
          Automated measurements using Google Solar API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasScanned && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="roof-address">Property Address</Label>
              {isLoaded ? (
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePlaceSelect}
                  options={{
                    types: ['address'],
                    componentRestrictions: { country: 'au' },
                  }}
                >
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="roof-address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter property address..."
                      className="pl-10"
                    />
                  </div>
                </Autocomplete>
              ) : (
                <Input
                  id="roof-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter property address..."
                />
              )}
            </div>
            <Button onClick={handleScan} disabled={isPending || !address.trim()} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning Roof...
                </>
              ) : (
                <>
                  <Satellite className="mr-2 h-4 w-4" />
                  Scan Roof from Satellite
                </>
              )}
            </Button>
          </div>
        )}

        {error && !showManualEntry && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Satellite Measurements Unavailable</AlertTitle>
            <AlertDescription className="space-y-3">
              <p className="text-sm">
                {error.message?.includes('COVERAGE_UNAVAILABLE') || error.message?.includes('404')
                  ? 'Google Solar API coverage is not available for this address. This is common in Australia where satellite measurement data is limited.'
                  : error.message}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowManualEntry(true)}
                className="mt-2"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Enter Measurements Manually
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {showManualEntry && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Manual Measurement Entry</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowManualEntry(false)}
              >
                Cancel
              </Button>
            </div>
            <ManualRoofMeasurementForm
              address={address}
              onComplete={(data) => {
                if (data.savedId && onMeasurementComplete) {
                  onMeasurementComplete(data.savedId);
                }
                if (onDataReceived) {
                  onDataReceived(data);
                }
                setShowManualEntry(false);
                setHasScanned(true);
              }}
              onCancel={() => setShowManualEntry(false)}
            />
          </div>
        )}

        {measurement && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  <Calendar className="h-3 w-3" />
                  {measurement.imageryDate || 'Recent'}
                </Badge>
                {measurement.imageryQuality && (
                  <Badge variant={getQualityColor(measurement.imageryQuality)}>
                    {measurement.imageryQuality} Quality
                  </Badge>
                )}
              </div>
              <Button size="sm" variant="outline" onClick={handleScan} disabled={isPending}>
                Rescan
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                  <span>Total Roof Area</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {measurement.totalPitchedArea} m²
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Predominant Pitch</span>
                </div>
                <div className="text-2xl font-bold text-primary">
                  {measurement.predominantPitch}°
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="text-sm font-semibold">Roof Features</div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="space-y-1">
                  <div className="text-muted-foreground">Ridges</div>
                  <div className="font-semibold">
                    {measurement.features.ridges.reduce((sum: number, r: any) => sum + r.length, 0).toFixed(2)} m
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Hips</div>
                  <div className="font-semibold">
                    {measurement.features.hips.reduce((sum: number, h: any) => sum + h.length, 0).toFixed(2)} m
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Valleys</div>
                  <div className="font-semibold">
                    {measurement.features.valleys.reduce((sum: number, v: any) => sum + v.length, 0).toFixed(2)} m
                  </div>
                </div>
              </div>
            </div>

            {measurement.roofSegments && measurement.roofSegments.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm font-semibold">Roof Segments</div>
                  <div className="space-y-2">
                    {measurement.roofSegments.map((segment: any, idx: number) => (
                      <div key={segment.id || idx} className="flex justify-between text-sm p-2 bg-muted/50 rounded">
                        <span>Segment {idx + 1}</span>
                        <span className="text-muted-foreground">
                          {segment.area} m² • {segment.pitch}° pitch
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}