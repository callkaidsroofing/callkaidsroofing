import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';

export default function Services() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Services Editor</h1>
          <p className="text-muted-foreground">Manage service pages and descriptions</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Page Management</CardTitle>
          <CardDescription>
            Edit service descriptions, pricing, and SEO content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Service page editor under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
