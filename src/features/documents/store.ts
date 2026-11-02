import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DocumentItem,
  DocumentVersion,
  ReviewAssignment,
  Category,
  Folder,
  Tag,
  Comment,
  Activity,
  DocumentTemplate,
  DocumentStatus,
  ConfidentialityLevel,
} from "./types";
import { getRaw, setRaw } from "../../core/rawStorage";

export const DOCUMENTS_STORAGE_KEY = "aio_documents_data_v1";
export const PROJECT_STORAGE_KEY = "aio_project_manager_data_v1";

export const DEFAULT_FOLDERS: Folder[] = [
  { id: "fld-legal", name: "Legal & Kepatuhan", createdAt: new Date().toISOString() },
  { id: "fld-hr", name: "SDM & Personalia", createdAt: new Date().toISOString() },
  { id: "fld-ops", name: "Operasional & Mutu", createdAt: new Date().toISOString() },
  { id: "fld-it", name: "Teknologi & Keamanan", createdAt: new Date().toISOString() },
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-sop", name: "SOP & Prosedur", folderId: "fld-ops", color: "#3B82F6", icon: "FileText" },
  { id: "cat-policy", name: "Kebijakan Perusahaan", folderId: "fld-legal", color: "#8B5CF6", icon: "Shield" },
  { id: "cat-contract", name: "Kontrak & Perjanjian", folderId: "fld-legal", color: "#10B981", icon: "FileCheck" },
  { id: "cat-report", name: "Laporan Audit", folderId: "fld-ops", color: "#F59E0B", icon: "BarChart3" },
  { id: "cat-guideline", name: "Pedoman Kerja", folderId: "fld-hr", color: "#EC4899", icon: "BookOpen" },
];

export const DEFAULT_TAGS: Tag[] = [
  { id: "tag-iso", name: "ISO 27001", color: "#8B5CF6" },
  { id: "tag-legal", name: "Hukum", color: "#10B981" },
  { id: "tag-urgent", name: "Audit Q4", color: "#EF4444" },
  { id: "tag-hr", name: "Personalia", color: "#3B82F6" },
];

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: "tpl-sop",
    title: "Standar Operasional Prosedur (SOP)",
    description: "Format baku 5-bagian: Tujuan, Ruang Lingkup, Prosedur, Tanggung Jawab, dan Riwayat Revisi.",
    documentType: "cat-sop",
    suggestedConfidentiality: "Internal",
    tags: ["SOP", "Operasional"],
    defaultSections: [
      { title: "1. Tujuan", placeholder: "Jelaskan sasaran dan hasil akhir yang diharapkan dari penerapan prosedur baku ini." },
      { title: "2. Ruang Lingkup", placeholder: "Tentukan batasan divisi, proses, dan pihak yang wajib mematuhi SOP ini." },
      { title: "3. Tanggung Jawab", placeholder: "Pihak pelaksana, supervisor pengawas, dan penanggung jawab mutu." },
      { title: "4. Langkah-Langkah Prosedur", placeholder: "Langkah terstruktur 1 sampai selesai dengan instruksi operasional yang jelas." },
      { title: "5. Dokumen Terkait & Lampiran", placeholder: "Formulir pendukung, checklist, atau referensi aplikasi eksternal." },
    ],
  },
  {
    id: "tpl-nda",
    title: "Non-Disclosure Agreement (NDA)",
    description: "Perjanjian kerahasiaan formal bilateral antara perusahaan dan mitra/klien.",
    documentType: "cat-contract",
    suggestedConfidentiality: "Confidential",
    tags: ["Legal", "Hukum"],
    defaultSections: [
      { title: "1. Para Pihak", placeholder: "Identitas lengkap pihak pertama (pengungkap) dan pihak kedua (penerima)." },
      { title: "2. Definisi Informasi Rahasia", placeholder: "Cakupan data teknis, finansial, strategi, dan operasional yang dilindungi." },
      { title: "3. Kewajiban & Pembatasan", placeholder: "Kewajiban menjaga kerahasiaan dan pembatasan penggunaan informasi." },
      { title: "4. Masa Berlaku", placeholder: "Jangka waktu berlakunya perjanjian (misal 3 tahun sejak penandatanganan)." },
      { title: "5. Hukum yang Berlaku & Penyelesaian Sengketa", placeholder: "Domisili hukum dan yurisdiksi peradilan yang berwenang." },
    ],
  },
  {
    id: "tpl-policy",
    title: "Kebijakan Keamanan & Kepatuhan Organisasi",
    description: "Pedoman kebijakan resmi untuk audit kepatuhan, privasi, dan standar ISO.",
    documentType: "cat-policy",
    suggestedConfidentiality: "Internal",
    tags: ["ISO 27001", "Kepatuhan"],
    defaultSections: [
      { title: "1. Pernyataan Kebijakan", placeholder: "Komitmen direksi terhadap standar keamanan dan integritas informasi." },
      { title: "2. Prinsip Perlindungan Data", placeholder: "Prinsip kerahasiaan (confidentiality), keutuhan (integrity), dan ketersediaan (availability)." },
      { title: "3. Aturan Hak Akses", placeholder: "Prinsip least privilege dan prosedur pemberian akses user." },
      { title: "4. Penanganan Insiden & Sanksi", placeholder: "Eskalasi laporan insiden dan konsekuensi pelanggaran kebijakan." },
    ],
  },
];

