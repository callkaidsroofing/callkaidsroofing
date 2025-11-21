import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Zap, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface EmbeddingStats {
  total: number;
  withEmbeddings: number;
  withoutEmbeddings: number;
  byCategory: Record<string, { total: number; missing: number }>;
}

export default function EmbeddingGenerator() {
  const [stats, setStats] = useState<EmbeddingStats | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const fetchStats = async () => {
    try {
      // Get overall stats
      const { data: allDocs, error: allError } = await supabase
        .from('master_knowledge')
        .select('doc_id, category, embedding')
        .eq('active', true);

      if (allError) throw allError;

      const withEmbeddings = allDocs?.filter(d => d.embedding !== null).length || 0;
      const withoutEmbeddings = allDocs?.filter(d => d.embedding === null).length || 0;

      // Get by category
      const byCategory: Record<string, { total: number; missing: number }> = {};
      allDocs?.forEach(doc => {
        if (!byCategory[doc.category]) {
          byCategory[doc.category] = { total: 0, missing: 0 };
        }
        byCategory[doc.category].total++;
        if (doc.embedding === null) {
          byCategory[doc.category].missing++;
        }
      });

      setStats({
        total: allDocs?.length || 0,
        withEmbeddings,
        withoutEmbeddings,
        byCategory,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch embedding statistics');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const generateEmbeddings = async () => {
    if (!stats || stats.withoutEmbeddings === 0) {
      toast.info('All documents already have embeddings');
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-embeddings', {
        body: { batchSize: 10 },
      });

      if (error) throw error;

      setResults(data);
      setProgress(100);

      if (data.failed > 0) {
        toast.warning(
          `Generated ${data.processed} embeddings, ${data.failed} failed`,
          { duration: 5000 }
        );
      } else {
        toast.success(`Successfully generated ${data.processed} embeddings!`);
      }

      // Refresh stats
      await fetchStats();
    } catch (error: any) {
      console.error('Error generating embeddings:', error);
      toast.error(`Failed to generate embeddings: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const completionPercentage = stats 
    ? Math.round((stats.withEmbeddings / stats.total) * 100)
    : 0;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Embedding Generator</h1>
        <p className="text-muted-foreground">
          Generate vector embeddings for master_knowledge documents to enable RAG search
        </p>
      </div>

      {/* Overall Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Embedding Coverage</CardTitle>
          <CardDescription>
            Vector embeddings enable semantic search across the knowledge base
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {stats && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">
                    {stats.withEmbeddings} / {stats.total} documents ({completionPercentage}%)
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-2 p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">With Embeddings</p>
                    <p className="text-2xl font-bold">{stats.withEmbeddings}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Missing Embeddings</p>
                    <p className="text-2xl font-bold">{stats.withoutEmbeddings}</p>
                  </div>
                </div>
              </div>

              {stats.withoutEmbeddings > 0 && (
                <Button
                  onClick={generateEmbeddings}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating Embeddings...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Generate All Missing Embeddings
                    </>
                  )}
                </Button>
              )}

              {isGenerating && progress > 0 && (
                <Progress value={progress} className="h-2" />
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Embedding coverage by knowledge category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.byCategory).map(([category, data]) => {
                const categoryPercent = Math.round(
                  ((data.total - data.missing) / data.total) * 100
                );
                return (
                  <div key={category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">
                        {data.total - data.missing} / {data.total} ({categoryPercent}%)
                      </span>
                    </div>
                    <Progress value={categoryPercent} className="h-1.5" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Embedding Generation Complete</p>
              <p className="text-sm">
                Processed: {results.processed} | Failed: {results.failed} | Total: {results.total}
              </p>
              {results.errors && results.errors.length > 0 && (
                <details className="mt-2">
                  <summary className="text-sm cursor-pointer text-destructive">
                    View {results.errors.length} errors
                  </summary>
                  <ul className="mt-2 space-y-1 text-xs">
                    {results.errors.map((err: any, i: number) => (
                      <li key={i}>
                        {err.doc_id} ({err.title}): {err.error}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
