export type ReviewStatus = "draft" | "reviewed" | "verified" | "outdated";

export type SourceType = "book" | "paper" | "website" | "document" | "interview" | "other";

export type SourceReliability = "low" | "medium" | "high";

export type RelationType =
  | "prerequisite"
  | "related"
  | "contradicts"
  | "supersedes"
  | "example_of"
  | "part_of";

export interface Source {
  id: string;
  articleId: string;
  type: SourceType;
  title: string;
  author?: string;
  url?: string;
  publishedAt?: string;
  reliability: SourceReliability;
  excerpt?: string;
  addedAt: string;
  externalRef?: {
    app: "documents" | "web_clipper" | "notes";
    id: string;
  };
}

export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string | null;
  description?: string;
}

export interface ArticleRelation {
  id: string;
  fromArticleId: string;
  toArticleId: string;
  type: RelationType;
  note?: string;
}

export interface ArticleRevision {
  id: string;
  articleId: string;
  content: string;
  editedBy: string;
  editedAt: string;
  changeSummary?: string;
}

export interface Contributor {
  articleId: string;
  userId: string;
  role: "author" | "editor" | "reviewer";
  contributedAt: string;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  categoryId?: string | null;
  tags: string[];
  reviewStatus: ReviewStatus;
  lastReviewedAt?: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface KnowledgeBaseData {
  articles: Article[];
  categories: Category[];
  sources: Source[];
  relations: ArticleRelation[];
  revisions: ArticleRevision[];
  contributors: Contributor[];
  reviewReminderIntervalDays: number; // default 180 (6 bulan)
}
