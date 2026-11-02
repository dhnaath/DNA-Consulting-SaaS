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
  | "bisnis"
  | "zakat"
  | "audit";

export interface ShariaSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface ShariaAppItem {
  id: string;
  name: string;
  category: "sosial" | "bisnis" | "zakat" | "audit";
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
  // 1. Akad Sosial (Tabarru' & Ta'awun) - 5 Apps
  // ============================================================================
  {
    id: "tabarru-hibah",
    name: "Tabarru' & Hibah Manager",
    category: "sosial",
    categoryLabel: "Akad Sosial",
    shortDesc:
      "Pengelolaan donasi sukarela, akad hibah keluarga, wakaf produktif, dan instrumen kebajikan non-profit demi kemaslahatan umat.",
    to: "/syariah/akad?app=tabarru",
    icon: HeartHandshake,
    badge: "Akad Sosial",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Akad Sosial",
    subMenus: [
      { id: "tabarru-contract", label: "Akad Tabarru'", to: "/syariah/akad?app=tabarru" },
      { id: "hibah-family", label: "Hibah Keluarga", to: "/syariah/akad?app=hibah" },
      { id: "infaq-sedekah", label: "Infaq & Sedekah", to: "/zakat?app=infaq" },
      { id: "qardh-hasan", label: "Qardh Al-Hasan", to: "/syariah/akad?app=qardh" },
    ],
  },
  {
    id: "qardh-kebajikan",
    name: "Qardh & Pinjaman Kebajikan",
    category: "sosial",
    categoryLabel: "Akad Sosial",
    shortDesc:
      "Sistem pinjaman kebajikan tanpa bunga (0% riba) dengan transparansi pengembalian pokok dan pencatatan ta'awun tolong-menolong.",
    to: "/syariah/akad?app=qardh",
    icon: Coins,
    badge: "Pinjaman Syariah",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Akad Sosial",
    subMenus: [
      { id: "qardh-ledger", label: "Buku Piutang Hasan", to: "/syariah/akad?app=qardh" },
      { id: "pelunasan-pokok", label: "Jadwal Pelunasan Pokok", to: "/syariah/akad?app=qardh" },
      { id: "keringanan-utang", label: "Klausul Keringanan", to: "/syariah/akad?app=qardh" },
    ],
  },
  {
    id: "wakaf-aset-umat",
    name: "Wakaf Produktif & Aset Umat",
    category: "sosial",
    categoryLabel: "Akad Sosial",
    shortDesc:
      "Tata kelola sertifikasi wakaf tanah, wakaf uang produktif (CWLS), pelaporan nazhir profesional, dan distribusi imbal hasil wakaf.",
    to: "/syariah/akad?app=wakaf",
    icon: Building2,
    badge: "Wakaf & Aset",
    accentGradient: "from-green-500 to-emerald-600",
    accentBorder: "border-green-500/30 hover:border-green-500/60",
    badgeBg: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
    badgeText: "Akad Sosial",
    subMenus: [
      { id: "wakaf-uang", label: "Wakaf Uang (CWLS)", to: "/syariah/akad?app=wakaf" },
      { id: "aset-wakaf", label: "Inventaris Tanah Wakaf", to: "/syariah/akad?app=wakaf" },
      { id: "laporan-nazhir", label: "Akuntabilitas Nazhir", to: "/syariah/akad?app=wakaf" },
    ],
  },
  {
    id: "takaful-tamin",
    name: "Takaful & Ta'min (Asuransi Syariah)",
    category: "sosial",
    categoryLabel: "Akad Sosial",
    shortDesc:
      "Proteksi tolong-menolong berbasis dana tabarru' bersama, pembagian surplus underwriting, dan bebas dari unsur gharar serta maisir.",
    to: "/syariah/akad?app=takaful",
    icon: ShieldCheck,
    badge: "Proteksi Syariah",
    accentGradient: "from-cyan-500 to-blue-600",
    accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    badgeText: "Akad Sosial",
    subMenus: [
      { id: "dana-tabarru", label: "Pool Dana Tabarru'", to: "/syariah/akad?app=takaful" },
      { id: "surplus-underwriting", label: "Kalkulasi Surplus Underwriting", to: "/syariah/akad?app=takaful" },
      { id: "klaim-takaful", label: "Klaim Ta'awun", to: "/syariah/akad?app=takaful" },
    ],
  },
  {
    id: "wadiah-amanah",
    name: "Wadiah & Amanah Simpanan",
    category: "sosial",
    categoryLabel: "Akad Sosial",
    shortDesc:
      "Penyimpanan dana dan titipan murni (Wadiah Yad Dhamanah & Amanah) tanpa bunga dengan transparansi jaminan keutuhan titipan.",
    to: "/syariah/akad?app=wadiah",
    icon: Shield,
    badge: "Titipan Amanah",
    accentGradient: "from-teal-600 to-emerald-700",
    accentBorder: "border-teal-600/30 hover:border-teal-600/60",
    badgeBg: "bg-teal-600/15 text-teal-600 dark:text-teal-400 border-teal-600/30",
    badgeText: "Akad Sosial",
    subMenus: [
      { id: "wadiah-dhamanah", label: "Wadiah Yad Dhamanah", to: "/syariah/akad?app=wadiah" },
      { id: "titipan-fisik", label: "Titipan Fisik & Emas", to: "/syariah/akad?app=wadiah" },
      { id: "pencatatan-amanah", label: "Buku Titipan", to: "/syariah/akad?app=wadiah" },
    ],
  },

