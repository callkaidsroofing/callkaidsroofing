-- Fix Jobs Table RLS Policy - Remove overly permissive policy and add role-based restrictions
-- Drop the existing permissive policy that allows ALL operations
DROP POLICY IF EXISTS "Authenticated users can manage jobs" ON public.jobs;

-- Create role-based policies for jobs table (using IF NOT EXISTS pattern)
DO $$ 
BEGIN
  -- Inspectors can view jobs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Inspectors can view jobs'
  ) THEN
    CREATE POLICY "Inspectors can view jobs" 
    ON public.jobs 
    FOR SELECT 
    TO authenticated
    USING (is_inspector(auth.uid()));
  END IF;

  -- Inspectors can create jobs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Inspectors can create jobs'
  ) THEN
    CREATE POLICY "Inspectors can create jobs" 
    ON public.jobs 
    FOR INSERT 
    TO authenticated
    WITH CHECK (is_inspector(auth.uid()));
  END IF;

  -- Inspectors can update jobs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Inspectors can update jobs'
  ) THEN
    CREATE POLICY "Inspectors can update jobs" 
    ON public.jobs 
    FOR UPDATE 
    TO authenticated
    USING (is_inspector(auth.uid()))
    WITH CHECK (is_inspector(auth.uid()));
  END IF;

  -- Only admins can delete jobs
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'jobs' 
    AND policyname = 'Only admins can delete jobs'
  ) THEN
    CREATE POLICY "Only admins can delete jobs" 
    ON public.jobs 
    FOR DELETE 
    TO authenticated
    USING (is_admin_user(auth.uid()));
  END IF;
END $$;