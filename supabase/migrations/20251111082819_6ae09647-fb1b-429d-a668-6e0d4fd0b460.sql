-- Create minimal jobs table for Quick Quote Generator
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  site_address TEXT NOT NULL,
  scope TEXT NOT NULL,
  quote_amount NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  quote_sent_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- RLS policy for authenticated users (single-user admin)
CREATE POLICY "Authenticated users can manage jobs"
ON public.jobs FOR ALL TO authenticated
USING (true) WITH CHECK (true);

-- Add index for faster lookups
CREATE INDEX idx_jobs_created_at ON public.jobs(created_at DESC);
CREATE INDEX idx_jobs_customer_name ON public.jobs(customer_name);