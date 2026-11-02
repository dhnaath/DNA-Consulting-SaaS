import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { QueryClientContext, type QueryClient } from "@tanstack/react-query";
import { DEFAULT_WORKSPACE_ID } from "./storage";

/**
 * Tiga peran utama SaaS Konsultasi Multi-Tenant:
 * - `konsultan`: Admin praktik konsultasi (akses penuh ke seluruh area `/hub` & workspace).
 * - `mitra`: Konsultan rekanan / spesialis eksternal (akses baca proyek terpilih & baca/tulis tugas/deliverable di `/partner`).
 * - `klien`: Perwakilan perusahaan klien (akses baca proyek/dokumen & persetujuan deliverable milik perusahaannya di `/portal`).
 */
export type Role = "konsultan" | "mitra" | "klien";

export type Session = {
  userId: string;
  name: string;
  email: string;
  role: Role;
  workspaceId: string;
  clientId?: string;
  projectIds?: string[];
};

/**
 * Sesi default sementara yang disuplai HANYA oleh `<SessionProvider>`
 * agar perilaku aplikasi saat ini tetap identik 100% sebelum autentikasi backend tersedia.
 *
 * PENTING (Fail-Closed):
 * Nilai bawaan `SessionContext` maupun state modul `currentModuleSession` di luar `<SessionProvider>`
 * adalah `null` (BUKAN sesi konsultan). Pemanggilan `useSession()` di luar `<SessionProvider>`
 * melempar `Error` eksplisit, dan `getCurrentSession()` mengembalikan `null` bila provider belum terpasang.
 */
export const DEFAULT_CONSULTANT_SESSION: Readonly<Session> = Object.freeze({
  userId: "consultant",
  name: "Dhia Najmi",
  email: "dhnaath@gmail.com",
  role: "konsultan",
  workspaceId: DEFAULT_WORKSPACE_ID,
});

/**
 * Persona contoh khusus mode pengembangan (`import.meta.env.DEV`)
 * untuk mempermudah pengujian perpindahan peran (`konsultan` / `mitra` / `klien`).
 */
export const DEV_ROLE_PRESETS: Readonly<Record<Role, Session>> = Object.freeze({
  konsultan: {
    userId: "consultant",
    name: "Dhia Najmi",
    email: "dhnaath@gmail.com",
    role: "konsultan",
    workspaceId: DEFAULT_WORKSPACE_ID,
  },
  mitra: {
    userId: "partner-01",
    name: "Raka Pratama (Mitra)",
    email: "raka.mitra@dnaconsulting.id",
    role: "mitra",
    workspaceId: DEFAULT_WORKSPACE_ID,
    projectIds: ["p1", "p-audit"],
  },
  klien: {
    userId: "client-c1-pic",
    name: "Budi Santoso (PT Maju Bersama)",
    email: "budi@majubersama.co.id",
    role: "klien",
    workspaceId: DEFAULT_WORKSPACE_ID,
    clientId: "c1",
  },
});

export interface DevSessionControls {
  /** Bernilai `true` hanya ketika `import.meta.env.DEV === true`. */
  readonly enabled: boolean;
  /** Mengganti peran aktif menggunakan preset dev (no-op di build produksi). */
  switchRole: (role: Role, overrides?: Partial<Omit<Session, "role">>) => void;
  /** Mengganti objek `Session` secara eksplisit di mode dev (no-op di build produksi). */
  setSession: (next: Session) => void;
  /** Mengembalikan sesi ke `DEFAULT_CONSULTANT_SESSION` di mode dev (no-op di build produksi). */
  resetSession: () => void;
}

export interface SessionContextValue {
  readonly session: Session;
  readonly dev: DevSessionControls;
}

const isDevEnvironment: boolean = Boolean(import.meta.env?.DEV);

const noopSwitchRole = (): void => {
  // Sengaja kosong di luar mode DEV.
};

const noopSetSession = (): void => {
  // Sengaja kosong di luar mode DEV.
};

const noopResetSession = (): void => {
  // Sengaja kosong di luar mode DEV.
};

const DISABLED_DEV_CONTROLS: DevSessionControls = Object.freeze({
  enabled: false,
  switchRole: noopSwitchRole,
  setSession: noopSetSession,
  resetSession: noopResetSession,
});

