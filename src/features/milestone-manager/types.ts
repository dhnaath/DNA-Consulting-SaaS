export type MilestoneStatus = 'on_track' | 'at_risk' | 'delayed' | 'achieved' | 'cancelled';

export type PrerequisiteSourceType = 'project' | 'goal' | 'task' | 'deliverable';

export type PrerequisiteStatus = 'completed' | 'on_track' | 'at_risk' | 'delayed' | 'needs_revision';

export type StakeholderRole = 'executive_sponsor' | 'coordinator' | 'observer';

export interface Prerequisite {
  id: string;
  strategicMilestoneId: string;
  title: string;
  sourceType: PrerequisiteSourceType;
  sourceId: string;
  isCritical: boolean;
  currentStatus: PrerequisiteStatus;
}

export interface ReadinessStatus {
  strategicMilestoneId: string;
  overallStatus: 'on_track' | 'at_risk' | 'delayed';
  criticalBlockers: string[];
  lastCalculatedAt: string;
}

export interface Stakeholder {
  id: string;
  strategicMilestoneId: string;
  personName: string;
  role: StakeholderRole;
  department?: string;
}

export interface MilestoneUpdate {
  id: string;
  strategicMilestoneId: string;
  content: string;
  authorName: string;
  createdAt: string;
}

export interface StrategicMilestone {
  id: string;
  title: string;
  description?: string;
  targetDate: string;
  status: MilestoneStatus;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export type MilestoneViewMode =
  | 'board'
  | 'readiness'
  | 'stakeholder'
  | 'timeline'
  | 'stats';
