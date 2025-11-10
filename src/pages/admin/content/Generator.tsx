import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';

export default function Generator() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Wand2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Content Generator</h1>
          <p className="text-muted-foreground">AI-powered content creation for marketing and SEO</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Unified Content Generation</CardTitle>
          <CardDescription>
            Create blog posts, social media content, case studies, and more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This unified content generation interface is under development. 
            Use the Marketing Studio for now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
