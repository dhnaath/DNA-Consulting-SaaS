import { useState, useEffect } from "react";

export interface Fee {
  id: string;
  name: string;
  amount: number;
  frequency: "sekali" | "bulanan" | "tahunan";
}

export interface Debt {
  id: string;
  name: string;
  type: string;
  amount: number;
  limit: number;
  description: string;
  color: string;
  statementDate?: string;
  dueDate?: string;
  remainingInstallments?: number;
  fees?: Fee[];
  accountClass?: "debit" | "kredit";
  penalty?: number;
  penaltyFrequency?: "harian" | "bulanan";
  startDate?: string;
  tenor?: number;
  principalAmount?: number;
  interestRate?: number;
  monthlyInstallment?: number;
  totalPaid?: number;
  status?: "aktif" | "lunas" | "menunggak";
}

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("manajemen_debts") : null;
    if (stored) {
      try {
        setDebts(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const addDebt = (debt: Omit<Debt, "id">) => {
    const newDebt = { ...debt, id: crypto.randomUUID() };
    const newDebts = [...debts, newDebt];
    setDebts(newDebts);
    localStorage.setItem("manajemen_debts", JSON.stringify(newDebts));
  };

  const removeDebt = (id: string) => {
    const newDebts = debts.filter((d) => d.id !== id);
    setDebts(newDebts);
    localStorage.setItem("manajemen_debts", JSON.stringify(newDebts));
  };

  const updateDebt = (updatedDebt: Debt) => {
    const newDebts = debts.map((d) => (d.id === updatedDebt.id ? updatedDebt : d));
    setDebts(newDebts);
    localStorage.setItem("manajemen_debts", JSON.stringify(newDebts));
  };

  const moveDebt = (id: string, direction: "up" | "down") => {
    const index = debts.findIndex((d) => d.id === id);
    if (index < 0) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === debts.length - 1) return;

    const newDebts = [...debts];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    [newDebts[index], newDebts[swapIndex]] = [newDebts[swapIndex], newDebts[index]];

    setDebts(newDebts);
    localStorage.setItem("manajemen_debts", JSON.stringify(newDebts));
  };

  return { debts, addDebt, removeDebt, updateDebt, moveDebt };
}
