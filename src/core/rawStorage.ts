import { getCurrentSession } from "./session";
import {
  DEFAULT_WORKSPACE_ID,
  buildStorageKey,
  resolveLegacyKeyTarget,
} from "./storage";

/**
 * Alat Bantu Akses Mentah Ber-Namespace Workspace (`src/core/rawStorage.ts` — Batch 3C-1)
 *
 * Menyediakan fungsi pengganti mekanis untuk `localStorage.getItem`, `localStorage.setItem`,
 * dan `localStorage.removeItem` pada store berbasis React Hook (`useState` + `useEffect`)
 * yang melakukan `JSON.parse` / `JSON.stringify` sendiri.
 *
 * Aturan perilaku identik dengan `createWorkspaceStorage()` di `src/core/persistStorage.ts`:
 * 1. Kunci tujuan dihitung dengan `resolveLegacyKeyTarget(key)` bila terdaftar di `LEGACY_KEY_MAP`,
 *    selain itu memakai `key` apa adanya.
 * 2. `LOCKED_WORKSPACE_ID` dikunci SEKALI saat modul ini dimuat (bukan dibaca ulang tiap panggilan)
 *    agar state memori dari workspace awal tidak pernah bocor ke kunci workspace lain saat sesi
 *    beralih di tengah runtime.
 * 3. `getRaw(key)`: membaca `${LOCKED_WORKSPACE_ID}:<tujuan>` lebih dulu; bila kosong (pada
 *    workspace default `"ws-main"`), fallback membaca kunci LAMA `key`; bila kosong, mengembalikan
 *    `null`. Tidak pernah menulis apa pun saat membaca.
 * 4. `setRaw(key, value)`: menulis HANYA ke kunci baru `${LOCKED_WORKSPACE_ID}:<tujuan>`.
 *    Apabila `workspaceId` sesi aktif berbeda dari `LOCKED_WORKSPACE_ID`, penulisan dibatalkan
 *    (`no-op`) dan `console.warn` dicetak pada mode `DEV`.
 * 5. `removeRaw(key)`: menghapus HANYA kunci baru `${LOCKED_WORKSPACE_ID}:<tujuan>`; kunci lama
 *    tidak pernah dihapus.
 * 6. Semua akses `window.localStorage` dibungkus `try/catch` dan tidak pernah melempar keluar.
 *
 * CATATAN UTANG TEKNIS:
 * Logika penguncian workspace dan resolusi fallback di modul ini sengaja menduplikasi aturan di
 * `src/core/persistStorage.ts` agar `persistStorage.ts` tidak disentuh pada Batch 3C-1.
 * Konsolidasi helper internal bersama dicatat sebagai utang teknis di `docs/ARCHITECTURE.md`.
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

function resolveInitialWorkspaceId(): string {
  try {
    const ws = getCurrentSession()?.workspaceId?.trim();
    return ws && ws.length > 0 ? ws : DEFAULT_WORKSPACE_ID;
  } catch {
    return DEFAULT_WORKSPACE_ID;
  }
}

/**
 * Dikunci SEKALI pada waktu evaluasi modul ini dimuat.
 */
const LOCKED_WORKSPACE_ID: string = resolveInitialWorkspaceId();

function resolveLockedPhysicalKey(key: string): string {
  const targetKey = resolveLegacyKeyTarget(key) ?? key;
  return buildStorageKey(targetKey, LOCKED_WORKSPACE_ID);
}

/**
 * Membaca string mentah dari `${LOCKED_WORKSPACE_ID}:<tujuan>`, atau fallback ke kunci lama `key`
 * (khusus workspace default `"ws-main"`) tanpa pernah menulis ke `localStorage`.
 */
export function getRaw(key: string): string | null {
  try {
    const storage = getSafeLocalStorage();
    if (!storage) return null;

    const physicalKey = resolveLockedPhysicalKey(key);

    const workspaceValue = storage.getItem(physicalKey);
    if (workspaceValue !== null) {
      return workspaceValue;
    }

    if (LOCKED_WORKSPACE_ID === DEFAULT_WORKSPACE_ID) {
      const legacyValue = storage.getItem(key);
      if (legacyValue !== null) {
        return legacyValue;
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Menulis string mentah HANYA ke kunci baru `${LOCKED_WORKSPACE_ID}:<tujuan>`.
 * Melakukan `no-op` (disertai `console.warn` di mode `DEV`) bila `workspaceId` sesi aktif
 * berbeda dari `LOCKED_WORKSPACE_ID`.
 */
export function setRaw(key: string, value: string): void {
  try {
    const storage = getSafeLocalStorage();
    if (!storage) return;

    const currentSessionWorkspaceId =
      getCurrentSession()?.workspaceId?.trim();
    if (
      currentSessionWorkspaceId &&
      currentSessionWorkspaceId !== LOCKED_WORKSPACE_ID
    ) {
      if (import.meta.env.DEV) {
        console.warn(
          `[rawStorage] Penulisan "${key}" dibatalkan (no-op): modul terkunci ke workspace "${LOCKED_WORKSPACE_ID}", sedangkan sesi saat ini berada di "${currentSessionWorkspaceId}". Pergantian workspace saat runtime harus dilakukan lewat muat ulang halaman penuh.`,
        );
      }
      return;
    }

    const physicalKey = resolveLockedPhysicalKey(key);
    storage.setItem(physicalKey, value);
  } catch {
    // Jangan pernah melempar error keluar (mis. QuotaExceededError / SecurityError)
  }
}

/**
 * Menghapus HANYA kunci baru `${LOCKED_WORKSPACE_ID}:<tujuan>` tanpa pernah menyentuh kunci lama.
 */
export function removeRaw(key: string): void {
  try {
    const storage = getSafeLocalStorage();
    if (!storage) return;

    const physicalKey = resolveLockedPhysicalKey(key);
    storage.removeItem(physicalKey);
  } catch {
    // Jangan pernah melempar error keluar
  }
}
