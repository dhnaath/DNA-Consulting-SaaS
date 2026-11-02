import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  CheckCircle2,
  Sparkles,
  NotebookText,
  CalendarDays,
  Compass,
  Gauge,
  MessagesSquare,
  Activity,
  BarChart3,
  LineChart,
  AlertTriangle,
  AlertOctagon,
  Dice5,
  FileText,
  Shield,
  Calculator,
  HeartHandshake,
  Handshake,
  Tag,
  Navigation,
  Building,
  TrendingUp,
  Package,
  Grid2X2,
  Star,
  Wallet,
  CreditCard,
  Droplet,
  Timer,
  Briefcase,
  Target,
  BookOpen,
  Bookmark,
  Lightbulb,
  Eye,
  Key,
  Dumbbell,
  Utensils,
  Music,
  CloudSun,
  Book,
  Plane,
  ShoppingCart,
  Heart,
  HeartPulse,
  Archive,
  GraduationCap,
  Layers,
  FileCheck,
  PackageCheck,
  Boxes,
  Snowflake,
  Pill,
  Flame,
  Globe,
  Film,
  Gamepad2,
  Podcast,
  PenTool,
  Palette,
  Camera,
  Type,
  Code,
  DollarSign,
  ShieldCheck,
  RefreshCw,
  Building2,
  Sprout,
  Search,
  Bell,
  Coins,
  MessageCircle,
  Truck,
  Store,
  Home,
  ScrollText,
  Binary,
  Pocket,
  Vault,
  Luggage,
  ShoppingBag,
  Workflow,
  Scale,
  Umbrella,
  Lock,
  ArrowRightLeft,
  Banknote,
  Receipt,
  Brain,
  Network,
  Landmark,
  PieChart,
  Zap,
  ReceiptText,
  Gift,
  LayoutGrid,
  Waves,
  Gem,
  Award,
  ShieldAlert,
  Megaphone,
  Clock,
  Ticket,
  Mail,
  Smile,
  TrendingDown,
  Stethoscope,
  Moon,
  Wrench,
  Car,
  Fuel,
  Trash2,
  PhoneCall,
  GitFork,
  PartyPopper,
  FileBarChart,
  CalendarCheck,
  UserCheck,
  ThumbsUp,
  Database,
  Scissors,
  BellRing,
  FileCheck2,
  HardDrive,
  FileCode2,
  Flag,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export type NavGroup = {
  title: string;
  isStandalone?: boolean;
  parentCategory?: string;
  sectionCategory?: string;
  items: NavItem[];
};

