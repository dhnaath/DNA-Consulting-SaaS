import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Subscription,
  BillingHistoryItem,
  BillingCycle,
  SubscriptionStatus,
} from "./types";

interface SubscriptionStore {
  subscriptions: Subscription[];
  billingHistory: BillingHistoryItem[];
  selectedSubscriptionId: string | null;

  // Actions
  createSubscription: (sub: Omit<Subscription, "id" | "createdAt">) => string;
  updateSubscription: (id: string, updates: Partial<Subscription>) => void;
  deleteSubscription: (id: string) => void;
  setStatus: (id: string, status: SubscriptionStatus) => void;
  recordRenewalPayment: (id: string) => void;
  setSelectedSubscriptionId: (id: string | null) => void;
}

export function getMonthlyEquivalent(price: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "weekly":
      return Math.round(price * 4.33);
    case "monthly":
      return price;
    case "quarterly":
      return Math.round(price / 3);
    case "semi-annually":
      return Math.round(price / 6);
    case "annually":
      return Math.round(price / 12);
    default:
      return price;
  }
}

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: "sub-01",
    name: "AWS Cloud Infrastructure",
    category: "cloud_infrastructure",
    price: 1850000,
    currency: "IDR",
    billingCycle: "monthly",
    startDate: "2025-01-01",
    nextRenewalDate: "2026-09-30",
    autoRenew: true,
    status: "active",
    paymentMethod: "Kartu Kredit Mandiri Corporate",
    reminderDaysBefore: 3,
    websiteUrl: "https://aws.amazon.com",
    notes: "Server produksi EC2, RDS PostgreSQL, dan S3 backup",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "sub-02",
    name: "Project Suite Team Edition",
    category: "work_software",
    price: 320000,
    currency: "IDR",
    billingCycle: "monthly",
    startDate: "2025-03-01",
    nextRenewalDate: "2026-10-02",
    autoRenew: true,
    status: "active",
    paymentMethod: "Kartu Kredit BCA Card",
    reminderDaysBefore: 2,
    websiteUrl: "https://example.com",
    notes: "Workspace kolaborasi tim & manajemen proyek",
    createdAt: "2025-03-01T00:00:00Z",
  },
  {
    id: "sub-03",
    name: "Google Workspace Business",
    category: "work_software",
    price: 450000,
    currency: "IDR",
    billingCycle: "monthly",
    startDate: "2025-02-15",
    nextRenewalDate: "2026-10-05",
    autoRenew: true,
    status: "active",
    paymentMethod: "BCA Virtual Account",
    reminderDaysBefore: 3,
    notes: "Email domain perusahaan, Google Meet 250 peserta, 2TB Cloud",
    createdAt: "2025-02-15T00:00:00Z",
  },
  {
    id: "sub-04",
    name: "Figma Organization License",
    category: "work_software",
    price: 2400000,
    currency: "IDR",
    billingCycle: "annually",
    startDate: "2025-12-01",
    nextRenewalDate: "2026-12-01",
    autoRenew: true,
    status: "active",
    paymentMethod: "Kartu Kredit Mandiri Corporate",
    reminderDaysBefore: 7,
    notes: "Desain sistem UI/UX & prototipe klien",
    createdAt: "2025-12-01T00:00:00Z",
  },
  {
    id: "sub-05",
    name: "Spotify Premium Family",
    category: "entertainment",
    price: 86900,
    currency: "IDR",
    billingCycle: "monthly",
    startDate: "2024-05-10",
    nextRenewalDate: "2026-09-28",
    autoRenew: true,
    status: "active",
    paymentMethod: "GoPay Auto-Debit",
    reminderDaysBefore: 1,
    notes: "Akun musik relaksasi & podcast saat kerja",
    createdAt: "2024-05-10T00:00:00Z",
  },
  {
    id: "sub-06",
    name: "Notion Enterprise (Trial 14 Hari)",
    category: "work_software",
    price: 150000,
    currency: "IDR",
    billingCycle: "monthly",
    startDate: "2026-09-15",
    nextRenewalDate: "2026-09-29",
    trialEndDate: "2026-09-29",
    autoRenew: false,
    status: "trial",
    paymentMethod: "Kartu Kredit BCA",
    reminderDaysBefore: 1,
    notes: "Uji coba fitur database relasional & kolaborasi tim sebelum upgrade",
    createdAt: "2026-09-15T00:00:00Z",
  },
  {
    id: "sub-07",
    name: "Celebrity Fitness All Club",
    category: "fitness",
    price: 650000,
    currency: "IDR",
    billingCycle: "monthly",
    startDate: "2025-06-01",
    nextRenewalDate: "2026-10-10",
    autoRenew: false,
    status: "paused",
    paymentMethod: "Auto-Debit Mandiri",
    reminderDaysBefore: 3,
    notes: "Dijeda sementara selama masa sprint go-live luar kota",
    createdAt: "2025-06-01T00:00:00Z",
  },
];

