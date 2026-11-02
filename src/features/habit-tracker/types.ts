export type HabitType = "binary" | "quantity" | "duration";

export type HabitStatus = "active" | "paused" | "archived";

export type OccurrenceStatus = "done" | "skipped" | "missed";

export type FrequencyType =
  | "daily"
  | "specific_days"
  | "times_per_week"
  | "times_per_month"
  | "custom_interval";

export interface HabitTarget {
  metric: string; // e.g. "gelas air", "menit membaca", "halaman"
  goalValue: number; // e.g. 8, 20
  comparisonType: "at_least" | "at_most" | "exact";
}

export interface HabitFrequency {
  type: FrequencyType;
  daysOfWeek?: number[]; // [1, 3, 5] for Mon, Wed, Fri
  timesRequired?: number; // e.g. 3 for 3x per week
  interval?: number; // e.g. 2 for every 2 days
}

export interface HabitCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  type: HabitType;
  target?: HabitTarget;
  frequency: HabitFrequency;
  categoryId?: string;
  color?: string;
  icon?: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
  reminderConfig?: {
    time: string; // "07:00"
    enabled: boolean;
  };
  status: HabitStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Occurrence {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  status: OccurrenceStatus;
  value?: number; // for quantity / duration
  note?: string;
  loggedAt: string;
}

export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastEvaluatedDate: string;
}

export type HabitViewMode =
  | "today"
  | "heatmap"
  | "streak_board"
  | "categories"
  | "summary";
