import { ArrowLeft, Bitcoin } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function CryptoAssetsView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("CryptoAssetsView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Aset Kripto</h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-card p-6 rounded-2xl border border-orange-900/30 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="text-muted-foreground text-sm mb-1">Total Nilai Kripto</div>
              <div className="text-foreground text-2xl font-bold">Rp 0</div>
            </div>
            <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-400">
              <Bitcoin size={24} />
            </div>
          </div>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Portofolio
        </h3>

        <div className="bg-card p-8 rounded-2xl border border-border text-center mb-8">
          <p className="text-muted-foreground/70 text-sm">Belum ada portofolio aset kripto.</p>
        </div>
      </div>
    </div>
  );
}
