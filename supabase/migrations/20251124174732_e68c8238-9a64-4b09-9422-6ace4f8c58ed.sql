-- Create header/topic-based knowledge sections table
CREATE TABLE IF NOT EXISTS public.ckr_knowledge_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id TEXT NOT NULL,
  doc_title TEXT NOT NULL,
  domain TEXT NOT NULL,
  section_level INT NOT NULL CHECK (section_level BETWEEN 1 AND 6),
  section_path TEXT NOT NULL,
  heading TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(1536),
  metadata JSONB DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  related_sections TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE,
  UNIQUE(doc_id, section_path)
);

-- Create document registry table
CREATE TABLE IF NOT EXISTS public.ckr_document_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  file_path TEXT NOT NULL,
  version TEXT NOT NULL,
  supersedes TEXT[] DEFAULT '{}',
  section_count INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sections_doc_id ON ckr_knowledge_sections(doc_id);
CREATE INDEX IF NOT EXISTS idx_sections_domain ON ckr_knowledge_sections(domain);
CREATE INDEX IF NOT EXISTS idx_sections_active ON ckr_knowledge_sections(active) WHERE active = TRUE;
CREATE INDEX IF NOT EXISTS idx_sections_embedding ON ckr_knowledge_sections 
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS idx_registry_doc_id ON ckr_document_registry(doc_id);

-- Enable RLS
ALTER TABLE ckr_knowledge_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE ckr_document_registry ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read, admin write
CREATE POLICY "Public can view active sections"
  ON ckr_knowledge_sections FOR SELECT
  USING (active = TRUE);

CREATE POLICY "Admins can manage sections"
  ON ckr_knowledge_sections FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Public can view active documents"
  ON ckr_document_registry FOR SELECT
  USING (active = TRUE);

CREATE POLICY "Admins can manage documents"
  ON ckr_document_registry FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Create RPC function for semantic section search
CREATE OR REPLACE FUNCTION search_ckr_sections(
  query_embedding VECTOR,
  match_threshold FLOAT DEFAULT 0.75,
  match_count INT DEFAULT 5,
  filter_domain TEXT DEFAULT NULL
)
RETURNS TABLE (
  doc_id TEXT,
  doc_title TEXT,
  heading TEXT,
  section_path TEXT,
  content TEXT,
  keywords TEXT[],
  related_sections TEXT[],
  similarity FLOAT
) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.doc_id,
    s.doc_title,
    s.heading,
    s.section_path,
    s.content,
    s.keywords,
    s.related_sections,
    1 - (s.embedding <=> query_embedding) AS similarity
  FROM ckr_knowledge_sections s
  WHERE s.active = TRUE
    AND (filter_domain IS NULL OR s.domain = filter_domain)
    AND 1 - (s.embedding <=> query_embedding) > match_threshold
  ORDER BY s.embedding <=> query_embedding
  LIMIT match_count;
END;
$$ LANGUAGE plpgsql;

-- Add trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_sections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sections_updated_at
  BEFORE UPDATE ON ckr_knowledge_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_sections_updated_at();