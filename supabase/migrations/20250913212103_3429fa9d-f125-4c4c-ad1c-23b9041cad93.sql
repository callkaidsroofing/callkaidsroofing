-- Fix search_path security warnings for functions
ALTER FUNCTION public.validate_lead_data() SET search_path = public;
ALTER FUNCTION public.cleanup_rate_limits() SET search_path = public;