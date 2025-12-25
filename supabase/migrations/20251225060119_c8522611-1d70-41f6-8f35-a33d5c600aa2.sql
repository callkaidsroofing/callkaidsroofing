-- Add RLS policies to tables that have RLS enabled but no policies
-- These tables are currently in default-deny state; adding policies for authenticated users

-- ============================================
-- case_studies table
-- Contains public case study content (before/after photos, outcomes)
-- ============================================

-- Allow authenticated users full access
CREATE POLICY "Authenticated users can view case studies"
ON public.case_studies
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert case studies"
ON public.case_studies
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update case studies"
ON public.case_studies
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete case studies"
ON public.case_studies
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- Allow public read access for published case studies
CREATE POLICY "Public can view published case studies"
ON public.case_studies
FOR SELECT
USING (is_published = true);

-- ============================================
-- ckr_knowledge table
-- Contains vectorized knowledge chunks for RAG
-- ============================================

CREATE POLICY "Authenticated users can view knowledge"
ON public.ckr_knowledge
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert knowledge"
ON public.ckr_knowledge
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update knowledge"
ON public.ckr_knowledge
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete knowledge"
ON public.ckr_knowledge
FOR DELETE
USING (auth.uid() IS NOT NULL);

-- ============================================
-- expenses table
-- Contains job-related expense records
-- ============================================

CREATE POLICY "Authenticated users can view expenses"
ON public.expenses
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert expenses"
ON public.expenses
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update expenses"
ON public.expenses
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete expenses"
ON public.expenses
FOR DELETE
USING (auth.uid() IS NOT NULL);