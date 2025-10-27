import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AgentJob {
  type: 'score_leads' | 'followup_quotes' | 'generate_content';
  payload?: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { job }: { job: AgentJob } = await req.json();

    console.log(`[AI Agent Scheduler] Starting job: ${job.type}`);

    let result;
    switch (job.type) {
      case 'score_leads':
        result = await scoreLeads(supabase);
        break;
      case 'followup_quotes':
        result = await followupQuotes(supabase);
        break;
      case 'generate_content':
        result = await generateContent(supabase);
        break;
      default:
        throw new Error(`Unknown job type: ${job.type}`);
    }

    // Log the job execution
    await supabase.from('ai_actions').insert({
      action: job.type,
      subject_id: null,
      meta: { result },
      status: 'completed'
    });

    return new Response(
      JSON.stringify({ success: true, job: job.type, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[AI Agent Scheduler] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Score and enrich leads with AI
async function scoreLeads(supabase: any) {
  const { data: leads } = await supabase
    .from('leads')
    .select('*')
    .is('ai_score', null)
    .limit(50);

  if (!leads?.length) {
    return { processed: 0, message: 'No leads to score' };
  }

  const updates = leads.map((lead: any) => {
    // Simple scoring algorithm
    let score = 50;
    
    // Boost for urgency keywords
    if (lead.message?.toLowerCase().includes('urgent') || lead.message?.toLowerCase().includes('leak')) {
      score += 20;
    }
    
    // Boost for high-value services
    if (lead.service?.toLowerCase().includes('restoration') || lead.service?.toLowerCase().includes('reroof')) {
      score += 15;
    }
    
    // Boost for service area match
    if (lead.service_area_match) {
      score += 10;
    }

    const tags = [];
    if (score >= 75) tags.push('hot');
    if (lead.message?.toLowerCase().includes('leak')) tags.push('urgent');
    if (lead.service?.toLowerCase().includes('restoration')) tags.push('high-value');

    return supabase
      .from('leads')
      .update({ 
        ai_score: Math.min(score, 100),
        ai_tags: tags,
        auto_enriched_at: new Date().toISOString()
      })
      .eq('id', lead.id);
  });

  await Promise.all(updates);

  return { processed: leads.length };
}

// Follow up on stale quotes
async function followupQuotes(supabase: any) {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const { data: quotes } = await supabase
    .from('quotes')
    .select('*, leads(*)')
    .eq('status', 'sent')
    .lt('created_at', threeDaysAgo.toISOString())
    .limit(20);

  if (!quotes?.length) {
    return { processed: 0, message: 'No quotes need followup' };
  }

  // Send followup notifications
  for (const quote of quotes) {
    await supabase.functions.invoke('notification-service', {
      body: { 
        type: 'quote_followup',
        quoteId: quote.id,
        leadEmail: quote.leads?.email,
        leadPhone: quote.leads?.phone
      }
    });
  }

  return { processed: quotes.length };
}

// Generate content for marketing
async function generateContent(supabase: any) {
  // Check if we have content in queue
  const { data: existingQueue } = await supabase
    .from('content_queue')
    .select('id')
    .eq('status', 'pending_review')
    .limit(1);

  if (existingQueue?.length) {
    return { message: 'Content already in queue for review' };
  }

  // Generate a blog post idea based on recent case studies
  const { data: recentCases } = await supabase
    .from('content_case_studies')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3);

  if (!recentCases?.length) {
    return { message: 'No case studies available for content generation' };
  }

  // Create content queue item
  const contentIdea = {
    type: 'blog',
    title: `${recentCases[0].job_type} Success Story in ${recentCases[0].suburb}`,
    summary: `Learn how we transformed a roof in ${recentCases[0].suburb} with our professional ${recentCases[0].job_type} service.`,
    case_study_refs: recentCases.map(c => c.id)
  };

  await supabase.from('content_queue').insert({
    content_type: 'blog_post',
    generated_content: contentIdea,
    ai_confidence_score: 0.85,
    status: 'pending_review'
  });

  return { generated: 1, type: 'blog_post' };
}
