import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  ApprovalFlow,
  ApprovalRequest,
  ApprovalDecision,
  Delegate,
  DecisionType,
} from "./types";

interface ApprovalStore {
  flows: ApprovalFlow[];
  requests: ApprovalRequest[];
  delegates: Delegate[];
  selectedRequestId: string | null;

  // Actions
  submitDecision: (
    requestId: string,
    decision: DecisionType,
    comments: string,
    approverName?: string
  ) => { success: boolean; message: string };

  createRequest: (data: {
    flowId: string;
    title: string;
    entityType: string;
    entityId: string;
    entitySummary: string;
    requestedBy: string;
  }) => void;

  createFlow: (flow: Omit<ApprovalFlow, "id" | "createdAt">) => void;
  updateFlow: (id: string, flow: Partial<ApprovalFlow>) => void;
  deleteFlow: (id: string) => void;
  duplicateFlow: (id: string) => void;

  addDelegate: (delegate: Omit<Delegate, "id">) => void;
  deleteDelegate: (id: string) => void;

  cancelRequest: (requestId: string) => void;
  setSelectedRequestId: (id: string | null) => void;
}

const INITIAL_FLOWS: ApprovalFlow[] = [
  {
    id: "flow-01",
    name: "Approval 2 Tahap: Manager -> Direktur",
    description: "Alur standar verifikasi deliverables & perubahan dokumen kerja resmi.",
    applicableEntityTypes: ["deliverable_submission", "document"],
    createdAt: "2026-09-01T08:00:00Z",
    steps: [
      {
        id: "step-1-1",
        approvalFlowId: "flow-01",
        order: 1,
        name: "Review Manager Teknis",
        mode: "sequential_after_previous",
        approverType: "specific_user",
        approverRefs: ["Budi Santoso (Engineering Manager)"],
        minApprovalsRequired: 1,
        slaHours: 24,
      },
      {
        id: "step-1-2",
        approvalFlowId: "flow-01",
        order: 2,
        name: "Persetujuan Direktur Operasional",
        mode: "sequential_after_previous",
        approverType: "any_of_group",
        approverRefs: ["Dewi Sartika (VP Ops)", "Hendro Wicaksono (COO)"],
        minApprovalsRequired: 1,
        slaHours: 48,
        escalationRule: {
          id: "esc-1-2",
          approvalStepId: "step-1-2",
          triggerAfterHours: 48,
          action: "escalate_to_manager",
          escalateToUserId: "CEO Utama",
        },
      },
    ],
  },
  {
    id: "flow-02",
    name: "Pengadaan Hardware & Server > 25 Juta",
    description: "Verifikasi alokasi anggaran infrastruktur Cloud & Server kantor.",
    applicableEntityTypes: ["expense", "contract"],
    createdAt: "2026-09-05T09:00:00Z",
    steps: [
      {
        id: "step-2-1",
        approvalFlowId: "flow-02",
        order: 1,
        name: "Verifikasi Head of IT",
        mode: "sequential_after_previous",
        approverType: "specific_user",
        approverRefs: ["Rian Pratama (Head of IT)"],
        minApprovalsRequired: 1,
        slaHours: 12,
      },
      {
        id: "step-2-2",
        approvalFlowId: "flow-02",
        order: 2,
        name: "Persetujuan Finance & Budget Controller",
        mode: "sequential_after_previous",
        approverType: "all_of_group",
        approverRefs: ["Maya Anggraini (Finance Lead)", "Agus Salim (CFO)"],
        minApprovalsRequired: 2,
        slaHours: 36,
      },
    ],
  },
];

