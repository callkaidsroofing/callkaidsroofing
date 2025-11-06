import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { supabase } from "../integrations/supabase/client";

export default function ProtectedLayout() {
  const { pathname, search } = useLocation();
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session); setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => { active = false; sub?.subscription?.unsubscribe(); };
  }, []);

  React.useEffect(() => {
    const m = document.createElement("meta");
    m.name = "robots"; m.content = "noindex,nofollow";
    document.head.appendChild(m); return () => document.head.removeChild(m);
  }, []);

  if (loading) return null;
  if (!session) {
    const redirect = encodeURIComponent(pathname + (search || ""));
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  return <Outlet />;
}
