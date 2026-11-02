import type { Role, Session } from "./session";

/**
 * Kata kerja izin standar yang selaras penuh dengan `PermissionAction`
 * pada `src/features/collaboration/types.ts` (`"read" | "write" | "delete" | "share" | "approve"`).
 */
export type Action = "read" | "write" | "delete" | "share" | "approve";

export type Resource =
  | "client"
  | "project"
  | "task"
  | "deliverable"
  | "document"
  | "note"
  | "approval"
  | "meeting"
  | "finance"
  | "settings"
  | "collaboration"
  | "personal_tools";

/**
 * Metadata konteks entitas untuk pemeriksaan izin berbasis kepemilikan/cakupan
 * (`workspaceId`, tenant `clientId` untuk klien, dan daftar `projectIds` untuk mitra).
 *
 * ATURAN WAJIB REPOSITORY:
 * Setiap pemanggilan `can()` dari lapisan repository WAJIB menyertakan `target.workspaceId`
 * (gunakan tipe `RepositoryPermissionTarget` pada helper repository agar ditegakkan oleh TypeScript).
 */
export interface PermissionTarget {
  readonly id?: string;
  readonly clientId?: string | null;
  readonly projectId?: string | null;
  readonly workspaceId?: string | null;
}

/**
 * Kontrak target khusus lapisan repository yang mewajibkan `workspaceId` bertipe `string`
 * pada waktu kompilasi sehingga pemeriksaan isolasi workspace di `can()` selalu aktif.
 */
export interface RepositoryPermissionTarget extends PermissionTarget {
  readonly workspaceId: string;
}

/**
 * Bentuk minimal item yang dapat difilter oleh `scopeFor(session, resource)`.
 * Mendukung konvensi camelCase (`clientId`, `projectId`) maupun snake_case (`client_id`, `project_id`).
 */
export interface ScopedItemShape {
  readonly id?: string;
  readonly workspaceId?: string | null;
  readonly clientId?: string | null;
  readonly client_id?: string | null;
  readonly projectId?: string | null;
  readonly project_id?: string | null;
}

export interface ResourceScope<T extends ScopedItemShape = ScopedItemShape> {
  readonly allowed: boolean;
  readonly filter: (item: T) => boolean;
}

const ALL_ACTIONS: readonly Action[] = Object.freeze([
  "read",
  "write",
  "delete",
  "share",
  "approve",
]);

const READ_ONLY: readonly Action[] = Object.freeze(["read"]);
const READ_WRITE: readonly Action[] = Object.freeze(["read", "write"]);
const READ_APPROVE: readonly Action[] = Object.freeze(["read", "approve"]);
const NO_ACTIONS: readonly Action[] = Object.freeze([]);

/**
 * Satu-satunya sumber kebenaran matriks izin tingkat peran (`MATRIX[role][resource]: Action[]`).
 *
 * Catatan:
 * - `mitra`: `project` hanya `READ_ONLY` (`["read"]`), sedangkan `task` dan `deliverable`
 *   `READ_WRITE` (`["read", "write"]`) terbatas pada `session.projectIds`.
 * - Untuk `mitra` dan `klien`, kelayakan di `MATRIX` adalah syarat perlu,
 *   namun fungsi `can()` dan `scopeFor()` juga mewajibkan kecocokan cakupan (`projectIds` / `clientId`).
 */
export const MATRIX: Readonly<
  Record<Role, Readonly<Record<Resource, readonly Action[]>>>
> = Object.freeze({
  konsultan: Object.freeze({
    client: ALL_ACTIONS,
    project: ALL_ACTIONS,
    task: ALL_ACTIONS,
    deliverable: ALL_ACTIONS,
    document: ALL_ACTIONS,
    note: ALL_ACTIONS,
    approval: ALL_ACTIONS,
    meeting: ALL_ACTIONS,
    finance: ALL_ACTIONS,
    settings: ALL_ACTIONS,
    collaboration: ALL_ACTIONS,
    personal_tools: ALL_ACTIONS,
  }),
  mitra: Object.freeze({
    client: NO_ACTIONS,
    project: READ_ONLY,
    task: READ_WRITE,
    deliverable: READ_WRITE,
    document: NO_ACTIONS,
    note: NO_ACTIONS,
    approval: NO_ACTIONS,
    meeting: NO_ACTIONS,
    finance: NO_ACTIONS,
    settings: NO_ACTIONS,
    collaboration: NO_ACTIONS,
    personal_tools: NO_ACTIONS,
  }),
  klien: Object.freeze({
    client: NO_ACTIONS,
    project: READ_ONLY,
    task: NO_ACTIONS,
    deliverable: READ_APPROVE,
    document: READ_ONLY,
    note: NO_ACTIONS,
    approval: NO_ACTIONS,
    meeting: NO_ACTIONS,
    finance: NO_ACTIONS,
    settings: NO_ACTIONS,
    collaboration: NO_ACTIONS,
    personal_tools: NO_ACTIONS,
  }),
});

