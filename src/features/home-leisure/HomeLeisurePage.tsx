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
  Home,
  Car,
  Palmtree,
  CheckSquare,
  Wrench,
  Sprout,
  Archive,
  Utensils,
  BookOpen,
  AlertTriangle,
  RefreshCw,
  CalendarDays,
  ShoppingCart,
  Fuel,
  Plane,
  CloudSun,
  Film,
  Gamepad2,
  Podcast,
  Music,
  Search,
  Star,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export type HomeLeisureCategory = "all" | "home" | "vehicle" | "leisure";

export interface HomeLeisureSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface HomeLeisureAppItem {
  id: string;
  name: string;
  category: "home" | "vehicle" | "leisure";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: HomeLeisureSubMenu[];
}

export const HOME_LEISURE_APPS: HomeLeisureAppItem[] = [
  // ============================================================================
  // 1. Home (2 Apps)
  // ============================================================================
  {
    id: "household-care",
    name: "Household Care",
    category: "home",
    categoryLabel: "Home",
    shortDesc:
      "Pusat tata kelola tugas harian domestik, pemeliharaan servis peralatan rumah tangga, perawatan tanaman & kebun, serta inventaris barang elektronik.",
    to: "/lainnya?app=home-chores",
    icon: Home,
    badge: "Household Care",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Home",
    subMenus: [
      { id: "piket-tugas", label: "Piket & Tugas Domestik", to: "/lainnya?app=home-chores" },
      { id: "servis-perawatan", label: "Servis & Perawatan Rumah", to: "/lainnya?app=appliance-care" },
      { id: "tanaman-kebun", label: "Tanaman & Kebun", to: "/peh/plants" },
      { id: "inventaris-elektronik", label: "Inventaris Rumah & Elektronik", to: "/lainnya?app=home-inventory" },
    ],
  },
  {
    id: "kitchen-and-shopping",
    name: "Kitchen and Shopping",
    category: "home",
    categoryLabel: "Home",
    shortDesc:
      "Manajemen logistik dapur, stok inventaris pantry, histori memasak kuliner harian, pengingat kedaluwarsa bahan makanan, pemanfaatan sisa masakan, perencanaan menu nutrisi, dan daftar belanja lengkap.",
    to: "/recipes",
    icon: Utensils,
    badge: "Kitchen & Shopping",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Home",
    subMenus: [
      { id: "pantry-inventory", label: "Pantry Inventory", to: "/recipes?tab=pantry" },
      { id: "cook-log", label: "Cook Log", to: "/recipes?tab=cook-log" },
      { id: "expiry-alert", label: "Expiry Alert", to: "/recipes?tab=expiry" },
      { id: "leftover-manager", label: "Leftover Manager", to: "/recipes?tab=leftovers" },
      { id: "meal-planner", label: "Meal Planner", to: "/recipes?tab=meal-planner" },
      { id: "shopping-list", label: "Shopping List", to: "/shopping" },
    ],
  },

  // ============================================================================
  // 2. Vehicle (2 Apps)
  // ============================================================================
  {
    id: "vehicle-records",
    name: "Vehicle Records",
    category: "vehicle",
    categoryLabel: "Vehicle",
    shortDesc:
      "Pangkalan data kepemilikan armada, buku registrasi kendaraan resmi STNK/BPKB, pengingat siklus perpanjangan pajak, serta logbook operasional perjalanan.",
    to: "/lainnya?app=vehicle-identity",
    icon: Car,
    badge: "Vehicle Records",
    accentGradient: "from-blue-500 to-cyan-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Vehicle",
    subMenus: [
      { id: "vehicle-registry", label: "Vehicle Registry", to: "/lainnya?app=vehicle-identity" },
      { id: "vehicle-renewals", label: "Vehicle Renewals", to: "/lainnya?app=vehicle-renewals" },
      { id: "vehicle-logbook", label: "Vehicle Logbook", to: "/lainnya?app=vehicle-logbook" },
    ],
  },
  {
    id: "vehicle-care",
    name: "Vehicle Care",
    category: "vehicle",
    categoryLabel: "Vehicle",
    shortDesc:
      "Pemantauan efisiensi konsumsi bahan bakar (BBM), buku catatan riwayat perawatan servis bengkel, dan pelacakan siklus aus masa pakai suku cadang otomotif.",
    to: "/lainnya?app=mileage-fuel",
    icon: Fuel,
    badge: "Vehicle Care",
    accentGradient: "from-sky-500 to-indigo-600",
    accentBorder: "border-sky-500/30 hover:border-sky-500/60",
    badgeBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    badgeText: "Vehicle",
    subMenus: [
      { id: "fuel-log", label: "Fuel Log", to: "/lainnya?app=mileage-fuel" },
      { id: "service-history", label: "Service History", to: "/lainnya?app=vehicle-service" },
      { id: "parts-lifecycle", label: "Parts Lifecycle", to: "/lainnya?app=parts-lifecycle" },
    ],
  },

  // ============================================================================
  // 3. Leisure (2 Apps)
  // ============================================================================
  {
    id: "travel-and-weather",
    name: "Travel and Weather",
    category: "leisure",
    categoryLabel: "Leisure",
    shortDesc:
      "Perencanaan komprehensif agenda liburan, itinerary tujuan wisata perjalanan, serta observasi prakiraan cuaca dan kondisi iklim terkini.",
    to: "/trips",
    icon: Plane,
    badge: "Travel & Weather",
    accentGradient: "from-teal-500 to-emerald-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Leisure",
    subMenus: [
      { id: "trip-planner", label: "Trip Planner", to: "/trips" },
      { id: "weather", label: "Weather", to: "/weather" },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    category: "leisure",
    categoryLabel: "Leisure",
    shortDesc:
      "Kurasi media rekreasi dan hiburan pelepas penat: daftar tontonan film, video game pelepas stres, audio podcast inspiratif, dan playlist musik personal.",
    to: "/movies",
    icon: Film,
    badge: "Entertainment",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Leisure",
    subMenus: [
      { id: "movies", label: "Movies", to: "/movies" },
      { id: "games", label: "Games", to: "/games" },
      { id: "podcasts", label: "Podcasts", to: "/podcasts" },
      { id: "music", label: "Music", to: "/music" },
    ],
  },
];

export const HOME_LEISURE_CATEGORY_TABS: {
  id: HomeLeisureCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 6 },
  { id: "home", label: "Home", count: 2 },
  { id: "vehicle", label: "Vehicle", count: 2 },
  { id: "leisure", label: "Leisure", count: 2 },
];

export function HomeLeisurePage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<HomeLeisureCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_family") || "mode_family";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();

  const filteredApps = useMemo(() => {
    return HOME_LEISURE_APPS.filter((app) => {
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
          items={adjustCategoryTabsCount(HOME_LEISURE_CATEGORY_TABS, getPageCountDelta(pageId))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as any)}
        />
      </ShellHeader>

      {/* Main Page Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-4">
        {/* Title (Matching MBA Page Header Style) */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <Home className="size-7 text-primary" />
            <span>Home and Leisure</span>
          </h1>
        </div>

        {/* Modular Cards Grid */}
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

        {/* Empty state if search has no results */}
        {filteredApps.length === 0 &&
          (selectedCategory !== "all" || getCardsMovedIntoPage(pageId).length === 0) && (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border p-8 bg-card/40">
            <Search className="size-8 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-foreground">Tidak ada modul ditemukan</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Tidak ada modul yang cocok dengan kata kunci "{searchQuery}". Coba ubah kata kunci atau ganti filter kategori.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-1.5 rounded-full text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
    </LauncherPageProvider>
  );
}
export default HomeLeisurePage;
