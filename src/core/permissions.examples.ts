/**
 * Contoh verifikasi bergaya unit-test untuk `src/core/permissions.ts` (`can` & `scopeFor`),
 * `src/core/areas.ts`, dan perilaku fail-closed `src/core/session.tsx`.
 */

import { canEnterArea } from "./areas";
import { can, scopeFor } from "./permissions";
import { getAreaForPath, resolveAccess } from "./routeAccess";
import { DEV_ROLE_PRESETS, type Session } from "./session";

export interface PermissionAssertionResult {
  readonly name: string;
  readonly passed: boolean;
  readonly expected: boolean;
  readonly actual: boolean;
}

const sessionKonsultan: Session = {
  ...DEV_ROLE_PRESETS.konsultan,
};

const sessionMitra: Session = {
  ...DEV_ROLE_PRESETS.mitra,
  projectIds: ["p1", "p-audit"],
};

const sessionMitraTanpaProyek: Session = {
  userId: "partner-empty",
  name: "Mitra Tanpa Penugasan",
  email: "empty@mitra.id",
  role: "mitra",
  workspaceId: "ws-main",
};

const sessionKlienA: Session = {
  userId: "user-client-a",
  name: "PIC Klien A",
  email: "pic@kliena.co.id",
  role: "klien",
  workspaceId: "ws-main",
  clientId: "c1",
};

const sessionKlienTanpaClientId: Session = {
  userId: "user-client-broken",
  name: "Klien Tanpa ID",
  email: "broken@klien.id",
  role: "klien",
  workspaceId: "ws-main",
};

