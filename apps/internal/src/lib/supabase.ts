import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, anon, {
    auth: { persistSession: false },
  })
}

export async function getSession() {
  // If using auth-helpers-nextjs server helpers, swap to createServerComponentClient
  const supabase = createServerSupabase()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
