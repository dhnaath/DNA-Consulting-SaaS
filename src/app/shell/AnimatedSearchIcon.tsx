import { useEffect, useState } from "react";

interface AnimatedSearchIconProps {
  active?: boolean;
  className?: string;
  strokeWidth?: number;
}

export function AnimatedSearchIcon({
  active = true,
  className = "size-[13px] text-muted-foreground group-hover:text-foreground transition-colors shrink-0",
  strokeWidth = 2.4,
}: AnimatedSearchIconProps) {
  const [stage, setStage] = useState<"idle" | "handle" | "glass">(active ? "glass" : "idle");

  useEffect(() => {
    if (!active) {
      setStage("idle");
      return;
    }

    // When activated:
    // 1. Immediately start expanding from handle base (pangkal gagang)
    setStage("handle");

    // 2. After handle extends (~90ms), bloom out the glass lens
    const glassTimer = setTimeout(() => {
      setStage("glass");
    }, 90);

    return () => {
      clearTimeout(glassTimer);
    };
  }, [active]);

  const isHandleActive = stage === "handle" || stage === "glass";
  const isGlassActive = stage === "glass";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        transformOrigin: "21px 21px", // Pangkal gagang magnifier (bottom-right handle base)
        transform: isHandleActive ? "scale(1)" : "scale(0)",
        opacity: isHandleActive ? 1 : 0,
        transition: isHandleActive
          ? "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 180ms ease-out"
          : "transform 140ms ease-in, opacity 140ms ease-in",
      }}
      aria-hidden="true"
    >
      {/* Kaca Pembesar (Lens): Membesar / mekar dari sambungan gagang begitu gagang memanjang */}
      <circle
        cx="11"
        cy="11"
        r="8"
        style={{
          transformOrigin: "11px 11px",
          transform: isGlassActive ? "scale(1)" : "scale(0)",
          opacity: isGlassActive ? 1 : 0,
          transition: isGlassActive
            ? "transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 180ms ease-out"
            : "transform 120ms ease-in, opacity 120ms ease-in",
        }}
      />

      {/* Gagang Kaca Pembesar: Muncul dan memanjang dari ujung pangkal gagang (21, 21) ke arah kaca (16.65, 16.65) */}
      <line
        x1="21"
        y1="21"
        x2="16.65"
        y2="16.65"
        style={{
          transformOrigin: "21px 21px",
          transform: isHandleActive ? "scale(1)" : "scale(0)",
          transition: "transform 180ms cubic-bezier(0.2, 0.9, 0.3, 1)",
        }}
      />
    </svg>
  );
}
