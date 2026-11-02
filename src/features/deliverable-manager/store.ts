import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Deliverable,
  DeliverableStatus,
  Requirement,
  Submission,
  Review,
  Approval,
  Stakeholder,
} from "./types";

interface DeliverableStore {
  deliverables: Deliverable[];
  selectedDeliverableId: string | null;

  setSelectedDeliverableId: (id: string | null) => void;
  createDeliverable: (data: Omit<Deliverable, "id" | "createdAt" | "updatedAt">) => string;
  updateDeliverable: (id: string, updates: Partial<Deliverable>) => void;
  deleteDeliverable: (id: string) => void;

  // Requirements (DoD)
  addRequirement: (deliverableId: string, req: Omit<Requirement, "id" | "deliverableId">) => void;
  toggleRequirementStatus: (deliverableId: string, reqId: string, verifiedBy: string) => void;
  deleteRequirement: (deliverableId: string, reqId: string) => void;

  // Submissions (v1, v2, etc.)
  createSubmission: (
    deliverableId: string,
    submission: Omit<Submission, "id" | "deliverableId" | "version" | "submittedAt" | "reviews" | "approvals">
  ) => void;

  // Reviews
  addReview: (deliverableId: string, submissionId: string, review: Omit<Review, "id" | "submissionId" | "reviewedAt">) => void;

  // Approvals
  recordApproval: (
    deliverableId: string,
    submissionId: string,
    approval: Omit<Approval, "id" | "submissionId" | "decidedAt">
  ) => void;

  // Final Delivery
  markDelivered: (deliverableId: string) => void;

  // Stakeholders
  addStakeholder: (deliverableId: string, stakeholder: Omit<Stakeholder, "id" | "deliverableId">) => void;
}

