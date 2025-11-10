import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFileManager, KnowledgeFile } from '@/hooks/useFileManager';
import { FileText, Folder, Search, Plus, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FileBrowserProps {
  onFileSelect: (file: KnowledgeFile) => void;
  onCreateNew: () => void;
}

export function FileBrowser({ onFileSelect, onCreateNew }: FileBrowserProps) {
  const { loading, files, listFiles } = useFileManager();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    listFiles();
  }, []);

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.file_key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(files.map(f => f.category)));

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Folder className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Knowledge Base Files</h3>
            <Badge variant="secondary">{files.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => listFiles()}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button size="sm" onClick={onCreateNew}>
              <Plus className="h-4 w-4 mr-1" />
              New File
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {filteredFiles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No files found</p>
              </div>
            ) : (
              filteredFiles.map(file => (
                <div
                  key={file.id}
                  onClick={() => onFileSelect(file)}
                  className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="font-medium truncate">{file.title}</span>
                        {file.metadata?.source === 'chunks' && (
                          <Badge variant="outline" className="text-xs bg-primary/10">
                            RAG Vector
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                        <Badge variant="outline" className="text-xs">
                          {file.file_key}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {file.category}
                        </Badge>
                        <span className="text-xs">
                          v{file.version}
                        </span>
                        {file.metadata?.totalChunks && (
                          <span className="text-xs text-primary">
                            {file.metadata.totalChunks} chunks
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {file.updated_at && !isNaN(new Date(file.updated_at).getTime())
                        ? formatDistanceToNow(new Date(file.updated_at), { addSuffix: true })
                        : 'Unknown date'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
