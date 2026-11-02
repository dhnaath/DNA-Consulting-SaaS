import React, { useState, useMemo, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { HeaderNavPills, ShellHeader } from "@/app/shell-header";
import { ALL_APP_MODULES } from "@/features/launcher/AppModuleSection";
import {
  STANDALONE_MBA_APPS,
  ToolsFlipCard,
  getToolsGradient,
} from "@/features/launcher/Tools100Section";
import { MBA_PILLARS } from "@/frameworkData";
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
  Truck,
  Building2,
  Package,
  Boxes,
  Users,
  Briefcase,
  MessagesSquare,
  Clock,
  CalendarCheck,
  Receipt,
  CreditCard,
  LineChart,
  Search,
  Key,
  Shield,
  Layers,
  ArrowRight,
  Star,
  ChevronRight,
  Store,
  FolderKanban,
  FileCheck,
  FileBarChart,
  ThumbsUp,
  Award,
  UserCheck,
  ShoppingBag,
} from "lucide-react";

export type BizOpsCategory =
  | "all"
  | "operations"
  | "customers"
  | "administration"
  | "strategy"
  | "organization";

const LEGACY_BIZ_OPS_CATEGORY_MAP: Record<string, BizOpsCategory> = {
  supply: "operations",
  commercial: "customers",
  "back-office": "administration",
  innovation: "strategy",
  governance: "organization",
};

export function normalizeBizOpsCategory(raw?: string | null): BizOpsCategory {
  if (!raw) return "all";
  const key = raw.trim().toLowerCase();
  if (
    key === "all" ||
    key === "operations" ||
    key === "customers" ||
    key === "administration" ||
    key === "strategy" ||
    key === "organization"
  ) {
    return key;
  }
  return LEGACY_BIZ_OPS_CATEGORY_MAP[key] ?? "all";
}

export interface BizOpsSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface BizOpsAppItem {
  id: string;
  name: string;
  category: Exclude<BizOpsCategory, "all">;
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: BizOpsSubMenu[];
}

