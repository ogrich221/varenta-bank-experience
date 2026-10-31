import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Phone, Mail, MapPin, Clock, ShieldCheck, CheckCircle2,
  Building2, MessageSquare, ArrowRight, Globe, Headphones, Lock
} from "lucide-react";
import { PageShell, btnPrimary, btnGlass } from "@/components/site/Layout";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Contact Private Client Concierge — Varenta Bank" },
      { name: "description", content: "Connect with Varenta Bank's 24/7 private wealth advisory, commercial treasury desk, and global branch concierge." },
      { property: "og:title", content: "Contact Varenta Bank — 24/7 Client Advisory" },
      { property: "og:description", content: "Connect directly with chartered wealth officers and commercial treasury specialists in under 60 seconds." },
    ],
  }),
  component: ContactPage,
});

const hubs = [
  {
    city: "New York Flagship HQ",
    address: "1 Wall Street, Financial District, New York, NY 10005, United States",
    phone: "+1 (800) 827-3682",
    email: "ny.desk@varenta.bank",
    hours: "24/7/365 Desk • Flagship Lobbies 8:00 AM – 6:00 PM EST",
    jurisdiction: "FDIC / OCC Member",
  },
  {
    city: "London Financial Center",
    address: "25 Churchill Place, Canary Wharf, London E14 5EY, United Kingdom",
    phone: "+44 20 7946 0991",
    email: "london.desk@varenta.bank",
    hours: "24/7/365 Desk • Private Suites 8:30 AM – 6:00 PM GMT",
    jurisdiction: "PRA & FCA Authorized",
  },
  {
    city: "Zurich Private Banking Hub",
    address: "Bahnhofstrasse 45, 8001 Zurich, Switzerland",
    phone: "+41 22 819 3000",
    email: "zurich.desk@varenta.bank",
    hours: "24/7/365 Desk • Bullion Vaults 9:00 AM – 5:30 PM CET",
    jurisdiction: "FINMA Regulated",
  },
  {
    city: "Singapore Regional Treasury",
    address: "10 Marina Boulevard, Marina Bay Financial Centre, Singapore 018983",
    phone: "+65 6712 8800",
    email: "sg.desk@varenta.bank",
    hours: "24/7/365 Desk • Regional Treasury 8:30 AM – 6:00 PM SGT",
    jurisdiction: "MAS Authorized",
  },
];

