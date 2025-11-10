import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, ExternalLink, FileText, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { getKnowledgeBaseStats } from '@/lib/knowledgeBaseLoader';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PROJECT_ID = 'vlnkzpyeppfdmresiaoh';

export default function DatabaseManagement() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  const loadStats = async () => {
    setLoading(true);
    try {
      const data = await getKnowledgeBaseStats();
      setStats(data);
    } catch (error: any) {
      toast.error(`Failed to load stats: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const clearKnowledgeBase = async () => {
    if (!confirm('Are you sure you want to delete ALL knowledge base chunks? This cannot be undone.')) {
      return;
    }

    setClearing(true);
    try {
      const { error } = await supabase
        .from('knowledge_chunks')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

      if (error) throw error;

      toast.success('Knowledge base cleared successfully');
      await loadStats();
    } catch (error: any) {
      toast.error(`Failed to clear: ${error.message}`);
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Management
          </h1>
          <p className="text-muted-foreground mt-1">Admin tools for database, KB, and Supabase resources</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="knowledge-base">Knowledge Base</TabsTrigger>
          <TabsTrigger value="supabase">Supabase Tools</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Knowledge Base
                </h3>
                <Badge variant={stats?.hasEmbeddings ? 'default' : 'secondary'}>
                  {stats?.hasEmbeddings ? 'Active' : 'Not Loaded'}
                </Badge>
              </div>
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm">Total Chunks: <strong>{stats?.totalChunks || 0}</strong></div>
                  <div className="space-y-1">
                    {stats && Object.entries(stats.byCategory).map(([key, val]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-muted-foreground">{key}</span>
                        <span className="font-medium">{val as number}</span>
                      </div>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" onClick={loadStats} className="w-full mt-2">
                    <RefreshCw className="h-3 w-3 mr-2" /> Refresh
                  </Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">System Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Project ID</span>
                  <code className="text-xs">{PROJECT_ID}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Vector DB</span>
                  <Badge variant="outline">pgvector</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Embedding Model</span>
                  <Badge variant="outline">text-embedding-004</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">RAG Endpoint</span>
                  <Badge variant={stats?.hasEmbeddings ? 'default' : 'secondary'}>
                    {stats?.hasEmbeddings ? 'Ready' : 'No Data'}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                  <a href="/internal/v2/admin/knowledge-base">
                    <FileText className="h-4 w-4 mr-2" /> KB Manager
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/editor`} target="_blank">
                    <Database className="h-4 w-4 mr-2" /> Table Editor
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/functions`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" /> Edge Functions
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge-base" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Knowledge Base Administration</h3>
            
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Use the Knowledge Base Manager to load MKF documents. These tools are for maintenance only.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Vector Embeddings Status</h4>
                  <p className="text-sm text-muted-foreground">
                    {stats?.totalChunks || 0} chunks embedded across {Object.keys(stats?.byCategory || {}).length} categories
                  </p>
                </div>
                <Button onClick={loadStats} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Load Documents</h4>
                  <p className="text-sm text-muted-foreground">
                    Embed MKF documents from MASTER_INDEX.json
                  </p>
                </div>
                <Button asChild>
                  <a href="/internal/v2/admin/knowledge-base">Open Manager</a>
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg bg-destructive/5">
                <div>
                  <h4 className="font-medium text-destructive">Clear Knowledge Base</h4>
                  <p className="text-sm text-muted-foreground">
                    Delete all embeddings (cannot be undone)
                  </p>
                </div>
                <Button 
                  onClick={clearKnowledgeBase} 
                  disabled={clearing || !stats?.hasEmbeddings}
                  variant="destructive"
                  size="sm"
                >
                  {clearing ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Clearing...</>
                  ) : (
                    <><Trash2 className="h-4 w-4 mr-2" /> Clear All</>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {stats?.byCategory && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Chunks by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.byCategory).map(([category, count]) => (
                  <div key={category} className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold">{count as number}</div>
                    <div className="text-sm text-muted-foreground capitalize">{category}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Supabase Tools Tab */}
        <TabsContent value="supabase" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-6">
              <h3 className="font-semibold mb-3">Database Tools</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/editor`} target="_blank">
                    <Database className="h-4 w-4 mr-2" /> Table Editor
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new`} target="_blank">
                    <FileText className="h-4 w-4 mr-2" /> SQL Editor
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/database/migrations`} target="_blank">
                    <RefreshCw className="h-4 w-4 mr-2" /> Migrations
                  </a>
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Edge Functions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/functions`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" /> All Functions
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/functions/embed-knowledge-base/logs`} target="_blank">
                    <FileText className="h-4 w-4 mr-2" /> Embedding Logs
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/functions/rag-search/logs`} target="_blank">
                    <FileText className="h-4 w-4 mr-2" /> RAG Search Logs
                  </a>
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Storage & Auth</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/storage/buckets`} target="_blank">
                    <Database className="h-4 w-4 mr-2" /> Storage Buckets
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/auth/users`} target="_blank">
                    <Database className="h-4 w-4 mr-2" /> User Management
                  </a>
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-3">Monitoring</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/logs/postgres-logs`} target="_blank">
                    <FileText className="h-4 w-4 mr-2" /> Database Logs
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/settings/api`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" /> API Settings
                  </a>
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
