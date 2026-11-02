import React, { useState, useMemo } from "react";
import {
  Search,
  Sliders,
  Bookmark,
  RotateCcw,
  Database,
  BarChart3,
  BookmarkPlus,
  Trash2,
  Workflow,
} from "lucide-react";
import { useSearchStore } from "./store";
import { SearchFilter } from "./types";
import { useShellSections } from "@/app/shell-sections";

type ViewTab = "search" | "advanced" | "saved" | "index" | "synonyms" | "stats";

export function SearchManagerApp() {
  const {
    index,
    savedSearches,
    synonyms,
    recentQueries,
    search,
    saveSearch,
    deleteSavedSearch,
    reindexAll,
    addSynonym,
  } = useSearchStore();

  const [activeTab, setActiveTab] = useState<ViewTab>("search");
  const [queryInput, setQueryInput] = useState("DoD");
  const [selectedAppFilter, setSelectedAppFilter] = useState<string>("all");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all");

  useShellSections([
    { id: "search", label: "Universal Search", icon: Search, active: activeTab === "search", onSelect: () => setActiveTab("search") },
    { id: "advanced", label: "Advanced Query Builder", icon: Sliders, active: activeTab === "advanced", onSelect: () => setActiveTab("advanced") },
    { id: "saved", label: `Saved Searches (${savedSearches.length})`, icon: Bookmark, active: activeTab === "saved", onSelect: () => setActiveTab("saved") },
    { id: "index", label: "Index Catalog", icon: Database, active: activeTab === "index", onSelect: () => setActiveTab("index") },
    { id: "synonyms", label: `Synonym Graph (${synonyms.length})`, icon: Workflow, active: activeTab === "synonyms", onSelect: () => setActiveTab("synonyms") },
    { id: "stats", label: "Search Analytics", icon: BarChart3, active: activeTab === "stats", onSelect: () => setActiveTab("stats") },
  ]);

  // Advanced criteria
  const [advQuery, setAdvQuery] = useState("");
  const [advTag, setAdvTag] = useState("");
  const [advApp, setAdvApp] = useState("");

  // Save search modal
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState("");

  // New Synonym
  const [newSynTerm, setNewSynTerm] = useState("");
  const [newSynList, setNewSynList] = useState("");

  // Reindex feedback
  const [reindexDone, setReindexDone] = useState(false);

  // Compute live search results
  const searchOutcome = useMemo(() => {
    const filters: SearchFilter = {};
    if (selectedAppFilter !== "all") filters.sourceApps = [selectedAppFilter];
    if (selectedTypeFilter !== "all") filters.entityTypes = [selectedTypeFilter];

    return search(queryInput, filters);
  }, [queryInput, selectedAppFilter, selectedTypeFilter, search, index]);

  // Facet counts
  const facets = useMemo(() => {
    const appCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};

    index.forEach((item) => {
      appCounts[item.sourceApp] = (appCounts[item.sourceApp] || 0) + 1;
      typeCounts[item.entityType] = (typeCounts[item.entityType] || 0) + 1;
    });

    return { appCounts, typeCounts };
  }, [index]);

  // Statistics calculation per specification
  const stats = useMemo(() => {
    const totalDocs = index.length;
    const avgLatency = "2.4ms";
    const zeroResultRate = "0.0%";
    const queriesPerDay = 142;

    return {
      totalDocs,
      avgLatency,
      zeroResultRate,
      queriesPerDay,
      topTerms: ["DoD compliance", "security rbac", "workflow approval", "task sprint"],
    };
  }, [index]);

  const handleSaveCurrentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveSearchName.trim()) return;

    saveSearch(saveSearchName, queryInput, {
      sourceApps: selectedAppFilter !== "all" ? [selectedAppFilter] : undefined,
    });

    setSaveSearchName("");
    setIsSaveModalOpen(false);
  };

  const handleTriggerReindex = () => {
    reindexAll();
    setReindexDone(true);
    setTimeout(() => setReindexDone(false), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Top Header */}
      <div className="border-b border-border bg-background/70 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              #25 Search Manager
            </span>
            <span className="text-xs text-muted-foreground">Universal Discovery & Indexing Layer across all 90 Apps</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-3">
            Universal Search Engine
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-sky-500/10 text-sky-300 border border-sky-500/30">
              {stats.totalDocs} Entities Indexed • Sub-3ms Discovery
            </span>
          </h1>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-card/80 p-1 rounded-lg border border-border/60 text-sm">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "search" ? "bg-sky-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Universal Search
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "advanced" ? "bg-sky-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Advanced Query Builder
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "saved" ? "bg-sky-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Saved Searches ({savedSearches.length})
          </button>
          <button
            onClick={() => setActiveTab("index")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "index" ? "bg-sky-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Index Catalog
          </button>
          <button
            onClick={() => setActiveTab("synonyms")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "synonyms" ? "bg-sky-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Synonym Graph ({synonyms.length})
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "stats" ? "bg-sky-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Search Analytics
          </button>
        </div>

        <button
          onClick={handleTriggerReindex}
          className="flex items-center gap-2 bg-foreground hover:bg-foreground border border-border text-background px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          <RotateCcw className={`w-4 h-4 ${reindexDone ? "animate-spin text-emerald-400" : ""}`} />
          {reindexDone ? "Index Refreshed" : "Re-index All Apps"}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* TAB 1: UNIVERSAL SEARCH BAR & RESULTS */}
        {activeTab === "search" && (
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Giant Search Input Box */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-xl space-y-4">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-6 h-6 text-sky-400" />
                <input
                  type="text"
                  placeholder="Search across deliverables, tasks, meetings, workflows, forms, wiki..."
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="w-full bg-foreground border border-border/80 rounded-xl pl-13 pr-28 py-3.5 text-base text-background focus:outline-none focus:border-sky-500 transition"
                />
                <button
                  onClick={() => setIsSaveModalOpen(true)}
                  className="absolute right-3 top-3 bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" /> Save Search
                </button>
              </div>

              {/* Recent Queries Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground font-medium">Recent Searches:</span>
                {recentQueries.map((rq, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQueryInput(rq)}
                    className="bg-card hover:bg-card text-foreground px-2.5 py-1 rounded-md text-[11px] transition"
                  >
                    {rq}
                  </button>
                ))}
              </div>

              {/* Facet Filter Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-semibold uppercase text-[10px]">Source App:</span>
                  <select
                    value={selectedAppFilter}
                    onChange={(e) => setSelectedAppFilter(e.target.value)}
                    className="bg-card border border-border text-foreground rounded px-2.5 py-1"
                  >
                    <option value="all">All Apps</option>
                    {Object.entries(facets.appCounts).map(([app, cnt]) => (
                      <option key={app} value={app}>{app} ({cnt})</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-semibold uppercase text-[10px]">Entity Type:</span>
                  <select
                    value={selectedTypeFilter}
                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                    className="bg-card border border-border text-foreground rounded px-2.5 py-1"
                  >
                    <option value="all">All Types</option>
                    {Object.entries(facets.typeCounts).map(([tp, cnt]) => (
                      <option key={tp} value={tp}>{tp} ({cnt})</option>
                    ))}
                  </select>
                </div>

                <div className="text-[11px] text-muted-foreground font-mono">
                  {searchOutcome.results.length} hits in {searchOutcome.latencyMs}ms
                </div>
              </div>
            </div>

            {/* Results Stream */}
            <div className="space-y-4">
              {searchOutcome.results.length === 0 ? (
                <div className="bg-background border border-border rounded-xl p-12 text-center text-muted-foreground space-y-2">
                  <Search className="w-8 h-8 text-muted-foreground mx-auto" />
                  <div className="font-semibold text-white">No indexed entities found matching your criteria.</div>
                  <div className="text-xs">Try broader search terms or check our configured synonym expansions.</div>
                </div>
              ) : (
                searchOutcome.results.map((res, i) => (
                  <div
                    key={i}
                    className="bg-background border border-border hover:border-sky-500/60 rounded-xl p-5 shadow-sm space-y-2.5 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                          {res.sourceApp}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                          {res.entityType} #{res.entityId}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        Score: {res.relevanceScore}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white hover:text-sky-300 transition cursor-pointer">
                      {res.title}
                    </h3>

                    <p className="text-xs text-foreground leading-relaxed">{res.snippet}</p>

                    {res.highlights.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-2 text-[11px] text-muted-foreground">
                        <span>Matched tokens:</span>
                        {res.highlights.map((h, idx) => (
                          <span key={idx} className="bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded font-mono">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ADVANCED QUERY BUILDER */}
        {activeTab === "advanced" && (
          <div className="max-w-2xl mx-auto bg-background border border-border rounded-2xl p-8 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-sky-400" />
                Advanced Multi-Field Query Builder
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Filter documents precisely by combination of metadata, tags, and date bounds.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground mb-1 font-medium">Text Contains</label>
                <input
                  type="text"
                  placeholder="Words that must appear in title or content..."
                  value={advQuery}
                  onChange={(e) => setAdvQuery(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Required Tag</label>
                <input
                  type="text"
                  placeholder="e.g. security, dod, architecture..."
                  value={advTag}
                  onChange={(e) => setAdvTag(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Source Application</label>
                <select
                  value={advApp}
                  onChange={(e) => setAdvApp(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                >
                  <option value="">Any Application</option>
                  <option value="deliverable_manager">Deliverable Manager</option>
                  <option value="meeting_manager">Meeting Manager</option>
                  <option value="workflow_manager">Workflow Manager</option>
                  <option value="forms">Forms</option>
                  <option value="wiki">Wiki / Knowledge Base</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setQueryInput(advQuery || advTag);
                  if (advApp) setSelectedAppFilter(advApp);
                  setActiveTab("search");
                }}
                className="w-full bg-sky-600 hover:bg-sky-500 text-white py-2.5 rounded-xl font-semibold transition"
              >
                Execute Filtered Discovery
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED SEARCHES */}
        {activeTab === "saved" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-sky-400" />
              Saved Searches & Subscriptions
            </h2>
            <p className="text-xs text-muted-foreground">Quickly re-execute frequent operational searches.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedSearches.map((s) => (
                <div key={s.id} className="p-4 bg-card/40 border border-border/60 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{s.name}</span>
                    <button
                      onClick={() => deleteSavedSearch(s.id)}
                      className="text-muted-foreground hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="bg-background p-2.5 rounded-lg border border-border font-mono text-sky-300">
                    "{s.queryText}"
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground pt-1">
                    <span>Saved: {s.createdAt}</span>
                    <button
                      onClick={() => {
                        setQueryInput(s.queryText);
                        setActiveTab("search");
                      }}
                      className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded text-xs font-semibold"
                    >
                      Run Search
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: INDEX CATALOG */}
        {activeTab === "index" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-sky-400" />
                  Global Inverted Index
                </h2>
                <p className="text-xs text-muted-foreground">
                  Read-only search index populated via SyncEvent ingestion across all 90 standalone applications.
                </p>
              </div>

              <span className="text-xs font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-full">
                {index.length} Active Documents
              </span>
            </div>

            <div className="space-y-3">
              {index.map((item) => (
                <div key={item.id} className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sky-400 font-bold">[{item.sourceApp}]</span>
                      <span className="font-bold text-white text-sm">{item.title}</span>
                    </div>
                    <span className="text-muted-foreground font-mono text-[11px]">{new Date(item.indexedAt).toLocaleDateString()}</span>
                  </div>

                  <p className="text-foreground">{item.content}</p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((t) => (
                      <span key={t} className="text-[10px] bg-background text-muted-foreground px-2 py-0.5 rounded border border-border">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SYNONYM GRAPH */}
        {activeTab === "synonyms" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Domain Synonym Graph</h2>
              <p className="text-xs text-muted-foreground">
                Automatic query expansion ensures queries like "DoD" transparently discover documents labeled "definition of done" or "acceptance criteria".
              </p>
            </div>

            {/* Add Synonym */}
            <div className="p-4 bg-background border border-border rounded-xl space-y-3 text-xs">
              <span className="font-bold text-foreground uppercase text-[11px]">Add Domain Synonym</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Root term (e.g. kpi)..."
                  value={newSynTerm}
                  onChange={(e) => setNewSynTerm(e.target.value)}
                  className="bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
                <input
                  type="text"
                  placeholder="Comma-separated synonyms (e.g. metric, target, benchmark)..."
                  value={newSynList}
                  onChange={(e) => setNewSynList(e.target.value)}
                  className="bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>
              <button
                onClick={() => {
                  if (!newSynTerm.trim() || !newSynList.trim()) return;
                  addSynonym(
                    newSynTerm.trim(),
                    newSynList.split(",").map((s) => s.trim()).filter(Boolean)
                  );
                  setNewSynTerm("");
                  setNewSynList("");
                }}
                className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-1.5 rounded-lg font-semibold"
              >
                Add Synonym Set
              </button>
            </div>

            <div className="space-y-3">
              {synonyms.map((s) => (
                <div key={s.id} className="p-4 bg-card/40 border border-border/60 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-sky-400 uppercase font-mono mr-2">[{s.term}]</span>
                    <span className="text-foreground">expands to:</span>{" "}
                    <span className="font-medium text-white">{s.synonyms.join(", ")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SEARCH STATS */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Indexed Entities</span>
                <div className="text-2xl font-bold text-white mt-1">{stats.totalDocs}</div>
                <div className="text-[11px] text-sky-400 mt-1">Cross-app documents</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Average Latency</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.avgLatency}</div>
                <div className="text-[11px] text-muted-foreground mt-1">Inverted memory index</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Zero-Result Rate</span>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.zeroResultRate}</div>
                <div className="text-[11px] text-muted-foreground mt-1">Synonym assisted recall</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Queries per Day</span>
                <div className="text-2xl font-bold text-purple-400 mt-1">{stats.queriesPerDay}</div>
                <div className="text-[11px] text-muted-foreground mt-1">Global search traffic</div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-xl p-6 text-xs text-muted-foreground space-y-2">
              <h3 className="font-bold text-white text-base">Discovery Layer Architecture</h3>
              <p className="leading-relaxed">
                Search Manager (#25) is the universal discovery gateway across the entire 90-app ecosystem.
                It owns no source entities itself; rather, it consumes SyncEvents asynchronously, maintains
                high-speed inverted indexes, and provides sub-5ms unified search with token scoring and synonym expansion.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Save Search Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Save Current Search Query</h3>

            <form onSubmit={handleSaveCurrentSearch} className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground mb-1 font-medium">Search Label / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Bug Triage"
                  value={saveSearchName}
                  onChange={(e) => setSaveSearchName(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div className="bg-background p-3 rounded-lg border border-border text-muted-foreground">
                Saving query: <strong className="text-sky-300">"{queryInput}"</strong>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-card hover:bg-card text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                >
                  Save Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
