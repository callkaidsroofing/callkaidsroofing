import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Send, CheckCircle2, XCircle, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RAGTestPanelProps {
  onClose?: () => void;
}

interface TestResult {
  query: string;
  chunks: any[];
  metadata: any;
  error?: string;
  duration: number;
}

const SAMPLE_QUERIES = [
  'What are the CKR brand principles?',
  'How do I calculate a quote for roof restoration?',
  'What suburbs does CKR serve?',
  'What is the SOP for lead intake?',
  'Tell me about roof painting services',
];

export function RAGTestPanel({ onClose }: RAGTestPanelProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);

  const testRAG = async (testQuery: string) => {
    if (!testQuery.trim()) {
      toast.error('Please enter a query');
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('rag-search', {
        body: { 
          query: testQuery,
          matchCount: 5,
          matchThreshold: 0.7,
        },
      });

      const duration = Date.now() - startTime;

      if (error) {
        setResult({
          query: testQuery,
          chunks: [],
          metadata: {},
          error: error.message,
          duration,
        });
        toast.error(`RAG search failed: ${error.message}`);
        return;
      }

      setResult({
        query: testQuery,
        chunks: data.chunks || [],
        metadata: data.metadata || {},
        duration,
      });

      if (!data.chunks || data.chunks.length === 0) {
        toast.warning('No results found. Knowledge base may be empty.');
      } else {
        toast.success(`Found ${data.chunks.length} relevant chunks in ${duration}ms`);
      }
    } catch (error: any) {
      const duration = Date.now() - startTime;
      setResult({
        query: testQuery,
        chunks: [],
        metadata: {},
        error: error.message,
        duration,
      });
      toast.error(`Test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">RAG System Test</h3>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        )}
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Test the RAG (Retrieval-Augmented Generation) search to verify embeddings are working correctly.
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium mb-2 block">Sample Queries</label>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUERIES.map((sample) => (
              <Button
                key={sample}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(sample);
                  testRAG(sample);
                }}
                disabled={loading}
              >
                {sample}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Custom Query</label>
          <div className="flex gap-2">
            <Textarea
              placeholder="Enter your test query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-[80px]"
            />
            <Button 
              onClick={() => testRAG(query)} 
              disabled={loading || !query.trim()}
              size="sm"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {result && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Results</h4>
            <div className="flex items-center gap-2">
              <Badge variant={result.error ? 'destructive' : 'default'}>
                {result.duration}ms
              </Badge>
              {result.error ? (
                <XCircle className="h-4 w-4 text-destructive" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              )}
            </div>
          </div>

          <div className="text-sm">
            <strong>Query:</strong> {result.query}
          </div>

          {result.error ? (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Error:</strong> {result.error}
              </AlertDescription>
            </Alert>
          ) : (
            <>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Found: <strong>{result.chunks.length}</strong> chunks</span>
                <span>Threshold: <strong>{result.metadata.threshold || 0.7}</strong></span>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {result.chunks.map((chunk, idx) => (
                    <Card key={idx} className="p-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {chunk.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {((chunk.similarity || 0) * 100).toFixed(1)}% match
                            </Badge>
                          </div>
                          <h5 className="font-semibold text-sm">{chunk.title}</h5>
                          {chunk.section && (
                            <p className="text-xs text-muted-foreground">{chunk.section}</p>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-4">
                        {chunk.content}
                      </p>
                    </Card>
                  ))}
                  {result.chunks.length === 0 && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        No chunks found. The knowledge base may be empty or the query didn't match any content.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
