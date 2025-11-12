-- Fix storage RLS policies for media bucket to allow authenticated uploads
-- Drop overly restrictive admin-only policies
DROP POLICY IF EXISTS "Admin can upload media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete media" ON storage.objects;
DROP POLICY IF EXISTS "Public can view media" ON storage.objects;

-- Create proper policies for media bucket
-- Allow authenticated users to upload to media bucket
CREATE POLICY "Authenticated users can upload to media bucket"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update media bucket"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Allow authenticated users to delete from media bucket
CREATE POLICY "Authenticated users can delete from media bucket"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');

-- Allow everyone to view media bucket (public bucket)
CREATE POLICY "Public can view media bucket"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');