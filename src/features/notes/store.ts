import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Note,
  Block,
  Notebook,
  Folder,
  Tag,
  Link,
  Version,
  Comment,
  Activity,
  NoteTemplate,
} from "./types";
import { getRaw, setRaw } from "../../core/rawStorage";

export const NOTES_STORAGE_KEY = "aio_notes_data_v1";
export const TASK_STORAGE_KEY = "aio_task_manager_data_v1";

export const DEFAULT_NOTEBOOKS: Notebook[] = [
  { id: "nb-work", name: "Kerja & Strategi", color: "#3B82F6", icon: "Briefcase", createdAt: new Date().toISOString() },
  { id: "nb-tech", name: "Teknologi & Riset", color: "#8B5CF6", icon: "Code", createdAt: new Date().toISOString() },
  { id: "nb-personal", name: "Pribadi & Jurnal", color: "#10B981", icon: "User", createdAt: new Date().toISOString() },
  { id: "nb-ideas", name: "Ide & Brainstorming", color: "#F59E0B", icon: "Lightbulb", createdAt: new Date().toISOString() },
];

export const DEFAULT_FOLDERS: Folder[] = [
  { id: "fld-office", name: "Kantor & Proyek", createdAt: new Date().toISOString() },
  { id: "fld-personal", name: "Personal Life", createdAt: new Date().toISOString() },
];

export const DEFAULT_TAGS: Tag[] = [
  { id: "tag-strategy", name: "Strategi", color: "#3B82F6" },
  { id: "tag-meeting", name: "Meeting", color: "#EC4899" },
  { id: "tag-architecture", name: "Arsitektur", color: "#8B5CF6" },
  { id: "tag-journal", name: "Jurnal", color: "#10B981" },
  { id: "tag-urgent", name: "Prioritas", color: "#EF4444" },
];

export const NOTE_TEMPLATES: NoteTemplate[] = [
  {
    id: "tpl-meeting",
    title: "Meeting Notes",
    description: "Template risalah rapat dengan agenda, diskusi, dan action items to-do.",
    icon: "Users",
    defaultNotebookId: "nb-work",
    tags: ["Meeting"],
    blocks: [
      { type: "heading_1", content: "Risalah Rapat: [Topik Rapat]", order: 1 },
      { type: "callout", content: "Waktu: [Tanggal/Jam] | Peserta: [Nama Tim]", order: 2 },
      { type: "heading_2", content: "Agenda Utama", order: 3 },
      { type: "bulleted_list", content: "Evaluasi pencapaian minggu lalu", order: 4 },
      { type: "bulleted_list", content: "Hambatan operasional utama", order: 5 },
      { type: "heading_2", content: "Poin Diskusi & Keputusan", order: 6 },
      { type: "paragraph", content: "Catat keputusan penting dan arahan manajemen di sini.", order: 7 },
      { type: "heading_2", content: "Action Items", order: 8 },
      { type: "checklist", content: "Finalisasi draf proposal revisi", checked: false, order: 9 },
      { type: "checklist", content: "Kirim email konfirmasi ke stakeholder", checked: false, order: 10 },
    ],
  },
  {
    id: "tpl-tech-spec",
    title: "Spesifikasi Teknis & Desain",
    description: "Struktur dokumentasi arsitektur sistem, skema, dan blok kode.",
    icon: "FileCode",
    defaultNotebookId: "nb-tech",
    tags: ["Arsitektur"],
    blocks: [
      { type: "heading_1", content: "Spesifikasi Teknis: [Nama Modul]", order: 1 },
      { type: "callout", content: "Status: Draft | Target Implementasi: Sprint 12", order: 2 },
      { type: "heading_2", content: "1. Latar Belakang & Kebutuhan", order: 3 },
      { type: "paragraph", content: "Penjelasan mengapa komponen ini dibuat dan batas lingkupnya.", order: 4 },
      { type: "heading_2", content: "2. Model Data & Skema", order: 5 },
      {
        type: "code",
        content: "interface ModuleConfig {\n  id: string;\n  enabled: boolean;\n  retryAttempts: number;\n}",
        language: "typescript",
        order: 6,
      },
      { type: "heading_2", content: "3. Kriteria Keberhasilan", order: 7 },
      { type: "checklist", content: "Latency API di bawah 150ms pada P95", checked: false, order: 8 },
      { type: "checklist", content: "Unit test coverage minimal 85%", checked: false, order: 9 },
    ],
  },
  {
    id: "tpl-journal",
    title: "Daily Reflection & Jurnal",
    description: "Refleksi harian rasa syukur, pencapaian kunci, dan fokus esok hari.",
    icon: "BookOpen",
    defaultNotebookId: "nb-personal",
    tags: ["Jurnal"],
    blocks: [
      { type: "heading_1", content: "Jurnal Harian: Refleksi & Evaluasi Diri", order: 1 },
      { type: "quote", content: "Fokus bukan pada kesempurnaan, melainkan konsistensi kemajuan setiap hari.", order: 2 },
      { type: "heading_2", content: "3 Hal yang Saya Syukuri Hari Ini", order: 3 },
      { type: "bulleted_list", content: "Kesehatan keluarga yang terjaga dengan baik", order: 4 },
      { type: "bulleted_list", content: "Penyelesaian milestone penting di kantor", order: 5 },
      { type: "bulleted_list", content: "Waktu istirahat dan membaca buku malam ini", order: 6 },
      { type: "heading_2", content: "Fokus Terpenting Esok Hari", order: 7 },
      { type: "checklist", content: "Selesaikan review dokumen kontrak sebelum jam 12", checked: false, order: 8 },
    ],
  },
];

