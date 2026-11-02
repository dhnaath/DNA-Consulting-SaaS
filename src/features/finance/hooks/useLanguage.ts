import { useState, useEffect } from "react";
import { getRaw } from "../../../core/rawStorage";

export type Language = "id" | "en" | "ms" | "zh";

export function useLanguage(): Language {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = getRaw("aio_lang") || getRaw("appLanguage");
      if (stored === "en" || stored === "id" || stored === "ms" || stored === "zh") {
        return stored as Language;
      }
    }
    return "id";
  });

  useEffect(() => {
    const handleStorage = () => {
      const stored = getRaw("aio_lang") || getRaw("appLanguage");
      if (stored === "en" || stored === "id" || stored === "ms" || stored === "zh") {
        setLang(stored as Language);
      }
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("languageChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("languageChange", handleStorage);
    };
  }, []);

  return lang;
}
