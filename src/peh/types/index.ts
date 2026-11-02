export type WorkspaceId = 'peh' | 'pfs' | 'poo';

// --- Workspace 1: Personal, Essentials, Household (PEH) ---
export type PEHCategory = 'overview' | 'personal' | 'essentials' | 'household' | 'comparison';
export type PersonalAppId = 'habits' | 'journal' | 'goals' | 'reading' | 'fitness' | 'sleep';
export type EssentialsAppId = 'vault' | 'documents' | 'subscriptions' | 'budget' | 'insurance';
export type HouseholdAppId = 'pantry' | 'maintenance' | 'chores' | 'plants' | 'vehicles';

// --- Workspace 2: People, Family, Society (PFS) ---
export type PFSCategory = 'overview' | 'people' | 'family' | 'society' | 'comparison';
export type PeopleAppId = 'contacts' | 'milestones' | 'gifts' | 'mentorship' | 'introductions';
export type FamilyAppId = 'family_tree' | 'family_health' | 'traditions' | 'family_recipes' | 'family_budget' | 'pet_care';
export type SocietyAppId = 'civic' | 'volunteering' | 'charity' | 'community_events' | 'advocacy';

// --- Workspace 3: Productivity, Operations, Ownership (POO) ---
export type POOCategory = 'overview' | 'productivity' | 'operations' | 'ownership' | 'comparison';
export type ProductivityAppId = 'projects' | 'tasks' | 'knowledge' | 'time_audit' | 'meetings';
export type OperationsAppId = 'workflows' | 'vendors' | 'incidents' | 'procurement' | 'compliance';
export type OwnershipAppId = 'assets' | 'ip_licenses' | 'cap_table' | 'investments' | 'real_estate';

export type MainCategory = PEHCategory | PFSCategory | POOCategory;

export type StandaloneAppId =
  | 'overview'
  | 'comparison'
  | 'innovations'
  | PersonalAppId
  | EssentialsAppId
  | HouseholdAppId
  | PeopleAppId
  | FamilyAppId
  | SocietyAppId
  | ProductivityAppId
  | OperationsAppId
  | OwnershipAppId;

export interface CategoryDefinition {
  id: MainCategory;
  name: string;
  description: string;
  iconName: string;
  apps: AppDefinition[];
}

export interface AppDefinition {
  id: StandaloneAppId;
  categoryId: MainCategory;
  name: string;
  shortDesc: string;
  iconName: string;
  subMenus: { id: string; label: string; iconName: string }[];
}

// ==========================================
// DATA TYPES: PEH (Personal, Essentials, Household)
// ==========================================

export interface HabitItem {
  id: string;
  title: string;
  category: 'Kesehatan' | 'Produktivitas' | 'Pikiran' | 'Kebugaran' | 'Lainnya';
  frequency: 'Harian' | 'Hari Kerja' | 'Akhir Pekan' | 'Mingguan';
  targetDaysPerWeek: number;
  timeOfDay: 'Pagi' | 'Siang' | 'Sore' | 'Malam' | 'Fleksibel';
  completedDates: string[]; // YYYY-MM-DD
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'Sangat Baik' | 'Produktif' | 'Tenang' | 'Lelah' | 'Stres' | 'Reflektif';
  tags: string[];
  date: string;
  createdAt: string;
}

export interface GoalItem {
  id: string;
  title: string;
  targetDate: string;
  category: 'Karier' | 'Finansial' | 'Keluarga' | 'Keahlian' | 'Kesehatan';
  status: 'Aktif' | 'Ditunda' | 'Selesai';
  milestones: { id: string; title: string; completed: boolean }[];
  notes: string;
  createdAt: string;
}

