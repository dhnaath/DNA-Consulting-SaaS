import { ArrowLeft } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function HealthRecordView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("HealthRecordView_scroll");
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
          Rekam Medis & Kesehatan
        </h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-card p-5 rounded-2xl border border-border text-center mb-8">
          <p className="text-muted-foreground/70 text-sm">Informasi dasar kesehatan belum diisi.</p>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Integrasi BPJS & Faskes
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border text-center mb-8">
          <p className="text-muted-foreground/70 text-sm">
            Belum ada data BPJS & Faskes didaftarkan.
          </p>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Riwayat Check-Up Terakhir
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border text-center mb-8">
          <p className="text-muted-foreground/70 text-sm">Belum ada riwayat check-up.</p>
        </div>
      </div>
    </div>
  );
}
