-- Fix security_logs table to ensure only admins can view sensitive security data
-- Remove any public access and enforce strict admin-only access

-- Ensure RLS is enabled on security_logs table
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might allow public access
DROP POLICY IF EXISTS "Public can read security logs" ON public.security_logs;
DROP POLICY IF EXISTS "Anyone can read security logs" ON public.security_logs;
DROP POLICY IF EXISTS "Public read access" ON public.security_logs;

-- Ensure we have the correct admin-only policy
DROP POLICY IF EXISTS "Admin can view security logs" ON public.security_logs;

-- Create a strict admin-only SELECT policy using the is_admin_user function
CREATE POLICY "Admin can view security logs" 
ON public.security_logs 
FOR SELECT 
USING (is_admin_user(auth.uid()));

-- Ensure only system/functions can insert into security_logs (no user inserts)
DROP POLICY IF EXISTS "System can insert security logs" ON public.security_logs;
CREATE POLICY "System can insert security logs" 
ON public.security_logs 
FOR INSERT 
WITH CHECK (false); -- No direct user inserts allowed

-- Ensure only admins can update security logs if needed
DROP POLICY IF EXISTS "Admin can update security logs" ON public.security_logs;
CREATE POLICY "Admin can update security logs" 
ON public.security_logs 
FOR UPDATE 
USING (is_admin_user(auth.uid()));

-- Ensure only admins can delete security logs
DROP POLICY IF EXISTS "Admin can delete security logs" ON public.security_logs;
CREATE POLICY "Admin can delete security logs" 
ON public.security_logs 
FOR DELETE 
USING (is_admin_user(auth.uid()));

-- Add a comment to document the security-critical nature of this table
COMMENT ON TABLE public.security_logs IS 'SECURITY CRITICAL: Contains sensitive security incident data. Access restricted to authenticated admins only.';