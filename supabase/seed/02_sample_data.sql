-- ============================================================================
-- CKR Digital Engine - Sample Data for Development/Testing
-- ============================================================================
-- Purpose: Populate test data for development and QA environments
-- Warning: DO NOT run in production - this creates fake customer data
-- Usage: Run in development after 01_master_data.sql
-- ============================================================================

-- Sample Leads (Test Customer Inquiries)
-- ============================================================================
INSERT INTO leads (name, phone, email, suburb, service, status, source, urgency, message, created_at) VALUES
  ('John Smith', '0435900701', 'john.smith.test@example.com', 'Berwick', 'Roof Restoration', 'new', 'test_data', 'high', 'Urgent roof repair needed - tiles falling off', NOW() - INTERVAL '2 hours'),
  ('Sarah Johnson', '0435900702', 'sarah.j.test@example.com', 'Narre Warren', 'Gutter Cleaning', 'contacted', 'test_data', 'medium', 'Annual gutter cleaning service', NOW() - INTERVAL '1 day'),
  ('Michael Brown', '0435900703', 'michael.b.test@example.com', 'Cranbourne', 'Leak Repair', 'quoted', 'test_data', 'high', 'Ceiling leak in bedroom during heavy rain', NOW() - INTERVAL '3 days'),
  ('Emily Davis', '0435900704', 'emily.d.test@example.com', 'Pakenham', 'New Roof Installation', 'new', 'test_data', 'low', 'Planning new home, need quote for tile roof', NOW() - INTERVAL '5 hours'),
  ('David Wilson', '0435900705', 'david.w.test@example.com', 'Berwick', 'Roof Inspection', 'contacted', 'test_data', 'medium', 'Pre-purchase building inspection', NOW() - INTERVAL '2 days'),
  ('Jessica Taylor', '0435900706', 'jessica.t.test@example.com', 'Officer', 'Roof Restoration', 'won', 'test_data', 'medium', 'Complete roof restoration needed', NOW() - INTERVAL '10 days'),
  ('Daniel Anderson', '0435900707', 'daniel.a.test@example.com', 'Hallam', 'Metal Roof Repair', 'lost', 'test_data', 'low', 'Loose metal sheets making noise', NOW() - INTERVAL '15 days'),
  ('Olivia Martin', '0435900708', 'olivia.m.test@example.com', 'Dandenong', 'Emergency Repair', 'quoted', 'test_data', 'emergency', 'Storm damage - large hole in roof', NOW() - INTERVAL '6 hours')
ON CONFLICT DO NOTHING;

-- Sample Quotes
-- ============================================================================
INSERT INTO quotes (
  quote_number, 
  customer_name, 
  customer_email, 
  customer_phone, 
  property_address, 
  suburb, 
  roof_type, 
  roof_condition, 
  service_type, 
  total_amount, 
  gst_amount, 
  subtotal, 
  status, 
  valid_until,
  notes,
  created_at
) VALUES
  (
    'QTE-20251112-001',
    'Michael Brown',
    'michael.b.test@example.com',
    '0435900703',
    '42 Smith Street, Cranbourne VIC 3977',
    'Cranbourne',
    'tile',
    'good',
    'Leak Repair',
    2750.00,
    250.00,
    2500.00,
    'sent',
    CURRENT_DATE + INTERVAL '30 days',
    'Leak repair in roof valley - includes flashing replacement',
    NOW() - INTERVAL '2 days'
  ),
  (
    'QTE-20251112-002',
    'Jessica Taylor',
    'jessica.t.test@example.com',
    '0435900706',
    '15 Oak Avenue, Officer VIC 3809',
    'Officer',
    'tile',
    'poor',
    'Roof Restoration',
    8500.00,
    772.73,
    7727.27,
    'approved',
    CURRENT_DATE + INTERVAL '25 days',
    'Full roof restoration including cleaning, rebedding, and repointing',
    NOW() - INTERVAL '8 days'
  ),
  (
    'QTE-20251112-003',
    'Olivia Martin',
    'olivia.m.test@example.com',
    '0435900708',
    '88 Storm Crescent, Dandenong VIC 3175',
    'Dandenong',
    'metal',
    'damaged',
    'Emergency Repair',
    3200.00,
    290.91,
    2909.09,
    'sent',
    CURRENT_DATE + INTERVAL '29 days',
    'Emergency storm damage repair - includes tarp and temporary protection',
    NOW() - INTERVAL '5 hours'
  )
ON CONFLICT (quote_number) DO NOTHING;

-- Sample Quote Line Items
-- ============================================================================
-- Get quote IDs for line items
DO $$
DECLARE
  v_quote_id_001 uuid;
  v_quote_id_002 uuid;
  v_quote_id_003 uuid;
