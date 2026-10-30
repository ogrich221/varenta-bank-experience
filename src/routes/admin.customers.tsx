import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BadgeCheck, Eye, Snowflake, Sun, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { adminHead, date, money, useRows, useUpdate, type Row } from "@/lib/admin";
import { abtn, Confirm, Loading, PageHeader, Panel, SearchBox, Select, Status, Table } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/customers")({
  validateSearch: (s: Record<string, unknown>): { q?: string } => (typeof s["q"] === "string" && s["q"] ? { q: s["q"] } : {}),
  head: adminHead("Customers"),
  component: Customers,
});

function Customers() {
  const { q = "" } = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/customers" });
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<Row<"customers"> | null>(null);
  const customers = useRows("customers");
  const accounts = useRows("accounts");
  const upd = useUpdate("customers");
  const balances = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of accounts.data ?? []) m.set(a.customer_id, (m.get(a.customer_id) ?? 0) + Number(a.balance));
    return m;
  }, [accounts.data]);
  const rows = (customers.data ?? []).filter((c) => (status === "all" || c.status === status) &&
    (!q || `${c.full_name} ${c.email} ${c.country}`.toLowerCase().includes(q.toLowerCase())));

  return (
    <>
      <PageHeader title="Customers" desc={`${customers.data?.length ?? 0} customers across all branches.`} />
      <Panel>
        <div className="mb-4 flex flex-wrap gap-2">
          <SearchBox value={q} onChange={(v) => navigate({ search: v ? { q: v } : {}, replace: true })} placeholder="Search name, email, country…" />
          <Select label="Statuses" value={status} onChange={setStatus} options={["all", "active", "frozen", "closed"]} />
        </div>
        {customers.isLoading ? <Loading /> : (
          <Table head={["Customer", "Country", "Balance", "KYC", "Status", "Joined", ""]} empty={rows.length === 0}>
            {rows.map((c) => (
              <tr key={c.id} className="hover:bg-accent/30">
                <td className="px-4 py-3"><p className="font-medium">{c.full_name}</p><p className="text-xs text-muted-foreground">{c.email}</p></td>
                <td className="px-4 py-3">{c.country}</td>
                <td className="px-4 py-3 font-display font-semibold">{money(balances.get(c.id) ?? 0)}</td>
                <td className="px-4 py-3">{c.kyc_verified ? <Status value="approved" /> : <Status value="pending" />}</td>
                <td className="px-4 py-3"><Status value={c.status} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3"><button className={abtn()} onClick={() => setOpen(c)}><Eye className="h-3 w-3" />View</button></td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        {open && <CustomerDetail c={(customers.data ?? []).find((x) => x.id === open.id) ?? open} upd={upd} />}
      </Dialog>
    </>
  );
}

function CustomerDetail({ c, upd }: { c: Row<"customers">; upd: ReturnType<typeof useUpdate<"customers">> }) {
  const accounts = (useRows("accounts").data ?? []).filter((a) => a.customer_id === c.id);
  const txns = (useRows("transactions", "*, customers(full_name)").data ?? []).filter((t) => t.customer_id === c.id);
  const set = (patch: Partial<Row<"customers">>, label: string) => upd.mutate({ id: c.id, patch, label });
  return (
    <DialogContent className="glass max-h-[90vh] max-w-2xl overflow-y-auto border-border">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">{c.full_name}<Status value={c.status} /></DialogTitle>
        <DialogDescription>{c.email} · {c.phone} · {c.country}</DialogDescription>
      </DialogHeader>
      <div className="flex flex-wrap gap-2">
        {!c.kyc_verified && <Confirm tone="success" label={<><BadgeCheck className="h-3 w-3" />Verify KYC</>} title="Mark identity verified?" desc={`Confirms ${c.full_name}'s documents were checked.`} onConfirm={() => set({ kyc_verified: true }, `KYC verified for ${c.full_name}`)} />}
        {c.status === "active" && <Confirm label={<><Snowflake className="h-3 w-3" />Freeze</>} title="Freeze this customer?" desc="They won't be able to move money until unfrozen." onConfirm={() => set({ status: "frozen" }, `Froze ${c.full_name}`)} />}
        {c.status === "frozen" && <Confirm tone="success" label={<><Sun className="h-3 w-3" />Unfreeze</>} title="Unfreeze this customer?" desc="Restores full access to their accounts." onConfirm={() => set({ status: "active" }, `Unfroze ${c.full_name}`)} />}
        {c.status !== "closed" && <Confirm tone="danger" label={<><XCircle className="h-3 w-3" />Close</>} title="Close this customer relationship?" desc="This is a serious action. The customer will lose access." onConfirm={() => set({ status: "closed" }, `Closed ${c.full_name}`)} />}
      </div>
      <h3 className="mt-2 text-sm font-semibold">Accounts</h3>
      <ul className="space-y-2">
        {accounts.map((a) => (
          <li key={a.id} className="flex items-center justify-between rounded-2xl border border-border bg-background/40 p-3 text-sm">
            <span><span className="font-mono text-xs">{a.account_number}</span><span className="ml-2 capitalize text-muted-foreground">{a.account_type}</span></span>
            <span className="flex items-center gap-2 font-display font-semibold">{money(a.balance)}<Status value={a.status} /></span>
          </li>
        ))}
      </ul>
      <h3 className="mt-2 text-sm font-semibold">Transaction history</h3>
      <ul className="divide-y divide-border text-sm">
        {txns.slice(0, 12).map((t) => (
          <li key={t.id} className="flex items-center justify-between py-2">
            <span><span className="capitalize">{t.txn_type}</span><span className="block text-xs text-muted-foreground">{date(t.created_at)}</span></span>
            <span className="flex items-center gap-2">{money(t.amount)}<Status value={t.status} /></span>
          </li>
        ))}
        {txns.length === 0 && <li className="py-3 text-muted-foreground">No transactions yet.</li>}
      </ul>
    </DialogContent>
  );
}
