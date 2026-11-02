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
  Users,
  Heart,
  Building2,
  Coins,
  GitFork,
  Archive,
  Scale,
  Utensils,
  HeartHandshake,
  ShieldAlert,
  PhoneCall,
  Wallet,
  Car,
  Smile,
  Network,
  Clock,
  CalendarDays,
  ArrowRightLeft,
  Gift,
  PartyPopper,
  Compass,
  FileCheck,
  Receipt,
  MessageSquare,
  ScrollText,
  Search,
  Star,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export type FamilyCommunityCategory =
  | "all"
  | "family"
  | "relationships"
  | "neighborhood"
  | "giving";

export interface FamilyCommunitySubMenu {
  id: string;
  label: string;
  to: string;
}

export interface FamilyCommunityAppItem {
  id: string;
  name: string;
  category: "family" | "relationships" | "neighborhood" | "giving";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: FamilyCommunitySubMenu[];
}

export const FAMILY_COMMUNITY_APPS: FamilyCommunityAppItem[] = [
  // ============================================================================
  // 1. Family (3 Apps)
  // ============================================================================
  {
    id: "family-records",
    name: "Family Records",
    category: "family",
    categoryLabel: "Family",
    shortDesc:
      "Pusat silsilah garis keturunan keluarga, repositori arsip foto & dokumen bersejarah, kesepakatan norma house rules, serta buku resep kuliner warisan leluhur.",
    to: "/lainnya?app=family-tree",
    icon: GitFork,
    badge: "Family Records",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Family",
    subMenus: [
      { id: "family-tree", label: "Family Tree", to: "/lainnya?app=family-tree" },
      { id: "family-archive", label: "Family Archive", to: "/lainnya?app=family-archive" },
      { id: "house-rules", label: "House Rules", to: "/lainnya?app=family-rules" },
      { id: "resep-warisan", label: "Resep Warisan Keluarga", to: "/peh/family-recipes" },
    ],
  },
  {
    id: "family-safety",
    name: "Family Safety",
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
      { id: "medical-profile", label: "Medical Profile", to: "/lainnya?app=medical-family" },
      { id: "disaster-prep", label: "Disaster Prep", to: "/lainnya?app=disaster-prep" },
      { id: "emergency-contacts", label: "Emergency Contacts", to: "/lainnya?app=emergency-hub" },
    ],
  },
  {
    id: "family-life",
    name: "Family Life",
    category: "family",
    categoryLabel: "Family",
    shortDesc:
      "Kehangatan rutinitas rumah tangga: tabungan dan alokasi dana bersama, penjadwalan antar-jemput carpool, dan log bermain penuh kasih bersama hewan anabul.",
    to: "/peh/family-budget",
    icon: Heart,
    badge: "Family Life",
    accentGradient: "from-pink-500 to-purple-600",
    accentBorder: "border-pink-500/30 hover:border-pink-500/60",
    badgeBg: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
    badgeText: "Family",
    subMenus: [
      { id: "tabungan-dana", label: "Tabungan & Dana Bersama", to: "/peh/family-budget" },
      { id: "carpool-plan", label: "Carpool Plan", to: "/lainnya?app=carpool-plan" },
      { id: "bermain-anabul", label: "Bermain dengan Anabul", to: "/peh/pet-care" },
    ],
  },

  // ============================================================================
  // 2. Relationships (2 Apps)
  // ============================================================================
  {
    id: "staying-in-touch",
    name: "Staying in Touch",
    category: "relationships",
    categoryLabel: "Relationships",
    shortDesc:
      "Perawatan jejaring pertemanan dan silaturahmi kerabat: pemetaan lingkaran relasi, pengingat sapaan catchup, linimasa riwayat temu, dan log peminjaman barang.",
    to: "/lainnya?app=circle-groups",
    icon: Network,
    badge: "Staying in Touch",
    accentGradient: "from-indigo-500 to-purple-600",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "Relationships",
    subMenus: [
      { id: "relation-circles", label: "Relation Circles", to: "/lainnya?app=circle-groups" },
      { id: "catchup-reminder", label: "Catchup Reminder", to: "/lainnya?app=catchup-cadence" },
      { id: "meeting-timeline", label: "Meeting Timeline", to: "/lainnya?app=meeting-timeline" },
      { id: "borrow-log", label: "Borrow Log MVP", to: "/lainnya?app=borrowed-items" },
    ],
  },
  {
    id: "celebrations",
    name: "Celebrations",
    category: "relationships",
    categoryLabel: "Relationships",
    shortDesc:
      "Merayakan setiap momen istimewa: pelacak pemberian kado & hadiah kerabat, perencana temu akbar reuni akrab, dan pengingat hari ulang tahun & pernikahan.",
    to: "/lainnya?app=gift-tracker",
    icon: Gift,
    badge: "Celebrations",
    accentGradient: "from-amber-500 to-pink-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Relationships",
    subMenus: [
      { id: "gift-tracker", label: "Gift Tracker", to: "/lainnya?app=gift-tracker" },
      { id: "reunion-planner", label: "Reunion Planner", to: "/lainnya?app=reunion-planner" },
      { id: "anniversary-tracker", label: "Anniversary Tracker", to: "/lainnya?app=family-anniversary" },
    ],
  },

  // ============================================================================
  // 3. Neighborhood (3 Apps)
  // ============================================================================
  {
    id: "neighbors-and-board",
    name: "Neighbors and Board",
    category: "neighborhood",
    categoryLabel: "Neighborhood",
    shortDesc:
      "Sinergi keharmonisan rukun tetangga: buku kontak warga RT/RW, portal komunitas pemukiman, papan mading pengumuman digital, dan kartu tanda anggota warga.",
    to: "/lainnya?app=rt-rw-directory",
    icon: Users,
    badge: "Neighbors & Board",
    accentGradient: "from-blue-500 to-teal-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Neighborhood",
    subMenus: [
      { id: "neighbor-directory", label: "Neighbor Directory", to: "/lainnya?app=rt-rw-directory" },
      { id: "neighbor-community", label: "Neighbor Community", to: "/komunitas-warga" },
      { id: "community-board", label: "Community Board", to: "/lainnya?app=community-announcements" },
      { id: "membership-card", label: "Membership Card", to: "/lainnya?app=membership-card" },
    ],
  },
  {
    id: "civic-services",
    name: "Civic Services",
    category: "neighborhood",
    categoryLabel: "Neighborhood",
    shortDesc:
      "Akses birokrasi dan fasilitas publik: panduan faskes & layanan publik, registrasi sipil kependudukan, iuran pajak retribusi, kepatuhan hukum, dan kanal aspirasi fasum.",
    to: "/lainnya?app=public-services-guide",
    icon: Compass,
    badge: "Civic Services",
    accentGradient: "from-teal-500 to-emerald-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Neighborhood",
    subMenus: [
      { id: "services-guide", label: "Services Guide", to: "/lainnya?app=public-services-guide" },
      { id: "civil-registry", label: "Civil Registry", to: "/lainnya?app=civil-registry" },
      { id: "civic-tax", label: "Civic Tax", to: "/lainnya?app=tax-civic" },
      { id: "civic-compliance", label: "Civic Compliance", to: "/peh/civic" },
      { id: "aspirasi-fasum", label: "Aspirasi & Laporan Fasum", to: "/komunitas-warga?tab=aspirasi" },
    ],
  },
  {
    id: "civic-agenda",
    name: "Civic Agenda",
    category: "neighborhood",
    categoryLabel: "Neighborhood",
    shortDesc:
      "Agenda kepengurusan lingkungan & mufakat bersama: kalender kegiatan gotong royong warga serta catatan resolusi dan risalah rapat warga RT/RW.",
    to: "/lainnya?app=civic-calendar",
    icon: CalendarDays,
    badge: "Civic Agenda",
    accentGradient: "from-sky-500 to-blue-600",
    accentBorder: "border-sky-500/30 hover:border-sky-500/60",
    badgeBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    badgeText: "Neighborhood",
    subMenus: [
      { id: "civic-calendar", label: "Civic Calendar", to: "/lainnya?app=civic-calendar" },
      { id: "meeting-resolutions", label: "Meeting Resolutions", to: "/lainnya?app=meeting-resolutions" },
    ],
  },

  // ============================================================================
  // 4. Giving (1 App)
  // ============================================================================
  {
    id: "giving-and-impact",
    name: "Giving and Impact",
    category: "giving",
    categoryLabel: "Giving",
    shortDesc:
      "Filantropi keberkahan dan kontribusi sosial: hisab zakat & infaq, pencatatan donasi kemanusiaan, log partisipasi relawan sosial, dan evaluasi dampak nyata kebaikan.",
    to: "/zakat",
    icon: Coins,
    badge: "Giving & Impact",
    accentGradient: "from-emerald-500 to-green-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Giving",
    subMenus: [
      { id: "giving", label: "Giving", to: "/zakat" },
      { id: "donation-log", label: "Donation Log MVP", to: "/lainnya?app=donation-tracker" },
      { id: "volunteer-log", label: "Volunteer Log MVP", to: "/lainnya?app=volunteer-log" },
      { id: "social-impact", label: "Social Impact", to: "/peh/charity" },
    ],
  },
];

export const FAMILY_COMMUNITY_CATEGORY_TABS: {
  id: FamilyCommunityCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 9 },
  { id: "family", label: "Family", count: 3 },
  { id: "relationships", label: "Relationships", count: 2 },
  { id: "neighborhood", label: "Neighborhood", count: 3 },
  { id: "giving", label: "Giving", count: 1 },
];

export function FamilyCommunityPage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] =
    useState<FamilyCommunityCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_networks") || "mode_networks";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();

  const filteredApps = useMemo(() => {
    return FAMILY_COMMUNITY_APPS.filter((app) => {
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
          items={adjustCategoryTabsCount(FAMILY_COMMUNITY_CATEGORY_TABS, getPageCountDelta(pageId))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as any)}
        />
      </ShellHeader>

      {/* Main Page Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-4">
        {/* Title (Matching MBA Page Header Style) */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <Users className="size-7 text-primary" />
            <span>Family and Community</span>
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
export default FamilyCommunityPage;
