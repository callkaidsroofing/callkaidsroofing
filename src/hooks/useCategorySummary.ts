import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type CategoryType = 'sops' | 'pricing' | 'inspections' | 'quotes' | 'services' | 'general';

export interface CategorySummary {
  category: CategoryType;
  summary: string;
  sources: {
    knowledgeBase: {
      files: any[];
      chunks: number;
    };
    operational: any;
  };
  generatedAt: string;
}

export function useCategorySummary() {
  const [loading, setLoading] = useState(false);
  const [summaries, setSummaries] = useState<Map<CategoryType, CategorySummary>>(new Map());
  const { toast } = useToast();

  const getSummary = async (
    category: CategoryType,
    includeOperationalData = true,
    forceRefresh = false
  ): Promise<CategorySummary | null> => {
    // Return cached if available and not forcing refresh
    if (!forceRefresh && summaries.has(category)) {
      return summaries.get(category)!;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('category-summarizer', {
        body: { category, includeOperationalData }
      });

      if (error) throw error;
      
      const summary: CategorySummary = data;
      setSummaries(prev => new Map(prev).set(category, summary));
      
      return summary;
    } catch (error: any) {
      toast({
        title: 'Error generating summary',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const refreshSummary = async (category: CategoryType) => {
    return getSummary(category, true, true);
  };

  const clearCache = () => {
    setSummaries(new Map());
  };

  return {
    loading,
    summaries,
    getSummary,
    refreshSummary,
    clearCache
  };
}
