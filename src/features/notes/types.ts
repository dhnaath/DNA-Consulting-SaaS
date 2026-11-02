export type BlockType =
  | "paragraph"
  | "heading_1"
  | "heading_2"
  | "heading_3"
  | "bulleted_list"
  | "numbered_list"
  | "checklist"
  | "quote"
  | "code"
  | "divider"
  | "image"
  | "table"
  | "callout"
  | "toggle"
  | "embed";

export interface Block {
  id: string;
  noteId: string;
  type: BlockType;
  content: string;
  children?: Block[];
  order: number;
  checked?: boolean;
  language?: string;
}

export interface Notebook {
  id: string;
  name: string;
  folderId?: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt?: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Link {
  id: string;
  sourceNoteId: string;
  targetNoteId: string;
  blockId?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  noteId: string;
  blockId?: string;
  name: string;
  type: "image" | "document" | "link" | "other";
  url: string;
  size?: number;
  createdAt: string;
}

export interface Version {
  id: string;
  noteId: string;
  contentSnapshot: Block[];
  changeSummary: string;
  editedBy: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  noteId: string;
  blockId?: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  noteId: string;
  type:
    | "created"
    | "edited"
    | "title_changed"
    | "moved_notebook"
    | "tag_added"
    | "pinned"
    | "archived"
    | "restored"
    | "trashed"
    | "version_restored"
    | "link_added"
    | "attachment_added"
    | "comment_added";
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  userId?: string;
  description: string;
  createdAt: string;
}

export interface Note {
  id: string;
  title: string;
  notebookId?: string;
  tags: string[];
  icon?: string;
  coverImage?: string;
  pinned: boolean;
  favorited: boolean;
  isLocked: boolean;
  lockPin?: string;
  isArchived: boolean;
  isTrashed: boolean;
  wordCount: number;
  blocks: Block[];
  attachments?: Attachment[];
  links?: Link[];
  createdAt: string;
  updatedAt: string;
  trashedAt?: string;
  archivedAt?: string;
}

export interface NoteTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  defaultNotebookId?: string;
  tags: string[];
  blocks: Omit<Block, "id" | "noteId">[];
}

export type NotesViewMode =
  | "all"
  | "notebook"
  | "pinned"
  | "favorites"
  | "recent"
  | "tags"
  | "graph"
  | "calendar"
  | "archived"
  | "trash";
