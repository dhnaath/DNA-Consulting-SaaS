import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { getRaw, removeRaw, setRaw } from "./rawStorage";
import {
  DEFAULT_CONSULTANT_SESSION,
  SessionProvider,
  getCurrentSession,
  useSession,
  type DevSessionControls,
} from "./session";

/**
 * Skenario Verifikasi Mandiri `rawStorage.ts` (Batch 3C-1)
 *
 * Mengikuti pola `src/core/permissions.examples.ts` untuk memverifikasi aturan 3–5:
 * - Aturan 3 (`getRaw`): baca `ws-main:<tujuan>` lebih dulu -> fallback kunci lama `key` -> `null`,
 *   serta TIDAK menulis apa pun saat membaca.
 * - Aturan 4 (`setRaw`): tulis HANYA ke kunci baru `ws-main:<tujuan>` (kunci lama tetap utuh);
 *   bila `workspaceId` sesi aktif berbeda dari `workspaceId` terkunci, lakukan `no-op` dan
 *   cetak `console.warn` di mode `DEV`.
 * - Aturan 5 (`removeRaw`): hapus HANYA kunci baru `ws-main:<tujuan>` (kunci lama tetap utuh).
 *
 * Seluruh kunci yang disentuh selama verifikasi dicadangkan dan dipulihkan pada blok `finally`
 * sehingga aman dijalankan tanpa merusak data pengguna.
 */

export interface RawStorageAssertionResult {
  name: string;
  expected: boolean;
  actual: boolean;
  passed: boolean;
}

const TEST_LEGACY_KEY = "aio_wiki_data_v1";
const TEST_NEW_KEY = "ws-main:wiki.data_v1";
const TEST_OTHER_WS_KEY = "ws-other-tenant:wiki.data_v1";
const TEST_UNMAPPED_KEY = "__raw_storage_unmapped_probe__";
const TEST_UNMAPPED_NEW_KEY = "ws-main:__raw_storage_unmapped_probe__";

function obtainDevControls(): DevSessionControls | null {
  let captured: DevSessionControls | null = null;
  function Probe() {
    const { dev } = useSession();
    captured = dev;
    return null;
  }
  const existingSession = getCurrentSession() ?? DEFAULT_CONSULTANT_SESSION;
  renderToStaticMarkup(
    React.createElement(SessionProvider, {
      initialSession: existingSession,
      children: React.createElement(Probe),
    }),
  );
  return captured;
}