  // ============================================================================
  // 2. Akad Bisnis & Komersial (Tijarah & Mu'awadhah) - 5 Apps
  // ============================================================================
  {
    id: "mudharabah-bagi-hasil",
    name: "Mudharabah (Bagi Hasil Usaha)",
    category: "bisnis",
    categoryLabel: "Akad Bisnis",
    shortDesc:
      "Kemitraan permodalan shahibul maal dan mudharib pengelola usaha dengan nisbah bagi untung-rugi yang adil dan transparan.",
    to: "/syariah/akad?app=mudharabah",
    icon: TrendingUp,
    badge: "Bagi Hasil",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Akad Bisnis",
    subMenus: [
      { id: "nisbah-kalkulator", label: "Kalkulator Nisbah", to: "/syariah/akad?app=mudharabah" },
      { id: "kontrak-mudharabah", label: "Draf Kontrak Shahibul Maal", to: "/syariah/akad?app=mudharabah" },
      { id: "laporan-laba-rugi", label: "Audit Laba Usaha", to: "/syariah/akad?app=mudharabah" },
    ],
  },
  {
    id: "musyarakah-equity",
    name: "Musyarakah & Kemitraan Bersama",
    category: "bisnis",
    categoryLabel: "Akad Bisnis",
    shortDesc:
      "Penyertaan modal bersama (syirkah) dengan hak suara proporsional, pembagian dividen berkala, dan evaluasi valuasi usaha.",
    to: "/syariah/akad?app=musyarakah",
    icon: Users,
    badge: "Equity Syirkah",
    accentGradient: "from-orange-500 to-amber-600",
    accentBorder: "border-orange-500/30 hover:border-orange-500/60",
    badgeBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    badgeText: "Akad Bisnis",
    subMenus: [
      { id: "musyarakah-mutanaqisah", label: "Musyarakah Mutanaqisah (MMQ)", to: "/syariah/akad?app=musyarakah" },
      { id: "syirkah-inan", label: "Syirkah Inan & Mufawadhah", to: "/syariah/akad?app=musyarakah" },
      { id: "porsi-modal", label: "Porsi Modal & Kepemilikan", to: "/syariah/akad?app=musyarakah" },
    ],
  },
  {
    id: "murabahah-costplus",
    name: "Murabahah & Margin Transparan",
    category: "bisnis",
    categoryLabel: "Akad Bisnis",
    shortDesc:
      "Jual beli komoditas/barang dengan pengungkapan harga pokok dan margin keuntungan (cost-plus markup) tanpa bunga terselubung.",
    to: "/syariah/akad?app=murabahah",
    icon: Receipt,
    badge: "Jual Beli",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Akad Bisnis",
    subMenus: [
      { id: "kalkulasi-margin", label: "Kalkulator Cost-Plus Margin", to: "/syariah/akad?app=murabahah" },
      { id: "skema-cicilan", label: "Jadwal Angsuran Tetap", to: "/syariah/akad?app=murabahah" },
      { id: "verifikasi-komoditas", label: "Verifikasi Kepemilikan Aset", to: "/syariah/akad?app=murabahah" },
    ],
  },
  {
    id: "ijarah-sewa-manfaat",
    name: "Ijarah & Sewa Jasa (IMBT)",
    category: "bisnis",
    categoryLabel: "Akad Bisnis",
    shortDesc:
      "Penyewaan manfaat barang dan jasa tenaga kerja dengan klausul perpindahan kepemilikan di akhir sewa (Ijarah Muntahiya Bittamlik).",
    to: "/syariah/akad?app=ijarah",
    icon: FileCheck,
    badge: "Sewa & Manfaat",
    accentGradient: "from-indigo-500 to-sky-600",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "Akad Bisnis",
    subMenus: [
      { id: "ijarah-sewa", label: "Kontrak Sewa Manfaat", to: "/syariah/akad?app=ijarah" },
      { id: "imbt-kalkulator", label: "Kalkulator IMBT", to: "/syariah/akad?app=ijarah" },
      { id: "maintenance-rule", label: "Tanggung Jawab Pemilik Aset", to: "/syariah/akad?app=ijarah" },
    ],
  },
  {
    id: "salam-istishna-pesanan",
    name: "Salam & Istishna' (Pemesanan)",
    category: "bisnis",
    categoryLabel: "Akad Bisnis",
    shortDesc:
      "Akad pembiayaan pesanan manufaktur bertahap (Istishna') dan jual beli komoditas pertanian dengan pembayaran di muka (Salam).",
    to: "/syariah/akad?app=istishna",
    icon: Package,
    badge: "Manufaktur & Tani",
    accentGradient: "from-sky-500 to-teal-600",
    accentBorder: "border-sky-500/30 hover:border-sky-500/60",
    badgeBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    badgeText: "Akad Bisnis",
    subMenus: [
      { id: "istishna-termin", label: "Termin Progres Fisik", to: "/syariah/akad?app=istishna" },
      { id: "salam-tani", label: "Kontrak Salam Komoditas", to: "/syariah/akad?app=salam" },
      { id: "spesifikasi-teknis", label: "Spesifikasi & Standar Mutu", to: "/syariah/akad?app=istishna" },
    ],
  },

