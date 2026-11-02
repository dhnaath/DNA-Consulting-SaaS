import {
  EyeOff,
  Settings,
  ChevronRight,
  Banknote,
  Plus,
  ArrowLeft,
} from "lucide-react";

export function HomeView({
  onNavigate,
  onBack,
  onUnavailable,
}: {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
  onUnavailable?: () => void;
}) {
  return (
    <div className="p-4 space-y-4 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pt-2">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-muted-foreground p-1">
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-2xl font-normal tracking-wide">Beranda</h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onUnavailable}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <EyeOff size={24} />
          </button>
          <button
            onClick={() => onNavigate("tracker_settings")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Akun Card (Starts Empty) */}
      <div className="bg-card rounded-2xl p-5 border border-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-medium text-foreground">Akun (Dompet & Rekening)</h2>
          <div className="flex gap-4">
            <button onClick={() => onNavigate("new_account")}>
              <Plus size={20} className="text-[#4caf50]" />
            </button>
            <button onClick={onUnavailable}>
              <ChevronRight size={20} className="text-muted-foreground hover:text-foreground" />
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center text-center py-4 text-muted-foreground">
          <Banknote size={28} className="opacity-50 mb-2" />
          <p className="text-sm">Belum ada akun dompet atau rekening yang ditambahkan.</p>
          <button
            onClick={() => onNavigate("new_account")}
            className="mt-3 px-4 py-2 border border-border text-sm text-muted-foreground rounded-full hover:bg-accent"
          >
            Tambah Akun Pertama
          </button>
        </div>
      </div>
    </div>
  );
}
