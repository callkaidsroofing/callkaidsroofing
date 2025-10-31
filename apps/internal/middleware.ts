import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

// Gate all internal routes behind auth; add noindex headers.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Example auth check: replace with Supabase/JWT validation
  const isAuthed = Boolean(req.cookies.get('ckr_session'))

  if (!isAuthed) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  const res = NextResponse.next()
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}

export const config = {
  matcher: ['/((?!_next|static|public).*)'],
}
