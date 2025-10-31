-- Cleanup: Remove legacy admin_profiles table and function
-- This resolves security warnings while maintaining existing user_roles RBAC system

-- Drop the legacy admin creation function
DROP FUNCTION IF EXISTS public.create_admin_for_authenticated_user() CASCADE;

-- Drop the unused admin_profiles table
DROP TABLE IF EXISTS public.admin_profiles CASCADE;

-- Note: is_admin_user() function remains unchanged and uses user_roles table
-- Note: All RLS policies continue to work via user_roles table