import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit3,
  Heart,
  Zap,
  Calendar,
  Sparkles,
  Download,
  Upload,
  X,
  Pin,
  CheckCircle2,
  Lightbulb,
  Smile,
} from "lucide-react";
import { cn } from "../../lib/utils";

export type JournalMood =
  | "Sangat Baik"
  | "Fokus & Produktif"
  | "Tenang & Reflektif"
  | "Biasa Saja"
  | "Lelah & Menantang";

export type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  mood: JournalMood;
  energyLevel: number; // 1 to 5
  content: string;
  gratitude: string[]; // 3 things
  wins: string;
  lessons: string;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

const MOODS: JournalMood[] = [
  "Sangat Baik",
  "Fokus & Produktif",
  "Tenang & Reflektif",
  "Biasa Saja",
  "Lelah & Menantang",
];

const REFLECTION_PROMPTS = [
  "Apa keputusan terpenting yang Anda ambil hari ini dan apa pembelajarannya?",
  "Apa satu hal bermakna yang paling Anda syukuri dalam interaksi kerja hari ini?",
  "Jika hari ini dapat diulang kembali, respons atau keputusan apa yang ingin Anda sempurnakan?",
  "Siapa yang paling memberikan inspirasi atau bantuan berharga bagi Anda hari ini?",
  "Momen apa yang hari ini membuat Anda merasa paling berenergi dan puas?",
  "Kekhawatiran apa yang sebaiknya Anda lepaskan agar pikiran tenang malam ini?",
];

const INITIAL_JOURNAL: JournalEntry[] = [
  {
    id: "journal-1",
    date: "2026-03-05",
    title: "Presentasi Final Restrukturisasi & Kejelasan Arah",
    mood: "Fokus & Produktif",
    energyLevel: 5,
    content:
      "Sesi paparan roadmap restrukturisasi organisasi bersama jajaran direksi berjalan sangat konstruktif. Kejelasan pembagian tanggung jawab divisi operasional disambut positif karena menyelesaikan friksi komunikasi yang telah berlangsung berbulan-bulan.",
    gratitude: [
      "Tim analis yang menyiapkan visual data tepat waktu sebelum pukul 08:00",
      "Klien yang terbuka dan kooperatif menerima kritik konstruktif",
      "Kondisi fisik tetap prima sepanjang 4 jam lokakarya intensif",
    ],
    wins: "Seluruh 5 pilar transformasi disetujui tanpa penolakan mendasar dari komisaris.",
    lessons:
      "Menyajikan ringkasan 1 halaman di awal jauh lebih efektif dibanding langsung masuk ke detail teknis spreadsheet.",
    tags: ["Presentasi", "Leadership", "Klien"],
    isPinned: true,
    createdAt: "2026-03-05T18:30:00.000Z",
    updatedAt: "2026-03-05T18:30:00.000Z",
  },
  {
    id: "journal-2",
    date: "2026-03-04",
    title: "Audit Lapangan Distribusi & Diskusi Kritis",
    mood: "Tenang & Reflektif",
    energyLevel: 4,
    content:
      "Menghabiskan paruh pertama hari meninjau operasional pusat distribusi di Cikarang. Menemukan beberapa titik penumpukan barang yang sebenarnya bersumber dari SOP input sistem yang tidak sinkron, bukan kapasitas gudang.",
    gratitude: [
      "Kepala gudang yang jujur menceritakan kendala nyata di lapangan",
      "Perjalanan tol lancar tanpa hambatan cuaca buruk",
      "Secangkir kopi hangat saat rehat siang yang menenangkan",
    ],
    wins: "Mengidentifikasi akar masalah bottleneck yang selama ini disangka kekurangan armada.",
    lessons:
      "Data di layar seringkali menyembunyikan realitas lapangan; tidak ada yang menggantikan observasi langsung.",
    tags: ["Audit", "Gudang", "Observasi"],
    isPinned: false,
    createdAt: "2026-03-04T19:00:00.000Z",
    updatedAt: "2026-03-04T19:00:00.000Z",
  },
  {
    id: "journal-3",
    date: "2026-03-02",
    title: "Perencanaan Kuartal Baru & Penataan Prioritas",
    mood: "Sangat Baik",
    energyLevel: 5,
    content:
      "Mengawali pekan dengan mengosongkan jadwal rapat sebelum jam makan siang untuk menata dokumen strategi, menyelaraskan target kuartal kedua, dan mendelegasikan tugas-tugas administratif rutin ke sistem otomasi.",
    gratitude: [
      "Waktu tenang tanpa distraksi notifikasi selama 3 jam penuh",
      "Aplikasi Client OS yang semakin rapi dan mempermudah pelacakan",
      "Dukungan keluarga di awal pekan",
    ],
    wins: "Menyelesaikan 100% rencana prioritas Q2 sebelum tenggat waktu.",
    lessons:
      "Waktu fokus mendalam (deep work) harus diblokir di kalender selayaknya rapat dengan klien terpenting.",
    tags: ["DeepWork", "Strategi", "Prioritas"],
    isPinned: false,
    createdAt: "2026-03-02T17:15:00.000Z",
    updatedAt: "2026-03-02T17:15:00.000Z",
  },
];

