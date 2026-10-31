import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck, Award, Globe, Users, Landmark, Lock, CheckCircle2,
  Building2, ArrowRight, HeartHandshake, Eye, Sparkles, Scale
} from "lucide-react";
import { PageShell, btnPrimary, btnGlass } from "@/components/site/Layout";
import teller from "@/assets/branch-teller.jpg";
import lobby from "@/assets/branch-lobby.jpg";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "About Varenta Bank — Trust, Solvency & Global Innovation" },
      { name: "description", content: "Learn how Varenta Bank combines 100% full-reserve solvency, 21-jurisdiction global reach, and human-first banking for over 2,000,000 clients." },
      { property: "og:title", content: "About Varenta Bank — Trust & Solvency" },
      { property: "og:description", content: "100% full-reserve banking, 21 international financial hubs, and $18B+ in secured client assets." },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  const pillars = [
    {
      icon: Landmark,
      badge: "100% Full-Reserve",
      title: "Solvency Without Speculation",
      description: "Unlike legacy banks that gamble depositor funds on high-risk loans, Varenta maintains a 100% full-reserve model. Your deposits are held 1:1 in central bank reserves and ultra-liquid sovereign treasuries, verified through real-time cryptographic proof-of-reserves.",
    },
    {
      icon: ShieldCheck,
      badge: "21 Jurisdictions",
      title: "Multi-Regulated Protection",
      description: "We operate under direct oversight of the world's most rigorous financial watchdogs: FDIC/OCC in the US, FCA & PRA in the UK, FINMA in Switzerland, BaFin in Germany, and MAS in Singapore. Insured deposit sweeps protect up to $2,500,000 per client.",
    },
    {
      icon: Eye,
      badge: "Radical Clarity",
      title: "Zero Hidden Markups or Fees",
      description: "We believe opaque fees erode trust. With Varenta, foreign exchange is cleared at live interbank mid-market rates, savings yield is paid daily at 5.15% APY, and monthly maintenance fees are permanently zero.",
    },
    {
      icon: HeartHandshake,
      badge: "Human-First",
      title: "60-Second Human Concierge",
      description: "Technology should empower human connection, not replace it. Whenever you call or message Varenta, a licensed private banking officer responds in under 60 seconds. No automated phone trees or robotic dead-ends.",
    },
  ];

  const leadership = [
    {
      name: "Helena von Berg",
      role: "Chief Executive Officer & Co-Founder",
      bg: "22 years in international wealth management; former Managing Director at Swiss Private Banking Council, Zurich.",
      badge: "Zurich / Geneva",
    },
    {
      name: "Marcus Sterling",
      role: "Chief Investment Officer",
      bg: "Former Head of Fixed Income & Macro Treasury at Barclays Global, London; Chartered Financial Analyst (CFA).",
      badge: "London",
    },
    {
      name: "Dr. Chen Wei",
      role: "Chief Technology & Security Officer",
      bg: "PhD in Cryptographic Verification from MIT; former Principal Architect at Google Cloud Security & FinTech Core.",
      badge: "New York / Singapore",
    },
    {
      name: "Elena Rostova",
      role: "Chief Regulatory & Compliance Officer",
      bg: "Former Senior Bank Examiner at the Federal Reserve Bank; 18 years shaping global cross-border AML/CFT standards.",
      badge: "Frankfurt",
    },
  ];

  const milestones = [
    {
      year: "2021",
      title: "Founding & Core Architecture",
      desc: "Founded by private bankers and cybersecurity leaders with a mission to build a full-reserve international digital bank.",
    },
    {
      year: "2023",
      title: "Transatlantic Clearing Corridors",
      desc: "Established direct RTGS clearing in New York, London, and Zurich; surpassed $4 Billion in client deposits.",
    },
    {
      year: "2024",
      title: "Expansion to 21 Financial Hubs",
      desc: "Licensed clearing across 21 premier jurisdictions spanning Europe, Americas, APAC, and Middle East.",
    },
    {
      year: "2025",
      title: "$18B Milestone & World Elite Card",
      desc: "Surpassed 2,000,000 active clients globally and launched the World Elite Titanium card with 360° rotating CVV security.",
    },
    {
      year: "2026",
      title: "Real-Time 24/7 Global Clearing",
      desc: "Instant T+0 multi-currency settlement and automated treasury vaults operating uninterrupted 24/7/365.",
    },
  ];

  const audits = [
    { title: "Big-4 Annual Financial Audit", desc: "Clean, unqualified audit opinion on solvency, assets, and liabilities." },
    { title: "SOC2 Type II Certified", desc: "Rigorous independent audit of data security, availability, and processing integrity." },
    { title: "ISO/IEC 27001 Certified", desc: "International standard for world-class information security management systems." },
    { title: "PCI-DSS Level 1 Merchant Custody", desc: "Highest tier of payment card industry physical and cryptographic compliance." },
  ];

  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl animate-rise">
            <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-accent-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Built On Trust, Solvency & Human Precision
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] sm:text-6xl">
              Redefining international banking for a <span className="text-gradient">connected world</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Varenta was founded with a singular principle: your money should work tirelessly for you in an institution that never gambles with your trust. We combine full-reserve solvency, 21-jurisdiction global reach, and personal private banking.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/open-account" className={btnPrimary}>
                Become a Client <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/services" className={btnGlass}>
                View Our Services
              </Link>
            </div>
          </div>

          {/* Core Institutional Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 rounded-3xl border border-white/20 bg-background/60 p-6 backdrop-blur-xl shadow-glass sm:grid-cols-4">
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-foreground">$18.4B+</p>
              <p className="text-xs text-muted-foreground mt-1">Client Assets Under Custody</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-foreground">2,100,000+</p>
              <p className="text-xs text-muted-foreground mt-1">Active Global Clients</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-foreground">21 Hubs</p>
              <p className="text-xs text-muted-foreground mt-1">Authorized Jurisdictions</p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl font-bold text-foreground">100%</p>
              <p className="text-xs text-muted-foreground mt-1">Full-Reserve Backing</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE VARENTA MANIFESTO ================= */}
      <section className="px-6 py-20 bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-5xl">
          <div className="glass rounded-[2.5rem] p-8 sm:p-14 shadow-glass">
            <span className="text-xs font-mono uppercase tracking-widest text-primary font-bold">
              Our Founding Manifesto
            </span>
            <h2 className="mt-4 text-2xl font-bold sm:text-4xl leading-tight">
              "We didn't just build a new banking interface; we rebuilt the foundation of financial trust."
            </h2>
            <div className="mt-6 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                For over a century, legacy commercial banking has relied on fractional reserves—taking client deposits and lending them out into illiquid, speculative bets. When economic winds shift, depositors face withdrawal freezes and uncertainty.
              </p>
              <p>
                At Varenta, we rejected this compromise. Every single dollar, euro, pound, or yen deposited in our high-yield treasury vaults is backed 1:1 by central bank reserves and ultra-liquid sovereign debt. We pass the yield directly to our depositors—currently <strong>5.15% APY</strong>—without hidden management markups.
              </p>
              <p>
                Furthermore, as our clients travel, invest, and operate companies across borders, they should never be subjected to 3-day delays or predatory 4% FX markups. By maintaining direct clearing connectivity in 21 premier international financial centers, we execute cross-border transfers in under 15 seconds.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border/50 flex items-center justify-between">
              <div>
                <p className="font-display text-base font-bold text-foreground">The Varenta Executive Board</p>
                <p className="text-xs text-muted-foreground">Zurich • London • New York • Singapore</p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Scale className="h-5 w-5" />
                <span className="font-mono text-xs font-semibold">1:1 FULL RESERVE STANDARD</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= THE 4 PILLARS OF CONVICTION ================= */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Institutional Framework
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Four non-negotiable pillars of security & trust
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              How Varenta safeguards your capital while maximizing liquidity and returns.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {pillars.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="glass group relative overflow-hidden rounded-[2.25rem] p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-glow"
                >
                  <div className="flex items-center justify-between">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-md transition-transform group-hover:scale-110">
                      <Icon className="h-7 w-7" />
                    </span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[11px] font-bold text-primary">
                      {p.badge}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl sm:text-2xl font-bold text-foreground">{p.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= PHYSICAL BRANCHES & DIGITAL SPEED ================= */}
      <section className="px-6 py-20 bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                Physical Presence + Instant Digital
              </span>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Global flagship branches for <span className="text-gradient">in-person excellence</span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                While our digital app executes instant transfers in milliseconds, we recognize that substantial private wealth and corporate decisions deserve face-to-face attention.
              </p>
              <div className="mt-6 space-y-3 text-xs sm:text-sm text-foreground/80">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Private client lounges in New York, London, Zurich, Tokyo, Singapore, and Dubai.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Dedicated wealth officers for complex trusts, cross-border tax structuring, and custody.</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  <span>Secure biometric deposit vaults and on-site bullion custody services.</span>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Link to="/contact" className={btnPrimary}>
                  Book a Private Branch Visit
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <figure className="glass group overflow-hidden rounded-3xl">
                <img
                  src={teller}
                  alt="Varenta private banker in consultation"
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="p-4 text-xs">
                  <p className="font-semibold text-foreground">Personal Banking Officers</p>
                  <p className="text-muted-foreground">Certified advisory in 14 languages</p>
                </figcaption>
              </figure>

              <figure className="glass group overflow-hidden rounded-3xl">
                <img
                  src={lobby}
                  alt="Varenta flagship banking lobby"
                  className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="p-4 text-xs">
                  <p className="font-semibold text-foreground">Flagship Lobbies</p>
                  <p className="text-muted-foreground">Designed for privacy & efficiency</p>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LEADERSHIP & GOVERNANCE ================= */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Executive Governance
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Led by veteran stewards of international finance
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Decades of combined experience leading Tier-1 central banking supervision, Swiss private wealth, and cryptographic security.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((l, i) => (
              <div
                key={i}
                className="glass group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-glow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground font-bold text-lg">
                      {l.name.charAt(0)}
                    </span>
                    <span className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-[10px] font-mono text-muted-foreground">
                      {l.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{l.name}</h3>
                  <p className="text-xs font-semibold text-primary mt-0.5">{l.role}</p>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{l.bg}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TIMELINE OF GROWTH ================= */}
      <section className="px-6 py-20 bg-muted/20 border-y border-border/40">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              Our Journey
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              From founding vision to $18 Billion in trusted custody
            </h2>
          </div>

          <div className="mt-14 space-y-6">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="glass rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 transition-transform hover:scale-[1.01]"
              >
                <span className="rounded-2xl bg-primary px-4 py-2 font-mono text-base font-bold text-primary-foreground shadow-sm">
                  {m.year}
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{m.title}</h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= REGULATORY AUDITS & CERTIFICATIONS ================= */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Award className="h-3.5 w-3.5" />
              Verified Compliance
            </span>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Independently audited & internationally certified
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {audits.map((a, i) => (
              <div key={i} className="glass rounded-3xl p-6 text-left">
                <ShieldCheck className="h-6 w-6 text-green-500 mb-3" />
                <h4 className="font-bold text-sm text-foreground">{a.title}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="relative overflow-hidden bg-ink text-cream px-6 py-20">
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/20 px-4 py-1.5 text-xs font-semibold text-primary-glow">
            Your Financial Sovereignty Starts Here
          </span>
          <h2 className="mt-6 text-3xl font-bold sm:text-5xl text-cream">
            Experience banking the way it was meant to be
          </h2>
          <p className="mt-4 text-sm sm:text-base text-cream/70 max-w-xl mx-auto">
            Open an account today with zero paperwork. Enjoy 5.15% APY high-yield savings, instant global transfers, and World Elite card privileges.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/open-account" className={btnPrimary}>
              Open Account in 5 Min <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/contact" className="glass-dark inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold hover:bg-white/20 transition-all">
              Contact Private Banking Desk
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
