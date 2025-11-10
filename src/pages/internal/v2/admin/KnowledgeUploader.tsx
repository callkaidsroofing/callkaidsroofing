import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const CATEGORIES = [
  { value: 'system', label: 'System' },
  { value: 'brand', label: 'Brand' },
  { value: 'web_design', label: 'Web Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'operations', label: 'Operations' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'service_areas', label: 'Service Areas' },
  { value: 'integration', label: 'Integration' },
  { value: 'case_studies', label: 'Case Studies' },
  { value: 'proof', label: 'Proof' },
  { value: 'workflows', label: 'Workflows' },
  { value: 'support', label: 'Support' },
];

const DOC_TYPES = [
  { value: 'mkf', label: 'MKF (Master Knowledge Framework)' },
  { value: 'gwa', label: 'GWA (Guided Workflow Automation)' },
  { value: 'sop', label: 'SOP (Standard Operating Procedure)' },
  { value: 'faq', label: 'FAQ' },
  { value: 'service', label: 'Service' },
  { value: 'suburb', label: 'Suburb' },
  { value: 'case_study', label: 'Case Study' },
  { value: 'testimonial', label: 'Testimonial' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'knowledge', label: 'General Knowledge' },
  { value: 'template', label: 'Template' },
];

export default function KnowledgeUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<string>('');
  const [docType, setDocType] = useState<string>('');
  const [priority, setPriority] = useState<string>('75');
  const [autoEmbed, setAutoEmbed] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingResult, setProcessingResult] = useState<any>(null);

  // Fetch recent uploads
  const { data: recentUploads, refetch } = useQuery({
    queryKey: ['knowledge-uploads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_uploads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProcessingResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setProcessingResult(null);

    try {
      // Step 1: Upload file to storage (30%)
      const filePath = `${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('knowledge-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;
      setUploadProgress(30);

      // Step 2: Create upload record (50%)
      const { data: session } = await supabase.auth.getSession();
      const { data: uploadRecord, error: recordError } = await supabase
        .from('knowledge_uploads')
        .insert({
          file_path: filePath,
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: session.session?.user.id,
          status: 'pending',
        })
        .select()
        .single();

      if (recordError) throw recordError;
      setUploadProgress(50);

      // Step 3: Process upload (70%)
      const { data: processData, error: processError } = await supabase.functions.invoke(
        'process-knowledge-upload',
        {
          body: {
            uploadId: uploadRecord.id,
            category: category || undefined,
            docType: docType || undefined,
            priority: priority ? parseInt(priority) : undefined,
            autoEmbed,
          },
        }
      );

      if (processError) throw processError;
      setUploadProgress(100);

      setProcessingResult(processData);
      toast.success(
        `Successfully processed! Created ${processData.documentsCreated} document(s)`,
        { duration: 5000 }
      );

      // Reset form
      setFile(null);
      setCategory('');
      setDocType('');
      setPriority('75');
      refetch();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Knowledge Uploader</h1>
        <p className="text-muted-foreground">
          Upload markdown files to automatically parse, categorize, and add to master_knowledge
        </p>
      </div>

      {/* Upload Form */}
      <Card>
        <CardHeader>
          <CardTitle>Upload New Knowledge File</CardTitle>
          <CardDescription>
            Supports .md, .txt, .pdf, and .docx files. AI will auto-detect category if not specified.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Input */}
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              accept=".md,.txt,.pdf,.docx"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {file && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-muted-foreground">(optional - AI will detect)</span>
            </Label>
            <Select value={category} onValueChange={setCategory} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Auto-detect from content" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Doc Type */}
          <div className="space-y-2">
            <Label htmlFor="docType">
              Document Type <span className="text-muted-foreground">(optional - AI will detect)</span>
            </Label>
            <Select value={docType} onValueChange={setDocType} disabled={isUploading}>
              <SelectTrigger>
                <SelectValue placeholder="Auto-detect from content" />
              </SelectTrigger>
              <SelectContent>
                {DOC_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority (65-100)</Label>
            <Input
              id="priority"
              type="number"
              min="65"
              max="100"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isUploading}
              placeholder="75 (standard)"
            />
            <p className="text-xs text-muted-foreground">
              100=Critical system, 85=Featured content, 75=Standard, 65=Supporting
            </p>
          </div>

          {/* Auto-embed */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoEmbed"
              checked={autoEmbed}
              onCheckedChange={(checked) => setAutoEmbed(checked as boolean)}
              disabled={isUploading}
            />
            <Label htmlFor="autoEmbed" className="cursor-pointer">
              Automatically generate vector embeddings (recommended)
            </Label>
          </div>

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
            size="lg"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload & Process
              </>
            )}
          </Button>

          {isUploading && <Progress value={uploadProgress} className="h-2" />}
        </CardContent>
      </Card>

      {/* Processing Result */}
      {processingResult && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Processing Complete!</p>
              <ul className="text-sm space-y-1">
                <li>Documents Created: {processingResult.documentsCreated}</li>
                <li>Category: {processingResult.category}</li>
                <li>Doc Type: {processingResult.docType}</li>
                <li>Embeddings: {processingResult.embeddingsGenerated ? 'Generated ✓' : 'Skipped'}</li>
              </ul>
              <details className="mt-2">
                <summary className="text-sm cursor-pointer">View Document IDs</summary>
                <ul className="mt-1 text-xs font-mono space-y-0.5">
                  {processingResult.docIds?.map((id: string) => (
                    <li key={id}>• {id}</li>
                  ))}
                </ul>
              </details>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Last 10 knowledge file uploads</CardDescription>
        </CardHeader>
        <CardContent>
          {recentUploads && recentUploads.length > 0 ? (
            <div className="space-y-2">
              {recentUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{upload.original_filename}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(upload.created_at).toLocaleString()} • {upload.doc_count || 0} docs
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {upload.status === 'completed' && (
                      <CheckCircle className="w-4 h-4 text-success" />
                    )}
                    {upload.status === 'failed' && (
                      <AlertCircle className="w-4 h-4 text-destructive" />
                    )}
                    {upload.status === 'processing' && (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    )}
                    <span className="text-xs text-muted-foreground capitalize">
                      {upload.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No uploads yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
