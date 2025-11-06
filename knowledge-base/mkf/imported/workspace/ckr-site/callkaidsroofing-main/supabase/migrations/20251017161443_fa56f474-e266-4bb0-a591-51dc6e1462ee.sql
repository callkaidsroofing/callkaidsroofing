-- Create pricing rules table for intelligent quote generation
CREATE TABLE public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_item TEXT NOT NULL,
  unit TEXT NOT NULL,
  rate_min NUMERIC(10,2) NOT NULL,
  rate_max NUMERIC(10,2) NOT NULL,
  material_specs JSONB DEFAULT '{}'::jsonb,
  labour_hours_per_unit NUMERIC(5,2),
  markup_percentage NUMERIC(5,2) DEFAULT 30.00,
  warranty_tier TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create material specifications table
CREATE TABLE public.material_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_name TEXT NOT NULL,
  brand TEXT NOT NULL,
  product_code TEXT,
  unit_cost NUMERIC(10,2) NOT NULL,
  supplier TEXT,
  warranty_years INTEGER,
  specifications JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_report_id UUID REFERENCES public.inspection_reports(id) ON DELETE SET NULL,
  quote_number TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  site_address TEXT NOT NULL,
  suburb_postcode TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  tier_level TEXT NOT NULL CHECK (tier_level IN ('essential', 'premium', 'complete')),
  subtotal NUMERIC(10,2) NOT NULL,
  gst NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'completed')),
  valid_until DATE,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create quote line items table
CREATE TABLE public.quote_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
  service_item TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL,
  unit_rate NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL,
  material_spec_id UUID REFERENCES public.material_specs(id),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat conversations table for both customer and internal chatbots
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_type TEXT NOT NULL CHECK (conversation_type IN ('customer_support', 'quote_assistant')),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  context_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pricing_rules (admin only)
CREATE POLICY "Only admins can manage pricing rules"
  ON public.pricing_rules
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- RLS Policies for material_specs (admin only)
CREATE POLICY "Only admins can manage material specs"
  ON public.material_specs
  FOR ALL
  USING (is_admin_user(auth.uid()))
  WITH CHECK (is_admin_user(auth.uid()));

-- RLS Policies for quotes (inspectors can view/create, admins can manage)
CREATE POLICY "Inspectors can view quotes"
  ON public.quotes
  FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE POLICY "Inspectors can create quotes"
  ON public.quotes
  FOR INSERT
  WITH CHECK (is_inspector(auth.uid()));

CREATE POLICY "Inspectors can update quotes"
  ON public.quotes
  FOR UPDATE
  USING (is_inspector(auth.uid()));

CREATE POLICY "Only admins can delete quotes"
  ON public.quotes
  FOR DELETE
  USING (is_admin_user(auth.uid()));

-- RLS Policies for quote_line_items (follow parent quote permissions)
CREATE POLICY "Users with quote access can view line items"
  ON public.quote_line_items
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND is_inspector(auth.uid())
    )
  );

CREATE POLICY "Users with quote access can insert line items"
  ON public.quote_line_items
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND is_inspector(auth.uid())
    )
  );

CREATE POLICY "Users with quote access can update line items"
  ON public.quote_line_items
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.quotes
      WHERE quotes.id = quote_line_items.quote_id
      AND is_inspector(auth.uid())
    )
  );

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view their own conversations"
  ON public.chat_conversations
  FOR SELECT
  USING (
    auth.uid() = user_id 
    OR conversation_type = 'customer_support'
  );

CREATE POLICY "Anyone can create customer support conversations"
  ON public.chat_conversations
  FOR INSERT
  WITH CHECK (conversation_type = 'customer_support');

CREATE POLICY "Authenticated users can create quote assistant conversations"
  ON public.chat_conversations
  FOR INSERT
  WITH CHECK (
    conversation_type = 'quote_assistant' 
    AND auth.uid() = user_id 
    AND is_inspector(auth.uid())
  );

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages in their conversations"
  ON public.chat_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND (auth.uid() = chat_conversations.user_id OR chat_conversations.conversation_type = 'customer_support')
    )
  );

CREATE POLICY "Users can create messages in their conversations"
  ON public.chat_messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chat_conversations
      WHERE chat_conversations.id = chat_messages.conversation_id
      AND (auth.uid() = chat_conversations.user_id OR chat_conversations.conversation_type = 'customer_support')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_quotes_inspection_report ON public.quotes(inspection_report_id);
CREATE INDEX idx_quotes_status ON public.quotes(status);
CREATE INDEX idx_quote_line_items_quote_id ON public.quote_line_items(quote_id);
CREATE INDEX idx_chat_conversations_user ON public.chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_type ON public.chat_conversations(conversation_type);
CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);

-- Create trigger for updated_at
CREATE TRIGGER update_pricing_rules_updated_at
  BEFORE UPDATE ON public.pricing_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_material_specs_updated_at
  BEFORE UPDATE ON public.material_specs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at
  BEFORE UPDATE ON public.quotes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at
  BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Generate quote number function
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  quote_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 'CKR-(\d+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM public.quotes
  WHERE quote_number ~ '^CKR-\d+$';
  
  quote_num := 'CKR-' || LPAD(next_num::TEXT, 5, '0');
  RETURN quote_num;
END;
$$;