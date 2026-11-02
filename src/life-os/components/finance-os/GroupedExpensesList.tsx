import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { TransactionItem } from '../../types';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Search,
  Plus,
  Trash2,
  UtensilsCrossed,
  Home,
  Car,
  ShoppingBag,
  Stethoscope,
  Film,
  Apple,
  Layers,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Groceries: Apple,
  Shopping: ShoppingBag,
  'Bills & Utilities': Home,
  Transportation: Car,
  'Food & Dining': UtensilsCrossed,
  Healthcare: Stethoscope,
  Entertainment: Film,
};

export const GroupedExpensesList: React.FC = () => {
  const { transactions, deleteTransaction, openModal } = useLifeOS();
  const [activeTab, setActiveTab] = useState<'weekly' | 'month' | 'chart'>('weekly');
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const expenses = transactions.filter((t) => t.type === 'expense');

  // Group by week
  const groupedWeeks: { title: string; total: number; items: TransactionItem[] }[] = [
    {
      title: 'Apr 26 – May 2 2026',
      total: 145.5,
      items: [
        { id: 'gw-1', type: 'expense', name: 'Grocery Shopping', amount: 146.0, date: '2026-04-28', category: 'Groceries' },
      ],
    },
    {
      title: 'Apr 19 – 25 2026',
      total: 725.0,
      items: [
        { id: 'gw-2', type: 'expense', name: 'Online Shopping', amount: 100.0, date: '2026-04-23', category: 'Shopping' },
        { id: 'gw-3', type: 'expense', name: 'Home supplies', amount: 560.0, date: '2026-04-20', category: 'Bills & Utilities' },
        { id: 'gw-4', type: 'expense', name: 'Gas Station', amount: 65.0, date: '2026-04-19', category: 'Transportation' },
      ],
    },
    {
      title: 'Apr 12 – 18 2026',
      total: 1053.99,
      items: [
        { id: 'gw-5', type: 'expense', name: 'Online order', amount: 379.0, date: '2026-04-18', category: 'Shopping' },
        { id: 'gw-6', type: 'expense', name: 'Internet Bill', amount: 80.0, date: '2026-04-17', category: 'Bills & Utilities' },
        { id: 'gw-7', type: 'expense', name: 'Pharmacy purchase', amount: 340.0, date: '2026-04-15', category: 'Healthcare' },
        { id: 'gw-8', type: 'expense', name: 'Electricity Bill', amount: 85.0, date: '2026-04-14', category: 'Bills & Utilities' },
        { id: 'gw-9', type: 'expense', name: 'Doctor Visit', amount: 50.0, date: '2026-04-13', category: 'Healthcare' },
        { id: 'gw-10', type: 'expense', name: 'Dining out', amount: 120.0, date: '2026-04-12', category: 'Food & Dining' },
      ],
    },
    {
      title: 'Apr 5 – 11 2026',
      total: 766.5,
      items: [
        { id: 'gw-11', type: 'expense', name: 'Restaurant Dinner', amount: 85.0, date: '2026-04-10', category: 'Food & Dining' },
        { id: 'gw-12', type: 'expense', name: 'Uber Ride', amount: 33.0, date: '2026-04-09', category: 'Transportation' },
        { id: 'gw-13', type: 'expense', name: 'Mobile recharge', amount: 499.0, date: '2026-04-07', category: 'Bills & Utilities' },
        { id: 'gw-14', type: 'expense', name: 'Movie tickets', amount: 150.0, date: '2026-04-05', category: 'Shopping' },
      ],
    },
    {
      title: 'Mar 29 – Apr 4 2026',
      total: 2380.0,
      items: [
        { id: 'gw-15', type: 'expense', name: 'Fuel refill', amount: 2200.0, date: '2026-04-02', category: 'Transportation' },
        { id: 'gw-16', type: 'expense', name: 'Coffee & snack', amount: 180.0, date: '2026-04-01', category: 'Food & Dining' },
      ],
    },
  ];

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-neutral-800">
          Expenses
        </h3>
        <div className="flex items-center gap-1">
          <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
            <Filter className="w-3.5 h-3.5" />
          </button>
          <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openModal('expense')}
            className="p-1 text-neutral-500 hover:text-neutral-800 transition-colors"
            title="Add Expense"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            activeTab === 'weekly'
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Weekly
        </button>
        <button
          onClick={() => setActiveTab('month')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            activeTab === 'month'
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          This Month
        </button>
        <button
          onClick={() => setActiveTab('chart')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            activeTab === 'chart'
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Chart
        </button>
      </div>

      {/* Grouped Weeks */}
      <div className="space-y-3">
        {groupedWeeks.map((week) => {
          const isCollapsed = collapsedGroups[week.title];

          return (
            <div key={week.title} className="space-y-1">
              {/* Accordion Header */}
              <button
                onClick={() => toggleGroup(week.title)}
                className="w-full flex items-center justify-between py-1 px-1.5 rounded-sm hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700" />
                  )}
                  <span>{week.title}</span>
                </div>
                <span className="text-xs font-mono-nums font-semibold text-neutral-700">
                  ${week.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </button>

              {/* Items in week */}
              {!isCollapsed && (
                <div className="pl-4 pr-1 divide-y divide-neutral-100">
                  {week.items.map((item) => {
                    const Icon = CATEGORY_ICONS[item.category] || Layers;
                    return (
                      <div
                        key={item.id}
                        className="py-1.5 flex items-center justify-between text-xs text-neutral-700 hover:bg-neutral-50 px-1 rounded-xs transition-colors group"
                      >
                        <span className="font-medium text-neutral-800">
                          {item.name}
                        </span>

                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center gap-1 text-neutral-500 text-[11px]">
                            <Icon className="w-3 h-3 text-neutral-400" />
                            <span>{item.category}</span>
                          </span>

                          <span className="font-mono-nums font-medium text-neutral-800 w-16 text-right">
                            ${item.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
