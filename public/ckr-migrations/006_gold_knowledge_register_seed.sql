-- ============================================================================
-- Migration: 006_gold_knowledge_register_seed.sql
-- CKR-GEM Gold Layer - Data Seeding (All 62 Knowledge Assets)
-- ============================================================================
-- Purpose: Populate gold_knowledge_register with metadata for all 62 assets
--   - 5 Active Canonical Sources (C-01 to C-05) in /silver/ folder
--   - 57 Archived Bronze Sources (B-001 to B-057) in /bronze/ folder
-- Execution Order: Step 6 of 6
-- Safety: Idempotent - DELETE before INSERT ensures clean state
-- ============================================================================

BEGIN;

-- Safety: Delete existing records to ensure idempotent seeding run
DELETE FROM public.gold_knowledge_register WHERE doc_id IS NOT NULL;

-- ============================================================================
-- INSERT 5 ACTIVE CANONICAL SOURCES (Silver Layer - Single Source of Truth)
-- ============================================================================

INSERT INTO public.gold_knowledge_register 
  (doc_id, doc_type, title, owner, summary, related_entities, file_path, version, status, created_at, updated_at)
VALUES
  -- C-01: Core Governance, Brand Mandate, Operational Doctrine
  (
    'C-01',
    'GOVERNANCE/BRAND',
    'CKR Consolidated Core Governance, Brand Mandate, and Operational Doctrine',
    'CKR-GEM/Governance',
    'Merged from KF-00, KF-01, KF-09, and all 15 Chapter files. Single source of truth for brand invariants, VETO points, RLS enforcement, and communication doctrine.',
    '["CKR_Governance", "Brand_Invariants", "VETO_Points", "RLS_Enforcement", "Chapter_Doctrine", "Proof_In_Every_Roof"]'::jsonb,
    'silver/C-01_KF-BRAND-GOV-v2.0.md',
    '2.0',
    'active',
    NOW(),
    NOW()
  ),
  
  -- C-02: Pricing Model
  (
    'C-02',
    'FINANCE/MODEL',
    'KF-PRICING-MODEL-v2.0',
    'Operations/Finance',
    'Canonical pricing model including material costs, labour rates, markup formulas, and PRICING_CHANGELOG compliance. Enforces Schema Law: Quote totals stored as total_amount only.',
    '["Pricing_Logic", "total_amount", "PRICING_CHANGELOG", "Material_Costs", "Labour_Rates"]'::jsonb,
    'silver/C-02_KF-PRICING-MODEL-v2.0.md',
    '2.0',
    'active',
    NOW(),
    NOW()
  ),
  
  -- C-03: Tile Roofing SOP
  (
    'C-03',
    'SOP/INSPECTION',
    'SOP-TILE-E20-v2.0',
    'Operations',
    'Standard Operating Procedure for tile roofing inspections utilizing E.20 (INSPECTION-FORM) structured output. Aligned with inspections table schema.',
    '["Workflow:Inspection", "SchemaObject:inspections_table", "E.20_Form", "Material:Tile", "SOP"]'::jsonb,
    'silver/C-03_SOP-TILE-E20-v2.0.md',
    '2.0',
    'active',
    NOW(),
    NOW()
  ),
  
  -- C-04: Metal Roofing SOP
  (
    'C-04',
    'SOP/INSPECTION',
    'SOP-METAL-E20-v2.0',
    'Operations',
    'Standard Operating Procedure for metal roofing inspections utilizing E.20 (INSPECTION-FORM) structured output. Aligned with inspections table schema.',
    '["Workflow:Inspection", "SchemaObject:inspections_table", "E.20_Form", "Material:Metal", "SOP"]'::jsonb,
    'silver/C-04_SOP-METAL-E20-v2.0.md',
    '2.0',
    'active',
    NOW(),
    NOW()
  ),
  
  -- C-05: GWA Master Automation Spec
  (
    'C-05',
    'AUTOMATION/API',
    'GWA-MASTER-v2.0',
    'CKR-GEM/Automation',
    'Master specification for all 14 Grand Workflow Automations (GWA-01 to GWA-14). Consolidates Annex A/C/D/E, CKR_Tools, Macro_Reference, and eliminates GWA file proliferation.',
    '["CKR_Tools", "GWA_Contract", "Macro_Reference", "SchemaObject:graph_edges", "Annex_E", "Automation"]'::jsonb,
    'silver/C-05_GWA-MASTER-v2.0.md',
    '2.0',
    'active',
    NOW(),
    NOW()
  );

