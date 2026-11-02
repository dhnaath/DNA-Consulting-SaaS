import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Meeting,
  MeetingSeries,
  AgendaItem,
  Note,
  Decision,
  ActionItem,
  Participant,
  ActionItemStatus,
  AgendaStatus,
} from "./types";

interface MeetingStore {
  meetings: Meeting[];
  series: MeetingSeries[];
  selectedMeetingId: string | null;

  setSelectedMeetingId: (id: string | null) => void;
  createMeeting: (meeting: Omit<Meeting, "id" | "createdAt" | "updatedAt">) => string;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  startMeeting: (id: string) => void;
  endMeeting: (id: string) => void;

  // Agenda
  addAgendaItem: (meetingId: string, item: Omit<AgendaItem, "id" | "meetingId">) => void;
  updateAgendaStatus: (meetingId: string, itemId: string, status: AgendaStatus) => void;
  removeAgendaItem: (meetingId: string, itemId: string) => void;

  // Notes
  addNote: (meetingId: string, note: Omit<Note, "id" | "meetingId" | "timestamp">) => void;
  deleteNote: (meetingId: string, noteId: string) => void;

  // Decisions
  addDecision: (meetingId: string, decision: Omit<Decision, "id" | "meetingId" | "decidedAt">) => void;
  deleteDecision: (meetingId: string, decisionId: string) => void;

  // Actions
  addActionItem: (meetingId: string, action: Omit<ActionItem, "id" | "meetingId">) => void;
  updateActionItemStatus: (meetingId: string, actionId: string, status: ActionItemStatus) => void;
  convertActionToTask: (meetingId: string, actionId: string) => string;

  // Participants
  toggleParticipantAttendance: (meetingId: string, personId: string) => void;
  addParticipant: (meetingId: string, participant: Omit<Participant, "id" | "meetingId">) => void;

  // Series
  createSeries: (series: Omit<MeetingSeries, "id" | "meetingIds">) => string;
}

const INITIAL_SERIES: MeetingSeries[] = [
  {
    id: "series-eng-sync",
    title: "Weekly Engineering & Product Sync",
    recurrence: "weekly",
    defaultAgendaTemplate: [
      "Sprint Progress & Blockers",
      "Architecture Review & Cross-App Integrations",
      "Release Window & Security Checks",
      "Action Items & Wrap-up",
    ],
    meetingIds: ["mtg-01", "mtg-02"],
  },
  {
    id: "series-client-review",
    title: "Monthly Client Stakeholder Steering Committee",
    recurrence: "monthly",
    defaultAgendaTemplate: [
      "Milestone Deliverables Sign-off",
      "Budget & Utilization Status",
      "Next Phase Roadmap",
    ],
    meetingIds: ["mtg-03"],
  },
];

