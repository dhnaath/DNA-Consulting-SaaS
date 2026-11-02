import { useState, useEffect } from "react";
import { Languages } from "lucide-react";
import { getRaw, setRaw } from "../../core/rawStorage";

export type LanguageCode = "id" | "en" | "ms" | "zh";

const LANGUAGES: {
  code: LanguageCode;
  label: string;
  fullName: string;
}[] = [
  { code: "id", label: "ID", fullName: "Bahasa Indonesia" },
  { code: "en", label: "EN", fullName: "English" },
  { code: "ms", label: "MS", fullName: "Bahasa Melayu (Malaysia)" },
  { code: "zh", label: "ZH", fullName: "中文 · Mandarin (China)" },
];

interface LanguageToggleProps {
  className?: string;
  showDivider?: boolean;
}

export function LanguageToggle({ className = "", showDivider = false }: LanguageToggleProps) {
  const [lang, setLang] = useState<LanguageCode>(() => {
    if (typeof window !== "undefined") {
      const stored = getRaw("aio_lang") || getRaw("appLanguage");
      if (stored === "id" || stored === "en" || stored === "ms" || stored === "zh") {
        return stored as LanguageCode;
      }
    }
    return "id";
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = getRaw("aio_lang") || getRaw("appLanguage");
      if (stored === "id" || stored === "en" || stored === "ms" || stored === "zh") {
        setLang(stored as LanguageCode);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("languageChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("languageChange", handleStorage);
    };
  }, []);

  const handleSelect = (nextLang: LanguageCode) => {
    setLang(nextLang);
    try {
      setRaw("aio_lang", nextLang);
      setRaw("appLanguage", nextLang);
      window.dispatchEvent(new Event("languageChange"));
    } catch {}
  };

  return (
    <div
      className={`flex items-center justify-between text-slate-900 dark:text-slate-100 select-none ${
        showDivider ? "pt-2 border-t border-slate-200 dark:border-slate-800 mt-1.5" : ""
      } ${className}`}
    >
      <div className="flex items-center gap-1.5 shrink-0">
        <Languages className="size-3.5 text-primary shrink-0" />
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Bahasa UI</span>
      </div>
      <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800/90 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
        {LANGUAGES.map((item) => {
          const isSelected = lang === item.code;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => handleSelect(item.code)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-semibold cursor-pointer transition-all ${
                isSelected
                  ? "bg-white dark:bg-slate-700 text-primary shadow-2xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              title={item.fullName}
              aria-label={`Pilih ${item.fullName}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
