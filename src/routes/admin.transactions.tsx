import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import { TxnManager } from "@/components/admin/TxnManager";

export const Route = createFileRoute("/admin/transactions")({
  head: adminHead("Transactions"),
  component: () => (<><PageHeader title="Transactions" desc="Search, filter, approve and reject every transaction in real time." /><TxnManager /></>),
});
