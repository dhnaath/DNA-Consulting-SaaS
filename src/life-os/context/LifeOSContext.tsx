import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  WorkspaceMode,
  TaskItem,
  TransactionItem,
  BudgetCategory,
  GoalItem,
  HabitItem,
  JournalItem,
  AccountItem,
  SubscriptionItem,
  SavingGoalItem,
  DebtItem,
  ContactItem,
  AssetItem,
  DoctorConsultationItem,
  DoctorContactItem,
  HouseholdItem,
  WishlistItem,
  GroceryItem,
  LifeCanvasBudget,
  WeightLogEntry,
  WeightProfile,
  NoteItem,
  DetailedJournalEntry,
  MovieItem,
  RecipeItem,
  CertificateItem,
  TravelBackpackItem,
} from '../types';
import {
  INITIAL_TASKS,
  INITIAL_EXPENSES,
  INITIAL_INCOMES,
  INITIAL_BUDGETS,
  INITIAL_GOALS,
  INITIAL_HABITS,
  INITIAL_JOURNALS,
  INITIAL_ACCOUNTS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_SAVINGS,
  INITIAL_DEBTS,
  INITIAL_CONTACTS,
  INITIAL_ASSETS,
  INITIAL_DOCTOR_CONSULTATIONS,
  INITIAL_DOCTOR_CONTACTS,
  INITIAL_HOUSEHOLD_ITEMS,
  INITIAL_WISHLIST,
  INITIAL_GROCERY_LIST,
  INITIAL_LIFECANVAS_BUDGETS,
  INITIAL_WEIGHT_PROFILE,
  INITIAL_WEIGHT_LOGS,
  INITIAL_LIFE_NOTES,
  INITIAL_DETAILED_JOURNALS,
  INITIAL_MOVIES,
  INITIAL_RECIPES,
  INITIAL_CERTIFICATES,
  INITIAL_TRAVEL_ITEMS,
} from '../data/initialData';

interface LifeOSContextType {
  workspace: WorkspaceMode;
  setWorkspace: (mode: WorkspaceMode) => void;
  activeNav: string;
  setActiveNav: (nav: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Data
  tasks: TaskItem[];
  transactions: TransactionItem[];
  budgets: BudgetCategory[];
  goals: GoalItem[];
  habits: HabitItem[];
  journals: JournalItem[];
  accounts: AccountItem[];
  subscriptions: SubscriptionItem[];
  savings: SavingGoalItem[];
  debts: DebtItem[];
  contacts: ContactItem[];
  assets: AssetItem[];
  consultations: DoctorConsultationItem[];
  doctorContacts: DoctorContactItem[];
  householdItems: HouseholdItem[];
  wishlist: WishlistItem[];
  groceryList: GroceryItem[];
  lifeCanvasBudgets: LifeCanvasBudget[];
  weightLogs: WeightLogEntry[];
  weightProfile: WeightProfile;
  notes: NoteItem[];
  detailedJournals: DetailedJournalEntry[];
  movies: MovieItem[];
  recipes: RecipeItem[];
  certificates: CertificateItem[];
  travelItems: TravelBackpackItem[];

  // Task Actions
  toggleTask: (id: string) => void;
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  deleteTask: (id: string) => void;

  // Transaction Actions
  addTransaction: (tx: Omit<TransactionItem, 'id'>) => void;
  deleteTransaction: (id: string) => void;

  // Budget Actions
  updateBudgetLimit: (id: string, limit: number) => void;

  // Goal Actions
  updateGoalStatus: (id: string, status: GoalItem['status']) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  addGoal: (goal: Omit<GoalItem, 'id'>) => void;
  deleteGoal: (id: string) => void;

  // Habit Actions
  toggleHabitToday: (id: string) => void;
  addHabit: (name: string) => void;
  deleteHabit: (id: string) => void;

  // Journal Actions
  addJournal: (entry: Omit<JournalItem, 'id' | 'date'>) => void;
  deleteJournal: (id: string) => void;

  // Account & Transfer Actions
  addAccount: (acc: Omit<AccountItem, 'id'>) => void;
  transferFunds: (sourceId: string, targetId: string, amount: number, note?: string) => void;

  // Subscriptions & Savings
  addSubscription: (sub: Omit<SubscriptionItem, 'id'>) => void;
  updateSubscription: (id: string, sub: Partial<SubscriptionItem>) => void;
  deleteSubscription: (id: string) => void;
  toggleSubscription: (id: string) => void;
  addSavingAmount: (id: string, amount: number) => void;

  // Contacts Actions
  addContact: (contact: Omit<ContactItem, 'id'>) => void;
  updateContact: (id: string, contact: Partial<ContactItem>) => void;
  deleteContact: (id: string) => void;
  toggleFavoriteContact: (id: string) => void;

  // Assets Actions
  addAsset: (asset: Omit<AssetItem, 'id'>) => void;
  updateAsset: (id: string, asset: Partial<AssetItem>) => void;
  deleteAsset: (id: string) => void;

  // Doctor Consultation Actions
  addConsultation: (item: Omit<DoctorConsultationItem, 'id'>) => void;
  updateConsultation: (id: string, item: Partial<DoctorConsultationItem>) => void;
  deleteConsultation: (id: string) => void;
  togglePrescriptionActive: (consultationId: string, prescriptionId: string) => void;
  addDoctorContact: (doctor: Omit<DoctorContactItem, 'id'>) => void;
  updateDoctorContact: (id: string, doctor: Partial<DoctorContactItem>) => void;
  deleteDoctorContact: (id: string) => void;

  // Household Items Actions
  addHouseholdItem: (item: Omit<HouseholdItem, 'id'>) => void;
  updateHouseholdItem: (id: string, item: Partial<HouseholdItem>) => void;
  deleteHouseholdItem: (id: string) => void;

  // Wishlist Actions
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'dateAdded'>) => void;
  updateWishlistItem: (id: string, item: Partial<WishlistItem>) => void;
  deleteWishlistItem: (id: string) => void;
  addWishlistSavings: (id: string, amount: number) => void;
  markWishlistPurchased: (id: string, satisfactionRating?: number) => void;

