import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import {
  CheckSquare,
  NotebookText,
  CalendarDays,
  Wallet,
  Grid2X2,
  type LucideIcon,
} from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { navKonsultan } from "@/config/nav";
import { getAppMetaByRoute } from "@/utils/appLookup";

export interface ExpandAppItem {
  id: string;
  label: string;
  to: string;
  icon: LucideIcon;
  gradient?: string;
  category?: string;
}

const DEFAULT_EXPAND_APPS: ExpandAppItem[] = [
  {
    id: "/task-manager",
    label: "Task Manager",
    to: "/task-manager",
    icon: CheckSquare,
    category: "Produktivitas",
  },
  {
    id: "/catatan",
    label: "Catatan & Dokumen",
    to: "/catatan",
    icon: NotebookText,
    category: "Workspace",
  },
  {
    id: "/kalender",
    label: "Kalender & Jadwal",
    to: "/kalender",
    icon: CalendarDays,
    category: "Waktu & Agenda",
  },
  {
    id: "/budget",
    label: "Keuangan & Budget",
    to: "/budget",
    icon: Wallet,
    category: "Finansial",
  },
  {
    id: "/100-framework",
    label: "100 Framework Bisnis",
    to: "/100-framework",
    icon: Grid2X2,
    category: "Strategi & Analisis",
  },
];

interface MacExpandStackProps {
  isOpen: boolean;
  onClose: () => void;
  anchorX?: number; // Screen X position of the Expand dock icon
}

export function MacExpandStack({
  isOpen,
  onClose,
  anchorX,
}: MacExpandStackProps) {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Compute up to 5 apps (favoring user favorites, then defaults)
  const favoriteApps: ExpandAppItem[] = favorites
    .map((favPath) => {
      const meta = getAppMetaByRoute(favPath);
      return {
        id: favPath,
        label: meta.label,
        to: favPath,
        icon: meta.icon as any,
        category: "Favorit",
        gradient: meta.accentGradient,
      };
    })
    .filter(Boolean) as ExpandAppItem[];

  // Combine favorite apps with default apps up to strictly 5 apps maximum
  const combinedApps: ExpandAppItem[] = [...favoriteApps];
  for (const defApp of DEFAULT_EXPAND_APPS) {
    if (combinedApps.length >= 5) break;
    if (!combinedApps.some((a) => a.to === defApp.to)) {
      combinedApps.push(defApp);
    }
  }
  const apps = combinedApps.slice(0, 5);

  const handleSelect = (to: string) => {
    navigate({ to });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Click outside overlay to dismiss - no blur */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Expand Card anchored directly above the Expand dock icon - solid background without blur */}
          <div
            className="fixed z-50 pointer-events-auto"
            style={{
              bottom: "82px",
              left: anchorX !== undefined ? `${anchorX}px` : "50%",
              transform: "translateX(-50%)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="w-72 sm:w-80 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-2xl p-2 flex flex-col overflow-hidden cursor-default text-left select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Focus Rows List - Clean & lightweight without blur */}
              <div className="flex flex-col gap-1.5 px-0.5 py-0.5">
                {apps.map((app) => (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => handleSelect(app.to)}
                    className="group flex items-center justify-between w-full px-3 py-2 rounded-2xl text-left transition-all duration-150 select-none cursor-pointer border bg-neutral-50 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 shadow-xs hover:bg-neutral-100 dark:hover:bg-zinc-700 hover:text-neutral-900 dark:hover:text-white border-neutral-200/70 dark:border-zinc-700/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 bg-white dark:bg-zinc-700 text-neutral-500 dark:text-neutral-300 shadow-2xs border border-neutral-200/50 dark:border-zinc-600/50 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:scale-105">
                        <app.icon className="size-4 shrink-0" strokeWidth={2.2} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13.5px] font-medium tracking-tight truncate leading-tight text-neutral-800 dark:text-neutral-100 group-hover:text-neutral-900 dark:group-hover:text-white">
                          {app.label}
                        </span>
                        <span className="text-[10.5px] truncate leading-tight mt-0.5 text-neutral-500 dark:text-neutral-400">
                          {app.category || "Aplikasi"}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
