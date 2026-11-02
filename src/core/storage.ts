/**
 * Core Workspace-Namespaced Storage Layer (Batch 1)
 *
 * Menyediakan akses `localStorage` yang aman (`try/catch` + JSON parse aman),
 * ter-namespace per workspace (`${workspaceId}:${key}`), serta migrasi satu arah
 * yang idempoten dari kunci lama (`aio_*`, `client_os_*`, `wira_*`, `ecosystem-*`,
 * dan kunci polos) ke namespace `"ws-main:"` tanpa menghapus kunci lama.
 *
 * Catatan Batch 1: Belum ada komponen/store eksisting yang dipindahkan ke modul ini.
 */

export const DEFAULT_WORKSPACE_ID = "ws-main";
export const MIGRATION_FLAG_KEY = "migrated_v1";
export const RECONCILE_FLAG_KEY = "reconcile_v1";
export const UNIFIED_LANGUAGE_KEY = "prefs.lang";
export const DEFAULT_LANGUAGE = "id";

/**
 * Peta auditabel dari kunci `localStorage` lama (legacy) ke kunci baru
 * tanpa prefix workspace. Saat disimpan melalui modul ini, kunci efektif di
 * `localStorage` menjadi `${workspaceId}:${newKey}` (contoh: `ws-main:prefs.lang`).
 */
