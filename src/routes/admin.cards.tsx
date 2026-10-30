import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { adminHead, money, useRows } from "@/lib/admin";
import { Loading, PageHeader, Select, Status } from "@/components/admin/ui";
import { useBanking } from "@/lib/banking-context";

export const Route = createFileRoute("/admin/cards")({ staticData: { sitemap: false }, head: adminHead("Cards"), component: Cards });

type C = { id: string; last4: string; brand: string; card_type: string; status: string; spend_limit: number; customers: { full_name: string } | null };

function Cards() {
  const { data, isLoading } = useRows("cards", "*, customers(full_name)");
  const { managedUsers, adminUpdateUserProfile } = useBanking();
  const [status, setStatus] = useState("all");

  const combinedRows = useMemo(() => {
    const list: C[] = [];
    const seen = new Set<string>();

    for (const u of managedUsers) {
      const last4 = u.card.cardNumber.slice(-4);
      seen.add(u.card.cardNumber);
      list.push({
        id: u.id,
        last4,
        brand: "Mastercard World Elite",
        card_type: u.card.cardType || "World Elite Titanium",
        status: u.card.isFrozen ? "frozen" : "active",
        spend_limit: u.card.dailyLimit || 25000,
        customers: { full_name: `${u.profile.firstName} ${u.profile.lastName}` },
      });
    }

    if (data && Array.isArray(data)) {
      for (const row of data as any[]) {
        if (!seen.has(row.id)) {
          seen.add(row.id);
          list.push(row);
        }
      }
    }

    return list;
  }, [managedUsers, data]);

  const rows = combinedRows.filter((c) => status === "all" || c.status === status);

  return (
    <>
      <PageHeader title="Virtual & Physical Cards" desc={`${rows.length} cards in circulation across global client accounts.`}>
        <Select label="Statuses" value={status} onChange={setStatus} options={["all", "active", "frozen", "blocked"]} />
      </PageHeader>
      {isLoading && combinedRows.length === 0 ? <Loading /> : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) => (
            <article key={c.id} className="glass rounded-3xl p-5 border border-white/10 shadow-glass">
              <div className={`relative aspect-[1.6] overflow-hidden rounded-2xl p-5 text-white ${c.status === "active" ? "bg-gradient-to-br from-zinc-900 via-orange-950/40 to-black border border-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.15)]" : "bg-zinc-900/60 text-zinc-500 border border-white/5"}`}>
                <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-orange-400">
                  <span>Varenta Private Bank</span>
                  <span>{c.card_type}</span>
                </div>
                <p className="absolute bottom-12 left-5 font-mono text-lg tracking-widest text-white">•••• •••• •••• {c.last4}</p>
                <div className="absolute inset-x-5 bottom-4 flex justify-between text-sm">
                  <span className="font-semibold text-zinc-200">{c.customers?.full_name}</span>
                  <span className="font-black text-orange-500">{c.brand}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-2">
                <span className="text-xs text-zinc-400">Daily Limit: <strong className="text-white">{money(c.spend_limit)}</strong></span>
                <Status value={c.status} />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
