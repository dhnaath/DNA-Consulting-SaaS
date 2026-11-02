import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Form,
  FormField,
  ConditionalRule,
  ActionMapping,
  FormResponse,
} from "./types";

interface FormStore {
  forms: Form[];
  responses: FormResponse[];
  selectedFormId: string | null;

  setSelectedFormId: (id: string | null) => void;
  createForm: (data: Omit<Form, "id" | "createdAt" | "fields" | "conditionalRules" | "actionMappings">) => string;
  updateForm: (id: string, updates: Partial<Form>) => void;
  deleteForm: (id: string) => void;

  // Fields
  addField: (formId: string, field: Omit<FormField, "id" | "formId" | "order">) => void;
  updateField: (formId: string, fieldId: string, updates: Partial<FormField>) => void;
  removeField: (formId: string, fieldId: string) => void;

  // Conditional Rules
  addConditionalRule: (formId: string, rule: Omit<ConditionalRule, "id" | "formId">) => void;
  removeConditionalRule: (formId: string, ruleId: string) => void;

  // Action Mappings
  addActionMapping: (formId: string, mapping: Omit<ActionMapping, "id" | "formId">) => void;
  removeActionMapping: (formId: string, mappingId: string) => void;

  // Responses & Submissions
  submitResponse: (formId: string, answers: { fieldId: string; value: any }[], submittedBy?: string) => string;
  retryActionMapping: (responseId: string) => void;
}

const INITIAL_FORMS: Form[] = [
  {
    id: "form-bug-report",
    title: "Bug & Incident Report Form",
    description: "Submit issues directly into Task Manager (#01) triage queue with reproduction details.",
    status: "published",
    accessType: "authenticated",
    createdAt: "2026-09-15T08:00:00Z",
    fields: [
      { id: "f-1", formId: "form-bug-report", label: "Issue Title", type: "short_text", isRequired: true, order: 1, placeholder: "Brief summary of the issue" },
      { id: "f-2", formId: "form-bug-report", label: "Affected App Component", type: "dropdown", isRequired: true, order: 2, options: ["Task Manager", "Deliverables", "Database", "Calendar", "Other"] },
      { id: "f-3", formId: "form-bug-report", label: "Severity Level", type: "single_choice", isRequired: true, order: 3, options: ["Low", "Medium", "High", "Critical"] },
      { id: "f-4", formId: "form-bug-report", label: "Reproduction Steps", type: "long_text", isRequired: true, order: 4, placeholder: "1. Click X, 2. Open Y..." },
      { id: "f-5", formId: "form-bug-report", label: "Server Error Logs / Screenshot URL", type: "short_text", isRequired: false, order: 5, placeholder: "https://..." },
    ],
    conditionalRules: [
      {
        id: "c-1",
        formId: "form-bug-report",
        targetFieldId: "f-5",
        condition: { dependsOnFieldId: "f-3", operator: "equals", value: "Critical" },
        action: "require",
      },
    ],
    actionMappings: [
      {
        id: "am-1",
        formId: "form-bug-report",
        targetApp: "task_manager",
        targetEntityType: "task",
        fieldMappings: [
          { sourceFieldId: "f-1", targetField: "title" },
          { sourceFieldId: "f-4", targetField: "description" },
          { sourceFieldId: "f-3", targetField: "priority" },
        ],
      },
    ],
  },
  {
    id: "form-client-feedback",
    title: "Client Deliverable Satisfaction Survey",
    description: "Post-delivery review questionnaire measuring stakeholder satisfaction.",
    status: "published",
    accessType: "public",
    createdAt: "2026-09-18T10:00:00Z",
    fields: [
      { id: "cf-1", formId: "form-client-feedback", label: "Client Organization", type: "short_text", isRequired: true, order: 1 },
      { id: "cf-2", formId: "form-client-feedback", label: "Overall Quality Rating (1-5)", type: "rating", isRequired: true, order: 2 },
      { id: "cf-3", formId: "form-client-feedback", label: "Did the deliverable meet all DoD requirements?", type: "single_choice", isRequired: true, order: 3, options: ["Yes fully", "Partially", "No"] },
      { id: "cf-4", formId: "form-client-feedback", label: "Detailed Feedback & Suggestions", type: "long_text", isRequired: false, order: 4 },
    ],
    conditionalRules: [],
    actionMappings: [
      {
        id: "am-2",
        formId: "form-client-feedback",
        targetApp: "database",
        targetEntityType: "record",
        fieldMappings: [
          { sourceFieldId: "cf-1", targetField: "Organization" },
          { sourceFieldId: "cf-2", targetField: "Rating" },
        ],
      },
    ],
  },
];