export const BIZ_OPS_APPS: BizOpsAppItem[] = [
  // ============================================================================
  // 1. Operations (3 Apps)
  // ============================================================================
  {
    id: "vendors-and-procurement",
    name: "Vendors and Procurement",
    category: "operations",
    categoryLabel: "Operations",
    shortDesc:
      "Direktori penyedia jasa dan mitra kerja, persetujuan pengadaan purchase orders (PO), serta alokasi kapasitas sumber daya operasional.",
    to: "/peh/vendors",
    icon: Truck,
    badge: "Supply & Vendors",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Operations",
    subMenus: [
      { id: "vendor-directory", label: "Vendor Directory", to: "/peh/vendors" },
      { id: "procurement", label: "Pengadaan & Purchase Orders", to: "/peh/procurement" },
      { id: "resource-manager", label: "Resource Manager", to: "/resource-manager" },
    ],
  },
  {
    id: "products-and-stock",
    name: "Products and Stock",
    category: "operations",
    categoryLabel: "Operations",
    shortDesc:
      "Katalog penawaran produk terstruktur, pengendalian inventaris stok pergudangan, pelacakan lot batch, dan pemantauan rantai dingin (cold chain).",
    to: "/katalog-produk",
    icon: Package,
    badge: "Products & Stock",
    accentGradient: "from-cyan-500 to-blue-600",
    accentBorder: "border-cyan-500/30 hover:border-cyan-500/60",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
    badgeText: "Operations",
    subMenus: [
      { id: "product-catalog", label: "Product Catalog", to: "/katalog-produk" },
      { id: "inventory", label: "Inventory", to: "/inventory" },
      { id: "batch-track", label: "Batch Track", to: "/lainnya?app=batch-track" },
      { id: "cold-chain", label: "Cold Chain", to: "/lainnya?app=cold-chain" },
    ],
  },
  {
    id: "quality-and-incidents",
    name: "Quality and Incidents",
    category: "operations",
    categoryLabel: "Operations",
    shortDesc:
      "Pemeriksaan kendali mutu operasional, pencatatan insiden lapangan, meja tiket penanganan masalah, dan dokumentasi SOP prosedur baku.",
    to: "/lainnya?app=quality-check",
    icon: Shield,
    badge: "Quality & Incidents",
    accentGradient: "from-orange-500 to-red-600",
    accentBorder: "border-orange-500/30 hover:border-orange-500/60",
    badgeBg: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
    badgeText: "Operations",
    subMenus: [
      { id: "quality-check", label: "Quality Check", to: "/lainnya?app=quality-check" },
      { id: "incident-log", label: "Incident Log", to: "/lainnya?app=incident-log" },
      { id: "ticket-desk", label: "Ticket Desk", to: "/lainnya?app=ticket-desk" },
      { id: "sop", label: "SOP & Prosedur Baku", to: "/lainnya?app=sop" },
    ],
  },

  // ============================================================================
  // 2. Customers (3 Apps)
  // ============================================================================
  {
    id: "client-records",
    name: "Client Records",
    category: "customers",
    categoryLabel: "Customers",
    shortDesc:
      "Direktori profil klien korporasi, pengelolaan kontak relasi (CRM), rekam pesanan klien, serta standar daftar tarif layanan (service rates).",
    to: "/klien",
    icon: Briefcase,
    badge: "Client Records",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Customers",
    subMenus: [
      { id: "clients-directory", label: "Clients Directory", to: "/klien" },
      { id: "contacts-crm", label: "Contacts CRM", to: "/contacts" },
      { id: "client-orders", label: "Client Orders", to: "/lainnya?app=client-orders" },
      { id: "service-rates", label: "Service Rates", to: "/lainnya?app=services-ratecard" },
    ],
  },
  {
    id: "client-communication",
    name: "Client Communication",
    category: "customers",
    categoryLabel: "Customers",
    shortDesc:
      "Portal kolaborasi interaktif bersama klien, kanal pesan langsung, manajemen histori interaksi pertemuan, dan umpan balik evaluasi kepuasan.",
    to: "/portal",
    icon: MessagesSquare,
    badge: "Client Communication",
    accentGradient: "from-violet-500 to-purple-600",
    accentBorder: "border-violet-500/30 hover:border-violet-500/60",
    badgeBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
    badgeText: "Customers",
    subMenus: [
      { id: "collab-portal", label: "Collab Portal", to: "/portal" },
      { id: "client-messages", label: "Client Messages", to: "/portal/pesan" },
      { id: "interaction-manager", label: "Interaction Manager", to: "/interaction-manager" },
      { id: "feedback-loop", label: "Feedback Loop", to: "/lainnya?app=feedback-loop" },
    ],
  },
  {
    id: "service-flow",
    name: "Service Flow",
    category: "customers",
    categoryLabel: "Customers",
    shortDesc:
      "Pengaturan antrean layanan pelanggan, reservasi jadwal konsultasi, buku tamu kunjungan, poin loyalitas, dan kartu keanggotaan (membership).",
    to: "/lainnya?app=queue-line",
    icon: Clock,
    badge: "Service Flow",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Customers",
    subMenus: [
      { id: "queue-line", label: "Queue Line", to: "/lainnya?app=queue-line" },
      { id: "book-slot", label: "Book Slot", to: "/lainnya?app=book-slot" },
      { id: "visitor-log", label: "Visitor Log", to: "/lainnya?app=visitor-log" },
      { id: "loyalty-point", label: "Loyalty Point", to: "/lainnya?app=loyalty-point" },
      { id: "membership-card", label: "Membership Card", to: "/lainnya?app=membership-card" },
    ],
  },

  // ============================================================================
  // 3. Administration (3 Apps)
  // ============================================================================
  {
    id: "spending-and-assets",
    name: "Spending and Assets",
    category: "administration",
    categoryLabel: "Administration",
    shortDesc:
      "Pelacakan pos pengeluaran operasional usaha, pemantauan langganan layanan berkala, serta inventarisasi aset fasilitas kantor.",
    to: "/expense-tracker",
    icon: Receipt,
    badge: "Spending & Assets",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Administration",
    subMenus: [
      { id: "expense-tracker", label: "Expense Tracker", to: "/expense-tracker" },
      { id: "subscription-manager", label: "Subscription Manager", to: "/subscription-manager" },
      { id: "asset-manager", label: "Asset Manager", to: "/asset-manager" },
    ],
  },
  {
    id: "documents-and-correspondence",
    name: "Documents and Correspondence",
    category: "administration",
    categoryLabel: "Administration",
    shortDesc:
      "Buku agenda surat-menyurat korporat, pustaka template dokumen kerja, manajemen format baku, dan formulir administrasi digital.",
    to: "/lainnya?app=mailroom",
    icon: FileCheck,
    badge: "Documents & Mail",
    accentGradient: "from-sky-500 to-teal-600",
    accentBorder: "border-sky-500/30 hover:border-sky-500/60",
    badgeBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
    badgeText: "Administration",
    subMenus: [
      { id: "letter-log", label: "Letter Log", to: "/lainnya?app=mailroom" },
      { id: "template-dokumen-kerja", label: "Template Dokumen Kerja", to: "/lainnya?app=templates" },
      { id: "template-manager", label: "Template Manager", to: "/template-manager" },
      { id: "forms", label: "Forms", to: "/forms" },
    ],
  },
  {
    id: "data-and-access",
    name: "Data and Access",
    category: "administration",
    categoryLabel: "Administration",
    shortDesc:
      "Pusat statistik kinerja operasional, pencarian arsip terpadu, direktori matriks hak akses pengguna, dan penyusunan laporan kustom.",
    to: "/statistics",
    icon: LineChart,
    badge: "Data & Access",
    accentGradient: "from-indigo-500 to-sky-600",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "Administration",
    subMenus: [
      { id: "statistics", label: "Statistics", to: "/statistics" },
      { id: "search-manager", label: "Search Manager", to: "/search-manager" },
      { id: "access-directory", label: "Access Directory", to: "/lainnya?app=access-matrix" },
      { id: "custom-reports", label: "Custom Reports", to: "/lainnya?app=custom-reports" },
    ],
  },

  // ============================================================================
  // 4. Strategy (1 App)
  // ============================================================================
  {
    id: "goals-and-performance",
    name: "Goals and Performance",
    category: "strategy",
    categoryLabel: "Strategy",
    shortDesc:
      "Penyelarasan sasaran strategis perusahaan (OKR/KPI) dan evaluasi berkala melalui sesi tinjauan kinerja serta retrospektif tim.",
    to: "/goal-manager",
    icon: Award,
    badge: "Goals & Performance",
    accentGradient: "from-yellow-500 to-amber-600",
    accentBorder: "border-yellow-500/30 hover:border-yellow-500/60",
    badgeBg: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    badgeText: "Strategy",
    subMenus: [
      { id: "goal-manager", label: "Goal Manager", to: "/goal-manager" },
      { id: "review-retrospective", label: "Review & Retrospective", to: "/lainnya?app=retro" },
    ],
  },

  // ============================================================================
  // 5. Organization (2 Apps)
  // ============================================================================
  {
    id: "people-and-attendance",
    name: "People and Attendance",
    category: "organization",
    categoryLabel: "Organization",
    shortDesc:
      "Pencatatan kehadiran jam kerja tim, serah terima tugas pergantian shift, pelacakan pelatihan SDM, dan pemantauan kapasitas beban kerja.",
    to: "/lainnya?app=time-clock",
    icon: UserCheck,
    badge: "People & Attendance",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Organization",
    subMenus: [
      { id: "time-clock", label: "Time Clock", to: "/lainnya?app=time-clock" },
      { id: "handover-notes", label: "Handover Notes", to: "/lainnya?app=handover-notes" },
      { id: "training-track", label: "Training Track", to: "/lainnya?app=training-track" },
      { id: "workload-capacity", label: "Workload & Capacity", to: "/lainnya?app=workload" },
    ],
  },
  {
    id: "compliance-and-governance-records",
    name: "Compliance and Governance Records",
    category: "organization",
    categoryLabel: "Organization",
    shortDesc:
      "Pemantauan kepatuhan regulasi hukum, administrasi struktur saham (cap table) beserta simulasi dilusi, dan pencatatan hak cipta lisensi IP.",
    to: "/peh/compliance",
    icon: Shield,
    badge: "Compliance & Governance",
    accentGradient: "from-fuchsia-500 to-purple-600",
    accentBorder: "border-fuchsia-500/30 hover:border-fuchsia-500/60",
    badgeBg: "bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/30",
    badgeText: "Organization",
    subMenus: [
      { id: "kepatuhan-regulasi", label: "Kepatuhan Regulasi", to: "/peh/compliance" },
      { id: "cap-table", label: "Struktur Saham & Cap Table", to: "/peh/cap-table" },
      { id: "simulasi-dilusi", label: "Simulasi Dilusi", to: "/peh/cap-table" },
      { id: "ip-licenses", label: "Hak Cipta & Lisensi IP", to: "/peh/ip-licenses" },
    ],
  },
];