/**
 * Jembatan terminologi dengan sistem role internal di `src/features/collaboration/store.ts`
 * tanpa menyentuh file tersebut:
 * - `konsultan` <-> `"role-admin"` ("Workspace Administrator", akses `"*"`)
 *   (serta mencakup kapabilitas `"role-finance"` / "Finance Approver" di internal firma)
 * - `mitra`     <-> `"role-editor"` ("Standard Editor", read proyek & read/write tugas/deliverable terpilih)
 * - `klien`     <-> `"role-viewer"` ("Read-Only Stakeholder", read pada proyek/dokumen & approve deliverable)
 */
export const COLLABORATION_ROLE_MAP: Readonly<
  Record<
    Role,
    {
      readonly primaryCollaborationRoleId: "role-admin" | "role-editor" | "role-viewer";
      readonly relatedCollaborationRoleIds: readonly string[];
      readonly collaborationRoleLabel: string;
    }
  >
> = Object.freeze({
  konsultan: {
    primaryCollaborationRoleId: "role-admin",
    relatedCollaborationRoleIds: ["role-admin", "role-finance"],
    collaborationRoleLabel: "Workspace Administrator",
  },
  mitra: {
    primaryCollaborationRoleId: "role-editor",
    relatedCollaborationRoleIds: ["role-editor"],
    collaborationRoleLabel: "Standard Editor",
  },
  klien: {
    primaryCollaborationRoleId: "role-viewer",
    relatedCollaborationRoleIds: ["role-viewer"],
    collaborationRoleLabel: "Read-Only Stakeholder",
  },
});

/**
 * Memeriksa apakah suatu `Role` secara umum memiliki aksi pada resource di `MATRIX`,
 * tanpa memeriksa kepemilikan entitas spesifik (berguna untuk penyembunyian menu tingkat tinggi).
 */
export function hasRoleCapability(
  role: Role,
  action: Action,
  resource: Resource,
): boolean {
  const allowedActions = MATRIX[role]?.[resource];
  if (!allowedActions) return false;
  return allowedActions.includes(action);
}

function isValidNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

function matchesSessionWorkspace(
  sessionWorkspaceId: string,
  itemWorkspaceId: string | null | undefined,
): boolean {
  if (itemWorkspaceId === undefined || itemWorkspaceId === null) {
    return true;
  }
  return itemWorkspaceId.length > 0 && itemWorkspaceId === sessionWorkspaceId;
}

const DENIED_FILTER = (): boolean => false;

const DENIED_SCOPE: ResourceScope<ScopedItemShape> = Object.freeze({
  allowed: false,
  filter: DENIED_FILTER,
});

/**
 * Menghasilkan predikat penyaringan daftar untuk suatu resource (`scopeFor(session, resource)`).
 *
 * Aturan:
 * - Fail-closed: bila `session` tidak ada atau field wajib per peran tidak lengkap
 *   (`userId`, `workspaceId`, `role`, `clientId` untuk `klien`, `projectIds` tidak kosong untuk `mitra`),
 *   mengembalikan `{ allowed: false, filter: () => false }`.
 * - Bila `MATRIX[role][resource]` tidak memiliki hak `"read"`, `allowed: false`.
 *   - `mitra`: `finance`, `settings`, `collaboration`, `personal_tools` (dan selain `project`/`task`/`deliverable`) => `allowed: false`.
 *   - `klien`: semua resource selain `project`/`deliverable`/`document` => `allowed: false`.
 * - `konsultan`: `allowed: true`, `filter` selalu `true` selama `workspaceId` cocok.
 * - `mitra`: `allowed: true` hanya pada `project`/`task`/`deliverable`, `filter` mencocokkan `id`/`projectId`/`project_id` dengan `session.projectIds` (dan `workspaceId`).
 * - `klien`: `allowed: true` hanya pada `project`/`deliverable`/`document`, `filter` mencocokkan `clientId`/`client_id` dengan `session.clientId` (dan `workspaceId`).
 */
