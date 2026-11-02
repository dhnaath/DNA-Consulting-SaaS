import { useState, useMemo } from "react";
import {
  Scissors,
  Plus,
  Search,
  Inbox,
  Folder,
  Highlighter,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  BarChart3,
  Trash2,
  Globe,
  FileText,
  FolderPlus,
  X,
  Compass,
} from "lucide-react";
import { useWebClipperStore } from "./store";
import { useShellSections } from "@/app/shell-sections";
import { ClipType } from "./types";

export function WebClipperApp() {
  const {
    clips,
    highlights,
    folders,
    addClip,
    deleteClip,
    addHighlight,
    deleteHighlight,
    addFolder,
    promoteToApp,
    isOldUnprocessed,
  } = useWebClipperStore();

  const [activeView, setActiveView] = useState<"inbox" | "folder" | "highlights" | "promoted">("inbox");
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(clips[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isClipModalOpen, setIsClipModalOpen] = useState(false);
  const [clipUrl, setClipUrl] = useState("https://");
  const [clipTitle, setClipTitle] = useState("");
  const [clipType, setClipType] = useState<ClipType>("article");
  const [clipContent, setClipContent] = useState("");
  const [clipFolderId, setClipFolderId] = useState("");
  const [clipTags, setClipTags] = useState("");
  const [clipNote, setClipNote] = useState("");

  const [isNewHighlightModalOpen, setIsNewHighlightModalOpen] = useState(false);
  const [highlightText, setHighlightText] = useState("");
  const [highlightNote, setHighlightNote] = useState("");
  const [highlightColor, setHighlightColor] = useState("yellow");

  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // Selected Clip
  const selectedClip = useMemo(
    () => clips.find((c) => c.id === selectedClipId),
    [clips, selectedClipId]
  );

  const clipHighlights = useMemo(
    () => highlights.filter((h) => h.clipId === selectedClipId),
    [highlights, selectedClipId]
  );

  // Filtered Clips
  const filteredClips = useMemo(() => {
    return clips.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mTitle = c.sourcePage.title.toLowerCase().includes(q);
        const mUrl = c.sourcePage.url.toLowerCase().includes(q);
        const mContent = (c.content?.rawContent || "").toLowerCase().includes(q);
        const mTag = c.tags.some((t) => t.toLowerCase().includes(q));
        if (!mTitle && !mUrl && !mContent && !mTag) return false;
      }

      if (activeView === "inbox") {
        return c.status === "unprocessed";
      }

      if (activeView === "promoted") {
        return c.status === "promoted";
      }

      if (activeView === "folder" && selectedFolderId) {
        return c.folderId === selectedFolderId;
      }

      return true;
    });
  }, [clips, searchQuery, activeView, selectedFolderId]);

  // Statistics (§11)
  const stats = useMemo(() => {
    const total = clips.length;
    const unprocessed = clips.filter((c) => c.status === "unprocessed").length;
    const promoted = clips.filter((c) => c.status === "promoted").length;
    const oldUnprocessed = clips.filter((c) => isOldUnprocessed(c)).length;

    const promotionRate = total > 0 ? `${Math.round((promoted / total) * 100)}%` : "0%";
    const unprocessedRatio = total > 0 ? `${Math.round((unprocessed / total) * 100)}%` : "0%";

    // Most clipped domains
    const domainMap: Record<string, number> = {};
    clips.forEach((c) => {
      domainMap[c.sourcePage.domain] = (domainMap[c.sourcePage.domain] || 0) + 1;
    });
    const topDomain = Object.entries(domainMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";

    return {
      total,
      unprocessed,
      promoted,
      oldUnprocessed,
      promotionRate,
      unprocessedRatio,
      topDomain,
    };
  }, [clips, isOldUnprocessed]);

  // Publish this app's collections + folders as shell sections (sidebar + header).
  useShellSections([
    {
      id: "inbox",
      label: "Inbox (Unprocessed)",
      icon: Inbox,
      active: activeView === "inbox",
      onSelect: () => {
        setActiveView("inbox");
        setSelectedFolderId(null);
      },
    },
    {
      id: "highlights",
      label: "Highlights Only",
      icon: Highlighter,
      active: activeView === "highlights",
      onSelect: () => {
        setActiveView("highlights");
        setSelectedFolderId(null);
      },
    },
    {
      id: "promoted",
      label: "Promoted",
      icon: CheckCircle2,
      active: activeView === "promoted",
      onSelect: () => {
        setActiveView("promoted");
        setSelectedFolderId(null);
      },
    },
    ...folders.map((fld) => ({
      id: fld.id,
      label: fld.name,
      icon: Folder,
      active: activeView === "folder" && selectedFolderId === fld.id,
      onSelect: () => {
        setActiveView("folder");
        setSelectedFolderId(fld.id);
      },
    })),
  ]);

  const handleCaptureSubmit = () => {
    if (!clipTitle.trim() || !clipUrl.trim()) return;

    let domain = "web";
    try {
      domain = new URL(clipUrl).hostname;
    } catch {
      domain = "web.link";
    }

    const created = addClip({
      type: clipType,
      sourcePage: {
        url: clipUrl,
        title: clipTitle,
        domain,
        accessedAt: new Date().toISOString(),
      },
      content: {
        clipId: "",
        format: "plain_text",
        rawContent: clipContent || clipTitle,
        wordCount: clipContent ? clipContent.split(/\s+/).length : 0,
        extractedAt: new Date().toISOString(),
      },
      tags: clipTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      folderId: clipFolderId || null,
      note: clipNote || undefined,
    });

    setSelectedClipId(created.id);
    setClipUrl("https://");
    setClipTitle("");
    setClipContent("");
    setClipNote("");
    setClipTags("");
    setIsClipModalOpen(false);
    showToast("Konten web berhasil ditangkap (Clipped)!");
  };

  const handleCreateHighlight = () => {
    if (!selectedClipId || !highlightText.trim()) return;
    addHighlight({
      clipId: selectedClipId,
      text: highlightText,
      color: highlightColor,
      note: highlightNote || undefined,
    });
    setHighlightText("");
    setHighlightNote("");
    setIsNewHighlightModalOpen(false);
  };

  const handlePromoteAction = (target: "notes" | "knowledge_base" | "research_manager") => {
    if (!selectedClipId) return;
    const ok = promoteToApp(selectedClipId, target);
    if (ok) {
      const appName =
        target === "notes"
          ? "Notes (#12)"
          : target === "knowledge_base"
          ? "Knowledge Base (#14)"
          : "Research Manager (#16)";
      showToast(`Berhasil dipromosikan ke ${appName}!`);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/40 dark:bg-background text-foreground dark:text-foreground overflow-hidden font-sans">
      {/* Top Bar Header */}
      <div className="bg-card dark:bg-background border-b border-border dark:border-border px-4 py-3 shrink-0 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-card border border-border dark:border-border shadow-xs flex items-center justify-center text-foreground dark:text-foreground shrink-0 font-bold">
            <Scissors className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground dark:text-foreground">Web Clipper</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted dark:bg-card font-semibold text-muted-foreground dark:text-foreground border border-border dark:border-border">
                #17 Standalone
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-800">
                Web Capture Layer
              </span>
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Titik tangkap konten web cepat: simpan artikel, ekstrak teks & highlight untuk dipromosikan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {toastMessage && (
            <div className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="size-4" /> {toastMessage}
            </div>
          )}
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border dark:border-border text-xs font-medium hover:bg-muted/40 dark:hover:bg-card transition-colors"
          >
            <BarChart3 className="size-3.5 text-muted-foreground" />
            Statistik ({stats.promotionRate} promoted)
          </button>
          <button
            onClick={() => setIsClipModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-foreground dark:bg-card text-background dark:text-foreground text-xs font-semibold hover:opacity-90 shadow-xs transition-opacity"
          >
            <Plus className="size-4" />
            Klip Halaman Web
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Navigation & Folders */}
        <div className="w-60 bg-muted/40 dark:bg-background/50 border-r border-border dark:border-border flex flex-col shrink-0">
          <div className="p-3 border-b border-border dark:border-border space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider px-2">
              Koleksi & Alur Tangkap
            </span>
            <button
              onClick={() => {
                setActiveView("inbox");
                setSelectedFolderId(null);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "inbox"
                  ? "bg-card dark:bg-card text-foreground dark:text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Inbox className="size-3.5 text-blue-500" />
                <span>Inbox (Unprocessed)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-card text-muted-foreground">
                {clips.filter((c) => c.status === "unprocessed").length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveView("highlights");
                setSelectedFolderId(null);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "highlights"
                  ? "bg-card dark:bg-card text-foreground dark:text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Highlighter className="size-3.5 text-amber-500" />
                <span>Highlights Only</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-card text-muted-foreground">
                {highlights.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveView("promoted");
                setSelectedFolderId(null);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "promoted"
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-3.5 text-emerald-500" />
                <span>Promoted ({stats.promoted})</span>
              </div>
            </button>
          </div>

          {/* Folders (§7) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                Folder / Topik
              </span>
              <button
                onClick={() => setIsNewFolderModalOpen(true)}
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
              >
                <Plus className="size-3" /> Tambah
              </button>
            </div>

            {folders.map((fld) => {
              const count = clips.filter((c) => c.folderId === fld.id).length;
              const isSelected = activeView === "folder" && selectedFolderId === fld.id;
              return (
                <button
                  key={fld.id}
                  onClick={() => {
                    setActiveView("folder");
                    setSelectedFolderId(fld.id);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200"
                      : "text-foreground dark:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{fld.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Panel: Clips List */}
        <div className="w-80 bg-card dark:bg-background border-r border-border dark:border-border flex flex-col shrink-0">
          <div className="p-3 border-b border-border dark:border-border">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari klip, url, kata kunci..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card text-xs outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border dark:divide-border/60">
            {activeView === "highlights" ? (
              highlights.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-xs">Belum ada highlight.</div>
              ) : (
                highlights.map((hl) => {
                  const parentClip = clips.find((c) => c.id === hl.clipId);
                  return (
                    <div
                      key={hl.id}
                      onClick={() => setSelectedClipId(hl.clipId)}
                      className="p-3.5 hover:bg-muted/40 cursor-pointer space-y-1 text-xs"
                    >
                      <div className="text-[10px] text-muted-foreground">
                        Dari: {parentClip?.sourcePage.title}
                      </div>
                      <p className="bg-amber-100/60 dark:bg-amber-950/40 p-2 rounded-lg font-medium text-foreground dark:text-foreground">
                        &ldquo;{hl.text}&rdquo;
                      </p>
                      {hl.note && <div className="text-[11px] text-muted-foreground italic">Catatan: {hl.note}</div>}
                    </div>
                  );
                })
              )
            ) : filteredClips.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-xs">
                Tidak ada klip web di tampilan ini.
              </div>
            ) : (
              filteredClips.map((c) => {
                const isSelected = c.id === selectedClipId;
                const isOld = isOldUnprocessed(c);
                const hlCount = highlights.filter((h) => h.clipId === c.id).length;

                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClipId(c.id)}
                    className={`w-full text-left p-3.5 transition-colors ${
                      isSelected
                        ? "bg-teal-50/70 dark:bg-teal-950/30 border-l-3 border-teal-600"
                        : "hover:bg-muted/40 dark:hover:bg-card/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase">
                        {c.sourcePage.domain}
                      </span>
                      {isOld && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">
                          Perlu Ditinjau (&gt;14h)
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-foreground dark:text-foreground line-clamp-2">
                      {c.sourcePage.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {c.content?.rawContent?.slice(0, 90) || c.note || "(Tanpa ringkasan)"}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>{c.type}</span>
                      {hlCount > 0 && <span>{hlCount} highlights</span>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Clip Reader & Promotion Engine */}
        <div className="flex-1 bg-muted/40 dark:bg-background overflow-y-auto flex flex-col">
          {selectedClip ? (
            <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
              {/* Promotion Bar (§8 & §15) */}
              <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                    Tindak Lanjut Klip:
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedClip.status === "promoted"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {selectedClip.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handlePromoteAction("notes")}
                    className="px-3 py-1.5 rounded-lg bg-muted dark:bg-card text-foreground dark:text-foreground text-xs font-semibold hover:bg-muted transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="size-3.5 text-blue-500" />
                    Promote ke Notes (#12)
                  </button>
                  <button
                    onClick={() => handlePromoteAction("knowledge_base")}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="size-3.5 text-indigo-500" />
                    Promote ke KB (#14)
                  </button>
                  <button
                    onClick={() => handlePromoteAction("research_manager")}
                    className="px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-xs font-semibold hover:bg-teal-100 border border-teal-200 dark:border-teal-800 transition-colors flex items-center gap-1.5"
                  >
                    <Compass className="size-3.5 text-teal-600" />
                    Promote ke Research (#16)
                  </button>
                </div>
              </div>

              {/* Source Header Card */}
              <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="size-4 text-blue-500" />
                    <span className="font-semibold text-foreground dark:text-foreground">
                      {selectedClip.sourcePage.domain}
                    </span>
                    <span>&bull;</span>
                    <span>Diakses: {new Date(selectedClip.capturedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsNewHighlightModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs font-medium flex items-center gap-1"
                    >
                      <Highlighter className="size-3.5" />
                      Highlight Teks
                    </button>
                    <a
                      href={selectedClip.sourcePage.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted text-xs flex items-center gap-1"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                    <button
                      onClick={() => deleteClip(selectedClip.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-foreground dark:text-foreground">
                  {selectedClip.sourcePage.title}
                </h2>

                {selectedClip.note && (
                  <div className="p-3 rounded-xl bg-muted/40 dark:bg-card/60 border border-border text-xs text-muted-foreground">
                    <span className="font-bold text-foreground dark:text-foreground">Catatan Tangkap: </span>
                    {selectedClip.note}
                  </div>
                )}
              </div>

              {/* Reader View Content */}
              <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border dark:border-border">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Konten Asli Tersimpan ({selectedClip.content?.wordCount || 0} kata)
                  </span>
                  <span className="text-[10px] text-muted-foreground">Readability Extraction</span>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans text-foreground dark:text-foreground">
                  {selectedClip.content?.rawContent || "(Tidak ada konten teks tersimpan)"}
                </div>
              </div>

              {/* Highlights Section (§6) */}
              {clipHighlights.length > 0 && (
                <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-5 shadow-2xs space-y-3">
                  <h3 className="text-xs font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
                    <Highlighter className="size-4 text-amber-500" />
                    Highlights & Kutipan Kunci ({clipHighlights.length})
                  </h3>
                  <div className="space-y-2">
                    {clipHighlights.map((hl) => (
                      <div
                        key={hl.id}
                        className="p-3 rounded-xl border border-amber-100 bg-amber-50/50 dark:bg-amber-950/20 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground dark:text-foreground">
                            &ldquo;{hl.text}&rdquo;
                          </p>
                          <button
                            onClick={() => deleteHighlight(hl.id)}
                            className="text-muted-foreground hover:text-rose-600"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                        {hl.note && (
                          <div className="text-[11px] text-muted-foreground italic">Catatan: {hl.note}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs">
              Pilih klip dari daftar atau klip URL baru.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Capture Page Simulator */}
      {isClipModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-2">
              <Scissors className="size-4 text-teal-500" />
              Tangkap Konten Web (Web Clipper Engine §3)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">URL Halaman Web *</label>
                <input
                  type="url"
                  value={clipUrl}
                  onChange={(e) => setClipUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Judul Artikel / Halaman *</label>
                <input
                  type="text"
                  value={clipTitle}
                  onChange={(e) => setClipTitle(e.target.value)}
                  placeholder="Mis. Panduan Arsitektur Sistem..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Tipe Klip</label>
                  <select
                    value={clipType}
                    onChange={(e) => setClipType(e.target.value as ClipType)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    <option value="article">Article (Mode Reader)</option>
                    <option value="full_page">Full Page (Halaman Penuh)</option>
                    <option value="selection">Selection (Potongan Teks)</option>
                    <option value="bookmark">Bookmark (Tautan Saja)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Simpan ke Folder</label>
                  <select
                    value={clipFolderId}
                    onChange={(e) => setClipFolderId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    <option value="">(Inbox Tanpa Folder)</option>
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Konten Teks yang Di-ekstrak</label>
                <textarea
                  rows={4}
                  value={clipContent}
                  onChange={(e) => setClipContent(e.target.value)}
                  placeholder="Salin atau ketik konten yang ditangkap dari web..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan Pribadi Saat Klip</label>
                <input
                  type="text"
                  value={clipNote}
                  onChange={(e) => setClipNote(e.target.value)}
                  placeholder="Tujuan menyimpan klip ini..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClipModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleCaptureSubmit}
                className="px-4 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold"
              >
                Tangkap Konten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Highlight */}
      {isNewHighlightModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Highlighter className="size-4 text-amber-500" />
              Tandai Highlight Teks (§6)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Teks Kutipan yang Di-highlight *</label>
                <textarea
                  rows={3}
                  value={highlightText}
                  onChange={(e) => setHighlightText(e.target.value)}
                  placeholder="Kutipan penting dari artikel..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Anotasi / Catatan</label>
                <input
                  type="text"
                  value={highlightNote}
                  onChange={(e) => setHighlightNote(e.target.value)}
                  placeholder="Mengapa kutipan ini penting..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewHighlightModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleCreateHighlight}
                className="px-4 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold"
              >
                Simpan Highlight
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Folder */}
      {isNewFolderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <FolderPlus className="size-4 text-blue-500" />
              Folder Koleksi Baru
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Folder *</label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Mis. Riset Keuangan..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newFolderName.trim()) {
                    addFolder(newFolderName);
                    setNewFolderName("");
                    setIsNewFolderModalOpen(false);
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Buat Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Statistics (§11) */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="size-4 text-teal-500" />
                Statistik Web Clipper (§11)
              </h3>
              <button onClick={() => setIsStatsModalOpen(false)}>
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-muted/40 dark:bg-card border border-border dark:border-border">
                <div className="text-2xl font-bold text-foreground dark:text-foreground">
                  {stats.total}
                </div>
                <div className="text-[10px] uppercase text-muted-foreground font-semibold mt-1">
                  Total Klip Ditangkap
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {stats.promotionRate}
                </div>
                <div className="text-[10px] uppercase text-emerald-600 font-semibold mt-1">
                  Promotion Rate
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Klip Belum Diproses (Inbox):</span>
                <span className="font-bold">{stats.unprocessed} Klip</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Klip Lama (&gt; 14 Hari):</span>
                <span className="font-bold text-amber-600">{stats.oldUnprocessed} Klip</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Domain Paling Sering Di-klip:</span>
                <span className="font-bold text-teal-600">{stats.topDomain}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
