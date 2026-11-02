import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  ChevronDown,
  ChevronRight,
  Search,
  X,
  Gem,
  ArrowRight,
} from "lucide-react";
import { MBA_PILLARS } from "@/frameworkData";
import {
  STANDALONE_MBA_APPS,
  VALUE_TREATED_APPS,
  getPillarIcon,
} from "@/features/launcher/Tools100Section";

interface SidebarPillarsMenuProps {
  isCompact?: boolean;
  onNavigate?: () => void;
}

const PILLAR_THEMES: Record<
  string,
  { bg: string; text: string; border: string; glow: string }
> = {
  strategy: {
    bg: "bg-indigo-500/15 dark:bg-indigo-500/25",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-500/30",
    glow: "hover:border-indigo-500/40",
  },
  commercial: {
    bg: "bg-emerald-500/15 dark:bg-emerald-500/25",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    glow: "hover:border-emerald-500/40",
  },
  finance: {
    bg: "bg-amber-500/15 dark:bg-amber-500/25",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    glow: "hover:border-amber-500/40",
  },
  operations: {
    bg: "bg-sky-500/15 dark:bg-sky-500/25",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/30",
    glow: "hover:border-sky-500/40",
  },
  organization: {
    bg: "bg-purple-500/15 dark:bg-purple-500/25",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    glow: "hover:border-purple-500/40",
  },
  innovation: {
    bg: "bg-rose-500/15 dark:bg-rose-500/25",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-500/30",
    glow: "hover:border-rose-500/40",
  },
  governance: {
    bg: "bg-teal-500/15 dark:bg-teal-500/25",
    text: "text-teal-600 dark:text-teal-400",
    border: "border-teal-500/30",
    glow: "hover:border-teal-500/40",
  },
  analytics: {
    bg: "bg-blue-500/15 dark:bg-blue-500/25",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    glow: "hover:border-blue-500/40",
  },
};

