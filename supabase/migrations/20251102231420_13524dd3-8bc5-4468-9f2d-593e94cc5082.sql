-- Add notion_sync_id columns to operational tables
ALTER TABLE leads ADD COLUMN IF NOT EXISTS notion_sync_id TEXT;
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS notion_sync_id TEXT;
ALTER TABLE inspection_reports ADD COLUMN IF NOT EXISTS notion_sync_id TEXT;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS notion_sync_id TEXT;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_notion_sync_id ON leads(notion_sync_id);
CREATE INDEX IF NOT EXISTS idx_quotes_notion_sync_id ON quotes(notion_sync_id);
CREATE INDEX IF NOT EXISTS idx_inspection_reports_notion_sync_id ON inspection_reports(notion_sync_id);
CREATE INDEX IF NOT EXISTS idx_invoices_notion_sync_id ON invoices(notion_sync_id);

-- Create sync_conflicts table for conflict resolution
CREATE TABLE IF NOT EXISTS sync_conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  supabase_value JSONB,
  notion_value JSONB,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on sync_conflicts
ALTER TABLE sync_conflicts ENABLE ROW LEVEL SECURITY;

-- Only admins can view sync conflicts
CREATE POLICY "Admins can view sync conflicts"
ON sync_conflicts FOR SELECT
USING (is_admin_user(auth.uid()));

-- Only admins can manage sync conflicts
CREATE POLICY "Admins can manage sync conflicts"
ON sync_conflicts FOR ALL
USING (is_admin_user(auth.uid()));

-- Create sync_status view for monitoring
CREATE OR REPLACE VIEW sync_status AS
SELECT 
  'leads' as table_name,
  COUNT(*) FILTER (WHERE notion_sync_id IS NOT NULL) as synced_records,
  COUNT(*) FILTER (WHERE notion_sync_id IS NULL) as unsynced_records,
  MAX(updated_at) as last_update
FROM leads
UNION ALL
SELECT 
  'quotes' as table_name,
  COUNT(*) FILTER (WHERE notion_sync_id IS NOT NULL) as synced_records,
  COUNT(*) FILTER (WHERE notion_sync_id IS NULL) as unsynced_records,
  MAX(updated_at) as last_update
FROM quotes
UNION ALL
SELECT 
  'inspection_reports' as table_name,
  COUNT(*) FILTER (WHERE notion_sync_id IS NOT NULL) as synced_records,
  COUNT(*) FILTER (WHERE notion_sync_id IS NULL) as unsynced_records,
  MAX(updated_at) as last_update
FROM inspection_reports
UNION ALL
SELECT 
  'invoices' as table_name,
  COUNT(*) FILTER (WHERE notion_sync_id IS NOT NULL) as synced_records,
  COUNT(*) FILTER (WHERE notion_sync_id IS NULL) as unsynced_records,
  MAX(updated_at) as last_update
FROM invoices;

-- Create trigger functions for real-time push
CREATE OR REPLACE FUNCTION notify_lead_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1/supabase-to-notion-push',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbmt6cHllcHBmZG1yZXNpYW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzU3ODUsImV4cCI6MjA3MjkxMTc4NX0.tt4QYDwOMzNLtz-GCD6H_3vw0sQ78VHOCzobMmKYh2M"}'::jsonb,
    body := jsonb_build_object('action', 'push_lead', 'lead_id', NEW.id::text)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_quote_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1/supabase-to-notion-push',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbmt6cHllcHBmZG1yZXNpYW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzU3ODUsImV4cCI6MjA3MjkxMTc4NX0.tt4QYDwOMzNLtz-GCD6H_3vw0sQ78VHOCzobMmKYh2M"}'::jsonb,
    body := jsonb_build_object('action', 'push_quote', 'quote_id', NEW.id::text)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_job_completed()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    PERFORM net.http_post(
      url := 'https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1/supabase-to-notion-push',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbmt6cHllcHBmZG1yZXNpYW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzU3ODUsImV4cCI6MjA3MjkxMTc4NX0.tt4QYDwOMzNLtz-GCD6H_3vw0sQ78VHOCzobMmKYh2M"}'::jsonb,
      body := jsonb_build_object('action', 'push_job', 'job_id', NEW.id::text)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION notify_invoice_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://vlnkzpyeppfdmresiaoh.supabase.co/functions/v1/supabase-to-notion-push',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbmt6cHllcHBmZG1yZXNpYW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzU3ODUsImV4cCI6MjA3MjkxMTc4NX0.tt4QYDwOMzNLtz-GCD6H_3vw0sQ78VHOCzobMmKYh2M"}'::jsonb,
    body := jsonb_build_object('action', 'push_invoice', 'invoice_id', NEW.id::text)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for real-time push
DROP TRIGGER IF EXISTS lead_created_trigger ON leads;
CREATE TRIGGER lead_created_trigger
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION notify_lead_created();

DROP TRIGGER IF EXISTS quote_created_trigger ON quotes;
CREATE TRIGGER quote_created_trigger
AFTER INSERT ON quotes
FOR EACH ROW
EXECUTE FUNCTION notify_quote_created();

DROP TRIGGER IF EXISTS job_completed_trigger ON inspection_reports;
CREATE TRIGGER job_completed_trigger
AFTER UPDATE ON inspection_reports
FOR EACH ROW
EXECUTE FUNCTION notify_job_completed();

DROP TRIGGER IF EXISTS invoice_created_trigger ON invoices;
CREATE TRIGGER invoice_created_trigger
AFTER INSERT ON invoices
FOR EACH ROW
EXECUTE FUNCTION notify_invoice_created();