const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "mtg-01",
    title: "Weekly Engineering Sync — Sprint 42",
    eventId: "cal-evt-1092",
    seriesId: "series-eng-sync",
    status: "completed",
    scheduledStartTime: "2026-09-22T09:00:00Z",
    scheduledEndTime: "2026-09-22T10:00:00Z",
    actualStartTime: "2026-09-22T09:03:00Z",
    actualEndTime: "2026-09-22T09:55:00Z",
    location: "Meeting Room A / Google Meet",
    createdAt: "2026-09-20T10:00:00Z",
    updatedAt: "2026-09-22T10:00:00Z",
    participants: [
      { id: "p1", meetingId: "mtg-01", personId: "u-andi", name: "Andi Pratama", role: "organizer", attended: true, email: "andi@company.com" },
      { id: "p2", meetingId: "mtg-01", personId: "u-dhia", name: "Dhia Ramadhan", role: "notetaker", attended: true, email: "dhia@company.com" },
      { id: "p3", meetingId: "mtg-01", personId: "u-siti", name: "Siti Rahma", role: "required", attended: true, email: "siti@company.com" },
      { id: "p4", meetingId: "mtg-01", personId: "u-budi", name: "Budi Santoso", role: "optional", attended: false, email: "budi@company.com" },
    ],
    agendaItems: [
      { id: "ag-1", meetingId: "mtg-01", order: 1, topic: "Sprint 42 Status & Backend Deployments", estimatedMinutes: 15, ownerName: "Andi Pratama", status: "discussed" },
      { id: "ag-2", meetingId: "mtg-01", order: 2, topic: "Search Engine & Indexing Rules across Apps", estimatedMinutes: 20, ownerName: "Dhia Ramadhan", status: "discussed" },
      { id: "ag-3", meetingId: "mtg-01", order: 3, topic: "Approval Workflow Integration", estimatedMinutes: 15, ownerName: "Siti Rahma", status: "discussed" },
    ],
    notes: [
      { id: "nt-1", meetingId: "mtg-01", agendaItemId: "ag-1", content: "All API migrations completed on staging without breaking changes. Index queue handles up to 5,000 sync events/min.", authorId: "u-dhia", authorName: "Dhia Ramadhan", timestamp: "09:12" },
      { id: "nt-2", meetingId: "mtg-01", agendaItemId: "ag-2", content: "Search Manager will index task titles and tags deterministically for ultra fast query times.", authorId: "u-dhia", authorName: "Dhia Ramadhan", timestamp: "09:30" },
    ],
    decisions: [
      { id: "dc-1", meetingId: "mtg-01", agendaItemId: "ag-2", statement: "Use BM25/TF-IDF classical deterministic scoring for search relevance ranking.", rationale: "Ensures transparent ranking without external API dependencies or latency.", decidedBy: "Andi Pratama", decidedAt: "2026-09-22T09:35:00Z" },
      { id: "dc-2", meetingId: "mtg-01", agendaItemId: "ag-3", statement: "Workflow triggers will remain rule-based and execute synchronous state validations.", rationale: "Prevents invalid jumps from Draft to Completed without required approvals.", decidedBy: "Tim Engineering", decidedAt: "2026-09-22T09:48:00Z" },
    ],
    actionItems: [
      { id: "ac-1", meetingId: "mtg-01", agendaItemId: "ag-2", description: "Implement SyncEvent dispatcher for Task Manager and Notes", assigneeId: "u-dhia", assigneeName: "Dhia Ramadhan", dueDate: "2026-09-25", status: "done", linkedTaskId: "task-auto-801" },
      { id: "ac-2", meetingId: "mtg-01", agendaItemId: "ag-3", description: "Design SLA Breach monitor alert panel in Workflow Manager", assigneeId: "u-siti", assigneeName: "Siti Rahma", dueDate: "2026-09-27", status: "in_progress", linkedTaskId: "task-auto-802" },
    ],
  },
  {
    id: "mtg-02",
    title: "Weekly Engineering Sync — Sprint 43",
    eventId: "cal-evt-1099",
    seriesId: "series-eng-sync",
    status: "in_progress",
    scheduledStartTime: "2026-09-24T09:00:00Z",
    scheduledEndTime: "2026-09-24T10:00:00Z",
    actualStartTime: "2026-09-24T09:02:00Z",
    location: "Virtual Room Google Meet",
    createdAt: "2026-09-23T11:00:00Z",
    updatedAt: "2026-09-24T09:05:00Z",
    participants: [
      { id: "p21", meetingId: "mtg-02", personId: "u-andi", name: "Andi Pratama", role: "organizer", attended: true, email: "andi@company.com" },
      { id: "p22", meetingId: "mtg-02", personId: "u-dhia", name: "Dhia Ramadhan", role: "notetaker", attended: true, email: "dhia@company.com" },
      { id: "p23", meetingId: "mtg-02", personId: "u-siti", name: "Siti Rahma", role: "required", attended: true, email: "siti@company.com" },
    ],
    agendaItems: [
      { id: "ag-21", meetingId: "mtg-02", order: 1, topic: "Deliverable Manager DoD Requirements Verification", estimatedMinutes: 20, ownerName: "Andi Pratama", status: "discussed" },
      { id: "ag-22", meetingId: "mtg-02", order: 2, topic: "Form Builder conditional logic & ActionMapping", estimatedMinutes: 20, ownerName: "Dhia Ramadhan", status: "pending" },
      { id: "ag-23", meetingId: "mtg-02", order: 3, topic: "Collaboration Activity Feed & Multi-tenant RBAC", estimatedMinutes: 15, ownerName: "Siti Rahma", status: "pending" },
    ],
    notes: [
      { id: "nt-21", meetingId: "mtg-02", agendaItemId: "ag-21", content: "Requirements must be 100% verified met before final submission to client approval.", authorId: "u-dhia", authorName: "Dhia Ramadhan", timestamp: "09:15" },
    ],
    decisions: [
      { id: "dc-21", meetingId: "mtg-02", agendaItemId: "ag-21", statement: "Mandatory requirements block approval submission if not yet marked as 'met'.", rationale: "Maintains high quality control for client handovers.", decidedBy: "Andi Pratama", decidedAt: "2026-09-24T09:20:00Z" },
    ],
    actionItems: [
      { id: "ac-21", meetingId: "mtg-02", agendaItemId: "ag-21", description: "Add mandatory check validation in Deliverable submission modal", assigneeId: "u-andi", assigneeName: "Andi Pratama", dueDate: "2026-09-26", status: "open" },
      { id: "ac-22", meetingId: "mtg-02", agendaItemId: "ag-22", description: "Setup failed response retry queue for Form ActionMapping", assigneeId: "u-dhia", assigneeName: "Dhia Ramadhan", dueDate: "2026-09-28", status: "open" },
    ],
  },
  {
    id: "mtg-03",
    title: "Client Steering Committee — Deliverable Q3 Sign-off",
    eventId: "cal-evt-2005",
    seriesId: "series-client-review",
    status: "scheduled",
    scheduledStartTime: "2026-09-28T14:00:00Z",
    scheduledEndTime: "2026-09-28T15:30:00Z",
    location: "Main Boardroom / Hybrid Room",
    createdAt: "2026-09-23T14:00:00Z",
    updatedAt: "2026-09-23T14:00:00Z",
    participants: [
      { id: "p31", meetingId: "mtg-03", personId: "u-andi", name: "Andi Pratama", role: "organizer", attended: false, email: "andi@company.com" },
      { id: "p32", meetingId: "mtg-03", personId: "u-klien", name: "Pak Hendra (Client Director)", role: "required", attended: false, email: "hendra@clientcorp.com" },
      { id: "p33", meetingId: "mtg-03", personId: "u-dhia", name: "Dhia Ramadhan", role: "required", attended: false, email: "dhia@company.com" },
    ],
    agendaItems: [
      { id: "ag-31", meetingId: "mtg-03", order: 1, topic: "Review Q3 Final Architecture & Security Deliverables", estimatedMinutes: 30, ownerName: "Andi Pratama", status: "pending" },
      { id: "ag-32", meetingId: "mtg-03", order: 2, topic: "Approval sign-off by client sponsor", estimatedMinutes: 20, ownerName: "Pak Hendra", status: "pending" },
      { id: "ag-33", meetingId: "mtg-03", order: 3, topic: "Q4 Roadmap Transition Plan", estimatedMinutes: 20, ownerName: "Dhia Ramadhan", status: "pending" },
    ],
    notes: [],
    decisions: [],
    actionItems: [
      { id: "ac-31", meetingId: "mtg-03", description: "Prepare deliverable package PDF & audit sign-off sheet", assigneeName: "Andi Pratama", dueDate: "2026-09-27", status: "in_progress" },
    ],
  },
];

