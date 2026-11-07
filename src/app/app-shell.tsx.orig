import { AppDock } from "./shell/app-dock";
import { ShellSidebarProvider } from "./shell-sidebar";
import { ShellHeaderProvider } from "./shell-header";
import { SidebarPillarsMenu } from "./shell/SidebarPillarsMenu";
import {
  ShellSectionsProvider,
  type ShellSection,
} from "./shell-sections";
import { TypewriterSearchText } from "./shell/TypewriterSearchText";
import { AnimatedSearchIcon } from "./shell/AnimatedSearchIcon";
import {
  WindowPositionLeftIcon,
  WindowPositionRightIcon,
} from "@/components/icons/WindowPositionIcons";
import { useState, useEffect, useMemo, useRef, useCallback, useLayoutEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Scale,
  FileCheck,
  Coins,
  ShieldCheck,
  LayoutDashboard,
  Terminal,
  Users,
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  NotebookText,
  CalendarDays,
  Compass,
  MessagesSquare,
  Activity,
  HeartHandshake,
  Navigation,
  Menu,
  Building,
  TrendingUp,
  Package,
  Grid2X2,
  MoreHorizontal,
  MoreVertical,
  Star,
  User,
  Settings,
  Wallet,
  ChevronRight,
  Timer,
  Clock,
  Flame,
  Dumbbell,
  Key,
  Calculator,
  Briefcase,
  Target,
  BookOpen,
  Lightbulb,
  Utensils,
  Coffee,
  CloudSun,
  Plane,
  ShoppingCart,
  Heart,
  HeartPulse,
  Archive,
  GraduationCap,
  Globe,
  Ticket,
  PenTool,
  DollarSign,
  Building2,
  Store,
  Receipt,
  LineChart,
  Search,
  Bell,
  Truck,
  Home,
  Crown,
  Sofa,
  Palette,
  Car,
  Fuel,
  Film,
  GitFork,
  ShieldAlert,
  FileCode2,
  FileText,
  Code,
  LayoutGrid,
  Wrench,
  Pocket,
  ShoppingBag,
  Vault,
  Luggage,
  Landmark,
  ChevronDown,
  Camera,
  Layers,
  Workflow,
  Sparkles,
  Eye,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { CommandPalette } from "@/app/CommandPalette";
import { QuickCaptureModal } from "@/app/QuickCaptureModal";
import { ShortcutModal } from "@/app/ShortcutModal";
import { TerminalModal } from "@/app/TerminalModal";
import { RecentModal } from "@/app/RecentModal";
import { TaskbarModal } from "@/app/TaskbarModal";
import { useRecentApps } from "@/hooks/useRecentApps";
import { recordActiveApp } from "@/utils/launcherCategoryMapper";
import { SettingsModal } from "./wira-settings";
import { TopPanelControlHub } from "./shell/TopPanelControlHub";
import { useMenuSettings } from "@/hooks/useMenuSettings";
import { useFavorites } from "@/hooks/useFavorites";
import { HeaderNavControls } from "./HeaderNavControls";
import { useCustomNav } from "@/hooks/useCustomNav";
import { navKonsultan, navAllSidebar, type NavItem, type NavGroup as NavGroupType } from "@/config/nav";
import { ProgressiveBlur } from "@/components/ProgressiveBlur";
import { useProgressiveBlurSetting } from "@/hooks/useProgressiveBlurSetting";
import { useDockStore } from "@/hooks/useDockState";
import { useLiquidGlassSetting } from "@/hooks/useLiquidGlassSetting";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getAppMetaByRoute } from "@/utils/appLookup";
import {
  BIZ_OPS_SUMMARY_DESC,
  BIZ_OPS_TOTAL_BADGE,
} from "@/features/business-operations/BusinessOperationsCustomersPage";
import { getRaw, setRaw, removeRaw } from "../core/rawStorage";


export type AppModeId =
  | "financial"
  | "business"
  | "employment"
  | "creative"
  | "research"
  | "sharia"
  | "personal"
  | "family"
  | "public_affairs"
  | "networks"
  | "phase_side";

export interface ModeItem {
  id: AppModeId;
  label: string;
  badge: string;
  desc: string;
  icon: LucideIcon;
  badgeClass: string;
  links: { to: string; label: string; icon: LucideIcon }[];
}

