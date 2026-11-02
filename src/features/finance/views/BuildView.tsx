import {
  ArrowLeft,
  Brain,
  Network,
  Briefcase,
  Landmark,
  BookOpen,
  PieChart,
  Home,
  GraduationCap,
  Activity,
  Layers,
  FileSpreadsheet,
  Scale,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { translations } from "../translations";
import { useScrollRestore } from "../hooks/useScrollRestore";
import { MenuListItem } from "../components/MenuListItem";

// Subviews
import { NetWorthView } from "./NetWorthView";
import { AssetsView } from "./AssetsView";
import { HumanCapitalView } from "./HumanCapitalView";
import { BusinessValuationView } from "./BusinessValuationView";
import {
  FinancialHealthView,
  PortfolioRecommendationView,
  MortgageSimulatorView,
  ChildEducationPlanView,
} from "./BuildExtraViews";
import { FinancialReportsView } from "./Phase2Views";
import { PersonalCapTableView, DemographicBenchmarkView } from "./Phase3Views";

export function BuildView({
  currentTab,
  onBack,
  onSelectTab,
  onUnavailable,
}: {
  currentTab: string;
  onBack: () => void;
  onSelectTab?: (tab: string) => void;
  onUnavailable?: () => void;
}) {
  const { ref, onScroll } = useScrollRestore("BuildView_scroll");
  const lang = useLanguage();
  const activeTab = currentTab || "cat_modal";

  // Category: Modal Manusia
  if (activeTab === "cat_modal") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Brain size={20} className="text-purple-500" /> {translations.build.tabs[0][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("human_capital")}
            icon={Brain}
            title="Modal Manusia (Career Capital)"
            desc="Valuasi potensi penghasilan seumur hidup dan modal keahlian diri."
          />
        </div>
      </div>
    );
  }

  // Category: Jaringan
  if (activeTab === "cat_jaringan") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Network size={20} className="text-blue-500" /> {translations.build.tabs[1][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("business_val")}
            icon={Briefcase}
            title="Valuasi Bisnis / Kepemilikan Saham"
            desc="Kalkulator nilai perusahaan dan ekuitas bisnis rintisan."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cap_table")}
            icon={PieChart}
            title="Cap Table Pribadi"
            desc="Pencatatan persentase ekuitas bisnis keluarga & startup."
          />
        </div>
      </div>
    );
  }

  // Category: Portofolio
  if (activeTab === "cat_portofolio") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Briefcase size={20} className="text-amber-500" /> {translations.build.tabs[2][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("portfolio_rec")}
            icon={Briefcase}
            title="Rekomendasi Portofolio"
            desc="Struktur komposisi aset strategis jangka menengah & panjang."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("mortgage")}
            icon={Home}
            title="Kalkulator KPR / Mortgage"
            desc="Simulasi cicilan KPR rumah tinggal dan bunga floating."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("child_edu")}
            icon={GraduationCap}
            title="Rencana Dana Pendidikan Anak"
            desc="Proyeksi biaya kuliah dengan laju inflasi pendidikan tahunan."
          />
        </div>
      </div>
    );
  }

  // Category: Kekayaan Bersih
  if (activeTab === "cat_kekayaan") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Landmark size={20} className="text-green-600" /> {translations.build.tabs[3][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("net_worth")}
            icon={Landmark}
            title="Net Worth Real-Time"
            desc="Kalkulasi total kekayaan bersih (seluruh aset dikurangi liabilitas)."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("assets")}
            icon={Layers}
            title="Inventaris Aset"
            desc="Daftar menyeluruh aset likuid, investasi, dan fisik."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("financial_health")}
            icon={Activity}
            title="Financial Health Score"
            desc="Pemeriksaan skor kesehatan finansial menyeluruh."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("demographic_benchmark")}
            icon={Scale}
            title="Benchmark vs Demografi"
            desc="Bandingkan posisi net worth Anda dengan median usia sebaya."
          />
        </div>
      </div>
    );
  }

  // Category: Pembukuan
  if (activeTab === "cat_pembukuan") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <BookOpen size={20} className="text-orange-400" /> {translations.build.tabs[4][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("reports")}
            icon={FileSpreadsheet}
            title="Laporan Keuangan & Rasio Otomatis"
            desc="Neraca pribadi, arus kas, savings rate, DTI & print PDF."
          />
        </div>
      </div>
    );
  }

  // Subview routing
  if (activeTab === "human_capital") return <HumanCapitalView onBack={() => onSelectTab?.("cat_modal")} />;
  if (activeTab === "business_val") return <BusinessValuationView onBack={() => onSelectTab?.("cat_jaringan")} />;
  if (activeTab === "cap_table") return <PersonalCapTableView onBack={() => onSelectTab?.("cat_jaringan")} />;
  if (activeTab === "portfolio_rec") return <PortfolioRecommendationView onBack={() => onSelectTab?.("cat_portofolio")} />;
  if (activeTab === "mortgage") return <MortgageSimulatorView onBack={() => onSelectTab?.("cat_portofolio")} />;
  if (activeTab === "child_edu") return <ChildEducationPlanView onBack={() => onSelectTab?.("cat_portofolio")} />;
  if (activeTab === "net_worth") return <NetWorthView onBack={() => onSelectTab?.("cat_kekayaan")} />;
  if (activeTab === "assets") return <AssetsView onBack={() => onSelectTab?.("cat_kekayaan")} />;
  if (activeTab === "financial_health") return <FinancialHealthView onBack={() => onSelectTab?.("cat_kekayaan")} />;
  if (activeTab === "demographic_benchmark") return <DemographicBenchmarkView onBack={() => onSelectTab?.("cat_kekayaan")} />;
  if (activeTab === "reports") return <FinancialReportsView onBack={() => onSelectTab?.("cat_pembukuan")} />;

  return null;
}
