import { useState, useEffect } from "react";
import {
  ResearchManagerData,
  ResearchQuestion,
  ResearchSource,
  ResearchEvidence,
  ResearchAnalysis,
  ResearchConclusion,
  ConfidenceLevel,
} from "./types";
import { getRaw, setRaw } from "../../core/rawStorage";

const STORAGE_KEY = "aio_research_manager_data_v1";

const DEFAULT_QUESTIONS: ResearchQuestion[] = [
  {
    id: "q-1",
    question: "Apakah valuasi DCF lebih akurat dari metode multiple untuk bisnis yang tumbuh cepat?",
    context:
      "Klien kami adalah perusahaan yang tumbuh cepat dengan histori laba pendek. Kami perlu mengevaluasi biaya vs akurasi antara DCF dan metode multiple.",
    status: "answered",
    parentQuestionId: null,
    tags: ["DCF", "Multiple", "Cost-Benefit", "Valuasi"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: "q-1-sub-1",
    question: "Berapa perbandingan waktu dan biaya pengerjaan DCF vs metode multiple?",
    context: "Sub-pertanyaan untuk menganalisis beban kerja tim.",
    status: "answered",
    parentQuestionId: "q-1",
    tags: ["Cost", "Effort"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
  {
    id: "q-2",
    question: "Bagaimana sensitivitas hasil valuasi terhadap perubahan WACC sebesar 1-2 poin persentase?",
    context: "Evaluasi sensitivitas nilai terminal pada tiga skenario pertumbuhan.",
    status: "in_progress",
    parentQuestionId: null,
    tags: ["WACC", "Sensitivitas", "Skenario"],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

const DEFAULT_SOURCES: ResearchSource[] = [
  {
    id: "src-r-1",
    researchQuestionId: "q-1",
    type: "paper",
    title: "Comparative Study of DCF vs Market Multiples for High-Growth Firms",
    author: "Corporate Finance Research Group (MIT)",
    url: "https://example.org/dcf-vs-multiples-2025",
    publishedAt: "2025-08-15",
    credibility: "high",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
  },
  {
    id: "src-r-2",
    researchQuestionId: "q-1",
    type: "article",
    title: "Practitioner Notes: Effort and Cost of Rebuilding Valuation Models",
    author: "Valuation Practitioner Blog",
    credibility: "medium",
    addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
];

const DEFAULT_EVIDENCES: ResearchEvidence[] = [
  {
    id: "ev-1",
    sourceId: "src-r-1",
    researchQuestionId: "q-1",
    statement: "DCF menunjukkan deviasi 6% terhadap harga transaksi pada 1.200 kasus akuisisi perusahaan tumbuh cepat.",
    supportType: "supports",
    strength: "strong",
    note: "Hasil studi pada 1.200 transaksi akuisisi di Asia Tenggara.",
  },
  {
    id: "ev-2",
    sourceId: "src-r-2",
    researchQuestionId: "q-1",
    statement: "Metode multiple membutuhkan verifikasi ulang atas kewajaran perusahaan pembanding yang dipilih.",
    supportType: "supports",
    strength: "moderate",
    note: "Menambah overhead waktu review tim analis.",
  },
];

const DEFAULT_ANALYSES: ResearchAnalysis[] = [
  {
    id: "an-1",
    researchQuestionId: "q-1",
    content:
      "Bukti dari paper MIT mengonfirmasi bahwa DCF dengan analisis sensitivitas lebih terkontrol untuk perusahaan tumbuh cepat. Metode multiple hanya direkomendasikan sebagai pembanding silang atau saat data pembanding sangat memadai.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

const DEFAULT_CONCLUSIONS: ResearchConclusion[] = [
  {
    id: "c-1",
    researchQuestionId: "q-1",
    statement:
      "DCF dengan pembanding pasar sebagai uji silang lebih akurat dan dapat dipertanggungjawabkan untuk bisnis tumbuh cepat karena asumsi dapat ditelusuri dan diuji sensitivitasnya.",
    confidence: "high",
    basedOnEvidenceIds: ["ev-1", "ev-2"],
    isFinal: true,
    concludedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

const INITIAL_DATA: ResearchManagerData = {
  questions: DEFAULT_QUESTIONS,
  sources: DEFAULT_SOURCES,
  evidences: DEFAULT_EVIDENCES,
  analyses: DEFAULT_ANALYSES,
  conclusions: DEFAULT_CONCLUSIONS,
};

function loadData(): ResearchManagerData {
  try {
    const raw = getRaw(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_DATA,
      ...parsed,
      questions: Array.isArray(parsed.questions) ? parsed.questions : INITIAL_DATA.questions,
      sources: Array.isArray(parsed.sources) ? parsed.sources : INITIAL_DATA.sources,
      evidences: Array.isArray(parsed.evidences) ? parsed.evidences : INITIAL_DATA.evidences,
      analyses: Array.isArray(parsed.analyses) ? parsed.analyses : INITIAL_DATA.analyses,
      conclusions: Array.isArray(parsed.conclusions) ? parsed.conclusions : INITIAL_DATA.conclusions,
    };
  } catch {
    return INITIAL_DATA;
  }
}

function saveData(data: ResearchManagerData) {
  try {
    setRaw(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save Research Manager data:", e);
  }
}

export function useResearchManagerStore() {
  const [data, setData] = useState<ResearchManagerData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addQuestion = (question: Omit<ResearchQuestion, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newQ: ResearchQuestion = {
      ...question,
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    setData((prev) => ({
      ...prev,
      questions: [newQ, ...prev.questions],
    }));
    return newQ;
  };

  const updateQuestion = (id: string, updates: Partial<ResearchQuestion>) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
      ),
    }));
  };

  const deleteQuestion = (id: string) => {
    setData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id && q.parentQuestionId !== id),
      sources: prev.sources.filter((s) => s.researchQuestionId !== id),
      evidences: prev.evidences.filter((e) => e.researchQuestionId !== id),
      analyses: prev.analyses.filter((a) => a.researchQuestionId !== id),
      conclusions: prev.conclusions.filter((c) => c.researchQuestionId !== id),
    }));
  };

  const addSource = (source: Omit<ResearchSource, "id" | "addedAt">) => {
    const newSrc: ResearchSource = {
      ...source,
      id: `src-r-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      addedAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      sources: [...prev.sources, newSrc],
    }));
    return newSrc;
  };

  const deleteSource = (id: string) => {
    setData((prev) => ({
      ...prev,
      sources: prev.sources.filter((s) => s.id !== id),
      evidences: prev.evidences.filter((e) => e.sourceId !== id),
    }));
  };

  const addEvidence = (evidence: Omit<ResearchEvidence, "id">) => {
    const newEv: ResearchEvidence = {
      ...evidence,
      id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    };
    setData((prev) => ({
      ...prev,
      evidences: [...prev.evidences, newEv],
    }));
    return newEv;
  };

  const deleteEvidence = (id: string) => {
    setData((prev) => ({
      ...prev,
      evidences: prev.evidences.filter((e) => e.id !== id),
      conclusions: prev.conclusions.map((c) => ({
        ...c,
        basedOnEvidenceIds: c.basedOnEvidenceIds.filter((eid) => eid !== id),
      })),
    }));
  };

  const saveAnalysis = (researchQuestionId: string, content: string) => {
    const now = new Date().toISOString();
    setData((prev) => {
      const existing = prev.analyses.find((a) => a.researchQuestionId === researchQuestionId);
      if (existing) {
        return {
          ...prev,
          analyses: prev.analyses.map((a) =>
            a.researchQuestionId === researchQuestionId ? { ...a, content, updatedAt: now } : a
          ),
        };
      }
      return {
        ...prev,
        analyses: [
          ...prev.analyses,
          {
            id: `an-${Date.now()}`,
            researchQuestionId,
            content,
            createdAt: now,
            updatedAt: now,
          },
        ],
      };
    });
  };

  const setConclusion = (
    researchQuestionId: string,
    statement: string,
    confidence: ConfidenceLevel,
    basedOnEvidenceIds: string[],
    isFinal: boolean = true
  ) => {
    // Traceability rule: WAJIB minimal 1 evidence
    if (basedOnEvidenceIds.length === 0) {
      throw new Error("Aturan Traceability: Setiap Conclusion WAJIB mereferensikan minimal satu Evidence!");
    }

    const now = new Date().toISOString();
    setData((prev) => {
      const filtered = prev.conclusions.filter((c) => c.researchQuestionId !== researchQuestionId);
      const newConc: ResearchConclusion = {
        id: `c-${Date.now()}`,
        researchQuestionId,
        statement,
        confidence,
        basedOnEvidenceIds,
        isFinal,
        concludedAt: now,
      };
      return {
        ...prev,
        conclusions: [...filtered, newConc],
        questions: prev.questions.map((q) =>
          q.id === researchQuestionId ? { ...q, status: isFinal ? "answered" : "in_progress" } : q
        ),
      };
    });
  };

  // Promote conclusion to Knowledge Base (#14)
  const promoteToKnowledgeBase = (questionId: string) => {
    const q = data.questions.find((x) => x.id === questionId);
    const c = data.conclusions.find((x) => x.id === questionId);
    const a = data.analyses.find((x) => x.id === questionId);
    const qSources = data.sources.filter((s) => s.researchQuestionId === questionId);

    if (!q || !c) return false;

    try {
      const kbRaw = getRaw("aio_knowledge_base_data_v1");
      const kbData = kbRaw ? JSON.parse(kbRaw) : { articles: [], sources: [] };

      const articleId = `art-promoted-${Date.now()}`;
      const now = new Date().toISOString();

      const newArticle = {
        id: articleId,
        title: `Hasil Riset: ${q.question}`,
        summary: c.statement,
        content: `# Hasil Riset: ${q.question}\n\n## Kesimpulan Utama (${c.confidence} confidence)\n${c.statement}\n\n## Konteks Pertanyaan\n${q.context || "-"}\n\n## Analisis Penalaran\n${a?.content || "-"}\n`,
        categoryId: null,
        tags: [...q.tags, "Research-Promoted"],
        reviewStatus: "verified",
        lastReviewedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      const newSources = qSources.map((qs) => ({
        id: `src-promoted-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        articleId,
        type: qs.type === "paper" ? "paper" : "website",
        title: qs.title,
        author: qs.author,
        url: qs.url,
        reliability: qs.credibility,
        addedAt: now,
      }));

      const updatedKb = {
        ...kbData,
        articles: [newArticle, ...(kbData.articles || [])],
        sources: [...(kbData.sources || []), ...newSources],
      };

      setRaw("aio_knowledge_base_data_v1", JSON.stringify(updatedKb));
      return true;
    } catch (e) {
      console.error("Promote to KB failed:", e);
      return false;
    }
  };

  return {
    data,
    questions: data.questions,
    sources: data.sources,
    evidences: data.evidences,
    analyses: data.analyses,
    conclusions: data.conclusions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    addSource,
    deleteSource,
    addEvidence,
    deleteEvidence,
    saveAnalysis,
    setConclusion,
    promoteToKnowledgeBase,
  };
}
