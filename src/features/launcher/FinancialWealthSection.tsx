import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Scale,
  Globe,
  Umbrella,
  Vault,
  Lock,
  CreditCard,
  ArrowRightLeft,
  Banknote,
  Receipt,
  Activity,
  Brain,
  Network,
  Briefcase,
  Landmark,
  BookOpen,
  PieChart,
  Zap,
  TrendingUp,
  RefreshCw,
  GraduationCap,
  Building,
  HeartHandshake,
  ReceiptText,
  Gift,
  Coins,
  DollarSign,
  ShoppingCart,
  Wallet,
  Home,
  ScrollText,
  Binary,
  Lightbulb,
  HeartPulse,
  LineChart,
  Package,
  Calculator,
  Key,
  Users,
  Star,
  Layers,
  ArrowRight,
  ShieldCheck,
  Heart,
  Handshake,
  Archive,
  Tag,
  Shield,
  CheckCircle2,
  AlertOctagon,
  ShieldAlert,
  Dice5,
  Sprout,
  ChevronDown,
  ChevronUp,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { type NavItem } from "@/config/nav";
import { cn } from "@/lib/utils";
import { HeaderNavPills, ShellHeader } from "@/app/shell-header";
import { MBACard } from "@/components/common/MBACard";
import { MovedCardsSection } from "@/components/common/MovedCardsGridItems";
import {
  LauncherPageProvider,
  adjustCategoryTabsCount,
  useCardPageMover,
  useCurrentLauncherPage,
} from "@/hooks/useCardPageMover";
import { useLanguage, type Language } from "@/features/finance/hooks/useLanguage";


export interface FinancialStandaloneFeature {
  title: string;
  to: string;
  icon: LucideIcon;
  desc?: string;
}

export interface StandaloneFinancialAppDef {
  id: string;
  to: string;
  title: string;
  subtitle: string;
  category: "surety" | "flow" | "build" | "grow" | "legacy" | "sharia";
  categoryLabel: string;
  icon: LucideIcon;
  badge?: string;
  isEmpty?: boolean;
  features?: FinancialStandaloneFeature[];
}

