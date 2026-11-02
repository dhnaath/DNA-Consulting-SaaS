import React from "react";
import {
  AlertOctagon,
  ShieldCheck,
  Target,
  Workflow,
  Layers,
  Building2,
  Building,
  ShoppingBag,
  Clock,
  PieChart,
  CheckCircle2,
  Sparkles,
  Dumbbell,
  Moon,
  Truck,
  Boxes,
  Users,
  Headset,
  Filter,
  DollarSign,
  Brain,
  Archive,
  GraduationCap,
  BookOpen,
  Lightbulb,
  PenTool,
  Code,
  Utensils,
  CheckSquare,
  Car,
  Plane,
  Film,
  Home,
  HeartPulse,
  Landmark,
  HeartHandshake,
  HandHeart,
  UserPlus,
  Calendar,
  Lock,
  KeyRound,
  FileText,
  Repeat,
  PiggyBank,
  ShieldAlert,
  ListChecks,
  Wrench,
  Sprout,
  Award,
  Activity,
  FileHeart,
  Heart,
  HelpCircle,
  FileCheck,
  CalendarDays,
  Radio,
  TrendingUp,
  BarChart3,
  BookMarked,
  Compass,
  Wallet,
  CreditCard,
  Droplet,
  Timer,
  Briefcase,
  Store,
  Terminal,
  LayoutDashboard,
  Coins,
  Package,
  Megaphone,
  Zap,
  Cpu,
  Share2,
  Gift,
  Cake,
  Flower2,
  MessageSquare,
  Receipt,
  type LucideIcon,
} from "lucide-react";
import { navKonsultan } from "@/config/nav";
import { STANDALONE_APPS } from "@/features/standalone/standaloneAppsData";

export interface AppMeta {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  to: string;
  accentGradient?: string;
  iconColor?: string;
  bgColor?: string;
}

