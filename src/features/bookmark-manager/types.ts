export type BookmarkStatus = 'active' | 'unread' | 'archived' | 'broken';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  faviconUrl?: string;
  folderId?: string | null;
  tags: string[];
  status: BookmarkStatus;
  addedAt: string;
  lastCheckedAt?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentFolderId: string | null;
  order: number;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface LinkCheck {
  id: string;
  bookmarkId: string;
  checkedAt: string;
  httpStatus: number;
  isReachable: boolean;
  responseTimeMs?: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  bookmarkIds: string[];
  isPublic: boolean;
  ownerId: string;
  createdAt: string;
}

export type BookmarkViewMode = 'all' | 'folder' | 'tag' | 'unread' | 'broken' | 'collections' | 'stats';
