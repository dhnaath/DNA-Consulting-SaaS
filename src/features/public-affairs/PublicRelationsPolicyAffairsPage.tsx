import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { useFavorites } from "@/hooks/useFavorites";
import { HeaderNavPills, ShellHeader } from "@/app/shell-header";
import { MBACard } from "@/components/common/MBACard";
import { MovedCardsGridItems } from "@/components/common/MovedCardsGridItems";
import {
  LauncherPageProvider,
  adjustCategoryTabsCount,
  useCardPageMover,
  useCurrentLauncherPage,
} from "@/hooks/useCardPageMover";
import {
  Landmark,
  Building,
  Compass,
  CalendarDays,
  ShieldAlert,
  Scale,
  Globe,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

export type PublicAffairsCategory = "all" | "community" | "public-services" | "policy" | "media";

export interface PublicAffairsSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface PublicAffairsAppItem {
  id: string;
  name: string;
  category: "community" | "public-services" | "policy" | "media";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: PublicAffairsSubMenu[];
}

export const PUBLIC_AFFAIRS_APPS: PublicAffairsAppItem[] = [
  {
    id: "komunitas-warga-rt-rw",
    name: "Community Management",
    category: "community",
    categoryLabel: "Community",
    shortDesc:
      "Manajemen rukun warga RT/RW terpadu: transparansi pencatatan iuran kas warga, publikasi pengumuman digital, dan penerbitan surat pengantar sipil.",
    to: "/komunitas-warga",
    icon: Building,
    badge: "Rukun Warga",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Community",
    subMenus: [
      { id: "warga-directory", label: "Direktori Warga", to: "/komunitas-warga" },
      { id: "iuran-kas", label: "Transparansi Iuran Kas", to: "/komunitas-warga" },
      { id: "surat-pengantar", label: "Layanan Surat Pengantar", to: "/komunitas-warga" },
    ],
  },
  {
    id: "civic-services-guide",
    name: "Public Services Guide",
    category: "public-services",
    categoryLabel: "Public Services",
    shortDesc:
      "Direktori panduan administrasi kependudukan (KTP, KK, Akta), persyaratan legal perizinan sipil, dan repositori kontak kantor dinas pelayanan publik.",
    to: "/lainnya?app=public-services-guide",
    icon: Compass,
    badge: "Civic Services",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Public Services",
    subMenus: [
      { id: "panduan-layanan", label: "Panduan Administrasi", to: "/lainnya?app=public-services-guide" },
      { id: "syarat-berkas", label: "Persyaratan Berkas", to: "/documents" },
      { id: "kontak-instansi", label: "Direktori Kantor Dinas", to: "/contacts" },
    ],
  },
  {
    id: "civic-calendar-agenda",
    name: "Community Events & Meetings",
    category: "community",
    categoryLabel: "Community",
    shortDesc:
      "Kalender agenda gotong royong, jadwal posyandu & ronda malam siskamling, serta risalah notulen musyawarah rencana pembangunan warga.",
    to: "/lainnya?app=civic-calendar",
    icon: CalendarDays,
    badge: "Civic Agenda",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Community",
    subMenus: [
      { id: "kalender-warga", label: "Kalender Warga", to: "/lainnya?app=civic-calendar" },
      { id: "jadwal-musyawarah", label: "Jadwal Musyawarah", to: "/calendar" },
      { id: "notulen-pertemuan", label: "Notulen Acara", to: "/meeting-manager" },
    ],
  },
  {
    id: "policy-compliance-audit",
    name: "Regulatory Compliance",
    category: "policy",
    categoryLabel: "Policy",
    shortDesc:
      "Pelacakan kepatuhan terhadap regulasi perundang-undangan daerah/nasional, standar kepatuhan operasional, dan mitigasi risiko sanksi hukum.",
    to: "/peh/compliance",
    icon: Scale,
    badge: "Policy Audit",
    accentGradient: "from-purple-500 to-violet-600",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeText: "Policy",
    subMenus: [
      { id: "compliance-tracker", label: "Kepatuhan Regulasi", to: "/peh/compliance" },
      { id: "audit-hukum", label: "Audit Kepatuhan Hukum", to: "/surety?tab=cat_kepatuhan" },
      { id: "daftar-regulasi", label: "Daftar Peraturan", to: "/documents" },
    ],
  },
  {
    id: "advocacy-public-affairs",
    name: "Public Advocacy",
    category: "policy",
    categoryLabel: "Policy",
    shortDesc:
      "Kanal penjaringan aspirasi konstituen, kajian usulan kebijakan publik, petisi advokasi kepentingan komunitas, dan forum dengar pendapat umum.",
    to: "/peh/advocacy",
    icon: ShieldAlert,
    badge: "Advocacy",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Policy",
    subMenus: [
      { id: "aspirasi-publik", label: "Kotak Aspirasi Publik", to: "/peh/advocacy" },
      { id: "risalah-kebijakan", label: "Risalah Usulan Kebijakan", to: "/notes" },
      { id: "survei-warga", label: "Survei Suara Warga", to: "/forms" },
    ],
  },
  {
    id: "public-relations-media",
    name: "Public Relations & Media",
    category: "media",
    categoryLabel: "Media",
    shortDesc:
      "Pengelolaan siaran pers resmi, pemantauan narasi reputasi publik, saluran komunikasi stakeholder eksternal, dan mitigasi krisis komunikasi.",
    to: "/peh/global-overview",
    icon: Globe,
    badge: "Public Relations",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Media",
    subMenus: [
      { id: "siaran-pers", label: "Draf Siaran Pers", to: "/peh/global-overview" },
      { id: "stakeholder-news", label: "Update Stakeholder", to: "/notification-center" },
      { id: "media-clipping", label: "Kliping Media Publik", to: "/web-clipper" },
    ],
  },
];

export const PUBLIC_AFFAIRS_CATEGORY_TABS: {
  id: PublicAffairsCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 6 },
  { id: "community", label: "Community", count: 2 },
  { id: "public-services", label: "Public Services", count: 1 },
  { id: "policy", label: "Policy", count: 2 },
  { id: "media", label: "Media", count: 1 },
];

