-- Phase 1-4: Complete autonomous AI system database setup

-- User learning & preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  preference_type TEXT NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own preferences"
ON public.user_preferences
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- AI optimization tracking
CREATE TABLE IF NOT EXISTS public.ai_optimization_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_name TEXT NOT NULL,
  version TEXT NOT NULL,
  optimization_type TEXT NOT NULL,
  before_metrics JSONB DEFAULT '{}'::jsonb,
  after_metrics JSONB DEFAULT '{}'::jsonb,
  prompt_changes JSONB DEFAULT '{}'::jsonb,
  performance_delta NUMERIC,
  applied_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_optimization_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view optimization history"
ON public.ai_optimization_history
FOR SELECT
USING (is_admin_user(auth.uid()));

CREATE POLICY "System can insert optimization history"
ON public.ai_optimization_history
FOR INSERT
WITH CHECK (true);

-- Content generation queue
CREATE TABLE IF NOT EXISTS public.content_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type TEXT NOT NULL,
  generated_content JSONB NOT NULL,
  ai_confidence_score NUMERIC,
  status TEXT DEFAULT 'pending_review',
  reviewed_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.content_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage content queue"
ON public.content_queue
FOR ALL
USING (is_admin_user(auth.uid()))
WITH CHECK (is_admin_user(auth.uid()));

-- AI action audit log
CREATE TABLE IF NOT EXISTS public.ai_action_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  intent TEXT,
  user_message TEXT,
  execution_plan JSONB,
  tools_used TEXT[],
  action_details JSONB DEFAULT '{}'::jsonb,
  results JSONB,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  cost_usd NUMERIC(10,4),
  execution_time_ms INTEGER,
  approved_at TIMESTAMPTZ,
  executed_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.ai_action_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI actions"
ON public.ai_action_log
FOR SELECT
USING (auth.uid() = user_id OR is_admin_user(auth.uid()));

CREATE POLICY "System can insert AI actions"
ON public.ai_action_log
FOR INSERT
WITH CHECK (true);

-- Geographic analytics
CREATE TABLE IF NOT EXISTS public.suburb_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  suburb TEXT NOT NULL,
  metrics JSONB DEFAULT '{}'::jsonb,
  calculated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.suburb_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view suburb analytics"
ON public.suburb_analytics
FOR SELECT
USING (is_admin_user(auth.uid()));

CREATE POLICY "System can manage suburb analytics"
ON public.suburb_analytics
FOR ALL
WITH CHECK (true);

-- Add AI fields to existing leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 10),
ADD COLUMN IF NOT EXISTS ai_tags JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS service_area_match BOOLEAN,
ADD COLUMN IF NOT EXISTS auto_enriched_at TIMESTAMPTZ;

-- Monitoring logs table
CREATE TABLE IF NOT EXISTS public.monitoring_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.monitoring_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view monitoring logs"
ON public.monitoring_logs
FOR SELECT
USING (is_admin_user(auth.uid()));

CREATE POLICY "System can insert monitoring logs"
ON public.monitoring_logs
FOR INSERT
WITH CHECK (true);

-- Create updated_at triggers
CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_queue_updated_at
BEFORE UPDATE ON public.content_queue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();