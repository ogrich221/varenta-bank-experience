import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database, Json } from "@/integrations/supabase/types";

type Client = SupabaseClient<Database>;


const TXN_STATUSES = ["pending", "approved", "completed", "rejected"] as const;
const LOAN_STATUSES = ["pending", "approved", "active", "repaid", "rejected"] as const;
const TICKET_STATUSES = ["open", "in_progress", "resolved"] as const;

export type TxnStatus = (typeof TXN_STATUSES)[number];
export type LoanStatus = (typeof LOAN_STATUSES)[number];
export type TicketStatus = (typeof TICKET_STATUSES)[number];

/**
 * Every handler below re-checks the admin role server-side: a route guard only
 * protects the UI, the RPC endpoint behind a server function stays callable
 * directly. `has_role` is a security-definer function, so it is not affected by
 * the RLS rules on user_roles.
 */
async function requireAdmin(supabase: Client, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(`Could not confirm access: ${error.message}`);
  if (!data) throw new Error("Administrator access required");
}

async function recordAudit(
  supabase: Client,
  userId: string,
  email: string,
  action: string,
  target: string,
  details?: Record<string, unknown>,
) {
  const { error } = await supabase.from("audit_logs").insert({
    actor_id: userId,
    actor_email: email || null,
    action,
    target,
    details: (details ?? null) as Json,

  });
  // A failed audit write must not fail the action the admin just took.
  if (error) console.error("[audit] could not record:", error.message);
}

function emailOf(claims: unknown): string {
  return (claims as { email?: string }).email ?? "";
}

/** The signed-in account's identity plus whether it may open the console. */
export const whoAmI = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId, claims } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });
    return { userId, email: emailOf(claims), isAdmin: Boolean(isAdmin) };
  });

/**
 * Public bootstrap check: reports only whether an administrator account exists
 * yet, so the sign-in page can offer "create the first admin account".
 */
export const getAdminSetupStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin");
    return { hasAdmin: !error && Boolean(count) };
  },
);

export type OverviewDTO = {
  totals: {
    customers: number;
    accounts: number;
    assets: number;
    pendingTxns: number;
    loansPending: number;
    cardsActive: number;
    ticketsOpen: number;
    alertsUnread: number;
  };
  month: { deposits: number; withdrawals: number; transfers: number; payments: number };
  daily: { day: string; deposits: number; withdrawals: number }[];
  recent: {
    id: string;
    reference: string;
    type: string;
    amount: number;
    status: string;
    created_at: string;
    customer: string;
    counterparty: string | null;
  }[];
  alerts: { id: string; title: string; body: string | null; level: string; created_at: string }[];
};