function cloneSession(source: Readonly<Session>): Session {
  return {
    ...source,
    projectIds: source.projectIds ? [...source.projectIds] : undefined,
  };
}

/**
 * Snapshot sesi aktif di level modul untuk pemanggil non-React/non-hook
 * (khususnya `queryFn` di `src/lib/data.ts` yang tidak dapat memanggil React Hook).
 *
 * FAIL-CLOSED: Bernilai `null` sampai `<SessionProvider>` benar-benar terpasang,
 * dan kembali `null` ketika `<SessionProvider>` dilepas (unmount).
 */
let currentModuleSession: Session | null = null;
let activeProviderSymbol: symbol | null = null;

/**
 * Mengembalikan salinan sesi aktif yang disinkronkan oleh `<SessionProvider>`,
 * atau `null` bila dipanggil sebelum/di luar `<SessionProvider>` (fail-closed).
 */
export function getCurrentSession(): Session | null {
  return currentModuleSession ? cloneSession(currentModuleSession) : null;
}

/**
 * Membuat kunci identitas keamanan sesi untuk mendeteksi perpindahan batas otorisasi
 * (`role`, `workspaceId`, `userId`, `clientId`, serta cakupan `projectIds`).
 */
function buildSessionSecurityFingerprint(s: Session): string {
  const projectsKey = Array.isArray(s.projectIds) ? s.projectIds.join(",") : "";
  return `${s.workspaceId}|${s.userId}|${s.role}|${s.clientId ?? ""}|${projectsKey}`;
}

/**
 * Membersihkan seluruh cache React Query (`queryClient.clear()`) lalu memicu pembacaan ulang
 * untuk observer yang sedang aktif.
 *
 * ALASAN ARSITEKTURAL WAJIB:
 * Definisi `queryOptions` publik di `src/lib/data.ts` (`clientsQuery`, `projectsQuery`, `notesQuery`, dst.)
 * menggunakan `queryKey` statis seperti `["clients"]` dan `["projects"]` demi menjaga tanda tangan
 * publik tetap kompatibel 100% tanpa mengedit komponen pemanggil. Tanpa `queryClient.clear()` saat
 * `role`, `workspaceId`, `userId`, atau `clientId` berubah, data yang sudah di-cache oleh sesi sebelumnya
 * (mis. daftar seluruh klien/proyek milik `konsultan`) akan tetap tersaji dari memori React Query kepada
 * sesi berikutnya (`klien` atau `mitra`), sehingga menyebabkan kebocoran data lintas-tenant/lintas-peran.
 */
function purgeQueryCacheOnSessionChange(queryClient: QueryClient | undefined): void {
  if (!queryClient) return;
  queryClient.clear();
  void queryClient.invalidateQueries();
}

const SessionContext = createContext<SessionContextValue | null>(null);

export interface SessionProviderProps {
  children: React.ReactNode;
  /** Opsional untuk pengujian terisolasi (default di dalam Provider: `DEFAULT_CONSULTANT_SESSION`). */
  initialSession?: Session;
  /**
   * Instance `QueryClient` aplikasi agar `SessionProvider` dapat memanggil `queryClient.clear()`
   * setiap kali identitas sesi berubah (mendukung penempatan `SessionProvider` di atas `QueryClientProvider`).
   * Jika tidak diberikan via prop, `SessionProvider` otomatis mencoba membaca dari `QueryClientContext`.
   */
  queryClient?: QueryClient;
}

