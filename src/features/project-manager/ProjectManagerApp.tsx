import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import React, { useState, useMemo } from "react";
import {
  FolderKanban,
  Plus,
  Calendar,
  Layers,
  Flag,
  AlertTriangle,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Copy,
  Archive,
  Trash2,
  RotateCcw,
  Sparkles,
  Search,
  PlayCircle,
  PauseCircle,
} from "lucide-react";
import {
  useProjectManager,
  PROJECT_TEMPLATES,
} from "./store";
import {
  ProjectStatus,
  Risk,
  ProjectViewMode,
  MemberRole,
} from "./types";
import { TaskStatus, TaskPriority } from "../task-manager/types";

export function ProjectManagerApp() {
  const {
    state,
    tasks,
    calculateProjectProgress,
    createProject,
    transitionProjectStatus,
    duplicateProject,
    deleteProject,
    addPhase,
    addMilestone,
    updateMilestone,
    addRisk,
    addMember,
    addTaskToProject,
    updateTaskStatus,
    applyProjectTemplate,
  } = useProjectManager();

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return state.projects[0]?.id || "";
  });

  const [viewMode, setViewMode] = useState<ProjectViewMode>("overview");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modals state
  const [showNewProjectModal, setShowNewProjectModal] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState<boolean>(false);
  const [showNewPhaseModal, setShowNewPhaseModal] = useState<boolean>(false);
  const [showNewMilestoneModal, setShowNewMilestoneModal] = useState<boolean>(false);
  const [showNewRiskModal, setShowNewRiskModal] = useState<boolean>(false);
  const [showNewMemberModal, setShowNewMemberModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  // Active Project
  const activeProject = useMemo(() => {
    return state.projects.find((p) => p.id === activeProjectId) || state.projects[0];
  }, [state.projects, activeProjectId]);

  // Project Progress stats
  const progressStats = useMemo(() => {
    if (!activeProject) return { progressPercent: 0, totalTasks: 0, completedTasks: 0, overdueTasks: 0, activeTasks: 0 };
    return calculateProjectProgress(activeProject.id);
  }, [activeProject, calculateProjectProgress]);

  // Filtered project list for sidebar/dropdown
  const filteredProjects = useMemo(() => {
    return state.projects.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q));
      }
      return true;
    });
  }, [state.projects, statusFilter, searchQuery]);

  // Project tasks from Task Manager
  const projectTasks = useMemo(() => {
    if (!activeProject) return [];
    return tasks.filter((t) => t.projectId === activeProject.id);
  }, [tasks, activeProject]);

  // Project phases
  const projectPhases = useMemo(() => {
    if (!activeProject) return [];
    return state.phases
      .filter((ph) => ph.projectId === activeProject.id)
      .sort((a, b) => a.order - b.order);
  }, [state.phases, activeProject]);

  // Project milestones
  const projectMilestones = useMemo(() => {
    if (!activeProject) return [];
    return state.milestones.filter((m) => m.projectId === activeProject.id);
  }, [state.milestones, activeProject]);

  // Project members
  const projectMembers = useMemo(() => {
    if (!activeProject) return [];
    return state.members.filter((m) => m.projectId === activeProject.id);
  }, [state.members, activeProject]);

  // Project risks
  const projectRisks = useMemo(() => {
    if (!activeProject) return [];
    return state.risks.filter((r) => r.projectId === activeProject.id);
  }, [state.risks, activeProject]);

  // Format currency
  const formatCurrency = (amount: number, currency: string = "IDR") => {
    if (currency === "IDR") {
      return `Rp ${amount.toLocaleString("id-ID")}`;
    }
    return `${currency} ${amount.toLocaleString()}`;
  };

  // Helper for status styling (clean typography)
  const getProjectStatusStyle = (status: ProjectStatus) => {
    switch (status) {
      case "active":
        return "text-emerald-700 font-medium";
      case "planning":
        return "text-blue-700 font-medium";
      case "on_hold":
        return "text-amber-700 font-medium";
      case "completed":
        return "text-foreground font-medium";
      case "cancelled":
        return "text-red-700 font-medium";
      case "archived":
        return "text-muted-foreground font-medium";
      default:
        return "text-muted-foreground";
    }
  };

  // Helper for priority color
  const getPriorityStyle = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "text-red-600 font-semibold";
      case "high":
        return "text-orange-600 font-medium";
      case "medium":
        return "text-amber-600";
      case "low":
        return "text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-muted/40 text-foreground">
      {/* LEFT SIDEBAR: Projects Navigator */}
      <ShellSidebar>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-indigo-600" />
            <h2 className="font-semibold text-foreground text-sm tracking-tight">Proyek & Portofolio</h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowTemplateModal(true)}
              title="Gunakan Template Proyek"
              className="p-1.5 text-muted-foreground hover:text-indigo-600 hover:bg-muted rounded-md transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowNewProjectModal(true)}
              title="Buat Proyek Baru"
              className="p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="p-3 border-b border-border space-y-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari proyek..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-muted/40 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-card"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-[11px] py-1 text-muted-foreground">
            {["all", "active", "planning", "on_hold", "completed"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? "bg-foreground text-background font-medium"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                {st === "all" ? "Semua" : st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredProjects.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Tidak ada proyek yang sesuai kriteria.
            </div>
          ) : (
            filteredProjects.map((p) => {
              const pProgress = calculateProjectProgress(p.id);
              const isActive = p.id === activeProjectId;
              return (
                <div
                  key={p.id}
                  onClick={() => setActiveProjectId(p.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all border ${
                    isActive
                      ? "bg-indigo-50/60 border-indigo-200 shadow-sm"
                      : "bg-card border-transparent hover:bg-muted/40 hover:border-border"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-xs font-medium leading-snug truncate ${isActive ? "text-indigo-950 font-semibold" : "text-foreground"}`}>
                      {p.name}
                    </h3>
                    <span className={`text-[10px] capitalize whitespace-nowrap ${getProjectStatusStyle(p.status)}`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {pProgress.totalTasks} tugas
                    </span>
                    <span className="font-semibold text-foreground">{pProgress.progressPercent}%</span>
                  </div>

                  {/* Progress Line */}
                  <div className="mt-1.5 h-1 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${pProgress.progressPercent}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Standalone Ecosystem Reference Footer (§0) */}
        <div className="p-3 border-t border-border bg-muted/40/70 text-[11px] text-muted-foreground">
          <p className="font-medium text-foreground">Standalone App #03</p>
          <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
            Source of truth untuk Project. Tugas dieksekusi di Task Manager (#01).
          </p>
        </div>
      </ShellSidebar>

      {/* MAIN PROJECT WORKSPACE */}
      {activeProject ? (
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          {/* Top Project Header Bar (Portaled to ShellHeader) */}
          <ShellHeader>
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Navigation Tabs (7 Views per §10) - Compact Header Segmented Icon Pills */}
              <div className="flex items-center gap-0.5 bg-muted/70 p-0.5 rounded-lg border border-border/60 text-xs font-medium shrink-0">
                {[
                  { id: "overview", label: "Ringkasan", icon: TrendingUp },
                  { id: "board", label: "Board", icon: FolderKanban },
                  { id: "timeline", label: "Timeline", icon: Layers },
                  { id: "list", label: "Daftar", icon: Clock },
                  { id: "calendar", label: "Kalender", icon: Calendar },
                  { id: "team", label: "Tim", icon: Users },
                  { id: "risks", label: "Risiko", icon: AlertTriangle },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = viewMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setViewMode(tab.id as ProjectViewMode)}
                      title={tab.label}
                      aria-label={tab.label}
                      className={`flex items-center justify-center p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                        isActive
                          ? "bg-background text-foreground font-semibold shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>

              {/* Primary Add Task to Project (Icon Only) */}
              <button
                onClick={() => setShowNewTaskModal(true)}
                title="Tugas Baru"
                aria-label="Tugas Baru"
                className="p-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-xs flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </ShellHeader>

          {/* Project Details Banner (In Workspace) */}
          <div className="px-6 py-4 border-b border-border bg-background">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Proyek #{activeProject.id.slice(-6)}</span>
                  <span aria-hidden="true">·</span>
                  <span className={getProjectStatusStyle(activeProject.status)}>
                    {activeProject.status.toUpperCase().replace("_", " ")}
                  </span>
                  {activeProject.tags.map((tg) => (
                    <React.Fragment key={tg}>
                      <span aria-hidden="true">·</span>
                      <span>{tg}</span>
                    </React.Fragment>
                  ))}
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight truncate">
                  {activeProject.name}
                </h1>
                {activeProject.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 max-w-3xl">
                    {activeProject.description}
                  </p>
                )}
              </div>

              {/* Action Controls & State Machine Buttons (§6) */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* State Machine Transition Selector */}
                <div className="flex items-center border border-border rounded-md p-0.5 bg-muted/40 text-xs">
                  {activeProject.status === "planning" && (
                    <button
                      onClick={() => transitionProjectStatus(activeProject.id, "active")}
                      className="px-2.5 py-1 text-emerald-700 hover:bg-emerald-100/60 rounded font-medium flex items-center gap-1 transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      Aktifkan
                    </button>
                  )}
                  {activeProject.status === "active" && (
                    <>
                      <button
                        onClick={() => transitionProjectStatus(activeProject.id, "on_hold")}
                        className="px-2.5 py-1 text-amber-700 hover:bg-amber-100/60 rounded font-medium flex items-center gap-1 transition-colors"
                      >
                        <PauseCircle className="w-3.5 h-3.5" />
                        Tunda
                      </button>
                      <button
                        onClick={() => transitionProjectStatus(activeProject.id, "completed")}
                        className="px-2.5 py-1 text-emerald-700 hover:bg-emerald-100/60 rounded font-medium flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selesai
                      </button>
                    </>
                  )}
                  {activeProject.status === "on_hold" && (
                    <button
                      onClick={() => transitionProjectStatus(activeProject.id, "active")}
                      className="px-2.5 py-1 text-emerald-700 hover:bg-emerald-100/60 rounded font-medium flex items-center gap-1 transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      Lanjutkan
                    </button>
                  )}
                  {(activeProject.status === "completed" || activeProject.status === "cancelled") && (
                    <button
                      onClick={() => transitionProjectStatus(activeProject.id, "active")}
                      className="px-2.5 py-1 text-indigo-700 hover:bg-indigo-100/60 rounded font-medium flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Buka Kembali
                    </button>
                  )}
                  {activeProject.status !== "archived" && (
                    <button
                      onClick={() => transitionProjectStatus(activeProject.id, "archived")}
                      className="px-2 py-1 text-muted-foreground hover:bg-muted/60 rounded flex items-center gap-1 transition-colors"
                      title="Arsipkan Proyek"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {activeProject.status === "archived" && (
                    <button
                      onClick={() => transitionProjectStatus(activeProject.id, "active")}
                      className="px-2.5 py-1 text-indigo-700 hover:bg-indigo-100/60 rounded font-medium flex items-center gap-1 transition-colors"
                    >
                      Pulihkan
                    </button>
                  )}
                </div>

                {/* Duplicate */}
                <button
                  onClick={() => duplicateProject(activeProject.id)}
                  title="Duplikasi struktur proyek"
                  className="p-1.5 border border-border text-muted-foreground hover:text-indigo-600 hover:bg-muted/40 rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  title="Hapus proyek"
                  className="p-1.5 border border-border text-muted-foreground hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* VIEW CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
            {/* VIEW 1: OVERVIEW */}
            {viewMode === "overview" && (
              <div className="space-y-6 max-w-6xl mx-auto">
                {/* 4 Stat Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Progress */}
                  <div className="p-4 bg-card border border-border rounded-lg shadow-xs space-y-2">
                    <span className="text-xs text-muted-foreground font-medium">Progres Keseluruhan</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-foreground">{progressStats.progressPercent}%</span>
                      <span className="text-xs text-muted-foreground">
                        {progressStats.completedTasks} / {progressStats.totalTasks} tugas
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${progressStats.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Card 2: Tasks Status */}
                  <div className="p-4 bg-card border border-border rounded-lg shadow-xs space-y-2">
                    <span className="text-xs text-muted-foreground font-medium">Status Tugas</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-foreground">{progressStats.activeTasks}</span>
                      <span className="text-xs text-amber-600 font-medium">
                        {progressStats.overdueTasks > 0 ? `${progressStats.overdueTasks} Terlambat` : "Tepat Waktu"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Tugas aktif dalam antrean eksekusi</p>
                  </div>

                  {/* Card 3: Milestones */}
                  <div className="p-4 bg-card border border-border rounded-lg shadow-xs space-y-2">
                    <span className="text-xs text-muted-foreground font-medium">Milestone Tercapai</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold text-foreground">
                        {projectMilestones.filter((m) => m.status === "achieved").length} / {projectMilestones.length}
                      </span>
                      <span className="text-xs text-emerald-600 font-medium">
                        {projectMilestones.length > 0
                          ? Math.round(
                              (projectMilestones.filter((m) => m.status === "achieved").length / projectMilestones.length) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Checkpoint kunci penyelesaian</p>
                  </div>

                  {/* Card 4: Budget Summary (§3.1) */}
                  <div className="p-4 bg-card border border-border rounded-lg shadow-xs space-y-2">
                    <span className="text-xs text-muted-foreground font-medium">Utilisasi Anggaran</span>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-bold text-foreground truncate">
                        {formatCurrency(activeProject.budgetSummary?.spent || 0, activeProject.budgetSummary?.currency)}
                      </span>
                      <span className="text-[11px] text-muted-foreground truncate">
                        / {formatCurrency(activeProject.budgetSummary?.allocated || 0, activeProject.budgetSummary?.currency)}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all duration-500"
                        style={{
                          width: `${
                            activeProject.budgetSummary?.allocated
                              ? Math.min(100, Math.round(((activeProject.budgetSummary.spent || 0) / activeProject.budgetSummary.allocated) * 100))
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2-Columns: Phases & Milestones + Risk / Team */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left 2 Cols: Phases & Milestones Progress */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Phase Flow */}
                    <div className="p-5 bg-card border border-border rounded-lg shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-sm font-semibold text-foreground">Tahapan Proyek (Phases)</h3>
                        </div>
                        <button
                          onClick={() => setShowNewPhaseModal(true)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tambah Fase
                        </button>
                      </div>

                      {projectPhases.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">Belum ada fase yang disusun.</p>
                      ) : (
                        <div className="space-y-3">
                          {projectPhases.map((phase) => {
                            const phaseTasks = projectTasks.filter((t) => t.phaseId === phase.id);
                            const completedPhaseTasks = phaseTasks.filter((t) => t.status === "completed").length;
                            const phasePct = phaseTasks.length > 0 ? Math.round((completedPhaseTasks / phaseTasks.length) * 100) : 0;

                            return (
                              <div
                                key={phase.id}
                                className="p-3 border border-border rounded-lg bg-muted/40/60 hover:bg-muted/40 transition-colors"
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2 font-medium text-foreground">
                                    <span className="w-5 h-5 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                                      {phase.order}
                                    </span>
                                    <span>{phase.name}</span>
                                  </div>
                                  <span className={`capitalize text-[11px] ${
                                    phase.status === "completed" ? "text-emerald-700 font-medium" : phase.status === "active" ? "text-indigo-700 font-medium" : "text-muted-foreground"
                                  }`}>
                                    {phase.status}
                                  </span>
                                </div>

                                <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                                  <span>{phaseTasks.length} tugas terkait</span>
                                  <span>{phasePct}% selesai</span>
                                </div>
                                <div className="mt-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-indigo-600" style={{ width: `${phasePct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Milestones Checkpoints */}
                    <div className="p-5 bg-card border border-border rounded-lg shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Flag className="w-4 h-4 text-emerald-600" />
                          <h3 className="text-sm font-semibold text-foreground">Checkpoint Kunci (Milestones)</h3>
                        </div>
                        <button
                          onClick={() => setShowNewMilestoneModal(true)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tambah Milestone
                        </button>
                      </div>

                      {projectMilestones.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">Belum ada milestone tercatat.</p>
                      ) : (
                        <div className="divide-y divide-border">
                          {projectMilestones.map((ms) => {
                            const isAchieved = ms.status === "achieved";
                            return (
                              <div key={ms.id} className="py-3 flex items-start justify-between gap-3">
                                <div className="flex items-start gap-2.5">
                                  <button
                                    onClick={() =>
                                      updateMilestone(ms.id, {
                                        status: isAchieved ? "upcoming" : "achieved",
                                      })
                                    }
                                    className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                      isAchieved ? "bg-emerald-600 border-emerald-600 text-white" : "border-border hover:border-emerald-500"
                                    }`}
                                  >
                                    {isAchieved && <CheckCircle2 className="w-3 h-3" />}
                                  </button>
                                  <div>
                                    <h4 className={`text-xs font-medium ${isAchieved ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                      {ms.title}
                                    </h4>
                                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                                      <span>Target: {new Date(ms.targetDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                                      {ms.linkedTaskIds && ms.linkedTaskIds.length > 0 && (
                                        <>
                                          <span aria-hidden="true">·</span>
                                          <span>{ms.linkedTaskIds.length} Tugas Penghubung</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <span className={`text-[10px] capitalize ${isAchieved ? "text-emerald-700 font-medium" : "text-muted-foreground"}`}>
                                  {ms.status}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right 1 Col: Risks & Objectives */}
                  <div className="space-y-6">
                    {/* Top Risks */}
                    <div className="p-5 bg-card border border-border rounded-lg shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <h3 className="text-sm font-semibold text-foreground">Potensi Risiko</h3>
                        </div>
                        <button
                          onClick={() => setShowNewRiskModal(true)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tambah
                        </button>
                      </div>

                      {projectRisks.length === 0 ? (
                        <p className="text-xs text-muted-foreground py-4 text-center">Tidak ada risiko aktif tercatat.</p>
                      ) : (
                        <div className="space-y-3">
                          {projectRisks.slice(0, 3).map((rk) => (
                            <div key={rk.id} className="p-2.5 border border-border rounded-md bg-muted/40/50 text-xs space-y-1">
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-medium text-foreground line-clamp-1">{rk.title}</span>
                                <span className="text-[10px] text-red-600 font-medium capitalize">{rk.impact} impact</span>
                              </div>
                              {rk.mitigationPlan && (
                                <p className="text-[11px] text-muted-foreground line-clamp-2">
                                  Mitigasi: {rk.mitigationPlan}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Team Members */}
                    <div className="p-5 bg-card border border-border rounded-lg shadow-xs">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-indigo-600" />
                          <h3 className="text-sm font-semibold text-foreground">Tim Proyek</h3>
                        </div>
                        <button
                          onClick={() => setShowNewMemberModal(true)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Undang
                        </button>
                      </div>

                      <div className="divide-y divide-border">
                        {projectMembers.map((m) => {
                          const assignedTasks = projectTasks.filter((t) => t.assigneeName === m.name || t.assigneeId === m.userId);
                          return (
                            <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                              <div>
                                <p className="font-medium text-foreground">{m.name}</p>
                                <p className="text-[11px] text-muted-foreground capitalize">{m.role}</p>
                              </div>
                              <span className="text-[11px] text-muted-foreground font-medium">
                                {assignedTasks.length} tugas aktif
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 2: KANBAN BOARD */}
            {viewMode === "board" && (
              <div className="max-w-7xl mx-auto flex gap-4 overflow-x-auto pb-4">
                {(["inbox", "planned", "in_progress", "waiting", "completed"] as TaskStatus[]).map((status) => {
                  const tasksInStatus = projectTasks.filter((t) => t.status === status);
                  const statusTitles: Record<TaskStatus, string> = {
                    inbox: "Inbox",
                    planned: "Direncanakan (Planned)",
                    in_progress: "Sedang Berjalan",
                    waiting: "Menunggu (Waiting)",
                    completed: "Selesai",
                    cancelled: "Dibatalkan",
                    archived: "Diarsipkan",
                  };

                  return (
                    <div
                      key={status}
                      className="w-72 flex-shrink-0 bg-muted/70 border border-border rounded-lg flex flex-col max-h-[calc(100vh-230px)]"
                    >
                      {/* Column Header */}
                      <div className="p-3 border-b border-border/60 flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground capitalize">
                          {statusTitles[status]}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono font-medium">
                          {tasksInStatus.length}
                        </span>
                      </div>

                      {/* Task Cards */}
                      <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {tasksInStatus.map((t) => {
                          const phase = projectPhases.find((ph) => ph.id === t.phaseId);
                          return (
                            <div
                              key={t.id}
                              className="p-3 bg-card border border-border rounded-md shadow-xs hover:border-indigo-300 transition-all space-y-2"
                            >
                              <div className="flex items-start justify-between gap-1">
                                <h4 className="text-xs font-medium text-foreground leading-snug">
                                  {t.title}
                                </h4>
                                <span className={`text-[10px] capitalize whitespace-nowrap ${getPriorityStyle(t.priority)}`}>
                                  {t.priority}
                                </span>
                              </div>

                              {t.description && (
                                <p className="text-[11px] text-muted-foreground line-clamp-2">{t.description}</p>
                              )}

                              <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground">
                                <span>{phase ? phase.name.slice(0, 14) + "..." : "Umum"}</span>
                                {t.dueAt && (
                                  <span>{new Date(t.dueAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                                )}
                              </div>

                              {/* Status Mover Selector */}
                              <div className="mt-1">
                                <select
                                  value={t.status}
                                  onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                                  className="w-full text-[10px] py-1 px-1.5 bg-muted/40 border border-border rounded text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                  <option value="inbox">Ke Inbox</option>
                                  <option value="planned">Ke Planned</option>
                                  <option value="in_progress">Ke In Progress</option>
                                  <option value="waiting">Ke Waiting</option>
                                  <option value="completed">Tandai Selesai</option>
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Quick Add at bottom */}
                      <div className="p-2 border-t border-border/60">
                        <button
                          onClick={() => setShowNewTaskModal(true)}
                          className="w-full py-1.5 text-xs text-muted-foreground hover:text-indigo-600 hover:bg-card rounded transition-colors flex items-center justify-center gap-1 font-medium"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Tambah Kartu
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 3: TIMELINE / GANTT */}
            {viewMode === "timeline" && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="p-5 bg-card border border-border rounded-lg shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Timeline & Fase Waktu</h3>
                      <p className="text-xs text-muted-foreground">Visualisasi sekuens fase dan milestone dalam rentang proyek</p>
                    </div>
                  </div>

                  {/* Horizontal visual Gantt representation */}
                  <div className="space-y-4">
                    {projectPhases.map((phase, idx) => (
                      <div key={phase.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">
                            {phase.name}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {phase.startAt ? new Date(phase.startAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "TBA"} -{" "}
                            {phase.dueAt ? new Date(phase.dueAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }) : "TBA"}
                          </span>
                        </div>

                        {/* Phase Bar */}
                        <div className="h-6 w-full bg-muted rounded-md overflow-hidden relative flex items-center px-3">
                          <div
                            className={`h-full absolute left-0 top-0 rounded-md opacity-80 ${
                              phase.status === "completed"
                                ? "bg-emerald-500"
                                : phase.status === "active"
                                ? "bg-indigo-600"
                                : "bg-border"
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(25, 20 + idx * 25))}%`,
                            }}
                          />
                          <span className="relative z-10 text-[11px] font-medium text-white truncate">
                            {phase.status.toUpperCase()}
                          </span>
                        </div>

                        {/* Milestones inside this phase */}
                        <div className="pl-4 space-y-1 mt-1">
                          {projectMilestones
                            .filter((m) => m.phaseId === phase.id)
                            .map((m) => (
                              <div key={m.id} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                                <Flag className={`w-3 h-3 ${m.status === "achieved" ? "text-emerald-500" : "text-amber-500"}`} />
                                <span className={m.status === "achieved" ? "line-through text-muted-foreground" : "font-medium"}>{m.title}</span>
                                <span className="text-muted-foreground">· {new Date(m.targetDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 4: LIST */}
            {viewMode === "list" && (
              <div className="max-w-6xl mx-auto space-y-4">
                <div className="p-4 bg-card border border-border rounded-lg shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-foreground">
                      Total: {projectTasks.length} Tugas
                    </span>
                    <span aria-hidden="true" className="text-foreground">|</span>
                    <span className="text-xs text-muted-foreground">
                      {progressStats.completedTasks} Selesai · {progressStats.activeTasks} Aktif
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNewTaskModal(true)}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Tambah Tugas
                  </button>
                </div>

                <div className="bg-card border border-border rounded-lg shadow-xs divide-y divide-border">
                  {projectTasks.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      Belum ada tugas yang diasosiasikan dengan proyek ini.
                    </div>
                  ) : (
                    projectTasks.map((task) => {
                      const phase = projectPhases.find((ph) => ph.id === task.phaseId);
                      const isCompleted = task.status === "completed";

                      return (
                        <div key={task.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/40/60 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              onClick={() =>
                                updateTaskStatus(task.id, isCompleted ? "inbox" : "completed")
                              }
                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                isCompleted ? "bg-indigo-600 border-indigo-600 text-white" : "border-border hover:border-indigo-500"
                              }`}
                            >
                              {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                            </button>
                            <div className="min-w-0">
                              <h4 className={`text-xs font-medium truncate ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                                {task.title}
                              </h4>
                              <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                                <span>{phase ? phase.name : "Umum"}</span>
                                {task.dueAt && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span>Tenggat: {new Date(task.dueAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                                  </>
                                )}
                                {task.assigneeName && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span>PIC: {task.assigneeName}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 flex-shrink-0">
                            <span className={`text-[10px] capitalize ${getPriorityStyle(task.priority)}`}>
                              {task.priority}
                            </span>
                            <select
                              value={task.status}
                              onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                              className="text-xs py-1 px-2 bg-muted/40 border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="inbox">Inbox</option>
                              <option value="planned">Planned</option>
                              <option value="in_progress">In Progress</option>
                              <option value="waiting">Waiting</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* VIEW 5: CALENDAR */}
            {viewMode === "calendar" && (
              <div className="max-w-6xl mx-auto space-y-4">
                <div className="p-4 bg-card border border-border rounded-lg shadow-xs">
                  <h3 className="text-sm font-semibold text-foreground">Agenda Tanggal & Milestone Proyek</h3>
                  <p className="text-xs text-muted-foreground">Daftar item berbatas waktu dan target checkpoint dalam format kalender.</p>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Milestones Card list */}
                    {projectMilestones.map((ms) => (
                      <div key={ms.id} className="p-3 border border-emerald-200 bg-emerald-50/40 rounded-lg text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                            <Flag className="w-3.5 h-3.5 text-emerald-600" />
                            Milestone
                          </span>
                          <span className="text-[10px] text-emerald-700 capitalize font-medium">{ms.status}</span>
                        </div>
                        <p className="font-medium text-foreground">{ms.title}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {new Date(ms.targetDate).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    ))}

                    {/* Tasks with Due Date */}
                    {projectTasks
                      .filter((t) => t.dueAt)
                      .map((t) => (
                        <div key={t.id} className="p-3 border border-border bg-card rounded-lg text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-foreground flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-indigo-600" />
                              Tugas
                            </span>
                            <span className={`text-[10px] capitalize ${getPriorityStyle(t.priority)}`}>{t.priority}</span>
                          </div>
                          <p className="font-medium text-foreground line-clamp-1">{t.title}</p>
                          <p className="text-[11px] text-muted-foreground">
                            Tenggat: {new Date(t.dueAt!).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 6: TEAM & WORKLOAD */}
            {viewMode === "team" && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="p-5 bg-card border border-border rounded-lg shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Beban Kerja Tim (Workload)</h3>
                      <p className="text-xs text-muted-foreground">Distribusi alokasi tugas per anggota untuk mencegah kelebihan beban</p>
                    </div>
                    <button
                      onClick={() => setShowNewMemberModal(true)}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah Anggota
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectMembers.map((member) => {
                      const assignedTasks = projectTasks.filter(
                        (t) => t.assigneeName === member.name || t.assigneeId === member.userId
                      );
                      const activeTasks = assignedTasks.filter((t) => t.status !== "completed");
                      const completedTasks = assignedTasks.filter((t) => t.status === "completed");

                      return (
                        <div key={member.id} className="p-4 border border-border rounded-lg bg-muted/40/50 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs">
                                {member.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-foreground">{member.name}</h4>
                                <p className="text-[11px] text-muted-foreground">{member.email || "No email"}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-indigo-700 capitalize bg-indigo-50 px-2 py-0.5 rounded">
                              {member.role}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                            <span>Tugas Aktif: <strong>{activeTasks.length}</strong></span>
                            <span>Selesai: <strong>{completedTasks.length}</strong></span>
                            <span>Total Beban: <strong>{assignedTasks.length}</strong></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 7: RISK REGISTER */}
            {viewMode === "risks" && (
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="p-5 bg-card border border-border rounded-lg shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Risk Register & Rencana Mitigasi</h3>
                      <p className="text-xs text-muted-foreground">Matriks identifikasi risiko (Likelihood x Impact) dan rencana penanggulangan</p>
                    </div>
                    <button
                      onClick={() => setShowNewRiskModal(true)}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Identifikasi Risiko
                    </button>
                  </div>

                  {projectRisks.length === 0 ? (
                    <div className="p-8 text-center text-xs text-muted-foreground">
                      Tidak ada catatan risiko yang teridentifikasi.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {projectRisks.map((risk) => (
                        <div key={risk.id} className="p-4 border border-border rounded-lg bg-card space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="text-xs font-semibold text-foreground">{risk.title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{risk.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[11px] font-medium text-muted-foreground">
                                Kemungkinan: <strong>{risk.likelihood}</strong>
                              </span>
                              <span aria-hidden="true" className="text-foreground">·</span>
                              <span className="text-[11px] font-medium text-red-600">
                                Dampak: <strong>{risk.impact}</strong>
                              </span>
                              <span aria-hidden="true" className="text-foreground">·</span>
                              <span className="text-[10px] font-semibold text-foreground capitalize bg-muted px-2 py-0.5 rounded">
                                {risk.status}
                              </span>
                            </div>
                          </div>

                          {risk.mitigationPlan && (
                            <div className="pt-2 border-t border-border text-xs text-muted-foreground">
                              <strong className="text-foreground">Rencana Mitigasi:</strong> {risk.mitigationPlan}
                              {risk.ownerName && (
                                <span className="ml-2 text-muted-foreground">({risk.ownerName})</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-muted-foreground text-xs">
          Belum ada proyek yang dipilih. Silakan buat proyek baru atau pilih dari sidebar.
        </div>
      )}

      {/* MODAL: NEW PROJECT */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Buat Proyek Baru</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const description = formData.get("description") as string;
                const budgetAllocated = Number(formData.get("budgetAllocated") || 0);

                const created = createProject({
                  name,
                  description,
                  status: "planning",
                  budgetSummary: {
                    allocated: budgetAllocated,
                    spent: 0,
                    currency: "IDR",
                  },
                });

                setActiveProjectId(created.id);
                setShowNewProjectModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Nama Proyek *</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="mis. Audit Kepatuhan & Tata Kelola Korporat"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Deskripsi & Ruang Lingkup</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Latar belakang, tujuan, dan cakupan evaluasi..."
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Alokasi Anggaran (IDR)</label>
                <input
                  name="budgetAllocated"
                  type="number"
                  placeholder="mis. 150000000"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: USE TEMPLATE (§11) */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Gunakan Template Proyek (§11)</h3>
              <p className="text-xs text-muted-foreground">Menerapkan struktur fase, milestone, dan template task secara otomatis.</p>
            </div>

            <div className="space-y-3">
              {PROJECT_TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="p-4 border border-border rounded-lg hover:border-indigo-400 transition-all space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-foreground">{tmpl.name}</h4>
                      <p className="text-xs text-muted-foreground">{tmpl.description}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      {tmpl.phases.length} Fase
                    </span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => {
                        const newP = applyProjectTemplate(tmpl.id, tmpl.name);
                        if (newP) setActiveProjectId(newP.id);
                        setShowTemplateModal(false);
                      }}
                      className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                    >
                      Terapkan Template Ini
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTemplateModal(false)}
                className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK TO PROJECT (§3.3) */}
      {showNewTaskModal && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Tambah Tugas ke Proyek</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const phaseId = (formData.get("phaseId") as string) || undefined;
                const priority = formData.get("priority") as TaskPriority;
                const dueAt = formData.get("dueAt") as string;
                const assigneeName = formData.get("assigneeName") as string;

                addTaskToProject({
                  projectId: activeProject.id,
                  title,
                  phaseId,
                  priority,
                  dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
                  assigneeName,
                });

                setShowNewTaskModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Judul Tugas *</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="mis. Review klausul liabilitas kontrak mitra"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Fase Proyek</label>
                <select
                  name="phaseId"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Umum / Tanpa Fase Khusus</option>
                  {projectPhases.map((ph) => (
                    <option key={ph.id} value={ph.id}>{ph.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Prioritas</label>
                  <select
                    name="priority"
                    defaultValue="medium"
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Tenggat Waktu</label>
                  <input
                    name="dueAt"
                    type="date"
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Penanggung Jawab (PIC)</label>
                <input
                  name="assigneeName"
                  type="text"
                  placeholder="mis. Konsultan Hukum"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Tambah ke Task Manager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PHASE (§4) */}
      {showNewPhaseModal && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Tambah Fase Proyek (§4)</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const startAt = formData.get("startAt") as string;
                const dueAt = formData.get("dueAt") as string;

                addPhase({
                  projectId: activeProject.id,
                  name,
                  startAt: startAt ? new Date(startAt).toISOString() : undefined,
                  dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
                  status: "upcoming",
                });

                setShowNewPhaseModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Nama Fase *</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="mis. Fase 4: Pengujian & Verifikasi Lapangan"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Tanggal Mulai</label>
                  <input
                    name="startAt"
                    type="date"
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Target Selesai</label>
                  <input
                    name="dueAt"
                    type="date"
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewPhaseModal(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Simpan Fase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MILESTONE (§7) */}
      {showNewMilestoneModal && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Tambah Milestone Kunci (§7)</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const targetDate = formData.get("targetDate") as string;
                const phaseId = (formData.get("phaseId") as string) || undefined;

                addMilestone({
                  projectId: activeProject.id,
                  title,
                  targetDate: targetDate ? new Date(targetDate).toISOString() : new Date().toISOString(),
                  phaseId,
                });

                setShowNewMilestoneModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Judul Checkpoint Milestone *</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="mis. Penyerahan Laporan Final Opini Audit"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Target Tanggal *</label>
                <input
                  name="targetDate"
                  type="date"
                  required
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Kaitkan ke Fase (Opsional)</label>
                <select
                  name="phaseId"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Tanpa Fase</option>
                  {projectPhases.map((ph) => (
                    <option key={ph.id} value={ph.id}>{ph.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewMilestoneModal(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Simpan Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RISK (§8) */}
      {showNewRiskModal && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Identifikasi Risiko (§8)</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const description = formData.get("description") as string;
                const likelihood = formData.get("likelihood") as Risk["likelihood"];
                const impact = formData.get("impact") as Risk["impact"];
                const mitigationPlan = formData.get("mitigationPlan") as string;

                addRisk({
                  projectId: activeProject.id,
                  title,
                  description,
                  likelihood,
                  impact,
                  mitigationPlan,
                });

                setShowNewRiskModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Judul Risiko *</label>
                <input
                  name="title"
                  type="text"
                  required
                  placeholder="mis. Keterlambatan respons legal dari counterpart"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Deskripsi Dampak</label>
                <textarea
                  name="description"
                  rows={2}
                  placeholder="Potensi terhambatnya jadwal penandatanganan..."
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Kemungkinan (Likelihood)</label>
                  <select
                    name="likelihood"
                    defaultValue="medium"
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="low">Rendah (Low)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="high">Tinggi (High)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Dampak (Impact)</label>
                  <select
                    name="impact"
                    defaultValue="high"
                    className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="low">Rendah (Low)</option>
                    <option value="medium">Sedang (Medium)</option>
                    <option value="high">Tinggi (High)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Rencana Mitigasi</label>
                <input
                  name="mitigationPlan"
                  type="text"
                  placeholder="Eskalasi ke dewan direksi via surat resmi..."
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewRiskModal(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Catat Risiko
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD MEMBER (§5) */}
      {showNewMemberModal && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Tambah Anggota Tim Proyek (§5)</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;
                const role = formData.get("role") as MemberRole;

                addMember({
                  projectId: activeProject.id,
                  name,
                  email,
                  role,
                });

                setShowNewMemberModal(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Nama Anggota *</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="mis. Konsultan Finansial"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="konsultan@firma.co.id"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Peran dalam Proyek</label>
                <select
                  name="role"
                  defaultValue="contributor"
                  className="w-full text-xs p-2 border border-border rounded focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="owner">Owner (Kontrol Penuh)</option>
                  <option value="manager">Manager (Ubah Struktur, Assign Task)</option>
                  <option value="contributor">Contributor (Kerjakan Task Sendiri)</option>
                  <option value="viewer">Viewer (Hanya Melihat)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewMemberModal(false)}
                  className="px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL (§3.3) */}
      {showDeleteConfirm && activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-card rounded-lg shadow-xl border border-border p-6 space-y-4">
            <h3 className="text-sm font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Hapus Proyek: {activeProject.name}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Aturan Ekosistem (§3.3): Menghapus proyek tidak menghapus task di dalamnya secara default — task akan dilepas referensinya dan tetap aman di Task Manager.
            </p>

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  deleteProject(activeProject.id, false);
                  setShowDeleteConfirm(false);
                }}
                className="w-full py-2 text-xs font-medium bg-foreground text-background rounded hover:bg-foreground transition-colors"
              >
                Hapus Proyek (Pertahankan Tugas di Task Manager)
              </button>
              <button
                onClick={() => {
                  deleteProject(activeProject.id, true);
                  setShowDeleteConfirm(false);
                }}
                className="w-full py-2 text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
              >
                Hapus Proyek Beserta Seluruh Tugas Terkait
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-1.5 text-xs text-muted-foreground hover:bg-muted rounded"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
