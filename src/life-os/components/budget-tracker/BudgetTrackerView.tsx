import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { LifeCanvasBudget, BudgetRuleType } from '../../types';
import {
  PieChart,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  ArrowUpRight,
  Filter,
  X,
  Wallet,
  Home,
  ShoppingCart,
  Zap,
  Car,
  Coffee,
  ShoppingBag,
  Film,
  ShieldCheck,
  Coins,
  Layers,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Home,
  ShoppingCart,
  Zap,
  Car,
  Coffee,
  ShoppingBag,
  Film,
  TrendingUp,
  ShieldCheck,
  Coins,
  Wallet,
};

const RULE_GROUP_STYLES: Record<BudgetRuleType, { label: string; badge: string; desc: string }> = {
  'Needs (50%)': {
    label: 'Needs (50%)',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    desc: 'Kebutuhan esensial: Tempat tinggal, pangan dapur, utilitas, & transportasi',
  },
  'Wants (30%)': {
    label: 'Wants (30%)',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    desc: 'Keinginan & gaya hidup: Nongkrong di kafe, belanja, hiburan, & hobi',
  },
  'Savings & Debt (20%)': {
    label: 'Savings & Debt (20%)',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    desc: 'Tabungan & masa depan: Investasi indeks, dana darurat, & pelunasan utang',
  },
  'Custom': {
    label: 'Kategori Lain',
    badge: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    desc: 'Pos alokasi anggaran kustom pilihan sendiri',
  },
};

