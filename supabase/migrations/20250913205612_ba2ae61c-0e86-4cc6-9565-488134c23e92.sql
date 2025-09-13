-- Step 1: Create the initial admin user for your specific account
-- This will allow you to log in with your credentials

-- First, create a simple function to create admin profile after user signup
CREATE OR REPLACE FUNCTION public.create_admin_for_authenticated_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  user_email text;
  admin_count integer;
BEGIN
  -- Get current authenticated user
  SELECT auth.uid() INTO current_user_id;
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('error', 'Must be authenticated');
  END IF;

  -- Get user email from auth.users
  SELECT email INTO user_email FROM auth.users WHERE id = current_user_id;
  
  IF user_email IS NULL THEN
    RETURN json_build_object('error', 'User email not found');
  END IF;

  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count FROM public.admin_profiles;
  
  -- Allow only one admin account for security
  IF admin_count > 0 THEN
    RETURN json_build_object('error', 'Admin already exists. Contact system administrator.');
  END IF;

  -- Check if user already has admin profile
  IF EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = current_user_id) THEN
    RETURN json_build_object('error', 'User already has admin profile');
  END IF;

  -- Create admin profile for current user
  INSERT INTO public.admin_profiles (user_id, email, full_name, role)
  VALUES (
    current_user_id,
    user_email,
    'Kaidyn Brownlie - Call Kaids Roofing',
    'admin'
  );

  RETURN json_build_object(
    'success', true, 
    'message', 'Admin profile created successfully',
    'admin_email', user_email
  );
END;
$$;

-- Grant execute permission to authenticated users only
GRANT EXECUTE ON FUNCTION public.create_admin_for_authenticated_user() TO authenticated;
REVOKE ALL ON FUNCTION public.create_admin_for_authenticated_user() FROM public;

-- Clean up old functions that are no longer needed
DROP FUNCTION IF EXISTS public.create_first_admin(text, text, text);
DROP FUNCTION IF EXISTS public.create_admin_profile();