export interface VaultItem {
  id: string;
  title: string;
  type: 'Login / Akun' | 'Kunci API / Token' | 'PIN & Sandi Kartu' | 'Catatan Rahasia';
  identifier: string;
  secretValue: string;
  serviceUrl?: string;
  notes?: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Identitas & Sipil' | 'Garansi Barang' | 'Asuransi & Polis' | 'Kontrak & Properti' | 'Lainnya';
  identifierNumber?: string;
  physicalLocation: string;
  issueDate?: string;
  expiryDate?: string;
  tags: string[];
  createdAt: string;
}

export interface SubscriptionItem {
  id: string;
  serviceName: string;
  category: 'Hiburan & Streaming' | 'Produktivitas & Cloud' | 'Utilitas Rumah' | 'Gym & Keanggotaan' | 'Lainnya';
  cost: number;
  billingCycle: 'Bulanan' | 'Tahunan' | 'Mingguan';
  renewalDate: string;
  paymentMethod: string;
  autoRenew: boolean;
  createdAt: string;
}

export interface PantryItem {
  id: string;
  name: string;
  category: 'Bahan Pokok' | 'Bumbu & Saus' | 'Sayur & Buah' | 'Daging & Protein' | 'Minuman' | 'Perlengkapan Rumah';
  quantity: number;
  unit: 'pcs' | 'kg' | 'gram' | 'liter' | 'pack' | 'botol';
  storageZone: 'Kulkas' | 'Freezer' | 'Pantry Kering' | 'Rak Dapur';
  minStockAlert: number;
  expiryDate?: string;
  isRestockNeeded: boolean;
  createdAt: string;
}

export interface MaintenanceItem {
  id: string;
  assetName: string;
  location: 'Kamar Tidur' | 'Ruang Tamu' | 'Dapur' | 'Kamar Mandi' | 'Luar / Garasi';
  serviceType: 'Servis Berkala' | 'Pembersihan / Sanitasi' | 'Penggantian Filter' | 'Perbaikan Kerusakan';
  intervalMonths: number;
  lastServicedDate: string;
  nextDueDate: string;
  technicianContact?: string;
  estimatedCost?: number;
  createdAt: string;
}

export interface ChoreItem {
  id: string;
  title: string;
  assignee: string;
  frequency: 'Harian' | '2 Hari Sekali' | 'Mingguan' | 'Dua Mingguan' | 'Bulanan';
  room: 'Dapur' | 'Ruang Tengah' | 'Halaman' | 'Kamar Mandi' | 'Seluruh Rumah';
  lastCompletedDate?: string;
  createdAt: string;
}

export interface SharedExpenseItem {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  splitWith: string[];
  dueDate: string;
  isSettled: boolean;
  createdAt: string;
}

// ==========================================
// DATA TYPES: PFS (People, Family, Society)
// ==========================================

// 1. People: Personal Contacts CRM
export interface ContactItem {
  id: string;
  fullName: string;
  relationship: 'Keluarga Inti' | 'Keluarga Besar' | 'Sahabat' | 'Rekan Kerja' | 'Mentor / Guru' | 'Kenalan';
  phone?: string;
  email?: string;
  howWeMet?: string;
  lastContactedDate?: string;
  contactCadenceDays: number; // e.g. every 30 days
  tags: string[];
  notes?: string;
  createdAt: string;
}

// 2. People: Milestones & Anniversaries
export interface MilestoneItem {
  id: string;
  title: string;
  personName: string;
  eventType: 'Ulang Tahun' | 'Hari Jadi Pernikahan' | 'Kelulusan / Promosi' | 'Peringatan Hari Wafat' | 'Lainnya';
  date: string; // YYYY-MM-DD or MM-DD
  reminderDaysBefore: number;
  notes?: string;
  createdAt: string;
}

// 3. People: Gifting & Favors
export interface GiftItem {
  id: string;
  personName: string;
  itemDescription: string;
  direction: 'Ide Hadiah Keluar' | 'Hadiah Diterima' | 'Budi & Saling Bantu';
  occasion: string; // e.g. "Ulang Tahun ke-30", "Syukuran Rumah"
  estimatedValue?: number;
  isFulfilled: boolean;
  notes?: string;
  createdAt: string;
}

