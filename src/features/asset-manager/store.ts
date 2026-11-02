import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Asset,
  AssetVersion,
  AssetReference,
  AssetFolder,
  AssetTag,
  StorageQuota,
} from "./types";

interface AssetStore {
  assets: Asset[];
  versions: AssetVersion[];
  references: AssetReference[];
  folders: AssetFolder[];
  tags: AssetTag[];
  quota: StorageQuota;
  selectedAssetId: string | null;

  // Actions
  uploadAsset: (asset: Omit<Asset, "id" | "createdAt" | "currentVersionId">, changeNote?: string) => void;
  replaceVersion: (assetId: string, newSizeBytes: number, changeNote: string, newUrl?: string) => void;
  revertToVersion: (assetId: string, versionId: string) => void;
  renameAsset: (id: string, newName: string) => void;
  moveAsset: (id: string, folderId: string | null) => void;
  updateTags: (id: string, tags: string[]) => void;
  
  // Delete checks
  getAssetReferences: (assetId: string) => AssetReference[];
  deleteAsset: (id: string) => { success: boolean; hasActiveReferences: boolean; references: AssetReference[] };
  forceDeleteAsset: (id: string) => void;
  cleanupOrphanAssets: () => number;

  // Folders & Tags
  createFolder: (name: string, parentFolderId?: string | null) => void;
  deleteFolder: (id: string) => void;
  createTag: (name: string, color?: string) => void;
  setSelectedAssetId: (id: string | null) => void;
}

const INITIAL_FOLDERS: AssetFolder[] = [
  { id: "fld-1", name: "Brand & Design System", parentFolderId: null },
  { id: "fld-2", name: "Laporan & Legal Dokumen", parentFolderId: null },
  { id: "fld-3", name: "Engineering & Architecture", parentFolderId: null },
  { id: "fld-4", name: "Media & Dokumentasi", parentFolderId: null },
];

const INITIAL_TAGS: AssetTag[] = [
  { id: "at-1", name: "brand", color: "#3b82f6" },
  { id: "at-2", name: "vector", color: "#6366f1" },
  { id: "at-3", name: "pdf", color: "#ef4444" },
  { id: "at-4", name: "audit", color: "#f59e0b" },
  { id: "at-5", name: "architecture", color: "#10b981" },
];

const INITIAL_ASSETS: Asset[] = [
  {
    id: "ast-01",
    name: "Company-Master-Logo-System.svg",
    type: "image",
    mimeType: "image/svg+xml",
    sizeBytes: 420000,
    storageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    folderId: "fld-1",
    tags: ["brand", "vector"],
    currentVersionId: "ver-01-2",
    checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    uploadedBy: "Siti Rahma (Lead Designer)",
    createdAt: "2026-09-10T08:00:00Z",
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: "ast-02",
    name: "Laporan-Keuangan-Konsolidasi-Q3-2026.pdf",
    type: "document",
    mimeType: "application/pdf",
    sizeBytes: 3840000,
    storageUrl: "/assets/docs/laporan-q3.pdf",
    folderId: "fld-2",
    tags: ["audit", "pdf"],
    currentVersionId: "ver-02-1",
    checksum: "8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
    uploadedBy: "Maya Anggraini (Finance)",
    createdAt: "2026-09-18T14:30:00Z",
  },
  {
    id: "ast-03",
    name: "Microservices-RBAC-DataFlow.png",
    type: "image",
    mimeType: "image/png",
    sizeBytes: 1560000,
    storageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    folderId: "fld-3",
    tags: ["architecture"],
    currentVersionId: "ver-03-1",
    checksum: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    uploadedBy: "Andi Pratama (Architect)",
    createdAt: "2026-09-21T11:00:00Z",
    dimensions: { width: 2560, height: 1440 },
  },
  {
    id: "ast-04",
    name: "Client-Onboarding-Teaser-Walkthrough.mp4",
    type: "video",
    mimeType: "video/mp4",
    sizeBytes: 45000000,
    storageUrl: "/assets/videos/teaser-walkthrough.mp4",
    folderId: "fld-4",
    tags: ["brand"],
    currentVersionId: "ver-04-1",
    checksum: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    uploadedBy: "Rina Kusuma (Marketing)",
    createdAt: "2026-09-22T16:00:00Z",
    dimensions: { width: 1920, height: 1080 },
  },
  {
    id: "ast-05",
    name: "Temporary-Unused-Draft-Iconset.zip",
    type: "archive",
    mimeType: "application/zip",
    sizeBytes: 8200000,
    storageUrl: "/assets/archives/unused-icons.zip",
    folderId: null,
    tags: [],
    currentVersionId: "ver-05-1",
    checksum: "e38e55e378c6e001859c6ab65bfb9ff8e7e1ef569614459d87361730a4421b44",
    uploadedBy: "Intern Developer",
    createdAt: "2026-09-01T10:00:00Z",
  },
];

