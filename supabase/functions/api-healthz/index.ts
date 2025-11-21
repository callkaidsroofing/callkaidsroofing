/**
 * Health Check Endpoint
 * 
 * Per MKF Requirements: Provide /api/healthz for monitoring
 * Returns system status, database connectivity, and timestamp
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();

    // Check database connectivity
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let dbStatus = 'unknown';
    let dbLatency = 0;

    try {
      const dbStart = Date.now();
      const { error } = await supabase.from('leads').select('id').limit(1);
      dbLatency = Date.now() - dbStart;
      dbStatus = error ? 'error' : 'healthy';
    } catch (err) {
      dbStatus = 'error';
      console.error('[Healthz] DB check failed:', err);
    }

    const responseTime = Date.now() - startTime;

    const health = {
      ok: dbStatus === 'healthy',
      timestamp: new Date().toISOString(),
      timezone: 'Australia/Melbourne',
      service: 'callkaidsroofing-api',
      checks: {
        database: {
          status: dbStatus,
          latency_ms: dbLatency,
        },
        api: {
          status: 'healthy',
          response_time_ms: responseTime,
        },
      },
      version: '1.0.0',
    };

    return new Response(JSON.stringify(health, null, 2), {
      status: health.ok ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('[Healthz] Error:', error);

    return new Response(
      JSON.stringify({
        ok: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
});
