-- ============================================================================
-- Migration: 001_create_gold_register.sql
-- CKR-GEM Gold Layer - Knowledge Register Schema
-- ============================================================================
-- Purpose: Create the unified Gold Knowledge Register table for all knowledge assets
-- Execution Order: Step 1 of 6
-- Safety: Additive only, no data deletion
-- ============================================================================

BEGIN;

-- Create gold_knowledge_register table (Gold Layer - Single Source of Truth)
CREATE TABLE IF NOT EXISTS public.gold_knowledge_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core identification
  doc_id TEXT NOT NULL UNIQUE,  -- B-001 to B-057 (archived), C-01 to C-05 (active)
  doc_type TEXT NOT NULL,        -- e.g., GOVERNANCE/BRAND, SOP/INSPECTION, RAW/BRONZE
  title TEXT NOT NULL,
  
  -- Ownership and classification
  owner TEXT NOT NULL,           -- Operations, Marketing, Legal, System/Archived
  summary TEXT,                  -- Brief description
  related_entities JSONB DEFAULT '[]'::jsonb,  -- Array of concept/entity tags
  
  -- File storage
  file_path TEXT NOT NULL,       -- Path in Supabase storage (bronze/ or silver/ folders)
  version TEXT NOT NULL DEFAULT '1.0.0',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deprecated')),
  
  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(doc_id, '')), 'C')
  ) STORED
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_gold_register_doc_id ON public.gold_knowledge_register(doc_id);
CREATE INDEX IF NOT EXISTS idx_gold_register_doc_type ON public.gold_knowledge_register(doc_type);
CREATE INDEX IF NOT EXISTS idx_gold_register_status ON public.gold_knowledge_register(status);
CREATE INDEX IF NOT EXISTS idx_gold_register_search ON public.gold_knowledge_register USING gin(search_vector);
CREATE INDEX IF NOT EXISTS idx_gold_register_related_entities ON public.gold_knowledge_register USING gin(related_entities);
CREATE INDEX IF NOT EXISTS idx_gold_register_created_at ON public.gold_knowledge_register(created_at DESC);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_gold_register_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_gold_register_updated_at
  BEFORE UPDATE ON public.gold_knowledge_register
  FOR EACH ROW
  EXECUTE FUNCTION update_gold_register_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.gold_knowledge_register IS 
  'CKR-GEM Gold Layer: Unified knowledge register tracking all 62 knowledge assets (5 active canonical + 57 archived bronze). Single source of truth for RAG and automation.';

COMMIT;