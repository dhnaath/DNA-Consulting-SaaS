import { AREAS, canEnterArea, defaultAreaFor, type Area } from "./areas";
import type { Session } from "./session";

/**
 * Target pengalihan kanonik ketika suatu sesi ditolak memasuki path tertentu.
 * - `"/"`              : Beranda area `hub` bagi `konsultan` (seluruh rute lama berakar di `/`).
 * - `"/partner"`       : Beranda area `partner` bagi `mitra`.
 * - `"/portal"`        : Beranda area `portal` bagi `klien`.
 * - `"/akses-ditolak"` : Halaman penolakan fail-closed bila sesi `null` atau tidak valid.
 */
export type RouteRedirectTarget =
  | "/"
  | "/partner"
  | "/portal"
  | "/akses-ditolak";

export type RouteAccessDecision =
  | { readonly allow: true }
  | { readonly allow: false; readonly redirectTo: RouteRedirectTarget };

function isNonEmptyString(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

function isValidRoutingSession(
  session: Session | null | undefined,
): session is Session {
  if (!session || typeof session !== "object") return false;
  if (!isNonEmptyString(session.userId)) return false;
  if (!isNonEmptyString(session.workspaceId)) return false;
  return (
    session.role === "konsultan" ||
    session.role === "mitra" ||
    session.role === "klien"
  );
}

/**
 * Menormalkan input path dengan membuang fragmen `#hash` dan `?query`,
 * memastikan awalan `"/"`, serta menghapus garis miring penutup berlebih (kecuali `"/"`).
 */
function normalizePathname(rawPathname: string): string {
  const withoutHash = rawPathname.split("#")[0] ?? "";
  const withoutQuery = withoutHash.split("?")[0] ?? "";
  const trimmed = withoutQuery.trim();
  if (!trimmed) return "/";
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.replace(/\/+$/, "") || "/";
  }
  return withLeadingSlash;
}

function matchesSegmentPrefix(cleanPath: string, prefix: string): boolean {
  return cleanPath === prefix || cleanPath.startsWith(`${prefix}/`);
}

function landingPathForArea(area: Area): RouteRedirectTarget {
  switch (area) {
    case "hub":
      return "/";
    case "partner":
      return "/partner";
    case "portal":
      return "/portal";
  }
}

/**
 * Menentukan area aplikasi berdasarkan segmen awal `pathname`:
 * - `"partner"` jika `pathname` adalah `"/partner"` atau diawali `"/partner/"`
 * - `"portal"`  jika `pathname` adalah `"/portal"` atau diawali `"/portal/"`
 * - `"hub"`     untuk seluruh rute lainnya (termasuk `"/"`, `"/portalx"`, `"/partnerx"`, dll.)
 */
export function getAreaForPath(pathname: string): Area {
  const cleanPath = normalizePathname(pathname);
  if (matchesSegmentPrefix(cleanPath, AREAS.partner.pathPrefix)) {
    return "partner";
  }
  if (matchesSegmentPrefix(cleanPath, AREAS.portal.pathPrefix)) {
    return "portal";
  }
  return "hub";
}

/**
 * Mengevaluasi hak masuk sesi aktif terhadap `pathname` menggunakan `canEnterArea()`
 * dan `defaultAreaFor()` dari `src/core/areas.ts`:
 * - Sesi `null` / tidak valid -> `{ allow: false, redirectTo: "/akses-ditolak" }`
 * - `konsultan`               -> izinkan area `"hub"`; tolak `/partner` & `/portal` -> `"/"`
 * - `mitra`                   -> izinkan area `"partner"`; selain itu -> `"/partner"`
 * - `klien`                   -> izinkan area `"portal"`; selain itu -> `"/portal"`
 */
export function resolveAccess(
  session: Session | null | undefined,
  pathname: string,
): RouteAccessDecision {
  if (!isValidRoutingSession(session)) {
    return { allow: false, redirectTo: "/akses-ditolak" };
  }

  const targetArea = getAreaForPath(pathname);
  if (canEnterArea(session, targetArea)) {
    return { allow: true };
  }

  const fallbackArea = defaultAreaFor(session.role);
  return {
    allow: false,
    redirectTo: landingPathForArea(fallbackArea),
  };
}
