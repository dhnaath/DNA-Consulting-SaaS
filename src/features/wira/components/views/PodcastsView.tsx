import React, { useState, useEffect, useMemo } from "react";
import {
  Podcast,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Bookmark,
  BookmarkCheck,
  Search,
  Plus,
  Clock,
  Trash2,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface PodcastEpisode {
  id: string;
  title: string;
  showName: string;
  host: string;
  duration: string; // e.g., "48 mnt"
  durationSeconds: number;
  category: "Strategi" | "M&A & Finansial" | "Teknologi" | "Leadership" | "Ekonomi";
  coverUrl: string;
  audioUrl?: string;
  description: string;
  date: string;
  isBookmarked: boolean;
}

const INITIAL_EPISODES: PodcastEpisode[] = [
  {
    id: "pod-1",
    title: "Navigating Strategic Uncertainty & Corporate Agility",
    showName: "McKinsey on Strategy",
    host: "Michael Birshan & Sean Brown",
    duration: "34 mnt",
    durationSeconds: 2040,
    category: "Strategi",
    coverUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
    description: "Bagaimana pemimpin perusahaan merespons disrupsi geopolitik dan mengalokasikan modal secara fleksibel di era ketidakpastian tinggi.",
    date: "17 Sep 2026",
    isBookmarked: true,
  },
  {
    id: "pod-2",
    title: "Deep Dive: Valuasi & Dinamika Akuisisi Teknologi Modern",
    showName: "Acquired Podcast",
    host: "Ben Gilbert & David Rosenthal",
    duration: "78 mnt",
    durationSeconds: 4680,
    category: "M&A & Finansial",
    coverUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&q=80",
    description: "Studi kasus komprehensif struktur transaksi M&A, sinergi operasional pasca akuisisi, dan rasio multiplier valuasi industri.",
    date: "14 Sep 2026",
    isBookmarked: false,
  },
  {
    id: "pod-3",
    title: "Masa Depan Transformasi Industri & Manufaktur Berkelanjutan",
    showName: "Endgame with Gita Wirjawan",
    host: "Gita Wirjawan",
    duration: "62 mnt",
    durationSeconds: 3720,
    category: "Ekonomi",
    coverUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    description: "Diskusi mendalam mengenai reindustrialisasi Indonesia, transisi energi hijau, dan kesiapan talenta di pasar global.",
    date: "11 Sep 2026",
    isBookmarked: true,
  },
  {
    id: "pod-4",
    title: "The Architecture of High-Performing Engineering Teams",
    showName: "a16z Podcast",
    host: "Steph Smith",
    duration: "45 mnt",
    durationSeconds: 2700,
    category: "Teknologi",
    coverUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80",
    description: "Praktik terbaik membangun budaya engineering berskala besar, otomatisasi workflow, dan efisiensi deployment microservices.",
    date: "08 Sep 2026",
    isBookmarked: false,
  },
  {
    id: "pod-5",
    title: "Decision Making Under Pressure: Insights from Master Tacticians",
    showName: "The Knowledge Project",
    host: "Shane Parrish",
    duration: "52 mnt",
    durationSeconds: 3120,
    category: "Leadership",
    coverUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    description: "Mengembangkan mental models untuk memitigasi cognitive bias saat mengambil keputusan risiko tinggi dalam konsultansi eksekutif.",
    date: "03 Sep 2026",
    isBookmarked: false,
  },
  {
    id: "pod-6",
    title: "Supply Chain Resilience & Geoeconomic Shifts",
    showName: "HBR IdeaCast",
    host: "Alison Beard & Curt Nickisch",
    duration: "38 mnt",
    durationSeconds: 2280,
    category: "Strategi",
    coverUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80",
    description: "Langkah proaktif diversifikasi rantai pasok global dan strategi mitigasi risiko kenaikan freight rate maritim.",
    date: "29 Agu 2026",
    isBookmarked: false,
  },
];

export function PodcastsView() {
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>(() => {
    try {
      const saved = localStorage.getItem("aio_podcasts_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_EPISODES;
  });

  const [currentTrackId, setCurrentTrackId] = useState<string>(episodes[0]?.id || "pod-1");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [progressSec, setProgressSec] = useState<number>(420);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form State
  const [newEp, setNewEp] = useState({
    title: "",
    showName: "",
    host: "",
    duration: "45 mnt",
    category: "Strategi" as PodcastEpisode["category"],
    coverUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
    description: "",
  });

  // Local storage save
  useEffect(() => {
    try {
      localStorage.setItem("aio_podcasts_v1", JSON.stringify(episodes));
    } catch (e) {
      console.error("Failed to save podcasts", e);
    }
  }, [episodes]);

  // Simulated player progress tick
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgressSec((prev) => prev + 1 * playbackSpeed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const activeEpisode = useMemo(() => {
    return episodes.find((e) => e.id === currentTrackId) || episodes[0];
  }, [episodes, currentTrackId]);

  const filteredEpisodes = useMemo(() => {
    return episodes.filter((ep) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        ep.title.toLowerCase().includes(q) ||
        ep.showName.toLowerCase().includes(q) ||
        ep.host.toLowerCase().includes(q) ||
        ep.description.toLowerCase().includes(q);
      const matchCat = selectedCategory === "Semua" || ep.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [episodes, searchQuery, selectedCategory]);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEpisodes((prev) =>
      prev.map((ep) => (ep.id === id ? { ...ep, isBookmarked: !ep.isBookmarked } : ep))
    );
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus episode podcast ini?")) {
      const updated = episodes.filter((ep) => ep.id !== id);
      setEpisodes(updated);
      if (currentTrackId === id && updated.length > 0) {
        setCurrentTrackId(updated[0].id);
      }
    }
  };

  const handlePlayEpisode = (ep: PodcastEpisode) => {
    if (currentTrackId === ep.id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrackId(ep.id);
      setIsPlaying(true);
      setProgressSec(0);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleCreateEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEp.title.trim() || !newEp.showName.trim()) {
      alert("Mohon masukkan judul episode dan nama podcast.");
      return;
    }

    const now = new Date();
    const formatted = `${now.getDate()} ${now.toLocaleString("id-ID", { month: "short" })} ${now.getFullYear()}`;

    const ep: PodcastEpisode = {
      id: `pod-${Date.now()}`,
      title: newEp.title,
      showName: newEp.showName,
      host: newEp.host || "Host Tamu",
      duration: newEp.duration,
      durationSeconds: 2400,
      category: newEp.category,
      coverUrl: newEp.coverUrl,
      description: newEp.description || "Episode diskusi strategi bisnis dan konsultansi.",
      date: formatted,
      isBookmarked: false,
    };

    setEpisodes([ep, ...episodes]);
    setShowAddModal(false);
    setNewEp({
      title: "",
      showName: "",
      host: "",
      duration: "45 mnt",
      category: "Strategi",
      coverUrl: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80",
      description: "",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col space-y-7 pb-36">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500/10 text-purple-600 rounded-xl">
              <Podcast size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Podcast & Audio Briefings</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Kurasi episode podcast seputar strategi perusahaan, tren M&A, dinamika pasar modal, dan kepemimpinan eksekutif.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-purple-700 transition-colors shadow-md shadow-purple-600/20"
          >
            <Plus size={16} />
            <span>Tambah Episode</span>
          </button>
        </div>
      </div>

      {/* Featured Current Episode Banner */}
      {activeEpisode && (
        <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-border text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-purple-800/40 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          <div className="relative aspect-square w-32 sm:w-44 shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-border/10">
            <img
              src={activeEpisode.coverUrl}
              alt={activeEpisode.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-all flex items-center justify-center group"
            >
              <div className="w-14 h-14 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
              </div>
            </button>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-300 border border-purple-400/20">
                {activeEpisode.category}
              </span>
              <span className="text-xs text-purple-200/80 font-medium">
                {activeEpisode.showName} • {activeEpisode.duration}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold leading-snug line-clamp-2">
              {activeEpisode.title}
            </h2>
            <p className="text-xs sm:text-sm text-purple-100/70 mt-1.5 line-clamp-2 max-w-2xl">
              {activeEpisode.description}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-4 mt-4 text-xs text-purple-200/90 font-medium">
              <span>Host: {activeEpisode.host}</span>
              <span>•</span>
              <span>Rilis: {activeEpisode.date}</span>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Total Episode</span>
          <p className="text-2xl font-bold text-foreground mt-1">{episodes.length}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Tersimpan / Bookmark</span>
          <p className="text-2xl font-bold text-foreground mt-1">
            {episodes.filter((e) => e.isBookmarked).length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Fokus Strategi</span>
          <p className="text-2xl font-bold text-foreground mt-1">
            {episodes.filter((e) => e.category === "Strategi").length}
          </p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Kanal Rekomendasi</span>
          <p className="text-2xl font-bold text-foreground mt-1">5 Acara</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul episode, nama show, atau topik..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-card border border-border text-foreground outline-hidden focus:border-purple-500 placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Strategi", "M&A & Finansial", "Teknologi", "Leadership", "Ekonomi"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap border",
                selectedCategory === cat
                  ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                  : "bg-card text-muted-foreground border-border hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Episode List */}
      <div className="space-y-3">
        {filteredEpisodes.map((ep) => {
          const isCurrent = currentTrackId === ep.id;
          const isThisPlaying = isCurrent && isPlaying;

          return (
            <div
              key={ep.id}
              onClick={() => handlePlayEpisode(ep)}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group",
                isCurrent
                  ? "bg-purple-500/5 border-purple-500 shadow-xs"
                  : "bg-card hover:bg-accent/40 border-border"
              )}
            >
              <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                <div className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden bg-muted">
                  <img
                    src={ep.coverUrl}
                    alt={ep.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={cn(
                      "absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity",
                      isThisPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  >
                    {isThisPlaying ? (
                      <Pause size={18} className="text-white" />
                    ) : (
                      <Play size={18} className="text-white ml-0.5" />
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {ep.category}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{ep.showName}</span>
                  </div>
                  <h3
                    className={cn(
                      "font-bold text-sm truncate",
                      isCurrent ? "text-purple-600 dark:text-purple-400" : "text-foreground"
                    )}
                  >
                    {ep.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{ep.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-muted-foreground shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/50">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>{ep.duration}</span>
                </div>

                <button
                  onClick={(e) => toggleBookmark(ep.id, e)}
                  title={ep.isBookmarked ? "Hapus dari Bookmark" : "Simpan ke Bookmark"}
                  className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  {ep.isBookmarked ? (
                    <BookmarkCheck size={16} className="text-purple-600 dark:text-purple-400" />
                  ) : (
                    <Bookmark size={16} />
                  )}
                </button>

                <button
                  onClick={(e) => handleDelete(ep.id, e)}
                  title="Hapus episode"
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Audio Player Bar */}
      {activeEpisode && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-3 sm:p-4 shadow-2xl">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left Episode Info */}
            <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
              <img
                src={activeEpisode.coverUrl}
                alt={activeEpisode.title}
                referrerPolicy="no-referrer"
                className="w-11 h-11 rounded-lg object-cover shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-foreground truncate">
                  {activeEpisode.title}
                </h4>
                <p className="text-[11px] text-muted-foreground truncate">{activeEpisode.showName}</p>
              </div>
            </div>

            {/* Center Player Controls */}
            <div className="flex flex-col items-center gap-1 w-full sm:w-1/3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setProgressSec(Math.max(0, progressSec - 15))}
                  title="Mundur 15 detik"
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw size={16} />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-9 h-9 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>

                <button
                  onClick={() => setProgressSec(progressSec + 15)}
                  title="Maju 15 detik"
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCw size={16} />
                </button>
              </div>

              {/* Progress Slider */}
              <div className="flex items-center gap-2 w-full max-w-xs text-[10px] text-muted-foreground font-mono">
                <span>{formatSeconds(progressSec)}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden relative cursor-pointer">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        (progressSec / activeEpisode.durationSeconds) * 100
                      )}%`,
                    }}
                  />
                </div>
                <span>{activeEpisode.duration}</span>
              </div>
            </div>

            {/* Right Speed & Actions */}
            <div className="hidden sm:flex items-center justify-end gap-3 w-1/3 text-xs">
              <button
                onClick={() => {
                  const speeds = [1, 1.25, 1.5, 2];
                  const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                  setPlaybackSpeed(speeds[nextIdx]);
                }}
                className="px-2 py-1 rounded-md border border-border text-[11px] font-bold text-foreground hover:bg-muted"
                title="Kecepatan Pemutaran"
              >
                {playbackSpeed}x
              </button>

              <button
                onClick={(e) => toggleBookmark(activeEpisode.id, e)}
                className="p-1.5 rounded-md hover:bg-muted text-foreground"
              >
                {activeEpisode.isBookmarked ? (
                  <BookmarkCheck size={16} className="text-purple-600" />
                ) : (
                  <Bookmark size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Podcast size={20} className="text-purple-600" />
                <h3 className="text-lg font-bold text-foreground">Tambah Episode Podcast</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Tutup ✕
              </button>
            </div>

            <form onSubmit={handleCreateEpisode} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Judul Episode *
                </label>
                <input
                  type="text"
                  required
                  value={newEp.title}
                  onChange={(e) => setNewEp({ ...newEp, title: e.target.value })}
                  placeholder="misal: Strategi Efisiensi Modal Kerja Q4"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Nama Acara Podcast *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEp.showName}
                    onChange={(e) => setNewEp({ ...newEp, showName: e.target.value })}
                    placeholder="misal: McKinsey on Strategy"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Kategori Topik
                  </label>
                  <select
                    value={newEp.category}
                    onChange={(e) =>
                      setNewEp({
                        ...newEp,
                        category: e.target.value as PodcastEpisode["category"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-purple-500"
                  >
                    <option value="Strategi">Strategi</option>
                    <option value="M&A & Finansial">M&A & Finansial</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Ekonomi">Ekonomi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Host / Pembicara
                  </label>
                  <input
                    type="text"
                    value={newEp.host}
                    onChange={(e) => setNewEp({ ...newEp, host: e.target.value })}
                    placeholder="misal: Gita Wirjawan"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Durasi
                  </label>
                  <input
                    type="text"
                    value={newEp.duration}
                    onChange={(e) => setNewEp({ ...newEp, duration: e.target.value })}
                    placeholder="misal: 45 mnt"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Deskripsi / Poin Pembahasan
                </label>
                <textarea
                  rows={3}
                  value={newEp.description}
                  onChange={(e) => setNewEp({ ...newEp, description: e.target.value })}
                  placeholder="Ringkasan insight atau catatan penting dari episode..."
                  className="w-full p-2.5 text-xs rounded-xl bg-muted/40 border border-border text-foreground outline-hidden focus:border-purple-500 leading-relaxed resize-none"
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
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-600/20"
                >
                  Simpan Episode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
