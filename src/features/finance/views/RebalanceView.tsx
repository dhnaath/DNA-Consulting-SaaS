import { ArrowLeft, Scale, ArrowRight, AlertCircle } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function RebalanceView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("RebalanceView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">
          Rebalancing Portofolio
        </h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5 mb-8 flex items-start gap-4">
          <AlertCircle className="text-orange-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-orange-400 font-medium mb-1">Status: Perlu Rebalancing</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Beberapa instrumen telah menyimpang lebih dari 5% dari target alokasi profil risiko
              Anda (Agresif).
            </p>
          </div>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Aksi Proporsional
        </h3>

        <div className="space-y-4 mb-8">
          <div className="bg-card p-5 rounded-2xl border border-border">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-foreground font-medium mb-0.5">Saham / Ekuitas</div>
                <div className="text-red-400 text-xs font-medium">Overweight (+12%)</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-xs line-through mb-0.5">Target: 60%</div>
                <div className="text-foreground font-medium">Aktual: 72%</div>
              </div>
            </div>
            <div className="bg-[#2a2a2a] p-3 rounded-lg flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Rekomendasi Aksi</span>
              <span className="text-red-400 font-medium text-sm flex items-center gap-1">
                Jual Parsial <ArrowRight size={14} />
              </span>
            </div>
          </div>

          <div className="bg-card p-5 rounded-2xl border border-border">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-foreground font-medium mb-0.5">Reksa Dana Campuran</div>
                <div className="text-muted-foreground/70 text-xs font-medium">On Track (-1%)</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-xs mb-0.5">Target: 30%</div>
                <div className="text-foreground font-medium">Aktual: 29%</div>
              </div>
            </div>
            <div className="bg-[#2a2a2a] p-3 rounded-lg flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Rekomendasi Aksi</span>
              <span className="text-muted-foreground font-medium text-sm">Tahan</span>
            </div>
          </div>

          <div className="bg-card p-5 rounded-2xl border border-border">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-foreground font-medium mb-0.5">Pasar Uang / Kas</div>
                <div className="text-emerald-400 text-xs font-medium">Underweight (-11%)</div>
              </div>
              <div className="text-right">
                <div className="text-muted-foreground text-xs line-through mb-0.5">Target: 10%</div>
                <div className="text-foreground font-medium">Aktual: -1%</div>
              </div>
            </div>
            <div className="bg-[#2a2a2a] p-3 rounded-lg flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Rekomendasi Aksi</span>
              <span className="text-emerald-400 font-medium text-sm flex items-center gap-1">
                <ArrowRight size={14} /> Beli / Top-Up
              </span>
            </div>
          </div>
        </div>

        <button className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-medium rounded-xl transition-colors border border-emerald-500/20 flex items-center justify-center gap-2">
          <Scale size={18} />
          Eksekusi Skenario Auto-Rebalance
        </button>
      </div>
    </div>
  );
}
