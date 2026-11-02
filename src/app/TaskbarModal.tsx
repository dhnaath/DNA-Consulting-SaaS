import { useState, useMemo, useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  GalleryHorizontal,
  X,
  Layers,
  CheckSquare,
  Plus,
  ArrowRight,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Compass,
  Briefcase,
  Home,
  Check,
} from "lucide-react";
import { isNewlyRevisedApp } from "@/utils/revisedAppsMarker";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { useProgressiveBlurSetting } from "@/hooks/useProgressiveBlurSetting";
import { getRaw, setRaw } from "../core/rawStorage";

interface TaskbarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkspaceWindow {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  icon: any;
  category: string;
  badge?: string;
}

interface QuickTask {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const STORAGE_TASKBAR_TASKS = "aio_taskbar_active_tasks";

const DEFAULT_TASKS: QuickTask[] = [
  { id: "1", text: "Tinjau alokasi aset kuartal ini", completed: false, createdAt: Date.now() - 3600000 },
  { id: "2", text: "Finalisasi rencana strategis Mini MBA", completed: true, createdAt: Date.now() - 7200000 },
  { id: "3", text: "Perbarui notula rapat mitra eksternal", completed: false, createdAt: Date.now() - 1800000 },
];

export function TaskbarModal({ isOpen, onClose }: TaskbarModalProps) {
  const navigate = useNavigate();
  const { config: blurConfig, blurLevels } = useProgressiveBlurSetting();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const [activeTab, setActiveTab] = useState<"switcher" | "tasks">("switcher");
  const [newTaskInput, setNewTaskInput] = useState("");
  const [activeMode, setActiveMode] = useState<string>("personal");

  // Load quick tasks from localStorage
  const [tasks, setTasks] = useState<QuickTask[]>(() => {
    try {
      const saved = getRaw(STORAGE_TASKBAR_TASKS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  useEffect(() => {
    try {
      setRaw(STORAGE_TASKBAR_TASKS, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save taskbar tasks", e);
    }
  }, [tasks]);

  useEffect(() => {
    const updateMode = () => {
      const mode = getRaw("client_os_active_mode") || "personal";
      setActiveMode(mode);
    };
    updateMode();
    window.addEventListener("aio_mode_changed", updateMode);
    return () => window.removeEventListener("aio_mode_changed", updateMode);
  }, []);

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

  // Primary Workspace Windows
  const primaryWindows: WorkspaceWindow[] = useMemo(
    () => [
      {
        id: "launcher",
        title: "Launcher Modul",
        subtitle: "Pusat peluncur navigasi kerja konsultan",
        to: "/",
        icon: LayoutDashboard,
        category: "System",
        badge: "Pusat Modul",
      },
      {
        id: "home",
        title: "Beranda Eksekutif",
        subtitle: "Ringkasan metrik harian & KPI",
        to: "/home",
        icon: Home,
        category: "Executive",
      },
      {
        id: "finance",
        title: "Financial Planning",
        subtitle: "Neraca aset, liabilitas, dan arus kas",
        to: "/asset",
        icon: Wallet,
        category: "Finance",
      },
      {
        id: "wealth",
        title: "Wealth Management",
        subtitle: "Kurasi spektrum nilai & valuasi MAPPI",
        to: "/kurasi-wealth",
        icon: TrendingUp,
        category: "Wealth",
      },
      {
        id: "mba",
        title: "Mini MBA (100 Tools)",
        subtitle: "Framework bisnis, model & strategi eksekutif",
        to: "/100-framework",
        icon: Compass,
        category: "Frameworks",
      },
      {
        id: "projects",
        title: "Proyek & Operasional",
        subtitle: "Manajemen eksekusi alur kerja tim",
        to: "/proyek",
        icon: Briefcase,
        category: "Operations",
      },
    ],
    []
  );

  const handleSwitchWindow = (to: string) => {
    onClose();
    const toPath = to.split("?")[0];
    const toSearch = to.includes("?")
      ? Object.fromEntries(new URLSearchParams(to.split("?")[1]))
      : undefined;
    navigate({ to: toPath as any, search: toSearch as any });
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    const newTask: QuickTask = {
      id: Date.now().toString(),
      text: newTaskInput.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskInput("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const activePendingTasksCount = tasks.filter((t) => !t.completed).length;

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
                      <GalleryHorizontal className="size-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight flex items-center gap-1.5">
                        Taskbar & Switcher
                        <span className="text-[9px] font-medium px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Live
                        </span>
                      </h3>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        Manajemen ruang kerja aktif
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>

                {/* Segmented control */}
                <div className="grid grid-cols-2 gap-1 p-0.5 bg-neutral-100 dark:bg-zinc-800 rounded-xl border border-neutral-200/60 dark:border-zinc-700/60">
                  <button
                    type="button"
                    onClick={() => setActiveTab("switcher")}
                    className={`flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                      activeTab === "switcher"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <Layers className="size-3" />
                    <span>Ruang Kerja</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("tasks")}
                    className={`flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
                      activeTab === "tasks"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    <CheckSquare className="size-3" />
                    <span>Tugas ({activePendingTasksCount})</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: Switcher (Workspace Cards) */}
              {activeTab === "switcher" && (
                <div className="flex-1 overflow-y-auto p-1 pt-2 space-y-1.5 max-h-[46vh] no-scrollbar">
                  <div className="flex flex-col gap-1.5 px-0.5">
                    {primaryWindows.map((win) => {
                      const isCurrent =
                        pathname === win.to ||
                        (win.to !== "/" && pathname.startsWith(win.to));
                      const Icon = win.icon;
                      const isRevised = isNewlyRevisedApp(win.to, win.title);

                      return (
                        <button
                          key={win.id}
                          type="button"
                          onClick={() => handleSwitchWindow(win.to)}
                          className={`group flex items-center justify-between w-full px-3 py-2 rounded-2xl text-left transition-all duration-150 select-none cursor-pointer border ${
                            isCurrent
                              ? "bg-primary/10 border-primary/40 ring-1 ring-primary/20 text-neutral-900 dark:text-white shadow-xs"
                              : "bg-neutral-50 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 shadow-xs hover:bg-neutral-100 dark:hover:bg-zinc-700 hover:text-neutral-900 dark:hover:text-white border-neutral-200/70 dark:border-zinc-700/60"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 pr-1">
                            <div
                              className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 ${
                                isCurrent
                                  ? "bg-primary text-primary-foreground shadow-2xs"
                                  : isRevised
                                  ? "bg-white text-zinc-950 border border-zinc-300 dark:border-white shadow-2xs"
                                  : "bg-white dark:bg-zinc-700 text-neutral-500 dark:text-neutral-300 shadow-2xs border border-neutral-200/50 dark:border-zinc-600/50 group-hover:scale-105"
                              }`}
                            >
                              <Icon className="size-4 shrink-0" strokeWidth={2.2} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[13px] font-medium tracking-tight truncate leading-tight text-neutral-800 dark:text-neutral-100 group-hover:text-neutral-900 dark:group-hover:text-white">
                                {win.title}
                              </span>
                              <span className="text-[10.5px] truncate leading-tight mt-0.5 text-neutral-500 dark:text-neutral-400">
                                {win.subtitle}
                              </span>
                            </div>
                          </div>

                          {isCurrent ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground shadow-2xs">
                              Aktif
                            </span>
                          ) : (
                            <ArrowRight className="size-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Running Tasks & Active Session */}
              {activeTab === "tasks" && (
                <div className="flex-1 overflow-y-auto p-1 pt-2 flex flex-col max-h-[46vh] no-scrollbar">
                  {/* Quick Task Input Form */}
                  <form onSubmit={handleAddTask} className="flex gap-1.5 mb-2.5 px-0.5">
                    <input
                      type="text"
                      placeholder="Catat tugas cepat..."
                      value={newTaskInput}
                      onChange={(e) => setNewTaskInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl text-xs bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 focus:outline-none focus:ring-1.5 focus:ring-primary/40 placeholder:text-neutral-400 text-neutral-800 dark:text-neutral-100 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!newTaskInput.trim()}
                      className="px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
                    >
                      <Plus className="size-3.5" />
                      <span>Catat</span>
                    </button>
                  </form>

                  {/* Task list */}
                  <div className="flex-1 overflow-y-auto space-y-1.5 px-0.5">
                    {tasks.length === 0 ? (
                      <div className="py-6 text-center text-neutral-400">
                        <CheckSquare className="size-6 mx-auto mb-1.5 opacity-50" />
                        <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
                          Tidak ada tugas aktif
                        </p>
                        <p className="text-[10px] mt-0.5 text-neutral-500">
                          Gunakan kolom di atas untuk mencatat tugas berjalan.
                        </p>
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`group flex items-center justify-between p-2 rounded-2xl border transition-all ${
                            task.completed
                              ? "bg-neutral-50/50 dark:bg-zinc-800/40 border-transparent text-neutral-400 opacity-60"
                              : "bg-neutral-50 dark:bg-zinc-800 border-neutral-200/70 dark:border-zinc-700/60 text-neutral-800 dark:text-neutral-200"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleTask(task.id)}
                            className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                          >
                            <div
                              className={`size-4 rounded-md border flex items-center justify-center transition-colors ${
                                task.completed
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-neutral-300 dark:border-zinc-600 hover:border-primary"
                              }`}
                            >
                              {task.completed && <Check className="size-3 stroke-[3]" />}
                            </div>
                            <span
                              className={`text-xs truncate ${
                                task.completed ? "line-through opacity-70" : "font-medium"
                              }`}
                            >
                              {task.text}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteTask(task.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-500 rounded-md transition-all ml-1"
                            title="Hapus tugas"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Clear completed button */}
                  {tasks.some((t) => t.completed) && (
                    <div className="pt-2 mt-2 border-t border-neutral-200/60 dark:border-zinc-800/60 flex justify-end px-1">
                      <button
                        type="button"
                        onClick={() => setTasks((prev) => prev.filter((t) => !t.completed))}
                        className="text-[10px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                      >
                        Bersihkan tugas yang selesai
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Progressive Blur (respects master setting) */}
              {blurConfig.enabled && (
                <ProgressiveBlur
                  direction="bottom"
                  height={24}
                  blurLevels={blurLevels.length > 0 ? blurLevels.slice(0, 4) : [0.5, 1, 2, 4]}
                  tint={blurConfig.tint ? "linear-gradient(to bottom, transparent, hsl(var(--card) / 0.85))" : false}
                  className="absolute bottom-0 inset-x-0 pointer-events-none"
                />
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
