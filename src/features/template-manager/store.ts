import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  EcosystemTemplate,
  TemplateCategory,
  ApplicationRecord,
  TemplateVisibility,
} from "./types";

interface TemplateStore {
  templates: EcosystemTemplate[];
  categories: TemplateCategory[];
  applicationRecords: ApplicationRecord[];
  selectedTemplateId: string | null;

  // Actions
  createTemplate: (template: Omit<EcosystemTemplate, "id" | "createdAt" | "usageCount">) => void;
  updateTemplateMetadata: (
    id: string,
    updates: Partial<Pick<EcosystemTemplate, "name" | "description" | "categoryId" | "visibility">>
  ) => void;
  deleteTemplate: (id: string) => void;
  duplicateTemplate: (id: string) => void;
  publishTemplate: (id: string) => void;
  applyTemplate: (
    templateId: string,
    anchorValues: Record<string, string>,
    appliedBy?: string
  ) => { success: boolean; resultingEntityId: string; resolvedStructure: any };
  createCategory: (name: string, description?: string) => void;
  setSelectedTemplateId: (id: string | null) => void;
}

const INITIAL_CATEGORIES: TemplateCategory[] = [
  { id: "cat-1", name: "Manajemen Proyek", description: "Struktur fase, milestone, dan checklist proyek" },
  { id: "cat-2", name: "Dokumentasi & Wiki", description: "Halaman panduan SOP, architecture note, dan meeting review" },
  { id: "cat-3", name: "Onboarding Karyawan", description: "Checklist orientasi dan setup akun anggota tim baru" },
  { id: "cat-4", name: "Kualitas & QA", description: "Form audit, pengujian regresi, dan validasi DoD" },
];

const INITIAL_TEMPLATES: EcosystemTemplate[] = [
  {
    id: "tmpl-01",
    name: "Peluncuran Produk Digital 60 Hari",
    description: "Template standar Project Manager (#03) lengkap dengan 3 fase: R&D, Beta Testing, dan Go-to-Market.",
    sourceApp: "project_manager",
    categoryId: "cat-1",
    visibility: "workspace",
    usageCount: 14,
    createdBy: "Andi Pratama (Product Lead)",
    createdAt: "2026-09-02T10:00:00Z",
    variables: [
      {
        id: "var-01-1",
        templateId: "tmpl-01",
        key: "{{product_name}}",
        type: "text_placeholder",
        defaultValue: "SuperApp v2",
        description: "Nama produk yang diluncurkan",
      },
      {
        id: "var-01-2",
        templateId: "tmpl-01",
        key: "{{start_date}}",
        type: "date_relative",
        defaultValue: "hari_ini",
        description: "Tanggal kick-off proyek",
      },
      {
        id: "var-01-3",
        templateId: "tmpl-01",
        key: "{{due_beta}}",
        type: "date_relative",
        defaultValue: "start_date + 30 hari",
        description: "Target rilis beta ke klien terbatas",
      },
    ],
    structure: {
      type: "project_structure",
      phases: [
        { name: "Fase 1: Discovery & Wireframing", durationDays: 14 },
        { name: "Fase 2: Development & QA", durationDays: 30 },
        { name: "Fase 3: Deployment & Marketing", durationDays: 16 },
      ],
      milestones: ["Wireframe Signoff", "Beta Release", "Commercial Launch"],
    },
  },
  {
    id: "tmpl-02",
    name: "Checklist Onboarding Software Engineer",
    description: "Kumpulan tugas terstruktur Task Manager (#01) untuk menyambut dev baru pada minggu pertama.",
    sourceApp: "task_manager",
    categoryId: "cat-3",
    visibility: "workspace",
    usageCount: 22,
    createdBy: "Budi Santoso (Engineering Manager)",
    createdAt: "2026-09-05T08:30:00Z",
    variables: [
      {
        id: "var-02-1",
        templateId: "tmpl-02",
        key: "{{engineer_name}}",
        type: "text_placeholder",
        defaultValue: "Rekan Baru",
        description: "Nama lengkap karyawan baru",
      },
      {
        id: "var-02-2",
        templateId: "tmpl-02",
        key: "{{start_date}}",
        type: "date_relative",
        defaultValue: "hari_ini",
        description: "Hari pertama masuk kantor",
      },
    ],
    structure: {
      tasks: [
        { title: "Setup Laptop, Git & VPN Access", dueOffsetDays: 1, priority: "high" },
        { title: "Baca Arsitektur Sistem di Wiki (#18)", dueOffsetDays: 2, priority: "medium" },
        { title: "Pairing session dengan buddy engineer", dueOffsetDays: 3, priority: "high" },
        { title: "Submit pull request pertama (good-first-issue)", dueOffsetDays: 5, priority: "medium" },
      ],
    },
  },
  {
    id: "tmpl-03",
    name: "SOP Dokumentasi Architecture Decision Record (ADR)",
    description: "Template halaman Wiki (#18) standar untuk mencatat keputusan teknis, konteks, konsekuensi, dan status.",
    sourceApp: "wiki",
    categoryId: "cat-2",
    visibility: "public",
    usageCount: 38,
    createdBy: "Siti Rahma (Tech Lead)",
    createdAt: "2026-08-20T14:00:00Z",
    variables: [
      {
        id: "var-03-1",
        templateId: "tmpl-03",
        key: "{{decision_title}}",
        type: "text_placeholder",
        defaultValue: "Migrasi ke PostgreSQL 16",
        description: "Judul keputusan arsitektur",
      },
    ],
    structure: {
      sections: [
        { heading: "Konteks & Masalah", content: "Jelaskan latar belakang teknis yang mendasari keputusan ini..." },
        { heading: "Opsi yang Dipertimbangkan", content: "Daftar alternatif solusi beserta trade-off pro & kontra..." },
        { heading: "Keputusan Final", content: "Keputusan arsitektur yang disepakati oleh engineering council..." },
        { heading: "Konsekuensi & Mitigasi", content: "Dampak terhadap database, performa, dan reliabilitas..." },
      ],
    },
  },
  {
    id: "tmpl-04",
    name: "Form Evaluasi Vendor & Pengadaan Jasa",
    description: "Struktur kuesioner dinamis Forms (#22) dengan validasi skor bobot untuk pemilihan mitra resmi.",
    sourceApp: "forms",
    categoryId: "cat-4",
    visibility: "private",
    usageCount: 6,
    createdBy: "Maya Anggraini (Procurement)",
    createdAt: "2026-09-12T11:00:00Z",
    variables: [
      {
        id: "var-04-1",
        templateId: "tmpl-04",
        key: "{{vendor_name}}",
        type: "text_placeholder",
        defaultValue: "PT Vendor Solusi",
        description: "Nama perusahaan vendor",
      },
    ],
    structure: {
      fields: [
        { label: "Kepatuhan SLA (1-5)", type: "rating", required: true },
        { label: "Kesesuaian Anggaran", type: "number", required: true },
        { label: "Sertifikasi ISO / Keamanan", type: "checkbox_list", options: ["ISO 27001", "ISO 9001", "SOC 2"] },
      ],
    },
  },
];

