import { supabase } from '@/integrations/supabase/client';

export interface KnowledgeDocument {
  docId: string;
  title: string;
  category: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface LoadResult {
  successful: number;
  failed: number;
  totalChunks: number;
  errors: Array<{
    docId: string;
    error: string;
  }>;
}

/**
 * Load and embed knowledge base documents from MKF source files
 * 
 * This would typically be run as a batch process to initially populate
 * the knowledge_chunks table with embeddings from the Master Knowledge Framework.
 * 
 * NOTE: In production, this should be a server-side script that reads files
 * from the filesystem. This client-side version is for demonstration/admin UI.
 */
export async function loadKnowledgeBase(documents: KnowledgeDocument[]): Promise<LoadResult> {
  if (!documents || documents.length === 0) {
    throw new Error('No documents provided');
  }

  console.log(`Loading ${documents.length} documents into knowledge base...`);

  const { data, error } = await supabase.functions.invoke('embed-knowledge-base', {
    body: {
      documents,
      batchSize: 5, // Process 5 at a time to avoid rate limits
    },
  });

  if (error) {
    console.error('Knowledge base load error:', error);
    throw new Error(`Failed to load knowledge base: ${error.message}`);
  }

  if (!data?.success) {
    throw new Error(data?.error || 'Knowledge base load failed');
  }

  console.log('Knowledge base load complete:', data.results);

  return data.results;
}

/**
 * Parse MKF index file to get document manifest
 */
export interface MkfDocument {
  id: string;
  title: string;
  path: string;
  type: string;
}

export interface MkfIndex {
  version: string;
  updated: string;
  docs: MkfDocument[];
  embedding: {
    chunk_size_chars: number;
    chunk_overlap_chars: number;
    metadata_fields: string[];
    stop_sections: string[];
  };
}

/**
 * Category mapping from MKF doc type to knowledge base category
 */
export function getMkfCategory(docType: string): string {
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

/**
 * Prepare documents from file content for embedding
 */
export function prepareDocumentsFromFiles(
  files: Array<{ path: string; content: string }>,
  mkfIndex: MkfIndex
): KnowledgeDocument[] {
  const documents: KnowledgeDocument[] = [];

  for (const file of files) {
    // Find matching doc in index
    const docMeta = mkfIndex.docs.find((d) => file.path.includes(d.id));

    if (!docMeta) {
      console.warn(`No metadata found for file: ${file.path}`);
      continue;
    }

    documents.push({
      docId: docMeta.id,
      title: docMeta.title,
      category: getMkfCategory(docMeta.type),
      content: file.content,
      metadata: {
        path: file.path,
        type: docMeta.type,
        version: mkfIndex.version,
        updated: mkfIndex.updated,
      },
    });
  }

  return documents;
}

/**
 * Check knowledge base statistics
 */
export async function getKnowledgeBaseStats() {
  const { data: chunks, error: chunksError } = await supabase
    .from('knowledge_chunks')
    .select('category, active')
    .eq('active', true);

  if (chunksError) {
    console.error('Failed to fetch chunks:', chunksError);
    throw chunksError;
  }

  const stats = {
    totalChunks: chunks?.length || 0,
    byCategory: {} as Record<string, number>,
    hasEmbeddings: chunks?.length > 0,
  };

  // Count by category
  chunks?.forEach((chunk) => {
    stats.byCategory[chunk.category] = (stats.byCategory[chunk.category] || 0) + 1;
  });

  return stats;
}
