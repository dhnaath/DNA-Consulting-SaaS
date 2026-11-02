import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Layers,
  Sparkles,
  Search,
  X,
  Target,
  ArrowRight,
  Lightbulb,
  RotateCcw,
} from "lucide-react";
import {
  VALUE_TREATED_LEVELS,
  DISCIPLINE_LEVEL_DATA,
} from "./valueTreatedLevelsData";

interface CuratedAppProps {
  initialChapterId?: number;
}

export default function CuratedApp({ initialChapterId = 1 }: CuratedAppProps) {
  // 4 Opsi Level Utama Kategori (Default: Level 1)
  const [activeLevel, setActiveLevel] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDisciplineFilter, setSelectedDisciplineFilter] = useState<string>("all");
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});

  const currentLevelCategory = useMemo(() => {
    return VALUE_TREATED_LEVELS.find((l) => l.id === activeLevel) || VALUE_TREATED_LEVELS[0];
  }, [activeLevel]);

  const levelItems = useMemo(() => {
    return DISCIPLINE_LEVEL_DATA[activeLevel] || [];
  }, [activeLevel]);

  const q = searchQuery.toLowerCase().trim();

  // Filter 10 App features for the active level
  const filteredItems = useMemo(() => {
    return levelItems.filter((item) => {
      const matchesSearch =
        !q ||
        item.disciplineName.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.focus.toLowerCase().includes(q) ||
        item.example.toLowerCase().includes(q) ||
        item.practicalAction.toLowerCase().includes(q);

      const matchesDiscipline =
        selectedDisciplineFilter === "all" || item.slug === selectedDisciplineFilter;

      return matchesSearch && matchesDiscipline;
    });
  }, [levelItems, q, selectedDisciplineFilter]);

  const toggleCardFlip = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlippedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="w-full flex flex-col space-y-8 pb-16 font-sans">
      {/* 4 OPSI LEVEL UTAMA KATEGORI */}
      <div className="w-full space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Layers size={16} />
            </span>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted-foreground">
              Level Utama Kategori (4 Tingkatan Nilai)
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            10 App Menyesuaikan per Level
          </span>
        </div>

        {/* 4 Level Category Cards Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {VALUE_TREATED_LEVELS.map((level) => {
            const isActive = activeLevel === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => {
                  setActiveLevel(level.id);
                  setFlippedCards({});
                }}
                className={`relative p-4 sm:p-5 rounded-2xl text-left transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? "bg-card border-primary ring-2 ring-primary/25 shadow-md scale-[1.02]"
                    : "bg-card/70 border-border/80 hover:bg-card hover:border-border hover:shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      isActive
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border/60"
                    }`}
                  >
                    Level {level.levelNumber}
                  </span>
                  <span className="text-[11px] font-mono font-medium text-muted-foreground">
                    10 Modul
                  </span>
                </div>

                <h4
                  className={`text-sm sm:text-base font-bold tracking-tight mb-1 transition-colors ${
                    isActive ? "text-primary" : "text-foreground"
                  }`}
                >
                  {level.name}
                </h4>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {level.tagline}
                </p>

                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-primary rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE LEVEL BANNER & CONTEXT */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card/90 to-background p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wide border border-primary/20">
              <Sparkles size={13} />
              <span>{currentLevelCategory.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {currentLevelCategory.name}
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {currentLevelCategory.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari fitur/konsep level ini..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-2xs transition-all"
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
        </div>

        {/* Filter Disiplin Cepat */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-5 mt-5 border-t border-border/60 no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedDisciplineFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              selectedDisciplineFilter === "all"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            Semua (10 App)
          </button>
          {levelItems.map((item) => (
            <button
              key={item.disciplineId}
              type="button"
              onClick={() =>
                setSelectedDisciplineFilter(
                  selectedDisciplineFilter === item.slug ? "all" : item.slug
                )
              }
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                selectedDisciplineFilter === item.slug
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              <item.icon size={12} className={selectedDisciplineFilter === item.slug ? "text-primary-foreground" : item.color} />
              <span>{item.disciplineName}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 10 APP FEATURES GRID (MENYESUAIKAN DENGAN LEVEL AKTIF) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <span>Daftar 10 Fitur Aplikasi pada {currentLevelCategory.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              ({filteredItems.length} dari 10 ditampilkan)
            </span>
          </h3>
          <span className="text-xs text-muted-foreground italic hidden sm:inline">
            Klik kartu untuk membalik & melihat panduan praktik
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => {
            const isFlipped = !!flippedCards[item.id];
            const IconComponent = item.icon;

            return (
              <div
                key={item.id}
                className="w-full [perspective:1000px] min-h-[310px]"
              >
                <motion.div
                  className="relative w-full h-full min-h-[310px] [transform-style:preserve-3d] cursor-pointer"
                  onClick={(e) => toggleCardFlip(item.id, e)}
                  animate={{
                    rotateY: isFlipped ? 180 : 0,
                  }}
                  transition={{ duration: 0.5, type: "spring", stiffness: 85, damping: 15 }}
                >
                  {/* SISI DEPAN (FRONT FACE) */}
                  <div className="w-full h-full rounded-2xl border border-border bg-card p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-4 [backface-visibility:hidden]">
                    <div>
                      {/* App Header Badge */}
                      <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`size-9 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0 bg-gradient-to-br ${item.themeLinear}`}
                          >
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                              App {String(item.disciplineId).padStart(2, "0")}
                            </span>
                            <span className="text-xs font-extrabold text-foreground tracking-tight">
                              {item.disciplineName}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold border border-border/60">
                          Level {activeLevel}
                        </span>
                      </div>

                      {/* Feature Title */}
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors tracking-tight mb-2">
                        {item.title}
                      </h4>

                      {/* Focus Description */}
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {item.focus}
                      </p>
                    </div>

                    {/* Example & Flip Prompt */}
                    <div className="space-y-3 pt-3 border-t border-border/60">
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50 text-xs">
                        <div className="flex items-center gap-1.5 text-primary font-semibold mb-1">
                          <Target size={12} />
                          <span className="text-[11px] uppercase tracking-wider">Konteks Nyata</span>
                        </div>
                        <p className="text-foreground/80 text-[11px] italic leading-snug">
                          &quot;{item.example}&quot;
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1 hover:text-primary transition-colors">
                          <RotateCcw size={11} /> Balik kartu untuk aksi
                        </span>
                        <span className="font-semibold text-primary">Detail →</span>
                      </div>
                    </div>
                  </div>

                  {/* SISI BELAKANG (BACK FACE) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl border border-primary/40 bg-card p-5 shadow-md flex flex-col justify-between gap-4 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-border/70">
                        <div className="flex items-center gap-2">
                          <span className="size-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <IconComponent size={13} />
                          </span>
                          <span className="text-xs font-bold text-foreground">
                            Panduan Praktik: {item.disciplineName}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          Level {activeLevel}
                        </span>
                      </div>

                      <div className="mt-3 space-y-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                            Fitur Pokok:
                          </span>
                          <p className="text-xs font-bold text-foreground">
                            {item.title}
                          </p>
                        </div>

                        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                          <span className="text-[11px] font-bold text-primary flex items-center gap-1.5">
                            <Lightbulb size={13} /> Langkah Tindakan Nyata:
                          </span>
                          <p className="text-xs text-foreground/90 leading-relaxed font-medium">
                            {item.practicalAction}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <RotateCcw size={11} /> Klik untuk kembali
                      </span>

                      <Link
                        to={`/kurasi/${item.slug}` as any}
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <span>Buka Silabus</span>
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
