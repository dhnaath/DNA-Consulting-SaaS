import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { CapitalAssetItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const AssetsApp: React.FC = () => {
  const { capitalAssets, addCapitalAsset, updateAssetValuation, deleteCapitalAsset, activeSubMenu, setActiveSubMenu } = usePEH();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingValuationItem, setEditingValuationItem] = useState<CapitalAssetItem | null>(null);
  const [newValuationInput, setNewValuationInput] = useState<number>(0);

  // Form state
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState<CapitalAssetItem['category']>('Perangkat IT & Server');
  const [serialOrCode, setSerialOrCode] = useState('');
  const [purchaseValue, setPurchaseValue] = useState<number>(15000000);
  const [currentValuation, setCurrentValuation] = useState<number>(15000000);
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationOrAssignee, setLocationOrAssignee] = useState('');
  const [status, setStatus] = useState<CapitalAssetItem['status']>('Aktif Dipakai');
  const [notes, setNotes] = useState('');

  const currentTab = activeSubMenu === 'default' ? 'inventory' : activeSubMenu;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim() || !serialOrCode.trim() || !locationOrAssignee.trim()) return;

    addCapitalAsset({
      assetName: assetName.trim(),
      category,
      serialOrCode: serialOrCode.trim(),
      purchaseValue: Number(purchaseValue) || 0,
      currentValuation: Number(currentValuation) || Number(purchaseValue) || 0,
      purchaseDate,
      locationOrAssignee: locationOrAssignee.trim(),
      status,
      notes: notes.trim() || undefined,
    });

    setAssetName('');
    setCategory('Perangkat IT & Server');
    setSerialOrCode('');
    setPurchaseValue(15000000);
    setCurrentValuation(15000000);
    setPurchaseDate(new Date().toISOString().split('T')[0]);
    setLocationOrAssignee('');
    setStatus('Aktif Dipakai');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const handleUpdateValuation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingValuationItem) return;
    updateAssetValuation(editingValuationItem.id, Number(newValuationInput) || 0);
    setEditingValuationItem(null);
  };

  const filteredAssets = capitalAssets.filter((a) => {
    if (currentTab === 'valuation') return true;
    if (currentTab === 'maintenance-cost') return a.status === 'Dalam Perbaikan' || a.status === 'Cadangan';
    return true; // 'inventory'
  });

  const totalPurchaseValue = capitalAssets.reduce((acc, curr) => acc + (curr.purchaseValue || 0), 0);
  const totalCurrentValuation = capitalAssets.reduce((acc, curr) => acc + (curr.currentValuation || 0), 0);

  return (
    <div className="space-y-6">
      {/* Submenu navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubMenu('inventory')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'inventory'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="Box" className="h-4 w-4" />
            Daftar Aset Modal
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              currentTab === 'inventory' ? 'bg-amber-900 text-amber-100' : 'bg-stone-200 text-stone-700'
            }`}>
              {capitalAssets.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubMenu('valuation')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'valuation'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="DollarSign" className="h-4 w-4" />
            Valuasi & Depresiasi
          </button>

          <button
            onClick={() => setActiveSubMenu('maintenance-cost')}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              currentTab === 'maintenance-cost'
                ? 'bg-amber-950 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Icon name="MapPin" className="h-4 w-4" />
            Dalam Perbaikan / Cadangan
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-950 text-white text-sm font-medium rounded-lg hover:bg-amber-900 transition-colors shadow-xs"
        >
          <Icon name="Plus" className="h-4 w-4" />
          Tambah Aset Modal
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Item Aset Modal</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">{capitalAssets.length}</p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Total Nilai Beli Asal (Cost Basis)</p>
          <p className="text-2xl font-semibold text-stone-900 mt-1 tabular-nums">
            Rp {totalPurchaseValue.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="p-4 bg-white rounded-xl border border-stone-200">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider">Valuasi Sekarang (Current Value)</p>
          <p className="text-2xl font-semibold text-amber-950 mt-1 tabular-nums">
            Rp {totalCurrentValuation.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* List or Empty State */}
      {filteredAssets.length === 0 ? (
        <EmptyState
          title={
            currentTab === 'maintenance-cost'
              ? 'Tidak Ada Aset Dalam Perbaikan atau Cadangan'
              : 'Belum Ada Aset Modal atau Peralatan Kerja'
          }
          description="Catat aset fisik dan instrumen modal bernilai tinggi (laptop tim, server, kendaraan dinas, mesin produksi) lengkap dengan nomor seri dan nilai buku saat ini."
          actionLabel="Daftarkan Aset Pertama"
          onAction={() => setIsAddModalOpen(true)}
          iconName="Boxes"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white rounded-xl border border-stone-200 p-5 hover:border-stone-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-900 rounded-md">
                    {asset.category}
                  </span>
                  <button
                    onClick={() => deleteCapitalAsset(asset.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors p-1"
                    title="Hapus Aset"
                  >
                    <Icon name="Trash2" className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="text-base font-semibold text-stone-900 mt-2.5">{asset.assetName}</h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">SN / Kode: {asset.serialOrCode}</p>

                <div className="mt-4 p-3 bg-stone-50 rounded-lg border border-stone-100 space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Valuasi Sekarang:</span>
                    <strong className="text-amber-950 font-mono text-sm">Rp {asset.currentValuation.toLocaleString('id-ID')}</strong>
                  </div>
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Harga Beli:</span>
                    <span className="font-mono">Rp {asset.purchaseValue.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Penempatan / PJ:</span>
                    <span className="text-stone-800 font-medium">{asset.locationOrAssignee}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
                    <span className="text-stone-500">Status Aset:</span>
                    <span className="font-medium text-emerald-800">{asset.status}</span>
                  </div>
                </div>

                {asset.notes && (
                  <p className="mt-3 text-xs text-stone-500 italic">
                    "{asset.notes}"
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="text-stone-400 text-[11px]">Beli {asset.purchaseDate}</span>
                <button
                  onClick={() => {
                    setEditingValuationItem(asset);
                    setNewValuationInput(asset.currentValuation);
                  }}
                  className="font-semibold text-amber-950 hover:underline text-xs"
                >
                  Ubah Valuasi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revaluation Modal */}
      {editingValuationItem && (
        <Modal
          isOpen={Boolean(editingValuationItem)}
          onClose={() => setEditingValuationItem(null)}
          title={`Ubah Nilai Buku / Valuasi: ${editingValuationItem.assetName}`}
        >
          <form onSubmit={handleUpdateValuation} className="space-y-4">
            <div className="text-xs text-stone-500">
              Harga pembelian awal: <strong className="text-stone-800 font-mono">Rp {editingValuationItem.purchaseValue.toLocaleString('id-ID')}</strong>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Estimasi Nilai Buku / Pasar Sekarang (Rp) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={newValuationInput}
                onChange={(e) => setNewValuationInput(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setEditingValuationItem(null)}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium bg-amber-950 text-white rounded-lg hover:bg-amber-900 transition-colors"
              >
                Simpan Penyesuaian
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Daftarkan Aset Modal & Peralatan"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Nama Aset / Perangkat *
            </label>
            <input
              type="text"
              required
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              placeholder="Contoh: MacBook Pro M3 Max 64GB, Mesin Sablon Otomatis 4 Warna"
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Kategori Aset *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CapitalAssetItem['category'])}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
              >
                <option value="Perangkat IT & Server">Perangkat IT & Server</option>
                <option value="Mesin & Alat Produksi">Mesin & Alat Produksi</option>
                <option value="Kendaraan Operasional">Kendaraan Operasional</option>
                <option value="Properti & Ruang Kerja">Properti & Ruang Kerja</option>
                <option value="Portofolio Finansial">Portofolio Finansial</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Nomor Seri / Tag Kode Inventaris *
              </label>
              <input
                type="text"
                required
                value={serialOrCode}
                onChange={(e) => setSerialOrCode(e.target.value)}
                placeholder="Contoh: AST-IT-2024-008"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Harga Beli Asal (Rp) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={purchaseValue}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setPurchaseValue(val);
                  if (currentValuation === purchaseValue) setCurrentValuation(val);
                }}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Valuasi Sekarang (Rp) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={currentValuation}
                onChange={(e) => setCurrentValuation(Number(e.target.value))}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Tanggal Pembelian *
              </label>
              <input
                type="date"
                required
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Lokasi / Karyawan Pemegang *
              </label>
              <input
                type="text"
                required
                value={locationOrAssignee}
                onChange={(e) => setLocationOrAssignee(e.target.value)}
                placeholder="Contoh: Kantor Pusat Lt. 2 / Budi Santoso"
                className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Status Aset
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CapitalAssetItem['status'])}
              className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-950 bg-white"
            >
              <option value="Aktif Dipakai">Aktif Dipakai</option>
              <option value="Dalam Perbaikan">Dalam Perbaikan</option>
              <option value="Cadangan">Cadangan</option>
              <option value="Dijual / Pensiun">Dijual / Pensiun</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1">
              Catatan Garansi / Spesifikasi Tambahan
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Garansi resmi AppleCare hingga Oktober 2026"
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
              Simpan Aset Modal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
