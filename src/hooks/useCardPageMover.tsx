import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Briefcase,
  Coins,
  Gem,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  Layers,
  Palette,
  Scale,
  Store,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import { getAppMetaByRoute } from "@/utils/appLookup";
import { getRaw, setRaw } from "../core/rawStorage";

const MOVED_CARDS_STORAGE_KEY = "aio_moved_cards_v1";

export interface LauncherPageOption {
  id: string;
  pageNumber: number;
  label: string;
  shortLabel: string;
  badge: string;
  icon: LucideIcon;
}

export const LAUNCHER_PAGE_OPTIONS: LauncherPageOption[] = [
  {
    id: "valuetreated",
    pageNumber: 1,
    label: "Value Treated",
    shortLabel: "Value Treated",
    badge: "10 Disiplin",
    icon: Gem,
  },
  {
    id: "commodity",
    pageNumber: 2,
    label: "Market Price Monitor",
    shortLabel: "Market Price Monitor",
    badge: "Makro & Nasional",
    icon: TrendingUp,
  },
  {
    id: "financial",
    pageNumber: 3,
    label: "Financial Planning and Wealth Management",
    shortLabel: "Financial & Wealth",
    badge: "5 Tahapan",
    icon: Coins,
  },
  {
    id: "mode_business",
    pageNumber: 4,
    label: "Business Administration and Operations Management",
    shortLabel: "Business & Operations",
    badge: "33 Modul",
    icon: Store,
  },
  {
    id: "mode_employment",
    pageNumber: 5,
    label: "Productivity Workspace and Workflow Systems",
    shortLabel: "Productivity & Workflow",
    badge: "Produktivitas",
    icon: Briefcase,
  },
  {
    id: "mode_creative",
    pageNumber: 6,
    label: "Creative Workspace and Media Production",
    shortLabel: "Creative & Media",
    badge: "Studio Kreatif",
    icon: Palette,
  },
  {
    id: "mode_research",
    pageNumber: 7,
    label: "Research Foundations and Reference Frameworks",
    shortLabel: "Research & Frameworks",
    badge: "Riset & Referensi",
    icon: GraduationCap,
  },
  {
    id: "mode_sharia",
    pageNumber: 8,
    label: "Islamic Principles and Sharia Values",
    shortLabel: "Islamic & Sharia",
    badge: "Muamalah Syariah",
    icon: Scale,
  },
  {
    id: "mode_personal",
    pageNumber: 9,
    label: "Personal Life Management",
    shortLabel: "Personal Life",
    badge: "Personal",
    icon: Heart,
  },
  {
    id: "mode_family",
    pageNumber: 10,
    label: "Family Records and Household Planning",
    shortLabel: "Family & Household",
    badge: "Keluarga & Rumah",
    icon: Home,
  },
  {
    id: "mode_public_affairs",
    pageNumber: 11,
    label: "Public Relations and Policy Affairs",
    shortLabel: "Public & Policy Affairs",
    badge: "Publik & Kebijakan",
    icon: Landmark,
  },
  {
    id: "mode_networks",
    pageNumber: 12,
    label: "Contact Directory and Social Networks",
    shortLabel: "Contacts & Networks",
    badge: "Direktori & Relasi",
    icon: Users,
  },
];

export interface MovedCardFeatureSnapshot {
  title: string;
  to: string;
  desc?: string;
}

export interface MovedCardRecord {
  cardKey: string;
  originPageId: string;
  targetPageId: string;
  title: string;
  to: string;
  badge?: string;
  shortDesc?: string;
  gradient?: string;
  accentGradient?: string;
  features?: MovedCardFeatureSnapshot[];
  movedAt: number;
}

export interface MoveCardInput {
  cardKey?: string;
  originPageId: string;
  title: string;
  to: string;
  badge?: string;
  shortDesc?: string;
  gradient?: string;
  accentGradient?: string;
  icon?: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  features?: MovedCardFeatureSnapshot[];
}

// Session-level icon cache so exact card icons persist immediately on move
const sessionCardIconCache = new Map<
  string,
  React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
