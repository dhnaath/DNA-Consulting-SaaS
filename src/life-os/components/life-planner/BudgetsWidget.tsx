import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { CircularProgress } from '../common/CircularProgress';
import {
  UtensilsCrossed,
  Stethoscope,
  Home,
  Car,
  ShoppingBag,
  Film,
  Apple,
  SlidersHorizontal,
  ChevronDown,
  Edit2,
  Check,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Food & Dining': UtensilsCrossed,
  'Healthcare': Stethoscope,
  'Bills & Utilities': Home,
  'Transportation': Car,
  'Shopping': ShoppingBag,
  'Entertainment': Film,
  'Groceries': Apple,
};

export const BudgetsWidget: React.FC = () => {
  const { budgets, updateBudgetLimit } = useLifeOS();
  const [editingBudgetId, setEditingBudgetId] = useState<string | null>(null);
  const [editLimitValue, setEditLimitValue] = useState<string>('');

  const handleStartEdit = (id: string, currentLimit: number) => {
    setEditingBudgetId(id);
    setEditLimitValue(currentLimit.toString());
  };

  const handleSaveEdit = (id: string) => {
    const num = parseFloat(editLimitValue);
    if (!isNaN(num) && num >= 0) {
      updateBudgetLimit(id, num);
    }
    setEditingBudgetId(null);
  };

  return (
    <div className="space-y-2 select-none">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Budgets
        </h3>
        <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 rounded-sm">
          <SlidersHorizontal className="w-3 h-3" />
        </button>
      </div>

      {/* Dropdown Selector matching screenshot */}
      <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-neutral-700 bg-white border border-neutral-200/80 rounded-md shadow-2xs">
        <span>📅 This Month</span>
        <ChevronDown className="w-3 h-3 text-neutral-400" />
      </div>

      {/* Budget Category List */}
      <div className="space-y-1 mt-2">
        {budgets.map((b) => {
          const Icon = CATEGORY_ICONS[b.name] || ShoppingBag;
          const percentage = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
          const isOver = b.spent > b.limit;

          return (
            <div
              key={b.id}
              className="group p-2 bg-white hover:bg-neutral-50 border border-neutral-200/60 rounded-md transition-all shadow-2xs"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-1.5 text-neutral-800 font-medium">
                  <Icon className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-800 transition-colors" />
                  <span className="truncate max-w-[120px]">{b.name}</span>
                </div>

                {editingBudgetId === b.id ? (
                  <div className="flex items-center gap-1">
                    <span className="text-neutral-400">$</span>
                    <input
                      type="number"
                      value={editLimitValue}
                      onChange={(e) => setEditLimitValue(e.target.value)}
                      className="w-16 px-1 py-0.5 text-xs border border-neutral-300 rounded-sm font-mono-nums outline-hidden"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(b.id)}
                      className="p-1 text-emerald-600 hover:text-emerald-700"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(b.id, b.limit)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-neutral-700 transition-opacity"
                    title="Edit limit"
                  >
                    <Edit2 className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono-nums text-neutral-500">
                <span className={isOver ? 'text-red-600 font-semibold' : ''}>
                  ${b.spent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-neutral-400">
                  ${b.limit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] ${isOver ? 'text-red-600 font-bold' : ''}`}>
                    {Math.round(percentage)}%
                  </span>
                  <CircularProgress
                    progress={percentage}
                    size={14}
                    strokeWidth={2}
                    color={isOver ? '#DC2626' : percentage > 80 ? '#F59E0B' : '#10B981'}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
