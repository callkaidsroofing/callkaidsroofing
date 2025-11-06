-- Create lead_tasks table for task management
CREATE TABLE IF NOT EXISTS public.lead_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead_notes table for activity timeline
CREATE TABLE IF NOT EXISTS public.lead_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  note_type TEXT NOT NULL DEFAULT 'note',
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_history table for version tracking
CREATE TABLE IF NOT EXISTS public.quote_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  changes JSONB NOT NULL,
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quote_emails table for email tracking
CREATE TABLE IF NOT EXISTS public.quote_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  viewed_at TIMESTAMP WITH TIME ZONE,
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'sent'
);

-- Enable RLS on all tables
ALTER TABLE public.lead_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_emails ENABLE ROW LEVEL SECURITY;

-- RLS policies for lead_tasks
CREATE POLICY "Inspectors can manage lead tasks"
  ON public.lead_tasks
  FOR ALL
  USING (is_inspector(auth.uid()))
  WITH CHECK (is_inspector(auth.uid()));

-- RLS policies for lead_notes
CREATE POLICY "Inspectors can manage lead notes"
  ON public.lead_notes
  FOR ALL
  USING (is_inspector(auth.uid()))
  WITH CHECK (is_inspector(auth.uid()));

-- RLS policies for quote_history
CREATE POLICY "Inspectors can view quote history"
  ON public.quote_history
  FOR SELECT
  USING (is_inspector(auth.uid()));

CREATE POLICY "Inspectors can create quote history"
  ON public.quote_history
  FOR INSERT
  WITH CHECK (is_inspector(auth.uid()));

-- RLS policies for quote_emails
CREATE POLICY "Inspectors can manage quote emails"
  ON public.quote_emails
  FOR ALL
  USING (is_inspector(auth.uid()))
  WITH CHECK (is_inspector(auth.uid()));

-- Add indexes for performance
CREATE INDEX idx_lead_tasks_lead_id ON public.lead_tasks(lead_id);
CREATE INDEX idx_lead_tasks_due_date ON public.lead_tasks(due_date);
CREATE INDEX idx_lead_tasks_status ON public.lead_tasks(status);
CREATE INDEX idx_lead_notes_lead_id ON public.lead_notes(lead_id);
CREATE INDEX idx_quote_history_quote_id ON public.quote_history(quote_id);
CREATE INDEX idx_quote_emails_quote_id ON public.quote_emails(quote_id);

-- Trigger for updated_at on lead_tasks
CREATE TRIGGER update_lead_tasks_updated_at
  BEFORE UPDATE ON public.lead_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();