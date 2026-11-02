export type MemberStatus = "invited" | "active" | "suspended";

export type ResourceType = "app" | "entity_type" | "specific_entity";

export type PermissionAction = "read" | "write" | "delete" | "share" | "approve";

export type SharedWithType = "user" | "team" | "link";

export type PermissionLevel = "view" | "comment" | "edit";

export interface Permission {
  id: string;
  roleId: string;
  resourceType: ResourceType;
  resourceRef: string; // e.g. "task_manager", "project:*", "*"
  actions: PermissionAction[];
}

export interface Role {
  id: string;
  workspaceId: string;
  name: string;
  permissions: Permission[];
  isSystemDefault: boolean;
}

export interface Member {
  id: string;
  workspaceId: string;
  userId: string;
  name: string;
  email: string;
  avatar?: string;
  roleId: string;
  roleName: string;
  status: MemberStatus;
  joinedAt: string;
}

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
  description?: string;
  memberIds: string[];
  parentTeamId?: string;
}

export interface GenericComment {
  id: string;
  entityType: string; // "task" | "project" | "article" | "deliverable" | "meeting"
  entityId: string;
  entityTitle?: string;
  authorId: string;
  authorName: string;
  content: string;
  parentCommentId?: string;
  mentions: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Share {
  id: string;
  entityType: string;
  entityId: string;
  entityTitle: string;
  sharedWithType: SharedWithType;
  sharedWithId?: string;
  sharedWithName?: string;
  permissionLevel: PermissionLevel;
  sharedBy: string;
  sharedAt: string;
  expiresAt?: string;
  token?: string; // for public link
}

export interface ActivityFeedItem {
  id: string;
  workspaceId: string;
  actorId: string;
  actorName: string;
  action: "created" | "updated" | "commented" | "shared" | "completed" | "deleted";
  entityType: string;
  entityId: string;
  entityTitle: string;
  sourceApp: string; // "task_manager" | "deliverables" | "wiki" | "calendar" | "forms"
  timestamp: string;
}

export interface Workspace {
  id: string;
  name: string;
  plan: "starter" | "professional" | "enterprise";
  ownerId: string;
  createdAt: string;
}
