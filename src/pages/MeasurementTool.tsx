import React, { useState } from 'react';
import { useRoofData } from '@/hooks/useRoofData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, MapPin, Ruler, TrendingUp } from 'lucide-react';

export default function MeasurementTool() {
  const [address, setAddress] = useState('6 Ingleton Court, Narre Warren, VIC 3805');
  const { mutate: getRoofData, data, isPending, error } = useRoofData();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getRoofData(address);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-roofing-navy mb-3">
            Automated Roof Measurement Tool
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter a property address to generate a detailed roof takeoff plan with measurements
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-roofing-blue" />
              Property Address
            </CardTitle>
            <CardDescription>
              Enter the full address including suburb and postcode for accurate results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-4">
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter property address..."
                className="flex-grow"
              />
              <Button 
                type="submit" 
                disabled={isPending}
                className="min-w-[140px]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Plan'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="mb-8 border-destructive">
            <CardContent className="pt-6">
              <div className="text-destructive">
                <strong>Error:</strong> {error.message}
              </div>
            </CardContent>
          </Card>
        )}

        {data && (
          <Card>
            <CardHeader>
              <CardTitle>Generated Roof Takeoff Plan</CardTitle>
              <CardDescription>Detailed measurements and specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="h-5 w-5 text-roofing-blue" />
                    <span className="font-semibold">Total Pitched Area</span>
                  </div>
                  <div className="text-3xl font-bold text-roofing-navy">
                    {data.totalPitchedArea} m²
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-roofing-blue" />
                    <span className="font-semibold">Predominant Pitch</span>
                  </div>
                  <div className="text-3xl font-bold text-roofing-navy">
                    {data.predominantPitch}°
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Perimeter Features</h3>
                <div className="space-y-2">
                  {data.features.perimeter.map((feature: any) => (
                    <div key={feature.id} className="flex justify-between p-3 rounded bg-muted/50">
                      <span className="font-medium">{feature.type}</span>
                      <span className="text-roofing-blue font-semibold">{feature.length} m</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Hips</h3>
                  <div className="space-y-2">
                    {data.features.hips.map((hip: any) => (
                      <div key={hip.id} className="flex justify-between p-2 rounded bg-muted/50 text-sm">
                        <span>Hip Line</span>
                        <span className="text-roofing-blue font-semibold">{hip.length} m</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Ridges</h3>
                  <div className="space-y-2">
                    {data.features.ridges.map((ridge: any) => (
                      <div key={ridge.id} className="flex justify-between p-2 rounded bg-muted/50 text-sm">
                        <span>Ridge Line</span>
                        <span className="text-roofing-blue font-semibold">{ridge.length} m</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Valleys</h3>
                  <div className="space-y-2">
                    {data.features.valleys.map((valley: any) => (
                      <div key={valley.id} className="flex justify-between p-2 rounded bg-muted/50 text-sm">
                        <span>Valley Line</span>
                        <span className="text-roofing-blue font-semibold">{valley.length} m</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
