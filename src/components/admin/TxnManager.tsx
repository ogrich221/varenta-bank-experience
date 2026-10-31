import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, X, CheckCheck, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { date, money, useRows, useUpdate } from "@/lib/admin";
import { Confirm, Loading, Panel, SearchBox, Select, Status, Table } from "./ui";
import { useBanking } from "@/lib/banking-context";

type Txn = {
  id: string;
  reference: string;
  txn_type: string;
  amount: number;
  status: string;
  counterparty: string | null;
  description: string | null;
  created_at: string;
  customers: { full_name: string } | null;
};

export function TxnManager({ type }: { type?: "deposit" | "withdrawal" | "transfer" }) {
  const qc = useQueryClient();
  const { data, isLoading } = useRows("transactions", "*, customers(full_name)");
  const upd = useUpdate("transactions");
  const {
    transactions: contextTxns,
    adminApproveTransaction,
    adminDeclineTransaction,
    formatCurrency,
  } = useBanking();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [kind, setKind] = useState("all");

  // Live updates: refresh when any transaction changes in Supabase
  useEffect(() => {
    try {
      const ch = supabase
        .channel(`txns-${Math.random().toString(36).slice(2)}`)
        .on("postgres_changes", { event: "*", schema: "public", table: "transactions" }, () =>
          qc.invalidateQueries({ queryKey: ["transactions"] })
        )
        .subscribe();
      return () => {
        supabase.removeChannel(ch);
      };
    } catch {
      // ignore
      return undefined;
    }
  }, [qc]);

  // Combine Supabase rows with context banking rows
  const combinedRows = useMemo(() => {
    const list: Txn[] = [];
    const seenIds = new Set<string>();

    // 1. Context transactions
    for (const ct of contextTxns) {
      seenIds.add(ct.id);
      let mappedStatus = "pending";
      if (ct.status === "Successful") mappedStatus = "approved";
      else if (ct.status === "Failed" || ct.status === "Reversed") mappedStatus = "rejected";

      let mappedType = ct.type.toLowerCase();
      if (
        mappedType === "domestic transfer" ||
        mappedType === "international transfer" ||
        mappedType === "international wire" ||
        mappedType.includes("transfer") ||
        mappedType.includes("wire")
      ) {
        mappedType = "transfer";
      } else if (mappedType === "deposit" || mappedType === "admin credit") {
        mappedType = "deposit";
      } else if (mappedType === "admin debit" || mappedType === "bill payment" || mappedType === "card spend") {
        mappedType = "withdrawal";
      }

      list.push({
        id: ct.id,
        reference: ct.id,
        txn_type: mappedType,
        amount: ct.amount,
        status: mappedStatus,
        counterparty: ct.recipientOrSender,
        description: ct.recipientBank ? `${ct.description} • Bank: ${ct.recipientBank}` : ct.description,
        created_at: ct.date,
        customers: { full_name: ct.userName || ct.recipientOrSender || "Client Account" },
      });
    }

    // 2. Supabase rows
    if (data && Array.isArray(data)) {
      for (const st of data as any[]) {
        if (!seenIds.has(st.id) && !seenIds.has(st.reference)) {
          seenIds.add(st.id);
          list.push(st);
        }
      }
    }

    return list;
  }, [contextTxns, data]);

  const rows = useMemo(() => {
    return combinedRows.filter((t) => {
      if (type && t.txn_type !== type) return false;
      if (kind !== "all" && t.txn_type !== kind) return false;
      if (status !== "all" && t.status !== status) return false;
      if (!q.trim()) return true;
      const needle = q.toLowerCase();
      return (
        t.reference.toLowerCase().includes(needle) ||
        (t.customers?.full_name ?? "").toLowerCase().includes(needle) ||
        (t.counterparty ?? "").toLowerCase().includes(needle) ||
        (t.description ?? "").toLowerCase().includes(needle)
      );
    });
  }, [combinedRows, type, kind, status, q]);

  const all = useMemo(
    () => combinedRows.filter((t) => !type || t.txn_type === type),
    [combinedRows, type]
  );
  const sum = (s: string) => all.filter((t) => t.status === s);

  const act = async (t: Txn, s: string) => {
    // 1. Update in local banking context
    if (s === "approved" || s === "completed") {
      adminApproveTransaction(t.id);
    } else if (s === "rejected") {
      adminDeclineTransaction(t.id);
    }

    // 2. Update in Supabase if exists
    try {
      const { data: u } = await supabase.auth.getUser();
      upd.mutate({
        id: t.id,
        patch: {
          status: s,
          reviewed_by: u.user?.id ?? null,
          reviewed_at: new Date().toISOString(),
        } as any,
        label: `Transaction ${t.reference} ${s}`,
      });
    } catch {
      // offline or local-only
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(["pending", "approved", "completed", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(status === s ? "all" : s)}
            className={`glass rounded-2xl p-4 text-left transition hover:-translate-y-0.5 ${
              status === s ? "ring-2 ring-primary" : ""
            }`}
          >
            <Status value={s} />
            <p className="mt-3 font-display text-2xl font-bold">{sum(s).length}</p>
            <p className="text-xs text-muted-foreground">
              {money(sum(s).reduce((a, t) => a + Number(t.amount), 0), true)}
            </p>
          </button>
        ))}
      </div>
      <Panel>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <SearchBox value={q} onChange={setQ} placeholder="Search reference, customer…" />
          {!type && (
            <Select
              label="Types"
              value={kind}
              onChange={setKind}
              options={["all", "deposit", "withdrawal", "transfer", "payment"]}
            />
          )}
          <Select
            label="Statuses"
            value={status}
            onChange={setStatus}
            options={["all", "pending", "approved", "completed", "rejected"]}
          />
          <span className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
            Live
          </span>
        </div>
        {isLoading && combinedRows.length === 0 ? (
          <Loading />
        ) : (
          <Table
            head={["Reference", "Customer", "Type", "Amount", "Status", "Date", "Actions"]}
            empty={rows.length === 0}
          >
            {rows.map((t) => (
              <tr key={t.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-mono text-xs">{t.reference}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{t.customers?.full_name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.counterparty} · {t.description}
                  </p>
                </td>
                <td className="px-4 py-3 capitalize">{t.txn_type}</td>
                <td className="px-4 py-3 font-display font-semibold">{money(t.amount)}</td>
                <td className="px-4 py-3">
                  <Status value={t.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">
                  {date(t.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {t.status === "pending" && (
                      <>
                        <Confirm
                          tone="success"
                          label={
                            <>
                              <Check className="h-3 w-3" />
                              Approve
                            </>
                          }
                          title={`Approve ${t.reference}?`}
                          desc={`This approves a ${t.txn_type} of ${money(t.amount)} for ${
                            t.customers?.full_name ?? "this customer"
                          }.`}
                          onConfirm={() => act(t, "approved")}
                        />
                        <Confirm
                          tone="danger"
                          label={
                            <>
                              <X className="h-3 w-3" />
                              Reject
                            </>
                          }
                          title={`Reject ${t.reference}?`}
                          desc="The customer will see this transaction as rejected and any held balance will be restored."
                          onConfirm={() => act(t, "rejected")}
                        />
                      </>
                    )}
                    {t.status === "approved" && (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 mr-2">
                          <ThumbsUp className="h-3 w-3" />
                          Approved
                        </span>
                        <Confirm
                          label={
                            <>
                              <CheckCheck className="h-3 w-3" />
                              Complete
                            </>
                          }
                          title={`Mark ${t.reference} completed?`}
                          desc="Use this once funds have fully settled."
                          onConfirm={() => act(t, "completed")}
                        />
                      </div>
                    )}
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
