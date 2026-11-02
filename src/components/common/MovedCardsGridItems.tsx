import React from "react";
import { MBACard } from "./MBACard";
import { useFavorites } from "@/hooks/useFavorites";
import {
  LauncherPageProvider,
  getLauncherPageOption,
  resolveMovedCardIcon,
  useCardPageMover,
} from "@/hooks/useCardPageMover";

export function MovedCardsGridItems({
  pageId,
  searchQuery = "",
  cardHeightClass,
}: {
  pageId: string;
  searchQuery?: string;
  cardHeightClass?: string;
}) {
  const { getCardsMovedIntoPage } = useCardPageMover();
  const { isFavorite, toggleFavorite } = useFavorites();

  const movedIn = getCardsMovedIntoPage(pageId).filter((card) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      card.title.toLowerCase().includes(q) ||
      (card.shortDesc && card.shortDesc.toLowerCase().includes(q)) ||
      (card.badge && card.badge.toLowerCase().includes(q)) ||
      (card.features &&
        card.features.some((f) => f.title.toLowerCase().includes(q)))
    );
  });

  if (movedIn.length === 0) return null;

  return (
    <>
      {movedIn.map((card) => {
        const Icon = resolveMovedCardIcon(card);
        const originMeta = getLauncherPageOption(card.originPageId);
        const displayBadge = card.badge
          ? `${card.badge} • Dari ${originMeta?.shortLabel || "Page Lain"}`
          : `Dari ${originMeta?.shortLabel || "Page Lain"}`;

        return (
          <MBACard
            key={card.cardKey}
            title={card.title}
            to={card.to}
            icon={Icon}
            badge={displayBadge}
            shortDesc={card.shortDesc}
            gradient={card.gradient}
            accentGradient={card.accentGradient}
            features={card.features || []}
            isFav={isFavorite(card.to)}
            toggleFavorite={toggleFavorite}
            cardHeightClass={cardHeightClass}
            movedRecord={card}
          />
        );
      })}
    </>
  );
}

export function MovedCardsSection({
  pageId,
  searchQuery = "",
  className = "",
}: {
  pageId: string;
  searchQuery?: string;
  className?: string;
}) {
  const { getCardsMovedIntoPage } = useCardPageMover();
  const movedIn = getCardsMovedIntoPage(pageId);

  if (movedIn.length === 0) return null;

  return (
    <LauncherPageProvider pageId={pageId}>
      <div
        className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5 ${className}`}
      >
        <MovedCardsGridItems pageId={pageId} searchQuery={searchQuery} />
      </div>
    </LauncherPageProvider>
  );
}
