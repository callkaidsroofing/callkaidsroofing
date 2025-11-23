-- ============================================================================
-- Migration: 003_create_operational_tables.sql
-- CKR-GEM Operational Spine - Core Workflow Tables
-- ============================================================================
-- Purpose: Create/update operational tables aligned to leads → quotes → jobs workflow
-- Execution Order: Step 3 of 6
-- Safety: Additive only, extends existing schema
-- Schema Laws: Quote totals MUST use total_amount field (never 'total')
-- ============================================================================

BEGIN;

-- ============================================================================
-- SCHEMA LAW ENFORCEMENT: Rename 'total' to 'total_amount' in quotes table
-- ============================================================================
-- Check if quotes table exists and has 'total' column instead of 'total_amount'
DO $$
BEGIN
  -- Only rename if 'total' exists and 'total_amount' doesn't
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'quotes' 
    AND column_name = 'total'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'quotes' 
    AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE public.quotes RENAME COLUMN total TO total_amount;
    RAISE NOTICE 'Schema Law Enforced: Renamed quotes.total → quotes.total_amount';
  END IF;
END $$;

-- ============================================================================
-- CREATE expenses table (if not exists) - Track job costs
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to jobs
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  
  -- Expense details
  expense_type TEXT NOT NULL,  -- materials, labour, subcontractor, equipment, travel
  description TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 0),
  
  -- Supplier/vendor
  supplier TEXT,
  receipt_url TEXT,
  
  -- Date tracking
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  -- Approval workflow
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  
  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_job_id ON public.expenses(job_id);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_type ON public.expenses(expense_type);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date DESC);

-- ============================================================================
-- CREATE tasks table (if not exists) - Job task management
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to jobs
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  
  -- Task details
  task_name TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'blocked')),
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Scheduling
  scheduled_date DATE,
  completed_date DATE,
  
  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_job_id ON public.tasks(job_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_date ON public.tasks(scheduled_date);

-- ============================================================================
-- CREATE case_studies table (if not exists) - Link jobs to portfolio
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to jobs
  job_id UUID UNIQUE REFERENCES public.jobs(id) ON DELETE CASCADE,
  
  -- Case study content
  title TEXT NOT NULL,
  client_problem TEXT NOT NULL,
  solution_provided TEXT NOT NULL,
  key_outcome TEXT NOT NULL,
  testimonial TEXT,
  
  -- Photos
  before_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  after_photos TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Publication
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  
  -- SEO
  slug TEXT UNIQUE,
  meta_description TEXT,
  
  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_case_studies_job_id ON public.case_studies(job_id);
CREATE INDEX IF NOT EXISTS idx_case_studies_published ON public.case_studies(published);
CREATE INDEX IF NOT EXISTS idx_case_studies_featured ON public.case_studies(featured);
CREATE INDEX IF NOT EXISTS idx_case_studies_slug ON public.case_studies(slug);

-- ============================================================================
-- CREATE photos table (if not exists) - Unified photo management
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign keys
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  case_study_id UUID REFERENCES public.case_studies(id) ON DELETE CASCADE,
  
  -- Photo details
  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (photo_type IN ('before', 'during', 'after', 'defect', 'completion')),
  caption TEXT,
  
  -- AI analysis
  ai_analysis JSONB DEFAULT '{}'::jsonb,
  
  -- Sort order
  display_order INTEGER DEFAULT 0,
  
  -- Audit timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_photos_job_id ON public.photos(job_id);
CREATE INDEX IF NOT EXISTS idx_photos_case_study_id ON public.photos(case_study_id);
CREATE INDEX IF NOT EXISTS idx_photos_photo_type ON public.photos(photo_type);
CREATE INDEX IF NOT EXISTS idx_photos_display_order ON public.photos(display_order);

-- ============================================================================
-- Create triggers for updated_at on all new tables
-- ============================================================================
CREATE OR REPLACE FUNCTION update_operational_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all operational tables
DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOR table_name IN 
    SELECT unnest(ARRAY['expenses', 'tasks', 'case_studies', 'photos'])
  LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = table_name
    ) THEN
      EXECUTE format(
        'CREATE TRIGGER trigger_%s_updated_at
         BEFORE UPDATE ON public.%s
         FOR EACH ROW
         EXECUTE FUNCTION update_operational_updated_at()',
        table_name, table_name
      );
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- Add comments for documentation
-- ============================================================================
COMMENT ON TABLE public.expenses IS 
  'CKR-GEM Operational Spine: Job expense tracking (materials, labour, subcontractor costs).';

COMMENT ON TABLE public.tasks IS 
  'CKR-GEM Operational Spine: Job task management and assignment tracking.';

COMMENT ON TABLE public.case_studies IS 
  'CKR-GEM Operational Spine: Published portfolio case studies linked to completed jobs (Proof In Every Roof).';

COMMENT ON TABLE public.photos IS 
  'CKR-GEM Operational Spine: Unified photo management for jobs and case studies with AI analysis.';

COMMIT;