const INITIAL_REQUESTS: ApprovalRequest[] = [
  {
    id: "req-01",
    approvalFlowId: "flow-01",
    flowName: "Approval 2 Tahap: Manager -> Direktur",
    title: "Submission Deliverable #04: Final Architecture & WCAG Standards",
    entityType: "deliverable_submission",
    entityId: "deliv-04",
    entitySummary: "Dokumen teknis arsitektur UI/UX dan kepatuhan WCAG 2.1 AA dari tim Frontend.",
    requestedBy: "Andi Pratama",
    currentStepOrder: 2,
    status: "pending",
    createdAt: "2026-09-23T10:00:00Z",
    completedAt: null,
    decisions: [
      {
        id: "dec-01-1",
        approvalRequestId: "req-01",
        stepOrder: 1,
        approverId: "budi",
        approverName: "Budi Santoso (Engineering Manager)",
        decision: "approved",
        comments: "Spesifikasi sudah lengkap dan memenuhi kriteria Definition of Done.",
        decidedAt: "2026-09-23T15:20:00Z",
      },
    ],
  },
  {
    id: "req-02",
    approvalFlowId: "flow-02",
    flowName: "Pengadaan Hardware & Server > 25 Juta",
    title: "Pengadaan Server Backup untuk Riset dan Pengembangan",
    entityType: "expense",
    entityId: "exp-882",
    entitySummary: "Alokasi anggaran pembelian workstation server riset sebesar Rp 38.500.000.",
    requestedBy: "Siti Rahma (Lab Riset)",
    currentStepOrder: 1,
    status: "pending",
    createdAt: "2026-09-24T01:00:00Z",
    completedAt: null,
    decisions: [],
  },
  {
    id: "req-03",
    approvalFlowId: "flow-01",
    flowName: "Approval 2 Tahap: Manager -> Direktur",
    title: "Rilis Panduan SOP Keamanan & Password Rotation v3",
    entityType: "document",
    entityId: "doc-301",
    entitySummary: "Kebijakan wajib penggantian API Key dan enkripsi at-rest per Q4 2026.",
    requestedBy: "Budi Santoso",
    currentStepOrder: 2,
    status: "approved",
    createdAt: "2026-09-20T08:00:00Z",
    completedAt: "2026-09-21T11:45:00Z",
    decisions: [
      {
        id: "dec-03-1",
        approvalRequestId: "req-03",
        stepOrder: 1,
        approverId: "budi",
        approverName: "Budi Santoso (Engineering Manager)",
        decision: "approved",
        comments: "Semua tim dev telah meninjau draft SOP.",
        decidedAt: "2026-09-20T14:00:00Z",
      },
      {
        id: "dec-03-2",
        approvalRequestId: "req-03",
        stepOrder: 2,
        approverId: "dewi",
        approverName: "Dewi Sartika (VP Ops)",
        decision: "approved",
        comments: "Disetujui untuk diumumkan ke seluruh karyawan.",
        decidedAt: "2026-09-21T11:45:00Z",
      },
    ],
  },
];

const INITIAL_DELEGATES: Delegate[] = [
  {
    id: "del-01",
    fromUserId: "user-dewi",
    fromUserName: "Dewi Sartika (VP Ops)",
    toUserId: "user-hendro",
    toUserName: "Hendro Wicaksono (COO)",
    approvalFlowId: null,
    startDate: "2026-09-22",
    endDate: "2026-09-26",
    reason: "Dinas luar kota seminar eksekutif",
  },
];

