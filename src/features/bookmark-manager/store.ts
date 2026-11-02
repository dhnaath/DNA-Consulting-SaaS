import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import { Bookmark, Folder, Tag, LinkCheck, Collection, BookmarkStatus } from "./types";

interface BookmarkStore {
  bookmarks: Bookmark[];
  folders: Folder[];
  tags: Tag[];
  linkChecks: LinkCheck[];
  collections: Collection[];
  selectedFolderId: string | null;
  selectedTag: string | null;

  // Actions
  addBookmark: (bookmark: Omit<Bookmark, "id" | "addedAt">) => void;
  updateBookmark: (id: string, updates: Partial<Bookmark>) => void;
  deleteBookmark: (id: string) => void;
  setBookmarkStatus: (id: string, status: BookmarkStatus) => void;
  moveBookmark: (id: string, folderId: string | null) => void;
  checkLink: (id: string) => Promise<boolean>;
  checkAllLinks: () => Promise<void>;
  
  // Folder Actions
  addFolder: (name: string, parentFolderId?: string | null) => void;
  updateFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;
  setSelectedFolderId: (id: string | null) => void;

  // Tag Actions
  addTag: (name: string, color?: string) => void;
  deleteTag: (id: string) => void;
  setSelectedTag: (tag: string | null) => void;

  // Collection Actions
  createCollection: (name: string, description: string, bookmarkIds: string[], isPublic?: boolean) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
}

const INITIAL_FOLDERS: Folder[] = [
  { id: "f-root-1", name: "Engineering & Tech", parentFolderId: null, order: 1 },
  { id: "f-sub-11", name: "Frontend Architecture", parentFolderId: "f-root-1", order: 1 },
  { id: "f-sub-12", name: "Cloud & Microservices", parentFolderId: "f-root-1", order: 2 },
  { id: "f-root-2", name: "Keuangan & Valuasi", parentFolderId: null, order: 2 },
  { id: "f-sub-21", name: "Valuasi Bisnis", parentFolderId: "f-root-2", order: 1 },
  { id: "f-sub-22", name: "Analisis Sensitivitas", parentFolderId: "f-root-2", order: 2 },
  { id: "f-root-3", name: "Design & UX Research", parentFolderId: null, order: 3 },
  { id: "f-root-4", name: "Bacaan Nanti", parentFolderId: null, order: 4 },
];

const INITIAL_TAGS: Tag[] = [
  { id: "t-1", name: "react", color: "#3b82f6" },
  { id: "t-2", name: "typescript", color: "#6366f1" },
  { id: "t-3", name: "tailwind", color: "#06b6d4" },
  { id: "t-4", name: "valuasi", color: "#8b5cf6" },
  { id: "t-5", name: "research", color: "#ec4899" },
  { id: "t-6", name: "architecture", color: "#10b981" },
  { id: "t-7", name: "security", color: "#ef4444" },
  { id: "t-8", name: "performance", color: "#f59e0b" },
];

