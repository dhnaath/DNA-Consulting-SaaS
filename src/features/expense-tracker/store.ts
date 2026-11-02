import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import { Expense, ExpenseStatus } from "./types";

interface ExpenseStore {
  expenses: Expense[];
  selectedExpenseId: string | null;

  // Actions
  addExpense: (expense: Omit<Expense, "id" | "createdAt">) => string;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setStatus: (id: string, status: ExpenseStatus) => void;
  setSelectedExpenseId: (id: string | null) => void;
}

const INITIAL_EXPENSES: Expense[] = [
  {
    id: "exp-01",
    title: "Makan Siang Kickoff Tim Konsultan",
    amount: 485000,
    currency: "IDR",
    category: "food_beverage",
    date: "2026-09-23",
    paymentAccount: "Bank Mandiri Operasional",
    merchant: "Restoran Garuda Sabang",
    hasReceipt: true,
    receiptNote: "Struk terlampir di file arsip keuangan",
    isTaxDeductible: true,
    status: "cleared",
    tags: ["Client Kickoff", "Mandiri"],
    notes: "Pertemuan koordinasi tim proyek perbankan",
    createdAt: "2026-09-23T13:00:00Z",
  },
  {
    id: "exp-02",
    title: "BBM & Tol Dinas Kunjungan Lapangan",
    amount: 350000,
    currency: "IDR",
    category: "transportation",
    date: "2026-09-22",
    paymentAccount: "Kas Kecil (Petty Cash)",
    merchant: "SPBU Pertamina 31.129.02",
    hasReceipt: true,
    receiptNote: "Struk bensin Pertamax & struk tol Jagorawi",
    isTaxDeductible: true,
    status: "cleared",
    tags: ["Dinas Luar", "Transport"],
    notes: "Pengisian operasional Innova Zenix #01",
    createdAt: "2026-09-22T08:30:00Z",
  },
  {
    id: "exp-03",
    title: "Perlengkapan ATK & Whiteboard Marker",
    amount: 275000,
    currency: "IDR",
    category: "office_supplies",
    date: "2026-09-21",
    paymentAccount: "Kas Kecil (Petty Cash)",
    merchant: "Gramedia Matraman",
    hasReceipt: true,
    isTaxDeductible: false,
    status: "cleared",
    tags: ["ATK", "Kantor"],
    notes: "Kertas flipchart dan spidol untuk sesi workshop",
    createdAt: "2026-09-21T16:00:00Z",
  },
  {
    id: "exp-04",
    title: "Pembelian Domain & SSL Staging",
    amount: 620000,
    currency: "IDR",
    category: "software_tech",
    date: "2026-09-20",
    paymentAccount: "Kartu Kredit Mandiri Corporate",
    merchant: "Niagahoster Web Services",
    hasReceipt: true,
    receiptNote: "Invoice #NH-994821",
    isTaxDeductible: true,
    status: "reconciled",
    tags: ["Tech", "Infrastructure"],
    notes: "Sertifikat wildcard SSL untuk portal staging klien",
    createdAt: "2026-09-20T10:15:00Z",
  },
  {
    id: "exp-05",
    title: "Tiket Pesawat Jakarta - Surabaya PP",
    amount: 3450000,
    currency: "IDR",
    category: "travel",
    date: "2026-09-18",
    paymentAccount: "Kartu Kredit Mandiri Corporate",
    merchant: "Garuda Indonesia",
    hasReceipt: true,
    receiptNote: "E-ticket & boarding pass terlampir",
    isTaxDeductible: true,
    status: "reconciled",
    tags: ["Travel", "Audit Lapangan"],
    notes: "Perjalanan dinas tim audit ISO 27001",
    createdAt: "2026-09-18T07:00:00Z",
  },
  {
    id: "exp-06",
    title: "Kopi & Snack Pantry Kantor",
    amount: 320000,
    currency: "IDR",
    category: "food_beverage",
    date: "2026-09-17",
    paymentAccount: "Kas Kecil (Petty Cash)",
    merchant: "Super Indo Tebet",
    hasReceipt: false,
    isTaxDeductible: false,
    status: "cleared",
    tags: ["Pantry"],
    notes: "Kebutuhan harian pantry ruang kerja bersama",
    createdAt: "2026-09-17T11:00:00Z",
  },
  {
    id: "exp-07",
    title: "Internet Fiber Optik Dedicated Kantor",
    amount: 1850000,
    currency: "IDR",
    category: "utilities",
    date: "2026-09-15",
    paymentAccount: "BCA Giro Operasional",
    merchant: "Telkom IndiHome Enterprise",
    hasReceipt: true,
    receiptNote: "Bukti bayar auto-debit bank",
    isTaxDeductible: true,
    status: "reconciled",
    tags: ["Utilitas", "Kantor"],
    notes: "Tagihan bulan September internet 200 Mbps",
    createdAt: "2026-09-15T09:00:00Z",
  },
];

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set) => ({
      expenses: INITIAL_EXPENSES,
      selectedExpenseId: null,

      addExpense: (data) => {
        const id = `exp-${Date.now()}`;
        const newExp: Expense = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ expenses: [newExp, ...state.expenses] }));
        return id;
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
          selectedExpenseId:
            state.selectedExpenseId === id ? null : state.selectedExpenseId,
        }));
      },

      setStatus: (id, status) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, status } : e)),
        }));
      },

      setSelectedExpenseId: (id) => set({ selectedExpenseId: id }),
    }),
    {
      name: "ecosystem-expense-tracker-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
