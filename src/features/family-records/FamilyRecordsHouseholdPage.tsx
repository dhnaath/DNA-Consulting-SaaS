import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useFavorites } from "@/hooks/useFavorites";
import { HeaderNavPills, ShellHeader } from "@/app/shell-header";
import { MBACard } from "@/components/common/MBACard";
import { MovedCardsGridItems } from "@/components/common/MovedCardsGridItems";
import {
  LauncherPageProvider,
  adjustCategoryTabsCount,
  useCardPageMover,
  useCurrentLauncherPage,
} from "@/hooks/useCardPageMover";
import {
  Home,
  GitFork,
  ShieldAlert,
  Wallet,
  CheckSquare,
  Utensils,
  Car,
  Search,
  Sparkles,
  Heart,
} from "lucide-react";

export type FamilyCategory = "all" | "family" | "household" | "vehicles";

export interface FamilySubMenu {
  id: string;
  label: string;
  to: string;
}

export interface FamilyAppItem {
  id: string;
  name: string;
  category: "family" | "household" | "vehicles";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: FamilySubMenu[];
}

export const FAMILY_HOUSEHOLD_APPS: FamilyAppItem[] = [
  {
    id: "family-records-ancestry",
    name: "Family Records & Ancestry",
    category: "family",
    categoryLabel: "Family",
    shortDesc:
      "Pusat silsilah garis keturunan keluarga, repositori arsip foto & dokumen bersejarah, kesepakatan tata tertib house rules, dan resep kuliner warisan leluhur.",
    to: "/peh/family-tree",
    icon: GitFork,
    badge: "Family Tree",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Family",
    subMenus: [
      { id: "family-tree", label: "Family Tree", to: "/peh/family-tree" },
      { id: "resep-warisan", label: "Resep Warisan Keluarga", to: "/peh/family-recipes" },
      { id: "house-rules", label: "House Rules", to: "/lainnya?app=family-rules" },
      { id: "tradisi-keluarga", label: "Tradisi & Sejarah", to: "/peh/traditions" },
    ],
  },
  {
    id: "family-safety-health",
    name: "Family Safety & Health Hub",
    category: "family",
    categoryLabel: "Family",
    shortDesc:
      "Mitigasi keselamatan & siaga krisis keluarga: rekam profil medis alergi/darah, panduan kesiapsiagaan bencana, dan direktori kontak darurat terpadu.",
    to: "/lainnya?app=emergency-hub",
    icon: ShieldAlert,
    badge: "Family Safety",
    accentGradient: "from-red-500 to-rose-600",
    accentBorder: "border-red-500/30 hover:border-red-500/60",
    badgeBg: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
    badgeText: "Family",
    subMenus: [
      { id: "emergency-contacts", label: "Emergency Contacts", to: "/lainnya?app=emergency-hub" },
      { id: "family-health", label: "Profil Medis Keluarga", to: "/peh/family-health" },
      { id: "disaster-prep", label: "Disaster Preparedness", to: "/lainnya?app=disaster-prep" },
    ],
  },
  {
    id: "family-budget-life",
    name: "Family Budget & Shared Life",
    category: "family",
    categoryLabel: "Family",
    shortDesc:
      "Perencanaan anggaran rumah tangga bersama, dana tabungan pendidikan anak, alokasi pengeluaran bulanan, dan evaluasi penghematan rutin.",
    to: "/peh/family-budget",
    icon: Wallet,
    badge: "Family Life",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Family",
    subMenus: [
      { id: "family-budget", label: "Anggaran Keluarga", to: "/peh/family-budget" },
      { id: "monthly-expenses", label: "Pengeluaran Bulanan", to: "/peh/budget" },
      { id: "pet-care", label: "Perawatan Hewan Peliharaan", to: "/peh/pet-care" },
    ],
  },
  {
    id: "household-care-chores",
    name: "Household Care & Chores",
    category: "household",
    categoryLabel: "Household",
    shortDesc:
      "Jadwal rutin kebersihan hunian, pembagian tugas harian keluarga, dan log pemeliharaan fisik bangunan serta peralatan elektronik rumah.",
    to: "/peh/chores",
    icon: CheckSquare,
    badge: "Household",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Household",
    subMenus: [
      { id: "chores-list", label: "Tugas Kebersihan", to: "/peh/chores" },
      { id: "home-maintenance", label: "Perawatan Rumah", to: "/peh/maintenance" },
      { id: "plants-garden", label: "Tanaman & Kebun", to: "/peh/plants" },
    ],
  },
  {
    id: "kitchen-pantry-management",
    name: "Kitchen, Pantry & Grocery",
    category: "household",
    categoryLabel: "Household",
    shortDesc:
      "Inventarisasi stok bahan makanan dapur, panduan resep masakan harian, serta daftar belanja kebutuhan pokok supermarket otomatis.",
    to: "/peh/pantry",
    icon: Utensils,
    badge: "Kitchen & Pantry",
    accentGradient: "from-orange-500 to-amber-600",
    accentBorder: "border-orange-500/30 hover:border-orange-500/60",
    badgeBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    badgeText: "Household",
    subMenus: [
      { id: "pantry-inventory", label: "Pantry Inventory", to: "/peh/pantry" },
      { id: "recipes-catalog", label: "Katalog Resep Masakan", to: "/recipes" },
      { id: "grocery-list", label: "Daftar Belanja Dapur", to: "/shopping" },
    ],
  },
  {
    id: "vehicle-records-care",
    name: "Vehicle Records & Fleet Care",
    category: "vehicles",
    categoryLabel: "Vehicles",
    shortDesc:
      "Pencatatan data legalitas STNK/BPKB kendaraan, histori servis berkala ganti oli, serta pemantauan konsumsi bahan bakar dan jarak tempuh.",
    to: "/peh/vehicles",
    icon: Car,
    badge: "Vehicles",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Vehicles",
    subMenus: [
      { id: "vehicle-identity", label: "Identitas Kendaraan", to: "/peh/vehicles" },
      { id: "mileage-fuel", label: "Kilometer & BBM", to: "/lainnya?app=mileage-fuel" },
      { id: "service-schedule", label: "Jadwal Servis Berkala", to: "/lainnya?app=service-maintenance" },
    ],
  },
];

export const FAMILY_CATEGORY_TABS: {
  id: FamilyCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 6 },
  { id: "family", label: "Family", count: 3 },
  { id: "household", label: "Household", count: 2 },
  { id: "vehicles", label: "Vehicles", count: 1 },
];

export function FamilyRecordsHouseholdPage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<FamilyCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_family") || "mode_family";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();

  const filteredApps = useMemo(() => {
    return FAMILY_HOUSEHOLD_APPS.filter((app) => {
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
      <ShellHeader>
        <HeaderNavPills
          items={adjustCategoryTabsCount(FAMILY_CATEGORY_TABS, getPageCountDelta(pageId))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as any)}
        />
      </ShellHeader>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <Home className="size-7 text-primary" />
            <span>Family Records and Household Planning</span>
          </h1>
        </div>

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

        {filteredApps.length === 0 &&
          (selectedCategory !== "all" || getCardsMovedIntoPage(pageId).length === 0) && (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border p-8 bg-card/40">
            <Search className="size-8 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-foreground">
              Tidak ada modul keluarga ditemukan
            </h3>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-semibold transition-colors"
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
