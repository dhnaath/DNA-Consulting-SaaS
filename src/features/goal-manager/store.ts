import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Goal,
  Contributor,
  GoalMilestone,
  CheckIn,
  GoalStatus,
} from "./types";

interface GoalStore {
  goals: Goal[];
  contributors: Contributor[];
  milestones: GoalMilestone[];
  checkIns: CheckIn[];
  selectedGoalId: string | null;

  // Actions
  createGoal: (goal: Omit<Goal, "id" | "createdAt" | "updatedAt">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setGoalStatus: (id: string, status: GoalStatus) => void;

  addContributor: (contributor: Omit<Contributor, "id">) => void;
  removeContributor: (id: string) => void;
  updateContributorProgress: (id: string, currentProgress: number) => void;

  addMilestone: (milestone: Omit<GoalMilestone, "id">) => void;
  toggleMilestone: (id: string) => void;

  addCheckIn: (goalId: string, note: string, numericValue?: number) => void;
  setSelectedGoalId: (id: string | null) => void;
  getGoalProgress: (goalId: string) => number;
}

const INITIAL_GOALS: Goal[] = [
  {
    id: "goal-01",
    title: "Membangun Ekosistem SaaS Enterprise Profitabel",
    description: "Tujuan strategis 2 tahun: memvalidasi produk, akuisisi pengguna enterprise, dan mencapai break-even.",
    category: "Bisnis",
    targetDate: "2027-06-30",
    status: "active",
    parentGoalId: null,
    createdAt: "2026-08-01T08:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
    progressMetric: {
      goalId: "goal-01",
      type: "milestone_based",
      config: {},
    },
  },
  {
    id: "goal-01-sub1",
    title: "Meluncurkan MVP Platform v1 & Integrasi Modul Core",
    description: "Sub-goal: rilis 30 modul standalone terpadu dengan RBAC dan single source of truth.",
    category: "Bisnis",
    targetDate: "2026-10-15",
    status: "active",
    parentGoalId: "goal-01",
    createdAt: "2026-08-05T09:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
    progressMetric: {
      goalId: "goal-01-sub1",
      type: "task_completion",
      config: {},
    },
  },
  {
    id: "goal-01-sub2",
    title: "Akuisisi 25 Klien Korporat Pilot Pertama",
    description: "Sub-goal: penetrasi pasar institusi dan program pilot berbayar.",
    category: "Bisnis",
    targetDate: "2026-12-31",
    status: "active",
    parentGoalId: "goal-01",
    createdAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
    progressMetric: {
      goalId: "goal-01-sub2",
      type: "numeric_target",
      config: { startValue: 0, targetValue: 25, currentValue: 18, unit: "klien" },
    },
  },
  {
    id: "goal-02",
    title: "Mencapai Kebugaran Fisik & Lari 10K Finisher",
    description: "Menjaga stamina kerja prima melalui lari rutin 3x seminggu dan hidrasi optimal.",
    category: "Kesehatan",
    targetDate: "2026-11-20",
    status: "active",
    parentGoalId: null,
    createdAt: "2026-09-01T07:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
    progressMetric: {
      goalId: "goal-02",
      type: "habit_consistency",
      config: {},
    },
  },
  {
    id: "goal-03",
    title: "Sertifikasi Profesional Keamanan Siber & ISO 27001",
    description: "Peningkatan kualifikasi tim engineering untuk standar compliance data enterprise.",
    category: "Karier",
    targetDate: "2026-12-10",
    status: "active",
    parentGoalId: null,
    createdAt: "2026-09-10T11:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
    progressMetric: {
      goalId: "goal-03",
      type: "task_completion",
      config: {},
    },
  },
  {
    id: "goal-04",
    title: "Dana Darurat Likuid 6 Bulan Operasional",
    description: "Mengamankan cash reserve perusahaan untuk perlindungan runway operasional.",
    category: "Finansial",
    targetDate: "2026-09-15",
    status: "achieved",
    parentGoalId: null,
    createdAt: "2026-06-01T08:00:00Z",
    updatedAt: "2026-09-15T16:00:00Z",
    progressMetric: {
      goalId: "goal-04",
      type: "numeric_target",
      config: { startValue: 100, targetValue: 500, currentValue: 520, unit: "juta" },
    },
  },
];

const INITIAL_CONTRIBUTORS: Contributor[] = [
  {
    id: "con-1",
    goalId: "goal-01-sub1",
    sourceType: "task",
    sourceId: "task-release-30",
    title: "Task #01: Deploy 30 Modul Standalone & Router Config",
    weight: 0.6,
    currentProgress: 95,
  },
  {
    id: "con-2",
    goalId: "goal-01-sub1",
    sourceType: "project",
    sourceId: "proj-core",
    title: "Project #03: Enterprise UI & Component Refactor",
    weight: 0.4,
    currentProgress: 88,
  },
  {
    id: "con-3",
    goalId: "goal-02",
    sourceType: "habit",
    sourceId: "habit-run",
    title: "Habit #06: Jogging Pagi 5 KM",
    weight: 0.5,
    currentProgress: 75,
  },
  {
    id: "con-4",
    goalId: "goal-02",
    sourceType: "habit",
    sourceId: "habit-water",
    title: "Habit #06: Minum Air 2.5 Liter Per Hari",
    weight: 0.3,
    currentProgress: 90,
  },
  {
    id: "con-5",
    goalId: "goal-02",
    sourceType: "manual_metric",
    sourceId: "metric-weight",
    title: "Target Berat Ideal 68 kg",
    weight: 0.2,
    currentProgress: 60,
  },
  {
    id: "con-6",
    goalId: "goal-03",
    sourceType: "task",
    sourceId: "task-iso",
    title: "Task #01: Selesaikan Modul Ujian ISO 27001",
    weight: 1.0,
    currentProgress: 70,
  },
];

const INITIAL_MILESTONES: GoalMilestone[] = [
  {
    id: "gm-1",
    goalId: "goal-01",
    title: "Peluncuran Publik MVP v1",
    targetDate: "2026-10-15",
    status: "upcoming",
  },
  {
    id: "gm-2",
    goalId: "goal-01",
    title: "25 Klien Pilot Berlangganan Aktif",
    targetDate: "2026-12-31",
    status: "upcoming",
  },
  {
    id: "gm-3",
    goalId: "goal-01",
    title: "Sertifikasi ISO 27001 Resmi Terbit",
    targetDate: "2027-03-31",
    status: "upcoming",
  },
  {
    id: "gm-4",
    goalId: "goal-02",
    title: "Lari 5K Non-Stop di Bawah 30 Menit",
    targetDate: "2026-10-01",
    status: "achieved",
  },
  {
    id: "gm-5",
    goalId: "goal-02",
    title: "Race Day 10K Finisher Medal",
    targetDate: "2026-11-20",
    status: "upcoming",
  },
];

const INITIAL_CHECKINS: CheckIn[] = [
  {
    id: "chk-1",
    goalId: "goal-01-sub2",
    checkedAt: "2026-09-18T10:00:00Z",
    progressSnapshot: 65,
    note: "Menandatangani 3 kontrak pilot baru dari sektor manufaktur.",
    numericValue: 16,
  },
  {
    id: "chk-2",
    goalId: "goal-01-sub2",
    checkedAt: "2026-09-23T15:30:00Z",
    progressSnapshot: 72,
    note: "Tambah 2 klien korporat finansial resmi onboarding.",
    numericValue: 18,
  },
  {
    id: "chk-3",
    goalId: "goal-02",
    checkedAt: "2026-09-21T07:00:00Z",
    progressSnapshot: 76,
    note: "Long run akhir pekan 7.5 KM berhasil diselesaikan dengan pace stabil 6:15/km.",
  },
];

export const useGoalStore = create<GoalStore>()(
  persist(
    (set, get) => ({
      goals: INITIAL_GOALS,
      contributors: INITIAL_CONTRIBUTORS,
      milestones: INITIAL_MILESTONES,
      checkIns: INITIAL_CHECKINS,
      selectedGoalId: null,

      createGoal: (goalData) => {
        const now = new Date().toISOString();
        const newGoal: Goal = {
          ...goalData,
          id: `goal-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateGoal: (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, ...updates, updatedAt: new Date().toISOString() } : g
          ),
        }));
      },

      deleteGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((g) => g.id !== id && g.parentGoalId !== id),
          contributors: state.contributors.filter((c) => c.goalId !== id),
          milestones: state.milestones.filter((m) => m.goalId !== id),
          checkIns: state.checkIns.filter((ci) => ci.goalId !== id),
          selectedGoalId: state.selectedGoalId === id ? null : state.selectedGoalId,
        }));
      },

      setGoalStatus: (id, status) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, status, updatedAt: new Date().toISOString() } : g
          ),
        }));
      },

      addContributor: (data) => {
        const newCon: Contributor = {
          ...data,
          id: `con-${Date.now()}`,
        };
        set((state) => ({ contributors: [...state.contributors, newCon] }));
      },

      removeContributor: (id) => {
        set((state) => ({
          contributors: state.contributors.filter((c) => c.id !== id),
        }));
      },

      updateContributorProgress: (id, currentProgress) => {
        set((state) => ({
          contributors: state.contributors.map((c) =>
            c.id === id ? { ...c, currentProgress } : c
          ),
        }));
      },

      addMilestone: (data) => {
        const newMs: GoalMilestone = {
          ...data,
          id: `gm-${Date.now()}`,
        };
        set((state) => ({ milestones: [...state.milestones, newMs] }));
      },

      toggleMilestone: (id) => {
        set((state) => ({
          milestones: state.milestones.map((m) =>
            m.id === id
              ? { ...m, status: m.status === "achieved" ? "upcoming" : "achieved" }
              : m
          ),
        }));
      },

      addCheckIn: (goalId, note, numericValue) => {
        const goal = get().goals.find((g) => g.id === goalId);
        const currentProg = get().getGoalProgress(goalId);

        const newCheckIn: CheckIn = {
          id: `chk-${Date.now()}`,
          goalId,
          checkedAt: new Date().toISOString(),
          progressSnapshot: currentProg,
          note,
          numericValue,
        };

        // If numeric target metric exists and numericValue is provided, update currentValue
        if (goal?.progressMetric?.type === "numeric_target" && numericValue !== undefined) {
          set((state) => ({
            goals: state.goals.map((g) =>
              g.id === goalId && g.progressMetric
                ? {
                    ...g,
                    progressMetric: {
                      ...g.progressMetric,
                      config: { ...g.progressMetric.config, currentValue: numericValue },
                    },
                    updatedAt: new Date().toISOString(),
                  }
                : g
            ),
          }));
        }

        set((state) => ({ checkIns: [newCheckIn, ...state.checkIns] }));
      },

      setSelectedGoalId: (id) => set({ selectedGoalId: id }),

      getGoalProgress: (goalId) => {
        const goal = get().goals.find((g) => g.id === goalId);
        if (!goal) return 0;
        if (goal.status === "achieved") return 100;

        // 1. Check if it has subgoals
        const subgoals = get().goals.filter((g) => g.parentGoalId === goalId);
        if (subgoals.length > 0) {
          const totalSubProgress = subgoals.reduce((acc, sub) => acc + get().getGoalProgress(sub.id), 0);
          return Math.round(totalSubProgress / subgoals.length);
        }

        // 2. Numeric target
        if (goal.progressMetric?.type === "numeric_target") {
          const { startValue = 0, targetValue = 100, currentValue = 0 } = goal.progressMetric.config;
          const range = targetValue - startValue;
          if (range === 0) return 100;
          const pct = ((currentValue - startValue) / range) * 100;
          return Math.min(100, Math.max(0, Math.round(pct)));
        }

        // 3. Milestone based
        if (goal.progressMetric?.type === "milestone_based") {
          const goalMs = get().milestones.filter((m) => m.goalId === goalId);
          if (goalMs.length === 0) return 0;
          const achieved = goalMs.filter((m) => m.status === "achieved").length;
          return Math.round((achieved / goalMs.length) * 100);
        }

        // 4. Contributors based (task_completion or habit_consistency)
        const goalCons = get().contributors.filter((c) => c.goalId === goalId);
        if (goalCons.length > 0) {
          const totalWeight = goalCons.reduce((acc, c) => acc + c.weight, 0);
          if (totalWeight > 0) {
            const weightedSum = goalCons.reduce(
              (acc, c) => acc + c.currentProgress * (c.weight / totalWeight),
              0
            );
            return Math.min(100, Math.max(0, Math.round(weightedSum)));
          }
        }

        return 0;
      },
    }),
    {
      name: "ecosystem-goal-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
