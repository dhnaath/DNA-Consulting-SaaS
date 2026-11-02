import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  WorkflowDefinition,
  Stage,
  Transition,
  WorkflowInstance,
  WorkflowHistory,
} from "./types";

interface WorkflowStore {
  definitions: WorkflowDefinition[];
  instances: WorkflowInstance[];
  selectedDefinitionId: string | null;
  selectedInstanceId: string | null;

  setSelectedDefinitionId: (id: string | null) => void;
  setSelectedInstanceId: (id: string | null) => void;

  // Definitions
  createDefinition: (data: Omit<WorkflowDefinition, "id" | "createdAt">) => string;
  updateDefinition: (id: string, updates: Partial<WorkflowDefinition>) => void;
  deleteDefinition: (id: string) => void;

  // Stages & Transitions
  addStage: (defId: string, stage: Omit<Stage, "id" | "workflowDefinitionId">) => void;
  addTransition: (defId: string, transition: Omit<Transition, "id" | "workflowDefinitionId">) => void;
  deleteTransition: (defId: string, transitionId: string) => void;

  // Instance execution
  createInstance: (data: Omit<WorkflowInstance, "id" | "startedAt" | "status" | "history">) => string;
  advanceTransition: (
    instanceId: string,
    transitionId: string,
    performedBy: string,
    note?: string
  ) => { success: boolean; error?: string };
  cancelInstance: (instanceId: string) => void;
}

const INITIAL_DEFINITIONS: WorkflowDefinition[] = [
  {
    id: "wf-def-review",
    name: "2-Stage Deliverable Review & Legal Sign-off",
    description: "Standard pipeline for formal client documents and architecture deliverables.",
    initialStageId: "stg-draft",
    applicableEntityTypes: ["deliverable", "document"],
    createdAt: "2026-09-10T00:00:00Z",
    version: 1,
    stages: [
      { id: "stg-draft", workflowDefinitionId: "wf-def-review", name: "Drafting", order: 1, isTerminal: false, slaHours: 48 },
      { id: "stg-peer", workflowDefinitionId: "wf-def-review", name: "Peer Review", order: 2, isTerminal: false, slaHours: 24 },
      { id: "stg-legal", workflowDefinitionId: "wf-def-review", name: "Legal & Compliance", order: 3, isTerminal: false, slaHours: 48 },
      { id: "stg-approved", workflowDefinitionId: "wf-def-review", name: "Approved / Done", order: 4, isTerminal: true },
    ],
    transitions: [
      {
        id: "tr-1",
        workflowDefinitionId: "wf-def-review",
        fromStageId: "stg-draft",
        toStageId: "stg-peer",
        label: "Submit to Peer Review",
        rules: [
          { id: "r-1", transitionId: "tr-1", type: "required_field", config: { field: "fileAttachment" }, errorMessage: "File attachment required" },
        ],
      },
      {
        id: "tr-2",
        workflowDefinitionId: "wf-def-review",
        fromStageId: "stg-peer",
        toStageId: "stg-legal",
        label: "Peer Sign-off",
        rules: [
          { id: "r-2", transitionId: "tr-2", type: "required_approval_count", config: { minApprovals: 1 }, errorMessage: "Requires at least 1 peer approval" },
        ],
      },
      {
        id: "tr-3",
        workflowDefinitionId: "wf-def-review",
        fromStageId: "stg-peer",
        toStageId: "stg-draft",
        label: "Request Revision",
        rules: [],
      },
      {
        id: "tr-4",
        workflowDefinitionId: "wf-def-review",
        fromStageId: "stg-legal",
        toStageId: "stg-approved",
        label: "Final Legal Sign-off",
        rules: [
          { id: "r-3", transitionId: "tr-4", type: "required_role", config: { role: "legal_approver" }, errorMessage: "Only authorized legal officers can sign off" },
        ],
      },
      {
        id: "tr-5",
        workflowDefinitionId: "wf-def-review",
        fromStageId: "stg-legal",
        toStageId: "stg-draft",
        label: "Legal Reject to Draft",
        rules: [],
      },
    ],
  },
  {
    id: "wf-def-bug",
    name: "Engineering Bug Triage & Fix Workflow",
    description: "Triage, reproduction, fix validation, and staging deployment pipeline.",
    initialStageId: "stg-triage",
    applicableEntityTypes: ["task"],
    createdAt: "2026-09-12T00:00:00Z",
    version: 1,
    stages: [
      { id: "stg-triage", workflowDefinitionId: "wf-def-bug", name: "Triage & Reproduction", order: 1, isTerminal: false, slaHours: 12 },
      { id: "stg-dev", workflowDefinitionId: "wf-def-bug", name: "In Development", order: 2, isTerminal: false, slaHours: 36 },
      { id: "stg-qa", workflowDefinitionId: "wf-def-bug", name: "QA Staging Verification", order: 3, isTerminal: false, slaHours: 24 },
      { id: "stg-closed", workflowDefinitionId: "wf-def-bug", name: "Closed & Released", order: 4, isTerminal: true },
    ],
    transitions: [
      { id: "tr-b1", workflowDefinitionId: "wf-def-bug", fromStageId: "stg-triage", toStageId: "stg-dev", label: "Confirmed Bug", rules: [] },
      { id: "tr-b2", workflowDefinitionId: "wf-def-bug", fromStageId: "stg-dev", toStageId: "stg-qa", label: "Ready for QA", rules: [] },
      { id: "tr-b3", workflowDefinitionId: "wf-def-bug", fromStageId: "stg-qa", toStageId: "stg-closed", label: "QA Passed", rules: [] },
      { id: "tr-b4", workflowDefinitionId: "wf-def-bug", fromStageId: "stg-qa", toStageId: "stg-dev", label: "Failed QA", rules: [] },
    ],
  },
];

