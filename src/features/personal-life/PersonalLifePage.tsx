import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { HeaderNavPills, ShellHeader } from "@/app/shell-header";
import { ALL_APP_MODULES } from "@/features/launcher/AppModuleSection";
import { MBACard } from "@/components/common/MBACard";
import { MovedCardsGridItems } from "@/components/common/MovedCardsGridItems";
import {
  LauncherPageProvider,
  adjustCategoryTabsCount,
  useCardPageMover,
  useCurrentLauncherPage,
} from "@/hooks/useCardPageMover";
import {
  LayoutGrid,
  Flame,
  CheckSquare,
  Sparkles,
  BookOpen,
  Smile,
  Heart,
  Dumbbell,
  Moon,
  Scale,
  Droplet,
  HeartPulse,
  Stethoscope,
  Pill,
  Key,
  Calculator,
  Briefcase,
  Gift,
  ArrowRight,
  Star,
  Search,
  ChevronRight,
  Activity,
  Layers,
} from "lucide-react";

export type PersonalLifeCategory =
  | "all"
  | "pengembangan"
  | "refleksi"
  | "kesehatan"
  | "utilitas";

export interface PersonalLifeSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface PersonalLifeAppItem {
  id: string;
  name: string;
  category: "pengembangan" | "refleksi" | "kesehatan" | "utilitas";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: PersonalLifeSubMenu[];
}

export const PERSONAL_LIFE_APPS: PersonalLifeAppItem[] = [
  // ============================================================================
  // 1. Pengembangan (1 App)
  // ============================================================================
  {
    id: "habits-and-planning",
    name: "Personal Development",
    category: "pengembangan",
    categoryLabel: "Pengembangan",
    shortDesc:
      "Pengembangan kebiasaan positif konsisten, perencanaan sasaran hidup terpadu, proyek mandiri, serta pencatatan sasaran dan tabungan masa depan.",
    to: "/habit-tracker",
    icon: Flame,
    badge: "Pengembangan",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Pengembangan",
    subMenus: [
      { id: "habit-tracker", label: "Habit Tracker", to: "/habit-tracker" },
      { id: "life-planner", label: "Life Planner", to: "/life/life-planner" },
      { id: "personal-projects", label: "Personal Projects", to: "/proyek-personal" },
      { id: "wishlist", label: "Wishlist and Savings", to: "/life/wishlist" },
    ],
  },

  // ============================================================================
  // 2. Refleksi (1 App)
  // ============================================================================
  {
    id: "journaling",
    name: "Personal Journaling",
    category: "refleksi",
    categoryLabel: "Refleksi",
    shortDesc:
      "Ruang refleksi privat harian, jurnal rasa syukur berkala untuk ketenangan batin, serta pemetaan suasana hati (mood map) terstruktur.",
    to: "/journal",
    icon: BookOpen,
    badge: "Refleksi",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Refleksi",
    subMenus: [
      { id: "daily-journal", label: "Daily Journal", to: "/journal" },
      { id: "gratitude-journal", label: "Gratitude Journal", to: "/journal?tab=gratitude" },
      { id: "mood-tracker", label: "Mood Tracker", to: "/journal?tab=mood" },
    ],
  },

  // ============================================================================
  // 3. Kesehatan (2 Apps: Health and Fitness & Health Records)
  // ============================================================================
  {
    id: "fitness-and-sleep",
    name: "Health and Fitness",
    category: "kesehatan",
    categoryLabel: "Kesehatan",
    shortDesc:
      "Pusat pencatatan latihan fisik harian, kualitas istirahat malam dan kalkulator tidur, komposisi berat badan tubuh, serta log hidrasi air minum.",
    to: "/health?tab=workouts",
    icon: Dumbbell,
    badge: "Kesehatan",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Kesehatan",
    subMenus: [
      { id: "workouts", label: "Workout Tracker", to: "/health?tab=workouts" },
      { id: "sleep-quality", label: "Sleep Tracker", to: "/health?tab=sleep" },
      { id: "body-metrics", label: "Body Metrics", to: "/health?tab=body-metrics" },
      { id: "water-intake", label: "Water Tracker", to: "/health?tab=water" },
    ],
  },
  {
    id: "health-records",
    name: "Health Records",
    category: "kesehatan",
    categoryLabel: "Kesehatan",
    shortDesc:
      "Pusat rekam medis komprehensif: pelacak riwayat kesehatan dokter, tanda vital tubuh, jadwal pengingat minum obat, dan log perawatan kulit.",
    to: "/health",
    icon: HeartPulse,
    badge: "Kesehatan",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Kesehatan",
    subMenus: [
      { id: "health-tracker", label: "Health Overview", to: "/health" },
      { id: "medical-records", label: "Medical Records", to: "/health?tab=medical-records" },
      { id: "vitals-tracker", label: "Vital Signs", to: "/health?tab=vitals" },
      { id: "med-reminder", label: "Medication Reminder", to: "/lainnya?app=med-reminder" },
      { id: "skincare-log", label: "Skincare Tracker", to: "/health?tab=skincare" },
    ],
  },

  // ============================================================================
  // 4. Utilitas (1 App: Personal Tools)
  // ============================================================================
  {
    id: "personal-tools",
    name: "Personal Tools",
    category: "utilitas",
    categoryLabel: "Utilitas",
    shortDesc:
      "Brankas manajemen kata sandi terenkripsi dan keamanan akun personal, serta kalkulator utilitas serbaguna untuk kebutuhan komputasi harian.",
    to: "/passwords",
    icon: Key,
    badge: "Utilitas",
    accentGradient: "from-cyan-500 to-blue-600",
    accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    badgeText: "Utilitas",
    subMenus: [
      { id: "passwords", label: "Password Manager", to: "/passwords" },
      { id: "utilities", label: "Calculator and Utilities", to: "/kalkulator" },
    ],
  },
];