export function scopeFor<T extends ScopedItemShape = ScopedItemShape>(
  session: Session | null | undefined,
  resource: Resource,
): ResourceScope<T> {
  if (
    !session ||
    !isValidNonEmptyString(session.userId) ||
    !isValidNonEmptyString(session.workspaceId) ||
    !session.role
  ) {
    return DENIED_SCOPE as ResourceScope<T>;
  }

  if (!hasRoleCapability(session.role, "read", resource)) {
    return DENIED_SCOPE as ResourceScope<T>;
  }

  const activeWorkspaceId = session.workspaceId;

  if (session.role === "konsultan") {
    return {
      allowed: true,
      filter: (item: T): boolean => {
        if (!item || typeof item !== "object") return false;
        return matchesSessionWorkspace(activeWorkspaceId, item.workspaceId);
      },
    };
  }

  if (session.role === "mitra") {
    if (!Array.isArray(session.projectIds) || session.projectIds.length === 0) {
      return DENIED_SCOPE as ResourceScope<T>;
    }
    const validIds = session.projectIds.filter(isValidNonEmptyString);
    if (validIds.length === 0) {
      return DENIED_SCOPE as ResourceScope<T>;
    }
    const assignedProjects = new Set<string>(validIds);

    return {
      allowed: true,
      filter: (item: T): boolean => {
        if (!item || typeof item !== "object") return false;
        if (!matchesSessionWorkspace(activeWorkspaceId, item.workspaceId)) {
          return false;
        }
        const candidateProjectId =
          resource === "project"
            ? item.projectId ?? item.project_id ?? item.id
            : item.projectId ?? item.project_id;
        return Boolean(
          candidateProjectId && assignedProjects.has(candidateProjectId),
        );
      },
    };
  }

  if (session.role === "klien") {
    if (!isValidNonEmptyString(session.clientId)) {
      return DENIED_SCOPE as ResourceScope<T>;
    }
    const activeClientId = session.clientId;

    return {
      allowed: true,
      filter: (item: T): boolean => {
        if (!item || typeof item !== "object") return false;
        if (!matchesSessionWorkspace(activeWorkspaceId, item.workspaceId)) {
          return false;
        }
        const candidateClientId = item.clientId ?? item.client_id;
        return Boolean(candidateClientId && candidateClientId === activeClientId);
      },
    };
  }

  return DENIED_SCOPE as ResourceScope<T>;
}

/**
 * Fungsi otorisasi tunggal di lapisan aplikasi: `can(session, action, resource, target?)`.
 *
 * Prinsip fail-closed:
 * 1. Jika `session` tidak ada (`null`/`undefined`), `userId` kosong, atau `workspaceId` kosong, tolak (`false`).
 * 2. Jika field `target.workspaceId` dikirim (termasuk string kosong/null) dan tidak sama persis
 *    dengan `session.workspaceId`, tolak (`false`). Pada lapisan repository, `target.workspaceId`
 *    WAJIB selalu dikirim.
 * 3. Jika `MATRIX[session.role][resource]` tidak memuat `action`, tolak (`false`).
 * 4. Untuk `konsultan`: izinkan seluruh resource di dalam workspace-nya (`true`).
 * 5. Untuk `mitra`: wajib memiliki `session.projectIds` tidak kosong, dan `target` wajib
 *    menunjuk ID proyek yang ditugaskan (`target.id` untuk `project`, atau `target.projectId` untuk `task`/`deliverable`).
 * 6. Untuk `klien`: wajib memiliki `session.clientId` tidak kosong, dan `target.clientId` wajib
 *    sama persis dengan `session.clientId`.
 */
export function can(
  session: Session | null | undefined,
  action: Action,
  resource: Resource,
  target?: PermissionTarget,
): boolean {
  if (
    !session ||
    !isValidNonEmptyString(session.userId) ||
    !isValidNonEmptyString(session.workspaceId)
  ) {
    return false;
  }

  if (target && "workspaceId" in target && target.workspaceId !== undefined) {
    if (!target.workspaceId || target.workspaceId !== session.workspaceId) {
      return false;
    }
  }

  if (!hasRoleCapability(session.role, action, resource)) {
    return false;
  }

  if (session.role === "konsultan") {
    return true;
  }

  if (session.role === "mitra") {
    const assignedProjects = session.projectIds;
    if (!assignedProjects || assignedProjects.length === 0) {
      return false;
    }
    if (!target) {
      return false;
    }

    const candidateProjectId =
      resource === "project"
        ? target.projectId ?? target.id
        : target.projectId;

    if (!candidateProjectId) {
      return false;
    }

    return assignedProjects.includes(candidateProjectId);
  }

  if (session.role === "klien") {
    if (!isValidNonEmptyString(session.clientId) || !target?.clientId) {
      return false;
    }
    return target.clientId === session.clientId;
  }

  return false;
}
