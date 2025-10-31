import { SupabaseClient } from '@supabase/supabase-js';

interface MKFFile {
  file_key: string;
  file_name: string;
  content: string;
  file_type: string;
  priority: number;
}

interface LoadMKFOptions {
  includeSchemas?: boolean;
  customPrompt?: string;
}

/**
 * Load MKF (Master Knowledge Framework) files for a specific AI function
 * Always includes MKF_00 (Invariants) first
 */
export async function loadMKF(
  functionName: string,
  supabase: SupabaseClient,
  options: LoadMKFOptions = {}
): Promise<string> {
  
  // Fetch assigned knowledge files
  const { data: assignments, error } = await supabase
    .from('knowledge_assignments')
    .select(`
      load_order,
      is_required,
      knowledge_files!inner (
        file_key,
        file_name,
        content,
        file_type,
        priority
      )
    `)
    .eq('function_name', functionName)
    .eq('knowledge_files.is_active', true)
    .order('load_order', { ascending: true });

  if (error) {
    console.error(`[MKF] Error loading knowledge for ${functionName}:`, error);
    return buildFallbackPrompt(functionName);
  }

  if (!assignments || assignments.length === 0) {
    console.warn(`[MKF] No knowledge assignments found for ${functionName}`);
    return buildFallbackPrompt(functionName);
  }

  // Build system prompt from MKF files
  let systemPrompt = `# Call Kaids Roofing AI System\n\n`;
  systemPrompt += `Function: ${functionName}\n`;
  systemPrompt += `Generated: ${new Date().toISOString()}\n\n`;
  systemPrompt += `---\n\n`;

  // Always load MKF_00 first if not already included
  const hasMKF00 = assignments.some(a => a.knowledge_files.file_key === 'MKF_00');
  if (!hasMKF00) {
    const { data: mkf00 } = await supabase
      .from('knowledge_files')
      .select('content')
      .eq('file_key', 'MKF_00')
      .eq('is_active', true)
      .single();
    
    if (mkf00) {
      systemPrompt += `## MKF_00: Core Invariants (Auto-loaded)\n\n`;
      systemPrompt += mkf00.content;
      systemPrompt += `\n\n---\n\n`;
    }
  }

  // Load assigned files in order
  for (const assignment of assignments) {
    const file = assignment.knowledge_files as unknown as MKFFile;
    
    systemPrompt += `## ${file.file_key}: ${file.file_name}\n\n`;
    
    if (file.file_type === 'json') {
      systemPrompt += `\`\`\`json\n${file.content}\n\`\`\`\n\n`;
    } else {
      systemPrompt += file.content;
    }
    
    systemPrompt += `\n\n---\n\n`;
  }

  // Add custom prompt if provided
  if (options.customPrompt) {
    systemPrompt += `## Function-Specific Instructions\n\n`;
    systemPrompt += options.customPrompt;
    systemPrompt += `\n\n`;
  }

  // Add final enforcement
  systemPrompt += `\n\n## CRITICAL: MKF Enforcement\n\n`;
  systemPrompt += `You MUST follow ALL invariants from MKF_00 in every response:\n`;
  systemPrompt += `- ABN: 39475055075\n`;
  systemPrompt += `- Phone: 0435 900 909\n`;
  systemPrompt += `- Email: info@callkaidsroofing.com.au\n`;
  systemPrompt += `- Colours: #007ACC #0B3B69 #111827 #6B7280 #F7F8FA #FFFFFF (NO orange)\n`;
  systemPrompt += `- Service area: SE Melbourne (≤50km from Clyde North)\n`;
  systemPrompt += `- Voice: Switched-on, down-to-earth, educate > upsell\n`;
  systemPrompt += `- Claims: "Fully insured." Warranty = "7–10 year warranty"\n`;
  systemPrompt += `- NEVER use: "cheapest", "#1", stock photos\n\n`;

  return systemPrompt;
}

/**
 * Fallback prompt when MKF loading fails
 */
function buildFallbackPrompt(functionName: string): string {
  return `# Call Kaids Roofing AI System (Fallback Mode)

Function: ${functionName}

## Core Invariants (MKF_00)

- Business: Call Kaids Roofing, Clyde North, SE Melbourne
- ABN: 39475055075
- Phone: 0435 900 709
- Email: info@callkaidsroofing.com.au
- Colours: #007ACC #0B3B69 #111827 #6B7280 #F7F8FA #FFFFFF (NO orange)
- Voice: Switched-on, down-to-earth, educate > upsell
- Service Area: SE Melbourne (≤50km radius)
- Claims: "Fully insured", "7–10 year warranty"

**WARNING:** MKF files failed to load. Using minimal fallback prompt.
`;
}

/**
 * Audit log helper for MKF actions
 */
export async function auditMKFAction(
  supabase: SupabaseClient,
  action: string,
  details: Record<string, any>
) {
  await supabase.from('system_audit').insert({
    event_type: 'mkf_action',
    action,
    resource_type: 'knowledge_files',
    details,
  });
}
