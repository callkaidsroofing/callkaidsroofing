-- Create content_gallery table for managing before/after images
CREATE TABLE public.content_gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('before', 'after', 'progress', 'general')),
  pair_id TEXT,
  job_type TEXT,
  suburb TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  case_study_id UUID REFERENCES public.content_case_studies(id) ON DELETE SET NULL,
  notion_id TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  meta_title TEXT,
  meta_description TEXT
);

-- Create indexes for gallery
CREATE INDEX idx_content_gallery_category ON public.content_gallery(category);
CREATE INDEX idx_content_gallery_case_study ON public.content_gallery(case_study_id);
CREATE INDEX idx_content_gallery_featured ON public.content_gallery(featured);
CREATE INDEX idx_content_gallery_pair ON public.content_gallery(pair_id);

-- Enable RLS
ALTER TABLE public.content_gallery ENABLE ROW LEVEL SECURITY;

-- Gallery RLS policies
CREATE POLICY "Public can view gallery"
  ON public.content_gallery
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage gallery"
  ON public.content_gallery
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Create content_pages table for static page management
CREATE TABLE public.content_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  page_title TEXT NOT NULL,
  content_blocks JSONB DEFAULT '[]'::jsonb,
  meta_title TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  notion_id TEXT,
  last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for pages
CREATE INDEX idx_content_pages_slug ON public.content_pages(page_slug);
CREATE INDEX idx_content_pages_published ON public.content_pages(published);

-- Enable RLS
ALTER TABLE public.content_pages ENABLE ROW LEVEL SECURITY;

-- Pages RLS policies
CREATE POLICY "Public can view published pages"
  ON public.content_pages
  FOR SELECT
  USING (published = true);

CREATE POLICY "Admins can manage pages"
  ON public.content_pages
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Create content_relationships table for linking content
CREATE TABLE public.content_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_type TEXT NOT NULL CHECK (source_type IN ('blog', 'service', 'case_study', 'suburb', 'gallery', 'testimonial')),
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('blog', 'service', 'case_study', 'suburb', 'gallery', 'testimonial')),
  target_id UUID NOT NULL,
  relationship_type TEXT DEFAULT 'related',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for relationships
CREATE INDEX idx_content_relationships_source ON public.content_relationships(source_type, source_id);
CREATE INDEX idx_content_relationships_target ON public.content_relationships(target_type, target_id);

-- Enable RLS
ALTER TABLE public.content_relationships ENABLE ROW LEVEL SECURITY;

-- Relationships RLS policies
CREATE POLICY "Public can view relationships"
  ON public.content_relationships
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage relationships"
  ON public.content_relationships
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- Create content_analytics table for tracking views
CREATE TABLE public.content_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'view',
  session_id TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for analytics
CREATE INDEX idx_content_analytics_content ON public.content_analytics(content_type, content_id);
CREATE INDEX idx_content_analytics_date ON public.content_analytics(created_at DESC);

-- Enable RLS
ALTER TABLE public.content_analytics ENABLE ROW LEVEL SECURITY;

-- Analytics RLS policies
CREATE POLICY "Anyone can insert analytics"
  ON public.content_analytics
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
  ON public.content_analytics
  FOR SELECT
  USING (is_admin_user(auth.uid()));

-- Trigger for updated_at on gallery
CREATE TRIGGER update_content_gallery_updated_at
  BEFORE UPDATE ON public.content_gallery
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on pages
CREATE TRIGGER update_content_pages_updated_at
  BEFORE UPDATE ON public.content_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();