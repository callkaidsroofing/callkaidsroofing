import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

export default function Pricing() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <DollarSign className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Pricing Settings</h1>
          <p className="text-muted-foreground">Manage pricing rules and rate cards</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Management</CardTitle>
          <CardDescription>
            Configure pricing rules, material costs, and rate cards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Pricing configuration interface under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
