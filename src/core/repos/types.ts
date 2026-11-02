import {
  can,
  hasRoleCapability,
  type Action,
  type RepositoryPermissionTarget,
  type Resource,
} from "../permissions";
import type { Role, Session } from "../session";
import {
  DEFAULT_WORKSPACE_ID,
  readWorkspaceOrLegacy,
  setItem,
} from "../storage";

export type ClientRecord = {
  id: string;
  nama: string;
  industri: string;
  kbli: string | null;
  pic: string | null;
  email: string | null;
  telepon: string | null;
  kota: string | null;
  status: string;
  nilai_kontrak: number;
  catatan: string | null;
};

export type ProjectRecord = {
  id: string;
  client_id: string | null;
  nama: string;
  ringkasan: string | null;
  status: string;
  prioritas: string;
  tanggal_mulai: string | null;
  tanggal_selesai: string | null;
  progres: number;
  nilai: number;
  konsultan: string | null;
  bidang?: string | null;
};

export type TaskRecord = {
  id: string;
  project_id: string | null;
  judul: string;
  deskripsi: string | null;
  status: string;
  prioritas: string;
  tenggat: string | null;
  penanggung_jawab: string | null;
  estimasi_jam: number;
};

export type DeliverableRecord = {
  id: string;
  project_id: string | null;
  judul: string;
  jenis: string;
  fase?: string;
  status: "draft" | "review" | "approved" | "rejected" | "selesai" | string;
  catatan?: string | null;
  jatuh_tempo: string | null;
  versi: string | null;
  disetujui_oleh?: string | null;
  disetujui_pada?: string | null;
  tautan?: string | null;
};

export type NoteRecord = {
  id: string;
  client_id: string | null;
  project_id: string | null;
  judul: string;
  isi: string | null;
  kategori: string;
  tags: string[];
  dipin: boolean;
  updated_at: string;
};

export type ActivityRecord = {
  id: string;
  client_id: string | null;
  project_id: string | null;
  jenis: string;
  judul: string;
  deskripsi: string | null;
  waktu: string;
};

export type MessageAttachmentRecord = {
  nama: string;
  ukuran: string;
  tipe: string;
  tautan?: string;
};

export type MessageRecord = {
  id: string;
  client_id: string | null;
  project_id: string | null;
  pengirim: "klien" | "konsultan" | string;
  nama_pengirim: string;
  jabatan_pengirim?: string;
  isi: string;
  tag?: string;
  lampiran?: MessageAttachmentRecord[];
  dibaca: boolean;
  created_at: string;
};

export type DocumentRecord = {
  id: string;
  client_id: string | null;
  project_id: string | null;
  nama: string;
  jenis: string;
  ukuran: string | null;
  versi: string | null;
  tautan: string | null;
  diunggah_oleh: string | null;
  dibagikan_ke_klien: boolean;
  status_persetujuan?: "draft" | "review" | "approved" | "rejected";
  kategori?: string;
  kerahasiaan?: "Rahasia" | "Internal" | "Publik";
  ringkasan?: string;
  catatan_revisi?: string;
  created_at: string;
};

export type MeetingRecord = {
  id: string;
  client_id: string | null;
  project_id: string | null;
  judul: string;
  agenda: string | null;
  mulai: string;
  durasi_menit: number;
  lokasi: string | null;
  tautan_meeting?: string | null;
  tipe: "online" | "onsite" | string;
  status: "terjadwal" | "selesai" | "dibatalkan" | string;
  peserta?: string[];
  catatan_hasil?: string | null;
  created_at: string;
};

/**
 * Error terketik standar yang dilempar oleh metode tulis repository (`create`, `update`, `remove`,
 * `replaceAll`, `approve`) apabila `can()` menolak aksi pada sesi/target yang diberikan.
 */
export class ForbiddenError extends Error {
  public readonly code = "FORBIDDEN" as const;
  public readonly action: Action;
  public readonly resource: Resource;
  public readonly role: Role | null;
  public readonly workspaceId: string;

