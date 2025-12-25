-- Fix: Remove public access from ckr_leads and restrict to authenticated users only
-- This table contains sensitive customer PII (names, phones, emails)

-- Drop any existing public access policies on ckr_leads
DROP POLICY IF EXISTS "Public Access" ON public.ckr_leads;
DROP POLICY IF EXISTS "public_read" ON public.ckr_leads;
DROP POLICY IF EXISTS "Anyone can read" ON public.ckr_leads;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.ckr_leads;

-- Ensure RLS is enabled
ALTER TABLE public.ckr_leads ENABLE ROW LEVEL SECURITY;

-- Create secure policies for authenticated users only
CREATE POLICY "Authenticated users can view leads"
ON public.ckr_leads
FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert leads"
ON public.ckr_leads
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update leads"
ON public.ckr_leads
FOR UPDATE
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete leads"
ON public.ckr_leads
FOR DELETE
USING (auth.uid() IS NOT NULL);