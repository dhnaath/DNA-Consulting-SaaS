export type TimeEntrySource = 'manual' | 'timer' | 'imported_from_focus_session';

export type TimeEntryStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export type LinkedItemType = 'task' | 'project' | 'activity';

export interface LinkedItem {
  sourceType: LinkedItemType;
  sourceId: string;
  title: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  userName: string;
  linkedItem?: LinkedItem;
  startAt?: string;
  endAt?: string;
  durationMinutes: number;
  isBillable: boolean;
  note?: string;
  source: TimeEntrySource;
  status: TimeEntryStatus;
  createdAt: string;
}

export interface TimeActivity {
  id: string;
  name: string;
  isBillableDefault: boolean;
}

export interface Timesheet {
  id: string;
  userId: string;
  userName: string;
  periodStart: string;
  periodEnd: string;
  entryIds: string[];
  totalMinutes: number;
  status: TimeEntryStatus;
  approverId?: string;
}

export interface RateCard {
  id: string;
  appliesTo: string; // e.g. "Senior Consultant", "Project Enterprise", "PT Mandiri Sekuritas"
  hourlyRate: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface TimeApprovalRecord {
  id: string;
  timesheetId: string;
  approverId: string;
  approverName: string;
  decision: 'approved' | 'rejected';
  comments?: string;
  decidedAt: string;
}

export type TimeTrackerViewMode =
  | 'timer'
  | 'weekly_timesheet'
  | 'by_project'
  | 'by_task'
  | 'pending_approvals'
  | 'billing_summary'
  | 'stats';
