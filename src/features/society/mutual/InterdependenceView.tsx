import { useState } from "react";
import {
  Workflow,
  Link2,
  RefreshCw,
  Plus,
  Search,
  CheckCircle2,
  ArrowRightLeft,
  Boxes,
} from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

interface InterdependenceItem {
  id: string;
  systemName: string;
  type: "Simbiosis Mutualisme" | "Aliran Nilai Ekosistem" | "Penopang Finansial" | "Ketahanan Operasional";
  entityA: string;
  providesToB: string;
  entityB: string;
  providesToA: string;
  interdependenceScore: "Kritis" | "Kuat" | "Moderat";
  resilienceMechanism: string;
  stabilityStatus: "Stabil & Harmonis" | "Perlu Penyeimbangan" | "Fluktuatif";
}

export function InterdependenceView() {
  const [activeType, setActiveType] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<InterdependenceItem[]>([
    {
      id: "dep-1",
      systemName: "Siklus Konsultansi & Keberlanjutan Finansial Klien",
      type: "Simbiosis Mutualisme",
      entityA: "Firma Konsultan (Client OS)",
      providesToB: "Navigasi strategis, pemangkasan risiko regulasi, dan optimasi struktur modal",
      entityB: "Klien Korporasi & Retainer",
      providesToA: "Arus kas berulang yang stabil, data riil dinamika pasar, dan perluasan reputasi",
      interdependenceScore: "Kritis",
      resilienceMechanism: "Kontrak multi-tahun berbasis SLA dengan pembagian nilai tambah (gain-share)",
      stabilityStatus: "Stabil & Harmonis",
    },
    {
      id: "dep-2",
      systemName: "Jaringan Tenaga Ahli & Distribusi Proyek",
      type: "Aliran Nilai Ekosistem",
      entityA: "Firma / Platform Sentral",
      providesToB: "Akses pipeline klien enterprise, sistem manajemen tugas, dan proteksi hukum",
      entityB: "Spesialis & Konsultan Rekanan",
      providesToA: "Kapabilitas teknis mendalam (niche), fleksibilitas delivery, dan skala kapasitas",
      interdependenceScore: "Kuat",
      resilienceMechanism: "Standardisasi metodologi kerja & skema bagi hasil transparan",
      stabilityStatus: "Stabil & Harmonis",
    },
    {
      id: "dep-3",
      systemName: "Keluarga Inti & Entitas Bisnis Usaha",
      type: "Penopang Finansial",
      entityA: "Entitas Bisnis / Portofolio",
      providesToB: "Dividen berkala, jaminan stabilitas ekonomi, dan wahana aktualisasi trah",
      entityB: "Keluarga & Trah Pemilik",
      providesToA: "Legitimasi kepemilikan, modal sabar (patient capital), dan komitmen lintas masa",
      interdependenceScore: "Kritis",
      resilienceMechanism: "Protokol Family Office & pemisahan tegas rekening domestik vs korporasi",
      stabilityStatus: "Stabil & Harmonis",
    },
    {
      id: "dep-4",
      systemName: "Infrastruktur Teknologi & Kedaulatan Data",
      type: "Ketahanan Operasional",
      entityA: "Penyedia Cloud & Security Partner",
      providesToB: "Skalabilitas komputasi, proteksi siber, dan ketersediaan sistem 24/7",
      entityB: "Tim Pengembang & Operasional",
      providesToA: "Pemberian feedback arsitektur, kepatuhan pembayaran rutin, dan lisensi enterprise",
      interdependenceScore: "Kuat",
      resilienceMechanism: "Multi-cloud failover & portabilitas kontainer docker mandiri",
      stabilityStatus: "Perlu Penyeimbangan",
    },
    {
      id: "dep-5",
      systemName: "Komunitas Pembelajar & Inovasi Riset",
      type: "Aliran Nilai Ekosistem",
      entityA: "Lembaga Riset & Komunitas Alumni",
      providesToB: "Inkubasi ide segar, wacana akademik terkini, dan jaringan sosial kerabat",
      entityB: "Praktisi & Konsultan Senior",
      providesToA: "Mentorship riil, studi kasus dunia nyata, dan beasiswa/sponsor inisiatif",
      interdependenceScore: "Moderat",
      resilienceMechanism: "Forum temu rutin dwibulanan & buletin wawasan berkala",
      stabilityStatus: "Stabil & Harmonis",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [systemName, setSystemName] = useState("");
  const [type, setType] = useState<InterdependenceItem["type"]>("Simbiosis Mutualisme");
  const [entityA, setEntityA] = useState("");
  const [providesToB, setProvidesToB] = useState("");
  const [entityB, setEntityB] = useState("");
  const [providesToA, setProvidesToA] = useState("");
  const [interdependenceScore, setInterdependenceScore] = useState<InterdependenceItem["interdependenceScore"]>("Kuat");
  const [resilienceMechanism, setResilienceMechanism] = useState("");
  const [stabilityStatus, setStabilityStatus] = useState<InterdependenceItem["stabilityStatus"]>("Stabil & Harmonis");

  const handleAddItem = () => {
    if (!systemName.trim() || !entityA.trim() || !entityB.trim()) return;
    const newItem: InterdependenceItem = {
      id: `dep-${Date.now()}`,
      systemName: systemName.trim(),
      type,
      entityA: entityA.trim(),
      providesToB: providesToB.trim() || "Kontribusi timbal balik",
      entityB: entityB.trim(),
      providesToA: providesToA.trim() || "Dukungan timbal balik",
      interdependenceScore,
      resilienceMechanism: resilienceMechanism.trim() || "Prosedur operasional bersama",
      stabilityStatus,
    };

    setItems([newItem, ...items]);
    setSystemName("");
    setEntityA("");
    setProvidesToB("");
    setEntityB("");
    setProvidesToA("");
    setResilienceMechanism("");
    setShowAddModal(false);
  };

  const types = ["Semua", "Simbiosis Mutualisme", "Aliran Nilai Ekosistem", "Penopang Finansial", "Ketahanan Operasional"];

  const filteredItems = items.filter((item) => {
    const matchType = activeType === "Semua" || item.type === activeType;
    const matchSearch =
      item.systemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entityA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.entityB.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.providesToA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.providesToB.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const getScoreBadge = (score: InterdependenceItem["interdependenceScore"]) => {
    switch (score) {
      case "Kritis":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Kuat":
        return "bg-primary/10 text-primary border-primary/20";
      case "Moderat":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
    }
  };

  const getStabilityBadge = (status: InterdependenceItem["stabilityStatus"]) => {
    switch (status) {
      case "Stabil & Harmonis":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Perlu Penyeimbangan":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Fluktuatif":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
  };

  const [activeSection, setActiveSection] = useState<string>("metrik");
  const goSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`soc-idep-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useShellSections([
    { id: "metrik", label: "Metrik", active: activeSection === "metrik", onSelect: () => goSection("metrik") },
    { id: "filter", label: "Filter & Cari", active: activeSection === "filter", onSelect: () => goSection("filter") },
    { id: "peta", label: "Peta Relasi", active: activeSection === "peta", onSelect: () => goSection("peta") },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div id="soc-idep-metrik" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Sistem Interdependensi</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Workflow className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{items.length}</span>
            <span className="text-xs text-muted-foreground">Jaringan resiprokal</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Tingkat Simbiosis Kritis</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
              <Link2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">
              {items.filter((i) => i.interdependenceScore === "Kritis").length}
            </span>
            <span className="text-xs text-muted-foreground">Fokus proteksi stabilitas</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Status Harmonis</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round(
                (items.filter((i) => i.stabilityStatus === "Stabil & Harmonis").length / items.length) * 100
              )}
              %
            </span>
            <span className="text-xs text-muted-foreground">Ekosistem tangguh</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Dinamika Alur</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <RefreshCw className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">Dua Arah</span>
            <span className="text-xs text-muted-foreground">Mutual self-sustaining</span>
          </div>
        </div>
      </div>

      {/* Categories & Search */}
      <div id="soc-idep-filter" className="scroll-mt-24 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActiveType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeType === t
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari ketergantungan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium shadow-xs hover:bg-primary/90 transition-colors shrink-0"
          >
            <Plus className="size-3.5" />
            <span>Petakan Interdependensi</span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div id="soc-idep-peta" className="scroll-mt-24 grid grid-cols-1 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-foreground">{item.systemName}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
                    {item.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getScoreBadge(item.interdependenceScore)}`}>
                    Interdependensi {item.interdependenceScore}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStabilityBadge(item.stabilityStatus)}`}>
                    {item.stabilityStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Reciprocal Value Flow Diagram */}
            <div className="p-3 rounded-lg bg-muted/40 space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-2">
                <div className="flex items-center gap-1.5 font-semibold text-foreground min-w-[120px]">
                  <Boxes className="size-3.5 text-primary" />
                  <span>{item.entityA}</span>
                </div>
                <div className="flex-1 flex items-center gap-2 text-muted-foreground px-2">
                  <span className="text-[11px] truncate flex-1 text-right">memberikan: {item.providesToB}</span>
                  <ArrowRightLeft className="size-3.5 text-primary shrink-0" />
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-foreground min-w-[120px] justify-end">
                  <span>{item.entityB}</span>
                  <Boxes className="size-3.5 text-secondary-foreground" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="flex-1 text-[11px] text-muted-foreground">
                  <strong className="text-foreground">Resiprositas Balik:</strong> {item.entityB} menyediakan: {item.providesToA}
                </div>
              </div>
            </div>

            {/* Resilience Mechanism */}
            <div className="bg-primary/5 border border-primary/20 p-2.5 rounded-lg text-xs">
              <span className="text-[11px] font-semibold text-primary block mb-0.5">
                🛡️ Mekanisme Ketahanan & Jaring Pengaman:
              </span>
              <p className="text-foreground/90">{item.resilienceMechanism}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">Petakan Ketergantungan Timbal Balik (Interdependence)</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Nama Sistem / Relasi Timbal Balik</label>
                <input
                  type="text"
                  placeholder="Contoh: Ekosistem Retainer Klien & Kemitraan Konsultan"
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Tipe Relasi</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="Simbiosis Mutualisme">Simbiosis Mutualisme</option>
                    <option value="Aliran Nilai Ekosistem">Aliran Nilai Ekosistem</option>
                    <option value="Penopang Finansial">Penopang Finansial</option>
                    <option value="Ketahanan Operasional">Ketahanan Operasional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Kekuatan Ketergantungan</label>
                  <select
                    value={interdependenceScore}
                    onChange={(e) => setInterdependenceScore(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="Kritis">Kritis (Saling Menentukan Hidup-Mati)</option>
                    <option value="Kuat">Kuat (Pengaruh Signifikan)</option>
                    <option value="Moderat">Moderat (Saling Melengkapi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Pihak A</label>
                  <input
                    type="text"
                    placeholder="Contoh: Firma Konsultan"
                    value={entityA}
                    onChange={(e) => setEntityA(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Apa yang Diberikan A kepada B?</label>
                  <input
                    type="text"
                    placeholder="Contoh: Layanan valuasi & strategi"
                    value={providesToB}
                    onChange={(e) => setProvidesToB(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Pihak B</label>
                  <input
                    type="text"
                    placeholder="Contoh: Klien Korporat"
                    value={entityB}
                    onChange={(e) => setEntityB(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Apa yang Diberikan B kepada A?</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pendapatan retainer rutin"
                    value={providesToA}
                    onChange={(e) => setProvidesToA(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Mekanisme Ketahanan (Resilience Mechanism)</label>
                <input
                  type="text"
                  placeholder="Aturan main, SLA, cadangan kontinjensi, mitigasi..."
                  value={resilienceMechanism}
                  onChange={(e) => setResilienceMechanism(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Status Kestabilan</label>
                <select
                  value={stabilityStatus}
                  onChange={(e) => setStabilityStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                >
                  <option value="Stabil & Harmonis">Stabil & Harmonis</option>
                  <option value="Perlu Penyeimbangan">Perlu Penyeimbangan</option>
                  <option value="Fluktuatif">Fluktuatif</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border hover:bg-muted text-muted-foreground"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Simpan Interdependensi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
