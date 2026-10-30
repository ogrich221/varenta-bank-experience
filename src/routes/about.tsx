import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/Layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Varenta — Varenta Bank" },
      { name: "description", content: "We're building the most trusted digital bank for a brighter tomorrow." },
      { property: "og:title", content: "About Varenta — Varenta Bank" },
      { property: "og:description", content: "We're building the most trusted digital bank for a brighter tomorrow." },
    ],
  }),
  component: () => <SimplePage title="About Varenta" intro="We're building the most trusted digital bank for a brighter tomorrow."></SimplePage>,
});
