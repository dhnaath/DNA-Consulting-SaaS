import { useState, useEffect, useCallback, useMemo } from "react";
import {
  CountdownItem,
  Category,
  Tag,
  Activity,
  CountdownTemplate,
  CountdownDirection,
  Recurrence,
  LinkedEntity,
} from "./types";
import { getRaw, setRaw } from "../../core/rawStorage";

export const COUNTDOWN_STORAGE_KEY = "aio_countdown_data_v1";
export const CALENDAR_STORAGE_KEY = "aio_calendar_data_v1";
export const PROJECT_STORAGE_KEY = "aio_project_manager_data_v1";

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-kerja", name: "Kerja & Bisnis", color: "#3B82F6", icon: "Briefcase" },
  { id: "cat-personal", name: "Personal", color: "#10B981", icon: "User" },
  { id: "cat-event", name: "Event & Perayaan", color: "#EC4899", icon: "PartyPopper" },
  { id: "cat-keluarga", name: "Keluarga", color: "#F59E0B", icon: "Heart" },
  { id: "cat-proyek", name: "Proyek & Rilis", color: "#8B5CF6", icon: "Rocket" },
  { id: "cat-liburan", name: "Liburan & Wisata", color: "#06B6D4", icon: "Plane" },
];

export const DEFAULT_TAGS: Tag[] = [
  { id: "tag-urgent", name: "Urgent", color: "#EF4444" },
  { id: "tag-milestone", name: "Milestone", color: "#8B5CF6" },
  { id: "tag-launch", name: "Launch", color: "#3B82F6" },
  { id: "tag-holiday", name: "Holiday", color: "#10B981" },
  { id: "tag-anniversary", name: "Anniversary", color: "#F59E0B" },
];

export const BUILT_IN_TEMPLATES: CountdownTemplate[] = [
  {
    id: "tpl-wedding",
    title: "Pernikahan & Hari Bahagia",
    description: "Hitung mundur momen sakral pernikahan dengan multi-reminder terstruktur.",
    defaultTitle: "Pernikahan Dhia & Partner",
    categoryName: "Event & Perayaan",
    targetType: "exact_time",
    direction: "count_down",
    defaultReminderOffsets: ["P30D", "P7D", "P1D", "PT1H"],
    suggestedCover: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    badge: "Romantik",
  },
  {
    id: "tpl-product-launch",
    title: "Peluncuran Produk (Product Launch)",
    description: "Countdown go-live peluncuran produk terhubung ke Milestone Manager.",
    defaultTitle: "Go-Live Enterprise Suite v2.0",
    categoryName: "Proyek & Rilis",
    targetType: "exact_time",
    direction: "count_down",
    defaultReminderOffsets: ["P14D", "P3D", "P1D", "PT3H"],
    linkedEntityType: "milestone",
    suggestedCover: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    badge: "Bisnis",
  },
  {
    id: "tpl-birthday",
    title: "Ulang Tahun & Anniversary",
    description: "Perayaan berulang tahunan dengan opsi otomatis beralih ke count up.",
    defaultTitle: "Ulang Tahun Syahrul Akbar",
    categoryName: "Personal",
    targetType: "all_day",
    direction: "count_down",
    autoSwitchCountUp: true,
    recurrence: {
      type: "yearly",
      interval: 1,
    },
    defaultReminderOffsets: ["P7D", "P1D"],
    suggestedCover: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
    badge: "Tahunan",
  },
  {
    id: "tpl-trip",
    title: "Liburan & Perjalanan (Trip)",
    description: "Hitung mundur keberangkatan tiket pesawat atau ekspedisi wisata.",
    defaultTitle: "Ekspedisi Musim Dingin Sapporo",
    categoryName: "Liburan & Wisata",
    targetType: "date_only",
    direction: "count_down",
    defaultReminderOffsets: ["P14D", "P7D", "P2D"],
    linkedEntityType: "trip",
    suggestedCover: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    badge: "Wisata",
  },
  {
    id: "tpl-countup-habit",
    title: "Pencapaian Hari Bebas / Streak",
    description: "Penghitung hari (count up) sejak keputusan penting atau target tercapai.",
    defaultTitle: "Hari Bebas Rokok & Hidup Sehat",
    categoryName: "Personal",
    targetType: "exact_time",
    direction: "count_up",
    defaultReminderOffsets: ["P30D"],
    suggestedCover: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    badge: "Count Up",
  },
];

