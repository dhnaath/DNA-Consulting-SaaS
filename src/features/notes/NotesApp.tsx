import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import React, { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Search,
  Pin,
  Star,
  Lock,
  Unlock,
  Archive,
  Trash2,
  History,
  BarChart3,
  Sparkles,
  Network,
  CheckSquare,
  Square,
  AlertCircle,
  ArrowRight,
  X,
  ExternalLink,
  RefreshCw,
  Download,
  CheckCircle2,
} from "lucide-react";
import {
  useNotesStore,
} from "./store";
import {
  Note,
  Block,
  BlockType,
  NotesViewMode,
} from "./types";

export function NotesApp() {
  const {
    notes,
    notebooks,
    links,
    activities,
    templates,
    statistics,
    addNote,
    applyTemplate,
    updateNote,
    updateNoteBlocks,
    togglePin,
    toggleFavorite,
    toggleLock,
    restoreNote,
    trashNote,
    addLink,
    convertNoteToTask,
    getBacklinks,
  } = useNotesStore();

  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<NotesViewMode>("all");
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes.find((n) => !n.isTrashed && !n.isArchived)?.id || null
  );

  // Modals & Panels
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [isGraphModalOpen, setIsGraphModalOpen] = useState(false);
  const [unlockedNoteIds, setUnlockedNoteIds] = useState<Set<string>>(new Set());
  const [lockPromptNoteId, setLockPromptNoteId] = useState<string | null>(null);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [taskConvertedToast, setTaskConvertedToast] = useState(false);

  // Active note
  const currentNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || null;
  }, [notes, selectedNoteId]);

  // Filtered Notes List
  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      // Trash filter
      if (viewMode === "trash") return n.isTrashed;
      if (n.isTrashed) return false;

      // Archive filter
      if (viewMode === "archived") return n.isArchived;
      if (n.isArchived) return false;

      // Special views
      if (viewMode === "pinned" && !n.pinned) return false;
      if (viewMode === "favorites" && !n.favorited) return false;
      if (viewMode === "notebook" && selectedNotebookId && n.notebookId !== selectedNotebookId) return false;
      if (viewMode === "tags" && selectedTag && !n.tags.includes(selectedTag)) return false;

      // Search query (full-text search over title, tags, and blocks)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = n.title.toLowerCase().includes(q);
        const matchTag = n.tags.some((t) => t.toLowerCase().includes(q));
        const matchContent = n.blocks.some((b) => b.content.toLowerCase().includes(q));
        if (!matchTitle && !matchTag && !matchContent) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort pinned first, then by updatedAt desc
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [notes, viewMode, selectedNotebookId, selectedTag, searchQuery]);

  // Handle Note Selection
  const handleSelectNote = (note: Note) => {
    if (note.isLocked && !unlockedNoteIds.has(note.id)) {
      setLockPromptNoteId(note.id);
      setEnteredPin("");
      setPinError("");
      return;
    }
    setSelectedNoteId(note.id);
  };

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockPromptNoteId) return;
    const target = notes.find((n) => n.id === lockPromptNoteId);
    if (!target) return;

    if (enteredPin === (target.lockPin || "1234")) {
      setUnlockedNoteIds((prev) => new Set(prev).add(lockPromptNoteId));
      setSelectedNoteId(lockPromptNoteId);
      setLockPromptNoteId(null);
      setPinError("");
    } else {
      setPinError("PIN salah. Default PIN: 1234");
    }
  };

  // Block Editing Operations
  const handleAddBlock = (afterIndex: number, type: BlockType = "paragraph") => {
    if (!currentNote) return;
    const newBlock: Block = {
      id: `b-${Date.now()}`,
      noteId: currentNote.id,
      type,
      content: "",
      order: afterIndex + 1,
    };
    const updated = [...currentNote.blocks];
    updated.splice(afterIndex + 1, 0, newBlock);
    // Reindex orders
    updated.forEach((b, i) => (b.order = i + 1));
    updateNoteBlocks(currentNote.id, updated);
  };

  const handleUpdateBlockContent = (blockId: string, content: string) => {
    if (!currentNote) return;
    const updated = currentNote.blocks.map((b) =>
      b.id === blockId ? { ...b, content } : b
    );
    updateNoteBlocks(currentNote.id, updated);
  };

  const handleToggleChecklist = (blockId: string) => {
    if (!currentNote) return;
    const updated = currentNote.blocks.map((b) =>
      b.id === blockId ? { ...b, checked: !b.checked } : b
    );
    updateNoteBlocks(currentNote.id, updated);
  };

  const handleChangeBlockType = (blockId: string, newType: BlockType) => {
    if (!currentNote) return;
    const updated = currentNote.blocks.map((b) =>
      b.id === blockId ? { ...b, type: newType } : b
    );
    updateNoteBlocks(currentNote.id, updated);
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!currentNote || currentNote.blocks.length <= 1) return;
    const updated = currentNote.blocks.filter((b) => b.id !== blockId);
    updated.forEach((b, i) => (b.order = i + 1));
    updateNoteBlocks(currentNote.id, updated);
  };

  const handleExportMarkdown = () => {
    if (!currentNote) return;
    let md = `# ${currentNote.title}\n\n`;
    currentNote.blocks.forEach((b) => {
      if (b.type === "heading_1") md += `# ${b.content}\n\n`;
      else if (b.type === "heading_2") md += `## ${b.content}\n\n`;
      else if (b.type === "heading_3") md += `### ${b.content}\n\n`;
      else if (b.type === "checklist") md += `- [${b.checked ? "x" : " "}] ${b.content}\n`;
      else if (b.type === "bulleted_list") md += `- ${b.content}\n`;
      else if (b.type === "numbered_list") md += `1. ${b.content}\n`;
      else if (b.type === "quote") md += `> ${b.content}\n\n`;
      else if (b.type === "code") md += `\`\`\`${b.language || ""}\n${b.content}\n\`\`\`\n\n`;
      else if (b.type === "divider") md += `---\n\n`;
      else if (b.type === "callout") md += `> ℹ️ ${b.content}\n\n`;
      else md += `${b.content}\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentNote.title || "catatan"}.md`;
    a.click();
  };

  const handleConvertTask = () => {
    if (!currentNote) return;
    const ok = convertNoteToTask(currentNote.id);
    if (ok) {
      setTaskConvertedToast(true);
      setTimeout(() => setTaskConvertedToast(false), 3000);
    }
  };

  // Backlinks of the currently selected note
  const backlinks = useMemo(() => {
    if (!currentNote) return [];
    return getBacklinks(currentNote.id);
  }, [currentNote, getBacklinks]);

  return (
    <div className="w-full flex-1 flex flex-col font-sans bg-background">
      {/* 1. TOP HEADER Portaled to Main Header */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            title="Pilih Template Catatan"
            aria-label="Template"
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
          >
            <Sparkles className="size-3.5 text-amber-500" />
          </button>

          <button
            onClick={() => setIsGraphModalOpen(true)}
            title="Graph View (Visualisasi Jaringan)"
            aria-label="Graph View"
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
          >
            <Network className="size-3.5 text-indigo-500" />
          </button>

          <button
            onClick={() => setIsStatsModalOpen(true)}
            title="Statistik Catatan"
            aria-label="Statistik"
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
          >
            <BarChart3 className="size-3.5 text-purple-500" />
          </button>

          <button
            onClick={() => setIsHistoryDrawerOpen(true)}
            title="Riwayat Versi Catatan"
            aria-label="Riwayat"
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
          >
            <History className="size-3.5 text-muted-foreground" />
          </button>

          <button
            onClick={() => {
              const n = addNote();
              setSelectedNoteId(n.id);
            }}
            title="Catatan Baru"
            aria-label="Catatan Baru"
            className="p-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="size-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </ShellHeader>

      {/* 2. MAIN SPLIT INTERFACE */}
      <div className="flex-1 w-full flex flex-col md:flex-row">
        {/* LEFT COLUMN: Navigation Sidebar & Note List */}
        <ShellSidebar>
          {/* Navigation Views Accordion / Tabs */}
          <div className="bg-card border border-border rounded-2xl p-3 space-y-1 shadow-2xs text-xs">
            <button
              onClick={() => {
                setViewMode("all");
                setSelectedNotebookId(null);
                setSelectedTag(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                viewMode === "all"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="size-3.5" />
                <span>Semua Catatan</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-card/10">
                {statistics.activeCount}
              </span>
            </button>

            <button
              onClick={() => setViewMode("pinned")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                viewMode === "pinned"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Pin className="size-3.5 text-amber-500" />
                <span>Dipasangi Pin</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-card/10">
                {notes.filter((n) => n.pinned && !n.isTrashed && !n.isArchived).length}
              </span>
            </button>

            <button
              onClick={() => setViewMode("favorites")}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                viewMode === "favorites"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="size-3.5 text-yellow-500 fill-yellow-500" />
                <span>Favorit</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/10 dark:bg-card/10">
                {notes.filter((n) => n.favorited && !n.isTrashed && !n.isArchived).length}
              </span>
            </button>

            {/* Notebooks Submenu */}
            <div className="pt-2 border-t border-border">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 block mb-1">
                Notebooks
              </span>
              {notebooks.map((nb) => {
                const count = notes.filter((n) => n.notebookId === nb.id && !n.isTrashed && !n.isArchived).length;
                const isSelected = viewMode === "notebook" && selectedNotebookId === nb.id;
                return (
                  <button
                    key={nb.id}
                    onClick={() => {
                      setViewMode("notebook");
                      setSelectedNotebookId(nb.id);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full" style={{ backgroundColor: nb.color }} />
                      <span className="truncate">{nb.name}</span>
                    </div>
                    <span className="text-[10px] opacity-75">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Archive & Trash */}
            <div className="pt-2 border-t border-border flex items-center justify-between gap-1">
              <button
                onClick={() => setViewMode("archived")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] cursor-pointer ${
                  viewMode === "archived" ? "bg-muted font-bold text-foreground" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <Archive className="size-3" />
                <span>Arsip ({statistics.archivedCount})</span>
              </button>

              <button
                onClick={() => setViewMode("trash")}
                className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] cursor-pointer ${
                  viewMode === "trash" ? "bg-rose-50 dark:bg-rose-950/50 text-rose-600 font-bold" : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <Trash2 className="size-3" />
                <span>Sampah ({statistics.trashedCount})</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari teks dalam catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Note List Cards */}
          <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground bg-card border border-border rounded-2xl">
                Tidak ada catatan dalam tampilan ini.
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isSelected = note.id === selectedNoteId;
                const isLocked = note.isLocked && !unlockedNoteIds.has(note.id);
                return (
                  <div
                    key={note.id}
                    onClick={() => handleSelectNote(note)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-xs"
                        : "bg-card border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">{note.icon || "📝"}</span>
                        <h4 className="text-xs font-bold text-foreground line-clamp-1">
                          {isLocked ? "Catatan Terkunci" : note.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1">
                        {note.pinned && <Pin className="size-3 text-amber-500 fill-amber-500" />}
                        {note.favorited && <Star className="size-3 text-yellow-500 fill-yellow-500" />}
                        {note.isLocked && <Lock className="size-3 text-rose-500" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                      {isLocked
                        ? "Konten disembunyikan. Masukkan PIN untuk membuka catatan ini."
                        : note.blocks[1]?.content || note.blocks[0]?.content || "Tidak ada konten tambahan."}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground/80 mt-2.5 pt-2 border-t border-border/60">
                      <span>{new Date(note.updatedAt).toLocaleDateString("id-ID")}</span>
                      <span>{note.wordCount || 0} kata</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ShellSidebar>

        {/* RIGHT COLUMN: Rich Block-Based Note Editor */}
        <main className="flex-1 bg-background p-6 sm:p-8 flex flex-col overflow-y-auto">
          {currentNote ? (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Note Header & Metadata Bar */}
              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{currentNote.icon || "📝"}</span>
                    <input
                      type="text"
                      value={currentNote.title}
                      placeholder="Judul Catatan..."
                      onChange={(e) => updateNote(currentNote.id, { title: e.target.value })}
                      className="text-lg sm:text-xl font-bold text-foreground bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
                    />
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePin(currentNote.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        currentNote.pinned
                          ? "bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                      title={currentNote.pinned ? "Lepas Pin" : "Pasang Pin"}
                    >
                      <Pin className="size-3.5" />
                    </button>

                    <button
                      onClick={() => toggleFavorite(currentNote.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        currentNote.favorited
                          ? "bg-yellow-50 dark:bg-yellow-950/40 border-yellow-300 text-yellow-600"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                      title={currentNote.favorited ? "Hapus Favorit" : "Favorit"}
                    >
                      <Star className="size-3.5" />
                    </button>

                    <button
                      onClick={() => toggleLock(currentNote.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        currentNote.isLocked
                          ? "bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-600"
                          : "border-border text-muted-foreground hover:bg-accent"
                      }`}
                      title={currentNote.isLocked ? "Buka Kunci" : "Kunci dengan PIN"}
                    >
                      {currentNote.isLocked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                    </button>

                    <button
                      onClick={handleConvertTask}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border hover:bg-accent text-xs font-medium text-foreground cursor-pointer"
                      title="Konversi menjadi Task di Task Manager (#01)"
                    >
                      <CheckSquare className="size-3 text-blue-500" />
                      <span className="hidden sm:inline">Ke Task</span>
                    </button>

                    <button
                      onClick={() => setIsLinkModalOpen(true)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border hover:bg-accent text-xs font-medium text-foreground cursor-pointer"
                      title="Tautkan ke Catatan Lain (Backlink)"
                    >
                      <ExternalLink className="size-3 text-indigo-500" />
                      <span className="hidden sm:inline">Tautkan</span>
                    </button>

                    <button
                      onClick={handleExportMarkdown}
                      className="p-1.5 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Ekspor Markdown (.md)"
                    >
                      <Download className="size-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        updateNoteBlocks(currentNote.id, currentNote.blocks, true, "Snapshot manual");
                      }}
                      className="p-1.5 rounded-lg border border-border hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer"
                      title="Simpan Snapshot Versi Baru"
                    >
                      <History className="size-3.5" />
                    </button>

                    {currentNote.isTrashed ? (
                      <button
                        onClick={() => restoreNote(currentNote.id)}
                        className="p-1.5 rounded-lg border border-emerald-300 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                        title="Pulihkan dari Sampah"
                      >
                        <RefreshCw className="size-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => trashNote(currentNote.id)}
                        className="p-1.5 rounded-lg border border-border hover:bg-rose-50 hover:text-rose-600 text-muted-foreground cursor-pointer"
                        title="Buang ke Sampah"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-meta: Notebook & Word count */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span>Notebook:</span>
                    <select
                      value={currentNote.notebookId || ""}
                      onChange={(e) => updateNote(currentNote.id, { notebookId: e.target.value })}
                      className="bg-transparent border border-border rounded-lg px-2 py-0.5 text-foreground focus:outline-none"
                    >
                      {notebooks.map((nb) => (
                        <option key={nb.id} value={nb.id}>
                          {nb.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <span>•</span>
                  <span>{currentNote.wordCount || 0} kata</span>
                  <span>•</span>
                  <span>Terakhir diubah: {new Date(currentNote.updatedAt).toLocaleTimeString("id-ID")}</span>
                </div>
              </div>

              {/* Toast if task converted */}
              {taskConvertedToast && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4" />
                    Catatan berhasil disalin menjadi Task di <strong>Task Manager (#01)</strong>!
                  </span>
                  <button onClick={() => setTaskConvertedToast(false)}>
                    <X className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Dynamic Blocks Container */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {currentNote.blocks.map((block, index) => (
                  <div key={block.id} className="group relative flex items-start gap-2">
                    {/* Block Type Quick Changer */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pt-1 flex items-center gap-0.5">
                      <select
                        value={block.type}
                        onChange={(e) => handleChangeBlockType(block.id, e.target.value as BlockType)}
                        className="text-[10px] bg-muted border border-border rounded px-1 py-0.5 text-muted-foreground focus:outline-none"
                      >
                        <option value="paragraph">Teks (P)</option>
                        <option value="heading_1">H1</option>
                        <option value="heading_2">H2</option>
                        <option value="heading_3">H3</option>
                        <option value="checklist">To-Do</option>
                        <option value="bulleted_list">Bullet</option>
                        <option value="numbered_list">Nomor</option>
                        <option value="quote">Kutipan</option>
                        <option value="callout">Callout</option>
                        <option value="code">Code</option>
                        <option value="divider">Garis</option>
                      </select>
                    </div>

                    {/* Block Render per Type */}
                    <div className="flex-1">
                      {block.type === "heading_1" ? (
                        <input
                          type="text"
                          value={block.content}
                          placeholder="Heading 1..."
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className="w-full text-xl font-black text-foreground bg-transparent border-none focus:outline-none focus:ring-0"
                        />
                      ) : block.type === "heading_2" ? (
                        <input
                          type="text"
                          value={block.content}
                          placeholder="Heading 2..."
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className="w-full text-base font-bold text-foreground bg-transparent border-none focus:outline-none focus:ring-0"
                        />
                      ) : block.type === "heading_3" ? (
                        <input
                          type="text"
                          value={block.content}
                          placeholder="Heading 3..."
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className="w-full text-sm font-semibold text-foreground bg-transparent border-none focus:outline-none focus:ring-0"
                        />
                      ) : block.type === "checklist" ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleChecklist(block.id)}
                            className="text-primary hover:opacity-80 cursor-pointer pt-0.5"
                          >
                            {block.checked ? (
                              <CheckSquare className="size-4 text-emerald-600" />
                            ) : (
                              <Square className="size-4 text-muted-foreground" />
                            )}
                          </button>
                          <input
                            type="text"
                            value={block.content}
                            placeholder="Item to-do..."
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className={`w-full text-xs text-foreground bg-transparent border-none focus:outline-none ${
                              block.checked ? "line-through text-muted-foreground" : ""
                            }`}
                          />
                        </div>
                      ) : block.type === "bulleted_list" ? (
                        <div className="flex items-start gap-2">
                          <span className="text-primary font-bold text-xs pt-1">•</span>
                          <input
                            type="text"
                            value={block.content}
                            placeholder="Daftar butir..."
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className="w-full text-xs text-foreground bg-transparent border-none focus:outline-none"
                          />
                        </div>
                      ) : block.type === "callout" ? (
                        <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-start gap-2.5">
                          <AlertCircle className="size-4 text-blue-500 shrink-0 mt-0.5" />
                          <textarea
                            rows={2}
                            value={block.content}
                            placeholder="Catatan highlight / peringatan..."
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className="w-full text-xs text-foreground bg-transparent border-none focus:outline-none resize-none"
                          />
                        </div>
                      ) : block.type === "quote" ? (
                        <div className="border-l-3 border-amber-500 pl-3 py-1 italic">
                          <input
                            type="text"
                            value={block.content}
                            placeholder="Kutipan..."
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className="w-full text-xs text-foreground bg-transparent border-none focus:outline-none italic"
                          />
                        </div>
                      ) : block.type === "code" ? (
                        <div className="p-3 rounded-xl bg-background text-foreground font-mono text-xs">
                          <textarea
                            rows={3}
                            value={block.content}
                            placeholder="// Tulis kode di sini..."
                            onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                            className="w-full bg-transparent border-none focus:outline-none resize-none font-mono"
                          />
                        </div>
                      ) : block.type === "divider" ? (
                        <div className="py-2">
                          <hr className="border-border" />
                        </div>
                      ) : (
                        <textarea
                          rows={2}
                          value={block.content}
                          placeholder="Ketik catatan di sini... (tekan '+' untuk menambah blok baru)"
                          onChange={(e) => handleUpdateBlockContent(block.id, e.target.value)}
                          className="w-full text-xs text-foreground bg-transparent border-none focus:outline-none leading-relaxed resize-none"
                        />
                      )}
                    </div>

                    {/* Quick Block Add & Delete */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pt-1">
                      <button
                        onClick={() => handleAddBlock(index, "paragraph")}
                        className="p-1 rounded text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                        title="Tambah Blok Setelah Ini"
                      >
                        <Plus className="size-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlock(block.id)}
                        className="p-1 rounded text-muted-foreground hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                        title="Hapus Blok"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Add Block at Bottom */}
                <button
                  onClick={() => handleAddBlock(currentNote.blocks.length - 1, "paragraph")}
                  className="w-full py-2.5 rounded-xl border border-dashed border-border hover:border-primary/40 hover:bg-accent/30 text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="size-3.5" />
                  <span>Tambah Blok Paragraf Baru</span>
                </button>
              </div>

              {/* Backlinks & Referencing Section (§6.2) */}
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Network className="size-3.5 text-indigo-500" />
                    Backlinks ({backlinks.length} catatan menautkan ke sini)
                  </span>
                  <button
                    onClick={() => setIsLinkModalOpen(true)}
                    className="text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    + Buat Tautan Baru
                  </button>
                </div>

                {backlinks.length === 0 ? (
                  <p className="text-[11px] text-muted-foreground italic">
                    Belum ada catatan lain yang menautkan ke catatan ini. Gunakan fitur "Tautkan" untuk menghubungkan.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {backlinks.map((bn) => (
                      <button
                        key={bn.id}
                        onClick={() => setSelectedNoteId(bn.id)}
                        className="px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-accent text-xs text-foreground flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{bn.icon || "📄"}</span>
                        <span>{bn.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <FileText className="size-10 text-muted-foreground/40" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">Pilih atau Buat Catatan</h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Pilih catatan di panel samping untuk mulai mengedit atau klik "Catatan Baru".
                </p>
              </div>
              <button
                onClick={() => {
                  const n = addNote();
                  setSelectedNoteId(n.id);
                }}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
              >
                Buat Catatan Sekarang
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 3. MODAL: TEMPLATE PICKER (§11) */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <h3 className="text-sm font-bold text-foreground">Pilih Template Catatan Reusable</h3>
              </div>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    const n = applyTemplate(tpl);
                    setSelectedNoteId(n.id);
                    setIsTemplateModalOpen(false);
                  }}
                  className="p-4 rounded-xl border border-border bg-background hover:border-primary hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">{tpl.description}</p>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-transform" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: GRAPH VIEW VISUALIZATION (§6 & §10) */}
      {isGraphModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Network className="size-5 text-indigo-500" />
                <div>
                  <h3 className="text-sm font-bold text-foreground">Graph View: Jaringan Relasi Catatan</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Visualisasi relasi tautan internal antar-catatan dalam ekosistem.
                  </p>
                </div>
              </div>
              <button onClick={() => setIsGraphModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            {/* Visual SVG Network Simulation */}
            <div className="h-80 bg-background rounded-2xl relative overflow-hidden flex items-center justify-center p-4 border border-border">
              <div className="absolute top-3 left-3 text-[10px] text-muted-foreground font-mono">
                {notes.filter((n) => !n.isTrashed).length} Catatan • {links.length} Tautan Aktif
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full max-w-lg">
                {notes
                  .filter((n) => !n.isTrashed)
                  .slice(0, 6)
                  .map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setSelectedNoteId(n.id);
                        setIsGraphModalOpen(false);
                      }}
                      className="p-3 rounded-xl bg-background border border-border/60 hover:border-indigo-500 hover:scale-105 transition-all text-center cursor-pointer space-y-1 shadow-md"
                    >
                      <span className="text-xl block">{n.icon || "📄"}</span>
                      <span className="text-xs font-semibold text-foreground line-clamp-1 block">
                        {n.title}
                      </span>
                      <span className="text-[9px] text-indigo-400 font-mono block">
                        {links.filter((l) => l.targetNoteId === n.id || l.sourceNoteId === n.id).length} koneksi
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD LINK */}
      {isLinkModalOpen && currentNote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Tautkan ke Catatan Lain</h3>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Pilih catatan tujuan untuk membuat relasi internal (backlink) dua arah:
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notes
                .filter((n) => n.id !== currentNote.id && !n.isTrashed)
                .map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      addLink(currentNote.id, n.id);
                      setIsLinkModalOpen(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-border hover:bg-accent text-xs font-medium text-foreground flex items-center justify-between cursor-pointer"
                  >
                    <span>{n.title}</span>
                    <Plus className="size-3 text-primary" />
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: STATISTICS (§13) */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-5 text-purple-500" />
                <h3 className="text-sm font-bold text-foreground">Statistik & Metrik Notes (#12)</h3>
              </div>
              <button onClick={() => setIsStatsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-muted/40 text-center border border-border">
                <span className="text-xs text-muted-foreground block">Catatan Aktif</span>
                <span className="text-2xl font-black text-foreground">{statistics.activeCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 text-center border border-border">
                <span className="text-xs text-muted-foreground block">Rata-rata Kata</span>
                <span className="text-2xl font-black text-indigo-500">{statistics.avgWordCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 text-center border border-border">
                <span className="text-xs text-muted-foreground block">Diarsipkan</span>
                <span className="text-2xl font-black text-foreground">{statistics.archivedCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 text-center border border-border">
                <span className="text-xs text-muted-foreground block">Tempat Sampah</span>
                <span className="text-2xl font-black text-rose-500">{statistics.trashedCount}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Catatan Paling Banyak Ditautkan (Top Backlinks)
              </h4>
              {statistics.mostLinked.length === 0 ? (
                <p className="text-xs text-muted-foreground">Belum ada tautan internal antar catatan.</p>
              ) : (
                statistics.mostLinked.map((ml) => (
                  <div key={ml.id} className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                    <span className="text-foreground font-medium truncate max-w-xs">{ml.title}</span>
                    <span className="text-muted-foreground">{ml.count} rujukan backlink</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. DRAWER: ACTIVITY AUDIT TRAIL (§12) */}
      {isHistoryDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-card border-l border-border w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <History className="size-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Activity History (Audit Trail)</h3>
              </div>
              <button onClick={() => setIsHistoryDrawerOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {activities.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-12">Belum ada aktivitas tercatat.</p>
              ) : (
                activities.map((act) => (
                  <div key={act.id} className="relative pl-5 border-l-2 border-border space-y-1 py-1">
                    <span className="absolute -left-[5px] top-2 size-2 rounded-full bg-primary" />
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="uppercase font-semibold tracking-wider">{act.type}</span>
                      <span>{new Date(act.createdAt).toLocaleString("id-ID")}</span>
                    </div>
                    <p className="text-xs text-foreground font-medium">{act.description}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 8. PIN PROMPT MODAL */}
      {lockPromptNoteId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleUnlockPin} className="bg-card border border-border rounded-2xl w-full max-w-xs shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/50 text-rose-600 mx-auto flex items-center justify-center">
              <Lock className="size-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">Catatan Dilindungi PIN</h4>
              <p className="text-xs text-muted-foreground">Masukkan PIN untuk membuka konten catatan ini.</p>
            </div>

            <input
              type="password"
              autoFocus
              maxLength={6}
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="PIN (Default: 1234)"
              className="w-full text-center text-sm tracking-widest font-mono px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />

            {pinError && <p className="text-[11px] text-rose-500 font-medium">{pinError}</p>}

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLockPromptNoteId(null)}
                className="px-3 py-1.5 rounded-xl border border-border text-xs text-foreground"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Buka
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
