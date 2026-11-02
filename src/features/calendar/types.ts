export type CalendarType = "personal" | "shared" | "subscribed";

export type EventStatus = "confirmed" | "tentative" | "cancelled";

export type EventVisibility = "default" | "public" | "private";

export type RecurrenceType =
  | "daily"
  | "weekday"
  | "weekly"
  | "monthly"
  | "yearly"
  | "custom";

export type ParticipantRole = "organizer" | "required" | "optional";

export type RSVPStatus = "pending" | "accepted" | "declined" | "tentative";

export type ReminderChannel = "push" | "email" | "in_app";

export interface RecurrenceRule {
  type: RecurrenceType;
  interval?: number;
  daysOfWeek?: number[]; // [1, 2, 3, 4, 5] for Mon-Fri
  dayOfMonth?: number;
  weekdayPosition?: string; // e.g. "third Monday"
  monthOfYear?: number;
  endDate?: string;
  occurrenceCount?: number;
  timezone?: string;
}

export interface EventException {
  id: string;
  parentEventId: string;
  originalStartAt: string;
  overrideStartAt?: string;
  overrideEndAt?: string;
  overrideTitle?: string;
  isCancelled?: boolean;
}

export interface Participant {
  id: string;
  eventId: string;
  userId: string;
  name: string;
  email?: string;
  role: ParticipantRole;
  rsvpStatus: RSVPStatus;
  respondedAt?: string;
}

export interface CalendarReminder {
  id: string;
  eventId: string;
  offsetMinutes: number; // e.g. 10, 30, 60, 1440
  channel: ReminderChannel;
  status: "pending" | "sent" | "dismissed";
}

export interface AvailabilitySlot {
  userId: string;
  userName: string;
  dayOfWeek: number[]; // [1..5]
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  timezone: string;
}

export interface CalendarContainer {
  id: string;
  name: string;
  color: string;
  ownerId: string;
  type: CalendarType;
  visibility: "shown" | "hidden";
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  calendarId: string;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
  allDay?: boolean;
  location?: string;
  participants: Participant[];
  color?: string; // override
  status: EventStatus;
  visibility: EventVisibility;
  recurrence?: RecurrenceRule;
  exceptions: EventException[];
  reminders: CalendarReminder[];
  attachments?: Array<{ id: string; name: string; url: string; size?: number }>;
  externalRef?: {
    sourceApp: "task_manager" | "project_manager" | "meeting_manager" | "trip_planner";
    sourceId: string;
  };
  hiddenInCalendar?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CalendarViewMode =
  | "day"
  | "week"
  | "month"
  | "year"
  | "agenda"
  | "person";
