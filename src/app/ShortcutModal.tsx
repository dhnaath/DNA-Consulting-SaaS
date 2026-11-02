import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { useProgressiveBlurSetting } from "@/hooks/useProgressiveBlurSetting";
import {
  CornerUpRight,
  X,
  Search,
  Home,
  LayoutDashboard,
  CalendarDays,
  Briefcase,
  Wallet,
  ShoppingBag,
  Plus,
  Command,
  FolderKanban,
  FileText,
  Users,
  Compass,
  ArrowRight,
  History,
  GalleryHorizontal,
  ExternalLink,
  Pill,
  Landmark,
  Scale,
  BarChart3,
  Globe,
  ShieldCheck,
  Sprout,
  Database,
  BookOpen,
  FileCheck,
  Figma,
} from "lucide-react";

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickCapture?: () => void;
}

interface ShortcutItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "nav" | "action" | "key" | "external";
  icon: any;
  to?: string;
  externalUrl?: string;
  action?: () => void;
  badge?: string;
}

export function ShortcutModal({ isOpen, onClose, onOpenQuickCapture }: ShortcutModalProps) {
  const navigate = useNavigate();
  const { config: blurConfig, blurLevels } = useProgressiveBlurSetting();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "nav" | "action" | "external">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open & close on escape
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

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

  const shortcuts: ShortcutItem[] = useMemo(
    () => [
      {
        id: "home",
        title: "Beranda Eksekutif",
        subtitle: "Dashboard ringkasan harian & KPI",
        category: "nav",
        icon: Home,
        to: "/home",
        badge: "Alt + H",
      },
      {
        id: "launcher",
        title: "Launcher Aplikasi",
        subtitle: "Pusat modul & portal kerja konsultan",
        category: "nav",
        icon: LayoutDashboard,
        to: "/",
        badge: "Alt + L",
      },
      {
        id: "recent",
        title: "Recent Apps & History",
        subtitle: "Buka riwayat navigasi dan aplikasi terakhir",
        category: "action",
        icon: History,
        action: () => {
          onClose();
          window.dispatchEvent(new CustomEvent("aio_open_recent"));
        },
        badge: "Recent",
      },
      {
        id: "taskbar",
        title: "Taskbar & Multitasking",
        subtitle: "Pengalih jendela aktif & tugas berjalan",
        category: "action",
        icon: GalleryHorizontal,
        action: () => {
          onClose();
          window.dispatchEvent(new CustomEvent("aio_open_taskbar"));
        },
        badge: "Taskbar",
      },
      {
        id: "quick-capture",
        title: "Quick Capture (+)",
        subtitle: "Catat tugas, transaksi, catatan & habit",
        category: "action",
        icon: Plus,
        action: () => {
          onClose();
          if (onOpenQuickCapture) onOpenQuickCapture();
        },
        badge: "Q",
      },
      {
        id: "command-palette",
        title: "Command Palette",
        subtitle: "Pencarian global dan eksekusi perintah cepat",
        category: "action",
        icon: Command,
        action: () => {
          onClose();
          window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
          );
        },
        badge: "⌘K",
      },
      {
        id: "kalender",
        title: "Kalender & Jadwal",
        subtitle: "Agenda rapat klien & event penting",
        category: "nav",
        icon: CalendarDays,
        to: "/kalender",
        badge: "Alt + K",
      },
      {
        id: "proyek",
        title: "Proyek & Engagement",
        subtitle: "Manajemen portofolio & deliverable",
        category: "nav",
        icon: Briefcase,
        to: "/proyek",
      },
      {
        id: "finance",
        title: "Keuangan & Kas",
        subtitle: "Arus kas, honor konsultan & beban operasional",
        category: "nav",
        icon: Wallet,
        to: "/finance",
      },
      {
        id: "shopping",
        title: "Kebutuhan Belanja",
        subtitle: "Daftar pengadaan, logistik & belanja",
        category: "nav",
        icon: ShoppingBag,
        to: "/shopping",
      },
      {
        id: "notes",
        title: "Catatan & Dokumen",
        subtitle: "Notulensi rapat dan basis pengetahuan",
        category: "nav",
        icon: FileText,
        to: "/notes",
      },
      {
        id: "task-manager",
        title: "Task Manager",
        subtitle: "Kanban board & status pengerjaan",
        category: "nav",
        icon: FolderKanban,
        to: "/task-manager",
      },
      {
        id: "client-hub",
        title: "Client Hub",
        subtitle: "Direktori klien dan riwayat engagement",
        category: "nav",
        icon: Users,
        to: "/client-hub",
      },
      {
        id: "outward",
        title: "Outward Advisory",
        subtitle: "Riset industri dan strategic outlook",
        category: "nav",
        icon: Compass,
        to: "/outward",
      },

      // --- Tautan Eksternal Resmi Pemerintah & Alat Produktivitas ---
      {
        id: "ext-farmaplus",
        title: "FarmaPlus Kemkes",
        subtitle: "Pencarian ketersediaan & harga eceran tertinggi obat resmi Kemenkes",
        category: "external",
        icon: Pill,
        externalUrl: "https://farmaplus.kemkes.go.id/medicine/search",
        badge: "Kemenkes",
      },
      {
        id: "ext-pihps",
        title: "PIHPS Bank Indonesia",
        subtitle: "Pusat Informasi Harga Pangan Strategis Nasional terpadu BI",
        category: "external",
        icon: Landmark,
        externalUrl: "https://www.bi.go.id/hargapangan/",
        badge: "Bank Indonesia",
      },
      {
        id: "ext-sp2kp",
        title: "SP2KP Kemendag",
        subtitle: "Sistem Pemantauan Pasar & Kebutuhan Pokok Kementerian Perdagangan",
        category: "external",
        icon: Scale,
        externalUrl: "https://sp2kp.kemendag.go.id/statistik/tabulasi-harga",
        badge: "Kemendag",
      },
      {
        id: "ext-bapanas",
        title: "Panel Harga Badan Pangan",
        subtitle: "Informasi harga pangan produsen & konsumen Badan Pangan Nasional",
        category: "external",
        icon: BarChart3,
        externalUrl: "https://panelharga.badanpangan.go.id/",
        badge: "Bapanas",
      },
      {
        id: "ext-bps",
        title: "Badan Pusat Statistik (BPS)",
        subtitle: "Data sensus, inflasi nasional, PDB & indikator makroekonomi",
        category: "external",
        icon: Globe,
        externalUrl: "https://www.bps.go.id/",
        badge: "BPS",
      },
      {
        id: "ext-farmalkes",
        title: "Ditjen Farmalkes Kemenkes",
        subtitle: "Portal regulasi farmasi, standar alat kesehatan & izin edar",
        category: "external",
        icon: ShieldCheck,
        externalUrl: "https://farmalkes.kemkes.go.id/",
        badge: "Farmalkes",
      },
      {
        id: "ext-kementan",
        title: "PSP Kementerian Pertanian",
        subtitle: "Prasarana, sarana pertanian & alokasi pupuk bersubsidi",
        category: "external",
        icon: Sprout,
        externalUrl: "https://psp.pertanian.go.id/",
        badge: "Kementan",
      },
      {
        id: "ext-satudata",
        title: "Satu Data Indonesia",
        subtitle: "Portal keterbukaan data terpadu kementerian dan lembaga negara",
        category: "external",
        icon: Database,
        externalUrl: "https://data.go.id/",
        badge: "SatuData",
      },
      {
        id: "ext-jdih-bumn",
        title: "JDIH Kementerian BUMN",
        subtitle: "Jaringan dokumentasi & informasi hukum serta regulasi BUMN",
        category: "external",
        icon: BookOpen,
        externalUrl: "https://jdih.bumn.go.id/",
        badge: "BUMN",
      },
      {
        id: "ext-ojk",
        title: "Regulasi OJK (POJK)",
        subtitle: "Aturan & surat edaran Otoritas Jasa Keuangan sektor keuangan",
        category: "external",
        icon: FileCheck,
        externalUrl: "https://www.ojk.go.id/id/regulasi/Pages/POJK-Perbankan.aspx",
        badge: "OJK",
      },
      {
        id: "ext-figma",
        title: "Template Figma Dashboard",
        subtitle: "Showcase & template UI dashboard resmi Figma Community",
        category: "external",
        icon: Figma,
        externalUrl: "https://www.figma.com/templates/dashboard-designs/",
        badge: "Figma",
      },
    ],
    [onClose, onOpenQuickCapture]
  );

  const filtered = useMemo(() => {
    return shortcuts.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchText =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(search.toLowerCase())) ||
        (item.badge && item.badge.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchText;
    });
  }, [shortcuts, search, selectedCategory]);

  if (!isOpen) return null;

  const handleItemClick = (item: ShortcutItem) => {
    if (item.externalUrl) {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
      onClose();
    } else if (item.action) {
      item.action();
    } else if (item.to) {
      navigate({ to: item.to as any });
      onClose();
    }
  };

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
                      <CornerUpRight className="size-3.5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 tracking-tight">
                        Shortcut & Pintasan
                      </h3>
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                        Akses cepat navigasi & portal
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

                {/* Search bar */}
                <div className="relative mb-2">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari pintasan..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-neutral-200 dark:border-zinc-700 bg-neutral-50 dark:bg-zinc-800 focus:outline-none focus:ring-1.5 focus:ring-primary/40 text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
                  />
                </div>

                {/* Filter pills */}
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-neutral-100 dark:bg-zinc-800 rounded-xl border border-neutral-200/60 dark:border-zinc-700/60">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`py-1 text-[10.5px] font-medium rounded-lg transition-all ${
                      selectedCategory === "all"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("nav")}
                    className={`py-1 text-[10.5px] font-medium rounded-lg transition-all ${
                      selectedCategory === "nav"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    Laman
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("action")}
                    className={`py-1 text-[10.5px] font-medium rounded-lg transition-all ${
                      selectedCategory === "action"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    Aksi
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("external")}
                    className={`py-1 text-[10.5px] font-medium rounded-lg transition-all ${
                      selectedCategory === "external"
                        ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-semibold"
                        : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    }`}
                  >
                    Tautan
                  </button>
                </div>
              </div>

              {/* Shortcuts list */}
              <div className="relative flex-1 min-h-0 pt-2">
                <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar max-h-[46vh] px-0.5">
                  {filtered.length === 0 ? (
                    <div className="py-6 text-center text-xs text-neutral-400">
                      Tidak ada pintasan yang cocok
                    </div>
                  ) : (
                    filtered.map((item) => {
                      const Icon = item.icon;
                      const isExternal = Boolean(item.externalUrl);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleItemClick(item)}
                          className="group flex items-center justify-between w-full px-3 py-2 rounded-2xl text-left transition-all duration-150 select-none cursor-pointer border bg-neutral-50 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 shadow-xs hover:bg-neutral-100 dark:hover:bg-zinc-700 hover:text-neutral-900 dark:hover:text-white border-neutral-200/70 dark:border-zinc-700/60"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-150 bg-white dark:bg-zinc-700 text-neutral-500 dark:text-neutral-300 shadow-2xs border border-neutral-200/50 dark:border-zinc-600/50 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:scale-105">
                              <Icon className="size-4 shrink-0" strokeWidth={2.2} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-medium tracking-tight truncate leading-tight text-neutral-800 dark:text-neutral-100 group-hover:text-neutral-900 dark:group-hover:text-white">
                                  {item.title}
                                </span>
                                {isExternal && (
                                  <ExternalLink className="size-3 text-neutral-400 shrink-0 inline" />
                                )}
                              </div>
                              <span className="text-[10.5px] truncate leading-tight mt-0.5 text-neutral-500 dark:text-neutral-400">
                                {item.subtitle || "Pintasan Eksekutif"}
                              </span>
                            </div>
                          </div>
                          {item.badge ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white dark:bg-zinc-700 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-zinc-600/60 shrink-0 shadow-2xs">
                              {item.badge}
                            </span>
                          ) : (
                            <ArrowRight className="size-3.5 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                          )}
                        </button>
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
