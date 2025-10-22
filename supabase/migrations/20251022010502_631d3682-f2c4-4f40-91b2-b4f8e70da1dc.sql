-- ============================================
-- SYSTEM AUDIT & SECURITY TABLES
-- ============================================

-- System Audit Log (comprehensive action tracking)
CREATE TABLE IF NOT EXISTS system_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  action TEXT NOT NULL,
  initiator TEXT,
  params JSONB,
  result JSONB,
  status TEXT CHECK (status IN ('success', 'error', 'dry-run', 'pending_approval')),
  error_message TEXT,
  execution_time_ms INTEGER,
  mode TEXT DEFAULT 'live',
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_audit_timestamp ON system_audit(timestamp DESC);
CREATE INDEX idx_audit_action ON system_audit(action);
CREATE INDEX idx_audit_status ON system_audit(status);
CREATE INDEX idx_audit_initiator ON system_audit(initiator);

-- Security Events Log
CREATE TABLE IF NOT EXISTS security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  details JSONB,
  severity TEXT CHECK (severity IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium'
);

CREATE INDEX idx_security_timestamp ON security_events(timestamp DESC);
CREATE INDEX idx_security_type ON security_events(event_type);
CREATE INDEX idx_security_severity ON security_events(severity);

-- Learning Log (AI self-improvement tracking)
CREATE TABLE IF NOT EXISTS metrics_learning_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  task_description TEXT,
  qa_score INTEGER CHECK (qa_score BETWEEN 1 AND 5),
  self_correction_note TEXT,
  category TEXT,
  approved_for_training BOOLEAN DEFAULT false,
  user_feedback TEXT
);

CREATE INDEX idx_learning_score ON metrics_learning_log(qa_score);
CREATE INDEX idx_learning_category ON metrics_learning_log(category);
CREATE INDEX idx_learning_training ON metrics_learning_log(approved_for_training);

-- ============================================
-- FINANCIAL TABLES
-- ============================================

-- Invoices
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  quote_id UUID REFERENCES quotes(id),
  job_id UUID REFERENCES inspection_reports(id),
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  gst NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  amount_paid NUMERIC(10,2) DEFAULT 0,
  balance_due NUMERIC(10,2) NOT NULL,
  status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
  payment_terms TEXT DEFAULT 'Net 7 days',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_client ON invoices(client_name);

-- Invoice Line Items
CREATE TABLE IF NOT EXISTS invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_invoice_items_invoice ON invoice_line_items(invoice_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  amount NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  payment_date DATE NOT NULL,
  reference TEXT,
  notes TEXT,
  recorded_by UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_num INTEGER;
  invoice_num TEXT;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 'INV-(\d+)') AS INTEGER)), 0) + 1
  INTO next_num
  FROM invoices
  WHERE invoice_number ~ '^INV-\d+$';
  
  invoice_num := 'INV-' || LPAD(next_num::TEXT, 5, '0');
  RETURN invoice_num;
END;
$$;

-- Trigger to update invoice updated_at
CREATE OR REPLACE FUNCTION update_invoice_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_invoice_updated
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_invoice_timestamp();

-- ============================================
-- RLS POLICIES
-- ============================================

-- System audit: admins view all, system inserts
ALTER TABLE system_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view all audit logs"
  ON system_audit FOR SELECT
  USING (is_admin_user(auth.uid()));

CREATE POLICY "System can insert audit logs"
  ON system_audit FOR INSERT
  WITH CHECK (true);

-- Security events: admin-only
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view security events"
  ON security_events FOR SELECT
  USING (is_admin_user(auth.uid()));

CREATE POLICY "System can log security events"
  ON security_events FOR INSERT
  WITH CHECK (true);

-- Learning log: inspectors and admins
ALTER TABLE metrics_learning_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors can manage learning logs"
  ON metrics_learning_log FOR ALL
  USING (is_inspector(auth.uid()));

-- Invoices: inspectors can manage
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors can manage invoices"
  ON invoices FOR ALL
  USING (is_inspector(auth.uid()));

-- Invoice line items: inherit from invoices
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors can manage invoice items"
  ON invoice_line_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM invoices 
    WHERE invoices.id = invoice_line_items.invoice_id 
    AND is_inspector(auth.uid())
  ));

-- Payments: inspectors can manage
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Inspectors can manage payments"
  ON payments FOR ALL
  USING (is_inspector(auth.uid()));