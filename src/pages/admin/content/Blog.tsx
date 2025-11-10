import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function Blog() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <FileText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Blog Manager</h1>
          <p className="text-muted-foreground">Create and manage blog posts</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Management Coming Soon</CardTitle>
          <CardDescription>
            Create, edit, and publish blog posts with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unified blog post management interface under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
