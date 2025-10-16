import { useState } from 'react';
import { Upload, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadFieldProps {
  label: string;
  name: string;
  value: string[];
  onChange: (name: string, urls: string[]) => void;
  helpText?: string;
  error?: string;
}

export const ImageUploadField = ({ label, name, value, onChange, helpText, error }: ImageUploadFieldProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isRetry = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);
    if (isRetry) setRetrying(true);

    const uploadedUrls: string[] = [];
    let failedCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          failedCount++;
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        try {
          const { error: uploadError, data } = await supabase.storage
            .from('inspection-photos')
            .upload(filePath, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('inspection-photos')
            .getPublicUrl(filePath);

          uploadedUrls.push(publicUrl);
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          failedCount++;
        }
      }

      if (uploadedUrls.length > 0) {
        onChange(name, [...value, ...uploadedUrls]);
        toast({
          title: "Images uploaded",
          description: `${uploadedUrls.length} image(s) uploaded successfully${failedCount > 0 ? `. ${failedCount} failed.` : ''}`,
        });
      }

      if (failedCount === files.length) {
        setUploadError('All uploads failed. Please check your connection and try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError('Upload failed. Please try again.');
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "Unable to upload images. Please check your connection and try again.",
      });
    } finally {
      setUploading(false);
      setRetrying(false);
      e.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    onChange(name, value.filter((_, index) => index !== indexToRemove));
  };

  const retryUpload = () => {
    document.getElementById(name)?.click();
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      {helpText && (
        <p className="text-xs text-muted-foreground">{helpText}</p>
      )}
      
      {(error || uploadError) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {error || uploadError}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-3">
        {value.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {value.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            id={name}
            name={name}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileChange(e)}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(name)?.click()}
            disabled={uploading}
            className="flex-1"
          >
            {uploading ? (
              <>Uploading...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {value.length > 0 ? 'Add More Images' : 'Click to upload images'}
              </>
            )}
          </Button>
          {uploadError && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={retryUpload}
              disabled={retrying}
            >
              <RefreshCw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">Maximum file size: 5MB per image</p>
      </div>
    </div>
  );
};
