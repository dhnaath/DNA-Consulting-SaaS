import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  History,
  X,
  Search,
  Trash2,
  Star,
  Clock,
  Sparkles,
  LayoutDashboard,
  Compass,
} from "lucide-react";
import { useRecentApps, type RecentAppItem } from "@/hooks/useRecentApps";
import { useFavorites } from "@/hooks/useFavorites";
import { navKonsultan, type NavItem } from "@/config/nav";
import { isNewlyRevisedApp } from "@/utils/revisedAppsMarker";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { useProgressiveBlurSetting } from "@/hooks/useProgressiveBlurSetting";

interface RecentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecentModal({ isOpen, onClose }: RecentModalProps) {
  const navigate = useNavigate();
  const { config: blurConfig, blurLevels } = useProgressiveBlurSetting();
  const { recentApps, removeRecentApp, clearRecentApps, addRecentApp } = useRecentApps();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [search, setSearch] = useState("");

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lookup map for nav items to get their actual icon and label
  const navMap = useMemo(() => {
    const map = new Map<string, NavItem>();
    navKonsultan.forEach((g) => {
      g.items.forEach((item) => {
        if (!map.has(item.to)) {
          map.set(item.to, item);
        }
      });
    });
    return map;
  }, []);

  const filteredApps = useMemo(() => {
    if (!search.trim()) return recentApps;
    const q = search.toLowerCase();
    return recentApps.filter(
      (app) =>
        app.label.toLowerCase().includes(q) ||
        app.to.toLowerCase().includes(q) ||
        (app.category && app.category.toLowerCase().includes(q))
    );
  }, [recentApps, search]);

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / (60 * 1000));
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins} mnt lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hr lalu`;
  };

  const handleOpenApp = (app: RecentAppItem) => {
    addRecentApp({ to: app.to, label: app.label, category: app.category });
    onClose();
    const toPath = app.to.split("?")[0];
    const toSearch = app.to.includes("?")
      ? Object.fromEntries(new URLSearchParams(app.to.split("?")[1]))
      : undefined;
    navigate({ to: toPath as any, search: toSearch as any });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Click outside overlay to dismiss - no blur or black overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={onClose}
          />

          {/* Floating Stack anchored directly above dock */}
          <div className="fixed bottom-[82px] left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="w-80 sm:w-96 rounded-3xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 shadow-2xl p-2.5 flex flex-col overflow-hidden cursor-default text-left select-none max-h-[75vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-2 pt-1 pb-1.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="size-7 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                      <History className="size-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">
                          Recent Apps
                        </h3>
                        <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-zinc-700/60">
                          {recentApps.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        Riwayat aktivitas terakhir
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {recentApps.length > 0 && (
                      <button
                        type="button"
                        onClick={clearRecentApps}
                        title="Hapus riwayat"
                        className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>

                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Cari riwayat..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 transition-all"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* List of Recent Apps */}
              <div className="relative flex-1 min-h-0 pt-2">
                <div className="flex flex-col gap-1.5 overflow-y-auto px-0.5 max-h-[46vh] no-scrollbar">
                  {filteredApps.length === 0 ? (
                    <div className="py-6 px-4 text-center">
                      <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-zinc-800 text-neutral-400 flex items-center justify-center mx-auto mb-2">
                        <Clock className="size-4 opacity-60" />
                      </div>
                      <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
                        {search ? "Tidak ada riwayat yang cocok" : "Belum ada riwayat"}
                      </p>
                      <p className="text-[10px] text-neutral-500 max-w-[200px] mx-auto">
                        Aplikasi yang Anda akses akan muncul di sini.
                      </p>
                    </div>
                  ) : (
                    filteredApps.map((app, idx) => {
                      const navItem = navMap.get(app.to);
                      const AppIcon = navItem?.icon || History;
                      const isFav = isFavorite(app.to);

                      return (
                        <div
                          key={app.id || `${app.to}-${app.timestamp || idx}`}
                          onClick={() => handleOpenApp(app)}
                          className="group flex items-center justify-between w-full px-3 py-2 rounded-2xl text-left transition-all duration-150 select-none cursor-pointer border bg-neutral-50 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 shadow-xs hover:bg-neutral-100 dark:hover:bg-zinc-700 hover:text-neutral-900 dark:hover:text-white border-neutral-200/70 dark:border-zinc-700/60"
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-1">
                            <div className="size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 bg-white dark:bg-zinc-700 text-neutral-500 dark:text-neutral-300 shadow-2xs border border-neutral-200/50 dark:border-zinc-600/50 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:scale-105">
                              <AppIcon className="size-4 shrink-0" strokeWidth={2.2} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-medium tracking-tight truncate leading-tight text-neutral-800 dark:text-neutral-100 group-hover:text-neutral-900 dark:group-hover:text-white">
                                  {app.label}
                                </span>
                                {app.category && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-white dark:bg-zinc-700 text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-zinc-600/50 shrink-0">
                                    {app.category}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                                <span>{formatRelativeTime(app.visitedAt || app.timestamp || Date.now())}</span>
                                <span className="opacity-40">•</span>
                                <span className="font-mono text-[9px] opacity-70 truncate max-w-[110px]">
                                  {app.to}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(app.to);
                              }}
                              title={isFav ? "Hapus dari favorit dock" : "Pin ke favorit dock"}
                              className={`p-1 rounded-lg transition-colors ${
                                isFav
                                  ? "text-amber-500 hover:bg-amber-500/10"
                                  : "text-neutral-400 hover:text-amber-500"
                              }`}
                            >
                              <Star className={`size-3.5 ${isFav ? "fill-amber-500" : ""}`} />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeRecentApp(app.to);
                              }}
                              title="Hapus item ini"
                              className="p-1 rounded-lg text-neutral-400 hover:text-rose-500 transition-colors"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {blurConfig.enabled && (
                  <ProgressiveBlur
                    direction="bottom"
                    height={24}
                    blurLevels={blurLevels.length > 0 ? blurLevels.slice(0, 4) : [0.5, 1, 2, 4]}
                    tint={blurConfig.tint ? "linear-gradient(to bottom, transparent, hsl(var(--card) / 0.85))" : false}
                    className="absolute bottom-0 inset-x-0 pointer-events-none"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
