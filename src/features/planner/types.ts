export type TimeBlockSourceType =
  | "task"
  | "goal"
  | "habit"
  | "ritual"
  | "custom";

export type TimeBlockStatus =
  | "planned"
  | "in_progress"
  | "done"
  | "skipped"
  | "carried_over";

export interface TimeBlock {
  id: string;
  sourceType: TimeBlockSourceType;
  sourceId?: string; // Reference to Task, Goal, Habit, Ritual
  title: string;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
  status: TimeBlockStatus;
  dayPlanId: string;
  notes?: string;
  syncCompletion?: boolean; // if true, marking done also updates original task
  createdAt: string;
  updatedAt: string;
}

export interface Capacity {
  date: string; // YYYY-MM-DD
  availableMinutes: number; // working hours minus confirmed calendar events
  allocatedMinutes: number; // sum of TimeBlock durations on this day
  remainingMinutes: number;
}

export interface DailyPlan {
  id: string;
  date: string; // YYYY-MM-DD
  timeBlocks: string[]; // TimeBlock IDs
  capacity: Capacity;
  status: "draft" | "committed" | "completed";
}

export interface Ritual {
  id: string;
  title: string;
  recurrence: {
    type: "daily" | "weekday" | "weekly";
    daysOfWeek?: number[];
  };
  preferredStartTime: string; // "08:00"
  duration: number; // minutes, e.g. 30, 45, 60
  isFixed: boolean; // if true, cannot be moved during auto-planning
}

export interface Carryover {
  id: string;
  originalTimeBlockId: string;
  title: string;
  fromDate: string;
  toDate: string;
  reason: "not_started" | "partially_done" | "deprioritized";
}

export interface PlanningSession {
  id: string;
  type: "daily" | "weekly";
  createdAt: string;
  itemsReviewed: string[];
  itemsScheduled: string[];
  itemsDeferred: string[];
}

export interface WorkQueueItem {
  sourceType: TimeBlockSourceType;
  sourceId: string;
  title: string;
  priority: "none" | "low" | "medium" | "high" | "urgent";
  dueAt?: string;
  estimatedDuration: number; // minutes
  suggestedSlot?: string;
}

export type PlannerViewMode = "daily" | "weekly" | "workqueue" | "rituals" | "carryover";
