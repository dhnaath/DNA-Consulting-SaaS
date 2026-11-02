import { ArrowLeft, HandHeart, History } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function DonationHistoryView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("DonationHistoryView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Jejak Kebaikan</h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-card p-6 rounded-2xl border border-emerald-900/30 mb-8 flex items-center justify-between">
          <div>
            <div className="text-muted-foreground text-sm mb-1">Total Impact (All Time)</div>
            <div className="text-emerald-400 text-2xl font-bold">Rp 0</div>
            <div className="text-muted-foreground/70 text-xs mt-1">
              Disalurkan via institusi resmi.
            </div>
          </div>
          <HandHeart size={48} className="text-emerald-500/20" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">
            Riwayat Penyaluran
          </h3>
          <button className="text-emerald-400 text-xs font-medium bg-emerald-500/10 px-3 py-1 rounded-full flex items-center gap-1">
            <History size={12} /> Unduh Rekap
          </button>
        </div>

        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada riwayat penyaluran.</p>
        </div>
      </div>
    </div>
  );
}