const INITIAL_INSTANCES: WorkflowInstance[] = [
  {
    id: "wf-inst-1",
    workflowDefinitionId: "wf-def-review",
    workflowName: "2-Stage Deliverable Review & Legal Sign-off",
    entityType: "deliverable",
    entityId: "deliv-01",
    entityTitle: "Client Portal Security & RBAC Architecture",
    currentStageId: "stg-legal",
    startedAt: "2026-09-18T10:00:00Z",
    status: "active",
    history: [
      {
        id: "h-1",
        workflowInstanceId: "wf-inst-1",
        fromStageId: "stg-draft",
        toStageId: "stg-peer",
        transitionId: "tr-1",
        transitionLabel: "Submit to Peer Review",
        performedBy: "Andi Pratama",
        performedAt: "2026-09-18T10:00:00Z",
        note: "Submitted first draft package with file attachments.",
        durationMinutes: 120,
      },
      {
        id: "h-2",
        workflowInstanceId: "wf-inst-1",
        fromStageId: "stg-peer",
        toStageId: "stg-legal",
        transitionId: "tr-2",
        transitionLabel: "Peer Sign-off",
        performedBy: "Dhia Ramadhan",
        performedAt: "2026-09-20T14:00:00Z",
        note: "Peer review passed. Security controls verified.",
        durationMinutes: 3120,
      },
    ],
  },
  {
    id: "wf-inst-2",
    workflowDefinitionId: "wf-def-review",
    workflowName: "2-Stage Deliverable Review & Legal Sign-off",
    entityType: "deliverable",
    entityId: "deliv-02",
    entityTitle: "Brand Asset Kit & Marketing Design System",
    currentStageId: "stg-approved",
    startedAt: "2026-09-15T09:00:00Z",
    completedAt: "2026-09-23T11:00:00Z",
    status: "completed",
    history: [
      {
        id: "h-21",
        workflowInstanceId: "wf-inst-2",
        fromStageId: "stg-draft",
        toStageId: "stg-peer",
        transitionId: "tr-1",
        transitionLabel: "Submit to Peer Review",
        performedBy: "Siti Rahma",
        performedAt: "2026-09-15T09:00:00Z",
      },
      {
        id: "h-22",
        workflowInstanceId: "wf-inst-2",
        fromStageId: "stg-peer",
        toStageId: "stg-legal",
        transitionId: "tr-2",
        transitionLabel: "Peer Sign-off",
        performedBy: "Andi Pratama",
        performedAt: "2026-09-21T10:00:00Z",
      },
      {
        id: "h-23",
        workflowInstanceId: "wf-inst-2",
        fromStageId: "stg-legal",
        toStageId: "stg-approved",
        transitionId: "tr-4",
        transitionLabel: "Final Legal Sign-off",
        performedBy: "Pak Hendra (Legal)",
        performedAt: "2026-09-23T11:00:00Z",
      },
    ],
  },
  {
    id: "wf-inst-3",
    workflowDefinitionId: "wf-def-bug",
    workflowName: "Engineering Bug Triage & Fix Workflow",
    entityType: "task",
    entityId: "task-902",
    entityTitle: "Fix Safari Date Parsing in Timeline View",
    currentStageId: "stg-triage",
    startedAt: "2026-09-22T08:00:00Z", // Breach SLA: 12h
    status: "active",
    history: [],
  },
];