export function runPermissionVerificationSuite(): readonly PermissionAssertionResult[] {
  const sampleProjects = [
    { id: "p1", client_id: "c1", workspaceId: "ws-main" },
    { id: "p2", client_id: "c2", workspaceId: "ws-main" },
    { id: "p5", client_id: "c1", workspaceId: "ws-main" },
    { id: "p-other-ws", client_id: "c1", workspaceId: "ws-other" },
  ];

  const sampleTasks = [
    { id: "t1", project_id: "p1", workspaceId: "ws-main" },
    { id: "t3", project_id: "p2", workspaceId: "ws-main" },
  ];

  const konsultanProjectScope = scopeFor(sessionKonsultan, "project");
  const mitraProjectScope = scopeFor(sessionMitra, "project");
  const mitraTaskScope = scopeFor(sessionMitra, "task");
  const mitraFinanceScope = scopeFor(sessionMitra, "finance");
  const mitraEmptyScope = scopeFor(sessionMitraTanpaProyek, "project");
  const klienProjectScope = scopeFor(sessionKlienA, "project");
  const klienNoteScope = scopeFor(sessionKlienA, "note");
  const klienBrokenScope = scopeFor(sessionKlienTanpaClientId, "project");

  const cases: Array<{
    name: string;
    expected: boolean;
    actual: boolean;
  }> = [
    // --- Fail-closed tanpa sesi (di luar SessionProvider) ---
    {
      name: "Sesi null (di luar SessionProvider) selalu ditolak oleh can() dan canEnterArea()",
      expected: false,
      actual:
        can(null, "read", "project", { id: "p1", workspaceId: "ws-main" }) ||
        canEnterArea(null, "hub") ||
        canEnterArea(null, "partner") ||
        canEnterArea(null, "portal"),
    },

    // --- Isolasi antar klien pada can() ---
    {
      name: "Klien A tidak bisa membaca proyek milik Klien B",
      expected: false,
      actual: can(sessionKlienA, "read", "project", {
        id: "p2",
        clientId: "c2",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Klien A tidak bisa menyetujui deliverable milik Klien B",
      expected: false,
      actual: can(sessionKlienA, "approve", "deliverable", {
        id: "d5",
        clientId: "c2",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Klien A gagal (fail-closed) bila target tidak menyertakan clientId",
      expected: false,
      actual: can(sessionKlienA, "read", "project", {
        id: "p4",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Klien A bisa membaca proyek miliknya sendiri",
      expected: true,
      actual: can(sessionKlienA, "read", "project", {
        id: "p1",
        clientId: "c1",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Klien A bisa menyetujui deliverable miliknya sendiri",
      expected: true,
      actual: can(sessionKlienA, "approve", "deliverable", {
        id: "d2",
        clientId: "c1",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Klien A tidak bisa menulis/mengubah proyek miliknya sendiri",
      expected: false,
      actual: can(sessionKlienA, "write", "project", {
        id: "p1",
        clientId: "c1",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Klien A tidak bisa mengakses finance",
      expected: false,
      actual: can(sessionKlienA, "read", "finance", {
        clientId: "c1",
        workspaceId: "ws-main",
      }),
    },

    // --- Batasan peran mitra pada can() ---
    {
      name: "Mitra tidak bisa membaca finance",
      expected: false,
      actual: can(sessionMitra, "read", "finance", {
        projectId: "p1",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Mitra tidak bisa mengubah finance",
      expected: false,
      actual: can(sessionMitra, "write", "finance", {
        projectId: "p1",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Mitra tidak bisa mengakses settings, collaboration, maupun personal_tools",
      expected: false,
      actual:
        can(sessionMitra, "read", "settings", { workspaceId: "ws-main" }) ||
        can(sessionMitra, "read", "collaboration", { workspaceId: "ws-main" }) ||
        can(sessionMitra, "read", "personal_tools", { workspaceId: "ws-main" }),
    },
    {
      name: "Mitra BISA read pada project yang ditugaskan (p1 & p-audit)",
      expected: true,
      actual:
        can(sessionMitra, "read", "project", {
          id: "p1",
          workspaceId: "ws-main",
        }) &&
        can(sessionMitra, "read", "project", {
          id: "p-audit",
          workspaceId: "ws-main",
        }),
    },
    {
      name: "Mitra TIDAK BISA write pada project meskipun ditugaskan (project = READ_ONLY)",
      expected: false,
      actual: can(sessionMitra, "write", "project", {
        id: "p1",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Mitra BISA read dan write pada task serta deliverable di proyek yang ditugaskan",
      expected: true,
      actual:
        can(sessionMitra, "read", "task", {
          id: "t1",
          projectId: "p1",
          workspaceId: "ws-main",
        }) &&
        can(sessionMitra, "write", "task", {
          id: "t2",
          projectId: "p1",
          workspaceId: "ws-main",
        }) &&
        can(sessionMitra, "write", "deliverable", {
          id: "d3",
          projectId: "p1",
          workspaceId: "ws-main",
        }),
    },
    {
      name: "Mitra tidak bisa mengakses proyek yang tidak ditugaskan (p2)",
      expected: false,
      actual: can(sessionMitra, "read", "project", {
        id: "p2",
        workspaceId: "ws-main",
      }),
    },
    {
      name: "Mitra tidak bisa menghapus atau menyetujui deliverable meskipun di proyeknya",
      expected: false,
      actual:
        can(sessionMitra, "delete", "deliverable", {
          id: "d3",
          projectId: "p1",
          workspaceId: "ws-main",
        }) ||
        can(sessionMitra, "approve", "deliverable", {
          id: "d3",
          projectId: "p1",
          workspaceId: "ws-main",
        }),
    },

    // --- Hak penuh konsultan di workspace sendiri & isolasi antar workspace ---
    {
      name: "Konsultan memiliki akses penuh ke finance, settings, dan proyek di workspace-nya",
      expected: true,
      actual:
        can(sessionKonsultan, "delete", "finance", { workspaceId: "ws-main" }) &&
        can(sessionKonsultan, "write", "settings", { workspaceId: "ws-main" }) &&
        can(sessionKonsultan, "approve", "deliverable", {
          id: "d5",
          clientId: "c2",
          workspaceId: "ws-main",
        }),
    },
    {
      name: "Konsultan, Mitra, dan Klien ditolak bila target berasal dari workspace berbeda atau kosong",
      expected: false,
      actual:
        can(sessionKonsultan, "read", "project", {
          id: "p1",
          workspaceId: "ws-other",
        }) ||
        can(sessionKonsultan, "read", "project", {
          id: "p1",
          workspaceId: "",
        }) ||
        can(sessionMitra, "read", "project", {
          id: "p1",
          workspaceId: "ws-other",
        }) ||
        can(sessionKlienA, "read", "project", {
          id: "p1",
          clientId: "c1",
          workspaceId: "ws-other",
        }),
    },

    // --- Skenario scopeFor() (Batch 2, >= 6 skenario) ---
    {
      name: "[scopeFor 1] Konsultan mendapat allowed=true dan memfilter hanya item di workspace aktif",
      expected: true,
      actual:
        konsultanProjectScope.allowed === true &&
        sampleProjects.filter(konsultanProjectScope.filter).length === 3,
    },
    {
      name: "[scopeFor 2] Mitra dengan projectIds ['p1', 'p-audit'] hanya meloloskan proyek & tugas milik 'p1'",
      expected: true,
      actual:
        mitraProjectScope.allowed === true &&
        sampleProjects.filter(mitraProjectScope.filter).map((p) => p.id).join(",") === "p1" &&
        mitraTaskScope.allowed === true &&
        sampleTasks.filter(mitraTaskScope.filter).map((t) => t.id).join(",") === "t1",
    },
    {
      name: "[scopeFor 3] Mitra mendapat allowed=false pada finance, settings, collaboration, dan personal_tools",
      expected: false,
      actual:
        mitraFinanceScope.allowed ||
        scopeFor(sessionMitra, "settings").allowed ||
        scopeFor(sessionMitra, "collaboration").allowed ||
        scopeFor(sessionMitra, "personal_tools").allowed,
    },
    {
      name: "[scopeFor 4] Mitra tanpa projectIds gagal secara fail-closed (allowed=false, hasil filter kosong)",
      expected: false,
      actual:
        mitraEmptyScope.allowed ||
        sampleProjects.some(mitraEmptyScope.filter),
    },
    {
      name: "[scopeFor 5] Klien c1 hanya meloloskan proyek milik c1 di workspace yang sama (p1, p5)",
      expected: true,
      actual:
        klienProjectScope.allowed === true &&
        sampleProjects.filter(klienProjectScope.filter).map((p) => p.id).join(",") === "p1,p5",
    },
    {
      name: "[scopeFor 6] Klien mendapat allowed=false untuk resource selain project/deliverable/document (mis. client, task, note, meeting, finance)",
      expected: false,
      actual:
        klienNoteScope.allowed ||
        scopeFor(sessionKlienA, "client").allowed ||
        scopeFor(sessionKlienA, "task").allowed ||
        scopeFor(sessionKlienA, "meeting").allowed ||
        scopeFor(sessionKlienA, "finance").allowed,
    },
    {
      name: "[scopeFor 7] Klien tanpa clientId gagal secara fail-closed (allowed=false)",
      expected: false,
      actual:
        klienBrokenScope.allowed ||
        sampleProjects.some(klienBrokenScope.filter),
    },
    {
      name: "[scopeFor 8] Sesi null atau workspaceId kosong gagal secara fail-closed pada scopeFor()",
      expected: false,
      actual:
        scopeFor(null, "project").allowed ||
        scopeFor({ ...sessionKonsultan, workspaceId: "" }, "project").allowed,
    },

    // --- Skenario routeAccess.ts (Batch 4, >= 8 skenario) ---
    {
      name: "[routeAccess 1] Konsultan diizinkan pada rute hub akar maupun rute dalam (/, /wiki, /kurasi)",
      expected: true,
      actual:
        resolveAccess(sessionKonsultan, "/").allow === true &&
        resolveAccess(sessionKonsultan, "/wiki").allow === true &&
        resolveAccess(sessionKonsultan, "/kurasi").allow === true,
    },
    {
      name: "[routeAccess 2] Konsultan yang mengakses /portal atau /partner ditolak dan diarahkan ke '/'",
      expected: true,
      actual: (() => {
        const dPortal = resolveAccess(sessionKonsultan, "/portal");
        const dPartner = resolveAccess(sessionKonsultan, "/partner");
        return (
          !dPortal.allow &&
          dPortal.redirectTo === "/" &&
          !dPartner.allow &&
          dPartner.redirectTo === "/"
        );
      })(),
    },
    {
      name: "[routeAccess 3] Path mirip '/portalx' dan '/partnerx' diklasifikasikan sebagai 'hub' (BUKAN portal/partner)",
      expected: true,
      actual:
        getAreaForPath("/portalx") === "hub" &&
        getAreaForPath("/partnerx") === "hub" &&
        getAreaForPath("/portal-klien") === "hub" &&
        resolveAccess(sessionKonsultan, "/portalx").allow === true,
    },
    {
      name: "[routeAccess 4] Path dengan query string & hash ('/portal?tab=dokumen#atas', '/partner?p=p1#tugas') tetap dikenali sebagai area portal/partner",
      expected: true,
      actual:
        getAreaForPath("/portal?tab=dokumen#atas") === "portal" &&
        getAreaForPath("/portal/proyek?id=p1#ringkasan") === "portal" &&
        getAreaForPath("/partner?p=p1#tugas") === "partner" &&
        getAreaForPath("/partner/deliverable?d=d2") === "partner",
    },
    {
      name: "[routeAccess 5] Klien diizinkan di /portal (termasuk query/hash), namun diarahkan ke /portal saat membuka rute hub atau /partner",
      expected: true,
      actual: (() => {
        const okPortal = resolveAccess(sessionKlienA, "/portal?view=deliverables#top");
        const denyHub = resolveAccess(sessionKlienA, "/wiki");
        const denyPartner = resolveAccess(sessionKlienA, "/partner");
        return (
          okPortal.allow === true &&
          !denyHub.allow &&
          denyHub.redirectTo === "/portal" &&
          !denyPartner.allow &&
          denyPartner.redirectTo === "/portal"
        );
      })(),
    },
    {
      name: "[routeAccess 6] Klien yang membuka path mirip '/portalx?foo=1#bar' tetap ditolak dan diarahkan ke '/portal'",
      expected: true,
      actual: (() => {
        const res = resolveAccess(sessionKlienA, "/portalx?foo=1#bar");
        return !res.allow && res.redirectTo === "/portal";
      })(),
    },
    {
      name: "[routeAccess 7] Mitra diizinkan di /partner (termasuk sub-path & query/hash), namun diarahkan ke /partner saat membuka rute hub atau /portal",
      expected: true,
      actual: (() => {
        const okPartner = resolveAccess(sessionMitra, "/partner/tugas?project=p1#list");
        const denyRoot = resolveAccess(sessionMitra, "/");
        const denyPortal = resolveAccess(sessionMitra, "/portal");
        return (
          okPartner.allow === true &&
          !denyRoot.allow &&
          denyRoot.redirectTo === "/partner" &&
          !denyPortal.allow &&
          denyPortal.redirectTo === "/partner"
        );
      })(),
    },
    {
      name: "[routeAccess 8] Mitra yang membuka path mirip '/partnerx' tetap ditolak dan diarahkan ke '/partner'",
      expected: true,
      actual: (() => {
        const res = resolveAccess(sessionMitra, "/partnerx");
        return !res.allow && res.redirectTo === "/partner";
      })(),
    },
    {
      name: "[routeAccess 9] Sesi null atau undefined ditolak pada seluruh area (/, /portal, /partner) dan diarahkan ke '/akses-ditolak'",
      expected: true,
      actual: (() => {
        const rHub = resolveAccess(null, "/");
        const rPortal = resolveAccess(undefined, "/portal");
        const rPartner = resolveAccess(null, "/partner");
        return (
          !rHub.allow &&
          rHub.redirectTo === "/akses-ditolak" &&
          !rPortal.allow &&
          rPortal.redirectTo === "/akses-ditolak" &&
          !rPartner.allow &&
          rPartner.redirectTo === "/akses-ditolak"
        );
      })(),
    },
    {
      name: "[routeAccess 10] Sesi tidak valid (userId kosong, workspaceId kosong, atau role asing 'tamu') ditolak ke '/akses-ditolak'",
      expected: true,
      actual: (() => {
        const emptyUser = resolveAccess({ ...sessionKonsultan, userId: "   " }, "/wiki");
        const emptyWs = resolveAccess({ ...sessionKonsultan, workspaceId: "" }, "/wiki");
        const badRole = resolveAccess(
          { ...sessionKonsultan, role: "tamu" as unknown as Session["role"] },
          "/portal",
        );
        return (
          !emptyUser.allow &&
          emptyUser.redirectTo === "/akses-ditolak" &&
          !emptyWs.allow &&
          emptyWs.redirectTo === "/akses-ditolak" &&
          !badRole.allow &&
          badRole.redirectTo === "/akses-ditolak"
        );
      })(),
    },
  ];

  return cases.map((item) => ({
    name: item.name,
    expected: item.expected,
    actual: item.actual,
    passed: item.expected === item.actual,
  }));
}
