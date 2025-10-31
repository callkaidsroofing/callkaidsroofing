import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/login', req.url))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Handle the OAuth or magic link callback
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    const url = new URL('/login', req.url)
    url.searchParams.set('error', 'auth_failed')
    return NextResponse.redirect(url)
  }

  const redirect = req.nextUrl.searchParams.get('redirect') || '/internal'
  return NextResponse.redirect(new URL(redirect, req.url))
}
