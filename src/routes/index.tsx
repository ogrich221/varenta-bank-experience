import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowDownLeft, ArrowUpRight, PiggyBank, Send, Landmark, CreditCard, TrendingUp,
  ShieldCheck, Zap, Smartphone, Headphones, Plus, Receipt, Star,
} from "lucide-react";
import hero from "@/assets/hero-bank.jpg";
import teller from "@/assets/branch-teller.jpg";
import lobby from "@/assets/branch-lobby.jpg";
import { PageShell, btnPrimary, btnGlass } from "@/components/site/Layout";
import { GlassNavShowcase } from "@/components/site/GlassNavShowcase";
import { GlobalPresenceGlobe } from "@/components/site/GlobalPresenceGlobe";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Varenta Bank — Modern Digital Banking" },
      { name: "description", content: "Save, send, borrow and invest with Varenta Bank. Secure, fast, 24/7 digital banking." },
      { property: "og:title", content: "Varenta Bank — Modern Digital Banking" },
      { property: "og:description", content: "Secure, fast, 24/7 digital banking for a brighter tomorrow." },
    ],
  }),
  component: Index,
});

const txns = [
  { n: "Salary — Lumen Co.", a: "+$4,250.00", in: true },
  { n: "Bloom Grocery", a: "-$86.40", in: false },
  { n: "Transfer to Maya", a: "-$120.00", in: false },
];

const services = [
  { i: PiggyBank, t: "Savings", d: "Earn up to 4.6% APY with zero fees." },
  { i: Send, t: "Transfers", d: "Send money worldwide in seconds." },
  { i: Landmark, t: "Loans", d: "Flexible rates, instant decisions." },
  { i: CreditCard, t: "Cards", d: "Metal cards with smart controls." },
  { i: TrendingUp, t: "Investments", d: "Grow wealth with guided portfolios." },
];

const benefits = [
  { i: ShieldCheck, t: "Bank-grade security", d: "256-bit encryption and biometric login." },
  { i: Zap, t: "Fast transactions", d: "Real-time payments, no waiting." },
  { i: Smartphone, t: "Convenience", d: "Your whole bank in your pocket." },
  { i: Headphones, t: "24/7 support", d: "Real humans, any hour of the day." },
];

const reviews = [
  { n: "Amara Okafor", r: "Small business owner", q: "Varenta made managing my business finances effortless. Transfers are instant." },
  { n: "Daniel Reyes", r: "Software engineer", q: "The cleanest banking app I've ever used. It just feels premium." },
  { n: "Sofia Laurent", r: "Designer", q: "Support answered at 2 a.m. in under a minute. That's trust." },
];

