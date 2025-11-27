import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { loadMKF } from "../_shared/mkf-loader.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('[Agent Lead Intelligence] Starting analysis...');

    // Get new/unscored leads from last 24 hours
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .is('ai_score', null)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (leadsError) throw leadsError;

    if (!leads || leads.length === 0) {
      console.log('[Agent Lead Intelligence] No new leads to process');
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[Agent Lead Intelligence] Processing ${leads.length} leads`);

    const results = [];

    for (const lead of leads) {
      try {
        // Load MKF for lead scoring
        const mkfPrompt = await loadMKF('agent-lead-intelligence', supabase, {
          customPrompt: `You qualify leads for Call Kaids Roofing in SE Melbourne.

Score leads 1-10 based on:
- Service complexity (restorations=high, repairs=medium, cleaning=low)
- Urgency indicators (leak, emergency, urgent, storm damage)
- Suburb proximity (verify against MKF_00 service area)
- Message detail level (specific issues vs vague inquiries)

Respond ONLY with valid JSON:
{
  "score": 1-10,
  "tags": ["hot_lead" | "needs_followup" | "out_of_area" | "low_priority"],
  "urgency": "low|medium|high|emergency",
  "reasoning": "brief explanation"
}`
        });

        // AI scoring using Gemini 2.5 Flash
        const scoreResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${lovableApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: mkfPrompt },
              {
                role: 'user',
                content: `Lead: ${lead.name}
Suburb: ${lead.suburb}
Service: ${lead.service}
Message: ${lead.message || 'No message'}
Phone: ${lead.phone}
Email: ${lead.email || 'N/A'}`
              }
            ],
            response_format: { type: 'json_object' }
          }),
        });

        const scoreData = await scoreResponse.json();
        const analysis = JSON.parse(scoreData.choices[0].message.content);

        // Check service area (SE Melbourne suburbs within 50km)
        const serviceAreaSuburbs = [
          'berwick', 'cranbourne', 'clyde', 'pakenham', 'officer', 'narre warren',
          'dandenong', 'rowville', 'keysborough', 'springvale', 'noble park',
          'hallam', 'hampton park', 'lyndhurst', 'endeavour hills'
        ];
        
        const serviceAreaMatch = serviceAreaSuburbs.some(suburb => 
          lead.suburb.toLowerCase().includes(suburb)
        );

        // Update lead
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            ai_score: analysis.score,
            ai_tags: analysis.tags,
            service_area_match: serviceAreaMatch,
            auto_enriched_at: new Date().toISOString(),
          })
          .eq('id', lead.id);

        if (updateError) throw updateError;

        // Create high-priority task for hot leads
        if (analysis.tags.includes('hot_lead') && analysis.score >= 8) {
          await supabase.from('lead_tasks').insert({
            lead_id: lead.id,
            task_type: 'follow_up',
            title: `🔥 HOT LEAD: ${lead.name} - ${lead.service}`,
            description: `AI Score: ${analysis.score}/10\nUrgency: ${analysis.urgency}\nReason: ${analysis.reasoning}`,
            priority: 'high',
            due_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
            status: 'pending',
          });
        }

        results.push({
          leadId: lead.id,
          name: lead.name,
          score: analysis.score,
          tags: analysis.tags,
        });

        console.log(`[Agent Lead Intelligence] Scored lead ${lead.id}: ${analysis.score}/10`);

      } catch (error: any) {
        console.error(`[Agent Lead Intelligence] Error processing lead ${lead.id}:`, error);
      }
    }

    // Log optimization data
    await supabase.from('ai_optimization_history').insert({
      agent_name: 'agent-lead-intelligence',
      version: '1.0',
      optimization_type: 'lead_scoring',
      after_metrics: { processed: results.length, timestamp: new Date().toISOString() },
    });

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('[Agent Lead Intelligence] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
