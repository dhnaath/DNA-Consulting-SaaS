import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Task } from "../types";

interface TaskCalendarViewProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
}

export function TaskCalendarView({ tasks, onSelectTask }: TaskCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sun

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Group tasks by date string YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    const map = new Map<string, Task[]>();
    tasks.forEach((task) => {
      const dateStr = task.dueAt || task.startAt;
      if (dateStr) {
        const d = new Date(dateStr);
        if (!isNaN(d.getTime())) {
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
          ).padStart(2, "0")}`;
          if (!map.has(key)) map.set(key, []);
          map.get(key)!.push(task);
        }
      }
    });
    return map;
  }, [tasks]);

  const now = new Date();
  const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

  return (
    <div className="space-y-4">
      {/* Calendar Header Controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-foreground">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={handleToday}
            className="text-xs px-2.5 py-1 rounded-md bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
          >
            Hari Ini
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-muted-foreground uppercase py-1 border-b border-border/50">
        <div>Min</div>
        <div>Sen</div>
        <div>Sel</div>
        <div>Rab</div>
        <div>Kam</div>
        <div>Jum</div>
        <div>Sab</div>
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Leading empty days */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="min-h-[100px] rounded-xl border border-transparent bg-muted/10 opacity-30 p-2"
          />
        ))}

        {/* Days in Month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(
            2,
            "0"
          )}`;
          const isToday = dayKey === todayKey;
          const dayTasks = tasksByDate.get(dayKey) || [];

          return (
            <div
              key={`day-${dayNum}`}
              className={`min-h-[105px] rounded-xl border p-2 flex flex-col justify-between transition-all ${
                isToday
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "bg-card border-border/60 hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold size-5 flex items-center justify-center rounded-full ${
                    isToday ? "bg-primary text-white" : "text-muted-foreground"
                  }`}
                >
                  {dayNum}
                </span>
                {dayTasks.length > 0 && (
                  <span className="text-[10px] text-muted-foreground font-semibold">
                    {dayTasks.length} task
                  </span>
                )}
              </div>

              {/* Day's Tasks */}
              <div className="space-y-1 overflow-y-auto max-h-[80px]">
                {dayTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onSelectTask(t.id)}
                    className={`w-full text-left p-1 rounded text-[10px] font-medium truncate transition-colors block ${
                      t.status === "completed"
                        ? "line-through bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : t.priority === "urgent"
                        ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                    title={t.title}
                  >
                    {t.title}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
