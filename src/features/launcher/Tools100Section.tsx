import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useKembaliButtonClass } from "@/hooks/useKembaliButtonClass";
import { HeaderNavPills, ShellHeader } from "@/app/shell-header";
import { CardMoreMenu } from "@/components/common/CardMoreMenu";
import { MovedCardsGridItems } from "@/components/common/MovedCardsGridItems";
import {
  LauncherPageProvider,
  adjustCategoryTabsCount,
  makeMovedCardKey,
  useCardPageMover,
  useCurrentLauncherPage,
} from "@/hooks/useCardPageMover";
import {
  Compass,
  Target,
  Grid2X2,
  Globe,
  ShieldAlert,
  Award,
  Workflow,
  PieChart,
  LayoutGrid,
  TrendingUp,
  Sparkles,
  Heart,
  Store,
  Navigation,
  LineChart,
  Settings,
  Gauge,
  Users,
  CheckCircle2,
  Building,
  Calculator,
  Scale,
  Zap,
  Lightbulb,
  Building2,
  RefreshCw,
  Sprout,
  Star,
  Layers,
  ArrowRight,
  BookOpen,
  CheckSquare,
  Megaphone,
  Box,
  Gem,
  Waves,
  Brain,
  Eye,
  ShieldCheck,
  Shield,
  Binary,
  Briefcase,
  PenTool,
  MessagesSquare,
  FileText,
  AlertTriangle,
  FolderKanban,
  LayoutDashboard,
  GraduationCap,
  DollarSign,
  HeartHandshake,
  CalendarDays,
  Coins,
  MessageCircle,
  Truck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  type LucideIcon,
} from "lucide-react";
import { type NavItem } from "@/config/nav";
import { CATEGORIES, MBA_PILLARS, getFrameworkData, slugify } from "@/frameworkData";

export interface MBASubFeature {
  title: string;
  to: string;
  icon: LucideIcon;
  desc?: string;
}

export interface StandaloneMBAAppDef {
  id: string;
  to: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  pillar: string;
  icon: LucideIcon;
  badge?: string;
  features: MBASubFeature[];
}

const TOOLS_GRADIENT_PALETTES = [
  "bg-linear-to-br from-indigo-500 to-indigo-700",
  "bg-linear-to-br from-blue-500 to-cyan-600",
  "bg-linear-to-br from-emerald-500 to-teal-700",
  "bg-linear-to-br from-amber-500 to-orange-600",
  "bg-linear-to-br from-rose-500 to-pink-600",
  "bg-linear-to-br from-purple-500 to-violet-700",
  "bg-linear-to-br from-sky-500 to-blue-700",
  "bg-linear-to-br from-teal-500 to-emerald-700",
];

export function getToolsGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % TOOLS_GRADIENT_PALETTES.length;
  return TOOLS_GRADIENT_PALETTES[idx];
}

export function getPillarIcon(pillarName: string): LucideIcon {
  switch (pillarName) {
    case "Strategy":
      return Compass;
    case "Commercial":
      return TrendingUp;
    case "Finance":
      return Calculator;
    case "Operations":
      return Settings;
    case "Organization":
      return Users;
    case "Innovation":
      return Lightbulb;
    case "Governance":
      return ShieldCheck;
    case "Analytics":
      return LineChart;
    default:
      return Box;
  }
}

export function getCategoryIcon(cat: string): LucideIcon {
  switch (cat) {
    case "Strategic Analysis":
      return Compass;
    case "Business Design":
      return LayoutGrid;
    case "Marketing Management":
      return Store;
    case "Customer Experience":
      return Users;
    case "Operations Management":
      return Settings;
    case "Project Management":
      return CalendarDays;
    case "Performance Management":
      return Target;
    case "Financial Analysis":
      return Calculator;
    case "Decision Analysis":
      return CheckSquare;
    case "Innovation Management":
      return Lightbulb;
    case "Quality Management":
      return ShieldCheck;
    case "Change Management":
      return RefreshCw;
    case "Policy Management":
      return BookOpen;
    case "Quantitative Analysis":
      return LineChart;
    case "Product Management":
      return Layers;
    case "Risk Management":
      return ShieldAlert;
    case "Sustainability":
      return Sprout;
    case "People Management":
      return Award;
    case "Sales Revenue":
      return TrendingUp;
    case "Technology Futures":
      return Sparkles;
    case "Corporate Communications":
      return Megaphone;
    // Fallbacks
    case "Strategic Management":
      return Compass;
    case "Business Model & Value Proposition":
      return LayoutGrid;
    case "Marketing & Customer Management":
      return Store;
    case "Operations & Performance Management":
      return Settings;
    case "Financial Management & Business Feasibility":
      return Calculator;
    case "Innovation, Entrepreneurship & Design":
      return Lightbulb;
    case "Quality Management & Continuous Improvement":
      return ShieldCheck;
    case "Change Management & Organizational Development":
      return RefreshCw;
    case "Public Policy & Program Management":
      return BookOpen;
    case "Decision Making & Analytical Thinking":
      return CheckSquare;
    case "Economics & Quantitative Analysis":
      return LineChart;
    case "Product Management & Agile/Scrum":
      return Layers;
    case "Sustainability, ESG & Risk Management":
      return Sprout;
    case "Leadership, Talent & Culture Management":
      return Award;
    case "Sales, Pricing & Revenue Operations":
      return TrendingUp;
    case "Deep Tech, Innovation & Future Studies":
      return Sparkles;
    case "Public Relations, Crisis & Stakeholder Management":
      return Megaphone;
    default:
      return Box;
  }
}

export const DEDICATED_FRAMEWORK_ROUTES: Record<string, string> = {
  "SWOT Analysis": "/swot",
  "TOWS Matrix": "/tows",
  "PESTEL Analysis": "/pestel",
  "Porter's Five Forces": "/porter",
  "VRIO Framework": "/vrio",
  "Value Chain Analysis": "/value-chain",
  "BCG Matrix": "/bcg",
  "GE-McKinsey Matrix": "/ge-mckinsey",
  "Ansoff Matrix": "/ansoff",
  "Blue Ocean Strategy (ERRC)": "/blue-ocean",
  "Value Disciplines Model": "/value-disciplines",
  "Business Model Canvas (BMC)": "/bmc",
  "Lean Canvas": "/lean-canvas",
  "Value Proposition Canvas": "/value-proposition-canvas",
  "Empathy Map": "/empathy-map",
  "STP Framework": "/stp",
  "4P/7P Marketing Mix": "/marketing-mix",
  "Customer Journey Map (CJM)": "/customer-journey-map",
  "Kano Model": "/kano-model",
  "Product Life Cycle (PLC)": "/product-life-cycle",
  "Eisenhower Matrix": "/framework/eisenhower-matrix",
};

