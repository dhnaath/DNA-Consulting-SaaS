import {
  can,
  scopeFor,
  type RepositoryPermissionTarget,
} from "../permissions";
import type { Session } from "../session";
import { SEED_PROJECTS } from "./seeds";
import {
  assertCanInWorkspace,
  assertRoleActionCapability,
  generateEntityId,
  loadCollectionFromStorage,
  saveCollectionToStorage,
  type ProjectRecord,
  type Repository,
} from "./types";

export const PROJECTS_WORKSPACE_STORAGE_KEY = "projects.wira_consulting_v1";
export const PROJECTS_LEGACY_STORAGE_KEY = "wira_consulting_projects_v1";

function loadRawProjects(workspaceId: string): ProjectRecord[] {
  return loadCollectionFromStorage<ProjectRecord>({
    storageKey: PROJECTS_WORKSPACE_STORAGE_KEY,
    workspaceId,
    legacyKey: PROJECTS_LEGACY_STORAGE_KEY,
    requireNonEmptyLegacy: true,
    seedForDefaultWorkspace: SEED_PROJECTS,
  });
}

/**
 * Helper internal khusus antar-repository di dalam satu workspace untuk menyelesaikan
 * kepemilikan `client_id` dari sebuah `project_id` (misalnya bagi `tasksRepo` dan `deliverablesRepo`
 * yang model datanya hanya menyimpan `project_id`). Tidak diekspos ke komponen UI.
 */
export function resolveProjectClientMapInWorkspace(
  workspaceId: string,
): ReadonlyMap<string, string | null> {
  const map = new Map<string, string | null>();
  for (const project of loadRawProjects(workspaceId)) {
    map.set(project.id, project.client_id ?? null);
  }
  return map;
}

function buildProjectTarget(
  project: Pick<ProjectRecord, "id" | "client_id">,
  workspaceId: string,
): RepositoryPermissionTarget {
  return {
    id: project.id,
    projectId: project.id,
    clientId: project.client_id,
    workspaceId,
  };
}

export type CreateProjectInput = Omit<ProjectRecord, "id"> & { id?: string };
export type UpdateProjectInput = Partial<Omit<ProjectRecord, "id">>;

export interface ProjectsRepository
  extends Repository<ProjectRecord, CreateProjectInput, UpdateProjectInput> {
  replaceAll(
    session: Session | null | undefined,
    projects: readonly ProjectRecord[],
  ): void;
}

export const projectsRepo: ProjectsRepository = {
  list(session: Session | null | undefined): ProjectRecord[] {
    const scope = scopeFor(session, "project");
    if (!scope.allowed || !session) return [];

    const workspaceId = session.workspaceId;
    return loadRawProjects(workspaceId).filter((item) =>
      scope.filter({
        id: item.id,
        projectId: item.id,
        client_id: item.client_id,
        workspaceId,
      }),
    );
  },

  get(session: Session | null | undefined, id: string): ProjectRecord | null {
    if (!session || !session.workspaceId || !id) return null;
    const workspaceId = session.workspaceId;
    const item = loadRawProjects(workspaceId).find((p) => p.id === id);
    if (!item) return null;

    if (!can(session, "read", "project", buildProjectTarget(item, workspaceId))) {
      return null;
    }
    return item;
  },

  create(
    session: Session | null | undefined,
    input: CreateProjectInput,
  ): ProjectRecord {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "project",
    );
    const created: ProjectRecord = {
      ...input,
      id: input.id?.trim() || generateEntityId("proj"),
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "project",
      buildProjectTarget(created, workspaceId),
    );

    const current = loadRawProjects(workspaceId);
    const next = [...current.filter((p) => p.id !== created.id), created];
    saveCollectionToStorage(PROJECTS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return created;
  },

  update(
    session: Session | null | undefined,
    id: string,
    patch: UpdateProjectInput,
  ): ProjectRecord | null {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "project",
    );
    const current = loadRawProjects(workspaceId);
    const index = current.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = current[index];
    assertCanInWorkspace(
      validSession,
      "write",
      "project",
      buildProjectTarget(existing, workspaceId),
    );

    const updated: ProjectRecord = {
      ...existing,
      ...patch,
      id: existing.id,
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "project",
      buildProjectTarget(updated, workspaceId),
    );

    const next = [...current];
    next[index] = updated;
    saveCollectionToStorage(PROJECTS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return updated;
  },

  remove(session: Session | null | undefined, id: string): boolean {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "delete",
      "project",
    );
    const current = loadRawProjects(workspaceId);
    const existing = current.find((p) => p.id === id);
    if (!existing) return false;

    assertCanInWorkspace(
      validSession,
      "delete",
      "project",
      buildProjectTarget(existing, workspaceId),
    );

    const next = current.filter((p) => p.id !== id);
    saveCollectionToStorage(PROJECTS_WORKSPACE_STORAGE_KEY, workspaceId, next);
    return true;
  },

  replaceAll(
    session: Session | null | undefined,
    projects: readonly ProjectRecord[],
  ): void {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "project",
    );
    assertCanInWorkspace(validSession, "write", "project", { workspaceId });
    for (const item of projects) {
      assertCanInWorkspace(
        validSession,
        "write",
        "project",
        buildProjectTarget(item, workspaceId),
      );
    }
    saveCollectionToStorage(PROJECTS_WORKSPACE_STORAGE_KEY, workspaceId, projects);
  },
};
