-- ============================================================================
-- Migration: 005_operational_rls.sql
-- CKR-GEM Security Layer - RLS Policies for Operational Tables
-- ============================================================================
-- Purpose: Enable Row Level Security on new operational tables
-- Execution Order: Step 5 of 6
-- Security: Safety First - RLS ON for expenses, tasks, case_studies, photos
-- ============================================================================

BEGIN;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- EXPENSES TABLE POLICIES
-- ============================================================================

-- Policy: Admins can manage all expenses
CREATE POLICY expenses_admin_all
  ON public.expenses
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Policy: Inspectors can view and create expenses
CREATE POLICY expenses_inspector_view_create
  ON public.expenses
  FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE POLICY expenses_inspector_insert
  ON public.expenses
  FOR INSERT
  WITH CHECK (is_inspector(auth.uid()));

-- ============================================================================
-- TASKS TABLE POLICIES
-- ============================================================================

-- Policy: Admins can manage all tasks
CREATE POLICY tasks_admin_all
  ON public.tasks
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Policy: Inspectors can view all tasks
CREATE POLICY tasks_inspector_view
  ON public.tasks
  FOR SELECT
  USING (is_inspector(auth.uid()));

-- Policy: Inspectors can create and update tasks
CREATE POLICY tasks_inspector_insert
  ON public.tasks
  FOR INSERT
  WITH CHECK (is_inspector(auth.uid()));

CREATE POLICY tasks_inspector_update
  ON public.tasks
  FOR UPDATE
  USING (is_inspector(auth.uid()))
  WITH CHECK (is_inspector(auth.uid()));

-- ============================================================================
-- CASE STUDIES TABLE POLICIES
-- ============================================================================

-- Policy: Admins can manage all case studies
CREATE POLICY case_studies_admin_all
  ON public.case_studies
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Policy: Inspectors can view and create case studies
CREATE POLICY case_studies_inspector_view
  ON public.case_studies
  FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE POLICY case_studies_inspector_insert
  ON public.case_studies
  FOR INSERT
  WITH CHECK (is_inspector(auth.uid()));

-- Policy: Public can view published case studies
CREATE POLICY case_studies_public_view_published
  ON public.case_studies
  FOR SELECT
  USING (published = true);

-- ============================================================================
-- PHOTOS TABLE POLICIES
-- ============================================================================

-- Policy: Admins can manage all photos
CREATE POLICY photos_admin_all
  ON public.photos
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Policy: Inspectors can view and upload photos
CREATE POLICY photos_inspector_view
  ON public.photos
  FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE POLICY photos_inspector_insert
  ON public.photos
  FOR INSERT
  WITH CHECK (is_inspector(auth.uid()));

-- Policy: Public can view photos linked to published case studies
CREATE POLICY photos_public_view_published
  ON public.photos
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.case_studies
      WHERE case_studies.id = photos.case_study_id
      AND case_studies.published = true
    )
  );

-- ============================================================================
-- Add security comments
-- ============================================================================
COMMENT ON POLICY expenses_admin_all ON public.expenses IS 
  'Admin-only: Full CRUD access to all job expenses.';

COMMENT ON POLICY tasks_inspector_view ON public.tasks IS 
  'Inspector: View all job tasks for operational management.';

COMMENT ON POLICY case_studies_public_view_published ON public.case_studies IS 
  'Public: View published case studies for portfolio display (Proof In Every Roof).';

COMMENT ON POLICY photos_public_view_published ON public.photos IS 
  'Public: View photos associated with published case studies only.';

COMMIT;