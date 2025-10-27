-- Phase 1: Create pricing_models table for versioned KF_02 JSON storage
CREATE TABLE public.pricing_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  version TEXT NOT NULL UNIQUE,
  json JSONB NOT NULL,
  hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by UUID REFERENCES admin_profiles(user_id),
  approved_at TIMESTAMPTZ,
  CONSTRAINT valid_kf02_schema CHECK (
    json ? 'KF_02_PRICING_MODEL' AND
    json->'KF_02_PRICING_MODEL' ? 'version' AND
    json->'KF_02_PRICING_MODEL' ? 'services' AND
    json->'KF_02_PRICING_MODEL' ? 'constants' AND
    json->'KF_02_PRICING_MODEL' ? 'labour' AND
    json->'KF_02_PRICING_MODEL' ? 'materials'
  )
);

-- Indexes for performance
CREATE INDEX idx_pricing_models_version ON pricing_models(version);
CREATE INDEX idx_pricing_models_active ON pricing_models(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_pricing_models_created ON pricing_models(created_at DESC);

-- RLS policies
ALTER TABLE pricing_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active pricing models"
  ON pricing_models FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins manage pricing models"
  ON pricing_models FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- View for latest active pricing
CREATE OR REPLACE VIEW v_pricing_latest AS
SELECT 
  id,
  version,
  json,
  hash,
  created_at,
  approved_by,
  approved_at
FROM pricing_models
WHERE is_active = TRUE
ORDER BY created_at DESC
LIMIT 1;

GRANT SELECT ON v_pricing_latest TO anon, authenticated;

-- Trigger to update updated_at
CREATE TRIGGER update_pricing_models_updated_at
  BEFORE UPDATE ON pricing_models
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed KF_02 v7.1
INSERT INTO public.pricing_models (version, json, hash, is_active, approved_at)
VALUES (
  '7.1',
  '{"KF_02_PRICING_MODEL":{"version":"7.1","currency":"AUD","constants":{"gstRate":0.10,"profitMarginTarget":0.30,"materialMarkup":0.20,"contingencyBuffer":0.05,"travelAllowancePerKm":1.10,"crewSizeDefault":2,"dayHours":8,"weatherRiskFactor":0.04,"roundTo":5,"freeRadiusKm":30},"conversions":{"cap_effective_cover_mm_default":420,"caps_per_m_default":2.381,"waste":{"pointing":0.08,"mortar":0.12,"paint":0.05}},"throughput":{"repoint_lm_per_day":20,"rebed_repoint_lm_per_day":12,"stormseal_lm_per_day":8,"wash_m2_per_day":220,"paint_m2_per_day":280},"labour":[{"code":"LAB_PRIMARY_DAY","description":"Lead roofer day rate","unit":"day","baseCost":400.0,"validFrom":"2025-10-01"},{"code":"LAB_ASSIST_DAY","description":"Assistant day rate","unit":"day","baseCost":250.0,"validFrom":"2025-10-01"},{"code":"LAB_CALL_OUT","description":"Rapid response half-day","unit":"half_day","baseCost":250.0,"validFrom":"2025-10-01"}],"materials":[{"code":"MAT_POINTING","description":"SupaPoint flexible compound","unit":"kg","baseCost":4.80,"yield":{"unit":"lm","value":3.0}},{"code":"MAT_MORTAR","description":"Polymer bedding mix","unit":"kg","baseCost":1.60,"yield":{"unit":"lm","value":1.2}},{"code":"MAT_STORMSEAL","description":"Stormseal foam both sides","unit":"lm","baseCost":3.50},{"code":"MAT_PAINT_STD","description":"Primer + membrane system (avg)","unit":"L","baseCost":8.50,"yield":{"unit":"m2","value":3.0}},{"code":"MAT_PAINT_PREM","description":"Heat-reflective topcoat","unit":"L","baseCost":11.50},{"code":"MAT_BIOCIDE","description":"Biocide / cleaner","unit":"L","baseCost":2.80,"yield":{"unit":"m2","value":20.0}}],"services":[{"serviceCode":"REPOINT_CAP","category":"Roof Restoration","displayName":"Re-point ridge/hip tiles","unit":"lm","roofType":["Concrete","Terracotta"],"composition":{"labour":{"LAB_PRIMARY_DAY":0.04},"materials":{"MAT_POINTING":0.33}},"baseRate":33.33,"timePerUnitHr":0.05,"defaultWarrantyYears":[7,10],"metadata":{"keywords":["ridge","repointing","tile","flex pointing"],"compliance":["AS/NZS 2050"]}},{"serviceCode":"REBED_CAP","category":"Roof Restoration","displayName":"Re-bed ridge/hip tiles","unit":"lm","roofType":["Concrete","Terracotta"],"composition":{"labour":{"LAB_PRIMARY_DAY":0.083},"materials":{"MAT_MORTAR":0.83}},"baseRate":16.67,"timePerUnitHr":0.083,"defaultWarrantyYears":[7,10]},{"serviceCode":"STORMSEAL_VALLEY","category":"Valleys","displayName":"Cut-back, clean, install Stormseal both sides","unit":"lm","roofType":["Concrete","Terracotta"],"composition":{"labour":{"LAB_PRIMARY_DAY":0.125},"materials":{"MAT_STORMSEAL":1.0}},"baseRate":35.0,"timePerUnitHr":0.125,"defaultWarrantyYears":[10,15]},{"serviceCode":"WASH_BIOCIDE","category":"Cleaning","displayName":"High-pressure clean + biocide","unit":"m2","composition":{"labour":{"LAB_ASSIST_DAY":0.0045},"materials":{"MAT_BIOCIDE":0.05}},"baseRate":5.25,"timePerUnitHr":0.0045},{"serviceCode":"PAINT_2COAT","category":"Coatings","displayName":"Primer + 2-coat acrylic membrane","unit":"m2","composition":{"labour":{"LAB_PRIMARY_DAY":0.0036},"materials":{"MAT_PAINT_STD":0.333}},"baseRate":10.50,"timePerUnitHr":0.0036,"defaultWarrantyYears":[10,15]},{"serviceCode":"PAINT_PREMIUM_ADDON","category":"Coatings","displayName":"High-build / heat-reflective 3rd coat","unit":"m2","composition":{"materials":{"MAT_PAINT_PREM":0.333}},"addOnRate":5.00,"defaultWarrantyYears":[15,20]},{"serviceCode":"TILE_REPLACE","category":"Repairs","displayName":"Replace broken tile","unit":"each","baseRate":20.0,"allowanceDefault":10}],"logic":{"calculationRules":{"sequence":["subtotal = sum(qty * rate)","if contingencyBuffer>0 then subtotal *= (1 + contingencyBuffer)","totalExGST = subtotal","gst = totalExGST * gstRate","totalIncGST = round(totalExGST + gst, nearest=roundTo)"],"discountPolicies":{"promoMax":0.35,"stacking":"disallowed","exemptServices":["STORMSEAL_VALLEY"]},"tierProfiles":{"REPAIR":{"warranty":"7–10 yrs","markup":1.0},"RESTORE":{"warranty":"10–15 yrs","markup":1.15},"PREMIUM":{"warranty":"15–20 yrs","markup":1.25}},"regionalModifiers":[{"region":"Metro","uplift":1.0},{"region":"Outer-SE","uplift":1.05},{"region":"Rural","uplift":1.10}]}},"governance":{"author":"Kaidyn Brownlie","approvedDate":"2025-10-27","nextReview":"2026-01-27","changelog":["v7.0: enterprise schema, metadata, formulas","v7.1: conversions, throughput, discount caps, regional logic"],"roles":{"approve":["Director"],"edit":["Finance Agent","Ops Manager"],"read":["All internal systems"]}}}}',
  encode(digest('{"KF_02_PRICING_MODEL":{"version":"7.1"}}', 'sha256'), 'hex'),
  TRUE,
  now()
);

-- Add pricing version tracking to quotes table
ALTER TABLE quotes
ADD COLUMN pricing_version TEXT,
ADD COLUMN pricing_hash TEXT,
ADD COLUMN pricing_snapshot JSONB,
ADD COLUMN regional_modifier NUMERIC(4,2) DEFAULT 1.0,
ADD COLUMN tier_profile TEXT CHECK (tier_profile IN ('REPAIR', 'RESTORE', 'PREMIUM'));

CREATE INDEX idx_quotes_pricing_version ON quotes(pricing_version);
CREATE INDEX idx_quotes_tier_profile ON quotes(tier_profile);

COMMENT ON COLUMN quotes.pricing_version IS 'KF_02 version used (e.g., "7.1")';
COMMENT ON COLUMN quotes.pricing_hash IS 'SHA-256 hash of pricing model for audit';
COMMENT ON COLUMN quotes.pricing_snapshot IS 'Frozen copy of KF_02 services used';
COMMENT ON COLUMN quotes.regional_modifier IS 'Regional uplift applied (1.0, 1.05, 1.10)';
COMMENT ON COLUMN quotes.tier_profile IS 'KF_02 tier: REPAIR (1.0x), RESTORE (1.15x), PREMIUM (1.25x)';

-- Add KF_02 service code tracking to quote_line_items
ALTER TABLE quote_line_items
ADD COLUMN service_code TEXT,
ADD COLUMN composition JSONB,
ADD COLUMN warranty_years INTEGER[],
ADD COLUMN material_spec TEXT;

CREATE INDEX idx_quote_line_items_service_code ON quote_line_items(service_code);

COMMENT ON COLUMN quote_line_items.service_code IS 'KF_02 serviceCode (e.g., REPOINT_CAP, WASH_BIOCIDE)';
COMMENT ON COLUMN quote_line_items.composition IS 'Labour + material breakdown from KF_02';
COMMENT ON COLUMN quote_line_items.warranty_years IS 'Warranty range [min, max] from KF_02';
COMMENT ON COLUMN quote_line_items.material_spec IS 'Human-readable material description';

COMMENT ON TABLE pricing_models IS 'Versioned KF_02 pricing model storage with JSON schema validation';
COMMENT ON COLUMN pricing_models.hash IS 'SHA-256 hash for ETag caching and audit trail';
COMMENT ON COLUMN pricing_models.is_active IS 'Only one version should be active at a time';