export type InteractionType = 'call' | 'meeting' | 'email' | 'message' | 'visit' | 'other';

export type InteractionDirection = 'inbound' | 'outbound';

export type FollowUpStatus = 'pending' | 'done' | 'cancelled';

export type InteractionSentiment = 'positive' | 'neutral' | 'negative';

export interface FollowUp {
  id: string;
  interactionId: string;
  description: string;
  dueDate: string;
  status: FollowUpStatus;
  linkedTaskId?: string;
}

export interface InteractionOutcome {
  interactionId: string;
  sentiment: InteractionSentiment;
  result?: string;
  nextSteps?: string;
}

export interface InteractionParticipant {
  interactionId: string;
  personId: string;
  role: 'primary' | 'cc' | 'observer';
}

export interface Interaction {
  id: string;
  personId: string; // ref to People Manager
  personName: string;
  organizationName?: string;
  type: InteractionType;
  direction?: InteractionDirection;
  occurredAt: string;
  summary: string;
  outcome?: InteractionOutcome;
  linkedMeetingId?: string;
  loggedBy: string;
  createdAt: string;
}

export type InteractionViewMode =
  | 'timeline_per_person'
  | 'recent'
  | 'pending_followups'
  | 'by_type'
  | 'overdue_followups'
  | 'relationship_health'
  | 'stats';
