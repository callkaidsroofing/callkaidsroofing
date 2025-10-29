import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Search, Plus, FileText, Share2, RefreshCw, Clock, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AIAssistantPanel } from '@/components/shared/AIAssistantPanel';

interface Document {
  id: string;
  type: string;
  title: string;
  content: any;
  version: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export default function DocsHub() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [showAIWriter, setShowAIWriter] = useState(false);

  const handleAIGenerate = (generatedData: any) => {
    if (generatedData.title) setEditTitle(generatedData.title);
    if (generatedData.content) setEditContent(generatedData.content);
    if (generatedData.category) setFilterType(generatedData.category);
    setIsEditing(true);
    setShowAIWriter(false);
    toast.success('AI-generated document applied! Review and save when ready.');
  };

  useEffect(() => {
    loadDocuments();
  }, [filterType]);

  const loadDocuments = async () => {
    try {
      let query = supabase
        .from('documents' as any)
        .select('*')
        .order('updated_at', { ascending: false });

      if (filterType !== 'all') {
        query = query.eq('type', filterType);
      }

      const { data, error } = await query;

      if (error) throw error;
      setDocuments((data || []) as any as Document[]);
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const handleCreateDocument = () => {
    setIsEditing(true);
    setSelectedDoc(null);
    setEditTitle('');
    setEditContent('');
    setEditTags([]);
  };

  const handleSaveDocument = async () => {
    try {
      if (!editTitle.trim()) {
        toast.error('Title is required');
        return;
      }

      const documentData = {
        type: filterType !== 'all' ? filterType : 'guide',
        title: editTitle,
        content: { text: editContent },
        tags: editTags,
        version: selectedDoc ? selectedDoc.version + 1 : 1
      };

      let result;

      if (selectedDoc) {
        // Update existing
        const { data, error } = await supabase
          .from('documents' as any)
          .update(documentData)
          .eq('id', selectedDoc.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('documents' as any)
          .insert(documentData)
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      toast.success(selectedDoc ? 'Document updated' : 'Document created');
      setIsEditing(false);
      setSelectedDoc(result);
      loadDocuments();
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    }
  };

  const handleSelectDocument = (doc: Document) => {
    setSelectedDoc(doc);
    setIsEditing(false);
    setEditTitle(doc.title);
    setEditContent(typeof doc.content === 'string' ? doc.content : doc.content.text || '');
    setEditTags(doc.tags || []);
  };

  const handleShareDocument = async (docId: string) => {
    try {
      // Generate share code
      const shareCode = Math.random().toString(36).substring(2, 10);
      
      const { error } = await supabase
        .from('documents' as any)
        .update({ share_code: shareCode } as any)
        .eq('id', docId);

      if (error) throw error;

      const shareUrl = `${window.location.origin}/docs/shared/${shareCode}`;
      navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard');
    } catch (error) {
      console.error('Error sharing document:', error);
      toast.error('Failed to generate share link');
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Docs Hub</h1>
          <p className="text-muted-foreground">Knowledge base and document management</p>
        </div>
        <div className="flex gap-2">
          <Sheet open={showAIWriter} onOpenChange={setShowAIWriter}>
            <SheetTrigger asChild>
              <Button variant="secondary">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Writer
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[600px] sm:max-w-[600px]">
              <SheetHeader>
                <SheetTitle>AI Document Writer</SheetTitle>
              </SheetHeader>
              <div className="mt-6 h-[calc(100vh-8rem)]">
                <AIAssistantPanel
                  functionName="docs-writer-assistant"
                  onGenerate={handleAIGenerate}
                  placeholder="Describe the document you need..."
                  title="Document AI"
                  examples={[
                    "Write a 7-year workmanship warranty policy",
                    "Create a roof inspection checklist SOP",
                    "Draft a customer maintenance guide for tiled roofs",
                  ]}
                />
              </div>
            </SheetContent>
          </Sheet>
          <Button onClick={handleCreateDocument}>
            <Plus className="h-4 w-4 mr-2" />
            New Document
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Document Browser */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Documents</CardTitle>
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="policy">Policies</SelectItem>
                  <SelectItem value="warranty">Warranties</SelectItem>
                  <SelectItem value="kf">KF Pricing</SelectItem>
                  <SelectItem value="sop">SOPs</SelectItem>
                  <SelectItem value="format">Formats</SelectItem>
                  <SelectItem value="guide">Guides</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-4">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleSelectDocument(doc)}
                    className={`p-3 rounded-md cursor-pointer hover:bg-muted transition-colors ${
                      selectedDoc?.id === doc.id ? 'bg-muted' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{doc.title}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{doc.type}</Badge>
                          <span className="text-xs text-muted-foreground">v{doc.version}</span>
                        </div>
                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {doc.tags.slice(0, 2).map((tag, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Document Viewer/Editor */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {isEditing ? (selectedDoc ? 'Edit Document' : 'New Document') : selectedDoc?.title || 'Select a document'}
                </CardTitle>
                {selectedDoc && !isEditing && (
                  <CardDescription>
                    Version {selectedDoc.version} • Last updated {new Date(selectedDoc.updated_at).toLocaleDateString()}
                  </CardDescription>
                )}
              </div>
              {selectedDoc && !isEditing && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleShareDocument(selectedDoc.id)}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Document title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Document content..."
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (comma-separated)</label>
                  <Input
                    value={editTags.join(', ')}
                    onChange={(e) => setEditTags(e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                    placeholder="roofing, warranty, policy..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveDocument}>Save Document</Button>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(false);
                    if (!selectedDoc) setSelectedDoc(null);
                  }}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : selectedDoc ? (
              <ScrollArea className="h-[600px]">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap font-sans">
                    {typeof selectedDoc.content === 'string' 
                      ? selectedDoc.content 
                      : selectedDoc.content.text || JSON.stringify(selectedDoc.content, null, 2)}
                  </pre>
                </div>
              </ScrollArea>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a document to view or create a new one</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