const INITIAL_RECORDS: ApplicationRecord[] = [
  {
    id: "rec-1",
    templateId: "tmpl-01",
    appliedBy: "Rian Pratama",
    appliedAt: "2026-09-20T09:15:00Z",
    resultingEntityId: "proj-104",
    anchorValues: {
      "{{product_name}}": "Mobile Banking v3",
      "{{start_date}}": "2026-09-20",
      "{{due_beta}}": "2026-10-20",
    },
  },
  {
    id: "rec-2",
    templateId: "tmpl-02",
    appliedBy: "Budi Santoso",
    appliedAt: "2026-09-22T08:00:00Z",
    resultingEntityId: "task-batch-88",
    anchorValues: {
      "{{engineer_name}}": "Fajar Nugraha",
      "{{start_date}}": "2026-09-22",
    },
  },
];

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set, get) => ({
      templates: INITIAL_TEMPLATES,
      categories: INITIAL_CATEGORIES,
      applicationRecords: INITIAL_RECORDS,
      selectedTemplateId: null,

      createTemplate: (data) => {
        const newTemplate: EcosystemTemplate = {
          ...data,
          id: `tmpl-${Date.now()}`,
          createdAt: new Date().toISOString(),
          usageCount: 0,
        };
        set((state) => ({ templates: [newTemplate, ...state.templates] }));
      },

      updateTemplateMetadata: (id, updates) => {
        set((state) => ({
          templates: state.templates.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
          selectedTemplateId: state.selectedTemplateId === id ? null : state.selectedTemplateId,
        }));
      },

      duplicateTemplate: (id) => {
        const item = get().templates.find((t) => t.id === id);
        if (!item) return;
        const dupe: EcosystemTemplate = {
          ...item,
          id: `tmpl-${Date.now()}`,
          name: `${item.name} (Salinan)`,
          usageCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ templates: [dupe, ...state.templates] }));
      },

      publishTemplate: (id) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, visibility: "public" as TemplateVisibility } : t
          ),
        }));
      },

      applyTemplate: (templateId, anchorValues, appliedBy = "Anda (User)") => {
        const tmpl = get().templates.find((t) => t.id === templateId);
        if (!tmpl) {
          return { success: false, resultingEntityId: "", resolvedStructure: null };
        }

        // Deep replace placeholders in structure
        let rawStr = JSON.stringify(tmpl.structure);
        Object.entries(anchorValues).forEach(([k, v]) => {
          rawStr = rawStr.split(k).join(v);
        });

        let resolved: any;
        try {
          resolved = JSON.parse(rawStr);
        } catch {
          resolved = tmpl.structure;
        }

        const resultingId = `${tmpl.sourceApp.substring(0, 4)}-${Date.now()}`;
        const newRecord: ApplicationRecord = {
          id: `rec-${Date.now()}`,
          templateId,
          appliedBy,
          appliedAt: new Date().toISOString(),
          resultingEntityId: resultingId,
          anchorValues,
        };

        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === templateId ? { ...t, usageCount: t.usageCount + 1 } : t
          ),
          applicationRecords: [newRecord, ...state.applicationRecords],
        }));

        return { success: true, resultingEntityId: resultingId, resolvedStructure: resolved };
      },

      createCategory: (name, description = "") => {
        const newCat: TemplateCategory = {
          id: `cat-${Date.now()}`,
          name,
          description,
        };
        set((state) => ({ categories: [...state.categories, newCat] }));
      },

      setSelectedTemplateId: (id) => set({ selectedTemplateId: id }),
    }),
    {
      name: "ecosystem-template-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
