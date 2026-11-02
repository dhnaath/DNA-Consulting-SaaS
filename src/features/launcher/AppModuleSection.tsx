import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlarmClock,
  AlertTriangle,
  Archive,
  ArrowRight,
  ArrowRightLeft,
  Award,
  BarChart3,
  Bell,
  Book,
  BookOpen,
  Bookmark,
  Boxes,
  Briefcase,
  Building2,
  Calculator,
  CalendarCheck,
  CalendarDays,
  CalendarRange,
  Camera,
  Car,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  ClipboardList,
  Clock,
  CloudSun,
  Code,
  Coins,
  Compass,
  CreditCard,
  Database,
  DollarSign,
  Droplet,
  Dumbbell,
  ExternalLink,
  FileBarChart,
  FileCheck,
  FileHeart,
  FileText,
  Film,
  Flag,
  Flame,
  FolderKanban,
  FormInput,
  Fuel,
  Gamepad2,
  Gift,
  GitCommit,
  GitFork,
  Globe,
  GraduationCap,
  Grid2X2,
  HardDrive,
  Heart,
  HeartHandshake,
  HeartPulse,
  Home,
  Hourglass,
  Key,
  Layers,
  LayoutGrid,
  Lightbulb,
  Mail,
  Megaphone,
  MessagesSquare,
  Moon,
  Music,
  Navigation,
  Network,
  NotebookText,
  Package,
  PackageCheck,
  Palette,
  Palmtree,
  PartyPopper,
  PenTool,
  PhoneCall,
  Pill,
  Plane,
  Podcast,
  Receipt,
  RefreshCw,
  RotateCcw,
  Scale,
  Scissors,
  ScrollText,
  Search,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Smile,
  Snowflake,
  Sparkles,
  Star,
  Store,
  ThumbsUp,
  Ticket,
  Timer,
  TrendingUp,
  Truck,
  Type,
  UserCheck,
  Users,
  Users2,
  Utensils,
  Wallet,
  Workflow,
  Wrench,
  X,
  type LucideIcon
} from "lucide-react";

export type AppModulePillar = "all" | "productivity" | "personal" | "people";

export interface StandaloneSubFeature {
  title: string;
  to: string;
  icon: LucideIcon;
}

export interface UnifiedAppModuleDef {
  id: string;
  to: string;
  title: string;
  subtitle: string;
  pillar: "productivity" | "personal" | "people";
  pillarLabel: string;
  category: string;
  categoryLabel: string;
  icon: LucideIcon;
  badge?: string;
  features?: StandaloneSubFeature[];
}

