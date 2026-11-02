export type ClipType = "full_page" | "article" | "selection" | "screenshot" | "bookmark";

export type ClipStatus = "unprocessed" | "promoted" | "archived";

export interface SourcePage {
  url: string;
  title: string;
  faviconUrl?: string;
  domain: string;
  publishedAt?: string;
  accessedAt: string;
}

export interface ClipContent {
  clipId: string;
  format: "html" | "plain_text" | "image";
  rawContent: string;
  wordCount?: number;
  extractedAt: string;
}

export interface ClipHighlight {
  id: string;
  clipId: string;
  text: string;
  color?: string; // yellow, green, blue, pink
  position?: number;
  note?: string;
  createdAt: string;
}

export interface ClipFolder {
  id: string;
  name: string;
  parentFolderId?: string | null;
}

export interface PromotionRecord {
  id: string;
  clipId: string;
  promotedToApp: "notes" | "knowledge_base" | "research_manager" | "reading_list";
  promotedToId: string;
  promotedAt: string;
}

export interface Clip {
  id: string;
  type: ClipType;
  sourcePage: SourcePage;
  content?: ClipContent;
  tags: string[];
  folderId?: string | null;
  capturedAt: string;
  status: ClipStatus;
  note?: string;
}

export interface WebClipperData {
  clips: Clip[];
  highlights: ClipHighlight[];
  folders: ClipFolder[];
  promotionRecords: PromotionRecord[];
  reviewThresholdDays: number; // default 14 days
}