export const FRAMEWORK_ICONS: Record<string, LucideIcon> = {
  "SWOT Analysis": Target,
  "TOWS Matrix": Grid2X2,
  "PESTEL Analysis": Globe,
  "Porter's Five Forces": ShieldAlert,
  "VRIO Framework": Gem,
  "Value Chain Analysis": Workflow,
  "BCG Matrix": PieChart,
  "GE-McKinsey Matrix": LayoutGrid,
  "Ansoff Matrix": TrendingUp,
  "Blue Ocean Strategy (ERRC)": Waves,
  "Value Disciplines Model": Award,
  "Business Model Canvas (BMC)": LayoutGrid,
  "Lean Canvas": Grid2X2,
  "Value Proposition Canvas": Target,
  "Empathy Map": Heart,
  "STP Framework": Compass,
  "4P/7P Marketing Mix": Store,
  "Customer Journey Map (CJM)": Navigation,
  "Kano Model": LineChart,
  "Product Life Cycle (PLC)": TrendingUp,
  "Six Sigma (DMAIC)": Gauge,
  "SIPOC Diagram": Workflow,
  "RACI Matrix": Users,
  "Gantt Chart": CalendarDays,
  "Balanced Scorecard (BSC)": Target,
  "OKR Framework": Award,
  "Eisenhower Matrix": CheckSquare,
  "Analisis Rasio Keuangan": Calculator,
  "Capital Budgeting (ROI, NPV, IRR)": Building2,
  "Break-Even Analysis (BEP)": LineChart,
  "Cost-Benefit Analysis (CBA)": Scale,
  "Business Case Analysis": FileText,
  "Lean Startup Loop": RefreshCw,
  "Design Thinking": Lightbulb,
  "Fishbone Diagram (Ishikawa)": Workflow,
  "PDCA Cycle": RefreshCw,
  "House of Quality (HOQ / QFD)": Building,
  "McKinsey 7S Framework": Layers,
  "Kotter's 8-Step Change": TrendingUp,
  "Force Field Analysis": Scale,
  "Logical Framework Analysis": Layers,
  "Stakeholder Power-Interest": Users,
  "Analisis Kebijakan Public (Dunn)": Scale,
  "SMART Criteria": CheckCircle2,
  "Decision Tree Analysis": Workflow,
  "Decision Matrix (Pugh)": Grid2X2,
  "Pareto Analysis (80/20)": LineChart,
  "Analytical Hierarchy Process (AHP)": Layers,
  "Six Thinking Hats": Brain,
  "Supply-Demand Analysis": TrendingUp,
  "Input-Output Analysis": Scale,
  "Radar / Spider Chart": Compass,
  "Product Vision Board": LayoutDashboard,
  "Kano Feature Prioritization": Star,
  "Scrum / Kanban Board": FolderKanban,
  "RICE Scoring Model": Calculator,
  "MoSCoW Prioritization": CheckSquare,
  "User Story Mapping": Layers,
  "Opportunity Solution Tree": Workflow,
  "Dual-Track Agile Framework": RefreshCw,
  "ESG Materiality Matrix": Globe,
  "Risk Assessment Matrix": ShieldAlert,
  "Triple Bottom Line (TBL)": Sprout,
  "Circular Economy (Butterfly)": RefreshCw,
  "FMEA Framework": AlertTriangle,
  "ISO 31000 Risk Management": ShieldCheck,
  "Carbon Footprint (Scope 1-3)": Globe,
  "Business Continuity Plan (BCP)": Shield,
  "9-Box Talent Grid": Grid2X2,
  "Situational Leadership": Compass,
  "Johari Window": Eye,
  "Culture Map": Heart,
  "Lencioni’s 5 Dysfunctions": AlertTriangle,
  "EVP Canvas": Award,
  "360-Degree Feedback": RefreshCw,
  "Kirkpatrick 4-Level Model": GraduationCap,
  "MEDDPICC Framework": Target,
  "Pricing Matrix & Elasticity": DollarSign,
  "Unit Economics (CLV/CAC)": Calculator,
  "SPIN Selling Framework": MessagesSquare,
  "BANT Framework": CheckCircle2,
  "Revenue Engine (Flywheel)": Zap,
  "Value-Based Pricing Canvas": Gem,
  "Churn Analysis Matrix": TrendingUp,
  "Technology Readiness (TRL)": Binary,
  "Horizon Scanning (Futures)": Compass,
  "Gartner Hype Cycle": LineChart,
  "Doblin’s 10 Types Innovation": Sparkles,
  "SCAMPER Ideation Canvas": Lightbulb,
  "MVP Canvas": Briefcase,
  "Open Innovation Model": Globe,
  "Value Proposition Testing": Target,
  "SCR Framework (Minto)": FileText,
  "Crisis Communication (SCCT)": ShieldAlert,
  "Brand Archetypes": Award,
  "PESO Model": Megaphone,
  "Carroll’s CSR Pyramid": Building,
  "Issue Life Cycle": RefreshCw,
  "Stakeholder Engagement": HeartHandshake,
  "Press Release Canvas": PenTool,
  "Pricing Matrix": DollarSign,
  "Doblin's 10 Types Innovation": Sparkles,
  "Lencioni's 5 Dysfunctions": AlertTriangle,
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Strategic Analysis":
    "Platform analisis strategi korporat dan posisi kompetitif jangka panjang melalui pemetaan lingkungan internal, eksternal, dan rantai nilai.",
  "Business Design":
    "Studio arsitektur model bisnis, perancangan proposisi nilai pelanggan, struktur biaya, aliran pendapatan, dan pemetaan empati audiens.",
  "Marketing Management":
    "Manajemen pemasaran menyeluruh untuk segmentasi pasar (STP), bauran 4P/7P, dan analisis siklus hidup produk (PLC).",
  "Customer Experience":
    "Pemetaan end-to-end pengalaman pelanggan melalui Customer Journey Map (CJM) dan evaluasi kepuasan fitur Kano Model.",
  "Operations Management":
    "Suite optimasi operasional, efisiensi proses Six Sigma (DMAIC), dan pemetaan alur suplai dengan SIPOC Diagram.",
  "Project Management":
    "Manajemen proyek terstruktur dengan matriks akuntabilitas RACI dan penjadwalan timeline kerja Gantt Chart.",
  "Performance Management":
    "Pengukuran kinerja strategis organisasi menggunakan Balanced Scorecard (BSC), OKR Framework, dan kriteria SMART.",
  "Financial Analysis":
    "Analisis kelayakan investasi modal (NPV, IRR, ROI), rasio profitabilitas keuangan, dan kalkulasi titik impas (BEP).",
  "Decision Analysis":
    "Mesin pengambilan keputusan analitis menggunakan Cost-Benefit Analysis (CBA), Business Case, Decision Tree, Pugh Matrix, AHP, Six Thinking Hats, Eisenhower Matrix, dan Pareto 80/20.",
  "Innovation Management":
    "Akselerator inovasi dan kewirausahaan berbasis metodologi iteratif Lean Startup Loop, Design Thinking, Doblin 10 Types, SCAMPER, MVP Canvas, Open Innovation, dan Value Proposition Testing.",
  "Quality Management":
    "Sistem penjaminan mutu berkesinambungan melalui investigasi sebab-akibat Fishbone, siklus PDCA Kaizen, dan House of Quality (QFD).",
  "Change Management":
    "Manajemen transformasi organisasi, keselarasan 7 elemen McKinsey 7S, akselerasi perubahan 8 langkah Kotter, dan analisis medan kekuatan (Force Field).",
  "Policy Management":
    "Kerangka perumusan kebijakan publik terstruktur, pemetaan kuasa pemangku kepentingan (Power-Interest), dan Analisis Kebijakan Publik Dunn.",
  "Quantitative Analysis":
    "Analisis kuantitatif keseimbangan mikro-makro ekonomi, ekuilibrium supply-demand, matriks input-output multisektor, dan visualisasi spider chart.",
  "Product Management":
    "Manajemen produk digital tangkas mulai dari Product Vision, prioritisasi backlog (Kano, RICE, MoSCoW), User Story Mapping, Opportunity Solution Tree, Dual-Track Agile, dan Scrum/Kanban.",
  "Risk Management":
    "Manajemen risiko perusahaan (ISO 31000, FMEA, BCP), dan matriks evaluasi risiko (Risk Assessment Matrix).",
  "Sustainability":
    "Praktik keberlanjutan dan ESG perusahaan: Materialitas ESG, Triple Bottom Line (TBL), Circular Economy (Butterfly), dan perhitungan Jejak Karbon Scope 1-3.",
  "People Management":
    "Manajemen talenta dan kepemimpinan strategis melalui 9-Box Grid, kepemimpinan situasional, Johari Window, Culture Map, 5 Disfungsi Tim Lencioni, EVP Canvas, dan umpan balik 360 derajat.",
  "Sales Revenue":
    "Operasi pendapatan enterprise, kualifikasi prospek (MEDDPICC, BANT, SPIN), strategi penetapan harga (Pricing Matrix), Flywheel Revenue Engine, Value-Based Pricing, Unit Economics (CLV/CAC), dan Churn Analysis.",
  "Technology Futures":
    "Pemindaian sinyal masa depan (Horizon Scanning), tingkat kesiapan teknologi (TRL), dan siklus ekspektasi Gartner Hype Cycle.",
  "Corporate Communications":
    "Manajemen komunikasi korporat dan krisis (SCCT), struktur piramida narasi SCR Minto, Brand Archetypes, model media PESO, Piramida CSR Carroll, siklus isu, dan kanvas press release.",
  // Legacy mappings for backward compatibility
  "Strategic Management":
    "Platform analisis strategi korporat dan posisi kompetitif jangka panjang.",
  "Business Model & Value Proposition":
    "Studio arsitektur model bisnis dan proposisi nilai pelanggan.",
  "Marketing & Customer Management":
    "Manajemen pemasaran menyeluruh untuk segmentasi pasar dan customer journey.",
  "Operations & Performance Management":
    "Suite optimasi operasional dan manajemen performa organisasi.",
  "Financial Management & Business Feasibility":
    "Analisis kelayakan investasi modal, rasio keuangan, dan titik impas.",
  "Innovation, Entrepreneurship & Design":
    "Akselerator inovasi dan kewirausahaan.",
  "Quality Management & Continuous Improvement":
    "Sistem penjaminan mutu berkesinambungan dan Kaizen.",
  "Change Management & Organizational Development":
    "Manajemen transformasi organisasi dan akselerasi perubahan.",
  "Public Policy & Program Management":
    "Kerangka kerja perumusan kebijakan publik dan pemangku kepentingan.",
  "Decision Making & Analytical Thinking":
    "Mesin pengambilan keputusan analitis dan berpikir kritis.",
  "Economics & Quantitative Analysis":
    "Analisis kuantitatif keseimbangan pasar dan input-output.",
  "Product Management & Agile/Scrum":
    "Manajemen produk digital tangkas dan prioritisasi fitur.",
  "Sustainability, ESG & Risk Management":
    "Manajemen risiko perusahaan, ESG, dan keberlanjutan.",
  "Leadership, Talent & Culture Management":
    "Manajemen talenta dan kepemimpinan strategis.",
  "Sales, Pricing & Revenue Operations":
    "Operasi pendapatan enterprise, penetapan harga, dan unit economics.",
  "Deep Tech, Innovation & Future Studies":
    "Pemindaian masa depan dan kesiapan teknologi.",
  "Public Relations, Crisis & Stakeholder Management":
    "Komunikasi krisis korporat dan manajemen pemangku kepentingan.",
};

