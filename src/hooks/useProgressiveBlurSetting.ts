import { create } from "zustand";
import { getRaw, setRaw } from "../core/rawStorage";

export type ProgressiveBlurIntensity = "subtle" | "planes" | "deep";

export interface ProgressiveBlurConfig {
  enabled: boolean;
  intensity: ProgressiveBlurIntensity;
  tint: boolean;
}

const DEFAULT_CONFIG: ProgressiveBlurConfig = {
  enabled: true,
  intensity: "planes",
  tint: true,
};

export const BLUR_LEVELS_MAP: Record<ProgressiveBlurIntensity, number[]> = {
  subtle: [0.5, 1, 2, 4, 8, 16],
  planes: [0.5, 1, 2, 4, 8, 16, 24, 32],
  deep: [1, 2, 4, 8, 16, 24, 36, 48],
};

function getInitialConfig(): ProgressiveBlurConfig {
  if (typeof window !== "undefined") {
    try {
      const stored = getRaw("aio_progressive_blur");
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {}
  }
  return DEFAULT_CONFIG;
}

interface ProgressiveBlurStore {
  config: ProgressiveBlurConfig;
  updateConfig: (patch: Partial<ProgressiveBlurConfig>) => void;
}

export const useProgressiveBlurStore = create<ProgressiveBlurStore>((set) => ({
  config: getInitialConfig(),
  updateConfig: (patch) => {
    set((state) => {
      const next = { ...state.config, ...patch };
      try {
        setRaw("aio_progressive_blur", JSON.stringify(next));
      } catch (e) {}
      return { config: next };
    });
  },
}));

export function useProgressiveBlurSetting() {
  const config = useProgressiveBlurStore((s) => s.config);
  const updateConfig = useProgressiveBlurStore((s) => s.updateConfig);
  const blurLevels = config.enabled ? BLUR_LEVELS_MAP[config.intensity] : [];

  return {
    config,
    updateConfig,
    blurLevels,
    isEnabled: config.enabled,
  };
}
