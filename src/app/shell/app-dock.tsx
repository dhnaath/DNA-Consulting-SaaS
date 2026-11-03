import { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Target,
  LayoutDashboard,
  Home,
  Terminal,
  Plus,
  CornerUpRight,
  ChevronsUp,
  History,
  GalleryHorizontal,
  Star,
  Search,
  Gem,
  TrendingUp,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useDockStore } from "@/hooks/useDockState";
import { navKonsultan } from "@/config/nav";
import { STANDALONE_APPS } from "@/features/standalone/standaloneAppsData";
import { getAppMetaByRoute } from "@/utils/appLookup";
import { MacExpandStack } from "./mac-expand-stack";
import { getRaw } from "../../core/rawStorage";

// Jarak (px) dari kursor ke ikon yang mempengaruhi ukurannya.
const CURSOR_RADIUS = 70;

// Ukuran ikon: [normal, saat pas di tengah kursor, normal lagi]
const ICON_SIZE_RANGE = [42, 70, 42];

export interface DockItemConfig {
  id: string;
  label: string;
  icon: any;
  strokeWidth?: number;
  onClick?: () => void;
  isActive?: boolean;
  isFavorite?: boolean;
  isSeparator?: boolean;
  iconColor?: string;
  accentGradient?: string;
  noColor?: boolean;
}

function DockIcon({ 
  item, 
  mouseX, 
  isActive,
  onMountElement,
}: { 
  item: DockItemConfig, 
  mouseX: any,
  isActive: boolean,
  onMountElement?: (el: HTMLElement | null) => void,
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(
    distanceCalc,
    [-CURSOR_RADIUS, 0, CURSOR_RADIUS],
    ICON_SIZE_RANGE
  );

  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  if (item.isSeparator) {
    return (
      <div className="h-8 w-px bg-border/80 mx-1 shrink-0 self-center opacity-70" />
    );
  }

  const content = (
    <div className="relative flex flex-col items-center justify-end">
      <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-neutral-900/90 text-white text-xs rounded-md shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 flex items-center gap-1.5 backdrop-blur-sm border border-white/10">
        <span>{item.label}</span>
        {item.isFavorite && (
          <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-0.5">
            Favorit
          </span>
        )}
        {isActive && (
          <span className="text-[10px] font-semibold text-neutral-300">
            • Aktif
          </span>
        )}
      </div>
      <motion.div
        ref={ref}
        style={{ width, height: width, borderRadius: "9999px" }}
        className={`flex items-center justify-center cursor-pointer transition-colors relative z-20 rounded-full ${
          isActive 
            ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-950 shadow-md border-neutral-700/60 dark:border-neutral-300 ring-2 ring-neutral-400/30"
            : "bg-card/90 text-muted-foreground shadow-xs hover:bg-accent hover:text-foreground border-border hover:shadow-md"
        } backdrop-blur-md border`}
      >
        <item.icon
          className="w-1/2 h-1/2 shrink-0 pointer-events-none"
          strokeWidth={item.strokeWidth || 2}
        />
      </motion.div>
      {isActive && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-800 dark:bg-neutral-200 ring-2 ring-neutral-400/30 dark:ring-neutral-600/30 shadow-xs z-20" />
      )}
    </div>
  );

  if (item.onClick) {
    return (
      <button
        ref={onMountElement}
        type="button"
        onClick={item.onClick}
        className="relative group outline-none bg-transparent border-0 p-0 m-0 leading-none flex flex-col items-center justify-end shrink-0 cursor-pointer z-10 hover:z-30 transition-transform"
        aria-label={item.label}
      >
        {content}
      </button>
    );
  }

  const toPath = item.id.split("?")[0];
  const toSearch = item.id.includes("?")
    ? Object.fromEntries(new URLSearchParams(item.id.split("?")[1]))
    : undefined;

  return (
    <Link
      to={toPath}
      search={toSearch as any}
      className="relative group outline-none bg-transparent border-0 p-0 m-0 leading-none flex flex-col items-center justify-end shrink-0 z-10 hover:z-30 transition-transform"
    >
      {content}
    </Link>
  );
}

