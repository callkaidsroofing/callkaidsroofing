import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useCategorySummary, CategoryType } from '@/hooks/useCategorySummary';
import { FileText, RefreshCw, Loader2, Database } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const categories: { value: CategoryType; label: string; description: string }[] = [
  { value: 'sops', label: 'SOPs & Procedures', description: 'Standard operating procedures and workflows' },
  { value: 'pricing', label: 'Pricing System', description: 'Rates, calculations, and pricing rules' },
  { value: 'inspections', label: 'Inspection Forms', description: 'Assessment procedures and reporting' },
  { value: 'quotes', label: 'Quote Procedures', description: 'Quoting workflows and templates' },
  { value: 'services', label: 'Services Catalog', description: 'Service offerings and capabilities' },
];

export function CategoryView() {
  const { loading, summaries, getSummary, refreshSummary } = useCategorySummary();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('sops');
  const [currentSummary, setCurrentSummary] = useState<any>(null);
  const [categoryFiles, setCategoryFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const { toast } = useToast();

  const loadCategoryFiles = async (category: CategoryType) => {
    setLoadingFiles(true);
    try {
      const { data, error } = await supabase.functions.invoke('file-manager', {
        body: { action: 'list', category }
      });

      if (error) throw error;
      setCategoryFiles(data.files || []);
    } catch (error: any) {
      console.error('Error loading category files:', error);
      toast({
        title: 'Error loading files',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleCategoryChange = async (category: CategoryType) => {
    setSelectedCategory(category);
    const summary = await getSummary(category, true, false);
    setCurrentSummary(summary);
    await loadCategoryFiles(category);
  };

  const handleRefresh = async () => {
    const summary = await refreshSummary(selectedCategory);
    setCurrentSummary(summary);
    await loadCategoryFiles(selectedCategory);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Category Knowledge Base</h3>
            <Badge variant="secondary">{categoryFiles.length} files</Badge>
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[250px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading || loadingFiles}
            >
              <RefreshCw className={`h-4 w-4 ${(loading || loadingFiles) ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* AI Summary Section */}
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              AI Category Summary
            </h4>
            {!currentSummary && !loading && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground mb-4 text-sm">
                  Select a category to view its AI-generated summary
                </p>
                <Button size="sm" onClick={() => handleCategoryChange(selectedCategory)}>
                  Generate Summary
                </Button>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground text-sm">Generating AI summary...</p>
              </div>
            )}

            {currentSummary && !loading && (
              <ScrollArea className="h-[500px]">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown>{currentSummary.summary}</ReactMarkdown>
                </div>
                <div className="mt-4 text-xs text-muted-foreground">
                  Generated {new Date(currentSummary.generatedAt).toLocaleString()}
                </div>
              </ScrollArea>
            )}
          </Card>

          {/* Files Listing Section */}
          <Card className="p-4 bg-muted/30">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Category Files ({categoryFiles.length})
            </h4>
            {loadingFiles ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : categoryFiles.length === 0 ? (
              <div className="text-center text-muted-foreground py-12 text-sm">
                No files in this category
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-2">
                  {categoryFiles.map(file => (
                    <div key={file.id} className="p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="h-3 w-3 text-primary flex-shrink-0" />
                              <span className="font-medium text-sm truncate">{file.title}</span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            v{file.version}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">{file.file_key}</Badge>
                          {file.metadata?.source === 'chunks' && (
                            <Badge variant="default" className="text-xs bg-primary/20 border-primary/30">
                              RAG Vector
                            </Badge>
                          )}
                          {file.metadata?.totalChunks && (
                            <span className="text-xs text-primary font-medium">
                              {file.metadata.totalChunks} chunks
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </Card>
        </div>
      </div>
    </Card>
  );
}
