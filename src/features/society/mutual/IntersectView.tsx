import { useState } from "react";
import {
  Layers,
  Sparkles,
  GitMerge,
  Plus,
  Search,
  Zap,
} from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

interface IntersectItem {
  id: string;
  intersectionName: string;
  domainA: string;
  domainB: string;
  jointOutput: string;
  multiplierEffect: string;
  maturity: "Eksplorasi" | "Validasi Pilot" | "Produksi Aktif" | "Matang";
  activeInitiatives: number;
  leadOwner: string;
}

export function IntersectView() {
  const [activeMaturity, setActiveMaturity] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<IntersectItem[]>([
    {
      id: "sec-1",
      intersectionName: "Data-Driven Business Valuation",
      domainA: "Keahlian Valuasi Finansial (MAPPI/SPI)",
      domainB: "Otomasi Algoritmik & Analitik Data",
      jointOutput: "Platform simulasi valuasi real-time berbasis data historis transaksi pasar",
      multiplierEffect: "Pemangkasan waktu draft valuasi dari 14 hari menjadi 48 jam (efisiensi 7x)",
      maturity: "Produksi Aktif",
      activeInitiatives: 3,
      leadOwner: "Divisi Finansial & Tech Lead",
    },
    {
      id: "sec-2",
      intersectionName: "Green Supply Chain & Carbon Audit",
      domainA: "Manajemen Logistik & Perdagangan",
      domainB: "Standar Keberlanjutan ESG & Regulasi Emisi",
      jointOutput: "Toolkit kalkulasi emisi rantai pasok dan sertifikasi kepatuhan ekspor",
      multiplierEffect: "Membuka pasar ekspor klien ke Uni Eropa tanpa hambatan regulasi CBAM",
      maturity: "Validasi Pilot",
      activeInitiatives: 2,
      leadOwner: "Konsultan ESG & Asosiasi Kargo",
    },
    {
      id: "sec-3",
      intersectionName: "Strategic Family Governance Office",
      domainA: "Manajemen Hubungan Kerabat & Trah",
      domainB: "Perencanaan Ekuitas & Proteksi Aset Pemilik",
      jointOutput: "Piagam keluarga (Family Constitution) & protokol transisi kepemimpinan terpadu",
      multiplierEffect: "Mitigasi friksi suksesi dan pengamanan keutuhan aset lintas generasi",
      maturity: "Produksi Aktif",
      activeInitiatives: 4,
      leadOwner: "Senior Partner & Penasihat Hukum",
    },
    {
      id: "sec-4",
      intersectionName: "Omnichannel Client Advisory Portal",
      domainA: "Layanan Konsultasi Tatap Muka",
      domainB: "Dashboard Self-Service Client OS",
      jointOutput: "Portal terintegrasi pemantauan kesehatan finansial dan matriks proyek",
      multiplierEffect: "Meningkatkan retensi klien hingga 40% dengan interaksi tanpa jeda",
      maturity: "Matang",
      activeInitiatives: 5,
      leadOwner: "Tim Produk & Client Relations",
    },
    {
      id: "sec-5",
      intersectionName: "Halal Industry Investment & Compliance",
      domainA: "Hukum Muamalah & Zakat Finansial",
      domainB: "Venture Builder & Portofolio Bisnis",
      jointOutput: "Skema pembiayaan musyarakah/mudharabah untuk bisnis rintisan binaan",
      multiplierEffect: "Akses likuiditas syariah etis tanpa beban bunga ribawi",
      maturity: "Eksplorasi",
      activeInitiatives: 1,
      leadOwner: "Advisor Syariah & Investment Analyst",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [intersectionName, setIntersectionName] = useState("");
  const [domainA, setDomainA] = useState("");
  const [domainB, setDomainB] = useState("");
  const [jointOutput, setJointOutput] = useState("");
  const [multiplierEffect, setMultiplierEffect] = useState("");
  const [maturity, setMaturity] = useState<IntersectItem["maturity"]>("Validasi Pilot");
  const [activeInitiatives, setActiveInitiatives] = useState(1);
  const [leadOwner, setLeadOwner] = useState("");

  const handleAddItem = () => {
    if (!intersectionName.trim() || !domainA.trim() || !domainB.trim()) return;
    const newItem: IntersectItem = {
      id: `sec-${Date.now()}`,
      intersectionName: intersectionName.trim(),
      domainA: domainA.trim(),
      domainB: domainB.trim(),
      jointOutput: jointOutput.trim() || "Solusi terintegrasi lintas disiplin",
      multiplierEffect: multiplierEffect.trim() || "Efisiensi dan sinergi nilai baru",
      maturity,
      activeInitiatives: activeInitiatives || 1,
      leadOwner: leadOwner.trim() || "Tim Kolaborasi Silang",
    };

    setItems([newItem, ...items]);
    setIntersectionName("");
    setDomainA("");
    setDomainB("");
    setJointOutput("");
    setMultiplierEffect("");
    setLeadOwner("");
    setShowAddModal(false);
  };

  const maturities = ["Semua", "Eksplorasi", "Validasi Pilot", "Produksi Aktif", "Matang"];

  const filteredItems = items.filter((item) => {
    const matchMaturity = activeMaturity === "Semua" || item.maturity === activeMaturity;
    const matchSearch =
      item.intersectionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domainA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domainB.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.jointOutput.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMaturity && matchSearch;
  });

  const getMaturityBadge = (mat: IntersectItem["maturity"]) => {
    switch (mat) {
      case "Matang":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Produksi Aktif":
        return "bg-primary/10 text-primary border-primary/20";
      case "Validasi Pilot":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "Eksplorasi":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
  };

  const totalInitiatives = items.reduce((acc, curr) => acc + curr.activeInitiatives, 0);

  const [activeSection, setActiveSection] = useState<string>("metrik");
  const goSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`soc-isect-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useShellSections([
    { id: "metrik", label: "Metrik", active: activeSection === "metrik", onSelect: () => goSection("metrik") },
    { id: "filter", label: "Filter & Cari", active: activeSection === "filter", onSelect: () => goSection("filter") },
    { id: "titiktemu", label: "Titik Temu", active: activeSection === "titiktemu", onSelect: () => goSection("titiktemu") },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div id="soc-isect-metrik" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Titik Temu Sinergis</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Layers className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{items.length}</span>
            <span className="text-xs text-muted-foreground">Persilangan domain</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Inisiatif Aktif</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Zap className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{totalInitiatives}</span>
            <span className="text-xs text-muted-foreground">Proyek kolaborasi</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Status Produksi/Matang</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {items.filter((i) => i.maturity === "Produksi Aktif" || i.maturity === "Matang").length}
            </span>
            <span className="text-xs text-muted-foreground">Menghasilkan nilai</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Multiplier Effect</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <GitMerge className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">High</span>
            <span className="text-xs text-muted-foreground">Pengungkit nilai 1+1&gt;2</span>
          </div>
        </div>
      </div>

      {/* Categories & Search */}
      <div id="soc-isect-filter" className="scroll-mt-24 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {maturities.map((mat) => (
            <button
              key={mat}
              type="button"
              onClick={() => setActiveMaturity(mat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeMaturity === mat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {mat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari titik temu..."
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
            <span>Titik Temu Baru</span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div id="soc-isect-titiktemu" className="scroll-mt-24 grid grid-cols-1 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-foreground">{item.intersectionName}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getMaturityBadge(item.maturity)}`}>
                    {item.maturity}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
                    {item.activeInitiatives} Inisiatif Aktif
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <span>PIC: <strong className="text-foreground">{item.leadOwner}</strong></span>
                </div>
              </div>
            </div>

            {/* Convergence Visual Diagram */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/40 text-xs flex-wrap md:flex-nowrap">
              <div className="flex-1 min-w-[140px] bg-card p-2 rounded-md border border-border text-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">Domain A</span>
                <span className="font-semibold text-foreground">{item.domainA}</span>
              </div>
              <div className="shrink-0 flex items-center justify-center p-1.5 rounded-full bg-primary/10 text-primary">
                <GitMerge className="size-4" />
              </div>
              <div className="flex-1 min-w-[140px] bg-card p-2 rounded-md border border-border text-center">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-0.5">Domain B</span>
                <span className="font-semibold text-foreground">{item.domainB}</span>
              </div>
            </div>

            {/* Output & Multiplier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-primary/5 border border-primary/20 p-2.5 rounded-lg">
                <span className="text-[11px] font-semibold text-primary block mb-0.5">
                  📦 Hasil Titik Temu (Joint Output):
                </span>
                <p className="text-foreground/90">{item.jointOutput}</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-lg">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                  🚀 Efek Pengganda (Multiplier Effect):
                </span>
                <p className="text-foreground/90">{item.multiplierEffect}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg bg-card border border-border rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">Daftarkan Titik Temu Baru (Intersect)</h3>
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
                <label className="block text-muted-foreground mb-1 font-medium">Nama Titik Temu / Inovasi Sinergi</label>
                <input
                  type="text"
                  placeholder="Contoh: Digital Agri-Commodity Trading"
                  value={intersectionName}
                  onChange={(e) => setIntersectionName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Domain / Kapabilitas A</label>
                  <input
                    type="text"
                    placeholder="Contoh: Logistik Rantai Pasok"
                    value={domainA}
                    onChange={(e) => setDomainA(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Domain / Kapabilitas B</label>
                  <input
                    type="text"
                    placeholder="Contoh: Otomasi IoT & Sensor"
                    value={domainB}
                    onChange={(e) => setDomainB(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Tahap Kematangan</label>
                  <select
                    value={maturity}
                    onChange={(e) => setMaturity(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="Eksplorasi">Eksplorasi</option>
                    <option value="Validasi Pilot">Validasi Pilot</option>
                    <option value="Produksi Aktif">Produksi Aktif</option>
                    <option value="Matang">Matang</option>
                  </select>
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Penanggung Jawab (Lead)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Unit Bisnis & R&D"
                    value={leadOwner}
                    onChange={(e) => setLeadOwner(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Hasil Konvergensi (Joint Output)</label>
                <textarea
                  rows={2}
                  placeholder="Produk, framework, atau sistem yang dihasilkan..."
                  value={jointOutput}
                  onChange={(e) => setJointOutput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Multiplier Effect</label>
                <input
                  type="text"
                  placeholder="Dampak pengungkit terhadap kecepatan, biaya, atau nilai..."
                  value={multiplierEffect}
                  onChange={(e) => setMultiplierEffect(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
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
                Simpan Titik Temu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
