import React, { useState, useMemo } from "react";
import {
  PackageCheck,
  CheckCircle2,
  Plus,
  Search,
  Layers,
  FileCheck,
  UploadCloud,
  CheckSquare,
  Square,
  BarChart3,
  Trash2,
} from "lucide-react";
import { useDeliverableStore } from "./store";
import { DeliverableStatus, ApprovalDecision } from "./types";
import { useShellSections } from "@/app/shell-sections";

type ViewTab = "board" | "detail" | "requirements" | "submissions" | "approvals" | "by_project" | "stats";

const STATUS_COLUMNS: { key: DeliverableStatus; label: string; color: string }[] = [
  { key: "not_started", label: "Not Started", color: "bg-muted-foreground/30/20 text-muted-foreground border-border/30" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { key: "submitted", label: "Submitted", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  { key: "in_review", label: "In Review", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  { key: "needs_revision", label: "Needs Revision", color: "bg-rose-500/20 text-rose-400 border-rose-500/30" },
  { key: "approved", label: "Approved", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  { key: "delivered", label: "Delivered", color: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
];

export function DeliverableManagerApp() {
  const {
    deliverables,
    selectedDeliverableId,
    setSelectedDeliverableId,
    createDeliverable,
    updateDeliverable,
    addRequirement,
    toggleRequirementStatus,
    deleteRequirement,
    createSubmission,
    recordApproval,
    markDelivered,
  } = useDeliverableStore();

  const [activeTab, setActiveTab] = useState<ViewTab>("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState<string>("all");

  // Modals & form states
  const [isNewDeliverableOpen, setIsNewDeliverableOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newProjectName, setNewProjectName] = useState("Enterprise Client Portal Revamp");
  const [newDueAt, setNewDueAt] = useState("2026-09-30");

  // New Requirement
  const [newReqDesc, setNewReqDesc] = useState("");
  const [newReqMandatory, setNewReqMandatory] = useState(true);

  // New Submission
  const [newSubFileName, setNewSubFileName] = useState("");
  const [newSubFileSize, setNewSubFileSize] = useState("4.5 MB");
  const [newSubNote, setNewSubNote] = useState("");

  // Approval Decision input
  const [approvalDecision, setApprovalDecision] = useState<ApprovalDecision>("approved");
  const [approvalComment, setApprovalComment] = useState("");

  // Active deliverable
  const currentDeliverable = useMemo(() => {
    return deliverables.find((d) => d.id === selectedDeliverableId) || deliverables[0] || null;
  }, [deliverables, selectedDeliverableId]);

  // Filtered deliverables
  const filteredDeliverables = useMemo(() => {
    return deliverables.filter((d) => {
      const matchSearch =
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.projectName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchProject = projectFilter === "all" || d.projectName === projectFilter;
      return matchSearch && matchProject;
    });
  }, [deliverables, searchQuery, projectFilter]);

  // Statistics per specification
  const stats = useMemo(() => {
    const total = deliverables.length;
    const delivered = deliverables.filter((d) => d.status === "delivered").length;
    const approved = deliverables.filter((d) => d.status === "approved").length;
    const inReview = deliverables.filter((d) => d.status === "in_review" || d.status === "submitted").length;

    // Overdue check
    const today = "2026-09-24";
    const overdue = deliverables.filter((d) => d.status !== "delivered" && d.dueAt && d.dueAt < today).length;

    // Requirement Compliance Rate = COUNT(Requirement.status = 'met') / COUNT(Requirement.isMandatory = true)
    const allRequirements = deliverables.flatMap((d) => d.requirements);
    const mandatoryReqs = allRequirements.filter((r) => r.isMandatory);
    const metMandatoryReqs = mandatoryReqs.filter((r) => r.status === "met");
    const complianceRate =
      mandatoryReqs.length > 0 ? Math.round((metMandatoryReqs.length / mandatoryReqs.length) * 100) : 100;

    // Average revisions per deliverable
    const totalSubmissions = deliverables.reduce((acc, d) => acc + d.submissions.length, 0);
    const avgRevisions = total > 0 ? (totalSubmissions / total).toFixed(1) : "0";

    return {
      total,
      delivered,
      approved,
      inReview,
      overdue,
      complianceRate,
      avgRevisions,
      totalSubmissions,
    };
  }, [deliverables]);

  useShellSections([
    { id: "board", label: "Deliverable Board", icon: Layers, active: activeTab === "board", onSelect: () => setActiveTab("board") },
    { id: "detail", label: "Specification & DoD", icon: FileCheck, active: activeTab === "detail", onSelect: () => setActiveTab("detail") },
    { id: "submissions", label: `Submissions (${stats.totalSubmissions})`, icon: UploadCloud, active: activeTab === "submissions", onSelect: () => setActiveTab("submissions") },
    { id: "approvals", label: `Pending Approvals (${stats.inReview})`, icon: CheckSquare, active: activeTab === "approvals", onSelect: () => setActiveTab("approvals") },
    { id: "by_project", label: "By Project", icon: PackageCheck, active: activeTab === "by_project", onSelect: () => setActiveTab("by_project") },
    { id: "stats", label: "DoD Analytics", icon: BarChart3, active: activeTab === "stats", onSelect: () => setActiveTab("stats") },
  ]);

  const handleCreateDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createDeliverable({
      title: newTitle,
      description: newDesc,
      projectName: newProjectName,
      dueAt: newDueAt,
      status: "not_started",
      ownerId: "u-self",
      ownerName: "You (Product Lead)",
      requirements: [
        {
          id: `req-${Date.now()}-1`,
          deliverableId: "",
          description: "All mandatory acceptance criteria passed",
          isMandatory: true,
          status: "pending",
        },
      ],
      submissions: [],
      stakeholders: [
        { id: `stk-${Date.now()}`, deliverableId: "", personId: "u-self", name: "You", role: "owner" },
      ],
    });

    setNewTitle("");
    setNewDesc("");
    setIsNewDeliverableOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Top Header */}
      <div className="border-b border-border bg-background/70 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
              #20 Deliverable Manager
            </span>
            <span className="text-xs text-muted-foreground">Definition of Done, Multi-Stage Approvals & Version Submissions</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-3">
            Deliverable Manager
            {currentDeliverable && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                currentDeliverable.status === "delivered"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : currentDeliverable.status === "approved"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
              }`}>
                {currentDeliverable.status.replace("_", " ").toUpperCase()}
              </span>
            )}
          </h1>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-card/80 p-1 rounded-lg border border-border/60 text-sm">
          <button
            onClick={() => setActiveTab("board")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "board" ? "bg-teal-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Deliverable Board
          </button>
          <button
            onClick={() => setActiveTab("detail")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "detail" ? "bg-teal-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Specification & DoD
          </button>
          <button
            onClick={() => setActiveTab("submissions")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "submissions" ? "bg-teal-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Submissions ({stats.totalSubmissions})
          </button>
          <button
            onClick={() => setActiveTab("approvals")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "approvals" ? "bg-teal-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Pending Approvals ({stats.inReview})
          </button>
          <button
            onClick={() => setActiveTab("by_project")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "by_project" ? "bg-teal-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            By Project
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "stats" ? "bg-teal-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            DoD Analytics
          </button>
        </div>

        <button
          onClick={() => setIsNewDeliverableOpen(true)}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Deliverable
        </button>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-auto p-6">
        {/* TAB 1: KANBAN BOARD */}
        {activeTab === "board" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-background p-4 rounded-xl border border-border">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter deliverables by title, requirement, or project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-foreground border border-border rounded-lg px-3 py-1.5 text-xs text-background w-full"
                />
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">Compliance Rate:</span>
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {stats.complianceRate}% DoD Met
                </span>
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 min-h-[500px]">
              {STATUS_COLUMNS.map((col) => {
                const colDeliverables = filteredDeliverables.filter((d) => d.status === col.key);
                return (
                  <div key={col.key} className="bg-background/60 border border-border/80 rounded-xl p-3 flex flex-col">
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                      <span className="text-xs font-bold text-foreground truncate">{col.label}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-card text-muted-foreground">
                        {colDeliverables.length}
                      </span>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {colDeliverables.map((deliv) => {
                        const mandatoryCount = deliv.requirements.filter((r) => r.isMandatory).length;
                        const metCount = deliv.requirements.filter((r) => r.isMandatory && r.status === "met").length;
                        const latestSub = deliv.submissions[deliv.submissions.length - 1];

                        return (
                          <div
                            key={deliv.id}
                            onClick={() => {
                              setSelectedDeliverableId(deliv.id);
                              setActiveTab("detail");
                            }}
                            className="bg-background border border-border hover:border-teal-500/60 p-3.5 rounded-xl cursor-pointer transition shadow-sm space-y-2 group"
                          >
                            <span className="text-[10px] text-teal-400 font-medium block truncate">
                              📁 {deliv.projectName || "General Project"}
                            </span>

                            <h4 className="font-semibold text-xs text-white group-hover:text-teal-300 transition line-clamp-2">
                              {deliv.title}
                            </h4>

                            {/* DoD Checklist Badge */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/80 text-[11px]">
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                                metCount === mandatoryCount
                                  ? "bg-emerald-950/60 text-emerald-400 border-emerald-800"
                                  : "bg-amber-950/60 text-amber-400 border-amber-800"
                              }`}>
                                DoD: {metCount}/{mandatoryCount}
                              </span>
                              {latestSub && (
                                <span className="text-[10px] font-mono text-indigo-400 font-bold">
                                  {latestSub.version}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                              <span>Due: {deliv.dueAt || "No date"}</span>
                              <span>👤 {deliv.ownerName.split(" ")[0]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SPECIFICATION & DEFINITION OF DONE (DETAIL) */}
        {activeTab === "detail" && currentDeliverable && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Deliverable Overview & Requirements */}
            <div className="lg:col-span-7 space-y-6">
              {/* Header Box */}
              <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs text-teal-400 font-medium">Project: {currentDeliverable.projectName}</span>
                    <h2 className="text-xl font-bold text-white mt-1">{currentDeliverable.title}</h2>
                    <p className="text-xs text-foreground mt-2 leading-relaxed">{currentDeliverable.description}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <select
                      value={currentDeliverable.status}
                      onChange={(e) => updateDeliverable(currentDeliverable.id, { status: e.target.value as DeliverableStatus })}
                      className="text-xs bg-foreground border border-border text-background rounded-lg px-2.5 py-1.5 font-semibold"
                    >
                      {STATUS_COLUMNS.map((col) => (
                        <option key={col.key} value={col.key}>{col.label}</option>
                      ))}
                    </select>
                    {currentDeliverable.status === "approved" && (
                      <button
                        onClick={() => markDelivered(currentDeliverable.id)}
                        className="bg-teal-600 hover:bg-teal-500 text-white text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-border text-xs text-muted-foreground">
                  <div>Owner: <strong className="text-white">{currentDeliverable.ownerName}</strong></div>
                  <div>Target Due: <strong className="text-white">{currentDeliverable.dueAt || "Not set"}</strong></div>
                  <div>Submissions: <strong className="text-white">{currentDeliverable.submissions.length} versions</strong></div>
                </div>
              </div>

              {/* Requirements / Definition of Done */}
              <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-teal-400" />
                      Requirements & Definition of Done (DoD)
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Objective acceptance criteria that must be verified before approval.
                    </p>
                  </div>

                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
                    {currentDeliverable.requirements.filter((r) => r.status === "met").length} / {currentDeliverable.requirements.length} Met
                  </span>
                </div>

                {/* Requirements List */}
                <div className="space-y-2">
                  {currentDeliverable.requirements.map((req) => (
                    <div
                      key={req.id}
                      className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-xs transition ${
                        req.status === "met"
                          ? "bg-emerald-950/20 border-emerald-500/30"
                          : "bg-card/40 border-border/60"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => toggleRequirementStatus(currentDeliverable.id, req.id, "Andi Pratama")}
                          className="mt-0.5 text-muted-foreground hover:text-teal-400 transition"
                        >
                          {req.status === "met" ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className={`font-medium ${req.status === "met" ? "text-emerald-300" : "text-white"}`}>
                            {req.description}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            {req.isMandatory ? (
                              <span className="text-rose-400 font-semibold bg-rose-500/10 px-1.5 py-0.2 rounded border border-rose-500/30">
                                Mandatory
                              </span>
                            ) : (
                              <span className="text-muted-foreground bg-card px-1.5 py-0.2 rounded">Optional</span>
                            )}
                            {req.verifiedBy && (
                              <span>Verified by {req.verifiedBy} on {req.verifiedAt}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteRequirement(currentDeliverable.id, req.id)}
                        className="text-muted-foreground hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Requirement Input */}
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Add explicit requirement / DoD criteria..."
                    value={newReqDesc}
                    onChange={(e) => setNewReqDesc(e.target.value)}
                    className="flex-1 bg-foreground border border-border rounded-lg px-3 py-2 text-xs text-background"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newReqMandatory}
                      onChange={(e) => setNewReqMandatory(e.target.checked)}
                      className="rounded bg-card border-border"
                    />
                    Mandatory
                  </label>
                  <button
                    onClick={() => {
                      if (!newReqDesc.trim()) return;
                      addRequirement(currentDeliverable.id, {
                        description: newReqDesc,
                        isMandatory: newReqMandatory,
                        status: "pending",
                      });
                      setNewReqDesc("");
                    }}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-xs font-semibold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Submissions, Versions, Approvals */}
            <div className="lg:col-span-5 space-y-6">
              {/* Submission Box */}
              <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-indigo-400" />
                    Submit New Version / Revision
                  </h3>
                  <span className="text-xs text-muted-foreground">Next: v{currentDeliverable.submissions.length + 1}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-foreground mb-1 font-medium">Deliverable Package File</label>
                    <input
                      type="text"
                      placeholder="e.g. Final_Audit_v2.pdf or design-package.zip"
                      value={newSubFileName}
                      onChange={(e) => setNewSubFileName(e.target.value)}
                      className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                    />
                  </div>
                  <div>
                    <label className="block text-foreground mb-1 font-medium">Revision Notes</label>
                    <textarea
                      rows={2}
                      placeholder="What changes were addressed in this version..."
                      value={newSubNote}
                      onChange={(e) => setNewSubNote(e.target.value)}
                      className="w-full bg-foreground border border-border rounded-lg p-2.5 text-background"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!newSubFileName.trim()) return;
                      createSubmission(currentDeliverable.id, {
                        submittedBy: "Andi Pratama",
                        fileRefs: [{ name: newSubFileName, size: newSubFileSize }],
                        note: newSubNote,
                        status: "pending_review",
                      });
                      setNewSubFileName("");
                      setNewSubNote("");
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <UploadCloud className="w-4 h-4" />
                    Submit Version for Review & Approval
                  </button>
                </div>
              </div>

              {/* Version History Stack */}
              <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
                <h3 className="font-bold text-white text-sm">Submission & Version History</h3>

                <div className="space-y-3">
                  {currentDeliverable.submissions.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground text-xs italic">
                      No submissions made yet for this deliverable.
                    </div>
                  ) : (
                    currentDeliverable.submissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-4 rounded-xl bg-card/50 border border-border/60 space-y-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                              {sub.version}
                            </span>
                            <span className="font-medium text-foreground">{sub.fileRefs[0]?.name}</span>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                            sub.status === "approved"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : sub.status === "rejected"
                              ? "bg-rose-500/20 text-rose-300"
                              : sub.status === "superseded"
                              ? "bg-card text-muted-foreground"
                              : "bg-amber-500/20 text-amber-300"
                          }`}>
                            {sub.status.replace("_", " ")}
                          </span>
                        </div>

                        {sub.note && <div className="text-foreground italic">{sub.note}</div>}

                        <div className="text-[11px] text-muted-foreground">
                          Submitted by {sub.submittedBy} on {new Date(sub.submittedAt).toLocaleDateString()}
                        </div>

                        {/* Approvals in this version */}
                        {sub.approvals.length > 0 && (
                          <div className="pt-2 border-t border-border/60 space-y-1">
                            <div className="text-[11px] font-semibold text-foreground">Approval Decisions:</div>
                            {sub.approvals.map((app) => (
                              <div key={app.id} className="text-[11px] flex items-center justify-between text-foreground bg-background p-2 rounded">
                                <span>{app.approverName}: <strong>{app.decision}</strong></span>
                                {app.comments && <span className="text-muted-foreground italic">"{app.comments}"</span>}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Approval Action Form if not yet decided */}
                        {sub.status !== "approved" && sub.status !== "superseded" && (
                          <div className="pt-3 border-t border-border/60 space-y-2">
                            <div className="text-[11px] font-semibold text-foreground">Record Formal Approval Decision:</div>
                            <div className="flex gap-2">
                              <select
                                value={approvalDecision}
                                onChange={(e) => setApprovalDecision(e.target.value as ApprovalDecision)}
                                className="bg-foreground border border-border text-xs rounded px-2 py-1 text-background"
                              >
                                <option value="approved">Approve</option>
                                <option value="needs_revision">Needs Revision</option>
                                <option value="rejected">Reject</option>
                              </select>
                              <input
                                type="text"
                                placeholder="Comments / conditions..."
                                value={approvalComment}
                                onChange={(e) => setApprovalComment(e.target.value)}
                                className="flex-1 bg-foreground border border-border text-xs rounded px-2.5 py-1 text-background"
                              />
                              <button
                                onClick={() => {
                                  recordApproval(currentDeliverable.id, sub.id, {
                                    approverId: "u-self",
                                    approverName: "You (Authorized Approver)",
                                    decision: approvalDecision,
                                    comments: approvalComment,
                                  });
                                  setApprovalComment("");
                                }}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1 rounded font-semibold"
                              >
                                Decide
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ALL SUBMISSIONS */}
        {activeTab === "submissions" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Consolidated Version History Stack</h2>
            <div className="space-y-3">
              {deliverables.flatMap((d) =>
                d.submissions.map((s) => ({ ...s, deliverableTitle: d.title, deliverableId: d.id }))
              ).map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 bg-card/40 border border-border/60 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-white flex items-center gap-2">
                      <span className="font-mono text-teal-400 font-bold">{sub.version}</span>
                      <span>{sub.deliverableTitle}</span>
                    </div>
                    <div className="text-muted-foreground">File: {sub.fileRefs[0]?.name} • Submitted by {sub.submittedBy}</div>
                  </div>
                  <span className="font-mono text-foreground font-bold uppercase">{sub.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PENDING APPROVALS */}
        {activeTab === "approvals" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Pending Formal Approvals</h2>
            <p className="text-xs text-muted-foreground">Deliverables currently awaiting review sign-offs.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {deliverables
                .filter((d) => d.status === "in_review" || d.status === "submitted")
                .map((d) => (
                  <div key={d.id} className="p-4 rounded-xl bg-card/50 border border-border/60 space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{d.title}</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded uppercase font-semibold">
                        {d.status}
                      </span>
                    </div>
                    <div className="text-foreground">{d.projectName} • Owner: {d.ownerName}</div>
                    <button
                      onClick={() => {
                        setSelectedDeliverableId(d.id);
                        setActiveTab("detail");
                      }}
                      className="w-full bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg font-semibold text-center"
                    >
                      Review & Approve
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* TAB 5: BY PROJECT */}
        {activeTab === "by_project" && (
          <div className="space-y-6">
            {Array.from(new Set(deliverables.map((d) => d.projectName || "Unassigned Project"))).map((proj) => {
              const projDelivs = deliverables.filter((d) => (d.projectName || "Unassigned Project") === proj);
              return (
                <div key={proj} className="bg-background border border-border rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <PackageCheck className="w-5 h-5 text-teal-400" />
                      {proj}
                    </h3>
                    <span className="text-xs text-muted-foreground">{projDelivs.length} deliverables</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {projDelivs.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setSelectedDeliverableId(d.id);
                          setActiveTab("detail");
                        }}
                        className="bg-background p-3.5 rounded-lg border border-border cursor-pointer hover:border-teal-500 transition text-xs space-y-1.5"
                      >
                        <div className="font-semibold text-white">{d.title}</div>
                        <div className="flex items-center justify-between text-muted-foreground text-[11px]">
                          <span>Status: {d.status}</span>
                          <span>Due: {d.dueAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 6: STATISTICS */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Total Deliverables</span>
                <div className="text-2xl font-bold text-white mt-1">{stats.total}</div>
                <div className="text-[11px] text-teal-400 mt-1">{stats.delivered} marked delivered</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">DoD Compliance</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.complianceRate}%</div>
                <div className="text-[11px] text-muted-foreground mt-1">Mandatory requirements verified</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Avg Revisions</span>
                <div className="text-2xl font-bold text-indigo-400 mt-1">{stats.avgRevisions}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{stats.totalSubmissions} total version releases</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Overdue Ratio</span>
                <div className="text-2xl font-bold text-rose-400 mt-1">{stats.overdue}</div>
                <div className="text-[11px] text-muted-foreground mt-1">Behind schedule deliverables</div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-xl p-6 text-xs text-muted-foreground space-y-2">
              <h3 className="font-bold text-white text-base">Ecosystem Position & Definition of Done</h3>
              <p className="leading-relaxed">
                Deliverable Manager (#20) is the source of truth for work outputs. Unlike Task Manager (#01)
                which tracks daily task execution, Deliverable Manager defines the exact quality criteria (DoD),
                manages stakeholder approvals, and tracks version iterations before formal client delivery.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Deliverable Modal */}
      {isNewDeliverableOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Deliverable</h3>

            <form onSubmit={handleCreateDeliverable} className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground mb-1 font-medium">Deliverable Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. System Security Audit Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Associated Project</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Target Delivery Date</label>
                <input
                  type="date"
                  value={newDueAt}
                  onChange={(e) => setNewDueAt(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Scope Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of what will be produced and submitted..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg p-2.5 text-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewDeliverableOpen(false)}
                  className="px-4 py-2 rounded-lg bg-card hover:bg-card text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-semibold"
                >
                  Create Deliverable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
