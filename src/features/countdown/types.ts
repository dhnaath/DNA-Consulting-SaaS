export type TargetType = "exact_time" | "all_day" | "date_only";
export type CountdownDirection = "count_down" | "count_up";
export type CountdownStatus = "Active" | "Reached" | "Cancelled" | "Archived";
export type RecurrenceType = "yearly" | "monthly" | "weekly" | "custom";
export type ReminderStatus = "pending" | "sent" | "dismissed";
export type EntityType = "event" | "goal" | "milestone" | "project" | "trip";

export interface Recurrence {
  type: RecurrenceType;
  interval: number; // e.g. 1 for yearly, 2 for every 2 months
  endDate?: string;
  occurrenceLimit?: number;
  timezone?: string;
}

export interface LinkedEntity {
  entityType: EntityType;
  entityId: string;
  entityTitle?: string;
  isBroken: boolean;
}

export interface Attachment {
  id: string;
  countdownId: string;
  name: string;
  type: "image" | "other";
  url: string;
  size?: number;
  createdAt: string;
}

export interface Reminder {
  id: string;
  countdownId: string;
  triggerOffset: string; // "P30D", "P7D", "P1D", "PT1H", "PT15M"
  triggerAt: string; // ISO datetime
  status: ReminderStatus;
}

export interface Activity {
  id: string;
  countdownId: string;
  type:
    | "created"
    | "edited"
    | "reached"
    | "reminder_sent"
    | "recurrence_renewed"
    | "archived"
    | "restored"
    | "linked_entity"
    | "direction_switched"
    | "status_changed";
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  userId?: string;
  description: string;
  createdAt: string;
}

export interface CountdownItem {
  id: string;
  title: string;
  description?: string;
  targetAt: string; // ISO datetime string
  targetType: TargetType;
  direction: CountdownDirection;
  autoSwitchCountUp?: boolean; // If true, auto-switches to count_up when target passed
  categoryId?: string;
  tags: string[];
  coverImage?: Attachment;
  status: CountdownStatus;
  recurrence?: Recurrence;
  linkedEntity?: LinkedEntity;
  reminders?: Reminder[];
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  reachedAt?: string;
  archivedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface CountdownTemplate {
  id: string;
  title: string;
  description: string;
  defaultTitle: string;
  categoryName: string;
  targetType: TargetType;
  direction: CountdownDirection;
  autoSwitchCountUp?: boolean;
  recurrence?: Recurrence;
  defaultReminderOffsets: string[];
  linkedEntityType?: EntityType;
  suggestedCover: string;
  badge: string;
}

export type ViewMode = "grid" | "list" | "widget" | "category" | "statistics";
export type FilterTab = "all" | "upcoming" | "reached" | "pinned" | "recurring" | "archived";
