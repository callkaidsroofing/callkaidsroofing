import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useCategorySummary, CategoryType } from '@/hooks/useCategorySummary';
import { FileText, RefreshCw, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

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

  const handleCategoryChange = async (category: CategoryType) => {
    setSelectedCategory(category);
    const summary = await getSummary(category, true, false);
    setCurrentSummary(summary);
  };

  const handleRefresh = async () => {
    const summary = await refreshSummary(selectedCategory);
    setCurrentSummary(summary);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Category Summaries</h3>
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
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {!currentSummary && !loading && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">
              Select a category to view its AI-generated summary
            </p>
            <Button onClick={() => handleCategoryChange(selectedCategory)}>
              Generate Summary
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Generating AI summary...</p>
          </div>
        )}

        {currentSummary && !loading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Generated {new Date(currentSummary.generatedAt).toLocaleString()}</span>
              <Badge variant="outline">
                {currentSummary.sources.knowledgeBase.chunks} KB chunks
              </Badge>
              <Badge variant="outline">
                {currentSummary.sources.knowledgeBase.files.length} files
              </Badge>
            </div>

            <ScrollArea className="h-[500px] border rounded-lg p-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{currentSummary.summary}</ReactMarkdown>
              </div>

              <div className="mt-8 pt-6 border-t">
                <h4 className="text-sm font-semibold mb-3">Source Files</h4>
                <div className="space-y-2">
                  {currentSummary.sources.knowledgeBase.files.slice(0, 10).map((file: any) => (
                    <div key={file.file_key} className="flex items-center gap-2 text-sm">
                      <Badge variant="secondary" className="text-xs">
                        {file.file_key}
                      </Badge>
                      <span className="text-muted-foreground">{file.title}</span>
                    </div>
                  ))}
                  {currentSummary.sources.knowledgeBase.files.length > 10 && (
                    <p className="text-xs text-muted-foreground">
                      +{currentSummary.sources.knowledgeBase.files.length - 10} more files
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </Card>
  );
}
