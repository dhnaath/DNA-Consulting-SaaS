import React, { useState, useEffect, useCallback } from "react";

export const CARD_COLORS_STORAGE_KEY = "aio_card_custom_icon_colors";
export const CARD_COLORS_EVENT_KEY = "aio_card_custom_icon_colors_updated";

export interface CardColorPreset {
  id: string;
  name: string;
  value: string; // Tailwind class (e.g. "bg-linear-to-br from-...") or hex code (e.g. "#6366f1")
  previewBg: string; // CSS background for swatch circle preview
  type: "gradient" | "solid";
}

export const CARD_COLOR_PRESETS: CardColorPreset[] = [
  {
    id: "indigo-blue",
    name: "Indigo Blue",
    value: "bg-linear-to-br from-indigo-500 to-blue-700",
    previewBg: "linear-gradient(135deg, #6366f1 0%, #1d4ed8 100%)",
    type: "gradient",
  },
  {
    id: "cyan-blue",
    name: "Ocean Cyan",
    value: "bg-linear-to-br from-cyan-500 to-blue-600",
    previewBg: "linear-gradient(135deg, #06b6d4 0%, #2563eb 100%)",
    type: "gradient",
  },
  {
    id: "emerald-teal",
    name: "Emerald Teal",
    value: "bg-linear-to-br from-emerald-500 to-teal-700",
    previewBg: "linear-gradient(135deg, #10b981 0%, #0f766e 100%)",
    type: "gradient",
  },
  {
    id: "teal-emerald",
    name: "Mint Fresh",
    value: "bg-linear-to-br from-teal-400 to-emerald-600",
    previewBg: "linear-gradient(135deg, #2dd4bf 0%, #059669 100%)",
    type: "gradient",
  },
  {
    id: "amber-orange",
    name: "Amber Orange",
    value: "bg-linear-to-br from-amber-500 to-orange-600",
    previewBg: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    type: "gradient",
  },
  {
    id: "orange-rose",
    name: "Sunset Coral",
    value: "bg-linear-to-br from-orange-500 to-rose-600",
    previewBg: "linear-gradient(135deg, #f97316 0%, #e11d48 100%)",
    type: "gradient",
  },
  {
    id: "rose-red",
    name: "Ruby Rose",
    value: "bg-linear-to-br from-rose-500 to-red-700",
    previewBg: "linear-gradient(135deg, #f43f5e 0%, #b91c1c 100%)",
    type: "gradient",
  },
  {
    id: "fuchsia-pink",
    name: "Electric Fuchsia",
    value: "bg-linear-to-br from-fuchsia-500 to-pink-600",
    previewBg: "linear-gradient(135deg, #d946ef 0%, #db2777 100%)",
    type: "gradient",
  },
  {
    id: "purple-violet",
    name: "Royal Purple",
    value: "bg-linear-to-br from-purple-500 to-indigo-700",
    previewBg: "linear-gradient(135deg, #a855f7 0%, #4338ca 100%)",
    type: "gradient",
  },
  {
    id: "sky-blue",
    name: "Sky Light",
    value: "bg-linear-to-br from-sky-400 to-blue-600",
    previewBg: "linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)",
    type: "gradient",
  },
  {
    id: "golden-amber",
    name: "Golden Luxury",
    value: "bg-linear-to-br from-yellow-500 to-amber-700",
    previewBg: "linear-gradient(135deg, #eab308 0%, #b45309 100%)",
    type: "gradient",
  },
  {
    id: "dark-slate",
    name: "Midnight Slate",
    value: "bg-linear-to-br from-slate-700 to-zinc-900",
    previewBg: "linear-gradient(135deg, #334155 0%, #18181b 100%)",
    type: "gradient",
  },
  {
    id: "solid-blue",
    name: "Pure Sapphire",
    value: "#2563eb",
    previewBg: "#2563eb",
    type: "solid",
  },
  {
    id: "solid-emerald",
    name: "Pure Emerald",
    value: "#059669",
    previewBg: "#059669",
    type: "solid",
  },
  {
    id: "solid-purple",
    name: "Pure Violet",
    value: "#7c3aed",
    previewBg: "#7c3aed",
    type: "solid",
  },
  {
    id: "solid-rose",
    name: "Pure Crimson",
    value: "#e11d48",
    previewBg: "#e11d48",
    type: "solid",
  },
];

export function getStoredCardColors(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CARD_COLORS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoredCardColors(colors: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CARD_COLORS_STORAGE_KEY, JSON.stringify(colors));
    window.dispatchEvent(new Event(CARD_COLORS_EVENT_KEY));
  } catch (err) {
    console.error("Failed to save card colors:", err);
  }
}

/**
 * Resolves the final background class / style for a card icon circle
 */
export function resolveIconBg(
  customColor: string | undefined,
  fallbackGradient = "bg-linear-to-br from-primary to-indigo-700"
): { className: string; style?: React.CSSProperties } {
  if (!customColor) {
    return { className: fallbackGradient };
  }
  if (customColor.startsWith("bg-")) {
    return { className: customColor };
  }
  return { className: "", style: { background: customColor } };
}

export function useCardIconColor(title?: string, to?: string) {
  const [colors, setColors] = useState<Record<string, string>>(() => getStoredCardColors());

  useEffect(() => {
    const handler = () => {
      setColors(getStoredCardColors());
    };
    window.addEventListener(CARD_COLORS_EVENT_KEY, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CARD_COLORS_EVENT_KEY, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const cardKey = title || to || "";
  const customColor =
    (title && colors[title]) ||
    (to && colors[to]) ||
    (cardKey && colors[cardKey]) ||
    undefined;

  const setColor = useCallback(
    (newColor: string) => {
      const next = { ...getStoredCardColors() };
      if (title) next[title] = newColor;
      if (to) next[to] = newColor;
      if (cardKey) next[cardKey] = newColor;
      saveStoredCardColors(next);
    },
    [title, to, cardKey]
  );

  const resetColor = useCallback(() => {
    const next = { ...getStoredCardColors() };
    if (title) delete next[title];
    if (to) delete next[to];
    if (cardKey) delete next[cardKey];
    saveStoredCardColors(next);
  }, [title, to, cardKey]);

  return {
    customColor,
    hasCustomColor: Boolean(customColor),
    setColor,
    resetColor,
    allColors: colors,
  };
}
