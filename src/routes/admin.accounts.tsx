import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { adminHead, money, useRows, useUpdate } from "@/lib/admin";
import { Confirm, Loading, PageHeader, Panel, SearchBox, Select, Status, Table } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/accounts")({ staticData: { sitemap: false }, head: adminHead("Accounts"), component: Accounts });

type A = { id: string; account_number: string; account_type: string; balance: number; status: string; customers: { full_name: string } | null };

function Accounts() {
  const { data, isLoading } = useRows("accounts", "*, customers(full_name)");
  const upd = useUpdate("accounts");
  const [q, setQ] = useState(""); const [type, setType] = useState("all"); const [status, setStatus] = useState("all");
  const rows = ((data ?? []) as unknown as A[]).filter((a) => (type === "all" || a.account_type === type) && (status === "all" || a.status === status) &&
    (!q || `${a.account_number} ${a.customers?.full_name}`.toLowerCase().includes(q.toLowerCase())));
  const total = rows.reduce((s, a) => s + Number(a.balance), 0);
  return (
    <>
      <PageHeader title="Accounts" desc={`${rows.length} accounts · ${money(total)} held`} />
      <Panel>
        <div className="mb-4 flex flex-wrap gap-2">
          <SearchBox value={q} onChange={setQ} placeholder="Account number or name…" />
          <Select label="Types" value={type} onChange={setType} options={["all", "checking", "savings", "business"]} />
          <Select label="Statuses" value={status} onChange={setStatus} options={["all", "active", "frozen", "closed"]} />
        </div>
        {isLoading ? <Loading /> : (
          <Table head={["Account", "Holder", "Type", "Balance", "Status", "Actions"]} empty={rows.length === 0}>
            {rows.map((a) => (
              <tr key={a.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-mono text-xs">{a.account_number}</td>
                <td className="px-4 py-3 font-medium">{a.customers?.full_name}</td>
                <td className="px-4 py-3 capitalize">{a.account_type}</td>
                <td className="px-4 py-3 font-display font-semibold">{money(a.balance)}</td>
                <td className="px-4 py-3"><Status value={a.status} /></td>
                <td className="px-4 py-3">
                  {a.status === "active"
                    ? <Confirm label="Freeze" title={`Freeze ${a.account_number}?`} desc="No money can leave this account while frozen." onConfirm={() => upd.mutate({ id: a.id, patch: { status: "frozen" }, label: `Froze account ${a.account_number}` })} />
                    : a.status === "frozen" && <Confirm tone="success" label="Unfreeze" title={`Unfreeze ${a.account_number}?`} desc="Restores normal use of the account." onConfirm={() => upd.mutate({ id: a.id, patch: { status: "active" }, label: `Unfroze account ${a.account_number}` })} />}
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </>
  );
}
