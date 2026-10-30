import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCw, Eye, EyeOff, Sparkles, Shield, Wifi } from "lucide-react";

export function RotatingDebitCard() {
  const [isRotating, setIsRotating] = useState(true);
  const [speed, setSpeed] = useState<number>(1);
  const [manualAngle, setManualAngle] = useState(0);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [maskLevel, setMaskLevel] = useState<"allX" | "partial">("allX");
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Smooth continuous rotation loop
  useEffect(() => {
    if (!isRotating || isScrubbing) {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current === 0) lastTimeRef.current = time;
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Base rotation speed: 36 degrees per second * speed multiplier (10 seconds for 360 deg)
      setManualAngle((prev) => (prev + delta * 36 * speed) % 360);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      lastTimeRef.current = 0;
    };
  }, [isRotating, isScrubbing, speed]);

  const handleFlip180 = () => {
    setIsRotating(false);
    setManualAngle((prev) => (prev + 180) % 360);
  };

  const handleResetAngle = () => {
    setManualAngle(0);
    setIsRotating(true);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-xl flex-col items-center">
      {/* 3D Scene Container */}
      <div
        className="relative flex h-72 w-full max-w-md items-center justify-center sm:h-80"
        style={{ perspective: "1200px" }}
      >
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute h-60 w-80 rounded-full bg-gradient-to-r from-amber-500/20 via-primary/30 to-orange-500/20 blur-3xl" />

        {/* Card 3D Wrapper */}
        <div
          className="relative h-56 w-[340px] sm:h-64 sm:w-[410px] select-none transition-transform duration-75 cursor-grab active:cursor-grabbing"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateY(${manualAngle}deg) rotateX(8deg)`,
          }}
          onClick={() => setIsRotating((prev) => !prev)}
          title="Click to pause/play 360 rotation"
        >
          {/* ================= FRONT FACE ================= */}
          <div
            className="absolute inset-0 rounded-[1.75rem] border border-white/30 bg-gradient-to-br from-neutral-900 via-zinc-900 to-black p-6 text-white shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px -5px rgba(249, 115, 22, 0.25)",
            }}
          >
            {/* Holographic metallic sheen */}
            <div className="pointer-events-none absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 animate-pulse" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/15 via-transparent to-transparent" />

            {/* Top row: Brand & Contactless */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold shadow-md text-sm">
                  V
                </span>
                <div>
                  <span className="font-display text-sm font-bold tracking-wider">VARENTA</span>
                  <span className="block text-[9px] uppercase tracking-widest text-amber-400/90 font-mono">
                    World Elite Debit
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Wifi className="h-5 w-5 rotate-90 text-amber-300/80" aria-label="Contactless payment" />
                <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-300">
                  DEBIT
                </span>
              </div>
            </div>

            {/* EMV Microchip */}
            <div className="relative z-10 mt-5 flex items-center gap-4">
              <div className="relative h-9 w-12 rounded-lg border border-amber-300/60 bg-gradient-to-tr from-amber-200 via-amber-400 to-yellow-600 p-1 shadow-inner">
                <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-0.5 rounded border border-amber-800/40 opacity-80">
                  <div className="border-r border-b border-amber-900/40" />
                  <div className="border-b border-amber-900/40" />
                  <div className="border-l border-b border-amber-900/40" />
                  <div className="border-r border-amber-900/40" />
                  <div />
                  <div className="border-l border-amber-900/40" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-amber-300/80">
                <Sparkles className="h-3.5 w-3.5" />
                <span className="font-mono tracking-wider">NFC READY</span>
              </div>
            </div>

            {/* Masked Card Number: XXXXX requested */}
            <div className="relative z-10 mt-6 font-mono text-lg sm:text-xl font-bold tracking-[0.22em] text-white/95 drop-shadow">
              {maskLevel === "allX" ? (
                <span className="flex justify-between">
                  <span>XXXX</span>
                  <span>XXXX</span>
                  <span>XXXX</span>
                  <span>XXXX</span>
                </span>
              ) : (
                <span className="flex justify-between">
                  <span>••••</span>
                  <span>••••</span>
                  <span>••••</span>
                  <span className="text-amber-300">8920</span>
                </span>
              )}
            </div>

            {/* Bottom details: Cardholder and Expiry */}
            <div className="relative z-10 mt-4 flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">
                  Cardholder
                </p>
                <p className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-zinc-200">
                  {maskLevel === "allX" ? "XXXXX XXXXX" : "ALEXANDER VARENTA"}
                </p>
              </div>

              <div className="flex items-center gap-5">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-muted-foreground font-mono">
                    Expires
                  </p>
                  <p className="font-mono text-xs sm:text-sm font-semibold text-zinc-200">
                    {maskLevel === "allX" ? "XX/XX" : "11/31"}
                  </p>
                </div>
                {/* Mastercard-style overlapping circles */}
                <div className="flex -space-x-2.5 opacity-90">
                  <div className="h-7 w-7 rounded-full bg-red-500/90 shadow-sm" />
                  <div className="h-7 w-7 rounded-full bg-amber-400/90 shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* ================= BACK FACE ================= */}
          <div
            className="absolute inset-0 rounded-[1.75rem] border border-white/25 bg-gradient-to-bl from-black via-zinc-950 to-neutral-900 pt-5 text-white shadow-2xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 35px -5px rgba(249, 115, 22, 0.25)",
            }}
          >
            {/* Magnetic Stripe */}
            <div className="h-11 w-full bg-gradient-to-r from-neutral-800 via-neutral-950 to-neutral-800 border-y border-neutral-700/50 shadow-inner" />

            <div className="px-6 pt-4">
              {/* Signature Panel with masked CVV: XXX */}
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-sm bg-neutral-200 px-3 py-1.5 text-neutral-800 font-mono text-[10px] select-none flex items-center justify-between shadow-inner">
                  <span className="italic text-neutral-500 tracking-wider">Authorized Signature</span>
                  <span className="text-neutral-400">•••• ••••</span>
                </div>
                <div className="rounded-sm bg-white/95 px-3 py-1.5 font-mono text-xs font-bold text-neutral-900 shadow-sm">
                  <span className="text-[9px] block text-neutral-500 font-sans leading-none">CVV</span>
                  XXX
                </div>
              </div>

              {/* Hologram Badge & Security text */}
              <div className="mt-4 flex items-center justify-between">
                <div className="max-w-[200px] text-[8px] leading-relaxed text-zinc-400 font-mono">
                  This card is issued by Varenta Bank pursuant to license by World Elite. 24/7 Concierge: +1 (800) 555-VARENTA.
                </div>
                <div className="relative h-10 w-12 rounded-lg border border-amber-300/40 bg-gradient-to-tr from-amber-500/30 via-orange-400/40 to-yellow-300/30 p-1 flex items-center justify-center shadow-inner">
                  <Shield className="h-5 w-5 text-amber-300/90" />
                </div>
              </div>

              {/* Bottom security strip */}
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-2 text-[9px] text-zinc-500 font-mono">
                <span>FDIC INSURED • SECURE CHIP</span>
                <span className="text-amber-400/80">VARENTA ELITE 360</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 360° Controls Bar (Glassmorphic) */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 rounded-full border border-white/20 bg-background/60 px-4 py-2 text-xs backdrop-blur-xl shadow-glass">
        {/* Play / Pause 360 */}
        <button
          type="button"
          onClick={() => setIsRotating(!isRotating)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
          aria-label={isRotating ? "Pause 360 rotation" : "Start 360 rotation"}
        >
          {isRotating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          <span>{isRotating ? "Pause 360°" : "Play 360°"}</span>
        </button>

        {/* 180 Flip */}
        <button
          type="button"
          onClick={handleFlip180}
          className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-foreground hover:bg-accent transition-all"
          title="Flip to back or front"
        >
          <RotateCw className="h-3.5 w-3.5" />
          <span>Flip 180°</span>
        </button>

        {/* Speed toggle */}
        <div className="flex items-center gap-1 border-l border-border/50 pl-2">
          <span className="text-[10px] text-muted-foreground mr-1">Speed:</span>
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSpeed(s);
                setIsRotating(true);
              }}
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                speed === s && isRotating
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Toggle XXXXX Details */}
        <button
          type="button"
          onClick={() => setMaskLevel(maskLevel === "allX" ? "partial" : "allX")}
          className="inline-flex items-center gap-1 rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Toggle masked details"
        >
          {maskLevel === "allX" ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
          <span>{maskLevel === "allX" ? "Show: XXXXX" : "Show: Masked"}</span>
        </button>
      </div>

      {/* Manual 360 Degree Range Scrubber */}
      <div className="mt-3 flex w-full max-w-xs items-center gap-3 px-2">
        <span className="text-[10px] font-mono text-muted-foreground">0°</span>
        <input
          type="range"
          min="0"
          max="360"
          value={Math.round(manualAngle)}
          onMouseDown={() => setIsScrubbing(true)}
          onTouchStart={() => setIsScrubbing(true)}
          onMouseUp={() => setIsScrubbing(false)}
          onTouchEnd={() => setIsScrubbing(false)}
          onChange={(e) => {
            setManualAngle(Number(e.target.value));
          }}
          className="h-1.5 flex-1 cursor-ew-resize appearance-none rounded-lg bg-muted accent-primary"
          aria-label="Rotate card 360 degrees"
        />
        <span className="text-[10px] font-mono font-semibold text-primary">
          {Math.round(manualAngle)}°
        </span>
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Interactive 360° view: Drag slider, click card to pause, or toggle speed.
      </p>
    </div>
  );
}
