import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Ruler } from 'lucide-react';

export default function Measurements() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Ruler className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Roof Measurements</h1>
          <p className="text-muted-foreground">Measure roofs from aerial imagery</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Measurement Tool Coming Soon</CardTitle>
          <CardDescription>
            Integration with Nearmap and Google Earth for roof measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature will allow you to measure roof areas, ridges, and valleys from aerial imagery.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
