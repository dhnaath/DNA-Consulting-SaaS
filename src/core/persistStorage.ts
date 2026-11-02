import {
  createJSONStorage,
  type PersistStorage,
  type StateStorage,
} from "zustand/middleware";
import { getCurrentSession } from "./session";
import {
  DEFAULT_WORKSPACE_ID,
  buildStorageKey,
  resolveLegacyKeyTarget,
} from "./storage";

/**
 * CATATAN ARSITEKTUR PENTING (Wajib dibaca sebelum memodifikasi adaptor ini):
 *
 * 1. Urutan Evaluasi Modul vs `main.tsx`:
 *    Store Zustand (`create(persist(...))`) dieksekusi pada waktu evaluasi `import` modul ES,
 *    yang dalam graf bundel statis dapat berjalan SEBELUM badan kode `src/main.tsx` (maupun
 *    `<SessionProvider>`) sempat dieksekusi. Oleh karena itu:
 *    - Adaptor ini TIDAK BOLEH bergantung pada asumsi bahwa `migrateLegacyKeys()` sudah
 *      selesai berjalan terlebih dahulu. Saat kunci baru `ws-main:<tujuan>` belum ada di
 *      `localStorage`, `getItem(name)` langsung melakukan fallback baca ke kunci lama `name`
 *      secara mandiri tanpa menulis apa pun.
 *    - Saat `getCurrentSession()` masih bernilai `null` pada waktu hidrasi awal modul
 *      (sebelum `<SessionProvider>` terpasang), `resolveSessionWorkspaceId()` jatuh secara
 *      deterministik ke `DEFAULT_WORKSPACE_ID` (`"ws-main"`).
 *
 * 2. Workspace Terkunci Saat Store Dibuat & Pergantian Workspace Runtime:
 *    State store Zustand dimuat sekali saat aplikasi mulai. Untuk mencegah kebocoran
 *    antar-tenant (state workspace lama tertulis ke kunci workspace baru saat sesi diganti
 *    di tengah runtime):
 *    - `lockedWorkspaceId` dikunci SEKALI saat `createWorkspaceStorage()` dipanggil dan dipakai
 *      selamanya oleh `getItem`, `setItem`, dan `removeItem` milik instance adaptor tersebut.
 *    - Pada `setItem`, apabila sesi aktif memiliki `workspaceId` yang berbeda dari
 *      `lockedWorkspaceId`, penulisan dibatalkan (`no-op`) dan peringatan dicetak di mode `DEV`.
 *    - Pergantian workspace saat runtime HARUS dilakukan lewat muat ulang halaman penuh
 *      (*full page reload*).
 */

function getSafeLocalStorage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
}

function resolveSessionWorkspaceId(): string {
  try {
    const ws = getCurrentSession()?.workspaceId?.trim();
    return ws && ws.length > 0 ? ws : DEFAULT_WORKSPACE_ID;
  } catch {
    return DEFAULT_WORKSPACE_ID;
  }
}

function resolveLockedPhysicalKey(
  name: string,
  lockedWorkspaceId: string,
): string {
  const targetKey = resolveLegacyKeyTarget(name) ?? name;
  return buildStorageKey(targetKey, lockedWorkspaceId);
}

/**
 * Membangun instance `StateStorage` mentah (string-level) dengan `workspaceId` yang
 * dikunci pada waktu pembuatan adaptor.
 *
 * Menjaga format JSON `{ state, version }` tetap 100% identik dengan bawaan Zustand `persist`
 * karena serialisasi/deserialisasi objek ditangani satu kali oleh `createJSONStorage`.
 */
