-- Fix: Remove public access from ckr_jobs and restrict to authenticated users only
-- This table contains sensitive business data (job assignments, service details)

-- Drop any existing public access policies on ckr_jobs
DROP POLICY IF EXISTS "Public Access" ON public.ckr_jobs;
DROP POLICY IF EXISTS "public_read" ON public.ckr_jobs;
DROP POLICY IF EXISTS "Anyone can read" ON public.ckr_jobs;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.ckr_jobs;

-- Ensure RLS is enabled
ALTER TABLE public.ckr_jobs ENABLE ROW LEVEL SECURITY;

-- Create secure policies for authenticated users only
CREATE POLICY "Authenticated users can view jobs"
ON public.ckr_jobs
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert jobs"
ON public.ckr_jobs
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update jobs"
ON public.ckr_jobs
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete jobs"
ON public.ckr_jobs
FOR DELETE
USING (auth.uid() IS NOT NULL);