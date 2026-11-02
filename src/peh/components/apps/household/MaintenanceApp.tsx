import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { MaintenanceItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const MaintenanceApp: React.FC = () => {
  const {
    maintenanceItems,
    addMaintenanceItem,
    markServiced,
    deleteMaintenanceItem,
    activeSubMenu,
    setActiveSubMenu,
  } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterLocation, setFilterLocation] = useState<string>('Semua');

  // Form states
  const [assetName, setAssetName] = useState('');
  const [location, setLocation] = useState<MaintenanceItem['location']>('Ruang Tamu');
  const [serviceType, setServiceType] = useState<MaintenanceItem['serviceType']>('Servis Berkala');
  const [intervalMonths, setIntervalMonths] = useState('3');
  const [lastServicedDate, setLastServicedDate] = useState('');
  const [nextDueDate, setNextDueDate] = useState('');
  const [technicianContact, setTechnicianContact] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    addMaintenanceItem({
      assetName: assetName.trim(),
      location,
      serviceType,
      intervalMonths: Number(intervalMonths) || 3,
      lastServicedDate: lastServicedDate || todayStr,
      nextDueDate: nextDueDate || todayStr,
      technicianContact: technicianContact.trim() || undefined,
      estimatedCost: estimatedCost ? Number(estimatedCost) : undefined,
    });

    setAssetName('');
    setLastServicedDate('');
    setNextDueDate('');
    setTechnicianContact('');
    setEstimatedCost('');
    setIsAddModalOpen(false);
  };

  const handleCompleteService = (item: MaintenanceItem) => {
    // calculate next due based on intervalMonths
    const now = new Date();
    now.setMonth(now.getMonth() + item.intervalMonths);
    const nextDue = now.toISOString().split('T')[0];
    markServiced(item.id, nextDue);
  };

  const filteredItems = maintenanceItems.filter((item) => {
    if (filterLocation === 'Semua') return true;
    return item.location === filterLocation;
  });

  const locations = ['Kamar Tidur', 'Ruang Tamu', 'Dapur', 'Kamar Mandi', 'Luar / Garasi'] as const;

  // Technicians list extracted strictly from real records
  const techContacts = maintenanceItems
    .filter((m) => m.technicianContact)
    .map((m) => ({
      asset: m.assetName,
      contact: m.technicianContact!,
      serviceType: m.serviceType,
    }));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 text-neutral-800">
              <Icon name="Wrench" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Perawatan & Servis
            </h1>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Jadwal perawatan berkala perabotan rumah, filter udara & air, dan kontak teknisi langganan.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors shadow-xs"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Jadwal Servis</span>
        </button>
      </div>

      {/* Submenus */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="inline-flex p-1 bg-neutral-100 rounded-lg text-xs font-medium">
          {[
            { id: 'appliances', label: 'Daftar Peralatan', count: maintenanceItems.length },
            { id: 'schedule', label: 'Jadwal Servis Berkala' },
            { id: 'contacts', label: 'Kontak Teknisi & Bengkel', count: techContacts.length },
          ].map((tab) => {
            const isActive = activeSubMenu === tab.id || (!activeSubMenu && tab.id === 'appliances');
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
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="text-xs px-2.5 py-1.5 border border-neutral-200 rounded-lg bg-white"
          >
            <option value="Semua">Semua Lokasi</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {maintenanceItems.length === 0 ? (
        <EmptyState
          iconName="Wrench"
          title="Belum ada peralatan yang dijadwalkan perawatannya"
          description="Daftarkan AC rumah, pompa air, filter dispenser, atau mesin cuci Anda agar tidak terlewat jadwal cuci berkala dan perawatannya."
          actionLabel="Daftarkan Peralatan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <>
          {/* Appliances List View */}
          {(activeSubMenu === 'appliances' || !activeSubMenu) && (
            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
              <div className="divide-y divide-neutral-100">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-neutral-50/50"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 text-sm">{item.assetName}</div>
                      {/* Zero-pill metadata */}
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1 flex-wrap">
                        <span>{item.location}</span>
                        <span aria-hidden="true">·</span>
                        <span>{item.serviceType}</span>
                        <span aria-hidden="true">·</span>
                        <span>Siklus: Tiap {item.intervalMonths} bulan</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-mono tabular-nums font-medium text-neutral-800">
                          Jatuh tempo: {item.nextDueDate}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          Terakhir: {item.lastServicedDate}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCompleteService(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-800 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors cursor-pointer"
                        title="Tandai servis selesai dan jadwalkan periode berikutnya"
                      >
                        <Icon name="Check" size={13} />
                        <span>Selesai Servis</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteMaintenanceItem(item.id)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors"
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Schedule View */}
          {activeSubMenu === 'schedule' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Jadwal Servis Berkala</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Diurutkan berdasarkan tanggal jatuh tempo servis berikutnya.
                </p>
              </div>

              <div className="space-y-3">
                {maintenanceItems
                  .slice()
                  .sort((a, b) => (a.nextDueDate > b.nextDueDate ? 1 : -1))
                  .map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 border border-neutral-200 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-700">
                          <Icon name="Wrench" size={14} />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-neutral-900">{item.assetName}</div>
                          <div className="text-[11px] text-neutral-500">
                            {item.location} · {item.serviceType}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-neutral-800 tabular-nums">
                          {item.nextDueDate}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCompleteService(item)}
                          className="px-2.5 py-1 text-xs text-neutral-700 bg-neutral-50 border border-neutral-200 hover:bg-neutral-100 rounded-md transition-colors"
                        >
                          Selesai
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Technician Directory View */}
          {activeSubMenu === 'contacts' && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Buku Kontak Teknisi & Bengkel</h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Daftar kontak nomor telepon teknisi dari jadwal perawatan Anda.
                </p>
              </div>

              {techContacts.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  Belum ada kontak teknisi yang dicantumkan pada peralatan.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {techContacts.map((t, idx) => (
                    <div key={idx} className="p-3.5 border border-neutral-100 rounded-lg bg-neutral-50/50">
                      <div className="text-xs font-semibold text-neutral-900">{t.asset}</div>
                      <div className="text-xs text-neutral-500">{t.serviceType}</div>
                      <div className="mt-2 text-xs font-mono font-medium text-neutral-900">
                        📞 {t.contact}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Maintenance Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Daftarkan Jadwal Perawatan"
        subtitle="Tetapkan nama peralatan rumah tangga dan siklus servis rutinnya."
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Peralatan / Aset *
            </label>
            <input
              type="text"
              required
              placeholder="Misal: AC Daikin Inverter 1PK, Mesin Cuci Electrolux"
              value={assetName}
              onChange={(e) => setAssetName(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg focus:outline-hidden focus:border-neutral-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Lokasi Ruangan</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                {locations.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Jenis Perawatan</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as any)}
                className="w-full text-xs px-2.5 py-2 border border-neutral-200 rounded-lg bg-white"
              >
                <option value="Servis Berkala">Servis Berkala</option>
                <option value="Pembersihan / Sanitasi">Pembersihan / Sanitasi</option>
                <option value="Penggantian Filter">Penggantian Filter</option>
                <option value="Perbaikan Kerusakan">Perbaikan Kerusakan</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Interval (Bulan)</label>
              <input
                type="number"
                min="1"
                required
                value={intervalMonths}
                onChange={(e) => setIntervalMonths(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Terakhir Diservis</label>
              <input
                type="date"
                value={lastServicedDate}
                onChange={(e) => setLastServicedDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Jatuh Tempo Servis</label>
              <input
                type="date"
                required
                value={nextDueDate}
                onChange={(e) => setNextDueDate(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Kontak Teknisi / Vendor (Opsional)
              </label>
              <input
                type="text"
                placeholder="Pak Budi - 08123456789"
                value={technicianContact}
                onChange={(e) => setTechnicianContact(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Estimasi Biaya Servis (Rp)
              </label>
              <input
                type="number"
                placeholder="100000"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-neutral-200 rounded-lg font-mono tabular-nums"
              />
            </div>
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
              Simpan Jadwal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
