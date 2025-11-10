import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export default function Suburbs() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Suburbs Editor</h1>
          <p className="text-muted-foreground">Manage suburb pages and local SEO</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suburb Page Management</CardTitle>
          <CardDescription>
            Edit suburb-specific content and local SEO optimization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Suburb page editor under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
