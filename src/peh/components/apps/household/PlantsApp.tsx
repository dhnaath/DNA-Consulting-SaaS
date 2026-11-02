import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { PlantItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const PlantsApp: React.FC = () => {
  const { plants, addPlant, waterPlant, deletePlant, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterLocation, setFilterLocation] = useState<string>('Semua');

  // Form states
  const [plantName, setPlantName] = useState('');
  const [speciesOrVariety, setSpeciesOrVariety] = useState('');
  const [location, setLocation] = useState<PlantItem['location']>('Ruang Tamu');
  const [wateringIntervalDays, setWateringIntervalDays] = useState<number>(3);
  const [sunlightNeed, setSunlightNeed] = useState<PlantItem['sunlightNeed']>('Cahaya Terang Tidak Langsung');
  const [healthCondition, setHealthCondition] = useState<PlantItem['healthCondition']>('Subur & Segar');
  const [notes, setNotes] = useState('');

  const today = new Date();

  const getWateringStatus = (p: PlantItem) => {
    const last = new Date(p.lastWateredDate);
    const diffDays = Math.floor((today.getTime() - last.getTime()) / (1000 * 3600 * 24));
    const daysLeft = p.wateringIntervalDays - diffDays;

    if (daysLeft < 0) {
      return { label: `Telat ${Math.abs(daysLeft)} Hari`, isOverdue: true, isDueToday: false, daysLeft };
    }
    if (daysLeft === 0) {
      return { label: 'Perlu Disiram Hari Ini', isOverdue: false, isDueToday: true, daysLeft: 0 };
    }
    return { label: `${daysLeft} hari lagi`, isOverdue: false, isDueToday: false, daysLeft };
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plantName.trim()) return;

    addPlant({
      plantName: plantName.trim(),
      speciesOrVariety: speciesOrVariety.trim() || 'Tanaman Hias',
      location,
      wateringIntervalDays: Number(wateringIntervalDays) || 3,
      lastWateredDate: new Date().toISOString().split('T')[0],
      sunlightNeed,
      healthCondition,
      notes: notes.trim() || undefined,
    });

    setPlantName('');
    setSpeciesOrVariety('');
    setNotes('');
    setIsAddModalOpen(false);
  };

  const filteredPlants = plants.filter((p) => {
    return filterLocation === 'Semua' || p.location === filterLocation;
  });

  const dueForWateringCount = plants.filter((p) => {
    const status = getWateringStatus(p);
    return status.isDueToday || status.isOverdue;
  }).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              <Icon name="Flower2" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Tanaman & Kebun Rumah
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Jadwal penyiraman tanaman hias/kebun, kebutuhan sinar matahari, dan repotting media.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Tambah Tanaman</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('my-plants')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'my-plants'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Leaf" size={14} />
          <span>Koleksi Tanaman ({plants.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('watering-due')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'watering-due'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Droplets" size={14} />
          <span>Radar Jadwal Siram ({dueForWateringCount})</span>
        </button>
      </div>

      {/* Interactive Feature: Watering Due Alert Banner */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400">
            <Icon name="Droplets" size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Radar Penyiraman Otomatis</h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {dueForWateringCount > 0
                ? `${dueForWateringCount} tanaman membutuhkan air hari ini atau terlambat disiram.`
                : 'Seluruh tanaman dalam kondisi segar dan terhidrasi dengan baik.'}
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
          {dueForWateringCount} Perlu Perhatian
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-neutral-500">Filter Lokasi:</span>
        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="px-2.5 py-1 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
        >
          <option value="Semua">Semua Lokasi</option>
          <option value="Ruang Tamu">Ruang Tamu</option>
          <option value="Balkon / Teras">Balkon / Teras</option>
          <option value="Kamar Tidur">Kamar Tidur</option>
          <option value="Halaman Depan">Halaman Depan</option>
          <option value="Dapur">Dapur</option>
        </select>
      </div>

      {/* Main Grid */}
      {filteredPlants.length === 0 ? (
        <EmptyState
          iconName="Flower2"
          title="Belum Ada Tanaman Tercatat"
          description="Koleksi tanaman Anda masih kosong tanpa data dummy. Mulai daftarkan monstera, aglonema, sukulen, atau tanaman cabai halaman Anda."
          actionLabel="Daftarkan Tanaman Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlants.map((plant) => {
            const waterStatus = getWateringStatus(plant);
            return (
              <div
                key={plant.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between hover:border-neutral-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {plant.location}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        waterStatus.isOverdue
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                          : waterStatus.isDueToday
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                      }`}
                    >
                      {waterStatus.label}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">{plant.plantName}</h3>
                  <p className="text-xs text-neutral-500 italic mb-2">{plant.speciesOrVariety}</p>

                  <div className="space-y-1 text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 pt-2 mb-3">
                    <div className="flex justify-between">
                      <span>Kebutuhan Sinar:</span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{plant.sunlightNeed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interval Siram:</span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">Tiap {plant.wateringIntervalDays} hari</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Terakhir Siram:</span>
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{plant.lastWateredDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kondisi:</span>
                      <span className="font-medium text-emerald-600">{plant.healthCondition}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <button
                    onClick={() => waterPlant(plant.id)}
                    className="px-3 py-1 text-xs font-semibold rounded-lg bg-teal-600 hover:bg-teal-700 text-white flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                  >
                    <Icon name="Droplets" size={13} />
                    <span>Siram Hari Ini</span>
                  </button>

                  <button
                    onClick={() => deletePlant(plant.id)}
                    className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Hapus tanaman"
                  >
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Add Plant */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Tambah Koleksi Tanaman Baru">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nama Tanaman</label>
            <input
              type="text"
              required
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Contoh: Monstera Deliciosa, Lidah Mertua"
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Spesies / Varietas</label>
              <input
                type="text"
                value={speciesOrVariety}
                onChange={(e) => setSpeciesOrVariety(e.target.value)}
                placeholder="Epipremnum aureum"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Lokasi Penempatan</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Ruang Tamu">Ruang Tamu</option>
                <option value="Balkon / Teras">Balkon / Teras</option>
                <option value="Kamar Tidur">Kamar Tidur</option>
                <option value="Halaman Depan">Halaman Depan</option>
                <option value="Dapur">Dapur</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Interval Siram (Hari Sekali)</label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={wateringIntervalDays}
                onChange={(e) => setWateringIntervalDays(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Kebutuhan Sinar Matahari</label>
              <select
                value={sunlightNeed}
                onChange={(e) => setSunlightNeed(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Cahaya Terang Tidak Langsung">Cahaya Terang Tidak Langsung</option>
                <option value="Cahaya Rendah">Cahaya Rendah</option>
                <option value="Matahari Penuh">Matahari Penuh</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Catatan Tambahan (Pupuk, Media Tanam)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Media sekam bakar + perlite, pupuk NPK tiap bulan"
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
              Simpan Tanaman
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
