import React, { useState, useEffect, useMemo } from "react";
import {
  Lightbulb,
  Plus,
  Search,
  Star,
  Trash2,
  Edit3,
  Download,
  Upload,
  X,
  Kanban,
  LayoutGrid,
  Grid2X2,
  ChevronUp,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type IdeaStage =
  | "Brainstorming"
  | "Riset & Validasi"
  | "Prototipe / Eksperimen"
  | "Siap Eksekusi"
  | "Selesai / Terwujud"
  | "Arsip";

export type IdeaCategory =
  | "Produk & Layanan"
  | "Strategi Bisnis"
  | "Efisiensi Operasional"
  | "Pemasaran & Konten"
  | "R&D & Teknologi"
  | "Finansial & Investasi";

export type IdeaImpact = "Tinggi" | "Sedang" | "Rendah";
export type IdeaEffort = "Mudah" | "Sedang" | "Kompleks";

export type ChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type IdeaItem = {
  id: string;
  title: string;
  description: string;
  category: IdeaCategory;
  stage: IdeaStage;
  impact: IdeaImpact;
  effort: IdeaEffort;
  votes: number;
  isStarred: boolean;
  tags: string[];
  checklist: ChecklistItem[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const STAGES: IdeaStage[] = [
  "Brainstorming",
  "Riset & Validasi",
  "Prototipe / Eksperimen",
  "Siap Eksekusi",
  "Selesai / Terwujud",
  "Arsip",
];

const CATEGORIES: IdeaCategory[] = [
  "Produk & Layanan",
  "Strategi Bisnis",
  "Efisiensi Operasional",
  "Pemasaran & Konten",
  "R&D & Teknologi",
  "Finansial & Investasi",
];

const INITIAL_IDEAS: IdeaItem[] = [
  {
    id: "idea-1",
    title: "Audit Kesiapan Digital Otomatis untuk Klien Korporasi",
    description:
      "Alat penilaian mandiri berbasis web yang menghasilkan kartu skor instan dan rekomendasi roadmap transformasi digital.",
    category: "Produk & Layanan",
    stage: "Siap Eksekusi",
    impact: "Tinggi",
    effort: "Sedang",
    votes: 24,
    isStarred: true,
    tags: ["Assessment", "Digital", "LeadGen"],
    checklist: [
      { id: "c1", text: "Definisikan 20 parameter audit maturitas", done: true },
      { id: "c2", text: "Desain template laporan PDF otomatis", done: true },
      { id: "c3", text: "Pilot project dengan 3 klien eksisting", done: false },
    ],
    notes: "Potensi menghasilkan 5-10 proposal engagement konsultansi baru per kuartal.",
    createdAt: "2026-02-20",
    updatedAt: "2026-03-02",
  },
  {
    id: "idea-2",
    title: "Template Notion & Dashboard Eksekutif Kustom",
    description:
      "Paket template operasi manajemen siap pakai untuk CEO & founder UKM yang mencari sistem pelaporan terstruktur.",
    category: "Strategi Bisnis",
    stage: "Prototipe / Eksperimen",
    impact: "Sedang",
    effort: "Mudah",
    votes: 18,
    isStarred: true,
    tags: ["Notion", "SME", "Revenue"],
    checklist: [
      { id: "c4", text: "Strukturkan modul keuangan dan KPI", done: true },
      { id: "c5", text: "Video panduan setup 10 menit", done: false },
    ],
    notes: "Dapat dijual sebagai produk digital atau disertakan dalam retainer onboarding.",
    createdAt: "2026-02-25",
    updatedAt: "2026-03-01",
  },
  {
    id: "idea-3",
    title: "Sistem Otomasi Ekstraksi Notulen Rapat Klien ke Trello",
    description:
      "Integrasi webhook yang secara otomatis mendeteksi butir aksi (action items) dari catatan rapat dan memasukkannya ke papan kerja.",
    category: "Efisiensi Operasional",
    stage: "Riset & Validasi",
    impact: "Tinggi",
    effort: "Sedang",
    votes: 15,
    isStarred: false,
    tags: ["Automation", "Productivity"],
    checklist: [
      { id: "c6", text: "Riset regex atau parser teks terstruktur", done: true },
      { id: "c7", text: "Uji coba format webhook Trello & Notion", done: false },
    ],
    createdAt: "2026-02-28",
    updatedAt: "2026-02-28",
  },
  {
    id: "idea-4",
    title: "Seri Masterclass: Restrukturisasi Finansial Krisis",
    description:
      "Program workshop intensif 2 hari untuk CFO dan pemilik bisnis mengenai strategi arus kas dan efisiensi biaya.",
    category: "Pemasaran & Konten",
    stage: "Brainstorming",
    impact: "Sedang",
    effort: "Kompleks",
    votes: 9,
    isStarred: false,
    tags: ["Workshop", "Finance", "Branding"],
    checklist: [{ id: "c8", text: "Survei kebutuhan topik ke 20 prospek", done: false }],
    createdAt: "2026-03-01",
    updatedAt: "2026-03-01",
  },
  {
    id: "idea-5",
    title: "Basis Pengetahuan Solusi Industri Manufaktur",
    description:
      "Kompilasi studi kasus, benchmark biaya, dan panduan audit keselamatan kerja khusus sektor perakitan dan logistik.",
    category: "R&D & Teknologi",
    stage: "Selesai / Terwujud",
    impact: "Tinggi",
    effort: "Sedang",
    votes: 31,
    isStarred: true,
    tags: ["Manufacture", "CaseStudy"],
    checklist: [
      { id: "c9", text: "Kumpulkan 10 studi kasus historis", done: true },
      { id: "c10", text: "Validasi kalkulasi ROI", done: true },
    ],
    createdAt: "2026-01-15",
    updatedAt: "2026-02-18",
  },
];

const STORAGE_KEY = "wira_ideas_lab_v2";

export function IdeasView() {
  const [ideas, setIdeas] = useState<IdeaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_IDEAS;
  });

  const [viewMode, setViewMode] = useState<"grid" | "kanban" | "matrix">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("Semua");
  const [filterStage, setFilterStage] = useState<string>("Semua");
  const [onlyStarred, setOnlyStarred] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<IdeaItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    } catch {
      // ignore
    }
  }, [ideas]);

  const handleVote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
    );
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIdeas((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item))
    );
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus ide ini dari bank inovasi?")) {
      setIdeas((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSaveIdea = (ideaData: Omit<IdeaItem, "id" | "createdAt" | "updatedAt">) => {
    const today = new Date().toISOString().slice(0, 10);
    if (editingIdea) {
      setIdeas((prev) =>
        prev.map((item) =>
          item.id === editingIdea.id
            ? { ...item, ...ideaData, updatedAt: today }
            : item
        )
      );
    } else {
      const newIdea: IdeaItem = {
        ...ideaData,
        id: `idea-${Date.now()}`,
        createdAt: today,
        updatedAt: today,
      };
      setIdeas((prev) => [newIdea, ...prev]);
    }
    setIsModalOpen(false);
    setEditingIdea(null);
  };

  const filteredIdeas = useMemo(() => {
    return ideas.filter((item) => {
      if (onlyStarred && !item.isStarred) return false;
      if (filterCategory !== "Semua" && item.category !== filterCategory) return false;
      if (filterStage !== "Semua" && item.stage !== filterStage) return false;
      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q)) ||
        item.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [ideas, onlyStarred, filterCategory, filterStage, searchQuery]);

  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ideas, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `bank_ide_inovasi_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed)) {
          setIdeas(parsed);
        }
      } catch {
        alert("File JSON tidak valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto w-full space-y-4 py-1">
      {/* Clean Unified Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-border/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ide, topik inovasi, atau #tagar..."
            className="w-full h-9 pl-9 pr-8 text-xs bg-card border border-border rounded-lg outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* View Switcher */}
          <div className="flex items-center bg-card border border-border p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-2.5 py-1 rounded flex items-center gap-1 transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid size={13} />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("kanban")}
              className={cn(
                "px-2.5 py-1 rounded flex items-center gap-1 transition-colors",
                viewMode === "kanban"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Kanban size={13} />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("matrix")}
              className={cn(
                "px-2.5 py-1 rounded flex items-center gap-1 transition-colors",
                viewMode === "matrix"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid2X2 size={13} />
              <span>Matriks</span>
            </button>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors">
            <Upload size={13} />
            <span>Impor</span>
            <input type="file" accept=".json" onChange={importJSON} className="hidden" />
          </label>

          <button
            onClick={exportJSON}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-colors"
          >
            <Download size={13} />
            <span>Ekspor</span>
          </button>

          <button
            onClick={() => {
              setEditingIdea(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>Ide Baru</span>
          </button>
        </div>
      </div>

      {/* Filter Row: Category & Stage */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {["Semua", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors border",
                filterCategory === cat
                  ? "border-primary/40 bg-primary/10 text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {cat}
              {cat === "Semua" && ` (${ideas.length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setOnlyStarred((prev) => !prev)}
            className={cn(
              "h-7 px-2.5 rounded border flex items-center gap-1 transition-colors",
              onlyStarred
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <Star size={12} className={onlyStarred ? "fill-current" : ""} />
            <span>Favorit</span>
          </button>

          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="h-7 px-2 bg-card border border-border rounded text-foreground text-xs outline-none"
          >
            <option value="Semua">Semua Tahapan</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW: GRID */}
      {viewMode === "grid" && (
        <>
          {filteredIdeas.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-border rounded-xl bg-card/40">
              <Lightbulb className="mx-auto size-8 text-muted-foreground/60 mb-2" />
              <h3 className="text-sm font-semibold text-foreground">Tidak Ada Ide Ditemukan</h3>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
                Coba sesuaikan filter kategori atau kata kunci pencarian Anda.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredIdeas.map((idea) => {
                const doneChecklist = idea.checklist.filter((c) => c.done).length;
                return (
                  <div
                    key={idea.id}
                    onClick={() => {
                      setEditingIdea(idea);
                      setIsModalOpen(true);
                    }}
                    className="group relative flex flex-col justify-between p-4 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-xs transition-all cursor-pointer"
                  >
                    <div>
                      {/* Top Bar: Stage, Star, Vote */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {idea.stage}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleToggleStar(idea.id, e)}
                            className="p-1 text-muted-foreground hover:text-amber-500 transition-colors"
                            title="Tandai favorit"
                          >
                            <Star
                              size={13}
                              className={
                                idea.isStarred
                                  ? "fill-amber-400 text-amber-400"
                                  : ""
                              }
                            />
                          </button>
                          <button
                            onClick={(e) => handleVote(idea.id, e)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-muted/40 hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
                            title="Beri dukungan ide"
                          >
                            <ChevronUp size={12} className="text-primary" />
                            <span>{idea.votes}</span>
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {idea.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mt-1.5">
                        {idea.description}
                      </p>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-3.5 pt-2.5 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-muted px-1.5 py-0.5 rounded text-[10px]">
                          Dampak: {idea.impact}
                        </span>
                        {idea.checklist.length > 0 && (
                          <span className="text-[10px] text-muted-foreground">
                            ✓ {doneChecklist}/{idea.checklist.length}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingIdea(idea);
                            setIsModalOpen(true);
                          }}
                          className="p-1 rounded text-muted-foreground hover:text-primary"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={(e) => handleDelete(idea.id, e)}
                          className="p-1 rounded text-muted-foreground hover:text-rose-500"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* VIEW: KANBAN */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-x-auto pb-4">
          {STAGES.filter((s) => s !== "Arsip").map((stage) => {
            const stageIdeas = filteredIdeas.filter((i) => i.stage === stage);
            return (
              <div
                key={stage}
                className="bg-card border border-border rounded-xl p-3 flex flex-col min-w-[240px]"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-border/60">
                  <span className="text-xs font-semibold text-foreground">{stage}</span>
                  <span className="text-[10px] font-medium bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    {stageIdeas.length}
                  </span>
                </div>

                <div className="space-y-2 flex-1 min-h-[160px]">
                  {stageIdeas.map((idea) => (
                    <div
                      key={idea.id}
                      onClick={() => {
                        setEditingIdea(idea);
                        setIsModalOpen(true);
                      }}
                      className="p-3 rounded-lg border border-border bg-background hover:border-foreground/20 hover:shadow-xs transition-all cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{idea.category}</span>
                        <span className="font-semibold text-foreground">▲ {idea.votes}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-foreground line-clamp-2">
                        {idea.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>{idea.impact} Impact</span>
                        <span>{idea.effort} Effort</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: MATRIX 2x2 */}
      {viewMode === "matrix" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {/* Quadrant 1: Quick Wins (Tinggi / Mudah) */}
          <div className="border border-border rounded-xl bg-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div>
                <h4 className="text-xs font-bold text-foreground">1. Quick Wins (Prioritas Cepat)</h4>
                <p className="text-[10px] text-muted-foreground">Dampak Tinggi · Upaya Mudah</p>
              </div>
              <span className="text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded">
                Segera Eksekusi
              </span>
            </div>
            <div className="space-y-2">
              {filteredIdeas
                .filter((i) => i.impact === "Tinggi" && i.effort === "Mudah")
                .map((i) => (
                  <div
                    key={i.id}
                    onClick={() => {
                      setEditingIdea(i);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 rounded-lg border border-border bg-background hover:border-foreground/20 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground truncate pr-2">{i.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">▲ {i.votes}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Quadrant 2: Strategic Initiatives (Tinggi / Sedang-Kompleks) */}
          <div className="border border-border rounded-xl bg-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div>
                <h4 className="text-xs font-bold text-foreground">2. Inisiatif Strategis Utama</h4>
                <p className="text-[10px] text-muted-foreground">Dampak Tinggi · Upaya Sedang/Kompleks</p>
              </div>
              <span className="text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                Rencanakan Matang
              </span>
            </div>
            <div className="space-y-2">
              {filteredIdeas
                .filter((i) => i.impact === "Tinggi" && i.effort !== "Mudah")
                .map((i) => (
                  <div
                    key={i.id}
                    onClick={() => {
                      setEditingIdea(i);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 rounded-lg border border-border bg-background hover:border-foreground/20 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground truncate pr-2">{i.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">▲ {i.votes}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Quadrant 3: Fill-ins (Sedang-Rendah / Mudah) */}
          <div className="border border-border rounded-xl bg-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div>
                <h4 className="text-xs font-bold text-foreground">3. Tugas Pengisi Waktu</h4>
                <p className="text-[10px] text-muted-foreground">Dampak Sedang/Rendah · Upaya Mudah</p>
              </div>
              <span className="text-xs font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded">
                Dikerjakan Fleksibel
              </span>
            </div>
            <div className="space-y-2">
              {filteredIdeas
                .filter((i) => i.impact !== "Tinggi" && i.effort === "Mudah")
                .map((i) => (
                  <div
                    key={i.id}
                    onClick={() => {
                      setEditingIdea(i);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 rounded-lg border border-border bg-background hover:border-foreground/20 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground truncate pr-2">{i.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">▲ {i.votes}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Quadrant 4: Re-evaluate (Rendah / Kompleks) */}
          <div className="border border-border rounded-xl bg-card p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-border/60">
              <div>
                <h4 className="text-xs font-bold text-foreground">4. Evaluasi Kembali / Deprioritas</h4>
                <p className="text-[10px] text-muted-foreground">Dampak Sedang/Rendah · Upaya Kompleks</p>
              </div>
              <span className="text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded">
                Tunda / Tinjau
              </span>
            </div>
            <div className="space-y-2">
              {filteredIdeas
                .filter((i) => i.impact !== "Tinggi" && i.effort !== "Mudah")
                .map((i) => (
                  <div
                    key={i.id}
                    onClick={() => {
                      setEditingIdea(i);
                      setIsModalOpen(true);
                    }}
                    className="p-2.5 rounded-lg border border-border bg-background hover:border-foreground/20 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground truncate pr-2">{i.title}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">▲ {i.votes}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <IdeaFormModal
          initialData={editingIdea}
          onClose={() => {
            setIsModalOpen(false);
            setEditingIdea(null);
          }}
          onSave={handleSaveIdea}
        />
      )}
    </div>
  );
}

// Modal Component
function IdeaFormModal({
  initialData,
  onClose,
  onSave,
}: {
  initialData: IdeaItem | null;
  onClose: () => void;
  onSave: (idea: Omit<IdeaItem, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [category, setCategory] = useState<IdeaCategory>(
    initialData?.category || "Produk & Layanan"
  );
  const [stage, setStage] = useState<IdeaStage>(initialData?.stage || "Brainstorming");
  const [impact, setImpact] = useState<IdeaImpact>(initialData?.impact || "Tinggi");
  const [effort, setEffort] = useState<IdeaEffort>(initialData?.effort || "Sedang");
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(", ") || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [isStarred, setIsStarred] = useState(initialData?.isStarred || false);
  const [votes, setVotes] = useState(initialData?.votes || 1);

  // Checklist
  const [checklist, setChecklist] = useState<ChecklistItem[]>(
    initialData?.checklist || []
  );
  const [newChecklistText, setNewChecklistText] = useState("");

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    setChecklist((prev) => [
      ...prev,
      { id: `check-${Date.now()}`, text: newChecklistText.trim(), done: false },
    ]);
    setNewChecklistText("");
  };

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, done: !c.done } : c))
    );
  };

  const removeCheck = (id: string) => {
    setChecklist((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Judul ide wajib diisi.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      stage,
      impact,
      effort,
      votes,
      isStarred,
      tags,
      checklist,
      notes: notes.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-5 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X size={16} />
        </button>

        <h2 className="text-base font-bold text-foreground mb-0.5">
          {initialData ? "Edit Gagasan Inovasi" : "Daftarkan Ide Baru"}
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Definisikan gagasan bisnis, estimasi tingkat dampak serta tahapan validasinya.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Judul Gagasan *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Modul Audit Diagnostik Mandiri..."
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IdeaCategory)}
                className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Tahapan Pipeline</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as IdeaStage)}
                className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Estimasi Dampak (Impact)</label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as IdeaImpact)}
                className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              >
                <option value="Tinggi">Tinggi (High Impact)</option>
                <option value="Sedang">Sedang (Moderate)</option>
                <option value="Rendah">Rendah (Low Impact)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Tingkat Upaya (Effort)</label>
              <select
                value={effort}
                onChange={(e) => setEffort(e.target.value as IdeaEffort)}
                className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              >
                <option value="Mudah">Mudah (Low Effort / Quick)</option>
                <option value="Sedang">Sedang (Moderate)</option>
                <option value="Kompleks">Kompleks (High Effort)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Deskripsi Singkat</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan masalah apa yang diselesaikan dan solusi yang diajukan..."
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Checklist Milestones */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">Milestone & Validasi</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddChecklist();
                  }
                }}
                placeholder="Tambahkan butir aksi validasi..."
                className="flex-1 px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-3 py-1.5 text-xs font-semibold bg-muted hover:bg-muted/80 rounded-lg text-foreground transition-colors"
              >
                Tambah
              </button>
            </div>

            {checklist.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto pt-1">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded bg-muted/40 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleCheck(item.id)}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className={item.done ? "line-through text-muted-foreground" : "text-foreground"}>
                        {item.text}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCheck(item.id)}
                      className="text-muted-foreground hover:text-rose-500"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Tagar (koma)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Digital, Produk, Revenue"
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="starCheck"
                checked={isStarred}
                onChange={(e) => setIsStarred(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="starCheck" className="text-xs font-medium text-foreground cursor-pointer">
                Tandai sebagai Inisiatif Favorit
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 text-foreground transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-colors shadow-xs"
            >
              Simpan Ide
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
