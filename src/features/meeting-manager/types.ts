export type MeetingStatus = "scheduled" | "in_progress" | "completed" | "cancelled";

export type AgendaStatus = "pending" | "discussed" | "skipped" | "deferred";

export type ActionItemStatus = "open" | "in_progress" | "done" | "cancelled";

export type ParticipantRole = "organizer" | "required" | "optional" | "notetaker";

export interface AgendaItem {
  id: string;
  meetingId: string;
  order: number;
  topic: string;
  description?: string;
  estimatedMinutes?: number;
  ownerId?: string;
  ownerName?: string;
  status: AgendaStatus;
}

export interface Note {
  id: string;
  meetingId: string;
  agendaItemId?: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: string;
}

export interface Decision {
  id: string;
  meetingId: string;
  agendaItemId?: string;
  statement: string;
  rationale?: string;
  decidedBy: string;
  decidedAt: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  agendaItemId?: string;
  description: string;
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: string;
  status: ActionItemStatus;
  linkedTaskId?: string;
}

export interface Participant {
  id: string;
  meetingId: string;
  personId: string;
  name: string;
  email?: string;
  avatar?: string;
  role: ParticipantRole;
  attended: boolean;
}

export interface MeetingSeries {
  id: string;
  title: string;
  recurrence: "daily" | "weekly" | "biweekly" | "monthly";
  defaultAgendaTemplate?: string[];
  meetingIds: string[];
}

export interface Meeting {
  id: string;
  title: string;
  eventId?: string; // Ref to Calendar (#02)
  seriesId?: string;
  status: MeetingStatus;
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  location?: string;
  agendaItems: AgendaItem[];
  notes: Note[];
  decisions: Decision[];
  actionItems: ActionItem[];
  participants: Participant[];
  createdAt: string;
  updatedAt: string;
}