export const LEGACY_KEY_MAP: Readonly<Record<string, string>> = Object.freeze({
  // --- Bahasa (disatukan dari dua kunci lama: aio_lang & appLanguage) ---
  aio_lang: UNIFIED_LANGUAGE_KEY,
  appLanguage: UNIFIED_LANGUAGE_KEY,

  // --- Preferensi Shell, Tema, Navigasi, & Region (aio_*) ---
  aio_active_mode: "prefs.active_mode",
  aio_favorites: "prefs.favorites",
  aio_last_active_app: "prefs.last_active_app",
  aio_last_launcher_page: "prefs.last_launcher_page",
  aio_left_sidebar_75: "prefs.left_sidebar_75",
  aio_left_sidebar_100: "prefs.left_sidebar_100",
  aio_liquid_glass: "prefs.liquid_glass",
  aio_menu_settings: "prefs.menu_settings",
  aio_moved_cards_v1: "prefs.moved_cards_v1",
  aio_progressive_blur: "prefs.progressive_blur",
  aio_recent_apps: "prefs.recent_apps",
  aio_region_city: "prefs.region_city",
  aio_region_country: "prefs.region_country",
  aio_region_timezone: "prefs.region_timezone",
  aio_taskbar_active_tasks: "prefs.taskbar_active_tasks",
  aio_theme: "prefs.theme",
  aio_theme_color: "prefs.theme_color",
  aio_theme_preference: "prefs.theme_preference",
  aio_tools_merged_to_business_v1: "prefs.tools_merged_to_business_v1",

  // --- Modul Produktivitas & Konsultasi Inti (aio_*) ---
  aio_calendar_data_v1: "calendar.data_v1",
  aio_code_snippets_v1: "creative.code_snippets_v1",
  aio_countdown_data_v1: "countdown.data_v1",
  aio_database_data_v1: "database.data_v1",
  aio_design_projects_v1: "creative.design_projects_v1",
  aio_documents_data_v1: "documents.data_v1",
  aio_eisenhower_matrix_data_v1: "eisenhower.data_v1",
  aio_focus_timer_data_v1: "focus_timer.data_v1",
  aio_habit_tracker_data_v1: "legacy.habit_tracker_v1",
  aio_kanban_board_data_v1: "kanban.board_v1",
  aio_knowledge_base_data_v1: "knowledge_base.data_v1",
  aio_notes_data_v1: "notes.data_v1",
  aio_photography_assets_v1: "creative.photography_assets_v1",
  aio_planner_data_v1: "planner.data_v1",
  aio_project_manager_data_v1: "projects.manager_v1",
  aio_quick_habits: "legacy.quick_habits",
  aio_quick_notes: "notes.quick_notes",
  aio_quick_tasks: "tasks.quick_tasks",
  aio_quick_transactions: "legacy.quick_transactions",
  aio_reminder_manager_data_v1: "reminders.data_v1",
  aio_research_manager_data_v1: "research.data_v1",
  aio_task_manager_data_v1: "tasks.manager_v1",
  aio_task_manager_data_v2: "tasks.manager_v2",
  aio_timeline_manager_data_v1: "timeline.data_v1",
  aio_web_clipper_data_v1: "web_clipper.data_v1",
  aio_wiki_data_v1: "wiki.data_v1",
  aio_writing_documents_v1: "creative.writing_documents_v1",

  // --- Modul Pribadi / Rumah / Kesehatan (aio_* -> legacy.*) ---
  aio_body_metrics: "legacy.body_metrics",
  aio_cooking_logs: "legacy.cooking_logs",
  aio_executive_health_logs: "legacy.executive_health_logs",
  aio_executive_hydration_today: "legacy.executive_hydration_today",
  aio_executive_mcu_records: "legacy.executive_mcu_records",
  aio_executive_supplements: "legacy.executive_supplements",
  aio_executive_workouts: "legacy.executive_workouts",
  aio_food_expiry: "legacy.food_expiry",
  aio_games_v1: "legacy.games_v1",
  aio_leftovers_items: "legacy.leftovers_items",
  aio_medical_records: "legacy.medical_records",
  aio_movies_watchlist_v1: "legacy.movies_watchlist_v1",
  aio_music_tracks_v1: "legacy.music_tracks_v1",
  aio_pantry_items: "legacy.pantry_items",
  aio_podcasts_v1: "legacy.podcasts_v1",
  aio_recipes_data_v1: "legacy.recipes_v1",
  aio_shopping_list_v1: "legacy.shopping_list_v1",
  aio_skincare_routines: "legacy.skincare_routines",
  aio_sleep_logs: "legacy.sleep_logs",
  aio_trips_data_v1: "legacy.trips_v1",
  aio_vitals_logs: "legacy.vitals_logs",
  aio_water_glasses: "legacy.water_glasses",
  aio_water_history: "legacy.water_history",
  aio_weekly_meal_plans: "legacy.weekly_meal_plans",
  aio_workout_logs: "legacy.workout_logs",

  // --- Kunci Pola client_os_* ---
  client_os_active_mode: "prefs.client_os_active_mode",
  client_os_calc_history: "tools.calc_history",
  client_os_courses_data: "learning.courses_data",
  client_os_exams_data: "learning.exams_data",
  client_os_flashcards_data: "learning.flashcards_data",
  client_os_languages_data: "learning.languages_data",
  client_os_reading_list: "learning.reading_list",

  // --- Kunci Pola wira_* ---
  wira_catatan_knowledge_v2: "notes.wira_knowledge_v2",
  wira_consulting_deliverables_v1: "deliverables.wira_consulting_v1",
  wira_consulting_documents_v1: "documents.wira_consulting_v1",
  wira_consulting_meetings_v1: "meetings.wira_consulting_v1",
  wira_consulting_messages_v1: "collaboration.wira_messages_v1",
  wira_consulting_projects_v1: "projects.wira_consulting_v1",
  wira_contacts_database_v2: "clients.wira_contacts_v2",
  wira_credit_facilities_v1: "finance.wira_credit_facilities_v1",
  wira_custom_nav_folders: "prefs.wira_custom_nav_folders",
  wira_ideas_lab_v2: "notes.wira_ideas_lab_v2",
  wira_journal_entries_v2: "legacy.wira_journal_entries_v2",
  wira_passwords_vault_v2: "legacy.wira_passwords_vault_v2",
  wira_vt_favs: "tools.value_treated_favs",

  // --- Kunci Zustand Persist (ecosystem-*-storage) ---
  "ecosystem-approval-manager-storage": "approvals.ecosystem_v1",
  "ecosystem-asset-manager-storage": "documents.asset_manager_v1",
  "ecosystem-bookmark-manager-storage": "bookmarks.ecosystem_v1",
  "ecosystem-collaboration-storage": "collaboration.ecosystem_v1",
  "ecosystem-deliverable-manager-storage": "deliverables.ecosystem_v1",
  "ecosystem-expense-tracker-storage": "finance.expense_tracker_v1",
  "ecosystem-forms-storage": "forms.ecosystem_v1",
  "ecosystem-goal-manager-storage": "goals.ecosystem_v1",
  "ecosystem-interaction-manager-storage": "clients.interactions_v1",
  "ecosystem-meeting-manager-storage": "meetings.ecosystem_v1",
  "ecosystem-milestone-manager-storage": "projects.milestones_v1",
  "ecosystem-notification-center-storage": "notifications.ecosystem_v1",
  "ecosystem-people-manager-storage": "clients.people_v1",
  "ecosystem-resource-manager-storage": "projects.resources_v1",
  "ecosystem-schedule-manager-storage": "meetings.schedules_v1",
  "ecosystem-search-manager-storage": "search.ecosystem_v1",
  "ecosystem-statistics-storage": "analytics.statistics_v1",
  "ecosystem-subscription-manager-storage": "finance.subscriptions_ecosystem_v1",
  "ecosystem-template-manager-storage": "templates.ecosystem_v1",
  "ecosystem-time-tracker-storage": "projects.time_tracker_v1",
  "ecosystem-workflow-manager-storage": "workflows.ecosystem_v1",

  // --- Kunci Polos / Tanpa Prefix ---
  bills_list: "legacy.finance_bills_list",
  "credit-dashboard:row-configs:v1": "finance.credit_row_configs_v1",
  credit_data: "finance.credit_data",
  goals_list: "legacy.finance_goals_list",
  lifecanvas_quick_scratchpad: "legacy.lifecanvas_scratchpad",
  manajemen_debts: "legacy.finance_debts",
  peh_pfs_workspace_v2: "legacy.peh_pfs_workspace_v2",
  savings_plans: "legacy.finance_savings_plans",
  stocks_list: "legacy.finance_stocks_list",
  subscriptions_list: "legacy.finance_subscriptions_list",
  transactions_list: "finance.transactions_list",
});

