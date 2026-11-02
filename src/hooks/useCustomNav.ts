import { useState, useEffect, useCallback } from "react";
import { getRaw, setRaw } from "../core/rawStorage";

export interface CustomMenuItem {
  id: string;
  label: string;
  path: string;
  type: "workspace" | "link" | "external";
  target?: string;
  description?: string;
  notes?: string;
  tasks?: { id: string; text: string; completed: boolean }[];
  links?: { id: string; title: string; url: string }[];
  createdAt: number;
  updatedAt: number;
}

export interface CustomCategory {
  id: string;
  title: string;
  isCollapsed?: boolean;
  items: CustomMenuItem[];
}

const STORAGE_KEY = "wira_custom_nav_folders";

const DEFAULT_CUSTOM_CATEGORIES: CustomCategory[] = [
  {
    id: "cat-strategis",
    title: "Inisiatif Khusus",
    isCollapsed: false,
    items: [
      {
        id: "item-riset-q3",
        label: "Analisis Pasar Q3",
        path: "/lainnya?id=item-riset-q3",
        type: "workspace",
        description: "Dokumen riset tren pasar, dinamika kompetitor, dan benchmarking industri.",
        notes: "# Analisis Pasar Q3\n\nFokus utama kuartal ini mencakup diversifikasi layanan konsultasi dan otomatisasi proses untuk efisiensi tim.",
        tasks: [
          { id: "t1", text: "Kumpulkan laporan survei industri", completed: true },
          { id: "t2", text: "Validasi metrik penetrasi pasar", completed: false },
          { id: "t3", text: "Finalisasi ringkasan eksekutif untuk klien", completed: false },
        ],
        links: [
          { id: "l1", title: "Data Riset BPS & Industri", url: "https://www.bps.go.id" },
        ],
        createdAt: Date.now() - 86400000 * 2,
        updatedAt: Date.now() - 86400000,
      },
      {
        id: "item-roadmap-2026",
        label: "Roadmap Kemitraan",
        path: "/lainnya?id=item-roadmap-2026",
        type: "workspace",
        description: "Rencana penjajakan aliansi strategis dan kolaborasi jangka panjang.",
        notes: "# Roadmap Kemitraan 2026\n\nTarget kolaborasi dengan 5 mitra korporasi teratas pada kuartal mendatang.",
        tasks: [
          { id: "t4", text: "Draft MoU standardisasi", completed: true },
          { id: "t5", text: "Penjadwalan audiensi direksi", completed: false },
        ],
        createdAt: Date.now() - 86400000,
        updatedAt: Date.now(),
      },
    ],
  },
  {
    id: "cat-arsip",
    title: "Folder Kerja Proyek",
    isCollapsed: false,
    items: [
      {
        id: "item-brief-desain",
        label: "Brief & Template Klien",
        path: "/lainnya?id=item-brief-desain",
        type: "workspace",
        description: "Kompilasi panduan gaya, pedoman merek, dan format presentasi konsultan.",
        notes: "Gunakan palet warna konsisten dan tipografi Inter untuk seluruh dokumen deliverables.",
        tasks: [
          { id: "t6", text: "Update logo klien di master slides", completed: true },
        ],
        createdAt: Date.now() - 86400000 * 3,
        updatedAt: Date.now() - 86400000 * 2,
      },
    ],
  },
];