// 1. Raw Productivity Apps (29 Apps)
const RAW_PRODUCTIVITY_APPS = [
  // 1. Execution (Standalone) + 13 Fitur
  {
    id: "execution",
    to: "/proyek",
    title: "Execution",
    subtitle: "Pusat komando eksekusi operasional, manajemen proyek, alur kerja, roadmap, deliverable, dan koordinasi tim.",
    category: "task-workflow",
    categoryLabel: "Task & Workflow",
    icon: CheckSquare,
    badge: "Standalone",
    features: [
      { title: "Project Manager", to: "/proyek", icon: FolderKanban },
      { title: "Workflow Manager", to: "/workflow-manager", icon: Workflow },
      { title: "Milestone & Roadmap", to: "/milestone-manager", icon: Flag },
      { title: "Retro Review", to: "/lainnya?app=retro", icon: RefreshCw },
      { title: "Task Manager", to: "/task-manager", icon: CheckSquare },
      { title: "Kanban Board", to: "/kanban", icon: LayoutGrid },
      { title: "Eisenhower Matrix", to: "/eisenhower", icon: Grid2X2 },
      { title: "Deliverable Manager", to: "/deliverable-manager", icon: PackageCheck },
      { title: "Approval Manager", to: "/approval-manager", icon: ShieldCheck },
      { title: "Time Clock", to: "/lainnya?app=time-clock", icon: Clock },
      { title: "Ticket Desk", to: "/lainnya?app=ticket-desk", icon: Ticket },
      { title: "Handover Notes", to: "/lainnya?app=handover-notes", icon: FileText },
    ],
  },
  // 2. Planning (Standalone) + 8 Fitur
  {
    id: "planning",
    to: "/kalender",
    title: "Planning",
    subtitle: "Sistem perencanaan eksekutif terpadu: integrasi kalender, jadwal, timeline, reminder, pelacak waktu, dan fokus.",
    category: "planning-timeline",
    categoryLabel: "Planning & Timeline",
    icon: CalendarRange,
    badge: "Standalone",
    features: [
      { title: "Calendar", to: "/kalender", icon: CalendarDays },
      { title: "Planner", to: "/planner", icon: Clock },
      { title: "Schedule Manager", to: "/schedule-manager", icon: CalendarRange },
      { title: "Timeline Manager", to: "/timeline", icon: GitCommit },
      { title: "Countdown", to: "/countdown", icon: Hourglass },
      { title: "Reminder Manager", to: "/reminder-manager", icon: AlarmClock },
      { title: "Time Tracker", to: "/time-tracker", icon: Timer },
      { title: "Focus Timer", to: "/pomodoro", icon: Flame },
    ],
  },
  // Workplace (Standalone) + 15 Fitur
  {
    id: "workplace",
    to: "/collaboration",
    title: "Workplace",
    subtitle: "Pusat kolaborasi operasional kantor, manajemen rapat, direktori SDM, wiki pengetahuan, SOP, formulir, dan pelaporan insiden.",
    category: "collaboration-ops",
    categoryLabel: "Collaboration & Ops",
    icon: Users,
    badge: "Standalone",
    features: [
      { title: "Collaboration", to: "/collaboration", icon: Users },
      { title: "Meeting Manager", to: "/meeting-manager", icon: Users2 },
      { title: "Meeting Minutes", to: "/lainnya?app=minutes", icon: FileText },
      { title: "Interaction Manager", to: "/interaction-manager", icon: Network },
      { title: "Whiteboard Canvas", to: "/lainnya?app=canvas", icon: Palette },
      { title: "People Manager", to: "/people-manager", icon: Users },
      { title: "Workload Capacity", to: "/lainnya?app=workload", icon: BarChart3 },
      { title: "Notification Center", to: "/notification-center", icon: Bell },
      { title: "Knowledge Wiki", to: "/lainnya?app=wiki", icon: BookOpen },
      { title: "SOP Library", to: "/lainnya?app=sop", icon: FileCheck },
      { title: "Template Manager", to: "/template-manager", icon: Bookmark },
      { title: "Work Templates", to: "/lainnya?app=templates", icon: ClipboardList },
      { title: "Forms", to: "/forms", icon: FormInput },
      { title: "Incident Log", to: "/lainnya?app=incident-log", icon: AlertTriangle },
      { title: "Letter Log", to: "/lainnya?app=mailroom", icon: Mail },
    ],
  },
  // Business Operations (Standalone) + 13 Fitur
  {
    id: "business-operations",
    to: "/goal-manager",
    title: "Business Operations",
    subtitle: "Pusat tata kelola operasional bisnis: direktori vendor, tarif jasa, agenda surat, OKR performa, alokasi sumber daya, analitik statistik, pencarian data, katalog produk, inventaris, inspeksi mutu QC, dan rantai pasokan dingin.",
    category: "collaboration-ops",
    categoryLabel: "Collaboration & Ops",
    icon: Briefcase,
    badge: "Standalone",
    features: [
      { title: "Vendor Directory", to: "/lainnya?app=vendors", icon: Truck },
      { title: "Service Rates", to: "/lainnya?app=services-ratecard", icon: DollarSign },
      { title: "Mail Log", to: "/lainnya?app=mailroom", icon: Mail },
      { title: "Goal Manager", to: "/goal-manager", icon: TrendingUp },
      { title: "Resource Manager", to: "/resource-manager", icon: Briefcase },
      { title: "Statistics", to: "/statistics", icon: BarChart3 },
      { title: "Search Manager", to: "/search-manager", icon: Search },
      { title: "Access Directory", to: "/lainnya?app=access-matrix", icon: Key },
      { title: "Product Catalog", to: "/katalog-produk", icon: PackageCheck },
      { title: "Inventory", to: "/inventory", icon: Archive },
      { title: "Quality Check", to: "/lainnya?app=quality-check", icon: CheckCircle2 },
      { title: "Batch Track", to: "/lainnya?app=batch-track", icon: Boxes },
      { title: "Cold Chain", to: "/lainnya?app=cold-chain", icon: Snowflake },
    ],
  },
  // Money (Standalone) + 4 Fitur
  {
    id: "money",
    to: "/expense-tracker",
    title: "Money",
    subtitle: "Pusat tata kelola pengeluaran operasional, pemantauan langganan SaaS, inventaris aset, dan repositori akses.",
    category: "utilities-finance",
    categoryLabel: "Utilities & Finance",
    icon: Wallet,
    badge: "Standalone",
    features: [
      { title: "Expense Tracker", to: "/expense-tracker", icon: Receipt },
      { title: "Subscription Manager", to: "/subscription-manager", icon: CreditCard },
      { title: "Asset Manager", to: "/asset-manager", icon: HardDrive },
      { title: "Access & Key Directory", to: "/lainnya?app=access-matrix", icon: Key },
    ],
  },
  // Creative (Standalone) + 5 Fitur
  {
    id: "creative",
    to: "/ideas",
    title: "Creative",
    subtitle: "Studio kreasi ide visual, perancangan desain grafis, fotografi portofolio, penulisan editorial, dan rekayasa kode.",
    category: "collaboration-ops",
    categoryLabel: "Collaboration & Ops",
    icon: Palette,
    badge: "Standalone",
    features: [
      { title: "Ideas Board", to: "/ideas", icon: Lightbulb },
      { title: "Design Studio", to: "/design", icon: PenTool },
      { title: "Photography", to: "/photography", icon: Camera },
      { title: "Writing Editor", to: "/writing", icon: Type },
      { title: "Code Dev", to: "/code", icon: Code },
    ],
  },
  // Learning (Standalone) + 6 Fitur
  {
    id: "learning",
    to: "/courses",
    title: "Learning",
    subtitle: "Platform akselerasi kompetensi profesional: kurikulum kursus, kartu hafalan kilat, ujian sertifikasi, dan daftar bacaan.",
    category: "analytics-standards",
    categoryLabel: "Analytics & Standards",
    icon: GraduationCap,
    badge: "Standalone",
    features: [
      { title: "Courses", to: "/courses", icon: GraduationCap },
      { title: "Flashcards", to: "/flashcards", icon: Layers },
      { title: "Exams", to: "/exams", icon: FileCheck },
      { title: "Languages", to: "/languages", icon: Globe },
      { title: "Training Track", to: "/lainnya?app=training-track", icon: Award },
      { title: "Reading List MVP", to: "/reading", icon: Book },
    ],
  },
  // Knowledge (Standalone) + 11 Fitur
  {
    id: "knowledge",
    to: "/notes",
    title: "Knowledge",
    subtitle: "Pusat dokumentasi second brain, pangkalan data, web clipper, riset referensi, ensiklopedia wiki, dan katalog bacaan.",
    category: "analytics-standards",
    categoryLabel: "Analytics & Standards",
    icon: BookOpen,
    badge: "Standalone",
    features: [
      { title: "Notes", to: "/notes", icon: FileText },
      { title: "Documents", to: "/documents", icon: FileCheck },
      { title: "Database", to: "/database", icon: Database },
      { title: "Web Clipper", to: "/web-clipper", icon: Scissors },
      { title: "Research Manager", to: "/research-manager", icon: Compass },
      { title: "Knowledge Base", to: "/knowledge-base", icon: BookOpen },
      { title: "Wiki Engine", to: "/wiki", icon: BookOpen },
      { title: "Quick Notes", to: "/catatan", icon: NotebookText },
      { title: "Bookmark Manager", to: "/bookmarks", icon: Bookmark },
      { title: "Incoterms Guide", to: "/incoterms", icon: Navigation },
      { title: "Reading List MVP", to: "/reading", icon: Book },
    ],
  },
];

