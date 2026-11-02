export type StepMode = 'sequential_after_previous' | 'parallel';

export type ApproverType = 'specific_user' | 'role' | 'any_of_group' | 'all_of_group';

export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type DecisionType = 'approved' | 'rejected' | 'delegated';

export type EscalationAction = 'notify_again' | 'escalate_to_manager' | 'auto_approve' | 'auto_reject';

export interface EscalationRule {
  id: string;
  approvalStepId: string;
  triggerAfterHours: number;
  action: EscalationAction;
  escalateToUserId?: string;
}

export interface ApprovalStep {
  id: string;
  approvalFlowId: string;
  order: number;
  name: string;
  mode: StepMode;
  approverType: ApproverType;
  approverRefs: string[]; // names or identifiers
  minApprovalsRequired: number;
  slaHours: number;
  escalationRule?: EscalationRule;
}

export interface ApprovalFlow {
  id: string;
  name: string;
  description?: string;
  applicableEntityTypes: string[];
  steps: ApprovalStep[];
  createdAt: string;
}

export interface ApprovalDecision {
  id: string;
  approvalRequestId: string;
  stepOrder: number;
  approverId: string;
  approverName: string;
  decision: DecisionType;
  comments: string;
  decidedAt: string;
}

export interface ApprovalRequest {
  id: string;
  approvalFlowId: string;
  flowName: string;
  title: string;
  entityType: 'deliverable_submission' | 'document' | 'expense' | 'contract' | string;
  entityId: string;
  entitySummary?: string;
  requestedBy: string;
  currentStepOrder: number;
  status: RequestStatus;
  createdAt: string;
  completedAt: string | null;
  decisions: ApprovalDecision[];
}

export interface Delegate {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  approvalFlowId: string | null; // null = all flows
  startDate: string;
  endDate: string;
  reason: string;
}

export type ApprovalViewMode =
  | 'my_pending'
  | 'detail'
  | 'all_requests'
  | 'flow_designer'
  | 'escalated'
  | 'delegates'
  | 'stats';
