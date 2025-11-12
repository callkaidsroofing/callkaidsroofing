-- ============================================================================
-- CKR Digital Engine - Master Data Seeding Script
-- ============================================================================
-- Purpose: Bootstrap core configuration data for fresh database instances
-- Usage: Run after initial migration to populate essential system data
-- Warning: Use ON CONFLICT to make this script idempotent
-- ============================================================================

-- Pricing Constants
-- ============================================================================
INSERT INTO pricing_constants (constant_name, value, unit, category, description) VALUES
  ('labour_rate_inspector', 85.00, 'AUD/hour', 'labour', 'Inspector/supervisor hourly rate'),
  ('labour_rate_crew', 65.00, 'AUD/hour', 'labour', 'Crew member hourly rate'),
  ('labour_rate_apprentice', 45.00, 'AUD/hour', 'labour', 'Apprentice hourly rate'),
  ('gst_rate', 0.10, 'percentage', 'tax', 'Australian GST rate'),
  ('markup_materials', 0.25, 'percentage', 'profit', 'Materials markup percentage'),
  ('markup_labour', 0.15, 'percentage', 'profit', 'Labour markup percentage'),
  ('discount_max', 0.15, 'percentage', 'sales', 'Maximum discount percentage'),
  ('quote_validity_days', 30.00, 'days', 'business_rules', 'Quote validity period'),
  ('deposit_percentage', 0.30, 'percentage', 'payment', 'Required deposit percentage'),
  ('warranty_standard_years', 10.00, 'years', 'warranty', 'Standard workmanship warranty'),
  ('warranty_premium_years', 15.00, 'years', 'warranty', 'Premium workmanship warranty'),
  ('warranty_lifetime_years', 20.00, 'years', 'warranty', 'Lifetime workmanship warranty'),
  ('emergency_surcharge', 1.50, 'multiplier', 'pricing', 'Emergency callout multiplier'),
  ('weekend_surcharge', 1.25, 'multiplier', 'pricing', 'Weekend work multiplier'),
  ('travel_rate', 1.20, 'AUD/km', 'logistics', 'Travel cost per kilometre'),
  ('minimum_job_value', 500.00, 'AUD', 'business_rules', 'Minimum acceptable job value')
ON CONFLICT (constant_name) DO UPDATE SET
  value = EXCLUDED.value,
  description = EXCLUDED.description;

-- Chat Commands
-- ============================================================================
INSERT INTO chat_commands (command, description, handler_type, is_active) VALUES
  ('/quote', 'Generate quote from inspection data', 'quote_generator', true),
  ('/status', 'Check job status by job number', 'status_lookup', true),
  ('/lead', 'Search lead by name or phone', 'lead_search', true),
  ('/pricing', 'Search pricing database', 'pricing_search', true),
  ('/knowledge', 'Search knowledge base', 'rag_search', true),
  ('/help', 'Show available commands', 'help', true),
  ('/customer', 'Customer information lookup', 'customer_lookup', true),
  ('/schedule', 'View upcoming scheduled jobs', 'schedule_view', true),
  ('/warranty', 'Warranty policy information', 'warranty_info', true),
  ('/calculate', 'Quick calculation helper', 'calculator', true)
ON CONFLICT (command) DO UPDATE SET
  description = EXCLUDED.description,
  is_active = EXCLUDED.is_active;

-- Knowledge File Metadata (Blueprint Structure)
-- ============================================================================
INSERT INTO knowledge_file_metadata (kf_id, title, category, priority, version, dependencies, review_cadence_days, description) VALUES
  ('KF_00', 'System Mandate & Core Directives', 'governance', 10, 'v4.0', '{}', 90, 'Highest-level system governance and operational mandate'),
  ('KF_01', 'Brand Core & Identity', 'brand', 10, 'v4.0', '{}', 180, 'Brand invariants, values, slogan, voice characteristics'),
  ('KF_02', 'Pricing Model & Financial Constants', 'pricing', 9, 'v4.0', '{"KF_01"}', 90, 'Complete pricing structure, labour rates, material costs'),
  ('KF_03', 'Tile Roofing SOPs', 'sop', 8, 'v4.0', '{"KF_01", "KF_02"}', 180, 'Comprehensive tile roofing procedures and best practices'),
  ('KF_04', 'Metal Roofing SOPs', 'sop', 8, 'v4.0', '{"KF_01", "KF_02"}', 180, 'Complete metal roofing installation and repair procedures'),
  ('KF_05', 'General Roofing & Repair SOPs', 'sop', 8, 'v4.0', '{"KF_01", "KF_02"}', 180, 'General roofing repair and maintenance procedures'),
  ('KF_06', 'Marketing Copy Kit', 'marketing', 7, 'v4.0', '{"KF_01", "KF_07", "KF_09"}', 60, 'Pre-approved marketing copy and messaging templates'),
  ('KF_07', 'Voice & Tone Guidelines', 'brand', 9, 'v4.0', '{"KF_01"}', 180, 'Communication voice characteristics and tone guidelines'),
  ('KF_08', 'System Integration & API Docs', 'technical', 6, 'v4.0', '{}', 120, 'Integration points, API documentation, webhooks'),
  ('KF_09', 'Communication Doctrine', 'brand', 9, 'v4.0', '{"KF_01", "KF_07"}', 180, 'Customer communication protocols and templates'),
  ('KF_10', 'Case Studies & Portfolio', 'marketing', 7, 'v4.0', '{"KF_01"}', 90, 'Portfolio of completed projects and case studies'),
  ('KF_11', 'Brand Assets & Design System', 'brand', 8, 'v4.0', '{"KF_01"}', 180, 'Visual identity, color palette, logo usage guidelines')