export function SessionProvider({
  children,
  initialSession,
  queryClient: queryClientProp,
}: SessionProviderProps): React.ReactElement {
  const contextQueryClient = useContext(QueryClientContext);
  const resolvedQueryClient = queryClientProp ?? contextQueryClient;
  const queryClientRef = useRef<QueryClient | undefined>(resolvedQueryClient);
  queryClientRef.current = resolvedQueryClient;

  const instanceSymbolRef = useRef<symbol | null>(null);
  if (instanceSymbolRef.current === null) {
    instanceSymbolRef.current = Symbol("SessionProviderInstance");
  }

  const [session, setSessionState] = useState<Session>(() => {
    const start = cloneSession(initialSession ?? DEFAULT_CONSULTANT_SESSION);
    activeProviderSymbol = instanceSymbolRef.current;
    currentModuleSession = start;
    return start;
  });

  // Jaga agar `currentModuleSession` selalu sinkron sebelum child komponen merender `useQueries`.
  activeProviderSymbol = instanceSymbolRef.current;
  currentModuleSession = session;

  const lastClearedFingerprintRef = useRef<string>(
    buildSessionSecurityFingerprint(session),
  );

  const applySessionTransition = useCallback((nextRaw: Session) => {
    const next = cloneSession(nextRaw);
    const nextFingerprint = buildSessionSecurityFingerprint(next);
    const changed = lastClearedFingerprintRef.current !== nextFingerprint;

    // 1. Perbarui referensi sesi modul lebih dulu agar refetch berikutnya langsung memakai sesi baru.
    currentModuleSession = next;
    lastClearedFingerprintRef.current = nextFingerprint;
    setSessionState(next);

    // 2. Bersihkan cache React Query seketika apabila batas identitas sesi berubah.
    if (changed) {
      purgeQueryCacheOnSessionChange(queryClientRef.current);
    }
  }, []);

  useEffect(() => {
    const mySymbol = instanceSymbolRef.current;
    activeProviderSymbol = mySymbol;
    currentModuleSession = session;

    const currentFingerprint = buildSessionSecurityFingerprint(session);
    if (lastClearedFingerprintRef.current !== currentFingerprint) {
      lastClearedFingerprintRef.current = currentFingerprint;
      purgeQueryCacheOnSessionChange(queryClientRef.current);
    }

    return () => {
      if (activeProviderSymbol === mySymbol) {
        activeProviderSymbol = null;
        currentModuleSession = null;
      }
    };
  }, [session]);

  const switchRole = useCallback(
    (role: Role, overrides?: Partial<Omit<Session, "role">>) => {
      if (!isDevEnvironment) return;
      const preset = DEV_ROLE_PRESETS[role];
      const hasProjectIdsOverride =
        overrides !== undefined &&
        Object.prototype.hasOwnProperty.call(overrides, "projectIds");
      const hasClientIdOverride =
        overrides !== undefined &&
        Object.prototype.hasOwnProperty.call(overrides, "clientId");

      applySessionTransition({
        ...preset,
        ...overrides,
        role,
        clientId: hasClientIdOverride ? overrides?.clientId : preset.clientId,
        projectIds: hasProjectIdsOverride
          ? overrides?.projectIds
            ? [...overrides.projectIds]
            : undefined
          : preset.projectIds
            ? [...preset.projectIds]
            : undefined,
      });
    },
    [applySessionTransition],
  );

  const setSession = useCallback(
    (next: Session) => {
      if (!isDevEnvironment) return;
      applySessionTransition(next);
    },
    [applySessionTransition],
  );

  const resetSession = useCallback(() => {
    if (!isDevEnvironment) return;
    applySessionTransition(DEFAULT_CONSULTANT_SESSION);
  }, [applySessionTransition]);

  const value = useMemo<SessionContextValue>(
    () => ({
      session,
      dev: isDevEnvironment
        ? {
            enabled: true,
            switchRole,
            setSession,
            resetSession,
          }
        : DISABLED_DEV_CONTROLS,
    }),
    [session, switchRole, setSession, resetSession],
  );

  return React.createElement(SessionContext.Provider, { value }, children);
}

/**
 * Mengambil sesi pengguna aktif beserta helper dev switcher.
 * FAIL-CLOSED: Melempar `Error` eksplisit jika dipanggil di luar `<SessionProvider>`.
 */
export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (ctx === null) {
    throw new Error(
      "[session] useSession() dipanggil di luar <SessionProvider>. Akses ditolak (fail-closed).",
    );
  }
  return ctx;
}

/**
 * Varian non-throwing yang mengembalikan `null` jika dipanggil di luar `<SessionProvider>`.
 * Nilai `null` selalu ditolak (`false`) oleh `can()`, `scopeFor()`, maupun `canEnterArea()`.
 */
export function useOptionalSession(): Session | null {
  const ctx = useContext(SessionContext);
  return ctx ? ctx.session : null;
}
