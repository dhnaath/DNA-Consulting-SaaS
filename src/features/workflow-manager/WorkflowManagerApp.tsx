import React, { useState, useMemo } from "react";
import {
  ArrowRight,
  Plus,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Workflow,
  BarChart3,
  ListTree,
  Activity,
} from "lucide-react";
import { useWorkflowStore } from "./store";
import { useShellSections } from "@/app/shell-sections";
import { ShellHeader } from "@/app/shell-header";

type ViewTab = "designer" | "instances" | "instance_detail" | "sla_breach" | "stats";

export function WorkflowManagerApp() {
  const {
    definitions,
    instances,
    selectedDefinitionId,
    selectedInstanceId,
    setSelectedDefinitionId,
    setSelectedInstanceId,
    createDefinition,
    advanceTransition,
  } = useWorkflowStore();

  const [activeTab, setActiveTab] = useState<ViewTab>("designer");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & form
  const [isNewDefModalOpen, setIsNewDefModalOpen] = useState(false);
  const [newDefName, setNewDefName] = useState("");
  const [newDefDesc, setNewDefDesc] = useState("");

  // New Stage
  const [newStageName, setNewStageName] = useState("");
  const [newStageSLA, setNewStageSLA] = useState(24);
  const [newStageIsTerminal, setNewStageIsTerminal] = useState(false);

  // New Transition
  const [transFromStage, setTransFromStage] = useState("");
  const [transToStage, setTransToStage] = useState("");
  const [transLabel, setTransLabel] = useState("");

  // Advance modal/action
  const [advanceActor, setAdvanceActor] = useState("Andi Pratama");
  const [advanceNote, setAdvanceNote] = useState("");
  const [transitionError, setTransitionError] = useState<string | null>(null);

  // Active Definition
  const currentDef = useMemo(() => {
    return definitions.find((d) => d.id === selectedDefinitionId) || definitions[0] || null;
  }, [definitions, selectedDefinitionId]);

  // Active Instance
  const currentInstance = useMemo(() => {
    return instances.find((i) => i.id === selectedInstanceId) || instances[0] || null;
  }, [instances, selectedInstanceId]);

  // SLA Breach Detection: instance time in current stage > stage.slaHours
  const breachedInstances = useMemo(() => {
    const now = new Date("2026-09-24T12:00:00Z").getTime();
    return instances.filter((inst) => {
      if (inst.status !== "active") return false;
      const def = definitions.find((d) => d.id === inst.workflowDefinitionId);
      if (!def) return false;
      const stage = def.stages.find((s) => s.id === inst.currentStageId);
      if (!stage || !stage.slaHours) return false;

      // Find when it entered current stage
      const lastTransition = inst.history[inst.history.length - 1];
      const entryTime = lastTransition ? new Date(lastTransition.performedAt).getTime() : new Date(inst.startedAt).getTime();
      const elapsedHours = (now - entryTime) / (1000 * 60 * 60);
      return elapsedHours > stage.slaHours;
    });
  }, [instances, definitions]);

  // Statistics calculation
  const stats = useMemo(() => {
    const totalDefs = definitions.length;
    const totalInstances = instances.length;
    const activeInstances = instances.filter((i) => i.status === "active").length;
    const completedInstances = instances.filter((i) => i.status === "completed").length;
    const cancelledInstances = instances.filter((i) => i.status === "cancelled").length;

    // SLA Compliance = 100 - (breached / active * 100)
    const complianceRate = activeInstances > 0 ? Math.max(0, Math.round(((activeInstances - breachedInstances.length) / activeInstances) * 100)) : 100;

    return {
      totalDefs,
      totalInstances,
      activeInstances,
      completedInstances,
      cancelledInstances,
      breachedCount: breachedInstances.length,
      complianceRate,
    };
  }, [definitions, instances, breachedInstances]);

  useShellSections([
    { id: "designer", label: "Workflow Designer", icon: Workflow, active: activeTab === "designer", onSelect: () => setActiveTab("designer") },
    { id: "instances", label: `Active Pipelines (${stats.activeInstances})`, icon: Activity, active: activeTab === "instances", onSelect: () => setActiveTab("instances") },
    { id: "instance_detail", label: "Audit Trail", icon: ListTree, active: activeTab === "instance_detail", onSelect: () => setActiveTab("instance_detail") },
    { id: "sla_breach", label: `SLA Breach (${stats.breachedCount})`, icon: ShieldAlert, active: activeTab === "sla_breach", onSelect: () => setActiveTab("sla_breach") },
    { id: "stats", label: "Process Analytics", icon: BarChart3, active: activeTab === "stats", onSelect: () => setActiveTab("stats") },
  ]);

  const handleCreateDefinition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDefName.trim()) return;

    createDefinition({
      name: newDefName,
      description: newDefDesc,
      initialStageId: "stg-initial",
      applicableEntityTypes: ["deliverable", "task", "document"],
      stages: [
        { id: "stg-initial", workflowDefinitionId: "", name: "Initiation", order: 1, isTerminal: false, slaHours: 24 },
        { id: "stg-done", workflowDefinitionId: "", name: "Completed", order: 2, isTerminal: true },
      ],
      transitions: [
        {
          id: `tr-${Date.now()}`,
          workflowDefinitionId: "",
          fromStageId: "stg-initial",
          toStageId: "stg-done",
          label: "Approve & Complete",
          rules: [],
        },
      ],
    });

    setNewDefName("");
    setNewDefDesc("");
    setIsNewDefModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header Actions in Floating Pill */}
      <ShellHeader>
        <div className="flex items-center gap-1.5 shrink-0">
          {/* View Tab Switchers - Compact Segmented Icon Pills */}
          <div className="flex items-center gap-0.5 border border-border/60 rounded-lg p-0.5 bg-muted/70 text-xs shrink-0">
            {[
              { id: "designer", label: "Workflow Designer", icon: Workflow },
              { id: "instances", label: `Active Pipelines (${stats.activeInstances})`, icon: Activity },
              { id: "instance_detail", label: "Audit Trail", icon: ListTree },
              { id: "sla_breach", label: `SLA Breach (${stats.breachedCount})`, icon: ShieldAlert },
              { id: "stats", label: "Process Analytics", icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ViewTab)}
                  title={tab.label}
                  aria-label={tab.label}
                  className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-background text-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setIsNewDefModalOpen(true)}
            title="Buat Blueprint Workflow Baru"
            aria-label="New Blueprint"
            className="p-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer shrink-0 flex items-center justify-center"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </ShellHeader>

      {/* Top Header */}
      <div className="border-b border-border bg-background/70 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              #21 Workflow Manager
            </span>
            <span className="text-xs text-muted-foreground">Formal Process Engine • Stages, Transitions, Rules & SLA Audits</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-3">
            Workflow Engine
            {currentDef && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {currentDef.name}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* TAB 1: WORKFLOW DESIGNER */}
        {activeTab === "designer" && currentDef && (
          <div className="space-y-6">
            {/* Definition Switcher Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-background p-4 rounded-xl border border-border">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-semibold uppercase">Blueprint:</span>
                <select
                  value={currentDef.id}
                  onChange={(e) => setSelectedDefinitionId(e.target.value)}
                  className="bg-foreground border border-border rounded-lg px-3 py-1.5 text-xs text-background font-semibold"
                >
                  {definitions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.stages.length} stages)
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-muted-foreground">
                Applicable to:{" "}
                <span className="font-mono text-cyan-300">
                  {currentDef.applicableEntityTypes.join(", ")}
                </span>
              </div>
            </div>

            {/* Visual Canvas (Stages & Transitions) */}
            <div className="bg-background border border-border rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-cyan-400" />
                    Visual Stage Flow Diagram
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{currentDef.description}</p>
                </div>
              </div>

              {/* Horizontal Node Stages Canvas */}
              <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-2">
                {currentDef.stages
                  .sort((a, b) => a.order - b.order)
                  .map((stage, idx) => {
                    const outgoingTransitions = currentDef.transitions.filter((t) => t.fromStageId === stage.id);
                    return (
                      <div key={stage.id} className="flex items-center gap-4 shrink-0">
                        {/* Stage Card */}
                        <div className={`w-64 p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                          stage.isTerminal
                            ? "bg-emerald-950/20 border-emerald-500/40"
                            : stage.id === currentDef.initialStageId
                            ? "bg-cyan-950/20 border-cyan-500/40"
                            : "bg-card/40 border-border/60"
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[10px] font-bold text-muted-foreground">STAGE #{stage.order}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              stage.isTerminal
                                ? "bg-emerald-500/20 text-emerald-400"
                                : stage.id === currentDef.initialStageId
                                ? "bg-cyan-500/20 text-cyan-400"
                                : "bg-card text-muted-foreground"
                            }`}>
                              {stage.isTerminal ? "Terminal" : stage.id === currentDef.initialStageId ? "Initial" : "In-Flight"}
                            </span>
                          </div>

                          <div className="font-bold text-white text-sm">{stage.name}</div>

                          <div className="text-[11px] text-muted-foreground flex items-center justify-between pt-2 border-t border-border">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-cyan-400" />
                              SLA: {stage.slaHours ? `${stage.slaHours}h` : "None"}
                            </span>
                            <span>{outgoingTransitions.length} transitions</span>
                          </div>
                        </div>

                        {/* Transition Connector Arrow */}
                        {idx < currentDef.stages.length - 1 && (
                          <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                            <ArrowRight className="w-6 h-6 text-cyan-500/70" />
                            <span className="text-[9px] uppercase font-mono text-cyan-400/80">Valid Flow</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Transition Rules Matrix */}
              <div className="pt-6 border-t border-border space-y-3">
                <h4 className="font-bold text-white text-sm">Defined Transitions & Guard Rules</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {currentDef.transitions.map((t) => {
                    const fromStage = currentDef.stages.find((s) => s.id === t.fromStageId);
                    const toStage = currentDef.stages.find((s) => s.id === t.toStageId);
                    return (
                      <div key={t.id} className="p-3.5 rounded-xl bg-card/50 border border-border/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300">{t.label}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {fromStage?.name} → {toStage?.name}
                          </span>
                        </div>

                        {t.rules.length > 0 ? (
                          <div className="space-y-1">
                            {t.rules.map((r) => (
                              <div key={r.id} className="text-[11px] bg-background p-2 rounded text-foreground flex items-center gap-1.5">
                                <span className="text-amber-400">🛡 Rule:</span>
                                <span>{r.errorMessage}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[11px] text-muted-foreground italic">No restrictive validation rules.</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE PIPELINES */}
        {activeTab === "instances" && currentDef && (
          <div className="space-y-6">
            <div className="bg-background border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">Active Pipelines by Stage</h2>
              <p className="text-xs text-muted-foreground">
                Real-time instances following formal workflow blueprints. Transitions advance state deterministically.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {instances.map((inst) => {
                  const def = definitions.find((d) => d.id === inst.workflowDefinitionId);
                  const currentStage = def?.stages.find((s) => s.id === inst.currentStageId);
                  const availableTransitions = def?.transitions.filter((t) => t.fromStageId === inst.currentStageId) || [];

                  return (
                    <div
                      key={inst.id}
                      className="bg-background border border-border hover:border-cyan-500/50 rounded-xl p-5 space-y-3 text-xs flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {inst.entityType}: #{inst.entityId}
                          </span>
                          <span className={`text-[10px] font-bold uppercase ${
                            inst.status === "completed" ? "text-emerald-400" : "text-amber-400"
                          }`}>
                            {inst.status}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white">{inst.entityTitle}</h4>
                        <div className="text-muted-foreground">Workflow: {inst.workflowName}</div>

                        <div className="bg-background p-2.5 rounded-lg border border-border flex items-center justify-between">
                          <span className="text-muted-foreground">Current Stage:</span>
                          <span className="font-bold text-cyan-300">{currentStage?.name}</span>
                        </div>
                      </div>

                      {/* Advance Transitions Buttons */}
                      {inst.status === "active" && availableTransitions.length > 0 && (
                        <div className="pt-3 border-t border-border space-y-2">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground block">Advance Workflow:</span>
                          <div className="flex flex-col gap-1.5">
                            {availableTransitions.map((tr) => (
                              <button
                                key={tr.id}
                                onClick={() => {
                                  const res = advanceTransition(inst.id, tr.id, advanceActor, "Transition executed via UI");
                                  if (!res.success) {
                                    setTransitionError(res.error || "Transition failed");
                                  } else {
                                    setTransitionError(null);
                                  }
                                }}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold py-1.5 px-3 rounded-lg flex items-center justify-between transition"
                              >
                                <span>{tr.label}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          setSelectedInstanceId(inst.id);
                          setActiveTab("instance_detail");
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 pt-2 text-center"
                      >
                        View Full Audit Trail →
                      </button>
                    </div>
                  );
                })}
              </div>

              {transitionError && (
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Validation Error: {transitionError}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT TRAIL / INSTANCE DETAIL */}
        {activeTab === "instance_detail" && currentInstance && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-cyan-400 font-mono uppercase">
                  {currentInstance.entityType} #{currentInstance.entityId}
                </span>
                <h2 className="text-xl font-bold text-white mt-1">{currentInstance.entityTitle}</h2>
                <p className="text-xs text-muted-foreground mt-1">Workflow: {currentInstance.workflowName}</p>
              </div>

              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                currentInstance.status === "completed"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              }`}>
                {currentInstance.status}
              </span>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-sm">Chronological Transition Audit Log</h3>

              <div className="space-y-3 relative pl-6 border-l-2 border-cyan-500/30">
                {currentInstance.history.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic">No transitions recorded yet. In initial stage.</div>
                ) : (
                  currentInstance.history.map((h) => (
                    <div key={h.id} className="relative text-xs bg-card/40 p-3.5 rounded-xl border border-border/60 space-y-1">
                      <span className="absolute -left-[31px] top-4 w-3 h-3 rounded-full bg-cyan-400 border-2 border-border" />
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{h.transitionLabel}</span>
                        <span className="text-[11px] text-muted-foreground">{new Date(h.performedAt).toLocaleString()}</span>
                      </div>
                      <div className="text-foreground">
                        Executed by: <strong className="text-cyan-300">{h.performedBy || "System Trigger"}</strong>
                      </div>
                      {h.note && <div className="text-muted-foreground italic text-[11px]">Note: "{h.note}"</div>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SLA BREACH */}
        {activeTab === "sla_breach" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
              <div>
                <h2 className="text-lg font-bold text-white">SLA Breached Instances</h2>
                <p className="text-xs text-muted-foreground">Pipelines that exceeded maximum allowed hours on current stage.</p>
              </div>
            </div>

            <div className="space-y-3">
              {breachedInstances.length === 0 ? (
                <div className="text-xs text-emerald-400 py-8 text-center bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                  ✓ All active workflow instances are compliant within defined stage SLAs.
                </div>
              ) : (
                breachedInstances.map((inst) => (
                  <div key={inst.id} className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-white text-sm">{inst.entityTitle}</div>
                      <div className="text-rose-300">Stage: {inst.currentStageId} • Workflow: {inst.workflowName}</div>
                      <div className="text-muted-foreground">Started: {new Date(inst.startedAt).toLocaleString()}</div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedInstanceId(inst.id);
                        setActiveTab("instance_detail");
                      }}
                      className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-lg font-semibold"
                    >
                      Investigate Bottleneck
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: STATS */}
        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Active Pipelines</span>
                <div className="text-2xl font-bold text-cyan-400 mt-1">{stats.activeInstances}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{stats.completedInstances} completed</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">SLA Compliance</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.complianceRate}%</div>
                <div className="text-[11px] text-rose-400 mt-1">{stats.breachedCount} breached SLA</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Blueprints</span>
                <div className="text-2xl font-bold text-white mt-1">{stats.totalDefs}</div>
                <div className="text-[11px] text-muted-foreground mt-1">Standardized processes</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Total Instances</span>
                <div className="text-2xl font-bold text-purple-400 mt-1">{stats.totalInstances}</div>
                <div className="text-[11px] text-muted-foreground mt-1">Cross-app tracked runs</div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-xl p-6 text-xs text-muted-foreground space-y-2">
              <h3 className="font-bold text-white text-base">Generic Process Engine Architecture</h3>
              <p className="leading-relaxed">
                Workflow Manager (#21) does not own domain data. Instead, it serves as the central rule engine
                enforcing that transitions between stages (such as Deliverable review, contract sign-offs, or bug fixing)
                satisfy mandatory validation rules and stage SLAs.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Definition Modal */}
      {isNewDefModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Workflow Blueprint</h3>

            <form onSubmit={handleCreateDefinition} className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground mb-1 font-medium">Blueprint Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Multi-tier Approval Pipeline"
                  value={newDefName}
                  onChange={(e) => setNewDefName(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Purpose, target deliverables, or compliance requirements..."
                  value={newDefDesc}
                  onChange={(e) => setNewDefDesc(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg p-2.5 text-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewDefModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-card hover:bg-card text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold"
                >
                  Create Blueprint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
