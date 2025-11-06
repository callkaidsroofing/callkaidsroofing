import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QueryState<T> {
  loading: boolean;
  data?: T;
  error?: string;
}

export function useQuerySafe<T>(fn: (client: typeof supabase) => Promise<T>) {
  const [state, setState] = useState<QueryState<T>>({ loading: true });

  useEffect(() => {
    (async () => {
      try {
        const { data: sess } = await supabase.auth.getSession();
        if (!sess.session) {
          setState({ loading: false, error: "UNAUTH" });
          return;
        }
        const data = await fn(supabase);
        setState({ loading: false, data });
      } catch (e: any) {
        setState({ loading: false, error: e?.message || "ERROR" });
      }
    })();
  }, []);

  return state;
}
