import { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoHeight from "embla-carousel-auto-height";
import { AppShell } from "../app/app-shell";
import { useFavorites } from "@/hooks/useFavorites";
import { useDockStore } from "@/hooks/useDockState";
import { getLastLauncherPage, setLastLauncherPage } from "@/utils/launcherCategoryMapper";
import { Tools100Section } from "@/features/launcher/Tools100Section";
import { ValueTreatedSection } from "@/features/launcher/ValueTreatedSection";
import { FinancialWealthSection } from "@/features/launcher/FinancialWealthSection";
import { CommodityDashboardSection } from "./commodity-dashboard";
import { EmptyModePage } from "@/features/launcher/EmptyModePage";
import { ModeSectionView } from "@/features/launcher/ModeSectionView";
import {
  BIZ_OPS_SUMMARY_DESC,
  BIZ_OPS_TOTAL_BADGE,
} from "@/features/business-operations/BusinessOperationsCustomersPage";
import { AnimatedSearchIcon } from "@/app/shell/AnimatedSearchIcon";
import { TypewriterSearchText } from "@/app/shell/TypewriterSearchText";
import { LauncherPageProvider } from "@/hooks/useCardPageMover";
import { MovedCardsSection } from "@/components/common/MovedCardsGridItems";
import { getRaw, setRaw } from "../core/rawStorage";
import {
  Layers,
  Gem,
  Scale,
  Coins,
  LayoutGrid,
  TrendingUp,
  BarChart3,
  User,
  Users,
  GraduationCap,
  Palette,
  HeartPulse,
  Coffee,
  Sofa,
  Briefcase,
  Store,
  Crown,
  Heart,
  Landmark,
  Home,
  Globe,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const GRADIENT_PALETTES = [
  "bg-linear-to-br from-indigo-500 to-indigo-700",
  "bg-linear-to-br from-blue-500 to-cyan-600",
  "bg-linear-to-br from-emerald-500 to-teal-700",
  "bg-linear-to-br from-amber-500 to-orange-600",
  "bg-linear-to-br from-rose-500 to-pink-600",
  "bg-linear-to-br from-purple-500 to-violet-700",
  "bg-linear-to-br from-sky-500 to-blue-700",
  "bg-linear-to-br from-teal-500 to-emerald-700",
];

export function getGradient(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[idx];
}

export const LAUNCHER_TABS = [
  // 2 Halaman Inti Utama (100 Tools Mini MBA kini dilebur ke Business Operations)
  { id: "valuetreated", label: "Value Treated", icon: Gem, badge: "10 Disiplin" },
  { id: "commodity", label: "Market Price Monitor", icon: TrendingUp, badge: "Makro & Nasional" },

  // 10 Laman Fix Workspace Terintegrasi
  { id: "financial", modeId: "financial", label: "Financial Planning and Wealth Management", icon: Coins, badge: "5 Tahapan", desc: "Perencanaan Finansial, Wealth Spectrum, Valuasi & Suksesi" },
  { id: "mode_business", modeId: "business", label: "Business Administration and Operations Management", icon: Store, badge: BIZ_OPS_TOTAL_BADGE, desc: BIZ_OPS_SUMMARY_DESC },
  { id: "mode_employment", modeId: "employment", label: "Productivity Workspace and Workflow Systems", icon: Briefcase, badge: "9 Modul", desc: "Semua (9) · Planning (1) · Workflow (2) · Resources (2) · Coordination (1) · Governance (2) · Ownership (1)" },
  { id: "mode_creative", modeId: "creative", label: "Creative Workspace and Media Production", icon: Palette, badge: "6 Modul", desc: "Semua (6) · Studio (2) · Publishing (1) · Media (2) · Interactive (1)" },
  { id: "mode_research", modeId: "research", label: "Research Foundations and Reference Frameworks", icon: GraduationCap, badge: "6 Modul", desc: "Semua (6) · Frameworks (2) · Reference (2) · Research (2)" },
  { id: "mode_sharia", modeId: "sharia", label: "Islamic Principles and Sharia Values", icon: Scale, badge: "16 Modul", desc: "Semua (16) · Sosial (3) · Komersial (5) · Proteksi (1) · Simpanan (1) · Zakat (3) · Investasi (1) · Kepatuhan (2)" },
  { id: "mode_personal", modeId: "personal", label: "Personal Life Management", icon: Heart, badge: "6 Modul", desc: "Semua (6) · Pengembangan (1) · Refleksi (1) · Kesehatan (2) · Utilitas (2)" },
  { id: "mode_family", modeId: "family", label: "Family Records and Household Planning", icon: Home, badge: "6 Modul", desc: "Semua (6) · Keluarga (3) · Rumah Tangga (2) · Kendaraan (1)" },
  { id: "mode_public_affairs", modeId: "public_affairs", label: "Public Affairs and Relations", icon: Landmark, badge: "6 Modul", desc: "Semua (6) · Civic (3) · Policy (2) · Media (1)" },
  { id: "mode_networks", modeId: "networks", label: "Contact Directory and Social Networks", icon: Users, badge: "6 Modul", desc: "Semua (6) · Direktori (2) · Relasi (2) · Jaringan (2)" },
];

export function Launcher() {
  const getInitialModeIndex = () => {
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const resolveParam = (val: string) => {
          if (!val) return -1;
          const v = val.toLowerCase().trim();
          if (v === "tools" || v === "100-tools" || v === "mini-mba" || v === "mba" || v === "pilar") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_business" || (t as any).modeId === "business");
          if (v === "valuetreated" || v === "value-treated" || v === "value_treated" || v === "disiplin" || v === "applied-value-framework" || v === "applied-value" || v === "applied_value_framework" || v === "applied") return LAUNCHER_TABS.findIndex((t) => t.id === "valuetreated");
          if (v === "commodity" || v === "100-komoditas" || v === "komoditas" || v === "indeks" || v === "national_indices" || v === "10-indeks" || v === "market-price-monitor" || v === "market_price_monitor" || v === "price-monitor") return LAUNCHER_TABS.findIndex((t) => t.id === "commodity");
          if (v === "financial" || v === "finance" || v === "financial-planning" || v === "wealth") return LAUNCHER_TABS.findIndex((t) => t.id === "financial" || (t as any).modeId === "financial");
          if (v === "business" || v === "business-administration" || v === "business-operations" || v === "owner") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_business" || (t as any).modeId === "business");
          if (v === "productivity" || v === "work" || v === "work-productivity" || v === "employment") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_employment" || (t as any).modeId === "employment");
          if (v === "creative" || v === "creative-workspace" || v === "media") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_creative" || (t as any).modeId === "creative");
          if (v === "research" || v === "research-frameworks" || v === "frameworks" || v === "student" || v === "knowledge") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_research" || (t as any).modeId === "research");
          if (v === "sharia" || v === "sharia-values" || v === "islamic-principles" || v === "syariah") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_sharia" || (t as any).modeId === "sharia");
          if (v === "personal" || v === "personal-life" || v === "profile") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_personal" || (t as any).modeId === "personal");
          if (v === "family" || v === "family-records" || v === "household" || v === "home-leisure") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_family" || (t as any).modeId === "family");
          if (v === "public" || v === "public-affairs" || v === "policy" || v === "public-relations") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_public_affairs" || (t as any).modeId === "public_affairs");
          if (v === "networks" || v === "contact-directory" || v === "social-networks" || v === "contacts" || v === "relatives") return LAUNCHER_TABS.findIndex((t) => t.id === "mode_networks" || (t as any).modeId === "networks");

          return LAUNCHER_TABS.findIndex((t) => t.id === v || (t as any).modeId === v);
        };

        const modeFromUrl = urlParams.get("mode");
        if (modeFromUrl) {
          const idx = resolveParam(modeFromUrl);
          if (idx !== -1) return idx;
        }
        const tabFromUrl = urlParams.get("tab");
        if (tabFromUrl) {
          const idx = resolveParam(tabFromUrl);
          if (idx !== -1) return idx;
        }

        // Jika sebelumnya user berada di slide pertama (100 Tools MBA sebelum dipindahkan), arahkan otomatis ke Business Operations
        if (!getRaw("aio_tools_merged_to_business_v1")) {
          setRaw("aio_tools_merged_to_business_v1", "1");
          const prevPage = getRaw("aio_last_launcher_page");
          if (prevPage === null || prevPage === "0") {
            const bizIdx = LAUNCHER_TABS.findIndex((t) => t.id === "mode_business");
            if (bizIdx !== -1) {
              setLastLauncherPage(bizIdx, LAUNCHER_TABS.length);
              setRaw("aio_active_mode", "business");
              setRaw("client_os_active_mode", "business");
              return bizIdx;
            }
          }
        }
      } catch {}
    }
    return getLastLauncherPage(LAUNCHER_TABS.length);
  };

  const initialPage = getInitialModeIndex();
  const [activeTabIdx, setActiveTabIdx] = useState<number>(initialPage);
  const { favorites, toggleFavorite } = useFavorites();
  const isDockMinimized = useDockStore((s) => s.isMinimized);

  // Mode transisi iOS: 'search' saat diam/idle, 'dots' saat swipe/geser halaman
  const [barMode, setBarMode] = useState<"search" | "dots">("search");
  const idleTimerRef = useRef<any>(null);

  // Setup Carousel swipe dengan Embla + AutoHeight dinamis agar tidak scroll berlebih ke bawah
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      startIndex: initialPage,
      loop: false,
      duration: 25,
      skipSnaps: false,
    },
    [AutoHeight()]
  );

  // Tampilkan dots secara temporer lalu kembali ke search
  const showDotsTemporarily = useCallback((duration = 2000) => {
    setBarMode("dots");
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      setBarMode("search");
    }, duration);
  }, []);

  // Tampilkan dots langsung (selama interaksi swipe berlangsung)
  const showDotsImmediately = useCallback(() => {
    setBarMode("dots");
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  // Sinkronisasi event Embla Carousel dengan dots indicator
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const snap = emblaApi.selectedScrollSnap();
      setActiveTabIdx(snap);
      setLastLauncherPage(snap, LAUNCHER_TABS.length);
      showDotsTemporarily(2200);

      const currentTab = LAUNCHER_TABS[snap];
      if (currentTab && (currentTab as any).modeId) {
        try {
          const modeId = (currentTab as any).modeId;
          setRaw("aio_active_mode", modeId);
          setRaw("client_os_active_mode", modeId);
          window.dispatchEvent(
            new CustomEvent("aio_launcher_mode_changed", { detail: modeId })
          );
        } catch {}
      }
    };

    const onPointerDown = () => {
      showDotsImmediately();
    };

    const onPointerUp = () => {
      showDotsTemporarily(2200);
    };

    const onScroll = () => {
      showDotsImmediately();
    };

    const onSettle = () => {
      showDotsTemporarily(2000);
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);
    emblaApi.on("scroll", onScroll);
    emblaApi.on("settle", onSettle);

    // Dukungan sinkronisasi pergantian mode dari Sidebar Kanan
    const handleModeChanged = () => {
      try {
        const savedMode = getRaw("aio_active_mode");
        if (savedMode && emblaApi) {
          const idx = LAUNCHER_TABS.findIndex(
            (t) => t.id === savedMode || (t as any).modeId === savedMode
          );
          if (idx !== -1 && idx !== emblaApi.selectedScrollSnap()) {
            emblaApi.scrollTo(idx);
          }
        }
      } catch {}
    };

    window.addEventListener("aio_mode_changed", handleModeChanged);

    // Dukungan geser / swipe 2 jari horizontal pada trackpad
    const emblaNode = emblaApi.rootNode();
    let accumulatedDeltaX = 0;
    let wheelDebounceTimer: any = null;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 12) {
        showDotsImmediately();
        accumulatedDeltaX += e.deltaX;

        if (wheelDebounceTimer) clearTimeout(wheelDebounceTimer);
        wheelDebounceTimer = setTimeout(() => {
          accumulatedDeltaX = 0;
          showDotsTemporarily(2000);
        }, 220);

        if (accumulatedDeltaX > 50) {
          emblaApi.scrollNext();
          accumulatedDeltaX = 0;
        } else if (accumulatedDeltaX < -50) {
          emblaApi.scrollPrev();
          accumulatedDeltaX = 0;
        }
      }
    };

    if (emblaNode) {
      emblaNode.addEventListener("wheel", onWheel, { passive: true });
    }

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
      emblaApi.off("scroll", onScroll);
      emblaApi.off("settle", onSettle);
      window.removeEventListener("aio_mode_changed", handleModeChanged);
      if (emblaNode) {
        emblaNode.removeEventListener("wheel", onWheel);
      }
      if (wheelDebounceTimer) clearTimeout(wheelDebounceTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [emblaApi, showDotsTemporarily, showDotsImmediately]);

  // Handle pergantian tab manual (klik tab atau klik titik)
  const handleSelectTab = useCallback((idx: number) => {
    setActiveTabIdx(idx);
    setLastLauncherPage(idx, LAUNCHER_TABS.length);
    emblaApi?.scrollTo(idx);
    showDotsTemporarily(2200);

    const currentTab = LAUNCHER_TABS[idx];
    if (currentTab && (currentTab as any).modeId) {
      try {
        const modeId = (currentTab as any).modeId;
        setRaw("aio_active_mode", modeId);
        setRaw("client_os_active_mode", modeId);
        window.dispatchEvent(new Event("aio_mode_changed"));
      } catch {}
    }
  }, [emblaApi, showDotsTemporarily]);

  // Sinkronisasi perpindahan kartu antar page & navigasi langsung ke page tujuan
  useEffect(() => {
    const handleMovedCardsChanged = () => {
      requestAnimationFrame(() => {
        emblaApi?.reInit();
        window.dispatchEvent(new Event("resize"));
      });
    };

    const handleNavigateLauncherPage = (e: Event) => {
      const targetPageId = (e as CustomEvent<string>).detail;
      if (!targetPageId) return;
      const idx = LAUNCHER_TABS.findIndex(
        (t) => t.id === targetPageId || (t as any).modeId === targetPageId
      );
      if (idx !== -1) {
        handleSelectTab(idx);
      }
    };

    window.addEventListener("aio_moved_cards_changed", handleMovedCardsChanged);
    window.addEventListener("aio_navigate_launcher_page", handleNavigateLauncherPage);
    return () => {
      window.removeEventListener("aio_moved_cards_changed", handleMovedCardsChanged);
      window.removeEventListener("aio_navigate_launcher_page", handleNavigateLauncherPage);
    };
  }, [emblaApi, handleSelectTab]);

  // Keyboard navigation untuk swipe kiri-kanan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        if (activeTabIdx > 0) {
          handleSelectTab(activeTabIdx - 1);
        }
      } else if (e.key === "ArrowRight") {
        if (activeTabIdx < LAUNCHER_TABS.length - 1) {
          handleSelectTab(activeTabIdx + 1);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTabIdx, emblaApi]);

  const openGlobalSearch = () => {
    window.dispatchEvent(new CustomEvent("aio_open_search"));
  };

  return (
    <AppShell
      title="All in One Workspace"
      subtitle="Workspace Eksekutif Terintegrasi: Bisnis, Finansial, Manajemen, Komoditas & 10 Mode Kehidupan"
    >
      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 py-2 space-y-2 pb-2">
        {/* Swipe Carousel Area */}
        <div className="w-full overflow-hidden cursor-grab active:cursor-grabbing transition-[height] duration-300" ref={emblaRef}>
          <div className="w-full flex touch-pan-y items-start">
            {LAUNCHER_TABS.map((tab, idx) => {
              const isActive = activeTabIdx === idx;
              return (
                <div
                  key={tab.id}
                  className={`flex-[0_0_100%] min-w-0 pr-1 ${
                    isActive ? "h-auto opacity-100" : "h-0 max-h-0 min-h-0 overflow-hidden invisible pointer-events-none"
                  }`}
                >
                  {isActive && (
                    <LauncherPageProvider pageId={tab.id}>
                      {tab.id === "tools" ? (
                        <Tools100Section
                          favorites={favorites}
                          toggleFavorite={toggleFavorite}
                          getGradient={getGradient}
                        />
                      ) : tab.id === "valuetreated" ? (
                        <ValueTreatedSection
                          favorites={favorites}
                          toggleFavorite={toggleFavorite}
                          getGradient={getGradient}
                        />
                      ) : tab.id === "commodity" ? (
                        <>
                          <CommodityDashboardSection isEmbedded={true} />
                          <MovedCardsSection pageId="commodity" className="mt-4" />
                        </>
                      ) : tab.id === "financial" ? (
                        <FinancialWealthSection
                          favorites={favorites}
                          toggleFavorite={toggleFavorite}
                          getGradient={getGradient}
                        />
                      ) : (
                        <ModeSectionView
                          modeId={(tab as any).modeId || tab.id}
                          favorites={favorites}
                          toggleFavorite={toggleFavorite}
                        />
                      )}
                    </LauncherPageProvider>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* iOS-Style Morphing Page Indicator / Search Pill di atas Dock & Minimized Bar */}
        <div
          className={`fixed left-0 right-0 flex justify-center pb-1 pointer-events-none z-40 transition-all duration-300 ease-out ${
            isDockMinimized ? "bottom-[28px]" : "bottom-[93px]"
          }`}
        >
          {barMode === "search" ? (
            <button
              type="button"
              onClick={openGlobalSearch}
              onMouseEnter={() => showDotsTemporarily(3000)}
              className="pointer-events-auto flex items-center justify-center h-[28.5px] min-w-[88px] gap-1.5 px-4 rounded-full liquid-glass-pill text-xs font-medium text-foreground/85 hover:text-foreground active:scale-95 transition-all duration-200 cursor-pointer group"
              aria-label="Pencarian Global (Search)"
            >
              <AnimatedSearchIcon
                active={true}
                className="size-[13px] text-muted-foreground group-hover:text-foreground transition-colors shrink-0 relative z-10"
                strokeWidth={2.4}
              />
              <div className="relative z-10">
                <TypewriterSearchText active={true} speed={50} startDelay={80} />
              </div>
            </button>
          ) : (
            <div
              onMouseEnter={showDotsImmediately}
              onMouseLeave={() => showDotsTemporarily(1800)}
              className="pointer-events-auto flex items-center justify-center h-[28.5px] px-3 gap-2 rounded-full liquid-glass-pill text-xs transition-all duration-200 animate-in fade-in zoom-in-95 max-w-[90vw]"
            >
              {/* Tombol prev slide */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTabIdx > 0) handleSelectTab(activeTabIdx - 1);
                }}
                disabled={activeTabIdx === 0}
                className="relative z-10 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer p-0.5 rounded transition-colors shrink-0"
                aria-label="Halaman Sebelumnya"
                title="Halaman Sebelumnya"
              >
                <ChevronLeft className="size-3.5" />
              </button>

              {/* Titik-titik indikator halaman (Scrollable jika banyak) */}
              <div className="relative z-10 flex items-center gap-1.5 px-1 max-w-[240px] sm:max-w-[360px] overflow-x-auto no-scrollbar py-0.5">
                {LAUNCHER_TABS.map((tab, idx) => {
                  const isActive = idx === activeTabIdx;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTab(idx);
                      }}
                      className={`transition-all duration-300 rounded-full cursor-pointer shrink-0 ${
                        isActive
                          ? "w-4 sm:w-5 h-2 bg-primary shadow-xs"
                          : "size-2 bg-foreground/30 hover:bg-foreground/60 hover:scale-125"
                      }`}
                      title={`${tab.label} (Hal ${idx + 1} dari ${LAUNCHER_TABS.length})`}
                      aria-label={`Pindah ke ${tab.label}`}
                    />
                  );
                })}
              </div>

              {/* Tombol next slide */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeTabIdx < LAUNCHER_TABS.length - 1) handleSelectTab(activeTabIdx + 1);
                }}
                disabled={activeTabIdx === LAUNCHER_TABS.length - 1}
                className="relative z-10 text-muted-foreground hover:text-foreground disabled:opacity-20 cursor-pointer p-0.5 rounded transition-colors shrink-0"
                aria-label="Halaman Berikutnya"
                title="Halaman Berikutnya"
              >
                <ChevronRight className="size-3.5" />
              </button>

              {/* Akses cepat ke Search */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openGlobalSearch();
                }}
                className="relative z-10 ml-1 pl-1.5 border-l border-border/60 text-muted-foreground hover:text-primary transition-colors cursor-pointer shrink-0"
                title="Buka Pencarian"
                aria-label="Buka Pencarian"
              >
                <Search className="size-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

export default Launcher;
