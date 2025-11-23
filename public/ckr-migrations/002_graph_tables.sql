-- ============================================================================
-- Migration: 002_graph_tables.sql
-- CKR-GEM Semantic Layer - Knowledge Graph Schema
-- ============================================================================
-- Purpose: Create semantic graph tables for entity relationships and concepts
-- Execution Order: Step 2 of 6
-- Safety: Additive only, depends on gold_knowledge_register
-- ============================================================================

BEGIN;

-- Create graph_nodes table (Semantic Layer - Concepts and Entities)
CREATE TABLE IF NOT EXISTS public.graph_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Node identity
  node_id TEXT NOT NULL UNIQUE,     -- e.g., Brand_Invariants, Workflow:Inspection, Material:Tile
  node_type TEXT NOT NULL,          -- concept, entity, workflow, schema_object, material
  label TEXT NOT NULL,              -- Human-readable name
  
  -- Node properties
  description TEXT,
  properties JSONB DEFAULT '{}'::jsonb,  -- Flexible metadata
  
  -- Linking to Gold Register
  source_docs TEXT[] DEFAULT ARRAY[]::TEXT[],  -- Array of doc_ids from gold_knowledge_register
  
  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create graph_edges table (Semantic Layer - Relationships between nodes)
CREATE TABLE IF NOT EXISTS public.graph_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Edge definition
  edge_id TEXT NOT NULL UNIQUE,     -- e.g., E-001, E-002
  source_node_id TEXT NOT NULL REFERENCES public.graph_nodes(node_id) ON DELETE CASCADE,
  target_node_id TEXT NOT NULL REFERENCES public.graph_nodes(node_id) ON DELETE CASCADE,
  
  -- Relationship type
  relationship_type TEXT NOT NULL,  -- defines, requires, implements, relates_to, precedes
  weight NUMERIC DEFAULT 1.0,       -- Strength of relationship (0.0 to 1.0)
  
  -- Edge properties
  properties JSONB DEFAULT '{}'::jsonb,
  
  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Prevent duplicate edges
  UNIQUE(source_node_id, target_node_id, relationship_type)
);

-- Create indexes for graph traversal performance
CREATE INDEX IF NOT EXISTS idx_graph_nodes_node_id ON public.graph_nodes(node_id);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_node_type ON public.graph_nodes(node_type);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_source_docs ON public.graph_nodes USING gin(source_docs);

CREATE INDEX IF NOT EXISTS idx_graph_edges_edge_id ON public.graph_edges(edge_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON public.graph_edges(source_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON public.graph_edges(target_node_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_relationship ON public.graph_edges(relationship_type);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_graph_nodes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_graph_nodes_updated_at
  BEFORE UPDATE ON public.graph_nodes
  FOR EACH ROW
  EXECUTE FUNCTION update_graph_nodes_updated_at();

CREATE OR REPLACE FUNCTION update_graph_edges_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_graph_edges_updated_at
  BEFORE UPDATE ON public.graph_edges
  FOR EACH ROW
  EXECUTE FUNCTION update_graph_edges_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.graph_nodes IS 
  'CKR-GEM Semantic Layer: Knowledge graph nodes representing concepts, entities, workflows, and schema objects.';

COMMENT ON TABLE public.graph_edges IS 
  'CKR-GEM Semantic Layer: Knowledge graph edges representing relationships between nodes (defines, requires, implements, etc.).';

COMMIT;