import { ArrowLeft } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function RiskProfileView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("RiskProfileView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Profil Risiko</h1>
      </div>
      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-card p-8 rounded-2xl border border-border text-center mb-8">
          <p className="text-muted-foreground/70 text-sm">Belum ada evaluasi profil risiko.</p>
        </div>

        <button className="w-full mt-8 py-4 bg-[#2a2a2a] hover:bg-accent text-foreground font-medium rounded-xl transition-colors border border-border">
          Mulai Evaluasi Profil
        </button>
      </div>
    </div>
  );
}
