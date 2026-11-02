export type WorkspaceMode = 
  | 'life-planner' 
  | 'finance-os' 
  | 'simple-finance' 
  | 'budget-tracker'
  | 'weight-tracker'
  | 'habit-tracker'
  | 'notes'
  | 'journal'
  | 'movie-tracker'
  | 'recipe-book'
  | 'certificate-tracker'
  | 'travel-backpack'
  | 'doctor-consultation' 
  | 'household-items'
  | 'wishlist'
  | 'grocery-list'
  | 'contacts' 
  | 'subscriptions' 
  | 'assets';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface TaskItem {
  id: string;
  name: string;
  dueDate: string;
  priority: PriorityLevel;
  category: string;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export type TransactionType = 'expense' | 'income' | 'transfer';

export interface TransactionItem {
  id: string;
  type: TransactionType;
  name: string;
  amount: number;
  date: string;
  category: string;
  accountId?: string;
  targetAccountId?: string;
  note?: string;
  weekGroup?: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  spent: number;
  limit: number;
  color?: string;
}

export type GoalStatus = 'not_started' | 'in_progress' | 'done';

export interface GoalItem {
  id: string;
  title: string;
  status: GoalStatus;
  progress: number; // 0 to 100
  targetDate?: string;
  category: string;
  description?: string;
}

export interface HabitItem {
  id: string;
  name: string;
  completedToday: boolean;
  streak: number;
  longestStreak?: number;
  category?: string;
  timeOfDay?: 'Pagi' | 'Siang' | 'Sore' | 'Malam' | 'Sepanjang Hari';
  targetDays?: number; // per week e.g. 7
  history: Record<string, boolean>; // 'YYYY-MM-DD': boolean
  notes?: string;
  icon?: string;
}

export interface JournalItem {
  id: string;
  title: string;
  content: string;
  date: string;
  tag: string;
  readingTime?: string;
}

export interface AccountItem {
  id: string;
  name: string;
  institution: string;
  type: 'Checking' | 'Savings' | 'Investment' | 'Cash';
  balance: number;
  color?: string;
  accountNumberMask?: string;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBilling: string;
  category: 'Entertainment' | 'Productivity' | 'Cloud Storage' | 'Health & Fitness' | 'Utilities' | 'Education';
  status: 'active' | 'paused' | 'cancelled';
  paymentMethod?: string;
  autoRenew?: boolean;
  notes?: string;
  icon?: string;
}

export interface DebtItem {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  interestRate: number;
  monthlyPayment: number;
  dueDate: string;
}

export interface SavingGoalItem {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  category: string;
}

export type ContactCategory = 'Teman' | 'Keluarga' | 'Rekan Kerja' | 'Klien' | 'Mentor' | 'Vendor';

export interface ContactItem {
  id: string;
  name: string;
  nickname?: string;
  category: ContactCategory;
  role: string;
  company?: string;
  phone: string;
  email: string;
  birthday?: string;
  instagram?: string;
  linkedin?: string;
  lastContacted?: string;
  tags: string[];
  notes?: string;
  favorite?: boolean;
  avatarBg?: string;
}

export type AssetCategory = 'Kas & Bank' | 'Property' | 'Investasi' | 'Kendaraan' | 'Kripto' | 'Elektronik & Gadget' | 'Logam Mulia';
export type AssetLiquidity = 'High' | 'Medium' | 'Low';

export interface AssetItem {
  id: string;
  name: string;
  category: AssetCategory;
  institution: string; // e.g. Waverly Bank, Sertifikat Hak Milik, Stockbit, Indodax, Physical
  acquiredDate: string;
  purchasePrice: number;
  currentValue: number;
  liquidity: AssetLiquidity;
  notes?: string;
}

// Doctor Consultation Tracker Types
export type ConsultationStatus = 'Scheduled' | 'Completed' | 'Follow-up Needed' | 'Cancelled';
export type PaymentCoverage = 'Asuransi / BPJS' | 'Biaya Pribadi (Out of Pocket)' | 'Reimbursement' | 'Gratis / Faskes';

export interface PrescriptionMedicine {
  id: string;
  medicineName: string;
  dosage: string; // e.g., "500 mg"
  frequency: string; // e.g., "3x sehari setelah makan"
  duration: string; // e.g., "7 hari"
  instructions?: string;
  isActive: boolean;
}

export interface ConsultationVitals {
  bloodPressure?: string; // e.g., "120/80 mmHg"
  heartRate?: number; // e.g., 72
  weight?: number; // e.g., 68.5
  temperature?: number; // e.g., 36.6
}

export interface DoctorConsultationItem {
  id: string;
  doctorName: string;
  specialty: string; // e.g. Dokter Gigi, Spesialis Anak, Penyakit Dalam, dll.
  clinicHospital: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  status: ConsultationStatus;
  symptoms: string; // Keluhan Utama
  diagnosis?: string;
  treatmentPlan?: string;
  prescriptions: PrescriptionMedicine[];
  fee: number;
  paymentCoverage: PaymentCoverage;
  followUpDate?: string;
  vitals?: ConsultationVitals;
  doctorNotes?: string;
  labResultsSummary?: string;
}

export interface DoctorContactItem {
  id: string;
  name: string;
  specialty: string;
  hospitalClinic: string;
  phone: string;
  address?: string;
  schedule?: string;
  notes?: string;
}

// Household Items Tracker Types
export type RoomCategory =
  | 'Ruang Tamu'
  | 'Dapur'
  | 'Kamar Tidur'
  | 'Kamar Mandi'
  | 'Ruang Kerja'
  | 'Gudang & Garasi'
  | 'Ruang Makan'
  | 'Balkon & Luar';

export type ItemCondition =
  | 'Baru'
  | 'Sangat Baik'
  | 'Baik'
  | 'Butuh Servis'
  | 'Perlu Diganti';

export interface HouseholdItem {
  id: string;
  name: string;
  room: RoomCategory;
  condition: ItemCondition;
  brand?: string;
  modelNumber?: string;
  serialNumber?: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  quantity: number;
  warrantyExpiry?: string; // YYYY-MM-DD
  warrantyStatus?: 'Active' | 'Expiring Soon' | 'Expired' | 'No Warranty';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  manualOrReceiptUrl?: string;
  notes?: string;
  photoUrl?: string;
}

// Wishlist Tracker Types
export type WishlistPriority = 'Must Have' | 'High' | 'Medium' | 'Low' | 'Nice to Have';
export type WishlistStatus = 'Wishlist' | 'Saving Up' | 'Ready to Buy' | 'Purchased' | 'Archived';
export type WishlistCategory =
  | 'Gadget & Tech'
  | 'Home & Living'
  | 'Fashion & Style'
  | 'Buku & Hobi'
  | 'Self-Care & Health'
  | 'Travel & Petualangan';

export interface WishlistItem {
  id: string;
  name: string;
  category: WishlistCategory;
  priority: WishlistPriority;
  status: WishlistStatus;
  price: number;
  savedAmount: number;
  url?: string;
  dateAdded: string; // YYYY-MM-DD
  purchasedDate?: string;
  reason?: string; // "Why do I want this?" (Mindful spending reflection)
  photoUrl?: string;
  notes?: string;
  satisfactionRating?: number; // 1 to 5 stars once bought
}

// Grocery List & Pantry Tracker Types
export type GroceryCategory =
  | 'Sayuran & Buah'
  | 'Daging & Ikan'
  | 'Susu & Telur'
  | 'Bahan Pokok'
  | 'Bumbu & Rempah'
  | 'Camilan & Minuman'
  | 'Kebersihan Rumah';

export type GroceryStatus = 'Need to Buy' | 'In Cart' | 'In Stock';
export type RestockCycle = 'Mingguan' | '2 Mingguan' | 'Bulanan' | 'Sesuai Kebutuhan';

export interface GroceryItem {
  id: string;
  name: string;
  category: GroceryCategory;
  status: GroceryStatus;
  quantity: number;
  unit: string; // e.g. kg, pcs, pack, liter, botol, ikat, kaleng
  estimatedPrice: number;
  actualPrice?: number;
  store?: string; // e.g. Supermarket, Pasar Tradisional, Online Mart
  restockCycle: RestockCycle;
  expiryDate?: string;
  isFavorite: boolean;
  notes?: string;
}

// Budget Tracker by LifeCanvas Types
export type BudgetRuleType = 'Needs (50%)' | 'Wants (30%)' | 'Savings & Debt (20%)' | 'Custom';

export interface LifeCanvasBudget {
  id: string;
  category: string;
  icon: string;
  allocated: number;
  spent: number;
  ruleGroup: BudgetRuleType;
  notes?: string;
}

// Weight Tracker by LifeCanvas Types
export interface WeightLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  weight: number; // in kg
  bodyFat?: number; // %
  muscleMass?: number; // kg
  waistCircumference?: number; // cm
  notes?: string;
}