const MBA_PILLARS_BY_CATEGORY: Record<
  Exclude<BizOpsCategory, "all">,
  readonly string[]
> = {
  operations: ["Operations"],
  customers: ["Commercial"],
  administration: ["Finance", "Analytics"],
  strategy: ["Strategy", "Innovation"],
  organization: ["Organization", "Governance"],
};

const countCategoryModules = (cat: Exclude<BizOpsCategory, "all">): number => {
  const opsCount = BIZ_OPS_APPS.filter((a) => a.category === cat).length;
  const pillars = MBA_PILLARS_BY_CATEGORY[cat];
  const mbaCount = STANDALONE_MBA_APPS.filter((a) =>
    pillars.includes(a.pillar)
  ).length;
  return opsCount + mbaCount;
};

export const BIZ_OPS_CATEGORY_TABS: {
  id: BizOpsCategory;
  label: string;
  title?: string;
  count: number;
}[] = [
  {
    id: "all",
    label: "Semua",
    count: BIZ_OPS_APPS.length + STANDALONE_MBA_APPS.length,
  },
  {
    id: "operations",
    label: "Operations",
    title: "Supply & Operations",
    count: countCategoryModules("operations"),
  },
  {
    id: "customers",
    label: "Customers",
    title: "Customers & Commercial",
    count: countCategoryModules("customers"),
  },
  {
    id: "administration",
    label: "Administration",
    title: "Back Office & Administration",
    count: countCategoryModules("administration"),
  },
  {
    id: "strategy",
    label: "Strategy",
    title: "Strategy & Innovation",
    count: countCategoryModules("strategy"),
  },
  {
    id: "organization",
    label: "Organization",
    title: "Organization & Governance",
    count: countCategoryModules("organization"),
  },
];

