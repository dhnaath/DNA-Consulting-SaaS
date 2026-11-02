import { create } from "zustand";
import { getRaw, setRaw } from "../core/rawStorage";

export type ThemeColorId =
  | "blue"
  | "purple"
  | "emerald"
  | "rose"
  | "amber"
  | "teal"
  | "indigo"
  | "slate";

export interface ThemeColorOption {
  id: ThemeColorId;
  name: string;
  hex: string;
  bgClass: string;
  ringClass: string;
}

export const THEME_COLOR_OPTIONS: ThemeColorOption[] = [
  { id: "blue", name: "Biru Samudra", hex: "#2563eb", bgClass: "bg-blue-600", ringClass: "ring-blue-500" },
  { id: "purple", name: "Ungu Violet", hex: "#7c3aed", bgClass: "bg-purple-600", ringClass: "ring-purple-500" },
  { id: "emerald", name: "Zamrud Hijau", hex: "#059669", bgClass: "bg-emerald-600", ringClass: "ring-emerald-500" },
  { id: "rose", name: "Mawar Merah", hex: "#e11d48", bgClass: "bg-rose-600", ringClass: "ring-rose-500" },
  { id: "amber", name: "Jingga Amber", hex: "#d97706", bgClass: "bg-amber-600", ringClass: "ring-amber-500" },
  { id: "teal", name: "Sian Teal", hex: "#0d9488", bgClass: "bg-teal-600", ringClass: "ring-teal-500" },
  { id: "indigo", name: "Indigo", hex: "#4f46e5", bgClass: "bg-indigo-600", ringClass: "ring-indigo-500" },
  { id: "slate", name: "Grafit Slate", hex: "#475569", bgClass: "bg-slate-600", ringClass: "ring-slate-500" },
];

function applyThemeColorToDOM(colorId: ThemeColorId) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme-color", colorId);
}

function getInitialColor(): ThemeColorId {
  if (typeof window !== "undefined") {
    try {
      const stored = getRaw("aio_theme_color");
      if (stored && THEME_COLOR_OPTIONS.some((o) => o.id === stored)) {
        return stored as ThemeColorId;
      }
    } catch {}
  }
  return "blue";
}

interface ThemeColorStore {
  color: ThemeColorId;
  setColor: (color: ThemeColorId) => void;
}

export const useThemeColorStore = create<ThemeColorStore>((set) => {
  const initial = getInitialColor();
  if (typeof window !== "undefined") {
    setTimeout(() => applyThemeColorToDOM(initial), 0);
  }

  return {
    color: initial,
    setColor: (color: ThemeColorId) => {
      try {
        setRaw("aio_theme_color", color);
      } catch {}
      applyThemeColorToDOM(color);
      set({ color });
    },
  };
});

export function useThemeColor() {
  const color = useThemeColorStore((s) => s.color);
  const setColor = useThemeColorStore((s) => s.setColor);
  const currentOption = THEME_COLOR_OPTIONS.find((o) => o.id === color) || THEME_COLOR_OPTIONS[0];

  return {
    color,
    setColor,
    currentOption,
    options: THEME_COLOR_OPTIONS,
  };
}
