import { useState, useEffect, useRef } from "react";
import { Globe2, ShieldCheck, MapPin, Activity, RotateCcw, Play, Pause } from "lucide-react";

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
}

// Exactly 21 Countries - EXCLUDING ALL AFRICAN COUNTRIES
export const OPERATING_COUNTRIES: OperatingCountry[] = [
  // Americas (3)
  { id: "us", name: "United States", city: "New York", flag: "🇺🇸", lat: 40.71, lon: -74.0, region: "Americas", license: "FDIC / OCC Member", currency: "USD", utcOffset: -4 },
  { id: "ca", name: "Canada", city: "Toronto", flag: "🇨🇦", lat: 43.65, lon: -79.38, region: "Americas", license: "OSFI Regulated", currency: "CAD", utcOffset: -4 },
  { id: "br", name: "Brazil", city: "São Paulo", flag: "🇧🇷", lat: -23.55, lon: -46.63, region: "Americas", license: "BACEN Authorized", currency: "BRL", utcOffset: -3 },

  // Europe (11)
  { id: "gb", name: "United Kingdom", city: "London", flag: "🇬🇧", lat: 51.5, lon: -0.12, region: "Europe", license: "PRA & FCA Authorized", currency: "GBP", utcOffset: 1 },
  { id: "ch", name: "Switzerland", city: "Zurich", flag: "🇨🇭", lat: 47.37, lon: 8.54, region: "Europe", license: "FINMA Regulated", currency: "CHF", utcOffset: 2 },
  { id: "de", name: "Germany", city: "Frankfurt", flag: "🇩🇪", lat: 50.11, lon: 8.68, region: "Europe", license: "BaFin / ECB Supervised", currency: "EUR", utcOffset: 2 },
  { id: "fr", name: "France", city: "Paris", flag: "🇫🇷", lat: 48.85, lon: 2.35, region: "Europe", license: "ACPR / Banque de France", currency: "EUR", utcOffset: 2 },
  { id: "nl", name: "Netherlands", city: "Amsterdam", flag: "🇳🇱", lat: 52.36, lon: 4.9, region: "Europe", license: "DNB Regulated", currency: "EUR", utcOffset: 2 },
  { id: "lu", name: "Luxembourg", city: "Luxembourg City", flag: "🇱🇺", lat: 49.61, lon: 6.13, region: "Europe", license: "CSSF Regulated", currency: "EUR", utcOffset: 2 },
  { id: "ie", name: "Ireland", city: "Dublin", flag: "🇮🇪", lat: 53.34, lon: -6.26, region: "Europe", license: "CBI Regulated", currency: "EUR", utcOffset: 1 },
  { id: "se", name: "Sweden", city: "Stockholm", flag: "🇸🇪", lat: 59.32, lon: 18.06, region: "Europe", license: "Finansinspektionen", currency: "SEK", utcOffset: 2 },
  { id: "no", name: "Norway", city: "Oslo", flag: "🇳🇴", lat: 59.91, lon: 10.75, region: "Europe", license: "Finanstilsynet", currency: "NOK", utcOffset: 2 },
  { id: "es", name: "Spain", city: "Madrid", flag: "🇪🇸", lat: 40.41, lon: -3.7, region: "Europe", license: "Banco de España", currency: "EUR", utcOffset: 2 },
  { id: "it", name: "Italy", city: "Milan", flag: "🇮🇹", lat: 45.46, lon: 9.19, region: "Europe", license: "Banca d'Italia", currency: "EUR", utcOffset: 2 },

  // Middle East (1)
  { id: "ae", name: "United Arab Emirates", city: "Dubai", flag: "🇦🇪", lat: 25.2, lon: 55.27, region: "Middle East", license: "DFSA / CBUAE License", currency: "AED", utcOffset: 4 },

  // Asia-Pacific (6)
  { id: "sg", name: "Singapore", city: "Singapore", flag: "🇸🇬", lat: 1.35, lon: 103.81, region: "Asia-Pacific", license: "MAS Authorized", currency: "SGD", utcOffset: 8 },
  { id: "jp", name: "Japan", city: "Tokyo", flag: "🇯🇵", lat: 35.67, lon: 139.65, region: "Asia-Pacific", license: "JFSA Supervised", currency: "JPY", utcOffset: 9 },
  { id: "hk", name: "Hong Kong", city: "Hong Kong", flag: "🇭🇰", lat: 22.31, lon: 114.16, region: "Asia-Pacific", license: "HKMA Licensed", currency: "HKD", utcOffset: 8 },
  { id: "kr", name: "South Korea", city: "Seoul", flag: "🇰🇷", lat: 37.56, lon: 126.97, region: "Asia-Pacific", license: "FSC / FSS Approved", currency: "KRW", utcOffset: 9 },
  { id: "au", name: "Australia", city: "Sydney", flag: "🇦🇺", lat: -33.86, lon: 151.2, region: "Asia-Pacific", license: "APRA Supervised", currency: "AUD", utcOffset: 11 },
  { id: "nz", name: "New Zealand", city: "Auckland", flag: "🇳🇿", lat: -36.84, lon: 174.76, region: "Asia-Pacific", license: "RBNZ Registered", currency: "NZD", utcOffset: 13 },
];

