import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Plus,
} from 'lucide-react';

interface IncomeGroup {
  month: string;
  total: number;
  items: {
    id: string;
    name: string;
    category: string;
    amount: number;
    tagColor: string;
  }[];
}

export const GroupedIncomesList: React.FC = () => {
  const { openModal } = useLifeOS();
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  const [collapsedMonths, setCollapsedMonths] = useState<Record<string, boolean>>({});

  const incomeGroups: IncomeGroup[] = [
    {
      month: 'Apr 2026',
      total: 242920.0,
      items: [
        { id: 'inc-g1', name: 'Performance bonus', category: 'Salary', amount: 10000, tagColor: 'bg-[#F2EFE9] text-[#635E54]' },
        { id: 'inc-g2', name: 'Rental maintenance reimbursement', category: 'Real Estate', amount: 2500, tagColor: 'bg-[#FDE8E8] text-[#9B1C1C]' },
        { id: 'inc-g3', name: 'Ecommerce payout', category: 'Ecommerce', amount: 8800, tagColor: 'bg-[#EDE9FE] text-[#6D28D9]' },
        { id: 'inc-g4', name: 'Digital product sales', category: 'Digital Products', amount: 6400, tagColor: 'bg-[#E0E7FF] text-[#3730A3]' },
        { id: 'inc-g5', name: 'Affiliate commissions', category: 'Affiliates', amount: 3100, tagColor: 'bg-[#FEF3C7] text-[#92400E]' },
        { id: 'inc-g6', name: 'Interest credit', category: 'Salary', amount: 420, tagColor: 'bg-[#F2EFE9] text-[#635E54]' },
        { id: 'inc-g7', name: 'Ecommerce sales', category: 'Ecommerce', amount: 19500, tagColor: 'bg-[#EDE9FE] text-[#6D28D9]' },
        { id: 'inc-g8', name: 'Consulting payment', category: 'Digital Products', amount: 8000, tagColor: 'bg-[#E0E7FF] text-[#3730A3]' },
        { id: 'inc-g9', name: 'Affiliate bonus', category: 'Affiliates', amount: 2600, tagColor: 'bg-[#FEF3C7] text-[#92400E]' },
        { id: 'inc-g10', name: 'Ecommerce sales', category: 'Ecommerce', amount: 13400, tagColor: 'bg-[#EDE9FE] text-[#6D28D9]' },
      ],
    },
    {
      month: 'Feb 2026',
      total: 7300.0,
      items: [
        { id: 'inc-g11', name: 'Icon Pack', category: 'Digital Products', amount: 800, tagColor: 'bg-[#E0E7FF] text-[#3730A3]' },
        { id: 'inc-g12', name: 'Monthly Salary', category: 'Salary', amount: 4500, tagColor: 'bg-[#F2EFE9] text-[#635E54]' },
        { id: 'inc-g13', name: 'Rental Income', category: 'Real Estate', amount: 2000, tagColor: 'bg-[#FDE8E8] text-[#9B1C1C]' },
      ],
    },
    {
      month: 'Jan 2026',
      total: 6800.0,
      items: [
        { id: 'inc-g14', name: 'E-commerce Sales', category: 'Ecommerce', amount: 1850, tagColor: 'bg-[#EDE9FE] text-[#6D28D9]' },
        { id: 'inc-g15', name: 'Affiliate Commission', category: 'Affiliates', amount: 450, tagColor: 'bg-[#FEF3C7] text-[#92400E]' },
        { id: 'inc-g16', name: 'October Salary', category: 'Salary', amount: 4500, tagColor: 'bg-[#F2EFE9] text-[#635E54]' },
      ],
    },
  ];

  const toggleMonth = (month: string) => {
    setCollapsedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 p-4 shadow-2xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-neutral-800">
          Incomes
        </h3>
        <div className="flex items-center gap-1">
          <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
            <Filter className="w-3.5 h-3.5" />
          </button>
          <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => openModal('income')}
            className="p-1 text-neutral-500 hover:text-neutral-800 transition-colors"
            title="Add Income"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            activeTab === 'monthly'
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setActiveTab('yearly')}
          className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
            activeTab === 'yearly'
              ? 'bg-neutral-100 text-neutral-900 font-semibold'
              : 'text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Yearly
        </button>
        <span className="text-[11px] text-neutral-400 px-1">
          3 more...
        </span>
      </div>

      {/* Grouped Month Accordion */}
      <div className="space-y-3">
        {incomeGroups.map((group) => {
          const isCollapsed = collapsedMonths[group.month];

          return (
            <div key={group.month} className="space-y-1">
              <button
                onClick={() => toggleMonth(group.month)}
                className="w-full flex items-center justify-between py-1 px-1.5 rounded-sm hover:bg-neutral-50 transition-colors text-left group"
              >
                <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800">
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700" />
                  )}
                  <span>{group.month}</span>
                </div>
                <span className="text-xs font-mono-nums font-semibold text-neutral-700">
                  ${group.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </button>

              {!isCollapsed && (
                <div className="pl-4 pr-1 divide-y divide-neutral-100">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-1.5 flex items-center justify-between text-xs text-neutral-700 hover:bg-neutral-50 px-1 rounded-xs transition-colors"
                    >
                      <span className="font-medium text-neutral-800 truncate max-w-[200px] sm:max-w-none">
                        {item.name}
                      </span>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`px-2 py-0.5 rounded-xs text-[10px] font-medium ${item.tagColor}`}>
                          {item.category}
                        </span>
                        <span className="font-mono-nums font-medium text-neutral-800 w-20 text-right">
                          ${item.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
