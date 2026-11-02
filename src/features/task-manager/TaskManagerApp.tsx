import { useState, useMemo } from "react";
import { ShellHeader } from "@/app/shell-header";
import {
  ListTodo,
  Plus,
  Search,
  Kanban,
  Calendar,
  Table as TableIcon,
  AlertTriangle,
  Copy,
  BarChart3,
  Trash2,
  X,
  GitBranch,
} from "lucide-react";
import {
  ViewMode,
  SmartFilter,
  TaskPriority,
} from "./types";
import { useTaskManager } from "./store";
import { useShellSections } from "@/app/shell-sections";
import { TaskListView } from "./components/TaskListView";
import { TaskBoardView } from "./components/TaskBoardView";
import { TaskCalendarView } from "./components/TaskCalendarView";
import { TaskTimelineView } from "./components/TaskTimelineView";
import { TaskTableView } from "./components/TaskTableView";
import { TaskPriorityView } from "./components/TaskPriorityView";
import { TaskDetailModal } from "./components/TaskDetailModal";
import { TaskTemplatesModal } from "./components/TaskTemplatesModal";
import { TaskStatisticsModal } from "./components/TaskStatisticsModal";

export function TaskManagerApp() {
  const {
    tasks,
    projects,
    tags,
    createTask,
    bulkUpdateStatus,
    bulkUpdatePriority,
    bulkDelete,
  } = useTaskManager();

  // Navigation & View States
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [smartFilter, setSmartFilter] = useState<SmartFilter>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [selectedTagId, setSelectedTagId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useShellSections([
    { id: "list", label: "List", icon: ListTodo, active: viewMode === "list", onSelect: () => setViewMode("list") },
    { id: "board", label: "Board", icon: Kanban, active: viewMode === "board", onSelect: () => setViewMode("board") },
    { id: "calendar", label: "Kalender", icon: Calendar, active: viewMode === "calendar", onSelect: () => setViewMode("calendar") },
    { id: "timeline", label: "Timeline", icon: GitBranch, active: viewMode === "timeline", onSelect: () => setViewMode("timeline") },
    { id: "table", label: "Tabel", icon: TableIcon, active: viewMode === "table", onSelect: () => setViewMode("table") },
    { id: "priority", label: "Eisenhower", icon: AlertTriangle, active: viewMode === "priority", onSelect: () => setViewMode("priority") },
  ]);

  // Quick Capture Input state
  const [quickTitle, setQuickTitle] = useState("");

  // Modals & Active Task
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);

  // Multi-selection for bulk actions
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  // Filter Tasks
  const filteredTasks = useMemo(() => {
    const nowTime = Date.now();
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    const sevenDaysLater = nowTime + 7 * 86400000;

    return tasks.filter((task) => {
      // 1. Smart View Filtering
      if (smartFilter === "archived") {
        if (task.status !== "archived") return false;
      } else {
        if (task.status === "archived") return false;

        if (smartFilter === "inbox" && task.status !== "inbox") return false;
        if (smartFilter === "completed" && task.status !== "completed") return false;
        if (smartFilter === "today") {
          if (!task.dueAt && !task.startAt) return false;
          const targetTime = new Date(task.dueAt || task.startAt!).getTime();
          if (targetTime > todayEnd.getTime() || task.status === "completed") return false;
        }
        if (smartFilter === "upcoming") {
          if (!task.dueAt) return false;
          const targetTime = new Date(task.dueAt).getTime();
          if (targetTime < nowTime || targetTime > sevenDaysLater || task.status === "completed") return false;
        }
        if (smartFilter === "overdue") {
          if (!task.dueAt || task.status === "completed" || task.status === "cancelled") return false;
          if (new Date(task.dueAt).getTime() >= nowTime) return false;
        }
      }

      // 2. Project Filter
      if (selectedProjectId !== "all") {
        if (task.projectId !== selectedProjectId) return false;
      }

      // 3. Tag Filter
      if (selectedTagId !== "all") {
        if (!task.tags.includes(selectedTagId)) return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(q);
        const matchesDesc = task.description?.toLowerCase().includes(q);
        const matchesTag = task.tags.some((tId) => {
          const t = tags.find((item) => item.id === tId);
          return t?.name.toLowerCase().includes(q);
        });
        if (!matchesTitle && !matchesDesc && !matchesTag) return false;
      }

      return true;
    });
  }, [tasks, smartFilter, selectedProjectId, selectedTagId, searchQuery, tags]);

  // Quick Capture submit (cukup judul, minim friksi sesuai spesifikasi §1 & §20)
  const handleQuickCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    const newTask = createTask({
      title: quickTitle.trim(),
      status: "inbox",
      projectId: selectedProjectId !== "all" ? selectedProjectId : undefined,
    });
    setQuickTitle("");
    setActiveTaskId(newTask.id);
  };

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTaskIds.length === filteredTasks.length) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(filteredTasks.map((t) => t.id));
    }
  };

  // Bulk Actions
  const handleBulkComplete = () => {
    bulkUpdateStatus(selectedTaskIds, "completed");
    setSelectedTaskIds([]);
  };

  const handleBulkDelete = () => {
    bulkDelete(selectedTaskIds);
    setSelectedTaskIds([]);
  };

  const handleBulkPriority = (priority: TaskPriority) => {
    bulkUpdatePriority(selectedTaskIds, priority);
    setSelectedTaskIds([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* View Switcher Tabs portaled to Main Header */}
      <ShellHeader>
        <div className="flex items-center gap-0.5 bg-muted/70 p-0.5 rounded-lg border border-border/60 text-xs font-semibold shrink-0">
          <button
            onClick={() => setViewMode("list")}
            title="List"
            aria-label="List"
            className={`p-1.5 rounded-md transition-all flex items-center justify-center text-xs ${
              viewMode === "list"
                ? "bg-background text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListTodo className="size-3.5" />
          </button>
          <button
            onClick={() => setViewMode("board")}
            title="Board"
            aria-label="Board"
            className={`p-1.5 rounded-md transition-all flex items-center justify-center text-xs ${
              viewMode === "board"
                ? "bg-background text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Kanban className="size-3.5" />
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            title="Kalender"
            aria-label="Kalender"
            className={`p-1.5 rounded-md transition-all flex items-center justify-center text-xs ${
              viewMode === "calendar"
                ? "bg-background text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calendar className="size-3.5" />
          </button>
          <button
            onClick={() => setViewMode("timeline")}
            title="Timeline"
            aria-label="Timeline"
            className={`p-1.5 rounded-md transition-all flex items-center justify-center text-xs ${
              viewMode === "timeline"
                ? "bg-background text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitBranch className="size-3.5" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            title="Tabel"
            aria-label="Tabel"
            className={`p-1.5 rounded-md transition-all flex items-center justify-center text-xs ${
              viewMode === "table"
                ? "bg-background text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <TableIcon className="size-3.5" />
          </button>
          <button
            onClick={() => setViewMode("priority")}
            title="Eisenhower Matrix"
            aria-label="Eisenhower Matrix"
            className={`p-1.5 rounded-md transition-all flex items-center justify-center text-xs ${
              viewMode === "priority"
                ? "bg-background text-primary shadow-xs font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <AlertTriangle className="size-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Quick Capture Input (§1 & §20: Minim friksi capture cepat) */}
        <form onSubmit={handleQuickCapture} className="relative">
          <div className="flex items-center gap-3 bg-card border border-border/80 rounded-2xl shadow-sm p-2 sm:p-2.5 focus-within:ring-2 focus-within:ring-primary/40 transition-all">
            <div className="pl-3 text-muted-foreground">
              <Plus className="size-5 text-primary" />
            </div>
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Quick Capture: Ketik judul tugas baru lalu tekan Enter (tanpa friksi)..."
              className="flex-1 bg-transparent border-0 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={!quickTitle.trim()}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 disabled:opacity-40 transition-colors shadow-sm"
            >
              Tambah
            </button>
          </div>
        </form>

        {/* Filters & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Smart Views Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {[
              { id: "all", label: "Semua Task" },
              { id: "inbox", label: "Inbox" },
              { id: "today", label: "Hari Ini" },
              { id: "upcoming", label: "7 Hari Depan" },
              { id: "overdue", label: "Overdue" },
              { id: "completed", label: "Selesai" },
              { id: "archived", label: "Arsip" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSmartFilter(f.id as SmartFilter)}
                className={`px-3 py-1.5 rounded-full transition-all shrink-0 ${
                  smartFilter === f.id
                    ? "bg-primary text-white shadow-sm"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search & Modals Trigger */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-56">
              <Search className="size-3.5 text-muted-foreground absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari task..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-border/70 bg-card text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Project Filter */}
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="rounded-xl border border-border/70 bg-card px-2.5 py-1.5 text-xs text-foreground"
            >
              <option value="all">Semua Proyek</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Template Trigger */}
            <button
              onClick={() => setIsTemplatesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 bg-card hover:bg-muted text-foreground transition-colors font-medium shadow-sm"
              title="Gunakan Template Proyek"
            >
              <Copy className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Templates</span>
            </button>

            {/* Statistics Trigger */}
            <button
              onClick={() => setIsStatsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/70 bg-card hover:bg-muted text-foreground transition-colors font-medium shadow-sm"
              title="Lihat Metrik & Statistik"
            >
              <BarChart3 className="size-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Statistik</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Bar (Visible when items selected) */}
        {selectedTaskIds.length > 0 && (
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between gap-4 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <span>{selectedTaskIds.length} task terpilih</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkComplete}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                Tandai Selesai
              </button>

              <select
                onChange={(e) => handleBulkPriority(e.target.value as TaskPriority)}
                defaultValue=""
                className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs"
              >
                <option value="" disabled>
                  Ubah Prioritas...
                </option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
                <option value="none">None</option>
              </select>

              <button
                onClick={handleBulkDelete}
                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Hapus task terpilih"
              >
                <Trash2 className="size-4" />
              </button>

              <button
                onClick={() => setSelectedTaskIds([])}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* View Presentation */}
        <div>
          {viewMode === "list" && (
            <TaskListView
              tasks={filteredTasks}
              onSelectTask={(id) => setActiveTaskId(id)}
              selectedIds={selectedTaskIds}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
            />
          )}

          {viewMode === "board" && (
            <TaskBoardView
              tasks={filteredTasks}
              onSelectTask={(id) => setActiveTaskId(id)}
              onQuickCreate={(status) => {
                const newTask = createTask({
                  title: "Task Baru",
                  status,
                  projectId: selectedProjectId !== "all" ? selectedProjectId : undefined,
                });
                setActiveTaskId(newTask.id);
              }}
            />
          )}

          {viewMode === "calendar" && (
            <TaskCalendarView
              tasks={filteredTasks}
              onSelectTask={(id) => setActiveTaskId(id)}
            />
          )}

          {viewMode === "timeline" && (
            <TaskTimelineView
              tasks={filteredTasks}
              onSelectTask={(id) => setActiveTaskId(id)}
            />
          )}

          {viewMode === "table" && (
            <TaskTableView
              tasks={filteredTasks}
              onSelectTask={(id) => setActiveTaskId(id)}
            />
          )}

          {viewMode === "priority" && (
            <TaskPriorityView
              tasks={filteredTasks}
              onSelectTask={(id) => setActiveTaskId(id)}
            />
          )}
        </div>
      </div>

      {/* Task Detail Modal */}
      {activeTaskId && (
        <TaskDetailModal
          taskId={activeTaskId}
          onClose={() => setActiveTaskId(null)}
          onSelectTask={(id) => setActiveTaskId(id)}
        />
      )}

      {/* Workflow Templates Modal */}
      <TaskTemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
      />

      {/* Statistics Modal */}
      <TaskStatisticsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
      />
    </div>
  );
}
