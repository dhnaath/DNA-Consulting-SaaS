export type SourceAppType =
  | 'task_manager'
  | 'project_manager'
  | 'wiki'
  | 'database'
  | 'forms'
  | 'meeting_manager'
  | 'workflow_manager';

export type TemplateVisibility = 'private' | 'workspace' | 'public';

export type VariableType = 'date_relative' | 'text_placeholder' | 'number';

export interface TemplateVariable {
  id: string;
  templateId: string;
  key: string; // e.g. "{{start_date}}", "{{project_name}}"
  type: VariableType;
  defaultValue?: string;
  description?: string;
}

export interface TemplateCategory {
  id: string;
  name: string;
  description?: string;
}

export interface ApplicationRecord {
  id: string;
  templateId: string;
  appliedBy: string;
  appliedAt: string;
  resultingEntityId: string;
  anchorValues: Record<string, string>;
}

export interface EcosystemTemplate {
  id: string;
  name: string;
  description?: string;
  sourceApp: SourceAppType;
  structure: Record<string, any>;
  categoryId?: string;
  visibility: TemplateVisibility;
  variables: TemplateVariable[];
  createdBy: string;
  createdAt: string;
  usageCount: number;
}

export type TemplateViewMode =
  | 'gallery'
  | 'by_category'
  | 'my_templates'
  | 'most_used'
  | 'public_templates'
  | 'stats';
