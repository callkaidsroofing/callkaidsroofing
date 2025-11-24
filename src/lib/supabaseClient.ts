import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ FATAL: Missing Supabase Environment Variables")
}

// The Single Source of Truth for the Frontend Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