// 17 Standalone Apps (The 17 Categories) with all their sub-features inside them
export const STANDALONE_MBA_APPS: StandaloneMBAAppDef[] = CATEGORIES.map((cat) => {
  const CatIcon = getCategoryIcon(cat.name);
  const slug = slugify(cat.name);
  const desc =
    CATEGORY_DESCRIPTIONS[cat.name] ||
    `Aplikasi mandiri Mini MBA untuk mengelola instrumen dan kanvas analitis kategori ${cat.name}.`;

  const features: MBASubFeature[] = cat.frameworks.map((fwName) => {
    const fwSlug = slugify(fwName);
    const dedicatedPath = DEDICATED_FRAMEWORK_ROUTES[fwName];
    const fwPath = dedicatedPath || `/framework/${fwSlug}`;
    const fwIcon = FRAMEWORK_ICONS[fwName] || CatIcon;
    const fwData = getFrameworkData(fwName);

    return {
      title: fwName,
      to: fwPath,
      icon: fwIcon,
      desc: fwData?.teori?.deskripsi,
    };
  });

  return {
    id: slug,
    to: `/100-framework?cat=${encodeURIComponent(cat.name)}`,
    title: cat.name,
    subtitle: desc,
    categoryLabel: cat.pillar,
    pillar: cat.pillar,
    icon: CatIcon,
    features,
  };
});

