-- Create ai schema and documents table for unified RAG system
CREATE SCHEMA IF NOT EXISTS ai;

-- Documents table for unified knowledge storage
CREATE TABLE IF NOT EXISTS ai.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_table text NOT NULL,
  source_id text NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  embedding vector(768),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(source_table, source_id)
);

-- Index for vector similarity search
CREATE INDEX IF NOT EXISTS idx_ai_documents_embedding 
ON ai.documents USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Index for source lookups
CREATE INDEX IF NOT EXISTS idx_ai_documents_source 
ON ai.documents(source_table, source_id);

-- Index for metadata filtering
CREATE INDEX IF NOT EXISTS idx_ai_documents_metadata 
ON ai.documents USING gin(metadata);

-- Enable RLS
ALTER TABLE ai.documents ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read ai.documents"
ON ai.documents FOR SELECT
USING (true);

-- Admins have full access
CREATE POLICY "Admins manage ai.documents"
ON ai.documents FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid()
    AND auth.users.raw_user_meta_data->>'role' = 'admin'
  )
);

-- Service role has full access (for edge functions)
CREATE POLICY "Service role manages ai.documents"
ON ai.documents FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION ai.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_documents_updated_at
BEFORE UPDATE ON ai.documents
FOR EACH ROW
EXECUTE FUNCTION ai.update_updated_at_column();