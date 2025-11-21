-- COMPLETE KNOWLEDGE UNIFICATION
-- Eliminate legacy distinctions, consolidate ALL knowledge sources

-- 1. Migrate remaining knowledge_files (all current knowledge)
INSERT INTO public.master_knowledge (doc_id, title, category, doc_type, content, version, metadata, priority, active, source, migration_notes, created_at, updated_at)
SELECT 
  file_key,
  title,
  category,
  'knowledge',
  content,
  version,
  metadata,
  CASE category
    WHEN 'brand' THEN 90
    WHEN 'operations' THEN 80
    WHEN 'compliance' THEN 75
    ELSE 70
  END,
  active,
  'unified',
  'Current knowledge - no legacy distinction',
  created_at,
  updated_at
FROM public.knowledge_files
WHERE active = true
ON CONFLICT (doc_id) DO UPDATE SET
  content = EXCLUDED.content,
  version = EXCLUDED.version,
  updated_at = EXCLUDED.updated_at,
  source = 'unified',
  migration_notes = 'Updated with current knowledge';

-- 2. Migrate content_services into master_knowledge
INSERT INTO public.master_knowledge (
  doc_id, title, category, subcategory, doc_type, content, metadata, priority, active, source, created_at, updated_at
)
SELECT 
  'SVC_' || slug,
  name,
  'operations',
  'services',
  'service_catalog',
  CONCAT(
    '# ', name, E'\n\n',
    COALESCE(short_description, ''), E'\n\n',
    COALESCE(full_description, ''), E'\n\n',
    '## Features\n', COALESCE(array_to_string(features, E'\n- '), ''), E'\n\n',
    '## Pricing\n', COALESCE(pricing_info::text, ''), E'\n\n',
    '## Process Steps\n', COALESCE(process_steps::text, '')
  ),
  jsonb_build_object(
    'slug', slug,
    'category', service_category,
    'tags', service_tags,
    'featured', featured,
    'display_order', display_order
  ),
  85,
  true,
  'unified',
  created_at,
  updated_at
FROM public.content_services
ON CONFLICT (doc_id) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = EXCLUDED.updated_at;

-- 3. Migrate content_suburbs into master_knowledge
INSERT INTO public.master_knowledge (
  doc_id, title, category, subcategory, doc_type, content, metadata, priority, active, source, created_at, updated_at
)
SELECT 
  'SUB_' || slug,
  name,
  'service_areas',
  'suburbs',
  'coverage',
  CONCAT(
    '# ', name, ' - ', COALESCE(postcode, ''), E'\n\n',
    COALESCE(description, ''), E'\n\n',
    '## Region\n', COALESCE(region, ''), E'\n\n',
    '## Services Available\n', COALESCE(array_to_string(services_available, E'\n- '), ''), E'\n\n',
    '## Projects Completed\n', projects_completed, E'\n\n',
    '## Distance from Base\n', COALESCE(distance_from_base::text, 'N/A'), ' km', E'\n\n',
    COALESCE(local_seo_content, '')
  ),
  jsonb_build_object(
    'slug', slug,
    'postcode', postcode,
    'region', region,
    'projects_completed', projects_completed,
    'distance_from_base', distance_from_base
  ),
  80,
  true,
  'unified',
  created_at,
  updated_at
FROM public.content_suburbs
ON CONFLICT (doc_id) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = EXCLUDED.updated_at;

-- 4. Migrate content_case_studies into master_knowledge
INSERT INTO public.master_knowledge (
  doc_id, title, category, subcategory, doc_type, content, metadata, priority, active, source, created_at, updated_at
)
SELECT 
  'CASE_' || study_id,
  'Case Study: ' || job_type || ' in ' || suburb,
  'case_studies',
  'proof',
  'case_study',
  CONCAT(
    '# Case Study: ', job_type, ' in ', suburb, E'\n\n',
    '## Client Problem\n', client_problem, E'\n\n',
    '## Solution Provided\n', solution_provided, E'\n\n',
    '## Key Outcome\n', key_outcome, E'\n\n',
    CASE WHEN testimonial IS NOT NULL THEN CONCAT('## Client Testimonial\n', testimonial, E'\n\n') ELSE '' END,
    '## Project Date\n', COALESCE(project_date::text, 'N/A')
  ),
  jsonb_build_object(
    'study_id', study_id,
    'slug', slug,
    'suburb', suburb,
    'job_type', job_type,
    'project_date', project_date,
    'featured', featured,
    'before_image', before_image,
    'after_image', after_image
  ),
  75,
  true,
  'unified',
  created_at,
  updated_at
FROM public.content_case_studies
ON CONFLICT (doc_id) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = EXCLUDED.updated_at;

