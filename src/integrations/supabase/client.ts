// Supabase client configuration
// Public credentials hardcoded to prevent 502 errors in Lovable production
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = 'https://vlnkzpyeppfdmresiaoh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbmt6cHllcHBmZG1yZXNpYW9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczMzU3ODUsImV4cCI6MjA3MjkxMTc4NX0.tt4QYDwOMzNLtz-GCD6H_3vw0sQ78VHOCzobMmKYh2M';

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});