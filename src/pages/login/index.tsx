import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [redirect, setRedirect] = useState('/internal');

  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('redirect');
    if (r) setRedirect(r);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}${redirect}` }
    });
    setSent(true);
  }

  return (
    <main style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <form onSubmit={onSubmit} style={{ width: '100%', maxWidth: 420 }}>
        <h1 style={{ marginBottom: 12 }}>Sign in</h1>
        <input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: '100%', padding: 10, margin: '8px 0' }}
        />
        <button style={{ width: '100%', padding: 10 }}>Send magic link</button>
        {sent && <p style={{ marginTop: 8 }}>Check your email for a login link.</p>}
      </form>
    </main>
  );
}
