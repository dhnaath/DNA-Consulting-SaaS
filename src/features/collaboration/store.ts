/**
 * CATATAN ARSITEKTUR IZIN:
 * Role dan permission di dalam store ini (`roles`, `roleId`, `permissions`) saat ini HANYA
 * merupakan data tampilan modul Collaboration dan TIDAK dihubungkan ke pemeriksaan izin `can()`.
 * `MATRIX` di `src/core/permissions.ts` tetap menjadi satu-satunya sumber kebenaran otorisasi.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import { getCurrentSession } from "../../core/session";
import { DEFAULT_WORKSPACE_ID } from "../../core/storage";
import {
  Workspace,
  Member,
  Team,
  Role,
  Permission,
  GenericComment,
  Share,
  ActivityFeedItem,
  MemberStatus,
} from "./types";

function currentWorkspaceId(): string {
  return getCurrentSession()?.workspaceId || DEFAULT_WORKSPACE_ID;
}

interface CollaborationStore {
  workspace: Workspace;
  members: Member[];
  teams: Team[];
  roles: Role[];
  comments: GenericComment[];
  shares: Share[];
  activityFeed: ActivityFeedItem[];

  // Workspace
  updateWorkspace: (updates: Partial<Workspace>) => void;

  // Members
  inviteMember: (data: Omit<Member, "id" | "workspaceId" | "joinedAt">) => void;
  updateMemberStatus: (memberId: string, status: MemberStatus) => void;
  updateMemberRole: (memberId: string, roleId: string, roleName: string) => void;
  removeMember: (memberId: string) => void;

  // Teams
  createTeam: (data: Omit<Team, "id" | "workspaceId">) => void;
  addMemberToTeam: (teamId: string, memberId: string) => void;
  removeMemberFromTeam: (teamId: string, memberId: string) => void;

  // Roles & Permissions
  createRole: (name: string, permissions: Omit<Permission, "id" | "roleId">[]) => void;
  updateRolePermissions: (roleId: string, permissions: Permission[]) => void;

  // Generic Comments
  addComment: (comment: Omit<GenericComment, "id" | "createdAt">) => void;
  deleteComment: (commentId: string) => void;

  // Sharing
  createShare: (share: Omit<Share, "id" | "sharedAt">) => void;
  revokeShare: (shareId: string) => void;

  // Activity Feed Logging
  logActivity: (item: Omit<ActivityFeedItem, "id" | "workspaceId" | "timestamp">) => void;
}

const INITIAL_ROLES: Role[] = [
  {
    id: "role-admin",
    workspaceId: "ws-main",
    name: "Workspace Administrator",
    isSystemDefault: true,
    permissions: [
      { id: "p-adm-1", roleId: "role-admin", resourceType: "app", resourceRef: "*", actions: ["read", "write", "delete", "share", "approve"] },
    ],
  },
  {
    id: "role-editor",
    workspaceId: "ws-main",
    name: "Standard Editor",
    isSystemDefault: true,
    permissions: [
      { id: "p-ed-1", roleId: "role-editor", resourceType: "app", resourceRef: "task_manager", actions: ["read", "write"] },
      { id: "p-ed-2", roleId: "role-editor", resourceType: "app", resourceRef: "deliverable_manager", actions: ["read", "write"] },
      { id: "p-ed-3", roleId: "role-editor", resourceType: "app", resourceRef: "wiki", actions: ["read", "write"] },
    ],
  },
  {
    id: "role-viewer",
    workspaceId: "ws-main",
    name: "Read-Only Stakeholder",
    isSystemDefault: true,
    permissions: [
      { id: "p-vw-1", roleId: "role-viewer", resourceType: "app", resourceRef: "*", actions: ["read"] },
    ],
  },
  {
    id: "role-finance",
    workspaceId: "ws-main",
    name: "Finance Approver",
    isSystemDefault: false,
    permissions: [
      { id: "p-fn-1", roleId: "role-finance", resourceType: "app", resourceRef: "financial_apps", actions: ["read", "write", "approve"] },
      { id: "p-fn-2", roleId: "role-finance", resourceType: "app", resourceRef: "deliverable_manager", actions: ["read", "approve"] },
    ],
  },
];

const INITIAL_MEMBERS: Member[] = [
  { id: "m-1", workspaceId: "ws-main", userId: "u-andi", name: "Andi Pratama", email: "andi@company.com", roleId: "role-admin", roleName: "Workspace Administrator", status: "active", joinedAt: "2026-01-10" },
  { id: "m-2", workspaceId: "ws-main", userId: "u-dhia", name: "Dhia Ramadhan", email: "dhia@company.com", roleId: "role-editor", roleName: "Standard Editor", status: "active", joinedAt: "2026-02-15" },
  { id: "m-3", workspaceId: "ws-main", userId: "u-siti", name: "Siti Rahma", email: "siti@company.com", roleId: "role-editor", roleName: "Standard Editor", status: "active", joinedAt: "2026-03-01" },
  { id: "m-4", workspaceId: "ws-main", userId: "u-budi", name: "Budi Santoso", email: "budi@company.com", roleId: "role-finance", roleName: "Finance Approver", status: "active", joinedAt: "2026-03-20" },
  { id: "m-5", workspaceId: "ws-main", userId: "u-ext", name: "Klien Sponsor (Bank Mandiri)", email: "mandiri@client.com", roleId: "role-viewer", roleName: "Read-Only Stakeholder", status: "invited", joinedAt: "2026-09-21" },
];

const INITIAL_TEAMS: Team[] = [
  { id: "team-eng", workspaceId: "ws-main", name: "Core Engineering", description: "Architecture, backend engines, and database migrations", memberIds: ["m-1", "m-2"] },
  { id: "team-design", workspaceId: "ws-main", name: "Product Design", description: "UI/UX, brand design kits, and deliverable review", memberIds: ["m-3"] },
  { id: "team-finance", workspaceId: "ws-main", name: "Finance & Governance", description: "Budget audits, reconciliations, and vendor contracts", memberIds: ["m-4"] },
];

const INITIAL_COMMENTS: GenericComment[] = [
  {
    id: "cm-1",
    entityType: "deliverable",
    entityId: "deliv-01",
    entityTitle: "Client Portal Security & RBAC Architecture",
    authorId: "u-dhia",
    authorName: "Dhia Ramadhan",
    content: "Please ensure session timeout matches the 15-minute banking regulatory guideline.",
    mentions: ["u-andi"],
    createdAt: "2026-09-22T08:30:00Z",
  },
  {
    id: "cm-2",
    entityType: "task",
    entityId: "task-auto-801",
    entityTitle: "Implement SyncEvent dispatcher for Task Manager",
    authorId: "u-andi",
    authorName: "Andi Pratama",
    content: "SyncEvent payloads must adhere strictly to deterministic search specs.",
    mentions: [],
    createdAt: "2026-09-23T10:15:00Z",
  },
];

const INITIAL_SHARES: Share[] = [
  {
    id: "sh-1",
    entityType: "deliverable",
    entityId: "deliv-01",
    entityTitle: "Client Portal Security & RBAC Architecture",
    sharedWithType: "team",
    sharedWithId: "team-eng",
    sharedWithName: "Core Engineering",
    permissionLevel: "edit",
    sharedBy: "Andi Pratama",
    sharedAt: "2026-09-20T11:00:00Z",
  },
  {
    id: "sh-2",
    entityType: "deliverable",
    entityId: "deliv-02",
    entityTitle: "Brand Asset Kit & Marketing Design System",
    sharedWithType: "link",
    sharedWithName: "Public Partner Link",
    permissionLevel: "view",
    sharedBy: "Siti Rahma",
    sharedAt: "2026-09-22T14:00:00Z",
    token: "tok-sec-9812401",
    expiresAt: "2026-10-22",
  },
];

const INITIAL_ACTIVITY: ActivityFeedItem[] = [
  { id: "act-1", workspaceId: "ws-main", actorId: "u-andi", actorName: "Andi Pratama", action: "created", entityType: "meeting", entityId: "mtg-02", entityTitle: "Weekly Engineering Sync — Sprint 43", sourceApp: "meeting_manager", timestamp: "2026-09-24T09:00:00Z" },
  { id: "act-2", workspaceId: "ws-main", actorId: "u-dhia", actorName: "Dhia Ramadhan", action: "commented", entityType: "deliverable", entityId: "deliv-01", entityTitle: "Client Portal Security Specification", sourceApp: "deliverable_manager", timestamp: "2026-09-23T14:20:00Z" },
  { id: "act-3", workspaceId: "ws-main", actorId: "u-siti", actorName: "Siti Rahma", action: "completed", entityType: "workflow", entityId: "wf-inst-2", entityTitle: "Brand Asset Kit Pipeline", sourceApp: "workflow_manager", timestamp: "2026-09-23T11:00:00Z" },
  { id: "act-4", workspaceId: "ws-main", actorId: "u-andi", actorName: "Andi Pratama", action: "shared", entityType: "deliverable", entityId: "deliv-01", entityTitle: "RBAC Architecture", sourceApp: "collaboration", timestamp: "2026-09-22T10:00:00Z" },
];

export const useCollaborationStore = create<CollaborationStore>()(
  persist(
    (set) => ({
      workspace: {
        id: "ws-main",
        name: "PT Nusantara Digital Workspace",
        plan: "enterprise",
        ownerId: "u-andi",
        createdAt: "2026-01-01T00:00:00Z",
      },
      members: INITIAL_MEMBERS,
      teams: INITIAL_TEAMS,
      roles: INITIAL_ROLES,
      comments: INITIAL_COMMENTS,
      shares: INITIAL_SHARES,
      activityFeed: INITIAL_ACTIVITY,

      updateWorkspace: (updates) => {
        set((state) => ({ workspace: { ...state.workspace, ...updates } }));
      },

      inviteMember: (data) => {
        const newMember: Member = {
          ...data,
          id: `m-${Date.now()}`,
          workspaceId: currentWorkspaceId(),
          joinedAt: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ members: [...state.members, newMember] }));
      },

      updateMemberStatus: (memberId, status) => {
        set((state) => ({
          members: state.members.map((m) => (m.id === memberId ? { ...m, status } : m)),
        }));
      },

      updateMemberRole: (memberId, roleId, roleName) => {
        set((state) => ({
          members: state.members.map((m) => (m.id === memberId ? { ...m, roleId, roleName } : m)),
        }));
      },

      removeMember: (memberId) => {
        set((state) => ({
          members: state.members.filter((m) => m.id !== memberId),
        }));
      },

      createTeam: (data) => {
        const newTeam: Team = {
          ...data,
          id: `team-${Date.now()}`,
          workspaceId: currentWorkspaceId(),
        };
        set((state) => ({ teams: [...state.teams, newTeam] }));
      },

      addMemberToTeam: (teamId, memberId) => {
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId && !t.memberIds.includes(memberId)
              ? { ...t, memberIds: [...t.memberIds, memberId] }
              : t
          ),
        }));
      },

      removeMemberFromTeam: (teamId, memberId) => {
        set((state) => ({
          teams: state.teams.map((t) =>
            t.id === teamId ? { ...t, memberIds: t.memberIds.filter((id) => id !== memberId) } : t
          ),
        }));
      },

      createRole: (name, permissionsData) => {
        const roleId = `role-${Date.now()}`;
        const newRole: Role = {
          id: roleId,
          workspaceId: currentWorkspaceId(),
          name,
          isSystemDefault: false,
          permissions: permissionsData.map((p, idx) => ({
            ...p,
            id: `p-${Date.now()}-${idx}`,
            roleId,
          })),
        };
        set((state) => ({ roles: [...state.roles, newRole] }));
      },

      updateRolePermissions: (roleId, permissions) => {
        set((state) => ({
          roles: state.roles.map((r) => (r.id === roleId ? { ...r, permissions } : r)),
        }));
      },

      addComment: (commentData) => {
        const newComment: GenericComment = {
          ...commentData,
          id: `cm-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ comments: [newComment, ...state.comments] }));
      },

      deleteComment: (commentId) => {
        set((state) => ({ comments: state.comments.filter((c) => c.id !== commentId) }));
      },

      createShare: (shareData) => {
        const newShare: Share = {
          ...shareData,
          id: `sh-${Date.now()}`,
          sharedAt: new Date().toISOString(),
        };
        set((state) => ({ shares: [newShare, ...state.shares] }));
      },

      revokeShare: (shareId) => {
        set((state) => ({ shares: state.shares.filter((s) => s.id !== shareId) }));
      },

      logActivity: (item) => {
        const newAct: ActivityFeedItem = {
          ...item,
          id: `act-${Date.now()}`,
          workspaceId: currentWorkspaceId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ activityFeed: [newAct, ...state.activityFeed] }));
      },
    }),
    {
      name: "ecosystem-collaboration-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
