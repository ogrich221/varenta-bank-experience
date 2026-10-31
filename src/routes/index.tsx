import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, ArrowDownLeft, ArrowUpRight, PiggyBank, Send, Landmark, CreditCard, TrendingUp,
  ShieldCheck, Zap, Smartphone, Headphones, Plus, Receipt, Star, Check, X, Shield, Lock,
  Globe, ChevronDown, ChevronUp, Sparkles, Building2, Award, Clock, DollarSign, Wallet
} from "lucide-react";
import hero from "@/assets/hero-bank.jpg";
import teller from "@/assets/branch-teller.jpg";
import lobby from "@/assets/branch-lobby.jpg";
import { PageShell, btnPrimary, btnGlass } from "@/components/site/Layout";
import { GlassNavShowcase } from "@/components/site/GlassNavShowcase";
import { GlobalPresenceGlobe } from "@/components/site/GlobalPresenceGlobe";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Varenta Bank — Private Wealth & Global Digital Banking" },
      { name: "description", content: "Experience 5.15% APY high-yield savings, zero-markup borderless clearing across 21 nations, World Elite metal cards, and 100% full-reserve security." },
      { property: "og:title", content: "Varenta Bank — Modern Digital Banking" },
      { property: "og:description", content: "High-yield savings, instant international clearing, and institutional safety for private clients and global enterprises." },
    ],
  }),
  component: Index,
});

const txns = [
  { n: "Inward Wire — Geneva Private Capital", a: "+$28,500.00", in: true, tag: "SWIFT RTGS" },
  { n: "Vanguard Total Stock Dividend", a: "+$1,420.50", in: true, tag: "Dividend" },
  { n: "Nordic Aviation Charter", a: "-$4,800.00", in: false, tag: "Wire" },
  { n: "Apple Flagship — Titanium Card", a: "-$1,199.00", in: false, tag: "Point of Sale" },
  { n: "Treasury APY Yield Credited", a: "+$432.18", in: true, tag: "Interest 5.15%" },
];

const comparisonData = [
  {
    feature: "High-Yield Savings (APY)",
    varenta: "5.15% APY (Daily Compounded)",
    traditional: "0.01% - 0.05% APY",
    advantage: "Over 10x National Average",
  },
  {
    feature: "International Wire Speed",
    varenta: "T+0 Real-Time (Under 15 Seconds)",
    traditional: "3 to 5 Business Days",
    advantage: "Instant SWIFT / RTGS Clearing",
  },
  {
    feature: "FX Conversion Spread Markup",
    varenta: "0.0% Interbank Mid-Market Rate",
    traditional: "2.50% - 4.25% Hidden Markup",
    advantage: "Zero Hidden Currency Fees",
  },
  {
    feature: "Monthly Maintenance Fees",
    varenta: "$0.00 (No Minimum Balances)",
    traditional: "$15.00 - $35.00 / month",
    advantage: "100% Fee-Free Operations",
  },
  {
    feature: "Debit Card Security & Hardware",
    varenta: "Solid Titanium + 360° Rotating CVV",
    traditional: "Plastic Card with Static CVV",
    advantage: "Zero Card-Not-Present Fraud",
  },
  {
    feature: "Client Deposit Protection",
    varenta: "Up to $2,500,000 (FDIC Swept)",
    traditional: "$250,000 Standard Cap",
    advantage: "10x Enhanced Balance Custody",
  },
  {
    feature: "Direct Human Support Response",
    varenta: "Under 60 Seconds (24/7/365 Desk)",
    traditional: "15 to 45 Minutes on Hold",
    advantage: "Direct Private Banker Access",
  },
];

