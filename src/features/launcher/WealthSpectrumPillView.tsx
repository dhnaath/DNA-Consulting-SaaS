import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { FIVE_TAHAPAN_WEALTH } from "./FiveTahapanDescriptionBanner";
import {
  Layers,
  X,
  Star,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  STANDALONE_FINANCIAL_APPS,
} from "./FinancialWealthSection";

interface WealthSpectrumPillViewProps {
  selectedFilter?: string;
  onSelectFilter: (cat: string | null) => void;
  favorites?: string[];
  toggleFavorite?: (to: string) => void;
  getGradient?: (title: string) => string;
}

export function WealthSpectrumPillView({
  selectedFilter,
  onSelectFilter,
  favorites = [],
  toggleFavorite,
  getGradient,
}: WealthSpectrumPillViewProps) {
  const displayedTahapan = selectedFilter
    ? FIVE_TAHAPAN_WEALTH.filter((t) => t.id === selectedFilter)
    : FIVE_TAHAPAN_WEALTH;

  return (
    <div className="w-full mb-6">
      {/* Header Pengontrol Tampilan */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-full bg-primary/10 text-primary">
            <Layers className="size-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <span>Surety • Flow • Build • Grow • Legacy</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
                5 Poin Fondasi & 5 Modul Aplikasi
              </span>
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Arsitektur Manajemen Kekayaan Komprehensif — Reg. DJKI No. 001085192
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 self-end sm:self-auto">
          {selectedFilter && (
            <button
              type="button"
              onClick={() => onSelectFilter(null)}
              className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2.5 py-1.5 rounded-lg bg-muted/60 border border-border transition-colors cursor-pointer shadow-2xs"
              title="Tampilkan Semua 5 Pilar"
            >
              <X className="size-3" />
              <span>Semua Pilar</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid 5 Kotak Terpadu: Tiap Kotak Memuat Header + 5 Poin Deskripsi + 5 Modul App & Fitur */}
      <div
        className={`grid grid-cols-1 ${
          selectedFilter
            ? "max-w-2xl mx-auto"
            : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        } gap-3.5 sm:gap-4 items-stretch`}
      >
        {displayedTahapan.map((t) => {
          const isSelected = selectedFilter === t.id;
          const Icon = t.icon;
          const appsForTahap = STANDALONE_FINANCIAL_APPS.filter(
            (app) => app.category === t.id
          );

          return (
            <div
              key={t.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                isSelected
                  ? "border-primary bg-card ring-2 ring-primary/30"
                  : "border-border/80 bg-card/80 hover:border-primary/40"
              }`}
            >
              {/* Bagian Atas: Header Pilar */}
              <div className="p-3.5 sm:p-4 border-b border-border/50 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl border text-xs font-semibold ${t.badgeBg}`}>
                    <Icon className="size-4.5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    {selectedFilter && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                        Aktif ✓
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectFilter(isSelected ? null : t.id)}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground font-semibold cursor-pointer border border-border/50 transition-colors"
                      title={isSelected ? "Tampilkan semua pilar" : `Fokus pada pilar ${t.name}`}
                    >
                      Tahap {t.step}
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/${t.id}` as any}
                      className="text-base font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5 group/title outline-none"
                    >
                      <span>{t.name}</span>
                      <ArrowRight size={13} className="text-muted-foreground group-hover/title:text-primary group-hover/title:translate-x-0.5 transition-all" />
                    </Link>
                    <p className="text-[11px] font-medium text-muted-foreground mt-0.5 leading-snug">
                      {t.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bagian Tengah: 5 Nama Modul App Terpadu */}
              <div className="p-3 sm:p-3.5 flex-1 flex flex-col gap-2.5">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                      <span>5 Modul Aplikasi & Fitur ({appsForTahap.length}):</span>
                      <Link
                        to={`/${t.id}` as any}
                        className="text-primary hover:underline flex items-center gap-0.5 lowercase text-[10px] font-medium"
                        title={`Buka Halaman Lengkap ${t.name}`}
                      >
                        <span>halaman {t.name}</span>
                        <ArrowRight size={10} />
                      </Link>
                    </div>

                    <div className="space-y-1.5">
                      {appsForTahap.map((app, appIdx) => {
                        const AppIcon = app.icon;
                        const isFav = favorites?.includes(app.to);

                        return (
                          <div
                            key={app.id}
                            className="p-2 rounded-xl bg-background/90 hover:bg-background border border-border/60 hover:border-primary/40 transition-all shadow-2xs group/mod flex flex-col justify-between"
                          >
                            {/* Judul Modul & Favorite */}
                            <div className="flex items-center justify-between gap-2">
                              <Link
                                to={app.to as any}
                                className="flex items-center gap-2 min-w-0 flex-1 hover:text-primary transition-colors outline-none"
                                title={app.subtitle || app.title}
                              >
                                <span className="size-4.5 rounded-md bg-muted text-muted-foreground text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                  {appIdx + 1}
                                </span>
                                <div className="size-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover/mod:scale-110 transition-transform">
                                  <AppIcon className="size-3.5" />
                                </div>
                                <span className="text-xs font-bold text-foreground group-hover/mod:text-primary truncate transition-colors">
                                  {app.title}
                                </span>
                              </Link>

                              {toggleFavorite && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavorite(app.to);
                                  }}
                                  className={`p-1 rounded-md transition-all cursor-pointer shrink-0 ${
                                    isFav
                                      ? "text-amber-400 hover:text-amber-500"
                                      : "text-muted-foreground/30 hover:text-amber-400"
                                  }`}
                                  title={isFav ? "Hapus dari Favorit" : "Simpan ke Favorit"}
                                  aria-label={isFav ? `Hapus ${app.title} dari favorit` : `Simpan ${app.title} ke favorit`}
                                >
                                  <Star className={`size-3.5 ${isFav ? "fill-amber-400" : ""}`} />
                                </button>
                              )}
                            </div>

                            {/* Fitur-fitur dari modul ini */}
                            {app.features && app.features.length > 0 && (
                              <div className="mt-1.5 pt-1.5 border-t border-border/40">
                                <div className="flex flex-wrap gap-1">
                                  {app.features.map((feat, fIdx) => {
                                    const FeatIcon = feat.icon;
                                    const featPath = feat.to.split("?")[0];
                                    const featSearch = feat.to.includes("?")
                                      ? Object.fromEntries(new URLSearchParams(feat.to.split("?")[1]))
                                      : undefined;

                                    return (
                                      <Link
                                        key={fIdx}
                                        to={featPath}
                                        search={featSearch as any}
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-muted/70 hover:bg-primary/15 hover:text-primary text-[10px] font-medium text-muted-foreground hover:text-primary transition-all border border-border/40 hover:border-primary/30"
                                        title={feat.title}
                                      >
                                        <FeatIcon size={10} className="text-primary shrink-0" />
                                        <span className="truncate max-w-[130px]">{feat.title}</span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
              </div>

              {/* Footer Kartu */}
              <div className="px-3.5 py-2.5 border-t border-border/50 bg-muted/15 flex items-center justify-between text-[11px]">
                <button
                  type="button"
                  onClick={() => onSelectFilter(isSelected ? null : t.id)}
                  className={`font-semibold cursor-pointer transition-colors ${
                    isSelected ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isSelected ? "✓ Sedang Difokuskan" : "Fokuskan Pilar →"}
                </button>
                <Link
                  to={`/${t.id}` as any}
                  className="text-primary hover:underline font-medium text-[11px] flex items-center gap-0.5"
                >
                  <span>Eksplor</span>
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WealthSpectrumPillView;

