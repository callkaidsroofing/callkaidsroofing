import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Sparkles, Database, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const MediaManager = () => {
  const [imageUrls, setImageUrls] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: caseStudies, isLoading, error: queryError } = useQuery({
    queryKey: ['admin-case-studies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_case_studies')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Case studies fetch error:', error);
        throw error;
      }
      return data || [];
    }
  });

  const handleFileUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one image file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `project-images/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      toast({
        title: "Upload Complete",
        description: `Uploaded ${uploadedUrls.length} image(s)`,
      });

      // Add uploaded URLs to the textarea
      setImageUrls(prev => prev ? `${prev}\n${uploadedUrls.join('\n')}` : uploadedUrls.join('\n'));
      setSelectedFiles(null);

    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Failed to upload images',
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyzeImages = async () => {
    const urls = imageUrls.split('\n').map(url => url.trim()).filter(url => url.length > 0);
    
    if (urls.length === 0) {
      toast({
        title: "No Images",
        description: "Please upload files or enter image URLs",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      console.log('Analyzing images with RAG intelligence:', urls);
      
      const { data, error } = await supabase.functions.invoke('analyze-project-images', {
        body: { 
          images: urls,
          saveToDatabase: true 
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast({
          title: "Analysis Complete",
          description: data.message || `Analyzed and saved ${data.savedProjects?.length || 0} projects`,
          duration: 5000,
        });
        
        // Refresh the list
        queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
        queryClient.invalidateQueries({ queryKey: ['ai-analyzed-projects'] });
        
        setImageUrls('');
      } else {
        throw new Error(data?.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Error analyzing images:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Failed to analyze images',
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('content_case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Project Deleted",
        description: "Case study removed from database"
      });

      queryClient.invalidateQueries({ queryKey: ['admin-case-studies'] });
      queryClient.invalidateQueries({ queryKey: ['ai-analyzed-projects'] });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : 'Failed to delete project',
        variant: "destructive"
      });
    }
  };

  if (queryError) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-destructive">Error loading case studies: {queryError instanceof Error ? queryError.message : 'Unknown error'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Media Manager</h1>
          <p className="text-muted-foreground mt-1">
            RAG-powered intelligent media analysis and storage
          </p>
        </div>
        <Button 
          onClick={() => window.location.href = '/admin/cms/media-verification'}
          variant="outline"
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          Verification Center
        </Button>
      </div>

      {/* Upload & Analyze Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-conversion-cyan" />
            AI-Powered Image Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium block">
              Upload Project Images
            </label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setSelectedFiles(e.target.files)}
                className="flex-1"
              />
              <Button 
                onClick={handleFileUpload}
                disabled={isUploading || !selectedFiles}
                variant="outline"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            {selectedFiles && selectedFiles.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedFiles.length} file(s) selected
              </p>
            )}
          </div>

          {/* URL Input Section */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Or Enter Image URLs (one per line)
            </label>
            <textarea
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              placeholder="/images/projects/before-roof-1.jpg
/images/projects/after-roof-1.jpg
/images/projects/before-roof-2.jpg"
              className="w-full min-h-[150px] p-3 border rounded-md font-mono text-sm"
            />
          </div>

          <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Database className="h-4 w-4 text-conversion-cyan" />
              What this does:
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground ml-6">
              <li>• Uses RAG to retrieve roofing expertise from knowledge base</li>
              <li>• AI vision analyzes each image for before/after stage, condition, issues</li>
              <li>• Intelligently pairs before/after images based on similarity</li>
              <li>• Stores analysis results in content_case_studies table</li>
              <li>• Makes projects immediately available on public website</li>
            </ul>
          </div>

          <Button 
            onClick={handleAnalyzeImages}
            disabled={isAnalyzing || !imageUrls.trim()}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing with RAG Intelligence...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze & Store Images
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Stored Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-conversion-cyan" />
            Stored Projects ({caseStudies?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-conversion-cyan" />
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : caseStudies && caseStudies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {caseStudies.map((study) => (
                <Card key={study.id} className="overflow-hidden">
                  <div className="grid grid-cols-2 gap-1">
                    <div className="relative aspect-square">
                      <img 
                        src={study.before_image || '/placeholder.svg'} 
                        alt="Before"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 left-1 bg-destructive text-white text-xs px-2 py-0.5 rounded">
                        BEFORE
                      </span>
                    </div>
                    <div className="relative aspect-square">
                      <img 
                        src={study.after_image || '/placeholder.svg'} 
                        alt="After"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1 right-1 bg-conversion-cyan text-white text-xs px-2 py-0.5 rounded">
                        AFTER
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-muted-foreground">
                        {study.study_id}
                      </span>
                      {study.featured && (
                        <span className="text-xs bg-conversion-cyan/10 text-conversion-cyan px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium">{study.suburb}</p>
                    <div className="flex gap-1 flex-wrap">
                      {study.authenticity_score > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          study.authenticity_score >= 0.85 ? 'bg-green-500/10 text-green-700' :
                          study.authenticity_score >= 0.7 ? 'bg-amber-500/10 text-amber-700' :
                          'bg-red-500/10 text-red-700'
                        }`}>
                          Auth: {Math.round(study.authenticity_score * 100)}%
                        </span>
                      )}
                      {study.pairing_confidence > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          study.pairing_confidence >= 0.85 ? 'bg-green-500/10 text-green-700' :
                          study.pairing_confidence >= 0.7 ? 'bg-amber-500/10 text-amber-700' :
                          'bg-red-500/10 text-red-700'
                        }`}>
                          Pair: {Math.round(study.pairing_confidence * 100)}%
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        study.verification_status === 'verified' ? 'bg-green-500/10 text-green-700' :
                        study.verification_status === 'needs_review' ? 'bg-amber-500/10 text-amber-700' :
                        study.verification_status === 'rejected' ? 'bg-red-500/10 text-red-700' :
                        'bg-secondary text-secondary-foreground'
                      }`}>
                        {study.verification_status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {study.testimonial}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() => handleDeleteProject(study.id)}
                    >
                      Delete
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground">No projects stored yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Upload and analyze images to get started
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MediaManager;