const INITIAL_BOOKMARKS: Bookmark[] = [
  {
    id: "bm-1",
    url: "https://react.dev/reference/react/hooks",
    title: "React Official Documentation: Complete Hook Reference",
    description: "Deep dive ke useMemo, useCallback, dan aturan Hooks terkini v19.",
    faviconUrl: "https://react.dev/favicon.ico",
    folderId: "f-sub-11",
    tags: ["react", "typescript", "architecture"],
    status: "active",
    addedAt: "2026-09-10T10:15:00Z",
    lastCheckedAt: "2026-09-24T06:00:00Z",
  },
  {
    id: "bm-2",
    url: "https://tailwindcss.com/docs/v4-beta",
    title: "Tailwind CSS v4 Oxide Engine & CSS First Directives",
    description: "Dokumentasi migrasi Tailwind v4 dengan @import syntax dan lightningcss.",
    faviconUrl: "https://tailwindcss.com/favicon.ico",
    folderId: "f-sub-11",
    tags: ["tailwind", "performance"],
    status: "active",
    addedAt: "2026-09-12T14:30:00Z",
    lastCheckedAt: "2026-09-24T06:00:00Z",
  },
  {
    id: "bm-3",
    url: "https://example.org/valuation-handbook",
    title: "Valuation Handbook: Methods and Case Studies",
    description: "Buku rujukan metode valuasi DCF, multiple, dan studi kasus transaksi.",
    faviconUrl: "https://example.org/favicon.ico",
    folderId: "f-sub-21",
    tags: ["valuasi", "research"],
    status: "unread",
    addedAt: "2026-09-15T09:00:00Z",
    lastCheckedAt: "2026-09-23T12:00:00Z",
  },
  {
    id: "bm-4",
    url: "https://example.org/sensitivity-analysis",
    title: "Panduan Analisis Sensitivitas dan Skenario Valuasi",
    description: "Panduan praktis membangun tabel sensitivitas WACC dan pertumbuhan terminal.",
    faviconUrl: "https://example.org/favicon.ico",
    folderId: "f-sub-22",
    tags: ["valuasi", "architecture"],
    status: "active",
    addedAt: "2026-09-18T16:40:00Z",
    lastCheckedAt: "2026-09-24T05:30:00Z",
  },
  {
    id: "bm-5",
    url: "https://legacy-docs.oldinternal.net/oauth-v1-spec.html",
    title: "Legacy Internal API Auth Specifications (Deprecated 2024)",
    description: "Dokumen rujukan otentikasi server lama yang server aslinya sudah ditutup.",
    faviconUrl: "",
    folderId: "f-sub-12",
    tags: ["security"],
    status: "broken",
    addedAt: "2026-08-01T11:00:00Z",
    lastCheckedAt: "2026-09-23T08:00:00Z",
  },
  {
    id: "bm-6",
    url: "https://principles.design/examples/govuk-design-principles",
    title: "GOV.UK Design System: Accessibility and Clarity Principles",
    description: "Prinsip desain layanan publik berfokus pada kesederhanaan dan inklusivitas.",
    faviconUrl: "https://principles.design/favicon.ico",
    folderId: "f-root-3",
    tags: ["research"],
    status: "unread",
    addedAt: "2026-09-20T11:20:00Z",
    lastCheckedAt: "2026-09-24T06:00:00Z",
  },
  {
    id: "bm-7",
    url: "https://web.dev/articles/vitals-measurement-best-practices",
    title: "Web.dev: Next Generation Core Web Vitals Optimization",
    description: "Panduan teknis INP (Interaction to Next Paint) dan LCP micro-optimizations.",
    faviconUrl: "https://web.dev/favicon.ico",
    folderId: "f-root-4",
    tags: ["performance", "react"],
    status: "unread",
    addedAt: "2026-09-21T08:10:00Z",
    lastCheckedAt: "2026-09-24T04:15:00Z",
  },
  {
    id: "bm-8",
    url: "https://broken-archive-blog.example.org/articles/lost-in-time-2021",
    title: "Deep Dive into Browser Process Memory Leaks (404 Not Found)",
    description: "Artikel lama tentang profiling Chromium v8 engine - link mati.",
    faviconUrl: "",
    folderId: "f-root-4",
    tags: ["performance"],
    status: "broken",
    addedAt: "2026-07-15T10:00:00Z",
    lastCheckedAt: "2026-09-24T02:00:00Z",
  },
];

const INITIAL_LINK_CHECKS: LinkCheck[] = [
  { id: "lc-1", bookmarkId: "bm-1", checkedAt: "2026-09-24T06:00:00Z", httpStatus: 200, isReachable: true, responseTimeMs: 142 },
  { id: "lc-2", bookmarkId: "bm-2", checkedAt: "2026-09-24T06:00:00Z", httpStatus: 200, isReachable: true, responseTimeMs: 180 },
  { id: "lc-3", bookmarkId: "bm-3", checkedAt: "2026-09-23T12:00:00Z", httpStatus: 200, isReachable: true, responseTimeMs: 290 },
  { id: "lc-4", bookmarkId: "bm-4", checkedAt: "2026-09-24T05:30:00Z", httpStatus: 200, isReachable: true, responseTimeMs: 110 },
  { id: "lc-5", bookmarkId: "bm-5", checkedAt: "2026-09-23T08:00:00Z", httpStatus: 404, isReachable: false, responseTimeMs: 450 },
  { id: "lc-6", bookmarkId: "bm-6", checkedAt: "2026-09-24T06:00:00Z", httpStatus: 200, isReachable: true, responseTimeMs: 165 },
  { id: "lc-7", bookmarkId: "bm-7", checkedAt: "2026-09-24T04:15:00Z", httpStatus: 200, isReachable: true, responseTimeMs: 195 },
  { id: "lc-8", bookmarkId: "bm-8", checkedAt: "2026-09-24T02:00:00Z", httpStatus: 502, isReachable: false, responseTimeMs: 500 },
];