>();

export function registerCardIcon(
  cardKey: string,
  icon?: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>
) {
  if (cardKey && icon) {
    sessionCardIconCache.set(cardKey, icon);
  }
}

export function resolveMovedCardIcon(
  record: MovedCardRecord
): React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }> {
  const cached = sessionCardIconCache.get(record.cardKey);
  if (cached) return cached;
  return getAppMetaByRoute(record.to).icon;
}

export function makeMovedCardKey(originPageId: string, to: string, title: string): string {
  return `${originPageId}::${to.trim()}::${title.trim()}`;
}

export function getLauncherPageOption(pageId?: string | null): LauncherPageOption | undefined {
  if (!pageId) return undefined;
  return LAUNCHER_PAGE_OPTIONS.find((p) => p.id === pageId);
}

const LauncherPageContext = createContext<string | null>(null);

export function LauncherPageProvider({
  pageId,
  children,
}: {
  pageId: string;
  children: React.ReactNode;
}) {
  return (
    <LauncherPageContext.Provider value={pageId}>
      {children}
    </LauncherPageContext.Provider>
  );
}

export function useCurrentLauncherPage(fallbackPageId?: string): string | null {
  const ctxPageId = useContext(LauncherPageContext);
  return ctxPageId ?? fallbackPageId ?? null;
}

function normalizePageId(pageId: string): string {
  return pageId === "tools" ? "mode_business" : pageId;
}

function readStoredMovedCards(): MovedCardRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = getRaw(MOVED_CARDS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter(
          (item) =>
            item &&
            typeof item.cardKey === "string" &&
            typeof item.originPageId === "string" &&
            typeof item.targetPageId === "string" &&
            typeof item.title === "string" &&
            typeof item.to === "string"
        )
        .map((item) => {
          const originPageId = normalizePageId(item.originPageId);
          const targetPageId = normalizePageId(item.targetPageId);
          const cardKey =
            originPageId !== item.originPageId
              ? makeMovedCardKey(originPageId, item.to, item.title)
              : item.cardKey;
          return {
            ...item,
            cardKey,
            originPageId,
            targetPageId,
          };
        })
        .filter((item) => item.originPageId !== item.targetPageId);
    }
  } catch {}
  return [];
}

function notifyMovedCardsChanged(next: MovedCardRecord[], toastMessage?: string) {
  try {
    setRaw(MOVED_CARDS_STORAGE_KEY, JSON.stringify(next));
  } catch {}

  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent("aio_moved_cards_changed", { detail: next })
    );
    window.dispatchEvent(new Event("resize"));
    if (toastMessage) {
      window.dispatchEvent(
        new CustomEvent("aio_toast", { detail: toastMessage })
      );
    }
  }, 0);
}

export function navigateToLauncherPage(targetPageId: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("aio_navigate_launcher_page", { detail: targetPageId })
  );
}