/**
 * Aturan prefix dinamis untuk kunci legacy yang menyertakan parameter runtime
 * (mis. `bizcoach_worksheet_<framework>`, `worksheet_<slug>`, `life_planner_os_v1_<key>`)
 * maupun kunci `aio_*`, `client_os_*`, dan `wira_*` tambahan yang belum terdaftar statis.
 */
export const LEGACY_DYNAMIC_PREFIX_MAP: ReadonlyArray<{
  readonly legacyPrefix: string;
  readonly targetPrefix: string;
}> = Object.freeze([
  { legacyPrefix: "bizcoach_checklist_", targetPrefix: "tools.bizcoach_checklist." },
  { legacyPrefix: "bizcoach_worksheet_", targetPrefix: "tools.bizcoach_worksheet." },
  { legacyPrefix: "worksheet_", targetPrefix: "tools.worksheet." },
  { legacyPrefix: "life_planner_os_v1_", targetPrefix: "legacy.life_os." },
  { legacyPrefix: "aio_", targetPrefix: "aio." },
  { legacyPrefix: "client_os_", targetPrefix: "client_os." },
  { legacyPrefix: "wira_", targetPrefix: "wira." },
]);

/**
 * Daftar kunci tujuan (tanpa awalan `${workspaceId}:`) milik store/repositori yang SUDAH
 * menulis ke kunci baru sebelum Batch 3C-2:
 * - 21 store Zustand `persist` (Batch 3A, 3B, 3B-2)
 * - 4 store React Hook mandiri (Batch 3C-1)
 * - 5 repositori domain konsultasi Batch 2 (`wira_consulting_*` via `src/lib/data.ts`;
 *   mengecualikan `notes.wira_knowledge_v2` karena `HalamanCatatan.tsx` masih menulis kunci lama)
 *
 * Digunakan oleh `reconcileBulkSnapshots()` agar data baru pada modul yang sudah diadopsi
 * tidak ikut terhapus saat membersihkan salinan massal basi peninggalan `migrateLegacyKeys()`.
 */
