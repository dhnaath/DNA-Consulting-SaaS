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
  Users,
  UserCheck,
  MessagesSquare,
  Network,
  Award,
  Gift,
  Search,
  Sparkles,
  PhoneCall,
  Star,
} from "lucide-react";

export type SocialCategory = "all" | "directory" | "relations" | "networks";

export interface SocialSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface SocialAppItem {
  id: string;
  name: string;
  category: "directory" | "relations" | "networks";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: SocialSubMenu[];
}

export const SOCIAL_NETWORKS_APPS: SocialAppItem[] = [
  {
    id: "people-manager-identity",
    name: "People Manager (Single Identity)",
    category: "directory",
    categoryLabel: "Directory",
    shortDesc:
      "Identity Layer rujukan identitas tunggal seluruh ekosistem: profil person, relasi keluarga, riwayat asosiasi, dan peran organisasi.",
    to: "/people-manager",
    icon: UserCheck,
    badge: "Identity Layer",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Directory",
    subMenus: [
      { id: "identity-profiles", label: "Profil Identitas", to: "/people-manager" },
      { id: "roles-mapping", label: "Pemetaan Peran", to: "/people-manager" },
      { id: "org-members", label: "Keanggotaan Organisasi", to: "/people-manager" },
    ],
  },
  {
    id: "executive-contacts-book",
    name: "Direktori Kontak Eksekutif",
    category: "directory",
    categoryLabel: "Directory",
    shortDesc:
      "Buku alamat kontak profesional, sinkronisasi nomor telepon, kartu nama digital VCard, dan klasifikasi tag industri mitra bisnis.",
    to: "/peh/contacts",
    icon: PhoneCall,
    badge: "Contacts",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Directory",
    subMenus: [
      { id: "all-contacts", label: "Daftar Kontak", to: "/peh/contacts" },
      { id: "vip-partners", label: "Mitra Strategis", to: "/contacts" },
      { id: "import-export", label: "Buku Alamat", to: "/klien" },
    ],
  },
  {
    id: "interaction-timeline-relations",
    name: "Relationship Timeline & Interaksi",
    category: "relations",
    categoryLabel: "Relations",
    shortDesc:
      "Histori lini masa komunikasi terpadu, log catatan panggilan/meeting penting, dan jadwal pengingat tindak lanjut (follow-up) relasi.",
    to: "/interaction-manager",
    icon: MessagesSquare,
    badge: "CRM Timeline",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Relations",
    subMenus: [
      { id: "interaction-log", label: "Log Interaksi", to: "/interaction-manager" },
      { id: "follow-up-schedule", label: "Jadwal Follow-Up", to: "/interaction-manager" },
      { id: "meeting-history", label: "Histori Diskusi", to: "/meeting-manager" },
    ],
  },
  {
    id: "circle-groups-communities",
    name: "Circle Groups & Jaringan Relasi",
    category: "relations",
    categoryLabel: "Relations",
    shortDesc:
      "Klaster lingkaran pertemanan, grup alumni, paguyuban hobi, dan pengelolaan kelompok komunikasi tertutup berbasis minat bersama.",
    to: "/lainnya?app=circle-groups",
    icon: Network,
    badge: "Circle Groups",
    accentGradient: "from-purple-500 to-violet-600",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeText: "Relations",
    subMenus: [
      { id: "circles-list", label: "Daftar Lingkaran Relasi", to: "/lainnya?app=circle-groups" },
      { id: "alumni-community", label: "Komunitas Alumni", to: "/peh/community-events" },
      { id: "group-projects", label: "Kolaborasi Lingkaran", to: "/collaboration" },
    ],
  },
  {
    id: "mentorship-introductions",
    name: "Mentorship & Introductions Network",
    category: "networks",
    categoryLabel: "Networks",
    shortDesc:
      "Pencatatan sesi bimbingan karir/bisnis, jejak rekam perkenalan mitra (warm introductions), dan pelacakan sinergi kemitraan ekosistem.",
    to: "/peh/mentorship",
    icon: Award,
    badge: "Mentorship",
    accentGradient: "from-amber-500 to-orange-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Networks",
    subMenus: [
      { id: "mentorship-log", label: "Sesi Mentorship", to: "/peh/mentorship" },
      { id: "warm-intros", label: "Jejaring Perkenalan", to: "/peh/introductions" },
      { id: "advisory-board", label: "Dewan Penasihat", to: "/klien" },
    ],
  },
  {
    id: "celebrations-gift-tracker",
    name: "Kalender Perayaan & Gift Tracker",
    category: "networks",
    categoryLabel: "Networks",
    shortDesc:
      "Pengingat hari ulang tahun, perayaan hari jadi mitra, log riwayat bingkisan apresiasi hadiah, dan pengingat kartu ucapan selamat.",
    to: "/lainnya?app=gift-tracker",
    icon: Gift,
    badge: "Celebrations",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Networks",
    subMenus: [
      { id: "gift-tracker", label: "Gift Tracker", to: "/lainnya?app=gift-tracker" },
      { id: "anniversaries", label: "Kalender Hari Jadi", to: "/peh/gifts" },
      { id: "greeting-cards", label: "Kartu Ucapan Relasi", to: "/notes" },
    ],
  },
];

export const SOCIAL_CATEGORY_TABS: {
  id: SocialCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 6 },
  { id: "directory", label: "Directory", count: 2 },
  { id: "relations", label: "Relations", count: 2 },
  { id: "networks", label: "Networks", count: 2 },
];

export function ContactDirectoryNetworksPage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<SocialCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_networks") || "mode_networks";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();

  const filteredApps = useMemo(() => {
    return SOCIAL_NETWORKS_APPS.filter((app) => {
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
          items={adjustCategoryTabsCount(SOCIAL_CATEGORY_TABS, getPageCountDelta(pageId))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as any)}
        />
      </ShellHeader>

      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <Users className="size-7 text-primary" />
            <span>Contact Directory and Social Networks</span>
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
              Tidak ada modul relasi ditemukan
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
