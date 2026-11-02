import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Interaction,
  FollowUp,
  InteractionParticipant,
  FollowUpStatus,
} from "./types";

interface InteractionStore {
  interactions: Interaction[];
  followUps: FollowUp[];
  participants: InteractionParticipant[];
  selectedPersonId: string | null;

  // Actions
  logInteraction: (
    interaction: Omit<Interaction, "id" | "createdAt">,
    initialFollowUp?: { description: string; dueDate: string }
  ) => string;
  updateInteraction: (id: string, updates: Partial<Interaction>) => void;
  deleteInteraction: (id: string) => void;

  addFollowUp: (data: Omit<FollowUp, "id">) => void;
  updateFollowUpStatus: (id: string, status: FollowUpStatus) => void;
  convertFollowUpToTask: (followUpId: string, taskId: string) => void;

  setSelectedPersonId: (personId: string | null) => void;
}

const INITIAL_INTERACTIONS: Interaction[] = [
  {
    id: "int-01",
    personId: "per-03",
    personName: "Ir. Hendra Gunawan",
    organizationName: "PT Mandiri Mega Finansial",
    type: "meeting",
    direction: "outbound",
    occurredAt: "2026-09-22T10:00:00Z",
    summary: "Rapat koordinasi tingkat eksekutif terkait jadwal go-live arsitektur multi-tenant.",
    outcome: {
      interactionId: "int-01",
      sentiment: "positive",
      result: "Pihak komisaris menyetujui jadwal peluncuran bertahap.",
      nextSteps: "Kirimkan matriks mitigasi risiko kepatuhan OJK.",
    },
    loggedBy: "Budi Santoso",
    createdAt: "2026-09-22T11:30:00Z",
  },
  {
    id: "int-02",
    personId: "per-04",
    personName: "Maya Kusuma",
    organizationName: "PT Mandiri Mega Finansial",
    type: "call",
    direction: "inbound",
    occurredAt: "2026-09-23T14:15:00Z",
    summary: "Panggilan telepon klarifikasi klausul audit keamanan ISO 27001 dan batas akses data.",
    outcome: {
      interactionId: "int-02",
      sentiment: "neutral",
      result: "Membutuhkan revisi dokumen legal pendukung.",
      nextSteps: "Hubungi tim legal konsultan.",
    },
    loggedBy: "Siti Rahmawati",
    createdAt: "2026-09-23T14:45:00Z",
  },
  {
    id: "int-03",
    personId: "per-05",
    personName: "Rian Fajar Pratama",
    organizationName: "PT Cloud Hosting Solusindo",
    type: "message",
    direction: "outbound",
    occurredAt: "2026-09-24T08:30:00Z",
    summary: "Konfirmasi tiket kenaikan kapasitas RAM & vCPU server staging cluster.",
    outcome: {
      interactionId: "int-03",
      sentiment: "positive",
      result: "Tiket diselesaikan dalam 15 menit tanpa downtime.",
    },
    loggedBy: "Siti Rahmawati",
    createdAt: "2026-09-24T08:45:00Z",
  },
  {
    id: "int-04",
    personId: "per-03",
    personName: "Ir. Hendra Gunawan",
    organizationName: "PT Mandiri Mega Finansial",
    type: "visit",
    direction: "outbound",
    occurredAt: "2026-09-10T13:00:00Z",
    summary: "Kunjungan courtesy call dan makan siang bisnis pengenalan platform baru.",
    outcome: {
      interactionId: "int-04",
      sentiment: "positive",
      result: "Membuka peluang proyek add-on data warehouse tahun depan.",
    },
    loggedBy: "Budi Santoso",
    createdAt: "2026-09-10T16:00:00Z",
  },
];

const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: "fu-01",
    interactionId: "int-01",
    description: "Kirim matriks mitigasi risiko kepatuhan OJK",
    dueDate: "2026-09-26",
    status: "pending",
  },
  {
    id: "fu-02",
    interactionId: "int-02",
    description: "Kirimkan draf addendum klausul data privacy",
    dueDate: "2026-09-25",
    status: "pending",
  },
  {
    id: "fu-03",
    interactionId: "int-04",
    description: "Kirim proposal awal integrasi data warehouse",
    dueDate: "2026-09-20", // overdue!
    status: "pending",
  },
];

export const useInteractionStore = create<InteractionStore>()(
  persist(
    (set, get) => ({
      interactions: INITIAL_INTERACTIONS,
      followUps: INITIAL_FOLLOWUPS,
      participants: [],
      selectedPersonId: null,

      logInteraction: (data, initialFollowUp) => {
        const id = `int-${Date.now()}`;
        const now = new Date().toISOString();
        const newInt: Interaction = {
          ...data,
          id,
          createdAt: now,
        };

        const newFollowUps = [...get().followUps];
        if (initialFollowUp && initialFollowUp.description.trim()) {
          newFollowUps.push({
            id: `fu-${Date.now()}`,
            interactionId: id,
            description: initialFollowUp.description.trim(),
            dueDate: initialFollowUp.dueDate || now.split("T")[0],
            status: "pending",
          });
        }

        set((state) => ({
          interactions: [newInt, ...state.interactions],
          followUps: newFollowUps,
        }));

        return id;
      },

      updateInteraction: (id, updates) => {
        set((state) => ({
          interactions: state.interactions.map((i) =>
            i.id === id ? { ...i, ...updates } : i
          ),
        }));
      },

      deleteInteraction: (id) => {
        set((state) => ({
          interactions: state.interactions.filter((i) => i.id !== id),
          followUps: state.followUps.filter((f) => f.interactionId !== id),
          participants: state.participants.filter((p) => p.interactionId !== id),
        }));
      },

      addFollowUp: (data) => {
        const newFu: FollowUp = {
          ...data,
          id: `fu-${Date.now()}`,
        };
        set((state) => ({ followUps: [...state.followUps, newFu] }));
      },

      updateFollowUpStatus: (id, status) => {
        set((state) => ({
          followUps: state.followUps.map((f) =>
            f.id === id ? { ...f, status } : f
          ),
        }));
      },

      convertFollowUpToTask: (followUpId, taskId) => {
        set((state) => ({
          followUps: state.followUps.map((f) =>
            f.id === followUpId ? { ...f, linkedTaskId: taskId } : f
          ),
        }));
      },

      setSelectedPersonId: (id) => set({ selectedPersonId: id }),
    }),
    {
      name: "ecosystem-interaction-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