export const ADOPTED_TARGETS: ReadonlyArray<string> = Object.freeze([
  // --- 21 Store Zustand `persist` (Batch 3A, 3B, 3B-2) ---
  "approvals.ecosystem_v1",
  "deliverables.ecosystem_v1",
  "clients.interactions_v1",
  "documents.asset_manager_v1",
  "meetings.ecosystem_v1",
  "projects.milestones_v1",
  "notifications.ecosystem_v1",
  "clients.people_v1",
  "projects.resources_v1",
  "meetings.schedules_v1",
  "templates.ecosystem_v1",
  "projects.time_tracker_v1",
  "workflows.ecosystem_v1",
  "bookmarks.ecosystem_v1",
  "collaboration.ecosystem_v1",
  "finance.expense_tracker_v1",
  "forms.ecosystem_v1",
  "goals.ecosystem_v1",
  "search.ecosystem_v1",
  "analytics.statistics_v1",
  "finance.subscriptions_ecosystem_v1",

  // --- 4 Store Hook Mandiri (Batch 3C-1) ---
  "legacy.habit_tracker_v1",
  "reminders.data_v1",
  "database.data_v1",
  "wiki.data_v1",

  // --- 5 Repositori Domain Konsultasi (Batch 2, via `src/lib/data.ts`) ---
  "deliverables.wira_consulting_v1",
  "documents.wira_consulting_v1",
  "meetings.wira_consulting_v1",
  "collaboration.wira_messages_v1",
  "projects.wira_consulting_v1",
]);

export interface ReconcileBulkSnapshotsSummary {
  readonly removedCount: number;
  readonly keptCount: number;
  readonly removedKeys: string[];
}

export interface MigrationResult {
  readonly migrated: boolean;
  readonly workspaceId: string;
  readonly copiedCount: number;
  readonly skippedExistingCount: number;
  readonly reason?: "already_migrated" | "storage_unavailable" | "completed";
}

function getBrowserStorage(): Storage | null {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    return window.localStorage;
  } catch {
    return null;
  }
}

function assertNonEmptySegment(value: string, label: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`[storage] ${label} tidak boleh kosong.`);
  }
  return trimmed;
}

/**
 * Membentuk kunci fisik di `localStorage` dengan format `${workspaceId}:${key}`.
 */
export function buildStorageKey(
  key: string,
  workspaceId: string = DEFAULT_WORKSPACE_ID,
): string {
  const ws = assertNonEmptySegment(workspaceId, "workspaceId");
  const cleanKey = assertNonEmptySegment(key, "key");
  const prefix = `${ws}:`;
  return cleanKey.startsWith(prefix) ? cleanKey : `${prefix}${cleanKey}`;
}

/**
 * Mem-parse string mentah dari `localStorage` secara aman.
 * Mendukung baik JSON valid maupun string polos warisan kunci lama (mis. `"id"`, `"dark"`).
 */
function safeDeserialize<T>(raw: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

/**
 * Membaca nilai dari `localStorage` pada namespace `${workspaceId}:${key}`.
 * Mengembalikan `null` bila kunci tidak ditemukan atau akses storage gagal.
 */
export function getItem<T = unknown>(
  key: string,
  workspaceId: string = DEFAULT_WORKSPACE_ID,
): T | null {
  const storage = getBrowserStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(buildStorageKey(key, workspaceId));
    if (raw === null) return null;
    return safeDeserialize<T>(raw);
  } catch {
    return null;
  }
}

