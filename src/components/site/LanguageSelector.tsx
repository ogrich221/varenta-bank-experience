import { useState, useRef, useEffect } from "react";
import { Globe, Check, Search, ChevronDown, X } from "lucide-react";

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  region: string;
}

export const LANGUAGES: Language[] = [
  { code: "en-US", name: "English (US)", nativeName: "English (US)", flag: "🇺🇸", region: "North America" },
  { code: "en-GB", name: "English (UK)", nativeName: "English (UK)", flag: "🇬🇧", region: "Europe" },
  { code: "de-DE", name: "German", nativeName: "Deutsch", flag: "🇩🇪", region: "Europe" },
  { code: "fr-FR", name: "French", nativeName: "Français", flag: "🇫🇷", region: "Europe" },
  { code: "es-ES", name: "Spanish", nativeName: "Español", flag: "🇪🇸", region: "Europe / Americas" },
  { code: "it-IT", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", region: "Europe" },
  { code: "pt-BR", name: "Portuguese (BR)", nativeName: "Português", flag: "🇧🇷", region: "South America" },
  { code: "nl-NL", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", region: "Europe" },
  { code: "sv-SE", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", region: "Europe" },
  { code: "no-NO", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴", region: "Europe" },
  { code: "ja-JP", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", region: "Asia Pacific" },
  { code: "ko-KR", name: "Korean", nativeName: "한국어", flag: "🇰🇷", region: "Asia Pacific" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳", region: "Asia Pacific" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "繁體中文", flag: "🇹🇼", region: "Asia Pacific" },
  { code: "ar-AE", name: "Arabic", nativeName: "العربية", flag: "🇦🇪", region: "Middle East" },
  { code: "he-IL", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", region: "Middle East" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", region: "Asia" },
  { code: "pl-PL", name: "Polish", nativeName: "Polski", flag: "🇵🇱", region: "Europe" },
  { code: "tr-TR", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", region: "Europe / Eurasia" },
  { code: "da-DK", name: "Danish", nativeName: "Dansk", flag: "🇩🇰", region: "Europe" },
  { code: "fi-FI", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮", region: "Europe" },
  { code: "vi-VN", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", region: "Asia Pacific" },
  { code: "id-ID", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", region: "Asia Pacific" },
  { code: "en-AU", name: "English (Australia)", nativeName: "English (AU)", flag: "🇦🇺", region: "Oceania" },
];

export function LanguageSelector({ variant = "header" }: { variant?: "header" | "standalone" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]!);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved language on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("varenta_selected_language");
      if (saved) {
        const found = LANGUAGES.find((l) => l.code === saved);
        if (found) setSelectedLang(found);
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Auto-focus search input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (lang: Language) => {
    setSelectedLang(lang);
    try {
      localStorage.setItem("varenta_selected_language", lang.code);
    } catch {
      // ignore
    }
    setIsOpen(false);
    setSearch("");
  };

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.region.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`Select language. Currently selected: ${selectedLang.name}`}
        className={`group inline-flex items-center gap-2 rounded-full border border-white/20 bg-background/70 px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all hover:border-primary/50 hover:bg-background/90 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          variant === "header" ? "shadow-sm" : "shadow-md"
        }`}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Globe className="h-3.5 w-3.5" />
        </span>
        <span className="text-base leading-none">{selectedLang.flag}</span>
        <span className="hidden text-foreground font-medium sm:inline">{selectedLang.name}</span>
        <span className="text-foreground font-medium sm:hidden">{selectedLang.code.split("-")[0]!.toUpperCase()}</span>
        <ChevronDown
          className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Language selection menu"
          className="fixed inset-x-4 top-20 z-50 mx-auto max-w-sm rounded-3xl border border-white/25 bg-background/95 p-4 shadow-2xl backdrop-blur-xl sm:absolute sm:inset-auto sm:left-0 sm:top-full sm:mt-2 sm:w-80 sm:p-3 animate-rise"
        >
          <div className="mb-2 flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Choose Language
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Close language selector"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Search box */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language or region..."
              className="w-full rounded-xl border border-border/60 bg-muted/40 py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Languages list */}
          <div className="max-h-64 overflow-y-auto space-y-1 pr-1 overscroll-contain">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => {
                const isSelected = selectedLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "hover:bg-accent hover:text-foreground text-foreground/90"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base leading-none">{lang.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium">{lang.name}</span>
                          <span className={`text-[10px] ${isSelected ? "text-primary-foreground/75" : "text-muted-foreground"}`}>
                            ({lang.nativeName})
                          </span>
                        </div>
                        <span className={`text-[10px] block ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground/80"}`}>
                          {lang.region}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No languages found matching "{search}"
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t border-border/40 text-[11px] text-muted-foreground text-center">
            Currently active: <span className="font-semibold text-foreground">{selectedLang.name}</span>
          </div>
        </div>
      )}
    </div>
  );
}
