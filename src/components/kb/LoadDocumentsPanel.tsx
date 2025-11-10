import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useKnowledgeBaseLoader } from '@/hooks/useKnowledgeBaseLoader';
import { Upload, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface LoadDocumentsPanelProps {
  onLoadComplete?: () => void;
}

export function LoadDocumentsPanel({ onLoadComplete }: LoadDocumentsPanelProps) {
  const { progress, loadFromMKF, reset } = useKnowledgeBaseLoader();

  const handleLoad = async () => {
    try {
      await loadFromMKF();
      toast.success('Knowledge base loaded successfully!');
      onLoadComplete?.();
    } catch (error: any) {
      toast.error(`Failed to load knowledge base: ${error.message}`);
    }
  };

  const getProgressPercentage = () => {
    if (progress.totalDocs === 0) return 0;
    return Math.round((progress.processedDocs / progress.totalDocs) * 100);
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Load MKF Documents</h3>
        <p className="text-sm text-muted-foreground">
          Load and embed all documents from the Master Knowledge Framework (MKF) source files into the vector database.
        </p>
      </div>

      {progress.status === 'idle' && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This will load all 26 documents from MASTER_INDEX.json and create ~150-300 vector embeddings.
            The process may take 2-3 minutes.
          </AlertDescription>
        </Alert>
      )}

      {progress.status === 'error' && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Loading failed. Check the errors below and try again.
          </AlertDescription>
        </Alert>
      )}

      {progress.status === 'complete' && (
        <Alert className="border-green-500 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Successfully loaded {progress.processedDocs} documents with {progress.chunksCreated} chunks!
          </AlertDescription>
        </Alert>
      )}

      {(progress.status === 'loading' || progress.status === 'processing') && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">{progress.currentDoc}</span>
              <span className="font-medium">
                {progress.processedDocs} / {progress.totalDocs} documents
              </span>
            </div>
            <Progress value={getProgressPercentage()} />
          </div>

          {progress.chunksCreated > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="secondary">{progress.chunksCreated} chunks created</Badge>
            </div>
          )}
        </div>
      )}

      {progress.errors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-destructive">Errors ({progress.errors.length})</h4>
          <ScrollArea className="h-32 rounded-md border p-4">
            <div className="space-y-2">
              {progress.errors.map((err, idx) => (
                <div key={idx} className="text-xs">
                  <span className="font-mono text-muted-foreground">{err.docId}:</span>{' '}
                  <span className="text-destructive">{err.error}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleLoad}
          disabled={progress.status === 'loading' || progress.status === 'processing'}
          className="flex-1"
        >
          {progress.status === 'loading' || progress.status === 'processing' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Load Knowledge Base
            </>
          )}
        </Button>

        {(progress.status === 'complete' || progress.status === 'error') && (
          <Button onClick={reset} variant="outline">
            Reset
          </Button>
        )}
      </div>
    </Card>
  );
}
