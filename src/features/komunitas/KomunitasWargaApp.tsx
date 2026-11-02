import { useState, useEffect } from "react";
import {
  Home,
  Users,
  Megaphone,
  CreditCard,
  ScrollText,
  Compass,
  CalendarDays,
  FileCheck,
  Receipt,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { StandaloneAppView } from "@/features/standalone/StandaloneAppView";
import { ShellSidebar } from "@/app/shell-sidebar";
import { useShellSections } from "@/app/shell-sections";

export type KomunitasTab =
  | "rt-rw-directory"
  | "community-announcements"
  | "membership-card"
  | "meeting-resolutions"
  | "public-services-guide"
  | "civic-calendar"
  | "civil-registry"
  | "tax-civic";

interface SubFeatureDef {
  id: KomunitasTab;
  title: string;
  shortLabel: string;
  subtitle: string;
  icon: LucideIcon;
  badge: string;
}

export const KOMUNITAS_FEATURES: SubFeatureDef[] = [
  {
    id: "rt-rw-directory",
    title: "Neighbor Directory",
    shortLabel: "Neighbor Directory",
    subtitle: "Direktori kependudukan rukun tetangga, susunan pengurus RT/RW, dan pos satpam.",
    icon: Users,
    badge: "Direktori",
  },
  {
    id: "community-announcements",
    title: "Community Board",
    shortLabel: "Community Board",
    subtitle: "Mading edaran resmi: kerja bakti, fogging DBD, siskamling, dan agenda sosial.",
    icon: Megaphone,
    badge: "Pengumuman",
  },
  {
    id: "membership-card",
    title: "Membership Card",
    shortLabel: "Membership Card",
    subtitle: "Dompet identitas anggota asosiasi, paguyuban alumni, dan koperasi warga.",
    icon: CreditCard,
    badge: "Keanggotaan",
  },
  {
    id: "meeting-resolutions",
    title: "Meeting Resolutions",
    shortLabel: "Meeting Resolutions",
    subtitle: "Arsip notula musyawarah warga, berita acara mufakat, dan realisasi aksi.",
    icon: ScrollText,
    badge: "Notula",
  },
  {
    id: "public-services-guide",
    title: "Services Guide",
    shortLabel: "Services Guide",
    subtitle: "Panduan pengurusan berkas di kelurahan, puskesmas, Samsat, dan kepolisian.",
    icon: Compass,
    badge: "Panduan",
  },
  {
    id: "civic-calendar",
    title: "Civic Calendar",
    shortLabel: "Civic Calendar",
    subtitle: "Agenda pilkada serentak, pemilu, hari libur nasional, dan cuti bersama resmi.",
    icon: CalendarDays,
    badge: "Kalender",
  },
  {
    id: "civil-registry",
    title: "Civil Registry",
    shortLabel: "Civil Registry",
    subtitle: "Pelacak surat pengantar RT, surat pindah, domisili, dan berkas kependudukan.",
    icon: FileCheck,
    badge: "Adminduk",
  },
  {
    id: "tax-civic",
    title: "Civic Tax",
    shortLabel: "Civic Tax",
    subtitle: "Rekapitulasi iuran sampah bulanan, IPL keamanan, dan pelunasan PBB hunian.",
    icon: Receipt,
    badge: "Keuangan Warga",
  },
];

export function KomunitasWargaApp() {
  const routerState = useRouterState();
  const searchParams = (routerState.location.search || {}) as { tab?: string };
  const initialTab: KomunitasTab =
    searchParams.tab && KOMUNITAS_FEATURES.some((f) => f.id === searchParams.tab)
      ? (searchParams.tab as KomunitasTab)
      : "rt-rw-directory";

  const [activeTab, setActiveTab] = useState<KomunitasTab>(initialTab);
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);

  // Otomatis buka sidebar kiri pada tab menu saat halaman dimuat
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("open-left-sidebar", { detail: { tab: "menu" } })
    );
  }, []);


  // Daftarkan ke ShellSections agar selalu muncul di tab Menu sidebar kiri
  useShellSections(
    KOMUNITAS_FEATURES.map((feat) => ({
      id: feat.id,
      label: feat.shortLabel,
      icon: feat.icon,
      active: activeTab === feat.id,
      onSelect: () => setActiveTab(feat.id),
    }))
  );

  const currentFeature =
    KOMUNITAS_FEATURES.find((f) => f.id === activeTab) || KOMUNITAS_FEATURES[0];

  return (
    <div className="w-full flex flex-col gap-6 max-w-7xl mx-auto py-2 px-1">
      {/* LEFT SIDEBAR: Navigasi Menu & Tab Fitur Komunitas Warga */}
      <ShellSidebar>
        {/* Header Modul Komunitas Warga */}
        <div className="p-3.5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 shadow-md shadow-blue-500/25 flex items-center justify-center text-white shrink-0">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-foreground tracking-tight">Komunitas Warga</h2>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/30">
                  RT/RW
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Pusat Kendali Lingkungan</p>
            </div>
          </div>
        </div>

        {/* Menu Tab Fitur Utama (8 Modul) */}
        <div className="p-2 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            8 Modul Terintegrasi
          </div>

          {KOMUNITAS_FEATURES.map((feat) => {
            const Icon = feat.icon;
            const isCurrent = activeTab === feat.id;

            return (
              <button
                key={feat.id}
                onClick={() => setActiveTab(feat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isCurrent
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "text-foreground/80 hover:text-foreground hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 shrink-0 ${isCurrent ? "text-primary-foreground" : "text-blue-500"}`} />
                  <span className="truncate">{feat.shortLabel}</span>
                </div>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isCurrent
                      ? "bg-white/20 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {feat.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Ringkasan Status Lingkungan di Bawah Sidebar */}
        <div className="p-3 mt-auto border-t border-border/70 space-y-2">
          <div className="p-2.5 rounded-xl bg-card border border-border/80 shadow-2xs space-y-1.5 text-xs">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                Data Penduduk
              </span>
              <span className="font-bold text-blue-500 text-[11px]">42 KK / 184 Jiwa</span>
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Iuran RT: 88%</span>
              <span className="text-emerald-500 font-medium">Satpam: 24 Jam</span>
            </div>
          </div>
        </div>
      </ShellSidebar>

      {/* Overview Top Stats Banner */}
      <div className="rounded-2xl border border-border bg-gradient-to-r from-blue-950/40 via-card to-cyan-950/30 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shrink-0">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Komunitas Warga
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wide">
                  Standalone App
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Pusat kendali rukun warga, transparansi iuran pemukiman, direktori RT/RW, dan layanan publik.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Total Warga
              </span>
              <span className="text-sm font-bold text-foreground">42 KK / 184 Jiwa</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Pengumuman
              </span>
              <span className="text-sm font-bold text-blue-500">2 Agenda Aktif</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Status Iuran RT
              </span>
              <span className="text-sm font-bold text-emerald-500">88% Terkumpul</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/60 p-2.5 text-center">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Pos Satpam
              </span>
              <span className="text-sm font-bold text-amber-500">Siaga 24 Jam</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Sub-module Container */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-foreground">
                {currentFeature.title}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-foreground border border-border/60">
                {currentFeature.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {currentFeature.subtitle}
            </p>
          </div>

          <Link
            to="/lainnya"
            search={{ app: activeTab } as any}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Buka Tampilan Penuh</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Embedded Interactive Standalone View */}
        <StandaloneAppView appId={activeTab} />
      </div>
    </div>
  );
}
