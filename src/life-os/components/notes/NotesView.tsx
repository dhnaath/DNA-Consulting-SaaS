import React, { useState, useMemo, useEffect } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { NoteItem, NoteNotebook } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Pin,
  Folder,
  Tag,
  Clock,
  LayoutGrid,
  Table as TableIcon,
  FolderOpen,
  Edit3,
  Trash2,
  Copy,
  ExternalLink,
  CheckSquare,
  Sparkles,
  BookOpen,
  Briefcase,
  User,
  Lightbulb,
  Code,
  X,
  Check,
  ChevronDown,
  FileCode,
  StickyNote,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  Quote,
} from 'lucide-react';

const NOTEBOOK_CONFIG: Record<
  NoteNotebook,
  { icon: React.ElementType; color: string; bg: string; border: string; desc: string }
> = {
  'Kerja & Proyek': {
    icon: Briefcase,
    color: 'text-blue-700',
    bg: 'bg-blue-50/70',
    border: 'border-blue-200',
    desc: 'Dokumentasi pekerjaan, rencana proyek, spesifikasi fitur, dan hasil rapat.',
  },
  'Pribadi & Hidup': {
    icon: User,
    color: 'text-emerald-700',
    bg: 'bg-emerald-50/70',
    border: 'border-emerald-200',
    desc: 'Prinsip hidup, tujuan personal, kebiasaan, dan catatan refleksi non-jurnal.',
  },
  'Buku & Pembelajaran': {
    icon: BookOpen,
    color: 'text-amber-700',
    bg: 'bg-amber-50/70',
    border: 'border-amber-200',
    desc: 'Ringkasan buku, intisari materi kursus, webinar, dan wawasan baru.',
  },
  'Ide & Inspirasi': {
    icon: Lightbulb,
    color: 'text-purple-700',
    bg: 'bg-purple-50/70',
    border: 'border-purple-200',
    desc: 'Brainstorming produk digital, ide kreatif, artikel blog, dan eksperimen.',
  },
  'Teknologi & Referensi': {
    icon: Code,
    color: 'text-indigo-700',
    bg: 'bg-indigo-50/70',
    border: 'border-indigo-200',
    desc: 'Cheatsheet shortcut, panduan konfigurasi tools, dan dokumentasi arsitektur.',
  },
};

