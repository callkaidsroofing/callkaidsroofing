import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Trash2, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const MediaManager = () => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: images, isLoading } = useQuery({
    queryKey: ['media-gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handleUpload = async () => {
    if (!selectedFiles) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `uploads/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL - use the full path
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        console.log('Upload successful:', { filePath, publicUrl });

        // Save to database
        const { error: dbError } = await supabase
          .from('media_gallery')
          .insert({
            title: file.name,
            image_url: publicUrl,
            is_active: true,
            display_order: 0
          });

        if (dbError) {
          console.error('Database insert error:', dbError);
          throw dbError;
        }
      }

      toast({ title: "Success", description: `Uploaded ${selectedFiles.length} image(s)` });
      queryClient.invalidateQueries({ queryKey: ['media-gallery'] });
      setSelectedFiles(null);
    } catch (error) {
      toast({ 
        title: "Upload Failed", 
        description: error instanceof Error ? error.message : 'Failed to upload',
        variant: "destructive" 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      // Extract file path from URL
      const path = imageUrl.split('/storage/v1/object/public/media/')[1];
      if (path) {
        await supabase.storage.from('media').remove([path]);
      }
      
      await supabase.from('media_gallery').delete().eq('id', id);
      
      toast({ title: "Deleted", description: "Image removed" });
      queryClient.invalidateQueries({ queryKey: ['media-gallery'] });
    } catch (error) {
      toast({ title: "Delete Failed", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Media Manager</h1>

      <Card>
        <CardHeader>
          <CardTitle>Upload Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setSelectedFiles(e.target.files)}
          />
          <Button 
            onClick={handleUpload}
            disabled={isUploading || !selectedFiles}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload {selectedFiles?.length || 0} Image(s)
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Images ({images?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading...</div>
          ) : images && images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img 
                    src={img.image_url} 
                    alt={img.title}
                    className="w-full aspect-square object-cover rounded-lg"
                    onError={(e) => {
                      console.error('Image failed to load:', img.image_url);
                      e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" fill="red">Error</text></svg>';
                    }}
                    onLoad={() => console.log('Image loaded:', img.image_url)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDelete(img.id, img.image_url)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1 truncate">{img.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No images yet. Upload some above.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManager;
