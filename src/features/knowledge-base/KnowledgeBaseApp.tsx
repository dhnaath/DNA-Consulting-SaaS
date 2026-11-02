import { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Search,
  Share2,
  AlertTriangle,
  ShieldCheck,
  Trash2,
  Edit3,
  Copy,
  FolderTree,
  ExternalLink,
  Link2,
  History,
  BarChart3,
  Sparkles,
  Tag,
  ArrowUpRight,
  Info,
  X,
} from "lucide-react";
import { useKnowledgeBaseStore } from "./store";
import { getRaw } from "../../core/rawStorage";
import { useShellSections } from "@/app/shell-sections";
import {
  Article,
  ReviewStatus,
  SourceReliability,
  RelationType,
  SourceType,
} from "./types";

type ViewMode =
  | "all"
  | "category"
  | "graph"
  | "recent"
  | "needs_review"
  | "reliability";

export function KnowledgeBaseApp() {
  const {
    articles,
    categories,
    sources,
    relations,
    revisions,
    data,
    addArticle,
    updateArticle,
    deleteArticle,
    duplicateArticle,
    addCategory,
    addSource,
    deleteSource,
    addRelation,
    deleteRelation,
    markOutdated,
    verifyArticle,
    promoteFromNote,
    isNeedsReview,
  } = useKnowledgeBaseStore();

  const [activeView, setActiveView] = useState<ViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(articles[0]?.id || null);

  // Modals
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    summary: "",
    content: "",
    categoryId: "",
    tags: "",
    reviewStatus: "draft" as ReviewStatus,
  });

  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [sourceForm, setSourceForm] = useState({
    title: "",
    author: "",
    url: "",
    type: "website" as SourceType,
    reliability: "high" as SourceReliability,
    excerpt: "",
  });

  const [isRelationModalOpen, setIsRelationModalOpen] = useState(false);
  const [relationForm, setRelationForm] = useState({
    toArticleId: "",
    type: "prerequisite" as RelationType,
    note: "",
  });

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [newCatParent, setNewCatParent] = useState("");

  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false);

  // Selected Article
  const selectedArticle = useMemo(
    () => articles.find((a) => a.id === selectedArticleId),
    [articles, selectedArticleId]
  );

  // Filtered Articles
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = art.title.toLowerCase().includes(q);
        const matchSummary = (art.summary || "").toLowerCase().includes(q);
        const matchContent = art.content.toLowerCase().includes(q);
        const matchTag = art.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchSummary && !matchContent && !matchTag) return false;
      }

      if (selectedStatus !== "all" && art.reviewStatus !== selectedStatus) {
        return false;
      }

      if (selectedCategoryId && art.categoryId !== selectedCategoryId) {
        return false;
      }

      if (activeView === "needs_review") {
        return isNeedsReview(art);
      }

      return true;
    });
  }, [articles, searchQuery, selectedStatus, selectedCategoryId, activeView, isNeedsReview]);

  // Statistics Calculation (§12)
  const stats = useMemo(() => {
    const total = articles.length;
    const verified = articles.filter((a) => a.reviewStatus === "verified").length;
    const reviewed = articles.filter((a) => a.reviewStatus === "reviewed").length;
    const draft = articles.filter((a) => a.reviewStatus === "draft").length;
    const outdated = articles.filter((a) => isNeedsReview(a)).length;

    const avgSources = total > 0 ? (sources.length / total).toFixed(1) : "0";

    // Most Referenced Article (COUNT Relation WHERE toArticleId = X)
    const refCountMap: Record<string, number> = {};
    relations.forEach((r) => {
      refCountMap[r.toArticleId] = (refCountMap[r.toArticleId] || 0) + 1;
    });

    let mostRefId: string | null = null;
    let maxRefs = 0;
    Object.entries(refCountMap).forEach(([id, count]) => {
      if (count > maxRefs) {
        maxRefs = count;
        mostRefId = id;
      }
    });

    const mostRefArticle = articles.find((a) => a.id === mostRefId);
    const outdatedRatio = total > 0 ? Math.round((outdated / total) * 100) : 0;

    return {
      total,
      verified,
      reviewed,
      draft,
      outdated,
      avgSources,
      mostRefArticle,
      maxRefs,
      outdatedRatio,
    };
  }, [articles, sources, relations, isNeedsReview]);

  // Open Edit Modal
  const openEditModal = (art?: Article) => {
    if (art) {
      setEditingArticleId(art.id);
      setArticleForm({
        title: art.title,
        summary: art.summary || "",
        content: art.content,
        categoryId: art.categoryId || "",
        tags: art.tags.join(", "),
        reviewStatus: art.reviewStatus,
      });
    } else {
      setEditingArticleId(null);
      setArticleForm({
        title: "",
        summary: "",
        content: `# Judul Artikel\n\nPenjelasan komprehensif mengenai konsep dan prinsip topik ini...`,
        categoryId: categories[0]?.id || "",
        tags: "",
        reviewStatus: "draft",
      });
    }
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = () => {
    if (!articleForm.title.trim()) return;

    const tagsArr = articleForm.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingArticleId) {
      updateArticle(editingArticleId, {
        title: articleForm.title,
        summary: articleForm.summary,
        content: articleForm.content,
        categoryId: articleForm.categoryId || null,
        tags: tagsArr,
        reviewStatus: articleForm.reviewStatus,
      });
    } else {
      const created = addArticle({
        title: articleForm.title,
        summary: articleForm.summary,
        content: articleForm.content,
        categoryId: articleForm.categoryId || null,
        tags: tagsArr,
        reviewStatus: articleForm.reviewStatus,
      });
      setSelectedArticleId(created.id);
    }

    setIsArticleModalOpen(false);
  };

  const handleAddSource = () => {
    if (!selectedArticleId || !sourceForm.title.trim()) return;
    addSource({
      articleId: selectedArticleId,
      title: sourceForm.title,
      author: sourceForm.author || undefined,
      url: sourceForm.url || undefined,
      type: sourceForm.type,
      reliability: sourceForm.reliability,
      excerpt: sourceForm.excerpt || undefined,
    });
    setSourceForm({
      title: "",
      author: "",
      url: "",
      type: "website",
      reliability: "high",
      excerpt: "",
    });
    setIsSourceModalOpen(false);
  };

  const handleAddRelation = () => {
    if (!selectedArticleId || !relationForm.toArticleId) return;
    addRelation({
      fromArticleId: selectedArticleId,
      toArticleId: relationForm.toArticleId,
      type: relationForm.type,
      note: relationForm.note || undefined,
    });
    setRelationForm({
      toArticleId: "",
      type: "prerequisite",
      note: "",
    });
    setIsRelationModalOpen(false);
  };

  const handleAddCategorySubmit = () => {
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName,
      description: newCatDesc || undefined,
      parentCategoryId: newCatParent || null,
    });
    setNewCatName("");
    setNewCatDesc("");
    setNewCatParent("");
    setIsCategoryModalOpen(false);
  };

  // Pull notes from Note Manager to promote
  const availableNotesToPromote = useMemo(() => {
    try {
      const raw = getRaw("aio_notes_data_v1");
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.notes)) {
        return parsed.notes.map((n: any) => ({
          id: n.id,
          title: n.title || "Catatan Tanpa Judul",
          content: n.blocks?.map((b: any) => b.content).join("\n\n") || "",
        }));
      }
      return [];
    } catch {
      return [];
    }
  }, [isPromoteModalOpen]);

  // Current article sources & relations
  const articleSources = useMemo(
    () => sources.filter((s) => s.articleId === selectedArticleId),
    [sources, selectedArticleId]
  );

  const outboundRelations = useMemo(
    () => relations.filter((r) => r.fromArticleId === selectedArticleId),
    [relations, selectedArticleId]
  );

  const inboundRelations = useMemo(
    () => relations.filter((r) => r.toArticleId === selectedArticleId),
    [relations, selectedArticleId]
  );

  const articleRevisions = useMemo(
    () => revisions.filter((r) => r.articleId === selectedArticleId),
    [revisions, selectedArticleId]
  );

  // Publish this app's views + categories as shell sections (sidebar + header).
  useShellSections([
    {
      id: "all",
      label: "Semua Artikel",
      icon: BookOpen,
      active: activeView === "all" && !selectedCategoryId,
      onSelect: () => {
        setActiveView("all");
        setSelectedCategoryId(null);
      },
    },
    {
      id: "needs_review",
      label: "Perlu Review",
      icon: AlertTriangle,
      active: activeView === "needs_review",
      onSelect: () => setActiveView("needs_review"),
    },
    {
      id: "graph",
      label: "Graph View (Relasi)",
      icon: Share2,
      active: activeView === "graph",
      onSelect: () => setActiveView("graph"),
    },
    ...categories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      icon: FolderTree,
      active: activeView === "category" && selectedCategoryId === cat.id,
      onSelect: () => {
        setSelectedCategoryId(cat.id);
        setActiveView("category");
      },
    })),
  ]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/40 dark:bg-background text-foreground dark:text-foreground overflow-hidden font-sans">
      {/* Top Header Banner */}
      <div className="bg-card dark:bg-background border-b border-border dark:border-border px-4 py-3 shrink-0 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-card border border-border dark:border-border shadow-xs flex items-center justify-center text-foreground dark:text-foreground shrink-0 font-bold">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground dark:text-foreground">Knowledge Base</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted dark:bg-card font-semibold text-muted-foreground dark:text-foreground border border-border dark:border-border">
                #14 Standalone
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800">
                SSOT for Articles
              </span>
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Pengetahuan terstruktur, artikel terhubung dengan sumber kredibel & relasi bermakna
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border dark:border-border text-xs font-medium hover:bg-muted/40 dark:hover:bg-card transition-colors"
          >
            <BarChart3 className="size-3.5 text-muted-foreground" />
            Statistik ({stats.outdatedRatio}% perlu review)
          </button>
          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 transition-colors"
          >
            <Sparkles className="size-3.5" />
            Promote dari Notes (#12)
          </button>
          <button
            onClick={() => openEditModal()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-foreground dark:bg-card text-background dark:text-foreground text-xs font-semibold hover:opacity-90 shadow-xs transition-opacity"
          >
            <Plus className="size-4" />
            Artikel Baru
          </button>
        </div>
      </div>

      {/* Main Workspace 3-Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Categories & Views */}
        <div className="w-64 bg-muted/40 dark:bg-background/50 border-r border-border dark:border-border flex flex-col shrink-0">
          <div className="p-3 border-b border-border dark:border-border space-y-1">
            <span className="text-[11px] font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider px-2">
              Tampilan Pengetahuan
            </span>
            <button
              onClick={() => {
                setActiveView("all");
                setSelectedCategoryId(null);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "all" && !selectedCategoryId
                  ? "bg-card dark:bg-card text-foreground dark:text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-card/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="size-3.5 text-blue-500" />
                <span>Semua Artikel</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-card text-muted-foreground dark:text-foreground">
                {articles.length}
              </span>
            </button>

            <button
              onClick={() => setActiveView("needs_review")}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "needs_review"
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-card/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-3.5 text-amber-500" />
                <span>Perlu Review ({stats.outdated})</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300">
                Freshness
              </span>
            </button>

            <button
              onClick={() => setActiveView("graph")}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeView === "graph"
                  ? "bg-card dark:bg-card text-foreground dark:text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground dark:text-muted-foreground hover:bg-muted dark:hover:bg-card/60"
              }`}
            >
              <div className="flex items-center gap-2">
                <Share2 className="size-3.5 text-purple-500" />
                <span>Graph View (Relasi)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted dark:bg-card text-muted-foreground dark:text-foreground">
                {relations.length}
              </span>
            </button>
          </div>

          {/* Hierarchical Categories */}
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            <div className="flex items-center justify-between px-2 py-1">
              <span className="text-[11px] font-bold text-muted-foreground dark:text-muted-foreground uppercase tracking-wider">
                Kategori Hierarkis
              </span>
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                <Plus className="size-3" /> Tambah
              </button>
            </div>

            {categories.map((cat) => {
              const count = articles.filter((a) => a.categoryId === cat.id).length;
              const isSelected = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategoryId(isSelected ? null : cat.id);
                    setActiveView("category");
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    cat.parentCategoryId ? "pl-5" : ""
                  } ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800"
                      : "text-foreground dark:text-foreground hover:bg-muted dark:hover:bg-card/60"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderTree className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Panel: Article List */}
        <div className="w-80 bg-card dark:bg-background border-r border-border dark:border-border flex flex-col shrink-0">
          {/* Search & Filter Bar */}
          <div className="p-3 border-b border-border dark:border-border space-y-2">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul, konten, tag..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card text-xs focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Status Review:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-xs bg-muted/40 dark:bg-card border border-border dark:border-border rounded-md px-2 py-0.5 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="verified">Verified (Teruji)</option>
                <option value="reviewed">Reviewed</option>
                <option value="draft">Draft</option>
                <option value="outdated">Outdated</option>
              </select>
            </div>
          </div>

          {/* Article List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-border dark:divide-border/60">
            {filteredArticles.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-xs">
                Tidak ada artikel yang cocok dengan filter.
              </div>
            ) : (
              filteredArticles.map((art) => {
                const isSelected = art.id === selectedArticleId;
                const srcCount = sources.filter((s) => s.articleId === art.id).length;
                const relCount = relations.filter(
                  (r) => r.fromArticleId === art.id || r.toArticleId === art.id
                ).length;
                const needsRev = isNeedsReview(art);

                return (
                  <button
                    key={art.id}
                    onClick={() => setSelectedArticleId(art.id)}
                    className={`w-full text-left p-3 transition-colors ${
                      isSelected
                        ? "bg-blue-50/70 dark:bg-blue-950/30 border-l-3 border-blue-600"
                        : "hover:bg-muted/40 dark:hover:bg-card/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          art.reviewStatus === "verified"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : art.reviewStatus === "reviewed"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                            : art.reviewStatus === "outdated" || needsRev
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-muted text-foreground dark:bg-card dark:text-foreground"
                        }`}
                      >
                        {needsRev && art.reviewStatus !== "outdated" ? "Needs Review" : art.reviewStatus}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(art.updatedAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-foreground dark:text-foreground line-clamp-1">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground dark:text-muted-foreground line-clamp-2 mt-0.5">
                      {art.summary || art.content.slice(0, 90)}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Link2 className="size-3" /> {srcCount} Sumber
                      </span>
                      <span className="flex items-center gap-1">
                        <Share2 className="size-3" /> {relCount} Relasi
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Content / Graph View */}
        <div className="flex-1 bg-muted/40 dark:bg-background flex flex-col overflow-hidden">
          {activeView === "graph" ? (
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-foreground dark:text-foreground">
                    Interactive Knowledge Graph
                  </h2>
                  <p className="text-xs text-muted-foreground dark:text-muted-foreground">
                    Visualisasi jaringan hubungan antar-Artikel (prerequisite, related, dsb.)
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Artikel
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Verified
                  </span>
                </div>
              </div>

              {/* Node-Graph Visualizer */}
              <div className="flex-1 rounded-2xl bg-card dark:bg-background border border-border dark:border-border p-6 flex flex-wrap gap-4 items-center justify-center relative overflow-auto shadow-2xs">
                {articles.map((art) => {
                  const outRels = relations.filter((r) => r.fromArticleId === art.id);
                  const isSel = art.id === selectedArticleId;

                  return (
                    <div
                      key={art.id}
                      onClick={() => setSelectedArticleId(art.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer max-w-xs shadow-xs ${
                        isSel
                          ? "ring-2 ring-blue-500 border-blue-500 bg-blue-50/50 dark:bg-blue-950/40"
                          : "border-border dark:border-border bg-card dark:bg-card hover:scale-105"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">
                          {art.reviewStatus}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-foreground dark:text-foreground">
                        {art.title}
                      </h4>
                      {outRels.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border dark:border-border/60 space-y-1">
                          {outRels.map((r) => {
                            const target = articles.find((a) => a.id === r.toArticleId);
                            return (
                              <div
                                key={r.id}
                                className="text-[10px] text-muted-foreground flex items-center gap-1"
                              >
                                <ArrowUpRight className="size-3 text-purple-500" />
                                <span className="font-semibold text-purple-600 dark:text-purple-400">
                                  {r.type}
                                </span>{" "}
                                &rarr; {target?.title || "Unknown"}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : selectedArticle ? (
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Article Top Bar */}
              <div className="bg-card dark:bg-background border-b border-border dark:border-border p-4 shrink-0 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        selectedArticle.reviewStatus === "verified"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300"
                          : selectedArticle.reviewStatus === "reviewed"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          : selectedArticle.reviewStatus === "outdated" || isNeedsReview(selectedArticle)
                          ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300"
                          : "bg-muted text-foreground dark:bg-card dark:text-foreground"
                      }`}
                    >
                      {selectedArticle.reviewStatus}
                    </span>
                    {categories.find((c) => c.id === selectedArticle.categoryId) && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted dark:bg-card text-muted-foreground dark:text-foreground">
                        {categories.find((c) => c.id === selectedArticle.categoryId)?.name}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-foreground dark:text-foreground">
                    {selectedArticle.title}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => verifyArticle(selectedArticle.id)}
                    title="Validasi Akurasi Sumber"
                    className="p-1.5 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-medium flex items-center gap-1"
                  >
                    <ShieldCheck className="size-3.5" />
                    Verify
                  </button>
                  <button
                    onClick={() => markOutdated(selectedArticle.id)}
                    title="Tandai Perlu Ditinjau Ulang"
                    className="p-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-xs font-medium flex items-center gap-1"
                  >
                    <AlertTriangle className="size-3.5" />
                    Outdated
                  </button>
                  <button
                    onClick={() => duplicateArticle(selectedArticle.id)}
                    className="p-1.5 rounded-lg border border-border hover:bg-muted dark:border-border text-muted-foreground dark:text-foreground"
                    title="Duplikasi"
                  >
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    onClick={() => openEditModal(selectedArticle)}
                    className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300"
                    title="Edit Artikel"
                  >
                    <Edit3 className="size-3.5" />
                  </button>
                  <button
                    onClick={() => deleteArticle(selectedArticle.id)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* Article Content & Side Tabs */}
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Body */}
                <div className="lg:col-span-2 space-y-6">
                  {selectedArticle.summary && (
                    <div className="p-3.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 text-xs text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
                      <div className="font-bold mb-1 flex items-center gap-1 text-[11px] uppercase tracking-wider text-blue-700 dark:text-blue-400">
                        <Info className="size-3.5" /> Ringkasan
                      </div>
                      {selectedArticle.summary}
                    </div>
                  )}

                  <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-6 shadow-2xs">
                    <div className="prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed whitespace-pre-wrap">
                      {selectedArticle.content}
                    </div>
                  </div>

                  {/* Tags */}
                  {selectedArticle.tags.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <Tag className="size-3.5 text-muted-foreground" />
                      {selectedArticle.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-muted dark:bg-card text-muted-foreground dark:text-foreground"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Columns: Sources (§4), Relations (§6), Revisions (§7) */}
                <div className="space-y-6">
                  {/* Sources (§4 Jejak Kredibilitas) */}
                  <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
                        <Link2 className="size-3.5 text-blue-500" />
                        Sumber Kredibel ({articleSources.length})
                      </h3>
                      <button
                        onClick={() => setIsSourceModalOpen(true)}
                        className="text-[11px] text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="size-3" /> Tambah
                      </button>
                    </div>

                    <div className="space-y-2">
                      {articleSources.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground italic">
                          Belum ada sumber pendukung. Klaim penting idealnya memiliki rujukan terverifikasi.
                        </p>
                      ) : (
                        articleSources.map((src) => (
                          <div
                            key={src.id}
                            className="p-2.5 rounded-xl border border-border dark:border-border bg-muted/40/50 dark:bg-card/40 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                  src.reliability === "high"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : src.reliability === "medium"
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-rose-100 text-rose-800"
                                }`}
                              >
                                {src.reliability} credibility
                              </span>
                              <button
                                onClick={() => deleteSource(src.id)}
                                className="text-muted-foreground hover:text-rose-600"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                            <div className="font-semibold text-foreground dark:text-foreground">
                              {src.title}
                            </div>
                            {src.author && (
                              <div className="text-[10px] text-muted-foreground">Oleh: {src.author}</div>
                            )}
                            {src.url && (
                              <a
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="size-2.5" /> Buka Tautan
                              </a>
                            )}
                            {src.excerpt && (
                              <p className="text-[10px] text-muted-foreground italic border-l-2 border-border pl-1.5 mt-1">
                                &ldquo;{src.excerpt}&rdquo;
                              </p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Relations (§6 Relasi Bermakna) */}
                  <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
                        <Share2 className="size-3.5 text-purple-500" />
                        Relasi Antar-Artikel
                      </h3>
                      <button
                        onClick={() => setIsRelationModalOpen(true)}
                        className="text-[11px] text-purple-600 font-semibold hover:underline flex items-center gap-0.5"
                      >
                        <Plus className="size-3" /> Tambah
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Outbound */}
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Mengarah ke Artikel Lain
                        </div>
                        {outboundRelations.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground italic">Tidak ada relasi keluar.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {outboundRelations.map((r) => {
                              const target = articles.find((a) => a.id === r.toArticleId);
                              return (
                                <div
                                  key={r.id}
                                  className="p-2 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900 text-xs flex items-center justify-between"
                                >
                                  <div>
                                    <span className="text-[10px] font-bold text-purple-700 uppercase mr-1.5">
                                      [{r.type}]
                                    </span>
                                    <span className="font-medium text-foreground dark:text-foreground">
                                      {target?.title || "Artikel tidak ditemukan"}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => deleteRelation(r.id)}
                                    className="text-muted-foreground hover:text-rose-600"
                                  >
                                    <Trash2 className="size-3" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Inbound (Backlink otomatis) */}
                      <div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                          Dirujuk oleh (Backlinks)
                        </div>
                        {inboundRelations.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground italic">Belum ada artikel yang merujuk.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {inboundRelations.map((r) => {
                              const source = articles.find((a) => a.id === r.fromArticleId);
                              return (
                                <div
                                  key={r.id}
                                  onClick={() => setSelectedArticleId(r.fromArticleId)}
                                  className="p-2 rounded-lg bg-muted/40 dark:bg-card border border-border dark:border-border text-xs cursor-pointer hover:bg-muted"
                                >
                                  <span className="text-[10px] text-muted-foreground">Dirujuk sebagai </span>
                                  <span className="font-bold text-purple-600">[{r.type}]</span>
                                  <div className="font-semibold text-foreground dark:text-foreground mt-0.5">
                                    {source?.title}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Revisions (§7 Riwayat Versi) */}
                  <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-4 shadow-2xs">
                    <h3 className="text-xs font-bold text-foreground dark:text-foreground flex items-center gap-1.5 mb-2">
                      <History className="size-3.5 text-muted-foreground" />
                      Riwayat Revisi ({articleRevisions.length})
                    </h3>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {articleRevisions.map((rev) => (
                        <div
                          key={rev.id}
                          className="text-[11px] p-2 rounded-lg border border-border dark:border-border bg-muted/40/50 dark:bg-card/40"
                        >
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>{rev.editedBy}</span>
                            <span>{new Date(rev.editedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="font-medium text-foreground dark:text-foreground mt-0.5">
                            {rev.changeSummary || "Perubahan konten"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-xs">
              Pilih artikel dari daftar atau buat artikel baru.
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create/Edit Article */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-border dark:border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground dark:text-foreground">
                {editingArticleId ? "Edit Artikel" : "Buat Artikel Baru"}
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="text-muted-foreground hover:text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Artikel *</label>
                <input
                  type="text"
                  value={articleForm.title}
                  onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                  placeholder="Mis. Prinsip Dasar Nilai Terminal..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategori</label>
                  <select
                    value={articleForm.categoryId}
                    onChange={(e) => setArticleForm({ ...articleForm, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    <option value="">(Tanpa Kategori)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Status Validasi</label>
                  <select
                    value={articleForm.reviewStatus}
                    onChange={(e) =>
                      setArticleForm({
                        ...articleForm,
                        reviewStatus: e.target.value as ReviewStatus,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    <option value="draft">Draft (Dalam Penyusunan)</option>
                    <option value="reviewed">Reviewed (Telah Ditinjau)</option>
                    <option value="verified">Verified (Kredibilitas Kuat)</option>
                    <option value="outdated">Outdated (Perlu Pembaruan)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Ringkasan Singkat (Summary)</label>
                <textarea
                  rows={2}
                  value={articleForm.summary}
                  onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                  placeholder="Intisari satu paragraf untuk pratinjau..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Konten Lengkap (Markdown)</label>
                <textarea
                  rows={10}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                  placeholder="Isi artikel terstruktur..."
                  className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tags (pisahkan koma)</label>
                <input
                  type="text"
                  value={articleForm.tags}
                  onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                  placeholder="Valuasi, Pajak, Strategi"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>

            <div className="p-4 border-t border-border dark:border-border flex justify-end gap-2">
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-border dark:border-border text-xs font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleSaveArticle}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                Simpan Artikel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Source */}
      {isSourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
              <Link2 className="size-4 text-blue-500" />
              Tambah Sumber Kredibel
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Dokumen / Rujukan *</label>
                <input
                  type="text"
                  value={sourceForm.title}
                  onChange={(e) => setSourceForm({ ...sourceForm, title: e.target.value })}
                  placeholder="Mis. arXiv Paper / Official Specs..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Penulis / Institusi</label>
                  <input
                    type="text"
                    value={sourceForm.author}
                    onChange={(e) => setSourceForm({ ...sourceForm, author: e.target.value })}
                    placeholder="Nama penulis / lembaga"
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kredibilitas</label>
                  <select
                    value={sourceForm.reliability}
                    onChange={(e) =>
                      setSourceForm({
                        ...sourceForm,
                        reliability: e.target.value as SourceReliability,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                  >
                    <option value="high">High (Peer-reviewed/Resmi)</option>
                    <option value="medium">Medium (Artikel Teknis)</option>
                    <option value="low">Low (Klaim Subjektif)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">URL (Tautan Asli)</label>
                <input
                  type="url"
                  value={sourceForm.url}
                  onChange={(e) => setSourceForm({ ...sourceForm, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Kutipan Fakta Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  value={sourceForm.excerpt}
                  onChange={(e) => setSourceForm({ ...sourceForm, excerpt: e.target.value })}
                  placeholder="Kutipan penting yang mendasari klaim artikel..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsSourceModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleAddSource}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Tambahkan Sumber
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Relation */}
      {isRelationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
              <Share2 className="size-4 text-purple-500" />
              Hubungkan Relasi Bermakna
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Artikel Tujuan *</label>
                <select
                  value={relationForm.toArticleId}
                  onChange={(e) => setRelationForm({ ...relationForm, toArticleId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                >
                  <option value="">-- Pilih Artikel Terhubung --</option>
                  {articles
                    .filter((a) => a.id !== selectedArticleId)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.title}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Jenis Relasi (§6)</label>
                <select
                  value={relationForm.type}
                  onChange={(e) =>
                    setRelationForm({
                      ...relationForm,
                      type: e.target.value as RelationType,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                >
                  <option value="prerequisite">prerequisite (harus dipahami dulu)</option>
                  <option value="related">related (terkait secara umum)</option>
                  <option value="contradicts">contradicts (pandangan berlawanan)</option>
                  <option value="supersedes">supersedes (menggantikan versi lama)</option>
                  <option value="example_of">example_of (contoh konkret topik)</option>
                  <option value="part_of">part_of (bagian dari topik besar)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Catatan Alasan Relasi (Opsional)</label>
                <input
                  type="text"
                  value={relationForm.note}
                  onChange={(e) => setRelationForm({ ...relationForm, note: e.target.value })}
                  placeholder="Mis. Wajib membaca ini sebelum praktik hybrid search..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsRelationModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleAddRelation}
                className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold"
              >
                Simpan Relasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Category Management */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
              <FolderTree className="size-4 text-blue-500" />
              Kelola Kategori Hierarkis
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Mis. Keuangan Korporasi..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Kategori Induk (Parent)</label>
                <select
                  value={newCatParent}
                  onChange={(e) => setNewCatParent(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                >
                  <option value="">(Sebagai Kategori Utama)</option>
                  {categories
                    .filter((c) => !c.parentCategoryId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Deskripsi Topik</label>
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Fokus bahasan kategori..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleAddCategorySubmit}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Tambah Kategori
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Promote from Note (#12) */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-lg p-5 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-4 text-indigo-500" />
                  Promote dari Notes (#12)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Naikkan catatan cepat yang sudah matang menjadi Artikel terstruktur Knowledge Base.
                </p>
              </div>
              <button onClick={() => setIsPromoteModalOpen(false)}>
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 text-xs">
              {availableNotesToPromote.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  Belum ada catatan yang tersimpan di Notes (#12).
                </div>
              ) : (
                availableNotesToPromote.map((n: any) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl border border-border dark:border-border hover:border-indigo-300 flex items-center justify-between gap-3 bg-muted/40/50 dark:bg-card/40"
                  >
                    <div>
                      <h4 className="font-bold text-foreground dark:text-foreground">{n.title}</h4>
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                        {n.content || "(Catatan kosong)"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const created = promoteFromNote(n.id, n.title, n.content);
                        setSelectedArticleId(created.id);
                        setIsPromoteModalOpen(false);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shrink-0"
                    >
                      Promote
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Statistics (§12) */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-2">
                <BarChart3 className="size-4 text-blue-500" />
                Statistik & Metrik Knowledge Base (§12)
              </h3>
              <button onClick={() => setIsStatsModalOpen(false)}>
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-muted/40 dark:bg-card border border-border dark:border-border text-center">
                <div className="text-lg font-bold text-foreground dark:text-foreground">
                  {stats.total}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold">Total Artikel</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center">
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
                  {stats.verified}
                </div>
                <div className="text-[10px] text-emerald-600 uppercase font-semibold">Verified</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-center">
                <div className="text-lg font-bold text-amber-700 dark:text-amber-300">
                  {stats.outdated}
                </div>
                <div className="text-[10px] text-amber-600 uppercase font-semibold">Outdated Ratio</div>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Rata-rata Sumber per Artikel:</span>
                <span className="font-bold text-foreground dark:text-foreground">{stats.avgSources} Sumber</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Artikel Paling Banyak Dirujuk (Hub):</span>
                <span className="font-bold text-foreground dark:text-foreground text-right">
                  {stats.mostRefArticle?.title || "Belum ada relasi"} ({stats.maxRefs}x)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-muted-foreground">Interval Pengingat Kesegaran (Freshness):</span>
                <span className="font-bold text-foreground dark:text-foreground">
                  {data.reviewReminderIntervalDays} Hari (6 Bulan)
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-foreground dark:bg-muted text-background dark:text-foreground text-xs font-semibold"
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
