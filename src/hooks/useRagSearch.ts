import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RagSearchChunk {
  title: string;
  category: string;
  section: string | null;
  content: string;
  similarity: number;
}

export interface RagSearchResult {
  query: string;
  chunks: RagSearchChunk[];
  context: string;
  metadata: {
    totalMatches: number;
    threshold: number;
    category: string | null;
  };
}

export interface UseRagSearchOptions {
  matchThreshold?: number;
  matchCount?: number;
  filterCategory?: string;
  onSuccess?: (result: RagSearchResult) => void;
  onError?: (error: Error) => void;
}

export function useRagSearch(options: UseRagSearchOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RagSearchResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const search = async (query: string) => {
    if (!query.trim()) {
      toast.error('Search query cannot be empty');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('rag-search', {
        body: {
          query: query.trim(),
          matchThreshold: options.matchThreshold || 0.7,
          matchCount: options.matchCount || 5,
          filterCategory: options.filterCategory || null,
        },
      });

      if (funcError) throw funcError;

      if (!data?.success) {
        throw new Error(data?.error || 'RAG search failed');
      }

      const searchResult: RagSearchResult = {
        query: data.query,
        chunks: data.chunks,
        context: data.context,
        metadata: data.metadata,
      };

      setResult(searchResult);
      options.onSuccess?.(searchResult);

      return searchResult;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      console.error('RAG search error:', error);
      setError(error);
      options.onError?.(error);
      toast.error(`Search failed: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return {
    search,
    reset,
    loading,
    result,
    error,
    hasResult: result !== null,
  };
}