function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const BudgetTrackerView: React.FC = () => {
  const {
    lifeCanvasBudgets,
    addLifeCanvasBudget,
    updateLifeCanvasBudget,
    deleteLifeCanvasBudget,
    logExpenseToBudget,
    addTransaction,
    searchQuery,
  } = useLifeOS();

  const [selectedRuleGroup, setSelectedRuleGroup] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('2026-04');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [localSearch, setLocalSearch] = useState<string>('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<LifeCanvasBudget | null>(null);

  // Quick Expense Modal
  const [expenseModalBudget, setExpenseModalBudget] = useState<LifeCanvasBudget | null>(null);
  const [expenseAmount, setExpenseAmount] = useState<number>(50000);
  const [expenseNote, setExpenseNote] = useState<string>('');

  // Form State
  const [formData, setFormData] = useState<Omit<LifeCanvasBudget, 'id'>>({
    category: '',
    icon: 'ShoppingCart',
    allocated: 1000000,
    spent: 0,
    ruleGroup: 'Needs (50%)',
    notes: '',
  });

  const openAddModal = () => {
    setEditingBudget(null);
    setFormData({
      category: '',
      icon: 'ShoppingCart',
      allocated: 1000000,
      spent: 0,
      ruleGroup: 'Needs (50%)',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: LifeCanvasBudget) => {
    setEditingBudget(item);
    setFormData({
      category: item.category,
      icon: item.icon || 'ShoppingCart',
      allocated: item.allocated,
      spent: item.spent,
      ruleGroup: item.ruleGroup,
      notes: item.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category.trim()) return;

    if (editingBudget) {
      updateLifeCanvasBudget(editingBudget.id, formData);
    } else {
      addLifeCanvasBudget(formData);
    }
    setIsModalOpen(false);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (expenseModalBudget && expenseAmount > 0) {
      logExpenseToBudget(expenseModalBudget.id, expenseAmount);

      // Auto-log to global transactions
      addTransaction({
        type: 'expense',
        name: expenseNote.trim() || `Pengeluaran: ${expenseModalBudget.category}`,
        amount: expenseAmount,
        date: new Date().toISOString().split('T')[0],
        category: expenseModalBudget.category,
        note: `Dicatat dari Budget Tracker (${expenseModalBudget.ruleGroup})`,
      });

      setExpenseModalBudget(null);
      setExpenseAmount(50000);
      setExpenseNote('');
    }
  };

  // Calculations
  const stats = useMemo(() => {
    const totalAllocated = lifeCanvasBudgets.reduce((acc, b) => acc + b.allocated, 0);
    const totalSpent = lifeCanvasBudgets.reduce((acc, b) => acc + b.spent, 0);
    const totalRemaining = totalAllocated - totalSpent;
    const overallUtilization = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

    // 50/30/20 breakdown
    const needsAlloc = lifeCanvasBudgets
      .filter((b) => b.ruleGroup === 'Needs (50%)')
      .reduce((acc, b) => acc + b.allocated, 0);
    const needsSpent = lifeCanvasBudgets
      .filter((b) => b.ruleGroup === 'Needs (50%)')
      .reduce((acc, b) => acc + b.spent, 0);

    const wantsAlloc = lifeCanvasBudgets
      .filter((b) => b.ruleGroup === 'Wants (30%)')
      .reduce((acc, b) => acc + b.allocated, 0);
    const wantsSpent = lifeCanvasBudgets
      .filter((b) => b.ruleGroup === 'Wants (30%)')
      .reduce((acc, b) => acc + b.spent, 0);

    const savingsAlloc = lifeCanvasBudgets
      .filter((b) => b.ruleGroup === 'Savings & Debt (20%)')
      .reduce((acc, b) => acc + b.allocated, 0);
    const savingsSpent = lifeCanvasBudgets
      .filter((b) => b.ruleGroup === 'Savings & Debt (20%)')
      .reduce((acc, b) => acc + b.spent, 0);

    const overBudgetCount = lifeCanvasBudgets.filter((b) => b.spent > b.allocated).length;

    return {
      totalAllocated,
      totalSpent,
      totalRemaining,
      overallUtilization,
      needsAlloc,
      needsSpent,
      wantsAlloc,
      wantsSpent,
      savingsAlloc,
      savingsSpent,
      overBudgetCount,
    };
  }, [lifeCanvasBudgets]);

  const filteredBudgets = useMemo(() => {
    return lifeCanvasBudgets.filter((budget) => {
      if (selectedRuleGroup !== 'all' && budget.ruleGroup !== selectedRuleGroup) return false;

      const term = (searchQuery || localSearch).toLowerCase().trim();
      if (term) {
        const matchName = budget.category.toLowerCase().includes(term);
        const matchRule = budget.ruleGroup.toLowerCase().includes(term);
        const matchNote = (budget.notes || '').toLowerCase().includes(term);
        if (!matchName && !matchRule && !matchNote) return false;
      }
      return true;
    });
  }, [lifeCanvasBudgets, selectedRuleGroup, searchQuery, localSearch]);

  const ruleGroups: BudgetRuleType[] = [
    'Needs (50%)',
    'Wants (30%)',
    'Savings & Debt (20%)',
    'Custom',
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Banner */}
      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 shadow-xs">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold text-neutral-900 tracking-tight font-serif">
                  Budget Tracker by LifeCanvas
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium border border-neutral-200/60">
                  {lifeCanvasBudgets.length} pos anggaran
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Perencanaan anggaran amplop dengan pedoman aturan alokasi 50/30/20 & kontrol pengeluaran harian
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-700 font-medium focus:outline-hidden"
            >
              <option value="2026-04">Bulan Ini: April 2026</option>
              <option value="2026-03">Maret 2026</option>
              <option value="2026-all">Sepanjang 2026</option>
            </select>

            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pos Anggaran</span>
            </button>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-neutral-100">
          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Total Anggaran Dialokasikan
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-neutral-900 font-mono">
                {formatIDR(stats.totalAllocated)}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              100% rencana keuangan bulanan
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Realisasi Pengeluaran
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-xl font-semibold text-neutral-900 font-mono">
                {formatIDR(stats.totalSpent)}
              </span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  stats.overallUtilization > 100
                    ? 'bg-rose-600'
                    : stats.overallUtilization > 85
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.min(100, stats.overallUtilization)}%` }}
              />
            </div>
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Terpakai {stats.overallUtilization}% dari anggaran
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Sisa Anggaran Aman
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span
                className={`text-xl font-semibold font-mono ${
                  stats.totalRemaining >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {formatIDR(stats.totalRemaining)}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              {stats.totalRemaining >= 0 ? 'Masih dalam batas aman' : 'Melebihi alokasi awal'}
            </span>
          </div>

          <div className="bg-neutral-50/70 border border-neutral-200/60 rounded-xl p-3.5">
            <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider block">
              Status Kepatuhan Bujet
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span
                className={`text-xl font-semibold ${
                  stats.overBudgetCount > 0 ? 'text-rose-700' : 'text-emerald-700'
                }`}
              >
                {stats.overBudgetCount === 0 ? 'Semua Pos Aman' : `${stats.overBudgetCount} Pos Defisit`}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              {stats.overBudgetCount === 0 ? 'Pengeluaran disiplin ✨' : 'Perlu pengetatan pos belanja'}
            </span>
          </div>
        </div>

        {/* 50/30/20 Rule Progress Comparison */}
        <div className="mt-6 pt-5 border-t border-neutral-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-neutral-800">
              Evaluasi Aturan 50 / 30 / 20 (Needs, Wants, Savings)
            </span>
            <span className="text-[11px] text-neutral-400">Target Ideal Keuangan Sehat</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Needs 50% */}
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60">
              <div className="flex items-center justify-between font-medium">
                <span className="text-blue-900">1. Kebutuhan Pokok (Needs 50%)</span>
                <span className="font-mono text-blue-950 font-semibold">
                  {Math.round((stats.needsSpent / (stats.needsAlloc || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-blue-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (stats.needsSpent / (stats.needsAlloc || 1)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-blue-700/80 mt-1.5 font-mono">
                <span>{formatIDR(stats.needsSpent)}</span>
                <span>/ {formatIDR(stats.needsAlloc)}</span>
              </div>
            </div>

            {/* Wants 30% */}
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60">
              <div className="flex items-center justify-between font-medium">
                <span className="text-amber-900">2. Keinginan & Kafe (Wants 30%)</span>
                <span className="font-mono text-amber-950 font-semibold">
                  {Math.round((stats.wantsSpent / (stats.wantsAlloc || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-amber-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (stats.wantsSpent / (stats.wantsAlloc || 1)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-amber-700/80 mt-1.5 font-mono">
                <span>{formatIDR(stats.wantsSpent)}</span>
                <span>/ {formatIDR(stats.wantsAlloc)}</span>
              </div>
            </div>

            {/* Savings 20% */}
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/60">
              <div className="flex items-center justify-between font-medium">
                <span className="text-emerald-900">3. Tabung & Investasi (20%)</span>
                <span className="font-mono text-emerald-950 font-semibold">
                  {Math.round((stats.savingsSpent / (stats.savingsAlloc || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (stats.savingsSpent / (stats.savingsAlloc || 1)) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-emerald-700/80 mt-1.5 font-mono">
                <span>{formatIDR(stats.savingsSpent)}</span>
                <span>/ {formatIDR(stats.savingsAlloc)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari pos anggaran atau kategori..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 bg-neutral-50 hover:bg-neutral-100/80 focus:bg-white text-xs border border-neutral-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-neutral-400 transition-all text-neutral-900"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode */}
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Tampilan Kartu Amplop"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-neutral-900 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
                title="Tampilan Tabel Database"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Group Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedRuleGroup('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
              selectedRuleGroup === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
            }`}
          >
            Semua Pos Anggaran ({lifeCanvasBudgets.length})
          </button>
          {ruleGroups.map((group) => {
            const count = lifeCanvasBudgets.filter((b) => b.ruleGroup === group).length;
            return (
              <button
                key={group}
                onClick={() => setSelectedRuleGroup(group)}
                className={`px-3 py-1 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                  selectedRuleGroup === group
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                }`}
              >
                <span>{group}</span>
                <span className="text-[10px] ml-1 opacity-75">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      {filteredBudgets.length === 0 ? (
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-12 text-center">
          <PieChart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-medium text-neutral-900">Tidak ada pos anggaran</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Mulai atur alokasi bulanan Anda dengan menambahkan pos anggaran baru.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-medium hover:bg-neutral-800 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Pos Anggaran</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Envelope Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBudgets.map((budget) => {
            const IconComponent = ICON_MAP[budget.icon] || Wallet;
            const groupStyle = RULE_GROUP_STYLES[budget.ruleGroup] || RULE_GROUP_STYLES['Custom'];
            const percent = Math.round(((budget.spent || 0) / (budget.allocated || 1)) * 100);
            const isOver = budget.spent > budget.allocated;
            const remaining = budget.allocated - budget.spent;

            return (
              <div
                key={budget.id}
                className="bg-white border border-neutral-200/80 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900 leading-tight">
                          {budget.category}
                        </h3>
                        <span className={`text-[10px] font-medium px-2 py-0.2 rounded border inline-block mt-0.5 ${groupStyle.badge}`}>
                          {groupStyle.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(budget)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
                        title="Edit Anggaran"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus pos anggaran ${budget.category}?`)) {
                            deleteLifeCanvasBudget(budget.id);
                          }
                        }}
                        className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {budget.notes && (
                    <p className="text-xs text-neutral-500 mt-2 bg-neutral-50 p-2 rounded-lg border border-neutral-100 line-clamp-2">
                      {budget.notes}
                    </p>
                  )}
                </div>

                {/* Financial Progress Meter */}
                <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs">
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-neutral-500 text-[11px]">Terpakai / Plafon:</span>
                    <div>
                      <span className="font-semibold text-neutral-900">
                        {formatIDR(budget.spent)}
                      </span>
                      <span className="text-neutral-400 text-[11px]">
                        {' / '}
                        {formatIDR(budget.allocated)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isOver
                          ? 'bg-rose-600'
                          : percent >= 85
                          ? 'bg-amber-500'
                          : 'bg-emerald-600'
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-neutral-500">{percent}% terpakai</span>
                    <span
                      className={`font-medium ${
                        isOver ? 'text-rose-700 font-semibold' : 'text-neutral-600'
                      }`}
                    >
                      {isOver
                        ? `Defisit ${formatIDR(Math.abs(remaining))}`
                        : `Sisa ${formatIDR(remaining)}`}
                    </span>
                  </div>
                </div>

                {/* Quick Expense Action Button */}
                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setExpenseModalBudget(budget);
                      setExpenseAmount(50000);
                      setExpenseNote('');
                    }}
                    className="w-full py-1.5 px-3 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 rounded-lg text-xs font-medium border border-neutral-200/80 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-neutral-600" />
                    <span>Catat Pengeluaran</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-medium uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Pos Anggaran</th>
                  <th className="py-3 px-3">Aturan 50/30/20</th>
                  <th className="py-3 px-3">Alokasi Plafon</th>
                  <th className="py-3 px-3">Realisasi (Spent)</th>
                  <th className="py-3 px-3">Sisa Anggaran</th>
                  <th className="py-3 px-3">Utilisasi %</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredBudgets.map((b) => {
                  const percent = Math.round(((b.spent || 0) / (b.allocated || 1)) * 100);
                  const isOver = b.spent > b.allocated;
                  const remaining = b.allocated - b.spent;
                  const groupStyle = RULE_GROUP_STYLES[b.ruleGroup] || RULE_GROUP_STYLES['Custom'];

                  return (
                    <tr key={b.id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900">{b.category}</div>
                        {b.notes && (
                          <div className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">
                            {b.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${groupStyle.badge}`}>
                          {groupStyle.label}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-neutral-900 whitespace-nowrap">
                        {formatIDR(b.allocated)}
                      </td>
                      <td className="py-3 px-3 font-mono text-neutral-700 whitespace-nowrap">
                        {formatIDR(b.spent)}
                      </td>
                      <td
                        className={`py-3 px-3 font-mono whitespace-nowrap ${
                          isOver ? 'text-rose-700 font-semibold' : 'text-emerald-700'
                        }`}
                      >
                        {isOver ? `-${formatIDR(Math.abs(remaining))}` : formatIDR(remaining)}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${isOver ? 'bg-rose-600' : 'bg-neutral-900'}`}
                              style={{ width: `${Math.min(100, percent)}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-neutral-600">{percent}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setExpenseModalBudget(b);
                              setExpenseAmount(50000);
                              setExpenseNote('');
                            }}
                            className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded text-[11px] font-medium"
                          >
                            + Catat
                          </button>
                          <button
                            onClick={() => openEditModal(b)}
                            className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Hapus ${b.category}?`)) {
                                deleteLifeCanvasBudget(b.id);
                              }
                            }}
                            className="p-1 text-neutral-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Quick Log Expense to Budget Modal */}
      {expenseModalBudget && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-neutral-900 font-serif">Catat Pengeluaran</h3>
              </div>
              <button
                onClick={() => setExpenseModalBudget(null)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="space-y-4 mt-4 text-xs">
              <p className="text-neutral-600">
                Alokasi Pos: <span className="font-semibold text-neutral-900">{expenseModalBudget.category}</span>
              </p>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Nominal Pengeluaran (Rp) *</label>
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono text-sm font-semibold"
                />
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {[20000, 50000, 100000, 250000, 500000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setExpenseAmount(amt)}
                    className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-mono"
                  >
                    +{amt.toLocaleString('id-ID')}
                  </button>
                ))}
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Catatan Transaksi</label>
                <input
                  type="text"
                  placeholder="e.g. Belanja mingguan supermarket, makan siang..."
                  value={expenseNote}
                  onChange={(e) => setExpenseNote(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setExpenseModalBudget(null)}
                  className="px-3 py-1.5 text-neutral-600 hover:bg-neutral-100 rounded-lg font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg font-medium shadow-xs"
                >
                  Simpan & Potong Anggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Budget Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-neutral-800" />
                <h3 className="font-semibold text-neutral-900 font-serif">
                  {editingBudget ? 'Edit Pos Anggaran' : 'Tambah Pos Anggaran Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="font-medium text-neutral-700 block mb-1">Nama Pos / Kategori *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Perumahan, Bahan Makanan, Kafe & Kuliner..."
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Kelompok Aturan 50/30/20</label>
                <select
                  value={formData.ruleGroup}
                  onChange={(e) =>
                    setFormData({ ...formData, ruleGroup: e.target.value as BudgetRuleType })
                  }
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                >
                  {ruleGroups.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Plafon Anggaran (Rp) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.allocated}
                    onChange={(e) => setFormData({ ...formData, allocated: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-neutral-700 block mb-1">Sudah Terpakai (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.spent}
                    onChange={(e) => setFormData({ ...formData, spent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-neutral-700 block mb-1">Catatan / Deskripsi</label>
                <textarea
                  rows={2}
                  placeholder="Keterangan alokasi atau limit kartu debit..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-neutral-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-medium shadow-xs"
                >
                  {editingBudget ? 'Simpan Perubahan' : 'Tambahkan Pos Anggaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
