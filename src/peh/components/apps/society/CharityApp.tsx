import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { CharityItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const CharityApp: React.FC = () => {
  const { charities, addCharity, deleteCharity, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [causeTitle, setCauseTitle] = useState('');
  const [beneficiaryOrOrg, setBeneficiaryOrOrg] = useState('');
  const [category, setCategory] = useState<CharityItem['category']>('Zakat / Infak');
  const [amount, setAmount] = useState<number>(100000);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'active-donations' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!causeTitle.trim() || !beneficiaryOrOrg.trim() || !amount || !date) return;

    addCharity({
      causeTitle: causeTitle.trim(),
      beneficiaryOrOrg: beneficiaryOrOrg.trim(),
      category,
      amount: Number(amount) || 0,
      date,
      isRecurring,
      notes: notes.trim() || undefined,
    });

    setCauseTitle('');
    setBeneficiaryOrOrg('');
    setCategory('Zakat / Infak');
    setAmount(100000);
    setDate(new Date().toISOString().split('T')[0]);
    setIsRecurring(false);
    setNotes('');
    setIsAddModalOpen(false);
  };

  const totalDonated = charities.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const recurringCount = charities.filter(c => c.isRecurring).length;

  const filteredCharities = charities.filter((item) => {
    if (currentTab === 'recurring-pledges') {
      return item.isRecurring;
    }
    if (currentTab === 'impact-report') {
      return true;
    }
    return true; // 'active-donations'
  });

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('active-donations')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'active-donations'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Heart" className="h-4 w-4" />
            Rekam Donasi & Infak
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'active-donations' ? 'bg-emerald-800 text-emerald-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {charities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('recurring-pledges')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'recurring-pledges'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Repeat" className="h-4 w-4" />
            Komitmen Rutin
            {recurringCount > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                {recurringCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubMenu('impact-report')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'impact-report'
                ? 'bg-emerald-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="PieChart" className="h-4 w-4" />
            Rekap Transparansi & Dampak
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-900 text-white text-sm font-medium rounded-lg hover:bg-emerald-800 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Catat Donasi / Zakat
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Penyaluran Dana Sosial</p>
          <p className="text-2xl font-semibold text-emerald-900 mt-1 tabular-nums">
            Rp {totalDonated.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Komitmen Donasi Rutin</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">
            {recurringCount} <span className="text-sm font-normal text-stone-500">Program Aktif</span>
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Riwayat Penyaluran</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{charities.length}</p>
        </div>
      </div>

      {/* Content list or empty state */}
      {filteredCharities.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'recurring-pledges'
              ? 'Belum Ada Komitmen Donasi Rutin'
              : 'Belum Ada Riwayat Donasi & Filantropi'
          }
          description="Catat donasi sosial, zakat maal/fitrah, bantuan bencana alam, atau infak rutin bulanan untuk merekam jejak kebaikan dan transparansi pribadi."
          actionLabel="Catat Donasi Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="HeartHandshake"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCharities.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-800 rounded-md">
                      {item.category}
                    </span>
                    {item.isRecurring && (
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded-md inline-flex items-center gap-1">
                        <Icon name="Repeat" className="h-3 w-3" />
                        Rutin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCharity(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Rekaman"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2.5">{item.causeTitle}</h3>
                <p className="text-xs text-stone-500 mt-0.5">Penyalur: <span className="text-stone-700 font-medium">{item.beneficiaryOrOrg}</span></p>

                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-baseline justify-between">
                  <span className="text-xs text-stone-500">Nominal Penyaluran:</span>
                  <span className="text-base font-bold text-emerald-900 tabular-nums">
                    Rp {item.amount.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" className="h-3.5 w-3.5 text-stone-400" />
                    {item.date}
                  </span>
                  <span>{item.isRecurring ? 'Jadwal Rutin' : 'Donasi Insidental'}</span>
                </div>

                {item.notes && (
                  <p className="mt-3 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-lg italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Tercatat {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                <span className="text-emerald-700 font-medium">Tersalurkan</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Catat Penyaluran Donasi & Zakat"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Program / Nama Tujuan Donasi *
            </label>
            <input
              type="text"
              required
              value={causeTitle}
              onChange={(e) => setCauseTitle(e.target.value)}
              placeholder="Contoh: Zakat Maal Tahunan, Bantuan Gempa Sumbar, Beasiswa Dhuafa"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Lembaga / Panti / Penerima *
              </label>
              <input
                type="text"
                required
                value={beneficiaryOrOrg}
                onChange={(e) => setBeneficiaryOrOrg(e.target.value)}
                placeholder="Contoh: BAZNAS, Kitabisa, Dompet Dhuafa, Panti Asuhan Kasih"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Kategori Filantropi *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CharityItem['category'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 bg-white"
              >
                <option value="Zakat / Infak">Zakat / Infak</option>
                <option value="Bencana Alam">Bencana Alam</option>
                <option value="Beasiswa Pendidikan">Beasiswa Pendidikan</option>
                <option value="Panti Asuhan">Panti Asuhan</option>
                <option value="Pembangunan Sosial">Pembangunan Sosial</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nominal (Rp) *
              </label>
              <input
                type="number"
                min="1000"
                step="5000"
                required
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900 tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tanggal Penyaluran *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 text-emerald-900 rounded-md focus:ring-emerald-900"
            />
            <label htmlFor="isRecurring" className="text-xs text-stone-800 font-medium">
              Ini adalah donasi / infak rutin berulang (misal: potong zakat tiap bulan)
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Catatan / Doa / Nomor Resi Penyaluran
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: No. Bukti Setor #882194, niat zakat fitrah untuk keluarga"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-900"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-emerald-900 text-white rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Simpan Penyaluran Donasi
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
