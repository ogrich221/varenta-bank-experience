import { createFileRoute, Link } from "@tanstack/react-router";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Wallet, Users, BadgeCheck, ArrowDownLeft, ArrowUpRight, Clock, TrendingUp } from "lucide-react";
import { adminHead, date, money, useRows } from "@/lib/admin";
import { Loading, PageHeader, Panel, Status } from "@/components/admin/ui";
import { monthly } from "@/components/admin/stats";

export const Route = createFileRoute("/admin/")({ head: adminHead("Overview"), component: Overview });

function Overview() {
  const accounts = useRows("accounts");
  const customers = useRows("customers");
  const txns = useRows("transactions", "*, customers(full_name)");
  if (accounts.isLoading || customers.isLoading || txns.isLoading) return <Loading />;
  const a = accounts.data ?? [], c = customers.data ?? [], t = txns.data ?? [];
  const done = t.filter((x) => x.status === "completed" || x.status === "approved");
  const tot = (k: string) => done.filter((x) => x.txn_type === k).reduce((s, x) => s + Number(x.amount), 0);
  const revenue = done.reduce((s, x) => s + Number(x.amount) * (x.txn_type === "payment" ? 0.015 : 0.004), 0);
  const stats = [
    { l: "Total bank balance", v: money(a.reduce((s, x) => s + Number(x.balance), 0), true), i: Wallet, to: "/admin/accounts" },
    { l: "Total customers", v: c.length, i: Users, to: "/admin/customers" },
    { l: "Active accounts", v: a.filter((x) => x.status === "active").length, i: BadgeCheck, to: "/admin/accounts" },
    { l: "Total deposits", v: money(tot("deposit"), true), i: ArrowDownLeft, to: "/admin/deposits" },
    { l: "Total withdrawals", v: money(tot("withdrawal"), true), i: ArrowUpRight, to: "/admin/withdrawals" },
    { l: "Pending transactions", v: t.filter((x) => x.status === "pending").length, i: Clock, to: "/admin/transactions" },
    { l: "Total revenue", v: money(revenue, true), i: TrendingUp, to: "/admin/analytics" },
  ] as const;
  const chart = monthly(t);
  return (
    <>
      <PageHeader title="Welcome back, CEO" desc="Here's how Varenta Bank is performing today." />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {stats.map((s, i) => (
          <Link key={s.l} to={s.to} className={`glass group rounded-3xl p-4 transition hover:-translate-y-1 hover:shadow-glow ${i === 0 ? "col-span-2 md:col-span-2 xl:col-span-1" : ""}`}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground transition-transform group-hover:rotate-6"><s.i className="h-4 w-4" aria-hidden /></span>
            <p className="mt-4 font-display text-xl font-bold sm:text-2xl">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </Link>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2">
          <h2 className="font-semibold">Deposits vs withdrawals</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <AreaChart data={chart}>
                <defs>
                  <linearGradient id="gd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--chart-1)" stopOpacity={0.6} /><stop offset="1" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--chart-3)" stopOpacity={0.4} /><stop offset="1" stopColor="var(--chart-3)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickFormatter={(v) => money(v, true)} width={60} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} formatter={(v: number) => money(v)} />
                <Area dataKey="deposits" stroke="var(--chart-1)" fill="url(#gd)" strokeWidth={2} />
                <Area dataKey="withdrawals" stroke="var(--chart-3)" fill="url(#gw)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel>
          <div className="flex items-center justify-between"><h2 className="font-semibold">Needs review</h2><Link to="/admin/transactions" className="text-xs text-primary hover:underline">View all</Link></div>
          <ul className="mt-4 divide-y divide-border">
            {t.filter((x) => x.status === "pending").slice(0, 7).map((x) => (
              <li key={x.id} className="flex items-center justify-between gap-2 py-3">
                <span className="min-w-0"><span className="block truncate text-sm font-medium">{(x.customers as { full_name: string } | null)?.full_name}</span><span className="text-xs capitalize text-muted-foreground">{x.txn_type} · {date(x.created_at)}</span></span>
                <span className="text-right"><span className="block font-display text-sm font-semibold">{money(x.amount)}</span><Status value={x.status} /></span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
