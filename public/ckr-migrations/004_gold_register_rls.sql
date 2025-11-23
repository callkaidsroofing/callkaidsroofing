-- ============================================================================
-- Migration: 004_gold_register_rls.sql
-- CKR-GEM Security Layer - RLS Policies for Gold and Graph Tables
-- ============================================================================
-- Purpose: Enable Row Level Security on Gold Register and Graph tables
-- Execution Order: Step 4 of 6
-- Security: Safety First - RLS ON for all knowledge tables
-- ============================================================================

BEGIN;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.gold_knowledge_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.graph_edges ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- GOLD KNOWLEDGE REGISTER POLICIES
-- ============================================================================

-- Policy: Admins can manage all knowledge assets
CREATE POLICY gold_register_admin_all
  ON public.gold_knowledge_register
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Policy: Inspectors can view active knowledge assets
CREATE POLICY gold_register_inspector_view_active
  ON public.gold_knowledge_register
  FOR SELECT
  USING (
    is_inspector(auth.uid()) 
    AND status = 'active'
  );

-- Policy: Inspectors can view archived knowledge (read-only audit trail)
CREATE POLICY gold_register_inspector_view_archived
  ON public.gold_knowledge_register
  FOR SELECT
  USING (
    is_inspector(auth.uid()) 
    AND status = 'archived'
  );

-- Policy: Authenticated users can view active canonical knowledge (C-01 to C-05)
CREATE POLICY gold_register_authenticated_view_canonical
  ON public.gold_knowledge_register
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND status = 'active'
    AND doc_id LIKE 'C-%'
  );

-- ============================================================================
-- GRAPH NODES POLICIES
-- ============================================================================

-- Policy: Admins can manage all graph nodes
CREATE POLICY graph_nodes_admin_all
  ON public.graph_nodes
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Policy: Inspectors can view all graph nodes
CREATE POLICY graph_nodes_inspector_view
  ON public.graph_nodes
  FOR SELECT
  USING (is_inspector(auth.uid()));

-- Policy: Authenticated users can view graph nodes
CREATE POLICY graph_nodes_authenticated_view
  ON public.graph_nodes
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- GRAPH EDGES POLICIES
-- ============================================================================

-- Policy: Admins can manage all graph edges
CREATE POLICY graph_edges_admin_all
  ON public.graph_edges
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Policy: Inspectors can view all graph edges
CREATE POLICY graph_edges_inspector_view
  ON public.graph_edges
  FOR SELECT
  USING (is_inspector(auth.uid()));

-- Policy: Authenticated users can view graph edges
CREATE POLICY graph_edges_authenticated_view
  ON public.graph_edges
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- ============================================================================
-- Add security comments
-- ============================================================================
COMMENT ON POLICY gold_register_admin_all ON public.gold_knowledge_register IS 
  'Admin-only: Full CRUD access to all knowledge assets (active and archived).';

COMMENT ON POLICY gold_register_inspector_view_active ON public.gold_knowledge_register IS 
  'Inspector: Read-only access to active canonical knowledge assets for RAG/automation.';

COMMENT ON POLICY gold_register_authenticated_view_canonical ON public.gold_knowledge_register IS 
  'Authenticated users: Read-only access to active canonical files (C-01 to C-05) only.';

COMMIT;