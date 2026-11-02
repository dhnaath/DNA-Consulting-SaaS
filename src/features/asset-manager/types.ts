export type AssetType = 'image' | 'document' | 'video' | 'audio' | 'archive' | 'other';

export interface AssetVersion {
  id: string;
  assetId: string;
  versionNumber: number;
  storageUrl: string;
  sizeBytes: number;
  uploadedBy: string;
  uploadedAt: string;
  changeNote: string;
}

export interface AssetReference {
  id: string;
  assetId: string;
  usedByApp: 'task_manager' | 'deliverable_manager' | 'knowledge_base' | 'meeting_manager' | 'forms' | 'web_clipper' | string;
  usedByEntityType: string;
  usedByEntityId: string;
  usedByTitle?: string;
  linkedAt: string;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  mimeType: string;
  sizeBytes: number;
  storageUrl: string;
  folderId: string | null;
  tags: string[];
  currentVersionId: string;
  checksum?: string;
  uploadedBy: string;
  createdAt: string;
  dimensions?: { width: number; height: number };
}

export interface AssetFolder {
  id: string;
  name: string;
  parentFolderId: string | null;
}

export interface AssetTag {
  id: string;
  name: string;
  color: string;
}

export interface StorageQuota {
  workspaceId: string;
  totalBytesAllowed: number;
  totalBytesUsed: number;
  lastCalculatedAt: string;
}

export type AssetViewMode = 'all' | 'folder' | 'by_type' | 'gallery' | 'orphans' | 'storage' | 'stats';
