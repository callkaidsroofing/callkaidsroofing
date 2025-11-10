import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LoadProgress {
  status: 'idle' | 'loading' | 'processing' | 'complete' | 'error';
  currentDoc: string | null;
  processedDocs: number;
  totalDocs: number;
  chunksCreated: number;
  errors: Array<{ docId: string; error: string }>;
}

export function useKnowledgeBaseLoader() {
  const [progress, setProgress] = useState<LoadProgress>({
    status: 'idle',
    currentDoc: null,
    processedDocs: 0,
    totalDocs: 0,
    chunksCreated: 0,
    errors: [],
  });

  const loadFromMKF = async () => {
    setProgress({
      status: 'loading',
      currentDoc: 'Fetching MASTER_INDEX.json...',
      processedDocs: 0,
      totalDocs: 0,
      chunksCreated: 0,
      errors: [],
    });

    try {
      // Fetch MASTER_INDEX.json
      const indexResponse = await fetch('/knowledge-base/mkf/source/MASTER_INDEX.json');
      if (!indexResponse.ok) {
        throw new Error('Failed to load MASTER_INDEX.json');
      }
      const index = await indexResponse.json();

      setProgress(prev => ({
        ...prev,
        totalDocs: index.docs.length,
        status: 'processing',
      }));

      // Load all documents
      const documents = [];
      for (const doc of index.docs) {
        setProgress(prev => ({
          ...prev,
          currentDoc: `Loading ${doc.id}...`,
        }));

        try {
          const docResponse = await fetch(`/knowledge-base/mkf/source/${doc.path}`);
          if (!docResponse.ok) {
            throw new Error(`Failed to load ${doc.path}`);
          }
          const content = await docResponse.text();

          documents.push({
            docId: doc.id,
            title: doc.title,
            category: getCategoryFromType(doc.type),
            content,
            metadata: {
              path: doc.path,
              type: doc.type,
              version: index.version,
              updated: index.updated,
            },
          });
        } catch (error: any) {
          setProgress(prev => ({
            ...prev,
            errors: [...prev.errors, { docId: doc.id, error: error.message }],
          }));
        }
      }

      // Embed documents
      setProgress(prev => ({
        ...prev,
        currentDoc: 'Embedding documents...',
      }));

      const { data, error } = await supabase.functions.invoke('embed-knowledge-base', {
        body: {
          documents,
          batchSize: 5,
        },
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Embedding failed');
      }

      setProgress({
        status: 'complete',
        currentDoc: null,
        processedDocs: data.results.successful,
        totalDocs: documents.length,
        chunksCreated: data.results.totalChunks,
        errors: data.results.errors || [],
      });

      return data.results;
    } catch (error: any) {
      setProgress(prev => ({
        ...prev,
        status: 'error',
        currentDoc: null,
        errors: [...prev.errors, { docId: 'SYSTEM', error: error.message }],
      }));
      throw error;
    }
  };

  const reset = () => {
    setProgress({
      status: 'idle',
      currentDoc: null,
      processedDocs: 0,
      totalDocs: 0,
      chunksCreated: 0,
      errors: [],
    });
  };

  return {
    progress,
    loadFromMKF,
    reset,
  };
}

function getCategoryFromType(docType: string): string {
  const categoryMap: Record<string, string> = {
    policy: 'system',
    style: 'brand',
    dev: 'web_design',
    seo: 'marketing',
    content: 'marketing',
    ops: 'operations',
    gwa: 'workflows',
    data: 'case_studies',
  };
  return categoryMap[docType] || 'general';
}
