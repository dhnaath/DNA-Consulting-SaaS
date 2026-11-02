import { useState, useEffect, useCallback, useMemo } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import {
  FocusSession,
  SessionConfig,
  FocusMode,
  LinkedItem,
  Interruption,
} from "./types";
import { Task } from "../task-manager/types";

const FOCUS_STORAGE_KEY = "aio_focus_timer_data_v1";
const TASK_STORAGE_KEY = "aio_task_manager_data_v1";

interface FocusTimerState {
  sessions: FocusSession[];
  activeSessionId: string | null;
  configs: SessionConfig[];
}

const DEFAULT_CONFIGS: SessionConfig[] = [
  {
    id: "cfg-pomodoro",
    name: "Pomodoro Klasik (25/5)",
    mode: "pomodoro",
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    cyclesBeforeLongBreak: 4,
    autoStartNext: false,
  },
  {
    id: "cfg-deepwork",
    name: "Deep Work (90 menit)",
    mode: "deep_work",
    workDuration: 90,
    breakDuration: 15,
    longBreakDuration: 30,
    cyclesBeforeLongBreak: 2,
    autoStartNext: false,
  },
  {
    id: "cfg-short",
    name: "Quick Sprint (15 menit)",
    mode: "countdown",
    workDuration: 15,
    breakDuration: 3,
    longBreakDuration: 10,
    cyclesBeforeLongBreak: 3,
    autoStartNext: false,
  },
];

const DEFAULT_SESSIONS: FocusSession[] = [
  {
    id: "sess-seed-1",
    mode: "deep_work",
    startedAt: new Date(Date.now() - 120 * 60000).toISOString(),
    endedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    plannedDuration: 5400, // 90 min
    actualDuration: 5100, // 85 min (after 1 interruption)
    linkedItem: {
      sourceType: "task",
      sourceId: "task-seed-1",
      title: "Penyusunan Risalah Opini Hukum Klien",
    },
    status: "completed",
    intervals: [],
    interruptions: [
      {
        id: "int-1",
        sessionId: "sess-seed-1",
        startedAt: new Date(Date.now() - 75 * 60000).toISOString(),
        endedAt: new Date(Date.now() - 70 * 60000).toISOString(),
        reason: "Panggilan telepon dari Partner Eksekutif",
      },
    ],
    note: "Sesi deep work produktif, draf bagian analisis hukum selesai 100%.",
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: "sess-seed-2",
    mode: "pomodoro",
    startedAt: new Date(Date.now() - 200 * 60000).toISOString(),
    endedAt: new Date(Date.now() - 175 * 60000).toISOString(),
    plannedDuration: 1500, // 25 min
    actualDuration: 1500,
    linkedItem: {
      sourceType: "habit",
      sourceId: "hab-3",
      title: "Membaca Risalah Kasus & Jurnal Finansial",
    },
    status: "completed",
    intervals: [
      {
        id: "inv-1",
        sessionId: "sess-seed-2",
        type: "work",
        order: 1,
        plannedDuration: 1500,
        actualDuration: 1500,
        status: "completed",
      },
    ],
    interruptions: [],
    note: "Fokus penuh tanpa gangguan notifikasi.",
    createdAt: new Date(Date.now() - 200 * 60000).toISOString(),
  },
  {
    id: "sess-seed-3",
    mode: "pomodoro",
    startedAt: new Date(Date.now() - 300 * 60000).toISOString(),
    endedAt: new Date(Date.now() - 290 * 60000).toISOString(),
    plannedDuration: 1500,
    actualDuration: 600, // abandoned at 10 min
    linkedItem: {
      sourceType: "task",
      sourceId: "task-seed-2",
      title: "Audit Kertas Kerja & Verifikasi Bukti",
    },
    status: "abandoned",
    intervals: [],
    interruptions: [
      {
        id: "int-2",
        sessionId: "sess-seed-3",
        startedAt: new Date(Date.now() - 292 * 60000).toISOString(),
        reason: "Inspeksi mendadak dokumen klien",
      },
    ],
    note: "Terpaksa dihentikan lebih awal untuk menghadiri briefing mendesak.",
    createdAt: new Date(Date.now() - 300 * 60000).toISOString(),
  },
];

