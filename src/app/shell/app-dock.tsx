import { useRef, useMemo, useState, useEffect } from "react";
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
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
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
          <span className="text-[10px] text-blue-300 font-semibold">• Aktif</span>
        )}
      </div>
      <motion.div
        ref={ref}
        style={{ width, height: width, borderRadius: "9999px" }}
        className={`flex items-center justify-center cursor-pointer transition-colors relative z-20 rounded-full ${
          isActive 
            ? "gradient-primary bg-primary text-primary-foreground shadow-lg shadow-primary/30 border-white/30 ring-2 ring-primary/40" 
            : "bg-card/90 text-muted-foreground shadow-xs hover:bg-accent hover:text-foreground border-border hover:shadow-md"
        } backdrop-blur-md border`}
      >
        <item.icon
          className={`w-1/2 h-1/2 shrink-0 pointer-events-none ${
            !isActive && item.iconColor ? item.iconColor : ""
          }`}
          strokeWidth={item.strokeWidth || 2}
        />
      </motion.div>
      {isActive && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-primary/30 shadow-xs z-20" />
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

  const dockItems = useMemo(() => {
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

    // Assemble the dock items:
    // 1. Core items (Launcher, Beranda)
    // 2. Separator garis lurus
    // 3. Pinned Favorites (5 favorit terpisah dengan garis lurus tanpa emblem bintang)
    // 4. Separator garis lurus
    // 5. Utility tools (Recent, Taskbar, Shortcut, Quick Capture, Terminal, Expand)
    const items: DockItemConfig[] = [...baseCoreApps];

    const makeSeparator = (id: string): DockItemConfig => ({
      id,
      label: "",
      icon: () => null,
      isSeparator: true,
    });

    if (dynamicFavs.length > 0) {
      items.push(makeSeparator("dock-sep-fav-left"));
      items.push(...dynamicFavs);
      items.push(makeSeparator("dock-sep-fav-right"));
    } else {
      items.push(makeSeparator("dock-separator"));
    }

    items.push(...utilityModals);
    return items;
  }, [
    pathname,
    favorites,
    activeMode,
    onQuickCapture,
    onShortcut,
    onTerminal,
    onRecent,
    onTaskbar,
    handleToggleExpand,
  ]);

  if (dockItems.length === 0) return null;

  return (
    <>
      <div
        className="fixed bottom-5 z-50 flex items-center justify-center max-w-[95vw] pointer-events-none transition-[left] duration-300 ease-in-out"
        style={{
          left: sidebarShift ? "calc(50% + 37.5px)" : "50%",
          transform: "translateX(-50%)",
        }}
      >
        <motion.div
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="pointer-events-auto flex items-end gap-2.5 px-3.5 pb-2.5 h-16 rounded-[28px] liquid-glass-dock overflow-visible relative"
        >
          {dockItems.map((item) => {
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
          })}
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
