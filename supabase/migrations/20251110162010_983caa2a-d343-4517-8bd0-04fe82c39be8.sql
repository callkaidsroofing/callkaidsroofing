-- Knowledge Unification: Create master_knowledge table
CREATE TABLE IF NOT EXISTS public.master_knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  doc_type TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding VECTOR(768),
  chunk_count INTEGER DEFAULT 1,
  version INTEGER NOT NULL DEFAULT 1,
  supersedes TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 50,
  active BOOLEAN DEFAULT true,
  source TEXT NOT NULL,
  migration_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_synced_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_master_knowledge_doc_id ON public.master_knowledge(doc_id);
CREATE INDEX IF NOT EXISTS idx_master_knowledge_category ON public.master_knowledge(category);
CREATE INDEX IF NOT EXISTS idx_master_knowledge_active ON public.master_knowledge(active);
CREATE INDEX IF NOT EXISTS idx_master_knowledge_embedding ON public.master_knowledge USING ivfflat(embedding vector_cosine_ops) WITH (lists = 100);

ALTER TABLE public.master_knowledge ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active knowledge" ON public.master_knowledge FOR SELECT USING (active = true);
CREATE POLICY "Admins can manage master knowledge" ON public.master_knowledge FOR ALL USING (is_admin_user(auth.uid())) WITH CHECK (is_admin_user(auth.uid()));

-- Migrate all knowledge_chunks data
INSERT INTO public.master_knowledge (doc_id, title, category, subcategory, doc_type, content, embedding, chunk_count, version, metadata, priority, active, source, migration_notes, created_at, updated_at, last_synced_at)
SELECT 
  doc_id, title, category,
  CASE WHEN category = 'workflows' THEN SPLIT_PART(doc_id, '_', 1) ELSE NULL END,
  CASE WHEN doc_id LIKE 'MKF_%' THEN 'mkf' WHEN doc_id LIKE 'GWA_%' THEN 'gwa' ELSE 'system' END,
  STRING_AGG(content, E'\n\n' ORDER BY chunk_index),
  AVG(embedding),
  COUNT(*),
  MAX(version),
  '{}'::jsonb,
  CASE WHEN category = 'system' THEN 100 WHEN category = 'brand' THEN 90 WHEN category = 'operations' THEN 80 WHEN category = 'workflows' THEN 70 ELSE 50 END,
  active, 'knowledge_chunks', 'Migrated from knowledge_chunks',
  MIN(created_at), MAX(updated_at), MAX(updated_at)
FROM public.knowledge_chunks WHERE active = true GROUP BY doc_id, title, category, active
ON CONFLICT (doc_id) DO NOTHING;

-- Add warranty doc from legacy
INSERT INTO public.master_knowledge (doc_id, title, category, doc_type, content, version, metadata, priority, active, source, migration_notes, created_at, updated_at, last_synced_at)
SELECT file_key, title, category, 'legacy_kf', content, version, metadata, 40, active, 'legacy_kf', 'Legacy warranty info', created_at, updated_at, last_synced_at
FROM public.knowledge_files WHERE active = true AND file_key = 'KF_03_WARRANTY_INFO'
ON CONFLICT (doc_id) DO NOTHING;

-- Mark superseded docs
UPDATE public.master_knowledge SET supersedes = ARRAY['KF_01_BRAND_IDENTITY'] WHERE doc_id = 'MKF_01';
UPDATE public.master_knowledge SET supersedes = ARRAY['KF_02_SERVICE_PRICING'] WHERE doc_id = 'MKF_05';
UPDATE public.master_knowledge SET supersedes = ARRAY['KF_04_SERVICE_AREAS'] WHERE doc_id = 'MKF_08';

-- Create search function
CREATE OR REPLACE FUNCTION search_master_knowledge(query_embedding VECTOR(768), match_threshold FLOAT DEFAULT 0.7, match_count INT DEFAULT 5, filter_category TEXT DEFAULT NULL)
RETURNS TABLE (doc_id TEXT, title TEXT, category TEXT, content TEXT, similarity FLOAT, metadata JSONB)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY SELECT mk.doc_id, mk.title, mk.category, mk.content, 1 - (mk.embedding <=> query_embedding) as similarity, mk.metadata
  FROM public.master_knowledge mk WHERE mk.active = true AND (filter_category IS NULL OR mk.category = filter_category) AND 1 - (mk.embedding <=> query_embedding) > match_threshold
  ORDER BY mk.embedding <=> query_embedding LIMIT match_count;
END; $$;

GRANT SELECT ON public.master_knowledge TO anon, authenticated;
GRANT ALL ON public.master_knowledge TO service_role;
GRANT EXECUTE ON FUNCTION search_master_knowledge TO anon, authenticated, service_role;