function createLockedWorkspaceStateStorage(
  lockedWorkspaceId: string,
): StateStorage {
  return {
    getItem: (name: string): string | null => {
      try {
        const storage = getSafeLocalStorage();
        if (!storage) return null;

        const physicalKey = resolveLockedPhysicalKey(name, lockedWorkspaceId);

        // 1 & 2. Baca kunci ber-namespace workspace terkunci terlebih dahulu (mis. `ws-main:approvals.ecosystem_v1`)
        const workspaceValue = storage.getItem(physicalKey);
        if (workspaceValue !== null) {
          return workspaceValue;
        }

        // 3. Fallback ke kunci LAMA `name` tanpa menulis apa pun saat membaca
        //    (dibatasi ke DEFAULT_WORKSPACE_ID agar data lama tidak bocor ke workspace lain)
        if (lockedWorkspaceId === DEFAULT_WORKSPACE_ID) {
          const legacyValue = storage.getItem(name);
          if (legacyValue !== null) {
            return legacyValue;
          }
        }

        // 4. Kembalikan null bila keduanya belum ada
        return null;
      } catch {
        return null;
      }
    },

    setItem: (name: string, value: string): void => {
      try {
        const storage = getSafeLocalStorage();
        if (!storage) return;

        // Bandingkan workspaceId terkunci dengan getCurrentSession()?.workspaceId.
        // Bila sesi aktif memuat workspaceId eksplisit yang berbeda dari lockedWorkspaceId,
        // batalkan penulisan (no-op) agar state workspace lama tidak bocor lintas-tenant.
        const currentSessionWorkspaceId =
          getCurrentSession()?.workspaceId?.trim();
        if (
          currentSessionWorkspaceId &&
          currentSessionWorkspaceId !== lockedWorkspaceId
        ) {
          if (import.meta.env.DEV) {
            console.warn(
              `[persistStorage] Penulisan "${name}" dibatalkan (no-op): store terkunci ke workspace "${lockedWorkspaceId}", sedangkan sesi saat ini berada di "${currentSessionWorkspaceId}". Pergantian workspace saat runtime harus dilakukan lewat muat ulang halaman penuh.`,
            );
          }
          return;
        }

        const physicalKey = resolveLockedPhysicalKey(name, lockedWorkspaceId);
        // Tulis HANYA ke kunci baru ber-prefix workspace terkunci; kunci lama tidak pernah disentuh
        storage.setItem(physicalKey, value);
      } catch {
        // Tangkap semua error storage (mis. QuotaExceededError / SecurityError) tanpa melempar keluar
      }
    },

    removeItem: (name: string): void => {
      try {
        const storage = getSafeLocalStorage();
        if (!storage) return;

        const physicalKey = resolveLockedPhysicalKey(name, lockedWorkspaceId);
        // Hapus HANYA kunci baru ber-prefix workspace terkunci; kunci lama tidak pernah dihapus
        storage.removeItem(physicalKey);
      } catch {
        // Jangan pernah melempar error keluar
      }
    },
  };
}

/**
 * Instance bawaan yang terkunci ke workspace awal modul (`DEFAULT_WORKSPACE_ID` / sesi awal).
 */
export const workspaceStateStorage: StateStorage =
  createLockedWorkspaceStateStorage(resolveSessionWorkspaceId());

/**
 * Menghasilkan objek `PersistStorage<S>` yang kompatibel langsung dengan opsi `storage`
 * pada `persist(..., { name, storage: createWorkspaceStorage() })` milik Zustand.
 *
 * `workspaceId` ditentukan SEKALI saat fungsi ini dipanggil (saat store dibuat) dan dipakai
 * selamanya oleh seluruh operasi `getItem` / `setItem` / `removeItem` pada store tersebut.
 * Pergantian workspace saat runtime harus dilakukan lewat muat ulang halaman penuh.
 */
export function createWorkspaceStorage<S = unknown>():
  | PersistStorage<S>
  | undefined {
  const lockedWorkspaceId = resolveSessionWorkspaceId();
  const lockedStateStorage =
    createLockedWorkspaceStateStorage(lockedWorkspaceId);
  return createJSONStorage<S>(() => lockedStateStorage);
}