export function PublicRelationsPolicyAffairsPage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<PublicAffairsCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_public_affairs") || "mode_public_affairs";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();

  const filteredApps = useMemo(() => {
    return PUBLIC_AFFAIRS_APPS.filter((app) => {
      const matchCategory =
        selectedCategory === "all" || app.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.subMenus.some((sub) =>
          sub.label.toLowerCase().includes(searchQuery.toLowerCase())
        );
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <LauncherPageProvider pageId={pageId}>
    <div className="w-full flex-1 flex flex-col font-sans pb-16">
      <ShellHeader>
        <HeaderNavPills
          items={adjustCategoryTabsCount(PUBLIC_AFFAIRS_CATEGORY_TABS, getPageCountDelta(pageId))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as any)}
        />
      </ShellHeader>

      <div className="w-full mx-auto pt-3 sm:pt-4 space-y-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <Landmark className="size-7 text-primary" />
            <span>Public Relations and Policy Affairs</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {filteredApps.map((app) => (
            <MBACard
              key={app.id}
              title={app.name}
              to={app.to}
              icon={app.icon}
              badge={app.badgeText}
              shortDesc={app.shortDesc}
              accentGradient={app.accentGradient}
              features={app.subMenus.map((sub) => ({
                title: sub.label,
                to: sub.to || app.to,
              }))}
              isFav={isFavorite(app.to)}
              toggleFavorite={toggleFavorite}
            />
          ))}
          {selectedCategory === "all" && (
            <MovedCardsGridItems pageId={pageId} searchQuery={searchQuery} />
          )}
        </div>

        {filteredApps.length === 0 &&
          (selectedCategory !== "all" || getCardsMovedIntoPage(pageId).length === 0) && (
          <div className="text-center py-16 rounded-3xl border border-dashed border-border p-8 bg-card/40">
            <Search className="size-8 text-muted-foreground mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-semibold text-foreground">
              Tidak ada modul publik ditemukan
            </h3>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>
    </div>
    </LauncherPageProvider>
  );
}