export const STANDALONE_FINANCIAL_APPS: StandaloneFinancialAppDef[] = [
  // ==========================================
  // PILAR 1: SURETY (KEPASTIAN & PROTEKSI) - 5 MODUL
  // ==========================================
  {
    id: "kepatuhan-hukum",
    to: "/surety?tab=cat_kepatuhan",
    title: "Legal Compliance",
    subtitle: "Kepatuhan legalitas keuangan perbankan, regulasi otoritas jasa keuangan, serta audit kepatuhan.",
    category: "surety",
    categoryLabel: "Surety",
    icon: Scale,
    badge: "Standalone",
    features: [
      { title: "Audit Kepatuhan", to: "/surety?tab=cat_kepatuhan&sub=audit", icon: Scale },
      { title: "Regulasi OJK & BI", to: "/surety?tab=cat_kepatuhan&sub=regulasi", icon: ShieldCheck },
    ],
  },
  {
    id: "perlindungan-publik",
    to: "/surety?tab=cat_publik",
    title: "Public Protection",
    subtitle: "Sistem jaminan sosial nasional, perlindungan keselamatan publik, dan asuransi sosial dasar tenaga kerja.",
    category: "surety",
    categoryLabel: "Surety",
    icon: Globe,
    badge: "Standalone",
    features: [
      { title: "Jaminan Sosial BPJS", to: "/surety?tab=cat_publik&sub=bpjs", icon: Globe },
      { title: "Keselamatan Kerja", to: "/surety?tab=cat_publik&sub=k3", icon: Shield },
    ],
  },
  {
    id: "asuransi-pribadi",
    to: "/surety?tab=cat_asuransi",
    title: "Private Insurance",
    subtitle: "Proteksi risiko kesehatan personal, penyakit kritis, dan proteksi asuransi jiwa finansial keluarga.",
    category: "surety",
    categoryLabel: "Surety",
    icon: Umbrella,
    badge: "Standalone",
    features: [
      { title: "Asuransi Kesehatan", to: "/surety?tab=cat_asuransi&sub=kesehatan", icon: HeartPulse },
      { title: "Asuransi Jiwa & Kritis", to: "/surety?tab=cat_asuransi&sub=jiwa", icon: Umbrella },
    ],
  },
  {
    id: "kecukupan-dana",
    to: "/surety?tab=cat_dana",
    title: "Fund Sufficiency",
    subtitle: "Fondasi cadangan dana darurat, buffer likuiditas operasional, dan pemeliharaan kas likuid tak terduga.",
    category: "surety",
    categoryLabel: "Surety",
    icon: Vault,
    badge: "Standalone",
    features: [
      { title: "Liquid Reserves", to: "/liquid-reserves", icon: Coins },
      { title: "Dana Darurat (Buffer)", to: "/surety?tab=cat_dana&sub=darurat", icon: Vault },
    ],
  },
  {
    id: "proteksi-aset",
    to: "/surety?tab=cat_proteksi",
    title: "Asset Protection",
    subtitle: "Brankas terenkripsi dokumen fisik aset, akses sandi finansial aman, dan pengarsipan nota garansi belanja.",
    category: "surety",
    categoryLabel: "Surety",
    icon: Lock,
    badge: "Standalone",
    features: [
      { title: "Dokumen Aset", to: "/surety?tab=cat_proteksi&sub=vault", icon: ShieldCheck },
      { title: "Passwords", to: "/surety?tab=cat_proteksi&sub=passwords", icon: Key },
      { title: "Garansi dan Bukti Nota", to: "/surety?tab=cat_proteksi", icon: ShieldCheck },
    ],
  },

  // ==========================================
  // PILAR 2: FLOW (ARUS KAS & LIABILITAS) - 5 MODUL
  // ==========================================
  {
    id: "beban-liabilitas",
    to: "/flow?tab=cat_liabilitas",
    title: "Burden Liability",
    subtitle: "Pengawasan kewajiban finansial jangka pendek dan panjang, pemetaan rasio utang, serta cicilan bulanan.",
    category: "flow",
    categoryLabel: "Flow",
    icon: CreditCard,
    badge: "Standalone",
    features: [
      { title: "Kuadran Liabilitas", to: "/liability", icon: CreditCard },
      { title: "Rasio Utang (DSR)", to: "/flow?tab=cat_liabilitas&sub=rasio", icon: Calculator },
    ],
  },
  {
    id: "pemasukan-pengeluaran",
    to: "/flow?tab=cat_pengeluaran",
    title: "Income-Expense",
    subtitle: "Monitoring komprehensif aliran pendapatan aktif/pasif serta tracking kuadran pengeluaran primer dan sekunder.",
    category: "flow",
    categoryLabel: "Flow",
    icon: ArrowRightLeft,
    badge: "Standalone",
    features: [
      { title: "Kuadran Pendapatan", to: "/earning", icon: DollarSign },
      { title: "Kuadran Pengeluaran", to: "/expense", icon: ShoppingCart },
    ],
  },
  {
    id: "kas-kredit",
    to: "/flow?tab=cat_kredit",
    title: "Cash-Credit",
    subtitle: "Pengelolaan saldo kas harian, transaksi multi-wallet, serta kontrol limit kartu kredit dan pinjaman lunak.",
    category: "flow",
    categoryLabel: "Flow",
    icon: Banknote,
    badge: "Standalone",
    features: [
      { title: "Buku Arus Kas", to: "/flow?tab=cat_arus_kas", icon: Banknote },
      { title: "Kredit dan Utang", to: "/kredit", icon: CreditCard },
    ],
  },
  {
    id: "retribusi-kontribusi",
    to: "/flow?tab=cat_pajak",
    title: "Retribution-Contribution",
    subtitle: "Perhitungan estimasi pajak penghasilan pribadi (PPh 21 progresif), PTKP, dan kepatuhan kontribusi pajak resmi.",
    category: "flow",
    categoryLabel: "Flow",
    icon: Receipt,
    badge: "Standalone",
    features: [
      { title: "Pajak Personal (PPh 21)", to: "/pajak?app=pph21", icon: Calculator },
      { title: "PPN & Pajak Lain", to: "/pajak?app=ppn", icon: Receipt },
    ],
  },
  {
    id: "sistem-otomatisasi",
    to: "/flow?tab=cat_otomatisasi",
    title: "Automation System",
    subtitle: "Otomasi sistem alokasi anggaran bulanan dengan formula persentase 50/30/20 dan autodebet investasi rutin.",
    category: "flow",
    categoryLabel: "Flow",
    icon: Activity,
    badge: "Standalone",
    features: [
      { title: "Budget 50/30/20", to: "/budget", icon: Wallet },
      { title: "Autodebet Rutin", to: "/flow?tab=cat_otomatisasi&sub=autodebet", icon: Activity },
    ],
  },

  // ==========================================
  // PILAR 3: BUILD (AKUMULASI & PORTOFOLIO) - 5 MODUL
  // ==========================================
  {
    id: "modal-manusia",
    to: "/build?tab=cat_modal",
    title: "Human Capital",
    subtitle: "Valuasi kapasitas nilai keahlian diri, daya ungkit karier profesional, dan estimasi nilai kapital manusia.",
    category: "build",
    categoryLabel: "Build",
    icon: Brain,
    badge: "Standalone",
    features: [
      { title: "Valuasi Diri & Skill", to: "/build?tab=cat_modal&sub=skill", icon: Brain },
      { title: "Daya Ungkit Karier", to: "/build?tab=cat_modal&sub=karier", icon: TrendingUp },
    ],
  },
  {
    id: "jaringan",
    to: "/build?tab=cat_jaringan",
    title: "Net-Work",
    subtitle: "Pusat relasi kemitraan bisnis penghasil omset dan direktori kontak spesialis keuangan, banker, serta akuntan.",
    category: "build",
    categoryLabel: "Build",
    icon: Network,
    badge: "Standalone",
    features: [
      { title: "Klien dan Partner", to: "/build?tab=cat_jaringan&sub=klien", icon: Briefcase },
      { title: "People Manager", to: "/build?tab=cat_jaringan&sub=people", icon: Users },
    ],
  },
  {
    id: "portofolio",
    to: "/build?tab=cat_portofolio",
    title: "Portfolio",
    subtitle: "Manajemen kepemilikan multi-aset: properti real estate, surat berharga saham/sukuk, aset digital, dan HKI.",
    category: "build",
    categoryLabel: "Build",
    icon: Briefcase,
    badge: "Standalone",
    features: [
      { title: "Real Estate", to: "/real-estate", icon: Home },
      { title: "Paper Securities", to: "/paper-securities", icon: ScrollText },
      { title: "Digital Assets", to: "/digital-assets", icon: Binary },
      { title: "Intellectual Property", to: "/intellectual-property", icon: Lightbulb },
    ],
  },
  {
    id: "kekayaan-bersih",
    to: "/build?tab=cat_kekayaan",
    title: "Net-Worth",
    subtitle: "Perhitungan kalkulasi total net worth bersih dari seluruh kelas aset serta asesmen rasio kesehatan keuangan.",
    category: "build",
    categoryLabel: "Build",
    icon: Landmark,
    badge: "Standalone",
    features: [
      { title: "Kuadran Aset", to: "/asset", icon: Briefcase },
      { title: "Kesehatan Finansial", to: "/financial-health", icon: HeartPulse },
    ],
  },
  {
    id: "pembukuan",
    to: "/build?tab=cat_pembukuan",
    title: "Book Entry",
    subtitle: "Sistem pembukuan neraca saldo aset personal, jurnal penyesuaian arus transaksi, dan pencatatan buku besar.",
    category: "build",
    categoryLabel: "Build",
    icon: BookOpen,
    badge: "Standalone",
    features: [
      { title: "Neraca Saldo Aset", to: "/build?tab=cat_pembukuan&sub=neraca", icon: BookOpen },
      { title: "Jurnal Transaksi", to: "/build?tab=cat_pembukuan&sub=jurnal", icon: ReceiptText },
    ],
  },

  // ==========================================
  // PILAR 4: GROW (PERTUMBUHAN & INVESTASI) - 5 MODUL
  // ==========================================
  {
    id: "profil-risiko",
    to: "/grow?tab=cat_profil",
    title: "Risk Profiling",
    subtitle: "Diagnostik toleransi risiko investor (konservatif, moderat, agresif) serta horizon waktu pencapaian target modal.",
    category: "grow",
    categoryLabel: "Grow",
    icon: Activity,
    badge: "Standalone",
    features: [
      { title: "Diagnostik Toleransi", to: "/grow?tab=cat_profil&sub=toleransi", icon: Activity },
      { title: "Horizon Waktu Modal", to: "/grow?tab=cat_profil&sub=horizon", icon: LineChart },
    ],
  },
  {
    id: "alokasi",
    to: "/grow?tab=cat_alokasi",
    title: "Allocation",
    subtitle: "Strategi alokasi aset syariah melalui pasar muamalah fisik, indeks saham sharia, dan 100 komoditas riil dunia.",
    category: "grow",
    categoryLabel: "Grow",
    icon: PieChart,
    badge: "Standalone",
    features: [
      { title: "Logam Mulia & Saham", to: "/100-komoditas", icon: Coins },
      { title: "Market Price Monitor", to: "/100-komoditas", icon: Package },
    ],
  },
  {
    id: "efektif-efisien",
    to: "/grow?tab=cat_efektif",
    title: "Effective-Efficient",
    subtitle: "Pengurangan friction fee transaksi, rasio efisiensi pengelolaan instrumen, dan maksimalisasi net yield return.",
    category: "grow",
    categoryLabel: "Grow",
    icon: Zap,
    badge: "Standalone",
    features: [
      { title: "Efisiensi Biaya & Fee", to: "/grow?tab=cat_efektif&sub=friction", icon: Zap },
      { title: "Maksimalisasi Net Yield", to: "/grow?tab=cat_efektif&sub=yield", icon: TrendingUp },
    ],
  },
  {
    id: "bunga-berbunga",
    to: "/grow?tab=cat_bunga",
    title: "Compounding",
    subtitle: "Simulasi kekuatan bunga majemuk (compounding interest) dan kalkulator Return on Investment (ROI) berkala.",
    category: "grow",
    categoryLabel: "Grow",
    icon: TrendingUp,
    badge: "Standalone",
    features: [
      { title: "Bunga Majemuk dan ROI", to: "/investasi?app=bunga-majemuk", icon: Calculator },
      { title: "Simulasi Waktu Majemuk", to: "/investasi?app=roi", icon: TrendingUp },
    ],
  },
  {
    id: "rebalancing-periodik",
    to: "/grow?tab=cat_rebalance",
    title: "Periodic Rebalancing",
    subtitle: "Penyesuaian periodik deviasi alokasi aset investasi agar tetap berada pada batas toleransi risiko yang optimal.",
    category: "grow",
    categoryLabel: "Grow",
    icon: RefreshCw,
    badge: "Standalone",
    features: [
      { title: "Deviasi Alokasi Aset", to: "/grow?tab=cat_rebalance&sub=deviasi", icon: RefreshCw },
      { title: "Jadwal Rebalancing", to: "/grow?tab=cat_rebalance&sub=jadwal", icon: Layers },
    ],
  },

  // ==========================================
  // PILAR 5: LEGACY (WARISAN & FILANTROPI) - 5 MODUL
  // ==========================================
  {
    id: "pembelajaran-seumur-hidup",
    to: "/legacy?tab=cat_pembelajaran",
    title: "Lifelong Learning",
    subtitle: "Edukasi filosofi kekayaan keluarga, kurikulum literasi finansial antargenerasi, dan transfer nilai-nilai bijak.",
    category: "legacy",
    categoryLabel: "Legacy",
    icon: GraduationCap,
    badge: "Standalone",
    features: [
      { title: "Literasi Antargenerasi", to: "/legacy?tab=cat_pembelajaran&sub=literasi", icon: GraduationCap },
      { title: "Filosofi Nilai Keluarga", to: "/legacy?tab=cat_pembelajaran&sub=filosofi", icon: BookOpen },
    ],
  },
  {
    id: "tata-kelola",
    to: "/legacy?tab=cat_tatakelola",
    title: "Good Governance",
    subtitle: "Tata kelola legalitas aset keluarga, struktur kepemilikan terstruktur, dan kepatuhan hukum antargenerasi.",
    category: "legacy",
    categoryLabel: "Legacy",
    icon: Building,
    badge: "Standalone",
    features: [
      { title: "Tata Kelola & Audit Aset", to: "/legacy?tab=cat_tatakelola", icon: Scale },
      { title: "Struktur Kepemilikan", to: "/legacy?tab=cat_tatakelola&sub=struktur", icon: Building },
    ],
  },
  {
    id: "kontribusi-amal",
    to: "/legacy?tab=cat_amal",
    title: "Charitable Concern",
    subtitle: "Penyaluran zakat dan sedekah terstruktur, pelacak donasi infaq kemanusiaan, serta pencatatan relawan sosial.",
    category: "legacy",
    categoryLabel: "Legacy",
    icon: HeartHandshake,
    badge: "Standalone",
    features: [
      { title: "Zakat dan Sedekah", to: "/legacy?tab=cat_amal&sub=zakat", icon: Coins },
      { title: "Catatan Infaq dan Donasi", to: "/lainnya?app=donation-tracker", icon: Coins },
      { title: "Relawan dan Bakti Sosial", to: "/lainnya?app=volunteer-log", icon: Heart },
    ],
  },
  {
    id: "likuidasi-kewajiban",
    to: "/legacy?tab=cat_likuidasi",
    title: "Liability Liquidation",
    subtitle: "Prosedur penutupan dan pelunasan seluruh sisa kewajiban hutang piutang sebelum transisi pembagian warisan aset.",
    category: "legacy",
    categoryLabel: "Legacy",
    icon: ReceiptText,
    badge: "Standalone",
    features: [
      { title: "Kredit dan Utang", to: "/kredit", icon: CreditCard },
      { title: "Pelunasan Kewajiban", to: "/legacy?tab=cat_likuidasi&sub=pelunasan", icon: ReceiptText },
    ],
  },
  {
    id: "transfer-kekayaan",
    to: "/legacy?tab=cat_transfer",
    title: "Wealth Transfer",
    subtitle: "Perencanaan suksesi peralihan portofolio aset, pembagian hak waris, dan pemindahan hak milik bebas sengketa.",
    category: "legacy",
    categoryLabel: "Legacy",
    icon: Gift,
    badge: "Standalone",
    features: [
      { title: "Portofolio Waris", to: "/build?tab=cat_portofolio", icon: Briefcase },
      { title: "Perencanaan Suksesi", to: "/legacy?tab=cat_transfer&sub=suksesi", icon: Gift },
    ],
  },

  // ==========================================
  // KATEGORI KHUSUS: SHARIA PRINCIPLES
  // ==========================================
  {
    id: "akad-tabarru",
    to: "/syariah/akad?app=tabarru",
    title: "Tabarru'",
    subtitle: "Akad kebajikan dan tolong-menolong tanpa motif komersial untuk proteksi risiko musibah, santunan, dan donasi sosial.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: HeartHandshake,
    badge: "Standalone",
    features: [
      { title: "Kalkulator Dana Tabarru'", to: "/syariah/akad?app=tabarru", icon: Calculator },
      { title: "Rukun & Fatwa DSN", to: "/syariah/akad?app=tabarru", icon: BookOpen },
    ],
  },
  {
    id: "akad-mudharabah",
    to: "/syariah/akad?app=mudharabah",
    title: "Mudharabah",
    subtitle: "Akad kemitraan usaha bagi hasil antara shahibul maal (penyedia modal 100%) dan mudharib (pengelola keahlian usaha).",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Scale,
    badge: "Standalone",
    features: [
      { title: "Simulasi Nisbah Bagi Hasil", to: "/syariah/akad?app=mudharabah", icon: Calculator },
      { title: "Struktur Modal & Profit", to: "/syariah/akad?app=mudharabah", icon: TrendingUp },
    ],
  },
  {
    id: "akad-wakalah",
    to: "/syariah/akad?app=wakalah",
    title: "Wakalah",
    subtitle: "Pelimpahan kuasa perwakilan dari satu pihak kepada pihak lain untuk mengelola urusan finansial atau investasi dengan ujrah.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Handshake,
    badge: "Standalone",
    features: [
      { title: "Kalkulator Fee Ujrah", to: "/syariah/akad?app=wakalah", icon: Calculator },
      { title: "Mandat Kuasa Kelola", to: "/syariah/akad?app=wakalah", icon: CheckCircle2 },
    ],
  },
  {
    id: "akad-wadiah",
    to: "/syariah/akad?app=wadiah",
    title: "Wadiah",
    subtitle: "Akad penitipan murni dana atau aset (amanah) atau titipan dengan hak guna kelola dan jaminan penarikan penuh (dhamanah).",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Archive,
    badge: "Standalone",
    features: [
      { title: "Audit Titipan Amanah", to: "/syariah/akad?app=wadiah", icon: ShieldCheck },
      { title: "Simulasi Bonus Sukarela", to: "/syariah/akad?app=wadiah", icon: Coins },
    ],
  },
  {
    id: "akad-musyarakah",
    to: "/syariah/akad?app=musyarakah",
    title: "Musyarakah",
    subtitle: "Akad kerja sama permodalan bersama (joint venture) dengan porsi modal bersama dan pembagian laba rugi proporsional.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Users,
    badge: "Standalone",
    features: [
      { title: "Kalkulator Porsi Ekuitas", to: "/syariah/akad?app=musyarakah", icon: Calculator },
      { title: "Bagi Hasil Syirkah", to: "/syariah/akad?app=musyarakah", icon: TrendingUp },
    ],
  },
  {
    id: "akad-murabahah",
    to: "/syariah/akad?app=murabahah",
    title: "Murabahah",
    subtitle: "Akad jual beli barang dengan pengungkapan transparan harga pokok perolehan dan margin keuntungan (mark-up) yang disepakati.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Tag,
    badge: "Standalone",
    features: [
      { title: "Kalkulator Angsuran Tetap", to: "/syariah/akad?app=murabahah", icon: Calculator },
      { title: "Rincian Margin Pokok", to: "/syariah/akad?app=murabahah", icon: Receipt },
    ],
  },
  {
    id: "akad-tamin",
    to: "/syariah/akad?app=tamin",
    title: "Ta'min",
    subtitle: "Sistem perlindungan finansial mutual dan penjaminan risiko bersama antar pihak berbasis kepastian akad syariah.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Shield,
    badge: "Standalone",
    features: [
      { title: "Audit Proteksi Risiko", to: "/syariah/akad?app=tamin", icon: ShieldCheck },
      { title: "Klaim Mutual Syariah", to: "/syariah/akad?app=tamin", icon: HeartHandshake },
    ],
  },
  {
    id: "akad-takaful",
    to: "/syariah/akad?app=takaful",
    title: "Takaful",
    subtitle: "Asuransi syariah berlandaskan gotong royong saling memikul beban risiko kerugian antar peserta melalui kumpulan dana kebajikan.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Users,
    badge: "Standalone",
    features: [
      { title: "Simulasi Polis Takaful", to: "/syariah/akad?app=takaful", icon: Calculator },
      { title: "Pengelolaan Surplus", to: "/syariah/akad?app=takaful", icon: Coins },
    ],
  },
  {
    id: "akad-tadhamun",
    to: "/syariah/akad?app=tadhamun",
    title: "Tadhamun",
    subtitle: "Prinsip solidaritas komprehensif, jaminan kolektif, dan tanggung renteng dalam muamalah finansial kemasyarakatan.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Heart,
    badge: "Standalone",
    features: [
      { title: "Manajemen Tanggung Renteng", to: "/syariah/akad?app=tadhamun", icon: Users },
      { title: "Dana Tanggap Darurat", to: "/syariah/akad?app=tadhamun", icon: HeartHandshake },
    ],
  },
  {
    id: "akad-ijarah",
    to: "/syariah/akad?app=ijarah",
    title: "Ijarah",
    subtitle: "Akad sewa menyewa atas pemanfaatan hak guna (manfaat) aset atau jasa tanpa pemindahan kepemilikan pokok (opsi IMBT).",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Building,
    badge: "Standalone",
    features: [
      { title: "Simulasi Ujrah Sewa", to: "/syariah/akad?app=ijarah", icon: Calculator },
      { title: "Skema IMBT (Sewa Beli)", to: "/syariah/akad?app=ijarah", icon: Home },
    ],
  },
  {
    id: "akad-qardh",
    to: "/syariah/akad?app=qardh",
    title: "Qardh al-Hasan",
    subtitle: "Pinjaman dana kebajikan syariah murni 100% bebas bunga dan denda ribawi untuk membantu kebutuhan darurat.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Coins,
    badge: "Standalone",
    features: [
      { title: "Kalkulator Cicilan Pokok 0%", to: "/syariah/akad?app=qardh", icon: Calculator },
      { title: "Audit Pinjaman Halal", to: "/syariah/akad?app=qardh", icon: ShieldCheck },
    ],
  },
  {
    id: "zakat-penghasilan",
    to: "/zakat?app=penghasilan",
    title: "Zakat Penghasilan",
    subtitle: "Kalkulator kewajiban zakat profesi atas gaji, bonus, dan honorarium rutin bulanan setelah mencapai nishab 85g emas.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Briefcase,
    badge: "Standalone",
    features: [
      { title: "Kalkulator 2.5% Profesi", to: "/zakat?app=penghasilan", icon: Calculator },
      { title: "Fatwa & Nisab Emas", to: "/zakat?app=penghasilan", icon: BookOpen },
    ],
  },
  {
    id: "zakat-maal",
    to: "/zakat?app=maal",
    title: "Zakat Maal",
    subtitle: "Penghitungan zakat simpanan tabungan, deposito, emas batangan, perak, dan aset investasi yang telah mencapai haul 1 tahun.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Coins,
    badge: "Standalone",
    features: [
      { title: "Kalkulator Haul 1 Tahun", to: "/zakat?app=maal", icon: Calculator },
      { title: "Nisab Tabungan & Emas", to: "/zakat?app=maal", icon: Scale },
    ],
  },
  {
    id: "zakat-fitrah",
    to: "/zakat?app=fitrah",
    title: "Zakat Fitrah",
    subtitle: "Kewajiban pensucian jiwa menjelang Idul Fitri bagi setiap anggota keluarga (setara 2.5 kg atau 3.5 liter beras per jiwa).",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Users,
    badge: "Standalone",
    features: [
      { title: "Kalkulator Jiwa Keluarga", to: "/zakat?app=fitrah", icon: Calculator },
      { title: "Konversi Beras / Rupiah", to: "/zakat?app=fitrah", icon: Coins },
    ],
  },
  {
    id: "zakat-hub",
    to: "/zakat",
    title: "Zakat & Sedekah Hub",
    subtitle: "Pusat integrasi penunaian zakat, infaq kemanusiaan, sedekah produktif, dan audit distribusi 8 asnaf mustahik.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: HeartHandshake,
    badge: "Standalone",
    features: [
      { title: "Kalkulator Multiaset", to: "/zakat", icon: Calculator },
      { title: "8 Asnaf Mustahik", to: "/zakat", icon: Users },
    ],
  },
  {
    id: "audit-riba",
    to: "/syariah/terlarang?app=riba",
    title: "Audit Riba",
    subtitle: "Pemeriksaan dan diagnosis transaksi keuangan untuk memastikan bebas dari unsur bunga, denda berlipat, dan riba nasi'ah.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: AlertOctagon,
    badge: "Standalone",
    features: [
      { title: "Checklist Riba Qardh & Jual Beli", to: "/syariah/terlarang?app=riba", icon: ShieldAlert },
      { title: "Fatwa Bunga Bank", to: "/syariah/terlarang?app=riba", icon: BookOpen },
    ],
  },
  {
    id: "audit-gharar",
    to: "/syariah/terlarang?app=gharar",
    title: "Audit Gharar",
    subtitle: "Audit kejelasan dan kepastian objek akad, kuantitas, harga, serta kesanggupan serah terima untuk menghindari sengketa.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: ShieldAlert,
    badge: "Standalone",
    features: [
      { title: "Audit Ketidakpastian Akad", to: "/syariah/terlarang?app=gharar", icon: CheckCircle2 },
      { title: "Standar Kejelasan Objek", to: "/syariah/terlarang?app=gharar", icon: BookOpen },
    ],
  },
  {
    id: "audit-maysir",
    to: "/syariah/terlarang?app=maysir",
    title: "Audit Maysir",
    subtitle: "Evaluasi instrumen spekulasi zero-sum game, untung-untungan tanpa underlying riil, dan transaksi berunsur perjudian.",
    category: "sharia",
    categoryLabel: "Sharia Principles",
    icon: Dice5,
    badge: "Standalone",
    features: [
      { title: "Uji Spekulasi vs Investasi", to: "/syariah/terlarang?app=maysir", icon: Calculator },
      { title: "Kaidah Underlying Riil", to: "/syariah/terlarang?app=maysir", icon: Scale },
    ],
  },
];

