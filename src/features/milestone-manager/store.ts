import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  StrategicMilestone,
  Prerequisite,
  ReadinessStatus,
  Stakeholder,
  MilestoneUpdate,
  MilestoneStatus,
  PrerequisiteStatus,
} from "./types";

interface MilestoneStore {
  milestones: StrategicMilestone[];
  prerequisites: Prerequisite[];
  readinessCache: Record<string, ReadinessStatus>;
  stakeholders: Stakeholder[];
  updates: MilestoneUpdate[];
  selectedMilestoneId: string | null;

  // Actions
  createMilestone: (
    data: Omit<StrategicMilestone, "id" | "createdAt" | "updatedAt">
  ) => void;
  updateMilestone: (id: string, updates: Partial<StrategicMilestone>) => void;
  deleteMilestone: (id: string) => void;
  setMilestoneStatus: (id: string, status: MilestoneStatus) => void;

  addPrerequisite: (data: Omit<Prerequisite, "id">) => void;
  removePrerequisite: (id: string) => void;
  updatePrerequisiteStatus: (id: string, status: PrerequisiteStatus) => void;
  togglePrerequisiteCritical: (id: string) => void;

  addStakeholder: (data: Omit<Stakeholder, "id">) => void;
  removeStakeholder: (id: string) => void;

  addMilestoneUpdate: (milestoneId: string, content: string, authorName?: string) => void;
  setSelectedMilestoneId: (id: string | null) => void;
  calculateReadiness: (milestoneId: string) => ReadinessStatus;
}

const INITIAL_MILESTONES: StrategicMilestone[] = [
  {
    id: "sm-01",
    title: "Peluncuran Nasional Platform Multi-Enterprise v3",
    description: "Checkpoint besar konvergensi seluruh divisi: R&D, Legal Compliance, Marketing Nasional, dan Sales Training.",
    targetDate: "2026-11-15",
    status: "at_risk",
    ownerName: "Dian Sastrowardoyo (Head of PMO)",
    createdAt: "2026-08-15T09:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
  },
  {
    id: "sm-02",
    title: "Sertifikasi Audit Keamanan Siber ISO 27001",
    description: "Validasi kepatuhan infrastruktur data cloud dan enkripsi end-to-end oleh auditor independen.",
    targetDate: "2026-10-30",
    status: "on_track",
    ownerName: "Rizky Firmansyah (CISO)",
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
  },
  {
    id: "sm-03",
    title: "Ekspansi Regional Asia Tenggara (SEA Gateway)",
    description: "Pembukaan entitas operasional dan gateway multi-mata uang di Singapura & Malaysia.",
    targetDate: "2027-02-28",
    status: "on_track",
    ownerName: "Bambang Sudiro (VP Expansion)",
    createdAt: "2026-09-01T11:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
  },
];

const INITIAL_PREREQUISITES: Prerequisite[] = [
  {
    id: "pre-01",
    strategicMilestoneId: "sm-01",
    title: "Project #03: Finalisasi Core Architecture & QA",
    sourceType: "project",
    sourceId: "proj-101",
    isCritical: true,
    currentStatus: "on_track",
  },
  {
    id: "pre-02",
    strategicMilestoneId: "sm-01",
    title: "Project #03: Kampanye Digital & Public Relations",
    sourceType: "project",
    sourceId: "proj-102",
    isCritical: true,
    currentStatus: "on_track",
  },
  {
    id: "pre-03",
    strategicMilestoneId: "sm-01",
    title: "Deliverable #20: Kontrak Legal & Perjanjian Lisensi SLA",
    sourceType: "deliverable",
    sourceId: "deliv-90",
    isCritical: true,
    currentStatus: "needs_revision",
  },
  {
    id: "pre-04",
    strategicMilestoneId: "sm-01",
    title: "Goal #31: Pelatihan 50 Account Executive Baru",
    sourceType: "goal",
    sourceId: "goal-sales",
    isCritical: false,
    currentStatus: "on_track",
  },
  {
    id: "pre-05",
    strategicMilestoneId: "sm-02",
    title: "Deliverable #20: Audit Log & Laporan Penetrasi",
    sourceType: "deliverable",
    sourceId: "deliv-iso",
    isCritical: true,
    currentStatus: "completed",
  },
  {
    id: "pre-06",
    strategicMilestoneId: "sm-02",
    title: "Task #01: Patch Kerentanan Dependensi Open Source",
    sourceType: "task",
    sourceId: "task-patch",
    isCritical: true,
    currentStatus: "completed",
  },
];

const INITIAL_STAKEHOLDERS: Stakeholder[] = [
  {
    id: "sh-01",
    strategicMilestoneId: "sm-01",
    personName: "Ahmad Zulkarnaen",
    role: "executive_sponsor",
    department: "Board of Directors",
  },
  {
    id: "sh-02",
    strategicMilestoneId: "sm-01",
    personName: "Dian Sastrowardoyo",
    role: "coordinator",
    department: "PMO / Operations",
  },
  {
    id: "sh-03",
    strategicMilestoneId: "sm-01",
    personName: "Maya Putri",
    role: "observer",
    department: "Corporate Legal",
  },
  {
    id: "sh-04",
    strategicMilestoneId: "sm-02",
    personName: "Hendra Wijaya",
    role: "executive_sponsor",
    department: "Chief Technology Officer",
  },
];

