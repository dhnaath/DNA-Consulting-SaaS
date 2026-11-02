import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { VehicleItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const VehiclesApp: React.FC = () => {
  const { vehicles, addVehicle, updateVehicleOdometer, deleteVehicle, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [vehicleName, setVehicleName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [type, setType] = useState<VehicleItem['type']>('Mobil Pribadi');
  const [currentOdometerKm, setCurrentOdometerKm] = useState<number>(45000);
  const [taxExpiryDate, setTaxExpiryDate] = useState('2027-08-15');
  const [fiveYearTaxDate, setFiveYearTaxDate] = useState('2030-08-15');
  const [lastOilChangeKm, setLastOilChangeKm] = useState<number>(40000);
  const [avgFuelEfficiencyKmPerL, setAvgFuelEfficiencyKmPerL] = useState<number>(12.5);
  const [notes, setNotes] = useState('');

  // Interactive Feature: Fuel Trip Cost Calculator
  const [tripDistanceKm, setTripDistanceKm] = useState<number>(150);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState<number>(13000); // e.g. Pertamax
  const [selectedVehicleEfficiency, setSelectedVehicleEfficiency] = useState<number>(12);
  const estimatedFuelLiters = (tripDistanceKm / (selectedVehicleEfficiency || 1)).toFixed(1);
  const estimatedTripCost = Math.round(Number(estimatedFuelLiters) * fuelPricePerLiter);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleName.trim() || !plateNumber.trim()) return;

    addVehicle({
      vehicleName: vehicleName.trim(),
      plateNumber: plateNumber.trim().toUpperCase(),
      type,
      currentOdometerKm: Number(currentOdometerKm) || 0,
      taxExpiryDate,
      fiveYearTaxDate,
      lastOilChangeKm: Number(lastOilChangeKm) || 0,
      avgFuelEfficiencyKmPerL: Number(avgFuelEfficiencyKmPerL) || undefined,
      status: 'Prima',
      notes: notes.trim() || undefined,
    });

    setVehicleName('');
    setPlateNumber('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Icon name="Car" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Kendaraan & BBM
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Pajak STNK tahunan, odometer ganti oli, dan kalkulator efisiensi bahan bakar (KM/L).
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Daftarkan Kendaraan</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('garage')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'garage'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Key" size={14} />
          <span>Garasi Kendaraan ({vehicles.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('fuel-efficiency')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'fuel-efficiency'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Fuel" size={14} />
          <span>Kalkulator Estimasi Biaya BBM</span>
        </button>
      </div>

      {/* Interactive Feature: Fuel Trip Cost Estimator */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <Icon name="Fuel" size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Estimator Biaya BBM Perjalanan</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Hitung kebutuhan liter bensin dan total biaya untuk rencana perjalanan darat.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500">Jarak:</span>
              <input
                type="number"
                value={tripDistanceKm}
                onChange={(e) => setTripDistanceKm(Number(e.target.value))}
                className="w-16 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-bold"
              />
              <span className="text-[11px] text-neutral-500">km</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-neutral-500">KM/L:</span>
              <input
                type="number"
                value={selectedVehicleEfficiency}
                onChange={(e) => setSelectedVehicleEfficiency(Number(e.target.value))}
                className="w-14 px-2 py-1 text-xs text-center border rounded bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-700 font-bold"
              />
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold">
              ~{estimatedFuelLiters} L (Rp {estimatedTripCost.toLocaleString('id-ID')})
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Cards */}
      {vehicles.length === 0 ? (
        <EmptyState
          iconName="Car"
          title="Garasi Masih Kosong"
          description="Daftar kendaraan Anda masih bersih tanpa data dummy. Daftarkan mobil atau motor keluarga Anda untuk melacak pajak tahunan dan servis oli."
          actionLabel="Daftarkan Kendaraan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vehicles.map((v) => {
            const kmSinceOil = v.currentOdometerKm - v.lastOilChangeKm;
            const isOilDue = kmSinceOil >= (v.type === 'Sepeda Motor' ? 3000 : 8000);
            return (
              <div
                key={v.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
                      {v.plateNumber}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isOilDue
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      }`}
                    >
                      {isOilDue ? '⚠️ Waktunya Ganti Oli' : '✓ Oli Aman'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-1">{v.vehicleName}</h3>
                  <p className="text-xs text-neutral-500 mb-3">{v.type}</p>

                  <div className="space-y-1 text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 pt-2 mb-3">
                    <div className="flex justify-between">
                      <span>Odometer Saat Ini:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-200">
                        {v.currentOdometerKm.toLocaleString('id-ID')} KM
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Oli Terakhir Ganti:</span>
                      <span>{v.lastOilChangeKm.toLocaleString('id-ID')} KM ({kmSinceOil} KM lalu)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pajak STNK 1 Tahun:</span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{v.taxExpiryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pajak Kaleng 5 Tahun:</span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{v.fiveYearTaxDate}</span>
                    </div>
                    {v.avgFuelEfficiencyKmPerL && (
                      <div className="flex justify-between">
                        <span>Konsumsi BBM Rata-rata:</span>
                        <span className="font-medium text-emerald-600">{v.avgFuelEfficiencyKmPerL} KM/Liter</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateVehicleOdometer(v.id, v.currentOdometerKm + 500)}
                      className="px-2 py-1 text-[10px] rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                    >
                      +500 KM
                    </button>
                    <button
                      onClick={() => updateVehicleOdometer(v.id, v.currentOdometerKm + 1000)}
                      className="px-2 py-1 text-[10px] rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                    >
                      +1.000 KM
                    </button>
                  </div>

                  <button
                    onClick={() => deleteVehicle(v.id)}
                    className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus kendaraan"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add Vehicle */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Daftarkan Kendaraan Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nama / Tipe Kendaraan</label>
              <input
                type="text"
                required
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder="Contoh: Honda HR-V 1.5, Vespa Primavera"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nomor Polisi (Plat)</label>
              <input
                type="text"
                required
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="B 1234 XYZ"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white uppercase font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Jenis Kendaraan</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Mobil Pribadi">Mobil Pribadi</option>
                <option value="Sepeda Motor">Sepeda Motor</option>
                <option value="Kendaraan Niaga">Kendaraan Niaga</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">KM Odometer Saat Ini</label>
              <input
                type="number"
                required
                value={currentOdometerKm}
                onChange={(e) => setCurrentOdometerKm(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Jatuh Tempo Pajak 1 Tahun (STNK)</label>
              <input
                type="date"
                required
                value={taxExpiryDate}
                onChange={(e) => setTaxExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Pajak Plat 5 Tahun</label>
              <input
                type="date"
                required
                value={fiveYearTaxDate}
                onChange={(e) => setFiveYearTaxDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">KM Terakhir Ganti Oli</label>
              <input
                type="number"
                value={lastOilChangeKm}
                onChange={(e) => setLastOilChangeKm(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Efisiensi Rata-rata (KM/L)</label>
              <input
                type="number"
                step="0.5"
                value={avgFuelEfficiencyKmPerL}
                onChange={(e) => setAvgFuelEfficiencyKmPerL(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Tambahan (Bengkel Langganan, No Rangka)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Bengkel resmi Honda Dewi Sartika, jenis BBM Ron 92"
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
              Simpan Kendaraan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
