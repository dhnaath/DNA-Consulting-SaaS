import {
  can,
  scopeFor,
  type RepositoryPermissionTarget,
} from "../permissions";
import type { Session } from "../session";
import { resolveProjectClientMapInWorkspace } from "./projectsRepo";
import { SEED_DELIVERABLES } from "./seeds";
import {
  assertCanInWorkspace,
  assertRoleActionCapability,
  generateEntityId,
  loadCollectionFromStorage,
  saveCollectionToStorage,
  type DeliverableRecord,
  type Repository,
} from "./types";

export const DELIVERABLES_WORKSPACE_STORAGE_KEY =
  "deliverables.wira_consulting_v1";
export const DELIVERABLES_LEGACY_STORAGE_KEY =
  "wira_consulting_deliverables_v1";

function loadRawDeliverables(workspaceId: string): DeliverableRecord[] {
  return loadCollectionFromStorage<DeliverableRecord>({
    storageKey: DELIVERABLES_WORKSPACE_STORAGE_KEY,
    workspaceId,
    legacyKey: DELIVERABLES_LEGACY_STORAGE_KEY,
    requireNonEmptyLegacy: true,
    seedForDefaultWorkspace: SEED_DELIVERABLES,
  });
}

function buildDeliverableTarget(
  deliverable: Pick<DeliverableRecord, "id" | "project_id">,
  workspaceId: string,
  projectClientMap: ReadonlyMap<string, string | null>,
): RepositoryPermissionTarget {
  const clientId = deliverable.project_id
    ? (projectClientMap.get(deliverable.project_id) ?? null)
    : null;
  return {
    id: deliverable.id,
    projectId: deliverable.project_id,
    clientId,
    workspaceId,
  };
}

export type CreateDeliverableInput = Omit<DeliverableRecord, "id"> & {
  id?: string;
};
export type UpdateDeliverableInput = Partial<Omit<DeliverableRecord, "id">>;

export interface ApproveDeliverableOptions {
  readonly disetujui_oleh?: string;
  readonly disetujui_pada?: string;
  readonly catatan?: string | null;
}

export interface DeliverablesRepository
  extends Repository<
    DeliverableRecord,
    CreateDeliverableInput,
    UpdateDeliverableInput
  > {
  approve(
    session: Session | null | undefined,
    id: string,
    options?: ApproveDeliverableOptions,
  ): DeliverableRecord | null;
  replaceAll(
    session: Session | null | undefined,
    deliverables: readonly DeliverableRecord[],
  ): void;
}

export const deliverablesRepo: DeliverablesRepository = {
  list(session: Session | null | undefined): DeliverableRecord[] {
    const scope = scopeFor(session, "deliverable");
    if (!scope.allowed || !session) return [];

    const workspaceId = session.workspaceId;
    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    return loadRawDeliverables(workspaceId).filter((item) => {
      const clientId = item.project_id
        ? (projectClientMap.get(item.project_id) ?? null)
        : null;
      return scope.filter({
        id: item.id,
        project_id: item.project_id,
        clientId,
        workspaceId,
      });
    });
  },

  get(
    session: Session | null | undefined,
    id: string,
  ): DeliverableRecord | null {
    if (!session || !session.workspaceId || !id) return null;
    const workspaceId = session.workspaceId;
    const item = loadRawDeliverables(workspaceId).find((d) => d.id === id);
    if (!item) return null;

    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    if (
      !can(
        session,
        "read",
        "deliverable",
        buildDeliverableTarget(item, workspaceId, projectClientMap),
      )
    ) {
      return null;
    }
    return item;
  },

  create(
    session: Session | null | undefined,
    input: CreateDeliverableInput,
  ): DeliverableRecord {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "deliverable",
    );
    const created: DeliverableRecord = {
      ...input,
      id: input.id?.trim() || generateEntityId("deliv"),
    };
    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    assertCanInWorkspace(
      validSession,
      "write",
      "deliverable",
      buildDeliverableTarget(created, workspaceId, projectClientMap),
    );

    const current = loadRawDeliverables(workspaceId);
    const next = [...current.filter((d) => d.id !== created.id), created];
    saveCollectionToStorage(
      DELIVERABLES_WORKSPACE_STORAGE_KEY,
      workspaceId,
      next,
    );
    return created;
  },

  update(
    session: Session | null | undefined,
    id: string,
    patch: UpdateDeliverableInput,
  ): DeliverableRecord | null {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "deliverable",
    );
    const current = loadRawDeliverables(workspaceId);
    const index = current.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const existing = current[index];
    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    assertCanInWorkspace(
      validSession,
      "write",
      "deliverable",
      buildDeliverableTarget(existing, workspaceId, projectClientMap),
    );

    const updated: DeliverableRecord = {
      ...existing,
      ...patch,
      id: existing.id,
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "deliverable",
      buildDeliverableTarget(updated, workspaceId, projectClientMap),
    );

    const next = [...current];
    next[index] = updated;
    saveCollectionToStorage(
      DELIVERABLES_WORKSPACE_STORAGE_KEY,
      workspaceId,
      next,
    );
    return updated;
  },

  approve(
    session: Session | null | undefined,
    id: string,
    options?: ApproveDeliverableOptions,
  ): DeliverableRecord | null {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "approve",
      "deliverable",
    );
    const current = loadRawDeliverables(workspaceId);
    const index = current.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const existing = current[index];
    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    assertCanInWorkspace(
      validSession,
      "approve",
      "deliverable",
      buildDeliverableTarget(existing, workspaceId, projectClientMap),
    );

    const updated: DeliverableRecord = {
      ...existing,
      status: "approved",
      disetujui_oleh: options?.disetujui_oleh ?? validSession.name,
      disetujui_pada: options?.disetujui_pada ?? new Date().toISOString(),
      ...(options?.catatan !== undefined ? { catatan: options.catatan } : {}),
    };

    const next = [...current];
    next[index] = updated;
    saveCollectionToStorage(
      DELIVERABLES_WORKSPACE_STORAGE_KEY,
      workspaceId,
      next,
    );
    return updated;
  },

  remove(session: Session | null | undefined, id: string): boolean {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "delete",
      "deliverable",
    );
    const current = loadRawDeliverables(workspaceId);
    const existing = current.find((d) => d.id === id);
    if (!existing) return false;

    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    assertCanInWorkspace(
      validSession,
      "delete",
      "deliverable",
      buildDeliverableTarget(existing, workspaceId, projectClientMap),
    );

    const next = current.filter((d) => d.id !== id);
    saveCollectionToStorage(
      DELIVERABLES_WORKSPACE_STORAGE_KEY,
      workspaceId,
      next,
    );
    return true;
  },

  replaceAll(
    session: Session | null | undefined,
    deliverables: readonly DeliverableRecord[],
  ): void {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "deliverable",
    );
    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    for (const item of deliverables) {
      assertCanInWorkspace(
        validSession,
        "write",
        "deliverable",
        buildDeliverableTarget(item, workspaceId, projectClientMap),
      );
    }
    saveCollectionToStorage(
      DELIVERABLES_WORKSPACE_STORAGE_KEY,
      workspaceId,
      deliverables,
    );
  },
};