export const APP_MODES: ModeItem[] = [
  {
    id: "financial",
    label: "Financial Planning and Wealth Management",
    badge: "25 Modul",
    desc: "Semua (25) · Surety (5) · Flow (5) · Build (5) · Grow (5) · Legacy (5)",
    icon: Coins,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    links: [
      { to: "/financial-planning", label: "Financial Planning Hub", icon: Coins },
      { to: "/surety", label: "Tahap 1: Surety & Kepatuhan", icon: ShieldCheck },
      { to: "/flow", label: "Tahap 2: Flow & Cashflow", icon: Wallet },
      { to: "/build", label: "Tahap 3: Build & Portofolio", icon: Building },
      { to: "/grow", label: "Tahap 4: Grow & Wealth Asset", icon: TrendingUp },
      { to: "/legacy", label: "Tahap 5: Legacy & Suksesi", icon: BookOpen },
      { to: "/asset", label: "Kuadran Aset", icon: Briefcase },
      { to: "/earning", label: "Kuadran Pendapatan", icon: DollarSign },
      { to: "/liability", label: "Kuadran Liabilitas", icon: Receipt },
      { to: "/expense", label: "Kuadran Pengeluaran", icon: ShoppingCart },
      { to: "/valuasi", label: "Valuasi Bisnis MAPPI", icon: Landmark },
    ],
  },
  {
    id: "business",
    label: "Business Administration and Operations Management",
    badge: BIZ_OPS_TOTAL_BADGE,
    desc: BIZ_OPS_SUMMARY_DESC,
    icon: Store,
    badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    links: [
      { to: "/business-operations", label: "Business Administration and Operations Management", icon: Store },
      { to: "/100-framework", label: "8 Pilar Strategis & 100 MBA Tools", icon: Grid2X2 },
      { to: "/peh/vendors", label: "Procurement", icon: Truck },
      { to: "/katalog-produk", label: "Inventory Management", icon: Package },
      { to: "/klien", label: "Client Management", icon: Briefcase },
      { to: "/portal", label: "Customer Relations", icon: MessagesSquare },
      { to: "/lainnya?app=queue-line", label: "Service Management", icon: Clock },
      { to: "/expense-tracker", label: "Expenses and Assets", icon: Receipt },
      { to: "/statistics", label: "Data Management", icon: LineChart },
    ],
  },
  {
    id: "employment",
    label: "Productivity Workspace and Workflow Systems",
    badge: "9 Modul",
    desc: "Semua (9) · Planning (1) · Workflow (2) · Resources (2) · Coordination (1) · Governance (2) · Ownership (1)",
    icon: Briefcase,
    badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    links: [
      { to: "/work-productivity", label: "Productivity Workspace Hub", icon: Briefcase },
      { to: "/peh/milestones", label: "Goals & Milestones", icon: Target },
      { to: "/peh/workflows", label: "Workflow & Delivery Pipeline", icon: CheckCircle2 },
      { to: "/peh/projects", label: "Content Production Pipeline", icon: FolderKanban },
      { to: "/peh/vendors", label: "Vendor & Service Management", icon: Building },
      { to: "/peh/procurement", label: "Procurement & Purchase Orders", icon: DollarSign },
      { to: "/peh/meetings", label: "Meetings & Decision Log", icon: CheckSquare },
      { to: "/peh/incidents", label: "Issues & Incident Management", icon: ShieldAlert },
      { to: "/peh/compliance", label: "Compliance & Regulatory Audit", icon: ShieldCheck },
      { to: "/peh/cap-table", label: "Equity & Cap Table", icon: LayoutGrid },
    ],
  },
  {
    id: "creative",
    label: "Creative Workspace and Media Production",
    badge: "6 Modul",
    desc: "Semua (6) · Studio (2) · Publishing (1) · Media (2) · Interactive (1)",
    icon: Palette,
    badgeClass: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    links: [
      { to: "/creative-workspace", label: "Creative Workspace Hub", icon: Palette },
      { to: "/design", label: "Design Management", icon: Palette },
      { to: "/movies", label: "Video Production", icon: Film },
      { to: "/writing", label: "Writing and Publishing", icon: PenTool },
      { to: "/podcasts", label: "Audio Production", icon: Activity },
      { to: "/photography", label: "Photography and Media", icon: Camera },
      { to: "/games", label: "Interactive Media", icon: Code },
    ],
  },
  {
    id: "research",
    label: "Research Foundations and Reference Frameworks",
    badge: "6 Modul",
    desc: "Semua (6) · Frameworks (2) · Reference (2) · Research (2)",
    icon: GraduationCap,
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    links: [
      { to: "/research-frameworks", label: "Research Frameworks Hub", icon: GraduationCap },
      { to: "/100-framework", label: "100 Strategic Frameworks", icon: Grid2X2 },
      { to: "/valuasi", label: "Business Valuation & MAPPI", icon: Building },
      { to: "/research-manager", label: "Research Intelligence", icon: Compass },
      { to: "/kurasi/bisnis", label: "Kurasi Pengetahuan Bisnis", icon: BookOpen },
      { to: "/knowledge-base", label: "Knowledge Base & Wiki", icon: NotebookText },
      { to: "/courses", label: "Academic Studies & Credentials", icon: GraduationCap },
    ],
  },
  {
    id: "sharia",
    label: "Islamic Principles and Sharia Values",
    badge: "16 Modul",
    desc: "Semua (16) · Sosial (3) · Komersial (5) · Proteksi (1) · Simpanan (1) · Zakat (3) · Investasi (1) · Kepatuhan (2)",
    icon: Scale,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    links: [
      { to: "/sharia-values", label: "Islamic Principles Hub", icon: Scale },
      { to: "/syariah/akad?app=tabarru", label: "Tabarru' & Hibah Manager", icon: HeartHandshake },
      { to: "/syariah/akad?app=mudharabah", label: "Mudharabah Bagi Hasil Usaha", icon: TrendingUp },
      { to: "/syariah/akad?app=musyarakah", label: "Musyarakah & Kemitraan Bersama", icon: Users },
      { to: "/syariah/akad?app=murabahah", label: "Murabahah & Margin Transparan", icon: Receipt },
      { to: "/syariah/akad?app=ijarah", label: "Ijarah & Sewa Jasa (IMBT)", icon: FileCheck },
      { to: "/zakat?app=maal", label: "Zakat Maal & Portofolio", icon: Coins },
      { to: "/zakat?app=profesi", label: "Zakat Profesi", icon: Wallet },
      { to: "/syariah/terlarang?app=riba", label: "Audit Bebas Riba & Gharar", icon: ShieldAlert },
      { to: "/100-komoditas?tab=syariah", label: "Saham Syariah & Pasar Halal", icon: ShieldCheck },
    ],
  },
  {
    id: "personal",
    label: "Personal Life Management",
    badge: "5 Modul",
    desc: "Semua (5) · Pengembangan (1) · Refleksi (1) · Kesehatan (2) · Utilitas (1)",
    icon: Heart,
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    links: [
      { to: "/personal-life", label: "Personal Life Hub", icon: Heart },
      { to: "/habit-tracker", label: "Personal Development", icon: Flame },
      { to: "/journal", label: "Personal Journaling", icon: BookOpen },
      { to: "/health?tab=workouts", label: "Health and Fitness", icon: Dumbbell },
      { to: "/health", label: "Health Records", icon: HeartPulse },
      { to: "/passwords", label: "Personal Tools", icon: Key },
    ],
  },
  {
    id: "family",
    label: "Family Records and Household Planning",
    badge: "6 Modul",
    desc: "Semua (6) · Keluarga (3) · Rumah Tangga (2) · Kendaraan (1)",
    icon: Home,
    badgeClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    links: [
      { to: "/family-records", label: "Family Records Hub", icon: Home },
      { to: "/peh/family-tree", label: "Family Heritage", icon: GitFork },
      { to: "/lainnya?app=emergency-hub", label: "Family Safety", icon: ShieldAlert },
      { to: "/peh/family-budget", label: "Household Finance", icon: Wallet },
      { to: "/peh/chores", label: "Household Management", icon: CheckSquare },
      { to: "/peh/pantry", label: "Kitchen Management", icon: Utensils },
      { to: "/peh/vehicles", label: "Vehicle Records", icon: Car },
    ],
  },
  {
    id: "public_affairs",
    label: "Public Affairs and Relations",
    badge: "6 Modul",
    desc: "Semua (6) · Civic (3) · Policy (2) · Media (1)",
    icon: Landmark,
    badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    links: [
      { to: "/public-affairs", label: "Public Relations Hub", icon: Landmark },
      { to: "/komunitas-warga", label: "Komunitas Warga & RT/RW", icon: Building },
      { to: "/lainnya?app=public-services-guide", label: "Layanan Publik & Tata Kelola", icon: Compass },
      { to: "/lainnya?app=civic-calendar", label: "Agenda Musyawarah Publik", icon: CalendarDays },
      { to: "/peh/advocacy", label: "Advokasi Kebijakan & Regulasi", icon: ShieldAlert },
      { to: "/peh/media", label: "Humas & Hubungan Media", icon: MessagesSquare },
      { to: "/zakat", label: "Zakat, Filantropi & Dampak", icon: Wallet },
    ],
  },
  {
    id: "networks",
    label: "Contact Directory and Social Networks",
    badge: "6 Modul",
    desc: "Semua (6) · Direktori (2) · Relasi (2) · Jaringan (2)",
    icon: Users,
    badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    links: [
      { to: "/social-networks", label: "Contact Directory Hub", icon: Users },
      { to: "/people-manager", label: "People Directory", icon: Users },
      { to: "/peh/contacts", label: "Contact Directory", icon: Key },
      { to: "/interaction-manager", label: "Relationship Management", icon: MessagesSquare },
      { to: "/peh/circle-groups", label: "Groups and Communities", icon: Users },
      { to: "/peh/mentorship", label: "Professional Networking", icon: Compass },
      { to: "/peh/gifts", label: "Celebrations and Gifts", icon: Star },
    ],
  },
  {
    id: "phase_side",
    label: "Phase: Mutual-Self-Organization",
    badge: "12 Modul",
    desc: "Self-Shaping (4) · Mutual-Mapping (4) · Organization-Optimizing (4)",
    icon: Compass,
    badgeClass: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    links: [
      { to: "/reliance", label: "Reliance (Kemandirian)", icon: ShieldCheck },
      { to: "/sufficient", label: "Sufficient (Kecukupan)", icon: CheckCircle2 },
      { to: "/improvement", label: "Improvement (Perbaikan)", icon: TrendingUp },
      { to: "/development", label: "Development (Pengembangan)", icon: Sparkles },
      { to: "/interact", label: "Interact (Interaksi Sosial)", icon: MessagesSquare },
      { to: "/interest", label: "Interest (Kepentingan Bersama)", icon: Heart },
      { to: "/intersect", label: "Intersect (Titik Temu)", icon: Layers },
      { to: "/interdependence", label: "Interdependence (Simbiosis)", icon: Workflow },
      { to: "/insider", label: "Insider (Tata Kelola Internal)", icon: Eye },
      { to: "/insight", label: "Insight (Wawasan Strategis)", icon: Lightbulb },
      { to: "/outward", label: "Outward (Dinamika Eksternal)", icon: Compass },
      { to: "/outlook", label: "Outlook (Prospek Masa Depan)", icon: TrendingUp },
    ],
  },
];