export interface ValueTreatedAppDef {
  id: string;
  slug: string;
  to: string;
  title: string;
  subtitle: string;
  categoryLabel: string;
  icon: LucideIcon;
  gradient: string;
  features: {
    title: string;
    to: string;
    icon: LucideIcon;
    desc?: string;
  }[];
}

export const VALUE_TREATED_APPS: ValueTreatedAppDef[] = [
  {
    id: "vt-ekonomi",
    slug: "ekonomi",
    to: "/kurasi/ekonomi",
    title: "Ekonomi",
    subtitle: "Perputaran Value • Teori nilai ekonomi, inflasi, mekanisme pasar, dan dinamika kebijakan fiskal & moneter.",
    categoryLabel: "Value Treated",
    icon: Coins,
    gradient: "bg-linear-to-br from-amber-500 to-amber-700",
    features: [
      { title: "Nilai & Uang", to: "/kurasi/ekonomi", icon: Coins, desc: "Hakikat nilai tukar, satuan hitung, dan evolusi moneter." },
      { title: "Inflasi & Daya Beli", to: "/kurasi/ekonomi", icon: TrendingUp, desc: "Dinamika kenaikan harga dan depresiasi nilai riil aset." },
      { title: "Mekanisme Pasar", to: "/kurasi/ekonomi", icon: Store, desc: "Hukum permintaan penawaran dan titik temu equilibrium." },
      { title: "Fiskal & Moneter", to: "/kurasi/ekonomi", icon: Scale, desc: "Instrumen suku bunga acuan dan belanja negara makro." },
    ],
  },
  {
    id: "vt-statistik",
    slug: "statistik",
    to: "/kurasi/statistik",
    title: "Statistik",
    subtitle: "Pendataan Value • Pemodelan data kuantitatif, probabilitas, korelasi variabel, dan inferensi keputusan bisnis.",
    categoryLabel: "Value Treated",
    icon: LineChart,
    gradient: "bg-linear-to-br from-indigo-500 to-indigo-700",
    features: [
      { title: "Distribusi Probabilitas", to: "/kurasi/statistik", icon: LineChart, desc: "Pemodelan kurva sebaran nilai acak dan deviasi standar." },
      { title: "Uji Hipotesis & Korelasi", to: "/kurasi/statistik", icon: Target, desc: "Validasi signifikansi hubungan sebab akibat data bisnis." },
      { title: "Regresi & Forecasting", to: "/kurasi/statistik", icon: TrendingUp, desc: "Proyeksi tren nilai masa depan berbasis data historis." },
      { title: "Sampling & Stratifikasi", to: "/kurasi/statistik", icon: LayoutGrid, desc: "Teknik sampling representatif untuk riset pasar akurat." },
    ],
  },
  {
    id: "vt-manajemen",
    slug: "manajemen",
    to: "/kurasi/manajemen",
    title: "Manajemen",
    subtitle: "Pengelolaan Value • Orkestrasi sumber daya, perencanaan strategis, efisiensi operasional, dan kepemimpinan sistem.",
    categoryLabel: "Value Treated",
    icon: Briefcase,
    gradient: "bg-linear-to-br from-blue-600 to-blue-800",
    features: [
      { title: "Model Bisnis & Strategi", to: "/kurasi/manajemen", icon: Workflow, desc: "Penyusunan arsitektur penciptaan dan penangkapan nilai." },
      { title: "Siklus Hidup Produk", to: "/kurasi/manajemen", icon: RefreshCw, desc: "Navigasi tahap pengenalan, pertumbuhan, hingga kedewasaan." },
      { title: "Customer Experience", to: "/kurasi/manajemen", icon: Heart, desc: "Optimasi touchpoint interaksi untuk kepuasan konsumen." },
      { title: "Continuous Improvement", to: "/kurasi/manajemen", icon: Award, desc: "Eliminasi inefisiensi melalui siklus Kaizen & PDCA." },
    ],
  },
  {
    id: "vt-komunikasi",
    slug: "komunikasi",
    to: "/kurasi/komunikasi",
    title: "Komunikasi",
    subtitle: "Penyampaian Value • Artikulasi narasi strategis, negosiasi tingkat tinggi, retorika publik, dan harmonisasi relasi.",
    categoryLabel: "Value Treated",
    icon: MessageCircle,
    gradient: "bg-linear-to-br from-cyan-600 to-teal-700",
    features: [
      { title: "Penyelarasan Narasi", to: "/kurasi/komunikasi", icon: MessageCircle, desc: "Translasi pesan strategis agar relevan bagi stakeholder." },
      { title: "Negosiasi & Persuasi", to: "/kurasi/komunikasi", icon: HeartHandshake, desc: "Prinsip win-win bargaining dan framing kesepakatan." },
      { title: "Komunikasi Krisis", to: "/kurasi/komunikasi", icon: ShieldAlert, desc: "Mitigasi distorsi informasi saat situasi darurat publik." },
      { title: "Retorika & Presentasi", to: "/kurasi/komunikasi", icon: Megaphone, desc: "Struktur penyampaian gagasan yang memikat dan terukur." },
    ],
  },
  {
    id: "vt-logistik",
    slug: "logistik",
    to: "/kurasi/logistik",
    title: "Logistik",
    subtitle: "Perpindahan Value • Rekayasa rantai pasok (supply chain), tata kelola pergudangan, optimasi rute, dan distribusi barang.",
    categoryLabel: "Value Treated",
    icon: Truck,
    gradient: "bg-linear-to-br from-orange-500 to-amber-700",
    features: [
      { title: "Supply Chain Management", to: "/kurasi/logistik", icon: Workflow, desc: "Integrasi arus material dari hulu pemasok ke hilir pemakai." },
      { title: "Tata Kelola Pergudangan", to: "/kurasi/logistik", icon: Box, desc: "Optimasi layout penyimpanan, picking, dan inventory control." },
      { title: "Rute & Distribusi", to: "/kurasi/logistik", icon: Navigation, desc: "Efisiensi biaya transportasi dan ketepatan lead time kirim." },
      { title: "Cold Chain & Buffer", to: "/kurasi/logistik", icon: ShieldCheck, desc: "Pengendalian kualitas spesifik saat transit barang berharga." },
    ],
  },
  {
    id: "vt-bisnis",
    slug: "bisnis",
    to: "/kurasi/bisnis",
    title: "Bisnis",
    subtitle: "Pertukaran Value • Validasi kelayakan pasar, perancangan proposisi nilai, saluran penjualan, dan monetisasi berkelanjutan.",
    categoryLabel: "Value Treated",
    icon: Store,
    gradient: "bg-linear-to-br from-emerald-600 to-green-800",
    features: [
      { title: "Validasi Proposisi Nilai", to: "/kurasi/bisnis", icon: Target, desc: "Uji hipotesis kesesuaian solusi produk dengan problem pasar." },
      { title: "Model Monetisasi", to: "/kurasi/bisnis", icon: DollarSign, desc: "Struktur pricing, recurring revenue, dan margin keuntungan." },
      { title: "Ekspansi & Skalabilitas", to: "/kurasi/bisnis", icon: TrendingUp, desc: "Replikasi keberhasilan operasional ke segmen baru." },
      { title: "Analisis Pesaing Pasar", to: "/kurasi/bisnis", icon: Award, desc: "Identifikasi keunggulan pembeda (moat) dari kompetitor." },
    ],
  },
  {
    id: "vt-administrasi",
    slug: "administrasi",
    to: "/kurasi/administrasi",
    title: "Administrasi",
    subtitle: "Pembukuan Value • Standard Operating Procedures (SOP), ketertiban dokumentasi, arsip legal, dan kepatuhan sistem regulasi.",
    categoryLabel: "Value Treated",
    icon: FileText,
    gradient: "bg-linear-to-br from-slate-600 to-slate-800",
    features: [
      { title: "SOP & Tata Kerja", to: "/kurasi/administrasi", icon: CheckSquare, desc: "Standardisasi alur kerja operasional berulang yang konsisten." },
      { title: "Arsip & Manajemen Dokumen", to: "/kurasi/administrasi", icon: FolderKanban, desc: "Sistem pengindeksan rekod bisnis legal dan rekam jejak audit." },
      { title: "Kepatuhan Regulasi", to: "/kurasi/administrasi", icon: Scale, desc: "Kesesuaian tata kelola dengan aturan hukum dan perizinan." },
      { title: "Pelaporan Berkala", to: "/kurasi/administrasi", icon: FileText, desc: "Rangkuman status pencapaian kinerja dan deviasi tugas." },
    ],
  },
  {
    id: "vt-akuntansi",
    slug: "akuntansi",
    to: "/kurasi/akuntansi",
    title: "Akuntansi",
    subtitle: "Pencatatan Value • Pembukuan berpasangan (double-entry), neraca, laporan laba rugi, arus kas, dan audit transparansi finansial.",
    categoryLabel: "Value Treated",
    icon: Calculator,
    gradient: "bg-linear-to-br from-violet-600 to-purple-800",
    features: [
      { title: "Laporan Laba Rugi", to: "/kurasi/akuntansi", icon: Calculator, desc: "Rekonsiliasi total pendapatan kotor terhadap beban usaha." },
      { title: "Neraca Keuangan", to: "/kurasi/akuntansi", icon: Scale, desc: "Keseimbangan persamaan fundamental aset, liabilitas, & ekuitas." },
      { title: "Arus Kas (Cash Flow)", to: "/kurasi/akuntansi", icon: Coins, desc: "Pemantauan likuiditas operasional, investasi, & pendanaan." },
      { title: "Audit & Pengendalian", to: "/kurasi/akuntansi", icon: ShieldCheck, desc: "Verifikasi kepatuhan standar akuntansi dan integritas angka." },
    ],
  },
  {
    id: "vt-asuransi",
    slug: "asuransi",
    to: "/kurasi/asuransi",
    title: "Asuransi",
    subtitle: "Pelindung Value • Pemodelan aktuaria, proteksi aset dari bahaya, mitigasi kerugian finansial, dan pemindahan risiko terencana.",
    categoryLabel: "Value Treated",
    icon: Shield,
    gradient: "bg-linear-to-br from-rose-600 to-red-800",
    features: [
      { title: "Transfer & Retensi Risiko", to: "/kurasi/asuransi", icon: Shield, desc: "Keputusan proteksi aset melalui polis atau cadangan mandiri." },
      { title: "Kalkulasi Premi Aktuaria", to: "/kurasi/asuransi", icon: Calculator, desc: "Estimasi probabilitas klaim dan beban premi berkeadilan." },
      { title: "Tata Kelola Klaim Proteksi", to: "/kurasi/asuransi", icon: FileText, desc: "Prosedur validasi ganti rugi saat peristiwa risiko terjadi." },
      { title: "Manajemen Underwriting", to: "/kurasi/asuransi", icon: Target, desc: "Penyaringan dan penilaian profil risiko objek perlindungan." },
    ],
  },
  {
    id: "vt-investasi",
    slug: "investasi",
    to: "/kurasi/investasi",
    title: "Investasi",
    subtitle: "Penambah Value • Multiplikasi modal melalui alokasi aset cerdas, compounding interest, diversifikasi, dan penciptaan dividen jangka panjang.",
    categoryLabel: "Value Treated",
    icon: TrendingUp,
    gradient: "bg-linear-to-br from-teal-600 to-emerald-800",
    features: [
      { title: "Alokasi Aset Portofolio", to: "/kurasi/investasi", icon: PieChart, desc: "Proporsi seimbang antara saham, obligasi, properti, & kas." },
      { title: "Efek Compounding", to: "/kurasi/investasi", icon: TrendingUp, desc: "Eksponensial bunga berbunga dari reinvestasi imbal hasil." },
      { title: "Analisis Fundamental", to: "/kurasi/investasi", icon: LineChart, desc: "Penilaian valuasi wajar intrinsik bisnis sebelum investasi." },
      { title: "Manajemen Risiko Portofolio", to: "/kurasi/investasi", icon: ShieldCheck, desc: "Diversifikasi taktis untuk meredam volatilitas pasar." },
    ],
  },
];

