import { ArrowLeft, Calculator, HeartCrack } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function InsuranceCalculatorView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("InsuranceCalculatorView_scroll");
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
          Kalkulator Uang Pertanggungan
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-6 rounded-2xl border border-border text-center">
          <Calculator size={32} className="text-muted-foreground mx-auto mb-3" />
          <h3 className="text-foreground text-sm font-medium mb-1">Human Life Value (HLV)</h3>
          <p className="text-muted-foreground/70 text-xs">
            Anda belum menghitung nilai pertanggungan.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ClaimsHistoryView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("ClaimsHistoryView_scroll");
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
          Pencatatan Klaim Riwayat
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada riwayat klaim.</p>
        </div>
      </div>
    </div>
  );
}

export function BeneficiaryManagerView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("BeneficiaryManagerView_scroll");
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
          Penerima Manfaat Polis
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada penerima manfaat.</p>
        </div>
      </div>
    </div>
  );
}

export function HealthRiskView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("HealthRiskView_scroll");
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
          Evaluasi Risiko Kesehatan
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada data evaluasi risiko.</p>
        </div>
      </div>
    </div>
  );
}

export function CriticalIllnessView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("CriticalIllnessView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide flex items-center gap-2">
          <HeartCrack size={20} className="text-muted-foreground" /> Penyakit Kritis (CI)
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">
            Belum ada pertanggungan penyakit kritis.
          </p>
        </div>
      </div>
    </div>
  );
}

export function GeneralInsuranceView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("GeneralInsuranceView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Asuransi Umum</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada data asuransi umum.</p>
        </div>
      </div>
    </div>
  );
}

export function UnitLinkComparisonView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("UnitLinkComparisonView_scroll");
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
          Unit Link vs Tradisional
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">
            Belum ada perbandingan unit link vs tradisional.
          </p>
        </div>
      </div>
    </div>
  );
}

export function EndowmentView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("EndowmentView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Asuransi Dwiguna</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada polis dwiguna.</p>
        </div>
      </div>
    </div>
  );
}

export function TermLifeView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("TermLifeView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Term Life / Berjangka</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada polis term life.</p>
        </div>
      </div>
    </div>
  );
}
