import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { loadMKF, auditMKFAction } from "../_shared/mkf-loader.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CKR-GEM API key for calling the GPT's backend
const GPT_PROXY_KEY = Deno.env.get('GPT_PROXY_KEY');

// Enhanced tool registry - maps to CKR-GEM API actions
const TOOL_REGISTRY = {
  // Direct CRM Actions (via CKR-GEM API)
  insert_lead: { 
    desc: 'Create new lead from contact info', 
    crmAction: 'InsertLeadRecord',
    schema: { name: 'string', phone: 'string', email: 'string?', service: 'string', suburb: 'string' }
  },
  update_lead_status: { 
    desc: 'Change lead status (new, contacted, quoted, won, lost)', 
    crmAction: 'UpdateLeadStatus',
    schema: { leadId: 'uuid', status: 'string', notes: 'string?' }
  },
  search_leads: { 
    desc: 'Search leads with advanced filters', 
    crmAction: 'SearchLeadsAdvanced',
    schema: { filters: 'object', sortBy: 'string?', limit: 'number?' }
  },
  fetch_lead_timeline: { 
    desc: 'Get complete history for a lead', 
    crmAction: 'FetchLeadTimeline',
    schema: { leadId: 'uuid' }
  },
  create_lead_task: { 
    desc: 'Schedule follow-up or reminder', 
    crmAction: 'CreateLeadTask',
    schema: { leadId: 'uuid', taskType: 'string', description: 'string', dueDate: 'string' }
  },
  
  // Quote Intelligence
  generate_quote: { 
    desc: 'Generate full quote from inspection', 
    crmAction: 'GenerateQuoteDraft',
    schema: { reportId: 'uuid', tier: 'string' }
  },
  send_quote: { 
    desc: 'Email quote to client', 
    crmAction: 'SendQuoteToClient',
    schema: { quoteId: 'uuid', recipientEmail: 'string' }
  },
  fetch_quotes_for_lead: { 
    desc: 'All quotes for a specific lead', 
    crmAction: 'FetchQuotesForLead',
    schema: { leadId: 'uuid' }
  },
  schedule_followup: { 
    desc: 'Auto-schedule quote follow-up', 
    crmAction: 'ScheduleQuoteFollowup',
    schema: { quoteId: 'uuid', followupInDays: 'number', method: 'string' }
  },
  
  // Job Management
  create_job: { 
    desc: 'Start new job from accepted quote', 
    crmAction: 'InsertJobRecord',
    schema: { quoteId: 'uuid', scheduledDate: 'string' }
  },
  update_job_status: { 
    desc: 'Mark job status (scheduled, in_progress, completed)', 
    crmAction: 'UpdateJobStatus',
    schema: { jobId: 'uuid', status: 'string' }
  },
  fetch_job_details: { 
    desc: 'Get job info with inspection & quote', 
    crmAction: 'FetchJobDetails',
    schema: { jobId: 'uuid' }
  },
  
  // Automation & Analytics
  bulk_update_leads: { 
    desc: 'Update multiple leads at once', 
    crmAction: 'BulkUpdateLeadStatus',
    schema: { leadIds: 'uuid[]', status: 'string', note: 'string?' }
  },
  export_leads: { 
    desc: 'Export leads to CSV', 
    crmAction: 'ExportLeadsToCSV',
    schema: { filters: 'object' }
  },
  
  // Roof Measurement
  measure_roof: {
    desc: 'Get automated roof measurements from satellite imagery',
    schema: { address: 'string' }
  },
  
  // Local Data Queries (direct Supabase)
  query_leads_local: { desc: 'Quick lead queries', schema: { filters: 'object' } },
  query_quotes_local: { desc: 'Quick quote queries', schema: { filters: 'object' } },
  analyze_trends: { desc: 'Revenue, conversion patterns', schema: { timeframe: 'string' } },
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

    // Load MKF knowledge for Nexus AI
    const mkfPrompt = await loadMKF('nexus-ai-hub', supabase, {
      customPrompt: `You are CKR Nexus AI, analyzing user requests for operations.

Classify the intent and create an execution plan using available tools: ${Object.keys(TOOL_REGISTRY).join(', ')}

Context: ${JSON.stringify(context || {})}

Follow MKF_07 authorization rules for data access.
Use MKF_05 service definitions for service-related queries.
Apply MKF_01 brand voice in responses.

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
    });

    await auditMKFAction(supabase, 'load_mkf', {
      function: 'nexus-ai-hub',
      user_id: user.id,
      message_preview: message.substring(0, 100)
    });

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
          { role: 'system', content: mkfPrompt },
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

    // Step 2: Execute plan (with CKR-GEM API integration)
    const executionResults: any[] = [];
    let variables: Record<string, any> = {};

    for (const step of classification.executionPlan) {
      // Replace variables in params
      const resolvedParams = JSON.parse(
        JSON.stringify(step.params).replace(/\$\{(\w+)\}/g, (_, v) => variables[v] || '')
      );

      let result;
      const toolDef = TOOL_REGISTRY[step.tool as keyof typeof TOOL_REGISTRY];

      // Route to CKR-GEM API if action defined
      if (toolDef?.crmAction) {
        try {
          console.log(`Calling CKR-GEM API: ${toolDef.crmAction}`, resolvedParams);
          
          const crmResponse = await fetch(`${supabaseUrl}/functions/v1/ckr-gem-api`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': GPT_PROXY_KEY || '',
            },
            body: JSON.stringify({
              action: toolDef.crmAction,
              params: resolvedParams,
              mode: 'live' // Use 'dry-run' for preview
            })
          });

          if (!crmResponse.ok) {
            const errorText = await crmResponse.text();
            throw new Error(`CKR-GEM API error: ${errorText}`);
          }

          const crmData = await crmResponse.json();
          result = { data: crmData.data, success: crmData.success };
          
        } catch (error: any) {
          console.error(`CKR-GEM API call failed:`, error);
          result = { 
            error: error.message, 
            data: { error: `Failed to execute ${toolDef.crmAction}: ${error.message}` }
          };
        }
      } else {
        // Handle local operations
        switch (step.tool) {
          case 'query_leads_local':
            result = await supabase.from('leads').select('*').match(resolvedParams.filters || {});
            break;
          
          case 'query_quotes_local':
            result = await supabase.from('quotes').select('*').match(resolvedParams.filters || {});
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

          case 'measure_roof':
            const roofResponse = await supabase.functions.invoke('get-roof-data', {
              body: { address: resolvedParams.address, saveToDatabase: true }
            });
            result = roofResponse.error 
              ? { error: roofResponse.error.message, data: null }
              : { data: roofResponse.data };
            break;

          default:
            result = { data: { message: `Tool ${step.tool} not yet implemented` } };
        }
      }

      executionResults.push({ 
        tool: step.tool, 
        crmAction: toolDef?.crmAction,
        result: result.data, 
        success: !result.error 
      });
      
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
