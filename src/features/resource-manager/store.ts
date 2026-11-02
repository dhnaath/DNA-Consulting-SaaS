import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createWorkspaceStorage } from "../../core/persistStorage";
import {
  Resource,
  Allocation,
  ConflictRecord,
  AllocationStatus,
} from "./types";

interface ResourceStore {
  resources: Resource[];
  allocations: Allocation[];
  conflicts: ConflictRecord[];
  selectedResourceId: string | null;

  // Actions
  createResource: (res: Omit<Resource, "id" | "createdAt">) => string;
  updateResource: (id: string, updates: Partial<Resource>) => void;
  deleteResource: (id: string) => void;

  createAllocation: (alloc: Omit<Allocation, "id">) => { allocationId: string; hasConflict: boolean };
  updateAllocationStatus: (id: string, status: AllocationStatus) => void;
  releaseAllocation: (id: string) => void;

  resolveConflict: (conflictId: string, resolutionNote: string) => void;
  setSelectedResourceId: (id: string | null) => void;
}

const INITIAL_RESOURCES: Resource[] = [
  {
    id: "res-01",
    name: "Budi Santoso (Delivery Lead)",
    type: "person",
    capacityUnit: "jam/minggu",
    totalCapacity: 40,
    isExclusive: false,
    personRef: "per-01",
    notes: "Kapasitas konsultan senior full-time",
    createdAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "res-02",
    name: "Siti Rahmawati (Lead Architect)",
    type: "person",
    capacityUnit: "jam/minggu",
    totalCapacity: 40,
    isExclusive: false,
    personRef: "per-02",
    notes: "Kapasitas arsitek cloud & keamanan",
    createdAt: "2026-08-01T00:00:00Z",
  },
  {
    id: "res-03",
    name: "Ruang Rapat Utama (Boardroom Alpha)",
    type: "room",
    capacityUnit: "slot jam",
    totalCapacity: 8,
    isExclusive: true,
    notes: "Kapasitas 16 orang, layar proyektor 4K & Zoom Rooms",
    createdAt: "2026-08-05T00:00:00Z",
  },
  {
    id: "res-04",
    name: "Mobil Operasional Innova Zenix #01",
    type: "vehicle",
    capacityUnit: "unit",
    totalCapacity: 1,
    isExclusive: true,
    notes: "Kendaraan operasional dinas luar kota / kunjungan klien",
    createdAt: "2026-08-10T00:00:00Z",
  },
  {
    id: "res-05",
    name: "Budget Proyek Transformasi Digital Q4",
    type: "budget",
    capacityUnit: "Rp",
    totalCapacity: 500000000,
    isExclusive: false,
    notes: "Alokasi batas atas pagu anggaran belanja modal & operasional",
    createdAt: "2026-08-15T00:00:00Z",
  },
  {
    id: "res-06",
    name: "Lisensi Figma Enterprise",
    type: "software_license",
    capacityUnit: "seat",
    totalCapacity: 15,
    isExclusive: false,
    notes: "Langganan tahunan paket Figma Org / Enterprise",
    createdAt: "2026-08-20T00:00:00Z",
  },
  {
    id: "res-07",
    name: "MacBook Pro M3 Pro (Lab Test Unit)",
    type: "equipment",
    capacityUnit: "unit",
    totalCapacity: 1,
    isExclusive: true,
    notes: "Laptop pengujian build staging & performance benchmark",
    createdAt: "2026-08-22T00:00:00Z",
  },
];

const INITIAL_ALLOCATIONS: Allocation[] = [
  {
    id: "alloc-01",
    resourceId: "res-01",
    resourceName: "Budi Santoso (Delivery Lead)",
    allocatedToType: "project",
    allocatedToId: "prj-01",
    allocatedToTitle: "Implementasi Core Banking Mandiri",
    amount: 25,
    periodStart: "2026-09-21",
    periodEnd: "2026-09-27",
    status: "active",
  },
  {
    id: "alloc-02",
    resourceId: "res-01",
    resourceName: "Budi Santoso (Delivery Lead)",
    allocatedToType: "project",
    allocatedToId: "prj-02",
    allocatedToTitle: "Audit ISO 27001 Data Privacy",
    amount: 20, // 25 + 20 = 45 > 40! Overallocated!
    periodStart: "2026-09-21",
    periodEnd: "2026-09-27",
    status: "active",
  },
  {
    id: "alloc-03",
    resourceId: "res-02",
    resourceName: "Siti Rahmawati (Lead Architect)",
    allocatedToType: "project",
    allocatedToId: "prj-01",
    allocatedToTitle: "Implementasi Core Banking Mandiri",
    amount: 30,
    periodStart: "2026-09-21",
    periodEnd: "2026-09-27",
    status: "active",
  },
  {
    id: "alloc-04",
    resourceId: "res-03",
    resourceName: "Ruang Rapat Utama (Boardroom Alpha)",
    allocatedToType: "task",
    allocatedToId: "tsk-01",
    allocatedToTitle: "Kickoff Transformasi Digital Eksekutif",
    amount: 2,
    periodStart: "2026-09-25T09:00",
    periodEnd: "2026-09-25T11:00",
    status: "active",
  },
  {
    id: "alloc-05",
    resourceId: "res-03",
    resourceName: "Ruang Rapat Utama (Boardroom Alpha)",
    allocatedToType: "task",
    allocatedToId: "tsk-02",
    allocatedToTitle: "Tinjauan Arsitektur Vendor Cloud",
    amount: 2,
    periodStart: "2026-09-25T10:00", // Overlaps with alloc-04!
    periodEnd: "2026-09-25T12:00",
    status: "active",
  },
  {
    id: "alloc-06",
    resourceId: "res-05",
    resourceName: "Budget Proyek Transformasi Digital Q4",
    allocatedToType: "project",
    allocatedToId: "prj-01",
    allocatedToTitle: "Implementasi Core Banking Mandiri",
    amount: 285000000,
    periodStart: "2026-09-01",
    periodEnd: "2026-12-31",
    status: "active",
  },
  {
    id: "alloc-07",
    resourceId: "res-06",
    resourceName: "Lisensi Figma Enterprise",
    allocatedToType: "project",
    allocatedToId: "prj-01",
    allocatedToTitle: "Design System Perbankan",
    amount: 8,
    periodStart: "2026-09-01",
    periodEnd: "2026-10-31",
    status: "active",
  },
];

