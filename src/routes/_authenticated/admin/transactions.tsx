import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Check, Search, X } from "lucide-react";
import { AdminShell, EmptyState, Money, StatCard, StatusPill } from "@/components/admin/Shell";
import {
  getTransactions,
  setTransactionStatus,
  type TxnRow,
  type TxnStatus,
} from "@/lib/admin.functions";

const transactionsQuery = queryOptions({
  queryKey: ["admin", "transactions"],
  queryFn: () => getTransactions(),
});

export const Route = createFileRoute("/_authenticated/admin/transactions")({
  loader: ({ context }) => context.queryClient.ensureQueryData(transactionsQuery),
  head: () => ({
    meta: [
      { title: "Transactions — Varenta Admin Console" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { data } = useSuspenseQuery(transactionsQuery);
  const queryClient = useQueryClient();
  const applyStatus = useServerFn(setTransactionStatus);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.rows.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (type !== "all" && t.type !== type) return false;
      if (!needle) return true;
      return [t.customer, t.reference, t.counterparty ?? "", t.description ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle);
    });
  }, [data.rows, q, status, type]);

  async function review(row: TxnRow, next: TxnStatus) {
    setBusyId(row.id);
    setMessage(null);
    try {
      await applyStatus({ data: { id: row.id, status: next } });
      setMessage(`${row.reference} marked as ${next}.`);
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not update this payment.");
    } finally {
      setBusyId(null);
    }
  }

  const pending = data.rows.filter((t) => t.status === "pending").length;

  return (
    <AdminShell
      title="Payments & transactions"
      subtitle="Approve, reject or complete movements across the bank."
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Movements loaded" value={String(data.rows.length)} Icon={Search} />
        <StatCard
          label="Awaiting decision"
          value={String(pending)}
          hint="Deposits, withdrawals and transfers"
          Icon={Check}
          tone={pending > 0 ? "warn" : "good"}
        />
        <StatCard
          label="Rejected"
          value={String(data.rows.filter((t) => t.status === "rejected").length)}
          Icon={X}
          tone="default"
        />
      </div>

      <div className="glass mt-4 rounded-3xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search customer, reference or counterparty"
              aria-label="Search transactions"
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Filter by type"
            className="rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
            <option value="payment">Payment</option>
          </select>
        </div>

        {message ? (
          <p role="status" className="mt-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs text-primary">
            {message}
          </p>
        ) : null}

        <div className="mt-4 overflow-x-auto">
          {rows.length === 0 ? (
            <EmptyState>No movements match this filter.</EmptyState>
          ) : (
            <table className="w-full min-w-[62rem] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold">Reference</th>
                  <th className="pb-2 font-semibold">Type</th>
                  <th className="pb-2 text-right font-semibold">Amount</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 font-semibold">When</th>
                  <th className="pb-2 text-right font-semibold">Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rows.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-accent/40">
                    <td className="py-3">
                      <p className="font-medium">{t.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.counterparty ?? t.description ?? "—"}
                      </p>
                    </td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">{t.reference}</td>
                    <td className="py-3 capitalize text-muted-foreground">{t.type}</td>
                    <td className="py-3 text-right font-semibold">
                      <Money value={t.amount} />
                    </td>
                    <td className="py-3">
                      <StatusPill status={t.status} />
                    </td>
                    <td className="py-3 text-xs text-muted-foreground">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                    <td className="py-3">
                      <div className="flex justify-end gap-1.5">
                        {t.status === "pending" ? (
                          <>
                            <button
                              onClick={() => review(t, "approved")}
                              disabled={busyId === t.id}
                              className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                            >
                              <Check className="h-3 w-3" /> Approve
                            </button>
                            <button
                              onClick={() => review(t, "rejected")}
                              disabled={busyId === t.id}
                              className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                            >
                              <X className="h-3 w-3" /> Reject
                            </button>
                          </>
                        ) : t.status === "approved" ? (
                          <button
                            onClick={() => review(t, "completed")}
                            disabled={busyId === t.id}
                            className="rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25 disabled:opacity-50"
                          >
                            Mark completed
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
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {rows.length} of {data.rows.length} movements. Every decision is written to the
          audit trail.
        </p>
      </div>
    </AdminShell>
  );
}
