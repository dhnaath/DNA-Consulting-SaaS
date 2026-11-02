import { useState, useMemo } from "react";
import {
  ArrowUpDown,
  Clock,
  FolderOpen,
  User,
  Trash2,
} from "lucide-react";
import { Task, TaskPriority, TaskStatus } from "../types";
import { useTaskManager } from "../store";

interface TaskTableViewProps {
  tasks: Task[];
  onSelectTask: (taskId: string) => void;
}

export function TaskTableView({ tasks, onSelectTask }: TaskTableViewProps) {
  const { updateTask, projects, deleteTask } = useTaskManager();
  const [sortField, setSortField] = useState<keyof Task>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [tasks, sortField, sortOrder]);

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="border border-border/70 rounded-2xl bg-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/30 border-b border-border/60 text-muted-foreground uppercase tracking-wider font-semibold">
            <tr>
              <th
                onClick={() => handleSort("title")}
                className="p-3.5 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Judul Task</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="p-3.5 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Status</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort("priority")}
                className="p-3.5 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Prioritas</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>
              <th className="p-3.5">Proyek</th>
              <th
                onClick={() => handleSort("dueAt")}
                className="p-3.5 cursor-pointer hover:text-foreground transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Due Date</span>
                  <ArrowUpDown className="size-3" />
                </div>
              </th>
              <th className="p-3.5">Penanggung Jawab</th>
              <th className="p-3.5 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {sortedTasks.map((task) => {
              const project = projects.find((p) => p.id === task.projectId);

              return (
                <tr
                  key={task.id}
                  className="hover:bg-muted/30 transition-colors group cursor-pointer"
                  onClick={(e) => {
                    const target = e.target as HTMLElement;
                    if (target.closest("select") || target.closest("button")) return;
                    onSelectTask(task.id);
                  }}
                >
                  {/* Title */}
                  <td className="p-3.5 font-medium text-foreground max-w-xs truncate">
                    <span className="group-hover:text-primary transition-colors">
                      {task.title}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="p-3.5">
                    <select
                      value={task.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateTask(task.id, { status: e.target.value as TaskStatus })
                      }
                      className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground cursor-pointer"
                    >
                      <option value="inbox">Inbox</option>
                      <option value="planned">Planned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="waiting">Waiting</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* Priority Dropdown */}
                  <td className="p-3.5">
                    <select
                      value={task.priority}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) =>
                        updateTask(task.id, { priority: e.target.value as TaskPriority })
                      }
                      className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground cursor-pointer"
                    >
                      <option value="none">None</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </td>

                  {/* Project */}
                  <td className="p-3.5 text-muted-foreground truncate max-w-[140px]">
                    {project ? (
                      <span className="flex items-center gap-1.5">
                        <FolderOpen className="size-3 text-primary shrink-0" />
                        <span className="truncate">{project.name}</span>
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Due Date */}
                  <td className="p-3.5 text-muted-foreground">
                    {task.dueAt ? (
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3 text-muted-foreground" />
                        <span>{new Date(task.dueAt).toLocaleDateString()}</span>
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Assignee */}
                  <td className="p-3.5 text-muted-foreground">
                    {task.assigneeName ? (
                      <span className="flex items-center gap-1.5">
                        <User className="size-3 text-muted-foreground" />
                        <span>{task.assigneeName}</span>
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTask(task.id, false);
                      }}
                      className="p-1.5 text-muted-foreground hover:text-rose-500 rounded hover:bg-muted transition-colors"
                      title="Hapus task"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
