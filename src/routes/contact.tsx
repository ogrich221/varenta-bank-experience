import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/Layout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — Varenta Bank" },
      { name: "description", content: "Our team is here 24/7. Reach us anytime at support@varenta.bank." },
      { property: "og:title", content: "Contact Us — Varenta Bank" },
      { property: "og:description", content: "Our team is here 24/7. Reach us anytime at support@varenta.bank." },
    ],
  }),
  component: () => <SimplePage title="Contact Us" intro="Our team is here 24/7. Reach us anytime at support@varenta.bank."><form className="glass space-y-4 rounded-3xl p-6" onSubmit={(e) => e.preventDefault()}><label className="block text-sm font-medium">Name<input type="text" required className="mt-1 block min-h-11 w-full rounded-xl border border-input bg-background/70 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><label className="block text-sm font-medium">Email<input type="email" required className="mt-1 block min-h-11 w-full rounded-xl border border-input bg-background/70 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><button className="min-h-11 w-full rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-glow">Send message</button></form></SimplePage>,
});
