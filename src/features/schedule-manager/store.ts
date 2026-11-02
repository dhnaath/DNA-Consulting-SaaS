import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  WorkSchedule,
  Shift,
  ShiftAssignment,
  ScheduleException,
  Holiday,
  DayWorkingHours,
  ExceptionStatus,
} from "./types";

interface ScheduleStore {
  schedules: WorkSchedule[];
  shifts: Shift[];
  shiftAssignments: ShiftAssignment[];
  exceptions: ScheduleException[];
  holidays: Holiday[];
  currentUserId: string;

  // Actions
  createSchedule: (schedule: Omit<WorkSchedule, "id">) => void;
  updateSchedule: (id: string, updates: Partial<WorkSchedule>) => void;

  createShift: (shift: Omit<Shift, "id">) => void;
  assignShift: (assignment: Omit<ShiftAssignment, "id">) => void;
  updateShiftStatus: (id: string, status: ShiftAssignment["status"]) => void;

  requestException: (data: Omit<ScheduleException, "id" | "status">) => void;
  reviewException: (id: string, status: ExceptionStatus) => void;

  addHoliday: (holiday: Omit<Holiday, "id">) => void;
  deleteHoliday: (id: string) => void;

  calculateAvailability: (personId: string, date: string) => { availableHours: number; reason?: string };
}

const DEFAULT_WEEKLY_HOURS: DayWorkingHours[] = [
  { day: "Mon", start: "09:00", end: "17:00" },
  { day: "Tue", start: "09:00", end: "17:00" },
  { day: "Wed", start: "09:00", end: "17:00" },
  { day: "Thu", start: "09:00", end: "17:00" },
  { day: "Fri", start: "09:00", end: "17:00" },
  { day: "Sat", start: null, end: null },
  { day: "Sun", start: null, end: null },
];

const INITIAL_SCHEDULES: WorkSchedule[] = [
  {
    id: "ws-01",
    ownerType: "person",
    ownerId: "per-01",
    ownerName: "Budi Santoso",
    pattern: {
      type: "fixed_weekly",
      weeklyHours: DEFAULT_WEEKLY_HOURS,
    },
    timezone: "Asia/Jakarta",
    effectiveFrom: "2026-01-01",
  },
  {
    id: "ws-02",
    ownerType: "person",
    ownerId: "per-02",
    ownerName: "Siti Rahmawati",
    pattern: {
      type: "fixed_weekly",
      weeklyHours: DEFAULT_WEEKLY_HOURS,
    },
    timezone: "Asia/Jakarta",
    effectiveFrom: "2026-01-01",
  },
  {
    id: "ws-03",
    ownerType: "person",
    ownerId: "per-dhia",
    ownerName: "Dhia Pratama",
    pattern: {
      type: "rotating_shift",
      shiftCycleId: "cycle-3shifts",
    },
    timezone: "Asia/Jakarta",
    effectiveFrom: "2026-01-01",
  },
];

const INITIAL_SHIFTS: Shift[] = [
  { id: "shift-pagi", name: "Shift Pagi (Early)", startTime: "07:00", endTime: "15:00", breakMinutes: 60 },
  { id: "shift-siang", name: "Shift Siang (Middle)", startTime: "15:00", endTime: "23:00", breakMinutes: 60 },
  { id: "shift-malam", name: "Shift Malam (Graveyard)", startTime: "23:00", endTime: "07:00", breakMinutes: 60 },
];

const INITIAL_ASSIGNMENTS: ShiftAssignment[] = [
  {
    id: "sa-01",
    personId: "per-dhia",
    personName: "Dhia Pratama",
    shiftId: "shift-pagi",
    shiftName: "Shift Pagi",
    date: "2026-09-24",
    status: "completed",
  },
  {
    id: "sa-02",
    personId: "per-dhia",
    personName: "Dhia Pratama",
    shiftId: "shift-siang",
    shiftName: "Shift Siang",
    date: "2026-09-25",
    status: "scheduled",
  },
  {
    id: "sa-03",
    personId: "per-02",
    personName: "Siti Rahmawati",
    shiftId: "shift-pagi",
    shiftName: "Shift Pagi",
    date: "2026-09-26",
    status: "scheduled",
  },
];

const INITIAL_EXCEPTIONS: ScheduleException[] = [
  {
    id: "exc-01",
    ownerType: "person",
    ownerId: "per-dhia",
    ownerName: "Dhia Pratama",
    date: "2026-09-28",
    type: "leave",
    status: "approved",
    note: "Cuti tahunan 1 hari urusan keluarga.",
  },
  {
    id: "exc-02",
    ownerType: "person",
    ownerId: "per-02",
    ownerName: "Siti Rahmawati",
    date: "2026-09-24",
    type: "wfh",
    status: "approved",
    note: "WFH terjadwal (remote focus sprint).",
  },
  {
    id: "exc-03",
    ownerType: "person",
    ownerId: "per-01",
    ownerName: "Budi Santoso",
    date: "2026-09-26",
    type: "overtime",
    status: "pending",
    note: "Lembur akhir pekan persiapan go-live.",
  },
];

