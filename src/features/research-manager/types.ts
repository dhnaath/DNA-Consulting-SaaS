export type QuestionStatus =
  | "open"
  | "in_progress"
  | "answered"
  | "inconclusive"
  | "abandoned";

export type ResearchSourceType =
  | "paper"
  | "article"
  | "book"
  | "interview"
  | "dataset"
  | "website"
  | "other";

export type CredibilityLevel = "low" | "medium" | "high";

export type SupportType = "supports" | "contradicts" | "neutral";

export type EvidenceStrength = "weak" | "moderate" | "strong";

export type ConfidenceLevel = "low" | "medium" | "high";

export interface ResearchSource {
  id: string;
  researchQuestionId: string;
  type: ResearchSourceType;
  title: string;
  author?: string;
  url?: string;
  publishedAt?: string;
  credibility: CredibilityLevel;
  addedAt: string;
}

export interface ResearchEvidence {
  id: string;
  sourceId: string;
  researchQuestionId: string;
  statement: string;
  supportType: SupportType;
  strength: EvidenceStrength;
  note?: string;
}

export interface ResearchAnalysis {
  id: string;
  researchQuestionId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchConclusion {
  id: string;
  researchQuestionId: string;
  statement: string;
  confidence: ConfidenceLevel;
  basedOnEvidenceIds: string[]; // Aturan Traceability: WAJIB minimal 1
  isFinal: boolean;
  concludedAt: string;
}

export interface ResearchQuestion {
  id: string;
  question: string;
  context?: string;
  status: QuestionStatus;
  parentQuestionId?: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ResearchManagerData {
  questions: ResearchQuestion[];
  sources: ResearchSource[];
  evidences: ResearchEvidence[];
  analyses: ResearchAnalysis[];
  conclusions: ResearchConclusion[];
}
