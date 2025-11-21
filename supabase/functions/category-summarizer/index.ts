import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CategorySummaryRequest {
  category: 'sops' | 'pricing' | 'inspections' | 'quotes' | 'services' | 'general';
  includeOperationalData?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

    if (!lovableApiKey) {
      return new Response(JSON.stringify({ error: 'LOVABLE_API_KEY not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { category, includeOperationalData = true }: CategorySummaryRequest = await req.json();

    let kbQuery = '';
    let operationalQuery = '';
    let kbFiles = [];
    let operationalData: any = {};

    // Define queries based on category
    switch (category) {
      case 'sops':
        kbQuery = 'SOPs, procedures, workflows, safety protocols';
        
        if (includeOperationalData) {
          const { data: forms } = await supabase
            .from('form_definitions')
            .select('name, description, outputs')
            .eq('is_published', true);
          operationalData.forms = forms;
        }
        break;

      case 'pricing':
        kbQuery = 'pricing, rates, cost calculations, labour rates';
        
        if (includeOperationalData) {
          const { data: recentQuotes } = await supabase
            .from('quotes')
            .select('id, quote_number, subtotal, created_at')
            .order('created_at', { ascending: false })
            .limit(10);
          operationalData.recentQuotes = recentQuotes;
        }
        break;

      case 'inspections':
        kbQuery = 'inspection procedures, reporting guidelines, assessment criteria';
        
        if (includeOperationalData) {
          const { data: recentReports, count } = await supabase
            .from('inspection_reports')
            .select('id, clientName, status', { count: 'exact' })
            .order('created_at', { ascending: false })
            .limit(5);
          operationalData.recentReports = recentReports;
          operationalData.totalReports = count;
        }
        break;

      case 'quotes':
        kbQuery = 'quote procedures, templates, approval workflow';
        
        if (includeOperationalData) {
          const { data: quoteStats } = await supabase
            .from('quotes')
            .select('status')
            .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
          
          const statusCounts = (quoteStats || []).reduce((acc, q) => {
            acc[q.status] = (acc[q.status] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);
          
          operationalData.quoteStats = statusCounts;
        }
        break;

      case 'services':
        kbQuery = 'services offered, service categories, capabilities';
        
        if (includeOperationalData) {
          const { data: services } = await supabase
            .from('content_services')
            .select('name, service_category, featured')
            .order('display_order', { ascending: true });
          operationalData.services = services;
        }
        break;

      default:
        kbQuery = category;
    }

    // Search knowledge base using RAG
    const { data: ragData, error: ragError } = await supabase.functions.invoke('rag-search', {
      body: {
        query: kbQuery,
        matchThreshold: 0.6,
        matchCount: 10
      }
    });

    if (ragError) {
      console.error('RAG search error:', ragError);
    }

    const kbContext = ragData?.context || 'No knowledge base content found';

    // Get relevant KB files
    const { data: files } = await supabase
      .from('knowledge_files')
      .select('file_key, title, category, updated_at')
      .eq('active', true)
      .order('updated_at', { ascending: false });

    kbFiles = files || [];

    // Generate AI summary
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: `You are a knowledge base summarizer for Call Kaids Roofing. Generate a concise, structured summary for the "${category}" category. Include:
1. Overview (2-3 sentences)
2. Key Points (bullet list)
3. Recent Updates (if any)
4. Status/Metrics (if operational data provided)

Format as markdown with clear headings.`
          },
          {
            role: 'user',
            content: `**Knowledge Base Context:**\n${kbContext}\n\n**Operational Data:**\n${JSON.stringify(operationalData, null, 2)}\n\n**Available Files:**\n${kbFiles.map(f => `- ${f.title} (${f.file_key}) - updated ${new Date(f.updated_at).toLocaleDateString()}`).join('\n')}`
          }
        ],
        temperature: 0.5
      }),
    });

    if (!aiResponse.ok) {
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const summary = aiData.choices[0].message.content;

    return new Response(JSON.stringify({
      success: true,
      category,
      summary,
      sources: {
        knowledgeBase: {
          files: kbFiles,
          chunks: ragData?.chunks?.length || 0
        },
        operational: operationalData
      },
      generatedAt: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Category summarizer error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
