import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatWithRagOptions {
  conversationType?: 'customer_support' | 'quote_assistant' | 'internal';
  useRag?: boolean;
  ragOptions?: {
    matchThreshold?: number;
    matchCount?: number;
    filterCategory?: string;
  };
  onMessage?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
}

export interface ChatMetadata {
  conversationType: string;
  ragUsed: boolean;
  contextsRetrieved: number;
  contexts: Array<{
    title: string;
    category: string;
    similarity: number;
  }>;
}

export function useChatWithRag(options: ChatWithRagOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [metadata, setMetadata] = useState<ChatMetadata | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) {
      toast.error('Message cannot be empty');
      return null;
    }

    const newMessage: ChatMessage = {
      role: 'user',
      content: userMessage.trim(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setLoading(true);
    setError(null);

    try {
      const { data, error: funcError } = await supabase.functions.invoke('chat-with-rag', {
        body: {
          messages: [...messages, newMessage],
          conversationType: options.conversationType || 'customer_support',
          useRag: options.useRag !== false, // Default to true
          ragOptions: options.ragOptions || {},
        },
      });

      if (funcError) throw funcError;

      if (!data?.success) {
        throw new Error(data?.error || 'Chat failed');
      }

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.message,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setMetadata(data.metadata);
      options.onMessage?.(assistantMessage);

      return {
        message: assistantMessage,
        metadata: data.metadata,
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      console.error('Chat with RAG error:', error);
      setError(error);
      options.onError?.(error);
      toast.error(`Chat failed: ${error.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setMetadata(null);
    setError(null);
  };

  return {
    sendMessage,
    reset,
    loading,
    messages,
    metadata,
    error,
    hasMessages: messages.length > 0,
  };
}
