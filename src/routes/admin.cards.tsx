import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { adminHead, money, useRows, useUpdate } from "@/lib/admin";
import { Confirm, Loading, PageHeader, Select, Status } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/cards")({ head: adminHead("Cards"), component: Cards });

type C = { id: string; last4: string; brand: string; card_type: string; status: string; spend_limit: number; customers: { full_name: string } | null };

function Cards() {
  const { data, isLoading } = useRows("cards", "*, customers(full_name)");
  const upd = useUpdate("cards");
  const [status, setStatus] = useState("all");
  const rows = ((data ?? []) as unknown as C[]).filter((c) => status === "all" || c.status === status);
  const set = (c: C, s: string) => upd.mutate({ id: c.id, patch: { status: s }, label: `Card •••• ${c.last4} ${s}` });
  return (
    <>
      <PageHeader title="Cards" desc="Freeze, unfreeze or block customer cards."><Select label="Statuses" value={status} onChange={setStatus} options={["all", "active", "frozen", "blocked"]} /></PageHeader>
      {isLoading ? <Loading /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <article key={c.id} className="glass rounded-3xl p-4">
              <div className={`relative aspect-[1.6] overflow-hidden rounded-2xl p-5 text-primary-foreground ${c.status === "active" ? "bg-gradient-primary shadow-glow" : "bg-muted text-muted-foreground"}`}>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-widest"><span>Varenta</span><span>{c.card_type}</span></div>
                <p className="absolute bottom-12 left-5 font-mono text-lg tracking-widest">•••• •••• •••• {c.last4}</p>
                <div className="absolute inset-x-5 bottom-4 flex justify-between text-sm"><span>{c.customers?.full_name}</span><span className="font-bold">{c.brand}</span></div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">Limit {money(c.spend_limit)}</span>
                <Status value={c.status} />
              </div>
              <div className="mt-3 flex gap-1.5">
                {c.status === "active" && <Confirm label="Freeze" title="Freeze card?" desc="Payments will be declined until unfrozen." onConfirm={() => set(c, "frozen")} />}
                {c.status === "frozen" && <Confirm tone="success" label="Unfreeze" title="Unfreeze card?" desc="Payments will work again." onConfirm={() => set(c, "active")} />}
                {c.status !== "blocked" && <Confirm tone="danger" label="Block" title="Block card permanently?" desc="A blocked card can't be reactivated." onConfirm={() => set(c, "blocked")} />}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