// 4. Family: Family Tree & Members
export interface FamilyMemberItem {
  id: string;
  fullName: string;
  role: 'Orang Tua' | 'Pasangan' | 'Anak' | 'Kakek / Nenek' | 'Paman / Bibi' | 'Sepupu' | 'Keponakan' | 'Lainnya';
  generationLevel: 1 | 2 | 3 | 4; // 1 = Kakek/Nenek, 2 = Orangtua/Paman, 3 = Kita/Pasangan/Sepupu, 4 = Anak/Keponakan
  birthDate?: string;
  birthCity?: string;
  phone?: string;
  domicileCity?: string;
  notes?: string;
  createdAt: string;
}

// 5. Family: Health Records & Allergies
export interface FamilyHealthItem {
  id: string;
  memberName: string;
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'Belum Diketahui';
  allergies: string[]; // e.g. "Antibiotik Penisilin", "Kacang"
  chronicConditions: string[]; // e.g. "Hipertensi", "Asma"
  regularMedicines: string[];
  emergencyContact?: string;
  lastMedicalCheckup?: string;
  notes?: string;
  createdAt: string;
}

// 6. Family: Traditions & Gatherings
export interface TraditionItem {
  id: string;
  title: string;
  category: 'Arisan Berkala' | 'Mudik & Hari Raya' | 'Reuni Akbar Tahunan' | 'Ziarah & Doa Bersama' | 'Tradisi Khusus';
  frequency: 'Bulanan' | 'Tahunan' | 'Hari Raya' | 'Insidental';
  nextDate: string;
  leadOrganizer: string;
  venueOrLocation: string;
  budgetEstimate?: number;
  notes?: string;
  createdAt: string;
}

// 7. Society: Community & Civic RT/RW
export interface CivicItem {
  id: string;
  nameOrOfficial: string;
  role: 'Ketua RT / RW' | 'Petugas Keamanan / Ronda' | 'Petugas Sampah / Kebersihan' | 'Kader Posyandu' | 'Warga Koordinator' | 'Fasilitas Umum';
  areaName: string; // e.g. "RT 04 / RW 08 Kompleks Dahlia"
  phone: string;
  isEmergencyContact: boolean;
  address?: string;
  notes?: string;
  createdAt: string;
}

// 8. Society: Volunteering & Community Initiatives
export interface VolunteerItem {
  id: string;
  initiativeTitle: string;
  organization: string;
  causeType: 'Pendidikan Anak' | 'Kemanusiaan & Bencana' | 'Kelestarian Lingkungan' | 'Sosial & Panti' | 'Komunitas Warga';
  roleOrContribution: string;
  hoursSpent: number;
  eventDate: string;
  impactNotes?: string;
  createdAt: string;
}

// 9. Society: Charity, Philanthropy & Donasi
export interface CharityItem {
  id: string;
  causeTitle: string;
  beneficiaryOrOrg: string;
  category: 'Zakat / Infak' | 'Bencana Alam' | 'Beasiswa Pendidikan' | 'Panti Asuhan' | 'Pembangunan Sosial' | 'Lainnya';
  amount: number;
  date: string;
  isRecurring: boolean;
  notes?: string;
  createdAt: string;
}

// ==========================================
// DATA TYPES: POO (Productivity, Operations, Ownership)
// ==========================================

// 1. Productivity: Projects & Deliverables
export interface ProjectItem {
  id: string;
  title: string;
  clientOrOrg?: string;
  category: 'Pengembangan Produk' | 'Klien & Servis' | 'Internal / Inisiatif' | 'Pemasaran & Konten';
  status: 'Perencanaan' | 'Sedang Berjalan' | 'Review / Evaluasi' | 'Selesai';
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  progressPercent: number; // 0 - 100
  deadline: string;
  budget?: number;
  description?: string;
  createdAt: string;
}

