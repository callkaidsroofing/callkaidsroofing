-- Create case_studies table for managing featured project case studies
-- Links to content_gallery for before/after photos via case_study_id

CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Case study metadata
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  service TEXT NOT NULL,
  description TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Customer review data (stored as JSONB for flexibility)
  customer_review JSONB,
  -- Structure: {
  --   customerName: string,
  --   rating: number,
  --   platform: 'Google' | 'Facebook',
  --   date: string,
  --   text: string,
  --   imageUrl: string (Supabase Storage URL)
  -- }

  -- Additional review screenshots (array of objects)
  additional_reviews JSONB[] DEFAULT ARRAY[]::JSONB[],
  -- Each element: { customerName, rating, platform, date, text, imageUrl }

  -- Metadata
  slug TEXT UNIQUE,
  meta_title TEXT,
  meta_description TEXT
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_case_studies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER case_studies_updated_at
  BEFORE UPDATE ON case_studies
  FOR EACH ROW
  EXECUTE FUNCTION update_case_studies_updated_at();

-- Create indexes
CREATE INDEX idx_case_studies_featured ON case_studies(featured) WHERE featured = true;
CREATE INDEX idx_case_studies_published ON case_studies(published) WHERE published = true;
CREATE INDEX idx_case_studies_slug ON case_studies(slug);
CREATE INDEX idx_case_studies_display_order ON case_studies(display_order);

-- Enable Row Level Security
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;

-- Public read access for published case studies
CREATE POLICY "Public can view published case studies"
  ON case_studies
  FOR SELECT
  USING (published = true);

-- Authenticated users (admins) can do everything
CREATE POLICY "Authenticated users can manage case studies"
  ON case_studies
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE case_studies IS 'Featured project case studies with before/after photos and customer reviews. Links to content_gallery via case_study_id field.';
