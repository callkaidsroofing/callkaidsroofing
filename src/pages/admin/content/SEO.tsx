import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function SEO() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <TrendingUp className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">SEO Studio</h1>
          <p className="text-muted-foreground">Optimize content for search engines</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Tools Coming Soon</CardTitle>
          <CardDescription>
            Keyword research, content optimization, and performance tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            SEO optimization tools and analytics dashboard under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
