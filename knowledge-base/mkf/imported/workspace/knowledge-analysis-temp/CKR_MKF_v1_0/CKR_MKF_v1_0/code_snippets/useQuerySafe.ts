import React from "react";
import { supabase } from "../integrations/supabase/client";

export function useQuerySafe(fn: (sb: any) => Promise<any>) {
  const [state, setState] = React.useState<{loading:boolean, data:any, error:any}>(
    { loading: true, data: null, error: null }
  );
  React.useEffect(() => {
    let active = true;
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess?.session) { if (active) setState({ loading:false, data:null, error:"UNAUTH"}); return; }
      try {
        const data = await fn(supabase);
        if (active) setState({ loading:false, data, error:null });
      } catch (e: any) {
        if (active) setState({ loading:false, data:null, error: e?.message || "ERROR" });
      }
    })();
    return () => { active = false; };
  }, []);
  return state;
}
