import React, { useState } from 'react';
import { usePEH } from '../../../context/PEHContext';
import { PetCareItem } from '../../../types';
import { Icon } from '../../common/Icon';
import { EmptyState } from '../../common/EmptyState';
import { Modal } from '../../common/Modal';

export const PetCareApp: React.FC = () => {
  const { pets, addPet, updatePetWeight, deletePet, activeSubMenu, setActiveSubMenu } = usePEH();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states
  const [petName, setPetName] = useState('');
  const [animalType, setAnimalType] = useState<PetCareItem['animalType']>('Kucing');
  const [breedOrVariety, setBreedOrVariety] = useState('');
  const [birthOrAdoptDate, setBirthOrAdoptDate] = useState('2024-01-10');
  const [weightKg, setWeightKg] = useState<number>(4.2);
  const [vaccinationStatus, setVaccinationStatus] = useState<PetCareItem['vaccinationStatus']>('Lengkap & Terupdate');
  const [nextVetVisitDate, setNextVetVisitDate] = useState('');
  const [microchipOrTagNumber, setMicrochipOrTagNumber] = useState('');
  const [favoriteFoodAndNotes, setFavoriteFoodAndNotes] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim()) return;

    addPet({
      petName: petName.trim(),
      animalType,
      breedOrVariety: breedOrVariety.trim() || undefined,
      birthOrAdoptDate,
      weightKg: Number(weightKg) || 1,
      vaccinationStatus,
      nextVetVisitDate: nextVetVisitDate || undefined,
      microchipOrTagNumber: microchipOrTagNumber.trim() || undefined,
      favoriteFoodAndNotes: favoriteFoodAndNotes.trim() || undefined,
    });

    setPetName('');
    setBreedOrVariety('');
    setMicrochipOrTagNumber('');
    setFavoriteFoodAndNotes('');
    setIsAddModalOpen(false);
  };

  const pendingVaccinesCount = pets.filter((p) => p.vaccinationStatus !== 'Lengkap & Terupdate').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Icon name="Heart" size={16} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Hewan Peliharaan & Anabul
            </h1>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Profil kucing/anjing keluarga, jadwal vaksinasi, berat badan, dan kartu rekam dokter hewan.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <Icon name="Plus" size={14} />
          <span>Daftarkan Anabul</span>
        </button>
      </div>

      {/* Sub-menus */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 text-xs">
        <button
          onClick={() => setActiveSubMenu('pets')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'pets'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="Heart" size={14} />
          <span>Profil Anabul ({pets.length})</span>
        </button>
        <button
          onClick={() => setActiveSubMenu('vaccination')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubMenu === 'vaccination'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          <Icon name="ShieldAlert" size={14} />
          <span>Jadwal Vaksin & Vet</span>
        </button>
      </div>

      {/* Interactive Feature: Vaccination Alert Banner */}
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
            <Icon name="ShieldCheck" size={18} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Status Imunisasi & Rekam Medis</h4>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
              {pendingVaccinesCount > 0
                ? `${pendingVaccinesCount} hewan memerlukan pengecekan jadwal vaksin berkala atau ke dokter hewan.`
                : 'Seluruh vaksinasi rabies & tahunan anabul keluarga tercatat mutakhir.'}
            </p>
          </div>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {pets.length} Peliharaan
        </div>
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <EmptyState
          iconName="Heart"
          title="Belum Ada Hewan Peliharaan"
          description="Buku silsilah anabul Anda masih bersih tanpa data dummy. Daftarkan kucing ras/domestik, anjing setia, atau hewan peliharaan Anda."
          actionLabel="Daftarkan Hewan Pertama"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {p.animalType} {p.breedOrVariety && `• ${p.breedOrVariety}`}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.vaccinationStatus === 'Lengkap & Terupdate'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                    }`}
                  >
                    {p.vaccinationStatus}
                  </span>
                </div>

                <h3 className="text-base font-bold text-neutral-900 dark:text-white">{p.petName}</h3>

                <div className="space-y-1.5 text-xs text-neutral-500 border-t border-neutral-100 dark:border-neutral-800 pt-2 my-3">
                  <div className="flex justify-between">
                    <span>Berat Badan:</span>
                    <strong className="text-neutral-900 dark:text-white">{p.weightKg} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Tanggal Lahir / Adopsi:</span>
                    <span>{p.birthOrAdoptDate}</span>
                  </div>
                  {p.nextVetVisitDate && (
                    <div className="flex justify-between">
                      <span>Jadwal Dokter Berikutnya:</span>
                      <span className="text-emerald-600 font-semibold">{p.nextVetVisitDate}</span>
                    </div>
                  )}
                  {p.microchipOrTagNumber && (
                    <div className="flex justify-between">
                      <span>Nomor Kalung / Microchip:</span>
                      <span className="font-mono">{p.microchipOrTagNumber}</span>
                    </div>
                  )}
                  {p.favoriteFoodAndNotes && (
                    <p className="text-[11px] text-neutral-400 pt-1 italic">
                      Makanan / Kebiasaan: {p.favoriteFoodAndNotes}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updatePetWeight(p.id, Number((p.weightKg + 0.1).toFixed(1)))}
                    className="px-2 py-1 text-[10px] rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                  >
                    +0.1 Kg
                  </button>
                  <button
                    onClick={() => updatePetWeight(p.id, Math.max(0.1, Number((p.weightKg - 0.1).toFixed(1))))}
                    className="px-2 py-1 text-[10px] rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 font-medium cursor-pointer"
                  >
                    -0.1 Kg
                  </button>
                </div>

                <button
                  onClick={() => deletePet(p.id)}
                  className="p-1 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Hapus rekaman"
                >
                  <Icon name="Trash2" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add Pet */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Daftarkan Hewan Peliharaan">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Nama Panggilan Anabul</label>
              <input
                type="text"
                required
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Contoh: Mochi, Milo, Belang"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Jenis Hewan</label>
              <select
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Kucing">Kucing</option>
                <option value="Anjing">Anjing</option>
                <option value="Burung">Burung</option>
                <option value="Ikan">Ikan</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Ras / Varietas</label>
              <input
                type="text"
                value={breedOrVariety}
                onChange={(e) => setBreedOrVariety(e.target.value)}
                placeholder="British Shorthair, Golden Retriever"
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Berat Badan (Kg)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Status Vaksin</label>
              <select
                value={vaccinationStatus}
                onChange={(e) => setVaccinationStatus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="Lengkap & Terupdate">Lengkap & Terupdate</option>
                <option value="Ada Jadwal Vaksin">Ada Jadwal Vaksin</option>
                <option value="Belum Vaksin">Belum Vaksin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Tanggal Lahir / Adopsi</label>
              <input
                type="date"
                required
                value={birthOrAdoptDate}
                onChange={(e) => setBirthOrAdoptDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Jadwal Kontrol Vet Terdekat</label>
            <input
              type="date"
              value={nextVetVisitDate}
              onChange={(e) => setNextVetVisitDate(e.target.value)}
              className="w-full px-3 py-2 text-xs border rounded-lg bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Makanan Favorit & Alergi</label>
            <input
              type="text"
              value={favoriteFoodAndNotes}
              onChange={(e) => setFavoriteFoodAndNotes(e.target.value)}
              placeholder="Contoh: Royal Canin Hair & Skin, alergi ayam potong"
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
              Simpan Anabul
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
