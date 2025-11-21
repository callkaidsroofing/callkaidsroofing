-- Create knowledge_uploads storage bucket for incoming files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'knowledge-uploads',
  'knowledge-uploads',
  false,
  52428800, -- 50MB limit
  ARRAY['text/markdown', 'text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload knowledge files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'knowledge-uploads');

-- RLS Policy: Authenticated users can view their uploads
CREATE POLICY "Users can view knowledge uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'knowledge-uploads');

-- RLS Policy: Admins can delete uploads
CREATE POLICY "Admins can delete knowledge uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'knowledge-uploads' 
  AND EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create upload tracking table
CREATE TABLE IF NOT EXISTS public.knowledge_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_path TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  
  -- Processing metadata
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, completed, failed
  processing_started_at TIMESTAMPTZ,
  processing_completed_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Extracted metadata
  detected_category TEXT,
  detected_doc_type TEXT,
  detected_priority INTEGER,
  doc_count INTEGER DEFAULT 0,
  
  -- Generated doc_ids
  generated_doc_ids TEXT[],
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for knowledge_uploads
CREATE POLICY "Users can view their uploads"
ON public.knowledge_uploads
FOR SELECT
TO authenticated
USING (uploaded_by = auth.uid() OR EXISTS (
  SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'
));

CREATE POLICY "Authenticated users can create uploads"
ON public.knowledge_uploads
FOR INSERT
TO authenticated
WITH CHECK (uploaded_by = auth.uid());

CREATE POLICY "System can update uploads"
ON public.knowledge_uploads
FOR UPDATE
TO authenticated
USING (true);

-- Trigger for updated_at
CREATE TRIGGER set_knowledge_uploads_updated_at
BEFORE UPDATE ON public.knowledge_uploads
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create index for status queries
CREATE INDEX idx_knowledge_uploads_status ON public.knowledge_uploads(status);
CREATE INDEX idx_knowledge_uploads_user ON public.knowledge_uploads(uploaded_by);