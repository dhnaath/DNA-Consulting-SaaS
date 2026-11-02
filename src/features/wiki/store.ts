import { useState, useEffect } from "react";
import { getRaw, setRaw } from "../../core/rawStorage";
import {
  WikiData,
  WikiSpace,
  WikiPage,
  WikiLink,
  WikiRevision,
  WikiTemplate,
} from "./types";

const STORAGE_KEY = "aio_wiki_data_v1";

const DEFAULT_SPACES: WikiSpace[] = [
  { id: "spc-eng", name: "Engineering & Architecture", description: "Dokumentasi teknis, pipeline, dan SOP infrastruktur", visibility: "team" },
  { id: "spc-prod", name: "Product & Operations", description: "Roadmap, desain fungsional, dan panduan pengguna", visibility: "team" },
];

const DEFAULT_PAGES: WikiPage[] = [
  {
    id: "page-deploy",
    title: "Deployment Process",
    content: `# Deployment Process

Prosedur standar rilis produksi untuk seluruh service:

1. Pastikan semua automated test lulus di [[CI/CD Pipeline]].
2. Cek apakah ada perubahan skema database pada [[Database Migration SOP]].
3. Lakukan deploy menggunakan canary release sebesar 10% traffic.

Terkait juga dengan arsitektur [[Microservices Architecture]].`,
    spaceId: "spc-eng",
    parentPageId: null,
    tags: ["DevOps", "Release", "CI/CD"],
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: "page-cicd",
    title: "CI/CD Pipeline",
    content: `# CI/CD Pipeline

Pipeline kami menggunakan GitHub Actions dan ArgoCD untuk continuous deployment.

Setiap merge ke branch main akan mentrigger build container image dan manifest update ke repository GitOps.

Halaman rujukan:
- [[Deployment Process]]
- [[Monitoring & Observability]]`,
    spaceId: "spc-eng",
    parentPageId: null,
    tags: ["CI/CD", "GitOps", "Infra"],
    status: "published",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: "page-orphan",
    title: "Catatan Arsitektur Lama (Unlinked)",
    content: `# Catatan Arsitektur Lama

Halaman dokumentasi sementara yang belum memiliki tautan masuk maupun keluar.`,
    spaceId: "spc-eng",
    parentPageId: null,
    tags: ["Draft"],
    status: "draft",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
  },
];

const DEFAULT_TEMPLATES: WikiTemplate[] = [
  {
    id: "tmpl-runbook",
    name: "Runbook / Incident Response",
    contentStructure: `# [Nama Service] Incident Runbook\n\n## 1. Gejala & Alert Trigger\n- Alert Name:\n- Ambang Batas:\n\n## 2. Langkah Penanganan Cepat (Mitigasi)\n1. Langkah 1\n2. Langkah 2\n\n## 3. Investigasi Akar Masalah\n- Log Query:\n- Metrik Grafana:\n\n## 4. Eskalasi & Rujukan\nTautkan ke [[Team On-Call Directory]].`,
    spaceId: null,
  },
  {
    id: "tmpl-adr",
    name: "Architecture Decision Record (ADR)",
    contentStructure: `# ADR: [Judul Keputusan]\n\n## Status\nProposed | Accepted | Superseded\n\n## Konteks & Permasalahan\nJelaskan latar belakang teknis...\n\n## Opsi yang Dipertimbangkan\n1. Opsi A\n2. Opsi B\n\n## Keputusan & Konsekuensi\nOpsi yang dipilih dan dampaknya terhadap arsitektur.`,
    spaceId: null,
  },
];

// Helper to extract wikilinks from text [[Title]]
export function extractWikiLinks(content: string): string[] {
  const matches = content.match(/\[\[(.*?)\]\]/g) || [];
  return Array.from(new Set(matches.map((m) => m.slice(2, -2).trim()).filter(Boolean)));
}

// Compute links table from all pages
function computeLinks(pages: WikiPage[]): WikiLink[] {
  const links: WikiLink[] = [];
  pages.forEach((page) => {
    const titles = extractWikiLinks(page.content);
    titles.forEach((targetTitle, idx) => {
      const targetPage = pages.find(
        (p) => p.title.toLowerCase() === targetTitle.toLowerCase()
      );
      links.push({
        id: `lnk-${page.id}-${idx}`,
        fromPageId: page.id,
        toPageId: targetPage ? targetPage.id : null,
        toPageTitle: targetTitle,
        isBroken: false,
      });
    });
  });
  return links;
}

const INITIAL_DATA: WikiData = {
  spaces: DEFAULT_SPACES,
  pages: DEFAULT_PAGES,
  links: computeLinks(DEFAULT_PAGES),
  revisions: [
    {
      id: "rev-w-1",
      pageId: "page-deploy",
      content: DEFAULT_PAGES[0].content,
      editedBy: "Lead DevOps",
      editedAt: DEFAULT_PAGES[0].updatedAt,
      changeSummary: "Inisiasi awal SOP deployment",
    },
  ],
  contributors: [
    {
      pageId: "page-deploy",
      userId: "user-devops",
      editCount: 1,
      lastEditedAt: DEFAULT_PAGES[0].updatedAt,
    },
  ],
  templates: DEFAULT_TEMPLATES,
};