export interface WeightProfile {
  startingWeight: number;
  currentWeight: number;
  targetWeight: number;
  heightCm: number;
  startDate: string;
  targetDate: string;
  unit: 'kg' | 'lbs';
}

// Notes by LifeCanvas Types
export type NoteNotebook =
  | 'Kerja & Proyek'
  | 'Pribadi & Hidup'
  | 'Buku & Pembelajaran'
  | 'Ide & Inspirasi'
  | 'Teknologi & Referensi';

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  notebook: NoteNotebook;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  readingTime?: string;
  icon?: string;
}

// Journal by LifeCanvas Types
export type JournalMood =
  | 'Sangat Bahagia 😊'
  | 'Tenang & Bersyukur 🌿'
  | 'Produktif ⚡'
  | 'Biasa Saja ☕'
  | 'Lelah / Butuh Rehat 🌧️'
  | 'Reflektif & Meditatif 🌙';

export type JournalWeather =
  | 'Cerah ☀️'
  | 'Berawan ⛅'
  | 'Hujan Sejuk 🌧️'
  | 'Malam Berbintang 🌌';

export interface DetailedJournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: JournalMood;
  weather?: JournalWeather;
  gratitude: string[];
  highlightOfDay?: string;
  tags: string[];
  photoUrl?: string;
  favorite?: boolean;
}