export const navKonsultan: NavGroup[] = [
  // ============================================================================
  // MASTER WORKSPACES (6 KATEGORI TERPADU)
  // ============================================================================
  {
    title: "Master Workspaces",
    isStandalone: true,
    parentCategory: "Workspace",
    items: [
      { to: "/financial-planning", label: "Financial Planning and Wealth Management", icon: Coins, badge: "5 Tahapan" },
      { to: "/business-operations", label: "Business Administration and Operations Management", icon: Store, badge: "33 Modul" },
      { to: "/work-productivity", label: "Productivity Workspace and Workflow Systems", icon: Briefcase, badge: "9 Modul" },
      { to: "/creative-workspace", label: "Creative Workspace and Media Production", icon: Palette, badge: "6 Modul" },
      { to: "/research-frameworks", label: "Research Foundations and Reference Frameworks", icon: GraduationCap, badge: "6 Modul" },
      { to: "/sharia-values", label: "Islamic Principles and Sharia Values", icon: Scale, badge: "16 Modul" },
      { to: "/personal-life", label: "Personal Life and Profile Management", icon: Heart, badge: "5 Modul" },
      { to: "/family-records", label: "Family Records and Household Planning", icon: Home, badge: "6 Modul" },
      { to: "/public-affairs", label: "Public Relations and Policy Affairs", icon: Landmark, badge: "6 Modul" },
      { to: "/social-networks", label: "Contact Directory and Social Networks", icon: Users, badge: "6 Modul" },
    ],
  },

  // ============================================================================
  // 1. FINANCIAL PLANNING & WEALTH MANAGEMENT (STANDALONE & WEALTH MATRIX)
  // ============================================================================
  {
    title: "Tahapan",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/100-framework", label: "100 Framework", icon: Grid2X2 },
      { to: "/valuasi", label: "Valuasi MAPPI", icon: Building },
    ],
  },
  {
    title: "Commodity Index",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/100-komoditas", label: "100 Komoditas", icon: Package },
      { to: "/10-indeks", label: "10 Indeks Pembangunan", icon: BarChart3 },
    ],
  },
  {
    title: "Self-Shaping",
    isStandalone: false,
    parentCategory: "Phase Side",
    items: [
      { to: "/reliance", label: "Reliance", icon: ShieldCheck },
      { to: "/sufficient", label: "Sufficient", icon: CheckCircle2 },
      { to: "/improvement", label: "Improvement", icon: TrendingUp },
      { to: "/development", label: "Development", icon: Sparkles },
    ],
  },
  {
    title: "Mutual-Mapping",
    isStandalone: false,
    parentCategory: "Phase Side",
    items: [
      { to: "/interact", label: "Interact", icon: MessagesSquare },
      { to: "/interest", label: "Interest", icon: Heart },
      { to: "/intersect", label: "Intersect", icon: Layers },
      { to: "/interdependence", label: "Interdependence", icon: Workflow },
    ],
  },
  {
    title: "Organization-Optimizing",
    isStandalone: false,
    parentCategory: "Phase Side",
    items: [
      { to: "/insider", label: "Insider", icon: Eye },
      { to: "/insight", label: "Insight", icon: Lightbulb },
      { to: "/outward", label: "Outward", icon: Compass },
      { to: "/outlook", label: "Outlook", icon: TrendingUp },
    ],
  },
  {
    title: "Asset & Earning",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/asset", label: "Kuadran Aset", icon: Briefcase },
      { to: "/earning", label: "Kuadran Pendapatan", icon: DollarSign },
      { to: "/financial-health", label: "Kesehatan Finansial", icon: HeartPulse },
      { to: "/liquid-reserves", label: "Liquid Reserves", icon: Coins },
      { to: "/physical-commodities", label: "Physical Commodities", icon: Package },
      { to: "/real-estate", label: "Real Estate", icon: Home },
      { to: "/paper-securities", label: "Paper Securities", icon: ScrollText },
      { to: "/digital-assets", label: "Digital Assets", icon: Binary },
      { to: "/intellectual-property", label: "Intellectual Property", icon: Lightbulb },
      { to: "/investasi?app=bunga-majemuk", label: "Bunga Majemuk", icon: TrendingUp },
      { to: "/investasi?app=roi", label: "Return on Investment (ROI)", icon: Calculator },
    ],
  },
  {
    title: "Liability & Expense",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/liability", label: "Kuadran Liabilitas", icon: CreditCard },
      { to: "/expense", label: "Kuadran Pengeluaran", icon: ShoppingCart },
      { to: "/kredit", label: "Kredit & Utang", icon: CreditCard },
      { to: "/subscriptions", label: "Subscriptions", icon: CreditCard },
      { to: "/budget", label: "Budget", icon: Wallet },
      { to: "/pajak?app=pph21", label: "PPh 21 Personal", icon: Calculator },
      { to: "/pajak?app=saham", label: "Pajak Saham & Dividen", icon: TrendingUp },
      { to: "/pajak?app=properti", label: "Pajak Properti", icon: Briefcase },
      { to: "/pajak?app=ppn", label: "PPN (11%)", icon: ShoppingCart },
    ],
  },
  {
    title: "Wealth Spectrum",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/surety", label: "Tahap 1: Surety", icon: ShieldCheck },
      { to: "/surety?tab=cat_kepatuhan", label: "Kepatuhan Hukum", icon: Scale },
      { to: "/surety?tab=cat_publik", label: "Perlindungan Publik", icon: Globe },
      { to: "/surety?tab=cat_asuransi", label: "Asuransi Pribadi", icon: Umbrella },
      { to: "/surety?tab=cat_dana", label: "Kecukupan Dana", icon: Vault },
      { to: "/surety?tab=cat_proteksi", label: "Proteksi Aset", icon: Lock },
      { to: "/flow", label: "Tahap 2: Flow", icon: Coins },
      { to: "/flow?tab=cat_liabilitas", label: "Beban Liabilitas", icon: CreditCard },
      { to: "/flow?tab=cat_pengeluaran", label: "Pemasukan-Pengeluaran", icon: ArrowRightLeft },
      { to: "/flow?tab=cat_kredit", label: "Kas-Kredit", icon: Banknote },
      { to: "/flow?tab=cat_pajak", label: "Retribusi-Kontribusi", icon: Receipt },
      { to: "/flow?tab=cat_otomatisasi", label: "Sistem Otomatisasi", icon: Activity },
      { to: "/build", label: "Tahap 3: Build", icon: Building },
      { to: "/build?tab=cat_modal", label: "Modal Manusia", icon: Brain },
      { to: "/build?tab=cat_jaringan", label: "Jaringan", icon: Network },
      { to: "/build?tab=cat_portofolio", label: "Portofolio", icon: Briefcase },
      { to: "/build?tab=cat_kekayaan", label: "Kekayaan Bersih", icon: Landmark },
      { to: "/build?tab=cat_pembukuan", label: "Pembukuan", icon: BookOpen },
      { to: "/grow", label: "Tahap 4: Grow", icon: Sprout },
      { to: "/grow?tab=cat_profil", label: "Profil Risiko", icon: Activity },
      { to: "/grow?tab=cat_alokasi", label: "Alokasi", icon: PieChart },
      { to: "/grow?tab=cat_efektif", label: "Efektif-Efisien", icon: Zap },
      { to: "/grow?tab=cat_bunga", label: "Bunga Berbunga", icon: TrendingUp },
      { to: "/grow?tab=cat_rebalance", label: "Rebalancing Periodik", icon: RefreshCw },
      { to: "/legacy", label: "Tahap 5: Legacy", icon: BookOpen },
      { to: "/legacy?tab=cat_pembelajaran", label: "Pembelajaran Seumur Hidup", icon: GraduationCap },
      { to: "/legacy?tab=cat_tatakelola", label: "Tata Kelola yang Baik", icon: Building },
      { to: "/legacy?tab=cat_amal", label: "Kontribusi Amal", icon: HeartHandshake },
      { to: "/legacy?tab=cat_likuidasi", label: "Likuidasi Kewajiban", icon: ReceiptText },
      { to: "/legacy?tab=cat_transfer", label: "Transfer Kekayaan", icon: Gift },
    ],
  },
  {
    title: "Value Treated",
    isStandalone: false,
    parentCategory: "Finance",
    items: [
      { to: "/kurasi/ekonomi", label: "Ekonomi", icon: Coins },
      { to: "/kurasi/statistik", label: "Statistik", icon: LineChart },
      { to: "/kurasi/manajemen", label: "Manajemen", icon: Briefcase },
      { to: "/kurasi/komunikasi", label: "Komunikasi", icon: MessageCircle },
      { to: "/kurasi/logistik", label: "Logistik", icon: Truck },
      { to: "/kurasi/bisnis", label: "Bisnis", icon: Store },
      { to: "/kurasi/administrasi", label: "Administrasi", icon: FileText },
      { to: "/kurasi/akuntansi", label: "Akuntansi", icon: Calculator },
      { to: "/kurasi/asuransi", label: "Asuransi", icon: Shield },
      { to: "/kurasi/investasi", label: "Investasi", icon: TrendingUp },
    ],
  },
  {
    title: "Sharia Principles",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/syariah/akad?app=tabarru", label: "Tabarru'", icon: HeartHandshake },
      { to: "/syariah/akad?app=mudharabah", label: "Mudharabah", icon: Scale },
      { to: "/syariah/akad?app=wakalah", label: "Wakalah", icon: Handshake },
      { to: "/syariah/akad?app=wadiah", label: "Wadiah", icon: Archive },
      { to: "/syariah/akad?app=musyarakah", label: "Musyarakah", icon: Users },
      { to: "/syariah/akad?app=murabahah", label: "Murabahah", icon: Tag },
      { to: "/syariah/akad?app=tamin", label: "Ta'min", icon: Shield },
      { to: "/syariah/akad?app=takaful", label: "Takaful", icon: Users },
      { to: "/syariah/akad?app=tadhamun", label: "Tadhamun", icon: Heart },
      { to: "/syariah/akad?app=ijarah", label: "Ijarah", icon: Building },
      { to: "/syariah/akad?app=qardh", label: "Qardh al-Hasan", icon: Coins },
      { to: "/zakat?app=penghasilan", label: "Zakat Penghasilan", icon: Briefcase },
      { to: "/zakat?app=maal", label: "Zakat Maal", icon: Scale },
      { to: "/zakat?app=fitrah", label: "Zakat Fitrah", icon: Users },
    ],
  },
  {
    title: "Syariah & Muamalah",
    isStandalone: true,
    parentCategory: "Finance",
    items: [
      { to: "/syariah/terlarang?app=riba", label: "Riba", icon: AlertOctagon },
      { to: "/syariah/terlarang?app=gharar", label: "Gharar", icon: ShieldAlert },
      { to: "/syariah/terlarang?app=maysir", label: "Maysir", icon: Dice5 },
    ],
  },

  // ============================================================================
  // 2. 100 STRATEGIC MANAGEMENT FRAMEWORKS (STANDALONE & MINI-MBA)
  // ============================================================================
  {
    title: "Strategic Management",
    isStandalone: true,
    parentCategory: "100 Tools",
    items: [
      { to: "/swot", label: "SWOT Analysis", icon: Target },
      { to: "/tows", label: "TOWS Matrix", icon: Grid2X2 },
      { to: "/pestel", label: "PESTEL Analysis", icon: Globe },
      { to: "/porter", label: "Porter's Five Forces", icon: ShieldAlert },
      { to: "/vrio", label: "VRIO Framework", icon: Gem },
      { to: "/value-chain", label: "Value Chain Analysis", icon: Workflow },
      { to: "/bcg", label: "BCG Matrix", icon: PieChart },
      { to: "/ge-mckinsey", label: "GE-McKinsey Matrix", icon: LayoutGrid },
      { to: "/ansoff", label: "Ansoff Matrix", icon: TrendingUp },
      { to: "/blue-ocean", label: "Blue Ocean Strategy (ERRC)", icon: Waves },
      { to: "/value-disciplines", label: "Value Disciplines Model", icon: Award },
    ],
  },
  {
    title: "Business Model & Value Proposition",
    isStandalone: true,
    parentCategory: "100 Tools",
    items: [
      { to: "/bmc", label: "Business Model Canvas (BMC)", icon: LayoutGrid },
      { to: "/lean-canvas", label: "Lean Canvas", icon: Grid2X2 },
      { to: "/value-proposition-canvas", label: "Value Proposition Canvas", icon: Target },
      { to: "/empathy-map", label: "Empathy Map", icon: Heart },
    ],
  },
  {
    title: "Marketing & Customer Management",
    isStandalone: true,
    parentCategory: "100 Tools",
    items: [
      { to: "/stp", label: "STP Framework", icon: Compass },
      { to: "/marketing-mix", label: "4P/7P Marketing Mix", icon: Store },
      { to: "/customer-journey-map", label: "Customer Journey Map (CJM)", icon: Navigation },
      { to: "/kano-model", label: "Kano Model", icon: LineChart },
      { to: "/product-life-cycle", label: "Product Life Cycle (PLC)", icon: TrendingUp },
    ],
  },
  {
    title: "Operations & Performance Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/six-sigma-dmaic", label: "Six Sigma (DMAIC)", icon: Gauge },
      { to: "/framework/sipoc-diagram", label: "SIPOC Diagram", icon: Workflow },
      { to: "/framework/raci-matrix", label: "RACI Matrix", icon: Users },
      { to: "/framework/gantt-chart", label: "Gantt Chart", icon: CalendarDays },
      { to: "/framework/balanced-scorecard-bsc", label: "Balanced Scorecard (BSC)", icon: Target },
      { to: "/framework/okr-framework", label: "OKR Framework", icon: Award },
      { to: "/framework/eisenhower-matrix", label: "Eisenhower Matrix", icon: Grid2X2 },
    ],
  },
  {
    title: "Financial Management & Business Feasibility",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/analisis-rasio-keuangan", label: "Analisis Rasio Keuangan", icon: Calculator },
      { to: "/framework/capital-budgeting-roi-npv-irr", label: "Capital Budgeting (ROI, NPV, IRR)", icon: Landmark },
      { to: "/framework/break-even-analysis-bep", label: "Break-Even Analysis (BEP)", icon: LineChart },
      { to: "/framework/cost-benefit-analysis-cba", label: "Cost-Benefit Analysis (CBA)", icon: Scale },
      { to: "/framework/business-case-analysis", label: "Business Case Analysis", icon: FileText },
    ],
  },
  {
    title: "Innovation, Entrepreneurship & Design",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/lean-startup-loop", label: "Lean Startup Loop", icon: RefreshCw },
      { to: "/framework/design-thinking", label: "Design Thinking", icon: Lightbulb },
    ],
  },
  {
    title: "Quality Management & Continuous Improvement",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/fishbone-diagram-ishikawa", label: "Fishbone Diagram (Ishikawa)", icon: Workflow },
      { to: "/framework/pdca-cycle", label: "PDCA Cycle", icon: RefreshCw },
      { to: "/framework/house-of-quality-hoq-qfd", label: "House of Quality (HOQ / QFD)", icon: Building },
    ],
  },
  {
    title: "Change Management & Organizational Development",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/mckinsey-7s-framework", label: "McKinsey 7S Framework", icon: Network },
      { to: "/framework/kotters-8-step-change", label: "Kotter's 8-Step Change", icon: TrendingUp },
      { to: "/framework/force-field-analysis", label: "Force Field Analysis", icon: ArrowRightLeft },
    ],
  },
  {
    title: "Public Policy & Program Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/logical-framework-analysis", label: "Logical Framework Analysis", icon: Layers },
      { to: "/framework/stakeholder-power-interest", label: "Stakeholder Power-Interest", icon: Users },
      { to: "/framework/analisis-kebijakan-public-dunn", label: "Analisis Kebijakan Public (Dunn)", icon: Scale },
      { to: "/framework/smart-criteria", label: "SMART Criteria", icon: CheckCircle2 },
    ],
  },
  {
    title: "Decision Making & Analytical Thinking",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/decision-tree-analysis", label: "Decision Tree Analysis", icon: Workflow },
      { to: "/framework/decision-matrix-pugh", label: "Decision Matrix (Pugh)", icon: Grid2X2 },
      { to: "/framework/pareto-analysis-8020", label: "Pareto Analysis (80/20)", icon: LineChart },
      { to: "/framework/analytical-hierarchy-process-ahp", label: "Analytical Hierarchy Process (AHP)", icon: Layers },
      { to: "/framework/six-thinking-hats", label: "Six Thinking Hats", icon: Brain },
    ],
  },
  {
    title: "Economics & Quantitative Analysis",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/supply-demand-analysis", label: "Supply-Demand Analysis", icon: TrendingUp },
      { to: "/framework/input-output-analysis", label: "Input-Output Analysis", icon: ArrowRightLeft },
      { to: "/framework/radar-spider-chart", label: "Radar / Spider Chart", icon: Compass },
    ],
  },
  {
    title: "Product Management & Agile/Scrum",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/product-vision-board", label: "Product Vision Board", icon: LayoutDashboard },
      { to: "/framework/kano-feature-prioritization", label: "Kano Feature Prioritization", icon: Star },
      { to: "/framework/scrum-kanban-board", label: "Scrum / Kanban Board", icon: FolderKanban },
      { to: "/framework/rice-scoring-model", label: "RICE Scoring Model", icon: Calculator },
      { to: "/framework/moscow-prioritization", label: "MoSCoW Prioritization", icon: CheckSquare },
      { to: "/framework/user-story-mapping", label: "User Story Mapping", icon: Layers },
      { to: "/framework/opportunity-solution-tree", label: "Opportunity Solution Tree", icon: Workflow },
      { to: "/framework/dual-track-agile-framework", label: "Dual-Track Agile Framework", icon: RefreshCw },
    ],
  },
  {
    title: "Sustainability, ESG & Risk Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/esg-materiality-matrix", label: "ESG Materiality Matrix", icon: Globe },
      { to: "/framework/risk-assessment-matrix", label: "Risk Assessment Matrix", icon: ShieldAlert },
      { to: "/framework/triple-bottom-line-tbl", label: "Triple Bottom Line (TBL)", icon: Sprout },
      { to: "/framework/circular-economy-butterfly", label: "Circular Economy (Butterfly)", icon: RefreshCw },
      { to: "/framework/fmea-framework", label: "FMEA Framework", icon: AlertTriangle },
      { to: "/framework/iso-31000-risk-management", label: "ISO 31000 Risk Management", icon: ShieldCheck },
      { to: "/framework/carbon-footprint-scope-1-3", label: "Carbon Footprint (Scope 1-3)", icon: Globe },
      { to: "/framework/business-continuity-plan-bcp", label: "Business Continuity Plan (BCP)", icon: Shield },
    ],
  },
  {
    title: "Leadership, Talent & Culture Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/9-box-talent-grid", label: "9-Box Talent Grid", icon: Grid2X2 },
      { to: "/framework/situational-leadership", label: "Situational Leadership", icon: Compass },
      { to: "/framework/johari-window", label: "Johari Window", icon: Eye },
      { to: "/framework/culture-map", label: "Culture Map", icon: Heart },
      { to: "/framework/lencionis-5-dysfunctions", label: "Lencioni’s 5 Dysfunctions", icon: AlertTriangle },
      { to: "/framework/evp-canvas", label: "EVP Canvas", icon: Award },
      { to: "/framework/360-degree-feedback", label: "360-Degree Feedback", icon: RefreshCw },
      { to: "/framework/kirkpatrick-4-level-model", label: "Kirkpatrick 4-Level Model", icon: GraduationCap },
    ],
  },
  {
    title: "Sales, Pricing & Revenue Operations",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/meddpicc-framework", label: "MEDDPICC Framework", icon: Target },
      { to: "/framework/pricing-matrix-elasticity", label: "Pricing Matrix & Elasticity", icon: DollarSign },
      { to: "/framework/unit-economics-clvcac", label: "Unit Economics (CLV/CAC)", icon: Calculator },
      { to: "/framework/spin-selling-framework", label: "SPIN Selling Framework", icon: MessagesSquare },
      { to: "/framework/bant-framework", label: "BANT Framework", icon: CheckCircle2 },
      { to: "/framework/revenue-engine-flywheel", label: "Revenue Engine (Flywheel)", icon: Zap },
      { to: "/framework/value-based-pricing-canvas", label: "Value-Based Pricing Canvas", icon: Gem },
      { to: "/framework/churn-analysis-matrix", label: "Churn Analysis Matrix", icon: TrendingUp },
    ],
  },
  {
    title: "Deep Tech, Innovation & Future Studies",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/technology-readiness-trl", label: "Technology Readiness (TRL)", icon: Binary },
      { to: "/framework/horizon-scanning-futures", label: "Horizon Scanning (Futures)", icon: Compass },
      { to: "/framework/gartner-hype-cycle", label: "Gartner Hype Cycle", icon: LineChart },
      { to: "/framework/doblins-10-types-innovation", label: "Doblin’s 10 Types Innovation", icon: Sparkles },
      { to: "/framework/scamper-ideation-canvas", label: "SCAMPER Ideation Canvas", icon: Lightbulb },
      { to: "/framework/mvp-canvas", label: "MVP Canvas", icon: Briefcase },
      { to: "/framework/open-innovation-model", label: "Open Innovation Model", icon: Globe },
      { to: "/framework/value-proposition-testing", label: "Value Proposition Testing", icon: Target },
    ],
  },
  {
    title: "Public Relations, Crisis & Stakeholder Management",
    isStandalone: false,
    parentCategory: "100 Tools",
    items: [
      { to: "/framework/scr-framework-minto", label: "SCR Framework (Minto)", icon: FileText },
      { to: "/framework/crisis-communication-scct", label: "Crisis Communication (SCCT)", icon: ShieldAlert },
      { to: "/framework/brand-archetypes", label: "Brand Archetypes", icon: Award },
      { to: "/framework/peso-model", label: "PESO Model", icon: Megaphone },
      { to: "/framework/carrolls-csr-pyramid", label: "Carroll’s CSR Pyramid", icon: Building },
      { to: "/framework/issue-life-cycle", label: "Issue Life Cycle", icon: RefreshCw },
      { to: "/framework/stakeholder-engagement", label: "Stakeholder Engagement", icon: HeartHandshake },
      { to: "/framework/press-release-canvas", label: "Press Release Canvas", icon: PenTool },
    ],
  },

  // ============================================================================
  // 3. PRODUCTIVITY, OPERATIONS & OWNERSHIP (STANDALONE + GROUPED UTILITIES)
  // ============================================================================
  {
    title: "Business Administration and Operations Management",
    isStandalone: true,
    parentCategory: "Business",
    items: [
      { to: "/business-operations", label: "Business Administration and Operations Management", icon: Store, badge: "33 Modul" },
      { to: "/peh/vendors", label: "Vendors and Procurement", icon: Truck },
      { to: "/katalog-produk", label: "Products and Stock", icon: Package },
      { to: "/klien", label: "Client Records", icon: Briefcase },
      { to: "/portal", label: "Client Communication", icon: MessagesSquare },
      { to: "/lainnya?app=queue-line", label: "Service Flow", icon: Clock },
      { to: "/expense-tracker", label: "Spending and Assets", icon: Receipt },
      { to: "/statistics", label: "Data and Access", icon: LineChart },
    ],
  },
  {
    title: "Productivity",
    isStandalone: true,
    parentCategory: "Productivity",
    items: [
      { to: "/work-productivity", label: "Productivity Workspace and Workflow Systems", icon: Briefcase, badge: "9 Modul" },
      { to: "/task-manager", label: "Task Manager", icon: CheckSquare },
      { to: "/kalender", label: "Calendar", icon: CalendarDays },
      { to: "/proyek", label: "Project Manager", icon: FolderKanban },
      { to: "/planner", label: "Planner", icon: Clock },
      { to: "/reminder-manager", label: "Reminder Manager", icon: Bell },
      { to: "/pomodoro", label: "Focus Timer", icon: Timer },
      { to: "/eisenhower", label: "Eisenhower Matrix", icon: Grid2X2 },
      { to: "/kanban", label: "Kanban Board", icon: LayoutGrid },
      { to: "/timeline", label: "Timeline Manager", icon: Compass },
      { to: "/countdown", label: "Countdown", icon: Timer },
      { to: "/meeting-manager", label: "Meeting Manager", icon: Users },
      { to: "/deliverable-manager", label: "Deliverable Manager", icon: PackageCheck },
      { to: "/workflow-manager", label: "Workflow Manager", icon: Workflow },
      { to: "/forms", label: "Forms", icon: FileText },
      { to: "/collaboration", label: "Collaboration", icon: ShieldCheck },
      { to: "/notification-center", label: "Notification Center", icon: BellRing },
      { to: "/approval-manager", label: "Approval Manager", icon: FileCheck2 },
      { to: "/template-manager", label: "Template Manager", icon: FileCode2 },
      { to: "/goal-manager", label: "Goal Manager", icon: Target },
      { to: "/milestone-manager", label: "Milestone & Roadmap", icon: Flag },
      { to: "/time-tracker", label: "Time Tracker", icon: Timer },
      { to: "/schedule-manager", label: "Schedule Manager", icon: CalendarDays },
      { to: "/lainnya?app=retro", label: "Review & Retrospective", icon: RefreshCw },
      { to: "/lainnya?app=canvas", label: "Whiteboard & Canvas", icon: LayoutGrid },
      { to: "/lainnya?app=wiki", label: "Knowledge Base (Wiki)", icon: BookOpen },
      { to: "/lainnya?app=workload", label: "Workload & Capacity", icon: Scale },
      { to: "/lainnya?app=sop", label: "SOP & Prosedur Baku", icon: ShieldCheck },
      { to: "/lainnya?app=templates", label: "Template Dokumen Kerja", icon: FileText },
      { to: "/lainnya?app=mailroom", label: "Letter Log", icon: Mail },
      { to: "/lainnya?app=minutes", label: "Risalah Rapat (Minutes)", icon: ScrollText },
    ],
  },
  {
    title: "Business",
    isStandalone: true,
    parentCategory: "Productivity",
    items: [
      { to: "/reports", label: "Laporan Khusus", icon: NotebookText },
    ],
  },
  {
    title: "Knowledge and Learning",
    isStandalone: true,
    parentCategory: "Knowledge and Learning",
    items: [
      { to: "/knowledge-and-learning", label: "Knowledge and Learning", icon: GraduationCap, badge: "7 Modul" },
      { to: "/notes", label: "Notes and Documents", icon: FileText },
      { to: "/knowledge-base", label: "Knowledge Library", icon: BookOpen },
      { to: "/research-manager", label: "Research and Reading", icon: Compass },
      { to: "/courses", label: "Courses and Study", icon: GraduationCap },
      { to: "/languages", label: "Skills and Credentials", icon: Globe },
      { to: "/ideas", label: "Ideas and Design", icon: Palette },
      { to: "/writing", label: "Writing and Code", icon: Code },
    ],
  },

  // ============================================================================
  // 4. PERSONAL, ESSENTIALS & HOUSEHOLD (GROUPED LIFESTYLE, VEHICLE & ESSENTIALS)
  // ============================================================================
  {
    title: "Personal Life",
    isStandalone: true,
    parentCategory: "Personal Life",
    items: [
      { to: "/personal-life", label: "Personal Life", icon: Heart, badge: "5 Modul" },
      { to: "/habit-tracker", label: "Habits and Planning", icon: Flame },
      { to: "/journal", label: "Journaling", icon: BookOpen },
      { to: "/health?tab=workouts", label: "Fitness and Sleep", icon: Dumbbell },
      { to: "/health", label: "Health Records", icon: HeartPulse },
      { to: "/passwords", label: "Personal Tools", icon: Key },
    ],
  },
  {
    title: "Personal",
    isStandalone: true,
    parentCategory: "Personal",
    items: [
      { to: "/vault", label: "Vault", icon: Vault },
      { to: "/vault?tab=ktp", label: "ID Vault", icon: Shield },
      { to: "/vault?tab=certificates", label: "Certificate Vault", icon: Award },
      { to: "/wallet?tab=price-compare", label: "Price Compare", icon: TrendingDown },
      { to: "/wallet?tab=warranty", label: "Warranty Receipts MVP", icon: ShieldCheck },
      { to: "/pocket", label: "Pocket", icon: Pocket },
      { to: "/pouch", label: "Pouch", icon: ShoppingBag },
      { to: "/wallet", label: "Cash Book", icon: Wallet },
    ],
  },
  {
    title: "Home and Leisure",
    isStandalone: true,
    parentCategory: "Home and Leisure",
    items: [
      { to: "/home-and-leisure", label: "Home and Leisure", icon: Home, badge: "6 Modul" },
      { to: "/lainnya?app=home-chores", label: "Household Care", icon: CheckSquare },
      { to: "/recipes", label: "Kitchen and Shopping", icon: Utensils },
      { to: "/lainnya?app=vehicle-identity", label: "Vehicle Records", icon: Car },
      { to: "/lainnya?app=mileage-fuel", label: "Vehicle Care", icon: Fuel },
      { to: "/trips", label: "Travel and Weather", icon: Plane },
      { to: "/movies", label: "Entertainment", icon: Film },
    ],
  },

  // ============================================================================
  // 5. PEOPLE, FAMILY, AND SOCIETY (GROUPED FAMILY, NEIGHBORHOOD & GIVING)
  // ============================================================================
  {
    title: "Family and Community",
    isStandalone: true,
    parentCategory: "Family and Community",
    items: [
      { to: "/family-and-community", label: "Family and Community", icon: Users, badge: "9 Modul" },
      { to: "/lainnya?app=family-tree", label: "Family Records", icon: GitFork },
      { to: "/lainnya?app=emergency-hub", label: "Family Safety", icon: ShieldAlert },
      { to: "/peh/family-budget", label: "Family Life", icon: Heart },
      { to: "/lainnya?app=circle-groups", label: "Staying in Touch", icon: Network },
      { to: "/lainnya?app=gift-tracker", label: "Celebrations", icon: Gift },
      { to: "/lainnya?app=rt-rw-directory", label: "Neighbors and Board", icon: Users },
      { to: "/lainnya?app=public-services-guide", label: "Civic Services", icon: Compass },
      { to: "/lainnya?app=civic-calendar", label: "Civic Agenda", icon: CalendarDays },
      { to: "/zakat", label: "Giving and Impact", icon: Coins },
    ],
  },
  {
    title: "Operations",
    isStandalone: false,
    parentCategory: "Productivity",
    items: [
      { to: "/lainnya?app=quality-check", label: "Quality Check", icon: CheckCircle2 },
      { to: "/lainnya?app=incident-log", label: "Incident Log", icon: AlertTriangle },
      { to: "/lainnya?app=ticket-desk", label: "Ticket Desk", icon: Ticket },
    ],
  },
  {
    title: "Employment",
    isStandalone: false,
    parentCategory: "Productivity",
    items: [
      { to: "/lainnya?app=time-clock", label: "Time Clock", icon: Clock },
      { to: "/lainnya?app=handover-notes", label: "Handover Notes", icon: FileText },
    ],
  },
];

