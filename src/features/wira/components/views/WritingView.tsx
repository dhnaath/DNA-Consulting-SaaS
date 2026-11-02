import React, { useState, useEffect, useMemo } from "react";
import {
  Type,
  Plus,
  Search,
  FileText,
  Clock,
  User,
  Tag,
  Copy,
  Check,
  Download,
  Printer,
  Trash2,
  ArrowLeft,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code as CodeIcon,
  Eye,
  Edit3,
} from "lucide-react";
import { cn } from "../../lib/utils";

export interface WritingDoc {
  id: string;
  title: string;
  client: string;
  category: "Proposal" | "Strategi" | "Laporan" | "SOP";
  status: "Draft" | "In Review" | "Final";
  content: string;
  updatedAt: string;
}

const TEMPLATES = [
  {
    id: "tpl-proposal",
    name: "Proposal Transformasi Digital",
    category: "Proposal" as const,
    desc: "Kerangka lengkap proyek strategi digital, lingkup kerja, dan estimasi investasi.",
    content: `# Proposal Transformasi Digital & Efisiensi Operasional

**Klien**: PT Nusantara Maju Bersama  
**Tanggal**: September 2026  
**Disusun Oleh**: All in One Advisory Consulting  

---

## 1. Ringkasan Eksekutif
Inisiatif ini bertujuan untuk memodernisasi arsitektur operasional dan integrasi data penjualan klien, mengurangi jeda rekonsiliasi manual sebesar 65%, serta mempercepat pengambilan keputusan manajemen.

## 2. Tantangan Bisnis Saat Ini
- **Silo Data**: Database cabang belum terhubung secara otomatis ke kantor pusat.
- **Latency Pelaporan**: Penyusunan laporan keuangan bulanan membutuhkan waktu 12 hari kerja.
- **Customer Drop-off**: Tingkat retensi transaksi ulang menurun 14% dalam 2 kuartal terakhir.

## 3. Ruang Lingkup Kerja (Scope of Work)
1. **Fase 1 - Diagnosis & Audit Sistem** (Minggu 1-3)
   - Evaluasi infrastruktur cloud dan pipeline data eksisting.
   - Wawancara stakeholder divisi Keuangan, Operasional, dan IT.
2. **Fase 2 - Blueprint Arsitektur Target** (Minggu 4-7)
   - Perancangan model data terpadu dan arsitektur API microservices.
   - Penyusunan matriks manajemen perubahan (Change Management).
3. **Fase 3 - Pelaksanaan Pilot & Handoff** (Minggu 8-12)
   - Implementasi pilot pada 3 cabang utama.
   - Pelatihan operator dan penyusunan SOP pemeliharaan.

## 4. Jadwal & Milestone Utama
- [x] Kickoff Project & Stakeholder Alignment: Minggu ke-1
- [ ] Finalisasi Laporan Audit As-Is: Minggu ke-3
- [ ] Persetujuan Blueprint Target To-Be: Minggu ke-6
- [ ] Go-Live Pilot Deployment: Minggu ke-10

## 5. Estimasi Investasi
Total alokasi biaya profesional konsultasi dan pengawasan implementasi dirinci sesuai deliverable yang disepakati.`,
  },
  {
    id: "tpl-report",
    name: "Laporan Kemajuan Mingguan (Status Report)",
    category: "Laporan" as const,
    desc: "Format standar update berkala klien, capaian KPI, hambatan, dan rencana sprint.",
    content: `# Laporan Status Proyek Mingguan — Sprint 04

**Klien**: Bank Syariah Mandiri Utama  
**Periode**: 15 September – 22 September 2026  
**Status Keseluruhan**: 🟢 ON TRACK  

---

## 1. Capaian Kunci Minggu Ini (Key Highlights)
- Menyelesaikan audit kepatuhan syariah terhadap modul akad murabahah digital.
- Validasi flow UX aplikasi nasabah bersama tim internal dan fokus grup testing.
- Penyusunan skema integrasi payment gateway fase pertama selesai 100%.

## 2. Status Indikator Kinerja (KPI Tracker)
- **Kemajuan Milestones**: 68% dari target 70% (Deviasi minimal).
- **Bug Severity 1 (Kritis)**: 0 temuan.
- **Uptime Test Environment**: 99.8%.

## 3. Isu, Risiko, & Mitigasi
> **Risiko**: Keterlambatan persetujuan dokumen API dari pihak ketiga (Vendor SMS Gateway).  
> **Mitigasi**: Tim konsultan mengalihkan fokus ke sandbox environment sementara agar jadwal sprint frontend tidak terhambat.

## 4. Rencana Kerja Minggu Berikutnya
1. Finalisasi uji beban sistem (stress test) kapasitas 10.000 concurrent user.
2. Review dokumen User Acceptance Testing (UAT) bersama Kepala Divisi Risiko.
3. Presentasi laporan tengah periode (Mid-term Executive Briefing).`,
  },
  {
    id: "tpl-memo",
    name: "Executive Decision Memo",
    category: "Strategi" as const,
    desc: "Memorandum singkat untuk dewan direksi mengenai rekomendasi keputusan strategis.",
    content: `# Memorandum Keputusan Direksi

**Kepada**: Dewan Direksi & Chief Operating Officer  
**Dari**: Tim Konsultan Strategi All in One  
**Topik**: Rekomendasi Pemilihan Platform Enterprise ERP  
**Kebutuhan Keputusan**: Persetujuan Alokasi Vendor Sebelum Akhir Q3  

---

## 1. Pertanyaan Strategis
Apakah perusahaan sebaiknya mengadopsi platform ERP SaaS multitenant (Opsi A) atau membangun arsitektur hybrid private cloud (Opsi B)?

## 2. Perbandingan Singkat
| Kriteria Evaluasi | Opsi A (SaaS Terkelola) | Opsi B (Private Cloud) |
|---|---|---|
| Biaya Awal (CapEx) | Rendah (IDR 350 Juta) | Tinggi (IDR 1,2 Miliar) |
| Waktu Implementasi | 4 Bulan | 11 Bulan |
| Kustomisasi Alur Kerja | Sedang (Standar Industri) | Sangat Fleksibel |
| Kebutuhan Tim Internal | 2 FTE | 6 FTE |

## 3. Rekomendasi Konsultan
Kami merekomendasikan **Opsi A (SaaS Terkelola)** dengan argumen:
1. Mengurangi *time-to-market* hingga 7 bulan lebih cepat.
2. Meminimalkan risiko ketergantungan personil teknis in-house.
3. Total Biaya Kepemilikan (TCO) 3 tahun 28% lebih efisien.

## 4. Langkah Tindak Lanjut yang Dibutuhkan
- Persetujuan tanda tangan otorisasi kontrak vendor Opsi A.
- Penunjukan Project Management Officer (PMO) pendamping dari divisi keuangan.`,
  },
  {
    id: "tpl-sop",
    name: "SOP & Panduan Audit Finansial",
    category: "SOP" as const,
    desc: "Standar operasional prosedur pengujian model keuangan dan validasi asumsi.",
    content: `# Standar Operasional Prosedur: Audit Model Keuangan

**Kode Dokumen**: SOP-ADV-004  
**Revisi**: 2.1  
**Klasifikasi**: Internal Confidential  

---

## 1. Tujuan
Memastikan seluruh model valuasi DCF, proyeksi arus kas, dan rasio solvabilitas klien bebas dari kesalahan formula dan berbasis asumsi pasar yang terverifikasi.

## 2. Daftar Periksa Sebelum Rilis (Checklist Pre-Release)
- [ ] Verifikasi konsistensi formula seluruh sheet proyeksi P&L, Balance Sheet, dan Cash Flow.
- [ ] Uji sensitivitas terhadap kenaikan suku bunga acuan (+100 bps dan +200 bps).
- [ ] Validasi WACC menggunakan formula CAPM dengan data beta industri terupdate.
- [ ] Konfirmasi tanggal cut-off neraca audited dengan laporan auditor eksternal.

## 3. Alur Persetujuan (Sign-off Flow)
1. **Analis**: Pengisian lembar kerja dan pengetesan margin error < 0.01%.
2. **Senior Associate**: Pengecekan logika bisnis dan benchmark industri.
3. **Managing Partner**: Tanda tangan laporan final sebelum diserahkan ke komite audit klien.`,
  },
];