const INITIAL_DELIVERABLES: Deliverable[] = [
  {
    id: "deliv-01",
    title: "Client Portal Security & RBAC Architecture Specification",
    description: "Full technical specification, threat modeling, and definition of done for RBAC role matrices.",
    projectId: "proj-101",
    projectName: "Enterprise Client Portal Revamp",
    dueAt: "2026-09-30",
    status: "in_review",
    ownerId: "u-andi",
    ownerName: "Andi Pratama",
    createdAt: "2026-09-15T08:00:00Z",
    updatedAt: "2026-09-23T14:30:00Z",
    stakeholders: [
      { id: "st-1", deliverableId: "deliv-01", personId: "u-andi", name: "Andi Pratama", role: "owner" },
      { id: "st-2", deliverableId: "deliv-01", personId: "u-dhia", name: "Dhia Ramadhan", role: "reviewer" },
      { id: "st-3", deliverableId: "deliv-01", personId: "u-legal", name: "Pak Hendra (Director)", role: "approver" },
      { id: "st-4", deliverableId: "deliv-01", personId: "u-client", name: "Bank Mandiri PMO", role: "recipient" },
    ],
    requirements: [
      { id: "req-1", deliverableId: "deliv-01", description: "Must follow ISO 27001 Access Control guidelines", isMandatory: true, status: "met", verifiedBy: "Dhia Ramadhan", verifiedAt: "2026-09-20" },
      { id: "req-2", deliverableId: "deliv-01", description: "Sign-off from internal Security Officer", isMandatory: true, status: "met", verifiedBy: "Andi Pratama", verifiedAt: "2026-09-22" },
      { id: "req-3", deliverableId: "deliv-01", description: "Includes database schema migration script", isMandatory: false, status: "pending" },
    ],
    submissions: [
      {
        id: "sub-1",
        deliverableId: "deliv-01",
        version: "v1",
        submittedBy: "Andi Pratama",
        submittedAt: "2026-09-18T10:00:00Z",
        fileRefs: [{ name: "RBAC_Spec_v1.0.pdf", size: "3.4 MB" }],
        note: "Initial draft for internal peer review",
        status: "superseded",
        reviews: [
          { id: "rev-1", submissionId: "sub-1", reviewerId: "u-dhia", reviewerName: "Dhia Ramadhan", rating: 4, comments: "Looks solid, please clarify session invalidation upon role revocation.", reviewedAt: "2026-09-19" },
        ],
        approvals: [
          { id: "app-1", submissionId: "sub-1", approverId: "u-legal", approverName: "Pak Hendra", decision: "needs_revision", comments: "Please add explicit appendix on external contractor access.", decidedAt: "2026-09-20" },
        ],
      },
      {
        id: "sub-2",
        deliverableId: "deliv-01",
        version: "v2",
        submittedBy: "Andi Pratama",
        submittedAt: "2026-09-22T16:00:00Z",
        fileRefs: [{ name: "RBAC_Spec_v2.0_FinalDraft.pdf", size: "4.1 MB" }],
        note: "Updated with contractor access isolation and audit logging.",
        status: "in_review",
        reviews: [
          { id: "rev-2", submissionId: "sub-2", reviewerId: "u-dhia", reviewerName: "Dhia Ramadhan", rating: 5, comments: "Contractor isolation looks complete and compliant.", reviewedAt: "2026-09-23" },
        ],
        approvals: [],
      },
    ],
  },
  {
    id: "deliv-02",
    title: "Brand Asset Kit & Marketing Design System",
    description: "Complete vector logos, color codes, typography scales, and social templates.",
    projectId: "proj-102",
    projectName: "Q4 Marketing Campaign",
    dueAt: "2026-09-26",
    status: "approved",
    ownerId: "u-siti",
    ownerName: "Siti Rahma",
    createdAt: "2026-09-10T09:00:00Z",
    updatedAt: "2026-09-23T11:00:00Z",
    stakeholders: [
      { id: "st-21", deliverableId: "deliv-02", personId: "u-siti", name: "Siti Rahma", role: "owner" },
      { id: "st-22", deliverableId: "deliv-02", personId: "u-andi", name: "Andi Pratama", role: "approver" },
      { id: "st-23", deliverableId: "deliv-02", personId: "u-client2", name: "Media Buying Agency", role: "recipient" },
    ],
    requirements: [
      { id: "req-21", deliverableId: "deliv-02", description: "SVG & PNG exports in 1x, 2x, 4x resolutions", isMandatory: true, status: "met", verifiedBy: "Andi Pratama", verifiedAt: "2026-09-22" },
      { id: "req-22", deliverableId: "deliv-02", description: "Color contrast accessibility WCAG AA compliance", isMandatory: true, status: "met", verifiedBy: "Siti Rahma", verifiedAt: "2026-09-22" },
    ],
    submissions: [
      {
        id: "sub-21",
        deliverableId: "deliv-02",
        version: "v1",
        submittedBy: "Siti Rahma",
        submittedAt: "2026-09-22T10:00:00Z",
        fileRefs: [{ name: "Brand_Asset_Package_v1.zip", size: "48.2 MB" }],
        note: "All formats exported according to campaign specs.",
        status: "approved",
        reviews: [],
        approvals: [
          { id: "app-21", submissionId: "sub-21", approverId: "u-andi", approverName: "Andi Pratama", decision: "approved", comments: "Exceeds expectations. Ready for media team handover.", decidedAt: "2026-09-23" },
        ],
      },
    ],
  },
  {
    id: "deliv-03",
    title: "Monthly Financial Audit Report — August 2026",
    description: "Reconciled ledger, cash flow variance, tax withholding statements, and proof of disbursements.",
    projectId: "proj-103",
    projectName: "Internal Finance & Governance",
    dueAt: "2026-09-20",
    status: "delivered",
    ownerId: "u-budi",
    ownerName: "Budi Santoso",
    createdAt: "2026-09-01T08:00:00Z",
    updatedAt: "2026-09-21T10:00:00Z",
    stakeholders: [
      { id: "st-31", deliverableId: "deliv-03", personId: "u-budi", name: "Budi Santoso", role: "owner" },
      { id: "st-32", deliverableId: "deliv-03", personId: "u-tax", name: "Kantor Akuntan Publik", role: "approver" },
    ],
    requirements: [
      { id: "req-31", deliverableId: "deliv-03", description: "Bank statement reconciliation within Rp 0 tolerance", isMandatory: true, status: "met", verifiedBy: "Budi Santoso", verifiedAt: "2026-09-18" },
    ],
    submissions: [
      {
        id: "sub-31",
        deliverableId: "deliv-03",
        version: "v1",
        submittedBy: "Budi Santoso",
        submittedAt: "2026-09-19T09:00:00Z",
        fileRefs: [{ name: "Financial_Audit_Aug2026.xlsx", size: "12.5 MB" }],
        status: "approved",
        reviews: [],
        approvals: [
          { id: "app-31", submissionId: "sub-31", approverId: "u-tax", approverName: "KAP Tanubrata", decision: "approved", decidedAt: "2026-09-20" },
        ],
      },
    ],
  },
];