const INITIAL_BILLING_HISTORY: BillingHistoryItem[] = [
  {
    id: "bill-01",
    subscriptionId: "sub-01",
    subscriptionName: "AWS Cloud Infrastructure",
    billingDate: "2026-08-31",
    amount: 1820000,
    currency: "IDR",
    status: "paid",
    paymentMethod: "Kartu Kredit Mandiri Corporate",
    notes: "Pembayaran tagihan invoice bulan Agustus",
  },
  {
    id: "bill-02",
    subscriptionId: "sub-02",
    subscriptionName: "Project Suite Team Edition",
    billingDate: "2026-09-02",
    amount: 320000,
    currency: "IDR",
    status: "paid",
    paymentMethod: "Kartu Kredit BCA Card",
    notes: "Perpanjangan bulanan",
  },
  {
    id: "bill-03",
    subscriptionId: "sub-05",
    subscriptionName: "Spotify Premium Family",
    billingDate: "2026-08-28",
    amount: 86900,
    currency: "IDR",
    status: "paid",
    paymentMethod: "GoPay Auto-Debit",
    notes: "Auto-debit berhasil",
  },
];

export const useSubscriptionStore = create<SubscriptionStore>()(
  persist(
    (set, get) => ({
      subscriptions: INITIAL_SUBSCRIPTIONS,
      billingHistory: INITIAL_BILLING_HISTORY,
      selectedSubscriptionId: null,

      createSubscription: (data) => {
        const id = `sub-${Date.now()}`;
        const newSub: Subscription = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ subscriptions: [newSub, ...state.subscriptions] }));
        return id;
      },

      updateSubscription: (id, updates) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      },

      deleteSubscription: (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
          billingHistory: state.billingHistory.filter((b) => b.subscriptionId !== id),
          selectedSubscriptionId:
            state.selectedSubscriptionId === id ? null : state.selectedSubscriptionId,
        }));
      },

      setStatus: (id, status) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        }));
      },

      recordRenewalPayment: (id) => {
        const { subscriptions, billingHistory } = get();
        const sub = subscriptions.find((s) => s.id === id);
        if (!sub) return;

        // Create billing item
        const newBilling: BillingHistoryItem = {
          id: `bill-${Date.now()}`,
          subscriptionId: sub.id,
          subscriptionName: sub.name,
          billingDate: new Date().toISOString().split("T")[0],
          amount: sub.price,
          currency: sub.currency,
          status: "paid",
          paymentMethod: sub.paymentMethod,
          notes: `Pembayaran perpanjangan siklus ${sub.billingCycle}`,
        };

        // Advance nextRenewalDate based on cycle
        const currentNext = new Date(sub.nextRenewalDate);
        if (sub.billingCycle === "weekly") {
          currentNext.setDate(currentNext.getDate() + 7);
        } else if (sub.billingCycle === "monthly") {
          currentNext.setMonth(currentNext.getMonth() + 1);
        } else if (sub.billingCycle === "quarterly") {
          currentNext.setMonth(currentNext.getMonth() + 3);
        } else if (sub.billingCycle === "semi-annually") {
          currentNext.setMonth(currentNext.getMonth() + 6);
        } else if (sub.billingCycle === "annually") {
          currentNext.setFullYear(currentNext.getFullYear() + 1);
        }

        const nextDateStr = currentNext.toISOString().split("T")[0];

        set({
          billingHistory: [newBilling, ...billingHistory],
          subscriptions: subscriptions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  nextRenewalDate: nextDateStr,
                  status: s.status === "trial" ? "active" : s.status,
                }
              : s
          ),
        });
      },

      setSelectedSubscriptionId: (id) => set({ selectedSubscriptionId: id }),
    }),
    {
      name: "ecosystem-subscription-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