const INITIAL_HOLIDAYS: Holiday[] = [
  { id: "hol-01", name: "Tahun Baru Masehi", date: "2026-01-01", appliesTo: "all" },
  { id: "hol-02", name: "Hari Kemerdekaan Republik Indonesia", date: "2026-08-17", appliesTo: "all" },
  { id: "hol-03", name: "Maulid Nabi Muhammad SAW", date: "2026-09-16", appliesTo: "all" },
];

export const useScheduleStore = create<ScheduleStore>()(
  persist(
    (set, get) => ({
      schedules: INITIAL_SCHEDULES,
      shifts: INITIAL_SHIFTS,
      shiftAssignments: INITIAL_ASSIGNMENTS,
      exceptions: INITIAL_EXCEPTIONS,
      holidays: INITIAL_HOLIDAYS,
      currentUserId: "per-01",

      createSchedule: (data) => {
        const newSched: WorkSchedule = {
          ...data,
          id: `ws-${Date.now()}`,
        };
        set((state) => ({ schedules: [...state.schedules, newSched] }));
      },

      updateSchedule: (id, updates) => {
        set((state) => ({
          schedules: state.schedules.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      createShift: (data) => {
        const newShift: Shift = {
          ...data,
          id: `shift-${Date.now()}`,
        };
        set((state) => ({ shifts: [...state.shifts, newShift] }));
      },

      assignShift: (data) => {
        const newSa: ShiftAssignment = {
          ...data,
          id: `sa-${Date.now()}`,
        };
        set((state) => ({ shiftAssignments: [...state.shiftAssignments, newSa] }));
      },

      updateShiftStatus: (id, status) => {
        set((state) => ({
          shiftAssignments: state.shiftAssignments.map((sa) =>
            sa.id === id ? { ...sa, status } : sa
          ),
        }));
      },

      requestException: (data) => {
        const newExc: ScheduleException = {
          ...data,
          id: `exc-${Date.now()}`,
          status: "pending",
        };
        set((state) => ({ exceptions: [newExc, ...state.exceptions] }));
      },

      reviewException: (id, status) => {
        set((state) => ({
          exceptions: state.exceptions.map((e) => (e.id === id ? { ...e, status } : e)),
        }));
      },

      addHoliday: (data) => {
        const newHol: Holiday = {
          ...data,
          id: `hol-${Date.now()}`,
        };
        set((state) => ({ holidays: [...state.holidays, newHol] }));
      },

      deleteHoliday: (id) => {
        set((state) => ({
          holidays: state.holidays.filter((h) => h.id !== id),
        }));
      },

      calculateAvailability: (personId, date) => {
        const { exceptions, holidays, shiftAssignments, shifts } = get();

        // 1. Check Holiday
        const isHol = holidays.some((h) => h.date === date);
        if (isHol) {
          return { availableHours: 0, reason: "Hari Libur Nasional" };
        }

        // 2. Check approved Exception
        const activeExc = exceptions.find(
          (e) => e.ownerId === personId && e.date === date && e.status === "approved"
        );
        if (activeExc) {
          if (activeExc.type === "leave") return { availableHours: 0, reason: "Cuti Disetujui" };
          if (activeExc.type === "sick") return { availableHours: 0, reason: "Sakit (Izin Medis)" };
          if (activeExc.type === "wfh") return { availableHours: 8, reason: "Bekerja dari Rumah (WFH)" };
          if (activeExc.type === "overtime") return { availableHours: 11, reason: "Hari Kerja + Lembur" };
        }

        // 3. Check ShiftAssignment if rotating
        const assign = shiftAssignments.find((sa) => sa.personId === personId && sa.date === date);
        if (assign) {
          const shiftMeta = shifts.find((s) => s.id === assign.shiftId);
          return { availableHours: 8, reason: `${assign.shiftName} (${shiftMeta?.startTime}-${shiftMeta?.endTime})` };
        }

        // 4. Default schedule
        const dayOfWeekIndex = new Date(date).getDay();
        const daysMap: Array<'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'> = [
          'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
        ];
        const dayCode = daysMap[dayOfWeekIndex];

        if (dayCode === 'Sat' || dayCode === 'Sun') {
          return { availableHours: 0, reason: "Akhir Pekan (Off)" };
        }

        return { availableHours: 8, reason: "Jam Kerja Normal (09:00 - 17:00)" };
      },
    }),
    {
      name: "ecosystem-schedule-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
