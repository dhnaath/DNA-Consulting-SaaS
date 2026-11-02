import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Person,
  Organization,
  ContactMethod,
  Relationship,
  PersonTag,
} from "./types";

interface PeopleStore {
  people: Person[];
  organizations: Organization[];
  contactMethods: ContactMethod[];
  relationships: Relationship[];
  tags: PersonTag[];
  selectedPersonId: string | null;

  // Actions
  createPerson: (
    person: Omit<Person, "id" | "createdAt" | "updatedAt" | "status">,
    initialContact?: { type: ContactMethod["type"]; value: string; label: string }
  ) => string;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  archivePerson: (id: string) => void;
  mergePersons: (targetId: string, sourceId: string) => void;

  addContactMethod: (method: Omit<ContactMethod, "id">) => void;
  removeContactMethod: (id: string) => void;
  setPrimaryContactMethod: (personId: string, methodId: string) => void;

  addRelationship: (rel: Omit<Relationship, "id">) => void;
  removeRelationship: (id: string) => void;

  createOrganization: (org: Omit<Organization, "id">) => string;
  updateOrganization: (id: string, updates: Partial<Organization>) => void;

  createTag: (name: string, color: string) => void;
  setSelectedPersonId: (id: string | null) => void;
}

const INITIAL_ORGS: Organization[] = [
  {
    id: "org-1",
    name: "PT Nusantara Digital Advisory",
    industry: "Management & IT Consulting",
    website: "https://advisory.nusantara.co.id",
    notes: "Entitas konsultan utama (internal team)",
  },
  {
    id: "org-2",
    name: "PT Mandiri Mega Finansial",
    industry: "Banking & Financial Services",
    website: "https://mandirifin.co.id",
    notes: "Klien korporat Tier 1 - Implementasi ERP & Core Banking",
  },
  {
    id: "org-3",
    name: "PT Cloud Hosting Solusindo",
    industry: "Cloud Infrastructure",
    website: "https://solusicloud.id",
    notes: "Vendor penyedia cloud VPS dan SSL",
  },
];

