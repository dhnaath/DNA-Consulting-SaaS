import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  TimeEntry,
  TimeActivity,
  Timesheet,
  RateCard,
  TimeApprovalRecord,
  LinkedItem,
} from "./types";

interface TimeTrackerStore {
  entries: TimeEntry[];
  activities: TimeActivity[];
  timesheets: Timesheet[];
  rateCards: RateCard[];
  approvalRecords: TimeApprovalRecord[];

  // Active Timer
  isTimerRunning: boolean;
  timerStartTimestamp: number | null;
  timerNote: string;
  timerLinkedItem: LinkedItem | null;
  timerIsBillable: boolean;

  // Actions
  startTimer: (note: string, linkedItem?: LinkedItem, isBillable?: boolean) => void;
  stopTimer: () => void;
  logManualEntry: (data: {
    durationMinutes: number;
    note: string;
    linkedItem?: LinkedItem;
    isBillable?: boolean;
    date?: string;
  }) => void;
  importFromFocusSession: (taskTitle: string, durationMinutes: number) => void;
  updateEntry: (id: string, updates: Partial<TimeEntry>) => void;
  deleteEntry: (id: string) => void;

  createWeeklyTimesheet: (userId: string, userName: string, periodStart: string, periodEnd: string) => string;
  submitTimesheet: (timesheetId: string) => void;
  reviewTimesheet: (timesheetId: string, decision: 'approved' | 'rejected', approverName: string, comments?: string) => void;

  addRateCard: (card: Omit<RateCard, "id">) => void;
  addActivity: (activity: Omit<TimeActivity, "id">) => void;
}

const INITIAL_ACTIVITIES: TimeActivity[] = [
  { id: "act-1", name: "Administrasi & Pengarsipan", isBillableDefault: false },
  { id: "act-2", name: "Internal Team Sync", isBillableDefault: false },
  { id: "act-3", name: "Client Consulting & Advising", isBillableDefault: true },
  { id: "act-4", name: "Riset Teknologi & Arsitektur", isBillableDefault: true },
];

const INITIAL_RATE_CARDS: RateCard[] = [
  {
    id: "rc-1",
    appliesTo: "Senior Solution Architect",
    hourlyRate: 850000,
    currency: "IDR",
    effectiveFrom: "2026-01-01",
  },
  {
    id: "rc-2",
    appliesTo: "Project Manager #03",
    hourlyRate: 600000,
    currency: "IDR",
    effectiveFrom: "2026-01-01",
  },
  {
    id: "rc-3",
    appliesTo: "PT Mandiri Sekuritas Project",
    hourlyRate: 950000,
    currency: "IDR",
    effectiveFrom: "2026-06-01",
  },
];

const INITIAL_ENTRIES: TimeEntry[] = [
  {
    id: "te-01",
    userId: "usr-01",
    userName: "Bambang Pamungkas",
    linkedItem: {
      sourceType: "task",
      sourceId: "task-audit-a",
      title: "Audit Keamanan Sistem Klien A",
    },
    startAt: "2026-09-22T09:00:00Z",
    endAt: "2026-09-22T10:25:00Z",
    durationMinutes: 85,
    isBillable: true,
    note: "Pemeriksaan log otentikasi dan integritas API endpoint (diimpor dari Focus Session).",
    source: "imported_from_focus_session",
    status: "approved",
    createdAt: "2026-09-22T10:30:00Z",
  },
  {
    id: "te-02",
    userId: "usr-01",
    userName: "Bambang Pamungkas",
    linkedItem: {
      sourceType: "project",
      sourceId: "proj-101",
      title: "Project Enterprise v3 Refactor",
    },
    startAt: "2026-09-22T13:00:00Z",
    endAt: "2026-09-22T16:00:00Z",
    durationMinutes: 180,
    isBillable: true,
    note: "Slicing high-performance UI state dan integrasi TanStack Router.",
    source: "timer",
    status: "submitted",
    createdAt: "2026-09-22T16:05:00Z",
  },
  {
    id: "te-03",
    userId: "usr-01",
    userName: "Bambang Pamungkas",
    linkedItem: {
      sourceType: "activity",
      sourceId: "act-2",
      title: "Internal Team Sync",
    },
    startAt: "2026-09-23T08:30:00Z",
    endAt: "2026-09-23T09:30:00Z",
    durationMinutes: 60,
    isBillable: false,
    note: "Sinkronisasi sprint mingguan & pembagian alokasi tugas.",
    source: "manual",
    status: "submitted",
    createdAt: "2026-09-23T09:35:00Z",
  },
  {
    id: "te-04",
    userId: "usr-01",
    userName: "Bambang Pamungkas",
    linkedItem: {
      sourceType: "project",
      sourceId: "proj-101",
      title: "Project Enterprise v3 Refactor",
    },
    durationMinutes: 120,
    isBillable: true,
    note: "Unit testing state store persistensi dan validasi boundary.",
    source: "manual",
    status: "draft",
    createdAt: "2026-09-24T08:00:00Z",
  },
];

const INITIAL_TIMESHEETS: Timesheet[] = [
  {
    id: "ts-01",
    userId: "usr-01",
    userName: "Bambang Pamungkas",
    periodStart: "2026-09-18",
    periodEnd: "2026-09-24",
    entryIds: ["te-01", "te-02", "te-03"],
    totalMinutes: 325,
    status: "submitted",
    approverId: "mgr-01",
  },
];

const INITIAL_APPROVAL_RECORDS: TimeApprovalRecord[] = [
  {
    id: "ap-01",
    timesheetId: "ts-01",
    approverId: "mgr-01",
    approverName: "Farhan Hakim (Delivery Lead)",
    decision: "approved",
    comments: "Seluruh jam billable sesuai SLA kontrak klien.",
    decidedAt: "2026-09-23T17:00:00Z",
  },
];