  // ============================================================================
  // 3. Zakat & Filantropi - 3 Apps
  // ============================================================================
  {
    id: "zakat-maal-portofolio",
    name: "Zakat Maal, Emas & Portofolio",
    category: "zakat",
    categoryLabel: "Zakat & Wakaf",
    shortDesc:
      "Kalkulator nisab emas 85 gram, haul 1 tahun hijriyah, pembersihan dividen, dan alokasi asnaf 8 penerima zakat.",
    to: "/zakat?app=maal",
    icon: Coins,
    badge: "Zakat Maal",
    accentGradient: "from-yellow-500 to-amber-600",
    accentBorder: "border-yellow-500/30 hover:border-yellow-500/60",
    badgeBg: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    badgeText: "Zakat & Wakaf",
    subMenus: [
      { id: "nisab-tracker", label: "Live Tracker Nisab Emas", to: "/zakat?app=maal" },
      { id: "haul-calendar", label: "Kalender Haul 354 Hari", to: "/zakat?app=maal" },
      { id: "portofolio-syariah", label: "Zakat Saham & Reksa Dana", to: "/zakat?app=saham" },
    ],
  },
  {
    id: "zakat-penghasilan-profesi",
    name: "Zakat Penghasilan & Profesi",
    category: "zakat",
    categoryLabel: "Zakat & Wakaf",
    shortDesc:
      "Kalkulasi zakat 2.5% dari pendapatan bersih bulanan, kompensasi kebutuhan pokok, dan perbandingan analogi zakat pertanian/emas.",
    to: "/zakat?app=profesi",
    icon: Wallet,
    badge: "Zakat Profesi",
    accentGradient: "from-amber-600 to-orange-700",
    accentBorder: "border-amber-600/30 hover:border-amber-600/60",
    badgeBg: "bg-amber-600/15 text-amber-600 dark:text-amber-400 border-amber-600/30",
    badgeText: "Zakat & Wakaf",
    subMenus: [
      { id: "gaji-bersih", label: "Kalkulator Zakat Bulanan", to: "/zakat?app=profesi" },
      { id: "potongan-pokok", label: "Pengurang Biaya Pokok", to: "/zakat?app=profesi" },
      { id: "buku-pembayaran", label: "Histori Penyaluran LAZ", to: "/zakat?app=profesi" },
    ],
  },
  {
    id: "fidyah-kaffarah-fitrah",
    name: "Fidyah, Kaffarah & Zakat Fitrah",
    category: "zakat",
    categoryLabel: "Zakat & Wakaf",
    shortDesc:
      "Kalkulator beras 2.5 kg / 3.5 liter, penghitungan utang puasa fidyah, dan penebus kaffarah sumpah sesuai takaran sha'.",
    to: "/zakat?app=fitrah",
    icon: Scale,
    badge: "Fitrah & Kaffarah",
    accentGradient: "from-lime-500 to-emerald-600",
    accentBorder: "border-lime-500/30 hover:border-lime-500/60",
    badgeBg: "bg-lime-500/15 text-lime-600 dark:text-lime-400 border-lime-500/30",
    badgeText: "Zakat & Wakaf",
    subMenus: [
      { id: "takaran-fitrah", label: "Konversi Sha' Beras / Rupiah", to: "/zakat?app=fitrah" },
      { id: "fidyah-puasa", label: "Hitung Fidyah Harian", to: "/zakat?app=fidyah" },
      { id: "kaffarah-calc", label: "Panduan Kaffarah", to: "/zakat?app=kaffarah" },
    ],
  },

