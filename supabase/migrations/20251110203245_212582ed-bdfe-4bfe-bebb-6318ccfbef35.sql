-- Create upsert function for ai.documents
CREATE OR REPLACE FUNCTION ai.upsert_document(
  p_source_table text,
  p_source_id text,
  p_title text,
  p_content text,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, ai
AS $$
DECLARE
  v_doc_id uuid;
BEGIN
  -- Upsert document
  INSERT INTO ai.documents (source_table, source_id, title, content, metadata)
  VALUES (p_source_table, p_source_id, p_title, p_content, p_metadata)
  ON CONFLICT (source_table, source_id)
  DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    metadata = EXCLUDED.metadata,
    updated_at = now()
  RETURNING id INTO v_doc_id;
  
  RETURN v_doc_id;
END;
$$;

-- Grant execute to authenticated and service role
GRANT EXECUTE ON FUNCTION ai.upsert_document TO authenticated, service_role;