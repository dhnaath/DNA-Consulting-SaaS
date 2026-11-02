export type DeliverableStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "in_review"
  | "needs_revision"
  | "approved"
  | "delivered"
  | "rejected";

export type RequirementStatus = "pending" | "met" | "not_met";

export type SubmissionStatus =
  | "pending_review"
  | "in_review"
  | "approved"
  | "rejected"
  | "superseded";

export type ApprovalDecision = "approved" | "rejected" | "needs_revision";

export type StakeholderRole = "owner" | "reviewer" | "approver" | "recipient";

export interface Requirement {
  id: string;
  deliverableId: string;
  description: string;
  isMandatory: boolean;
  status: RequirementStatus;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewerName: string;
  rating?: number; // 1-5
  comments: string;
  reviewedAt: string;
}

export interface Approval {
  id: string;
  submissionId: string;
  approverId: string;
  approverName: string;
  decision: ApprovalDecision;
  comments?: string;
  decidedAt: string;
}

export interface Submission {
  id: string;
  deliverableId: string;
  version: string; // v1, v2, v3
  submittedBy: string;
  submittedAt: string;
  fileRefs: { name: string; size: string; assetId?: string }[];
  note?: string;
  status: SubmissionStatus;
  reviews: Review[];
  approvals: Approval[];
}

export interface Stakeholder {
  id: string;
  deliverableId: string;
  personId: string;
  name: string;
  role: StakeholderRole;
  email?: string;
}

export interface Deliverable {
  id: string;
  title: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  dueAt?: string;
  status: DeliverableStatus;
  ownerId: string;
  ownerName: string;
  requirements: Requirement[];
  submissions: Submission[];
  stakeholders: Stakeholder[];
  createdAt: string;
  updatedAt: string;
}
