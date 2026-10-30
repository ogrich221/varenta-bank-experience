import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Activity, Search } from "lucide-react";
import { AdminShell, EmptyState, StatCard } from "@/components/admin/Shell";
import { getAuditLog } from "@/lib/admin.functions";

const auditQuery = queryOptions({
  queryKey: ["admin", "audit"],
  queryFn: () => getAuditLog(),
});

export const Route = createFileRoute("/_authenticated/admin/audit")({
  loader: ({ context }) => context.queryClient.ensureQueryData(auditQuery),
  head: () => ({
    meta: [
      { title: "Audit Trail — Varenta Admin Console" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuditPage,
});

function detailsText(details: unknown): string {
  if (details == null) return "—";
  if (typeof details === "string") return details;
  try {
    return JSON.stringify(details);
  } catch {
    return "—";
  }
}

function AuditPage() {
  const { data } = useSuspenseQuery(auditQuery);
  const [q, setQ] = useState("");

  const rows = data.rows.filter((r) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return true;
    return [r.actor_email ?? "", r.action, r.target ?? "", detailsText(r.details)]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  return (
    <AdminShell
      title="Audit trail"
      subtitle="Every administrator action, newest first."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label="Recorded actions" value={String(data.rows.length)} Icon={Activity} />
        <StatCard
          label="Distinct administrators"
          value={String(new Set(data.rows.map((r) => r.actor_email ?? "unknown")).size)}
          Icon={Search}
        />
      </div>

      <div className="glass mt-4 rounded-3xl p-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search administrator, action or reference"
            aria-label="Search audit trail"
            className="w-full rounded-full border border-border/60 bg-background/70 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          {rows.length === 0 ? (
            <EmptyState>
              {data.rows.length === 0
                ? "Nothing has been recorded yet — decisions taken in the console appear here."
                : "No entries match this search."}
            </EmptyState>
          ) : (
            <table className="w-full min-w-[52rem] text-left text-sm">
              <thead className="text-[11px] uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-2 font-semibold">When</th>
                  <th className="pb-2 font-semibold">Administrator</th>
                  <th className="pb-2 font-semibold">Action</th>
                  <th className="pb-2 font-semibold">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rows.map((r) => (
                  <tr key={r.id} className="transition-colors hover:bg-accent/40">
                    <td className="py-3 text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 font-medium">{r.actor_email ?? "—"}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
                        {r.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 font-mono text-xs text-muted-foreground">
                      {detailsText(r.details)}
                      {r.target ? ` · ${r.target.slice(0, 8)}` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
