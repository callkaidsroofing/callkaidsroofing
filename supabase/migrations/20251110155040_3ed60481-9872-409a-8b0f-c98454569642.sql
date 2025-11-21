-- Knowledge File Version Control
CREATE TABLE IF NOT EXISTS public.knowledge_file_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES public.knowledge_files(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  change_summary TEXT,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.knowledge_file_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage file versions"
  ON public.knowledge_file_versions FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Inspectors can view file versions"
  ON public.knowledge_file_versions FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_knowledge_file_versions_file_id 
  ON public.knowledge_file_versions(file_id);

CREATE INDEX IF NOT EXISTS idx_knowledge_file_versions_created_at 
  ON public.knowledge_file_versions(created_at DESC);

-- Sync Rules for KB <-> Operational Data
CREATE TABLE IF NOT EXISTS public.sync_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT NOT NULL,
  source_table TEXT NOT NULL,
  target_doc_id TEXT NOT NULL,
  sync_direction TEXT NOT NULL CHECK (sync_direction IN ('to_kb', 'from_kb', 'bidirectional')),
  sync_query TEXT,
  transform_logic JSONB DEFAULT '{}'::jsonb,
  last_synced_at TIMESTAMPTZ,
  next_sync_at TIMESTAMPTZ,
  sync_interval_minutes INTEGER DEFAULT 1440,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.sync_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage sync rules"
  ON public.sync_rules FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Inspectors can view sync rules"
  ON public.sync_rules FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_sync_rules_source_table 
  ON public.sync_rules(source_table);

CREATE INDEX IF NOT EXISTS idx_sync_rules_next_sync 
  ON public.sync_rules(next_sync_at) WHERE active = true;

CREATE TRIGGER update_sync_rules_updated_at
  BEFORE UPDATE ON public.sync_rules
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Conflict Resolution Log
CREATE TABLE IF NOT EXISTS public.conflict_resolutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id UUID REFERENCES public.knowledge_files(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL CHECK (conflict_type IN ('content', 'schema', 'version', 'sync')),
  original_content TEXT,
  proposed_content TEXT,
  merged_content TEXT,
  ai_recommendation JSONB,
  ai_conversation JSONB DEFAULT '[]'::jsonb,
  resolution_strategy TEXT CHECK (resolution_strategy IN ('keep_original', 'accept_proposed', 'merge', 'manual')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'cancelled')),
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.conflict_resolutions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage conflict resolutions"
  ON public.conflict_resolutions FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Inspectors can view conflict resolutions"
  ON public.conflict_resolutions FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_conflict_resolutions_file_id 
  ON public.conflict_resolutions(file_id);

CREATE INDEX IF NOT EXISTS idx_conflict_resolutions_status 
  ON public.conflict_resolutions(status) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_conflict_resolutions_created_at 
  ON public.conflict_resolutions(created_at DESC);