import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminHead, audit, date, useRows } from "@/lib/admin";
import { abtn, Confirm, Loading, PageHeader, Panel, Table } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/settings")({ staticData: { sitemap: false }, head: adminHead("Settings"), component: SettingsPage });

const input = "mt-1 h-10 w-full rounded-xl border border-input bg-background/40 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function SettingsPage() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const logs = useRows("audit_logs");
  const roles = useRows("user_roles", "*", "role");
  const [cur, setCur] = useState(""); const [pw, setPw] = useState("");

  async function changePw(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.updateUser({ password: pw, current_password: cur } as never);
    if (error) { toast.error(error.message); return; }
    await audit("Changed admin password", `user:${user.id}`);
    toast.success("Password updated"); setCur(""); setPw("");
  }
  async function signOutAll() {
    await audit("Signed out all sessions", `user:${user.id}`);
    await supabase.auth.signOut({ scope: "global" });
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <>
      <PageHeader title="Security & settings" desc="Profile, access control and the audit trail." />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel>
          <h2 className="flex items-center gap-2 font-semibold"><UserRound className="h-4 w-4 text-primary" />Profile</h2>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary font-bold text-primary-foreground shadow-glow">CEO</span>
            <div><p className="font-semibold">CEO</p><p className="text-sm text-muted-foreground">{user.email}</p><p className="text-xs text-muted-foreground">Last sign-in {"last_sign_in_at" in user && user.last_sign_in_at ? date(user.last_sign_in_at) : "—"}</p></div>
          </div>
        </Panel>
        <Panel>
          <h2 className="flex items-center gap-2 font-semibold"><KeyRound className="h-4 w-4 text-primary" />Change password</h2>
          <form onSubmit={changePw} className="mt-4 space-y-3">
            <label className="block text-sm">Current password<input type="password" required autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} className={input} /></label>
            <label className="block text-sm">New password<input type="password" required minLength={8} autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} className={input} /></label>
            <button className={abtn("primary")}>Update password</button>
          </form>
        </Panel>
        <Panel>
          <h2 className="flex items-center gap-2 font-semibold"><ShieldCheck className="h-4 w-4 text-primary" />Access control</h2>
          <p className="mt-2 text-sm text-muted-foreground">Only accounts with the admin role can open this dashboard. Every action is recorded below.</p>
          <ul className="mt-3 space-y-1 text-sm">
            {(roles.data ?? []).map((r) => <li key={r.id} className="flex justify-between rounded-xl bg-background/40 px-3 py-2"><span className="truncate font-mono text-xs">{r.user_id === user.id ? "You (CEO)" : r.user_id.slice(0, 8)}</span><span className="capitalize text-primary">{r.role}</span></li>)}
          </ul>
          <div className="mt-4"><Confirm tone="danger" label={<><LogOut className="h-3 w-3" />Sign out everywhere</>} title="Sign out of all devices?" desc="Every active admin session will end, including this one." onConfirm={signOutAll} /></div>
        </Panel>
      </div>
      <Panel className="mt-6">
        <h2 className="mb-4 font-semibold">Audit log</h2>
        {logs.isLoading ? <Loading /> : (
          <Table head={["When", "Who", "Action", "Target"]} empty={(logs.data ?? []).length === 0}>
            {(logs.data ?? []).map((l) => (
              <tr key={l.id}>
                <td className="whitespace-nowrap px-4 py-3 text-xs text-muted-foreground">{date(l.created_at)}</td>
                <td className="px-4 py-3">{l.actor_email}</td>
                <td className="px-4 py-3 font-medium">{l.action}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{l.target}</td>
              </tr>
            ))}
          </Table>
        )}
      </Panel>
    </>
  );
}
