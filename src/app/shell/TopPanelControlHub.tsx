import { useState, useEffect, useRef } from "react";
import {
  User,
  Settings,
  Clock,
  Laptop,
  ChevronDown,
  Check,
} from "lucide-react";
import { ThemeLangToggle, TIMEZONE_IANA_MAP } from "../theme-lang-toggle";
import { ProfileMenu } from "../wira-settings";
import { ProgressiveBlurSettingControl } from "./ProgressiveBlurSettingControl";
import { LiquidGlassSettingControl } from "./LiquidGlassSettingControl";
import { ThemeColorPicker } from "./ThemeColorPicker";
import { LanguageToggle } from "./LanguageToggle";
import { getRaw, setRaw } from "../../core/rawStorage";

// Daftar Negara Lengkap (ISO 3 digit + Icon Bendera SVG dari flag-icons)
export interface CountryData {
  code: string;
  iso2: string;
  name: string;
  defaultCity: string;
  defaultTimezone: string;
}

export const COUNTRIES_DATA: CountryData[] = [
  // ASEAN
  { code: "IDN", iso2: "id", name: "Indonesia", defaultCity: "Jakarta", defaultTimezone: "UTC+07:00" },
  { code: "SGP", iso2: "sg", name: "Singapura", defaultCity: "Singapore", defaultTimezone: "UTC+08:00" },
  { code: "MYS", iso2: "my", name: "Malaysia", defaultCity: "Kuala Lumpur", defaultTimezone: "UTC+08:00" },
  { code: "THA", iso2: "th", name: "Thailand", defaultCity: "Bangkok", defaultTimezone: "UTC+07:00" },
  { code: "VNM", iso2: "vn", name: "Vietnam", defaultCity: "Hanoi", defaultTimezone: "UTC+07:00" },
  { code: "PHL", iso2: "ph", name: "Filipina", defaultCity: "Manila", defaultTimezone: "UTC+08:00" },
  { code: "BRN", iso2: "bn", name: "Brunei", defaultCity: "Bandar Seri Begawan", defaultTimezone: "UTC+08:00" },
  { code: "KHM", iso2: "kh", name: "Kamboja", defaultCity: "Phnom Penh", defaultTimezone: "UTC+07:00" },
  { code: "LAO", iso2: "la", name: "Laos", defaultCity: "Vientiane", defaultTimezone: "UTC+07:00" },
  { code: "MMR", iso2: "mm", name: "Myanmar", defaultCity: "Naypyidaw", defaultTimezone: "UTC+06:30" },
  { code: "TLS", iso2: "tl", name: "Timor-Leste", defaultCity: "Dili", defaultTimezone: "UTC+09:00" },

  // Asia Timur
  { code: "CHN", iso2: "cn", name: "China", defaultCity: "Beijing", defaultTimezone: "UTC+08:00" },
  { code: "KOR", iso2: "kr", name: "Korea Selatan", defaultCity: "Seoul", defaultTimezone: "UTC+09:00" },
  { code: "JPN", iso2: "jp", name: "Jepang", defaultCity: "Tokyo", defaultTimezone: "UTC+09:00" },

  // Eropa Maju
  { code: "DEU", iso2: "de", name: "Jerman", defaultCity: "Berlin", defaultTimezone: "UTC+01:00" },
  { code: "FRA", iso2: "fr", name: "Prancis", defaultCity: "Paris", defaultTimezone: "UTC+01:00" },
  { code: "CHE", iso2: "ch", name: "Swiss", defaultCity: "Zurich", defaultTimezone: "UTC+01:00" },
  { code: "NLD", iso2: "nl", name: "Belanda", defaultCity: "Amsterdam", defaultTimezone: "UTC+01:00" },
  { code: "SWE", iso2: "se", name: "Swedia", defaultCity: "Stockholm", defaultTimezone: "UTC+01:00" },
  { code: "NOR", iso2: "no", name: "Norwegia", defaultCity: "Oslo", defaultTimezone: "UTC+01:00" },
  { code: "DNK", iso2: "dk", name: "Denmark", defaultCity: "Copenhagen", defaultTimezone: "UTC+01:00" },
  { code: "FIN", iso2: "fi", name: "Finlandia", defaultCity: "Helsinki", defaultTimezone: "UTC+02:00" },
  { code: "AUT", iso2: "at", name: "Austria", defaultCity: "Vienna", defaultTimezone: "UTC+01:00" },
  { code: "BEL", iso2: "be", name: "Belgia", defaultCity: "Brussels", defaultTimezone: "UTC+01:00" },
  { code: "ITA", iso2: "it", name: "Italia", defaultCity: "Roma", defaultTimezone: "UTC+01:00" },
  { code: "ESP", iso2: "es", name: "Spanyol", defaultCity: "Madrid", defaultTimezone: "UTC+01:00" },
  { code: "GBR", iso2: "gb", name: "United Kingdom", defaultCity: "London", defaultTimezone: "UTC+00:00" },

  // Lainnya
  { code: "USA", iso2: "us", name: "United States", defaultCity: "New York", defaultTimezone: "UTC-05:00" },
  { code: "AUS", iso2: "au", name: "Australia", defaultCity: "Sydney", defaultTimezone: "UTC+10:00" },
];