export const useTimeTrackerStore = create<TimeTrackerStore>()(
  persist(
    (set, get) => ({
      entries: INITIAL_ENTRIES,
      activities: INITIAL_ACTIVITIES,
      timesheets: INITIAL_TIMESHEETS,
      rateCards: INITIAL_RATE_CARDS,
      approvalRecords: INITIAL_APPROVAL_RECORDS,

      isTimerRunning: false,
      timerStartTimestamp: null,
      timerNote: "",
      timerLinkedItem: null,
      timerIsBillable: true,

      startTimer: (note, linkedItem, isBillable = true) => {
        set({
          isTimerRunning: true,
          timerStartTimestamp: Date.now(),
          timerNote: note,
          timerLinkedItem: linkedItem || null,
          timerIsBillable: isBillable,
        });
      },

      stopTimer: () => {
        const { isTimerRunning, timerStartTimestamp, timerNote, timerLinkedItem, timerIsBillable } = get();
        if (!isTimerRunning || !timerStartTimestamp) return;

        const elapsedMs = Date.now() - timerStartTimestamp;
        const minutes = Math.max(1, Math.round(elapsedMs / (1000 * 60)));

        const newEntry: TimeEntry = {
          id: `te-${Date.now()}`,
          userId: "usr-01",
          userName: "Bambang Pamungkas",
          linkedItem: timerLinkedItem || undefined,
          startAt: new Date(timerStartTimestamp).toISOString(),
          endAt: new Date().toISOString(),
          durationMinutes: minutes,
          isBillable: timerIsBillable,
          note: timerNote || "Pekerjaan via Real-time Timer",
          source: "timer",
          status: "draft",
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          entries: [newEntry, ...state.entries],
          isTimerRunning: false,
          timerStartTimestamp: null,
          timerNote: "",
          timerLinkedItem: null,
          timerIsBillable: true,
        }));
      },

      logManualEntry: ({ durationMinutes, note, linkedItem, isBillable = true, date }) => {
        const timestamp = date ? new Date(date).toISOString() : new Date().toISOString();
        const newEntry: TimeEntry = {
          id: `te-${Date.now()}`,
          userId: "usr-01",
          userName: "Bambang Pamungkas",
          linkedItem,
          durationMinutes,
          isBillable,
          note,
          source: "manual",
          status: "draft",
          createdAt: timestamp,
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      importFromFocusSession: (taskTitle, durationMinutes) => {
        const newEntry: TimeEntry = {
          id: `te-${Date.now()}`,
          userId: "usr-01",
          userName: "Bambang Pamungkas",
          linkedItem: {
            sourceType: "task",
            sourceId: `task-${Date.now()}`,
            title: taskTitle,
          },
          durationMinutes,
          isBillable: true,
          note: `Sesi fokus selesai (${durationMinutes} menit, dikurangi interupsi).`,
          source: "imported_from_focus_session",
          status: "draft",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ entries: [newEntry, ...state.entries] }));
      },

      updateEntry: (id, updates) => {
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      deleteEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      createWeeklyTimesheet: (userId, userName, periodStart, periodEnd) => {
        const eligible = get().entries.filter((e) => {
          const entryDate = e.createdAt.split("T")[0];
          return entryDate >= periodStart && entryDate <= periodEnd;
        });

        const totalMins = eligible.reduce((acc, e) => acc + e.durationMinutes, 0);
        const newTs: Timesheet = {
          id: `ts-${Date.now()}`,
          userId,
          userName,
          periodStart,
          periodEnd,
          entryIds: eligible.map((e) => e.id),
          totalMinutes: totalMins,
          status: "draft",
        };

        set((state) => ({ timesheets: [newTs, ...state.timesheets] }));
        return newTs.id;
      },

      submitTimesheet: (timesheetId) => {
        set((state) => ({
          timesheets: state.timesheets.map((ts) =>
            ts.id === timesheetId ? { ...ts, status: "submitted" } : ts
          ),
          entries: state.entries.map((e) => {
            const ts = state.timesheets.find((t) => t.id === timesheetId);
            return ts?.entryIds.includes(e.id) ? { ...e, status: "submitted" } : e;
          }),
        }));
      },

      reviewTimesheet: (timesheetId, decision, approverName, comments) => {
        const record: TimeApprovalRecord = {
          id: `ap-${Date.now()}`,
          timesheetId,
          approverId: "mgr-cur",
          approverName,
          decision,
          comments,
          decidedAt: new Date().toISOString(),
        };

        set((state) => ({
          timesheets: state.timesheets.map((ts) =>
            ts.id === timesheetId ? { ...ts, status: decision === "approved" ? "approved" : "rejected" } : ts
          ),
          entries: state.entries.map((e) => {
            const ts = state.timesheets.find((t) => t.id === timesheetId);
            return ts?.entryIds.includes(e.id)
              ? { ...e, status: decision === "approved" ? "approved" : "rejected" }
              : e;
          }),
          approvalRecords: [record, ...state.approvalRecords],
        }));
      },

      addRateCard: (card) => {
        const newCard: RateCard = {
          ...card,
          id: `rc-${Date.now()}`,
        };
        set((state) => ({ rateCards: [...state.rateCards, newCard] }));
      },

      addActivity: (act) => {
        const newAct: TimeActivity = {
          ...act,
          id: `act-${Date.now()}`,
        };
        set((state) => ({ activities: [...state.activities, newAct] }));
      },
    }),
    {
      name: "ecosystem-time-tracker-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
