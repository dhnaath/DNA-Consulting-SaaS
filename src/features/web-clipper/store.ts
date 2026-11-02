import { useState, useEffect } from "react";
import {
  WebClipperData,
  Clip,
  ClipHighlight,
  ClipFolder,
  PromotionRecord,
} from "./types";
import { getRaw, setRaw } from "../../core/rawStorage";

const STORAGE_KEY = "aio_web_clipper_data_v1";

const DEFAULT_FOLDERS: ClipFolder[] = [
  { id: "fld-ai", name: "Riset Valuasi & Keuangan", parentFolderId: null },
  { id: "fld-legal", name: "Kepatuhan & Regulasi", parentFolderId: null },
  { id: "fld-infra", name: "Infrastruktur & Cloud", parentFolderId: null },
];

const DEFAULT_CLIPS: Clip[] = [
  {
    id: "clip-1",
    type: "article",
    sourcePage: {
      url: "https://example.org/valuation-survey",
      title: "Business Valuation Methods: A Practitioner Survey",
      domain: "example.org",
      publishedAt: "2023-12-18",
      accessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    content: {
      clipId: "clip-1",
      format: "plain_text",
      rawContent: `Discounted cash flow valuation reduces reliance on market sentiment by anchoring value to expected free cash flows and the cost of capital.

Practitioners generally classify methods into:
1. Income approach (DCF, capitalized earnings)
2. Market approach (trading and transaction multiples)
3. Asset approach (adjusted net asset value)

Quality checks generally follow three tests: Assumption Support, Comparable Relevance, and Sensitivity Coverage.`,
      wordCount: 78,
      extractedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    tags: ["DCF", "Valuasi", "Survey"],
    folderId: "fld-ai",
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: "unprocessed",
    note: "Penting untuk referensi penulisan artikel Knowledge Base.",
  },
  {
    id: "clip-2",
    type: "selection",
    sourcePage: {
      url: "https://ojk.go.id/id/regulasi/pedoman-keamanan-data",
      title: "Pedoman Keamanan Siber dan Perlindungan Data Nasabah",
      domain: "ojk.go.id",
      accessedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(), // > 14 hari
    },
    content: {
      clipId: "clip-2",
      format: "plain_text",
      rawContent: `Lembaga jasa keuangan yang memanfaatkan komputasi awan wajib memastikan pemisahan kunci enkripsi data nasabah serta melakukan pengujian penetrasi independen minimal sekali setahun.`,
      wordCount: 23,
      extractedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
    },
    tags: ["OJK", "Compliance", "Enkripsi"],
    folderId: "fld-legal",
    capturedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 16).toISOString(),
    status: "unprocessed",
    note: "Kutipan wajib untuk klausul kontrak vendor perbankan.",
  },
];

const DEFAULT_HIGHLIGHTS: ClipHighlight[] = [
  {
    id: "hl-1",
    clipId: "clip-1",
    text: "Quality checks generally follow three tests: Assumption Support, Comparable Relevance, and Sensitivity Coverage.",
    color: "yellow",
    note: "Gunakan tiga uji ini sebagai checklist review valuasi",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
  },
];

const DEFAULT_PROMOTION_RECORDS: PromotionRecord[] = [];

const INITIAL_DATA: WebClipperData = {
  clips: DEFAULT_CLIPS,
  highlights: DEFAULT_HIGHLIGHTS,
  folders: DEFAULT_FOLDERS,
  promotionRecords: DEFAULT_PROMOTION_RECORDS,
  reviewThresholdDays: 14,
};

function loadData(): WebClipperData {
  try {
    const raw = getRaw(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_DATA,
      ...parsed,
      clips: Array.isArray(parsed.clips) ? parsed.clips : INITIAL_DATA.clips,
      highlights: Array.isArray(parsed.highlights) ? parsed.highlights : INITIAL_DATA.highlights,
      folders: Array.isArray(parsed.folders) ? parsed.folders : INITIAL_DATA.folders,
      promotionRecords: Array.isArray(parsed.promotionRecords) ? parsed.promotionRecords : INITIAL_DATA.promotionRecords,
    };
  } catch {
    return INITIAL_DATA;
  }
}

function saveData(data: WebClipperData) {
  try {
    setRaw(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save Web Clipper data:", e);
  }
}

export function useWebClipperStore() {
  const [data, setData] = useState<WebClipperData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addClip = (clip: Omit<Clip, "id" | "capturedAt" | "status">) => {
    const now = new Date().toISOString();
    const newClip: Clip = {
      ...clip,
      id: `clip-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      capturedAt: now,
      status: "unprocessed",
    };

    setData((prev) => ({
      ...prev,
      clips: [newClip, ...prev.clips],
    }));

    return newClip;
  };

  const updateClip = (id: string, updates: Partial<Clip>) => {
    setData((prev) => ({
      ...prev,
      clips: prev.clips.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const deleteClip = (id: string) => {
    setData((prev) => ({
      ...prev,
      clips: prev.clips.filter((c) => c.id !== id),
      highlights: prev.highlights.filter((h) => h.clipId !== id),
    }));
  };

  const addHighlight = (highlight: Omit<ClipHighlight, "id" | "createdAt">) => {
    const newHl: ClipHighlight = {
      ...highlight,
      id: `hl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, newHl],
    }));
    return newHl;
  };

  const deleteHighlight = (id: string) => {
    setData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h.id !== id),
    }));
  };

  const addFolder = (name: string, parentFolderId?: string | null) => {
    const newFolder: ClipFolder = {
      id: `fld-${Date.now()}`,
      name,
      parentFolderId: parentFolderId || null,
    };
    setData((prev) => ({
      ...prev,
      folders: [...prev.folders, newFolder],
    }));
    return newFolder;
  };

  const deleteFolder = (id: string) => {
    setData((prev) => ({
      ...prev,
      folders: prev.folders.filter((f) => f.id !== id),
      clips: prev.clips.map((c) => (c.folderId === id ? { ...c, folderId: null } : c)),
    }));
  };

  // Promotion to other apps (§8 & §15)
  const promoteToApp = (
    clipId: string,
    targetApp: "notes" | "knowledge_base" | "research_manager"
  ) => {
    const clip = data.clips.find((c) => c.id === clipId);
    if (!clip) return false;

    const now = new Date().toISOString();
    let targetId = "";

    try {
      if (targetApp === "notes") {
        const notesRaw = getRaw("aio_notes_data_v1");
        const notesData = notesRaw ? JSON.parse(notesRaw) : { notes: [] };
        targetId = `note-clip-${Date.now()}`;
        const newNote = {
          id: targetId,
          title: `[Clip] ${clip.sourcePage.title}`,
          folderId: "inbox",
          tags: [...clip.tags, "From-WebClipper"],
          blocks: [
            {
              id: `blk-${Date.now()}`,
              type: "paragraph",
              content: clip.content?.rawContent || clip.note || "",
            },
            {
              id: `blk-${Date.now() + 1}`,
              type: "paragraph",
              content: `Sumber: ${clip.sourcePage.url} (Diakses: ${clip.sourcePage.accessedAt})`,
            },
          ],
          createdAt: now,
          updatedAt: now,
        };
        notesData.notes = [newNote, ...(notesData.notes || [])];
        setRaw("aio_notes_data_v1", JSON.stringify(notesData));
      } else if (targetApp === "knowledge_base") {
        const kbRaw = getRaw("aio_knowledge_base_data_v1");
        const kbData = kbRaw ? JSON.parse(kbRaw) : { articles: [], sources: [] };
        targetId = `art-clip-${Date.now()}`;
        const newArticle = {
          id: targetId,
          title: clip.sourcePage.title,
          summary: clip.note || `Klip web dari ${clip.sourcePage.domain}`,
          content: `# ${clip.sourcePage.title}\n\n${clip.content?.rawContent || ""}\n\n---\nSumber: ${clip.sourcePage.url}`,
          categoryId: null,
          tags: [...clip.tags, "From-WebClipper"],
          reviewStatus: "draft",
          createdAt: now,
          updatedAt: now,
        };
        const newSource = {
          id: `src-clip-${Date.now()}`,
          articleId: targetId,
          type: "website",
          title: clip.sourcePage.title,
          url: clip.sourcePage.url,
          reliability: "medium",
          addedAt: now,
        };
        kbData.articles = [newArticle, ...(kbData.articles || [])];
        kbData.sources = [newSource, ...(kbData.sources || [])];
        setRaw("aio_knowledge_base_data_v1", JSON.stringify(kbData));
      } else if (targetApp === "research_manager") {
        const rmRaw = getRaw("aio_research_manager_data_v1");
        const rmData = rmRaw ? JSON.parse(rmRaw) : { questions: [], sources: [], evidences: [] };
        targetId = `src-clip-${Date.now()}`;
        // Find first question to attach source
        const firstQId = rmData.questions[0]?.id || "q-1";
        const newSource = {
          id: targetId,
          researchQuestionId: firstQId,
          type: "website",
          title: clip.sourcePage.title,
          url: clip.sourcePage.url,
          credibility: "medium",
          addedAt: now,
        };
        rmData.sources = [newSource, ...(rmData.sources || [])];

        // Add highlights as Evidence!
        const clipHighlights = data.highlights.filter((h) => h.clipId === clipId);
        clipHighlights.forEach((h, idx) => {
          rmData.evidences.push({
            id: `ev-clip-${Date.now()}-${idx}`,
            sourceId: targetId,
            researchQuestionId: firstQId,
            statement: h.text,
            supportType: "supports",
            strength: "moderate",
            note: h.note,
          });
        });

        setRaw("aio_research_manager_data_v1", JSON.stringify(rmData));
      }

      // Record promotion
      const promo: PromotionRecord = {
        id: `promo-${Date.now()}`,
        clipId,
        promotedToApp: targetApp,
        promotedToId: targetId,
        promotedAt: now,
      };

      setData((prev) => ({
        ...prev,
        clips: prev.clips.map((c) => (c.id === clipId ? { ...c, status: "promoted" } : c)),
        promotionRecords: [...prev.promotionRecords, promo],
      }));

      return true;
    } catch (e) {
      console.error("Promotion failed:", e);
      return false;
    }
  };

  const isOldUnprocessed = (clip: Clip) => {
    if (clip.status !== "unprocessed") return false;
    const diffDays =
      (Date.now() - new Date(clip.capturedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > data.reviewThresholdDays;
  };

  return {
    data,
    clips: data.clips,
    highlights: data.highlights,
    folders: data.folders,
    promotionRecords: data.promotionRecords,
    addClip,
    updateClip,
    deleteClip,
    addHighlight,
    deleteHighlight,
    addFolder,
    deleteFolder,
    promoteToApp,
    isOldUnprocessed,
  };
}
