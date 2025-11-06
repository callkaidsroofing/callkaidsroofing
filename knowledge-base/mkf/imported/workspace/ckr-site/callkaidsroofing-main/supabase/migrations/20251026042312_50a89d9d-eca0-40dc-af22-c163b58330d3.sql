-- Create social_posts table for managing all social media content
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'google_business_profile')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  variant TEXT CHECK (variant IN ('PAS', 'AIDA', 'Trust', 'custom')),
  image_url TEXT,
  scheduled_for TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  post_id TEXT, -- Platform-specific post ID after publishing
  error_message TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create post_engagement table for tracking performance metrics
CREATE TABLE IF NOT EXISTS public.post_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.social_posts(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  engagement_rate NUMERIC GENERATED ALWAYS AS (
    CASE 
      WHEN reach > 0 THEN ((likes + (comments * 3) + (shares * 5))::NUMERIC / reach) * 100
      ELSE 0
    END
  ) STORED,
  fetched_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on social_posts
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can manage social posts" ON public.social_posts;

-- Admins can manage all social posts
CREATE POLICY "Admins can manage social posts"
  ON public.social_posts
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Enable RLS on post_engagement
ALTER TABLE public.post_engagement ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view engagement data" ON public.post_engagement;
DROP POLICY IF EXISTS "System can insert engagement data" ON public.post_engagement;

-- Admins can view engagement data
CREATE POLICY "Admins can view engagement data"
  ON public.post_engagement
  FOR SELECT
  USING (is_admin_user(auth.uid()));

-- System can insert engagement data
CREATE POLICY "System can insert engagement data"
  ON public.post_engagement
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_posts_scheduled ON public.social_posts(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON public.social_posts(platform);
CREATE INDEX IF NOT EXISTS idx_post_engagement_post_id ON public.post_engagement(post_id);

-- Add updated_at trigger (drop first if exists)
DROP TRIGGER IF EXISTS update_social_posts_updated_at ON public.social_posts;
CREATE TRIGGER update_social_posts_updated_at
  BEFORE UPDATE ON public.social_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();