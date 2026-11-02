import { TaskStatus } from "../task-manager/types";

export type SwimlaneBy = "none" | "assignee" | "priority" | "tag";

export interface Column {
  id: string;
  boardId: string;
  name: string;
  order: number;
  mappedStatus: TaskStatus;
  wipLimit: number | null; // null = unlimited
  color: string;
}

export interface Board {
  id: string;
  name: string;
  projectId?: string;
  columns: Column[];
  swimlaneBy: SwimlaneBy;
  ownerId?: string;
  createdAt: string;
}

export interface CardPosition {
  boardId: string;
  taskId: string;
  columnId: string;
  order: number;
}

export interface CardMovementLog {
  id: string;
  boardId: string;
  taskId: string;
  fromColumnId: string;
  toColumnId: string;
  movedBy?: string;
  movedAt: string;
}

export type KanbanViewMode = "board" | "swimlane" | "compact" | "wip_overview";