interface FinancialWealthSectionProps {
  isActive?: boolean;
  page?: {
    title: string;
    subCategories: { title: string; rawItems: NavItem[] }[];
  };
  favorites: string[];
  toggleFavorite: (to: string) => void;
  setActiveFolder?: (folder: any) => void;
  getGradient: (name: string) => string;
  FolderTile?: any;
}


export type FinancialCategoryTab = "all" | "spectrum" | "surety" | "flow" | "build" | "grow" | "legacy";

export interface StageFeatureItem {
  id: string;
  title: string;
  subtitle: string;
  to: string;
  icon: LucideIcon;
  badge?: string;
  subFeatures?: { title: string; to: string; icon: LucideIcon }[];
}

export interface WealthStageMainBoxDef {
  step: number;
  id: "surety" | "flow" | "build" | "grow" | "legacy";
  name: string;
  subtitle: string;
  to: string;
  icon: LucideIcon;
  themeColor: string;
  accentClass: string;
  borderClass: string;
  badgeBg: string;
  gradientBg: string;
  description: string;
  principles: { num: number; text: string }[];
  features: StageFeatureItem[];
}

export const WEALTH_STAGE_MAIN_BOXES: WealthStageMainBoxDef[] = [
  {
    step: 1,
    id: "surety",
    name: "Surety",
    subtitle: "Mitigasi dan Kepastian Risiko",
    to: "/surety",
    icon: ShieldCheck,
    themeColor: "blue",
    accentClass: "text-blue-600 dark:text-blue-400",
    borderClass: "border-blue-500/30 hover:border-blue-500/50",
    badgeBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
    gradientBg: "from-blue-500/15 via-blue-500/5 to-transparent",
    description:
      "Fondasi keamanan ekonomi dan instrumen penjamin terhadap risiko kegagalan, melindungi aset dan aliran nilai dari peristiwa tak terduga serta memastikan stabilitas finansial berkelanjutan sebelum proses ekspansi nilai dimulai.",
    principles: [
      { num: 1, text: "Instrumen hukum dan institusional yang berfungsi sebagai penjamin terhadap risiko kegagalan atau kelalaian finansial." },
      { num: 2, text: "Lapisan ketahanan sistemik yang melindungi aset dan aliran nilai dari peristiwa tak terduga serta gangguan struktural." },
      { num: 3, text: "Syarat minimum stabilitas finansial yang harus terpenuhi sebelum proses pertumbuhan dan ekspansi nilai dimulai." },
      { num: 4, text: "Prinsip dasar perlindungan dalam sistem keuangan yang memastikan terpenuhinya kewajiban dan terjaganya stabilitas nilai ekonomi." },
      { num: 5, text: "Fondasi keamanan ekonomi yang memungkinkan perencanaan, akumulasi, dan pengembangan kekayaan secara berkelanjutan." },
    ],
    features: [
      {
        id: "kepatuhan-hukum",
        title: "Legal Compliance",
        subtitle: "Kepatuhan legalitas keuangan perbankan, regulasi otoritas jasa keuangan, serta audit kepatuhan.",
        to: "/surety?tab=cat_kepatuhan",
        icon: Scale,
      },
      {
        id: "perlindungan-publik",
        title: "Public Protection",
        subtitle: "Sistem jaminan sosial nasional, perlindungan keselamatan publik, dan asuransi sosial dasar tenaga kerja.",
        to: "/surety?tab=cat_publik",
        icon: Globe,
      },
      {
        id: "asuransi-pribadi",
        title: "Private Insurance",
        subtitle: "Proteksi risiko kesehatan personal, penyakit kritis, dan proteksi asuransi jiwa finansial keluarga.",
        to: "/surety?tab=cat_asuransi",
        icon: Umbrella,
      },
      {
        id: "kecukupan-dana",
        title: "Fund Sufficiency",
        subtitle: "Fondasi cadangan dana darurat, buffer likuiditas operasional, dan pemeliharaan kas likuid tak terduga.",
        to: "/surety?tab=cat_dana",
        icon: Vault,
        subFeatures: [
          { title: "Liquid Reserves", to: "/liquid-reserves", icon: Coins },
        ],
      },
      {
        id: "proteksi-aset",
        title: "Asset Protection",
        subtitle: "Brankas terenkripsi dokumen fisik aset, akses sandi finansial aman, dan pengarsipan nota garansi belanja.",
        to: "/surety?tab=cat_proteksi",
        icon: Lock,
        subFeatures: [
          { title: "Dokumen Aset", to: "/surety?tab=cat_proteksi&sub=vault", icon: ShieldCheck },
          { title: "Passwords", to: "/surety?tab=cat_proteksi&sub=passwords", icon: Key },
          { title: "Garansi & Bukti Nota", to: "/surety?tab=cat_proteksi", icon: ShieldCheck },
        ],
      },
    ],
  },
  {
    step: 2,
    id: "flow",
    name: "Flow",
    subtitle: "Agresi dan Agilitas Kas",
    to: "/flow",
    icon: Coins,
    themeColor: "emerald",
    accentClass: "text-emerald-600 dark:text-emerald-400",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/50",
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    gradientBg: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    description:
      "Sirkulasi modal dan arus kas adaptif yang memastikan kemampuan finansial aktual dalam memenuhi kebutuhan dan kewajiban berkala tanpa mengorbankan likuiditas dan stabilitas jangka panjang.",
    principles: [
      { num: 1, text: "Prasyarat operasional yang memastikan aset dan pendapatan dapat terus bersirkulasi secara berkelanjutan." },
      { num: 2, text: "Arus kas bersih yang menunjukkan kemampuan finansial aktual dalam memenuhi kebutuhan dan kewajiban secara berkala." },
      { num: 3, text: "Indikator efisiensi penggunaan modal dalam menjaga likuiditas tanpa mengorbankan stabilitas jangka panjang." },
      { num: 4, text: "Dinamika pergerakan dana yang mencerminkan aktivitas ekonomi dan kelangsungan sistem finansial." },
      { num: 5, text: "Sirkulasi nilai ekonomi yang memungkinkan sistem finansial tetap adaptif, hidup, dan berfungsi secara optimal." },
    ],
    features: [
      {
        id: "beban-liabilitas",
        title: "Burden Liability",
        subtitle: "Pengawasan kewajiban finansial jangka pendek dan panjang, pemetaan rasio utang, serta cicilan bulanan.",
        to: "/flow?tab=cat_liabilitas",
        icon: CreditCard,
        subFeatures: [
          { title: "Kuadran Liabilitas", to: "/liability", icon: CreditCard },
        ],
      },
      {
        id: "pemasukan-pengeluaran",
        title: "Income-Expense",
        subtitle: "Monitoring komprehensif aliran pendapatan aktif/pasif serta tracking kuadran pengeluaran primer dan sekunder.",
        to: "/flow?tab=cat_pengeluaran",
        icon: ArrowRightLeft,
        subFeatures: [
          { title: "Kuadran Pendapatan", to: "/earning", icon: DollarSign },
          { title: "Kuadran Pengeluaran", to: "/expense", icon: ShoppingCart },
        ],
      },
      {
        id: "kas-kredit",
        title: "Cash-Credit",
        subtitle: "Pengelolaan saldo kas harian, transaksi multi-wallet, serta kontrol limit kartu kredit dan pinjaman lunak.",
        to: "/flow?tab=cat_kredit",
        icon: Banknote,
        subFeatures: [
          { title: "Buku Arus Kas", to: "/flow?tab=cat_arus_kas", icon: Banknote },
          { title: "Kredit & Utang", to: "/kredit", icon: CreditCard },
        ],
      },
      {
        id: "retribusi-kontribusi",
        title: "Retribution-Contribution",
        subtitle: "Perhitungan estimasi pajak penghasilan pribadi (PPh 21 progresif), PTKP, dan kepatuhan kontribusi pajak resmi.",
        to: "/flow?tab=cat_pajak",
        icon: Receipt,
        subFeatures: [
          { title: "Pajak Personal (PPh 21)", to: "/pajak?app=pph21", icon: Calculator },
        ],
      },
      {
        id: "sistem-otomatisasi",
        title: "Automation System",
        subtitle: "Otomasi sistem alokasi anggaran bulanan dengan formula persentase 50/30/20 dan autodebet investasi rutin.",
        to: "/flow?tab=cat_otomatisasi",
        icon: Activity,
        subFeatures: [
          { title: "Budgeting System", to: "/budget", icon: Wallet },
        ],
      },
    ],
  },
  {
    step: 3,
    id: "build",
    name: "Build",
    subtitle: "Fondasi dan Modal Fundamental",
    to: "/build",
    icon: Building,
    themeColor: "amber",
    accentClass: "text-amber-600 dark:text-amber-400",
    borderClass: "border-amber-500/30 hover:border-amber-500/50",
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    gradientBg: "from-amber-500/15 via-amber-500/5 to-transparent",
    description:
      "Proses konstruksi dan akumulasi aset bertahap di mana arus kas dikonversi menjadi aset bernilai jangka panjang yang kokoh sebelum memasuki fase pertumbuhan dan ekspansi agresif.",
    principles: [
      { num: 1, text: "Proses akumulasi aset secara bertahap untuk membangun fondasi kekayaan yang stabil." },
      { num: 2, text: "Basis kekayaan yang menjadi penopang utama bagi ekspansi dan keberlanjutan nilai ekonomi." },
      { num: 3, text: "Tahap konstruksi modal di mana arus kas dikonversi menjadi aset bernilai jangka panjang." },
      { num: 4, text: "Struktur konsolidasi finansial yang memperkuat posisi ekonomi sebelum memasuki fase pertumbuhan agresif." },
      { num: 5, text: "Fase pembentukan sistem aset yang dirancang untuk mendukung pertumbuhan dan ketahanan jangka panjang." },
    ],
    features: [
      {
        id: "modal-manusia",
        title: "Human Capital",
        subtitle: "Valuasi kapasitas nilai keahlian diri, daya ungkit karier profesional, dan estimasi nilai kapital manusia.",
        to: "/build?tab=cat_modal",
        icon: Brain,
      },
      {
        id: "jaringan",
        title: "Net-Work",
        subtitle: "Pusat relasi kemitraan bisnis penghasil omset dan direktori kontak spesialis keuangan, banker, serta akuntan.",
        to: "/build?tab=cat_jaringan",
        icon: Network,
        subFeatures: [
          { title: "Klien & Partner", to: "/build?tab=cat_jaringan&sub=klien", icon: Briefcase },
          { title: "People Manager", to: "/build?tab=cat_jaringan&sub=people", icon: Users },
        ],
      },
      {
        id: "portofolio",
        title: "Portfolio",
        subtitle: "Manajemen kepemilikan multi-aset: properti real estate, surat berharga saham/sukuk, aset digital, dan HKI.",
        to: "/build?tab=cat_portofolio",
        icon: Briefcase,
        subFeatures: [
          { title: "Real Estate", to: "/real-estate", icon: Home },
          { title: "Paper Securities", to: "/paper-securities", icon: ScrollText },
          { title: "Digital Assets", to: "/digital-assets", icon: Binary },
          { title: "Intellectual Property", to: "/intellectual-property", icon: Lightbulb },
        ],
      },
      {
        id: "kekayaan-bersih",
        title: "Net-Worth",
        subtitle: "Perhitungan kalkulasi total net worth bersih dari seluruh kelas aset serta asesmen rasio kesehatan keuangan.",
        to: "/build?tab=cat_kekayaan",
        icon: Landmark,
        subFeatures: [
          { title: "Kuadran Aset", to: "/asset", icon: Briefcase },
          { title: "Kesehatan Finansial", to: "/financial-health", icon: HeartPulse },
        ],
      },
      {
        id: "pembukuan",
        title: "Book Entry",
        subtitle: "Sistem pembukuan neraca saldo aset personal, jurnal penyesuaian arus transaksi, dan pencatatan buku besar.",
        to: "/build?tab=cat_pembukuan",
        icon: BookOpen,
      },
    ],
  },
  {
    step: 4,
    id: "grow",
    name: "Grow",
    subtitle: "Akselerasi dan Skalabilitas Aset",
    to: "/grow",
    icon: Sprout,
    themeColor: "teal",
    accentClass: "text-teal-600 dark:text-teal-400",
    borderClass: "border-teal-500/30 hover:border-teal-500/50",
    badgeBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25",
    gradientBg: "from-teal-500/15 via-teal-500/5 to-transparent",
    description:
      "Strategi akselerasi melalui alokasi sektor produktif, efek berlipat bunga majemuk (compounding), dan penyesuaian berkala agar return melampaui inflasi secara terukur dan berkelanjutan.",
    principles: [
      { num: 1, text: "Proses menentukan batas kenyamanan dan kapasitas finansial dalam merespons dinamika pasar, memastikan strategi pertumbuhan yang dipilih tetap terukur dan berkelanjutan." },
      { num: 2, text: "Metode pendistribusian modal ke berbagai sektor produktif untuk mengoptimalkan potensi apresiasi nilai aset secara keseluruhan." },
      { num: 3, text: "Prinsip pengelolaan dana yang mengutamakan akurasi hasil dan efisiensi proses agar nilai kekayaan dapat melampaui inflasi." },
      { num: 4, text: "Mekanisme pertumbuhan nilai di mana keuntungan yang dihasilkan diinvestasikan kembali untuk menciptakan efek berlipat pada kekayaan dari waktu ke waktu." },
      { num: 5, text: "Tindakan meninjau dan menyesuaikan strategi secara berkala untuk memastikan seluruh instrumen tetap berjalan sesuai tujuan jangka panjang." },
    ],
    features: [
      {
        id: "profil-risiko",
        title: "Risk Profiling",
        subtitle: "Diagnostik toleransi risiko investor (konservatif, moderat, agresif) serta horizon waktu pencapaian target modal.",
        to: "/grow?tab=cat_profil",
        icon: Activity,
      },
      {
        id: "alokasi",
        title: "Allocation",
        subtitle: "Strategi alokasi aset syariah melalui pasar muamalah fisik, indeks saham sharia, dan 100 komoditas riil dunia.",
        to: "/grow?tab=cat_alokasi",
        icon: PieChart,
        subFeatures: [
          { title: "Logam Mulia & Saham", to: "/100-komoditas", icon: Coins },
          { title: "Market Price Monitor", to: "/100-komoditas", icon: Package },
        ],
      },
      {
        id: "efektif-efisien",
        title: "Effective-Efficient",
        subtitle: "Pengurangan friction fee transaksi, rasio efisiensi pengelolaan instrumen, dan maksimalisasi net yield return.",
        to: "/grow?tab=cat_efektif",
        icon: Zap,
      },
      {
        id: "bunga-berbunga",
        title: "Compounding",
        subtitle: "Simulasi kekuatan bunga majemuk (compounding interest) dan kalkulator Return on Investment (ROI) berkala.",
        to: "/grow?tab=cat_bunga",
        icon: TrendingUp,
        subFeatures: [
          { title: "Bunga Majemuk & ROI", to: "/investasi?app=bunga-majemuk", icon: Calculator },
        ],
      },
      {
        id: "rebalancing-periodik",
        title: "Periodic Rebalancing",
        subtitle: "Penyesuaian periodik deviasi alokasi aset investasi agar tetap berada pada batas toleransi risiko yang optimal.",
        to: "/grow?tab=cat_rebalance",
        icon: RefreshCw,
      },
    ],
  },
  {
    step: 5,
    id: "legacy",
    name: "Legacy",
    subtitle: "Transmisi dan Tata Kelola Nilai",
    to: "/legacy",
    icon: BookOpen,
    themeColor: "rose",
    accentClass: "text-rose-600 dark:text-rose-400",
    borderClass: "border-rose-500/30 hover:border-rose-500/50",
    badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
    gradientBg: "from-rose-500/15 via-rose-500/5 to-transparent",
    description:
      "Manifestasi tertinggi sistem finansial melalui tata kelola hukum aset keluarga, transmisi nilai antargenerasi, filantropi terstruktur, dan suksesi bebas sengketa yang lestari.",
    principles: [
      { num: 1, text: "Jejak panjang dari seluruh keputusan finansial yang membentuk makna dan tujuan dari kekayaan." },
      { num: 2, text: "Struktur hukum dan institusional yang memastikan manfaat ekonomi tetap terjaga sepanjang waktu." },
      { num: 3, text: "Dimensi keberlanjutan finansial yang melampaui batas hidup seorang individu atau entitas." },
      { num: 4, text: "Sistem transmisi kekayaan yang menjaga kesinambungan nilai antar generasi." },
      { num: 5, text: "Manifestasi tertinggi dari sebuah sistem finansial yang terintegrasi, stabil, dan berkelanjutan." },
    ],
    features: [
      {
        id: "pembelajaran-seumur-hidup",
        title: "Lifelong Learning",
        subtitle: "Edukasi filosofi kekayaan keluarga, kurikulum literasi finansial antargenerasi, dan transfer nilai-nilai bijak.",
        to: "/legacy?tab=cat_pembelajaran",
        icon: GraduationCap,
      },
      {
        id: "tata-kelola",
        title: "Good Governance",
        subtitle: "Tata kelola legalitas aset keluarga, struktur kepemilikan terstruktur, dan kepatuhan hukum antargenerasi.",
        to: "/legacy?tab=cat_tatakelola",
        icon: Building,
        subFeatures: [
          { title: "Good Governance", to: "/legacy?tab=cat_tatakelola", icon: Scale },
          { title: "Struktur Kepemilikan", to: "/legacy?tab=cat_tatakelola&sub=struktur", icon: Building },
        ],
      },
      {
        id: "kontribusi-amal",
        title: "Charitable Concern",
        subtitle: "Penyaluran zakat dan sedekah terstruktur, pelacak donasi infaq kemanusiaan, serta pencatatan relawan sosial.",
        to: "/legacy?tab=cat_amal",
        icon: HeartHandshake,
        subFeatures: [
          { title: "Zakat & Sedekah", to: "/legacy?tab=cat_amal&sub=zakat", icon: Coins },
          { title: "Infaq & Donasi", to: "/lainnya?app=donation-tracker", icon: Coins },
          { title: "Relawan Sosial", to: "/lainnya?app=volunteer-log", icon: Heart },
        ],
      },
      {
        id: "likuidasi-kewajiban",
        title: "Liability Liquidation",
        subtitle: "Prosedur penutupan dan pelunasan seluruh sisa kewajiban hutang piutang sebelum transisi pembagian warisan aset.",
        to: "/legacy?tab=cat_likuidasi",
        icon: ReceiptText,
        subFeatures: [
          { title: "Kredit & Utang", to: "/kredit", icon: CreditCard },
        ],
      },
      {
        id: "transfer-kekayaan",
        title: "Wealth Transfer",
        subtitle: "Perencanaan suksesi peralihan portofolio aset, pembagian hak waris, dan pemindahan hak milik bebas sengketa.",
        to: "/legacy?tab=cat_transfer",
        icon: Gift,
        subFeatures: [
          { title: "Portfolio Aset", to: "/build?tab=cat_portofolio", icon: Briefcase },
        ],
      },
    ],
  },
];

