import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface NexusAIOptions {
  onStart?: () => void;
  onComplete?: (response: string) => void;
  onError?: (error: string) => void;
  context?: Record<string, any>;
}

export interface NexusAIResponse {
  response: string;
  classification: {
    intent: string;
    confidence: number;
    executionPlan: any[];
  };
  executionResults: any[];
  executionTime: number;
}

/**
 * Hook to access Nexus AI from anywhere in your app
 * 
 * @example
 * const { ask, isProcessing } = useNexusAI();
 * 
 * // Ask AI to create a lead
 * const result = await ask("Create a lead for John at 0412345678 in Berwick for roof painting");
 * 
 * // Ask AI to search
 * const leads = await ask("Show me all hot leads from this week");
 * 
 * // Ask AI to generate content
 * const quote = await ask("Generate a premium quote for report abc-123");
 */
export function useNexusAI(options?: NexusAIOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<NexusAIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ask = async (
    message: string, 
    customContext?: Record<string, any>
  ): Promise<NexusAIResponse | null> => {
    setIsProcessing(true);
    setError(null);
    options?.onStart?.();

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('nexus-ai-hub', {
        body: {
          message,
          context: {
            ...options?.context,
            ...customContext,
          },
        },
      });

      if (invokeError) throw invokeError;

      setLastResponse(data);
      options?.onComplete?.(data.response);
      return data;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process AI request';
      setError(errorMessage);
      options?.onError?.(errorMessage);
      console.error('Nexus AI error:', err);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  /**
   * Pre-built commands for common CRM actions
   */
  const commands = {
    /**
     * Create a new lead
     * @example createLead({ name: "John Smith", phone: "0412345678", suburb: "Berwick", service: "Roof Painting" })
     */
    createLead: (lead: { name: string; phone: string; suburb: string; service: string; email?: string }) => 
      ask(`Create a new lead: Name=${lead.name}, Phone=${lead.phone}, Suburb=${lead.suburb}, Service=${lead.service}${lead.email ? `, Email=${lead.email}` : ''}`),

    /**
     * Search leads with filters
     * @example searchLeads({ suburb: "Berwick", status: "new" })
     */
    searchLeads: (filters: Record<string, any>) => 
      ask(`Search leads: ${Object.entries(filters).map(([k, v]) => `${k}=${v}`).join(', ')}`),

    /**
     * Update lead status
     * @example updateLeadStatus("lead-id", "contacted", "Called and left voicemail")
     */
    updateLeadStatus: (leadId: string, status: string, notes?: string) => 
      ask(`Update lead ${leadId} status to ${status}${notes ? `: ${notes}` : ''}`),

    /**
     * Generate a quote
     * @example generateQuote("report-id", "premium")
     */
    generateQuote: (reportId: string, tier: 'essential' | 'premium' | 'prestige') => 
      ask(`Generate ${tier} quote for inspection report ${reportId}`),

    /**
     * Get lead timeline
     * @example getLeadTimeline("lead-id")
     */
    getLeadTimeline: (leadId: string) => 
      ask(`Show complete timeline for lead ${leadId}`),

    /**
     * Schedule follow-up
     * @example scheduleFollowup("quote-id", 3, "email")
     */
    scheduleFollowup: (quoteId: string, days: number, method: 'email' | 'call' | 'sms') => 
      ask(`Schedule ${method} follow-up for quote ${quoteId} in ${days} days`),

    /**
     * Analyze business metrics
     * @example analyzeMetrics("last 30 days")
     */
    analyzeMetrics: (timeframe: string) => 
      ask(`Analyze business performance for ${timeframe}`),
  };

  return {
    ask,
    commands,
    isProcessing,
    lastResponse,
    error,
  };
}
