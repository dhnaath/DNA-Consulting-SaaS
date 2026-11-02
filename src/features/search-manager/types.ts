export interface SearchIndexItem {
  id: string;
  entityType: string; // "task" | "deliverable" | "meeting" | "workflow" | "form" | "article" | "person"
  entityId: string;
  sourceApp: string; // "task_manager" | "deliverable_manager" | "meeting_manager" | "wiki" | "forms" | "collaboration"
  title: string;
  content: string;
  tags: string[];
  metadata: Record<string, any>;
  searchableText: string;
  indexedAt: string;
  scoreBoost?: number;
}

export interface SearchFacetValue {
  value: string;
  count: number;
}

export interface SearchFacet {
  facetType: "source_app" | "entity_type" | "tag" | "date_bucket";
  values: SearchFacetValue[];
}

export interface SearchResult {
  entityType: string;
  entityId: string;
  sourceApp: string;
  title: string;
  snippet: string;
  relevanceScore: number;
  highlights: string[];
  metadata: Record<string, any>;
}

export interface SearchFilter {
  sourceApps?: string[];
  entityTypes?: string[];
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  queryText: string;
  filters: SearchFilter;
  notifyOnNewResults: boolean;
  createdAt: string;
}

export interface SearchSynonym {
  id: string;
  term: string;
  synonyms: string[];
}
