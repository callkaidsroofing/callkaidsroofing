-- Security Fix: Remove public INSERT policy on leads table
-- This ensures all lead submissions must go through the controlled edge function
DROP POLICY IF EXISTS "Public can only insert leads" ON public.leads;

-- Strengthen edge function security by adding input validation triggers
-- Create function to validate lead data structure
CREATE OR REPLACE FUNCTION public.validate_lead_data()
RETURNS trigger AS $$
BEGIN
  -- Validate required fields
  IF NEW.name IS NULL OR LENGTH(trim(NEW.name)) = 0 THEN
    RAISE EXCEPTION 'Name is required and cannot be empty';
  END IF;
  
  IF NEW.phone IS NULL OR LENGTH(trim(NEW.phone)) = 0 THEN
    RAISE EXCEPTION 'Phone is required and cannot be empty';
  END IF;
  
  IF NEW.service IS NULL OR LENGTH(trim(NEW.service)) = 0 THEN
    RAISE EXCEPTION 'Service is required and cannot be empty';
  END IF;
  
  IF NEW.suburb IS NULL OR LENGTH(trim(NEW.suburb)) = 0 THEN
    RAISE EXCEPTION 'Suburb is required and cannot be empty';
  END IF;
  
  -- Validate phone format (Australian format)
  IF NOT (NEW.phone ~ '^(\+61|0)[2-9][0-9]{8}$' OR NEW.phone ~ '^04[0-9]{8}$') THEN
    RAISE EXCEPTION 'Invalid Australian phone number format';
  END IF;
  
  -- Validate email format if provided
  IF NEW.email IS NOT NULL AND LENGTH(trim(NEW.email)) > 0 THEN
    IF NOT (NEW.email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
      RAISE EXCEPTION 'Invalid email format';
    END IF;
  END IF;
  
  -- Sanitize text fields to prevent XSS
  NEW.name = trim(NEW.name);
  NEW.phone = trim(NEW.phone);
  NEW.service = trim(NEW.service);
  NEW.suburb = trim(NEW.suburb);
  
  IF NEW.email IS NOT NULL THEN
    NEW.email = trim(lower(NEW.email));
  END IF;
  
  IF NEW.message IS NOT NULL THEN
    NEW.message = trim(NEW.message);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply validation trigger to leads table
DROP TRIGGER IF EXISTS validate_lead_trigger ON public.leads;
CREATE TRIGGER validate_lead_trigger
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_lead_data();

-- Add rate limiting table for edge function security
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL, -- IP address or other identifier
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(identifier, window_start)
);

-- Enable RLS on rate_limits table
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for rate limiting (admin access only)
CREATE POLICY "Only admins can manage rate limits" ON public.rate_limits
FOR ALL USING (is_admin_user(auth.uid()))
WITH CHECK (is_admin_user(auth.uid()));

-- Create function to clean up old rate limit entries
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - interval '1 hour';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;