# API Integration Patterns

## React Hooks for Agent Communication

### useAgenticWorker Hook
```typescript
// hooks/useAgenticWorker.ts
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AgentQuery {
  type: string;
  data: any;
  context?: Record<string, any>;
}

interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
  execution_time_ms?: number;
}

export function useAgenticWorker() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<AgentResponse | null>(null);

  const query = async (queryData: AgentQuery): Promise<AgentResponse> => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('agentic-workers-proxy', {
        body: {
          query_type: queryData.type,
          query_data: queryData.data,
          context: queryData.context || {}
        }
      });

      if (error) throw error;

      setLastResponse(data);
      return data;
    } catch (error: any) {
      const errorResponse: AgentResponse = {
        success: false,
        error: error.message || 'Agent query failed'
      };
      
      setLastResponse(errorResponse);
      toast.error(`AI Assistant: ${errorResponse.error}`);
      return errorResponse;
    } finally {
      setIsProcessing(false);
    }
  };

  const analyzeLead = async (leadData: any) => {
    return query({
      type: 'analyze_lead',
      data: leadData
    });
  };

  const suggestQuote = async (inspectionId: string) => {
    return query({
      type: 'suggest_quote',
      data: { inspection_id: inspectionId }
    });
  };

  const generateFollowup = async (quoteId: string) => {
    return query({
      type: 'generate_followup',
      data: { quote_id: quoteId }
    });
  };

  const generateContent = async (jobId: string) => {
    return query({
      type: 'generate_content',
      data: { job_id: jobId }
    });
  };

  return {
    query,
    analyzeLead,
    suggestQuote,
    generateFollowup,
    generateContent,
    isProcessing,
    lastResponse
  };
}
```

### Usage in Components

#### Lead Detail Page - AI Analysis
```typescript
// pages/LeadDetail.tsx
import { useAgenticWorker } from '@/hooks/useAgenticWorker';

function LeadDetail({ leadId }: { leadId: string }) {
  const { analyzeLead, isProcessing } = useAgenticWorker();
  const [aiInsights, setAiInsights] = useState<any>(null);

  const handleAnalyze = async () => {
    const response = await analyzeLead({
      id: leadId,
      name: lead.name,
      service: lead.service,
      suburb: lead.suburb,
      message: lead.message
    });

    if (response.success) {
      setAiInsights(response.data);
      toast.success('AI analysis complete');
    }
  };

  return (
    <div>
      <Button onClick={handleAnalyze} disabled={isProcessing}>
        {isProcessing ? 'Analyzing...' : 'AI Analyze Lead'}
      </Button>

      {aiInsights && (
        <Card>
          <CardHeader>
            <CardTitle>AI Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={aiInsights.urgency === 'high' ? 'destructive' : 'default'}>
                {aiInsights.urgency} urgency
              </Badge>
              <p className="text-sm">Score: {aiInsights.score}/100</p>
              <p className="text-sm">Sentiment: {aiInsights.sentiment}</p>
              <div>
                {aiInsights.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="mr-1">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                {aiInsights.reasoning}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

#### Quote Builder - AI Suggestions
```typescript
// pages/QuoteBuilderNew.tsx
import { useAgenticWorker } from '@/hooks/useAgenticWorker';

