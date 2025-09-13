-- Create storage bucket for media files
INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);

-- Create pages table for content management
CREATE TABLE public.pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_description TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create media table for image/file management
CREATE TABLE public.media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  alt_text TEXT,
  caption TEXT,
  bucket_name TEXT NOT NULL DEFAULT 'media',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create social media posts table
CREATE TABLE public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL, -- 'facebook', 'instagram'
  content TEXT NOT NULL,
  media_ids UUID[] DEFAULT '{}',
  post_id TEXT, -- Platform's post ID after publishing
  status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'scheduled', 'published', 'failed'
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

-- Admin access policies (allow full access for authenticated admin users)
CREATE POLICY "Admin can manage pages" ON public.pages FOR ALL USING (true);
CREATE POLICY "Admin can manage media" ON public.media FOR ALL USING (true);
CREATE POLICY "Admin can manage social posts" ON public.social_posts FOR ALL USING (true);

-- Public read access for published pages
CREATE POLICY "Public can read published pages" ON public.pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public can read active media" ON public.media FOR SELECT USING (is_active = true);

-- Storage policies for media bucket
CREATE POLICY "Admin can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'media');
CREATE POLICY "Admin can update media" ON storage.objects FOR UPDATE USING (bucket_id = 'media');
CREATE POLICY "Admin can delete media" ON storage.objects FOR DELETE USING (bucket_id = 'media');
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'media');

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON public.media FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_social_posts_updated_at BEFORE UPDATE ON public.social_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial page data for existing pages
INSERT INTO public.pages (slug, title, meta_description, content) VALUES 
('home', 'Call Kaids Roofing - Professional Roofing Services Melbourne', 'Melbourne''s premier roofing service. Quality workmanship, 10-year warranty, owner-operated business serving Southeast Melbourne.', '{}'),
('about', 'About Kaidyn - Call Kaids Roofing Owner', 'Meet Kaidyn Brownlie, owner of Call Kaids Roofing. Professional roofing expert serving Southeast Melbourne with quality workmanship.', '{}'),
('contact', 'Contact Call Kaids Roofing - Free Roof Health Check', 'Contact Call Kaids Roofing for your free roof health check. Professional roofing services in Southeast Melbourne.', '{}'),
('gallery', 'Roof Restoration Gallery - Before & After Photos', 'View our roof restoration gallery showcasing quality workmanship and amazing transformations across Southeast Melbourne.', '{}'),
('services/roof-restoration', 'Roof Restoration Melbourne - Call Kaids Roofing', 'Professional roof restoration services in Melbourne. 10-year warranty, quality materials, expert workmanship.', '{}'),
('services/roof-painting', 'Roof Painting Melbourne - Call Kaids Roofing', 'Expert roof painting services in Melbourne. Premium coatings, 10-year warranty, professional application.', '{}'),
('services/roof-repairs', 'Roof Repairs Melbourne - Call Kaids Roofing', 'Professional roof repair services in Melbourne. Emergency repairs, quality workmanship, 10-year warranty.', '{}'),
('services/gutter-cleaning', 'Gutter Cleaning Melbourne - Call Kaids Roofing', 'Professional gutter cleaning services in Melbourne. Complete gutter maintenance and repair services.', '{}');