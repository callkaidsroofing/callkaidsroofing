-- Add comprehensive quote builder columns to quotes table
ALTER TABLE quotes
ADD COLUMN IF NOT EXISTS scope jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS line_items jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS photo_ids text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS pricing jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS terms jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS version integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS parent_quote_id uuid REFERENCES quotes(id),
ADD COLUMN IF NOT EXISTS sent_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS accepted_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS discount_amount numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS discount_reason text,
ADD COLUMN IF NOT EXISTS subtotal numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS gst numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS total numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS draft boolean DEFAULT true;

-- Add index for parent quotes
CREATE INDEX IF NOT EXISTS idx_quotes_parent ON quotes(parent_quote_id) WHERE parent_quote_id IS NOT NULL;

-- Add index for version lookups
CREATE INDEX IF NOT EXISTS idx_quotes_version ON quotes(version);

-- Create price_book table if not exists
CREATE TABLE IF NOT EXISTS price_book (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_code text NOT NULL,
  display_name text NOT NULL,
  description text,
  unit text NOT NULL,
  base_rate numeric NOT NULL,
  category text NOT NULL,
  material_cost numeric DEFAULT 0,
  labour_hours numeric DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on price_book
ALTER TABLE price_book ENABLE ROW LEVEL SECURITY;

-- Allow inspectors to manage price book
CREATE POLICY "Inspectors can manage price book"
ON price_book FOR ALL
USING (is_inspector(auth.uid()))
WITH CHECK (is_inspector(auth.uid()));

-- Insert default price book items
INSERT INTO price_book (service_code, display_name, description, unit, base_rate, category, material_cost, labour_hours) VALUES
('REBED_RIDGE', 'Re-bed Ridge Caps', 'Remove old mortar, clean and re-bed ridge caps with fresh mortar', 'lm', 45, 'Bedding & Pointing', 8, 0.15),
('REPOINT_RIDGE', 'Flexible Re-pointing', 'Apply flexible pointing compound to ridge caps', 'lm', 25, 'Bedding & Pointing', 6, 0.08),
('PRESSURE_WASH', 'Pressure Wash Roof', 'High-pressure clean entire roof surface', 'm2', 8, 'Cleaning', 1, 0.02),
('BIOCIDE', 'Biocide Treatment', 'Anti-fungal treatment to prevent regrowth', 'm2', 3, 'Cleaning', 2, 0.01),
('VALLEY_SEAL', 'Valley Stormseal', 'Clean and seal valley irons with Stormseal', 'lm', 35, 'Waterproofing', 12, 0.12),
('PRIMER', 'Bonding Primer', 'Industrial-grade primer application', 'm2', 12, 'Coating', 5, 0.03),
('MEMBRANE_2COAT', '2-Coat UV Membrane', 'Premium acrylic membrane system', 'm2', 28, 'Coating', 10, 0.06),
('GUTTER_CLEAN', 'Gutter Cleaning', 'Clear gutters and downpipes', 'lm', 8, 'Maintenance', 0, 0.05),
('TILE_REPLACE', 'Tile Replacement', 'Replace broken or damaged tiles', 'each', 45, 'Repairs', 15, 0.3),
('VALLEY_IRON', 'Valley Iron Replacement', 'Remove and replace valley irons', 'lm', 120, 'Repairs', 45, 0.5)
ON CONFLICT DO NOTHING;