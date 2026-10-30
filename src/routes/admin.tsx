import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import {
  LayoutDashboard, Users, Wallet, ArrowLeftRight, ArrowDownLeft, ArrowUpRight, Send, Landmark,
  CreditCard, BarChart3, Bell, LifeBuoy, Settings, LogOut, Search,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { adminHead, useRows } from "@/lib/admin";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: adminHead("Dashboard"),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/admin/login" });
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: data.user.id, _role: "admin" });
    if (!isAdmin) throw redirect({ to: "/admin/login", search: { denied: "1" } });
    return { user: data.user };
  },
  component: AdminLayout,
});

const items = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/accounts", label: "Accounts", icon: Wallet },
  { to: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
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

function useSignOut() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  return async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };
}

function AdminSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { state, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const signOut = useSignOut();
  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border backdrop-blur-xl">
      <SidebarHeader>
        <Link to="/admin" className="flex items-center gap-2 px-1 py-2 font-display font-bold" aria-label="Varenta admin home">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">V</span>
          {!collapsed && <span>Varenta<span className="text-primary"> Admin</span></span>}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((i) => (
                <SidebarMenuItem key={i.to}>
                  <SidebarMenuButton asChild isActive={path === i.to} tooltip={i.label}>
                    <Link to={i.to} onClick={() => setOpenMobile(false)}><i.icon className="h-4 w-4" /><span>{i.label}</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={signOut} tooltip="Logout"><LogOut className="h-4 w-4" /><span>Logout</span></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

function TopBar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const { user } = Route.useRouteContext();
  const notes = useRows("notifications");
  const unread = notes.data?.filter((n) => !n.is_read).length ?? 0;
  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border px-3 sm:px-6">
      <SidebarTrigger aria-label="Toggle menu" />
      <form className="relative flex-1 max-w-md" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/admin/customers", search: { q } }); }}>
        <label htmlFor="admin-search" className="sr-only">Search customers</label>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input id="admin-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…"
          className="h-10 w-full rounded-full border border-input bg-background/40 pl-9 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </form>
      <div className="ml-auto flex items-center gap-3">
        <Link to="/admin/notifications" className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-background/40 hover:bg-accent" aria-label={`Notifications, ${unread} unread`}>
          <Bell className="h-4 w-4" />
          {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">{unread}</span>}
        </Link>
        <Link to="/admin/settings" className="flex items-center gap-2 rounded-full border border-border bg-background/40 py-1 pl-1 pr-3 hover:bg-accent">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-primary-foreground">CEO</span>
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-sm font-semibold">CEO</span>
            <span className="block max-w-36 truncate text-[11px] text-muted-foreground">{user.email}</span>
          </span>
        </Link>
      </div>
    </header>
  );
}

function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full bg-ink">
        <div className="pointer-events-none fixed -left-32 top-20 h-96 w-96 rounded-full bg-gradient-primary opacity-20 blur-3xl" aria-hidden />
        <div className="pointer-events-none fixed -right-20 bottom-0 h-80 w-80 rounded-full bg-gradient-primary opacity-15 blur-3xl" aria-hidden />
        <AdminSidebar />
        <div className="relative flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main id="main" className="flex-1 p-4 sm:p-6 lg:p-8"><Outlet /></main>
        </div>
      </div>
      <Toaster richColors position="top-right" />
    </SidebarProvider>
  );
}