// Helper to count words across all blocks
export function countWords(blocks: Block[]): number {
  return blocks.reduce((acc, b) => {
    if (!b.content) return acc;
    const words = b.content.trim().split(/\s+/).filter(Boolean);
    return acc + words.length;
  }, 0);
}

const SEED_NOTES: Note[] = [
  {
    id: "note-1",
    title: "Rencana Strategi Q4 2026: Skala Pasar & Produk",
    notebookId: "nb-work",
    tags: ["Strategi", "Prioritas"],
    icon: "🎯",
    pinned: true,
    favorited: true,
    isLocked: false,
    isArchived: false,
    isTrashed: false,
    wordCount: 145,
    blocks: [
      {
        id: "b-1",
        noteId: "note-1",
        type: "heading_1",
        content: "Rencana Strategi Q4 2026: Skala Pasar & Produk",
        order: 1,
      },
      {
        id: "b-2",
        noteId: "note-1",
        type: "callout",
        content: "Dokumen kerja internal tim kepemimpinan. Target utama: peluncuran multi-tenant suite.",
        order: 2,
      },
      {
        id: "b-3",
        noteId: "note-1",
        type: "paragraph",
        content:
          "Dalam kuartal ini kita mengkonsolidasikan seluruh kapabilitas ekosistem aplikasi ke dalam arsitektur yang modular dan terintegrasi via reference.",
        order: 3,
      },
      {
        id: "b-4",
        noteId: "note-1",
        type: "heading_2",
        content: "Pilar Eksekusi Utama",
        order: 4,
      },
      {
        id: "b-5",
        noteId: "note-1",
        type: "checklist",
        content: "Audit kompatibilitas data store seluruh aplikasi mandiri",
        checked: true,
        order: 5,
      },
      {
        id: "b-6",
        noteId: "note-1",
        type: "checklist",
        content: "Sinkronisasi dokumen formal dengan Documents (#13)",
        checked: false,
        order: 6,
      },
      {
        id: "b-7",
        noteId: "note-1",
        type: "quote",
        content: "Kecepatan eksekusi yang baik berakar dari kejelasan referensi antar-modul.",
        order: 7,
      },
    ],
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "note-2",
    title: "Arsitektur Micro-Frontends & Standalone Ecosystem",
    notebookId: "nb-tech",
    tags: ["Arsitektur"],
    icon: "⚡",
    pinned: true,
    favorited: false,
    isLocked: false,
    isArchived: false,
    isTrashed: false,
    wordCount: 120,
    blocks: [
      {
        id: "b-21",
        noteId: "note-2",
        type: "heading_1",
        content: "Arsitektur Micro-Frontends & Standalone Ecosystem",
        order: 1,
      },
      {
        id: "b-22",
        noteId: "note-2",
        type: "paragraph",
        content:
          "Setiap aplikasi berdiri mandiri dengan fungsi dan single source of truth masing-masing. Komunikasi antar-aplikasi menggunakan ID reference tanpa menduplikasi basis data.",
        order: 2,
      },
      {
        id: "b-23",
        noteId: "note-2",
        type: "code",
        content: "// Referensi entitas silang antar aplikasi\ninterface EntityRef {\n  appId: string;\n  entityId: string;\n  entityType: 'document' | 'task' | 'milestone' | 'note';\n}",
        language: "typescript",
        order: 3,
      },
      {
        id: "b-24",
        noteId: "note-2",
        type: "bulleted_list",
        content: "Notes (#12) menangani ide kasual, blok granular, dan backlink.",
        order: 4,
      },
      {
        id: "b-25",
        noteId: "note-2",
        type: "bulleted_list",
        content: "Documents (#13) menangani dokumen formal dengan nomor versi resmi dan approval.",
        order: 5,
      },
    ],
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "note-3",
    title: "Refleksi Mingguan & Catatan Buku",
    notebookId: "nb-personal",
    tags: ["Jurnal"],
    icon: "📖",
    pinned: false,
    favorited: true,
    isLocked: false,
    isArchived: false,
    isTrashed: false,
    wordCount: 95,
    blocks: [
      {
        id: "b-31",
        noteId: "note-3",
        type: "heading_1",
        content: "Refleksi Mingguan: Mengatur Fokus & Energi",
        order: 1,
      },
      {
        id: "b-32",
        noteId: "note-3",
        type: "paragraph",
        content: "Belajar membedakan antara tugas mendesak dan tugas berdampak jangka panjang.",
        order: 2,
      },
      {
        id: "b-33",
        noteId: "note-3",
        type: "checklist",
        content: "Tidur minimal 7 jam setiap malam",
        checked: true,
        order: 3,
      },
      {
        id: "b-34",
        noteId: "note-3",
        type: "checklist",
        content: "Kurangi screen-time 30 menit sebelum tidur",
        checked: false,
        order: 4,
      },
    ],
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

const SEED_LINKS: Link[] = [
  {
    id: "lnk-1",
    sourceNoteId: "note-1",
    targetNoteId: "note-2",
    createdAt: new Date().toISOString(),
  },
];

const SEED_VERSIONS: Version[] = [
  {
    id: "ver-1",
    noteId: "note-1",
    contentSnapshot: SEED_NOTES[0].blocks,
    changeSummary: "Draf inisial pilar strategi Q4",
    editedBy: "Owner",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
];

const SEED_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    noteId: "note-1",
    type: "created",
    description: "Membuat catatan baru 'Rencana Strategi Q4 2026'",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "act-2",
    noteId: "note-1",
    type: "link_added",
    description: "Menautkan catatan ke 'Arsitektur Micro-Frontends'",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: "act-3",
    noteId: "note-2",
    type: "created",
    description: "Membuat catatan 'Arsitektur Micro-Frontends & Standalone Ecosystem'",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
];

interface NotesState {
  notes: Note[];
  notebooks: Notebook[];
  folders: Folder[];
  tags: Tag[];
  links: Link[];
  versions: Version[];
  comments: Comment[];
  activities: Activity[];
}

export function useNotesStore() {
  const [state, setState] = useState<NotesState>(() => {
    try {
      const saved = getRaw(NOTES_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.notes && Array.isArray(parsed.notes)) {
          return {
            notes: parsed.notes,
            notebooks: parsed.notebooks || DEFAULT_NOTEBOOKS,
            folders: parsed.folders || DEFAULT_FOLDERS,
            tags: parsed.tags || DEFAULT_TAGS,
            links: parsed.links || SEED_LINKS,
            versions: parsed.versions || SEED_VERSIONS,
            comments: parsed.comments || [],
            activities: parsed.activities || SEED_ACTIVITIES,
          };
        }
      }
    } catch (e) {
      console.error("Failed to load notes store", e);
    }
    return {
      notes: SEED_NOTES,
      notebooks: DEFAULT_NOTEBOOKS,
      folders: DEFAULT_FOLDERS,
      tags: DEFAULT_TAGS,
      links: SEED_LINKS,
      versions: SEED_VERSIONS,
      comments: [],
      activities: SEED_ACTIVITIES,
    };
  });

  useEffect(() => {
    try {
      setRaw(NOTES_STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to save notes store", e);
    }
  }, [state]);

  // Actions
  const addNote = useCallback(
    (input?: {
      title?: string;
      notebookId?: string;
      tags?: string[];
      icon?: string;
      blocks?: Block[];
    }) => {
      const nowISO = new Date().toISOString();
      const id = `note-${Date.now()}`;
      const defaultBlocks: Block[] = input?.blocks || [
        {
          id: `b-${Date.now()}-1`,
          noteId: id,
          type: "heading_1",
          content: input?.title || "Catatan Tanpa Judul",
          order: 1,
        },
        {
          id: `b-${Date.now()}-2`,
          noteId: id,
          type: "paragraph",
          content: "",
          order: 2,
        },
      ];

      const newNote: Note = {
        id,
        title: input?.title || "Catatan Tanpa Judul",
        notebookId: input?.notebookId || DEFAULT_NOTEBOOKS[0].id,
        tags: input?.tags || [],
        icon: input?.icon || "📝",
        pinned: false,
        favorited: false,
        isLocked: false,
        isArchived: false,
        isTrashed: false,
        wordCount: countWords(defaultBlocks),
        blocks: defaultBlocks,
        createdAt: nowISO,
        updatedAt: nowISO,
      };

      const newAct: Activity = {
        id: `act-${Date.now()}`,
        noteId: id,
        type: "created",
        description: `Membuat catatan baru: "${newNote.title}"`,
        createdAt: nowISO,
      };

      setState((prev) => ({
        ...prev,
        notes: [newNote, ...prev.notes],
        activities: [newAct, ...prev.activities],
      }));

      return newNote;
    },
    []
  );

  const applyTemplate = useCallback((tpl: NoteTemplate) => {
    const nowISO = new Date().toISOString();
    const id = `note-${Date.now()}`;
    const blocks: Block[] = tpl.blocks.map((b, i) => ({
      ...b,
      id: `b-${Date.now()}-${i}`,
      noteId: id,
      order: i + 1,
    }));

    const newNote: Note = {
      id,
      title: tpl.title,
      notebookId: tpl.defaultNotebookId || DEFAULT_NOTEBOOKS[0].id,
      tags: tpl.tags,
      icon: "✨",
      pinned: false,
      favorited: false,
      isLocked: false,
      isArchived: false,
      isTrashed: false,
      wordCount: countWords(blocks),
      blocks,
      createdAt: nowISO,
      updatedAt: nowISO,
    };

    const newAct: Activity = {
      id: `act-${Date.now()}`,
      noteId: id,
      type: "created",
      description: `Menerapkan template "${tpl.title}"`,
      createdAt: nowISO,
    };

    setState((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
      activities: [newAct, ...prev.activities],
    }));

    return newNote;
  }, []);

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const idx = prev.notes.findIndex((n) => n.id === id);
      if (idx === -1) return prev;
      const oldNote = prev.notes[idx];
      const updatedNote: Note = {
        ...oldNote,
        ...updates,
        updatedAt: nowISO,
      };
      if (updates.blocks) {
        updatedNote.wordCount = countWords(updates.blocks);
        // If title is empty, derive from first block content
        if (!updatedNote.title.trim() && updates.blocks.length > 0 && updates.blocks[0].content) {
          updatedNote.title = updates.blocks[0].content.slice(0, 50);
        }
      }

      const list = [...prev.notes];
      list[idx] = updatedNote;
      return { ...prev, notes: list };
    });
  }, []);

  const updateNoteBlocks = useCallback(
    (id: string, blocks: Block[], createSnapshot: boolean = false, summary: string = "Perubahan konten") => {
      const nowISO = new Date().toISOString();
      setState((prev) => {
        const idx = prev.notes.findIndex((n) => n.id === id);
        if (idx === -1) return prev;
        const oldNote = prev.notes[idx];
        const newWordCount = countWords(blocks);

        // Derive title if empty
        let derivedTitle = oldNote.title;
        if ((!derivedTitle || derivedTitle === "Catatan Tanpa Judul") && blocks.length > 0 && blocks[0].content) {
          derivedTitle = blocks[0].content.split("\n")[0].slice(0, 60);
        }

        const updatedNote: Note = {
          ...oldNote,
          title: derivedTitle,
          blocks,
          wordCount: newWordCount,
          updatedAt: nowISO,
        };

        const list = [...prev.notes];
        list[idx] = updatedNote;

        const newVersions = [...prev.versions];
        const newActivities = [...prev.activities];

        if (createSnapshot) {
          const vId = `ver-${Date.now()}`;
          newVersions.unshift({
            id: vId,
            noteId: id,
            contentSnapshot: blocks,
            changeSummary: summary,
            editedBy: "Current User",
            createdAt: nowISO,
          });
          newActivities.unshift({
            id: `act-${Date.now()}`,
            noteId: id,
            type: "edited",
            description: `Snapshot versi disimpan: ${summary}`,
            createdAt: nowISO,
          });
        }

        return {
          ...prev,
          notes: list,
          versions: newVersions,
          activities: newActivities,
        };
      });
    },
    []
  );

  const togglePin = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, pinned: !n.pinned, updatedAt: new Date().toISOString() } : n
      ),
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, favorited: !n.favorited, updatedAt: new Date().toISOString() } : n
      ),
    }));
  }, []);

  const toggleLock = useCallback((id: string, pin?: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id
          ? {
              ...n,
              isLocked: !n.isLocked,
              lockPin: !n.isLocked ? pin || "1234" : undefined,
              updatedAt: new Date().toISOString(),
            }
          : n
      ),
    }));
  }, []);

  const archiveNote = useCallback((id: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, isArchived: true, archivedAt: nowISO, updatedAt: nowISO } : n
      ),
      activities: [
        {
          id: `act-${Date.now()}`,
          noteId: id,
          type: "archived",
          description: "Memindahkan catatan ke arsip",
          createdAt: nowISO,
        },
        ...prev.activities,
      ],
    }));
  }, []);

  const restoreNote = useCallback((id: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id
          ? {
              ...n,
              isArchived: false,
              isTrashed: false,
              archivedAt: undefined,
              trashedAt: undefined,
              updatedAt: nowISO,
            }
          : n
      ),
      activities: [
        {
          id: `act-${Date.now()}`,
          noteId: id,
          type: "restored",
          description: "Memulihkan catatan kembali aktif",
          createdAt: nowISO,
        },
        ...prev.activities,
      ],
    }));
  }, []);

  const trashNote = useCallback((id: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id ? { ...n, isTrashed: true, trashedAt: nowISO, updatedAt: nowISO } : n
      ),
      activities: [
        {
          id: `act-${Date.now()}`,
          noteId: id,
          type: "trashed",
          description: "Memindahkan catatan ke tempat sampah (soft-delete)",
          createdAt: nowISO,
        },
        ...prev.activities,
      ],
    }));
  }, []);

  const permanentDeleteNote = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
      links: prev.links.filter((l) => l.sourceNoteId !== id && l.targetNoteId !== id),
      versions: prev.versions.filter((v) => v.noteId !== id),
      comments: prev.comments.filter((c) => c.noteId !== id),
      activities: prev.activities.filter((a) => a.noteId !== id),
    }));
  }, []);

  const emptyTrash = useCallback(() => {
    setState((prev) => {
      const trashedIds = new Set(prev.notes.filter((n) => n.isTrashed).map((n) => n.id));
      return {
        ...prev,
        notes: prev.notes.filter((n) => !n.isTrashed),
        links: prev.links.filter(
          (l) => !trashedIds.has(l.sourceNoteId) && !trashedIds.has(l.targetNoteId)
        ),
        versions: prev.versions.filter((v) => !trashedIds.has(v.noteId)),
        comments: prev.comments.filter((c) => !trashedIds.has(c.noteId)),
        activities: prev.activities.filter((a) => !trashedIds.has(a.noteId)),
      };
    });
  }, []);

  const duplicateNote = useCallback((id: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const target = prev.notes.find((n) => n.id === id);
      if (!target) return prev;
      const newId = `note-${Date.now()}`;
      const clonedBlocks: Block[] = target.blocks.map((b, i) => ({
        ...b,
        id: `b-${Date.now()}-${i}`,
        noteId: newId,
      }));

      const clone: Note = {
        ...target,
        id: newId,
        title: `${target.title} (Salinan)`,
        blocks: clonedBlocks,
        pinned: false,
        createdAt: nowISO,
        updatedAt: nowISO,
      };

      return {
        ...prev,
        notes: [clone, ...prev.notes],
        activities: [
          {
            id: `act-${Date.now()}`,
            noteId: newId,
            type: "created",
            description: `Menduplikasi catatan dari "${target.title}"`,
            createdAt: nowISO,
          },
          ...prev.activities,
        ],
      };
    });
  }, []);

  // Backlink & Linking (§6)
  const addLink = useCallback((sourceNoteId: string, targetNoteId: string, blockId?: string) => {
    const newLink: Link = {
      id: `lnk-${Date.now()}`,
      sourceNoteId,
      targetNoteId,
      blockId,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      links: [...prev.links, newLink],
      activities: [
        {
          id: `act-${Date.now()}`,
          noteId: sourceNoteId,
          type: "link_added",
          description: `Menautkan catatan internal`,
          createdAt: new Date().toISOString(),
        },
        ...prev.activities,
      ],
    }));
  }, []);

  const removeLink = useCallback((linkId: string) => {
    setState((prev) => ({
      ...prev,
      links: prev.links.filter((l) => l.id !== linkId),
    }));
  }, []);

  // Versions (§7)
  const restoreVersion = useCallback((versionId: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const ver = prev.versions.find((v) => v.id === versionId);
      if (!ver) return prev;

      const idx = prev.notes.findIndex((n) => n.id === ver.noteId);
      if (idx === -1) return prev;

      const restoredBlocks = ver.contentSnapshot.map((b, i) => ({
        ...b,
        id: `b-${Date.now()}-${i}`,
        noteId: ver.noteId,
      }));

      const updatedNote: Note = {
        ...prev.notes[idx],
        blocks: restoredBlocks,
        wordCount: countWords(restoredBlocks),
        updatedAt: nowISO,
      };

      const list = [...prev.notes];
      list[idx] = updatedNote;

      const newVer: Version = {
        id: `ver-${Date.now()}`,
        noteId: ver.noteId,
        contentSnapshot: restoredBlocks,
        changeSummary: `Dipulihkan dari snapshot (${new Date(ver.createdAt).toLocaleDateString("id-ID")})`,
        editedBy: "Current User",
        createdAt: nowISO,
      };

      return {
        ...prev,
        notes: list,
        versions: [newVer, ...prev.versions],
        activities: [
          {
            id: `act-${Date.now()}`,
            noteId: ver.noteId,
            type: "version_restored",
            description: `Memulihkan konten dari riwayat versi`,
            createdAt: nowISO,
          },
          ...prev.activities,
        ],
      };
    });
  }, []);

  // Convert Note to Task (§3.2)
  const convertNoteToTask = useCallback((noteId: string) => {
    const target = state.notes.find((n) => n.id === noteId);
    if (!target) return;

    try {
      const raw = getRaw(TASK_STORAGE_KEY);
      let tasksData: any = { tasks: [], categories: [] };
      if (raw) tasksData = JSON.parse(raw);

      const newTask = {
        id: `tsk-${Date.now()}`,
        title: target.title,
        description: `Dikonversi dari Notes (#12): ${target.blocks[0]?.content || ""}`,
        priority: "medium",
        status: "todo",
        dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
        createdAt: new Date().toISOString(),
        tags: target.tags,
      };

      tasksData.tasks = [newTask, ...(tasksData.tasks || [])];
      setRaw(TASK_STORAGE_KEY, JSON.stringify(tasksData));
      window.dispatchEvent(new Event("storage"));
      return true;
    } catch (e) {
      console.error("Failed to convert note to task", e);
      return false;
    }
  }, [state.notes]);

  const addNotebook = useCallback((name: string, color: string, icon: string = "Book") => {
    const nb: Notebook = {
      id: `nb-${Date.now()}`,
      name: name.trim(),
      color,
      icon,
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      notebooks: [...prev.notebooks, nb],
    }));
  }, []);

  const addTag = useCallback((name: string, color: string) => {
    const t: Tag = {
      id: `tag-${Date.now()}`,
      name: name.trim(),
      color,
    };
    setState((prev) => ({
      ...prev,
      tags: [...prev.tags, t],
    }));
  }, []);

  // Compute backlinks on-demand (§6.2)
  const getBacklinks = useCallback(
    (noteId: string) => {
      const incomingLinks = state.links.filter((l) => l.targetNoteId === noteId);
      return incomingLinks
        .map((l) => state.notes.find((n) => n.id === l.sourceNoteId))
        .filter(Boolean) as Note[];
    },
    [state.links, state.notes]
  );

  // Statistics (§13)
  const statistics = useMemo(() => {
    const activeNotes = state.notes.filter((n) => !n.isTrashed && !n.isArchived);
    const totalNotes = state.notes.length;
    const activeCount = activeNotes.length;
    const archivedCount = state.notes.filter((n) => n.isArchived).length;
    const trashedCount = state.notes.filter((n) => n.isTrashed).length;

    const totalWords = activeNotes.reduce((acc, n) => acc + (n.wordCount || 0), 0);
    const avgWordCount = activeCount > 0 ? Math.round(totalWords / activeCount) : 0;

    // Notes per notebook
    const notebookDist: Record<string, { count: number; name: string; color: string }> = {};
    state.notebooks.forEach((nb) => {
      notebookDist[nb.id] = { count: 0, name: nb.name, color: nb.color };
    });
    activeNotes.forEach((n) => {
      if (n.notebookId && notebookDist[n.notebookId]) {
        notebookDist[n.notebookId].count++;
      }
    });

    // Most linked notes (Graph ranking)
    const linkCounts: Record<string, number> = {};
    state.links.forEach((l) => {
      linkCounts[l.targetNoteId] = (linkCounts[l.targetNoteId] || 0) + 1;
    });
    const mostLinked = Object.entries(linkCounts)
      .map(([nId, cnt]) => {
        const n = state.notes.find((note) => note.id === nId);
        return { id: nId, title: n?.title || "Catatan", count: cnt };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalNotes,
      activeCount,
      archivedCount,
      trashedCount,
      avgWordCount,
      notebookDist,
      mostLinked,
    };
  }, [state.notes, state.notebooks, state.links]);

  return {
    notes: state.notes,
    notebooks: state.notebooks,
    folders: state.folders,
    tags: state.tags,
    links: state.links,
    versions: state.versions,
    comments: state.comments,
    activities: state.activities,
    templates: NOTE_TEMPLATES,
    statistics,
    addNote,
    applyTemplate,
    updateNote,
    updateNoteBlocks,
    togglePin,
    toggleFavorite,
    toggleLock,
    archiveNote,
    restoreNote,
    trashNote,
    permanentDeleteNote,
    emptyTrash,
    duplicateNote,
    addLink,
    removeLink,
    restoreVersion,
    convertNoteToTask,
    addNotebook,
    addTag,
    getBacklinks,
  };
}
