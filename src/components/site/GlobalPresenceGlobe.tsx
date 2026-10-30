import { useState, useEffect, useRef } from "react";
import { Globe2, ShieldCheck, MapPin, Activity, RotateCcw, Play, Pause, Sparkles, Building2 } from "lucide-react";
import earthTexture from "@/assets/earth-texture.jpg";

export interface OperatingCountry {
  id: string;
  name: string;
  city: string;
  flag: string;
  lat: number;
  lon: number;
  region: "Americas" | "Europe" | "Asia-Pacific" | "Middle East";
  license: string;
  currency: string;
  utcOffset: number; // hours offset from UTC
  branchType: "Flagship HQ" | "Financial Center" | "Regional Treasury" | "Private Banking";
}

// Exactly 21 Operating Hubs & Countries - STRICTLY EXCLUDING ALL AFRICAN NATIONS
export const OPERATING_COUNTRIES: OperatingCountry[] = [
  // Americas (3)
  { id: "us", name: "United States", city: "New York", flag: "🇺🇸", lat: 40.71, lon: -74.0, region: "Americas", license: "FDIC / OCC Member", currency: "USD", utcOffset: -4, branchType: "Flagship HQ" },
  { id: "ca", name: "Canada", city: "Toronto", flag: "🇨🇦", lat: 43.65, lon: -79.38, region: "Americas", license: "OSFI Regulated", currency: "CAD", utcOffset: -4, branchType: "Financial Center" },
  { id: "br", name: "Brazil", city: "São Paulo", flag: "🇧🇷", lat: -23.55, lon: -46.63, region: "Americas", license: "BACEN Authorized", currency: "BRL", utcOffset: -3, branchType: "Regional Treasury" },

  // Europe (11)
  { id: "gb", name: "United Kingdom", city: "London", flag: "🇬🇧", lat: 51.5, lon: -0.12, region: "Europe", license: "PRA & FCA Authorized", currency: "GBP", utcOffset: 1, branchType: "Financial Center" },
  { id: "ch", name: "Switzerland", city: "Zurich", flag: "🇨🇭", lat: 47.37, lon: 8.54, region: "Europe", license: "FINMA Regulated", currency: "CHF", utcOffset: 2, branchType: "Private Banking" },
  { id: "de", name: "Germany", city: "Frankfurt", flag: "🇩🇪", lat: 50.11, lon: 8.68, region: "Europe", license: "BaFin / ECB Supervised", currency: "EUR", utcOffset: 2, branchType: "Regional Treasury" },
  { id: "fr", name: "France", city: "Paris", flag: "🇫🇷", lat: 48.85, lon: 2.35, region: "Europe", license: "ACPR / Banque de France", currency: "EUR", utcOffset: 2, branchType: "Financial Center" },
  { id: "nl", name: "Netherlands", city: "Amsterdam", flag: "🇳🇱", lat: 52.36, lon: 4.9, region: "Europe", license: "DNB Regulated", currency: "EUR", utcOffset: 2, branchType: "Regional Treasury" },
  { id: "lu", name: "Luxembourg", city: "Luxembourg", flag: "🇱🇺", lat: 49.61, lon: 6.13, region: "Europe", license: "CSSF Regulated", currency: "EUR", utcOffset: 2, branchType: "Private Banking" },
  { id: "ie", name: "Ireland", city: "Dublin", flag: "🇮🇪", lat: 53.34, lon: -6.26, region: "Europe", license: "CBI Regulated", currency: "EUR", utcOffset: 1, branchType: "Financial Center" },
  { id: "se", name: "Sweden", city: "Stockholm", flag: "🇸🇪", lat: 59.32, lon: 18.06, region: "Europe", license: "Finansinspektionen", currency: "SEK", utcOffset: 2, branchType: "Regional Treasury" },
  { id: "no", name: "Norway", city: "Oslo", flag: "🇳🇴", lat: 59.91, lon: 10.75, region: "Europe", license: "Finanstilsynet", currency: "NOK", utcOffset: 2, branchType: "Private Banking" },
  { id: "es", name: "Spain", city: "Madrid", flag: "🇪🇸", lat: 40.41, lon: -3.7, region: "Europe", license: "Banco de España", currency: "EUR", utcOffset: 2, branchType: "Financial Center" },
  { id: "it", name: "Italy", city: "Milan", flag: "🇮🇹", lat: 45.46, lon: 9.19, region: "Europe", license: "Banca d'Italia", currency: "EUR", utcOffset: 2, branchType: "Private Banking" },

  // Middle East (1)
  { id: "ae", name: "United Arab Emirates", city: "Dubai", flag: "🇦🇪", lat: 25.2, lon: 55.27, region: "Middle East", license: "DFSA / CBUAE License", currency: "AED", utcOffset: 4, branchType: "Private Banking" },

  // Asia-Pacific (6)
  { id: "sg", name: "Singapore", city: "Singapore", flag: "🇸🇬", lat: 1.35, lon: 103.81, region: "Asia-Pacific", license: "MAS Authorized", currency: "SGD", utcOffset: 8, branchType: "Financial Center" },
  { id: "jp", name: "Japan", city: "Tokyo", flag: "🇯🇵", lat: 35.67, lon: 139.65, region: "Asia-Pacific", license: "JFSA Supervised", currency: "JPY", utcOffset: 9, branchType: "Regional Treasury" },
  { id: "hk", name: "Hong Kong", city: "Hong Kong", flag: "🇭🇰", lat: 22.31, lon: 114.16, region: "Asia-Pacific", license: "HKMA Licensed", currency: "HKD", utcOffset: 8, branchType: "Financial Center" },
  { id: "kr", name: "South Korea", city: "Seoul", flag: "🇰🇷", lat: 37.56, lon: 126.97, region: "Asia-Pacific", license: "FSC / FSS Approved", currency: "KRW", utcOffset: 9, branchType: "Regional Treasury" },
  { id: "au", name: "Australia", city: "Sydney", flag: "🇦🇺", lat: -33.86, lon: 151.2, region: "Asia-Pacific", license: "APRA Supervised", currency: "AUD", utcOffset: 11, branchType: "Financial Center" },
  { id: "nz", name: "New Zealand", city: "Auckland", flag: "🇳🇿", lat: -36.84, lon: 174.76, region: "Asia-Pacific", license: "RBNZ Registered", currency: "NZD", utcOffset: 13, branchType: "Private Banking" },
];

