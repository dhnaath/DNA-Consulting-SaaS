import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { BudgetItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const BudgetApp: React.FC = () => {
  const { budgetEnvelopes, addBudgetEnvelope, updateBudgetSpent, deleteBudgetEnvelope, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<string | null>(null);
  const [addExpenseAmount, setAddExpenseAmount] = useState<number>(50000);

  // Form states
  const [envelopeName, setEnvelopeName] = useState('');
  const [category, setCategory] = useState<BudgetItem['category']>('Kebutuhan Pokok');
  const [allocatedAmount, setAllocatedAmount] = useState<number>(2000000);
  const [monthPeriod, setMonthPeriod] = useState('2026-09');
  const [notes, setNotes] = useState('');

  // Interactive Feature: Emergency Fund Runway Calculator
  const [emergencySavings, setEmergencySavings] = useState<number>(30000000);
  const totalAllocated = budgetEnvelopes.reduce((acc, curr) => acc + curr.allocatedAmount, 0);
  const totalSpent = budgetEnvelopes.reduce((acc, curr) => acc + curr.spentAmount, 0);
  const monthlyRunway = totalAllocated > 0 ? (emergencySavings / totalAllocated).toFixed(1) : '∞';

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!envelopeName.trim()) return;

    addBudgetEnvelope({
      envelopeName: envelopeName.trim(),
      category,
      allocatedAmount: Number(allocatedAmount) || 500000,
      spentAmount: 0,
      monthPeriod,
      notes: notes.trim() || undefined,
    });

    setEnvelopeName('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleQuickAddExpense = (b: BudgetItem) => {
    updateBudgetSpent(b.id, b.spentAmount + addExpenseAmount);
    setSelectedEnvelopeId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Icon name="Wallet" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Anggaran & Kas Harian
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Sistem amplop anggaran, alokasi pos belanja pokok, dan kalkulator dana darurat.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Buat Pos Amplop Baru</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('envelopes')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'envelopes'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="FolderCheck" size={14} />
          <span>Pos Amplop ({budgetEnvelopes.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('emergency-calc')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'emergency-calc'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="ShieldAlert" size={14} />
          <span>Kalkulator Runway Darurat</span>
        </button>
      </div>

      {/* Interactive Feature: Emergency Fund Runway Calculator */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Icon name="ShieldCheck" size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Kalkulator Daya Tahan Dana Darurat (Runway)</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Hitung berapa bulan kas Anda dapat bertahan jika seluruh penghasilan berhenti.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500">Saldo Darurat: Rp</span>
              <input
                type="number"
                step="1000000"
                value={emergencySavings}
                onChange={(e) => setEmergencySavings(Number(e.target.value))}
                className="w-28 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-bold"
              />
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold">
              Runway: {monthlyRunway} Bulan
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Total Plafon Anggaran</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            Rp {totalAllocated.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-neutral-400">Plafon periode berjalan</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Realisasi Pengeluaran</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            Rp {totalSpent.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-neutral-400">
            {totalAllocated > 0 ? `${Math.round((totalSpent / totalAllocated) * 100)}% terserap` : '0%'}
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-neutral-500">Sisa Anggaran Aman</div>
          <div className={`text-xl font-bold mt-1 ${totalAllocated - totalSpent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            Rp {(totalAllocated - totalSpent).toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-neutral-400">Sisa plafon dapat dibelanjakan</div>
        </div>
      </div>

      {/* Envelopes Grid */}
      {budgetEnvelopes.length === 0 ? (
        <EmptyState
          iconName="Wallet"
          title="Belum Ada Pos Anggaran"
          description="Alokasi amplop kas Anda masih bersih tanpa data dummy. Buat pos pengeluaran seperti Makan Pokok, Transportasi, atau Belanja Mingguan."
          actionLabel="Buat Amplop Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgetEnvelopes.map((b) => {
            const pct = b.allocatedAmount > 0 ? Math.min(100, Math.round((b.spentAmount / b.allocatedAmount) * 100)) : 0;
            const remaining = b.allocatedAmount - b.spentAmount;
            return (
              <div
                key={b.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {b.category}
                    </span>
                    <span className="text-[10px] text-neutral-400">{b.monthPeriod}</span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{b.envelopeName}</h3>

                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Terpakai: Rp {b.spentAmount.toLocaleString('id-ID')}</span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        Plafon: Rp {b.allocatedAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
                      <span>{pct}% Terpakai</span>
                      <span className={remaining < 0 ? 'text-rose-600 font-semibold' : 'text-neutral-500'}>
                        {remaining < 0 ? `Minus Rp ${Math.abs(remaining).toLocaleString('id-ID')}` : `Sisa Rp ${remaining.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateBudgetSpent(b.id, b.spentAmount + 50000)}
                      className="px-2 py-1 text-[10px] rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                    >
                      +50rb
                    </button>
                    <button
                      onClick={() => updateBudgetSpent(b.id, b.spentAmount + 100000)}
                      className="px-2 py-1 text-[10px] rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                    >
                      +100rb
                    </button>
                  </div>

                  <button
                    onClick={() => deleteBudgetEnvelope(b.id)}
                    className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus amplop"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add Envelope */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Buat Pos Amplop Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nama Pos Amplop</label>
            <input
              type="text"
              required
              value={envelopeName}
              onChange={(e) => setEnvelopeName(e.target.value)}
              placeholder="Contoh: Belanja Pasar & Makan, Bensin & Tol"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Kebutuhan Pokok">Kebutuhan Pokok</option>
                <option value="Transportasi">Transportasi</option>
                <option value="Gaya Hidup & Hobi">Gaya Hidup & Hobi</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Tabungan & Investasi">Tabungan & Investasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Plafon Anggaran (Rp)</label>
              <input
                type="number"
                step="50000"
                required
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Periode Bulan</label>
            <input
              type="month"
              value={monthPeriod}
              onChange={(e) => setMonthPeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan pos atau batasan belanja..."
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold"
            >
              Simpan Pos Amplop
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
