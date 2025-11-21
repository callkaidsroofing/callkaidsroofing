-- Create pricing_items table with vector embeddings for RAG
CREATE TABLE IF NOT EXISTS public.pricing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL UNIQUE,
  item_name TEXT NOT NULL,
  item_category TEXT NOT NULL,
  unit_of_measure TEXT NOT NULL,
  base_cost DECIMAL(10, 2) NOT NULL,
  preferred_supplier TEXT,
  supplier_code TEXT,
  usage_notes TEXT,
  quality_tier TEXT,
  version_history JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  embedding vector(1536),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create pricing_constants table
CREATE TABLE IF NOT EXISTS public.pricing_constants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  constant_id TEXT NOT NULL UNIQUE,
  material_markup DECIMAL(5, 4) NOT NULL DEFAULT 0.20,
  contingency DECIMAL(5, 4) NOT NULL DEFAULT 0.05,
  profit_margin DECIMAL(5, 4) NOT NULL DEFAULT 0.30,
  gst DECIMAL(5, 4) NOT NULL DEFAULT 0.10,
  description TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default pricing constants
INSERT INTO public.pricing_constants (constant_id, material_markup, contingency, profit_margin, gst, description)
VALUES ('FIN_CONST_V1', 0.20, 0.05, 0.30, 0.10, 'Standard financial constants for CKR pricing model')
ON CONFLICT (constant_id) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pricing_items_category ON public.pricing_items(item_category);
CREATE INDEX IF NOT EXISTS idx_pricing_items_active ON public.pricing_items(active);
CREATE INDEX IF NOT EXISTS idx_pricing_items_embedding ON public.pricing_items USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create updated_at trigger
CREATE TRIGGER update_pricing_items_updated_at
  BEFORE UPDATE ON public.pricing_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_pricing_constants_updated_at
  BEFORE UPDATE ON public.pricing_constants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.pricing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_constants ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Read access for authenticated users
CREATE POLICY "Authenticated users can read pricing items"
  ON public.pricing_items
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can read pricing constants"
  ON public.pricing_constants
  FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies - Admin-only write access
CREATE POLICY "Admins can insert pricing items"
  ON public.pricing_items
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update pricing items"
  ON public.pricing_items
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete pricing items"
  ON public.pricing_items
  FOR DELETE
  TO authenticated
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update pricing constants"
  ON public.pricing_constants
  FOR UPDATE
  TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- Create function to search pricing items with vector similarity
CREATE OR REPLACE FUNCTION public.search_pricing_items(
  query_embedding vector,
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_category text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  item_id text,
  item_name text,
  item_category text,
  base_cost decimal,
  unit_of_measure text,
  usage_notes text,
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pi.id,
    pi.item_id,
    pi.item_name,
    pi.item_category,
    pi.base_cost,
    pi.unit_of_measure,
    pi.usage_notes,
    1 - (pi.embedding <=> query_embedding) as similarity
  FROM public.pricing_items pi
  WHERE pi.active = true
    AND (filter_category IS NULL OR pi.item_category = filter_category)
    AND 1 - (pi.embedding <=> query_embedding) > match_threshold
  ORDER BY pi.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create function to calculate final price with all markups
CREATE OR REPLACE FUNCTION public.calculate_final_price(
  base_cost decimal,
  constant_id text DEFAULT 'FIN_CONST_V1'
)
RETURNS decimal
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  constants record;
  with_markup decimal;
  with_contingency decimal;
  with_profit decimal;
  final_price decimal;
BEGIN
  SELECT material_markup, contingency, profit_margin, gst
  INTO constants
  FROM public.pricing_constants
  WHERE pricing_constants.constant_id = calculate_final_price.constant_id
    AND active = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Pricing constants not found';
  END IF;
  
  with_markup := base_cost * (1 + constants.material_markup);
  with_contingency := with_markup * (1 + constants.contingency);
  with_profit := with_contingency * (1 + constants.profit_margin);
  final_price := with_profit * (1 + constants.gst);
  
  RETURN ROUND(final_price, 2);
END;
$$;