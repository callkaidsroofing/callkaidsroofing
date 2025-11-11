import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParsedKF {
  kf_id: string;
  title: string;
  content: string;
  version?: string;
  purpose?: string;
  dependencies?: string[];
  reviewCadence?: string;
}

interface ParsedGWA {
  gwa_id: string;
  name: string;
  version?: string;
  objective?: string;
  triggerType?: string;
  triggerCriteria?: any;
  workflowSteps?: any[];
  dependencies?: any[];
  successMetrics?: any;
}

interface BrandAsset {
  assetType: string;
  key: string;
  value: any;
  metadata?: any;
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

    const { filePath, jobId } = await req.json();

    if (!filePath) {
      throw new Error('File path is required');
    }

    console.log(`Parsing blueprint from: ${filePath}`);

    // Download file from storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('knowledge-uploads')
      .download(filePath);

    if (downloadError) throw downloadError;

    const content = await fileData.text();
    console.log(`Blueprint file size: ${content.length} characters`);

    // Update job status
    if (jobId) {
      await supabase
        .from('embedding_jobs')
        .update({ status: 'processing', started_at: new Date().toISOString() })
        .eq('id', jobId);
    }

    // Parse sections
    const kfFiles: ParsedKF[] = [];
    const gwaWorkflows: ParsedGWA[] = [];
    const brandAssets: BrandAsset[] = [];

    // Extract KF files (KF_00 through KF_11)
    const kfRegex = /### Knowledge File (KF_\d{2}):\s*([^\n]+)\n([\s\S]*?)(?=### Knowledge File KF_|### GWA-|### Database Schema|$)/g;
    let kfMatch;
    while ((kfMatch = kfRegex.exec(content)) !== null) {
      const kf_id = kfMatch[1];
      const title = kfMatch[2].trim();
      const kfContent = kfMatch[3].trim();

      // Extract metadata from content
      const versionMatch = kfContent.match(/Version:\s*([^\n]+)/);
      const purposeMatch = kfContent.match(/Purpose:\s*([^\n]+)/);
      const depsMatch = kfContent.match(/Dependencies:\s*([^\n]+)/);
      const reviewMatch = kfContent.match(/Review Cadence:\s*([^\n]+)/);

      kfFiles.push({
        kf_id,
        title,
        content: kfContent,
        version: versionMatch ? versionMatch[1].trim() : undefined,
        purpose: purposeMatch ? purposeMatch[1].trim() : undefined,
        dependencies: depsMatch ? depsMatch[1].split(',').map(d => d.trim()) : [],
        reviewCadence: reviewMatch ? reviewMatch[1].trim() : undefined,
      });
    }

    console.log(`Extracted ${kfFiles.length} KF files`);

    // Extract GWA workflows
    const gwaRegex = /### (GWA-\d{2}):\s*([^\n]+)\n([\s\S]*?)(?=### GWA-|### Database Schema|### Frontend Assets|$)/g;
    let gwaMatch;
    while ((gwaMatch = gwaRegex.exec(content)) !== null) {
      const gwa_id = gwaMatch[1];
      const name = gwaMatch[2].trim();
      const gwaContent = gwaMatch[3].trim();

      // Parse YAML-like structure
      const objectiveMatch = gwaContent.match(/Objective:\s*([^\n]+)/);
      const triggerMatch = gwaContent.match(/Trigger:\s*([^\n]+)/);
      const stepsMatch = gwaContent.match(/Steps:\s*([\s\S]*?)(?=Success Metrics:|Dependencies:|$)/);
      const metricsMatch = gwaContent.match(/Success Metrics:\s*([\s\S]*?)(?=Dependencies:|$)/);
      const depsMatch = gwaContent.match(/Dependencies:\s*([^\n]+)/);

      // Parse steps into structured format
      const steps: any[] = [];
      if (stepsMatch) {
        const stepLines = stepsMatch[1].split('\n').filter(l => l.trim().startsWith('-') || l.trim().match(/^\d+\./));
        stepLines.forEach(line => {
          const cleaned = line.trim().replace(/^[-\d.]\s*/, '');
          if (cleaned) steps.push({ description: cleaned });
        });
      }

      gwaWorkflows.push({
        gwa_id,
        name,
        objective: objectiveMatch ? objectiveMatch[1].trim() : undefined,
        triggerType: triggerMatch ? 'manual' : 'automatic',
        triggerCriteria: triggerMatch ? { description: triggerMatch[1].trim() } : {},
        workflowSteps: steps,
        dependencies: depsMatch ? depsMatch[1].split(',').map(d => ({ ref: d.trim() })) : [],
        successMetrics: metricsMatch ? { description: metricsMatch[1].trim() } : {},
      });
    }

    console.log(`Extracted ${gwaWorkflows.length} GWA workflows`);

