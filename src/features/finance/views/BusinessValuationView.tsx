import { ArrowLeft, Store } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function BusinessValuationView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("BusinessValuationView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Valuasi Bisnis</h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-card p-6 rounded-2xl border border-border mb-8 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
            <Store size={32} className="text-blue-400" />
          </div>
          <div className="text-muted-foreground text-sm mb-1">Estimasi Total Ekuitas Bisnis</div>
          <div className="text-foreground text-2xl font-bold">Rp 0</div>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Portofolio Kepemilikan
        </h3>

        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada portofolio bisnis.</p>
        </div>
      </div>
    </div>
  );
}
