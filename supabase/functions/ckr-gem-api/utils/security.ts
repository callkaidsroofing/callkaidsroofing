import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const GPT_PROXY_KEY = Deno.env.get('GPT_PROXY_KEY');

export async function authenticate(req: Request): Promise<{
  success: boolean;
  message?: string;
  initiator?: string;
}> {
  const apiKey = req.headers.get('x-api-key');
  
  // Log authentication attempt
  await supabase.from('security_events').insert({
    event_type: 'auth_attempt',
    ip_address: req.headers.get('x-forwarded-for'),
    user_agent: req.headers.get('user-agent'),
    details: { key_present: !!apiKey },
    severity: 'low'
  });
  
  if (!apiKey || apiKey !== GPT_PROXY_KEY) {
    // Log failed authentication
    await supabase.from('security_events').insert({
      event_type: 'auth_failed',
      ip_address: req.headers.get('x-forwarded-for'),
      user_agent: req.headers.get('user-agent'),
      details: { reason: 'Invalid API key' },
      severity: 'high'
    });
    
    return {
      success: false,
      message: 'Invalid API key. Access denied.'
    };
  }
  
  return {
    success: true,
    initiator: 'gpt-custom'
  };
}

export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  // Remove HTML tags
  let clean = input.replace(/<[^>]*>/g, '');
  
  // Remove script content
  clean = clean.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Trim whitespace
  return clean.trim();
}

export function validatePhoneAU(phone: string): boolean {
  // Australian mobile: 04XX XXX XXX or +61 4XX XXX XXX
  const cleaned = phone.replace(/\s/g, '');
  return /^(04\d{8}|\+614\d{8})$/.test(cleaned);
}

export function validateEmail(email: string): boolean {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
}

export function redactPII(data: any): any {
  if (typeof data !== 'object' || data === null) return data;
  
  const redacted = { ...data };
  const piiFields = ['contact', 'phone', 'email', 'site_address', 'siteAddress', 'credit_card', 'password', 'client_email', 'client_phone'];
  
  for (const field of piiFields) {
    if (field in redacted) {
      redacted[field] = '[REDACTED]';
    }
  }
  
  return redacted;
}
