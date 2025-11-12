-- Create table to store business profile data from Google and Facebook
CREATE TABLE IF NOT EXISTS public.business_profile_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL CHECK (source IN ('google', 'facebook')),
  rating DECIMAL(2,1),
  review_count INTEGER,
  operating_hours JSONB,
  phone TEXT,
  address TEXT,
  website TEXT,
  raw_data JSONB,
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source)
);

-- Enable RLS
ALTER TABLE public.business_profile_data ENABLE ROW LEVEL SECURITY;

-- Allow public read access for display on website
CREATE POLICY "Public read access for business profile"
  ON public.business_profile_data
  FOR SELECT
  USING (true);

-- Only authenticated users can update (admin sync)
CREATE POLICY "Admin can update business profile"
  ON public.business_profile_data
  FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX idx_business_profile_source ON public.business_profile_data(source);

-- Insert initial placeholder records
INSERT INTO public.business_profile_data (source, rating, review_count)
VALUES 
  ('google', 4.9, 200),
  ('facebook', 4.8, 150)
ON CONFLICT (source) DO NOTHING;