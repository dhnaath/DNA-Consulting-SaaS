import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import { useShellSections } from "@/app/shell-sections";
import React, { useState, useMemo, useEffect } from "react";
import {
  HardDrive,
  File,
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Archive as ArchiveIcon,
  Folder as FolderIcon,
  Upload,
  Trash2,
  History,
  AlertTriangle,
  CheckCircle2,
  Search,
  Layers,
  BarChart3,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  FolderPlus,
  Eye,
  X,
  LayoutGrid,
  List,
} from "lucide-react";
import { useAssetStore } from "./store";
import { Asset, AssetType, AssetViewMode, AssetReference } from "./types";

export function AssetManagerApp() {
  const {
    assets,
    versions,
    references,
    folders,
    quota,
    selectedAssetId,
    uploadAsset,
    replaceVersion,
    revertToVersion,
    deleteAsset,
    forceDeleteAsset,
    cleanupOrphanAssets,
    createFolder,
    setSelectedAssetId,
  } = useAssetStore();

  const [activeTab, setActiveTab] = useState<AssetViewMode>("all");
  const [viewLayout, setViewLayout] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);

  // Otomatis buka sidebar kiri pada tab menu saat halaman dimuat
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("open-left-sidebar", { detail: { tab: "menu" } })
    );
  }, []);


  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isReplaceVersionOpen, setIsReplaceVersionOpen] = useState(false);
  const [isWarningDeleteOpen, setIsWarningDeleteOpen] = useState(false);
  const [targetDeleteAsset, setTargetDeleteAsset] = useState<{ id: string; name: string; references: AssetReference[] } | null>(null);
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  // Upload Form states
  const [upName, setUpName] = useState("");
  const [upType, setUpType] = useState<AssetType>("image");
  const [upSizeKb, setUpSizeKb] = useState(1200);
  const [upFolderId, setUpFolderId] = useState("");
  const [upChangeNote, setUpChangeNote] = useState("Initial upload");
  const [upUrl, setUpUrl] = useState("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80");

  // Replace version form states
  const [repChangeNote, setRepChangeNote] = useState("");
  const [repNewSizeKb, setRepNewSizeKb] = useState(1400);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleOpenUploadModal = () => {
    setUpName("");
    setUpType("image");
    setUpSizeKb(1200);
    setUpFolderId(selectedFolderId || "");
    setUpChangeNote("Initial upload");
    setUpUrl("https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=800&q=80");
    setIsUploadOpen(true);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!upName.trim()) return;

    let mime = "application/octet-stream";
    if (upType === "image") mime = "image/png";
    else if (upType === "document") mime = "application/pdf";
    else if (upType === "video") mime = "video/mp4";
    else if (upType === "audio") mime = "audio/mpeg";
    else if (upType === "archive") mime = "application/zip";

    uploadAsset(
      {
        name: upName.trim(),
        type: upType,
        mimeType: mime,
        sizeBytes: upSizeKb * 1024,
        storageUrl: upUrl,
        folderId: upFolderId || null,
        tags: [upType],
        uploadedBy: "Anda (Current User)",
        dimensions: upType === "image" ? { width: 1920, height: 1080 } : undefined,
      },
      upChangeNote
    );

    showToast(`Asset "${upName}" berhasil diunggah.`);
    setIsUploadOpen(false);
  };

  const handleDeleteClick = (asset: Asset) => {
    const res = deleteAsset(asset.id);
    if (res.hasActiveReferences) {
      setTargetDeleteAsset({
        id: asset.id,
        name: asset.name,
        references: res.references,
      });
      setIsWarningDeleteOpen(true);
    } else {
      showToast(`Asset "${asset.name}" berhasil dihapus.`);
    }
  };

  const handleConfirmForceDelete = () => {
    if (!targetDeleteAsset) return;
    forceDeleteAsset(targetDeleteAsset.id);
    showToast(`Asset "${targetDeleteAsset.name}" dihapus paksa.`);
    setIsWarningDeleteOpen(false);
    setTargetDeleteAsset(null);
  };

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (activeTab === "orphans") {
        const hasRef = references.some((r) => r.assetId === asset.id);
        if (hasRef) return false;
      } else if (activeTab === "gallery") {
        if (asset.type !== "image" && asset.type !== "video") return false;
      } else if (activeTab === "by_type") {
        if (typeFilter !== "all" && asset.type !== typeFilter) return false;
      } else if (activeTab === "folder") {
        if (selectedFolderId !== null && asset.folderId !== selectedFolderId) return false;
      }

      if (typeFilter !== "all" && activeTab !== "by_type" && asset.type !== typeFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = asset.name.toLowerCase().includes(q);
        const matchUploader = asset.uploadedBy.toLowerCase().includes(q);
        const matchTag = asset.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchUploader && !matchTag) return false;
      }

      return true;
    });
  }, [assets, references, activeTab, typeFilter, selectedFolderId, searchQuery]);

  // Selected Detail Asset
  const activeAsset = useMemo(() => {
    if (!selectedAssetId) return null;
    return assets.find((a) => a.id === selectedAssetId) || null;
  }, [assets, selectedAssetId]);

  const activeAssetVersions = useMemo(() => {
    if (!activeAsset) return [];
    return versions
      .filter((v) => v.assetId === activeAsset.id)
      .sort((a, b) => b.versionNumber - a.versionNumber);
  }, [versions, activeAsset]);

  const activeAssetRefs = useMemo(() => {
    if (!activeAsset) return [];
    return references.filter((r) => r.assetId === activeAsset.id);
  }, [references, activeAsset]);

  // Statistics & Quota
  const stats = useMemo(() => {
    const total = assets.length;
    const totalBytes = quota.totalBytesUsed;
    const quotaPct = ((quota.totalBytesUsed / quota.totalBytesAllowed) * 100).toFixed(1);
    const orphanCount = assets.filter((a) => !references.some((r) => r.assetId === a.id)).length;

    const typeBreakdown: Record<string, number> = {};
    assets.forEach((a) => {
      typeBreakdown[a.type] = (typeBreakdown[a.type] || 0) + 1;
    });

    const mostReferenced = [...assets]
      .map((a) => ({
        ...a,
        refCount: references.filter((r) => r.assetId === a.id).length,
      }))
      .sort((a, b) => b.refCount - a.refCount)
      .slice(0, 5);

    return { total, totalBytes, quotaPct, orphanCount, typeBreakdown, mostReferenced };
  }, [assets, references, quota]);

  // Daftarkan opsi fitur ke ShellSections agar selalu muncul di tab Menu sidebar kiri
  useShellSections([
    {
      id: "all",
      label: `Semua Asset (${assets.length})`,
      icon: Layers,
      active: activeTab === "all",
      onSelect: () => setActiveTab("all"),
    },
    {
      id: "folder",
      label: `By Folder (${folders.length})`,
      icon: FolderIcon,
      active: activeTab === "folder",
      onSelect: () => setActiveTab("folder"),
    },
    {
      id: "gallery",
      label: "Gallery Visual",
      icon: ImageIcon,
      active: activeTab === "gallery",
      onSelect: () => setActiveTab("gallery"),
    },
    {
      id: "orphans",
      label: `Orphan Assets (${stats.orphanCount})`,
      icon: AlertTriangle,
      active: activeTab === "orphans",
      onSelect: () => setActiveTab("orphans"),
    },
    {
      id: "storage",
      label: `Storage & Kuota (${stats.quotaPct}%)`,
      icon: HardDrive,
      active: activeTab === "storage",
      onSelect: () => setActiveTab("storage"),
    },
    {
      id: "stats",
      label: "Statistik & Laporan",
      icon: BarChart3,
      active: activeTab === "stats",
      onSelect: () => setActiveTab("stats"),
    },
  ]);

  const getFileIcon = (type: AssetType) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-4 h-4 text-sky-400" />;
      case "document":
        return <FileText className="w-4 h-4 text-rose-400" />;
      case "video":
        return <Video className="w-4 h-4 text-purple-400" />;
      case "audio":
        return <Music className="w-4 h-4 text-emerald-400" />;
      case "archive":
        return <ArchiveIcon className="w-4 h-4 text-amber-400" />;
      default:
        return <File className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* LEFT SIDEBAR: Navigasi Menu & Tab Fitur Asset Manager */}
      <ShellSidebar>
        {/* Header Modul Asset Manager */}
        <div className="p-3.5 border-b border-border/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-blue-500/25 flex items-center justify-center text-white shrink-0">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-xs font-bold text-foreground tracking-tight">Asset Manager</h2>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/30">
                  #29
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">Storage & Resource Core</p>
            </div>
          </div>
        </div>

        {/* Menu Tab Fitur Utama (Pindahan dari Opsi Atas) */}
        <div className="p-2 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            Menu Navigasi Fitur
          </div>

          <button
            onClick={() => setActiveTab("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Semua Asset</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === "all"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {assets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("folder")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "folder"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FolderIcon className="w-4 h-4 text-amber-500 shrink-0" />
              <span>By Folder</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === "folder"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {folders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("gallery")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "gallery"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4 text-sky-500 shrink-0" />
              <span>Gallery Visual</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                activeTab === "gallery"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {assets.filter((a) => a.type === "image").length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orphans")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "orphans"
                ? "bg-rose-600 text-white font-semibold shadow-xs"
                : "text-foreground/80 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className={`w-4 h-4 shrink-0 ${activeTab === "orphans" ? "text-white" : "text-rose-500"}`} />
              <span>Orphan Assets</span>
            </div>
            {stats.orphanCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                  activeTab === "orphans"
                    ? "bg-white/25 text-white"
                    : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                }`}
              >
                {stats.orphanCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("storage")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "storage"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Storage & Kuota</span>
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                activeTab === "storage"
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {stats.quotaPct}%
            </span>
          </button>

          <button
            onClick={() => setActiveTab("stats")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
              activeTab === "stats"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "text-foreground/80 hover:text-foreground hover:bg-accent"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>Statistik & Laporan</span>
            </div>
          </button>
        </div>

        {/* Ringkasan Storage Kuota Mini di Sidebar Bawah */}
        <div className="p-3 mt-auto border-t border-border/70">
          <div className="p-3 rounded-xl bg-card border border-border/80 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-cyan-500" />
                Kapasitas
              </span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400 text-[11px]">
                {stats.quotaPct}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  Number(stats.quotaPct) > 90
                    ? "bg-rose-500"
                    : Number(stats.quotaPct) > 70
                    ? "bg-amber-500"
                    : "bg-cyan-500"
                }`}
                style={{ width: `${stats.quotaPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
              <span>{formatBytes(quota.totalBytesUsed)}</span>
              <span>{formatBytes(quota.totalBytesAllowed)}</span>
            </div>
          </div>
        </div>
      </ShellSidebar>

      {/* Header Actions in Floating Pill */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsNewFolderOpen(true)}
            title="Buat Folder Baru"
            aria-label="Folder Baru"
            className="p-1.5 bg-card hover:bg-accent text-foreground border border-border/80 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <FolderPlus className="w-3.5 h-3.5 text-amber-500" />
          </button>

          <button
            onClick={handleOpenUploadModal}
            title="Upload Asset Baru"
            aria-label="Upload Asset"
            className="p-1.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Page Header Banner */}
      <div className="px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20 shrink-0">
              <HardDrive className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Asset Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  App #29
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatBytes(quota.totalBytesUsed)} / {formatBytes(quota.totalBytesAllowed)} ({stats.quotaPct}%)
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Single storage layer terpusat untuk file, riwayat versi (versioning), deteksi orphan, dan proteksi broken link.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 mt-4">
        {/* STORAGE OVERVIEW TAB */}
        {activeTab === "storage" && (
          <div className="space-y-6 max-w-4xl">
            <div className="p-6 bg-card/80 border border-border rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white">Alokasi & Penggunaan Kuota Storage</h3>
                  <p className="text-xs text-muted-foreground">Kapasitas penyimpanan fisik bersama untuk seluruh ekosistem.</p>
                </div>
                <span className="text-xl font-extrabold text-cyan-400">{stats.quotaPct}% Terpakai</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-background h-3 rounded-full overflow-hidden p-0.5 border border-border">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    parseFloat(stats.quotaPct) > 90 ? "bg-rose-500" : "bg-gradient-to-r from-cyan-500 to-blue-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(2, parseFloat(stats.quotaPct)))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Terpakai: {formatBytes(quota.totalBytesUsed)}</span>
                <span>Batas Workspace: {formatBytes(quota.totalBytesAllowed)}</span>
              </div>

              {parseFloat(stats.quotaPct) > 90 && (
                <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg flex items-center gap-2 text-rose-300 text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Peringatan: Storage hampir penuh (&gt; 90%). Pertimbangkan untuk membersihkan Orphan Assets.</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-card/60 border border-border rounded-xl">
                <h4 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  Rincian Menurut Tipe File
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.typeBreakdown).map(([t, count]) => (
                    <div key={t} className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                      <span className="capitalize text-foreground flex items-center gap-1.5">
                        {getFileIcon(t as any)}
                        {t}
                      </span>
                      <span className="px-2 py-0.5 bg-card rounded text-foreground font-medium">{count} file</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-card/60 border border-border rounded-xl">
                <h4 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                  File Paling Banyak Dirujuk (Most Referenced)
                </h4>
                <div className="space-y-2">
                  {stats.mostReferenced.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1 border-b border-border/40 truncate">
                      <span className="text-foreground truncate mr-2">{item.name}</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded shrink-0">
                        {item.refCount} app
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORPHAN ASSETS VIEW */}
        {activeTab === "orphans" && (
          <div className="space-y-4">
            <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-rose-300">Deteksi Orphan Assets ({stats.orphanCount} File)</h4>
                  <p className="text-xs text-rose-400/80">
                    Asset di bawah ini tidak memiliki tautan (AssetReference) aktif ke Task, Deliverables, Meeting, atau Knowledge Base manapun. Anda dapat membersihkannya dengan aman untuk menghemat storage.
                  </p>
                </div>
              </div>
              {stats.orphanCount > 0 && (
                <button
                  onClick={() => {
                    const count = cleanupOrphanAssets();
                    showToast(`${count} orphan asset berhasil dibersihkan.`);
                  }}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shrink-0"
                >
                  Bersihkan Semua ({stats.orphanCount})
                </button>
              )}
            </div>

            {/* List of orphans */}
            {filteredAssets.length === 0 ? (
              <div className="p-12 text-center bg-card/40 border border-border/60 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground">Tidak ada orphan asset</h3>
                <p className="text-xs text-muted-foreground mt-1">Seluruh file dalam ekosistem sedang aktif digunakan.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAssets.map((asset) => (
                  <div key={asset.id} className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 truncate">
                      {getFileIcon(asset.type)}
                      <div className="truncate">
                        <div className="font-semibold text-sm text-foreground truncate">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatBytes(asset.sizeBytes)} • Diunggah {new Date(asset.createdAt).toLocaleDateString()} oleh {asset.uploadedBy}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(asset)}
                      className="px-3 py-1 bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 rounded text-xs font-medium"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ALL ASSETS / GALLERY / BY FOLDER */}
        {activeTab !== "storage" && activeTab !== "orphans" && activeTab !== "stats" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar for Folder Filter */}
            {activeTab === "folder" && (
              <div className="lg:col-span-1 space-y-3">
                <div className="p-4 bg-card/60 border border-border rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                    <span>Folder Asset</span>
                    {selectedFolderId && (
                      <button onClick={() => setSelectedFolderId(null)} className="text-sky-400 hover:underline">
                        Semua
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedFolderId(null)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                      selectedFolderId === null ? "bg-blue-600 text-background font-semibold" : "text-foreground hover:bg-foreground/50"
                    }`}
                  >
                    <span>Semua File</span>
                    <span className="text-[10px] opacity-70">{assets.length}</span>
                  </button>
                  {folders.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFolderId(f.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                        selectedFolderId === f.id ? "bg-blue-600 text-background font-semibold" : "text-foreground hover:bg-foreground/50"
                      }`}
                    >
                      <span className="truncate flex items-center gap-1.5">
                        <FolderIcon className="w-3.5 h-3.5 text-amber-400" />
                        {f.name}
                      </span>
                      <span className="text-[10px] opacity-70">{assets.filter((a) => a.folderId === f.id).length}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Assets List / Grid */}
            <div className={`${activeTab === "folder" ? "lg:col-span-3" : "lg:col-span-4"} space-y-4`}>
              {/* Filter Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama asset, uploader, tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-blue-500"
                  >
                    <option value="all">Semua Tipe</option>
                    <option value="image">Gambar (Images)</option>
                    <option value="document">Dokumen (PDF, Docs)</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="archive">Archive (ZIP)</option>
                  </select>

                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewLayout("grid")}
                      className={`p-1.5 ${viewLayout === "grid" ? "bg-foreground text-background" : "text-muted-foreground"}`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewLayout("table")}
                      className={`p-1.5 ${viewLayout === "table" ? "bg-foreground text-background" : "text-muted-foreground"}`}
                      title="Table View"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Assets Grid */}
              {filteredAssets.length === 0 ? (
                <div className="p-12 text-center bg-card/40 border border-border/60 rounded-xl">
                  <HardDrive className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-foreground">Tidak ada asset ditemukan</h3>
                  <p className="text-xs text-muted-foreground mt-1">Coba unggah asset baru atau sesuaikan filter pencarian.</p>
                </div>
              ) : viewLayout === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => {
                    const refsCount = references.filter((r) => r.assetId === asset.id).length;
                    return (
                      <div
                        key={asset.id}
                        className="bg-card/80 border border-border hover:border-border rounded-xl overflow-hidden flex flex-col justify-between transition group"
                      >
                        {/* Thumbnail / Preview Header */}
                        <div
                          onClick={() => setSelectedAssetId(asset.id)}
                          className="h-32 bg-background/80 flex items-center justify-center relative cursor-pointer overflow-hidden"
                        >
                          {asset.type === "image" ? (
                            <img
                              src={asset.storageUrl}
                              alt={asset.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                            />
                          ) : (
                            <div className="p-4 text-center">
                              {getFileIcon(asset.type)}
                              <span className="text-[10px] text-muted-foreground block mt-1 uppercase font-semibold">
                                {asset.mimeType.split("/")[1] || asset.type}
                              </span>
                            </div>
                          )}

                          {refsCount > 0 ? (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-background/90 text-emerald-400 border border-emerald-500/30">
                              {refsCount} used
                            </span>
                          ) : (
                            <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-background/90 text-rose-400 border border-rose-500/30">
                              orphan
                            </span>
                          )}
                        </div>

                        {/* Metadata Body */}
                        <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h4
                              onClick={() => setSelectedAssetId(asset.id)}
                              className="font-bold text-xs text-foreground truncate cursor-pointer hover:text-cyan-400"
                              title={asset.name}
                            >
                              {asset.name}
                            </h4>
                            <div className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
                              <span>{formatBytes(asset.sizeBytes)}</span>
                              <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                            <button
                              onClick={() => setSelectedAssetId(asset.id)}
                              className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 text-[11px]"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Detail & Versi
                            </button>

                            <button
                              onClick={() => handleDeleteClick(asset)}
                              className="text-muted-foreground hover:text-rose-400 p-1"
                              title="Hapus Asset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-card/80 border border-border rounded-xl overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-background/60 text-muted-foreground uppercase text-[10px] border-b border-border">
                      <tr>
                        <th className="p-3">Nama Asset</th>
                        <th className="p-3">Tipe</th>
                        <th className="p-3">Ukuran</th>
                        <th className="p-3">Pengunggah</th>
                        <th className="p-3">Used In</th>
                        <th className="p-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {filteredAssets.map((asset) => {
                        const refsCount = references.filter((r) => r.assetId === asset.id).length;
                        return (
                          <tr key={asset.id} className="hover:bg-card">
                            <td className="p-3 font-semibold text-foreground flex items-center gap-2">
                              {getFileIcon(asset.type)}
                              <span
                                onClick={() => setSelectedAssetId(asset.id)}
                                className="cursor-pointer hover:text-cyan-400 truncate max-w-xs"
                              >
                                {asset.name}
                              </span>
                            </td>
                            <td className="p-3 uppercase text-[10px] text-muted-foreground">{asset.type}</td>
                            <td className="p-3 text-foreground">{formatBytes(asset.sizeBytes)}</td>
                            <td className="p-3 text-muted-foreground truncate max-w-xs">{asset.uploadedBy}</td>
                            <td className="p-3">
                              {refsCount > 0 ? (
                                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-semibold">
                                  {refsCount} rujukan
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded text-[10px] font-semibold">
                                  orphan
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setSelectedAssetId(asset.id)}
                                  className="text-cyan-400 hover:text-cyan-300"
                                >
                                  Detail
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(asset)}
                                  className="text-rose-400 hover:text-rose-300"
                                >
                                  Hapus
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: DETAIL ASSET & VERSION HISTORY & USED IN */}
      {selectedAssetId && activeAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2 truncate">
                {getFileIcon(activeAsset.type)}
                <h3 className="font-bold text-base text-white truncate">{activeAsset.name}</h3>
              </div>
              <button onClick={() => setSelectedAssetId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Box */}
            <div className="h-44 bg-background rounded-xl overflow-hidden flex items-center justify-center border border-border">
              {activeAsset.type === "image" ? (
                <img src={activeAsset.storageUrl} alt="" className="h-full object-contain" />
              ) : (
                <div className="text-center p-4">
                  {getFileIcon(activeAsset.type)}
                  <span className="text-xs text-muted-foreground block mt-2">{activeAsset.mimeType}</span>
                </div>
              )}
            </div>

            {/* Metadata Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-card/60 p-3 rounded-xl border border-border">
              <div>
                <span className="text-muted-foreground block">Ukuran</span>
                <span className="font-semibold text-foreground">{formatBytes(activeAsset.sizeBytes)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Checksum</span>
                <span className="font-mono text-foreground text-[10px] truncate block" title={activeAsset.checksum}>
                  {activeAsset.checksum?.substring(0, 14)}...
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block">Pengunggah</span>
                <span className="font-semibold text-foreground truncate block">{activeAsset.uploadedBy}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Dimensi</span>
                <span className="font-semibold text-foreground">
                  {activeAsset.dimensions ? `${activeAsset.dimensions.width}x${activeAsset.dimensions.height}` : "N/A"}
                </span>
              </div>
            </div>

            {/* Used In (AssetReference) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                Digunakan di Aplikasi Lain ({activeAssetRefs.length})
              </h4>
              {activeAssetRefs.length === 0 ? (
                <div className="p-3 bg-card/40 rounded-lg text-xs text-muted-foreground">
                  File ini belum dirujuk oleh Task, Deliverable, atau Knowledge Base manapun (Orphan Asset).
                </div>
              ) : (
                <div className="space-y-1.5">
                  {activeAssetRefs.map((ref) => (
                    <div
                      key={ref.id}
                      className="p-2.5 bg-card/80 border border-border rounded-lg text-xs flex items-center justify-between"
                    >
                      <div>
                        <span className="font-semibold text-foreground">{ref.usedByTitle || ref.usedByEntityId}</span>
                        <div className="text-[11px] text-muted-foreground">
                          Aplikasi: <strong className="text-emerald-400">{ref.usedByApp}</strong> ({ref.usedByEntityType})
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(ref.linkedAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Version History (Rollback feature) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  Riwayat Versi ({activeAssetVersions.length})
                </h4>
                <button
                  onClick={() => setIsReplaceVersionOpen(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                >
                  + Upload Versi Baru
                </button>
              </div>

              <div className="space-y-2">
                {activeAssetVersions.map((ver) => {
                  const isCurrent = ver.id === activeAsset.currentVersionId;
                  return (
                    <div
                      key={ver.id}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3 text-xs ${
                        isCurrent
                          ? "bg-blue-950/20 border-blue-500/40 text-blue-200"
                          : "bg-card/60 border-border/80 text-foreground"
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground">Versi {ver.versionNumber}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                              Aktif
                            </span>
                          )}
                          <span className="text-muted-foreground text-[11px]">({formatBytes(ver.sizeBytes)})</span>
                        </div>
                        <div className="text-foreground italic">{ver.changeNote || "Revisi berkas"}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {ver.uploadedBy} • {new Date(ver.uploadedAt).toLocaleString()}
                        </div>
                      </div>

                      {!isCurrent && (
                        <button
                          onClick={() => {
                            revertToVersion(activeAsset.id, ver.id);
                            showToast(`Asset di-rollback ke Versi ${ver.versionNumber}.`);
                          }}
                          className="px-2.5 py-1 bg-card hover:bg-muted-foreground/30 text-foreground rounded text-xs font-medium flex items-center gap-1 shrink-0"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Rollback ke v{ver.versionNumber}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <button
                onClick={() => handleDeleteClick(activeAsset)}
                className="px-3.5 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Asset
              </button>

              <button
                onClick={() => setSelectedAssetId(null)}
                className="px-4 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WARNING DIALOG: DELETE ASSET WITH ACTIVE REFERENCES */}
      {isWarningDeleteOpen && targetDeleteAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-rose-500/50 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="font-bold text-lg text-white">Peringatan: File Sedang Digunakan!</h3>
                <p className="text-xs text-rose-300">
                  Asset <strong className="text-white">"{targetDeleteAsset.name}"</strong> masih memiliki{" "}
                  <strong>{targetDeleteAsset.references.length} tautan referensi</strong> aktif di aplikasi lain.
                </p>
              </div>
            </div>

            <div className="p-3 bg-background/80 rounded-xl border border-border space-y-2 text-xs">
              <div className="text-[11px] font-semibold text-muted-foreground uppercase">Daftar Tempat Penggunaan:</div>
              {targetDeleteAsset.references.map((ref) => (
                <div key={ref.id} className="text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                  <span>
                    <strong>{ref.usedByApp}</strong>: {ref.usedByTitle || ref.usedByEntityId}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-foreground leading-relaxed">
              Jika Anda melanjutkan penghapusan, referensi pada aplikasi tersebut akan menjadi <strong>Broken Link</strong>.
              Apakah Anda yakin ingin memaksakan penghapusan file ini?
            </p>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  setIsWarningDeleteOpen(false);
                  setTargetDeleteAsset(null);
                }}
                className="px-4 py-2 bg-card hover:bg-card text-foreground rounded-lg text-xs font-semibold"
              >
                Batalkan (Simpan File)
              </button>
              <button
                type="button"
                onClick={handleConfirmForceDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-rose-600/30"
              >
                Lanjutkan Hapus Paksa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: UPLOAD ASSET */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Upload Asset Baru</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama File <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Q4-Pitch-Deck.pdf"
                  value={upName}
                  onChange={(e) => setUpName(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Tipe File</label>
                  <select
                    value={upType}
                    onChange={(e) => setUpType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                  >
                    <option value="image">Image (Gambar)</option>
                    <option value="document">Document (PDF/Doc)</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                    <option value="archive">Archive (ZIP)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Ukuran (KB)</label>
                  <input
                    type="number"
                    value={upSizeKb}
                    onChange={(e) => setUpSizeKb(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Folder</label>
                <select
                  value={upFolderId}
                  onChange={(e) => setUpFolderId(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Tanpa Folder (Root)</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Catatan Versi Awal</label>
                <input
                  type="text"
                  value={upChangeNote}
                  onChange={(e) => setUpChangeNote(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPLACE VERSION (UPLOAD NEW VERSION) */}
      {isReplaceVersionOpen && activeAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Upload Versi Baru</h3>
              <button onClick={() => setIsReplaceVersionOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Catatan Perubahan (Change Note)</label>
                <textarea
                  rows={2}
                  required
                  placeholder="mis. Angka keuangan diperbarui pasca-audit internal..."
                  value={repChangeNote}
                  onChange={(e) => setRepChangeNote(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Ukuran File Baru (KB)</label>
                <input
                  type="number"
                  value={repNewSizeKb}
                  onChange={(e) => setRepNewSizeKb(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsReplaceVersionOpen(false)}
                className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (repChangeNote.trim()) {
                    replaceVersion(activeAsset.id, repNewSizeKb * 1024, repChangeNote.trim());
                    showToast(`Versi baru untuk "${activeAsset.name}" berhasil dibuat.`);
                    setIsReplaceVersionOpen(false);
                    setRepChangeNote("");
                  }
                }}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
              >
                Simpan Revisi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE FOLDER */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Buat Folder Asset</h3>
              <button onClick={() => setIsNewFolderOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">Nama Folder</label>
              <input
                type="text"
                placeholder="mis. Dokumentasi Video Klien"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsNewFolderOpen(false)}
                className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (newFolderName.trim()) {
                    createFolder(newFolderName.trim());
                    showToast(`Folder "${newFolderName}" dibuat.`);
                    setNewFolderName("");
                    setIsNewFolderOpen(false);
                  }
                }}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
