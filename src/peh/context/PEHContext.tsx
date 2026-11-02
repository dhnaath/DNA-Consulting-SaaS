import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  ActivityLog,
  ChoreItem,
  DocumentItem,
  GoalItem,
  HabitItem,
  JournalEntry,
  MaintenanceItem,
  PantryItem,
  SharedExpenseItem,
  StandaloneAppId,
  SubscriptionItem,
  VaultItem,
  MainCategory,
  WorkspaceId,
  ContactItem,
  MilestoneItem,
  GiftItem,
  FamilyMemberItem,
  FamilyHealthItem,
  TraditionItem,
  CivicItem,
  VolunteerItem,
  CharityItem,
  ProjectItem,
  TaskItem,
  KnowledgeItem,
  WorkflowItem,
  VendorItem,
  IncidentItem,
  CapitalAssetItem,
  IpLicenseItem,
  CapTableItem,
  ReadingItem,
  FitnessItem,
  SleepItem,
  BudgetItem,
  InsuranceItem,
  PlantItem,
  VehicleItem,
  MentorshipItem,
  IntroductionItem,
  FamilyRecipeItem,
  FamilyBudgetItem,
  PetCareItem,
  CommunityEventItem,
  AdvocacyItem,
  TimeAuditItem,
  MeetingItem,
  ProcurementItem,
  ComplianceItem,
  InvestmentItem,
  RealEstateItem,
} from '../types';
import { CATEGORIES_CONFIG_PEH, CATEGORIES_CONFIG_PFS, CATEGORIES_CONFIG_POO } from '../data/appRegistry';

interface PEHContextType {
  // Workspaces
  activeWorkspace: WorkspaceId;
  setActiveWorkspace: (ws: WorkspaceId) => void;

  // Navigation
  activeCategory: MainCategory;
  activeApp: StandaloneAppId;
  activeSubMenu: string;
  setActiveCategory: (cat: MainCategory) => void;
  setActiveApp: (app: StandaloneAppId) => void;
  setActiveSubMenu: (sub: string) => void;
  navigateTo: (appId: StandaloneAppId, subMenuId?: string) => void;

  // Search & Global state
  globalSearch: string;
  setGlobalSearch: (q: string) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Real Data Stores: PEH (strictly 0 dummy data initially)
  habits: HabitItem[];
  journalEntries: JournalEntry[];
  goals: GoalItem[];
  vaultItems: VaultItem[];
  documents: DocumentItem[];
  subscriptions: SubscriptionItem[];
  pantryItems: PantryItem[];
  maintenanceItems: MaintenanceItem[];
  chores: ChoreItem[];
  sharedExpenses: SharedExpenseItem[];

  // Real Data Stores: PFS (strictly 0 dummy data initially)
  contacts: ContactItem[];
  milestones: MilestoneItem[];
  gifts: GiftItem[];
  familyMembers: FamilyMemberItem[];
  familyHealth: FamilyHealthItem[];
  traditions: TraditionItem[];
  civicContacts: CivicItem[];
  volunteers: VolunteerItem[];
  charities: CharityItem[];

  // Real Data Stores: POO (strictly 0 dummy data initially)
  projects: ProjectItem[];
  tasks: TaskItem[];
  knowledgeList: KnowledgeItem[];
  workflows: WorkflowItem[];
  vendors: VendorItem[];
  incidents: IncidentItem[];
  capitalAssets: CapitalAssetItem[];
  ipLicenses: IpLicenseItem[];
  capTable: CapTableItem[];

  // Real Data Stores: 20 New Apps across PEH, PFS, POO
  readings: ReadingItem[];
  fitnessLogs: FitnessItem[];
  sleepLogs: SleepItem[];
  budgetEnvelopes: BudgetItem[];
  insurancePolicies: InsuranceItem[];
  plants: PlantItem[];
  vehicles: VehicleItem[];

  mentorships: MentorshipItem[];
  introductions: IntroductionItem[];
  familyRecipes: FamilyRecipeItem[];
  familyBudgets: FamilyBudgetItem[];
  pets: PetCareItem[];
  communityEvents: CommunityEventItem[];
  advocacies: AdvocacyItem[];

  timeAudits: TimeAuditItem[];
  meetings: MeetingItem[];
  procurements: ProcurementItem[];
  compliances: ComplianceItem[];
  investments: InvestmentItem[];
  realEstates: RealEstateItem[];

  // Logs
  activityLogs: ActivityLog[];

  // Mutators: PEH - Personal
  addHabit: (data: Omit<HabitItem, 'id' | 'completedDates' | 'createdAt'>) => void;
  toggleHabitToday: (id: string) => void;
  deleteHabit: (id: string) => void;