ON CONFLICT (kf_id) DO UPDATE SET
  title = EXCLUDED.title,
  version = EXCLUDED.version,
  priority = EXCLUDED.priority,
  description = EXCLUDED.description;

-- Service Areas (SE Melbourne)
-- ============================================================================
INSERT INTO content_suburbs (title, slug, region, population, description, featured, meta_title, meta_description) VALUES
  ('Berwick', 'berwick', 'SE Melbourne', 50000, 'Premium roofing services in Berwick - trusted local roofers', true, 'Roofing Berwick | Call Kaids Roofing', 'Expert roofing services in Berwick. 10-year warranty. Call 0435 900 709 for your free quote.'),
  ('Narre Warren', 'narre-warren', 'SE Melbourne', 30000, 'Professional roofing services in Narre Warren', true, 'Roofing Narre Warren | Call Kaids Roofing', 'Trusted roofing contractors in Narre Warren. Free quotes, 10-year warranty. Call 0435 900 709.'),
  ('Cranbourne', 'cranbourne', 'SE Melbourne', 25000, 'Quality roofing services in Cranbourne', true, 'Roofing Cranbourne | Call Kaids Roofing', 'Cranbourne roofing specialists. Tile, metal, restoration. Call 0435 900 709.'),
  ('Pakenham', 'pakenham', 'SE Melbourne', 48000, 'Expert roofing services in Pakenham', true, 'Roofing Pakenham | Call Kaids Roofing', 'Professional roofing services in Pakenham. 10-year warranty. Call 0435 900 709.'),
  ('Officer', 'officer', 'SE Melbourne', 10000, 'Reliable roofing services in Officer', false, 'Roofing Officer | Call Kaids Roofing', 'Quality roofing in Officer. Free quotes. Call 0435 900 709.'),
  ('Beaconsfield', 'beaconsfield', 'SE Melbourne', 7000, 'Professional roofing services in Beaconsfield', false, 'Roofing Beaconsfield | Call Kaids Roofing', 'Expert roofing contractors in Beaconsfield. Call 0435 900 709.'),
  ('Hallam', 'hallam', 'SE Melbourne', 15000, 'Trusted roofing services in Hallam', false, 'Roofing Hallam | Call Kaids Roofing', 'Hallam roofing specialists. Free quotes. Call 0435 900 709.'),
  ('Dandenong', 'dandenong', 'SE Melbourne', 30000, 'Quality roofing services in Dandenong', true, 'Roofing Dandenong | Call Kaids Roofing', 'Professional roofing in Dandenong. 10-year warranty. Call 0435 900 709.')
ON CONFLICT (slug) DO UPDATE SET
  population = EXCLUDED.population,
  description = EXCLUDED.description,
  featured = EXCLUDED.featured;

-- ============================================================================
-- System Configuration
-- ============================================================================

-- System Settings (using ai_action_log as generic config store)
INSERT INTO ai_action_log (action_type, metadata, status) VALUES
  ('system_config', '{"key": "system_initialized", "value": true, "timestamp": "2025-11-12T00:00:00Z"}', 'success'),
  ('system_config', '{"key": "seed_version", "value": "1.0.0", "timestamp": "2025-11-12T00:00:00Z"}', 'success')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Verification Queries
-- ============================================================================
-- Uncomment to verify seeding was successful:

-- SELECT COUNT(*) as pricing_constants_count FROM pricing_constants;
-- SELECT COUNT(*) as chat_commands_count FROM chat_commands WHERE is_active = true;
-- SELECT COUNT(*) as knowledge_files_count FROM knowledge_file_metadata;
-- SELECT COUNT(*) as service_areas_count FROM content_suburbs;

-- ============================================================================
-- End of Master Data Seeding
-- ============================================================================
