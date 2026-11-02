import { useState } from "react";
import {
  ShieldCheck,
  Filter,
} from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

interface RelianceItem {
  id: string;
  category: "Operasional" | "Finansial" | "Vendor & Mitra" | "Sumber Daya";
  name: string;
  dependenceLevel: "Tinggi" | "Sedang" | "Rendah";
  mitigationStatus: "Terlindungi" | "Dalam Proses" | "Perlu Perhatian";
  contingencyPlan: string;
}

export function RelianceView() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [items, setItems] = useState<RelianceItem[]>([
    {
      id: "rel-1",
      category: "Operasional",
      name: "Sistem Manajemen Data & Cloud Utama",
      dependenceLevel: "Tinggi",
      mitigationStatus: "Terlindungi",
      contingencyPlan: "Automated daily multi-cloud backup & mirror server aktif.",
    },
    {
      id: "rel-2",
      category: "Finansial",
      name: "Ketergantungan Arus Kas Klien Tunggal",
      dependenceLevel: "Sedang",
      mitigationStatus: "Dalam Proses",
      contingencyPlan: "Diversifikasi portofolio retainer ke minimal 5 klien utama.",
    },
    {
      id: "rel-3",
      category: "Vendor & Mitra",
      name: "Mitra Logistik & Pengiriman Kunci",
      dependenceLevel: "Sedang",
      mitigationStatus: "Terlindungi",
      contingencyPlan: "SLA dengan 3 penyedia ekspedisi cadangan terverifikasi.",
    },
    {
      id: "rel-4",
      category: "Sumber Daya",
      name: "Single Point of Failure Tenaga Ahli Kunci",
      dependenceLevel: "Tinggi",
      mitigationStatus: "Dalam Proses",
      contingencyPlan: "Standard Operating Procedure (SOP) tertulis & program mentoring peer.",
    },
    {
      id: "rel-5",
      category: "Finansial",
      name: "Cadangan Likuiditas Darurat (Min 3 Bulan)",
      dependenceLevel: "Rendah",
      mitigationStatus: "Terlindungi",
      contingencyPlan: "Dana cadangan tersimpan di instrumen likuid syariah.",
    },
  ]);

  const [checklist, setChecklist] = useState([
    { id: "c1", label: "Audit seluruh titik ketergantungan kritis (SPOF)", done: true },
    { id: "c2", label: "Menyusun SOP kontinjensi darurat per divisi", done: true },
    { id: "c3", label: "Menetapkan batas rasio dependensi klien maksimal 25%", done: false },
    { id: "c4", label: "Simulasi uji pemulihan bencana sistem (DRP)", done: false },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c)),
    );
  };

  const filteredItems =
    activeCategory === "Semua"
      ? items
      : items.filter((item) => item.category === activeCategory);

  const [activeSection, setActiveSection] = useState<string>("ringkasan");
  const goSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`soc-rel-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useShellSections([
    { id: "ringkasan", label: "Ringkasan", active: activeSection === "ringkasan", onSelect: () => goSection("ringkasan") },
    { id: "metrik", label: "Metrik", active: activeSection === "metrik", onSelect: () => goSection("metrik") },
    { id: "daftar", label: "Daftar Risiko", active: activeSection === "daftar", onSelect: () => goSection("daftar") },
    { id: "checklist", label: "Checklist", active: activeSection === "checklist", onSelect: () => goSection("checklist") },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div id="soc-rel-ringkasan" className="scroll-mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[20px] bg-card border border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <ShieldCheck className="size-4 text-foreground" />
            <span>Fase 1 · Pondasi & Keandalan</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Reliance Framework
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Menganalisis dan mengamankan titik ketergantungan kritis agar organisasi memiliki fondasi yang kokoh, tangguh terhadap risiko, dan tidak mudah goyah.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-[20px] bg-muted/60 border border-border text-center">
            <span className="text-xs text-muted-foreground block">Indeks Keandalan</span>
            <span className="text-xl font-bold text-foreground">86.4%</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div id="soc-rel-metrik" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Ketergantungan Kritis</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">2 Posisi</span>
            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full">
              Dipantau
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">1 dalam mitigasi aktif</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Kontinjensi Cadangan</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">90 Hari</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              Aman
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Buffer minimum terpenuhi</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Status Perlindungan</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">80%</span>
            <span className="text-xs text-foreground bg-muted px-2.5 py-1 rounded-full">
              4/5 Tercover
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Mitigasi risiko berjalan</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Tingkat Kemandirian</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">Stabil</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full">
              Tahap 1 Lolos
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Siap menuju Sufficient</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table / List (2 cols) */}
        <div id="soc-rel-daftar" className="scroll-mt-24 lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filter Kategori:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {["Semua", "Operasional", "Finansial", "Vendor & Mitra", "Sumber Daya"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      activeCategory === cat
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {cat}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-[20px] bg-card border border-border flex flex-col gap-2 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-foreground">
                      {item.category}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full ${
                      item.dependenceLevel === "Tinggi"
                        ? "bg-red-500/10 text-red-600 dark:text-red-400 font-medium"
                        : item.dependenceLevel === "Sedang"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium"
                    }`}
                  >
                    Tingkat: {item.dependenceLevel}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                  <span className="font-medium text-foreground/80">Rencana Kontinjensi:</span>
                  <span>{item.contingencyPlan}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                  <span className="text-muted-foreground">Status Mitigasi:</span>
                  <span
                    className={`font-medium ${
                      item.mitigationStatus === "Terlindungi"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : item.mitigationStatus === "Dalam Proses"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    ● {item.mitigationStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action / Checklist Sidebar (1 col) */}
        <div id="soc-rel-checklist" className="scroll-mt-24 space-y-4">
          <div className="p-5 rounded-[20px] bg-card border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Checklist Kesiapan Reliance
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Centang langkah evaluasi yang telah tuntas dilaksanakan.
            </p>
            <div className="space-y-3">
              {checklist.map((c) => (
                <label
                  key={c.id}
                  onClick={() => toggleChecklist(c.id)}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={c.done}
                    onChange={() => {}}
                    className="mt-0.5 size-4 rounded text-foreground accent-foreground cursor-pointer"
                  />
                  <span
                    className={`text-xs leading-relaxed ${
                      c.done
                        ? "text-muted-foreground line-through"
                        : "text-foreground font-medium"
                    }`}
                  >
                    {c.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-[20px] bg-muted/30 border border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Langkah Berikutnya
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Setelah seluruh fondasi ketergantungan terlindungi, lanjutkan ke tahap berikutnya:{" "}
              <strong className="text-foreground">Sufficient</strong> untuk memastikan ambang kecukupan arus kas dan kemandirian operasional tercapai.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
