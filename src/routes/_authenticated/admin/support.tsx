import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Check, Headphones, PlayCircle, Search } from "lucide-react";
import { AdminShell, EmptyState, StatCard, StatusPill } from "@/components/admin/Shell";
import {
  getTickets,
  setTicketStatus,
  type TicketRow,
  type TicketStatus,
} from "@/lib/admin.functions";

const ticketsQuery = queryOptions({
  queryKey: ["admin", "tickets"],
  queryFn: () => getTickets(),
});

export const Route = createFileRoute("/_authenticated/admin/support")({
  loader: ({ context }) => context.queryClient.ensureQueryData(ticketsQuery),
  head: () => ({
    meta: [
      { title: "Support Desk — Varenta Admin Console" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const { data } = useSuspenseQuery(ticketsQuery);
  const queryClient = useQueryClient();
  const applyStatus = useServerFn(setTicketStatus);

  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return data.rows.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (!needle) return true;
      return [t.customer, t.subject, t.message ?? ""].join(" ").toLowerCase().includes(needle);
    });
  }, [data.rows, q, status]);

  async function move(row: TicketRow, next: TicketStatus) {
    setBusyId(row.id);
    setMessage(null);
    try {
      await applyStatus({ data: { id: row.id, status: next } });
      setMessage(`Ticket "${row.subject}" set to ${next.replace("_", " ")}.`);
      await queryClient.invalidateQueries({ queryKey: ["admin"] });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not update this ticket.");
    } finally {
      setBusyId(null);
    }
  }

  const open = data.rows.filter((t) => t.status === "open").length;
  const urgent = data.rows.filter(
    (t) => t.priority === "high" && t.status !== "resolved",
  ).length;

  return (
    <AdminShell title="Support desk" subtitle="Client requests, priorities and resolutions.">
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Tickets" value={String(data.rows.length)} Icon={Headphones} />
        <StatCard
          label="Unanswered"
          value={String(open)}
          hint="Waiting for a first reply"
          Icon={PlayCircle}
          tone={open > 0 ? "warn" : "good"}
        />
        <StatCard
          label="High priority"
          value={String(urgent)}
          hint="Not yet resolved"
          Icon={Search}
          tone={urgent > 0 ? "warn" : "default"}
        />
      </div>

      <div className="glass mt-4 rounded-3xl p-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search client, subject or message"
              aria-label="Search tickets"
              className="w-full rounded-full border border-border/60 bg-background/70 py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filter tickets by status"
            className="rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {message ? (
          <p role="status" className="mt-3 rounded-2xl border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs text-primary">
            {message}
          </p>
        ) : null}

        {rows.length === 0 ? (
          <div className="mt-4">
            <EmptyState>No tickets match this filter.</EmptyState>
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {rows.map((t) => (
              <li
                key={t.id}
                className="rounded-2xl border border-border/50 p-4 transition-colors hover:bg-accent/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-semibold">{t.subject}</h2>
                      <StatusPill status={t.status} />
                      <StatusPill status={t.priority === "high" ? "blocked" : t.priority === "low" ? "frozen" : "pending"} />
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t.customer} · {new Date(t.created_at).toLocaleString()} · priority{" "}
                      {t.priority}
                    </p>
                    {t.message ? (
                      <p className="mt-2 text-sm text-muted-foreground">{t.message}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    {t.status === "open" ? (
                      <button
                        onClick={() => move(t, "in_progress")}
                        disabled={busyId === t.id}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25 disabled:opacity-50"
                      >
                        <PlayCircle className="h-3 w-3" /> Start
                      </button>
                    ) : null}
                    {t.status !== "resolved" ? (
                      <button
                        onClick={() => move(t, "resolved")}
                        disabled={busyId === t.id}
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/25 disabled:opacity-50"
                      >
                        <Check className="h-3 w-3" /> Resolve
                      </button>
                    ) : (
                      <button
                        onClick={() => move(t, "open")}
                        disabled={busyId === t.id}
                        className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent disabled:opacity-50"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