const CATEGORY_META: Record<string, { icon: LucideIcon; accent: string }> = {
  // Super Categories
  "21 Kategori": { icon: LayoutGrid, accent: "text-primary" },
  "100 Framework": { icon: Grid2X2, accent: "text-purple-600 dark:text-purple-400" },
  "Keuangan & Pasar": { icon: Wallet, accent: "text-emerald-600 dark:text-emerald-400" },
  "Kesehatan & Personal": { icon: Heart, accent: "text-rose-600 dark:text-rose-400" },
  "Kreatif & Akademi": { icon: PenTool, accent: "text-pink-600 dark:text-pink-400" },
  "Knowledge & Bisnis": { icon: BookOpen, accent: "text-sky-600 dark:text-sky-400" },

  // The 21 Categories
  "Dapur dan Bahan Makanan": { icon: Utensils, accent: "text-orange-500 dark:text-orange-400" },
  "Pemeliharaan Rumah dan Utilitas": { icon: Home, accent: "text-amber-600 dark:text-amber-400" },
  "Kendaraan dan Otomotif": { icon: Car, accent: "text-blue-600 dark:text-blue-400" },
  "Perjalanan": { icon: Plane, accent: "text-teal-600 dark:text-teal-400" },
  "Keluarga dan Internal Rumah": { icon: Heart, accent: "text-pink-600 dark:text-pink-400" },
  "Relasi Jejaring dan Profesional": { icon: Users, accent: "text-indigo-600 dark:text-indigo-400" },
  "Lingkungan Komunitas Warga": { icon: Building2, accent: "text-emerald-600 dark:text-emerald-400" },
  "Sosial dan Keagamaan": { icon: HeartHandshake, accent: "text-green-600 dark:text-green-400" },
  "Keselamatan dan Darurat": { icon: ShieldAlert, accent: "text-rose-600 dark:text-rose-400" },
  "Perencanaan Alur Kerja Proyek": { icon: FolderKanban, accent: "text-purple-600 dark:text-purple-400" },
  "Pelaksanaan Tugas dan Karya": { icon: CheckSquare, accent: "text-sky-600 dark:text-sky-400" },
  "Jadwal dan Kalender": { icon: CalendarDays, accent: "text-blue-500 dark:text-blue-400" },
  "Fokus dan Kebiasaan": { icon: Timer, accent: "text-yellow-600 dark:text-yellow-400" },
  "Rapat dan Kolaborasi Tim": { icon: MessagesSquare, accent: "text-violet-600 dark:text-violet-400" },
  "Manajemen Sumber Daya Manusia": { icon: Users, accent: "text-cyan-600 dark:text-cyan-400" },
  "Dokumentasi dan Wiki": { icon: BookOpen, accent: "text-emerald-500 dark:text-emerald-400" },
  "Pengelolaan Form dan Template": { icon: FileCode2, accent: "text-indigo-500 dark:text-indigo-400" },
  "Keuangan dan Aset": { icon: Wallet, accent: "text-emerald-600 dark:text-emerald-400" },
  "Vendor dan Logistik Kantor": { icon: Truck, accent: "text-amber-500 dark:text-amber-400" },
  "Target dan Performa": { icon: Target, accent: "text-rose-500 dark:text-rose-400" },
  "Utilitas Sistem": { icon: Settings, accent: "text-slate-500 dark:text-slate-400" },

  // Legacy Domain Categories
  Finance: { icon: Wallet, accent: "text-emerald-600 dark:text-emerald-400" },
  "Phase Side": { icon: Compass, accent: "text-indigo-600 dark:text-indigo-400" },
  "100 Tools": { icon: Grid2X2, accent: "text-purple-600 dark:text-purple-400" },
  Productivity: { icon: CheckSquare, accent: "text-blue-600 dark:text-blue-400" },
  Personal: { icon: User, accent: "text-rose-600 dark:text-rose-400" },
  Society: { icon: Users, accent: "text-amber-600 dark:text-amber-400" },
  "Creative & Media": { icon: PenTool, accent: "text-pink-600 dark:text-pink-400" },
  "Academy & Tools": { icon: GraduationCap, accent: "text-sky-600 dark:text-sky-400" },
};

export const SUPER_CATEGORIES = [
  { id: "All", label: "Semua", icon: LayoutDashboard },
  { id: "Tools", label: "Tools", icon: Wrench },
  { id: "100 Framework", label: "100 Framework", icon: Grid2X2 },
  { id: "Keuangan & Pasar", label: "Keuangan & Pasar", icon: Wallet },
  { id: "Kesehatan & Personal", label: "Kesehatan & Personal", icon: Heart },
  { id: "Kreatif & Akademi", label: "Kreatif & Akademi", icon: PenTool },
  { id: "Knowledge & Bisnis", label: "Knowledge & Bisnis", icon: BookOpen },
];


