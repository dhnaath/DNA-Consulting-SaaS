import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { DetailedJournalEntry, JournalMood, JournalWeather } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Calendar,
  Sparkles,
  Heart,
  Sun,
  Cloud,
  CloudRain,
  Moon,
  Smile,
  Compass,
  Zap,
  Coffee,
  CloudSun,
  LayoutList,
  Grid,
  Table as TableIcon,
  Tag,
  Star,
  Edit3,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Quote,
  Share2,
  Image,
} from 'lucide-react';

const MOOD_OPTIONS: {
  value: JournalMood;
  label: string;
  emoji: string;
  color: string;
  bg: string;
  border: string;
}[] = [
  {
    value: 'Sangat Bahagia 😊',
    label: 'Sangat Bahagia',
    emoji: '😊',
    color: 'text-amber-800',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  {
    value: 'Tenang & Bersyukur 🌿',
    label: 'Tenang & Bersyukur',
    emoji: '🌿',
    color: 'text-emerald-800',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  {
    value: 'Produktif ⚡',
    label: 'Produktif',
    emoji: '⚡',
    color: 'text-blue-800',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    value: 'Biasa Saja ☕',
    label: 'Biasa Saja',
    emoji: '☕',
    color: 'text-stone-800',
    bg: 'bg-stone-50',
    border: 'border-stone-200',
  },
  {
    value: 'Reflektif & Meditatif 🌙',
    label: 'Reflektif & Meditatif',
    emoji: '🌙',
    color: 'text-purple-800',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    value: 'Lelah / Butuh Rehat 🌧️',
    label: 'Lelah / Rehat',
    emoji: '🌧️',
    color: 'text-rose-800',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
  },
];

const WEATHER_OPTIONS: { value: JournalWeather; label: string; icon: React.ElementType }[] = [
  { value: 'Cerah ☀️', label: 'Cerah', icon: Sun },
  { value: 'Berawan ⛅', label: 'Berawan', icon: CloudSun },
  { value: 'Hujan Sejuk 🌧️', label: 'Hujan Sejuk', icon: CloudRain },
  { value: 'Malam Berbintang 🌌', label: 'Malam Berbintang', icon: Moon },
];

const INSPIRATIONAL_QUOTES = [
  {
    quote: 'Kita tidak naik ke tingkat harapan kita, melainkan jatuh ke tingkat persiapan dan kebiasaan kita.',
    author: 'Archilochus',
  },
  {
    quote: 'Bersyukurlah atas hal-hal kecil hari ini; kelak ketika menoleh ke belakang, kamu akan sadar itu adalah hal-hal besar.',
    author: 'Robert Brault',
  },
  {
    quote: 'Ketenangan batin bermula saat kamu memilih untuk tidak membiarkan orang atau peristiwa lain mengendalikan emosimu.',
    author: 'Pema Chödrön',
  },
  {
    quote: 'Hampir semua hal akan kembali berfungsi dengan baik jika dicabut kabelnya selama beberapa menit, termasuk dirimu.',
    author: 'Anne Lamott',
  },
  {
    quote: 'Fokus bukan tentang berkata ya pada hal yang ingin kamu kerjakan, melainkan berani berkata tidak pada ratusan ide bagus lainnya.',
    author: 'Steve Jobs',
  },
];

export const JournalView: React.FC = () => {
  const {
    detailedJournals,
    addDetailedJournal,
    updateDetailedJournal,
    deleteDetailedJournal,
    toggleFavoriteJournal,
  } = useLifeOS();

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'gratitude' | 'table'>('timeline');

  // Calendar State
  const [currentCalendarDate, setCurrentCalendarDate] = useState(() => new Date(2026, 2, 1)); // March 2026 default

  // Daily Quote Rotation
  const [quoteIndex, setQuoteIndex] = useState(0);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editorDate, setEditorDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorMood, setEditorMood] = useState<JournalMood>('Tenang & Bersyukur 🌿');
  const [editorWeather, setEditorWeather] = useState<JournalWeather>('Cerah ☀️');
  const [editorHighlight, setEditorHighlight] = useState('');
  const [editorGratitude1, setEditorGratitude1] = useState('');
  const [editorGratitude2, setEditorGratitude2] = useState('');
  const [editorGratitude3, setEditorGratitude3] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [editorPhotoUrl, setEditorPhotoUrl] = useState('');
  const [editorFavorite, setEditorFavorite] = useState(false);

  // All distinct tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    detailedJournals.forEach((j) => j.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [detailedJournals]);

  // Filtered journals
  const filteredJournals = useMemo(() => {
    return detailedJournals
      .filter((j) => {
        if (selectedMoodFilter !== 'all' && j.mood !== selectedMoodFilter) return false;
        if (showFavoritesOnly && !j.favorite) return false;
        if (selectedTagFilter && !j.tags?.includes(selectedTagFilter)) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const inTitle = j.title.toLowerCase().includes(q);
          const inContent = j.content.toLowerCase().includes(q);
          const inHighlight = (j.highlightOfDay || '').toLowerCase().includes(q);
          const inGratitude = j.gratitude?.some((g) => g.toLowerCase().includes(q));
          const inTags = j.tags?.some((t) => t.toLowerCase().includes(q));
          if (!inTitle && !inContent && !inHighlight && !inGratitude && !inTags) return false;
        }
        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [detailedJournals, selectedMoodFilter, showFavoritesOnly, selectedTagFilter, searchQuery]);

  // KPI Calculations
  const totalEntries = detailedJournals.length;

  const totalGratitudeCount = useMemo(() => {
    return detailedJournals.reduce((sum, j) => sum + (j.gratitude?.length || 0), 0);
  }, [detailedJournals]);

  const dominantMood = useMemo(() => {
    if (detailedJournals.length === 0) return 'Tenang 🌿';
    const counts: Record<string, number> = {};
    detailedJournals.forEach((j) => {
      counts[j.mood] = (counts[j.mood] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0] ? sorted[0][0] : 'Tenang 🌿';
  }, [detailedJournals]);

  // Open Editor for New Journal
  const handleOpenNew = (mode: 'default' | 'morning' | 'evening' = 'default') => {
    const today = new Date().toISOString().split('T')[0];
    setEditingEntryId(null);
    setEditorDate(today);
    setEditorFavorite(false);
    setEditorPhotoUrl('');

    if (mode === 'morning') {
      setEditorTitle('Pagi yang Menenangkan: Niat & Syukur');
      setEditorMood('Tenang & Bersyukur 🌿');
      setEditorWeather('Cerah ☀️');
      setEditorHighlight('');
      setEditorGratitude1('Kesehatan fisik dan bangun pagi tanpa rasa terburu-buru.');
      setEditorGratitude2('Secangkir kopi hangat dan ketenangan sebelum memulai aktivitas.');
      setEditorGratitude3('Kesempatan untuk menyelesaikan satu tugas penting hari ini.');
      setEditorContent(
        'Niat dan fokus utamaku hari ini adalah:\n1. Menyelesaikan target utama dengan penuh konsentrasi.\n2. Menjaga komunikasi yang ramah dan suportif.\n3. Beristirahat cukup saat jam makan siang.'
      );
      setEditorTags(['Pagi', 'Mindfulness', 'Niat Harian']);
    } else if (mode === 'evening') {
      setEditorTitle('Refleksi Senja: Evaluasi Hari & Kemenangan');
      setEditorMood('Reflektif & Meditatif 🌙');
      setEditorWeather('Malam Berbintang 🌌');
      setEditorHighlight('Menyelesaikan seluruh target tanpa distracted media sosial.');
      setEditorGratitude1('Dukungan rekan kerja dan kelancaran pekerjaan.');
      setEditorGratitude2('Makan malam lezat bersama orang terdekat.');
      setEditorGratitude3('Malam yang damai untuk beristirahat.');
      setEditorContent(
        'Pelajaran yang aku petik dari peristiwa hari ini:\n- Jangan terlalu membebani diri dengan ekspektasi yang tidak realistis.\n- Istirahat bukanlah tanda kelemahan, melainkan bagian dari produktivitas berkesinambungan.'
      );
      setEditorTags(['Malam', 'Refleksi', 'Evaluasi']);
    } else {
      setEditorTitle('');
      setEditorMood('Tenang & Bersyukur 🌿');
      setEditorWeather('Cerah ☀️');
      setEditorHighlight('');
      setEditorGratitude1('');
      setEditorGratitude2('');
      setEditorGratitude3('');
      setEditorContent('');
      setEditorTags(['Refleksi']);
    }

    setIsEditorOpen(true);
  };

  // Open Editor for Existing Entry
  const handleEditEntry = (entry: DetailedJournalEntry) => {
    setEditingEntryId(entry.id);
    setEditorDate(entry.date);
    setEditorTitle(entry.title);
    setEditorMood(entry.mood);
    setEditorWeather(entry.weather || 'Cerah ☀️');
    setEditorHighlight(entry.highlightOfDay || '');
    setEditorGratitude1(entry.gratitude?.[0] || '');
    setEditorGratitude2(entry.gratitude?.[1] || '');
    setEditorGratitude3(entry.gratitude?.[2] || '');
    setEditorContent(entry.content);
    setEditorTags(entry.tags || []);
    setEditorPhotoUrl(entry.photoUrl || '');
    setEditorFavorite(!!entry.favorite);
    setIsEditorOpen(true);
  };

  // Save Entry
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorTitle.trim() || !editorContent.trim()) return;

    const gratitudeList = [editorGratitude1, editorGratitude2, editorGratitude3]
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    const payload: Omit<DetailedJournalEntry, 'id'> = {
      date: editorDate,
      title: editorTitle.trim(),
      content: editorContent.trim(),
      mood: editorMood,
      weather: editorWeather,
      highlightOfDay: editorHighlight.trim() || undefined,
      gratitude: gratitudeList,
      tags: editorTags,
      photoUrl: editorPhotoUrl.trim() || undefined,
      favorite: editorFavorite,
    };

    if (editingEntryId) {
      updateDetailedJournal(editingEntryId, payload);
    } else {
      addDetailedJournal(payload);
    }

    setIsEditorOpen(false);
  };

  // Add Tag
  const handleAddTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !editorTags.includes(trimmed)) {
      setEditorTags([...editorTags, trimmed]);
      setTagInput('');
    }
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setEditorTags(editorTags.filter((t) => t !== tagToRemove));
  };

  // Calendar Helpers (March 2026)
  const calendarDays = useMemo(() => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const mStr = String(month).padStart(2, '0');
      days.push({
        dateStr: `${year}-${mStr}-${String(d).padStart(2, '0')}`,
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const mStr = String(month + 1).padStart(2, '0');
      const dStr = String(d).padStart(2, '0');
      days.push({
        dateStr: `${year}-${mStr}-${dStr}`,
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    return days;
  }, [currentCalendarDate]);

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner - Notion LifeCanvas Journal */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-emerald-50/60 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
              📖
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2F3437] tracking-tight">
                  Journal by LifeCanvas
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100/70 text-emerald-800">
                  Mindful Reflection
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
                Refleksi harian penuh kesadaran, pencatatan rasa syukur (gratitude log), pemantauan
                suasana hati (mood tracker), dan kemenangan personal setiap hari.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleOpenNew('morning')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors shadow-2xs"
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>☀️ Refleksi Pagi</span>
            </button>

            <button
              onClick={() => handleOpenNew('evening')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-800 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors shadow-2xs"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-600" />
              <span>🌙 Refleksi Malam</span>
            </button>

            <button
              onClick={() => handleOpenNew('default')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg shadow-sm transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Jurnal Baru</span>
            </button>
          </div>
        </div>

        {/* Top KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#F1F1EF]">
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Total Jurnal</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-[#2F3437]">{totalEntries}</span>
              <span className="text-[11px] text-neutral-400">entri refleksi</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Rasa Syukur Tercatat</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-emerald-700">✨ {totalGratitudeCount}</span>
              <span className="text-[11px] text-neutral-400">momen bersyukur</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Konsistensi Jurnal</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-amber-700">🔥 7 Hari</span>
              <span className="text-[11px] text-neutral-400">streak aktif</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Mood Dominan</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-sm sm:text-base font-bold text-[#2F3437] truncate">
                {dominantMood}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inspirational Quote of the Day Card */}
      <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white border border-[#E9E9E7] text-neutral-400 shrink-0">
            <Quote className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-neutral-700 italic leading-relaxed">
              "{INSPIRATIONAL_QUOTES[quoteIndex].quote}"
            </p>
            <span className="text-[11px] font-semibold text-neutral-400 mt-1 block">
              — {INSPIRATIONAL_QUOTES[quoteIndex].author}
            </span>
          </div>
        </div>

        <button
          onClick={() => setQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length)}
          className="text-[11px] font-semibold text-neutral-500 hover:text-black px-2.5 py-1.5 bg-white border border-[#E9E9E7] rounded-lg shadow-2xs transition-colors shrink-0"
        >
          Ganti Kutipan
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-4 shadow-sm space-y-4">
        {/* Mood filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedMoodFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              selectedMoodFilter === 'all'
                ? 'bg-[#2F3437] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            Semua Mood ({detailedJournals.length})
          </button>

          {MOOD_OPTIONS.map((mood) => {
            const count = detailedJournals.filter((j) => j.mood === mood.value).length;
            const isSelected = selectedMoodFilter === mood.value;

            return (
              <button
                key={mood.value}
                onClick={() => setSelectedMoodFilter(mood.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#2F3437] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>{mood.emoji}</span>
                <span>{mood.label}</span>
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

        {/* Second row: Search, favorite filter, view switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F1F1EF]">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kata kunci, rasa syukur, atau momen..."
                className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:bg-white"
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

            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors shrink-0 ${
                showFavoritesOnly
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-[#E9E9E7] text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  showFavoritesOnly ? 'text-amber-600 fill-amber-600' : 'text-neutral-400'
                }`}
              />
              <span className="hidden sm:inline">Favorit</span>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg border border-[#E9E9E7] self-end sm:self-auto shrink-0">
            <button
              onClick={() => setViewMode('timeline')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'timeline'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Kalender</span>
            </button>
            <button
              onClick={() => setViewMode('gratitude')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'gratitude'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Gratitude Wall</span>
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

        {/* Active Tag Filters Bar if tags exist */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#F1F1EF] text-xs text-neutral-500">
            <span className="text-[11px] font-medium text-neutral-400">Tag:</span>
            {selectedTagFilter && (
              <button
                onClick={() => setSelectedTagFilter(null)}
                className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 font-medium flex items-center gap-1"
              >
                <span>Hapus Filter Tag</span>
                <X className="w-3 h-3" />
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? null : tag)}
                className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                  selectedTagFilter === tag
                    ? 'bg-[#2F3437] text-white font-medium'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View 1: Timeline / Feed Cards */}
      {viewMode === 'timeline' && (
        <div className="space-y-4">
          {filteredJournals.length > 0 ? (
            filteredJournals.map((entry) => (
              <JournalCard
                key={entry.id}
                entry={entry}
                onEdit={() => handleEditEntry(entry)}
                onToggleFavorite={() => toggleFavoriteJournal(entry.id)}
                onDelete={() => deleteDetailedJournal(entry.id)}
              />
            ))
          ) : (
            <div className="bg-white border border-[#E9E9E7] rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-xl">
                📖
              </div>
              <h3 className="text-sm font-bold text-neutral-800">Tidak ada entri jurnal yang cocok</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Mulai luangkan waktu sejenak untuk menulis refleksi harian dan rasa syukurmu hari ini.
              </p>
              <button
                onClick={() => handleOpenNew('default')}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2F3437] rounded-lg hover:bg-black transition-all inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tulis Jurnal Hari Ini</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* View 2: Monthly Calendar View */}
      {viewMode === 'calendar' && (
        <div className="bg-white border border-[#E9E9E7] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-bold text-[#2F3437]">
                {currentCalendarDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setCurrentCalendarDate(
                    new Date(
                      currentCalendarDate.getFullYear(),
                      currentCalendarDate.getMonth() - 1,
                      1
                    )
                  )
                }
                className="p-1.5 rounded-lg border border-[#E9E9E7] text-neutral-600 hover:bg-neutral-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentCalendarDate(new Date(2026, 2, 1))}
                className="px-2.5 py-1 text-xs font-medium rounded-lg border border-[#E9E9E7] text-neutral-600 hover:bg-neutral-50"
              >
                Maret 2026
              </button>
              <button
                onClick={() =>
                  setCurrentCalendarDate(
                    new Date(
                      currentCalendarDate.getFullYear(),
                      currentCalendarDate.getMonth() + 1,
                      1
                    )
                  )
                }
                className="p-1.5 rounded-lg border border-[#E9E9E7] text-neutral-600 hover:bg-neutral-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-semibold text-neutral-400 py-1 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((calDay, idx) => {
              const entriesOnThisDay = detailedJournals.filter((j) => j.date === calDay.dateStr);
              const hasEntries = entriesOnThisDay.length > 0;

              return (
                <div
                  key={idx}
                  onClick={() => {
                    if (hasEntries) {
                      handleEditEntry(entriesOnThisDay[0]);
                    } else if (calDay.isCurrentMonth) {
                      setEditorDate(calDay.dateStr);
                      handleOpenNew('default');
                    }
                  }}
                  className={`min-h-[85px] p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer ${
                    !calDay.isCurrentMonth
                      ? 'bg-neutral-50/40 border-neutral-100 text-neutral-300 opacity-60'
                      : hasEntries
                      ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 hover:shadow-xs'
                      : 'bg-white border-[#E9E9E7] hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span
                      className={`font-semibold ${
                        hasEntries ? 'text-emerald-900 font-bold' : 'text-neutral-700'
                      }`}
                    >
                      {calDay.dayNum}
                    </span>
                    {hasEntries && (
                      <span className="text-xs">
                        {entriesOnThisDay[0].mood.split(' ')[1] || '🌿'}
                      </span>
                    )}
                  </div>

                  {hasEntries ? (
                    <div className="space-y-1">
                      <p className="text-[10px] text-emerald-950 font-medium line-clamp-1">
                        {entriesOnThisDay[0].title}
                      </p>
                      {entriesOnThisDay[0].gratitude?.length > 0 && (
                        <span className="text-[9px] text-emerald-800 bg-emerald-100/70 px-1 py-0.2 rounded font-medium inline-block truncate max-w-full">
                          ✨ {entriesOnThisDay[0].gratitude[0]}
                        </span>
                      )}
                    </div>
                  ) : calDay.isCurrentMonth ? (
                    <span className="text-[10px] text-neutral-300 self-center opacity-0 hover:opacity-100 transition-opacity">
                      + Tulis
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* View 3: Gratitude Wall */}
      {viewMode === 'gratitude' && (
        <div className="space-y-4">
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-amber-900">
                  Dinding Rasa Syukur (Gratitude Wall)
                </h3>
                <p className="text-[11px] text-amber-800/80">
                  Semua momen bahagia dan berkah kecil yang telah kamu abadikan dari waktu ke waktu.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full shrink-0">
              ✨ {totalGratitudeCount} Hal Disyukuri
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailedJournals.flatMap((j) =>
              (j.gratitude || []).map((item, gIdx) => (
                <div
                  key={`${j.id}-${gIdx}`}
                  onClick={() => handleEditEntry(j)}
                  className="bg-white border border-[#E9E9E7] hover:border-amber-300 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {j.date}
                      </span>
                      <span>{j.mood.split(' ')[0]}</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-neutral-800 leading-relaxed group-hover:text-amber-900 transition-colors">
                      "{item}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F1F1EF] flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="truncate max-w-[180px] font-medium text-neutral-600">
                      Dari: {j.title}
                    </span>
                    <span className="text-amber-600">✨ Syukur #{gIdx + 1}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* View 4: Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-[#E9E9E7] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-[#FAF9F6] text-neutral-500 border-b border-[#E9E9E7] font-semibold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Fav</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Judul Refleksi</th>
                  <th className="py-3 px-4">Suasana Hati (Mood)</th>
                  <th className="py-3 px-4">Cuaca</th>
                  <th className="py-3 px-4">Highlight Hari Ini</th>
                  <th className="py-3 px-4">Rasa Syukur</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F1EF]">
                {filteredJournals.map((entry) => (
                  <tr key={entry.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleFavoriteJournal(entry.id)}
                        className={`transition-colors ${
                          entry.favorite
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-neutral-300 hover:text-amber-500'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${entry.favorite ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-neutral-800">
                      {entry.date}
                    </td>
                    <td className="py-3 px-4">
                      <div
                        onClick={() => handleEditEntry(entry)}
                        className="font-semibold text-neutral-800 hover:text-blue-600 cursor-pointer line-clamp-1"
                      >
                        {entry.title}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-medium">
                        {entry.mood}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-neutral-500">
                      {entry.weather || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="line-clamp-1 text-neutral-600">
                        {entry.highlightOfDay || '—'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-neutral-500">
                      ✨ {entry.gratitude?.length || 0} poin
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleEditEntry(entry)}
                          className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteDetailedJournal(entry.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Journal Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
            {/* Modal Top Bar */}
            <div className="p-4 sm:px-6 border-b border-[#E9E9E7] flex items-center justify-between gap-4 bg-[#FAF9F6]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="text-sm font-bold text-[#2F3437]">
                    {editingEntryId ? 'Edit Jurnal' : 'Tulis Entri Jurnal Baru'}
                  </h3>
                  <span className="text-[11px] text-neutral-400">
                    Abadikan pemikiran, rasa syukur, dan evaluasi harian
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorFavorite(!editorFavorite)}
                  className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                    editorFavorite
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'bg-white border-[#E9E9E7] text-neutral-500 hover:bg-neutral-100'
                  }`}
                  title="Simpan ke favorit"
                >
                  <Star className={`w-3.5 h-3.5 ${editorFavorite ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span className="hidden sm:inline">Favorit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEntry} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Date & Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    Tanggal Jurnal
                  </label>
                  <input
                    type="date"
                    required
                    value={editorDate}
                    onChange={(e) => setEditorDate(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    Judul Entri Hari Ini
                  </label>
                  <input
                    type="text"
                    required
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    placeholder="Contoh: Pagi yang Tenang, Kopi, dan Kanvas Bersih..."
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400 font-medium"
                  />
                </div>
              </div>

              {/* Mood & Weather Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-neutral-50/70 border border-[#E9E9E7] rounded-xl">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                    Suasana Hati (Mood)
                  </label>
                  <select
                    value={editorMood}
                    onChange={(e) => setEditorMood(e.target.value as JournalMood)}
                    className="w-full text-xs bg-white border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  >
                    {MOOD_OPTIONS.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.value}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1.5">
                    Cuaca & Suasana Lingkungan
                  </label>
                  <select
                    value={editorWeather}
                    onChange={(e) => setEditorWeather(e.target.value as JournalWeather)}
                    className="w-full text-xs bg-white border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  >
                    {WEATHER_OPTIONS.map((w) => (
                      <option key={w.value} value={w.value}>
                        {w.value}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Highlight of the Day */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>Highlight Utama Hari Ini (The Win of The Day)</span>
                </label>
                <input
                  type="text"
                  value={editorHighlight}
                  onChange={(e) => setEditorHighlight(e.target.value)}
                  placeholder="Kemenangan kecil, momen menyenangkan, atau pencapaian hari ini..."
                  className="w-full text-xs bg-amber-50/40 border border-amber-200 rounded-lg px-3 py-2 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:bg-white"
                />
              </div>

              {/* 3 Gratitude Prompts */}
              <div className="space-y-2 p-3 bg-emerald-50/40 border border-emerald-200 rounded-xl">
                <label className="text-[11px] font-semibold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>3 Hal yang Kamu Syukuri Hari Ini (Gratitude Log)</span>
                </label>
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={editorGratitude1}
                    onChange={(e) => setEditorGratitude1(e.target.value)}
                    placeholder="1. Hal pertama yang kamu syukuri..."
                    className="w-full text-xs bg-white border border-emerald-200 rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <input
                    type="text"
                    value={editorGratitude2}
                    onChange={(e) => setEditorGratitude2(e.target.value)}
                    placeholder="2. Hal kedua yang kamu syukuri..."
                    className="w-full text-xs bg-white border border-emerald-200 rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                  <input
                    type="text"
                    value={editorGratitude3}
                    onChange={(e) => setEditorGratitude3(e.target.value)}
                    placeholder="3. Hal ketiga yang kamu syukuri..."
                    className="w-full text-xs bg-white border border-emerald-200 rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>

              {/* Full Journal Content */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
                  Refleksi Mendalam & Catatan Lengkap
                </label>
                <textarea
                  required
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  placeholder="Tuangkan apa yang kamu rasakan, pengalaman berharga, atau cerita perjalanan hari ini..."
                  rows={6}
                  className="w-full p-3 text-xs sm:text-sm bg-neutral-50/50 border border-[#E9E9E7] rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:bg-white resize-y leading-relaxed"
                />
              </div>

              {/* Tags & Optional Photo URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#F1F1EF]">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    Label / Tag
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Tambah tag lalu Enter..."
                      className="flex-1 text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2.5 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium"
                    >
                      +
                    </button>
                  </div>
                  {editorTags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap mt-1.5">
                      {editorTags.map((t) => (
                        <span
                          key={t}
                          className="bg-neutral-100 text-neutral-700 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1"
                        >
                          #{t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="text-neutral-400 hover:text-red-500"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    URL Foto / Memori Visual (Opsional)
                  </label>
                  <input
                    type="url"
                    value={editorPhotoUrl}
                    onChange={(e) => setEditorPhotoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E9E9E7]">
                {editingEntryId ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Hapus entri jurnal ini?')) {
                        deleteDetailedJournal(editingEntryId);
                        setIsEditorOpen(false);
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 transition-colors"
                  >
                    Hapus Entri
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(false)}
                    className="px-3.5 py-2 text-xs font-medium text-neutral-600 hover:text-black bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg shadow-sm transition-all"
                  >
                    {editingEntryId ? 'Simpan Perubahan' : 'Terbitkan Jurnal'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component: Journal Timeline Card
interface JournalCardProps {
  entry: DetailedJournalEntry;
  onEdit: () => void;
  onToggleFavorite: () => void;
  onDelete: () => void;
}

const JournalCard: React.FC<JournalCardProps> = ({
  entry,
  onEdit,
  onToggleFavorite,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white border border-[#E9E9E7] hover:border-neutral-300 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all space-y-4">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F1EF]">
        <div className="flex items-center gap-3">
          <div className="text-center px-3 py-1.5 rounded-xl bg-neutral-50 border border-[#E9E9E7] shrink-0">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
              {new Date(entry.date).toLocaleDateString('id-ID', { month: 'short' })}
            </span>
            <span className="text-lg font-extrabold text-[#2F3437] leading-none">
              {new Date(entry.date).getDate()}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                {entry.mood}
              </span>
              {entry.weather && (
                <span className="text-[11px] text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                  {entry.weather}
                </span>
              )}
            </div>
            <h3
              onClick={onEdit}
              className="text-base font-bold text-[#2F3437] hover:text-blue-600 transition-colors cursor-pointer mt-1"
            >
              {entry.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1 self-end sm:self-auto">
          <button
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-lg border transition-colors ${
              entry.favorite
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-white border-[#E9E9E7] text-neutral-400 hover:text-amber-500'
            }`}
            title={entry.favorite ? 'Hapus dari favorit' : 'Tandai favorit'}
          >
            <Star className={`w-3.5 h-3.5 ${entry.favorite ? 'fill-amber-500' : ''}`} />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg border border-[#E9E9E7] text-neutral-500 hover:text-black hover:bg-neutral-50 transition-colors"
            title="Edit jurnal"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (confirm('Hapus entri jurnal ini?')) onDelete();
            }}
            className="p-1.5 rounded-lg border border-[#E9E9E7] text-neutral-500 hover:text-red-600 hover:bg-neutral-50 transition-colors"
            title="Hapus jurnal"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Highlight of the Day banner */}
      {entry.highlightOfDay && (
        <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
          <Star className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0 mt-0.5" />
          <div>
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
              Highlight of The Day
            </span>
            <p className="text-xs font-semibold text-neutral-800 mt-0.5">
              {entry.highlightOfDay}
            </p>
          </div>
        </div>
      )}

      {/* 3 Gratitude points */}
      {entry.gratitude && entry.gratitude.length > 0 && (
        <div className="space-y-1.5 p-3.5 bg-emerald-50/40 border border-emerald-200/70 rounded-xl">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-900 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Momen yang Disyukuri</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            {entry.gratitude.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/90 border border-emerald-200 rounded-lg p-2 text-xs text-neutral-700 leading-snug shadow-2xs"
              >
                <span className="font-bold text-emerald-800 text-[10px] block mb-0.5">
                  #{idx + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Journal Content Narrative */}
      <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-2">
        <p className={isExpanded ? '' : 'line-clamp-3'}>{entry.content}</p>
        {entry.content.length > 180 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] font-semibold text-neutral-500 hover:text-black underline underline-offset-2"
          >
            {isExpanded ? 'Tutup sebagian' : 'Baca selengkapnya...'}
          </button>
        )}
      </div>

      {/* Photo Attachment if present */}
      {entry.photoUrl && (
        <div className="rounded-xl overflow-hidden max-h-56 border border-[#E9E9E7]">
          <img
            src={entry.photoUrl}
            alt={entry.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Card Footer: Tags */}
      {entry.tags && entry.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#F1F1EF]">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