// 2. Productivity: Tasks & Deep Work (Eisenhower Matrix)
export interface TaskItem {
  id: string;
  title: string;
  projectId?: string;
  priorityQuadrant: 'Q1: Penting & Mendesak' | 'Q2: Penting & Tidak Mendesak' | 'Q3: Mendesak & Tidak Penting' | 'Q4: Tidak Penting & Tidak Mendesak';
  status: 'Backlog' | 'Todo' | 'Sedang Dikerjakan' | 'Selesai';
  dueDate: string;
  estimatedHours: number;
  tags?: string[];
  createdAt: string;
}

// 3. Productivity: Knowledge Base & SOP
export interface KnowledgeItem {
  id: string;
  title: string;
  docType: 'SOP & Prosedur' | 'Playbook Strategi' | 'Template Dokumen' | 'Catatan Teknis';
  department: 'Operasional' | 'Teknologi & Produk' | 'Pemasaran & Penjualan' | 'Keuangan & Legal';
  summary: string;
  content: string;
  tags?: string[];
  lastUpdated: string;
  createdAt: string;
}

// 4. Operations: Workflows & Pipelines
export interface WorkflowItem {
  id: string;
  workflowName: string;
  department: string;
  stages: string[];
  currentStageIndex: number;
  leadAssignee: string;
  cycleTimeDays: number;
  status: 'Aktif Berjalan' | 'Tertunda' | 'Selesai';
  notes?: string;
  createdAt: string;
}

// 5. Operations: Vendors & Service Partners
export interface VendorItem {
  id: string;
  companyName: string;
  serviceCategory: 'Cloud & SaaS' | 'Logistik & Ekspedisi' | 'Konsultan & Agensi' | 'Penyedia Bahan Baku' | 'Perangkat Keras';
  contactPerson: string;
  emailOrPhone: string;
  contractValue: number;
  paymentCycle: 'Bulanan' | 'Tahunan' | 'Per Proyek';
  renewalDate: string;
  slaRating: 'A (Sangat Baik)' | 'B (Standar)' | 'C (Perlu Evaluasi)';
  notes?: string;
  createdAt: string;
}

// 6. Operations: Incidents & Issue Tracker
export interface IncidentItem {
  id: string;
  issueTitle: string;
  severity: 'Kritis (P1)' | 'Tinggi (P2)' | 'Sedang (P3)' | 'Rendah (P4)';
  systemAffected: string;
  status: 'Investigasi' | 'Penanganan Berjalan' | 'Terselesaikan' | 'Post-Mortem';
  reportedDate: string;
  rootCause?: string;
  resolutionNotes?: string;
  downtimeMinutes?: number;
  createdAt: string;
}

// 7. Ownership: Capital Assets & Equipment
export interface CapitalAssetItem {
  id: string;
  assetName: string;
  category: 'Perangkat IT & Server' | 'Mesin & Alat Produksi' | 'Kendaraan Operasional' | 'Properti & Ruang Kerja' | 'Portofolio Finansial';
  serialOrCode: string;
  purchaseValue: number;
  currentValuation: number;
  purchaseDate: string;
  locationOrAssignee: string;
  status: 'Aktif Dipakai' | 'Dalam Perbaikan' | 'Cadangan' | 'Dijual / Pensiun';
  notes?: string;
  createdAt: string;
}

// 8. Ownership: IP, Domains & Licenses
export interface IpLicenseItem {
  id: string;
  titleOrDomain: string;
  type: 'Merek Dagang / Paten' | 'Domain & Hosting' | 'Lisensi Software Bisnis' | 'Hak Cipta Karya' | 'Izin Usaha / NIB';
  registrationNumber?: string;
  holdingEntity: string;
  costPerRenewal?: number;
  expiryDate: string;
  status: 'Aktif & Sah' | 'Mendekati Kedaluwarsa' | 'Proses Perpanjangan';
  notes?: string;
  createdAt: string;
}

