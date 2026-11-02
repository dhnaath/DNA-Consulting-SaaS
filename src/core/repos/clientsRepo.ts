import {
  can,
  scopeFor,
  type RepositoryPermissionTarget,
} from "../permissions";
import type { Session } from "../session";
import { SEED_CLIENTS } from "./seeds";
import {
  assertCanInWorkspace,
  assertRoleActionCapability,
  generateEntityId,
  loadCollectionFromStorage,
  saveCollectionToStorage,
  type ClientRecord,
  type Repository,
} from "./types";

export const CLIENTS_WORKSPACE_STORAGE_KEY = "clients.consulting_v1";

function loadRawClients(workspaceId: string): ClientRecord[] {
  return loadCollectionFromStorage<ClientRecord>({
    storageKey: CLIENTS_WORKSPACE_STORAGE_KEY,
    workspaceId,
    legacyKey: null,
    seedForDefaultWorkspace: SEED_CLIENTS,
  });
}

function buildClientTarget(
  client: Pick<ClientRecord, "id">,
  workspaceId: string,
): RepositoryPermissionTarget {
  return {
    id: client.id,
    clientId: client.id,
    workspaceId,
  };
}

export type CreateClientInput = Omit<ClientRecord, "id"> & { id?: string };
export type UpdateClientInput = Partial<Omit<ClientRecord, "id">>;

export const clientsRepo: Repository<
  ClientRecord,
  CreateClientInput,
  UpdateClientInput
> = {
  list(session: Session | null | undefined): ClientRecord[] {
    const scope = scopeFor(session, "client");
    if (!scope.allowed || !session) return [];

    const workspaceId = session.workspaceId;
    const all = loadRawClients(workspaceId);
    return all.filter((item) =>
      scope.filter({
        id: item.id,
        clientId: item.id,
        workspaceId,
      }),
    );
  },

  get(session: Session | null | undefined, id: string): ClientRecord | null {
    if (!session || !session.workspaceId || !id) return null;
    const workspaceId = session.workspaceId;
    const item = loadRawClients(workspaceId).find((c) => c.id === id);
    if (!item) return null;

    const target = buildClientTarget(item, workspaceId);
    if (!can(session, "read", "client", target)) {
      return null;
    }
    return item;
  },

  create(
    session: Session | null | undefined,
    input: CreateClientInput,
  ): ClientRecord {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "client",
    );
    const created: ClientRecord = {
      ...input,
      id: input.id?.trim() || generateEntityId("client"),
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "client",
      buildClientTarget(created, workspaceId),
    );

    const current = loadRawClients(workspaceId);
    const next = [...current.filter((c) => c.id !== created.id), created];
    saveCollectionToStorage(CLIENTS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return created;
  },

  update(
    session: Session | null | undefined,
    id: string,
    patch: UpdateClientInput,
  ): ClientRecord | null {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "client",
    );
    const current = loadRawClients(workspaceId);
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const existing = current[index];
    assertCanInWorkspace(
      validSession,
      "write",
      "client",
      buildClientTarget(existing, workspaceId),
    );

    const updated: ClientRecord = {
      ...existing,
      ...patch,
      id: existing.id,
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "client",
      buildClientTarget(updated, workspaceId),
    );

    const next = [...current];
    next[index] = updated;
    saveCollectionToStorage(CLIENTS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return updated;
  },

  remove(session: Session | null | undefined, id: string): boolean {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "delete",
      "client",
    );
    const current = loadRawClients(workspaceId);
    const existing = current.find((c) => c.id === id);
    if (!existing) return false;

    assertCanInWorkspace(
      validSession,
      "delete",
      "client",
      buildClientTarget(existing, workspaceId),
    );

    const next = current.filter((c) => c.id !== id);
    saveCollectionToStorage(CLIENTS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return true;
  },
};
