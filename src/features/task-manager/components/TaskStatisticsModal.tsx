import { X, BarChart3, CheckCircle2, Clock, AlertTriangle, ListTodo } from "lucide-react";
import { useTaskManager } from "../store";

interface TaskStatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskStatisticsModal({ isOpen, onClose }: TaskStatisticsModalProps) {
  const { statistics, projects } = useTaskManager();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="size-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-foreground">
                Statistik & Metrik Task Manager
              </h3>
              <p className="text-xs text-muted-foreground">
                Kompilasi deterministik dari data Task + Activity (Elaborasi Spesifikasi #17).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-1">
            <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
              <ListTodo className="size-3.5 text-primary" /> Total Task
            </span>
            <div className="text-2xl font-black text-foreground">{statistics.total}</div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" /> Selesai
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {statistics.completed}
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 space-y-1">
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Clock className="size-3.5 text-blue-500" /> Completion Rate
            </span>
            <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
              {statistics.completionRate}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1">
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="size-3.5 text-rose-500" /> Overdue
            </span>
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {statistics.overdue}
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Distribusi Task Berdasarkan Prioritas
          </h4>
          <div className="space-y-2">
            {[
              { label: "Urgent", count: statistics.byPriority.urgent, color: "bg-rose-600" },
              { label: "High", count: statistics.byPriority.high, color: "bg-amber-500" },
              { label: "Medium", count: statistics.byPriority.medium, color: "bg-blue-500" },
              { label: "Low", count: statistics.byPriority.low, color: "bg-emerald-500" },
              { label: "None", count: statistics.byPriority.none, color: "bg-border" },
            ].map((p) => {
              const pct = statistics.total > 0 ? Math.round((p.count / statistics.total) * 100) : 0;
              return (
                <div key={p.label} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground font-medium">
                    <span>{p.label}</span>
                    <span>
                      {p.count} task ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${p.color} transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Breakdown */}
        <div className="space-y-3 bg-muted/20 p-4 rounded-xl border border-border/50">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
            Task Berdasarkan Proyek
          </h4>
          <div className="space-y-2 text-xs">
            {projects.map((proj) => {
              const count = statistics.byProject[proj.id] || 0;
              const pct = statistics.total > 0 ? Math.round((count / statistics.total) * 100) : 0;
              return (
                <div key={proj.id} className="space-y-1">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span className="font-semibold text-foreground truncate max-w-xs">
                      {proj.name}
                    </span>
                    <span>
                      {count} task ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-muted hover:bg-muted/80 text-foreground transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
