import { CreditData } from "./types";

export const STORAGE_CREDIT_KEY = "wira_credit_facilities_v1";

export const DEFAULT_CREDIT_PRESETS: CreditData[] = [
  {
    id: "cred-bca-01",
    issuer: "BCA",
    name: "BCA Everyday Card",
    creditLimit: 25000000,
    minimum: 345000,
    outstanding: 3450000,
    installment: 0,
    usageGap: 21550000,
    margin: 1.75,
    usageRatio: 0.138,
    dueDateConfig: {
      mode: "monthly_fixed",
      startDate: new Date().toISOString().split("T")[0],
      dayOfMonth: 25,
    },
    penaltyConfig: { enabled: true, rate: 1, period: "monthly" },
  },
  {
    id: "cred-mandiri-02",
    issuer: "Mandiri",
    name: "Mandiri Skyz Platinum",
    creditLimit: 15000000,
    minimum: 120000,
    outstanding: 1200000,
    installment: 0,
    usageGap: 13800000,
    margin: 1.75,
    usageRatio: 0.08,
    dueDateConfig: {
      mode: "monthly_fixed",
      startDate: new Date().toISOString().split("T")[0],
      dayOfMonth: 15,
    },
    penaltyConfig: { enabled: true, rate: 1, period: "monthly" },
  },
  {
    id: "cred-bni-03",
    issuer: "BNI",
    name: "BNI Style Titanium",
    creditLimit: 20000000,
    minimum: 0,
    outstanding: 0,
    installment: 0,
    usageGap: 20000000,
    margin: 1.75,
    usageRatio: 0,
    dueDateConfig: {
      mode: "monthly_fixed",
      startDate: new Date().toISOString().split("T")[0],
      dayOfMonth: 20,
    },
    penaltyConfig: { enabled: false, rate: 0, period: "monthly" },
  },
  {
    id: "cred-kur-04",
    issuer: "BRI",
    name: "Fasilitas KUR Mikro",
    creditLimit: 50000000,
    minimum: 1250000,
    outstanding: 18500000,
    installment: 1250000,
    usageGap: 31500000,
    margin: 0.5,
    usageRatio: 0.37,
    dueDateConfig: {
      mode: "monthly_fixed",
      startDate: new Date().toISOString().split("T")[0],
      dayOfMonth: 10,
    },
    penaltyConfig: { enabled: true, rate: 0.5, period: "monthly" },
  },
];

export function getInitialCreditData(): CreditData[] {
  if (typeof window === "undefined") return DEFAULT_CREDIT_PRESETS;
  try {
    const saved = localStorage.getItem(STORAGE_CREDIT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_CREDIT_PRESETS;
}

export function saveCreditData(data: CreditData[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_CREDIT_KEY, JSON.stringify(data));
    } catch {}
  }
}

// Backward compatibility alias
export const dummyCreditData = DEFAULT_CREDIT_PRESETS;
