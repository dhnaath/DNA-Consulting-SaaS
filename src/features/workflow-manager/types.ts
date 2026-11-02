export type TriggerType = "manual" | "automatic";

export type RuleType =
  | "required_field"
  | "required_approval_count"
  | "required_role"
  | "custom_condition";

export type WorkflowInstanceStatus = "active" | "completed" | "cancelled";

export interface Stage {
  id: string;
  workflowDefinitionId: string;
  name: string;
  order: number;
  isTerminal: boolean;
  slaHours?: number;
}

export interface Rule {
  id: string;
  transitionId: string;
  type: RuleType;
  config: Record<string, any>;
  errorMessage: string;
}

export interface Trigger {
  id: string;
  type: TriggerType;
  condition?: string;
  config?: Record<string, any>;
}

export interface Transition {
  id: string;
  workflowDefinitionId: string;
  fromStageId: string;
  toStageId: string;
  label: string; // e.g. "Approve", "Reject", "Request Revision"
  triggerId?: string;
  trigger?: Trigger;
  rules: Rule[];
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  stages: Stage[];
  transitions: Transition[];
  initialStageId: string;
  applicableEntityTypes: string[]; // e.g. ["deliverable", "document", "task"]
  createdAt: string;
  version?: number;
}

export interface WorkflowHistory {
  id: string;
  workflowInstanceId: string;
  fromStageId: string;
  toStageId: string;
  transitionId: string;
  transitionLabel: string;
  performedBy?: string;
  performedAt: string;
  note?: string;
  durationMinutes?: number;
}

export interface WorkflowInstance {
  id: string;
  workflowDefinitionId: string;
  workflowName: string;
  entityType: string; // "deliverable" | "document" | "task" | "custom"
  entityId: string;
  entityTitle: string;
  currentStageId: string;
  startedAt: string;
  completedAt?: string;
  status: WorkflowInstanceStatus;
  history: WorkflowHistory[];
}