// Master dictionary of known apps across all 6 Workspaces & PEH
const KNOWN_WORKSPACE_APPS: AppMeta[] = [
  // 1. Work and Productivity (9 Modul)
  {
    id: "milestones",
    to: "/peh/milestones",
    label: "Goals & Milestones",
    icon: Target,
    accentGradient: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "workflows",
    to: "/peh/workflows",
    label: "Workflow & Delivery Pipeline",
    icon: Workflow,
    accentGradient: "from-indigo-500 to-violet-600",
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: "content-pipeline",
    to: "/peh/projects",
    label: "Content Production Pipeline",
    icon: Layers,
    accentGradient: "from-cyan-500 to-blue-600",
    iconColor: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
  },
  {
    id: "vendors",
    to: "/peh/vendors",
    label: "Vendor & Service Management",
    icon: Building2,
    accentGradient: "from-amber-500 to-orange-600",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "procurement",
    to: "/peh/procurement",
    label: "Procurement & Purchase Orders",
    icon: ShoppingBag,
    accentGradient: "from-orange-500 to-red-600",
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "compliance",
    to: "/peh/compliance",
    label: "Compliance & Regulatory Audit",
    icon: ShieldCheck,
    accentGradient: "from-teal-500 to-emerald-600",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "incidents",
    to: "/peh/incidents",
    label: "Issues & Incident Management",
    icon: AlertOctagon,
    accentGradient: "from-rose-500 to-red-600",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    id: "time-audit",
    to: "/peh/time-audit",
    label: "Audit Waktu & Efisiensi",
    icon: Clock,
    accentGradient: "from-emerald-500 to-teal-600",
    iconColor: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    id: "cap-table",
    to: "/peh/cap-table",
    label: "Equity & Cap Table",
    icon: PieChart,
    accentGradient: "from-purple-500 to-indigo-600",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },

  // 2. Personal Life (5 Modul)
  {
    id: "habits",
    to: "/peh/habits",
    label: "Habit & Rutinitas",
    icon: CheckCircle2,
    accentGradient: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "journal",
    to: "/peh/journal",
    label: "Jurnal & Mood",
    icon: Sparkles,
    accentGradient: "from-purple-500 to-pink-600",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "goals",
    to: "/peh/goals",
    label: "Target & Milestone Hidup",
    icon: Target,
    accentGradient: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "fitness",
    to: "/peh/fitness",
    label: "Latihan & Olahraga",
    icon: Dumbbell,
    accentGradient: "from-rose-500 to-orange-600",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    id: "sleep",
    to: "/peh/sleep",
    label: "Tidur & Pemulihan",
    icon: Moon,
    accentGradient: "from-indigo-500 to-sky-600",
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },

  // 3. Business Operations & Customers (7 Modul)
  {
    id: "supply-chain",
    to: "/peh/supply-chain",
    label: "Rantai Pasok & Distribusi",
    icon: Truck,
    accentGradient: "from-amber-500 to-orange-600",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "inventory",
    to: "/peh/inventory",
    label: "Manajemen Inventaris",
    icon: Boxes,
    accentGradient: "from-orange-500 to-amber-600",
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    id: "crm",
    to: "/peh/crm",
    label: "Manajemen Pelanggan (CRM)",
    icon: Users,
    accentGradient: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "customer-service",
    to: "/peh/customer-service",
    label: "Layanan & Bantuan CS",
    icon: Headset,
    accentGradient: "from-sky-500 to-cyan-600",
    iconColor: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    id: "marketing-funnel",
    to: "/peh/marketing-funnel",
    label: "Corong Penjualan & Konversi",
    icon: Filter,
    accentGradient: "from-violet-500 to-purple-600",
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "assets",
    to: "/peh/assets",
    label: "Tata Kelola Aset & Fasilitas",
    icon: Building,
    accentGradient: "from-rose-500 to-pink-600",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    id: "expenses",
    to: "/peh/expenses",
    label: "Kontrol Beban & Pengeluaran",
    icon: DollarSign,
    accentGradient: "from-red-500 to-rose-600",
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
  },

  // 4. Knowledge & Learning (7 Modul)
  {
    id: "second-brain",
    to: "/peh/second-brain",
    label: "Second Brain & Catatan",
    icon: Brain,
    accentGradient: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "documents",
    to: "/peh/documents",
    label: "Brankas Dokumen & Arsip",
    icon: Archive,
    accentGradient: "from-indigo-500 to-cyan-600",
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: "curriculum",
    to: "/peh/curriculum",
    label: "Akselerasi Belajar & Studi",
    icon: GraduationCap,
    accentGradient: "from-violet-500 to-indigo-600",
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "reading",
    to: "/peh/reading",
    label: "Daftar Bacaan & Ringkasan",
    icon: BookOpen,
    accentGradient: "from-purple-500 to-pink-600",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "idea-lab",
    to: "/peh/idea-lab",
    label: "Laboratorium Ide & Konsep",
    icon: Lightbulb,
    accentGradient: "from-amber-500 to-yellow-600",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "writer-studio",
    to: "/peh/writer-studio",
    label: "Studio Penulis & Naskah",
    icon: PenTool,
    accentGradient: "from-rose-500 to-pink-600",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    id: "code-snippet",
    to: "/peh/code-snippet",
    label: "Repositori Kode & Snippet",
    icon: Code,
    accentGradient: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },

  // 5. Home & Leisure (6 Modul)
  {
    id: "pantry",
    to: "/peh/pantry",
    label: "Logistik Dapur & Bahan",
    icon: Utensils,
    accentGradient: "from-amber-500 to-orange-600",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "chores",
    to: "/peh/chores",
    label: "Jadwal & Tugas Hunian",
    icon: CheckSquare,
    accentGradient: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "vehicles",
    to: "/peh/vehicles",
    label: "Armada Kendaraan",
    icon: Car,
    accentGradient: "from-blue-500 to-indigo-600",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "travel-planner",
    to: "/peh/travel-planner",
    label: "Perencana Liburan & Wisata",
    icon: Plane,
    accentGradient: "from-sky-500 to-cyan-600",
    iconColor: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    id: "media-hub",
    to: "/peh/media-hub",
    label: "Koleksi Media & Hiburan",
    icon: Film,
    accentGradient: "from-purple-500 to-violet-600",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "smart-home",
    to: "/peh/smart-home",
    label: "Otomasi Rumah Pintar",
    icon: Home,
    accentGradient: "from-teal-500 to-emerald-600",
    iconColor: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },

  // 6. Family & Community (9 Modul)
  {
    id: "family-tree",
    to: "/peh/family-tree",
    label: "Silsilah Keluarga & Kerabat",
    icon: Users,
    accentGradient: "from-rose-500 to-pink-600",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  {
    id: "family-health",
    to: "/peh/family-health",
    label: "Rekam Kesehatan Domestik",
    icon: HeartPulse,
    accentGradient: "from-red-500 to-rose-600",
    iconColor: "text-red-500",
    bgColor: "bg-red-500/10",
  },
  {
    id: "traditions",
    to: "/peh/traditions",
    label: "Tradisi & Momen Bersama",
    icon: Sparkles,
    accentGradient: "from-amber-500 to-yellow-600",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "neighborhood",
    to: "/peh/neighborhood",
    label: "Lingkungan Warga RT/RW",
    icon: Building,
    accentGradient: "from-teal-500 to-emerald-600",
    iconColor: "text-teal-500",
    bgColor: "bg-teal-500/10",
  },
  {
    id: "civic",
    to: "/peh/civic",
    label: "Layanan Sipil & Administrasi",
    icon: Landmark,
    accentGradient: "from-indigo-500 to-blue-600",
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    id: "volunteering",
    to: "/peh/volunteering",
    label: "Aksi Relawan & Bakti Sosial",
    icon: HeartHandshake,
    accentGradient: "from-sky-500 to-teal-600",
    iconColor: "text-sky-500",
    bgColor: "bg-sky-500/10",
  },
  {
    id: "charity",
    to: "/peh/charity",
    label: "Zakat, Infaq & Donasi",
    icon: HandHeart,
    accentGradient: "from-emerald-500 to-green-600",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "introductions",
    to: "/peh/introductions",
    label: "Jejaring Silaturahmi",
    icon: UserPlus,
    accentGradient: "from-violet-500 to-purple-600",
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    id: "community-events",
    to: "/peh/community-events",
    label: "Agenda Pertemuan Warga",
    icon: Calendar,
    accentGradient: "from-blue-500 to-cyan-600",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },

  // Additional Core PEH apps
  { id: "vault", to: "/peh/vault", label: "Brankas Sandi & Kunci", icon: KeyRound, iconColor: "text-amber-500" },
  { id: "subscriptions", to: "/peh/subscriptions", label: "Langganan & Tagihan", icon: CreditCard, iconColor: "text-blue-500" },
  { id: "budget", to: "/peh/budget", label: "Anggaran & Kas Harian", icon: Wallet, iconColor: "text-emerald-500" },
  { id: "insurance", to: "/peh/insurance", label: "Polis Asuransi & Proteksi", icon: ShieldCheck, iconColor: "text-teal-500" },
  { id: "maintenance", to: "/peh/maintenance", label: "Perawatan & Servis", icon: Wrench, iconColor: "text-amber-500" },
  { id: "plants", to: "/peh/plants", label: "Tanaman & Kebun", icon: Flower2, iconColor: "text-emerald-500" },
  { id: "contacts", to: "/peh/contacts", label: "Jejaring & Relasi (CRM)", icon: Users, iconColor: "text-blue-500" },
  { id: "gifts", to: "/peh/gifts", label: "Inspirasi Hadiah & Budi", icon: Gift, iconColor: "text-rose-500" },
  { id: "mentorship", to: "/peh/mentorship", label: "Mentor & Bimbingan", icon: Compass, iconColor: "text-indigo-500" },
  { id: "family-recipes", to: "/peh/family-recipes", label: "Resep Warisan Keluarga", icon: Utensils, iconColor: "text-orange-500" },
  { id: "family-budget", to: "/peh/family-budget", label: "Tabungan & Kas Keluarga", icon: PiggyBank, iconColor: "text-emerald-500" },
  { id: "pet-care", to: "/peh/pet-care", label: "Hewan Peliharaan & Anabul", icon: Heart, iconColor: "text-pink-500" },
  { id: "advocacy", to: "/peh/advocacy", label: "Aspirasi & Fasum Warga", icon: Megaphone, iconColor: "text-sky-500" },
  { id: "tasks", to: "/peh/tasks", label: "Tugas & Deep Work", icon: CheckSquare, iconColor: "text-blue-500" },
  { id: "knowledge", to: "/peh/knowledge", label: "Pustaka SOP & Playbook", icon: BookOpen, iconColor: "text-indigo-500" },
  { id: "meetings", to: "/peh/meetings", label: "Meetings & Decision Log", icon: FileCheck, iconColor: "text-teal-500" },
  { id: "ip-licenses", to: "/peh/ip-licenses", label: "Hak Cipta & Lisensi IP", icon: Award, iconColor: "text-purple-500" },
  { id: "investments", to: "/peh/investments", label: "Portofolio Investasi", icon: TrendingUp, iconColor: "text-emerald-500" },
  { id: "real-estate", to: "/peh/real-estate", label: "Aset Properti & Tanah", icon: Building, iconColor: "text-amber-500" },

  // Hub and Root pages
  { id: "launcher", to: "/", label: "Launcher", icon: LayoutDashboard },
  { id: "home", to: "/home", label: "Beranda", icon: Home },
  { id: "terminal", to: "/terminal", label: "Terminal Eksekutif", icon: Terminal },
  { id: "work-productivity", to: "/work-productivity", label: "Productivity Workspace and Workflow Systems", icon: Briefcase },
  { id: "personal-life", to: "/personal-life", label: "Personal Life", icon: Heart },
  { id: "business-operations", to: "/business-operations", label: "Business Operations", icon: Store },
  { id: "knowledge-learning", to: "/knowledge-and-learning", label: "Knowledge and Learning", icon: GraduationCap },
  { id: "home-leisure", to: "/home-leisure", label: "Home and Leisure", icon: Home },
  { id: "family-community", to: "/family-community", label: "Family and Community", icon: Users },
  { id: "tools100", to: "/tools100", label: "100 MBA Tools", icon: Layers },
  { id: "commodity", to: "/commodity", label: "Market Price Monitor", icon: Package },
];

/**
 * Resolves any route path or ID to its proper application metadata
 * (exact matching icon, label, and accent colors).
 */
export function getAppMetaByRoute(routeOrId: string): AppMeta {
  if (!routeOrId) {
    return { id: "unknown", label: "Aplikasi", icon: Target, to: "/" };
  }

  const clean = routeOrId.trim();
  const pathOnly = clean.split("?")[0].replace(/\/+$/, "") || "/";
  const slug = pathOnly.replace(/^\//, "");
  const queryString = clean.includes("?") ? clean.split("?")[1] : "";
  const appParam = queryString ? new URLSearchParams(queryString).get("app") : null;

  // 0. Check ?app=<id> standalone routes first so they don't fall back to generic "/lainnya"
  if (appParam && STANDALONE_APPS[appParam]) {
    const sa = STANDALONE_APPS[appParam];
    return {
      id: clean,
      label: sa.title,
      icon: sa.icon || Target,
      to: clean,
      accentGradient: sa.colorScheme,
      iconColor: "text-primary",
    };
  }

  // 1. Direct match in KNOWN_WORKSPACE_APPS
  const foundDirect = KNOWN_WORKSPACE_APPS.find(
    (app) => app.to === pathOnly || app.to === clean || app.id === slug || app.id === clean
  );
  if (foundDirect) {
    return foundDirect;
  }

  // 2. Search navKonsultan
  const allNavItems = navKonsultan.flatMap((group) => group.items);
  const foundNav = allNavItems.find(
    (item) => item.to === pathOnly || item.to === clean || (item.to !== "/" && pathOnly.startsWith(item.to))
  );
  if (foundNav) {
    return {
      id: foundNav.to,
      label: foundNav.label,
      icon: foundNav.icon as any,
      to: foundNav.to,
      iconColor: "text-primary",
    };
  }

  // 3. Search STANDALONE_APPS
  const foundStandalone = STANDALONE_APPS[slug];
  if (foundStandalone) {
    return {
      id: clean,
      label: foundStandalone.title,
      icon: foundStandalone.icon || Target,
      to: clean,
      accentGradient: foundStandalone.colorScheme,
      iconColor: "text-primary",
    };
  }

  // 4. Check for /framework/ or MBA tools
  if (pathOnly.startsWith("/framework/") || pathOnly.startsWith("/matriks/")) {
    const fwSlug = pathOnly.split("/").pop() || "";
    const cleanLabel = fwSlug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      id: clean,
      label: cleanLabel || "Framework MBA",
      icon: Layers,
      to: clean,
      iconColor: "text-indigo-500",
    };
  }

  // 5. Intelligent keyword detection for icon matching
  const lower = clean.toLowerCase();
  let DetectedIcon: any = Target;
  let detectedColor = "text-primary";

  if (lower.includes("incident") || lower.includes("masalah")) {
    DetectedIcon = AlertOctagon;
    detectedColor = "text-rose-500";
  } else if (lower.includes("compliance") || lower.includes("kepatuhan")) {
    DetectedIcon = ShieldCheck;
    detectedColor = "text-emerald-500";
  } else if (lower.includes("milestone") || lower.includes("goal") || lower.includes("target")) {
    DetectedIcon = Target;
    detectedColor = "text-blue-500";
  } else if (lower.includes("workflow") || lower.includes("pipeline")) {
    DetectedIcon = Workflow;
    detectedColor = "text-indigo-500";
  } else if (lower.includes("project") || lower.includes("content")) {
    DetectedIcon = Layers;
    detectedColor = "text-cyan-500";
  } else if (lower.includes("vendor") || lower.includes("mitra")) {
    DetectedIcon = Building2;
    detectedColor = "text-amber-500";
  } else if (lower.includes("procurement") || lower.includes("purchase")) {
    DetectedIcon = ShoppingBag;
    detectedColor = "text-orange-500";
  } else if (lower.includes("time") || lower.includes("clock")) {
    DetectedIcon = Clock;
    detectedColor = "text-teal-500";
  } else if (lower.includes("habit") || lower.includes("rutin")) {
    DetectedIcon = CheckCircle2;
    detectedColor = "text-emerald-500";
  } else if (lower.includes("journal") || lower.includes("mood")) {
    DetectedIcon = Sparkles;
    detectedColor = "text-purple-500";
  } else if (lower.includes("fitness") || lower.includes("olahraga")) {
    DetectedIcon = Dumbbell;
    detectedColor = "text-rose-500";
  } else if (lower.includes("sleep") || lower.includes("tidur")) {
    DetectedIcon = Moon;
    detectedColor = "text-indigo-500";
  } else if (lower.includes("finance") || lower.includes("budget") || lower.includes("money") || lower.includes("expense")) {
    DetectedIcon = DollarSign;
    detectedColor = "text-emerald-500";
  } else if (lower.includes("cap-table") || lower.includes("saham")) {
    DetectedIcon = PieChart;
    detectedColor = "text-purple-500";
  } else if (lower.includes("document") || lower.includes("arsip") || lower.includes("vault")) {
    DetectedIcon = Archive;
    detectedColor = "text-indigo-500";
  } else if (lower.includes("study") || lower.includes("curriculum") || lower.includes("belajar")) {
    DetectedIcon = GraduationCap;
    detectedColor = "text-violet-500";
  } else if (lower.includes("family") || lower.includes("keluarga") || lower.includes("kerabat")) {
    DetectedIcon = Users;
    detectedColor = "text-rose-500";
  }

  const cleanLabel = slug
    .replace(/^peh\//, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: clean,
    label: cleanLabel || "Aplikasi Favorit",
    icon: DetectedIcon,
    to: clean,
    iconColor: detectedColor,
  };
}