export const useWorkflowStore = create<WorkflowStore>()(
  persist(
    (set, get) => ({
      definitions: INITIAL_DEFINITIONS,
      instances: INITIAL_INSTANCES,
      selectedDefinitionId: "wf-def-review",
      selectedInstanceId: "wf-inst-1",

      setSelectedDefinitionId: (id) => set({ selectedDefinitionId: id }),
      setSelectedInstanceId: (id) => set({ selectedInstanceId: id }),

      createDefinition: (data) => {
        const id = `wf-def-${Date.now()}`;
        const newDef: WorkflowDefinition = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
          version: 1,
        };
        set((state) => ({
          definitions: [newDef, ...state.definitions],
          selectedDefinitionId: id,
        }));
        return id;
      },

      updateDefinition: (id, updates) => {
        set((state) => ({
          definitions: state.definitions.map((d) => (d.id === id ? { ...d, ...updates } : d)),
        }));
      },

      deleteDefinition: (id) => {
        set((state) => ({
          definitions: state.definitions.filter((d) => d.id !== id),
          selectedDefinitionId: state.selectedDefinitionId === id ? null : state.selectedDefinitionId,
        }));
      },

      addStage: (defId, stage) => {
        const newStage: Stage = {
          ...stage,
          id: `stg-${Date.now()}`,
          workflowDefinitionId: defId,
        };
        set((state) => ({
          definitions: state.definitions.map((d) =>
            d.id === defId ? { ...d, stages: [...d.stages, newStage] } : d
          ),
        }));
      },

      addTransition: (defId, transition) => {
        const newTrans: Transition = {
          ...transition,
          id: `tr-${Date.now()}`,
          workflowDefinitionId: defId,
        };
        set((state) => ({
          definitions: state.definitions.map((d) =>
            d.id === defId ? { ...d, transitions: [...d.transitions, newTrans] } : d
          ),
        }));
      },

      deleteTransition: (defId, transitionId) => {
        set((state) => ({
          definitions: state.definitions.map((d) =>
            d.id === defId
              ? { ...d, transitions: d.transitions.filter((t) => t.id !== transitionId) }
              : d
          ),
        }));
      },

      createInstance: (data) => {
        const id = `wf-inst-${Date.now()}`;
        const newInst: WorkflowInstance = {
          ...data,
          id,
          startedAt: new Date().toISOString(),
          status: "active",
          history: [],
        };
        set((state) => ({
          instances: [newInst, ...state.instances],
          selectedInstanceId: id,
        }));
        return id;
      },

      advanceTransition: (instanceId, transitionId, performedBy, note) => {
        const state = get();
        const instance = state.instances.find((i) => i.id === instanceId);
        if (!instance) return { success: false, error: "Instance not found" };

        const def = state.definitions.find((d) => d.id === instance.workflowDefinitionId);
        if (!def) return { success: false, error: "Workflow definition not found" };

        const transition = def.transitions.find((t) => t.id === transitionId);
        if (!transition) return { success: false, error: "Transition not found" };

        // Ensure transition is valid from current stage
        if (transition.fromStageId !== instance.currentStageId) {
          return { success: false, error: "Invalid transition from current stage" };
        }

        // Validate rules
        for (const rule of transition.rules) {
          if (rule.type === "required_field" && !performedBy) {
            return { success: false, error: rule.errorMessage };
          }
        }

        const targetStage = def.stages.find((s) => s.id === transition.toStageId);
        const isTerminal = targetStage?.isTerminal ?? false;

        const newHistoryEntry: WorkflowHistory = {
          id: `h-${Date.now()}`,
          workflowInstanceId: instanceId,
          fromStageId: transition.fromStageId,
          toStageId: transition.toStageId,
          transitionId,
          transitionLabel: transition.label,
          performedBy,
          performedAt: new Date().toISOString(),
          note,
        };

        set((s) => ({
          instances: s.instances.map((inst) =>
            inst.id === instanceId
              ? {
                  ...inst,
                  currentStageId: transition.toStageId,
                  status: isTerminal ? "completed" : "active",
                  completedAt: isTerminal ? new Date().toISOString() : undefined,
                  history: [...inst.history, newHistoryEntry],
                }
              : inst
          ),
        }));

        return { success: true };
      },

      cancelInstance: (instanceId) => {
        set((state) => ({
          instances: state.instances.map((i) =>
            i.id === instanceId ? { ...i, status: "cancelled", completedAt: new Date().toISOString() } : i
          ),
        }));
      },
    }),
    {
      name: "ecosystem-workflow-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
