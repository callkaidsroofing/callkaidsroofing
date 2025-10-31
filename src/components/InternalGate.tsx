import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function InternalGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(!!data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // Defence-in-depth for crawlers in Lovable (headers not controllable here)
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,nofollow';
    document.head.appendChild(meta);
    return () => { document.head.removeChild(meta); };
  }, []);

  if (!ready) return null;
  if (!authed) {
    const target = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?redirect=${target || '/internal'}`;
    return null;
  }
  return <>{children}</>;
}
