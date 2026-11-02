export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled"
  | "archived";

export type PhaseStatus = "upcoming" | "active" | "completed";

export type MilestoneStatus = "upcoming" | "at_risk" | "achieved" | "missed";

export type MemberRole = "owner" | "manager" | "contributor" | "viewer";

export type RiskLikelihood = "low" | "medium" | "high";
export type RiskImpact = "low" | "medium" | "high";
export type RiskStatus = "identified" | "mitigating" | "resolved" | "occurred";

export interface BudgetSummary {
  allocated: number;
  spent: number;
  currency: string;
}

export interface Phase {
  id: string;
  projectId: string;
  name: string;
  order: number;
  startAt?: string;
  dueAt?: string;
  status: PhaseStatus;
}

export interface Milestone {
  id: string;
  projectId: string;
  phaseId?: string;
  title: string;
  targetDate: string; // ISO date string
  status: MilestoneStatus;
  linkedTaskIds: string[]; // Auto-achieve when all are completed in Task Manager
}

export interface Member {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  email?: string;
  avatar?: string;
  role: MemberRole;
  joinedAt: string;
}

export interface Objective {
  id: string;
  projectId: string;
  goalId?: string; // Ref to Goal Manager (#31)
  description: string;
  targetMetric?: string;
}

export interface Risk {
  id: string;
  projectId: string;
  title: string;
  description: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  status: RiskStatus;
  mitigationPlan?: string;
  ownerId?: string;
  ownerName?: string;
}

export interface ProjectActivity {
  id: string;
  projectId: string;
  type: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  userId?: string;
  userName?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  startAt?: string;
  dueAt?: string;
  ownerId?: string;
  ownerName?: string;
  folderId?: string;
  tags: string[];
  budgetSummary?: BudgetSummary;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  archivedAt?: string;
}

export type ProjectViewMode =
  | "overview"
  | "board"
  | "timeline"
  | "list"
  | "calendar"
  | "team"
  | "risks";

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  phases: Array<{
    name: string;
    order: number;
    relativeStartDays: number;
    relativeDueDays: number;
    tasks: Array<{
      title: string;
      description?: string;
      priority: "none" | "low" | "medium" | "high" | "urgent";
      relativeDueDays: number;
    }>;
    milestones: Array<{
      title: string;
      relativeDueDays: number;
    }>;
  }>;
}
