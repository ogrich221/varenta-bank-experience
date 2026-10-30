import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  PiggyBank, Send, CreditCard, Landmark, TrendingUp, ShieldCheck,
  ArrowRight, Check, Sparkles, Building2, Zap, Lock, Globe, Calculator,
  ChevronDown, HelpCircle, PhoneCall
} from "lucide-react";
import { PageShell, btnPrimary, btnGlass } from "@/components/site/Layout";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Institutional & Personal Banking Services — Varenta Bank" },
      { name: "description", content: "High-yield 5.15% APY savings, zero-markup global transfers across 21 nations, World Elite metal cards, and bespoke asset management." },
      { property: "og:title", content: "Our Banking Services — Varenta Bank" },
      { property: "og:description", content: "Experience high-yield savings, borderless multi-currency clearing, and institutional security." },
    ],
  }),
  component: ServicesPage,
});

export function ServicesPage() {
  // Interactive APY Calculator state
  const [depositAmount, setDepositAmount] = useState<number>(25000);
  const [years, setYears] = useState<number>(3);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Math: Compound interest formula A = P * (1 + r/n)^(n*t)
  const varentaApy = 0.0515; // 5.15%
  const traditionalApy = 0.0005; // 0.05% typical big bank
  const n = 365; // Daily compounding

  const varentaTotal = Math.round(depositAmount * Math.pow(1 + varentaApy / n, n * years));
  const varentaEarnings = varentaTotal - depositAmount;

  const traditionalTotal = Math.round(depositAmount * Math.pow(1 + traditionalApy / n, n * years));
  const traditionalEarnings = traditionalTotal - depositAmount;

  const difference = varentaEarnings - traditionalEarnings;

  const serviceCatalog = [
    {
      id: "savings",
      icon: PiggyBank,
      badge: "5.15% APY",
      title: "High-Yield Treasury & Automated Vaults",
      subtitle: "Grow liquid capital safely with daily compounding and immediate flexibility.",
      bullets: [
        "Up to $2,500,000 in FDIC insurance through our insured deposit sweep program",
        "Zero account minimums, zero maintenance fees, zero withdrawal limits",
        "Automated smart vaults with customizable savings goals and recurring transfers",
        "Daily interest accrual credited directly to your principal on the 1st of every month",
      ],
      tag: "10x National Average",
    },
    {
      id: "transfers",
      icon: Send,
      badge: "0% FX MARKUP",
      title: "Global Multi-Currency Clearing (21 Hubs)",
      subtitle: "Execute cross-border settlements with local clearing speeds and zero foreign exchange spreads.",
      bullets: [
        "Dedicated domestic virtual IBANs in USD, EUR, GBP, CHF, SGD, JPY, and 22 other currencies",
        "Real-time settlement rails: FedNow, SEPA Instant, UK Faster Payments, and Swift GPI",
        "Guaranteed interbank mid-market exchange rate without hidden commissions",
        "Batch payroll and automated international supplier payouts for businesses",
      ],
      tag: "Average speed < 15 seconds",
    },
    {
      id: "cards",
      icon: CreditCard,
      badge: "WORLD ELITE",
      title: "Titanium & Black Metal Debit Cards",
      subtitle: "Precision-milled metal cards engineered with 360° rotating biometric security.",
      bullets: [
        "Solid tungsten core and titanium casing with laser-engraved details",
        "Dynamic in-app 360° CVV rotation to eliminate card-not-present fraud",
        "Unlimited 1.8% cash back deposited automatically into your high-yield vault",
        "Priority Pass airport lounge access at 1,300+ lounges globally and travel insurance",
      ],
      tag: "Zero Foreign Transaction Fees",
    },
    {
      id: "lending",
      icon: Landmark,
      badge: "FROM 4.25% APR",
      title: "Bespoke Lending & Private Credit Lines",
      subtitle: "Unlock substantial liquidity without liquidating your appreciating asset portfolios.",
      bullets: [
        "Securities-backed credit lines against equities, bonds, and treasury reserves",
        "Instant pre-approval up to $5,000,000 with zero impact on credit scores",
        "Custom repayment schedules: interest-only revolving facilities or fixed amortized terms",
        "Private mortgage origination for primary residences and luxury investment properties",
      ],
      tag: "Funds available within 24 hours",
    },
    {
      id: "wealth",
      icon: TrendingUp,
      badge: "ALGORITHMIC CUSTODY",
      title: "Algorithmic Wealth & Guided Portfolios",
      subtitle: "Institutional asset management strategies made effortless for forward-thinking investors.",
      bullets: [
        "Globally diversified portfolios across sovereign debt, ESG leaders, and technology innovators",
        "Automated daily tax-loss harvesting algorithm saving clients up to 1.4% annually",
        "Direct access to your dedicated Chartered Financial Analyst (CFA) advisory desk",
        "Comprehensive consolidated wealth reporting across domestic and offshore accounts",
      ],
      tag: "Low 0.25% annual advisory fee",
    },
    {
      id: "corporate",
      icon: Building2,
      badge: "ENTERPRISE",
      title: "Corporate Treasury & Commercial Accounts",
      subtitle: "The financial backbone for high-growth enterprises and international trading entities.",
      bullets: [
        "Multi-entity treasury dashboard with tiered permissions, dual-authorization, and audit logs",
        "Direct API integration with ERP systems (NetSuite, QuickBooks, Xero, SAP)",
        "Automated liquidity sweeps into overnight government repo markets",
        "Dedicated corporate relationship manager with 24/7 priority routing",
      ],
      tag: "End-to-End Enterprise API",
    },
  ];

  const comparisons = [
    { feature: "Liquid Savings APY", varenta: "5.15% APY", bigBank: "0.05% APY", neobank: "3.50% - 4.20%" },
    { feature: "FDIC Insurance Limit", varenta: "Up to $2,500,000 (Sweep)", bigBank: "$250,000 standard", neobank: "$250,000 standard" },
    { feature: "FX Exchange Markup", varenta: "0.00% (Mid-Market)", bigBank: "3.0% - 5.0% markup", neobank: "0.5% - 1.5% markup" },
    { feature: "Monthly Maintenance Fees", varenta: "$0 / month (No minimums)", bigBank: "$12 - $25 / month", neobank: "$0 (Basic only)" },
    { feature: "Card Material & Security", varenta: "Titanium with 360° Dynamic CVV", bigBank: "Plastic, static CVV", neobank: "Plastic or paid metal" },
    { feature: "Support Response Time", varenta: "< 60 seconds (Live Human)", bigBank: "30 - 60 min phone queue", neobank: "Automated bot only" },
    { feature: "Operating Jurisdictions", varenta: "21 Authorized Financial Hubs", bigBank: "Domestic single-rail", neobank: "1 - 3 countries" },
  ];

  const faqs = [
    {
      q: "How does Varenta offer 5.15% APY when traditional banks only offer 0.05%?",
      a: "Traditional legacy banks maintain thousands of costly brick-and-mortar branches and bloated legacy IT infrastructures. Varenta operates with an ultra-efficient digital architecture and passes that yield directly to our depositors, investing primarily in short-term central bank repos and high-grade sovereign treasuries.",
    },
    {
      q: "How is my money protected up to $2,500,000?",
      a: "Through our Insured Deposit Sweep Program, your deposits are automatically distributed across a network of affiliated FDIC-insured institutions. This provides up to 10x the standard $250,000 protection limit while you maintain a single unified account and statement with Varenta.",
    },
    {
      q: "Can I transfer money internationally without foreign transaction fees?",
      a: "Yes. Varenta connects directly to local RTGS payment systems across 21 authorized international jurisdictions (including the US, UK, Switzerland, EU, Japan, Singapore, UAE, Australia, etc.). You exchange and settle at the live interbank spot rate with zero hidden markups.",
    },
    {
      q: "How does the rotating 360° dynamic CVV security work on debit cards?",
      a: "When making online purchases, your Varenta mobile app can generate a temporary, rolling security code that expires after each transaction. Even if a merchant database is compromised, your real card information can never be reused by fraudsters.",
    },
    {
      q: "What documents are required to open an account?",
      a: "Opening an account takes under 5 minutes from your phone or computer. You simply need a valid government-issued ID (Passport, National ID, or Driver's License) and a quick biometric selfie verification. No paper forms or branch visit required.",
    },
  ];

  return (
    <PageShell>
      {/* Services Hero Section */}
      <section className="relative overflow-hidden px-6 pb-20 pt-36">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl animate-rise">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Institutional Precision • Personal Empowerment
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] sm:text-6xl">
              Banking services engineered for <span className="text-gradient">wealth, speed & sovereignty</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              From market-leading 5.15% APY high-yield treasury vaults to instant cross-border liquidity across 21 global nations, Varenta provides the modern financial infrastructure you deserve.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/open-account" className={btnPrimary}>
                Open Your Account in 5 Min <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#calculator" className={btnGlass}>
                Calculate Your Returns
              </a>
            </div>

            {/* Quick Proof Metrics */}
            <div className="mt-12 grid grid-cols-2 gap-4 border-t border-border/40 pt-8 sm:grid-cols-4">
              <div>
                <p className="font-display text-3xl font-bold text-foreground">5.15%</p>
                <p className="text-xs text-muted-foreground mt-0.5">High-Yield APY</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-foreground">$2.5M</p>
                <p className="text-xs text-muted-foreground mt-0.5">FDIC Sweep Insurance</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-foreground">21 Hubs</p>
                <p className="text-xs text-muted-foreground mt-0.5">Global Clearing Network</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-foreground">0.00%</p>
                <p className="text-xs text-muted-foreground mt-0.5">FX Markups & Hidden Fees</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE APY SAVINGS CALCULATOR ================= */}
      <section id="calculator" className="relative px-6 py-20 bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Calculator className="h-3.5 w-3.5" />
              Interactive Return Calculator
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              See what your money actually earns at <span className="text-gradient">5.15% APY</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Compare your compounded earnings with Varenta vs the 0.05% national bank average.
            </p>
          </div>

          <div className="glass mt-12 rounded-[2.5rem] p-6 sm:p-10 shadow-glass grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* Left: Interactive Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="deposit" className="text-sm font-semibold text-foreground">
                    Initial Deposit Amount
                  </label>
                  <span className="font-mono text-xl font-bold text-primary">
                    ${depositAmount.toLocaleString()}
                  </span>
                </div>
                <input
                  id="deposit"
                  type="range"
                  min="1000"
                  max="250000"
                  step="1000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="h-2 w-full cursor-ew-resize appearance-none rounded-lg bg-muted accent-primary"
                />
                <div className="flex justify-between text-[11px] text-muted-foreground font-mono mt-1">
                  <span>$1,000</span>
                  <span>$100,000</span>
                  <span>$250,000</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-semibold text-foreground">
                    Time Horizon (Years)
                  </label>
                  <span className="font-mono text-sm font-bold text-foreground">
                    {years} {years === 1 ? "Year" : "Years"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 5].map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYears(y)}
                      className={`rounded-2xl py-2.5 text-xs font-semibold transition-all ${
                        years === y
                          ? "bg-primary text-primary-foreground shadow-glow scale-105"
                          : "border border-border/60 bg-background/60 hover:bg-muted"
                      }`}
                    >
                      {y} {y === 1 ? "Year" : "Years"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/20 bg-background/60 p-4 text-xs text-muted-foreground flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-green-500 shrink-0" />
                <span>
                  All deposits are backed by tier-1 US Treasuries and swept across program banks to provide <strong className="text-foreground">$2,500,000 FDIC coverage</strong>.
                </span>
              </div>
            </div>

            {/* Right: Comparative Calculation Cards */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="rounded-3xl border border-primary/40 bg-gradient-to-br from-primary/15 via-background/80 to-card/90 p-6 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    VARENTA 5.15% APY
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">Daily Compounding</span>
                </div>
                <p className="mt-4 font-display text-4xl font-bold sm:text-5xl text-foreground">
                  ${varentaTotal.toLocaleString()}
                </p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Total Interest Earned:</span>
                  <span className="font-mono text-base font-bold text-green-500">
                    +${varentaEarnings.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="rounded-3xl border border-border/50 bg-background/50 p-5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-muted-foreground">Traditional Bank (0.05% APY):</span>
                  <span className="font-mono font-semibold text-foreground">
                    ${traditionalTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-muted-foreground">
                  <span>Interest earned elsewhere:</span>
                  <span className="font-mono">+${traditionalEarnings.toLocaleString()}</span>
                </div>
              </div>

              <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-4 text-xs text-green-700 dark:text-green-300 flex items-center justify-between">
                <span>
                  Extra wealth created with Varenta:
                </span>
                <span className="font-mono text-lg font-bold">
                  +${difference.toLocaleString()}
                </span>
              </div>

              <Link to="/open-account" className={`${btnPrimary} w-full text-center mt-2`}>
                Start Earning 5.15% APY Today <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= DETAILED SERVICE VERTICALS ================= */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Full Suite Architecture
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Complete solutions for every financial ambition
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Built from first principles to be faster, more secure, and completely borderless.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {serviceCatalog.map((svc) => {
              const Icon = svc.icon;
              return (
                <div
                  key={svc.id}
                  className="glass group relative flex flex-col justify-between overflow-hidden rounded-[2.25rem] p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                        <Icon className="h-7 w-7" />
                      </span>
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] font-bold text-primary">
                        {svc.badge}
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-foreground">{svc.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {svc.subtitle}
                    </p>

                    <div className="mt-6 space-y-2.5 border-t border-border/40 pt-5">
                      {svc.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-foreground/85 leading-normal">
                          <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-muted-foreground">{svc.tag}</span>
                    <Link
                      to="/open-account"
                      className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                    >
                      Open now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= DIRECT HEAD-TO-HEAD COMPARISON ================= */}
      <section className="px-6 py-20 bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Benchmark Analysis
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Varenta vs The Industry
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              See how Varenta compares side-by-side against legacy giants and typical neobanks.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto rounded-[2rem] border border-white/25 bg-background/70 backdrop-blur-xl shadow-glass">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/40">
                  <th className="py-4 px-6 font-semibold text-foreground">Feature</th>
                  <th className="py-4 px-6 font-bold text-primary bg-primary/5">Varenta Bank</th>
                  <th className="py-4 px-6 font-semibold text-muted-foreground">Legacy Banks (Chase, Wells, Citi)</th>
                  <th className="py-4 px-6 font-semibold text-muted-foreground">Generic Neobanks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {comparisons.map((c, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-foreground">{c.feature}</td>
                    <td className="py-4 px-6 font-bold text-primary bg-primary/5 flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{c.varenta}</span>
                    </td>
                    <td className="py-4 px-6 text-muted-foreground">{c.bigBank}</td>
                    <td className="py-4 px-6 text-muted-foreground">{c.neobank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <HelpCircle className="h-3.5 w-3.5" />
              Frequently Asked Questions
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Everything you need to know about our services
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="rounded-3xl border border-white/20 bg-background/60 backdrop-blur-xl transition-all shadow-sm overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between p-6 text-left text-sm sm:text-base font-semibold text-foreground"
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4 animate-rise">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground">
              Have a specialized enterprise or private wealth question?
            </p>
            <Link to="/contact" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
              <PhoneCall className="h-3.5 w-3.5" /> Talk with a Senior Private Banking Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* ================= CONVINCING CALL TO ACTION ================= */}
      <section className="relative overflow-hidden bg-ink text-cream px-6 py-20">
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5 text-xs font-semibold text-primary-glow">
            Seamless Onboarding
          </span>
          <h2 className="mt-6 text-3xl font-bold sm:text-5xl text-cream">
            Join over 2,000,000 clients growing their wealth with Varenta
          </h2>
          <p className="mt-4 text-sm sm:text-base text-cream/70 max-w-xl mx-auto">
            Open an account in under 5 minutes from your computer or phone. Zero account minimums, zero hidden fees, instant access.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/open-account" className={btnPrimary}>
              Open an Account in 5 Min <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="glass-dark inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold hover:bg-white/20 transition-all">
              Contact Treasury Desk
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