const INITIAL_DOCS: WritingDoc[] = [
  {
    id: "doc-1",
    title: "Kajian Kelayakan Ekspansi Pabrik Logistik Jawa Timur",
    client: "PT Indo Surya Logistik",
    category: "Strategi",
    status: "In Review",
    content: TEMPLATES[2].content,
    updatedAt: "2026-09-18 14:30",
  },
  {
    id: "doc-2",
    title: "Proposal Penguatan Tata Kelola Risiko Perbankan",
    client: "Bank Mitra Niaga Syariah",
    category: "Proposal",
    status: "Final",
    content: TEMPLATES[0].content,
    updatedAt: "2026-09-17 10:15",
  },
  {
    id: "doc-3",
    title: "Laporan Kemajuan Proyek Restrukturisasi Operasional",
    client: "Samudra Maritim Lines",
    category: "Laporan",
    status: "Draft",
    content: TEMPLATES[1].content,
    updatedAt: "2026-09-19 09:20",
  },
  {
    id: "doc-4",
    title: "Pedoman Standar Review Due Diligence M&A",
    client: "Internal All in One Advisory",
    category: "SOP",
    status: "Final",
    content: TEMPLATES[3].content,
    updatedAt: "2026-09-15 16:45",
  },
];

export function WritingView() {
  const [docs, setDocs] = useState<WritingDoc[]>(() => {
    try {
      const saved = localStorage.getItem("aio_writing_documents_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_DOCS;
  });

  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [editorMode, setEditorMode] = useState<"edit" | "preview">("edit");
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("aio_writing_documents_v1", JSON.stringify(docs));
    } catch (e) {
      console.error("Failed to save documents", e);
    }
  }, [docs]);

  const activeDoc = useMemo(() => {
    return docs.find((d) => d.id === activeDocId) || null;
  }, [docs, activeDocId]);

  const filteredDocs = useMemo(() => {
    return docs.filter((d) => {
      const matchSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat =
        selectedCategory === "Semua" || d.category === selectedCategory;
      const matchStatus =
        selectedStatus === "Semua" || d.status === selectedStatus;
      return matchSearch && matchCat && matchStatus;
    });
  }, [docs, searchQuery, selectedCategory, selectedStatus]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: docs.length,
      drafts: docs.filter((d) => d.status === "Draft").length,
      inReview: docs.filter((d) => d.status === "In Review").length,
      final: docs.filter((d) => d.status === "Final").length,
    };
  }, [docs]);

  // Word & Reading statistics for active doc
  const docStats = useMemo(() => {
    if (!activeDoc) return { words: 0, chars: 0, readingTime: 1 };
    const words = activeDoc.content.trim()
      ? activeDoc.content.trim().split(/\s+/).length
      : 0;
    const chars = activeDoc.content.length;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readingTime };
  }, [activeDoc]);

  // Update active document fields
  const updateActiveDoc = (fields: Partial<WritingDoc>) => {
    if (!activeDocId) return;
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setDocs((prev) =>
      prev.map((doc) =>
        doc.id === activeDocId ? { ...doc, ...fields, updatedAt: formatted } : doc
      )
    );
  };

  // Create new document
  const handleCreateNew = (template?: (typeof TEMPLATES)[0]) => {
    const now = new Date();
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newDoc: WritingDoc = {
      id: `doc-${Date.now()}`,
      title: template ? template.name : "Draft Dokumen Baru Tanpa Judul",
      client: "Klien Strategis Baru",
      category: template ? template.category : "Strategi",
      status: "Draft",
      content: template
        ? template.content
        : `# Draft Dokumen Baru\n\n**Klien**: Masukkan Nama Klien\n**Tanggal**: ${formatted}\n\n---\n\n## 1. Pendahuluan\nTuliskan latar belakang atau tujuan analisis di sini.\n\n## 2. Temuan Utama\n- Poin pertama analisis...\n- Poin kedua rekomendasi...\n`,
      updatedAt: formatted,
    };

    setDocs([newDoc, ...docs]);
    setActiveDocId(newDoc.id);
    setShowTemplateModal(false);
  };

  // Delete document
  const handleDeleteDoc = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (window.confirm("Hapus dokumen ini secara permanen?")) {
      setDocs((prev) => prev.filter((d) => d.id !== id));
      if (activeDocId === id) {
        setActiveDocId(null);
      }
    }
  };

  // Copy Markdown to clipboard
  const handleCopyMarkdown = () => {
    if (!activeDoc) return;
    navigator.clipboard.writeText(activeDoc.content);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  // Download .md
  const handleDownloadMarkdown = () => {
    if (!activeDoc) return;
    const blob = new Blob([activeDoc.content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeDoc.title.replace(/[^a-zA-Z0-9_-]/g, "_")}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Insert markdown shortcut
  const insertFormatting = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("document-textarea") as HTMLTextAreaElement | null;
    if (!textarea || !activeDoc) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = activeDoc.content;
    const selected = text.substring(start, end);

    const replacement = `${prefix}${selected || "teks"}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    updateActiveDoc({ content: newContent });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4)
      );
    }, 50);
  };

  // ----------------------------------------------------
  // RENDER: Active Document Editor View
  // ----------------------------------------------------
  if (activeDoc) {
    return (
      <div className="w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Navigation & Action Topbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveDocId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Semua Dokumen</span>
            </button>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
              <Clock size={13} />
              <span>Diedit: {activeDoc.updatedAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-muted/70 p-1 rounded-lg border border-border text-xs">
              <button
                onClick={() => setEditorMode("edit")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors",
                  editorMode === "edit"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Edit3 size={13} />
                <span>Editor</span>
              </button>
              <button
                onClick={() => setEditorMode("preview")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-colors",
                  editorMode === "preview"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Eye size={13} />
                <span>Pratinjau</span>
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyMarkdown}
              title="Salin isi Markdown ke clipboard"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors"
            >
              {copiedNotification ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-emerald-600 font-semibold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span className="hidden sm:inline">Salin .md</span>
                </>
              )}
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownloadMarkdown}
              title="Unduh file .md"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Unduh</span>
            </button>

            {/* Print Button */}
            <button
              onClick={() => window.print()}
              title="Cetak atau simpan sebagai PDF"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors"
            >
              <Printer size={14} />
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteDoc(activeDoc.id)}
              title="Hapus dokumen"
              className="p-1.5 text-xs font-medium rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Document Header Metadata Editor */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 mb-5 shadow-xs">
          <div className="mb-4">
            <input
              type="text"
              value={activeDoc.title}
              onChange={(e) => updateActiveDoc({ title: e.target.value })}
              placeholder="Judul Dokumen..."
              className="w-full text-xl sm:text-2xl lg:text-3xl font-bold text-foreground bg-transparent border-none outline-hidden placeholder:text-muted-foreground/40"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60 text-xs sm:text-sm">
            {/* Client Input */}
            <div className="flex items-center gap-2">
              <User size={15} className="text-muted-foreground shrink-0" />
              <input
                type="text"
                value={activeDoc.client}
                onChange={(e) => updateActiveDoc({ client: e.target.value })}
                placeholder="Nama Klien..."
                className="w-full bg-muted/40 px-2.5 py-1.5 rounded-lg border border-border/70 text-foreground outline-hidden focus:border-primary"
              />
            </div>

            {/* Category Selector */}
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-muted-foreground shrink-0" />
              <select
                value={activeDoc.category}
                onChange={(e) =>
                  updateActiveDoc({
                    category: e.target.value as WritingDoc["category"],
                  })
                }
                className="w-full bg-muted/40 px-2.5 py-1.5 rounded-lg border border-border/70 text-foreground outline-hidden focus:border-primary"
              >
                <option value="Proposal">Proposal</option>
                <option value="Strategi">Strategi</option>
                <option value="Laporan">Laporan</option>
                <option value="SOP">SOP</option>
              </select>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-muted-foreground shrink-0" />
              <select
                value={activeDoc.status}
                onChange={(e) =>
                  updateActiveDoc({
                    status: e.target.value as WritingDoc["status"],
                  })
                }
                className="w-full bg-muted/40 px-2.5 py-1.5 rounded-lg border border-border/70 text-foreground outline-hidden focus:border-primary"
              >
                <option value="Draft">Draft</option>
                <option value="In Review">In Review</option>
                <option value="Final">Final</option>
              </select>
            </div>
          </div>
        </div>

        {/* Toolbar (Only shown in Edit mode) */}
        {editorMode === "edit" && (
          <div className="flex items-center flex-wrap gap-1 p-2 bg-muted/60 border border-border rounded-xl mb-3 text-xs">
            <button
              onClick={() => insertFormatting("# ")}
              title="Heading 1"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors font-bold"
            >
              <Heading1 size={16} />
            </button>
            <button
              onClick={() => insertFormatting("## ")}
              title="Heading 2"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors font-bold"
            >
              <Heading2 size={16} />
            </button>
            <button
              onClick={() => insertFormatting("### ")}
              title="Heading 3"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors font-bold"
            >
              <Heading3 size={16} />
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <button
              onClick={() => insertFormatting("**", "**")}
              title="Tebal (Bold)"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors"
            >
              <Bold size={16} />
            </button>
            <button
              onClick={() => insertFormatting("*", "*")}
              title="Miring (Italic)"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors"
            >
              <Italic size={16} />
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <button
              onClick={() => insertFormatting("- ")}
              title="Daftar Bullet"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => insertFormatting("1. ")}
              title="Daftar Angka"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors"
            >
              <ListOrdered size={16} />
            </button>
            <button
              onClick={() => insertFormatting("- [ ] ")}
              title="Daftar Tugas (Checklist)"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors"
            >
              <CheckCircle2 size={16} />
            </button>
            <div className="h-4 w-px bg-border mx-1" />
            <button
              onClick={() => insertFormatting("> ")}
              title="Kutipan / Catatan"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors"
            >
              <Quote size={16} />
            </button>
            <button
              onClick={() => insertFormatting("```\n", "\n```")}
              title="Blok Kode"
              className="p-1.5 rounded hover:bg-card text-foreground transition-colors"
            >
              <CodeIcon size={16} />
            </button>

            <div className="ml-auto text-muted-foreground text-[11px] px-2 font-mono flex items-center gap-3">
              <span>{docStats.words} kata</span>
              <span>{docStats.chars} karakter</span>
              <span>~{docStats.readingTime} mnt baca</span>
            </div>
          </div>
        )}

        {/* Content Canvas */}
        <div className="flex-1 min-h-[500px] flex flex-col bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
          {editorMode === "edit" ? (
            <textarea
              id="document-textarea"
              value={activeDoc.content}
              onChange={(e) => updateActiveDoc({ content: e.target.value })}
              placeholder="Tuliskan isi dokumen di sini menggunakan format Markdown..."
              className="w-full flex-1 p-6 sm:p-8 bg-transparent border-none outline-hidden font-mono text-sm leading-relaxed resize-none text-foreground placeholder:text-muted-foreground/30 focus:ring-0"
            />
          ) : (
            <div className="w-full flex-1 p-6 sm:p-10 overflow-y-auto max-w-4xl mx-auto space-y-4 text-foreground leading-relaxed">
              {activeDoc.content.split("\n").map((line, idx) => {
                if (line.startsWith("# ")) {
                  return (
                    <h1 key={idx} className="text-2xl sm:text-3xl font-bold pt-4 pb-2 border-b border-border text-foreground">
                      {line.replace("# ", "")}
                    </h1>
                  );
                }
                if (line.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="text-xl sm:text-2xl font-semibold pt-4 pb-1 text-foreground">
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3 key={idx} className="text-lg font-semibold pt-2 text-foreground">
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                if (line.startsWith("> ")) {
                  return (
                    <blockquote key={idx} className="border-l-4 border-primary pl-4 py-1.5 my-2 italic bg-muted/30 rounded-r-lg text-muted-foreground">
                      {line.replace("> ", "")}
                    </blockquote>
                  );
                }
                if (line.startsWith("- [ ] ")) {
                  return (
                    <div key={idx} className="flex items-center gap-2.5 my-1 text-sm">
                      <div className="w-4 h-4 rounded border border-muted-foreground/50 flex items-center justify-center shrink-0" />
                      <span>{line.replace("- [ ] ", "")}</span>
                    </div>
                  );
                }
                if (line.startsWith("- [x] ")) {
                  return (
                    <div key={idx} className="flex items-center gap-2.5 my-1 text-sm text-muted-foreground line-through">
                      <div className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs">
                        ✓
                      </div>
                      <span>{line.replace("- [x] ", "")}</span>
                    </div>
                  );
                }
                if (line.startsWith("- ")) {
                  return (
                    <li key={idx} className="ml-5 list-disc text-sm my-0.5">
                      {line.replace("- ", "")}
                    </li>
                  );
                }
                if (line.trim() === "---") {
                  return <hr key={idx} className="my-6 border-border" />;
                }
                if (!line.trim()) {
                  return <div key={idx} className="h-2" />;
                }
                return (
                  <p key={idx} className="text-sm sm:text-base leading-relaxed text-foreground/90">
                    {line}
                  </p>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // RENDER: Documents List View & Template Browser
  // ----------------------------------------------------
  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-6xl mx-auto w-full flex flex-col space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/10 text-blue-600 rounded-xl">
              <Type size={22} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Writing Workspace</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            Pusat penyusunan proposal, laporan kemajuan proyek klien, kajian strategis, dan SOP operasional konsultan.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-border bg-card hover:bg-accent text-foreground transition-colors shadow-xs"
          >
            <BookOpen size={16} />
            <span>Pilih Kerangka</span>
          </button>

          <button
            onClick={() => handleCreateNew()}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
          >
            <Plus size={16} />
            <span>Draf Baru</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-muted-foreground font-medium">Total Dokumen</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Draf Aktif</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.drafts}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Dalam Review</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.inReview}</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Disetujui / Final</span>
          <p className="text-2xl font-bold text-foreground mt-1">{stats.final}</p>
        </div>
      </div>

      {/* Template Frameworks Quick-Start Carousel */}
      <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-border/80 dark:from-border/60 dark:via-blue-950/30 dark:to-border/60 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm sm:text-base font-semibold text-foreground">
              Mulai Cepat dengan Kerangka Standar Konsultan
            </h3>
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">Klik untuk generate dokumen instan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              onClick={() => handleCreateNew(tpl)}
              className="group bg-card/90 hover:bg-card border border-border/80 hover:border-blue-500/50 rounded-xl p-3.5 cursor-pointer transition-all hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium text-[10px]">
                    {tpl.category}
                  </span>
                  <Plus size={14} className="text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                  {tpl.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {tpl.desc}
                </p>
              </div>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-3 inline-block">
                Gunakan Kerangka →
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari berdasarkan judul, klien, atau kata kunci..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-card border border-border text-foreground outline-hidden focus:border-primary placeholder:text-muted-foreground"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border text-xs">
            {["Semua", "Proposal", "Strategi", "Laporan", "SOP"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-medium transition-colors whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-border bg-card text-xs text-foreground outline-hidden"
          >
            <option value="Semua">Semua Status</option>
            <option value="Draft">Draft</option>
            <option value="In Review">In Review</option>
            <option value="Final">Final</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-2xl bg-card/40 text-center">
          <FileText size={36} className="text-muted-foreground/50 mb-3" />
          <h4 className="font-semibold text-foreground text-sm sm:text-base">Tidak ada dokumen yang sesuai</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Coba sesuaikan kata kunci pencarian atau buat draf dokumen konsultasi baru.
          </p>
          <button
            onClick={() => handleCreateNew()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-medium hover:bg-primary/90 transition-colors"
          >
            Buat Dokumen Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDocs.map((doc) => {
            const wordCount = doc.content.trim() ? doc.content.trim().split(/\s+/).length : 0;
            const readingMin = Math.max(1, Math.ceil(wordCount / 200));

            return (
              <div
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className="group bg-card border border-border hover:border-blue-500/50 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                      {doc.category}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                        doc.status === "Final"
                          ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400"
                          : doc.status === "In Review"
                          ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
                          : "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                      )}
                    >
                      {doc.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-foreground group-hover:text-blue-600 transition-colors line-clamp-1">
                    {doc.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                    <User size={12} />
                    <span>{doc.client}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3 line-clamp-2 leading-relaxed font-mono">
                    {doc.content.replace(/[#*`_\[\]]/g, "").substring(0, 160)}...
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60 text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span>{wordCount} kata</span>
                    <span>•</span>
                    <span>~{readingMin} mnt baca</span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDocId(doc.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-muted text-foreground transition-colors"
                      title="Edit Dokumen"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteDoc(doc.id, e)}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Template Framework Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-blue-600" />
                <h3 className="text-lg font-bold text-foreground">Koleksi Kerangka Konsultan</h3>
              </div>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-medium"
              >
                Tutup ✕
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              Pilih salah satu template siap pakai berikut untuk memulai draf dokumen dengan struktur terstandar:
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleCreateNew(tpl)}
                  className="p-4 rounded-xl border border-border hover:border-blue-500 bg-muted/30 hover:bg-muted/60 cursor-pointer transition-all flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {tpl.category}
                      </span>
                      <h4 className="text-sm font-bold text-foreground">{tpl.name}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{tpl.desc}</p>
                  </div>
                  <button className="shrink-0 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950 px-3 py-1.5 rounded-lg">
                    Pakai
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
