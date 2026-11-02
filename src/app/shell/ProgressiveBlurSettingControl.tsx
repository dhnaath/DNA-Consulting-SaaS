import { Layers, Check } from "lucide-react";
import { useProgressiveBlurSetting, type ProgressiveBlurIntensity } from "@/hooks/useProgressiveBlurSetting";

export function ProgressiveBlurSettingControl() {
  const { config, updateConfig } = useProgressiveBlurSetting();

  const presets: { id: ProgressiveBlurIntensity; label: string; desc: string; maxPx: number }[] = [
    { id: "subtle", label: "Subtle", desc: "16px", maxPx: 16 },
    { id: "planes", label: "Planes", desc: "32px", maxPx: 32 },
    { id: "deep", label: "Deep", desc: "48px", maxPx: 48 },
  ];

  return (
    <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-200 dark:border-slate-800 mt-1.5 text-slate-900 dark:text-slate-100 select-none">
      {/* Header bar with toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="size-3.5 text-primary" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Progressive Blur (Planes)</span>
        </div>
        <button
          type="button"
          onClick={() => updateConfig({ enabled: !config.enabled })}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            config.enabled ? "bg-primary" : "bg-slate-300 dark:bg-slate-700"
          }`}
          title="Toggle Progressive Blur"
          aria-label="Toggle Progressive Blur"
        >
          <span
            className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-md transform ring-0 transition duration-200 ease-in-out ${
              config.enabled ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Preset selector buttons */}
      {config.enabled && (
        <div className="pt-0.5">
          <div className="grid grid-cols-3 gap-1">
            {presets.map((p) => {
              const isSelected = config.intensity === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => updateConfig({ intensity: p.id })}
                  className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer border ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-2xs font-semibold ring-1 ring-primary/30"
                      : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-1">
                    {isSelected && <Check className="size-2.5 stroke-[3] text-white" />}
                    <span>{p.label}</span>
                  </div>
                  <span className={`text-[8px] opacity-80 ${isSelected ? "text-white" : "text-slate-400 dark:text-slate-400"}`}>
                    {p.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