const INITIAL_CONFLICTS: ConflictRecord[] = [
  {
    id: "conf-01",
    resourceId: "res-03",
    resourceName: "Ruang Rapat Utama (Boardroom Alpha)",
    conflictingAllocationIds: ["alloc-04", "alloc-05"],
    detectedAt: "2026-09-24T08:00:00Z",
    resolved: false,
    resolutionNote: "Slot tumpang tindih antara 10:00 - 11:00 pada tanggal 25 September.",
  },
];

export const useResourceStore = create<ResourceStore>()(
  persist(
    (set, get) => ({
      resources: INITIAL_RESOURCES,
      allocations: INITIAL_ALLOCATIONS,
      conflicts: INITIAL_CONFLICTS,
      selectedResourceId: null,

      createResource: (data) => {
        const id = `res-${Date.now()}`;
        const newRes: Resource = {
          ...data,
          id,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ resources: [...state.resources, newRes] }));
        return id;
      },

      updateResource: (id, updates) => {
        set((state) => ({
          resources: state.resources.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        }));
      },

      deleteResource: (id) => {
        set((state) => ({
          resources: state.resources.filter((r) => r.id !== id),
          allocations: state.allocations.filter((a) => a.resourceId !== id),
          conflicts: state.conflicts.filter((c) => c.resourceId !== id),
          selectedResourceId: state.selectedResourceId === id ? null : state.selectedResourceId,
        }));
      },

      createAllocation: (data) => {
        const { resources, allocations, conflicts } = get();
        const res = resources.find((r) => r.id === data.resourceId);
        const allocId = `alloc-${Date.now()}`;
        const newAlloc: Allocation = {
          ...data,
          id: allocId,
        };

        let hasConflict = false;
        let newConflicts = [...conflicts];

        // Exclusive resource conflict check
        if (res?.isExclusive) {
          const overlapping = allocations.filter((a) => {
            if (a.resourceId !== data.resourceId) return false;
            if (a.status !== "active" && a.status !== "planned") return false;

            // Check datetime overlap
            const startA = new Date(data.periodStart).getTime();
            const endA = new Date(data.periodEnd).getTime();
            const startB = new Date(a.periodStart).getTime();
            const endB = new Date(a.periodEnd).getTime();

            return Math.max(startA, startB) < Math.min(endA, endB);
          });

          if (overlapping.length > 0) {
            hasConflict = true;
            newConflicts.push({
              id: `conf-${Date.now()}`,
              resourceId: data.resourceId,
              resourceName: data.resourceName,
              conflictingAllocationIds: [allocId, ...overlapping.map((o) => o.id)],
              detectedAt: new Date().toISOString(),
              resolved: false,
              resolutionNote: `Tumpang tindih rentang waktu dengan ${overlapping.length} alokasi aktif.`,
            });
          }
        }

        set({
          allocations: [newAlloc, ...allocations],
          conflicts: newConflicts,
        });

        return { allocationId: allocId, hasConflict };
      },

      updateAllocationStatus: (id, status) => {
        set((state) => ({
          allocations: state.allocations.map((a) => (a.id === id ? { ...a, status } : a)),
        }));
      },

      releaseAllocation: (id) => {
        set((state) => ({
          allocations: state.allocations.map((a) =>
            a.id === id ? { ...a, status: "completed" } : a
          ),
        }));
      },

      resolveConflict: (conflictId, resolutionNote) => {
        set((state) => ({
          conflicts: state.conflicts.map((c) =>
            c.id === conflictId ? { ...c, resolved: true, resolutionNote } : c
          ),
        }));
      },

      setSelectedResourceId: (id) => set({ selectedResourceId: id }),
    }),
    {
      name: "ecosystem-resource-manager-storage",
      storage: createWorkspaceStorage(),
    }
  )
);
