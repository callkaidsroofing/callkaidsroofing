import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Rate limit configuration
const RATE_LIMITS: Record<string, { maxCalls: number; windowSec: number; priority: string }> = {
  // Core CRM - Higher limits for frequent operations
  'InsertLeadRecord': { maxCalls: 30, windowSec: 60, priority: 'high' },
  'UpdateLeadStatus': { maxCalls: 50, windowSec: 60, priority: 'medium' },
  'FetchJobDetails': { maxCalls: 100, windowSec: 60, priority: 'low' },
  'InsertJobRecord': { maxCalls: 30, windowSec: 60, priority: 'medium' },
  'UpdateJobStatus': { maxCalls: 50, windowSec: 60, priority: 'medium' },
  'UploadInspectionForm': { maxCalls: 20, windowSec: 60, priority: 'medium' },
  'GenerateQuoteDraft': { maxCalls: 20, windowSec: 60, priority: 'medium' },
  'RecordClientResponse': { maxCalls: 30, windowSec: 60, priority: 'medium' },
  'ArchiveCompletedJob': { maxCalls: 20, windowSec: 60, priority: 'medium' },
  
  // Communication - Lower limits to prevent spam
  'SendQuoteToClient': { maxCalls: 10, windowSec: 60, priority: 'critical' },
  
  // Default for unlisted actions
  'default': { maxCalls: 30, windowSec: 60, priority: 'medium' }
};

export async function enforceRateLimit(action: string, identifier: string = 'system'): Promise<void> {
  const limit = RATE_LIMITS[action] || RATE_LIMITS['default'];
  const windowStart = new Date(Date.now() - limit.windowSec * 1000);
  
  // Count recent requests
  const { count, error } = await supabase
    .from('rate_limits')
    .select('*', { count: 'exact', head: true })
    .eq('identifier', `${action}:${identifier}`)
    .gte('window_start', windowStart.toISOString());
  
  if (error) {
    console.error('Rate limit check error:', error);
    // Fail open - allow request if rate limit check fails
    return;
  }
  
  if (count && count >= limit.maxCalls) {
    // Log rate limit exceeded
    await supabase.from('security_events').insert({
      event_type: 'rate_limit_exceeded',
      ip_address: identifier,
      details: {
        action,
        limit: limit.maxCalls,
        window_sec: limit.windowSec,
        priority: limit.priority,
        current_count: count
      },
      severity: limit.priority === 'critical' ? 'high' : 'medium'
    });
    
    throw new Error(
      `Rate limit exceeded for ${action}. ` +
      `Maximum ${limit.maxCalls} calls per ${limit.windowSec} seconds. ` +
      `Please try again in ${limit.windowSec} seconds.`
    );
  }
  
  // Log this request
  await supabase.from('rate_limits').insert({
    identifier: `${action}:${identifier}`,
    request_count: 1,
    window_start: new Date().toISOString()
  });
}
