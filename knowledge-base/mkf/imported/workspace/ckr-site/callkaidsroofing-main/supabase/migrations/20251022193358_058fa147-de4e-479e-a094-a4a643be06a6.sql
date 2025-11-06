-- Create roof_measurements table for storing satellite-based roof data
CREATE TABLE IF NOT EXISTS public.roof_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  address TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  total_area_m2 NUMERIC NOT NULL,
  predominant_pitch NUMERIC,
  roof_segments JSONB DEFAULT '[]'::jsonb,
  perimeter_features JSONB DEFAULT '[]'::jsonb,
  hips JSONB DEFAULT '[]'::jsonb,
  ridges JSONB DEFAULT '[]'::jsonb,
  valleys JSONB DEFAULT '[]'::jsonb,
  imagery_url TEXT,
  imagery_date DATE,
  imagery_quality TEXT,
  solar_panel_capacity_watts INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID,
  linked_quote_id UUID REFERENCES public.quotes(id) ON DELETE SET NULL,
  linked_lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  linked_inspection_id UUID REFERENCES public.inspection_reports(id) ON DELETE SET NULL
);

-- Add RLS policies
ALTER TABLE public.roof_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors can view roof measurements"
  ON public.roof_measurements FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE POLICY "Inspectors can create roof measurements"
  ON public.roof_measurements FOR INSERT
  WITH CHECK (is_inspector(auth.uid()));

CREATE POLICY "Inspectors can update roof measurements"
  ON public.roof_measurements FOR UPDATE
  USING (is_inspector(auth.uid()));

-- Add index for faster address lookups
CREATE INDEX idx_roof_measurements_address ON public.roof_measurements(address);
CREATE INDEX idx_roof_measurements_created_at ON public.roof_measurements(created_at DESC);

-- Add column to inspection_reports to link roof measurements
ALTER TABLE public.inspection_reports
ADD COLUMN IF NOT EXISTS roof_measurement_id UUID REFERENCES public.roof_measurements(id) ON DELETE SET NULL;