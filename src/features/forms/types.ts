export type FormStatus = "draft" | "published" | "closed";

export type AccessType = "public" | "authenticated" | "invite_only";

export type FieldType =
  | "short_text"
  | "long_text"
  | "number"
  | "date"
  | "single_choice"
  | "multiple_choice"
  | "dropdown"
  | "file_upload"
  | "rating"
  | "email"
  | "phone";

export type RuleOperator = "equals" | "not_equals" | "contains" | "greater_than" | "less_than";

export type RuleAction = "show" | "hide" | "require";

export type ResponseStatus = "submitted" | "processed" | "failed";

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  minValue?: number;
  maxValue?: number;
}

export interface FormField {
  id: string;
  formId: string;
  label: string;
  type: FieldType;
  isRequired: boolean;
  options?: string[]; // for single_choice, multiple_choice, dropdown
  order: number;
  validation?: FieldValidation;
  placeholder?: string;
}

export interface ConditionalRule {
  id: string;
  formId: string;
  targetFieldId: string;
  condition: {
    dependsOnFieldId: string;
    operator: RuleOperator;
    value: any;
  };
  action: RuleAction;
}

export interface FieldMapping {
  sourceFieldId: string;
  targetField: string;
  transform?: string;
}

export interface ActionMapping {
  id: string;
  formId: string;
  targetApp: "task_manager" | "database" | "deliverable_manager" | "people_manager" | "custom";
  targetEntityType: "task" | "record" | "submission" | "person";
  fieldMappings: FieldMapping[];
  triggerCondition?: string;
}

export interface Answer {
  responseId: string;
  fieldId: string;
  value: any;
}

export interface FormResponse {
  id: string;
  formId: string;
  submittedBy?: string; // userId or anonymous
  submittedAt: string;
  answers: Answer[];
  status: ResponseStatus;
  failureReason?: string;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  conditionalRules: ConditionalRule[];
  status: FormStatus;
  accessType: AccessType;
  closeAt?: string;
  actionMappings: ActionMapping[];
  createdAt: string;
  updatedAt?: string;
}
