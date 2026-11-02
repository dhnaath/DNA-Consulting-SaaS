import React, { useState, useEffect, useMemo } from "react";
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Target,
  BarChart3,
  Users,
  ShieldAlert,
  Flame,
  Star,
  Layers,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface GameItem {
  id: string;
  title: string;
  category: "Simulasi Bisnis" | "Logistik & Optimasi" | "Geopolitik & Diplomasi" | "Taktik & Catur" | "Ekonomi Pasar";
  platform: "PC / Steam" | "Board Game" | "Mobile" | "Console";
  status: "Sedang Dimainkan" | "Selesai" | "Backlog";
  rating: number; // 1 - 10
  hoursPlayed: number;
  coverUrl: string;
  strategicTakeaway: string;
}

const INITIAL_GAMES: GameItem[] = [
  {
    id: "game-1",
    title: "Capitalism Lab",
    category: "Simulasi Bisnis",
    platform: "PC / Steam",
    status: "Sedang Dimainkan",
    rating: 9.6,
    hoursPlayed: 84,
    coverUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    strategicTakeaway: "Simulasi paling presisi untuk alokasi modal korporat, perang harga margin kotor, penetapan royalti paten R&D, dan M&A hostile takeover.",
  },
  {
    id: "game-2",
    title: "Factorio",
    category: "Logistik & Optimasi",
    platform: "PC / Steam",
    status: "Selesai",
    rating: 9.8,
    hoursPlayed: 142,
    coverUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
    strategicTakeaway: "Penerapan murni Theory of Constraints (Goldratt) — setiap kali satu bottleneck rantai konveyor diselesaikan, bottleneck baru selalu muncul di downstream.",
  },
  {
    id: "game-3",
    title: "Civilization VI",
    category: "Geopolitik & Diplomasi",
    platform: "PC / Steam",
    status: "Sedang Dimainkan",
    rating: 9.3,
    hoursPlayed: 110,
    coverUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
    strategicTakeaway: "Manajemen aliansi multilateral, investasi infrastruktur era industrial, dan perimbangan soft power kebudayaan vs hard power pertahanan.",
  },
  {
    id: "game-4",
    title: "Catur Klasik (Chess)",
    category: "Taktik & Catur",
    platform: "Board Game",
    status: "Sedang Dimainkan",
    rating: 10.0,
    hoursPlayed: 320,
    coverUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?auto=format&fit=crop&w=600&q=80",
    strategicTakeaway: "Penguasaan petak tengah (center control), kalkulasi tempo pertukaran bidak, dan seni mengorbankan keuntungan taktis demi posisi strategis dominan.",
  },
  {
    id: "game-5",
    title: "Cities: Skylines",
    category: "Simulasi Bisnis",
    platform: "PC / Steam",
    status: "Selesai",
    rating: 9.1,
    hoursPlayed: 65,
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    strategicTakeaway: "Alokasi anggaran modal publik, dampak kemacetan logistik terhadap penerimaan pajak komersial, dan perencanaan zonasi utilitas publik.",
  },
  {
    id: "game-6",
    title: "Offworld Trading Company",
    category: "Ekonomi Pasar",
    platform: "PC / Steam",
    status: "Backlog",
    rating: 8.7,
    hoursPlayed: 18,
    coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80",
    strategicTakeaway: "Perang komoditas dinamis: manipulasi penawaran/permintaan sumber daya alam dan taktik cornering pasar untuk memicu kebangkrutan pesaing.",
  },
];

