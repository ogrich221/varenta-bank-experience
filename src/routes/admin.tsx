import { createFileRoute, redirect, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  LayoutDashboard, Users, Wallet, ArrowLeftRight, ArrowDownLeft, ArrowUpRight, Send, Landmark,
  CreditCard, BarChart3, Bell, LifeBuoy, Settings, LogOut, Search, ExternalLink, ShieldCheck
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin")({
  staticData: { sitemap: "exclude-subtree" },
  ssr: false,
  head: () => ({
    meta: [
      { title: "Varenta Treasury & Admin Console" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) throw redirect({ to: "/admin/login" });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
    if (!isAdmin) throw redirect({ to: "/admin/login", search: { denied: "1" } });
    return { user: data.user };
  },
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Command Center", icon: LayoutDashboard },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/accounts", label: "Accounts", icon: Wallet },
  { to: "/admin/transactions", label: "Transactions & Approvals", icon: ArrowLeftRight },
  { to: "/admin/deposits", label: "Deposits", icon: ArrowDownLeft },
  { to: "/admin/withdrawals", label: "Withdrawals", icon: ArrowUpRight },
  { to: "/admin/transfers", label: "Transfers", icon: Send },
  { to: "/admin/loans", label: "Loans", icon: Landmark },
  { to: "/admin/cards", label: "Cards", icon: CreditCard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/support", label: "Support", icon: LifeBuoy },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    navigate({ to: "/" });
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-orange-500/20 bg-black/90 backdrop-blur-2xl">
      <SidebarHeader className="border-b border-white/5 pb-4">
        <Link to="/admin" className="flex items-center gap-3 px-2 py-3 font-display font-bold">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 text-black font-black text-xl shadow-[0_0_20px_rgba(249,115,22,0.5)]">
            V
          </span>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base text-white tracking-wide font-black">
                VARENTA<span className="text-orange-500"> ADMIN</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-orange-400/80 font-mono">
                Treasury Command
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((i) => {
                const isActive = path === i.to;
                return (
                  <SidebarMenuItem key={i.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={i.label}
                      className={`h-10 rounded-xl px-3 transition-all ${
                        isActive
                          ? "bg-orange-500/20 text-orange-400 font-semibold border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)]"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Link to={i.to} onClick={() => setOpenMobile(false)}>
                        <i.icon className={`h-4 w-4 ${isActive ? "text-orange-400" : "text-zinc-400"}`} />
                        <span className="text-xs">{i.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-white/5 p-3 space-y-2">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 rounded-xl bg-orange-500/10 border border-orange-500/30 px-3 py-2 text-xs font-semibold text-orange-400 hover:bg-orange-500/20 transition-all"
        >
          <ExternalLink className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Open Customer Banking</span>}
        </Link>

        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Exit Console</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

function TopBar() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-orange-500/15 bg-black/70 px-4 sm:px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-zinc-400 hover:text-white" />
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-[11px] font-mono text-orange-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>VARENTA CENTRAL TREASURY — LIVE</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <form
          className="relative hidden md:block w-64"
          onSubmit={(e) => {
            e.preventDefault();
            if (q) navigate({ to: "/admin/customers", search: { q } });
          }}
        >
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clients, txns..."
            className="h-8 w-full rounded-full border border-white/10 bg-white/5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          />
        </form>

        <div className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-black/60 px-3 py-1.5 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-[10px] font-black text-black">
            <ShieldCheck className="h-3.5 w-3.5 text-black" />
          </span>
          <div className="text-left leading-none">
            <span className="block text-xs font-bold text-white">CEO / Super Admin</span>
            <span className="text-[10px] text-orange-400">Full Execution Authority</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-[#0a0a0c] text-white selection:bg-orange-500 selection:text-black">
        {/* Ambient atmospheric orange glow */}
        <div className="pointer-events-none fixed -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-orange-500/10 blur-[140px]" />
        <div className="pointer-events-none fixed bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-orange-600/10 blur-[130px]" />

        <AdminSidebar />
        <div className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
          <TopBar />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
