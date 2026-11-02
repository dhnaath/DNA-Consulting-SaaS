import { ShellHeader } from "@/app/shell-header";
import React, { useState, useMemo } from "react";
import {
  Target,
  CheckCircle2,
  Clock,
  Plus,
  TrendingUp,
  FolderTree,
  BarChart3,
  CheckSquare,
  Activity,
  Search,
  X,
  ChevronRight,
  MessageSquare,
  Layers,
  Trash2,
  Check,
} from "lucide-react";
import { useGoalStore } from "./store";
import {
  GoalStatus,
  GoalViewMode,
  ContributorSourceType,
  ProgressMetricType,
} from "./types";

export function GoalManagerApp() {
  const {
    goals,
    contributors,
    milestones,
    checkIns,
    selectedGoalId,
    createGoal,
    deleteGoal,
    setGoalStatus,
    addContributor,
    removeContributor,
    updateContributorProgress,
    addMilestone,
    toggleMilestone,
    addCheckIn,
    setSelectedGoalId,
    getGoalProgress,
  } = useGoalStore();

  const [activeTab, setActiveTab] = useState<GoalViewMode>("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("Bisnis");
  const [newTargetDate, setNewTargetDate] = useState("");
  const [newParentGoalId, setNewParentGoalId] = useState<string>("");
  const [newMetricType, setNewMetricType] = useState<ProgressMetricType>("task_completion");
  const [newTargetValue, setNewTargetValue] = useState<number>(100);
  const [newUnit, setNewUnit] = useState<string>("%");

  // CheckIn Modal state
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [checkInGoalId, setCheckInGoalId] = useState<string | null>(null);
  const [checkInNote, setCheckInNote] = useState("");
  const [checkInNumeric, setCheckInNumeric] = useState<string>("");

  // New Contributor inline state
  const [newConTitle, setNewConTitle] = useState("");
  const [newConType, setNewConType] = useState<ContributorSourceType>("task");
  const [newConWeight, setNewConWeight] = useState(0.5);

  // New Milestone inline state
  const [newMsTitle, setNewMsTitle] = useState("");
  const [newMsDate, setNewMsDate] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const categories = useMemo(() => {
    const set = new Set(goals.map((g) => g.category));
    return Array.from(set);
  }, [goals]);

  // Root goals (not sub-goals)
  const rootGoals = useMemo(() => {
    return goals.filter((g) => !g.parentGoalId);
  }, [goals]);

  // Filtered goals for board
  const filteredGoals = useMemo(() => {
    return goals.filter((g) => {
      if (categoryFilter !== "all" && g.category !== categoryFilter) return false;
      if (statusFilter !== "all" && g.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = g.title.toLowerCase().includes(q);
        const matchDesc = (g.description || "").toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }
      return true;
    });
  }, [goals, categoryFilter, statusFilter, searchQuery]);

  const activeGoal = useMemo(() => {
    if (!selectedGoalId) return null;
    return goals.find((g) => g.id === selectedGoalId) || null;
  }, [goals, selectedGoalId]);

  const activeContributors = useMemo(() => {
    if (!activeGoal) return [];
    return contributors.filter((c) => c.goalId === activeGoal.id);
  }, [contributors, activeGoal]);

  const activeMilestones = useMemo(() => {
    if (!activeGoal) return [];
    return milestones.filter((m) => m.goalId === activeGoal.id);
  }, [milestones, activeGoal]);



  // Statistics
  const stats = useMemo(() => {
    const total = goals.length;
    const achieved = goals.filter((g) => g.status === "achieved").length;
    const abandoned = goals.filter((g) => g.status === "abandoned").length;
    const active = goals.filter((g) => g.status === "active").length;
    const paused = goals.filter((g) => g.status === "paused").length;

    const finalCount = achieved + abandoned;
    const achievedRatio = finalCount > 0 ? Math.round((achieved / finalCount) * 100) : 100;

    const avgContributors = total > 0 ? (contributors.length / total).toFixed(1) : "0";

    const catCounts: Record<string, number> = {};
    goals.forEach((g) => {
      catCounts[g.category] = (catCounts[g.category] || 0) + 1;
    });

    return { total, achieved, abandoned, active, paused, achievedRatio, avgContributors, catCounts };
  }, [goals, contributors]);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createGoal({
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      targetDate: newTargetDate || undefined,
      status: "active",
      parentGoalId: newParentGoalId ? newParentGoalId : null,
      progressMetric: {
        goalId: "",
        type: newMetricType,
        config:
          newMetricType === "numeric_target"
            ? { startValue: 0, targetValue: newTargetValue, currentValue: 0, unit: newUnit }
            : {},
      },
    });

    showToast(`Goal "${newTitle}" berhasil dibuat!`);
    setIsNewGoalOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewTargetDate("");
    setNewParentGoalId("");
  };

  const handleExecuteCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInGoalId || !checkInNote.trim()) return;

    const numVal = checkInNumeric ? parseFloat(checkInNumeric) : undefined;
    addCheckIn(checkInGoalId, checkInNote.trim(), numVal);
    showToast("Check-in berkala berhasil dicatat!");
    setCheckInModalOpen(false);
    setCheckInNote("");
    setCheckInNumeric("");
  };

  const handleAddContributor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoal || !newConTitle.trim()) return;

    addContributor({
      goalId: activeGoal.id,
      title: newConTitle.trim(),
      sourceType: newConType,
      sourceId: `src-${Date.now()}`,
      weight: Number(newConWeight),
      currentProgress: 0,
    });

    setNewConTitle("");
    showToast("Contributor berhasil ditautkan!");
  };

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoal || !newMsTitle.trim()) return;

    addMilestone({
      goalId: activeGoal.id,
      title: newMsTitle.trim(),
      targetDate: newMsDate || new Date().toISOString().split("T")[0],
      status: "upcoming",
    });

    setNewMsTitle("");
    setNewMsDate("");
    showToast("Milestone berhasil ditambahkan ke Goal!");
  };

  const getStatusBadge = (status: GoalStatus) => {
    switch (status) {
      case "active":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Active</span>;
      case "achieved":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">Achieved</span>;
      case "paused":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">Paused</span>;
      case "abandoned":
        return <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-muted-foreground/30/20 text-muted-foreground border border-border">Abandoned</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Actions in Floating Pill */}
      <ShellHeader>
        <div className="flex items-center gap-1 shrink-0">
          {/* Tab Switchers (Icon-Only) */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            <button
              onClick={() => setActiveTab("board")}
              title={`Goal Board (${goals.length})`}
              aria-label="Goal Board"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "board"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("tree")}
              title="Hierarki & Sub-Goals"
              aria-label="Hierarki"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "tree"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-teal-400" />
            </button>
            <button
              onClick={() => setActiveTab("progress_trend")}
              title={`Riwayat Check-In & Tren (${checkIns.length})`}
              aria-label="Riwayat Check-In"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "progress_trend"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              title="Statistik Capaian"
              aria-label="Statistik"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "stats"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </div>

          <button
            onClick={() => setIsNewGoalOpen(true)}
            title="Rumuskan Goal Baru"
            aria-label="Rumuskan Goal"
            className="p-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Page Header Banner */}
      <div className="px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-emerald-600 to-teal-600 rounded-xl shadow-lg shadow-teal-500/20 shrink-0">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Goal Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                  App #31
                </span>
                <span className="text-xs text-muted-foreground">
                  Puncak Hierarki Motivasi • Agregasi Task, Habit, Project & Metrik
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Menjawab "untuk apa semua itu dilakukan" dengan agregasi progres deterministik dan tinjauan berkala.
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Main View Area */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Goals</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.active} sedang aktif</div>
              </div>

              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Rasio Tercapai</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.achievedRatio}%</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.achieved} berhasil dari total final</div>
              </div>

              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Rata-Rata Contributor</div>
                <div className="text-3xl font-extrabold text-teal-400 mt-1">{stats.avgContributors}</div>
                <div className="text-xs text-muted-foreground mt-1">Per Goal (Task, Habit, Project)</div>
              </div>

              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Check-In</div>
                <div className="text-3xl font-extrabold text-sky-400 mt-1">{checkIns.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Evaluasi berkala tercatat</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-card/60 border border-border rounded-xl">
                <h4 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
                  <Target className="w-4 h-4 text-emerald-400" />
                  Distribusi Kategori
                </h4>
                <div className="space-y-2">
                  {Object.entries(stats.catCounts).map(([cat, count]) => (
                    <div key={cat} className="flex items-center justify-between text-xs py-1 border-b border-border/40">
                      <span className="text-foreground">{cat}</span>
                      <span className="px-2 py-0.5 bg-card rounded text-foreground font-semibold">{count} Goals</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-card/60 border border-border rounded-xl">
                <h4 className="font-semibold text-foreground mb-3 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Status Siklus Hidup
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-emerald-400">Aktif Berjalan</span>
                    <span className="font-bold text-white">{stats.active}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-sky-400">Tercapai (Achieved)</span>
                    <span className="font-bold text-white">{stats.achieved}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-amber-400">Ditunda (Paused)</span>
                    <span className="font-bold text-white">{stats.paused}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Dibatalkan (Abandoned)</span>
                    <span className="font-bold text-white">{stats.abandoned}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HIERARCHICAL SUB-GOALS VIEW */}
        {activeTab === "tree" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Menampilkan hierarki payung Goal besar dan dekomposisi Sub-goal pendukung.
            </div>

            <div className="space-y-3">
              {rootGoals.map((parent) => {
                const subgoals = goals.filter((g) => g.parentGoalId === parent.id);
                const prog = getGoalProgress(parent.id);

                return (
                  <div key={parent.id} className="p-5 bg-card/80 border border-border rounded-xl space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                            {parent.category}
                          </span>
                          <span className="text-xs text-muted-foreground">{getStatusBadge(parent.status)}</span>
                        </div>
                        <h3
                          onClick={() => setSelectedGoalId(parent.id)}
                          className="text-base font-bold text-foreground hover:text-emerald-400 cursor-pointer mt-1"
                        >
                          {parent.title}
                        </h3>
                        {parent.description && (
                          <p className="text-xs text-muted-foreground mt-1">{parent.description}</p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xl font-extrabold text-emerald-400">{prog}%</span>
                        <div className="w-24 bg-card h-2 rounded-full overflow-hidden mt-1">
                          <div
                            className="bg-emerald-500 h-full transition-all duration-300"
                            style={{ width: `${prog}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sub-goals tree branches */}
                    {subgoals.length > 0 && (
                      <div className="pl-4 border-l-2 border-border space-y-2.5 mt-3">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Sub-Goals ({subgoals.length}):
                        </div>
                        {subgoals.map((sub) => {
                          const subProg = getGoalProgress(sub.id);
                          return (
                            <div
                              key={sub.id}
                              onClick={() => setSelectedGoalId(sub.id)}
                              className="p-3 bg-background/80 border border-border/80 hover:border-border rounded-lg flex items-center justify-between cursor-pointer transition text-xs"
                            >
                              <div className="flex items-center gap-2">
                                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="font-semibold text-foreground">{sub.title}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-muted-foreground">{getStatusBadge(sub.status)}</span>
                                <span className="font-bold text-teal-400">{subProg}%</span>
                              </div>
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
        )}

        {/* PROGRESS TREND & CHECKINS */}
        {activeTab === "progress_trend" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/60 border border-border rounded-xl flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Log Tinjauan Berkala (Check-In)</h3>
                <p className="text-xs text-muted-foreground">
                  Riwayat evaluasi manual, progress snapshot, dan refleksi berkala terhadap tujuan.
                </p>
              </div>
            </div>

            {checkIns.length === 0 ? (
              <div className="p-12 text-center bg-card/40 border border-border/60 rounded-xl">
                <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Belum ada catatan check-in.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {checkIns.map((ci) => {
                  const g = goals.find((x) => x.id === ci.goalId);
                  return (
                    <div key={ci.id} className="p-4 bg-card/80 border border-border rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-foreground">{g?.title || "Goal Terkait"}</span>
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-400">
                            {ci.progressSnapshot}% Progress
                          </span>
                        </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(ci.checkedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed bg-background/60 p-2.5 rounded-lg border border-border">
                        "{ci.note}"
                      </p>
                      {ci.numericValue !== undefined && (
                        <div className="text-[11px] text-teal-400">
                          Nilai metrik tercatat: <strong>{ci.numericValue}</strong>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* GOAL BOARD VIEW */}
        {activeTab === "board" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari Goal, motivasi, target..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Active</option>
                  <option value="achieved">Achieved</option>
                  <option value="paused">Paused</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>
            </div>

            {/* Grid of Goals */}
            {filteredGoals.length === 0 ? (
              <div className="p-12 text-center bg-card/40 border border-border/60 rounded-xl">
                <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground">Tidak ada Goal ditemukan</h3>
                <p className="text-xs text-muted-foreground mt-1">Coba sesuaikan filter atau tambahkan Goal baru.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGoals.map((g) => {
                  const prog = getGoalProgress(g.id);
                  const goalCons = contributors.filter((c) => c.goalId === g.id);
                  const goalMils = milestones.filter((m) => m.goalId === g.id);

                  return (
                    <div
                      key={g.id}
                      className="p-5 bg-card/80 border border-border hover:border-border rounded-xl flex flex-col justify-between transition space-y-4"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 text-[11px] rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-semibold">
                            {g.category}
                          </span>
                          {getStatusBadge(g.status)}
                        </div>

                        <div>
                          <h3
                            onClick={() => setSelectedGoalId(g.id)}
                            className="font-bold text-base text-foreground cursor-pointer hover:text-emerald-400 transition"
                          >
                            {g.title}
                          </h3>
                          {g.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                              {g.description}
                            </p>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Kemajuan</span>
                            <span className="font-extrabold text-emerald-400">{prog}%</span>
                          </div>
                          <div className="w-full bg-card h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-500 h-full transition-all duration-300"
                              style={{ width: `${prog}%` }}
                            />
                          </div>
                        </div>

                        {/* Meta counts */}
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
                          <span>{goalCons.length} Kontributor</span>
                          <span>•</span>
                          <span>{goalMils.length} Milestone</span>
                          {g.targetDate && (
                            <>
                              <span>•</span>
                              <span>Target: {new Date(g.targetDate).toLocaleDateString()}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <button
                          onClick={() => {
                            setCheckInGoalId(g.id);
                            setCheckInModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-card hover:bg-muted-foreground/30 text-foreground rounded-lg font-medium flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-teal-400" />
                          Check-In
                        </button>

                        <button
                          onClick={() => setSelectedGoalId(g.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                        >
                          Detail & Kontribusi
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: DETAIL GOAL & CONTRIBUTORS */}
      {selectedGoalId && activeGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    {activeGoal.category}
                  </span>
                  {getStatusBadge(activeGoal.status)}
                </div>
                <h3 className="font-bold text-lg text-white mt-1">{activeGoal.title}</h3>
              </div>
              <button onClick={() => setSelectedGoalId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Progress Summary Card */}
              <div className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Total Progres Terhitung</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {getGoalProgress(activeGoal.id)}%
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Metrik: {activeGoal.progressMetric?.type.replace("_", " ")}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setGoalStatus(activeGoal.id, "achieved");
                      showToast("Goal ditandai SELESAI / Achieved!");
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                  >
                    Tandai Achieved
                  </button>
                  <button
                    onClick={() => {
                      setGoalStatus(activeGoal.id, activeGoal.status === "paused" ? "active" : "paused");
                      showToast(`Status diubah ke ${activeGoal.status === "paused" ? "Active" : "Paused"}`);
                    }}
                    className="px-3 py-1.5 bg-card hover:bg-muted-foreground/30 text-foreground rounded-lg text-xs font-semibold"
                  >
                    {activeGoal.status === "paused" ? "Resume" : "Pause"}
                  </button>
                </div>
              </div>

              {/* CONTRIBUTORS SECTION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    Kontributor Entitas (Task, Project, Habit, Metric)
                  </h4>
                </div>

                {activeContributors.length === 0 ? (
                  <div className="p-3 bg-card/40 border border-border/60 rounded text-xs text-muted-foreground italic">
                    Belum ada kontributor ditautkan. Tambahkan task, habit, atau metrik di bawah.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeContributors.map((c) => (
                      <div
                        key={c.id}
                        className="p-3 bg-card/60 border border-border rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded bg-card text-[10px] uppercase font-mono">
                              {c.sourceType}
                            </span>
                            {c.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Bobot: {c.weight * 100}% • Progress saat ini: {c.currentProgress}%
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={c.currentProgress}
                            onChange={(e) => updateContributorProgress(c.id, Number(e.target.value))}
                            className="w-24 accent-emerald-500"
                          />
                          <button
                            onClick={() => removeContributor(c.id)}
                            className="text-muted-foreground hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Contributor Form */}
                <form onSubmit={handleAddContributor} className="p-3 bg-background border border-border rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-foreground">Tautkan Kontributor Baru:</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Nama task / habit / metrik"
                      value={newConTitle}
                      onChange={(e) => setNewConTitle(e.target.value)}
                      className="md:col-span-2 px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-emerald-500"
                    />
                    <select
                      value={newConType}
                      onChange={(e) => setNewConType(e.target.value as any)}
                      className="px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-emerald-500"
                    >
                      <option value="task">Task (#01)</option>
                      <option value="project">Project (#03)</option>
                      <option value="habit">Habit (#06)</option>
                      <option value="manual_metric">Manual Metric</option>
                    </select>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
                    >
                      + Tambah
                    </button>
                  </div>
                </form>
              </div>

              {/* MILESTONES (GOAL CONTEXT) */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-sky-400" />
                  Checkpoint & Milestone
                </h4>

                <div className="space-y-1.5">
                  {activeMilestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMilestone(m.id)}
                      className="p-2.5 bg-card/60 border border-border rounded flex items-center justify-between cursor-pointer hover:border-border text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`size-4 rounded flex items-center justify-center border ${
                            m.status === "achieved"
                              ? "bg-emerald-500 border-emerald-400 text-foreground"
                              : "border-border"
                          }`}
                        >
                          {m.status === "achieved" && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className={m.status === "achieved" ? "line-through text-muted-foreground" : "text-foreground font-medium"}>
                          {m.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">{m.targetDate}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddMilestone} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Milestone baru..."
                    value={newMsTitle}
                    onChange={(e) => setNewMsTitle(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="date"
                    value={newMsDate}
                    onChange={(e) => setNewMsDate(e.target.value)}
                    className="px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold shrink-0"
                  >
                    + Tambah
                  </button>
                </form>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <button
                onClick={() => {
                  deleteGoal(activeGoal.id);
                  showToast("Goal dihapus.");
                  setSelectedGoalId(null);
                }}
                className="px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Goal
              </button>

              <button
                onClick={() => setSelectedGoalId(null)}
                className="px-4 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHECK-IN */}
      {checkInModalOpen && checkInGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Catat Check-In & Evaluasi</h3>
              <button onClick={() => setCheckInModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteCheckIn} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Refleksi / Catatan Perkembangan <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Apa yang telah dicapai? Adakah hambatan?"
                  value={checkInNote}
                  onChange={(e) => setCheckInNote(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nilai Metrik Terkini (Opsional)
                </label>
                <input
                  type="number"
                  placeholder="mis. 72 (kg) atau 18 (klien)"
                  value={checkInNumeric}
                  onChange={(e) => setCheckInNumeric(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setCheckInModalOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE GOAL */}
      {isNewGoalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Rumuskan Goal Baru</h3>
              <button onClick={() => setIsNewGoalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Goal / Tujuan Besar <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Turun 5kg dalam 3 bulan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Konteks & Motivasi</label>
                <textarea
                  rows={2}
                  placeholder="Mengapa tujuan ini penting untuk dicapai?"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Kategori</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="mis. Bisnis, Kesehatan, Finansial"
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Target Tanggal</label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Parent Goal (Opsional jika Sub-Goal)</label>
                <select
                  value={newParentGoalId}
                  onChange={(e) => setNewParentGoalId(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                >
                  <option value="">Tidak ada (Goal Mandiri)</option>
                  {rootGoals.map((rg) => (
                    <option key={rg.id} value={rg.id}>
                      {rg.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Metrik Kemajuan Utama</label>
                <select
                  value={newMetricType}
                  onChange={(e) => setNewMetricType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-emerald-500"
                >
                  <option value="task_completion">Task Completion (% selesai)</option>
                  <option value="habit_consistency">Habit Consistency (tingkat kepatuhan)</option>
                  <option value="numeric_target">Numeric Target (angka & satuan)</option>
                  <option value="milestone_based">Milestone Based (jumlah checkpoint)</option>
                </select>
              </div>

              {newMetricType === "numeric_target" && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-background border border-border rounded-lg">
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Target Angka</label>
                    <input
                      type="number"
                      value={newTargetValue}
                      onChange={(e) => setNewTargetValue(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Satuan</label>
                    <input
                      type="text"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="mis. kg, klien, juta"
                      className="w-full px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewGoalOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
