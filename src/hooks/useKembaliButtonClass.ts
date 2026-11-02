import { useLiquidGlassSetting } from "./useLiquidGlassSetting";
import { useProgressiveBlurSetting } from "./useProgressiveBlurSetting";

/**
 * Menghasilkan class Tailwind adaptif untuk tombol "Kembali" pada sisi belakang kartu flip,
 * menyesuaikan secara real-time dengan 3 opsi Liquid Glass Tombol (Liquid / Frosted / Solid + Off)
 * dan 3 opsi Progressive Blur (Subtle / Planes / Deep + Off) di Pengaturan.
 */
export function useKembaliButtonClass(): string {
  const { isEnabled: isGlassEnabled, mode: glassMode } = useLiquidGlassSetting();
  const { isEnabled: isProgBlurEnabled, config: progBlurConfig } = useProgressiveBlurSetting();

  const base =
    "px-2.5 py-1.5 rounded-lg active:scale-95 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all duration-200 border";

  // 1. Liquid Glass Tombol = OFF -> 100% solid putih (light) / hitam pekat (dark) tanpa transparansi & blur
  if (!isGlassEnabled) {
    return `${base} bg-white dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-900 dark:text-zinc-100 border-slate-200 dark:border-zinc-800 shadow-sm backdrop-blur-none`;
  }

  // 2. Mode Solid (Minimal) -> Permukaan kartu solid bersih tanpa efek kaca/blur
  if (glassMode === "solid") {
    return `${base} bg-card hover:bg-muted text-card-foreground border-border shadow-xs backdrop-blur-none`;
  }

  // 3. Mode Frosted (Clean Blur) -> Kaca buram halus tanpa kilau refraksi tajam, mengikuti 3 level blur
  if (glassMode === "frosted") {
    if (!isProgBlurEnabled) {
      return `${base} bg-white/35 dark:bg-slate-900/35 hover:bg-white/45 dark:hover:bg-slate-900/45 text-white border-white/35 dark:border-white/15 shadow-xs backdrop-blur-none`;
    }
    if (progBlurConfig.intensity === "subtle") {
      return `${base} bg-white/55 dark:bg-slate-900/55 hover:bg-white/65 dark:hover:bg-slate-900/65 text-slate-900 dark:text-white border-white/55 dark:border-white/20 shadow-xs backdrop-blur-md backdrop-saturate-150`;
    }
    if (progBlurConfig.intensity === "deep") {
      return `${base} bg-white/90 dark:bg-slate-900/90 hover:bg-white/95 dark:hover:bg-slate-900/95 text-slate-900 dark:text-white border-white/90 dark:border-white/40 shadow-md backdrop-blur-2xl backdrop-saturate-200`;
    }
    // Default: "planes"
    return `${base} bg-white/75 dark:bg-slate-900/75 hover:bg-white/85 dark:hover:bg-slate-900/85 text-slate-900 dark:text-white border-white/75 dark:border-white/30 shadow-sm backdrop-blur-xl backdrop-saturate-[1.8]`;
  }

  // 4. Mode Liquid (Refraction) -> Kaca cair berkilau spekular, mengikuti 3 level blur
  if (!isProgBlurEnabled) {
    return `${base} bg-transparent hover:bg-white/10 text-white border-white/25 shadow-none backdrop-blur-none`;
  }
  if (progBlurConfig.intensity === "subtle") {
    return `${base} bg-white/15 hover:bg-white/25 text-white border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_2px_6px_rgba(0,0,0,0.12)] backdrop-blur-sm backdrop-saturate-150`;
  }
  if (progBlurConfig.intensity === "deep") {
    return `${base} bg-white/50 hover:bg-white/60 text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)] border-white/75 shadow-[inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-1px_3px_rgba(255,255,255,0.35),0_6px_20px_rgba(0,0,0,0.25)] backdrop-blur-xl backdrop-saturate-200`;
  }
  // Default: "planes"
  return `${base} bg-white/30 hover:bg-white/40 text-white border-white/50 shadow-[inset_0_1px_2px_rgba(255,255,255,0.75),inset_0_-1px_2px_rgba(255,255,255,0.2),0_4px_14px_rgba(0,0,0,0.18)] backdrop-blur-md backdrop-saturate-[1.8]`;
}
