import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { LayoutGroup, motion } from "motion/react";

type ShellHeaderCtxValue = {
  setHasAppHeader: (has: boolean) => void;
};

const ShellHeaderCtx = createContext<ShellHeaderCtxValue | null>(null);

export const ShellHeaderProvider = ShellHeaderCtx.Provider;

/**
 * ShellHeader — Portals interactive actions, view switchers, tabs, and toolbars
 * directly into the main application header (in AppShell), completely removing
 * any duplicate headers or toolbars from the app body.
 */
export function ShellHeader({ children }: { children: ReactNode }) {
  const ctx = useContext(ShellHeaderCtx);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    ctx?.setHasAppHeader(true);

    const checkTarget = () => {
      const target = document.getElementById("app-header-actions-portal");
      if (target) {
        setPortalTarget(target);
      }
    };

    checkTarget();
    const timer = setTimeout(checkTarget, 50);

    return () => {
      clearTimeout(timer);
      ctx?.setHasAppHeader(false);
    };
  }, [ctx]);

  if (!portalTarget) {
    return null;
  }

  return createPortal(
    <div className="flex items-center gap-1.5 shrink-0 shell-header-portal-actions h-full">
      {children}
    </div>,
    portalTarget
  );
}

export interface HeaderNavPillItem<T extends string | number = string> {
  id: T;
  label: string;
  count?: number | string;
  title?: string;
}

/**
 * HeaderNavPills — Cursor-following segmented capsule bar inside ShellHeader
 * using Framer Motion shared layout animation (layoutId="nav-pill") with spring physics.
 */
export function HeaderNavPills<T extends string | number = string>({
  items,
  activeId,
  onSelect,
}: {
  items: readonly HeaderNavPillItem<T>[];
  activeId: string | number;
  onSelect: (id: T) => void;
}) {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const groupId = useId();
  const pillBg =
    "bg-primary shadow-[0_1px_4px_hsl(var(--primary)/0.35)] dark:shadow-[0_1px_5px_hsl(var(--primary)/0.45)]";

  return (
    <LayoutGroup id={`header-nav-${groupId}`}>
      <div
        data-nav-pill-group="true"
        onMouseLeave={() => setHoveredNav(null)}
        className="relative flex items-center gap-1 sm:gap-1.5 h-full m-0 p-0"
      >
        {items.map((item, idx) => {
          const itemKey = String(item.id);
          const isActive = String(activeId) === itemKey;
          const isHighlighted =
            hoveredNav === itemKey || (hoveredNav === null && isActive);
          const isEdgeItem = idx === 0 || idx === items.length - 1;

          return (
            <button
              key={itemKey}
              type="button"
              data-nav-pill-btn="true"
              data-pill-highlighted={isHighlighted ? "true" : undefined}
              data-nav-selected={isActive ? "true" : undefined}
              onClick={() => onSelect(item.id)}
              onMouseEnter={() => setHoveredNav(itemKey)}
              title={
                item.title ??
                (item.count !== undefined
                  ? `${item.label} (${item.count})`
                  : item.label)
              }
              className={`relative h-[36px] px-4.5 rounded-full text-[13px] transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
                isHighlighted
                  ? "text-primary-foreground font-bold"
                  : isActive
                  ? "text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground font-semibold"
              }`}
            >
              {isHighlighted ? (
                <motion.div
                  layoutId="nav-pill"
                  data-nav-pill-indicator="true"
                  className={`absolute inset-0 rounded-full z-0 pointer-events-none ${pillBg}`}
                  style={{ borderRadius: 18 }}
                  transition={
                    isEdgeItem
                      ? { type: "spring", bounce: 0.02, duration: 0.36 }
                      : { type: "spring", bounce: 0.1, duration: 0.38 }
                  }
                />
              ) : null}
              <span className="relative z-10">{item.label}</span>
              {item.count !== undefined && (
                <span
                  className={`relative z-10 text-[12px] transition-colors ${
                    isHighlighted
                      ? "text-primary-foreground/90 font-bold"
                      : isActive
                      ? "text-foreground/80 font-semibold"
                      : "text-muted-foreground/75 font-medium"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}
