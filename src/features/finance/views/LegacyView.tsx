import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Building,
  HeartHandshake,
  ReceiptText,
  Gift,
  FileText,
  Lock,
  Users,
  Compass,
  Key,
  Shield,
  Briefcase,
  Heart,
  Landmark,
} from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { translations } from "../translations";
import { useScrollRestore } from "../hooks/useScrollRestore";
import { MenuListItem } from "../components/MenuListItem";

// Subviews
import { GovernanceView } from "./GovernanceView";
import { TrustFundView } from "./TrustFundView";
import { PhilanthropyView } from "./PhilanthropyView";
import { DonationHistoryView } from "./DonationHistoryView";
import { LiquidationView } from "./LiquidationView";
import { SuccessionView } from "./SuccessionView";
import {
  ValuablesInventoryView,
  DigitalWillView,
  EstateTaxView,
  FamilyFoundationView,
} from "./LegacyExtraViews";
import { HeirAllocationMapView } from "./Phase2Views";
import {
  FamilyConstitutionBuilderView,
  DigitalInheritanceManagerView,
} from "./Phase3Views";
import {
  FinancialLiteracyHubView,
  KidsAllowanceEduView,
  AdvisorConsultationGuideView,
} from "./Phase4Views";

export function LegacyView({
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
  const { ref, onScroll } = useScrollRestore("LegacyView_scroll");
  const lang = useLanguage();

  const activeTab = currentTab || "cat_pembelajaran";

  // Category: Pembelajaran
  if (activeTab === "cat_pembelajaran") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <GraduationCap size={20} className="text-sky-500" /> {translations.legacy.tabs[0][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("literacy_hub")}
            icon={GraduationCap}
            title="Financial Literacy Hub"
            desc="Kurikulum edukasi finansial, perencanaan kekayaan & studi kasus."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("kids_allowance")}
            icon={BookOpen}
            title="Allowance & Edukasi Finansial Anak"
            desc="Sistem saku anak 3 toples (belanja, tabung, bagi) & tugas mandiri."
          />
        </div>
      </div>
    );
  }

  // Category: Tata Kelola
  if (activeTab === "cat_tatakelola") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Building size={20} className="text-muted-foreground/70" /> {translations.legacy.tabs[1][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("governance")}
            icon={Compass}
            title="Tata Kelola Keluarga"
            desc="Panduan prinsip, nilai moral & tata kelola aset antargenerasi."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("family_charter")}
            icon={FileText}
            title="Family Constitution & Charter Builder"
            desc="Penyusunan piagam keluarga resmi & aturan suksesi bisnis."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("trust_fund")}
            icon={Lock}
            title="Trust Fund & Perwalian"
            desc="Pengelolaan dana perwalian keluarga yang dilindungi hukum."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("family_foundation")}
            icon={Landmark}
            title="Setup Yayasan Keluarga (Foundation)"
            desc="Pendirian entitas filantropi resmi & yayasan amal nirlaba."
          />
        </div>
      </div>
    );
  }

  // Category: Kontribusi Amal
  if (activeTab === "cat_amal") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <HeartHandshake size={20} className="text-pink-500" /> {translations.legacy.tabs[2][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("philanthropy")}
            icon={HeartHandshake}
            title="Filantropi & Dana CSR"
            desc="Rencana alokasi sedekah, infaq, zakat maal dan wakaf abadi."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("donation_hist")}
            icon={Heart}
            title="Riwayat Donasi & Amal"
            desc="Log penyaluran dana sosial, bukti transfer & dampak sosial."
          />
        </div>
      </div>
    );
  }

  // Category: Likuidasi
  if (activeTab === "cat_likuidasi") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <ReceiptText size={20} className="text-orange-500" /> {translations.legacy.tabs[3][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("liquidation")}
            icon={ReceiptText}
            title="Likuidasi Kewajiban Akhir"
            desc="Prioritas pelunasan utang piutang dan biaya administrasi akhir."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("valuables")}
            icon={Gift}
            title="Inventaris Barang Berharga"
            desc="Katalog perhiasan, logam mulia, karya seni dan barang antik."
          />
        </div>
      </div>
    );
  }

  // Category: Transfer Kekayaan
  if (activeTab === "cat_transfer") {
    return (
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
          <button onClick={onBack} className="text-foreground p-1 hover:text-foreground transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
            <Gift size={20} className="text-teal-400" /> {translations.legacy.tabs[4][lang]}
          </h1>
        </div>
        <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start">
          <MenuListItem
            onClick={() => onSelectTab?.("succession")}
            icon={Briefcase}
            title="Transfer Kekayaan & Suksesi"
            desc="Rencana alih kepemimpinan bisnis keluarga & mandat penerus."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("digital_will")}
            icon={FileText}
            title="Wasiat Digital & Pesan"
            desc="Pesan wasiat tertulis resmi, pembagian wasiat sepertiga harta."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("estate_tax")}
            icon={ReceiptText}
            title="Pajak Estate & Hibah"
            desc="Simulasi BPHTB waris/hibah dan efisiensi peralihan hak tanah."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("heir_map")}
            icon={Users}
            title="Peta Ahli Waris & Alokasi"
            desc="Distribusi proporsional harta warisan bagi para penerima hak."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("digital_inheritance")}
            icon={Key}
            title="Digital Asset Inheritance"
            desc="Protokol penyerahan kunci recovery akun & aset kripto."
          />
          <MenuListItem
            onClick={() => onSelectTab?.("advisor_guide")}
            icon={Shield}
            title="Konsultasi Advisor Warisan"
            desc="Panduan second opinion & checklist notaris/estate planner."
          />
        </div>
      </div>
    );
  }

  // Subview routing
  if (currentTab === "literacy_hub") return <FinancialLiteracyHubView onBack={() => onSelectTab?.("cat_pembelajaran")} />;
  if (currentTab === "kids_allowance") return <KidsAllowanceEduView onBack={() => onSelectTab?.("cat_pembelajaran")} />;
  if (currentTab === "governance") return <GovernanceView onBack={() => onSelectTab?.("cat_tatakelola")} />;
  if (currentTab === "family_charter") return <FamilyConstitutionBuilderView onBack={() => onSelectTab?.("cat_tatakelola")} />;
  if (currentTab === "trust_fund") return <TrustFundView onBack={() => onSelectTab?.("cat_tatakelola")} />;
  if (currentTab === "family_foundation") return <FamilyFoundationView onBack={() => onSelectTab?.("cat_tatakelola")} />;
  if (currentTab === "philanthropy") return <PhilanthropyView onBack={() => onSelectTab?.("cat_amal")} />;
  if (currentTab === "donation_hist") return <DonationHistoryView onBack={() => onSelectTab?.("cat_amal")} />;
  if (currentTab === "liquidation") return <LiquidationView onBack={() => onSelectTab?.("cat_likuidasi")} />;
  if (currentTab === "valuables") return <ValuablesInventoryView onBack={() => onSelectTab?.("cat_likuidasi")} />;
  if (currentTab === "succession") return <SuccessionView onBack={() => onSelectTab?.("cat_transfer")} />;
  if (currentTab === "digital_will") return <DigitalWillView onBack={() => onSelectTab?.("cat_transfer")} />;
  if (currentTab === "estate_tax") return <EstateTaxView onBack={() => onSelectTab?.("cat_transfer")} />;
  if (currentTab === "heir_map") return <HeirAllocationMapView onBack={() => onSelectTab?.("cat_transfer")} />;
  if (currentTab === "digital_inheritance") return <DigitalInheritanceManagerView onBack={() => onSelectTab?.("cat_transfer")} />;
  if (currentTab === "advisor_guide") return <AdvisorConsultationGuideView onBack={() => onSelectTab?.("cat_transfer")} />;

  return null;
}