export function AppShell({
  title,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;
  const fullPath = pathname + (location.searchStr || "");
  const rawNav = navKonsultan;
  const { enabledMenus } = useMenuSettings();
  const { findItemById, findItemByPath } = useCustomNav();
  const { config: blurConfig, blurLevels } = useProgressiveBlurSetting();
  const isDockMinimized = useDockStore((s) => s.isMinimized);
  useLiquidGlassSetting();
  useThemeColor();


  // ---------------------------------------------------------------------------
  // CONTEXT RESOLUTION — determine which nav group / parent-category the route
  // that is currently open belongs to. This drives BOTH the left sidebar scope
  // and the header's context pill so the shell adapts to the active app.
  // ---------------------------------------------------------------------------
  const contextMatch: { item: NavItem; group: NavGroupType } | null = (() => {
    const sidebarAll: { item: NavItem; group: NavGroupType }[] = [];
    navAllSidebar.forEach((g) => g.items.forEach((item) => sidebarAll.push({ item, group: g })));
    const sMatch = (
      sidebarAll.find((x) => x.item.to === fullPath) ||
      sidebarAll.find((x) => x.item.to === pathname) ||
      sidebarAll.find((x) => x.item.to !== "/" && x.item.to.split("?")[0] === pathname) ||
      sidebarAll.find((x) => {
        const base = x.item.to.split("?")[0];
        return base !== "/" && pathname.startsWith(base);
      }) ||
      null
    );
    if (sMatch) return sMatch;

    const all: { item: NavItem; group: NavGroupType }[] = [];
    rawNav.forEach((g) => g.items.forEach((item) => all.push({ item, group: g })));
    return (
      all.find((x) => x.item.to === fullPath) ||
      all.find((x) => x.item.to === pathname) ||
      all.find((x) => x.item.to !== "/" && x.item.to.split("?")[0] === pathname) ||
      all.find((x) => {
        const base = x.item.to.split("?")[0];
        return base !== "/" && pathname.startsWith(base);
      }) ||
      null
    );
  })();

  const contextCategory =
    pathname === "/" ? null : contextMatch?.group.title || contextMatch?.group.sectionCategory || contextMatch?.group.parentCategory || null;
  const ContextCategoryIcon = contextCategory
    ? CATEGORY_META[contextCategory]?.icon
    : null;

  // Standalone mini-app config for the current route, so the fallback sidebar
  // can surface that app's own tabs as per-app navigation.

  // Category currently browsed in the left sidebar. Default to "All".

  const isHome = pathname === "/" || pathname === "/home";
  const [hasAppSidebar, setHasAppSidebar] = useState(false);
  const [sidebarView, setSidebarView] = useState<"navigation" | "menu">("navigation");
  useEffect(() => {
    setSidebarView("navigation");
    if (pathname && pathname !== "/" && pathname !== "/home") {
      recordActiveApp(pathname);
    }
  }, [pathname]);

  const [rightSidebarTab, setRightSidebarTab] = useState<"control" | "favorites">("control");

  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);
  const [isLeftSidebar75, setIsLeftSidebar75] = useState<boolean>(() => {
    try {
      const v = getRaw("aio_left_sidebar_75");
      if (v !== null) return v === "true";
      return getRaw("aio_left_sidebar_100") === "true";
    } catch {
      return false;
    }
  });

  // Listen to open-left-sidebar custom events
  useEffect(() => {
    const handleOpenLeft = (e: any) => {
      setIsLeftOpen(true);
      if (!isLeftSidebar75) {
        setIsRightOpen(false);
      }
      if (e?.detail?.tab) {
        setSidebarView(e.detail.tab);
      }
    };
    window.addEventListener("open-left-sidebar", handleOpenLeft);
    return () => window.removeEventListener("open-left-sidebar", handleOpenLeft);
  }, [isLeftSidebar75]);

  const shellSidebarCtx = useMemo(() => ({ setHasAppSidebar }), []);

  // Whether the currently-open app registered its own header via <ShellHeader>.
  const [hasAppHeader, setHasAppHeader] = useState(false);
  const shellHeaderCtx = useMemo(() => ({ setHasAppHeader }), []);

  // Sections published by the open app via useShellSections(). Kept in a ref so
  // click handlers are never stale; `bump` forces a re-render when they change.
  // These drive BOTH the sidebar "Di aplikasi ini" list and the header's row of
  // up to 5 interactive buttons (the header is an elaboration of the sidebar).
  const sectionsRef = useRef<ShellSection[]>([]);
  const [, setSectionsVersion] = useState(0);
  const bumpSections = useCallback(() => setSectionsVersion((v) => v + 1), []);
  const shellSectionsCtx = useMemo(
    () => ({ sectionsRef, bump: bumpSections }),
    [bumpSections],
  );

  // The section list to surface. Priority: app-registered sections, then a
  // standalone mini-app's own tabs (deep-linked via ?tab=). Empty otherwise.

  // Measure the (variable-height) contextual header so the scrollable content
  // always starts exactly below it.
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(60);
  const [isTopPanelOpen, setIsTopPanelOpen] = useState(false);
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    let rafId: number | null = null;
    const update = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (!headerRef.current) return;
        const h = headerRef.current.offsetHeight || 60;
        setHeaderHeight((prev) => (prev !== h ? h : prev));
      });
    };
    const initialH = el.offsetHeight || 60;
    setHeaderHeight((prev) => (prev !== initialH ? initialH : prev));

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    ro?.observe(el);
    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      ro?.disconnect();
    };
  }, [hasAppHeader, pathname, isTopPanelOpen]);

  const [collapsedNavGroups, setCollapsedNavGroups] = useState<Record<string, boolean>>({});
  const [currentMode, setCurrentMode] = useState<AppModeId>(() => {
    try {
      const saved = getRaw("client_os_active_mode") || getRaw("aio_active_mode");
      if (saved && APP_MODES.some((m) => m.id === saved)) {
        return saved as AppModeId;
      }
    } catch {}
    return "financial";
  });
  const [isModeOpen, setIsModeOpen] = useState(false);

  useEffect(() => {
    const handleLauncherModeChanged = (e: any) => {
      const modeId = e.detail;
      if (modeId && APP_MODES.some((m) => m.id === modeId)) {
        setCurrentMode(modeId as AppModeId);
      }
    };
    window.addEventListener("aio_launcher_mode_changed", handleLauncherModeChanged);
    return () => window.removeEventListener("aio_launcher_mode_changed", handleLauncherModeChanged);
  }, []);

  // Sinkronisasi otomatis workspace aktif dengan route yang sedang dibuka
  useEffect(() => {
    if (!pathname || pathname === "/") return;
    if (pathname.includes("financial")) setCurrentMode("financial");
    else if (pathname.includes("business")) setCurrentMode("business");
    else if (pathname.includes("productivity") || pathname.includes("employment")) setCurrentMode("employment");
    else if (pathname.includes("creative")) setCurrentMode("creative");
    else if (pathname.includes("research")) setCurrentMode("research");
    else if (pathname.includes("sharia") || pathname.includes("syariah")) setCurrentMode("sharia");
    else if (pathname.includes("personal")) setCurrentMode("personal");
    else if (pathname.includes("family")) setCurrentMode("family");
    else if (pathname.includes("public")) setCurrentMode("public_affairs");
    else if (pathname.includes("network") || pathname.includes("social") || pathname.includes("contact")) setCurrentMode("networks");
  }, [pathname]);
  const activeModeConfig = APP_MODES.find((m) => m.id === currentMode) || APP_MODES[0];
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const toggleLeftSidebar75 = () => {
    setIsLeftSidebar75((prev) => {
      const next = !prev;
      try {
        setRaw("aio_left_sidebar_75", String(next));
      } catch {}
      return next;
    });
  };

  const closeLeftSidebar = useCallback(() => {
    setIsLeftOpen(false);
    if (isLeftSidebar75) {
      setIsLeftSidebar75(false);
      try {
        setRaw("aio_left_sidebar_75", "false");
        removeRaw("aio_left_sidebar_100");
      } catch {}
    }
  }, [isLeftSidebar75]);

  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  const { favorites, toggleFavorite } = useFavorites();

  // Gabungan semua item nav untuk daftar Favorit
  const favItems = favorites.map((route) => {
    const meta = getAppMetaByRoute(route);
    return {
      to: route,
      label: meta.label,
      icon: meta.icon as LucideIcon,
      color: meta.iconColor,
      gradient: meta.accentGradient,
    };
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const sidebarContainer = document.querySelector(
        "#sidenavLeft .overflow-y-auto",
      ) as HTMLElement | null;
      const activeElement = sidebarContainer?.querySelector(
        '[data-status="active"]',
      ) as HTMLElement | null;
      if (sidebarContainer && activeElement) {
        const containerRect = sidebarContainer.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();
        const scrollTop =
          sidebarContainer.scrollTop +
          (activeRect.top - containerRect.top) -
          containerRect.height / 2 +
          activeRect.height / 2;
        sidebarContainer.scrollTo({ top: scrollTop, behavior: "smooth" });
      }
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [pathname]);

  const { addRecentApp } = useRecentApps();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isShortcutOpen, setIsShortcutOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isExpandOpen, setIsExpandOpen] = useState(false);
  const [isRecentOpen, setIsRecentOpen] = useState(false);
  const [isTaskbarOpen, setIsTaskbarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-record visited navigation into Recent
  useEffect(() => {
    if (!pathname) return;
    const allNavFlat = navKonsultan.flatMap((g) => g.items);
    const match = allNavFlat.find(
      (i) => i.to === pathname || i.to.split("?")[0] === pathname
    );
    if (match) {
      addRecentApp({ to: match.to, label: match.label });
    } else if (pathname === "/") {
      addRecentApp({ to: "/", label: "Launcher Modul", category: "Navigasi" });
    } else if (pathname === "/home") {
      addRecentApp({ to: "/home", label: "Beranda Eksekutif", category: "Navigasi" });
    }
  }, [pathname, addRecentApp]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K, +, Esc) & custom dock events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea" || (e.target as HTMLElement)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (!isInput && e.key === "+") {
        e.preventDefault();
        setIsQuickCaptureOpen(true);
        setIsShortcutOpen(false);
        setIsTerminalOpen(false);
        setIsExpandOpen(false);
        setIsRecentOpen(false);
        setIsTaskbarOpen(false);
      } else if (e.key === "Escape") {
        setIsQuickCaptureOpen(false);
        setIsShortcutOpen(false);
        setIsTerminalOpen(false);
        setIsExpandOpen(false);
        setIsRecentOpen(false);
        setIsTaskbarOpen(false);
      }
    };

    const handleOpenQuickCapture = () => {
      setIsQuickCaptureOpen(true);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenShortcut = () => {
      setIsShortcutOpen(true);
      setIsQuickCaptureOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenTerminal = () => {
      setIsTerminalOpen(true);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsExpandOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenExpand = () => {
      setIsExpandOpen(true);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsRecentOpen(false);
      setIsTaskbarOpen(false);
    };

    const handleOpenRecent = () => {
      setIsRecentOpen((prev) => !prev);
      setIsTaskbarOpen(false);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
    };

    const handleOpenTaskbar = () => {
      setIsTaskbarOpen((prev) => !prev);
      setIsRecentOpen(false);
      setIsQuickCaptureOpen(false);
      setIsShortcutOpen(false);
      setIsTerminalOpen(false);
      setIsExpandOpen(false);
    };

    const handleOpenSearch = () => {
      setIsCommandPaletteOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("aio_open_quick_capture", handleOpenQuickCapture);
    window.addEventListener("aio_open_shortcut", handleOpenShortcut);
    window.addEventListener("aio_open_terminal", handleOpenTerminal);
    window.addEventListener("aio_open_expand", handleOpenExpand);
    window.addEventListener("aio_open_recent", handleOpenRecent);
    window.addEventListener("aio_open_taskbar", handleOpenTaskbar);
    window.addEventListener("aio_open_search", handleOpenSearch);

    const handleToast = (e: any) => {
      if (e?.detail) {
        setToastMessage(e.detail);
        setTimeout(() => setToastMessage(null), 3200);
      }
    };
    window.addEventListener("aio_toast", handleToast);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("aio_open_quick_capture", handleOpenQuickCapture);
      window.removeEventListener("aio_open_shortcut", handleOpenShortcut);
      window.removeEventListener("aio_open_terminal", handleOpenTerminal);
      window.removeEventListener("aio_open_expand", handleOpenExpand);
      window.removeEventListener("aio_open_recent", handleOpenRecent);
      window.removeEventListener("aio_open_taskbar", handleOpenTaskbar);
      window.removeEventListener("aio_open_search", handleOpenSearch);
      window.removeEventListener("aio_toast", handleToast);
    };
  }, []);

  const handleOpenSettings = (tab = "general") => {
    setActiveSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  return (
    <ShellSidebarProvider value={shellSidebarCtx}>
    <ShellHeaderProvider value={shellHeaderCtx}>
    <ShellSectionsProvider value={shellSectionsCtx}>
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        initialTab={activeSettingsTab}
      />

      <aside
        id="sidenavLeft"
        className={`fixed inset-y-0 left-0 z-50 flex ${
          isLeftSidebar75
            ? "w-[75px] bg-primary border-r border-white/20 shadow-xl"
            : "w-[400px] liquid-glass-sidebar-left"
        } max-w-[85vw] shrink-0 flex-col transition-all duration-300 ease-in-out ${isLeftOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Spacer atas: Tombol close / toggle kiri yang sejajar dengan header + 3 dots traffic controls & 3 dots action */}
        <div
          className={`w-full h-[60px] sidebar-top-glass shrink-0 flex items-center px-3 ${
            isLeftSidebar75
              ? "justify-center px-1 !border-b-0 !border-none !shadow-none"
              : "justify-between border-b border-white/20 dark:border-white/10"
          }`}
        >
          {!isLeftSidebar75 ? (
            <>
              <button
                type="button"
                className="size-9 rounded-full aspect-square text-white/90 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                onClick={closeLeftSidebar}
                title="Sembunyikan Navigasi"
                aria-label="Tutup sidebar kiri"
              >
                <WindowPositionLeftIcon size={24} />
              </button>

              {/* 3 Dots: Klik langsung minimize / switch ke mode ringkas 75px */}
              <button
                type="button"
                onClick={toggleLeftSidebar75}
                className="size-9 rounded-full aspect-square text-white/90 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Mode Ringkas 75px (Minimize)"
                aria-label="Mode ringkas 75px"
              >
                <MoreVertical size={20} className="shrink-0" />
              </button>
            </>
          ) : (
            /* Mode Ringkas 75px: Hanya 3 Dots untuk mengembalikan ke 400px (tombol kedua dihapus) */
            <div className="w-full flex items-center justify-center">
              <button
                type="button"
                onClick={toggleLeftSidebar75}
                className="size-9 rounded-full aspect-square text-white/80 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
                title="Perluas ke Lebar Penuh (400px)"
                aria-label="Perluas ke 400px"
              >
                <MoreHorizontal size={20} className="shrink-0" />
              </button>
            </div>
          )}
        </div>

        {/* View switcher: Ribbon Tab - hanya muncul di mode full view (tidak muncul saat minimize) */}
        {!isLeftSidebar75 && (
          <div className="sidebar-tab-switcher-bar flex items-end w-full h-10 bg-white/10 dark:bg-white/5 shrink-0 gap-0 relative z-20">
            {/* Bilah Tab 1: Navigation */}
            <button
              type="button"
              onClick={() => setSidebarView("navigation")}
              className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-2 text-xs transition-all cursor-pointer rounded-tl-none rounded-tr-xl -mb-px ${
                sidebarView === "navigation"
                  ? "sidebar-tab-active-glass !border-b-0"
                  : "sidebar-tab-inactive-glass"
              }`}
              title="Navigation"
            >
              <Navigation className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Navigation</span>
            </button>

            {/* Bilah Tab 2: Menu */}
            <button
              type="button"
              onClick={() => setSidebarView("menu")}
              className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-2 text-xs transition-all cursor-pointer rounded-tl-xl rounded-tr-none -mb-px ${
                sidebarView === "menu"
                  ? "sidebar-tab-active-glass !border-b-0"
                  : "sidebar-tab-inactive-glass"
              }`}
              title="Menu"
            >
              <Menu className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Menu</span>
              {hasAppSidebar && (
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-white text-primary font-bold shrink-0 shadow-2xs">
                  Fitur
                </span>
              )}
            </button>
          </div>
        )}

        <div
          className={`flex-1 min-h-0 overflow-y-auto no-scrollbar px-3 ${
            isLeftSidebar75 ? "pt-1 pb-4 !border-t-0 !border-none !shadow-none" : "pt-5 pb-4"
          } sidebar-menu-body-glass`}
        >
          {/* Slot untuk konten sidebar milik app (target portal ShellSidebar) */}
          <div
            id="shellSidebarSlot"
            className={hasAppSidebar ? "block mb-4" : "hidden"}
          />

          {sidebarView === "navigation" ? (
            <div className="flex flex-col gap-3">
              {/* Workspace Selector: Pemilih 10 Workspace Terpadu di Sidebar */}
              {!isLeftSidebar75 ? (
                <div className="px-1 mb-1">
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Pilih Workspace
                    </span>
                    <span className="text-[10px] font-semibold text-primary">
                      10 Workspace
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      value={currentMode}
                      onChange={(e) => {
                        const newMode = e.target.value as AppModeId;
                        setCurrentMode(newMode);
                        try {
                          setRaw("aio_active_mode", newMode);
                        } catch {}
                      }}
                      className="w-full h-8 pl-2.5 pr-7 text-xs font-semibold bg-white/15 dark:bg-white/10 hover:bg-white/20 border border-white/20 dark:border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary text-foreground cursor-pointer appearance-none truncate"
                    >
                      {APP_MODES.map((m) => (
                        <option key={m.id} value={m.id} className="bg-popover text-popover-foreground">
                          {m.label} ({m.badge})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="text-muted-foreground pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              ) : (
                /* Mode Ringkas 75px: Icon workspace aktif */
                <div className="flex justify-center pb-2 border-b border-white/20">
                  <div className="p-2 rounded-xl bg-white/15 text-white" title={activeModeConfig.label}>
                    <activeModeConfig.icon className="size-5 text-primary" />
                  </div>
                </div>
              )}

              {/* Navigation items for current mode */}
              <div className="flex flex-col gap-1.5">
                {!isLeftSidebar75 && (
                  <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Modul & Fitur ({activeModeConfig.label})
                  </p>
                )}
                {activeModeConfig.links.map((link) => {
                  const isActive = pathname === link.to;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => {
                        if (!isLeftSidebar75) {
                          setIsLeftOpen(false);
                        }
                      }}
                      title={link.label}
                      className={`flex items-center ${
                        isLeftSidebar75
                          ? `justify-center p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
                              isActive
                                ? "bg-white text-primary border-white font-bold shadow-md ring-2 ring-white/40"
                                : "bg-white/10 hover:bg-white/20 border-white/20 text-white/90 hover:text-white"
                            }`
                          : `gap-2.5 px-3 py-2 rounded-xl text-xs transition-all border ${
                              isActive
                                ? "bg-primary/15 border-primary/40 text-primary font-semibold shadow-2xs"
                                : "bg-white/10 dark:bg-white/5 border-white/15 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-white/10"
                            }`
                      }`}
                    >
                      <Icon
                        className={`size-4 shrink-0 ${
                          isLeftSidebar75
                            ? isActive
                              ? "text-primary"
                              : "text-white"
                            : "text-primary"
                        }`}
                      />
                      {!isLeftSidebar75 && <span className="truncate">{link.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : (
            <SidebarPillarsMenu
              isCompact={isLeftSidebar75}
              activeMode={currentMode}
              onNavigate={() => {
                if (!isLeftSidebar75 && typeof window !== "undefined" && window.innerWidth < 1024) {
                  setIsLeftOpen(false);
                }
              }}
            />
          )}

          {blurConfig.enabled && !isLeftSidebar75 && (
            <div className="sticky bottom-0 inset-x-0 -mx-3 -mb-4 h-8 pointer-events-none z-20">
              <ProgressiveBlur
                direction="bottom"
                height={32}
                blurLevels={[0.5, 1, 2, 4, 8]}
                tint={blurConfig.tint ? "linear-gradient(to bottom, transparent 0%, hsl(var(--card) / 0.8) 100%)" : false}
              />
            </div>
          )}
        </div>
      </aside>

      <aside id="sidenavRight" className={`fixed inset-y-0 right-0 z-50 flex w-[400px] max-w-[85vw] flex-col liquid-glass-sidebar-right transition-transform duration-300 ease-in-out ${isRightOpen ? "translate-x-0" : "translate-x-full"}`}>
        {/* Right Sidebar Spacer: Tombol close / toggle kanan yang sejajar dengan header */}
        <div className="w-full h-[60px] sidebar-top-glass shrink-0 flex items-center justify-end px-3 border-b border-white/20 dark:border-white/10">
          <button
            type="button"
            className="size-9 rounded-full aspect-square text-white/90 hover:text-white hover:bg-white/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0"
            onClick={() => setIsRightOpen(false)}
            title="Sembunyikan Control Center"
            aria-label="Tutup sidebar kanan"
          >
            <WindowPositionRightIcon size={24} />
          </button>
        </div>

        {/* Right Sidebar Tab Switcher: Ribbon Tab diturunkan sejajar serata di bawah garis header 60px */}
        <div className="sidebar-tab-switcher-bar flex items-end w-full h-10 bg-white/10 dark:bg-white/5 shrink-0 gap-0 relative z-20">
          <button
            type="button"
            onClick={() => setRightSidebarTab("control")}
            className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-3 text-xs transition-all cursor-pointer rounded-tl-none rounded-tr-xl -mb-px ${
              rightSidebarTab === "control"
                ? "sidebar-tab-active-glass !border-b-0"
                : "sidebar-tab-inactive-glass"
            }`}
          >
            <Settings className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">Control</span>
          </button>
          <button
            type="button"
            onClick={() => setRightSidebarTab("favorites")}
            className={`relative flex-1 h-10 flex items-center justify-center gap-2 px-3 text-xs transition-all cursor-pointer rounded-tl-xl rounded-tr-none -mb-px ${
              rightSidebarTab === "favorites"
                ? "sidebar-tab-active-glass !border-b-0"
                : "sidebar-tab-inactive-glass"
            }`}
          >
            <Star className={`h-3.5 w-3.5 shrink-0 ${rightSidebarTab === "favorites" ? "text-amber-500 fill-amber-500" : "text-white/80"}`} />
            <span className="truncate">Favorit</span>
            {favorites.length > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-none shrink-0 ${
                rightSidebarTab === "favorites" ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"
              }`}>
                {favorites.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 py-4 sm:px-5 sidebar-menu-body-glass">
          {rightSidebarTab === "favorites" ? (
            favItems.length > 0 ? (
              <div className="flex flex-col gap-1.5 w-full">
                {favItems.map((item) => {
                  const FavIcon = item.icon || Star;
                  const isActive = pathname === item.to || fullPath === item.to;
                  const toPath = item.to.split("?")[0];
                  const toSearch = item.to.includes("?")
                    ? Object.fromEntries(new URLSearchParams(item.to.split("?")[1]))
                    : undefined;
                  return (
                    <div
                      key={item.to}
                      className={`group flex items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-all border backdrop-blur-md ${
                        isActive
                          ? "bg-white/25 dark:bg-white/10 border-primary/40 text-primary shadow-2xs font-semibold"
                          : "bg-white/10 dark:bg-white/5 border-white/15 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-white/10"
                      }`}
                    >
                      <Link
                        to={toPath as any}
                        search={toSearch as any}
                        onClick={() => setIsRightOpen(false)}
                        className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                      >
                        <div
                          className={`grid h-7 w-7 place-items-center rounded-lg shrink-0 ${
                            isActive
                              ? "bg-primary/20 text-primary"
                              : "bg-white/15 dark:bg-white/10 text-muted-foreground group-hover:text-foreground"
                          }`}
                        >
                          <FavIcon className={`h-4 w-4 ${!isActive && item.color ? item.color : ""}`} />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(item.to)}
                        className="p-1 rounded-lg text-amber-500 hover:bg-amber-500/15 transition-colors cursor-pointer shrink-0"
                        title="Hapus dari Favorit"
                      >
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null
          ) : (
          <nav className="flex flex-col gap-2.5 items-start w-full">
            <div className="grid grid-cols-1 gap-2 w-full">
              {[
                {
                  to: "/wallet",
                  title: "Wallet",
                  subtitle: "Dompet kas, komparasi harga & nota belanja",
                  badge: "Dompet",
                  icon: Wallet,
                  accentColor: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
                },
                {
                  to: "/pocket",
                  title: "Pocket",
                  subtitle: "Kartu akses, voucher, tiket & slip saku",
                  badge: "Saku",
                  icon: Pocket,
                  accentColor: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
                },
                {
                  to: "/pouch",
                  title: "Pouch",
                  subtitle: "Organizer dokumen esensial & kit bepergian",
                  badge: "Travel",
                  icon: ShoppingBag,
                  accentColor: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
                },
                {
                  to: "/vault",
                  title: "Vault",
                  subtitle: "Brankas digital & identitas resmi terenkripsi",
                  badge: "Kredensial",
                  icon: Vault,
                  accentColor: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
                },
                {
                  to: "/trunk",
                  title: "Trunk",
                  subtitle: "Gudang perkakas & inventaris rumah tangga",
                  badge: "Gudang",
                  icon: Luggage,
                  accentColor: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                const isActive = pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to as any}
                    onClick={() => setIsRightOpen(false)}
                    className={`group flex items-center justify-between rounded-xl p-2.5 transition-all border backdrop-blur-md cursor-pointer ${
                      isActive
                        ? "bg-white/25 dark:bg-white/10 border-primary/40 text-primary shadow-xs font-semibold ring-1 ring-primary/30"
                        : "bg-white/10 dark:bg-white/5 border-white/15 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-white/10 hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className={`grid h-8 w-8 place-items-center rounded-lg shrink-0 border ${item.accentColor} transition-transform group-hover:scale-105`}>
                        <ItemIcon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs truncate text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded-full bg-muted/70 text-muted-foreground">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/60 group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                  </Link>
                );
              })}
            </div>
          </nav>
          )}

          {blurConfig.enabled && (
            <div className="sticky bottom-0 inset-x-0 -mx-4 -mb-4 sm:-mx-5 sm:-mb-4 h-8 pointer-events-none z-20">
              <ProgressiveBlur
                direction="bottom"
                height={32}
                blurLevels={[0.5, 1, 2, 4, 8]}
                tint={blurConfig.tint ? "linear-gradient(to bottom, transparent 0%, hsl(var(--card) / 0.8) 100%)" : false}
              />
            </div>
          )}
        </div>

      </aside>
      <main
        id="mainContent"
        className={`relative flex flex-1 flex-col overflow-hidden transition-[margin,width] duration-300 ease-in-out ${
          isLeftOpen && isLeftSidebar75
            ? "ml-[75px] w-[calc(100%-75px)]"
            : "ml-0 w-full"
        }`}
      >
        {(isRightOpen || (isLeftOpen && !isLeftSidebar75)) && (
          <div
            className="fixed inset-0 z-40 bg-transparent cursor-default"
            onClick={() => {
              setIsRightOpen(false);
              if (!isLeftSidebar75) {
                setIsLeftOpen(false);
              }
            }}
          />
        )}
        <header ref={headerRef as any} className="absolute top-0 inset-x-0 z-20 pointer-events-none transition-all duration-300">
          {/* Panel Bar Atas: Akun, Tema & Preferensi Region */}
          {isTopPanelOpen && (
            <div
              id="top-panel-container"
              className="pointer-events-auto w-full max-h-[85vh] relative overflow-hidden"
              style={{ backgroundColor: "hsl(var(--primary))" }}
            >
              <TopPanelControlHub
                onClose={() => setIsTopPanelOpen(false)}
                onOpenSettings={handleOpenSettings}
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-5 pointer-events-none">
            {/* Bagian Kiri Header: 2 Floating Pills Terpisah (Pill 1: Home & Nav Toggle, Pill 2: Panah Kiri, Refresh & Panah Kanan) */}
            <div className="flex items-center gap-2">
              {/* Pill 1: Nav Toggle (Sidebar Kiri) & Home */}
              <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-full liquid-glass-header-pill">
                {/* Toggle Sidebar Kiri (Paling Kiri) */}
                <button
                  type="button"
                  className={`relative z-10 size-9 rounded-full aspect-square shrink-0 transition-colors flex items-center justify-center cursor-pointer ${
                    isLeftOpen
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    if (isLeftOpen) {
                      setIsLeftOpen(false);
                    } else {
                      setIsLeftOpen(true);
                      if (!isLeftSidebar75) {
                        setIsRightOpen(false);
                      }
                    }
                  }}
                  title={isLeftOpen ? "Sembunyikan Navigasi" : "Tampilkan Navigasi"}
                  aria-label="Toggle sidebar kiri"
                >
                  <WindowPositionLeftIcon size={24} />
                </button>

                {/* Icon Home (Di Kanan Toggle Sidebar) */}
                <Link
                  to="/"
                  className="relative z-10 size-9 rounded-full aspect-square shrink-0 transition-colors flex items-center justify-center cursor-pointer text-muted-foreground hover:text-foreground hover:bg-accent"
                  title="Beranda (Home)"
                  aria-label="Beranda"
                >
                  <Home size={20} className="shrink-0" />
                </Link>
              </div>

              {/* Pill 2: Panah Kiri, Refresh & Panah Kanan */}
              <div className="pointer-events-auto flex items-center p-1 rounded-full liquid-glass-header-pill">
                <HeaderNavControls />
              </div>
            </div>

            {/* Bagian Kanan Header: 2 Floating Pills (Pill 1: Wadah Utama ~600px untuk Elemen Aksi & Portal, Pill 2: Pengaturan & Sidebar Kanan) */}
            <div className="flex items-center gap-2">
              {/* Pill Shape Wadah Utama (600px) tempat elemen aksi, modul, & portal disiapkan */}
              {/* Pill Shape Wadah Utama (600px) tempat elemen aksi, modul, & portal disiapkan */}
              <div
                className={`pointer-events-auto h-[46px] min-h-[46px] w-auto max-w-[calc(100vw-220px)] rounded-full shrink-0 transition-all duration-300 ease-out flex items-center justify-end ${
                  hasAppHeader
                    ? "p-0 bg-transparent border-transparent shadow-none overflow-visible"
                    : "liquid-glass-header-pill bg-white/60 dark:bg-zinc-800/60 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-xs p-1 gap-1.5 overflow-hidden overscroll-none"
                }`}
              >
                {!actions && !hasAppHeader && !isHome && (
                  <div className="relative z-10 flex items-center gap-1.5 px-3 text-xs font-medium text-foreground truncate max-w-[200px] sm:max-w-[280px] shrink-0">
                    {ContextCategoryIcon && <ContextCategoryIcon size={14} className="shrink-0 text-primary" />}
                    <span className="truncate font-semibold">{title || contextMatch?.item.label || "Modul Aktif"}</span>
                  </div>
                )}
                {actions && (
                  <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                    {actions}
                  </div>
                )}
                <div
                  id="app-header-actions-portal"
                  className="relative z-10 flex items-center justify-end gap-1.5 min-w-0 empty:hidden w-auto shrink-0 overflow-hidden rounded-full no-scrollbar h-full py-0"
                />
              </div>

              {/* Pill 2: Pengaturan (Panel Atas) & Sidebar Kanan (Control Center) */}
              <div className="pointer-events-auto flex items-center gap-1 p-1 rounded-full liquid-glass-header-pill">
                {/* Toggle Panel Atas (Akun, Tema, Region / Setting) */}
                <button
                  type="button"
                  className={`relative z-10 size-9 rounded-full aspect-square shrink-0 transition-colors flex items-center justify-center cursor-pointer ${
                    isTopPanelOpen
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setIsTopPanelOpen((prev) => !prev)}
                  title={isTopPanelOpen ? "Tutup Panel Pengaturan Atas" : "Pengaturan (Akun, Tema & Preferensi)"}
                  aria-label="Toggle panel bar atas"
                >
                  <Settings size={20} className="shrink-0" />
                </button>

                {/* Toggle Sidebar Kanan (Control Center) */}
                <button
                  type="button"
                  className={`relative z-10 size-9 rounded-full aspect-square shrink-0 transition-colors flex items-center justify-center cursor-pointer ${
                    isRightOpen
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    if (isRightOpen) {
                      setIsRightOpen(false);
                    } else {
                      setIsRightOpen(true);
                      if (!isLeftSidebar75) {
                        setIsLeftOpen(false);
                      }
                    }
                  }}
                  title={isRightOpen ? "Sembunyikan Control Center" : "Tampilkan Control Center (Sidebar Kanan)"}
                  aria-label="Toggle sidebar kanan"
                >
                  <WindowPositionRightIcon size={24} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Progressive Blur (Top & Bottom Viewport Transitions - Planes & Apple VisionOS Inspired) */}
        {blurConfig.enabled && (
          <>
            {/* Top progressive blur: seamless melt for scrolling content under header pills */}
            <ProgressiveBlur
              direction="top"
              height={96}
              blurLevels={blurLevels}
              tint={blurConfig.tint ? `linear-gradient(to top, transparent 0%, hsl(var(--background) / 0.82) 100%)` : false}
              className="fixed top-0 right-0 z-15 pointer-events-none transition-[left] duration-300 ease-in-out"
              style={{
                left: isLeftOpen && isLeftSidebar75 ? "75px" : "0px",
              }}
            />

            {/* Bottom progressive blur: soft dissolve above floating dock and edge */}
            <ProgressiveBlur
              direction="bottom"
              height={isDockMinimized ? 56 : 116}
              blurLevels={blurLevels}
              tint={blurConfig.tint ? `linear-gradient(to bottom, transparent 0%, hsl(var(--background) / 0.88) 100%)` : false}
              className="fixed bottom-0 right-0 z-15 pointer-events-none transition-[left,height] duration-300 ease-in-out"
              style={{
                left: isLeftOpen && isLeftSidebar75 ? "75px" : "0px",
              }}
            />
          </>
        )}

        <div
          className={`flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar relative ${
            pathname === "/" ? "px-4 pb-[68px] sm:px-6 sm:pb-[68px]" : "px-3 sm:px-6 pb-[80px]"
          }`}
          style={{ paddingTop: headerHeight }}
        >
          {children}
        </div>
        <AppDock
          sidebarShift={isLeftOpen && isLeftSidebar75}
          onSearch={() => setIsCommandPaletteOpen(true)}
          onQuickCapture={() => {
            setIsQuickCaptureOpen((prev) => !prev);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onShortcut={() => {
            setIsShortcutOpen((prev) => !prev);
            setIsQuickCaptureOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onTerminal={() => {
            setIsTerminalOpen((prev) => !prev);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsExpandOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onExpand={() => {
            setIsExpandOpen((prev) => !prev);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsRecentOpen(false);
            setIsTaskbarOpen(false);
          }}
          onRecent={() => {
            setIsRecentOpen((prev) => !prev);
            setIsTaskbarOpen(false);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
          }}
          onTaskbar={() => {
            setIsTaskbarOpen((prev) => !prev);
            setIsRecentOpen(false);
            setIsQuickCaptureOpen(false);
            setIsShortcutOpen(false);
            setIsTerminalOpen(false);
            setIsExpandOpen(false);
          }}
          isQuickCaptureOpen={isQuickCaptureOpen}
          isShortcutOpen={isShortcutOpen}
          isTerminalOpen={isTerminalOpen}
          isExpandOpen={isExpandOpen}
          isRecentOpen={isRecentOpen}
          isTaskbarOpen={isTaskbarOpen}
        />

        {/* Global Modals: Command Palette, Quick Capture, Shortcut, Terminal, Recent & Taskbar */}
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
        />
        <QuickCaptureModal
          isOpen={isQuickCaptureOpen}
          onClose={() => setIsQuickCaptureOpen(false)}
          onSuccess={(msg) => {
            setToastMessage(msg);
            setTimeout(() => setToastMessage(null), 3000);
          }}
        />
        <ShortcutModal
          isOpen={isShortcutOpen}
          onClose={() => setIsShortcutOpen(false)}
          onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        />
        <TerminalModal
          isOpen={isTerminalOpen}
          onClose={() => setIsTerminalOpen(false)}
        />
        <RecentModal
          isOpen={isRecentOpen}
          onClose={() => setIsRecentOpen(false)}
        />
        <TaskbarModal
          isOpen={isTaskbarOpen}
          onClose={() => setIsTaskbarOpen(false)}
        />

        {/* Notification Toast */}
        {toastMessage && (
          <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-50 bg-foreground text-background text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
    </ShellSectionsProvider>
    </ShellHeaderProvider>
    </ShellSidebarProvider>
  );
}
