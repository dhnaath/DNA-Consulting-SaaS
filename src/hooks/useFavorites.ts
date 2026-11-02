import { useState, useEffect, useCallback } from "react";
import { getRaw, setRaw } from "../core/rawStorage";

const STORAGE_KEY = "aio_favorites";
export const MAX_FAVORITES = 5;

const DEFAULT_FAVORITES: string[] = [];

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getRaw(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          const isLegacyDefault =
            Array.isArray(parsed) &&
            parsed.includes("/swot") &&
            parsed.includes("/bmc") &&
            parsed.includes("/portfolio");
          if (!isLegacyDefault && Array.isArray(parsed)) {
            return parsed.slice(0, MAX_FAVORITES);
          }
        }
      } catch (e) {
        // fallback
      }
    }
    return DEFAULT_FAVORITES;
  });

  // Keep state synchronized in real-time across all components
  useEffect(() => {
    const handleUpdate = (e?: any) => {
      try {
        if (e?.detail && Array.isArray(e.detail)) {
          setFavorites(e.detail.slice(0, MAX_FAVORITES));
          return;
        }
        const stored = getRaw(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setFavorites(parsed.slice(0, MAX_FAVORITES));
            return;
          }
        }
        setFavorites([]);
      } catch (err) {}
    };

    window.addEventListener("aio_favorites_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("aio_favorites_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const toggleFavorite = useCallback((path: string) => {
    setFavorites((prev) => {
      let next: string[];
      let message = "";

      if (prev.includes(path)) {
        next = prev.filter((p) => p !== path);
        message = "Dihapus dari Dock Bawah.";
      } else {
        if (prev.length >= MAX_FAVORITES) {
          message = `Maksimal ${MAX_FAVORITES} aplikasi di Dock Bawah. Hapus salah satu aplikasi dari dock terlebih dahulu.`;
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("aio_toast", { detail: message })
            );
          }, 0);
          return prev;
        }
        next = [...prev, path];
        message = `Ditambahkan ke Dock Bawah (${next.length}/${MAX_FAVORITES}).`;
      }

      try {
        setRaw(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}

      // Asynchronously notify other components outside React's render cycle
      setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("aio_toast", { detail: message })
        );
        window.dispatchEvent(
          new CustomEvent("aio_favorites_changed", { detail: next })
        );
      }, 0);

      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (path: string) => favorites.includes(path),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, maxFavorites: MAX_FAVORITES };
}

