import { useState, useCallback } from "react";
import { getRaw, setRaw } from "../core/rawStorage";

export function useMenuSettings() {
  const [enabledMenus, setEnabledMenus] = useState<Record<string, boolean>>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getRaw("aio_menu_settings");
        if (stored) return JSON.parse(stored);
      } catch (e) {}
    }
    return {};
  });

  const toggleMenu = useCallback((path: string) => {
    setEnabledMenus((prev) => {
      const next = { ...prev, [path]: prev[path] === false ? true : false };
      try {
        setRaw("aio_menu_settings", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  return { enabledMenus, setEnabledMenus, toggleMenu };
}
