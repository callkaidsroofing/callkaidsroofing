import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Satellite, Loader2, Ruler, TrendingUp, Calendar } from 'lucide-react';
import { useRoofData } from '@/hooks/useRoofData';

interface InspectionRoofMeasurementProps {
  address: string;
  onMeasurementComplete?: (measurementId: string) => void;
}

export function InspectionRoofMeasurement({ address, onMeasurementComplete }: InspectionRoofMeasurementProps) {
  const { mutate: getRoofData, data: measurement, isPending, error } = useRoofData();
  const [hasScanned, setHasScanned] = useState(false);

  const handleScan = () => {
    getRoofData(address);
    setHasScanned(true);
    if (measurement?.savedId && onMeasurementComplete) {
      onMeasurementComplete(measurement.savedId);
    }
  };

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
          <Button onClick={handleScan} disabled={isPending || !address} className="w-full">
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
        )}

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-sm text-destructive">
            <strong>Error:</strong> {error.message}
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