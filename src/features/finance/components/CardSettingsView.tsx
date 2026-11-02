import { ChevronLeft, Bell, Lock, Shield, CircleHelp, ExternalLink } from "lucide-react";

export function CardSettingsView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-transparent p-4 font-sans text-foreground pb-20">
      <div className="flex items-center gap-2 mb-6 pt-2">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft size={28} strokeWidth={2} />
        </button>
        <h1 className="text-lg font-normal tracking-wide text-foreground">Pengaturan Kartu</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="bg-[#2a2a2a] p-2 rounded-xl text-blue-400">
              <Bell size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">Notifikasi Tagihan</h3>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Pengingat untuk pembayaran jatuh tempo
              </p>
            </div>
            <div className="w-11 h-6 bg-[#4caf50] rounded-full p-1 flex justify-end">
              <div className="w-4 h-4 bg-card rounded-full"></div>
            </div>
          </div>

          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="bg-[#2a2a2a] p-2 rounded-xl text-amber-400">
              <Lock size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">Keamanan Biometrik</h3>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Kunci akses menggunakan Face/Touch ID
              </p>
            </div>
            <div className="w-11 h-6 bg-[#4caf50] rounded-full p-1 flex justify-end">
              <div className="w-4 h-4 bg-card rounded-full"></div>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-accent transition-colors">
            <div className="bg-[#2a2a2a] p-2 rounded-xl text-purple-400">
              <Shield size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">Privasi Data</h3>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Atur pelacakan analitik dan pengelolaan data Anda
              </p>
            </div>
            <ExternalLink size={16} className="text-muted-foreground/70" />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="p-4 flex items-center gap-3 cursor-pointer hover:bg-accent transition-colors">
            <div className="bg-[#2a2a2a] p-2 rounded-xl text-teal-400">
              <CircleHelp size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-foreground">Bantuan & FAQ</h3>
              <p className="text-xs text-muted-foreground/70 mt-0.5">
                Temukan solusi dari masalah umum
              </p>
            </div>
            <ExternalLink size={16} className="text-muted-foreground/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
