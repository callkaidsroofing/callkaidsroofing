import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Tool registry - what AI can do
const TOOL_REGISTRY = {
  query_leads: { desc: 'Search/filter/analyze leads table', schema: { filters: 'object' } },
  query_quotes: { desc: 'Search quotes with filters', schema: { filters: 'object' } },
  query_jobs: { desc: 'Active jobs, completion status', schema: { filters: 'object' } },
  analyze_trends: { desc: 'Revenue, conversion patterns', schema: { timeframe: 'string' } },
  generate_quote: { desc: 'Full quote from inspection or description', schema: { reportId: 'string', tier: 'string' } },
  modify_quote: { desc: 'Adjust pricing, line items', schema: { quoteId: 'string', changes: 'object' } },
  create_blog_post: { desc: 'Generate SEO blog from recent jobs', schema: { topic: 'string' } },
  create_social_post: { desc: 'Facebook/Instagram with images', schema: { content: 'string' } },
  analyze_pricing: { desc: 'Suggest pricing changes', schema: { service: 'string' } },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, context } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader! } }
    });

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader?.replace('Bearer ', '')!);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const startTime = Date.now();

    // Step 1: Classify intent using Gemini 2.5 Flash
    const intentResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are CKR Nexus AI, analyzing user requests for a roofing business.
Classify the intent and create an execution plan using available tools: ${Object.keys(TOOL_REGISTRY).join(', ')}

Context: ${JSON.stringify(context || {})}

Respond ONLY with valid JSON in this format:
{
  "intent": "data_query|quote_generation|optimization|marketing|system_modification",
  "confidence": 0.0-1.0,
  "executionPlan": [
    {"tool": "tool_name", "params": {...}, "outputVar": "varName"}
  ],
  "requiresApproval": boolean,
  "estimatedTime": seconds
}`
          },
          { role: 'user', content: message }
        ],
        response_format: { type: 'json_object' }
      }),
    });

    if (!intentResponse.ok) {
      throw new Error('Intent classification failed');
    }

    const intentData = await intentResponse.json();
    const classification = JSON.parse(intentData.choices[0].message.content);

    // Step 2: Execute plan
    const executionResults: any[] = [];
    let variables: Record<string, any> = {};

    for (const step of classification.executionPlan) {
      // Replace variables in params
      const resolvedParams = JSON.parse(
        JSON.stringify(step.params).replace(/\$\{(\w+)\}/g, (_, v) => variables[v] || '')
      );

      let result;
      
      switch (step.tool) {
        case 'query_leads':
          result = await supabase.from('leads').select('*').match(resolvedParams.filters || {});
          break;
        
        case 'query_quotes':
          result = await supabase.from('quotes').select('*').match(resolvedParams.filters || {});
          break;

        case 'generate_quote':
          // Call existing generate-quote function
          result = await supabase.functions.invoke('generate-quote', {
            body: resolvedParams
          });
          break;

        case 'analyze_trends':
          // Analyze data patterns
          const { data: recentJobs } = await supabase
            .from('inspection_reports')
            .select('*')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false });
          
          result = { data: { jobCount: recentJobs?.length || 0, recentJobs } };
          break;

        default:
          result = { data: { message: `Tool ${step.tool} not yet implemented` } };
      }

      executionResults.push({ tool: step.tool, result: result.data });
      if (step.outputVar) {
        variables[step.outputVar] = result.data;
      }
    }

    // Step 3: Generate natural language response
    const responseGeneration = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are CKR Nexus AI assistant. Convert execution results into friendly, conversational responses for a roofing business owner.
Be concise, highlight key insights, and suggest next actions.`
          },
          {
            role: 'user',
            content: `User asked: "${message}"
            
Execution results: ${JSON.stringify(executionResults, null, 2)}

Provide a helpful response:`
          }
        ]
      }),
    });

    const responseData = await responseGeneration.json();
    const aiResponse = responseData.choices[0].message.content;

    const executionTime = Date.now() - startTime;

    // Log action
    await supabase.from('ai_action_log').insert({
      user_id: user.id,
      action_type: classification.intent,
      intent: classification.intent,
      user_message: message,
      execution_plan: classification.executionPlan,
      tools_used: classification.executionPlan.map((s: any) => s.tool),
      results: { executionResults },
      success: true,
      execution_time_ms: executionTime,
      cost_usd: 0.03, // Approximate
      executed_at: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({
        success: true,
        response: aiResponse,
        classification,
        executionResults,
        executionTime,
        conversationId: conversationId || crypto.randomUUID(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in nexus-ai-hub:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
