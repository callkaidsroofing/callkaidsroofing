-- Phase 1: Critical Security Fixes

-- 1. Update leads table RLS policies to restrict admin access only
DROP POLICY IF EXISTS "Allow admin access to leads" ON public.leads;
DROP POLICY IF EXISTS "Allow public form submissions" ON public.leads;

-- Create secure RLS policies for leads table
CREATE POLICY "Authenticated admin can manage leads" 
ON public.leads 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Public can only insert leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

-- 2. Update social_posts table RLS policies to restrict admin access only  
DROP POLICY IF EXISTS "Admin can manage social posts" ON public.social_posts;

CREATE POLICY "Authenticated admin can manage social posts" 
ON public.social_posts 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- 3. Update media table RLS policies
DROP POLICY IF EXISTS "Admin can manage media" ON public.media;
DROP POLICY IF EXISTS "Public can read active media" ON public.media;

CREATE POLICY "Authenticated admin can manage media" 
ON public.media 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Public can read active media" 
ON public.media 
FOR SELECT 
USING (is_active = true);

-- 4. Update pages table RLS policies
DROP POLICY IF EXISTS "Admin can manage pages" ON public.pages;
DROP POLICY IF EXISTS "Public can read published pages" ON public.pages;

CREATE POLICY "Authenticated admin can manage pages" 
ON public.pages 
FOR ALL 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Public can read published pages" 
ON public.pages 
FOR SELECT 
USING (is_published = true);

-- 5. Create admin profiles table for proper user management
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS on admin_profiles
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for admin_profiles
CREATE POLICY "Admin can manage own profile" 
ON public.admin_profiles 
FOR ALL 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_admin_profiles_updated_at
BEFORE UPDATE ON public.admin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();