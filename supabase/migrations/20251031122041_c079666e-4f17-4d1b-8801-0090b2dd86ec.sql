-- Update CAMPAIGNS table for ad campaigns (Meta Ads, Google Ads)
-- Drop and recreate with proper ad campaign structure

DROP TABLE IF EXISTS public.campaigns CASCADE;

CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('meta_ads', 'google_ads', 'linkedin_ads')),
  objective TEXT NOT NULL CHECK (objective IN ('awareness', 'traffic', 'engagement', 'leads', 'conversions', 'sales')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
  
  -- Budget & Scheduling
  budget_type TEXT CHECK (budget_type IN ('daily', 'lifetime')),
  daily_budget NUMERIC(10,2),
  lifetime_budget NUMERIC(10,2),
  start_date DATE,
  end_date DATE,
  
  -- Targeting
  targeting JSONB DEFAULT '{}',  -- location, demographics, interests, behaviors
  audience_size_estimate TEXT,
  
  -- Ad Creative Assets
  ad_sets JSONB DEFAULT '[]',  -- multiple ad sets within campaign
  ad_creatives JSONB DEFAULT '[]',  -- headlines, descriptions, images, videos
  
  -- Performance Tracking
  metrics JSONB DEFAULT '{}',  -- impressions, clicks, CTR, CPC, conversions, ROAS
  spend_to_date NUMERIC(10,2) DEFAULT 0,
  last_synced_at TIMESTAMPTZ,
  
  -- Platform IDs
  platform_campaign_id TEXT,  -- Meta/Google campaign ID
  
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage ad campaigns"
  ON public.campaigns FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

CREATE POLICY "Inspectors can view campaigns"
  ON public.campaigns FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE TRIGGER campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_campaigns_platform ON public.campaigns(platform);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_start_date ON public.campaigns(start_date DESC);

-- Re-add foreign key to social_posts if it was dropped
ALTER TABLE public.social_posts 
  DROP CONSTRAINT IF EXISTS social_posts_campaign_id_fkey;

-- Social posts are organic content, not linked to ad campaigns