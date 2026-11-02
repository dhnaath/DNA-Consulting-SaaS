export type PersonType = 'internal' | 'external';
export type PersonStatus = 'active' | 'archived';

export type ContactMethodType = 'email' | 'phone' | 'messaging_app' | 'social_media';

export interface ContactMethod {
  id: string;
  personId: string;
  type: ContactMethodType;
  value: string;
  label: string; // e.g. "Kerja", "Pribadi", "WhatsApp", "LinkedIn"
  isPrimary: boolean;
}

export interface Organization {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  notes?: string;
}

export type RelationshipType =
  | 'colleague'
  | 'manager_of'
  | 'reports_to'
  | 'client_of'
  | 'vendor_of'
  | 'friend'
  | 'family';

export interface Relationship {
  id: string;
  fromPersonId: string;
  toPersonId?: string;
  toOrganizationId?: string;
  type: RelationshipType;
  note?: string;
  startedAt?: string;
  endedAt?: string;
}

export interface PersonTag {
  id: string;
  name: string; // e.g. "Klien", "Vendor", "Alumni", "VIP"
  color: string;
}

export interface Person {
  id: string;
  fullName: string;
  displayName?: string;
  personType: PersonType;
  userId?: string; // system user if internal
  organizationId?: string;
  jobTitle?: string;
  notes?: string;
  status: PersonStatus;
  tags: string[]; // tag IDs or names
  createdAt: string;
  updatedAt: string;
}

export type PeopleViewMode =
  | 'all'
  | 'by_organization'
  | 'by_tag'
  | 'relationships'
  | 'duplicates'
  | 'stats';
