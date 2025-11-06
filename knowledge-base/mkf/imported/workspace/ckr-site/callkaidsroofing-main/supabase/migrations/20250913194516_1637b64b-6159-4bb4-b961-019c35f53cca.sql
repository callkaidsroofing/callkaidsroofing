-- Create a security definer function to check if user is admin
-- This prevents RLS recursion issues when checking admin status
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_profiles 
    WHERE admin_profiles.user_id = $1
    AND role = 'admin'
  );
$$;

-- Drop the overly permissive policy that allows any authenticated user to access leads
DROP POLICY IF EXISTS "Authenticated admin can manage leads" ON public.leads;

-- Create a new secure policy that only allows verified admin users to access leads
CREATE POLICY "Only verified admins can manage leads" 
ON public.leads 
FOR ALL 
TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));

-- Keep the public insert policy for contact forms to work
-- This allows the website contact forms to create new leads
-- (The "Public can only insert leads" policy already exists and is correct)