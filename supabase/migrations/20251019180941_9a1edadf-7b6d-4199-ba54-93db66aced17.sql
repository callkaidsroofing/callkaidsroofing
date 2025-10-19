-- Populate pricing rules based on analyzed quotes
-- Clear existing rules first
TRUNCATE TABLE public.pricing_rules CASCADE;

-- Ridge Rebedding + Repointing (prioritize per cap, but include LM for calculation)
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Ridge Rebedding + Repointing', 'ridge', 23.00, 28.00, 0.15, 'premium', '{"brand": "SupaPoint", "type": "Flexible repointing", "warranty": "7-10 years"}'::jsonb),
  ('Ridge Rebedding + Repointing', 'LM', 75.00, 85.00, 0.5, 'premium', '{"brand": "SupaPoint", "type": "Flexible repointing", "warranty": "7-10 years"}'::jsonb);

-- Gable Rebedding + Repointing
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Gable Rebedding + Repointing', 'LM', 65.00, 75.00, 0.4, 'premium', '{"brand": "SupaPoint", "type": "Flexible repointing"}'::jsonb),
  ('Gable Rebedding + Repointing', 'ridge', 20.00, 25.00, 0.12, 'premium', '{"brand": "SupaPoint", "type": "Flexible repointing"}'::jsonb);

-- Valley Iron Replacement
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Valley Iron Replacement', 'LM', 180.00, 220.00, 1.2, 'premium', '{"brand": "BlueScope Zincalume", "type": "Valley iron 0.48mm BMT", "warranty": "15+ years"}'::jsonb);

-- Pressure Wash (separate pricing)
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Pressure Wash', 'm²', 4.00, 6.00, 0.02, 'essential', '{"type": "High pressure clean", "notes": "Removes moss, lichen, debris"}'::jsonb);

-- Roof Coating (3-coat system, separate pricing)
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('3-Coat Paint System', 'm²', 14.00, 16.00, 0.12, 'premium', '{"brand": "Premcoat", "type": "Premium acrylic coating", "warranty": "10 years", "coats": 3}'::jsonb);

-- Pressure Wash + Paint Combined (for when quoted together)
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Pressure Wash + 3-Coat Paint', 'm²', 18.00, 22.00, 0.14, 'premium', '{"brand": "Premcoat", "type": "Full prep + premium coating", "warranty": "10 years"}'::jsonb);

-- Broken Tile Replacement
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Broken Tile Replacement', 'ea', 25.00, 35.00, 0.25, 'essential', '{"type": "Match existing tiles", "notes": "Includes sourcing"}'::jsonb);

-- Gutter Cleaning (variable pricing for buffer, can be $0)
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Gutter Cleaning', 'LM', 0.00, 8.00, 0.05, 'essential', '{"type": "Hand clean + flush", "notes": "Usually free with jobs, priced separately for budget/disproportionate work"}'::jsonb);

-- Seal Penetrations
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Seal Penetrations', 'ea', 35.00, 55.00, 0.3, 'premium', '{"brand": "Sikaflex or equivalent", "type": "Waterproof sealant"}'::jsonb);

-- Install Valley Clips
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Install Valley Clips', 'ea', 12.00, 18.00, 0.15, 'premium', '{"type": "Stainless steel valley clips"}'::jsonb);

-- Re-sarking + Battening (complete tier)
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Re-sarking + Re-battening', 'm²', 45.00, 65.00, 0.8, 'complete', '{"brand": "Sarking blanket + treated pine battens", "warranty": "Structural 10+ years"}'::jsonb);

-- Stormsealing (temporary valley protection)
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Valley Stormsealing', 'LM', 80.00, 120.00, 0.6, 'essential', '{"brand": "Stormseal", "type": "Temporary waterproof protection", "warranty": "12 months temporary"}'::jsonb);

-- Safety Rails (when required)
INSERT INTO public.pricing_rules (service_item, unit, rate_min, rate_max, labour_hours_per_unit, warranty_tier, material_specs) VALUES
  ('Safety Rail Installation', 'lot', 450.00, 650.00, 4.0, 'essential', '{"type": "Temporary edge protection", "notes": "Required for steep roofs"}'::jsonb);