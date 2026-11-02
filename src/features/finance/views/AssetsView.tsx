import { ArrowLeft, Plus } from "lucide-react";

export function AssetsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center justify-between pt-6 shrink-0 bg-background">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-foreground p-1 hover:text-foreground transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-lg font-medium text-foreground tracking-wide">Aset Tetap & Lancar</h1>
        </div>
        <button
          onClick={() => alert("Fitur tambah aset segera tersedia!")}
          className="text-blue-400 p-1 hover:text-blue-300 transition-colors"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-card p-6 rounded-2xl border border-border mb-8 text-center">
          <div className="text-muted-foreground text-sm mb-2">Estimasi Total Nilai Aset</div>
          <div className="text-2xl font-bold text-foreground tracking-tight">Rp 0</div>
          <div className="text-emerald-400 text-xs mt-2 font-medium">
            Berdasarkan Harga Pasar (Appraised)
          </div>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Properti & Real Estate
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada aset properti didaftarkan.</p>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Kendaraan
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada kendaraan didaftarkan.</p>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Aset Tidak Lancar
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada aset tidak lancar.</p>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Logam Mulia & Lainnya
        </h3>
        <div className="bg-card p-8 rounded-2xl border border-border mb-8 text-center">
          <p className="text-muted-foreground/70 text-sm">Belum ada koleksi logam mulia.</p>
        </div>
      </div>
    </div>
  );
}