const benefits = [
  {
    i: ShieldCheck,
    t: "100% Full-Reserve Architecture",
    d: "Unlike fractional-reserve institutions, your capital is strictly segregated in Tier-1 central banks and never loaned into speculative derivatives.",
    badge: "100% Segregated",
  },
  {
    i: Zap,
    t: "Sub-Second Global Clearing",
    d: "Direct clearing pipelines into FedNow, SEPA Instant, UK Faster Payments, and SWIFT GPI across 21 authorized financial hubs.",
    badge: "T+0 Settlement",
  },
  {
    i: Lock,
    t: "Quantum-Resistant Encryption",
    d: "Hardware-level AES-256 GCM cryptographic protection, biometric hardware security keys, and automated anomaly detection.",
    badge: "SOC 2 Type II",
  },
  {
    i: Headphones,
    t: "24/7/365 Dedicated Private Banking",
    d: "Connect to chartered financial advisors and dedicated human support desks in under 60 seconds at any hour of the day or night.",
    badge: "< 60s Pickup",
  },
];

const reviews = [
  {
    n: "Dr. Julian Mercer",
    r: "Managing Partner, Mercer & Holt Wealth (Zurich)",
    q: "The transparency and multi-currency clearing speed at Varenta are unmatched in modern banking. Being able to transfer seven figures in under fifteen seconds with zero FX markup changed how our family office operates.",
    volume: "Client for 3 years • $4.2M Managed",
  },
  {
    n: "Elena Rostova",
    r: "Founder & CEO, Horizon Technologies (London / NY)",
    q: "Most institutions treat international clients like an afterthought with endless compliance delays. Varenta provisioned our multi-currency accounts and issued our titanium cards within hours. The 5.15% APY yields are extraordinary.",
    volume: "Verified Enterprise Client • $1.8M Managed",
  },
  {
    n: "Marcus Vance",
    r: "Private Equity Director (Singapore / New York)",
    q: "The 360° rotating CVV virtual card eliminated every single unauthorized transaction while traveling abroad. The glass dashboard is intuitive, fast, and gives me complete real-time clarity over every liquid dollar.",
    volume: "World Elite Titanium Member • $950K Managed",
  },
];

const faqList = [
  {
    q: "How are my deposits protected and insured at Varenta Bank?",
    a: "Client deposits are insured up to $2,500,000 USD through our multi-bank FDIC sweep program. In addition, Varenta operates on a 100% full-reserve banking model: client balances are held in segregated, liquid custodial accounts at premier central banks and are never leveraged for high-risk trading or uncollateralized lending.",
  },
  {
    q: "How quickly can I open an account and access my funds?",
    a: "Opening an account takes approximately 3 to 5 minutes through our modern glassmorphic portal. Once verified with standard KYC biometric identity verification, your checking and high-yield savings accounts are immediately active, complete with routing details and a virtual World Elite debit card ready for Apple Pay and Google Wallet.",
  },
  {
    q: "Are there any hidden international transfer fees or currency markups?",
    a: "No. Varenta provides true interbank mid-market exchange rates without hidden percentage markups or retail spreads. Both domestic transfers (ACH / Fedwire) and cross-border wires across our 21 operating jurisdictions settle at wholesale institutional cost with zero monthly maintenance fees.",
  },
  {
    q: "How does the World Elite Titanium card with 360° rotating CVV work?",
    a: "Your virtual and physical World Elite debit cards feature dynamic cryptographic CVV technology. The 3-digit security code automatically refreshes periodically inside your secure dashboard and banking app. Even if a merchant suffers a data breach, your static details cannot be used for fraudulent online transactions.",
  },
  {
    q: "Can I manage multiple currencies from a single dashboard?",
    a: "Yes. Varenta provides multi-currency capabilities supporting USD, EUR, GBP, CHF, CAD, AUD, JPY, SGD, and 20 additional currencies. You can convert between currencies instantly at real-time rates and receive incoming wires using local domestic clearing details.",
  },
];

