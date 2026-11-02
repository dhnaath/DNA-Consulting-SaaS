import {
  can,
  scopeFor,
  type RepositoryPermissionTarget,
} from "../permissions";
import type { Session } from "../session";
import { resolveProjectClientMapInWorkspace } from "./projectsRepo";
import { SEED_TASKS } from "./seeds";
import {
  assertCanInWorkspace,
  assertRoleActionCapability,
  generateEntityId,
  loadCollectionFromStorage,
  saveCollectionToStorage,
  type Repository,
  type TaskRecord,
} from "./types";

export const TASKS_WORKSPACE_STORAGE_KEY = "tasks.consulting_v1";

function loadRawTasks(workspaceId: string): TaskRecord[] {
  return loadCollectionFromStorage<TaskRecord>({
    storageKey: TASKS_WORKSPACE_STORAGE_KEY,
    workspaceId,
    legacyKey: null,
    seedForDefaultWorkspace: SEED_TASKS,
  });
}

function buildTaskTarget(
  task: Pick<TaskRecord, "id" | "project_id">,
  workspaceId: string,
  projectClientMap: ReadonlyMap<string, string | null>,
): RepositoryPermissionTarget {
  const clientId = task.project_id
    ? (projectClientMap.get(task.project_id) ?? null)
    : null;
  return {
    id: task.id,
    projectId: task.project_id,
    clientId,
    workspaceId,
  };
}

export type CreateTaskInput = Omit<TaskRecord, "id"> & { id?: string };
export type UpdateTaskInput = Partial<Omit<TaskRecord, "id">>;

export const tasksRepo: Repository<
  TaskRecord,
  CreateTaskInput,
  UpdateTaskInput
> = {
  list(session: Session | null | undefined): TaskRecord[] {
    const scope = scopeFor(session, "task");
    if (!scope.allowed || !session) return [];

    const workspaceId = session.workspaceId;
    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    return loadRawTasks(workspaceId).filter((item) => {
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

  get(session: Session | null | undefined, id: string): TaskRecord | null {
    if (!session || !session.workspaceId || !id) return null;
    const workspaceId = session.workspaceId;
    const item = loadRawTasks(workspaceId).find((t) => t.id === id);
    if (!item) return null;

    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    if (
      !can(
        session,
        "read",
        "task",
        buildTaskTarget(item, workspaceId, projectClientMap),
      )
    ) {
      return null;
    }
    return item;
  },

  create(
    session: Session | null | undefined,
    input: CreateTaskInput,
  ): TaskRecord {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "task",
    );
    const created: TaskRecord = {
      ...input,
      id: input.id?.trim() || generateEntityId("task"),
    };
    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    assertCanInWorkspace(
      validSession,
      "write",
      "task",
      buildTaskTarget(created, workspaceId, projectClientMap),
    );

    const current = loadRawTasks(workspaceId);
    const next = [...current.filter((t) => t.id !== created.id), created];
    saveCollectionToStorage(TASKS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return created;
  },

  update(
    session: Session | null | undefined,
    id: string,
    patch: UpdateTaskInput,
  ): TaskRecord | null {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "task",
    );
    const current = loadRawTasks(workspaceId);
    const index = current.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const existing = current[index];
    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    assertCanInWorkspace(
      validSession,
      "write",
      "task",
      buildTaskTarget(existing, workspaceId, projectClientMap),
    );

    const updated: TaskRecord = {
      ...existing,
      ...patch,
      id: existing.id,
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "task",
      buildTaskTarget(updated, workspaceId, projectClientMap),
    );

    const next = [...current];
    next[index] = updated;
    saveCollectionToStorage(TASKS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return updated;
  },

  remove(session: Session | null | undefined, id: string): boolean {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "delete",
      "task",
    );
    const current = loadRawTasks(workspaceId);
    const existing = current.find((t) => t.id === id);
    if (!existing) return false;

    const projectClientMap = resolveProjectClientMapInWorkspace(workspaceId);
    assertCanInWorkspace(
      validSession,
      "delete",
      "task",
      buildTaskTarget(existing, workspaceId, projectClientMap),
    );

    const next = current.filter((t) => t.id !== id);
    saveCollectionToStorage(TASKS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return true;
  },
};
