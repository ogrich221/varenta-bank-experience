import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, CreditCard, Globe2, ShieldCheck, ArrowRight, Zap, Sparkles } from "lucide-react";
import { RotatingDebitCard } from "./RotatingDebitCard";
import { GlobalPresenceGlobe } from "./GlobalPresenceGlobe";
import { Link } from "@tanstack/react-router";
import { btnPrimary } from "./Layout";

export function GlassNavShowcase() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const slides = [
    {
      id: "card-360",
      badge: "World Elite Titanium",
      title: "Interactive 360° Debit Card",
      subtitle: "Full-grain titanium debit card with real-time biometric safeguards and instant global contactless authorization.",
      component: "card",
    },
    {
      id: "global-21",
      badge: "21 Authorized Jurisdictions",
      title: "Real-Time Global Clearing Network",
      subtitle: "Blinking radar telemetry across all 21 international operating centers in the Americas, Europe, Asia-Pacific, and the Middle East.",
      component: "globe",
    },
    {
      id: "borderless-wealth",
      badge: "Private Multi-Currency",
      title: "Borderless Accounts & 0% FX Markups",
      subtitle: "Hold, convert and spend in 28 currencies with institutional interbank rates and zero cross-border fees.",
      component: "wealth",
    },
  ];

  const totalSlides = slides.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0]!.clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0]!.clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Next
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Prev
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const current = slides[currentSlide];

  return (
    <section
      className="relative px-4 py-20 sm:px-6 lg:py-28 overflow-hidden"
      aria-label="Interactive Experience Showcase"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Ambient background blur elements */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-96 w-96 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        {/* Header & Glass Navigation Controls */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{current.badge}</span>
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-5xl">
              {current.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
              {current.subtitle}
            </p>
          </div>

          {/* CLEAR GLASS-LIKE BACK & FRONT NAVIGATION CONTROLS */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Slide counter pill */}
            <div className="hidden sm:flex items-center rounded-full border border-white/25 bg-white/10 dark:bg-white/5 px-4 py-2 text-xs font-mono backdrop-blur-xl shadow-glass text-foreground">
              <span className="font-bold text-primary">0{currentSlide + 1}</span>
              <span className="mx-1 text-muted-foreground">/</span>
              <span className="text-muted-foreground">0{totalSlides}</span>
            </div>

            {/* Glass BACK button */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous showcase slide"
              className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/35 bg-white/15 dark:bg-white/10 text-foreground backdrop-blur-2xl shadow-glass transition-all duration-300 hover:scale-105 hover:bg-white/25 hover:border-white/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-60" />
              <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-0.5" />
              <span className="sr-only">Move Back</span>
            </button>

            {/* Glass FRONT (NEXT) button */}
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next showcase slide"
              className="group relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/35 bg-white/15 dark:bg-white/10 text-foreground backdrop-blur-2xl shadow-glass transition-all duration-300 hover:scale-105 hover:bg-white/25 hover:border-white/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-60" />
              <ChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-0.5" />
              <span className="sr-only">Move Front</span>
            </button>
          </div>
        </div>

        {/* Dynamic Slide Presentation */}
        <div className="relative min-h-[460px] rounded-3xl transition-all duration-500">
          {/* SLIDE 1: 360° Rotating Debit Card */}
          {currentSlide === 0 && (
            <div className="animate-rise grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <RotatingDebitCard />
              </div>
              <div className="flex flex-col gap-5 lg:col-span-5">
                <div className="rounded-3xl border border-white/20 bg-background/50 p-6 backdrop-blur-xl shadow-glass">
                  <h3 className="text-xl font-bold">Why the Varenta Elite Card Leads</h3>
                  <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Zap className="h-3 w-3" />
                      </span>
                      <span>
                        <strong className="text-foreground">Zero Foreign Transaction Fees:</strong> Spend seamlessly across all 21 operating hubs at pure interbank spot exchange rates.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <ShieldCheck className="h-3 w-3" />
                      </span>
                      <span>
                        <strong className="text-foreground">Dynamic CVV & Instant Freeze:</strong> Toggle security lock, modify limits, or regenerate virtual CVVs in real time from your app.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <CreditCard className="h-3 w-3" />
                      </span>
                      <span>
                        <strong className="text-foreground">Contactless & Metal Core:</strong> Crafted with a precision weighted tungsten core and high-frequency contactless chip.
                      </span>
                    </li>
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link to="/open-account" className={btnPrimary}>
                      Claim Your Card <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Blinking 21 Countries Globe */}
          {currentSlide === 1 && (
            <div className="animate-rise">
              <GlobalPresenceGlobe />
            </div>
          )}

          {/* SLIDE 3: Private Wealth & Borderless Banking */}
          {currentSlide === 2 && (
            <div className="animate-rise grid gap-8 lg:grid-cols-3">
              <div className="rounded-3xl border border-white/25 bg-background/60 p-8 backdrop-blur-xl shadow-glass flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
                    <Globe2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">21 Global Clearing Hubs</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Direct local clearing in New York, London, Zurich, Tokyo, Singapore, Dubai and 15 other premier financial capitals.
                  </p>
                </div>
                <div className="mt-6 border-t border-border/40 pt-4 font-mono text-xs text-primary font-semibold">
                  T+0 INSTANT SETTLEMENT
                </div>
              </div>

              <div className="rounded-3xl border border-white/25 bg-background/60 p-8 backdrop-blur-xl shadow-glass flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-500 text-white">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">Institutional Security</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Multi-jurisdictional compliance under FDIC, FCA, FINMA, and BaFin oversight, protecting every asset.
                  </p>
                </div>
                <div className="mt-6 border-t border-border/40 pt-4 font-mono text-xs text-amber-500 font-semibold">
                  UP TO $2,500,000 COVERAGE
                </div>
              </div>

              <div className="rounded-3xl border border-white/25 bg-background/60 p-8 backdrop-blur-xl shadow-glass flex flex-col justify-between">
                <div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-amber-500 text-white">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold">World Elite Concierge</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Dedicated private banker and 24/7 global lifestyle concierge available via phone or encrypted chat.
                  </p>
                </div>
                <div className="mt-6 border-t border-border/40 pt-4 font-mono text-xs text-primary font-semibold">
                  24/7 DEDICATED DESK
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM GLASS PILLS NAVIGATOR (Jump to any view) */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setCurrentSlide(idx)}
              className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold backdrop-blur-xl transition-all duration-300 ${
                currentSlide === idx
                  ? "border-primary bg-primary text-primary-foreground shadow-glow scale-105"
                  : "border-white/20 bg-white/10 dark:bg-white/5 text-muted-foreground hover:bg-white/20 hover:text-foreground"
              }`}
            >
              <span className="font-mono text-[10px]">0{idx + 1}.</span>
              <span>{s.badge}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