interface TopPanelControlHubProps {
  onClose: () => void;
  onOpenSettings: (tab: string) => void;
}

export function TopPanelControlHub({
  onClose,
  onOpenSettings,
}: TopPanelControlHubProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Close country dropdown on click outside or escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(e.target as Node)
      ) {
        setIsCountryOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCountryOpen(false);
      }
    };
    if (isCountryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isCountryOpen]);

  // Region State
  const [country, setCountry] = useState<string>(() => {
    try {
      const stored = getRaw("aio_region_country") || "IDN";
      const legacyMap: Record<string, string> = {
        Indonesia: "IDN",
        Singapore: "SGP",
        Malaysia: "MYS",
        "United States": "USA",
        "United Kingdom": "GBR",
        Australia: "AUS",
        Japan: "JPN",
      };
      return legacyMap[stored] || stored || "IDN";
    } catch {
      return "IDN";
    }
  });

  const [city, setCity] = useState<string>(() => {
    try {
      return getRaw("aio_region_city") || "Jakarta";
    } catch {
      return "Jakarta";
    }
  });

  const [timezone, setTimezone] = useState<string>(() => {
    try {
      const stored = getRaw("aio_region_timezone") || "UTC+07:00";
      if (stored.includes("07:00")) return "UTC+07:00";
      if (stored.includes("08:00")) return "UTC+08:00";
      if (stored.includes("09:00")) return "UTC+09:00";
      if (stored.includes("06:30")) return "UTC+06:30";
      if (stored.includes("01:00")) return "UTC+01:00";
      if (stored.includes("02:00")) return "UTC+02:00";
      if (stored.includes("00:00")) return "UTC+00:00";
      if (stored.includes("10:00")) return "UTC+10:00";
      if (stored.includes("-05:00") || stored.includes("EST")) return "UTC-05:00";
      if (stored.includes("-08:00") || stored.includes("PST")) return "UTC-08:00";
      return stored || "UTC+07:00";
    } catch {
      return "UTC+07:00";
    }
  });

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const iana = TIMEZONE_IANA_MAP[timezone] || "Asia/Jakarta";
      try {
        const now = new Date();
        setCurrentTime(
          now.toLocaleTimeString("id-ID", {
            timeZone: iana,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      } catch {
        const now = new Date();
        setCurrentTime(
          now.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        );
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const handleCountryChange = (val: string) => {
    setCountry(val);
    try {
      setRaw("aio_region_country", val);
      const matched = COUNTRIES_DATA.find((c) => c.code === val);
      if (matched) {
        setCity(matched.defaultCity);
        setRaw("aio_region_city", matched.defaultCity);
        setTimezone(matched.defaultTimezone);
        setRaw("aio_region_timezone", matched.defaultTimezone);
      }
    } catch {}
  };

  const handleCityChange = (val: string) => {
    setCity(val);
    try {
      setRaw("aio_region_city", val);
    } catch {}
  };

  const handleTimezoneChange = (val: string) => {
    setTimezone(val);
    try {
      setRaw("aio_region_timezone", val);
    } catch {}
  };

  const currentCountry =
    COUNTRIES_DATA.find((c) => c.code === country) || COUNTRIES_DATA[0];

  return (
    <div
      className="w-full flex flex-col relative z-10"
      style={{ backgroundColor: "hsl(var(--primary))" }}
    >
      {/* Grid Konten 4 Kolom: Akun, Tema & Bahasa, Region, Client OS Info */}
      <div
        className="overflow-y-auto overflow-x-hidden p-4 sm:p-5 no-scrollbar scrollbar-none"
        style={{ backgroundColor: "hsl(var(--primary))", scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="max-w-[1500px] w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch min-w-0">
          {/* Kolom 1: Akun & Profil Pengguna */}
          <div className="liquid-glass-card min-w-0 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-white/50 dark:border-slate-800/80 overflow-hidden text-slate-900 dark:text-slate-100 transition-transform duration-200 hover:-translate-y-0.5 flex flex-col justify-center">
            <div className="card-content text-slate-900 dark:text-slate-100 flex flex-col justify-center flex-1 h-full">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="glass-button flex-1 whitespace-nowrap text-xs font-semibold py-2 px-3 min-w-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
                >
                  <User className="size-4 shrink-0 text-slate-700 dark:text-slate-300" />
                  <span>Menu Profil</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    onOpenSettings("general");
                  }}
                  className="glass-button size-9 p-0 shrink-0 aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs cursor-pointer"
                  title="Buka Pengaturan"
                  aria-label="Pengaturan"
                >
                  <Settings className="size-4 shrink-0 text-slate-700 dark:text-slate-300" />
                </button>
              </div>

              <div className="relative">
                {/* Profile Menu Popup */}
                <ProfileMenu
                  isOpen={isProfileOpen}
                  onClose={() => setIsProfileOpen(false)}
                  onOpenSettings={(tab) => {
                    setIsProfileOpen(false);
                    onOpenSettings(tab);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Kolom 2: Pengaturan Visual & Efek */}
          <div className="liquid-glass-card min-w-0 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-white/50 dark:border-slate-800/80 overflow-hidden text-slate-900 dark:text-slate-100 transition-transform duration-200 hover:-translate-y-0.5 flex flex-col">
            <div className="card-content text-slate-900 dark:text-slate-100 flex flex-col justify-center flex-1 h-full">
              <div className="flex flex-col gap-2 text-left w-full">
                <ThemeColorPicker />
                <ProgressiveBlurSettingControl />
                <LiquidGlassSettingControl />
              </div>
            </div>
          </div>

          {/* Kolom 3: Wilayah & Preferensi Waktu */}
          <div className="liquid-glass-card min-w-0 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-white/50 dark:border-slate-800/80 overflow-hidden text-slate-900 dark:text-slate-100 transition-transform duration-200 hover:-translate-y-0.5 flex flex-col justify-between">
            <div className="card-content text-slate-900 dark:text-slate-100 flex flex-col gap-2.5 text-left w-full h-full">
              {/* Baris Atas: Jam Digital (Kiri) & Pilihan Negara (Kanan) */}
              <div className="flex items-center justify-between gap-2 w-full">
                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800 shadow-2xs shrink-0">
                  <Clock className="size-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  <span className="tracking-wide">{currentTime || "--:--:--"}</span>
                </div>

                {/* Dropdown Negara Custom dengan Flag-Icons SVG */}
                <div className="relative" ref={countryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs transition-all focus:outline-none focus:ring-1 focus:ring-primary"
                    title={`Pilih Negara (${currentCountry.code} - ${currentCountry.name})`}
                    aria-label="Pilih Negara"
                    aria-expanded={isCountryOpen}
                  >
                    <span className={`fi fi-${currentCountry.iso2} rounded-2xs shadow-2xs text-[13px] leading-none shrink-0`} />
                    <span className="font-mono font-bold tracking-tight text-xs">{currentCountry.code}</span>
                    <ChevronDown className={`size-3 text-slate-400 transition-transform duration-150 ${isCountryOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isCountryOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-48 max-h-56 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 p-1 no-scrollbar animate-in fade-in-50 zoom-in-95 duration-100">
                      <div className="space-y-0.5">
                        {COUNTRIES_DATA.map((c) => {
                          const isSelected = c.code === country;
                          return (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                handleCountryChange(c.code);
                                setIsCountryOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
                                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span className={`fi fi-${c.iso2} rounded-2xs shadow-2xs text-[14px] leading-none shrink-0`} />
                                <span className="font-mono font-bold text-xs">{c.code}</span>
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{c.name}</span>
                              </div>
                              {isSelected && <Check className="size-3.5 text-primary shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Lokasi: Kota (Lebar fleksibel) & Zona Waktu (Dipendekkan ringkas) */}
              <div className="flex items-center gap-2 w-full">
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5">
                    Kota
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    placeholder="Jakarta"
                    className="w-full px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-xs font-medium text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:border-primary"
                  />
                </div>

                <div className="w-auto shrink-0">
                  <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-0.5">
                    Zona Waktu
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => handleTimezoneChange(e.target.value)}
                    className="w-auto min-w-[104px] px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer focus:bg-white dark:focus:bg-slate-800 focus:border-primary shadow-2xs"
                  >
                    <option value="UTC-08:00">UTC-08:00</option>
                    <option value="UTC-05:00">UTC-05:00</option>
                    <option value="UTC+00:00">UTC+00:00</option>
                    <option value="UTC+01:00">UTC+01:00</option>
                    <option value="UTC+02:00">UTC+02:00</option>
                    <option value="UTC+06:30">UTC+06:30</option>
                    <option value="UTC+07:00">UTC+07:00</option>
                    <option value="UTC+08:00">UTC+08:00</option>
                    <option value="UTC+09:00">UTC+09:00</option>
                    <option value="UTC+10:00">UTC+10:00</option>
                  </select>
                </div>
              </div>

              {/* Mode Tema & Bahasa */}
              <ThemeLangToggle
                timezone={timezone}
                className="mt-0.5"
              />

              <LanguageToggle
                className="mt-0.5"
              />
            </div>
          </div>

          {/* Kolom 4: Informasi Versi & Status Sistem */}
          <div className="liquid-glass-card min-w-0 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-white/50 dark:border-slate-800/80 overflow-hidden text-slate-900 dark:text-slate-100 transition-transform duration-200 hover:-translate-y-0.5">
            <div className="card-content text-slate-900 dark:text-slate-100">
              <div className="card-header">
                <div className="user-info">
                  <div className="avatar bg-cyan-50 dark:bg-cyan-950/60 border-2 border-cyan-500">
                    <Laptop className="avatar-icon text-cyan-500" />
                  </div>
                  <div className="user-details">
                    <p className="user-name text-slate-900 dark:text-slate-100 font-bold">Client OS</p>
                    <p className="user-role text-slate-500 dark:text-slate-400 text-xs">v2.4.2 · Production</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_2px_rgba(16,185,129,0.15)] animate-pulse" />
                  Aktif
                </span>
              </div>

              <div className="card-body text-left">
                <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-left shadow-2xs">
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>Versi Rilis</span>
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">2026.09-stable</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>Platform</span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">React 19 + Vite</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-700 dark:text-slate-300">
                    <span>Sinkronisasi</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Terverifikasi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopPanelControlHub;
