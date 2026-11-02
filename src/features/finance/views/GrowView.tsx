import {
  ArrowLeft,
  TrendingUp,
  Activity,
  PieChart,
  Zap,
  RefreshCw,
  Coins,
  Building,
  DollarSign,
  CandlestickChart,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Award,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { translations } from "../translations";
import { useScrollRestore } from "../hooks/useScrollRestore";
import { MenuListItem } from "../components/MenuListItem";

// Subviews
import { RiskProfileView } from "./RiskProfileView";
import { CryptoAssetsView } from "./CryptoAssetsView";
import { StockMonitorView } from "./StockMonitorView";
import { DividendCalendarView } from "./DividendCalendarView";
import { RebalanceView } from "./RebalanceView";
import {
  BondsSBNView,
  MutualFundView,
  P2PLendingView,
  TradingJournalView,
  DepositoView,
  GoldInvestmentView,
  PropertyInvestmentView,
  ForexView,
  RoboAdvisorView,
} from "./GrowExtraViews";
import {
  AssetAllocationVisualizerView,
  CompoundingDcaCalculatorView,
} from "./Phase2Views";

export function GrowView({
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
  const { ref, onScroll } = useScrollRestore("GrowView_scroll");
  const lang = useLanguage();

  const activeTab = currentTab || "cat_profil";

  // Category: Profil Risiko
  if (activeTab === "cat_profil") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Activity size={20} className="text-rose-500" /> {translations.grow.tabs[0][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("risk_profile")}
            icon={Activity}
            title="Kuesioner Profil Risiko"
            desc="Ketahui tipe toleransi risiko investasi Anda (Konservatif, Moderat, Agresif)."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("robo_advisor")}
            icon={Sparkles}
            title="Robo-Advisor Portofolio"
            desc="Saran alokasi otomatis terpersonalisasi profil toleransi risiko."
          />
        </div>
      </div>
    );
  }

  // Category: Alokasi Aset
  if (activeTab === "cat_alokasi") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <PieChart size={20} className="text-blue-400" /> {translations.grow.tabs[1][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("alloc_visual")}
            icon={PieChart}
            title="Visualisasi Alokasi & Pie Chart"
            desc="Pantau bobot aktual portofolio vs target kelas aset."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("stock_monitor")}
            icon={CandlestickChart}
            title="Saham & Stock Monitor"
            desc="Daftar pantau saham IHSG, analisa fundamental & valuasi."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("mutual_fund")}
            icon={Layers}
            title="Reksadana"
            desc="Reksadana pasar uang, pendapatan tetap, campuran & saham."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("bonds_sbn")}
            icon={Award}
            title="Obligasi Negara & SBN"
            desc="Surat Berharga Negara (ORI, SR, SBR, ST) & obligasi korporasi."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("gold")}
            icon={Coins}
            title="Emas & Logam Mulia"
            desc="Investasi emas fisik Antam/UBS & emas digital hedging inflasi."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("deposito")}
            icon={BookOpen}
            title="Deposito Berjangka"
            desc="Simpanan berjangka bank dengan imbal hasil terjamin LPS."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("property")}
            icon={Building}
            title="Properti Investasi"
            desc="Aset sewa kos, ruko, apartemen & capital gain tanah."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("p2p")}
            icon={TrendingUp}
            title="P2P Lending"
            desc="Pendanaan produktif UMKM dengan imbal hasil kompetitif."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("crypto")}
            icon={Coins}
            title="Crypto Assets"
            desc="Portofolio Bitcoin, Ethereum dan aset digital kripto."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("forex")}
            icon={DollarSign}
            title="Forex & Valuta Asing"
            desc="Diversifikasi mata uang kuat (USD, SGD, JPY, EUR)."
          />
        </div>
      </div>
    );
  }

  // Category: Efektif-Efisien
  if (activeTab === "cat_efektif") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Zap size={20} className="text-yellow-500" /> {translations.grow.tabs[2][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("trading_journal")}
            icon={BookOpen}
            title="Jurnal Trading & Evaluasi"
            desc="Pencatatan histori eksekusi beli/jual & win-loss ratio."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("dividend_cal")}
            icon={Calendar}
            title="Kalender Dividen & Kupon"
            desc="Jadwal cum-date dividen emiten dan pembayaran kupon obligasi."
          />
        </div>
      </div>
    );
  }

  // Category: Bunga Berbunga
  if (activeTab === "cat_bunga") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <TrendingUp size={20} className="text-green-500" /> {translations.grow.tabs[3][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("compounding_dca")}
            icon={TrendingUp}
            title="Kalkulator Bunga Majemuk & DCA"
            desc="Simulasi pertumbuhan investasi rutin berkala (Dollar-Cost Averaging)."
          />
        </div>
      </div>
    );
  }

  // Category: Rebalance
  if (activeTab === "cat_rebalance") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <RefreshCw size={20} className="text-indigo-400" /> {translations.grow.tabs[4][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("rebalance")}
            icon={RefreshCw}
            title="Rebalancing Portofolio Otomatis"
            desc="Penyeimbangan porsi aset agar tetap sejalan dengan target risiko."
          />
        </div>
      </div>
    );
  }

  // Subview routing
  if (currentTab === "risk_profile") return <RiskProfileView onBack={() => onSelectTab?.("cat_profil")} />;
  if (currentTab === "robo_advisor") return <RoboAdvisorView onBack={() => onSelectTab?.("cat_profil")} />;
  if (currentTab === "alloc_visual") return <AssetAllocationVisualizerView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "stock_monitor") return <StockMonitorView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "mutual_fund") return <MutualFundView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "bonds_sbn") return <BondsSBNView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "gold") return <GoldInvestmentView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "deposito") return <DepositoView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "property") return <PropertyInvestmentView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "p2p") return <P2PLendingView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "crypto") return <CryptoAssetsView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "forex") return <ForexView onBack={() => onSelectTab?.("cat_alokasi")} />;
  if (currentTab === "trading_journal") return <TradingJournalView onBack={() => onSelectTab?.("cat_efektif")} />;
  if (currentTab === "dividend_cal") return <DividendCalendarView onBack={() => onSelectTab?.("cat_efektif")} />;
  if (currentTab === "compounding_dca") return <CompoundingDcaCalculatorView onBack={() => onSelectTab?.("cat_bunga")} />;
  if (currentTab === "rebalance") return <RebalanceView onBack={() => onSelectTab?.("cat_rebalance")} />;

  return null;
}