  // ============================================================================
  // 4. Audit & Screening Muamalah - 3 Apps
  // ============================================================================
  {
    id: "audit-bebas-riba",
    name: "Audit Bebas Riba (Screening & Cleansing)",
    category: "audit",
    categoryLabel: "Audit Muamalah",
    shortDesc:
      "Deteksi riba fadhl, riba nasiah, riba jahiliyah, dan kalkulator cleansing bunga konvensional pada rekening dan investasi.",
    to: "/syariah/terlarang?app=riba",
    icon: ShieldAlert,
    badge: "Anti-Riba",
    accentGradient: "from-rose-500 to-red-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Audit Muamalah",
    subMenus: [
      { id: "cleansing-bunga", label: "Cleansing Dana Bunga", to: "/syariah/terlarang?app=cleansing" },
      { id: "identifikasi-riba", label: "Identifikasi Riba Akad", to: "/syariah/terlarang?app=riba" },
      { id: "fatwa-dsn-mui", label: "Rujukan Fatwa DSN-MUI", to: "/syariah/terlarang?app=fatwa" },
    ],
  },
  {
    id: "screening-saham-syariah",
    name: "Screening Saham Syariah (ISSI & DES BEI)",
    category: "audit",
    categoryLabel: "Audit Muamalah",
    shortDesc:
      "Verifikasi kriteria OJK: rasio utang berbasis bunga <45%, pendapatan non-halal <10%, dan lini bisnis legal syariah.",
    to: "/100-komoditas?tab=syariah",
    icon: ShieldCheck,
    badge: "Pasar Saham",
    accentGradient: "from-emerald-600 to-green-700",
    accentBorder: "border-emerald-600/30 hover:border-emerald-600/60",
    badgeBg: "bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border-emerald-600/30",
    badgeText: "Audit Muamalah",
    subMenus: [
      { id: "rasio-utang", label: "Financial Ratio Screen (45%)", to: "/100-komoditas?tab=syariah" },
      { id: "non-halal-rev", label: "Non-Halal Revenue (<10%)", to: "/100-komoditas?tab=syariah" },
      { id: "daftar-des", label: "Daftar Efek Syariah (DES)", to: "/100-komoditas?tab=syariah" },
    ],
  },
  {
    id: "audit-gharar-maysir",
    name: "Audit Gharar, Maysir & Tadlis",
    category: "audit",
    categoryLabel: "Audit Muamalah",
    shortDesc:
      "Audit ketidakjelasan objek (gharar), spekulasi judi nir-fundamental (maysir), dan rekayasa penipuan kuantitas/harga (tadlis).",
    to: "/syariah/terlarang?app=gharar",
    icon: Scale,
    badge: "Kepatuhan Akad",
    accentGradient: "from-purple-500 to-indigo-600",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeText: "Audit Muamalah",
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
  { id: "sosial", label: "Akad Sosial", count: 5 },
  { id: "bisnis", label: "Akad Bisnis", count: 5 },
  { id: "zakat", label: "Zakat & Wakaf", count: 3 },
  { id: "audit", label: "Audit Muamalah", count: 3 },
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
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-4">
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
