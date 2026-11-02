import { ArrowLeft, BookOpen, Users2, ShieldAlert, BadgeCheck } from "lucide-react";
import { useScrollRestore } from "../hooks/useScrollRestore";

export function GovernanceView({ onBack }: { onBack: () => void }) {
  const { ref, onScroll } = useScrollRestore("GovernanceView_scroll");
  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      <div className="p-4 flex items-center gap-3 pt-6 shrink-0 bg-background">
        <button
          onClick={onBack}
          className="text-foreground p-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-foreground tracking-wide">Tata Kelola</h1>
      </div>

      <div ref={ref} onScroll={onScroll} className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="bg-gradient-to-br from-indigo-900/40 to-border border border-indigo-800/30 rounded-2xl p-6 mb-8 text-center text-foreground">
          <Users2 size={32} className="text-indigo-400 mx-auto mb-3" />
          <div className="text-lg font-bold tracking-tight mb-2">Konstitusi Keluarga</div>
          <p className="text-indigo-200/70 text-sm leading-relaxed max-w-xs mx-auto">
            Kesepakatan nilai-nilai inti keluarga dan kerangka kerja untuk pengambilan keputusan
            lintas generasi.
          </p>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Literasi Finansial Generasi Penerus
        </h3>
        <div className="space-y-4 mb-8">
          <div className="bg-card p-5 rounded-2xl border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                <BadgeCheck size={20} />
              </div>
              <div>
                <h4 className="text-foreground font-medium">Kurikulum Usia 13-17</h4>
                <p className="text-muted-foreground/70 text-xs mt-0.5">
                  Pengenalan budgeting & menabung
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-[#2a2a2a] p-3 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Budi Santoso telah menyelesaikan modul 1 (Budgeting)
            </div>
          </div>
          <div className="bg-card p-5 rounded-2xl border border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400">
                <BookOpen size={20} />
              </div>
              <div>
                <h4 className="text-foreground font-medium">Kurikulum Usia 18+</h4>
                <p className="text-muted-foreground/70 text-xs mt-0.5">
                  Pemahaman kredit & investasi dasar
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-[#2a2a2a] p-3 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2a2a2a]"></span>
              Belum ada generasi penerus di kategori usia ini.
            </div>
          </div>
        </div>

        <h3 className="text-muted-foreground text-sm font-medium mb-4 uppercase tracking-wider">
          Mekanisme Resolusi Konflik
        </h3>
        <div className="bg-card p-5 rounded-2xl border border-border flex items-start gap-4">
          <div className="pt-1">
            <ShieldAlert className="text-orange-400" size={24} />
          </div>
          <div>
            <h4 className="text-foreground font-medium text-sm mb-1">Dewan Keluarga Tetap</h4>
            <p className="text-muted-foreground/70 text-xs leading-relaxed mb-3">
              Dibentuk untuk menengahi perbedaan pendapat dalam pengelolaan harta waris atau bisnis
              keluarga.
            </p>
            <div className="bg-[#2a2a2a] px-3 py-2 rounded-lg text-xs text-muted-foreground border border-border">
              Penengah Eksternal: Dr. H. Rahman, MA (Konsultan)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
