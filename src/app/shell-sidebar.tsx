import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

/**
 * ShellSidebar — lets any feature app render its OWN navigation / panel content
 * into the global left sidebar of AppShell (slot: #shellSidebarSlot).
 *
 * Usage inside a feature app:
 *   <ShellSidebar>
 *     ...app-specific sidebar content...
 *   </ShellSidebar>
 *
 * The content is portaled into the shell's left sidebar so every app gets a
 * contextual sidebar that matches its own data and controls. Apps that do not
 * register content fall back to a shell-generated contextual sidebar.
 */
type ShellSidebarCtxValue = {
  setHasAppSidebar: (has: boolean) => void;
};

const ShellSidebarCtx = createContext<ShellSidebarCtxValue | null>(null);

export const ShellSidebarProvider = ShellSidebarCtx.Provider;

export function ShellSidebar({ children }: { children: ReactNode }) {
  const ctx = useContext(ShellSidebarCtx);
  const [slot, setSlot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Effects run after the whole tree (including the shell's sidebar slot)
    // has been committed to the DOM, so the target exists here.
    setSlot(document.getElementById("shellSidebarSlot"));
    ctx?.setHasAppSidebar(true);
    return () => {
      ctx?.setHasAppSidebar(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!slot) return null;
  return createPortal(
    <div className="flex w-full min-h-0 flex-col">{children}</div>,
    slot,
  );
}