/**
 * Menyimpan nilai (diserialisasi sebagai JSON) ke `${workspaceId}:${key}`.
 * Mengembalikan `true` jika berhasil, `false` jika gagal (mis. QuotaExceededError).
 */
export function setItem<T = unknown>(
  key: string,
  value: T,
  workspaceId: string = DEFAULT_WORKSPACE_ID,
): boolean {
  const storage = getBrowserStorage();
  if (!storage) return false;

  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      return false;
    }
    storage.setItem(buildStorageKey(key, workspaceId), serialized);
    return true;
  } catch {
    return false;
  }
}

/**
 * Menghapus kunci `${workspaceId}:${key}` dari `localStorage`.
 * Mengembalikan `true` jika operasi tidak melempar error, `false` jika storage tidak tersedia.
 */
export function removeItem(
  key: string,
  workspaceId: string = DEFAULT_WORKSPACE_ID,
): boolean {
  const storage = getBrowserStorage();
  if (!storage) return false;

  try {
    storage.removeItem(buildStorageKey(key, workspaceId));
    return true;
  } catch {
    return false;
  }
}

/**
 * Mengembalikan daftar seluruh kunci logis (tanpa prefix `${workspaceId}:`)
 * yang tersimpan di dalam sebuah workspace.
 */
export function keys(workspaceId: string = DEFAULT_WORKSPACE_ID): string[] {
  const storage = getBrowserStorage();
  if (!storage) return [];

  try {
    const ws = assertNonEmptySegment(workspaceId, "workspaceId");
    const prefix = `${ws}:`;
    const result: string[] = [];

    for (let i = 0; i < storage.length; i += 1) {
      const physicalKey = storage.key(i);
      if (physicalKey && physicalKey.startsWith(prefix)) {
        result.push(physicalKey.slice(prefix.length));
      }
    }

    return result.sort();
  } catch {
    return [];
  }
}

/**
 * Menentukan nama kunci target baru untuk sebuah kunci legacy, atau `null`
 * jika kunci tersebut bukan kunci legacy (misalnya sudah ber-prefix workspace).
 */
export function resolveLegacyKeyTarget(legacyKey: string): string | null {
  if (legacyKey.includes(":") && legacyKey !== "credit-dashboard:row-configs:v1") {
    return null;
  }

  const explicitTarget = LEGACY_KEY_MAP[legacyKey];
  if (explicitTarget) {
    return explicitTarget;
  }

  for (const rule of LEGACY_DYNAMIC_PREFIX_MAP) {
    if (legacyKey.startsWith(rule.legacyPrefix)) {
      const suffix = legacyKey.slice(rule.legacyPrefix.length);
      if (suffix.length > 0) {
        return `${rule.targetPrefix}${suffix}`;
      }
    }
  }

  return null;
}

export interface WorkspaceOrLegacyReadResult<T> {
  readonly foundIn: "workspace" | "legacy" | "none";
  readonly value: T | null;
}

/**
 * Membaca nilai dari kunci ber-namespace `${workspaceId}:${key}` terlebih dahulu,
 * dan (khusus `DEFAULT_WORKSPACE_ID` / `"ws-main"`) melakukan fallback ke `legacyKey`
 * apabila kunci baru belum ada di `localStorage`.
 *
 * Digunakan oleh lapisan repository (`src/core/repos/*`) agar data pengguna yang sudah
 * tersimpan di kunci lama tetap terlihat tanpa perlu mengakses `window.localStorage`
 * secara langsung di luar `src/core/storage.ts`, sekaligus mencegah kebocoran data
 * kunci lama ke workspace lain selain `"ws-main"`.
 */