// 9. Ownership: Stakeholder Equity & Cap Table
export interface CapTableItem {
  id: string;
  stakeholderName: string;
  stakeholderRole: 'Pendiri (Founder)' | 'Investor Awal (Angel/VC)' | 'Karyawan Kunci (ESOP)' | 'Penasihat (Advisor)';
  shareClass: 'Saham Biasa (Common)' | 'Saham Preferen (Preferred)' | 'Opsi Saham (Options)';
  percentage: number;
  sharesCount: number;
  vestingCliffMonths?: number;
  legalAgreementRef?: string;
  notes?: string;
  createdAt: string;
}

// ==========================================
// DATA TYPES: 20 NEW STANDALONE APPS
// ==========================================

// PEH - Personal: Reading
export interface ReadingItem {
  id: string;
  title: string;
  author: string;
  category: 'Non-Fiksi' | 'Bisnis & Finansial' | 'Pengembangan Diri' | 'Teknologi' | 'Sastra & Fiksi';
  totalPages: number;
  currentPage: number;
  status: 'Akan Dibaca' | 'Sedang Dibaca' | 'Selesai';
  rating?: number;
  favoriteQuote?: string;
  createdAt: string;
}

// PEH - Personal: Fitness
export interface FitnessItem {
  id: string;
  workoutName: string;
  workoutType: 'Beban / Gym' | 'Kardio / Lari' | 'HIIT & Calisthenics' | 'Mobilitas & Renang';
  durationMinutes: number;
  caloriesBurned?: number;
  intensity: 'Ringan' | 'Sedang' | 'Tinggi' | 'Maksimal';
  targetMuscles?: string;
  date: string;
  notes?: string;
  createdAt: string;
}

// PEH - Personal: Sleep
export interface SleepItem {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  totalHours: number;
  qualityScore: number;
  disturbances?: 'Tidak Ada' | 'Bangun Tengah Malam' | 'Sulit Terlelap' | 'Mimpi Buruk';
  feltRested: boolean;
  notes?: string;
  createdAt: string;
}

// PEH - Essentials: Budget
export interface BudgetItem {
  id: string;
  envelopeName: string;
  category: 'Kebutuhan Pokok' | 'Transportasi' | 'Gaya Hidup & Hobi' | 'Pendidikan' | 'Tabungan & Investasi';
  allocatedAmount: number;
  spentAmount: number;
  monthPeriod: string;
  notes?: string;
  createdAt: string;
}

// PEH - Essentials: Insurance
export interface InsuranceItem {
  id: string;
  providerName: string;
  policyNumber: string;
  type: 'Kesehatan' | 'Jiwa (Term Life)' | 'Kendaraan' | 'Properti / Rumah' | 'Pendidikan Anak';
  insuredPerson: string;
  premiumAmount: number;
  paymentFrequency: 'Bulanan' | 'Triwulanan' | 'Tahunan';
  coverageLimit: number;
  expiryDate: string;
  status: 'Aktif' | 'Grace Period' | 'Klaim Berjalan';
  notes?: string;
  createdAt: string;
}

// PEH - Household: Plants
export interface PlantItem {
  id: string;
  plantName: string;
  speciesOrVariety: string;
  location: 'Ruang Tamu' | 'Balkon / Teras' | 'Kamar Tidur' | 'Halaman Depan' | 'Dapur';
  wateringIntervalDays: number;
  lastWateredDate: string;
  sunlightNeed: 'Cahaya Rendah' | 'Cahaya Terang Tidak Langsung' | 'Matahari Penuh';
  healthCondition: 'Subur & Segar' | 'Perlu Perhatian' | 'Perlu Ganti Media (Repot)';
  notes?: string;
  createdAt: string;
}

// PEH - Household: Vehicles
export interface VehicleItem {
  id: string;
  vehicleName: string;
  plateNumber: string;
  type: 'Mobil Pribadi' | 'Sepeda Motor' | 'Kendaraan Niaga';
  currentOdometerKm: number;
  taxExpiryDate: string;
  fiveYearTaxDate: string;
  lastOilChangeKm: number;
  avgFuelEfficiencyKmPerL?: number;
  status: 'Prima' | 'Jadwal Servis' | 'Perlu Perbaikan';
  notes?: string;
  createdAt: string;
}

