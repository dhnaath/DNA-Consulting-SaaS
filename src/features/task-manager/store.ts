import { useState, useEffect, useCallback, useMemo } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import {
  Task,
  Folder,
  Project,
  List,
  Tag,
  Activity,
  Comment,
  Attachment,
  TaskDependency,
  Reminder,
  TaskPriority,
  TaskStatus,
  DependencyType,
  TaskTemplate,
} from "./types";

const STORAGE_KEY = "aio_task_manager_data_v2";

interface TaskManagerState {
  tasks: Task[];
  projects: Project[];
  lists: List[];
  folders: Folder[];
  tags: Tag[];
  activities: Activity[];
  comments: Comment[];
  settings: {
    requireSubtasksComplete: boolean;
  };
}

const DEFAULT_FOLDERS: Folder[] = [
  { id: "f-corp", name: "Klien Korporasi", color: "#3b82f6" },
  { id: "f-internal", name: "Internal Firma", color: "#10b981" },
  { id: "f-personal", name: "Personal & Pengembangan", color: "#8b5cf6" },
];

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "p-audit",
    name: "Audit Manajemen & Tata Kelola",
    description: "Evaluasi sistem pengendalian internal dan kepatuhan operasional klien.",
    folderId: "f-corp",
    status: "active",
    color: "#3b82f6",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: "p-financial",
    name: "Perencanaan Finansial Q4",
    description: "Penyusunan anggaran biaya, proyeksi arus kas, dan likuiditas portofolio.",
    folderId: "f-internal",
    status: "active",
    color: "#10b981",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: "p-digital",
    name: "Digital Transformation Suite",
    description: "Peluncuran modul terpadu konsultan dan standarisasi antarmuka kerja.",
    folderId: "f-internal",
    status: "active",
    color: "#f59e0b",
    createdAt: new Date(Date.now() - 21 * 86400000).toISOString(),
  },
];

const DEFAULT_LISTS: List[] = [
  { id: "l-sprint", name: "Sprint Mingguan", projectId: "p-digital", color: "#3b82f6", createdAt: new Date().toISOString() },
  { id: "l-review", name: "Review Eksekutif", projectId: "p-audit", color: "#ef4444", createdAt: new Date().toISOString() },
  { id: "l-daily", name: "Pekerjaan Harian", color: "#10b981", createdAt: new Date().toISOString() },
];

const DEFAULT_TAGS: Tag[] = [
  { id: "tag-urgent", name: "Urgent", color: "#ef4444" },
  { id: "tag-finance", name: "Finance", color: "#10b981" },
  { id: "tag-legal", name: "Legal", color: "#6366f1" },
  { id: "tag-strategy", name: "Strategy", color: "#8b5cf6" },
  { id: "tag-ops", name: "Operations", color: "#f59e0b" },
];

const now = new Date();
const todayIso = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0).toISOString();
const tomorrowIso = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 0, 0).toISOString();
const overdueIso = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 18, 0, 0).toISOString();
const nextWeekIso = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5, 12, 0, 0).toISOString();

