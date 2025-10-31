import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  event_type: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  details?: Record<string, any>;
}

/**
 * Log an audit event to the system_audit table
 * Per MKF_07: Track all sensitive operations
 */
export async function logAudit(entry: AuditLogEntry) {
  try {
    const { error } = await supabase.from('system_audit').insert({
      ...entry,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('[Audit] Failed to log audit entry:', error);
    }
  } catch (err) {
    console.error('[Audit] Exception logging audit:', err);
  }
}

/**
 * Log MKF knowledge file access
 */
export async function logKnowledgeAccess(
  fileKey: string,
  action: 'view' | 'edit' | 'delete'
) {
  await logAudit({
    event_type: 'knowledge_access',
    action,
    resource_type: 'knowledge_files',
    resource_id: fileKey,
  });
}

/**
 * Log authentication events
 */
export async function logAuthEvent(
  action: 'login' | 'logout' | 'failed_login',
  userId?: string
) {
  await logAudit({
    event_type: 'auth',
    action,
    resource_type: 'user',
    resource_id: userId,
  });
}

/**
 * Log data export events (per MKF_07 compliance)
 */
export async function logDataExport(
  resourceType: string,
  recordCount: number,
  format: string
) {
  await logAudit({
    event_type: 'data_export',
    action: 'export',
    resource_type: resourceType,
    details: { recordCount, format },
  });
}
