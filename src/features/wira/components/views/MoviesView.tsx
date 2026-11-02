import React, { useState, useEffect, useMemo } from "react";
import {
  Film,
  Star,
  Plus,
  Search,
  Trash2,
  Sparkles,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface MovieItem {
  id: string;
  title: string;
  year: number;
  genre: "Bisnis & Keuangan" | "Teknologi" | "Dokumenter" | "Drama Korporat" | "Biografi";
  status: "Watchlist" | "Sedang Ditonton" | "Selesai";
  rating: number; // 1 - 10
  posterUrl: string;
  director: string;
  platform: "Netflix" | "HBO Max" | "Apple TV+" | "Prime Video" | "Bioskop";
  takeaway: string;
  runtime: string;
}

const INITIAL_MOVIES: MovieItem[] = [
  {
    id: "mov-1",
    title: "The Big Short",
    year: 2015,
    genre: "Bisnis & Keuangan",
    status: "Selesai",
    rating: 9.2,
    posterUrl: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=600&q=80",
    director: "Adam McKay",
    platform: "Netflix",
    takeaway: "Pelajaran krusial mengenai bahaya instrumen derivatif berleveraged tinggi (CDO), insentif agen pemeringkat yang cacat, dan pentingnya audit independen.",
    runtime: "130 mnt",
  },
  {
    id: "mov-2",
    title: "Succession (Series)",
    year: 2023,
    genre: "Drama Korporat",
    status: "Selesai",
    rating: 9.5,
    posterUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    director: "Jesse Armstrong",
    platform: "HBO Max",
    takeaway: "Dinamika perebutan kekuasaan dewan komisaris, strategi pertahanan hostile takeover, dan kerentanan tata kelola bisnis keluarga berskala konglomerasi.",
    runtime: "4 Season",
  },
  {
    id: "mov-3",
    title: "Margin Call",
    year: 2011,
    genre: "Bisnis & Keuangan",
    status: "Selesai",
    rating: 8.8,
    posterUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80",
    director: "J.C. Chandor",
    platform: "Prime Video",
    takeaway: "Keputusan etika 24 jam sebelum keruntuhan bank investasi: kecepatan likuidasi aset beracun vs dampak reputasi pasar jangka panjang.",
    runtime: "107 mnt",
  },
  {
    id: "mov-4",
    title: "General Magic",
    year: 2018,
    genre: "Dokumenter",
    status: "Watchlist",
    rating: 8.9,
    posterUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
    director: "Sarah Kerruish & Matt Maude",
    platform: "Apple TV+",
    takeaway: "Kisah tim perintis yang menciptakan konsep smartphone dan touchscreen di Silicon Valley sebelum kesiapan infrastruktur telekomunikasi global.",
    runtime: "93 mnt",
  },
  {
    id: "mov-5",
    title: "Air: Courting a Legend",
    year: 2023,
    genre: "Biografi",
    status: "Sedang Ditonton",
    rating: 8.5,
    posterUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
    director: "Ben Affleck",
    platform: "Prime Video",
    takeaway: "Strategi negosiasi revenue-sharing radikal yang mendisrupsi model endorsement konvensional dan merevolusi pasar ritel olahraga.",
    runtime: "112 mnt",
  },
  {
    id: "mov-6",
    title: "Blackberry",
    year: 2023,
    genre: "Teknologi",
    status: "Watchlist",
    rating: 8.4,
    posterUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80",
    director: "Matt Johnson",
    platform: "Netflix",
    takeaway: "Pelajaran tentang innovator's dilemma: kepuasan pasar monopoli keyboard fisik dan kegagalan mengantisipasi pergeseran ke layar sentuh penuh.",
    runtime: "120 mnt",
  },
];

export function MoviesView() {
  const [movies, setMovies] = useState<MovieItem[]>(() => {
    try {
      const saved = localStorage.getItem("aio_movies_watchlist_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MOVIES;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("Semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [showAddModal, setShowAddModal] = useState(false);

  // New movie state
  const [newMovie, setNewMovie] = useState({
    title: "",
    year: 2026,
    genre: "Bisnis & Keuangan" as MovieItem["genre"],
    status: "Watchlist" as MovieItem["status"],
    rating: 8.5,
    posterUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
    director: "",
    platform: "Netflix" as MovieItem["platform"],
    takeaway: "",
    runtime: "115 mnt",
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aio_movies_watchlist_v1", JSON.stringify(movies));
    } catch (e) {
      console.error("Failed to save movies", e);
    }
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      const q = searchQuery.toLowerCase();
      const matchSearch =
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.takeaway.toLowerCase().includes(q);
      const matchGenre = selectedGenre === "Semua" || m.genre === selectedGenre;
      const matchStatus = selectedStatus === "Semua" || m.status === selectedStatus;
      return matchSearch && matchGenre && matchStatus;
    });
  }, [movies, searchQuery, selectedGenre, selectedStatus]);

  const stats = useMemo(() => {
    return {
      total: movies.length,
      completed: movies.filter((m) => m.status === "Selesai").length,
      inProgress: movies.filter((m) => m.status === "Sedang Ditonton").length,
      watchlist: movies.filter((m) => m.status === "Watchlist").length,
    };
  }, [movies]);

  const updateStatus = (id: string, newStatus: MovieItem["status"]) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus judul film ini dari daftar tontonan?")) {
      setMovies((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMovie.title.trim()) {
      alert("Mohon masukkan judul film.");
      return;
    }

    const item: MovieItem = {
      id: `mov-${Date.now()}`,
      title: newMovie.title,
      year: Number(newMovie.year) || 2026,
      genre: newMovie.genre,
      status: newMovie.status,
      rating: Number(newMovie.rating) || 8.0,
      posterUrl: newMovie.posterUrl,
      director: newMovie.director || "Sutradara Independen",
      platform: newMovie.platform,
      takeaway: newMovie.takeaway || "Catatan studi kasus bisnis dan pembelajaran korporat.",
      runtime: newMovie.runtime || "120 mnt",
    };

    setMovies([item, ...movies]);
    setShowAddModal(false);
    setNewMovie({
      title: "",
      year: 2026,
      genre: "Bisnis & Keuangan",
      status: "Watchlist",
      rating: 8.5,
      posterUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      director: "",
      platform: "Netflix",
      takeaway: "",
      runtime: "115 mnt",
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl">
              <Film size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Movies & Executive Cinema</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Kurasi tontonan film analitis, drama korporat, dokumenter teknologi, dan studi kasus manajemen krisis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-amber-700 transition-colors shadow-md shadow-amber-600/20"
          >
            <Plus size={16} />
            <span>Tambah Judul</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Total Judul</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Selesai Ditonton</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.completed}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Sedang Ditonton</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.inProgress}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Antrean Watchlist</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.watchlist}</p>
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
            placeholder="Cari judul, sutradara, atau pembelajaran..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-card border border-border text-foreground outline-hidden focus:border-amber-500 placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border text-xs">
            {["Semua", "Bisnis & Keuangan", "Teknologi", "Dokumenter", "Drama Korporat"].map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap",
                  selectedGenre === genre
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {genre}
              </button>
            ))}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-border bg-card text-xs text-foreground outline-hidden"
          >
            <option value="Semua">Semua Status</option>
            <option value="Watchlist">Watchlist</option>
            <option value="Sedang Ditonton">Sedang Ditonton</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="group bg-card border border-border hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Poster with Overlay */}
            <div className="relative aspect-16/9 w-full bg-muted overflow-hidden">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-black/70 text-white backdrop-blur-md">
                  {movie.platform}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-black/70 text-amber-300 backdrop-blur-md flex items-center gap-1">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span>{movie.rating}</span>
                </span>
              </div>

              <div className="absolute bottom-2.5 right-2.5">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/70 text-white backdrop-blur-md">
                  {movie.year} • {movie.runtime}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    {movie.genre}
                  </span>
                  <select
                    value={movie.status}
                    onChange={(e) => updateStatus(movie.id, e.target.value as MovieItem["status"])}
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border outline-hidden cursor-pointer",
                      movie.status === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-400"
                        : movie.status === "Sedang Ditonton"
                        ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-400"
                        : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-400"
                    )}
                  >
                    <option value="Watchlist">Watchlist</option>
                    <option value="Sedang Ditonton">Sedang Ditonton</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>

                <h3 className="font-bold text-base text-foreground group-hover:text-amber-600 transition-colors line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">Sutradara: {movie.director}</p>

                {/* Key Takeaway Card */}
                <div className="mt-3 p-3 bg-muted/40 rounded-xl border border-border/60">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground flex items-center gap-1">
                    <Sparkles size={11} className="text-amber-500" />
                    Insight Strategis:
                  </span>
                  <p className="text-xs text-foreground/90 mt-1 line-clamp-3 leading-relaxed">
                    {movie.takeaway}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-3 mt-4 border-t border-border/50 text-xs">
                <span className="text-muted-foreground text-[11px]">Rekomendasi Advisory</span>
                <button
                  onClick={(e) => handleDelete(movie.id, e)}
                  title="Hapus film"
                  className="p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Movie Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Film size={20} className="text-amber-600" />
                <h3 className="text-lg font-bold text-foreground">Tambah Film / Serial Baru</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Tutup ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Judul Film / Serial *
                </label>
                <input
                  type="text"
                  required
                  value={newMovie.title}
                  onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                  placeholder="misal: Wall Street (1987)"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tahun Rilis
                  </label>
                  <input
                    type="number"
                    value={newMovie.year}
                    onChange={(e) => setNewMovie({ ...newMovie, year: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Genre
                  </label>
                  <select
                    value={newMovie.genre}
                    onChange={(e) =>
                      setNewMovie({
                        ...newMovie,
                        genre: e.target.value as MovieItem["genre"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-amber-500"
                  >
                    <option value="Bisnis & Keuangan">Bisnis & Keuangan</option>
                    <option value="Teknologi">Teknologi</option>
                    <option value="Dokumenter">Dokumenter</option>
                    <option value="Drama Korporat">Drama Korporat</option>
                    <option value="Biografi">Biografi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Platform Streaming
                  </label>
                  <select
                    value={newMovie.platform}
                    onChange={(e) =>
                      setNewMovie({
                        ...newMovie,
                        platform: e.target.value as MovieItem["platform"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-amber-500"
                  >
                    <option value="Netflix">Netflix</option>
                    <option value="HBO Max">HBO Max</option>
                    <option value="Apple TV+">Apple TV+</option>
                    <option value="Prime Video">Prime Video</option>
                    <option value="Bioskop">Bioskop</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Sutradara
                  </label>
                  <input
                    type="text"
                    value={newMovie.director}
                    onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                    placeholder="misal: Oliver Stone"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Rating (Skala 1 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    value={newMovie.rating}
                    onChange={(e) => setNewMovie({ ...newMovie, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-muted/40 border border-border text-foreground outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Catatan / Pelajaran Strategis Utama
                </label>
                <textarea
                  rows={3}
                  value={newMovie.takeaway}
                  onChange={(e) => setNewMovie({ ...newMovie, takeaway: e.target.value })}
                  placeholder="Pelajaran tata kelola, krisis likuiditas, atau strategi kompetisi..."
                  className="w-full p-2.5 text-xs rounded-xl bg-muted/40 border border-border text-foreground outline-hidden focus:border-amber-500 leading-relaxed resize-none"
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
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-amber-600 text-white hover:bg-amber-700 shadow-md shadow-amber-600/20"
                >
                  Simpan Judul
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
