import { useState } from "react";
import {
  ArrowLeft,
  ShieldAlert,
  TrendingDown,
  Calculator,
  Calendar,
  PieChart,
  Printer,
  Users,
  AlertCircle,
  Sparkles,
} from "lucide-react";

// ==========================================
// 1. Insurance Gap Analysis Dashboard
// ==========================================
export function InsuranceGapAnalysisView({ onBack }: { onBack: () => void }) {
  const [annualExpense, setAnnualExpense] = useState(120000000); // 10 jt/bulan
  const [currentLifeCover, setCurrentLifeCover] = useState(500000000);
  const [currentHealthCover, setCurrentHealthCover] = useState(300000000);
  const [debtAmount, setDebtAmount] = useState(250000000);
  const [dependents, setDependents] = useState(3);
  const [supportYears, setSupportYears] = useState(10);

  // Income Replacement calculation: (Expense * years) + Debt - Current Cover
  const idealLifeCover = annualExpense * supportYears + debtAmount;
  const lifeGap = Math.max(0, idealLifeCover - currentLifeCover);
  const lifeCoverageRatio = Math.min(100, Math.round((currentLifeCover / idealLifeCover) * 100));

  // Health Cover benchmark: minimal 1 Milyar per orang sakit kritis/inpatient
  const idealHealthCover = 1000000000;
  const healthGap = Math.max(0, idealHealthCover - currentHealthCover);
  const healthCoverageRatio = Math.min(100, Math.round((currentHealthCover / idealHealthCover) * 100));

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Insurance Gap Analysis</h1>
            <p className="text-xs text-muted-foreground">Kalkulasi Kesenjangan Proteksi Jiwa & Kesehatan Riil</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Ringkasan Skor Kesenjangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-border bg-card shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Proteksi Jiwa (Income Replacement)
                </span>
                <h3 className="text-2xl font-black mt-2 text-foreground">{formatRupiah(lifeGap)}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {lifeGap > 0 ? "Kekurangan uang pertanggungan jiwa keluarga" : "Proteksi jiwa mencukupi!"}
                </p>
              </div>
              <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                <ShieldAlert size={24} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Rasio Cakupan</span>
                <span className="font-semibold text-foreground">{lifeCoverageRatio}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={"h-full transition-all " + (lifeCoverageRatio >= 80 ? "bg-emerald-500" : lifeCoverageRatio >= 50 ? "bg-amber-500" : "bg-rose-500")}
                  style={{ width: `${lifeCoverageRatio}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-border bg-card shadow-xs relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  Proteksi Sakit Kritis & Rawat Inap
                </span>
                <h3 className="text-2xl font-black mt-2 text-foreground">{formatRupiah(healthGap)}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {healthGap > 0 ? "Kekurangan batas tahunan asuransi kesehatan" : "Limit kesehatan optimal"}
                </p>
              </div>
              <div className="size-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                <AlertCircle size={24} />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Rasio Cakupan</span>
                <span className="font-semibold text-foreground">{healthCoverageRatio}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={"h-full transition-all " + (healthCoverageRatio >= 80 ? "bg-emerald-500" : healthCoverageRatio >= 50 ? "bg-amber-500" : "bg-rose-500")}
                  style={{ width: `${healthCoverageRatio}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Simulasi */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Calculator size={18} className="text-primary" /> Parameter Keluarga & Polis Saat Ini
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Pengeluaran Rumah Tangga per Tahun (Rp)
              </label>
              <input
                type="number"
                value={annualExpense}
                onChange={(e) => setAnnualExpense(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Setara {formatRupiah(Math.round(annualExpense / 12))} / bulan
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Lama Dukungan Tanggungan (Tahun)
              </label>
              <input
                type="number"
                value={supportYears}
                onChange={(e) => setSupportYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">Hingga anak terkecil mandiri finansial</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Sisa Total Liabilitas / Utang (Rp)
              </label>
              <input
                type="number"
                value={debtAmount}
                onChange={(e) => setDebtAmount(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Jumlah Tanggungan (Orang)
              </label>
              <input
                type="number"
                value={dependents}
                onChange={(e) => setDependents(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Uang Pertanggungan Jiwa Saat Ini (Rp)
              </label>
              <input
                type="number"
                value={currentLifeCover}
                onChange={(e) => setCurrentLifeCover(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Limit Tahunan Asuransi Kesehatan Saat Ini (Rp)
              </label>
              <input
                type="number"
                value={currentHealthCover}
                onChange={(e) => setCurrentHealthCover(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
        </div>

        {/* Actionable Recommendations */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles size={16} className="text-primary" /> Rekomendasi Solusi Polis
          </h4>
          <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside">
            <li>
              Jika <strong>Life Gap</strong> masih besar, pertimbangkan menambah polis <strong>Term Life murni</strong> tanpa unsur investasi agar premi tetap terjangkau (Rp 300rb - 800rb/bulan untuk UP Rp 1 Milyar).
            </li>
            <li>
              Pastikan asuransi kesehatan memiliki klausul <strong>as charged (sesuai tagihan)</strong> dengan kamar 1 tempat tidur untuk meminimalisir risiko nombok (out-of-pocket).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. Simulator Debt Snowball vs Avalanche
// ==========================================
export function DebtSnowballAvalancheView({ onBack }: { onBack: () => void }) {
  const [debts, setDebts] = useState([
    { id: 1, name: "Kartu Kredit BCA", balance: 15000000, interestRate: 21, minPay: 1500000 },
    { id: 2, name: "KTA Bank Mandiri", balance: 40000000, interestRate: 15, minPay: 2200000 },
    { id: 3, name: "Paylater E-Commerce", balance: 4500000, interestRate: 28, minPay: 900000 },
    { id: 4, name: "Kredit Sepeda Motor", balance: 22000000, interestRate: 12, minPay: 1100000 },
  ]);
  const [extraPayment, setExtraPayment] = useState(1500000);
  const [strategy, setStrategy] = useState<"snowball" | "avalanche">("snowball");

  // Sort debts according to selected strategy
  const sortedDebts = [...debts].sort((a, b) => {
    if (strategy === "snowball") {
      return a.balance - b.balance; // Saldo terkecil dulu
    }
    return b.interestRate - a.interestRate; // Bunga tertinggi dulu
  });

  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const totalMinPay = debts.reduce((sum, d) => sum + d.minPay, 0);

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Simulator Debt Snowball vs Avalanche</h1>
            <p className="text-xs text-muted-foreground">Strategi Pelunasan Utang Tercepat & Hemat Bunga</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Toggle Strategy */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-card border border-border p-4 rounded-2xl">
          <div>
            <div className="text-xs text-muted-foreground">Pilih Filosofi Pelunasan:</div>
            <div className="text-base font-bold text-foreground mt-0.5">
              {strategy === "snowball" ? "Debt Snowball (Kemenangan Psikologis)" : "Debt Avalanche (Hemat Bunga Maksimal)"}
            </div>
          </div>
          <div className="flex p-1 bg-muted rounded-xl">
            <button
              onClick={() => setStrategy("snowball")}
              className={"px-4 py-2 text-xs font-semibold rounded-lg transition-all " + (strategy === "snowball" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
            >
              Snowball (Saldo Kecil Dulu)
            </button>
            <button
              onClick={() => setStrategy("avalanche")}
              className={"px-4 py-2 text-xs font-semibold rounded-lg transition-all " + (strategy === "avalanche" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
            >
              Avalanche (Bunga Tinggi Dulu)
            </button>
          </div>
        </div>

        {/* Ringkasan Angka */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl border border-border bg-card">
            <span className="text-xs text-muted-foreground">Total Saldo Liabilitas</span>
            <div className="text-xl font-black text-rose-500 mt-1">{formatRupiah(totalDebt)}</div>
            <span className="text-[11px] text-muted-foreground">{debts.length} akun kewajiban aktif</span>
          </div>
          <div className="p-4 rounded-2xl border border-border bg-card">
            <span className="text-xs text-muted-foreground">Pembayaran Minimum Bulanan</span>
            <div className="text-xl font-bold text-foreground mt-1">{formatRupiah(totalMinPay)}</div>
            <span className="text-[11px] text-muted-foreground">Wajib dibayar agar tidak denda</span>
          </div>
          <div className="p-4 rounded-2xl border border-border bg-card">
            <span className="text-xs text-muted-foreground">Ekstra Budget Percepatan (Snowball)</span>
            <div className="text-xl font-bold text-emerald-500 mt-1">{formatRupiah(extraPayment)}</div>
            <span className="text-[11px] text-muted-foreground">Dialokasikan ke target pertama</span>
          </div>
        </div>

        {/* Urutan Target Pelunasan */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingDown size={18} className="text-primary" /> Prioritas Urutan Pelunasan Utang
          </h3>
          <div className="space-y-3">
            {sortedDebts.map((item, idx) => (
              <div
                key={item.id}
                className={"p-4 rounded-2xl border transition-all " + (idx === 0 ? "border-primary/50 bg-primary/5 shadow-xs" : "border-border bg-card")}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={"size-7 rounded-full flex items-center justify-center text-xs font-bold " + (idx === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      #{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        Bunga: <span className="font-semibold text-rose-500">{item.interestRate}% p.a.</span> · Min Pay: {formatRupiah(item.minPay)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-foreground">{formatRupiah(item.balance)}</div>
                    {idx === 0 ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        Target Utama: Bayar {formatRupiah(item.minPay + extraPayment)} / bln
                      </span>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">
                        Bayar minimum ({formatRupiah(item.minPay)})
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. Cash Flow Forecasting 3-6 Bulan
// ==========================================
export function CashflowForecastView({ onBack }: { onBack: () => void }) {
  const [initialBalance, setInitialBalance] = useState(45000000);
  const [monthlyIncome, setMonthlyIncome] = useState(28000000);
  const [monthlyExpense, setMonthlyExpense] = useState(19500000);

  // 6 months projection
  const months = ["Bulan Depan", "+2 Bulan", "+3 Bulan", "+4 Bulan", "+5 Bulan", "+6 Bulan"];
  let runningBalance = initialBalance;
  const projections = months.map((name, idx) => {
    // Add some realistic variations (e.g. bonus or annual expense)
    const seasonalBonus = idx === 2 ? 15000000 : 0; // THR or bonus
    const seasonalExpense = idx === 4 ? 8000000 : 0; // Pajak STNK / Asuransi tahunan
    const netFlow = (monthlyIncome + seasonalBonus) - (monthlyExpense + seasonalExpense);
    runningBalance += netFlow;
    return {
      name,
      income: monthlyIncome + seasonalBonus,
      expense: monthlyExpense + seasonalExpense,
      netFlow,
      balance: runningBalance,
    };
  });

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Cash Flow Forecasting (6 Bulan)</h1>
            <p className="text-xs text-muted-foreground">Proyeksi Saldo Likuiditas & Arus Kas Masa Depan</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Kontrol Parameter Kas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-card border border-border p-5 rounded-2xl">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Saldo Kas Saat Ini</label>
            <input
              type="number"
              value={initialBalance}
              onChange={(e) => setInitialBalance(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Pemasukan Rutin Rata-rata</label>
            <input
              type="number"
              value={monthlyIncome}
              onChange={(e) => setMonthlyIncome(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold text-emerald-600"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Pengeluaran Rutin Rata-rata</label>
            <input
              type="number"
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold text-rose-500"
            />
          </div>
        </div>

        {/* Tabel Proyeksi */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-primary" /> Proyeksi Arus Kas & Saldo Akhir
            </h3>
            <span className="text-xs text-muted-foreground">Surplus bulanan: {formatRupiah(monthlyIncome - monthlyExpense)}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-accent/40 text-muted-foreground border-b border-border">
                <tr>
                  <th className="p-3.5 font-semibold">Periode</th>
                  <th className="p-3.5 font-semibold">Inflow (Pemasukan)</th>
                  <th className="p-3.5 font-semibold">Outflow (Pengeluaran)</th>
                  <th className="p-3.5 font-semibold">Net Cashflow</th>
                  <th className="p-3.5 font-semibold text-right">Saldo Kas Akhir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projections.map((p, i) => (
                  <tr key={i} className="hover:bg-accent/20 transition-colors">
                    <td className="p-3.5 font-medium text-foreground">{p.name}</td>
                    <td className="p-3.5 text-emerald-600 font-semibold">{formatRupiah(p.income)}</td>
                    <td className="p-3.5 text-rose-500 font-medium">{formatRupiah(p.expense)}</td>
                    <td className="p-3.5">
                      <span className={"font-semibold px-2 py-0.5 rounded text-xs " + (p.netFlow >= 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600")}>
                        {p.netFlow >= 0 ? "+" : ""}{formatRupiah(p.netFlow)}
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-black text-foreground">{formatRupiah(p.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. Laporan Keuangan Otomatis & Rasio
// ==========================================
export function FinancialReportsView({ onBack }: { onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<"neraca" | "labarugi" | "rasio">("rasio");

  // Mock data neraca
  const asetLancar = 85000000;
  const asetInvestasi = 340000000;
  const asetFisik = 650000000;
  const totalAset = asetLancar + asetInvestasi + asetFisik;

  const utangJangkaPendek = 18000000;
  const utangJangkaPanjang = 210000000;
  const totalLiabilitas = utangJangkaPendek + utangJangkaPanjang;
  const netWorth = totalAset - totalLiabilitas;

  // Rasio-rasio kesehatan finansial
  const monthlyIncome = 30000000;
  const monthlySavings = 9000000;
  const monthlyDebtPayment = 6000000;
  const monthlyExpense = 15000000;

  const savingsRate = Math.round((monthlySavings / monthlyIncome) * 100); // Ideal >= 20%
  const dti = Math.round((monthlyDebtPayment / monthlyIncome) * 100); // Ideal <= 30%
  const liquidityMonths = (asetLancar / monthlyExpense).toFixed(1); // Ideal 3-6 bulan

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Laporan Keuangan & Rasio Personal</h1>
            <p className="text-xs text-muted-foreground">Standardized Personal Financial Statements & Metrics</p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-accent text-xs font-semibold text-foreground transition-colors"
        >
          <Printer size={14} /> Cetak / Export PDF
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Tab Navigation */}
        <div className="flex p-1 bg-muted rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("rasio")}
            className={"px-4 py-2 text-xs font-semibold rounded-lg transition-all " + (activeTab === "rasio" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
          >
            Rasio Keuangan Utama
          </button>
          <button
            onClick={() => setActiveTab("neraca")}
            className={"px-4 py-2 text-xs font-semibold rounded-lg transition-all " + (activeTab === "neraca" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
          >
            Neraca Pribadi (Balance Sheet)
          </button>
          <button
            onClick={() => setActiveTab("labarugi")}
            className={"px-4 py-2 text-xs font-semibold rounded-lg transition-all " + (activeTab === "labarugi" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground")}
          >
            Arus Kas & Laba Rugi
          </button>
        </div>

        {activeTab === "rasio" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">Savings Rate</span>
                <div className="text-3xl font-black text-emerald-500">{savingsRate}%</div>
                <div className="text-xs text-muted-foreground">
                  Benchmark: <span className="font-semibold text-foreground">&ge; 20%</span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {savingsRate >= 20 ? "Kondisi Sangat Sehat (Ideal)" : "Perlu ditingkatkan"}
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">Debt-to-Income (DTI)</span>
                <div className="text-3xl font-black text-foreground">{dti}%</div>
                <div className="text-xs text-muted-foreground">
                  Batas Aman: <span className="font-semibold text-foreground">&le; 30% - 35%</span>
                </div>
                <p className={"text-[11px] font-medium " + (dti <= 35 ? "text-emerald-600" : "text-rose-500")}>
                  {dti <= 35 ? "Beban Cicilan Terkendali" : "Bahaya: Beban utang tinggi"}
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card space-y-2">
                <span className="text-xs font-semibold text-muted-foreground">Liquidity Ratio (Dana Darurat)</span>
                <div className="text-3xl font-black text-primary">{liquidityMonths} Bulan</div>
                <div className="text-xs text-muted-foreground">
                  Rekomendasi: <span className="font-semibold text-foreground">3 - 6 Bulan Pengeluaran</span>
                </div>
                <p className="text-[11px] text-primary font-medium">Daya tahan kas aman jika tanpa penghasilan</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "neraca" && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h3 className="font-bold text-foreground">Neraca Bersih Per Hari Ini</h3>
              <span className="text-sm font-black text-primary">Kekayaan Bersih: {formatRupiah(netWorth)}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Aset (Harta)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2.5 rounded-xl bg-accent/30">
                    <span>Kas & Setara Kas (Likuid)</span>
                    <span className="font-semibold">{formatRupiah(asetLancar)}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-accent/30">
                    <span>Portofolio Investasi & Saham</span>
                    <span className="font-semibold">{formatRupiah(asetInvestasi)}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-accent/30">
                    <span>Aset Riil / Properti / Kendaraan</span>
                    <span className="font-semibold">{formatRupiah(asetFisik)}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl border border-border font-bold">
                    <span>Total Aset</span>
                    <span className="text-emerald-600">{formatRupiah(totalAset)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Liabilitas (Kewajiban)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2.5 rounded-xl bg-accent/30">
                    <span>Utang Jangka Pendek (Kartu Kredit / Paylater)</span>
                    <span className="font-semibold text-rose-500">{formatRupiah(utangJangkaPendek)}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl bg-accent/30">
                    <span>Utang Jangka Panjang (KPR / Kredit Kendaraan)</span>
                    <span className="font-semibold text-rose-500">{formatRupiah(utangJangkaPanjang)}</span>
                  </div>
                  <div className="flex justify-between p-2.5 rounded-xl border border-border font-bold">
                    <span>Total Liabilitas</span>
                    <span className="text-rose-500">{formatRupiah(totalLiabilitas)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "labarugi" && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-foreground">Laporan Arus Kas Bulanan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-3 rounded-xl bg-emerald-500/10 text-emerald-600 font-semibold">
                <span>Total Pemasukan (Gaji + Bisnis)</span>
                <span>{formatRupiah(monthlyIncome)}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-rose-500/10 text-rose-600 font-semibold">
                <span>Total Pengeluaran Rutin & Hidup</span>
                <span>-{formatRupiah(monthlyExpense)}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-amber-500/10 text-amber-600 font-semibold">
                <span>Cicilan & Pembayaran Utang</span>
                <span>-{formatRupiah(monthlyDebtPayment)}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl border-t border-border font-black text-base text-foreground pt-4">
                <span>Sisa Kas / Surplus Investasi Bersih</span>
                <span className="text-primary">{formatRupiah(monthlyIncome - monthlyExpense - monthlyDebtPayment)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 5. Asset Allocation Visualizer & Pie Chart
// ==========================================
export function AssetAllocationVisualizerView({ onBack }: { onBack: () => void }) {
  const [allocations, setAllocations] = useState([
    { name: "Saham & Reksadana Saham", pct: 40, actualPct: 45, color: "bg-blue-500" },
    { name: "Obligasi & SBN", pct: 25, actualPct: 20, color: "bg-emerald-500" },
    { name: "Emas & Logam Mulia", pct: 15, actualPct: 18, color: "bg-amber-400" },
    { name: "Kas & Deposito", pct: 15, actualPct: 12, color: "bg-teal-500" },
    { name: "Aset Alternatif (Crypto/P2P)", pct: 5, actualPct: 5, color: "bg-purple-500" },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Alokasi Aset Visual & Rebalancing</h1>
            <p className="text-xs text-muted-foreground">Monitoring Bobot Kelas Aset vs Target Profil Risiko</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Visual Bar Allocation */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <PieChart size={18} className="text-primary" /> Visualisasi Portofolio Aktual
          </h3>
          <div className="h-6 rounded-xl overflow-hidden flex">
            {allocations.map((item, idx) => (
              <div
                key={idx}
                className={item.color + " h-full transition-all flex items-center justify-center text-[10px] text-white font-bold"}
                style={{ width: `${item.actualPct}%` }}
                title={`${item.name}: ${item.actualPct}%`}
              >
                {item.actualPct >= 10 ? `${item.actualPct}%` : ""}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {allocations.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <span className={"size-3 rounded-full shrink-0 " + item.color} />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="font-bold text-foreground ml-auto">{item.actualPct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabel Deviasi & Aksi Rebalancing */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h4 className="text-sm font-bold text-foreground">Perbandingan Target vs Aktual Portofolio</h4>
          </div>
          <div className="divide-y divide-border">
            {allocations.map((item, idx) => {
              const diff = item.actualPct - item.pct;
              return (
                <div key={idx} className="p-4 flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3">
                    <span className={"size-3.5 rounded-full " + item.color} />
                    <span className="font-medium text-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-xs text-muted-foreground">
                      Target: <span className="font-semibold text-foreground">{item.pct}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Aktual: <span className="font-semibold text-foreground">{item.actualPct}%</span>
                    </div>
                    <div className="w-28 text-right">
                      {diff === 0 ? (
                        <span className="text-xs font-semibold text-muted-foreground">Sesuai Target</span>
                      ) : diff > 0 ? (
                        <span className="text-xs font-bold text-rose-500">Overweight (+{diff}%)</span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-500">Underweight ({diff}%)</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 6. Kalkulator Bunga Majemuk & DCA
// ==========================================
export function CompoundingDcaCalculatorView({ onBack }: { onBack: () => void }) {
  const [initialCapital, setInitialCapital] = useState(25000000);
  const [monthlyDca, setMonthlyDca] = useState(3000000);
  const [annualRate, setAnnualRate] = useState(11); // 11% return pasar saham
  const [years, setYears] = useState(15);

  // Proyeksi pertumbuhan majemuk tahunan
  const r = annualRate / 100;
  let futureValue = initialCapital;
  let totalDeposited = initialCapital;
  const history = [];

  for (let yr = 1; yr <= years; yr++) {
    for (let m = 1; m <= 12; m++) {
      futureValue = (futureValue + monthlyDca) * (1 + r / 12);
      totalDeposited += monthlyDca;
    }
    history.push({
      year: yr,
      deposited: totalDeposited,
      total: Math.round(futureValue),
      interest: Math.round(futureValue - totalDeposited),
    });
  }

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Kalkulator Bunga Majemuk & DCA</h1>
            <p className="text-xs text-muted-foreground">Simulasi Efek Bola Salju (Compounding) Tabungan Investasi Rutin</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-card border border-border p-5 rounded-2xl">
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Modal Awal (Rp)</label>
            <input
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">DCA Bulanan (Rp)</label>
            <input
              type="number"
              value={monthlyDca}
              onChange={(e) => setMonthlyDca(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold text-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Ekspektasi Return (% p.a.)</label>
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground block mb-1">Durasi Waktu (Tahun)</label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm font-bold"
            />
          </div>
        </div>

        {/* Hasil Akhir */}
        <div className="p-6 rounded-2xl border border-border bg-card shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <span className="text-xs text-muted-foreground">Total Nilai Akumulasi Akhir</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-500 mt-1">
                {formatRupiah(Math.round(futureValue))}
              </div>
              <span className="text-xs text-muted-foreground">Setelah {years} tahun berinvestasi konsisten</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Total Uang Pokok Disetor</span>
              <div className="text-xl font-bold text-foreground mt-1">{formatRupiah(totalDeposited)}</div>
              <span className="text-xs text-muted-foreground">Modal tabungan riil Anda</span>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Total Bunga Berbunga (Gain)</span>
              <div className="text-xl font-black text-primary mt-1">
                {formatRupiah(Math.round(futureValue - totalDeposited))}
              </div>
              <span className="text-xs text-muted-foreground">
                Pertumbuhan {Math.round(((futureValue - totalDeposited) / totalDeposited) * 100)}% dari modal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. Peta Ahli Waris & Alokasi Aset Lintas-Pilar
// ==========================================
export function HeirAllocationMapView({ onBack }: { onBack: () => void }) {
  const [totalEstate, setTotalEstate] = useState(3500000000);
  const [heirs, setHeirs] = useState([
    { id: 1, name: "Istri (Pasangan Hidup)", role: "Pasangan", sharePct: 25, assets: "Rumah Utama & Deposito" },
    { id: 2, name: "Anak Pertama (Laki-laki)", role: "Anak Kandung", sharePct: 37.5, assets: "Portofolio Saham & Saham Bisnis" },
    { id: 3, name: "Anak Kedua (Perempuan)", role: "Anak Kandung", sharePct: 18.75, assets: "Obligasi Negara & Emas Batangan" },
    { id: 4, name: "Wakaf & Amal Abadi", role: "Wasiat Filantropi", sharePct: 18.75, assets: "Dana Beasiswa Keluarga" },
  ]);

  const formatRupiah = (val: number) => "Rp " + val.toLocaleString("id-ID");

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-accent rounded-xl text-foreground transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-foreground">Peta Ahli Waris & Alokasi Aset</h1>
            <p className="text-xs text-muted-foreground">Distribusi Transparan & Struktur Pembagian Harta Warisan</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-muted-foreground">Estimasi Total Kekayaan Bersih Diwariskan</span>
            <div className="text-2xl font-black text-foreground mt-0.5">{formatRupiah(totalEstate)}</div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600">
            Total Alokasi 100% Selesai Terbagi
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Users size={18} className="text-primary" /> Daftar Penerima Waris & Hak Alokasi
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {heirs.map((h) => {
              const nominal = (totalEstate * h.sharePct) / 100;
              return (
                <div key={h.id} className="p-5 rounded-2xl border border-border bg-card space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-foreground">{h.name}</h4>
                      <span className="text-xs text-muted-foreground">{h.role}</span>
                    </div>
                    <span className="text-sm font-black text-primary px-2.5 py-1 rounded-xl bg-primary/10">
                      {h.sharePct}%
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estimasi Nilai Hak:</span>
                    <span className="font-black text-foreground">{formatRupiah(nominal)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-accent/40 p-2.5 rounded-xl">
                    Aset Ditunjuk: <span className="font-medium text-foreground">{h.assets}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
