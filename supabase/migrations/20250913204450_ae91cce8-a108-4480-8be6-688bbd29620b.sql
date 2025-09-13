-- Remove admin invite system entirely
DROP TABLE IF EXISTS public.admin_invites CASCADE;

-- Drop the invite-related functions
DROP FUNCTION IF EXISTS public.create_admin_invite(text);
DROP FUNCTION IF EXISTS public.validate_invite_and_create_admin(text, text, text, uuid);

-- Update RLS policies to require admin status instead of just authentication
DROP POLICY IF EXISTS "Authenticated admin can manage media" ON public.media;
DROP POLICY IF EXISTS "Authenticated admin can manage pages" ON public.pages;
DROP POLICY IF EXISTS "Authenticated admin can manage social posts" ON public.social_posts;

-- Create proper admin-only policies
CREATE POLICY "Only admins can manage media" 
ON public.media 
FOR ALL 
TO authenticated
USING (is_admin_user(auth.uid()))
WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Only admins can manage pages" 
ON public.pages 
FOR ALL 
TO authenticated
USING (is_admin_user(auth.uid()))
WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Only admins can manage social posts" 
ON public.social_posts 
FOR ALL 
TO authenticated
USING (is_admin_user(auth.uid()))
WITH CHECK (is_admin_user(auth.uid()));