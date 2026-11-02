export type ScheduleOwnerType = 'person' | 'resource';

export type PatternType = 'fixed_weekly' | 'rotating_shift';

export type ShiftAssignmentStatus = 'scheduled' | 'completed' | 'swapped' | 'absent';

export type ExceptionType = 'leave' | 'sick' | 'wfh' | 'holiday_override' | 'overtime';

export type ExceptionStatus = 'pending' | 'approved' | 'rejected';

export interface DayWorkingHours {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  start: string | null; // e.g. "09:00"
  end: string | null;   // e.g. "17:00"
}

export interface WorkSchedulePattern {
  type: PatternType;
  weeklyHours?: DayWorkingHours[];
  shiftCycleId?: string;
}

export interface WorkSchedule {
  id: string;
  ownerType: ScheduleOwnerType;
  ownerId: string;
  ownerName: string;
  pattern: WorkSchedulePattern;
  timezone: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface Shift {
  id: string;
  name: string; // e.g. "Pagi", "Siang", "Malam"
  startTime: string; // "07:00"
  endTime: string;   // "15:00"
  breakMinutes: number;
}

export interface ShiftAssignment {
  id: string;
  personId: string;
  personName: string;
  shiftId: string;
  shiftName: string;
  date: string;
  status: ShiftAssignmentStatus;
}

export interface ScheduleException {
  id: string;
  ownerType: ScheduleOwnerType;
  ownerId: string;
  ownerName: string;
  date: string;
  type: ExceptionType;
  status: ExceptionStatus;
  note?: string;
}

export interface Holiday {
  id: string;
  name: string;
  date: string;
  appliesTo: 'all' | 'specific_region' | 'specific_team';
}

export type ScheduleViewMode =
  | 'my_schedule'
  | 'team_schedule'
  | 'shift_roster'
  | 'exceptions'
  | 'holidays'
  | 'stats';
