import { create } from "zustand";
import { getRaw, setRaw } from "../core/rawStorage";

export type LiquidGlassMode = "liquid" | "frosted" | "solid";

export interface LiquidGlassConfig {
  enabled: boolean;
  mode: LiquidGlassMode;
}

const DEFAULT_CONFIG: LiquidGlassConfig = {
  enabled: true,
  mode: "liquid",
};

function getInitialConfig(): LiquidGlassConfig {
  if (typeof window !== "undefined") {
    try {
      const stored = getRaw("aio_liquid_glass");
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {}
  }
  return DEFAULT_CONFIG;
}

function applyLiquidGlassToDOM(config: LiquidGlassConfig) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!config.enabled) {
    root.setAttribute("data-liquid-glass", "off");
  } else {
    root.setAttribute("data-liquid-glass", config.mode);
  }
}

interface LiquidGlassStore {
  config: LiquidGlassConfig;
  updateConfig: (patch: Partial<LiquidGlassConfig>) => void;
}

export const useLiquidGlassStore = create<LiquidGlassStore>((set) => {
  const initial = getInitialConfig();
  if (typeof window !== "undefined") {
    setTimeout(() => applyLiquidGlassToDOM(initial), 0);
  }

  return {
    config: initial,
    updateConfig: (patch) => {
      set((state) => {
        const next = { ...state.config, ...patch };
        try {
          setRaw("aio_liquid_glass", JSON.stringify(next));
        } catch (e) {}
        applyLiquidGlassToDOM(next);
        return { config: next };
      });
    },
  };
});

export function useLiquidGlassSetting() {
  const config = useLiquidGlassStore((s) => s.config);
  const updateConfig = useLiquidGlassStore((s) => s.updateConfig);

  return {
    config,
    updateConfig,
    isEnabled: config.enabled,
    mode: config.mode,
  };
}
