import React, { useState, useMemo } from 'react';
import { useLifeOS } from '../../context/LifeOSContext';
import { SubscriptionItem } from '../../types';
import {
  Repeat,
  Plus,
  Search,
  Calendar,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  PauseCircle,
  SlidersHorizontal,
  Trash2,
  ExternalLink,
  Flame,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Entertainment': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/60' },
  'Productivity': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/60' },
  'Cloud Storage': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200/60' },
  'Health & Fitness': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/60' },
  'Utilities': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200/60' },
  'Education': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200/60' },
};

export const SubscriptionTrackerView: React.FC = () => {
  const {
    subscriptions,
    toggleSubscription,
    deleteSubscription,
    openModal,
    searchQuery,
    totalMonthlySubscriptions,
    totalAnnualSubscriptions,
  } = useLifeOS();

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [localSearch, setLocalSearch] = useState<string>('');

  // Calculate days until next billing
  const getDaysUntilBilling = (billingDateStr: string) => {
    try {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const target = new Date(billingDateStr);
      target.setHours(0, 0, 0, 0);
      const diffTime = target.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return 30;
    }
  };

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      if (filterCategory !== 'all' && sub.category !== filterCategory) return false;
      if (filterStatus === 'active' && sub.status !== 'active') return false;
      if (filterStatus === 'paused' && sub.status !== 'paused') return false;
      if (filterStatus === 'renewal_soon') {
        const days = getDaysUntilBilling(sub.nextBilling);
        if (days > 7 || days < 0) return false;
      }

      const term = (searchQuery || localSearch).toLowerCase().trim();
      if (term) {
        const matchName = sub.name.toLowerCase().includes(term);
        const matchCat = sub.category.toLowerCase().includes(term);
        const matchPay = sub.paymentMethod?.toLowerCase().includes(term);
        if (!matchName && !matchCat && !matchPay) return false;
      }
      return true;
    });
  }, [subscriptions, filterCategory, filterStatus, searchQuery, localSearch]);

  const upcomingRenewalsCount = useMemo(() => {
    return subscriptions.filter((s) => {
      const days = getDaysUntilBilling(s.nextBilling);
      return s.status === 'active' && days >= 0 && days <= 7;
    }).length;
  }, [subscriptions]);

  const activeCount = subscriptions.filter((s) => s.status === 'active').length;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 transition-all select-none">
      {/* Top Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
                  Subscription Tracker
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono-nums bg-neutral-100 text-neutral-600 rounded-sm">
                  {subscriptions.length} layanan
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Audit langganan berulang, optimasi recurring expense, dan monitor jadwal pembayaran otomatis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('subscription')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#2383E2] hover:bg-[#1B74C9] rounded-md shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Langganan</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <div className="bg-white p-4 rounded-lg border border-neutral-200/70 shadow-2xs">
          <span className="text-[11px] font-medium text-neutral-400 block mb-1">
            Total Biaya Bulanan
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono-nums text-neutral-900">
            ${totalMonthlySubscriptions.toFixed(2)}
            <span className="text-xs text-neutral-400 font-normal ml-1">/bulan</span>
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Pengeluaran tetap rutin aktif
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200/70 shadow-2xs">
          <span className="text-[11px] font-medium text-neutral-400 block mb-1">
            Total Biaya Tahunan
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono-nums text-neutral-900">
            ${totalAnnualSubscriptions.toFixed(2)}
            <span className="text-xs text-neutral-400 font-normal ml-1">/tahun</span>
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Proyeksi annualised burn rate
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200/70 shadow-2xs">
          <span className="text-[11px] font-medium text-neutral-400 block mb-1">
            Status Layanan
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono-nums text-neutral-900 flex items-center gap-2">
            <span>{activeCount} Aktif</span>
            <span className="text-xs text-neutral-400 font-normal font-sans">
              ({subscriptions.length - activeCount} dijeda)
            </span>
          </div>
          <span className="text-[10px] text-emerald-600 mt-1 block flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Auto-renew terkontrol
          </span>
        </div>

        <div className="bg-white p-4 rounded-lg border border-neutral-200/70 shadow-2xs">
          <span className="text-[11px] font-medium text-neutral-400 block mb-1">
            Renewal 7 Hari Kedepan
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono-nums text-neutral-900 flex items-center gap-2">
            <span className={upcomingRenewalsCount > 0 ? 'text-amber-600' : 'text-neutral-900'}>
              {upcomingRenewalsCount} Layanan
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Pastikan saldo rekening mencukupi
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-neutral-200/70 p-3 shadow-2xs mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Semua ({subscriptions.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'active'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Aktif ({activeCount})
          </button>
          <button
            onClick={() => setFilterStatus('renewal_soon')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
              filterStatus === 'renewal_soon'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            <span>Renewal Segera ({upcomingRenewalsCount})</span>
          </button>
          <button
            onClick={() => setFilterStatus('paused')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors whitespace-nowrap ${
              filterStatus === 'paused'
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            Dijeda ({subscriptions.length - activeCount})
          </button>
        </div>

        {/* Search & View Mode */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-50 rounded-md border border-neutral-200/70 text-xs">
            <Search className="w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Cari langganan..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="bg-transparent outline-hidden w-28 sm:w-36 text-neutral-700 placeholder:text-neutral-400 text-xs"
            />
          </div>

          <div className="flex items-center bg-neutral-100 p-0.5 rounded-md border border-neutral-200/60">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded-sm transition-colors ${
                viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 rounded-sm transition-colors ${
                viewMode === 'table' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500 hover:text-neutral-800'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid Cards View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSubscriptions.map((sub) => {
            const catStyle = CATEGORY_COLORS[sub.category] || CATEGORY_COLORS['Utilities'];
            const daysLeft = getDaysUntilBilling(sub.nextBilling);
            const isRenewalUrgent = daysLeft >= 0 && daysLeft <= 7 && sub.status === 'active';

            return (
              <div
                key={sub.id}
                className="bg-white rounded-lg border border-neutral-200/70 hover:border-neutral-300 p-4 shadow-2xs transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Name & Status Pill */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-neutral-800 leading-tight">
                      {sub.name}
                    </h3>
                    <button
                      onClick={() => toggleSubscription(sub.id)}
                      className={`px-2 py-0.5 rounded-xs text-[10px] font-medium transition-colors ${
                        sub.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                      title="Klik untuk ubah status aktif/jeda"
                    >
                      {sub.status === 'active' ? 'Aktif' : 'Dijeda'}
                    </button>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-2xl font-bold font-mono-nums text-neutral-900">
                      ${sub.amount.toFixed(2)}
                    </span>
                    <span className="text-xs text-neutral-400 font-sans">
                      /{sub.billingCycle === 'monthly' ? 'bln' : sub.billingCycle === 'yearly' ? 'thn' : 'mgg'}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-xs border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                    >
                      {sub.category}
                    </span>
                  </div>

                  {/* Renewal countdown alert */}
                  <div className="p-2.5 bg-neutral-50 rounded-md border border-neutral-200/50 space-y-1.5 text-xs font-mono-nums mb-3">
                    <div className="flex items-center justify-between text-neutral-500">
                      <span className="font-sans text-[11px]">Jatuh Tempo:</span>
                      <span className="text-neutral-800">{sub.nextBilling}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-sans text-neutral-500">Sisa Waktu:</span>
                      <span
                        className={`font-semibold ${
                          isRenewalUrgent
                            ? 'text-rose-600'
                            : daysLeft < 0
                            ? 'text-neutral-400'
                            : 'text-neutral-700'
                        }`}
                      >
                        {daysLeft === 0 ? 'Hari Ini!' : daysLeft === 1 ? 'Besok' : daysLeft > 1 ? `${daysLeft} hari lagi` : 'Lewat'}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  {sub.paymentMethod && (
                    <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 truncate">
                      <CreditCard className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{sub.paymentMethod}</span>
                    </div>
                  )}

                  {sub.notes && (
                    <p className="text-[11px] text-neutral-400 mt-2 line-clamp-1 italic">
                      "{sub.notes}"
                    </p>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">
                    Auto-renew: <span className="font-medium text-neutral-700">{sub.autoRenew !== false ? 'ON' : 'OFF'}</span>
                  </span>

                  <button
                    onClick={() => deleteSubscription(sub.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-600 transition-opacity"
                    title="Hapus langganan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-lg border border-neutral-200/70 shadow-2xs overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200/60 bg-neutral-50/50 text-neutral-500 font-medium">
                <th className="py-2.5 px-3">Layanan</th>
                <th className="py-2.5 px-3">Biaya</th>
                <th className="py-2.5 px-3">Siklus</th>
                <th className="py-2.5 px-3">Kategori</th>
                <th className="py-2.5 px-3">Jatuh Tempo</th>
                <th className="py-2.5 px-3">Metode Bayar</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-2 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredSubscriptions.map((sub) => {
                const catStyle = CATEGORY_COLORS[sub.category] || CATEGORY_COLORS['Utilities'];
                const daysLeft = getDaysUntilBilling(sub.nextBilling);

                return (
                  <tr key={sub.id} className="hover:bg-[#F7F7F5] transition-colors group">
                    <td className="py-2.5 px-3 font-semibold text-neutral-800 align-middle">
                      {sub.name}
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums font-bold text-neutral-900 align-middle">
                      ${sub.amount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 align-middle capitalize">
                      {sub.billingCycle}
                    </td>
                    <td className="py-2.5 px-3 align-middle">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-medium rounded-xs border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                      >
                        {sub.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono-nums text-neutral-700 align-middle">
                      <span>{sub.nextBilling}</span>
                      <span className="text-neutral-400 text-[10px] ml-1">
                        ({daysLeft}h)
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-600 align-middle">
                      {sub.paymentMethod || '—'}
                    </td>
                    <td className="py-2.5 px-3 align-middle">
                      <button
                        onClick={() => toggleSubscription(sub.id)}
                        className={`px-2 py-0.5 rounded-xs text-[10px] font-medium ${
                          sub.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}
                      >
                        {sub.status === 'active' ? 'Aktif' : 'Dijeda'}
                      </button>
                    </td>
                    <td className="py-2.5 px-2 text-right align-middle">
                      <button
                        onClick={() => deleteSubscription(sub.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-600 transition-opacity"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
