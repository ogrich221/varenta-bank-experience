import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, ShieldCheck, ShieldAlert } from "lucide-react";
import { AdminShell, EmptyState, Money, StatCard, StatusPill } from "@/components/admin/Shell";
import { getCustomers } from "@/lib/admin.functions";

const customersQuery = queryOptions({
  queryKey: ["admin", "customers"],
  queryFn: () => getCustomers(),
});

export const Route = createFileRoute("/_authenticated/admin/customers")({
  loader: ({ context }) => context.queryClient.ensureQueryData(customersQuery),
  head: () => ({
    meta: [
      { title: "Customers — Varenta Admin Console" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { data } = useSuspenseQuery(customersQuery);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.rows.filter((c) => {
      if (status !== "all" && c.status !== status) return false;
      if (!needle) return true;
      return [c.full_name, c.email, c.country ?? "", c.phone ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [data.rows, q, status]);

  const kycPending = data.rows.filter((c) => !c.kyc_verified).length;
  const held = data.rows.filter((c) => c.status !== "active").length;

  return (
    <AdminShell title="Customer book" subtitle="Identity, verification and balances for every client.">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Clients" value={String(data.rows.length)} Icon={Search} />
        <StatCard
          label="Verification outstanding"
          value={String(kycPending)}
          Icon={ShieldAlert}
          tone={kycPending > 0 ? "warn" : "good"}
        />
        <StatCard
          label="Not fully active"
          value={String(held)}
          hint="Frozen or closed relationships"
          Icon={ShieldCheck}
          tone={held > 0 ? "warn" : "default"}
        />
      </div>

      <div className="glass mt-4 rounded-3xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, email, phone or country"
              aria-label="Search customers"
              className="w-full rounded-full border border-border/60 bg-background/70 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter by status"
            className="rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="frozen">Frozen</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="mt-4 overflow-x-auto">
          {rows.length === 0 ? (
            <EmptyState>No customers match this filter.</EmptyState>
          ) : (
            <table className="w-full min-w-[40rem] text-left text-sm [&_th]:pr-4 [&_td]:pr-4 [&_th:last-child]:pr-0 [&_td:last-child]:pr-0">
              <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold">Contact</th>
                  <th className="pb-2 font-semibold">KYC</th>
                  <th className="pb-2 text-right font-semibold">Accounts</th>
                  <th className="pb-2 text-right font-semibold">Cards</th>
                  <th className="pb-2 text-right font-semibold">Loans</th>
                  <th className="pb-2 text-right font-semibold">Balance</th>
                  <th className="pb-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rows.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-accent/40">
                    <td className="py-3">
                      <p className="font-medium">{c.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {c.country ?? "—"} · joined {new Date(c.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      <p className="text-foreground">{c.email}</p>
                      <p>{c.phone ?? "—"}</p>
                    </td>
                    <td className="py-3">
                      {c.kyc_verified ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                          <ShieldAlert className="h-3.5 w-3.5" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right tabular-nums">{c.accounts}</td>
                    <td className="py-3 text-right tabular-nums">{c.cards}</td>
                    <td className="py-3 text-right tabular-nums">{c.loans}</td>
                    <td className="py-3 text-right font-semibold">
                      <Money value={c.balance} />
                    </td>
                    <td className="py-3">
                      <StatusPill status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {rows.length} of {data.rows.length} customers.
        </p>
      </div>
    </AdminShell>
  );
}
