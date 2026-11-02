import { useState, useMemo, useEffect } from "react";
import {
  Gem,
  Search,
  X,
} from "lucide-react";
import { HeaderNavPills, ShellHeader } from "@/app/shell-header";
import { MBACard } from "@/components/common/MBACard";
import { MovedCardsGridItems } from "@/components/common/MovedCardsGridItems";
import {
  LauncherPageProvider,
  useCurrentLauncherPage,
} from "@/hooks/useCardPageMover";
import {
  JENJANG_LEVELS,
  CURRICULUM_DISCIPLINES,
} from "@/features/curated/curriculumData";
import { getCurriculumCategoryGroups } from "@/features/curated/curriculumCategories";

interface ValueTreatedSectionProps {
  favorites: string[];
  toggleFavorite: (to: string) => void;
  getGradient?: (title: string) => string;
}

export function ValueTreatedSection({
  favorites,
  toggleFavorite,
}: ValueTreatedSectionProps) {
  // 5 Jenjang Level SKS (Default: 2 = Matrikulasi)
  const [activeJenjangId, setActiveJenjangId] = useState<number>(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryOnlyMode, setCategoryOnlyMode] = useState<boolean>(true);
  const pageId = useCurrentLauncherPage("valuetreated") || "valuetreated";

  const currentJenjang = useMemo(() => {
    return JENJANG_LEVELS.find((j) => j.id === activeJenjangId) || JENJANG_LEVELS[0];
  }, [activeJenjangId]);

  const q = searchQuery.toLowerCase().trim();

  // 10 Bidang Value tetap ada, fitur menyesuaikan dengan activeJenjangId
  const filteredDisciplines = useMemo(() => {
    return CURRICULUM_DISCIPLINES.filter((disc) => {
      if (!q) return true;
      const features = disc.featuresByLevel[activeJenjangId] || [];
      const matchesTitle = disc.title.toLowerCase().includes(q);
      const matchesSubtitle = disc.subtitle.toLowerCase().includes(q);
      const matchesFeature = features.some((f) => f.toLowerCase().includes(q));
      return matchesTitle || matchesSubtitle || matchesFeature;
    });
  }, [activeJenjangId, q]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
    return () => cancelAnimationFrame(id);
  }, [activeJenjangId, filteredDisciplines.length]);

  return (
    <LauncherPageProvider pageId={pageId}>
    <div className="w-full flex flex-col items-center font-sans space-y-4">
      {/* Portaled ShellHeader Filter Pills di Bar Atas Kanan */}
      <ShellHeader>
        <HeaderNavPills
          items={JENJANG_LEVELS.map((jenjang) => ({
            id: jenjang.id,
            label: jenjang.name,
            count: jenjang.count,
            title: `${jenjang.name} (${jenjang.count} Fitur)`,
          }))}
          activeId={activeJenjangId}
          onSelect={(id) => setActiveJenjangId(id)}
        />
      </ShellHeader>

      {/* Title & Description */}
      <div className="text-center max-w-3xl mx-auto space-y-1">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-center justify-center gap-2.5">
          <Gem className="size-7 text-amber-500 shrink-0" />
          <span>Struktur Silabus Nilai & Kurikulum Terapan</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Pilih salah satu dari <strong>5 Jenjang Pembelajaran</strong>. Ke-10 bidang nilai di bawahnya akan secara otomatis menyesuaikan daftar fitur materinya.
        </p>
      </div>

      {/* Info Context Bar, Category Mode Toggle & Search */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            Jenjang Aktif: {currentJenjang.name}
          </span>
          <span>•</span>
          <span className="hidden sm:inline">{currentJenjang.desc}</span>
        </div>

        {/* Quick Search in Features */}
        <div className="relative w-full sm:w-72 shrink-0">
            <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Cari materi di ${currentJenjang.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2 size-5 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer rounded-full hover:bg-muted"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

      {/* Konten Grid: 10 BIDANG TETAP (2x5), UKURAN KOTAK MENU SERAGAM DI SEMUA JENJANG */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4.5 sm:gap-5">
        {filteredDisciplines.map((disc) => {
          const features = disc.featuresByLevel[activeJenjangId] || [];
          const routePath = `/kurasi/${disc.slug}`;
          const isCategoryJenjang = activeJenjangId >= 3;
          const categoryGroups = isCategoryJenjang
            ? getCurriculumCategoryGroups(disc.slug, activeJenjangId, features).map((group) => ({
                id: group.id,
                categoryNumber: group.categoryNumber,
                name: group.name,
                items: group.items.map((featName) => ({
                  title: featName,
                  to: routePath,
                })),
              }))
            : undefined;

          return (
            <MBACard
              key={`${disc.id}-${activeJenjangId}`}
              title={disc.title}
              badge={disc.categoryLabel}
              to={routePath}
              icon={disc.icon}
              gradient={disc.gradient}
              features={features.map((featName) => ({
                title: featName,
                to: routePath,
              }))}
              categoryGroups={categoryGroups}
              categoryOnlyMode={categoryOnlyMode}
              showFeatureIcons={false}
              isFav={favorites.includes(routePath)}
              toggleFavorite={toggleFavorite}
              cardHeightClass="h-full"
              maxFeatureCols={
                activeJenjangId === 4 || activeJenjangId === 5 || activeJenjangId === 6
                  ? 5
                  : 3
              }
            />
          );
        })}
        <MovedCardsGridItems
          pageId={pageId}
          searchQuery={q}
          cardHeightClass="h-full"
        />
      </div>
    </div>
    </LauncherPageProvider>
  );
}
