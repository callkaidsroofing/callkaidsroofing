import { supabase } from "../integrations/supabase/client";
export async function audit(action: string, entity: string, result: string, meta: any = {}) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    await supabase.from("system_audit").insert({
      ts: new Date().toISOString(),
      user_id: session?.user?.id || null,
      action, entity, result, meta
    });
  } catch (e: any) {
    console.warn("audit failed", e?.message);
  }
}
