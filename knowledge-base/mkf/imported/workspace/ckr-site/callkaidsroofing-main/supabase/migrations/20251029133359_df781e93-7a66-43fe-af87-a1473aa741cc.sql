-- Drop the existing constraint that only allows 2 types
ALTER TABLE public.chat_conversations 
DROP CONSTRAINT IF EXISTS chat_conversations_conversation_type_check;

-- Add new constraint supporting all 9 AI conversation types
ALTER TABLE public.chat_conversations 
ADD CONSTRAINT chat_conversations_conversation_type_check 
CHECK (conversation_type = ANY (ARRAY[
  -- Public-facing conversations
  'customer_support'::text,        -- Website customer support chat
  
  -- Internal CRM & Operations
  'quote_assistant'::text,         -- Quote refinement assistant
  'internal_assistant'::text,      -- Field operations assistant
  'nexus_ai'::text,               -- Universal AI hub for CRM
  
  -- Content Generation
  'form_builder'::text,           -- Form schema generator
  'document_writer'::text,        -- Document & marketing content
  'inspection_form'::text,        -- Inspection form auto-fill
  'lead_capture'::text,           -- Lead extraction assistant
  'quote_helper'::text            -- Quote data extraction
]));