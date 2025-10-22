-- Create tables for Enhanced Plan: AI repo analysis and logging

-- 1) ai_analysis_cache
CREATE TABLE IF NOT EXISTS public.ai_analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_owner TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  branch TEXT,
  path TEXT,
  analysis_type TEXT NOT NULL,
  cache_key TEXT GENERATED ALWAYS AS (
    lower(coalesce(repo_owner,'') || '/' || coalesce(repo_name,'') || '@' || coalesce(branch,'main') || ':' || coalesce(path,'') || '#' || analysis_type)
  ) STORED,
  result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS ai_analysis_cache_cache_key_idx
  ON public.ai_analysis_cache(cache_key);

CREATE INDEX IF NOT EXISTS ai_analysis_cache_repo_idx
  ON public.ai_analysis_cache(repo_owner, repo_name, branch);

ALTER TABLE public.ai_analysis_cache ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_analysis_cache' AND policyname='Admins can view ai analysis cache'
  ) THEN
    CREATE POLICY "Admins can view ai analysis cache"
      ON public.ai_analysis_cache
      FOR SELECT
      USING (is_admin_user(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_analysis_cache' AND policyname='System can insert ai analysis cache'
  ) THEN
    CREATE POLICY "System can insert ai analysis cache"
      ON public.ai_analysis_cache
      FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_analysis_cache' AND policyname='System can update ai analysis cache'
  ) THEN
    CREATE POLICY "System can update ai analysis cache"
      ON public.ai_analysis_cache
      FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- trigger to update updated_at
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname='update_ai_analysis_cache_updated_at'
  ) THEN
    CREATE TRIGGER update_ai_analysis_cache_updated_at
      BEFORE UPDATE ON public.ai_analysis_cache
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 2) github_deployment_log
CREATE TABLE IF NOT EXISTS public.github_deployment_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_owner TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  branch TEXT,
  commit_sha TEXT,
  action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success',
  details JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  initiated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS github_deployment_log_repo_idx
  ON public.github_deployment_log(repo_owner, repo_name, branch, created_at DESC);

ALTER TABLE public.github_deployment_log ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='github_deployment_log' AND policyname='Admins can view deployment logs'
  ) THEN
    CREATE POLICY "Admins can view deployment logs"
      ON public.github_deployment_log
      FOR SELECT
      USING (is_admin_user(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='github_deployment_log' AND policyname='System can insert deployment logs'
  ) THEN
    CREATE POLICY "System can insert deployment logs"
      ON public.github_deployment_log
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

-- 3) security_scan_results
CREATE TABLE IF NOT EXISTS public.security_scan_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  repo_owner TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  branch TEXT,
  scan_type TEXT NOT NULL,
  findings JSONB NOT NULL,
  passed BOOLEAN DEFAULT false,
  score INTEGER,
  initiated_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS security_scan_results_repo_idx
  ON public.security_scan_results(repo_owner, repo_name, branch, created_at DESC);

ALTER TABLE public.security_scan_results ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='security_scan_results' AND policyname='Admins can view security scans'
  ) THEN
    CREATE POLICY "Admins can view security scans"
      ON public.security_scan_results
      FOR SELECT
      USING (is_admin_user(auth.uid()));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='security_scan_results' AND policyname='System can insert security scans'
  ) THEN
    CREATE POLICY "System can insert security scans"
      ON public.security_scan_results
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;