import { useState, useEffect, useCallback, useMemo } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import {
  CalendarContainer,
  CalendarEvent,
  EventException,
  Participant,
  AvailabilitySlot,
  RecurrenceRule,
  EventStatus,
} from "./types";
import { Task } from "../task-manager/types";
import { Milestone } from "../project-manager/types";

const CALENDAR_STORAGE_KEY = "aio_calendar_data_v1";
const TASK_STORAGE_KEY = "aio_task_manager_data_v1";
const PROJECT_STORAGE_KEY = "aio_project_manager_data_v1";

interface CalendarState {
  calendars: CalendarContainer[];
  events: CalendarEvent[];
  availability: AvailabilitySlot[];
  hiddenExternalRefs: string[]; // List of sourceId marked hidden in calendar (§3.2)
}

const DEFAULT_CALENDARS: CalendarContainer[] = [
  {
    id: "cal-personal",
    name: "Pribadi & Pengembangan",
    color: "#8b5cf6",
    ownerId: "u-current",
    type: "personal",
    visibility: "shown",
  },
  {
    id: "cal-work",
    name: "Firma & Klien Korporasi",
    color: "#2563eb",
    ownerId: "u-current",
    type: "shared",
    visibility: "shown",
  },
  {
    id: "cal-project",
    name: "Tim Proyek & Audit",
    color: "#059669",
    ownerId: "u-current",
    type: "shared",
    visibility: "shown",
  },
  {
    id: "cal-holidays",
    name: "Hari Libur Nasional (Subscribed)",
    color: "#d97706",
    ownerId: "system",
    type: "subscribed",
    visibility: "shown",
  },
];

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();
const currentDay = now.getDate();

const makeIso = (dayOffset: number, hour: number, minute: number = 0) => {
  const d = new Date(currentYear, currentMonth, currentDay + dayOffset, hour, minute, 0);
  return d.toISOString();
};

