import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  MovieItem,
  MovieWatchStatus,
  MovieFormatType,
  StreamingPlatform,
} from '../../types';
import {
  Film,
  Tv,
  Plus,
  Search,
  Star,
  Play,
  CheckCircle2,
  Clock,
  Heart,
  LayoutGrid,
  Columns,
  Table as TableIcon,
  Edit3,
  Trash2,
  X,
  Sparkles,
  Calendar,
  User,
} from 'lucide-react';

const STATUS_CONFIG: Record<
  MovieWatchStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  'Want to Watch': {
    label: 'Ingin Ditonton',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  Watching: {
    label: 'Sedang Nonton',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  Completed: {
    label: 'Selesai Ditonton',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  Dropped: {
    label: 'Berhenti (Dropped)',
    color: 'text-neutral-600',
    bg: 'bg-neutral-100',
    border: 'border-neutral-200',
  },
};

const PLATFORMS: StreamingPlatform[] = [
  'Netflix',
  'Disney+ Hotstar',
  'Prime Video',
  'Apple TV+',
  'HBO GO / Max',
  'Bioskop / Cinema',
  'YouTube / Lainnya',
];

const FORMAT_TYPES: MovieFormatType[] = [
  'Movie',
  'TV Series',
  'Anime',
  'Documentary',
  'Miniseries',
];

export const MovieTrackerView: React.FC = () => {
  const { movies, addMovie, updateMovie, deleteMovie, toggleFavoriteMovie } = useLifeOS();

  const [selectedStatus, setSelectedStatus] = useState<MovieWatchStatus | 'all'>('all');
  const [selectedFormat, setSelectedFormat] = useState<MovieFormatType | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<StreamingPlatform | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'board' | 'table'>('gallery');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MovieFormatType>('Movie');
  const [status, setStatus] = useState<MovieWatchStatus>('Want to Watch');
  const [platform, setPlatform] = useState<StreamingPlatform>('Netflix');
  const [releaseYear, setReleaseYear] = useState<number>(new Date().getFullYear());
  const [directorOrCreator, setDirectorOrCreator] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [currentProgress, setCurrentProgress] = useState('');
  const [watchedDate, setWatchedDate] = useState('');
  const [reviewNotes, setReviewNotes] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [genres, setGenres] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) => {
      if (selectedStatus !== 'all' && m.status !== selectedStatus) return false;
      if (selectedFormat !== 'all' && m.type !== selectedFormat) return false;
      if (selectedPlatform !== 'all' && m.platform !== selectedPlatform) return false;
      if (showFavoritesOnly && !m.isFavorite) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = m.title.toLowerCase().includes(q);
        const inDirector = (m.directorOrCreator || '').toLowerCase().includes(q);
        const inGenre = m.genre.some((g) => g.toLowerCase().includes(q));
        const inNotes = (m.reviewNotes || '').toLowerCase().includes(q);
        if (!inTitle && !inDirector && !inGenre && !inNotes) return false;
      }
      return true;
    });
  }, [movies, selectedStatus, selectedFormat, selectedPlatform, showFavoritesOnly, searchQuery]);

  // KPI Metrics
  const watchingCount = useMemo(
    () => movies.filter((m) => m.status === 'Watching').length,
    [movies]
  );
  const completedCount = useMemo(
    () => movies.filter((m) => m.status === 'Completed').length,
    [movies]
  );
  const watchlistCount = useMemo(
    () => movies.filter((m) => m.status === 'Want to Watch').length,
    [movies]
  );
  const avgRating = useMemo(() => {
    const rated = movies.filter((m) => m.rating && m.rating > 0);
    if (rated.length === 0) return '0.0';
    const sum = rated.reduce((acc, m) => acc + (m.rating || 0), 0);
    return (sum / rated.length).toFixed(1);
  }, [movies]);

  const handleOpenNew = () => {
    setEditingId(null);
    setTitle('');
    setType('Movie');
    setStatus('Want to Watch');
    setPlatform('Netflix');
    setReleaseYear(2026);
    setDirectorOrCreator('');
    setRating(5);
    setCurrentProgress('');
    setWatchedDate('');
    setReviewNotes('');
    setPosterUrl('');
    setGenres(['Drama']);
    setGenreInput('');
    setIsFavorite(false);
    setIsModalOpen(true);
  };

  const handleEdit = (item: MovieItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setType(item.type);
    setStatus(item.status);
    setPlatform(item.platform);
    setReleaseYear(item.releaseYear);
    setDirectorOrCreator(item.directorOrCreator || '');
    setRating(item.rating || 5);
    setCurrentProgress(item.currentProgress || '');
    setWatchedDate(item.watchedDate || '');
    setReviewNotes(item.reviewNotes || '');
    setPosterUrl(item.posterUrl || '');
    setGenres(item.genre || []);
    setGenreInput('');
    setIsFavorite(item.isFavorite);
    setIsModalOpen(true);
  };

  const handleAddGenre = () => {
    const trimmed = genreInput.trim();
    if (trimmed && !genres.includes(trimmed)) {
      setGenres([...genres, trimmed]);
      setGenreInput('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: Omit<MovieItem, 'id'> = {
      title: title.trim(),
      type,
      status,
      platform,
      releaseYear: Number(releaseYear) || 2026,
      directorOrCreator: directorOrCreator.trim() || undefined,
      rating: status === 'Completed' || status === 'Watching' ? rating : undefined,
      currentProgress: currentProgress.trim() || undefined,
      watchedDate: watchedDate || undefined,
      reviewNotes: reviewNotes.trim() || undefined,
      posterUrl: posterUrl.trim() || undefined,
      genre: genres.length > 0 ? genres : ['General'],
      isFavorite,
    };

    if (editingId) {
      updateMovie(editingId, payload);
    } else {
      addMovie(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-rose-50/60 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
              🎬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2F3437] tracking-tight">
                  Movie & Series Tracker
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-100/70 text-rose-800">
                  by LifeCanvas
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
                Katalog tontonan film, serial TV, dokumenter, dan anime lengkap dengan platform
                streaming, progres episode, rating bintang, dan ulasan pribadi.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Film / Serial</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#F1F1EF]">
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">
              Daftar Ingin Ditonton
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-amber-700">{watchlistCount}</span>
              <span className="text-[11px] text-neutral-400">judul di watchlist</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Sedang Ditonton</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-blue-700">{watchingCount}</span>
              <span className="text-[11px] text-neutral-400">on-going</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Selesai Ditonton</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-emerald-700">{completedCount}</span>
              <span className="text-[11px] text-neutral-400">tamat</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Rata-rata Rating</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-[#2F3437]">⭐ {avgRating}</span>
              <span className="text-[11px] text-neutral-400">/ 5.0 bintang</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & View Switcher */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              selectedStatus === 'all'
                ? 'bg-[#2F3437] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            Semua Status ({movies.length})
          </button>

          {(Object.keys(STATUS_CONFIG) as MovieWatchStatus[]).map((st) => {
            const count = movies.filter((m) => m.status === st).length;
            const isSelected = selectedStatus === st;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#2F3437] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>{STATUS_CONFIG[st].label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-neutral-700 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F1F1EF]">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul film, sutradara, genre..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as MovieFormatType | 'all')}
              className="text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-700 focus:outline-none"
            >
              <option value="all">Semua Format</option>
              {FORMAT_TYPES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value as StreamingPlatform | 'all')}
              className="text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-700 focus:outline-none"
            >
              <option value="all">Semua Platform</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                showFavoritesOnly
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-white border-[#E9E9E7] text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  showFavoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-neutral-400'
                }`}
              />
              <span>Favorit</span>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-[#E9E9E7] self-end sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode('gallery')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'gallery'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Galeri</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'board'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Tabel</span>
            </button>
          </div>
        </div>
      </div>

      {/* View 1: Poster Gallery */}
      {viewMode === 'gallery' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMovies.map((item) => {
            const stCfg = STATUS_CONFIG[item.status];
            return (
              <div
                key={item.id}
                className="bg-white border border-[#E9E9E7] hover:border-neutral-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Image / Backdrop */}
                  <div className="h-40 bg-neutral-900 relative overflow-hidden">
                    {item.posterUrl ? (
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-950 text-4xl">
                        🎬
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border backdrop-blur-xs ${stCfg.bg} ${stCfg.border} ${stCfg.color}`}
                      >
                        {stCfg.label}
                      </span>
                      <button
                        onClick={() => toggleFavoriteMovie(item.id)}
                        className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-xs transition-colors"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            item.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom Title on Cover */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="flex items-center gap-2 text-[10px] text-neutral-300 font-medium">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.releaseYear}</span>
                        <span>•</span>
                        <span className="text-amber-300 font-semibold">{item.platform}</span>
                      </div>
                      <h3
                        onClick={() => handleEdit(item)}
                        className="text-base font-bold leading-snug cursor-pointer hover:underline line-clamp-1 mt-0.5"
                      >
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      {item.rating ? (
                        <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < (item.rating || 0)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-neutral-200'
                              }`}
                            />
                          ))}
                          <span className="text-neutral-700 ml-1 text-[11px]">{item.rating}/5</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-400 italic">Belum ada rating</span>
                      )}

                      {item.currentProgress && (
                        <span className="text-[11px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md">
                          ⏱️ {item.currentProgress}
                        </span>
                      )}
                    </div>

                    {item.directorOrCreator && (
                      <p className="text-[11px] text-neutral-500">
                        <span className="font-medium text-neutral-700">Sutradara / Kreator:</span>{' '}
                        {item.directorOrCreator}
                      </p>
                    )}

                    {item.reviewNotes && (
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed bg-[#FAF9F6] p-2.5 rounded-xl border border-[#F1F1EF]">
                        "{item.reviewNotes}"
                      </p>
                    )}

                    <div className="flex items-center gap-1 flex-wrap">
                      {item.genre.map((g) => (
                        <span
                          key={g}
                          className="text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-4 py-3 border-t border-[#F1F1EF] flex items-center justify-between text-xs bg-[#FAF9F6]/60">
                  {item.status !== 'Completed' ? (
                    <button
                      onClick={() =>
                        updateMovie(item.id, {
                          status: item.status === 'Want to Watch' ? 'Watching' : 'Completed',
                          watchedDate:
                            item.status === 'Watching'
                              ? new Date().toISOString().split('T')[0]
                              : item.watchedDate,
                        })
                      }
                      className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-blue-700" />
                      <span>
                        {item.status === 'Want to Watch' ? 'Mulai Tonton' : 'Tandai Selesai'}
                      </span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai {item.watchedDate ? `(${item.watchedDate})` : ''}</span>
                    </span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1 text-neutral-400 hover:text-neutral-800 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteMovie(item.id)}
                      className="p-1 text-neutral-400 hover:text-red-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Kanban Watchlist Board */}
      {viewMode === 'board' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(Object.keys(STATUS_CONFIG) as MovieWatchStatus[]).map((st) => {
            const colMovies = filteredMovies.filter((m) => m.status === st);
            const cfg = STATUS_CONFIG[st];
            return (
              <div
                key={st}
                className="bg-[#FAF9F6] border border-[#E9E9E7] rounded-2xl p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}
                  >
                    {cfg.label}
                  </span>
                  <span className="text-xs font-semibold text-neutral-400">{colMovies.length}</span>
                </div>

                <div className="space-y-2.5">
                  {colMovies.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleEdit(m)}
                      className="bg-white border border-[#E9E9E7] hover:border-neutral-300 rounded-xl p-3 shadow-2xs cursor-pointer space-y-2 transition-all"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#2F3437] line-clamp-1">{m.title}</h4>
                        <span className="text-[10px] font-medium text-neutral-400 shrink-0">
                          {m.releaseYear}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-500">
                        <span>{m.platform}</span>
                        {m.rating && <span className="text-amber-600 font-bold">⭐ {m.rating}</span>}
                      </div>
                      {m.currentProgress && (
                        <div className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded inline-block">
                          {m.currentProgress}
                        </div>
                      )}
                    </div>
                  ))}
                  {colMovies.length === 0 && (
                    <div className="py-8 text-center text-[11px] text-neutral-400 italic">
                      Kosong
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 3: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-[#E9E9E7] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-[#FAF9F6] text-neutral-500 border-b border-[#E9E9E7] font-semibold">
                <tr>
                  <th className="py-3 px-4">Judul</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Progres / Durasi</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F1EF]">
                {filteredMovies.map((m) => {
                  const cfg = STATUS_CONFIG[m.status];
                  return (
                    <tr key={m.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 font-semibold text-[#2F3437]">
                        <div
                          onClick={() => handleEdit(m)}
                          className="cursor-pointer hover:text-blue-600 flex items-center gap-2"
                        >
                          <span>{m.title}</span>
                          <span className="text-[10px] text-neutral-400 font-normal">
                            ({m.releaseYear})
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{m.type}</td>
                      <td className="py-3 px-4 font-medium">{m.platform}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-500">{m.currentProgress || '—'}</td>
                      <td className="py-3 px-4 font-bold text-amber-600">
                        {m.rating ? `⭐ ${m.rating}/5` : '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(m)}
                            className="p-1 text-neutral-400 hover:text-neutral-800"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMovie(m.id)}
                            className="p-1 text-neutral-400 hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Add / Edit Movie */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="p-4 sm:px-6 border-b border-[#E9E9E7] flex items-center justify-between bg-[#FAF9F6]">
              <h3 className="text-sm font-bold text-[#2F3437]">
                {editingId ? 'Edit Film / Serial' : 'Tambah Film / Serial Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Judul Film / Serial *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Dune: Part Two"
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Tahun Rilis
                  </label>
                  <input
                    type="number"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(Number(e.target.value))}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Format
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as MovieFormatType)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {FORMAT_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Status Tonton
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as MovieWatchStatus)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {(Object.keys(STATUS_CONFIG) as MovieWatchStatus[]).map((st) => (
                      <option key={st} value={st}>
                        {STATUS_CONFIG[st].label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Platform Streaming
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as StreamingPlatform)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-2"
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Sutradara / Kreator
                  </label>
                  <input
                    type="text"
                    value={directorOrCreator}
                    onChange={(e) => setDirectorOrCreator(e.target.value)}
                    placeholder="Christopher Nolan"
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Progres Episode / Durasi
                  </label>
                  <input
                    type="text"
                    value={currentProgress}
                    onChange={(e) => setCurrentProgress(e.target.value)}
                    placeholder="S1 E5 / 10 atau 148 min"
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Rating (1 - 5 Bintang)
                  </label>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                  Ulasan & Catatan Pribadi
                </label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Tuliskan kesan, kutipan dialog favorit, atau alasan ingin menonton..."
                  className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg p-3"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    Genre
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={genreInput}
                      onChange={(e) => setGenreInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddGenre();
                        }
                      }}
                      placeholder="Sci-Fi, Drama..."
                      className="flex-1 text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5"
                    />
                    <button
                      type="button"
                      onClick={handleAddGenre}
                      className="px-2.5 py-1.5 text-xs bg-neutral-100 rounded-lg font-medium"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-1 flex-wrap mt-1.5">
                    {genres.map((g) => (
                      <span
                        key={g}
                        className="bg-neutral-100 text-neutral-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
                      >
                        {g}
                        <button
                          type="button"
                          onClick={() => setGenres(genres.filter((x) => x !== g))}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase block mb-1">
                    URL Poster / Cover (Opsional)
                  </label>
                  <input
                    type="url"
                    value={posterUrl}
                    onChange={(e) => setPosterUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E9E9E7]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg"
                >
                  Simpan Tontonan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
