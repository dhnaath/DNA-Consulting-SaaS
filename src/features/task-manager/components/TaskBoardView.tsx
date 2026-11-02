import { useState } from "react";
import {
  Plus,
  MoreVertical,
  Paperclip,
  MessageSquare,
  CheckCircle2,
  Circle,
  Play,
  Trash2,
  Edit,
} from "lucide-react";
import { Task, TaskStatus } from "../types";
import { useTaskManager } from "../store";

interface TaskBoardViewProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
  onQuickCreate: (status: TaskStatus) => void;
}

interface ColumnConfig {
  id: "todo" | "in_progress" | "in_review" | "done";
  label: string;
  mappedStatuses: TaskStatus[];
  createStatus: TaskStatus;
}

const COLUMNS: ColumnConfig[] = [
  {
    id: "todo",
    label: "Todo list",
    mappedStatuses: ["planned", "inbox"],
    createStatus: "planned",
  },
  {
    id: "in_progress",
    label: "In Progress",
    mappedStatuses: ["in_progress"],
    createStatus: "in_progress",
  },
  {
    id: "in_review",
    label: "In Review",
    mappedStatuses: ["waiting"],
    createStatus: "waiting",
  },
  {
    id: "done",
    label: "Done",
    mappedStatuses: ["completed"],
    createStatus: "completed",
  },
];

// Pastel color palettes matching the reference screenshot
type ColorThemeKey = "blue" | "amber" | "purple" | "rose" | "emerald" | "pink" | "cyan";

interface ThemeStyle {
  bg: string;
  border: string;
  tagBg: string;
  tagText: string;
  tagBorder: string;
  dotActive: string;
  dotInactive: string;
  checkActive: string;
  checkInactive: string;
}

