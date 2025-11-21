-- Create RAG views for unified content search (corrected all column names)

-- Services view (uses 'name' not 'title')
CREATE OR REPLACE VIEW content_services_view_for_rag AS
SELECT 
  id,
  slug as source_id,
  name as title,
  COALESCE(full_description, short_description, '') as content,
  jsonb_build_object(
    'category', 'service',
    'slug', slug,
    'service_category', service_category,
    'created_at', created_at
  ) as metadata
FROM content_services;

-- Case studies view (uses 'study_id' and different field names)
CREATE OR REPLACE VIEW content_case_studies_view_for_rag AS
SELECT 
  id,
  slug as source_id,
  job_type as title,
  COALESCE(
    client_problem || ' ' || solution_provided || ' ' || key_outcome,
    client_problem || ' ' || solution_provided,
    client_problem,
    ''
  ) as content,
  jsonb_build_object(
    'category', 'case_study',
    'job_type', job_type,
    'suburb', suburb,
    'slug', slug,
    'created_at', created_at
  ) as metadata
FROM content_case_studies;

-- Blog posts view (has title field)
CREATE OR REPLACE VIEW content_blog_posts_view_for_rag AS
SELECT 
  id,
  slug as source_id,
  title,
  COALESCE(excerpt || ' ' || content, excerpt, content, '') as content,
  jsonb_build_object(
    'category', 'blog',
    'slug', slug,
    'author', author,
    'created_at', created_at,
    'tags', tags
  ) as metadata
FROM content_blog_posts;

-- Pages view (uses 'page_title' and content_blocks is jsonb)
CREATE OR REPLACE VIEW content_pages_view_for_rag AS
SELECT 
  id,
  page_slug as source_id,
  page_title as title,
  COALESCE(content_blocks::text, '') as content,
  jsonb_build_object(
    'category', 'page',
    'slug', page_slug,
    'created_at', created_at
  ) as metadata
FROM content_pages
WHERE published = true;

-- Master knowledge view (uses 'active' not 'is_active')
CREATE OR REPLACE VIEW master_knowledge_view_for_rag AS
SELECT 
  id,
  doc_id as source_id,
  title,
  content,
  jsonb_build_object(
    'category', category,
    'doc_id', doc_id,
    'version', version,
    'created_at', created_at
  ) as metadata
FROM master_knowledge
WHERE active = true;