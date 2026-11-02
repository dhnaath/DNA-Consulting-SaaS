import { ArrowLeft, Heart } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function PhilanthropyView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("PhilanthropyView_scroll");
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
          Charitable Contribution
        </h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-gradient-to-br from-emerald-900/40 to-border border border-emerald-800/30 rounded-2xl p-6 mb-8 text-center text-foreground">
          <Heart size={32} className="text-emerald-400 mx-auto mb-3" />
          <div className="text-muted-foreground text-sm mb-1">Total Kontribusi Sosial (YTD)</div>
          <div className="text-2xl font-bold tracking-tight">Rp 0</div>
          <button className="mt-4 px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-lg border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
            Catat Pengeluaran Baru
          </button>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Kalkulator Zakat
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada perhitungan zakat.</p>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Alokasi Sadaqah & Waqaf
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada alokasi sadaqah atau waqaf.</p>
        </div>
      </div>
    </div>
  );
}
