import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { TransactionItem } from '../../types';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  PieChart,
  Tag,
  CreditCard,
  CheckCircle2,
  Trash2,
  Sparkles,
  DollarSign,
  Layers,
  ArrowRight,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Food & Dining': { bg: 'bg-amber-50', text: 'text-amber-800', dot: 'bg-amber-500' },
  'Groceries': { bg: 'bg-emerald-50', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  'Housing & Rent': { bg: 'bg-blue-50', text: 'text-blue-800', dot: 'bg-blue-500' },
  'Transportation': { bg: 'bg-indigo-50', text: 'text-indigo-800', dot: 'bg-indigo-500' },
  'Utilities': { bg: 'bg-yellow-50', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  'Shopping': { bg: 'bg-purple-50', text: 'text-purple-800', dot: 'bg-purple-500' },
  'Entertainment': { bg: 'bg-pink-50', text: 'text-pink-800', dot: 'bg-pink-500' },
  'Healthcare': { bg: 'bg-rose-50', text: 'text-rose-800', dot: 'bg-rose-500' },
  'Salary': { bg: 'bg-emerald-50', text: 'text-emerald-800', dot: 'bg-emerald-500' },
  'Freelance': { bg: 'bg-cyan-50', text: 'text-cyan-800', dot: 'bg-cyan-500' },
  'Investment': { bg: 'bg-teal-50', text: 'text-teal-800', dot: 'bg-teal-500' },
  'Other': { bg: 'bg-neutral-100', text: 'text-neutral-700', dot: 'bg-neutral-400' },
};

export const SimpleFinanceView: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction, accounts } = useLifeOS();
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Quick Add Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [txType, setTxType] = useState<'expense' | 'income'>('expense');
  const [txName, setTxName] = useState('');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Food & Dining');
  const [txDate, setTxDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [txAccount, setTxAccount] = useState('acc-1');
  const [txNote, setTxNote] = useState('');

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Available months extracted from transactions
  const months = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.date) {
        const ym = t.date.slice(0, 7); // YYYY-MM
        set.add(ym);
      }
    });
    return Array.from(set).sort().reverse();
  }, [transactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (t.type === 'transfer') return false;
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
      if (selectedMonth !== 'all' && !t.date.startsWith(selectedMonth)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesCat = t.category.toLowerCase().includes(q);
        const matchesNote = t.note?.toLowerCase().includes(q) || false;
        if (!matchesName && !matchesCat && !matchesNote) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterType, selectedCategory, selectedMonth, search]);

  // Calculations for current selection
  const monthlyTransactions = useMemo(() => {
    if (selectedMonth === 'all') return transactions;
    return transactions.filter((t) => t.date.startsWith(selectedMonth));
  }, [transactions, selectedMonth]);

  const totalIncome = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTransactions]);

  const totalExpense = useMemo(() => {
    return monthlyTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [monthlyTransactions]);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netSavings / totalIncome) * 100)) : 0;

  // Category breakdown for expenses
  const categoryExpenses = useMemo(() => {
    const map: Record<string, number> = {};
    monthlyTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map)
      .map(([cat, amt]) => ({ category: cat, amount: amt, pct: totalExpense > 0 ? (amt / totalExpense) * 100 : 0 }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyTransactions, totalExpense]);

  // Categories list for filter
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set).sort();
  }, [transactions]);

  // Monthly budget limit approximation
  const estimatedBudgetLimit = 4500;
  const budgetUsedPct = Math.min(100, Math.round((totalExpense / estimatedBudgetLimit) * 100));

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txName.trim() || !txAmount) return;

    addTransaction({
      name: txName.trim(),
      amount: parseFloat(txAmount) || 0,
      type: txType,
      category: txCategory,
      date: txDate,
      accountId: txAccount,
      note: txNote.trim() || undefined,
    });

    setTxName('');
    setTxAmount('');
    setTxNote('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Notion Page Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200/70">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">💰</span>
            <span className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
              Notion Template by LifeCanvas
            </span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl text-neutral-900 font-normal">
            Simple Finance Tracker
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Minimalist daily ledger, cashflow summary, category allocation & savings rate
          </p>
        </div>

        {/* Action Controls & Month Selector */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-neutral-100/80 px-2.5 py-1 rounded-lg border border-neutral-200/60 text-xs">
            <Calendar className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-medium text-neutral-700 outline-hidden cursor-pointer"
            >
              <option value="all">Semua Periode</option>
              {months.map((m) => {
                const [year, month] = m.split('-');
                const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('id-ID', {
                  month: 'long',
                  year: 'numeric',
                });
                return (
                  <option key={m} value={m}>
                    {monthName}
                  </option>
                );
              })}
            </select>
          </div>

          <button
            onClick={() => {
              setTxType('income');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-medium rounded-lg border border-emerald-200/60 transition-colors shadow-2xs"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>+ Pemasukan</span>
          </button>

          <button
            onClick={() => {
              setTxType('expense');
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium rounded-lg shadow-2xs transition-colors"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+ Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-neutral-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Total Pemasukan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-title text-2xl font-normal text-emerald-700">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {monthlyTransactions.filter((t) => t.type === 'income').length} transaksi masuk
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Total Pengeluaran</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="font-serif-title text-2xl font-normal text-neutral-900">
            {formatCurrency(totalExpense)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {monthlyTransactions.filter((t) => t.type === 'expense').length} transaksi keluar
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Sisa Bersih (Net)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className={`font-serif-title text-2xl font-normal ${netSavings >= 0 ? 'text-blue-700' : 'text-rose-600'}`}>
            {netSavings >= 0 ? `+${formatCurrency(netSavings)}` : formatCurrency(netSavings)}
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            {netSavings >= 0 ? 'Surplus kas periode ini' : 'Defisit - evaluasi pengeluaran'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-neutral-200/70 shadow-2xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Savings Rate</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-serif-title text-2xl font-normal text-neutral-900">
              {savingsRate}%
            </span>
            <span className="text-[11px] text-emerald-600 font-medium">
              {savingsRate >= 30 ? 'Target ideal tercapai' : 'Optimal >20%'}
            </span>
          </div>
          {/* Mini progress bar */}
          <div className="w-full bg-neutral-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                savingsRate >= 30 ? 'bg-emerald-500' : savingsRate >= 15 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, savingsRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Left Transactions Ledger, Right Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Transaction Ledger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs">
            {/* Table Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-800">
                  Riwayat Transaksi
                </span>
                <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-medium">
                  {filteredTransactions.length}
                </span>
              </div>

              {/* Type Switcher Pills */}
              <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    filterType === 'all' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Semua
                </button>
                <button
                  onClick={() => setFilterType('expense')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    filterType === 'expense' ? 'bg-white text-rose-700 shadow-2xs' : 'text-neutral-500 hover:text-rose-600'
                  }`}
                >
                  Pengeluaran
                </button>
                <button
                  onClick={() => setFilterType('income')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    filterType === 'income' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-neutral-500 hover:text-emerald-600'
                  }`}
                >
                  Pemasukan
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-2.5 pt-3 pb-2">
              <div className="flex-1 min-w-[180px] relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Cari transaksi atau catatan..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200/70 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-neutral-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs bg-neutral-50 border border-neutral-200/70 rounded-lg px-2.5 py-1.5 text-neutral-700 outline-hidden"
                >
                  <option value="all">Semua Kategori</option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Notion-style Transaction List / Table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 uppercase text-[10px] font-semibold tracking-wider">
                    <th className="py-2 px-2.5 font-medium">Tanggal</th>
                    <th className="py-2 px-2.5 font-medium">Deskripsi</th>
                    <th className="py-2 px-2.5 font-medium">Kategori</th>
                    <th className="py-2 px-2.5 font-medium text-right">Jumlah</th>
                    <th className="py-2 px-2.5 text-right w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-400">
                        Tidak ada transaksi yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((tx) => {
                      const isIncome = tx.type === 'income';
                      const catStyle = CATEGORY_COLORS[tx.category] || CATEGORY_COLORS['Other'];
                      return (
                        <tr
                          key={tx.id}
                          className="hover:bg-neutral-50/70 group transition-colors"
                        >
                          <td className="py-2.5 px-2.5 text-neutral-500 whitespace-nowrap font-mono text-[11px]">
                            {tx.date}
                          </td>
                          <td className="py-2.5 px-2.5">
                            <div className="font-medium text-neutral-800">{tx.name}</div>
                            {tx.note && (
                              <div className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                                {tx.note}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-2.5 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border border-neutral-200/50 ${catStyle.bg} ${catStyle.text}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${catStyle.dot}`} />
                              <span>{tx.category}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                            <span
                              className={`font-mono font-medium ${
                                isIncome ? 'text-emerald-700' : 'text-neutral-900'
                              }`}
                            >
                              {isIncome ? `+${formatCurrency(tx.amount)}` : `-${formatCurrency(tx.amount)}`}
                            </span>
                          </td>
                          <td className="py-2.5 px-2.5 text-right whitespace-nowrap">
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-rose-600 transition-opacity p-1 rounded-sm hover:bg-neutral-100"
                              title="Hapus transaksi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick footer add row shortcut */}
            <div className="pt-3 border-t border-neutral-100 mt-2 flex items-center justify-between text-xs text-neutral-500">
              <span>Menampilkan {filteredTransactions.length} dari {transactions.length} entri</span>
              <button
                onClick={() => {
                  setTxType('expense');
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-1 text-neutral-700 hover:text-neutral-900 font-medium py-1 px-2 rounded-md hover:bg-neutral-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Transaksi Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Category Breakdown, Accounts & Guidelines */}
        <div className="space-y-4">
          {/* Category Breakdown Widget */}
          <div className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-neutral-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Alokasi Pengeluaran
                </h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-500">
                {formatCurrency(totalExpense)}
              </span>
            </div>

            <div className="space-y-2.5 pt-1">
              {categoryExpenses.length === 0 ? (
                <p className="text-xs text-neutral-400 py-2">Belum ada data pengeluaran.</p>
              ) : (
                categoryExpenses.slice(0, 6).map((item) => {
                  const style = CATEGORY_COLORS[item.category] || CATEGORY_COLORS['Other'];
                  return (
                    <div key={item.category} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-neutral-700 truncate max-w-[130px]">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-neutral-400 text-[11px]">{item.pct.toFixed(0)}%</span>
                          <span className="font-mono text-neutral-800 font-medium text-[11px]">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${style.dot}`}
                          style={{ width: `${Math.min(100, item.pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Accounts & Dompet Overview */}
          <div className="bg-white rounded-xl border border-neutral-200/70 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
              <div className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-neutral-500" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Saldo Akun & Dompet
                </h3>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                {accounts.length} Akun
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-neutral-50/80 border border-neutral-200/50 hover:bg-neutral-100/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: acc.color || '#3b82f6' }}
                    />
                    <div>
                      <div className="text-xs font-medium text-neutral-800">{acc.name}</div>
                      <div className="text-[10px] text-neutral-400">{acc.institution}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs font-semibold text-neutral-900">
                      {formatCurrency(acc.balance)}
                    </div>
                    <div className="text-[10px] text-neutral-400 uppercase">{acc.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 50 / 30 / 20 Budget Guide Card */}
          <div className="bg-[#FAF8F5] rounded-xl border border-[#EBE3D7] p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <CheckCircle2 className="w-4 h-4 text-amber-700" />
              <span>Pedoman Anggaran 50 / 30 / 20</span>
            </div>
            <p className="text-neutral-600 text-[11px] leading-relaxed">
              Alokasikan 50% pendapatan untuk Kebutuhan Pokok (Needs), 30% untuk Keinginan (Wants), dan minimal 20% untuk Tabungan & Investasi (Savings).
            </p>
            <div className="grid grid-cols-3 gap-1 pt-1 text-center font-mono text-[10px]">
              <div className="p-1.5 bg-white/80 rounded-md border border-neutral-200/50">
                <span className="block text-neutral-400">Needs</span>
                <span className="font-semibold text-neutral-700">50%</span>
              </div>
              <div className="p-1.5 bg-white/80 rounded-md border border-neutral-200/50">
                <span className="block text-neutral-400">Wants</span>
                <span className="font-semibold text-neutral-700">30%</span>
              </div>
              <div className="p-1.5 bg-white/80 rounded-md border border-neutral-200/50">
                <span className="block text-neutral-400">Save</span>
                <span className="font-semibold text-emerald-700">20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Quick Add Transaction */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-neutral-200 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    txType === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {txType === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <h3 className="font-serif-title text-lg font-normal text-neutral-900">
                  {txType === 'income' ? 'Catat Pemasukan Baru' : 'Catat Pengeluaran Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3.5 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setTxType('expense')}
                  className={`py-1.5 font-medium rounded-md transition-all ${
                    txType === 'expense' ? 'bg-white text-rose-700 shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  Pengeluaran (Expense)
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('income')}
                  className={`py-1.5 font-medium rounded-md transition-all ${
                    txType === 'income' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  Pemasukan (Income)
                </button>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">
                  Nama / Deskripsi Transaksi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Belanja Mingguan Supermarket, Gaji Bulanan, Kopi"
                  value={txName}
                  onChange={(e) => setTxName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">
                    Jumlah ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Kategori</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400 cursor-pointer"
                  >
                    {txType === 'income' ? (
                      <>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Investment">Investment</option>
                        <option value="Other">Other</option>
                      </>
                    ) : (
                      <>
                        <option value="Food & Dining">Food & Dining</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Housing & Rent">Housing & Rent</option>
                        <option value="Transportation">Transportation</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-600 font-medium mb-1">Akun / Rekening</label>
                  <select
                    value={txAccount}
                    onChange={(e) => setTxAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400 cursor-pointer"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} ({acc.institution})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-600 font-medium mb-1">Catatan Tambahan (Opsional)</label>
                <input
                  type="text"
                  placeholder="Catatan kecil, struk, atau rincian item..."
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg outline-hidden focus:bg-white focus:border-neutral-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 font-medium shadow-2xs"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
