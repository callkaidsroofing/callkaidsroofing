import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ruler, MapPin, Download, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Measurement {
  id: string;
  address: string;
  totalArea: number;
  ridgeLength: number;
  valleyLength: number;
  hipLength: number;
  createdAt: Date;
}

export default function Measurements() {
  const { toast } = useToast();
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [address, setAddress] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [ridgeLength, setRidgeLength] = useState('');
  const [valleyLength, setValleyLength] = useState('');
  const [hipLength, setHipLength] = useState('');

  const handleSaveMeasurement = () => {
    if (!address || !totalArea) {
      toast({
        title: "Missing information",
        description: "Please enter address and total area.",
        variant: "destructive",
      });
      return;
    }

    const newMeasurement: Measurement = {
      id: Math.random().toString(36).substr(2, 9),
      address,
      totalArea: parseFloat(totalArea),
      ridgeLength: parseFloat(ridgeLength) || 0,
      valleyLength: parseFloat(valleyLength) || 0,
      hipLength: parseFloat(hipLength) || 0,
      createdAt: new Date(),
    };

    setMeasurements([newMeasurement, ...measurements]);
    
    // Reset form
    setAddress('');
    setTotalArea('');
    setRidgeLength('');
    setValleyLength('');
    setHipLength('');

    toast({
      title: "Measurement saved",
      description: "Roof measurement has been saved successfully.",
    });
  };

  const handleExport = (measurement: Measurement) => {
    const data = `Roof Measurement Report
Address: ${measurement.address}
Date: ${measurement.createdAt.toLocaleDateString()}

Total Area: ${measurement.totalArea} m²
Ridge Length: ${measurement.ridgeLength} m
Valley Length: ${measurement.valleyLength} m
Hip Length: ${measurement.hipLength} m
Total Linear: ${measurement.ridgeLength + measurement.valleyLength + measurement.hipLength} m`;

    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `measurement-${measurement.address.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Exported",
      description: "Measurement data has been downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Ruler className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Roof Measurements</h1>
          <p className="text-muted-foreground">Record and manage roof measurements</p>
        </div>
      </div>

      <Tabs defaultValue="new" className="space-y-6">
        <TabsList>
          <TabsTrigger value="new">
            <Plus className="h-4 w-4 mr-2" />
            New Measurement
          </TabsTrigger>
          <TabsTrigger value="saved">Saved Measurements</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Measurement Entry</CardTitle>
              <CardDescription>
                Enter roof measurements manually or from aerial imagery tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Property Address</Label>
                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-3" />
                  <Input
                    id="address"
                    placeholder="123 Main St, Melbourne VIC 3000"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="totalArea">Total Roof Area (m²)</Label>
                  <Input
                    id="totalArea"
                    type="number"
                    placeholder="150"
                    value={totalArea}
                    onChange={(e) => setTotalArea(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ridgeLength">Ridge Length (m)</Label>
                  <Input
                    id="ridgeLength"
                    type="number"
                    placeholder="25"
                    value={ridgeLength}
                    onChange={(e) => setRidgeLength(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valleyLength">Valley Length (m)</Label>
                  <Input
                    id="valleyLength"
                    type="number"
                    placeholder="15"
                    value={valleyLength}
                    onChange={(e) => setValleyLength(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hipLength">Hip Length (m)</Label>
                  <Input
                    id="hipLength"
                    type="number"
                    placeholder="20"
                    value={hipLength}
                    onChange={(e) => setHipLength(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveMeasurement}>
                  <Plus className="h-4 w-4 mr-2" />
                  Save Measurement
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Integration Tools</CardTitle>
              <CardDescription>
                Future integrations for automated measurements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                <div>
                  <div className="font-medium">Nearmap Integration</div>
                  <div className="text-sm text-muted-foreground">High-resolution aerial imagery</div>
                </div>
                <Button variant="outline" disabled>Coming Soon</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
                <div>
                  <div className="font-medium">Google Earth Pro</div>
                  <div className="text-sm text-muted-foreground">Satellite measurement tools</div>
                </div>
                <Button variant="outline" disabled>Coming Soon</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {measurements.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Ruler className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No measurements yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Create your first measurement using the form above
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {measurements.map((measurement) => (
                <Card key={measurement.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{measurement.address}</CardTitle>
                        <CardDescription>
                          Measured on {measurement.createdAt.toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleExport(measurement)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Area</div>
                        <div className="text-xl font-semibold">{measurement.totalArea} m²</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Ridge</div>
                        <div className="text-xl font-semibold">{measurement.ridgeLength} m</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Valley</div>
                        <div className="text-xl font-semibold">{measurement.valleyLength} m</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Hip</div>
                        <div className="text-xl font-semibold">{measurement.hipLength} m</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
