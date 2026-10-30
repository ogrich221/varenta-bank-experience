import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, KeyRound, Mail, ShieldCheck, Sparkles, Eye, EyeOff, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAdminSetupStatus, whoAmI } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Administrator Sign In — Varenta Bank" },
      {
        name: "description",
        content: "Restricted sign-in for Varenta Bank administrators and operations staff.",
      },
      { property: "og:title", content: "Administrator Sign In — Varenta Bank" },
      {
        property: "og:description",
        content: "Restricted sign-in for Varenta Bank administrators and operations staff.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(setupQuery),
  component: AdminLoginPage,
});

import { queryOptions } from "@tanstack/react-query";

const setupQuery = queryOptions({
  queryKey: ["admin", "setup"],
  queryFn: () => getAdminSetupStatus(),
  staleTime: 60_000,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const hasAdmin = useQueryValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Already inside? Go straight to the console instead of showing the form.
  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active || !data.user) return;
      whoAmI()
        .then((me) => {
          if (me.isAdmin) navigate({ to: "/admin", replace: true });
        })
        .catch(() => {});
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function onSignIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      const me = await whoAmI();
      if (!me.isAdmin) {
        await supabase.auth.signOut();
        throw new Error("This account does not hold administrator access.");
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign you in.");
    } finally {
      setBusy(false);
    }
  }

  async function onCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/admin/login` },
      });
      if (signUpError) throw signUpError;

      if (data.session) {
        navigate({ to: "/admin" });
        return;
      }
      setNotice(
        "Account created. Confirm it from the email we just sent, then sign in here as the first administrator.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create the account.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -right-24 top-10 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-10 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[80svh] max-w-md flex-col justify-center">
        <div className="mb-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-display text-lg font-bold"
            aria-label="Varenta Bank home"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
              V
            </span>
            <span>
              Varenta<span className="text-primary"> Admin</span>
            </span>
          </Link>
          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            Restricted — administrators only
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold">
            {hasAdmin ? "Sign in to the console" : "Create the first admin account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {hasAdmin
              ? "Bank-wide customer, transaction and lending controls live behind this door."
              : "No administrator exists yet. The first account created here runs the bank console."}
          </p>
        </div>

        <div className="glass rounded-[2rem] p-6 shadow-glass sm:p-8">
          <form
            onSubmit={hasAdmin ? onSignIn : onCreateAdmin}
            className="space-y-4"
            aria-label={hasAdmin ? "Administrator sign in" : "Create administrator account"}
          >
            <div>
              <label htmlFor="admin-email" className="mb-1 block text-xs font-semibold">
                Work email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@varentabank.com"
                  className="w-full rounded-2xl border border-border/60 bg-background/70 py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-1 block text-xs font-semibold">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="admin-password"
                  type={show ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete={hasAdmin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-2xl border border-border/60 bg-background/70 py-2.5 pl-10 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {notice ? (
              <p className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">
                {notice}
              </p>
            ) : null}
            {error ? (
              <p role="alert" className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:brightness-105 disabled:opacity-60"
            >
              {busy ? "Working…" : hasAdmin ? "Sign in" : "Create admin account"}
              {hasAdmin ? <ArrowRight className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            </button>
          </form>

          <div className="mt-6 border-t border-border/40 pt-4 text-center text-xs text-muted-foreground">
            <Link to="/" className="font-semibold text-primary hover:underline">
              Back to varentabank.com
            </Link>
          </div>
        </div>

        <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" />
          Every action taken in the console is written to an audit trail.
        </p>
      </div>
    </div>
  );
}

function useQueryValue() {
  const [hasAdmin, setHasAdmin] = useState(true);
  useEffect(() => {
    let active = true;
    getAdminSetupStatus()
      .then((r) => active && setHasAdmin(r.hasAdmin))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  return hasAdmin;
}
