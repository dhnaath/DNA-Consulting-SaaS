import { useState, useEffect, useCallback, useMemo } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import {
  QuadrantKey,
  ClassificationRule,
  ManualOverride,
  QuadrantDefinition,
} from "./types";
import { Task } from "../task-manager/types";

const EISENHOWER_STORAGE_KEY = "aio_eisenhower_matrix_data_v1";
const TASK_STORAGE_KEY = "aio_task_manager_data_v1";
const PLANNER_STORAGE_KEY = "aio_planner_data_v1";

interface EisenhowerState {
  rule: ClassificationRule;
  overrides: Record<string, ManualOverride>; // taskId -> ManualOverride
}

const DEFAULT_RULE: ClassificationRule = {
  id: "rule-default",
  urgencyThresholdDays: 2,
  importanceMapping: {
    urgent: "important",
    high: "important",
    medium: "important",
    low: "not_important",
    none: "not_important",
  },
  considerGoalLink: true,
};

export const QUADRANT_DEFS: Record<QuadrantKey, QuadrantDefinition> = {
  q1_do: {
    key: "q1_do",
    label: "Q1 — Do First",
    subtitle: "Mendesak & Sangat Penting",
    urgency: "urgent",
    importance: "important",
    recommendedAction: "Kerjakan sekarang, prioritas tertinggi",
    color: "#ef4444",
  },
  q2_schedule: {
    key: "q2_schedule",
    label: "Q2 — Schedule",
    subtitle: "Penting, Tidak Mendesak",
    urgency: "not_urgent",
    importance: "important",
    recommendedAction: "Jadwalkan waktu khusus (via Planner), jangan ditunda",
    color: "#3b82f6",
  },
  q3_delegate: {
    key: "q3_delegate",
    label: "Q3 — Delegate",
    subtitle: "Mendesak, Kurang Penting",
    urgency: "urgent",
    importance: "not_important",
    recommendedAction: "Delegasikan ke anggota tim lain jika memungkinkan",
    color: "#f59e0b",
  },
  q4_eliminate: {
    key: "q4_eliminate",
    label: "Q4 — Eliminate",
    subtitle: "Tidak Mendesak & Kurang Penting",
    urgency: "not_urgent",
    importance: "not_important",
    recommendedAction: "Pertimbangkan untuk dihapus / dibatalkan",
    color: "#6b7280",
  },
};

