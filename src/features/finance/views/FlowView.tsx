import {
  ArrowLeft,
  Wallet,
  RefreshCw,
  Target,
  CreditCard,
  PiggyBank,
  Calculator,
  AlertCircle,
  BookOpen,
  CalendarClock,
  Tags,
  Receipt,
  Banknote,
  ArrowRightLeft,
  Activity,
  TrendingDown,
  Users,
} from "lucide-react";
import { EmiCalculatorView } from "../components/EmiCalculatorView";
import { HomeView } from "./HomeView";
import { HomeView as CreditCardDashboard } from "../components/HomeView";
import { MenuListItem } from "../components/MenuListItem";
import { DebtManagerView } from "./DebtManagerView";
import { SubscriptionManagerView } from "./SubscriptionManagerView";
import { SavingsPlanView } from "./SavingsPlanView";
import { TaxPlannerView } from "./TaxPlannerView";
import { TransactionsView } from "./TransactionsView";
import { DebtSnowballAvalancheView, CashflowForecastView } from "./Phase2Views";
import { TaxLossHarvestingView } from "./Phase3Views";
import { SplitBillView } from "./Phase4Views";
import {
  EmergencyFundView,
  ExpenseCategoryView,
  BillRemindersView,
  BankMutationsView,
} from "./FlowExtraViews";
import { useLanguage } from "../hooks/useLanguage";
import { translations } from "../translations";
import { ScrollContainer } from "../components/ScrollContainer";