export const useMeetingStore = create<MeetingStore>()(
  persist(
    (set, get) => ({
      meetings: INITIAL_MEETINGS,
      series: INITIAL_SERIES,
      selectedMeetingId: "mtg-02",

      setSelectedMeetingId: (id) => set({ selectedMeetingId: id }),

      createMeeting: (newMeetingData) => {
        const id = `mtg-${Date.now()}`;
        const newMeeting: Meeting = {
          ...newMeetingData,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          meetings: [newMeeting, ...state.meetings],
          selectedMeetingId: id,
        }));
        return id;
      },

      updateMeeting: (id, updates) => {
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      deleteMeeting: (id) => {
        set((state) => ({
          meetings: state.meetings.filter((m) => m.id !== id),
          selectedMeetingId: state.selectedMeetingId === id ? null : state.selectedMeetingId,
        }));
      },

      startMeeting: (id) => {
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === id
              ? {
                  ...m,
                  status: "in_progress",
                  actualStartTime: m.actualStartTime || new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : m
          ),
        }));
      },

      endMeeting: (id) => {
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === id
              ? {
                  ...m,
                  status: "completed",
                  actualEndTime: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }
              : m
          ),
        }));
      },

      addAgendaItem: (meetingId, item) => {
        const newItem: AgendaItem = {
          ...item,
          id: `ag-${Date.now()}`,
          meetingId,
        };
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? { ...m, agendaItems: [...m.agendaItems, newItem], updatedAt: new Date().toISOString() }
              : m
          ),
        }));
      },

      updateAgendaStatus: (meetingId, itemId, status) => {
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? {
                  ...m,
                  agendaItems: m.agendaItems.map((a) => (a.id === itemId ? { ...a, status } : a)),
                  updatedAt: new Date().toISOString(),
                }
              : m
          ),
        }));
      },

      removeAgendaItem: (meetingId, itemId) => {
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? {
                  ...m,
                  agendaItems: m.agendaItems.filter((a) => a.id !== itemId),
                  updatedAt: new Date().toISOString(),
                }
              : m
          ),
        }));
      },

      addNote: (meetingId, note) => {
        const newNote: Note = {
          ...note,
          id: `nt-${Date.now()}`,
          meetingId,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? { ...m, notes: [newNote, ...m.notes], updatedAt: new Date().toISOString() }
              : m
          ),
        }));
      },

      deleteNote: (meetingId, noteId) => {
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? { ...m, notes: m.notes.filter((n) => n.id !== noteId), updatedAt: new Date().toISOString() }
              : m
          ),
        }));
      },

      addDecision: (meetingId, decision) => {
        const newDecision: Decision = {
          ...decision,
          id: `dc-${Date.now()}`,
          meetingId,
          decidedAt: new Date().toISOString(),
        };
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? { ...m, decisions: [newDecision, ...m.decisions], updatedAt: new Date().toISOString() }
              : m
          ),
        }));
      },

      deleteDecision: (meetingId, decisionId) => {
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? { ...m, decisions: m.decisions.filter((d) => d.id !== decisionId), updatedAt: new Date().toISOString() }
              : m
          ),
        }));
      },

      addActionItem: (meetingId, action) => {
        const newAction: ActionItem = {
          ...action,
          id: `ac-${Date.now()}`,
          meetingId,
        };
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? { ...m, actionItems: [...m.actionItems, newAction], updatedAt: new Date().toISOString() }
              : m
          ),
        }));
      },

      updateActionItemStatus: (meetingId, actionId, status) => {
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? {
                  ...m,
                  actionItems: m.actionItems.map((a) => (a.id === actionId ? { ...a, status } : a)),
                  updatedAt: new Date().toISOString(),
                }
              : m
          ),
        }));
      },

      convertActionToTask: (meetingId, actionId) => {
        const taskId = `task-conv-${Date.now().toString().slice(-4)}`;
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? {
                  ...m,
                  actionItems: m.actionItems.map((a) =>
                    a.id === actionId ? { ...a, linkedTaskId: taskId, status: a.status === "open" ? "in_progress" : a.status } : a
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : m
          ),
        }));
        return taskId;
      },

      toggleParticipantAttendance: (meetingId, personId) => {
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? {
                  ...m,
                  participants: m.participants.map((p) =>
                    p.personId === personId ? { ...p, attended: !p.attended } : p
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : m
          ),
        }));
      },

      addParticipant: (meetingId, participant) => {
        const newPart: Participant = {
          ...participant,
          id: `p-${Date.now()}`,
          meetingId,
        };
        set((state) => ({
          meetings: state.meetings.map((m) =>
            m.id === meetingId
              ? { ...m, participants: [...m.participants, newPart], updatedAt: new Date().toISOString() }
              : m
          ),
        }));
      },

      createSeries: (seriesData) => {
        const id = `series-${Date.now()}`;
        const newSeries: MeetingSeries = {
          ...seriesData,
          id,
          meetingIds: [],
        };
        set((state) => ({
          series: [...state.series, newSeries],
        }));
        return id;
      },
    }),
    {
      name: "ecosystem-meeting-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