function Index() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <PageShell>
      {/* 1. HERO SECTION */}
      <section className="relative isolate min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
        <img
          src={hero}
          alt="Varenta Bank headquarters, an ultra-modern glass architectural marvel reflecting sunset"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-hero max-lg:bg-background/85" />

        <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pb-20 pt-32 sm:pt-36">
          <div className="max-w-2xl animate-rise">
            {/* Live Trust Banner Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur-xl shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span>5.15% APY High-Yield Vault • 21 Licensed Operating Hubs</span>
            </div>

            <h1 id="hero-title" className="mt-6 text-4xl font-extrabold tracking-tight leading-[1.08] sm:text-6xl lg:text-7xl">
              Private Wealth & <span className="text-gradient">Global Banking</span> Built for You
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Open an institutional-grade bank account in 5 minutes. Grow capital with <strong className="text-foreground">5.15% APY</strong>, execute instantaneous zero-markup multi-currency wires, and spend globally with dynamic 360° rotating titanium debit cards.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link to="/open-account" className={`${btnPrimary} text-sm py-3.5 px-6 shadow-glow`}>
                <span>Open an Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className={`${btnGlass} text-sm py-3.5 px-6`}>
                <span>Explore All Services</span>
              </Link>
            </div>

            {/* Key Proof Metrics */}
            <dl className="mt-12 grid grid-cols-3 gap-4 border-t border-border/40 pt-8">
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Capital Secured</dt>
                <dd className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">$18.4B+</dd>
                <dd className="text-[10px] text-green-400 font-semibold mt-0.5">100% Full-Reserve</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">High-Yield APY</dt>
                <dd className="mt-1 font-display text-2xl sm:text-3xl font-bold text-primary">5.15%</dd>
                <dd className="text-[10px] text-muted-foreground mt-0.5">Daily Compounded</dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Client Rating</dt>
                <dd className="mt-1 font-display text-2xl sm:text-3xl font-bold text-foreground">4.9 / 5.0</dd>
                <dd className="text-[10px] text-muted-foreground mt-0.5">Over 2,000,000+ Clients</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* 2. INSTITUTIONAL REGULATORY & PRESS RECOGNITION STRIP */}
      <section className="border-y border-white/10 bg-black/60 px-6 py-8 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Institutional Standards & Direct Clearing:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> FDIC Insured ($2.5M Swept)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> SOC 2 Type II Certified
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> PCI-DSS Level 1 Compliant
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> 256-Bit Quantum-Grade GCM
            </span>
            <span className="flex items-center gap-1.5 font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> 21 Sovereign Jurisdictions
            </span>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE 360° CARD & 21-JURISDICTION BLINKING GLOBE */}
      <GlassNavShowcase />

      {/* 4. CLIENT DASHBOARD EXPERIENCE PREVIEW */}
      <section className="relative px-6 py-24" aria-labelledby="dash-title">
        <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-primary opacity-25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Next-Generation Personal Banking
            </span>
            <h2 id="dash-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
              Your Entire Wealth, <span className="text-gradient">Beautifully Clear</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Real-time liquidity, multi-currency balances, and institutional controls at a glance.
            </p>
          </div>

          <div className="glass mt-12 grid gap-6 rounded-[2.5rem] p-6 sm:p-8 border border-white/25 shadow-glass lg:grid-cols-3">
            {/* Balance Overview Card */}
            <div className="rounded-3xl bg-gradient-primary p-7 text-primary-foreground shadow-glow lg:col-span-2 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-mono opacity-85">Total Managed Balance</span>
                  <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-bold font-mono">WORLD ELITE</span>
                </div>
                <p className="mt-4 font-display text-4xl font-extrabold sm:text-6xl tracking-tight">$142,850.00</p>
                <p className="text-xs opacity-80 mt-1">Available across checking & high-yield vault</p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-2xl bg-black/20 p-4 backdrop-blur-md">
                  <p className="text-xs opacity-75">Current Account</p>
                  <p className="mt-1 font-display text-xl font-bold">$42,350.00</p>
                  <p className="text-[10px] text-green-300 mt-1 font-mono">● Immediate Liquid</p>
                </div>
                <div className="rounded-2xl bg-black/20 p-4 backdrop-blur-md">
                  <p className="text-xs opacity-75">High-Yield Vault</p>
                  <p className="mt-1 font-display text-xl font-bold">$100,500.00</p>
                  <p className="text-[10px] text-amber-200 mt-1 font-mono">5.15% APY Daily</p>
                </div>
                <div className="rounded-2xl bg-black/20 p-4 backdrop-blur-md">
                  <p className="text-xs opacity-75">Monthly Accrued Yield</p>
                  <p className="mt-1 font-display text-xl font-bold text-green-300">+$432.18</p>
                  <p className="text-[10px] opacity-75 mt-1 font-mono">Credited 1st of month</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="glass rounded-3xl p-6 flex flex-col justify-between border border-white/15">
              <div>
                <h3 className="text-sm font-bold text-foreground">Instant Command Actions</h3>
                <p className="text-xs text-muted-foreground mt-1">Direct clearing pipelines ready 24/7</p>
              </div>

              <div className="my-6 grid grid-cols-2 gap-3">
                {[
                  [Send, "Send Wire", "/dashboard"],
                  [Plus, "Deposit", "/dashboard"],
                  [Receipt, "Pay Utilities", "/dashboard"],
                  [CreditCard, "Card Controls", "/dashboard"],
                ].map(([I, label, path]) => {
                  const Icon = I as typeof Send;
                  return (
                    <Link
                      key={label as string}
                      to={path as string}
                      className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-foreground transition-all hover:-translate-y-1 hover:bg-primary/10 hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="h-5 w-5 text-primary" aria-hidden />
                      <span>{label as string}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="rounded-2xl bg-primary/10 border border-primary/25 p-3 text-center">
                <span className="text-[11px] font-semibold text-primary">Biometric Security Key: Active</span>
              </div>
            </div>

            {/* Recent Live Statement Transactions */}
            <div className="glass rounded-3xl p-6 lg:col-span-3 border border-white/15">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Real-Time Verified Ledger</h3>
                  <p className="text-xs text-muted-foreground">Every incoming and outgoing wire is cryptographically logged</p>
                </div>
                <Link to="/dashboard" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  Open Client Portal <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <ul className="divide-y divide-border/40">
                {txns.map((t) => (
                  <li key={t.n} className="flex items-center justify-between py-3.5">
                    <span className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-2xl ${t.in ? "bg-green-500/15 text-green-400 border border-green-500/30" : "bg-white/5 text-muted-foreground border border-white/10"}`}>
                        {t.in ? <ArrowDownLeft className="h-5 w-5" aria-hidden /> : <ArrowUpRight className="h-5 w-5" aria-hidden />}
                      </span>
                      <div>
                        <span className="text-sm font-semibold text-foreground block">{t.n}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{t.tag} • Settled Immediately</span>
                      </div>
                    </span>
                    <span className={`font-display text-sm font-bold ${t.in ? "text-green-400" : "text-foreground"}`}>
                      {t.a}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES ARCHITECTURE */}
      <section className="relative px-6 py-24" aria-labelledby="svc-title">
        <div className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                Comprehensive Financial Architecture
              </span>
              <h2 id="svc-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
                Services Engineered for <span className="text-gradient">Maximum Growth</span>
              </h2>
              <p className="mt-3 max-w-2xl text-muted-foreground text-sm sm:text-base">
                Whether safeguarding wealth, executing cross-border payments across 21 jurisdictions, or accessing institutional credit, Varenta delivers unmatched speed and transparency.
              </p>
            </div>
            <Link to="/services" className={`${btnGlass} self-start md:self-auto gap-2`}>
              Explore All Services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* 1. High-Yield Savings */}
            <article className="glass group relative overflow-hidden rounded-[2.5rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between border border-white/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <PiggyBank className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary font-mono">
                    5.15% APY
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">High-Yield Treasury & Savings</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Earn more than 10x the national bank average with zero account minimums, daily compounded interest, and unlimited transfers.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Up to $2.5M FDIC sweep insurance coverage
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Automated smart round-ups & custom vaults
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Instant liquidity with zero lock-up penalties
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Traditional: 0.05%</span>
                <Link to="/services" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>

            {/* 2. Global Borderless Transfers */}
            <article className="glass group relative overflow-hidden rounded-[2.5rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between border border-white/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <Send className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400 font-mono">
                    0% FX SPREAD
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Global Borderless Transfers</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Send, receive, and hold 28 currencies with domestic bank coordinates across 21 authorized operating nations.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    T+0 real-time clearing (FedNow, SEPA, Faster Payments)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Zero hidden foreign exchange markups
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Dedicated multi-currency virtual IBANs
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Speed: Under 15s</span>
                <Link to="/services" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>

            {/* 3. Titanium Cards */}
            <article className="glass group relative overflow-hidden rounded-[2.5rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between border border-white/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <CreditCard className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 font-mono">
                    1.8% CASHBACK
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">World Elite Metal Debit Cards</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Solid tungsten and titanium cards featuring dynamic 360° rotating CVV security and VIP global concierge privileges.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Unlimited 1.8% cash back deposited daily
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Zero foreign transaction fees worldwide
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Biometric authorization & 1-tap instant freeze
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Material: Tungsten</span>
                <Link to="/services" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>

            {/* 4. Bespoke Private Lending */}
            <article className="glass group relative overflow-hidden rounded-[2.5rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between border border-white/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <Landmark className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400 font-mono">
                    FROM 4.25% APR
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Bespoke Lending & Credit Lines</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Unlock liquidity without selling long-term holdings. Securities-backed loans, commercial financing, and luxury real estate mortgages.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Instant pre-approval with zero credit score impact
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Zero origination, maintenance, or prepayment fees
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Flexible interest-only payback schedules
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Approval: Under 24h</span>
                <Link to="/services" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>

            {/* 5. Guided Portfolios & Wealth Management */}
            <article className="glass group relative overflow-hidden rounded-[2.5rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between border border-white/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <TrendingUp className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-400 font-mono">
                    AUTO REBALANCE
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Algorithmic Wealth & Portfolios</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Institutional portfolio strategies accessible at your fingertips. Automated daily rebalancing, tax-loss harvesting, and dedicated advisors.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Global equity indexes, sovereign bonds & private debt
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Tax-loss harvesting saving an average 1.4% annually
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Direct phone desk to Chartered Financial Analysts (CFA)
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Advisory fee: 0.25%</span>
                <Link to="/services" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>

            {/* 6. Institutional Multi-Jurisdiction Security */}
            <article className="glass group relative overflow-hidden rounded-[2.5rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between border border-white/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <ShieldCheck className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400 font-mono">
                    SOC2 TYPE II
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Institutional Solvency & Custody</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  100% full-reserve banking architecture. Your client funds are segregated in tier-1 central banks, never leveraged for high-risk trading.
                </p>
                <ul className="mt-5 space-y-2.5 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Real-time cryptographic proof-of-reserves
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    256-bit quantum-resistant hardware encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    Regulated across 21 top-tier global authorities
                  </li>
                </ul>
              </div>
              <div className="mt-6 pt-5 border-t border-border/50 flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground">Reserve ratio: 100%</span>
                <Link to="/services" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  Learn more <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 6. HEAD-TO-HEAD COMPARISON TABLE: VARENTA VS TRADITIONAL MEGA-BANKS */}
      <section className="px-6 py-24 bg-black/40 border-y border-white/10" aria-labelledby="comp-title">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Objective Comparison
            </span>
            <h2 id="comp-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
              Varenta vs <span className="text-gradient">Traditional Mega-Banks</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              See why over 2,000,000 clients transferred their primary liquidity from legacy banks to Varenta.
            </p>
          </div>

          <div className="glass mt-12 overflow-x-auto rounded-[2.5rem] border border-white/20 p-2 sm:p-6 shadow-glass">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/60">
                  <th className="py-4 px-4 sm:px-6 font-bold text-muted-foreground uppercase text-[11px] tracking-wider">
                    Core Capability
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-bold text-primary uppercase text-[11px] tracking-wider bg-primary/10 rounded-t-2xl">
                    VARENTA BANK
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-bold text-muted-foreground uppercase text-[11px] tracking-wider">
                    Traditional Banks (Chase, Citi, HSBC)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 sm:px-6 font-semibold text-foreground">
                      {row.feature}
                      <span className="block text-[11px] text-muted-foreground font-normal mt-0.5">
                        {row.advantage}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-bold text-foreground bg-primary/5">
                      <div className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span>{row.varenta}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <X className="h-4 w-4 text-destructive/70 shrink-0" />
                        <span>{row.traditional}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <Link to="/open-account" className={`${btnPrimary} py-3 px-6 text-sm inline-flex items-center gap-2`}>
              <span>Switch to Varenta in 5 Minutes</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. WHY PEOPLE CHOOSE VARENTA (BENEFITS) */}
      <section className="px-6 py-24" aria-labelledby="ben-title">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Engineered For Certainty
            </span>
            <h2 id="ben-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
              Why Global Clients Choose <span className="text-gradient">Varenta</span>
            </h2>
            <p className="mt-4 max-w-md text-sm sm:text-base text-muted-foreground leading-relaxed">
              Trust is built on rigorous execution. We combine the agility of modern fintech with the institutional balance sheet resilience of private Swiss and Anglo-American banking.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-3 text-xs text-foreground font-semibold">
                <Check className="h-4 w-4 text-primary" />
                <span>Zero proprietary asset speculation with client deposits</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-foreground font-semibold">
                <Check className="h-4 w-4 text-primary" />
                <span>Direct connectivity into 21 central bank RTGS clearing systems</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-foreground font-semibold">
                <Check className="h-4 w-4 text-primary" />
                <span>Dedicated private relationship manager for every verified client</span>
              </div>
            </div>

            <div className="mt-8">
              <Link to="/about" className={`${btnGlass} text-xs py-3 px-5`}>
                Read Our Solvency Charter <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {benefits.map(({ i: I, t, d, badge }) => (
              <div key={t} className="glass rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow border border-white/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <I className="h-8 w-8 text-primary" aria-hidden />
                    <span className="rounded-full bg-primary/15 border border-primary/30 px-2.5 py-0.5 text-[10px] font-bold text-primary font-mono">
                      {badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground">{t}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. GLOBAL BRANCH NETWORK & PRIVATE SUITES */}
      <section className="px-6 py-24 bg-black/40 border-y border-white/10" aria-labelledby="br-title">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                In-Person Private Suites
              </span>
              <h2 id="br-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
                Visit a <span className="text-gradient">Varenta Flagship</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
                Prefer face-to-face advisory? Our private bankers and dedicated bullion vaults are ready to serve you across flagship hubs.
              </p>
            </div>
            <Link to="/contact" className={`${btnGlass} gap-2 self-start md:self-auto`}>
              Schedule Branch Visit <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                src: teller,
                w: 736,
                h: 992,
                t: "Dedicated Private Wealth Suites",
                d: "Quiet, biometric-secured consultation rooms for bespoke mortgage structuring, treasury allocations, and international wire escrow.",
                alt: "Varenta Bank teller helping at an elegant counter with the Varenta logo"
              },
              {
                src: lobby,
                w: 736,
                h: 1312,
                t: "Modern Flagship Lobbies",
                d: "Experience zero wait times, espresso bars, private safety deposit vaults, and instant on-site metal card engraving.",
                alt: "Customers in a modern Varenta Bank branch lobby under the Varenta sign"
              },
            ].map((b) => (
              <figure key={b.t} className="glass group relative overflow-hidden rounded-[2.5rem] border border-white/20 shadow-glass">
                <img
                  src={b.src}
                  alt={b.alt}
                  width={b.w}
                  height={b.h}
                  loading="lazy"
                  className="h-[28rem] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[34rem]"
                />
                <figcaption className="glass-dark absolute inset-x-4 bottom-4 rounded-3xl p-6 border border-white/20">
                  <h3 className="font-bold text-lg text-foreground">{b.t}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">{b.d}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 9. VERIFIED CLIENT TESTIMONIALS */}
      <section className="relative overflow-hidden bg-ink px-6 py-24" aria-labelledby="rev-title">
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Client Endorsements
            </span>
            <h2 id="rev-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
              Trusted by Discerning <span className="text-gradient">Global Citizens</span>
            </h2>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground">
              Read how leading executives, founders, and private wealth managers rely on Varenta.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.n} className="glass-dark rounded-[2.5rem] p-7 border border-white/20 shadow-glass flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-primary" aria-label="5 out of 5 stars">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" aria-hidden />
                      ))}
                    </div>
                    <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400 font-mono">
                      Verified Client
                    </span>
                  </div>
                  <blockquote className="mt-4 text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                    “{r.q}”
                  </blockquote>
                </div>

                <figcaption className="mt-6 pt-4 border-t border-border/40 text-xs">
                  <span className="font-bold text-foreground block text-sm">{r.n}</span>
                  <span className="text-muted-foreground block text-[11px] mt-0.5">{r.r}</span>
                  <span className="text-[10px] text-primary font-mono mt-1 block">{r.volume}</span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/open-account" className={`${btnPrimary} py-3.5 px-8 text-sm inline-flex items-center gap-2 shadow-glow`}>
              <span>Start Banking with Varenta</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 10. INTERACTIVE FAQ ACCORDION */}
      <section className="px-6 py-24 bg-black/40 border-t border-white/10" aria-labelledby="faq-title">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Clarity & Transparency
            </span>
            <h2 id="faq-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Everything you need to know about opening, funding, and securing your Varenta accounts.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqList.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.q}
                  className="glass rounded-3xl border border-white/15 overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left text-sm sm:text-base font-bold text-foreground hover:text-primary transition-colors"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 text-primary shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/30 pt-4 animate-rise">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. 21 OPERATING JURISDICTIONS INTERACTIVE GLOBE */}
      <section className="px-6 py-24" aria-labelledby="globe-title">
        <div className="mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            Sovereign Clearing Jurisdictions
          </span>
          <h2 id="globe-title" className="mt-3 text-3xl font-extrabold sm:text-5xl">
            Our <span className="text-gradient">21 Global Hubs</span> Worldwide
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Explore our worldwide network of flagship headquarters, regional treasuries, and private banking suites.
          </p>
          <div className="glass mt-12 rounded-[2.5rem] p-4 sm:p-8 border border-white/20 shadow-glass">
            <GlobalPresenceGlobe />
          </div>
        </div>
      </section>

      {/* 12. FINAL CALL TO ACTION BANNER */}
      <section className="relative px-6 py-20 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-primary opacity-15 blur-3xl" />
        <div className="glass mx-auto max-w-6xl rounded-[3rem] p-8 sm:p-16 border border-primary/30 text-center shadow-glass relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-foreground tracking-tight">
              Ready to Experience the <span className="text-gradient">Future of Banking?</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Join over 2,000,000 individuals and global corporations banking with 5.15% APY yield, zero wire markups, and institutional peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to="/open-account" className={`${btnPrimary} py-3.5 px-8 text-sm w-full sm:w-auto shadow-glow`}>
                <span>Open Your Account Now</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className={`${btnGlass} py-3.5 px-8 text-sm w-full sm:w-auto`}>
                <span>Speak with an Advisor</span>
              </Link>
            </div>
            <p className="text-[11px] text-muted-foreground font-mono">
              Identity Verification in 3 Minutes • Zero Minimum Balance • Instant World Elite Virtual Card
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
