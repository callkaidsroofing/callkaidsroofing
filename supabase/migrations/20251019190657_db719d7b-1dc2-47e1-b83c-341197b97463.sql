-- Enhanced chatbot system tables

-- Add columns to chat_conversations for advanced features
ALTER TABLE chat_conversations
ADD COLUMN IF NOT EXISTS uploaded_files jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS analysis_results jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS lead_captured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS lead_id uuid REFERENCES leads(id);

-- Create table for tracking chat analytics
CREATE TABLE IF NOT EXISTS chat_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create table for voice transcriptions
CREATE TABLE IF NOT EXISTS voice_transcriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE,
  audio_url text NOT NULL,
  transcript text NOT NULL,
  duration_seconds numeric,
  created_at timestamptz DEFAULT now()
);

-- Create table for image analyses
CREATE TABLE IF NOT EXISTS image_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES chat_conversations(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  analysis_type text NOT NULL, -- 'roof_condition', 'competitor_quote', 'damage_assessment'
  analysis_result jsonb NOT NULL,
  confidence_score numeric,
  created_at timestamptz DEFAULT now()
);

-- Create table for generated PDFs
CREATE TABLE IF NOT EXISTS generated_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type text NOT NULL, -- 'inspection', 'quote', 'closeout'
  related_id uuid, -- inspection_report_id or quote_id
  file_path text NOT NULL,
  generated_by uuid,
  created_at timestamptz DEFAULT now()
);

-- Create table for quick commands (internal chatbot)
CREATE TABLE IF NOT EXISTS chat_commands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command text NOT NULL UNIQUE,
  description text NOT NULL,
  handler_type text NOT NULL, -- 'inspection', 'quote', 'closeout', 'sop_lookup'
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Insert default commands
INSERT INTO chat_commands (command, description, handler_type) VALUES
  ('/inspect', 'Start site inspection checklist', 'inspection'),
  ('/quote', 'Generate client quote', 'quote'),
  ('/closeout', 'Trigger proof package and archive job', 'closeout'),
  ('/sop', 'Search SOP documentation', 'sop_lookup'),
  ('/activate', 'Activate job and create tasks', 'job_activation')
ON CONFLICT (command) DO NOTHING;

-- Enable RLS
ALTER TABLE chat_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_commands ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_analytics
CREATE POLICY "Admins can view all chat analytics"
  ON chat_analytics FOR SELECT
  USING (is_admin_user(auth.uid()));

CREATE POLICY "Anyone can insert analytics"
  ON chat_analytics FOR INSERT
  WITH CHECK (true);

-- RLS Policies for voice_transcriptions
CREATE POLICY "Inspectors can view voice transcriptions"
  ON voice_transcriptions FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE POLICY "Inspectors can create voice transcriptions"
  ON voice_transcriptions FOR INSERT
  WITH CHECK (is_inspector(auth.uid()));

-- RLS Policies for image_analyses
CREATE POLICY "Anyone can create image analyses"
  ON image_analyses FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Inspectors can view image analyses"
  ON image_analyses FOR SELECT
  USING (is_inspector(auth.uid()));

-- RLS Policies for generated_reports
CREATE POLICY "Inspectors can view generated reports"
  ON generated_reports FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE POLICY "Inspectors can create reports"
  ON generated_reports FOR INSERT
  WITH CHECK (is_inspector(auth.uid()));

-- RLS Policies for chat_commands
CREATE POLICY "Everyone can view active commands"
  ON chat_commands FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage commands"
  ON chat_commands FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_analytics_conversation 
  ON chat_analytics(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_analytics_type 
  ON chat_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_voice_transcriptions_conversation 
  ON voice_transcriptions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_image_analyses_conversation 
  ON image_analyses(conversation_id);
CREATE INDEX IF NOT EXISTS idx_image_analyses_type 
  ON image_analyses(analysis_type);
CREATE INDEX IF NOT EXISTS idx_generated_reports_type 
  ON generated_reports(report_type);
CREATE INDEX IF NOT EXISTS idx_generated_reports_related 
  ON generated_reports(related_id);