const INITIAL_VERSIONS: AssetVersion[] = [
  {
    id: "ver-01-1",
    assetId: "ast-01",
    versionNumber: 1,
    storageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    sizeBytes: 410000,
    uploadedBy: "Siti Rahma",
    uploadedAt: "2026-09-10T08:00:00Z",
    changeNote: "Initial vector logo upload",
  },
  {
    id: "ver-01-2",
    assetId: "ast-01",
    versionNumber: 2,
    storageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    sizeBytes: 420000,
    uploadedBy: "Siti Rahma",
    uploadedAt: "2026-09-15T09:30:00Z",
    changeNote: "Perbaikan kontras warna primer untuk memenuhi kepatuhan WCAG AAA",
  },
  {
    id: "ver-02-1",
    assetId: "ast-02",
    versionNumber: 1,
    storageUrl: "/assets/docs/laporan-q3.pdf",
    sizeBytes: 3840000,
    uploadedBy: "Maya Anggraini",
    uploadedAt: "2026-09-18T14:30:00Z",
    changeNote: "Draft laporan keuangan Q3 pra-audit",
  },
  {
    id: "ver-03-1",
    assetId: "ast-03",
    versionNumber: 1,
    storageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    sizeBytes: 1560000,
    uploadedBy: "Andi Pratama",
    uploadedAt: "2026-09-21T11:00:00Z",
    changeNote: "Diagram arsitektur sistem RBAC untuk ISO 27001",
  },
  {
    id: "ver-04-1",
    assetId: "ast-04",
    versionNumber: 1,
    storageUrl: "/assets/videos/teaser-walkthrough.mp4",
    sizeBytes: 45000000,
    uploadedBy: "Rina Kusuma",
    uploadedAt: "2026-09-22T16:00:00Z",
    changeNote: "Video intro onboarding klien",
  },
  {
    id: "ver-05-1",
    assetId: "ast-05",
    versionNumber: 1,
    storageUrl: "/assets/archives/unused-icons.zip",
    sizeBytes: 8200000,
    uploadedBy: "Intern Developer",
    uploadedAt: "2026-09-01T10:00:00Z",
    changeNote: "Draft icon bundle",
  },
];

const INITIAL_REFERENCES: AssetReference[] = [
  {
    id: "ref-1",
    assetId: "ast-01",
    usedByApp: "task_manager",
    usedByEntityType: "task",
    usedByEntityId: "task-01",
    usedByTitle: "Task #01: Final Design System & Brand Rollout",
    linkedAt: "2026-09-12T10:00:00Z",
  },
  {
    id: "ref-2",
    assetId: "ast-01",
    usedByApp: "deliverable_manager",
    usedByEntityType: "deliverable",
    usedByEntityId: "deliv-02",
    usedByTitle: "Deliverable #02: Brand Asset Kit & Marketing Design System",
    linkedAt: "2026-09-16T11:20:00Z",
  },
  {
    id: "ref-3",
    assetId: "ast-02",
    usedByApp: "meeting_manager",
    usedByEntityType: "meeting",
    usedByEntityId: "mtg-42",
    usedByTitle: "Meeting #42: Q3 Financial Review with Board",
    linkedAt: "2026-09-19T09:00:00Z",
  },
  {
    id: "ref-4",
    assetId: "ast-03",
    usedByApp: "knowledge_base",
    usedByEntityType: "article",
    usedByEntityId: "art-105",
    usedByTitle: "Article #105: RBAC Role Hierarchy & Security Boundary",
    linkedAt: "2026-09-22T14:00:00Z",
  },
  {
    id: "ref-5",
    assetId: "ast-04",
    usedByApp: "deliverable_manager",
    usedByEntityType: "deliverable",
    usedByEntityId: "deliv-04",
    usedByTitle: "Deliverable #04: Client Video Walkthrough Package",
    linkedAt: "2026-09-23T15:00:00Z",
  },
  // ast-05 has NO references -> true orphan asset!
];

const INITIAL_QUOTA: StorageQuota = {
  workspaceId: "ws-primary",
  totalBytesAllowed: 5 * 1024 * 1024 * 1024, // 5 GB
  totalBytesUsed: 59020000, // ~59 MB
  lastCalculatedAt: "2026-09-24T02:00:00Z",
};

