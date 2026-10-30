type T = { created_at: string; txn_type: string; amount: number; status: string };

/** Group transactions into the last 6 months. */
export function monthly(rows: T[], months = 6) {
  const now = new Date();
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (months - 1 - i), 1);
    return { key: `${d.getFullYear()}-${d.getMonth()}`, m: d.toLocaleString("en-US", { month: "short" }), deposits: 0, withdrawals: 0, transfers: 0, payments: 0, count: 0 };
  });
  for (const r of rows) {
    if (r.status === "rejected") continue;
    const d = new Date(r.created_at);
    const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
    if (!b) continue;
    b.count++;
    const k = (r.txn_type + "s") as "deposits" | "withdrawals" | "transfers" | "payments";
    b[k] += Number(r.amount);
  }
  return buckets;
}
