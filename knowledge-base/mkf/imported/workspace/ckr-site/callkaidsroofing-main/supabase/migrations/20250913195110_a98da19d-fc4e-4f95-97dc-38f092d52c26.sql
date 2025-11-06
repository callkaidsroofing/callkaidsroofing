-- Create admin invites table for invite-only sign ups
CREATE TABLE public.admin_invites (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  invite_token text NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamp with time zone NULL,
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on admin_invites
ALTER TABLE public.admin_invites ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_invites
CREATE POLICY "Only admins can manage invites" 
ON public.admin_invites 
FOR ALL 
TO authenticated
USING (public.is_admin_user(auth.uid()))
WITH CHECK (public.is_admin_user(auth.uid()));

-- Create policy to allow checking valid invites during signup
CREATE POLICY "Allow checking valid invites for signup" 
ON public.admin_invites 
FOR SELECT 
TO anon
USING (used_at IS NULL AND expires_at > now());

-- Create function to validate invite and create admin profile
CREATE OR REPLACE FUNCTION public.validate_invite_and_create_admin(
  p_email text,
  p_invite_token text,
  p_full_name text,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_record admin_invites%ROWTYPE;
BEGIN
  -- Check if invite exists and is valid
  SELECT * INTO invite_record
  FROM public.admin_invites 
  WHERE email = p_email 
    AND invite_token = p_invite_token 
    AND used_at IS NULL 
    AND expires_at > now();
    
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Mark invite as used
  UPDATE public.admin_invites 
  SET used_at = now(), updated_at = now()
  WHERE id = invite_record.id;
  
  -- Create admin profile
  INSERT INTO public.admin_profiles (user_id, full_name, email, role)
  VALUES (p_user_id, p_full_name, p_email, 'admin');
  
  RETURN true;
END;
$$;

-- Create function for admins to send invites
CREATE OR REPLACE FUNCTION public.create_admin_invite(
  p_email text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_token text;
BEGIN
  -- Check if caller is admin
  IF NOT public.is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'Only admins can create invites';
  END IF;
  
  -- Generate unique token
  invite_token := gen_random_uuid()::text;
  
  -- Insert invite
  INSERT INTO public.admin_invites (email, invite_token, invited_by)
  VALUES (p_email, invite_token, auth.uid());
  
  RETURN invite_token;
END;
$$;