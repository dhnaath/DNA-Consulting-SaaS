import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { SubscriptionItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const SubscriptionsApp: React.FC = () => {
  const { subscriptions, addSubscription, deleteSubscription, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterCycle, setFilterCycle] = useState<string>('Semua');

  // Form states
  const [serviceName, setServiceName] = useState('');
  const [category, setCategory] = useState<SubscriptionItem['category']>('Hiburan & Streaming');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState<SubscriptionItem['billingCycle']>('Bulanan');
  const [renewalDate, setRenewalDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Kartu Kredit/Debit');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !cost) return;

    addSubscription({
      serviceName: serviceName.trim(),
      category,
      cost: Number(cost) || 0,
      billingCycle,
      renewalDate: renewalDate || new Date().toISOString().split('T')[0],
      paymentMethod,
      autoRenew: true,
    });

    setServiceName('');
    setCost('');
    setRenewalDate('');
    setIsAddModalOpen(false);
  };

  const filteredSubs = subscriptions.filter((sub) => {
    if (filterCycle === 'Semua') return true;
    return sub.billingCycle === filterCycle;
  });

  // Calculate monthly & annual totals from real subscriptions
  const monthlyTotal = subscriptions.reduce((sum, item) => {
    if (item.billingCycle === 'Bulanan') return sum + item.cost;
    if (item.billingCycle === 'Tahunan') return sum + Math.round(item.cost / 12);
    if (item.billingCycle === 'Mingguan') return sum + item.cost * 4;
    return sum;
  }, 0);

  const annualTotal = monthlyTotal * 12;

  // Spending by category
  const categorySpending = subscriptions.reduce<Record<string, number>>((acc, curr) => {
    const monthlyCost =
      curr.billingCycle === 'Bulanan'
        ? curr.cost
        : curr.billingCycle === 'Tahunan'
        ? Math.round(curr.cost / 12)
        : curr.cost * 4;
    acc[curr.category] = (acc[curr.category] || 0) + monthlyCost;
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 text-neutral-800">
              <Icon name="CreditCard" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Langganan & Tagihan
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Pantau seluruh pengeluaran rutin berulang, proyeksi tahunan, dan audit langganan aktif.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Langganan</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'active-subs', label: 'Daftar Langganan', count: subscriptions.length },
            { id: 'forecast', label: 'Kalender & Proyeksi' },
            { id: 'breakdown', label: 'Distribusi Anggaran' },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'active-subs');
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubMenu(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterCycle}
            onChange={(e) => setFilterCycle(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white"
          >
            <option value="Semua">Semua Siklus</option>
            <option value="Bulanan">Bulanan</option>
            <option value="Tahunan">Tahunan</option>
            <option value="Mingguan">Mingguan</option>
          </select>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <EmptyState
          iconName="CreditCard"
          title="Belum ada langganan yang dicatat"
          description="Catat langganan streaming digital, penyimpanan cloud, domain, atau gym agar tidak ada biaya siluman yang terpotong tanpa sepengetahuan Anda."
          actionLabel="Catat Langganan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Active Subscriptions View */}
          {(activeSubMenu === 'active-subs' || !activeSubMenu) && (
            <div className="space-y-4">
              {/* Financial Metrics Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="text-xs text-neutral-500">Estimasi Pengeluaran Bulanan</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    Rp {monthlyTotal.toLocaleString('id-ID')}
                  </div>
                </div>
                <div className="p-4 bg-white border border-neutral-200 rounded-xl">
                  <div className="text-xs text-neutral-500">Proyeksi Pengeluaran Tahunan</div>
                  <div className="text-2xl font-bold text-neutral-900 mt-1 font-mono tabular-nums">
                    Rp {annualTotal.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* Subscriptions List */}
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="divide-y divide-neutral-100">
                  {filteredSubs.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50"
                    >
                      <div>
                        <div className="text-sm font-semibold text-neutral-900">{sub.serviceName}</div>
                        {/* Zero-pill metadata */}
                        <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                          <span>{sub.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{sub.paymentMethod}</span>
                          <span aria-hidden="true">·</span>
                          <span>Jatuh tempo: {sub.renewalDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-sm font-bold text-neutral-900 font-mono tabular-nums">
                            Rp {sub.cost.toLocaleString('id-ID')}
                          </div>
                          <div className="text-[11px] text-neutral-400 capitalize">
                            per {sub.billingCycle.toLowerCase()}
                          </div>
                        </div>

                        <button
                          onClick={() => deleteSubscription(sub.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                          title="Hapus"
                        >
                          <Icon name="Trash2" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Forecast View */}
          {activeSubMenu === 'forecast' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Jadwal Perpanjangan & Kalender Tagihan</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Daftar layanan yang akan melakukan penarikan biaya pada periode mendatang.
                </p>
              </div>

              <div className="space-y-3">
                {subscriptions
                  .slice()
                  .sort((a, b) => (a.renewalDate > b.renewalDate ? 1 : -1))
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="p-3.5 border border-neutral-100 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                          <Icon name="CreditCard" size={15} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-neutral-900">{sub.serviceName}</div>
                          <div className="text-[11px] text-neutral-500">
                            Siklus: {sub.billingCycle} · {sub.paymentMethod}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-neutral-900 tabular-nums">
                          Rp {sub.cost.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">{sub.renewalDate}</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Breakdown View */}
          {activeSubMenu === 'breakdown' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Alokasi Anggaran per Kategori</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Rasio pengeluaran rutin Anda berdasarkan data langganan tersimpan.
                </p>
              </div>

              <div className="space-y-3">
                {Object.entries(categorySpending).map(([cat, amount]) => {
                  const pct = monthlyTotal > 0 ? Math.round((amount / monthlyTotal) * 100) : 0;
                  return (
                    <div key={cat} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-neutral-800">{cat}</span>
                        <span className="font-mono text-neutral-700 tabular-nums">
                          Rp {amount.toLocaleString('id-ID')} / bln ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-neutral-900 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add Subscription Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Catat Langganan Baru"
        subtitle="Tetapkan nama layanan, nominal biaya, dan siklus perpanjangan."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Layanan *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: Netflix 4K, Google One 2TB, Spotify Family"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Hiburan & Streaming">Hiburan & Streaming</option>
                <option value="Produktivitas & Cloud">Produktivitas & Cloud</option>
                <option value="Utilitas Rumah">Utilitas Rumah</option>
                <option value="Gym & Keanggotaan">Gym & Keanggotaan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Biaya (Rupiah) *
              </label>
              <input
                type="number"
                required
                placeholder="Misal: 186000"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Siklus Tagihan</label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Bulanan">Bulanan</option>
                <option value="Tahunan">Tahunan</option>
                <option value="Mingguan">Mingguan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Tanggal Perpanjangan Berikutnya
              </label>
              <input
                type="date"
                required
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Metode Pembayaran</label>
            <input
              type="text"
              placeholder="Kartu Kredit BCA, Jenius, GoPay Auto-debit"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-900 rounded-lg"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Simpan Langganan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