export const useDeliverableStore = create<DeliverableStore>()(
  persist(
    (set) => ({
      deliverables: INITIAL_DELIVERABLES,
      selectedDeliverableId: "deliv-01",

      setSelectedDeliverableId: (id) => set({ selectedDeliverableId: id }),

      createDeliverable: (data) => {
        const id = `deliv-${Date.now()}`;
        const newDeliv: Deliverable = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({
          deliverables: [newDeliv, ...state.deliverables],
          selectedDeliverableId: id,
        }));
        return id;
      },

      updateDeliverable: (id, updates) => {
        set((state) => ({
          deliverables: state.deliverables.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          ),
        }));
      },

      deleteDeliverable: (id) => {
        set((state) => ({
          deliverables: state.deliverables.filter((d) => d.id !== id),
          selectedDeliverableId: state.selectedDeliverableId === id ? null : state.selectedDeliverableId,
        }));
      },

      addRequirement: (deliverableId, req) => {
        const newReq: Requirement = {
          ...req,
          id: `req-${Date.now()}`,
          deliverableId,
        };
        set((state) => ({
          deliverables: state.deliverables.map((d) =>
            d.id === deliverableId
              ? { ...d, requirements: [...d.requirements, newReq], updatedAt: new Date().toISOString() }
              : d
          ),
        }));
      },

      toggleRequirementStatus: (deliverableId, reqId, verifiedBy) => {
        set((state) => ({
          deliverables: state.deliverables.map((d) =>
            d.id === deliverableId
              ? {
                  ...d,
                  requirements: d.requirements.map((r) =>
                    r.id === reqId
                      ? {
                          ...r,
                          status: r.status === "met" ? "pending" : "met",
                          verifiedBy: r.status === "met" ? undefined : verifiedBy,
                          verifiedAt: r.status === "met" ? undefined : new Date().toISOString().split("T")[0],
                        }
                      : r
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
      },

      deleteRequirement: (deliverableId, reqId) => {
        set((state) => ({
          deliverables: state.deliverables.map((d) =>
            d.id === deliverableId
              ? { ...d, requirements: d.requirements.filter((r) => r.id !== reqId), updatedAt: new Date().toISOString() }
              : d
          ),
        }));
      },

      createSubmission: (deliverableId, subData) => {
        set((state) => ({
          deliverables: state.deliverables.map((d) => {
            if (d.id !== deliverableId) return d;
            const newVersion = `v${d.submissions.length + 1}`;
            // Mark previous active submissions as superseded
            const updatedExisting = d.submissions.map((s) => ({
              ...s,
              status: s.status === "approved" ? s.status : ("superseded" as const),
            }));
            const newSub: Submission = {
              ...subData,
              id: `sub-${Date.now()}`,
              deliverableId,
              version: newVersion,
              submittedAt: new Date().toISOString(),
              status: "pending_review" as const,
              reviews: [],
              approvals: [],
            };
            return {
              ...d,
              status: "submitted",
              submissions: [...updatedExisting, newSub],
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      addReview: (deliverableId, submissionId, review) => {
        const newRev: Review = {
          ...review,
          id: `rev-${Date.now()}`,
          submissionId,
          reviewedAt: new Date().toISOString(),
        };
        set((state) => ({
          deliverables: state.deliverables.map((d) => {
            if (d.id !== deliverableId) return d;
            return {
              ...d,
              status: d.status === "submitted" ? "in_review" : d.status,
              submissions: d.submissions.map((s) =>
                s.id === submissionId ? { ...s, reviews: [...s.reviews, newRev] } : s
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      recordApproval: (deliverableId, submissionId, approval) => {
        const newApp: Approval = {
          ...approval,
          id: `app-${Date.now()}`,
          submissionId,
          decidedAt: new Date().toISOString(),
        };
        set((state) => ({
          deliverables: state.deliverables.map((d) => {
            if (d.id !== deliverableId) return d;
            let newStatus: DeliverableStatus = d.status;
            if (approval.decision === "approved") newStatus = "approved";
            if (approval.decision === "needs_revision") newStatus = "needs_revision";
            if (approval.decision === "rejected") newStatus = "rejected";

            return {
              ...d,
              status: newStatus,
              submissions: d.submissions.map((s) =>
                s.id === submissionId
                  ? {
                      ...s,
                      status:
                        approval.decision === "approved"
                          ? "approved"
                          : approval.decision === "rejected"
                          ? "rejected"
                          : "pending_review",
                      approvals: [...s.approvals, newApp],
                    }
                  : s
              ),
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      markDelivered: (deliverableId) => {
        set((state) => ({
          deliverables: state.deliverables.map((d) =>
            d.id === deliverableId
              ? { ...d, status: "delivered", updatedAt: new Date().toISOString() }
              : d
          ),
        }));
      },

      addStakeholder: (deliverableId, stakeholder) => {
        const newStk: Stakeholder = {
          ...stakeholder,
          id: `st-${Date.now()}`,
          deliverableId,
        };
        set((state) => ({
          deliverables: state.deliverables.map((d) =>
            d.id === deliverableId
              ? { ...d, stakeholders: [...d.stakeholders, newStk], updatedAt: new Date().toISOString() }
              : d
          ),
        }));
      },
    }),
    {
      name: "ecosystem-deliverable-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
