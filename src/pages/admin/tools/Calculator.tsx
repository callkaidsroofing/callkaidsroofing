import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator as CalculatorIcon } from 'lucide-react';

export default function Calculator() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <CalculatorIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Quote Calculator</h1>
          <p className="text-muted-foreground">Estimate pricing for roofing projects</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculator Coming Soon</CardTitle>
          <CardDescription>
            Quick estimation tool for quotes without full quote builder
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is under development. Use the full Quote Builder for now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