export const useApprovalStore = create<ApprovalStore>()(
  persist(
    (set, get) => ({
      flows: INITIAL_FLOWS,
      requests: INITIAL_REQUESTS,
      delegates: INITIAL_DELEGATES,
      selectedRequestId: null,

      submitDecision: (requestId, decision, comments, approverName = "Anda (Approver)") => {
        const req = get().requests.find((r) => r.id === requestId);
        if (!req || req.status !== "pending") {
          return { success: false, message: "Permintaan approval tidak dapat diproses." };
        }

        const flow = get().flows.find((f) => f.id === req.approvalFlowId);
        const currentStep = flow?.steps.find((s) => s.order === req.currentStepOrder);

        const newDecision: ApprovalDecision = {
          id: `dec-${Date.now()}`,
          approvalRequestId: requestId,
          stepOrder: req.currentStepOrder,
          approverId: "current_user",
          approverName,
          decision,
          comments: comments || "Tanpa catatan tambahan.",
          decidedAt: new Date().toISOString(),
        };

        const updatedDecisions = [...req.decisions, newDecision];

        if (decision === "rejected") {
          // Rejection terminates or rejects request
          set((state) => ({
            requests: state.requests.map((r) =>
              r.id === requestId
                ? {
                    ...r,
                    status: "rejected",
                    completedAt: new Date().toISOString(),
                    decisions: updatedDecisions,
                  }
                : r
            ),
          }));
          return { success: true, message: "Keputusan Ditolak tercatat. Permintaan ditolak." };
        }

        // Decision approved / delegated
        const totalSteps = flow?.steps.length || 1;
        const isLastStep = req.currentStepOrder >= totalSteps;

        // Check if step requirement met (simple 1 required or min requirement)
        const stepDecisions = updatedDecisions.filter(
          (d) => d.stepOrder === req.currentStepOrder && d.decision === "approved"
        );
        const minReq = currentStep?.minApprovalsRequired || 1;

        if (stepDecisions.length >= minReq) {
          if (isLastStep) {
            // Completed approved
            set((state) => ({
              requests: state.requests.map((r) =>
                r.id === requestId
                  ? {
                      ...r,
                      status: "approved",
                      completedAt: new Date().toISOString(),
                      decisions: updatedDecisions,
                    }
                  : r
              ),
            }));
            return {
              success: true,
              message: "Persetujuan final selesai! Permintaan resmi Berstatus Approved.",
            };
          } else {
            // Advance to next step
            set((state) => ({
              requests: state.requests.map((r) =>
                r.id === requestId
                  ? {
                      ...r,
                      currentStepOrder: r.currentStepOrder + 1,
                      decisions: updatedDecisions,
                    }
                  : r
              ),
            }));
            return {
              success: true,
              message: `Tahap ${req.currentStepOrder} disetujui. Request maju ke Tahap ${req.currentStepOrder + 1}.`,
            };
          }
        } else {
          // Still waiting for more approvals on this step
          set((state) => ({
            requests: state.requests.map((r) =>
              r.id === requestId ? { ...r, decisions: updatedDecisions } : r
            ),
          }));
          return {
            success: true,
            message: `Keputusan dicatat (${stepDecisions.length}/${minReq} persetujuan terpenuhi).`,
          };
        }
      },

      createRequest: (data) => {
        const flow = get().flows.find((f) => f.id === data.flowId);
        const newReq: ApprovalRequest = {
          id: `req-${Date.now()}`,
          approvalFlowId: data.flowId,
          flowName: flow?.name || "Standard Approval",
          title: data.title,
          entityType: data.entityType,
          entityId: data.entityId,
          entitySummary: data.entitySummary,
          requestedBy: data.requestedBy,
          currentStepOrder: 1,
          status: "pending",
          createdAt: new Date().toISOString(),
          completedAt: null,
          decisions: [],
        };

        set((state) => ({ requests: [newReq, ...state.requests] }));
      },

      createFlow: (flowData) => {
        const newFlow: ApprovalFlow = {
          ...flowData,
          id: `flow-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ flows: [...state.flows, newFlow] }));
      },

      updateFlow: (id, updates) => {
        set((state) => ({
          flows: state.flows.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }));
      },

      deleteFlow: (id) => {
        set((state) => ({
          flows: state.flows.filter((f) => f.id !== id),
        }));
      },

      duplicateFlow: (id) => {
        const f = get().flows.find((x) => x.id === id);
        if (!f) return;
        const dupe: ApprovalFlow = {
          ...f,
          id: `flow-${Date.now()}`,
          name: `${f.name} (Copy)`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ flows: [...state.flows, dupe] }));
      },

      addDelegate: (data) => {
        const newDel: Delegate = {
          ...data,
          id: `del-${Date.now()}`,
        };
        set((state) => ({ delegates: [...state.delegates, newDel] }));
      },

      deleteDelegate: (id) => {
        set((state) => ({
          delegates: state.delegates.filter((d) => d.id !== id),
        }));
      },

      cancelRequest: (requestId) => {
        set((state) => ({
          requests: state.requests.map((r) =>
            r.id === requestId
              ? { ...r, status: "cancelled", completedAt: new Date().toISOString() }
              : r
          ),
        }));
      },

      setSelectedRequestId: (id) => set({ selectedRequestId: id }),
    }),
    {
      name: "ecosystem-approval-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