const INITIAL_RESPONSES: FormResponse[] = [
  {
    id: "resp-01",
    formId: "form-bug-report",
    submittedBy: "Dhia Ramadhan",
    submittedAt: "2026-09-21T11:20:00Z",
    status: "processed",
    answers: [
      { responseId: "resp-01", fieldId: "f-1", value: "Safari Date Picker NaN in Timeline" },
      { responseId: "resp-01", fieldId: "f-2", value: "Calendar" },
      { responseId: "resp-01", fieldId: "f-3", value: "High" },
      { responseId: "resp-01", fieldId: "f-4", value: "Opening date selector on iOS Safari causes invalid date display." },
    ],
  },
  {
    id: "resp-02",
    formId: "form-bug-report",
    submittedBy: "External Tester",
    submittedAt: "2026-09-22T14:40:00Z",
    status: "failed",
    failureReason: "Target field 'priority' failed validation in Task Manager (schema mismatch).",
    answers: [
      { responseId: "resp-02", fieldId: "f-1", value: "Export button unresponsive on Firefox" },
      { responseId: "resp-02", fieldId: "f-2", value: "Deliverables" },
      { responseId: "resp-02", fieldId: "f-3", value: "Critical" },
      { responseId: "resp-02", fieldId: "f-4", value: "PDF export modal does not trigger download dialog." },
    ],
  },
  {
    id: "resp-03",
    formId: "form-client-feedback",
    submittedBy: "Bank Mandiri PMO",
    submittedAt: "2026-09-23T09:15:00Z",
    status: "processed",
    answers: [
      { responseId: "resp-03", fieldId: "cf-1", value: "Bank Mandiri" },
      { responseId: "resp-03", fieldId: "cf-2", value: 5 },
      { responseId: "resp-03", fieldId: "cf-3", value: "Yes fully" },
      { responseId: "resp-03", fieldId: "cf-4", value: "Excellent security controls documentation and adherence to schedule." },
    ],
  },
];

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      forms: INITIAL_FORMS,
      responses: INITIAL_RESPONSES,
      selectedFormId: "form-bug-report",

      setSelectedFormId: (id) => set({ selectedFormId: id }),

      createForm: (data) => {
        const id = `form-${Date.now()}`;
        const newForm: Form = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
          fields: [
            {
              id: `f-${Date.now()}-1`,
              formId: id,
              label: "Untitled Question",
              type: "short_text",
              isRequired: false,
              order: 1,
            },
          ],
          conditionalRules: [],
          actionMappings: [],
        };
        set((state) => ({
          forms: [newForm, ...state.forms],
          selectedFormId: id,
        }));
        return id;
      },

      updateForm: (id, updates) => {
        set((state) => ({
          forms: state.forms.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f)),
        }));
      },

      deleteForm: (id) => {
        set((state) => ({
          forms: state.forms.filter((f) => f.id !== id),
          selectedFormId: state.selectedFormId === id ? null : state.selectedFormId,
        }));
      },

      addField: (formId, field) => {
        set((state) => ({
          forms: state.forms.map((f) => {
            if (f.id !== formId) return f;
            const newField: FormField = {
              ...field,
              id: `f-${Date.now()}`,
              formId,
              order: f.fields.length + 1,
            };
            return { ...f, fields: [...f.fields, newField] };
          }),
        }));
      },

      updateField: (formId, fieldId, updates) => {
        set((state) => ({
          forms: state.forms.map((f) => {
            if (f.id !== formId) return f;
            return {
              ...f,
              fields: f.fields.map((fld) => (fld.id === fieldId ? { ...fld, ...updates } : fld)),
            };
          }),
        }));
      },

      removeField: (formId, fieldId) => {
        set((state) => ({
          forms: state.forms.map((f) => {
            if (f.id !== formId) return f;
            return {
              ...f,
              fields: f.fields.filter((fld) => fld.id !== fieldId),
              conditionalRules: f.conditionalRules.filter(
                (r) => r.targetFieldId !== fieldId && r.condition.dependsOnFieldId !== fieldId
              ),
            };
          }),
        }));
      },

      addConditionalRule: (formId, rule) => {
        const newRule: ConditionalRule = {
          ...rule,
          id: `c-${Date.now()}`,
          formId,
        };
        set((state) => ({
          forms: state.forms.map((f) => (f.id === formId ? { ...f, conditionalRules: [...f.conditionalRules, newRule] } : f)),
        }));
      },

      removeConditionalRule: (formId, ruleId) => {
        set((state) => ({
          forms: state.forms.map((f) =>
            f.id === formId ? { ...f, conditionalRules: f.conditionalRules.filter((r) => r.id !== ruleId) } : f
          ),
        }));
      },

      addActionMapping: (formId, mapping) => {
        const newMap: ActionMapping = {
          ...mapping,
          id: `am-${Date.now()}`,
          formId,
        };
        set((state) => ({
          forms: state.forms.map((f) => (f.id === formId ? { ...f, actionMappings: [...f.actionMappings, newMap] } : f)),
        }));
      },

      removeActionMapping: (formId, mappingId) => {
        set((state) => ({
          forms: state.forms.map((f) =>
            f.id === formId ? { ...f, actionMappings: f.actionMappings.filter((m) => m.id !== mappingId) } : f
          ),
        }));
      },

      submitResponse: (formId, answersData, submittedBy) => {
        const id = `resp-${Date.now()}`;
        const newResponse: FormResponse = {
          id,
          formId,
          submittedBy: submittedBy || "Anonymous Guest",
          submittedAt: new Date().toISOString(),
          status: "processed",
          answers: answersData.map((a) => ({
            responseId: id,
            fieldId: a.fieldId,
            value: a.value,
          })),
        };
        set((state) => ({
          responses: [newResponse, ...state.responses],
        }));
        return id;
      },

      retryActionMapping: (responseId) => {
        set((state) => ({
          responses: state.responses.map((r) =>
            r.id === responseId
              ? { ...r, status: "processed", failureReason: undefined }
              : r
          ),
        }));
      },
    }),
    {
      name: "ecosystem-forms-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
