import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

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
    <div className="flex items-center justify-end gap-1.5 shrink-0 shell-header-portal-actions h-full">
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

  // Auto-minimize: setelah 10 detik idle tanpa interaksi kursor, ciutkan menjadi hanya kategori terpilih
  const IDLE_TIMEOUT_MS = 10000;
  const [isMinimized, setIsMinimized] = useState(false);
  const isHoveringRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    if (isHoveringRef.current) {
      return;
    }

    idleTimerRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setIsMinimized(true);
      }
    }, IDLE_TIMEOUT_MS);
  }, []);

  // Jalankan timer saat mount
  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [resetIdleTimer]);

  // Saat kategori aktif berubah, reset timer
  useEffect(() => {
    resetIdleTimer();
  }, [activeId, resetIdleTimer]);

  // Saat kursor masuk ke area kategori bar, segera expand kembali
  const handleMouseEnter = () => {
    isHoveringRef.current = true;
    setIsMinimized(false);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  // Saat kursor meninggalkan area kategori bar, mulai hitung mundur 10 detik
  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    setHoveredNav(null);
    resetIdleTimer();
  };

  const hasActiveItem = items.some((item) => String(item.id) === String(activeId));
  const effectiveActiveId = hasActiveItem ? activeId : (items[0]?.id ?? activeId);

  // Fisika pegas identik dengan animasi dock yang super mulus
  const springTransition = {
    type: "spring" as const,
    stiffness: 350,
    damping: 26,
    mass: 0.8,
  };

  const activeIdx = items.findIndex((item) => String(item.id) === String(effectiveActiveId));

  return (
    <LayoutGroup id={`header-nav-${groupId}`}>
      <motion.div
        data-nav-pill-group="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        layout
        transition={springTransition}
        className="relative inline-flex items-center justify-end h-[46px] rounded-full liquid-glass-header-pill bg-white/60 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xs p-1 overflow-hidden"
      >
        <AnimatePresence initial={false}>
          {items.map((item, idx) => {
            const itemKey = String(item.id);
            const isActive = String(effectiveActiveId) === itemKey;
            const isEdgeItem = idx === 0 || idx === items.length - 1;
            const isToLeftOfActive = activeIdx !== -1 && idx < activeIdx;

            // Jika sedang minimized dan item ini bukan item yang dipilih, sembunyikan dengan animasi exit bersih
            if (isMinimized && !isActive && items.length > 1) {
              return null;
            }

            const isHighlighted =
              hoveredNav === itemKey || (hoveredNav === null && isActive);

            return (
              <motion.button
                key={itemKey}
                type="button"
                layout
                data-nav-pill-btn="true"
                data-pill-highlighted={isHighlighted ? "true" : undefined}
                data-nav-selected={isActive ? "true" : undefined}
                initial={{
                  width: 0,
                  opacity: 0,
                  scale: 0.9,
                  x: 20,
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginRight: 0,
                }}
                animate={{
                  width: "auto",
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  paddingLeft: 18,
                  paddingRight: 18,
                  marginRight: isMinimized || idx === items.length - 1 ? 0 : 6,
                }}
                exit={{
                  width: 0,
                  minWidth: 0,
                  maxWidth: 0,
                  opacity: 0,
                  scale: 0.9,
                  x: isToLeftOfActive ? 16 : 32,
                  paddingLeft: 0,
                  paddingRight: 0,
                  marginRight: 0,
                  transition: {
                    duration: 0.28,
                    ease: [0.32, 0.72, 0, 1],
                  },
                }}
                transition={springTransition}
                onClick={() => {
                  if (isMinimized) {
                    setIsMinimized(false);
                    resetIdleTimer();
                  } else {
                    onSelect(item.id);
                    resetIdleTimer();
                  }
                }}
                onMouseEnter={() => {
                  if (!isMinimized) setHoveredNav(itemKey);
                }}
                title={
                  item.title ??
                  (item.count !== undefined
                    ? `${item.label} (${item.count})`
                    : item.label)
                }
                className={`relative h-[36px] rounded-full text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-2 overflow-hidden select-none shrink-0 ${
                  isActive ? "z-20" : "z-0"
                } ${
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
                <span className="relative z-10 whitespace-nowrap overflow-hidden">{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`relative z-10 text-[12px] whitespace-nowrap overflow-hidden transition-colors ${
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
                {/* Ketika sedang minimize, tampilkan micro chevron halus di samping pilihan aktif */}
                {isActive && items.length > 1 && (
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: isMinimized ? 0.85 : 0,
                      width: isMinimized ? "auto" : 0,
                      scale: isMinimized ? 1 : 0.5,
                      marginLeft: isMinimized ? 3 : 0,
                    }}
                    transition={springTransition}
                    className="relative z-10 text-[9px] overflow-hidden inline-flex items-center pointer-events-none"
                    aria-hidden="true"
                  >
                    ▼
                  </motion.span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