export function useCardPageMover() {
  const [movedCards, setMovedCards] = useState<MovedCardRecord[]>(() =>
    readStoredMovedCards()
  );

  useEffect(() => {
    const handleSync = (e?: any) => {
      if (e?.detail && Array.isArray(e.detail)) {
        setMovedCards(e.detail);
        return;
      }
      setMovedCards(readStoredMovedCards());
    };

    window.addEventListener("aio_moved_cards_changed", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("aio_moved_cards_changed", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const moveCardToPage = useCallback(
    (input: MoveCardInput, targetPageId: string, openTargetPage = false) => {
      const cardKey =
        input.cardKey ||
        makeMovedCardKey(input.originPageId, input.to, input.title);

      if (input.icon) {
        registerCardIcon(cardKey, input.icon);
      }

      const targetMeta = getLauncherPageOption(targetPageId);
      const targetName = targetMeta?.shortLabel || targetPageId;

      setMovedCards((prev) => {
        const existing = prev.find((c) => c.cardKey === cardKey);
        const trueOriginPageId = existing?.originPageId || input.originPageId;

        let next: MovedCardRecord[];
        let message: string;

        if (targetPageId === trueOriginPageId) {
          next = prev.filter((c) => c.cardKey !== cardKey);
          const originMeta = getLauncherPageOption(trueOriginPageId);
          message = `"${input.title}" dikembalikan ke page asal (${originMeta?.shortLabel || trueOriginPageId}).`;
        } else {
          const record: MovedCardRecord = {
            cardKey,
            originPageId: trueOriginPageId,
            targetPageId,
            title: input.title,
            to: input.to,
            badge: input.badge ?? existing?.badge,
            shortDesc: input.shortDesc ?? existing?.shortDesc,
            gradient: input.gradient ?? existing?.gradient,
            accentGradient: input.accentGradient ?? existing?.accentGradient,
            features: input.features ?? existing?.features ?? [],
            movedAt: Date.now(),
          };
          next = [...prev.filter((c) => c.cardKey !== cardKey), record];
          message = `"${input.title}" dipindahkan ke ${targetName}.`;
        }

        notifyMovedCardsChanged(next, message);
        return next;
      });

      if (openTargetPage) {
        setTimeout(() => {
          navigateToLauncherPage(targetPageId);
        }, 40);
      }
    },
    []
  );

  const restoreCardToOrigin = useCallback((cardKey: string, title?: string) => {
    setMovedCards((prev) => {
      const existing = prev.find((c) => c.cardKey === cardKey);
      if (!existing) return prev;
      const originMeta = getLauncherPageOption(existing.originPageId);
      const next = prev.filter((c) => c.cardKey !== cardKey);
      notifyMovedCardsChanged(
        next,
        `"${title || existing.title}" dikembalikan ke ${originMeta?.shortLabel || "page asal"}.`
      );
      return next;
    });
  }, []);

  const resetAllMovedCards = useCallback(() => {
    setMovedCards([]);
    notifyMovedCardsChanged([], "Seluruh susunan kotak menu dikembalikan ke page asal.");
  }, []);

  const isCardMovedOut = useCallback(
    (originPageId: string | null | undefined, to: string, title: string) => {
      if (!originPageId) return false;
      const key = makeMovedCardKey(originPageId, to, title);
      return movedCards.some(
        (c) => c.cardKey === key && c.targetPageId !== originPageId
      );
    },
    [movedCards]
  );

  const getMovedRecord = useCallback(
    (cardKey?: string | null) => {
      if (!cardKey) return undefined;
      return movedCards.find((c) => c.cardKey === cardKey);
    },
    [movedCards]
  );

  const getCardsMovedIntoPage = useCallback(
    (pageId: string | null | undefined) => {
      if (!pageId) return [];
      return movedCards.filter(
        (c) => c.targetPageId === pageId && c.originPageId !== pageId
      );
    },
    [movedCards]
  );

  const getPageCountDelta = useCallback(
    (pageId: string | null | undefined) => {
      if (!pageId) return 0;
      const movedIn = movedCards.filter(
        (c) => c.targetPageId === pageId && c.originPageId !== pageId
      ).length;
      const movedOut = movedCards.filter(
        (c) => c.originPageId === pageId && c.targetPageId !== pageId
      ).length;
      return movedIn - movedOut;
    },
    [movedCards]
  );

  return useMemo(
    () => ({
      movedCards,
      moveCardToPage,
      restoreCardToOrigin,
      resetAllMovedCards,
      isCardMovedOut,
      getMovedRecord,
      getCardsMovedIntoPage,
      getPageCountDelta,
    }),
    [
      movedCards,
      moveCardToPage,
      restoreCardToOrigin,
      resetAllMovedCards,
      isCardMovedOut,
      getMovedRecord,
      getCardsMovedIntoPage,
      getPageCountDelta,
    ]
  );
}

export function adjustCategoryTabsCount<
  T extends { id: any; label: string; count: number }
>(tabs: readonly T[], delta: number): T[] {
  if (delta === 0) return [...tabs];
  return tabs.map((tab) =>
    tab.id === "all"
      ? { ...tab, count: Math.max(0, tab.count + delta) }
      : tab
  );
}
