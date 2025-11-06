-- ============================================================
-- PHASE 0: NOTION INTEGRATION - CONTENT CACHE TABLES
-- Call Kaids Roofing - Content Management System
-- ============================================================

-- ======================
-- 1. BLOG POSTS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS public.content_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id TEXT UNIQUE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  author TEXT DEFAULT 'Kaidyn Brownlie',
  publish_date TIMESTAMPTZ,
  read_time INTEGER,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  meta_description TEXT,
  related_posts TEXT[] DEFAULT '{}',
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS for public read access
ALTER TABLE public.content_blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published blog posts" ON public.content_blog_posts
  FOR SELECT TO public USING (publish_date <= now());

CREATE POLICY "Admins can manage blog posts" ON public.content_blog_posts
  FOR ALL TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- Indexes for performance
CREATE INDEX idx_blog_posts_slug ON public.content_blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON public.content_blog_posts(category);
CREATE INDEX idx_blog_posts_featured ON public.content_blog_posts(featured) WHERE featured = true;
CREATE INDEX idx_blog_posts_publish_date ON public.content_blog_posts(publish_date DESC);

-- ======================
-- 2. SERVICES TABLE
-- ======================
CREATE TABLE IF NOT EXISTS public.content_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  full_description TEXT,
  features TEXT[] DEFAULT '{}',
  process_steps JSONB DEFAULT '[]',
  pricing_info JSONB,
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  icon TEXT,
  image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  service_category TEXT,
  service_tags TEXT[] DEFAULT '{}',
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.content_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view services" ON public.content_services
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage services" ON public.content_services
  FOR ALL TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE INDEX idx_services_slug ON public.content_services(slug);
CREATE INDEX idx_services_featured ON public.content_services(featured) WHERE featured = true;
CREATE INDEX idx_services_display_order ON public.content_services(display_order);

-- ======================
-- 3. SUBURBS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS public.content_suburbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  region TEXT,
  postcode TEXT,
  description TEXT,
  local_seo_content TEXT,
  services_available TEXT[] DEFAULT '{}',
  projects_completed INTEGER DEFAULT 0,
  featured_projects TEXT[] DEFAULT '{}',
  distance_from_base INTEGER,
  meta_title TEXT,
  meta_description TEXT,
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.content_suburbs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view suburbs" ON public.content_suburbs
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage suburbs" ON public.content_suburbs
  FOR ALL TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE INDEX idx_suburbs_slug ON public.content_suburbs(slug);
CREATE INDEX idx_suburbs_region ON public.content_suburbs(region);

-- ======================
-- 4. CASE STUDIES TABLE
-- ======================
CREATE TABLE IF NOT EXISTS public.content_case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id TEXT UNIQUE,
  study_id TEXT UNIQUE NOT NULL,
  job_type TEXT NOT NULL,
  suburb TEXT NOT NULL,
  client_problem TEXT NOT NULL,
  solution_provided TEXT NOT NULL,
  key_outcome TEXT NOT NULL,
  testimonial TEXT,
  before_image TEXT,
  after_image TEXT,
  project_date DATE,
  featured BOOLEAN DEFAULT false,
  slug TEXT UNIQUE,
  meta_description TEXT,
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.content_case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view case studies" ON public.content_case_studies
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage case studies" ON public.content_case_studies
  FOR ALL TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE INDEX idx_case_studies_suburb ON public.content_case_studies(suburb);
CREATE INDEX idx_case_studies_job_type ON public.content_case_studies(job_type);
CREATE INDEX idx_case_studies_featured ON public.content_case_studies(featured) WHERE featured = true;

-- ======================
-- 5. TESTIMONIALS TABLE
-- ======================
CREATE TABLE IF NOT EXISTS public.content_testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id TEXT UNIQUE,
  client_name TEXT NOT NULL,
  suburb TEXT,
  service_type TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  testimonial_text TEXT NOT NULL,
  job_date DATE,
  featured BOOLEAN DEFAULT false,
  verified BOOLEAN DEFAULT false,
  case_study_id UUID REFERENCES public.content_case_studies(id),
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.content_testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view testimonials" ON public.content_testimonials
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage testimonials" ON public.content_testimonials
  FOR ALL TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE INDEX idx_testimonials_featured ON public.content_testimonials(featured) WHERE featured = true;
CREATE INDEX idx_testimonials_rating ON public.content_testimonials(rating);

