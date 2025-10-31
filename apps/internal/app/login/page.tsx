import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export default function Login() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function signInWithMagicLink(formData: FormData) {
    'use server'
    const email = String(formData.get('email') || '')
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/internal' } })
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form action={signInWithMagicLink} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <input name="email" type="email" required placeholder="you@example.com" className="w-full border rounded p-2"/>
        <button type="submit" className="w-full border rounded p-2">Send me a login link</button>
        <p className="text-sm text-gray-500">We'll email you a magic link to sign in securely.</p>
      </form>
    </main>
  )
}
