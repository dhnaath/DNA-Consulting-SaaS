import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Board,
  Column,
  CardPosition,
  CardMovementLog,
  SwimlaneBy,
} from "./types";
import { Task } from "../task-manager/types";
import { getRaw, setRaw } from "../../core/rawStorage";

const KANBAN_STORAGE_KEY = "aio_kanban_board_data_v1";
const TASK_STORAGE_KEY = "aio_task_manager_data_v1";

interface KanbanState {
  boards: Board[];
  activeBoardId: string;
  positions: CardPosition[];
  logs: CardMovementLog[];
}

const DEFAULT_COLUMNS: Column[] = [
  { id: "col-backlog", boardId: "board-main", name: "Backlog / Inbox", order: 1, mappedStatus: "inbox", wipLimit: null, color: "#94a3b8" },
  { id: "col-todo", boardId: "board-main", name: "To Do / Terencana", order: 2, mappedStatus: "planned", wipLimit: 8, color: "#3b82f6" },
  { id: "col-progress", boardId: "board-main", name: "In Progress", order: 3, mappedStatus: "in_progress", wipLimit: 3, color: "#f59e0b" },
  { id: "col-review", boardId: "board-main", name: "In Review / Waiting", order: 4, mappedStatus: "waiting", wipLimit: 2, color: "#8b5cf6" },
  { id: "col-done", boardId: "board-main", name: "Done", order: 5, mappedStatus: "completed", wipLimit: null, color: "#10b981" },
];

const DEFAULT_BOARDS: Board[] = [
  {
    id: "board-main",
    name: "Alur Kerja Konsultasi Utama",
    columns: DEFAULT_COLUMNS,
    swimlaneBy: "none",
    createdAt: new Date().toISOString(),
  },
];

export function useKanbanBoard() {
  const [state, setState] = useState<KanbanState>(() => {
    try {
      const saved = getRaw(KANBAN_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load kanban state", e);
    }
    return {
      boards: DEFAULT_BOARDS,
      activeBoardId: "board-main",
      positions: [],
      logs: [],
    };
  });

  // Read tasks from Task Manager
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = getRaw(TASK_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return parsed.tasks || [];
      }
    } catch (e) {
      console.error("Failed to load tasks in kanban", e);
    }
    return [];
  });

  useEffect(() => {
    try {
      setRaw(KANBAN_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist kanban state", e);
    }
  }, [state]);

  // Synchronize on cross-app events
  useEffect(() => {
    const handleSync = () => {
      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.tasks) setTasks(parsed.tasks);
        }
      } catch (e) {
        console.error("Error reading tasks in kanban", e);
      }
    };

    window.addEventListener("storage", handleSync);
    window.addEventListener("aio_data_updated", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("aio_data_updated", handleSync);
    };
  }, []);

  const notifyChange = useCallback(() => {
    window.dispatchEvent(new Event("aio_data_updated"));
  }, []);

  const activeBoard = useMemo(() => {
    return state.boards.find((b) => b.id === state.activeBoardId) || state.boards[0];
  }, [state.boards, state.activeBoardId]);

  // Map tasks to columns based on column.mappedStatus or custom position
  const columnTaskMap = useMemo(() => {
    const map: Record<string, Task[]> = {};
    activeBoard.columns.forEach((col) => {
      map[col.id] = [];
    });

    tasks.forEach((t) => {
      // Find matching column
      const matchedCol = activeBoard.columns.find((c) => c.mappedStatus === t.status);
      if (matchedCol) {
        map[matchedCol.id].push(t);
      } else if (activeBoard.columns[0]) {
        map[activeBoard.columns[0].id].push(t);
      }
    });

    return map;
  }, [tasks, activeBoard]);

  // MOVE CARD & STATUS SYNC (§4.2 & §13)
  const moveCard = useCallback(
    (taskId: string, targetColumnId: string) => {
      const targetCol = activeBoard.columns.find((c) => c.id === targetColumnId);
      if (!targetCol) return;

      const currentCount = (columnTaskMap[targetColumnId] || []).length;

      // WIP Limit check (§4.2)
      if (targetCol.wipLimit !== null && currentCount >= targetCol.wipLimit) {
        const proceed = confirm(
          `Peringatan: Kolom "${targetCol.name}" sudah mencapai batas WIP limit (${targetCol.wipLimit} tugas). Lanjutkan tetap memindahkan?`
        );
        if (!proceed) return;
      }

      // Log movement (§7)
      const currentTask = tasks.find((t) => t.id === taskId);
      const currentCol = activeBoard.columns.find((c) => c.mappedStatus === currentTask?.status);

      const newLog: CardMovementLog = {
        id: "mov-" + Date.now().toString(36),
        boardId: activeBoard.id,
        taskId,
        fromColumnId: currentCol ? currentCol.id : "unknown",
        toColumnId: targetColumnId,
        movedBy: "Konsultan",
        movedAt: new Date().toISOString(),
      };

      // Write-back status to Task Manager (#01 SSoT per §13)
      try {
        const raw = getRaw(TASK_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          parsed.tasks = (parsed.tasks || []).map((t: Task) =>
            t.id === taskId
              ? { ...t, status: targetCol.mappedStatus, updatedAt: new Date().toISOString() }
              : t
          );
          setRaw(TASK_STORAGE_KEY, JSON.stringify(parsed));
          setTasks(parsed.tasks);
        }
      } catch (e) {
        console.error("Failed to sync task status from kanban", e);
      }

      setState((prev) => ({
        ...prev,
        logs: [newLog, ...prev.logs],
      }));

      notifyChange();
    },
    [activeBoard, columnTaskMap, tasks, notifyChange]
  );

  // SET SWIMLANE (§6)
  const setSwimlane = useCallback(
    (swimlaneBy: SwimlaneBy) => {
      setState((prev) => ({
        ...prev,
        boards: prev.boards.map((b) =>
          b.id === prev.activeBoardId ? { ...b, swimlaneBy } : b
        ),
      }));
      notifyChange();
    },
    [notifyChange]
  );

  return {
    state,
    activeBoard,
    tasks,
    columnTaskMap,
    moveCard,
    setSwimlane,
  };
}
