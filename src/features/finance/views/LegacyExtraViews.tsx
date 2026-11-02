import { ArrowLeft, KeyRound, ReceiptText, Building2 } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function ValuablesInventoryView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("ValuablesInventoryView_scroll");
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
          Inventaris Barang Berharga
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada barang berharga.</p>
        </div>
      </div>
    </div>
  );
}

export function DigitalWillView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("DigitalWillView_scroll");
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
          Pesan Terakhir (Digital Will)
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-center items-center h-48 text-center">
          <KeyRound size={32} className="text-emerald-400 mb-3" />
          <h3 className="text-emerald-400 text-sm font-medium mb-1">Brankas Terkunci</h3>
          <p className="text-muted-foreground text-xs">
            Data rahasia ini hanya bisa dibuka oleh pengacara keluarga sesuai klausul kematian.
          </p>
        </div>
      </div>
    </div>
  );
}

export function EstateTaxView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("EstateTaxView_scroll");
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
          Simulasi Pajak Waris/Hibah
        </h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-6 rounded-2xl border border-orange-900/30 text-center">
          <ReceiptText size={32} className="text-muted-foreground mx-auto mb-3" />
          <h3 className="text-foreground text-sm font-medium mb-1">Estimasi BPHTB Turun Waris</h3>
          <p className="text-muted-foreground/70 text-xs mt-2">Anda belum melakukan simulasi.</p>
        </div>
      </div>
    </div>
  );
}

export function FamilyFoundationView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("FamilyFoundationView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Yayasan Keluarga</h1>
      </div>
      <div
        ref={ref}
        onScroll={onScroll}
        className="flex-1 overflow-y-auto p-6 pb-20 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:auto-rows-max md:content-start"
      >
        <div className="bg-card p-5 rounded-2xl border border-border text-center h-48 flex flex-col items-center justify-center">
          <Building2 size={32} className="text-muted-foreground/70 mb-3" />
          <h3 className="text-foreground text-sm font-medium mb-1">Yayasan Belum Dibentuk</h3>
          <p className="text-muted-foreground/70 text-xs max-w-xs">
            Buat entitas hukum tersendiri untuk mengelola kegiatan sosial keluarga secara
            profesional layaknya CSR.
          </p>
        </div>
      </div>
    </div>
  );
}