const INITIAL_COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    name: "Frontend Onboarding 2026",
    description: "Kumpulan tautan wajib untuk developer baru menguasai React, Tailwind v4, dan Performance Vitals.",
    bookmarkIds: ["bm-1", "bm-2", "bm-7"],
    isPublic: true,
    ownerId: "user-lead-eng",
    createdAt: "2026-09-15T12:00:00Z",
  },
  {
    id: "col-2",
    name: "Referensi Valuasi Bisnis",
    description: "Rujukan dasar metode valuasi DCF, multiple, dan analisis sensitivitas.",
    bookmarkIds: ["bm-3", "bm-4"],
    isPublic: true,
    ownerId: "user-valuation-analyst",
    createdAt: "2026-09-19T08:30:00Z",
  },
];

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: INITIAL_BOOKMARKS,
      folders: INITIAL_FOLDERS,
      tags: INITIAL_TAGS,
      linkChecks: INITIAL_LINK_CHECKS,
      collections: INITIAL_COLLECTIONS,
      selectedFolderId: null,
      selectedTag: null,

      addBookmark: (data) => {
        const newBm: Bookmark = {
          ...data,
          id: `bm-${Date.now()}`,
          addedAt: new Date().toISOString(),
          status: data.status || "active",
        };
        set((state) => ({ bookmarks: [newBm, ...state.bookmarks] }));
      },

      updateBookmark: (id, updates) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((bm) => (bm.id === id ? { ...bm, ...updates } : bm)),
        }));
      },

      deleteBookmark: (id) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((bm) => bm.id !== id),
          collections: state.collections.map((col) => ({
            ...col,
            bookmarkIds: col.bookmarkIds.filter((bId) => bId !== id),
          })),
        }));
      },

      setBookmarkStatus: (id, status) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((bm) => (bm.id === id ? { ...bm, status } : bm)),
        }));
      },

      moveBookmark: (id, folderId) => {
        set((state) => ({
          bookmarks: state.bookmarks.map((bm) => (bm.id === id ? { ...bm, folderId } : bm)),
        }));
      },

      checkLink: async (id) => {
        const bm = get().bookmarks.find((b) => b.id === id);
        if (!bm) return false;

        const isBrokenTarget = bm.url.includes("broken") || bm.url.includes("legacy-docs") || bm.url.includes("invalid");
        const status = isBrokenTarget ? 404 : 200;
        const reachable = status === 200;

        const linkCheck: LinkCheck = {
          id: `lc-${Date.now()}`,
          bookmarkId: id,
          checkedAt: new Date().toISOString(),
          httpStatus: status,
          isReachable: reachable,
          responseTimeMs: Math.floor(Math.random() * 200) + 80,
        };

        set((state) => ({
          linkChecks: [linkCheck, ...state.linkChecks],
          bookmarks: state.bookmarks.map((b) =>
            b.id === id
              ? {
                  ...b,
                  lastCheckedAt: linkCheck.checkedAt,
                  status: reachable ? (b.status === "broken" ? "active" : b.status) : "broken",
                }
              : b
          ),
        }));

        return reachable;
      },

      checkAllLinks: async () => {
        const currentBookmarks = get().bookmarks;
        for (const bm of currentBookmarks) {
          await get().checkLink(bm.id);
        }
      },

      addFolder: (name, parentFolderId = null) => {
        const newFolder: Folder = {
          id: `f-${Date.now()}`,
          name,
          parentFolderId: parentFolderId || null,
          order: get().folders.length + 1,
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
      },

      updateFolder: (id, name) => {
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        }));
      },

      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id && f.parentFolderId !== id),
          bookmarks: state.bookmarks.map((bm) => (bm.folderId === id ? { ...bm, folderId: null } : bm)),
          selectedFolderId: state.selectedFolderId === id ? null : state.selectedFolderId,
        }));
      },

      setSelectedFolderId: (id) => set({ selectedFolderId: id }),

      addTag: (name, color = "#3b82f6") => {
        const normalized = name.toLowerCase().trim();
        if (!normalized) return;
        if (get().tags.some((t) => t.name.toLowerCase() === normalized)) return;
        const newTag: Tag = { id: `t-${Date.now()}`, name: normalized, color };
        set((state) => ({ tags: [...state.tags, newTag] }));
      },

      deleteTag: (id) => {
        const tag = get().tags.find((t) => t.id === id);
        if (!tag) return;
        set((state) => ({
          tags: state.tags.filter((t) => t.id !== id),
          bookmarks: state.bookmarks.map((bm) => ({
            ...bm,
            tags: bm.tags.filter((t) => t !== tag.name),
          })),
          selectedTag: state.selectedTag === tag.name ? null : state.selectedTag,
        }));
      },

      setSelectedTag: (tag) => set({ selectedTag: tag }),

      createCollection: (name, description, bookmarkIds, isPublic = true) => {
        const newCol: Collection = {
          id: `col-${Date.now()}`,
          name,
          description,
          bookmarkIds,
          isPublic,
          ownerId: "current-user",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ collections: [newCol, ...state.collections] }));
      },

      updateCollection: (id, updates) => {
        set((state) => ({
          collections: state.collections.map((col) => (col.id === id ? { ...col, ...updates } : col)),
        }));
      },

      deleteCollection: (id) => {
        set((state) => ({
          collections: state.collections.filter((col) => col.id !== id),
        }));
      },
    }),
    {
      name: "ecosystem-bookmark-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