// 2. Raw Personal, Essentials & Household Apps (14 Apps)
const RAW_PERSONAL_APPS = [
  // 1. Personal (Standalone) + 6 Fitur
  {
    id: "personal",
    to: "/proyek-personal",
    title: "Personal",
    subtitle: "Pusat inisiatif mandiri dan manajemen kata sandi kredensial.",
    category: "personal",
    icon: Briefcase,
    badge: "Standalone",
    features: [
      { title: "Personal Projects", to: "/proyek-personal", icon: Briefcase },
      { title: "Passwords", to: "/passwords", icon: Key },
    ],
  },
  // 2. Wellbeing (Standalone) + 13 Fitur
  {
    id: "wellbeing",
    to: "/health",
    title: "Wellbeing",
    subtitle: "Pusat vitalitas eksekutif: pelacak kebiasaan streak, jurnal refleksi harian, rasa syukur, mood, kebugaran, hidrasi, rekam medis, biomarker, kualitas tidur, dan pengingat obat.",
    category: "personal",
    icon: Heart,
    badge: "Standalone",
    features: [
      { title: "Habit Tracker MVP", to: "/habit-tracker", icon: Flame },
      { title: "Daily Journal", to: "/journal", icon: BookOpen },
      { title: "Gratitude Journal", to: "/journal?tab=gratitude", icon: Heart },
      { title: "Mood Tracker MVP", to: "/journal?tab=mood", icon: Smile },
      { title: "Health Tracker", to: "/health", icon: Activity },
      { title: "Workouts", to: "/health?tab=workouts", icon: Dumbbell },
      { title: "Water Intake", to: "/health?tab=water", icon: Droplet },
      { title: "Medical Records", to: "/health?tab=medical-records", icon: FileHeart },
      { title: "Vitals Tracker", to: "/health?tab=vitals", icon: HeartPulse },
      { title: "Body Metrics", to: "/health?tab=body-metrics", icon: Scale },
      { title: "Sleep Quality MVP", to: "/health?tab=sleep", icon: Moon },
      { title: "Skincare Log", to: "/health?tab=skincare", icon: Sparkles },
      { title: "Med Reminder", to: "/lainnya?app=med-reminder", icon: Pill },
    ],
  },
  // 6. Recipes
  {
    id: "recipes",
    to: "/recipes",
    title: "Recipes",
    subtitle: "Kurasi nutrisi penunjang performa kognitif, inventaris bahan dapur, dan meal-prep.",
    category: "household",
    icon: Utensils,
    badge: "Standalone",
    features: [
      { title: "Pantry Inventory", to: "/recipes?tab=pantry", icon: Package },
      { title: "Cook Log", to: "/recipes?tab=cook-log", icon: BookOpen },
      { title: "Expiry Alert", to: "/recipes?tab=expiry", icon: AlertTriangle },
      { title: "Leftover Manager", to: "/recipes?tab=leftovers", icon: RefreshCw },
      { title: "Meal Planner", to: "/recipes?tab=meal-planner", icon: CalendarDays },
    ],
  },
  // 7. Shopping List
  {
    id: "shopping",
    to: "/shopping",
    title: "Shopping List",
    subtitle: "Daftar belanja kebutuhan pribadi, perlengkapan kerja, dan logistik nutrisi.",
    category: "essentials",
    icon: ShoppingCart,
    badge: "Standalone",
  },
  // Leisure (Standalone) + 6 Fitur
  {
    id: "leisure",
    to: "/trips",
    title: "Leisure",
    subtitle: "Pusat rekreasi dan hiburan eksekutif: perencana perjalanan, prakiraan cuaca, kurasi film, game pelepas penat, podcast audio, dan koleksi musik.",
    category: "household",
    icon: Palmtree,
    badge: "Standalone",
    features: [
      { title: "Trip Planner", to: "/trips", icon: Plane },
      { title: "Weather", to: "/weather", icon: CloudSun },
      { title: "Movies", to: "/movies", icon: Film },
      { title: "Games", to: "/games", icon: Gamepad2 },
      { title: "Podcasts", to: "/podcasts", icon: Podcast },
      { title: "Music", to: "/music", icon: Music },
    ],
  },
  // Mobility (Standalone) + 6 Fitur
  {
    id: "mobility",
    to: "/lainnya?app=vehicle-identity",
    title: "Mobility",
    subtitle: "Pusat manajemen armada kendaraan keluarga: buku registrasi BPKB/STNK, log konsumsi BBM, riwayat servis bengkel, siklus aus suku cadang, dan jadwal perpanjangan pajak.",
    category: "essentials",
    icon: Car,
    badge: "Standalone",
    features: [
      { title: "Vehicle Registry", to: "/lainnya?app=vehicle-identity", icon: Car },
      { title: "Fuel Log", to: "/lainnya?app=mileage-fuel", icon: Fuel },
      { title: "Service History", to: "/lainnya?app=vehicle-service", icon: Wrench },
      { title: "Parts Lifecycle", to: "/lainnya?app=parts-lifecycle", icon: RefreshCw },
      { title: "Vehicle Renewals", to: "/lainnya?app=vehicle-renewals", icon: ShieldCheck },
      { title: "Vehicle Logbook", to: "/lainnya?app=vehicle-logbook", icon: CalendarDays },
    ],
  },
  // Utilities
  {
    id: "kalkulator",
    to: "/kalkulator",
    title: "Utilities",
    subtitle: "Alat hitung serbaguna ilmiah, konverter satuan, dan kalkulasi persentase kas.",
    category: "personal",
    icon: Calculator,
    badge: "Standalone",
  },
];

