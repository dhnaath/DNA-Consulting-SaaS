import { ShellHeader } from "@/app/shell-header";
import React, { useState, useMemo } from "react";
import {
  Flag,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Calendar,
  Users,
  Search,
  Plus,
  MessageSquare,
  Layers,
  X,
  Trash2,
  CheckSquare,
  FolderKanban,
  Target,
  PackageCheck,
  ChevronRight,
  BarChart3,
  CalendarDays,
} from "lucide-react";
import { useMilestoneStore } from "./store";
import {
  PrerequisiteSourceType,
  MilestoneStatus,
  MilestoneViewMode,
  StakeholderRole,
} from "./types";

export function MilestoneManagerApp() {
  const {
    milestones,
    prerequisites,
    stakeholders,
    updates,
    selectedMilestoneId,
    createMilestone,
    deleteMilestone,
    setMilestoneStatus,
    addPrerequisite,
    removePrerequisite,
    updatePrerequisiteStatus,
    togglePrerequisiteCritical,
    addMilestoneUpdate,
    setSelectedMilestoneId,
    calculateReadiness,
  } = useMilestoneStore();

  const [activeTab, setActiveTab] = useState<MilestoneViewMode>("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [isNewMilestoneOpen, setIsNewMilestoneOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newTargetDate, setNewTargetDate] = useState("");
  const [newOwner, setNewOwner] = useState("");

  // Inline prerequisite form
  const [newPreTitle, setNewPreTitle] = useState("");
  const [newPreSource, setNewPreSource] = useState<PrerequisiteSourceType>("project");
  const [newPreCritical, setNewPreCritical] = useState(true);

  // Inline stakeholder form
  const [newShName, setNewShName] = useState("");
  const [newShRole, setNewShRole] = useState<StakeholderRole>("executive_sponsor");
  const [newShDept, setNewShDept] = useState("");

  // Inline narrative update
  const [newNarrative, setNewNarrative] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const activeMilestone = useMemo(() => {
    if (!selectedMilestoneId) return null;
    return milestones.find((m) => m.id === selectedMilestoneId) || null;
  }, [milestones, selectedMilestoneId]);

  const activePrereqs = useMemo(() => {
    if (!activeMilestone) return [];
    return prerequisites.filter((p) => p.strategicMilestoneId === activeMilestone.id);
  }, [prerequisites, activeMilestone]);


  const activeUpdates = useMemo(() => {
    if (!activeMilestone) return [];
    return updates.filter((u) => u.strategicMilestoneId === activeMilestone.id);
  }, [updates, activeMilestone]);

  const activeReadiness = useMemo(() => {
    if (!activeMilestone) return null;
    return calculateReadiness(activeMilestone.id);
  }, [activeMilestone, prerequisites, calculateReadiness]);

  // Filtered milestones
  const filteredMilestones = useMemo(() => {
    return milestones.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = m.title.toLowerCase().includes(q);
        const matchDesc = (m.description || "").toLowerCase().includes(q);
        const matchOwner = m.ownerName.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchOwner) return false;
      }
      return true;
    });
  }, [milestones, statusFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = milestones.length;
    const onTrack = milestones.filter((m) => m.status === "on_track").length;
    const atRisk = milestones.filter((m) => m.status === "at_risk").length;
    const delayed = milestones.filter((m) => m.status === "delayed").length;
    const achieved = milestones.filter((m) => m.status === "achieved").length;

    const activeCount = onTrack + atRisk + delayed;
    const onTrackRatio = activeCount > 0 ? Math.round((onTrack / activeCount) * 100) : 100;
    const avgPrereqs = total > 0 ? (prerequisites.length / total).toFixed(1) : "0";

    const blockerCount = prerequisites.filter(
      (p) => p.isCritical && (p.currentStatus === "delayed" || p.currentStatus === "needs_revision" || p.currentStatus === "at_risk")
    ).length;

    return { total, onTrack, atRisk, delayed, achieved, onTrackRatio, avgPrereqs, blockerCount };
  }, [milestones, prerequisites]);

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTargetDate) return;

    createMilestone({
      title: newTitle.trim(),
      description: newDesc.trim(),
      targetDate: newTargetDate,
      status: "on_track",
      ownerName: newOwner.trim() || "Koordinator Utama",
    });

    showToast(`Strategic Milestone "${newTitle}" berhasil dirumuskan!`);
    setIsNewMilestoneOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewTargetDate("");
    setNewOwner("");
  };

  const handleAddPrerequisite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMilestone || !newPreTitle.trim()) return;

    addPrerequisite({
      strategicMilestoneId: activeMilestone.id,
      title: newPreTitle.trim(),
      sourceType: newPreSource,
      sourceId: `src-${Date.now()}`,
      isCritical: newPreCritical,
      currentStatus: "on_track",
    });

    setNewPreTitle("");
    showToast("Prasyarat berhasil ditambahkan ke Milestone!");
  };


  const handleAddNarrative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMilestone || !newNarrative.trim()) return;

    addMilestoneUpdate(activeMilestone.id, newNarrative.trim());
    setNewNarrative("");
    showToast("Catatan naratif mingguan tersimpan!");
  };

  const getSourceIcon = (src: PrerequisiteSourceType) => {
    switch (src) {
      case "project":
        return <FolderKanban className="w-3.5 h-3.5 text-amber-400" />;
      case "goal":
        return <Target className="w-3.5 h-3.5 text-emerald-400" />;
      case "task":
        return <CheckSquare className="w-3.5 h-3.5 text-sky-400" />;
      case "deliverable":
        return <PackageCheck className="w-3.5 h-3.5 text-purple-400" />;
    }
  };

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case "on_track":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">On Track</span>;
      case "at_risk":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">At Risk</span>;
      case "delayed":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">Delayed</span>;
      case "achieved":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30">Achieved</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted-foreground/30/20 text-muted-foreground border border-border">Cancelled</span>;
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

      {/* Header Actions in Floating Pill */}
      <ShellHeader>
        <div className="flex items-center gap-1 shrink-0">
          {/* Tab Switchers (Icon-Only) */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            <button
              onClick={() => setActiveTab("board")}
              title={`Milestone Board (${milestones.length})`}
              aria-label="Milestone Board"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "board"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("readiness")}
              title="Readiness & Critical Blockers"
              aria-label="Readiness"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "readiness"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              title="Timeline Penanda Vertikal"
              aria-label="Timeline"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "timeline"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5 text-sky-400" />
            </button>
            <button
              onClick={() => setActiveTab("stakeholder")}
              title="Tampilan Eksekutif & Stakeholder"
              aria-label="Stakeholder"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "stakeholder"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              title="Statistik & Rasio"
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
            onClick={() => setIsNewMilestoneOpen(true)}
            title="Rumuskan Milestone Baru"
            aria-label="Rumuskan Milestone"
            className="p-1.5 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Page Header Banner */}
      <div className="px-6 py-4 border-b border-border bg-card/40 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-7xl">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-rose-500 rounded-xl shadow-lg shadow-amber-500/20 shrink-0">
              <Flag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Milestone Manager</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                  App #32
                </span>
                <span className="text-xs text-muted-foreground">
                  Checkpoint Strategis Lintas-Project & Lintas-Goal
                </span>
              </div>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Titik konvergensi independen yang mengawasi prasyarat kritis, kesiapan terhitung (ReadinessStatus), dan pelaporan eksekutif.
              </p>
            </div>
          </div>
        </div>
      </div>



      {/* Main Content */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6 max-w-4xl">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Checkpoint</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                <div className="text-xs text-muted-foreground mt-1">Milestone strategis</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Rasio On-Track</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.onTrackRatio}%</div>
                <div className="text-xs text-muted-foreground mt-1">Dari checkpoint aktif</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Rata-rata Prasyarat</div>
                <div className="text-3xl font-extrabold text-amber-400 mt-1">{stats.avgPrereqs}</div>
                <div className="text-xs text-muted-foreground mt-1">Per milestone</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Penghambat Kritis</div>
                <div className="text-3xl font-extrabold text-rose-400 mt-1">{stats.blockerCount}</div>
                <div className="text-xs text-muted-foreground mt-1">Prasyarat berisiko tinggi</div>
              </div>
            </div>
          </div>
        )}

        {/* READINESS DASHBOARD */}
        {activeTab === "readiness" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Kesiapan (ReadinessStatus) dihitung secara deterministik: jika ada Prasyarat kritis yang tertunda/butuh revisi, status otomatis berubah menjadi <span className="text-rose-400 font-bold">Delayed</span> atau <span className="text-amber-400 font-bold">At Risk</span>.
            </div>

            <div className="space-y-4">
              {milestones.map((m) => {
                const r = calculateReadiness(m.id);
                const prereqs = prerequisites.filter((p) => p.strategicMilestoneId === m.id);
                const totalCritical = prereqs.filter((p) => p.isCritical).length;
                const completedCritical = prereqs.filter((p) => p.isCritical && p.currentStatus === "completed").length;
                const critPct = totalCritical > 0 ? Math.round((completedCritical / totalCritical) * 100) : 100;

                return (
                  <div key={m.id} className="p-5 bg-card/80 border border-border rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Target: {m.targetDate}</span>
                          <span className="text-xs text-muted-foreground">• PJ: {m.ownerName}</span>
                        </div>
                        <h3
                          onClick={() => setSelectedMilestoneId(m.id)}
                          className="text-base font-bold text-foreground hover:text-amber-400 cursor-pointer mt-1"
                        >
                          {m.title}
                        </h3>
                      </div>

                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide border ${
                            r.overallStatus === "on_track"
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                              : r.overallStatus === "at_risk"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                              : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                          }`}
                        >
                          Readiness: {r.overallStatus.replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of Critical Prerequisites */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Prasyarat Kritis Selesai ({completedCritical}/{totalCritical})</span>
                        <span className="font-bold text-white">{critPct}%</span>
                      </div>
                      <div className="w-full bg-card h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            r.overallStatus === "on_track" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${critPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Blockers list */}
                    {r.criticalBlockers.length > 0 && (
                      <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs space-y-1 text-rose-300">
                        <div className="font-bold flex items-center gap-1.5 text-rose-400">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Penghambat Kritis Aktif (Critical Blockers):
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 text-foreground pl-1">
                          {r.criticalBlockers.map((b, idx) => (
                            <li key={idx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TIMELINE VIEW */}
        {activeTab === "timeline" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Penanda vertikal kronologis lintas waktu untuk seluruh milestone strategis perusahaan.
            </div>

            <div className="relative border-l-2 border-border pl-6 ml-4 space-y-8 py-2">
              {[...milestones]
                .sort((a, b) => a.targetDate.localeCompare(b.targetDate))
                .map((m) => (
                  <div key={m.id} className="relative group">
                    <div className="absolute -left-[31px] top-1 size-4 rounded-full bg-amber-500 border-4 border-border shadow" />
                    <div className="p-4 bg-card/80 border border-border rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-amber-400 font-semibold">{m.targetDate}</span>
                        {getStatusBadge(m.status)}
                      </div>
                      <h4
                        onClick={() => setSelectedMilestoneId(m.id)}
                        className="font-bold text-base text-foreground hover:text-amber-400 cursor-pointer"
                      >
                        {m.title}
                      </h4>
                      {m.description && <p className="text-xs text-muted-foreground">{m.description}</p>}
                      <div className="text-[11px] text-muted-foreground pt-1">Koordinator: {m.ownerName}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* STAKEHOLDER VIEW */}
        {activeTab === "stakeholder" && (
          <div className="space-y-4 max-w-4xl">
            <div className="p-4 bg-card/40 border border-border/60 rounded-xl text-xs text-muted-foreground">
              Perspektif eksekutif dan pelaporan ringkas tanpa perlu membuka detail operasional tiap entitas.
            </div>

            <div className="space-y-4">
              {milestones.map((m) => {
                const mUpdates = updates.filter((u) => u.strategicMilestoneId === m.id);
                const mStakeholders = stakeholders.filter((s) => s.strategicMilestoneId === m.id);

                return (
                  <div key={m.id} className="p-5 bg-card/80 border border-border rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">Tenggat Target: {m.targetDate}</span>
                        <h3 className="font-bold text-base text-white mt-0.5">{m.title}</h3>
                      </div>
                      {getStatusBadge(m.status)}
                    </div>

                    {/* Executive Sponsors & Team */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="text-muted-foreground font-semibold">Stakeholder:</span>
                      {mStakeholders.map((s) => (
                        <span key={s.id} className="px-2 py-0.5 rounded bg-card/80 text-foreground">
                          {s.personName} ({s.role.replace("_", " ")})
                        </span>
                      ))}
                    </div>

                    {/* Latest narrative update */}
                    {mUpdates.length > 0 && (
                      <div className="p-3 bg-background/80 border border-border rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between text-muted-foreground">
                          <span className="font-semibold text-foreground">Catatan Pembaruan Terkini:</span>
                          <span className="text-[10px]">{new Date(mUpdates[0].createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-foreground italic leading-relaxed">"{mUpdates[0].content}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* BOARD VIEW */}
        {activeTab === "board" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari milestone, pemilik, deskripsi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="on_track">On Track</option>
                  <option value="at_risk">At Risk</option>
                  <option value="delayed">Delayed</option>
                  <option value="achieved">Achieved</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMilestones.map((m) => {
                const prereqs = prerequisites.filter((p) => p.strategicMilestoneId === m.id);
                const r = calculateReadiness(m.id);

                return (
                  <div
                    key={m.id}
                    className="p-5 bg-card/80 border border-border hover:border-border rounded-xl flex flex-col justify-between transition space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          {m.targetDate}
                        </span>
                        {getStatusBadge(m.status)}
                      </div>

                      <div>
                        <h3
                          onClick={() => setSelectedMilestoneId(m.id)}
                          className="font-bold text-base text-foreground cursor-pointer hover:text-amber-400 transition"
                        >
                          {m.title}
                        </h3>
                        {m.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                            {m.description}
                          </p>
                        )}
                      </div>

                      <div className="text-[11px] text-muted-foreground pt-1 space-y-1">
                        <div>Penanggung Jawab: <span className="text-foreground">{m.ownerName}</span></div>
                        <div>Total Prasyarat: <span className="text-foreground">{prereqs.length} entitas</span></div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-muted-foreground">
                        Readiness: <strong className="text-white capitalize">{r.overallStatus.replace("_", " ")}</strong>
                      </span>

                      <button
                        onClick={() => setSelectedMilestoneId(m.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold flex items-center gap-1 shadow-sm"
                      >
                        Kelola Prasyarat
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: DETAIL MILESTONE & PREREQUISITES */}
      {selectedMilestoneId && activeMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-3xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">Target: {activeMilestone.targetDate}</span>
                  {getStatusBadge(activeMilestone.status)}
                </div>
                <h3 className="font-bold text-lg text-white mt-1">{activeMilestone.title}</h3>
              </div>
              <button onClick={() => setSelectedMilestoneId(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Readiness summary */}
              {activeReadiness && (
                <div className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Computed Readiness Status</div>
                    <div className="text-xl font-bold uppercase tracking-wider text-amber-400 mt-0.5">
                      {activeReadiness.overallStatus.replace("_", " ")}
                    </div>
                    {activeReadiness.criticalBlockers.length > 0 && (
                      <div className="text-xs text-rose-400 mt-1">
                        {activeReadiness.criticalBlockers.length} Penghambat Kritis terdeteksi.
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setMilestoneStatus(activeMilestone.id, "achieved");
                        showToast("Milestone ditandai SELESAI / Achieved!");
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Tandai Tercapai
                    </button>
                  </div>
                </div>
              )}

              {/* PREREQUISITES LIST */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-amber-400" />
                    Prasyarat Lintas-Entitas (Prerequisites)
                  </h4>
                </div>

                {activePrereqs.length === 0 ? (
                  <div className="p-3 bg-card/40 border border-border/60 rounded text-xs text-muted-foreground italic">
                    Belum ada prasyarat. Tambahkan Project, Goal, Task, atau Deliverable di bawah.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activePrereqs.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 bg-card/60 border border-border rounded-lg flex items-center justify-between text-xs"
                      >
                        <div className="space-y-1">
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            {getSourceIcon(p.sourceType)}
                            <span>{p.title}</span>
                            {p.isCritical && (
                              <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                                KRITIS
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            Aplikasi: {p.sourceType} • Status: {p.currentStatus}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <select
                            value={p.currentStatus}
                            onChange={(e) => updatePrerequisiteStatus(p.id, e.target.value as any)}
                            className="px-2 py-1 bg-background border border-border rounded text-xs text-foreground focus:outline-none"
                          >
                            <option value="completed">Completed</option>
                            <option value="on_track">On Track</option>
                            <option value="at_risk">At Risk</option>
                            <option value="delayed">Delayed</option>
                            <option value="needs_revision">Needs Revision</option>
                          </select>

                          <button
                            onClick={() => togglePrerequisiteCritical(p.id)}
                            className={`px-2 py-1 rounded text-[11px] border font-medium ${
                              p.isCritical
                                ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                                : "bg-card text-foreground border-border"
                            }`}
                          >
                            {p.isCritical ? "Kritis" : "Opsional"}
                          </button>

                          <button
                            onClick={() => removePrerequisite(p.id)}
                            className="text-muted-foreground hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Prerequisite Form */}
                <form onSubmit={handleAddPrerequisite} className="p-3 bg-background border border-border rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-foreground">Tautkan Prasyarat Baru:</div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Project / Deliverable / Task"
                      value={newPreTitle}
                      onChange={(e) => setNewPreTitle(e.target.value)}
                      className="md:col-span-2 px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-amber-500"
                    />
                    <select
                      value={newPreSource}
                      onChange={(e) => setNewPreSource(e.target.value as any)}
                      className="px-2 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-amber-500"
                    >
                      <option value="project">Project Manager (#03)</option>
                      <option value="goal">Goal Manager (#31)</option>
                      <option value="deliverable">Deliverable (#20)</option>
                      <option value="task">Task Manager (#01)</option>
                    </select>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-bold"
                    >
                      + Tambah
                    </button>
                  </div>
                </form>
              </div>

              {/* NARRATIVE UPDATES */}
              <div className="space-y-3 pt-2 border-t border-border">
                <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  Catatan Naratif Mingguan ke Stakeholder
                </h4>

                <div className="space-y-2 max-h-36 overflow-y-auto">
                  {activeUpdates.map((u) => (
                    <div key={u.id} className="p-2.5 bg-card/60 border border-border rounded text-xs space-y-1">
                      <div className="flex justify-between text-muted-foreground text-[10px]">
                        <span>{u.authorName}</span>
                        <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-foreground leading-relaxed">"{u.content}"</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddNarrative} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tulis update kualitatif mingguan..."
                    value={newNarrative}
                    onChange={(e) => setNewNarrative(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-background border border-border rounded text-xs text-foreground focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold shrink-0"
                  >
                    Kirim Catatan
                  </button>
                </form>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <button
                onClick={() => {
                  deleteMilestone(activeMilestone.id);
                  showToast("Milestone dihapus.");
                  setSelectedMilestoneId(null);
                }}
                className="px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Milestone
              </button>

              <button
                onClick={() => setSelectedMilestoneId(null)}
                className="px-4 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE MILESTONE */}
      {isNewMilestoneOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Rumuskan Milestone Strategis Baru</h3>
              <button onClick={() => setIsNewMilestoneOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMilestone} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Nama Milestone <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Peluncuran Nasional Produk X"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">Konteks Strategis</label>
                <textarea
                  rows={2}
                  placeholder="Signifikansi checkpoint ini bagi organisasi..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tanggal Target <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">Penanggung Jawab</label>
                  <input
                    type="text"
                    placeholder="mis. Head of PMO"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewMilestoneOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold"
                >
                  Simpan Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
