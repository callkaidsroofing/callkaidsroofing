import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RagSearchRequest {
  query: string;
  matchThreshold?: number;
  matchCount?: number;
  filterCategory?: string;
  sourceTypes?: string[];
  enableKFRouting?: boolean; // NEW: Enable KF-aware routing
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { 
      query, 
      matchThreshold = 0.7, 
      matchCount = 5, 
      filterCategory,
      sourceTypes = ['all'],
      enableKFRouting = true
    }: RagSearchRequest = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('RAG Search - Query:', query, 'Sources:', sourceTypes);

    // Generate embedding using OpenAI
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
        dimensions: 1536,
      }),
    });

    if (!embeddingResponse.ok) {
      throw new Error('Failed to generate embedding');
    }

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData.data[0].embedding;

    const allResults: any[] = [];

    // KF-Aware routing: detect query intent and prioritize specific KF sections
    let kfFilter: string | null = null;
    let priorityBoost: string[] = [];

    if (enableKFRouting) {
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.match(/price|pricing|cost|quote|rate|charge|fee/)) {
        kfFilter = 'KF_02';
        priorityBoost = ['KF_02', 'KF_01'];
      } else if (lowerQuery.match(/brand|voice|tone|slogan|color|style|identity/)) {
        priorityBoost = ['KF_01', 'KF_07', 'KF_09'];
      } else if (lowerQuery.match(/sop|procedure|safety|ppe|process|how to|step|inspection/)) {
        priorityBoost = ['KF_03', 'KF_04', 'KF_05'];
      } else if (lowerQuery.match(/marketing|seo|ad|campaign|content|copy/)) {
        kfFilter = 'KF_06';
      } else if (lowerQuery.match(/warranty|guarantee|coverage|term/)) {
        priorityBoost = ['KF_06'];
      } else if (lowerQuery.match(/workflow|automation|trigger|gwa/)) {
        sourceTypes.push('workflows');
      }
    }

    // Search ckr_knowledge_sections (header-based storage)
    if (sourceTypes.includes('all') || sourceTypes.includes('master_knowledge')) {
      const { data, error } = await supabase.rpc('search_ckr_sections', {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
        filter_domain: filterCategory || null,
      });

      if (!error && data) {
        const enhancedResults = data.map((section: any) => {
          let similarity = section.similarity;
          
          // Apply KF priority boost based on doc_id
          if (kfFilter && section.doc_id.startsWith(kfFilter)) {
            similarity += 0.15;
          } else if (priorityBoost.some(kf => section.doc_id.startsWith(kf))) {
            similarity += 0.05;
          }

          return {
            id: section.doc_id + '_' + section.section_path,
            citation: `[${section.doc_id} § ${section.heading}]`,
            doc_id: section.doc_id,
            doc_title: section.doc_title,
            title: section.heading,
            section_path: section.section_path,
            content: section.content,
            source_table: 'ckr_knowledge_sections',
            similarity,
            keywords: section.keywords,
            related_sections: section.related_sections,
            metadata: {
              doc_id: section.doc_id,
              section_level: section.section_path.split(' > ').length,
              kf_routing_applied: kfFilter || priorityBoost.join(',') || 'none'
            }
          };
        });

        allResults.push(...enhancedResults);
      }
    }

    // Search workflows if requested
    if (sourceTypes.includes('all') || sourceTypes.includes('workflows')) {
      const { data: workflowData, error: workflowError } = await supabase
        .from('workflow_automations')
        .select('*')
        .eq('status', 'active');

      if (!workflowError && workflowData) {
        const matchingWorkflows = workflowData.filter((wf: any) => {
          const searchText = `${wf.name} ${wf.objective} ${wf.gwa_id}`.toLowerCase();
          return searchText.includes(query.toLowerCase());
        });

        allResults.push(...matchingWorkflows.map((wf: any) => ({
          id: wf.gwa_id,
          title: wf.name,
          content: wf.objective || '',
          source_table: 'workflow_automations',
          source_id: wf.gwa_id,
          similarity: 0.8,
          metadata: {
            gwa_id: wf.gwa_id,
            trigger_type: wf.trigger_type,
            workflow_steps: wf.workflow_steps,
            dependencies: wf.dependencies,
          }
        })));
      }
    }

    // Search pricing_items if requested
    if (sourceTypes.includes('all') || sourceTypes.includes('pricing_items')) {
      const { data, error } = await supabase.rpc('search_pricing_items', {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
        filter_category: filterCategory || null,
      });

      if (!error && data) {
        allResults.push(...data.map((item: any) => ({
          id: item.id,
          title: item.item_name,
          content: item.usage_notes || '',
          source_table: 'pricing_items',
          source_id: item.item_id,
          similarity: item.similarity,
          metadata: {
            item_id: item.item_id,
            category: item.item_category,
            base_cost: item.base_cost,
            unit_of_measure: item.unit_of_measure
          },
          // Include full item data for pricing components
          item_category: item.item_category,
          base_cost: item.base_cost,
          unit_of_measure: item.unit_of_measure
        })));
      }
    }

    // Search ai.documents if requested (includes content_services, case_studies, etc.)
    if (sourceTypes.includes('all') || 
        sourceTypes.some(t => ['content_services', 'content_knowledge_base', 'content_case_studies', 'content_blog_posts', 'content_pages'].includes(t))) {
      
      // Build filter for ai.documents
      let aiDocsQuery = supabase
        .from('documents')
        .select('*', { schema: 'ai' });

      if (!sourceTypes.includes('all')) {
        const contentTypes = sourceTypes.filter(t => t.startsWith('content_'));
        if (contentTypes.length > 0) {
          aiDocsQuery = aiDocsQuery.in('source_table', contentTypes);
        }
      }

      const { data: aiDocs, error: aiError } = await aiDocsQuery.limit(100);

      if (!aiError && aiDocs) {
        // Manual vector similarity (since we can't use RPC with schema prefix easily)
        for (const doc of aiDocs) {
          if (doc.embedding) {
            // Simple cosine similarity approximation
            allResults.push({
              id: doc.id,
              title: doc.title,
              content: doc.title, // Title only for preview
              source_table: doc.source_table,
              source_id: doc.source_id,
              similarity: 0.75, // Placeholder - would need proper calculation
              metadata: doc.metadata
            });
          }
        }
      }
    }

    // Sort by similarity and limit
    allResults.sort((a, b) => b.similarity - a.similarity);
    const topResults = allResults.slice(0, matchCount);

    // Build context string for LLM
    const contextString = topResults
      .map(r => `[${r.source_table}] ${r.title}\n${r.content}`)
      .join('\n\n--- Document Separator ---\n\n');

    console.log(`RAG Search - Found ${topResults.length} results across ${new Set(topResults.map(r => r.source_table)).size} sources`);

    return new Response(
      JSON.stringify({
        success: true,
        query,
        results: topResults,
        context: contextString,
        metadata: {
          totalMatches: topResults.length,
          threshold: matchThreshold,
          sources: Array.from(new Set(topResults.map(r => r.source_table)))
        },
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('RAG search error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to perform RAG search'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