// 3. Raw People, Family & Society Apps (4 Apps)
const RAW_PEOPLE_APPS = [
  // 1. Customer (Standalone) + 12 Fitur
  {
    id: "customer",
    to: "/klien",
    title: "Customer",
    subtitle:
      "Pusat manajemen siklus hubungan klien & pelanggan: direktori klien, portal kolaborasi, pesanan jasa, kontak CRM, laporan kustom, antrean loket, booking jadwal sesi, buku tamu, survei kepuasan CSAT, reward loyalitas, dan histori interaksi.",
    category: "kemitraan",
    categoryLabel: "Kemitraan & Bisnis",
    icon: Briefcase,
    badge: "Standalone",
    features: [
      { title: "Clients Directory", to: "/klien", icon: Briefcase },
      { title: "Collab Portal", to: "/portal", icon: Building2 },
      { title: "Client Orders", to: "/lainnya?app=client-orders", icon: ShoppingBag },
      { title: "Contacts CRM", to: "/contacts", icon: Users },
      { title: "Custom Reports", to: "/lainnya?app=custom-reports", icon: FileBarChart },
      { title: "Queue Line", to: "/lainnya?app=queue-line", icon: Clock },
      { title: "Book Slot", to: "/lainnya?app=book-slot", icon: CalendarCheck },
      { title: "Visitor Log", to: "/lainnya?app=visitor-log", icon: UserCheck },
      { title: "Feedback Loop", to: "/lainnya?app=feedback-loop", icon: ThumbsUp },
      { title: "Loyalty Point", to: "/lainnya?app=loyalty-point", icon: Award },
      { title: "Client Messages", to: "/portal/pesan", icon: MessagesSquare },
      { title: "Interaction Manager", to: "/interaction-manager", icon: Network },
    ],
  },

  // 2. Family (Standalone) + 15 Fitur
  {
    id: "family",
    to: "/people-manager",
    title: "Family",
    subtitle:
      "Pusat tata kelola keluarga besar: silsilah garis keturunan, aturan rumah tangga, arsip memori, profil medis, siaga darurat, lingkaran relasi, musyawarah agenda, pinjam barang, hadiah kerabat, reuni, dan rencana carpool.",
    category: "keluarga",
    categoryLabel: "Keluarga & Relasi",
    icon: Users,
    badge: "Standalone",
    features: [
      { title: "Family Tree", to: "/lainnya?app=family-tree", icon: GitFork },
      { title: "House Rules", to: "/lainnya?app=family-rules", icon: Scale },
      { title: "Family Archive", to: "/lainnya?app=family-archive", icon: Archive },
      { title: "Medical Profile", to: "/lainnya?app=medical-family", icon: HeartHandshake },
      { title: "Disaster Prep", to: "/lainnya?app=disaster-prep", icon: ShieldAlert },
      { title: "Emergency Contacts", to: "/lainnya?app=emergency-hub", icon: PhoneCall },
      { title: "Relation Circles", to: "/lainnya?app=circle-groups", icon: Network },
      { title: "Catchup Reminder", to: "/lainnya?app=catchup-cadence", icon: PhoneCall },
      { title: "Meeting Timeline", to: "/lainnya?app=meeting-timeline", icon: CalendarDays },
      { title: "Borrow Log MVP", to: "/lainnya?app=borrowed-items", icon: ArrowRightLeft },
      { title: "Gift Tracker", to: "/lainnya?app=gift-tracker", icon: Gift },
      { title: "Reunion Planner", to: "/lainnya?app=reunion-planner", icon: PartyPopper },
      { title: "Anniversary Tracker", to: "/lainnya?app=family-anniversary", icon: CalendarDays },
      { title: "Carpool Plan", to: "/lainnya?app=carpool-plan", icon: Car },
      { title: "People Manager", to: "/people-manager", icon: Users },
    ],
  },

  // 3. Community (Standalone) + 14 Fitur
  {
    id: "community",
    to: "/komunitas-warga",
    title: "Community",
    subtitle:
      "Pusat kebersamaan warga pemukiman, kepatuhan sipil, dan filantropi sosial: buku warga RT/RW, papan pengumuman warga, kartu anggota, notula musyawarah warga, panduan faskes/layanan publik, kalender sipil, hisab zakat amal, donasi sedekah, dan kerelawanan.",
    category: "komunitas",
    categoryLabel: "Komunitas & Publik",
    icon: Home,
    badge: "Standalone",
    features: [
      { title: "Neighbor Directory", to: "/lainnya?app=rt-rw-directory", icon: Users },
      { title: "Community Board", to: "/lainnya?app=community-announcements", icon: Megaphone },
      { title: "Membership Card", to: "/lainnya?app=membership-card", icon: CreditCard },
      { title: "Meeting Resolutions", to: "/lainnya?app=meeting-resolutions", icon: ScrollText },
      { title: "Services Guide", to: "/lainnya?app=public-services-guide", icon: Compass },
      { title: "Civic Calendar", to: "/lainnya?app=civic-calendar", icon: CalendarDays },
      { title: "Civil Registry", to: "/lainnya?app=civil-registry", icon: FileCheck },
      { title: "Civic Tax", to: "/lainnya?app=tax-civic", icon: Receipt },
      { title: "Giving", to: "/zakat", icon: Coins },
      { title: "Donation Log MVP", to: "/lainnya?app=donation-tracker", icon: Coins },
      { title: "Volunteer Log MVP", to: "/lainnya?app=volunteer-log", icon: Heart },
      { title: "Neighbor Community", to: "/komunitas-warga", icon: Home },
      { title: "Civic Compliance", to: "/lainnya?app=civic-compliance", icon: Scale },
      { title: "Social Impact", to: "/lainnya?app=social-impact", icon: HeartHandshake },
    ],
  },
];