  // Grocery List Actions
  addGroceryItem: (item: Omit<GroceryItem, 'id'>) => void;
  updateGroceryItem: (id: string, item: Partial<GroceryItem>) => void;
  deleteGroceryItem: (id: string) => void;
  toggleGroceryStatus: (id: string, nextStatus?: GroceryItem['status']) => void;
  clearCompletedGroceryCart: () => void;
  restockGroceryItem: (id: string) => void;

  // LifeCanvas Budget Actions
  addLifeCanvasBudget: (budget: Omit<LifeCanvasBudget, 'id'>) => void;
  updateLifeCanvasBudget: (id: string, budget: Partial<LifeCanvasBudget>) => void;
  deleteLifeCanvasBudget: (id: string) => void;
  logExpenseToBudget: (id: string, amount: number) => void;

  // Weight Tracker Actions
  addWeightLog: (entry: Omit<WeightLogEntry, 'id'>) => void;
  updateWeightLog: (id: string, entry: Partial<WeightLogEntry>) => void;
  deleteWeightLog: (id: string) => void;
  updateWeightProfile: (profile: Partial<WeightProfile>) => void;

  // Enhanced Habit Actions
  toggleHabitDay: (id: string, date: string) => void;
  updateHabit: (id: string, habit: Partial<HabitItem>) => void;

  // Notes Actions
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  // Detailed Journal Actions
  addDetailedJournal: (entry: Omit<DetailedJournalEntry, 'id'>) => void;
  updateDetailedJournal: (id: string, entry: Partial<DetailedJournalEntry>) => void;
  deleteDetailedJournal: (id: string) => void;
  toggleFavoriteJournal: (id: string) => void;

  // Movie Tracker Actions
  addMovie: (item: Omit<MovieItem, 'id'>) => void;
  updateMovie: (id: string, item: Partial<MovieItem>) => void;
  deleteMovie: (id: string) => void;
  toggleFavoriteMovie: (id: string) => void;

  // Recipe Book Actions
  addRecipe: (item: Omit<RecipeItem, 'id'>) => void;
  updateRecipe: (id: string, item: Partial<RecipeItem>) => void;
  deleteRecipe: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;

  // Certificate Tracker Actions
  addCertificate: (item: Omit<CertificateItem, 'id'>) => void;
  updateCertificate: (id: string, item: Partial<CertificateItem>) => void;
  deleteCertificate: (id: string) => void;

  // Travel Backpack Actions
  addTravelItem: (item: Omit<TravelBackpackItem, 'id'>) => void;
  updateTravelItem: (id: string, item: Partial<TravelBackpackItem>) => void;
  deleteTravelItem: (id: string) => void;
  togglePackedTravelItem: (id: string) => void;
  resetTripPacking: (tripName?: string) => void;

  // Modals
  activeModal: string | null;
  openModal: (modalName: string) => void;
  closeModal: () => void;

  // Reset & Helpers
  resetToDefaults: () => void;
  totalExpenses: number;
  totalIncomes: number;
  netCashflow: number;
  totalNetWorth: number;
  totalMonthlySubscriptions: number;
  totalAnnualSubscriptions: number;
  totalAssetsValue: number;
  totalAssetsCost: number;
  totalAssetsGain: number;
  totalLiquidAssets: number;
}

const LifeOSContext = createContext<LifeOSContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'life_planner_os_v1_';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to storage', e);
  }
}

