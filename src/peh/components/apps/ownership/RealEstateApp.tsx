import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { RealEstateItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const RealEstateApp: React.FC = () => {
  const { realEstates, addRealEstate, deleteRealEstate, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>('Semua');

  // Form state
  const [propertyName, setPropertyName] = useState('');
  const [type, setType] = useState<RealEstateItem['type']>('Ruko / Rukan Komersial');
  const [certificateType, setCertificateType] = useState<RealEstateItem['certificateType']>('SHM (Milik)');
  const [landAreaM2, setLandAreaM2] = useState<number>(120);
  const [buildingAreaM2, setBuildingAreaM2] = useState<number>(200);
  const [acquisitionCost, setAcquisitionCost] = useState<number>(1500000000);
  const [currentMarketValuation, setCurrentMarketValuation] = useState<number>(1850000000);
  const [annualRentalIncome, setAnnualRentalIncome] = useState<number>(95000000);
  const [tenantNameOrStatus, setTenantNameOrStatus] = useState<RealEstateItem['tenantNameOrStatus']>('Disewakan (Ada Penyewa)');
  const [notes, setNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyName.trim()) return;

    addRealEstate({
      propertyName: propertyName.trim(),
      type,
      certificateType,
      landAreaM2: Number(landAreaM2) || 0,
      buildingAreaM2: Number(buildingAreaM2) || 0,
      acquisitionCost: Number(acquisitionCost) || 0,
      currentMarketValuation: Number(currentMarketValuation) || 0,
      annualRentalIncome: Number(annualRentalIncome) || 0,
      tenantNameOrStatus,
      notes: notes.trim() || undefined,
    });

    setPropertyName('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredProperties = realEstates.filter((item) => {
    return filterType === 'Semua' || item.type === filterType;
  });

  const totalAcquisition = realEstates.reduce((acc, curr) => acc + curr.acquisitionCost, 0);
  const totalMarketVal = realEstates.reduce((acc, curr) => acc + curr.currentMarketValuation, 0);
  const totalRentalCashflow = realEstates.reduce((acc, curr) => acc + (curr.annualRentalIncome || 0), 0);
  const capitalAppreciation = totalMarketVal - totalAcquisition;
  const averageCapRate =
    totalMarketVal > 0 ? ((totalRentalCashflow / totalMarketVal) * 100).toFixed(2) : '0';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-200 dark:border-amber-900/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Icon name="Landmark" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-stone-900 dark:text-white">
              Properti & Lahan Komersial
            </h1>
          </div>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
            Sertifikat tanah SHM/HGB, nilai appraisal pasar, dan kalkulator cap rate sewa tahunan.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Unit Properti</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-amber-200/60 dark:border-amber-900/40 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('properties')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'properties'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Building" size={14} />
          <span>Daftar Properti & Ruko ({realEstates.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('cap-rate-calc')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'cap-rate-calc'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Coins" size={14} />
          <span>Kalkulator Rental Yield & Cap Rate ({averageCapRate}%)</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('tenants')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'tenants'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200'
              : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
          }`}
        >
          <Icon name="Users" size={14} />
          <span>Status Kontrak Sewa</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
          <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Total Unit Terdaftar</p>
          <p className="text-xl font-bold text-stone-900 dark:text-white mt-1">{realEstates.length}</p>
        </div>
        <div className="p-3.5 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/50 dark:bg-stone-900/50">
          <p className="text-[11px] font-medium text-stone-500 dark:text-stone-400">Total Valuasi Appraisal</p>
          <p className="text-sm font-bold text-stone-900 dark:text-white mt-1">
            Rp {(totalMarketVal / 1000000000).toFixed(2)} Miliar
          </p>
        </div>
        <div className="p-3.5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/20 dark:bg-emerald-950/20">
          <p className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Rental Cashflow / Thn</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            Rp {(totalRentalCashflow / 1000000).toFixed(0)} Juta
          </p>
        </div>
        <div className="p-3.5 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/20 dark:bg-amber-950/20">
          <p className="text-[11px] font-medium text-amber-600 dark:text-amber-400">Rata-Rata Cap Rate</p>
          <p className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{averageCapRate}%</p>
        </div>
      </div>

      {/* View: Cap Rate Calc */}
      {activeSubMenu === 'cap-rate-calc' && (
        <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
          <h3 className="text-sm font-semibold text-stone-900 dark:text-white">Efisiensi Imbal Hasil Properti (Cap Rate)</h3>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Capitalization Rate (Cap Rate) dihitung dari pendapatan sewa kotor tahunan dibagi dengan nilai pasar terkini. Rata-rata nasional berkisar antara 4%–8% untuk ruko komersial dan residensial.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="text-emerald-700 dark:text-emerald-300">
              Apresiasi Nilai Aset Modal: +Rp {(capitalAppreciation / 1000000).toFixed(0)} Juta
            </span>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-stone-500">Filter Tipe:</span>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="text-xs px-2.5 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300"
        >
          <option value="Semua">Semua Tipe Properti</option>
          <option value="Ruko / Rukan Komersial">Ruko / Rukan Komersial</option>
          <option value="Gudang & Logistik">Gudang & Logistik</option>
          <option value="Ruang Kantor">Ruang Kantor</option>
          <option value="Tanah / Kavling">Tanah / Kavling</option>
          <option value="Rumah Kost / Residensial">Rumah Kost / Residensial</option>
        </select>
      </div>

      {/* List */}
      {filteredProperties.length === 0 ? (
        <EmptyState
          iconName="Landmark"
          title="Belum Ada Aset Properti"
          description="Tambahkan ruko, gudang, tanah usaha, atau ruang kantor untuk menghitung imbal hasil sewa dan nilai appraisal."
          actionLabel="Tambah Properti Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProperties.map((prop) => {
            const capRate =
              prop.currentMarketValuation > 0 && prop.annualRentalIncome
                ? ((prop.annualRentalIncome / prop.currentMarketValuation) * 100).toFixed(2)
                : '0';

            return (
              <div
                key={prop.id}
                className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                          {prop.certificateType}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          {prop.type}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-stone-900 dark:text-white mt-1.5">
                        {prop.propertyName}
                      </h3>
                    </div>
                    <button
                      onClick={() => deleteRealEstate(prop.id)}
                      className="text-stone-400 hover:text-rose-500 p-1 rounded transition-colors cursor-pointer"
                      title="Hapus"
                    >
                      <Icon name="Trash2" size={14} />
                    </button>
                  </div>

                  <div className="mt-3 text-xs space-y-1.5 text-stone-600 dark:text-stone-400">
                    <div className="flex items-center justify-between">
                      <span>Luas Tanah / Bangunan:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        {prop.landAreaM2} m² / {prop.buildingAreaM2} m²
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Biaya Akuisisi Awal:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200">
                        Rp {prop.acquisitionCost.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Nilai Appraisal Pasar:</span>
                      <span className="font-semibold text-stone-900 dark:text-white">
                        Rp {prop.currentMarketValuation.toLocaleString('id-ID')}
                      </span>
                    </div>
                    {prop.annualRentalIncome ? (
                      <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-stone-800">
                        <span>Sewa Tahunan / Cap Rate:</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          Rp {prop.annualRentalIncome.toLocaleString('id-ID')} ({capRate}%)
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {prop.notes && (
                    <p className="mt-2 text-xs italic text-stone-500 bg-stone-50 dark:bg-stone-950/40 p-2 rounded">
                      "{prop.notes}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      prop.tenantNameOrStatus === 'Disewakan (Ada Penyewa)'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : prop.tenantNameOrStatus === 'Ditempati Sendiri'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300'
                    }`}
                  >
                    {prop.tenantNameOrStatus}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Properti / Lahan Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">
              Nama & Lokasi Properti *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Ruko Boulevard Barat Blok C2, Kelapa Gading"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Tipe Properti</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as RealEstateItem['type'])}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Ruko / Rukan Komersial">Ruko / Rukan Komersial</option>
                <option value="Gudang & Logistik">Gudang & Logistik</option>
                <option value="Ruang Kantor">Ruang Kantor</option>
                <option value="Tanah / Kavling">Tanah / Kavling</option>
                <option value="Rumah Kost / Residensial">Rumah Kost / Residensial</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Jenis Hak & Sertifikat</label>
              <select
                value={certificateType}
                onChange={(e) => setCertificateType(e.target.value as RealEstateItem['certificateType'])}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="SHM (Milik)">SHM (Milik)</option>
                <option value="HGB (Guna Bangunan)">HGB (Guna Bangunan)</option>
                <option value="Sewa Jangka Panjang">Sewa Jangka Panjang</option>
                <option value="Hak Pakai">Hak Pakai</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Luas Tanah (m²)</label>
              <input
                type="number"
                min="0"
                value={landAreaM2}
                onChange={(e) => setLandAreaM2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Luas Bangunan (m²)</label>
              <input
                type="number"
                min="0"
                value={buildingAreaM2}
                onChange={(e) => setBuildingAreaM2(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Harga Beli / Akuisisi (Rp)</label>
              <input
                type="number"
                min="0"
                value={acquisitionCost}
                onChange={(e) => setAcquisitionCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Valuasi Pasar Terkini (Rp)</label>
              <input
                type="number"
                min="0"
                value={currentMarketValuation}
                onChange={(e) => setCurrentMarketValuation(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Pendapatan Sewa Tahunan (Rp)</label>
              <input
                type="number"
                min="0"
                value={annualRentalIncome}
                onChange={(e) => setAnnualRentalIncome(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Status Penghuni / Penyewa</label>
              <select
                value={tenantNameOrStatus}
                onChange={(e) => setTenantNameOrStatus(e.target.value as RealEstateItem['tenantNameOrStatus'])}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
              >
                <option value="Disewakan (Ada Penyewa)">Disewakan (Ada Penyewa)</option>
                <option value="Ditempati Sendiri">Ditempati Sendiri</option>
                <option value="Kosong / Pasarkan">Kosong / Pasarkan</option>
                <option value="Dalam Renovasi">Dalam Renovasi</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 dark:text-stone-300 mb-1">Catatan Tambahan</label>
            <textarea
              rows={2}
              placeholder="Jadwal jatuh tempo perpanjangan PBB, kontak penyewa, atau rencana renovasi..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-stone-200 dark:border-stone-700">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
            >
              Simpan Properti
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
