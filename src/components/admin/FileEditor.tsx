import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFileManager, KnowledgeFile, FileVersion } from '@/hooks/useFileManager';
import { useConflictResolver } from '@/hooks/useConflictResolver';
import { Save, History, AlertTriangle, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import ReactMarkdown from 'react-markdown';

interface FileEditorProps {
  file: KnowledgeFile | null;
  onClose: () => void;
  onSaved: () => void;
}

export function FileEditor({ file, onClose, onSaved }: FileEditorProps) {
  const { loading, updateFile, versions, chunkCount, getFile } = useFileManager();
  const { detectConflict, currentConflict } = useConflictResolver();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [changeSummary, setChangeSummary] = useState('');

  useEffect(() => {
    if (file) {
      setTitle(file.title);
      setContent(file.content);
      setCategory(file.category);
      getFile(file.id);
    }
  }, [file]);

  const handleSave = async () => {
    if (!file) return;

    // Detect conflicts first
    const conflictResult = await detectConflict(file.id, content);
    
    if (conflictResult?.hasConflict) {
      // Conflict detected - let the ConflictResolverChat handle it
      return;
    }

    // No conflict - proceed with update
    const result = await updateFile(
      file.id,
      content,
      title,
      category,
      { changeSummary }
    );

    if (result) {
      onSaved();
    }
  };

  if (!file) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select a file to edit</p>
      </Card>
    );
  }

  if (currentConflict) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4 text-amber-600">
          <AlertTriangle className="h-5 w-5" />
          <h3 className="font-semibold">Conflict Detected</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          The AI has detected conflicts between your changes and existing content.
          Please resolve them before saving.
        </p>
        <Button variant="outline" onClick={onClose}>
          Close Editor
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{file.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{file.file_key}</Badge>
              <Badge variant="secondary">v{file.version}</Badge>
              <span className="text-sm text-muted-foreground">
                {chunkCount} chunks embedded
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="history">
              <History className="h-4 w-4 mr-2" />
              History ({versions.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="brand">Brand</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                  <SelectItem value="workflows">Workflows</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            </div>

            <div>
              <Label htmlFor="changeSummary">Change Summary (Optional)</Label>
              <Input
                id="changeSummary"
                value={changeSummary}
                onChange={(e) => setChangeSummary(e.target.value)}
                placeholder="Brief description of changes..."
              />
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <ScrollArea className="h-[500px] border rounded-lg p-4">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="history">
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {versions.map((version: FileVersion) => (
                  <div key={version.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <Badge>Version {version.version_number}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {version.change_summary && (
                      <p className="text-sm text-muted-foreground">
                        {version.change_summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
