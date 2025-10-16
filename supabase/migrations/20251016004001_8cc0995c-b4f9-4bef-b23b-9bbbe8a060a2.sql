-- Phase 1: User Roles and Security Foundation

-- 1. Create app_role enum for role types
CREATE TYPE public.app_role AS ENUM ('admin', 'inspector', 'viewer');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Create convenience function for inspector check
CREATE OR REPLACE FUNCTION public.is_inspector(_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = COALESCE(_user_id, auth.uid())
      AND role IN ('admin', 'inspector')
  )
$$;

-- 5. RLS Policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 6. Update inspection_reports RLS policies
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert inspection reports" ON public.inspection_reports;
DROP POLICY IF EXISTS "Anyone can view inspection reports" ON public.inspection_reports;
DROP POLICY IF EXISTS "Anyone can update inspection reports" ON public.inspection_reports;
DROP POLICY IF EXISTS "Authenticated users can insert inspection reports" ON public.inspection_reports;
DROP POLICY IF EXISTS "Authenticated users can view inspection reports" ON public.inspection_reports;
DROP POLICY IF EXISTS "Authenticated users can update inspection reports" ON public.inspection_reports;

-- Create new secure policies
CREATE POLICY "Only inspectors can create reports"
ON public.inspection_reports
FOR INSERT
TO authenticated
WITH CHECK (public.is_inspector(auth.uid()));

CREATE POLICY "Only inspectors can view reports"
ON public.inspection_reports
FOR SELECT
TO authenticated
USING (public.is_inspector(auth.uid()));

CREATE POLICY "Only inspectors can update reports"
ON public.inspection_reports
FOR UPDATE
TO authenticated
USING (public.is_inspector(auth.uid()));

CREATE POLICY "Only admins can delete reports"
ON public.inspection_reports
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Secure storage bucket for inspection photos
-- Create policies on storage.objects for inspection-photos bucket
CREATE POLICY "Only inspectors can upload inspection photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'inspection-photos' 
  AND public.is_inspector(auth.uid())
);

CREATE POLICY "Only inspectors can view inspection photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'inspection-photos' 
  AND public.is_inspector(auth.uid())
);

CREATE POLICY "Only inspectors can update inspection photos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'inspection-photos' 
  AND public.is_inspector(auth.uid())
);

CREATE POLICY "Only admins can delete inspection photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'inspection-photos' 
  AND public.has_role(auth.uid(), 'admin')
);