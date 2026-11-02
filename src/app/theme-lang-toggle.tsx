import { useState, useEffect, useCallback } from "react";
import { Sun, Moon, Clock } from "lucide-react";
import { getRaw, setRaw } from "../core/rawStorage";

export type ThemePreference = "light" | "dark" | "auto";

export const TIMEZONE_IANA_MAP: Record<string, string> = {
  // Format ringkas: hanya UTC dan angka
  "UTC-08:00": "America/Los_Angeles",
  "UTC-05:00": "America/New_York",
  "UTC+00:00": "UTC",
  "UTC+01:00": "Europe/Berlin",
  "UTC+02:00": "Europe/Helsinki",
  "UTC+06:30": "Asia/Yangon",
  "UTC+07:00": "Asia/Jakarta",
  "UTC+08:00": "Asia/Singapore",
  "UTC+09:00": "Asia/Tokyo",
  "UTC+10:00": "Australia/Sydney",

  // Backward compatibility
  "(UTC+07:00) WIB": "Asia/Jakarta",
  "(UTC+08:00) WITA": "Asia/Makassar",
  "(UTC+09:00) WIT": "Asia/Jayapura",
  "(UTC+08:00) SGT": "Asia/Singapore",
  "(UTC+08:00) MYT": "Asia/Kuala_Lumpur",
  "(UTC+07:00) ICT": "Asia/Bangkok",
  "(UTC+08:00) PHT": "Asia/Manila",
  "(UTC+08:00) BNT": "Asia/Brunei",
  "(UTC+06:30) MMT": "Asia/Yangon",
  "(UTC+09:00) TLT": "Asia/Dili",
  "(UTC+08:00) CST": "Asia/Shanghai",
  "(UTC+09:00) KST": "Asia/Seoul",
  "(UTC+09:00) JST": "Asia/Tokyo",
  "(UTC+01:00) CET": "Europe/Berlin",
  "(UTC+02:00) EET": "Europe/Helsinki",
  "(UTC+00:00) GMT": "Europe/London",
  "(UTC+00:00) UTC": "UTC",
  "(UTC+10:00) AEST": "Australia/Sydney",
  "(UTC-05:00) EST": "America/New_York",
  "(UTC-08:00) PST": "America/Los_Angeles",
};

export function isDayTimeInTimezone(timezoneString: string): {
  isDay: boolean;
  hours: number;
  minutes: number;
  timeFormatted: string;
} {
  const iana = TIMEZONE_IANA_MAP[timezoneString] || "Asia/Jakarta";
  const now = new Date();

  try {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: iana,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const hourPart = parts.find((p) => p.type === "hour")?.value ?? "0";
    const minutePart = parts.find((p) => p.type === "minute")?.value ?? "0";

    const hours = parseInt(hourPart, 10);
    const minutes = parseInt(minutePart, 10);
    const totalMinutes = hours * 60 + minutes;

    // Batas jam 05:31 pagi = Terang (5 * 60 + 31 = 331)
    // Sampai jam 17:31 petang = Kembali Gelap (17 * 60 + 31 = 1051)
    // Rentang .30 ke atas ketemu .30 ke atas: 05:31 <= totalMinutes < 1051
    const isDay = totalMinutes >= 331 && totalMinutes < 1051;
    const timeFormatted = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    return { isDay, hours, minutes, timeFormatted };
  } catch {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const isDay = totalMinutes >= 331 && totalMinutes < 1051;
    return {
      isDay,
      hours,
      minutes,
      timeFormatted: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
    };
  }
}

interface ThemeLangToggleProps {
  timezone?: string;
  className?: string;
}

export function ThemeLangToggle({ timezone = "(UTC+07:00) WIB", className = "" }: ThemeLangToggleProps) {
  const [themePref, setThemePref] = useState<ThemePreference>(() => {
    if (typeof window !== "undefined") {
      const stored = getRaw("aio_theme_preference");
      if (stored === "light" || stored === "dark" || stored === "auto") {
        return stored;
      }
      // Fallback: jika aio_theme sudah ada, pakai itu, selainnya auto
      const legacyTheme = getRaw("aio_theme");
      if (legacyTheme === "dark") return "dark";
      if (legacyTheme === "light") return "light";
    }
    return "auto";
  });

  const [autoStatus, setAutoStatus] = useState<{ isDay: boolean; timeFormatted: string }>({
    isDay: true,
    timeFormatted: "12:00",
  });

  const evaluateAndApplyTheme = useCallback(() => {
    if (typeof document === "undefined") return;

    if (themePref === "dark") {
      document.documentElement.classList.add("dark");
      setRaw("aio_theme", "dark");
    } else if (themePref === "light") {
      document.documentElement.classList.remove("dark");
      setRaw("aio_theme", "light");
    } else {
      // "auto" mode berdasarkan zona waktu (05:31 - 17:31)
      const { isDay, timeFormatted } = isDayTimeInTimezone(timezone);
      setAutoStatus({ isDay, timeFormatted });

      if (isDay) {
        document.documentElement.classList.remove("dark");
        setRaw("aio_theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        setRaw("aio_theme", "dark");
      }
    }
  }, [themePref, timezone]);

  useEffect(() => {
    evaluateAndApplyTheme();
    setRaw("aio_theme_preference", themePref);

    // Update setiap 10 detik agar pergantian jam 05:31 atau 17:31 langsung terdeteksi
    const interval = setInterval(evaluateAndApplyTheme, 10000);
    return () => clearInterval(interval);
  }, [themePref, timezone, evaluateAndApplyTheme]);

  const themeOptions: { id: ThemePreference; label: string; icon: typeof Sun }[] = [
    { id: "light", label: "Terang", icon: Sun },
    { id: "dark", label: "Gelap", icon: Moon },
    { id: "auto", label: "Auto Waktu", icon: Clock },
  ];

  const CurrentIcon = themePref === "light" ? Sun : themePref === "dark" ? Moon : Clock;

  return (
    <div className={`select-none ${className}`}>
      {/* Mode Tema: Gaya sama persis dengan Bahasa UI (Kecil, Icon-only) */}
      <div className="flex items-center justify-between text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-1.5 shrink-0">
          <CurrentIcon className="size-3.5 text-primary shrink-0" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            Mode Tema
          </span>
          {themePref === "auto" && (
            <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              {autoStatus.isDay ? "Siang" : "Malam"}
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
          {themeOptions.map((opt) => {
            const isSelected = themePref === opt.id;
            const Icon = opt.icon;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setThemePref(opt.id)}
                className={`p-1 rounded-md cursor-pointer transition-all ${
                  isSelected
                    ? "bg-white dark:bg-slate-700 shadow-2xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50"
                }`}
                title={
                  opt.id === "auto"
                    ? `Auto Waktu (${autoStatus.isDay ? "Siang · Terang" : "Malam · Gelap"})`
                    : `Mode ${opt.label}`
                }
                aria-label={`Pilih Mode ${opt.label}`}
              >
                <Icon
                  className={`size-3.5 shrink-0 ${
                    isSelected
                      ? opt.id === "light"
                        ? "text-amber-500"
                        : opt.id === "dark"
                        ? "text-indigo-400"
                        : "text-emerald-500"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
