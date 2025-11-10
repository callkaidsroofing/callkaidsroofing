-- Update knowledge-uploads bucket to allow ZIP files and increase size limit
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY[
    'text/markdown',
    'text/plain', 
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed'
  ],
  file_size_limit = 104857600 -- 100MB limit
WHERE id = 'knowledge-uploads';
