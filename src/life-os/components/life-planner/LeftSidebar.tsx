import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { QuickActions } from './QuickActions';
import { BudgetsWidget } from './BudgetsWidget';
import {
  Sun,
  CheckSquare,
  DollarSign,
  Repeat,
  Target,
  BookOpen,
  Heart,
  Users,
  Database,
  Landmark,
  Stethoscope,
  Home,
  Gift,
  ShoppingCart,
  PieChart,
  Scale,
  Flame,
  FileText,
  BookMarked,
} from 'lucide-react';

interface LeftSidebarProps {
  onSelectSection?: (sectionId: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ onSelectSection }) => {
  const {
    tasks,
    activeNav,
    setActiveNav,
    setWorkspace,
    contacts,
    subscriptions,
    assets,
    consultations,
    transactions,
    householdItems,
    wishlist,
    groceryList,
    lifeCanvasBudgets,
    weightLogs,
    habits,
    notes,
    detailedJournals,
  } = useLifeOS();

  const navItems = [
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, count: tasks.filter((t) => !t.completed).length },
    { id: 'simple-finance', label: 'Simple Finance', icon: DollarSign, count: transactions.length },
    { id: 'budget-tracker', label: 'Budget Tracker', icon: PieChart, count: lifeCanvasBudgets.length },
    { id: 'weight-tracker', label: 'Weight Tracker', icon: Scale, count: weightLogs.length },
    { id: 'habit-tracker', label: 'Habit Tracker', icon: Flame, count: habits.filter((h) => !h.completedToday).length },
    { id: 'notes', label: 'Notes by LifeCanvas', icon: FileText, count: notes.length },
    { id: 'journal', label: 'Journal by LifeCanvas', icon: BookMarked, count: detailedJournals.length },
    { id: 'doctor-consultation', label: 'Konsultasi Dokter', icon: Stethoscope, count: consultations.length },
    { id: 'finance', label: 'Finance OS', icon: DollarSign },
    { id: 'household-items', label: 'Household Items', icon: Home, count: householdItems.length },
    { id: 'wishlist', label: 'Wishlist Tracker', icon: Gift, count: wishlist.length },
    { id: 'grocery-list', label: 'Grocery List', icon: ShoppingCart, count: groceryList.filter((i) => i.status === 'Need to Buy').length },
    { id: 'contacts', label: 'Kontak', icon: Users, count: contacts.length },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat, count: subscriptions.length },
    { id: 'assets', label: 'Assets Tracker', icon: Landmark, count: assets.length },
    { id: 'habits', label: 'Habits Summary', icon: Repeat },
    { id: 'goals', label: 'Goals', icon: Target },
  ];

  const handleNavClick = (id: string) => {
    if (id === 'notes') {
      setWorkspace('notes');
      return;
    }
    if (id === 'journal') {
      setWorkspace('journal');
      return;
    }
    if (id === 'finance') {
      setWorkspace('finance-os');
      return;
    }
    if (id === 'simple-finance') {
      setWorkspace('simple-finance');
      return;
    }
    if (id === 'budget-tracker') {
      setWorkspace('budget-tracker');
      return;
    }
    if (id === 'weight-tracker') {
      setWorkspace('weight-tracker');
      return;
    }
    if (id === 'habit-tracker') {
      setWorkspace('habit-tracker');
      return;
    }
    if (id === 'doctor-consultation') {
      setWorkspace('doctor-consultation');
      return;
    }
    if (id === 'household-items') {
      setWorkspace('household-items');
      return;
    }
    if (id === 'wishlist') {
      setWorkspace('wishlist');
      return;
    }
    if (id === 'grocery-list') {
      setWorkspace('grocery-list');
      return;
    }
    if (id === 'contacts') {
      setWorkspace('contacts');
      return;
    }
    if (id === 'subscriptions') {
      setWorkspace('subscriptions');
      return;
    }
    if (id === 'assets') {
      setWorkspace('assets');
      return;
    }
    setActiveNav(id);
    if (onSelectSection) {
      onSelectSection(id);
    }
  };

  return (
    <aside className="w-full space-y-6">
      {/* Notion Page Icon & Title Header matching screenshot */}
      <div className="flex items-center gap-2.5 px-1 py-1">
        <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs">
          <Sun className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-neutral-800 tracking-tight">
            Life Planner
          </h2>
          <span className="text-[11px] text-neutral-400">Personal Workspace</span>
        </div>
      </div>

      {/* Quick Actions Buttons */}
      <QuickActions />

      {/* Navigation List */}
      <div className="space-y-1">
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1 mb-2">
          Navigation
        </h3>
        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${
                  isActive
                    ? 'bg-neutral-200/70 text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] font-mono-nums px-1.5 py-0.2 bg-neutral-200 text-neutral-700 rounded-sm">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Budgets Card */}
      <BudgetsWidget />
    </aside>
  );
};
