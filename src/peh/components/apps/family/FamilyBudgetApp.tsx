import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { FamilyBudgetItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const FamilyBudgetApp: React.FC = () => {
  const { familyBudgets, addFamilyBudget, updateFamilyBudgetAmount, deleteFamilyBudget, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [fundName, setFundName] = useState('');
  const [category, setCategory] = useState<FamilyBudgetItem['category']>('Pendidikan Anak');
  const [targetAmount, setTargetAmount] = useState<number>(50000000);
  const [currentAmount, setCurrentAmount] = useState<number>(15000000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(1500000);
  const [targetDate, setTargetDate] = useState('2028-06-30');
  const [notes, setNotes] = useState('');

  // Interactive Feature: Education Inflation Forecaster (e.g. 8% per annum education inflation)
  const [yearsToCollege, setYearsToCollege] = useState<number>(5);
  const [presentTuition, setPresentTuition] = useState<number>(100000000);
  const inflationRate = 0.08;
  const futureTuition = Math.round(presentTuition * Math.pow(1 + inflationRate, yearsToCollege));

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundName.trim()) return;

    addFamilyBudget({
      fundName: fundName.trim(),
      category,
      targetAmount: Number(targetAmount) || 10000000,
      currentAmount: Number(currentAmount) || 0,
      monthlyContribution: Number(monthlyContribution) || 500000,
      targetDate,
      notes: notes.trim() || undefined,
    });

    setFundName('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const totalTarget = familyBudgets.reduce((acc, curr) => acc + curr.targetAmount, 0);
  const totalSaved = familyBudgets.reduce((acc, curr) => acc + curr.currentAmount, 0);
  const totalMonthlyCommitment = familyBudgets.reduce((acc, curr) => acc + curr.monthlyContribution, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Icon name="PiggyBank" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Tabungan & Dana Keluarga
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Sinking fund pendidikan anak, dana darurat keluarga, dan kalkulator inflasi biaya sekolah.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Buat Pos Dana Terarah</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('sinking-funds')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'sinking-funds'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Coins" size={14} />
          <span>Pos Dana Terarah ({familyBudgets.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('education-calc')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'education-calc'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="GraduationCap" size={14} />
          <span>Kalkulator Inflasi Dana Pendidikan</span>
        </button>
      </div>

      {/* Interactive Feature: Education Inflation Forecaster */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <Icon name="GraduationCap" size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Proyeksi Inflasi Biaya Pendidikan (8% / Tahun)</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Hitung proyeksi dana kuliah/sekolah anak di masa depan dengan memasukkan biaya saat ini.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500">Biaya Kini: Rp</span>
              <input
                type="number"
                step="10000000"
                value={presentTuition}
                onChange={(e) => setPresentTuition(Number(e.target.value))}
                className="w-28 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-bold"
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500">Jangka:</span>
              <input
                type="number"
                min="1"
                max="20"
                value={yearsToCollege}
                onChange={(e) => setYearsToCollege(Number(e.target.value))}
                className="w-14 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-bold"
              />
              <span className="text-[11px] text-neutral-500">thn</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold shadow-sm">
              Proyeksi: Rp {futureTuition.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Total Akumulasi Terkumpul</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            Rp {totalSaved.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-neutral-400">
            {totalTarget > 0 ? `${Math.round((totalSaved / totalTarget) * 100)}% dari total sasaran` : '0%'}
          </div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="text-[11px] text-neutral-500">Target Keseluruhan</div>
          <div className="text-xl font-bold text-neutral-900 dark:text-white mt-1">
            Rp {totalTarget.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-neutral-400">Sinking fund terencana</div>
        </div>
        <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 col-span-2 sm:col-span-1">
          <div className="text-[11px] text-neutral-500">Setoran Rutin Bulanan</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {totalMonthlyCommitment.toLocaleString('id-ID')} / bln
          </div>
          <div className="text-[10px] text-neutral-400">Komitmen tabungan keluarga</div>
        </div>
      </div>

      {/* Funds Grid */}
      {familyBudgets.length === 0 ? (
        <EmptyState
          iconName="PiggyBank"
          title="Belum Ada Pos Tabungan Keluarga"
          description="Rencana tabungan keluarga Anda masih bersih tanpa data dummy. Mulai buat pos dana pendidikan anak, kas liburan bersama, atau dana darurat rumah tangga."
          actionLabel="Buat Pos Tabungan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {familyBudgets.map((f) => {
            const pct = f.targetAmount > 0 ? Math.min(100, Math.round((f.currentAmount / f.targetAmount) * 100)) : 0;
            return (
              <div
                key={f.id}
                className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                      {f.category}
                    </span>
                    <span className="text-xs text-neutral-400">Target: {f.targetDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">{f.fundName}</h3>

                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-500">Terkumpul: <strong>Rp {f.currentAmount.toLocaleString('id-ID')}</strong></span>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        Target: Rp {f.targetAmount.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-neutral-500 pt-0.5">
                      <span>{pct}% Tercapai</span>
                      <span>Setoran: Rp {f.monthlyContribution.toLocaleString('id-ID')}/bln</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateFamilyBudgetAmount(f.id, f.currentAmount + f.monthlyContribution)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 cursor-pointer"
                    >
                      +Setor 1 Bln
                    </button>
                    <button
                      onClick={() => updateFamilyBudgetAmount(f.id, f.currentAmount + 1000000)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                    >
                      +1 Juta
                    </button>
                  </div>

                  <button
                    onClick={() => deleteFamilyBudget(f.id)}
                    className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus pos"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add Family Budget */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Buat Pos Dana Keluarga Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nama Pos Dana</label>
            <input
              type="text"
              required
              value={fundName}
              onChange={(e) => setFundName(e.target.value)}
              placeholder="Contoh: Kuliah S1 Anak Pertama, Kas Liburan Jepang 2028"
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
                <option value="Dana Darurat">Dana Darurat</option>
                <option value="Pendidikan Anak">Pendidikan Anak</option>
                <option value="Kesehatan Keluarga">Kesehatan Keluarga</option>
                <option value="Liburan Bersama">Liburan Bersama</option>
                <option value="Investasi Properti">Investasi Properti</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Target Nominal (Rp)</label>
              <input
                type="number"
                step="1000000"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Saldo Awal (Rp)</label>
              <input
                type="number"
                step="500000"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Rencana Tabung/Bulan</label>
              <input
                type="number"
                step="100000"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Target Tanggal</label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Tambahan (Bank, Rekening, dll)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Disimpan di Reksadana Pasar Uang Bibit"
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
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              Simpan Pos Tabungan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