// Helper date generator for seed items
const now = new Date();
const inDays = (d: number, h: number = 0, m: number = 0) => {
  const dt = new Date(now.getTime() + d * 86400000 + h * 3600000 + m * 60000);
  return dt.toISOString();
};
const pastDays = (d: number) => {
  const dt = new Date(now.getTime() - d * 86400000);
  return dt.toISOString();
};

export const INITIAL_COUNTDOWNS: CountdownItem[] = [
  {
    id: "cd-1",
    title: "Peluncuran Produk Enterprise Suite",
    description: "Rilis versi 3.0 ke pasar enterprise dengan arsitektur multi-tenant.",
    targetAt: inDays(14, 4, 30),
    targetType: "exact_time",
    direction: "count_down",
    categoryId: "cat-proyek",
    tags: ["Launch", "Milestone"],
    pinned: true,
    status: "Active",
    coverImage: {
      id: "cov-1",
      countdownId: "cd-1",
      name: "Product Launch Cover",
      type: "image",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      createdAt: now.toISOString(),
    },
    linkedEntity: {
      entityType: "milestone",
      entityId: "ms-q3-release",
      entityTitle: "Milestone Q3 Release Audit",
      isBroken: false,
    },
    reminders: [
      { id: "rem-1", countdownId: "cd-1", triggerOffset: "P7D", triggerAt: inDays(7), status: "pending" },
      { id: "rem-2", countdownId: "cd-1", triggerOffset: "P1D", triggerAt: inDays(1), status: "pending" },
      { id: "rem-3", countdownId: "cd-1", triggerOffset: "PT1H", triggerAt: inDays(14, 3, 30), status: "pending" },
    ],
    createdAt: pastDays(10),
    updatedAt: pastDays(1),
  },
  {
    id: "cd-2",
    title: "Pernikahan Dhia & Partner",
    description: "Akad nikah dan resepsi kebersamaan keluarga besar di Grand Ballroom.",
    targetAt: inDays(45, 9, 0),
    targetType: "exact_time",
    direction: "count_down",
    categoryId: "cat-event",
    tags: ["Anniversary", "Urgent"],
    pinned: true,
    status: "Active",
    coverImage: {
      id: "cov-2",
      countdownId: "cd-2",
      name: "Wedding Flowers",
      type: "image",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      createdAt: now.toISOString(),
    },
    linkedEntity: {
      entityType: "event",
      entityId: "evt-dhia-wedding",
      entityTitle: "Akad & Resepsi Pernikahan",
      isBroken: false,
    },
    reminders: [
      { id: "rem-4", countdownId: "cd-2", triggerOffset: "P30D", triggerAt: inDays(15), status: "pending" },
      { id: "rem-5", countdownId: "cd-2", triggerOffset: "P7D", triggerAt: inDays(38), status: "pending" },
    ],
    createdAt: pastDays(30),
    updatedAt: pastDays(2),
  },
  {
    id: "cd-3",
    title: "Audit Tahunan Sertifikasi ISO 27001",
    description: "Pemeriksaan compliance keamanan data dan kerahasiaan sistem.",
    targetAt: inDays(4, 8, 0),
    targetType: "exact_time",
    direction: "count_down",
    categoryId: "cat-kerja",
    tags: ["Urgent", "Milestone"],
    pinned: true,
    status: "Active",
    coverImage: {
      id: "cov-3",
      countdownId: "cd-3",
      name: "Security Audit",
      type: "image",
      url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
      createdAt: now.toISOString(),
    },
    reminders: [
      { id: "rem-6", countdownId: "cd-3", triggerOffset: "P3D", triggerAt: inDays(1), status: "pending" },
      { id: "rem-7", countdownId: "cd-3", triggerOffset: "PT2H", triggerAt: inDays(4, 6, 0), status: "pending" },
    ],
    createdAt: pastDays(15),
    updatedAt: pastDays(1),
  },
  {
    id: "cd-4",
    title: "Ulang Tahun Perusahaan ke-5",
    description: "Townhall akbar dan pemberian penghargaan loyalitas karyawan.",
    targetAt: inDays(62),
    targetType: "all_day",
    direction: "count_down",
    categoryId: "cat-event",
    tags: ["Anniversary"],
    pinned: false,
    status: "Active",
    recurrence: {
      type: "yearly",
      interval: 1,
    },
    autoSwitchCountUp: true,
    coverImage: {
      id: "cov-4",
      countdownId: "cd-4",
      name: "Celebration",
      type: "image",
      url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80",
      createdAt: now.toISOString(),
    },
    createdAt: pastDays(40),
    updatedAt: pastDays(3),
  },
  {
    id: "cd-5",
    title: "120 Hari Bebas Kafein & Hidup Sehat",
    description: "Menghitung durasi konsisten pola hidup sehat tanpa kafein.",
    targetAt: pastDays(42),
    targetType: "exact_time",
    direction: "count_up",
    categoryId: "cat-personal",
    tags: ["Holiday"],
    pinned: false,
    status: "Active",
    coverImage: {
      id: "cov-5",
      countdownId: "cd-5",
      name: "Healthy Lifestyle",
      type: "image",
      url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
      createdAt: now.toISOString(),
    },
    createdAt: pastDays(42),
    updatedAt: pastDays(5),
  },
  {
    id: "cd-6",
    title: "Penyerahan Laporan Keuangan Tengah Tahun",
    description: "Finalisasi neraca dan laba rugi semester pertama.",
    targetAt: pastDays(15),
    targetType: "exact_time",
    direction: "count_down",
    categoryId: "cat-kerja",
    tags: ["Milestone"],
    pinned: false,
    status: "Reached",
    reachedAt: pastDays(15),
    coverImage: {
      id: "cov-6",
      countdownId: "cd-6",
      name: "Finance Report",
      type: "image",
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
      createdAt: now.toISOString(),
    },
    createdAt: pastDays(60),
    updatedAt: pastDays(15),
  },
];

