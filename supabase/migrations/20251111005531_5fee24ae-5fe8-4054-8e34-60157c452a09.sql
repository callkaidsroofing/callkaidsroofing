-- Create public wrappers matching expected signatures
CREATE OR REPLACE FUNCTION public.ai_upsert_document(
  p_content TEXT,
  p_metadata JSONB,
  p_source_id TEXT,
  p_source_table TEXT,
  p_title TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, ai
AS $$
BEGIN
  RETURN ai.upsert_document(p_source_table, p_source_id, p_title, p_content, NULL, p_metadata);
END;
$$;

CREATE OR REPLACE FUNCTION public.ai_upsert_document(
  p_content TEXT,
  p_metadata JSONB,
  p_source_id TEXT,
  p_source_table TEXT,
  p_title TEXT,
  p_embedding vector(1536)
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, ai
AS $$
BEGIN
  RETURN ai.upsert_document(p_source_table, p_source_id, p_title, p_content, p_embedding, p_metadata);
END;
$$;

GRANT EXECUTE ON FUNCTION public.ai_upsert_document(text, jsonb, text, text, text) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.ai_upsert_document(text, jsonb, text, text, text, vector) TO anon, authenticated, service_role;