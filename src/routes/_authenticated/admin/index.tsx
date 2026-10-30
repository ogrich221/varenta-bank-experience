import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CreditCard,
  HandCoins,
  Headphones,
  LayoutDashboard,
  Receipt,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { AdminShell, Money, shortWhen, StatCard, StatusPill } from "@/components/admin/Shell";
import { getOverview } from "@/lib/admin.functions";

const overviewQuery = queryOptions({
  queryKey: ["admin", "overview"],
  queryFn: () => getOverview(),
});

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(overviewQuery),
  head: () => ({
    meta: [
      { title: "Bank Overview — Varenta Admin Console" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OverviewPage,
});

function OverviewPage() {
  const { data } = useSuspenseQuery(overviewQuery);
  const { totals, month, daily, recent, alerts } = data;

  const peak = Math.max(1, ...daily.map((d) => Math.max(d.deposits, d.withdrawals)));

  const flow: { label: string; value: number; Icon: typeof Users }[] = [
    { label: "Deposits", value: month.deposits, Icon: TrendingUp },
    { label: "Withdrawals", value: month.withdrawals, Icon: TrendingDown },
    { label: "Transfers", value: month.transfers, Icon: ArrowUpRight },
    { label: "Payments", value: month.payments, Icon: CreditCard },
  ];


  return (
    <AdminShell
      title="Bank overview"
      subtitle="Live position across customers, accounts, payments and lending."
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Assets under management"
          value={<Money value={totals.assets} />}
          hint={`${totals.accounts} active and frozen accounts`}
          Icon={Wallet}
          tone="good"
        />
        <StatCard
          label="Customers"
          value={String(totals.customers)}
          hint={`${totals.cardsActive} cards in circulation`}
          Icon={Users}
        />
        <StatCard
          label="Awaiting review"
          value={String(totals.pendingTxns)}
          hint={`${totals.loansPending} loan requests also waiting`}
          Icon={Receipt}
          tone="warn"
        />
        <StatCard
          label="Open support"
          value={String(totals.ticketsOpen)}
          hint={`${totals.alertsUnread} unread bank alerts`}
          Icon={Headphones}
          tone={totals.ticketsOpen > 0 ? "warn" : "default"}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-5">
        <section className="glass rounded-3xl p-5 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-base font-bold">Money flow, last 14 days</h2>
            <span className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-primary" /> Deposits
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-sky-400" /> Withdrawals
              </span>
            </span>
          </div>
          <div className="mt-5 flex h-44 items-end gap-1.5">
            {daily.map((d) => (
              <div key={d.day} className="group flex h-full flex-1 items-end gap-0.5">
                <div
                  className="flex-1 rounded-t-md bg-gradient-primary opacity-80 transition-opacity group-hover:opacity-100"
                  style={{ height: `${Math.max(2, (d.deposits / peak) * 100)}%` }}
                  title={`${d.day}: ${d.deposits.toLocaleString()} in`}
                />
                <div
                  className="flex-1 rounded-t-md bg-sky-400/70 transition-opacity group-hover:opacity-100"
                  style={{ height: `${Math.max(2, (d.withdrawals / peak) * 100)}%` }}
                  title={`${d.day}: ${d.withdrawals.toLocaleString()} out`}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border/50 pt-4 sm:grid-cols-4">
            {flow.map(({ label, value, Icon }) => (
              <div key={label}>
                <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  {label}
                </span>
                <Money value={value} className="mt-1 block font-display text-lg font-bold" />
              </div>
            ))}
          </div>

        </section>

        <section className="glass rounded-3xl p-5 lg:col-span-2">
          <h2 className="font-display text-base font-bold">Needs your attention</h2>
          <ul className="mt-4 space-y-3">
            {alerts.length === 0 ? (
              <li className="rounded-2xl border border-border/50 px-4 py-6 text-center text-xs text-muted-foreground">
                Nothing flagged right now.
              </li>
            ) : (
              alerts.map((a) => (
                <li key={a.id} className="rounded-2xl border border-border/50 px-4 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold">{a.title}</p>
                    <StatusPill status={a.level} />
                  </div>
                  {a.body ? (
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{a.body}</p>
                  ) : null}
                </li>
              ))
            )}
          </ul>
          <Link
            to="/admin/transactions"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Receipt className="h-3.5 w-3.5" /> Review pending payments
          </Link>
        </section>
      </div>

      <section className="glass mt-4 rounded-3xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-base font-bold">Latest activity</h2>
          <Link
            to="/admin/transactions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <LayoutDashboard className="h-3.5 w-3.5" /> All transactions
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm [&_th]:pr-4 [&_td]:pr-4 [&_th:last-child]:pr-0 [&_td:last-child]:pr-0">
            <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="pb-2 font-semibold">Customer</th>
                <th className="pb-2 font-semibold">Reference</th>
                <th className="pb-2 font-semibold">Type</th>
                <th className="pb-2 text-right font-semibold">Amount</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {recent.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-accent/40">
                  <td className="py-2.5 font-medium">{t.customer}</td>
                  <td className="py-2.5 font-mono text-xs text-muted-foreground">{t.reference}</td>
                  <td className="py-2.5 capitalize text-muted-foreground">{t.type}</td>
                  <td className="py-2.5 text-right">
                    <Money value={t.amount} />
                  </td>
                  <td className="py-2.5">
                    <StatusPill status={t.status} />
                  </td>
                  <td className="py-2.5 text-xs text-muted-foreground">
                    {shortWhen(t.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Link
          to="/admin/customers"
          className="glass flex items-center gap-3 rounded-3xl p-4 transition-transform hover:-translate-y-0.5"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <Users className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Customer book</span>
            <span className="block text-xs text-muted-foreground">KYC, balances, cards</span>
          </span>
        </Link>
        <Link
          to="/admin/loans"
          className="glass flex items-center gap-3 rounded-3xl p-4 transition-transform hover:-translate-y-0.5"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <HandCoins className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Lending desk</span>
            <span className="block text-xs text-muted-foreground">Approve and track loans</span>
          </span>
        </Link>
        <Link
          to="/admin/audit"
          className="glass flex items-center gap-3 rounded-3xl p-4 transition-transform hover:-translate-y-0.5"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 text-primary">
            <TrendingUp className="h-4 w-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold">Audit trail</span>
            <span className="block text-xs text-muted-foreground">Who changed what, when</span>
          </span>
        </Link>
      </div>
    </AdminShell>
  );
}
