import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type MutableRefObject,
} from "react";
import type { LucideIcon } from "lucide-react";

/**
 * A single in-app section / view that a feature app can publish to the shell.
 *
 * The shell renders these BOTH in the left sidebar ("Di aplikasi ini") and as up
 * to 5 interactive buttons in the generated header band — so the header is a real
 * elaboration of the sidebar, and clicking a button switches the app's section.
 */
export type ShellSection = {
  id: string;
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  /** Called when the user picks this section from the sidebar or header. */
  onSelect: () => void;
};

type ShellSectionsCtxValue = {
  /** Latest sections, read at render + click time (never stale). */
  sectionsRef: MutableRefObject<ShellSection[]>;
  /** Ask the shell to re-render after the section list changes. */
  bump: () => void;
};

const ShellSectionsCtx = createContext<ShellSectionsCtxValue | null>(null);

export const ShellSectionsProvider = ShellSectionsCtx.Provider;

/**
 * useShellSections — publish this app's own sections/views to the shell.
 *
 *   useShellSections([
 *     { id: "vendor", label: "Vendor & Pemasok", active: activeId === "vendor",
 *       onSelect: () => setActiveId("vendor") },
 *     ...
 *   ]);
 *
 * The freshest closures are kept in a ref (updated every render), and the shell
 * is asked to re-render only when the section *shape* (ids/labels/active) changes.
 * This avoids stale-closure bugs and per-render update loops. On unmount the
 * sections are cleared so the shell falls back to its generated sidebar/header.
 */
export function useShellSections(sections: ShellSection[]) {
  const ctx = useContext(ShellSectionsCtx);

  // Always keep the newest array (with fresh onSelect closures) available.
  const latest = useRef(sections);
  latest.current = sections;
  if (ctx) ctx.sectionsRef.current = sections;

  const signature = sections
    .map((s) => `${s.id}\u0000${s.label}\u0000${s.active ? 1 : 0}`)
    .join("|");

  // Publish to the shell whenever the section *shape* changes. Populating the
  // ref here (not only during render) makes this survive React StrictMode's
  // simulated unmount/remount, which does not re-render the component.
  useEffect(() => {
    if (!ctx) return;
    ctx.sectionsRef.current = latest.current;
    ctx.bump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  // Clear only on real unmount so the next app starts from a clean slate.
  useEffect(() => {
    return () => {
      if (!ctx) return;
      ctx.sectionsRef.current = [];
      ctx.bump();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * <ShellSections sections={...} /> — a renderless component that publishes an
 * app's sections to the shell. Place it INSIDE <AppShell> (as a child) when the
 * component that knows the sections is the route wrapper that renders AppShell
 * itself (and therefore sits above the sections provider).
 *
 *   <AppShell title="...">
 *     <ShellSections sections={[{ id, label, active, onSelect }, ...]} />
 *     ...app content...
 *   </AppShell>
 */
export function ShellSections({ sections }: { sections: ShellSection[] }) {
  useShellSections(sections);
  return null;
}
