import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Database,
  Search,
  Upload,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useRagSearch } from '@/hooks/useRagSearch';
import { useEmbeddingStatus } from '@/hooks/useEmbeddingStatus';
import { getKnowledgeBaseStats } from '@/lib/knowledgeBaseLoader';
import { useKnowledgeBaseLoader } from '@/hooks/useKnowledgeBaseLoader';
import { LoadDocumentsPanel } from '@/components/kb/LoadDocumentsPanel';
import { RAGTestPanel } from '@/components/kb/RAGTestPanel';
import { PhaseTracker } from '@/components/kb/PhaseTracker';
import { toast } from 'sonner';

export default function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const { search, loading: searchLoading, result, hasResult } = useRagSearch({
    matchThreshold: 0.7,
    matchCount: 10,
  });

  const {
    jobs,
    loading: jobsLoading,
    refetch: refetchJobs,
    getActiveJobs,
    getCompletedJobs,
    getFailedJobs,
    getJobProgress,
  } = useEmbeddingStatus(true, 5000);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  };

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const data = await getKnowledgeBaseStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load knowledge base statistics');
    } finally {
      setLoadingStats(false);
    }
  };

  const activeJobs = getActiveJobs();
  const completedJobs = getCompletedJobs();
  const failedJobs = getFailedJobs();

  return (
    <div className="container mx-auto py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Database className="h-8 w-8" />
              Knowledge Base Manager
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage vector embeddings and RAG system
            </p>
          </div>
          <Button onClick={loadStats} disabled={loadingStats}>
            {loadingStats ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <TrendingUp className="h-4 w-4 mr-2" />
            )}
            Load Stats
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Chunks</p>
                    <p className="text-2xl font-bold">{stats.totalChunks}</p>
                  </div>
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
              </Card>

              {Object.entries(stats.byCategory as Record<string, number>).slice(0, 3).map(([category, count]) => (
                <Card key={category} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground capitalize">{category}</p>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                    <Badge variant="secondary">{Math.round((count / stats.totalChunks) * 100)}%</Badge>
                  </div>
                </Card>
              ))}
            </div>
            
            <PhaseTracker />
          </div>
        )}

        <Tabs defaultValue="search" className="space-y-4">
          <TabsList>
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Search
            </TabsTrigger>
            <TabsTrigger value="load">
              <Upload className="h-4 w-4 mr-2" />
              Load Documents
            </TabsTrigger>
            <TabsTrigger value="test">
              <RefreshCw className="h-4 w-4 mr-2" />
              RAG Test
            </TabsTrigger>
            <TabsTrigger value="jobs">
              <Clock className="h-4 w-4 mr-2" />
              Embedding Jobs
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search knowledge base..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch} disabled={searchLoading || !searchQuery.trim()}>
                    {searchLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {hasResult && result && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Found {result.metadata.totalMatches} results
                      </p>
                      <Badge variant="outline">
                        Threshold: {(result.metadata.threshold * 100).toFixed(0)}%
                      </Badge>
                    </div>

                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-3">
                        {result.chunks.map((chunk, idx) => (
                          <Card key={idx} className="p-4 hover:bg-accent/50 transition-colors">
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {chunk.category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {(chunk.similarity * 100).toFixed(1)}% match
                                    </Badge>
                                  </div>
                                  <h4 className="font-semibold text-sm">{chunk.title}</h4>
                                  {chunk.section && (
                                    <p className="text-xs text-muted-foreground">{chunk.section}</p>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {chunk.content}
                              </p>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Load Documents Tab */}
          <TabsContent value="load" className="space-y-4">
            <LoadDocumentsPanel onLoadComplete={loadStats} />
          </TabsContent>

          {/* RAG Test Tab */}
          <TabsContent value="test" className="space-y-4">
            <RAGTestPanel />
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Embedding Jobs</h3>
                <Button variant="outline" size="sm" onClick={refetchJobs}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>

              {/* Job Summary */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">
                    Active: <strong>{activeJobs.length}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm">
                    Completed: <strong>{completedJobs.length}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">
                    Failed: <strong>{failedJobs.length}</strong>
                  </span>
                </div>
              </div>

              {/* Job List */}
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {jobsLoading && jobs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p>Loading jobs...</p>
                    </div>
                  ) : jobs.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Upload className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No embedding jobs found</p>
                    </div>
                  ) : (
                    jobs.map((job) => (
                      <Card key={job.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge
                                  variant={
                                    job.status === 'completed'
                                      ? 'default'
                                      : job.status === 'failed'
                                      ? 'destructive'
                                      : 'secondary'
                                  }
                                >
                                  {job.status}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {job.job_type}
                                </span>
                              </div>
                              {job.source_path && (
                                <p className="text-sm font-mono text-muted-foreground">
                                  {job.source_path}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(job.created_at).toLocaleString()}
                            </span>
                          </div>

                          {job.status === 'processing' && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                  {job.processed_chunks} / {job.total_chunks} chunks
                                </span>
                                <span>{getJobProgress(job)}%</span>
                              </div>
                              <Progress value={getJobProgress(job)} />
                            </div>
                          )}

                          {job.status === 'completed' && (
                            <div className="text-xs text-muted-foreground">
                              Completed {job.total_chunks} chunks
                              {job.completed_at && ` at ${new Date(job.completed_at).toLocaleString()}`}
                            </div>
                          )}

                          {job.status === 'failed' && job.error_log && (
                            <div className="text-xs text-destructive">
                              Failed: {JSON.stringify(job.error_log)}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
}