export const BIZ_OPS_TOTAL_MODULES =
  BIZ_OPS_APPS.length + STANDALONE_MBA_APPS.length;
export const BIZ_OPS_TOTAL_BADGE = `${BIZ_OPS_TOTAL_MODULES} Modul`;
export const BIZ_OPS_SUMMARY_DESC = BIZ_OPS_CATEGORY_TABS.map(
  (t) => `${t.label} (${t.count})`
).join(" · ");

export const CATEGORY_SUBTITLES: Record<BizOpsCategory, string> = {
  all: "Ruang kendali terpadu yang menyatukan modul operasional bisnis bersama 8 Pilar Strategis & 100 MBA Tools dalam satu halaman kerja.",
  operations:
    "Pengelolaan pengadaan vendor, inventaris stok pergudangan, serta kendali mutu dan insiden yang terintegrasi dengan instrumen MBA pilar Operations.",
  customers:
    "Manajemen profil klien, portal komunikasi, serta alur layanan dan loyalitas pelanggan yang diselaraskan dengan instrumen MBA pilar Commercial.",
  administration:
    "Pengendalian pengeluaran dan aset, tata persuratan dokumen, serta analitik data akses yang diperkuat oleh instrumen MBA pilar Finance dan Analytics.",
  strategy:
    "Penyelarasan sasaran kinerja (OKR/KPI) dan evaluasi retrospektif tim yang dipadukan dengan kerangka kerja MBA pilar Strategy dan Innovation.",
  organization:
    "Pengaturan kehadiran serta kapasitas SDM dan pencatatan kepatuhan maupun struktur ekuitas yang menyatu dengan instrumen MBA pilar Organization dan Governance.",
};