export const getOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<OverviewDTO> => {
    const { supabase, userId } = context;
    await requireAdmin(supabase, userId);

    const since = new Date();
    since.setDate(since.getDate() - 13);
    since.setHours(0, 0, 0, 0);
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [custCount, accounts, pendCount, loans, cards, ticketCount, alerts, recent, window] =
      await Promise.all([
        supabase.from("customers").select("*", { count: "exact", head: true }),
        supabase.from("accounts").select("balance, status"),
        supabase
          .from("transactions")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("loans").select("status"),
        supabase.from("cards").select("status"),
        supabase
          .from("support_tickets")
          .select("*", { count: "exact", head: true })
          .in("status", ["open", "in_progress"]),
        supabase
          .from("notifications")
          .select("id, title, body, level, created_at")
          .eq("is_read", false)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("transactions")
          .select(
            "id, reference, txn_type, amount, status, created_at, counterparty, customers(full_name)",
          )
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("transactions")
          .select("amount, txn_type, status, created_at")
          .gte("created_at", since.toISOString()),
      ]);

    const month = { deposits: 0, withdrawals: 0, transfers: 0, payments: 0 };
    const buckets = new Map<string, { deposits: number; withdrawals: number }>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      buckets.set(d.toISOString().slice(0, 10), { deposits: 0, withdrawals: 0 });
    }

    for (const t of window.data ?? []) {
      const day = new Date(t.created_at);
      day.setHours(0, 0, 0, 0);
      const key = day.toISOString().slice(0, 10);
      const bucket = buckets.get(key);
      const amount = Number(t.amount) || 0;
      if (t.txn_type === "deposit") month.deposits += amount;
      if (t.txn_type === "withdrawal") month.withdrawals += amount;
      if (t.txn_type === "transfer") month.transfers += amount;
      if (t.txn_type === "payment") month.payments += amount;
      if (bucket && t.txn_type === "deposit") bucket.deposits += amount;
      if (bucket && t.txn_type === "withdrawal") bucket.withdrawals += amount;
    }

    return {
      totals: {
        customers: custCount.count ?? 0,
        accounts: accounts.data?.length ?? 0,
        assets: (accounts.data ?? [])
          .filter((a) => a.status === "active")
          .reduce((sum, a) => sum + Number(a.balance || 0), 0),
        pendingTxns: pendCount.count ?? 0,
        loansPending: (loans.data ?? []).filter((l) => l.status === "pending").length,
        cardsActive: (cards.data ?? []).filter((c) => c.status === "active").length,
        ticketsOpen: ticketCount.count ?? 0,
        alertsUnread: alerts.data?.length ?? 0,
      },
      month: monthStart ? month : month,
      daily: [...buckets.entries()].map(([day, v]) => ({ day, ...v })),
      recent: (recent.data ?? []).map((t) => ({
        id: t.id,
        reference: t.reference,
        type: t.txn_type,
        amount: Number(t.amount) || 0,
        status: t.status,
        created_at: t.created_at,
        customer: t.customers?.full_name ?? "—",
        counterparty: t.counterparty,
      })),
      alerts: alerts.data ?? [],
    };
  });

export type CustomerRow = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  status: string;
  kyc_verified: boolean;
  created_at: string;
  accounts: number;
  balance: number;
  cards: number;
  loans: number;
};

export const getCustomers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: CustomerRow[] }> => {
    const { supabase, userId } = context;
    await requireAdmin(supabase, userId);

    const [customers, accounts, cards, loans] = await Promise.all([
      supabase.from("customers").select("*").order("created_at", { ascending: false }),
      supabase.from("accounts").select("customer_id, balance, status"),
      supabase.from("cards").select("customer_id"),
      supabase.from("loans").select("customer_id"),
    ]);

    const totals = new Map<string, { accounts: number; balance: number }>();
    for (const a of accounts.data ?? []) {
      const prev = totals.get(a.customer_id) ?? { accounts: 0, balance: 0 };
      totals.set(a.customer_id, {
        accounts: prev.accounts + 1,
        balance: prev.balance + (a.status === "active" ? Number(a.balance || 0) : 0),
      });
    }
    const countBy = (rows: { customer_id: string | null }[] | null) => {
      const m = new Map<string, number>();
      for (const r of rows ?? []) {
        if (!r.customer_id) continue;
        m.set(r.customer_id, (m.get(r.customer_id) ?? 0) + 1);
      }
      return m;
    };
    const cardCounts = countBy(cards.data);
    const loanCounts = countBy(loans.data);

    return {
      rows: (customers.data ?? []).map((c) => ({
        ...c,
        accounts: totals.get(c.id)?.accounts ?? 0,
        balance: totals.get(c.id)?.balance ?? 0,
        cards: cardCounts.get(c.id) ?? 0,
        loans: loanCounts.get(c.id) ?? 0,
      })),
    };
  });

export type TxnRow = {
  id: string;
  reference: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  customer: string;
  counterparty: string | null;
  description: string | null;
};

export const getTransactions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: TxnRow[] }> => {
    const { supabase, userId } = context;
    await requireAdmin(supabase, userId);

    const { data, error } = await supabase
      .from("transactions")
      .select(
        "id, reference, txn_type, amount, status, created_at, counterparty, description, customers(full_name)",
      )
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);

    return {
      rows: (data ?? []).map((t) => ({
        id: t.id,
        reference: t.reference,
        type: t.txn_type,
        amount: Number(t.amount) || 0,
        status: t.status,
        created_at: t.created_at,
        customer: t.customers?.full_name ?? "—",
        counterparty: t.counterparty,
        description: t.description,
      })),
    };
  });