BEGIN
  -- Get quote IDs
  SELECT id INTO v_quote_id_001 FROM quotes WHERE quote_number = 'QTE-20251112-001';
  SELECT id INTO v_quote_id_002 FROM quotes WHERE quote_number = 'QTE-20251112-002';
  SELECT id INTO v_quote_id_003 FROM quotes WHERE quote_number = 'QTE-20251112-003';

  -- Quote 001 Line Items (Leak Repair)
  IF v_quote_id_001 IS NOT NULL THEN
    INSERT INTO quote_line_items (quote_id, item_type, description, quantity, unit, unit_price, total_price, notes) VALUES
      (v_quote_id_001, 'labour', 'Leak detection and diagnosis', 2.00, 'hours', 85.00, 170.00, 'Inspector rate'),
      (v_quote_id_001, 'labour', 'Roof valley repair', 4.00, 'hours', 65.00, 260.00, 'Crew rate'),
      (v_quote_id_001, 'materials', 'Valley flashing replacement', 3.00, 'linear_metres', 45.00, 135.00, 'Colorbond steel'),
      (v_quote_id_001, 'materials', 'Sealant and adhesive', 1.00, 'item', 75.00, 75.00, 'Premium roof sealant'),
      (v_quote_id_001, 'materials', 'Replacement tiles', 12.00, 'item', 8.50, 102.00, 'Terracotta tiles')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Quote 002 Line Items (Roof Restoration)
  IF v_quote_id_002 IS NOT NULL THEN
    INSERT INTO quote_line_items (quote_id, item_type, description, quantity, unit, unit_price, total_price, notes) VALUES
      (v_quote_id_002, 'labour', 'High-pressure cleaning', 6.00, 'hours', 65.00, 390.00, 'Full roof clean'),
      (v_quote_id_002, 'labour', 'Rebedding ridges', 8.00, 'hours', 65.00, 520.00, 'Ridge cap replacement'),
      (v_quote_id_002, 'labour', 'Repointing ridges', 6.00, 'hours', 65.00, 390.00, 'Mortar repointing'),
      (v_quote_id_002, 'materials', 'Bedding compound', 4.00, 'bags', 35.00, 140.00, 'Cement-based bedding'),
      (v_quote_id_002, 'materials', 'Pointing compound', 3.00, 'bags', 42.00, 126.00, 'Flexible pointing mortar'),
      (v_quote_id_002, 'materials', 'Ridge caps', 20.00, 'item', 12.50, 250.00, 'Terracotta ridge tiles'),
      (v_quote_id_002, 'materials', 'Roof sealer', 15.00, 'litres', 25.00, 375.00, 'UV-resistant roof sealer')
    ON CONFLICT DO NOTHING;
  END IF;

  -- Quote 003 Line Items (Emergency Repair)
  IF v_quote_id_003 IS NOT NULL THEN
    INSERT INTO quote_line_items (quote_id, item_type, description, quantity, unit, unit_price, total_price, notes) VALUES
      (v_quote_id_003, 'labour', 'Emergency callout', 1.00, 'item', 250.00, 250.00, 'After-hours emergency service'),
      (v_quote_id_003, 'labour', 'Temporary tarp installation', 3.00, 'hours', 97.50, 292.50, 'Emergency rate (1.5x)'),
      (v_quote_id_003, 'labour', 'Permanent repair', 8.00, 'hours', 65.00, 520.00, 'Metal sheet replacement'),
      (v_quote_id_003, 'materials', 'Heavy-duty tarp', 1.00, 'item', 180.00, 180.00, '6m x 4m tarp'),
      (v_quote_id_003, 'materials', 'Colorbond sheets', 4.00, 'sheets', 120.00, 480.00, 'Monument colour'),
      (v_quote_id_003, 'materials', 'Fixing screws and washers', 1.00, 'box', 45.00, 45.00, 'Roofing screws')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Sample Jobs (Converted Quotes)
-- ============================================================================
DO $$
DECLARE
  v_quote_id_002 uuid;
BEGIN
  SELECT id INTO v_quote_id_002 FROM quotes WHERE quote_number = 'QTE-20251112-002';

  IF v_quote_id_002 IS NOT NULL THEN
    INSERT INTO jobs (
      quote_id,
      job_number,
      customer_name,
      property_address,
      suburb,
      service_type,
      status,
      scheduled_date,
      assigned_crew,
      total_value,
      deposit_paid,
      final_payment_received,
      warranty_years,
      notes,
      created_at
    ) VALUES (
      v_quote_id_002,
      'JOB-20251112-001',
      'Jessica Taylor',
      '15 Oak Avenue, Officer VIC 3809',
      'Officer',
      'Roof Restoration',
      'scheduled',
      CURRENT_DATE + INTERVAL '5 days',
      'Kaid + Crew',
      8500.00,
      true,
      false,
      10,
      '30% deposit received ($2,550). Job scheduled for next Tuesday.',
      NOW() - INTERVAL '5 days'
    )
    ON CONFLICT (job_number) DO NOTHING;
  END IF;
END $$;

-- Sample Test User Role (for development authentication)
-- ============================================================================
-- NOTE: Replace {ADMIN_USER_ID} with actual auth.users UUID after first login
-- This is commented out by default to prevent errors
/*
INSERT INTO user_roles (user_id, role) VALUES
  ('{ADMIN_USER_ID}', 'admin'),
  ('{ADMIN_USER_ID}', 'inspector')
ON CONFLICT (user_id, role) DO NOTHING;
*/

-- ============================================================================
-- Verification Queries
-- ============================================================================
-- Uncomment to verify sample data was created successfully:

-- SELECT COUNT(*) as test_leads_count FROM leads WHERE source = 'test_data';
-- SELECT COUNT(*) as test_quotes_count FROM quotes WHERE quote_number LIKE 'QTE-20251112-%';
-- SELECT COUNT(*) as test_quote_items_count FROM quote_line_items;
-- SELECT COUNT(*) as test_jobs_count FROM jobs WHERE job_number LIKE 'JOB-20251112-%';

-- ============================================================================
-- End of Sample Data Seeding
-- ============================================================================
