import React, { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useFavorites } from "@/hooks/useFavorites";
import { useKembaliButtonClass } from "@/hooks/useKembaliButtonClass";
import { CardMoreMenu } from "@/components/common/CardMoreMenu";
import { MovedCardsGridItems } from "@/components/common/MovedCardsGridItems";
import {
  LauncherPageProvider,
  makeMovedCardKey,
  useCardPageMover,
  useCurrentLauncherPage,
} from "@/hooks/useCardPageMover";
import { WorkProductivityPage } from "../work-productivity/WorkProductivityPage";
import { PersonalLifePage } from "../personal-life/PersonalLifePage";
import { BusinessOperationsCustomersPage } from "../business-operations/BusinessOperationsCustomersPage";
import { KnowledgeAndLearningPage } from "../knowledge-learning/KnowledgeAndLearningPage";
import { HomeLeisurePage } from "../home-leisure/HomeLeisurePage";
import { FamilyCommunityPage } from "../family-community/FamilyCommunityPage";
import { IslamicPrinciplesShariaValuesPage } from "../syariah/IslamicPrinciplesShariaValuesPage";
import { CreativeWorkspaceMediaPage } from "../creative-workspace/CreativeWorkspaceMediaPage";
import { ResearchFrameworksPage } from "../research-frameworks/ResearchFrameworksPage";
import { FamilyRecordsHouseholdPage } from "../family-records/FamilyRecordsHouseholdPage";
import { PublicRelationsPolicyAffairsPage } from "../public-affairs/PublicRelationsPolicyAffairsPage";
import { ContactDirectoryNetworksPage } from "../social-networks/ContactDirectoryNetworksPage";
import {
  User,
  GraduationCap,
  Palette,
  HeartPulse,
  Coffee,
  Sofa,
  Users,
  Briefcase,
  Crown,
  Globe,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Calendar,
  Clock,
  ShieldCheck,
  Building,
  DollarSign,
  Gift,
  Stethoscope,
  Scale,
  Home,
  ShoppingCart,
  Film,
  Utensils,
  FileText,
  PieChart,
  Wallet,
  Landmark,
  Star,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

export interface ModeAppCard {
  id: string;
  name: string;
  shortDesc: string;
  icon: any;
  to: string;
  badge?: string;
  subMenus?: { id: string; label: string }[];
  accentColor?: string;
}

export interface ModeDefinition {
  id: string;
  modeId: string;
  label: string;
  badge: string;
  desc: string;
  icon: LucideIcon;
  ecosystem: "PEH" | "PFS" | "POO" | "MULTI";
  ecosystemLabel: string;
  apps: ModeAppCard[];
}

export const MODE_CONFIGS: Record<string, ModeDefinition> = {
  mode_personal: {
    id: "mode_personal",
    modeId: "personal",
    label: "Mode Personal",
    badge: "Self",
    desc: "Pengembangan diri, rutinitas kebiasaan harian, refleksi privat, dan target capaian hidup mandiri.",
    icon: User,
    ecosystem: "PEH",
    ecosystemLabel: "Personal, Essentials & Household",
    apps: [
      {
        id: "habits",
        name: "Habit & Rutinitas",
        shortDesc: "Pelacak konsistensi rutinitas harian, kalender streak, dan evaluasi ritme hidup.",
        icon: CheckCircle2,
        to: "/peh/habits",
        badge: "Inti PEH",
        subMenus: [
          { id: "today", label: "Agenda Hari Ini" },
          { id: "all", label: "Daftar Kebiasaan" },
          { id: "analytics", label: "Statistik & Streak" },
        ],
      },
      {
        id: "journal",
        name: "Jurnal & Mood",
        shortDesc: "Ruang refleksi privat, pencatatan suasana hati (mood map), dan jurnal berkala.",
        icon: Sparkles,
        to: "/peh/journal",
        badge: "Refleksi",
        subMenus: [
          { id: "timeline", label: "Lini Masa Entri" },
          { id: "mood", label: "Peta Suasana Hati" },
          { id: "topics", label: "Tag & Topik" },
        ],
      },
      {
        id: "goals",
        name: "Target & Milestone",
        shortDesc: "Peta jalan sasaran jangka pendek & panjang dengan tahapan checkpoint terukur.",
        icon: Layers,
        to: "/peh/goals",
        badge: "Roadmap",
        subMenus: [
          { id: "active", label: "Sasaran Aktif" },
          { id: "milestones", label: "Tahapan Checkpoint" },
          { id: "archive", label: "Arsip Sasaran" },
        ],
      },
      {
        id: "reading",
        name: "Buku & Bahan Bacaan",
        shortDesc: "Pelacak target membaca buku, kutipan inspiratif, dan rak bacaan personal.",
        icon: Coffee,
        to: "/peh/reading",
        badge: "Pustaka",
        subMenus: [
          { id: "shelf", label: "Rak Buku Saya" },
          { id: "reading", label: "Sedang Dibaca" },
          { id: "quotes", label: "Kutipan Penting" },
        ],
      },
      {
        id: "fitness",
        name: "Latihan & Olahraga",
        shortDesc: "Log sesi latihan fisik, kalori, intensitas detak, dan kalkulator kekuatan 1RM.",
        icon: HeartPulse,
        to: "/peh/fitness",
        badge: "Fisik",
        subMenus: [
          { id: "log", label: "Log Latihan" },
          { id: "calc", label: "Kalkulator 1RM" },
          { id: "history", label: "Riwayat Konsistensi" },
        ],
      },
      {
        id: "sleep",
        name: "Tidur & Pemulihan",
        shortDesc: "Kualitas istirahat malam, log jam tidur, dan kalkulator hutang tidur (sleep debt).",
        icon: Clock,
        to: "/peh/sleep",
        badge: "Recovery",
        subMenus: [
          { id: "log", label: "Log Tidur" },
          { id: "debt", label: "Hutang Tidur" },
          { id: "trends", label: "Tren Istirahat" },
        ],
      },
      {
        id: "wishlist",
        name: "Wishlist & Tabungan Impian",
        shortDesc: "Daftar impian terencana, refleksi mindful spending, celengan akumulasi dana & prioritas.",
        icon: Gift,
        to: "/life/wishlist",
        badge: "Mindful",
        subMenus: [
          { id: "must-have", label: "Must Have" },
          { id: "saving", label: "Celengan Impian" },
        ],
      },
      {
        id: "life-planner",
        name: "Life Planner Hub",
        shortDesc: "Dasbor terpadu perencanaan hidup: sasaran jangka panjang, tugas prioritas & metrik bulanan.",
        icon: Sparkles,
        to: "/life/life-planner",
        badge: "Master Hub",
        subMenus: [
          { id: "goals", label: "Papan Sasaran" },
          { id: "metrics", label: "Metrik Bulanan" },
        ],
      },
      {
        id: "notes",
        name: "Catatan & Notebooks",
        shortDesc: "Buku catatan privat lintas kategori: refleksi pribadi, ide, buku & teknologi.",
        icon: FileText,
        to: "/life/notes",
        badge: "Notebook",
        subMenus: [
          { id: "personal", label: "Pribadi & Hidup" },
          { id: "ideas", label: "Ide & Inspirasi" },
        ],
      },
    ],
  },

  mode_student: {
    id: "mode_student",
    modeId: "student",
    label: "Mode Student",
    badge: "Study",
    desc: "Akademik, riset literatur, metodologi belajar, hafalan materi, dan manajemen ujian.",
    icon: GraduationCap,
    ecosystem: "MULTI",
    ecosystemLabel: "Akademik & Knowledge Hub",
    apps: [
      {
        id: "reading",
        name: "Studi Literatur & Buku",
        shortDesc: "Daftar referensi buku teks, artikel jurnal akademik, dan progres target membaca.",
        icon: Coffee,
        to: "/peh/reading",
        badge: "Riset",
        subMenus: [
          { id: "shelf", label: "Pustaka Materi" },
          { id: "reading", label: "Sedang Dipelajari" },
          { id: "notes", label: "Catatan Kritis" },
        ],
      },
      {
        id: "certificate",
        name: "Sertifikat & Dokumen Legal",
        shortDesc: "Pelacak sertifikasi profesional, ijazah, lisensi kursus, dan lokasi berkas fisik.",
        icon: ShieldCheck,
        to: "/life/certificate-tracker",
        badge: "Kredensial",
        subMenus: [
          { id: "certs", label: "Sertifikasi Profesi" },
          { id: "edu", label: "Pendidikan & Ijazah" },
        ],
      },
      {
        id: "knowledge",
        name: "Pustaka SOP & Pengetahuan",
        shortDesc: "Dokumentasi rangkuman materi, formula penting, dan buku pedoman terstruktur.",
        icon: Layers,
        to: "/peh/knowledge",
        badge: "Playbook",
        subMenus: [
          { id: "sops", label: "Materi Terstruktur" },
          { id: "templates", label: "Format Ringkasan" },
        ],
      },
      {
        id: "notes_study",
        name: "Catatan Kuliah & Riset",
        shortDesc: "Penyusunan catatan belajar terstruktur dengan tag topik dan estimasi waktu baca.",
        icon: FileText,
        to: "/life/notes",
        badge: "Catatan",
        subMenus: [
          { id: "books", label: "Buku & Materi" },
          { id: "tech", label: "Teknologi" },
        ],
      },
      {
        id: "time_audit",
        name: "Audit Waktu & Deep Study",
        shortDesc: "Manajemen blok waktu belajar bebas distraksi dan analisis jam produktif optimal.",
        icon: Clock,
        to: "/peh/time-audit",
        badge: "Fokus",
        subMenus: [
          { id: "blocks", label: "Sesi Deep Work" },
          { id: "ratio", label: "Rasio Fokus vs Distraksi" },
        ],
      },
      {
        id: "goals",
        name: "Milestone Akademik",
        shortDesc: "Peta jalan ujian, penugasan akhir semester, dan target IPK / sertifikasi.",
        icon: CheckCircle2,
        to: "/peh/goals",
        badge: "Target",
        subMenus: [
          { id: "active", label: "Target Semester" },
          { id: "milestones", label: "Jadwal Ujian" },
        ],
      },
    ],
  },

  mode_creator: {
    id: "mode_creator",
    modeId: "creator",
    label: "Mode Creator",
    badge: "Media",
    desc: "Manajemen konten multimedia, inkubasi ide orisinal, riset materi, dan produksi kreatif.",
    icon: Palette,
    ecosystem: "MULTI",
    ecosystemLabel: "Kreativitas & Media Produksi",
    apps: [
      {
        id: "journal",
        name: "Jurnal & Ide Kreatif",
        shortDesc: "Penyimpanan ide konten spontan, konsep hook narasi, dan catatan mood kreatif.",
        icon: Sparkles,
        to: "/peh/journal",
        badge: "Inkubasi",
        subMenus: [
          { id: "entries", label: "Koleksi Konsep" },
          { id: "tags", label: "Topik & Kategori" },
        ],
      },
      {
        id: "projects",
        name: "Pipeline Produksi Konten",
        shortDesc: "Papan kanban tahapan naskah, syuting, editing, dan publikasi lintas platform.",
        icon: Layers,
        to: "/peh/projects",
        badge: "Pipeline",
        subMenus: [
          { id: "active", label: "Konten Berjalan" },
          { id: "done", label: "Rilis Publikasi" },
        ],
      },
      {
        id: "workflows",
        name: "Alur Kerja Kreatif & SOP",
        shortDesc: "Checklist standar mutu render visual, copywriting, dan checklist upload.",
        icon: CheckCircle2,
        to: "/peh/workflows",
        badge: "Standar",
        subMenus: [
          { id: "pipelines", label: "Alur Kerja Aktif" },
          { id: "templates", label: "Template Distribusi" },
        ],
      },
      {
        id: "ip_licenses",
        name: "Hak Cipta & Aset Digital",
        shortDesc: "Pencatatan lisensi audio, domain portofolio, dan pendaftaran merek karya cipta.",
        icon: ShieldCheck,
        to: "/peh/ip-licenses",
        badge: "Proteksi",
        subMenus: [
          { id: "licenses", label: "Lisensi Musik/Font" },
          { id: "domains", label: "Domain & Channel" },
        ],
      },
    ],
  },

  mode_wellbeing: {
    id: "mode_wellbeing",
    modeId: "wellbeing",
    label: "Mode Wellbeing",
    badge: "Health",
    desc: "Kebugaran fisik, ketenangan batin, hidrasi, jadwal medis, dan kesehatan holistik.",
    icon: HeartPulse,
    ecosystem: "PEH",
    ecosystemLabel: "Kesehatan Fisik & Vitalitas",
    apps: [
      {
        id: "fitness",
        name: "Kebugaran & Latihan",
        shortDesc: "Log olahraga harian, estimasi pembakaran kalori, dan kalkulator kekuatan otot.",
        icon: HeartPulse,
        to: "/peh/fitness",
        badge: "Fisik",
        subMenus: [
          { id: "log", label: "Sesi Latihan" },
          { id: "history", label: "Riwayat & Evaluasi" },
        ],
      },
      {
        id: "sleep",
        name: "Tidur & Pemulihan Energi",
        shortDesc: "Pelacak pola tidur malam berkualitas dan kalkulator pemulihan tubuh.",
        icon: Clock,
        to: "/peh/sleep",
        badge: "Istirahat",
        subMenus: [
          { id: "log", label: "Catatan Jam Tidur" },
          { id: "trends", label: "Kualitas Istirahat" },
        ],
      },
      {
        id: "family_health",
        name: "Profil Rekam Medis",
        shortDesc: "Kartu golongan darah, alergi obat, jadwal vitamin harian, dan kontak dokter.",
        icon: ShieldCheck,
        to: "/peh/family-health",
        badge: "Medis",
        subMenus: [
          { id: "profiles", label: "Profil Alergi & Darah" },
          { id: "meds", label: "Suplemen & Obat" },
        ],
      },
      {
        id: "habits",
        name: "Kebiasaan Sehat & Hidrasi",
        shortDesc: "Target asupan air, jalan kaki 10k langkah, dan ritme detoksifikasi harian.",
        icon: CheckCircle2,
        to: "/peh/habits",
        badge: "Rutinitas",
        subMenus: [
          { id: "today", label: "Checklist Hidup Sehat" },
          { id: "streak", label: "Konsistensi Kebiasaan" },
        ],
      },
      {
        id: "doctor",
        name: "Konsultasi Dokter & Rekam Medis",
        shortDesc: "Pencatatan sesi dokter, diagnosa, resep obat, tensi darah, kontrol, dan spesialis.",
        icon: Stethoscope,
        to: "/life/doctor-consultation",
        badge: "Medis",
        subMenus: [
          { id: "consult", label: "Jadwal Konsultasi" },
          { id: "rx", label: "Resep Obat Aktif" },
        ],
      },
      {
        id: "weight",
        name: "Weight & Body Metric Tracker",
        shortDesc: "Pelacak komposisi tubuh, indeks massa tubuh (BMI), body fat, massa otot & target berat.",
        icon: Scale,
        to: "/life/weight-tracker",
        badge: "Metrik Fisik",
        subMenus: [
          { id: "log", label: "Log Berat & BMI" },
          { id: "target", label: "Target Body Goal" },
        ],
      },
    ],
  },

  mode_leisure: {
    id: "mode_leisure",
    modeId: "leisure",
    label: "Mode Leisure",
    badge: "Relax",
    desc: "Rekreasi keluarga, kuliner warisan, jadwal liburan, hobi, dan istirahat berkualitas.",
    icon: Coffee,
    ecosystem: "PEH",
    ecosystemLabel: "Hobi, Kuliner & Relaksasi",
    apps: [
      {
        id: "movie",
        name: "Movie & Series Tracker",
        shortDesc: "Watchlist film, serial TV, platform streaming, rating bintang & ulasan tontonan pribadi.",
        icon: Film,
        to: "/life/movie-tracker",
        badge: "Watchlist",
        subMenus: [
          { id: "watching", label: "Sedang Ditonton" },
          { id: "completed", label: "Riwayat Selesai" },
        ],
      },
      {
        id: "travel",
        name: "Travel Backpack & Packing List",
        shortDesc: "Daftar bawaan liburan, estimasi bobot bagasi kabin/bagasi, dan checklist packing trip.",
        icon: Briefcase,
        to: "/life/travel-backpack",
        badge: "Trip Liburan",
        subMenus: [
          { id: "cabin", label: "Bagasi Kabin" },
          { id: "checked", label: "Bagasi Terdaftar" },
        ],
      },
      {
        id: "family_recipes",
        name: "Resep Kuliner & Masakan",
        shortDesc: "Buku resep keluarga turun-temurun, kalkulator porsi masak, dan bumbu khas.",
        icon: Utensils,
        to: "/life/recipe-book",
        badge: "Kuliner",
        subMenus: [
          { id: "recipes", label: "Daftar Resep" },
          { id: "scaler", label: "Kalkulator Porsi" },
        ],
      },
      {
        id: "reading",
        name: "Buku Santai & Novel",
        shortDesc: "Daftar fiksi, komik, dan literatur santai untuk melepas penat di akhir pekan.",
        icon: Coffee,
        to: "/peh/reading",
        badge: "Buku",
        subMenus: [
          { id: "shelf", label: "Koleksi Santai" },
          { id: "quotes", label: "Kutipan Favorit" },
        ],
      },
      {
        id: "traditions",
        name: "Agenda Reuni & Rekreasi",
        shortDesc: "Jadwal kumpul bersama, piknik akhir tahun, dan kas anggaran acara liburan.",
        icon: Calendar,
        to: "/peh/traditions",
        badge: "Acara",
        subMenus: [
          { id: "events", label: "Kalender Acara" },
          { id: "treasury", label: "Kas Rekreasi" },
        ],
      },
      {
        id: "pet_care",
        name: "Bermain dengan Anabul",
        shortDesc: "Jadwal jalan-jalan hewan peliharaan, grooming, dan aktivitas bermain bersama.",
        icon: Sparkles,
        to: "/peh/pet-care",
        badge: "Anabul",
        subMenus: [
          { id: "pets", label: "Profil Anabul" },
          { id: "weight", label: "Catatan Kebugaran" },
        ],
      },
    ],
  },

  mode_household: {
    id: "mode_household",
    modeId: "household",
    label: "Mode Household",
    badge: "Living",
    desc: "Tata kelola domestik hunian, inventaris dapur, servis berkala AC/pipa, tanaman, dan garasi.",
    icon: Sofa,
    ecosystem: "PEH",
    ecosystemLabel: "Domestik & Manajemen Rumah Tangga",
    apps: [
      {
        id: "chores",
        name: "Piket & Tugas Domestik",
        shortDesc: "Jadwal giliran kebersihan rumah tangga, checklist rutin harian, dan pembagian tugas.",
        icon: CheckCircle2,
        to: "/peh/chores",
        badge: "Piket",
        subMenus: [
          { id: "today", label: "Tugas Hari Ini" },
          { id: "zones", label: "Area Ruangan" },
        ],
      },
      {
        id: "maintenance",
        name: "Servis & Perawatan Rumah",
        shortDesc: "Pengingat servis AC, filter air, perbaikan kelistrikan, dan kontak tukang langganan.",
        icon: Building,
        to: "/peh/maintenance",
        badge: "Hunian",
        subMenus: [
          { id: "schedule", label: "Jadwal Servis AC" },
          { id: "logs", label: "Log Perbaikan" },
        ],
      },
      {
        id: "pantry",
        name: "Stok Dapur & Kulkas",
        shortDesc: "Inventaris sembako, bumbu masakan, dan radar tanggal kedaluwarsa bahan makanan.",
        icon: Coffee,
        to: "/peh/pantry",
        badge: "Logistik",
        subMenus: [
          { id: "inventory", label: "Stok Bahan Pokok" },
          { id: "expiry", label: "Radar Kedaluwarsa" },
        ],
      },
      {
        id: "plants",
        name: "Tanaman & Kebun",
        shortDesc: "Kalender penyiraman tanaman hias, pemupukan berkala, dan catatan kondisi flora.",
        icon: Sparkles,
        to: "/peh/plants",
        badge: "Kebun",
        subMenus: [
          { id: "schedule", label: "Jadwal Siram" },
          { id: "fertilizer", label: "Pupuk & Repotting" },
        ],
      },
      {
        id: "vehicles",
        name: "Kendaraan & Garasi",
        shortDesc: "Log ganti oli mobil/motor, jatuh tempo pajak STNK, dan konsumsi bahan bakar.",
        icon: ShieldCheck,
        to: "/peh/vehicles",
        badge: "Otomotif",
        subMenus: [
          { id: "service", label: "Jadwal Servis & Oli" },
          { id: "tax", label: "Pajak STNK & Polis" },
        ],
      },
      {
        id: "budget",
        name: "Anggaran Belanja Domestik",
        shortDesc: "Pos pengeluaran belanja bulanan, tagihan listrik PLN, air PAM, dan internet.",
        icon: DollarSign,
        to: "/peh/budget",
        badge: "Kas Rumah",
        subMenus: [
          { id: "monthly", label: "Pos Belanja Bulanan" },
          { id: "bills", label: "Tagihan Utilitas" },
        ],
      },
      {
        id: "household_items",
        name: "Inventaris Rumah & Elektronik",
        shortDesc: "Pendataan perabotan hunian, status garansi aktif, kondisi barang, dan log servis berkala.",
        icon: Home,
        to: "/life/household-tracker",
        badge: "Perabotan",
        subMenus: [
          { id: "rooms", label: "Ruang & Lokasi" },
          { id: "warranty", label: "Status Garansi" },
        ],
      },
      {
        id: "grocery",
        name: "Daftar Belanja & Sembako",
        shortDesc: "Perencanaan belanja supermarket, siklus restock mingguan/bulanan & estimasi biaya.",
        icon: ShoppingCart,
        to: "/life/grocery-list",
        badge: "Sembako",
        subMenus: [
          { id: "need-buy", label: "Perlu Dibeli" },
          { id: "in-cart", label: "Keranjang Belanja" },
        ],
      },
    ],
  },

  mode_relatives: {
    id: "mode_relatives",
    modeId: "relatives",
    label: "Mode Relatives",
    badge: "Family",
    desc: "Keluarga besar, silsilah generasi, silaturahmi, resep leluhur, tabungan keluarga, dan anabul.",
    icon: Users,
    ecosystem: "PFS",
    ecosystemLabel: "People, Family & Society",
    apps: [
      {
        id: "family_tree",
        name: "Silsilah Pohon Keluarga",
        shortDesc: "Bagan interaktif generasi leluhur, hubungan kekerabatan trah, dan buku alamat domisili.",
        icon: Users,
        to: "/peh/family-tree",
        badge: "Genealogi",
        subMenus: [
          { id: "tree", label: "Bagan Silsilah" },
          { id: "directory", label: "Kontak & Alamat Trah" },
        ],
      },
      {
        id: "family_health",
        name: "Kesehatan & Rekam Medis",
        shortDesc: "Profil golongan darah, alergi anak/orang tua, riwayat vaksin, dan kontak darurat keluarga.",
        icon: HeartPulse,
        to: "/peh/family-health",
        badge: "Medis",
        subMenus: [
          { id: "profiles", label: "Profil Darah & Alergi" },
          { id: "emergency", label: "Kartu Kontak Darurat" },
        ],
      },
      {
        id: "traditions",
        name: "Acara & Tradisi Bersama",
        shortDesc: "Kalender kumpul Idul Fitri/Natal, arisan trah, perayaan ulang tahun emas, dan kas acara.",
        icon: Calendar,
        to: "/peh/traditions",
        badge: "Tradisi",
        subMenus: [
          { id: "events", label: "Jadwal Reuni & Acara" },
          { id: "treasury", label: "Kas & Anggaran Acara" },
        ],
      },
      {
        id: "family_recipes",
        name: "Resep Warisan Keluarga",
        shortDesc: "Resep rahasia turun-temurun, teknik memasak leluhur, dan kalkulator takaran porsi.",
        icon: Coffee,
        to: "/peh/family-recipes",
        badge: "Resep Khas",
        subMenus: [
          { id: "recipes", label: "Koleksi Resep Warisan" },
          { id: "scaler", label: "Kalkulator Porsi" },
        ],
      },
      {
        id: "family_budget",
        name: "Tabungan & Dana Bersama",
        shortDesc: "Pos dana pendidikan anak, tabungan kurban, dan kalkulator proyeksi masa depan.",
        icon: DollarSign,
        to: "/peh/family-budget",
        badge: "Dana Terarah",
        subMenus: [
          { id: "funds", label: "Pos Dana Bersama" },
          { id: "education", label: "Simulasi Dana Pendidikan" },
        ],
      },
      {
        id: "pet_care",
        name: "Hewan Peliharaan & Anabul",
        shortDesc: "Profil anabul kesayangan, buku vaksinasi hewan, jadwal dokter vet, dan grafik berat badan.",
        icon: Sparkles,
        to: "/peh/pet-care",
        badge: "Anabul",
        subMenus: [
          { id: "pets", label: "Profil Anabul" },
          { id: "vet", label: "Jadwal Vaksinasi & Vet" },
        ],
      },
    ],
  },

  mode_employment: {
    id: "mode_employment",
    modeId: "employment",
    label: "Mode Employment",
    badge: "Career",
    desc: "Eksekusi profesional, alur kerja pipeline, audit kepatuhan, pengadaan, dan evaluasi rekanan.",
    icon: Briefcase,
    ecosystem: "POO",
    ecosystemLabel: "Productivity, Operations & Ownership",
    apps: [
      {
        id: "workflows",
        name: "Alur Kerja & Pipeline",
        shortDesc: "Pipeline proses operasional, tahapan status eksekusi, dan standarisasi alur antar-divisi.",
        icon: Layers,
        to: "/peh/workflows",
        badge: "Pipeline",
        subMenus: [
          { id: "active", label: "Pipeline Berjalan" },
          { id: "templates", label: "Template Standard" },
        ],
      },
      {
        id: "vendors",
        name: "Vendor & Mitra Layanan",
        shortDesc: "Direktori rekanan pihak ketiga, evaluasi SLA performa, dan jatuh tempo perpanjangan kontrak.",
        icon: Building,
        to: "/peh/vendors",
        badge: "Rekanan",
        subMenus: [
          { id: "directory", label: "Direktori Vendor" },
          { id: "slas", label: "Evaluasi Skor SLA" },
        ],
      },
      {
        id: "incidents",
        name: "Log Masalah & Insiden",
        shortDesc: "Pencatatan gangguan sistem/operasional, eskalasi penanganan, dan Root Cause Analysis (RCA).",
        icon: ShieldCheck,
        to: "/peh/incidents",
        badge: "RCA Masalah",
        subMenus: [
          { id: "open", label: "Insiden Terbuka" },
          { id: "postmortem", label: "Analisis Akar Masalah" },
        ],
      },
      {
        id: "procurement",
        name: "Pengadaan & Purchase Orders",
        shortDesc: "Permintaan belanja alat modal, Purchase Orders (PO), dan matriks otorisasi anggaran.",
        icon: DollarSign,
        to: "/peh/procurement",
        badge: "PO Belanja",
        subMenus: [
          { id: "orders", label: "Daftar PO Aktif" },
          { id: "matrix", label: "Matriks Otorisasi" },
        ],
      },
      {
        id: "compliance",
        name: "Kepatuhan & Audit Regulasi",
        shortDesc: "Matriks standar legalitas, kesiapan audit sertifikasi ISO/hukum, dan radar izin jatuh tempo.",
        icon: ShieldCheck,
        to: "/peh/compliance",
        badge: "Audit & Izin",
        subMenus: [
          { id: "audit", label: "Skor Kesiapan Audit" },
          { id: "expiry", label: "Radar Jatuh Tempo Izin" },
        ],
      },
      {
        id: "meetings",
        name: "Notulensi & Keputusan Rapat",
        shortDesc: "Pencatatan hasil rapat eksekutif, log konsensus final, dan tindak lanjut tugas (action items).",
        icon: Clock,
        to: "/peh/meetings",
        badge: "Notulensi",
        subMenus: [
          { id: "notes", label: "Daftar Notulensi" },
          { id: "decisions", label: "Log Keputusan Final" },
        ],
      },
      {
        id: "certificates_pro",
        name: "Sertifikasi Profesi & Legalitas",
        shortDesc: "Pelacak masa berlaku sertifikasi profesional, lisensi keahlian, dan radar renewal.",
        icon: ShieldCheck,
        to: "/life/certificate-tracker",
        badge: "Keahlian",
        subMenus: [
          { id: "pro", label: "Sertifikasi Ahli" },
          { id: "status", label: "Jatuh Tempo" },
        ],
      },
      {
        id: "budget_rule",
        name: "Budget Tracker 50/30/20",
        shortDesc: "Evaluasi proporsi anggaran pendapatan operasional dan disiplin alokasi keuangan.",
        icon: PieChart,
        to: "/life/budget-tracker",
        badge: "Alokasi",
        subMenus: [
          { id: "needs", label: "Needs 50%" },
          { id: "wants", label: "Wants 30%" },
        ],
      },
    ],
  },

  mode_owner: {
    id: "mode_owner",
    modeId: "owner",
    label: "Mode Owner",
    badge: "Equity",
    desc: "Akumulasi aset modal, kepemilikan saham ekuitas, lisensi kekayaan intelektual, dan properti.",
    icon: Crown,
    ecosystem: "POO",
    ecosystemLabel: "Ownership & Portofolio Modal",
    apps: [
      {
        id: "finance_os",
        name: "Finance OS (Multi-Akun & Arus Kas)",
        shortDesc: "Sistem keuangan mendalam: multi-akun bank, arus kas masuk/keluar, donut breakdown & tren bulanan.",
        icon: Wallet,
        to: "/life/finance-os",
        badge: "Treasury OS",
        subMenus: [
          { id: "accounts", label: "Akun Bank & Kas" },
          { id: "trend", label: "Tren Arus Kas" },
        ],
      },
      {
        id: "detailed_assets",
        name: "Inventaris Aset Modal Terperinci",
        shortDesc: "Pencatatan aset modal, nilai perolehan, taksiran nilai pasar kini, dan kategori aset.",
        icon: Landmark,
        to: "/life/assets",
        badge: "Aset Rinci",
        subMenus: [
          { id: "list", label: "Daftar Aset" },
          { id: "valuation", label: "Total Nilai Pasar" },
        ],
      },
      {
        id: "assets",
        name: "Aset Modal & Portofolio",
        shortDesc: "Inventaris mesin, server, kendaraan operasional bernilai tinggi, serta depresiasi aset.",
        icon: Building,
        to: "/peh/assets",
        badge: "Inventaris Modal",
        subMenus: [
          { id: "inventory", label: "Daftar Aset Modal" },
          { id: "valuation", label: "Valuasi Nilai Pasar" },
        ],
      },
      {
        id: "ip_licenses",
        name: "Hak Cipta, Lisensi & IP",
        shortDesc: "Manajemen sertifikat merek terdaftar, domain web, paten teknologi, dan lisensi software.",
        icon: ShieldCheck,
        to: "/peh/ip-licenses",
        badge: "Aset Intelektual",
        subMenus: [
          { id: "licenses", label: "Semua Hak Cipta & IP" },
          { id: "domains", label: "Domain & Hosting" },
        ],
      },
      {
        id: "cap_table",
        name: "Struktur Saham & Cap Table",
        shortDesc: "Tabel permodalan pemilik, alokasi porsi persentase lembar saham, dan jadwal vesting.",
        icon: BarChart3,
        to: "/peh/cap-table",
        badge: "Ekuitas Usaha",
        subMenus: [
          { id: "stakeholders", label: "Pemegang Saham" },
          { id: "vesting", label: "Perjanjian & Vesting" },
        ],
      },
      {
        id: "investments",
        name: "Portofolio Investasi & Treasury",
        shortDesc: "Instrumen pasar modal, obligasi pemerintah (SBN), saham dividen, dan alokasi aset treasury.",
        icon: DollarSign,
        to: "/peh/investments",
        badge: "Treasury",
        subMenus: [
          { id: "portfolio", label: "Portofolio Aset" },
          { id: "yield", label: "Kalkulator Imbal Hasil" },
        ],
      },
      {
        id: "real_estate",
        name: "Properti & Lahan Komersial",
        shortDesc: "Sertifikat tanah SHM/HGB, nilai appraisal, status kontrak sewa penyewa, dan kalkulator cap rate.",
        icon: Building,
        to: "/peh/real-estate",
        badge: "Properti",
        subMenus: [
          { id: "properties", label: "Daftar Properti & Ruko" },
          { id: "caprate", label: "Kalkulator Rental Yield" },
        ],
      },
      {
        id: "valuation",
        name: "Model Valuasi Bisnis",
        shortDesc: "Metodologi discounted cash flow (DCF), multiple industri, dan proyeksi nilai valuasi usaha.",
        icon: BarChart3,
        to: "/valuasi",
        badge: "Valuasi",
        subMenus: [
          { id: "dcf", label: "Metode DCF" },
          { id: "multiple", label: "Multiple EBITDA" },
        ],
      },
    ],
  },

  mode_public: {
    id: "mode_public",
    modeId: "public",
    label: "Mode Public",
    badge: "External",
    desc: "Kemasyarakatan RT/RW, aksi kerelawanan, filantropi donasi, agenda komunitas, dan aspirasi fasum.",
    icon: Globe,
    ecosystem: "PFS",
    ecosystemLabel: "People, Family & Society",
    apps: [
      {
        id: "civic",
        name: "Warga & Lingkungan RT/RW",
        shortDesc: "Direktori pengurus RT/RW, kontak darurat satpam/puskesmas, dan zonasi fasilitas publik.",
        icon: Building,
        to: "/peh/civic",
        badge: "Lingkungan",
        subMenus: [
          { id: "directory", label: "Pengurus & Kontak Sipil" },
          { id: "emergency", label: "Kontak Darurat Wilayah" },
        ],
      },
      {
        id: "volunteering",
        name: "Sukarelawan & Aksi Sosial",
        shortDesc: "Pencatatan inisiatif sosial kemasyarakatan, organisasi nirlaba, dan log jam dedikasi sosial.",
        icon: Users,
        to: "/peh/volunteering",
        badge: "Relawan",
        subMenus: [
          { id: "initiatives", label: "Aksi & Organisasi" },
          { id: "hours", label: "Log Jam Kontribusi" },
        ],
      },
      {
        id: "charity",
        name: "Filantropi & Donasi",
        shortDesc: "Catatan riwayat donasi sosial, komitmen zakat tahunan, dan rekapitulasi dampak bantuan.",
        icon: HeartPulse,
        to: "/peh/charity",
        badge: "Filantropi",
        subMenus: [
          { id: "donations", label: "Catatan Donasi" },
          { id: "pledges", label: "Komitmen Zakat" },
        ],
      },
      {
        id: "community_events",
        name: "Acara & Agenda Warga",
        shortDesc: "Papan jadwal kerja bakti, rapat warga RT/RW, peringatan 17 Agustus, dan alokasi kas panitia.",
        icon: Calendar,
        to: "/peh/community-events",
        badge: "Agenda",
        subMenus: [
          { id: "board", label: "Papan Agenda Warga" },
          { id: "budget", label: "Kas Panitia Acara" },
        ],
      },
      {
        id: "advocacy",
        name: "Aspirasi & Laporan Fasum",
        shortDesc: "Pelaporan kerusakan fasilitas umum (lampu jalan, saluran air) dan matriks urgensi publik.",
        icon: ShieldCheck,
        to: "/peh/advocacy",
        badge: "Fasilitas Umum",
        subMenus: [
          { id: "issues", label: "Daftar Laporan Warga" },
          { id: "urgency", label: "Matriks Urgensi Publik" },
        ],
      },
    ],
  },
};

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

interface ModeFlipCardProps {
  app: ModeAppCard;
  ecosystem: string;
  isFav: boolean;
  toggleFavorite: (to: string) => void;
  gradient?: string;
}

export const ModeFlipCard = ({
  app,
  ecosystem,
  isFav,
  toggleFavorite,
  gradient,
}: ModeFlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const kembaliBtnClass = useKembaliButtonClass();
  const currentPageId = useCurrentLauncherPage();
  const { isCardMovedOut } = useCardPageMover();
  const [interactionConfig, setInteractionConfig] = useState(() => ({
    axis: Math.random() > 0.5 ? "x" : "y",
    dir: Math.random() > 0.5 ? 1 : -1,
  }));

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setInteractionConfig((prev) => {
      let nextAxis = prev.axis;
      let nextDir = prev.dir;
      while (nextAxis === prev.axis && nextDir === prev.dir) {
        nextAxis = Math.random() > 0.5 ? "x" : "y";
        nextDir = Math.random() > 0.5 ? 1 : -1;
      }
      return { axis: nextAxis, dir: nextDir };
    });
    setIsFlipped((prev) => !prev);
  };

  const AppIcon = app.icon;
  const cardGradient = gradient || app.accentColor || getGradient(app.name);

  if (currentPageId && isCardMovedOut(currentPageId, app.to, app.name)) {
    return null;
  }

  return (
    <div className="w-full [perspective:1000px] min-h-[220px]">
      <motion.div
        className="relative w-full h-full min-h-[220px] [transform-style:preserve-3d]"
        animate={{
          rotateX: isFlipped && interactionConfig.axis === "x" ? 180 * interactionConfig.dir : 0,
          rotateY: isFlipped && interactionConfig.axis === "y" ? 180 * interactionConfig.dir : 0,
        }}
        transition={{ duration: 0.6, type: "spring", stiffness: 80, damping: 15 }}
      >
        {/* Front Face - Mengikuti gaya bersih kotak Tools 100 */}
        <div className="w-full h-full rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3 group [backface-visibility:hidden]">
          <div>
            <div className="flex items-start justify-between gap-3">
              <Link
                to={app.to as any}
                className="flex items-center gap-3 group/header min-w-0 flex-1 outline-none"
              >
                <div
                  className={`h-11 w-11 rounded-full flex items-center justify-center text-white shadow-xs shrink-0 ${cardGradient} group-hover/header:scale-105 transition-transform`}
                >
                  <AppIcon className="h-5 w-5 opacity-90 drop-shadow-sm" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-base text-foreground group-hover/header:text-primary transition-colors truncate">
                    {app.name}
                  </h4>
                  {app.badge && (
                    <span className="text-[11px] text-muted-foreground truncate block mt-0.5">
                      {app.badge}
                    </span>
                  )}
                </div>
              </Link>

              <CardMoreMenu
                title={app.name}
                isFav={isFav}
                onToggleFavorite={() => toggleFavorite(app.to)}
                moveData={
                  currentPageId
                    ? {
                        cardKey: makeMovedCardKey(currentPageId, app.to, app.name),
                        originPageId: currentPageId,
                        currentPageId,
                        to: app.to,
                        badge: app.badge || ecosystem,
                        shortDesc: app.shortDesc,
                        gradient: cardGradient,
                        icon: app.icon,
                        features: app.subMenus?.map((sub) => ({
                          title: sub.label,
                          to: app.to,
                        })),
                      }
                    : undefined
                }
              />
            </div>

            {/* Submenu Fitur Chips */}
            {app.subMenus && app.subMenus.length > 0 && (
              <div className="mt-3 pt-2.5 border-t border-border/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold tracking-wider text-muted-foreground">
                    Features ({app.subMenus.length}):
                  </span>
                </div>

                <div className="max-h-[140px] overflow-y-auto no-scrollbar pr-0.5">
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {app.subMenus.map((sub, idx) => (
                      <Link
                        key={idx}
                        to={app.to as any}
                        title={sub.label}
                        className="min-w-[calc((100%-0.75rem)/3)] max-w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 hover:bg-primary/10 hover:text-primary text-[11px] font-medium text-foreground transition-all cursor-pointer border border-border/40 hover:border-primary/30 group/chip"
                      >
                        <AppIcon size={12} className="text-primary shrink-0 group-hover/chip:scale-110 transition-transform" />
                        <span className="text-center leading-snug whitespace-normal">{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bottom Bar - Clean justify-end with only Related button like Tools 100 */}
          <div className="border-t border-border/50 pt-3 flex items-center justify-end text-xs">
            <button
              type="button"
              onClick={handleFlip}
              className="px-2.5 py-1 rounded-lg border border-border/70 hover:bg-muted text-muted-foreground hover:text-foreground text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors shadow-2xs group/btn"
              title="Lihat Related"
            >
              <span className="text-[11px]">Related</span>
              <ArrowRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Back Face (Warna icon app + tombol kembali di ujung bawah kanan persis Tools 100) */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl ${cardGradient} p-4 shadow-lg border border-white/20 flex flex-col justify-end items-end overflow-hidden [backface-visibility:hidden]`}
          style={{
            transform:
              interactionConfig.axis === "x"
                ? `rotateX(${180 * interactionConfig.dir}deg)`
                : `rotateY(${180 * interactionConfig.dir}deg)`,
          }}
        >
          <button
            type="button"
            onClick={handleFlip}
            className={kembaliBtnClass}
            title="Kembali"
          >
            <RotateCcw size={12} className="shrink-0" />
            <span className="text-[11px] font-medium">Kembali</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export function ModeSectionView({
  modeId,
  favorites: externalFavorites,
  toggleFavorite: externalToggleFavorite,
}: {
  modeId: string;
  favorites?: string[];
  toggleFavorite?: (to: string) => void;
}) {
  const { favorites: hookFavorites, toggleFavorite: hookToggleFavorite } = useFavorites();
  const favorites = externalFavorites ?? hookFavorites;
  const toggleFavorite = externalToggleFavorite ?? hookToggleFavorite;

  if (
    modeId === "mode_employment" ||
    modeId === "employment" ||
    modeId === "work_productivity" ||
    modeId === "mode_work_productivity"
  ) {
    return <WorkProductivityPage isEmbedded={true} />;
  }

  if (
    modeId === "mode_personal" ||
    modeId === "personal" ||
    modeId === "mode_personal_life" ||
    modeId === "personal_life" ||
    modeId === "personal-life" ||
    modeId === "personal-life-and-profile-management"
  ) {
    return <PersonalLifePage isEmbedded={true} />;
  }

  if (
    modeId === "mode_owner" ||
    modeId === "owner" ||
    modeId === "mode_business" ||
    modeId === "business" ||
    modeId === "mode_business_operations" ||
    modeId === "business_operations" ||
    modeId === "business-operations" ||
    modeId === "business_administration" ||
    modeId === "business-administration" ||
    modeId === "business-administration-and-operations-management"
  ) {
    return <BusinessOperationsCustomersPage isEmbedded={true} />;
  }

  if (
    modeId === "mode_creative" ||
    modeId === "creative" ||
    modeId === "creative_workspace" ||
    modeId === "creative-workspace" ||
    modeId === "creative-workspace-and-media-production"
  ) {
    return <CreativeWorkspaceMediaPage isEmbedded={true} />;
  }

  if (
    modeId === "mode_research" ||
    modeId === "research" ||
    modeId === "research_frameworks" ||
    modeId === "research-frameworks" ||
    modeId === "research-foundations-and-reference-frameworks" ||
    modeId === "mode_student" ||
    modeId === "student" ||
    modeId === "knowledge" ||
    modeId === "knowledge-and-learning"
  ) {
    return <ResearchFrameworksPage isEmbedded={true} />;
  }

  if (
    modeId === "mode_family" ||
    modeId === "family" ||
    modeId === "family_records" ||
    modeId === "family-records" ||
    modeId === "family-records-and-household-planning" ||
    modeId === "mode_household" ||
    modeId === "household" ||
    modeId === "home-leisure"
  ) {
    return <FamilyRecordsHouseholdPage isEmbedded={true} />;
  }

  if (
    modeId === "mode_public_affairs" ||
    modeId === "public_affairs" ||
    modeId === "public-affairs" ||
    modeId === "mode_public" ||
    modeId === "public" ||
    modeId === "policy" ||
    modeId === "public-relations-and-policy-affairs"
  ) {
    return <PublicRelationsPolicyAffairsPage isEmbedded={true} />;
  }

  if (
    modeId === "mode_networks" ||
    modeId === "networks" ||
    modeId === "contact_directory" ||
    modeId === "contact-directory" ||
    modeId === "social_networks" ||
    modeId === "social-networks" ||
    modeId === "contact-directory-and-social-networks" ||
    modeId === "mode_relatives" ||
    modeId === "relatives" ||
    modeId === "family-community"
  ) {
    return <ContactDirectoryNetworksPage isEmbedded={true} />;
  }

  if (
    modeId === "mode_sharia" ||
    modeId === "sharia" ||
    modeId === "sharia-values" ||
    modeId === "islamic-principles" ||
    modeId === "islamic-principles-and-sharia-values" ||
    modeId === "islamic_principles"
  ) {
    return <IslamicPrinciplesShariaValuesPage isEmbedded={true} />;
  }

  const config = MODE_CONFIGS[modeId];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <LauncherPageProvider pageId={config.id}>
      <div className="w-full mx-auto pt-3 sm:pt-4 space-y-4 animate-in fade-in duration-300">
        {/* Title (Matching MBA Page Header Style) */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground/90 tracking-tight flex items-center justify-center gap-2.5">
            <Icon className="size-7 text-primary" />
            <span>{config.label}</span>
          </h2>
        </div>

        {/* Grid Aplikasi Terintegrasi - Mengikuti gaya kotak Tools 100 */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {config.apps.map((app) => (
            <ModeFlipCard
              key={app.id}
              app={app}
              ecosystem={config.ecosystem}
              isFav={favorites.includes(app.to)}
              toggleFavorite={toggleFavorite}
              gradient={getGradient(app.name)}
            />
          ))}
          <MovedCardsGridItems pageId={config.id} />
        </div>
      </div>
    </LauncherPageProvider>
  );
}
