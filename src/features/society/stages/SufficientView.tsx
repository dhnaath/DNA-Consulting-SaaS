import { useState } from "react";
import {
  CheckCircle2,
  Check,
} from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

export function SufficientView() {
  const [monthlyExpense, setMonthlyExpense] = useState(45000000);
  const [monthlyRevenue, setMonthlyRevenue] = useState(68000000);
  const [reserveFund, setReserveFund] = useState(270000000);

  const runwayMonths = (reserveFund / (monthlyExpense || 1)).toFixed(1);
  const sufficiencyRatio = (monthlyRevenue / (monthlyExpense || 1)).toFixed(2);
  const surplus = monthlyRevenue - monthlyExpense;

  const [pillars, setPillars] = useState([
    {
      id: "pil-1",
      title: "Kemandirian Arus Kas Operasional",
      status: "Tercapai",
      target: "Pendapatan rutin melebihi pengeluaran bulanan minimum 1.2x",
      achieved: true,
    },
    {
      id: "pil-2",
      title: "Dana Cadangan Runway 6 Bulan",
      status: "Tercapai",
      target: "Cadangan likuid siap pakai menutupi beban tetap 6 bulan",
      achieved: true,
    },
    {
      id: "pil-3",
      title: "Kemandirian Eksekusi Tim Inti",
      status: "Dalam Proses",
      target: "Operasional harian berjalan lancar tanpa intervensi langsung founder",
      achieved: false,
    },
    {
      id: "pil-4",
      title: "Kemandirian Akuisisi Organik",
      status: "Tercapai",
      target: "Memiliki kanal akuisisi berulang tanpa ketergantungan iklan berbayar penuh",
      achieved: true,
    },
  ]);

  const togglePillar = (id: string) => {
    setPillars((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              achieved: !p.achieved,
              status: !p.achieved ? "Tercapai" : "Dalam Proses",
            }
          : p,
      ),
    );
  };

  const [activeSection, setActiveSection] = useState<string>("ringkasan");
  const goSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`soc-suf-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useShellSections([
    { id: "ringkasan", label: "Ringkasan", active: activeSection === "ringkasan", onSelect: () => goSection("ringkasan") },
    { id: "metrik", label: "Metrik", active: activeSection === "metrik", onSelect: () => goSection("metrik") },
    { id: "simulator", label: "Simulator", active: activeSection === "simulator", onSelect: () => goSection("simulator") },
    { id: "pilar", label: "Pilar", active: activeSection === "pilar", onSelect: () => goSection("pilar") },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div id="soc-suf-ringkasan" className="scroll-mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[20px] bg-card border border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <CheckCircle2 className="size-4 text-foreground" />
            <span>Fase 2 · Kecukupan & Kemandirian</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Sufficient Framework
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Mencapai titik kecukupan mutlak: arus kas positif stabil, dana cadangan berimbang, dan sistem dapat mencukupi kebutuhannya sendiri tanpa bergantung pada sokongan darurat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-[20px] bg-muted/60 border border-border text-center">
            <span className="text-xs text-muted-foreground block">Rasio Kecukupan</span>
            <span className="text-xl font-bold text-foreground">{sufficiencyRatio}x</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div id="soc-suf-metrik" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Runway Mandiri</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">{runwayMonths} Bulan</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Sangat Cukup
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Berdasarkan cadangan kas</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Surplus Bulanan</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">
              Rp {(surplus / 1000000).toLocaleString("id-ID")} Jt
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Positif
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Setelah seluruh beban tetap</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Pilar Kecukupan</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">
              {pillars.filter((p) => p.achieved).length} / {pillars.length}
            </span>
            <span className="text-xs text-foreground bg-muted px-2.5 py-1 rounded-full">
              75% Terpenuhi
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">1 pilar dalam proses</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Threshold Status</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">Break-Even+</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
              Ambang Terlampaui
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Siap menuju Improvement</span>
        </div>
      </div>

      {/* Main Interactive Calculator & Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Simulator Panel (1 col) */}
        <div id="soc-suf-simulator" className="scroll-mt-24 p-5 rounded-[20px] bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Simulator Kecukupan</h3>
            <span className="text-xs text-muted-foreground">Real-time kalkulasi</span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Beban Operasional Bulanan</span>
                <span className="font-semibold text-foreground">
                  Rp {(monthlyExpense / 1000000).toLocaleString("id-ID")} Jt
                </span>
              </div>
              <input
                type="range"
                min="10000000"
                max="150000000"
                step="5000000"
                value={monthlyExpense}
                onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                className="w-full accent-foreground cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Pendapatan Rutin Bulanan</span>
                <span className="font-semibold text-foreground">
                  Rp {(monthlyRevenue / 1000000).toLocaleString("id-ID")} Jt
                </span>
              </div>
              <input
                type="range"
                min="10000000"
                max="200000000"
                step="5000000"
                value={monthlyRevenue}
                onChange={(e) => setMonthlyRevenue(Number(e.target.value))}
                className="w-full accent-foreground cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Dana Cadangan Likuid</span>
                <span className="font-semibold text-foreground">
                  Rp {(reserveFund / 1000000).toLocaleString("id-ID")} Jt
                </span>
              </div>
              <input
                type="range"
                min="30000000"
                max="600000000"
                step="10000000"
                value={reserveFund}
                onChange={(e) => setReserveFund(Number(e.target.value))}
                className="w-full accent-foreground cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/40 text-xs space-y-1.5 border border-border/50">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status Arus Kas:</span>
              <span className={surplus >= 0 ? "text-emerald-600 font-semibold" : "text-red-500 font-semibold"}>
                {surplus >= 0 ? "Surplus Mandiri" : "Defisit Operasional"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Kecukupan Cadangan:</span>
              <span className="font-semibold text-foreground">{runwayMonths} Bulan</span>
            </div>
          </div>
        </div>

        {/* Pillars of Sufficiency (2 cols) */}
        <div id="soc-suf-pilar" className="scroll-mt-24 lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-foreground">
              Empat Pilar Kecukupan (Sufficiency Pillars)
            </h3>
            <span className="text-xs text-muted-foreground">Klik untuk ubah status</span>
          </div>

          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              onClick={() => togglePillar(pillar.id)}
              className="p-4 rounded-[20px] bg-card border border-border hover:border-foreground/20 cursor-pointer transition-colors flex items-start gap-3.5"
            >
              <div
                className={`mt-0.5 size-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  pillar.achieved
                    ? "bg-emerald-500 text-white"
                    : "border-2 border-border text-transparent"
                }`}
              >
                <Check className="size-3.5 stroke-[3]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-foreground truncate">
                    {pillar.title}
                  </h4>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full ${
                      pillar.achieved
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                    }`}
                  >
                    {pillar.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {pillar.target}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