export function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: "High-Yield Treasury Vault",
    hub: "New York Flagship HQ",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Consultation request received! A private banker will contact you within 15 minutes.");
  };

  return (
    <PageShell>
      <div className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[500px] w-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 top-1/2 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          {/* Header */}
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
              <Headphones className="h-3.5 w-3.5" /> 24/7/365 Direct Private Wealth Advisory
            </span>
            <h1 className="mt-4 text-4xl font-extrabold sm:text-6xl tracking-tight leading-tight">
              Connect With Our <span className="text-gradient">Private Client Desk</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
              Every client inquiry is handled by licensed private bankers and commercial treasury officers in under 60 seconds. No automated phone trees. No outsourced queues.
            </p>
          </div>

          {/* Quick Contact Cards */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="glass rounded-[2rem] p-6 border border-white/20 shadow-glass">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary mb-4">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Global Telephone Concierge</h3>
              <p className="text-xs text-muted-foreground mt-1">Available 24 hours a day, 7 days a week.</p>
              <div className="mt-4 space-y-1.5 text-xs font-mono">
                <p className="text-foreground font-semibold">+1 (800) 827-3682 <span className="text-muted-foreground text-[10px] font-sans">(US Toll-Free)</span></p>
                <p className="text-foreground font-semibold">+44 20 7946 0991 <span className="text-muted-foreground text-[10px] font-sans">(UK & Europe)</span></p>
                <p className="text-foreground font-semibold">+41 22 819 3000 <span className="text-muted-foreground text-[10px] font-sans">(Switzerland)</span></p>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border border-white/20 shadow-glass">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Encrypted Electronic Dispatch</h3>
              <p className="text-xs text-muted-foreground mt-1">Direct routing to specialized desks.</p>
              <div className="mt-4 space-y-1.5 text-xs font-mono">
                <p className="text-foreground font-semibold">concierge@varenta.bank <span className="text-muted-foreground text-[10px] font-sans">(Private Banking)</span></p>
                <p className="text-foreground font-semibold">treasury@varenta.bank <span className="text-muted-foreground text-[10px] font-sans">(Institutional)</span></p>
                <p className="text-foreground font-semibold">compliance@varenta.bank <span className="text-muted-foreground text-[10px] font-sans">(Governance)</span></p>
              </div>
            </div>

            <div className="glass rounded-[2rem] p-6 border border-white/20 shadow-glass">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">Client Protection Guarantee</h3>
              <p className="text-xs text-muted-foreground mt-1">Institutional regulatory oversight.</p>
              <div className="mt-4 space-y-1.5 text-xs">
                <p className="text-foreground font-semibold">● 100% Full-Reserve Custodial Mandate</p>
                <p className="text-foreground font-semibold">● FDIC Swept Insurance up to $2.5M</p>
                <p className="text-foreground font-semibold">● End-to-end 256-bit encrypted channels</p>
              </div>
            </div>
          </div>

          {/* Form & Consultation Suite */}
          <div className="mt-16 grid gap-10 lg:grid-cols-12 items-start">
            {/* Consultation Request Form */}
            <div className="lg:col-span-7 glass rounded-[2.5rem] p-8 sm:p-10 border border-white/25 shadow-glass">
              <div className="border-b border-border/40 pb-5 mb-6">
                <h2 className="text-2xl font-bold text-foreground">Schedule a Private Consultation</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect with a dedicated private client advisor or commercial treasury specialist.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-3xl bg-green-500/15 border border-green-500/40 p-8 text-center space-y-3 animate-rise">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-green-500/20 text-green-400 mx-auto">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-green-300">Inquiry Dispatched Successfully</h3>
                  <p className="text-xs text-green-200/80 max-w-md mx-auto leading-relaxed">
                    Thank you, {form.name}. Your inquiry has been routed to our senior wealth director. A member of our executive advisory desk will reach out within 15 minutes.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        service: "High-Yield Treasury Vault",
                        hub: "New York Flagship HQ",
                        message: "",
                      });
                    }}
                    className="mt-4 text-xs font-semibold text-primary underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Helena Vance"
                        className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-1">Corporate or Personal Email *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="h.vance@capital.com"
                        className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block font-semibold text-foreground mb-1">Telephone / WhatsApp</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+1 (555) 019-2834"
                        className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-foreground mb-1">Target Banking Service</label>
                      <select
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full rounded-2xl border border-border/60 bg-zinc-900 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                      >
                        <option value="High-Yield Treasury Vault">High-Yield Treasury Vault (5.15% APY)</option>
                        <option value="Multi-Currency Clearing">Multi-Currency Clearing (21 Hubs)</option>
                        <option value="World Elite Metal Cards">World Elite Metal Cards</option>
                        <option value="Bespoke Asset Lending">Bespoke Asset Lending (from 4.25% APR)</option>
                        <option value="Commercial Treasury">Commercial Corporate Treasury</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">Preferred Operating Hub</label>
                    <select
                      value={form.hub}
                      onChange={(e) => setForm({ ...form, hub: e.target.value })}
                      className="w-full rounded-2xl border border-border/60 bg-zinc-900 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    >
                      <option value="New York Flagship HQ">New York Flagship HQ (Wall Street)</option>
                      <option value="London Financial Center">London Financial Center (Canary Wharf)</option>
                      <option value="Zurich Private Banking Hub">Zurich Private Banking Hub (Bahnhofstrasse)</option>
                      <option value="Singapore Regional Treasury">Singapore Regional Treasury (Marina Bay)</option>
                      <option value="Encrypted Digital Video Consultation">Encrypted Digital Video Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-foreground mb-1">Message or Requirements *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Please detail your initial balance allocations, cross-border requirements, or private consultation preferences..."
                      className="w-full rounded-2xl border border-border/60 bg-background/80 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`${btnPrimary} w-full py-3.5 text-sm shadow-glow font-bold`}
                  >
                    <span>Request Private Consultation</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Global Hub Directory */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-lg text-foreground">Global Flagship Hubs</h3>
              </div>

              {hubs.map((hub) => (
                <div
                  key={hub.city}
                  className="glass rounded-3xl p-5 border border-white/15 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-foreground text-sm">{hub.city}</h4>
                    <span className="rounded-full bg-primary/10 border border-primary/30 px-2 py-0.5 text-[10px] font-mono text-primary">
                      {hub.jurisdiction}
                    </span>
                  </div>
                  <p className="text-muted-foreground flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{hub.address}</span>
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-300 pt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-primary" /> {hub.phone}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-primary" /> {hub.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
