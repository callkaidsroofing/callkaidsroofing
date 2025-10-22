import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

// Import handlers
import * as crmHandlers from './handlers/crm.ts';

// Import utilities
import { authenticate } from './utils/security.ts';
import { enforceRateLimit } from './utils/rateLimit.ts';
import { auditLog } from './utils/audit.ts';
import { APIError, handleError } from './utils/errors.ts';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Action router mapping
const ACTION_HANDLERS: Record<string, Function> = {
  // Core CRM (1-10)
  'InsertLeadRecord': crmHandlers.insertLead,
  'UpdateLeadStatus': crmHandlers.updateLeadStatus,
  'InsertJobRecord': crmHandlers.insertJob,
  'UpdateJobStatus': crmHandlers.updateJobStatus,
  'UploadInspectionForm': crmHandlers.uploadInspection,
  'FetchJobDetails': crmHandlers.fetchJob,
  'GenerateQuoteDraft': crmHandlers.generateQuote,
  'SendQuoteToClient': crmHandlers.sendQuote,
  'RecordClientResponse': crmHandlers.recordResponse,
  'ArchiveCompletedJob': crmHandlers.archiveJob,
};

serve(async (req: Request) => {
  const startTime = Date.now();
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Extract metadata
    const ipAddress = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    // Authenticate
    const authResult = await authenticate(req);
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'AUTHENTICATION_FAILED',
          message: authResult.message 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Parse request
    const { action, params, mode = 'live' } = await req.json();
    
    // Validate action exists
    if (!ACTION_HANDLERS[action]) {
      throw new APIError(`Unknown action: ${action}`, 400, 'INVALID_ACTION');
    }
    
    // Rate limiting
    await enforceRateLimit(action, ipAddress);
    
    // Execute action
    const handler = ACTION_HANDLERS[action];
    const result = await handler(params, mode, { supabase, req });
    
    const executionTime = Date.now() - startTime;
    
    // Audit logging
    await auditLog({
      action,
      params,
      result,
      status: mode === 'dry-run' ? 'dry-run' : 'success',
      execution_time_ms: executionTime,
      mode,
      initiator: authResult.initiator,
      ip_address: ipAddress,
      user_agent: userAgent
    });
    
    // Return success
    return new Response(
      JSON.stringify({
        success: true,
        message: result.message || `${action} executed successfully`,
        data: result.data,
        mode,
        timestamp: new Date().toISOString(),
        execution_time_ms: executionTime
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    
    // Handle error
    const errorResponse = handleError(error);
    
    // Try to parse request for audit (may fail if request is malformed)
    let action = 'unknown';
    let params = {};
    let mode = 'live';
    
    try {
      const body = await req.clone().json();
      action = body.action || 'unknown';
      params = body.params || {};
      mode = body.mode || 'live';
    } catch {
      // Ignore parse errors
    }
    
    // Audit failed action
    await auditLog({
      action,
      params,
      error: errorResponse.message,
      status: 'error',
      execution_time_ms: executionTime,
      mode,
      initiator: 'unknown',
      ip_address: req.headers.get('x-forwarded-for') || 'unknown',
      user_agent: req.headers.get('user-agent') || 'unknown'
    });
    
    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: errorResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
