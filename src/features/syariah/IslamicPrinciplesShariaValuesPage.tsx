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
  Scale,
  HeartHandshake,
  Coins,
  Building2,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Users,
  Receipt,
  FileCheck,
  Package,
  Wallet,
  Search,
  Sparkles,
  BookOpen,
  ArrowRight,
  Shield,
  Layers,
} from "lucide-react";

export type ShariaCategory =
  | "all"
  | "sosial"
  | "komersial"
  | "proteksi"
  | "simpanan"
  | "zakat"
  | "investasi"
  | "kepatuhan";

export interface ShariaSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface ShariaAppItem {
  id: string;
  name: string;
  category: "sosial" | "komersial" | "proteksi" | "simpanan" | "zakat" | "investasi" | "kepatuhan";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: ShariaSubMenu[];
}

export const SHARIA_APPS: ShariaAppItem[] = [
  // ============================================================================
  // 1. Sosial (3 Apps)
  // ============================================================================
  {
    id: "tabarru-hibah",
    name: "Tabarru' and Hibah",
    category: "sosial",
    categoryLabel: "Sosial",
    shortDesc:
      "Pengelolaan donasi sukarela, akad hibah keluarga, wakaf produktif, dan instrumen kebajikan non-profit demi kemaslahatan umat.",
    to: "/syariah/akad?app=tabarru",
    icon: HeartHandshake,
    badge: "Sosial",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Sosial",
    subMenus: [
      { id: "tabarru-contract", label: "Tabarru' Contract", to: "/syariah/akad?app=tabarru" },
      { id: "hibah-family", label: "Family Hibah", to: "/syariah/akad?app=hibah" },
      { id: "infaq-sedekah", label: "Infaq and Sadaqah", to: "/zakat?app=infaq" },
      { id: "qardh-hasan", label: "Qardh Hasan", to: "/syariah/akad?app=qardh" },
    ],
  },
  {
    id: "qardh-kebajikan",
    name: "Qardh Hasan",
    category: "sosial",
    categoryLabel: "Sosial",
    shortDesc:
      "Sistem pinjaman kebajikan tanpa bunga (0% riba) dengan transparansi pengembalian pokok dan pencatatan ta'awun tolong-menolong.",
    to: "/syariah/akad?app=qardh",
    icon: Coins,
    badge: "Sosial",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Sosial",
    subMenus: [
      { id: "qardh-ledger", label: "Qardh Ledger", to: "/syariah/akad?app=qardh" },
      { id: "pelunasan-pokok", label: "Principal Repayment Schedule", to: "/syariah/akad?app=qardh" },
      { id: "keringanan-utang", label: "Debt Relief Terms", to: "/syariah/akad?app=qardh" },
    ],
  },
  {
    id: "wakaf-aset-umat",
    name: "Waqf Management",
    category: "sosial",
    categoryLabel: "Sosial",
    shortDesc:
      "Tata kelola sertifikasi wakaf tanah, wakaf uang produktif (CWLS), pelaporan nazhir profesional, dan distribusi imbal hasil wakaf.",
    to: "/syariah/akad?app=wakaf",
    icon: Building2,
    badge: "Sosial",
    accentGradient: "from-green-500 to-emerald-600",
    accentBorder: "border-green-500/30 hover:border-green-500/60",
    badgeBg: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
    badgeText: "Sosial",
    subMenus: [
      { id: "wakaf-uang", label: "Cash Waqf", to: "/syariah/akad?app=wakaf" },
      { id: "aset-wakaf", label: "Waqf Asset Register", to: "/syariah/akad?app=wakaf" },
      { id: "laporan-nazhir", label: "Nazhir Reporting", to: "/syariah/akad?app=wakaf" },
    ],
  },

  // ============================================================================
  // 2. Komersial (5 Apps)
  // ============================================================================
  {
    id: "mudharabah-bagi-hasil",
    name: "Mudharabah",
    category: "komersial",
    categoryLabel: "Komersial",
    shortDesc:
      "Kemitraan permodalan shahibul maal dan mudharib pengelola usaha dengan nisbah bagi untung-rugi yang adil dan transparan.",
    to: "/syariah/akad?app=mudharabah",
    icon: TrendingUp,
    badge: "Komersial",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Komersial",
    subMenus: [
      { id: "nisbah-kalkulator", label: "Profit-Sharing Calculator", to: "/syariah/akad?app=mudharabah" },
      { id: "kontrak-mudharabah", label: "Mudharabah Contract", to: "/syariah/akad?app=mudharabah" },
      { id: "laporan-laba-rugi", label: "Profit and Loss Audit", to: "/syariah/akad?app=mudharabah" },
    ],
  },
  {
    id: "musyarakah-equity",
    name: "Musharakah",
    category: "komersial",
    categoryLabel: "Komersial",
    shortDesc:
      "Penyertaan modal bersama (syirkah) dengan hak suara proporsional, pembagian dividen berkala, dan evaluasi valuasi usaha.",
    to: "/syariah/akad?app=musyarakah",
    icon: Users,
    badge: "Komersial",
    accentGradient: "from-orange-500 to-amber-600",
    accentBorder: "border-orange-500/30 hover:border-orange-500/60",
    badgeBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    badgeText: "Komersial",
    subMenus: [
      { id: "musyarakah-mutanaqisah", label: "Diminishing Musharakah", to: "/syariah/akad?app=musyarakah" },
      { id: "syirkah-inan", label: "Shirkah Contracts", to: "/syariah/akad?app=musyarakah" },
      { id: "porsi-modal", label: "Capital and Ownership", to: "/syariah/akad?app=musyarakah" },
    ],
  },
  {
    id: "murabahah-costplus",
    name: "Murabaha",
    category: "komersial",
    categoryLabel: "Komersial",
    shortDesc:
      "Jual beli komoditas/barang dengan pengungkapan harga pokok dan margin keuntungan (cost-plus markup) tanpa bunga terselubung.",
    to: "/syariah/akad?app=murabahah",
    icon: Receipt,
    badge: "Komersial",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Komersial",
    subMenus: [
      { id: "kalkulasi-margin", label: "Murabaha Margin Calculator", to: "/syariah/akad?app=murabahah" },
      { id: "skema-cicilan", label: "Installment Schedule", to: "/syariah/akad?app=murabahah" },
      { id: "verifikasi-komoditas", label: "Asset Ownership Verification", to: "/syariah/akad?app=murabahah" },
    ],
  },
  {
    id: "ijarah-sewa-manfaat",
    name: "Ijarah",
    category: "komersial",
    categoryLabel: "Komersial",
    shortDesc:
      "Penyewaan manfaat barang dan jasa tenaga kerja dengan klausul perpindahan kepemilikan di akhir sewa (Ijarah Muntahiya Bittamlik).",
    to: "/syariah/akad?app=ijarah",
    icon: FileCheck,
    badge: "Komersial",
    accentGradient: "from-indigo-500 to-sky-600",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "Komersial",
    subMenus: [
      { id: "ijarah-sewa", label: "Ijarah Contract", to: "/syariah/akad?app=ijarah" },
      { id: "imbt-kalkulator", label: "IMBT Calculator", to: "/syariah/akad?app=ijarah" },
      { id: "maintenance-rule", label: "Asset Owner Responsibilities", to: "/syariah/akad?app=ijarah" },
    ],
  },
  {
    id: "salam-istishna-pesanan",
    name: "Salam and Istisna",
    category: "komersial",
    categoryLabel: "Komersial",
    shortDesc:
      "Akad pembiayaan pesanan manufaktur bertahap (Istishna') dan jual beli komoditas pertanian dengan pembayaran di muka (Salam).",
    to: "/syariah/akad?app=istishna",
    icon: Package,
    badge: "Komersial",
    accentGradient: "from-sky-500 to-teal-600",
    accentBorder: "border-sky-500/30 hover:border-sky-500/60",
    badgeBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    badgeText: "Komersial",
    subMenus: [
      { id: "istishna-termin", label: "Project Payment Milestones", to: "/syariah/akad?app=istishna" },
      { id: "salam-tani", label: "Salam Commodity Contract", to: "/syariah/akad?app=salam" },
      { id: "spesifikasi-teknis", label: "Specifications and Quality Standards", to: "/syariah/akad?app=istishna" },
    ],
  },

  // ============================================================================
  // 3. Proteksi (1 App)
  // ============================================================================
  {
    id: "takaful-tamin",
    name: "Takaful",
    category: "proteksi",
    categoryLabel: "Proteksi",
    shortDesc:
      "Proteksi tolong-menolong berbasis dana tabarru' bersama, pembagian surplus underwriting, dan bebas dari unsur gharar serta maisir.",
    to: "/syariah/akad?app=takaful",
    icon: ShieldCheck,
    badge: "Proteksi",
    accentGradient: "from-cyan-500 to-blue-600",
    accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    badgeText: "Proteksi",
    subMenus: [
      { id: "dana-tabarru", label: "Pool Dana Tabarru'", to: "/syariah/akad?app=takaful" },
      { id: "surplus-underwriting", label: "Kalkulasi Surplus Underwriting", to: "/syariah/akad?app=takaful" },
      { id: "klaim-takaful", label: "Klaim Ta'awun", to: "/syariah/akad?app=takaful" },
    ],
  },

  // ============================================================================
  // 4. Simpanan (1 App)
  // ============================================================================
  {
    id: "wadiah-amanah",
    name: "Wadiah",
    category: "simpanan",
    categoryLabel: "Simpanan",
    shortDesc:
      "Penyimpanan dana dan titipan murni (Wadiah Yad Dhamanah & Amanah) tanpa bunga dengan transparansi jaminan keutuhan titipan.",
    to: "/syariah/akad?app=wadiah",
    icon: Shield,
    badge: "Simpanan",
    accentGradient: "from-teal-600 to-emerald-700",
    accentBorder: "border-teal-600/30 hover:border-teal-600/60",
    badgeBg: "bg-teal-600/15 text-teal-600 dark:text-teal-400 border-teal-600/30",
    badgeText: "Simpanan",
    subMenus: [
      { id: "wadiah-dhamanah", label: "Wadiah Yad Dhamanah", to: "/syariah/akad?app=wadiah" },
      { id: "titipan-fisik", label: "Titipan Fisik & Emas", to: "/syariah/akad?app=wadiah" },
      { id: "pencatatan-amanah", label: "Buku Titipan", to: "/syariah/akad?app=wadiah" },
    ],
  },

  // ============================================================================
  // 5. Zakat (3 Apps)
  // ============================================================================
  {
    id: "zakat-maal-portofolio",
    name: "Zakat on Wealth",
    category: "zakat",
    categoryLabel: "Zakat",
    shortDesc:
      "Kalkulator nisab emas 85 gram, haul 1 tahun hijriyah, pembersihan dividen, dan alokasi asnaf 8 penerima zakat.",
    to: "/zakat?app=maal",
    icon: Coins,
    badge: "Zakat",
    accentGradient: "from-yellow-500 to-amber-600",
    accentBorder: "border-yellow-500/30 hover:border-yellow-500/60",
    badgeBg: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    badgeText: "Zakat",
    subMenus: [
      { id: "nisab-tracker", label: "Live Tracker Nisab Emas", to: "/zakat?app=maal" },
      { id: "haul-calendar", label: "Kalender Haul 354 Hari", to: "/zakat?app=maal" },
      { id: "portofolio-syariah", label: "Zakat Saham & Reksa Dana", to: "/zakat?app=saham" },
    ],
  },
  {
    id: "zakat-penghasilan-profesi",
    name: "Income Zakat",
    category: "zakat",
    categoryLabel: "Zakat",
    shortDesc:
      "Kalkulasi zakat 2.5% dari pendapatan bersih bulanan, kompensasi kebutuhan pokok, dan perbandingan analogi zakat pertanian/emas.",
    to: "/zakat?app=profesi",
    icon: Wallet,
    badge: "Zakat",
    accentGradient: "from-amber-600 to-orange-700",
    accentBorder: "border-amber-600/30 hover:border-amber-600/60",
    badgeBg: "bg-amber-600/15 text-amber-600 dark:text-amber-400 border-amber-600/30",
    badgeText: "Zakat",
    subMenus: [
      { id: "gaji-bersih", label: "Kalkulator Zakat Bulanan", to: "/zakat?app=profesi" },
      { id: "potongan-pokok", label: "Pengurang Biaya Pokok", to: "/zakat?app=profesi" },
      { id: "buku-pembayaran", label: "Histori Penyaluran LAZ", to: "/zakat?app=profesi" },
    ],
  },
  {
    id: "fidyah-kaffarah-fitrah",
    name: "Zakat al-Fitr",
    category: "zakat",
    categoryLabel: "Zakat",
    shortDesc:
      "Kalkulator beras 2.5 kg / 3.5 liter, penghitungan utang puasa fidyah, dan penebus kaffarah sumpah sesuai takaran sha'.",
    to: "/zakat?app=fitrah",
    icon: Scale,
    badge: "Zakat",
    accentGradient: "from-lime-500 to-emerald-600",
    accentBorder: "border-lime-500/30 hover:border-lime-500/60",
    badgeBg: "bg-lime-500/15 text-lime-600 dark:text-lime-400 border-lime-500/30",
    badgeText: "Zakat",
    subMenus: [
      { id: "takaran-fitrah", label: "Konversi Sha' Beras / Rupiah", to: "/zakat?app=fitrah" },
      { id: "fidyah-puasa", label: "Hitung Fidyah Harian", to: "/zakat?app=fidyah" },
      { id: "kaffarah-calc", label: "Panduan Kaffarah", to: "/zakat?app=kaffarah" },
    ],
  },

  // ============================================================================
  // 6. Investasi (1 App)
  // ============================================================================
  {
    id: "screening-saham-syariah",
    name: "Sharia Stock Screening",
    category: "investasi",
    categoryLabel: "Investasi",
    shortDesc:
      "Verifikasi kriteria OJK: rasio utang berbasis bunga <45%, pendapatan non-halal <10%, dan lini bisnis legal syariah.",
    to: "/100-komoditas?tab=syariah",
    icon: ShieldCheck,
    badge: "Investasi",
    accentGradient: "from-emerald-600 to-green-700",
    accentBorder: "border-emerald-600/30 hover:border-emerald-600/60",
    badgeBg: "bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-600/30",
    badgeText: "Investasi",
    subMenus: [
      { id: "rasio-utang", label: "Financial Ratio Screen (45%)", to: "/100-komoditas?tab=syariah" },
      { id: "non-halal-rev", label: "Non-Halal Revenue (<10%)", to: "/100-komoditas?tab=syariah" },
      { id: "daftar-des", label: "Daftar Efek Syariah (DES)", to: "/100-komoditas?tab=syariah" },
    ],
  },

  // ============================================================================
  // 7. Kepatuhan (2 Apps)
  // ============================================================================
  {
    id: "audit-bebas-riba",
    name: "Riba Compliance",
    category: "kepatuhan",
    categoryLabel: "Kepatuhan",
    shortDesc:
      "Deteksi riba fadhl, riba nasiah, riba jahiliyah, dan kalkulator cleansing bunga konvensional pada rekening dan investasi.",
    to: "/syariah/terlarang?app=riba",
    icon: ShieldAlert,
    badge: "Kepatuhan",
    accentGradient: "from-rose-500 to-red-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Kepatuhan",
    subMenus: [
      { id: "cleansing-bunga", label: "Cleansing Dana Bunga", to: "/syariah/terlarang?app=cleansing" },
      { id: "identifikasi-riba", label: "Identifikasi Riba Akad", to: "/syariah/terlarang?app=riba" },
      { id: "fatwa-dsn-mui", label: "Rujukan Fatwa DSN-MUI", to: "/syariah/terlarang?app=fatwa" },
    ],
  },
  {
    id: "audit-gharar-maysir",
    name: "Gharar Compliance",
    category: "kepatuhan",
    categoryLabel: "Kepatuhan",
    shortDesc:
      "Audit ketidakjelasan objek (gharar), spekulasi judi nir-fundamental (maysir), dan rekayasa penipuan kuantitas/harga (tadlis).",
    to: "/syariah/terlarang?app=gharar",
    icon: Scale,
    badge: "Kepatuhan",
    accentGradient: "from-purple-500 to-indigo-600",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeText: "Kepatuhan",
    subMenus: [
      { id: "uji-gharar", label: "Cek Kejelasan Objek", to: "/syariah/terlarang?app=gharar" },
      { id: "uji-maysir", label: "Deteksi Spekulasi Maysir", to: "/syariah/terlarang?app=maysir" },
      { id: "standar-aaoifi", label: "Standar Syariah AAOIFI", to: "/syariah/terlarang?app=aaoifi" },
    ],
  },
];