const NOTE_TEMPLATES = [
  {
    name: '📋 Rapat & Diskusi (Meeting Notes)',
    title: 'Catatan Rapat: [Topik / Proyek]',
    notebook: 'Kerja & Proyek' as NoteNotebook,
    tags: ['Meeting', 'Kerja', 'Action Items'],
    content: `## 📌 Agenda & Peserta
- **Tanggal & Waktu:** ${new Date().toISOString().split('T')[0]}
- **Peserta:** 
- **Tujuan Pertemuan:** 

## 💬 Poin Diskusi Utama
1. 
2. 
3. 

## 🎯 Keputusan yang Diambil
- Keputusan 1: 
- Keputusan 2: 

## ✅ Daftar Tindakan (Action Items)
- [ ] Tindakan A — PIC: @nama (Deadline: )
- [ ] Tindakan B — PIC: @nama (Deadline: )
- [ ] Tindakan C — PIC: @nama (Deadline: )`,
  },
  {
    name: '📖 Ringkasan Buku (Book Summary)',
    title: 'Ringkasan Buku: [Judul Buku] — [Penulis]',
    notebook: 'Buku & Pembelajaran' as NoteNotebook,
    tags: ['Buku', 'Self-Development', 'Insights'],
    content: `## 📚 Informasi Buku
- **Penulis:** 
- **Tahun Terbit / Kategori:** 
- **Rating Pribadi:** ⭐⭐⭐⭐⭐

## 💡 Ide Inti (The Big Idea)
> Tuliskan satu atau dua kalimat yang merangkum pesan utama buku ini.

## 🔑 3 Pelajaran Terpenting
1. **Prinsip 1:** Penjelasan singkat...
2. **Prinsip 2:** Penjelasan singkat...
3. **Prinsip 3:** Penjelasan singkat...

## 💬 Kutipan Favorit (Memorable Quotes)
> "Kutipan inspiratif nomor satu dari buku."

## 🚀 Rencana Aksi Nyata (Actionable Takeaway)
- [ ] Terapkan kebiasaan baru ini dalam 7 hari ke depan: ...`,
  },
  {
    name: '💡 Brainstorming Ide Produk (Idea Canvas)',
    title: 'Eksplorasi Ide: [Nama Ide / Konsep]',
    notebook: 'Ide & Inspirasi' as NoteNotebook,
    tags: ['Brainstorming', 'Inovasi', 'Roadmap'],
    content: `## 🎯 Masalah yang Ingin Diselesaikan
Apa rasa sakit utama yang dialami pengguna target? Mengapa solusi yang ada saat ini belum memuaskan?

## 💡 Solusi yang Ditawarkan
Deskripsi fitur utama dan value proposition yang unik.

## ⚖️ Analisis Kelebihan & Tantangan
- **Kelebihan (Pros):**
  - Cepat dieksekusi
  - Kebutuhan pasar jelas
- **Tantangan (Cons):**
  - Membutuhkan waktu riset lebih dalam

## 🚀 Langkah Eksperimen Pertama (MVP)
- [ ] Buat mockup antarmuka atau landing page sederhana
- [ ] Dapatkan feedback dari 5 calon pengguna potensial
- [ ] Tentukan metrik validasi awal`,
  },
  {
    name: '💻 Cheatsheet & Dokumentasi Teknis',
    title: 'Cheatsheet: [Bahasa / Framework / Tool]',
    notebook: 'Teknologi & Referensi' as NoteNotebook,
    tags: ['Developer', 'Setup', 'Reference'],
    content: `## 🚀 Perintah Dasar & Shortcut Cepat
- \`npm run dev\`: Menjalankan server lokal
- \`npm run build\`: Membangun aset produksi

## ⚙️ Konfigurasi Standar
\`\`\`bash
# Setup instruksi cepat
git checkout -b feature/nama-fitur
\`\`\`

## 🔍 Catatan & Solusi Error Sering Terjadi
1. **Isu A:** Solusi cepatnya adalah...
2. **Isu B:** Pastikan environment variable sudah didefinisikan di .env.local`,
  },
];