function pick<T extends readonly string[]>(value: unknown, allowed: T, what: string) {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new Error(`Invalid ${what}`);
  }
  return value as T[number];
}

export const setTransactionStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const v = (d ?? {}) as { id?: unknown; status?: unknown };
    if (typeof v.id !== "string" || !v.id) throw new Error("Missing transaction id");
    return { id: v.id, status: pick(v.status, TXN_STATUSES, "status") };
  })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;
    await requireAdmin(supabase, userId);

    const { error } = await supabase
      .from("transactions")
      .update({
        status: data.status,
        reviewed_by: userId,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    await recordAudit(supabase, userId, emailOf(claims), "transaction_update", data.id, {
      status: data.status,
    });
    return { ok: true, status: data.status };
  });

export type LoanRow = {
  id: string;
  customer: string;
  amount: number;
  interest_rate: number;
  term_months: number;
  purpose: string | null;
  status: string;
  created_at: string;
};

export const getLoans = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: LoanRow[] }> => {
    const { supabase, userId } = context;
    await requireAdmin(supabase, userId);

    const { data, error } = await supabase
      .from("loans")
      .select("id, amount, interest_rate, term_months, purpose, status, created_at, customers(full_name)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    return {
      rows: (data ?? []).map((l) => ({
        id: l.id,
        customer: l.customers?.full_name ?? "—",
        amount: Number(l.amount) || 0,
        interest_rate: Number(l.interest_rate) || 0,
        term_months: l.term_months,
        purpose: l.purpose,
        status: l.status,
        created_at: l.created_at,
      })),
    };
  });

export const setLoanStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const v = (d ?? {}) as { id?: unknown; status?: unknown };
    if (typeof v.id !== "string" || !v.id) throw new Error("Missing loan id");
    return { id: v.id, status: pick(v.status, LOAN_STATUSES, "status") };
  })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;
    await requireAdmin(supabase, userId);

    const { error } = await supabase.from("loans").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);

    await recordAudit(supabase, userId, emailOf(claims), "loan_update", data.id, {
      status: data.status,
    });
    return { ok: true, status: data.status };
  });

export type TicketRow = {
  id: string;
  customer: string;
  subject: string;
  message: string | null;
  priority: string;
  status: string;
  created_at: string;
};

export const getTickets = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: TicketRow[] }> => {
    const { supabase, userId } = context;
    await requireAdmin(supabase, userId);

    const { data, error } = await supabase
      .from("support_tickets")
      .select("id, subject, message, priority, status, created_at, customers(full_name)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);

    return {
      rows: (data ?? []).map((t) => ({
        id: t.id,
        customer: t.customers?.full_name ?? "—",
        subject: t.subject,
        message: t.message,
        priority: t.priority,
        status: t.status,
        created_at: t.created_at,
      })),
    };
  });

export const setTicketStatus = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => {
    const v = (d ?? {}) as { id?: unknown; status?: unknown };
    if (typeof v.id !== "string" || !v.id) throw new Error("Missing ticket id");
    return { id: v.id, status: pick(v.status, TICKET_STATUSES, "status") };
  })
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId, claims } = context;
    await requireAdmin(supabase, userId);

    const { error } = await supabase
      .from("support_tickets")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);

    await recordAudit(supabase, userId, emailOf(claims), "ticket_update", data.id, {
      status: data.status,
    });
    return { ok: true, status: data.status };
  });

export type AuditRow = {
  id: string;
  actor_email: string | null;
  action: string;
  target: string | null;
  details: Json;
  created_at: string;
};


export const getAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ rows: AuditRow[] }> => {
    const { supabase, userId } = context;
    await requireAdmin(supabase, userId);

    const { data, error } = await supabase
      .from("audit_logs")
      .select("id, actor_email, action, target, details, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw new Error(error.message);
    return { rows: data ?? [] };
  });
