import { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Search,
  Share2,
  AlertTriangle,
  Trash2,
  Edit3,
  FolderTree,
  Link2,
  BarChart3,
  BookOpen,
  ArrowUpRight,
  X,
  CornerDownRight,
} from "lucide-react";
import { useWikiStore } from "./store";
import { useShellSections } from "@/app/shell-sections";

type WikiViewMode = "page" | "spaces" | "graph" | "recent" | "orphans" | "broken";

export function WikiApp() {
  const {
    spaces,
    pages,
    links,
    templates,
    addPage,
    updatePage,
    deletePage,
    addSpace,
    getBacklinks,
  } = useWikiStore();

  const [activeView, setActiveView] = useState<WikiViewMode>("page");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);
  const [selectedPageId, setSelectedPageId] = useState<string>(pages[0]?.id || "");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isNewPageModalOpen, setIsNewPageModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageSpaceId, setNewPageSpaceId] = useState(spaces[0]?.id || "");
  const [newPageTemplateId, setNewPageTemplateId] = useState("");
  const [newPageContent, setNewPageContent] = useState("");
  const [newPageTags, setNewPageTags] = useState("");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState("");

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isNewSpaceModalOpen, setIsNewSpaceModalOpen] = useState(false);
  const [newSpaceName, setNewSpaceName] = useState("");
  const [newSpaceDesc, setNewSpaceDesc] = useState("");

  // Pending creation modal from clicking red link
  const [pendingCreateTitle, setPendingCreateTitle] = useState<string | null>(null);

  // Selected Page
  const selectedPage = useMemo(
    () => pages.find((p) => p.id === selectedPageId) || pages[0],
    [pages, selectedPageId]
  );

  const selectedSpace = useMemo(
    () => spaces.find((s) => s.id === selectedPage?.spaceId),
    [spaces, selectedPage]
  );

  // Computed Backlinks for active page (§4)
  const activeBacklinks = useMemo(() => {
    if (!selectedPage) return [];
    return getBacklinks(selectedPage.id);
  }, [selectedPage, getBacklinks]);

  // Outbound links from active page

  // Orphan Pages (§9: 0 incoming, 0 outgoing)
  const orphanPages = useMemo(() => {
    return pages.filter((p) => {
      const outCount = links.filter((l) => l.fromPageId === p.id).length;
      const inCount = links.filter(
        (l) => l.toPageId === p.id || l.toPageTitle.toLowerCase() === p.title.toLowerCase()
      ).length;
      return outCount === 0 && inCount === 0;
    });
  }, [pages, links]);

  // Broken / Pending Links (§9)
  const brokenLinks = useMemo(() => {
    return links.filter((l) => !l.toPageId || l.isBroken);
  }, [links]);

  // Statistics (§11)
  const stats = useMemo(() => {
    const total = pages.length;
    const totalSpaces = spaces.length;
    const orphanCount = orphanPages.length;
    const brokenCount = brokenLinks.length;

    // Most Linked Page (Hub)
    const inCountMap: Record<string, number> = {};
    links.forEach((l) => {
      const key = l.toPageTitle.toLowerCase();
      inCountMap[key] = (inCountMap[key] || 0) + 1;
    });
    let topTitle = "-";
    let maxLinks = 0;
    Object.entries(inCountMap).forEach(([title, count]) => {
      if (count > maxLinks) {
        maxLinks = count;
        topTitle = title;
      }
    });

    return {
      total,
      totalSpaces,
      orphanCount,
      brokenCount,
      topTitle,
      maxLinks,
    };
  }, [pages, spaces, orphanPages, brokenLinks, links]);

  // Filtered pages
  const filteredPages = useMemo(() => {
    return pages.filter((p) => {
      if (selectedSpaceId && p.spaceId !== selectedSpaceId) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [pages, selectedSpaceId, searchQuery]);

  // Publish this app's views as shell sections (sidebar + header buttons).
  useShellSections([
    {
      id: "page",
      label: "Semua Halaman",
      icon: FileText,
      active: activeView === "page",
      onSelect: () => setActiveView("page"),
    },
    {
      id: "graph",
      label: "Graph View",
      icon: Share2,
      active: activeView === "graph",
      onSelect: () => setActiveView("graph"),
    },
    {
      id: "orphans",
      label: "Orphan Pages",
      icon: AlertTriangle,
      active: activeView === "orphans",
      onSelect: () => setActiveView("orphans"),
    },
    {
      id: "broken",
      label: "Pending / Broken Links",
      icon: Link2,
      active: activeView === "broken",
      onSelect: () => setActiveView("broken"),
    },
  ]);

  const openCreatePageModal = (presetTitle?: string) => {
    setNewPageTitle(presetTitle || "");
    setNewPageSpaceId(selectedSpaceId || spaces[0]?.id || "");
    setNewPageTemplateId("");
    setNewPageContent(
      `# ${presetTitle || "Judul Halaman"}\n\nTulis isi dokumentasi di sini. Anda dapat menautkan ke halaman lain dengan mengetik [[Nama Halaman]].`
    );
    setNewPageTags("");
    setIsNewPageModalOpen(true);
  };

  const handleCreatePageSubmit = () => {
    if (!newPageTitle.trim() || !newPageSpaceId) return;

    let finalContent = newPageContent;
    if (newPageTemplateId) {
      const tmpl = templates.find((t) => t.id === newPageTemplateId);
      if (tmpl) {
        finalContent = tmpl.contentStructure.replace("[Nama Service]", newPageTitle);
      }
    }

    const created = addPage({
      title: newPageTitle,
      content: finalContent,
      spaceId: newPageSpaceId,
      parentPageId: null,
      tags: newPageTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      status: "published",
    });

    setSelectedPageId(created.id);
    setIsNewPageModalOpen(false);
    setPendingCreateTitle(null);
  };

  const openEditPageModal = () => {
    if (!selectedPage) return;
    setEditTitle(selectedPage.title);
    setEditContent(selectedPage.content);
    setEditTags(selectedPage.tags.join(", "));
    setIsEditModalOpen(true);
  };

  const handleEditPageSubmit = () => {
    if (!selectedPage || !editTitle.trim()) return;
    updatePage(
      selectedPage.id,
      {
        title: editTitle,
        content: editContent,
        tags: editTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      },
      "Pembaruan dokumentasi Wiki"
    );
    setIsEditModalOpen(false);
  };

  // Render content with interactive Wikilinks [[Title]]
  const renderWikilinkContent = (content: string) => {
    const parts = content.split(/(\[\[.*?\]\])/g);

    return parts.map((part, idx) => {
      if (part.startsWith("[[") && part.endsWith("]]")) {
        const linkTitle = part.slice(2, -2).trim();
        const targetPage = pages.find(
          (p) => p.title.toLowerCase() === linkTitle.toLowerCase()
        );

        if (targetPage) {
          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedPageId(targetPage.id);
                setActiveView("page");
              }}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-100 hover:underline mx-0.5 text-xs transition-colors"
            >
              <Link2 className="size-3" />
              {linkTitle}
            </button>
          );
        } else {
          // Pending / Red link (§3.3 & §4)
          return (
            <button
              key={idx}
              onClick={() => {
                setPendingCreateTitle(linkTitle);
                openCreatePageModal(linkTitle);
              }}
              title="Halaman belum dibuat. Klik untuk membuat sekarang!"
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold hover:bg-rose-100 border border-dashed border-rose-300 mx-0.5 text-xs transition-colors"
            >
              <Plus className="size-3" />
              {linkTitle} (Baru)
            </button>
          );
        }
      }
      return <span key={idx}>{part}</span>;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/40 dark:bg-background text-foreground dark:text-foreground overflow-hidden font-sans">
      {/* Top Bar Header */}
      <div className="bg-card dark:bg-background border-b border-border dark:border-border px-4 py-3 shrink-0 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-card border border-border dark:border-border shadow-xs flex items-center justify-center text-foreground dark:text-foreground shrink-0 font-bold">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground dark:text-foreground">Wiki Engine</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted dark:bg-card font-semibold text-muted-foreground dark:text-foreground border border-border dark:border-border">
                #18 Standalone
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold border border-cyan-200 dark:border-cyan-800">
                Wikilinks & Backlinks
              </span>
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Dokumentasi kolaboratif organik dengan tautan internal dua arah otomatis ala ensiklopedia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border dark:border-border text-xs font-medium hover:bg-muted/40 dark:hover:bg-card transition-colors"
          >
            <BarChart3 className="size-3.5 text-muted-foreground" />
            Statistik ({stats.brokenCount} pending links)
          </button>
          <button
            onClick={() => openCreatePageModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-foreground dark:bg-card text-background dark:text-foreground text-xs font-semibold hover:opacity-90 shadow-xs transition-opacity"
          >
            <Plus className="size-4" />
            Halaman Wiki Baru
          </button>
        </div>
      </div>

      {/* Main Workspace 3-Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Spaces & Navigation */}
        <div className="w-60 bg-muted/40 dark:bg-background/50 border-r border-border dark:border-border flex flex-col shrink-0">
          <div className="p-3 border-b border-border dark:border-border space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider px-2">
              Navigasi Wiki
            </span>
            <button
              onClick={() => {
                setActiveView("page");
                setSelectedSpaceId(null);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "page" && !selectedSpaceId
                  ? "bg-card dark:bg-card text-foreground dark:text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="size-3.5 text-blue-500" />
                <span>Semua Halaman</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-card text-muted-foreground">
                {pages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView("graph")}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "graph"
                  ? "bg-card dark:bg-card text-foreground dark:text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Share2 className="size-3.5 text-purple-500" />
                <span>Graph View (Wikilinks)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-card text-muted-foreground">
                {links.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView("orphans")}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "orphans"
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-amber-500" />
                <span>Orphan Pages</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {orphanPages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView("broken")}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "broken"
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 border border-rose-200 font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted"
              }`}
            >
              <div className="flex items-center gap-2">
                <Link2 className="size-3.5 text-rose-500" />
                <span>Pending / Broken Links</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                {brokenLinks.length}
              </span>
            </button>
          </div>

          {/* Spaces List (§5) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                Wiki Spaces
              </span>
              <button
                onClick={() => setIsNewSpaceModalOpen(true)}
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-0.5"
              >
                <Plus className="size-3" /> Tambah
              </button>
            </div>

            {spaces.map((spc) => {
              const count = pages.filter((p) => p.spaceId === spc.id).length;
              const isSelected = selectedSpaceId === spc.id;
              return (
                <button
                  key={spc.id}
                  onClick={() => {
                    setSelectedSpaceId(isSelected ? null : spc.id);
                    setActiveView("page");
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200"
                      : "text-foreground dark:text-foreground hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderTree className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{spc.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Panel: Pages List */}
        <div className="w-72 bg-card dark:bg-background border-r border-border dark:border-border flex flex-col shrink-0">
          <div className="p-3 border-b border-border dark:border-border">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari halaman Wiki..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card text-xs outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border dark:divide-border/60">
            {activeView === "orphans" ? (
              orphanPages.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-xs">
                  Bagus! Tidak ada halaman orphan (semua halaman saling terhubung).
                </div>
              ) : (
                orphanPages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPageId(p.id);
                      setActiveView("page");
                    }}
                    className="w-full text-left p-3 hover:bg-muted/40 space-y-1 text-xs"
                  >
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                      Orphan
                    </span>
                    <h4 className="font-bold text-foreground dark:text-foreground">{p.title}</h4>
                  </button>
                ))
              )
            ) : activeView === "broken" ? (
              brokenLinks.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-xs">
                  Semua tautan internal terhubung sempurna.
                </div>
              ) : (
                brokenLinks.map((l) => (
                  <div key={l.id} className="p-3 space-y-1 text-xs">
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-bold uppercase">
                      Pending Link
                    </span>
                    <h4 className="font-bold text-foreground dark:text-foreground">
                      [[{l.toPageTitle}]]
                    </h4>
                    <p className="text-[10px] text-muted-foreground">Dirujuk dari halaman: {l.fromPageId}</p>
                    <button
                      onClick={() => openCreatePageModal(l.toPageTitle)}
                      className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1 mt-1"
                    >
                      <Plus className="size-3" /> Buat Halaman Ini
                    </button>
                  </div>
                ))
              )
            ) : filteredPages.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-xs">
                Tidak ada halaman yang cocok.
              </div>
            ) : (
              filteredPages.map((p) => {
                const isSelected = p.id === selectedPageId;
                const bCount = getBacklinks(p.id).length;

                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPageId(p.id);
                      setActiveView("page");
                    }}
                    className={`w-full text-left p-3 transition-colors ${
                      isSelected
                        ? "bg-blue-50/70 dark:bg-blue-950/30 border-l-3 border-blue-600"
                        : "hover:bg-muted/40 dark:hover:bg-card/50"
                    }`}
                  >
                    <h3 className="text-xs font-bold text-foreground dark:text-foreground line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {p.content.replace(/^#+\s+/gm, "").slice(0, 60)}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>{bCount} backlinks</span>
                      <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Page Viewer / Graph View */}
        <div className="flex-1 bg-muted/40 dark:bg-background overflow-y-auto flex flex-col">
          {activeView === "graph" ? (
            <div className="flex-1 p-6 flex flex-col">
              <div className="mb-4">
                <h2 className="text-sm font-bold text-foreground dark:text-foreground">
                  Wiki Knowledge Graph
                </h2>
                <p className="text-xs text-muted-foreground">
                  Visualisasi interkoneksi dokumen Wiki melalui tautan internal [[Wikilink]].
                </p>
              </div>

              <div className="flex-1 rounded-2xl bg-card dark:bg-background border border-border dark:border-border p-6 flex flex-wrap gap-4 items-center justify-center overflow-auto shadow-2xs">
                {pages.map((p) => {
                  const outLinks = links.filter((l) => l.fromPageId === p.id);
                  const isSel = p.id === selectedPageId;

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPageId(p.id);
                        setActiveView("page");
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer max-w-xs shadow-xs ${
                        isSel
                          ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/50 dark:bg-blue-950/40"
                          : "border-border dark:border-border bg-card dark:bg-card hover:scale-105"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Page</span>
                      </div>
                      <h4 className="text-xs font-bold text-foreground dark:text-foreground">
                        {p.title}
                      </h4>
                      {outLinks.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border dark:border-border space-y-1">
                          {outLinks.map((l) => (
                            <div
                              key={l.id}
                              className="text-[10px] text-muted-foreground flex items-center gap-1"
                            >
                              <ArrowUpRight className="size-3 text-cyan-500" />
                              <span>menautkan ke: </span>
                              <span className="font-semibold text-foreground dark:text-foreground">
                                [[{l.toPageTitle}]]
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : selectedPage ? (
            <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
              {/* Page Header Bar */}
              <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground dark:text-foreground">
                      Space: {selectedSpace?.name || "Global"}
                    </span>
                    <span>&bull;</span>
                    <span>Terakhir diedit: {new Date(selectedPage.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={openEditPageModal}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="size-3.5" /> Edit Halaman
                    </button>
                    <button
                      onClick={() => deletePage(selectedPage.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600"
                      title="Hapus Halaman"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <h1 className="text-xl font-bold text-foreground dark:text-foreground">
                  {selectedPage.title}
                </h1>

                {selectedPage.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedPage.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-muted dark:bg-card text-muted-foreground dark:text-foreground"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Page Body with Interactive Wikilinks (§4) */}
              <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-6 shadow-2xs">
                <div className="prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap font-sans">
                  {renderWikilinkContent(selectedPage.content)}
                </div>
              </div>

              {/* Automatic Backlinks Section (§4) */}
              <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
                    <CornerDownRight className="size-4 text-cyan-600" />
                    Backlinks Otomatis ({activeBacklinks.length})
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    Halaman lain yang menautkan ke dokumen ini
                  </span>
                </div>

                {activeBacklinks.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">
                    Belum ada halaman lain yang menautkan ke dokumen ini via [[{selectedPage.title}]].
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeBacklinks.map((bl) => {
                      const fromPage = pages.find((p) => p.id === bl.fromPageId);
                      return (
                        <div
                          key={bl.id}
                          onClick={() => {
                            if (fromPage) {
                              setSelectedPageId(fromPage.id);
                            }
                          }}
                          className="p-3 rounded-xl border border-border dark:border-border bg-muted/40/50 dark:bg-card/40 hover:bg-muted cursor-pointer text-xs space-y-0.5"
                        >
                          <div className="font-semibold text-foreground dark:text-foreground">
                            {fromPage?.title || "Halaman tidak dikenal"}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Menautkan via wikilink internal
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs">
              Pilih halaman Wiki dari menu sebelah kiri.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Wiki Page */}
      {isNewPageModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-2">
              <FileText className="size-4 text-blue-500" />
              Buat Halaman Wiki Baru (§3)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Halaman *</label>
                <input
                  type="text"
                  value={newPageTitle}
                  onChange={(e) => setNewPageTitle(e.target.value)}
                  placeholder="Mis. Microservices Architecture..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Space</label>
                  <select
                    value={newPageSpaceId}
                    onChange={(e) => setNewPageSpaceId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    {spaces.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Template (Opsional)</label>
                  <select
                    value={newPageTemplateId}
                    onChange={(e) => setNewPageTemplateId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    <option value="">(Blank Page)</option>
                    {templates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Isi Konten (Markdown & Wikilink)</label>
                <textarea
                  rows={8}
                  value={newPageContent}
                  onChange={(e) => setNewPageContent(e.target.value)}
                  placeholder="Tulis konten... Sisipkan [[Nama Halaman]] untuk membuat tautan!"
                  className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tags (Koma)</label>
                <input
                  type="text"
                  value={newPageTags}
                  onChange={(e) => setNewPageTags(e.target.value)}
                  placeholder="DevOps, Cloud, API"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewPageModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleCreatePageSubmit}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Buat Halaman
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Wiki Page */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-lg p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Edit3 className="size-4 text-blue-500" />
              Edit Halaman Wiki
            </h3>
            <p className="text-xs text-muted-foreground">
              Mengubah judul halaman otomatis akan memperbarui seluruh tautan [[Wikilink]] yang
              mengarah ke sini di halaman lain.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Halaman *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Isi Konten</label>
                <textarea
                  rows={8}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card leading-relaxed"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Tags (Koma)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleEditPageSubmit}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Space */}
      {isNewSpaceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <FolderTree className="size-4 text-blue-500" />
              Buat Space Baru (§5)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Space *</label>
                <input
                  type="text"
                  value={newSpaceName}
                  onChange={(e) => setNewSpaceName(e.target.value)}
                  placeholder="Mis. HR & People Operations..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Deskripsi Space</label>
                <input
                  type="text"
                  value={newSpaceDesc}
                  onChange={(e) => setNewSpaceDesc(e.target.value)}
                  placeholder="Cakupan topik halaman..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewSpaceModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (newSpaceName.trim()) {
                    addSpace({
                      name: newSpaceName,
                      description: newSpaceDesc,
                      visibility: "team",
                    });
                    setNewSpaceName("");
                    setNewSpaceDesc("");
                    setIsNewSpaceModalOpen(false);
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Buat Space
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
                <BarChart3 className="size-4 text-cyan-600" />
                Statistik & Metrik Wiki (§11)
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
                  Total Halaman
                </div>
              </div>
              <div className="p-4 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200">
                <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">
                  {stats.maxLinks}
                </div>
                <div className="text-[10px] uppercase text-cyan-600 font-semibold mt-1">
                  Max Backlinks (Hub)
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Halaman Paling Banyak Ditautkan (Hub):</span>
                <span className="font-bold">[[{stats.topTitle}]]</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Orphan Pages (Tanpa Tautan):</span>
                <span className="font-bold text-amber-600">{stats.orphanCount} Halaman</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Pending / Broken Links:</span>
                <span className="font-bold text-rose-600">{stats.brokenCount} Tautan</span>
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
