import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, Key, Eye, EyeOff, Sparkles, Building2 } from "lucide-react";
import { PageShell, btnPrimary, btnGlass } from "@/components/site/Layout";
import { useBanking } from "@/lib/banking-context";

export const Route = createFileRoute("/login")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Sign In — Varenta Bank Secure Client Portal" },
      { name: "description", content: "Access your Varenta Bank personal and wealth banking dashboard." },
      { property: "og:title", content: "Sign In — Varenta Bank" },
      { property: "og:description", content: "Secure client portal for personal and private wealth banking." },
    ],
  }),
  component: LoginPage,
});

export function LoginPage() {
  const navigate = useNavigate();
  const { user, managedUsers, switchActiveUser } = useBanking();
  const [email, setEmail] = useState(user.email || "alexander.varenta@client.varentabank.com");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const match = managedUsers.find(
        (u) =>
          u.profile.email.toLowerCase() === email.trim().toLowerCase() ||
          u.id.toLowerCase() === email.trim().toLowerCase() ||
          (u.accounts[0]?.accountNumber && u.accounts[0].accountNumber.toLowerCase() === email.trim().toLowerCase())
      );
      if (match) {
        switchActiveUser(match.id);
      }
      setIsLoading(false);
      navigate({ to: "/dashboard" as any });
    }, 500);
  };

  const handleDemoFill = () => {
    setEmail("alexander.varenta@client.varentabank.com");
    setPassword("VarentaSecure2026!");
  };

  return (
    <PageShell>
      <section className="relative overflow-hidden px-4 pb-24 pt-36 sm:px-6">
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute -right-20 top-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-1/4 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-md">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              256-Bit SSL Client Encryption
            </span>
            <h1 className="mt-3 text-3xl font-bold sm:text-4xl text-foreground">
              Sign In to <span className="text-gradient">Varenta Bank</span>
            </h1>
            <p className="mt-2 text-xs text-muted-foreground sm:text-sm">
              Enter your verified credentials to access your global treasury and accounts.
            </p>
          </div>

          {/* Glass Login Card */}
          <div className="glass rounded-[2.5rem] p-6 sm:p-8 shadow-glass border border-white/25">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Email Address or Client ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@varentabank.com"
                    className="w-full rounded-2xl border border-border/60 bg-background/70 pl-10 pr-4 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-foreground">
                    Password
                  </label>
                  <Link to="/contact" className="text-[11px] text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-2xl border border-border/60 bg-background/70 pl-10 pr-10 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-muted-foreground">Keep me signed in</span>
                </label>
                <span className="text-green-500 font-medium flex items-center gap-1 text-[11px]">
                  <ShieldCheck className="h-3 w-3" /> Biometric Ready
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`${btnPrimary} w-full mt-4`}
              >
                {isLoading ? "Authenticating..." : "Sign In to Dashboard"} <ArrowRight className="h-4 w-4" />
              </button>

              {/* Demo Fast Login helper */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[11px] text-primary hover:underline font-semibold"
                >
                  ⚡ Fill Verified Client Credentials
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-border/40 pt-4 text-center text-xs text-muted-foreground">
              Don't have an account yet?{" "}
              <Link to="/open-account" className="font-semibold text-primary hover:underline">
                Open an Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
