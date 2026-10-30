import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { date, money, useRows, useUpdate } from "@/lib/admin";
import { Confirm, Loading, Panel, SearchBox, Select, Status, Table } from "./ui";

type Txn = { id: string; reference: string; txn_type: string; amount: number; status: string; counterparty: string | null; description: string | null; created_at: string; customers: { full_name: string } | null };

export function TxnManager({ type }: { type?: "deposit" | "withdrawal" | "transfer" }) {
  const qc = useQueryClient();
  const { data, isLoading } = useRows("transactions", "*, customers(full_name)");
  const upd = useUpdate("transactions");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [kind, setKind] = useState("all");

  // Live updates: refresh when any transaction changes.
  useEffect(() => {
    const ch = supabase.channel(`txns-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () => qc.invalidateQueries({ queryKey: ["transactions"] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const rows = useMemo(() => ((data ?? []) as unknown as Txn[]).filter((t) =>
    (!type || t.txn_type === type) && (kind === "all" || t.txn_type === kind) && (status === "all" || t.status === status) &&
    (!q || `${t.reference} ${t.customers?.full_name ?? ""} ${t.counterparty ?? ""}`.toLowerCase().includes(q.toLowerCase())),
  ), [data, type, kind, status, q]);

  const all = ((data ?? []) as unknown as Txn[]).filter((t) => !type || t.txn_type === type);
  const sum = (s: string) => all.filter((t) => t.status === s);
  const act = async (t: Txn, s: string) => {
    const { data: u } = await supabase.auth.getUser();
    upd.mutate({ id: t.id, patch: { status: s, reviewed_by: u.user?.id, reviewed_at: new Date().toISOString() }, label: `Transaction ${t.reference} ${s}` });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(["pending", "approved", "completed", "rejected"] as const).map((s) => (
          <button key={s} onClick={() => setStatus(status === s ? "all" : s)} className={`glass rounded-2xl p-4 text-left transition hover:-translate-y-0.5 ${status === s ? "ring-2 ring-primary" : ""}`}>
            <Status value={s} />
            <p className="mt-3 font-display text-2xl font-bold">{sum(s).length}</p>
            <p className="text-xs text-muted-foreground">{money(sum(s).reduce((a, t) => a + Number(t.amount), 0), true)}</p>
          </button>
        ))}
      </div>
      <Panel>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <SearchBox value={q} onChange={setQ} placeholder="Search reference, customer…" />
          {!type && <Select label="Types" value={kind} onChange={setKind} options={["all", "deposit", "withdrawal", "transfer", "payment"]} />}
          <Select label="Statuses" value={status} onChange={setStatus} options={["all", "pending", "approved", "completed", "rejected"]} />
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground"><span className="h-2 w-2 animate-pulse rounded-full bg-success" />Live</span>
        </div>
        {isLoading ? <Loading /> : (
          <Table head={["Reference", "Customer", "Type", "Amount", "Status", "Date", "Actions"]} empty={rows.length === 0}>
            {rows.map((t) => (
              <tr key={t.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-mono text-xs">{t.reference}</td>
                <td className="px-4 py-3"><p className="font-medium">{t.customers?.full_name ?? "—"}</p><p className="text-xs text-muted-foreground">{t.counterparty} · {t.description}</p></td>
                <td className="px-4 py-3 capitalize">{t.txn_type}</td>
                <td className="px-4 py-3 font-display font-semibold">{money(t.amount)}</td>
                <td className="px-4 py-3"><Status value={t.status} /></td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{date(t.created_at)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {t.status === "pending" && <>
                      <Confirm tone="success" label={<><Check className="h-3 w-3" />Approve</>} title={`Approve ${t.reference}?`} desc={`This approves a ${t.txn_type} of ${money(t.amount)} for ${t.customers?.full_name ?? "this customer"}.`} onConfirm={() => act(t, "approved")} />
                      <Confirm tone="danger" label={<><X className="h-3 w-3" />Reject</>} title={`Reject ${t.reference}?`} desc="The customer will see this transaction as rejected." onConfirm={() => act(t, "rejected")} />
                    </>}
                    {t.status === "approved" && <Confirm label={<><CheckCheck className="h-3 w-3" />Complete</>} title={`Mark ${t.reference} completed?`} desc="Use this once funds have settled." onConfirm={() => act(t, "completed")} />}
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </div>
  );
}
