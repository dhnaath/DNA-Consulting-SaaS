export type DocumentStatus =
  | "Draft"
  | "In Review"
  | "Approved"
  | "Rejected"
  | "Published"
  | "Superseded"
  | "Archived";

export type ConfidentialityLevel = "Public" | "Internal" | "Confidential" | "Restricted";

export type VersionStatus = "draft" | "in_review" | "approved" | "published" | "superseded" | "rejected";

export type ReviewerRole = "reviewer" | "approver";
export type ReviewStatus = "pending" | "reviewed" | "approved" | "rejected";

export interface DocumentMetadata {
  author?: string;
  department?: string;
  documentNumber?: string;
  confidentiality?: ConfidentialityLevel;
  relatedProjectId?: string;
  relatedTaskId?: string;
  effectiveDate?: string;
  expiryDate?: string;
  customFields?: Record<string, string>;
}

export interface Attachment {
  id: string;
  documentId: string;
  versionId?: string;
  name: string;
  type: "pdf" | "docx" | "image" | "other";
  url: string;
  size?: number;
  createdAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: string; // e.g. "0.1", "1.0", "1.1", "2.0"
  content: string; // Structured text or markdown sections
  fileUrl?: string;
  status: VersionStatus;
  changeSummary: string;
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  publishedAt?: string;
}

export interface ReviewAssignment {
  id: string;
  documentId: string;
  versionId: string;
  reviewerId: string;
  reviewerName: string;
  role: ReviewerRole;
  status: ReviewStatus;
  comment?: string;
  respondedAt?: string;
}

export interface Comment {
  id: string;
  documentId: string;
  versionId?: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  folderId?: string;
  color?: string;
  icon?: string;
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

export interface Activity {
  id: string;
  documentId: string;
  type:
    | "created"
    | "edited"
    | "submitted_review"
    | "reviewed"
    | "approved"
    | "rejected"
    | "published"
    | "revised"
    | "superseded"
    | "archived"
    | "restored"
    | "metadata_changed"
    | "attachment_added"
    | "comment_added";
  fieldChanged?: string;
  oldValue?: string;
  newValue?: string;
  userId?: string;
  description: string;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  documentType?: string; // Category id or name
  status: DocumentStatus;
  currentVersionId?: string;
  ownerId: string;
  ownerName: string;
  folderId?: string;
  tags: string[];
  metadata: DocumentMetadata;
  effectiveDate?: string;
  expiryDate?: string;
  confidentiality: ConfidentialityLevel;
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  archivedAt?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  documentType: string;
  defaultSections: Array<{ title: string; placeholder: string }>;
  suggestedConfidentiality: ConfidentialityLevel;
  tags: string[];
}

export type DocumentViewMode =
  | "all"
  | "board"
  | "folders"
  | "my_drafts"
  | "pending_review"
  | "published"
  | "expiring"
  | "archived";
