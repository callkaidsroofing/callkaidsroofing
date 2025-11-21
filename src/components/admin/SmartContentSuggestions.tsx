import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface ContentSuggestion {
  id: string;
  title: string;
  content: string;
  source_table: string;
  source_id: string;
  similarity: number;
  metadata?: any;
}

interface SmartContentSuggestionsProps {
  context: string;
  excludeTypes?: string[];
  maxSuggestions?: number;
  title?: string;
}

export function SmartContentSuggestions({
  context,
  excludeTypes = [],
  maxSuggestions = 4,
  title = "Related Content"
}: SmartContentSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (context && context.length > 10) {
      fetchSuggestions();
    }
  }, [context, excludeTypes]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rag-search', {
        body: {
          query: context,
          matchCount: maxSuggestions,
          matchThreshold: 0.6,
          sourceTypes: ['content_services', 'content_knowledge_base', 'content_case_studies', 'master_knowledge']
            .filter(type => !excludeTypes.includes(type))
        }
      });

      if (error) throw error;
      setSuggestions(data.results || []);
    } catch (error) {
      console.error('Error fetching content suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentLink = (item: ContentSuggestion) => {
    const linkMap: Record<string, string> = {
      'content_services': `/admin/cms/services`,
      'content_knowledge_base': `/admin/cms/knowledge`,
      'content_case_studies': `/admin/cms/case-studies`,
      'master_knowledge': `/admin/cms/knowledge`
    };
    return linkMap[item.source_table] || '#';
  };

  const getSourceLabel = (source: string) => {
    const labels: Record<string, string> = {
      'content_services': 'Service',
      'content_knowledge_base': 'FAQ',
      'content_case_studies': 'Case Study',
      'master_knowledge': 'Knowledge'
    };
    return labels[source] || source;
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      'content_services': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
      'content_knowledge_base': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
      'content_case_studies': 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
      'master_knowledge': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400'
    };
    return colors[source] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Finding related content...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions.length) {
    return null;
  }

  return (
    <Card className="glass-card border-2 border-primary/20">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {title}
          <Badge variant="outline" className="ml-auto">
            {suggestions.length} items
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-all group"
          >
            <div className="flex-1 min-w-0 mr-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm truncate">{item.title}</span>
                <Badge className={`text-xs ${getSourceColor(item.source_table)}`}>
                  {getSourceLabel(item.source_table)}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {item.content}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className="text-xs">
                {(item.similarity * 100).toFixed(0)}%
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-primary/20"
                asChild
              >
                <Link to={getContentLink(item)}>
                  <ExternalLink className="h-3 w-3 text-primary" />
                </Link>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