export function FlowView({
  currentTab,
  onBack,
  onSelectTab,
  onNavigate,
  onUnavailable,
}: {
  currentTab: string;
  onBack: () => void;
  onSelectTab?: (tab: string) => void;
  onNavigate: (view: string) => void;
  onUnavailable?: () => void;
}) {
  const lang = useLanguage();
  const activeTab = currentTab || "cat_liabilitas";

  if (activeTab === "cat_liabilitas") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <CreditCard size={20} className="text-red-500" /> {translations.flow.tabs[0][lang]}
          </h1>
        </div>
        <ScrollContainer
          id="flow-view-cat-liabilitas"
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("liability")}
            icon={CreditCard}
            title="Manajemen Akun"
            desc={translations.flow.tabs[0].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("snowball")}
            icon={TrendingDown}
            title="Simulator Snowball vs Avalanche"
            desc="Strategi pelunasan utang tercepat & hemat bunga."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("monthly_burden")}
            icon={Calculator}
            title="Estimasi Beban Bulanan"
            desc="Kalkulasi estimasi cicilan dan beban bulanan."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("emi_calculator")}
            icon={Calculator}
            title="Kalkulator Cicilan (EMI)"
            desc="Simulasi dan hitung cicilan kredit."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("bill_reminders")}
            icon={CalendarClock}
            title="Pengingat Tagihan"
            desc="Jatuh tempo langganan dan kredit."
          />
        </ScrollContainer>
      </div>
    );
  }

  if (activeTab === "cat_pengeluaran") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-orange-500" />{" "}
            {translations.flow.tabs[1][lang]}
          </h1>
        </div>
        <ScrollContainer
          id="flow-view-cat-pengeluaran"
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("transactions")}
            icon={BookOpen}
            title="Ledger Transaksi Detail"
            desc="Buku kas, mutasi pengeluaran dan pemasukan rinci."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cashflow")}
            icon={RefreshCw}
            title="Arus Kas"
            desc={translations.flow.tabs[1].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("cashflow_forecast")}
            icon={CalendarClock}
            title="Cash Flow Forecasting (6 Bulan)"
            desc="Proyeksi saldo kas dan surplus likuiditas masa depan."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("budget")}
            icon={Target}
            title="Anggaran"
            desc="Pengaturan porsi anggaran serta manajemen pengeluaran rutin dan langganan."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("expense_cat")}
            icon={Tags}
            title="Kategori Pengeluaran"
            desc="Pengelompokan sistematis setiap pos biaya."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("split_bill")}
            icon={Users}
            title="Split Bill & Patungan"
            desc="Kalkulator pembagian tagihan rombongan dan keluarga."
          />
        </ScrollContainer>
      </div>
    );
  }

  if (activeTab === "cat_kredit") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Banknote size={20} className="text-emerald-400" /> {translations.flow.tabs[2][lang]}
          </h1>
        </div>
        <ScrollContainer
          id="flow-view-cat-kredit"
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("liquidity")}
            icon={Wallet}
            title="Likuiditas"
            desc={translations.flow.tabs[2].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("bank_sync")}
            icon={BookOpen}
            title="Mutasi Rekening"
            desc="Sinkronisasi buku bank digital open API."
          />
        </ScrollContainer>
      </div>
    );
  }

  if (activeTab === "cat_pajak") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Receipt size={20} className="text-rose-500" /> {translations.flow.tabs[3][lang]}
          </h1>
        </div>
        <ScrollContainer
          id="flow-view-cat-pajak"
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("tax")}
            icon={Calculator}
            title="Perencanaan Pajak"
            desc={translations.flow.tabs[3].desc[lang]}
          />
          <MenuListItem
            onClick={() => onSelectTab?.("emergency")}
            icon={AlertCircle}
            title="Dana Darurat"
            desc="Pantauan ketahanan kas darurat likuid."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("tax_harvesting")}
            icon={Receipt}
            title="Tax-Loss Harvesting Simulator"
            desc="Optimalisasi beban pajak portofolio investasi."
          />
        </ScrollContainer>
      </div>
    );
  }

  if (activeTab === "cat_otomatisasi") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onBack()}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Activity size={20} className="text-cyan-500" /> {translations.flow.tabs[4][lang]}
          </h1>
        </div>
        <ScrollContainer
          id="flow-view-cat-otomatisasi"
          className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
        >
          <MenuListItem
            onClick={() => onSelectTab?.("savings")}
            icon={PiggyBank}
            title="Tabungan Berkala"
            desc={translations.flow.tabs[4].desc[lang]}
          />
        </ScrollContainer>
      </div>
    );
  }

  if (activeTab === "liability")
    return <DebtManagerView onBack={() => onSelectTab?.("cat_liabilitas")} />;
  if (activeTab === "liquidity")
    return (
      <CreditCardDashboard
        onNavigate={onNavigate}
        onBack={() => onSelectTab?.("cat_kredit")}
        fixedTab="debit"
        customTitle="Likuiditas & Aset Lancar"
        onEditDebt={() => {}}
      />
    );

  if (activeTab === "cashflow") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button
            onClick={() => onSelectTab?.("cat_pengeluaran")}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <ArrowRightLeft size={20} className="text-orange-500" /> Arus Kas
          </h1>
        </div>
        <div className="flex-1 overflow-y-auto relative pb-20">
          <HomeView
            onNavigate={onNavigate}
            onBack={() => onSelectTab?.("cat_pengeluaran")}
            onUnavailable={onUnavailable}
          />
        </div>
      </div>
    );
  }

  if (activeTab === "budget")
    return (
      <SubscriptionManagerView
        onBack={() => onSelectTab?.("cat_pengeluaran")}
        onSettings={() => onNavigate("sub_settings")}
      />
    );
  if (activeTab === "savings")
    return <SavingsPlanView onBack={() => onSelectTab?.("cat_otomatisasi")} />;
  if (activeTab === "tax") return <TaxPlannerView onBack={() => onSelectTab?.("cat_pajak")} />;
  if (activeTab === "transactions")
    return <TransactionsView onBack={() => onSelectTab?.("cat_pengeluaran")} onNewTransaction={() => onNavigate("new_tx")} onUnavailable={onUnavailable} />;
  if (activeTab === "snowball")
    return <DebtSnowballAvalancheView onBack={() => onSelectTab?.("cat_liabilitas")} />;
  if (activeTab === "cashflow_forecast")
    return <CashflowForecastView onBack={() => onSelectTab?.("cat_pengeluaran")} />;
  if (activeTab === "split_bill")
    return <SplitBillView onBack={() => onSelectTab?.("cat_pengeluaran")} />;
  if (activeTab === "tax_harvesting")
    return <TaxLossHarvestingView onBack={() => onSelectTab?.("cat_pajak")} />;

  if (activeTab === "emergency")
    return <EmergencyFundView onBack={() => onSelectTab?.("cat_pajak")} />;
  if (activeTab === "expense_cat")
    return <ExpenseCategoryView onBack={() => onSelectTab?.("cat_pengeluaran")} />;
  if (activeTab === "bill_reminders")
    return <BillRemindersView onBack={() => onSelectTab?.("cat_liabilitas")} />;
  if (activeTab === "monthly_burden")
    return (
      <div className="p-4 text-foreground flex items-center gap-3 pt-6">
        <button onClick={() => onSelectTab?.("cat_liabilitas")}>
          <ArrowLeft size={24} />
        </button>
        Estimasi Beban Bulanan is currently unavailable.
      </div>
    );
  if (activeTab === "emi_calculator")
    return <EmiCalculatorView onBack={() => onSelectTab?.("cat_liabilitas")} />;
  if (activeTab === "bank_sync")
    return <BankMutationsView onBack={() => onSelectTab?.("cat_kredit")} />;

  return null;
}
