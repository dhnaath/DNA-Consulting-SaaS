import {
  can,
  scopeFor,
  type RepositoryPermissionTarget,
} from "../permissions";
import type { Session } from "../session";
import { SEED_NOTES } from "./seeds";
import {
  assertCanInWorkspace,
  assertRoleActionCapability,
  generateEntityId,
  loadCollectionFromStorage,
  saveCollectionToStorage,
  type NoteRecord,
  type Repository,
} from "./types";

export const NOTES_WORKSPACE_STORAGE_KEY = "notes.wira_knowledge_v2";
export const NOTES_LEGACY_STORAGE_KEY = "wira_catatan_knowledge_v2";

function loadRawNotes(workspaceId: string): NoteRecord[] {
  return loadCollectionFromStorage<NoteRecord>({
    storageKey: NOTES_WORKSPACE_STORAGE_KEY,
    workspaceId,
    legacyKey: NOTES_LEGACY_STORAGE_KEY,
    requireNonEmptyLegacy: false,
    seedForDefaultWorkspace: SEED_NOTES,
  });
}

function buildNoteTarget(
  note: Pick<NoteRecord, "id" | "client_id" | "project_id">,
  workspaceId: string,
): RepositoryPermissionTarget {
  return {
    id: note.id,
    clientId: note.client_id,
    projectId: note.project_id,
    workspaceId,
  };
}

export type CreateNoteInput = Omit<NoteRecord, "id" | "updated_at"> & {
  id?: string;
  updated_at?: string;
};
export type UpdateNoteInput = Partial<Omit<NoteRecord, "id">>;

export const notesRepo: Repository<
  NoteRecord,
  CreateNoteInput,
  UpdateNoteInput
> = {
  list(session: Session | null | undefined): NoteRecord[] {
    const scope = scopeFor(session, "note");
    if (!scope.allowed || !session) return [];

    const workspaceId = session.workspaceId;
    return loadRawNotes(workspaceId).filter((item) =>
      scope.filter({
        id: item.id,
        client_id: item.client_id,
        project_id: item.project_id,
        workspaceId,
      }),
    );
  },

  get(session: Session | null | undefined, id: string): NoteRecord | null {
    if (!session || !session.workspaceId || !id) return null;
    const workspaceId = session.workspaceId;
    const item = loadRawNotes(workspaceId).find((n) => n.id === id);
    if (!item) return null;

    if (!can(session, "read", "note", buildNoteTarget(item, workspaceId))) {
      return null;
    }
    return item;
  },

  create(
    session: Session | null | undefined,
    input: CreateNoteInput,
  ): NoteRecord {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "note",
    );
    const created: NoteRecord = {
      ...input,
      id: input.id?.trim() || generateEntityId("note"),
      updated_at: input.updated_at ?? new Date().toISOString(),
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "note",
      buildNoteTarget(created, workspaceId),
    );

    const current = loadRawNotes(workspaceId);
    const next = [created, ...current.filter((n) => n.id !== created.id)];
    saveCollectionToStorage(NOTES_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return created;
  },

  update(
    session: Session | null | undefined,
    id: string,
    patch: UpdateNoteInput,
  ): NoteRecord | null {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "note",
    );
    const current = loadRawNotes(workspaceId);
    const index = current.findIndex((n) => n.id === id);
    if (index === -1) return null;

    const existing = current[index];
    assertCanInWorkspace(
      validSession,
      "write",
      "note",
      buildNoteTarget(existing, workspaceId),
    );

    const updated: NoteRecord = {
      ...existing,
      ...patch,
      id: existing.id,
      updated_at: patch.updated_at ?? new Date().toISOString(),
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "note",
      buildNoteTarget(updated, workspaceId),
    );

    const next = [...current];
    next[index] = updated;
    saveCollectionToStorage(NOTES_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return updated;
  },

  remove(session: Session | null | undefined, id: string): boolean {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "delete",
      "note",
    );
    const current = loadRawNotes(workspaceId);
    const existing = current.find((n) => n.id === id);
    if (!existing) return false;

    assertCanInWorkspace(
      validSession,
      "delete",
      "note",
      buildNoteTarget(existing, workspaceId),
    );

    const next = current.filter((n) => n.id !== id);
    saveCollectionToStorage(NOTES_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return true;
  },
};
