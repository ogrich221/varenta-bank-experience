import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Tbl = keyof Database["public"]["Tables"];
export type Row<T extends Tbl> = Database["public"]["Tables"][T]["Row"];

export const money = (n: number | string | null | undefined, compact = false) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: compact ? "compact" : "standard", maximumFractionDigits: compact ? 1 : 2 }).format(Number(n ?? 0));
export const date = (d: string) => new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export const adminHead = (title: string) => () => ({
  meta: [
    { title: `${title} — Varenta Admin` },
    { name: "description", content: `Varenta Bank admin: ${title.toLowerCase()}.` },
    { property: "og:title", content: `${title} — Varenta Admin` },
    { property: "og:description", content: `Varenta Bank admin: ${title.toLowerCase()}.` },
    { name: "robots", content: "noindex, nofollow" },
  ],
});

/** Fetch all rows of a table (admin-only via RLS). */
export function useRows<T extends Tbl>(table: T, select = "*", orderBy = "created_at") {
  return useQuery({
    queryKey: [table, select],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase.from(table) as any).select(select).order(orderBy, { ascending: false }).limit(1000);
      if (error) throw error;
      return data as (Row<T> & Record<string, unknown>)[];
    },
  });
}

export async function audit(action: string, target: string, details?: Record<string, unknown>) {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("audit_logs").insert({ actor_id: data.user.id, actor_email: data.user.email ?? null, action, target, details: (details ?? null) as never });
}

/** Update one row, write an audit entry and refresh lists. */
export function useUpdate<T extends Tbl>(table: T) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, patch, label }: { id: string; patch: Partial<Row<T>>; label: string }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from(table) as any).update(patch).eq("id", id);
      if (error) throw error;
      await audit(label, `${table}:${id}`, patch as Record<string, unknown>);
    },
    onSuccess: (_d, v) => { toast.success(v.label); qc.invalidateQueries(); },
    onError: (e: Error) => toast.error(e.message),
  });
}
