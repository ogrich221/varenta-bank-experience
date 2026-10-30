import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { adminHead, money, useRows } from "@/lib/admin";
import { Loading, PageHeader, Panel, SearchBox, Select, Status, Table } from "@/components/admin/ui";
import { useBanking } from "@/lib/banking-context";

export const Route = createFileRoute("/admin/accounts")({ staticData: { sitemap: false }, head: adminHead("Accounts"), component: Accounts });

type A = { id: string; account_number: string; account_type: string; balance: number; status: string; customers: { full_name: string } | null };

function Accounts() {
  const { data, isLoading } = useRows("accounts", "*, customers(full_name)");
  const { managedUsers } = useBanking();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const combinedRows = useMemo(() => {
    const list: A[] = [];
    const seen = new Set<string>();

    for (const u of managedUsers) {
      for (const acc of u.accounts) {
        seen.add(acc.accountNumber);
        list.push({
          id: `${u.id}-${acc.accountNumber}`,
          account_number: acc.accountNumber,
          account_type: acc.type === "Current Account" ? "checking" : "savings",
          balance: acc.balance,
          status: u.profile.status === "Suspended" ? "frozen" : "active",
          customers: { full_name: `${u.profile.firstName} ${u.profile.lastName}` },
        });
      }
    }

    if (data && Array.isArray(data)) {
      for (const row of data as any[]) {
        if (!seen.has(row.account_number)) {
          seen.add(row.account_number);
          list.push(row);
        }
      }
    }

    return list;
  }, [managedUsers, data]);

  const rows = combinedRows.filter((a) =>
    (type === "all" || a.account_type === type) &&
    (status === "all" || a.status === status) &&
    (!q || `${a.account_number} ${a.customers?.full_name}`.toLowerCase().includes(q.toLowerCase()))
  );

  const total = rows.reduce((s, a) => s + Number(a.balance), 0);

  return (
    <>
      <PageHeader title="Accounts" desc={`${rows.length} accounts · ${money(total)} held across all client portfolios.`} />
      <Panel>
        <div className="mb-4 flex flex-wrap gap-2">
          <SearchBox value={q} onChange={setQ} placeholder="Account number or name…" />
          <Select label="Types" value={type} onChange={setType} options={["all", "checking", "savings", "business"]} />
          <Select label="Statuses" value={status} onChange={setStatus} options={["all", "active", "frozen", "closed"]} />
        </div>
        {isLoading && combinedRows.length === 0 ? <Loading /> : (
          <Table head={["Account", "Holder", "Type", "Balance", "Status", "Control"]} empty={rows.length === 0}>
            {rows.map((a) => (
              <tr key={a.id} className="hover:bg-accent/30">
                <td className="px-4 py-3 font-mono text-xs">{a.account_number}</td>
                <td className="px-4 py-3 font-medium">{a.customers?.full_name}</td>
                <td className="px-4 py-3 capitalize">{a.account_type}</td>
                <td className="px-4 py-3 font-display font-semibold">{money(a.balance)}</td>
                <td className="px-4 py-3"><Status value={a.status} /></td>
                <td className="px-4 py-3">
                  <span className="text-xs text-muted-foreground font-mono">Central Treasury</span>
                </td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </>
  );
}
