-- Fix Inspection Photos Storage Bucket Policies
-- Remove all overly permissive "Anyone can..." policies that allow unauthenticated access

-- Drop the dangerous public policies
DROP POLICY IF EXISTS "Anyone can delete inspection photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update inspection photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view inspection photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload inspection photos" ON storage.objects;

-- Drop duplicate broad authenticated policies if they exist
DROP POLICY IF EXISTS "Authenticated users can delete inspection photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update inspection photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view inspection photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload inspection photos" ON storage.objects;

-- The role-based policies should already exist from previous migrations
-- If they don't exist, this will log a notice but won't fail
DO $$
BEGIN
  -- Verify role-based policies exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Only inspectors can upload inspection photos'
  ) THEN
    RAISE NOTICE 'Role-based upload policy missing - may need manual creation';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Only inspectors can view inspection photos'
  ) THEN
    RAISE NOTICE 'Role-based view policy missing - may need manual creation';
  END IF;
END $$;