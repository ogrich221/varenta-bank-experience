import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Check, HandCoins, Search, X } from "lucide-react";
import { AdminShell, EmptyState, Money, StatCard, StatusPill } from "@/components/admin/Shell";
import {
  getLoans,
  setLoanStatus,
  type LoanRow,
  type LoanStatus,
} from "@/lib/admin.functions";

const loansQuery = queryOptions({
  queryKey: ["admin", "loans"],
  queryFn: () => getLoans(),
});

export const Route = createFileRoute("/_authenticated/admin/loans")({
  loader: ({ context }) => context.queryClient.ensureQueryData(loansQuery),
  head: () => ({
    meta: [
      { title: "Lending Desk — Varenta Admin Console" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoansPage,
});

function LoansPage() {
  const { data } = useSuspenseQuery(loansQuery);
  const queryClient = useQueryClient();
  const applyStatus = useServerFn(setLoanStatus);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.rows.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (!needle) return true;
      return [l.customer, l.purpose ?? ""].join(" ").toLowerCase().includes(needle);
    });
  }, [data.rows, q, status]);

  async function decide(row: LoanRow, next: LoanStatus) {
    setBusyId(row.id);
    setMessage(null);
    try {
      await applyStatus({ data: { id: row.id, status: next } });
      setMessage(`Loan for ${row.customer} marked as ${next}.`);
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not update this loan.");
    } finally {
      setBusyId(null);
    }
  }

  const pending = data.rows.filter((l) => l.status === "pending");
  const outstanding = data.rows
    .filter((l) => l.status === "active" || l.status === "approved")
    .reduce((sum, l) => sum + l.amount, 0);

  return (
    <AdminShell title="Lending desk" subtitle="Review applications and track the book.">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Applications" value={String(data.rows.length)} Icon={HandCoins} />
        <StatCard
          label="Awaiting decision"
          value={String(pending.length)}
          hint={`Worth ${pending.reduce((s, l) => s + l.amount, 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}`}
          Icon={Check}
          tone={pending.length > 0 ? "warn" : "good"}
        />
        <StatCard
          label="Outstanding lending"
          value={<Money value={outstanding} />}
          hint="Approved and active loans"
          Icon={Search}
          tone="good"
        />
      </div>

      <div className="glass mt-4 rounded-3xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search borrower or purpose"
              aria-label="Search loans"
              className="w-full rounded-full border border-border/60 bg-background/70 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter loans by status"
            className="rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="repaid">Repaid</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {message ? (
          <p role="status" className="mt-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs text-primary">
            {message}
          </p>
        ) : null}

        <div className="mt-4 overflow-x-auto">
          {rows.length === 0 ? (
            <EmptyState>No loans match this filter.</EmptyState>
          ) : (
            <table className="w-full min-w-[66rem] text-left text-sm [&_th]:pr-6 [&_td]:pr-6 [&_th:last-child]:pr-0 [&_td:last-child]:pr-0">
              <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2 font-semibold">Borrower</th>
                  <th className="pb-2 text-right font-semibold">Amount</th>
                  <th className="pb-2 text-right font-semibold">Rate</th>
                  <th className="pb-2 text-right font-semibold">Term</th>
                  <th className="pb-2 font-semibold">Purpose</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 text-right font-semibold">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rows.map((l) => (
                  <tr key={l.id} className="transition-colors hover:bg-accent/40">
                    <td className="py-3 font-medium">{l.customer}</td>
                    <td className="py-3 text-right font-semibold">
                      <Money value={l.amount} />
                    </td>
                    <td className="py-3 text-right tabular-nums text-muted-foreground">
                      {l.interest_rate}%
                    </td>
                    <td className="py-3 text-right tabular-nums text-muted-foreground">
                      {l.term_months} mo
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">{l.purpose ?? "—"}</td>
                    <td className="py-3">
                      <StatusPill status={l.status} />
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1.5">
                        {l.status === "pending" ? (
                          <>
                            <button
                              onClick={() => decide(l, "approved")}
                              disabled={busyId === l.id}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                            >
                              <Check className="h-3 w-3" /> Approve
                            </button>
                            <button
                              onClick={() => decide(l, "rejected")}
                              disabled={busyId === l.id}
                              className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                            >
                              <X className="h-3 w-3" /> Reject
                            </button>
                          </>
                        ) : l.status === "approved" ? (
                          <button
                            onClick={() => decide(l, "active")}
                            disabled={busyId === l.id}
                            className="rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25 disabled:opacity-50"
                          >
                            Disburse
                          </button>
                        ) : l.status === "active" ? (
                          <button
                            onClick={() => decide(l, "repaid")}
                            disabled={busyId === l.id}
                            className="rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                          >
                            Mark repaid
                          </button>
                        ) : (
                          <span className="text-xs text-muted-foreground">No action</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
