-- Create form_definitions table
CREATE TABLE public.form_definitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  version integer NOT NULL DEFAULT 1,
  schema jsonb NOT NULL,
  ui_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  outputs text[] NOT NULL DEFAULT '{}'::text[],
  roles text[] NOT NULL DEFAULT '{admin,inspector}'::text[],
  is_published boolean NOT NULL DEFAULT false,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create form_submissions table
CREATE TABLE public.form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id uuid NOT NULL REFERENCES public.form_definitions(id) ON DELETE CASCADE,
  submitted_by uuid,
  submitted_data jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add updated_at triggers
CREATE TRIGGER update_form_definitions_updated_at
  BEFORE UPDATE ON public.form_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_form_submissions_updated_at
  BEFORE UPDATE ON public.form_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.form_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for form_definitions
CREATE POLICY "Admins can manage form definitions"
  ON public.form_definitions
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Inspectors can view published or own drafts"
  ON public.form_definitions
  FOR SELECT
  USING (
    public.has_role(auth.uid(), 'inspector'::app_role) 
    AND (is_published OR created_by = auth.uid())
  );

CREATE POLICY "Inspectors can create forms"
  ON public.form_definitions
  FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'inspector'::app_role) 
    AND created_by = auth.uid()
  );

CREATE POLICY "Inspectors can update their own forms"
  ON public.form_definitions
  FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'inspector'::app_role) 
    AND created_by = auth.uid()
  );

-- RLS policies for form_submissions
CREATE POLICY "Admins can manage form submissions"
  ON public.form_submissions
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Inspectors can insert form submissions"
  ON public.form_submissions
  FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'inspector'::app_role));

CREATE POLICY "Inspectors can view form submissions"
  ON public.form_submissions
  FOR SELECT
  USING (public.has_role(auth.uid(), 'inspector'::app_role));

-- Fix is_admin_user function to use user_roles instead of admin_profiles
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = $1
    AND role = 'admin'::app_role
  );
$function$;