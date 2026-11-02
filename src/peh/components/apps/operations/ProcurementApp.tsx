import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { ProcurementItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const ProcurementApp: React.FC = () => {
  const { procurements, addProcurement, updateProcurementStatus, deleteProcurement, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterDept, setFilterDept] = useState<string>('Semua');

  // Form states
  const [itemName, setItemName] = useState('');
  const [department, setDepartment] = useState<ProcurementItem['department']>('Teknologi & IT');
  const [vendorName, setVendorName] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [estimatedCost, setEstimatedCost] = useState<number>(15000000);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('2026-10-15');
  const [notes, setNotes] = useState('');

  const getApprovalAuthority = (cost: number) => {
    if (cost <= 5000000) return 'Otorisasi: Team Lead / Supervisor';
    if (cost <= 50000000) return 'Otorisasi: Head of Department / Manajer';
    return 'Otorisasi: Direktur / C-Level Executive';
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !vendorName.trim()) return;

    addProcurement({
      itemName: itemName.trim(),
      department,
      vendorName: vendorName.trim(),
      quantity: Number(quantity) || 1,
      estimatedCost: Number(estimatedCost) || 0,
      status: 'Diajukan',
      requestDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate,
      notes: notes.trim() || undefined,
    });

    setItemName('');
    setVendorName('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredProcurements = procurements.filter((p) => {
    return filterDept === 'Semua' || p.department === filterDept;
  });

  const totalValue = procurements.reduce((acc, curr) => acc + curr.estimatedCost, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 dark:border-amber-900/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Icon name="ShoppingBag" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Pengadaan & Purchase Orders
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Alur permintaan belanja kantor, ambang batas otorisasi anggaran, dan pelacakan kiriman PO.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Buat Pengajuan PO</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('po-requests')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'po-requests'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Receipt" size={14} />
          <span>Daftar Permintaan PO ({procurements.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('threshold-matrix')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'threshold-matrix'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Sliders" size={14} />
          <span>Matriks Otorisasi Belanja</span>
        </button>
      </div>

      {/* Interactive Feature: Threshold Matrix Guide */}
      <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="font-bold text-stone-900 dark:text-white">Tier 1 (&lt; Rp 5 Juta)</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Otorisasi cukup Team Lead / Supervisor departemen terkait.</div>
        </div>
        <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="font-bold text-stone-900 dark:text-white">Tier 2 (Rp 5 - 50 Juta)</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Otorisasi wajib Head of Department / Operational Manager.</div>
        </div>
        <div className="p-2.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
          <div className="font-bold text-stone-900 dark:text-white">Tier 3 (&gt; Rp 50 Juta)</div>
          <div className="text-[11px] text-stone-500 mt-0.5">Otorisasi Direktur Operasional / CFO dengan 3 pembanding vendor.</div>
        </div>
      </div>

      {/* List */}
      {filteredProcurements.length === 0 ? (
        <EmptyState
          iconName="ShoppingBag"
          title="Belum Ada Pengajuan Pengadaan"
          description="Log pengadaan barang/jasa Anda masih bersih tanpa data dummy. Buat pengajuan pembelian laptop developer, lisensi software, atau perlengkapan kantor."
          actionLabel="Buat Pengajuan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {filteredProcurements.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-300 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold text-stone-900 dark:text-white">{p.itemName}</h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                    {p.department}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.status === 'Barang Diterima & Lunas'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : p.status === 'PO Terbit'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="text-xs text-stone-500">
                  <span>Vendor: <strong>{p.vendorName}</strong> ({p.quantity} Unit)</span>
                  <span> • Total: <strong className="text-stone-900 dark:text-white">Rp {p.estimatedCost.toLocaleString('id-ID')}</strong></span>
                  <span> • Est. Kirim: {p.expectedDeliveryDate}</span>
                </div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                  {getApprovalAuthority(p.estimatedCost)}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <select
                  value={p.status}
                  onChange={(e) => updateProcurementStatus(p.id, e.target.value as any)}
                  className="px-2 py-1 text-xs rounded border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200"
                >
                  <option value="Diajukan">Diajukan</option>
                  <option value="Disetujui Manajer">Disetujui Manajer</option>
                  <option value="PO Terbit">PO Terbit</option>
                  <option value="Barang Diterima & Lunas">Barang Diterima & Lunas</option>
                </select>

                <button
                  onClick={() => deleteProcurement(p.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus PO"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Procurement */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Buat Pengajuan Pembelian / PO">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Nama Barang / Jasa</label>
            <input
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Contoh: MacBook Pro M3 untuk Senior Dev, Kursi Ergonomis Kantor"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Departemen Pemohon</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              >
                <option value="Teknologi & IT">Teknologi & IT</option>
                <option value="Operasional">Operasional</option>
                <option value="Marketing">Marketing</option>
                <option value="HR & Fasilitas">HR & Fasilitas</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Nama Vendor / Rekanan</label>
              <input
                type="text"
                required
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="PT Mitra Teknologi Solusi"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Kuantitas (Qty)</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Total Estimasi (Rp)</label>
              <input
                type="number"
                step="100000"
                required
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Target Kirim</label>
              <input
                type="date"
                required
                value={expectedDeliveryDate}
                onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">Catatan Justifikasi Pembelian</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Penggantian perangkat lama yang rusak untuk mendukung rilis produk Q4"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-300"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
            >
              Ajukan Pengadaan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