export function readWorkspaceOrLegacy<T = unknown>(
  key: string,
  options?: {
    workspaceId?: string;
    legacyKey?: string | null;
  },
): WorkspaceOrLegacyReadResult<T> {
  const workspaceId = options?.workspaceId ?? DEFAULT_WORKSPACE_ID;
  const storage = getBrowserStorage();
  if (!storage) {
    return { foundIn: "none", value: null };
  }

  try {
    const workspacePhysicalKey = buildStorageKey(key, workspaceId);
    const rawWorkspace = storage.getItem(workspacePhysicalKey);
    if (rawWorkspace !== null) {
      return {
        foundIn: "workspace",
        value: safeDeserialize<T>(rawWorkspace),
      };
    }

    const legacyKey = options?.legacyKey ?? null;
    if (legacyKey && workspaceId === DEFAULT_WORKSPACE_ID) {
      const rawLegacy = storage.getItem(legacyKey);
      if (rawLegacy !== null) {
        return {
          foundIn: "legacy",
          value: safeDeserialize<T>(rawLegacy),
        };
      }
    }
  } catch {
    return { foundIn: "none", value: null };
  }

  return { foundIn: "none", value: null };
}

/**
 * Membaca preferensi bahasa secara terpadu.
 *
 * Hasil audit komponen tombol bahasa utama:
 * - `src/app/theme-lang-toggle.tsx` (`ThemeLangToggle`): hanya mengelola tema (`aio_theme_preference`, `aio_theme`),
 *   tidak membaca maupun menulis kunci bahasa.
 * - `src/app/shell/LanguageToggle.tsx` (`LanguageToggle`): tombol bahasa utama UI membaca
 *   `localStorage.getItem("aio_lang") || localStorage.getItem("appLanguage")` (baris 25 & 35)
 *   dan saat dipilih menulis `aio_lang` lebih dulu (baris 51) lalu `appLanguage` (baris 52).
 *
 * Urutan pembacaan:
 * 1. Kunci workspace baru `${workspaceId}:prefs.lang`
 * 2. Fallback prioritas 1: `aio_lang` (sesuai prioritas utama `LanguageToggle.tsx`)
 * 3. Fallback prioritas 2: `appLanguage`
 * 4. Default `"id"`
 */
