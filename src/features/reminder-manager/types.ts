export type ReminderSourceApp =
  | "task_manager"
  | "calendar"
  | "habit_tracker"
  | "medicine_manager"
  | "bill_manager"
  | "custom";

export type TriggerType =
  | "absolute"
  | "relative"
  | "recurring"
  | "location"
  | "condition";

export type DeliveryChannel = "push" | "email" | "sms" | "in_app";

export type RuleStatus = "active" | "paused" | "expired" | "cancelled";

export type InstanceStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "failed"
  | "dismissed"
  | "snoozed";

export interface TriggerConfig {
  triggerAt?: string; // for absolute
  anchorField?: "dueAt" | "startAt" | "eventStart"; // for relative
  offsetMinutes?: number; // negative for before, positive for after
  recurrence?: {
    type: "daily" | "weekly" | "monthly";
    time?: string;
  };
  latitude?: number;
  longitude?: number;
  radiusMeters?: number;
  event?: "enter" | "leave";
  locationName?: string;
  conditionExpression?: string;
  evaluatedBy?: string;
}

export interface ReminderRule {
  id: string;
  sourceApp: ReminderSourceApp;
  sourceId: string;
  triggerType: TriggerType;
  triggerConfig: TriggerConfig;
  channels: DeliveryChannel[];
  status: RuleStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderInstance {
  id: string;
  ruleId: string;
  title: string;
  sourceApp: ReminderSourceApp;
  scheduledAt: string;
  status: InstanceStatus;
  sentAt?: string;
  dismissedAt?: string;
  snoozeUntil?: string;
}

export interface DeliveryAttempt {
  id: string;
  instanceId: string;
  channel: DeliveryChannel;
  status: "queued" | "sent" | "delivered" | "failed";
  attemptedAt: string;
  errorReason?: string;
}

export interface SnoozeRecord {
  id: string;
  instanceId: string;
  snoozedAt: string;
  snoozeUntil: string;
  snoozeDurationMinutes: number;
}

export interface NotificationLog {
  id: string;
  instanceId: string;
  event:
    | "scheduled"
    | "sent"
    | "delivered"
    | "opened"
    | "dismissed"
    | "snoozed"
    | "failed";
  timestamp: string;
  metadata?: Record<string, any>;
}

export type ReminderViewMode =
  | "upcoming"
  | "by_source"
  | "snoozed"
  | "failed"
  | "location"
  | "logs";
