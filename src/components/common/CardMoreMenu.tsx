import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  ArrowRightLeft,
  Check,
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  PanelBottom,
  RotateCcw,
  Search,
  X,
  Palette,
} from "lucide-react";
import {
  LAUNCHER_PAGE_OPTIONS,
  getLauncherPageOption,
  useCardPageMover,
  type MovedCardFeatureSnapshot,
} from "@/hooks/useCardPageMover";
import {
  useCardIconColor,
  CARD_COLOR_PRESETS,
  resolveIconBg,
} from "@/hooks/useCardIconColor";

export interface CardMoveMenuData {
  cardKey: string;
  originPageId: string;
  currentPageId: string;
  to: string;
  badge?: string;
  shortDesc?: string;
  gradient?: string;
  accentGradient?: string;
  icon?: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  features?: MovedCardFeatureSnapshot[];
}

export interface CardMoreMenuProps {
  title: string;
  isFav: boolean;
  onToggleFavorite: () => void;
  moveData?: CardMoveMenuData;
  to?: string;
  icon?: React.ComponentType<{ className?: string; size?: number; strokeWidth?: number }>;
  defaultGradient?: string;
}

export function CardMoreMenu({
  title,
  isFav,
  onToggleFavorite,
  moveData,
  to,
  icon,
  defaultGradient,
}: CardMoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const [pageQuery, setPageQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const cardTo = to || moveData?.to;
  const CardIcon = icon || moveData?.icon;
  const cardDefaultGradient = defaultGradient || moveData?.gradient || "bg-linear-to-br from-primary to-indigo-700";
  const { customColor, hasCustomColor, setColor, resetColor } = useCardIconColor(title, cardTo);

  const [customHexInput, setCustomHexInput] = useState(() =>
    customColor && !customColor.startsWith("bg-") ? customColor : "#6366f1"
  );

  // Sync customHexInput when customColor changes
  useEffect(() => {
    if (customColor && !customColor.startsWith("bg-")) {
      setCustomHexInput(customColor);
    }
  }, [customColor]);

  const {
    movedCards,
    moveCardToPage,
    restoreCardToOrigin,
    resetAllMovedCards,
    getMovedRecord,
  } = useCardPageMover();

  const existingMoved = moveData ? getMovedRecord(moveData.cardKey) : undefined;
  const trueOriginPageId = existingMoved?.originPageId || moveData?.originPageId;
  const currentPageId = existingMoved?.targetPageId || moveData?.currentPageId;
  const isMovedFromOrigin = Boolean(
    existingMoved && existingMoved.targetPageId !== existingMoved.originPageId
  );
  const originPageMeta = getLauncherPageOption(trueOriginPageId);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isMoveModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMoveModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMoveModalOpen]);

  useEffect(() => {
    if (!isColorModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsColorModalOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isColorModalOpen]);

  const filteredPages = LAUNCHER_PAGE_OPTIONS.filter((p) => {
    if (!pageQuery.trim()) return true;
    const q = pageQuery.toLowerCase().trim();
    return (
      p.label.toLowerCase().includes(q) ||
      p.shortLabel.toLowerCase().includes(q) ||
      p.badge.toLowerCase().includes(q) ||
      `hal ${p.pageNumber}`.includes(q) ||
      `page ${p.pageNumber}`.includes(q)
    );
  });

  const handleSelectTargetPage = (targetPageId: string, openAfterMove = false) => {
    if (!moveData) return;
    moveCardToPage(
      {
        cardKey: moveData.cardKey,
        originPageId: trueOriginPageId || moveData.originPageId,
        title,
        to: moveData.to,
        badge: moveData.badge,
        shortDesc: moveData.shortDesc,
        gradient: moveData.gradient,
        accentGradient: moveData.accentGradient,
        icon: moveData.icon,
        features: moveData.features,
      },
      targetPageId,
      openAfterMove
    );
    setIsMoveModalOpen(false);
    setPageQuery("");
  };

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
      onPointerDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`p-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 shrink-0 flex items-center justify-center ${
          isOpen
            ? "border-border bg-muted text-foreground shadow-2xs"
            : "border-border/60 hover:border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground"
        }`}
        title="Opsi lainnya"
        aria-label={`Opsi untuk ${title}`}
        aria-expanded={isOpen}
      >
        <MoreHorizontal className="size-4" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1.5 z-40 min-w-[208px] rounded-xl border border-border bg-popover text-popover-foreground p-1 shadow-lg animate-in fade-in zoom-in-95 duration-150 space-y-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 1. Tambah / Hapus dari Dock Bawah */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFavorite();
              setIsOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isFav
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : "text-foreground hover:bg-muted"
            }`}
            title={
              isFav
                ? "Hapus dari Dock Bawah"
                : "Tambah ke Dock Bawah (Maksimal 5)"
            }
          >
            <PanelBottom
              className={`size-3.5 shrink-0 transition-transform ${
                isFav ? "text-primary scale-105" : "text-muted-foreground"
              }`}
            />
            <span className="whitespace-nowrap">
              {isFav ? "Hapus dari Dock Bawah" : "Tambah ke Dock Bawah"}
            </span>
          </button>

          {/* 2. Ganti Warna Icon */}
          <div className="h-px bg-border/60 my-0.5 mx-1" />
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(false);
              setIsColorModalOpen(true);
            }}
            className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer group/color"
            title="Ganti warna dan gradien icon kartu ini"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <Palette className="size-3.5 shrink-0 text-muted-foreground group-hover/color:text-primary transition-colors" />
              <span className="whitespace-nowrap">Ganti Warna Icon...</span>
            </span>
            {hasCustomColor && (
              <span className="size-2 rounded-full bg-primary shrink-0" title="Warna telah dikustomisasi" />
            )}
          </button>

          {/* 2. Pindahkan Kotak ke Page Laman */}
          {moveData && (
            <>
              <div className="h-px bg-border/60 my-0.5 mx-1" />
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsOpen(false);
                  setIsMoveModalOpen(true);
                }}
                className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer group/move"
                title="Pindahkan kotak menu ini ke page laman lain"
              >
                <span className="flex items-center gap-2.5 min-w-0">
                  <ArrowRightLeft className="size-3.5 shrink-0 text-muted-foreground group-hover/move:text-primary transition-colors" />
                  <span className="whitespace-nowrap">Pindahkan ke Page...</span>
                </span>
                <ChevronRight className="size-3.5 shrink-0 text-muted-foreground/70 group-hover/move:translate-x-0.5 transition-transform" />
              </button>

              {isMovedFromOrigin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    restoreCardToOrigin(moveData.cardKey, title);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors cursor-pointer"
                  title={`Kembalikan ke ${originPageMeta?.label || "Page Asal"}`}
                >
                  <RotateCcw className="size-3.5 shrink-0" />
                  <span className="whitespace-nowrap truncate">
                    Kembalikan ke {originPageMeta?.shortLabel || "Page Asal"}
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Modal Pemilihan Page Tujuan (Portaled ke document.body agar tidak terpotong 3D card / carousel) */}
      {isMoveModalOpen &&
        moveData &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setIsMoveModalOpen(false);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-lg rounded-2xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="px-5 py-4 border-b border-border/70 flex items-start justify-between gap-3 bg-muted/30">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center size-6 rounded-lg bg-primary/12 text-primary shrink-0">
                      <ArrowRightLeft className="size-3.5" />
                    </span>
                    <h3 className="text-sm font-bold text-foreground truncate">
                      Pindahkan Kotak ke Page Laman
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    Kotak dipilih:{" "}
                    <strong className="text-foreground font-semibold">
                      {title}
                    </strong>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMoveModalOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                  aria-label="Tutup"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Pencarian Cepat Page */}
              <div className="px-4 pt-3 pb-2 border-b border-border/50">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={pageQuery}
                    onChange={(e) => setPageQuery(e.target.value)}
                    placeholder="Cari nama page laman (1–13)..."
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-muted/40 border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
                  />
                  {pageQuery && (
                    <button
                      type="button"
                      onClick={() => setPageQuery("")}
                      className="absolute right-2.5 top-2 size-5 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Daftar 13 Page Laman */}
              <div className="p-3 overflow-y-auto space-y-1.5 flex-1">
                {filteredPages.map((page) => {
                  const PageIcon = page.icon;
                  const isCurrent = page.id === currentPageId;
                  const isOrigin = page.id === trueOriginPageId;

                  return (
                    <div
                      key={page.id}
                      className={`w-full rounded-xl border transition-all flex items-center justify-between gap-2 p-2 ${
                        isCurrent
                          ? "border-primary/40 bg-primary/8"
                          : "border-border/60 bg-background/60 hover:border-primary/35 hover:bg-muted/50"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={isCurrent}
                        onClick={() => handleSelectTargetPage(page.id, false)}
                        className={`flex items-center gap-3 min-w-0 flex-1 text-left ${
                          isCurrent ? "cursor-default" : "cursor-pointer"
                        }`}
                      >
                        <div
                          className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isCurrent
                              ? "bg-primary text-primary-foreground shadow-xs"
                              : "bg-muted text-primary"
                          }`}
                        >
                          <PageIcon className="size-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              Hal {page.pageNumber}
                            </span>
                            <span className="text-xs font-bold text-foreground truncate">
                              {page.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-muted-foreground truncate">
                              {page.badge}
                            </span>
                            {isOrigin && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                                Page Asal
                              </span>
                            )}
                          </div>
                        </div>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isCurrent ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-[11px] font-bold">
                            <Check className="size-3" />
                            <span>Aktif</span>
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleSelectTargetPage(page.id, false)}
                              className="px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 text-[11px] font-semibold transition-opacity cursor-pointer"
                              title={`Pindahkan ke ${page.label}`}
                            >
                              Pindahkan
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSelectTargetPage(page.id, true)}
                              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                              title={`Pindahkan sekaligus buka ${page.shortLabel}`}
                              aria-label={`Pindahkan dan buka ${page.shortLabel}`}
                            >
                              <ExternalLink className="size-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {filteredPages.length === 0 && (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Tidak ada page laman yang cocok dengan pencarian &quot;{pageQuery}&quot;.
                  </div>
                )}
              </div>

              {/* Footer Modal: Kembalikan / Reset Susunan */}
              <div className="px-4 py-3 border-t border-border/70 bg-muted/25 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {isMovedFromOrigin && (
                    <button
                      type="button"
                      onClick={() => {
                        restoreCardToOrigin(moveData.cardKey, title);
                        setIsMoveModalOpen(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/12 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 font-semibold transition-colors cursor-pointer"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>Kembalikan ke Page Asal</span>
                    </button>
                  )}
                  {movedCards.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        resetAllMovedCards();
                        setIsMoveModalOpen(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground font-medium transition-colors cursor-pointer"
                      title="Kembalikan seluruh kotak yang pernah dipindahkan ke page asalnya"
                    >
                      <span>Reset Semua ({movedCards.length})</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setIsMoveModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground font-medium transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Modal Ganti Warna Icon Kartu (Portaled ke document.body) */}
      {isColorModalOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              e.stopPropagation();
              setIsColorModalOpen(false);
            }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Modal */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Palette className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      Ganti Warna Icon
                    </h3>
                    <p className="text-[11px] text-muted-foreground truncate">
                      Kustomisasi icon kartu &ldquo;{title}&rdquo;
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsColorModalOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                  title="Tutup"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Body Modal */}
              <div className="p-5 overflow-y-auto space-y-5 no-scrollbar">
                {/* 1. Preview Icon Kartu */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/40 border border-border/60 gap-2.5">
                  <div
                    className={`h-16 w-16 rounded-full flex items-center justify-center text-white shadow-md transition-all ${
                      resolveIconBg(customColor, cardDefaultGradient).className
                    }`}
                    style={resolveIconBg(customColor, cardDefaultGradient).style}
                  >
                    {CardIcon ? (
                      <CardIcon className="h-8 w-8 drop-shadow-sm opacity-95" strokeWidth={1.75} />
                    ) : (
                      <Palette className="h-8 w-8 drop-shadow-sm opacity-95" />
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-foreground truncate max-w-[280px]">
                      {title}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {hasCustomColor ? (
                        <span className="text-primary font-medium inline-flex items-center gap-1">
                          <Check className="size-3" /> Warna Kustom Diterapkan
                        </span>
                      ) : (
                        "Warna Bawaan (Default Sistem)"
                      )}
                    </div>
                  </div>
                </div>

                {/* 2. Palet Gradien & Warna Pilihan */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-foreground">
                      Pilihan Gradien & Warna Cepat
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {CARD_COLOR_PRESETS.length} Pilihan
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {CARD_COLOR_PRESETS.map((preset) => {
                      const isSelected = customColor === preset.value;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => {
                            setColor(preset.value);
                          }}
                          className={`relative flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer group ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-xs ring-2 ring-primary/30"
                              : "border-border/60 hover:border-border hover:bg-muted/50"
                          }`}
                          title={preset.name}
                        >
                          <div
                            className="size-8 rounded-full shadow-xs flex items-center justify-center text-white transition-transform group-hover:scale-105 shrink-0"
                            style={{ background: preset.previewBg }}
                          >
                            {isSelected && <Check className="size-4 stroke-[2.5] drop-shadow-sm" />}
                          </div>
                          <span className="text-[10px] text-center font-medium text-foreground mt-1.5 truncate max-w-full leading-tight">
                            {preset.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Pemilih Warna Kustom Sendiri (Color Picker & Hex) */}
                <div className="pt-2 border-t border-border">
                  <span className="text-xs font-semibold text-foreground block mb-2">
                    Warna Kustom Sendiri (Hex Picker)
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center">
                      <input
                        type="color"
                        value={customHexInput.startsWith("#") ? customHexInput : "#6366f1"}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomHexInput(val);
                          setColor(val);
                        }}
                        className="size-9 rounded-lg border border-border cursor-pointer p-0.5 bg-card"
                        title="Klik untuk memilih warna"
                      />
                    </div>
                    <input
                      type="text"
                      value={customHexInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomHexInput(val);
                        if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
                          setColor(val);
                        }
                      }}
                      placeholder="#6366F1"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-border bg-background text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (/^#([0-9A-F]{3}){1,2}$/i.test(customHexInput)) {
                          setColor(customHexInput);
                        }
                      }}
                      className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium cursor-pointer transition-colors"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Modal */}
              <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-muted/20">
                <button
                  type="button"
                  onClick={() => {
                    resetColor();
                  }}
                  disabled={!hasCustomColor}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    hasCustomColor
                      ? "text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 cursor-pointer"
                      : "text-muted-foreground/50 cursor-not-allowed"
                  }`}
                  title="Kembalikan ke warna bawaan sistem"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset ke Bawaan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsColorModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors cursor-pointer"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
