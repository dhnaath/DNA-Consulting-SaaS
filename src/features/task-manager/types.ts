export type TaskPriority = "none" | "low" | "medium" | "high" | "urgent";

export type TaskStatus =
  | "inbox"
  | "planned"
  | "in_progress"
  | "waiting"
  | "completed"
  | "cancelled"
  | "archived";

export type DependencyType =
  | "finish_to_start"
  | "start_to_start"
  | "finish_to_finish"
  | "blocked_by"
  | "blocks";

export type ReminderType = "datetime" | "location" | "before_due" | "recurring";

export type ReminderStatus = "pending" | "sent" | "dismissed" | "snoozed";

export type RecurrenceType =
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom"
  | "after_completion";

export interface Recurrence {
  type: RecurrenceType;
  interval?: number; // e.g. every 2 weeks
  daysOfWeek?: number[]; // [1, 3, 5] for Mon, Wed, Fri
  dayOfMonth?: number;
  monthOfYear?: number;
  endDate?: string;
  timezone?: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

export interface TaskDependency {
  id: string;
  taskId: string;
  dependsOnTaskId: string;
  type: DependencyType;
}

export interface Reminder {
  id: string;
  taskId: string;
  type: ReminderType;
  triggerAt?: string;
  location?: string;
  repeat?: boolean;
  status: ReminderStatus;
  offsetMinutes?: number; // for before_due (e.g. 15, 60, 1440)
}

export interface Attachment {
  id: string;
  taskId: string;
  name: string;
  type: "image" | "document" | "link" | "other";
  url: string;
  size?: number; // bytes
  createdAt: string;
}

export interface Comment {
  id: string;
  taskId: string;
  parentCommentId?: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  taskId: string;
  type: string;
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  userId?: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  folderId?: string;
  startAt?: string;
  dueAt?: string;
  status: "active" | "completed" | "archived";
  color?: string;
  createdAt: string;
}

export interface List {
  id: string;
  name: string;
  folderId?: string;
  projectId?: string;
  color?: string;
  icon?: string;
  createdAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  checklist: ChecklistItem[];
  notes?: string;
  priority: TaskPriority;
  status: TaskStatus;
  projectId?: string;
  listId?: string;
  folderId?: string;
  parentTaskId?: string; // Nested subtask support
  phaseId?: string; // Phase reference in Project Manager (#03)
  startAt?: string; // ISO string
  dueAt?: string; // ISO string
  duration?: number; // duration in minutes
  location?: string;
  tags: string[];
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  assigneeTeam?: string[];
  colorTheme?: "blue" | "amber" | "purple" | "rose" | "emerald" | "cyan" | "pink";
  imagePreview?: string;
  customProgress?: number;
  attachments: Attachment[];
  links: string[];
  dependencies: TaskDependency[];
  reminders: Reminder[];
  recurrence?: Recurrence;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  archivedAt?: string;
}

export type ViewMode =
  | "list"
  | "board"
  | "calendar"
  | "timeline"
  | "table"
  | "priority";

export type SmartFilter =
  | "all"
  | "inbox"
  | "today"
  | "upcoming"
  | "overdue"
  | "completed"
  | "archived";

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tasks: Array<{
    title: string;
    description?: string;
    priority: TaskPriority;
    relativeStartDays: number;
    relativeDueDays: number;
    checklist?: string[];
    subtasks?: Array<{
      title: string;
      relativeDueDays: number;
    }>;
  }>;
}
