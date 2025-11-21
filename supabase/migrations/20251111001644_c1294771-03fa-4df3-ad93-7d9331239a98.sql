-- Create workflow_automations table for GWA workflows
CREATE TABLE public.workflow_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gwa_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  version TEXT,
  objective TEXT,
  trigger_type TEXT,
  trigger_criteria JSONB DEFAULT '{}'::jsonb,
  workflow_steps JSONB DEFAULT '[]'::jsonb,
  dependencies JSONB DEFAULT '[]'::jsonb,
  success_metrics JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create brand_assets table for dynamic brand configuration
CREATE TABLE public.brand_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type TEXT NOT NULL,
  key TEXT NOT NULL,
  value JSONB NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(asset_type, key)
);

-- Create knowledge_file_metadata table for KF tracking
CREATE TABLE public.knowledge_file_metadata (
  kf_id TEXT PRIMARY KEY,
  version TEXT,
  title TEXT NOT NULL,
  purpose TEXT,
  last_updated DATE,
  review_cadence TEXT,
  dependencies TEXT[] DEFAULT '{}',
  master_knowledge_ids UUID[] DEFAULT '{}',
  file_path TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Extend master_knowledge table with blueprint-specific fields
ALTER TABLE public.master_knowledge 
ADD COLUMN IF NOT EXISTS kf_id TEXT,
ADD COLUMN IF NOT EXISTS section TEXT,
ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 0;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_workflow_automations_gwa_id ON public.workflow_automations(gwa_id);
CREATE INDEX IF NOT EXISTS idx_workflow_automations_status ON public.workflow_automations(status);
CREATE INDEX IF NOT EXISTS idx_brand_assets_type_key ON public.brand_assets(asset_type, key);
CREATE INDEX IF NOT EXISTS idx_master_knowledge_kf_id ON public.master_knowledge(kf_id);
CREATE INDEX IF NOT EXISTS idx_master_knowledge_section ON public.master_knowledge(section);
CREATE INDEX IF NOT EXISTS idx_master_knowledge_priority ON public.master_knowledge(priority DESC);

-- Enable RLS
ALTER TABLE public.workflow_automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_file_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workflow_automations
CREATE POLICY "Admins can manage workflows"
  ON public.workflow_automations
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Inspectors can view workflows"
  ON public.workflow_automations
  FOR SELECT
  USING (is_inspector(auth.uid()));

-- RLS Policies for brand_assets
CREATE POLICY "Admins can manage brand assets"
  ON public.brand_assets
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Public can view active brand assets"
  ON public.brand_assets
  FOR SELECT
  USING (active = true);

-- RLS Policies for knowledge_file_metadata
CREATE POLICY "Admins can manage knowledge file metadata"
  ON public.knowledge_file_metadata
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Inspectors can view knowledge file metadata"
  ON public.knowledge_file_metadata
  FOR SELECT
  USING (is_inspector(auth.uid()));

-- Add triggers for updated_at
CREATE TRIGGER update_workflow_automations_updated_at
  BEFORE UPDATE ON public.workflow_automations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_brand_assets_updated_at
  BEFORE UPDATE ON public.brand_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_knowledge_file_metadata_updated_at
  BEFORE UPDATE ON public.knowledge_file_metadata
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();