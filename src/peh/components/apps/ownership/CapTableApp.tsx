import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { CapTableItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const CapTableApp: React.FC = () => {
  const { capTable, addCapTableItem, deleteCapTableItem, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [stakeholderName, setStakeholderName] = useState('');
  const [stakeholderRole, setStakeholderRole] = useState<CapTableItem['stakeholderRole']>('Pendiri (Founder)');
  const [shareClass, setShareClass] = useState<CapTableItem['shareClass']>('Saham Biasa (Common)');
  const [percentage, setPercentage] = useState<number>(30);
  const [sharesCount, setSharesCount] = useState<number>(300000);
  const [vestingCliffMonths, setVestingCliffMonths] = useState<number | undefined>(12);
  const [legalAgreementRef, setLegalAgreementRef] = useState('');
  const [notes, setNotes] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'stakeholders' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stakeholderName.trim() || percentage <= 0 || sharesCount <= 0) return;

    addCapTableItem({
      stakeholderName: stakeholderName.trim(),
      stakeholderRole,
      shareClass,
      percentage: Number(percentage) || 0,
      sharesCount: Number(sharesCount) || 0,
      vestingCliffMonths: vestingCliffMonths && vestingCliffMonths > 0 ? vestingCliffMonths : undefined,
      legalAgreementRef: legalAgreementRef.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setStakeholderName('');
    setStakeholderRole('Pendiri (Founder)');
    setShareClass('Saham Biasa (Common)');
    setPercentage(20);
    setSharesCount(200000);
    setVestingCliffMonths(12);
    setLegalAgreementRef('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const totalAllocatedPercentage = capTable.reduce((acc, curr) => acc + (curr.percentage || 0), 0);
  const totalSharesIssued = capTable.reduce((acc, curr) => acc + (curr.sharesCount || 0), 0);

  const filteredItems = capTable.filter((item) => {
    if (currentTab === 'classes') return true;
    if (currentTab === 'vesting') return Boolean(item.vestingCliffMonths && item.vestingCliffMonths > 0);
    return true; // 'stakeholders'
  });

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('stakeholders')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'stakeholders'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Users" className="h-4 w-4" />
            Tabel Pemegang Saham (Cap Table)
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'stakeholders' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {capTable.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('classes')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'classes'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Percent" className="h-4 w-4" />
            Alokasi Porsi & Struktur Saham
          </button>

          <button
            onClick={() => setActiveSubMenu('vesting')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'vesting'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="FileSignature" className="h-4 w-4" />
            Jadwal Vesting & Cliff
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950 text-white text-sm font-medium rounded-lg hover:bg-amber-900 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Tambah Pemegang Saham
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Saham Dialokasikan</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-bold tabular-nums ${totalAllocatedPercentage > 100 ? 'text-rose-600' : 'text-stone-900'}`}>
              {totalAllocatedPercentage.toFixed(1)}%
            </span>
            <span className="text-xs text-stone-400">
              {totalAllocatedPercentage <= 100 ? `(Sisa Pool: ${(100 - totalAllocatedPercentage).toFixed(1)}%)` : '(Melebihi 100%!)'}
            </span>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Lembar Saham Beredar</p>
          <p className="text-2xl font-semibold text-amber-950 mt-1 tabular-nums">
            {totalSharesIssued.toLocaleString('id-ID')} <span className="text-sm font-normal text-stone-500">Lembar</span>
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Entitas Pemegang Ekuitas</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{capTable.length}</p>
        </div>
      </div>

      {/* Visual Share Distribution Bar */}
      {capTable.length > 0 && (
        <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-900">Distribusi Visual Kepemilikan (Cap Table Distribution)</span>
            <span className="font-mono text-stone-500">{totalAllocatedPercentage.toFixed(1)}% Terbit</span>
          </div>
          <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex">
            {capTable.map((item, idx) => {
              const colors = [
                'bg-amber-950',
                'bg-amber-700',
                'bg-amber-500',
                'bg-stone-700',
                'bg-stone-500',
                'bg-emerald-800',
                'bg-indigo-800',
              ];
              const c = colors[idx % colors.length];
              return (
                <div
                  key={item.id}
                  style={{ width: `${Math.min(100, item.percentage)}%` }}
                  title={`${item.stakeholderName}: ${item.percentage}%`}
                  className={`${c} h-full transition-all duration-300 first:rounded-l-full last:rounded-r-full`}
                />
              );
            })}
          </div>
          <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-stone-600">
            {capTable.map((item) => (
              <div key={item.id} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-950" />
                <span>{item.stakeholderName}</span>
                <span className="font-bold text-stone-900 tabular-nums">({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List or Empty State */}
      {filteredItems.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'vesting'
              ? 'Tidak Ada Pemegang Saham dengan Skema Vesting Cliff'
              : 'Belum Ada Entitas Pemegang Saham (Cap Table Kosong)'
          }
          description="Dokumentasikan struktur kepemilikan modal, persentase saham pendiri (founders), alokasi opsi karyawan (ESOP pool), dan jadwal vesting secara legal dan transparan."
          actionLabel="Tambah Pemegang Saham Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="PieChart"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 text-xs font-semibold bg-amber-50 text-amber-950 rounded-md">
                      {item.percentage}% Saham
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-medium bg-stone-100 text-stone-700 rounded-md">
                      {item.stakeholderRole}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteCapTableItem(item.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Entri"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2.5">{item.stakeholderName}</h3>
                <p className="text-xs text-stone-500 mt-0.5">Kelas Saham: <strong className="text-stone-700">{item.shareClass}</strong></p>

                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Jumlah Lembar Saham:</span>
                    <strong className="text-stone-900 font-mono">{item.sharesCount.toLocaleString('id-ID')}</strong>
                  </div>
                  {item.vestingCliffMonths ? (
                    <div className="flex items-center justify-between">
                      <span className="text-stone-500">Vesting Cliff:</span>
                      <span className="text-amber-950 font-semibold">{item.vestingCliffMonths} Bulan</span>
                    </div>
                  ) : null}
                  {item.legalAgreementRef && (
                    <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                      <span className="text-stone-500">Dokumen Akta:</span>
                      <span className="font-mono text-stone-800 truncate">{item.legalAgreementRef}</span>
                    </div>
                  )}
                </div>

                {item.notes && (
                  <p className="mt-3 text-xs text-stone-500 italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                <span>Daftar {new Date(item.createdAt).toLocaleDateString('id-ID')}</span>
                <span className="text-amber-950 font-medium">Tercatat di Notaris / Akta</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Daftarkan Pemegang Saham (Cap Table Entry)"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Pemegang Saham / Entitas *
            </label>
            <input
              type="text"
              required
              value={stakeholderName}
              onChange={(e) => setStakeholderName(e.target.value)}
              placeholder="Contoh: Ahmad Fauzi / PT Modal Ventura Mandiri / Employee Pool"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Peran Stakeholder *
              </label>
              <select
                value={stakeholderRole}
                onChange={(e) => setStakeholderRole(e.target.value as CapTableItem['stakeholderRole'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Pendiri (Founder)">Pendiri (Founder)</option>
                <option value="Investor Awal (Angel/VC)">Investor Awal (Angel/VC)</option>
                <option value="Karyawan Kunci (ESOP)">Karyawan Kunci (ESOP)</option>
                <option value="Penasihat (Advisor)">Penasihat (Advisor)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Kelas Saham *
              </label>
              <select
                value={shareClass}
                onChange={(e) => setShareClass(e.target.value as CapTableItem['shareClass'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Saham Biasa (Common)">Saham Biasa (Common)</option>
                <option value="Saham Preferen (Preferred)">Saham Preferen (Preferred)</option>
                <option value="Opsi Saham (Options)">Opsi Saham (Options)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Porsi Kepemilikan (%) *
              </label>
              <input
                type="number"
                min="0.1"
                max="100"
                step="0.1"
                required
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Jumlah Lembar Saham *
              </label>
              <input
                type="number"
                min="1"
                required
                value={sharesCount}
                onChange={(e) => setSharesCount(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Vesting Cliff (Bulan, Opsional)
              </label>
              <input
                type="number"
                min="0"
                value={vestingCliffMonths || ''}
                onChange={(e) => setVestingCliffMonths(e.target.value ? Number(e.target.value) : undefined)}
                placeholder="12 Bulan"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nomor Akta Notaris / SHA (Opsional)
              </label>
              <input
                type="text"
                value={legalAgreementRef}
                onChange={(e) => setLegalAgreementRef(e.target.value)}
                placeholder="Akta Pendirian No. 14 / SHA-2024"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Catatan Hak Suara / Preferensi Khusus
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Hak likuidasi preferen 1x non-participating"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
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
              className="px-4 py-2 text-xs font-medium bg-amber-950 text-white rounded-lg hover:bg-amber-900 transition-colors"
            >
              Simpan Pemegang Saham
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
