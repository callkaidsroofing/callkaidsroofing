-- Fix search path issues for security functions
CREATE OR REPLACE FUNCTION public.validate_lead_data()
RETURNS trigger 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Fix cleanup function search path
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - interval '1 hour';
END;
$$;