import { ArrowLeft, PiggyBank } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function FinancialHealthView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("FinancialHealthView_scroll");
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
          Cek Kesehatan Finansial
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-8 rounded-2xl border border-border text-center mb-8">
          <p className="text-muted-foreground/70 text-sm">
            Belum ada data untuk cek kesehatan finansial.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PortfolioRecommendationView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("PortfolioRecommendationView_scroll");
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
          Rekomendasi Portofolio
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-8 rounded-2xl border border-border text-center mb-8">
          <p className="text-muted-foreground/70 text-sm">
            Belum ada rekomendasi portofolio berdasarkan profil Anda.
          </p>
        </div>
      </div>
    </div>
  );
}

export function MortgageSimulatorView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("MortgageSimulatorView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Simulasi KPR & Kredit</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-8 rounded-2xl border border-border text-center mb-8">
          <PiggyBank size={32} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground/70 text-sm">
            Masukan plafon, tenor, dan suku bunga untuk memulai simulasi KPR/Kredit.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ChildEducationPlanView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("ChildEducationPlanView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Rencana Pendidikan</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-8 rounded-2xl border border-border text-center mb-8">
          <p className="text-muted-foreground/70 text-sm">
            Belum ada rencana pendidikan yang didaftarkan.
          </p>
        </div>
      </div>
    </div>
  );
}