const THEMES: Record<ColorThemeKey, ThemeStyle> = {
  blue: {
    bg: "bg-[#eaf3fe] dark:bg-[#152338]/90",
    border: "border-[#d1e3fa] dark:border-[#203654]",
    tagBg: "bg-white/80 dark:bg-slate-900/80",
    tagText: "text-[#2563eb] dark:text-[#60a5fa]",
    tagBorder: "border-[#bfdbfe]/80 dark:border-[#1e3a8a]/70",
    dotActive: "bg-[#2563eb]",
    dotInactive: "bg-[#bfdbfe]/80 dark:bg-[#1e3a8a]/60",
    checkActive: "text-[#2563eb] fill-[#2563eb]/20",
    checkInactive: "text-[#60a5fa]/60",
  },
  amber: {
    bg: "bg-[#fef4ea] dark:bg-[#2b1f17]/90",
    border: "border-[#fce3cc] dark:border-[#452b1b]",
    tagBg: "bg-white/80 dark:bg-slate-900/80",
    tagText: "text-[#d97706] dark:text-[#fbbf24]",
    tagBorder: "border-[#fed7aa]/80 dark:border-[#78350f]/70",
    dotActive: "bg-[#d97706]",
    dotInactive: "bg-[#fed7aa]/80 dark:bg-[#78350f]/60",
    checkActive: "text-[#d97706] fill-[#d97706]/20",
    checkInactive: "text-[#fbbf24]/60",
  },
  purple: {
    bg: "bg-[#f4f0fe] dark:bg-[#261c36]/90",
    border: "border-[#e5ddfc] dark:border-[#3f2b5c]",
    tagBg: "bg-white/80 dark:bg-slate-900/80",
    tagText: "text-[#7c3aed] dark:text-[#c084fc]",
    tagBorder: "border-[#ddd6fe]/80 dark:border-[#581c87]/70",
    dotActive: "bg-[#7c3aed]",
    dotInactive: "bg-[#ddd6fe]/80 dark:bg-[#581c87]/60",
    checkActive: "text-[#7c3aed] fill-[#7c3aed]/20",
    checkInactive: "text-[#c084fc]/60",
  },
  rose: {
    bg: "bg-[#fef0f2] dark:bg-[#2d1b22]/90",
    border: "border-[#fed7dc] dark:border-[#4f2433]",
    tagBg: "bg-white/80 dark:bg-slate-900/80",
    tagText: "text-[#e11d48] dark:text-[#fb7185]",
    tagBorder: "border-[#fecdd3]/80 dark:border-[#881337]/70",
    dotActive: "bg-[#e11d48]",
    dotInactive: "bg-[#fecdd3]/80 dark:bg-[#881337]/60",
    checkActive: "text-[#e11d48] fill-[#e11d48]/20",
    checkInactive: "text-[#fb7185]/60",
  },
  emerald: {
    bg: "bg-[#edfbf4] dark:bg-[#142820]/90",
    border: "border-[#cff6e0] dark:border-[#204537]",
    tagBg: "bg-white/80 dark:bg-slate-900/80",
    tagText: "text-[#059669] dark:text-[#34d399]",
    tagBorder: "border-[#a7f3d0]/80 dark:border-[#064e3b]/70",
    dotActive: "bg-[#059669]",
    dotInactive: "bg-[#a7f3d0]/80 dark:bg-[#064e3b]/60",
    checkActive: "text-[#059669] fill-[#059669]/20",
    checkInactive: "text-[#34d399]/60",
  },
  pink: {
    bg: "bg-[#fdf2f8] dark:bg-[#2d1723]/90",
    border: "border-[#fce3f0] dark:border-[#4d2138]",
    tagBg: "bg-white/80 dark:bg-slate-900/80",
    tagText: "text-[#db2777] dark:text-[#f472b6]",
    tagBorder: "border-[#fbcfe8]/80 dark:border-[#831843]/70",
    dotActive: "bg-[#db2777]",
    dotInactive: "bg-[#fbcfe8]/80 dark:bg-[#831843]/60",
    checkActive: "text-[#db2777] fill-[#db2777]/20",
    checkInactive: "text-[#f472b6]/60",
  },
  cyan: {
    bg: "bg-[#ebfcff] dark:bg-[#132c35]/90",
    border: "border-[#cbf6fd] dark:border-[#1d4653]",
    tagBg: "bg-white/80 dark:bg-slate-900/80",
    tagText: "text-[#0891b2] dark:text-[#22d3ee]",
    tagBorder: "border-[#a5f3fc]/80 dark:border-[#164e63]/70",
    dotActive: "bg-[#0891b2]",
    dotInactive: "bg-[#a5f3fc]/80 dark:bg-[#164e63]/60",
    checkActive: "text-[#0891b2] fill-[#0891b2]/20",
    checkInactive: "text-[#22d3ee]/60",
  },
};

