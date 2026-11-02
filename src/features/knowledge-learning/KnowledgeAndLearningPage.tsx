import React, { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { HeaderNavPills, ShellHeader } from "@/app/shell-header";
import { ALL_APP_MODULES } from "@/features/launcher/AppModuleSection";
import { MBACard } from "@/components/common/MBACard";
import { MovedCardsGridItems } from "@/components/common/MovedCardsGridItems";
import {
  LauncherPageProvider,
  adjustCategoryTabsCount,
  useCardPageMover,
  useCurrentLauncherPage,
} from "@/hooks/useCardPageMover";
import {
  LayoutGrid,
  FileText,
  BookOpen,
  Compass,
  GraduationCap,
  Globe,
  Palette,
  Code,
  Layers,
  Database,
  Bookmark,
  Navigation,
  Scissors,
  Book,
  FileCheck,
  Award,
  ShieldCheck,
  Lightbulb,
  PenTool,
  Camera,
  Type,
  Search,
  Star,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export type KnowledgeCategory = "all" | "documents" | "learning" | "creative";

export interface KnowledgeSubMenu {
  id: string;
  label: string;
  to: string;
}

export interface KnowledgeAppItem {
  id: string;
  name: string;
  category: "documents" | "learning" | "creative";
  categoryLabel: string;
  shortDesc: string;
  to: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge: string;
  accentGradient: string;
  accentBorder: string;
  badgeBg: string;
  badgeText: string;
  subMenus: KnowledgeSubMenu[];
}

export const KNOWLEDGE_APPS: KnowledgeAppItem[] = [
  // ============================================================================
  // 1. Documents (3 Apps)
  // ============================================================================
  {
    id: "notes-and-documents",
    name: "Notes and Documents",
    category: "documents",
    categoryLabel: "Documents",
    shortDesc:
      "Pusat pencatatan terstruktur second brain, catatan kilat spontan, pengarsipan berkas dokumen resmi, dan pangkalan data relasional.",
    to: "/notes",
    icon: FileText,
    badge: "Notes & Docs",
    accentGradient: "from-blue-500 to-indigo-600",
    accentBorder: "border-blue-500/30 hover:border-blue-500/60",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeText: "Documents",
    subMenus: [
      { id: "notes", label: "Notes", to: "/notes" },
      { id: "quick-notes", label: "Quick Notes", to: "/catatan" },
      { id: "documents", label: "Documents", to: "/documents" },
      { id: "database", label: "Database", to: "/database" },
    ],
  },
  {
    id: "knowledge-library",
    name: "Knowledge Library",
    category: "documents",
    categoryLabel: "Documents",
    shortDesc:
      "Pustaka pangkalan pengetahuan (knowledge base), ensiklopedia wiki SOP, direktori bookmark referensi, dan panduan lengkap klausul Incoterms.",
    to: "/knowledge-base",
    icon: BookOpen,
    badge: "Knowledge Library",
    accentGradient: "from-emerald-500 to-teal-600",
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/60",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeText: "Documents",
    subMenus: [
      { id: "knowledge-base", label: "Knowledge Base", to: "/knowledge-base" },
      { id: "wiki", label: "Wiki Engine", to: "/wiki" },
      { id: "bookmarks", label: "Bookmark Manager", to: "/bookmarks" },
      { id: "incoterms", label: "Incoterms Guide", to: "/incoterms" },
    ],
  },
  {
    id: "research-and-reading",
    name: "Research and Reading",
    category: "documents",
    categoryLabel: "Documents",
    shortDesc:
      "Instrumen riset komparatif, pengumpulan kliping materi web clipper, dan pelacakan daftar target membaca buku teks serta publikasi ilmiah.",
    to: "/research-manager",
    icon: Compass,
    badge: "Research & Reading",
    accentGradient: "from-teal-500 to-cyan-600",
    accentBorder: "border-teal-500/30 hover:border-teal-500/60",
    badgeBg: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border-teal-500/30",
    badgeText: "Documents",
    subMenus: [
      { id: "research-manager", label: "Research Manager", to: "/research-manager" },
      { id: "web-clipper", label: "Web Clipper", to: "/web-clipper" },
      { id: "reading-list", label: "Reading List MVP", to: "/reading" },
    ],
  },

  // ============================================================================
  // 2. Learning (2 Apps)
  // ============================================================================
  {
    id: "courses-and-study",
    name: "Courses and Study",
    category: "learning",
    categoryLabel: "Learning",
    shortDesc:
      "Kurikulum kursus akselerasi keahlian, kartu hafalan repetisi kilat (flashcards), dan bank soal simulasi ujian sertifikasi profesional.",
    to: "/courses",
    icon: GraduationCap,
    badge: "Courses & Study",
    accentGradient: "from-purple-500 to-violet-600",
    accentBorder: "border-purple-500/30 hover:border-purple-500/60",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeText: "Learning",
    subMenus: [
      { id: "courses", label: "Courses", to: "/courses" },
      { id: "flashcards", label: "Flashcards", to: "/flashcards" },
      { id: "exams", label: "Exams", to: "/exams" },
    ],
  },
  {
    id: "skills-and-credentials",
    name: "Skills and Credentials",
    category: "learning",
    categoryLabel: "Learning",
    shortDesc:
      "Pembelajaran linguistik multibahasa, log jam pelatihan keahlian kerja, serta pangkalan verifikasi sertifikat dan dokumen legal.",
    to: "/languages",
    icon: Globe,
    badge: "Skills & Credentials",
    accentGradient: "from-indigo-500 to-sky-600",
    accentBorder: "border-indigo-500/30 hover:border-indigo-500/60",
    badgeBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
    badgeText: "Learning",
    subMenus: [
      { id: "languages", label: "Languages", to: "/languages" },
      { id: "training-track", label: "Training Track", to: "/lainnya?app=training-track" },
      { id: "certificate-tracker", label: "Sertifikat & Dokumen Legal", to: "/life/certificate-tracker" },
    ],
  },

  // ============================================================================
  // 3. Creative (2 Apps)
  // ============================================================================
  {
    id: "ideas-and-design",
    name: "Ideas and Design",
    category: "creative",
    categoryLabel: "Creative",
    shortDesc:
      "Papan inkubasi ide spontan, kanvas perancangan tata visual studio grafis, dan kurasi dokumentasi karya seni fotografi.",
    to: "/ideas",
    icon: Palette,
    badge: "Ideas & Design",
    accentGradient: "from-amber-500 to-rose-600",
    accentBorder: "border-amber-500/30 hover:border-amber-500/60",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeText: "Creative",
    subMenus: [
      { id: "ideas-board", label: "Ideas Board", to: "/ideas" },
      { id: "design-studio", label: "Design Studio", to: "/design" },
      { id: "photography", label: "Photography", to: "/photography" },
    ],
  },
  {
    id: "writing-and-code",
    name: "Writing and Code",
    category: "creative",
    categoryLabel: "Creative",
    shortDesc:
      "Editor penulisan esai & naskah bebas distraksi, lingkungan pengembangan kode rekayasa software, serta lisensi hak kekayaan intelektual digital.",
    to: "/writing",
    icon: Code,
    badge: "Writing & Code",
    accentGradient: "from-rose-500 to-pink-600",
    accentBorder: "border-rose-500/30 hover:border-rose-500/60",
    badgeBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
    badgeText: "Creative",
    subMenus: [
      { id: "writing-editor", label: "Writing Editor", to: "/writing" },
      { id: "code-dev", label: "Code Dev", to: "/code" },
      { id: "ip-licenses", label: "Hak Cipta & Aset Digital", to: "/peh/ip-licenses" },
    ],
  },
];

export const KNOWLEDGE_CATEGORY_TABS: {
  id: KnowledgeCategory;
  label: string;
  count: number;
}[] = [
  { id: "all", label: "Semua", count: 7 },
  { id: "documents", label: "Documents", count: 3 },
  { id: "learning", label: "Learning", count: 2 },
  { id: "creative", label: "Creative", count: 2 },
];

export function KnowledgeAndLearningPage({
  isEmbedded = false,
}: {
  isEmbedded?: boolean;
} = {}) {
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const pageId = useCurrentLauncherPage("mode_research") || "mode_research";
  const { getPageCountDelta, getCardsMovedIntoPage } = useCardPageMover();

  const filteredApps = useMemo(() => {
    return KNOWLEDGE_APPS.filter((app) => {
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
      {/* Portaled ShellHeader Filter Pills (Direct Selected / Unselected Layers) */}
      <ShellHeader>
        <HeaderNavPills
          items={adjustCategoryTabsCount(KNOWLEDGE_CATEGORY_TABS, getPageCountDelta(pageId))}
          activeId={selectedCategory}
          onSelect={(id) => setSelectedCategory(id as any)}
        />
      </ShellHeader>

      {/* Main Page Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 space-y-4">
        {/* Title (Matching MBA Page Header Style) */}
        <div className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <GraduationCap className="size-7 text-primary" />
            <span>Knowledge and Learning</span>
          </h1>
        </div>

        {/* Applications Grid */}
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

        {/* Empty Search Result Fallback */}
        {filteredApps.length === 0 &&
          (selectedCategory !== "all" || getCardsMovedIntoPage(pageId).length === 0) && (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-dashed border-border bg-card/40 my-6">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-3">
              <Search className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">Tidak ada modul ditemukan</h3>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              Tidak ada aplikasi yang cocok dengan kata kunci &quot;{searchQuery}&quot; pada kategori {selectedCategory}.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="mt-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}
      </div>
    </div>
    </LauncherPageProvider>
  );
}

export default KnowledgeAndLearningPage;
