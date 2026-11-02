import { ShellHeader } from "@/app/shell-header";
import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Plus,
  Search,
  ShieldAlert,
  Layers,
  BarChart2,
  Copy,
  Trash2,
  Eye,
  Lock,
  UserCheck,
  Check,
  X,
  GitBranch,
} from "lucide-react";
import { useApprovalStore } from "./store";
import {
  ApprovalStep,
  ApprovalViewMode,
  DecisionType,
} from "./types";

export function ApprovalManagerApp() {
  const {
    flows,
    requests,
    delegates,
    selectedRequestId,
    submitDecision,
    createRequest,
    deleteFlow,
    duplicateFlow,
    addDelegate,
    deleteDelegate,
    setSelectedRequestId,
  } = useApprovalStore();

  const [activeTab, setActiveTab] = useState<ApprovalViewMode>("my_pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Decision Modal
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);
  const [targetReqId, setTargetReqId] = useState<string | null>(null);
  const [chosenDecision, setChosenDecision] = useState<DecisionType>("approved");
  const [decisionComment, setDecisionComment] = useState("");

  // New Request Modal
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [reqTitle, setReqTitle] = useState("");
  const [reqFlowId, setReqFlowId] = useState(flows[0]?.id || "");
  const [reqEntityType, setReqEntityType] = useState("deliverable_submission");
  const [reqEntityId, setReqEntityId] = useState("");
  const [reqSummary, setReqSummary] = useState("");
  const [reqRequester, setReqRequester] = useState("Anda (Requester)");

  // New Delegate Modal
  const [isNewDelegateOpen, setIsNewDelegateOpen] = useState(false);
  const [delFrom, setDelFrom] = useState("Anda (Approver)");
  const [delTo, setDelTo] = useState("");
  const [delStartDate, setDelStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [delEndDate, setDelEndDate] = useState("");
  const [delReason, setDelReason] = useState("");

  // Flow Builder Modal
  const [isFlowDesignerOpen, setIsFlowDesignerOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flowDesc, setFlowDesc] = useState("");
  const [flowSteps, setFlowSteps] = useState<Omit<ApprovalStep, "id" | "approvalFlowId">[]>([
    {
      order: 1,
      name: "Review Manager",
      mode: "sequential_after_previous",
      approverType: "specific_user",
      approverRefs: ["Engineering Manager"],
      minApprovalsRequired: 1,
      slaHours: 24,
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenDecisionModal = (reqId: string, decision: DecisionType) => {
    setTargetReqId(reqId);
    setChosenDecision(decision);
    setDecisionComment("");
    setDecisionModalOpen(true);
  };

  const handleExecuteDecision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetReqId) return;

    const res = submitDecision(targetReqId, chosenDecision, decisionComment);
    showToast(res.message);
    setDecisionModalOpen(false);
    setTargetReqId(null);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqFlowId) return;

    createRequest({
      flowId: reqFlowId,
      title: reqTitle.trim(),
      entityType: reqEntityType,
      entityId: reqEntityId.trim() || `ent-${Date.now()}`,
      entitySummary: reqSummary.trim(),
      requestedBy: reqRequester.trim(),
    });

    showToast(`Approval Request "${reqTitle}" berhasil diajukan.`);
    setIsNewRequestOpen(false);
    setReqTitle("");
    setReqSummary("");
  };


  // Filtered Requests
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      if (activeTab === "my_pending" && r.status !== "pending") return false;
      if (activeTab === "escalated") {
        // SLA breach simulated: pending requests created > 24 hours ago
        const isPastSla = Date.now() - new Date(r.createdAt).getTime() > 24 * 3600 * 1000;
        if (r.status !== "pending" || !isPastSla) return false;
      }
      if (statusFilter !== "all" && r.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchRequester = r.requestedBy.toLowerCase().includes(q);
        const matchSummary = (r.entitySummary || "").toLowerCase().includes(q);
        const matchFlow = r.flowName.toLowerCase().includes(q);
        if (!matchTitle && !matchRequester && !matchSummary && !matchFlow) return false;
      }

      return true;
    });
  }, [requests, activeTab, statusFilter, searchQuery]);

  // Selected Request Detail
  const activeDetailRequest = useMemo(() => {
    if (!selectedRequestId) return null;
    return requests.find((r) => r.id === selectedRequestId) || null;
  }, [requests, selectedRequestId]);

  const activeDetailFlow = useMemo(() => {
    if (!activeDetailRequest) return null;
    return flows.find((f) => f.id === activeDetailRequest.approvalFlowId) || null;
  }, [flows, activeDetailRequest]);

  // Statistics
  const stats = useMemo(() => {
    const total = requests.length;
    const approved = requests.filter((r) => r.status === "approved").length;
    const rejected = requests.filter((r) => r.status === "rejected").length;
    const pending = requests.filter((r) => r.status === "pending").length;
    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : "0";
    const slaBreaches = requests.filter(
      (r) => r.status === "pending" && Date.now() - new Date(r.createdAt).getTime() > 24 * 3600 * 1000
    ).length;

    return { total, approved, rejected, pending, approvalRate, slaBreaches };
  }, [requests]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-4 md:p-6 lg:p-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl border border-indigo-400 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Actions Portaled to Main Header */}
      <ShellHeader>
        <div className="flex items-center gap-1 shrink-0">
          {/* Tab Switchers (Icon-Only) */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            <button
              onClick={() => {
                setActiveTab("my_pending");
                setSelectedRequestId(null);
              }}
              title={`My Pending (${stats.pending})`}
              aria-label="My Pending"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "my_pending"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </button>
            <button
              onClick={() => {
                setActiveTab("all_requests");
                setSelectedRequestId(null);
              }}
              title={`Semua Permintaan (${requests.length})`}
              aria-label="Semua Permintaan"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "all_requests"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setActiveTab("flow_designer");
                setSelectedRequestId(null);
              }}
              title={`Template Flow (${flows.length})`}
              aria-label="Template Flow"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "flow_designer"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GitBranch className="w-3.5 h-3.5 text-purple-400" />
            </button>
            <button
              onClick={() => {
                setActiveTab("escalated");
                setSelectedRequestId(null);
              }}
              title={`Escalated SLA (${stats.slaBreaches})`}
              aria-label="Escalated SLA"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "escalated"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            </button>
            <button
              onClick={() => {
                setActiveTab("delegates");
                setSelectedRequestId(null);
              }}
              title={`Delegates (${delegates.length})`}
              aria-label="Delegates"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "delegates"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-400" />
            </button>
            <button
              onClick={() => {
                setActiveTab("stats");
                setSelectedRequestId(null);
              }}
              title="Statistik & Analisis"
              aria-label="Statistik"
              className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                activeTab === "stats"
                  ? "bg-background text-foreground font-semibold shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          <button
            onClick={() => setIsNewDelegateOpen(true)}
            title="Delegasi Cuti"
            aria-label="Delegasi Cuti"
            className="p-1.5 bg-card hover:bg-accent text-foreground border border-border rounded-lg text-xs font-medium transition cursor-pointer shrink-0 flex items-center justify-center"
          >
            <UserCheck className="w-3.5 h-3.5 text-sky-400" />
          </button>

          <button
            onClick={() => setIsNewRequestOpen(true)}
            title="Ajukan Approval Baru"
            aria-label="Ajukan Approval"
            className="p-1.5 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Main Container */}
      <div className="flex-1 mt-4">
        {/* STATS VIEW */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Total Permintaan</div>
                <div className="text-3xl font-extrabold text-white mt-1">{stats.total}</div>
                <div className="text-xs text-muted-foreground mt-1">Lintas seluruh flow</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Approval Rate</div>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">{stats.approvalRate}%</div>
                <div className="text-xs text-muted-foreground mt-1">{stats.approved} permintaan disetujui</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">SLA Breached</div>
                <div className="text-3xl font-extrabold text-rose-400 mt-1">{stats.slaBreaches}</div>
                <div className="text-xs text-muted-foreground mt-1">Melebihi batas jam respon</div>
              </div>
              <div className="p-5 bg-card/80 border border-border rounded-xl">
                <div className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Avg Lead Time</div>
                <div className="text-3xl font-extrabold text-sky-400 mt-1">18.5 jam</div>
                <div className="text-xs text-muted-foreground mt-1">Waktu rata-rata keputusan</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-card/60 border border-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  Requests by Approval Flow
                </h3>
                <div className="space-y-2">
                  {flows.map((f) => {
                    const count = requests.filter((r) => r.approvalFlowId === f.id).length;
                    return (
                      <div key={f.id} className="flex items-center justify-between text-sm py-1 border-b border-border/40">
                        <span className="text-foreground">{f.name}</span>
                        <span className="px-2 py-0.5 bg-card text-foreground rounded text-xs font-medium">{count} request</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-5 bg-card/60 border border-border rounded-xl">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-sky-400" />
                  Delegasi Aktif
                </h3>
                <div className="space-y-2">
                  {delegates.map((d) => (
                    <div key={d.id} className="p-2.5 rounded bg-card/70 border border-border text-xs">
                      <div className="font-semibold text-foreground">{d.fromUserName} → {d.toUserName}</div>
                      <div className="text-muted-foreground mt-0.5">{d.reason} ({d.startDate} s/d {d.endDate})</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FLOW DESIGNER TAB */}
        {activeTab === "flow_designer" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Template Alur Persetujuan (Approval Flow)</h2>
                <p className="text-xs text-muted-foreground">
                  Definisi alur bertingkat reusable untuk entitas Deliverables (#20), Dokumen (#13), Expense, dan Kontrak.
                </p>
              </div>
              <button
                onClick={() => setIsFlowDesignerOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Buat Flow Baru
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flows.map((f) => (
                <div key={f.id} className="p-5 bg-card/80 border border-border rounded-xl space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-base text-white">{f.name}</h3>
                      {f.description && <p className="text-xs text-muted-foreground mt-1">{f.description}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => duplicateFlow(f.id)}
                        className="p-1.5 text-muted-foreground hover:text-sky-400 rounded"
                        title="Duplikasi Flow"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteFlow(f.id)}
                        className="p-1.5 text-muted-foreground hover:text-rose-400 rounded"
                        title="Hapus Flow"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Steps List */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Tahapan ({f.steps.length} Steps)
                    </div>
                    {f.steps.map((st, i) => (
                      <div key={st.id} className="flex items-center gap-2 text-xs p-2 bg-background/60 border border-border rounded-lg">
                        <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          {i + 1}
                        </span>
                        <div className="flex-1 truncate">
                          <span className="font-semibold text-foreground">{st.name}</span>
                          <span className="text-muted-foreground ml-1 text-[11px]">({st.approverRefs.join(", ")})</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-card text-muted-foreground shrink-0">
                          SLA {st.slaHours}j
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DELEGATES VIEW */}
        {activeTab === "delegates" && (
          <div className="max-w-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Pengalihan Wewenang (Delegation)</h2>
                <p className="text-xs text-muted-foreground">
                  Saat pejabat berwenang cuti atau dinas luar, permintaan persetujuan otomatis diarahkan ke penerima delegasi.
                </p>
              </div>
              <button
                onClick={() => setIsNewDelegateOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Delegasi
              </button>
            </div>

            <div className="space-y-3">
              {delegates.map((del) => (
                <div key={del.id} className="p-4 bg-card/80 border border-border rounded-xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-semibold text-sm text-foreground">
                      <span>{del.fromUserName}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-teal-400">{del.toUserName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Alasan: {del.reason} • Periode: {del.startDate} s/d {del.endDate}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      deleteDelegate(del.id);
                      showToast("Delegasi dinonaktifkan.");
                    }}
                    className="p-1.5 text-muted-foreground hover:text-rose-400 rounded"
                    title="Batalkan Delegasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MY PENDING / ALL REQUESTS / ESCALATED */}
        {(activeTab === "my_pending" || activeTab === "all_requests" || activeTab === "escalated") && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-card/80 border border-border rounded-xl">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari permohonan, pemohon, flow..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-lg text-xs md:text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-background border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* List */}
            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center bg-card/40 border border-border/60 rounded-xl">
                <CheckCircle2 className="w-10 h-10 text-emerald-500/50 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-foreground">Tidak ada permohonan pending</h3>
                <p className="text-xs text-muted-foreground mt-1">Seluruh approval telah diproses atau filter tidak cocok.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((req) => {
                  const flow = flows.find((f) => f.id === req.approvalFlowId);

                  return (
                    <div
                      key={req.id}
                      className="p-5 bg-card/80 border border-border hover:border-border rounded-xl transition duration-150 space-y-4"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-base text-foreground">{req.title}</span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                req.status === "approved"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : req.status === "rejected"
                                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                  : req.status === "cancelled"
                                  ? "bg-card text-muted-foreground"
                                  : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              }`}
                            >
                              {req.status.toUpperCase()}
                            </span>
                            <span className="text-xs text-muted-foreground bg-background/60 px-2 py-0.5 rounded">
                              {req.flowName}
                            </span>
                          </div>

                          {req.entitySummary && (
                            <p className="text-xs text-foreground leading-relaxed">{req.entitySummary}</p>
                          )}

                          <div className="text-[11px] text-muted-foreground flex items-center gap-3 pt-1">
                            <span>Diajukan oleh: <strong className="text-foreground">{req.requestedBy}</strong></span>
                            <span>•</span>
                            <span>{new Date(req.createdAt).toLocaleDateString()} {new Date(req.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                          </div>
                        </div>

                        {/* Action buttons if Pending */}
                        {req.status === "pending" && (
                          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                            <button
                              onClick={() => handleOpenDecisionModal(req.id, "approved")}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Setujui (Approve)
                            </button>

                            <button
                              onClick={() => handleOpenDecisionModal(req.id, "rejected")}
                              className="px-3.5 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                            >
                              <X className="w-3.5 h-3.5" />
                              Tolak (Reject)
                            </button>

                            <button
                              onClick={() => setSelectedRequestId(req.id)}
                              className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-card rounded"
                              title="Lihat Detail Stepper"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Stepper Visualization */}
                      {flow && (
                        <div className="pt-3 border-t border-border/60">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {flow.steps.map((st) => {
                              const isCompleted = req.decisions.some(
                                (d) => d.stepOrder === st.order && d.decision === "approved"
                              );
                              const isCurrent = req.status === "pending" && req.currentStepOrder === st.order;
                              const isRejectedHere = req.decisions.some(
                                (d) => d.stepOrder === st.order && d.decision === "rejected"
                              );

                              return (
                                <div
                                  key={st.id}
                                  className={`p-3 rounded-xl border flex items-center gap-3 text-xs ${
                                    isRejectedHere
                                      ? "bg-rose-950/20 border-rose-500/40 text-rose-300"
                                      : isCompleted
                                      ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-300"
                                      : isCurrent
                                      ? "bg-amber-950/20 border-amber-500/40 text-amber-300"
                                      : "bg-background/40 border-border text-muted-foreground"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                  ) : isRejectedHere ? (
                                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                                  ) : isCurrent ? (
                                    <Clock className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                                  ) : (
                                    <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                                  )}

                                  <div className="truncate flex-1">
                                    <div className="font-semibold truncate">
                                      Step {st.order}: {st.name}
                                    </div>
                                    <div className="text-[10px] opacity-80 truncate">
                                      {isCompleted
                                        ? "Disetujui"
                                        : isCurrent
                                        ? "Menunggu Keputusan"
                                        : "Terkunci (Menunggu Step Sebelumnya)"}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: DECISION (APPROVE / REJECT) */}
      {decisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">
                {chosenDecision === "approved" ? "Konfirmasi Persetujuan (Approve)" : "Tolak Permohonan (Reject)"}
              </h3>
              <button
                onClick={() => setDecisionModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteDecision} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Catatan / Komentar Keputusan
                </label>
                <textarea
                  rows={3}
                  required={chosenDecision === "rejected"}
                  placeholder={
                    chosenDecision === "rejected"
                      ? "Wajib tulis alasan penolakan atau instruksi revisi..."
                      : "Catatan persetujuan (opsional)..."
                  }
                  value={decisionComment}
                  onChange={(e) => setDecisionComment(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setDecisionModalOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-1.5 text-white rounded-lg text-xs font-bold ${
                    chosenDecision === "approved"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-rose-600 hover:bg-rose-500"
                  }`}
                >
                  Kirim Keputusan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJUKAN APPROVAL BARU */}
      {isNewRequestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Ajukan Permintaan Approval Baru</h3>
              <button
                onClick={() => setIsNewRequestOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Pilih Template Alur (Flow)
                </label>
                <select
                  value={reqFlowId}
                  onChange={(e) => setReqFlowId(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                >
                  {flows.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.steps.length} Tahapan)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Judul Permohonan <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="mis. Persetujuan Pembelian Server Backup"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tipe Entitas
                  </label>
                  <select
                    value={reqEntityType}
                    onChange={(e) => setReqEntityType(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                  >
                    <option value="deliverable_submission">Deliverable Submission (#20)</option>
                    <option value="document">Dokumen Formal (#13)</option>
                    <option value="expense">Pengeluaran & Anggaran</option>
                    <option value="contract">Kontrak Klien / Vendor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Entity ID
                  </label>
                  <input
                    type="text"
                    placeholder="mis. deliv-99"
                    value={reqEntityId}
                    onChange={(e) => setReqEntityId(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Ringkasan / Konteks Keputusan
                </label>
                <textarea
                  rows={2}
                  placeholder="Jelaskan dasar permohonan dan urgensi kebutuhan..."
                  value={reqSummary}
                  onChange={(e) => setReqSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewRequestOpen(false)}
                  className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold"
                >
                  Ajukan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DETAIL STEPPER VIEW */}
      {selectedRequestId && activeDetailRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h3 className="font-bold text-base text-white">{activeDetailRequest.title}</h3>
                <p className="text-xs text-muted-foreground">Detail Tahapan & Jejak Audit Keputusan</p>
              </div>
              <button
                onClick={() => setSelectedRequestId(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Details */}
            <div className="space-y-3">
              {activeDetailFlow?.steps.map((st) => {
                const decision = activeDetailRequest.decisions.find((d) => d.stepOrder === st.order);
                return (
                  <div key={st.id} className="p-3 bg-card/80 border border-border rounded-xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-foreground">
                        Step {st.order}: {st.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          decision?.decision === "approved"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : decision?.decision === "rejected"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-card text-muted-foreground"
                        }`}
                      >
                        {decision ? decision.decision.toUpperCase() : "MENUNGGU"}
                      </span>
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                      Approver: {st.approverRefs.join(", ")} • SLA: {st.slaHours} jam
                    </div>

                    {decision && (
                      <div className="p-2 bg-background/60 rounded border border-border text-xs">
                        <div className="font-semibold text-foreground">{decision.approverName}</div>
                        <div className="text-muted-foreground italic mt-0.5">"{decision.comments}"</div>
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {new Date(decision.decidedAt).toLocaleString()}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-border">
              <button
                onClick={() => setSelectedRequestId(null)}
                className="px-4 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DELEGASI BARU */}
      {isNewDelegateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-white">Delegasi Wewenang</h3>
              <button
                onClick={() => setIsNewDelegateOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Pemberi Wewenang
                </label>
                <input
                  type="text"
                  value={delFrom}
                  onChange={(e) => setDelFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Penerima Delegasi <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="mis. Hendro Wicaksono (COO)"
                  value={delTo}
                  onChange={(e) => setDelTo(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={delStartDate}
                    onChange={(e) => setDelStartDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-card border border-border rounded text-xs text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={delEndDate}
                    onChange={(e) => setDelEndDate(e.target.value)}
                    className="w-full px-2 py-1.5 bg-card border border-border rounded text-xs text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Alasan
                </label>
                <input
                  type="text"
                  placeholder="mis. Cuti tahunan"
                  value={delReason}
                  onChange={(e) => setDelReason(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsNewDelegateOpen(false)}
                className="px-3.5 py-1.5 bg-card hover:bg-card text-foreground rounded-lg text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  if (delTo.trim()) {
                    addDelegate({
                      fromUserId: "user-current",
                      fromUserName: delFrom,
                      toUserId: `user-${Date.now()}`,
                      toUserName: delTo.trim(),
                      approvalFlowId: null,
                      startDate: delStartDate,
                      endDate: delEndDate || delStartDate,
                      reason: delReason || "Cuti / Keperluan pribadi",
                    });
                    showToast("Delegasi berhasil disimpan.");
                    setIsNewDelegateOpen(false);
                    setDelTo("");
                  }
                }}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold"
              >
                Simpan Delegasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
