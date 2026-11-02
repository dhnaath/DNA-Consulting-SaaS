import { useState } from "react";
import { useShellSections } from "@/app/shell-sections";

type QuadrantKey = "tl" | "tr" | "bl" | "br";

/**
 * Registers a matrix's four quadrants as shell sections so they appear both in
 * the left sidebar ("Di aplikasi ini") and as interactive header buttons.
 * Selecting a section highlights + scrolls to the matching quadrant.
 *
 * @param prefix unique per matrix, used to build the quadrant DOM id
 * @param quadrants the framework's quadrant definitions (needs `title`)
 */
export function useMatrixQuadrantFocus(
  prefix: string,
  quadrants: Record<QuadrantKey, { title: string }>
) {
  const [focusedQuadrant, setFocusedQuadrant] = useState<QuadrantKey | null>(null);
  const order: QuadrantKey[] = ["tl", "tr", "bl", "br"];

  useShellSections(
    order.map((key) => ({
      id: key,
      label: quadrants[key].title,
      active: focusedQuadrant === key,
      onSelect: () => {
        setFocusedQuadrant(key);
        document
          .getElementById(`q-${prefix}-${key}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      },
    }))
  );

  const quadrantId = (key: QuadrantKey) => `q-${prefix}-${key}`;

  return { focusedQuadrant, quadrantId };
}