export const useAssetStore = create<AssetStore>()(
  persist(
    (set, get) => ({
      assets: INITIAL_ASSETS,
      versions: INITIAL_VERSIONS,
      references: INITIAL_REFERENCES,
      folders: INITIAL_FOLDERS,
      tags: INITIAL_TAGS,
      quota: INITIAL_QUOTA,
      selectedAssetId: null,

      uploadAsset: (data, changeNote = "Initial upload") => {
        const assetId = `ast-${Date.now()}`;
        const versionId = `ver-${Date.now()}-1`;
        const now = new Date().toISOString();

        const newVersion: AssetVersion = {
          id: versionId,
          assetId,
          versionNumber: 1,
          storageUrl: data.storageUrl,
          sizeBytes: data.sizeBytes,
          uploadedBy: data.uploadedBy,
          uploadedAt: now,
          changeNote,
        };

        const newAsset: Asset = {
          ...data,
          id: assetId,
          currentVersionId: versionId,
          createdAt: now,
          checksum: `sha256-${Math.random().toString(36).substring(2, 15)}`,
        };

        set((state) => ({
          assets: [newAsset, ...state.assets],
          versions: [newVersion, ...state.versions],
          quota: {
            ...state.quota,
            totalBytesUsed: state.quota.totalBytesUsed + data.sizeBytes,
            lastCalculatedAt: now,
          },
        }));
      },

      replaceVersion: (assetId, newSizeBytes, changeNote, newUrl) => {
        const asset = get().assets.find((a) => a.id === assetId);
        if (!asset) return;

        const assetVersions = get().versions.filter((v) => v.assetId === assetId);
        const nextVerNum = assetVersions.length + 1;
        const versionId = `ver-${Date.now()}-${nextVerNum}`;
        const now = new Date().toISOString();

        const newVersion: AssetVersion = {
          id: versionId,
          assetId,
          versionNumber: nextVerNum,
          storageUrl: newUrl || asset.storageUrl,
          sizeBytes: newSizeBytes,
          uploadedBy: "Anda (Editor)",
          uploadedAt: now,
          changeNote,
        };

        const sizeDiff = newSizeBytes - asset.sizeBytes;

        set((state) => ({
          versions: [newVersion, ...state.versions],
          assets: state.assets.map((a) =>
            a.id === assetId
              ? {
                  ...a,
                  currentVersionId: versionId,
                  sizeBytes: newSizeBytes,
                  storageUrl: newUrl || a.storageUrl,
                }
              : a
          ),
          quota: {
            ...state.quota,
            totalBytesUsed: state.quota.totalBytesUsed + sizeDiff,
            lastCalculatedAt: now,
          },
        }));
      },

      revertToVersion: (assetId, versionId) => {
        const version = get().versions.find((v) => v.id === versionId && v.assetId === assetId);
        if (!version) return;

        set((state) => ({
          assets: state.assets.map((a) =>
            a.id === assetId
              ? {
                  ...a,
                  currentVersionId: versionId,
                  sizeBytes: version.sizeBytes,
                  storageUrl: version.storageUrl,
                }
              : a
          ),
        }));
      },

      renameAsset: (id, newName) => {
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, name: newName } : a)),
        }));
      },

      moveAsset: (id, folderId) => {
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, folderId } : a)),
        }));
      },

      updateTags: (id, tags) => {
        set((state) => ({
          assets: state.assets.map((a) => (a.id === id ? { ...a, tags } : a)),
        }));
      },

      getAssetReferences: (assetId) => {
        return get().references.filter((r) => r.assetId === assetId);
      },

      deleteAsset: (id) => {
        const refs = get().references.filter((r) => r.assetId === id);
        if (refs.length > 0) {
          return { success: false, hasActiveReferences: true, references: refs };
        }

        get().forceDeleteAsset(id);
        return { success: true, hasActiveReferences: false, references: [] };
      },

      forceDeleteAsset: (id) => {
        const asset = get().assets.find((a) => a.id === id);
        if (!asset) return;

        set((state) => ({
          assets: state.assets.filter((a) => a.id !== id),
          versions: state.versions.filter((v) => v.assetId !== id),
          references: state.references.filter((r) => r.assetId !== id),
          quota: {
            ...state.quota,
            totalBytesUsed: Math.max(0, state.quota.totalBytesUsed - asset.sizeBytes),
          },
          selectedAssetId: state.selectedAssetId === id ? null : state.selectedAssetId,
        }));
      },

      cleanupOrphanAssets: () => {
        const currentAssets = get().assets;
        const currentRefs = get().references;
        const orphanIds = currentAssets
          .filter((a) => !currentRefs.some((r) => r.assetId === a.id))
          .map((a) => a.id);

        orphanIds.forEach((id) => get().forceDeleteAsset(id));
        return orphanIds.length;
      },

      createFolder: (name, parentFolderId = null) => {
        const newFolder: AssetFolder = {
          id: `fld-${Date.now()}`,
          name,
          parentFolderId: parentFolderId || null,
        };
        set((state) => ({ folders: [...state.folders, newFolder] }));
      },

      deleteFolder: (id) => {
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          assets: state.assets.map((a) => (a.folderId === id ? { ...a, folderId: null } : a)),
        }));
      },

      createTag: (name, color = "#3b82f6") => {
        const normalized = name.toLowerCase().trim();
        if (!normalized) return;
        if (get().tags.some((t) => t.name.toLowerCase() === normalized)) return;
        const newTag: AssetTag = { id: `at-${Date.now()}`, name: normalized, color };
        set((state) => ({ tags: [...state.tags, newTag] }));
      },

      setSelectedAssetId: (id) => set({ selectedAssetId: id }),
    }),
    {
      name: "ecosystem-asset-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
