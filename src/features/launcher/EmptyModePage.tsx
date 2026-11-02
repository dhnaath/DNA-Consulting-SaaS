import { LucideIcon, Sparkles } from "lucide-react";

export interface EmptyModePageProps {
  id: string;
  label: string;
  badge: string;
  desc: string;
  icon: LucideIcon;
  badgeClass?: string;
}

export function EmptyModePage({
  label,
  badge,
  desc,
  icon: Icon,
}: EmptyModePageProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[520px] py-10 px-4 text-center font-sans">
      {/* Header Mode */}
      <div className="max-w-xl mx-auto space-y-2.5 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
          <Icon className="size-3.5" />
          <span>MODE: {badge.toUpperCase()}</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
          Halaman {label}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
          {desc}
        </p>
      </div>

      {/* Empty State Canvas Box */}
      <div className="w-full max-w-3xl mx-auto rounded-3xl border-2 border-dashed border-border/80 bg-card/40 backdrop-blur-xs p-10 sm:p-16 flex flex-col items-center justify-center text-center space-y-4 hover:border-primary/40 transition-colors">
        <div className="size-16 sm:size-20 rounded-3xl bg-muted/60 border border-border/80 flex items-center justify-center text-muted-foreground shadow-2xs">
          <Icon className="size-8 sm:size-10 stroke-[1.5]" />
        </div>

        <div className="space-y-1.5 max-w-md">
          <h4 className="text-base sm:text-lg font-bold text-foreground">
            Halaman Siap Dikonfigurasi
          </h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Halaman ini sementara dikosongkan sesuai permintaan Anda. Anda dapat menentukan konten, modul, dan widget yang akan dimasukkan ke dalam ruang kerja mode {label} ini.
          </p>
        </div>

        <div className="pt-2 flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Slot Halaman Mode #{label} aktif di Launcher</span>
        </div>
      </div>
    </div>
  );
}