function QuoteBuilder({ inspectionId }: { inspectionId: string }) {
  const { suggestQuote, isProcessing } = useAgenticWorker();
  const [suggestedItems, setSuggestedItems] = useState<any[]>([]);

  const handleAISuggest = async () => {
    const response = await suggestQuote(inspectionId);

    if (response.success) {
      setSuggestedItems(response.data.line_items);
      // Pre-fill form with suggestions
      form.setValue('line_items', response.data.line_items);
      form.setValue('subtotal', response.data.subtotal);
      toast.success('Quote suggestions applied');
    }
  };

  return (
    <div>
      <Button onClick={handleAISuggest} disabled={isProcessing} variant="outline">
        <Sparkles className="mr-2 h-4 w-4" />
        {isProcessing ? 'Generating...' : 'AI Suggest Line Items'}
      </Button>

      {suggestedItems.length > 0 && (
        <Alert>
          <AlertDescription>
            AI suggested {suggestedItems.length} line items based on inspection
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
```

## Edge Function: Agentic Workers Proxy

```typescript
// supabase/functions/agentic-workers-proxy/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  try {
    const { query_type, query_data, context } = await req.json();
    const AGENT_API_KEY = Deno.env.get('AGENTIC_WORKERS_API_KEY');
    const AGENT_ID = Deno.env.get('AGENTIC_WORKERS_AGENT_ID');
    const BASE_URL = Deno.env.get('AGENTIC_WORKERS_BASE_URL');

    // Call Agentic Workers API
    const agentResponse = await fetch(`${BASE_URL}/agents/${AGENT_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AGENT_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query_type,
        data: query_data,
        context: {
          ...context,
          source: 'lovable_portal',
          timestamp: new Date().toISOString()
        }
      })
    });

    if (!agentResponse.ok) {
      throw new Error(`Agent API error: ${agentResponse.status}`);
    }

    const result = await agentResponse.json();
    const executionTime = Date.now() - startTime;

    // Log agent interaction
    await supabase.from('ai_actions').insert({
      action_type: query_type,
      input_data: { query_data, context },
      output_data: result,
      execution_time_ms: executionTime,
      status: 'success'
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        execution_time_ms: executionTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Agent proxy error:', error);

    // Log failed interaction
    await supabase.from('ai_actions').insert({
      action_type: 'proxy_error',
      input_data: { error: error.message },
      status: 'error',
      execution_time_ms: Date.now() - startTime
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
```

## Caching Strategy

### Cache Agent Responses
```typescript
// lib/agentCache.ts
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

export function getCachedResponse(key: string): any | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  
  return cached.data;
}

export function setCachedResponse(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

// Usage in hook
export function useAgenticWorker() {
  const query = async (queryData: AgentQuery): Promise<AgentResponse> => {
    const cacheKey = JSON.stringify(queryData);
    const cached = getCachedResponse(cacheKey);
    
    if (cached) {
      console.log('Using cached agent response');
      return cached;
    }
    
    setIsProcessing(true);
    // ... make API call
    
    if (response.success) {
      setCachedResponse(cacheKey, response);
    }
    
    return response;
  };
}
```

## Type Safety

### Agent API Types
```typescript
// types/agent.ts
export interface LeadAnalysisInput {
  id: string;
  name: string;
  phone: string;
  service: string;
  suburb: string;
  message?: string;
}

export interface LeadAnalysisOutput {
  score: number; // 0-100
  urgency: 'low' | 'medium' | 'high';
  sentiment: 'negative' | 'neutral' | 'positive';
  tags: string[];
  reasoning: string;
  recommended_actions: string[];
}

export interface QuoteSuggestionInput {
  inspection_id: string;
}

export interface QuoteSuggestionOutput {
  line_items: Array<{
    description: string;
    quantity: number;
    unit: string;
    unit_price: number;
    total: number;
  }>;
  subtotal: number;
  gst: number;
  total_inc_gst: number;
  tier_recommendation: 'good' | 'better' | 'best';
  reasoning: string;
}

export interface ContentGenerationInput {
  job_id: string;
}

export interface ContentGenerationOutput {
  social_variants: Array<{
    framework: 'PAS' | 'AIDA' | 'BAB';
    platform: string;
    text: string;
    hashtags: string[];
    suggested_time: string;
  }>;
  blog_draft?: {
    title: string;
    content: string;
    meta_description: string;
  };
}
```

## Real-World Examples

### Example 1: Auto-Score New Leads
```typescript
// Webhook trigger automatically scores leads
// Display results in Leads Pipeline

function LeadsPipeline() {
  const { data: leads } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      return data;
    }
  });

  return (
    <Table>
      {leads?.map(lead => (
        <TableRow key={lead.id}>
          <TableCell>{lead.name}</TableCell>
          <TableCell>
            {lead.ai_score && (
              <Badge variant={lead.ai_score > 70 ? 'default' : 'secondary'}>
                Score: {lead.ai_score}
              </Badge>
            )}
          </TableCell>
          <TableCell>
            {lead.urgency && (
              <Badge variant={lead.urgency === 'high' ? 'destructive' : 'outline'}>
                {lead.urgency}
              </Badge>
            )}
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}
```

### Example 2: Generate Quote from Inspection
```typescript
function QuoteFromInspection({ inspectionId }: { inspectionId: string }) {
  const { suggestQuote, isProcessing } = useAgenticWorker();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    const response = await suggestQuote(inspectionId);
    
    if (response.success) {
      // Navigate to quote builder with pre-filled data
      navigate('/quotes/new', {
        state: {
          inspection_id: inspectionId,
          suggested_line_items: response.data.line_items,
          suggested_total: response.data.total_inc_gst
        }
      });
    }
  };

  return (
    <Button onClick={handleGenerate} disabled={isProcessing}>
      <Sparkles className="mr-2 h-4 w-4" />
      {isProcessing ? 'Generating Quote...' : 'AI Generate Quote'}
    </Button>
  );
}
```

### Example 3: Draft Follow-up Email
```typescript
function QuoteFollowupButton({ quoteId }: { quoteId: string }) {
  const { generateFollowup, isProcessing } = useAgenticWorker();
  const [emailDraft, setEmailDraft] = useState<string | null>(null);

  const handleDraftFollowup = async () => {
    const response = await generateFollowup(quoteId);
    
    if (response.success) {
      setEmailDraft(response.data.email_body);
    }
  };

  return (
    <div>
      <Button onClick={handleDraftFollowup} disabled={isProcessing}>
        {isProcessing ? 'Drafting...' : 'AI Draft Follow-up'}
      </Button>

      {emailDraft && (
        <Dialog>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Follow-up Email Draft</DialogTitle>
            </DialogHeader>
            <Textarea value={emailDraft} onChange={(e) => setEmailDraft(e.target.value)} rows={10} />
            <DialogFooter>
              <Button variant="outline">Edit</Button>
              <Button>Send Email</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
```

## Next Steps
1. Implement `useAgenticWorker` hook
2. Deploy `agentic-workers-proxy` edge function
3. Add AI buttons to key pages (Leads, Quotes, Jobs)
4. Test with real data
5. Monitor performance and cache hit rates
