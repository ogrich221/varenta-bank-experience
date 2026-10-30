import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { adminHead, date, useRows, useUpdate } from "@/lib/admin";
import { abtn, Confirm, Loading, PageHeader, Select, Status } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/support")({ head: adminHead("Support"), component: Support });

type T = { id: string; subject: string; message: string | null; priority: string; status: string; created_at: string; customers: { full_name: string; email: string } | null };

function Support() {
  const { data, isLoading } = useRows("support_tickets", "*, customers(full_name, email)");
  const upd = useUpdate("support_tickets");
  const [status, setStatus] = useState("all");
  const rows = ((data ?? []) as unknown as T[]).filter((t) => status === "all" || t.status === status);
  const cols = ["open", "in_progress", "resolved"] as const;
  return (
    <>
      <PageHeader title="Support" desc="Customer requests by status."><Select label="Statuses" value={status} onChange={setStatus} options={["all", ...cols]} /></PageHeader>
      {isLoading ? <Loading /> : (
        <div className="grid gap-4 lg:grid-cols-3">
          {cols.filter((c) => status === "all" || c === status).map((col) => (
            <section key={col} className="glass rounded-3xl p-4" aria-label={col}>
              <h2 className="mb-3 flex items-center justify-between font-semibold capitalize">{col.replace("_", " ")}<span className="text-xs text-muted-foreground">{rows.filter((t) => t.status === col).length}</span></h2>
              <ul className="space-y-3">
                {rows.filter((t) => t.status === col).map((t) => (
                  <li key={t.id} className="rounded-2xl border border-border bg-background/40 p-4">
                    <div className="flex items-start justify-between gap-2"><h3 className="font-medium">{t.subject}</h3><Status value={t.priority} /></div>
                    <p className="mt-1 text-sm text-muted-foreground">{t.message}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{t.customers?.full_name} · {date(t.created_at)}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {t.customers?.email && <a className={abtn()} href={`mailto:${t.customers.email}?subject=Re: ${encodeURIComponent(t.subject)}`}>Reply</a>}
                      {t.status === "open" && <button className={abtn()} onClick={() => upd.mutate({ id: t.id, patch: { status: "in_progress" }, label: `Started "${t.subject}"` })}>Start</button>}
                      {t.status !== "resolved" && <Confirm tone="success" label="Resolve" title="Resolve ticket?" desc={`Closes "${t.subject}".`} onConfirm={() => upd.mutate({ id: t.id, patch: { status: "resolved" }, label: `Resolved "${t.subject}"` })} />}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
