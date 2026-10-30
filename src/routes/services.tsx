import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/Layout";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Our Services — Varenta Bank" },
      { name: "description", content: "Savings, transfers, loans, cards and investments — all in one place." },
      { property: "og:title", content: "Our Services — Varenta Bank" },
      { property: "og:description", content: "Savings, transfers, loans, cards and investments — all in one place." },
    ],
  }),
  component: () => <SimplePage title="Our Services" intro="Savings, transfers, loans, cards and investments — all in one place."></SimplePage>,
});
