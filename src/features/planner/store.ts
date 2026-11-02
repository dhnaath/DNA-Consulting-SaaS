import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TimeBlock,
  DailyPlan,
  Ritual,
  Carryover,
  Capacity,
  WorkQueueItem,
} from "./types";
import { Task } from "../task-manager/types";
import { CalendarEvent } from "../calendar/types";
import { getRaw, setRaw } from "../../core/rawStorage";

const PLANNER_STORAGE_KEY = "aio_planner_data_v1";
const TASK_STORAGE_KEY = "aio_task_manager_data_v1";
const CALENDAR_STORAGE_KEY = "aio_calendar_data_v1";

interface PlannerState {
  timeBlocks: TimeBlock[];
  dailyPlans: Record<string, DailyPlan>; // keyed by YYYY-MM-DD
  rituals: Ritual[];
  carryovers: Carryover[];
}

const DEFAULT_RITUALS: Ritual[] = [
  {
    id: "rit-1",
    title: "Olahraga Pagi & Mobilitas Fisik",
    recurrence: { type: "weekday" },
    preferredStartTime: "07:30",
    duration: 45,
    isFixed: true,
  },
  {
    id: "rit-2",
    title: "Daily Standup & Triage Inbox",
    recurrence: { type: "weekday" },
    preferredStartTime: "09:00",
    duration: 30,
    isFixed: true,
  },
  {
    id: "rit-3",
    title: "Review Akhir Hari & Tinjauan Esok",
    recurrence: { type: "weekday" },
    preferredStartTime: "17:00",
    duration: 30,
    isFixed: false,
  },
];

const getTodayStr = () => new Date().toISOString().slice(0, 10);


