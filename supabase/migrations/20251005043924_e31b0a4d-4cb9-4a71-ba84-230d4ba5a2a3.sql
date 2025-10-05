-- Security Fix: Prevent public exposure of sensitive tables
-- Phase 1: Fix Critical Admin Profile and Rate Limits Exposure

-- 1. Add explicit SELECT policy to admin_profiles (prevents public harvesting of admin emails)
CREATE POLICY "Only admins can view admin profiles"
ON public.admin_profiles
FOR SELECT
TO authenticated
USING (is_admin_user(auth.uid()));

-- 2. Add explicit SELECT policy to rate_limits (prevents analysis of rate limiting patterns)
CREATE POLICY "Only admins can view rate limits"
ON public.rate_limits
FOR SELECT
TO authenticated
USING (is_admin_user(auth.uid()));

-- Note: security_logs already has proper "Admin can view security logs" SELECT policy
-- Note: Leaked password protection must be enabled manually in Supabase Dashboard:
--       Dashboard → Authentication → Password Security → Enable "Check against known breached passwords"