export function AppDock({
  onQuickCapture,
  onShortcut,
  onTerminal,
  onExpand,
  onRecent,
  onTaskbar,
  onSearch,
  isQuickCaptureOpen,
  isShortcutOpen,
  isTerminalOpen,
  isExpandOpen: propIsExpandOpen,
  isRecentOpen,
  isTaskbarOpen,
  sidebarShift = false,
}: {
  onQuickCapture?: () => void;
  onShortcut?: () => void;
  onTerminal?: () => void;
  onExpand?: () => void;
  onRecent?: () => void;
  onTaskbar?: () => void;
  onSearch?: () => void;
  isQuickCaptureOpen?: boolean;
  isShortcutOpen?: boolean;
  isTerminalOpen?: boolean;
  isExpandOpen?: boolean;
  isRecentOpen?: boolean;
  isTaskbarOpen?: boolean;
  sidebarShift?: boolean;
}) {
  const mouseX = useMotionValue(Infinity);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { favorites } = useFavorites();

  const [activeMode, setActiveMode] = useState<string>("personal");

  const [internalExpandOpen, setInternalExpandOpen] = useState(false);
  const isExpandOpen = propIsExpandOpen !== undefined ? propIsExpandOpen : internalExpandOpen;

  const [expandAnchorX, setExpandAnchorX] = useState<number | undefined>(undefined);
  const expandBtnRef = useRef<HTMLElement | null>(null);

  // State & timer auto-minimize ke iPhone home indicator bar (10 detik idle)
  const IDLE_TIMEOUT_MS = 10000;
  const { isMinimized, setIsMinimized } = useDockStore();
  const isHoveringDockRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAnyModalOpen = Boolean(
    isQuickCaptureOpen ||
    isShortcutOpen ||
    isTerminalOpen ||
    isExpandOpen ||
    isRecentOpen ||
    isTaskbarOpen
  );

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }

    // Jika kursor sedang di atas dock atau ada modal desktop aktif, jangan minimize
    if (isHoveringDockRef.current || isAnyModalOpen) {
      return;
    }

    idleTimerRef.current = setTimeout(() => {
      if (!isHoveringDockRef.current && !isAnyModalOpen) {
        setIsMinimized(true);
        mouseX.set(Infinity);
      }
    }, IDLE_TIMEOUT_MS);
  }, [isAnyModalOpen, mouseX]);

  // Jalankan timer saat mount
  useEffect(() => {
    resetIdleTimer();
    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [resetIdleTimer]);

  // Reset timer & pulihkan dock saat navigasi halaman berubah
  useEffect(() => {
    setIsMinimized(false);
    resetIdleTimer();
  }, [pathname, resetIdleTimer]);

  // Jika ada modal sistem terbuka, pastikan dock tidak terminimize
  useEffect(() => {
    if (isAnyModalOpen) {
      setIsMinimized(false);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }
    } else {
      resetIdleTimer();
    }
  }, [isAnyModalOpen, resetIdleTimer]);

  // Handler interaksi mouse dock
  const handleMouseEnterDock = () => {
    isHoveringDockRef.current = true;
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const handleMouseLeaveDock = () => {
    isHoveringDockRef.current = false;
    mouseX.set(Infinity);
    resetIdleTimer();
  };

  // Handler kursor diarahkan ke iPhone Home Bar
  const handleMouseEnterBar = () => {
    setIsMinimized(false);
    isHoveringDockRef.current = true;
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  const handleRestoreDock = () => {
    setIsMinimized(false);
    isHoveringDockRef.current = true;
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  };

  // Deteksi gestur mouse mendekati garis bawah layar ketika dalam kondisi minimized
  useEffect(() => {
    if (!isMinimized) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      const bottomThreshold = window.innerHeight - 26;
      const centerMinX = window.innerWidth * 0.25;
      const centerMaxX = window.innerWidth * 0.75;

      if (e.clientY >= bottomThreshold && e.clientX >= centerMinX && e.clientX <= centerMaxX) {
        handleMouseEnterBar();
      }
    };

    window.addEventListener("mousemove", handleWindowMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, [isMinimized]);

  // Event kustom untuk membuka/memulihkan dock dari komponen lain
  useEffect(() => {
    const handleOpenDock = () => {
      setIsMinimized(false);
      resetIdleTimer();
    };
    window.addEventListener("aio_open_dock", handleOpenDock);
    return () => window.removeEventListener("aio_open_dock", handleOpenDock);
  }, [resetIdleTimer]);

  const updateExpandPosition = () => {
    if (expandBtnRef.current) {
      const rect = expandBtnRef.current.getBoundingClientRect();
      setExpandAnchorX(rect.left + rect.width / 2);
    }
  };

  const handleToggleExpand = () => {
    updateExpandPosition();
    if (onExpand) {
      onExpand();
    } else {
      setInternalExpandOpen((prev) => !prev);
    }
  };

  const handleCloseExpand = () => {
    if (onExpand && propIsExpandOpen) {
      onExpand();
    } else {
      setInternalExpandOpen(false);
    }
  };

  useEffect(() => {
    if (isExpandOpen) {
      updateExpandPosition();
    }
  }, [isExpandOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (isExpandOpen) {
        updateExpandPosition();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isExpandOpen]);

  useEffect(() => {
    const handleOpen = () => {
      updateExpandPosition();
      if (onExpand) {
        onExpand();
      } else {
        setInternalExpandOpen(true);
      }
    };
    window.addEventListener("aio_open_expand", handleOpen);
    return () => window.removeEventListener("aio_open_expand", handleOpen);
  }, [onExpand]);

  useEffect(() => {
    const updateMode = () => {
      const mode = getRaw("client_os_active_mode") || "personal";
      setActiveMode(mode);
    };
    updateMode();
    window.addEventListener("storage", updateMode);
    window.addEventListener("aio_mode_changed", updateMode);
    return () => {
      window.removeEventListener("storage", updateMode);
      window.removeEventListener("aio_mode_changed", updateMode);
    };
  }, []);

  const { homeLauncherItems, valueMarketItems, mainDockItems } = useMemo(() => {
    const allItems = navKonsultan.flatMap((group) => group.items);

    // Base core apps
    const baseCoreApps: DockItemConfig[] = [
      { id: "/", label: "Launcher", icon: LayoutDashboard },
      { id: "/home", label: "Beranda", icon: Home },
    ];

    // Pinned Favorites (Maksimal 5 favorit di dock dengan icon & nama asli aplikasi)
    const dynamicFavs: DockItemConfig[] = favorites.slice(0, 5).map((favPath) => {
      const meta = getAppMetaByRoute(favPath);
      return {
        id: favPath,
        label: meta.label,
        icon: meta.icon,
        isFavorite: true,
        iconColor: meta.iconColor,
        accentGradient: meta.accentGradient,
      };
    });

    // Desktop System Utility Modals
    const utilityModals: DockItemConfig[] = [
      {
        id: "recent",
        label: "Recent",
        icon: History,
        onClick: () => {
          if (onRecent) onRecent();
          else window.dispatchEvent(new CustomEvent("aio_open_recent"));
        },
      },
      {
        id: "taskbar",
        label: "Taskbar",
        icon: GalleryHorizontal,
        onClick: () => {
          if (onTaskbar) onTaskbar();
          else window.dispatchEvent(new CustomEvent("aio_open_taskbar"));
        },
      },
      {
        id: "/shortcut",
        label: "Shortcut",
        icon: CornerUpRight,
        onClick: () => {
          if (onShortcut) onShortcut();
          else window.dispatchEvent(new CustomEvent("aio_open_shortcut"));
        },
      },
      {
        id: "quick-capture",
        label: "Quick Capture (+)",
        icon: Plus,
        onClick: () => {
          if (onQuickCapture) onQuickCapture();
          else window.dispatchEvent(new CustomEvent("aio_open_quick_capture"));
        },
      },
      {
        id: "/terminal",
        label: "Terminal",
        icon: Terminal,
        onClick: () => {
          if (onTerminal) onTerminal();
          else window.dispatchEvent(new CustomEvent("aio_open_terminal"));
        },
      },
      {
        id: "expand",
        label: "Expand",
        icon: ChevronsUp,
        strokeWidth: 2.5,
        onClick: handleToggleExpand,
      },
    ];

    const homeLauncherItems: DockItemConfig[] = [
      { id: "/", label: "Launcher", icon: LayoutDashboard },
      { id: "/home", label: "Beranda", icon: Home },
    ];

    // Ketika menu yang dipilih terbuka (bukan di launcher /), opsi Search pindah di samping kanan Home
    if (pathname !== "/") {
      homeLauncherItems.push({
        id: "search",
        label: "Pencarian (Search)",
        icon: Search,
        onClick: () => {
          if (onSearch) onSearch();
          else window.dispatchEvent(new CustomEvent("aio_open_search"));
        },
      });
    }

    // Pill Bar 2: Applied Value & Monitor Price (Makro & Nilai Inti) - Gaya selaras dengan seluruh icon dock
    const valueMarketItems: DockItemConfig[] = [
      {
        id: "/value-treated",
        label: "Applied Value",
        icon: Gem,
        strokeWidth: 2,
        isActive:
          pathname === "/value-treated" ||
          (pathname === "/" &&
            typeof window !== "undefined" &&
            (window.location.search.includes("valuetreated") ||
              window.location.search.includes("applied"))),
      },
      {
        id: "/100-komoditas",
        label: "Monitor Price",
        icon: TrendingUp,
        strokeWidth: 2,
        isActive:
          pathname === "/100-komoditas" ||
          pathname === "/commodity-dashboard" ||
          (pathname === "/" &&
            typeof window !== "undefined" &&
            (window.location.search.includes("commodity") ||
              window.location.search.includes("100-komoditas"))),
      },
    ];

    const mainDockItems: DockItemConfig[] = [];
    if (dynamicFavs.length > 0) {
      mainDockItems.push(...dynamicFavs);
      mainDockItems.push({
        id: "dock-sep-fav",
        label: "",
        icon: () => null,
        isSeparator: true,
      });
    }
    mainDockItems.push(...utilityModals);

    return { homeLauncherItems, valueMarketItems, mainDockItems };
  }, [
    pathname,
    favorites,
    activeMode,
    onQuickCapture,
    onShortcut,
    onTerminal,
    onRecent,
    onTaskbar,
    onSearch,
    handleToggleExpand,
  ]);

  if (homeLauncherItems.length === 0 && valueMarketItems.length === 0 && mainDockItems.length === 0) return null;

  const renderDockIconItem = (item: DockItemConfig) => {
    if (item.isSeparator) {
      return (
        <div
          key={item.id}
          className="h-8 w-px bg-border/80 mx-1 shrink-0 self-center opacity-70 relative z-10"
        />
      );
    }

    let isActive =
      item.isActive !== undefined
        ? item.isActive
        : pathname === item.id ||
          (item.id.startsWith("/") && item.id !== "/" && pathname.startsWith(item.id));

    if (item.id === "recent") {
      isActive = Boolean(isRecentOpen);
    } else if (item.id === "taskbar") {
      isActive = Boolean(isTaskbarOpen);
    } else if (item.id === "quick-capture") {
      isActive = Boolean(isQuickCaptureOpen);
    } else if (item.id === "/shortcut") {
      isActive = Boolean(isShortcutOpen) || pathname === "/shortcut";
    } else if (item.id === "/terminal") {
      isActive = Boolean(isTerminalOpen) || pathname === "/terminal";
    } else if (item.id === "expand") {
      isActive = Boolean(isExpandOpen);
    }

    return (
      <DockIcon 
        key={item.id} 
        item={item} 
        mouseX={mouseX} 
        isActive={isActive}
        onMountElement={item.id === "expand" ? (el) => { expandBtnRef.current = el; } : undefined}
      />
    );
  };

  const dockSpring = {
    type: "spring" as const,
    stiffness: 350,
    damping: 26,
    mass: 0.8,
  };

  const barSpring = {
    type: "spring" as const,
    stiffness: 380,
    damping: 28,
    mass: 0.7,
  };

  return (
    <>
      <div
        className={`fixed z-50 flex items-center justify-center gap-2.5 sm:gap-3 max-w-[95vw] pointer-events-none transition-all duration-300 ease-out ${
          isMinimized ? "bottom-2" : "bottom-5"
        }`}
        style={{
          left: sidebarShift ? "calc(50% + 37.5px)" : "50%",
          transform: "translateX(-50%)",
        }}
        onMouseMove={(e) => {
          if (!isMinimized) mouseX.set(e.pageX);
        }}
        onMouseLeave={() => {
          if (!isMinimized) mouseX.set(Infinity);
        }}
      >
        {/* Pill Bar 1: Home & Launcher (Terpisah Mandiri) */}
        <motion.div
          initial={false}
          animate={
            isMinimized
              ? {
                  y: 42,
                  opacity: 0,
                  scale: 0.9,
                  pointerEvents: "none",
                }
              : {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  pointerEvents: "auto",
                }
          }
          transition={dockSpring}
          onMouseEnter={handleMouseEnterDock}
          onMouseLeave={handleMouseLeaveDock}
          className="pointer-events-auto flex items-end gap-2 px-3 pb-2.5 h-16 rounded-[28px] liquid-glass-dock overflow-visible relative shadow-lg"
        >
          {homeLauncherItems.map(renderDockIconItem)}
        </motion.div>

        {/* Pill Bar 2: Applied Value & Monitor Price (Terpisah Mandiri) */}
        <motion.div
          initial={false}
          animate={
            isMinimized
              ? {
                  y: 42,
                  opacity: 0,
                  scale: 0.9,
                  pointerEvents: "none",
                }
              : {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  pointerEvents: "auto",
                }
          }
          transition={dockSpring}
          onMouseEnter={handleMouseEnterDock}
          onMouseLeave={handleMouseLeaveDock}
          className="pointer-events-auto flex items-end gap-2 px-3 pb-2.5 h-16 rounded-[28px] liquid-glass-dock overflow-visible relative shadow-lg"
        >
          {valueMarketItems.map(renderDockIconItem)}
        </motion.div>

        {/* Pill Bar 3: Pinned Favorites & System Utilities */}
        <motion.div
          initial={false}
          animate={
            isMinimized
              ? {
                  y: 42,
                  opacity: 0,
                  scale: 0.9,
                  pointerEvents: "none",
                }
              : {
                  y: 0,
                  opacity: 1,
                  scale: 1,
                  pointerEvents: "auto",
                }
          }
          transition={dockSpring}
          onMouseEnter={handleMouseEnterDock}
          onMouseLeave={handleMouseLeaveDock}
          className="pointer-events-auto flex items-end gap-2.5 px-3.5 pb-2.5 h-16 rounded-[28px] liquid-glass-dock overflow-visible relative shadow-lg"
        >
          {mainDockItems.map(renderDockIconItem)}
        </motion.div>

        {/* iPhone Home Indicator Bar (Garis tipis di bawah yang responsif tema dark/light) */}
        <motion.div
          initial={false}
          animate={
            isMinimized
              ? {
                  y: 0,
                  opacity: 1,
                  scaleX: 1,
                  scaleY: 1,
                  pointerEvents: "auto",
                }
              : {
                  y: 28,
                  opacity: 0,
                  scaleX: 0.5,
                  scaleY: 0.5,
                  pointerEvents: "none",
                }
          }
          transition={barSpring}
          onMouseEnter={handleMouseEnterBar}
          onClick={handleRestoreDock}
          onTouchStart={handleMouseEnterBar}
          className="absolute left-1/2 -translate-x-1/2 bottom-0 py-1.5 px-8 cursor-pointer group flex items-center justify-center z-50 pointer-events-auto"
          aria-label="Arahkan kursor atau klik untuk membuka Dock"
          title="Arahkan kursor ke garis untuk membuka Dock"
        >
          {/* Garis tipis khas iPhone Home Bar dengan visual liquid-glass beradaptasi dark / light */}
          <div className="w-36 sm:w-44 h-[5px] rounded-full bg-neutral-900/40 dark:bg-white/45 backdrop-blur-md shadow-xs transition-all duration-300 ease-out group-hover:scale-x-115 group-hover:h-[6px] group-hover:bg-neutral-950/85 dark:group-hover:bg-white/90 group-hover:shadow-[0_0_14px_rgba(0,0,0,0.22)] dark:group-hover:shadow-[0_0_14px_rgba(255,255,255,0.45)] ring-1 ring-black/5 dark:ring-white/10" />
        </motion.div>
      </div>

      <MacExpandStack
        isOpen={isExpandOpen}
        onClose={handleCloseExpand}
        anchorX={expandAnchorX}
      />
    </>
  );
}
