import { useState, useMemo } from "react";
import {
  X,
  Calendar,
  Clock,
  Tag as TagIcon,
  CheckSquare,
  Paperclip,
  MessageSquare,
  Activity as ActivityIcon,
  AlertTriangle,
  FolderOpen,
  Trash2,
  Copy,
  Archive,
  RefreshCw,
  GitBranch,
  Bell,
  CornerDownRight,
  Send,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import {
  TaskPriority,
  TaskStatus,
  DependencyType,
  RecurrenceType,
} from "../types";
import { useTaskManager } from "../store";

interface TaskDetailModalProps {
  taskId: string | null;
  onClose: () => void;
  onSelectTask: (taskId: string) => void;
}

export function TaskDetailModal({ taskId, onClose, onSelectTask }: TaskDetailModalProps) {
  const {
    tasks,
    projects,
    lists,
    tags,
    activities,
    comments,
    updateTask,
    completeTask,
    reopenTask,
    archiveTask,
    unarchiveTask,
    deleteTask,
    duplicateTask,
    addDependency,
    removeDependency,
    toggleChecklist,
    addChecklistItem,
    deleteChecklistItem,
    addComment,
    addReminder,
    removeReminder,
    addAttachment,
    createTask,
    getSubtaskProgress,
  } = useTaskManager();

  const [activeTab, setActiveTab] = useState<"details" | "subtasks" | "dependencies" | "activity" | "comments">("details");
  const [newChecklistLabel, setNewChecklistLabel] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newCommentContent, setNewCommentContent] = useState("");
  const [newAttachmentName, setNewAttachmentName] = useState("");
  const [newAttachmentUrl, setNewAttachmentUrl] = useState("");
  const [depTargetId, setDepTargetId] = useState("");
  const [depType, setDepType] = useState<DependencyType>("finish_to_start");
  const [depError, setDepError] = useState<string | null>(null);
  const [reminderMinutes, setReminderMinutes] = useState(60);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const task = useMemo(() => tasks.find((t) => t.id === taskId), [tasks, taskId]);
  const subtasks = useMemo(() => tasks.filter((t) => t.parentTaskId === taskId && t.status !== "archived"), [tasks, taskId]);
  const parentTask = useMemo(() => (task?.parentTaskId ? tasks.find((t) => t.id === task.parentTaskId) : null), [tasks, task]);
  const taskActivities = useMemo(() => activities.filter((a) => a.taskId === taskId), [activities, taskId]);
  const taskComments = useMemo(() => comments.filter((c) => c.taskId === taskId), [comments, taskId]);
  const progress = useMemo(() => (taskId ? getSubtaskProgress(taskId) : { total: 0, completed: 0, percentage: 0 }), [taskId, getSubtaskProgress]);

  if (!task) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    createTask({
      title: newSubtaskTitle.trim(),
      parentTaskId: task.id,
      projectId: task.projectId,
      folderId: task.folderId,
      status: "inbox",
      priority: task.priority,
    });
    setNewSubtaskTitle("");
  };

  const handleAddDependency = () => {
    if (!depTargetId) return;
    setDepError(null);
    const result = addDependency(task.id, depTargetId, depType);
    if (!result.success) {
      setDepError(result.error || "Gagal menambahkan dependency");
    } else {
      setDepTargetId("");
    }
  };

  const handleAddReminder = () => {
    addReminder(task.id, {
      type: "before_due",
      offsetMinutes: reminderMinutes,
      status: "pending",
    });
  };

  const handleAddAttachment = () => {
    if (!newAttachmentName.trim()) return;
    addAttachment(task.id, {
      name: newAttachmentName.trim(),
      url: newAttachmentUrl.trim() || "#",
      type: "link",
    });
    setNewAttachmentName("");
    setNewAttachmentUrl("");
  };

  const handleSendComment = () => {
    if (!newCommentContent.trim()) return;
    addComment(task.id, newCommentContent);
    setNewCommentContent("");
  };

  // Status Badge Styling
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "inbox":
        return "bg-muted-foreground/30/10 text-muted-foreground dark:text-foreground border-border/20";
      case "planned":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "in_progress":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "waiting":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
      case "completed":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "cancelled":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "archived":
        return "bg-muted-foreground/30/10 text-muted-foreground dark:text-muted-foreground border-border/20";
    }
  };

  // Priority Styling
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "urgent":
        return "bg-rose-600 text-white";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-blue-500 text-white";
      case "low":
        return "bg-emerald-500 text-white";
      case "none":
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-card border border-border/70 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-3">
            {parentTask && (
              <button
                onClick={() => onSelectTask(parentTask.id)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground font-medium transition-colors bg-muted/50 px-2.5 py-1 rounded-md"
              >
                <CornerDownRight className="size-3.5" />
                <span>Parent: {parentTask.title}</span>
              </button>
            )}
            <span
              className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${getStatusColor(
                task.status
              )}`}
            >
              {task.status.replace("_", " ")}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-bold uppercase ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {task.status === "completed" ? (
              <button
                onClick={() => reopenTask(task.id)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-medium transition-colors"
                title="Buka kembali task"
              >
                <RefreshCw className="size-3.5" />
                Reopen
              </button>
            ) : (
              <button
                onClick={() => completeTask(task.id)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm transition-colors"
                title="Tandai task selesai"
              >
                <CheckSquare className="size-3.5" />
                Selesaikan
              </button>
            )}

            <button
              onClick={() => duplicateTask(task.id)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              title="Duplikasi task"
            >
              <Copy className="size-4" />
            </button>

            {task.status === "archived" ? (
              <button
                onClick={() => unarchiveTask(task.id)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                title="Keluarkan dari arsip"
              >
                <Archive className="size-4 text-primary" />
              </button>
            ) : (
              <button
                onClick={() => archiveTask(task.id)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                title="Arsipkan task"
              >
                <Archive className="size-4" />
              </button>
            )}

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
              title="Hapus task"
            >
              <Trash2 className="size-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors ml-2"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Alert */}
        {showDeleteConfirm && (
          <div className="bg-rose-500/10 border-b border-rose-500/20 px-6 py-3 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 shrink-0 text-rose-500" />
              <span>
                Hapus task ini secara permanen?{" "}
                {subtasks.length > 0 && `(Memiliki ${subtasks.length} subtask)`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  deleteTask(task.id, true);
                  onClose();
                }}
                className="px-2.5 py-1 rounded bg-rose-600 text-white font-medium hover:bg-rose-700 transition-colors"
              >
                Hapus Semua Anak
              </button>
              {subtasks.length > 0 && (
                <button
                  onClick={() => {
                    deleteTask(task.id, false);
                    onClose();
                  }}
                  className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-700 dark:text-rose-300 font-medium hover:bg-rose-500/30 transition-colors"
                >
                  Naikkan Subtask
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 text-muted-foreground hover:text-foreground"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 border-b border-border/50 bg-background/50 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab("details")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "details"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderOpen className="size-3.5" />
            Detail & Jadwal
          </button>
          <button
            onClick={() => setActiveTab("subtasks")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "subtasks"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <CornerDownRight className="size-3.5" />
            Subtask ({subtasks.length})
            {progress.total > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold">
                {progress.percentage}%
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("dependencies")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "dependencies"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitBranch className="size-3.5" />
            Dependencies ({task.dependencies.length})
          </button>
          <button
            onClick={() => setActiveTab("comments")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "comments"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="size-3.5" />
            Komentar ({taskComments.length})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "activity"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ActivityIcon className="size-3.5" />
            Riwayat Aktivitas ({taskActivities.length})
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Title Input (Always Editable) */}
          <div>
            <input
              type="text"
              value={task.title}
              onChange={(e) => updateTask(task.id, { title: e.target.value })}
              className="w-full text-xl sm:text-2xl font-bold bg-transparent border-0 focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground"
              placeholder="Judul task..."
            />
          </div>

          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left 2 Cols: Description, Checklist, Attachments */}
              <div className="md:col-span-2 space-y-6">
                {/* Description */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Deskripsi / Ruang Lingkup
                  </label>
                  <textarea
                    rows={4}
                    value={task.description || ""}
                    onChange={(e) => updateTask(task.id, { description: e.target.value })}
                    className="w-full rounded-xl border border-border/80 bg-background/50 p-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed resize-none"
                    placeholder="Tuliskan deskripsi lengkap, konteks eksekutif, atau tautan acuan..."
                  />
                </div>

                {/* Checklist (Rapid sub-items without being full subtasks) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <CheckSquare className="size-3.5 text-primary" />
                      Checklist Cepat ({task.checklist.filter((c) => c.checked).length}/
                      {task.checklist.length})
                    </label>
                  </div>

                  <div className="space-y-1.5">
                    {task.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 transition-colors"
                      >
                        <label className="flex items-center gap-2.5 flex-1 cursor-pointer min-w-0">
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => toggleChecklist(task.id, item.id)}
                            className="rounded border-border text-primary focus:ring-primary size-4 cursor-pointer"
                          />
                          <span
                            className={`text-sm truncate ${
                              item.checked ? "line-through text-muted-foreground" : "text-foreground"
                            }`}
                          >
                            {item.label}
                          </span>
                        </label>
                        <button
                          onClick={() => deleteChecklistItem(task.id, item.id)}
                          className="p-1 text-muted-foreground hover:text-rose-500 rounded transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    ))}

                    {/* Add Checklist Item */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="text"
                        value={newChecklistLabel}
                        onChange={(e) => setNewChecklistLabel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addChecklistItem(task.id, newChecklistLabel);
                            setNewChecklistLabel("");
                          }
                        }}
                        placeholder="Tambah item checklist baru lalu tekan Enter..."
                        className="flex-1 text-xs rounded-lg border border-border/70 bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <button
                        onClick={() => {
                          addChecklistItem(task.id, newChecklistLabel);
                          setNewChecklistLabel("");
                        }}
                        className="px-3 py-2 text-xs rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors shrink-0"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                </div>

                {/* Attachments Section */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Paperclip className="size-3.5 text-primary" />
                    Lampiran & Tautan ({task.attachments.length})
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {task.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/20 text-xs"
                      >
                        <div className="flex items-center gap-2 truncate pr-2">
                          <Paperclip className="size-3.5 text-primary shrink-0" />
                          <span className="font-medium text-foreground truncate">{att.name}</span>
                        </div>
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 shrink-0"
                        >
                          Buka <ExternalLink className="size-3" />
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-xs pt-1">
                    <input
                      type="text"
                      value={newAttachmentName}
                      onChange={(e) => setNewAttachmentName(e.target.value)}
                      placeholder="Nama berkas (mis: Dokumen_Klien.pdf)"
                      className="flex-1 rounded-lg border border-border/70 bg-background px-3 py-1.5"
                    />
                    <input
                      type="text"
                      value={newAttachmentUrl}
                      onChange={(e) => setNewAttachmentUrl(e.target.value)}
                      placeholder="URL / Tautan..."
                      className="flex-1 rounded-lg border border-border/70 bg-background px-3 py-1.5"
                    />
                    <button
                      onClick={handleAddAttachment}
                      className="px-3 py-1.5 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors shrink-0"
                    >
                      Lampirkan
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Meta Attributes & Schedule */}
              <div className="space-y-5 bg-muted/15 p-4 rounded-xl border border-border/50 text-xs">
                {/* Status Selection */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground uppercase">Status</label>
                  <select
                    value={task.status}
                    onChange={(e) => updateTask(task.id, { status: e.target.value as TaskStatus })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs font-medium text-foreground"
                  >
                    <option value="inbox">Inbox (Belum Diolah)</option>
                    <option value="planned">Planned (Terencana)</option>
                    <option value="in_progress">In Progress (Sedang Dikerjakan)</option>
                    <option value="waiting">Waiting (Menunggu / Terhambat)</option>
                    <option value="completed">Completed (Selesai)</option>
                    <option value="cancelled">Cancelled (Dibatalkan)</option>
                    <option value="archived">Archived (Diarsipkan)</option>
                  </select>
                </div>

                {/* Priority Selection */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground uppercase">Prioritas</label>
                  <select
                    value={task.priority}
                    onChange={(e) => updateTask(task.id, { priority: e.target.value as TaskPriority })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs font-medium text-foreground"
                  >
                    <option value="none">None (Tanpa Prioritas)</option>
                    <option value="low">Low (Rendah)</option>
                    <option value="medium">Medium (Sedang)</option>
                    <option value="high">High (Tinggi)</option>
                    <option value="urgent">Urgent (Mendesak / Darurat)</option>
                  </select>
                </div>

                {/* Project Selection */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground uppercase">Proyek</label>
                  <select
                    value={task.projectId || ""}
                    onChange={(e) => updateTask(task.id, { projectId: e.target.value || undefined })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs font-medium text-foreground"
                  >
                    <option value="">Tanpa Proyek</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* List Selection */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground uppercase">List Grup</label>
                  <select
                    value={task.listId || ""}
                    onChange={(e) => updateTask(task.id, { listId: e.target.value || undefined })}
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs font-medium text-foreground"
                  >
                    <option value="">Tanpa List</option>
                    {lists.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assignee */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-muted-foreground uppercase">Penanggung Jawab</label>
                  <input
                    type="text"
                    value={task.assigneeName || ""}
                    onChange={(e) => updateTask(task.id, { assigneeName: e.target.value })}
                    placeholder="Nama assignee / konsultan..."
                    className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground"
                  />
                </div>

                {/* Due Date & Start Date */}
                <div className="space-y-2 pt-2 border-t border-border/40">
                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground flex items-center gap-1">
                      <Calendar className="size-3.5 text-primary" /> Start Date
                    </label>
                    <input
                      type="datetime-local"
                      value={task.startAt ? task.startAt.substring(0, 16) : ""}
                      onChange={(e) =>
                        updateTask(task.id, {
                          startAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background p-1.5 text-xs text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3.5 text-rose-500" /> Due Date (Batas Waktu)
                    </label>
                    <input
                      type="datetime-local"
                      value={task.dueAt ? task.dueAt.substring(0, 16) : ""}
                      onChange={(e) =>
                        updateTask(task.id, {
                          dueAt: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                        })
                      }
                      className="w-full rounded-lg border border-border bg-background p-1.5 text-xs text-foreground"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-muted-foreground">Estimasi Durasi (Menit)</label>
                    <input
                      type="number"
                      value={task.duration || ""}
                      onChange={(e) =>
                        updateTask(task.id, { duration: e.target.value ? parseInt(e.target.value, 10) : undefined })
                      }
                      placeholder="e.g. 60"
                      className="w-full rounded-lg border border-border bg-background p-1.5 text-xs text-foreground"
                    />
                  </div>
                </div>

                {/* Recurrence Setup */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <label className="font-semibold text-muted-foreground flex items-center gap-1">
                    <RefreshCw className="size-3.5 text-primary" /> Aturan Berulang (Recurrence)
                  </label>
                  <select
                    value={task.recurrence?.type || "none"}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "none") {
                        updateTask(task.id, { recurrence: undefined });
                      } else {
                        updateTask(task.id, {
                          recurrence: {
                            type: val as RecurrenceType,
                            interval: 1,
                          },
                        });
                      }
                    }}
                    className="w-full rounded-lg border border-border bg-background p-1.5 text-xs font-medium text-foreground"
                  >
                    <option value="none">Tidak Berulang</option>
                    <option value="daily">Setiap Hari (Daily)</option>
                    <option value="weekly">Setiap Minggu (Weekly)</option>
                    <option value="monthly">Setiap Bulan (Monthly)</option>
                    <option value="yearly">Setiap Tahun (Yearly)</option>
                    <option value="after_completion">Setelah Selesai (After Completion)</option>
                  </select>
                </div>

                {/* Reminders Setup */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <label className="font-semibold text-muted-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Bell className="size-3.5 text-primary" /> Pengingat (Reminder)
                    </span>
                  </label>

                  {task.reminders.length > 0 && (
                    <div className="space-y-1">
                      {task.reminders.map((rem) => (
                        <div
                          key={rem.id}
                          className="flex items-center justify-between p-1.5 bg-background rounded border border-border text-[11px]"
                        >
                          <span>{rem.offsetMinutes ? `${rem.offsetMinutes} mnt sebelum` : "Sesuai Jadwal"}</span>
                          <button
                            onClick={() => removeReminder(task.id, rem.id)}
                            className="text-muted-foreground hover:text-rose-500"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-1 mt-1">
                    <select
                      value={reminderMinutes}
                      onChange={(e) => setReminderMinutes(parseInt(e.target.value, 10))}
                      className="flex-1 rounded border border-border bg-background p-1 text-[11px]"
                    >
                      <option value={15}>15 menit sebelum</option>
                      <option value={60}>1 jam sebelum</option>
                      <option value={1440}>1 hari sebelum</option>
                    </select>
                    <button
                      onClick={handleAddReminder}
                      className="px-2 py-1 bg-muted hover:bg-muted/80 rounded font-medium text-[11px]"
                    >
                      + Set
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1.5 pt-2 border-t border-border/40">
                  <label className="font-semibold text-muted-foreground flex items-center gap-1">
                    <TagIcon className="size-3.5 text-primary" /> Tag Label
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((tg) => {
                      const isSelected = task.tags.includes(tg.id);
                      return (
                        <button
                          key={tg.id}
                          onClick={() => {
                            const newTags = isSelected
                              ? task.tags.filter((t) => t !== tg.id)
                              : [...task.tags, tg.id];
                            updateTask(task.id, { tags: newTags });
                          }}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                            isSelected
                              ? "bg-primary text-white border-primary"
                              : "bg-background text-muted-foreground border-border hover:border-foreground/30"
                          }`}
                        >
                          {tg.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subtasks Tab (Nested subtasks with progress tracking) */}
          {activeTab === "subtasks" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    Progress Rollup Subtask
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    parent.progress = completed_subtasks / total_subtasks
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {progress.completed}/{progress.total} ({progress.percentage}%)
                  </span>
                </div>
              </div>

              {/* Subtasks List */}
              <div className="space-y-2">
                {subtasks.length === 0 ? (
                  <p className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada subtask pada unit kerja ini.
                  </p>
                ) : (
                  subtasks.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-all group"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <input
                          type="checkbox"
                          checked={st.status === "completed"}
                          onChange={() => {
                            if (st.status === "completed") {
                              reopenTask(st.id);
                            } else {
                              completeTask(st.id);
                            }
                          }}
                          className="size-4 rounded border-border text-primary cursor-pointer"
                        />
                        <button
                          onClick={() => onSelectTask(st.id)}
                          className={`text-sm text-left truncate font-medium hover:text-primary transition-colors ${
                            st.status === "completed"
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {st.title}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getPriorityColor(
                            st.priority
                          )}`}
                        >
                          {st.priority}
                        </span>
                        <button
                          onClick={() => onSelectTask(st.id)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded"
                          title="Buka detail subtask"
                        >
                          <ChevronRight className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Subtask */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddSubtask();
                  }}
                  placeholder="Ketik judul subtask baru lalu tekan Enter..."
                  className="flex-1 text-xs rounded-xl border border-border/70 bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-4 py-2.5 text-xs rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                >
                  Tambah Subtask
                </button>
              </div>
            </div>
          )}

          {/* Dependencies Tab (Relasi Urutan & Circular Detection) */}
          {activeTab === "dependencies" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <p className="font-semibold flex items-center gap-1.5">
                  <GitBranch className="size-4 text-blue-500" />
                  Prinsip Urutan & Dependency (Task A ──▶ Task B)
                </p>
                <p className="leading-relaxed opacity-90">
                  Sistem secara otomatis mendeteksi relasi sirkular (A → B → A) dan menolaknya demi konsistensi data Gantt timeline.
                </p>
              </div>

              {depError && (
                <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="size-4 shrink-0" />
                  <span>{depError}</span>
                </div>
              )}

              {/* Current Dependencies */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase">
                  Tergantung Pada Task (Depends On):
                </h4>
                {task.dependencies.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">
                    Belum ada dependency. Task ini dapat dikerjakan secara independen.
                  </p>
                ) : (
                  task.dependencies.map((dep) => {
                    const target = tasks.find((t) => t.id === dep.dependsOnTaskId);
                    return (
                      <div
                        key={dep.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-border bg-card text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-muted font-mono text-[10px]">
                            {dep.type.replace(/_/g, " ")}
                          </span>
                          <span className="font-medium text-foreground">
                            {target?.title || "Task tidak dikenal"}
                          </span>
                          {target?.status !== "completed" && (
                            <span className="text-[10px] text-amber-500 font-medium">
                              (Belum selesai - disarankan Waiting)
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeDependency(task.id, dep.id)}
                          className="p-1 text-muted-foreground hover:text-rose-500"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Add Dependency Input */}
              <div className="pt-3 border-t border-border/50 space-y-2">
                <h4 className="text-xs font-semibold text-foreground">
                  Tambah Relasi Dependency:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <select
                    value={depTargetId}
                    onChange={(e) => setDepTargetId(e.target.value)}
                    className="sm:col-span-2 rounded-lg border border-border bg-background p-2"
                  >
                    <option value="">Pilih Task Pendahulu...</option>
                    {tasks
                      .filter((t) => t.id !== task.id && t.status !== "archived")
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                  </select>
                  <select
                    value={depType}
                    onChange={(e) => setDepType(e.target.value as DependencyType)}
                    className="rounded-lg border border-border bg-background p-2"
                  >
                    <option value="finish_to_start">Finish → Start (Biasa)</option>
                    <option value="start_to_start">Start → Start</option>
                    <option value="finish_to_finish">Finish → Finish</option>
                    <option value="blocked_by">Blocked By</option>
                    <option value="blocks">Blocks</option>
                  </select>
                </div>
                <button
                  onClick={handleAddDependency}
                  className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Tautkan Dependency
                </button>
              </div>
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === "comments" && (
            <div className="space-y-4">
              <div className="space-y-3">
                {taskComments.length === 0 ? (
                  <p className="text-center py-8 text-xs text-muted-foreground">
                    Belum ada komentar atau diskusi pada task ini.
                  </p>
                ) : (
                  taskComments.map((com) => (
                    <div
                      key={com.id}
                      className="p-3 rounded-xl border border-border/60 bg-muted/20 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{com.userName}</span>
                        <span>{new Date(com.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                        {com.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <input
                  type="text"
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendComment();
                  }}
                  placeholder="Tulis catatan atau komentar baru..."
                  className="flex-1 text-xs rounded-xl border border-border/70 bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleSendComment}
                  className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Activity History Tab (Append-only audit log) */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground mb-3">
                Log historis append-only: tidak dapat diubah atau dihapus, menjaga audit trail konsultan.
              </p>
              {taskActivities.length === 0 ? (
                <p className="text-center py-8 text-xs text-muted-foreground">
                  Belum ada log aktivitas untuk task ini.
                </p>
              ) : (
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {taskActivities.map((act) => (
                    <div key={act.id} className="relative text-xs">
                      <div className="absolute -left-6 top-1 size-2.5 rounded-full bg-primary ring-4 ring-card" />
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{act.type}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(act.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {act.fieldChanged && (
                        <p className="text-muted-foreground mt-0.5 text-[11px]">
                          {act.fieldChanged}:{" "}
                          {act.oldValue && (
                            <span className="line-through opacity-70 mr-1">{act.oldValue}</span>
                          )}
                          <span className="font-medium text-foreground">{act.newValue}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
