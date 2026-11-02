import { useState, useEffect, useCallback } from "react";
import { getRaw, setRaw } from "../core/rawStorage";

export interface RecentAppItem {
  to: string;
  label: string;
  category?: string;
  timestamp: number;
  id?: string;
  visitedAt?: number;
  [key: string]: any;
}

const STORAGE_KEY = "aio_recent_apps";

export function useRecentApps() {
  const [recentApps, setRecentApps] = useState<RecentAppItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getRaw(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        // fallback
      }
    }
    return [
      { id: "swot", to: "/swot", label: "SWOT Analysis", category: "Strategic Management", timestamp: Date.now() - 3600000 },
      { id: "bmc", to: "/bmc", label: "Business Model Canvas", category: "Business Model", timestamp: Date.now() - 7200000 },
      { id: "contacts", to: "/contacts", label: "Kontak & CRM", category: "People & Society", timestamp: Date.now() - 14400000 },
    ];
  });

  useEffect(() => {
    try {
      setRaw(STORAGE_KEY, JSON.stringify(recentApps));
    } catch (e) {
      // ignore
    }
  }, [recentApps]);

  const addRecentApp = useCallback((app: { to: string; label: string; category?: string }) => {
    if (!app.to || app.to === "/") return;
    setRecentApps((prev) => {
      const filtered = prev.filter((item) => item.to !== app.to);
      const nextItem: RecentAppItem = {
        id: `${app.to.replace(/\//g, "-")}-${Date.now()}`,
        to: app.to,
        label: app.label || app.to.replace("/", ""),
        category: app.category || "App",
        timestamp: Date.now(),
      };
      return [nextItem, ...filtered].slice(0, 30);
    });
  }, []);

  const removeRecentApp = useCallback((to: string) => {
    setRecentApps((prev) => prev.filter((item) => item.to !== to));
  }, []);

  const clearRecentApps = useCallback(() => {
    setRecentApps([]);
  }, []);

  return { recentApps, addRecentApp, removeRecentApp, clearRecentApps };
}
