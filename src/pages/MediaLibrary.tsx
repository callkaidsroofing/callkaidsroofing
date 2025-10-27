import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';

export default function MediaLibrary() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Media Library</h1>
        <p className="text-muted-foreground">Upload and manage photos, videos, and documents</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Media Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Image className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Media library coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