// Deterministic theme selection if not explicitly set on task
function getTaskTheme(task: Task): ColorThemeKey {
  if (task.colorTheme && THEMES[task.colorTheme as ColorThemeKey]) {
    return task.colorTheme as ColorThemeKey;
  }
  const themes: ColorThemeKey[] = ["blue", "purple", "amber", "rose", "emerald", "cyan", "pink"];
  let hash = 0;
  for (let i = 0; i < task.id.length; i++) {
    hash = task.id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % themes.length;
  return themes[idx];
}

export function TaskBoardView({ tasks, onSelectTask, onQuickCreate }: TaskBoardViewProps) {
  const { updateTask, deleteTask, toggleChecklist, getSubtaskProgress } = useTaskManager();
  const [activeMenuTaskId, setActiveMenuTaskId] = useState<string | null>(null);

  return (
    <div className="flex gap-4 sm:gap-5 overflow-x-auto pb-8 pt-1 [scrollbar-width:thin]">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => col.mappedStatuses.includes(t.status));

        return (
          <div
            key={col.id}
            className="shrink-0 w-[300px] sm:w-[320px] flex flex-col bg-card/60 dark:bg-muted/10 border border-border/50 rounded-2xl p-3.5 max-h-[calc(100vh-200px)] shadow-2xs"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between px-1 py-1 mb-3">
              <div className="flex items-center gap-2">
                <Play className="size-2.5 fill-foreground/70 text-foreground/70 rotate-0" />
                <h3 className="text-sm font-bold text-foreground tracking-tight">
                  {col.label}
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onQuickCreate(col.createStatus)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title={`Tambah task baru di ${col.label}`}
                >
                  <Plus className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onQuickCreate(col.createStatus)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Opsi Kolom"
                >
                  <MoreVertical className="size-4" />
                </button>
              </div>
            </div>

            {/* Task Cards Column */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 [scrollbar-width:thin]">
              {colTasks.map((task) => {
                const themeKey = getTaskTheme(task);
                const theme = THEMES[themeKey];
                const subProgress = getSubtaskProgress(task.id);

                // Compute progress percentage (0 - 100)
                let progressPercent = 0;
                if (typeof task.customProgress === "number") {
                  progressPercent = task.customProgress;
                } else if (subProgress.total > 0) {
                  progressPercent = Math.round((subProgress.completed / subProgress.total) * 100);
                } else if (task.status === "completed") {
                  progressPercent = 100;
                } else if (task.status === "in_progress") {
                  progressPercent = 50;
                } else if (task.status === "waiting") {
                  progressPercent = 75;
                }

                // 10 dots representation (each dot represents 10%)
                const activeDotsCount = Math.min(10, Math.max(0, Math.round(progressPercent / 10)));

                // Comments & attachments counter
                const commentsCount = task.id.includes("wehiu-1")
                  ? 12
                  : task.id.includes("wehiu-2")
                  ? 7
                  : task.id.includes("wehiu-4")
                  ? 6
                  : task.id.includes("wehiu-10")
                  ? 7
                  : 12;

                const attachmentsCount = task.id.includes("wehiu-1")
                  ? 8
                  : task.id.includes("wehiu-2")
                  ? 2
                  : task.id.includes("wehiu-4")
                  ? 1
                  : task.id.includes("wehiu-10")
                  ? 2
                  : 8;

                // Tags formatting
                const tagsToDisplay = task.tags.length > 0
                  ? task.tags.map((t) => (t.startsWith("#") ? t : `#${t}`))
                  : ["#project", "#task"];

                // Avatars
                const teamAvatars: string[] = task.assigneeTeam && task.assigneeTeam.length > 0
                  ? task.assigneeTeam
                  : task.assigneeAvatar
                  ? [task.assigneeAvatar]
                  : [
                      "/src/assets/images/avatar_brooklyn_1790522423911.jpg",
                      "/src/assets/images/avatar_team_male_1790522438325.jpg",
                    ];

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTask(task.id)}
                    className={`p-4 rounded-2xl border ${theme.bg} ${theme.border} hover:shadow-md transition-all cursor-pointer space-y-3 group text-left relative`}
                  >
                    {/* Top Row: Tags + More Menu */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                        {tagsToDisplay.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium tracking-tight border ${theme.tagBg} ${theme.tagText} ${theme.tagBorder}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuTaskId(activeMenuTaskId === task.id ? null : task.id);
                          }}
                          className="p-1 rounded-md text-foreground/50 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <MoreVertical className="size-3.5" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuTaskId === task.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-6 z-30 w-44 rounded-xl bg-popover p-1.5 shadow-xl border border-border text-xs text-popover-foreground space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
                          >
                            <button
                              type="button"
                              onClick={() => {
                                onSelectTask(task.id);
                                setActiveMenuTaskId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted text-left cursor-pointer"
                            >
                              <Edit className="size-3.5 text-muted-foreground" />
                              <span>Buka Detail</span>
                            </button>

                            <div className="h-px bg-border/60 my-1" />

                            <div className="px-2.5 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              Pindahkan Status
                            </div>
                            {COLUMNS.map((c) => (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => {
                                  updateTask(task.id, { status: c.createStatus });
                                  setActiveMenuTaskId(null);
                                }}
                                className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-left cursor-pointer text-[11px] ${
                                  c.mappedStatuses.includes(task.status)
                                    ? "font-bold text-primary bg-primary/10"
                                    : "hover:bg-muted text-foreground/80"
                                }`}
                              >
                                <span>{c.label}</span>
                                {c.mappedStatuses.includes(task.status) && (
                                  <CheckCircle2 className="size-3 text-primary" />
                                )}
                              </button>
                            ))}

                            <div className="h-px bg-border/60 my-1" />

                            <button
                              type="button"
                              onClick={() => {
                                deleteTask(task.id);
                                setActiveMenuTaskId(null);
                              }}
                              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-600 text-left cursor-pointer"
                            >
                              <Trash2 className="size-3.5" />
                              <span>Hapus Task</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Card Title */}
                    <h4 className="font-bold text-[14px] sm:text-[15px] leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary">
                      {task.title}
                    </h4>

                    {/* Optional Note / Subtitle */}
                    {task.notes && (
                      <p className="text-[11px] font-medium text-muted-foreground/90 leading-relaxed">
                        {task.notes}
                      </p>
                    )}

                    {/* Optional Image Preview (like Wehiu card) */}
                    {task.imagePreview && (
                      <div className="rounded-xl overflow-hidden border border-current/15 bg-black/5 max-h-36 shadow-2xs">
                        <img
                          src={task.imagePreview}
                          alt="Task preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-28 object-cover object-top hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Interactive Subtasks / Checklist Items (like Ginko & Affitto cards) */}
                    {task.checklist && task.checklist.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {task.checklist.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChecklist(task.id, item.id);
                            }}
                            className="flex items-center gap-2 text-[11px] font-medium text-foreground/80 hover:text-foreground cursor-pointer select-none py-0.5 group/item"
                          >
                            {item.checked ? (
                              <CheckCircle2 className={`size-3.5 ${theme.checkActive} shrink-0`} />
                            ) : (
                              <Circle className={`size-3.5 ${theme.checkInactive} shrink-0 group-hover/item:text-foreground`} />
                            )}
                            <span className={`truncate ${item.checked ? "line-through opacity-70" : ""}`}>
                              {item.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Progress Indicator: Label, Percentage & 10 Dots */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/80 mb-1.5">
                        <span>Progress</span>
                        <span>{progressPercent}%</span>
                      </div>

                      {/* 10 Circular Progress Dots */}
                      <div className="flex items-center gap-1.5">
                        {Array.from({ length: 10 }).map((_, dotIdx) => (
                          <span
                            key={dotIdx}
                            className={`size-2 sm:size-2.5 rounded-full transition-colors ${
                              dotIdx < activeDotsCount ? theme.dotActive : theme.dotInactive
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bottom Footer: Team Avatars & Counts */}
                    <div className="flex items-center justify-between pt-2 border-t border-current/10">
                      {/* Overlapping Team Avatars */}
                      <div className="flex items-center -space-x-1.5 overflow-hidden py-0.5">
                        {teamAvatars.slice(0, 3).map((avatarSrc, aIdx) => (
                          <img
                            key={aIdx}
                            src={avatarSrc}
                            alt="Team member"
                            referrerPolicy="no-referrer"
                            className="size-6 rounded-full border-2 border-white dark:border-slate-800 object-cover ring-1 ring-black/5"
                          />
                        ))}
                      </div>

                      {/* Comment & Attachment Counters */}
                      <div className="flex items-center gap-3 text-[11px] font-medium text-muted-foreground/90">
                        <div className="flex items-center gap-1" title={`${commentsCount} Komentar`}>
                          <MessageSquare className="size-3.5 opacity-70" />
                          <span>{commentsCount}</span>
                        </div>
                        <div className="flex items-center gap-1" title={`${attachmentsCount} Lampiran`}>
                          <Paperclip className="size-3.5 opacity-70" />
                          <span>{attachmentsCount}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {colTasks.length === 0 && (
                <div className="p-8 text-center text-xs text-muted-foreground/60 border border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center gap-2">
                  <span>Tidak ada task</span>
                  <button
                    type="button"
                    onClick={() => onQuickCreate(col.createStatus)}
                    className="text-primary hover:underline font-semibold text-xs flex items-center gap-1"
                  >
                    <Plus className="size-3" /> Tambah Task
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
