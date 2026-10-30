import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { adminHead, money, useRows, useUpdate } from "@/lib/admin";
import { Confirm, Loading, PageHeader, Panel, Select, Status, Table } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/loans")({ staticData: { sitemap: false }, head: adminHead("Loans"), component: Loans });

type L = { id: string; amount: number; interest_rate: number; term_months: number; purpose: string | null; status: string; created_at: string; customers: { full_name: string } | null };

function Loans() {
  const { data, isLoading } = useRows("loans", "*, customers(full_name)");
  const upd = useUpdate("loans");
  const [status, setStatus] = useState("all");
  const rows = ((data ?? []) as unknown as L[]).filter((l) => status === "all" || l.status === status);
  const set = (l: L, s: string) => upd.mutate({ id: l.id, patch: { status: s }, label: `Loan for ${l.customers?.full_name} ${s}` });
  return (
    <>
      <PageHeader title="Loans" desc="Review applications and track active lending." />
      <Panel>
        <div className="mb-4"><Select label="Statuses" value={status} onChange={setStatus} options={["all", "pending", "approved", "active", "rejected", "repaid"]} /></div>
        {isLoading ? <Loading /> : (
          <Table head={["Customer", "Purpose", "Amount", "Rate", "Term", "Status", "Actions"]} empty={rows.length === 0}>
            {rows.map((l) => (
              <tr key={l.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-medium">{l.customers?.full_name}</td>
                <td className="px-4 py-3">{l.purpose}</td>
                <td className="px-4 py-3 font-display font-semibold">{money(l.amount)}</td>
                <td className="px-4 py-3">{l.interest_rate}%</td>
                <td className="px-4 py-3">{l.term_months} mo</td>
                <td className="px-4 py-3"><Status value={l.status} /></td>
                <td className="px-4 py-3"><div className="flex gap-1.5">
                  {l.status === "pending" && <>
                    <Confirm tone="success" label="Approve" title="Approve this loan?" desc={`${money(l.amount)} at ${l.interest_rate}% over ${l.term_months} months.`} onConfirm={() => set(l, "approved")} />
                    <Confirm tone="danger" label="Reject" title="Reject this loan?" desc="The applicant will be notified." onConfirm={() => set(l, "rejected")} />
                  </>}
                  {l.status === "approved" && <Confirm label="Disburse" title="Disburse funds?" desc="Marks the loan as active." onConfirm={() => set(l, "active")} />}
                </div></td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </>
  );
}
