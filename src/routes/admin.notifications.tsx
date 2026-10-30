import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, Info, ShieldAlert } from "lucide-react";
import { adminHead, date, useRows, useUpdate } from "@/lib/admin";
import { abtn, Loading, PageHeader, Select, Status } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/notifications")({ head: adminHead("Notifications"), component: Notifications });

const icons = { info: Info, success: CheckCircle2, warning: AlertTriangle, critical: ShieldAlert } as Record<string, typeof Bell>;

function Notifications() {
  const { data, isLoading } = useRows("notifications");
  const upd = useUpdate("notifications");
  const [level, setLevel] = useState("all");
  const rows = (data ?? []).filter((n) => level === "all" || n.level === level);
  const unread = (data ?? []).filter((n) => !n.is_read);
  return (
    <>
      <PageHeader title="Notifications" desc={`${unread.length} unread`}>
        <Select label="Levels" value={level} onChange={setLevel} options={["all", "critical", "warning", "info", "success"]} />
        {unread.length > 0 && <button className={abtn("primary")} onClick={() => unread.forEach((n) => upd.mutate({ id: n.id, patch: { is_read: true }, label: "Marked notifications read" }))}>Mark all read</button>}
      </PageHeader>
      {isLoading ? <Loading /> : (
        <ul className="space-y-3">
          {rows.map((n) => {
            const I = icons[n.level] ?? Bell;
            return (
              <li key={n.id} className={`glass flex items-start gap-4 rounded-3xl p-4 ${n.is_read ? "opacity-60" : ""}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-primary"><I className="h-5 w-5" aria-hidden /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{n.title}</h2><Status value={n.level} /></div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{date(n.created_at)}</p>
                </div>
                {!n.is_read && <button className={abtn()} onClick={() => upd.mutate({ id: n.id, patch: { is_read: true }, label: "Marked as read" })}>Mark read</button>}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