// Movie Tracker by LifeCanvas Types
export type MovieWatchStatus = 'Want to Watch' | 'Watching' | 'Completed' | 'Dropped';
export type MovieFormatType = 'Movie' | 'TV Series' | 'Documentary' | 'Anime' | 'Miniseries';
export type StreamingPlatform =
  | 'Netflix'
  | 'Disney+ Hotstar'
  | 'Prime Video'
  | 'Apple TV+'
  | 'HBO GO / Max'
  | 'Bioskop / Cinema'
  | 'YouTube / Lainnya';

export interface MovieItem {
  id: string;
  title: string;
  type: MovieFormatType;
  genre: string[];
  status: MovieWatchStatus;
  platform: StreamingPlatform;
  releaseYear: number;
  directorOrCreator?: string;
  rating?: number; // 1 to 5 stars
  currentProgress?: string; // e.g. "S1 E5 / 10" or "120 min"
  watchedDate?: string;
  reviewNotes?: string;
  posterUrl?: string;
  isFavorite: boolean;
}

// Recipe Book by LifeCanvas Types
export type RecipeCategory =
  | 'Sarapan (Breakfast)'
  | 'Hidangan Utama (Main Course)'
  | 'Sup & Sayur'
  | 'Camilan & Dessert'
  | 'Minuman & Smoothie'
  | 'Meal Prep & Diet';

export type RecipeDifficulty = 'Mudah' | 'Sedang' | 'Chef Level';

export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface RecipeItem {
  id: string;
  title: string;
  category: RecipeCategory;
  difficulty: RecipeDifficulty;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  caloriesPerServing?: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  dietaryTags: string[]; // e.g. High Protein, Low Carb, Vegan, Halal, Comfort Food
  notes?: string;
  photoUrl?: string;
  isFavorite: boolean;
  rating?: number;
}

// Certificate & Document Tracker by LifeCanvas Types
export type CertificateCategory =
  | 'Identitas & Kependudukan'
  | 'Paspor, Visa & Imigrasi'
  | 'Pendidikan & Ijazah'
  | 'Sertifikasi Profesional'
  | 'Lisensi & Surat Izin (SIM/STNK)'
  | 'Polis Asuransi & Legal';

export type DocumentStatus = 'Active' | 'Expiring Soon' | 'Expired' | 'Lifetime';

export interface CertificateItem {
  id: string;
  title: string;
  category: CertificateCategory;
  documentNumber: string;
  issuer: string; // e.g. Dirjen Imigrasi, Kemendikbud, AWS, Korlantas Polri
  holderName: string;
  issueDate: string; // YYYY-MM-DD
  expiryDate?: string; // YYYY-MM-DD or undefined if lifetime
  status: DocumentStatus;
  physicalLocation: string; // e.g. "Brankas Rumah Map Biru", "Dompet Utama"
  digitalFileLink?: string; // e.g. "Google Drive /Vault/Passport.pdf"
  renewalCostEstimate?: number;
  notes?: string;
}

// Travel Backpack & Packing List by LifeCanvas Types
export type PackingCategory =
  | 'Pakaian & Alas Kaki'
  | 'Dokumen & Uang'
  | 'Elektronik & Gadget'
  | 'Toiletries & Perawatan'
  | 'Obat & P3K'
  | 'Perlengkapan Outdoor & Lainnya';

export type TripType = 'Liburan (Leisure)' | 'Perjalanan Bisnis' | 'Backpacking & Alam' | 'Akhir Pekan (Staycation)';

export interface TravelBackpackItem {
  id: string;
  name: string;
  category: PackingCategory;
  quantity: number;
  weightGrams: number; // weight per item in grams
  isPacked: boolean;
  isEssential: boolean;
  tripName: string; // e.g. "Kyoto & Tokyo Autumn Trip", "Bali Workcation"
  tripType: TripType;
  bagSection: 'Cabin / Carry-On' | 'Checked Baggage' | 'Personal Daypack';
  notes?: string;
}






