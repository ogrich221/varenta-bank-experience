import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import { TxnManager } from "@/components/admin/TxnManager";

export const Route = createFileRoute("/admin/deposits")({
  head: adminHead("Deposits"),
  component: () => (<><PageHeader title="Deposits" desc="Incoming deposits, pending approvals and completed credits." /><TxnManager type="deposit" /></>),
});
