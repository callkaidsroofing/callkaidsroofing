-- Add unique constraint on brand_assets.key for upsert support
ALTER TABLE public.brand_assets ADD CONSTRAINT brand_assets_key_unique UNIQUE (key);