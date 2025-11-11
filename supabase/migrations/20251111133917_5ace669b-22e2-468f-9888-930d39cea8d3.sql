-- Create media gallery table for all images
CREATE TABLE IF NOT EXISTS public.media_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Image details
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  
  -- Categorization
  category TEXT, -- 'project', 'team', 'equipment', 'testimonial', 'general'
  tags TEXT[],
  
  -- Display control
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  
  -- Where to show this image
  show_on_homepage BOOLEAN DEFAULT false,
  show_on_about BOOLEAN DEFAULT false,
  show_on_services BOOLEAN DEFAULT false,
  show_on_portfolio BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.media_gallery ENABLE ROW LEVEL SECURITY;

-- Public can view active images
CREATE POLICY "Anyone can view active media"
  ON public.media_gallery
  FOR SELECT
  USING (is_active = true);

-- Authenticated users can manage all media
CREATE POLICY "Authenticated users can manage media"
  ON public.media_gallery
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create index for faster queries
CREATE INDEX idx_media_gallery_active ON public.media_gallery(is_active);
CREATE INDEX idx_media_gallery_category ON public.media_gallery(category);
CREATE INDEX idx_media_gallery_homepage ON public.media_gallery(show_on_homepage) WHERE show_on_homepage = true;

-- Updated at trigger
CREATE TRIGGER update_media_gallery_updated_at
  BEFORE UPDATE ON public.media_gallery
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();