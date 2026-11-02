import type { Role, Session } from "./session";

/**
 * Tiga area aplikasi SaaS Konsultasi Multi-Tenant:
 * - `hub`     (`/hub`)     -> Ruang kerja internal konsultan (admin praktik).
 * - `partner` (`/partner`) -> Ruang kerja kolaborasi mitra eksternal pada proyek terpilih.
 * - `portal`  (`/portal`)  -> Portal klien untuk memantau progres proyek, dokumen, & persetujuan deliverable.
 */
export type Area = "hub" | "partner" | "portal";

export type AreaPathPrefix = "/hub" | "/partner" | "/portal";

export interface AreaConfig {
  readonly id: Area;
  readonly label: string;
  readonly pathPrefix: AreaPathPrefix;
  readonly allowedRoles: readonly Role[];
}

export const AREAS: Readonly<Record<Area, AreaConfig>> = Object.freeze({
  hub: Object.freeze({
    id: "hub",
    label: "Consultant Hub",
    pathPrefix: "/hub",
    allowedRoles: Object.freeze(["konsultan"] as const),
  }),
  partner: Object.freeze({
    id: "partner",
    label: "Partner Workspace",
    pathPrefix: "/partner",
    allowedRoles: Object.freeze(["mitra"] as const),
  }),
  portal: Object.freeze({
    id: "portal",
    label: "Client Portal",
    pathPrefix: "/portal",
    allowedRoles: Object.freeze(["klien"] as const),
  }),
});

/**
 * Mengembalikan area default ketika pengguna masuk atau dialihkan berdasarkan perannya.
 */
export function defaultAreaFor(role: Role): Area {
  switch (role) {
    case "konsultan":
      return "hub";
    case "mitra":
      return "partner";
    case "klien":
      return "portal";
  }
}

/**
 * Memeriksa apakah sesi aktif diizinkan memasuki suatu area (`hub` / `partner` / `portal`).
 */
export function canEnterArea(
  session: Session | null | undefined,
  area: Area,
): boolean {
  if (!session) return false;
  const config = AREAS[area];
  if (!config) return false;
  return config.allowedRoles.includes(session.role);
}
