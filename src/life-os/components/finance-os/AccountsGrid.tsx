import React from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import {
  Landmark,
  CreditCard,
  PiggyBank,
  TrendingUp,
  ArrowRightLeft,
  SlidersHorizontal,
  Plus,
} from 'lucide-react';

const ACCOUNT_ICONS: Record<string, React.ElementType> = {
  Checking: Landmark,
  Savings: PiggyBank,
  Investment: TrendingUp,
  Cash: CreditCard,
};

export const AccountsGrid: React.FC = () => {
  const { accounts, totalNetWorth, openModal } = useLifeOS();

  return (
    <div className="bg-white rounded-lg border border-neutral-200/70 p-4 shadow-2xs select-none">
      {/* Header matching screenshot */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-neutral-800">
            Accounts
          </h3>
          <div className="px-2 py-0.5 text-xs text-neutral-600 bg-neutral-100 rounded-sm">
            ≡ All
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openModal('transfer')}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
            title="Transfer between accounts"
          >
            <ArrowRightLeft className="w-3 h-3 text-neutral-500" />
            <span className="hidden sm:inline">Transfer</span>
          </button>
          <button
            onClick={() => openModal('account')}
            className="p-1 text-neutral-400 hover:text-neutral-700 transition-colors"
            title="Add Account"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {accounts.map((acc) => {
          const Icon = ACCOUNT_ICONS[acc.type] || Landmark;
          return (
            <div
              key={acc.id}
              className="p-3 bg-neutral-50/60 hover:bg-neutral-100/60 border border-neutral-200/60 rounded-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-sm flex items-center justify-center text-white"
                    style={{ backgroundColor: acc.color || '#4B5563' }}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-semibold text-neutral-800">
                    {acc.name}
                  </span>
                </div>
                {acc.accountNumberMask && (
                  <span className="text-[10px] text-neutral-400 font-mono-nums">
                    {acc.accountNumberMask}
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between mt-2 pt-1 border-t border-neutral-200/40">
                <span className="text-[11px] text-neutral-400">Balance:</span>
                <span className="text-sm font-semibold font-mono-nums text-neutral-900">
                  ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Net Worth Summary Footer */}
      <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs">
        <span className="text-neutral-500 font-medium">Total Net Worth:</span>
        <span className="font-mono-nums font-bold text-neutral-900 text-sm">
          ${totalNetWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};