const INITIAL_UPDATES: MilestoneUpdate[] = [
  {
    id: "upd-01",
    strategicMilestoneId: "sm-01",
    content: "Project Produksi dan Marketing berjalan tepat jadwal. Namun approval legal masih membutuhkan revisi klausul tanggung jawab pihak ketiga.",
    authorName: "Dian Sastrowardoyo (PMO)",
    createdAt: "2026-09-22T14:30:00Z",
  },
  {
    id: "upd-02",
    strategicMilestoneId: "sm-02",
    content: "Seluruh hasil audit penetrasi telah rampung dan zero critical vulnerability. Menunggu jadwal audit penutup.",
    authorName: "Rizky Firmansyah (CISO)",
    createdAt: "2026-09-23T11:00:00Z",
  },
];

export const useMilestoneStore = create<MilestoneStore>()(
  persist(
    (set, get) => ({
      milestones: INITIAL_MILESTONES,
      prerequisites: INITIAL_PREREQUISITES,
      readinessCache: {},
      stakeholders: INITIAL_STAKEHOLDERS,
      updates: INITIAL_UPDATES,
      selectedMilestoneId: null,

      createMilestone: (data) => {
        const now = new Date().toISOString();
        const newMs: StrategicMilestone = {
          ...data,
          id: `sm-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ milestones: [newMs, ...state.milestones] }));
      },

      updateMilestone: (id, updates) => {
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      deleteMilestone: (id) => {
        set((state) => ({
          milestones: state.milestones.filter((m) => m.id !== id),
          prerequisites: state.prerequisites.filter((p) => p.strategicMilestoneId !== id),
          stakeholders: state.stakeholders.filter((s) => s.strategicMilestoneId !== id),
          updates: state.updates.filter((u) => u.strategicMilestoneId !== id),
          selectedMilestoneId: state.selectedMilestoneId === id ? null : state.selectedMilestoneId,
        }));
      },

      setMilestoneStatus: (id, status) => {
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id ? { ...m, status, updatedAt: new Date().toISOString() } : m
          ),
        }));
      },

      addPrerequisite: (data) => {
        const newPre: Prerequisite = {
          ...data,
          id: `pre-${Date.now()}`,
        };
        set((state) => ({ prerequisites: [...state.prerequisites, newPre] }));
      },

      removePrerequisite: (id) => {
        set((state) => ({
          prerequisites: state.prerequisites.filter((p) => p.id !== id),
        }));
      },

      updatePrerequisiteStatus: (id, status) => {
        set((state) => ({
          prerequisites: state.prerequisites.map((p) =>
            p.id === id ? { ...p, currentStatus: status } : p
          ),
        }));
      },

      togglePrerequisiteCritical: (id) => {
        set((state) => ({
          prerequisites: state.prerequisites.map((p) =>
            p.id === id ? { ...p, isCritical: !p.isCritical } : p
          ),
        }));
      },

      addStakeholder: (data) => {
        const newSh: Stakeholder = {
          ...data,
          id: `sh-${Date.now()}`,
        };
        set((state) => ({ stakeholders: [...state.stakeholders, newSh] }));
      },

      removeStakeholder: (id) => {
        set((state) => ({
          stakeholders: state.stakeholders.filter((s) => s.id !== id),
        }));
      },

      addMilestoneUpdate: (milestoneId, content, authorName = "Koordinator") => {
        const newUpd: MilestoneUpdate = {
          id: `upd-${Date.now()}`,
          strategicMilestoneId: milestoneId,
          content,
          authorName,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ updates: [newUpd, ...state.updates] }));
      },

      setSelectedMilestoneId: (id) => set({ selectedMilestoneId: id }),

      calculateReadiness: (milestoneId) => {
        const prereqs = get().prerequisites.filter((p) => p.strategicMilestoneId === milestoneId);
        const criticals = prereqs.filter((p) => p.isCritical);

        const blockers: string[] = [];
        let overallStatus: "on_track" | "at_risk" | "delayed" = "on_track";

        // Deterministic formula
        const hasDelayedCritical = criticals.some(
          (p) => p.currentStatus === "delayed" || p.currentStatus === "needs_revision"
        );
        const hasAtRiskCritical = criticals.some((p) => p.currentStatus === "at_risk");

        if (hasDelayedCritical) {
          overallStatus = "delayed";
          criticals
            .filter((p) => p.currentStatus === "delayed" || p.currentStatus === "needs_revision")
            .forEach((p) => blockers.push(`${p.title} (${p.currentStatus})`));
        } else if (hasAtRiskCritical) {
          overallStatus = "at_risk";
          criticals
            .filter((p) => p.currentStatus === "at_risk")
            .forEach((p) => blockers.push(`${p.title} (berisiko)`));
        } else {
          overallStatus = "on_track";
        }

        const readiness: ReadinessStatus = {
          strategicMilestoneId: milestoneId,
          overallStatus,
          criticalBlockers: blockers,
          lastCalculatedAt: new Date().toISOString(),
        };

        return readiness;
      },
    }),
    {
      name: "ecosystem-milestone-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