// Helper to assemble structured section content
export function buildTemplateContent(sections: Array<{ title: string; placeholder: string }>): string {
  return sections.map((s) => `## ${s.title}\n${s.placeholder}\n`).join("\n");
}

const SEED_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-1",
    title: "SOP Pengadaan Barang & Jasa Vendor v2.0",
    description: "Prosedur baku seleksi, penawaran harga, dan verifikasi legalitas rekanan vendor.",
    documentType: "cat-sop",
    status: "Published",
    currentVersionId: "ver-doc-1-v2",
    ownerId: "usr-1",
    ownerName: "Bambang Sudiro",
    folderId: "fld-ops",
    tags: ["Operasional", "Audit Q4"],
    metadata: {
      author: "Divisi Procurement & Mutu",
      department: "Operasional",
      documentNumber: "SOP/2026/PROC-002",
      confidentiality: "Internal",
      effectiveDate: "2026-01-01",
      expiryDate: "2027-01-01",
    },
    effectiveDate: "2026-01-01",
    expiryDate: "2027-01-01",
    confidentiality: "Internal",
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "doc-2",
    title: "Kebijakan Akses Keamanan Informasi & Enkripsi (ISO 27001)",
    description: "Ketentuan wajib enkripsi data in-transit dan at-rest serta protokol otentikasi multi-faktor.",
    documentType: "cat-policy",
    status: "Published",
    currentVersionId: "ver-doc-2-v1",
    ownerId: "usr-2",
    ownerName: "Siti Rahmawati",
    folderId: "fld-it",
    tags: ["ISO 27001", "Hukum"],
    metadata: {
      author: "Chief Information Security Officer (CISO)",
      department: "IT & Keamanan",
      documentNumber: "POL/2026/SEC-001",
      confidentiality: "Confidential",
      effectiveDate: "2026-03-01",
      expiryDate: "2027-03-01",
    },
    effectiveDate: "2026-03-01",
    expiryDate: "2027-03-01",
    confidentiality: "Confidential",
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "doc-3",
    title: "Perjanjian Kerahasiaan (NDA) Konsorsium Proyek 2026",
    description: "Draf perjanjian perlindungan hak cipta dan rahasia dagang untuk konsultan luar.",
    documentType: "cat-contract",
    status: "In Review",
    currentVersionId: "ver-doc-3-v02",
    ownerId: "usr-1",
    ownerName: "Bambang Sudiro",
    folderId: "fld-legal",
    tags: ["Hukum", "Audit Q4"],
    metadata: {
      author: "Legal Corporate",
      department: "Legal",
      documentNumber: "NDA/2026/CORP-014",
      confidentiality: "Restricted",
      effectiveDate: "2026-04-01",
      expiryDate: "2029-04-01",
    },
    effectiveDate: "2026-04-01",
    expiryDate: "2029-04-01",
    confidentiality: "Restricted",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: "doc-4",
    title: "Pedoman Kerja Fleksibel & Remote Working (WFA)",
    description: "Pedoman jam kerja inti, fasilitas perangkat kantor, dan perlindungan privasi karyawan.",
    documentType: "cat-guideline",
    status: "Draft",
    currentVersionId: "ver-doc-4-v01",
    ownerId: "usr-3",
    ownerName: "Diah Pramesti",
    folderId: "fld-hr",
    tags: ["Personalia"],
    metadata: {
      author: "People & Culture Team",
      department: "SDM",
      documentNumber: "GDL/2026/HR-003",
      confidentiality: "Internal",
    },
    confidentiality: "Internal",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "doc-5",
    title: "Laporan Evaluasi Audit Tata Kelola TI Kuartal III",
    description: "Hasil peninjauan kesiapan infrastruktur awan dan evaluasi kepatuhan SLA pihak ketiga.",
    documentType: "cat-report",
    status: "Approved",
    currentVersionId: "ver-doc-5-v1",
    ownerId: "usr-2",
    ownerName: "Siti Rahmawati",
    folderId: "fld-it",
    tags: ["Audit Q4"],
    metadata: {
      author: "Tim Internal Audit",
      department: "Audit & Risk",
      documentNumber: "RPT/2026/AUD-009",
      confidentiality: "Confidential",
      effectiveDate: "2026-09-01",
      expiryDate: "2026-10-31",
    },
    effectiveDate: "2026-09-01",
    expiryDate: "2026-10-31",
    confidentiality: "Confidential",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const SEED_VERSIONS: DocumentVersion[] = [
  {
    id: "ver-doc-1-v1",
    documentId: "doc-1",
    versionNumber: "1.0",
    content: "## 1. Tujuan\nProsedur awal pengadaan barang operasional tahun 2025.\n\n## 2. Ruang Lingkup\nPengadaan di bawah Rp 50.000.000.",
    status: "superseded",
    changeSummary: "Versi awal peluncuran SOP",
    createdBy: "Bambang Sudiro",
    approvedBy: "Head of Operations",
    createdAt: new Date(Date.now() - 120 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 110 * 86400000).toISOString(),
  },
  {
    id: "ver-doc-1-v2",
    documentId: "doc-1",
    versionNumber: "2.0",
    content: "## 1. Tujuan\nMenjamin transparansi, efisiensi anggaran, dan kesesuaian spesifikasi barang/jasa yang diadakan oleh seluruh unit kerja.\n\n## 2. Ruang Lingkup\nSeluruh proses pengadaan di atas Rp 20.000.000 yang melibatkan vendor pihak ketiga terdaftar.\n\n## 3. Tanggung Jawab\n- Pemohon: Menyusun Terms of Reference (TOR)\n- Tim Procurement: Melakukan tender minimal 3 penawaran kompetitif\n- Finance: Memverifikasi faktur pajak dan SPK resmi.\n\n## 4. Langkah-Langkah Prosedur\n1. Pengajuan Purchase Request (PR) terotorisasi.\n2. Verifikasi vendor berlisensi resmi.\n3. Evaluasi teknis dan penawaran komersial.\n4. Penerbitan Purchase Order (PO) & Surat Perjanjian Kerja (SPK).",
    status: "published",
    changeSummary: "Revisi mayor: penambahan batas minimum tender 3 vendor dan verifikasi legalitas pajak.",
    createdBy: "Bambang Sudiro",
    approvedBy: "Managing Director",
    createdAt: new Date(Date.now() - 40 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "ver-doc-2-v1",
    documentId: "doc-2",
    versionNumber: "1.0",
    content: "## 1. Pernyataan Kebijakan\nPerusahaan berkomitmen menjaga standar keamanan informasi berkelas internasional sesuai klausul ISO/IEC 27001.\n\n## 2. Prinsip Enkripsi Data\nSeluruh data sensitif klien wajib dienkripsi menggunakan AES-256 pada media penyimpanan dan TLS 1.3 pada transmisi data.\n\n## 3. Otentikasi Pengguna\nSetiap akses sistem administrasi wajib menggunakan Multi-Factor Authentication (MFA) berbasis aplikasi.",
    status: "published",
    changeSummary: "Rilis resmi kebijakan keamanan sistem",
    createdBy: "Siti Rahmawati",
    approvedBy: "Dewan Direksi",
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
    publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: "ver-doc-3-v02",
    documentId: "doc-3",
    versionNumber: "0.2",
    content: "## 1. Para Pihak\nPerjanjian ini dibuat antara PT Inovasi Solusi Bersama dan Konsultan Eksternal.\n\n## 2. Batas Kerahasiaan\nSeluruh data arsitektur sistem, source code, dan laporan keuangan merupakan milik mutlak Perusahaan.\n\n## 3. Masa Berlaku\nBerlaku selama 3 tahun kalender sejak tanggal penandatanganan resmi.",
    status: "in_review",
    changeSummary: "Pembaruan klausul yurisdiksi hukum dan denda pelanggaran",
    createdBy: "Bambang Sudiro",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "ver-doc-4-v01",
    documentId: "doc-4",
    versionNumber: "0.1",
    content: "## 1. Tujuan\nMemberikan fleksibilitas kerja seimbang bagi karyawan dengan tetap menjaga produktivitas dan koordinasi tim.\n\n## 2. Ketentuan Jam Kerja Inti\nJam kerja inti (core hours) disepakati pukul 10:00 - 15:00 WIB untuk keperluan rapat koordinasi.",
    status: "draft",
    changeSummary: "Draf awal untuk peninjauan internal HR",
    createdBy: "Diah Pramesti",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: "ver-doc-5-v1",
    documentId: "doc-5",
    versionNumber: "1.0",
    content: "## 1. Ringkasan Eksekutif\nAudit kepatuhan kuartal III menunjukkan tingkat pemenuhan SLA infrastruktur sebesar 99.85%.\n\n## 2. Temuan Audit\nTidak ditemukan celah keamanan kritikal pada audit penetrasi eksternal.",
    status: "approved",
    changeSummary: "Finalisasi hasil audit disetujui komite",
    createdBy: "Siti Rahmawati",
    approvedBy: "Komite Audit & Risiko",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
];

const SEED_ASSIGNMENTS: ReviewAssignment[] = [
  {
    id: "asg-1",
    documentId: "doc-3",
    versionId: "ver-doc-3-v02",
    reviewerId: "usr-legal",
    reviewerName: "Hendra Wijaya (Legal Counsel)",
    role: "approver",
    status: "pending",
  },
];

const SEED_ACTIVITIES: Activity[] = [
  {
    id: "act-doc-1",
    documentId: "doc-1",
    type: "published",
    description: "Dokumen versi v2.0 resmi dipublikasikan oleh Bambang Sudiro",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "act-doc-2",
    documentId: "doc-1",
    type: "superseded",
    description: "Versi lama v1.0 otomatis digantikan (superseded) oleh v2.0",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "act-doc-3",
    documentId: "doc-3",
    type: "submitted_review",
    description: "Diajukan untuk peninjauan kepada Hendra Wijaya (Legal Counsel)",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: "act-doc-4",
    documentId: "doc-5",
    type: "approved",
    description: "Dokumen disetujui oleh Komite Audit & Risiko",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

interface DocumentsState {
  documents: DocumentItem[];
  versions: DocumentVersion[];
  assignments: ReviewAssignment[];
  categories: Category[];
  folders: Folder[];
  tags: Tag[];
  comments: Comment[];
  activities: Activity[];
}

export function useDocumentsStore() {
  const [state, setState] = useState<DocumentsState>(() => {
    try {
      const saved = getRaw(DOCUMENTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.documents && Array.isArray(parsed.documents)) {
          return {
            documents: parsed.documents,
            versions: parsed.versions || SEED_VERSIONS,
            assignments: parsed.assignments || SEED_ASSIGNMENTS,
            categories: parsed.categories || DEFAULT_CATEGORIES,
            folders: parsed.folders || DEFAULT_FOLDERS,
            tags: parsed.tags || DEFAULT_TAGS,
            comments: parsed.comments || [],
            activities: parsed.activities || SEED_ACTIVITIES,
          };
        }
      }
    } catch (e) {
      console.error("Failed to load documents store", e);
    }
    return {
      documents: SEED_DOCUMENTS,
      versions: SEED_VERSIONS,
      assignments: SEED_ASSIGNMENTS,
      categories: DEFAULT_CATEGORIES,
      folders: DEFAULT_FOLDERS,
      tags: DEFAULT_TAGS,
      comments: [],
      activities: SEED_ACTIVITIES,
    };
  });

  useEffect(() => {
    try {
      setRaw(DOCUMENTS_STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event("storage"));
    } catch (e) {
      console.error("Failed to save documents store", e);
    }
  }, [state]);

  // Create Document (§3.2: creates Draft with v0.1)
  const createDocument = useCallback(
    (input: {
      title: string;
      description?: string;
      documentType?: string;
      folderId?: string;
      tags?: string[];
      confidentiality?: ConfidentialityLevel;
      documentNumber?: string;
      department?: string;
      content?: string;
      effectiveDate?: string;
      expiryDate?: string;
    }) => {
      const nowISO = new Date().toISOString();
      const docId = `doc-${Date.now()}`;
      const verId = `ver-${docId}-v01`;

      const newVersion: DocumentVersion = {
        id: verId,
        documentId: docId,
        versionNumber: "0.1",
        content: input.content || "## 1. Ringkasan\nTulis konten draf di sini...\n",
        status: "draft",
        changeSummary: "Draf awal dibuat",
        createdBy: "Current User",
        createdAt: nowISO,
      };

      const newDoc: DocumentItem = {
        id: docId,
        title: input.title.trim(),
        description: input.description?.trim(),
        documentType: input.documentType || DEFAULT_CATEGORIES[0].id,
        status: "Draft",
        currentVersionId: verId,
        ownerId: "current-user",
        ownerName: "Pengguna Aktif",
        folderId: input.folderId || DEFAULT_FOLDERS[0].id,
        tags: input.tags || ["Internal"],
        metadata: {
          author: "Current User",
          department: input.department || "Operasional",
          documentNumber: input.documentNumber || `DOC/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`,
          confidentiality: input.confidentiality || "Internal",
          effectiveDate: input.effectiveDate,
          expiryDate: input.expiryDate,
        },
        effectiveDate: input.effectiveDate,
        expiryDate: input.expiryDate,
        confidentiality: input.confidentiality || "Internal",
        createdAt: nowISO,
        updatedAt: nowISO,
      };

      const act: Activity = {
        id: `act-${Date.now()}`,
        documentId: docId,
        type: "created",
        description: `Membuat dokumen baru: "${newDoc.title}" (v0.1 Draft)`,
        createdAt: nowISO,
      };

      setState((prev) => ({
        ...prev,
        documents: [newDoc, ...prev.documents],
        versions: [newVersion, ...prev.versions],
        activities: [act, ...prev.activities],
      }));

      return newDoc;
    },
    []
  );

  // Edit Document Metadata & Content (§3.2: only allowed if Draft or Rejected)
  const updateDocument = useCallback(
    (id: string, updates: Partial<DocumentItem>, content?: string) => {
      const nowISO = new Date().toISOString();
      setState((prev) => {
        const docIdx = prev.documents.findIndex((d) => d.id === id);
        if (docIdx === -1) return prev;
        const doc = prev.documents[docIdx];

        if (doc.status !== "Draft" && doc.status !== "Rejected") {
          console.warn("Dokumen hanya dapat diedit saat berstatus Draft atau Rejected");
          return prev;
        }

        const updatedDoc: DocumentItem = {
          ...doc,
          ...updates,
          updatedAt: nowISO,
        };

        const updatedDocs = [...prev.documents];
        updatedDocs[docIdx] = updatedDoc;

        let updatedVersions = [...prev.versions];
        if (content !== undefined && doc.currentVersionId) {
          updatedVersions = updatedVersions.map((v) =>
            v.id === doc.currentVersionId ? { ...v, content } : v
          );
        }

        return {
          ...prev,
          documents: updatedDocs,
          versions: updatedVersions,
        };
      });
    },
    []
  );

  // Submit for Review (§3.2 & §8)
  const submitForReview = useCallback((documentId: string, reviewerName: string, role: "reviewer" | "approver" = "approver") => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const doc = prev.documents.find((d) => d.id === documentId);
      if (!doc || (doc.status !== "Draft" && doc.status !== "Rejected")) return prev;

      const assignment: ReviewAssignment = {
        id: `asg-${Date.now()}`,
        documentId,
        versionId: doc.currentVersionId || "",
        reviewerId: `usr-${Date.now()}`,
        reviewerName,
        role,
        status: "pending",
      };

      const act: Activity = {
        id: `act-${Date.now()}`,
        documentId,
        type: "submitted_review",
        description: `Diajukan untuk peninjauan kepada ${reviewerName} (${role.toUpperCase()})`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === documentId ? { ...d, status: "In Review" as DocumentStatus, updatedAt: nowISO } : d
        ),
        assignments: [assignment, ...prev.assignments],
        activities: [act, ...prev.activities],
      };
    });
  }, []);

  // Review / Comment without changing status (§3.2)
  const reviewDocument = useCallback((assignmentId: string, comment: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const asg = prev.assignments.find((a) => a.id === assignmentId);
      if (!asg) return prev;

      const act: Activity = {
        id: `act-${Date.now()}`,
        documentId: asg.documentId,
        type: "reviewed",
        description: `Reviewer ${asg.reviewerName} memberi catatan: "${comment}"`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        assignments: prev.assignments.map((a) =>
          a.id === assignmentId ? { ...a, status: "reviewed" as const, comment, respondedAt: nowISO } : a
        ),
        activities: [act, ...prev.activities],
      };
    });
  }, []);

  // Approve Document (§3.2 & §5)
  const approveDocument = useCallback((documentId: string, approverName: string, comment?: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const doc = prev.documents.find((d) => d.id === documentId);
      if (!doc || doc.status !== "In Review") return prev;

      const act: Activity = {
        id: `act-${Date.now()}`,
        documentId,
        type: "approved",
        description: `Dokumen disetujui oleh ${approverName}. Status berubah menjadi Approved.`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === documentId ? { ...d, status: "Approved" as DocumentStatus, updatedAt: nowISO } : d
        ),
        assignments: prev.assignments.map((a) =>
          a.documentId === documentId && a.status === "pending"
            ? { ...a, status: "approved" as const, comment: comment || "Disetujui", respondedAt: nowISO }
            : a
        ),
        activities: [act, ...prev.activities],
      };
    });
  }, []);

  // Reject Document (§3.2, §3.3: Requires reason comment!)
  const rejectDocument = useCallback((documentId: string, reviewerName: string, reason: string) => {
    if (!reason.trim()) {
      alert("Alasan penolakan (alasan revisi) wajib diisi agar pemilik dokumen tahu apa yang perlu diperbaiki.");
      return;
    }
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const doc = prev.documents.find((d) => d.id === documentId);
      if (!doc || doc.status !== "In Review") return prev;

      const act: Activity = {
        id: `act-${Date.now()}`,
        documentId,
        type: "rejected",
        description: `Dokumen ditolak oleh ${reviewerName}. Alasan: "${reason}". Status kembali ke Draft.`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === documentId ? { ...d, status: "Draft" as DocumentStatus, updatedAt: nowISO } : d
        ),
        assignments: prev.assignments.map((a) =>
          a.documentId === documentId && a.status === "pending"
            ? { ...a, status: "rejected" as const, comment: reason, respondedAt: nowISO }
            : a
        ),
        activities: [act, ...prev.activities],
      };
    });
  }, []);

  // Publish Document (§3.2, §4.3: Version becomes published, previous published becomes superseded!)
  const publishDocument = useCallback((documentId: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const doc = prev.documents.find((d) => d.id === documentId);
      if (!doc) return prev;

      // Find all versions of this document
      const currentVer = prev.versions.find((v) => v.id === doc.currentVersionId);
      const newVersionNumber = currentVer?.versionNumber.startsWith("0.")
        ? "1.0"
        : currentVer?.versionNumber || "1.0";

      const updatedVersions = prev.versions.map((v) => {
        if (v.documentId !== documentId) return v;
        if (v.id === doc.currentVersionId) {
          return {
            ...v,
            versionNumber: newVersionNumber,
            status: "published" as const,
            publishedAt: nowISO,
          };
        }
        if (v.status === "published") {
          return {
            ...v,
            status: "superseded" as const,
          };
        }
        return v;
      });

      const act1: Activity = {
        id: `act-${Date.now()}-pub`,
        documentId,
        type: "published",
        description: `Dokumen versi ${newVersionNumber} disahkan dan berlaku resmi (Published).`,
        createdAt: nowISO,
      };

      return {
        ...prev,
        documents: prev.documents.map((d) =>
          d.id === documentId
            ? {
                ...d,
                status: "Published" as DocumentStatus,
                publishedAt: nowISO,
                updatedAt: nowISO,
              }
            : d
        ),
        versions: updatedVersions,
        activities: [act1, ...prev.activities],
      };
    });
  }, []);

  // Revise Document (§3.2, §4.1: Creates new minor/major version in Draft)
  const reviseDocument = useCallback(
    (documentId: string, isMajor: boolean = false, changeSummary: string = "Revisi substansial dokumen") => {
      const nowISO = new Date().toISOString();
      setState((prev) => {
        const doc = prev.documents.find((d) => d.id === documentId);
        if (!doc) return prev;

        const currentVer = prev.versions.find((v) => v.id === doc.currentVersionId);
        let nextVerNum = "1.1";
        if (currentVer) {
          const parts = currentVer.versionNumber.split(".");
          const major = parseInt(parts[0], 10) || 1;
          const minor = parseInt(parts[1], 10) || 0;
          nextVerNum = isMajor ? `${major + 1}.0` : `${major}.${minor + 1}`;
        }

        const newVerId = `ver-${documentId}-v${nextVerNum.replace(".", "")}`;
        const newVer: DocumentVersion = {
          id: newVerId,
          documentId,
          versionNumber: nextVerNum,
          content: currentVer ? currentVer.content : "Konten dokumen...",
          status: "draft",
          changeSummary,
          createdBy: "Current User",
          createdAt: nowISO,
        };

        const act: Activity = {
          id: `act-${Date.now()}`,
          documentId,
          type: "revised",
          description: `Memulai draf revisi versi baru ${nextVerNum}. Versi lama tetap berlaku hingga revisi ini disahkan.`,
          createdAt: nowISO,
        };

        return {
          ...prev,
          documents: prev.documents.map((d) =>
            d.id === documentId
              ? {
                  ...d,
                  status: "Draft" as DocumentStatus,
                  currentVersionId: newVerId,
                  updatedAt: nowISO,
                }
              : d
          ),
          versions: [newVer, ...prev.versions],
          activities: [act, ...prev.activities],
        };
      });
    },
    []
  );

  // Archive & Restore (§3.2)
  const archiveDocument = useCallback((documentId: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      documents: prev.documents.map((d) =>
        d.id === documentId
          ? { ...d, status: "Archived" as DocumentStatus, archivedAt: nowISO, updatedAt: nowISO }
          : d
      ),
      activities: [
        {
          id: `act-${Date.now()}`,
          documentId,
          type: "archived",
          description: "Memindahkan dokumen ke arsip",
          createdAt: nowISO,
        },
        ...prev.activities,
      ],
    }));
  }, []);

  const restoreDocument = useCallback((documentId: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      documents: prev.documents.map((d) =>
        d.id === documentId
          ? {
              ...d,
              status: d.publishedAt ? ("Published" as DocumentStatus) : ("Draft" as DocumentStatus),
              archivedAt: undefined,
              updatedAt: nowISO,
            }
          : d
      ),
      activities: [
        {
          id: `act-${Date.now()}`,
          documentId,
          type: "restored",
          description: "Memulihkan dokumen dari arsip",
          createdAt: nowISO,
        },
        ...prev.activities,
      ],
    }));
  }, []);

  // Delete Document (§3.2, §3.3: ONLY allowed for Draft; Published docs cannot be deleted permanently!)
  const deleteDocument = useCallback((documentId: string): { success: boolean; message?: string } => {
    const doc = state.documents.find((d) => d.id === documentId);
    if (!doc) return { success: false, message: "Dokumen tidak ditemukan." };

    if (doc.status === "Published" || doc.publishedAt) {
      return {
        success: false,
        message: "Dokumen yang pernah dipublikasikan tidak dapat dihapus permanen demi menjaga jejak audit resmi. Silakan gunakan fungsi Arsip.",
      };
    }

    setState((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== documentId),
      versions: prev.versions.filter((v) => v.documentId !== documentId),
      assignments: prev.assignments.filter((a) => a.documentId !== documentId),
      comments: prev.comments.filter((c) => c.documentId !== documentId),
      activities: prev.activities.filter((a) => a.documentId !== documentId),
    }));

    return { success: true };
  }, [state.documents]);

  // Duplicate Document (§3.2: as clean Draft without approval history)
  const duplicateDocument = useCallback((documentId: string) => {
    const nowISO = new Date().toISOString();
    setState((prev) => {
      const target = prev.documents.find((d) => d.id === documentId);
      if (!target) return prev;
      const targetVer = prev.versions.find((v) => v.id === target.currentVersionId);

      const newDocId = `doc-${Date.now()}`;
      const newVerId = `ver-${newDocId}-v01`;

      const cloneVer: DocumentVersion = {
        id: newVerId,
        documentId: newDocId,
        versionNumber: "0.1",
        content: targetVer ? targetVer.content : "",
        status: "draft",
        changeSummary: `Salinan dari ${target.title}`,
        createdBy: "Current User",
        createdAt: nowISO,
      };

      const cloneDoc: DocumentItem = {
        ...target,
        id: newDocId,
        title: `${target.title} (Salinan)`,
        status: "Draft",
        currentVersionId: newVerId,
        createdAt: nowISO,
        updatedAt: nowISO,
        publishedAt: undefined,
        archivedAt: undefined,
      };

      return {
        ...prev,
        documents: [cloneDoc, ...prev.documents],
        versions: [cloneVer, ...prev.versions],
        activities: [
          {
            id: `act-${Date.now()}`,
            documentId: newDocId,
            type: "created",
            description: `Menduplikasi dokumen dari "${target.title}"`,
            createdAt: nowISO,
          },
          ...prev.activities,
        ],
      };
    });
  }, []);

  // Apply Document Template (§12)
  const applyTemplate = useCallback((tpl: DocumentTemplate) => {
    const content = buildTemplateContent(tpl.defaultSections);
    return createDocument({
      title: tpl.title,
      description: tpl.description,
      documentType: tpl.documentType,
      confidentiality: tpl.suggestedConfidentiality,
      tags: tpl.tags,
      content,
    });
  }, [createDocument]);

  // Comments (§9.2)
  const addComment = useCallback((documentId: string, content: string, versionId?: string) => {
    const nowISO = new Date().toISOString();
    const newComment: Comment = {
      id: `cmt-${Date.now()}`,
      documentId,
      versionId,
      userId: "usr-current",
      userName: "Pengguna Aktif",
      content: content.trim(),
      createdAt: nowISO,
    };
    setState((prev) => ({
      ...prev,
      comments: [newComment, ...prev.comments],
      activities: [
        {
          id: `act-${Date.now()}`,
          documentId,
          type: "comment_added",
          description: `Memberikan catatan: "${content.slice(0, 40)}..."`,
          createdAt: nowISO,
        },
        ...prev.activities,
      ],
    }));
  }, []);

  // Compute Statistics (§14)
  const statistics = useMemo(() => {
    const total = state.documents.length;
    const byStatus: Record<DocumentStatus, number> = {
      Draft: 0,
      "In Review": 0,
      Approved: 0,
      Rejected: 0,
      Published: 0,
      Superseded: 0,
      Archived: 0,
    };
    state.documents.forEach((d) => {
      byStatus[d.status] = (byStatus[d.status] || 0) + 1;
    });

    const now = Date.now();
    const in30d = now + 30 * 86400000;
    const expiringSoonCount = state.documents.filter((d) => {
      if (d.status !== "Published" || !d.expiryDate) return false;
      const t = new Date(d.expiryDate).getTime();
      return t >= now && t <= in30d;
    }).length;

    // Rejection Rate = COUNT(Rejected) / COUNT(Submitted)
    const rejectActivities = state.activities.filter((a) => a.type === "rejected").length;
    const submitActivities = state.activities.filter((a) => a.type === "submitted_review").length;
    const rejectionRate = submitActivities > 0 ? Math.round((rejectActivities / submitActivities) * 100) : 0;

    // Documents by Category
    const byCategory: Record<string, { count: number; name: string; color: string }> = {};
    state.categories.forEach((cat) => {
      byCategory[cat.id] = { count: 0, name: cat.name, color: cat.color || "#3B82F6" };
    });
    state.documents.forEach((d) => {
      if (d.documentType && byCategory[d.documentType]) {
        byCategory[d.documentType].count++;
      }
    });

    return {
      total,
      byStatus,
      expiringSoonCount,
      rejectionRate,
      byCategory,
    };
  }, [state.documents, state.activities, state.categories]);

  return {
    documents: state.documents,
    versions: state.versions,
    assignments: state.assignments,
    categories: state.categories,
    folders: state.folders,
    tags: state.tags,
    comments: state.comments,
    activities: state.activities,
    templates: DOCUMENT_TEMPLATES,
    statistics,
    createDocument,
    updateDocument,
    submitForReview,
    reviewDocument,
    approveDocument,
    rejectDocument,
    publishDocument,
    reviseDocument,
    archiveDocument,
    restoreDocument,
    deleteDocument,
    duplicateDocument,
    applyTemplate,
    addComment,
  };
}