export function BusinessOperationsCustomersPage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<BizOpsCategory>(
    () => {
      if (typeof window !== "undefined") {
        try {
          const params = new URLSearchParams(window.location.search);
          const cat = params.get("category") || params.get("pill");
          if (cat) return normalizeBizOpsCategory(cat);
        } catch {}
      }
      return "all";
    }
  );
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_business") || "mode_business";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();

  const activeCategory = normalizeBizOpsCategory(selectedCategory);

  const filteredApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BIZ_OPS_APPS.filter((app) => {
      const matchCategory =
        activeCategory === "all" || app.category === activeCategory;

      const matchSearch =
        q === "" ||
        app.name.toLowerCase().includes(q) ||
        app.shortDesc.toLowerCase().includes(q) ||
        app.categoryLabel.toLowerCase().includes(q) ||
        app.subMenus.some((sub) => sub.label.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  const filteredMbaApps = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return STANDALONE_MBA_APPS.filter((app) => {
      const matchCategory =
        activeCategory === "all" ||
        MBA_PILLARS_BY_CATEGORY[activeCategory].includes(app.pillar);

      const matchSearch =
        q === "" ||
        app.title.toLowerCase().includes(q) ||
        app.subtitle.toLowerCase().includes(q) ||
        app.categoryLabel.toLowerCase().includes(q) ||
        app.pillar.toLowerCase().includes(q) ||
        app.features.some(
          (feat) =>
            feat.title.toLowerCase().includes(q) ||
            (feat.desc && feat.desc.toLowerCase().includes(q))
        );

      return matchCategory && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
    return () => cancelAnimationFrame(raf);
  }, [activeCategory, filteredApps.length, filteredMbaApps.length]);

  return (
    <LauncherPageProvider pageId={pageId}>
      <div className="w-full flex-1 flex flex-col font-sans pb-16">
        {/* Portaled ShellHeader Filter Pills (6 Single-Word Functional Axis Pills) */}
        <ShellHeader>
          <HeaderNavPills
            items={adjustCategoryTabsCount(
              BIZ_OPS_CATEGORY_TABS,
              getPageCountDelta(pageId)
            )}
            activeId={activeCategory}
            onSelect={(id) => setSelectedCategory(normalizeBizOpsCategory(id))}
          />
        </ShellHeader>

        {/* Main Page Container */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-4">
          {/* Title & Subtitle */}
          <div className="text-center mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
              <Store className="size-7 text-primary" />
              <span>Business Administration and Operations Management</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-3xl mx-auto">
              {CATEGORY_SUBTITLES[activeCategory]}
            </p>
          </div>

          {/* Applications Grid: 12 Business Operational Boxes + 21 MBA Tools Boxes */}
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
            {filteredMbaApps.map((app) => (
              <ToolsFlipCard
                key={app.id}
                app={app}
                isFav={isFavorite(app.to)}
                toggleFavorite={toggleFavorite}
                gradient={getToolsGradient(app.title)}
              />
            ))}
            {activeCategory === "all" && (
              <MovedCardsGridItems pageId={pageId} searchQuery={searchQuery} />
            )}
          </div>

          {/* Empty Search Result Fallback */}
          {filteredApps.length === 0 &&
            filteredMbaApps.length === 0 &&
            (activeCategory !== "all" ||
              getCardsMovedIntoPage(pageId).length === 0) && (
              <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-border bg-card/40 my-6">
                <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
                  <Search className="size-6" />
                </div>
                <h3 className="text-base font-bold text-foreground">
                  Tidak ada modul ditemukan
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mt-1">
                  Tidak ada aplikasi yang cocok dengan kata kunci &quot;{searchQuery}&quot; pada kategori {activeCategory}.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Reset Filter &amp; Pencarian
                </button>
              </div>
            )}
        </div>
      </div>
    </LauncherPageProvider>
  );
}

export default BusinessOperationsCustomersPage;