export function SidebarPillarsMenu({
  isCompact = false,
  onNavigate,
}: SidebarPillarsMenuProps) {
  const [searchQuery, setSearchQuery] = useState("");
  // By default, open Strategy
  const [openPillars, setOpenPillars] = useState<Record<string, boolean>>({
    strategy: true,
  });
  // Track open sub-categories (for viewing individual tools)
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const togglePillar = (pillarId: string) => {
    setOpenPillars((prev) => ({
      ...prev,
      [pillarId]: !prev[pillarId],
    }));
  };

  const toggleCategory = (catId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const q = searchQuery.toLowerCase().trim();

  // Filtered MBA Apps
  const filteredApps = useMemo(() => {
    if (!q) return STANDALONE_MBA_APPS;
    return STANDALONE_MBA_APPS.filter(
      (app) =>
        app.title.toLowerCase().includes(q) ||
        app.pillar.toLowerCase().includes(q) ||
        app.features.some((f) => f.title.toLowerCase().includes(q))
    );
  }, [q]);

  // Filtered Value Treated Apps
  const filteredVTApps = useMemo(() => {
    if (!q) return VALUE_TREATED_APPS;
    return VALUE_TREATED_APPS.filter(
      (app) =>
        app.title.toLowerCase().includes(q) ||
        app.categoryLabel.toLowerCase().includes(q) ||
        app.features.some((f) => f.title.toLowerCase().includes(q))
    );
  }, [q]);

  // Mode ringkas 75px
  if (isCompact) {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        {MBA_PILLARS.map((pillar) => {
          const PillarIcon = getPillarIcon(pillar.name);
          const theme = PILLAR_THEMES[pillar.id] || PILLAR_THEMES.strategy;
          return (
            <button
              key={pillar.id}
              type="button"
              onClick={() => togglePillar(pillar.id)}
              className={`size-11 rounded-xl ${theme.bg} ${theme.border} border flex items-center justify-center ${theme.text} shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs`}
              title={`${pillar.name}: ${pillar.description}`}
              aria-label={pillar.name}
            >
              <PillarIcon size={18} />
            </button>
          );
        })}
        <div className="w-8 h-px bg-border my-1" />
        <Link
          to={"/value-treated" as any}
          onClick={onNavigate}
          className="size-11 rounded-xl bg-amber-500/15 dark:bg-amber-500/25 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
          title="Value Treated: 10 Disiplin Fundamental"
        >
          <Gem size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full pb-4">
      {/* Kotak Pencarian / Search Box */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari pilar, modul, atau tool..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary shadow-xs transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-2 size-5 text-muted-foreground hover:text-foreground flex items-center justify-center cursor-pointer rounded-full hover:bg-muted transition-colors"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between px-1 text-[11px] font-bold text-muted-foreground">
        <span className="uppercase tracking-wider">8 Pilar & Modul Aplikasi</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-bold">
          100 Tools
        </span>
      </div>

      {/* Accordion List: 8 Pilar MBA */}
      <div className="space-y-2.5">
        {MBA_PILLARS.map((pillar) => {
          const pillarApps = filteredApps.filter((a) => a.pillar === pillar.name);
          if (pillarApps.length === 0 && q) return null;

          const PillarIcon = getPillarIcon(pillar.name);
          const isOpen = q ? true : !!openPillars[pillar.id];
          const totalTools = pillarApps.reduce((acc, a) => acc + a.features.length, 0);
          const theme = PILLAR_THEMES[pillar.id] || PILLAR_THEMES.strategy;

          return (
            <div
              key={pillar.id}
              className={`rounded-2xl border border-border/80 bg-card shadow-xs overflow-hidden transition-all ${theme.glow}`}
            >
              {/* Pillar Header Bar */}
              <button
                type="button"
                onClick={() => togglePillar(pillar.id)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-muted/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`size-7 rounded-xl flex items-center justify-center shrink-0 border ${theme.bg} ${theme.text} ${theme.border} group-hover:scale-105 transition-transform`}
                  >
                    <PillarIcon size={14} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate block">
                      {pillar.name}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold border border-border/60">
                    {pillarApps.length} modul • {totalTools} tools
                  </span>
                  {isOpen ? (
                    <ChevronDown size={14} className="text-muted-foreground" />
                  ) : (
                    <ChevronRight size={14} className="text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Sub-Categories & Modul Apps inside Pillar */}
              {isOpen && (
                <div className="px-2.5 pb-2.5 pt-1.5 border-t border-border/60 space-y-1.5 bg-muted/20 dark:bg-muted/10">
                  {pillarApps.map((app) => {
                    const AppIcon = app.icon;
                    const isCatOpen = q ? true : !!openCategories[app.id];

                    return (
                      <div
                        key={app.id}
                        className="rounded-xl bg-background border border-border/70 shadow-2xs hover:border-border transition-all overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-2.5 py-1.5 hover:bg-muted/40 transition-colors">
                          <Link
                            to={app.to as any}
                            onClick={onNavigate}
                            className="flex items-center gap-2 min-w-0 flex-1 outline-none text-left py-0.5 group/sub"
                            title={`Buka modul ${app.title}`}
                          >
                            <AppIcon size={14} className="text-primary shrink-0 group-hover/sub:scale-110 transition-transform" />
                            <span className="text-xs font-semibold text-foreground group-hover/sub:text-primary transition-colors truncate">
                              {app.title}
                            </span>
                          </Link>

                          <div className="flex items-center gap-1 shrink-0">
                            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-primary/10 text-primary font-bold border border-primary/15">
                              {app.features.length}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => toggleCategory(app.id, e)}
                              className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                              title="Tampilkan daftar instrumen"
                            >
                              {isCatOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Tools inside Sub-Category */}
                        {isCatOpen && (
                          <div className="px-2 py-1.5 border-t border-border/50 space-y-0.5 bg-muted/30 dark:bg-muted/20">
                            {app.features.map((feat, idx) => {
                              const FeatIcon = feat.icon;
                              const featPath = feat.to.split("?")[0];
                              const featSearch = feat.to.includes("?")
                                ? Object.fromEntries(new URLSearchParams(feat.to.split("?")[1]))
                                : undefined;

                              return (
                                <Link
                                  key={idx}
                                  to={featPath as any}
                                  search={featSearch as any}
                                  onClick={onNavigate}
                                  className="flex items-center justify-between gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium text-foreground/85 hover:text-primary hover:bg-background transition-colors group/tool"
                                  title={feat.desc || feat.title}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <FeatIcon size={12} className="text-muted-foreground group-hover/tool:text-primary shrink-0 group-hover/tool:scale-110 transition-transform" />
                                    <span className="truncate">{feat.title}</span>
                                  </div>
                                  <ArrowRight size={11} className="text-primary opacity-0 group-hover/tool:opacity-100 transition-opacity shrink-0" />
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Seksi Value Treated (10 Disiplin) */}
        {filteredVTApps.length > 0 && (
          <div className="rounded-2xl border border-amber-500/30 bg-card shadow-xs overflow-hidden transition-all mt-3 hover:border-amber-500/50">
            <button
              type="button"
              onClick={() => togglePillar("vt")}
              className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-amber-500/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-xl bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 group-hover:scale-105 transition-transform">
                  <Gem size={14} />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate block">
                    Value Treated
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                  {filteredVTApps.length} disiplin
                </span>
                {openPillars["vt"] ? (
                  <ChevronDown size={14} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground" />
                )}
              </div>
            </button>

            {openPillars["vt"] && (
              <div className="px-2.5 pb-2.5 pt-1.5 border-t border-amber-500/20 space-y-1.5 bg-amber-500/5 dark:bg-amber-500/10">
                <Link
                  to={"/value-treated" as any}
                  onClick={onNavigate}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-2xs group/all"
                >
                  <div className="flex items-center gap-2">
                    <Gem size={13} className="text-amber-500" />
                    <span>Halaman Utama Value Treated</span>
                  </div>
                  <ArrowRight size={12} className="group-hover/all:translate-x-0.5 transition-transform" />
                </Link>
                {filteredVTApps.map((app) => {
                  const VTIcon = app.icon;
                  return (
                    <Link
                      key={app.id}
                      to={app.to as any}
                      onClick={onNavigate}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-background hover:bg-amber-500/10 border border-border/70 hover:border-amber-500/30 transition-colors text-foreground group"
                      title={app.subtitle}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <VTIcon size={14} className="text-amber-500 shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                          {app.title}
                        </span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 shrink-0">
                        {app.features.length} modul
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
