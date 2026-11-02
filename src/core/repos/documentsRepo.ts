import {
  can,
  scopeFor,
  type RepositoryPermissionTarget,
} from "../permissions";
import type { Session } from "../session";
import { SEED_DOCUMENTS } from "./seeds";
import {
  assertCanInWorkspace,
  assertRoleActionCapability,
  generateEntityId,
  loadCollectionFromStorage,
  saveCollectionToStorage,
  type DocumentRecord,
  type Repository,
} from "./types";

export const DOCUMENTS_WORKSPACE_STORAGE_KEY = "documents.wira_consulting_v1";
export const DOCUMENTS_LEGACY_STORAGE_KEY = "wira_consulting_documents_v1";

function loadRawDocuments(workspaceId: string): DocumentRecord[] {
  return loadCollectionFromStorage<DocumentRecord>({
    storageKey: DOCUMENTS_WORKSPACE_STORAGE_KEY,
    workspaceId,
    legacyKey: DOCUMENTS_LEGACY_STORAGE_KEY,
    requireNonEmptyLegacy: true,
    seedForDefaultWorkspace: SEED_DOCUMENTS,
  });
}

function buildDocumentTarget(
  doc: Pick<DocumentRecord, "id" | "client_id" | "project_id">,
  workspaceId: string,
): RepositoryPermissionTarget {
  return {
    id: doc.id,
    clientId: doc.client_id,
    projectId: doc.project_id,
    workspaceId,
  };
}

export type CreateDocumentInput = Omit<DocumentRecord, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};
export type UpdateDocumentInput = Partial<Omit<DocumentRecord, "id">>;

export interface DocumentsRepository
  extends Repository<
    DocumentRecord,
    CreateDocumentInput,
    UpdateDocumentInput
  > {
  replaceAll(
    session: Session | null | undefined,
    documents: readonly DocumentRecord[],
  ): void;
}

export const documentsRepo: DocumentsRepository = {
  list(session: Session | null | undefined): DocumentRecord[] {
    const scope = scopeFor(session, "document");
    if (!scope.allowed || !session) return [];

    const workspaceId = session.workspaceId;
    return loadRawDocuments(workspaceId).filter((item) => {
      if (
        !scope.filter({
          id: item.id,
          client_id: item.client_id,
          project_id: item.project_id,
          workspaceId,
        })
      ) {
        return false;
      }
      // Untuk peran klien, tahan draf internal yang belum dibagikan ke klien.
      if (session.role === "klien" && !item.dibagikan_ke_klien) {
        return false;
      }
      return true;
    });
  },

  get(session: Session | null | undefined, id: string): DocumentRecord | null {
    if (!session || !session.workspaceId || !id) return null;
    const workspaceId = session.workspaceId;
    const item = loadRawDocuments(workspaceId).find((d) => d.id === id);
    if (!item) return null;

    if (
      !can(
        session,
        "read",
        "document",
        buildDocumentTarget(item, workspaceId),
      )
    ) {
      return null;
    }
    if (session.role === "klien" && !item.dibagikan_ke_klien) {
      return null;
    }
    return item;
  },

  create(
    session: Session | null | undefined,
    input: CreateDocumentInput,
  ): DocumentRecord {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "document",
    );
    const created: DocumentRecord = {
      ...input,
      id: input.id?.trim() || generateEntityId("doc"),
      created_at: input.created_at ?? new Date().toISOString(),
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "document",
      buildDocumentTarget(created, workspaceId),
    );

    const current = loadRawDocuments(workspaceId);
    const next = [...current.filter((d) => d.id !== created.id), created];
    saveCollectionToStorage(
      DOCUMENTS_WORKSPACE_STORAGE_KEY,
      workspaceId,
      next,
    );
    return created;
  },

  update(
    session: Session | null | undefined,
    id: string,
    patch: UpdateDocumentInput,
  ): DocumentRecord | null {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "document",
    );
    const current = loadRawDocuments(workspaceId);
    const index = current.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const existing = current[index];
    assertCanInWorkspace(
      validSession,
      "write",
      "document",
      buildDocumentTarget(existing, workspaceId),
    );

    const updated: DocumentRecord = {
      ...existing,
      ...patch,
      id: existing.id,
    };
    assertCanInWorkspace(
      validSession,
      "write",
      "document",
      buildDocumentTarget(updated, workspaceId),
    );

    const next = [...current];
    next[index] = updated;
    saveCollectionToStorage(
      DOCUMENTS_WORKSPACE_STORAGE_KEY,
      workspaceId,
      next,
    );
    return updated;
  },

  remove(session: Session | null | undefined, id: string): boolean {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "delete",
      "document",
    );
    const current = loadRawDocuments(workspaceId);
    const existing = current.find((d) => d.id === id);
    if (!existing) return false;

    assertCanInWorkspace(
      validSession,
      "delete",
      "document",
      buildDocumentTarget(existing, workspaceId),
    );

    const next = current.filter((d) => d.id !== id);
    saveCollectionToStorage(
      DOCUMENTS_WORKSPACE_STORAGE_KEY,
      workspaceId,
      next,
    );
    return true;
  },

  replaceAll(
    session: Session | null | undefined,
    documents: readonly DocumentRecord[],
  ): void {
    const { session: validSession, workspaceId } = assertRoleActionCapability(
      session,
      "write",
      "document",
    );
    for (const item of documents) {
      assertCanInWorkspace(
        validSession,
        "write",
        "document",
        buildDocumentTarget(item, workspaceId),
      );
    }
    saveCollectionToStorage(
      DOCUMENTS_WORKSPACE_STORAGE_KEY,
      workspaceId,
      documents,
    );
  },
};