export interface ValuePillarDef {
  id: string;
  to: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  features: MBASubFeature[];
}

export const VALUE_PILLARS: ValuePillarDef[] = [
  {
    id: "customer-proposition-value",
    to: "/value-proposition-canvas",
    title: "Customer & Proposition Value",
    subtitle: "Perancangan kesesuaian nilai (Product-Market Fit), dekonstruksi profil pelanggan, dan pemetaan emosional pengalaman konsumen.",
    icon: Heart,
    gradient: "bg-linear-to-br from-rose-500 to-pink-600",
    features: [
      {
        title: "Value Proposition Canvas",
        to: "/value-proposition-canvas",
        icon: Target,
        desc: "Penyelarasan profil pelanggan (Jobs, Pains, Gains) dengan peta nilai produk (Pain Relievers, Gain Creators).",
      },
      {
        title: "Customer Journey Map (CJM)",
        to: "/customer-journey-map",
        icon: Navigation,
        desc: "Pemetaan pertukaran nilai dan pengalaman pelanggan sepanjang tahapan siklus interaksi.",
      },
      {
        title: "Empathy Map",
        to: "/empathy-map",
        icon: Heart,
        desc: "Eksplorasi mendalam atas apa yang dipikirkan, dirasakan, dilihat, dan didengar oleh pengguna sasaran.",
      },
      {
        title: "Kano Model Kepuasan Nilai",
        to: "/kano-model",
        icon: LineChart,
        desc: "Klasifikasi atribut nilai produk menjadi Must-be, Performance, dan Delighter untuk kepuasan puncak.",
      },
    ],
  },
  {
    id: "strategic-operational-value",
    to: "/value-chain",
    title: "Strategic & Operational Value Chain",
    subtitle: "Dekonstruksi keunggulan kompetitif, optimasi rantai nilai Porter, dan rekayasa disiplin dominasi pasar.",
    icon: Workflow,
    gradient: "bg-linear-to-br from-blue-600 to-indigo-700",
    features: [
      {
        title: "Value Chain Analysis",
        to: "/value-chain",
        icon: Workflow,
        desc: "Analisis aktivitas utama dan pendukung Michael Porter untuk menciptakan diferensiasi dan margin nilai tertinggi.",
      },
      {
        title: "Value Disciplines Model",
        to: "/value-disciplines",
        icon: Award,
        desc: "Pilihan dominasi strategis Treacy & Wiersema: Operational Excellence, Customer Intimacy, atau Product Leadership.",
      },
      {
        title: "Business Model Canvas (BMC)",
        to: "/bmc",
        icon: LayoutGrid,
        desc: "Sembilan blok pembangun penciptaan nilai, penghantaran nilai, dan penangkapan nilai bisnis secara holistik.",
      },
      {
        title: "Blue Ocean Strategy (ERRC)",
        to: "/blue-ocean",
        icon: Waves,
        desc: "Rekonstruksi kurva nilai industri melalui kerangka kerja Eliminate, Reduce, Raise, dan Create.",
      },
    ],
  },
  {
    id: "economic-pricing-value",
    to: "/framework/unit-economics-clvcac",
    title: "Economic & Monetization Value",
    subtitle: "Penangkapan nilai finansial, penetapan harga berbasis nilai persepsi, dan keberlanjutan unit economics.",
    icon: DollarSign,
    gradient: "bg-linear-to-br from-emerald-600 to-teal-700",
    features: [
      {
        title: "Value-Based Pricing Canvas",
        to: "/framework/value-based-pricing-canvas",
        icon: Gem,
        desc: "Penetapan harga produk berdasarkan perceived economic value dan willingness-to-pay pelanggan.",
      },
      {
        title: "Unit Economics (CLV / CAC)",
        to: "/framework/unit-economics-clvcac",
        icon: Calculator,
        desc: "Perbandingan nilai seumur hidup pelanggan (Customer Lifetime Value) terhadap biaya akuisisi (CAC).",
      },
      {
        title: "Capital Budgeting (NPV, IRR, ROI)",
        to: "/framework/capital-budgeting-roi-npv-irr",
        icon: Building2,
        desc: "Kalkulasi Net Present Value (NPV) dan pengembalian modal untuk memastikan kelayakan penciptaan nilai.",
      },
      {
        title: "Break-Even Analysis (BEP)",
        to: "/framework/break-even-analysis-bep",
        icon: LineChart,
        desc: "Penentuan titik impas nilai antara struktur biaya tetap dan marjin kontribusi per unit.",
      },
    ],
  },
  {
    id: "stakeholder-sustainable-value",
    to: "/framework/triple-bottom-line-tbl",
    title: "Stakeholder & Sustainable Value",
    subtitle: "Penciptaan nilai bersama (Creating Shared Value), keadilan pemangku kepentingan, dan keberlanjutan masa depan.",
    icon: Sprout,
    gradient: "bg-linear-to-br from-amber-500 to-orange-600",
    features: [
      {
        title: "Triple Bottom Line (TBL)",
        to: "/framework/triple-bottom-line-tbl",
        icon: Sprout,
        desc: "Keseimbangan penciptaan nilai multi-dimensi: Manusia (People), Planet (Bumi), dan Profit (Keberlanjutan Finansial).",
      },
      {
        title: "ESG Materiality Matrix",
        to: "/framework/esg-materiality-matrix",
        icon: Globe,
        desc: "Prioritisasi isu-isu lingkungan, sosial, dan tata kelola yang memberi dampak nilai material jangka panjang.",
      },
      {
        title: "EVP Canvas (Employee Value Proposition)",
        to: "/framework/evp-canvas",
        icon: Award,
        desc: "Penawaran proposisi nilai organisasi untuk menarik, memotivasi, dan mempertahankan talenta unggul.",
      },
      {
        title: "Stakeholder Engagement & Value",
        to: "/framework/stakeholder-engagement",
        icon: HeartHandshake,
        desc: "Penyelarasan nilai dan ekspektasi strategis antara investor, regulator, komunitas, dan konsumen.",
      },
    ],
  },
];