  addJournalEntry: (data: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  deleteJournalEntry: (id: string) => void;

  addGoal: (data: Omit<GoalItem, 'id' | 'createdAt' | 'milestones'>, initialMilestones?: string[]) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  deleteGoal: (id: string) => void;

  // Mutators: PEH - Essentials
  addVaultItem: (data: Omit<VaultItem, 'id' | 'updatedAt'>) => void;
  updateVaultItem: (id: string, data: Partial<VaultItem>) => void;
  deleteVaultItem: (id: string) => void;

  addDocument: (data: Omit<DocumentItem, 'id' | 'createdAt'>) => void;
  deleteDocument: (id: string) => void;

  addSubscription: (data: Omit<SubscriptionItem, 'id' | 'createdAt'>) => void;
  deleteSubscription: (id: string) => void;

  // Mutators: PEH - Household
  addPantryItem: (data: Omit<PantryItem, 'id' | 'createdAt'>) => void;
  updatePantryQty: (id: string, newQty: number) => void;
  toggleRestock: (id: string) => void;
  deletePantryItem: (id: string) => void;

  addMaintenanceItem: (data: Omit<MaintenanceItem, 'id' | 'createdAt'>) => void;
  markServiced: (id: string, nextDue: string) => void;
  deleteMaintenanceItem: (id: string) => void;

  addChore: (data: Omit<ChoreItem, 'id' | 'createdAt'>) => void;
  toggleChoreDone: (id: string) => void;
  deleteChore: (id: string) => void;

  addSharedExpense: (data: Omit<SharedExpenseItem, 'id' | 'createdAt'>) => void;
  toggleExpenseSettled: (id: string) => void;
  deleteSharedExpense: (id: string) => void;

  // Mutators: PFS - People
  addContact: (data: Omit<ContactItem, 'id' | 'createdAt'>) => void;
  recordContactInteraction: (id: string) => void;
  deleteContact: (id: string) => void;

  addMilestone: (data: Omit<MilestoneItem, 'id' | 'createdAt'>) => void;
  deleteMilestone: (id: string) => void;

  addGift: (data: Omit<GiftItem, 'id' | 'createdAt'>) => void;
  toggleGiftFulfilled: (id: string) => void;
  deleteGift: (id: string) => void;

  // Mutators: PFS - Family
  addFamilyMember: (data: Omit<FamilyMemberItem, 'id' | 'createdAt'>) => void;
  deleteFamilyMember: (id: string) => void;

  addFamilyHealth: (data: Omit<FamilyHealthItem, 'id' | 'createdAt'>) => void;
  updateFamilyHealth: (id: string, data: Partial<FamilyHealthItem>) => void;
  deleteFamilyHealth: (id: string) => void;

  addTradition: (data: Omit<TraditionItem, 'id' | 'createdAt'>) => void;
  deleteTradition: (id: string) => void;

  // Mutators: PFS - Society
  addCivicContact: (data: Omit<CivicItem, 'id' | 'createdAt'>) => void;
  deleteCivicContact: (id: string) => void;

  addVolunteer: (data: Omit<VolunteerItem, 'id' | 'createdAt'>) => void;
  deleteVolunteer: (id: string) => void;

  addCharity: (data: Omit<CharityItem, 'id' | 'createdAt'>) => void;
  deleteCharity: (id: string) => void;

  // Mutators: POO - Productivity
  addProject: (data: Omit<ProjectItem, 'id' | 'createdAt'>) => void;
  updateProjectProgress: (id: string, progressPercent: number, status?: ProjectItem['status']) => void;
  deleteProject: (id: string) => void;

  addTask: (data: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;

  addKnowledge: (data: Omit<KnowledgeItem, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  deleteKnowledge: (id: string) => void;

  // Mutators: POO - Operations
  addWorkflow: (data: Omit<WorkflowItem, 'id' | 'createdAt'>) => void;
  advanceWorkflowStage: (id: string) => void;
  deleteWorkflow: (id: string) => void;

  addVendor: (data: Omit<VendorItem, 'id' | 'createdAt'>) => void;
  deleteVendor: (id: string) => void;

  addIncident: (data: Omit<IncidentItem, 'id' | 'createdAt'>) => void;
  resolveIncident: (id: string, resolutionNotes: string, rootCause?: string) => void;
  deleteIncident: (id: string) => void;

  // Mutators: POO - Ownership
  addCapitalAsset: (data: Omit<CapitalAssetItem, 'id' | 'createdAt'>) => void;
  updateAssetValuation: (id: string, newValuation: number) => void;
  deleteCapitalAsset: (id: string) => void;

  addIpLicense: (data: Omit<IpLicenseItem, 'id' | 'createdAt'>) => void;
  deleteIpLicense: (id: string) => void;

  addCapTableItem: (data: Omit<CapTableItem, 'id' | 'createdAt'>) => void;
  deleteCapTableItem: (id: string) => void;

  // Mutators: 20 New Apps
  addReading: (data: Omit<ReadingItem, 'id' | 'createdAt'>) => void;
  updateReadingProgress: (id: string, currentPage: number, status?: ReadingItem['status']) => void;
  deleteReading: (id: string) => void;

  addFitnessLog: (data: Omit<FitnessItem, 'id' | 'createdAt'>) => void;
  deleteFitnessLog: (id: string) => void;

  addSleepLog: (data: Omit<SleepItem, 'id' | 'createdAt'>) => void;
  deleteSleepLog: (id: string) => void;

  addBudgetEnvelope: (data: Omit<BudgetItem, 'id' | 'createdAt'>) => void;
  updateBudgetSpent: (id: string, newSpent: number) => void;
  deleteBudgetEnvelope: (id: string) => void;

  addInsurancePolicy: (data: Omit<InsuranceItem, 'id' | 'createdAt'>) => void;
  deleteInsurancePolicy: (id: string) => void;

  addPlant: (data: Omit<PlantItem, 'id' | 'createdAt'>) => void;
  waterPlant: (id: string) => void;
  deletePlant: (id: string) => void;

  addVehicle: (data: Omit<VehicleItem, 'id' | 'createdAt'>) => void;
  updateVehicleOdometer: (id: string, newKm: number) => void;
  deleteVehicle: (id: string) => void;

  addMentorship: (data: Omit<MentorshipItem, 'id' | 'createdAt'>) => void;
  deleteMentorship: (id: string) => void;

  addIntroduction: (data: Omit<IntroductionItem, 'id' | 'createdAt'>) => void;
  updateIntroductionStatus: (id: string, status: IntroductionItem['status'], outcomeNotes?: string) => void;
  deleteIntroduction: (id: string) => void;

  addFamilyRecipe: (data: Omit<FamilyRecipeItem, 'id' | 'createdAt'>) => void;
  deleteFamilyRecipe: (id: string) => void;

  addFamilyBudget: (data: Omit<FamilyBudgetItem, 'id' | 'createdAt'>) => void;
  updateFamilyBudgetAmount: (id: string, newCurrent: number) => void;
  deleteFamilyBudget: (id: string) => void;

  addPet: (data: Omit<PetCareItem, 'id' | 'createdAt'>) => void;
  updatePetWeight: (id: string, weightKg: number) => void;
  deletePet: (id: string) => void;

  addCommunityEvent: (data: Omit<CommunityEventItem, 'id' | 'createdAt'>) => void;
  deleteCommunityEvent: (id: string) => void;

  addAdvocacy: (data: Omit<AdvocacyItem, 'id' | 'createdAt'>) => void;
  updateAdvocacyStatus: (id: string, status: AdvocacyItem['status'], notes?: string) => void;
  deleteAdvocacy: (id: string) => void;

  addTimeAudit: (data: Omit<TimeAuditItem, 'id' | 'createdAt'>) => void;
  deleteTimeAudit: (id: string) => void;

  addMeeting: (data: Omit<MeetingItem, 'id' | 'createdAt'>) => void;
  toggleMeetingActionItem: (meetingId: string, actionIndex: number) => void;
  deleteMeeting: (id: string) => void;

  addProcurement: (data: Omit<ProcurementItem, 'id' | 'createdAt'>) => void;
  updateProcurementStatus: (id: string, status: ProcurementItem['status']) => void;
  deleteProcurement: (id: string) => void;

  addCompliance: (data: Omit<ComplianceItem, 'id' | 'createdAt'>) => void;
  updateComplianceStatus: (id: string, status: ComplianceItem['status']) => void;
  deleteCompliance: (id: string) => void;

  addInvestment: (data: Omit<InvestmentItem, 'id' | 'createdAt'>) => void;
  updateInvestmentPrice: (id: string, currentPrice: number) => void;
  deleteInvestment: (id: string) => void;

  addRealEstate: (data: Omit<RealEstateItem, 'id' | 'createdAt'>) => void;
  deleteRealEstate: (id: string) => void;

  // Utilities
  clearAllData: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => boolean;
  totalAppCounts: Record<StandaloneAppId, number>;
  lastSynced: string;
}

const STORAGE_KEY = 'peh_pfs_workspace_v2';

const PEHContext = createContext<PEHContextType | undefined>(undefined);

export const PEHProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Workspace state (default: peh, seamlessly switchable to pfs)
  const [activeWorkspace, setActiveWorkspaceState] = useState<WorkspaceId>('peh');

  // Navigation
  const [activeCategory, setActiveCategory] = useState<MainCategory>('overview');
  const [activeApp, setActiveApp] = useState<StandaloneAppId>('overview');
  const [activeSubMenu, setActiveSubMenu] = useState<string>('default');

  // Search & Modals
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<string>('Tersinkronisasi');

  // Stores: PEH
  const [habits, setHabits] = useState<HabitItem[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([]);
  const [chores, setChores] = useState<ChoreItem[]>([]);
  const [sharedExpenses, setSharedExpenses] = useState<SharedExpenseItem[]>([]);

  // Stores: PFS
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberItem[]>([]);
  const [familyHealth, setFamilyHealth] = useState<FamilyHealthItem[]>([]);
  const [traditions, setTraditions] = useState<TraditionItem[]>([]);
  const [civicContacts, setCivicContacts] = useState<CivicItem[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerItem[]>([]);
  const [charities, setCharities] = useState<CharityItem[]>([]);

  // Stores: POO
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeItem[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [vendors, setVendors] = useState<VendorItem[]>([]);
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);
  const [capitalAssets, setCapitalAssets] = useState<CapitalAssetItem[]>([]);
  const [ipLicenses, setIpLicenses] = useState<IpLicenseItem[]>([]);
  const [capTable, setCapTable] = useState<CapTableItem[]>([]);

  // Stores: 20 New Apps
  const [readings, setReadings] = useState<ReadingItem[]>([]);
  const [fitnessLogs, setFitnessLogs] = useState<FitnessItem[]>([]);
  const [sleepLogs, setSleepLogs] = useState<SleepItem[]>([]);
  const [budgetEnvelopes, setBudgetEnvelopes] = useState<BudgetItem[]>([]);
  const [insurancePolicies, setInsurancePolicies] = useState<InsuranceItem[]>([]);
  const [plants, setPlants] = useState<PlantItem[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);

  const [mentorships, setMentorships] = useState<MentorshipItem[]>([]);
  const [introductions, setIntroductions] = useState<IntroductionItem[]>([]);
  const [familyRecipes, setFamilyRecipes] = useState<FamilyRecipeItem[]>([]);
  const [familyBudgets, setFamilyBudgets] = useState<FamilyBudgetItem[]>([]);
  const [pets, setPets] = useState<PetCareItem[]>([]);
  const [communityEvents, setCommunityEvents] = useState<CommunityEventItem[]>([]);
  const [advocacies, setAdvocacies] = useState<AdvocacyItem[]>([]);

  const [timeAudits, setTimeAudits] = useState<TimeAuditItem[]>([]);
  const [meetings, setMeetings] = useState<MeetingItem[]>([]);
  const [procurements, setProcurements] = useState<ProcurementItem[]>([]);
  const [compliances, setCompliances] = useState<ComplianceItem[]>([]);
  const [investments, setInvestments] = useState<InvestmentItem[]>([]);
  const [realEstates, setRealEstates] = useState<RealEstateItem[]>([]);

  // Activity Logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('peh_pfs_workspace_v2');
      if (raw) {
        const p = JSON.parse(raw);
        if (p.activeWorkspace) setActiveWorkspaceState(p.activeWorkspace);
        if (p.habits) setHabits(p.habits);
        if (p.journalEntries) setJournalEntries(p.journalEntries);
        if (p.goals) setGoals(p.goals);
        if (p.vaultItems) setVaultItems(p.vaultItems);
        if (p.documents) setDocuments(p.documents);
        if (p.subscriptions) setSubscriptions(p.subscriptions);
        if (p.pantryItems) setPantryItems(p.pantryItems);
        if (p.maintenanceItems) setMaintenanceItems(p.maintenanceItems);
        if (p.chores) setChores(p.chores);
        if (p.sharedExpenses) setSharedExpenses(p.sharedExpenses);

        if (p.contacts) setContacts(p.contacts);
        if (p.milestones) setMilestones(p.milestones);
        if (p.gifts) setGifts(p.gifts);
        if (p.familyMembers) setFamilyMembers(p.familyMembers);
        if (p.familyHealth) setFamilyHealth(p.familyHealth);
        if (p.traditions) setTraditions(p.traditions);
        if (p.civicContacts) setCivicContacts(p.civicContacts);
        if (p.volunteers) setVolunteers(p.volunteers);
        if (p.charities) setCharities(p.charities);

        if (p.projects) setProjects(p.projects);
        if (p.tasks) setTasks(p.tasks);
        if (p.knowledgeList) setKnowledgeList(p.knowledgeList);
        if (p.workflows) setWorkflows(p.workflows);
        if (p.vendors) setVendors(p.vendors);
        if (p.incidents) setIncidents(p.incidents);
        if (p.capitalAssets) setCapitalAssets(p.capitalAssets);
        if (p.ipLicenses) setIpLicenses(p.ipLicenses);
        if (p.capTable) setCapTable(p.capTable);

        if (p.readings) setReadings(p.readings);
        if (p.fitnessLogs) setFitnessLogs(p.fitnessLogs);
        if (p.sleepLogs) setSleepLogs(p.sleepLogs);
        if (p.budgetEnvelopes) setBudgetEnvelopes(p.budgetEnvelopes);
        if (p.insurancePolicies) setInsurancePolicies(p.insurancePolicies);
        if (p.plants) setPlants(p.plants);
        if (p.vehicles) setVehicles(p.vehicles);

        if (p.mentorships) setMentorships(p.mentorships);
        if (p.introductions) setIntroductions(p.introductions);
        if (p.familyRecipes) setFamilyRecipes(p.familyRecipes);
        if (p.familyBudgets) setFamilyBudgets(p.familyBudgets);
        if (p.pets) setPets(p.pets);
        if (p.communityEvents) setCommunityEvents(p.communityEvents);
        if (p.advocacies) setAdvocacies(p.advocacies);

        if (p.timeAudits) setTimeAudits(p.timeAudits);
        if (p.meetings) setMeetings(p.meetings);
        if (p.procurements) setProcurements(p.procurements);
        if (p.compliances) setCompliances(p.compliances);
        if (p.investments) setInvestments(p.investments);
        if (p.realEstates) setRealEstates(p.realEstates);

        if (p.activityLogs) setActivityLogs(p.activityLogs);
      }
    } catch {
      // fallback
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    const payload = {
      activeWorkspace,
      habits,
      journalEntries,
      goals,
      vaultItems,
      documents,
      subscriptions,
      pantryItems,
      maintenanceItems,
      chores,
      sharedExpenses,
      contacts,
      milestones,
      gifts,
      familyMembers,
      familyHealth,
      traditions,
      civicContacts,
      volunteers,
      charities,
      projects,
      tasks,
      knowledgeList,
      workflows,
      vendors,
      incidents,
      capitalAssets,
      ipLicenses,
      capTable,
      readings,
      fitnessLogs,
      sleepLogs,
      budgetEnvelopes,
      insurancePolicies,
      plants,
      vehicles,
      mentorships,
      introductions,
      familyRecipes,
      familyBudgets,
      pets,
      communityEvents,
      advocacies,
      timeAudits,
      meetings,
      procurements,
      compliances,
      investments,
      realEstates,
      activityLogs,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      setLastSynced(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      // storage full
    }
  }, [
    activeWorkspace,
    habits,
    journalEntries,
    goals,
    vaultItems,
    documents,
    subscriptions,
    pantryItems,
    maintenanceItems,
    chores,
    sharedExpenses,
    contacts,
    milestones,
    gifts,
    familyMembers,
    familyHealth,
    traditions,
    civicContacts,
    volunteers,
    charities,
    projects,
    tasks,
    knowledgeList,
    workflows,
    vendors,
    incidents,
    capitalAssets,
    ipLicenses,
    capTable,
    readings,
    fitnessLogs,
    sleepLogs,
    budgetEnvelopes,
    insurancePolicies,
    plants,
    vehicles,
    mentorships,
    introductions,
    familyRecipes,
    familyBudgets,
    pets,
    communityEvents,
    advocacies,
    timeAudits,
    meetings,
    procurements,
    compliances,
    investments,
    realEstates,
    activityLogs,
  ]);

  // Switch workspace
  const setActiveWorkspace = (ws: WorkspaceId) => {
    setActiveWorkspaceState(ws);
    setActiveCategory('overview');
    setActiveApp('overview');
    setActiveSubMenu('default');
  };

  // Activity logger helper
  const logActivity = (
    wsId: WorkspaceId,
    appId: StandaloneAppId,
    action: ActivityLog['action'],
    title: string,
    details: string
  ) => {
    const newLog: ActivityLog = {
      id: 'act_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      workspaceId: wsId,
      appId,
      action,
      title,
      details,
      timestamp: new Date().toISOString(),
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Smart Navigation
  const navigateTo = (appId: StandaloneAppId, subMenuId?: string) => {
    if (appId === 'overview') {
      setActiveCategory('overview');
      setActiveApp('overview');
      setActiveSubMenu('default');
      return;
    }

    if (appId === 'comparison') {
      setActiveCategory('comparison');
      setActiveApp('comparison');
      setActiveSubMenu('default');
      return;
    }

    if (appId === 'innovations') {
      setActiveCategory('comparison');
      setActiveApp('innovations');
      setActiveSubMenu(subMenuId || 'all');
      return;
    }

    // Check all workspaces and switch workspace automatically if needed
    const allWorkspaces: { ws: WorkspaceId; config: typeof CATEGORIES_CONFIG_PEH }[] = [
      { ws: activeWorkspace, config: activeWorkspace === 'peh' ? CATEGORIES_CONFIG_PEH : activeWorkspace === 'pfs' ? CATEGORIES_CONFIG_PFS : CATEGORIES_CONFIG_POO },
      { ws: 'peh', config: CATEGORIES_CONFIG_PEH },
      { ws: 'pfs', config: CATEGORIES_CONFIG_PFS },
      { ws: 'poo', config: CATEGORIES_CONFIG_POO },
    ];

    for (const item of allWorkspaces) {
      const match = item.config.flatMap((c) => c.apps).find((a) => a.id === appId);
      if (match) {
        if (activeWorkspace !== item.ws) {
          setActiveWorkspaceState(item.ws);
        }
        setActiveCategory(match.categoryId);
        setActiveApp(appId);
        setActiveSubMenu(subMenuId || match.subMenus[0]?.id || 'default');
        return;
      }
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getTodayStr = () => new Date().toISOString().split('T')[0];

  // --- PEH Actions ---
  const addHabit = (data: Omit<HabitItem, 'id' | 'completedDates' | 'createdAt'>) => {
    const item: HabitItem = {
      ...data,
      id: 'hb_' + Date.now(),
      completedDates: [],
      createdAt: new Date().toISOString(),
    };
    setHabits((prev) => [item, ...prev]);
    logActivity('peh', 'habits', 'create', item.title, `Kebiasaan baru (${item.frequency})`);
  };

  const toggleHabitToday = (id: string) => {
    const today = getTodayStr();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const hasDone = h.completedDates.includes(today);
        const updatedDates = hasDone
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today];
        logActivity('peh', 'habits', hasDone ? 'update' : 'complete', h.title, hasDone ? 'Batal selesai' : 'Selesai hari ini');
        return { ...h, completedDates: updatedDates };
      })
    );
  };

  const deleteHabit = (id: string) => {
    const h = habits.find((i) => i.id === id);
    setHabits((prev) => prev.filter((i) => i.id !== id));
    if (h) logActivity('peh', 'habits', 'delete', h.title, 'Kebiasaan dihapus');
  };

  const addJournalEntry = (data: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const item: JournalEntry = {
      ...data,
      id: 'jn_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setJournalEntries((prev) => [item, ...prev]);
    logActivity('peh', 'journal', 'create', item.title, `Catatan jurnal (${item.mood})`);
  };

  const deleteJournalEntry = (id: string) => {
    const j = journalEntries.find((i) => i.id === id);
    setJournalEntries((prev) => prev.filter((i) => i.id !== id));
    if (j) logActivity('peh', 'journal', 'delete', j.title, 'Entri jurnal dihapus');
  };

  const addGoal = (data: Omit<GoalItem, 'id' | 'createdAt' | 'milestones'>, initialMilestones?: string[]) => {
    const item: GoalItem = {
      ...data,
      id: 'gl_' + Date.now(),
      createdAt: new Date().toISOString(),
      milestones: (initialMilestones || []).map((m, idx) => ({
        id: 'ms_' + idx + '_' + Date.now(),
        title: m,
        completed: false,
      })),
    };
    setGoals((prev) => [item, ...prev]);
    logActivity('peh', 'goals', 'create', item.title, `Target baru untuk ${item.targetDate}`);
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const updatedMs = g.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const allDone = updatedMs.length > 0 && updatedMs.every((m) => m.completed);
        return { ...g, milestones: updatedMs, status: allDone ? 'Selesai' : g.status };
      })
    );
  };

  const deleteGoal = (id: string) => {
    const g = goals.find((i) => i.id === id);
    setGoals((prev) => prev.filter((i) => i.id !== id));
    if (g) logActivity('peh', 'goals', 'delete', g.title, 'Target sasaran dihapus');
  };

  const addVaultItem = (data: Omit<VaultItem, 'id' | 'updatedAt'>) => {
    const item: VaultItem = {
      ...data,
      id: 'vt_' + Date.now(),
      updatedAt: new Date().toISOString(),
    };
    setVaultItems((prev) => [item, ...prev]);
    logActivity('peh', 'vault', 'create', item.title, `Kredensial disimpan (${item.type})`);
  };

  const updateVaultItem = (id: string, data: Partial<VaultItem>) => {
    setVaultItems((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...data, updatedAt: new Date().toISOString() } : v))
    );
  };

  const deleteVaultItem = (id: string) => {
    const v = vaultItems.find((i) => i.id === id);
    setVaultItems((prev) => prev.filter((i) => i.id !== id));
    if (v) logActivity('peh', 'vault', 'delete', v.title, 'Kredensial dihapus');
  };

  const addDocument = (data: Omit<DocumentItem, 'id' | 'createdAt'>) => {
    const item: DocumentItem = {
      ...data,
      id: 'doc_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setDocuments((prev) => [item, ...prev]);
    logActivity('peh', 'documents', 'create', item.title, `Dokumen disimpan di ${item.physicalLocation}`);
  };

  const deleteDocument = (id: string) => {
    const d = documents.find((i) => i.id === id);
    setDocuments((prev) => prev.filter((i) => i.id !== id));
    if (d) logActivity('peh', 'documents', 'delete', d.title, 'Dokumen dihapus');
  };

  const addSubscription = (data: Omit<SubscriptionItem, 'id' | 'createdAt'>) => {
    const item: SubscriptionItem = {
      ...data,
      id: 'sub_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setSubscriptions((prev) => [item, ...prev]);
    logActivity('peh', 'subscriptions', 'create', item.serviceName, `Langganan Rp ${item.cost.toLocaleString('id-ID')}`);
  };

  const deleteSubscription = (id: string) => {
    const s = subscriptions.find((i) => i.id === id);
    setSubscriptions((prev) => prev.filter((i) => i.id !== id));
    if (s) logActivity('peh', 'subscriptions', 'delete', s.serviceName, 'Langganan dihapus');
  };

  const addPantryItem = (data: Omit<PantryItem, 'id' | 'createdAt'>) => {
    const item: PantryItem = {
      ...data,
      id: 'pnt_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setPantryItems((prev) => [item, ...prev]);
    logActivity('peh', 'pantry', 'create', item.name, `Stok: ${item.quantity} ${item.unit}`);
  };

  const updatePantryQty = (id: string, newQty: number) => {
    setPantryItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const validQty = Math.max(0, newQty);
        return { ...item, quantity: validQty, isRestockNeeded: validQty <= item.minStockAlert };
      })
    );
  };

  const toggleRestock = (id: string) => {
    setPantryItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = !item.isRestockNeeded;
        logActivity('peh', 'pantry', 'update', item.name, next ? 'Masuk daftar belanja' : 'Ditandai sudah dibeli');
        return { ...item, isRestockNeeded: next };
      })
    );
  };

  const deletePantryItem = (id: string) => {
    const p = pantryItems.find((i) => i.id === id);
    setPantryItems((prev) => prev.filter((i) => i.id !== id));
    if (p) logActivity('peh', 'pantry', 'delete', p.name, 'Item bahan dihapus');
  };

  const addMaintenanceItem = (data: Omit<MaintenanceItem, 'id' | 'createdAt'>) => {
    const item: MaintenanceItem = {
      ...data,
      id: 'mnt_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setMaintenanceItems((prev) => [item, ...prev]);
    logActivity('peh', 'maintenance', 'create', item.assetName, `Servis tiap ${item.intervalMonths} bulan`);
  };

  const markServiced = (id: string, nextDue: string) => {
    setMaintenanceItems((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        logActivity('peh', 'maintenance', 'complete', m.assetName, `Servis selesai. Jatuh tempo: ${nextDue}`);
        return { ...m, lastServicedDate: getTodayStr(), nextDueDate: nextDue };
      })
    );
  };

  const deleteMaintenanceItem = (id: string) => {
    const m = maintenanceItems.find((i) => i.id === id);
    setMaintenanceItems((prev) => prev.filter((i) => i.id !== id));
    if (m) logActivity('peh', 'maintenance', 'delete', m.assetName, 'Jadwal servis dihapus');
  };

  const addChore = (data: Omit<ChoreItem, 'id' | 'createdAt'>) => {
    const item: ChoreItem = {
      ...data,
      id: 'chr_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setChores((prev) => [item, ...prev]);
    logActivity('peh', 'chores', 'create', item.title, `Piket ditugaskan ke: ${item.assignee}`);
  };

  const toggleChoreDone = (id: string) => {
    const today = getTodayStr();
    setChores((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const isDone = c.lastCompletedDate === today;
        const updated = isDone ? undefined : today;
        logActivity('peh', 'chores', isDone ? 'update' : 'complete', c.title, isDone ? 'Batal hari ini' : 'Selesai hari ini');
        return { ...c, lastCompletedDate: updated };
      })
    );
  };

  const deleteChore = (id: string) => {
    const c = chores.find((i) => i.id === id);
    setChores((prev) => prev.filter((i) => i.id !== id));
    if (c) logActivity('peh', 'chores', 'delete', c.title, 'Tugas piket dihapus');
  };

  const addSharedExpense = (data: Omit<SharedExpenseItem, 'id' | 'createdAt'>) => {
    const item: SharedExpenseItem = {
      ...data,
      id: 'exp_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setSharedExpenses((prev) => [item, ...prev]);
    logActivity('peh', 'chores', 'create', item.title, `Tagihan bersama Rp ${item.amount.toLocaleString('id-ID')}`);
  };

  const toggleExpenseSettled = (id: string) => {
    setSharedExpenses((prev) =>
      prev.map((e) => {
        if (e.id !== id) return e;
        const next = !e.isSettled;
        logActivity('peh', 'chores', 'update', e.title, next ? 'Ditandai lunas' : 'Batal lunas');
        return { ...e, isSettled: next };
      })
    );
  };

  const deleteSharedExpense = (id: string) => {
    const e = sharedExpenses.find((i) => i.id === id);
    setSharedExpenses((prev) => prev.filter((i) => i.id !== id));
    if (e) logActivity('peh', 'chores', 'delete', e.title, 'Tagihan dihapus');
  };

  // --- PFS Actions: People ---
  const addContact = (data: Omit<ContactItem, 'id' | 'createdAt'>) => {
    const item: ContactItem = {
      ...data,
      id: 'cnt_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setContacts((prev) => [item, ...prev]);
    logActivity('pfs', 'contacts', 'create', item.fullName, `Relasi baru (${item.relationship})`);
  };

  const recordContactInteraction = (id: string) => {
    const today = getTodayStr();
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        logActivity('pfs', 'contacts', 'update', c.fullName, `Interaksi sapaan tercatat hari ini (${today})`);
        return { ...c, lastContactedDate: today };
      })
    );
  };

  const deleteContact = (id: string) => {
    const c = contacts.find((i) => i.id === id);
    setContacts((prev) => prev.filter((i) => i.id !== id));
    if (c) logActivity('pfs', 'contacts', 'delete', c.fullName, 'Kontak relasi dihapus');
  };

  const addMilestone = (data: Omit<MilestoneItem, 'id' | 'createdAt'>) => {
    const item: MilestoneItem = {
      ...data,
      id: 'mls_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setMilestones((prev) => [item, ...prev]);
    logActivity('pfs', 'milestones', 'create', item.title, `${item.eventType} untuk ${item.personName} (${item.date})`);
  };

  const deleteMilestone = (id: string) => {
    const m = milestones.find((i) => i.id === id);
    setMilestones((prev) => prev.filter((i) => i.id !== id));
    if (m) logActivity('pfs', 'milestones', 'delete', m.title, 'Momen dihapus');
  };

  const addGift = (data: Omit<GiftItem, 'id' | 'createdAt'>) => {
    const item: GiftItem = {
      ...data,
      id: 'gft_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setGifts((prev) => [item, ...prev]);
    logActivity('pfs', 'gifts', 'create', item.itemDescription, `${item.direction} untuk/dari ${item.personName}`);
  };

  const toggleGiftFulfilled = (id: string) => {
    setGifts((prev) =>
      prev.map((g) => {
        if (g.id !== id) return g;
        const next = !g.isFulfilled;
        logActivity('pfs', 'gifts', 'update', g.itemDescription, next ? 'Tercapai / Diberikan' : 'Batal status');
        return { ...g, isFulfilled: next };
      })
    );
  };

  const deleteGift = (id: string) => {
    const g = gifts.find((i) => i.id === id);
    setGifts((prev) => prev.filter((i) => i.id !== id));
    if (g) logActivity('pfs', 'gifts', 'delete', g.itemDescription, 'Catatan hadiah dihapus');
  };

  // --- PFS Actions: Family ---
  const addFamilyMember = (data: Omit<FamilyMemberItem, 'id' | 'createdAt'>) => {
    const item: FamilyMemberItem = {
      ...data,
      id: 'fmb_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setFamilyMembers((prev) => [item, ...prev]);
    logActivity('pfs', 'family_tree', 'create', item.fullName, `Anggota keluarga (${item.role})`);
  };

  const deleteFamilyMember = (id: string) => {
    const f = familyMembers.find((i) => i.id === id);
    setFamilyMembers((prev) => prev.filter((i) => i.id !== id));
    if (f) logActivity('pfs', 'family_tree', 'delete', f.fullName, 'Anggota keluarga dihapus');
  };

  const addFamilyHealth = (data: Omit<FamilyHealthItem, 'id' | 'createdAt'>) => {
    const item: FamilyHealthItem = {
      ...data,
      id: 'fhl_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setFamilyHealth((prev) => [item, ...prev]);
    logActivity('pfs', 'family_health', 'create', item.memberName, `Rekam medis (Gol. Darah ${item.bloodType})`);
  };

  const updateFamilyHealth = (id: string, data: Partial<FamilyHealthItem>) => {
    setFamilyHealth((prev) => prev.map((f) => (f.id === id ? { ...f, ...data } : f)));
  };

  const deleteFamilyHealth = (id: string) => {
    const f = familyHealth.find((i) => i.id === id);
    setFamilyHealth((prev) => prev.filter((i) => i.id !== id));
    if (f) logActivity('pfs', 'family_health', 'delete', f.memberName, 'Data rekam medis dihapus');
  };

  const addTradition = (data: Omit<TraditionItem, 'id' | 'createdAt'>) => {
    const item: TraditionItem = {
      ...data,
      id: 'trd_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTraditions((prev) => [item, ...prev]);
    logActivity('pfs', 'traditions', 'create', item.title, `Tradisi (${item.category}) pada ${item.nextDate}`);
  };

  const deleteTradition = (id: string) => {
    const t = traditions.find((i) => i.id === id);
    setTraditions((prev) => prev.filter((i) => i.id !== id));
    if (t) logActivity('pfs', 'traditions', 'delete', t.title, 'Tradisi keluarga dihapus');
  };

  // --- PFS Actions: Society ---
  const addCivicContact = (data: Omit<CivicItem, 'id' | 'createdAt'>) => {
    const item: CivicItem = {
      ...data,
      id: 'cvc_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCivicContacts((prev) => [item, ...prev]);
    logActivity('pfs', 'civic', 'create', item.nameOrOfficial, `Kontak RT/RW: ${item.role} (${item.areaName})`);
  };

  const deleteCivicContact = (id: string) => {
    const c = civicContacts.find((i) => i.id === id);
    setCivicContacts((prev) => prev.filter((i) => i.id !== id));
    if (c) logActivity('pfs', 'civic', 'delete', c.nameOrOfficial, 'Kontak warga dihapus');
  };

  const addVolunteer = (data: Omit<VolunteerItem, 'id' | 'createdAt'>) => {
    const item: VolunteerItem = {
      ...data,
      id: 'vln_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setVolunteers((prev) => [item, ...prev]);
    logActivity('pfs', 'volunteering', 'create', item.initiativeTitle, `${item.hoursSpent} jam kontribusi (${item.organization})`);
  };

  const deleteVolunteer = (id: string) => {
    const v = volunteers.find((i) => i.id === id);
    setVolunteers((prev) => prev.filter((i) => i.id !== id));
    if (v) logActivity('pfs', 'volunteering', 'delete', v.initiativeTitle, 'Catatan sukarelawan dihapus');
  };

  const addCharity = (data: Omit<CharityItem, 'id' | 'createdAt'>) => {
    const item: CharityItem = {
      ...data,
      id: 'chr_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCharities((prev) => [item, ...prev]);
    logActivity('pfs', 'charity', 'create', item.causeTitle, `Donasi Rp ${item.amount.toLocaleString('id-ID')} ke ${item.beneficiaryOrOrg}`);
  };

  const deleteCharity = (id: string) => {
    const c = charities.find((i) => i.id === id);
    setCharities((prev) => prev.filter((i) => i.id !== id));
    if (c) logActivity('pfs', 'charity', 'delete', c.causeTitle, 'Catatan donasi dihapus');
  };

  // --- POO Actions: Productivity ---
  const addProject = (data: Omit<ProjectItem, 'id' | 'createdAt'>) => {
    const item: ProjectItem = {
      ...data,
      id: 'prj_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [item, ...prev]);
    logActivity('poo', 'projects', 'create', item.title, `Proyek (${item.category}) tenggat ${item.deadline}`);
  };

  const updateProjectProgress = (id: string, progressPercent: number, status?: ProjectItem['status']) => {
    setProjects((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            progressPercent: Math.min(100, Math.max(0, progressPercent)),
            status: status || (progressPercent >= 100 ? 'Selesai' : item.status),
          };
          logActivity('poo', 'projects', 'update', updated.title, `Progress diperbarui: ${updated.progressPercent}% (${updated.status})`);
          return updated;
        }
        return item;
      })
    );
  };

  const deleteProject = (id: string) => {
    const p = projects.find((i) => i.id === id);
    setProjects((prev) => prev.filter((i) => i.id !== id));
    if (p) logActivity('poo', 'projects', 'delete', p.title, 'Proyek dihapus');
  };

  const addTask = (data: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const item: TaskItem = {
      ...data,
      id: 'tsk_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [item, ...prev]);
    logActivity('poo', 'tasks', 'create', item.title, `Tugas (${item.priorityQuadrant}) durasi ${item.estimatedHours} jam`);
  };

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus: TaskItem['status'] = t.status === 'Selesai' ? 'Todo' : 'Selesai';
          logActivity('poo', 'tasks', nextStatus === 'Selesai' ? 'complete' : 'update', t.title, `Status tugas: ${nextStatus}`);
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    const t = tasks.find((i) => i.id === id);
    setTasks((prev) => prev.filter((i) => i.id !== id));
    if (t) logActivity('poo', 'tasks', 'delete', t.title, 'Tugas dihapus');
  };

  const addKnowledge = (data: Omit<KnowledgeItem, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const item: KnowledgeItem = {
      ...data,
      id: 'knw_' + Date.now(),
      lastUpdated: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    setKnowledgeList((prev) => [item, ...prev]);
    logActivity('poo', 'knowledge', 'create', item.title, `Dokumen ${item.docType} (${item.department})`);
  };

  const deleteKnowledge = (id: string) => {
    const k = knowledgeList.find((i) => i.id === id);
    setKnowledgeList((prev) => prev.filter((i) => i.id !== id));
    if (k) logActivity('poo', 'knowledge', 'delete', k.title, 'Dokumen SOP dihapus');
  };

  // --- POO Actions: Operations ---
  const addWorkflow = (data: Omit<WorkflowItem, 'id' | 'createdAt'>) => {
    const item: WorkflowItem = {
      ...data,
      id: 'wfl_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setWorkflows((prev) => [item, ...prev]);
    logActivity('poo', 'workflows', 'create', item.workflowName, `Alur (${item.department}) dengan ${item.stages.length} tahap`);
  };

  const advanceWorkflowStage = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextIdx = w.currentStageIndex + 1;
          const isFinished = nextIdx >= w.stages.length;
          const updated: WorkflowItem = {
            ...w,
            currentStageIndex: isFinished ? w.stages.length - 1 : nextIdx,
            status: isFinished ? 'Selesai' : 'Aktif Berjalan',
          };
          logActivity(
            'poo',
            'workflows',
            'update',
            w.workflowName,
            isFinished
              ? 'Seluruh tahapan alur telah rampung'
              : `Maju ke tahap: ${w.stages[nextIdx]}`
          );
          return updated;
        }
        return w;
      })
    );
  };

  const deleteWorkflow = (id: string) => {
    const w = workflows.find((i) => i.id === id);
    setWorkflows((prev) => prev.filter((i) => i.id !== id));
    if (w) logActivity('poo', 'workflows', 'delete', w.workflowName, 'Alur kerja dihapus');
  };

  const addVendor = (data: Omit<VendorItem, 'id' | 'createdAt'>) => {
    const item: VendorItem = {
      ...data,
      id: 'vnd_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setVendors((prev) => [item, ...prev]);
    logActivity('poo', 'vendors', 'create', item.companyName, `Vendor ${item.serviceCategory} kontrak Rp ${item.contractValue.toLocaleString('id-ID')}`);
  };

  const deleteVendor = (id: string) => {
    const v = vendors.find((i) => i.id === id);
    setVendors((prev) => prev.filter((i) => i.id !== id));
    if (v) logActivity('poo', 'vendors', 'delete', v.companyName, 'Data rekanan vendor dihapus');
  };

  const addIncident = (data: Omit<IncidentItem, 'id' | 'createdAt'>) => {
    const item: IncidentItem = {
      ...data,
      id: 'inc_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setIncidents((prev) => [item, ...prev]);
    logActivity('poo', 'incidents', 'create', item.issueTitle, `Insiden level ${item.severity} pada ${item.systemAffected}`);
  };

  const resolveIncident = (id: string, resolutionNotes: string, rootCause?: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          const updated: IncidentItem = {
            ...inc,
            status: 'Terselesaikan',
            resolutionNotes,
            rootCause: rootCause || inc.rootCause,
          };
          logActivity('poo', 'incidents', 'update', inc.issueTitle, 'Insiden telah berhasil ditangani dan diselesaikan');
          return updated;
        }
        return inc;
      })
    );
  };

  const deleteIncident = (id: string) => {
    const inc = incidents.find((i) => i.id === id);
    setIncidents((prev) => prev.filter((i) => i.id !== id));
    if (inc) logActivity('poo', 'incidents', 'delete', inc.issueTitle, 'Log insiden dihapus');
  };

  // --- POO Actions: Ownership ---
  const addCapitalAsset = (data: Omit<CapitalAssetItem, 'id' | 'createdAt'>) => {
    const item: CapitalAssetItem = {
      ...data,
      id: 'ast_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCapitalAssets((prev) => [item, ...prev]);
    logActivity('poo', 'assets', 'create', item.assetName, `Aset modal ${item.category} valuasi Rp ${item.currentValuation.toLocaleString('id-ID')}`);
  };

  const updateAssetValuation = (id: string, newValuation: number) => {
    setCapitalAssets((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, currentValuation: newValuation };
          logActivity('poo', 'assets', 'update', a.assetName, `Penyesuaian valuasi: Rp ${newValuation.toLocaleString('id-ID')}`);
          return updated;
        }
        return a;
      })
    );
  };

  const deleteCapitalAsset = (id: string) => {
    const a = capitalAssets.find((i) => i.id === id);
    setCapitalAssets((prev) => prev.filter((i) => i.id !== id));
    if (a) logActivity('poo', 'assets', 'delete', a.assetName, 'Data aset modal dihapus');
  };

  const addIpLicense = (data: Omit<IpLicenseItem, 'id' | 'createdAt'>) => {
    const item: IpLicenseItem = {
      ...data,
      id: 'ipl_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setIpLicenses((prev) => [item, ...prev]);
    logActivity('poo', 'ip_licenses', 'create', item.titleOrDomain, `Hak IP / Lisensi ${item.type} kedaluwarsa ${item.expiryDate}`);
  };

  const deleteIpLicense = (id: string) => {
    const ip = ipLicenses.find((i) => i.id === id);
    setIpLicenses((prev) => prev.filter((i) => i.id !== id));
    if (ip) logActivity('poo', 'ip_licenses', 'delete', ip.titleOrDomain, 'Lisensi/Domain dihapus');
  };

  const addCapTableItem = (data: Omit<CapTableItem, 'id' | 'createdAt'>) => {
    const item: CapTableItem = {
      ...data,
      id: 'cap_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCapTable((prev) => [item, ...prev]);
    logActivity('poo', 'cap_table', 'create', item.stakeholderName, `Alokasi ekuitas ${item.percentage}% (${item.sharesCount.toLocaleString('id-ID')} lembar)`);
  };

  const deleteCapTableItem = (id: string) => {
    const cap = capTable.find((i) => i.id === id);
    setCapTable((prev) => prev.filter((i) => i.id !== id));
    if (cap) logActivity('poo', 'cap_table', 'delete', cap.stakeholderName, 'Entri pemegang saham dihapus');
  };

  // --- PEH Actions: 20 New Apps ---
  // 1. Reading
  const addReading = (data: Omit<ReadingItem, 'id' | 'createdAt'>) => {
    const item: ReadingItem = {
      ...data,
      id: 'read_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setReadings((prev) => [item, ...prev]);
    logActivity('peh', 'reading', 'create', item.title, `Buku karya ${item.author} (${item.totalPages} hlm)`);
  };

  const updateReadingProgress = (id: string, currentPage: number, status?: ReadingItem['status']) => {
    setReadings((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const isFinished = currentPage >= r.totalPages;
          const updated: ReadingItem = {
            ...r,
            currentPage,
            status: status || (isFinished ? 'Selesai' : 'Sedang Dibaca'),
          };
          logActivity('peh', 'reading', 'update', r.title, `Halaman ${currentPage}/${r.totalPages}`);
          return updated;
        }
        return r;
      })
    );
  };

  const deleteReading = (id: string) => {
    const r = readings.find((i) => i.id === id);
    setReadings((prev) => prev.filter((i) => i.id !== id));
    if (r) logActivity('peh', 'reading', 'delete', r.title, 'Buku dihapus');
  };

  // 2. Fitness
  const addFitnessLog = (data: Omit<FitnessItem, 'id' | 'createdAt'>) => {
    const item: FitnessItem = {
      ...data,
      id: 'fit_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setFitnessLogs((prev) => [item, ...prev]);
    logActivity('peh', 'fitness', 'create', item.workoutName, `${item.workoutType} (${item.durationMinutes} menit)`);
  };

  const deleteFitnessLog = (id: string) => {
    const f = fitnessLogs.find((i) => i.id === id);
    setFitnessLogs((prev) => prev.filter((i) => i.id !== id));
    if (f) logActivity('peh', 'fitness', 'delete', f.workoutName, 'Log latihan dihapus');
  };

  // 3. Sleep
  const addSleepLog = (data: Omit<SleepItem, 'id' | 'createdAt'>) => {
    const item: SleepItem = {
      ...data,
      id: 'slp_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setSleepLogs((prev) => [item, ...prev]);
    logActivity('peh', 'sleep', 'create', `Tidur ${item.date}`, `${item.totalHours} jam (Skor: ${item.qualityScore})`);
  };

  const deleteSleepLog = (id: string) => {
    const s = sleepLogs.find((i) => i.id === id);
    setSleepLogs((prev) => prev.filter((i) => i.id !== id));
    if (s) logActivity('peh', 'sleep', 'delete', `Tidur ${s.date}`, 'Log tidur dihapus');
  };

  // 4. Budget
  const addBudgetEnvelope = (data: Omit<BudgetItem, 'id' | 'createdAt'>) => {
    const item: BudgetItem = {
      ...data,
      id: 'bdg_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setBudgetEnvelopes((prev) => [item, ...prev]);
    logActivity('peh', 'budget', 'create', item.envelopeName, `Plafon Rp ${item.allocatedAmount.toLocaleString('id-ID')}`);
  };

  const updateBudgetSpent = (id: string, newSpent: number) => {
    setBudgetEnvelopes((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updated = { ...b, spentAmount: newSpent };
          logActivity('peh', 'budget', 'update', b.envelopeName, `Terpakai Rp ${newSpent.toLocaleString('id-ID')}`);
          return updated;
        }
        return b;
      })
    );
  };

  const deleteBudgetEnvelope = (id: string) => {
    const b = budgetEnvelopes.find((i) => i.id === id);
    setBudgetEnvelopes((prev) => prev.filter((i) => i.id !== id));
    if (b) logActivity('peh', 'budget', 'delete', b.envelopeName, 'Pos anggaran dihapus');
  };

  // 5. Insurance
  const addInsurancePolicy = (data: Omit<InsuranceItem, 'id' | 'createdAt'>) => {
    const item: InsuranceItem = {
      ...data,
      id: 'ins_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setInsurancePolicies((prev) => [item, ...prev]);
    logActivity('peh', 'insurance', 'create', `${item.providerName} (${item.type})`, `Polis #${item.policyNumber}`);
  };

  const deleteInsurancePolicy = (id: string) => {
    const p = insurancePolicies.find((i) => i.id === id);
    setInsurancePolicies((prev) => prev.filter((i) => i.id !== id));
    if (p) logActivity('peh', 'insurance', 'delete', p.providerName, 'Polis asuransi dihapus');
  };

  // 6. Plants
  const addPlant = (data: Omit<PlantItem, 'id' | 'createdAt'>) => {
    const item: PlantItem = {
      ...data,
      id: 'plt_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setPlants((prev) => [item, ...prev]);
    logActivity('peh', 'plants', 'create', item.plantName, `Tanaman di ${item.location}`);
  };

  const waterPlant = (id: string) => {
    setPlants((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const today = new Date().toISOString().split('T')[0];
          const updated = { ...p, lastWateredDate: today, healthCondition: 'Subur & Segar' as const };
          logActivity('peh', 'plants', 'update', p.plantName, 'Penyiraman dicatat hari ini');
          return updated;
        }
        return p;
      })
    );
  };

  const deletePlant = (id: string) => {
    const p = plants.find((i) => i.id === id);
    setPlants((prev) => prev.filter((i) => i.id !== id));
    if (p) logActivity('peh', 'plants', 'delete', p.plantName, 'Tanaman dihapus');
  };

  // 7. Vehicles
  const addVehicle = (data: Omit<VehicleItem, 'id' | 'createdAt'>) => {
    const item: VehicleItem = {
      ...data,
      id: 'vhc_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setVehicles((prev) => [item, ...prev]);
    logActivity('peh', 'vehicles', 'create', item.vehicleName, `Plat ${item.plateNumber} (${item.currentOdometerKm.toLocaleString('id-ID')} km)`);
  };

  const updateVehicleOdometer = (id: string, newKm: number) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const updated = { ...v, currentOdometerKm: newKm };
          logActivity('peh', 'vehicles', 'update', v.vehicleName, `Odometer diperbarui: ${newKm.toLocaleString('id-ID')} km`);
          return updated;
        }
        return v;
      })
    );
  };

  const deleteVehicle = (id: string) => {
    const v = vehicles.find((i) => i.id === id);
    setVehicles((prev) => prev.filter((i) => i.id !== id));
    if (v) logActivity('peh', 'vehicles', 'delete', v.vehicleName, 'Data kendaraan dihapus');
  };

  // --- PFS Actions: 20 New Apps ---
  // 8. Mentorship
  const addMentorship = (data: Omit<MentorshipItem, 'id' | 'createdAt'>) => {
    const item: MentorshipItem = {
      ...data,
      id: 'mnt_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setMentorships((prev) => [item, ...prev]);
    logActivity('pfs', 'mentorship', 'create', item.mentorName, `Mentor bidang ${item.domain}`);
  };

  const deleteMentorship = (id: string) => {
    const m = mentorships.find((i) => i.id === id);
    setMentorships((prev) => prev.filter((i) => i.id !== id));
    if (m) logActivity('pfs', 'mentorship', 'delete', m.mentorName, 'Catatan mentor dihapus');
  };

  // 9. Introductions
  const addIntroduction = (data: Omit<IntroductionItem, 'id' | 'createdAt'>) => {
    const item: IntroductionItem = {
      ...data,
      id: 'itr_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setIntroductions((prev) => [item, ...prev]);
    logActivity('pfs', 'introductions', 'create', `${item.contactA} ↔ ${item.contactB}`, `Jembatan relasi: ${item.purpose}`);
  };

  const updateIntroductionStatus = (id: string, status: IntroductionItem['status'], outcomeNotes?: string) => {
    setIntroductions((prev) =>
      prev.map((it) => {
        if (it.id === id) {
          const updated = { ...it, status, outcomeNotes: outcomeNotes || it.outcomeNotes };
          logActivity('pfs', 'introductions', 'update', `${it.contactA} ↔ ${it.contactB}`, `Status: ${status}`);
          return updated;
        }
        return it;
      })
    );
  };

  const deleteIntroduction = (id: string) => {
    const it = introductions.find((i) => i.id === id);
    setIntroductions((prev) => prev.filter((i) => i.id !== id));
    if (it) logActivity('pfs', 'introductions', 'delete', `${it.contactA} ↔ ${it.contactB}`, 'Catatan referral dihapus');
  };

  // 10. Family Recipes
  const addFamilyRecipe = (data: Omit<FamilyRecipeItem, 'id' | 'createdAt'>) => {
    const item: FamilyRecipeItem = {
      ...data,
      id: 'rcp_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setFamilyRecipes((prev) => [item, ...prev]);
    logActivity('pfs', 'family_recipes', 'create', item.recipeTitle, `Resep warisan dari ${item.originPerson}`);
  };

  const deleteFamilyRecipe = (id: string) => {
    const r = familyRecipes.find((i) => i.id === id);
    setFamilyRecipes((prev) => prev.filter((i) => i.id !== id));
    if (r) logActivity('pfs', 'family_recipes', 'delete', r.recipeTitle, 'Resep keluarga dihapus');
  };

  // 11. Family Budget
  const addFamilyBudget = (data: Omit<FamilyBudgetItem, 'id' | 'createdAt'>) => {
    const item: FamilyBudgetItem = {
      ...data,
      id: 'fbdg_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setFamilyBudgets((prev) => [item, ...prev]);
    logActivity('pfs', 'family_budget', 'create', item.fundName, `Target tabungan Rp ${item.targetAmount.toLocaleString('id-ID')}`);
  };

  const updateFamilyBudgetAmount = (id: string, newCurrent: number) => {
    setFamilyBudgets((prev) =>
      prev.map((fb) => {
        if (fb.id === id) {
          const updated = { ...fb, currentAmount: newCurrent };
          logActivity('pfs', 'family_budget', 'update', fb.fundName, `Terkumpul Rp ${newCurrent.toLocaleString('id-ID')}`);
          return updated;
        }
        return fb;
      })
    );
  };

  const deleteFamilyBudget = (id: string) => {
    const fb = familyBudgets.find((i) => i.id === id);
    setFamilyBudgets((prev) => prev.filter((i) => i.id !== id));
    if (fb) logActivity('pfs', 'family_budget', 'delete', fb.fundName, 'Dana keluarga dihapus');
  };

  // 12. Pet Care
  const addPet = (data: Omit<PetCareItem, 'id' | 'createdAt'>) => {
    const item: PetCareItem = {
      ...data,
      id: 'pet_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setPets((prev) => [item, ...prev]);
    logActivity('pfs', 'pet_care', 'create', item.petName, `Anabul ${item.animalType} (${item.weightKg} kg)`);
  };

  const updatePetWeight = (id: string, weightKg: number) => {
    setPets((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, weightKg };
          logActivity('pfs', 'pet_care', 'update', p.petName, `Berat badan dicatat: ${weightKg} kg`);
          return updated;
        }
        return p;
      })
    );
  };

  const deletePet = (id: string) => {
    const p = pets.find((i) => i.id === id);
    setPets((prev) => prev.filter((i) => i.id !== id));
    if (p) logActivity('pfs', 'pet_care', 'delete', p.petName, 'Profil anabul dihapus');
  };

  // 13. Community Events
  const addCommunityEvent = (data: Omit<CommunityEventItem, 'id' | 'createdAt'>) => {
    const item: CommunityEventItem = {
      ...data,
      id: 'cev_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCommunityEvents((prev) => [item, ...prev]);
    logActivity('pfs', 'community_events', 'create', item.eventName, `Acara ${item.scope} tanggal ${item.eventDate}`);
  };

  const deleteCommunityEvent = (id: string) => {
    const ce = communityEvents.find((i) => i.id === id);
    setCommunityEvents((prev) => prev.filter((i) => i.id !== id));
    if (ce) logActivity('pfs', 'community_events', 'delete', ce.eventName, 'Acara komunitas dihapus');
  };

  // 14. Advocacy
  const addAdvocacy = (data: Omit<AdvocacyItem, 'id' | 'createdAt'>) => {
    const item: AdvocacyItem = {
      ...data,
      id: 'adv_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setAdvocacies((prev) => [item, ...prev]);
    logActivity('pfs', 'advocacy', 'create', item.issueTitle, `Laporan diajukan ke ${item.targetAuthority}`);
  };

  const updateAdvocacyStatus = (id: string, status: AdvocacyItem['status'], notes?: string) => {
    setAdvocacies((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, status, resolutionNotes: notes || a.resolutionNotes };
          logActivity('pfs', 'advocacy', 'update', a.issueTitle, `Status tindak lanjut: ${status}`);
          return updated;
        }
        return a;
      })
    );
  };

  const deleteAdvocacy = (id: string) => {
    const a = advocacies.find((i) => i.id === id);
    setAdvocacies((prev) => prev.filter((i) => i.id !== id));
    if (a) logActivity('pfs', 'advocacy', 'delete', a.issueTitle, 'Aspirasi dihapus');
  };

  // --- POO Actions: 20 New Apps ---
  // 15. Time Audit
  const addTimeAudit = (data: Omit<TimeAuditItem, 'id' | 'createdAt'>) => {
    const item: TimeAuditItem = {
      ...data,
      id: 'ta_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTimeAudits((prev) => [item, ...prev]);
    logActivity('poo', 'time_audit', 'create', item.activityName, `${item.category} (${item.durationMinutes} menit)`);
  };

  const deleteTimeAudit = (id: string) => {
    const ta = timeAudits.find((i) => i.id === id);
    setTimeAudits((prev) => prev.filter((i) => i.id !== id));
    if (ta) logActivity('poo', 'time_audit', 'delete', ta.activityName, 'Log waktu dihapus');
  };

  // 16. Meetings
  const addMeeting = (data: Omit<MeetingItem, 'id' | 'createdAt'>) => {
    const item: MeetingItem = {
      ...data,
      id: 'mtg_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setMeetings((prev) => [item, ...prev]);
    logActivity('poo', 'meetings', 'create', item.meetingTitle, `Notulensi rapat (${item.attendees.length} peserta)`);
  };

  const toggleMeetingActionItem = (meetingId: string, actionIndex: number) => {
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id === meetingId) {
          const updatedActions = m.actionItems.map((act, idx) =>
            idx === actionIndex ? { ...act, isCompleted: !act.isCompleted } : act
          );
          const act = updatedActions[actionIndex];
          if (act) {
            logActivity('poo', 'meetings', 'update', m.meetingTitle, `Action item "${act.task}" ${act.isCompleted ? 'selesai' : 'kembali aktif'}`);
          }
          return { ...m, actionItems: updatedActions };
        }
        return m;
      })
    );
  };

  const deleteMeeting = (id: string) => {
    const m = meetings.find((i) => i.id === id);
    setMeetings((prev) => prev.filter((i) => i.id !== id));
    if (m) logActivity('poo', 'meetings', 'delete', m.meetingTitle, 'Notulensi rapat dihapus');
  };

  // 17. Procurement
  const addProcurement = (data: Omit<ProcurementItem, 'id' | 'createdAt'>) => {
    const item: ProcurementItem = {
      ...data,
      id: 'prc_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setProcurements((prev) => [item, ...prev]);
    logActivity('poo', 'procurement', 'create', item.itemName, `PO ${item.department} Rp ${item.estimatedCost.toLocaleString('id-ID')}`);
  };

  const updateProcurementStatus = (id: string, status: ProcurementItem['status']) => {
    setProcurements((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, status };
          logActivity('poo', 'procurement', 'update', p.itemName, `Status PO: ${status}`);
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProcurement = (id: string) => {
    const p = procurements.find((i) => i.id === id);
    setProcurements((prev) => prev.filter((i) => i.id !== id));
    if (p) logActivity('poo', 'procurement', 'delete', p.itemName, 'Pengadaan dihapus');
  };

  // 18. Compliance
  const addCompliance = (data: Omit<ComplianceItem, 'id' | 'createdAt'>) => {
    const item: ComplianceItem = {
      ...data,
      id: 'cmp_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setCompliances((prev) => [item, ...prev]);
    logActivity('poo', 'compliance', 'create', item.complianceName, `Kepatuhan ${item.type} (Jatuh tempo: ${item.validityEndDate})`);
  };

  const deleteCompliance = (id: string) => {
    const c = compliances.find((i) => i.id === id);
    setCompliances((prev) => prev.filter((i) => i.id !== id));
    if (c) logActivity('poo', 'compliance', 'delete', c.complianceName, 'Catatan kepatuhan dihapus');
  };

  const updateComplianceStatus = (id: string, status: ComplianceItem['status']) => {
    setCompliances((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status } : c))
    );
    const c = compliances.find((i) => i.id === id);
    if (c) logActivity('poo', 'compliance', 'update', c.complianceName, `Status kepatuhan diubah menjadi ${status}`);
  };

  // 19. Investments
  const addInvestment = (data: Omit<InvestmentItem, 'id' | 'createdAt'>) => {
    const item: InvestmentItem = {
      ...data,
      id: 'inv_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setInvestments((prev) => [item, ...prev]);
    logActivity('poo', 'investments', 'create', item.assetName, `${item.assetClass} (${item.unitsHeld} unit @ Rp ${item.currentPrice.toLocaleString('id-ID')})`);
  };

  const updateInvestmentPrice = (id: string, currentPrice: number) => {
    setInvestments((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updated = { ...inv, currentPrice, lastValuationDate: new Date().toISOString().split('T')[0] };
          logActivity('poo', 'investments', 'update', inv.assetName, `Harga terkini: Rp ${currentPrice.toLocaleString('id-ID')}`);
          return updated;
        }
        return inv;
      })
    );
  };

  const deleteInvestment = (id: string) => {
    const inv = investments.find((i) => i.id === id);
    setInvestments((prev) => prev.filter((i) => i.id !== id));
    if (inv) logActivity('poo', 'investments', 'delete', inv.assetName, 'Instrumen investasi dihapus');
  };

  // 20. Real Estate
  const addRealEstate = (data: Omit<RealEstateItem, 'id' | 'createdAt'>) => {
    const item: RealEstateItem = {
      ...data,
      id: 're_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setRealEstates((prev) => [item, ...prev]);
    logActivity('poo', 'real_estate', 'create', item.propertyName, `${item.type} (${item.certificateType}) Valuasi Rp ${item.currentMarketValuation.toLocaleString('id-ID')}`);
  };

  const deleteRealEstate = (id: string) => {
    const re = realEstates.find((i) => i.id === id);
    setRealEstates((prev) => prev.filter((i) => i.id !== id));
    if (re) logActivity('poo', 'real_estate', 'delete', re.propertyName, 'Data properti dihapus');
  };

  // Utilities
  const clearAllData = () => {
    if (window.confirm('Bersihkan seluruh data dari ketiga ekosistem (PEH, PFS, & POO)? Lembar kerja akan direset total.')) {
      setHabits([]);
      setJournalEntries([]);
      setGoals([]);
      setVaultItems([]);
      setDocuments([]);
      setSubscriptions([]);
      setPantryItems([]);
      setMaintenanceItems([]);
      setChores([]);
      setSharedExpenses([]);
      setContacts([]);
      setMilestones([]);
      setGifts([]);
      setFamilyMembers([]);
      setFamilyHealth([]);
      setTraditions([]);
      setCivicContacts([]);
      setVolunteers([]);
      setCharities([]);
      setProjects([]);
      setTasks([]);
      setKnowledgeList([]);
      setWorkflows([]);
      setVendors([]);
      setIncidents([]);
      setCapitalAssets([]);
      setIpLicenses([]);
      setCapTable([]);
      setReadings([]);
      setFitnessLogs([]);
      setSleepLogs([]);
      setBudgetEnvelopes([]);
      setInsurancePolicies([]);
      setPlants([]);
      setVehicles([]);
      setMentorships([]);
      setIntroductions([]);
      setFamilyRecipes([]);
      setFamilyBudgets([]);
      setPets([]);
      setCommunityEvents([]);
      setAdvocacies([]);
      setTimeAudits([]);
      setMeetings([]);
      setProcurements([]);
      setCompliances([]);
      setInvestments([]);
      setRealEstates([]);
      setActivityLogs([]);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('peh_pfs_workspace_v2');
    }
  };

  const exportJSON = () => {
    const data = {
      activeWorkspace,
      habits,
      journalEntries,
      goals,
      vaultItems,
      documents,
      subscriptions,
      pantryItems,
      maintenanceItems,
      chores,
      sharedExpenses,
      contacts,
      milestones,
      gifts,
      familyMembers,
      familyHealth,
      traditions,
      civicContacts,
      volunteers,
      charities,
      projects,
      tasks,
      knowledgeList,
      workflows,
      vendors,
      incidents,
      capitalAssets,
      ipLicenses,
      capTable,
      readings,
      fitnessLogs,
      sleepLogs,
      budgetEnvelopes,
      insurancePolicies,
      plants,
      vehicles,
      mentorships,
      introductions,
      familyRecipes,
      familyBudgets,
      pets,
      communityEvents,
      advocacies,
      timeAudits,
      meetings,
      procurements,
      compliances,
      investments,
      realEstates,
      activityLogs,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workspace-suite-${getTodayStr()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const p = JSON.parse(jsonStr);
      if (p.habits) setHabits(p.habits);
      if (p.journalEntries) setJournalEntries(p.journalEntries);
      if (p.goals) setGoals(p.goals);
      if (p.vaultItems) setVaultItems(p.vaultItems);
      if (p.documents) setDocuments(p.documents);
      if (p.subscriptions) setSubscriptions(p.subscriptions);
      if (p.pantryItems) setPantryItems(p.pantryItems);
      if (p.maintenanceItems) setMaintenanceItems(p.maintenanceItems);
      if (p.chores) setChores(p.chores);
      if (p.sharedExpenses) setSharedExpenses(p.sharedExpenses);
      if (p.contacts) setContacts(p.contacts);
      if (p.milestones) setMilestones(p.milestones);
      if (p.gifts) setGifts(p.gifts);
      if (p.familyMembers) setFamilyMembers(p.familyMembers);
      if (p.familyHealth) setFamilyHealth(p.familyHealth);
      if (p.traditions) setTraditions(p.traditions);
      if (p.civicContacts) setCivicContacts(p.civicContacts);
      if (p.volunteers) setVolunteers(p.volunteers);
      if (p.charities) setCharities(p.charities);

      if (p.projects) setProjects(p.projects);
      if (p.tasks) setTasks(p.tasks);
      if (p.knowledgeList) setKnowledgeList(p.knowledgeList);
      if (p.workflows) setWorkflows(p.workflows);
      if (p.vendors) setVendors(p.vendors);
      if (p.incidents) setIncidents(p.incidents);
      if (p.capitalAssets) setCapitalAssets(p.capitalAssets);
      if (p.ipLicenses) setIpLicenses(p.ipLicenses);
      if (p.capTable) setCapTable(p.capTable);

      if (p.readings) setReadings(p.readings);
      if (p.fitnessLogs) setFitnessLogs(p.fitnessLogs);
      if (p.sleepLogs) setSleepLogs(p.sleepLogs);
      if (p.budgetEnvelopes) setBudgetEnvelopes(p.budgetEnvelopes);
      if (p.insurancePolicies) setInsurancePolicies(p.insurancePolicies);
      if (p.plants) setPlants(p.plants);
      if (p.vehicles) setVehicles(p.vehicles);

      if (p.mentorships) setMentorships(p.mentorships);
      if (p.introductions) setIntroductions(p.introductions);
      if (p.familyRecipes) setFamilyRecipes(p.familyRecipes);
      if (p.familyBudgets) setFamilyBudgets(p.familyBudgets);
      if (p.pets) setPets(p.pets);
      if (p.communityEvents) setCommunityEvents(p.communityEvents);
      if (p.advocacies) setAdvocacies(p.advocacies);

      if (p.timeAudits) setTimeAudits(p.timeAudits);
      if (p.meetings) setMeetings(p.meetings);
      if (p.procurements) setProcurements(p.procurements);
      if (p.compliances) setCompliances(p.compliances);
      if (p.investments) setInvestments(p.investments);
      if (p.realEstates) setRealEstates(p.realEstates);
      return true;
    } catch {
      return false;
    }
  };

  // Live item counts across all standalone apps
  const totalAppCounts = useMemo<Record<StandaloneAppId, number>>(() => {
    return {
      overview: 0,
      comparison: 0,
      innovations: 50,
      // PEH
      habits: habits.length,
      journal: journalEntries.length,
      goals: goals.length,
      reading: readings.length,
      fitness: fitnessLogs.length,
      sleep: sleepLogs.length,
      vault: vaultItems.length,
      documents: documents.length,
      subscriptions: subscriptions.length,
      budget: budgetEnvelopes.length,
      insurance: insurancePolicies.length,
      pantry: pantryItems.length,
      maintenance: maintenanceItems.length,
      chores: chores.length + sharedExpenses.length,
      plants: plants.length,
      vehicles: vehicles.length,
      // PFS
      contacts: contacts.length,
      milestones: milestones.length,
      gifts: gifts.length,
      mentorship: mentorships.length,
      introductions: introductions.length,
      family_tree: familyMembers.length,
      family_health: familyHealth.length,
      traditions: traditions.length,
      family_recipes: familyRecipes.length,
      family_budget: familyBudgets.length,
      pet_care: pets.length,
      civic: civicContacts.length,
      volunteering: volunteers.length,
      charity: charities.length,
      community_events: communityEvents.length,
      advocacy: advocacies.length,
      // POO
      projects: projects.length,
      tasks: tasks.length,
      knowledge: knowledgeList.length,
      time_audit: timeAudits.length,
      meetings: meetings.length,
      workflows: workflows.length,
      vendors: vendors.length,
      incidents: incidents.length,
      procurement: procurements.length,
      compliance: compliances.length,
      assets: capitalAssets.length,
      ip_licenses: ipLicenses.length,
      cap_table: capTable.length,
      investments: investments.length,
      real_estate: realEstates.length,
    };
  }, [
    habits.length,
    journalEntries.length,
    goals.length,
    readings.length,
    fitnessLogs.length,
    sleepLogs.length,
    vaultItems.length,
    documents.length,
    subscriptions.length,
    budgetEnvelopes.length,
    insurancePolicies.length,
    pantryItems.length,
    maintenanceItems.length,
    chores.length,
    sharedExpenses.length,
    plants.length,
    vehicles.length,
    contacts.length,
    milestones.length,
    gifts.length,
    mentorships.length,
    introductions.length,
    familyMembers.length,
    familyHealth.length,
    traditions.length,
    familyRecipes.length,
    familyBudgets.length,
    pets.length,
    civicContacts.length,
    volunteers.length,
    charities.length,
    communityEvents.length,
    advocacies.length,
    projects.length,
    tasks.length,
    knowledgeList.length,
    timeAudits.length,
    meetings.length,
    workflows.length,
    vendors.length,
    incidents.length,
    procurements.length,
    compliances.length,
    capitalAssets.length,
    ipLicenses.length,
    capTable.length,
    investments.length,
    realEstates.length,
  ]);

  return (
    <PEHContext.Provider
      value={{
        activeWorkspace,
        setActiveWorkspace,

        activeCategory,
        activeApp,
        activeSubMenu,
        setActiveCategory,
        setActiveApp,
        setActiveSubMenu,
        navigateTo,

        globalSearch,
        setGlobalSearch,
        isQuickAddOpen,
        setIsQuickAddOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,

        habits,
        journalEntries,
        goals,
        vaultItems,
        documents,
        subscriptions,
        pantryItems,
        maintenanceItems,
        chores,
        sharedExpenses,

        contacts,
        milestones,
        gifts,
        familyMembers,
        familyHealth,
        traditions,
        civicContacts,
        volunteers,
        charities,

        projects,
        tasks,
        knowledgeList,
        workflows,
        vendors,
        incidents,
        capitalAssets,
        ipLicenses,
        capTable,

        readings,
        fitnessLogs,
        sleepLogs,
        budgetEnvelopes,
        insurancePolicies,
        plants,
        vehicles,
        mentorships,
        introductions,
        familyRecipes,
        familyBudgets,
        pets,
        communityEvents,
        advocacies,
        timeAudits,
        meetings,
        procurements,
        compliances,
        investments,
        realEstates,

        activityLogs,

        addHabit,
        toggleHabitToday,
        deleteHabit,
        addJournalEntry,
        deleteJournalEntry,
        addGoal,
        toggleMilestone,
        deleteGoal,
        addVaultItem,
        updateVaultItem,
        deleteVaultItem,
        addDocument,
        deleteDocument,
        addSubscription,
        deleteSubscription,
        addPantryItem,
        updatePantryQty,
        toggleRestock,
        deletePantryItem,
        addMaintenanceItem,
        markServiced,
        deleteMaintenanceItem,
        addChore,
        toggleChoreDone,
        deleteChore,
        addSharedExpense,
        toggleExpenseSettled,
        deleteSharedExpense,

        addContact,
        recordContactInteraction,
        deleteContact,
        addMilestone,
        deleteMilestone,
        addGift,
        toggleGiftFulfilled,
        deleteGift,
        addFamilyMember,
        deleteFamilyMember,
        addFamilyHealth,
        updateFamilyHealth,
        deleteFamilyHealth,
        addTradition,
        deleteTradition,
        addCivicContact,
        deleteCivicContact,
        addVolunteer,
        deleteVolunteer,
        addCharity,
        deleteCharity,

        addProject,
        updateProjectProgress,
        deleteProject,
        addTask,
        toggleTaskStatus,
        deleteTask,
        addKnowledge,
        deleteKnowledge,
        addWorkflow,
        advanceWorkflowStage,
        deleteWorkflow,
        addVendor,
        deleteVendor,
        addIncident,
        resolveIncident,
        deleteIncident,
        addCapitalAsset,
        updateAssetValuation,
        deleteCapitalAsset,
        addIpLicense,
        deleteIpLicense,
        addCapTableItem,
        deleteCapTableItem,

        addReading,
        updateReadingProgress,
        deleteReading,
        addFitnessLog,
        deleteFitnessLog,
        addSleepLog,
        deleteSleepLog,
        addBudgetEnvelope,
        updateBudgetSpent,
        deleteBudgetEnvelope,
        addInsurancePolicy,
        deleteInsurancePolicy,
        addPlant,
        waterPlant,
        deletePlant,
        addVehicle,
        updateVehicleOdometer,
        deleteVehicle,

        addMentorship,
        deleteMentorship,
        addIntroduction,
        updateIntroductionStatus,
        deleteIntroduction,
        addFamilyRecipe,
        deleteFamilyRecipe,
        addFamilyBudget,
        updateFamilyBudgetAmount,
        deleteFamilyBudget,
        addPet,
        updatePetWeight,
        deletePet,
        addCommunityEvent,
        deleteCommunityEvent,
        addAdvocacy,
        updateAdvocacyStatus,
        deleteAdvocacy,

        addTimeAudit,
        deleteTimeAudit,
        addMeeting,
        toggleMeetingActionItem,
        deleteMeeting,
        addProcurement,
        updateProcurementStatus,
        deleteProcurement,
        addCompliance,
        updateComplianceStatus,
        deleteCompliance,
        addInvestment,
        updateInvestmentPrice,
        deleteInvestment,
        addRealEstate,
        deleteRealEstate,

        clearAllData,
        exportJSON,
        importJSON,
        totalAppCounts,
        lastSynced,
      }}
    >
      {children}
    </PEHContext.Provider>
  );
};

export const usePEH = () => {
  const context = useContext(PEHContext);
  if (!context) {
    throw new Error('usePEH must be used within a PEHProvider');
  }
  return context;
};