export function useCustomNav() {
  const [categories, setCategories] = useState<CustomCategory[]>(() => {
    if (typeof window === "undefined") return DEFAULT_CUSTOM_CATEGORIES;
    try {
      const stored = getRaw(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error reading custom nav folders:", e);
    }
    return DEFAULT_CUSTOM_CATEGORIES;
  });

  const persistCategories = useCallback((updated: CustomCategory[]) => {
    setCategories(updated);
    if (typeof window !== "undefined") {
      try {
        setRaw(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("customNavChanged"));
      } catch (e) {
        console.error("Error saving custom nav folders:", e);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = getRaw(STORAGE_KEY);
        if (stored) {
          setCategories(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("customNavChanged", handleStorageChange);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("customNavChanged", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const addCategory = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const newCategory: CustomCategory = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: trimmed,
      isCollapsed: false,
      items: [],
    };
    persistCategories([...categories, newCategory]);
  }, [categories, persistCategories]);

  const renameCategory = useCallback((categoryId: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    const updated = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, title: trimmed } : cat
    );
    persistCategories(updated);
  }, [categories, persistCategories]);

  const deleteCategory = useCallback((categoryId: string) => {
    const updated = categories.filter((cat) => cat.id !== categoryId);
    persistCategories(updated);
  }, [categories, persistCategories]);

  const toggleCollapse = useCallback((categoryId: string) => {
    const updated = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, isCollapsed: !cat.isCollapsed } : cat
    );
    persistCategories(updated);
  }, [categories, persistCategories]);

  const addMenuItem = useCallback(
    (
      categoryId: string,
      params: {
        label: string;
        type?: "workspace" | "link" | "external";
        target?: string;
        description?: string;
      }
    ) => {
      const trimmedLabel = params.label.trim();
      if (!trimmedLabel) return;

      const itemId = `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const itemType = params.type || "workspace";

      let finalPath = `/lainnya?id=${itemId}`;
      if (itemType === "link" && params.target) {
        finalPath = params.target;
      } else if (itemType === "external" && params.target) {
        finalPath = params.target;
      }

      const newItem: CustomMenuItem = {
        id: itemId,
        label: trimmedLabel,
        path: finalPath,
        type: itemType,
        target: params.target,
        description: params.description || "",
        notes: `# ${trimmedLabel}\n\nCatatan kerja dan dokumentasi untuk ${trimmedLabel}.`,
        tasks: [],
        links: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updated = categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            isCollapsed: false,
            items: [...cat.items, newItem],
          };
        }
        return cat;
      });

      persistCategories(updated);
      return newItem;
    },
    [categories, persistCategories]
  );

  const deleteMenuItem = useCallback(
    (categoryId: string, itemId: string) => {
      const updated = categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.filter((item) => item.id !== itemId),
          };
        }
        return cat;
      });
      persistCategories(updated);
    },
    [categories, persistCategories]
  );

  const updateMenuItem = useCallback(
    (
      categoryId: string,
      itemId: string,
      updates: Partial<CustomMenuItem>
    ) => {
      const updated = categories.map((cat) => {
        if (cat.id === categoryId) {
          return {
            ...cat,
            items: cat.items.map((item) =>
              item.id === itemId
                ? { ...item, ...updates, updatedAt: Date.now() }
                : item
            ),
          };
        }
        return cat;
      });
      persistCategories(updated);
    },
    [categories, persistCategories]
  );

  const findItemById = useCallback(
    (itemId: string): { item: CustomMenuItem; category: CustomCategory } | null => {
      for (const cat of categories) {
        const found = cat.items.find((i) => i.id === itemId);
        if (found) {
          return { item: found, category: cat };
        }
      }
      return null;
    },
    [categories]
  );

  const findItemByPath = useCallback(
    (pathnameWithQuery: string): { item: CustomMenuItem; category: CustomCategory } | null => {
      for (const cat of categories) {
        const found = cat.items.find(
          (i) =>
            i.path === pathnameWithQuery ||
            (pathnameWithQuery.includes("id=") &&
              i.id &&
              pathnameWithQuery.includes(i.id))
        );
        if (found) {
          return { item: found, category: cat };
        }
      }
      return null;
    },
    [categories]
  );

  return {
    categories,
    addCategory,
    renameCategory,
    deleteCategory,
    toggleCollapse,
    addMenuItem,
    deleteMenuItem,
    updateMenuItem,
    findItemById,
    findItemByPath,
  };
}