export const NotesView: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, togglePinNote } = useLifeOS();

  // Filters & State
  const [selectedNotebook, setSelectedNotebook] = useState<NoteNotebook | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'gallery' | 'table' | 'notebooks'>('gallery');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  // Scratchpad quick state
  const [showScratchpad, setShowScratchpad] = useState(true);
  const [scratchpadText, setScratchpadText] = useState(() => {
    return localStorage.getItem('lifecanvas_quick_scratchpad') || '';
  });
  const [scratchpadCopied, setScratchpadCopied] = useState(false);

  useEffect(() => {
    localStorage.setItem('lifecanvas_quick_scratchpad', scratchpadText);
  }, [scratchpadText]);

  // Modal Note Editor state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [editorNotebook, setEditorNotebook] = useState<NoteNotebook>('Kerja & Proyek');
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [editorIsPinned, setEditorIsPinned] = useState(false);
  const [editorIcon, setEditorIcon] = useState('📝');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // All distinct tags
  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [notes]);

  // Filtered notes
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (selectedNotebook !== 'all' && n.notebook !== selectedNotebook) return false;
      if (showPinnedOnly && !n.isPinned) return false;
      if (selectedTag && !n.tags?.includes(selectedTag)) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = n.title.toLowerCase().includes(q);
        const inContent = n.content.toLowerCase().includes(q);
        const inTags = n.tags?.some((t) => t.toLowerCase().includes(q));
        const inNotebook = n.notebook.toLowerCase().includes(q);
        if (!inTitle && !inContent && !inTags && !inNotebook) return false;
      }
      return true;
    });
  }, [notes, selectedNotebook, showPinnedOnly, selectedTag, searchQuery]);

  // Pinned vs Regular Notes
  const pinnedNotes = useMemo(() => filteredNotes.filter((n) => n.isPinned), [filteredNotes]);
  const otherNotes = useMemo(() => filteredNotes.filter((n) => !n.isPinned), [filteredNotes]);

  // Stats
  const totalWords = useMemo(() => {
    return notes.reduce((sum, n) => sum + (n.content.match(/\S+/g)?.length || 0), 0);
  }, [notes]);

  const totalReadingMinutes = Math.max(1, Math.round(totalWords / 180));

  // Open Editor for New Note
  const handleOpenNewNote = (templateIndex?: number) => {
    if (templateIndex !== undefined && NOTE_TEMPLATES[templateIndex]) {
      const tmpl = NOTE_TEMPLATES[templateIndex];
      setEditorTitle(tmpl.title);
      setEditorContent(tmpl.content);
      setEditorNotebook(tmpl.notebook);
      setEditorTags(tmpl.tags);
      setEditorIsPinned(false);
      setEditorIcon(tmpl.notebook === 'Buku & Pembelajaran' ? '📚' : tmpl.notebook === 'Kerja & Proyek' ? '💼' : '💡');
    } else {
      setEditorTitle('');
      setEditorContent('');
      setEditorNotebook(selectedNotebook !== 'all' ? selectedNotebook : 'Kerja & Proyek');
      setEditorTags([]);
      setEditorIsPinned(false);
      setEditorIcon('📝');
    }
    setEditingNoteId(null);
    setEditorTab('write');
    setIsEditorOpen(true);
  };

  // Open Editor for Editing Existing Note
  const handleEditNote = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setEditorTitle(note.title);
    setEditorContent(note.content);
    setEditorNotebook(note.notebook);
    setEditorTags(note.tags || []);
    setEditorIsPinned(note.isPinned);
    setEditorIcon(note.icon || '📝');
    setEditorTab('write');
    setIsEditorOpen(true);
  };

  // Save Note
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorTitle.trim()) return;

    const words = editorContent.match(/\S+/g)?.length || 0;
    const estTime = `${Math.max(1, Math.round(words / 150))} min read`;

    if (editingNoteId) {
      updateNote(editingNoteId, {
        title: editorTitle.trim(),
        content: editorContent,
        notebook: editorNotebook,
        tags: editorTags,
        isPinned: editorIsPinned,
        icon: editorIcon,
        readingTime: estTime,
      });
    } else {
      addNote({
        title: editorTitle.trim(),
        content: editorContent,
        notebook: editorNotebook,
        tags: editorTags,
        isPinned: editorIsPinned,
        icon: editorIcon,
        readingTime: estTime,
      });
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

  // Insert formatting into textarea
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('note-content-area') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editorContent.substring(start, end);
    const replacement = `${prefix}${selectedText || 'teks'}${suffix}`;

    const newContent =
      editorContent.substring(0, start) + replacement + editorContent.substring(end);
    setEditorContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selectedText.length || 4));
    }, 50);
  };

  // Convert Scratchpad to Note
  const handleConvertScratchpadToNote = () => {
    if (!scratchpadText.trim()) return;
    const lines = scratchpadText.trim().split('\n');
    const firstLine = lines[0].replace(/^[-#*]\s*/, '').slice(0, 60);
    setEditorTitle(firstLine || 'Catatan Cepat');
    setEditorContent(scratchpadText);
    setEditorNotebook('Ide & Inspirasi');
    setEditorTags(['QuickCapture', 'Scratchpad']);
    setEditorIsPinned(false);
    setEditorIcon('⚡');
    setEditingNoteId(null);
    setEditorTab('write');
    setIsEditorOpen(true);
  };

  // Copy Note Text
  const handleCopyNote = (note: NoteItem) => {
    const textToCopy = `# ${note.title}\n\nNotebook: ${note.notebook}\nTags: ${note.tags?.join(', ')}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner - Notion LifeCanvas Style */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-amber-50/60 to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-xs shrink-0">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#2F3437] tracking-tight">
                  Notes by LifeCanvas
                </h1>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100/70 text-amber-800">
                  Notion Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1 max-w-2xl">
                Dokumentasi proyek, intisari buku non-fiksi, ide produk, dan sistem digital notebook
                minimalis yang tertata rapi.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowScratchpad(!showScratchpad)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                showScratchpad
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-white border-[#E9E9E7] text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <StickyNote className="w-4 h-4 text-amber-600" />
              <span>{showScratchpad ? 'Sembunyikan Scratchpad' : '⚡ Buka Scratchpad'}</span>
            </button>

            {/* Template Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-700 bg-white border border-[#E9E9E7] rounded-lg hover:bg-neutral-50 shadow-xs transition-all">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Pakai Template</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-[#E9E9E7] rounded-xl shadow-lg p-1.5 hidden group-hover:block z-30 animate-in fade-in zoom-in-95 duration-100">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 px-2 py-1">
                  Pilih Kerangka Kerja
                </p>
                {NOTE_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleOpenNewNote(idx)}
                    className="w-full text-left px-2.5 py-2 text-xs text-neutral-700 hover:bg-neutral-50 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <span>{tmpl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleOpenNewNote()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#2F3437] hover:bg-black rounded-lg shadow-sm transition-all hover:scale-[1.01]"
            >
              <Plus className="w-4 h-4" />
              <span>Catatan Baru</span>
            </button>
          </div>
        </div>

        {/* Quick KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[#F1F1EF]">
          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Total Catatan</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-[#2F3437]">{notes.length}</span>
              <span className="text-[11px] text-neutral-400">dokumen</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Disematkan (Pinned)</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-amber-700">
                {notes.filter((n) => n.isPinned).length}
              </span>
              <span className="text-[11px] text-neutral-400">prioritas</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Notebooks Aktif</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-blue-700">5</span>
              <span className="text-[11px] text-neutral-400">kategori</span>
            </div>
          </div>

          <div className="bg-[#FAF9F6] border border-[#EBEAE5] rounded-xl p-3">
            <span className="text-[11px] font-medium text-neutral-500 block">Estimasi Baca</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl font-bold text-emerald-700">~{totalReadingMinutes}</span>
              <span className="text-[11px] text-neutral-400">menit total</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Scratchpad / Sticky Notes Banner */}
      {showScratchpad && (
        <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 shadow-2xs relative transition-all">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <h2 className="text-xs sm:text-sm font-bold text-amber-900">
                Quick Scratchpad & Temp Ideas
              </h2>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                Tersimpan Otomatis
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(scratchpadText);
                  setScratchpadCopied(true);
                  setTimeout(() => setScratchpadCopied(false), 1500);
                }}
                disabled={!scratchpadText.trim()}
                className="text-[11px] text-amber-800 hover:text-black font-medium px-2 py-1 rounded bg-amber-100/60 hover:bg-amber-200 transition-colors disabled:opacity-40"
              >
                {scratchpadCopied ? 'Tersalin ✓' : 'Salin'}
              </button>
              <button
                onClick={handleConvertScratchpadToNote}
                disabled={!scratchpadText.trim()}
                className="text-[11px] text-white font-medium px-2.5 py-1 rounded bg-amber-800 hover:bg-amber-900 transition-colors disabled:opacity-40"
              >
                + Jadikan Catatan
              </button>
              <button
                onClick={() => setScratchpadText('')}
                disabled={!scratchpadText.trim()}
                className="text-[11px] text-amber-700 hover:text-red-600 font-medium px-2 py-1 transition-colors disabled:opacity-40"
              >
                Bersihkan
              </button>
            </div>
          </div>
          <textarea
            value={scratchpadText}
            onChange={(e) => setScratchpadText(e.target.value)}
            placeholder="Ketik ide cepat, tautan penting, atau catatan kilat di sini tanpa perlu membuat dokumen baru..."
            rows={2}
            className="w-full bg-white/80 border border-amber-200 rounded-xl p-3 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-amber-400 focus:bg-white resize-y transition-all"
          />
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div className="bg-white border border-[#E9E9E7] rounded-2xl p-4 shadow-sm space-y-4">
        {/* Notebooks selector pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedNotebook('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
              selectedNotebook === 'all'
                ? 'bg-[#2F3437] text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Semua Notebook</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedNotebook === 'all' ? 'bg-neutral-700 text-white' : 'bg-neutral-200 text-neutral-700'
              }`}
            >
              {notes.length}
            </span>
          </button>

          {(Object.keys(NOTEBOOK_CONFIG) as NoteNotebook[]).map((nb) => {
            const count = notes.filter((n) => n.notebook === nb).length;
            const isSelected = selectedNotebook === nb;
            const Icon = NOTEBOOK_CONFIG[nb].icon;

            return (
              <button
                key={nb}
                onClick={() => setSelectedNotebook(nb)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#2F3437] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : NOTEBOOK_CONFIG[nb].color}`} />
                <span>{nb}</span>
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

        {/* Second row: Search, tag filter, and view toggles */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#F1F1EF]">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, tag, atau isi catatan..."
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
              onClick={() => setShowPinnedOnly(!showPinnedOnly)}
              className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors shrink-0 ${
                showPinnedOnly
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-white border-[#E9E9E7] text-neutral-600 hover:bg-neutral-50'
              }`}
              title="Filter catatan yang disematkan"
            >
              <Pin className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
              <span className="hidden sm:inline">Disematkan</span>
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
              <span className="hidden md:inline">Galeri</span>
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
              <span className="hidden md:inline">Tabel</span>
            </button>
            <button
              onClick={() => setViewMode('notebooks')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'notebooks'
                  ? 'bg-white text-[#2F3437] shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Folder</span>
            </button>
          </div>
        </div>

        {/* Active Tag Filters Bar if tags exist */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-[#F1F1EF] text-xs text-neutral-500">
            <span className="text-[11px] font-medium text-neutral-400">Tag:</span>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 font-medium flex items-center gap-1"
              >
                <span>Hapus Filter Tag</span>
                <X className="w-3 h-3" />
              </button>
            )}
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                  selectedTag === tag
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

      {/* Main Content Areas based on View Mode */}
      {viewMode === 'gallery' && (
        <div className="space-y-6">
          {/* Pinned Section */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Pin className="w-4 h-4 text-amber-600 fill-amber-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Catatan Disematkan ({pinnedNotes.length})
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => handleEditNote(note)}
                    onTogglePin={() => togglePinNote(note.id)}
                    onDelete={() => deleteNote(note.id)}
                    onCopy={() => handleCopyNote(note)}
                    isCopied={copiedNoteId === note.id}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Other Notes Section */}
          <div className="space-y-3">
            {pinnedNotes.length > 0 && otherNotes.length > 0 && (
              <div className="flex items-center gap-2 pt-2">
                <FileText className="w-4 h-4 text-neutral-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Semua Catatan ({otherNotes.length})
                </h2>
              </div>
            )}

            {otherNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => handleEditNote(note)}
                    onTogglePin={() => togglePinNote(note.id)}
                    onDelete={() => deleteNote(note.id)}
                    onCopy={() => handleCopyNote(note)}
                    isCopied={copiedNoteId === note.id}
                  />
                ))}
              </div>
            ) : pinnedNotes.length === 0 ? (
              <div className="bg-white border border-[#E9E9E7] rounded-2xl p-12 text-center space-y-3">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto text-xl">
                  📝
                </div>
                <h3 className="text-sm font-bold text-neutral-800">Tidak ada catatan yang cocok</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Coba sesuaikan kata kunci pencarian atau buat dokumen baru dengan tombol di atas.
                </p>
                <button
                  onClick={() => handleOpenNewNote()}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#2F3437] rounded-lg hover:bg-black transition-all inline-flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Buat Catatan Sekarang</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-[#E9E9E7] rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-[#FAF9F6] text-neutral-500 border-b border-[#E9E9E7] font-semibold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Pin</th>
                  <th className="py-3 px-4">Judul Catatan</th>
                  <th className="py-3 px-4">Notebook</th>
                  <th className="py-3 px-4">Tag</th>
                  <th className="py-3 px-4">Terakhir Diperbarui</th>
                  <th className="py-3 px-4">Waktu Baca</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F1EF]">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => {
                    const cfg = NOTEBOOK_CONFIG[note.notebook] || NOTEBOOK_CONFIG['Kerja & Proyek'];
                    return (
                      <tr key={note.id} className="hover:bg-neutral-50/70 transition-colors group">
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => togglePinNote(note.id)}
                            className="text-neutral-300 hover:text-amber-500 transition-colors"
                          >
                            <Pin
                              className={`w-3.5 h-3.5 inline ${
                                note.isPinned ? 'text-amber-500 fill-amber-500' : ''
                              }`}
                            />
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div
                            onClick={() => handleEditNote(note)}
                            className="font-medium text-[#2F3437] hover:text-blue-600 cursor-pointer flex items-center gap-2"
                          >
                            <span>{note.icon || '📝'}</span>
                            <span className="line-clamp-1">{note.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${cfg.bg} ${cfg.border} ${cfg.color}`}
                          >
                            {note.notebook}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 flex-wrap">
                            {note.tags?.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded text-[10px]"
                              >
                                #{t}
                              </span>
                            ))}
                            {(note.tags?.length || 0) > 3 && (
                              <span className="text-[10px] text-neutral-400">
                                +{(note.tags?.length || 0) - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-neutral-500">
                          {note.updatedAt || note.createdAt}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-neutral-500">
                          {note.readingTime || '1 min read'}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleCopyNote(note)}
                              className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
                              title="Salin isi catatan"
                            >
                              {copiedNoteId === note.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleEditNote(note)}
                              className="p-1 text-neutral-400 hover:text-neutral-700 rounded transition-colors"
                              title="Edit catatan"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors"
                              title="Hapus catatan"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-neutral-400">
                      Tidak ada catatan yang sesuai dengan filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Notebooks Folder Showcase View */}
      {viewMode === 'notebooks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(Object.keys(NOTEBOOK_CONFIG) as NoteNotebook[]).map((nb) => {
            const cfg = NOTEBOOK_CONFIG[nb];
            const nbNotes = notes.filter((n) => n.notebook === nb);
            const Icon = cfg.icon;

            return (
              <div
                key={nb}
                className="bg-white border border-[#E9E9E7] rounded-2xl p-5 shadow-sm space-y-4 hover:border-neutral-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-xl border ${cfg.bg} ${cfg.border}`}>
                        <Icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#2F3437]">{nb}</h3>
                        <span className="text-[11px] text-neutral-400 font-medium">
                          {nbNotes.length} Catatan
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 leading-relaxed">{cfg.desc}</p>

                  {/* List of notes in this notebook */}
                  <div className="space-y-1.5 pt-2 border-t border-[#F1F1EF]">
                    {nbNotes.slice(0, 4).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleEditNote(n)}
                        className="p-2 rounded-lg hover:bg-neutral-50 cursor-pointer flex items-center justify-between gap-2 text-xs transition-colors group"
                      >
                        <div className="flex items-center gap-1.5 line-clamp-1 text-neutral-700 group-hover:text-blue-600 font-medium">
                          <span>{n.icon || '📝'}</span>
                          <span className="truncate">{n.title}</span>
                        </div>
                        {n.isPinned && (
                          <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                        )}
                      </div>
                    ))}

                    {nbNotes.length === 0 && (
                      <p className="text-[11px] text-neutral-400 py-2 italic">Belum ada catatan.</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedNotebook(nb);
                    setViewMode('gallery');
                  }}
                  className="w-full mt-2 py-2 text-xs font-semibold text-neutral-600 hover:text-black bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-[#E9E9E7] transition-colors"
                >
                  Buka Folder Ini ({nbNotes.length})
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Note Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
            {/* Modal Top Bar */}
            <div className="p-4 sm:px-6 border-b border-[#E9E9E7] flex items-center justify-between gap-4 bg-[#FAF9F6]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editorIcon}</span>
                <div>
                  <h3 className="text-sm font-bold text-[#2F3437]">
                    {editingNoteId ? 'Edit Catatan' : 'Catatan Baru'}
                  </h3>
                  <span className="text-[11px] text-neutral-400">
                    Format Markdown didukung (H1, H2, Checklist, Quote, Code)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditorIsPinned(!editorIsPinned)}
                  className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                    editorIsPinned
                      ? 'bg-amber-100 border-amber-300 text-amber-800'
                      : 'bg-white border-[#E9E9E7] text-neutral-500 hover:bg-neutral-100'
                  }`}
                  title="Sematkan catatan ke atas"
                >
                  <Pin className={`w-3.5 h-3.5 ${editorIsPinned ? 'fill-amber-600 text-amber-600' : ''}`} />
                  <span className="hidden sm:inline">Pin</span>
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
            <form onSubmit={handleSaveNote} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Title and Icon Picker */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="relative group">
                    <button
                      type="button"
                      className="text-2xl p-1.5 rounded-lg hover:bg-neutral-100 border border-transparent hover:border-neutral-200 transition-all"
                      title="Ubah Emoji Ikon"
                    >
                      {editorIcon}
                    </button>
                    <div className="absolute left-0 top-full mt-1 bg-white border border-neutral-200 rounded-xl shadow-lg p-2 hidden group-hover:grid grid-cols-5 gap-1 z-30 w-44">
                      {['📝', '💡', '🚀', '📚', '💻', '🎯', '🎨', '🌿', '⚡', '☕', '📌', '🔬', '⭐', '🔥', '📊'].map(
                        (emo) => (
                          <button
                            key={emo}
                            type="button"
                            onClick={() => setEditorIcon(emo)}
                            className="p-1.5 text-lg hover:bg-neutral-100 rounded text-center transition-colors"
                          >
                            {emo}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  <input
                    type="text"
                    required
                    value={editorTitle}
                    onChange={(e) => setEditorTitle(e.target.value)}
                    placeholder="Judul Catatan..."
                    className="flex-1 text-base sm:text-lg font-bold text-[#2F3437] placeholder-neutral-300 border-none focus:outline-none focus:ring-0 bg-transparent"
                  />
                </div>
              </div>

              {/* Notebook & Metadata Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 border-y border-[#F1F1EF]">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    Notebook / Kategori
                  </label>
                  <select
                    value={editorNotebook}
                    onChange={(e) => setEditorNotebook(e.target.value as NoteNotebook)}
                    className="w-full text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                  >
                    {(Object.keys(NOTEBOOK_CONFIG) as NoteNotebook[]).map((nb) => (
                      <option key={nb} value={nb}>
                        {nb}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
                    Tags (Label)
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
                      placeholder="Tambah tag lalu tekan Enter..."
                      className="flex-1 text-xs bg-neutral-50 border border-[#E9E9E7] rounded-lg px-2.5 py-1.5 text-neutral-800 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddTag}
                      className="px-2.5 py-1.5 text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Tag Pills */}
              {editorTags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {editorTags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-neutral-100 text-neutral-700 text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-500 text-neutral-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Markdown Toolbar & Tab Switcher */}
              <div className="flex items-center justify-between gap-2 pt-1 border-b border-[#F1F1EF] pb-2">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('## ')}
                    className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded text-xs font-bold"
                    title="Heading 2"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- ')}
                    className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                    title="Bullet List"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- [ ] ')}
                    className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                    title="Checklist Item"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ')}
                    className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                    title="Quote"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('```\n', '\n```')}
                    className="p-1.5 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded"
                    title="Code block"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setEditorTab('write')}
                    className={`px-2 py-0.5 rounded font-medium ${
                      editorTab === 'write' ? 'bg-white text-black shadow-xs' : 'text-neutral-500'
                    }`}
                  >
                    Tulis
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`px-2 py-0.5 rounded font-medium ${
                      editorTab === 'preview' ? 'bg-white text-black shadow-xs' : 'text-neutral-500'
                    }`}
                  >
                    Pratinjau
                  </button>
                </div>
              </div>

              {/* Editor Textarea vs Rendered Preview */}
              {editorTab === 'write' ? (
                <div className="space-y-1">
                  <textarea
                    id="note-content-area"
                    value={editorContent}
                    onChange={(e) => setEditorContent(e.target.value)}
                    placeholder="Mulai mengetik isi catatan, ringkasan, atau kerangka kerja di sini..."
                    rows={12}
                    className="w-full p-3 font-mono text-xs sm:text-sm bg-neutral-50/50 border border-[#E9E9E7] rounded-xl text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:bg-white resize-y leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1">
                    <span>
                      {editorContent.match(/\S+/g)?.length || 0} kata | {editorContent.length} karakter
                    </span>
                    <span>
                      ~{Math.max(1, Math.round((editorContent.match(/\S+/g)?.length || 0) / 150))} min baca
                    </span>
                  </div>
                </div>
              ) : (
                <div className="min-h-[280px] p-4 bg-neutral-50/50 border border-[#E9E9E7] rounded-xl prose prose-neutral max-w-none text-xs sm:text-sm leading-relaxed overflow-y-auto">
                  <RenderMarkdown content={editorContent} />
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E9E9E7]">
                {editingNoteId ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Yakin ingin menghapus catatan ini?')) {
                        deleteNote(editingNoteId);
                        setIsEditorOpen(false);
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 transition-colors"
                  >
                    Hapus Dokumen
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
                    {editingNoteId ? 'Simpan Perubahan' : 'Terbitkan Catatan'}
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

// Sub-component: Gallery Note Card
interface NoteCardProps {
  note: NoteItem;
  onEdit: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  onCopy: () => void;
  isCopied: boolean;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onEdit,
  onTogglePin,
  onDelete,
  onCopy,
  isCopied,
}) => {
  const cfg = NOTEBOOK_CONFIG[note.notebook] || NOTEBOOK_CONFIG['Kerja & Proyek'];
  const Icon = cfg.icon;

  // Clean snippet from markdown characters
  const previewSnippet = useMemo(() => {
    return note.content
      .replace(/[#*`>_-]/g, '')
      .replace(/\[\s*\]/g, '')
      .trim()
      .slice(0, 160);
  }, [note.content]);

  return (
    <div className="bg-white border border-[#E9E9E7] hover:border-neutral-300 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative overflow-hidden">
      {/* Top Accent Strip */}
      <div className={`h-1 w-full absolute top-0 left-0 ${cfg.bg}`} />

      <div className="space-y-3">
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}
          >
            <Icon className="w-3 h-3" />
            <span>{note.notebook}</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin();
              }}
              className={`p-1 rounded transition-colors ${
                note.isPinned
                  ? 'text-amber-500 fill-amber-500'
                  : 'text-neutral-300 hover:text-amber-500'
              }`}
              title={note.isPinned ? 'Lepaskan sematan' : 'Sematkan ke atas'}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onCopy();
              }}
              className="p-1 rounded text-neutral-300 hover:text-neutral-700 transition-colors"
              title="Salin isi catatan"
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Title */}
        <div onClick={onEdit} className="cursor-pointer space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-base">{note.icon || '📝'}</span>
            <h3 className="text-sm font-bold text-[#2F3437] group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {note.title}
            </h3>
          </div>
          <p className="text-xs text-neutral-500 line-clamp-3 leading-relaxed">
            {previewSnippet || 'Tidak ada pratinjau teks...'}
          </p>
        </div>

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap pt-1">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="bg-neutral-100 text-neutral-600 text-[10px] font-medium px-1.5 py-0.5 rounded"
              >
                #{tag}
              </span>
            ))}
            {note.tags.length > 3 && (
              <span className="text-[10px] text-neutral-400 font-medium">
                +{note.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 mt-4 border-t border-[#F1F1EF] text-[11px] text-neutral-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-neutral-400" />
          <span>{note.updatedAt || note.createdAt}</span>
        </div>

        <div className="flex items-center gap-2">
          <span>{note.readingTime || '2 min read'}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-neutral-500 hover:text-black font-medium underline underline-offset-2"
          >
            Buka
          </button>
        </div>
      </div>
    </div>
  );
};

// Simple Markdown Renderer for Preview
const RenderMarkdown: React.FC<{ content: string }> = ({ content }) => {
  if (!content) {
    return <p className="italic text-neutral-400">Belum ada konten untuk ditampilkan.</p>;
  }

  const lines = content.split('\n');

  return (
    <div className="space-y-2">
      {lines.map((line, idx) => {
        if (line.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-sm font-bold text-neutral-800 pt-2 border-b pb-1">
              {line.replace('## ', '')}
            </h3>
          );
        }
        if (line.startsWith('# ')) {
          return (
            <h2 key={idx} className="text-base font-bold text-neutral-900 pt-3">
              {line.replace('# ', '')}
            </h2>
          );
        }
        if (line.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-amber-400 pl-3 italic text-neutral-600 text-xs py-1 bg-amber-50/40 rounded-r"
            >
              {line.replace('> ', '')}
            </blockquote>
          );
        }
        if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
          const isDone = line.startsWith('- [x] ');
          const text = line.replace(/- \[[ x]\] /, '');
          return (
            <div key={idx} className="flex items-center gap-2 text-xs">
              <input type="checkbox" checked={isDone} readOnly className="rounded text-neutral-700" />
              <span className={isDone ? 'line-through text-neutral-400' : 'text-neutral-700'}>
                {text}
              </span>
            </div>
          );
        }
        if (line.startsWith('- ')) {
          return (
            <li key={idx} className="text-xs text-neutral-700 ml-4 list-disc">
              {line.replace('- ', '')}
            </li>
          );
        }
        if (!line.trim()) {
          return <div key={idx} className="h-1.5" />;
        }
        return (
          <p key={idx} className="text-xs text-neutral-700 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
};