// PFS - People: Mentorship
export interface MentorshipItem {
  id: string;
  mentorName: string;
  domain: 'Karier & Kepemimpinan' | 'Bisnis & Startup' | 'Teknologi & Engineering' | 'Keuangan & Investasi' | 'Spiritual / Kehidupan';
  cadence: 'Mingguan' | 'Dua Mingguan' | 'Bulanan' | 'Insidental';
  lastSessionDate: string;
  nextSessionDate?: string;
  keyAdviceSummary: string;
  actionItemForMe: string;
  notes?: string;
  createdAt: string;
}

// PFS - People: Introductions
export interface IntroductionItem {
  id: string;
  contactA: string;
  contactB: string;
  purpose: 'Peluang Kerja' | 'Kemitraan Bisnis' | 'Kolaborasi Proyek' | 'Mentoring' | 'Relasi Personal';
  dateIntroduced: string;
  status: 'Baru Dihubungkan' | 'Pertemuan Pertama Selesai' | 'Kolaborasi Aktif' | 'Selesai / Ditutup';
  outcomeNotes?: string;
  createdAt: string;
}

// PFS - Family: Family Recipes
export interface FamilyRecipeItem {
  id: string;
  recipeTitle: string;
  originPerson: string;
  category: 'Lauk Utama' | 'Sup & Kuah' | 'Kue & Camilan Tradisional' | 'Sambal & Bumbu Khas' | 'Minuman Herbal';
  servings: number;
  prepTimeMinutes: number;
  ingredients: string[];
  cookingSteps: string[];
  secretTip?: string;
  createdAt: string;
}

// PFS - Family: Family Budget & Sinking Funds
export interface FamilyBudgetItem {
  id: string;
  fundName: string;
  category: 'Dana Darurat' | 'Pendidikan Anak' | 'Kesehatan Keluarga' | 'Liburan Bersama' | 'Investasi Properti';
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  targetDate: string;
  notes?: string;
  createdAt: string;
}

// PFS - Family: Pet Care
export interface PetCareItem {
  id: string;
  petName: string;
  animalType: 'Kucing' | 'Anjing' | 'Burung' | 'Ikan' | 'Lainnya';
  breedOrVariety?: string;
  birthOrAdoptDate: string;
  weightKg: number;
  vaccinationStatus: 'Lengkap & Terupdate' | 'Ada Jadwal Vaksin' | 'Belum Vaksin';
  nextVetVisitDate?: string;
  microchipOrTagNumber?: string;
  favoriteFoodAndNotes?: string;
  createdAt: string;
}

// PFS - Society: Community Events
export interface CommunityEventItem {
  id: string;
  eventName: string;
  scope: 'Lingkungan RT/RW' | 'Komunitas Hobi' | 'Alumni' | 'Organisasi Profesi';
  eventDate: string;
  location: string;
  myRole: 'Ketua / Panitia' | 'Peserta Aktif' | 'Donatur / Sponsor' | 'Pengamat';
  attendeeCountEstimate: number;
  budgetAllocation?: number;
  status: 'Rencana' | 'Persiapan' | 'Berjalan' | 'Selesai';
  notes?: string;
  createdAt: string;
}

// PFS - Society: Advocacy & Aspirasi
export interface AdvocacyItem {
  id: string;
  issueTitle: string;
  targetAuthority: 'Kelurahan / Kecamatan' | 'Dinas Bina Marga / PU' | 'PLN / PDAM' | 'Kepolisian' | 'Pengurus RT/RW';
  urgency: 'P1: Bahaya Keselamatan' | 'P2: Gangguan Rutinitas' | 'P3: Kenyamanan Lingkungan' | 'P4: Saran Estetika';
  submissionDate: string;
  trackingTicketNumber?: string;
  status: 'Draft Laporan' | 'Terkirim / Diajukan' | 'Dalam Penanganan Dinas' | 'Tuntas Diperbaiki';
  resolutionNotes?: string;
  createdAt: string;
}

