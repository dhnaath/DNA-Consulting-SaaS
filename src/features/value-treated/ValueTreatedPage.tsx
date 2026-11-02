import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Gem,
  GraduationCap,
  Search,
  X,
  Star,
  RotateCcw,
  ArrowRight,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  JENJANG_LEVELS,
  CURRICULUM_DISCIPLINES,
} from "@/features/curated/curriculumData";
import { getCurriculumCategoryGroups } from "@/features/curated/curriculumCategories";

export function ValueTreatedPage() {
  const [activeJenjangId, setActiveJenjangId] = useState<number>(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [categoryOnlyMode, setCategoryOnlyMode] = useState<boolean>(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryExpand = (catKey: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setExpandedCategories((prev) => ({
      ...prev,
      [catKey]: !prev[catKey],
    }));
  };

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("wira_vt_favs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (to: string) => {
    setFavorites((prev) => {
      const next = prev.includes(to) ? prev.filter((item) => item !== to) : [...prev, to];
      try {
        localStorage.setItem("wira_vt_favs", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

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

  const toggleFlip = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const totalModul = useMemo(() => {
    return 10 * currentJenjang.count;
  }, [currentJenjang]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 font-sans">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-card to-background p-6 sm:p-10 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 size-60 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold tracking-wide">
              <Gem className="size-3.5" />
              <span>KURASI NILAI FUNDAMENTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Value Treated
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Pusat kurasi nilai terapan komprehensif melintasi <strong>10 Bidang Value</strong>. Pilih jenjang SKS untuk melihat fitur dan materi yang menyesuaikan di setiap bidang.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="p-3.5 rounded-2xl bg-card/80 border border-border/80 shadow-xs flex flex-col">
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400">10</span>
              <span className="text-[11px] font-medium text-muted-foreground">Bidang Value Tetap</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-card/80 border border-border/80 shadow-xs flex flex-col">
              <span className="text-2xl font-black text-foreground">{totalModul}</span>
              <span className="text-[11px] font-medium text-muted-foreground">Materi di {currentJenjang.name}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-card/80 border border-border/80 shadow-xs flex flex-col col-span-2 sm:col-span-1">
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">5 Level</span>
              <span className="text-[11px] font-medium text-muted-foreground">Jenjang SKS</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 JENJANG KATEGORI UTAMA: Matrikulasi, 1 SKS, 2 SKS, 3 SKS, + Praktikum */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
              <GraduationCap size={18} />
            </span>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Jenjang Kurikulum (5 Level SKS)
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-2.5 size-3.5 text-muted-foreground" />
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

        {/* 5 Jenjang Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {JENJANG_LEVELS.map((jenjang) => {
            const isActive = activeJenjangId === jenjang.id;
            return (
              <button
                key={jenjang.id}
                type="button"
                onClick={() => {
                  setActiveJenjangId(jenjang.id);
                  setFlippedCards({});
                }}
                className={`p-3.5 rounded-2xl text-left transition-all duration-200 cursor-pointer border flex flex-col justify-between gap-1.5 ${
                  isActive
                    ? "bg-amber-500 text-white border-amber-500 shadow-md ring-2 ring-amber-500/30 scale-105"
                    : "bg-card border-border/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold">{jenjang.name}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {jenjang.count} Fitur
                  </span>
                </div>
                <span className={`text-[11px] leading-tight line-clamp-1 ${isActive ? "text-white/90" : "text-muted-foreground"}`}>
                  {jenjang.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid: 10 BIDANG TETAP, ISI FITUR MENYESUAIKAN */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>10 Bidang Value pada Jenjang {currentJenjang.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              ({currentJenjang.count} fitur per bidang • Total {totalModul} modul)
            </span>
          </h3>

          {activeJenjangId >= 4 && (
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-[11px] text-muted-foreground font-medium">Tampilan:</span>
              <div className="inline-flex items-center p-0.5 rounded-xl bg-card border border-border shadow-2xs text-[11px]">
                <button
                  type="button"
                  onClick={() => setCategoryOnlyMode(true)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                    categoryOnlyMode
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Kategori Saja
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryOnlyMode(false)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                    !categoryOnlyMode
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Kategori & Materi
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDisciplines.map((disc) => {
            const features = disc.featuresByLevel[activeJenjangId] || [];
            const Icon = disc.icon;
            const isFlipped = !!flippedCards[disc.slug];
            const isFav = favorites.includes(`/kurasi/${disc.slug}`);
            const categoryGroups =
              activeJenjangId >= 3
                ? getCurriculumCategoryGroups(disc.slug, activeJenjangId, features)
                : [];

            return (
              <div
                key={disc.id}
                className="w-full [perspective:1000px] h-full"
              >
                <motion.div
                  className="relative w-full h-full [transform-style:preserve-3d]"
                  animate={{
                    rotateY: isFlipped ? 180 : 0,
                  }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 85, damping: 15 }}
                >
                  {/* SISI DEPAN (FRONT FACE) */}
                  <div className="w-full h-full rounded-2xl border border-border bg-card p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4 [backface-visibility:hidden]">
                    <div className="space-y-3.5">
                      {/* Header Bidang */}
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          to={`/kurasi/${disc.slug}` as any}
                          className="flex items-center gap-3 group/header min-w-0 flex-1 outline-none"
                        >
                          <div
                            className={`size-11 rounded-2xl flex items-center justify-center text-white shadow-xs shrink-0 ${disc.gradient} group-hover/header:scale-105 transition-transform`}
                          >
                            <Icon className="size-5.5 opacity-90 drop-shadow-xs" strokeWidth={1.8} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-base text-foreground group-hover/header:text-amber-600 dark:group-hover/header:text-amber-400 transition-colors truncate">
                              {disc.title}
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block truncate">
                              {disc.categoryLabel}
                            </span>
                          </div>
                        </Link>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            {currentJenjang.name} • {features.length}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(`/kurasi/${disc.slug}`);
                            }}
                            className={`p-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                              isFav
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                                : "bg-muted/50 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                            title="Simpan Favorit"
                          >
                            <Star className={`size-3.5 ${isFav ? "fill-amber-500" : ""}`} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {disc.subtitle}
                      </p>

                      {/* ISI FITUR MENYESUAIKAN DENGAN JENJANG (4, 9, 16, 25, 36) */}
                      <div className="pt-2 border-t border-border/60">
                        <div className="flex items-center justify-between text-[11px] font-bold text-foreground mb-2">
                          <span className="flex items-center gap-1.5">
                            <Layers size={12} className="text-amber-500" />
                            <span>
                              {categoryGroups.length > 0
                                ? `Kategori (${categoryGroups.length} Kategori • ${features.length} Materi):`
                                : `Materi Fitur (${features.length} Pokok):`}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {currentJenjang.name}
                          </span>
                        </div>

                        {features.length <= 4 ? (
                          /* Matrikulasi (4 Fitur): List 4 baris elegan */
                          <div className="space-y-1.5">
                            {features.map((featName, idx) => (
                              <div
                                key={idx}
                                className="px-2.5 py-1.5 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/50 text-xs font-semibold text-foreground flex items-center justify-between transition-colors"
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span className="size-4.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                    {idx + 1}
                                  </span>
                                  <span className="truncate">{featName}</span>
                                </div>
                                <span className="text-[10px] text-muted-foreground font-normal shrink-0">
                                  Pokok
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          /* 1 SKS (9), 2 SKS (16), 3 SKS (25), + Praktikum (36): Terpisah Per Kategori & Sambung Urut ke Bawah */
                          <div className="space-y-2">
                            <div className="relative pl-3.5 space-y-2 before:absolute before:left-[5px] before:top-2.5 before:bottom-2.5 before:w-[2px] before:bg-linear-to-b before:from-amber-500/70 before:via-amber-500/30 before:to-border/60">
                              {categoryGroups.map((group, cIdx) => {
                                const catKey = `${disc.slug}-${group.id}`;
                                const isExpanded =
                                  !categoryOnlyMode || !!expandedCategories[catKey];
                                return (
                                  <div key={group.id} className="relative space-y-1">
                                    {/* Titik penghubung yang menyambungkan garis ke bawah */}
                                    <span className="absolute -left-3.5 top-2 size-2 rounded-full bg-amber-500 ring-2 ring-card shadow-2xs" />

                                    {/* Kategori Card */}
                                    <button
                                      type="button"
                                      onClick={(e) => toggleCategoryExpand(catKey, e)}
                                      className="w-full text-left p-1.5 sm:p-2 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/60 text-xs font-semibold text-foreground flex items-center justify-between transition-colors group/cat cursor-pointer"
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        <span className="truncate group-hover/cat:text-amber-600 dark:group-hover/cat:text-amber-400 transition-colors">
                                          {group.name}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 shrink-0 ml-1.5">
                                        <span className="text-[10px] font-mono font-medium text-muted-foreground bg-card px-1.5 py-0.5 rounded-md border border-border/60">
                                          {group.items.length}
                                        </span>
                                        <ChevronDown
                                          size={12}
                                          className={`text-muted-foreground transition-transform duration-200 ${
                                            isExpanded ? "rotate-180" : ""
                                          }`}
                                        />
                                      </div>
                                    </button>

                                    {/* Rincian item materi jika dibuka / mode lengkap */}
                                    {isExpanded && (
                                      <div className="pl-1.5 pt-0.5 pb-1 flex flex-wrap gap-1 animate-in fade-in duration-200">
                                        {group.items.map((featName, fIdx) => (
                                          <span
                                            key={fIdx}
                                            className="px-1.5 py-0.5 rounded-md bg-card/90 border border-border/60 text-[10px] font-medium text-foreground hover:bg-amber-500/10 hover:border-amber-500/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-default"
                                            title={`Kategori ${cIdx + 1} • Materi: ${featName}`}
                                          >
                                            {featName}
                                          </span>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Bottom Actions */}
                    <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={(e) => toggleFlip(disc.slug, e)}
                        className="text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <RotateCcw size={12} />
                        <span>Rincian Kurikulum</span>
                      </button>

                      <Link
                        to={`/kurasi/${disc.slug}` as any}
                        className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <span>Buka Modul</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>

                  {/* SISI BELAKANG (BACK FACE) */}
                  <div className="absolute inset-0 w-full h-full rounded-2xl border border-amber-500/40 bg-card p-5 shadow-md flex flex-col justify-between gap-4 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-2.5 border-b border-border/70">
                        <div className="flex items-center gap-2">
                          <div className={`size-7 rounded-lg flex items-center justify-center text-white ${disc.gradient}`}>
                            <Icon size={14} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-foreground block">
                              Kurikulum {disc.title}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {currentJenjang.name} • {features.length} Materi Pokok
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/30">
                          {currentJenjang.badge}
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <p className="text-muted-foreground leading-relaxed">
                          {disc.subtitle}
                        </p>
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                          <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block">
                            Tingkat {currentJenjang.name}:
                          </span>
                          <p className="text-[11px] text-foreground/80 leading-snug">
                            {currentJenjang.desc} Disusun untuk penguasaan praktis dari dasar teori hingga simulasi nyata.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={(e) => toggleFlip(disc.slug, e)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw size={12} />
                        <span>Kembali</span>
                      </button>

                      <Link
                        to={`/kurasi/${disc.slug}` as any}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>Pelajari Lengkap</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
