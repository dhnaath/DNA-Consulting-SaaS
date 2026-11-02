import { useState } from "react";
import {
  Building,
  TrendingUp,
  Briefcase,
  Save,
  Check,
  LineChart,
  Landmark,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../lib/AuthContext";
import { useSaveCalculation } from "../lib/useSaveCalculation";

const InputField = ({
  label,
  value,
  onChange,
  prefix,
  suffix,
  type = "number",
  max,
  min = "0",
}: any) => (
  <div className="space-y-2">
    <label className="text-xs font-medium text-foreground/80">{label}</label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-sm font-medium text-muted-foreground">{prefix}</span>
      )}
      <input
        type={type}
        min={min}
        max={max}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className={cn(
          "w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
          prefix && "pl-10",
          suffix && "pr-10",
        )}
      />
      {suffix && (
        <span className="absolute right-3 text-sm font-medium text-muted-foreground">{suffix}</span>
      )}
    </div>
  </div>
);

const SectionCard = ({ title, subtitle, icon: Icon, children, resultBlock }: any) => (
  <div className="flex flex-col lg:flex-row gap-8">
    <div className="flex-1 flex flex-col">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Icon size={18} strokeWidth={2.5} />
            <span className="text-xs font-bold tracking-widest uppercase">{title}</span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">{subtitle}</h2>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
    {resultBlock && (
      <div className="w-full lg:w-[360px] bg-secondary/30 rounded-xl border border-border p-6 sm:p-8 flex flex-col justify-center">
        {resultBlock}
      </div>
    )}
  </div>
);

const SaveButton = ({ onClick, status, disabled, label = "Simpan Hasil" }: any) => (
  <button
    onClick={onClick}
    disabled={disabled || status !== "idle"}
    className={cn(
      "w-full py-3 px-4 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2",
      "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm",
    )}
  >
    {status === "idle" && (
      <>
        <Save className="w-4 h-4" /> {label}
      </>
    )}
    {status === "saving" && "Menyimpan..."}
    {status === "saved" && (
      <>
        <Check className="w-4 h-4" /> Tersimpan
      </>
    )}
  </button>
);

