-- Enhanced secure admin creation function
CREATE OR REPLACE FUNCTION public.create_first_admin(
  admin_email text,
  admin_password text,
  admin_name text DEFAULT 'Admin User'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_user_id uuid;
  signup_result json;
  admin_count integer;
BEGIN
  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count FROM public.admin_profiles;
  
  IF admin_count > 0 THEN
    RETURN json_build_object('error', 'Admin already exists');
  END IF;

  -- Validate email format
  IF admin_email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RETURN json_build_object('error', 'Invalid email format');
  END IF;

  -- Validate password length
  IF length(admin_password) < 6 THEN
    RETURN json_build_object('error', 'Password must be at least 6 characters');
  END IF;

  -- Create auth user via admin API (this is a simplified approach)
  -- In production, you'd typically use Supabase Admin API
  SELECT auth.uid() INTO new_user_id;
  
  -- For now, we'll create a placeholder that requires manual user creation
  -- The user should create the auth user first, then call a simpler function
  RETURN json_build_object('error', 'Please create auth user manually first, then use create_admin_profile function');
END;
$$;

-- Safer function that only creates admin profile for existing auth user
CREATE OR REPLACE FUNCTION public.create_admin_profile()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  admin_count integer;
BEGIN
  -- Get current authenticated user
  SELECT auth.uid() INTO current_user_id;
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('error', 'Must be authenticated');
  END IF;

  -- Check if any admin already exists
  SELECT COUNT(*) INTO admin_count FROM public.admin_profiles;
  
  IF admin_count > 0 THEN
    RETURN json_build_object('error', 'Admin already exists');
  END IF;

  -- Check if user already has admin profile
  IF EXISTS (SELECT 1 FROM public.admin_profiles WHERE user_id = current_user_id) THEN
    RETURN json_build_object('error', 'User already has admin profile');
  END IF;

  -- Create admin profile for current user
  INSERT INTO public.admin_profiles (user_id, email, full_name, role)
  VALUES (
    current_user_id,
    (SELECT email FROM auth.users WHERE id = current_user_id),
    'Admin User',
    'admin'
  );

  RETURN json_build_object('success', true, 'message', 'Admin profile created successfully');
END;
$$;

-- Grant execute permission to authenticated users (but function has built-in security)
GRANT EXECUTE ON FUNCTION public.create_admin_profile() TO authenticated;

-- Revoke public access to ensure only authenticated users can call it
REVOKE ALL ON FUNCTION public.create_admin_profile() FROM public;