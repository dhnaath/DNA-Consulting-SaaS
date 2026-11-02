import { useMemo } from "react";
import { GitBranch } from "lucide-react";
import { Task } from "../types";

interface TaskTimelineViewProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
}

export function TaskTimelineView({ tasks, onSelectTask }: TaskTimelineViewProps) {
  // Sort tasks by start date or due date
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const aTime = a.startAt ? new Date(a.startAt).getTime() : a.dueAt ? new Date(a.dueAt).getTime() : 0;
      const bTime = b.startAt ? new Date(b.startAt).getTime() : b.dueAt ? new Date(b.dueAt).getTime() : 0;
      return aTime - bTime;
    });
  }, [tasks]);

  // Compute timeline boundaries: min date and max date across all scheduled tasks
  const { minTime, totalDays, datesHeader } = useMemo(() => {
    const validDates = tasks
      .flatMap((t) => [t.startAt, t.dueAt])
      .filter(Boolean)
      .map((d) => new Date(d!).getTime());

    const now = Date.now();
    const min = validDates.length > 0 ? Math.min(...validDates, now - 3 * 86400000) : now - 3 * 86400000;
    const max = validDates.length > 0 ? Math.max(...validDates, now + 14 * 86400000) : now + 14 * 86400000;

    const days = Math.ceil((max - min) / 86400000) + 2;

    const headers: Array<{ date: Date; isToday: boolean }> = [];
    const nowDateStr = new Date().toDateString();
    for (let i = 0; i < Math.min(days, 28); i++) {
      const d = new Date(min + i * 86400000);
      headers.push({ date: d, isToday: d.toDateString() === nowDateStr });
    }

    return { minTime: min, totalDays: Math.min(days, 28), datesHeader: headers };
  }, [tasks]);

  return (
    <div className="space-y-4">
      <div className="p-3 bg-muted/20 rounded-xl border border-border/50 text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="size-4 text-primary" />
          <span>
            <strong>Gantt Timeline View:</strong> Mengelompokkan berdasarkan rentang jadwal (startAt → dueAt) dan ketergantungan relasi (dependencies).
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" /> Dikerjakan
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" /> Selesai
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500" /> Urgent / Overdue
          </span>
        </div>
      </div>

      <div className="border border-border/70 rounded-2xl bg-card overflow-x-auto shadow-sm">
        <div className="min-w-[900px]">
          {/* Header Dates Bar */}
          <div className="flex border-b border-border/60 bg-muted/30 text-xs">
            <div className="w-64 p-3 font-semibold text-muted-foreground uppercase tracking-wider shrink-0 border-r border-border/50">
              Task & Dependensi
            </div>
            <div className="flex-1 grid" style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(36px, 1fr))` }}>
              {datesHeader.map((h, i) => (
                <div
                  key={i}
                  className={`text-center py-2 border-r border-border/30 text-[10px] ${
                    h.isToday ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  <div>{h.date.toLocaleDateString([], { weekday: "narrow" })}</div>
                  <div>{h.date.getDate()}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/40">
            {sortedTasks.map((task) => {
              const start = task.startAt ? new Date(task.startAt).getTime() : task.dueAt ? new Date(task.dueAt).getTime() - 86400000 : null;
              const due = task.dueAt ? new Date(task.dueAt).getTime() : start ? start + 86400000 : null;

              let startDayOffset = 0;
              let spanDays = 2;

              if (start && due) {
                startDayOffset = Math.max(0, Math.floor((start - minTime) / 86400000));
                spanDays = Math.max(1, Math.ceil((due - start) / 86400000));
              }

              const hasDeps = task.dependencies.length > 0;

              return (
                <div key={task.id} className="flex items-center hover:bg-muted/20 transition-colors group">
                  {/* Left Task Info */}
                  <div
                    onClick={() => onSelectTask(task.id)}
                    className="w-64 p-2.5 shrink-0 border-r border-border/50 cursor-pointer text-left space-y-0.5"
                  >
                    <div className="flex items-center gap-1.5">
                      {hasDeps && <GitBranch className="size-3 text-purple-500 shrink-0" />}
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate block">
                        {task.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                      <span className="capitalize">{task.status.replace("_", " ")}</span>
                      {task.duration && <span>• {task.duration}m</span>}
                    </div>
                  </div>

                  {/* Gantt Bar Lane */}
                  <div
                    className="flex-1 grid relative py-2"
                    style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(36px, 1fr))` }}
                  >
                    {start && due ? (
                      <div
                        onClick={() => onSelectTask(task.id)}
                        className={`absolute top-2 bottom-2 rounded-lg cursor-pointer px-2 flex items-center shadow-sm text-xs font-medium truncate transition-all hover:brightness-110 ${
                          task.status === "completed"
                            ? "bg-emerald-600 text-white"
                            : task.priority === "urgent"
                            ? "bg-rose-600 text-white"
                            : "bg-primary text-primary-foreground"
                        }`}
                        style={{
                          left: `${(startDayOffset / totalDays) * 100}%`,
                          width: `${Math.min(100 - (startDayOffset / totalDays) * 100, (spanDays / totalDays) * 100)}%`,
                          minWidth: "48px",
                        }}
                      >
                        <span className="truncate text-[10px]">{task.title}</span>
                      </div>
                    ) : (
                      <div className="px-3 text-[10px] text-muted-foreground italic">
                        Tanpa jadwal
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
