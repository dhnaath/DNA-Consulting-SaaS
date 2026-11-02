import { useState } from "react";
import { motion } from "motion/react";
import { Droplet, Check } from "lucide-react";
import { cn } from "../lib/utils";
import confetti from "canvas-confetti";

export function HabitTracker() {
  // Generate 28 days of mock data for 4 weeks grid
  const [days, setDays] = useState(() => {
    const today = new Date();
    return Array.from({ length: 28 }).map((_, i) => {
      const isPast = i < 27; // Last day is "today"
      return {
        id: i,
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - (27 - i)),
        completed: isPast ? Math.random() > 0.4 : false, // Random past completion
        isToday: i === 27,
      };
    });
  });

  const handleDayClick = (index: number, event: React.MouseEvent) => {
    const newDays = [...days];
    const day = newDays[index];

    if (!day) return;

    if (day.isToday && !day.completed) {
      day.completed = true;
      setDays(newDays);

      // Fire confetti
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { x, y },
        colors: ["#3b82f6", "#60a5fa", "#93c5fd"], // Blue tones for water
        disableForReducedMotion: true,
      });
    } else if (!day.isToday) {
      // Toggle past days for demo purposes
      day.completed = !day.completed;
      setDays(newDays);
    } else if (day.isToday && day.completed) {
      day.completed = false;
      setDays(newDays);
    }
  };

  const completedCount = days.filter((d) => d.completed).length;

  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
            <Droplet size={14} className="fill-current" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-[13px] leading-tight">Drink Water</h3>
            <p className="text-[10px] text-muted-foreground font-medium">8 glasses / day</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[13px] font-bold text-foreground">
            {completedCount}
            <span className="text-muted-foreground text-[10px] font-normal"> / 28</span>
          </div>
          <p className="text-[10px] text-emerald-500 font-semibold flex items-center justify-end mt-0.5">
            <Check size={10} className="mr-0.5" /> 3d streak
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1.5 mt-2">
        {/* Days of week header */}
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <div
            key={`header-${i}`}
            className="text-[9px] font-bold text-muted-foreground text-center mb-0.5"
          >
            {d}
          </div>
        ))}

        {/* Days grid */}
        {days.map((day, i) => (
          <motion.button
            key={day.id}
            whileTap={{ scale: 0.85 }}
            onClick={(e) => handleDayClick(i, e)}
            className={cn(
              "aspect-square rounded-[4px] relative transition-colors duration-300",
              day.completed ? "bg-blue-500 shadow-sm" : "bg-muted hover:bg-accent",
              day.isToday &&
                !day.completed &&
                "ring-2 ring-blue-500/40 ring-offset-1 bg-background border border-blue-200",
            )}
            title={day.date.toDateString()}
          >
            {day.isToday && !day.completed && (
              <span className="absolute inset-0 m-auto w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
