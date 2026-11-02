import React, { useState } from "react";
import {
  TrendingUp,
  Calculator,
  Save,
  Check,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Percent,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useAuth } from "../../syariah/lib/AuthContext";
import { useSaveCalculation } from "../../syariah/lib/useSaveCalculation";

export type InvestmentAppType = "bunga-majemuk" | "roi";

export interface InvestmentDetailInfo {
  id: InvestmentAppType;
  title: string;
  badge: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  rumusUtama: {
    formula: string;
    description: string;
  };
  prinsipPenting: { title: string; desc: string }[];
  skemaAlur: { step: number; title: string; desc: string }[];
  panduanStrategi: string[];
}

export const INVESTMENT_APPS: Record<InvestmentAppType, InvestmentDetailInfo> = {
  "bunga-majemuk": {
    id: "bunga-majemuk",
    title: "Bunga Majemuk",
    badge: "Compound Interest",
    category: "Investasi & Aset",
    icon: TrendingUp,
    tagline:
      "Simulasi akumulasi kekayaan jangka panjang melalui daya ungkit bunga berbunga dan kontribusi rutin berkala.",
    description:
      "Bunga majemuk (compound interest) adalah proses penambahan bunga yang dihitung tidak hanya dari modal pokok awal, tetapi juga dari seluruh akumulasi bunga atau imbal hasil pada periode-periode sebelumnya. Semakin panjang horison investasi dan semakin disiplin setoran berkala (Dollar Cost Averaging), kurva pertumbuhan aset akan melesat secara eksponensial.",
    rumusUtama: {
      formula: "A = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]",
      description:
        "P = Modal Pokok Awal, PMT = Setoran Rutin Bulanan, r = Imbal Hasil Tahunan, n = Frekuensi Kompon (12x/thn), t = Jangka Waktu (Tahun).",
    },
    prinsipPenting: [
      {
        title: "Aturan 72 (Rule of 72)",
        desc: "Rumus praktis menghitung estimasi tahun melipatgandakan modal: 72 dibagi estimasi return tahunan. (Misal return 8% = 72/8 = modal berlipat ganda dlm 9 tahun).",
      },
      {
        title: "Time in the Market",
        desc: "Waktu jauh lebih menentukan daripada waktu masuk (timing). Memulai 5 tahun lebih awal menghasilkan efek eksponensial yang sulit dikejar dengan modal besar belakangan.",
      },
      {
        title: "Reinvestasi Imbal Hasil",
        desc: "Jangan menarik dividen atau kupon selama fase akumulasi; biarkan keuntungan menghasilkan keuntungan baru.",
      },
      {
        title: "Efek Dollar Cost Averaging (DCA)",
        desc: "Menambah modal secara teratur tiap bulan memperhalus risiko volatilitas harga dan melipatgandakan saldo pokok investasi.",
      },
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Tentukan Modal Pokok Awal",
        desc: "Masukkan dana awal yang sudah dialokasikan khusus untuk investasi jangka panjang.",
      },
      {
        step: 2,
        title: "Tetapkan Komitmen Rutin Bulanan",
        desc: "Alokasikan porsi tabungan rutin dari penghasilan bulanan untuk menambah modal secara disiplin.",
      },
      {
        step: 3,
        title: "Pilih Asumsi Return Realistis",
        desc: "Gunakan benchmark instrumen investasi yang dipilih (misal: SBN 6-7%, Reksadana Campuran 8-10%, Saham/Indeks 10-14%).",
      },
      {
        step: 4,
        title: "Pantau Kurva Eksponensial",
        desc: "Perhatikan titik belok (inflection point) di mana bunga yang dihasilkan melebihi total modal yang disetor sendiri.",
      },
    ],
    panduanStrategi: [
      "Fokus pada konsistensi bulanan daripada mencari instrumen berisiko tinggi tanpa manajemen portofolio.",
      "Perhitungkan inflasi riil (rata-rata 3-4% per tahun di Indonesia) saat menentukan target nominal masa depan.",
      "Pastikan dana darurat (3-6 bulan pengeluaran) telah terpenuhi sebelum mengunci dana dalam investasi jangka panjang.",
    ],
  },
  roi: {
    id: "roi",
    title: "Return on Investment (ROI)",
    badge: "Evaluasi Portofolio & CAGR",
    category: "Investasi & Aset",
    icon: Calculator,
    tagline:
      "Pengukuran tingkat profitabilitas, persentase imbal hasil total, dan laju pertumbuhan majemuk tahunan (CAGR).",
    description:
      "Return on Investment (ROI) adalah indikator keuangan universal untuk mengukur efisiensi atau profitabilitas suatu instrumen investasi relatif terhadap modal yang dikeluarkan. Melalui metrik Annualized ROI (CAGR), Anda dapat membandingkan performa dua atau lebih instrumen dengan durasi kepemilikan berbeda secara objektif (apple-to-apple).",
    rumusUtama: {
      formula: "ROI (%) = [(Nilai Akhir + Arus Kas - Modal Awal) / Modal Awal] × 100%",
      description:
        "CAGR (Annualized Return) = (Nilai Akhir / Modal Awal)^(1 / Durasi Tahun) - 1. Memperhitungkan efek waktu per tahun secara akurat.",
    },
    prinsipPenting: [
      {
        title: "Memperhitungkan Arus Kas Masuk",
        desc: "ROI komprehensif tidak hanya menghitung selisih harga jual (capital gain), tetapi juga seluruh dividen, sewa, atau kupon yang diterima.",
      },
      {
        title: "Annualized ROI (CAGR)",
        desc: "Investasi dengan ROI 50% selama 5 tahun (~8.4% per tahun) berbeda signifikansi dengan ROI 50% selama 1 tahun. Selalu gunakan annualized return untuk pembanding.",
      },
      {
        title: "Benchmark Inflasi & Deposito",
        desc: "ROI riil adalah ROI nominal dikurangi laju inflasi. Investasi dinilai sehat apabila menghasilkan return di atas suku bunga bebas risiko (risk-free rate).",
      },
      {
        title: "Pajak & Biaya Transaksi",
        desc: "Perhitungkan biaya broker, biaya kustodian, dan pajak final (PPh final atas dividen/penjualan) untuk mendapatkan ROI bersih (Net ROI).",
      },
    ],
    skemaAlur: [
      {
        step: 1,
        title: "Catat Modal Pokok Pembelian",
        desc: "Masukkan harga beli aset termasuk biaya fee transaksi awal.",
      },
      {
        step: 2,
        title: "Tentukan Nilai Terkini / Nilai Jual",
        desc: "Gunakan harga pasar terkini (mark-to-market) atau nilai realisasi penjualan aset.",
      },
      {
        step: 3,
        title: "Masukkan Arus Kas Tambahan",
        desc: "Tambahkan total dividen saham, kupon obligasi, atau uang sewa properti yang pernah diterima.",
      },
      {
        step: 4,
        title: "Evaluasi Kinerja & Ambil Keputusan",
        desc: "Gunakan data ROI dan CAGR untuk menentukan apakah aset layak dipertahankan (hold), ditambah (buy), atau direalokasi (rebalance).",
      },
    ],
    panduanStrategi: [
      "ROI positif di bawah inflasi berarti secara riil nilai riil daya beli modal Anda berkurang.",
      "Jangan abaikan profil risiko: ROI tinggi selalu berbanding lurus dengan potensi volatilitas dan drawdown yang lebih besar.",
      "Gunakan metrik CAGR saat mengevaluasi kinerja manajer investasi atau portofolio tahunan Anda.",
    ],
  },
};

