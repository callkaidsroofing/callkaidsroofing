import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, ExternalLink, FileText } from 'lucide-react';
import { getKnowledgeBaseStats } from '@/lib/knowledgeBaseLoader';

const PROJECT_ID = 'vlnkzpyeppfdmresiaoh';

export default function DatabaseManagement() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getKnowledgeBaseStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8" />
            Database Management
          </h1>
          <p className="text-muted-foreground mt-1">Quick access to Supabase tools and Knowledge Base stats</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/sql/new`} target="_blank" rel="noreferrer">
              SQL Editor <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/editor`} target="_blank" rel="noreferrer">
              Table Editor <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`https://supabase.com/dashboard/project/${PROJECT_ID}/functions`} target="_blank" rel="noreferrer">
              Edge Functions <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        </div>
      </div>

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
              <Loader2 className="h-4 w-4 animate-spin" /> Loading stats...
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
          </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• Use Knowledge Base Manager to embed MKF documents</p>
            <p>• Manage functions, storage and RLS in Supabase</p>
            <p>• Use SQL Editor for admin queries</p>
          </div>
          <div className="mt-4">
            <Button asChild>
              <a href="/internal/v2/admin/knowledge-base">Open Knowledge Base Manager</a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
