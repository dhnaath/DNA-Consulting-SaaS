import { ShellHeader } from "@/app/shell-header";
import { ShellSidebar } from "@/app/shell-sidebar";
import React, { useState, useMemo } from "react";
import {
  FileCheck,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Send,
  RotateCcw,
  Sparkles,
  BarChart3,
  History,
  Archive,
  Trash2,
  Edit3,
  Users,
  Lock,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  useDocumentsStore,
} from "./store";
import {
  DocumentStatus,
  DocumentViewMode,
  ConfidentialityLevel,
} from "./types";

export function DocumentsApp() {
  const {
    documents,
    versions,
    assignments,
    categories,
    activities,
    templates,
    statistics,
    createDocument,
    updateDocument,
    submitForReview,
    approveDocument,
    rejectDocument,
    publishDocument,
    reviseDocument,
    archiveDocument,
    restoreDocument,
    deleteDocument,
    applyTemplate,
  } = useDocumentsStore();

  // Navigation & View Mode
  const [viewMode, setViewMode] = useState<DocumentViewMode>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [confidentialityFilter, setConfidentialityFilter] = useState<string>("all");

  // Selected document for full detail view / editor
  const [selectedDocId, setSelectedDocId] = useState<string | null>(
    documents.find((d) => d.status !== "Archived")?.id || null
  );

  // Active Tab inside Document Detail Pane: 'content' | 'versions' | 'metadata' | 'approvals' | 'activity'
  const [detailTab, setDetailTab] = useState<"content" | "versions" | "metadata" | "approvals" | "activity">("content");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSubmitReviewModalOpen, setIsSubmitReviewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReviseModalOpen, setIsReviseModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);

  // Form states for Create/Edit
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formCategory, setFormCategory] = useState("cat-sop");
  const [formFolder, setFormFolder] = useState("fld-ops");
  const [formDept, setFormDept] = useState("Operasional");
  const [formDocNumber, setFormDocNumber] = useState("");
  const [formConfidentiality, setFormConfidentiality] = useState<ConfidentialityLevel>("Internal");
  const [formEffectiveDate, setFormEffectiveDate] = useState("");
  const [formExpiryDate, setFormExpiryDate] = useState("");
  const [formContent, setFormContent] = useState("");

  // Review submission inputs
  const [reviewerNameInput, setReviewerNameInput] = useState("Hendra Wijaya (Legal & Compliance)");
  const [reviewerRoleInput, setReviewerRoleInput] = useState<"reviewer" | "approver">("approver");
  const [rejectReasonInput, setRejectReasonInput] = useState("");
  const [commentInput, setCommentInput] = useState("");

  // Revise inputs
  const [isMajorRevise, setIsMajorRevise] = useState(false);
  const [reviseSummary, setReviseSummary] = useState("");

  // Active selected document
  const currentDoc = useMemo(() => {
    return documents.find((d) => d.id === selectedDocId) || null;
  }, [documents, selectedDocId]);

  // Current active version of the selected document
  const currentVersion = useMemo(() => {
    if (!currentDoc) return null;
    return versions.find((v) => v.id === currentDoc.currentVersionId) || null;
  }, [currentDoc, versions]);

  // All versions of the selected document
  const currentDocVersions = useMemo(() => {
    if (!currentDoc) return [];
    return versions.filter((v) => v.documentId === currentDoc.id);
  }, [currentDoc, versions]);

  // Assignments of the selected document
  const currentAssignments = useMemo(() => {
    if (!currentDoc) return [];
    return assignments.filter((a) => a.documentId === currentDoc.id);
  }, [currentDoc, assignments]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // View mode filters
      if (viewMode === "archived") return doc.status === "Archived";
      if (doc.status === "Archived") return false;

      if (viewMode === "board") {
        // all active board
      } else if (viewMode === "my_drafts") {
        if (doc.status !== "Draft") return false;
      } else if (viewMode === "pending_review") {
        if (doc.status !== "In Review") return false;
      } else if (viewMode === "published") {
        if (doc.status !== "Published") return false;
      } else if (viewMode === "expiring") {
        if (doc.status !== "Published" || !doc.expiryDate) return false;
        const expTime = new Date(doc.expiryDate).getTime();
        const now = Date.now();
        const in30d = now + 30 * 86400000;
        if (expTime < now || expTime > in30d) return false;
      }

      // Dropdown filters
      if (statusFilter !== "all" && doc.status !== statusFilter) return false;
      if (categoryFilter !== "all" && doc.documentType !== categoryFilter) return false;
      if (confidentialityFilter !== "all" && doc.confidentiality !== confidentialityFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchNumber = doc.metadata.documentNumber?.toLowerCase().includes(q);
        const matchDept = doc.metadata.department?.toLowerCase().includes(q);
        const matchOwner = doc.ownerName.toLowerCase().includes(q);
        if (!matchTitle && !matchNumber && !matchDept && !matchOwner) return false;
      }

      return true;
    }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [documents, viewMode, statusFilter, categoryFilter, confidentialityFilter, searchQuery]);

  // Handle Create Submit
  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newDoc = createDocument({
      title: formTitle,
      description: formDesc,
      documentType: formCategory,
      folderId: formFolder,
      department: formDept,
      documentNumber: formDocNumber,
      confidentiality: formConfidentiality,
      effectiveDate: formEffectiveDate || undefined,
      expiryDate: formExpiryDate || undefined,
      content: formContent,
    });

    setSelectedDocId(newDoc.id);
    setIsCreateModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormTitle("");
    setFormDesc("");
    setFormDocNumber("");
    setFormContent("");
    setFormEffectiveDate("");
    setFormExpiryDate("");
  };

  // Handle Save Content Edit
  const handleSaveContent = () => {
    if (!currentDoc) return;
    updateDocument(currentDoc.id, {}, formContent);
    setIsEditingContent(false);
  };

  // Handle Submit for Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDoc || !reviewerNameInput.trim()) return;
    submitForReview(currentDoc.id, reviewerNameInput, reviewerRoleInput);
    setIsSubmitReviewModalOpen(false);
  };

  // Handle Reject Submit
  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDoc || !rejectReasonInput.trim()) return;
    rejectDocument(currentDoc.id, "Tim Peninjau", rejectReasonInput);
    setIsRejectModalOpen(false);
    setRejectReasonInput("");
  };

  // Handle Revise Submit
  const handleReviseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDoc) return;
    reviseDocument(currentDoc.id, isMajorRevise, reviseSummary || "Pembaruan versi dokumen");
    setIsReviseModalOpen(false);
    setReviseSummary("");
  };

  // Status Badge Helper
  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case "Published":
        return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
      case "In Review":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
      case "Approved":
        return "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800";
      case "Rejected":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";
      case "Archived":
        return "bg-muted dark:bg-card text-muted-foreground dark:text-muted-foreground border-border dark:border-border";
      default:
        return "bg-muted dark:bg-card text-foreground dark:text-foreground border-border dark:border-border";
    }
  };

  // Confidentiality Badge Helper
  const getConfidentialityBadge = (conf: ConfidentialityLevel) => {
    switch (conf) {
      case "Restricted":
        return "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300";
      case "Confidential":
        return "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300";
      case "Internal":
        return "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300";
      default:
        return "bg-muted dark:bg-card text-foreground dark:text-foreground border-border";
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col font-sans bg-background">
      {/* Action Toolbar Portaled to Main Header */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            title="Template SOP & NDA"
            aria-label="Template Dokumen"
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
          >
            <Sparkles className="size-3.5 text-amber-500" />
          </button>

          <button
            onClick={() => setIsStatsModalOpen(true)}
            title="Statistik Dokumen"
            aria-label="Statistik"
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
          >
            <BarChart3 className="size-3.5 text-blue-500" />
          </button>

          <button
            onClick={() => setIsAuditModalOpen(true)}
            title="Audit Trail Dokumen"
            aria-label="Audit Trail"
            className="p-1.5 rounded-lg border border-border bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors cursor-pointer shrink-0"
          >
            <History className="size-3.5 text-muted-foreground" />
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsCreateModalOpen(true);
            }}
            title="Buat Dokumen Baru"
            aria-label="Dokumen Baru"
            className="p-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-xs hover:opacity-90 transition-opacity cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="size-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </ShellHeader>

      {/* 2. MAIN SPLIT INTERFACE */}
      <div className="flex-1 w-full flex flex-col md:flex-row">
        {/* LEFT COLUMN: Navigation & Filtered Documents List */}
        <ShellSidebar>
          {/* View Filter Pills */}
          <div className="bg-card border border-border rounded-2xl p-2.5 flex flex-wrap gap-1 text-xs shadow-2xs">
            <button
              onClick={() => setViewMode("all")}
              className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === "all"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              Semua ({documents.filter((d) => d.status !== "Archived").length})
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === "board"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              Status Board
            </button>
            <button
              onClick={() => setViewMode("pending_review")}
              className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === "pending_review"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              In Review ({statistics.byStatus["In Review"] || 0})
            </button>
            <button
              onClick={() => setViewMode("published")}
              className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === "published"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              Published ({statistics.byStatus["Published"] || 0})
            </button>
            <button
              onClick={() => setViewMode("expiring")}
              className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === "expiring"
                  ? "bg-rose-500 text-white font-semibold"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              Segera Expired ({statistics.expiringSoonCount})
            </button>
            <button
              onClick={() => setViewMode("archived")}
              className={`px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                viewMode === "archived"
                  ? "bg-muted text-foreground font-bold"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              Arsip ({statistics.byStatus["Archived"] || 0})
            </button>
          </div>

          {/* Search & Quick Dropdowns */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari judul, no. arsip, divisi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-2.5 py-1.5 text-muted-foreground text-[11px] focus:outline-none"
              >
                <option value="all">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={confidentialityFilter}
                onChange={(e) => setConfidentialityFilter(e.target.value)}
                className="bg-card border border-border rounded-xl px-2.5 py-1.5 text-muted-foreground text-[11px] focus:outline-none"
              >
                <option value="all">Kerahasiaan</option>
                <option value="Public">Public</option>
                <option value="Internal">Internal</option>
                <option value="Confidential">Confidential</option>
                <option value="Restricted">Restricted</option>
              </select>
            </div>
          </div>

          {/* Document Items List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[62vh] pr-1">
            {filteredDocuments.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground bg-card border border-border rounded-2xl">
                Tidak ada dokumen yang sesuai dengan filter.
              </div>
            ) : (
              filteredDocuments.map((doc) => {
                const isSelected = doc.id === selectedDocId;
                const cat = categories.find((c) => c.id === doc.documentType);
                const ver = versions.find((v) => v.id === doc.currentVersionId);
                return (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDocId(doc.id);
                      setIsEditingContent(false);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? "bg-primary/5 dark:bg-primary/10 border-primary shadow-xs"
                        : "bg-card border-border hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-semibold">
                        {doc.metadata.documentNumber || "DOC-UNASSIGNED"}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${getStatusBadge(
                            doc.status
                          )}`}
                        >
                          {doc.status}
                        </span>
                        <span className="text-[10px] font-mono text-primary font-bold">
                          v{ver ? ver.versionNumber : "0.1"}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-foreground line-clamp-2 mt-2 leading-snug">
                      {doc.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-muted-foreground mt-2.5 pt-2 border-t border-border/60">
                      <span className="truncate">{cat?.name || "Dokumen Resmi"}</span>
                      <span className="shrink-0">{doc.metadata.department || "Operasional"}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ShellSidebar>

        {/* RIGHT COLUMN: Full Detail Reader, Status Machine & Workflow Operations */}
        <main className="flex-1 bg-background p-6 sm:p-8 flex flex-col overflow-y-auto">
          {currentDoc && currentVersion ? (
            <div className="space-y-6 flex-1 flex flex-col">
              {/* Header: Document Identification & State Machine Badges */}
              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-muted text-foreground border border-border">
                        {currentDoc.metadata.documentNumber}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${getStatusBadge(
                          currentDoc.status
                        )}`}
                      >
                        {currentDoc.status}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        Versi {currentVersion.versionNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border uppercase ${getConfidentialityBadge(
                          currentDoc.confidentiality
                        )}`}
                      >
                        {currentDoc.confidentiality}
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                      {currentDoc.title}
                    </h2>
                  </div>

                  {/* WORKFLOW LIFECYCLE ACTION BUTTONS (§3.2 & §5) */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Draft Actions */}
                    {(currentDoc.status === "Draft" || currentDoc.status === "Rejected") && (
                      <>
                        <button
                          onClick={() => {
                            setFormContent(currentVersion.content);
                            setIsEditingContent(!isEditingContent);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-accent text-xs font-medium text-foreground cursor-pointer"
                        >
                          <Edit3 className="size-3.5 text-blue-500" />
                          <span>{isEditingContent ? "Tutup Editor" : "Edit Konten"}</span>
                        </button>
                        <button
                          onClick={() => setIsSubmitReviewModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:opacity-95 cursor-pointer shadow-xs"
                        >
                          <Send className="size-3.5" />
                          <span>Ajukan Review</span>
                        </button>
                      </>
                    )}

                    {/* In Review Actions */}
                    {currentDoc.status === "In Review" && (
                      <>
                        <button
                          onClick={() => approveDocument(currentDoc.id, "Manajemen / Approver")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 cursor-pointer shadow-xs"
                        >
                          <CheckCircle2 className="size-3.5" />
                          <span>Setujui (Approve)</span>
                        </button>
                        <button
                          onClick={() => setIsRejectModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-300 text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                        >
                          <XCircle className="size-3.5" />
                          <span>Tolak (Reject)</span>
                        </button>
                      </>
                    )}

                    {/* Approved Actions */}
                    {currentDoc.status === "Approved" && (
                      <button
                        onClick={() => publishDocument(currentDoc.id)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer shadow-xs"
                      >
                        <Check className="size-3.5" />
                        <span>Sahkan & Publikasikan (Publish)</span>
                      </button>
                    )}

                    {/* Published Actions: Content is Read-Only! Requires Revise */}
                    {currentDoc.status === "Published" && (
                      <button
                        onClick={() => {
                          setIsMajorRevise(false);
                          setIsReviseModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="size-3.5" />
                        <span>Revisi (Buat Versi Baru)</span>
                      </button>
                    )}

                    {/* Archive / Delete */}
                    {currentDoc.status === "Archived" ? (
                      <button
                        onClick={() => restoreDocument(currentDoc.id)}
                        className="p-1.5 rounded-xl border border-emerald-300 text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                        title="Pulihkan dari Arsip"
                      >
                        <RotateCcw className="size-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => archiveDocument(currentDoc.id)}
                        className="p-1.5 rounded-xl border border-border text-muted-foreground hover:bg-accent cursor-pointer"
                        title="Arsipkan Dokumen"
                      >
                        <Archive className="size-3.5" />
                      </button>
                    )}

                    {/* Delete: ONLY for Draft */}
                    {currentDoc.status === "Draft" && !currentDoc.publishedAt && (
                      <button
                        onClick={() => {
                          if (confirm("Hapus draf dokumen ini secara permanen?")) {
                            deleteDocument(currentDoc.id);
                          }
                        }}
                        className="p-1.5 rounded-xl border border-border text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Hapus Draft"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Sub-meta strip */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span>Penyusun: <strong className="text-foreground">{currentDoc.ownerName}</strong> ({currentDoc.metadata.department})</span>
                  <span>•</span>
                  <span>Masa Berlaku: {currentDoc.effectiveDate || "Segera"} s/d {currentDoc.expiryDate || "Tidak Terbatas"}</span>
                  <span>•</span>
                  <span>Terakhir Diubah: {new Date(currentDoc.updatedAt).toLocaleDateString("id-ID")}</span>
                </div>
              </div>

              {/* Navigation Tabs inside Detail Pane */}
              <div className="flex items-center gap-1 border-b border-border pb-1">
                <button
                  onClick={() => setDetailTab("content")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    detailTab === "content" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Isi Dokumen
                </button>
                <button
                  onClick={() => setDetailTab("versions")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    detailTab === "versions" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Histori Versi ({currentDocVersions.length})
                </button>
                <button
                  onClick={() => setDetailTab("metadata")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    detailTab === "metadata" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Metadata & Kepatuhan
                </button>
                <button
                  onClick={() => setDetailTab("approvals")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    detailTab === "approvals" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Persetujuan ({currentAssignments.length})
                </button>
                <button
                  onClick={() => setDetailTab("activity")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    detailTab === "activity" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Audit Trail
                </button>
              </div>

              {/* TAB 1: CONTENT VIEW / EDITOR */}
              {detailTab === "content" && (
                <div className="space-y-4 flex-1 flex flex-col">
                  {currentDoc.status === "Published" && (
                    <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex items-center justify-between text-xs text-blue-800 dark:text-blue-300">
                      <span className="flex items-center gap-2">
                        <Lock className="size-4 shrink-0" />
                        Dokumen ini berstatus <strong>Published</strong> (berlaku resmi) dan bersifat <strong>Read-Only</strong>. Untuk melakukan perubahan, gunakan tombol <strong>Revisi</strong> untuk membuat versi baru.
                      </span>
                    </div>
                  )}

                  {isEditingContent ? (
                    <div className="space-y-3 flex-1 flex flex-col">
                      <textarea
                        rows={14}
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        className="w-full flex-1 p-4 rounded-2xl border border-border bg-background text-foreground text-xs font-mono leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsEditingContent(false)}
                          className="px-3 py-1.5 rounded-xl border border-border text-xs text-muted-foreground cursor-pointer"
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleSaveContent}
                          className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
                        >
                          Simpan Perubahan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm dark:prose-invert max-w-none flex-1 overflow-y-auto p-4 rounded-2xl bg-muted/20 border border-border/80 text-xs leading-relaxed space-y-4 font-sans">
                      {currentVersion.content.split("\n\n").map((para, i) => {
                        if (para.startsWith("## ")) {
                          return (
                            <h3 key={i} className="text-sm font-bold text-foreground border-b border-border pb-1 mt-4">
                              {para.replace("## ", "")}
                            </h3>
                          );
                        }
                        if (para.startsWith("- ") || para.startsWith("1. ")) {
                          return (
                            <div key={i} className="pl-4 border-l-2 border-primary/40 font-mono text-xs">
                              {para}
                            </div>
                          );
                        }
                        return <p key={i} className="text-foreground/90 whitespace-pre-line">{para}</p>;
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: VERSIONS HISTORY (§4 & §10) */}
              {detailTab === "versions" && (
                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-muted-foreground">
                    Sesuai arsitektur <em>Immutable Version History</em> (§1), setiap versi yang telah disetujui atau dipublikasikan bersifat tetap. Versi terdahulu tersimpan otomatis sebagai <em>Superseded</em> saat versi baru dipublikasikan.
                  </div>

                  <div className="space-y-3">
                    {currentDocVersions.map((v) => (
                      <div
                        key={v.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          v.id === currentDoc.currentVersionId
                            ? "bg-primary/5 border-primary shadow-2xs"
                            : "bg-card border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold font-mono text-primary">v{v.versionNumber}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase bg-muted text-foreground">
                              {v.status}
                            </span>
                            {v.id === currentDoc.currentVersionId && (
                              <span className="text-[10px] bg-primary text-primary-foreground font-semibold px-2 py-0.5 rounded-full">
                                Versi Aktif
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(v.createdAt).toLocaleDateString("id-ID")}
                          </span>
                        </div>

                        <p className="text-xs text-foreground mt-2 font-medium">
                          {v.changeSummary || "Snapshot versi dokumen"}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-3 pt-2 border-t border-border/50">
                          <span>Disusun oleh: {v.createdBy}</span>
                          {v.approvedBy && <span>Disahkan oleh: {v.approvedBy}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: METADATA & COMPLIANCE (§6) */}
              {detailTab === "metadata" && (
                <div className="space-y-4 flex-1 overflow-y-auto text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                      <span className="text-muted-foreground text-[11px]">Nomor Identifikasi Dokumen Resmi</span>
                      <p className="font-mono font-bold text-foreground text-sm">{currentDoc.metadata.documentNumber}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                      <span className="text-muted-foreground text-[11px]">Tingkat Kerahasiaan (Confidentiality)</span>
                      <p className="font-bold text-foreground">{currentDoc.confidentiality}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                      <span className="text-muted-foreground text-[11px]">Divisi / Unit Kerja</span>
                      <p className="font-bold text-foreground">{currentDoc.metadata.department || "Operasional"}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                      <span className="text-muted-foreground text-[11px]">Pemilik & Penanggung Jawab</span>
                      <p className="font-bold text-foreground">{currentDoc.ownerName}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                      <span className="text-muted-foreground text-[11px]">Tanggal Mulai Berlaku (Effective Date)</span>
                      <p className="font-bold text-foreground">{currentDoc.effectiveDate || "Segera setelah disahkan"}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
                      <span className="text-muted-foreground text-[11px]">Tanggal Kedaluwarsa (Expiry Date)</span>
                      <p className="font-bold text-foreground">{currentDoc.expiryDate || "Tidak kedaluwarsa"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEW & APPROVALS (§8) */}
              {detailTab === "approvals" && (
                <div className="space-y-4 flex-1 overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Penugasan Reviewer & Approver
                    </h4>
                    {currentDoc.status === "Draft" && (
                      <button
                        onClick={() => setIsSubmitReviewModalOpen(true)}
                        className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                      >
                        + Tugaskan Reviewer
                      </button>
                    )}
                  </div>

                  {currentAssignments.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-6 text-center">
                      Belum ada reviewer atau approver yang ditugaskan pada versi ini.
                    </p>
                  ) : (
                    currentAssignments.map((asg) => (
                      <div key={asg.id} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Users className="size-4 text-primary" />
                            <span className="text-xs font-bold text-foreground">{asg.reviewerName}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase font-mono">
                              {asg.role}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                              asg.status === "approved"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                                : asg.status === "rejected"
                                ? "bg-rose-50 text-rose-600 border-rose-300"
                                : "bg-amber-50 text-amber-600 border-amber-300"
                            }`}
                          >
                            {asg.status}
                          </span>
                        </div>
                        {asg.comment && (
                          <div className="p-2.5 rounded-xl bg-muted/30 text-xs text-muted-foreground border-l-2 border-primary">
                            "{asg.comment}"
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: AUDIT TRAIL ACTIVITY (§13) */}
              {detailTab === "activity" && (
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {activities
                    .filter((a) => a.documentId === currentDoc.id)
                    .map((act) => (
                      <div key={act.id} className="relative pl-5 border-l-2 border-border space-y-1 py-1">
                        <span className="absolute -left-[5px] top-2 size-2 rounded-full bg-primary" />
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="uppercase font-semibold tracking-wider">{act.type}</span>
                          <span>{new Date(act.createdAt).toLocaleString("id-ID")}</span>
                        </div>
                        <p className="text-xs text-foreground font-medium">{act.description}</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-3">
              <FileCheck className="size-10 text-muted-foreground/40" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground">Pilih Dokumen Formal</h4>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Pilih dokumen dari panel kiri untuk membaca dan memproses alur persetujuan.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 3. MODAL: CREATE DOCUMENT */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDocument}
            className="bg-card border border-border rounded-3xl w-full max-w-2xl shadow-2xl p-6 sm:p-7 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <FileCheck className="size-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Buat Dokumen Formal Baru (Draft v0.1)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground block mb-1">Judul Dokumen *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: SOP Standar Penanganan Keluhan Pelanggan"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Kategori / Jenis Dokumen</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Tingkat Kerahasiaan</label>
                  <select
                    value={formConfidentiality}
                    onChange={(e) => setFormConfidentiality(e.target.value as ConfidentialityLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  >
                    <option value="Internal">Internal</option>
                    <option value="Public">Public</option>
                    <option value="Confidential">Confidential</option>
                    <option value="Restricted">Restricted</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">Divisi / Unit</label>
                  <input
                    type="text"
                    value={formDept}
                    onChange={(e) => setFormDept(e.target.value)}
                    placeholder="Operasional / Legal / IT"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-foreground block mb-1">Nomor Arsip Dokumen (Opsional)</label>
                  <input
                    type="text"
                    value={formDocNumber}
                    onChange={(e) => setFormDocNumber(e.target.value)}
                    placeholder="SOP/2026/OPS-001"
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground block mb-1">Konten Draf Awal</label>
                <textarea
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="## 1. Tujuan\nJelaskan tujuan dokumen...\n\n## 2. Ruang Lingkup\nBatasan prosedur..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs text-muted-foreground"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
              >
                Buat Draft Dokumen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. MODAL: TEMPLATES (§12) */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="size-5 text-amber-500" />
                <h3 className="text-sm font-bold text-foreground">Template Dokumen Formal</h3>
              </div>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    const n = applyTemplate(tpl);
                    setSelectedDocId(n.id);
                    setIsTemplateModalOpen(false);
                  }}
                  className="p-4 rounded-2xl border border-border bg-background hover:border-primary hover:shadow-xs transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {tpl.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted font-mono">
                      {tpl.suggestedConfidentiality}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tpl.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: SUBMIT REVIEW (§3.2 & §8) */}
      {isSubmitReviewModalOpen && currentDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmitReview}
            className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Ajukan untuk Peninjauan (Submit for Review)</h3>
              <button type="button" onClick={() => setIsSubmitReviewModalOpen(false)} className="text-muted-foreground">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-muted-foreground">
              Dokumen akan berpindah ke status <strong>In Review</strong> dan diteruskan ke pihak peninjau yang ditugaskan.
            </p>

            <div className="space-y-2">
              <label className="font-semibold text-foreground block">Nama Peninjau / Approver</label>
              <input
                type="text"
                required
                value={reviewerNameInput}
                onChange={(e) => setReviewerNameInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-foreground block">Peran</label>
              <select
                value={reviewerRoleInput}
                onChange={(e) => setReviewerRoleInput(e.target.value as "reviewer" | "approver")}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none"
              >
                <option value="approver">Approver (Pengambil Keputusan Persetujuan)</option>
                <option value="reviewer">Reviewer (Pemberi Catatan & Rekomendasi)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsSubmitReviewModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-border text-muted-foreground"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-semibold">
                Kirim Pengajuan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. MODAL: REJECT REASON (§3.3: Mandatory Reason!) */}
      {isRejectModalOpen && currentDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRejectSubmit}
            className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-rose-500" />
                <h3 className="text-sm font-bold text-foreground">Tolak Dokumen & Minta Perbaikan</h3>
              </div>
              <button type="button" onClick={() => setIsRejectModalOpen(false)} className="text-muted-foreground">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-muted-foreground">
              Sesuai aturan bisnis (§3.3), <strong>penolakan wajib menyertakan alasan</strong> agar pemilik dokumen mengetahui poin apa yang perlu diperbaiki. Status akan kembali ke Draft.
            </p>

            <div className="space-y-2">
              <label className="font-semibold text-foreground block">Alasan Penolakan / Catatan Perbaikan *</label>
              <textarea
                required
                rows={3}
                placeholder="Contoh: Perlu revisi klausul batas waktu penyerahan barang pada bagian 3..."
                value={rejectReasonInput}
                onChange={(e) => setRejectReasonInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsRejectModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-border text-muted-foreground"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-1.5 rounded-xl bg-rose-600 text-white font-semibold">
                Konfirmasi Penolakan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 7. MODAL: REVISE (NEW VERSION) (§4.1) */}
      {isReviseModalOpen && currentDoc && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleReviseSubmit}
            className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <h3 className="text-sm font-bold text-foreground">Mulai Siklus Revisi Versi Baru</h3>
              <button type="button" onClick={() => setIsReviseModalOpen(false)} className="text-muted-foreground">
                <X className="size-4" />
              </button>
            </div>

            <p className="text-muted-foreground leading-relaxed">
              Tindakan ini membentuk draf versi baru. Versi lama yang telah disahkan tetap berlaku resmi (Published) hingga draf versi baru ini melalui siklus review dan dipublikasikan.
            </p>

            <div className="space-y-2">
              <label className="font-semibold text-foreground block">Tipe Revisi</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsMajorRevise(false)}
                  className={`p-2.5 rounded-xl border text-center transition-colors ${
                    !isMajorRevise ? "bg-primary text-primary-foreground font-semibold" : "border-border text-foreground"
                  }`}
                >
                  Minor (mis. v2.1)
                </button>
                <button
                  type="button"
                  onClick={() => setIsMajorRevise(true)}
                  className={`p-2.5 rounded-xl border text-center transition-colors ${
                    isMajorRevise ? "bg-primary text-primary-foreground font-semibold" : "border-border text-foreground"
                  }`}
                >
                  Mayor (mis. v3.0)
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-foreground block">Ringkasan Rencana Perubahan</label>
              <input
                type="text"
                placeholder="Penyesuaian batas tender dan persyaratan sertifikasi..."
                value={reviseSummary}
                onChange={(e) => setReviseSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setIsReviseModalOpen(false)}
                className="px-3 py-1.5 rounded-xl border border-border text-muted-foreground"
              >
                Batal
              </button>
              <button type="submit" className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold">
                Buat Draf Revisi
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 8. MODAL: STATISTICS (§14) */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl w-full max-w-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <BarChart3 className="size-5 text-blue-500" />
                <h3 className="text-sm font-bold text-foreground">Statistik & Kepatuhan Dokumen (#13)</h3>
              </div>
              <button onClick={() => setIsStatsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-muted/40 text-center border border-border">
                <span className="text-[11px] text-muted-foreground block">Total Dokumen</span>
                <span className="text-2xl font-black text-foreground">{statistics.total}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 text-center border border-border">
                <span className="text-[11px] text-muted-foreground block">Published (Berlaku)</span>
                <span className="text-2xl font-black text-emerald-600">{statistics.byStatus.Published || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 text-center border border-border">
                <span className="text-[11px] text-muted-foreground block">Dalam Review</span>
                <span className="text-2xl font-black text-amber-500">{statistics.byStatus["In Review"] || 0}</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 text-center border border-border">
                <span className="text-[11px] text-muted-foreground block">Rejection Rate</span>
                <span className="text-2xl font-black text-rose-500">{statistics.rejectionRate}%</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Distribusi per Kategori
              </h4>
              <div className="space-y-1.5">
                {Object.entries(statistics.byCategory).map(([catId, val]) => (
                  <div key={catId} className="flex items-center justify-between text-xs py-1 border-b border-border/50">
                    <span className="text-foreground font-medium">{val.name}</span>
                    <span className="text-muted-foreground font-mono">{val.count} dokumen</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: AUDIT TRAIL (§13) */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-card border-l border-border w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
              <div className="flex items-center gap-2">
                <History className="size-5 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Global Document Audit Trail</h3>
              </div>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="relative pl-5 border-l-2 border-border space-y-1 py-1">
                  <span className="absolute -left-[5px] top-2 size-2 rounded-full bg-primary" />
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="uppercase font-semibold tracking-wider">{act.type}</span>
                    <span>{new Date(act.createdAt).toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-xs text-foreground font-medium">{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
