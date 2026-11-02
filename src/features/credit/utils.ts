import { DueDateConfig, PenaltyConfig, PenaltyPeriod } from "./types";

export const formatRupiah = (value: number) => {
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);
  let formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(absoluteValue);
  formatted = formatted.replace(/^Rp\s*/i, "Rp");
  return isNegative ? `-${formatted}` : formatted;
};

export const formatPercent = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatDateID = (d: Date) => {
  if (isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

export const getColumnMinMax = <T, K extends keyof T>(
  data: T[],
  key: K,
): { min: number; max: number } => {
  let min = Infinity;
  let max = -Infinity;
  data.forEach((item) => {
    const val = item[key];
    if (typeof val === "number") {
      if (val < min) min = val;
      if (val > max) max = val;
    }
  });
  return { min: min === Infinity ? 0 : min, max: max === -Infinity ? 0 : max };
};

export const calculateCellColor = (
  value: number,
  min: number,
  max: number,
  inverse: boolean = false,
) => {
  if (min === max) return { backgroundColor: "#ffffff", color: "#000000" };

  const mid = (min + max) / 2;

  let r, g, b;
  if (value < mid) {
    const ratio = Math.max(0, Math.min(1, (value - min) / (mid - min)));
    r = Math.round(248 + (255 - 248) * ratio);
    g = Math.round(105 + (255 - 105) * ratio);
    b = Math.round(107 + (255 - 107) * ratio);
  } else {
    const ratio = Math.max(0, Math.min(1, (value - mid) / (max - mid)));
    r = Math.round(255 + (99 - 255) * ratio);
    g = Math.round(255 + (190 - 255) * ratio);
    b = Math.round(255 + (123 - 255) * ratio);
  }

  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: "#000000",
  };
};

/* ---------------------------------------------------------------
   Due-date & penalty/interest projection helpers
--------------------------------------------------------------- */
const MS_DAY = 86400000;

export const parseISO = (s: string): Date => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};

export const toISO = (d: Date): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const startOfDay = (d: Date): Date =>
  isNaN(d.getTime()) ? new Date(NaN) : new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const addDays = (d: Date, days: number): Date => new Date(d.getTime() + days * MS_DAY);

export const daysBetween = (a: Date, b: Date): number =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / MS_DAY);

const daysInMonth = (year: number, monthIndex0: number): number =>
  new Date(year, monthIndex0 + 1, 0).getDate();

export const computeNextDueDate = (config: DueDateConfig, refDate: Date): Date => {
  const start = startOfDay(parseISO(config.startDate));
  const ref = startOfDay(refDate);
  if (config.mode === "monthly_fixed") {
    const dom = config.dayOfMonth ?? start.getDate();
    const y = start.getFullYear();
    let m = start.getMonth();
    let candidate = new Date(y, m, Math.min(dom, daysInMonth(y, m)));
    if (candidate < start) {
      m += 1;
      candidate = new Date(y, m, Math.min(dom, daysInMonth(y, m)));
    }
    let guard = 0;
    while (candidate < ref && guard < 2400) {
      m += 1;
      candidate = new Date(y, m, Math.min(dom, daysInMonth(y, m)));
      guard++;
    }
    return candidate;
  }
  const intervalDays = config.mode === "weekly" ? 7 : Math.max(1, config.intervalDays ?? 30);
  const diff = daysBetween(start, ref);
  const k = Math.max(0, Math.ceil(diff / intervalDays));
  return addDays(start, k * intervalDays);
};

const PERIOD_DAYS: Record<PenaltyPeriod, number> = { daily: 1, weekly: 7, monthly: 30 };

export const periodLabel = (p: PenaltyPeriod): string => {
  if (p === "daily") return "/hari";
  if (p === "weekly") return "/minggu";
  return "/bulan";
};

export const computeAccruedPenalty = (
  config: PenaltyConfig,
  startDateISO: string,
  refDate: Date,
  baseAmount: number,
): { periodsElapsed: number; accrued: number } => {
  if (!config.enabled || config.rate <= 0 || baseAmount <= 0) {
    return { periodsElapsed: 0, accrued: 0 };
  }
  const start = startOfDay(parseISO(startDateISO));
  const ref = startOfDay(refDate);
  const diff = Math.max(0, daysBetween(start, ref));
  const periodDays = PERIOD_DAYS[config.period];
  const periodsElapsed = Math.floor(diff / periodDays);
  const accrued = periodsElapsed * config.rate * baseAmount;
  return { periodsElapsed, accrued };
};

export interface DayStatusResult {
  days: number;
  label: string;
  badgeClass: string;
  category: "RED" | "YELLOW" | "GREEN";
}

export const parseAmount = (val: string | number | undefined | null): number => {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;

  const cleaned = String(val).replace(/[^0-9-]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const formatIDR = (val: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val || 0);
};

export const calculateDayStatus = (daysStatus: number | null): DayStatusResult => {
  if (daysStatus === null) {
    return {
      days: 0,
      label: "-",
      badgeClass: "bg-bg-muted text-muted-foreground border-border",
      category: "GREEN",
    };
  }

  if (daysStatus < 0) {
    return {
      days: daysStatus,
      label: `Terlambat ${Math.abs(daysStatus)} Hari`,
      badgeClass: "bg-red-100 text-red-700 border border-red-300 font-semibold",
      category: "RED",
    };
  } else if (daysStatus <= 7) {
    return {
      days: daysStatus,
      label: daysStatus === 0 ? "Jatuh Tempo Hari Ini" : `Sisa ${daysStatus} Hari`,
      badgeClass: "bg-amber-100 text-amber-800 border border-amber-300 font-semibold",
      category: "YELLOW",
    };
  } else {
    return {
      days: daysStatus,
      label: `Sisa ${daysStatus} Hari`,
      badgeClass: "bg-emerald-100 text-emerald-800 border border-emerald-300 font-semibold",
      category: "GREEN",
    };
  }
};

export const calculateFullPayoff = (
  currentDue: string | number | undefined | null,
  installmentPrincipal: string | number | undefined | null,
  revolvingUsage: string | number | undefined | null,
  lateCharges: string | number | undefined | null,
): number => {
  return (
    parseAmount(currentDue) +
    parseAmount(installmentPrincipal) +
    parseAmount(revolvingUsage) +
    parseAmount(lateCharges)
  );
};

import { MinPaymentConfig } from "./types";

export const calculateMinPayment = (config: MinPaymentConfig, currentDue: number): number => {
  if (!config || !config.enabled) return 0;

  const byPercentage = currentDue * (config.percentage / 100);
  const byNominal = config.nominal;

  if (config.mode === "percentage") return byPercentage;
  if (config.mode === "nominal") return byNominal;
  if (config.mode === "greater_of") return Math.max(byPercentage, byNominal);

  return 0;
};
