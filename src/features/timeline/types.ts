export type ScopeType = "project" | "list" | "tag" | "all";
export type GroupBy = "phase" | "assignee" | "project" | "none";
export type ZoomLevel = "day" | "week" | "month" | "quarter";

export interface TimelineViewConfig {
  id: string;
  name: string;
  scopeType: ScopeType;
  scopeId?: string;
  groupBy: GroupBy;
  zoomLevel: ZoomLevel;
  showDependencies: boolean;
  showCriticalPath: boolean;
  activeBaselineId?: string;
  createdAt: string;
}

export interface TimelineBar {
  id: string;
  sourceType: "task" | "milestone";
  sourceId: string;
  title: string;
  startAt: string; // YYYY-MM-DD
  endAt: string; // YYYY-MM-DD
  laneId: string;
  progress: number; // 0 to 100
  isOnCriticalPath: boolean;
  isMilestone: boolean;
}

export interface DependencyLine {
  fromBarId: string;
  toBarId: string;
  type: "finish_to_start" | "start_to_start" | "finish_to_finish";
  isViolated: boolean;
}

export interface BaselineSnapshot {
  id: string;
  timelineViewId: string;
  name: string;
  snapshotAt: string;
  barSnapshots: Array<{
    taskId: string;
    plannedStartAt: string;
    plannedEndAt: string;
  }>;
}

export type TimelineViewMode =
  | "gantt"
  | "compact"
  | "baseline"
  | "critical_path";
