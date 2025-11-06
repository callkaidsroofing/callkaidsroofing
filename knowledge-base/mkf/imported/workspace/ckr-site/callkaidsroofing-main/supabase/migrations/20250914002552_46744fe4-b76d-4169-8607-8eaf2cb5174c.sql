-- Add restrictive SELECT policy for leads table - only authenticated admins can access
CREATE POLICY "Restrict leads SELECT to authenticated admins only" 
ON public.leads 
FOR SELECT 
TO authenticated 
USING (is_admin_user(auth.uid()));

-- Update admin profiles policy to require authentication and restrict to own profile
DROP POLICY IF EXISTS "Admin can manage own profile" ON public.admin_profiles;

CREATE POLICY "Authenticated admin can manage own profile" 
ON public.admin_profiles 
FOR ALL 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled on both tables
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;