-- ============================================================================
-- INSERT 57 ARCHIVED BRONZE SOURCES (Bronze Layer - Full Detail Retention)
-- ============================================================================

INSERT INTO public.gold_knowledge_register 
  (doc_id, doc_type, title, owner, summary, related_entities, file_path, version, status, created_at, updated_at)
VALUES
  ('B-001', 'RAW/BRONZE', 'Raw Archive: DM-SIMPLIFY_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/DM-SIMPLIFY_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-002', 'RAW/BRONZE', 'Raw Archive: EMAIL-CLIENT_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/EMAIL-CLIENT_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-003', 'RAW/BRONZE', 'Raw Archive: GOOGLE-ADS-PACK_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/GOOGLE-ADS-PACK_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-004', 'RAW/BRONZE', 'Raw Archive: FLYER-A5_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/FLYER-A5_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-005', 'RAW/BRONZE', 'Raw Archive: SOCIAL-PACK_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/SOCIAL-PACK_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-006', 'RAW/BRONZE', 'Raw Archive: QUOTE-SUMMARY_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/QUOTE-SUMMARY_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-007', 'RAW/BRONZE', 'Raw Archive: BLOG-SEO-LOCAL_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/BLOG-SEO-LOCAL_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-008', 'RAW/BRONZE', 'Raw Archive: META-AD-PACK_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/META-AD-PACK_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-009', 'RAW/BRONZE', 'Raw Archive: SYSTEM-OPS_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/SYSTEM-OPS_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-010', 'RAW/BRONZE', 'Raw Archive: META-AD_TEMPLATE.md', 'System/Archived', 'Prompt or Output template, subject to E.xx canonical precedence.', '["Archive", "Legacy", "Template"]'::jsonb, 'bronze/META-AD_TEMPLATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-011', 'RAW/BRONZE', 'Raw Archive: DEPLOYMENT_CHECKLIST.md', 'System/Archived', 'Utility reference. Assumed metadata, full inventory confirmed.', '["Archive", "Legacy", "Utility"]'::jsonb, 'bronze/DEPLOYMENT_CHECKLIST.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-012', 'RAW/BRONZE', 'Raw Archive: PRICING_CHANGELOG.md', 'System/Archived', 'Utility reference. Assumed metadata, full inventory confirmed.', '["Archive", "Legacy", "Utility", "Pricing"]'::jsonb, 'bronze/PRICING_CHANGELOG.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-013', 'RAW/BRONZE', 'Raw Archive: RESEND_EMAIL_SPECS.md', 'System/Archived', 'Utility reference. Assumed metadata, full inventory confirmed.', '["Archive", "Legacy", "Utility", "Email"]'::jsonb, 'bronze/RESEND_EMAIL_SPECS.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-014', 'RAW/BRONZE', 'Raw Archive: SOP_PHOTO_LIBRARY.md', 'System/Archived', 'SOP Procedure. Assumed metadata, full inventory confirmed.', '["Archive", "Legacy", "SOP", "Photos"]'::jsonb, 'bronze/SOP_PHOTO_LIBRARY.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-015', 'RAW/BRONZE', 'Raw Archive: README.md', 'System/Archived', 'Aggregate fragment. Deep merge/removal candidate.', '["Archive", "Legacy", "Fragment"]'::jsonb, 'bronze/README.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-016', 'RAW/BRONZE', 'Raw Archive: CANONICAL_OVERRIDES.md', 'System/Archived', 'Aggregate fragment. Deep merge/removal candidate.', '["Archive", "Legacy", "Fragment"]'::jsonb, 'bronze/CANONICAL_OVERRIDES.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-017', 'RAW/BRONZE', 'Raw Archive: GWA_10_KNOWLEDGE_FILE-GWA_FILE_10_FINANCIAL_REPORTING.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-10"]'::jsonb, 'bronze/GWA_10_KNOWLEDGE_FILE-GWA_FILE_10_FINANCIAL_REPORTING.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-018', 'RAW/BRONZE', 'Raw Archive: GWA_09_KNOWLEDGE_FILE-_GWA_FILE_09_MARKETING_GENERATION.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-09"]'::jsonb, 'bronze/GWA_09_KNOWLEDGE_FILE-_GWA_FILE_09_MARKETING_GENERATION.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-019', 'RAW/BRONZE', 'Raw Archive: GWA_06_KNOWLEDGE_FILE-GWA_FILE_06_QUOTE_FOLLOWUP.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-06"]'::jsonb, 'bronze/GWA_06_KNOWLEDGE_FILE-GWA_FILE_06_QUOTE_FOLLOWUP.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-020', 'RAW/BRONZE', 'Raw Archive: GWA_12_KNOWLEDGE_FILE-_GWA_FILE_12_INTELLIGENT_TRIAGE.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-12"]'::jsonb, 'bronze/GWA_12_KNOWLEDGE_FILE-_GWA_FILE_12_INTELLIGENT_TRIAGE.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-021', 'RAW/BRONZE', 'Raw Archive: GWA_08_KNOWLEDGE_FILE-_GWA_FILE_08_SUBCONTRACTOR_BRIEFING.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-08"]'::jsonb, 'bronze/GWA_08_KNOWLEDGE_FILE-_GWA_FILE_08_SUBCONTRACTOR_BRIEFING.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-022', 'RAW/BRONZE', 'Raw Archive: GWA_14_KNOWLEDGE_FILE-_GWA_FILE_14_SYSTEMS_ORCHESTRATOR.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-14"]'::jsonb, 'bronze/GWA_14_KNOWLEDGE_FILE-_GWA_FILE_14_SYSTEMS_ORCHESTRATOR.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-023', 'RAW/BRONZE', 'Raw Archive: GWA_05_KNOWLEDGE_FILE-_GWA_FILE_05_REPUTATION_ALERT.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-05"]'::jsonb, 'bronze/GWA_05_KNOWLEDGE_FILE-_GWA_FILE_05_REPUTATION_ALERT.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-024', 'RAW/BRONZE', 'Raw Archive: GWA_04.md', 'System/Archived', 'GWA Summary. Assumed metadata, full inventory confirmed.', '["Archive", "Legacy", "GWA", "GWA-04"]'::jsonb, 'bronze/GWA_04.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-025', 'RAW/BRONZE', 'Raw Archive: GWA_13_KNOWLEDGE_FILE-_GWA_FILE_13_LEAD_NURTURE.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-13"]'::jsonb, 'bronze/GWA_13_KNOWLEDGE_FILE-_GWA_FILE_13_LEAD_NURTURE.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-026', 'RAW/BRONZE', 'Raw Archive: GWA_03_KNOWLEDGE_FILE-_GWA_FILE_03_PROJECT_CLOSEOUT.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-03"]'::jsonb, 'bronze/GWA_03_KNOWLEDGE_FILE-_GWA_FILE_03_PROJECT_CLOSEOUT.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-027', 'RAW/BRONZE', 'Raw Archive: GWA_01.md', 'System/Archived', 'GWA Summary. Assumed metadata, full inventory confirmed.', '["Archive", "Legacy", "GWA", "GWA-01"]'::jsonb, 'bronze/GWA_01.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-028', 'RAW/BRONZE', 'Raw Archive: GWA_11_KNOWLEDGE_FILE-_GWA_FILE_11_SOP_RISK_ASSESSMENT.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-11"]'::jsonb, 'bronze/GWA_11_KNOWLEDGE_FILE-_GWA_FILE_11_SOP_RISK_ASSESSMENT.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-029', 'RAW/BRONZE', 'Raw Archive: GWA_02.md', 'System/Archived', 'GWA Summary. Assumed metadata, full inventory confirmed.', '["Archive", "Legacy", "GWA", "GWA-02"]'::jsonb, 'bronze/GWA_02.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-030', 'RAW/BRONZE', 'Raw Archive: GWA_07_KNOWLEDGE_FILE-_GWA_FILE_07_CASE_STUDY_DRAFTING.md', 'System/Archived', 'GWA Implementation file, high duplication risk with Annex C.', '["Archive", "Legacy", "GWA", "GWA-07"]'::jsonb, 'bronze/GWA_07_KNOWLEDGE_FILE-_GWA_FILE_07_CASE_STUDY_DRAFTING.md.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-031', 'RAW/BRONZE', 'Raw Archive: KF_05_GENERAL_SAFETY_SOP.md', 'System/Archived', 'Core doctrine, primary source for canonical files (Silver/Gold).', '["Archive", "Legacy", "KF", "KF-05"]'::jsonb, 'bronze/KF_05_GENERAL_SAFETY_SOP.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-032', 'RAW/BRONZE', 'Raw Archive: KF_10_CASE_STUDY_SPEC.md', 'System/Archived', 'Core doctrine, primary source for canonical files (Silver/Gold).', '["Archive", "Legacy", "KF", "KF-10"]'::jsonb, 'bronze/KF_10_CASE_STUDY_SPEC.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-033', 'RAW/BRONZE', 'Raw Archive: KF_00_SYSTEM_META_GOVERNANCE.md', 'System/Archived', 'Core doctrine, primary source for canonical files (Silver/Gold).', '["Archive", "Legacy", "KF", "KF-00"]'::jsonb, 'bronze/KF_00_SYSTEM_META_GOVERNANCE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-034', 'RAW/BRONZE', 'Raw Archive: KF_01_BRAND_CORE_MANDATE.md', 'System/Archived', 'Core doctrine, primary source for canonical files (Silver/Gold).', '["Archive", "Legacy", "KF", "KF-01"]'::jsonb, 'bronze/KF_01_BRAND_CORE_MANDATE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-035', 'RAW/BRONZE', 'Raw Archive: KF_09_MARKETING_COPY_VOICE_TONE.md', 'System/Archived', 'Core doctrine, primary source for canonical files (Silver/Gold).', '["Archive", "Legacy", "KF", "KF-09"]'::jsonb, 'bronze/KF_09_MARKETING_COPY_VOICE_TONE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-036', 'RAW/BRONZE', 'Raw Archive: KF_04_METAL_SOP.md', 'System/Archived', 'Core doctrine, primary source for canonical files (Silver/Gold).', '["Archive", "Legacy", "KF", "KF-04"]'::jsonb, 'bronze/KF_04_METAL_SOP.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-037', 'RAW/BRONZE', 'Raw Archive: KF_07_SYSTEM_INTEGRATION_MAP.md', 'System/Archived', 'Core doctrine, primary source for canonical files (Silver/Gold).', '["Archive", "Legacy", "KF", "KF-07"]'::jsonb, 'bronze/KF_07_SYSTEM_INTEGRATION_MAP.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-038', 'RAW/BRONZE', 'Raw Archive: KF_06_WEB_DEVELOPMENT_DOCTRINE.md', 'System/Archived', 'Core doctrine, primary source for canonical files (Silver/Gold).', '["Archive", "Legacy", "KF", "KF-06"]'::jsonb, 'bronze/KF_06_WEB_DEVELOPMENT_DOCTRINE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-039', 'RAW/BRONZE', 'Raw Archive: KF_03_TILE_SOP.md', 'System/Archived', 'Core doctrine, primary source for canonical files (Silver/Gold).', '["Archive", "Legacy", "KF", "KF-03"]'::jsonb, 'bronze/KF_03_TILE_SOP.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-040', 'RAW/BRONZE', 'Raw Archive: Chapter_12_THE_OPERATING_SYSTEM_SUMMARY_DEPLOYABLE_CORE_PROMPT.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-12"]'::jsonb, 'bronze/Chapter_12_THE_OPERATING_SYSTEM_SUMMARY_DEPLOYABLE_CORE_PROMPT.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-041', 'RAW/BRONZE', 'Raw Archive: Chapter_02_not_repeated.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-02"]'::jsonb, 'bronze/Chapter_02_not_repeated.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-042', 'RAW/BRONZE', 'Raw Archive: Chapter_08_MACRO_SYSTEM_INTERACTION_MODES_THE_CONTROL_PANEL.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-08"]'::jsonb, 'bronze/Chapter_08_MACRO_SYSTEM_INTERACTION_MODES_THE_CONTROL_PANEL.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-043', 'RAW/BRONZE', 'Raw Archive: Chapter_09_SAFETY_COMPLIANCE_RISK_BOUNDARIES_THE_GUARDRAIL_LAYER.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-09"]'::jsonb, 'bronze/Chapter_09_SAFETY_COMPLIANCE_RISK_BOUNDARIES_THE_GUARDRAIL_LAYER.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-044', 'RAW/BRONZE', 'Raw Archive: Chapter_11_OUTPUT_FORMATTING_RULES_HOW_RESPONSES_MUST_LOOK.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-11"]'::jsonb, 'bronze/Chapter_11_OUTPUT_FORMATTING_RULES_HOW_RESPONSES_MUST_LOOK.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-045', 'RAW/BRONZE', 'Raw Archive: Chapter_03_THE_CKR_GOVERNANCE_DOCTRINE_KF_00_MASTER_LAYER.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-03"]'::jsonb, 'bronze/Chapter_03_THE_CKR_GOVERNANCE_DOCTRINE_KF_00_MASTER_LAYER.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-046', 'RAW/BRONZE', 'Raw Archive: Chapter_07_THE_SYSTEM_INTEGRATION_MAP_KF_09_AI_REASONING_ENGINE.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-07"]'::jsonb, 'bronze/Chapter_07_THE_SYSTEM_INTEGRATION_MAP_KF_09_AI_REASONING_ENGINE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-047', 'RAW/BRONZE', 'Raw Archive: Chapter_01_THE_GENESIS_LAYER_WHY_CKR-GEM_EXISTS.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-01"]'::jsonb, 'bronze/Chapter_01_THE_GENESIS_LAYER_WHY_CKR-GEM_EXISTS.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-048', 'RAW/BRONZE', 'Raw Archive: Chapter_10_TRAINING_LAYER_BEHAVIOUR_EXAMPLES_FINE-TUNE_BLUEPRINT.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-10"]'::jsonb, 'bronze/Chapter_10_TRAINING_LAYER_BEHAVIOUR_EXAMPLES_FINE-TUNE_BLUEPRINT.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-049', 'RAW/BRONZE', 'Raw Archive: Chapter_04_THE_CKR_KNOWLEDGE_FRAMEWORK_KF_01KF_10_MASTER_EMBEDDED_DOCTRINE.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-04"]'::jsonb, 'bronze/Chapter_04_THE_CKR_KNOWLEDGE_FRAMEWORK_KF_01KF_10_MASTER_EMBEDDED_DOCTRINE.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-050', 'RAW/BRONZE', 'Raw Archive: Chapter_05_THE_GRAND_WORKFLOW_AUTOMATION_ENGINE_GWA_01GWA_14.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-05"]'::jsonb, 'bronze/Chapter_05_THE_GRAND_WORKFLOW_AUTOMATION_ENGINE_GWA_01GWA_14.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-051', 'RAW/BRONZE', 'Raw Archive: Chapter_06_THE_DEVELOPMENT_STACK_ENGINEERING_DOCTRINE_THE_CODE_EXECUTION_LAYER.md', 'System/Archived', 'Core doctrine chapter, merged into C-01.', '["Archive", "Legacy", "GOV_Chapter", "Chapter-06"]'::jsonb, 'bronze/Chapter_06_THE_DEVELOPMENT_STACK_ENGINEERING_DOCTRINE_THE_CODE_EXECUTION_LAYER.md', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-052', 'RAW/BRONZE', 'Raw Archive: Annex_E_Annex_E_Master_System_Prompts_v1.0.txt', 'System/Archived', 'Authoritative specification, highest precedence in conflict resolution.', '["Archive", "Legacy", "Annex", "Annex-E", "Prompts"]'::jsonb, 'bronze/Annex_E_Annex_E_Master_System_Prompts_v1.0.txt', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-053', 'RAW/BRONZE', 'Raw Archive: Annex_B_Annex_B_CKR_Database_Schema_Bible_v1.0.txt', 'System/Archived', 'Authoritative specification, highest precedence in conflict resolution.', '["Archive", "Legacy", "Annex", "Annex-B", "Schema"]'::jsonb, 'bronze/Annex_B_Annex_B_CKR_Database_Schema_Bible_v1.0.txt', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-054', 'RAW/BRONZE', 'Raw Archive: Annex_C_Annex_C_Grand_Workflow_Automations_Spec_Pack_v1.0.txt', 'System/Archived', 'Authoritative specification, highest precedence in conflict resolution.', '["Archive", "Legacy", "Annex", "Annex-C", "GWA"]'::jsonb, 'bronze/Annex_C_Annex_C_Grand_Workflow_Automations_Spec_Pack_v1.0.txt', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-055', 'RAW/BRONZE', 'Raw Archive: Annex_A_Annex_A_CKR_Tools_Registry_CKR_Tools_json_v1.0.txt', 'System/Archived', 'Authoritative specification, highest precedence in conflict resolution.', '["Archive", "Legacy", "Annex", "Annex-A", "Tools"]'::jsonb, 'bronze/Annex_A_Annex_A_CKR_Tools_Registry_CKR_Tools_json_v1.0.txt', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-056', 'RAW/BRONZE', 'Raw Archive: Annex_D_Annex_D_Macro_Reference_Table_v1.0.txt', 'System/Archived', 'Authoritative specification, highest precedence in conflict resolution.', '["Archive", "Legacy", "Annex", "Annex-D", "Macros"]'::jsonb, 'bronze/Annex_D_Annex_D_Macro_Reference_Table_v1.0.txt', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00'),
  ('B-057', 'RAW/BRONZE', 'Raw Archive: system brain.txt', 'System/Archived', 'High-risk fragmented content. Target for deletion/deep merge into CKR-GEM.', '["Archive", "Legacy", "Fragment"]'::jsonb, 'bronze/system brain.txt', '0.0.1', 'archived', '2025-11-22T20:42:44+00', '2025-11-22T20:42:44+00');

-- ============================================================================
-- Verification: Confirm all 62 records inserted
-- ============================================================================
DO $$
DECLARE
  record_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO record_count FROM public.gold_knowledge_register;
  
  IF record_count = 62 THEN
    RAISE NOTICE 'SUCCESS: All 62 knowledge assets inserted (5 active canonical + 57 archived bronze)';
  ELSE
    RAISE WARNING 'MISMATCH: Expected 62 records, found %', record_count;
  END IF;
END $$;

COMMIT;