export default function ValuationTools({ activeTab }: { activeTab: string }) {
  const { user } = useAuth();
  const { save: savePropertiIncome, status: statusPropertiIncome } =
    useSaveCalculation("valuasi_properti_income");
  const { save: savePropertiCost, status: statusPropertiCost } =
    useSaveCalculation("valuasi_properti_cost");
  const { save: saveBusinessIncome, status: statusBusinessIncome } =
    useSaveCalculation("valuasi_bisnis_income");
  const { save: saveBusinessMarket, status: statusBusinessMarket } =
    useSaveCalculation("valuasi_bisnis_market");

  // Property State - Income Approach
  const [grossIncome, setGrossIncome] = useState<number>(500000000);
  const [vacancyRate, setVacancyRate] = useState<number>(5);
  const [operatingExpenses, setOperatingExpenses] = useState<number>(100000000);
  const [capRate, setCapRate] = useState<number>(8);

  // Property State - Cost Approach
  const [landArea, setLandArea] = useState<number>(200);
  const [landValue, setLandValue] = useState<number>(15000000);
  const [buildingArea, setBuildingArea] = useState<number>(150);
  const [buildingCost, setBuildingCost] = useState<number>(8000000);
  const [depreciation, setDepreciation] = useState<number>(20);

  // Business State - Income Approach
  const [freeCashFlow, setFreeCashFlow] = useState<number>(1000000000);
  const [discountRate, setDiscountRate] = useState<number>(12);
  const [growthRate, setGrowthRate] = useState<number>(4);

  // Business State - Market Approach
  const [netIncome, setNetIncome] = useState<number>(5000000000);
  const [peRatio, setPeRatio] = useState<number>(15);
  const [equityValue, setEquityValue] = useState<number>(20000000000);
  const [pbvRatio, setPbvRatio] = useState<number>(2.5);

  // Property Calculation (Direct Capitalization)
  const effectiveGrossIncome = grossIncome - grossIncome * (vacancyRate / 100);
  const netOperatingIncome = effectiveGrossIncome - operatingExpenses;
  const propertyValue = capRate > 0 ? netOperatingIncome / (capRate / 100) : 0;

  // Property Calculation (Cost Approach)
  const totalLandValue = landArea * landValue;
  const newBuildingCost = buildingArea * buildingCost;
  const totalDepreciation = newBuildingCost * (depreciation / 100);
  const netBuildingValue = newBuildingCost - totalDepreciation;
  const propertyCostValue = totalLandValue + netBuildingValue;

  // Business Calculation (Gordon Growth Model)
  const businessValue =
    discountRate > growthRate
      ? (freeCashFlow * (1 + growthRate / 100)) / ((discountRate - growthRate) / 100)
      : 0;

  // Business Calculation (Multiples)
  const valueFromPE = netIncome * peRatio;
  const valueFromPBV = equityValue * pbvRatio;

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out pb-12">
      {activeTab === "property" && (
        <div className="space-y-16">
          {/* Property - Income Approach */}
          <SectionCard
            title="Standar Penilaian Indonesia"
            subtitle="Pendekatan Pendapatan"
            icon={Building}
            resultBlock={
              <div className="space-y-8 h-full flex flex-col">
                <div className="space-y-6 flex-1">
                  <div className="space-y-2 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">EGI</span>
                      <span className="font-medium text-foreground">
                        {formatIDR(effectiveGrossIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">NOI</span>
                      <span className="font-medium text-foreground">
                        {formatIDR(netOperatingIncome)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                      Indikasi Nilai Properti
                    </span>
                    <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                      {formatIDR(propertyValue)}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Metode Kapitalisasi Langsung
                    </span>
                  </div>
                </div>
                {user && propertyValue > 0 && (
                  <SaveButton
                    status={statusPropertiIncome}
                    onClick={() =>
                      savePropertiIncome(
                        `Valuasi Properti (Income) — ${formatIDR(propertyValue)}`,
                        { grossIncome, vacancyRate, operatingExpenses, capRate },
                        { effectiveGrossIncome, netOperatingIncome, propertyValue },
                      )
                    }
                  />
                )}
              </div>
            }
          >
            <div className="space-y-6 max-w-xl">
              <InputField
                label="Potensi Pendapatan Kotor (PGI)"
                value={grossIncome}
                onChange={setGrossIncome}
                prefix="Rp"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Tingkat Kekosongan"
                  value={vacancyRate}
                  onChange={setVacancyRate}
                  suffix="%"
                  max="100"
                />
                <InputField
                  label="Beban Operasional (OPEX)"
                  value={operatingExpenses}
                  onChange={setOperatingExpenses}
                  prefix="Rp"
                />
              </div>
              <InputField
                label="Tingkat Kapitalisasi (Cap Rate)"
                value={capRate}
                onChange={setCapRate}
                suffix="%"
                max="100"
              />
            </div>
          </SectionCard>

          {/* Property - Cost Approach */}
          <SectionCard
            title="Standar Penilaian Indonesia"
            subtitle="Pendekatan Biaya"
            icon={Building}
            resultBlock={
              <div className="space-y-8 h-full flex flex-col">
                <div className="space-y-6 flex-1">
                  <div className="space-y-2 pb-6 border-b border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nilai Tanah</span>
                      <span className="font-medium text-foreground">
                        {formatIDR(totalLandValue)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Biaya Baru (RCN)</span>
                      <span className="font-medium text-foreground">
                        {formatIDR(newBuildingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Penyusutan</span>
                      <span className="font-medium text-destructive">
                        - {formatIDR(totalDepreciation)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                      Indikasi Nilai Properti
                    </span>
                    <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                      {formatIDR(propertyCostValue)}
                    </div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Biaya Pengganti Baru (DRC)
                    </span>
                  </div>
                </div>
                {user && propertyCostValue > 0 && (
                  <SaveButton
                    status={statusPropertiCost}
                    onClick={() =>
                      savePropertiCost(
                        `Valuasi Properti (Biaya) — ${formatIDR(propertyCostValue)}`,
                        { landArea, landValue, buildingArea, buildingCost, depreciation },
                        {
                          totalLandValue,
                          newBuildingCost,
                          totalDepreciation,
                          netBuildingValue,
                          propertyCostValue,
                        },
                      )
                    }
                  />
                )}
              </div>
            }
          >
            <div className="space-y-6 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Luas Tanah (m²)"
                  value={landArea}
                  onChange={setLandArea}
                  suffix="m²"
                />
                <InputField
                  label="Nilai Tanah / m²"
                  value={landValue}
                  onChange={setLandValue}
                  prefix="Rp"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Luas Bangunan (m²)"
                  value={buildingArea}
                  onChange={setBuildingArea}
                  suffix="m²"
                />
                <InputField
                  label="Biaya Baru / m²"
                  value={buildingCost}
                  onChange={setBuildingCost}
                  prefix="Rp"
                />
              </div>
              <InputField
                label="Penyusutan Fisik & Fungsi (%)"
                value={depreciation}
                onChange={setDepreciation}
                suffix="%"
                max="100"
              />
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === "business" && (
        <div className="space-y-16">
          {/* Business - DCF Approach */}
          <SectionCard
            title="Penilaian Bisnis"
            subtitle="Pendekatan Pendapatan (DCF)"
            icon={Briefcase}
            resultBlock={
              <div className="space-y-8 h-full flex flex-col justify-center">
                <div className="space-y-6 flex-1 flex flex-col justify-center">
                  {discountRate <= growthRate ? (
                    <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                      Discount rate harus lebih besar dari tingkat pertumbuhan (Growth Rate).
                    </div>
                  ) : (
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">
                        Indikasi Nilai Bisnis
                      </span>
                      <div className="text-3xl font-bold tracking-tight text-foreground mb-1">
                        {formatIDR(businessValue)}
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Gordon Growth Model
                      </span>
                    </div>
                  )}
                </div>
                {user && businessValue > 0 && discountRate > growthRate && (
                  <SaveButton
                    status={statusBusinessIncome}
                    onClick={() =>
                      saveBusinessIncome(
                        `Valuasi Bisnis (DCF) — ${formatIDR(businessValue)}`,
                        { freeCashFlow, discountRate, growthRate },
                        { businessValue },
                      )
                    }
                  />
                )}
              </div>
            }
          >
            <div className="space-y-6 max-w-xl">
              <InputField
                label="Arus Kas Bebas (FCFF/FCFE)"
                value={freeCashFlow}
                onChange={setFreeCashFlow}
                prefix="Rp"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Discount Rate (WACC/Ke)"
                  value={discountRate}
                  onChange={setDiscountRate}
                  suffix="%"
                  max="100"
                />
                <InputField
                  label="Pertumbuhan (Growth Rate)"
                  value={growthRate}
                  onChange={setGrowthRate}
                  suffix="%"
                  max="100"
                />
              </div>
            </div>
          </SectionCard>

          {/* Business - Market Multiples Approach */}
          <SectionCard
            title="Penilaian Bisnis"
            subtitle="Pendekatan Pasar (Multiples)"
            icon={TrendingUp}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl">
              {/* P/E Ratio Multiple */}
              <div className="p-5 sm:p-6 bg-secondary/30 border border-border rounded-xl space-y-6 flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <LineChart className="w-5 h-5" />
                  <h3 className="text-sm font-semibold text-foreground">Price to Earnings (P/E)</h3>
                </div>
                <div className="space-y-4 flex-1">
                  <InputField
                    label="Laba Bersih (Net Income)"
                    value={netIncome}
                    onChange={setNetIncome}
                    prefix="Rp"
                  />
                  <InputField
                    label="P/E Ratio Pembanding"
                    value={peRatio}
                    onChange={setPeRatio}
                    suffix="x"
                  />
                </div>
                <div className="pt-5 border-t border-border/50">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                    Indikasi Ekuitas (P/E)
                  </span>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {formatIDR(valueFromPE)}
                  </div>
                </div>
              </div>

              {/* PBV Ratio Multiple */}
              <div className="p-5 sm:p-6 bg-secondary/30 border border-border rounded-xl space-y-6 flex flex-col">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <Landmark className="w-5 h-5" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Price to Book Value (PBV)
                  </h3>
                </div>
                <div className="space-y-4 flex-1">
                  <InputField
                    label="Nilai Buku Ekuitas"
                    value={equityValue}
                    onChange={setEquityValue}
                    prefix="Rp"
                  />
                  <InputField
                    label="PBV Ratio Pembanding"
                    value={pbvRatio}
                    onChange={setPbvRatio}
                    suffix="x"
                  />
                </div>
                <div className="pt-5 border-t border-border/50">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                    Indikasi Ekuitas (PBV)
                  </span>
                  <div className="text-2xl font-bold tracking-tight text-foreground">
                    {formatIDR(valueFromPBV)}
                  </div>
                </div>
              </div>
            </div>

            {user && (valueFromPE > 0 || valueFromPBV > 0) && (
              <div className="mt-8 pt-6 border-t border-border flex justify-end">
                <div className="w-full sm:w-auto">
                  <SaveButton
                    status={statusBusinessMarket}
                    label="Simpan Hasil Multiples"
                    onClick={() =>
                      saveBusinessMarket(
                        `Valuasi Bisnis (Pasar) — PE: ${formatIDR(valueFromPE)} / PBV: ${formatIDR(valueFromPBV)}`,
                        { netIncome, peRatio, equityValue, pbvRatio },
                        { valueFromPE, valueFromPBV },
                      )
                    }
                  />
                </div>
              </div>
            )}
          </SectionCard>
        </div>
      )}
    </div>
  );
}