const STORAGE_KEY = "wira_journal_entries_v2";

export function JournalView() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_JOURNAL;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterMood, setFilterMood] = useState<string>("Semua");
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);

  // Tabs for integrated sub-features: Jurnal Harian, Buku Syukur (Gratitude), Mood & Energi Harian
  const [activeTab, setActiveTab] = useState<"journal" | "gratitude" | "mood">(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab");
      if (p === "gratitude" || p === "mood") return p;
    }
    return "journal";
  });

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // ignore
    }
  }, [entries]);

  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEntries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
    );
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus refleksi jurnal ini?")) {
      setEntries((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSaveEntry = (entryData: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
    const nowIso = new Date().toISOString();
    if (editingEntry) {
      setEntries((prev) =>
        prev.map((item) =>
          item.id === editingEntry.id
            ? { ...item, ...entryData, updatedAt: nowIso }
            : item
        )
      );
    } else {
      const newEntry: JournalEntry = {
        ...entryData,
        id: `journal-${Date.now()}`,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setEntries((prev) => [newEntry, ...prev]);
    }
    setIsModalOpen(false);
    setEditingEntry(null);
  };

  const filteredEntries = useMemo(() => {
    return entries
      .filter((item) => {
        if (onlyPinned && !item.isPinned) return false;
        if (filterMood !== "Semua" && item.mood !== filterMood) return false;
        if (!searchQuery.trim()) return true;

        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.content.toLowerCase().includes(q) ||
          item.wins.toLowerCase().includes(q) ||
          item.lessons.toLowerCase().includes(q) ||
          item.gratitude.some((g) => g.toLowerCase().includes(q)) ||
          item.tags.some((t) => t.toLowerCase().includes(q)) ||
          item.date.includes(q)
        );
      })
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [entries, onlyPinned, filterMood, searchQuery]);

  const exportJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `jurnal_refleksi_${new Date().toISOString().slice(0, 10)}.json`;
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
          setEntries(parsed);
        }
      } catch {
        alert("File JSON tidak valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-4 py-1">
      {/* Integrated Sub-App Tabs Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("journal")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "journal"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <BookOpen size={14} />
          <span>Jurnal Harian</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary-foreground/20 font-mono">
            {entries.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("gratitude")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "gratitude"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Heart size={14} className={activeTab === "gratitude" ? "fill-current" : ""} />
          <span>Buku Syukur (Gratitude)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary-foreground/20 font-mono">
            {entries.reduce((acc, c) => acc + c.gratitude.filter(Boolean).length, 0)}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mood")}
          className={cn(
            "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer",
            activeTab === "mood"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Smile size={14} />
          <span>Mood dan Energi Harian</span>
        </button>
      </div>

      {/* TAB 2: BUKU SYUKUR (GRATITUDE) */}
      {activeTab === "gratitude" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-card via-card to-rose-500/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/15 text-rose-500">
                <Heart size={20} className="fill-current" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">Buku Syukur (Gratitude Journal)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Menyadari dan mencatat hal-hal berharga setiap hari untuk kedamaian batin.
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-foreground">
                {entries.reduce((acc, c) => acc + c.gratitude.filter(Boolean).length, 0)}
              </span>
              <span className="text-[11px] text-muted-foreground block">Hal Disyukuri</span>
            </div>
          </div>

          {/* Dinding Rasa Syukur */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {entries
              .filter((e) => e.gratitude.some(Boolean))
              .map((e) => (
                <div key={e.id} className="p-4 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between text-xs border-b border-border/50 pb-2">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Calendar size={12} className="text-muted-foreground" />
                      {e.date}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 font-medium">
                      {e.mood}
                    </span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-foreground/90">
                    {e.gratitude.filter(Boolean).map((g, gIdx) => (
                      <li key={gIdx} className="flex items-start gap-2">
                        <Heart size={12} className="text-rose-500 shrink-0 mt-0.5 fill-rose-500/40" />
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 3: MOOD DAN ENERGI HARIAN */}
      {activeTab === "mood" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-xs text-muted-foreground">Rata-rata Tingkat Energi</span>
              <p className="text-2xl font-bold text-foreground mt-1 flex items-center gap-2">
                <Zap size={18} className="text-amber-500 fill-amber-500" />
                {(entries.reduce((a, c) => a + c.energyLevel, 0) / (entries.length || 1)).toFixed(1)} / 5
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-xs text-muted-foreground">Mood Dominan</span>
              <p className="text-base font-bold text-primary mt-1 flex items-center gap-2">
                <Smile size={18} />
                {entries[0]?.mood || "Fokus & Produktif"}
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-card">
              <span className="text-xs text-muted-foreground">Hari Tercatat</span>
              <p className="text-2xl font-bold text-foreground mt-1">
                {entries.length} Hari
              </p>
            </div>
          </div>

          {/* Histori Log Mood & Energi */}
          <div className="rounded-xl border border-border bg-card divide-y divide-border/60 overflow-hidden">
            <div className="px-4 py-3 bg-muted/40 font-semibold text-xs text-foreground">
              Histori Harian Mood & Vitalitas
            </div>
            {entries.map((e) => (
              <div key={e.id} className="p-3.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Smile size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{e.mood}</p>
                    <p className="text-[11px] text-muted-foreground">{e.date} • {e.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 font-mono font-bold text-amber-500">
                    <Zap size={13} className="fill-current" />
                    <span>{e.energyLevel}/5</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: JURNAL HARIAN STANDAR */}
      {activeTab === "journal" && (
        <>
          {/* Calm Thoughtful Inspiration Bar */}
          <div className="p-3.5 rounded-xl border border-border bg-card/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Sparkles size={15} className="text-primary shrink-0" />
              <p className="text-foreground truncate font-medium">
                <span className="text-muted-foreground mr-1.5 font-normal">Pertanyaan Refleksi:</span>
                "{REFLECTION_PROMPTS[activePromptIndex]}"
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={() =>
                  setActivePromptIndex((prev) => (prev + 1) % REFLECTION_PROMPTS.length)
                }
                className="text-muted-foreground hover:text-foreground text-[11px] font-medium"
              >
                Ganti Prompt
              </button>
              <span className="text-border">·</span>
              <button
                onClick={() => {
                  setEditingEntry({
                    id: "",
                    date: new Date().toISOString().slice(0, 10),
                    title: REFLECTION_PROMPTS[activePromptIndex],
                    mood: "Fokus & Produktif",
                    energyLevel: 4,
                    content: "",
                    gratitude: ["", "", ""],
                    wins: "",
                    lessons: "",
                    tags: ["Refleksi"],
                    isPinned: false,
                    createdAt: "",
                    updatedAt: "",
                  });
                  setIsModalOpen(true);
                }}
                className="text-primary hover:underline text-[11px] font-semibold"
              >
                Jawab Prompt
              </button>
            </div>
          </div>

      {/* Unified Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pb-2 border-b border-border/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari tanggal, refleksi, atau rasa syukur..."
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
          <button
            onClick={() => setOnlyPinned((prev) => !prev)}
            className={cn(
              "h-8 px-2.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors",
              onlyPinned
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:text-foreground"
            )}
          >
            <Pin size={12} className={onlyPinned ? "fill-current" : ""} />
            <span>Disematkan</span>
          </button>

          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className="h-8 px-2.5 bg-card border border-border rounded-lg text-foreground text-xs font-medium outline-none"
          >
            <option value="Semua">Semua Suasana Hati</option>
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

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
              setEditingEntry(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
          >
            <Plus size={14} />
            <span>Tulis Refleksi</span>
          </button>
        </div>
      </div>

      {/* Journal Entries List */}
      {filteredEntries.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-border rounded-xl bg-card/40">
          <BookOpen className="mx-auto size-8 text-muted-foreground/60 mb-2" />
          <h3 className="text-sm font-semibold text-foreground">Tidak Ada Catatan Jurnal</h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-sm mx-auto">
            Mulai kebiasaan refleksi harian untuk menjernihkan pikiran dan mengevaluasi keputusan Anda.
          </p>
          <button
            onClick={() => {
              setEditingEntry(null);
              setIsModalOpen(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90"
          >
            <Plus size={13} />
            <span>Tulis Hari Ini</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEntries.map((entry) => (
            <article
              key={entry.id}
              className={cn(
                "group p-5 rounded-xl border bg-card hover:border-foreground/20 transition-all space-y-3.5",
                entry.isPinned ? "border-primary/30 bg-primary/[0.01]" : "border-border"
              )}
            >
              {/* Header: Date, Mood, Energy, Actions */}
              <div className="flex items-center justify-between gap-3 pb-2 border-b border-border/50">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <Calendar size={13} className="text-muted-foreground" />
                    <span>{entry.date}</span>
                  </div>

                  <span className="text-xs text-muted-foreground">·</span>

                  <span className="text-[11px] font-medium bg-muted text-muted-foreground px-2 py-0.5 rounded">
                    {entry.mood}
                  </span>

                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Zap size={11} className="text-amber-500" />
                    Energi: {entry.energyLevel}/5
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleTogglePin(entry.id, e)}
                    className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                    title={entry.isPinned ? "Lepas pin" : "Sematkan"}
                  >
                    <Pin size={13} className={entry.isPinned ? "fill-primary text-primary" : ""} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingEntry(entry);
                      setIsModalOpen(true);
                    }}
                    className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={(e) => handleDelete(entry.id, e)}
                    className="p-1 rounded text-muted-foreground hover:text-rose-500 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-foreground tracking-tight">
                {entry.title}
              </h3>

              {/* Narrative Reflection */}
              {entry.content && (
                <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-line">
                  {entry.content}
                </p>
              )}

              {/* Structured Points (Clean Typographic Layout, NO nested cards!) */}
              <div className="pt-2 border-t border-border/40 space-y-2.5 text-xs">
                {/* Gratitude List */}
                {entry.gratitude && entry.gratitude.filter(Boolean).length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                      <Heart size={12} className="text-rose-500" />
                      <span>3 Hal yang Disyukuri:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-foreground pl-1">
                      {entry.gratitude.filter(Boolean).map((g, idx) => (
                        <li key={idx} className="leading-snug">
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Wins & Lessons in Clean Rows */}
                {(entry.wins || entry.lessons) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {entry.wins && (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 size={12} />
                          <span>Pencapaian Hari Ini:</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                          {entry.wins}
                        </p>
                      </div>
                    )}

                    {entry.lessons && (
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                          <Lightbulb size={12} />
                          <span>Pelajaran & Evaluasi:</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                          {entry.lessons}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tags */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="flex items-center gap-1.5 pt-1">
                  {entry.tags.map((t) => (
                    <span key={t} className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      </>
      )}

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <JournalFormModal
          initialData={editingEntry}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEntry(null);
          }}
          onSave={handleSaveEntry}
        />
      )}
    </div>
  );
}

// Modal Form
function JournalFormModal({
  initialData,
  onClose,
  onSave,
}: {
  initialData: JournalEntry | null;
  onClose: () => void;
  onSave: (entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => void;
}) {
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().slice(0, 10)
  );
  const [title, setTitle] = useState(initialData?.title || "");
  const [mood, setMood] = useState<JournalMood>(
    initialData?.mood || "Fokus & Produktif"
  );
  const [energyLevel, setEnergyLevel] = useState<number>(
    initialData?.energyLevel || 4
  );
  const [content, setContent] = useState(initialData?.content || "");
  const [gratitude1, setGratitude1] = useState(initialData?.gratitude?.[0] || "");
  const [gratitude2, setGratitude2] = useState(initialData?.gratitude?.[1] || "");
  const [gratitude3, setGratitude3] = useState(initialData?.gratitude?.[2] || "");
  const [wins, setWins] = useState(initialData?.wins || "");
  const [lessons, setLessons] = useState(initialData?.lessons || "");
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(", ") || "");
  const [isPinned, setIsPinned] = useState(initialData?.isPinned || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Judul refleksi wajib diisi.");
      return;
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter((t) => t.length > 0);

    const gratitude = [gratitude1.trim(), gratitude2.trim(), gratitude3.trim()].filter(
      Boolean
    );

    onSave({
      date,
      title: title.trim(),
      mood,
      energyLevel,
      content: content.trim(),
      gratitude,
      wins: wins.trim(),
      lessons: lessons.trim(),
      tags,
      isPinned,
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
          {initialData?.id ? "Edit Refleksi Jurnal" : "Tulis Jurnal & Refleksi"}
        </h2>
        <p className="text-xs text-muted-foreground mb-4">
          Catat pemikiran, keberhasilan, pembelajaran, dan rasa syukur hari ini.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Suasana Hati</label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as JournalMood)}
                className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              >
                {MOODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Level Energi (1-5)</label>
              <select
                value={energyLevel}
                onChange={(e) => setEnergyLevel(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              >
                <option value={5}>5 - Sangat Bertenaga</option>
                <option value={4}>4 - Baik & Fokus</option>
                <option value={3}>3 - Sedang</option>
                <option value={2}>2 - Agak Lelah</option>
                <option value={1}>1 - Terkuras</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Topik / Judul Refleksi *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Diskusi Strategi Bersama Tim Eksekutif..."
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Isi Catatan & Alur Pikiran</label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ceritakan dinamika hari ini, apa yang menarik, atau keputusan penting..."
              className="w-full px-3 py-2 text-xs bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary/40 focus:border-primary outline-none resize-none leading-relaxed"
            />
          </div>

          {/* 3 Gratitudes */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-medium text-foreground flex items-center gap-1">
              <Heart size={12} className="text-rose-500" />
              <span>3 Hal yang Paling Disyukuri Hari Ini</span>
            </label>
            <input
              type="text"
              value={gratitude1}
              onChange={(e) => setGratitude1(e.target.value)}
              placeholder="1. Contoh: Kesehatan yang prima sepanjang presentasi..."
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
            />
            <input
              type="text"
              value={gratitude2}
              onChange={(e) => setGratitude2(e.target.value)}
              placeholder="2. Contoh: Rekan kerja yang kooperatif dan saling melengkapi..."
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
            />
            <input
              type="text"
              value={gratitude3}
              onChange={(e) => setGratitude3(e.target.value)}
              placeholder="3. Contoh: Selesainya laporan sebelum tenggat waktu..."
              className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Pencapaian Hari Ini (Win)</label>
              <input
                type="text"
                value={wins}
                onChange={(e) => setWins(e.target.value)}
                placeholder="Hasil konkret yang berhasil diraih..."
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Pelajaran (Lesson Learned)</label>
              <input
                type="text"
                value={lessons}
                onChange={(e) => setLessons(e.target.value)}
                placeholder="Hal yang ingin diperbaiki ke depan..."
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Tagar (koma)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Strategi, Klien, Refleksi"
                className="w-full px-3 py-1.5 text-xs bg-background border border-border rounded-lg outline-none"
              />
            </div>

            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="pinJournalCheck"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="rounded text-primary focus:ring-primary"
              />
              <label htmlFor="pinJournalCheck" className="text-xs font-medium text-foreground cursor-pointer">
                Sematkan refleksi ini di atas (Pin)
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
              Simpan Refleksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
