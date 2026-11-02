import {
  can,
  scopeFor,
  type RepositoryPermissionTarget,
} from "../permissions";
import type { Session } from "../session";
import { SEED_MEETINGS } from "./seeds";
import {
  assertCanInWorkspace,
  assertRoleActionCapability,
  generateEntityId,
  loadCollectionFromStorage,
  saveCollectionToStorage,
  type MeetingRecord,
  type Repository,
} from "./types";

export const MEETINGS_WORKSPACE_STORAGE_KEY = "meetings.wira_consulting_v1";
export const MEETINGS_LEGACY_STORAGE_KEY = "wira_consulting_meetings_v1";

function loadRawMeetings(workspaceId: string): MeetingRecord[] {
  return loadCollectionFromStorage<MeetingRecord>({
    storageKey: MEETINGS_WORKSPACE_STORAGE_KEY,
    workspaceId,
    legacyKey: MEETINGS_LEGACY_STORAGE_KEY,
    requireNonEmptyLegacy: true,
    seedForDefaultWorkspace: SEED_MEETINGS,
  });
}

function buildMeetingTarget(
  meeting: Pick<MeetingRecord, "id" | "client_id" | "project_id">,
  workspaceId: string,
): RepositoryPermissionTarget {
  return {
    id: meeting.id,
    clientId: meeting.client_id,
    projectId: meeting.project_id,
    workspaceId,
  };
}

export type CreateMeetingInput = Omit<MeetingRecord, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
export type UpdateMeetingInput = Partial<Omit<MeetingRecord, "id">>;

export interface MeetingsRepository
  extends Repository<
    MeetingRecord,
    CreateMeetingInput,
    UpdateMeetingInput
  > {
  replaceAll(
    session: Session | null | undefined,
    meetings: readonly MeetingRecord[],
  ): void;
}

export const meetingsRepo: MeetingsRepository = {
  list(session: Session | null | undefined): MeetingRecord[] {
    const scope = scopeFor(session, "meeting");
    if (!scope.allowed || !session) return [];

    const workspaceId = session.workspaceId;
    return loadRawMeetings(workspaceId).filter((item) =>
      scope.filter({
        id: item.id,
        client_id: item.client_id,
        project_id: item.project_id,
        workspaceId,
      }),
    );
  },

  get(session: Session | null | undefined, id: string): MeetingRecord | null {
    if (!session || !session.workspaceId || !id) return null;
    const workspaceId = session.workspaceId;
    const item = loadRawMeetings(workspaceId).find((m) => m.id === id);
    if (!item) return null;

    if (!can(session, "read", "meeting", buildMeetingTarget(item, workspaceId))) {
      return null;
    }
    return item;
  },

  create(
    session: Session | null | undefined,
    input: CreateMeetingInput,
  ): MeetingRecord {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "meeting",
    );
    const created: MeetingRecord = {
      ...input,
      id: input.id?.trim() || generateEntityId("mtg"),
      created_at: input.created_at ?? new Date().toISOString(),
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "meeting",
      buildMeetingTarget(created, workspaceId),
    );

    const current = loadRawMeetings(workspaceId);
    const next = [...current.filter((m) => m.id !== created.id), created];
    saveCollectionToStorage(MEETINGS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return created;
  },

  update(
    session: Session | null | undefined,
    id: string,
    patch: UpdateMeetingInput,
  ): MeetingRecord | null {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "meeting",
    );
    const current = loadRawMeetings(workspaceId);
    const index = current.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const existing = current[index];
    assertCanInWorkspace(
      validSession,
      "write",
      "meeting",
      buildMeetingTarget(existing, workspaceId),
    );

    const updated: MeetingRecord = {
      ...existing,
      ...patch,
      id: existing.id,
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "meeting",
      buildMeetingTarget(updated, workspaceId),
    );

    const next = [...current];
    next[index] = updated;
    saveCollectionToStorage(MEETINGS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return updated;
  },

  remove(session: Session | null | undefined, id: string): boolean {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "delete",
      "meeting",
    );
    const current = loadRawMeetings(workspaceId);
    const existing = current.find((m) => m.id === id);
    if (!existing) return false;

    assertCanInWorkspace(
      validSession,
      "delete",
      "meeting",
      buildMeetingTarget(existing, workspaceId),
    );

    const next = current.filter((m) => m.id !== id);
    saveCollectionToStorage(MEETINGS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return true;
  },

  replaceAll(
    session: Session | null | undefined,
    meetings: readonly MeetingRecord[],
  ): void {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "meeting",
    );
    for (const item of meetings) {
      assertCanInWorkspace(
        validSession,
        "write",
        "meeting",
        buildMeetingTarget(item, workspaceId),
      );
    }
    saveCollectionToStorage(
      MEETINGS_WORKSPACE_STORAGE_KEY,
      workspaceId,
      meetings,
    );
  },
};
