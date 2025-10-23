import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, RefreshCw, Sparkles, Camera } from 'lucide-react';
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
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const analyzeImage = async (imageUrl: string) => {
    setAnalyzing(true);
    try {
      const analysisType = name.includes('roof') || name.includes('condition') || name.includes('defect')
        ? 'roof_condition' 
        : name.includes('damage') || name.includes('leak')
        ? 'damage_assessment'
        : 'roof_condition';

      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: {
          imageUrl,
          analysisType,
          conversationId: null,
        },
      });

      if (error) throw error;

      if (data?.success && data?.analysis) {
        setAnalysisResults(prev => ({
          ...prev,
          [imageUrl]: data.analysis
        }));

        toast({
          title: 'AI Analysis Complete',
          description: `Detected: ${data.analysis.roofType || data.analysis.damageType || 'roof details'}`,
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setAnalyzing(false);
    }
  };

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
          
          // Auto-analyze uploaded image
          await analyzeImage(publicUrl);
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          failedCount++;
        }
      }

      if (uploadedUrls.length > 0) {
        onChange(name, [...value, ...uploadedUrls]);
        toast({
          title: "Images uploaded & analyzed",
          description: `${uploadedUrls.length} image(s) processed with AI${failedCount > 0 ? `. ${failedCount} failed.` : ''}`,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {value.map((url, index) => {
              const analysis = analysisResults[url];
              return (
                <div key={index} className="relative group animate-fade-in">
                  <div className="rounded-lg border border-border overflow-hidden bg-card hover:shadow-lg transition-all duration-300">
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                    {analysis && (
                      <div className="p-3 bg-muted/50 text-xs space-y-1">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-3 w-3 text-primary" />
                          <span className="font-semibold">AI Analysis</span>
                        </div>
                        {analysis.roofType && (
                          <p className="text-muted-foreground">Type: {analysis.roofType}</p>
                        )}
                        {analysis.rating && (
                          <p className="text-muted-foreground">Condition: {analysis.rating}</p>
                        )}
                        {analysis.damageType && (
                          <p className="text-muted-foreground">Issue: {analysis.damageType}</p>
                        )}
                        {analysis.severity && (
                          <p className="text-muted-foreground">Severity: {analysis.severity}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
          <input
            id={`${name}-camera`}
            name={`${name}-camera`}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileChange(e)}
            disabled={uploading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(name)?.click()}
            disabled={uploading || analyzing}
            className="group hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {analyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                Analyzing...
              </>
            ) : uploading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                Upload Photos
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById(`${name}-camera`)?.click()}
            disabled={uploading || analyzing}
            className="group hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <Camera className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Take Photo
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
