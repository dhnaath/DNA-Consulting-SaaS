export type GoalStatus = 'active' | 'achieved' | 'abandoned' | 'paused';

export type ContributorSourceType = 'task' | 'project' | 'habit' | 'manual_metric';

export type ProgressMetricType = 'task_completion' | 'habit_consistency' | 'numeric_target' | 'milestone_based';

export type GoalMilestoneStatus = 'upcoming' | 'achieved' | 'missed';

export interface Contributor {
  id: string;
  goalId: string;
  sourceType: ContributorSourceType;
  sourceId: string;
  title: string;
  weight: number; // e.g. 0.4
  currentProgress: number; // 0 to 100
}

export interface ProgressMetric {
  goalId: string;
  type: ProgressMetricType;
  config: {
    startValue?: number;
    targetValue?: number;
    unit?: string;
    currentValue?: number;
  };
}

export interface GoalMilestone {
  id: string;
  goalId: string;
  title: string;
  targetDate: string;
  status: GoalMilestoneStatus;
}

export interface CheckIn {
  id: string;
  goalId: string;
  checkedAt: string;
  progressSnapshot: number; // 0 to 100%
  note: string;
  numericValue?: number;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string; // e.g. "Kesehatan", "Karier", "Finansial", "Bisnis", "R&D"
  targetDate?: string;
  status: GoalStatus;
  parentGoalId?: string | null;
  progressMetric?: ProgressMetric;
  createdAt: string;
  updatedAt: string;
}

export type GoalViewMode =
  | 'board'
  | 'tree'
  | 'by_category'
  | 'progress_trend'
  | 'stats';
