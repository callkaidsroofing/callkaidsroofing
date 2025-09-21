-- Create security log table for admin actions monitoring
CREATE TABLE IF NOT EXISTS public.security_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  user_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  event_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on security logs
ALTER TABLE public.security_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for security logs (admin access only)
CREATE POLICY "Admin can view security logs" 
ON public.security_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.admin_profiles 
    WHERE admin_profiles.user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create index for performance
CREATE INDEX idx_security_logs_event_type ON public.security_logs(event_type);
CREATE INDEX idx_security_logs_created_at ON public.security_logs(created_at DESC);

-- Update the admin creation function to include security logging
CREATE OR REPLACE FUNCTION public.create_admin_for_authenticated_user()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid;
  user_email text;
  admin_count integer;
  result json;
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
    -- Log the failed attempt
    INSERT INTO public.security_logs (
      event_type, 
      user_id, 
      user_email, 
      event_details
    ) VALUES (
      'ADMIN_CREATION_BLOCKED',
      current_user_id,
      user_email,
      json_build_object(
        'reason', 'Admin already exists',
        'existing_admin_count', admin_count
      )
    );
    
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

  -- Log successful admin creation
  INSERT INTO public.security_logs (
    event_type, 
    user_id, 
    user_email, 
    event_details
  ) VALUES (
    'ADMIN_CREATED',
    current_user_id,
    user_email,
    json_build_object(
      'admin_email', user_email,
      'full_name', 'Kaidyn Brownlie - Call Kaids Roofing'
    )
  );

  RETURN json_build_object(
    'success', true, 
    'message', 'Admin profile created successfully',
    'admin_email', user_email
  );
END;
$function$;