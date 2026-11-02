import {
  can,
  scopeFor,
  type RepositoryPermissionTarget,
} from "../permissions";
import type { Session } from "../session";
import { SEED_MESSAGES } from "./seeds";
import {
  assertCanInWorkspace,
  assertRoleActionCapability,
  generateEntityId,
  loadCollectionFromStorage,
  saveCollectionToStorage,
  type MessageRecord,
  type Repository,
} from "./types";

/**
 * Pesan diskusi konsultasi (`wira_consulting_messages_v1`) dipetakan ke resource
 * `"collaboration"` sesuai `LEGACY_KEY_MAP` (`collaboration.wira_messages_v1`).
 */
export const MESSAGES_WORKSPACE_STORAGE_KEY = "collaboration.wira_messages_v1";
export const MESSAGES_LEGACY_STORAGE_KEY = "wira_consulting_messages_v1";

function loadRawMessages(workspaceId: string): MessageRecord[] {
  return loadCollectionFromStorage<MessageRecord>({
    storageKey: MESSAGES_WORKSPACE_STORAGE_KEY,
    workspaceId,
    legacyKey: MESSAGES_LEGACY_STORAGE_KEY,
    requireNonEmptyLegacy: true,
    seedForDefaultWorkspace: SEED_MESSAGES,
  });
}

function buildMessageTarget(
  message: Pick<MessageRecord, "id" | "client_id" | "project_id">,
  workspaceId: string,
): RepositoryPermissionTarget {
  return {
    id: message.id,
    clientId: message.client_id,
    projectId: message.project_id,
    workspaceId,
  };
}

export type CreateMessageInput = Omit<MessageRecord, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
export type UpdateMessageInput = Partial<Omit<MessageRecord, "id">>;

export interface MessagesRepository
  extends Repository<
    MessageRecord,
    CreateMessageInput,
    UpdateMessageInput
  > {
  replaceAll(
    session: Session | null | undefined,
    messages: readonly MessageRecord[],
  ): void;
}

export const messagesRepo: MessagesRepository = {
  list(session: Session | null | undefined): MessageRecord[] {
    const scope = scopeFor(session, "collaboration");
    if (!scope.allowed || !session) return [];

    const workspaceId = session.workspaceId;
    return loadRawMessages(workspaceId).filter((item) =>
      scope.filter({
        id: item.id,
        client_id: item.client_id,
        project_id: item.project_id,
        workspaceId,
      }),
    );
  },

  get(session: Session | null | undefined, id: string): MessageRecord | null {
    if (!session || !session.workspaceId || !id) return null;
    const workspaceId = session.workspaceId;
    const item = loadRawMessages(workspaceId).find((m) => m.id === id);
    if (!item) return null;

    if (
      !can(
        session,
        "read",
        "collaboration",
        buildMessageTarget(item, workspaceId),
      )
    ) {
      return null;
    }
    return item;
  },

  create(
    session: Session | null | undefined,
    input: CreateMessageInput,
  ): MessageRecord {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "collaboration",
    );
    const created: MessageRecord = {
      ...input,
      id: input.id?.trim() || generateEntityId("msg"),
      created_at: input.created_at ?? new Date().toISOString(),
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "collaboration",
      buildMessageTarget(created, workspaceId),
    );

    const current = loadRawMessages(workspaceId);
    const next = [...current.filter((m) => m.id !== created.id), created];
    saveCollectionToStorage(MESSAGES_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return created;
  },

  update(
    session: Session | null | undefined,
    id: string,
    patch: UpdateMessageInput,
  ): MessageRecord | null {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "collaboration",
    );
    const current = loadRawMessages(workspaceId);
    const index = current.findIndex((m) => m.id === id);
    if (index === -1) return null;

    const existing = current[index];
    assertCanInWorkspace(
      validSession,
      "write",
      "collaboration",
      buildMessageTarget(existing, workspaceId),
    );

    const updated: MessageRecord = {
      ...existing,
      ...patch,
      id: existing.id,
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "collaboration",
      buildMessageTarget(updated, workspaceId),
    );

    const next = [...current];
    next[index] = updated;
    saveCollectionToStorage(MESSAGES_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return updated;
  },

  remove(session: Session | null | undefined, id: string): boolean {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "delete",
      "collaboration",
    );
    const current = loadRawMessages(workspaceId);
    const existing = current.find((m) => m.id === id);
    if (!existing) return false;

    assertCanInWorkspace(
      validSession,
      "delete",
      "collaboration",
      buildMessageTarget(existing, workspaceId),
    );

    const next = current.filter((m) => m.id !== id);
    saveCollectionToStorage(MESSAGES_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return true;
  },

  replaceAll(
    session: Session | null | undefined,
    messages: readonly MessageRecord[],
  ): void {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "collaboration",
    );
    for (const item of messages) {
      assertCanInWorkspace(
        validSession,
        "write",
        "collaboration",
        buildMessageTarget(item, workspaceId),
      );
    }
    saveCollectionToStorage(
      MESSAGES_WORKSPACE_STORAGE_KEY,
      workspaceId,
      messages,
    );
  },
};
