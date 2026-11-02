import { queryOptions } from "@tanstack/react-query";
import { scopeFor } from "@/core/permissions";
import {
  clientsRepo,
  deliverablesRepo,
  documentsRepo,
  meetingsRepo,
  messagesRepo,
  notesRepo,
  projectsRepo,
  tasksRepo,
  type ActivityRecord,
  type ClientRecord,
  type DeliverableRecord,
  type DocumentRecord,
  type MeetingRecord,
  type MessageAttachmentRecord,
  type MessageRecord,
  type NoteRecord,
  type ProjectRecord,
  type TaskRecord,
} from "@/core/repos";
import {
  SEED_DOCUMENTS,
  SEED_MEETINGS,
  SEED_MESSAGES,
} from "@/core/repos/seeds";
import { getCurrentSession } from "@/core/session";

export type Client = ClientRecord;
export type Project = ProjectRecord;
export type Task = TaskRecord;
export type Deliverable = DeliverableRecord;
export type Note = NoteRecord;
export type Activity = ActivityRecord;
export type MessageAttachment = MessageAttachmentRecord;
export type Message = MessageRecord;
export type Document = DocumentRecord;
export type Meeting = MeetingRecord;

export const STORAGE_PROJECTS_KEY = "wira_consulting_projects_v1";
export const STORAGE_DELIVERABLES_KEY = "wira_consulting_deliverables_v1";
export const STORAGE_DOCUMENTS_KEY = "wira_consulting_documents_v1";
export const STORAGE_MESSAGES_KEY = "wira_consulting_messages_v1";
export const STORAGE_MEETINGS_KEY = "wira_consulting_meetings_v1";

export const MOCK_DOCUMENTS: Document[] = [...SEED_DOCUMENTS];
export const MOCK_MEETINGS: Meeting[] = [...SEED_MEETINGS];
export const MOCK_MESSAGES: Message[] = [...SEED_MESSAGES];

const MOCK_ACTIVITIES: Activity[] = [];

export function getInitialProjects(): Project[] {
  return projectsRepo.list(getCurrentSession());
}

export function saveProjects(projects: Project[]) {
  projectsRepo.replaceAll(getCurrentSession(), projects);
}

function getInitialDocuments(): Document[] {
  return documentsRepo.list(getCurrentSession());
}

export function getInitialMeetings(): Meeting[] {
  return meetingsRepo.list(getCurrentSession());
}

export function saveMeetings(meetings: Meeting[]) {
  meetingsRepo.replaceAll(getCurrentSession(), meetings);
}

export function getInitialMessages(): Message[] {
  return messagesRepo.list(getCurrentSession());
}

export function saveMessages(messages: Message[]) {
  messagesRepo.replaceAll(getCurrentSession(), messages);
}

export function getInitialDeliverables(): Deliverable[] {
  return deliverablesRepo.list(getCurrentSession());
}

export function saveDeliverables(deliverables: Deliverable[]) {
  deliverablesRepo.replaceAll(getCurrentSession(), deliverables);
}

async function fetchAll<T>(
  table: string,
  _order: string,
  _asc = true,
): Promise<T[]> {
  const session = getCurrentSession();

  switch (table) {
    case "clients":
      return clientsRepo.list(session) as unknown as T[];
    case "projects":
      return projectsRepo.list(session) as unknown as T[];
    case "tasks":
      return tasksRepo.list(session) as unknown as T[];
    case "deliverables":
      return deliverablesRepo.list(session) as unknown as T[];
    case "notes":
      return notesRepo.list(session) as unknown as T[];
    case "activities": {
      const activityScope = scopeFor(session, "project");
      if (!activityScope.allowed) return [];
      return MOCK_ACTIVITIES.filter((item) =>
        activityScope.filter({
          id: item.id,
          client_id: item.client_id,
          project_id: item.project_id,
          workspaceId: session?.workspaceId,
        }),
      ) as unknown as T[];
    }
    case "messages":
      return messagesRepo.list(session) as unknown as T[];
    case "documents":
      return getInitialDocuments() as unknown as T[];
    case "meetings":
      return meetingsRepo.list(session) as unknown as T[];
    default:
      return [];
  }
}

export const clientsQuery = queryOptions({
  queryKey: ["clients"],
  queryFn: () => fetchAll<Client>("clients", "nama"),
});

export const projectsQuery = queryOptions({
  queryKey: ["projects"],
  queryFn: () => fetchAll<Project>("projects", "tanggal_selesai"),
});

export const tasksQuery = queryOptions({
  queryKey: ["tasks"],
  queryFn: () => fetchAll<Task>("tasks", "tenggat"),
});

export const deliverablesQuery = queryOptions({
  queryKey: ["deliverables"],
  queryFn: () => fetchAll<Deliverable>("deliverables", "jatuh_tempo"),
});

export const notesQuery = queryOptions({
  queryKey: ["notes"],
  queryFn: () => fetchAll<Note>("notes", "updated_at", false),
});

export const activitiesQuery = queryOptions({
  queryKey: ["activities"],
  queryFn: () => fetchAll<Activity>("activities", "waktu", false),
});

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

export const rupiahRingkas = (n: number) => {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)} jt`;
  return rupiah(n);
};

export const tanggal = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

export const tanggalPendek = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
      })
    : "—";

export const waktuRelatif = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const hari = Math.floor(diff / 86400000);
  if (hari <= 0) return "hari ini";
  if (hari === 1) return "kemarin";
  if (hari < 30) return `${hari} hari lalu`;
  return tanggal(d);
};

export const statusTugas: Record<string, string> = {
  todo: "Belum mulai",
  berjalan: "Dikerjakan",
  review: "Review",
  selesai: "Selesai",
};

export const statusProyek: Record<string, string> = {
  perencanaan: "Perencanaan",
  berjalan: "Berjalan",
  tertahan: "Tertahan",
  selesai: "Selesai",
};

export const sisaHari = (d: string | null) => {
  if (!d) return null;
  const target = new Date(d + "T23:59:59");
  return Math.ceil((target.getTime() - Date.now()) / 86400000);
};

/* ---------------- Sisi klien ---------------- */

export const messagesQuery = queryOptions({
  queryKey: ["messages"],
  queryFn: () => fetchAll<Message>("messages", "created_at"),
});

export const documentsQuery = queryOptions({
  queryKey: ["documents"],
  queryFn: () => fetchAll<Document>("documents", "created_at", false),
});

export const meetingsQuery = queryOptions({
  queryKey: ["meetings"],
  queryFn: () => fetchAll<Meeting>("meetings", "mulai"),
});

export const jamMenit = (d: string) =>
  new Date(d).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

export const tanggalJam = (d: string) => `${tanggal(d)} · ${jamMenit(d)}`;

export const hariPendek = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", { weekday: "short" });
