export type QuadrantKey =
  | "q1_do"
  | "q2_schedule"
  | "q3_delegate"
  | "q4_eliminate";

export interface ManualOverride {
  id: string;
  taskId: string;
  quadrantKey: QuadrantKey;
  overriddenAt: string;
  expiresOnFieldChange?: boolean;
}

export interface ClassificationRule {
  id: string;
  urgencyThresholdDays: number; // default 2
  importanceMapping: {
    urgent: "important" | "not_important";
    high: "important" | "not_important";
    medium: "important" | "not_important";
    low: "important" | "not_important";
    none: "important" | "not_important";
  };
  considerGoalLink?: boolean;
}

export interface QuadrantDefinition {
  key: QuadrantKey;
  label: string;
  subtitle: string;
  urgency: "urgent" | "not_urgent";
  importance: "important" | "not_important";
  recommendedAction: string;
  color: string;
}

export type EisenhowerViewMode = "grid" | "detail" | "trend";
