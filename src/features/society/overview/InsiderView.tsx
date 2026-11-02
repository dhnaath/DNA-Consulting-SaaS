import { useState } from "react";
import {
  Eye,
  Filter,
} from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

interface InsiderReport {
  id: string;
  category: "Tata Kelola" | "Kepatuhan" | "Stakeholder" | "Audit";
  title: string;
  status: "Selesai" | "Aktif Dimonitor" | "Tinjauan";
  urgency: "Tinggi" | "Normal" | "Rendah";
  date: string;
  summary: string;
}

export function InsiderView() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [reports] = useState<InsiderReport[]>([
    {
      id: "ins-1",
      category: "Tata Kelola",
      title: "Audit Transparansi Kepemilikan & Ekuitas Internal",
      status: "Selesai",
      urgency: "Normal",
      date: "14 Sep 2026",
      summary: "Evaluasi pembagian hak suara pemegang saham dan kepatuhan anggaran dasar.",
    },
    {
      id: "ins-2",
      category: "Kepatuhan",
      title: "Monitoring Transaksi Pihak Terafiliasi & Benturan Kepentingan",
      status: "Aktif Dimonitor",
      urgency: "Tinggi",
      date: "12 Sep 2026",
      summary: "Pemeriksaan berkala atas pengadaan vendor yang memiliki relasi afiliasi internal.",
    },
    {
      id: "ins-3",
      category: "Audit",
      title: "Review Akses Kredensial Data Sensitif & Finansial",
      status: "Aktif Dimonitor",
      urgency: "Tinggi",
      date: "09 Sep 2026",
      summary: "Pemberlakuan rotasi kunci API dan pembatasan hak akses berbasis peranan jabatan.",
    },
    {
      id: "ins-4",
      category: "Stakeholder",
      title: "Survei Kepuasan & Retensi Tenaga Ahli Kunci",
      status: "Selesai",
      urgency: "Normal",
      date: "05 Sep 2026",
      summary: "Tingkat kepuasan tim konsultan mencapai 91% dengan retensi loyalitas tinggi.",
    },
    {
      id: "ins-5",
      category: "Kepatuhan",
      title: "Sosialisasi Pakta Integritas & Kerahasiaan Klien (NDA)",
      status: "Tinjauan",
      urgency: "Rendah",
      date: "01 Sep 2026",
      summary: "Pembaruan klausul perlindungan data pribadi dan rahasia dagang klien konsultan.",
    },
  ]);

  const filtered =
    activeCategory === "Semua"
      ? reports
      : reports.filter((r) => r.category === activeCategory);

  const [activeSection, setActiveSection] = useState<string>("ringkasan");
  const goSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`soc-ins-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useShellSections([
    { id: "ringkasan", label: "Ringkasan", active: activeSection === "ringkasan", onSelect: () => goSection("ringkasan") },
    { id: "metrik", label: "Metrik", active: activeSection === "metrik", onSelect: () => goSection("metrik") },
    { id: "laporan", label: "Laporan", active: activeSection === "laporan", onSelect: () => goSection("laporan") },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div id="soc-ins-ringkasan" className="scroll-mt-24 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-[20px] bg-card border border-border">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            <Eye className="size-4 text-foreground" />
            <span>Organization-Optimizing · Intelijen & Tata Kelola Internal</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Insider Intelligence
          </h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Pemantauan internal, kepatuhan tata kelola organisasi, audit hak akses rahasia, dan mitigasi benturan kepentingan pemangku kepentingan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-[20px] bg-muted/60 border border-border text-center">
            <span className="text-xs text-muted-foreground block">Skor Integritas</span>
            <span className="text-xl font-bold text-foreground">96.8%</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Kepatuhan Etika & NDA</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">100%</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
              Verified
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Seluruh personel tersertifikasi</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Audit Akses Finansial</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">Aman</span>
            <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full font-medium">
              Terkunci
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Zero breach reported</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Pemantauan Benturan</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">0 Kasus</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
              Bebas Afiliasi
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Transparansi penuh</span>
        </div>

        <div className="p-5 rounded-[20px] bg-card border border-border flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Retensi Internal</span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-foreground">94.5%</span>
            <span className="text-xs text-foreground bg-muted px-2.5 py-1 rounded-full font-medium">
              Stabil
            </span>
          </div>
          <span className="text-xs text-muted-foreground mt-2">Kondisi tim kondusif</span>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Kategori Dokumen & Audit:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {["Semua", "Tata Kelola", "Kepatuhan", "Stakeholder", "Audit"].map((cat) => (
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
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-[20px] bg-card border border-border hover:border-foreground/20 transition-colors flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-muted text-foreground">
                    {r.category}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      r.status === "Selesai"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : r.status === "Aktif Dimonitor"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{r.title}</h4>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {r.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                <span>Tanggal: {r.date}</span>
                <span className={r.urgency === "Tinggi" ? "text-amber-600 font-medium" : ""}>
                  Urgensi: {r.urgency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
