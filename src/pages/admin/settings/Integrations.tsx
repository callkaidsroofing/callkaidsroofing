import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plug } from 'lucide-react';

export default function Integrations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Plug className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">Connect external services and APIs</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Management</CardTitle>
          <CardDescription>
            Manage connections to Notion, Google, Nearmap, and other services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Integration management interface under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
