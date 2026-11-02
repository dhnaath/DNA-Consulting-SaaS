import React, { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Trash2,
  Send,
  Sliders,
  Split,
  Eye,
} from "lucide-react";
import { useFormStore } from "./store";
import { FieldType, FormStatus, RuleOperator, RuleAction } from "./types";
import { useShellSections } from "@/app/shell-sections";

type ViewTab = "builder" | "preview" | "responses" | "failed" | "mappings" | "analytics";

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  short_text: "Short Text",
  long_text: "Long Text / Paragraph",
  number: "Number",
  date: "Date Picker",
  single_choice: "Single Choice (Radio)",
  multiple_choice: "Multiple Choice (Checkboxes)",
  dropdown: "Dropdown Menu",
  file_upload: "File Attachment",
  rating: "Rating Scale (1-5)",
  email: "Email Address",
  phone: "Phone Number",
};

export function FormsApp() {
  const {
    forms,
    responses,
    selectedFormId,
    setSelectedFormId,
    createForm,
    updateForm,
    addField,
    removeField,
    addConditionalRule,
    removeConditionalRule,
    submitResponse,
    retryActionMapping,
  } = useFormStore();

  const [activeTab, setActiveTab] = useState<ViewTab>("builder");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & form creation
  const [isNewFormModalOpen, setIsNewFormModalOpen] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState("");
  const [newFormDesc, setNewFormDesc] = useState("");

  // Add field form
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<FieldType>("short_text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldOptions, setNewFieldOptions] = useState("Option 1, Option 2, Option 3");

  // Conditional rule form
  const [ruleTargetField, setRuleTargetField] = useState("");
  const [ruleDependsField, setRuleDependsField] = useState("");
  const [ruleOperator, setRuleOperator] = useState<RuleOperator>("equals");
  const [ruleValue, setRuleValue] = useState("");
  const [ruleAction, setRuleAction] = useState<RuleAction>("show");

  // Preview form fill state
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Active form
  const currentForm = useMemo(() => {
    return forms.find((f) => f.id === selectedFormId) || forms[0] || null;
  }, [forms, selectedFormId]);

  // Form responses
  const currentResponses = useMemo(() => {
    if (!currentForm) return [];
    return responses.filter((r) => r.formId === currentForm.id);
  }, [responses, currentForm]);

  // Failed responses
  const failedResponses = useMemo(() => {
    return responses.filter((r) => r.status === "failed");
  }, [responses]);

  // Evaluate visible fields in Preview based on conditionalRules
  const visibleFieldIds = useMemo(() => {
    if (!currentForm) return new Set<string>();
    const visible = new Set(currentForm.fields.map((f) => f.id));

    currentForm.conditionalRules.forEach((rule) => {
      const depVal = previewAnswers[rule.condition.dependsOnFieldId];
      let conditionMet = false;
      if (rule.condition.operator === "equals") {
        conditionMet = String(depVal || "").toLowerCase() === String(rule.condition.value).toLowerCase();
      } else if (rule.condition.operator === "not_equals") {
        conditionMet = String(depVal || "").toLowerCase() !== String(rule.condition.value).toLowerCase();
      } else if (rule.condition.operator === "contains") {
        conditionMet = String(depVal || "").toLowerCase().includes(String(rule.condition.value).toLowerCase());
      }

      if (rule.action === "show" && !conditionMet) {
        visible.delete(rule.targetFieldId);
      } else if (rule.action === "hide" && conditionMet) {
        visible.delete(rule.targetFieldId);
      }
    });

    return visible;
  }, [currentForm, previewAnswers]);

  // Statistics calculation per specification
  const stats = useMemo(() => {
    const totalForms = forms.length;
    const totalResponses = responses.length;
    const processedResponses = responses.filter((r) => r.status === "processed").length;
    const completionRate = totalResponses > 0 ? Math.round((processedResponses / totalResponses) * 100) : 100;
    const failedMappingRate = totalResponses > 0 ? ((failedResponses.length / totalResponses) * 100).toFixed(1) : "0";

    return {
      totalForms,
      totalResponses,
      processedResponses,
      completionRate,
      failedCount: failedResponses.length,
      failedMappingRate,
    };
  }, [forms, responses, failedResponses]);

  useShellSections([
    { id: "builder", label: "Form Designer", icon: Sliders, active: activeTab === "builder", onSelect: () => setActiveTab("builder") },
    { id: "preview", label: "Live Responder View", icon: Eye, active: activeTab === "preview", onSelect: () => setActiveTab("preview") },
    { id: "responses", label: `Responses (${currentResponses.length})`, icon: FileText, active: activeTab === "responses", onSelect: () => setActiveTab("responses") },
    { id: "mappings", label: "Action Mappings", icon: Split, active: activeTab === "mappings", onSelect: () => setActiveTab("mappings") },
    { id: "failed", label: `Failed Queue (${failedResponses.length})`, icon: AlertTriangle, active: activeTab === "failed", onSelect: () => setActiveTab("failed") },
    { id: "analytics", label: "Analytics", icon: BarChart3, active: activeTab === "analytics", onSelect: () => setActiveTab("analytics") },
  ]);

  const handleCreateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormTitle.trim()) return;

    createForm({
      title: newFormTitle,
      description: newFormDesc,
      status: "published",
      accessType: "public",
    });

    setNewFormTitle("");
    setNewFormDesc("");
    setIsNewFormModalOpen(false);
  };

  const handlePreviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentForm) return;

    const answersArray = Object.entries(previewAnswers).map(([fieldId, value]) => ({
      fieldId,
      value,
    }));

    submitResponse(currentForm.id, answersArray, "Interactive Tester");
    setSubmittedMessage("Thank you! Your response has been submitted and dispatched via ActionMapping.");
    setPreviewAnswers({});
    setTimeout(() => setSubmittedMessage(null), 4000);
  };

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Top Header Bar */}
      <div className="border-b border-border bg-background/70 backdrop-blur px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              #22 Forms
            </span>
            <span className="text-xs text-muted-foreground">Structured Data Collection • Conditional Logic & ActionMapping Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1 flex items-center gap-3">
            Forms Builder & Pipeline
            {currentForm && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                currentForm.status === "published"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-card text-foreground"
              }`}>
                {currentForm.status.toUpperCase()}
              </span>
            )}
          </h1>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1.5 bg-card/80 p-1 rounded-lg border border-border/60 text-sm">
          <button
            onClick={() => setActiveTab("builder")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "builder" ? "bg-amber-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Form Designer
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "preview" ? "bg-amber-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Live Responder View
          </button>
          <button
            onClick={() => setActiveTab("responses")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "responses" ? "bg-amber-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Responses ({currentResponses.length})
          </button>
          <button
            onClick={() => setActiveTab("mappings")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "mappings" ? "bg-amber-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Action Mappings
          </button>
          <button
            onClick={() => setActiveTab("failed")}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeTab === "failed" ? "bg-rose-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Failed Queue ({failedResponses.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "analytics" ? "bg-amber-600 text-white shadow-sm" : "text-foreground hover:text-white"
            }`}
          >
            Analytics
          </button>
        </div>

        <button
          onClick={() => setIsNewFormModalOpen(true)}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Create Form
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6">
        {/* TAB 1: FORM BUILDER */}
        {activeTab === "builder" && currentForm && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Form Header & Fields */}
            <div className="lg:col-span-7 space-y-6">
              {/* Form Metadata Box */}
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-semibold uppercase">Form:</span>
                    <select
                      value={currentForm.id}
                      onChange={(e) => setSelectedFormId(e.target.value)}
                      className="bg-foreground border border-border text-xs rounded-lg px-2.5 py-1 text-background font-semibold"
                    >
                      {forms.map((f) => (
                        <option key={f.id} value={f.id}>{f.title}</option>
                      ))}
                    </select>
                  </div>

                  <select
                    value={currentForm.status}
                    onChange={(e) => updateForm(currentForm.id, { status: e.target.value as FormStatus })}
                    className="text-xs bg-card border border-border text-foreground rounded px-2 py-1 font-semibold"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <input
                  type="text"
                  value={currentForm.title}
                  onChange={(e) => updateForm(currentForm.id, { title: e.target.value })}
                  className="w-full bg-foreground/80 border border-border/80 rounded-lg px-3 py-2 text-base font-bold text-background"
                />

                <textarea
                  rows={2}
                  value={currentForm.description || ""}
                  onChange={(e) => updateForm(currentForm.id, { description: e.target.value })}
                  placeholder="Instructions or questionnaire purpose..."
                  className="w-full bg-card/50 border border-border/60 rounded-lg p-2.5 text-xs text-foreground"
                />
              </div>

              {/* Questions / Fields List */}
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">Fields & Questions ({currentForm.fields.length})</h3>
                  <span className="text-xs text-muted-foreground">Order is preserved during submission</span>
                </div>

                <div className="space-y-3">
                  {currentForm.fields.map((field, idx) => (
                    <div
                      key={field.id}
                      className="p-4 rounded-xl bg-card/50 border border-border/60 space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-amber-400 font-bold">#{idx + 1}</span>
                          <span className="font-semibold text-white text-sm">{field.label}</span>
                          {field.isRequired && (
                            <span className="text-rose-400 font-bold">*</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-card text-foreground font-mono">
                            {FIELD_TYPE_LABELS[field.type]}
                          </span>
                          <button
                            onClick={() => removeField(currentForm.id, field.id)}
                            className="text-muted-foreground hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {field.options && field.options.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {field.options.map((opt, i) => (
                            <span key={i} className="text-[10px] bg-background px-2 py-0.5 rounded text-muted-foreground border border-border">
                              {opt}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Field Box */}
                <div className="pt-4 border-t border-border space-y-3">
                  <h4 className="font-bold text-xs uppercase text-muted-foreground">Add New Field</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      placeholder="Question / Input Label..."
                      value={newFieldLabel}
                      onChange={(e) => setNewFieldLabel(e.target.value)}
                      className="bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                    />

                    <select
                      value={newFieldType}
                      onChange={(e) => setNewFieldType(e.target.value as FieldType)}
                      className="bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                    >
                      {Object.entries(FIELD_TYPE_LABELS).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {(newFieldType === "single_choice" || newFieldType === "multiple_choice" || newFieldType === "dropdown") && (
                    <input
                      type="text"
                      placeholder="Comma-separated options (e.g. Red, Green, Blue)..."
                      value={newFieldOptions}
                      onChange={(e) => setNewFieldOptions(e.target.value)}
                      className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-xs text-background"
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newFieldRequired}
                        onChange={(e) => setNewFieldRequired(e.target.checked)}
                        className="rounded bg-card border-border"
                      />
                      Is Required Field
                    </label>

                    <button
                      onClick={() => {
                        if (!newFieldLabel.trim()) return;
                        const opts =
                          newFieldType === "single_choice" || newFieldType === "multiple_choice" || newFieldType === "dropdown"
                            ? newFieldOptions.split(",").map((s) => s.trim()).filter(Boolean)
                            : undefined;

                        addField(currentForm.id, {
                          label: newFieldLabel,
                          type: newFieldType,
                          isRequired: newFieldRequired,
                          options: opts,
                        });
                        setNewFieldLabel("");
                      }}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-lg text-xs font-semibold"
                    >
                      Add Field
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Conditional Rules & ActionMapping Setup */}
            <div className="lg:col-span-5 space-y-6">
              {/* Conditional Rules Box */}
              <div className="bg-background border border-border rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <Split className="w-5 h-5 text-amber-400" />
                    Conditional Logic Rules
                  </h3>
                  <span className="text-xs text-muted-foreground">{currentForm.conditionalRules.length} rules</span>
                </div>

                <div className="space-y-2">
                  {currentForm.conditionalRules.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-xs italic">
                      No conditional logic defined. Questions display unconditionally.
                    </div>
                  ) : (
                    currentForm.conditionalRules.map((rule) => {
                      const targetFld = currentForm.fields.find((f) => f.id === rule.targetFieldId);
                      const depFld = currentForm.fields.find((f) => f.id === rule.condition.dependsOnFieldId);
                      return (
                        <div key={rule.id} className="p-3 bg-card/60 border border-border/60 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-300">
                              IF [{depFld?.label}] {rule.condition.operator} "{rule.condition.value}"
                            </span>
                            <button
                              onClick={() => removeConditionalRule(currentForm.id, rule.id)}
                              className="text-muted-foreground hover:text-rose-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="text-foreground text-[11px]">
                            → THEN {rule.action.toUpperCase()} field [{targetFld?.label}]
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Add Rule Form */}
                {currentForm.fields.length >= 2 && (
                  <div className="pt-3 border-t border-border space-y-2 text-xs">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase">Create Conditional Rule</span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-[11px]">IF</span>
                        <select
                          value={ruleDependsField || currentForm.fields[0]?.id}
                          onChange={(e) => setRuleDependsField(e.target.value)}
                          className="bg-foreground border border-border rounded px-2 py-1 text-background text-xs flex-1"
                        >
                          {currentForm.fields.map((f) => (
                            <option key={f.id} value={f.id}>{f.label}</option>
                          ))}
                        </select>
                        <select
                          value={ruleOperator}
                          onChange={(e) => setRuleOperator(e.target.value as RuleOperator)}
                          className="bg-foreground border border-border rounded px-2 py-1 text-background text-xs"
                        >
                          <option value="equals">equals</option>
                          <option value="not_equals">not equals</option>
                          <option value="contains">contains</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        placeholder="Condition target value (e.g. Yes or Critical)..."
                        value={ruleValue}
                        onChange={(e) => setRuleValue(e.target.value)}
                        className="w-full bg-foreground border border-border rounded px-2.5 py-1 text-xs text-background"
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-[11px]">THEN</span>
                        <select
                          value={ruleAction}
                          onChange={(e) => setRuleAction(e.target.value as RuleAction)}
                          className="bg-foreground border border-border rounded px-2 py-1 text-background text-xs"
                        >
                          <option value="show">Show</option>
                          <option value="hide">Hide</option>
                          <option value="require">Require</option>
                        </select>
                        <select
                          value={ruleTargetField || currentForm.fields[1]?.id}
                          onChange={(e) => setRuleTargetField(e.target.value)}
                          className="bg-foreground border border-border rounded px-2 py-1 text-background text-xs flex-1"
                        >
                          {currentForm.fields.map((f) => (
                            <option key={f.id} value={f.id}>{f.label}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            if (!ruleValue.trim()) return;
                            addConditionalRule(currentForm.id, {
                              targetFieldId: ruleTargetField || currentForm.fields[1]?.id,
                              condition: {
                                dependsOnFieldId: ruleDependsField || currentForm.fields[0]?.id,
                                operator: ruleOperator,
                                value: ruleValue,
                              },
                              action: ruleAction,
                            });
                            setRuleValue("");
                          }}
                          className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded text-xs font-semibold"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE PREVIEW & RESPONDER VIEW */}
        {activeTab === "preview" && currentForm && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-background border border-border rounded-2xl p-8 shadow-xl space-y-6">
              <div className="border-b border-border pb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Interactive Live Form
                </span>
                <h2 className="text-2xl font-bold text-white mt-2">{currentForm.title}</h2>
                {currentForm.description && (
                  <p className="text-xs text-foreground mt-2 leading-relaxed">{currentForm.description}</p>
                )}
              </div>

              {submittedMessage && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{submittedMessage}</span>
                </div>
              )}

              <form onSubmit={handlePreviewSubmit} className="space-y-5 text-xs">
                {currentForm.fields
                  .filter((f) => visibleFieldIds.has(f.id))
                  .map((field) => (
                    <div key={field.id} className="space-y-1.5">
                      <label className="block text-foreground font-semibold">
                        {field.label}
                        {field.isRequired && <span className="text-rose-400 ml-1">*</span>}
                      </label>

                      {field.type === "short_text" && (
                        <input
                          type="text"
                          required={field.isRequired}
                          placeholder={field.placeholder || "Your answer..."}
                          value={previewAnswers[field.id] || ""}
                          onChange={(e) => setPreviewAnswers({ ...previewAnswers, [field.id]: e.target.value })}
                          className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                        />
                      )}

                      {field.type === "long_text" && (
                        <textarea
                          rows={3}
                          required={field.isRequired}
                          placeholder={field.placeholder || "Enter details..."}
                          value={previewAnswers[field.id] || ""}
                          onChange={(e) => setPreviewAnswers({ ...previewAnswers, [field.id]: e.target.value })}
                          className="w-full bg-foreground border border-border rounded-lg p-2.5 text-background"
                        />
                      )}

                      {field.type === "dropdown" && field.options && (
                        <select
                          required={field.isRequired}
                          value={previewAnswers[field.id] || ""}
                          onChange={(e) => setPreviewAnswers({ ...previewAnswers, [field.id]: e.target.value })}
                          className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                        >
                          <option value="">Select option...</option>
                          {field.options.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {field.type === "single_choice" && field.options && (
                        <div className="space-y-1.5 pt-1">
                          {field.options.map((opt, i) => (
                            <label key={i} className="flex items-center gap-2 text-foreground cursor-pointer">
                              <input
                                type="radio"
                                name={field.id}
                                value={opt}
                                checked={previewAnswers[field.id] === opt}
                                onChange={(e) => setPreviewAnswers({ ...previewAnswers, [field.id]: e.target.value })}
                                className="text-amber-600 bg-card border-border"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}

                      {field.type === "rating" && (
                        <div className="flex gap-2 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setPreviewAnswers({ ...previewAnswers, [field.id]: star })}
                              className={`w-9 h-9 rounded-lg font-bold border transition ${
                                previewAnswers[field.id] === star
                                  ? "bg-amber-600 border-amber-500 text-white"
                                  : "bg-foreground border-border text-muted-foreground hover:text-background"
                              }`}
                            >
                              ★ {star}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition shadow-lg shadow-amber-600/20"
                >
                  <Send className="w-4 h-4" />
                  Submit Response
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: RESPONSES LIST */}
        {activeTab === "responses" && currentForm && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">Responses Recorded ({currentResponses.length})</h2>

            <div className="space-y-3">
              {currentResponses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-xs italic">
                  No responses received yet for this form.
                </div>
              ) : (
                currentResponses.map((resp) => (
                  <div
                    key={resp.id}
                    className="p-4 rounded-xl bg-card/40 border border-border/60 space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{resp.submittedBy}</span>
                        <span className="text-muted-foreground">• {new Date(resp.submittedAt).toLocaleString()}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        resp.status === "processed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-rose-500/20 text-rose-400"
                      }`}>
                        {resp.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-border/80">
                      {resp.answers.map((ans, i) => {
                        const fld = currentForm.fields.find((f) => f.id === ans.fieldId);
                        return (
                          <div key={i} className="bg-background/60 p-2 rounded border border-border">
                            <span className="text-[11px] text-muted-foreground block font-medium">{fld?.label || ans.fieldId}:</span>
                            <span className="text-foreground font-semibold">{String(ans.value)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: ACTION MAPPINGS */}
        {activeTab === "mappings" && currentForm && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white">ActionMapping Integration Pipeline</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              When respondents submit forms, ActionMapping forwards structured answers into downstream applications
              (e.g. creating a Task in Task Manager #01 or a Record in Database #15) without duplicate data entry.
            </p>

            <div className="space-y-4">
              {currentForm.actionMappings.map((am) => (
                <div key={am.id} className="p-4 bg-background border border-border rounded-xl space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-400 text-sm">
                      Target: {am.targetApp} → {am.targetEntityType}
                    </span>
                    <span className="text-emerald-400 text-[11px] font-semibold">Active Pipeline</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] text-muted-foreground font-medium">Mapped Fields:</span>
                    {am.fieldMappings.map((fm, idx) => {
                      const fld = currentForm.fields.find((f) => f.id === fm.sourceFieldId);
                      return (
                        <div key={idx} className="flex items-center gap-2 bg-background p-2 rounded text-foreground font-mono text-[11px]">
                          <span>[{fld?.label || fm.sourceFieldId}]</span>
                          <span className="text-amber-400">➔</span>
                          <span className="text-cyan-300">{fm.targetField}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FAILED RESPONSES (RETRY QUEUE) */}
        {activeTab === "failed" && (
          <div className="bg-background border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-400" />
              <div>
                <h2 className="text-lg font-bold text-white">Failed Response Retry Queue</h2>
                <p className="text-xs text-muted-foreground">
                  Submissions that encountered downstream validation errors during ActionMapping execution.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {failedResponses.length === 0 ? (
                <div className="text-xs text-emerald-400 py-8 text-center bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                  ✓ No failed responses in queue. All submissions processed successfully.
                </div>
              ) : (
                failedResponses.map((r) => (
                  <div key={r.id} className="p-4 bg-rose-950/20 border border-rose-500/30 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Response #{r.id} ({r.submittedBy})</span>
                      <button
                        onClick={() => retryActionMapping(r.id)}
                        className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3 py-1 rounded text-xs font-semibold"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Retry Forwarding
                      </button>
                    </div>
                    <div className="text-rose-300 font-mono text-[11px]">Error: {r.failureReason}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Total Forms</span>
                <div className="text-2xl font-bold text-white mt-1">{stats.totalForms}</div>
                <div className="text-[11px] text-amber-400 mt-1">Structured collectors</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Total Responses</span>
                <div className="text-2xl font-bold text-amber-400 mt-1">{stats.totalResponses}</div>
                <div className="text-[11px] text-muted-foreground mt-1">{stats.processedResponses} forwarded</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Completion Rate</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">{stats.completionRate}%</div>
                <div className="text-[11px] text-muted-foreground mt-1">Processed successfully</div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Failed Mapping Rate</span>
                <div className="text-2xl font-bold text-rose-400 mt-1">{stats.failedMappingRate}%</div>
                <div className="text-[11px] text-muted-foreground mt-1">{stats.failedCount} in error queue</div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-xl p-6 text-xs text-muted-foreground space-y-2">
              <h3 className="font-bold text-white text-base">Data Entry Layer Architecture</h3>
              <p className="leading-relaxed">
                Forms (#22) is not a persistent data store. It serves as the front door for human input,
                enforcing conditional field logic and routing validated answers to Database (#15), Task Manager (#01),
                and People Manager (#35) via deterministic ActionMappings.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* New Form Modal */}
      {isNewFormModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Create New Data Collection Form</h3>

            <form onSubmit={handleCreateForm} className="space-y-4 text-xs">
              <div>
                <label className="block text-foreground mb-1 font-medium">Form Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vendor Registration Questionnaire"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg px-3 py-2 text-background"
                />
              </div>

              <div>
                <label className="block text-foreground mb-1 font-medium">Instructions</label>
                <textarea
                  rows={3}
                  placeholder="Explain what data is needed and how it will be processed..."
                  value={newFormDesc}
                  onChange={(e) => setNewFormDesc(e.target.value)}
                  className="w-full bg-foreground border border-border rounded-lg p-2.5 text-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsNewFormModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-card hover:bg-card text-foreground font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold"
                >
                  Create Form
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
