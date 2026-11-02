import { useState } from "react";
import {
  Sparkles,
  Calendar,
} from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

interface Milestone {
  id: string;
  horizon: "Horizon 1 (Core Extension)" | "Horizon 2 (New Ventures)" | "Horizon 3 (Transformative)";
  title: string;
  timeline: string;
  progress: number;
  status: "Berjalan" | "Direncakan" | "Tercapai";
  keyResult: string;
}

export function DevelopmentView() {
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "m-1",
      horizon: "Horizon 1 (Core Extension)",
      title: "Peluncuran Layanan Konsultasi Korporasi B2B Retainer",
      timeline: "Q1 - Q2",
      progress: 100,
      status: "Tercapai",
      keyResult: "10 Klien korporasi baru onboard",
    },
    {
      id: "m-2",
      horizon: "Horizon 1 (Core Extension)",
      title: "Integrasi Platform Portal Digital Client OS Terpadu",
      timeline: "Q2 - Q3",
      progress: 85,
      status: "Berjalan",
      keyResult: "95% adopsi klien aktif pada portal mandiri",
    },
    {
      id: "m-3",
      horizon: "Horizon 2 (New Ventures)",
      title: "Ekspansi Layanan Penilaian Valuasi & Advisory Syariah",
      timeline: "Q3 - Q4",
      progress: 45,
      status: "Berjalan",
      keyResult: "Sertifikasi dan pembentukan divisi advisory khusus",
    },
    {
      id: "m-4",
      horizon: "Horizon 2 (New Ventures)",
      title: "Program Edukasi & Sertifikasi Praktisi Keuangan",
      timeline: "Q4",
      progress: 20,
      status: "Direncakan",
      keyResult: "500 peserta batch 1 kurikulum certified advisor",
    },
    {
      id: "m-5",
      horizon: "Horizon 3 (Transformative)",
      title: "Ekosistem Financial Advisory & Automated Audit",
      timeline: "Tahun Depan",
      progress: 10,
      status: "Direncakan",
      keyResult: "Otomasi analisis laporan keuangan skala multi-nasional",
    },
  ]);

  const [activeSection, setActiveSection] = useState<string>("ringkasan");
  const goSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`soc-dev-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useShellSections([
    { id: "ringkasan", label: "Ringkasan", active: activeSection === "ringkasan", onSelect: () => goSection("ringkasan") },
    { id: "metrik", label: "Metrik", active: activeSection === "metrik", onSelect: () => goSection("metrik") },
    { id: "roadmap", label: "Peta Jalan", active: activeSection === "roadmap", onSelect: () => goSection("roadmap") },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div id="soc-dev-ringkasan" className="scroll-mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[20px] bg-card border border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <Sparkles className="size-4 text-foreground" />
            <span>Fase 4 · Pengembangan & Ekspansi</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Development Framework
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Membangun kapabilitas masa depan, skalabilitas ekosistem, peluncuran produk/lini bisnis baru, serta transformasi jangka panjang melampaui batas saat ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-[20px] bg-muted/60 border border-border text-center">
            <span className="text-xs text-muted-foreground block">Growth Index</span>
            <span className="text-xl font-bold text-foreground">+48.5%</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div id="soc-dev-metrik" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Milestone Tercapai</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">
              {milestones.filter((m) => m.status === "Tercapai").length} / {milestones.length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Sesuai Target
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">2 sedang berjalan agresif</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Horizon Planning</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">3 Horizon</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
              H1, H2, H3
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Peta jalan pertumbuhan jelas</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Skalabilitas Tim & Aset</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">92.0%</span>
            <span className="text-xs text-foreground bg-muted px-2.5 py-1 rounded-full">
              High Readiness
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Kapasitas infrastruktur siap</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Valuasi Potensial</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">2.8x Expansion</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Proyeksi
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Target ekspansi portofolio</span>
        </div>
      </div>

      {/* Development Roadmap */}
      <div id="soc-dev-roadmap" className="scroll-mt-24 p-6 rounded-[20px] bg-card border border-border space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Peta Jalan Pengembangan (Horizon Roadmap)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Distribusi inisiatif jangka pendek, menengah, dan transformasi jangka panjang.
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {milestones.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-[20px] bg-muted/30 border border-border hover:border-foreground/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-background border border-border text-foreground">
                    {m.horizon}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="size-3" />
                    {m.timeline}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{m.title}</h4>
                <p className="text-xs text-muted-foreground">Target Utama: {m.keyResult}</p>
              </div>

              <div className="flex items-center gap-4 sm:w-48 shrink-0">
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">{m.progress}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-foreground rounded-full transition-all duration-500"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full shrink-0 font-medium ${
                    m.status === "Tercapai"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : m.status === "Berjalan"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