export function runRawStorageVerificationSuite(
  externalDevControls?: Pick<DevSessionControls, "setSession" | "resetSession">,
): RawStorageAssertionResult[] {
  const storage = window.localStorage;

  const touchedKeys = [
    TEST_LEGACY_KEY,
    TEST_NEW_KEY,
    TEST_OTHER_WS_KEY,
    TEST_UNMAPPED_KEY,
    TEST_UNMAPPED_NEW_KEY,
  ];
  const backup = new Map<string, string | null>();
  for (const k of touchedKeys) {
    backup.set(k, storage.getItem(k));
  }

  const previousSession = getCurrentSession();
  const devControls = externalDevControls ?? obtainDevControls();

  const cases: Array<{ name: string; expected: boolean; actual: boolean }> = [];

  try {
    // Pastikan sesi berada di workspace default ("ws-main") untuk uji 3a..5
    devControls?.setSession({
      ...DEFAULT_CONSULTANT_SESSION,
      workspaceId: "ws-main",
    });

    for (const k of touchedKeys) {
      storage.removeItem(k);
    }

    // 1. Aturan 3a: keduanya kosong -> null, tidak menulis apa pun
    const emptyRead = getRaw(TEST_LEGACY_KEY);
    cases.push({
      name: "[Aturan 3a] getRaw mengembalikan null bila kunci baru & kunci lama kosong tanpa menulis kunci apa pun",
      expected: true,
      actual:
        emptyRead === null &&
        storage.getItem(TEST_NEW_KEY) === null &&
        storage.getItem(TEST_LEGACY_KEY) === null,
    });

    // 2. Aturan 3b: fallback ke kunci lama tanpa menulis ke kunci baru
    storage.setItem(TEST_LEGACY_KEY, '{"pages":["legacy-1"]}');
    const fallbackRead = getRaw(TEST_LEGACY_KEY);
    cases.push({
      name: "[Aturan 3b] getRaw jatuh kembali membaca kunci lama saat ws-main:<tujuan> belum ada dan tidak menulis saat baca",
      expected: true,
      actual:
        fallbackRead === '{"pages":["legacy-1"]}' &&
        storage.getItem(TEST_NEW_KEY) === null,
    });

    // 3. Aturan 3c & 4a: setRaw menulis HANYA ke kunci baru; kunci lama tetap utuh; getRaw memprioritaskan kunci baru
    setRaw(TEST_LEGACY_KEY, '{"pages":["legacy-1","new-2"]}');
    const afterSetNewVal = storage.getItem(TEST_NEW_KEY);
    const afterSetLegacyVal = storage.getItem(TEST_LEGACY_KEY);
    const priorityRead = getRaw(TEST_LEGACY_KEY);
    cases.push({
      name: "[Aturan 4a & 3c] setRaw menulis HANYA ke ws-main:<tujuan>, membiarkan kunci lama utuh, dan getRaw mengutamakan kunci baru",
      expected: true,
      actual:
        afterSetNewVal === '{"pages":["legacy-1","new-2"]}' &&
        afterSetLegacyVal === '{"pages":["legacy-1"]}' &&
        priorityRead === '{"pages":["legacy-1","new-2"]}',
    });

    // 4. Aturan 1 & 3d: kunci di luar LEGACY_KEY_MAP memakai nama kunci apa adanya di bawah ws-main:
    storage.setItem(TEST_UNMAPPED_KEY, "raw-unmapped-legacy");
    const unmappedFallback = getRaw(TEST_UNMAPPED_KEY);
    const unmappedNotWrittenOnRead =
      storage.getItem(TEST_UNMAPPED_NEW_KEY) === null;
    setRaw(TEST_UNMAPPED_KEY, "raw-unmapped-new");
    cases.push({
      name: "[Aturan 1 & 3d] Kunci yang tidak terdaftar di LEGACY_KEY_MAP dipetakan ke ws-main:<key> apa adanya",
      expected: true,
      actual:
        unmappedFallback === "raw-unmapped-legacy" &&
        unmappedNotWrittenOnRead &&
        storage.getItem(TEST_UNMAPPED_NEW_KEY) === "raw-unmapped-new" &&
        storage.getItem(TEST_UNMAPPED_KEY) === "raw-unmapped-legacy",
    });

    // 5. Aturan 5: removeRaw menghapus HANYA kunci baru dan tidak menyentuh kunci lama
    removeRaw(TEST_LEGACY_KEY);
    cases.push({
      name: "[Aturan 5] removeRaw menghapus HANYA ws-main:<tujuan> dan membiarkan kunci lama tetap utuh",
      expected: true,
      actual:
        storage.getItem(TEST_NEW_KEY) === null &&
        storage.getItem(TEST_LEGACY_KEY) === '{"pages":["legacy-1"]}' &&
        getRaw(TEST_LEGACY_KEY) === '{"pages":["legacy-1"]}',
    });

    // 6. Aturan 4b: setRaw melakukan no-op (dan console.warn di DEV) bila sesi berganti ke workspaceId lain
    setRaw(TEST_LEGACY_KEY, '{"pages":["stable-ws-main"]}');
    const warnMessages: string[] = [];
    const originalWarn = console.warn;
    console.warn = (...args: unknown[]) => {
      warnMessages.push(args.map(String).join(" "));
    };
    try {
      devControls?.setSession({
        ...DEFAULT_CONSULTANT_SESSION,
        workspaceId: "ws-other-tenant",
      });
      setRaw(TEST_LEGACY_KEY, '{"pages":["leaked-cross-tenant"]}');
    } finally {
      console.warn = originalWarn;
    }

    const expectedWarnObserved = import.meta.env.DEV
      ? warnMessages.some((m) => m.includes("[rawStorage]"))
      : true;

    cases.push({
      name: "[Aturan 4b] setRaw membatalkan penulisan (no-op) dan mencatat console.warn di DEV saat workspaceId sesi berbeda dari workspace terkunci",
      expected: true,
      actual:
        storage.getItem(TEST_NEW_KEY) === '{"pages":["stable-ws-main"]}' &&
        storage.getItem(TEST_OTHER_WS_KEY) === null &&
        storage.getItem(TEST_LEGACY_KEY) === '{"pages":["legacy-1"]}' &&
        expectedWarnObserved,
    });
  } finally {
    // Pulihkan sesi & seluruh kunci localStorage yang disentuh
    if (previousSession) {
      devControls?.setSession(previousSession);
    } else {
      devControls?.resetSession();
    }
    for (const [k, v] of backup.entries()) {
      if (v === null) {
        storage.removeItem(k);
      } else {
        storage.setItem(k, v);
      }
    }
  }

  return cases.map((item) => ({
    name: item.name,
    expected: item.expected,
    actual: item.actual,
    passed: item.expected === item.actual,
  }));
}

/**
 * Verifikasi Langkah 0.d (Batch 3C-2): `reconcileBulkSnapshots()`
 *
 * Memastikan:
 * 1. Sebelum rekonsiliasi, salinan basi ada di kunci baru untuk modul belum-pindah
 *    (`ws-main:tasks.manager_v1` dari `LEGACY_KEY_MAP` dan `ws-main:tools.bizcoach_worksheet.swot`
 *    dari `LEGACY_DYNAMIC_PREFIX_MAP`) maupun modul sudah-pindah (`ADOPTED_TARGETS`:
 *    `ws-main:wiki.data_v1`, `ws-main:approvals.ecosystem_v1`) serta kunci non-peta/langsung
 *    (`ws-main:migrated_v1`, `ws-main:prefs.lang`) dan kunci lama (`aio_task_manager_data_v1`).
 * 2. Sesudah `reconcileBulkSnapshots("ws-main")`, kunci baru basi milik modul belum-pindah hilang,
 *    sedangkan milik `ADOPTED_TARGETS`, `migrated_v1`, `prefs.lang`, dan kunci lama tetap utuh,
 *    serta `ws-main:reconcile_v1` tersetel `"true"`.
 * 3. Pemanggilan kedua bersifat idempoten (`removedCount === 0`) dan tidak menghapus kunci baru
 *    yang ditulis setelah rekonsiliasi pertama.
 */
