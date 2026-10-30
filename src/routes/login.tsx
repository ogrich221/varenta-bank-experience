import { createFileRoute } from "@tanstack/react-router";
import { SimplePage } from "@/components/site/Layout";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — Varenta Bank" },
      { name: "description", content: "Welcome back. Sign in to your Varenta account." },
      { property: "og:title", content: "Login — Varenta Bank" },
      { property: "og:description", content: "Welcome back. Sign in to your Varenta account." },
    ],
  }),
  component: () => <SimplePage title="Login" intro="Welcome back. Sign in to your Varenta account."><form className="glass space-y-4 rounded-3xl p-6" onSubmit={(e) => e.preventDefault()}><label className="block text-sm font-medium">Email<input type="email" required className="mt-1 block min-h-11 w-full rounded-xl border border-input bg-background/70 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><label className="block text-sm font-medium">Password<input type="password" required className="mt-1 block min-h-11 w-full rounded-xl border border-input bg-background/70 px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" /></label><button className="min-h-11 w-full rounded-full bg-gradient-primary font-semibold text-primary-foreground shadow-glow">Sign in</button></form></SimplePage>,
});