export function useEisenhowerMatrix() {
  const [state, setState] = useState<EisenhowerState>(() => {
    try {
      const saved = getRaw(EISENHOWER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load eisenhower state", e);
    }
    return {
      rule: DEFAULT_RULE,
      overrides: {},
    };
  });

  // Read tasks from Task Manager (#01)
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = getRaw(TASK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.tasks || [];
      }
    } catch (e) {
      console.error("Failed to load tasks for eisenhower", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      setRaw(EISENHOWER_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist eisenhower state", e);
    }
  }, [state]);

  // Synchronize on cross-app events
  useEffect(() => {
    const handleSync = () => {
      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.tasks) setTasks(parsed.tasks);
        }
      } catch (e) {
        console.error("Error reading tasks in eisenhower", e);
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("aio_data_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("aio_data_updated", handleSync);
    };
  }, []);

  const notifyChange = useCallback(() => {
    window.dispatchEvent(new Event("aio_data_updated"));
  }, []);

  // CLASSIFICATION LOGIC (§3.1, §3.2, §3.3)
  const classifiedTasks = useMemo(() => {
    const now = Date.now();
    const thresholdMs = state.rule.urgencyThresholdDays * 86400000;

    const buckets: Record<QuadrantKey, Task[]> = {
      q1_do: [],
      q2_schedule: [],
      q3_delegate: [],
      q4_eliminate: [],
    };

    tasks
      .filter((t) => t.status !== "completed" && t.status !== "archived")
      .forEach((t) => {
        // 1. Check manual override first (§5)
        const override = state.overrides[t.id];
        if (override) {
          buckets[override.quadrantKey].push(t);
          return;
        }

        // 2. Compute Urgency (§3.1)
        let isUrgent = false;
        if (t.dueAt) {
          const dueTime = new Date(t.dueAt).getTime();
          if (dueTime <= now + thresholdMs) {
            isUrgent = true;
          }
        }

        // 3. Compute Importance (§3.2)
        const priorityKey = (t.priority || "medium") as keyof typeof state.rule.importanceMapping;
        const isImportant = state.rule.importanceMapping[priorityKey] === "important";

        // 4. Assign quadrant
        if (isUrgent && isImportant) {
          buckets.q1_do.push(t);
        } else if (!isUrgent && isImportant) {
          buckets.q2_schedule.push(t);
        } else if (isUrgent && !isImportant) {
          buckets.q3_delegate.push(t);
        } else {
          buckets.q4_eliminate.push(t);
        }
      });

    return buckets;
  }, [tasks, state.rule, state.overrides]);

  // SET MANUAL OVERRIDE (§5)
  const setOverride = useCallback(
    (taskId: string, quadrantKey: QuadrantKey) => {
      setState((prev) => ({
        ...prev,
        overrides: {
          ...prev.overrides,
          [taskId]: {
            id: "ovr-" + Date.now().toString(36),
            taskId,
            quadrantKey,
            overriddenAt: new Date().toISOString(),
          },
        },
      }));
      notifyChange();
    },
    [notifyChange]
  );

  // CLEAR MANUAL OVERRIDE (§5)
  const clearOverride = useCallback(
    (taskId: string) => {
      setState((prev) => {
        const next = { ...prev.overrides };
        delete next[taskId];
        return { ...prev, overrides: next };
      });
      notifyChange();
    },
    [notifyChange]
  );

  // SCHEDULE TASK TO PLANNER (CROSS-APP ACTION §12)
  const scheduleToPlanner = useCallback(
    (task: Task) => {
      const todayStr = new Date().toISOString().slice(0, 10);
      try {
        const raw = getRaw(PLANNER_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : { timeBlocks: [] };

        const newBlock = {
          id: "tb-plan-" + Date.now().toString(36),
          sourceType: "task",
          sourceId: task.id,
          title: task.title,
          startAt: `${todayStr}T14:00:00`,
          endAt: `${todayStr}T15:30:00`,
          status: "planned",
          dayPlanId: todayStr,
          syncCompletion: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        parsed.timeBlocks = [...(parsed.timeBlocks || []), newBlock];
        setRaw(PLANNER_STORAGE_KEY, JSON.stringify(parsed));
      } catch (e) {
        console.error("Failed to schedule to planner", e);
      }
      notifyChange();
    },
    [notifyChange]
  );

  // DELEGATE TASK (UPDATE ASSIGNEE IN TASK MANAGER §12)
  const delegateTask = useCallback(
    (taskId: string, newAssignee: string) => {
      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.tasks = (parsed.tasks || []).map((t: Task) =>
            t.id === taskId
              ? { ...t, assigneeName: newAssignee, updatedAt: new Date().toISOString() }
              : t
          );
          setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
          setTasks(parsed.tasks);
        }
      } catch (e) {
        console.error("Failed to delegate task", e);
      }
      notifyChange();
    },
    [notifyChange]
  );

  // ELIMINATE / DELETE TASK FROM TASK MANAGER
  const eliminateTask = useCallback(
    (taskId: string) => {
      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.tasks = (parsed.tasks || []).map((t: Task) =>
            t.id === taskId ? { ...t, status: "cancelled", updatedAt: new Date().toISOString() } : t
          );
          setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
          setTasks(parsed.tasks);
        }
      } catch (e) {
        console.error("Failed to eliminate task", e);
      }
      notifyChange();
    },
    [notifyChange]
  );

  return {
    state,
    classifiedTasks,
    setOverride,
    clearOverride,
    scheduleToPlanner,
    delegateTask,
    eliminateTask,
  };
}
