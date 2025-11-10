-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;

-- Create knowledge_chunks table for RAG system
CREATE TABLE public.knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  section TEXT,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(768), -- Google text-embedding-004 produces 768-dimensional vectors
  metadata JSONB DEFAULT '{}'::jsonb,
  version INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create indexes for efficient RAG queries
CREATE INDEX idx_knowledge_chunks_embedding ON public.knowledge_chunks 
  USING ivfflat (embedding vector_cosine_ops) 
  WITH (lists = 100);

CREATE INDEX idx_knowledge_chunks_doc_id ON public.knowledge_chunks(doc_id);
CREATE INDEX idx_knowledge_chunks_category ON public.knowledge_chunks(category);
CREATE INDEX idx_knowledge_chunks_active ON public.knowledge_chunks(active) WHERE active = true;

-- Create composite index for common query patterns
CREATE INDEX idx_knowledge_chunks_active_category ON public.knowledge_chunks(active, category) WHERE active = true;

-- Enable Row Level Security
ALTER TABLE public.knowledge_chunks ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Authenticated users can read active chunks
CREATE POLICY "Authenticated users can view active knowledge chunks"
  ON public.knowledge_chunks
  FOR SELECT
  USING (active = true AND auth.role() = 'authenticated');

-- RLS Policy: Public (unauthenticated) users can read active chunks for customer support
CREATE POLICY "Public can view active knowledge chunks"
  ON public.knowledge_chunks
  FOR SELECT
  USING (active = true);

-- RLS Policy: Admins can manage all chunks
CREATE POLICY "Admins can manage knowledge chunks"
  ON public.knowledge_chunks
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Create function to search knowledge chunks by semantic similarity
CREATE OR REPLACE FUNCTION public.search_knowledge_chunks(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5,
  filter_category text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  doc_id text,
  title text,
  category text,
  section text,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kc.id,
    kc.doc_id,
    kc.title,
    kc.category,
    kc.section,
    kc.content,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM public.knowledge_chunks kc
  WHERE kc.active = true
    AND (filter_category IS NULL OR kc.category = filter_category)
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_knowledge_chunks_updated_at
  BEFORE UPDATE ON public.knowledge_chunks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create embedding_jobs table to track batch embedding progress
CREATE TABLE public.embedding_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type TEXT NOT NULL, -- 'initial_load', 'incremental_update', 'reindex'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  source_path TEXT,
  total_chunks INTEGER DEFAULT 0,
  processed_chunks INTEGER DEFAULT 0,
  failed_chunks INTEGER DEFAULT 0,
  error_log JSONB DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on embedding_jobs
ALTER TABLE public.embedding_jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admins can manage embedding jobs
CREATE POLICY "Admins can manage embedding jobs"
  ON public.embedding_jobs
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- RLS Policy: Inspectors can view embedding jobs
CREATE POLICY "Inspectors can view embedding jobs"
  ON public.embedding_jobs
  FOR SELECT
  USING (is_inspector(auth.uid()));

-- Create trigger for embedding_jobs updated_at
CREATE TRIGGER update_embedding_jobs_updated_at
  BEFORE UPDATE ON public.embedding_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.knowledge_chunks IS 'Stores chunked knowledge base content with vector embeddings for RAG retrieval';
COMMENT ON TABLE public.embedding_jobs IS 'Tracks batch embedding generation jobs for knowledge base processing';
COMMENT ON FUNCTION public.search_knowledge_chunks IS 'Performs semantic similarity search on knowledge chunks using cosine distance';