export const PERSONAL_LIFE_CATEGORY_TABS: {
  id: PersonalLifeCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 5 },
  { id: "pengembangan", label: "Pengembangan", count: 1 },
  { id: "refleksi", label: "Refleksi", count: 1 },
  { id: "kesehatan", label: "Kesehatan", count: 2 },
  { id: "utilitas", label: "Utilitas", count: 1 },
];

export function PersonalLifePage({ isEmbedded = false }: { isEmbedded?: boolean } = {}) {
  const [selectedCategory, setSelectedCategory] = useState<PersonalLifeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_personal") || "mode_personal";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();

  const filteredApps = useMemo(() => {
    return PERSONAL_LIFE_APPS.filter((app) => {
      const matchCategory =
        selectedCategory === "all" || app.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.subMenus.some((sub) =>
          sub.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <LauncherPageProvider pageId={pageId}>
    <div className="w-full flex-1 flex flex-col font-sans pb-16">
      {/* Portaled ShellHeader Filter Pills (Direct Selected / Unselected Layers) */}
      <ShellHeader>
        <HeaderNavPills
          items={adjustCategoryTabsCount(PERSONAL_LIFE_CATEGORY_TABS, getPageCountDelta(pageId))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as any)}
        />
      </ShellHeader>

      {/* Main Page Container */}
      <div className="w-full mx-auto pt-3 sm:pt-4 space-y-4">
        {/* Title (Matching MBA Page Header Style) */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <Heart className="size-7 text-primary" />
            <span>Personal Life Management</span>
          </h1>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {filteredApps.map((app) => (
            <MBACard
              key={app.id}
              title={app.name}
              to={app.to}
              icon={app.icon}
              badge={app.badgeText}
              shortDesc={app.shortDesc}
              accentGradient={app.accentGradient}
              features={app.subMenus.map((sub) => ({
                title: sub.label,
                to: sub.to || app.to,
              }))}
              isFav={isFavorite(app.to)}
              toggleFavorite={toggleFavorite}
            />
          ))}
          {selectedCategory === "all" && (
            <MovedCardsGridItems pageId={pageId} searchQuery={searchQuery} />
          )}
        </div>

        {/* Empty Search Result Fallback */}
        {filteredApps.length === 0 &&
          (selectedCategory !== "all" || getCardsMovedIntoPage(pageId).length === 0) && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-border bg-card/40 my-6">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
              <Search className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Tidak ada modul ditemukan</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Tidak ada aplikasi yang cocok dengan kata kunci &quot;{searchQuery}&quot; pada kategori {selectedCategory}.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
    </LauncherPageProvider>
  );
}

export default PersonalLifePage;