export const ToolsFlipCard = ({
  app,
  isFav,
  toggleFavorite,
  gradient,
}: {
  app: StandaloneMBAAppDef;
  isFav: boolean;
  toggleFavorite: (to: string) => void;
  gradient?: string;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const kembaliBtnClass = useKembaliButtonClass();
  const currentPageId = useCurrentLauncherPage("mode_business") || "mode_business";
  const { isCardMovedOut } = useCardPageMover();
  const [interactionConfig, setInteractionConfig] = useState(() => ({
    axis: Math.random() > 0.5 ? "x" : "y",
    dir: Math.random() > 0.5 ? 1 : -1,
  }));

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInteractionConfig((prev) => {
      let nextAxis = prev.axis;
      let nextDir = prev.dir;
      while (nextAxis === prev.axis && nextDir === prev.dir) {
        nextAxis = Math.random() > 0.5 ? "x" : "y";
        nextDir = Math.random() > 0.5 ? 1 : -1;
      }
      return { axis: nextAxis, dir: nextDir };
    });
    setIsFlipped((prev) => !prev);
  };

  const Icon = app.icon;
  const cardGradient = gradient || (app as any).gradient || "bg-linear-to-br from-primary to-indigo-700";

  if (isCardMovedOut(currentPageId, app.to, app.title)) {
    return null;
  }

  return (
    <div className="w-full [perspective:1000px] min-h-[300px]">
      <motion.div
        className="relative w-full h-full min-h-[300px] [transform-style:preserve-3d]"
        animate={{
          rotateX: isFlipped && interactionConfig.axis === "x" ? 180 * interactionConfig.dir : 0,
          rotateY: isFlipped && interactionConfig.axis === "y" ? 180 * interactionConfig.dir : 0,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
      >
        {/* Front Face */}
        <div className="w-full h-full rounded-2xl border border-border bg-card p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 group [backface-visibility:hidden]">
          <div>
            <div className="flex items-start justify-between gap-3">
              <Link
                to={app.to}
                className="flex items-center gap-3.5 group/header min-w-0 flex-1 outline-none"
              >
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center text-white shadow-xs shrink-0 ${cardGradient} group-hover/header:scale-105 transition-transform`}
                >
                  <Icon className="h-6 w-6 opacity-90 drop-shadow-sm" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-base text-foreground group-hover/header:text-primary transition-colors truncate">
                    {app.title}
                  </h4>
                </div>
              </Link>

              <CardMoreMenu
                title={app.title}
                isFav={isFav}
                onToggleFavorite={() => toggleFavorite(app.to)}
                moveData={{
                  cardKey: makeMovedCardKey(currentPageId, app.to, app.title),
                  originPageId: currentPageId,
                  currentPageId,
                  to: app.to,
                  badge: app.categoryLabel || app.badge,
                  shortDesc: app.subtitle,
                  gradient: cardGradient,
                  icon: app.icon,
                  features: app.features.map((f) => ({
                    title: f.title,
                    to: f.to,
                    desc: f.desc,
                  })),
                }}
              />
            </div>

            <div className="mt-3 pt-1">
              <span className="text-[10px] font-bold tracking-wider text-muted-foreground block mb-2 text-center">
                {app.categoryLabel || app.badge || "Kategori"} ({app.features.length}):
              </span>

              <div className="flex flex-wrap justify-center gap-1.5 max-h-[195px] overflow-y-auto pr-0.5 [scrollbar-width:thin]">
                {app.features.map((feat, idx) => {
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
                      title={feat.desc || feat.title}
                      className="min-w-[calc((100%-0.75rem)/3)] max-w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary text-[11px] font-medium text-foreground transition-all cursor-pointer border border-border/40 hover:border-primary/30 group/chip"
                    >
                      <FeatIcon size={12} className="text-primary shrink-0 group-hover/chip:scale-110 transition-transform" />
                      <span className="text-center leading-snug whitespace-normal">{feat.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-end text-xs">
            <button
              type="button"
              onClick={handleFlip}
              className="px-2.5 py-1 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs group/btn"
              title="Lihat Related"
            >
              <span className="text-[11px]">Related</span>
              <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Back Face (Warna icon app + tombol kembali di ujung bawah kanan) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl ${cardGradient} p-4 shadow-lg border border-white/20 flex flex-col justify-end items-end overflow-hidden [backface-visibility:hidden]`}
          style={{
            transform:
              interactionConfig.axis === "x"
                ? `rotateX(${180 * interactionConfig.dir}deg)`
                : `rotateY(${180 * interactionConfig.dir}deg)`,
          }}
        >
          <button
            type="button"
            onClick={handleFlip}
            className={kembaliBtnClass}
            title="Kembali"
          >
            <RotateCcw size={12} className="shrink-0" />
            <span className="text-[11px] font-medium">Kembali</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const ValueTreatedFlipCard = ({
  app,
  isFav,
  toggleFavorite,
}: {
  app: ValueTreatedAppDef;
  isFav: boolean;
  toggleFavorite: (to: string) => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const kembaliBtnClass = useKembaliButtonClass();
  const currentPageId = useCurrentLauncherPage("valuetreated") || "valuetreated";
  const { isCardMovedOut } = useCardPageMover();
  const [interactionConfig, setInteractionConfig] = useState(() => ({
    axis: Math.random() > 0.5 ? "x" : "y",
    dir: Math.random() > 0.5 ? 1 : -1,
  }));

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInteractionConfig((prev) => {
      let nextAxis = prev.axis;
      let nextDir = prev.dir;
      while (nextAxis === prev.axis && nextDir === prev.dir) {
        nextAxis = Math.random() > 0.5 ? "x" : "y";
        nextDir = Math.random() > 0.5 ? 1 : -1;
      }
      return { axis: nextAxis, dir: nextDir };
    });
    setIsFlipped((prev) => !prev);
  };

  const Icon = app.icon;
  const initialCount = 6;
  const displayFeatures = isExpanded
    ? app.features
    : app.features?.slice(0, initialCount);
  const hasMore = (app.features?.length || 0) > initialCount;

  if (isCardMovedOut(currentPageId, app.to, app.title)) {
    return null;
  }

  return (
    <div className="w-full [perspective:1000px] min-h-[220px]">
      <motion.div
        className="relative w-full h-full min-h-[220px] [transform-style:preserve-3d]"
        animate={{
          rotateX: isFlipped && interactionConfig.axis === "x" ? 180 * interactionConfig.dir : 0,
          rotateY: isFlipped && interactionConfig.axis === "y" ? 180 * interactionConfig.dir : 0,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
      >
        {/* Front Face */}
        <div className="w-full h-full rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group [backface-visibility:hidden]">
          <div>
            <div className="flex items-start justify-between gap-3">
              <Link
                to={app.to}
                className="flex items-center gap-3 group/header min-w-0 flex-1 outline-none"
              >
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center text-white shadow-xs shrink-0 ${app.gradient} group-hover/header:scale-105 transition-transform`}
                >
                  <Icon className="h-5 w-5 opacity-90 drop-shadow-sm" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-base text-foreground group-hover/header:text-primary transition-colors truncate">
                    {app.title}
                  </h4>
                  <span className="text-[11px] text-muted-foreground truncate block mt-0.5">
                    {app.subtitle.split("•")[0]?.trim()}
                  </span>
                </div>
              </Link>

              <CardMoreMenu
                title={app.title}
                isFav={isFav}
                onToggleFavorite={() => toggleFavorite(app.to)}
                moveData={{
                  cardKey: makeMovedCardKey(currentPageId, app.to, app.title),
                  originPageId: currentPageId,
                  currentPageId,
                  to: app.to,
                  badge: app.categoryLabel,
                  shortDesc: app.subtitle,
                  gradient: app.gradient,
                  icon: app.icon,
                  features: app.features?.map((f) => ({
                    title: f.title,
                    to: f.to,
                  })),
                }}
              />
            </div>

            <div className="mt-3 pt-2.5 border-t border-border/60">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
                  {app.categoryLabel || "Kategori"} ({app.features.length}):
                </span>
                {hasMore && (
                  <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="text-[10px] font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp size={11} />
                        <span>Ringkas</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown size={11} />
                        <span>+{app.features.length - initialCount} Semua</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              <div className="max-h-[140px] overflow-y-auto no-scrollbar pr-0.5">
                <div className="flex flex-wrap justify-center gap-1.5">
                  {displayFeatures?.map((feat, idx) => {
                    const FeatIcon = feat.icon;

                    return (
                      <Link
                        key={idx}
                        to={feat.to}
                        title={feat.title}
                        className="min-w-[calc((100%-0.75rem)/3)] max-w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary text-[11px] font-medium text-foreground transition-all cursor-pointer border border-border/40 hover:border-primary/30 group/chip"
                      >
                        <FeatIcon size={12} className="text-primary shrink-0 group-hover/chip:scale-110 transition-transform" />
                        <span className="text-center leading-snug whitespace-normal">{feat.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-3 flex items-center justify-end text-xs">
            <button
              type="button"
              onClick={handleFlip}
              className="px-2.5 py-1 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs group/btn"
              title="Lihat Related"
            >
              <span className="text-[11px]">Related</span>
              <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Back Face (Warna icon app + tombol kembali di ujung bawah kanan) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl ${app.gradient} p-4 shadow-lg border border-white/20 flex flex-col justify-end items-end overflow-hidden [backface-visibility:hidden]`}
          style={{
            transform:
              interactionConfig.axis === "x"
                ? `rotateX(${180 * interactionConfig.dir}deg)`
                : `rotateY(${180 * interactionConfig.dir}deg)`,
          }}
        >
          <button
            type="button"
            onClick={handleFlip}
            className={kembaliBtnClass}
            title="Kembali"
          >
            <RotateCcw size={12} className="shrink-0" />
            <span className="text-[11px] font-medium">Kembali</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface Tools100SectionProps {
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

export function Tools100Section({
  favorites,
  toggleFavorite,
  getGradient,
}: Tools100SectionProps) {
  const [activePillar, setActivePillar] = useState<string>("all");
  const pageId = useCurrentLauncherPage("mode_business") || "mode_business";
  const { getPageCountDelta } = useCardPageMover();
  const filteredApps = STANDALONE_MBA_APPS;

  const totalFeatures = useMemo(() => {
    return STANDALONE_MBA_APPS.reduce((acc, app) => acc + app.features.length, 0);
  }, []);

  const pillarHeaderItems = useMemo(
    () =>
      adjustCategoryTabsCount(
        [
          { id: "all", label: "Semua", count: STANDALONE_MBA_APPS.length },
          ...MBA_PILLARS.map((p) => ({
            id: p.id,
            label: p.name,
            count: p.categories.length,
          })),
        ],
        getPageCountDelta(pageId)
      ),
    [getPageCountDelta, pageId]
  );

  return (
    <LauncherPageProvider pageId={pageId}>
      <ShellHeader>
        <HeaderNavPills
          items={pillarHeaderItems}
          activeId={activePillar}
          onSelect={(id) => setActivePillar(id)}
        />
      </ShellHeader>
      <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-6">
        {activePillar === "all" ? (
          <>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
              <Layers className="size-7 text-primary" />
              <span>8 Pilar Strategis & MBA Tools</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl mx-auto">
              Seluruh 100 instrumen analisis, framework Mini MBA, dan kanvas strategis yang dilebur ke dalam <strong>8 Pilar Utama</strong> ({totalFeatures} instrumen).
            </p>
          </>
        ) : (
          (() => {
            const currentPillar = MBA_PILLARS.find((p) => p.id === activePillar);
            const PillarIcon = currentPillar ? getPillarIcon(currentPillar.name) : Compass;
            return (
              <>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
                  <PillarIcon className="size-7 text-primary" />
                  <span>Pilar {currentPillar?.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl mx-auto">
                  {currentPillar?.description}
                </p>
              </>
            );
          })()
        )}
      </div>

      {/* Kategori Atas: 8 Pilar MBA */}
      <div className="w-full flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar flex-nowrap sm:flex-wrap px-2">
        {/* Tab Semua Pilar */}
        <button
          type="button"
          onClick={() => setActivePillar("all")}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
            activePillar === "all"
              ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/25 scale-105"
              : "bg-card border border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Layers className="size-3.5 shrink-0" />
          <span>Semua</span>
        </button>

        {/* 8 Pilar MBA */}
        {MBA_PILLARS.map((pillar) => {
          const PillarIcon = getPillarIcon(pillar.name);
          const isActive = activePillar === pillar.id;
          const count = pillar.categories.length;

          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => setActivePillar(pillar.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer whitespace-nowrap flex items-center gap-2 shrink-0 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/25 scale-105"
                  : "bg-card border border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <PillarIcon size={14} className={isActive ? "text-primary-foreground" : "text-primary"} />
              <span>{pillar.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Konten Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(activePillar === "all"
          ? filteredApps
          : filteredApps.filter((a) => {
              const selectedPillar = MBA_PILLARS.find((p) => p.id === activePillar);
              return a.pillar === selectedPillar?.name;
            })
        ).map((app) => (
          <ToolsFlipCard
            key={app.id}
            app={app}
            isFav={favorites.includes(app.to)}
            toggleFavorite={toggleFavorite}
            gradient={getGradient(app.title)}
          />
        ))}
        {activePillar === "all" && <MovedCardsGridItems pageId={pageId} />}
      </div>
    </div>
    </LauncherPageProvider>
  );
}
