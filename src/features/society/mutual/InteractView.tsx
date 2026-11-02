import { useState } from "react";
import {
  MessagesSquare,
  Users,
  Clock,
  CheckCircle2,
  Plus,
  Search,
  ArrowUpDown,
  Sparkles,
  PhoneCall,
  Video,
  Mail,
  Calendar,
} from "lucide-react";
import { useShellSections } from "@/app/shell-sections";

interface InteractionItem {
  id: string;
  stakeholder: string;
  category: "Klien & Mitra" | "Internal Tim" | "Kerabat & Komunitas" | "Strategis";
  channel: "Tatap Muka" | "Video Call" | "Telepon" | "Pesan/Email";
  reciprocity: "Seimbang (Mutual)" | "Proaktif" | "Menunggu Respon";
  sentiment: "Positif" | "Konstruktif" | "Perlu Perhatian";
  lastDate: string;
  topic: string;
  nextStep: string;
}

export function InteractView() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<InteractionItem[]>([
    {
      id: "int-1",
      stakeholder: "PT Citra Nusantara (Klien Utama)",
      category: "Klien & Mitra",
      channel: "Tatap Muka",
      reciprocity: "Seimbang (Mutual)",
      sentiment: "Positif",
      lastDate: "18 Sep 2026",
      topic: "Sinkronisasi Milestone Kuartal IV & Penyesuaian Ruang Lingkup",
      nextStep: "Kirim ringkasan addendum kontrak sebelum 22 Sep 2026",
    },
    {
      id: "int-2",
      stakeholder: "Tim Konsultan Lead & Rekan Asosiasi",
      category: "Internal Tim",
      channel: "Video Call",
      reciprocity: "Seimbang (Mutual)",
      sentiment: "Positif",
      lastDate: "17 Sep 2026",
      topic: "Refleksi mingguan sprint deliverable & pembagian beban kerja",
      nextStep: "Review draf framework evaluasi bersama",
    },
    {
      id: "int-3",
      stakeholder: "Dewan Penasihat & Mentor Industri",
      category: "Strategis",
      channel: "Video Call",
      reciprocity: "Proaktif",
      sentiment: "Konstruktif",
      lastDate: "14 Sep 2026",
      topic: "Eksplorasi positioning ekspansi pasar regional & kemitraan baru",
      nextStep: "Jadwalkan sesi follow-up studi komparasi",
    },
    {
      id: "int-4",
      stakeholder: "Komunitas Alumni & Jaringan Kerabat",
      category: "Kerabat & Komunitas",
      channel: "Pesan/Email",
      reciprocity: "Menunggu Respon",
      sentiment: "Perlu Perhatian",
      lastDate: "10 Sep 2026",
      topic: "Koordinasi inisiatif sosial tahunan & pembentukan panitia bersama",
      nextStep: "Follow up konfirmasi ketersediaan ketua panitia",
    },
    {
      id: "int-5",
      stakeholder: "Vendor Analisis Data & Teknologi",
      category: "Klien & Mitra",
      channel: "Telepon",
      reciprocity: "Seimbang (Mutual)",
      sentiment: "Positif",
      lastDate: "08 Sep 2026",
      topic: "Pembaruan integrasi API analitik & kepatuhan SLA data",
      nextStep: "Uji coba integrasi pipeline otomatis minggu depan",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newStakeholder, setNewStakeholder] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newCategory, setNewCategory] = useState<InteractionItem["category"]>("Klien & Mitra");
  const [newChannel, setNewChannel] = useState<InteractionItem["channel"]>("Tatap Muka");
  const [newReciprocity, setNewReciprocity] = useState<InteractionItem["reciprocity"]>("Seimbang (Mutual)");
  const [newSentiment, setNewSentiment] = useState<InteractionItem["sentiment"]>("Positif");
  const [newNextStep, setNewNextStep] = useState("");

  const handleAddItem = () => {
    if (!newStakeholder.trim() || !newTopic.trim()) return;
    const newItem: InteractionItem = {
      id: `int-${Date.now()}`,
      stakeholder: newStakeholder.trim(),
      category: newCategory,
      channel: newChannel,
      reciprocity: newReciprocity,
      sentiment: newSentiment,
      lastDate: "Hari ini",
      topic: newTopic.trim(),
      nextStep: newNextStep.trim() || "Belum ditentukan",
    };
    setItems([newItem, ...items]);
    setNewStakeholder("");
    setNewTopic("");
    setNewNextStep("");
    setShowAddModal(false);
  };

  const categories = ["Semua", "Klien & Mitra", "Internal Tim", "Strategis", "Kerabat & Komunitas"];

  const filteredItems = items.filter((item) => {
    const matchCategory = activeCategory === "Semua" || item.category === activeCategory;
    const matchSearch =
      item.stakeholder.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nextStep.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getChannelIcon = (channel: InteractionItem["channel"]) => {
    switch (channel) {
      case "Tatap Muka":
        return <Users className="size-3.5" />;
      case "Video Call":
        return <Video className="size-3.5" />;
      case "Telepon":
        return <PhoneCall className="size-3.5" />;
      case "Pesan/Email":
        return <Mail className="size-3.5" />;
    }
  };

  const getReciprocityBadge = (rec: InteractionItem["reciprocity"]) => {
    switch (rec) {
      case "Seimbang (Mutual)":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="size-3" />
            {rec}
          </span>
        );
      case "Proaktif":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <ArrowUpDown className="size-3" />
            {rec}
          </span>
        );
      case "Menunggu Respon":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="size-3" />
            {rec}
          </span>
        );
    }
  };

  const getSentimentBadge = (sent: InteractionItem["sentiment"]) => {
    switch (sent) {
      case "Positif":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "Konstruktif":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20";
      case "Perlu Perhatian":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
    }
  };

  const mutualCount = items.filter((i) => i.reciprocity === "Seimbang (Mutual)").length;
  const pendingCount = items.filter((i) => i.reciprocity === "Menunggu Respon").length;

  const [activeSection, setActiveSection] = useState<string>("metrik");
  const goSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`soc-int-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  useShellSections([
    { id: "metrik", label: "Metrik", active: activeSection === "metrik", onSelect: () => goSection("metrik") },
    { id: "filter", label: "Filter & Cari", active: activeSection === "filter", onSelect: () => goSection("filter") },
    { id: "daftar", label: "Interaksi", active: activeSection === "daftar", onSelect: () => goSection("daftar") },
  ]);

  return (
    <div className="space-y-6">
      {/* Header Metric Cards */}
      <div id="soc-int-metrik" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Relasi Interaksi</span>
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <MessagesSquare className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">{items.length}</span>
            <span className="text-xs text-muted-foreground">Stakeholder aktif</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Resiprositas Seimbang</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round((mutualCount / items.length) * 100)}%
            </span>
            <span className="text-xs text-muted-foreground">({mutualCount} dari {items.length} entitas)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Menunggu Tindak Lanjut</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingCount}</span>
            <span className="text-xs text-muted-foreground">Butuh tanggapan</span>
          </div>
        </div>

        <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Kualitas Komunikasi</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="size-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">Harmonis</span>
            <span className="text-xs text-muted-foreground">Resonansi tinggi</span>
          </div>
        </div>
      </div>

      {/* Control Bar: Categories, Search, and Add Action */}
      <div id="soc-int-filter" className="scroll-mt-24 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
              placeholder="Cari interaksi..."
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
            <span>Catat Interaksi</span>
          </button>
        </div>
      </div>

      {/* Interactions List Table/Card view */}
      <div id="soc-int-daftar" className="scroll-mt-24 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="divide-y divide-border">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              Tidak ada catatan interaksi yang cocok dengan filter atau pencarian.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{item.stakeholder}</h3>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground border border-border/50">
                        {item.category}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border ${getSentimentBadge(item.sentiment)}`}>
                        {item.sentiment}
                      </span>
                    </div>

                    <p className="text-xs text-foreground font-medium">{item.topic}</p>

                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap pt-0.5">
                      <span className="flex items-center gap-1">
                        {getChannelIcon(item.channel)}
                        {item.channel}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {item.lastDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-1.5 shrink-0">
                    <div>{getReciprocityBadge(item.reciprocity)}</div>
                    <div className="text-[11px] text-muted-foreground md:text-right max-w-xs">
                      <strong className="text-foreground">Langkah Berikut:</strong> {item.nextStep}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-foreground">Catat Interaksi Baru</h3>
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
                <label className="block text-muted-foreground mb-1 font-medium">Nama Stakeholder / Relasi</label>
                <input
                  type="text"
                  placeholder="Contoh: PT Mitra Mandiri"
                  value={newStakeholder}
                  onChange={(e) => setNewStakeholder(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="Klien & Mitra">Klien & Mitra</option>
                    <option value="Internal Tim">Internal Tim</option>
                    <option value="Strategis">Strategis</option>
                    <option value="Kerabat & Komunitas">Kerabat & Komunitas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Saluran Komunikasi</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="Tatap Muka">Tatap Muka</option>
                    <option value="Video Call">Video Call</option>
                    <option value="Telepon">Telepon</option>
                    <option value="Pesan/Email">Pesan/Email</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Tingkat Resiprositas</label>
                  <select
                    value={newReciprocity}
                    onChange={(e) => setNewReciprocity(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="Seimbang (Mutual)">Seimbang (Mutual)</option>
                    <option value="Proaktif">Proaktif</option>
                    <option value="Menunggu Respon">Menunggu Respon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Kesan & Sentimen</label>
                  <select
                    value={newSentiment}
                    onChange={(e) => setNewSentiment(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                  >
                    <option value="Positif">Positif</option>
                    <option value="Konstruktif">Konstruktif</option>
                    <option value="Perlu Perhatian">Perlu Perhatian</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Topik Utama Interaksi</label>
                <textarea
                  rows={2}
                  placeholder="Inti pembahasan dan kesepakatan"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Tindak Lanjut / Action Item</label>
                <input
                  type="text"
                  placeholder="Langkah berikutnya..."
                  value={newNextStep}
                  onChange={(e) => setNewNextStep(e.target.value)}
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
                Simpan Interaksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
