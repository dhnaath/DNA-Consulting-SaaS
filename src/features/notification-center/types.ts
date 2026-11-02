export type NotificationCategoryType =
  | 'reminder'
  | 'assignment'
  | 'mention'
  | 'approval_request'
  | 'comment'
  | 'system';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export type DeliveryChannel = 'push' | 'email' | 'in_app';

export interface QuickAction {
  id: string;
  notificationId: string;
  label: string;
  actionType: 'approve' | 'reject' | 'complete' | 'reply' | 'custom';
  targetApp: string;
  targetId: string;
  performed?: boolean;
}

export interface AppNotification {
  id: string;
  recipientId: string;
  type: NotificationCategoryType;
  title: string;
  body?: string;
  sourceApp: string; // "task_manager" | "meeting_manager" | "deliverable_manager" | "workflow_manager" | "collaboration" | "approval_manager" | "system"
  sourceId: string;
  status: NotificationStatus;
  createdAt: string;
  readAt?: string | null;
  quickActions?: QuickAction[];
}

export interface NotificationTypeMeta {
  key: NotificationCategoryType;
  label: string;
  icon: string;
  defaultChannel: DeliveryChannel;
}

export interface NotificationPreference {
  userId: string;
  type: NotificationCategoryType;
  channels: DeliveryChannel[];
  isMuted: boolean;
}

export type NotificationViewMode = 'inbox' | 'unread' | 'by_type' | 'by_app' | 'archived' | 'preferences' | 'stats';