// Interactive Decision Simulator Scenarios
interface Scenario {
  id: number;
  title: string;
  description: string;
  options: {
    label: string;
    actionDescription: string;
    impact: { cash: number; marketShare: number; morale: number; risk: number };
  }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Dilema Disrupsi Automasi & Efisiensi Operasional",
    description:
      "Kompetitor meluncurkan platform analitik otomatis yang memangkas waktu delivery proyek sebesar 40%. Dewan direksi mendesak tindakan cepat.",
    options: [
      {
        label: "Investasi Mandiri & Kembangkan Platform Proprietary",
        actionDescription: "Alokasikan belanja modal R&D besar, rekrut insinyur data senior.",
        impact: { cash: -2.5, marketShare: +8, morale: +5, risk: +10 },
      },
      {
        label: "Kemitraan Lisensi dengan Vendor Global",
        actionDescription: "Integrasikan teknologi pihak ketiga dengan biaya berlangganan rutin.",
        impact: { cash: -1.0, marketShare: +4, morale: 0, risk: -5 },
      },
      {
        label: "Fokus pada Nilai Konsultansi Human-in-the-Loop",
        actionDescription: "Posisikan agensi sebagai penasihat strategis premium tak tergantikan.",
        impact: { cash: -0.2, marketShare: -2, morale: +10, risk: +5 },
      },
    ],
  },
  {
    id: 2,
    title: "Peluang M&A Butik Konsultan Regional",
    description:
      "Firma penasihat keuangan butik di Surabaya dengan 18 klien tier-1 menawarkan akuisisi aset dan portofolio seharga Rp 3.5 Miliar.",
    options: [
      {
        label: "Eksekusi Akuisisi Penuh (Full Buyout)",
        actionDescription: "Kuasai 100% saham dan integrasikan seluruh klien dan talenta.",
        impact: { cash: -3.5, marketShare: +12, morale: -5, risk: +15 },
      },
      {
        label: "Bentuk Usaha Patungan (Joint Venture 50:50)",
        actionDescription: "Bagi risiko permodalan dan bagi hasil secara proporsional.",
        impact: { cash: -1.5, marketShare: +6, morale: +2, risk: 0 },
      },
      {
        label: "Tolak Tawaran & Fokus Pertumbuhan Organik",
        actionDescription: "Pertahankan kas likuid untuk menghadapi potensi volatilitas pasar.",
        impact: { cash: 0, marketShare: 0, morale: +3, risk: -10 },
      },
    ],
  },
  {
    id: 3,
    title: "Perang Retensi Talenta Senior Partner",
    description:
      "Dua Partner kunci menerima tawaran kompensasi ganda dari firma multinasional. Kehilangan mereka dapat mengancam perpanjangan kontrak senilai Rp 5 Miliar.",
    options: [
      {
        label: "Tandingi Penawaran + Skema Equity Partnership",
        actionDescription: "Beri kenaikan paket remunerasi dan opsi kepemilikan saham kemitraan.",
        impact: { cash: -1.2, marketShare: +2, morale: +15, risk: -5 },
      },
      {
        label: "Promosikan Talenta Muda & Restrukturisasi Tim",
        actionDescription: "Lepaskan partner lama dan beri panggung pada manajer berprestasi.",
        impact: { cash: +0.5, marketShare: -3, morale: +8, risk: +12 },
      },
    ],
  },
  {
    id: 4,
    title: "Audit Kepatuhan & Standar ESG Korporasi",
    description:
      "Regulator industri merilis mandat kepatuhan keberlanjutan baru. Klien utama meminta audit jejak karbon dan tata kelola etis menyeluruh.",
    options: [
      {
        label: "Sertifikasi Green Advisory Tingkat Emas",
        actionDescription: "Kaji ulang seluruh operasional dan investasikan fasilitas net-zero.",
        impact: { cash: -1.5, marketShare: +10, morale: +10, risk: -15 },
      },
      {
        label: "Kepatuhan Minimum Sesuai Regulasi Wajib",
        actionDescription: "Penuhi prasyarat hukum tanpa pengeluaran tambahan.",
        impact: { cash: -0.3, marketShare: 0, morale: -5, risk: +10 },
      },
    ],
  },
];

