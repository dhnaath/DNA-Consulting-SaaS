import { Palette, Check } from "lucide-react";
import { useThemeColor } from "@/hooks/useThemeColor";

export function ThemeColorPicker() {
  const { color, setColor, currentOption, options } = useThemeColor();

  return (
    <div className="flex flex-col gap-1.5 pt-0.5 text-slate-900 dark:text-slate-100 select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Palette className="size-3.5 transition-colors duration-200" style={{ color: currentOption.hex }} />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Warna Aksen Tema</span>
        </div>
        <span
          className="inline-flex items-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full text-white transition-all duration-200 shadow-2xs"
          style={{
            backgroundColor: currentOption.hex,
            color: "#ffffff",
          }}
        >
          {currentOption.name}
        </span>
      </div>

      {/* Full Colored Button Swatches */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-0.5">
        {options.map((opt) => {
          const isSelected = color === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setColor(opt.id)}
              style={{ backgroundColor: opt.hex }}
              className={`relative h-7.5 w-full rounded-lg transition-all duration-150 cursor-pointer flex items-center justify-center shadow-xs active:scale-95 ${
                isSelected
                  ? "scale-105 shadow-md brightness-105"
                  : "opacity-80 hover:opacity-100 hover:scale-105"
              }`}
              title={opt.name}
              aria-label={`Pilih warna ${opt.name}`}
            >
              {isSelected && (
                <Check className="size-4 text-white stroke-[3] drop-shadow-xs" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