export const SHARIA_CATEGORY_TABS: {
  id: ShariaCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 16 },
  { id: "sosial", label: "Sosial", count: 3 },
  { id: "komersial", label: "Komersial", count: 5 },
  { id: "proteksi", label: "Proteksi", count: 1 },
  { id: "simpanan", label: "Simpanan", count: 1 },
  { id: "zakat", label: "Zakat", count: 3 },
  { id: "investasi", label: "Investasi", count: 1 },
  { id: "kepatuhan", label: "Kepatuhan", count: 2 },
];

export function IslamicPrinciplesShariaValuesPage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] =
    useState<ShariaCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_sharia") || "mode_sharia";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();

  const filteredApps = useMemo(() => {
    return SHARIA_APPS.filter((app) => {
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
      {/* Portaled ShellHeader Filter Pills */}
      <ShellHeader>
        <HeaderNavPills
          items={adjustCategoryTabsCount(SHARIA_CATEGORY_TABS, getPageCountDelta(pageId))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as any)}
        />
      </ShellHeader>

      {/* Main Page Container */}
      <div className="w-full mx-auto pt-3 sm:pt-4 space-y-4">
        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <Scale className="size-7 text-primary" />
            <span>Islamic Principles and Sharia Values</span>
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
            <h3 className="text-base font-semibold text-foreground">
              Tidak ada modul muamalah ditemukan
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              Coba kata kunci pencarian lain atau pilih tab kategori lain untuk melihat seluruh modul.
            </p>
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
