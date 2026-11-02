import { useState } from "react";
import {
  Heart,
  Target,
  AlertCircle,
  Plus,
  Search,
  Scale,
} from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

interface InterestItem {
  id: string;
  partnerName: string;
  category: "Strategis & Bisnis" | "Pengembangan Kapasitas" | "Nilai & Budaya" | "Finansial";
  sharedGoal: string;
  ourInterest: string;
  theirInterest: string;
  alignmentScore: number; // 0 - 100
  status: "Sangat Selaras" | "Cukup Selaras" | "Perlu Negosiasi";
  frictionPoint: string;
  winWinFormula: string;
}

export function InterestView() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<InterestItem[]>([
    {
      id: "int-1",
      partnerName: "Konsorsium Klien Industri Manufaktur",
      category: "Strategis & Bisnis",
      sharedGoal: "Digitalisasi Proses Valuasi & Optimasi Rantai Pasok",
      ourInterest: "Memperluas portofolio konsultansi skala enterprise & rekurensi retainer",
      theirInterest: "Efisiensi biaya operasional 18% & visibilitas data real-time",
      alignmentScore: 92,
      status: "Sangat Selaras",
      frictionPoint: "Ekspektasi timeline implementasi yang sangat ketat di kuartal IV",
      winWinFormula: "Pendekatan modular bertahap (agile rollout) dengan quick-wins di bulan pertama",
    },
    {
      id: "int-2",
      partnerName: "Asosiasi Profesi & Konsultan Rekanan",
      category: "Nilai & Budaya",
      sharedGoal: "Standardisasi Etika Profesi & Kurikulum Sertifikasi",
      ourInterest: "Memperkuat reputasi pemikiran (thought leadership) & standarisasi mutu",
      theirInterest: "Akses terhadap framework teruji dan pembicara ahli berpengalaman",
      alignmentScore: 88,
      status: "Sangat Selaras",
      frictionPoint: "Pembagian hak kekayaan intelektual (IP) atas materi modul baru",
      winWinFormula: "Skema co-branding dengan lisensi terbuka untuk asosiasi dan atribusi hak cipta",
    },
    {
      id: "int-3",
      partnerName: "Mitra Penyedia Infrastruktur Cloud & Security",
      category: "Finansial",
      sharedGoal: "Stabilitas Infrastruktur Klien dengan Biaya Efisien",
      ourInterest: "Jaminan SLA 99.99% tanpa membengkakkan beban pengeluaran cloud",
      theirInterest: "Komitmen volume jangka panjang minimal 24 bulan",
      alignmentScore: 78,
      status: "Cukup Selaras",
      frictionPoint: "Klausul penalti downtime yang masih dinegosiasikan legal kedua belah pihak",
      winWinFormula: "Volume tiered pricing dengan klausul fleksibilitas elastisitas server",
    },
    {
      id: "int-4",
      partnerName: "Inkubator Talenta & Universitas Mitra",
      category: "Pengembangan Kapasitas",
      sharedGoal: "Akselerasi Regenerasi Konsultan Muda Berdaya Saing",
      ourInterest: "Pipeline rekrutmen konsultan muda bertalenta tinggi",
      theirInterest: "Tingkat penyerapan kerja lulusan & program magang riil",
      alignmentScore: 85,
      status: "Sangat Selaras",
      frictionPoint: "Jadwal akademik universitas yang sering bentrok dengan timeline audit klien",
      winWinFormula: "Program magang fleksibel berbasis proyek modul jarak jauh",
    },
    {
      id: "int-5",
      partnerName: "Investor Malaikat & Mitra Ventura",
      category: "Strategis & Bisnis",
      sharedGoal: "Pengembangan Produk SaaS Konsultansi",
      ourInterest: "Dukungan pendanaan riset awal & mentoring tata kelola korporat",
      theirInterest: "Hak opsi ekuitas dan dividen dari unit SaaS mandiri",
      alignmentScore: 65,
      status: "Perlu Negosiasi",
      frictionPoint: "Perbedaan proyeksi valuasi pre-money dan hak kendali operasional",
      winWinFormula: "Pemberian convertible note bertahap berdasarkan pencapaian milestone pengguna aktif",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [category, setCategory] = useState<InterestItem["category"]>("Strategis & Bisnis");
  const [sharedGoal, setSharedGoal] = useState("");
  const [ourInterest, setOurInterest] = useState("");
  const [theirInterest, setTheirInterest] = useState("");
  const [alignmentScore, setAlignmentScore] = useState(80);
  const [frictionPoint, setFrictionPoint] = useState("");
  const [winWinFormula, setWinWinFormula] = useState("");

  const handleAddItem = () => {
    if (!partnerName.trim() || !sharedGoal.trim()) return;
    const status: InterestItem["status"] =
      alignmentScore >= 80 ? "Sangat Selaras" : alignmentScore >= 70 ? "Cukup Selaras" : "Perlu Negosiasi";

    const newItem: InterestItem = {
      id: `int-${Date.now()}`,
      partnerName: partnerName.trim(),
      category,
      sharedGoal: sharedGoal.trim(),
      ourInterest: ourInterest.trim() || "Optimalisasi nilai bersama",
      theirInterest: theirInterest.trim() || "Pencapaian target strategis",
      alignmentScore,
      status,
      frictionPoint: frictionPoint.trim() || "Tidak ada friksi signifikan",
      winWinFormula: winWinFormula.trim() || "Kolaborasi sinergis berkelanjutan",
    };

    setItems([newItem, ...items]);
    setPartnerName("");
    setSharedGoal("");
    setOurInterest("");
    setTheirInterest("");
    setFrictionPoint("");
    setWinWinFormula("");
    setShowAddModal(false);
  };

  const categories = ["Semua", "Strategis & Bisnis", "Finansial", "Nilai & Budaya", "Pengembangan Kapasitas"];

  const filteredItems = items.filter((item) => {
    const matchCategory = activeCategory === "Semua" || item.category === activeCategory;
    const matchSearch =
      item.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sharedGoal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.winWinFormula.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const avgAlignment = Math.round(
    items.reduce((acc, curr) => acc + curr.alignmentScore, 0) / items.length
  );

  const getStatusBadge = (status: InterestItem["status"]) => {
    switch (status) {
      case "Sangat Selaras":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Cukup Selaras":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "Perlu Negosiasi":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    }
  };

  const [activeSection, setActiveSection] = useState<string>("metrik");
  const goSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`soc-interest-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useShellSections([
    { id: "metrik", label: "Metrik", active: activeSection === "metrik", onSelect: () => goSection("metrik") },
    { id: "filter", label: "Filter & Cari", active: activeSection === "filter", onSelect: () => goSection("filter") },
    { id: "mitra", label: "Mitra", active: activeSection === "mitra", onSelect: () => goSection("mitra") },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div id="soc-interest-metrik" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Rata-Rata Alignment</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Scale className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{avgAlignment}%</span>
            <span className="text-xs text-muted-foreground">Kecocokan minat</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Mitra Terpetakan</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Target className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{items.length}</span>
            <span className="text-xs text-muted-foreground">Entitas kepentingan</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Sangat Selaras</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Heart className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {items.filter((i) => i.status === "Sangat Selaras").length}
            </span>
            <span className="text-xs text-muted-foreground">Win-win prima</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Perlu Negosiasi</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <AlertCircle className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {items.filter((i) => i.status === "Perlu Negosiasi").length}
            </span>
            <span className="text-xs text-muted-foreground">Fokus kesepakatan</span>
          </div>
        </div>
      </div>

      {/* Categories & Search */}
      <div id="soc-interest-filter" className="scroll-mt-24 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari alignment minat..."
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
            <span>Petakan Interest</span>
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div id="soc-interest-mitra" className="scroll-mt-24 grid grid-cols-1 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-foreground">{item.partnerName}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
                    {item.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-foreground mt-1">
                  🎯 <strong>Tujuan Bersama:</strong> {item.sharedGoal}
                </p>
              </div>

              {/* Alignment Score Meter */}
              <div className="flex items-center gap-2 sm:self-start shrink-0">
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${item.alignmentScore}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-foreground">{item.alignmentScore}%</span>
              </div>
            </div>

            {/* Interest Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg bg-muted/40 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-primary block mb-0.5">Kepentingan Kita:</span>
                <p className="text-muted-foreground">{item.ourInterest}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-foreground block mb-0.5">Kepentingan Mitra:</span>
                <p className="text-muted-foreground">{item.theirInterest}</p>
              </div>
            </div>

            {/* Win-Win & Friction */}
            <div className="flex flex-col sm:flex-row gap-2 pt-1 text-xs">
              <div className="flex-1 bg-emerald-500/5 border border-emerald-500/20 p-2.5 rounded-lg">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-0.5">
                  ✨ Formula Win-Win:
                </span>
                <p className="text-foreground/90">{item.winWinFormula}</p>
              </div>
              <div className="flex-1 bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-lg">
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block mb-0.5">
                  ⚠️ Titik Friksi & Antisipasi:
                </span>
                <p className="text-foreground/90">{item.frictionPoint}</p>
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
              <h3 className="text-sm font-bold text-foreground">Petakan Kepentingan Baru (Interest)</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Tutup
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Nama Mitra / Entitas</label>
                  <input
                    type="text"
                    placeholder="Contoh: PT Mitra Kolaborasi"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="Strategis & Bisnis">Strategis & Bisnis</option>
                    <option value="Finansial">Finansial</option>
                    <option value="Nilai & Budaya">Nilai & Budaya</option>
                    <option value="Pengembangan Kapasitas">Pengembangan Kapasitas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Tujuan Bersama (Shared Goal)</label>
                <input
                  type="text"
                  placeholder="Target atau capaian yang disepakati bersama"
                  value={sharedGoal}
                  onChange={(e) => setSharedGoal(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Kepentingan Kita</label>
                  <textarea
                    rows={2}
                    placeholder="Apa yang kita harapkan/capai..."
                    value={ourInterest}
                    onChange={(e) => setOurInterest(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Kepentingan Mitra</label>
                  <textarea
                    rows={2}
                    placeholder="Apa yang mereka utamakan..."
                    value={theirInterest}
                    onChange={(e) => setTheirInterest(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-muted-foreground font-medium">Skor Keselarasan (Alignment Score)</label>
                  <span className="font-bold text-primary">{alignmentScore}%</span>
                </div>
                <input
                  type="range"
                  min={40}
                  max={100}
                  value={alignmentScore}
                  onChange={(e) => setAlignmentScore(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Formula Win-Win</label>
                <input
                  type="text"
                  placeholder="Bagaimana kedua pihak sama-sama diuntungkan..."
                  value={winWinFormula}
                  onChange={(e) => setWinWinFormula(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Titik Friksi / Antisipasi Masalah</label>
                <input
                  type="text"
                  placeholder="Potensi hambatan atau ketidaksepakatan..."
                  value={frictionPoint}
                  onChange={(e) => setFrictionPoint(e.target.value)}
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
                Simpan Pemetaan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
