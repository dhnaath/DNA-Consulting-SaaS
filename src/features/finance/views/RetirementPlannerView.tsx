import { ArrowLeft, Sunrise, TrendingUp } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function RetirementPlannerView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("RetirementPlannerView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Perencanaan Pensiun</h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-card p-6 rounded-2xl border border-border mb-8 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 opacity-5">
            <Sunrise size={120} />
          </div>
          <div className="flex justify-between items-end mb-6 relative">
            <div>
              <div className="text-muted-foreground text-sm mb-1">Target Usia Pensiun</div>
              <div className="text-foreground text-2xl font-bold">-</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground/70 text-xs mb-1">Waktu Tersisa</div>
              <div className="text-emerald-400 font-medium">-</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Target Dana Pribadi (FIRE)</span>
                <span className="text-foreground font-medium">Rp 0</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
              <div className="text-right text-xs text-muted-foreground/70 mt-1">
                Estimasi Saat Ini: Rp 0
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Aset Program Pensiun
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada aset pensiun (JHT/DPLK).</p>
        </div>

        <button className="w-full mt-8 py-4 bg-[#2a2a2a] hover:bg-accent text-foreground font-medium rounded-xl transition-colors border border-border flex items-center justify-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" /> Simulasi Tambah Top-Up
        </button>
      </div>
    </div>
  );
}
