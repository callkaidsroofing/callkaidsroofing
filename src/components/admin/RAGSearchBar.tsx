import { useState } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';

interface RAGResult {
  id: string;
  title: string;
  content: string;
  source_table: string;
  similarity: number;
  metadata?: any;
}

interface RAGSearchBarProps {
  placeholder?: string;
  searchTypes?: string[];
  onResultSelect?: (result: RAGResult) => void;
  autoSearch?: boolean;
  minChars?: number;
}

export function RAGSearchBar({ 
  placeholder = "Search knowledge base and pricing...",
  searchTypes = ['all'],
  onResultSelect,
  autoSearch = true,
  minChars = 3
}: RAGSearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const { data: results, isLoading } = useQuery({
    queryKey: ['rag-search', debouncedQuery, searchTypes],
    queryFn: async () => {
      if (!debouncedQuery || debouncedQuery.length < minChars) return [];

      const { data, error } = await supabase.functions.invoke('rag-search', {
        body: {
          query: debouncedQuery,
          matchCount: 8,
          matchThreshold: 0.6,
          sourceTypes: searchTypes
        }
      });

      if (error) throw error;
      return data.results as RAGResult[];
    },
    enabled: autoSearch && debouncedQuery.length >= minChars,
  });

  const handleSelect = (result: RAGResult) => {
    setQuery('');
    setIsOpen(false);
    onResultSelect?.(result);
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      'pricing_items': 'Pricing',
      'content_services': 'Services',
      'content_knowledge_base': 'FAQ',
      'knowledge_docs': 'Knowledge',
      'content_case_studies': 'Case Study',
      'master_knowledge': 'Knowledge Base'
    };
    return labels[source] || source;
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'pricing_items': 'bg-green-500/10 text-green-700 dark:text-green-400',
      'content_services': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      'content_knowledge_base': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      'knowledge_docs': 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
      'master_knowledge': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
    };
    return colors[source] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-pulse" />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="pl-10 pr-10 border-primary/20 focus:border-primary/40"
        />
      </div>

      {isOpen && query.length >= minChars && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto shadow-xl border-2 border-primary/20">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Searching...
              </div>
            ) : results && results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result) => (
                  <Button
                    key={result.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-3 px-3 hover:bg-primary/5"
                    onClick={() => handleSelect(result)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm truncate">{result.title}</span>
                        <Badge className={`text-xs ${getSourceColor(result.source_table)}`}>
                          {getSourceLabel(result.source_table)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {(result.similarity * 100).toFixed(0)}% match
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {result.content}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            ) : query.length >= minChars ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No results found for "{query}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
