export type FocusMode = "pomodoro" | "countdown" | "stopwatch" | "deep_work";

export type SessionStatus = "running" | "paused" | "completed" | "abandoned";

export type IntervalType = "work" | "short_break" | "long_break";

export interface Interval {
  id: string;
  sessionId: string;
  type: IntervalType;
  order: number;
  plannedDuration: number; // in seconds
  actualDuration: number; // in seconds
  status: "pending" | "active" | "completed" | "skipped";
}

export interface Interruption {
  id: string;
  sessionId: string;
  startedAt: string;
  endedAt?: string;
  reason?: string; // e.g. "Panggilan telepon", "Notifikasi HP", "Interupsi rekan"
}

export interface LinkedItem {
  sourceType: "task" | "habit" | "project" | "none";
  sourceId: string;
  title?: string;
}

export interface FocusSession {
  id: string;
  mode: FocusMode;
  startedAt: string; // ISO
  endedAt?: string; // ISO
  plannedDuration: number; // seconds
  actualDuration: number; // seconds
  linkedItem?: LinkedItem;
  status: SessionStatus;
  intervals: Interval[];
  interruptions: Interruption[];
  note?: string; // post-session reflection
  createdAt: string;
}

export interface SessionConfig {
  id: string;
  name: string;
  mode: FocusMode;
  workDuration: number; // minutes
  breakDuration: number; // minutes
  longBreakDuration: number; // minutes
  cyclesBeforeLongBreak: number;
  autoStartNext: boolean;
}

export type FocusTimerViewMode =
  | "timer"
  | "history"
  | "by_linked"
  | "summary"
  | "interruptions";