-- ======================
-- 6. KNOWLEDGE BASE TABLE (FAQs)
-- ======================
CREATE TABLE IF NOT EXISTS public.content_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notion_id TEXT UNIQUE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  related_services TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.content_knowledge_base ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view knowledge base" ON public.content_knowledge_base
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage knowledge base" ON public.content_knowledge_base
  FOR ALL TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE INDEX idx_knowledge_base_category ON public.content_knowledge_base(category);

-- ======================
-- 7. RAG KNOWLEDGE FILES TABLE
-- For CKR-GEM AI Agent Context
-- ======================
CREATE TABLE IF NOT EXISTS public.knowledge_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('brand', 'operations', 'marketing', 'technical', 'compliance')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  version INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.knowledge_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view knowledge files" ON public.knowledge_files
  FOR SELECT TO authenticated USING (active = true);

CREATE POLICY "Admins can manage knowledge files" ON public.knowledge_files
  FOR ALL TO authenticated 
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE INDEX idx_knowledge_files_category ON public.knowledge_files(category);
CREATE INDEX idx_knowledge_files_active ON public.knowledge_files(active) WHERE active = true;

-- ======================
-- 8. CONTENT SYNC LOG TABLE
-- Track Notion -> Supabase sync operations
-- ======================
CREATE TABLE IF NOT EXISTS public.content_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  records_synced INTEGER DEFAULT 0,
  records_updated INTEGER DEFAULT 0,
  records_created INTEGER DEFAULT 0,
  records_deleted INTEGER DEFAULT 0,
  errors JSONB DEFAULT '[]',
  sync_status TEXT CHECK (sync_status IN ('success', 'partial', 'failed')),
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER
);

ALTER TABLE public.content_sync_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sync logs" ON public.content_sync_log
  FOR SELECT TO authenticated 
  USING (public.is_admin_user(auth.uid()));

CREATE INDEX idx_sync_log_completed ON public.content_sync_log(completed_at DESC);

-- ======================
-- TRIGGERS FOR UPDATED_AT
-- ======================
CREATE OR REPLACE FUNCTION public.update_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.content_blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_content_updated_at();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.content_services
  FOR EACH ROW EXECUTE FUNCTION public.update_content_updated_at();

CREATE TRIGGER update_suburbs_updated_at
  BEFORE UPDATE ON public.content_suburbs
  FOR EACH ROW EXECUTE FUNCTION public.update_content_updated_at();

CREATE TRIGGER update_case_studies_updated_at
  BEFORE UPDATE ON public.content_case_studies
  FOR EACH ROW EXECUTE FUNCTION public.update_content_updated_at();

CREATE TRIGGER update_testimonials_updated_at
  BEFORE UPDATE ON public.content_testimonials
  FOR EACH ROW EXECUTE FUNCTION public.update_content_updated_at();

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON public.content_knowledge_base
  FOR EACH ROW EXECUTE FUNCTION public.update_content_updated_at();

CREATE TRIGGER update_knowledge_files_updated_at
  BEFORE UPDATE ON public.knowledge_files
  FOR EACH ROW EXECUTE FUNCTION public.update_content_updated_at();