export function GlobalPresenceGlobe() {
  const [rotationLon, setRotationLon] = useState<number>(10);
  const [isRotating, setIsRotating] = useState<boolean>(true);
  const [activeCountry, setActiveCountry] = useState<OperatingCountry>(OPERATING_COUNTRIES[0]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const startDragX = useRef<number>(0);
  const startRotation = useRef<number>(0);

  // Auto rotation
  useEffect(() => {
    if (!isRotating || isDragging) return;
    const interval = setInterval(() => {
      setRotationLon((prev) => (prev + 0.35) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isRotating, isDragging]);

  // Touch and Drag handlers for interactive rotation
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

  // Focus on a specific country
  const focusCountry = (country: OperatingCountry) => {
    setActiveCountry(country);
    setRotationLon(country.lon);
  };

  // Orthographic Projection math
  const sphereRadius = 140; // Base radius in SVG units
  const cx = 175;
  const cy = 175;

  // Calculate projected 2D coordinates on rotating sphere
  const projectPoint = (lat: number, lon: number) => {
    const phi = (lat * Math.PI) / 180;
    const lambda = ((lon - rotationLon) * Math.PI) / 180;
    const centerLat = 0.2; // slight tilt forward

    const cosC =
      Math.sin(centerLat) * Math.sin(phi) +
      Math.cos(centerLat) * Math.cos(phi) * Math.cos(lambda);

    const isVisible = cosC > 0.05; // Visible on front face of sphere

    const x = cx + sphereRadius * Math.cos(phi) * Math.sin(lambda);
    const y =
      cy -
      sphereRadius *
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

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-[2.5rem] border border-white/20 bg-background/50 p-6 backdrop-blur-2xl shadow-glass sm:p-8">
      {/* Top Banner with Stats & Africa Exemption Notice */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            21 Active Operating Nations
          </div>
          <h3 className="mt-2 text-2xl font-bold sm:text-3xl">
            Varenta <span className="text-gradient">Global Financial Network</span>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Continuous 24/7 treasury & liquidity clearing across 21 authorized international jurisdictions (excluding Africa).
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

      {/* Main Interactive Grid */}
      <div className="mt-8 grid items-center gap-8 lg:grid-cols-12">
        {/* Globe Visualization (Interactive Canvas/SVG) */}
        <div className="relative flex flex-col items-center justify-center lg:col-span-7">
          {/* Ambient Globe Glow */}
          <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

          {/* SVG Rotating Orthographic Globe */}
          <div
            className="relative h-[320px] w-[320px] sm:h-[350px] sm:w-[350px] cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            title="Drag horizontally to spin globe"
          >
            <svg
              viewBox="0 0 350 350"
              className="h-full w-full drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
            >
              <defs>
                {/* Radial Globe Gradient */}
                <radialGradient id="globeGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#0f172a" />
                  <stop offset="100%" stopColor="#020617" />
                </radialGradient>

                {/* Atmosphere Rim Light */}
                <radialGradient id="atmosphereGlow" cx="40%" cy="35%" r="65%">
                  <stop offset="85%" stopColor="transparent" />
                  <stop offset="97%" stopColor="#f97316" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#fb923c" stopOpacity="0.8" />
                </radialGradient>
              </defs>

              {/* Outer Atmosphere Glow Ring */}
              <circle
                cx={cx}
                cy={cy}
                r={sphereRadius + 14}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-primary/20"
                strokeDasharray="4 6"
              />

              {/* Globe Base Sphere */}
              <circle
                cx={cx}
                cy={cy}
                r={sphereRadius}
                fill="url(#globeGrad)"
                stroke="#f97316"
                strokeOpacity="0.3"
                strokeWidth="1.5"
              />

              {/* Atmosphere Glow Overlay */}
              <circle cx={cx} cy={cy} r={sphereRadius} fill="url(#atmosphereGlow)" />

              {/* Meridian / Latitude Rings (3D Illusion) */}
              {[-60, -30, 0, 30, 60].map((lat) => {
                const yPos = cy - (lat / 90) * (sphereRadius * 0.85);
                const rLat = Math.sqrt(Math.max(0, sphereRadius ** 2 - (yPos - cy) ** 2));
                return (
                  <ellipse
                    key={lat}
                    cx={cx}
                    cy={yPos}
                    rx={rLat}
                    ry={rLat * 0.28}
                    fill="none"
                    stroke="#38bdf8"
                    strokeOpacity="0.12"
                    strokeWidth="0.8"
                  />
                );
              })}

              {/* Longitudinal Curves (Rotating with rotationLon) */}
              {[0, 60, 120, 180, 240, 300].map((baseLon) => {
                const angle = ((baseLon - rotationLon) * Math.PI) / 180;
                const rx = sphereRadius * Math.abs(Math.sin(angle));
                const isBack = Math.cos(angle) < 0;
                return (
                  <ellipse
                    key={baseLon}
                    cx={cx}
                    cy={cy}
                    rx={Math.max(2, rx)}
                    ry={sphereRadius}
                    fill="none"
                    stroke="#fb923c"
                    strokeOpacity={isBack ? "0.05" : "0.15"}
                    strokeWidth="0.7"
                  />
                );
              })}

              {/* 21 BLINKING COUNTRY RADAR BEACONS */}
              {OPERATING_COUNTRIES.map((country) => {
                const pt = projectPoint(country.lat, country.lon);
                if (!pt.isVisible) return null;

                const isSelected = activeCountry.id === country.id;

                return (
                  <g
                    key={country.id}
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={(e) => {
                      e.stopPropagation();
                      focusCountry(country);
                    }}
                  >
                    {/* Outer Blinking Radar Waves (Continuous Pulse) */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 16 : 10}
                      fill="none"
                      stroke="#f97316"
                      strokeWidth={isSelected ? 1.5 : 1}
                      opacity={pt.depth}
                      className="animate-ping"
                      style={{ animationDuration: isSelected ? "1.2s" : "2s" }}
                    />

                    {/* Secondary expansion ring */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 10 : 6}
                      fill="#ea580c"
                      fillOpacity={0.25 * pt.depth}
                      stroke="#fb923c"
                      strokeWidth="1"
                    />

                    {/* Solid Center Beaming Dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? 4.5 : 3}
                      fill={isSelected ? "#ffffff" : "#f97316"}
                      stroke="#fbbf24"
                      strokeWidth={isSelected ? 1.5 : 0.8}
                    />

                    {/* Country Code Pill for selected or hovered */}
                    {isSelected && (
                      <g transform={`translate(${pt.x + 8}, ${pt.y - 10})`}>
                        <rect
                          width="38"
                          height="18"
                          rx="9"
                          fill="#0f172a"
                          stroke="#f97316"
                          strokeWidth="1"
                          opacity="0.9"
                        />
                        <text
                          x="19"
                          y="13"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {country.flag}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Interactive Globe Control Bar */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsRotating(!isRotating)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-background/60 px-3 py-1.5 text-xs font-semibold backdrop-blur-md hover:bg-accent transition-colors"
            >
              {isRotating ? <Pause className="h-3 w-3 text-primary" /> : <Play className="h-3 w-3 text-primary" />}
              <span>{isRotating ? "Pause Orbit" : "Auto Orbit"}</span>
            </button>

            <button
              type="button"
              onClick={() => setRotationLon((prev) => (prev + 45) % 360)}
              className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground backdrop-blur-md"
              title="Rotate 45 degrees east"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Rotate 45°</span>
            </button>

            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Drag globe to spin
            </span>
          </div>
        </div>

        {/* Selected Hub Details Card & Regional Directory */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* Active Operating Hub Detail Card */}
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card/90 to-background/80 p-6 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl leading-none">{activeCountry.flag}</span>
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">
                    {activeCountry.name}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                    <MapPin className="h-3 w-3" />
                    {activeCountry.city} Hub
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-semibold text-foreground">
                  {getCountryTime(activeCountry.utcOffset)}
                </span>
                <span className="block text-[10px] text-muted-foreground">Local Hub Time</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-border/50 bg-muted/30 p-3">
                <span className="text-[10px] uppercase text-muted-foreground font-mono">
                  Regulatory License
                </span>
                <p className="mt-0.5 font-semibold text-foreground flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-500" />
                  {activeCountry.license}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-muted/30 p-3">
                <span className="text-[10px] uppercase text-muted-foreground font-mono">
                  Primary Currency
                </span>
                <p className="mt-0.5 font-semibold text-foreground flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  {activeCountry.currency} (Direct SEPA/RTGS)
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-primary/10 p-3 text-xs text-primary-foreground flex items-center justify-between">
              <span className="text-primary font-medium">
                Real-Time Settlement & Swift Gateway
              </span>
              <span className="rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                ONLINE 24/7
              </span>
            </div>
          </div>

          {/* Quick Country Selector Grid (Scrollable pills) */}
          <div>
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                All 21 Hubs (Tap to Focus)
              </span>
              <span className="text-[11px] text-muted-foreground font-mono">
                {filteredCountries.length} Available
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
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
