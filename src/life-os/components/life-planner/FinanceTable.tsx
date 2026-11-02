import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { TransactionItem } from '../../types';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  DollarSign,
  Filter,
  ArrowUpDown,
  Search,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Trash2,
  Car,
  ShoppingBag,
  Film,
  UtensilsCrossed,
  Home,
  Stethoscope,
  Briefcase,
  Layers,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  Transportation: Car,
  Shopping: ShoppingBag,
  Entertainment: Film,
  'Food & Dining': UtensilsCrossed,
  'Bills & Utilities': Home,
  Healthcare: Stethoscope,
  Salary: Briefcase,
  'Real Estate': Home,
  Ecommerce: ShoppingBag,
  'Digital Products': Layers,
  Affiliates: ArrowUpRight,
};

export const FinanceTable: React.FC = () => {
  const { transactions, deleteTransaction, openModal, searchQuery } = useLifeOS();
  const [activeTab, setActiveTab] = useState<'expenses' | 'incomes'>('expenses');
  const [localFilter, setLocalFilter] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredItems = useMemo(() => {
    return transactions.filter((item) => {
      if (activeTab === 'expenses' && item.type !== 'expense') return false;
      if (activeTab === 'incomes' && item.type !== 'income') return false;

      const term = (searchQuery || localFilter).toLowerCase().trim();
      if (term) {
        const matchName = item.name.toLowerCase().includes(term);
        const matchCat = item.category.toLowerCase().includes(term);
        if (!matchName && !matchCat) return false;
      }
      return true;
    });
  }, [transactions, activeTab, searchQuery, localFilter]);

  const totalSum = useMemo(() => {
    return filteredItems.reduce((acc, cur) => acc + cur.amount, 0);
  }, [filteredItems]);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 shadow-2xs overflow-hidden select-none">
      {/* Top Header matching screenshot */}
      <div className="px-4 pt-3 pb-2 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-neutral-800 mr-2">
            Finance
          </h2>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'expenses'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5 text-neutral-400" />
              <span>Expenses</span>
            </button>
            <button
              onClick={() => setActiveTab('incomes')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'incomes'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
              <span>Incomes</span>
            </button>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
            title="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
            title="Filter"
          >
            <Filter className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-md transition-colors"
            title="Sort"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>

          {/* Blue Notion New Button */}
          <button
            onClick={() => openModal(activeTab === 'expenses' ? 'expense' : 'income')}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#2383E2] hover:bg-[#1B74C9] rounded-md shadow-2xs transition-colors ml-1"
          >
            <span>New</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="px-4 py-1.5 bg-neutral-50/70 border-b border-neutral-100 flex items-center gap-2 text-xs">
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            placeholder={`Filter ${activeTab} by name or category...`}
            value={localFilter}
            onChange={(e) => setLocalFilter(e.target.value)}
            className="w-full bg-transparent outline-hidden text-neutral-700 placeholder:text-neutral-400 text-xs"
            autoFocus
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-neutral-200/60 bg-neutral-50/40 text-neutral-500 font-medium">
              <th className="py-2 px-4 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-400">↑</span>
                  <span>Name</span>
                </span>
              </th>
              <th className="py-2 px-3 font-medium w-28 text-right">
                <span className="flex items-center justify-end gap-1">
                  <DollarSign className="w-3 h-3 text-neutral-400" />
                  <span>Amount</span>
                </span>
              </th>
              <th className="py-2 px-3 font-medium w-36 hidden sm:table-cell">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span>Date</span>
                </span>
              </th>
              <th className="py-2 px-3 font-medium w-36">
                <span className="flex items-center gap-1.5">
                  <span className="text-neutral-400">🏷</span>
                  <span>Category</span>
                </span>
              </th>
              <th className="py-2 px-2 w-8 text-right text-neutral-300">
                <MoreHorizontal className="w-3.5 h-3.5 ml-auto" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-400 text-xs">
                  No {activeTab} recorded yet. Click "+ New page" to log one.
                </td>
              </tr>
            ) : (
              filteredItems.map((tx) => {
                const CatIcon = CATEGORY_ICONS[tx.category] || Layers;
                return (
                  <tr
                    key={tx.id}
                    className="group hover:bg-[#F7F7F5] transition-colors"
                  >
                    {/* Name */}
                    <td className="py-2 px-4 font-medium text-neutral-800 align-middle">
                      <span>{tx.name}</span>
                    </td>

                    {/* Amount */}
                    <td className="py-2 px-3 text-right font-mono-nums font-medium text-neutral-800 align-middle">
                      ${tx.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    {/* Date */}
                    <td className="py-2 px-3 text-neutral-500 font-mono-nums text-[11px] align-middle hidden sm:table-cell">
                      {formatDate(tx.date)}
                    </td>

                    {/* Category with icon */}
                    <td className="py-2 px-3 align-middle">
                      <span className="inline-flex items-center gap-1.5 text-neutral-700 text-xs">
                        <CatIcon className="w-3.5 h-3.5 text-neutral-400" />
                        <span>{tx.category}</span>
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="py-2 px-2 text-right align-middle">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-600 transition-all rounded-sm"
                        title="Delete transaction"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom bar */}
      <div className="p-2 border-t border-neutral-100 bg-[#FAF9F7]/50 flex items-center justify-between text-xs text-neutral-500">
        <button
          onClick={() => openModal(activeTab === 'expenses' ? 'expense' : 'income')}
          className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 transition-colors py-0.5 px-1.5 rounded-sm hover:bg-neutral-100"
        >
          <Plus className="w-3.5 h-3.5 text-neutral-400" />
          <span>New page</span>
        </button>

        <div className="flex items-center gap-3 pr-2 font-mono-nums text-[11px]">
          <span className="text-neutral-400">Total:</span>
          <span className="font-semibold text-neutral-800">
            ${totalSum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};