-- 5. Migrate content_testimonials into master_knowledge
INSERT INTO public.master_knowledge (
  doc_id, title, category, subcategory, doc_type, content, metadata, priority, active, source, created_at, updated_at
)
SELECT 
  'TEST_' || id::text,
  'Testimonial: ' || client_name || ' - ' || COALESCE(suburb, 'CKR Client'),
  'proof',
  'testimonials',
  'testimonial',
  CONCAT(
    '# Client Testimonial - ', client_name, E'\n\n',
    testimonial_text, E'\n\n',
    '## Service Type\n', COALESCE(service_type, 'N/A'), E'\n\n',
    '## Location\n', COALESCE(suburb, 'N/A'), E'\n\n',
    '## Rating\n', COALESCE(rating::text, 'N/A'), '/5', E'\n\n',
    '## Job Date\n', COALESCE(job_date::text, 'N/A')
  ),
  jsonb_build_object(
    'client_name', client_name,
    'suburb', suburb,
    'service_type', service_type,
    'rating', rating,
    'job_date', job_date,
    'verified', verified,
    'featured', featured,
    'case_study_id', case_study_id
  ),
  70,
  featured,
  'unified',
  created_at,
  updated_at
FROM public.content_testimonials
ON CONFLICT (doc_id) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = EXCLUDED.updated_at;

-- 6. Migrate content_blog_posts into master_knowledge
INSERT INTO public.master_knowledge (
  doc_id, title, category, subcategory, doc_type, content, metadata, priority, active, source, created_at, updated_at
)
SELECT 
  'BLOG_' || slug,
  title,
  'marketing',
  'content',
  'blog_post',
  CONCAT(
    '# ', title, E'\n\n',
    COALESCE(excerpt, ''), E'\n\n',
    content, E'\n\n',
    '## Category\n', category, E'\n\n',
    '## Tags\n', COALESCE(array_to_string(tags, ', '), ''), E'\n\n',
    '## Author\n', COALESCE(author, 'Call Kaids Roofing')
  ),
  jsonb_build_object(
    'slug', slug,
    'category', category,
    'tags', tags,
    'author', author,
    'featured', featured,
    'read_time', read_time,
    'publish_date', publish_date,
    'meta_description', meta_description
  ),
  65,
  (publish_date IS NOT NULL AND publish_date <= NOW()),
  'unified',
  created_at,
  updated_at
FROM public.content_blog_posts
WHERE publish_date IS NOT NULL AND publish_date <= NOW()
ON CONFLICT (doc_id) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = EXCLUDED.updated_at;

-- 7. Migrate content_knowledge_base (FAQs) into master_knowledge
INSERT INTO public.master_knowledge (
  doc_id, title, category, subcategory, doc_type, content, metadata, priority, active, source, created_at, updated_at
)
SELECT 
  'FAQ_' || id::text,
  question,
  'support',
  'faq',
  'knowledge_base',
  CONCAT(
    '# ', question, E'\n\n',
    answer, E'\n\n',
    '## Category\n', COALESCE(category, 'General'), E'\n\n',
    '## Related Services\n', COALESCE(array_to_string(related_services, ', '), 'All Services')
  ),
  jsonb_build_object(
    'category', category,
    'related_services', related_services,
    'featured', featured,
    'display_order', display_order
  ),
  CASE WHEN featured THEN 85 ELSE 70 END,
  true,
  'unified',
  created_at,
  updated_at
FROM public.content_knowledge_base
ON CONFLICT (doc_id) DO UPDATE SET
  content = EXCLUDED.content,
  metadata = EXCLUDED.metadata,
  updated_at = EXCLUDED.updated_at;

-- 8. Update all existing master_knowledge entries to unified source
UPDATE public.master_knowledge 
SET source = 'unified',
    doc_type = CASE 
      WHEN doc_type = 'mkf' THEN 'knowledge'
      WHEN doc_type = 'gwa' THEN 'workflow'
      WHEN doc_type = 'legacy_kf' THEN 'knowledge'
      WHEN doc_type = 'system' THEN 'knowledge'
      ELSE doc_type
    END,
    migration_notes = COALESCE(migration_notes, '') || ' - Unified into single source of truth'
WHERE source != 'unified';

-- 9. Create aggregated stats view
CREATE OR REPLACE VIEW master_knowledge_overview AS
SELECT 
  category,
  subcategory,
  doc_type,
  COUNT(*) as doc_count,
  SUM(chunk_count) as total_chunks,
  MIN(priority) as min_priority,
  MAX(priority) as max_priority,
  COUNT(*) FILTER (WHERE embedding IS NOT NULL) as embedded_count
FROM public.master_knowledge
WHERE active = true
GROUP BY category, subcategory, doc_type
ORDER BY category, subcategory, doc_type;

GRANT SELECT ON master_knowledge_overview TO anon, authenticated;