export function getUnifiedLanguage(
  workspaceId: string = DEFAULT_WORKSPACE_ID,
): string {
  const fromWorkspace = getItem<string>(UNIFIED_LANGUAGE_KEY, workspaceId);
  if (typeof fromWorkspace === "string" && fromWorkspace.trim().length > 0) {
    return fromWorkspace.trim();
  }

  const storage = getBrowserStorage();
  if (!storage) return DEFAULT_LANGUAGE;

  try {
    const rawAioLang = storage.getItem("aio_lang");
    if (rawAioLang !== null) {
      const parsed = safeDeserialize<unknown>(rawAioLang);
      if (typeof parsed === "string" && parsed.trim().length > 0) {
        return parsed.trim();
      }
    }

    const rawAppLang = storage.getItem("appLanguage");
    if (rawAppLang !== null) {
      const parsed = safeDeserialize<unknown>(rawAppLang);
      if (typeof parsed === "string" && parsed.trim().length > 0) {
        return parsed.trim();
      }
    }
  } catch {
    return DEFAULT_LANGUAGE;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Menyimpan nilai mentah legacy secara dinormalisasi sebagai JSON valid jika awalnya
 * berupa string polos, atau menyalin JSON apa adanya jika sudah merupakan JSON valid.
 */
function normalizeRawLegacyPayload(raw: string): string {
  try {
    JSON.parse(raw);
    return raw;
  } catch {
    return JSON.stringify(raw);
  }
}

/**
 * TIDAK DIPAKAI: pembacaan lazy (kunci baru lalu fallback kunci lama) sudah cukup.
 *
 * Dipertahankan di `storage.ts` semata-mata demi kompatibilitas ekspor publik. Jangan dipanggil
 * lagi dari `bootstrap.ts` karena penyalinan massal satu kali untuk modul yang belum dipindah
 * menyebabkan salinan di kunci baru menjadi basi ketika modul lama masih menulis ke kunci lama.
 */
export function migrateLegacyKeys(
  workspaceId: string = DEFAULT_WORKSPACE_ID,
): MigrationResult {
  const storage = getBrowserStorage();
  if (!storage) {
    return {
      migrated: false,
      workspaceId,
      copiedCount: 0,
      skippedExistingCount: 0,
      reason: "storage_unavailable",
    };
  }

  try {
    const flagPhysicalKey = buildStorageKey(MIGRATION_FLAG_KEY, workspaceId);
    const existingFlag = storage.getItem(flagPhysicalKey);
    if (existingFlag === "true" || existingFlag === '"1"' || existingFlag === "1") {
      return {
        migrated: false,
        workspaceId,
        copiedCount: 0,
        skippedExistingCount: 0,
        reason: "already_migrated",
      };
    }

    let copiedCount = 0;
    let skippedExistingCount = 0;

    // 1. Satukan bahasa terlebih dahulu dengan prioritas deterministik: aio_lang -> appLanguage
    const langTargetPhysicalKey = buildStorageKey(UNIFIED_LANGUAGE_KEY, workspaceId);
    if (storage.getItem(langTargetPhysicalKey) === null) {
      const preferredRawLang =
        storage.getItem("aio_lang") ?? storage.getItem("appLanguage");
      if (preferredRawLang !== null) {
        storage.setItem(
          langTargetPhysicalKey,
          normalizeRawLegacyPayload(preferredRawLang),
        );
        copiedCount += 1;
      }
    } else {
      skippedExistingCount += 1;
    }

    // 2. Snapshot semua kunci fisik saat ini agar iterasi stabil selama penyalinan
    const snapshotKeys: string[] = [];
    for (let i = 0; i < storage.length; i += 1) {
      const k = storage.key(i);
      if (k !== null) {
        snapshotKeys.push(k);
      }
    }

    // 3. Salin setiap kunci legacy tanpa menghapus sumber aslinya
    for (const legacyKey of snapshotKeys) {
      if (legacyKey === "aio_lang" || legacyKey === "appLanguage") {
        continue;
      }

      const targetLogicalKey = resolveLegacyKeyTarget(legacyKey);
      if (!targetLogicalKey) {
        continue;
      }

      const rawValue = storage.getItem(legacyKey);
      if (rawValue === null) {
        continue;
      }

      const targetPhysicalKey = buildStorageKey(targetLogicalKey, workspaceId);
      if (storage.getItem(targetPhysicalKey) !== null) {
        skippedExistingCount += 1;
        continue;
      }

      storage.setItem(targetPhysicalKey, normalizeRawLegacyPayload(rawValue));
      copiedCount += 1;
    }

    // 4. Tandai migrasi selesai secara idempoten
    storage.setItem(flagPhysicalKey, "true");

    return {
      migrated: true,
      workspaceId,
      copiedCount,
      skippedExistingCount,
      reason: "completed",
    };
  } catch {
    return {
      migrated: false,
      workspaceId,
      copiedCount: 0,
      skippedExistingCount: 0,
      reason: "storage_unavailable",
    };
  }
}

const ADOPTED_TARGETS_SET: ReadonlySet<string> = new Set(ADOPTED_TARGETS);

const STATIC_MAPPED_TARGETS_SET: ReadonlySet<string> = new Set(
  Object.values(LEGACY_KEY_MAP).filter((target) => target !== UNIFIED_LANGUAGE_KEY),
);

function isLegacyMappedTargetLogicalKey(logicalKey: string): boolean {
  if (STATIC_MAPPED_TARGETS_SET.has(logicalKey)) {
    return true;
  }
  return LEGACY_DYNAMIC_PREFIX_MAP.some(
    (rule) =>
      logicalKey.startsWith(rule.targetPrefix) &&
      logicalKey.length > rule.targetPrefix.length,
  );
}

/**
 * Membersihkan satu kali salinan massal basi (`${workspaceId}:<tujuan>`) peninggalan
 * `migrateLegacyKeys()` untuk seluruh target hasil `LEGACY_KEY_MAP` dan `LEGACY_DYNAMIC_PREFIX_MAP`
 * yang BELUM masuk dalam `ADOPTED_TARGETS`.
 *
 * Jaminan keamanan:
 * - Dijaga flag `${workspaceId}:reconcile_v1` (idempoten; panggilan berikutnya tidak menghapus apa pun).
 * - Kunci lama (tanpa prefix `${workspaceId}:`) TIDAK pernah disentuh.
 * - Kunci milik `ADOPTED_TARGETS` serta kunci yang bukan hasil peta (mis. `migrated_v1`,
 *   `reconcile_v1`, `prefs.lang`, `clients.consulting_v1`, `tasks.consulting_v1`) TIDAK dihapus.
 */
export function reconcileBulkSnapshots(
  workspaceId: string = DEFAULT_WORKSPACE_ID,
): ReconcileBulkSnapshotsSummary {
  const storage = getBrowserStorage();
  if (!storage) {
    return { removedCount: 0, keptCount: 0, removedKeys: [] };
  }

  try {
    const ws = assertNonEmptySegment(workspaceId, "workspaceId");
    const prefix = `${ws}:`;
    const flagPhysicalKey = buildStorageKey(RECONCILE_FLAG_KEY, ws);

    const existingFlag = storage.getItem(flagPhysicalKey);
    if (existingFlag === "true" || existingFlag === '"1"' || existingFlag === "1") {
      let existingKept = 0;
      for (let i = 0; i < storage.length; i += 1) {
        const k = storage.key(i);
        if (k && k.startsWith(prefix)) {
          existingKept += 1;
        }
      }
      const summary: ReconcileBulkSnapshotsSummary = {
        removedCount: 0,
        keptCount: existingKept,
        removedKeys: [],
      };
      if (import.meta.env?.DEV) {
        console.info(`[storage] reconcileBulkSnapshots("${ws}") [sudah direkonsiliasi]:`, summary);
      }
      return summary;
    }

    const workspacePhysicalKeys: string[] = [];
    for (let i = 0; i < storage.length; i += 1) {
      const k = storage.key(i);
      if (k && k.startsWith(prefix)) {
        workspacePhysicalKeys.push(k);
      }
    }

    const removedKeys: string[] = [];
    let keptCount = 0;

    for (const physicalKey of workspacePhysicalKeys) {
      const logicalKey = physicalKey.slice(prefix.length);

      // Jaga flag sistem & prefs.lang serta semua target yang sudah diadopsi
      if (
        logicalKey === MIGRATION_FLAG_KEY ||
        logicalKey === RECONCILE_FLAG_KEY ||
        logicalKey === UNIFIED_LANGUAGE_KEY ||
        ADOPTED_TARGETS_SET.has(logicalKey)
      ) {
        keptCount += 1;
        continue;
      }

      // Hapus hanya bila kunci tersebut merupakan target hasil peta legacy yang belum diadopsi
      if (isLegacyMappedTargetLogicalKey(logicalKey)) {
        storage.removeItem(physicalKey);
        removedKeys.push(physicalKey);
      } else {
        keptCount += 1;
      }
    }

    storage.setItem(flagPhysicalKey, "true");

    const summary: ReconcileBulkSnapshotsSummary = {
      removedCount: removedKeys.length,
      keptCount,
      removedKeys: removedKeys.sort(),
    };

    if (import.meta.env?.DEV) {
      console.info(`[storage] reconcileBulkSnapshots("${ws}"):`, summary);
    }

    return summary;
  } catch {
    return { removedCount: 0, keptCount: 0, removedKeys: [] };
  }
}