  constructor(params: {
    action: Action;
    resource: Resource;
    role?: Role | null;
    workspaceId?: string;
    message?: string;
  }) {
    const roleLabel = params.role ?? "unauthenticated";
    const wsLabel = params.workspaceId || "unknown-workspace";
    super(
      params.message ??
        `[ForbiddenError] Akses '${params.action}' pada resource '${params.resource}' di workspace '${wsLabel}' ditolak untuk peran '${roleLabel}'.`,
    );
    this.name = "ForbiddenError";
    this.action = params.action;
    this.resource = params.resource;
    this.role = params.role ?? null;
    this.workspaceId = wsLabel;
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

export interface Repository<
  TRecord extends { id: string },
  TCreate = Omit<TRecord, "id"> & { id?: string },
  TUpdate = Partial<Omit<TRecord, "id">>,
> {
  list(session: Session | null | undefined): TRecord[];
  get(session: Session | null | undefined, id: string): TRecord | null;
  create(session: Session | null | undefined, input: TCreate): TRecord;
  update(
    session: Session | null | undefined,
    id: string,
    patch: TUpdate,
  ): TRecord | null;
  remove(session: Session | null | undefined, id: string): boolean;
}

export function requireSessionWorkspace(
  session: Session | null | undefined,
  action: Action,
  resource: Resource,
): { session: Session; workspaceId: string } {
  if (!session || !session.workspaceId || !session.workspaceId.trim()) {
    throw new ForbiddenError({
      action,
      resource,
      role: session?.role ?? null,
      workspaceId: session?.workspaceId ?? "",
    });
  }
  return { session, workspaceId: session.workspaceId };
}

/**
 * Menegakkan pemeriksaan `can()` yang SELALU menyertakan `target.workspaceId` (`RepositoryPermissionTarget`).
 * Melempar `ForbiddenError` apabila akses ditolak.
 */
export function assertCanInWorkspace(
  session: Session | null | undefined,
  action: Action,
  resource: Resource,
  target: RepositoryPermissionTarget,
): void {
  if (!can(session, action, resource, target)) {
    throw new ForbiddenError({
      action,
      resource,
      role: session?.role ?? null,
      workspaceId: target.workspaceId,
    });
  }
}

/**
 * Menegakkan pemeriksaan kemampuan tingkat peran (`MATRIX[role][resource]`) lebih dulu
 * sebelum mencari item berdasarkan ID, agar peran yang tidak berhak selalu mendapat `ForbiddenError`
 * secara konsisten bahkan bila ID tidak ditemukan.
 */
export function assertRoleActionCapability(
  session: Session | null | undefined,
  action: Action,
  resource: Resource,
): { session: Session; workspaceId: string } {
  const { session: validSession, workspaceId } = requireSessionWorkspace(
    session,
    action,
    resource,
  );
  if (!hasRoleCapability(validSession.role, action, resource)) {
    throw new ForbiddenError({
      action,
      resource,
      role: validSession.role,
      workspaceId,
    });
  }
  return { session: validSession, workspaceId };
}

export function cloneCollection<T>(items: readonly T[]): T[] {
  return JSON.parse(JSON.stringify(items)) as T[];
}

export function generateEntityId(prefix: string): string {
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${randomSuffix}`;
}

/**
 * Membaca koleksi dari `core/storage` (kunci ber-namespace `${workspaceId}:${storageKey}`),
 * dengan fallback ke `legacyKey` (khusus `"ws-main"`) dan fallback data awal `seedForDefaultWorkspace`.
 * Tidak ada akses `window.localStorage` langsung di luar `src/core/storage.ts`.
 */
export function loadCollectionFromStorage<T>(params: {
  storageKey: string;
  workspaceId: string;
  legacyKey?: string | null;
  requireNonEmptyLegacy?: boolean;
  seedForDefaultWorkspace: readonly T[];
}): T[] {
  const {
    storageKey,
    workspaceId,
    legacyKey = null,
    requireNonEmptyLegacy = true,
    seedForDefaultWorkspace,
  } = params;

  const readResult = readWorkspaceOrLegacy<unknown>(storageKey, {
    workspaceId,
    legacyKey,
  });

  if (readResult.foundIn === "workspace" && Array.isArray(readResult.value)) {
    return cloneCollection(readResult.value as T[]);
  }

  if (readResult.foundIn === "legacy" && Array.isArray(readResult.value)) {
    if (!requireNonEmptyLegacy || readResult.value.length > 0) {
      return cloneCollection(readResult.value as T[]);
    }
  }

  if (workspaceId === DEFAULT_WORKSPACE_ID) {
    return cloneCollection(seedForDefaultWorkspace);
  }

  return [];
}

export function saveCollectionToStorage<T>(
  storageKey: string,
  workspaceId: string,
  items: readonly T[],
): void {
  setItem(storageKey, items, workspaceId);
}
