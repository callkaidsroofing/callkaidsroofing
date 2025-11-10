import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileBrowser } from '@/components/admin/FileBrowser';
import { FileEditor } from '@/components/admin/FileEditor';
import { ConflictResolverChat } from '@/components/admin/ConflictResolverChat';
import { CategoryView } from '@/components/admin/CategoryView';
import { useFileManager, KnowledgeFile } from '@/hooks/useFileManager';
import { useConflictResolver } from '@/hooks/useConflictResolver';
import { Database, FileText, AlertTriangle, ExternalLink, BarChart3 } from 'lucide-react';
import { useEffect } from 'react';
import { getKnowledgeBaseStats } from '@/lib/knowledgeBaseLoader';

export default function StorageAdmin() {
  const [selectedFile, setSelectedFile] = useState<KnowledgeFile | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const { currentConflict, setCurrentConflict, listPendingConflicts } = useConflictResolver();
  const { listFiles } = useFileManager();
  const [stats, setStats] = useState<any>(null);
  const [pendingConflictsCount, setPendingConflictsCount] = useState(0);

  useEffect(() => {
    loadStats();
    loadConflicts();
  }, []);

  const loadStats = async () => {
    try {
      const kbStats = await getKnowledgeBaseStats();
      setStats(kbStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadConflicts = async () => {
    const conflicts = await listPendingConflicts();
    setPendingConflictsCount(conflicts.length);
  };

  const handleFileSelect = (file: KnowledgeFile) => {
    setSelectedFile(file);
    setShowEditor(true);
    setShowCreateNew(false);
  };

  const handleCreateNew = () => {
    setSelectedFile(null);
    setShowEditor(false);
    setShowCreateNew(true);
  };

  const handleEditorClose = () => {
    setShowEditor(false);
    setSelectedFile(null);
  };

  const handleFileSaved = async () => {
    await listFiles();
    await loadStats();
    setShowEditor(false);
    setSelectedFile(null);
  };

  const handleConflictResolved = async () => {
    await loadConflicts();
    setCurrentConflict(null);
    await listFiles();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Storage Administration</h1>
          <p className="text-muted-foreground">
            AI-powered knowledge base and database management
          </p>
        </div>
        {pendingConflictsCount > 0 && (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="h-3 w-3" />
            {pendingConflictsCount} Conflicts
          </Badge>
        )}
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalChunks}</p>
                <p className="text-sm text-muted-foreground">Total Chunks</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Object.keys(stats.byCategory || {}).length}</p>
                <p className="text-sm text-muted-foreground">Categories</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.hasEmbeddings ? 'Ready' : 'Empty'}</p>
                <p className="text-sm text-muted-foreground">RAG Status</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingConflictsCount}</p>
                <p className="text-sm text-muted-foreground">Pending Conflicts</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Conflict Resolution */}
      {currentConflict && (
        <ConflictResolverChat
          conflict={currentConflict}
          onResolved={handleConflictResolved}
          onCancel={() => setCurrentConflict(null)}
        />
      )}

      {/* Main Content */}
      <Tabs defaultValue="files" className="w-full">
        <TabsList>
          <TabsTrigger value="files">File Browser</TabsTrigger>
          <TabsTrigger value="categories">Category Views</TabsTrigger>
          <TabsTrigger value="external">External Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <FileBrowser
              onFileSelect={handleFileSelect}
              onCreateNew={handleCreateNew}
            />

            {showEditor && (
              <FileEditor
                file={selectedFile}
                onClose={handleEditorClose}
                onSaved={handleFileSaved}
              />
            )}

            {showCreateNew && (
              <Card className="p-6 text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4">
                  File creation UI coming soon
                </p>
                <Button variant="outline" onClick={() => setShowCreateNew(false)}>
                  Cancel
                </Button>
              </Card>
            )}

            {!showEditor && !showCreateNew && (
              <Card className="p-12 text-center text-muted-foreground">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a file to view and edit</p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryView />
        </TabsContent>

        <TabsContent value="external">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">External Tools & Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => window.open('https://supabase.com/dashboard/project/vlnkzpyeppfdmresiaoh/editor', '_blank')}
              >
                <Database className="h-8 w-8" />
                <span className="font-medium">Database Tables</span>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => window.open('https://supabase.com/dashboard/project/vlnkzpyeppfdmresiaoh/functions', '_blank')}
              >
                <FileText className="h-8 w-8" />
                <span className="font-medium">Edge Functions</span>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => window.open('https://supabase.com/dashboard/project/vlnkzpyeppfdmresiaoh/storage/buckets', '_blank')}
              >
                <Database className="h-8 w-8" />
                <span className="font-medium">Storage Buckets</span>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => window.open('https://supabase.com/dashboard/project/vlnkzpyeppfdmresiaoh/logs/edge-functions', '_blank')}
              >
                <BarChart3 className="h-8 w-8" />
                <span className="font-medium">Function Logs</span>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => window.open('https://supabase.com/dashboard/project/vlnkzpyeppfdmresiaoh/auth/users', '_blank')}
              >
                <Database className="h-8 w-8" />
                <span className="font-medium">User Management</span>
                <ExternalLink className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                className="h-auto py-6 flex flex-col gap-2"
                onClick={() => window.open('https://supabase.com/dashboard/project/vlnkzpyeppfdmresiaoh/sql/new', '_blank')}
              >
                <FileText className="h-8 w-8" />
                <span className="font-medium">SQL Editor</span>
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