export const otherNavGroups: NavGroup[] = [
  // Master Workspaces (6 Kategori Hub)
  ...navKonsultan
    .filter((g) => g.title === "Master Workspaces")
    .map((g) => ({ ...g, sectionCategory: "Master Workspaces" })),

  // 100 Strategic Management Frameworks (17 Groups)
  ...navKonsultan
    .filter((g) => g.parentCategory === "100 Tools")
    .map((g) => ({ ...g, sectionCategory: "100 Framework" })),

  // Financial Planning & Wealth Management (10 Groups)
  ...navKonsultan
    .filter((g) => g.parentCategory === "Finance" || g.parentCategory === "Phase Side")
    .map((g) => ({ ...g, sectionCategory: "Keuangan & Pasar" })),

  // Kesehatan & Gaya Hidup Pribadi
  ...navKonsultan
    .filter((g) => g.title === "Personal Life" || g.title === "Personal")
    .map((g) => ({ ...g, sectionCategory: "Kesehatan & Personal" })),

  // Home & Rekreasi (Home and Leisure Hub)
  ...navKonsultan
    .filter((g) => g.title === "Home and Leisure" || g.parentCategory === "Home and Leisure")
    .map((g) => ({ ...g, sectionCategory: "Rumah & Rekreasi" })),

  // Keluarga & Komunitas Warga (Family and Community Hub)
  ...navKonsultan
    .filter((g) => g.title === "Family and Community" || g.parentCategory === "Family and Community")
    .map((g) => ({ ...g, sectionCategory: "Keluarga & Komunitas" })),

  // Media Kreatif & Akademi Pembelajaran (Knowledge and Learning Hub)
  ...navKonsultan
    .filter((g) => g.title === "Knowledge and Learning" || g.parentCategory === "Knowledge and Learning" || g.parentCategory === "Creative & Media")
    .map((g) => ({ ...g, sectionCategory: "Kreatif & Akademi" })),

  // Knowledge & Bisnis Lanjutan
  ...navKonsultan
    .filter(
      (g) =>
        g.title === "Business" ||
        g.title === "Business Administration and Operations Management" ||
        g.title === "Business Operations and Customers"
    )
    .map((g) => ({ ...g, sectionCategory: "Knowledge & Bisnis" })),
];

export const navAllSidebar: NavGroup[] = navKonsultan;