export function GamesView() {
  const [games, setGames] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem("aio_games_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_GAMES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [showAddModal, setShowAddModal] = useState(false);

  // Active Tab: Library or Simulator
  const [activeTab, setActiveTab] = useState<"library" | "simulator">("simulator");

  // Executive Simulator State
  const [simRound, setSimRound] = useState(0);
  const [simState, setSimState] = useState({
    cash: 12.0, // Miliar Rupiah
    marketShare: 18, // Persen
    morale: 82, // Persen
    risk: 25, // Persen
  });
  const [simLog, setSimLog] = useState<string[]>([]);
  const [isSimGameOver, setIsSimGameOver] = useState(false);

  // New Game Form
  const [newGame, setNewGame] = useState({
    title: "",
    category: "Simulasi Bisnis" as GameItem["category"],
    platform: "PC / Steam" as GameItem["platform"],
    status: "Sedang Dimainkan" as GameItem["status"],
    rating: 9.0,
    hoursPlayed: 20,
    coverUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    strategicTakeaway: "",
  });

  // Local storage save
  useEffect(() => {
    try {
      localStorage.setItem("aio_games_v1", JSON.stringify(games));
    } catch (e) {
      console.error("Failed to save games", e);
    }
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        g.title.toLowerCase().includes(q) ||
        g.strategicTakeaway.toLowerCase().includes(q);
      const matchCat =
        selectedCategory === "Semua" || g.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [games, searchQuery, selectedCategory]);

  const handleSimChoice = (opt: Scenario["options"][0]) => {
    const nextCash = Number((simState.cash + opt.impact.cash).toFixed(1));
    const nextShare = Math.min(100, Math.max(0, simState.marketShare + opt.impact.marketShare));
    const nextMorale = Math.min(100, Math.max(0, simState.morale + opt.impact.morale));
    const nextRisk = Math.min(100, Math.max(0, simState.risk + opt.impact.risk));

    setSimState({
      cash: nextCash,
      marketShare: nextShare,
      morale: nextMorale,
      risk: nextRisk,
    });

    const msg = `Ronde ${simRound + 1}: ${opt.label} (Kas ${opt.impact.cash >= 0 ? "+" : ""}${opt.impact.cash}M, Pangsa ${opt.impact.marketShare >= 0 ? "+" : ""}${opt.impact.marketShare}%)`;
    setSimLog([msg, ...simLog]);

    if (simRound + 1 >= SCENARIOS.length || nextCash <= 0) {
      setIsSimGameOver(true);
    } else {
      setSimRound(simRound + 1);
    }
  };

  const handleRestartSim = () => {
    setSimRound(0);
    setSimState({
      cash: 12.0,
      marketShare: 18,
      morale: 82,
      risk: 25,
    });
    setSimLog([]);
    setIsSimGameOver(false);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus game dari koleksi?")) {
      setGames(games.filter((g) => g.id !== id));
    }
  };

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGame.title.trim()) {
      alert("Mohon isi judul game.");
      return;
    }

    const g: GameItem = {
      id: `game-${Date.now()}`,
      title: newGame.title,
      category: newGame.category,
      platform: newGame.platform,
      status: newGame.status,
      rating: Number(newGame.rating) || 9.0,
      hoursPlayed: Number(newGame.hoursPlayed) || 10,
      coverUrl: newGame.coverUrl,
      strategicTakeaway:
        newGame.strategicTakeaway || "Pelajaran manajemen strategi dan pemodelan keputusan.",
    };

    setGames([g, ...games]);
    setShowAddModal(false);
    setNewGame({
      title: "",
      category: "Simulasi Bisnis",
      platform: "PC / Steam",
      status: "Sedang Dimainkan",
      rating: 9.0,
      hoursPlayed: 20,
      coverUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
      strategicTakeaway: "",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-500/10 text-rose-600 rounded-xl">
              <Gamepad2 size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Strategic Games & Simulators</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Simulasi bisnis interaktif, optimasi rantai pasok, dan pengasah kemampuan berpikir strategis beberapa langkah ke depan.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/70 p-1 rounded-xl border border-border text-xs">
            <button
              onClick={() => setActiveTab("simulator")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5",
                activeTab === "simulator"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Flame size={14} className="text-rose-500" />
              <span>Simulasi Eksekutif</span>
            </button>
            <button
              onClick={() => setActiveTab("library")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5",
                activeTab === "library"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Layers size={14} />
              <span>Koleksi Game</span>
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20"
          >
            <Plus size={16} />
            <span>Tambah Game</span>
          </button>
        </div>
      </div>

      {/* VIEW: EXECUTIVE SIMULATOR */}
      {activeTab === "simulator" && (
        <div className="space-y-6">
          {/* Live KPI Dashboard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Likuiditas Kas</span>
                <span className="font-mono">IDR</span>
              </div>
              <p
                className={cn(
                  "text-2xl font-bold mt-1 font-mono",
                  simState.cash < 3 ? "text-rose-600" : "text-foreground"
                )}
              >
                Rp {simState.cash.toFixed(1)} M
              </p>
              <span className="text-[10px] text-muted-foreground">Batas aman: &gt; Rp 3.0 M</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Pangsa Pasar</span>
                <BarChart3 size={14} className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold mt-1 text-foreground font-mono">
                {simState.marketShare}%
              </p>
              <span className="text-[10px] text-muted-foreground">Target Tier-1: 25%</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Moral & Retensi Tim</span>
                <Users size={14} className="text-emerald-500" />
              </div>
              <p className="text-2xl font-bold mt-1 text-foreground font-mono">
                {simState.morale}%
              </p>
              <span className="text-[10px] text-muted-foreground">Produktivitas prima</span>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Tingkat Risiko Korporat</span>
                <ShieldAlert size={14} className="text-amber-500" />
              </div>
              <p
                className={cn(
                  "text-2xl font-bold mt-1 font-mono",
                  simState.risk > 50 ? "text-rose-600" : "text-foreground"
                )}
              >
                {simState.risk}%
              </p>
              <span className="text-[10px] text-muted-foreground">Ambang bahaya: &gt; 70%</span>
            </div>
          </div>

          {/* Active Dilemma Card or Game Over Card */}
          {!isSimGameOver && SCENARIOS[simRound] ? (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                    Skenario {simRound + 1} dari {SCENARIOS.length}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    Keputusan Tingkat Dewan Direksi
                  </span>
                </div>
                <button
                  onClick={handleRestartSim}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <RotateCcw size={13} />
                  <span>Reset Skenario</span>
                </button>
              </div>

              <div className="mt-5">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                  {SCENARIOS[simRound].title}
                </h2>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-3xl">
                  {SCENARIOS[simRound].description}
                </p>
              </div>

              {/* Options Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-7">
                {SCENARIOS[simRound].options.map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => handleSimChoice(opt)}
                    className="p-4 sm:p-5 rounded-2xl border border-border hover:border-rose-500 bg-muted/20 hover:bg-rose-500/5 transition-all cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md"
                  >
                    <div>
                      <div className="w-7 h-7 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold text-xs mb-3 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-rose-600 transition-colors">
                        {opt.label}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {opt.actionDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap gap-2 text-[10px] font-mono">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded",
                          opt.impact.cash >= 0
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                            : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
                        )}
                      >
                        Kas {opt.impact.cash >= 0 ? "+" : ""}
                        {opt.impact.cash}M
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded",
                          opt.impact.marketShare >= 0
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                        )}
                      >
                        Pangsa {opt.impact.marketShare >= 0 ? "+" : ""}
                        {opt.impact.marketShare}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Game Over / Summary Evaluation Screen */
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto">
                <Trophy size={32} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Simulasi Strategis Selesai!
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
                  Evaluasi kinerja eksekutif berdasarkan alokasi modal, pangsa pasar, dan mitigasi risiko.
                </p>
              </div>

              <div className="inline-flex items-center gap-6 p-4 rounded-2xl bg-muted/50 border border-border text-left">
                <div>
                  <span className="text-xs text-muted-foreground">Kas Akhir</span>
                  <p className="text-xl font-bold text-foreground font-mono">
                    Rp {simState.cash.toFixed(1)} M
                  </p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <span className="text-xs text-muted-foreground">Pangsa Pasar</span>
                  <p className="text-xl font-bold text-foreground font-mono">
                    {simState.marketShare}%
                  </p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div>
                  <span className="text-xs text-muted-foreground">Moral Tim</span>
                  <p className="text-xl font-bold text-foreground font-mono">
                    {simState.morale}%
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleRestartSim}
                  className="inline-flex items-center gap-2 bg-rose-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-700 shadow-md shadow-rose-600/20"
                >
                  <RotateCcw size={16} />
                  <span>Mulai Ulang Skenario Baru</span>
                </button>
              </div>
            </div>
          )}

          {/* Decision History Log */}
          {simLog.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                Log Keputusan Sebelumnya
              </h3>
              <div className="space-y-2">
                {simLog.map((log, idx) => (
                  <div
                    key={idx}
                    className="text-xs text-foreground bg-muted/40 p-2.5 rounded-xl font-mono flex items-center gap-2"
                  >
                    <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: GAMES LIBRARY */}
      {activeTab === "library" && (
        <div className="space-y-6">
          {/* Filter and Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari game strategi, simulasi, atau teori..."
                className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-card border border-border text-foreground outline-hidden focus:border-rose-500 placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {["Semua", "Simulasi Bisnis", "Logistik & Optimasi", "Geopolitik & Diplomasi", "Taktik & Catur", "Ekonomi Pasar"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap border",
                      selectedCategory === cat
                        ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                        : "bg-card text-muted-foreground border-border hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="group bg-card border border-border hover:border-rose-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative aspect-16/9 w-full bg-muted overflow-hidden">
                  <img
                    src={game.coverUrl}
                    alt={game.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
                      {game.platform}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/70 text-rose-300 backdrop-blur-md flex items-center gap-1">
                      <Star size={11} className="fill-rose-400 text-rose-400" />
                      <span>{game.rating}</span>
                    </span>
                  </div>

                  <div className="absolute bottom-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/70 text-white backdrop-blur-md">
                      {game.hoursPlayed} Jam Main
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                        {game.category}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                          game.status === "Selesai"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : game.status === "Sedang Dimainkan"
                            ? "bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/60 dark:text-rose-400"
                            : "bg-muted text-foreground border-border dark:bg-card dark:text-foreground"
                        )}
                      >
                        {game.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-foreground group-hover:text-rose-600 transition-colors">
                      {game.title}
                    </h3>

                    <div className="mt-3 p-3 bg-muted/40 rounded-xl border border-border/60">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1">
                        <Target size={11} className="text-rose-500" />
                        Pelajaran Strategis:
                      </span>
                      <p className="text-xs text-foreground/90 mt-1 line-clamp-3 leading-relaxed">
                        {game.strategicTakeaway}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 mt-4 border-t border-border/50 text-xs">
                    <span className="text-muted-foreground text-[11px]">Metodologi Berpikir</span>
                    <button
                      onClick={(e) => handleDelete(game.id, e)}
                      title="Hapus game"
                      className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Game Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Gamepad2 size={20} className="text-rose-600" />
                <h3 className="text-lg font-bold text-foreground">Tambah Game ke Koleksi</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Tutup ✕
              </button>
            </div>

            <form onSubmit={handleCreateGame} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Judul Game *
                </label>
                <input
                  type="text"
                  required
                  value={newGame.title}
                  onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                  placeholder="misal: Victoria 3 / SimCity 4"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kategori
                  </label>
                  <select
                    value={newGame.category}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        category: e.target.value as GameItem["category"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-rose-500"
                  >
                    <option value="Simulasi Bisnis">Simulasi Bisnis</option>
                    <option value="Logistik & Optimasi">Logistik & Optimasi</option>
                    <option value="Geopolitik & Diplomasi">Geopolitik & Diplomasi</option>
                    <option value="Taktik & Catur">Taktik & Catur</option>
                    <option value="Ekonomi Pasar">Ekonomi Pasar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Platform
                  </label>
                  <select
                    value={newGame.platform}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        platform: e.target.value as GameItem["platform"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-rose-500"
                  >
                    <option value="PC / Steam">PC / Steam</option>
                    <option value="Board Game">Board Game</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Console">Console</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Status
                  </label>
                  <select
                    value={newGame.status}
                    onChange={(e) =>
                      setNewGame({
                        ...newGame,
                        status: e.target.value as GameItem["status"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-rose-500"
                  >
                    <option value="Sedang Dimainkan">Sedang Dimainkan</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Backlog">Backlog</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Rating (1 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={newGame.rating}
                    onChange={(e) => setNewGame({ ...newGame, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Total Jam Dimainkan
                  </label>
                  <input
                    type="number"
                    value={newGame.hoursPlayed}
                    onChange={(e) =>
                      setNewGame({ ...newGame, hoursPlayed: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Pelajaran & Teori Strategis
                </label>
                <textarea
                  rows={3}
                  value={newGame.strategicTakeaway}
                  onChange={(e) => setNewGame({ ...newGame, strategicTakeaway: e.target.value })}
                  placeholder="misal: Optimasi inventory turnover, manajemen risiko cash flow..."
                  className="w-full p-2.5 text-xs rounded-xl bg-muted/40 border border-border text-foreground outline-hidden focus:border-rose-500 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-border hover:bg-muted text-foreground"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20"
                >
                  Simpan Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
