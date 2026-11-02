import { getRaw, setRaw } from "../core/rawStorage";

const STORAGE_KEY_PAGE = "aio_last_launcher_page";
const STORAGE_KEY_ACTIVE = "aio_last_active_app";

export function getLastLauncherPage(maxPages: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const val = getRaw(STORAGE_KEY_PAGE);
    if (val !== null) {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed < maxPages) {
        return parsed;
      }
    }
  } catch (e) {}
  return 0;
}

export function setLastLauncherPage(pageIndex: number, totalPages?: number): void {
  if (typeof window === "undefined") return;
  try {
    setRaw(STORAGE_KEY_PAGE, pageIndex.toString());
  } catch (e) {}
}

export function recordActiveApp(appPath: string, pageIndex?: number): void {
  if (typeof window === "undefined") return;
  try {
    setRaw(STORAGE_KEY_ACTIVE, appPath);
    window.dispatchEvent(new CustomEvent("aio_active_app_changed", { detail: appPath }));
    if (typeof pageIndex === "number") {
      setLastLauncherPage(pageIndex);
    }
  } catch (e) {}
}
