-- 01_create_table.sql: Create inspection_reports table with all required columns

CREATE TABLE IF NOT EXISTS public.inspection_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  -- Section 1: Job & Client
  clientName text NOT NULL,
  phone text NOT NULL,
  siteAddress text NOT NULL,
  suburbPostcode text NOT NULL,
  email text,
  inspector text NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  
  -- Section 2: Roof Identification
  claddingType text NOT NULL,
  tileProfile text,
  tileColour text,
  ageApprox text,
  
  -- Section 3: Quantity Summary
  ridgeCaps integer,
  brokenTiles integer,
  gableLengthTiles integer,
  gableLengthLM numeric,
  valleyLength numeric,
  gutterPerimeter numeric,
  roofArea numeric,
  
  -- Section 4: Condition Checklist
  brokenTilesCaps text,
  brokenTilesNotes text,
  pointing text,
  pointingNotes text,
  valleyIrons text,
  valleyIronsNotes text,
  boxGutters text,
  boxGuttersNotes text,
  guttersDownpipes text,
  guttersDownpipesNotes text,
  penetrations text,
  penetrationsNotes text,
  internalLeaks text,
  
  -- Section 5: Photo uploads (arrays of text URLs)
  brokentilesphoto text[],
  pointingphoto text[],
  valleyironsphoto text[],
  boxguttersphoto text[],
  guttersphoto text[],
  penetrationsphoto text[],
  leaksphoto text[],
  beforedefects text[],
  duringafter text[],
  
  -- Section 6: Recommended Works
  replacebrokentilesqty integer,
  replacebrokentilesnotes text,
  rebedridgeqty integer,
  rebedridgenotes text,
  flexiblerepointingqty integer,
  flexiblerepointingnotes text,
  installvalleyclipsqty integer,
  installvalleyclipsnotes text,
  replacevalleyironsqty integer,
  replacevalleyironsnotes text,
  cleanguttersqty integer,
  cleanguttersnotes text,
  pressurewashqty integer,
  pressurewashnotes text,
  sealpenetrationsqty integer,
  sealpenetrationsnotes text,
  coatingsystemqty integer,
  coatingsystemnotes text,
  
  -- Section 7: Materials & Specs
  pointingColour text,
  beddingCementSand text,
  specTileProfile text,
  specTileColour text,
  paintSystem text,
  paintColour text,
  flashings text,
  otherMaterials text,
  
  -- Section 8: Safety & Access
  heightStoreys text,
  safetyRailNeeded boolean DEFAULT false,
  roofPitch text,
  accessNotes text,
  
  -- Section 9: Summary
  overallCondition text,
  overallConditionNotes text,
  priority text,
  status text DEFAULT 'draft'
);

-- Add missing columns if they don't exist (safe migration)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inspection_reports' AND column_name='cleanguttersnotes') THEN
    ALTER TABLE public.inspection_reports ADD COLUMN cleanguttersnotes text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='inspection_reports' AND column_name='accessnotes') THEN
    ALTER TABLE public.inspection_reports ADD COLUMN accessnotes text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE public.inspection_reports ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for inspection photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('inspection-photos', 'inspection-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for inspection photos
CREATE POLICY "Anyone can upload inspection photos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'inspection-photos');

CREATE POLICY "Anyone can view inspection photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'inspection-photos');

CREATE POLICY "Anyone can update inspection photos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'inspection-photos');

CREATE POLICY "Anyone can delete inspection photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'inspection-photos');

-- RLS Policies for inspection_reports (public for now, tighten later)
CREATE POLICY "Anyone can insert inspection reports"
ON public.inspection_reports FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view inspection reports"
ON public.inspection_reports FOR SELECT
USING (true);

CREATE POLICY "Anyone can update inspection reports"
ON public.inspection_reports FOR UPDATE
USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.inspection_reports
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();