const INITIAL_TAGS: PersonTag[] = [
  { id: "tag-1", name: "Internal", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { id: "tag-2", name: "Klien", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  { id: "tag-3", name: "Vendor", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { id: "tag-4", name: "VIP", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  { id: "tag-5", name: "Stakeholder", color: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
];

const INITIAL_PEOPLE: Person[] = [
  {
    id: "per-01",
    fullName: "Budi Santoso",
    displayName: "Budi",
    personType: "internal",
    userId: "usr-01",
    organizationId: "org-1",
    jobTitle: "Principal Consultant & Delivery Lead",
    notes: "Penanggung jawab utama proyek transformasi perbankan.",
    status: "active",
    tags: ["Internal", "Stakeholder"],
    createdAt: "2026-08-01T08:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
  },
  {
    id: "per-02",
    fullName: "Siti Rahmawati",
    displayName: "Siti",
    personType: "internal",
    userId: "usr-02",
    organizationId: "org-1",
    jobTitle: "Lead Solutions Architect",
    notes: "Arsitek teknis sistem terdistribusi & keamanan siber.",
    status: "active",
    tags: ["Internal"],
    createdAt: "2026-08-05T09:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
  },
  {
    id: "per-03",
    fullName: "Ir. Hendra Gunawan",
    displayName: "Pak Hendra",
    personType: "external",
    organizationId: "org-2",
    jobTitle: "VP Information Technology",
    notes: "Pengambil keputusan utama pengadaan di PT Mandiri Mega Finansial.",
    status: "active",
    tags: ["Klien", "VIP", "Stakeholder"],
    createdAt: "2026-08-15T11:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
  },
  {
    id: "per-04",
    fullName: "Maya Kusuma",
    displayName: "Maya",
    personType: "external",
    organizationId: "org-2",
    jobTitle: "Project Manager IT Governance",
    notes: "Kontak operasional teknis harian dari sisi klien.",
    status: "active",
    tags: ["Klien"],
    createdAt: "2026-08-16T14:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
  },
  {
    id: "per-05",
    fullName: "Rian Fajar Pratama",
    displayName: "Rian",
    personType: "external",
    organizationId: "org-3",
    jobTitle: "Senior Account Manager Cloud",
    notes: "Pengelola SLA server infrastruktur dan kontrak tahunan.",
    status: "active",
    tags: ["Vendor"],
    createdAt: "2026-08-20T10:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
  },
  {
    id: "per-06",
    fullName: "Hendra Gunawan (Alt)",
    displayName: "Hendra G.",
    personType: "external",
    organizationId: "org-2",
    jobTitle: "VP IT Mandiri",
    notes: "Kandidat duplikat dari kartu nama lama.",
    status: "active",
    tags: ["Klien"],
    createdAt: "2026-09-01T15:00:00Z",
    updatedAt: "2026-09-24T00:00:00Z",
  },
];

const INITIAL_CONTACT_METHODS: ContactMethod[] = [
  {
    id: "cm-01",
    personId: "per-01",
    type: "email",
    value: "budi.santoso@advisory.nusantara.co.id",
    label: "Email Kerja",
    isPrimary: true,
  },
  {
    id: "cm-02",
    personId: "per-01",
    type: "phone",
    value: "+62 811-2345-6789",
    label: "WhatsApp / Mobile",
    isPrimary: false,
  },
  {
    id: "cm-03",
    personId: "per-02",
    type: "email",
    value: "siti.rahma@advisory.nusantara.co.id",
    label: "Email Kerja",
    isPrimary: true,
  },
  {
    id: "cm-04",
    personId: "per-03",
    type: "email",
    value: "hendra.gunawan@mandirifin.co.id",
    label: "Email Korporat",
    isPrimary: true,
  },
  {
    id: "cm-05",
    personId: "per-03",
    type: "phone",
    value: "+62 812-9988-7766",
    label: "WhatsApp Kantor",
    isPrimary: false,
  },
  {
    id: "cm-06",
    personId: "per-04",
    type: "email",
    value: "maya.kusuma@mandirifin.co.id",
    label: "Email Kantor",
    isPrimary: true,
  },
  {
    id: "cm-07",
    personId: "per-05",
    type: "email",
    value: "rian@solusicloud.id",
    label: "Email Dukungan",
    isPrimary: true,
  },
  {
    id: "cm-08",
    personId: "per-06",
    type: "email",
    value: "hendra.gunawan@mandirifin.co.id", // duplicate email
    label: "Email",
    isPrimary: true,
  },
];

const INITIAL_RELATIONSHIPS: Relationship[] = [
  {
    id: "rel-01",
    fromPersonId: "per-02",
    toPersonId: "per-01",
    type: "reports_to",
    note: "Siti melapor langsung ke Budi Santoso untuk deliverable arsitektur.",
  },
  {
    id: "rel-02",
    fromPersonId: "per-01",
    toPersonId: "per-02",
    type: "manager_of",
    note: "Budi adalah atasan teknis Siti.",
  },
  {
    id: "rel-03",
    fromPersonId: "per-04",
    toPersonId: "per-03",
    type: "reports_to",
    note: "Maya melapor ke Pak Hendra di divisi IT Governance.",
  },
  {
    id: "rel-04",
    fromPersonId: "per-01",
    toOrganizationId: "org-2",
    type: "client_of",
    note: "Konsultan penasihat untuk PT Mandiri Mega Finansial.",
  },
];

export const usePeopleStore = create<PeopleStore>()(
  persist(
    (set, get) => ({
      people: INITIAL_PEOPLE,
      organizations: INITIAL_ORGS,
      contactMethods: INITIAL_CONTACT_METHODS,
      relationships: INITIAL_RELATIONSHIPS,
      tags: INITIAL_TAGS,
      selectedPersonId: null,

      createPerson: (data, initialContact) => {
        const id = `per-${Date.now()}`;
        const now = new Date().toISOString();
        const newPerson: Person = {
          ...data,
          id,
          status: "active",
          createdAt: now,
          updatedAt: now,
        };

        const newMethods: ContactMethod[] = [...get().contactMethods];
        if (initialContact && initialContact.value.trim()) {
          newMethods.push({
            id: `cm-${Date.now()}`,
            personId: id,
            type: initialContact.type,
            value: initialContact.value.trim(),
            label: initialContact.label || "Utama",
            isPrimary: true,
          });
        }

        set((state) => ({
          people: [newPerson, ...state.people],
          contactMethods: newMethods,
        }));

        return id;
      },

      updatePerson: (id, updates) => {
        set((state) => ({
          people: state.people.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      deletePerson: (id) => {
        set((state) => ({
          people: state.people.filter((p) => p.id !== id),
          contactMethods: state.contactMethods.filter((c) => c.personId !== id),
          relationships: state.relationships.filter(
            (r) => r.fromPersonId !== id && r.toPersonId !== id
          ),
          selectedPersonId: state.selectedPersonId === id ? null : state.selectedPersonId,
        }));
      },

      archivePerson: (id) => {
        set((state) => ({
          people: state.people.map((p) =>
            p.id === id ? { ...p, status: "archived", updatedAt: new Date().toISOString() } : p
          ),
        }));
      },

      mergePersons: (targetId, sourceId) => {
        const { people, contactMethods, relationships } = get();
        const target = people.find((p) => p.id === targetId);
        const source = people.find((p) => p.id === sourceId);
        if (!target || !source) return;

        // Move contact methods from source to target
        const updatedContacts = contactMethods.map((cm) =>
          cm.personId === sourceId ? { ...cm, personId: targetId } : cm
        );

        // Move relationships
        const updatedRels = relationships.map((r) => {
          let updated = { ...r };
          if (updated.fromPersonId === sourceId) updated.fromPersonId = targetId;
          if (updated.toPersonId === sourceId) updated.toPersonId = targetId;
          return updated;
        });

        // Merge tags
        const combinedTags = Array.from(new Set([...target.tags, ...source.tags]));

        set((state) => ({
          people: state.people
            .filter((p) => p.id !== sourceId)
            .map((p) =>
              p.id === targetId
                ? {
                    ...p,
                    tags: combinedTags,
                    notes: `${p.notes || ""}\n[Merged with ${source.fullName}]: ${source.notes || ""}`.trim(),
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
          contactMethods: updatedContacts,
          relationships: updatedRels,
          selectedPersonId: targetId,
        }));
      },

      addContactMethod: (data) => {
        const newCm: ContactMethod = {
          ...data,
          id: `cm-${Date.now()}`,
        };
        set((state) => ({ contactMethods: [...state.contactMethods, newCm] }));
      },

      removeContactMethod: (id) => {
        set((state) => ({
          contactMethods: state.contactMethods.filter((c) => c.id !== id),
        }));
      },

      setPrimaryContactMethod: (personId, methodId) => {
        set((state) => ({
          contactMethods: state.contactMethods.map((c) =>
            c.personId === personId ? { ...c, isPrimary: c.id === methodId } : c
          ),
        }));
      },

      addRelationship: (data) => {
        const newRel: Relationship = {
          ...data,
          id: `rel-${Date.now()}`,
        };
        set((state) => ({ relationships: [...state.relationships, newRel] }));
      },

      removeRelationship: (id) => {
        set((state) => ({
          relationships: state.relationships.filter((r) => r.id !== id),
        }));
      },

      createOrganization: (data) => {
        const id = `org-${Date.now()}`;
        const newOrg: Organization = {
          ...data,
          id,
        };
        set((state) => ({ organizations: [...state.organizations, newOrg] }));
        return id;
      },

      updateOrganization: (id, updates) => {
        set((state) => ({
          organizations: state.organizations.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        }));
      },

      createTag: (name, color) => {
        const newTag: PersonTag = {
          id: `tag-${Date.now()}`,
          name,
          color,
        };
        set((state) => ({ tags: [...state.tags, newTag] }));
      },

      setSelectedPersonId: (id) => set({ selectedPersonId: id }),
    }),
    {
      name: "ecosystem-people-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
