import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, ArrowDownLeft, ArrowUpRight, PiggyBank, Send, Landmark, CreditCard, TrendingUp,
  ShieldCheck, Zap, Smartphone, Headphones, Plus, Receipt, Star,
} from "lucide-react";
import hero from "@/assets/hero-bank.jpg";
import teller from "@/assets/branch-teller.jpg";
import lobby from "@/assets/branch-lobby.jpg";
import { PageShell, btnPrimary, btnGlass } from "@/components/site/Layout";

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
              <p className="mt-2 font-display text-4xl font-bold sm:text-5xl">$24,860.50</p>
              <div className="mt-8 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-background/20 p-4 backdrop-blur"><p className="flex items-center gap-1 text-xs"><ArrowDownLeft className="h-3 w-3" />Income</p><p className="mt-1 font-display text-xl font-semibold">$6,420</p></div>
                <div className="rounded-2xl bg-background/20 p-4 backdrop-blur"><p className="flex items-center gap-1 text-xs"><ArrowUpRight className="h-3 w-3" />Expenses</p><p className="mt-1 font-display text-xl font-semibold">$2,185</p></div>
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
      <section className="px-6 py-24" aria-labelledby="svc-title">
        <div className="mx-auto max-w-7xl">
          <h2 id="svc-title" className="text-3xl font-bold sm:text-4xl">Services for every goal</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {services.map(({ i: I, t, d }) => (
              <article key={t} className="glass group rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-glow">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground transition-transform group-hover:rotate-6"><I className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-5 text-lg font-semibold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </article>
            ))}
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
    </PageShell>
  );
}
