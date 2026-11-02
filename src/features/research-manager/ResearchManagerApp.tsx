import React, { useState, useMemo } from "react";
import {
  Compass,
  Plus,
  Search,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
  BarChart3,
  Trash2,
  FileText,
  TrendingUp,
  X,
  ShieldCheck,
  Split,
} from "lucide-react";
import { useResearchManagerStore } from "./store";
import { useShellSections } from "@/app/shell-sections";
import {
  ResearchSourceType,
  CredibilityLevel,
  SupportType,
  EvidenceStrength,
  ConfidenceLevel,
} from "./types";

export function ResearchManagerApp() {
  const {
    questions,
    sources,
    evidences,
    analyses,
    conclusions,
    addQuestion,
    deleteQuestion,
    addSource,
    deleteSource,
    addEvidence,
    deleteEvidence,
    saveAnalysis,
    setConclusion,
    promoteToKnowledgeBase,
  } = useResearchManagerStore();

  const [activeTab, setActiveTab] = useState<"detail" | "board" | "matrix" | "tree">("detail");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(
    questions.find((q) => !q.parentQuestionId)?.id || questions[0]?.id || ""
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals
  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState(false);
  const [newQTitle, setNewQTitle] = useState("");
  const [newQContext, setNewQContext] = useState("");
  const [newQParentId, setNewQParentId] = useState("");
  const [newQTags, setNewQTags] = useState("");

  const [isNewSourceModalOpen, setIsNewSourceModalOpen] = useState(false);
  const [newSrcTitle, setNewSrcTitle] = useState("");
  const [newSrcAuthor, setNewSrcAuthor] = useState("");
  const [newSrcUrl, setNewSrcUrl] = useState("");
  const [newSrcType, setNewSrcType] = useState<ResearchSourceType>("paper");
  const [newSrcCred, setNewSrcCred] = useState<CredibilityLevel>("high");

  const [isNewEvidenceModalOpen, setIsNewEvidenceModalOpen] = useState(false);
  const [newEvSourceId, setNewEvSourceId] = useState("");
  const [newEvStatement, setNewEvStatement] = useState("");
  const [newEvSupportType, setNewEvSupportType] = useState<SupportType>("supports");
  const [newEvStrength, setNewEvStrength] = useState<EvidenceStrength>("strong");
  const [newEvNote, setNewEvNote] = useState("");

  const [isConclusionModalOpen, setIsConclusionModalOpen] = useState(false);
  const [concStatement, setConcStatement] = useState("");
  const [concConfidence, setConcConfidence] = useState<ConfidenceLevel>("high");
  const [concEvidenceIds, setConcEvidenceIds] = useState<string[]>([]);
  const [concIsFinal, setConcIsFinal] = useState(true);

  const [analysisText, setAnalysisText] = useState("");
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [promoteSuccess, setPromoteSuccess] = useState(false);

  // Selected Question & its related objects
  const selectedQuestion = useMemo(
    () => questions.find((q) => q.id === selectedQuestionId),
    [questions, selectedQuestionId]
  );

  const qSources = useMemo(
    () => sources.filter((s) => s.researchQuestionId === selectedQuestionId),
    [sources, selectedQuestionId]
  );

  const qEvidences = useMemo(
    () => evidences.filter((e) => e.researchQuestionId === selectedQuestionId),
    [evidences, selectedQuestionId]
  );

  const qAnalysis = useMemo(
    () => analyses.find((a) => a.researchQuestionId === selectedQuestionId),
    [analyses, selectedQuestionId]
  );

  const qConclusion = useMemo(
    () => conclusions.find((c) => c.researchQuestionId === selectedQuestionId),
    [conclusions, selectedQuestionId]
  );

  const subQuestions = useMemo(
    () => questions.filter((q) => q.parentQuestionId === selectedQuestionId),
    [questions, selectedQuestionId]
  );

  // Update analysis draft when question changes
  React.useEffect(() => {
    setAnalysisText(qAnalysis?.content || "");
  }, [qAnalysis, selectedQuestionId]);

  // Statistics (§11)
  const stats = useMemo(() => {
    const total = questions.length;
    const answered = questions.filter((q) => q.status === "answered").length;
    const inProgress = questions.filter((q) => q.status === "in_progress").length;
    const open = questions.filter((q) => q.status === "open").length;
    const inconclusive = questions.filter((q) => q.status === "inconclusive").length;

    const answeredRatio = total > 0 ? `${Math.round((answered / total) * 100)}%` : "0%";
    const avgSources = total > 0 ? (sources.length / total).toFixed(1) : "0";
    const avgEvidence = conclusions.length > 0 ? (evidences.length / conclusions.length).toFixed(1) : "0";

    return {
      total,
      answered,
      inProgress,
      open,
      inconclusive,
      answeredRatio,
      avgSources,
      avgEvidence,
    };
  }, [questions, sources, evidences, conclusions]);

  // Publish this app's research questions as shell sections → they appear in
  // the left sidebar ("Di aplikasi ini") and as interactive header buttons.
  useShellSections(
    questions.map((q) => ({
      id: q.id,
      label: q.question,
      icon: HelpCircle,
      active: q.id === selectedQuestionId,
      onSelect: () => setSelectedQuestionId(q.id),
    })),
  );

  const handleCreateQuestion = () => {
    if (!newQTitle.trim()) return;
    const created = addQuestion({
      question: newQTitle,
      context: newQContext || undefined,
      status: "open",
      parentQuestionId: newQParentId || null,
      tags: newQTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
    setSelectedQuestionId(created.id);
    setNewQTitle("");
    setNewQContext("");
    setNewQParentId("");
    setNewQTags("");
    setIsNewQuestionModalOpen(false);
  };

  const handleCreateSource = () => {
    if (!selectedQuestionId || !newSrcTitle.trim()) return;
    addSource({
      researchQuestionId: selectedQuestionId,
      title: newSrcTitle,
      author: newSrcAuthor || undefined,
      url: newSrcUrl || undefined,
      type: newSrcType,
      credibility: newSrcCred,
    });
    setNewSrcTitle("");
    setNewSrcAuthor("");
    setNewSrcUrl("");
    setIsNewSourceModalOpen(false);
  };

  const handleCreateEvidence = () => {
    if (!selectedQuestionId || !newEvStatement.trim() || !newEvSourceId) return;
    addEvidence({
      researchQuestionId: selectedQuestionId,
      sourceId: newEvSourceId,
      statement: newEvStatement,
      supportType: newEvSupportType,
      strength: newEvStrength,
      note: newEvNote || undefined,
    });
    setNewEvStatement("");
    setNewEvNote("");
    setIsNewEvidenceModalOpen(false);
  };

  const handleSaveConclusion = () => {
    if (!selectedQuestionId || !concStatement.trim() || concEvidenceIds.length === 0) {
      alert("Aturan Traceability (§7): Kesimpulan WAJIB mencantumkan minimal 1 Evidence pendukung!");
      return;
    }
    setConclusion(
      selectedQuestionId,
      concStatement,
      concConfidence,
      concEvidenceIds,
      concIsFinal
    );
    setIsConclusionModalOpen(false);
  };

  const handlePromote = () => {
    if (!selectedQuestionId) return;
    const ok = promoteToKnowledgeBase(selectedQuestionId);
    if (ok) {
      setPromoteSuccess(true);
      setTimeout(() => setPromoteSuccess(false), 4000);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-muted/40 dark:bg-background text-foreground dark:text-foreground overflow-hidden font-sans">
      {/* Top Bar Header */}
      <div className="bg-card dark:bg-background border-b border-border dark:border-border px-4 py-3 shrink-0 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-card border border-border dark:border-border shadow-xs flex items-center justify-center text-foreground dark:text-foreground shrink-0 font-bold">
            <Compass className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-foreground dark:text-foreground">
                Research Manager
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted dark:bg-card font-semibold text-muted-foreground dark:text-foreground border border-border dark:border-border">
                #16 Standalone
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800">
                Question → Evidence → Conclusion
              </span>
            </div>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground">
              Proses investigasi terstruktur dari pertanyaan awal hingga kesimpulan berbobot bukti kredibel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {promoteSuccess && (
            <div className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold animate-in fade-in duration-200">
              <ShieldCheck className="size-4" /> Berhasil dipromosikan ke Knowledge Base (#14)!
            </div>
          )}
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border dark:border-border text-xs font-medium hover:bg-muted/40 dark:hover:bg-card transition-colors"
          >
            <BarChart3 className="size-3.5 text-muted-foreground" />
            Statistik ({stats.answeredRatio} terjawab)
          </button>
          <button
            onClick={() => setIsNewQuestionModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-foreground dark:bg-card text-background dark:text-foreground text-xs font-semibold hover:opacity-90 shadow-xs transition-opacity"
          >
            <Plus className="size-4" />
            Pertanyaan Riset Baru
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Questions List */}
        <div className="w-80 bg-card dark:bg-background border-r border-border dark:border-border flex flex-col shrink-0">
          <div className="p-3 border-b border-border dark:border-border space-y-2">
            <div className="relative">
              <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari pertanyaan riset..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card text-xs outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">Status Riset:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-muted/40 dark:bg-card border border-border dark:border-border rounded-md px-2 py-0.5 outline-none"
              >
                <option value="all">Semua Status</option>
                <option value="open">Open (Belum Dimulai)</option>
                <option value="in_progress">In Progress (Investigasi)</option>
                <option value="answered">Answered (Terjawab)</option>
                <option value="inconclusive">Inconclusive (Belum Pasti)</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-border dark:divide-border/60">
            {questions
              .filter((q) => {
                if (statusFilter !== "all" && q.status !== statusFilter) return false;
                if (searchQuery.trim()) {
                  const s = searchQuery.toLowerCase();
                  return (
                    q.question.toLowerCase().includes(s) ||
                    (q.context || "").toLowerCase().includes(s)
                  );
                }
                return true;
              })
              .map((q) => {
                const isSelected = q.id === selectedQuestionId;
                const hasConc = conclusions.some((c) => c.researchQuestionId === q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`w-full text-left p-3.5 transition-colors ${
                      isSelected
                        ? "bg-indigo-50/70 dark:bg-indigo-950/30 border-l-3 border-indigo-600"
                        : "hover:bg-muted/40 dark:hover:bg-card/50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          q.status === "answered"
                            ? "bg-emerald-100 text-emerald-800"
                            : q.status === "in_progress"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        {q.status}
                      </span>
                      {hasConc && (
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                          <CheckCircle2 className="size-3" /> Concluded
                        </span>
                      )}
                    </div>
                    <h3 className="text-xs font-bold text-foreground dark:text-foreground line-clamp-2">
                      {q.question}
                    </h3>
                    {q.context && (
                      <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{q.context}</p>
                    )}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Right Panel: Investigation Workspace */}
        <div className="flex-1 bg-muted/40 dark:bg-background overflow-y-auto flex flex-col">
          {selectedQuestion ? (
            <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
              {/* Question Header Banner */}
              <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      selectedQuestion.status === "answered"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    Status: {selectedQuestion.status}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {qConclusion && (
                      <button
                        onClick={handlePromote}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="size-3.5" />
                        Promote to Knowledge Base (#14)
                      </button>
                    )}
                    <button
                      onClick={() => deleteQuestion(selectedQuestion.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-600"
                      title="Hapus Riset"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h2 className="text-base sm:text-lg font-bold text-foreground dark:text-foreground">
                    {selectedQuestion.question}
                  </h2>
                  {selectedQuestion.context && (
                    <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-1 leading-relaxed">
                      {selectedQuestion.context}
                    </p>
                  )}
                </div>

                {/* Sub-questions breakdown (§8) */}
                {subQuestions.length > 0 && (
                  <div className="pt-3 border-t border-border dark:border-border">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Split className="size-3" /> Sub-pertanyaan Turunan ({subQuestions.length})
                    </div>
                    <div className="space-y-1">
                      {subQuestions.map((sq) => (
                        <div
                          key={sq.id}
                          onClick={() => setSelectedQuestionId(sq.id)}
                          className="text-xs p-2 rounded-lg bg-muted/40 dark:bg-card hover:bg-muted cursor-pointer flex items-center justify-between"
                        >
                          <span className="font-medium text-foreground dark:text-foreground">
                            {sq.question}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{sq.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Grid 2 Columns: Sources & Evidences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sources List (§4) */}
                <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
                      <BookOpen className="size-4 text-blue-500" />
                      Sumber Investigasi ({qSources.length})
                    </h3>
                    <button
                      onClick={() => setIsNewSourceModalOpen(true)}
                      className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="size-3" /> Tambah
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {qSources.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">
                        Belum ada sumber rujukan yang dianalisis.
                      </p>
                    ) : (
                      qSources.map((src) => (
                        <div
                          key={src.id}
                          className="p-3 rounded-xl border border-border dark:border-border bg-muted/40/50 dark:bg-card/40 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                src.credibility === "high"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {src.credibility} credibility
                            </span>
                            <button
                              onClick={() => deleteSource(src.id)}
                              className="text-muted-foreground hover:text-rose-600"
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                          <div className="font-semibold text-foreground dark:text-foreground">
                            {src.title}
                          </div>
                          {src.author && (
                            <div className="text-[10px] text-muted-foreground">Penulis: {src.author}</div>
                          )}
                          {src.url && (
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="size-2.5" /> Buka Tautan Sumber
                            </a>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Evidence List (§5 Fakta & Pernyataan Kunci) */}
                <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-5 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-4 text-emerald-500" />
                      Evidence & Bukti Fakta ({qEvidences.length})
                    </h3>
                    <button
                      onClick={() => setIsNewEvidenceModalOpen(true)}
                      className="text-xs text-emerald-600 font-semibold hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="size-3" /> Ekstrak Evidence
                    </button>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {qEvidences.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">
                        Belum ada evidence yang diekstrak dari sumber.
                      </p>
                    ) : (
                      qEvidences.map((ev) => {
                        const src = sources.find((s) => s.id === ev.sourceId);
                        return (
                          <div
                            key={ev.id}
                            className="p-3 rounded-xl border border-border dark:border-border bg-muted/40/50 dark:bg-card/40 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                  ev.supportType === "supports"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : ev.supportType === "contradicts"
                                    ? "bg-rose-100 text-rose-800"
                                    : "bg-muted text-foreground"
                                }`}
                              >
                                {ev.supportType} ({ev.strength})
                              </span>
                              <button
                                onClick={() => deleteEvidence(ev.id)}
                                className="text-muted-foreground hover:text-rose-600"
                              >
                                <Trash2 className="size-3" />
                              </button>
                            </div>
                            <p className="text-foreground dark:text-foreground font-medium">
                              &ldquo;{ev.statement}&rdquo;
                            </p>
                            <div className="text-[10px] text-muted-foreground">
                              Sumber: {src?.title || "Unknown Source"}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Analysis Narrative (§6 Ruang Penalaran) */}
              <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
                    <FileText className="size-4 text-purple-500" />
                    Penalaran & Analisis Naratif (§6)
                  </h3>
                  <button
                    onClick={() => saveAnalysis(selectedQuestionId, analysisText)}
                    className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100"
                  >
                    Simpan Analisis
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  placeholder="Tulis sintesis penimbangan antar evidence: mis. Evidence A mendukung, namun Evidence B mengindikasikan batas throughput..."
                  className="w-full text-xs p-3 rounded-xl border border-border dark:border-border bg-muted/40 dark:bg-card leading-relaxed outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              {/* Conclusion & Traceability (§7) */}
              <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-foreground dark:text-foreground flex items-center gap-1.5">
                    <TrendingUp className="size-4 text-emerald-500" />
                    Kesimpulan Akhir & Traceability Bukti (§7)
                  </h3>
                  <button
                    onClick={() => {
                      if (qEvidences.length === 0) {
                        alert(
                          "Harap ekstrak minimal 1 Evidence terlebih dahulu sebelum menarik kesimpulan!"
                        );
                        return;
                      }
                      setConcStatement(qConclusion?.statement || "");
                      setConcConfidence(qConclusion?.confidence || "high");
                      setConcEvidenceIds(
                        qConclusion?.basedOnEvidenceIds || qEvidences.map((e) => e.id)
                      );
                      setIsConclusionModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                  >
                    {qConclusion ? "Revisi Kesimpulan" : "Tarik Kesimpulan Riset"}
                  </button>
                </div>

                {qConclusion ? (
                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                        Keyakinan: {qConclusion.confidence} confidence
                      </span>
                      <span className="text-[10px] text-emerald-600">
                        {new Date(qConclusion.concludedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-foreground dark:text-foreground font-semibold leading-relaxed">
                      {qConclusion.statement}
                    </p>

                    <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">
                        Evidence Terhubung (Traceability):
                      </span>
                      <div className="mt-1 space-y-1">
                        {qConclusion.basedOnEvidenceIds.map((eid) => {
                          const ev = evidences.find((e) => e.id === eid);
                          return (
                            <div
                              key={eid}
                              className="text-[11px] text-muted-foreground dark:text-foreground flex items-center gap-1.5"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {ev?.statement || "Evidence terverifikasi"}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                    Belum ada kesimpulan ditarik untuk pertanyaan ini.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-xs">
              Pilih pertanyaan riset dari daftar sebelah kiri.
            </div>
          )}
        </div>
      </div>

      {/* Modal: New Question */}
      {isNewQuestionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground dark:text-foreground flex items-center gap-2">
              <Compass className="size-4 text-indigo-500" />
              Pertanyaan Riset Baru (§3)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Pertanyaan Utama (Spesifik) *</label>
                <input
                  type="text"
                  value={newQTitle}
                  onChange={(e) => setNewQTitle(e.target.value)}
                  placeholder="Mis. Apakah model A lebih hemat daripada model B?"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Latar Belakang / Konteks</label>
                <textarea
                  rows={2}
                  value={newQContext}
                  onChange={(e) => setNewQContext(e.target.value)}
                  placeholder="Mengapa pertanyaan ini krusial untuk dipelajari..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">
                  Sebagai Sub-Pertanyaan dari (Opsional)
                </label>
                <select
                  value={newQParentId}
                  onChange={(e) => setNewQParentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                >
                  <option value="">(Sebagai Riset Utama)</option>
                  {questions
                    .filter((q) => !q.parentQuestionId)
                    .map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.question}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Tags (Koma)</label>
                <input
                  type="text"
                  value={newQTags}
                  onChange={(e) => setNewQTags(e.target.value)}
                  placeholder="Strategi, Biaya, Regulasi"
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewQuestionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleCreateQuestion}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
              >
                Mulai Riset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Source */}
      {isNewSourceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <BookOpen className="size-4 text-blue-500" />
              Tambah Sumber Bahan Riset (§4)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Judul Sumber *</label>
                <input
                  type="text"
                  value={newSrcTitle}
                  onChange={(e) => setNewSrcTitle(e.target.value)}
                  placeholder="Judul paper, artikel, atau buku..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Penulis</label>
                  <input
                    type="text"
                    value={newSrcAuthor}
                    onChange={(e) => setNewSrcAuthor(e.target.value)}
                    placeholder="Nama institusi / peneliti"
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kredibilitas</label>
                  <select
                    value={newSrcCred}
                    onChange={(e) => setNewSrcCred(e.target.value as CredibilityLevel)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    <option value="high">High (Academic/Resmi)</option>
                    <option value="medium">Medium (Blog Industri)</option>
                    <option value="low">Low (Opini)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">URL / Tautan Web</label>
                <input
                  type="url"
                  value={newSrcUrl}
                  onChange={(e) => setNewSrcUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewSourceModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleCreateSource}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold"
              >
                Tambahkan Sumber
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Evidence */}
      {isNewEvidenceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-500" />
              Ekstrak Evidence / Fakta Kunci (§5)
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Pilih Sumber Rujukan *</label>
                <select
                  value={newEvSourceId}
                  onChange={(e) => setNewEvSourceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                >
                  <option value="">-- Pilih Sumber --</option>
                  {qSources.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Pernyataan Fakta / Klaim Kunci *</label>
                <textarea
                  rows={2}
                  value={newEvStatement}
                  onChange={(e) => setNewEvStatement(e.target.value)}
                  placeholder="Potongan temuan spesifik dari sumber ini..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Tipe Dukungan</label>
                  <select
                    value={newEvSupportType}
                    onChange={(e) => setNewEvSupportType(e.target.value as SupportType)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    <option value="supports">Supports (Mendukung hipotesis)</option>
                    <option value="contradicts">Contradicts (Menentang)</option>
                    <option value="neutral">Neutral</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Kekuatan Bukti</label>
                  <select
                    value={newEvStrength}
                    onChange={(e) => setNewEvStrength(e.target.value as EvidenceStrength)}
                    className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                  >
                    <option value="strong">Strong (Kuat)</option>
                    <option value="moderate">Moderate</option>
                    <option value="weak">Weak (Lemah)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsNewEvidenceModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleCreateEvidence}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                Simpan Evidence
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Draft Conclusion */}
      {isConclusionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-lg p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <TrendingUp className="size-4 text-emerald-500" />
              Tarik Kesimpulan Riset & Traceability (§7)
            </h3>
            <p className="text-xs text-muted-foreground">
              Setiap kesimpulan WAJIB didasari minimal 1 Evidence terverifikasi agar dapat
              dipertanggungjawabkan secara saintifik.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Pernyataan Jawaban Riset *</label>
                <textarea
                  rows={3}
                  value={concStatement}
                  onChange={(e) => setConcStatement(e.target.value)}
                  placeholder="Jawaban komprehensif atas pertanyaan riset..."
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Level Keyakinan (Confidence)</label>
                <select
                  value={concConfidence}
                  onChange={(e) => setConcConfidence(e.target.value as ConfidenceLevel)}
                  className="w-full px-3 py-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card"
                >
                  <option value="high">High (Bukti Konvergen & Kuat)</option>
                  <option value="medium">Medium (Sebagian Bukti Campuran)</option>
                  <option value="low">Low (Awal / Perlu Riset Lanjutan)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Evidence Pendukung Wajib (Traceability) *
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2 rounded-lg border border-border dark:border-border bg-muted/40 dark:bg-card">
                  {qEvidences.map((ev) => {
                    const isChecked = concEvidenceIds.includes(ev.id);
                    return (
                      <label
                        key={ev.id}
                        className="flex items-center gap-2 p-1 rounded hover:bg-muted dark:hover:bg-card cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConcEvidenceIds([...concEvidenceIds, ev.id]);
                            } else {
                              setConcEvidenceIds(concEvidenceIds.filter((id) => id !== ev.id));
                            }
                          }}
                          className="rounded text-emerald-600"
                        />
                        <span className="truncate">{ev.statement}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsConclusionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-border text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleSaveConclusion}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
              >
                Simpan Kesimpulan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Statistics (§11) */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card dark:bg-background border border-border dark:border-border rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="size-4 text-indigo-500" />
                Statistik & Metrik Riset (§11)
              </h3>
              <button onClick={() => setIsStatsModalOpen(false)}>
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-xl bg-muted/40 dark:bg-card border border-border dark:border-border">
                <div className="text-2xl font-bold text-foreground dark:text-foreground">
                  {stats.total}
                </div>
                <div className="text-[10px] uppercase text-muted-foreground font-semibold mt-1">
                  Total Pertanyaan
                </div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
                <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {stats.answeredRatio}
                </div>
                <div className="text-[10px] uppercase text-emerald-600 font-semibold mt-1">
                  Rasio Terjawab
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Rata-rata Sumber per Pertanyaan:</span>
                <span className="font-bold">{stats.avgSources} Sumber</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border dark:border-border">
                <span className="text-muted-foreground">Rata-rata Evidence per Kesimpulan:</span>
                <span className="font-bold">{stats.avgEvidence} Evidence</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Status In Progress:</span>
                <span className="font-bold">{stats.inProgress} Riset Aktif</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-foreground text-background text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