export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    countdownId: "cd-1",
    type: "created",
    description: "Membuat countdown 'Peluncuran Produk Enterprise Suite'",
    createdAt: pastDays(10),
  },
  {
    id: "act-2",
    countdownId: "cd-1",
    type: "linked_entity",
    description: "Menautkan ke Milestone 'Milestone Q3 Release Audit'",
    createdAt: pastDays(9),
  },
  {
    id: "act-3",
    countdownId: "cd-2",
    type: "created",
    description: "Membuat countdown 'Pernikahan Dhia & Partner'",
    createdAt: pastDays(30),
  },
  {
    id: "act-4",
    countdownId: "cd-6",
    type: "reached",
    description: "Target waktu tercapai dan status berubah menjadi Reached",
    createdAt: pastDays(15),
  },
];

interface CountdownState {
  countdowns: CountdownItem[];
  categories: Category[];
  tags: Tag[];
  activities: Activity[];
}

export function useCountdownStore() {
  const [state, setState] = useState<CountdownState>(() => {
    try {
      const saved = getRaw(COUNTDOWN_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.countdowns && Array.isArray(parsed.countdowns)) {
          return {
            countdowns: parsed.countdowns,
            categories: parsed.categories || DEFAULT_CATEGORIES,
            tags: parsed.tags || DEFAULT_TAGS,
            activities: parsed.activities || INITIAL_ACTIVITIES,
          };
        }
      }
    } catch (e) {
      console.error("Failed to load countdown store", e);
    }
    return {
      countdowns: INITIAL_COUNTDOWNS,
      categories: DEFAULT_CATEGORIES,
      tags: DEFAULT_TAGS,
      activities: INITIAL_ACTIVITIES,
    };
  });

  // Cross-app linked entity pool from calendar & project-manager
  const [externalEntities, setExternalEntities] = useState<
    Array<{ type: string; id: string; title: string }>
  >([]);

  useEffect(() => {
    try {
      setRaw(COUNTDOWN_STORAGE_KEY, JSON.stringify(state));
      // Dispatch storage event so other ecosystem widgets can refresh
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to save countdown store", e);
    }
  }, [state]);

  // Read linked entities from other apps (Project Manager, Calendar)
  useEffect(() => {
    const fetchEntities = () => {
      const pool: Array<{ type: string; id: string; title: string }> = [
        { type: "event", id: "evt-dhia-wedding", title: "Akad & Resepsi Pernikahan" },
        { type: "milestone", id: "ms-q3-release", title: "Milestone Q3 Release Audit" },
        { type: "project", id: "prj-cloud-mig", title: "Cloud ERP Modernization" },
        { type: "trip", id: "trip-sapporo", title: "Tiket Wisata Sapporo Winter" },
        { type: "goal", id: "goal-revenue-10m", title: "Target Omzet Rp 10 Miliar" },
      ];

      try {
        const pRaw = getRaw(PROJECT_STORAGE_KEY);
        if (pRaw) {
          const pData = JSON.parse(pRaw);
          if (pData.projects && Array.isArray(pData.projects)) {
            pData.projects.forEach((p: any) => {
              pool.push({ type: "project", id: p.id, title: p.title || p.name });
            });
          }
          if (pData.milestones && Array.isArray(pData.milestones)) {
            pData.milestones.forEach((m: any) => {
              pool.push({ type: "milestone", id: m.id, title: m.title || m.name });
            });
          }
        }

        const cRaw = getRaw(CALENDAR_STORAGE_KEY);
        if (cRaw) {
          const cData = JSON.parse(cRaw);
          if (cData.events && Array.isArray(cData.events)) {
            cData.events.forEach((ev: any) => {
              pool.push({ type: "event", id: ev.id, title: ev.title });
            });
          }
        }
      } catch (e) {
        // ignore parsing errors
      }

      setExternalEntities(pool);
    };

    fetchEntities();
    window.addEventListener("storage", fetchEntities);
    return () => window.removeEventListener("storage", fetchEntities);
  }, []);

  // Check past countdowns automatically according to business rules (§3.3 & §8)
  useEffect(() => {
    const checkPastCountdowns = () => {
      const currentTime = new Date().getTime();
      let hasChanges = false;
      const newActivities: Activity[] = [];

      const updatedCountdowns = state.countdowns.map((item) => {
        if (item.status !== "Active" || item.direction === "count_up") {
          return item;
        }

        const targetTime = new Date(item.targetAt).getTime();
        if (targetTime <= currentTime) {
          // If autoSwitchCountUp is true, switch direction
          if (item.autoSwitchCountUp) {
            hasChanges = true;
            newActivities.push({
              id: `act-${Date.now()}-${item.id}`,
              countdownId: item.id,
              type: "direction_switched",
              description: `Target tercapai. Countdown otomatis beralih ke mode Count Up (menghitung maju).`,
              createdAt: new Date().toISOString(),
            });
            return {
              ...item,
              direction: "count_up" as CountdownDirection,
              updatedAt: new Date().toISOString(),
            };
          }

          // If recurring, calculate next occurrence
          if (item.recurrence) {
            hasChanges = true;
            const nextTarget = computeNextRecurrence(item.targetAt, item.recurrence);
            newActivities.push({
              id: `act-${Date.now()}-${item.id}`,
              countdownId: item.id,
              type: "recurrence_renewed",
              description: `Target tercapai. Dibuat jadwal periode berikutnya pada ${new Date(nextTarget).toLocaleDateString("id-ID")}`,
              createdAt: new Date().toISOString(),
            });
            return {
              ...item,
              targetAt: nextTarget,
              updatedAt: new Date().toISOString(),
            };
          }

          // Otherwise mark as Reached
          hasChanges = true;
          newActivities.push({
            id: `act-${Date.now()}-${item.id}`,
            countdownId: item.id,
            type: "reached",
            description: `Target waktu telah tercapai. Status diubah menjadi Reached.`,
            createdAt: new Date().toISOString(),
          });
          return {
            ...item,
            status: "Reached" as const,
            reachedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }

        return item;
      });

      if (hasChanges) {
        setState((prev) => ({
          ...prev,
          countdowns: updatedCountdowns,
          activities: [...newActivities, ...prev.activities],
        }));
      }
    };

    // Run check once on load and every minute
    checkPastCountdowns();
    const interval = setInterval(checkPastCountdowns, 60000);
    return () => clearInterval(interval);
  }, [state.countdowns]);

  // Recurrence computation helper
  const computeNextRecurrence = (currentISO: string, rec: Recurrence): string => {
    const d = new Date(currentISO);
    const interval = rec.interval || 1;
    if (rec.type === "yearly") {
      d.setFullYear(d.getFullYear() + interval);
    } else if (rec.type === "monthly") {
      d.setMonth(d.getMonth() + interval);
    } else if (rec.type === "weekly") {
      d.setDate(d.getDate() + 7 * interval);
    } else {
      d.setDate(d.getDate() + interval);
    }
    return d.toISOString();
  };

  // Actions
  const addCountdown = useCallback(
    (input: Partial<CountdownItem> & { title: string; targetAt: string }) => {
      const nowISO = new Date().toISOString();
      const id = `cd-${Date.now()}`;
      const newItem: CountdownItem = {
        id,
        title: input.title.trim(),
        description: input.description?.trim() || "",
        targetAt: input.targetAt,
        targetType: input.targetType || "exact_time",
        direction: input.direction || "count_down",
        autoSwitchCountUp: input.autoSwitchCountUp || false,
        categoryId: input.categoryId || "cat-kerja",
        tags: input.tags || [],
        coverImage: input.coverImage,
        status: input.status || "Active",
        recurrence: input.recurrence,
        linkedEntity: input.linkedEntity,
        reminders: input.reminders || [],
        pinned: input.pinned || false,
        createdAt: nowISO,
        updatedAt: nowISO,
      };

      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        countdownId: id,
        type: "created",
        description: `Membuat countdown baru: "${newItem.title}"`,
        createdAt: nowISO,
      };

      setState((prev) => ({
        ...prev,
        countdowns: [newItem, ...prev.countdowns],
        activities: [newActivity, ...prev.activities],
      }));

      return newItem;
    },
    []
  );

  const updateCountdown = useCallback((id: string, updates: Partial<CountdownItem>) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const idx = prev.countdowns.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const oldItem = prev.countdowns[idx];
      const updatedItem: CountdownItem = {
        ...oldItem,
        ...updates,
        updatedAt: nowISO,
      };

      const activitiesToAdd: Activity[] = [];

      if (updates.status && updates.status !== oldItem.status) {
        activitiesToAdd.push({
          id: `act-${Date.now()}-${id}`,
          countdownId: id,
          type: "status_changed",
          oldValue: oldItem.status,
          newValue: updates.status,
          description: `Status diubah dari ${oldItem.status} menjadi ${updates.status}`,
          createdAt: nowISO,
        });
      } else {
        activitiesToAdd.push({
          id: `act-${Date.now()}-${id}`,
          countdownId: id,
          type: "edited",
          description: `Memperbarui detail countdown "${updatedItem.title}"`,
          createdAt: nowISO,
        });
      }

      const updatedList = [...prev.countdowns];
      updatedList[idx] = updatedItem;

      return {
        ...prev,
        countdowns: updatedList,
        activities: [...activitiesToAdd, ...prev.activities],
      };
    });
  }, []);

  const duplicateCountdown = useCallback((id: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const target = prev.countdowns.find((c) => c.id === id);
      if (!target) return prev;

      const newId = `cd-${Date.now()}`;
      const clone: CountdownItem = {
        ...target,
        id: newId,
        title: `${target.title} (Salinan)`,
        pinned: false,
        createdAt: nowISO,
        updatedAt: nowISO,
        reachedAt: undefined,
        archivedAt: undefined,
        status: "Active",
      };

      const newActivity: Activity = {
        id: `act-${Date.now()}`,
        countdownId: newId,
        type: "created",
        description: `Menduplikasi countdown dari "${target.title}"`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        countdowns: [clone, ...prev.countdowns],
        activities: [newActivity, ...prev.activities],
      };
    });
  }, []);

  const togglePin = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      countdowns: prev.countdowns.map((c) =>
        c.id === id ? { ...c, pinned: !c.pinned, updatedAt: new Date().toISOString() } : c
      ),
    }));
  }, []);

  const archiveCountdown = useCallback((id: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const target = prev.countdowns.find((c) => c.id === id);
      if (!target) return prev;

      const newAct: Activity = {
        id: `act-${Date.now()}-${id}`,
        countdownId: id,
        type: "archived",
        description: `Mengarsipkan countdown "${target.title}"`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        countdowns: prev.countdowns.map((c) =>
          c.id === id ? { ...c, status: "Archived", archivedAt: nowISO, updatedAt: nowISO } : c
        ),
        activities: [newAct, ...prev.activities],
      };
    });
  }, []);

  const restoreCountdown = useCallback((id: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const target = prev.countdowns.find((c) => c.id === id);
      if (!target) return prev;

      const newAct: Activity = {
        id: `act-${Date.now()}-${id}`,
        countdownId: id,
        type: "restored",
        description: `Mengembalikan countdown "${target.title}" dari arsip`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        countdowns: prev.countdowns.map((c) =>
          c.id === id
            ? {
                ...c,
                status: "Active",
                archivedAt: undefined,
                updatedAt: nowISO,
              }
            : c
        ),
        activities: [newAct, ...prev.activities],
      };
    });
  }, []);

  const deleteCountdown = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      countdowns: prev.countdowns.filter((c) => c.id !== id),
      activities: prev.activities.filter((a) => a.countdownId !== id),
    }));
  }, []);

  const convertDirection = useCallback((id: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const target = prev.countdowns.find((c) => c.id === id);
      if (!target) return prev;
      const nextDir: CountdownDirection =
        target.direction === "count_down" ? "count_up" : "count_down";

      const newAct: Activity = {
        id: `act-${Date.now()}-${id}`,
        countdownId: id,
        type: "direction_switched",
        description: `Mengubah arah countdown menjadi ${nextDir === "count_up" ? "Count Up" : "Count Down"}`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        countdowns: prev.countdowns.map((c) =>
          c.id === id ? { ...c, direction: nextDir, updatedAt: nowISO } : c
        ),
        activities: [newAct, ...prev.activities],
      };
    });
  }, []);

  const linkEntity = useCallback((id: string, entity: LinkedEntity) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const target = prev.countdowns.find((c) => c.id === id);
      if (!target) return prev;

      const newAct: Activity = {
        id: `act-${Date.now()}-${id}`,
        countdownId: id,
        type: "linked_entity",
        description: `Menautkan ke entitas eksternal ${entity.entityType.toUpperCase()}: ${entity.entityTitle || entity.entityId}`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        countdowns: prev.countdowns.map((c) =>
          c.id === id ? { ...c, linkedEntity: entity, updatedAt: nowISO } : c
        ),
        activities: [newAct, ...prev.activities],
      };
    });
  }, []);

  const unlinkEntity = useCallback((id: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const target = prev.countdowns.find((c) => c.id === id);
      if (!target) return prev;

      const newAct: Activity = {
        id: `act-${Date.now()}-${id}`,
        countdownId: id,
        type: "linked_entity",
        description: `Melepaskan tautan entitas eksternal`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        countdowns: prev.countdowns.map((c) =>
          c.id === id ? { ...c, linkedEntity: undefined, updatedAt: nowISO } : c
        ),
        activities: [newAct, ...prev.activities],
      };
    });
  }, []);

  const addCategory = useCallback((name: string, color: string, icon: string = "Tag") => {
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      color,
      icon,
    };
    setState((prev) => ({
      ...prev,
      categories: [...prev.categories, newCat],
    }));
  }, []);

  const addTag = useCallback((name: string, color: string) => {
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: name.trim(),
      color,
    };
    setState((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }));
  }, []);

  // Compute Ecosystem Statistics (§17)
  const statistics = useMemo(() => {
    const total = state.countdowns.length;
    const active = state.countdowns.filter((c) => c.status === "Active").length;
    const reached = state.countdowns.filter((c) => c.status === "Reached").length;
    const cancelled = state.countdowns.filter((c) => c.status === "Cancelled").length;
    const archived = state.countdowns.filter((c) => c.status === "Archived").length;

    const nowMs = new Date().getTime();
    const in7d = nowMs + 7 * 86400000;
    const in30d = nowMs + 30 * 86400000;

    const upcoming7Days = state.countdowns.filter((c) => {
      if (c.status !== "Active" || c.direction === "count_up") return false;
      const t = new Date(c.targetAt).getTime();
      return t >= nowMs && t <= in7d;
    }).length;

    const upcoming30Days = state.countdowns.filter((c) => {
      if (c.status !== "Active" || c.direction === "count_up") return false;
      const t = new Date(c.targetAt).getTime();
      return t >= nowMs && t <= in30d;
    }).length;

    const recurringCount = state.countdowns.filter((c) => !!c.recurrence).length;
    const oneTimeCount = total - recurringCount;

    // Average Lead Time = AVG(targetAt - createdAt)
    let totalLeadTimeDays = 0;
    let validLeadItems = 0;
    state.countdowns.forEach((c) => {
      const start = new Date(c.createdAt).getTime();
      const target = new Date(c.targetAt).getTime();
      if (!isNaN(start) && !isNaN(target) && target > start) {
        totalLeadTimeDays += (target - start) / 86400000;
        validLeadItems++;
      }
    });
    const avgLeadTimeDays = validLeadItems > 0 ? Math.round(totalLeadTimeDays / validLeadItems) : 0;

    // Reached Rate = Reached / (Total - Cancelled - Archived)
    const eligibleCount = total - cancelled - archived;
    const reachedRate = eligibleCount > 0 ? Math.round((reached / eligibleCount) * 100) : 0;

    // Category breakdown
    const categoryDistribution: Record<string, { count: number; name: string; color: string }> = {};
    state.categories.forEach((cat) => {
      categoryDistribution[cat.id] = { count: 0, name: cat.name, color: cat.color };
    });
    state.countdowns.forEach((c) => {
      if (c.categoryId && categoryDistribution[c.categoryId]) {
        categoryDistribution[c.categoryId].count++;
      }
    });

    return {
      total,
      active,
      reached,
      cancelled,
      archived,
      upcoming7Days,
      upcoming30Days,
      recurringCount,
      oneTimeCount,
      avgLeadTimeDays,
      reachedRate,
      categoryDistribution,
    };
  }, [state.countdowns, state.categories]);

  return {
    countdowns: state.countdowns,
    categories: state.categories,
    tags: state.tags,
    activities: state.activities,
    externalEntities,
    statistics,
    templates: BUILT_IN_TEMPLATES,
    addCountdown,
    updateCountdown,
    duplicateCountdown,
    togglePin,
    archiveCountdown,
    restoreCountdown,
    deleteCountdown,
    convertDirection,
    linkEntity,
    unlinkEntity,
    addCategory,
    addTag,
  };
}
