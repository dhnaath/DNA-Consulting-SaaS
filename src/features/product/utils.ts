import { differenceInDays, parseISO, isBefore, startOfDay } from "date-fns";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ItemStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateStatus(endDate: string): ItemStatus {
  const end = startOfDay(parseISO(endDate));
  const today = startOfDay(new Date());

  if (isBefore(end, today)) {
    return "kadaluarsa";
  }

  const daysLeft = differenceInDays(end, today);
  if (daysLeft <= 30) {
    return "hampir_habis";
  }

  return "aman";
}

export function calculateProgress(startDate: string, endDate: string) {
  const start = startOfDay(parseISO(startDate));
  const end = startOfDay(parseISO(endDate));
  const today = startOfDay(new Date());

  const totalDays = differenceInDays(end, start);
  const daysPassed = differenceInDays(today, start);

  if (totalDays <= 0) return 100;
  if (daysPassed < 0) return 0;

  const progress = (daysPassed / totalDays) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

export function formatDaysRemaining(endDate: string): string {
  const end = startOfDay(parseISO(endDate));
  const today = startOfDay(new Date());

  if (isBefore(end, today)) {
    return "Lewat batas";
  }

  const days = differenceInDays(end, today);
  if (days === 0) return "Hari ini";
  if (days === 1) return "Besok";

  // Convert to months/years if it's very long
  if (days > 365) {
    const years = Math.floor(days / 365);
    const remainingMonths = Math.floor((days % 365) / 30);
    return `${years} thn${remainingMonths > 0 ? ` ${remainingMonths} bln` : ""} lagi`;
  }

  if (days > 60) {
    const months = Math.floor(days / 30);
    return `${months} bulan lagi`;
  }

  return `${days} hari lagi`;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateTotalCost(
  price: number = 0,
  quantity: number = 1,
  discount: number = 0,
): number {
  return Math.max(price * quantity - discount, 0);
}

export function calculateAmortization(totalCost: number, startDate: string, endDate: string) {
  const start = startOfDay(parseISO(startDate));
  const end = startOfDay(parseISO(endDate));
  const totalDays = Math.max(differenceInDays(end, start), 1);
  const costPerDay = totalCost / totalDays;
  return {
    perDay: costPerDay,
    perMonth: costPerDay * 30,
  };
}
