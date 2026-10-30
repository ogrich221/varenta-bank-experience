import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeftRight, Search, ThumbsUp, Check, X, Clock, CheckCircle2,
  XCircle, Filter, Download
} from "lucide-react";
import { toast } from "sonner";
import { useBanking } from "@/lib/banking-context";

export const Route = createFileRoute("/admin/transactions")({
  head: () => ({
    meta: [{ title: "Transactions & Approvals — Varenta Admin" }],
  }),
  component: TransactionsApprovalPage,
});

function TransactionsApprovalPage() {
  const {
    transactions,
    adminApproveTransaction,
    adminDeclineTransaction,
    formatCurrency,
  } = useBanking();

  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const rows = useMemo(() => {
    return transactions.filter((t) => {
      if (statusFilter !== "all") {
        if (statusFilter === "pending" && t.status !== "Pending") return false;
        if (statusFilter === "approved" && t.status !== "Successful") return false;
        if (statusFilter === "declined" && t.status !== "Failed" && t.status !== "Reversed") return false;
      }
      if (typeFilter !== "all" && t.type.toLowerCase() !== typeFilter.toLowerCase()) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        t.id.toLowerCase().includes(needle) ||
        t.description.toLowerCase().includes(needle) ||
        t.recipientOrSender.toLowerCase().includes(needle) ||
        t.amount.toString().includes(needle)
      );
    });
  }, [transactions, q, statusFilter, typeFilter]);

  const pendingCount = transactions.filter((t) => t.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white flex items-center gap-3">
            <span>Treasury Approvals & Transactions</span>
            {pendingCount > 0 && (
              <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-black text-black">
                {pendingCount} Pending
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Authorize outgoing transfers, inspect incoming credits, and enforce dual-control approvals.
          </p>
        </div>

        <button
          onClick={() => {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
            const downloadAnchor = document.createElement("a");
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", `varenta-ledger-${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            toast.success("Ledger exported successfully");
          }}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition-all"
        >
          <Download className="h-4 w-4" />
          <span>Export Ledger</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by reference, narration, counterparty..."
            className="w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-orange-500"
          />
        </div>

        {/* Status selection */}
        <div className="flex items-center gap-1 rounded-xl bg-white/5 p-1 border border-white/10">
          {(["all", "pending", "approved", "declined"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? s === "pending"
                    ? "bg-orange-500 text-black shadow"
                    : s === "approved"
                    ? "bg-emerald-500 text-black shadow"
                    : s === "declined"
                    ? "bg-rose-500 text-white shadow"
                    : "bg-white/20 text-white shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Type selection */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-zinc-900 px-3 py-2 text-xs text-zinc-300 outline-none focus:border-orange-500"
        >
          <option value="all">All Types</option>
          <option value="transfer">Transfers</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="bill">Bill Payments</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl overflow-hidden">
        {rows.length === 0 ? (
          <div className="py-16 text-center">
            <ArrowLeftRight className="mx-auto h-10 w-10 text-zinc-600" />
            <p className="mt-3 text-sm text-zinc-400">No transactions match your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-white/5 text-zinc-400 font-mono text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Reference & Type</th>
                  <th className="py-3.5 px-4">Description / Narration</th>
                  <th className="py-3.5 px-4">Counterparty</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((t) => {
                  const isPending = t.status === "Pending";
                  const isApproved = t.status === "Successful";
                  const isDeclined = t.status === "Failed" || t.status === "Reversed";

                  return (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-mono text-xs font-semibold text-white">{t.id}</p>
                        <span className="text-[10px] text-orange-400 uppercase tracking-wider font-mono">
                          {t.type}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-white max-w-xs truncate">
                        {t.description}
                      </td>

                      <td className="py-3.5 px-4 text-zinc-300">
                        {t.recipientOrSender}
                      </td>

                      <td className="py-3.5 px-4 font-bold font-display text-white text-sm">
                        <span
                          className={
                            t.type === "Deposit" || t.type === "Incoming"
                              ? "text-emerald-400"
                              : "text-white"
                          }
                        >
                          {t.type === "Deposit" || t.type === "Incoming" ? "+" : "-"}
                          {formatCurrency(t.amount, t.currency)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400 text-[11px] whitespace-nowrap">
                        {new Date(t.date).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                            <ThumbsUp className="h-3 w-3" />
                            <span>Approved 👍</span>
                          </span>
                        )}

                        {isPending && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-500/10 border border-orange-500/30 px-2.5 py-0.5 text-[10px] font-bold text-orange-400 animate-pulse">
                            <Clock className="h-3 w-3" />
                            <span>Pending</span>
                          </span>
                        )}

                        {isDeclined && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
                            <XCircle className="h-3 w-3" />
                            <span>Declined</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                adminApproveTransaction(t.id);
                                toast.success(`Transaction ${t.id} approved with bank thumbs up 👍`);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 px-2.5 py-1 text-xs font-bold text-black shadow transition-all"
                            >
                              <Check className="h-3 w-3" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => {
                                adminDeclineTransaction(t.id);
                                toast.error(`Transaction ${t.id} declined & reversed to user`);
                              }}
                              className="inline-flex items-center gap-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 px-2.5 py-1 text-xs font-semibold text-rose-400 transition-all"
                            >
                              <X className="h-3 w-3" />
                              <span>Decline</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-500 font-mono">
                            {isApproved ? "Completed" : "Closed"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