-- ======================
-- INSERT INITIAL KNOWLEDGE FILES
-- Core brand and operational knowledge
-- ======================
INSERT INTO public.knowledge_files (file_key, title, category, content, version) VALUES
('KF_01_BRAND_IDENTITY', 'Call Kaids Roofing Brand Identity', 'brand', 
'# Call Kaids Roofing Brand Identity

## Color Palette
- Primary: #007ACC (CKR Blue)
- Secondary: #0B3B69 (CKR Blue Dark)
- Charcoal: #111827 (Text/Headers)
- White: #FFFFFF
- Off-white: #F7F8FA
- Grey: #6B7280

## FORBIDDEN COLORS
- ❌ NO ORANGE (#FF6B35 or any orange)
- ❌ NO RED (except error states)
- ❌ NO GREEN (except success states)

## Brand Voice
Tone: Direct, honest, expert, approachable
- ✅ "We''ll sort your roof properly"
- ❌ "Leveraging cutting-edge solutions"

## Key Messages
- Quality over price
- Local SE Melbourne expertise
- Transparency and honesty
- 10-year workmanship warranty

## Contact Information
- Phone: 0435 900 709
- Email: callkaidsroofing@outlook.com
- ABN: 39475055075
- Owner: Kaidyn Brownlie
- Service Area: 50km radius from Clyde North, Victoria', 1),

('KF_02_SERVICE_PRICING', 'Service Pricing Guidelines', 'operations',
'# Service Pricing Guidelines

## Roof Restoration
- Small (< 100 sqm): $8,000 - $12,000
- Medium (100-200 sqm): $12,000 - $18,000
- Large (> 200 sqm): $18,000 - $25,000

## Ridge Capping (Rebedding & Repointing)
- Per linear meter: $15 - $25
- Full house average: $1,500 - $3,500

## Roof Painting
- Tile roof: $6,000 - $15,000
- Metal roof: $5,000 - $12,000

## Premium Materials
- Premcoat Plus: 20-year warranty coating
- SupaPoint: Flexible mortar system
- Buildex Class 4: Fasteners
- Colorbond steel: Valley iron, flashing', 1),

('KF_03_WARRANTY_INFO', 'Warranty Information', 'compliance',
'# Warranty Information

## Workmanship Warranties
- Standard: 10 years (all projects)
- Premium: 15 years (full restorations)
- Elite: 20 years (with Premcoat Plus)

## Material Warranties
- Premcoat Standard: 10 years
- Premcoat Plus: 20 years
- Colorbond: Manufacturer warranty

## Coverage
- Workmanship defects
- Material failures
- Water penetration
- Structural integrity

## Exclusions
- Storm damage (insurance claim)
- Accidental damage
- Poor maintenance
- Structural settling', 1),

('KF_04_SERVICE_AREAS', 'Service Areas - South East Melbourne', 'operations',
'# Primary Service Areas (50km radius from Clyde North)

## Core Suburbs
- Berwick
- Clyde North
- Cranbourne (North/South/East/West)
- Pakenham
- Officer
- Dandenong
- Rowville
- Noble Park
- Narre Warren (North/South)
- Lyndhurst
- Hampton Park
- Endeavour Hills
- Hallam
- Fountain Gate
- Doveton

## Extended Service Areas
- Mount Eliza (coastal premium)
- Frankston
- Mornington
- Carrum Downs
- Langwarrin

## Travel Charges
- 0-25km: No charge
- 25-40km: $100 travel fee
- 40-50km: $150 travel fee
- > 50km: Quote on request', 1);

-- Insert initial blog post from existing data
INSERT INTO public.content_blog_posts (
  title, slug, excerpt, content, category, tags, author, publish_date, read_time, featured, image_url, meta_description
) VALUES (
  'Complete Guide to Roof Restoration in Melbourne''s Climate',
  'complete-guide-roof-restoration-melbourne-climate',
  'Everything Melbourne homeowners need to know about roof restoration, from identifying damage to choosing the right materials for our unique weather conditions.',
  'Melbourne''s unpredictable weather creates unique challenges for homeowners. Your roof faces everything from scorching summer heat to winter storms - often in the same day.

## Why Melbourne Roofs Need Special Attention

Melbourne''s *"four seasons in one day"* climate causes constant expansion and contraction of roofing materials:

- Tile movement and cracking
- Ridge cap displacement  
- Mortar deterioration
- Gutter system stress

## Our Professional Restoration Process

### Step 1: 25-Point Health Assessment
We inspect every critical component:
- Ridge capping condition
- Tile integrity and alignment
- Valley iron assessment
- Gutter and downpipe evaluation

### Step 2: Professional Cleaning
Using specialized equipment to remove:
- Moss and lichen buildup
- Dirt and debris accumulation
- Paint flakes and oxidation

### Step 3: Targeted Repairs
Common Melbourne issues we fix:
- **Broken tiles** - Replaced with matching materials
- **Ridge cap rebedding** - Premium SupaPoint mortar
- **Valley iron replacement** - Colorbond steel installation
- **Leak sealing** - Professional-grade compounds

### Step 4: Premium Coating
**Premcoat** systems designed for Australian conditions:
- UV-resistant formulation
- Thermal reflection properties
- 10-year warranty coverage

## Smart Investment Choice

Restoration vs replacement costs:
- **Restoration**: $8,000-$15,000
- **Full replacement**: $20,000-$40,000+
- **Payback period**: 3-5 years via energy savings

## Optimal Timing

**Best seasons for restoration:**
- **Autumn (Mar-May)** - Ideal conditions
- **Spring (Sep-Nov)** - Pre-summer prep

**Weather requirements:**
- 3+ consecutive dry days
- 10-30°C temperature range
- Low humidity for curing

## Warning Signs to Watch

🚨 **Immediate action required:**
- Water stains on ceilings
- Visible daylight through roof
- Missing tiles after storms
- Sagging gutters

⚠️ **Schedule assessment soon:**
- Faded tile surfaces
- Moss growth
- Cracked ridge caps
- Gutter rust stains

## Call Kaids Quality Promise

✅ **15-year workmanship warranty**
✅ **Fully insured operations** 
✅ **Premium Australian materials**
✅ **Photo documentation**

## Post-Restoration Care

**Annual maintenance:**
- Bi-annual gutter cleaning
- Visual tile inspection
- Ridge cap assessment

**5-year review:**
- Professional assessment
- Touch-up applications
- Preventive repairs

Ready to protect your investment? Book your free assessment today.',
  'roof-restoration',
  ARRAY['Melbourne', 'restoration', 'climate', 'maintenance'],
  'Kaidyn Brownlie',
  '2024-01-15'::timestamptz,
  8,
  true,
  '/src/assets/blog-hero-restoration.jpg',
  'Professional roof restoration in Melbourne. Expert guide covering climate challenges, restoration process, costs, and timing. 15-year warranty. Call 0435 900 709.'
);

-- Insert case studies from existing data
INSERT INTO public.content_case_studies (
  study_id, job_type, suburb, client_problem, solution_provided, key_outcome, testimonial, before_image, after_image, featured, slug
) VALUES 
(
  'CS-2025-09-15-BER-01',
  'Full Tile Roof Restoration',
  'Berwick',
  '20-year-old roof looked ''tired and faded'' with extensive moss growth and visible cracking in the ridge capping mortar, creating a risk of leaks.',
  'Full restoration including high-pressure clean (SOP-T1), replacement of 18 cracked tiles (SOP-T2), full re-bed and re-point of all ridge capping (SOP-T3), and application of a 3-coat Premcoat membrane in ''Monument'' (SOP-T4).',
  'Complete aesthetic transformation, restored structural integrity, and long-term protection backed by a **15-year warranty**.',
  'Could not be happier with the result. The team was professional from start to finish. Our roof looks brand new and the whole house looks better for it. The photo updates they sent were fantastic. Highly recommend.',
  '/lovable-uploads/b8f5645a-9809-4dc8-be5d-e4cd78cfadf8.png',
  '/lovable-uploads/116450ad-e39b-42bd-891b-c7e312d4cf91.png',
  true,
  'berwick-full-tile-roof-restoration-2025'
),
(
  'CS-2025-07-30-PAK-01',
  'Ridge Capping Repair (Structural)',
  'Pakenham',
  'Client noticed pieces of brittle mortar falling onto their driveway, leading to concerns about ridge capping security during high winds.',
  'A full re-bed and re-point of the main ridge and two hips as per the Master Craftsmanship SOP-T3. All old mortar chipped away and new flexible pointing applied and tooled to a professional finish.',
  'Ridge capping is now structurally sound and the primary leak point on the roof has been eliminated. Guaranteed long-term security.',
  'Very happy with the work. They showed me photos of the problem so I could understand what was needed. The finished job looks great and I feel much safer now.',
  '/lovable-uploads/4d68a224-4a9b-4712-83a0-0abe80156254.png',
  '/lovable-uploads/992cf8cb-032a-4253-b9d7-45f675e69217.png',
  true,
  'pakenham-ridge-capping-repair-2025'
),
(
  'CS-2025-06-18-NAR-01',
  'Valley Iron Replacement & Leak Repair',
  'Narre Warren South',
  'Persistent leak causing ceiling stain. Source traced to the main valley iron which had rusted through in several places.',
  'Root cause eliminated. Old, rusted valley iron cut out and replaced with new, galvanized valley iron with correct overlaps. Tiles re-cut and re-laid.',
  'Permanent resolution to the persistent leak, preventing major internal water damage. Guaranteed structural integrity.',
  'Finally, someone who could actually find and repair the leak! Professional, explained everything clearly. Worth every cent.',
  '/lovable-uploads/0362db50-69c4-4fd7-af15-a0112e09daeb.png',
  '/lovable-uploads/dfb36f59-24c0-44d0-8049-9677f7a3f7ba.png',
  true,
  'narre-warren-valley-iron-replacement-2025'
);