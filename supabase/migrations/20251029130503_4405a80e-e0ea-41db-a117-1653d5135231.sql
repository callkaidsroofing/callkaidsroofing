-- Create AI generation history table
CREATE TABLE IF NOT EXISTS public.ai_generation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generator_type TEXT NOT NULL CHECK (generator_type IN ('inspection', 'lead', 'form', 'document', 'quote')),
  input_prompt TEXT NOT NULL,
  output_data JSONB NOT NULL,
  applied BOOLEAN NOT NULL DEFAULT false,
  applied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_ai_generation_history_user_id ON public.ai_generation_history(user_id);
CREATE INDEX idx_ai_generation_history_generator_type ON public.ai_generation_history(generator_type);
CREATE INDEX idx_ai_generation_history_created_at ON public.ai_generation_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.ai_generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own generation history"
  ON public.ai_generation_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generation history"
  ON public.ai_generation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own generation history"
  ON public.ai_generation_history
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_ai_generation_history_updated_at
  BEFORE UPDATE ON public.ai_generation_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
