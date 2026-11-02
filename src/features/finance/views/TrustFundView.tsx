import { ArrowLeft, Building, LockIcon, Users, ScrollText } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function TrustFundView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("TrustFundView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Trust Fund Keluarga</h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-gradient-to-br from-blue-900/40 to-border border border-blue-800/30 rounded-2xl p-6 mb-8 text-center text-foreground relative">
          <Building size={32} className="text-blue-400 mx-auto mb-3" />
          <div className="text-lg font-bold tracking-tight mb-2">Struktur PT Keluarga (Holdco)</div>
          <p className="text-blue-200/70 text-xs leading-relaxed max-w-xs mx-auto mb-4">
            Pengelolaan aset produktif keluarga berada di bawah perusahaan cangkang untuk proteksi
            dan kemudahan suksesi.
          </p>
          <div className="bg-background/50 rounded-lg p-3 inline-block">
            <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">
              Status Legal
            </div>
            <div className="text-emerald-400 text-sm font-medium flex items-center gap-2 justify-center">
              <LockIcon size={14} /> Active & Compliant
            </div>
          </div>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Dewan Direksi & Komisaris
        </h3>
        <div className="bg-card rounded-xl border border-border overflow-hidden mb-8">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                <Users size={16} />
              </div>
              <div>
                <div className="text-foreground text-sm font-medium">Bpk. Budi Santoso</div>
                <div className="text-muted-foreground/70 text-xs">Direktur Utama</div>
              </div>
            </div>
            <span className="text-emerald-400 font-medium text-sm">60% Saham</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-400">
                <Users size={16} />
              </div>
              <div>
                <div className="text-foreground text-sm font-medium">Ibu Siti Aminah</div>
                <div className="text-muted-foreground/70 text-xs">Komisaris Utama</div>
              </div>
            </div>
            <span className="text-emerald-400 font-medium text-sm">40% Saham</span>
          </div>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Aturan Pencairan (Trust Mandate)
        </h3>
        <div className="bg-card p-5 rounded-xl border border-border flex items-start gap-4">
          <div className="pt-1">
            <ScrollText className="text-orange-400" size={24} />
          </div>
          <div>
            <h4 className="text-foreground font-medium text-sm mb-1">Mandat Pendidikan Khusus</h4>
            <p className="text-muted-foreground/70 text-xs leading-relaxed">
              Dividen perusahaan hanya dapat dicairkan maksimum 30% per tahun, kecuali untuk
              pembiayaan pendidikan universitas anak ahli waris.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
