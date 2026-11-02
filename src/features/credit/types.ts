export type DueDateMode = "monthly_fixed" | "interval_days" | "weekly";
export type PenaltyPeriod = "daily" | "weekly" | "monthly";

export interface DueDateConfig {
  mode: DueDateMode;
  startDate: string; // 'YYYY-MM-DD' - anchor/first due date
  dayOfMonth?: number; // used when mode === 'monthly_fixed'
  intervalDays?: number; // used when mode === 'interval_days'
}

export interface PenaltyConfig {
  enabled: boolean;
  rate: number; // decimal, e.g. 0.02 = 2%
  period: PenaltyPeriod; // rate applies per this period
}

export type MinPaymentMode = "percentage" | "nominal" | "greater_of";

export interface MinPaymentConfig {
  enabled: boolean;
  mode: MinPaymentMode;
  percentage: number;
  nominal: number;
}

export interface InstallmentConfig {
  totalAmount: number | null;
  tenorMonths: number | null;
}

export interface CreditData {
  id: string;
  issuer: string;
  name: string;
  creditLimit: number | null;
  minimum: number | null;
  outstanding: number | null;
  installment: number | null;
  usageGap: number | null;
  margin: number | null;
  usageRatio: number;
  dueDateConfig: DueDateConfig;
  penaltyConfig: PenaltyConfig;
  minPaymentConfig?: MinPaymentConfig;
  installmentConfig?: InstallmentConfig;
  manualPenalty?: number | null;
  manualTotalOutstanding?: number | null;
  isHighlighted?: boolean;
}

// Fields computed on the fly (per reference date), attached to each row for display/sorting.
export interface EnrichedCreditData extends CreditData {
  nextDueDate: Date | null;
  daysUntilDue: number | null;
  periodsElapsed: number | null;
  accruedPenalty: number | null;
  totalOutstanding: number | null;
}

export type SortKey =
  keyof CreditData | "nextDueDate" | "daysUntilDue" | "accruedPenalty" | "totalOutstanding";

export type SortConfig = {
  key: SortKey | null;
  direction: "asc" | "desc";
};