export const SHARIA_MAIN_BOXES = [
  {
    id: "akad-muamalah",
    title: "11 Akad Muamalah Syariah",
    subtitle: "Rukun & Fatwa DSN-MUI: Kemitraan, Jual Beli, Penjaminan & Sewa",
    icon: Handshake,
    badgeBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/50",
    gradientBg: "from-emerald-500/15 via-emerald-500/5 to-transparent",
    description:
      "Arsitektur akad transaksi syariah berlandaskan keadilan, transparansi harga pokok, penjaminan kebajikan bersama (ta'min/takaful), serta bagi hasil usaha produktif.",
    features: [
      { title: "Mudharabah", subtitle: "Bagi hasil modal & keahlian usaha", to: "/syariah/akad?app=mudharabah", icon: Handshake },
      { title: "Musyarakah", subtitle: "Kemitraan penyertaan porsi modal bersama", to: "/syariah/akad?app=musyarakah", icon: Users },
      { title: "Murabahah", subtitle: "Jual beli transparan margin keuntungan", to: "/syariah/akad?app=murabahah", icon: Tag },
      { title: "Ta'min & Tabarru", subtitle: "Proteksi mutual kebajikan bersama", to: "/syariah/akad?app=tamin", icon: Shield },
      { title: "Takaful", subtitle: "Asuransi gotong royong risiko kolektif", to: "/syariah/akad?app=takaful", icon: Users },
      { title: "Ijarah", subtitle: "Sewa manfaat aset & skema IMBT", to: "/syariah/akad?app=ijarah", icon: Building },
      { title: "Qardh al-Hasan", subtitle: "Pinjaman kebajikan 0% riba & denda", to: "/syariah/akad?app=qardh", icon: Coins },
    ],
  },
  {
    id: "zakat-filantropi",
    title: "4 Modul Zakat & Filantropi",
    subtitle: "Pensucian Harta & Distribusi Kesejahteraan 8 Asnaf Mustahik",
    icon: HeartHandshake,
    badgeBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25",
    borderClass: "border-amber-500/30 hover:border-amber-500/50",
    gradientBg: "from-amber-500/15 via-amber-500/5 to-transparent",
    description:
      "Penghitungan presisi kewajiban zakat profesi bulanan, zakat simpanan emas dan tabungan haul 1 tahun, zakat fitrah jiwa, serta portal integrasi infaq sedekah.",
    features: [
      { title: "Zakat Penghasilan", subtitle: "Kalkulator 2.5% gaji, bonus & profesi", to: "/zakat?app=penghasilan", icon: Briefcase },
      { title: "Zakat Maal", subtitle: "Zakat tabungan, deposito & emas haul 1 th", to: "/zakat?app=maal", icon: Coins },
      { title: "Zakat Fitrah", subtitle: "Pensucian jiwa Ramadan per anggota keluarga", to: "/zakat?app=fitrah", icon: Users },
      { title: "Zakat & Sedekah Hub", subtitle: "Pusat penunaian & distribusi 8 asnaf", to: "/zakat", icon: HeartHandshake },
    ],
  },
  {
    id: "audit-terlarang",
    title: "3 Audit Syariah Anti-Terlarang",
    subtitle: "Diagnosis Pembebasan Transaksi dari Riba, Gharar & Maysir",
    icon: ShieldAlert,
    badgeBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25",
    borderClass: "border-rose-500/30 hover:border-rose-500/50",
    gradientBg: "from-rose-500/15 via-rose-500/5 to-transparent",
    description:
      "Sistem verifikasi kepatuhan syariah untuk mendeteksi potensi riba pada akad utang dan bunga perbankan, klausul ketidakpastian objek gharar, serta spekulasi judi maysir.",
    features: [
      { title: "Audit Riba", subtitle: "Diagnosis bebas bunga, denda & riba", to: "/syariah/terlarang?app=riba", icon: AlertOctagon },
      { title: "Audit Gharar", subtitle: "Kepastian objek transaksi & spesifikasi harga", to: "/syariah/terlarang?app=gharar", icon: ShieldAlert },
      { title: "Audit Maysir", subtitle: "Evaluasi spekulasi vs investasi riil", to: "/syariah/terlarang?app=maysir", icon: Dice5 },
    ],
  },
];

