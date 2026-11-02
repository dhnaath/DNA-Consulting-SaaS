export interface WikiSpace {
  id: string;
  name: string;
  description?: string;
  visibility: "private" | "team" | "public";
  ownerId?: string;
}

export interface WikiPage {
  id: string;
  title: string;
  content: string; // supports [[Wiki Link]]
  spaceId: string;
  parentPageId?: string | null;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface WikiLink {
  id: string;
  fromPageId: string;
  toPageId?: string | null; // nullable if pending
  toPageTitle: string;
  context?: string;
  isBroken: boolean;
}

export interface WikiRevision {
  id: string;
  pageId: string;
  content: string;
  editedBy: string;
  editedAt: string;
  changeSummary?: string;
}

export interface WikiContributor {
  pageId: string;
  userId: string;
  editCount: number;
  lastEditedAt: string;
}

export interface WikiTemplate {
  id: string;
  name: string;
  contentStructure: string;
  spaceId?: string | null;
}

export interface WikiData {
  spaces: WikiSpace[];
  pages: WikiPage[];
  links: WikiLink[];
  revisions: WikiRevision[];
  contributors: WikiContributor[];
  templates: WikiTemplate[];
}
