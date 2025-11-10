
-- Clean up duplicate chunks (keep most recent)
WITH ranked_chunks AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY doc_id, chunk_index ORDER BY created_at DESC) as rn
  FROM knowledge_chunks
  WHERE active = true
)
DELETE FROM knowledge_chunks
WHERE id IN (
  SELECT id FROM ranked_chunks WHERE rn > 1
);

-- Add unique constraint to prevent future duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_knowledge_chunks_unique 
ON knowledge_chunks(doc_id, chunk_index) 
WHERE active = true;