const StageMainBox = ({
  stage,
  isFav,
  toggleFavorite,
}: {
  stage: WealthStageMainBoxDef;
  isFav: boolean;
  toggleFavorite: (to: string) => void;
}) => {
  const [showPrinciples, setShowPrinciples] = useState(false);
  const Icon = stage.icon;

  return (
    <div
      className={`w-full rounded-3xl border ${stage.borderClass} bg-card/90 backdrop-blur-xs shadow-xs hover:shadow-md transition-all p-5 sm:p-7 flex flex-col justify-between gap-5 relative overflow-hidden group`}
    >
      {/* Decorative gradient top accent line */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stage.gradientBg}`} />

      {/* 1. Header Kotak Utama */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div
              className={`size-12 sm:size-14 rounded-2xl flex items-center justify-center shrink-0 border ${stage.badgeBg} shadow-xs group-hover:scale-105 transition-transform`}
            >
              <Icon className="size-6 sm:size-7 drop-shadow-xs" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full border ${stage.badgeBg}`}>
                  Tahap #{stage.step}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  Reg. DJKI No. 001085192
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-1">
                Tahap {stage.step}: {stage.name}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground italic">
                {stage.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => toggleFavorite(stage.to)}
              className={`p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                isFav
                  ? "border-amber-400/50 bg-amber-400/10 text-amber-400 shadow-xs"
                  : "border-border/60 hover:border-amber-400/30 hover:bg-muted/60 text-muted-foreground hover:text-amber-400"
              }`}
              title={isFav ? "Hapus dari Favorit Dock" : "Tambah Tahap ke Favorit Dock"}
            >
              <Star className={`size-4 ${isFav ? "fill-amber-400 text-amber-400 scale-110" : ""}`} />
            </button>

            <Link
              to={stage.to}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border ${stage.badgeBg} hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer`}
            >
              <span>Buka Modul {stage.name}</span>
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        {/* 2. Deskripsi di dalam kotak */}
        <div className="mt-4 bg-muted/40 rounded-2xl p-4 border border-border/50">
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
            {stage.description}
          </p>

          <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowPrinciples((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
            >
              <span>{showPrinciples ? "Sembunyikan 5 Prinsip Fondasi" : "Lihat 5 Prinsip Fondasi"}</span>
              {showPrinciples ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
            </button>
            <span className="text-[11px] text-muted-foreground font-mono">
              5 Prinsip ({stage.name} 1 — 5)
            </span>
          </div>

          {showPrinciples && (
            <div className="mt-3 pt-2.5 border-t border-border/40 space-y-2 animate-in fade-in-50 duration-200">
              {stage.principles.map((p) => (
                <div key={p.num} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                  <span className="size-4 rounded-full bg-primary/15 text-primary text-[10px] font-bold font-mono flex items-center justify-center shrink-0 mt-0.5">
                    {p.num}
                  </span>
                  <span className="text-foreground/80 leading-relaxed">
                    {p.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Masing-masing 5 Fitur di dalam kotak */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span>5 Fitur Terintegrasi {stage.name}</span>
            </h4>
            <span className="text-[11px] text-muted-foreground">
              Klik langsung untuk akses fitur
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {stage.features.map((feat, idx) => {
              const FeatIcon = feat.icon;
              const featPath = feat.to.split("?")[0];
              const featSearch = feat.to.includes("?")
                ? Object.fromEntries(new URLSearchParams(feat.to.split("?")[1]))
                : undefined;

              return (
                <div
                  key={feat.id}
                  className="rounded-2xl border border-border/70 bg-card p-3.5 hover:border-primary/50 hover:shadow-xs transition-all flex flex-col justify-between group/fcard"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="size-5 rounded-md bg-muted text-[10px] font-bold font-mono flex items-center justify-center text-muted-foreground group-hover/fcard:text-primary group-hover/fcard:bg-primary/10 transition-colors">
                          {idx + 1}
                        </span>
                        <div className="p-1 rounded-lg bg-primary/10 text-primary">
                          <FeatIcon className="size-3.5" />
                        </div>
                      </div>
                      <Link
                        to={featPath}
                        search={featSearch as any}
                        className="text-muted-foreground hover:text-primary p-0.5 transition-colors"
                        title={`Buka ${feat.title}`}
                      >
                        <ArrowRight className="size-3.5 opacity-60 group-hover/fcard:opacity-100 group-hover/fcard:translate-x-0.5 transition-all" />
                      </Link>
                    </div>

                    <Link
                      to={featPath}
                      search={featSearch as any}
                      className="block font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {feat.title}
                    </Link>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {feat.subtitle}
                    </p>
                  </div>

                  {/* Sub-feature chips */}
                  {feat.subFeatures && feat.subFeatures.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-border/50 flex flex-wrap gap-1">
                      {feat.subFeatures.map((sub, sidx) => {
                        const SubIcon = sub.icon;
                        const subPath = sub.to.split("?")[0];
                        const subSearch = sub.to.includes("?")
                          ? Object.fromEntries(new URLSearchParams(sub.to.split("?")[1]))
                          : undefined;

                        return (
                          <Link
                            key={sidx}
                            to={subPath}
                            search={subSearch as any}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/60 hover:bg-primary/10 hover:text-primary text-[10px] font-medium text-muted-foreground transition-colors border border-border/40"
                          >
                            <SubIcon className="size-2.5 text-primary shrink-0" />
                            <span className="truncate max-w-[90px]">{sub.title}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const ShariaMainBox = ({
  box,
}: {
  box: (typeof SHARIA_MAIN_BOXES)[0];
}) => {
  const Icon = box.icon;

  return (
    <div
      className={`w-full rounded-3xl border ${box.borderClass} bg-card/90 backdrop-blur-xs shadow-xs hover:shadow-md transition-all p-5 sm:p-7 flex flex-col justify-between gap-5 relative overflow-hidden group`}
    >
      <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${box.gradientBg}`} />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3.5">
            <div
              className={`size-12 sm:size-14 rounded-2xl flex items-center justify-center shrink-0 border ${box.badgeBg} shadow-xs group-hover:scale-105 transition-transform`}
            >
              <Icon className="size-6 sm:size-7 drop-shadow-xs" />
            </div>
            <div>
              <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full border ${box.badgeBg}`}>
                Sharia Principles
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight mt-1">
                {box.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground italic">
                {box.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-muted/40 rounded-2xl p-4 border border-border/50">
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-normal">
            {box.description}
          </p>
        </div>

        <div className="mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {box.features.map((feat, idx) => {
              const FeatIcon = feat.icon;
              const featPath = feat.to.split("?")[0];
              const featSearch = feat.to.includes("?")
                ? Object.fromEntries(new URLSearchParams(feat.to.split("?")[1]))
                : undefined;

              return (
                <Link
                  key={idx}
                  to={featPath}
                  search={featSearch as any}
                  className="rounded-2xl border border-border/70 bg-card p-3.5 hover:border-primary/50 hover:shadow-xs transition-all flex flex-col justify-between group/scard"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                        <FeatIcon className="size-4" />
                      </div>
                      <ArrowRight className="size-3.5 text-muted-foreground opacity-60 group-hover/scard:opacity-100 group-hover/scard:text-primary transition-all" />
                    </div>
                    <h5 className="font-bold text-xs sm:text-sm text-foreground group-hover/scard:text-primary transition-colors">
                      {feat.title}
                    </h5>
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                      {feat.subtitle}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


export const WEALTH_STAGE_PRINCIPLES_I18N: Record<
  string,
  Record<
    Language,
    {
      subtitle: string;
      description: string;
      principles: { num: number; text: string }[];
    }
  >
> = {
  surety: {
    id: {
      subtitle: "Mitigasi dan Kepastian Risiko",
      description: "Fondasi keamanan ekonomi dan instrumen penjamin terhadap risiko kegagalan, melindungi aset dan aliran nilai dari peristiwa tak terduga serta memastikan stabilitas finansial berkelanjutan sebelum proses ekspansi nilai dimulai.",
      principles: [
        { num: 1, text: "Instrumen hukum dan institusional yang berfungsi sebagai penjamin terhadap risiko kegagalan atau kelalaian finansial." },
        { num: 2, text: "Lapisan ketahanan sistemik yang melindungi aset dan aliran nilai dari peristiwa tak terduga serta gangguan struktural." },
        { num: 3, text: "Syarat minimum stabilitas finansial yang harus terpenuhi sebelum proses pertumbuhan dan ekspansi nilai dimulai." },
        { num: 4, text: "Prinsip dasar perlindungan dalam sistem keuangan yang memastikan terpenuhinya kewajiban dan terjaganya stabilitas nilai ekonomi." },
        { num: 5, text: "Fondasi keamanan ekonomi yang memungkinkan perencanaan, akumulasi, dan pengembangan kekayaan secara berkelanjutan." },
      ],
    },
    en: {
      subtitle: "Risk Mitigation & Certainty",
      description: "Economic security foundation and institutional guarantee against default, safeguarding assets and value streams from unexpected shocks while ensuring sustainable stability before value expansion begins.",
      principles: [
        { num: 1, text: "Legal and institutional instruments that act as guarantors against the risk of financial default or negligence." },
        { num: 2, text: "Systemic resilience layers that shield assets and value streams from unforeseen events and structural disruptions." },
        { num: 3, text: "Minimum financial stability prerequisites that must be satisfied before growth and value expansion begin." },
        { num: 4, text: "Foundational protection principles within the financial system ensuring fulfillment of obligations and preservation of economic value." },
        { num: 5, text: "Economic security foundations empowering disciplined, long-term wealth planning, accumulation, and stewardship." },
      ],
    },
    ms: {
      subtitle: "Mitigasi dan Kepastian Risiko",
      description: "Asas keselamatan ekonomi dan instrumen penjamin terhadap risiko kegagalan, melindungi aset dan aliran nilai daripada peristiwa tidak diduga serta memastikan kestabilan kewangan mampan sebelum proses pengembangan bermula.",
      principles: [
        { num: 1, text: "Instrumen undang-undang dan institusi yang berfungsi sebagai penjamin terhadap risiko kegagalan atau kecuaian kewangan." },
        { num: 2, text: "Lapisan ketahanan sistemik yang melindungi aset dan aliran nilai daripada peristiwa tidak diduga serta gangguan struktur." },
        { num: 3, text: "Syarat minimum kestabilan kewangan yang mesti dipenuhi sebelum proses pertumbuhan dan pengembangan nilai bermula." },
        { num: 4, text: "Prinsip asas perlindungan dalam sistem kewangan yang memastikan kewajipan dipenuhi dan kestabilan nilai ekonomi terpelihara." },
        { num: 5, text: "Asas keselamatan ekonomi yang membolehkan perancangan, pengumpulan, dan pembangunan kekayaan secara mampan." },
      ],
    },
    zh: {
      subtitle: "风险缓释与确定性",
      description: "经济安全基石与防范违约的制度保障，保护资产与资金流免受意外冲击，并在开启价值扩张前确立长效稳固的财务基本盘。",
      principles: [
        { num: 1, text: "作为防范财务违约或过失风险担保的法律与制度工具。" },
        { num: 2, text: "保护资产与价值流免受意外事件与结构性扰动影响的系统性韧性防御层。" },
        { num: 3, text: "在启动增长与财富价值规模扩张之前必须满足的最低财务稳定性前提。" },
        { num: 4, text: "金融体系中确保契约义务兑现并维持经济价值稳定的基础保护原则。" },
        { num: 5, text: "支持持续开展长期财富规划、资产积累与稳健增值的经济安全基石。" },
      ],
    },
  },
  flow: {
    id: {
      subtitle: "Agresi dan Agilitas Kas",
      description: "Sirkulasi modal dan arus kas adaptif yang memastikan kemampuan finansial aktual dalam memenuhi kebutuhan dan kewajiban berkala tanpa mengorbankan likuiditas dan stabilitas jangka panjang.",
      principles: [
        { num: 1, text: "Prasyarat operasional yang memastikan aset dan pendapatan dapat terus bersirkulasi secara berkelanjutan." },
        { num: 2, text: "Arus kas bersih yang menunjukkan kemampuan finansial aktual dalam memenuhi kebutuhan dan kewajiban secara berkala." },
        { num: 3, text: "Indikator efisiensi penggunaan modal dalam menjaga likuiditas tanpa mengorbankan stabilitas jangka panjang." },
        { num: 4, text: "Dinamika pergerakan dana yang mencerminkan aktivitas ekonomi dan kelangsungan sistem finansial." },
        { num: 5, text: "Sirkulasi nilai ekonomi yang memungkinkan sistem finansial tetap adaptif, hidup, dan berfungsi secara optimal." },
      ],
    },
    en: {
      subtitle: "Cash Flow & Capital Agility",
      description: "Adaptive capital circulation and cash velocity ensuring actual financial capability to fulfill recurring obligations without compromising liquidity and long-term stability.",
      principles: [
        { num: 1, text: "Operational prerequisites ensuring assets and income continue to circulate sustainably." },
        { num: 2, text: "Net cash flows reflecting actual financial capacity to meet routine needs and recurring obligations." },
        { num: 3, text: "Indicators of capital efficiency in maintaining liquidity without sacrificing long-term stability." },
        { num: 4, text: "Cash dynamics reflecting active economic participation and the continuity of the financial framework." },
        { num: 5, text: "Economic value circulation empowering the financial architecture to stay adaptive, vital, and functionally optimal." },
      ],
    },
    ms: {
      subtitle: "Aliran Tunai & Agiliti Modal",
      description: "Peredaran modal dan aliran tunai adaptif yang memastikan keupayaan kewangan sebenar dalam memenuhi keperluan dan komitmen berkala tanpa menjejaskan kecairan jangka panjang.",
      principles: [
        { num: 1, text: "Prasyarat operasi yang memastikan aset dan pendapatan dapat terus beredar secara mampan." },
        { num: 2, text: "Aliran tunai bersih yang menunjukkan keupayaan kewangan sebenar dalam memenuhi keperluan dan kewajipan berkala." },
        { num: 3, text: "Penunjuk kecekapan penggunaan modal dalam mengekalkan kecairan tanpa menjejaskan kestabilan jangka panjang." },
        { num: 4, text: "Dinamik pergerakan dana yang mencerminkan aktiviti ekonomi dan kelangsungan sistem kewangan." },
        { num: 5, text: "Peredaran nilai ekonomi yang membolehkan sistem kewangan kekal adaptif, hidup, dan berfungsi secara optimum." },
      ],
    },
    zh: {
      subtitle: "现金流与资本敏捷性",
      description: "自适应的资本周转与现金流转体系，确保在不牺牲流动性与长期稳健的前提下，持续具备兑现日常需求与定期债务的实际财务能力。",
      principles: [
        { num: 1, text: "确保资产与日常收入能够持续稳步循环周转的运营前提条件。" },
        { num: 2, text: "真实反映按期兑现各项生活需求与法定财务承诺能力的净现金流。" },
        { num: 3, text: "在不牺牲长期稳健前提下平衡即时流动性与资金利用率的资本效率指标。" },
        { num: 4, text: "反映真实经济活动活力与金融架构健康持续性的资金流动态势。" },
        { num: 5, text: "让整体财务体系保持高度灵活性、旺盛生命力与最优运转效能的价值循环机制。" },
      ],
    },
  },
  build: {
    id: {
      subtitle: "Fondasi dan Modal Fundamental",
      description: "Proses konstruksi dan akumulasi aset bertahap di mana arus kas dikonversi menjadi aset bernilai jangka panjang yang kokoh sebelum memasuki fase pertumbuhan dan ekspansi agresif.",
      principles: [
        { num: 1, text: "Proses akumulasi aset secara bertahap untuk membangun fondasi kekayaan yang stabil." },
        { num: 2, text: "Basis kekayaan yang menjadi penopang utama bagi ekspansi dan keberlanjutan nilai ekonomi." },
        { num: 3, text: "Tahap konstruksi modal di mana arus kas dikonversi menjadi aset bernilai jangka panjang." },
        { num: 4, text: "Struktur konsolidasi finansial yang memperkuat posisi ekonomi sebelum memasuki fase pertumbuhan agresif." },
        { num: 5, text: "Fase pembentukan sistem aset yang dirancang untuk mendukung pertumbuhan dan ketahanan jangka panjang." },
      ],
    },
    en: {
      subtitle: "Foundation & Fundamental Capital",
      description: "Disciplined capital construction and asset accumulation converting free cash flow into enduring valuable property before entering aggressive growth and market scaling.",
      principles: [
        { num: 1, text: "Gradual asset accumulation process to establish a resilient and stable wealth foundation." },
        { num: 2, text: "Wealth base serving as the foundational pillar for economic expansion and long-term value sustainability." },
        { num: 3, text: "Capital construction stage where cash flows are converted into enduring valuable long-term assets." },
        { num: 4, text: "Financial consolidation structure reinforcing economic standing prior to entering aggressive growth phases." },
        { num: 5, text: "Asset system development phase engineered to bolster ongoing growth and systemic long-term resilience." },
      ],
    },
    ms: {
      subtitle: "Asas dan Modal Fundamental",
      description: "Proses pembinaan dan pengumpulan aset berperingkat di mana aliran tunai ditukarkan kepada aset bernilai jangka panjang sebelum memasuki fasa pertumbuhan agresif.",
      principles: [
        { num: 1, text: "Proses pengumpulan aset secara berperingkat untuk membina asas kekayaan yang stabil." },
        { num: 2, text: "Asas kekayaan yang menjadi tonggak utama bagi pengembangan dan kemampanan nilai ekonomi." },
        { num: 3, text: "Tahap pembinaan modal di mana aliran tunai ditukarkan kepada aset bernilai jangka panjang." },
        { num: 4, text: "Struktur penyatuan kewangan yang memperkukuh kedudukan ekonomi sebelum melangkah ke fasa pertumbuhan agresif." },
        { num: 5, text: "Fase pembentukan sistem aset yang direka untuk menyokong pertumbuhan dan daya tahan jangka panjang." },
      ],
    },
    zh: {
      subtitle: "财富基石与基础资本",
      description: "扎实的资本构建与循序渐进的资产积累过程，在步入激进增长与规模扩张之前，将自由现金流转化为稳固持久的生产性长期资产。",
      principles: [
        { num: 1, text: "通过循序渐进的资产积累构建稳固持久财富底座的发展过程。" },
        { num: 2, text: "作为支撑未来经济扩张与长期价值延续核心支柱的底层财富基石。" },
        { num: 3, text: "将日常经营现金流稳健转化为具有长期保值增值属性资产的资本构建阶段。" },
        { num: 4, text: "在步入激进增长周期之前全面巩固资产负债表与抗风险能力的财务整合架构。" },
        { num: 5, text: "专门为支撑跨周期长期可持续增长与抵御市场波动而设计的资产体系构建阶段。" },
      ],
    },
  },
  grow: {
    id: {
      subtitle: "Akselerasi dan Skalabilitas Aset",
      description: "Strategi akselerasi melalui alokasi sektor produktif, efek berlipat bunga majemuk (compounding), dan penyesuaian berkala agar return melampaui inflasi secara terukur dan berkelanjutan.",
      principles: [
        { num: 1, text: "Proses menentukan batas kenyamanan dan kapasitas finansial dalam merespons dinamika pasar, memastikan strategi pertumbuhan yang dipilih tetap terukur dan berkelanjutan." },
        { num: 2, text: "Metode pendistribusian modal ke berbagai sektor produktif untuk mengoptimalkan potensi apresiasi nilai aset secara keseluruhan." },
        { num: 3, text: "Prinsip pengelolaan dana yang mengutamakan akurasi hasil dan efisiensi proses agar nilai kekayaan dapat melampaui inflasi." },
        { num: 4, text: "Mekanisme pertumbuhan nilai di mana keuntungan yang dihasilkan diinvestasikan kembali untuk menciptakan efek berlipat pada kekayaan dari waktu ke waktu." },
        { num: 5, text: "Tindakan meninjau dan menyesuaikan strategi secara berkala untuk memastikan seluruh instrumen tetap berjalan sesuai tujuan jangka panjang." },
      ],
    },
    en: {
      subtitle: "Asset Acceleration & Scalability",
      description: "Acceleration strategies through productive sector allocations, compounding yield mechanisms, and periodic rebalancing to consistently outperform inflation safely.",
      principles: [
        { num: 1, text: "Process of defining risk comfort thresholds and financial capacity when responding to market dynamics, ensuring growth strategies remain measured and sustainable." },
        { num: 2, text: "Methods of allocating capital across productive sectors to optimize overall capital appreciation potential." },
        { num: 3, text: "Fund management principles prioritizing accurate outcomes and cost efficiency so wealth growth consistently outpaces inflation." },
        { num: 4, text: "Value multiplication mechanism where earned returns are reinvested to generate compounding wealth expansion over time." },
        { num: 5, text: "Periodic review and adjustment actions ensuring all financial instruments remain aligned with long-term strategic objectives." },
      ],
    },
    ms: {
      subtitle: "Pecutan dan Skalabiliti Aset",
      description: "Strategi pecutan melalui pengagihan sektor produktif, kesan faedah kompaun, dan pelarasan berkala supaya pulangan mengatasi inflasi secara mampan.",
      principles: [
        { num: 1, text: "Proses menentukan batas keselesaan dan kapasiti kewangan terhadap dinamik pasaran, memastikan strategi pertumbuhan kekal terukur dan mampan." },
        { num: 2, text: "Kaedah pengagihan modal ke pelbagai sektor produktif bagi mengoptimumkan potensi kenaikan nilai aset secara menyeluruh." },
        { num: 3, text: "Prinsip pengurusan dana yang mengutamakan ketepatan hasil dan kecekapan proses supaya nilai kekayaan mengatasi inflasi." },
        { num: 4, text: "Mekanisme pertumbuhan nilai di mana keuntungan yang dijana dilaburkan semula bagi mencipta kesan penggandaan kekayaan dari semasa ke semasa." },
        { num: 5, text: "Tindakan menyemak dan melaraskan strategi secara berkala untuk memastikan semua instrumen kekal selaras dengan matlamat jangka panjang." },
      ],
    },
    zh: {
      subtitle: "资产加速与规模化",
      description: "通过优质生产性板块配置、复利再投资机制与定期动态再平衡的加速增值策略，确保投资回报在可控风险下长期稳健战胜通胀。",
      principles: [
        { num: 1, text: "在应对市场波动时科学厘定心理舒适阈值与量化资金承受能力，确保所选增长策略始终可测、可控且可持续的过程。" },
        { num: 2, text: "将资本广泛配置于多元生产性实体产业与金融品类，以最大化挖掘全域资产综合升值潜力的方法。" },
        { num: 3, text: "坚持追求确定性收益成果与极低费率损耗摩擦，确保真实财富增幅持续稳健跑赢通胀的资金管理准则。" },
        { num: 4, text: "将已实现的投资收益持续滚存再投资、从而随时间推移释放指数级财富复利乘数效应的价值增值机制。" },
        { num: 5, text: "定期深度评估并动态调优资产配置策略，确保全套投资工具组合始终紧密贴合既定长期战略目标的管理举措。" },
      ],
    },
  },
  legacy: {
    id: {
      subtitle: "Transmisi dan Tata Kelola Nilai",
      description: "Manifestasi tertinggi sistem finansial melalui tata kelola hukum aset keluarga, transmisi nilai antargenerasi, filantropi terstruktur, dan suksesi bebas sengketa yang lestari.",
      principles: [
        { num: 1, text: "Jejak panjang dari seluruh keputusan finansial yang membentuk makna dan tujuan dari kekayaan." },
        { num: 2, text: "Struktur hukum dan institusional yang memastikan manfaat ekonomi tetap terjaga sepanjang waktu." },
        { num: 3, text: "Dimensi keberlanjutan finansial yang melampaui batas hidup seorang individu atau entitas." },
        { num: 4, text: "Sistem transmisi kekayaan yang menjaga kesinambungan nilai antar generasi." },
        { num: 5, text: "Manifestasi tertinggi dari sebuah sistem finansial yang terintegrasi, stabil, dan berkelanjutan." },
      ],
    },
    en: {
      subtitle: "Value Transmission & Governance",
      description: "The apex of wealth stewardship through family legal governance, intergenerational value transmission, structured philanthropy, and dispute-free perpetual succession.",
      principles: [
        { num: 1, text: "The enduring footprint of cumulative financial decisions shaping the deeper meaning and ultimate purpose of family wealth." },
        { num: 2, text: "Legal and institutional frameworks ensuring economic benefits and protections endure across time." },
        { num: 3, text: "Financial sustainability dimension that transcends the natural lifespan of any single individual or entity." },
        { num: 4, text: "Wealth transmission architecture safeguarding intergenerational continuity and preserving family core values." },
        { num: 5, text: "The apex manifestation of a comprehensively integrated, stable, and perpetual financial system." },
      ],
    },
    ms: {
      subtitle: "Penyampaian dan Tadbir Urus Nilai",
      description: "Manifestasi tertinggi sistem kewangan melalui tadbir urus undang-undang aset keluarga, pemindahan nilai antara generasi, dan pewarisan mampan.",
      principles: [
        { num: 1, text: "Jejak panjang daripada keseluruhan keputusan kewangan yang membentuk makna dan tujuan kekayaan." },
        { num: 2, text: "Struktur undang-undang dan institusi yang memastikan manfaat ekonomi kekal terpelihara sepanjang masa." },
        { num: 3, text: "Dimensi kemampanan kewangan yang menjangkaui batas hayat seorang individu atau entiti." },
        { num: 4, text: "Sistem pemindahan kekayaan yang memelihara kesinambungan nilai antara generasi." },
        { num: 5, text: "Manifestasi tertinggi bagi sebuah sistem kewangan yang bersepadu, stabil, dan berkekalan." },
      ],
    },
    zh: {
      subtitle: "价值传承与财富治理",
      description: "家族财富架构的至高形态：通过完善的法律信托架构、跨代精神与物质财富传承、结构化家族慈善及无争议永续接班体系。",
      principles: [
        { num: 1, text: "贯穿历代全部财务决策轨迹并深刻铸就财富精神内涵与终极使命的历史印记。" },
        { num: 2, text: "借助严谨法律信托与制度化治理结构确保核心经济利益与家族收益历久弥新的长效保障。" },
        { num: 3, text: "远远超越单一自然人或企业个体生命周期限制的超长周期财务可持续性维度。" },
        { num: 4, text: "在跨代传承过程中全方位保障精神文化底蕴、伦理价值与物质资产完整延续的财富交接体系。" },
        { num: 5, text: "高度整合、至臻稳固且代际永续的现代化金融与财富治理生态体系的至高形态。" },
      ],
    },
  },
};

interface CategorySectionViewProps {
  stage: WealthStageMainBoxDef;
  apps: StandaloneFinancialAppDef[];
  favorites: string[];
  toggleFavorite: (to: string) => void;
  getGradient?: (title: string) => string;
}

function CategorySectionView({
  stage,
  apps,
  favorites,
  toggleFavorite,
  getGradient,
}: CategorySectionViewProps) {
  const Icon = stage.icon;
  const lang = useLanguage();

  const stageI18n =
    WEALTH_STAGE_PRINCIPLES_I18N[stage.id]?.[lang] ||
    WEALTH_STAGE_PRINCIPLES_I18N[stage.id]?.id || {
      subtitle: stage.subtitle,
      principles: stage.principles,
    };

  const stagePrefix =
    lang === "en"
      ? `Stage #${stage.step}`
      : lang === "zh"
      ? `阶段 #${stage.step}`
      : `Tahap #${stage.step}`;

  return (
    <section id={`category-${stage.id}`} className="w-full space-y-4 sm:space-y-4.5">
      {/* Kotak Utama: Khusus 5 Deskripsi (Tanpa Bagian Lain) */}
      <div
        className={`w-full rounded-2xl sm:rounded-3xl border ${stage.borderClass} bg-card/85 backdrop-blur-md shadow-xs hover:shadow-md transition-all p-4.5 sm:p-5 relative overflow-hidden`}
      >
        {/* Accent top gradient line */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stage.gradientBg}`} />

        {/* Header Kategori Ringkas */}
        <div className="flex items-center gap-2.5 mb-3.5 px-0.5">
          <div className={`p-1.5 rounded-lg border ${stage.badgeBg}`}>
            <Icon className="size-4" />
          </div>
          <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full border ${stage.badgeBg}`}>
            {stagePrefix}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-foreground">
            {stage.name}
          </h3>
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            — {stageI18n.subtitle}
          </span>
        </div>

        {/* Khusus 5 Deskripsi dalam Kotak Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-3.5">
          {stageI18n.principles.map((p) => {
            const pointLabel =
              lang === "en"
                ? `Principle ${p.num}`
                : lang === "zh"
                ? `原则 ${p.num}`
                : `Prinsip ${p.num}`;

            return (
              <div
                key={p.num}
                className="p-3.5 rounded-xl sm:rounded-2xl bg-muted/25 border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-all flex flex-col justify-start gap-2 shadow-2xs group/card"
              >
                <div className="flex items-center gap-2">
                  <span className="size-5.5 rounded-md bg-primary/10 text-primary text-[11px] font-bold font-mono flex items-center justify-center shrink-0 group-hover/card:bg-primary group-hover/card:text-primary-foreground transition-colors">
                    {p.num}
                  </span>
                  <span className="text-xs font-bold text-foreground tracking-tight leading-snug">
                    {pointLabel}
                  </span>
                </div>
                <p className="text-[11.5px] text-foreground/80 leading-relaxed font-normal">
                  {p.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Grid Kotak-Kotak Modul (Gaya Seperti di Page Lain dengan MBACard) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
        {apps.map((app) => (
          <MBACard
            key={app.id}
            title={app.title}
            to={app.to}
            icon={app.icon}
            badge={app.categoryLabel}
            shortDesc={app.subtitle}
            gradient={getGradient ? getGradient(app.title) : undefined}
            features={app.features?.map((f) => ({
              title: f.title,
              to: f.to,
              icon: f.icon,
            }))}
            isFav={favorites.includes(app.to)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>
    </section>
  );
}

export function FinancialWealthSection({
  favorites,
  toggleFavorite,
  getGradient,
}: FinancialWealthSectionProps) {
  const [selectedTab, setSelectedTab] = useState<FinancialCategoryTab>("all");
  const lang = useLanguage();
  const pageId = useCurrentLauncherPage("financial") || "financial";
  const { getPageCountDelta } = useCardPageMover();

  const displayedStages = useMemo(() => {
    if (selectedTab === "all" || selectedTab === "spectrum") {
      return WEALTH_STAGE_MAIN_BOXES;
    }
    return WEALTH_STAGE_MAIN_BOXES.filter((s) => s.id === selectedTab);
  }, [selectedTab]);

  const activeStage = useMemo(() => {
    if (selectedTab === "all" || selectedTab === "spectrum") return null;
    return WEALTH_STAGE_MAIN_BOXES.find((s) => s.id === selectedTab) || null;
  }, [selectedTab]);

  const allLabel = lang === "en" ? "All" : lang === "zh" ? "全部" : "Semua";

  const pageSubtitles: Record<Language, string> = {
    id: "5 Tahap Wealth & Arsitektur Manajemen Kekayaan Terpadu (5 Pilar × 5 Modul Aplikasi)",
    en: "5 Wealth Stages & Comprehensive Wealth Management Architecture (5 Pillars × 5 Application Modules)",
    ms: "5 Tahap Kekayaan & Seni Bina Pengurusan Kekayaan Bersepadu (5 Tiang × 5 Modul Aplikasi)",
    zh: "五大财富阶段与综合财富管理架构（5大支柱 × 5大应用模块）",
  };

  const statusAllText: Record<Language, string> = {
    id: "Menampilkan seluruh 25 Modul (Surety, Flow, Build, Grow, Legacy)",
    en: "Displaying all 25 Modules (Surety, Flow, Build, Grow, Legacy)",
    ms: "Menampilkan semua 25 Modul (Surety, Flow, Build, Grow, Legacy)",
    zh: "展示全部25个模块（Surety、Flow、Build、Grow、Legacy）",
  };

  const activeStageText = activeStage
    ? lang === "en"
      ? `Stage ${activeStage.step}: ${activeStage.name} (5 Application Modules)`
      : lang === "zh"
      ? `阶段 ${activeStage.step}: ${activeStage.name} (5个应用模块)`
      : `Tahap ${activeStage.step}: ${activeStage.name} (5 Modul Aplikasi)`
    : "";

  return (
    <LauncherPageProvider pageId={pageId}>
    <div className="w-full flex flex-col items-center">
      {/* Portaled ShellHeader: Clean Category Selector di Top Right Bar */}
      <ShellHeader>
        <HeaderNavPills
          items={adjustCategoryTabsCount(
            [
              { id: "all" as FinancialCategoryTab, label: allLabel, count: 25 },
              { id: "surety" as FinancialCategoryTab, label: "Surety", count: 5 },
              { id: "flow" as FinancialCategoryTab, label: "Flow", count: 5 },
              { id: "build" as FinancialCategoryTab, label: "Build", count: 5 },
              { id: "grow" as FinancialCategoryTab, label: "Grow", count: 5 },
              { id: "legacy" as FinancialCategoryTab, label: "Legacy", count: 5 },
            ],
            getPageCountDelta(pageId)
          )}
          activeId={selectedTab}
          onSelect={(id) => setSelectedTab(id)}
        />
      </ShellHeader>

      {/* Title & Description */}
      <div className="text-center mb-3 sm:mb-4">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <span>Financial Planning and Wealth Management</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl mx-auto">
          {pageSubtitles[lang] || pageSubtitles.id}
        </p>
      </div>

      {/* Minimal Status Strip / Filter Active Indicator */}
      <div className="flex items-center justify-center gap-2 w-full mb-6">
        {selectedTab === "all" ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-muted-foreground bg-muted/40 border border-border/40">
            <Layers className="size-3.5 text-primary" />
            <span>{statusAllText[lang] || statusAllText.id}</span>
          </span>
        ) : (
          activeStage && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <activeStage.icon className="size-3.5" />
              <span>{activeStageText}</span>
              <button
                type="button"
                onClick={() => setSelectedTab("all")}
                className="hover:opacity-80 p-0.5 rounded-full cursor-pointer ml-1"
                title={lang === "en" ? "Show all categories" : "Tampilkan semua kategori"}
              >
                <X className="size-3" />
              </button>
            </span>
          )
        )}
      </div>

      {selectedTab === "all" && (
        <MovedCardsSection pageId={pageId} className="mb-8" />
      )}

      {/* Konten Kategori dengan Deskripsi Dilebur di Atas Masing-Masing Kategori */}
      <div className="w-full space-y-10 sm:space-y-12">
        {displayedStages.map((stage) => {
          const stageApps = STANDALONE_FINANCIAL_APPS.filter(
            (app) => app.category === stage.id
          );
          return (
            <CategorySectionView
              key={stage.id}
              stage={stage}
              apps={stageApps}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              getGradient={getGradient}
            />
          );
        })}
      </div>
    </div>
    </LauncherPageProvider>
  );
}
