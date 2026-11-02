import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  SearchIndexItem,
  SearchResult,
  SearchFilter,
  SavedSearch,
  SearchSynonym,
} from "./types";

interface SearchStore {
  index: SearchIndexItem[];
  savedSearches: SavedSearch[];
  synonyms: SearchSynonym[];
  recentQueries: string[];

  // Actions
  search: (query: string, filters?: SearchFilter) => { results: SearchResult[]; latencyMs: number };
  saveSearch: (name: string, queryText: string, filters: SearchFilter) => void;
  deleteSavedSearch: (id: string) => void;
  reindexAll: () => void;
  addSynonym: (term: string, synonyms: string[]) => void;
}

const INITIAL_INDEX: SearchIndexItem[] = [
  {
    id: "idx-01",
    entityType: "deliverable",
    entityId: "deliv-01",
    sourceApp: "deliverable_manager",
    title: "Client Portal Security & RBAC Architecture Specification",
    content: "Full technical specification, threat modeling, and definition of done for RBAC role matrices with ISO 27001 Access Control guidelines.",
    tags: ["security", "rbac", "iso27001", "architecture"],
    metadata: { status: "in_review", owner: "Andi Pratama" },
    searchableText: "client portal security rbac architecture specification threat modeling definition of done iso 27001 access control guidelines andi pratama",
    indexedAt: "2026-09-24T08:00:00Z",
    scoreBoost: 1.2,
  },
  {
    id: "idx-02",
    entityType: "deliverable",
    entityId: "deliv-02",
    sourceApp: "deliverable_manager",
    title: "Brand Asset Kit & Marketing Design System",
    content: "Complete vector logos, color codes, typography scales, and social templates with WCAG AA compliance.",
    tags: ["design", "branding", "marketing", "wcag"],
    metadata: { status: "approved", owner: "Siti Rahma" },
    searchableText: "brand asset kit marketing design system vector logos color codes typography wcag aa compliance siti rahma",
    indexedAt: "2026-09-24T08:00:00Z",
    scoreBoost: 1.0,
  },
  {
    id: "idx-03",
    entityType: "meeting",
    entityId: "mtg-01",
    sourceApp: "meeting_manager",
    title: "Sprint 42 Retrospective & Q4 Planning",
    content: "Agreed to adopt strict Definition of Done verification for deliverables and migrate legacy cron jobs to unified workflow pipelines.",
    tags: ["meeting", "retrospective", "sprint", "dod"],
    metadata: { date: "2026-09-22", series: "Bi-Weekly Sprint Retros" },
    searchableText: "sprint 42 retrospective q4 planning definition of done verification migrate legacy cron jobs workflow pipelines",
    indexedAt: "2026-09-23T11:00:00Z",
    scoreBoost: 1.1,
  },
  {
    id: "idx-04",
    entityType: "workflow",
    entityId: "wf-def-review",
    sourceApp: "workflow_manager",
    title: "2-Stage Deliverable Review & Legal Sign-off Pipeline",
    content: "Formal blueprint enforcing peer review, minimum approval count, and authorized legal officer digital sign-off before completion.",
    tags: ["workflow", "approval", "compliance", "legal"],
    metadata: { version: 1, stages: 4 },
    searchableText: "2-stage deliverable review legal sign-off pipeline blueprint peer review approval count legal officer",
    indexedAt: "2026-09-22T09:00:00Z",
  },
  {
    id: "idx-05",
    entityType: "form",
    entityId: "form-bug-report",
    sourceApp: "forms",
    title: "Bug & Incident Report Form",
    content: "Structured data collector dispatching bugs directly to Task Manager triage queue with reproduction steps and screenshot attachments.",
    tags: ["forms", "bug", "triage", "actionmapping"],
    metadata: { status: "published", responses: 2 },
    searchableText: "bug incident report form structured data collector task manager triage queue reproduction steps actionmapping",
    indexedAt: "2026-09-21T14:00:00Z",
  },
  {
    id: "idx-06",
    entityType: "article",
    entityId: "kb-01",
    sourceApp: "wiki",
    title: "Ecosystem Architecture Guide: 90 Standalone Apps",
    content: "Overview of domain isolation, SyncEvent choreography, read-only analytics, and universal discovery across all 90 standalone tools.",
    tags: ["wiki", "architecture", "ecosystem", "guide"],
    metadata: { author: "System Architect" },
    searchableText: "ecosystem architecture guide 90 standalone apps domain isolation syncevent choreography read-only analytics universal discovery",
    indexedAt: "2026-09-20T10:00:00Z",
    scoreBoost: 1.3,
  },
];

