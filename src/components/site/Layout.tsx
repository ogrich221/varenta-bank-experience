import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { LanguageSelector } from "./LanguageSelector";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold" aria-label="Varenta Bank home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">V</span>
      <span>Varenta<span className="text-primary"> Bank</span></span>
    </Link>
  );
}

const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";
export const btnPrimary = `${btn} bg-gradient-primary text-primary-foreground shadow-glow hover:-translate-y-0.5 hover:brightness-105`;
export const btnGlass = `${btn} glass text-foreground hover:-translate-y-0.5`;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-md focus:bg-background focus:p-2">Skip to content</a>
      <nav aria-label="Main" className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-3 py-2 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSelector />
          <div className="h-4 w-px bg-border/60 hidden sm:block" />
          <Logo />
        </div>
        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground bg-accent" }} activeOptions={{ exact: true }}>{n.label}</Link>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/dashboard" className="rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 flex items-center gap-1.5 transition-all">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span>Banking Portal</span>
          </Link>
          <Link to="/login" className="px-4 py-2 text-sm font-semibold hover:text-primary">Login</Link>
          <Link to="/open-account" className={btnPrimary}>Open an Account</Link>
        </div>
        <button className="grid h-11 w-11 place-items-center rounded-full lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="glass mx-auto mt-2 max-w-7xl rounded-3xl p-4 lg:hidden animate-rise">
          <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-2 px-1">
            <span className="text-xs font-semibold text-muted-foreground">Select Language</span>
            <LanguageSelector />
          </div>
          <ul className="flex flex-col">
            {[...nav, { to: "/dashboard", label: "Client Banking Portal" }, { to: "/login", label: "Login" } as const].map((n) => (
              <li key={n.to}><Link to={n.to} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-3 font-medium hover:bg-accent">{n.label}</Link></li>
            ))}
          </ul>
          <Link to="/open-account" onClick={() => setOpen(false)} className={`${btnPrimary} mt-2 w-full`}>Open an Account</Link>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const cols = [
    { h: "Bank", l: [["/about", "About us"], ["/services", "Services"], ["/contact", "Contact"]] },
    { h: "Account", l: [["/login", "Login"], ["/open-account", "Open an Account"]] },
  ] as const;
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="text-cream"><Logo /></div>
          <p className="mt-4 max-w-sm text-sm opacity-70">Banking reimagined for a brighter tomorrow. Secure, fast and always on.</p>
          <div className="mt-6 flex gap-3">
            {[Facebook, Instagram, Linkedin, Twitter].map((I, i) => (
              <a key={i} href="#" aria-label={["Facebook", "Instagram", "LinkedIn", "Twitter"][i]} className="glass-dark grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-primary"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.h}>
            <h3 className="text-sm font-semibold text-primary-glow">{c.h}</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {c.l.map(([to, l]) => <li key={to}><Link to={to} className="opacity-75 hover:opacity-100 hover:text-primary-glow">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="border-t border-cream/10 py-6 text-center text-xs opacity-60">© 2026 Varenta Bank. All rights reserved. Member FDIC.</p>
    </footer>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter />
    </>
  );
}

export function SimplePage({ title, intro, children }: { title: string; intro: string; children?: ReactNode }) {
  return (
    <PageShell>
      <section className="relative overflow-hidden px-6 pb-24 pt-36">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gradient-primary opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
          <div className="mt-10">{children}</div>
        </div>
      </section>
    </PageShell>
  );
}
