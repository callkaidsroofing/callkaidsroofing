import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCalculateFinalPrice } from '@/hooks/usePricing';

interface PricingItem {
  id: string;
  item_id: string;
  item_name: string;
  item_category: string;
  base_cost: number;
  unit_of_measure: string;
  usage_notes: string;
  similarity: number;
}

interface SmartPricingSuggestionsProps {
  context: string; // Job description, service type, or inspection notes
  onAddItem?: (item: PricingItem) => void;
  maxSuggestions?: number;
}

export function SmartPricingSuggestions({
  context,
  onAddItem,
  maxSuggestions = 5
}: SmartPricingSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<PricingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const calculateFinalPrice = useCalculateFinalPrice();

  useEffect(() => {
    if (context && context.length > 10) {
      fetchSuggestions();
    }
  }, [context]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('rag-search', {
        body: {
          query: context,
          matchCount: maxSuggestions,
          matchThreshold: 0.5,
          sourceTypes: ['pricing_items']
        }
      });

      if (error) throw error;
      setSuggestions(data.results || []);
    } catch (error) {
      console.error('Error fetching pricing suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            AI Pricing Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Analyzing context and fetching relevant pricing items...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions.length) {
    return null;
  }

  return (
    <Card className="glass-card border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI-Suggested Pricing Items
          <Badge variant="outline" className="ml-auto">
            {suggestions.length} matches
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-all group"
          >
            <div className="flex-1 min-w-0 mr-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm truncate">{item.item_name}</span>
                <Badge variant="outline" className="text-xs">
                  {item.item_category}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-1 line-clamp-1">
                {item.usage_notes}
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">
                  Base: <span className="font-semibold text-foreground">${Number(item.base_cost).toFixed(2)}</span>
                </span>
                <span className="text-muted-foreground">→</span>
                <span className="text-green-600 dark:text-green-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  ${calculateFinalPrice(Number(item.base_cost))}
                </span>
                <span className="text-muted-foreground">/{item.unit_of_measure}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary text-xs">
                {(item.similarity * 100).toFixed(0)}%
              </Badge>
              {onAddItem && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-primary/20"
                  onClick={() => onAddItem(item)}
                >
                  <Plus className="h-4 w-4 text-primary" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