export const LifeOSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspace, setWorkspace] = useState<WorkspaceMode>(() =>
    loadFromStorage<WorkspaceMode>('workspace', 'life-planner')
  );
  const [activeNav, setActiveNav] = useState<string>('Overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [tasks, setTasks] = useState<TaskItem[]>(() =>
    loadFromStorage('tasks', INITIAL_TASKS)
  );
  const [transactions, setTransactions] = useState<TransactionItem[]>(() =>
    loadFromStorage('transactions', [...INITIAL_EXPENSES, ...INITIAL_INCOMES])
  );
  const [budgets, setBudgets] = useState<BudgetCategory[]>(() =>
    loadFromStorage('budgets', INITIAL_BUDGETS)
  );
  const [goals, setGoals] = useState<GoalItem[]>(() =>
    loadFromStorage('goals', INITIAL_GOALS)
  );
  const [habits, setHabits] = useState<HabitItem[]>(() =>
    loadFromStorage('habits', INITIAL_HABITS)
  );
  const [journals, setJournals] = useState<JournalItem[]>(() =>
    loadFromStorage('journals', INITIAL_JOURNALS)
  );
  const [accounts, setAccounts] = useState<AccountItem[]>(() =>
    loadFromStorage('accounts', INITIAL_ACCOUNTS)
  );
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() =>
    loadFromStorage('subscriptions', INITIAL_SUBSCRIPTIONS)
  );
  const [savings, setSavings] = useState<SavingGoalItem[]>(() =>
    loadFromStorage('savings', INITIAL_SAVINGS)
  );
  const [debts, setDebts] = useState<DebtItem[]>(() =>
    loadFromStorage('debts', INITIAL_DEBTS)
  );
  const [contacts, setContacts] = useState<ContactItem[]>(() =>
    loadFromStorage('contacts', INITIAL_CONTACTS)
  );
  const [assets, setAssets] = useState<AssetItem[]>(() =>
    loadFromStorage('assets', INITIAL_ASSETS)
  );
  const [consultations, setConsultations] = useState<DoctorConsultationItem[]>(() =>
    loadFromStorage('consultations', INITIAL_DOCTOR_CONSULTATIONS)
  );
  const [doctorContacts, setDoctorContacts] = useState<DoctorContactItem[]>(() =>
    loadFromStorage('doctorContacts', INITIAL_DOCTOR_CONTACTS)
  );
  const [householdItems, setHouseholdItems] = useState<HouseholdItem[]>(() =>
    loadFromStorage('householdItems', INITIAL_HOUSEHOLD_ITEMS)
  );
  const [wishlist, setWishlist] = useState<WishlistItem[]>(() =>
    loadFromStorage('wishlist', INITIAL_WISHLIST)
  );
  const [groceryList, setGroceryList] = useState<GroceryItem[]>(() =>
    loadFromStorage('groceryList', INITIAL_GROCERY_LIST)
  );
  const [lifeCanvasBudgets, setLifeCanvasBudgets] = useState<LifeCanvasBudget[]>(() =>
    loadFromStorage('lifeCanvasBudgets', INITIAL_LIFECANVAS_BUDGETS)
  );
  const [weightLogs, setWeightLogs] = useState<WeightLogEntry[]>(() =>
    loadFromStorage('weightLogs', INITIAL_WEIGHT_LOGS)
  );
  const [weightProfile, setWeightProfile] = useState<WeightProfile>(() =>
    loadFromStorage('weightProfile', INITIAL_WEIGHT_PROFILE)
  );
  const [notes, setNotes] = useState<NoteItem[]>(() =>
    loadFromStorage('lifeNotes', INITIAL_LIFE_NOTES)
  );
  const [detailedJournals, setDetailedJournals] = useState<DetailedJournalEntry[]>(() =>
    loadFromStorage('detailedJournals', INITIAL_DETAILED_JOURNALS)
  );
  const [movies, setMovies] = useState<MovieItem[]>(() =>
    loadFromStorage('movies', INITIAL_MOVIES)
  );
  const [recipes, setRecipes] = useState<RecipeItem[]>(() =>
    loadFromStorage('recipes', INITIAL_RECIPES)
  );
  const [certificates, setCertificates] = useState<CertificateItem[]>(() =>
    loadFromStorage('certificates', INITIAL_CERTIFICATES)
  );
  const [travelItems, setTravelItems] = useState<TravelBackpackItem[]>(() =>
    loadFromStorage('travelItems', INITIAL_TRAVEL_ITEMS)
  );

  // Sync state to storage
  useEffect(() => { saveToStorage('workspace', workspace); }, [workspace]);
  useEffect(() => { saveToStorage('tasks', tasks); }, [tasks]);
  useEffect(() => { saveToStorage('transactions', transactions); }, [transactions]);
  useEffect(() => { saveToStorage('budgets', budgets); }, [budgets]);
  useEffect(() => { saveToStorage('goals', goals); }, [goals]);
  useEffect(() => { saveToStorage('habits', habits); }, [habits]);
  useEffect(() => { saveToStorage('journals', journals); }, [journals]);
  useEffect(() => { saveToStorage('accounts', accounts); }, [accounts]);
  useEffect(() => { saveToStorage('subscriptions', subscriptions); }, [subscriptions]);
  useEffect(() => { saveToStorage('savings', savings); }, [savings]);
  useEffect(() => { saveToStorage('debts', debts); }, [debts]);
  useEffect(() => { saveToStorage('contacts', contacts); }, [contacts]);
  useEffect(() => { saveToStorage('assets', assets); }, [assets]);
  useEffect(() => { saveToStorage('consultations', consultations); }, [consultations]);
  useEffect(() => { saveToStorage('doctorContacts', doctorContacts); }, [doctorContacts]);
  useEffect(() => { saveToStorage('householdItems', householdItems); }, [householdItems]);
  useEffect(() => { saveToStorage('wishlist', wishlist); }, [wishlist]);
  useEffect(() => { saveToStorage('groceryList', groceryList); }, [groceryList]);
  useEffect(() => { saveToStorage('lifeCanvasBudgets', lifeCanvasBudgets); }, [lifeCanvasBudgets]);
  useEffect(() => { saveToStorage('weightLogs', weightLogs); }, [weightLogs]);
  useEffect(() => { saveToStorage('weightProfile', weightProfile); }, [weightProfile]);
  useEffect(() => { saveToStorage('lifeNotes', notes); }, [notes]);
  useEffect(() => { saveToStorage('detailedJournals', detailedJournals); }, [detailedJournals]);
  useEffect(() => { saveToStorage('movies', movies); }, [movies]);
  useEffect(() => { saveToStorage('recipes', recipes); }, [recipes]);
  useEffect(() => { saveToStorage('certificates', certificates); }, [certificates]);
  useEffect(() => { saveToStorage('travelItems', travelItems); }, [travelItems]);

  // Modals
  const openModal = (name: string) => setActiveModal(name);
  const closeModal = () => setActiveModal(null);

  // Task actions
  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const newTask: TaskItem = {
      ...taskData,
      id: 'task-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Transaction actions
  const addTransaction = (txData: Omit<TransactionItem, 'id'>) => {
    const newTx: TransactionItem = {
      ...txData,
      id: 'tx-' + Date.now(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update account balance if accountId specified
    if (newTx.accountId) {
      setAccounts((prevAccs) =>
        prevAccs.map((acc) => {
          if (acc.id === newTx.accountId) {
            const delta = newTx.type === 'income' ? newTx.amount : -newTx.amount;
            return { ...acc, balance: acc.balance + delta };
          }
          return acc;
        })
      );
    }

    // Update budget category spent if expense
    if (newTx.type === 'expense') {
      setBudgets((prevBudgets) =>
        prevBudgets.map((b) => {
          if (b.name.toLowerCase() === newTx.category.toLowerCase()) {
            return { ...b, spent: b.spent + newTx.amount };
          }
          return b;
        })
      );
    }
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const transferFunds = (sourceId: string, targetId: string, amount: number, note?: string) => {
    if (amount <= 0 || sourceId === targetId) return;

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === sourceId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === targetId) return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );

    const sourceAcc = accounts.find((a) => a.id === sourceId)?.name || 'Account';
    const targetAcc = accounts.find((a) => a.id === targetId)?.name || 'Account';

    const tx: TransactionItem = {
      id: 'tx-tr-' + Date.now(),
      type: 'transfer',
      name: `Transfer: ${sourceAcc} → ${targetAcc}`,
      amount,
      date: new Date().toISOString().split('T')[0],
      category: 'Transfer',
      accountId: sourceId,
      targetAccountId: targetId,
      note,
    };
    setTransactions((prev) => [tx, ...prev]);
  };

  const updateBudgetLimit = (id: string, limit: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, limit: Math.max(0, limit) } : b))
    );
  };

  // Goal actions
  const updateGoalStatus = (id: string, status: GoalItem['status']) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const progress = status === 'done' ? 100 : status === 'not_started' ? 0 : g.progress === 0 ? 25 : g.progress;
          return { ...g, status, progress };
        }
        return g;
      })
    );
  };

  const updateGoalProgress = (id: string, progress: number) => {
    const clamped = Math.max(0, Math.min(100, progress));
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const status = clamped === 100 ? 'done' : clamped === 0 ? 'not_started' : 'in_progress';
          return { ...g, progress: clamped, status };
        }
        return g;
      })
    );
  };

  const addGoal = (goalData: Omit<GoalItem, 'id'>) => {
    const newGoal: GoalItem = {
      ...goalData,
      id: 'goal-' + Date.now(),
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Habit actions
  const toggleHabitToday = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.completedToday;
          const nextStreak = nextCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          return {
            ...h,
            completedToday: nextCompleted,
            streak: nextStreak,
            history: {
              ...h.history,
              [today]: nextCompleted,
            },
          };
        }
        return h;
      })
    );
  };

  const addHabit = (name: string) => {
    if (!name.trim()) return;
    const newHabit: HabitItem = {
      id: 'habit-' + Date.now(),
      name: name.trim(),
      completedToday: false,
      streak: 0,
      history: {},
    };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Journal actions
  const addJournal = (entryData: Omit<JournalItem, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry: JournalItem = {
      ...entryData,
      id: 'journal-' + Date.now(),
      date: today,
      readingTime: '2 min read',
    };
    setJournals((prev) => [newEntry, ...prev]);
  };

  const deleteJournal = (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  // Accounts
  const addAccount = (accData: Omit<AccountItem, 'id'>) => {
    const newAcc: AccountItem = {
      ...accData,
      id: 'acc-' + Date.now(),
    };
    setAccounts((prev) => [...prev, newAcc]);
  };

  const addSubscription = (subData: Omit<SubscriptionItem, 'id'>) => {
    const newSub: SubscriptionItem = {
      ...subData,
      id: 'sub-' + Date.now(),
    };
    setSubscriptions((prev) => [newSub, ...prev]);
  };

  const updateSubscription = (id: string, subData: Partial<SubscriptionItem>) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...subData } : s))
    );
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s))
    );
  };

  const addSavingAmount = (id: string, amount: number) => {
    setSavings((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, currentAmount: Math.min(s.targetAmount, s.currentAmount + amount) } : s
      )
    );
  };

  // Contacts Actions
  const addContact = (contactData: Omit<ContactItem, 'id'>) => {
    const colors = ['#2563EB', '#7C3AED', '#059669', '#DB2777', '#D97706', '#0891B2', '#4B5563'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const newContact: ContactItem = {
      ...contactData,
      id: 'con-' + Date.now(),
      avatarBg: contactData.avatarBg || randomColor,
    };
    setContacts((prev) => [newContact, ...prev]);
  };

  const updateContact = (id: string, contactData: Partial<ContactItem>) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...contactData } : c))
    );
  };

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const toggleFavoriteContact = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, favorite: !c.favorite } : c))
    );
  };

  // Assets Actions
  const addAsset = (assetData: Omit<AssetItem, 'id'>) => {
    const newAsset: AssetItem = {
      ...assetData,
      id: 'ast-' + Date.now(),
    };
    setAssets((prev) => [newAsset, ...prev]);
  };

  const updateAsset = (id: string, assetData: Partial<AssetItem>) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...assetData } : a))
    );
  };

  const deleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Doctor Consultation Actions
  const addConsultation = (itemData: Omit<DoctorConsultationItem, 'id'>) => {
    const newItem: DoctorConsultationItem = {
      ...itemData,
      id: 'cons-' + Date.now(),
    };
    setConsultations((prev) => [newItem, ...prev]);
  };

  const updateConsultation = (id: string, itemData: Partial<DoctorConsultationItem>) => {
    setConsultations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...itemData } : c))
    );
  };

  const deleteConsultation = (id: string) => {
    setConsultations((prev) => prev.filter((c) => c.id !== id));
  };

  const togglePrescriptionActive = (consultationId: string, prescriptionId: string) => {
    setConsultations((prev) =>
      prev.map((c) => {
        if (c.id !== consultationId) return c;
        return {
          ...c,
          prescriptions: c.prescriptions.map((p) =>
            p.id === prescriptionId ? { ...p, isActive: !p.isActive } : p
          ),
        };
      })
    );
  };

  const addDoctorContact = (docData: Omit<DoctorContactItem, 'id'>) => {
    const newDoc: DoctorContactItem = {
      ...docData,
      id: 'doc-' + Date.now(),
    };
    setDoctorContacts((prev) => [...prev, newDoc]);
  };

  const updateDoctorContact = (id: string, docData: Partial<DoctorContactItem>) => {
    setDoctorContacts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...docData } : d))
    );
  };

  const deleteDoctorContact = (id: string) => {
    setDoctorContacts((prev) => prev.filter((d) => d.id !== id));
  };

  // Household Items Actions
  const addHouseholdItem = (itemData: Omit<HouseholdItem, 'id'>) => {
    const newItem: HouseholdItem = {
      ...itemData,
      id: 'hh-' + Date.now(),
    };
    setHouseholdItems((prev) => [newItem, ...prev]);
  };

  const updateHouseholdItem = (id: string, itemData: Partial<HouseholdItem>) => {
    setHouseholdItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...itemData } : item))
    );
  };

  const deleteHouseholdItem = (id: string) => {
    setHouseholdItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Wishlist Actions
  const addWishlistItem = (itemData: Omit<WishlistItem, 'id' | 'dateAdded'>) => {
    const newItem: WishlistItem = {
      ...itemData,
      id: 'wl-' + Date.now(),
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setWishlist((prev) => [newItem, ...prev]);
  };

  const updateWishlistItem = (id: string, itemData: Partial<WishlistItem>) => {
    setWishlist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...itemData } : item))
    );
  };

  const deleteWishlistItem = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  };

  const addWishlistSavings = (id: string, amount: number) => {
    setWishlist((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const newSaved = Math.min(item.price, (item.savedAmount || 0) + amount);
        const newStatus = newSaved >= item.price ? 'Ready to Buy' : 'Saving Up';
        return {
          ...item,
          savedAmount: newSaved,
          status: item.status === 'Purchased' ? 'Purchased' : newStatus,
        };
      })
    );
  };

  const markWishlistPurchased = (id: string, satisfactionRating?: number) => {
    setWishlist((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'Purchased',
              savedAmount: item.price,
              purchasedDate: new Date().toISOString().split('T')[0],
              satisfactionRating: satisfactionRating ?? item.satisfactionRating ?? 5,
            }
          : item
      )
    );
  };

  // Grocery List Actions
  const addGroceryItem = (itemData: Omit<GroceryItem, 'id'>) => {
    const newItem: GroceryItem = {
      ...itemData,
      id: 'gro-' + Date.now(),
    };
    setGroceryList((prev) => [newItem, ...prev]);
  };

  const updateGroceryItem = (id: string, itemData: Partial<GroceryItem>) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...itemData } : item))
    );
  };

  const deleteGroceryItem = (id: string) => {
    setGroceryList((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleGroceryStatus = (id: string, nextStatus?: GroceryItem['status']) => {
    setGroceryList((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (nextStatus) return { ...item, status: nextStatus };
        let target: GroceryItem['status'] = 'In Cart';
        if (item.status === 'Need to Buy') target = 'In Cart';
        else if (item.status === 'In Cart') target = 'In Stock';
        else target = 'Need to Buy';
        return { ...item, status: target };
      })
    );
  };

  const clearCompletedGroceryCart = () => {
    setGroceryList((prev) =>
      prev.map((item) => (item.status === 'In Cart' ? { ...item, status: 'In Stock' } : item))
    );
  };

  const restockGroceryItem = (id: string) => {
    setGroceryList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Need to Buy' } : item))
    );
  };

  // LifeCanvas Budget Actions
  const addLifeCanvasBudget = (budgetData: Omit<LifeCanvasBudget, 'id'>) => {
    const newBudget: LifeCanvasBudget = {
      ...budgetData,
      id: 'lcb-' + Date.now(),
    };
    setLifeCanvasBudgets((prev) => [...prev, newBudget]);
  };

  const updateLifeCanvasBudget = (id: string, budgetData: Partial<LifeCanvasBudget>) => {
    setLifeCanvasBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...budgetData } : b))
    );
  };

  const deleteLifeCanvasBudget = (id: string) => {
    setLifeCanvasBudgets((prev) => prev.filter((b) => b.id !== id));
  };

  const logExpenseToBudget = (id: string, amount: number) => {
    setLifeCanvasBudgets((prev) =>
      prev.map((b) => (b.id === id ? { ...b, spent: b.spent + amount } : b))
    );
  };

  // Weight Tracker Actions
  const addWeightLog = (entryData: Omit<WeightLogEntry, 'id'>) => {
    const newLog: WeightLogEntry = {
      ...entryData,
      id: 'wl-' + Date.now(),
    };
    setWeightLogs((prev) => [newLog, ...prev]);
    setWeightProfile((prev) => ({ ...prev, currentWeight: entryData.weight }));
  };

  const updateWeightLog = (id: string, entryData: Partial<WeightLogEntry>) => {
    setWeightLogs((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...entryData } : l))
    );
    if (entryData.weight !== undefined) {
      setWeightProfile((prev) => ({ ...prev, currentWeight: entryData.weight! }));
    }
  };

  const deleteWeightLog = (id: string) => {
    setWeightLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const updateWeightProfile = (profileData: Partial<WeightProfile>) => {
    setWeightProfile((prev) => ({ ...prev, ...profileData }));
  };

  // Enhanced Habit Actions
  const toggleHabitDay = (id: string, date: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const currentVal = !!h.history[date];
        const nextVal = !currentVal;
        const newHistory = { ...h.history, [date]: nextVal };
        const todayStr = new Date().toISOString().split('T')[0];
        const isToday = date === todayStr;

        let calculatedStreak = h.streak;
        if (isToday) {
          calculatedStreak = nextVal ? calculatedStreak + 1 : Math.max(0, calculatedStreak - 1);
        }

        return {
          ...h,
          history: newHistory,
          completedToday: isToday ? nextVal : h.completedToday,
          streak: calculatedStreak,
          longestStreak: Math.max(h.longestStreak || calculatedStreak, calculatedStreak),
        };
      })
    );
  };

  const updateHabit = (id: string, habitData: Partial<HabitItem>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...habitData } : h))
    );
  };

  // Notes Actions
  const addNote = (noteData: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString().split('T')[0];
    const newNote: NoteItem = {
      ...noteData,
      id: 'note-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const updateNote = (id: string, updatedData: Partial<NoteItem>) => {
    const now = new Date().toISOString().split('T')[0];
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updatedData, updatedAt: now } : n))
    );
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  // Detailed Journal Actions
  const addDetailedJournal = (entryData: Omit<DetailedJournalEntry, 'id'>) => {
    const newEntry: DetailedJournalEntry = {
      ...entryData,
      id: 'dj-' + Date.now(),
    };
    setDetailedJournals((prev) => [newEntry, ...prev]);
  };

  const updateDetailedJournal = (id: string, updatedData: Partial<DetailedJournalEntry>) => {
    setDetailedJournals((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updatedData } : j))
    );
  };

  const deleteDetailedJournal = (id: string) => {
    setDetailedJournals((prev) => prev.filter((j) => j.id !== id));
  };

  const toggleFavoriteJournal = (id: string) => {
    setDetailedJournals((prev) =>
      prev.map((j) => (j.id === id ? { ...j, favorite: !j.favorite } : j))
    );
  };

  // Movie Tracker Actions
  const addMovie = (itemData: Omit<MovieItem, 'id'>) => {
    const newItem: MovieItem = {
      ...itemData,
      id: 'mov-' + Date.now(),
    };
    setMovies((prev) => [newItem, ...prev]);
  };

  const updateMovie = (id: string, updatedData: Partial<MovieItem>) => {
    setMovies((prev) => prev.map((m) => (m.id === id ? { ...m, ...updatedData } : m)));
  };

  const deleteMovie = (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleFavoriteMovie = (id: string) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
    );
  };

  // Recipe Book Actions
  const addRecipe = (itemData: Omit<RecipeItem, 'id'>) => {
    const newItem: RecipeItem = {
      ...itemData,
      id: 'rec-' + Date.now(),
    };
    setRecipes((prev) => [newItem, ...prev]);
  };

  const updateRecipe = (id: string, updatedData: Partial<RecipeItem>) => {
    setRecipes((prev) => prev.map((r) => (r.id === id ? { ...r, ...updatedData } : r)));
  };

  const deleteRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleFavoriteRecipe = (id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    );
  };

  // Certificate Tracker Actions
  const addCertificate = (itemData: Omit<CertificateItem, 'id'>) => {
    const newItem: CertificateItem = {
      ...itemData,
      id: 'cert-' + Date.now(),
    };
    setCertificates((prev) => [newItem, ...prev]);
  };

  const updateCertificate = (id: string, updatedData: Partial<CertificateItem>) => {
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedData } : c)));
  };

  const deleteCertificate = (id: string) => {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  };

  // Travel Backpack Actions
  const addTravelItem = (itemData: Omit<TravelBackpackItem, 'id'>) => {
    const newItem: TravelBackpackItem = {
      ...itemData,
      id: 'trv-' + Date.now(),
    };
    setTravelItems((prev) => [newItem, ...prev]);
  };

  const updateTravelItem = (id: string, updatedData: Partial<TravelBackpackItem>) => {
    setTravelItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedData } : t)));
  };

  const deleteTravelItem = (id: string) => {
    setTravelItems((prev) => prev.filter((t) => t.id !== id));
  };

  const togglePackedTravelItem = (id: string) => {
    setTravelItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPacked: !t.isPacked } : t))
    );
  };

  const resetTripPacking = (tripName?: string) => {
    setTravelItems((prev) =>
      prev.map((t) => (!tripName || t.tripName === tripName ? { ...t, isPacked: false } : t))
    );
  };

  // Defaults Reset
  const resetToDefaults = () => {
    setTasks(INITIAL_TASKS);
    setTransactions([...INITIAL_EXPENSES, ...INITIAL_INCOMES]);
    setBudgets(INITIAL_BUDGETS);
    setGoals(INITIAL_GOALS);
    setHabits(INITIAL_HABITS);
    setJournals(INITIAL_JOURNALS);
    setAccounts(INITIAL_ACCOUNTS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setSavings(INITIAL_SAVINGS);
    setDebts(INITIAL_DEBTS);
    setContacts(INITIAL_CONTACTS);
    setAssets(INITIAL_ASSETS);
    setConsultations(INITIAL_DOCTOR_CONSULTATIONS);
    setDoctorContacts(INITIAL_DOCTOR_CONTACTS);
    setHouseholdItems(INITIAL_HOUSEHOLD_ITEMS);
    setWishlist(INITIAL_WISHLIST);
    setGroceryList(INITIAL_GROCERY_LIST);
    setLifeCanvasBudgets(INITIAL_LIFECANVAS_BUDGETS);
    setWeightLogs(INITIAL_WEIGHT_LOGS);
    setWeightProfile(INITIAL_WEIGHT_PROFILE);
    setNotes(INITIAL_LIFE_NOTES);
    setDetailedJournals(INITIAL_DETAILED_JOURNALS);
    setMovies(INITIAL_MOVIES);
    setRecipes(INITIAL_RECIPES);
    setCertificates(INITIAL_CERTIFICATES);
    setTravelItems(INITIAL_TRAVEL_ITEMS);
  };

  // Calculated values
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncomes = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashflow = totalIncomes - totalExpenses;

  const totalNetWorth = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Subscriptions calculations
  const totalMonthlySubscriptions = subscriptions
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => {
      if (s.billingCycle === 'yearly') return sum + s.amount / 12;
      if (s.billingCycle === 'weekly') return sum + (s.amount * 52) / 12;
      return sum + s.amount;
    }, 0);

  const totalAnnualSubscriptions = totalMonthlySubscriptions * 12;

  // Assets calculations
  const totalAssetsValue = assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalAssetsCost = assets.reduce((sum, a) => sum + a.purchasePrice, 0);
  const totalAssetsGain = totalAssetsValue - totalAssetsCost;
  const totalLiquidAssets = assets
    .filter((a) => a.liquidity === 'High')
    .reduce((sum, a) => sum + a.currentValue, 0);

  return (
    <LifeOSContext.Provider
      value={{
        workspace,
        setWorkspace,
        activeNav,
        setActiveNav,
        searchQuery,
        setSearchQuery,
        tasks,
        transactions,
        budgets,
        goals,
        habits,
        journals,
        accounts,
        subscriptions,
        savings,
        debts,
        contacts,
        assets,
        consultations,
        doctorContacts,
        householdItems,
        wishlist,
        groceryList,
        lifeCanvasBudgets,
        weightLogs,
        weightProfile,
        notes,
        detailedJournals,
        movies,
        recipes,
        certificates,
        travelItems,
        toggleTask,
        addTask,
        deleteTask,
        addTransaction,
        deleteTransaction,
        updateBudgetLimit,
        updateGoalStatus,
        updateGoalProgress,
        addGoal,
        deleteGoal,
        toggleHabitToday,
        addHabit,
        deleteHabit,
        toggleHabitDay,
        updateHabit,
        addJournal,
        deleteJournal,
        addAccount,
        transferFunds,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        toggleSubscription,
        addSavingAmount,
        addContact,
        updateContact,
        deleteContact,
        toggleFavoriteContact,
        addAsset,
        updateAsset,
        deleteAsset,
        addConsultation,
        updateConsultation,
        deleteConsultation,
        togglePrescriptionActive,
        addDoctorContact,
        updateDoctorContact,
        deleteDoctorContact,
        addHouseholdItem,
        updateHouseholdItem,
        deleteHouseholdItem,
        addWishlistItem,
        updateWishlistItem,
        deleteWishlistItem,
        addWishlistSavings,
        markWishlistPurchased,
        addGroceryItem,
        updateGroceryItem,
        deleteGroceryItem,
        toggleGroceryStatus,
        clearCompletedGroceryCart,
        restockGroceryItem,
        addLifeCanvasBudget,
        updateLifeCanvasBudget,
        deleteLifeCanvasBudget,
        logExpenseToBudget,
        addWeightLog,
        updateWeightLog,
        deleteWeightLog,
        updateWeightProfile,
        addNote,
        updateNote,
        deleteNote,
        togglePinNote,
        addDetailedJournal,
        updateDetailedJournal,
        deleteDetailedJournal,
        toggleFavoriteJournal,
        addMovie,
        updateMovie,
        deleteMovie,
        toggleFavoriteMovie,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        toggleFavoriteRecipe,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        addTravelItem,
        updateTravelItem,
        deleteTravelItem,
        togglePackedTravelItem,
        resetTripPacking,
        activeModal,
        openModal,
        closeModal,
        resetToDefaults,
        totalExpenses,
        totalIncomes,
        netCashflow,
        totalNetWorth,
        totalMonthlySubscriptions,
        totalAnnualSubscriptions,
        totalAssetsValue,
        totalAssetsCost,
        totalAssetsGain,
        totalLiquidAssets,
      }}
    >
      {children}
    </LifeOSContext.Provider>
  );
};

export const useLifeOS = () => {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
};
