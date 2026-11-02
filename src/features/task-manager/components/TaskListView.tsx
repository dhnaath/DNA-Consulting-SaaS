import {
  Clock,
  CheckCircle2,
  CornerDownRight,
  FolderOpen,
  CheckSquare,
  Square,
} from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "../types";
import { useTaskManager } from "../store";

interface TaskListViewProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  selectedIds: string[];
  onToggleSelect: (taskId: string) => void;
  onSelectAll: () => void;
}

export function TaskListView({
  tasks,
  onSelectTask,
  selectedIds,
  onToggleSelect,
  onSelectAll,
}: TaskListViewProps) {
  const { completeTask, reopenTask, getSubtaskProgress, projects, tags } = useTaskManager();

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case "urgent":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">URGENT</span>;
      case "high":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">HIGH</span>;
      case "medium":
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400">MED</span>;
      case "low":
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">LOW</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (s: TaskStatus) => {
    switch (s) {
      case "inbox":
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted-foreground/30/10 text-muted-foreground">Inbox</span>;
      case "planned":
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">Planned</span>;
      case "in_progress":
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">In Progress</span>;
      case "waiting":
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500">Waiting</span>;
      case "completed":
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">Completed</span>;
      case "cancelled":
        return <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500">Cancelled</span>;
      default:
        return null;
    }
  };

  const isOverdue = (dueAt?: string, status?: TaskStatus) => {
    if (!dueAt || status === "completed" || status === "cancelled" || status === "archived") return false;
    return new Date(dueAt).getTime() < Date.now();
  };

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border/70 rounded-2xl bg-card/40 my-4">
        <CheckCircle2 className="size-10 text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-semibold text-foreground">Tidak Ada Task</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          Semua task telah terselesaikan atau tidak ada tugas yang cocok dengan filter saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Table Header Row */}
      <div className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/50">
        <div className="flex items-center gap-3">
          <button
            onClick={onSelectAll}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {selectedIds.length > 0 && selectedIds.length === tasks.length ? (
              <CheckSquare className="size-4 text-primary" />
            ) : (
              <Square className="size-4" />
            )}
          </button>
          <span>Judul Task & Deskripsi</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden sm:inline">Proyek</span>
          <span className="hidden md:inline">Batas Waktu</span>
          <span>Prioritas</span>
        </div>
      </div>

      {/* Task List Items */}
      <div className="space-y-1.5">
        {tasks.map((task) => {
          const isSelected = selectedIds.includes(task.id);
          const overdue = isOverdue(task.dueAt, task.status);
          const progress = getSubtaskProgress(task.id);
          const project = projects.find((p) => p.id === task.projectId);

          return (
            <div
              key={task.id}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer group ${
                isSelected
                  ? "bg-primary/5 border-primary/40 shadow-sm"
                  : "bg-card border-border/60 hover:border-border hover:bg-muted/30"
              }`}
              onClick={(e) => {
                // If clicked on action buttons, don't open modal
                const target = e.target as HTMLElement;
                if (target.closest("button") || target.closest("input")) return;
                onSelectTask(task.id);
              }}
            >
              {/* Left Column: Checkbox, Title, Subtask progress, Badges */}
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(task.id)}
                  className="rounded border-border text-primary focus:ring-primary size-4 cursor-pointer"
                  title="Pilih task untuk bulk edit"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (task.status === "completed") {
                      reopenTask(task.id);
                    } else {
                      completeTask(task.id);
                    }
                  }}
                  className="text-muted-foreground hover:text-emerald-500 transition-colors shrink-0"
                  title={task.status === "completed" ? "Buka kembali task" : "Tandai selesai"}
                >
                  <CheckCircle2
                    className={`size-5 ${
                      task.status === "completed"
                        ? "text-emerald-500 fill-emerald-500/20"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  />
                </button>

                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium truncate ${
                        task.status === "completed"
                          ? "line-through text-muted-foreground"
                          : "text-foreground group-hover:text-primary transition-colors"
                      }`}
                    >
                      {task.title}
                    </span>
                    {getStatusBadge(task.status)}
                  </div>

                  {/* Secondary info line: subtask badge, checklist badge, tags */}
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                    {progress.total > 0 && (
                      <span className="flex items-center gap-1 text-primary font-medium bg-primary/10 px-1.5 py-0.2 rounded">
                        <CornerDownRight className="size-3" />
                        {progress.completed}/{progress.total} Subtask
                      </span>
                    )}

                    {task.checklist.length > 0 && (
                      <span className="bg-muted px-1.5 py-0.2 rounded">
                        {task.checklist.filter((c) => c.checked).length}/{task.checklist.length} Checklist
                      </span>
                    )}

                    {task.tags.map((tId) => {
                      const tg = tags.find((t) => t.id === tId);
                      return tg ? (
                        <span
                          key={tg.id}
                          className="px-1.5 py-0.2 rounded text-[10px] font-medium border"
                          style={{
                            borderColor: `${tg.color}40`,
                            backgroundColor: `${tg.color}15`,
                            color: tg.color,
                          }}
                        >
                          {tg.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Project, Due Date, Priority */}
              <div className="flex items-center gap-4 shrink-0 text-xs">
                {project && (
                  <span className="hidden sm:flex items-center gap-1 text-muted-foreground bg-muted/60 px-2 py-1 rounded-md max-w-[130px] truncate">
                    <FolderOpen className="size-3 shrink-0 text-primary" />
                    <span className="truncate">{project.name}</span>
                  </span>
                )}

                {task.dueAt && (
                  <span
                    className={`hidden md:flex items-center gap-1 font-medium ${
                      overdue ? "text-rose-600 dark:text-rose-400 font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    <Clock className="size-3" />
                    {new Date(task.dueAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}

                <div>{getPriorityBadge(task.priority)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
