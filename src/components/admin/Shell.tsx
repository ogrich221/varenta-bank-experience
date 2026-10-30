import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  HandCoins,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  ShieldAlert,
  Users,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { whoAmI } from "@/lib/admin.functions";

const links = [
  { to: "/admin", label: "Overview", Icon: LayoutDashboard },
  { to: "/admin/customers", label: "Customers", Icon: Users },
  { to: "/admin/transactions", label: "Transactions", Icon: Receipt },
  { to: "/admin/loans", label: "Loans", Icon: HandCoins },
  { to: "/admin/support", label: "Support", Icon: BadgeCheck },
  { to: "/admin/audit", label: "Audit log", Icon: Activity },
] as const;

const identityQuery = {
  queryKey: ["admin", "identity"],
  queryFn: () => whoAmI(),
  staleTime: 30_000,
};

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: me, isLoading } = useQuery(identityQuery);

  async function signOut() {
    // Ordered teardown: stop in-flight reads, drop cached protected data, clear
    // the session, then replace history so Back cannot restore the console.
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  if (!isLoading && me && !me.isAdmin) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6">
        <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-primary/15 text-primary">
            <ShieldAlert className="h-6 w-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold">No administrator access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You are signed in as {me.email || "this account"}, but it does not hold the
            administrator role, so the console stays closed.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={signOut}
              className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Sign in with another account
            </button>
            <Link
              to="/"
              className="rounded-full border border-border/60 px-5 py-2.5 text-sm font-semibold"
            >
              Back to site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      </div>

      <div className="mx-auto flex min-h-screen max-w-[100rem] gap-6 px-4 py-5 lg:px-6">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="glass sticky top-5 flex h-[calc(100vh-2.5rem)] flex-col rounded-3xl p-4">
            <Link to="/" className="flex items-center gap-2 px-1 font-display text-lg font-bold">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                V
              </span>
              <span>
                Varenta<span className="text-primary"> Admin</span>
              </span>
            </Link>
            <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Admin">
              {links.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  activeProps={{ className: "bg-primary/15 text-primary font-semibold" }}
                  activeOptions={{ exact: to === "/admin" }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-border/50 pt-3">
              <p className="truncate px-2 text-xs text-muted-foreground" title={me?.email}>
                {me?.email ?? "…"}
              </p>
              <button
                onClick={signOut}
                className="mt-2 flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
              <Link
                to="/"
                className="mt-1 flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to website
              </Link>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="glass flex items-center justify-between gap-3 rounded-3xl px-4 py-3">
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-bold sm:text-xl">{title}</h1>
              {subtitle ? (
                <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            <button
              className="grid h-11 w-11 place-items-center rounded-full lg:hidden"
              aria-label={open ? "Close admin menu" : "Open admin menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </header>

          {open ? (
            <nav
              aria-label="Admin mobile"
              className="glass mt-3 flex flex-col gap-1 rounded-3xl p-3 lg:hidden"
            >
              {links.map(({ to, label, Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium hover:bg-accent"
                  activeProps={{ className: "bg-primary/15 text-primary font-semibold" }}
                  activeOptions={{ exact: to === "/admin" }}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}
              <div className="mt-2 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                <span className="truncate text-xs text-muted-foreground">{me?.email ?? "…"}</span>
                <div className="flex shrink-0 gap-2">
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold"
                  >
                    Website
                  </Link>
                  <button
                    onClick={signOut}
                    className="rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </nav>
          ) : null}

          {/* Keep the router alive across sign-out: the gate re-runs on navigation. */}
          <div className="mt-4 pb-10" key={router.state.location.pathname}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  Icon,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  Icon: typeof Users;
  tone?: "default" | "warn" | "good";
}) {
  return (
    <div className="glass rounded-3xl p-4 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span
          className={`grid h-9 w-9 place-items-center rounded-xl ${
            tone === "warn"
              ? "bg-amber-500/15 text-amber-400"
              : tone === "good"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-primary/15 text-primary"
          }`}
        >
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-2 font-display text-2xl font-bold tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export function Money({ value, className = "" }: { value: number; className?: string }) {
  return (
    <span className={`tabular-nums ${className}`}>
      {value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      })}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const tone =
    status === "approved" || status === "active" || status === "completed" || status === "resolved"
      ? "bg-emerald-500/15 text-emerald-400"
      : status === "pending" || status === "in_progress" || status === "open"
        ? "bg-amber-500/15 text-amber-400"
        : status === "frozen" || status === "blocked"
          ? "bg-sky-500/15 text-sky-400"
          : "bg-red-500/15 text-red-400";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${tone}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="glass rounded-3xl px-6 py-12 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

export { CreditCard };
