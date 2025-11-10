-- Create helper functions for KnowledgeDocs admin page

-- Function to get knowledge documents
CREATE OR REPLACE FUNCTION get_knowledge_docs()
RETURNS TABLE (
  id uuid,
  source_table text,
  source_id text,
  title text,
  embedding vector(768),
  metadata jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ai, public
AS $$
  SELECT id, source_table, source_id, title, embedding, metadata, created_at, updated_at
  FROM ai.documents
  WHERE source_table = 'knowledge_docs'
  ORDER BY updated_at DESC;
$$;

-- Function to get embedding statistics
CREATE OR REPLACE FUNCTION get_embedding_stats()
RETURNS TABLE (
  source_table text,
  total bigint,
  embedded bigint,
  percentage numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ai, public
AS $$
  SELECT 
    source_table,
    COUNT(*) as total,
    COUNT(embedding) as embedded,
    CASE 
      WHEN COUNT(*) > 0 
      THEN ROUND((COUNT(embedding)::numeric / COUNT(*)::numeric) * 100, 1)
      ELSE 0
    END as percentage
  FROM ai.documents
  GROUP BY source_table
  ORDER BY source_table;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_knowledge_docs() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_embedding_stats() TO authenticated, anon;