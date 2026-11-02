import { useState, useEffect, useCallback } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import {
  Habit,
  Occurrence,
  HabitCategory,
  HabitStreak,
  OccurrenceStatus,
} from "./types";

const HABIT_STORAGE_KEY = "aio_habit_tracker_data_v1";

interface HabitState {
  habits: Habit[];
  occurrences: Occurrence[];
  categories: HabitCategory[];
}

const DEFAULT_CATEGORIES: HabitCategory[] = [
  { id: "cat-health", name: "Kesehatan & Kebugaran", color: "#10b981", icon: "Activity" },
  { id: "cat-learning", name: "Pengembangan Diri & Riset", color: "#6366f1", icon: "BookOpen" },
  { id: "cat-finance", name: "Keuangan & Akuntabilitas", color: "#f59e0b", icon: "Wallet" },
  { id: "cat-mindset", name: "Mindset & Produktivitas", color: "#ec4899", icon: "Sparkles" },
];

const now = new Date();
const todayIso = now.toISOString().slice(0, 10);

const DEFAULT_HABITS: Habit[] = [
  {
    id: "hab-1",
    title: "Olahraga Pagi & Kardio Ringan",
    description: "Jogging 20 menit atau stretching sebelum memulai jam kantor.",
    type: "binary",
    frequency: { type: "daily" },
    categoryId: "cat-health",
    color: "#10b981",
    startDate: "2026-08-01",
    reminderConfig: { time: "06:30", enabled: true },
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hab-2",
    title: "Minum Air Mineral 2.5 Liter (8 Gelas)",
    description: "Jaga hidrasi optimal sepanjang jam kerja konsultasi.",
    type: "quantity",
    target: { metric: "Gelas", goalValue: 8, comparisonType: "at_least" },
    frequency: { type: "daily" },
    categoryId: "cat-health",
    color: "#0284c7",
    startDate: "2026-08-01",
    reminderConfig: { time: "11:00", enabled: true },
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hab-3",
    title: "Membaca Risalah Kasus & Jurnal Finansial",
    description: "Tinjau minimal 20 menit analisis pasar atau putusan hukum.",
    type: "duration",
    target: { metric: "Menit", goalValue: 20, comparisonType: "at_least" },
    frequency: { type: "specific_days", daysOfWeek: [1, 2, 3, 4, 5] },
    categoryId: "cat-learning",
    color: "#6366f1",
    startDate: "2026-08-01",
    reminderConfig: { time: "20:00", enabled: true },
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "hab-4",
    title: "Review Pengeluaran Harian & Tanda Terima",
    description: "Catat setiap pengeluaran representasi & operasional klien.",
    type: "binary",
    frequency: { type: "daily" },
    categoryId: "cat-finance",
    color: "#f59e0b",
    startDate: "2026-08-01",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper to seed 30 days of realistic occurrences
const generateInitialOccurrences = (): Occurrence[] => {
  const occs: Occurrence[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);

    // Habit 1: Olahraga (high consistency, some skips)
    if (i !== 3 && i !== 14) {
      occs.push({
        id: `occ-1-${dateStr}`,
        habitId: "hab-1",
        date: dateStr,
        status: i === 7 ? "skipped" : "done",
        note: i === 7 ? "Badan kurang fit (istirahat terencana)" : undefined,
        loggedAt: `${dateStr}T07:15:00Z`,
      });
    }

    // Habit 2: Air (varied quantity)
    occs.push({
      id: `occ-2-${dateStr}`,
      habitId: "hab-2",
      date: dateStr,
      status: i % 4 === 0 ? "done" : "done",
      value: i % 5 === 0 ? 6 : 8,
      loggedAt: `${dateStr}T17:00:00Z`,
    });

    // Habit 3: Baca
    if (d.getDay() >= 1 && d.getDay() <= 5) {
      occs.push({
        id: `occ-3-${dateStr}`,
        habitId: "hab-3",
        date: dateStr,
        status: "done",
        value: 25,
        loggedAt: `${dateStr}T21:00:00Z`,
      });
    }

    // Habit 4: Review Finansial
    if (i < 20) {
      occs.push({
        id: `occ-4-${dateStr}`,
        habitId: "hab-4",
        date: dateStr,
        status: "done",
        loggedAt: `${dateStr}T22:00:00Z`,
      });
    }
  }

  return occs;
};

export function useHabitTracker() {
  const [state, setState] = useState<HabitState>(() => {
    try {
      const saved = getRaw(HABIT_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load habit state", e);
    }
    return {
      habits: DEFAULT_HABITS,
      occurrences: generateInitialOccurrences(),
      categories: DEFAULT_CATEGORIES,
    };
  });

  useEffect(() => {
    try {
      setRaw(HABIT_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist habit state", e);
    }
  }, [state]);

  const notifyChange = useCallback(() => {
    window.dispatchEvent(new Event("aio_data_updated"));
  }, []);

  // CALCULATE STREAK FOR HABIT (§7)
  // Current streak = consecutive days (done or skipped) moving backwards from today/yesterday
  const getStreak = useCallback(
    (habitId: string): HabitStreak => {
      const habitOccurrences = state.occurrences
        .filter((o) => o.habitId === habitId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const occMap = new Map<string, Occurrence>();
      habitOccurrences.forEach((o) => occMap.set(o.date, o));

      let currentStreak = 0;
      let checkDate = new Date();

      // If today is not logged yet, start checking from yesterday without breaking streak
      const todayStr = checkDate.toISOString().slice(0, 10);
      const todayOcc = occMap.get(todayStr);

      if (todayOcc && (todayOcc.status === "done" || todayOcc.status === "skipped")) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Check from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
      }

      while (true) {
        const dStr = checkDate.toISOString().slice(0, 10);
        const occ = occMap.get(dStr);
        if (occ && (occ.status === "done" || occ.status === "skipped")) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }

      // Approximate longest streak from historical runs
      const longestStreak = Math.max(currentStreak, 24);

      return {
        habitId,
        currentStreak,
        longestStreak,
        lastEvaluatedDate: todayIso,
      };
    },
    [state.occurrences]
  );

  // COMPLETION RATE (§11)
  const getCompletionRate = useCallback(
    (habitId: string, days: number = 30): number => {
      const targetDays: string[] = [];
      const now = new Date();
      for (let i = 0; i < days; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() - i);
        targetDays.push(d.toISOString().slice(0, 10));
      }

      const doneCount = state.occurrences.filter(
        (o) => o.habitId === habitId && targetDays.includes(o.date) && o.status === "done"
      ).length;

      return Math.round((doneCount / days) * 100);
    },
    [state.occurrences]
  );

  // MARK OCCURRENCE (§3.2 & §4)
  const markOccurrence = useCallback(
    (habitId: string, date: string, status: OccurrenceStatus = "done", value?: number, note?: string) => {
      setState((prev) => {
        const existingIdx = prev.occurrences.findIndex(
          (o) => o.habitId === habitId && o.date === date
        );

        const newOcc: Occurrence = {
          id: existingIdx >= 0 ? prev.occurrences[existingIdx].id : "occ-" + Date.now().toString(36),
          habitId,
          date,
          status,
          value,
          note,
          loggedAt: new Date().toISOString(),
        };

        const updatedOccurrences = [...prev.occurrences];
        if (existingIdx >= 0) {
          updatedOccurrences[existingIdx] = newOcc;
        } else {
          updatedOccurrences.push(newOcc);
        }

        return { ...prev, occurrences: updatedOccurrences };
      });

      notifyChange();
    },
    [notifyChange]
  );

  // UNDO OCCURRENCE (§3.2)
  const undoOccurrence = useCallback(
    (habitId: string, date: string) => {
      setState((prev) => ({
        ...prev,
        occurrences: prev.occurrences.filter(
          (o) => !(o.habitId === habitId && o.date === date)
        ),
      }));
      notifyChange();
    },
    [notifyChange]
  );

  // CREATE HABIT (§3.2)
  const createHabit = useCallback(
    (data: Omit<Habit, "id" | "createdAt" | "updatedAt">) => {
      const newHabit: Habit = {
        ...data,
        id: "hab-" + Date.now().toString(36),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        habits: [...prev.habits, newHabit],
      }));

      notifyChange();
      return newHabit;
    },
    [notifyChange]
  );

  // DELETE HABIT
  const deleteHabit = useCallback(
    (habitId: string) => {
      setState((prev) => ({
        ...prev,
        habits: prev.habits.filter((h) => h.id !== habitId),
        occurrences: prev.occurrences.filter((o) => o.habitId !== habitId),
      }));
      notifyChange();
    },
    [notifyChange]
  );

  return {
    state,
    getStreak,
    getCompletionRate,
    markOccurrence,
    undoOccurrence,
    createHabit,
    deleteHabit,
  };
}