export function useFocusTimer() {
  const [state, setState] = useState<FocusTimerState>(() => {
    try {
      const saved = getRaw(FOCUS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load focus timer state", e);
    }
    return {
      sessions: DEFAULT_SESSIONS,
      activeSessionId: null,
      configs: DEFAULT_CONFIGS,
    };
  });

  // Read tasks for linking
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = getRaw(TASK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.tasks || [];
      }
    } catch (e) {
      console.error("Failed to load tasks in focus timer", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      setRaw(FOCUS_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist focus timer state", e);
    }
  }, [state]);

  const notifyChange = useCallback(() => {
    window.dispatchEvent(new Event("aio_data_updated"));
  }, []);

  const activeSession = useMemo(() => {
    return state.sessions.find((s) => s.id === state.activeSessionId) || null;
  }, [state.sessions, state.activeSessionId]);

  // START SESSION (§3.2)
  const startSession = useCallback(
    (mode: FocusMode, plannedMinutes: number, linkedItem?: LinkedItem) => {
      const sessionId = "sess-" + Date.now().toString(36);
      const plannedSeconds = plannedMinutes * 60;

      const newSession: FocusSession = {
        id: sessionId,
        mode,
        startedAt: new Date().toISOString(),
        plannedDuration: plannedSeconds,
        actualDuration: 0,
        linkedItem,
        status: "running",
        intervals:
          mode === "pomodoro"
            ? [
                {
                  id: "inv-" + Date.now().toString(36),
                  sessionId,
                  type: "work",
                  order: 1,
                  plannedDuration: plannedSeconds,
                  actualDuration: 0,
                  status: "active",
                },
              ]
            : [],
        interruptions: [],
        createdAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        sessions: [newSession, ...prev.sessions],
        activeSessionId: sessionId,
      }));

      notifyChange();
      return newSession;
    },
    [notifyChange]
  );

  // PAUSE SESSION (§3.2)
  const pauseSession = useCallback((sessionId: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === sessionId ? { ...s, status: "paused" as const } : s
      ),
    }));
    notifyChange();
  }, [notifyChange]);

  // RESUME SESSION (§3.2)
  const resumeSession = useCallback((sessionId: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === sessionId ? { ...s, status: "running" as const } : s
      ),
    }));
    notifyChange();
  }, [notifyChange]);

  // COMPLETE SESSION (§3.2)
  const completeSession = useCallback(
    (sessionId: string, note?: string, syncTaskComplete: boolean = false) => {
      setState((prev) => {
        const session = prev.sessions.find((s) => s.id === sessionId);
        if (!session) return prev;

        const now = new Date();
        const start = new Date(session.startedAt);
        const elapsedSec = Math.max(0, Math.round((now.getTime() - start.getTime()) / 1000));

        // If linked to Task and sync requested, mark Task complete (§3.3)
        if (syncTaskComplete && session.linkedItem?.sourceType === "task") {
          try {
            const raw = getRaw(TASK_STORAGE_KEY);
            if (raw) {
              const parsed = JSON.parse(raw);
              parsed.tasks = (parsed.tasks || []).map((t: Task) =>
                t.id === session.linkedItem!.sourceId
                  ? { ...t, status: "completed", updatedAt: new Date().toISOString() }
                  : t
              );
              setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
              setTasks(parsed.tasks);
            }
          } catch (e) {
            console.error("Failed to sync task completed status", e);
          }
        }

        return {
          ...prev,
          activeSessionId: null,
          sessions: prev.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  status: "completed" as const,
                  endedAt: now.toISOString(),
                  actualDuration: elapsedSec,
                  note: note || s.note,
                }
              : s
          ),
        };
      });

      notifyChange();
    },
    [notifyChange]
  );

  // STOP / END EARLY (ABANDONED §3.2 & §3.3)
  const stopSessionEarly = useCallback(
    (sessionId: string, note?: string) => {
      setState((prev) => {
        const session = prev.sessions.find((s) => s.id === sessionId);
        if (!session) return prev;

        const now = new Date();
        const start = new Date(session.startedAt);
        const elapsedSec = Math.max(0, Math.round((now.getTime() - start.getTime()) / 1000));

        return {
          ...prev,
          activeSessionId: null,
          sessions: prev.sessions.map((s) =>
            s.id === sessionId
              ? {
                  ...s,
                  status: "abandoned" as const,
                  endedAt: now.toISOString(),
                  actualDuration: elapsedSec,
                  note: note || "Sesi dihentikan sebelum durasi selesai.",
                }
              : s
          ),
        };
      });

      notifyChange();
    },
    [notifyChange]
  );

  // LOG INTERRUPTION (§6)
  const logInterruption = useCallback((sessionId: string, reason: string) => {
    const newInt: Interruption = {
      id: "int-" + Date.now().toString(36),
      sessionId,
      startedAt: new Date().toISOString(),
      reason: reason.trim(),
    };

    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, interruptions: [...s.interruptions, newInt] }
          : s
      ),
    }));

    notifyChange();
  }, [notifyChange]);

  // EXTEND SESSION (§3.2)
  const extendSession = useCallback((sessionId: string, extraMinutes: number) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) =>
        s.id === sessionId
          ? { ...s, plannedDuration: s.plannedDuration + extraMinutes * 60 }
          : s
      ),
    }));
    notifyChange();
  }, [notifyChange]);

  return {
    state,
    tasks,
    activeSession,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    stopSessionEarly,
    logInterruption,
    extendSession,
  };
}
