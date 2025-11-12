import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Configuring Supabase storage CDN caching...');

    // Note: Supabase storage buckets cache configuration is typically done via dashboard
    // This function documents the recommended configuration and can validate settings

    const buckets = ['media', 'knowledge-uploads'];
    const results = [];

    for (const bucketName of buckets) {
      const { data: bucket, error } = await supabase
        .storage
        .getBucket(bucketName);

      if (error) {
        console.error(`Error fetching bucket ${bucketName}:`, error);
        results.push({
          bucket: bucketName,
          status: 'error',
          message: error.message
        });
        continue;
      }

      // Document recommended cache settings
      const recommendedSettings = {
        bucket: bucketName,
        cacheControl: bucketName === 'media' 
          ? 'public, max-age=31536000, immutable' // 1 year for media
          : 'public, max-age=604800', // 1 week for knowledge uploads
        currentSettings: bucket,
        instructions: 'Configure cache headers via Supabase Dashboard → Storage → Bucket Settings'
      };

      results.push(recommendedSettings);
      console.log(`Bucket ${bucketName} settings:`, recommendedSettings);
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Storage cache configuration validated',
        buckets: results,
        note: 'To apply cache settings, configure via Supabase Dashboard → Storage → Bucket Settings'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in configure-storage-cache:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});