const INITIAL_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: "sav-1",
    userId: "u-self",
    name: "DoD & Compliance Requirements",
    queryText: "DoD compliance",
    filters: {},
    notifyOnNewResults: true,
    createdAt: "2026-09-21",
  },
  {
    id: "sav-2",
    userId: "u-self",
    name: "Security & RBAC Specifications",
    queryText: "security rbac",
    filters: { sourceApps: ["deliverable_manager"] },
    notifyOnNewResults: false,
    createdAt: "2026-09-22",
  },
];

const INITIAL_SYNONYMS: SearchSynonym[] = [
  { id: "syn-1", term: "dod", synonyms: ["definition of done", "acceptance criteria", "requirements"] },
  { id: "syn-2", term: "rbac", synonyms: ["role based access control", "permissions", "roles"] },
  { id: "syn-3", term: "bug", synonyms: ["incident", "issue", "defect", "error"] },
];

export const useSearchStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      index: INITIAL_INDEX,
      savedSearches: INITIAL_SAVED_SEARCHES,
      synonyms: INITIAL_SYNONYMS,
      recentQueries: ["DoD compliance", "security rbac", "sprint retrospective", "workflow pipeline"],

      search: (query, filters) => {
        const start = performance.now();
        const state = get();
        const cleanQ = query.trim().toLowerCase();

        if (!cleanQ && (!filters || Object.keys(filters).length === 0)) {
          return { results: [], latencyMs: 0 };
        }

        // Expand query with synonyms
        const queryTerms = cleanQ.split(/\s+/).filter(Boolean);
        const expandedTerms = new Set<string>(queryTerms);
        state.synonyms.forEach((syn) => {
          if (queryTerms.includes(syn.term.toLowerCase())) {
            syn.synonyms.forEach((s) => expandedTerms.add(s.toLowerCase()));
          }
        });

        // Filter and score index items
        const results: SearchResult[] = [];

        state.index.forEach((item) => {
          // Source app filter
          if (filters?.sourceApps && filters.sourceApps.length > 0) {
            if (!filters.sourceApps.includes(item.sourceApp)) return;
          }
          // Entity type filter
          if (filters?.entityTypes && filters.entityTypes.length > 0) {
            if (!filters.entityTypes.includes(item.entityType)) return;
          }
          // Tags filter
          if (filters?.tags && filters.tags.length > 0) {
            const hasTag = filters.tags.some((t) => item.tags.includes(t));
            if (!hasTag) return;
          }

          // Relevance scoring
          let score = 0;
          const highlights: string[] = [];

          if (cleanQ) {
            let matched = false;
            expandedTerms.forEach((term) => {
              if (item.title.toLowerCase().includes(term)) {
                score += 10;
                matched = true;
                highlights.push(term);
              }
              if (item.content.toLowerCase().includes(term)) {
                score += 4;
                matched = true;
                highlights.push(term);
              }
              if (item.tags.some((t) => t.toLowerCase().includes(term))) {
                score += 6;
                matched = true;
                highlights.push(term);
              }
            });

            if (!matched) return;
          } else {
            score = 1;
          }

          if (item.scoreBoost) {
            score *= item.scoreBoost;
          }

          // Snippet creation
          const snippet = item.content.slice(0, 160) + (item.content.length > 160 ? "..." : "");

          results.push({
            entityType: item.entityType,
            entityId: item.entityId,
            sourceApp: item.sourceApp,
            title: item.title,
            snippet,
            relevanceScore: Math.round(score * 10) / 10,
            highlights: Array.from(new Set(highlights)),
            metadata: item.metadata,
          });
        });

        results.sort((a, b) => b.relevanceScore - a.relevanceScore);

        // Record recent query
        if (cleanQ) {
          set((s) => ({
            recentQueries: [cleanQ, ...s.recentQueries.filter((q) => q !== cleanQ)].slice(0, 10),
          }));
        }

        const end = performance.now();
        return {
          results,
          latencyMs: Math.round((end - start) * 10) / 10,
        };
      },

      saveSearch: (name, queryText, filters) => {
        const newSaved: SavedSearch = {
          id: `sav-${Date.now()}`,
          userId: "u-self",
          name,
          queryText,
          filters,
          notifyOnNewResults: false,
          createdAt: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ savedSearches: [...state.savedSearches, newSaved] }));
      },

      deleteSavedSearch: (id) => {
        set((state) => ({ savedSearches: state.savedSearches.filter((s) => s.id !== id) }));
      },

      reindexAll: () => {
        set((state) => ({
          index: state.index.map((item) => ({
            ...item,
            indexedAt: new Date().toISOString(),
          })),
        }));
      },

      addSynonym: (term, syns) => {
        const newSyn: SearchSynonym = {
          id: `syn-${Date.now()}`,
          term,
          synonyms: syns,
        };
        set((state) => ({ synonyms: [...state.synonyms, newSyn] }));
      },
    }),
    {
      name: "ecosystem-search-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
