import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Photo {
  id: string;
  url: string;
  caption: string;
  category: 'before' | 'after' | 'during';
}

interface PhotosStepProps {
  value: Photo[];
  onChange: (photos: Photo[]) => void;
}

export function PhotosStep({ value, onChange }: PhotosStepProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, category: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newPhotos: Photo[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `quote-photos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('media')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        newPhotos.push({
          id: crypto.randomUUID(),
          url: publicUrl,
          caption: '',
          category: category as any,
        });
      }

      onChange([...value, ...newPhotos]);
      toast({ title: 'Photos uploaded', description: `${newPhotos.length} photos added` });
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (id: string) => {
    onChange(value.filter((p) => p.id !== id));
  };

  const updateCaption = (id: string, caption: string) => {
    onChange(value.map((p) => (p.id === id ? { ...p, caption } : p)));
  };

  const getPhotosByCategory = (category: string) =>
    value.filter((p) => p.category === category);

  return (
    <div className="space-y-6">
      {/* Upload Sections */}
      <div className="grid md:grid-cols-3 gap-4">
        {(['before', 'during', 'after'] as const).map((category) => (
          <Card key={category} className="p-4">
            <div className="text-center space-y-3">
              <Badge variant="outline" className="mb-2">
                {category.charAt(0).toUpperCase() + category.slice(1)} Photos
              </Badge>
              <input
                type="file"
                id={`upload-${category}`}
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleUpload(e, category)}
              />
              <label htmlFor={`upload-${category}`}>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={uploading}
                  asChild
                >
                  <span className="cursor-pointer">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload {category}
                  </span>
                </Button>
              </label>
              <p className="text-xs text-muted-foreground">
                {getPhotosByCategory(category).length} photo(s)
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Photo Grid */}
      {value.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-2">
            <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">
              No photos attached yet. Upload before/after photos to enhance your quote.
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {(['before', 'during', 'after'] as const).map((category) => {
            const photos = getPhotosByCategory(category);
            if (photos.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="font-semibold mb-3 capitalize">{category} Photos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {photos.map((photo) => (
                    <Card key={photo.id} className="p-2 relative group">
                      <img
                        src={photo.url}
                        alt={photo.caption || 'Quote photo'}
                        className="w-full h-40 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(photo.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="mt-2">
                        <Input
                          placeholder="Add caption..."
                          value={photo.caption}
                          onChange={(e) => updateCaption(photo.id, e.target.value)}
                          className="text-xs h-8"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
