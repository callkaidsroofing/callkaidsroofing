-- Add indexes for advanced search and performance
CREATE INDEX IF NOT EXISTS idx_leads_ai_score ON leads(ai_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_suburb_service ON leads(suburb, service);
CREATE INDEX IF NOT EXISTS idx_leads_created_status ON leads(created_at DESC, status);
CREATE INDEX IF NOT EXISTS idx_quote_emails_tracking ON quote_emails(quote_id, viewed_at);
CREATE INDEX IF NOT EXISTS idx_leads_updated_at ON leads(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- Add columns for lead merging tracking
ALTER TABLE leads ADD COLUMN IF NOT EXISTS merged_into_lead_id UUID REFERENCES leads(id);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS merge_status TEXT DEFAULT 'active';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS merge_history JSONB DEFAULT '[]'::jsonb;

-- Add columns for quote email engagement tracking
ALTER TABLE quote_emails ADD COLUMN IF NOT EXISTS click_count INTEGER DEFAULT 0;
ALTER TABLE quote_emails ADD COLUMN IF NOT EXISTS engagement_score INTEGER;
ALTER TABLE quote_emails ADD COLUMN IF NOT EXISTS clicks_data JSONB DEFAULT '[]'::jsonb;

-- Add column for job scheduling
ALTER TABLE inspection_reports ADD COLUMN IF NOT EXISTS scheduled_date DATE;
ALTER TABLE inspection_reports ADD COLUMN IF NOT EXISTS estimated_duration_hours NUMERIC;
ALTER TABLE inspection_reports ADD COLUMN IF NOT EXISTS assigned_crew TEXT[];
ALTER TABLE inspection_reports ADD COLUMN IF NOT EXISTS job_checklist JSONB DEFAULT '[]'::jsonb;

-- Create index for scheduling conflict checks
CREATE INDEX IF NOT EXISTS idx_inspection_scheduled_date ON inspection_reports(scheduled_date) WHERE scheduled_date IS NOT NULL;