const DEFAULT_TIMEBLOCKS: TimeBlock[] = [
  {
    id: "tb-1",
    sourceType: "ritual",
    sourceId: "rit-2",
    title: "Daily Standup & Triage Inbox",
    startAt: `${getTodayStr()}T09:00:00`,
    endAt: `${getTodayStr()}T09:30:00`,
    status: "done",
    dayPlanId: getTodayStr(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tb-2",
    sourceType: "task",
    sourceId: "task-seed-1",
    title: "Penyusunan Risalah Opini Hukum Klien",
    startAt: `${getTodayStr()}T10:00:00`,
    endAt: `${getTodayStr()}T12:00:00`,
    status: "in_progress",
    dayPlanId: getTodayStr(),
    syncCompletion: true,
    notes: "Fokus mendalam tanpa distraksi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "tb-3",
    sourceType: "task",
    sourceId: "task-seed-2",
    title: "Audit Kertas Kerja & Verifikasi Bukti Transaksi",
    startAt: `${getTodayStr()}T13:30:00`,
    endAt: `${getTodayStr()}T15:30:00`,
    status: "planned",
    dayPlanId: getTodayStr(),
    syncCompletion: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function usePlanner() {
  const [state, setState] = useState<PlannerState>(() => {
    try {
      const saved = getRaw(PLANNER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load planner state", e);
    }
    return {
      timeBlocks: DEFAULT_TIMEBLOCKS,
      dailyPlans: {
        [getTodayStr()]: {
          id: `dp-${getTodayStr()}`,
          date: getTodayStr(),
          timeBlocks: DEFAULT_TIMEBLOCKS.map((t) => t.id),
          capacity: {
            date: getTodayStr(),
            availableMinutes: 480,
            allocatedMinutes: 270,
            remainingMinutes: 210,
          },
          status: "committed",
        },
      },
      rituals: DEFAULT_RITUALS,
      carryovers: [],
    };
  });

  // External Tasks from Task Manager (#01)
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = getRaw(TASK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.tasks || [];
      }
    } catch (e) {
      console.error("Failed to load tasks for planner", e);
    }
    return [];
  });

  // External Events from Calendar (#02) for Capacity constraints
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    try {
      const raw = getRaw(CALENDAR_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.events || [];
      }
    } catch (e) {
      console.error("Failed to load calendar events for planner", e);
    }
    return [];
  });

  // Save planner state
  useEffect(() => {
    try {
      setRaw(PLANNER_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist planner state", e);
    }
  }, [state]);

  // Sync external stores on storage change or custom events
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const tRaw = getRaw(TASK_STORAGE_KEY);
        if (tRaw) {
          const tParsed = JSON.parse(tRaw);
          if (tParsed.tasks) setTasks(tParsed.tasks);
        }
        const cRaw = getRaw(CALENDAR_STORAGE_KEY);
        if (cRaw) {
          const cParsed = JSON.parse(cRaw);
          if (cParsed.events) setCalendarEvents(cParsed.events);
        }
      } catch (e) {
        console.error("Error reading external storage in planner", e);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("aio_data_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("aio_data_updated", handleStorageChange);
    };
  }, []);

  const notifyChange = useCallback(() => {
    window.dispatchEvent(new Event("aio_data_updated"));
  }, []);

  // WORKQUEUE (§5):
  // Filter Task Manager tasks that are active (status != completed/archived)
  // and haven't been allocated to a TimeBlock today
  const workQueue = useMemo<WorkQueueItem[]>(() => {
    const allocatedTaskIds = new Set(
      state.timeBlocks
        .filter((tb) => tb.sourceType === "task" && tb.sourceId)
        .map((tb) => tb.sourceId!)
    );

    return tasks
      .filter((t) => t.status !== "completed" && t.status !== "archived")
      .map((t) => {
        const isAllocated = allocatedTaskIds.has(t.id);
        const estDuration = t.duration || 60; // default 60 min if unspecified
        return {
          sourceType: "task" as const,
          sourceId: t.id,
          title: t.title,
          priority: t.priority || "medium",
          dueAt: t.dueAt,
          estimatedDuration: estDuration,
          suggestedSlot: isAllocated ? "Sudah Dialokasikan" : undefined,
        };
      });
  }, [tasks, state.timeBlocks]);

  // CAPACITY CALCULATION (§4):
  // Working hours = 09:00 - 17:00 (480 minutes)
  // Minus confirmed calendar events on target date
  // Minus allocated TimeBlocks duration
  const getCapacityForDate = useCallback(
    (dateStr: string): Capacity => {
      const BASE_WORK_MINUTES = 480; // 8 hours (09:00 - 17:00)

      // Calculate minutes occupied by confirmed Calendar events on this date
      let calendarBusyMinutes = 0;
      calendarEvents.forEach((ev) => {
        if (ev.status === "cancelled" || ev.allDay) return;
        if (ev.startAt.slice(0, 10) === dateStr) {
          const s = new Date(ev.startAt).getTime();
          const e = new Date(ev.endAt).getTime();
          const duration = Math.max(0, Math.round((e - s) / 60000));
          calendarBusyMinutes += duration;
        }
      });

      const availableMinutes = Math.max(0, BASE_WORK_MINUTES - calendarBusyMinutes);

      // Sum TimeBlocks allocated for this day
      let allocatedMinutes = 0;
      state.timeBlocks.forEach((tb) => {
        if (tb.startAt.slice(0, 10) === dateStr && tb.status !== "skipped") {
          const s = new Date(tb.startAt).getTime();
          const e = new Date(tb.endAt).getTime();
          const duration = Math.max(0, Math.round((e - s) / 60000));
          allocatedMinutes += duration;
        }
      });

      const remainingMinutes = availableMinutes - allocatedMinutes;

      return {
        date: dateStr,
        availableMinutes,
        allocatedMinutes,
        remainingMinutes,
      };
    },
    [calendarEvents, state.timeBlocks]
  );

  // CREATE TIMEBLOCK (§3.2)
  const createTimeBlock = useCallback(
    (data: {
      sourceType: TimeBlock["sourceType"];
      sourceId?: string;
      title: string;
      startAt: string;
      endAt: string;
      notes?: string;
      syncCompletion?: boolean;
    }) => {
      const dateStr = data.startAt.slice(0, 10);
      const newBlock: TimeBlock = {
        id: "tb-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5),
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        title: data.title.trim(),
        startAt: data.startAt,
        endAt: data.endAt,
        status: "planned",
        dayPlanId: dateStr,
        notes: data.notes?.trim(),
        syncCompletion: data.syncCompletion ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        timeBlocks: [...prev.timeBlocks, newBlock],
      }));

      notifyChange();
      return newBlock;
    },
    [notifyChange]
  );

  // UPDATE / MOVE / RESIZE TIMEBLOCK (§3.2)
  const updateTimeBlock = useCallback(
    (id: string, updates: Partial<TimeBlock>) => {
      setState((prev) => {
        const existing = prev.timeBlocks.find((tb) => tb.id === id);
        if (!existing) return prev;

        // Sync completion logic (§3.3)
        // If syncCompletion: true and status changed to "done", update original Task in Task Manager
        if (
          updates.status === "done" &&
          existing.status !== "done" &&
          existing.syncCompletion &&
          existing.sourceType === "task" &&
          existing.sourceId
        ) {
          try {
            const raw = getRaw(TASK_STORAGE_KEY);
            if (raw) {
              const parsed = JSON.parse(raw);
              parsed.tasks = (parsed.tasks || []).map((t: Task) =>
                t.id === existing.sourceId ? { ...t, status: "completed", updatedAt: new Date().toISOString() } : t
              );
              setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
              setTasks(parsed.tasks);
            }
          } catch (e) {
            console.error("Failed to sync completed status back to task", e);
          }
        }

        const updatedList = prev.timeBlocks.map((tb) =>
          tb.id === id
            ? { ...tb, ...updates, updatedAt: new Date().toISOString() }
            : tb
        );

        return { ...prev, timeBlocks: updatedList };
      });

      notifyChange();
    },
    [notifyChange]
  );

  // DELETE TIMEBLOCK
  const deleteTimeBlock = useCallback(
    (id: string) => {
      setState((prev) => ({
        ...prev,
        timeBlocks: prev.timeBlocks.filter((tb) => tb.id !== id),
      }));
      notifyChange();
    },
    [notifyChange]
  );

  // CARRYOVER TO NEXT DAY (§8)
  const carryoverTimeBlock = useCallback(
    (block: TimeBlock, targetDateStr: string, reason: Carryover["reason"] = "not_started") => {
      // Calculate target start & end preserving duration
      const origStart = new Date(block.startAt);
      const origEnd = new Date(block.endAt);
      const durationMs = origEnd.getTime() - origStart.getTime();

      const newStart = new Date(`${targetDateStr}T${origStart.toTimeString().slice(0, 5)}:00`);
      const newEnd = new Date(newStart.getTime() + durationMs);

      const newCarryover: Carryover = {
        id: "co-" + Date.now().toString(36),
        originalTimeBlockId: block.id,
        title: block.title,
        fromDate: block.startAt.slice(0, 10),
        toDate: targetDateStr,
        reason,
      };

      // Mark original as carried_over and create new TimeBlock for tomorrow
      const newBlock: TimeBlock = {
        id: "tb-" + Date.now().toString(36),
        sourceType: block.sourceType,
        sourceId: block.sourceId,
        title: block.title,
        startAt: newStart.toISOString(),
        endAt: newEnd.toISOString(),
        status: "planned",
        dayPlanId: targetDateStr,
        notes: `Carryover dari ${block.startAt.slice(0, 10)} (${reason})`,
        syncCompletion: block.syncCompletion,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        timeBlocks: [
          ...prev.timeBlocks.map((tb) =>
            tb.id === block.id ? { ...tb, status: "carried_over" as const } : tb
          ),
          newBlock,
        ],
        carryovers: [newCarryover, ...prev.carryovers],
      }));

      notifyChange();
    },
    [notifyChange]
  );

  // COMMIT DAILY PLAN (§7)
  const commitDailyPlan = useCallback((dateStr: string) => {
    setState((prev) => {
      const cap = getCapacityForDate(dateStr);
      const existing = prev.dailyPlans[dateStr];
      const todayBlocks = prev.timeBlocks.filter((tb) => tb.startAt.slice(0, 10) === dateStr);

      const updatedPlan: DailyPlan = {
        id: existing?.id || `dp-${dateStr}`,
        date: dateStr,
        timeBlocks: todayBlocks.map((b) => b.id),
        capacity: cap,
        status: "committed",
      };

      return {
        ...prev,
        dailyPlans: {
          ...prev.dailyPlans,
          [dateStr]: updatedPlan,
        },
      };
    });
    notifyChange();
  }, [getCapacityForDate, notifyChange]);

  // AUTO-PLANNING ALGORITHM (§10 - Rule-based Deterministic)
  // 1. Place all Rituals (isFixed)
  // 2. Sort WorkQueue: overdue > priority > dueAt
  // 3. Fill sequential empty slots until available minutes exhausted
  const runAutoPlanning = useCallback(
    (targetDateStr: string) => {
      const cap = getCapacityForDate(targetDateStr);
      let remainingAvailableMinutes = cap.availableMinutes;

      const newBlocks: TimeBlock[] = [];

      // 1. Place fixed rituals if not already scheduled
      state.rituals
        .filter((r) => r.isFixed)
        .forEach((r) => {
          const alreadyExists = state.timeBlocks.some(
            (tb) => tb.sourceId === r.id && tb.startAt.slice(0, 10) === targetDateStr
          );
          if (!alreadyExists) {
            const startD = new Date(`${targetDateStr}T${r.preferredStartTime}:00`);
            const endD = new Date(startD.getTime() + r.duration * 60000);
            newBlocks.push({
              id: "tb-auto-" + Math.random().toString(36).substring(2, 7),
              sourceType: "ritual",
              sourceId: r.id,
              title: r.title,
              startAt: startD.toISOString(),
              endAt: endD.toISOString(),
              status: "planned",
              dayPlanId: targetDateStr,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            remainingAvailableMinutes -= r.duration;
          }
        });

      // 2. Sort unallocated WorkQueue items
      const priorityWeight: Record<string, number> = {
        urgent: 4,
        high: 3,
        medium: 2,
        low: 1,
        none: 0,
      };

      const sortedWorkQueue = [...workQueue].sort((a, b) => {
        // Priority
        const pa = priorityWeight[a.priority] || 0;
        const pb = priorityWeight[b.priority] || 0;
        if (pa !== pb) return pb - pa;
        // DueAt
        if (a.dueAt && b.dueAt) return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();
        if (a.dueAt) return -1;
        if (b.dueAt) return 1;
        return 0;
      });

      // 3. Fill sequential slots starting from 09:30 AM
      let currentSlotHour = 9;
      let currentSlotMinute = 30;

      for (const item of sortedWorkQueue) {
        if (item.suggestedSlot === "Sudah Dialokasikan") continue;
        if (remainingAvailableMinutes < 30) break; // capacity exhausted

        const duration = Math.min(item.estimatedDuration, remainingAvailableMinutes);
        const startIso = `${targetDateStr}T${String(currentSlotHour).padStart(2, "0")}:${String(currentSlotMinute).padStart(2, "0")}:00`;
        const startD = new Date(startIso);
        const endD = new Date(startD.getTime() + duration * 60000);

        newBlocks.push({
          id: "tb-auto-" + Math.random().toString(36).substring(2, 7),
          sourceType: item.sourceType,
          sourceId: item.sourceId,
          title: item.title,
          startAt: startD.toISOString(),
          endAt: endD.toISOString(),
          status: "planned",
          dayPlanId: targetDateStr,
          syncCompletion: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

        remainingAvailableMinutes -= duration;

        // Advance slot
        const nextTime = new Date(endD.getTime() + 15 * 60000); // 15 min buffer
        currentSlotHour = nextTime.getHours();
        currentSlotMinute = nextTime.getMinutes();
        if (currentSlotHour >= 17) break;
      }

      setState((prev) => ({
        ...prev,
        timeBlocks: [...prev.timeBlocks, ...newBlocks],
      }));

      notifyChange();
      return newBlocks.length;
    },
    [getCapacityForDate, state.rituals, state.timeBlocks, workQueue, notifyChange]
  );

  return {
    state,
    workQueue,
    getCapacityForDate,
    createTimeBlock,
    updateTimeBlock,
    deleteTimeBlock,
    carryoverTimeBlock,
    commitDailyPlan,
    runAutoPlanning,
  };
}
