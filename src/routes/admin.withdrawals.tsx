import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import { TxnManager } from "@/components/admin/TxnManager";

export const Route = createFileRoute("/admin/withdrawals")({
  head: adminHead("Withdrawals"),
  component: () => (<><PageHeader title="Withdrawals" desc="Withdrawal requests waiting for review and completed payouts." /><TxnManager type="withdrawal" /></>),
});
