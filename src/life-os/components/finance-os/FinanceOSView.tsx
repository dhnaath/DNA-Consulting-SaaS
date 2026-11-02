import React, { useState } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { MonthlyTrendChart } from './MonthlyTrendChart';
import { DonutBreakdownChart } from './DonutBreakdownChart';
import { GroupedExpensesList } from './GroupedExpensesList';
import { GroupedIncomesList } from './GroupedIncomesList';
import { AccountsGrid } from './AccountsGrid';
import { CircularProgress } from '../common/CircularProgress';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRightLeft,
  Landmark,
  FileSpreadsheet,
  Receipt,
  Repeat,
  PiggyBank,
  BarChart3,
  Database,
  Info,
  ChevronDown,
  CheckCircle2,
  UtensilsCrossed,
  Stethoscope,
  Home,
  Car,
  ShoppingBag,
  Apple,
  Film,
  SlidersHorizontal,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Food & Dining': UtensilsCrossed,
  'Healthcare': Stethoscope,
  'Bills & Utilities': Home,
  'Transportation': Car,
  'Shopping': ShoppingBag,
  'Groceries': Apple,
  'Entertainment': Film,
};

export const FinanceOSView: React.FC = () => {
  const {
    openModal,
    budgets,
    subscriptions,
    savings,
    debts,
    toggleSubscription,
    addSavingAmount,
  } = useLifeOS();

  const [financeSubTab, setFinanceSubTab] = useState<'overview' | 'subscriptions' | 'savings' | 'debts'>('overview');
  const [showGuideModal, setShowGuideModal] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Accounts & Ledger', icon: Landmark },
    { id: 'subscriptions', label: 'Subscriptions', icon: Repeat, badge: subscriptions.length },
    { id: 'savings', label: 'Saving Tracker', icon: PiggyBank, badge: savings.length },
    { id: 'debts', label: 'Debt Tracker', icon: Receipt, badge: debts.length },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 transition-all select-none">
      {/* Notion Page Icon & Title matching Screenshot 2 */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-2xs">
            <Wallet className="w-5 h-5" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Finance OS
          </h1>
        </div>

        {/* Setup Callout Banner matching Screenshot 2 */}
        <div className="p-3.5 bg-neutral-50/80 border border-neutral-200/70 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-neutral-700">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-neutral-500 shrink-0" />
            <span>
              Hey there! Click the button below for step-by-step instructions to set up the template.
            </span>
          </div>
          <button
            onClick={() => setShowGuideModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-md font-medium shadow-2xs transition-colors self-start sm:self-auto shrink-0"
          >
            <span>💡 Get Started</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Column + Right Center Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Quick Actions, Nav, Monthly/Yearly Report) */}
        <div className="lg:col-span-3 xl:col-span-3 space-y-6">
          {/* Quick Actions */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1 mb-2">
              Quick Actions
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => openModal('expense')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200/70 rounded-md shadow-2xs transition-colors text-left"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-medium">New Expense</span>
              </button>
              <button
                onClick={() => openModal('income')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200/70 rounded-md shadow-2xs transition-colors text-left"
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-medium">New Income</span>
              </button>
              <button
                onClick={() => openModal('transfer')}
                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-neutral-700 bg-white hover:bg-neutral-50 border border-neutral-200/70 rounded-md shadow-2xs transition-colors text-left"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-medium">New Transfer</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1 mb-2">
              Navigation
            </h3>
            <nav className="space-y-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = financeSubTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setFinanceSubTab(item.id as any)}
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
                    {item.badge !== undefined && (
                      <span className="text-[10px] font-mono-nums px-1.5 py-0.2 bg-neutral-200 text-neutral-700 rounded-sm">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Monthly Report Card matching Screenshot 2 */}
          <div className="p-3 bg-white border border-neutral-200/70 rounded-lg shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
              <span className="text-xs font-semibold text-neutral-800">Monthly Report</span>
              <span className="text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-sm">
                📅 This Month
              </span>
            </div>

            <div className="text-[11px] space-y-2">
              <div className="font-medium text-neutral-700">📄 April 2026</div>

              <div className="space-y-1 text-neutral-600 font-mono-nums">
                <div className="text-[10px] uppercase font-bold text-rose-600 font-sans">Expenses:</div>
                <div className="flex justify-between"><span>Food & Dining:</span><span>$385</span></div>
                <div className="flex justify-between"><span>Shopping:</span><span>$629</span></div>
                <div className="flex justify-between"><span>Transportation:</span><span>$98</span></div>
                <div className="flex justify-between"><span>Groceries:</span><span>$146</span></div>
                <div className="flex justify-between"><span>Bills & Utilities:</span><span>$1,224</span></div>
                <div className="flex justify-between"><span>Healthcare:</span><span>$390</span></div>
                <div className="border-t border-neutral-200 pt-0.5 flex justify-between font-semibold text-neutral-900">
                  <span>Total Expenses:</span>
                  <span>$5,071</span>
                </div>
              </div>

              <div className="space-y-1 text-neutral-600 font-mono-nums pt-1 border-t border-neutral-100">
                <div className="text-[10px] uppercase font-bold text-emerald-600 font-sans">Incomes:</div>
                <div className="flex justify-between"><span>Digital Products:</span><span>$37,400</span></div>
                <div className="flex justify-between"><span>Salary:</span><span>$95,420</span></div>
                <div className="flex justify-between"><span>Affiliates:</span><span>$26,100</span></div>
                <div className="flex justify-between"><span>Ecommerce:</span><span>$59,500</span></div>
                <div className="flex justify-between"><span>Real Estate:</span><span>$24,500</span></div>
                <div className="border-t border-neutral-200 pt-0.5 flex justify-between font-semibold text-neutral-900">
                  <span>Total Incomes:</span>
                  <span>$242,920</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 flex justify-between text-xs font-semibold text-neutral-900 font-mono-nums">
                <span>Net Cashflow:</span>
                <span className="text-emerald-700">+$237,849.01</span>
              </div>
            </div>
          </div>

          {/* Yearly Report Card matching Screenshot 2 */}
          <div className="p-3 bg-white border border-neutral-200/70 rounded-lg shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5">
              <span className="text-xs font-semibold text-neutral-800">Yearly Report</span>
              <span className="text-[11px] text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-sm">
                📅 This Year
              </span>
            </div>

            <div className="text-[11px] font-mono-nums space-y-1 text-neutral-600">
              <div className="font-semibold text-neutral-800 mb-1">2026 Fiscal Year</div>
              <div className="flex justify-between">
                <span>January:</span>
                <span><span className="text-emerald-700">$6,800</span> / <span className="text-rose-600">$0</span></span>
              </div>
              <div className="flex justify-between">
                <span>February:</span>
                <span><span className="text-emerald-700">$7,300</span> / <span className="text-rose-600">$0</span></span>
              </div>
              <div className="flex justify-between">
                <span>April:</span>
                <span><span className="text-emerald-700">$242,920</span> / <span className="text-rose-600">$5,071</span></span>
              </div>
              <div className="pt-1.5 border-t border-neutral-200 flex justify-between text-xs font-semibold text-neutral-800">
                <span>Annual Cashflow:</span>
                <span className="text-emerald-700">$251,949</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Area (9 cols on lg) */}
        <div className="lg:col-span-9 xl:col-span-9 space-y-6">
          {financeSubTab === 'overview' && (
            <>
              {/* Top Row: Monthly Trend Line Chart & Donut Breakdown Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MonthlyTrendChart />
                <DonutBreakdownChart />
              </div>

              {/* Middle Row: Expenses List (grouped by week) & Incomes List (grouped by month) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GroupedExpensesList />
                <GroupedIncomesList />
              </div>

              {/* Bottom Row: Budgets Grid & Accounts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Budgets Grid matching screenshot */}
                <div className="bg-white rounded-lg border border-neutral-200/70 p-4 shadow-2xs select-none">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-neutral-800">Budgets</h3>
                      <div className="px-2 py-0.5 text-xs text-neutral-600 bg-neutral-100 rounded-sm">
                        📅 This Month
                      </div>
                    </div>
                    <button className="text-neutral-400 hover:text-neutral-600 transition-colors p-1">
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {budgets.map((b) => {
                      const Icon = CATEGORY_ICONS[b.name] || ShoppingBag;
                      const percentage = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
                      const isOver = b.spent > b.limit;

                      return (
                        <div
                          key={b.id}
                          className="p-2.5 bg-neutral-50/70 border border-neutral-200/60 rounded-md"
                        >
                          <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-800 mb-1">
                            <Icon className="w-3.5 h-3.5 text-neutral-500" />
                            <span className="truncate">{b.name}</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono-nums text-neutral-600">
                            <span className={isOver ? 'text-rose-600 font-semibold' : ''}>
                              ${b.spent.toLocaleString()}
                            </span>
                            <span className="text-neutral-400">
                              ${b.limit.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className={`text-[10px] ${isOver ? 'text-rose-600 font-bold' : ''}`}>
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

                {/* Accounts Grid */}
                <AccountsGrid />
              </div>
            </>
          )}

          {/* Subscriptions Tab View */}
          {financeSubTab === 'subscriptions' && (
            <div className="bg-white rounded-lg border border-neutral-200/70 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Recurring Subscriptions & Services
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Track automatic renewals, recurring software licenses, and monthly burns.
                  </p>
                </div>
                <button
                  onClick={() => openModal('expense')}
                  className="px-3 py-1.5 bg-[#2383E2] text-white text-xs font-medium rounded-md shadow-2xs hover:bg-[#1B74C9] transition-colors"
                >
                  + Add Subscription
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 bg-neutral-50/70 border border-neutral-200/70 rounded-lg space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-semibold text-neutral-800">
                        {sub.name}
                      </span>
                      <button
                        onClick={() => toggleSubscription(sub.id)}
                        className={`px-1.5 py-0.5 text-[9px] rounded-xs font-medium ${
                          sub.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        {sub.status}
                      </button>
                    </div>

                    <div className="flex items-baseline justify-between pt-1 border-t border-neutral-200/40 font-mono-nums">
                      <span className="text-sm font-bold text-neutral-900">
                        ${sub.amount.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        /{sub.billingCycle}
                      </span>
                    </div>

                    <div className="text-[10px] text-neutral-400">
                      Next billing: {sub.nextBilling}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-800">
                <span>Total Monthly Burn:</span>
                <span className="font-mono-nums font-bold text-neutral-900">
                  ${subscriptions.reduce((sum, s) => sum + s.amount, 0).toFixed(2)} / month
                </span>
              </div>
            </div>
          )}

          {/* Saving Tracker Tab View */}
          {financeSubTab === 'savings' && (
            <div className="bg-white rounded-lg border border-neutral-200/70 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Saving Pots & Long-Term Reserves
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Sinking funds, emergency buffers, and planned target capital.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {savings.map((sav) => {
                  const percent = Math.min(100, Math.round((sav.currentAmount / sav.targetAmount) * 100));
                  return (
                    <div
                      key={sav.id}
                      className="p-4 bg-neutral-50/70 border border-neutral-200/70 rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-800">{sav.name}</h4>
                          <span className="text-[10px] text-neutral-400">{sav.category} · Target {sav.targetDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => addSavingAmount(sav.id, 500)}
                            className="px-2 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 text-[10px] font-medium rounded-xs"
                          >
                            + $500 Deposit
                          </button>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-xs font-mono-nums text-neutral-600">
                        <span>${sav.currentAmount.toLocaleString()} saved</span>
                        <span>${sav.targetAmount.toLocaleString()} ({percent}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Debt Tracker Tab View */}
          {financeSubTab === 'debts' && (
            <div className="bg-white rounded-lg border border-neutral-200/70 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Debt Paydown & Liabilities
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Track amortizations, interest rates, and accelerated payoff schedules.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {debts.map((debt) => {
                  const paid = debt.totalAmount - debt.remainingAmount;
                  const paidPercent = Math.round((paid / debt.totalAmount) * 100);

                  return (
                    <div
                      key={debt.id}
                      className="p-4 bg-neutral-50/70 border border-neutral-200/70 rounded-lg space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-semibold text-neutral-800">{debt.name}</h4>
                        <span className="text-[10px] font-mono-nums bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-xs">
                          {debt.interestRate}% APR
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between text-xs font-mono-nums">
                        <span className="text-neutral-500">Remaining Balance:</span>
                        <span className="text-sm font-bold text-rose-600">
                          ${debt.remainingAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-neutral-800 h-full rounded-full transition-all"
                          style={{ width: `${paidPercent}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-neutral-400 font-mono-nums">
                        <span>Paid: ${paid.toLocaleString()} ({paidPercent}%)</span>
                        <span>Monthly: ${debt.monthlyPayment}/mo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Guide / Setup Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-serif-title text-2xl text-neutral-900 font-normal">
              Finance OS Setup & Workflow Guide
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              Step-by-step instructions to get the most out of your financial ledger.
            </p>

            <div className="mt-4 space-y-3 text-xs text-neutral-700 leading-relaxed font-sans-body">
              <div className="p-2.5 bg-neutral-50 rounded-md border border-neutral-100">
                <span className="font-semibold text-neutral-900 block mb-0.5">1. Connect Your Accounts</span>
                Define your checking, savings, and investment accounts. Transfers automatically maintain ledger balances.
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-md border border-neutral-100">
                <span className="font-semibold text-neutral-900 block mb-0.5">2. Set Monthly Budget Ceilings</span>
                Keep category budgets updated. Live progress rings change color if expenditures approach or exceed limits.
              </div>
              <div className="p-2.5 bg-neutral-50 rounded-md border border-neutral-100">
                <span className="font-semibold text-neutral-900 block mb-0.5">3. Log Daily Cashflow</span>
                Use Quick Actions (+ New Expense, + New Income) or inline '+ New page' rows for lightning-fast logging.
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-4 py-1.5 bg-neutral-900 text-white rounded-md text-xs font-medium hover:bg-neutral-800 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
