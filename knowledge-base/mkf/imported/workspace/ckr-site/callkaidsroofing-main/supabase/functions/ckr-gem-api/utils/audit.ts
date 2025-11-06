import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';
import { redactPII } from './security.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function auditLog(entry: {
  action: string;
  params: any;
  result?: any;
  error?: string;
  execution_time_ms: number;
  mode: string;
  status: 'success' | 'error' | 'dry-run' | 'pending_approval';
  initiator?: string;
  ip_address?: string;
  user_agent?: string;
}): Promise<void> {
  try {
    // Redact PII for GDPR compliance
    const sanitizedParams = redactPII(entry.params);
    const sanitizedResult = entry.result ? redactPII(entry.result) : null;
    
    await supabase.from('system_audit').insert({
      timestamp: new Date().toISOString(),
      action: entry.action,
      initiator: entry.initiator || 'system',
      params: sanitizedParams,
      result: sanitizedResult,
      status: entry.status,
      error_message: entry.error,
      execution_time_ms: entry.execution_time_ms,
      mode: entry.mode,
      ip_address: entry.ip_address,
      user_agent: entry.user_agent
    });
  } catch (error) {
    console.error('Audit logging failed:', error);
    // Don't throw - logging failure shouldn't break the action
  }
}
