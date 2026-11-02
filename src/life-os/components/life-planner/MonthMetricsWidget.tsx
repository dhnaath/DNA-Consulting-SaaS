import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { ChevronDown, FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export const MonthMetricsWidget: React.FC = () => {
  const { totalIncomes, totalExpenses, netCashflow } = useLifeOS();

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 shadow-2xs overflow-hidden select-none relative">
      {/* Top Header matching screenshot */}
      <div className="px-3.5 pt-3 pb-2 border-b border-neutral-100 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-neutral-800">This Month Metrics</h3>

        <div className="flex items-center gap-1.5">
          <div className="px-2 py-0.5 text-[11px] font-medium text-neutral-800 bg-neutral-100 rounded-md">
            This Month
          </div>
          <button className="flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-white bg-[#2383E2] hover:bg-[#1B74C9] rounded-md shadow-2xs transition-colors">
            <span>New</span>
            <ChevronDown className="w-3 h-3 text-white/80" />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 relative">
        <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-800 mb-2">
          <FileText className="w-3.5 h-3.5 text-neutral-400" />
          <span>April 2026</span>
        </div>

        <div className="space-y-1.5 text-xs font-mono-nums">
          <div className="flex items-center justify-between text-neutral-700">
            <span className="text-neutral-500 font-sans-body">Income:</span>
            <span className="text-emerald-700 font-medium">
              ${totalIncomes.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-700">
            <span className="text-neutral-500 font-sans-body">Expense:</span>
            <span className="text-rose-700 font-medium">
              ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex items-center justify-between text-neutral-800 pt-1 border-t border-neutral-100 font-semibold">
            <span className="text-neutral-600 font-sans-body">Cashflow:</span>
            <span className={netCashflow >= 0 ? 'text-neutral-800' : 'text-rose-600'}>
              ${netCashflow.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Decorative mini Notion sticker */}
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-amber-50 border border-amber-200/60 flex items-center justify-center text-sm shadow-2xs transform rotate-6 pointer-events-none">
          🍄
        </div>

        {/* Bottom action */}
        <button className="mt-3 flex items-center gap-1 text-xs text-neutral-400 hover:text-neutral-700 p-0.5 rounded-sm transition-colors w-full">
          <span>+ New page</span>
        </button>
      </div>
    </div>
  );
};
