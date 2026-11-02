import { useState } from "react";
import { X, Copy, Calendar, CheckCircle2, FolderPlus, ArrowRight } from "lucide-react";
import { TASK_TEMPLATES, useTaskManager } from "../store";

interface TaskTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TaskTemplatesModal({ isOpen, onClose }: TaskTemplatesModalProps) {
  const { applyTemplate, projects } = useTaskManager();
  const [selectedTemplateId, setSelectedTemplateId] = useState(TASK_TEMPLATES[0].id);
  const [anchorDate, setAnchorDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [targetProjectId, setTargetProjectId] = useState<string>("");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentTemplate = TASK_TEMPLATES.find((t) => t.id === selectedTemplateId) || TASK_TEMPLATES[0];

  const handleApply = () => {
    applyTemplate(currentTemplate.id, anchorDate, targetProjectId || undefined);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-card border border-border/80 rounded-2xl shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <Copy className="size-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-foreground">
                Template Alur Kerja (Workflow Templates)
              </h3>
              <p className="text-xs text-muted-foreground">
                Terapkan template proyek siap pakai dengan kalkulasi tanggal relatif otomatis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Template Selector Tabs */}
        <div className="grid grid-cols-2 gap-3">
          {TASK_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplateId(tpl.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedTemplateId === tpl.id
                  ? "bg-primary/10 border-primary text-foreground shadow-sm"
                  : "bg-muted/20 border-border/60 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {tpl.category}
              </span>
              <h4 className="text-xs font-bold text-foreground mt-0.5">{tpl.name}</h4>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                {tpl.description}
              </p>
            </button>
          ))}
        </div>

        {/* Anchor Date & Project Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/50 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground flex items-center gap-1.5">
              <Calendar className="size-3.5 text-primary" />
              Tanggal Anchor Mulai (Anchor Date)
            </label>
            <input
              type="date"
              value={anchorDate}
              onChange={(e) => setAnchorDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground"
            />
            <p className="text-[10px] text-muted-foreground">
              Semua tanggal due task dihitung relatif terhadap tanggal ini.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-muted-foreground flex items-center gap-1.5">
              <FolderPlus className="size-3.5 text-primary" />
              Tautkan ke Proyek (Opsional)
            </label>
            <select
              value={targetProjectId}
              onChange={(e) => setTargetProjectId(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground"
            >
              <option value="">(Tanpa Proyek / Top Level)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tasks Preview */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">
            Preview Task yang Akan Dibuat ({currentTemplate.tasks.length} Task):
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
            {currentTemplate.tasks.map((task, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 rounded-lg bg-card border border-border/50 text-xs"
              >
                <div className="min-w-0 pr-2">
                  <span className="font-medium text-foreground truncate block">
                    {task.title}
                  </span>
                  {task.checklist && (
                    <span className="text-[10px] text-muted-foreground">
                      {task.checklist.length} checklist items
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 text-[10px]">
                  <span className="text-muted-foreground font-mono">
                    +{task.relativeDueDays} hari
                  </span>
                  <span className="px-1.5 py-0.5 rounded uppercase font-bold bg-muted">
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          {appliedSuccess ? (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="size-4" />
              Template berhasil diterapkan!
            </span>
          ) : (
            <span className="text-xs text-muted-foreground">
              Total {currentTemplate.tasks.length} task baru akan ditambahkan ke Task Manager.
            </span>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg"
            >
              Batal
            </button>
            <button
              onClick={handleApply}
              disabled={appliedSuccess}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow transition-colors flex items-center gap-1.5"
            >
              <span>Terapkan Template</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
