import { useMemo } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Task } from "../types";

interface TaskPriorityViewProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
}

export function TaskPriorityView({ tasks, onSelectTask }: TaskPriorityViewProps) {
  const activeTasks = useMemo(() => tasks.filter((t) => t.status !== "completed" && t.status !== "archived"), [tasks]);

  // Quadrants logic
  const now = Date.now();
  const threeDaysFromNow = now + 3 * 86400000;

  const isUrgentTiming = (t: Task) => {
    if (t.priority === "urgent") return true;
    if (t.dueAt && new Date(t.dueAt).getTime() <= threeDaysFromNow) return true;
    return false;
  };

  const isImportantPriority = (t: Task) => {
    return t.priority === "high" || t.priority === "urgent";
  };

  const q1 = useMemo(
    () => activeTasks.filter((t) => isUrgentTiming(t) && isImportantPriority(t)),
    [activeTasks]
  );
  const q2 = useMemo(
    () => activeTasks.filter((t) => !isUrgentTiming(t) && isImportantPriority(t)),
    [activeTasks]
  );
  const q3 = useMemo(
    () => activeTasks.filter((t) => isUrgentTiming(t) && !isImportantPriority(t)),
    [activeTasks]
  );
  const q4 = useMemo(
    () => activeTasks.filter((t) => !isUrgentTiming(t) && !isImportantPriority(t)),
    [activeTasks]
  );

  return (
    <div className="space-y-4">
      {/* Eisenhower Matrix Header Guide */}
      <div className="p-3 bg-muted/20 border border-border/50 rounded-xl text-xs text-muted-foreground flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-amber-500" />
          <span>
            <strong>Eisenhower Matrix (Prioritas & Urgensi):</strong> Berdasarkan field <code>priority</code> dan batas waktu <code>dueAt</code> untuk pengelompokan keputusan eksekutif.
          </span>
        </div>
      </div>

      {/* 2x2 Quadrant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Q1: Do First (Urgent & Important) */}
        <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/5 p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                Kuadran 1 • Kerjakan Segera (Do First)
              </span>
              <h3 className="text-sm font-bold text-foreground mt-1">
                Mendesak & Sangat Penting
              </h3>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-500/20 px-2 py-0.5 rounded-full">
              {q1.length}
            </span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-72 pr-1">
            {q1.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t.id)}
                className="p-3 rounded-xl bg-card border border-rose-500/20 hover:border-rose-500 hover:shadow-sm transition-all cursor-pointer text-left space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate block">
                    {t.title}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-rose-600 bg-rose-500/10 px-1.5 py-0.2 rounded">
                    {t.priority}
                  </span>
                </div>
                {t.dueAt && (
                  <div className="text-[10px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                    <Clock className="size-2.5" />
                    Due: {new Date(t.dueAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
            {q1.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground/60 italic">
                Tidak ada krisis mendesak
              </p>
            )}
          </div>
        </div>

        {/* Q2: Schedule (Not Urgent but Important) */}
        <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                Kuadran 2 • Jadwalkan (Schedule)
              </span>
              <h3 className="text-sm font-bold text-foreground mt-1">
                Penting, Waktu Masih Fleksibel
              </h3>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-500/20 px-2 py-0.5 rounded-full">
              {q2.length}
            </span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-72 pr-1">
            {q2.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t.id)}
                className="p-3 rounded-xl bg-card border border-blue-500/20 hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer text-left space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate block">
                    {t.title}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-blue-600 bg-blue-500/10 px-1.5 py-0.2 rounded">
                    {t.priority}
                  </span>
                </div>
                {t.dueAt && (
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-2.5" />
                    Due: {new Date(t.dueAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
            {q2.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground/60 italic">
                Kosong
              </p>
            )}
          </div>
        </div>

        {/* Q3: Delegate (Urgent but Less Important) */}
        <div className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Kuadran 3 • Delegasikan (Delegate)
              </span>
              <h3 className="text-sm font-bold text-foreground mt-1">
                Mendesak, Nilai Strategis Rendah
              </h3>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-500/20 px-2 py-0.5 rounded-full">
              {q3.length}
            </span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-72 pr-1">
            {q3.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t.id)}
                className="p-3 rounded-xl bg-card border border-amber-500/20 hover:border-amber-500 hover:shadow-sm transition-all cursor-pointer text-left space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate block">
                    {t.title}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.2 rounded">
                    {t.priority}
                  </span>
                </div>
                {t.dueAt && (
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-2.5" />
                    Due: {new Date(t.dueAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
            {q3.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground/60 italic">
                Kosong
              </p>
            )}
          </div>
        </div>

        {/* Q4: Eliminate / Backlog (Not Urgent & Not Important) */}
        <div className="rounded-2xl border-2 border-border/30 bg-muted-foreground/30/5 p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground dark:text-muted-foreground bg-muted-foreground/30/10 px-2 py-0.5 rounded">
                Kuadran 4 • Evaluasi / Eliminasi (Don&apos;t Do)
              </span>
              <h3 className="text-sm font-bold text-foreground mt-1">
                Rendah / Backlog Rutin
              </h3>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-muted-foreground/30/20 px-2 py-0.5 rounded-full">
              {q4.length}
            </span>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto max-h-72 pr-1">
            {q4.map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t.id)}
                className="p-3 rounded-xl bg-card border border-border/20 hover:border-border hover:shadow-sm transition-all cursor-pointer text-left space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate block">
                    {t.title}
                  </span>
                  <span className="text-[9px] uppercase font-bold text-muted-foreground bg-muted-foreground/30/10 px-1.5 py-0.2 rounded">
                    {t.priority}
                  </span>
                </div>
                {t.dueAt && (
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="size-2.5" />
                    Due: {new Date(t.dueAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
            {q4.length === 0 && (
              <p className="text-center py-6 text-xs text-muted-foreground/60 italic">
                Kosong
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