// Gabungan Lengkap 47 Standalone Apps
export const ALL_APP_MODULES: UnifiedAppModuleDef[] = [
  ...RAW_PRODUCTIVITY_APPS.map((app) => ({
    ...app,
    pillar: "productivity" as const,
    pillarLabel: "Productivity & Operations",
  })),
  ...RAW_PERSONAL_APPS.map((app) => ({
    ...app,
    pillar: "personal" as const,
    pillarLabel: "Personal & Household",
    categoryLabel:
      app.category === "personal"
        ? "Personal & Habits"
        : app.category === "essentials"
        ? "Essentials & Routine"
        : "Household & Domestic",
  })),
  ...RAW_PEOPLE_APPS.map((app) => ({
    ...app,
    pillar: "people" as const,
    pillarLabel: "People & Society",
  })),
];

interface AppModuleSectionProps {
  favorites?: string[];
  toggleFavorite?: (id: string) => void;
  getGradient?: (id: string) => string;
}

export const AppModuleFlipCard = ({
  app,
  isFavorite,
  onToggleFavorite,
}: {
  app: UnifiedAppModuleDef;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const Icon = app.icon;
  const featuresCount = app.features?.length || 0;

  const pillarColorClasses =
    app.pillar === "productivity"
      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200/60 dark:border-blue-800/40"
      : app.pillar === "personal"
      ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/60 dark:border-emerald-800/40"
      : "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border-purple-200/60 dark:border-purple-800/40";

  return (
    <div
      className="group h-[320px] w-full [perspective:1200px]"
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className="relative h-full w-full rounded-2xl transition-transform duration-500 [transform-style:preserve-3d] shadow-sm hover:shadow-md"
        style={{
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* FRONT CARD */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-card border border-border/80 [backface-visibility:hidden] overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`size-11 rounded-xl flex items-center justify-center border shadow-2xs ${pillarColorClasses}`}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase opacity-70">
                  {app.categoryLabel}
                </span>
                <h4 className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-snug">
                  {app.title}
                </h4>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(app.id);
                }}
                className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-amber-500 hover:bg-muted/80 transition-colors cursor-pointer"
                title={isFavorite ? "Hapus dari Favorit" : "Tambah ke Favorit"}
              >
                <Star
                  className={`size-4 ${
                    isFavorite
                      ? "fill-amber-400 text-amber-500"
                      : "text-muted-foreground/60"
                  }`}
                />
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed mt-2">
            {app.subtitle}
          </p>

          {/* Sub-features preview list */}
          <div className="mt-2.5 pt-2.5 border-t border-border/40 flex-1 flex flex-col justify-end">
            <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1.5">
              <span>{featuresCount} Fitur Terintegrasi</span>
              <button
                type="button"
                onClick={() => setIsFlipped(true)}
                className="text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-bold"
              >
                Lihat Semua
                <ChevronRight className="size-3" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 max-h-[58px] overflow-hidden">
              {app.features?.slice(0, 3).map((f) => (
                <Link
                  key={f.title}
                  to={f.to}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary transition-colors text-foreground/80 border border-border/30 truncate max-w-[145px]"
                >
                  <f.icon className="size-2.5 shrink-0 opacity-70" />
                  <span className="truncate">{f.title}</span>
                </Link>
              ))}
              {featuresCount > 3 && (
                <button
                  type="button"
                  onClick={() => setIsFlipped(true)}
                  className="px-1.5 py-0.5 rounded-md text-[10.5px] font-medium bg-muted/40 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  +{featuresCount - 3} lainnya
                </button>
              )}
            </div>
          </div>

          {/* Bottom Launch Button */}
          <div className="mt-3 flex items-center gap-2">
            <Link
              to={app.to}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 active:scale-98 transition-all shadow-2xs"
            >
              <span>Buka Aplikasi</span>
              <ArrowRight className="size-3.5" />
            </Link>
            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="size-9 rounded-xl border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors cursor-pointer shrink-0"
              title="Balik kartu untuk rincian fitur"
            >
              <RotateCcw className="size-4" />
            </button>
          </div>
        </div>

        {/* BACK CARD */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-card border border-border/80 [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden">
          <div className="flex items-center justify-between pb-2 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Icon className="size-4 text-primary" />
              <h5 className="text-sm font-bold text-foreground truncate max-w-[190px]">
                {app.title} — Modul Fitur
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setIsFlipped(false)}
              className="size-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
              title="Kembali ke depan"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar py-2 space-y-1">
            {app.features?.map((f) => (
              <Link
                key={f.title}
                to={f.to}
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/80 text-xs text-foreground/90 transition-colors group/item"
              >
                <div className="flex items-center gap-2 truncate">
                  <f.icon className="size-3.5 text-muted-foreground group-hover/item:text-primary transition-colors shrink-0" />
                  <span className="truncate font-medium">{f.title}</span>
                </div>
                <ChevronRight className="size-3 text-muted-foreground/60 group-hover/item:text-foreground group-hover/item:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-border/40">
            <Link
              to={app.to}
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-2xs"
            >
              <span>Buka {app.title}</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export function AppModuleSection({
  favorites = [],
  toggleFavorite = () => {},
}: AppModuleSectionProps) {
  const [activePillar, setActivePillar] = useState<AppModulePillar>("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Subcategory list based on active pillar
  const availableSubcategories = useMemo(() => {
    const list = ALL_APP_MODULES.filter(
      (app) => activePillar === "all" || app.pillar === activePillar
    );
    const set = new Set<string>();
    list.forEach((app) => set.add(app.categoryLabel));
    return Array.from(set);
  }, [activePillar]);

  // Filtered Apps
  const filteredApps = useMemo(() => {
    return ALL_APP_MODULES.filter((app) => {
      const matchPillar =
        activePillar === "all" || app.pillar === activePillar;
      const matchSub =
        activeSubcategory === "all" || app.categoryLabel === activeSubcategory;

      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        app.title.toLowerCase().includes(q) ||
        app.subtitle.toLowerCase().includes(q) ||
        app.categoryLabel.toLowerCase().includes(q) ||
        app.pillarLabel.toLowerCase().includes(q) ||
        app.features?.some((f) => f.title.toLowerCase().includes(q));

      return matchPillar && matchSub && matchQuery;
    });
  }, [activePillar, activeSubcategory, searchQuery]);

  const countAll = ALL_APP_MODULES.length;
  const countProductivity = ALL_APP_MODULES.filter(
    (a) => a.pillar === "productivity"
  ).length;
  const countPersonal = ALL_APP_MODULES.filter(
    (a) => a.pillar === "personal"
  ).length;
  const countPeople = ALL_APP_MODULES.filter((a) => a.pillar === "people").length;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title & Description */}
      <div className="text-center mb-5 sm:mb-6">
        <h3 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2">
          <LayoutGrid className="size-6 sm:size-7 text-primary" />
          <span>App Module & Master Workspaces</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-3xl mx-auto">
          47 Modul Aplikasi Lengkap dengan fitur terintegrasi, serta 6 Halaman Kategori Master Workspace terpadu.
        </p>
      </div>

      {/* 6 Master Workspaces Hubs Quick Access */}
      <div className="w-full max-w-[1500px] mb-6 p-4 sm:p-5 rounded-3xl bg-card/60 backdrop-blur-md border border-border/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 px-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/25">
              6 Master Workspaces
            </span>
            <span className="text-xs text-muted-foreground font-medium hidden md:inline">
              Halaman Kategori Terpadu
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            Buka workspace terpadu atau jelajahi 47 modul individual di bawah:
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to={"/work-productivity" as any}
            className="flex flex-col p-3 rounded-2xl bg-card hover:bg-muted/60 border border-border/70 hover:border-primary/40 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="size-7 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Briefcase className="size-3.5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-foreground truncate">Work & Ops</span>
            </div>
            <span className="text-[10.5px] text-muted-foreground truncate">9 Modul • Eksekusi</span>
          </Link>

          <Link
            to={"/business-operations" as any}
            className="flex flex-col p-3 rounded-2xl bg-card hover:bg-muted/60 border border-border/70 hover:border-primary/40 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="size-7 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Store className="size-3.5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-foreground truncate">Business</span>
            </div>
            <span className="text-[10.5px] text-muted-foreground truncate">7 Modul • Pasok & CRM</span>
          </Link>

          <Link
            to={"/knowledge-and-learning" as any}
            className="flex flex-col p-3 rounded-2xl bg-card hover:bg-muted/60 border border-border/70 hover:border-primary/40 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="size-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <GraduationCap className="size-3.5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-foreground truncate">Knowledge</span>
            </div>
            <span className="text-[10.5px] text-muted-foreground truncate">7 Modul • Riset & Edukasi</span>
          </Link>

          <Link
            to={"/personal-life" as any}
            className="flex flex-col p-3 rounded-2xl bg-card hover:bg-muted/60 border border-border/70 hover:border-primary/40 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="size-7 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                <Heart className="size-3.5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-foreground truncate">Personal Life</span>
            </div>
            <span className="text-[10.5px] text-muted-foreground truncate">5 Modul • Mind & Health</span>
          </Link>

          <Link
            to={"/home-and-leisure" as any}
            className="flex flex-col p-3 rounded-2xl bg-card hover:bg-muted/60 border border-border/70 hover:border-primary/40 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="size-7 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Home className="size-3.5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-foreground truncate">Home & Leisure</span>
            </div>
            <span className="text-[10.5px] text-muted-foreground truncate">6 Modul • Hunian & Liburan</span>
          </Link>

          <Link
            to={"/family-and-community" as any}
            className="flex flex-col p-3 rounded-2xl bg-card hover:bg-muted/60 border border-border/70 hover:border-primary/40 transition-all group shadow-2xs"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="size-7 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Users className="size-3.5 group-hover:scale-110 transition-transform" />
              </div>
              <span className="text-xs font-bold text-foreground truncate">Family & Social</span>
            </div>
            <span className="text-[10.5px] text-muted-foreground truncate">9 Modul • Warga & Sosial</span>
          </Link>
        </div>
      </div>

      {/* 3 Pillar Tabs Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full mb-3">
        <button
          onClick={() => {
            setActivePillar("all");
            setActiveSubcategory("all");
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activePillar === "all"
              ? "bg-primary text-primary-foreground shadow-md font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Layers className="size-4 shrink-0" />
          <span>Semua Module</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activePillar === "all"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countAll}
          </span>
        </button>

        <button
          onClick={() => {
            setActivePillar("productivity");
            setActiveSubcategory("all");
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activePillar === "productivity"
              ? "bg-primary text-primary-foreground shadow-md font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <CheckSquare className="size-4 shrink-0" />
          <span>Productivity & Operations</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activePillar === "productivity"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countProductivity}
          </span>
        </button>

        <button
          onClick={() => {
            setActivePillar("personal");
            setActiveSubcategory("all");
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activePillar === "personal"
              ? "bg-primary text-primary-foreground shadow-md font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Heart className="size-4 shrink-0" />
          <span>Personal, Essentials & Household</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activePillar === "personal"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countPersonal}
          </span>
        </button>

        <button
          onClick={() => {
            setActivePillar("people");
            setActiveSubcategory("all");
          }}
          className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 ${
            activePillar === "people"
              ? "bg-primary text-primary-foreground shadow-md font-bold"
              : "bg-muted/80 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Users className="size-4 shrink-0" />
          <span>People, Family & Society</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              activePillar === "people"
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-background/80 text-muted-foreground"
            }`}
          >
            {countPeople}
          </span>
        </button>
      </div>

      {/* Subcategory Pills & Search Bar */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 mb-5 max-w-[1500px]">
        {/* Subcategory Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 w-full md:w-auto">
          <button
            onClick={() => setActiveSubcategory("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
              activeSubcategory === "all"
                ? "bg-foreground text-background font-semibold"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Semua Sub-kategori
          </button>
          {availableSubcategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubcategory(sub)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                activeSubcategory === sub
                  ? "bg-foreground text-background font-semibold"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dari 47 app & fitur..."
            className="w-full pl-9 pr-8 py-1.5 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of 47 Apps */}
      {filteredApps.length === 0 ? (
        <div className="w-full py-16 text-center text-muted-foreground">
          <Package className="size-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm font-semibold text-foreground">
            Tidak ada aplikasi yang cocok
          </p>
          <p className="text-xs mt-1">
            Coba ubah kata kunci pencarian atau pilih kategori lain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-[1500px]">
          {filteredApps.map((app) => (
            <AppModuleFlipCard
              key={app.id}
              app={app}
              isFavorite={favorites.includes(app.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AppModuleSection;
