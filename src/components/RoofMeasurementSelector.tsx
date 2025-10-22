import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin, Ruler, Calendar, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useRoofData } from '@/hooks/useRoofData';

interface RoofMeasurement {
  id: string;
  address: string;
  total_area_m2: number;
  predominant_pitch: number;
  imagery_date: string | null;
  imagery_quality: string | null;
  created_at: string;
  roof_segments: any;
  perimeter_features: any;
  hips: any;
  ridges: any;
  valleys: any;
}

interface RoofMeasurementSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (measurement: RoofMeasurement) => void;
  defaultAddress?: string;
}

export function RoofMeasurementSelector({ 
  open, 
  onOpenChange, 
  onSelect,
  defaultAddress = ''
}: RoofMeasurementSelectorProps) {
  const [address, setAddress] = useState(defaultAddress);
  const [measurements, setMeasurements] = useState<RoofMeasurement[]>([]);
  const [loading, setLoading] = useState(false);
  const { mutate: getRoofData, data: newMeasurement, isPending: isScanning } = useRoofData();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setAddress(defaultAddress);
      loadRecentMeasurements();
    }
  }, [open, defaultAddress]);

  useEffect(() => {
    if (newMeasurement && newMeasurement.savedId) {
      loadRecentMeasurements();
    }
  }, [newMeasurement]);

  const loadRecentMeasurements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('roof_measurements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setMeasurements(data || []);
    } catch (error) {
      console.error('Error loading measurements:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recent measurements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanRoof = async () => {
    if (!address.trim()) {
      toast({
        title: 'Address Required',
        description: 'Please enter a property address',
        variant: 'destructive',
      });
      return;
    }

    getRoofData(address);
  };

  const handleSelectMeasurement = async (measurement: RoofMeasurement) => {
    onSelect(measurement);
    onOpenChange(false);
    toast({
      title: 'Measurement Imported',
      description: `Successfully imported measurements for ${measurement.address}`,
    });
  };

  const getQualityColor = (quality: string | null) => {
    switch (quality?.toUpperCase()) {
      case 'HIGH': return 'default';
      case 'MEDIUM': return 'secondary';
      case 'LOW': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Roof Measurements</DialogTitle>
          <DialogDescription>
            Scan a new roof or select from recent measurements
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Scan New Roof Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Scan New Roof
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter property address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleScanRoof()}
                  />
                  <Button 
                    onClick={handleScanRoof}
                    disabled={isScanning || !address.trim()}
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      'Scan Roof'
                    )}
                  </Button>
                </div>
                {newMeasurement && !isScanning && (
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="font-semibold">Scan Complete</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex items-center gap-2">
                            <Ruler className="h-4 w-4 text-muted-foreground" />
                            <span>Area: {newMeasurement.totalPitchedArea} m²</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Pitch: {newMeasurement.predominantPitch}°</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleSelectMeasurement(newMeasurement as any)}
                      >
                        Use This
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Measurements Section */}
          <div className="space-y-3">
            <div className="text-sm font-medium">Recent Measurements</div>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : measurements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No recent measurements found
              </div>
            ) : (
              <div className="space-y-2">
                {measurements.map((measurement) => (
                  <Card 
                    key={measurement.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleSelectMeasurement(measurement)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium text-sm">{measurement.address}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Ruler className="h-3 w-3" />
                              {measurement.total_area_m2} m²
                            </div>
                            <div>Pitch: {measurement.predominant_pitch}°</div>
                            {measurement.imagery_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(measurement.imagery_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          {measurement.imagery_quality && (
                            <Badge variant={getQualityColor(measurement.imagery_quality)}>
                              {measurement.imagery_quality} Quality
                            </Badge>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          Select
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}