interface StandaloneInvestmentAppProps {
  appId: InvestmentAppType;
  onNavigateApp?: (id: InvestmentAppType) => void;
}

export function StandaloneInvestmentApp({
  appId,
  onNavigateApp,
}: StandaloneInvestmentAppProps) {
  const data = INVESTMENT_APPS[appId] || INVESTMENT_APPS["bunga-majemuk"];
  const { user } = useAuth();

  // Save calculation hooks
  const { save: saveCompound, status: statusCompound } =
    useSaveCalculation("investasi_bunga_majemuk");
  const { save: saveRoi, status: statusRoi } = useSaveCalculation("investasi_roi");

  // 1. State Bunga Majemuk
  const [principal, setPrincipal] = useState<number>(10000000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1500000);
  const [years, setYears] = useState<number>(10);
  const [annualReturn, setAnnualReturn] = useState<number>(8);
  const [compoundFrequency, setCompoundFrequency] = useState<"monthly" | "yearly">("monthly");

  // 2. State ROI
  const [initialInvestment, setInitialInvestment] = useState<number>(50000000);
  const [finalValue, setFinalValue] = useState<number>(75000000);
  const [investmentDuration, setInvestmentDuration] = useState<number>(2.5);
  const [additionalCashflow, setAdditionalCashflow] = useState<number>(3000000); // dividen/sewa

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleSwitchApp = (id: InvestmentAppType) => {
    if (onNavigateApp) {
      onNavigateApp(id);
    }
  };

  const IconComponent = data.icon;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/70 border border-border/40"
          >
            <ArrowLeft size={14} />
            <span>Kembali ke Launcher</span>
          </Link>
          <span className="text-muted-foreground/50">/</span>
          <span className="text-xs font-semibold text-primary px-2.5 py-1 rounded-md bg-primary/10">
            Kategori: Asset & Investasi
          </span>
        </div>

        {/* Quick App Switcher */}
        <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/60 self-start sm:self-auto overflow-x-auto">
          {(["bunga-majemuk", "roi"] as InvestmentAppType[]).map((typeKey) => {
            const item = INVESTMENT_APPS[typeKey];
            const isActive = appId === typeKey;
            return (
              <button
                key={typeKey}
                onClick={() => handleSwitchApp(typeKey)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5",
                  isActive
                    ? "bg-background text-foreground shadow-sm font-semibold border border-border/80"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                )}
              >
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-card to-secondary/30 border border-border/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
                {data.badge}
              </span>
              <span className="text-xs text-muted-foreground">Kategori: {data.category}</span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {data.title}
              </h1>
            </div>

            <p className="text-sm font-medium text-foreground/80 leading-relaxed">
              {data.tagline}
            </p>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Right Icon Box */}
          <div className="shrink-0 flex md:flex-col items-center gap-4 bg-muted/40 p-4 rounded-xl border border-border/60">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <IconComponent className="w-7 h-7" />
            </div>
            <div className="text-left md:text-center">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
                Fokus Metrik
              </span>
              <span className="text-sm font-extrabold text-primary">
                {appId === "bunga-majemuk" ? "Future Value (FV)" : "ROI & CAGR"}
              </span>
            </div>
          </div>
        </div>

        {/* Rumus Banner Box */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row gap-3 items-start bg-primary/5 p-4 rounded-xl border border-primary/15">
          <Percent className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-mono font-bold text-foreground">
              {data.rumusUtama.formula}
            </p>
            <span className="text-[11px] text-muted-foreground block">
              {data.rumusUtama.description}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Info + Interactive Standalone Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Prinsip, Alur, Edukasi (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card Prinsip Penting */}
          <div className="bg-card rounded-xl border border-border/60 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Sparkles size={15} className="text-primary" />
              <span>Prinsip Utama Investasi</span>
            </h3>
            <div className="space-y-3">
              {data.prinsipPenting.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/40 border border-border/40">
                  <span className="text-xs font-bold text-foreground block">{p.title}</span>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Alur Eksekusi */}
          <div className="bg-card rounded-xl border border-border/60 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <BarChart3 size={15} className="text-primary" />
              <span>Langkah Perencanaan & Evaluasi</span>
            </h3>
            <div className="space-y-2.5">
              {data.skemaAlur.map((step) => (
                <div key={step.step} className="flex gap-3 items-start p-2.5 rounded-lg bg-muted/30 border border-border/30">
                  <div className="w-5 h-5 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                    {step.step}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-foreground block">{step.title}</span>
                    <span className="text-[11px] text-muted-foreground block leading-relaxed">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Standalone Simulator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-2xl border border-border/80 p-6 sm:p-7 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Calculator size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    Kalkulator Standalone {data.title}
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Simulasi live interaktif & proyeksi finansial
                  </span>
                </div>
              </div>
            </div>

            {/* SIMULATOR 1: BUNGA MAJEMUK */}
            {appId === "bunga-majemuk" && (() => {
              const periodsPerYear = compoundFrequency === "monthly" ? 12 : 1;
              const ratePerPeriod = (annualReturn / 100) / periodsPerYear;
              const totalPeriods = years * periodsPerYear;
              const periodicContribution = compoundFrequency === "monthly" ? monthlyContribution : monthlyContribution * 12;

              let futureValue = principal;
              let totalDeposited = principal;

              // Hitung pertumbuhan periode demi periode
              for (let i = 0; i < totalPeriods; i++) {
                futureValue = futureValue * (1 + ratePerPeriod) + periodicContribution;
                totalDeposited += periodicContribution;
              }

              const totalInterest = Math.max(0, futureValue - totalDeposited);
              const multiplier = totalDeposited > 0 ? (futureValue / totalDeposited).toFixed(2) : "1.00";
              const ruleOf72Years = annualReturn > 0 ? (72 / annualReturn).toFixed(1) : "—";

              // Milestones tiap periode tahun
              const milestoneYears = [1, Math.min(3, years), Math.min(5, years), Math.min(10, years), years]
                .filter((v, i, arr) => arr.indexOf(v) === i && v <= years)
                .sort((a, b) => a - b);

              const milestones = milestoneYears.map((yr) => {
                const pCount = yr * periodsPerYear;
                let fv = principal;
                let dep = principal;
                for (let i = 0; i < pCount; i++) {
                  fv = fv * (1 + ratePerPeriod) + periodicContribution;
                  dep += periodicContribution;
                }
                return {
                  year: yr,
                  totalDeposited: dep,
                  futureValue: Math.round(fv),
                  interest: Math.max(0, Math.round(fv - dep)),
                };
              });

              return (
                <div className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Modal Awal (Principal)</span>
                        <span className="text-primary font-bold">{formatIDR(principal)}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={200000000}
                        step={1000000}
                        value={principal}
                        onChange={(e) => setPrincipal(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Setoran Rutin Bulanan (DCA)</span>
                        <span className="text-primary font-bold">{formatIDR(monthlyContribution)} / bln</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={25000000}
                        step={250000}
                        value={monthlyContribution}
                        onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground flex justify-between">
                          <span>Jangka Waktu</span>
                          <span className="text-primary font-bold">{years} Tahun</span>
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={35}
                          step={1}
                          value={years}
                          onChange={(e) => setYears(Number(e.target.value))}
                          className="w-full accent-primary mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground flex justify-between">
                          <span>Estimasi Return Tahunan</span>
                          <span className="text-primary font-bold">{annualReturn}% / thn</span>
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={25}
                          step={0.5}
                          value={annualReturn}
                          onChange={(e) => setAnnualReturn(Number(e.target.value))}
                          className="w-full accent-primary mt-1"
                        />
                      </div>
                    </div>

                    {/* Pilihan Frekuensi Kompon */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border/40 text-xs">
                      <span className="font-medium text-muted-foreground">Frekuensi Kompon:</span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => setCompoundFrequency("monthly")}
                          className={cn(
                            "px-2.5 py-1 rounded text-xs font-semibold transition-all",
                            compoundFrequency === "monthly"
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Bulanan (12x/thn)
                        </button>
                        <button
                          type="button"
                          onClick={() => setCompoundFrequency("yearly")}
                          className={cn(
                            "px-2.5 py-1 rounded text-xs font-semibold transition-all",
                            compoundFrequency === "yearly"
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          Tahunan (1x/thn)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-xl bg-muted/60 border border-border/60 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Modal Disetor Mandiri:</span>
                      <span className="font-bold text-foreground">{formatIDR(totalDeposited)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Imbal Hasil (Bunga Majemuk):</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">+{formatIDR(totalInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Rasio Penggandaan (Multiplier):</span>
                      <span className="font-semibold text-primary">{multiplier}x Modal</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Waktu Modal Berlipat Ganda (Rule of 72):</span>
                      <span className="font-semibold text-foreground">~{ruleOf72Years} Tahun</span>
                    </div>

                    <div className="w-full h-px bg-border/80 my-2" />

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Proyeksi Total Nilai Portofolio (Tahun ke-{years}):
                        </span>
                        <span className="text-2xl font-extrabold text-primary">
                          {formatIDR(Math.round(futureValue))}
                        </span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[11px] text-muted-foreground block">
                          Porsi Keuntungan Murni:
                        </span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {futureValue > 0 ? ((totalInterest / futureValue) * 100).toFixed(1) : 0}% dari Total
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Milestone Table */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                      Progres Pertumbuhan Bertahap (Milestones):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {milestones.map((m) => (
                        <div key={m.year} className="p-2.5 rounded-lg bg-muted/40 border border-border/40 text-center">
                          <span className="text-[10px] text-muted-foreground block font-semibold uppercase">
                            Tahun {m.year}
                          </span>
                          <span className="text-xs font-bold text-foreground block mt-0.5">
                            {formatIDR(m.futureValue)}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                            +{formatIDR(m.interest)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {user && futureValue > 0 && (
                    <button
                      onClick={() =>
                        saveCompound(
                          `Bunga Majemuk — ${formatIDR(Math.round(futureValue))} (${years} Thn @ ${annualReturn}%)`,
                          { principal, monthlyContribution, years, annualReturn, compoundFrequency },
                          { totalDeposited, totalInterest, futureValue: Math.round(futureValue) }
                        )
                      }
                      disabled={statusCompound !== "idle"}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm"
                    >
                      {statusCompound === "idle" && (
                        <>
                          <Save size={15} /> Simpan ke Riwayat Perhitungan
                        </>
                      )}
                      {statusCompound === "saving" && "Menyimpan ke akun..."}
                      {statusCompound === "saved" && (
                        <>
                          <Check size={15} /> Berhasil Tersimpan
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* SIMULATOR 2: ROI */}
            {appId === "roi" && (() => {
              const totalReturn = finalValue + additionalCashflow;
              const netProfit = totalReturn - initialInvestment;
              const roiPercent = initialInvestment > 0 ? (netProfit / initialInvestment) * 100 : 0;

              // CAGR / Annualized ROI
              const annualizedROI =
                initialInvestment > 0 && investmentDuration > 0
                  ? (Math.pow(totalReturn / initialInvestment, 1 / investmentDuration) - 1) * 100
                  : 0;

              const isProfitable = netProfit >= 0;
              const beatsInflation = annualizedROI >= 4.0; // Benchmark inflasi RI ~4%

              return (
                <div className="space-y-5">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Modal Investasi Awal (Initial Capital)</span>
                        <span className="text-primary font-bold">{formatIDR(initialInvestment)}</span>
                      </label>
                      <input
                        type="range"
                        min={1000000}
                        max={300000000}
                        step={1000000}
                        value={initialInvestment}
                        onChange={(e) => setInitialInvestment(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground flex justify-between">
                        <span>Nilai Akhir / Realisasi Penjualan (Final Value)</span>
                        <span className="text-primary font-bold">{formatIDR(finalValue)}</span>
                      </label>
                      <input
                        type="range"
                        min={0}
                        max={500000000}
                        step={1000000}
                        value={finalValue}
                        onChange={(e) => setFinalValue(Number(e.target.value))}
                        className="w-full accent-primary mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-foreground flex justify-between">
                          <span>Durasi Investasi (Tahun)</span>
                          <span className="text-primary font-bold">{investmentDuration} Tahun</span>
                        </label>
                        <input
                          type="range"
                          min={0.5}
                          max={15}
                          step={0.5}
                          value={investmentDuration}
                          onChange={(e) => setInvestmentDuration(Number(e.target.value))}
                          className="w-full accent-primary mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground flex justify-between">
                          <span>Dividen / Kupon / Arus Kas Diterima</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{formatIDR(additionalCashflow)}</span>
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={50000000}
                          step={500000}
                          value={additionalCashflow}
                          onChange={(e) => setAdditionalCashflow(Number(e.target.value))}
                          className="w-full accent-primary mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary Box */}
                  <div className="p-5 rounded-xl bg-muted/60 border border-border/60 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Total Nilai Perolehan (Aset + Kas):</span>
                      <span className="font-bold text-foreground">{formatIDR(totalReturn)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Laba / Rugi Bersih (Net Profit):</span>
                      <span
                        className={cn(
                          "font-bold",
                          isProfitable ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                        )}
                      >
                        {isProfitable ? "+" : ""}
                        {formatIDR(netProfit)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">Status Kinerja vs Inflasi (~4%):</span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                          beatsInflation
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : isProfitable
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                        )}
                      >
                        {beatsInflation
                          ? "Mengalahkan Inflasi"
                          : isProfitable
                          ? "Positif Di Bawah Inflasi"
                          : "Penurunan Modal (Capital Loss)"}
                      </span>
                    </div>

                    <div className="w-full h-px bg-border/80 my-2" />

                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                      <div>
                        <span className="text-xs text-muted-foreground block">
                          Total Return on Investment (ROI):
                        </span>
                        <span
                          className={cn(
                            "text-3xl font-extrabold",
                            isProfitable ? "text-primary" : "text-rose-500"
                          )}
                        >
                          {isProfitable ? "+" : ""}
                          {roiPercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="p-3 rounded-lg bg-background/80 border border-border/60 text-left sm:text-right">
                        <span className="text-[11px] text-muted-foreground block font-semibold">
                          Annualized ROI (CAGR per Tahun):
                        </span>
                        <span
                          className={cn(
                            "text-base font-bold",
                            annualizedROI >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-500"
                          )}
                        >
                          {annualizedROI >= 0 ? "+" : ""}
                          {annualizedROI.toFixed(2)}% / tahun
                        </span>
                      </div>
                    </div>
                  </div>

                  {user && (
                    <button
                      onClick={() =>
                        saveRoi(
                          `ROI — ${roiPercent >= 0 ? "+" : ""}${roiPercent.toFixed(1)}% (${formatIDR(netProfit)})`,
                          { initialInvestment, finalValue, investmentDuration, additionalCashflow },
                          { netProfit, roiPercent, annualizedROI }
                        )
                      }
                      disabled={statusRoi !== "idle"}
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 shadow-sm"
                    >
                      {statusRoi === "idle" && (
                        <>
                          <Save size={15} /> Simpan ke Riwayat Perhitungan
                        </>
                      )}
                      {statusRoi === "saving" && "Menyimpan ke akun..."}
                      {statusRoi === "saved" && (
                        <>
                          <Check size={15} /> Berhasil Tersimpan
                        </>
                      )}
                    </button>
                  )}
                </div>
              );
            })()}

            {/* Bottom tips */}
            <div className="pt-3 border-t border-border/50 text-[11px] text-muted-foreground space-y-1">
              <span className="font-semibold text-foreground flex items-center gap-1">
                <HelpCircle size={13} className="text-primary" /> Panduan & Catatan Keuangan:
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {data.panduanStrategi.map((panduan, idx) => (
                  <li key={idx}>{panduan}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
