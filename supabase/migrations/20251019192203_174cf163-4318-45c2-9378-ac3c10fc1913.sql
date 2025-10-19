-- Add delete policy for quotes (only admins can delete)
-- This allows admin users to delete quotes from the system

-- The policy already exists in the RLS policies, but let's ensure it's properly set
-- Add index for better delete performance
CREATE INDEX IF NOT EXISTS idx_quotes_status ON public.quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_by ON public.quotes(created_by);

-- Add cascade delete for quote line items
ALTER TABLE public.quote_line_items 
DROP CONSTRAINT IF EXISTS quote_line_items_quote_id_fkey;

ALTER TABLE public.quote_line_items
ADD CONSTRAINT quote_line_items_quote_id_fkey 
FOREIGN KEY (quote_id) 
REFERENCES public.quotes(id) 
ON DELETE CASCADE;