const DEFAULT_EVENTS: CalendarEvent[] = [
  {
    id: "ev-1",
    title: "Weekly Alignment & Status Konsultan Partner",
    description: "Evaluasi mingguan progres portofolio audit korporasi dan restrukturisasi klien.",
    calendarId: "cal-work",
    startAt: makeIso(0, 9, 30),
    endAt: makeIso(0, 10, 45),
    location: "Ruang Rapat Utama & Google Meet",
    status: "confirmed",
    visibility: "default",
    color: "#2563eb",
    participants: [
      { id: "p-1", eventId: "ev-1", userId: "u-1", name: "Partner Eksekutif", email: "partner@firm.co.id", role: "organizer", rsvpStatus: "accepted" },
      { id: "p-2", eventId: "ev-1", userId: "u-2", name: "Senior Auditor Budi", email: "budi@firm.co.id", role: "required", rsvpStatus: "accepted" },
      { id: "p-3", eventId: "ev-1", userId: "u-3", name: "Konsultan Hukum", email: "legal@firm.co.id", role: "optional", rsvpStatus: "tentative" },
    ],
    exceptions: [],
    reminders: [
      { id: "r-1", eventId: "ev-1", offsetMinutes: 15, channel: "in_app", status: "pending" },
    ],
    recurrence: {
      type: "weekly",
      interval: 1,
      daysOfWeek: [new Date().getDay()],
    },
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ev-2",
    title: "Presentasi Executive Board: Laporan Tata Kelola PT Mandiri",
    description: "Penyampaian temuan awal dan rekomendasi perbaikan kepatuhan kepada Direksi.",
    calendarId: "cal-project",
    startAt: makeIso(1, 14, 0),
    endAt: makeIso(1, 16, 0),
    location: "Menara Sudirman Lantai 22, Jakarta",
    status: "confirmed",
    visibility: "public",
    color: "#059669",
    participants: [
      { id: "p-4", eventId: "ev-2", userId: "u-1", name: "Partner Eksekutif", email: "partner@firm.co.id", role: "organizer", rsvpStatus: "accepted" },
      { id: "p-5", eventId: "ev-2", userId: "u-client", name: "Dewan Direksi Klien", email: "board@klien.co.id", role: "required", rsvpStatus: "accepted" },
    ],
    exceptions: [],
    reminders: [
      { id: "r-2", eventId: "ev-2", offsetMinutes: 60, channel: "email", status: "pending" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ev-3",
    title: "Fokus Mandiri: Penulisan Opini Hukum Finansial",
    description: "Sesi waktu fokus tanpa gangguan untuk finalisasi risalah opini hukum.",
    calendarId: "cal-personal",
    startAt: makeIso(2, 10, 0),
    endAt: makeIso(2, 12, 0),
    status: "confirmed",
    visibility: "private",
    color: "#8b5cf6",
    participants: [],
    exceptions: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "ev-holiday",
    title: "Cuti Bersama / Libur Nasional Kalender",
    calendarId: "cal-holidays",
    startAt: makeIso(5, 0, 0),
    endAt: makeIso(5, 23, 59),
    allDay: true,
    status: "confirmed",
    visibility: "public",
    color: "#d97706",
    participants: [],
    exceptions: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_AVAILABILITY: AvailabilitySlot[] = [
  {
    userId: "u-1",
    userName: "Partner Eksekutif",
    dayOfWeek: [1, 2, 3, 4, 5],
    startTime: "09:00",
    endTime: "17:00",
    timezone: "Asia/Jakarta",
  },
  {
    userId: "u-2",
    userName: "Senior Auditor Budi",
    dayOfWeek: [1, 2, 3, 4, 5],
    startTime: "08:30",
    endTime: "16:30",
    timezone: "Asia/Jakarta",
  },
];

export function useCalendar() {
  const [state, setState] = useState<CalendarState>(() => {
    try {
      const saved = getRaw(CALENDAR_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load calendar state", e);
    }
    return {
      calendars: DEFAULT_CALENDARS,
      events: DEFAULT_EVENTS,
      availability: DEFAULT_AVAILABILITY,
      hiddenExternalRefs: [],
    };
  });

  // Track raw external tasks from Task Manager (#01)
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = getRaw(TASK_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.tasks || [];
      }
    } catch (e) {
      console.error("Failed to load tasks for calendar", e);
    }
    return [];
  });

  // Track raw external milestones from Project Manager (#03)
  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = getRaw(PROJECT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.milestones || [];
      }
    } catch (e) {
      console.error("Failed to load milestones for calendar", e);
    }
    return [];
  });

  // Save calendar state
  useEffect(() => {
    try {
      setRaw(CALENDAR_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist calendar state", e);
    }
  }, [state]);

  // Synchronize across ecosystem
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const tRaw = getRaw(TASK_STORAGE_KEY);
        if (tRaw) {
          const tParsed = JSON.parse(tRaw);
          if (tParsed.tasks) setTasks(tParsed.tasks);
        }
        const pRaw = getRaw(PROJECT_STORAGE_KEY);
        if (pRaw) {
          const pParsed = JSON.parse(pRaw);
          if (pParsed.milestones) setMilestones(pParsed.milestones);
        }
      } catch (e) {
        console.error("Error reading storage in calendar", e);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("aio_data_updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("aio_data_updated", handleStorageChange);
    };
  }, []);

  const notifyChange = useCallback(() => {
    window.dispatchEvent(new Event("aio_data_updated"));
  }, []);

  // AGGREGATOR VIEW LAYER (§0 & §14):
  // Calendar combines Standalone Events + Task Manager Tasks + Project Manager Milestones
  // without duplicating their data!
  const allDisplayEvents = useMemo(() => {
    const list: CalendarEvent[] = [...state.events];

    // 1. Project Tasks with startAt / dueAt as Linked Events
    tasks.forEach((t) => {
      if (!t.dueAt && !t.startAt) return;
      if (t.status === "archived" || t.status === "cancelled") return;
      if (state.hiddenExternalRefs.includes(t.id)) return;

      const eventStart = t.startAt || t.dueAt!;
      // Default duration: 1 hour if not specified
      const startD = new Date(eventStart);
      const endD = t.duration
        ? new Date(startD.getTime() + t.duration * 60000)
        : new Date(startD.getTime() + 60 * 60000);

      list.push({
        id: `linked-task-${t.id}`,
        title: `[Tugas] ${t.title}`,
        description: t.description || (t.notes ? `Catatan: ${t.notes}` : undefined),
        calendarId: "cal-project",
        startAt: startD.toISOString(),
        endAt: endD.toISOString(),
        allDay: false,
        location: t.location,
        status: t.status === "completed" ? "confirmed" : "confirmed",
        visibility: "default",
        color: t.priority === "urgent" ? "#ef4444" : t.priority === "high" ? "#f97316" : "#6366f1",
        participants: t.assigneeName
          ? [
              {
                id: `p-${t.id}`,
                eventId: `linked-task-${t.id}`,
                userId: t.assigneeId || "u-assigned",
                name: t.assigneeName,
                role: "required",
                rsvpStatus: "accepted",
              },
            ]
          : [],
        exceptions: [],
        reminders: [],
        externalRef: {
          sourceApp: "task_manager",
          sourceId: t.id,
        },
        createdAt: t.createdAt,
        updatedAt: t.updatedAt,
      });
    });

    // 2. Project Milestones as Linked Events (§0: "milestone project ditampilkan sebagai event penanda")
    milestones.forEach((m) => {
      if (!m.targetDate) return;
      if (state.hiddenExternalRefs.includes(m.id)) return;

      const mDate = new Date(m.targetDate);
      list.push({
        id: `linked-ms-${m.id}`,
        title: `[Milestone] ${m.title}`,
        description: `Target Checkpoint Proyek (${m.status.toUpperCase()})`,
        calendarId: "cal-project",
        startAt: mDate.toISOString(),
        endAt: new Date(mDate.getTime() + 30 * 60000).toISOString(),
        allDay: true,
        status: "confirmed",
        visibility: "default",
        color: m.status === "achieved" ? "#10b981" : "#eab308",
        participants: [],
        exceptions: [],
        reminders: [],
        externalRef: {
          sourceApp: "project_manager",
          sourceId: m.id,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    return list;
  }, [state.events, state.hiddenExternalRefs, tasks, milestones]);

  // TOGGLE CALENDAR VISIBILITY (§4)
  const toggleCalendarVisibility = useCallback((calendarId: string) => {
    setState((prev) => ({
      ...prev,
      calendars: prev.calendars.map((c) =>
        c.id === calendarId ? { ...c, visibility: c.visibility === "shown" ? "hidden" : "shown" } : c
      ),
    }));
  }, []);

  // CREATE EVENT (§3.3)
  const createEvent = useCallback(
    (data: {
      title: string;
      description?: string;
      calendarId: string;
      startAt: string;
      endAt: string;
      allDay?: boolean;
      location?: string;
      color?: string;
      status?: EventStatus;
      visibility?: CalendarEvent["visibility"];
      recurrence?: RecurrenceRule;
      participants?: Array<{ name: string; email?: string; role: Participant["role"] }>;
    }) => {
      const newEventId = "ev-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 5);

      const participants: Participant[] = (data.participants || []).map((p, idx) => ({
        id: `p-${newEventId}-${idx}`,
        eventId: newEventId,
        userId: "u-" + Math.random().toString(36).substring(2, 6),
        name: p.name.trim(),
        email: p.email?.trim(),
        role: p.role,
        rsvpStatus: "pending",
      }));

      const newEvent: CalendarEvent = {
        id: newEventId,
        title: data.title.trim(),
        description: data.description?.trim(),
        calendarId: data.calendarId,
        startAt: data.startAt,
        endAt: data.endAt,
        allDay: data.allDay || false,
        location: data.location?.trim(),
        color: data.color,
        status: data.status || "confirmed",
        visibility: data.visibility || "default",
        recurrence: data.recurrence,
        participants,
        exceptions: [],
        reminders: [
          {
            id: `rem-${newEventId}`,
            eventId: newEventId,
            offsetMinutes: 15,
            channel: "in_app",
            status: "pending",
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setState((prev) => ({
        ...prev,
        events: [newEvent, ...prev.events],
      }));

      notifyChange();
      return newEvent;
    },
    [notifyChange]
  );

  // UPDATE / RESCHEDULE EVENT (§3.3 & §14)
  // If editing a Linked Event, writes back to the source task or milestone!
  const updateEvent = useCallback(
    (event: CalendarEvent, updates: Partial<CalendarEvent>) => {
      // Check if this is a Linked Event from Task Manager (§14)
      if (event.externalRef && event.externalRef.sourceApp === "task_manager") {
        const taskId = event.externalRef.sourceId;
        try {
          const raw = getRaw(TASK_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            parsed.tasks = (parsed.tasks || []).map((t: Task) => {
              if (t.id === taskId) {
                return {
                  ...t,
                  dueAt: updates.endAt || updates.startAt || t.dueAt,
                  startAt: updates.startAt || t.startAt,
                  title: updates.title ? updates.title.replace(/^\[Tugas\]\s*/, "") : t.title,
                  location: updates.location !== undefined ? updates.location : t.location,
                  updatedAt: new Date().toISOString(),
                };
              }
              return t;
            });
            setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
            setTasks(parsed.tasks);
          }
        } catch (e) {
          console.error("Failed to sync updated date back to task manager", e);
        }
        notifyChange();
        return;
      }

      // Check if this is a Linked Event from Project Manager (§14)
      if (event.externalRef && event.externalRef.sourceApp === "project_manager") {
        const milestoneId = event.externalRef.sourceId;
        try {
          const raw = getRaw(PROJECT_STORAGE_KEY);
          if (raw) {
            const parsed = JSON.parse(raw);
            parsed.milestones = (parsed.milestones || []).map((m: Milestone) => {
              if (m.id === milestoneId) {
                return {
                  ...m,
                  targetDate: updates.startAt || m.targetDate,
                  title: updates.title ? updates.title.replace(/^\[Milestone\]\s*/, "") : m.title,
                };
              }
              return m;
            });
            setRaw(PROJECT_STORAGE_KEY, JSON.stringify(parsed));
            setMilestones(parsed.milestones);
          }
        } catch (e) {
          console.error("Failed to sync updated milestone date back to project manager", e);
        }
        notifyChange();
        return;
      }

      // Standalone Event Update
      setState((prev) => {
        const existing = prev.events.find((e) => e.id === event.id);
        if (!existing) return prev;

        // §6: If schedule changes, participant rsvpStatus resets to pending
        const scheduleChanged =
          (updates.startAt && updates.startAt !== existing.startAt) ||
          (updates.endAt && updates.endAt !== existing.endAt);

        const updatedParticipants = scheduleChanged
          ? existing.participants.map((p) =>
              p.role === "organizer" ? p : { ...p, rsvpStatus: "pending" as const }
            )
          : existing.participants;

        const updatedEvents = prev.events.map((e) =>
          e.id === event.id
            ? {
                ...e,
                ...updates,
                participants: updates.participants || updatedParticipants,
                updatedAt: new Date().toISOString(),
              }
            : e
        );

        return { ...prev, events: updatedEvents };
      });

      notifyChange();
    },
    [notifyChange]
  );

  // DELETE EVENT (§3.2 & §3.3)
  // Menghapus Linked Event hanya menyembunyikan representasinya (hiddenExternalRefs)
  const deleteEvent = useCallback(
    (event: CalendarEvent) => {
      if (event.externalRef) {
        setState((prev) => ({
          ...prev,
          hiddenExternalRefs: [...prev.hiddenExternalRefs, event.externalRef!.sourceId],
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        events: prev.events.filter((e) => e.id !== event.id),
      }));
      notifyChange();
    },
    [notifyChange]
  );

  // CONVERT TO TASK (§3.3)
  // "event tanpa kejelasan penyelesaian diubah menjadi Task"
  const convertEventToTask = useCallback(
    (event: CalendarEvent) => {
      const newTask: Task = {
        id: "task-" + Date.now().toString(36),
        title: event.title,
        description: event.description,
        priority: "medium",
        status: "inbox",
        startAt: event.startAt,
        dueAt: event.endAt,
        location: event.location,
        checklist: [],
        tags: ["Converted from Calendar"],
        attachments: [],
        links: [],
        dependencies: [],
        reminders: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.tasks = [newTask, ...(parsed.tasks || [])];
          setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
          setTasks(parsed.tasks);
        }
      } catch (e) {
        console.error("Failed to convert event to task in task manager", e);
      }

      // Mark original standalone event as cancelled or remove
      setState((prev) => ({
        ...prev,
        events: prev.events.filter((e) => e.id !== event.id),
      }));

      notifyChange();
      return newTask;
    },
    [notifyChange]
  );

  // RESPOND RSVP (§6)
  const respondRSVP = useCallback(
    (eventId: string, participantId: string, status: Participant["rsvpStatus"]) => {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) => {
          if (e.id === eventId) {
            return {
              ...e,
              participants: e.participants.map((p) =>
                p.id === participantId
                  ? { ...p, rsvpStatus: status, respondedAt: new Date().toISOString() }
                  : p
              ),
            };
          }
          return e;
        }),
      }));
      notifyChange();
    },
    [notifyChange]
  );

  // ADD EXCEPTION TO RECURRING EVENT (§5.2)
  const addEventException = useCallback(
    (exception: EventException) => {
      setState((prev) => ({
        ...prev,
        events: prev.events.map((e) =>
          e.id === exception.parentEventId
            ? { ...e, exceptions: [...e.exceptions, exception] }
            : e
        ),
      }));
      notifyChange();
    },
    [notifyChange]
  );

  return {
    state,
    allDisplayEvents,
    toggleCalendarVisibility,
    createEvent,
    updateEvent,
    deleteEvent,
    convertEventToTask,
    respondRSVP,
    addEventException,
  };
}
