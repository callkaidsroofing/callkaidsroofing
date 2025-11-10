import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PricingItem {
  itemId: string;
  itemName: string;
  itemCategory: string;
  unitOfMeasure: string;
  baseCost: number;
  supplierInfo: {
    preferredSupplier: string;
    supplierCode: string | null;
  };
  usageNotes: string;
  qualityTier: string;
  versionHistory: Array<{ date: string; cost: number }>;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { action, data: pricingData } = await req.json();

    if (action === 'sync_from_json') {
      const results = { success: 0, failed: 0, errors: [] as string[] };

      // Process all categories
      const categories = ['labour', 'tileMaterials', 'metalMaterials', 'paintAndCoatings', 'overheadsAndRepairs'];
      
      for (const category of categories) {
        const items = pricingData[category] || [];
        
        for (const item of items) {
          try {
            // Generate embedding text
            const embeddingText = `${item.itemName} ${item.itemCategory} ${item.usageNotes} ${item.qualityTier}`;
            const embedding = await generateEmbedding(embeddingText);

            // Upsert pricing item
            const { error } = await supabase
              .from('pricing_items')
              .upsert({
                item_id: item.itemId,
                item_name: item.itemName,
                item_category: category,
                unit_of_measure: item.unitOfMeasure,
                base_cost: item.baseCost,
                preferred_supplier: item.supplierInfo.preferredSupplier,
                supplier_code: item.supplierInfo.supplierCode,
                usage_notes: item.usageNotes,
                quality_tier: item.qualityTier,
                version_history: item.versionHistory,
                embedding: `[${embedding.join(',')}]`,
                active: true,
              }, {
                onConflict: 'item_id'
              });

            if (error) {
              results.failed++;
              results.errors.push(`${item.itemId}: ${error.message}`);
            } else {
              results.success++;
            }
          } catch (error) {
            results.failed++;
            results.errors.push(`${item.itemId}: ${error.message}`);
          }
        }
      }

      // Update pricing constants
      const { financialConstants } = pricingData;
      if (financialConstants) {
        await supabase
          .from('pricing_constants')
          .update({
            material_markup: financialConstants.materialMarkup.value,
            contingency: financialConstants.contingency.value,
            profit_margin: financialConstants.profitMargin.value,
            gst: financialConstants.gst.value,
          })
          .eq('constant_id', 'FIN_CONST_V1');
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          results,
          message: `Synced ${results.success} items, ${results.failed} failed`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'refresh_embeddings') {
      // Refresh embeddings for items without them
      const { data: items, error: fetchError } = await supabase
        .from('pricing_items')
        .select('*')
        .is('embedding', null)
        .limit(50);

      if (fetchError) throw fetchError;

      let updated = 0;
      for (const item of items || []) {
        const embeddingText = `${item.item_name} ${item.item_category} ${item.usage_notes} ${item.quality_tier}`;
        const embedding = await generateEmbedding(embeddingText);

        await supabase
          .from('pricing_items')
          .update({ embedding: `[${embedding.join(',')}]` })
          .eq('id', item.id);
        
        updated++;
      }

      return new Response(
        JSON.stringify({ success: true, updated }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