function Index() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative isolate min-h-[100svh] overflow-hidden" aria-labelledby="hero-title">
        <img src={hero} alt="Varenta Bank headquarters, a modern glass building with the Varenta logo at sunset" width={1920} height={1088} className="absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 -z-10 bg-gradient-hero max-lg:bg-background/80" />
        <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-6 pb-16 pt-32">
          <div className="max-w-xl animate-rise">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-accent-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" /> New: 4.6% APY savings
            </span>
            <h1 id="hero-title" className="mt-6 text-4xl font-bold leading-[1.05] sm:text-6xl">
              Banking built for a <span className="text-gradient">brighter tomorrow</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Open an account in 5 minutes. Save, send, and grow your money with no hidden fees.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/open-account" className={btnPrimary}>Open an Account <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/services" className={btnGlass}>Explore Services</Link>
            </div>
            <dl className="mt-10 flex gap-8">
              {[["2M+", "Customers"], ["$18B", "Secured"], ["4.9★", "App rating"]].map(([v, l]) => (
                <div key={l}><dt className="sr-only">{l}</dt><dd className="font-display text-2xl font-bold">{v}</dd><dd className="text-xs text-muted-foreground">{l}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Interactive Experience: 360° Debit Card & 21-Country Blinking Globe with Glass Navigation */}
      <GlassNavShowcase />


      {/* Dashboard preview */}
      <section className="relative px-6 py-24" aria-labelledby="dash-title">
        <div className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-gradient-primary opacity-25 blur-3xl" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 id="dash-title" className="text-3xl font-bold sm:text-4xl">Your money, beautifully clear</h2>
            <p className="mt-3 text-muted-foreground">Everything at a glance in one elegant dashboard.</p>
          </div>
          <div className="glass mt-12 grid gap-4 rounded-[2rem] p-4 sm:p-6 lg:grid-cols-3">
            <div className="rounded-3xl bg-gradient-primary p-6 text-primary-foreground shadow-glow lg:col-span-2">
              <p className="text-sm opacity-85">Total balance</p>
              <p className="mt-2 font-display text-4xl font-bold sm:text-5xl">$0.00</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-background/20 p-4 backdrop-blur"><p className="flex items-center gap-1 text-xs"><ArrowDownLeft className="h-3 w-3" />Income</p><p className="mt-1 font-display text-xl font-semibold">$0.00</p></div>
                <div className="rounded-2xl bg-background/20 p-4 backdrop-blur"><p className="flex items-center gap-1 text-xs"><ArrowUpRight className="h-3 w-3" />Expenses</p><p className="mt-1 font-display text-xl font-semibold">$0.00</p></div>
              </div>
            </div>
            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-semibold">Quick actions</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {[[Send, "Send"], [Plus, "Top up"], [Receipt, "Pay bills"], [CreditCard, "Cards"]].map(([I, l]) => {
                  const Icon = I as typeof Send;
                  return (
                    <button key={l as string} className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-2xl bg-background/60 text-xs font-semibold transition-all hover:-translate-y-0.5 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring">
                      <Icon className="h-5 w-5 text-primary" aria-hidden />{l as string}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="glass rounded-3xl p-6 lg:col-span-3">
              <h3 className="text-sm font-semibold">Recent transactions</h3>
              <ul className="mt-4 divide-y divide-border">
                {txns.map((t) => (
                  <li key={t.n} className="flex items-center justify-between py-3">
                    <span className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-full ${t.in ? "bg-accent text-primary" : "bg-muted text-muted-foreground"}`}>
                        {t.in ? <ArrowDownLeft className="h-4 w-4" aria-hidden /> : <ArrowUpRight className="h-4 w-4" aria-hidden />}
                      </span>
                      <span className="text-sm font-medium">{t.n}</span>
                    </span>
                    <span className={`font-display text-sm font-semibold ${t.in ? "text-primary" : ""}`}>{t.a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative px-6 py-24" aria-labelledby="svc-title">
        <div className="pointer-events-none absolute -right-20 top-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                Comprehensive Financial Architecture
              </span>
              <h2 id="svc-title" className="mt-3 text-3xl font-bold sm:text-5xl">
                Services engineered for <span className="text-gradient">maximum growth</span>
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
            <article className="glass group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between">
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
                <ul className="mt-5 space-y-2 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Up to $2.5M FDIC sweep insurance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Automated smart round-ups & sub-vaults
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Instant liquidity with 0 lock-up penalties
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
            <article className="glass group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <Send className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-500 font-mono">
                    0% FX SPREAD
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Global Borderless Transfers</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Send, receive, and hold 28 currencies with domestic bank coordinates across 21 authorized operating nations.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    T+0 real-time clearing (FedNow, SEPA, Faster Payments)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Zero hidden foreign exchange markups
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
            <article className="glass group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <CreditCard className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-500 font-mono">
                    1.8% CASHBACK
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">World Elite Metal Debit Cards</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Solid tungsten and titanium cards featuring dynamic 360° rotating CVV security and VIP global concierge privileges.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Unlimited 1.8% cash back deposited daily
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Zero foreign transaction fees worldwide
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
            <article className="glass group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <Landmark className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500 font-mono">
                    FROM 4.25% APR
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Bespoke Lending & Credit Lines</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Unlock liquidity without selling long-term holdings. Securities-backed loans, commercial financing, and luxury real estate mortgages.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Instant pre-approval with zero credit score impact
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Zero origination, maintenance, or prepayment fees
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
            <article className="glass group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between">
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
                <ul className="mt-5 space-y-2 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Global equity indexes, sovereign bonds & private debt
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Tax-loss harvesting saving an average 1.4% annually
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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
            <article className="glass group relative overflow-hidden rounded-[2rem] p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                    <ShieldCheck className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500 font-mono">
                    SOC2 TYPE II
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-bold">Institutional Solvency & Custody</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  100% full-reserve banking architecture. Your client funds are segregated in tier-1 central banks, never leveraged for high-risk trading.
                </p>
                <ul className="mt-5 space-y-2 text-xs text-foreground/80">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Real-time cryptographic proof-of-reserves
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    256-bit quantum-resistant hardware encryption
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
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

      {/* Benefits */}
      <section className="px-6 py-24" aria-labelledby="ben-title">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 id="ben-title" className="text-3xl font-bold sm:text-4xl">Why people choose <span className="text-gradient">Varenta</span></h2>
            <p className="mt-4 max-w-md text-muted-foreground">Trust is built on details. We obsess over every one.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map(({ i: I, t, d }) => (
              <div key={t} className="glass rounded-3xl p-6 transition-transform hover:-translate-y-1">
                <I className="h-7 w-7 text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold">{t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Branches */}
      <section className="px-6 py-24" aria-labelledby="br-title">
        <div className="mx-auto max-w-7xl">
          <h2 id="br-title" className="text-3xl font-bold sm:text-4xl">Visit a <span className="text-gradient">Varenta branch</span></h2>
          <p className="mt-3 max-w-xl text-muted-foreground">Prefer face to face? Our teams are ready to help in person.</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { src: teller, w: 736, h: 992, t: "Personal service", d: "Friendly tellers for deposits, cards and advice.", alt: "Varenta Bank teller helping at a counter with the Varenta logo behind her" },
              { src: lobby, w: 736, h: 1312, t: "Modern branches", d: "Bright, welcoming lobbies with short queues.", alt: "Customers queueing in a modern Varenta Bank branch lobby under the Varenta sign" },
            ].map((b) => (
              <figure key={b.t} className="glass group relative overflow-hidden rounded-[2rem]">
                <img src={b.src} alt={b.alt} width={b.w} height={b.h} loading="lazy" className="h-[28rem] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[34rem]" />
                <figcaption className="glass-dark absolute inset-x-4 bottom-4 rounded-2xl p-5">
                  <h3 className="font-semibold">{b.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative overflow-hidden bg-ink px-6 py-24" aria-labelledby="rev-title">
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <h2 id="rev-title" className="text-3xl font-bold sm:text-4xl">Loved by our customers</h2>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.n} className="glass-dark rounded-3xl p-6">
                <div className="flex gap-1 text-primary-glow" aria-label="5 out of 5 stars">{[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" aria-hidden />)}</div>
                <blockquote className="mt-4">“{r.q}”</blockquote>
                <figcaption className="mt-6 text-sm"><span className="font-semibold">{r.n}</span><span className="block opacity-60">{r.r}</span></figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link to="/open-account" className={btnPrimary}>Start banking today <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* Global branches globe */}
      <section className="px-6 py-24" aria-labelledby="globe-title">
        <div className="mx-auto max-w-5xl text-center">
          <h2 id="globe-title" className="text-3xl font-bold sm:text-4xl">Our <span className="text-gradient">21 branches</span> worldwide</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Every blinking light is a Varenta branch, ready to serve you.</p>
          <div className="glass mt-12 rounded-[2rem] p-4 sm:p-8">
            <GlobalPresenceGlobe />
          </div>
        </div>
      </section>
    </PageShell>
  );
}