const DEFAULT_TASKS: Task[] = [
  {
    id: "task-wehiu-1",
    title: "Search inspirations for upcoming project",
    description: "Kumpulkan moodboard dan benchmark arsitektur visual untuk proyek baru.",
    notes: "Note: They like our behance project Mise",
    priority: "medium",
    status: "planned",
    colorTheme: "blue",
    tags: ["website", "client"],
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    assigneeTeam: [
      "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
      "/src/assets/images/avatar_team_male_1790522438325.jpg",
    ],
    customProgress: 40,
    checklist: [
      { id: "c-w1-1", label: "Browse Behance & Dribbble curation", checked: true },
      { id: "c-w1-2", label: "Export color palette swatches", checked: true },
      { id: "c-w1-3", label: "Create comparative moodboard deck", checked: false },
      { id: "c-w1-4", label: "Share with creative director", checked: false },
      { id: "c-w1-5", label: "Client alignment call", checked: false },
    ],
    attachments: [
      { id: "att-w1-1", taskId: "task-wehiu-1", name: "Inspirations_Mise.pdf", type: "document", url: "#", createdAt: new Date().toISOString() },
    ],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-2",
    title: "Ginko mobile app design",
    description: "Perancangan wireframe dan alur pendaftaran perbankan digital Ginko.",
    notes: "Note: We have a meeting 2:34 AM",
    priority: "high",
    status: "planned",
    colorTheme: "purple",
    tags: ["mobile app", "client"],
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    assigneeTeam: [
      "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
      "/src/assets/images/avatar_team_male_1790522438325.jpg",
    ],
    customProgress: 15,
    checklist: [
      { id: "c-w2-1", label: "Create user flow", checked: true },
      { id: "c-w2-2", label: "Make wireframe", checked: true },
      { id: "c-w2-3", label: "Design onboarding screens", checked: false },
      { id: "c-w2-4", label: "Make prototype", checked: false },
    ],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-3",
    title: "Make user flow of akua mobile banking app",
    description: "Spesifikasi transaksional transfer dan top-up e-wallet instan.",
    notes: "Review wireframe with fintech product owner",
    priority: "medium",
    status: "planned",
    colorTheme: "rose",
    tags: ["mobileapp", "client"],
    assigneeName: "Lead Designer",
    assigneeAvatar: "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    assigneeTeam: ["/src/assets/images/avatar_brooklyn_1790522423911.jpg"],
    customProgress: 30,
    checklist: [
      { id: "c-w3-1", label: "Wireframe sign-in & KYC", checked: true },
      { id: "c-w3-2", label: "Security token interaction", checked: false },
      { id: "c-w3-3", label: "Push notification flow", checked: false },
    ],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-4",
    title: "Wehiu product task and the task process pages",
    description: "Penyusunan kanban board dan komponen visual micro-interactions.",
    notes: "Have to finish this before weekend",
    priority: "high",
    status: "in_progress",
    colorTheme: "amber",
    imagePreview: "/src/assets/images/task_preview_ui_1790522454076.jpg",
    tags: ["dribbble shot", "product"],
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    assigneeTeam: [
      "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
      "/src/assets/images/avatar_team_male_1790522438325.jpg",
    ],
    customProgress: 90,
    checklist: [
      { id: "c-w4-1", label: "Grid layout & responsive breakpoints", checked: true },
      { id: "c-w4-2", label: "Interactive column drag states", checked: true },
      { id: "c-w4-3", label: "Card hover & pastel micro-tints", checked: true },
      { id: "c-w4-4", label: "Publish Dribbble showcase asset", checked: false },
    ],
    attachments: [
      { id: "att-w4-1", taskId: "task-wehiu-4", name: "Wehiu_Task_Process_Preview.png", type: "image", url: "/src/assets/images/task_preview_ui_1790522454076.jpg", createdAt: new Date().toISOString() },
    ],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-5",
    title: "Design CRM shop product page responsive website",
    description: "Optimalisasi landing e-commerce dan keranjang belanja omnichannel.",
    notes: "Periksa kompatibilitas browser mobile dan tablet",
    priority: "medium",
    status: "in_progress",
    colorTheme: "emerald",
    tags: ["products", "client"],
    assigneeName: "Alex Dev",
    assigneeAvatar: "/src/assets/images/avatar_team_male_1790522438325.jpg",
    assigneeTeam: [
      "/src/assets/images/avatar_team_male_1790522438325.jpg",
      "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    ],
    customProgress: 40,
    checklist: [
      { id: "c-w5-1", label: "Hero section checkout CTA", checked: true },
      { id: "c-w5-2", label: "Cart drawer drawer transition", checked: true },
      { id: "c-w5-3", label: "Cross-sell recommendations", checked: false },
      { id: "c-w5-4", label: "Payment gateway sandbox check", checked: false },
      { id: "c-w5-5", label: "Lighthouse performance audit", checked: false },
    ],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-6",
    title: "Orypto product landing page create in webflow",
    description: "Slicing visual landing page Webflow dengan micro-interactions GSAP.",
    notes: "Review animations with client creative team",
    priority: "high",
    status: "waiting",
    colorTheme: "pink",
    tags: ["development", "client"],
    assigneeName: "Alex Dev",
    assigneeAvatar: "/src/assets/images/avatar_team_male_1790522438325.jpg",
    assigneeTeam: [
      "/src/assets/images/avatar_team_male_1790522438325.jpg",
      "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    ],
    customProgress: 70,
    checklist: [
      { id: "c-w6-1", label: "CMS Collections setup", checked: true },
      { id: "c-w6-2", label: "Custom code embed", checked: true },
      { id: "c-w6-3", label: "Form webhook integration", checked: false },
    ],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-7",
    title: "Natverk video platform web app design and develop",
    description: "Arsitektur antarmuka streaming video terdesentralisasi.",
    notes: "Review video player controls & keyboard shortcuts",
    priority: "medium",
    status: "waiting",
    colorTheme: "cyan",
    tags: ["product", "client"],
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    assigneeTeam: [
      "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
      "/src/assets/images/avatar_team_male_1790522438325.jpg",
    ],
    customProgress: 60,
    checklist: [],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-8",
    title: "Redesign grab website landing and login pages",
    description: "Redesain estetika portal autentikasi pengguna dengan sistem single sign-on.",
    notes: "Note: We have a meeting 3:12 AM",
    priority: "high",
    status: "waiting",
    colorTheme: "amber",
    tags: ["website", "client"],
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    assigneeTeam: ["/src/assets/images/avatar_brooklyn_1790522423911.jpg"],
    customProgress: 50,
    checklist: [],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-9",
    title: "Create Odyah app prototype for Get notification in figma",
    description: "Komponen interaktif banner notifikasi dinamis dan push trigger states.",
    notes: "Figma interactive component variants",
    priority: "medium",
    status: "waiting",
    colorTheme: "purple",
    tags: ["mobileapp", "client"],
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    assigneeTeam: ["/src/assets/images/avatar_brooklyn_1790522423911.jpg"],
    customProgress: 80,
    checklist: [],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-10",
    title: "Affitto product full service",
    description: "Peluncuran identitas merek, desain aplikasi mobile, landing page, dan sistem dasbor.",
    notes: "All milestones accomplished and approved by stakeholder",
    priority: "high",
    status: "completed",
    colorTheme: "cyan",
    tags: ["mobile app", "client"],
    assigneeName: "Brooklyn Simmons",
    assigneeAvatar: "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    assigneeTeam: [
      "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
      "/src/assets/images/avatar_team_male_1790522438325.jpg",
    ],
    customProgress: 100,
    checklist: [
      { id: "c-w10-1", label: "Branding", checked: true },
      { id: "c-w10-2", label: "Mobile app design & development", checked: true },
      { id: "c-w10-3", label: "Landing page design & development", checked: true },
      { id: "c-w10-4", label: "Dashboard design & development", checked: true },
      { id: "c-w10-5", label: "Marketing", checked: true },
    ],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-wehiu-11",
    title: "Design Moli app product page redesign",
    description: "Penyegaran visual katalog produk dan alur pemesanan retail Moli.",
    notes: "Shipped to production v2.4",
    priority: "medium",
    status: "completed",
    colorTheme: "rose",
    tags: ["products", "client"],
    assigneeName: "Alex Dev",
    assigneeAvatar: "/src/assets/images/avatar_team_male_1790522438325.jpg",
    assigneeTeam: [
      "/src/assets/images/avatar_team_male_1790522438325.jpg",
      "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
    ],
    customProgress: 100,
    checklist: [],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-1",
    title: "Finalisasi Lembar Evaluasi SWOT Korporasi",
    description: "Konsolidasi hasil wawancara manajemen unit bisnis dan pemetaan kuadran ancaman eksternal ke dalam matriks keputusan.",
    priority: "high",
    status: "in_progress",
    projectId: "p-audit",
    listId: "l-review",
    folderId: "f-corp",
    startAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    dueAt: todayIso,
    duration: 120,
    tags: ["tag-strategy", "tag-urgent"],
    assigneeName: "Dhia (Lead Consultant)",
    checklist: [
      { id: "c-1", label: "Periksa data margin laba per kuadran", checked: true },
      { id: "c-2", label: "Sinkronkan rekomendasi mitigasi risiko ISO", checked: false },
      { id: "c-3", label: "Kirim draft ke Direktur Operasional", checked: false },
    ],
    attachments: [
      {
        id: "att-1",
        taskId: "task-1",
        name: "SWOT_Analysis_Audit_Draft.pdf",
        type: "document",
        url: "#",
        size: 1450000,
        createdAt: new Date().toISOString(),
      },
    ],
    links: ["https://example.com/reports/swot-final"],
    dependencies: [],
    reminders: [
      {
        id: "rem-1",
        taskId: "task-1",
        type: "before_due",
        offsetMinutes: 60,
        status: "pending",
      },
    ],
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-1-sub1",
    title: "Validasi angka HPP dan rantai pasok dengan manajer gudang",
    description: "Memastikan asumsi input-output bahan baku akurat.",
    priority: "medium",
    status: "completed",
    parentTaskId: "task-1",
    projectId: "p-audit",
    tags: ["tag-ops"],
    checklist: [],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "task-1-sub2",
    title: "Buat ringkasan eksekutif 1 halaman (Executive Brief)",
    description: "Format high-contrast untuk presentasi Dewan Komisaris.",
    priority: "high",
    status: "in_progress",
    parentTaskId: "task-1",
    projectId: "p-audit",
    tags: ["tag-strategy"],
    checklist: [],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Rekonsiliasi Arus Kas Mingguan & Alokasi Surety",
    description: "Verifikasi pencatatan pengeluaran operasional dan perhitungan rasio dana darurat minimal 6 bulan pengeluaran rutin.",
    priority: "urgent",
    status: "planned",
    projectId: "p-financial",
    listId: "l-sprint",
    folderId: "f-internal",
    startAt: todayIso,
    dueAt: tomorrowIso,
    duration: 90,
    tags: ["tag-finance", "tag-urgent"],
    assigneeName: "Analis Keuangan",
    checklist: [
      { id: "c-4", label: "Tarik mutasi rekening giro korporat", checked: false },
      { id: "c-5", label: "Cocokkan dengan buku besar kas kecil", checked: false },
    ],
    attachments: [],
    links: [],
    dependencies: [
      {
        id: "dep-1",
        taskId: "task-2",
        dependsOnTaskId: "task-1",
        type: "finish_to_start",
      },
    ],
    reminders: [
      {
        id: "rem-2",
        taskId: "task-2",
        type: "datetime",
        triggerAt: tomorrowIso,
        status: "pending",
      },
    ],
    recurrence: {
      type: "weekly",
      interval: 1,
      daysOfWeek: [5], // Jum'at
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Review Kontrak Kerja Sama Lisensi Mitra Strategis",
    description: "Pemeriksaan klausul kerahasiaan data (NDA), batas liabilitas perdata, dan kesepakatan pembagian revenue sharing.",
    priority: "medium",
    status: "waiting",
    projectId: "p-audit",
    listId: "l-review",
    folderId: "f-corp",
    startAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    dueAt: overdueIso,
    duration: 60,
    tags: ["tag-legal"],
    assigneeName: "Konsultan Hukum",
    checklist: [],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    notes: "Menunggu paraf konfirmasi balik dari tim legal eksternal mitra.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Ideasi Fitur Pelacak Waktu Kerja Konsultan",
    description: "Konsep time-blocking terintegrasi kalender tanpa memerlukan koneksi eksternal yang rumit.",
    priority: "none",
    status: "inbox",
    folderId: "f-personal",
    tags: ["tag-ops"],
    checklist: [],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "task-5",
    title: "Pembaruan Standar Operasional Prosedur (SOP) Analis",
    description: "Dokumentasi baku metode kerja dan protokol keamanan penyimpanan data klien.",
    priority: "low",
    status: "completed",
    projectId: "p-digital",
    listId: "l-daily",
    folderId: "f-internal",
    startAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    dueAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    duration: 180,
    tags: ["tag-ops"],
    checklist: [
      { id: "c-6", label: "Tulis draf bab 1-3", checked: true },
      { id: "c-7", label: "Tinjau bersama tim manajemen", checked: true },
      { id: "c-8", label: "Publikasi ke portal dokumen internal", checked: true },
    ],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "task-6",
    title: "Persiapan Materi Workshop Strategic Thinking",
    description: "Slide kanvas bisnis, panduan studi kasus, dan lembar kerja peserta untuk sesi pelatihan eksekutif minggu depan.",
    priority: "high",
    status: "planned",
    projectId: "p-digital",
    listId: "l-sprint",
    startAt: todayIso,
    dueAt: nextWeekIso,
    duration: 240,
    tags: ["tag-strategy"],
    checklist: [],
    attachments: [],
    links: [],
    dependencies: [],
    reminders: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: "act-1",
    taskId: "task-1",
    type: "Task Created",
    fieldChanged: "status",
    newValue: "inbox",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "act-2",
    taskId: "task-1",
    type: "Status Changed",
    fieldChanged: "status",
    oldValue: "inbox",
    newValue: "in_progress",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "act-3",
    taskId: "task-5",
    type: "Status Changed",
    fieldChanged: "status",
    oldValue: "in_progress",
    newValue: "completed",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: "com-1",
    taskId: "task-1",
    userId: "u-1",
    userName: "Dhia",
    content: "Catatan: Bagian ancaman tarif impor baru perlu diberi bobot skor risiko minimal 4 (Tinggi).",
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: "tpl-project-launch",
    name: "Peluncuran Proyek Konsultansi (Project Launch)",
    description: "Siklus terstruktur 5 fase dari riset awal hingga peluncuran laporan final ke klien.",
    category: "Consulting",
    tasks: [
      {
        title: "Fase 1: Research & Discovery",
        description: "Wawancara stakeholder kunci dan audit data historis.",
        priority: "high",
        relativeStartDays: 0,
        relativeDueDays: 3,
        checklist: ["Kuesioner wawancara", "Audit dokumen pendukung", "Peta pemangku kepentingan"],
      },
      {
        title: "Fase 2: Strategic Planning & Modeling",
        description: "Penyusunan hipotesis solusi dan model bisnis.",
        priority: "high",
        relativeStartDays: 3,
        relativeDueDays: 7,
        checklist: ["Kerangka SWOT & BMC", "Validasi finansial awal"],
      },
      {
        title: "Fase 3: Design & Action Roadmapping",
        description: "Rencana implementasi taktis per kuartal.",
        priority: "medium",
        relativeStartDays: 7,
        relativeDueDays: 12,
        checklist: ["Matriks RACI", "Timeline implementasi"],
      },
      {
        title: "Fase 4: Testing & Pilot Run",
        description: "Uji coba skala terbatas bersama tim pilot klien.",
        priority: "medium",
        relativeStartDays: 12,
        relativeDueDays: 18,
      },
      {
        title: "Fase 5: Final Delivery & Executive Presentation",
        description: "Penyampaian laporan final dan serah terima dokumen kerja.",
        priority: "urgent",
        relativeStartDays: 18,
        relativeDueDays: 21,
      },
    ],
  },
  {
    id: "tpl-financial-audit",
    name: "Audit Keuangan & Arus Kas Bisnis",
    description: "Pemeriksaan kesehatan finansial, rasio solvabilitas, dan kepatuhan perpajakan.",
    category: "Finance",
    tasks: [
      {
        title: "Koleksi Rekening Koran & Laporan Laba Rugi 12 Bulan",
        priority: "high",
        relativeStartDays: 0,
        relativeDueDays: 2,
        checklist: ["Laporan Neraca", "Buku Kas Kecil", "Daftar Piutang Dagang"],
      },
      {
        title: "Perhitungan 8 Rasio Finansial Utama (Current, Quick, ROE, DER)",
        priority: "high",
        relativeStartDays: 2,
        relativeDueDays: 4,
      },
      {
        title: "Audit Beban Operasional & Rekomendasi Efisiensi Biaya",
        priority: "medium",
        relativeStartDays: 4,
        relativeDueDays: 7,
      },
      {
        title: "Penyusunan Rencana Likuiditas & Dana Cadangan Darurat",
        priority: "urgent",
        relativeStartDays: 7,
        relativeDueDays: 10,
      },
    ],
  },
];

// Helper: load initial state from localStorage or default
function loadInitialState(): TaskManagerState {
  try {
    const raw = getRaw(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.tasks)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to load task manager state:", err);
  }
  return {
    tasks: DEFAULT_TASKS,
    projects: DEFAULT_PROJECTS,
    lists: DEFAULT_LISTS,
    folders: DEFAULT_FOLDERS,
    tags: DEFAULT_TAGS,
    activities: DEFAULT_ACTIVITIES,
    comments: DEFAULT_COMMENTS,
    settings: {
      requireSubtasksComplete: false,
    },
  };
}

// Global subscriber listener
let globalState = loadInitialState();
const listeners = new Set<() => void>();

function notifyListeners() {
  try {
    setRaw(STORAGE_KEY, JSON.stringify(globalState));
  } catch (err) {
    console.error("Failed to save task manager state:", err);
  }
  listeners.forEach((listener) => listener());
}

export function useTaskManager() {
  const [state, setState] = useState<TaskManagerState>(() => globalState);

  useEffect(() => {
    const update = () => setState({ ...globalState });
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  // Helper to log activity
  const logActivity = useCallback(
    (taskId: string, type: string, fieldChanged?: string, oldValue?: string, newValue?: string) => {
      const act: Activity = {
        id: "act-" + Math.random().toString(36).substring(2, 9),
        taskId,
        type,
        fieldChanged,
        oldValue,
        newValue,
        createdAt: new Date().toISOString(),
      };
      globalState = {
        ...globalState,
        activities: [act, ...globalState.activities],
      };
    },
    []
  );

  // 1. Create Task (Progressive Disclosure / Quick Capture)
  const createTask = useCallback(
    (partial: Partial<Task>): Task => {
      const nowIso = new Date().toISOString();
      const newTask: Task = {
        id: "task-" + Math.random().toString(36).substring(2, 9),
        title: partial.title || "Tugas Baru",
        description: partial.description || "",
        checklist: partial.checklist || [],
        notes: partial.notes || "",
        priority: partial.priority || "none",
        status: partial.status || "inbox",
        projectId: partial.projectId,
        listId: partial.listId,
        folderId: partial.folderId,
        parentTaskId: partial.parentTaskId,
        startAt: partial.startAt,
        dueAt: partial.dueAt,
        duration: partial.duration,
        location: partial.location,
        tags: partial.tags || [],
        assigneeId: partial.assigneeId,
        assigneeName: partial.assigneeName,
        attachments: partial.attachments || [],
        links: partial.links || [],
        dependencies: partial.dependencies || [],
        reminders: partial.reminders || [],
        recurrence: partial.recurrence,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      globalState = {
        ...globalState,
        tasks: [newTask, ...globalState.tasks],
      };
      logActivity(newTask.id, "Task Created");
      notifyListeners();
      return newTask;
    },
    [logActivity]
  );

  // 2. Update Task
  const updateTask = useCallback(
    (id: string, updates: Partial<Task>) => {
      const existing = globalState.tasks.find((t) => t.id === id);
      if (!existing) return;

      const nowIso = new Date().toISOString();

      // Track activity logs for specific fields
      if (updates.status && updates.status !== existing.status) {
        logActivity(id, "Status Changed", "status", existing.status, updates.status);
      }
      if (updates.priority && updates.priority !== existing.priority) {
        logActivity(id, "Priority Changed", "priority", existing.priority, updates.priority);
      }
      if (updates.dueAt && updates.dueAt !== existing.dueAt) {
        logActivity(id, "Due Date Changed", "dueAt", existing.dueAt, updates.dueAt);
      }
      if (updates.assigneeName && updates.assigneeName !== existing.assigneeName) {
        logActivity(id, "Assigned", "assigneeName", existing.assigneeName, updates.assigneeName);
      }

      globalState = {
        ...globalState,
        tasks: globalState.tasks.map((t) =>
          t.id === id ? { ...t, ...updates, updatedAt: nowIso } : t
        ),
      };
      notifyListeners();
    },
    [logActivity]
  );

  // 3. Complete Task (Handles Recurrence & Subtasks check)
  const completeTask = useCallback(
    (id: string): { success: boolean; message?: string } => {
      const task = globalState.tasks.find((t) => t.id === id);
      if (!task) return { success: false, message: "Task tidak ditemukan" };

      // Check setting: require_subtasks_complete
      if (globalState.settings.requireSubtasksComplete) {
        const subtasks = globalState.tasks.filter((t) => t.parentTaskId === id);
        const hasIncomplete = subtasks.some((s) => s.status !== "completed" && s.status !== "cancelled");
        if (hasIncomplete) {
          return {
            success: false,
            message: "Subtask belum selesai. Harap selesaikan seluruh subtask terlebih dahulu.",
          };
        }
      }

      const nowIso = new Date().toISOString();

      // Complete current task
      let updatedTasks = globalState.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "completed" as TaskStatus,
              completedAt: nowIso,
              updatedAt: nowIso,
            }
          : t
      );

      logActivity(id, "Completed", "status", task.status, "completed");

      // Handle Recurrence: generate next instance if configured
      if (task.recurrence) {
        const nextDates = calculateNextRecurringDate(task.recurrence, task.dueAt || nowIso);
        if (nextDates) {
          const nextTask: Task = {
            ...task,
            id: "task-" + Math.random().toString(36).substring(2, 9),
            status: "planned",
            startAt: nextDates.startAt,
            dueAt: nextDates.dueAt,
            checklist: task.checklist.map((c) => ({ ...c, checked: false })),
            completedAt: undefined,
            createdAt: nowIso,
            updatedAt: nowIso,
          };
          updatedTasks = [nextTask, ...updatedTasks];
          logActivity(nextTask.id, "Task Created (Recurring Instance)");
        }
      }

      globalState = {
        ...globalState,
        tasks: updatedTasks,
      };
      notifyListeners();
      return { success: true };
    },
    [logActivity]
  );

  // 4. Reopen Task
  const reopenTask = useCallback(
    (id: string) => {
      const task = globalState.tasks.find((t) => t.id === id);
      if (!task) return;

      const newStatus: TaskStatus = task.dueAt ? "planned" : "inbox";
      globalState = {
        ...globalState,
        tasks: globalState.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status: newStatus,
                completedAt: undefined,
                updatedAt: new Date().toISOString(),
              }
            : t
        ),
      };
      logActivity(id, "Reopened", "status", task.status, newStatus);
      notifyListeners();
    },
    [logActivity]
  );

  // 5. Delete Task (With option to cascade or promote subtasks)
  const deleteTask = useCallback(
    (id: string, cascadeSubtasks = false) => {
      const task = globalState.tasks.find((t) => t.id === id);
      if (!task) return;

      let remaining = globalState.tasks.filter((t) => t.id !== id);
      if (cascadeSubtasks) {
        // Delete all descendant subtasks recursively
        const toDeleteIds = new Set<string>([id]);
        let changed = true;
        while (changed) {
          changed = false;
          remaining.forEach((t) => {
            if (t.parentTaskId && toDeleteIds.has(t.parentTaskId) && !toDeleteIds.has(t.id)) {
              toDeleteIds.add(t.id);
              changed = true;
            }
          });
        }
        remaining = remaining.filter((t) => !toDeleteIds.has(t.id));
      } else {
        // Promote subtasks to top-level or parent's parent
        remaining = remaining.map((t) =>
          t.parentTaskId === id ? { ...t, parentTaskId: task.parentTaskId } : t
        );
      }

      globalState = {
        ...globalState,
        tasks: remaining,
        activities: globalState.activities.filter((a) => a.taskId !== id),
        comments: globalState.comments.filter((c) => c.taskId !== id),
      };
      notifyListeners();
    },
    []
  );

  // 6. Archive / Unarchive Task
  const archiveTask = useCallback(
    (id: string) => {
      const nowIso = new Date().toISOString();
      globalState = {
        ...globalState,
        tasks: globalState.tasks.map((t) =>
          t.id === id
            ? { ...t, status: "archived" as TaskStatus, archivedAt: nowIso, updatedAt: nowIso }
            : t
        ),
      };
      logActivity(id, "Status Changed", "status", undefined, "archived");
      notifyListeners();
    },
    [logActivity]
  );

  const unarchiveTask = useCallback(
    (id: string) => {
      const task = globalState.tasks.find((t) => t.id === id);
      const newStatus: TaskStatus = task?.dueAt ? "planned" : "inbox";
      globalState = {
        ...globalState,
        tasks: globalState.tasks.map((t) =>
          t.id === id
            ? { ...t, status: newStatus, archivedAt: undefined, updatedAt: new Date().toISOString() }
            : t
        ),
      };
      logActivity(id, "Status Changed", "status", "archived", newStatus);
      notifyListeners();
    },
    [logActivity]
  );

  // 7. Duplicate Task
  const duplicateTask = useCallback(
    (id: string): Task | null => {
      const task = globalState.tasks.find((t) => t.id === id);
      if (!task) return null;

      const nowIso = new Date().toISOString();
      const clone: Task = {
        ...task,
        id: "task-" + Math.random().toString(36).substring(2, 9),
        title: `${task.title} (Salinan)`,
        checklist: task.checklist.map((c) => ({ ...c, id: "c-" + Math.random().toString(36).substring(2, 7) })),
        status: task.status === "completed" ? "inbox" : task.status,
        completedAt: undefined,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      globalState = {
        ...globalState,
        tasks: [clone, ...globalState.tasks],
      };
      logActivity(clone.id, "Task Created (Duplicated)");
      notifyListeners();
      return clone;
    },
    [logActivity]
  );

  // 8. Circular Dependency Detection & Add Dependency
  const addDependency = useCallback(
    (
      taskId: string,
      dependsOnTaskId: string,
      type: DependencyType = "finish_to_start"
    ): { success: boolean; error?: string } => {
      if (taskId === dependsOnTaskId) {
        return { success: false, error: "Task tidak bisa bergantung pada dirinya sendiri." };
      }

      // Check if dependsOnTaskId already indirectly depends on taskId (Cycle detection)
      const isReachable = (startId: string, targetId: string, visited = new Set<string>()): boolean => {
        if (startId === targetId) return true;
        if (visited.has(startId)) return false;
        visited.add(startId);

        const currentTask = globalState.tasks.find((t) => t.id === startId);
        if (!currentTask || !currentTask.dependencies) return false;

        for (const dep of currentTask.dependencies) {
          if (isReachable(dep.dependsOnTaskId, targetId, visited)) {
            return true;
          }
        }
        return false;
      };

      if (isReachable(dependsOnTaskId, taskId)) {
        return {
          success: false,
          error: "Terdeteksi relasi sirkular (Circular Dependency). Penambahan dibatalkan demi integritas data.",
        };
      }

      const newDep: TaskDependency = {
        id: "dep-" + Math.random().toString(36).substring(2, 9),
        taskId,
        dependsOnTaskId,
        type,
      };

      globalState = {
        ...globalState,
        tasks: globalState.tasks.map((t) =>
          t.id === taskId
            ? { ...t, dependencies: [...t.dependencies.filter((d) => d.dependsOnTaskId !== dependsOnTaskId), newDep] }
            : t
        ),
      };
      logActivity(taskId, "Dependency Added");
      notifyListeners();
      return { success: true };
    },
    [logActivity]
  );

  const removeDependency = useCallback((taskId: string, depId: string) => {
    globalState = {
      ...globalState,
      tasks: globalState.tasks.map((t) =>
        t.id === taskId
          ? { ...t, dependencies: t.dependencies.filter((d) => d.id !== depId) }
          : t
      ),
    };
    notifyListeners();
  }, []);

  // 9. Checklist Operations
  const toggleChecklist = useCallback((taskId: string, checklistId: string) => {
    globalState = {
      ...globalState,
      tasks: globalState.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.map((c) =>
                c.id === checklistId ? { ...c, checked: !c.checked } : c
              ),
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    };
    notifyListeners();
  }, []);

  const addChecklistItem = useCallback((taskId: string, label: string) => {
    if (!label.trim()) return;
    const newItem = {
      id: "c-" + Math.random().toString(36).substring(2, 9),
      label: label.trim(),
      checked: false,
    };
    globalState = {
      ...globalState,
      tasks: globalState.tasks.map((t) =>
        t.id === taskId
          ? { ...t, checklist: [...t.checklist, newItem], updatedAt: new Date().toISOString() }
          : t
      ),
    };
    notifyListeners();
  }, []);

  const deleteChecklistItem = useCallback((taskId: string, checklistId: string) => {
    globalState = {
      ...globalState,
      tasks: globalState.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.filter((c) => c.id !== checklistId),
              updatedAt: new Date().toISOString(),
            }
          : t
      ),
    };
    notifyListeners();
  }, []);

  // 10. Comments
  const addComment = useCallback(
    (taskId: string, content: string, parentCommentId?: string) => {
      if (!content.trim()) return;
      const newComment: Comment = {
        id: "com-" + Math.random().toString(36).substring(2, 9),
        taskId,
        parentCommentId,
        userId: "u-current",
        userName: "Dhia (Consultant)",
        content: content.trim(),
        createdAt: new Date().toISOString(),
      };
      globalState = {
        ...globalState,
        comments: [newComment, ...globalState.comments],
      };
      logActivity(taskId, "Comment Added");
      notifyListeners();
    },
    [logActivity]
  );

  // 11. Reminders
  const addReminder = useCallback((taskId: string, reminder: Omit<Reminder, "id" | "taskId">) => {
    const newRem: Reminder = {
      ...reminder,
      id: "rem-" + Math.random().toString(36).substring(2, 9),
      taskId,
    };
    globalState = {
      ...globalState,
      tasks: globalState.tasks.map((t) =>
        t.id === taskId ? { ...t, reminders: [...t.reminders, newRem] } : t
      ),
    };
    notifyListeners();
  }, []);

  const removeReminder = useCallback((taskId: string, reminderId: string) => {
    globalState = {
      ...globalState,
      tasks: globalState.tasks.map((t) =>
        t.id === taskId ? { ...t, reminders: t.reminders.filter((r) => r.id !== reminderId) } : t
      ),
    };
    notifyListeners();
  }, []);

  // 12. Attachments
  const addAttachment = useCallback(
    (taskId: string, att: Omit<Attachment, "id" | "taskId" | "createdAt">) => {
      const newAtt: Attachment = {
        ...att,
        id: "att-" + Math.random().toString(36).substring(2, 9),
        taskId,
        createdAt: new Date().toISOString(),
      };
      globalState = {
        ...globalState,
        tasks: globalState.tasks.map((t) =>
          t.id === taskId ? { ...t, attachments: [...t.attachments, newAtt] } : t
        ),
      };
      logActivity(taskId, "Attachment Added");
      notifyListeners();
    },
    [logActivity]
  );

  // 13. Bulk Actions
  const bulkUpdateStatus = useCallback((taskIds: string[], status: TaskStatus) => {
    const nowIso = new Date().toISOString();
    globalState = {
      ...globalState,
      tasks: globalState.tasks.map((t) =>
        taskIds.includes(t.id)
          ? {
              ...t,
              status,
              completedAt: status === "completed" ? nowIso : undefined,
              archivedAt: status === "archived" ? nowIso : undefined,
              updatedAt: nowIso,
            }
          : t
      ),
    };
    notifyListeners();
  }, []);

  const bulkUpdatePriority = useCallback((taskIds: string[], priority: TaskPriority) => {
    const nowIso = new Date().toISOString();
    globalState = {
      ...globalState,
      tasks: globalState.tasks.map((t) =>
        taskIds.includes(t.id) ? { ...t, priority, updatedAt: nowIso } : t
      ),
    };
    notifyListeners();
  }, []);

  const bulkDelete = useCallback((taskIds: string[]) => {
    globalState = {
      ...globalState,
      tasks: globalState.tasks.filter((t) => !taskIds.includes(t.id)),
    };
    notifyListeners();
  }, []);

  // 14. Apply Template
  const applyTemplate = useCallback(
    (templateId: string, anchorDate: string, projectId?: string) => {
      const tpl = TASK_TEMPLATES.find((t) => t.id === templateId);
      if (!tpl) return;

      const anchor = new Date(anchorDate).getTime();
      const newTasks: Task[] = tpl.tasks.map((item, idx) => {
        const start = new Date(anchor + item.relativeStartDays * 86400000).toISOString();
        const due = new Date(anchor + item.relativeDueDays * 86400000).toISOString();
        const nowIso = new Date().toISOString();

        return {
          id: `task-tpl-${Date.now()}-${idx}`,
          title: item.title,
          description: item.description || "",
          priority: item.priority,
          status: "planned",
          projectId,
          startAt: start,
          dueAt: due,
          checklist: (item.checklist || []).map((label, cIdx) => ({
            id: `c-tpl-${idx}-${cIdx}`,
            label,
            checked: false,
          })),
          attachments: [],
          links: [],
          dependencies: [],
          reminders: [],
          tags: [],
          createdAt: nowIso,
          updatedAt: nowIso,
        };
      });

      globalState = {
        ...globalState,
        tasks: [...newTasks, ...globalState.tasks],
      };
      notifyListeners();
    },
    []
  );

  // 15. Create Project & Tags
  const createProject = useCallback((name: string, description?: string, folderId?: string) => {
    const newProj: Project = {
      id: "p-" + Math.random().toString(36).substring(2, 9),
      name,
      description,
      folderId,
      status: "active",
      createdAt: new Date().toISOString(),
    };
    globalState = {
      ...globalState,
      projects: [...globalState.projects, newProj],
    };
    notifyListeners();
    return newProj;
  }, []);

  const createTag = useCallback((name: string, color: string) => {
    const newTag: Tag = {
      id: "tag-" + Math.random().toString(36).substring(2, 9),
      name,
      color,
    };
    globalState = {
      ...globalState,
      tags: [...globalState.tags, newTag],
    };
    notifyListeners();
    return newTag;
  }, []);

  // Computed subtask progress rollup:
  // parent.progress = count(completed subtasks) / count(subtasks)
  const getSubtaskProgress = useCallback(
    (taskId: string): { total: number; completed: number; percentage: number } => {
      const subtasks = state.tasks.filter((t) => t.parentTaskId === taskId && t.status !== "archived");
      if (subtasks.length === 0) return { total: 0, completed: 0, percentage: 0 };
      const completed = subtasks.filter((s) => s.status === "completed").length;
      return {
        total: subtasks.length,
        completed,
        percentage: Math.round((completed / subtasks.length) * 100),
      };
    },
    [state.tasks]
  );

  // Computed Statistics (Section 17 in spec)
  const statistics = useMemo(() => {
    const activeTasks = state.tasks.filter((t) => t.status !== "archived");
    const total = activeTasks.length;
    const completed = activeTasks.filter((t) => t.status === "completed").length;
    const incomplete = activeTasks.filter(
      (t) => t.status !== "completed" && t.status !== "cancelled"
    ).length;

    const nowTime = Date.now();
    const overdue = activeTasks.filter((t) => {
      if (!t.dueAt) return false;
      if (t.status === "completed" || t.status === "cancelled") return false;
      return new Date(t.dueAt).getTime() < nowTime;
    }).length;

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const nonCancelledTotal = activeTasks.filter((t) => t.status !== "cancelled").length;
    const overdueRate = nonCancelledTotal > 0 ? Math.round((overdue / nonCancelledTotal) * 100) : 0;

    // Priority breakdown
    const byPriority: Record<TaskPriority, number> = {
      none: 0,
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };
    activeTasks.forEach((t) => {
      byPriority[t.priority] = (byPriority[t.priority] || 0) + 1;
    });

    // Project breakdown
    const byProject: Record<string, number> = {};
    activeTasks.forEach((t) => {
      const pId = t.projectId || "unassigned";
      byProject[pId] = (byProject[pId] || 0) + 1;
    });

    return {
      total,
      completed,
      incomplete,
      overdue,
      completionRate,
      overdueRate,
      byPriority,
      byProject,
    };
  }, [state.tasks]);

  return {
    ...state,
    createTask,
    updateTask,
    completeTask,
    reopenTask,
    deleteTask,
    archiveTask,
    unarchiveTask,
    duplicateTask,
    addDependency,
    removeDependency,
    toggleChecklist,
    addChecklistItem,
    deleteChecklistItem,
    addComment,
    addReminder,
    removeReminder,
    addAttachment,
    bulkUpdateStatus,
    bulkUpdatePriority,
    bulkDelete,
    applyTemplate,
    createProject,
    createTag,
    getSubtaskProgress,
    statistics,
  };
}

// Recurrence calculation helper
function calculateNextRecurringDate(
  recurrence: NonNullable<Task["recurrence"]>,
  currentDateIso: string
): { startAt?: string; dueAt?: string } | null {
  const current = new Date(currentDateIso);
  if (isNaN(current.getTime())) return null;

  const next = new Date(current.getTime());
  const interval = recurrence.interval || 1;

  switch (recurrence.type) {
    case "daily":
      next.setDate(next.getDate() + interval);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7 * interval);
      break;
    case "monthly":
      next.setMonth(next.getMonth() + interval);
      break;
    case "yearly":
      next.setFullYear(next.getFullYear() + interval);
      break;
    case "after_completion":
      next.setDate(new Date().getDate() + interval);
      break;
    default:
      next.setDate(next.getDate() + interval);
  }

  // Check end date
  if (recurrence.endDate && next.getTime() > new Date(recurrence.endDate).getTime()) {
    return null;
  }

  return {
    dueAt: next.toISOString(),
  };
}