function loadData(): WikiData {
  try {
    const raw = getRaw(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    const pages = Array.isArray(parsed.pages) ? parsed.pages : INITIAL_DATA.pages;
    return {
      ...INITIAL_DATA,
      ...parsed,
      spaces: Array.isArray(parsed.spaces) ? parsed.spaces : INITIAL_DATA.spaces,
      pages,
      links: computeLinks(pages),
      revisions: Array.isArray(parsed.revisions) ? parsed.revisions : INITIAL_DATA.revisions,
      contributors: Array.isArray(parsed.contributors) ? parsed.contributors : INITIAL_DATA.contributors,
      templates: Array.isArray(parsed.templates) ? parsed.templates : INITIAL_DATA.templates,
    };
  } catch {
    return INITIAL_DATA;
  }
}

function saveData(data: WikiData) {
  try {
    setRaw(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save Wiki data:", e);
  }
}

export function useWikiStore() {
  const [data, setData] = useState<WikiData>(loadData);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const addPage = (page: Omit<WikiPage, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newPage: WikiPage = {
      ...page,
      id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    const newPages = [newPage, ...data.pages];
    const newLinks = computeLinks(newPages);

    const initialRevision: WikiRevision = {
      id: `rev-${Date.now()}`,
      pageId: newPage.id,
      content: newPage.content,
      editedBy: "Current User",
      editedAt: now,
      changeSummary: "Pembuatan halaman baru",
    };

    setData((prev) => ({
      ...prev,
      pages: newPages,
      links: newLinks,
      revisions: [initialRevision, ...prev.revisions],
    }));

    return newPage;
  };

  const updatePage = (
    id: string,
    updates: Partial<Omit<WikiPage, "id" | "createdAt">>,
    changeSummary?: string
  ) => {
    const now = new Date().toISOString();
    setData((prev) => {
      const existing = prev.pages.find((p) => p.id === id);
      if (!existing) return prev;

      let newPages = prev.pages.map((p) => {
        if (p.id === id) {
          return { ...p, ...updates, updatedAt: now };
        }
        // Business Rule: Rename Page updates all inbound wikilinks!
        if (updates.title && updates.title !== existing.title) {
          const oldLinkRegex = new RegExp(`\\[\\[${existing.title}\\]\\]`, "g");
          const replacedContent = p.content.replace(oldLinkRegex, `[[${updates.title}]]`);
          if (replacedContent !== p.content) {
            return { ...p, content: replacedContent, updatedAt: now };
          }
        }
        return p;
      });

      const newLinks = computeLinks(newPages);
      const newRevs = [...prev.revisions];
      if (updates.content && updates.content !== existing.content) {
        newRevs.unshift({
          id: `rev-${Date.now()}`,
          pageId: id,
          content: updates.content,
          editedBy: "Current User",
          editedAt: now,
          changeSummary: changeSummary || "Pembaruan isi halaman",
        });
      }

      return {
        ...prev,
        pages: newPages,
        links: newLinks,
        revisions: newRevs,
      };
    });
  };

  const deletePage = (id: string) => {
    setData((prev) => {
      const deletedPage = prev.pages.find((p) => p.id === id);
      const remainingPages = prev.pages.filter((p) => p.id !== id);

      // Business Rule (§3.3): Links to deleted page become broken
      const updatedLinks = computeLinks(remainingPages).map((l) => {
        if (deletedPage && l.toPageTitle.toLowerCase() === deletedPage.title.toLowerCase()) {
          return { ...l, isBroken: true };
        }
        return l;
      });

      return {
        ...prev,
        pages: remainingPages,
        links: updatedLinks,
        revisions: prev.revisions.filter((r) => r.pageId !== id),
        contributors: prev.contributors.filter((c) => c.pageId !== id),
      };
    });
  };

  const addSpace = (space: Omit<WikiSpace, "id">) => {
    const newSpace: WikiSpace = {
      ...space,
      id: `spc-${Date.now()}`,
    };
    setData((prev) => ({
      ...prev,
      spaces: [...prev.spaces, newSpace],
    }));
    return newSpace;
  };

  // Get automatic Backlinks for a page (§4)
  const getBacklinks = (pageId: string) => {
    const page = data.pages.find((p) => p.id === pageId);
    if (!page) return [];
    return data.links.filter(
      (l) =>
        l.toPageId === pageId ||
        l.toPageTitle.toLowerCase() === page.title.toLowerCase()
    );
  };

  return {
    data,
    spaces: data.spaces,
    pages: data.pages,
    links: data.links,
    revisions: data.revisions,
    contributors: data.contributors,
    templates: data.templates,
    addPage,
    updatePage,
    deletePage,
    addSpace,
    getBacklinks,
  };
}