export function GlobalPresenceGlobe() {
  const [rotationLon, setRotationLon] = useState<number>(0);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [activeCountry, setActiveCountry] = useState<OperatingCountry>(OPERATING_COUNTRIES[0]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startDragX = useRef<number>(0);
  const startRotation = useRef<number>(0);

  // Auto rotation of Earth
  useEffect(() => {
    if (!isRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotationLon((prev) => (prev + 0.3) % 360);
    }, 35);
    return () => clearInterval(interval);
  }, [isRotating, isDragging]);

  // Touch and Mouse drag handlers for rotating the globe
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startDragX.current = e.clientX;
    startRotation.current = rotationLon;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startDragX.current;
    setRotationLon((startRotation.current - deltaX * 0.45) % 360);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startDragX.current = e.touches[0].clientX;
    startRotation.current = rotationLon;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startDragX.current;
    setRotationLon((startRotation.current - deltaX * 0.45) % 360);
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Focus and rotate directly to selected branch
  const focusCountry = (country: OperatingCountry) => {
    setActiveCountry(country);
    setRotationLon(country.lon);
  };

  // Globe dimensions
  const globeSize = 340; // px
  const radius = globeSize / 2;
  const cx = radius;
  const cy = radius;

  // Orthographic Projection math to locate branch pins on rotating sphere
  const projectPoint = (lat: number, lon: number) => {
    const phi = (lat * Math.PI) / 180;
    const lambda = ((lon - rotationLon) * Math.PI) / 180;
    const centerLat = 0.15; // subtle tilt

    const cosC =
      Math.sin(centerLat) * Math.sin(phi) +
      Math.cos(centerLat) * Math.cos(phi) * Math.cos(lambda);

    const isVisible = cosC > 0.05; // Visible on front facing side of Earth

    const x = cx + radius * 0.94 * Math.cos(phi) * Math.sin(lambda);
    const y =
      cy -
      radius *
        0.94 *
        (Math.cos(centerLat) * Math.sin(phi) -
          Math.sin(centerLat) * Math.cos(phi) * Math.cos(lambda));

    return { x, y, isVisible, depth: cosC };
  };

  const filteredCountries =
    activeFilter === "All"
      ? OPERATING_COUNTRIES
      : OPERATING_COUNTRIES.filter((c) => c.region === activeFilter);

  // Get current local time in country
  const getCountryTime = (offset: number) => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const target = new Date(utc + 3600000 * offset);
    return target.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Convert longitude rotation to background image horizontal percentage
  // Map longitude (-180 to +180) to background position 0% - 100%
  const normalizedLon = ((rotationLon % 360) + 360) % 360;
  const bgPositionX = `${(normalizedLon / 360) * 100}%`;

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-[2.5rem] border border-white/20 bg-background/50 p-6 backdrop-blur-2xl shadow-glass sm:p-8">
      {/* Top Banner with Stats & Exemption Notice */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span>21 Operating Jurisdictions • 0 African Operations</span>
          </div>
          <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
            Live <span className="text-gradient">Rotating Global Earth & Branches</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Realistic rotating satellite Earth with 21 active international branches pulsing across the globe.
          </p>
        </div>

        {/* Region Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          {["All", "Americas", "Europe", "Asia-Pacific", "Middle East"].map((reg) => (
            <button
              key={reg}
              type="button"
              onClick={() => setActiveFilter(reg)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                activeFilter === reg
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Presentation */}
      <div className="mt-8 grid items-center gap-8 lg:grid-cols-12">
        {/* ================= ACTUAL IMAGE OF ROTATING GLOBE ================= */}
        <div className="relative flex flex-col items-center justify-center lg:col-span-7">
          {/* Planetary Corona Atmosphere Aura */}
          <div className="pointer-events-none absolute h-80 w-80 rounded-full bg-gradient-to-tr from-sky-500/25 via-primary/30 to-amber-500/20 blur-3xl" />

          {/* Spherical Viewport */}
          <div
            className="relative h-[300px] w-[300px] sm:h-[350px] sm:w-[350px] cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            title="Drag horizontally to spin the Earth"
          >
            {/* 3D Atmospheric Outer Glow Ring */}
            <div className="pointer-events-none absolute -inset-2.5 rounded-full border border-sky-400/30 shadow-[0_0_40px_rgba(56,189,248,0.35)] animate-pulse" />

            {/* The Globe Sphere with Actual Earth Image Texture */}
            <div
              className="relative h-full w-full rounded-full overflow-hidden"
              style={{
                boxShadow:
                  "inset -45px -35px 70px rgba(0, 0, 0, 0.9), inset 25px 25px 50px rgba(255, 255, 255, 0.25), 0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              }}
            >
              {/* Rotating Earth Image Background */}
              <div
                className="absolute inset-0 h-full w-full bg-cover transition-none pointer-events-none"
                style={{
                  backgroundImage: `url(${earthTexture})`,
                  backgroundPosition: `${bgPositionX} center`,
                  backgroundRepeat: "repeat-x",
                  backgroundSize: "auto 100%",
                  transform: "scale(1.08)",
                }}
              />

              {/* Spherical Shading & Day/Night Terminator Overlays */}
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.85) 100%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(105deg, rgba(255,255,255,0.1) 0%, transparent 40%, rgba(2,6,23,0.7) 85%)",
                }}
              />

              {/* Subtle latitude/longitude glowing atmosphere grid */}
              <div className="pointer-events-none absolute inset-0 rounded-full border border-sky-400/20 mix-blend-screen" />

              {/* ================= 21 HIGHLIGHTED BRANCHES BLINKING ON GLOBE ================= */}
              <div className="absolute inset-0 pointer-events-auto">
                {OPERATING_COUNTRIES.map((country) => {
                  const pt = projectPoint(country.lat, country.lon);
                  if (!pt.isVisible) return null;

                  const isSelected = activeCountry.id === country.id;

                  // Normalize coordinates to percentage of sphere container
                  const leftPercent = (pt.x / globeSize) * 100;
                  const topPercent = (pt.y / globeSize) * 100;

                  return (
                    <div
                      key={country.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        focusCountry(country);
                      }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                      style={{
                        left: `${leftPercent}%`,
                        top: `${topPercent}%`,
                        opacity: Math.max(0.2, pt.depth),
                      }}
                      title={`${country.city}, ${country.name} (${country.branchType})`}
                    >
                      {/* Outer Blinking Radar Ping Wave */}
                      <span
                        className={`absolute -inset-2.5 rounded-full bg-orange-500 opacity-75 animate-ping ${
                          isSelected ? "duration-700" : "duration-1000"
                        }`}
                      />

                      {/* Secondary glowing radar ring */}
                      <span
                        className={`absolute -inset-1.5 rounded-full border ${
                          isSelected
                            ? "border-amber-300 bg-amber-400/30 scale-125"
                            : "border-orange-400 bg-orange-500/20"
                        }`}
                      />

                      {/* Center Beaming Branch Pin */}
                      <span
                        className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full border shadow-glow transition-transform group-hover:scale-125 ${
                          isSelected
                            ? "border-white bg-white shadow-lg ring-2 ring-amber-400"
                            : "border-amber-200 bg-orange-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isSelected ? "bg-orange-600" : "bg-white"
                          }`}
                        />
                      </span>

                      {/* Highlighted Branch City Label (visible for selected or on hover) */}
                      <div
                        className={`pointer-events-none absolute left-1/2 -top-8 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/30 bg-slate-950/90 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xl backdrop-blur-md transition-opacity duration-200 ${
                          isSelected
                            ? "opacity-100 ring-1 ring-orange-400 scale-105"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        <span className="mr-1">{country.flag}</span>
                        <span>{country.city}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Orbit Controls */}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-background/70 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md hover:bg-accent transition-all shadow-sm"
            >
              {isRotating ? (
                <Pause className="h-3.5 w-3.5 text-primary" />
              ) : (
                <Play className="h-3.5 w-3.5 text-primary" />
              )}
              <span>{isRotating ? "Pause Rotation" : "Resume Orbit"}</span>
            </button>

            <button
              type="button"
              onClick={() => setRotationLon((prev) => (prev + 45) % 360)}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-background/70 px-3.5 py-1.5 text-xs text-muted-foreground hover:text-foreground backdrop-blur-md transition-all shadow-sm"
              title="Rotate Earth eastward"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Rotate 45°</span>
            </button>

            <span className="text-[11px] text-muted-foreground hidden sm:inline font-mono">
              Longitude: {Math.round(normalizedLon)}°
            </span>
          </div>
        </div>

        {/* ================= HIGHLIGHTED BRANCH DETAILS CARD ================= */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* Active Highlighted Branch Card */}
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card/95 via-background/90 to-card/90 p-6 backdrop-blur-2xl shadow-xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none">{activeCountry.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-lg font-bold text-foreground">
                      {activeCountry.city} Branch
                    </h4>
                    <span className="rounded-full bg-primary/15 border border-primary/30 px-2 py-0.5 text-[9px] font-bold text-primary uppercase">
                      {activeCountry.branchType}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                    <MapPin className="h-3 w-3 text-primary" />
                    {activeCountry.name}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-foreground">
                  {getCountryTime(activeCountry.utcOffset)}
                </span>
                <span className="block text-[10px] text-muted-foreground font-mono">Hub Time</span>
              </div>
            </div>

            {/* Branch Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-3">
                <span className="text-[10px] uppercase text-muted-foreground font-mono">
                  Regulatory Authorization
                </span>
                <p className="mt-0.5 font-semibold text-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                  {activeCountry.license}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-muted/30 p-3">
                <span className="text-[10px] uppercase text-muted-foreground font-mono">
                  Direct Clearing
                </span>
                <p className="mt-0.5 font-semibold text-foreground flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  {activeCountry.currency} (RTGS / FedNow / SEPA)
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/10 p-3.5 text-xs text-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">
                  Active Varenta International Desk
                </span>
              </div>
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground shadow-sm">
                24/7 OPEN
              </span>
            </div>
          </div>

          {/* Quick Branch Directory (Click to highlight on globe) */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Highlight Any Branch (21 Total)
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {filteredCountries.length} Branches
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
              {filteredCountries.map((c) => {
                const isSelected = activeCountry.id === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => focusCountry(c)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold shadow-sm scale-105"
                        : "bg-background/80 border border-border/60 text-foreground/80 hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.city}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