    // Extract brand assets (colors, CTAs, etc.)
    const colorMatch = content.match(/Primary Color:\s*([^\n]+)/);
    const secondaryMatch = content.match(/Secondary Color:\s*([^\n]+)/);
    const sloganMatch = content.match(/Slogan:\s*([^\n]+)/);
    const phoneMatch = content.match(/Phone:\s*([^\n]+)/);
    const emailMatch = content.match(/Email:\s*([^\n]+)/);

    if (colorMatch) {
      brandAssets.push({ assetType: 'color', key: 'primary', value: { color: colorMatch[1].trim() } });
    }
    if (secondaryMatch) {
      brandAssets.push({ assetType: 'color', key: 'secondary', value: { color: secondaryMatch[1].trim() } });
    }
    if (sloganMatch) {
      brandAssets.push({ assetType: 'cta', key: 'slogan', value: { text: sloganMatch[1].trim() } });
    }
    if (phoneMatch) {
      brandAssets.push({ assetType: 'contact', key: 'phone', value: { phone: phoneMatch[1].trim() } });
    }
    if (emailMatch) {
      brandAssets.push({ assetType: 'contact', key: 'email', value: { email: emailMatch[1].trim() } });
    }

    console.log(`Extracted ${brandAssets.length} brand assets`);

    // Store KF metadata
    let metadataInserted = 0;
    for (const kf of kfFiles) {
      const { error } = await supabase
        .from('knowledge_file_metadata')
        .upsert({
          kf_id: kf.kf_id,
          title: kf.title,
          purpose: kf.purpose,
          version: kf.version,
          dependencies: kf.dependencies || [],
          review_cadence: kf.reviewCadence,
          file_path: filePath,
        });
      
      if (!error) metadataInserted++;
      else console.error(`Error inserting metadata for ${kf.kf_id}:`, error);
    }

    // Store GWA workflows
    let workflowsInserted = 0;
    for (const gwa of gwaWorkflows) {
      const { error } = await supabase
        .from('workflow_automations')
        .upsert({
          gwa_id: gwa.gwa_id,
          name: gwa.name,
          version: gwa.version,
          objective: gwa.objective,
          trigger_type: gwa.triggerType,
          trigger_criteria: gwa.triggerCriteria,
          workflow_steps: gwa.workflowSteps,
          dependencies: gwa.dependencies,
          success_metrics: gwa.successMetrics,
          status: 'active',
        });
      
      if (!error) workflowsInserted++;
      else console.error(`Error inserting workflow ${gwa.gwa_id}:`, error);
    }

    // Store brand assets
    let assetsInserted = 0;
    for (const asset of brandAssets) {
      const { error } = await supabase
        .from('brand_assets')
        .upsert({
          asset_type: asset.assetType,
          key: asset.key,
          value: asset.value,
          metadata: asset.metadata || {},
          active: true,
        }, {
          onConflict: 'asset_type,key'
        });
      
      if (!error) assetsInserted++;
      else console.error(`Error inserting asset ${asset.key}:`, error);
    }

    // Chunk and embed KF files
    const chunkSize = 1200;
    const overlap = 150;
    let totalChunks = 0;
    let processedChunks = 0;

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    for (const kf of kfFiles) {
      const chunks: string[] = [];
      const content = kf.content;
      
      for (let i = 0; i < content.length; i += chunkSize - overlap) {
        chunks.push(content.substring(i, i + chunkSize));
      }

      totalChunks += chunks.length;

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];

        // Generate embedding
        const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: chunk,
          }),
        });

        if (!embeddingResponse.ok) {
          console.error(`Error generating embedding for ${kf.kf_id} chunk ${i}`);
          continue;
        }

        const embeddingData = await embeddingResponse.json();
        const embedding = embeddingData.data[0].embedding;

        // Store in master_knowledge
        const { error } = await supabase
          .from('master_knowledge')
          .insert({
            doc_id: `${kf.kf_id}_chunk_${i}`,
            title: kf.title,
            category: kf.kf_id.startsWith('KF_0') ? 'core_knowledge' : 'operational',
            content: chunk,
            embedding,
            kf_id: kf.kf_id,
            section: `chunk_${i}`,
            priority: kf.kf_id === 'KF_00' || kf.kf_id === 'KF_01' ? 10 : 5,
            metadata: {
              version: kf.version,
              chunk_index: i,
              total_chunks: chunks.length,
              source: 'blueprint_ckr5',
            },
            source: 'blueprint_parser',
            active: true,
          });

        if (!error) {
          processedChunks++;
        } else {
          console.error(`Error storing chunk for ${kf.kf_id}:`, error);
        }

        // Small delay to avoid rate limits
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }

    // Update job status
    if (jobId) {
      await supabase
        .from('embedding_jobs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          total_chunks: totalChunks,
          processed_chunks: processedChunks,
        })
        .eq('id', jobId);
    }

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          kf_files: kfFiles.length,
          kf_metadata_inserted: metadataInserted,
          workflows: gwaWorkflows.length,
          workflows_inserted: workflowsInserted,
          brand_assets: brandAssets.length,
          assets_inserted: assetsInserted,
          total_chunks: totalChunks,
          processed_chunks: processedChunks,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Blueprint parsing error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
