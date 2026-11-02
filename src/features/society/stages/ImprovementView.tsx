import { useState } from "react";
import {
  TrendingUp,
  Zap,
  Filter,
} from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

interface Initiative {
  id: string;
  title: string;
  area: "Efisiensi" | "Kualitas" | "Otomasi" | "Biaya";
  impact: "Tinggi" | "Sedang" | "Rendah";
  effort: "Rendah" | "Sedang" | "Tinggi";
  status: "In Progress" | "Planned" | "Completed";
  metricGain: string;
}

export function ImprovementView() {
  const [filterArea, setFilterArea] = useState<string>("Semua");
  const [initiatives, setInitiatives] = useState<Initiative[]>([
    {
      id: "imp-1",
      title: "Otomasi Penerbitan Faktur & Rekonsiliasi Otomatis",
      area: "Otomasi",
      impact: "Tinggi",
      effort: "Rendah",
      status: "Completed",
      metricGain: "Hemat 14 jam kerja/minggu",
    },
    {
      id: "imp-2",
      title: "Standarisasi Checklist QA Sebelum Delivery Proyek",
      area: "Kualitas",
      impact: "Tinggi",
      effort: "Rendah",
      status: "In Progress",
      metricGain: "Reduksi komplain revisi -65%",
    },
    {
      id: "imp-3",
      title: "Optimasi Alur Onboarding Klien Baru (Template & Portal)",
      area: "Efisiensi",
      impact: "Sedang",
      effort: "Sedang",
      status: "In Progress",
      metricGain: "Waktu kickoff terpangkas dari 5 hari ke 1 hari",
    },
    {
      id: "imp-4",
      title: "Audit Langganan Software & Konsolidasi Tool SaaS",
      area: "Biaya",
      impact: "Sedang",
      effort: "Rendah",
      status: "Completed",
      metricGain: "Hemat Rp 4.2 Juta/bulan",
    },
    {
      id: "imp-5",
      title: "Penerapan Sistem Riset Regulasi & Pajak Terpadu",
      area: "Otomasi",
      impact: "Tinggi",
      effort: "Sedang",
      status: "Planned",
      metricGain: "Percepatan penyusunan draft opini 3x lipat",
    },
  ]);

  const filteredInitiatives =
    filterArea === "Semua"
      ? initiatives
      : initiatives.filter((i) => i.area === filterArea);

  const [activeSection, setActiveSection] = useState<string>("ringkasan");
  const goSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`soc-imp-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useShellSections([
    { id: "ringkasan", label: "Ringkasan", active: activeSection === "ringkasan", onSelect: () => goSection("ringkasan") },
    { id: "metrik", label: "Metrik", active: activeSection === "metrik", onSelect: () => goSection("metrik") },
    { id: "inisiatif", label: "Inisiatif", active: activeSection === "inisiatif", onSelect: () => goSection("inisiatif") },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div id="soc-imp-ringkasan" className="scroll-mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[20px] bg-card border border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <TrendingUp className="size-4 text-foreground" />
            <span>Fase 3 · Optimalisasi & Kaizen</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Improvement Framework
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Fokus pada continuous improvement (Kaizen), eliminasi bottleneck, pemangkasan biaya tidak efisien, dan percepatan kecepatan eksekusi proses yang sudah berjalan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-[20px] bg-muted/60 border border-border text-center">
            <span className="text-xs text-muted-foreground block">Gain Efisiensi</span>
            <span className="text-xl font-bold text-foreground">+32.4%</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div id="soc-imp-metrik" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Inisiatif Aktif</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">5 Inisiatif</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
              2 Selesai
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">2 In Progress, 1 Planned</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Cycle Time Reduksi</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">-45%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Optimal
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Rata-rata penyelesaian tugas</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Penghematan Biaya</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">Rp 50.4 Jt/thn</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Penghematan
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Dari eliminasi pemborosan</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Skor Kualitas (QA)</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">98.2%</span>
            <span className="text-xs text-foreground bg-muted px-2.5 py-1 rounded-full">
              SLA Tercapai
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Siap menuju Development</span>
        </div>
      </div>

      {/* Main Backlog & Prioritization */}
      <div id="soc-imp-inisiatif" className="scroll-mt-24 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filter Area Perbaikan:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Semua", "Efisiensi", "Kualitas", "Otomasi", "Biaya"].map((area) => (
              <button
                key={area}
                onClick={() => setFilterArea(area)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  filterArea === area
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInitiatives.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between gap-4 hover:border-foreground/20 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-foreground">
                    {item.area}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      item.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : item.status === "In Progress"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground leading-snug">
                  {item.title}
                </h4>
              </div>

              <div className="space-y-2 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Impact: <strong className="text-foreground">{item.impact}</strong></span>
                  <span>Effort: <strong className="text-foreground">{item.effort}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <Zap className="size-3.5" />
                  <span>{item.metricGain}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
