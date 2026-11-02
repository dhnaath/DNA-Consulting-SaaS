import React, { useMemo } from "react";

export type ProgressiveBlurDirection = "top" | "bottom" | "left" | "right" | "both";

export interface ProgressiveBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: ProgressiveBlurDirection;
  blurLevels?: number[];
  height?: string | number;
  width?: string | number;
  tint?: boolean | string;
  tintOpacity?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const DEFAULT_BLUR_LEVELS = [0.5, 1, 2, 4, 8, 16, 24, 32];

/**
 * ProgressiveBlur
 * 
 * Inspired by useplanes.com/components/progressive-blur & Apple VisionOS design.
 * Creates an ultra-smooth, continuous gradient blur without hard cutoffs or banding
 * by stacking exponentially masked backdrop-filter layers.
 */
export function ProgressiveBlur({
  direction = "bottom",
  blurLevels = DEFAULT_BLUR_LEVELS,
  height,
  width,
  tint = false,
  tintOpacity = 0.85,
  className = "",
  style,
  children,
  ...props
}: ProgressiveBlurProps) {
  const directions: Array<"top" | "bottom" | "left" | "right"> = useMemo(() => {
    if (direction === "both") {
      return ["top", "bottom"];
    }
    return [direction];
  }, [direction]);

  const dirMap = {
    top: "to top",
    bottom: "to bottom",
    left: "to left",
    right: "to right",
  };

  if (!blurLevels || blurLevels.length === 0) {
    return children ? <>{children}</> : null;
  }

  const layers = useMemo(() => {
    const total = blurLevels.length;
    return blurLevels.map((blur, index) => {
      const start = Number(((index / total) * 100).toFixed(2));
      const end = Number((((index + 1) / total) * 100).toFixed(2));

      return {
        blur,
        start,
        end,
      };
    });
  }, [blurLevels]);

  const defaultDimensions: React.CSSProperties = {
    height: height !== undefined ? height : direction === "left" || direction === "right" ? "100%" : "120px",
    width: width !== undefined ? width : direction === "top" || direction === "bottom" || direction === "both" ? "100%" : "120px",
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none overflow-hidden isolate ${className}`}
      style={{
        ...defaultDimensions,
        ...style,
      }}
      {...props}
    >
      {directions.map((dir) => {
        const toDirection = dirMap[dir];

        return (
          <div
            key={dir}
            className="absolute inset-0 pointer-events-none"
            style={{
              // If direction is "both", top covers top 50%, bottom covers bottom 50%
              ...(direction === "both"
                ? dir === "top"
                  ? { bottom: "50%" }
                  : { top: "50%" }
                : {}),
            }}
          >
            {/* Multi-layer stacked progressive backdrop blur */}
            {layers.map(({ blur, start, end }, idx) => {
              const gradient = `linear-gradient(${toDirection}, rgba(0,0,0,0) ${start}%, rgba(0,0,0,1) ${end}%, rgba(0,0,0,1) 100%)`;

              return (
                <div
                  key={idx}
                  className="absolute inset-0 pointer-events-none transform-gpu"
                  style={{
                    zIndex: idx + 1,
                    backdropFilter: `blur(${blur}px)`,
                    WebkitBackdropFilter: `blur(${blur}px)`,
                    maskImage: gradient,
                    WebkitMaskImage: gradient,
                  }}
                />
              );
            })}

            {/* Optional gradient background tint for authentic Planes frosted melt */}
            {tint && (
              <div
                className="absolute inset-0 pointer-events-none transition-colors duration-200"
                style={{
                  zIndex: layers.length + 1,
                  background:
                    typeof tint === "string"
                      ? tint
                      : `linear-gradient(${toDirection}, transparent 0%, hsl(var(--background) / ${tintOpacity}) 100%)`,
                }}
              />
            )}
          </div>
        );
      })}

      {children && (
        <div className="relative z-10 pointer-events-auto h-full w-full">
          {children}
        </div>
      )}
    </div>
  );
}

export default ProgressiveBlur;
