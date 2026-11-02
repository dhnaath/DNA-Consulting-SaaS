import { useState } from "react";

export function useDeletedItems(key: string) {
  const [deletedIds, setDeletedIds] = useState<string[]>(() => {
    try {
      if (typeof window !== "undefined") {
        const item = typeof window !== "undefined" ? localStorage.getItem(key) : null;
        return item ? JSON.parse(item) : [];
      }
      return [];
    } catch {
      return [];
    }
  });

  const markDeleted = (id: string | number) => {
    const stringId = String(id);
    if (!deletedIds.includes(stringId)) {
      const newIds = [...deletedIds, stringId];
      setDeletedIds(newIds);
      localStorage.setItem(key, JSON.stringify(newIds));
    }
  };

  return { deletedIds, markDeleted };
}
