import React from 'react';
import { usePEH } from '../../context/PEHContext';
import { CATEGORIES_CONFIG } from '../../data/appRegistry';
import { Icon } from '../common/Icon';

export const GlobalOverview: React.FC = () => {
  const {
    navigateTo,
    setIsQuickAddOpen,
    habits,
    journalEntries,
    goals,
    vaultItems,
    documents,
    subscriptions,
    pantryItems,
    maintenanceItems,
    chores,
    sharedExpenses,
    activityLogs,
    lastSynced,
  } = usePEH();

  const todayStr = new Date().toISOString().split('T')[0];

  // Derived real metrics
  const completedHabitsToday = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const habitsPendingToday = habits.length - completedHabitsToday;

  const totalMonthlySubExpense = subscriptions.reduce((sum, item) => {
    if (item.billingCycle === 'Bulanan') return sum + item.cost;
    if (item.billingCycle === 'Tahunan') return sum + Math.round(item.cost / 12);
    if (item.billingCycle === 'Mingguan') return sum + item.cost * 4;
    return sum;
  }, 0);

  const lowStockPantry = pantryItems.filter((p) => p.isRestockNeeded || p.quantity <= p.minStockAlert);
  const pendingChores = chores.filter((c) => c.lastCompletedDate !== todayStr);
  const unsettledExpenses = sharedExpenses.filter((e) => !e.isSettled);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Editorial Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
            Personal, Essentials, and Household
          </h1>
          <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
            Ekosistem modular manajemen kehidupan mandiri. Seluruh modul berdiri secara independen
            namun terhubung secara terintegrasi dengan sinkronisasi data real-time.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsQuickAddOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <Icon name="Plus" size={14} />
            <span>Tambah Data Real</span>
          </button>
        </div>
      </div>

      {/* 17 Fitur Baru PEH Innovation Banner */}
      <div className="p-4 bg-linear-to-r from-neutral-900 to-neutral-850 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-neutral-700/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Icon name="Sparkles" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">17 Modul & Fitur Inovasi PEH</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-200 font-mono font-bold">17 Aktif</span>
            </div>
            <p className="text-xs text-neutral-300 mt-0.5">
              Jelajahi Chronotype Alignment, Habit Elasticity, Emergency Will, Runway Simulator, dan 13 fitur terintegrasi lainnya.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigateTo('innovations')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-900 bg-white hover:bg-neutral-100 rounded-lg transition-colors shrink-0 cursor-pointer shadow-xs"
        >
          <span>Buka Katalog 50 Fitur</span>
          <Icon name="ArrowRight" size={13} />
        </button>
      </div>

      {/* Category Modules High-Level Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES_CONFIG.map((cat) => {
          let countSummary = '';
          if (cat.id === 'personal') {
            countSummary = `${habits.length} Habit · ${journalEntries.length} Jurnal · ${goals.length} Target`;
          } else if (cat.id === 'essentials') {
            countSummary = `${vaultItems.length} Kunci · ${documents.length} Berkas · ${subscriptions.length} Langganan`;
          } else if (cat.id === 'household') {
            countSummary = `${pantryItems.length} Bahan · ${maintenanceItems.length} Servis · ${chores.length + sharedExpenses.length} Tugas`;
          }

          return (
            <div
              key={cat.id}
              className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between hover:border-neutral-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-neutral-100 text-neutral-800">
                      <Icon name={cat.iconName} size={16} />
                    </span>
                    <h2 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">
                      {cat.name}
                    </h2>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {cat.apps.length} Apps
                  </span>
                </div>

                <p className="text-xs text-neutral-500 mb-4 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                {/* Sub Apps List */}
                <div className="space-y-1.5 pt-2 border-t border-neutral-100">
                  {cat.apps.map((app) => (
                    <button
                      key={app.id}
                      onClick={() => navigateTo(app.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-neutral-50 text-left text-xs transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon name={app.iconName} size={14} className="text-neutral-400 group-hover:text-neutral-900" />
                        <span className="font-medium text-neutral-700 group-hover:text-neutral-900 truncate">
                          {app.name}
                        </span>
                      </div>
                      <Icon
                        name="ChevronRight"
                        size={13}
                        className="text-neutral-300 group-hover:text-neutral-600 transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Footer Indicator */}
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                <span className="truncate">{countSummary}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Real-time Status & Urgent Attention Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Agenda & Perhatian Terkini */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Icon name="Activity" size={16} className="text-neutral-800" />
              <h3 className="text-sm font-semibold text-neutral-900">Perhatian Hari Ini</h3>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
            </span>
          </div>

          <div className="space-y-3">
            {/* Habit Status */}
            <div className="flex items-start justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <div>
                <div className="text-xs font-semibold text-neutral-800">Habit & Rutinitas</div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {habits.length === 0
                    ? 'Belum ada habit yang dikonfigurasi.'
                    : `${completedHabitsToday} dari ${habits.length} kebiasaan selesai hari ini (${habitsPendingToday} menunggu)`}
                </div>
              </div>
              <button
                onClick={() => navigateTo('habits')}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-900 underline underline-offset-2 shrink-0 cursor-pointer"
              >
                Buka
              </button>
            </div>

            {/* Subscriptions & Bills */}
            <div className="flex items-start justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <div>
                <div className="text-xs font-semibold text-neutral-800">Pengeluaran Rutin & Tagihan</div>
                <div className="text-xs text-neutral-500 mt-0.5 font-mono tabular-nums">
                  {subscriptions.length === 0 && sharedExpenses.length === 0
                    ? 'Belum ada data langganan atau tagihan rumah.'
                    : `Estimasi Langganan: Rp ${totalMonthlySubExpense.toLocaleString('id-ID')}/bln · ${unsettledExpenses.length} tagihan belum lunas`}
                </div>
              </div>
              <button
                onClick={() => navigateTo('subscriptions')}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-900 underline underline-offset-2 shrink-0 cursor-pointer"
              >
                Lihat
              </button>
            </div>

            {/* Pantry & Maintenance alerts */}
            <div className="flex items-start justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-100">
              <div>
                <div className="text-xs font-semibold text-neutral-800">Dapur & Kebutuhan Rumah</div>
                <div className="text-xs text-neutral-500 mt-0.5">
                  {lowStockPantry.length > 0
                    ? `${lowStockPantry.length} bahan menipis / perlu dibeli`
                    : 'Stok inventaris dapur dalam batas aman.'}{' '}
                  {pendingChores.length > 0 && `· ${pendingChores.length} piket belum selesai hari ini`}
                </div>
              </div>
              <button
                onClick={() => navigateTo('pantry', 'restock')}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-900 underline underline-offset-2 shrink-0 cursor-pointer"
              >
                Belanja
              </button>
            </div>
          </div>
        </div>

        {/* Global Real-Time Audit & Activity Feed */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Icon name="RefreshCw" size={16} className="text-neutral-800" />
                <h3 className="text-sm font-semibold text-neutral-900">Sinkronisasi & Log Terpadu</h3>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">Status: Real-Time</span>
            </div>

            {activityLogs.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Belum ada aktivitas tercatat. Semua penambahan, perubahan, dan penyelesaian tugas di modul
                  Personal, Essentials, atau Household akan tersinkronisasi di feed ini.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {activityLogs.slice(0, 7).map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between text-xs py-1.5 border-b border-neutral-100 last:border-0"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="font-medium text-neutral-900 truncate">
                        {log.title}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">{log.details}</div>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString('id-ID', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Sinkronisasi otomatis aktif</span>
            <span className="font-mono">Terakhir: {lastSynced}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