export function runReconcileBulkSnapshotsVerificationSuite(
  reconcileFn: (workspaceId?: string) => {
    removedCount: number;
    keptCount: number;
    removedKeys: string[];
  },
): RawStorageAssertionResult[] {
  const storage = window.localStorage;

  const STALE_STATIC_KEY = "ws-main:tasks.manager_v1";
  const STALE_DYNAMIC_KEY = "ws-main:tools.bizcoach_worksheet.swot";
  const ADOPTED_HOOK_KEY = "ws-main:wiki.data_v1";
  const ADOPTED_PERSIST_KEY = "ws-main:approvals.ecosystem_v1";
  const DIRECT_MIGRATED_FLAG = "ws-main:migrated_v1";
  const DIRECT_LANG_KEY = "ws-main:prefs.lang";
  const RECONCILE_FLAG = "ws-main:reconcile_v1";
  const LEGACY_TASK_KEY = "aio_task_manager_data_v1";

  const snapshot = new Map<string, string>();
  for (let i = 0; i < storage.length; i += 1) {
    const k = storage.key(i);
    if (k !== null) {
      const v = storage.getItem(k);
      if (v !== null) snapshot.set(k, v);
    }
  }

  const results: Array<{ name: string; expected: boolean; actual: boolean }> = [];

  try {
    storage.clear();
    storage.setItem(STALE_STATIC_KEY, '{"tasks":["stale-snapshot"]}');
    storage.setItem(STALE_DYNAMIC_KEY, '{"swot":"stale-dynamic"}');
    storage.setItem(ADOPTED_HOOK_KEY, '{"pages":["live-wiki"]}');
    storage.setItem(ADOPTED_PERSIST_KEY, '{"state":{"requests":["live-approval"]},"version":0}');
    storage.setItem(DIRECT_MIGRATED_FLAG, "true");
    storage.setItem(DIRECT_LANG_KEY, '"id"');
    storage.setItem(LEGACY_TASK_KEY, '{"tasks":["fresh-legacy-task"]}');

    const firstRun = reconcileFn("ws-main");

    results.push({
      name: "[Reconcile 1] Kunci baru basi (LEGACY_KEY_MAP & LEGACY_DYNAMIC_PREFIX_MAP di luar ADOPTED_TARGETS) dihapus",
      expected: true,
      actual:
        storage.getItem(STALE_STATIC_KEY) === null &&
        storage.getItem(STALE_DYNAMIC_KEY) === null &&
        firstRun.removedCount === 2 &&
        firstRun.removedKeys.includes(STALE_STATIC_KEY) &&
        firstRun.removedKeys.includes(STALE_DYNAMIC_KEY),
    });

    results.push({
      name: "[Reconcile 2] Kunci ADOPTED_TARGETS, migrated_v1, prefs.lang, dan kunci lama tetap utuh + flag reconcile_v1 tertulis",
      expected: true,
      actual:
        storage.getItem(ADOPTED_HOOK_KEY) === '{"pages":["live-wiki"]}' &&
        storage.getItem(ADOPTED_PERSIST_KEY) === '{"state":{"requests":["live-approval"]},"version":0}' &&
        storage.getItem(DIRECT_MIGRATED_FLAG) === "true" &&
        storage.getItem(DIRECT_LANG_KEY) === '"id"' &&
        storage.getItem(LEGACY_TASK_KEY) === '{"tasks":["fresh-legacy-task"]}' &&
        storage.getItem(RECONCILE_FLAG) === "true",
    });

    // Simulasikan penulisan baru setelah modul pindah di Batch 3C-2, lalu panggil ulang
    storage.setItem(STALE_STATIC_KEY, '{"tasks":["newly-adopted-3c2"]}');
    const secondRun = reconcileFn("ws-main");

    results.push({
      name: "[Reconcile 3] Idempoten: pemanggilan kedua tidak menghapus apa pun karena ws-main:reconcile_v1 sudah aktif",
      expected: true,
      actual:
        secondRun.removedCount === 0 &&
        secondRun.removedKeys.length === 0 &&
        storage.getItem(STALE_STATIC_KEY) === '{"tasks":["newly-adopted-3c2"]}',
    });
  } finally {
    storage.clear();
    for (const [k, v] of snapshot.entries()) {
      storage.setItem(k, v);
    }
  }

  return results.map((item) => ({
    name: item.name,
    expected: item.expected,
    actual: item.actual,
    passed: item.expected === item.actual,
  }));
}
