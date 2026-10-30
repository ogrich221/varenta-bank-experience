import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { adminHead, money, useRows } from "@/lib/admin";
import { Loading, PageHeader, Panel } from "@/components/admin/ui";
import { monthly } from "@/components/admin/stats";

export const Route = createFileRoute("/admin/analytics")({ staticData: { sitemap: false }, head: adminHead("Analytics"), component: Analytics });

const tip = { contentStyle: { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 } };
const axis = { stroke: "var(--muted-foreground)", fontSize: 12 };
const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"];

function Analytics() {
  const t = useRows("transactions");
  const c = useRows("customers");
  if (t.isLoading || c.isLoading) return <Loading />;
  const data = monthly(t.data ?? []);
  const now = new Date();
  const growth = Array.from({ length: 6 }, (_, i) => {
    const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1);
    return { m: new Date(end.getFullYear(), end.getMonth() - 1).toLocaleString("en-US", { month: "short" }), customers: (c.data ?? []).filter((x) => new Date(x.created_at) < end).length };
  });
  const mix = ["deposit", "withdrawal", "transfer", "payment"].map((k) => ({ name: k, value: (t.data ?? []).filter((x) => x.txn_type === k).length }));
  return (
    <>
      <PageHeader title="Analytics & reports" desc="Financial performance over the last six months." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="font-semibold">Deposits & withdrawals</h2>
          <div className="mt-4 h-72"><ResponsiveContainer><BarChart data={data}>
            <CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...axis} /><YAxis {...axis} width={60} tickFormatter={(v) => money(v, true)} />
            <Tooltip {...tip} formatter={(v: number) => money(v)} /><Legend />
            <Bar dataKey="deposits" fill="var(--chart-1)" radius={[8, 8, 0, 0]} /><Bar dataKey="withdrawals" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
          </BarChart></ResponsiveContainer></div>
        </Panel>
        <Panel>
          <h2 className="font-semibold">Transaction activity</h2>
          <div className="mt-4 h-72"><ResponsiveContainer><LineChart data={data}>
            <CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...axis} /><YAxis {...axis} width={40} />
            <Tooltip {...tip} /><Line dataKey="count" name="Transactions" stroke="var(--chart-1)" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart></ResponsiveContainer></div>
        </Panel>
        <Panel>
          <h2 className="font-semibold">Customer growth</h2>
          <div className="mt-4 h-72"><ResponsiveContainer><LineChart data={growth}>
            <CartesianGrid stroke="var(--border)" vertical={false} /><XAxis dataKey="m" {...axis} /><YAxis {...axis} width={40} />
            <Tooltip {...tip} /><Line dataKey="customers" stroke="var(--chart-2)" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart></ResponsiveContainer></div>
        </Panel>
        <Panel>
          <h2 className="font-semibold">Transaction mix</h2>
          <div className="mt-4 h-72"><ResponsiveContainer><PieChart>
            <Pie data={mix} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={4}>
              {mix.map((m, i) => <Cell key={m.name} fill={colors[i]} stroke="none" />)}
            </Pie><Tooltip {...tip} /><Legend />
          </PieChart></ResponsiveContainer></div>
        </Panel>
      </div>
    </>
  );
}
