import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminHead } from "@/lib/admin";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { denied?: string } => (typeof s["denied"] === "string" ? { denied: s["denied"] } : {}),
  head: adminHead("Admin sign in"),
  component: AdminLogin,
});

const input = "h-11 w-full rounded-xl border border-input bg-background/40 px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function AdminLogin() {
  const { denied } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(denied ? "This account doesn't have admin access." : null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg(error.message);
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin/login` } });
      setBusy(false);
      if (error) return setMsg(error.message);
      setMsg("Check your email to confirm your account, then sign in.");
      setMode("in");
    }
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-4">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gradient-primary opacity-25 blur-3xl" aria-hidden />
      <form onSubmit={submit} className="glass relative w-full max-w-sm rounded-[2rem] p-8">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow"><ShieldCheck className="h-6 w-6" aria-hidden /></span>
        <h1 className="mt-5 text-2xl font-bold">Varenta Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">{mode === "in" ? "Sign in to the administration console." : "Create the administrator account."}</p>
        <div className="mt-6 space-y-3">
          <label className="block text-sm font-medium">Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${input} mt-1`} /></label>
          <label className="block text-sm font-medium">Password<input type="password" required minLength={8} autoComplete={mode === "in" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className={`${input} mt-1`} /></label>
        </div>
        {msg && <p role="alert" className="mt-4 rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm">{msg}</p>}
        <button disabled={busy} className="mt-6 h-11 w-full rounded-full bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-105 disabled:opacity-60">
          {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
        </button>
        <button type="button" onClick={() => { setMode(mode === "in" ? "up" : "in"); setMsg(null); }} className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground">
          {mode === "in" ? "First time? Create the admin account" : "Already have an account? Sign in"}
        </button>
      </form>
    </main>
  );
}
