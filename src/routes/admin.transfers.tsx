import { createFileRoute } from "@tanstack/react-router";
import { adminHead } from "@/lib/admin";
import { PageHeader } from "@/components/admin/ui";
import { TxnManager } from "@/components/admin/TxnManager";

export const Route = createFileRoute("/admin/transfers")({
  staticData: { sitemap: false },
  head: adminHead("Transfers"),
  component: () => (<><PageHeader title="Transfers" desc="Domestic and international transfers across all accounts." /><TxnManager type="transfer" /></>),
});
