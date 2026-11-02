import { useState, useEffect, useCallback, useMemo } from "react";
import {
  TimelineViewConfig,
  TimelineBar,
  DependencyLine,
  BaselineSnapshot,
} from "./types";
import { Task } from "../task-manager/types";
import { Project, Milestone } from "../project-manager/types";
import { getRaw, setRaw } from "../../core/rawStorage";

const TIMELINE_STORAGE_KEY = "aio_timeline_manager_data_v1";
const TASK_STORAGE_KEY = "aio_task_manager_data_v1";
const PROJECT_STORAGE_KEY = "aio_project_manager_data_v1";

interface TimelineState {
  views: TimelineViewConfig[];
  activeViewId: string;
  baselines: BaselineSnapshot[];
}

const DEFAULT_VIEWS: TimelineViewConfig[] = [
  {
    id: "view-default",
    name: "Master Timeline Konsultasi & Audit",
    scopeType: "all",
    groupBy: "phase",
    zoomLevel: "week",
    showDependencies: true,
    showCriticalPath: true,
    createdAt: new Date().toISOString(),
  },
];

export function useTimelineManager() {
  const [state, setState] = useState<TimelineState>(() => {
    try {
      const saved = getRaw(TIMELINE_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load timeline state", e);
    }
    return {
      views: DEFAULT_VIEWS,
      activeViewId: "view-default",
      baselines: [],
    };
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = getRaw(TASK_STORAGE_KEY);
      if (raw) return JSON.parse(raw).tasks || [];
    } catch (e) {}
    return [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const raw = getRaw(PROJECT_STORAGE_KEY);
      if (raw) return JSON.parse(raw).projects || [];
    } catch (e) {}
    return [];
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const raw = getRaw(PROJECT_STORAGE_KEY);
      if (raw) return JSON.parse(raw).milestones || [];
    } catch (e) {}
    return [];
  });

  useEffect(() => {
    try {
      setRaw(TIMELINE_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist timeline state", e);
    }
  }, [state]);

  // Synchronize on cross-app events
  useEffect(() => {
    const handleSync = () => {
      try {
        const rawT = getRaw(TASK_STORAGE_KEY);
        if (rawT) setTasks(JSON.parse(rawT).tasks || []);
        const rawP = getRaw(PROJECT_STORAGE_KEY);
        if (rawP) {
          const parsed = JSON.parse(rawP);
          setProjects(parsed.projects || []);
          setMilestones(parsed.milestones || []);
        }
      } catch (e) {}
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

  const activeView = useMemo(() => {
    return state.views.find((v) => v.id === state.activeViewId) || state.views[0];
  }, [state.views, state.activeViewId]);

  // COMPUTED BARS (§4)
  const bars = useMemo<TimelineBar[]>(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const result: TimelineBar[] = [];

    // Map tasks to bars
    tasks.forEach((t) => {
      const startAt = t.startAt ? t.startAt.slice(0, 10) : todayStr;
      let endAt = t.dueAt ? t.dueAt.slice(0, 10) : startAt;

      // Ensure endAt >= startAt
      if (new Date(endAt).getTime() < new Date(startAt).getTime()) {
        endAt = startAt;
      }

      const progress = t.status === "completed" ? 100 : t.status === "in_progress" ? 50 : 0;

      // Grouping logic for laneId (§7)
      let laneId = "Lainnya";
      if (activeView.groupBy === "phase") {
        laneId = t.projectId ? `Proyek: ${t.projectId}` : "Fase Umum";
      } else if (activeView.groupBy === "assignee") {
        laneId = t.assigneeName || "Belum Ditugaskan";
      }

      result.push({
        id: `bar-task-${t.id}`,
        sourceType: "task",
        sourceId: t.id,
        title: t.title,
        startAt,
        endAt,
        laneId,
        progress,
        isOnCriticalPath: t.priority === "urgent", // Simplified CPM flag
        isMilestone: false,
      });
    });

    // Map project milestones to diamond bars (§4.1)
    milestones.forEach((m) => {
      const parentProject = projects.find((p) => p.id === m.projectId);
      result.push({
        id: `bar-m-${m.id}`,
        sourceType: "milestone",
        sourceId: m.id,
        title: `Milestone: ${m.title}`,
        startAt: m.targetDate.slice(0, 10),
        endAt: m.targetDate.slice(0, 10),
        laneId: activeView.groupBy === "assignee" ? "Milestone Proyek" : parentProject?.name || "Milestone Umum",
        progress: m.status === "achieved" ? 100 : 0,
        isOnCriticalPath: true,
        isMilestone: true,
      });
    });

    return result;
  }, [tasks, projects, milestones, activeView]);

  // COMPUTED DEPENDENCY LINES & VIOLATIONS (§5 & §5.1)
  const dependencyLines = useMemo<DependencyLine[]>(() => {
    const lines: DependencyLine[] = [];
    const barMap = new Map(bars.map((b) => [b.sourceId, b]));

    tasks.forEach((t) => {
      (t.dependencies || []).forEach((dep) => {
        const fromBar = barMap.get(dep.dependsOnTaskId);
        const toBar = barMap.get(t.id);

        if (fromBar && toBar) {
          // Violation rule: if finish_to_start and toBar.startAt < fromBar.endAt
          const isViolated = new Date(toBar.startAt).getTime() < new Date(fromBar.endAt).getTime();
          lines.push({
            fromBarId: fromBar.id,
            toBarId: toBar.id,
            type: dep.type as any,
            isViolated,
          });
        }
      });
    });

    return lines;
  }, [tasks, bars]);

  // GROUPED LANES (§7)
  const lanes = useMemo(() => {
    const map: Record<string, TimelineBar[]> = {};
    bars.forEach((b) => {
      if (!map[b.laneId]) map[b.laneId] = [];
      map[b.laneId].push(b);
    });
    return map;
  }, [bars]);

  // SAVE BASELINE SNAPSHOT (§8)
  const saveBaseline = useCallback(
    (name: string) => {
      const newSnapshot: BaselineSnapshot = {
        id: "base-" + Date.now().toString(36),
        timelineViewId: activeView.id,
        name: name.trim() || "Baseline Terjadwal",
        snapshotAt: new Date().toISOString(),
        barSnapshots: tasks.map((t) => ({
          taskId: t.id,
          plannedStartAt: t.startAt || new Date().toISOString().slice(0, 10),
          plannedEndAt: t.dueAt || new Date().toISOString().slice(0, 10),
        })),
      };

      setState((prev) => ({
        ...prev,
        baselines: [newSnapshot, ...prev.baselines],
      }));

      notifyChange();
    },
    [activeView, tasks, notifyChange]
  );

  // UPDATE VIEW CONFIG
  const updateConfig = useCallback(
    (key: keyof TimelineViewConfig, value: any) => {
      setState((prev) => ({
        ...prev,
        views: prev.views.map((v) =>
          v.id === prev.activeViewId ? { ...v, [key]: value } : v
        ),
      }));
      notifyChange();
    },
    [notifyChange]
  );

  return {
    state,
    activeView,
    bars,
    dependencyLines,
    lanes,
    saveBaseline,
    updateConfig,
  };
}
