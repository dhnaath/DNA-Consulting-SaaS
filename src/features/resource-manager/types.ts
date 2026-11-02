export type ResourceTypeKey =
  | 'person'
  | 'equipment'
  | 'material'
  | 'budget'
  | 'room'
  | 'vehicle'
  | 'software_license';

export type AllocationTargetType = 'project' | 'task' | 'deliverable';

export type AllocationStatus = 'planned' | 'active' | 'completed' | 'cancelled';

export interface Resource {
  id: string;
  name: string;
  type: ResourceTypeKey;
  capacityUnit: string; // e.g. "jam/minggu", "unit", "Rp", "slot waktu", "seat", "kg"
  totalCapacity: number;
  isExclusive?: boolean; // true if only one user at a time (e.g., meeting room, vehicle)
  personRef?: string;    // reference to People Manager (#35)
  notes?: string;
  createdAt: string;
}

export interface Allocation {
  id: string;
  resourceId: string;
  resourceName: string;
  allocatedToType: AllocationTargetType;
  allocatedToId: string;
  allocatedToTitle: string;
  amount: number;
  periodStart: string; // e.g. "2026-09-24" or "2026-09-24T09:00"
  periodEnd: string;   // e.g. "2026-09-24" or "2026-09-24T12:00"
  status: AllocationStatus;
}

export interface ConflictRecord {
  id: string;
  resourceId: string;
  resourceName: string;
  conflictingAllocationIds: string[];
  detectedAt: string;
  resolved: boolean;
  resolutionNote?: string;
}

export type ResourceViewMode =
  | 'list'
  | 'capacity_overview'
  | 'allocation_calendar'
  | 'conflicts'
  | 'by_project'
  | 'stats';
