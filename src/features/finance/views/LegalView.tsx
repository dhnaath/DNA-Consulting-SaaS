import { ArrowLeft, FileCheck } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function LegalView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("LegalView_scroll");
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
          <FileCheck size={20} className="text-muted-foreground" /> Legalitas & Kepatuhan
        </h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Status Pajak
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada data status pajak.</p>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Dokumen Legal Pribadi
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">
            Belum ada dokumen legal pribadi yang diunggah.
          </p>
        </div>
      </div>
    </div>
  );
}