// POO - Productivity: Time Audit
export interface TimeAuditItem {
  id: string;
  activityName: string;
  category: 'Deep Work' | 'Shallow Work / Email' | 'Rapat & Diskusi' | 'Gangguan / Distraksi' | 'Istirahat';
  date: string;
  durationMinutes: number;
  energyLevel: 'Tinggi (Peak)' | 'Stabil' | 'Lelah / Drop';
  outputDeliverable?: string;
  createdAt: string;
}

// POO - Productivity: Meetings
export interface MeetingItem {
  id: string;
  meetingTitle: string;
  date: string;
  attendees: string[];
  objective: string;
  keyDecisions: string[];
  actionItems: { task: string; assignee: string; dueDate: string; isCompleted: boolean }[];
  durationMinutes: number;
  notes?: string;
  createdAt: string;
}

// POO - Operations: Procurement
export interface ProcurementItem {
  id: string;
  itemName: string;
  department: 'Operasional' | 'Teknologi & IT' | 'Marketing' | 'HR & Fasilitas';
  vendorName: string;
  quantity: number;
  estimatedCost: number;
  status: 'Diajukan' | 'Disetujui Manajer' | 'PO Terbit' | 'Barang Diterima & Lunas';
  requestDate: string;
  expectedDeliveryDate: string;
  notes?: string;
  createdAt: string;
}

// POO - Operations: Compliance
export interface ComplianceItem {
  id: string;
  complianceName: string;
  issuingBody: 'Kemenkumham' | 'Dirjen Pajak' | 'Lembaga Audit Eksternal' | 'Kementerian Kesehatan' | 'Badan Standarisasi';
  type: 'Pajak & Fiskal' | 'Keamanan Data & Privasi' | 'Legalitas Korporasi' | 'Ketenagakerjaan & K3' | 'Standar Mutu & ISO';
  validityEndDate: string;
  auditCycleMonths: number;
  status: 'Patuh (Compliant)' | 'Audit Mendatang' | 'Perlu Perbaikan Tindak Lanjut' | 'Kritis / Kedaluwarsa';
  auditScoreOrRef?: string;
  notes?: string;
  createdAt: string;
}

// POO - Ownership: Investments
export interface InvestmentItem {
  id: string;
  assetName: string;
  assetClass: 'Saham Publik' | 'Obligasi / SBN' | 'Reksadana' | 'Emas & Komoditas' | 'Deposito / Kas';
  unitsHeld: number;
  averageBuyPrice: number;
  currentPrice: number;
  annualDividendYieldPercent?: number;
  brokerOrCustodian: string;
  lastValuationDate: string;
  notes?: string;
  createdAt: string;
}

// POO - Ownership: Real Estate
export interface RealEstateItem {
  id: string;
  propertyName: string;
  type: 'Ruko / Rukan Komersial' | 'Gudang & Logistik' | 'Ruang Kantor' | 'Tanah / Kavling' | 'Rumah Kost / Residensial';
  certificateType: 'SHM (Milik)' | 'HGB (Guna Bangunan)' | 'Sewa Jangka Panjang' | 'Hak Pakai';
  landAreaM2: number;
  buildingAreaM2: number;
  acquisitionCost: number;
  currentMarketValuation: number;
  annualRentalIncome?: number;
  tenantNameOrStatus: 'Ditempati Sendiri' | 'Disewakan (Ada Penyewa)' | 'Kosong / Pasarkan' | 'Dalam Renovasi';
  notes?: string;
  createdAt: string;
}

// Global Activity & Sync Feed
export interface ActivityLog {
  id: string;
  workspaceId: WorkspaceId;
  appId: StandaloneAppId;
  action: 'create' | 'update' | 'delete' | 'complete';
  title: string;
  details: string;
  timestamp: string;
}
